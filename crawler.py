import csv
import time
import re
from urllib.parse import urljoin

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import (
    NoSuchElementException,
    StaleElementReferenceException,
    TimeoutException,
    ElementClickInterceptedException,
)
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup

# --------- 설정 영역 ----------
CHROMEDRIVER_PATH = "/Applications/card_crawler/chromedriver-mac-x64/chromedriver"
BASE_URL = "https://www.card-gorilla.com"
START_URL = "https://www.card-gorilla.com/card?cate=CRD"
OUTPUT_CSV = "card_gorilla_benefits.csv"
HEADLESS = True           # 디버그 시 False 로 바꿔 보세요
SCROLL_PAUSE = 1.0
MORE_CLICK_TIMEOUT = 10   # 더보기 클릭 후 새 항목이 로드될 최대 대기 (초)
MAX_MORE_CLICKS = 1000    # 안전장치: 너무 많이 클릭되지 않도록
# -------------------------------

def make_driver(headless=HEADLESS):
    opts = Options()
    if headless:
        opts.add_argument("--headless=new")
    opts.add_argument("--window-size=1400,1000")
    opts.add_argument("--no-sandbox")
    opts.add_argument("--disable-dev-shm-usage")
    service = Service(CHROMEDRIVER_PATH)
    driver = webdriver.Chrome(service=service, options=opts)
    return driver

def scroll_into_view(driver, el):
    driver.execute_script("arguments[0].scrollIntoView({block:'center', inline:'nearest'});", el)

def click_element_js(driver, el):
    try:
        driver.execute_script("arguments[0].click();", el)
        return True
    except Exception:
        try:
            el.click()
            return True
        except Exception:
            return False

def click_load_more_until_gone(driver):
    """페이지의 '더보기' (a.lst_more)를 더 이상 찾을 수 없을 때까지 반복 클릭"""
    wait = WebDriverWait(driver, 5)
    clicks = 0

    # 초기 카드 수
    try:
        initial_count = len(driver.find_elements(By.CSS_SELECTOR, "div.card-container"))
    except Exception:
        initial_count = 0

    while clicks < MAX_MORE_CLICKS:
        try:
            more = driver.find_element(By.CSS_SELECTOR, "a.lst_more")
        except NoSuchElementException:
            print("더보기 링크 없음 — 모두 로드된 것으로 판단합니다.")
            break

        # 보이지만 클릭 불가하거나 overlay 등으로 가려지는 경우에 대비
        if not more.is_displayed():
            print("더보기 링크이지만 보이지 않음 -> 종료")
            break

        clicks += 1
        print(f"[더보기 클릭] 시도 #{clicks} — 현재 카드 수: {initial_count}")

        try:
            scroll_into_view(driver, more)
            time.sleep(0.2)
            # JS 클릭 시도
            click_element_js(driver, more)
        except (StaleElementReferenceException, ElementClickInterceptedException) as e:
            print("  클릭 중 예외:", type(e).__name__, "-", e)
            time.sleep(0.6)
            continue

        # 클릭 후 카드 개수가 증가할 때까지 기다림 (또는 더보기 자체가 사라질 때)
        try:
            def count_increased(drv):
                cur = len(drv.find_elements(By.CSS_SELECTOR, "div.card-container"))
                return cur > initial_count

            WebDriverWait(driver, MORE_CLICK_TIMEOUT).until(count_increased)
            new_count = len(driver.find_elements(By.CSS_SELECTOR, "div.card-container"))
            print(f"  로드 완료 — 카드 수 증가: {initial_count} -> {new_count}")
            initial_count = new_count
            # 잠시 쉬고 다음 반복
            time.sleep(0.6)
            continue

        except TimeoutException:
            # 증가가 없거나 더이상 로드되지 않음 — 더보기 링크가 제거되었거나 정적인 경우일 수 있음
            # 만약 더보기 링크가 여전히 존재하면 계속 시도, 아니면 break
            try:
                # 재조회해서 더보기 남아있는지 확인
                more2 = driver.find_element(By.CSS_SELECTOR, "a.lst_more")
                if more2.is_displayed():
                    print("  경고: 카드 수 증가가 없었지만 더보기는 남아있음 (타임아웃). 계속 시도합니다.")
                    time.sleep(1.0)
                    continue
                else:
                    print("  더보기 사라짐 -> 종료")
                    break
            except NoSuchElementException:
                print("  더보기 사라짐 -> 종료")
                break
            except StaleElementReferenceException:
                print("  더보기 요소가 stale -> 재시도")
                time.sleep(0.5)
                continue

    print(f"더보기 클릭 루프 종료 (총 시도: {clicks})")
    return

