"""
shinhancard_popup_scraper.py

동작: card_links.txt의 각 URL을 방문하여 summary 화면의 "레이어 열기" 버튼들을 클릭,
      팝업 요소를 감지하여 스크린샷 → OCR → 규칙 기반 파싱 → card_benefits.csv에 저장.
"""

import os, time, re, csv, logging
from io import BytesIO
from tqdm import tqdm
import cv2, numpy as np
from PIL import Image
import pandas as pd

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import (
    ElementClickInterceptedException, StaleElementReferenceException,
    ElementNotInteractableException, TimeoutException, JavascriptException
)
from webdriver_manager.chrome import ChromeDriverManager
import pytesseract

# ------------- CONFIG -------------
# 스크립트의 실제 위치를 기준으로 경로를 설정합니다.
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)

INPUT_FILE = os.path.join(SCRIPT_DIR, "card_links.txt")
OUTPUT_CSV = os.path.join(SCRIPT_DIR, "card_benefits.csv")
SCREENSHOT_DIR = os.path.join(SCRIPT_DIR, "popup_screenshots")
# 로그 파일은 프로젝트 루트 디렉토리에 저장합니다.
LOG_FILE = os.path.join(PROJECT_ROOT, "scrape.log")

# OCR 엔진: 'tesseract' (기본) 또는 'easyocr' (옵션; 더 정확하지만 무거움)
OCR_ENGINE = "tesseract"

# Tesseract 실행파일 경로 (Windows 등에서 직접 지정 필요)
# 예: pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
# Linux/WSL/Container에서는 기본 경로를 사용하면 됩니다.
# Uncomment and set if needed:
# pytesseract.pytesseract.tesseract_cmd = r"/usr/bin/tesseract"

# 크롬 옵션
HEADLESS = False
IMPLICIT_WAIT = 2  # seconds
CLICK_DELAY = 0.8

# 브랜드 사전(필요시 확장)
BRANDS = [
    "스타벅스","투썸플레이스","폴바셋","커피빈","메가커피","이디야",
    "CU","GS25","세븐일레븐","이마트24",
    "배달의민족","요기요","쿠팡이츠","땡겨요",
    "스타벅스 리저브", "Baskin", "맘스터치", "롯데리아"
]
# 카테고리 매핑(브랜드 못찾을 때 활용)
CATEGORIES = ["카페","음식점","편의점","배달앱","주유","병원","약국","온라인","영화","마트"]

# -----------------------------------

os.makedirs(SCREENSHOT_DIR, exist_ok=True)
logging.basicConfig(filename=LOG_FILE, level=logging.INFO,
                    format="%(asctime)s [%(levelname)s] %(message)s")
console = logging.getLogger()
console.setLevel(logging.INFO)

# ----------------- 유틸리티 함수 -----------------

# ----------------------------------------

def setup_driver():
    opts = webdriver.ChromeOptions()
    if HEADLESS:
        opts.add_argument("--headless=new")
    opts.add_argument("--no-sandbox")
    opts.add_argument("--disable-dev-shm-usage")
    return webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=opts)

# ---------- 안전한 클릭 ----------
def safe_click(driver, element, timeout=5):
    try:
        driver.execute_script("arguments[0].scrollIntoView({block:'center'});", element)
    except: pass
    try:
        WebDriverWait(driver, timeout).until(lambda d: element.is_displayed() and element.is_enabled())
    except TimeoutException:
        logging.debug("element not interactable after wait")

    try:
        element.click(); return True
    except (ElementClickInterceptedException, StaleElementReferenceException, ElementNotInteractableException):
        pass
    try:
        driver.execute_script("arguments[0].click();", element); return True
    except: pass
    try:
        webdriver.ActionChains(driver).move_to_element(element).click().perform(); return True
    except: pass

    ts = int(time.time()*1000)
    path = os.path.join(SCREENSHOT_DIR, f"click_fail_{ts}.png")
    try: driver.save_screenshot(path)
    except: pass
    logging.warning(f"Click failed; screenshot: {path}")
    return False

