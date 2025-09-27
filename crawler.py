import time
import csv
import re
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup

# ✅ 크롬드라이버 경로 (사용자 지정)
CHROMEDRIVER_PATH = "/Applications/card_crawler/chromedriver-mac-x64/chromedriver"

# ✅ 크롤링할 사이트
BASE_URL = "https://www.card-gorilla.com/card"

def init_driver():
    options = webdriver.ChromeOptions()
    options.add_argument("--headless=new")   # 창 안뜨게
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    service = Service(CHROMEDRIVER_PATH)
    driver = webdriver.Chrome(service=service, options=options)
    return driver

# ✅ "더보기" 버튼이 사라질 때까지 반복 클릭
def click_all_more(driver):
    while True:
        try:
            more_btn = WebDriverWait(driver, 3).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, "a.lst_more"))
            )
            driver.execute_script("arguments[0].click();", more_btn)
            print("[DEBUG] 더보기 버튼 클릭")
            time.sleep(2)
        except:
            print("[DEBUG] 더보기 버튼 없음 (마지막 페이지 도달)")
            break

# ✅ 카드 목록 수집
def get_card_list(driver):
    driver.get(BASE_URL)
    time.sleep(2)
    click_all_more(driver)

    html = driver.page_source
    soup = BeautifulSoup(html, "html.parser")
    card_elems = soup.select("li[data-v-e6703b60] a")

    cards = []
    for elem in card_elems:
        link = elem.get("href")
        name = elem.get_text(strip=True)
        if not link or not name:
            continue
        if not link.startswith("http"):
            link = "https://www.card-gorilla.com" + link
        cards.append((name, link))

    print(f"[INFO] 수집된 카드 수: {len(cards)}")
    return cards

# ✅ 상세 페이지에서 혜택 파싱
def get_card_benefits(driver, url):
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
            if benefit_text:
                print(f"  [DEBUG] 혜택 추출됨: {benefit_text}")
                benefits.append(benefit_text)

        if not benefits:
            print(f"  [DEBUG] 혜택 추출 실패 (dl은 있었으나 텍스트 없음): {url}")
            return None

        return " | ".join(benefits)

    except Exception as e:
        print(f"  [ERROR] 혜택 파싱 오류 ({url}): {e}")
        return None

# ✅ 메인 실행
def main():
    driver = init_driver()
    cards = get_card_list(driver)

    results = []
    for idx, (name, url) in enumerate(cards, start=1):
        print(f"[{idx}/{len(cards)}] {name} -> {url}")
        benefits = get_card_benefits(driver, url)
        if not benefits:
            print(f"  -> 혜택 없음 또는 파싱 실패: {name}")
        results.append([name, url, benefits if benefits else "N/A"])

    # CSV 저장
    with open("card_gorilla_benefits.csv", "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.writer(f)
        writer.writerow(["카드명", "상세링크", "혜택"])
        writer.writerows(results)

    driver.quit()
    print(f"[완료] {len(results)}개 카드 저장 -> card_gorilla_benefits.csv")

if __name__ == "__main__":
    main()