def collect_card_links(driver):
    """모든 카드를 로드한 후 각 카드의 (이름, 상세절 링크) 리스트를 반환"""
    cards = driver.find_elements(By.CSS_SELECTOR, "div.card-container")
    print(f"총 수집된 카드 블록 수: {len(cards)}")
    infos = []
    for idx, c in enumerate(cards, 1):
        try:
            name_el = c.find_element(By.CSS_SELECTOR, "div.name")
            name = name_el.text.strip()
        except Exception:
            name = ""
        try:
            link_el = c.find_element(By.CSS_SELECTOR, "a.b_view")
            href = link_el.get_attribute("href")
            if href:
                full = urljoin(BASE_URL, href)
            else:
                full = ""
        except Exception:
            full = ""
        if full:
            infos.append((name, full))
        else:
            # 만약 카드 내부에서 상세를 찾지 못하면 skip
            print(f"  [{idx}] 상세 링크 없음: {name}")
    return infos

# 정규식 기반 혜택 파서
PERCENT_RE = re.compile(r"(\d+(?:\.\d+)?\s*%)")
WON_RE = re.compile(r"((?:\d{1,3}(?:,\d{3})+|\d+)\s*원|리터당\s*\d+\s*원)")
TYPE_RE = re.compile(r"(할인|적립|캐시백)")

def parse_detail_page_by_regex(driver, card_name, detail_url):
    try:
        driver.get(url)
        time.sleep(2)

        html = driver.page_source
        soup = BeautifulSoup(html, "html.parser")

        benefit_area = soup.select_one("article.cmd_con.benefit")
        if not benefit_area:
            print(f"  [DEBUG] 혜택 영역 못 찾음: {url}")
            return None

        benefits = []
        dls = benefit_area.select("dl")
        print(f"  [DEBUG] 혜택 dl 개수: {len(dls)} ({url})")

        for dl in dls:
            category = dl.select_one("p.txt1")
            detail = dl.select_one("i")

            cat_text = category.get_text(strip=True) if category else ""
            det_text = detail.get_text(strip=True) if detail else ""

            benefit_text = f"{cat_text}: {det_text}" if det_text else cat_text
            print(f"  [DEBUG] 혜택 추출됨: {benefit_text}")
            benefits.append(benefit_text)

        if not benefits:
            print(f"  [DEBUG] 혜택 추출 실패 (dl은 있었으나 텍스트 없음): {url}")
            return None

        return " | ".join(benefits)

    except Exception as e:
        print(f"  [ERROR] 혜택 파싱 오류 ({url}): {e}")
        return None

def main():
    driver = make_driver()
    wait = WebDriverWait(driver, 6)
    try:
        print("시작: 메인 페이지 로드...")
        driver.get(START_URL)
        # 페이지 초기 로드 대기
        time.sleep(2)

        # "더보기" 연속 클릭으로 모든 카드 로드
        click_load_more_until_gone(driver)

        # 카드 링크 수집
        card_infos = collect_card_links(driver)
        print(f"수집된 카드 수 (상세링크 포함): {len(card_infos)}")

        all_rows = []
        for idx, (card_name, link) in enumerate(card_infos, 1):
            print(f"[{idx}/{len(card_infos)}] {card_name} -> {link}")
            try:
                rows = parse_detail_page_by_regex(driver, card_name, link)
                if rows:
                    all_rows.extend(rows)
                else:
                    # 실패했을 때 빈행 한줄이라도 남기고 넘어갈지 결정
                    # 여기서는 스킵
                    print(f"  -> 혜택 없음 또는 파싱 실패: {card_name}")
                # 페이지 요청 사이에 과도한 부하 방지
                time.sleep(0.4)
            except Exception as e:
                print("  상세 파싱 중 예외:", e)
                time.sleep(0.4)
                continue

        # CSV 저장
        fieldnames = ["카드명", "종목", "값", "혜택종류", "설명원문", "상세URL"]
        with open(OUTPUT_CSV, "w", newline="", encoding="utf-8-sig") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(all_rows)

        print(f"완료. 총 혜택 항목 수: {len(all_rows)} -> {OUTPUT_CSV}")

    finally:
        driver.quit()

if __name__ == "__main__":
    main()