# ---------- 팝업 탐지 ----------
def js_find_top_popup(driver):
    script = """
    var els = Array.from(document.querySelectorAll('body *'));
    var candidates = [];
    for (var i=0;i<els.length;i++) {
      var e = els[i]; var s = window.getComputedStyle(e);
      if (!s) continue;
      if (s.display==='none'||s.visibility==='hidden'||parseFloat(s.opacity||1)<0.05) continue;
      var rect=e.getBoundingClientRect();
      if (rect.width<120||rect.height<40) continue;
      if (e.getAttribute && (e.getAttribute('role')==='dialog'||e.getAttribute('aria-modal')==='true'))
        {candidates.push(e); continue;}
      var cls=(e.className||'').toString().toLowerCase();
      if (cls.indexOf('popup')>=0||cls.indexOf('modal')>=0||cls.indexOf('layer')>=0||cls.indexOf('dim')>=0)
        {candidates.push(e); continue;}
      if (s.position==='fixed'||s.position==='absolute') candidates.push(e);
    }
    if (candidates.length===0) return null;
    candidates.sort((a,b)=>{
      var za=parseInt(window.getComputedStyle(a).zIndex)||0;
      var zb=parseInt(window.getComputedStyle(b).zIndex)||0;
      return zb-za;
    });
    return candidates[0];
    """
    try: return driver.execute_script("return ("+script+")();")
    except JavascriptException: return None

def take_element_screenshot(driver, element, save_path):
    try:
        element.screenshot(save_path)
    except:
        png = driver.get_screenshot_as_png()
        im = Image.open(BytesIO(png))
        loc = element.location_once_scrolled_into_view
        size = element.size
        crop = im.crop((int(loc['x']), int(loc['y']),
                        int(loc['x'])+int(size['width']), int(loc['y'])+int(size['height'])))
        crop.save(save_path)

# ---------- OCR + 파싱 ----------
def preprocess_for_ocr(img_path):
    img = cv2.imread(img_path); gray=cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    th = cv2.adaptiveThreshold(gray,255,cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                               cv2.THRESH_BINARY,11,2)
    return Image.fromarray(th)

def ocr_tesseract(img_path):
    pil = preprocess_for_ocr(img_path)
    return pytesseract.image_to_string(pil, lang="kor+eng")

def normalize_percent(s):
    s=s.replace("퍼센트","%").replace("％","%")
    m=re.search(r'(\d+(?:[.,]\d+)?)\s*%', s)
    if m: return m.group(1)+"%"
    return None

def parse_benefits_from_text(text):
    results=[]
    for line in text.splitlines():
        line=line.strip()
        if not line: continue
        rate=normalize_percent(line) or ""
        kind="적립" if "적립" in line else "할인" if "할인" in line else "캐시백" if "캐시백" in line else ""
        found=[b for b in BRANDS if b in line]
        if found:
            for b in found: results.append((b,kind,rate))
        else:
            for c in CATEGORIES:
                if c in line and rate:
                    results.append((c,kind or "할인",rate))
    uniq=[]
    for r in results:
        if r not in uniq: uniq.append(r)
    return uniq

# ---------- 메인 ----------
def main():
    driver = setup_driver()
    if not os.path.exists(OUTPUT_CSV):
        with open(OUTPUT_CSV,'w',newline='',encoding='utf-8-sig') as f:
            csv.writer(f).writerow(["source_url","card_name","service_button","brand","type","rate","screenshot","ocr_snippet"])

    with open(INPUT_FILE,encoding="utf-8") as f: urls=[u.strip() for u in f if u.strip()]

    for url in tqdm(urls):
        try:
            driver.get(url); time.sleep(1)
            card_name=driver.title.strip()
            buttons=driver.find_elements(By.XPATH,"//button[contains(@onclick,'openPopBenefitDetail')]")
            for idx,btn in enumerate(buttons):
                if not safe_click(driver,btn): continue
                time.sleep(CLICK_DELAY)
                popup=js_find_top_popup(driver)
                if popup:
                    fname=f"{card_name[:20]}_{idx}.png".replace("/","_")
                    path=os.path.join(SCREENSHOT_DIR,fname)
                    take_element_screenshot(driver,popup,path)
                    ocr_text=ocr_tesseract(path)
                else:
                    path=os.path.join(SCREENSHOT_DIR,f"{card_name[:20]}_{idx}_full.png")
                    driver.save_screenshot(path)
                    ocr_text=ocr_tesseract(path)
                benefits=parse_benefits_from_text(ocr_text)
                if not benefits: benefits=[("","","")]
                with open(OUTPUT_CSV,'a',newline='',encoding='utf-8-sig') as f:
                    w=csv.writer(f)
                    for b in benefits:
                        w.writerow([url,card_name,btn.text.strip(),b[0],b[1],b[2],path,ocr_text[:100]])
                # 팝업 닫기 (ESC)
                try: webdriver.ActionChains(driver).send_keys(Keys.ESCAPE).perform()
                except: pass
        except Exception as e:
            logging.exception(f"URL fail: {url} {e}")
            try: driver.quit()
            except: pass
            driver=setup_driver()
            continue
    driver.quit()

if __name__=="__main__":
    main()