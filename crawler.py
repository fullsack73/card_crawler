import csv
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup


URL = "https://www.card-gorilla.com/card?cate=CRD"
OUTPUT_FILE = "card_gorilla_benefits.csv"

# 크롬 옵션 설정
chrome_options = Options()
chrome_options.add_argument("--headless=new")  # 백그라운드 실행
chrome_options.add_argument("--no-sandbox")
chrome_options.add_argument("--disable-dev-shm-usage")

service = Service("/Applications/card_crawler/chromedriver-mac-x64/chromedriver")  # 환경에 맞게 chromedriver 경로 지정
driver = webdriver.Chrome(service=service, options=chrome_options)


def get_cards():
    """메인 페이지에서 카드 목록을 가져오기"""
    driver.get(URL)
    time.sleep(3)

    try:
        cards = driver.find_elements(By.CSS_SELECTOR, "div.card-container")
        print(f"찾은 카드 블록 수: {len(cards)}")
        return cards
    except Exception as e:
        print("카드 탐색 실패:", e)
        return []


def scrape_card(card_elem, idx):
    """개별 카드에서 '자세히 보기' 눌러 혜택 추출"""
    try:
        # 카드 안의 '자세히 보기' 버튼 찾기
        detail_btn = card_elem.find_element(By.XPATH, ".//button[contains(text(),'자세히보기')] | .//a[contains(text(),'자세히보기')]")
        driver.execute_script("arguments[0].click();", detail_btn)

        # 새로운 팝업 또는 모달이 열릴 때까지 대기
        WebDriverWait(driver, 5).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "div.modal, div.popup, div.card-detail"))
        )
        time.sleep(1)

        # 현재 페이지 소스 파싱
        soup = BeautifulSoup(driver.page_source, "html.parser")

        # 혜택 텍스트 추출
        benefits = []
        for b in soup.select("div.modal, div.popup, div.card-detail"):
            benefits.append(b.get_text(separator=" ", strip=True))

        benefit_text = " | ".join(benefits) if benefits else "N/A"

        # 닫기 버튼 클릭 (팝업 닫기)
        try:
            close_btn = driver.find_element(By.XPATH, "//button[contains(text(),'닫기')] | //button[contains(@class,'close')]")
            driver.execute_script("arguments[0].click();", close_btn)
        except Exception:
            pass

        return benefit_text

    except Exception as e:
        print(f"[{idx}] 카드 상세 크롤링 실패:", e)
        return "N/A"


def main():
    cards = get_cards()
    results = []

    for idx, card in enumerate(cards, 1):
        print(f"[{idx}] 카드 처리 중...")

        benefit_text = scrape_card(card, idx)

        results.append({
            "카드번호": idx,
            "혜택": benefit_text
        })

        # 카드 간 대기
        time.sleep(1)

    # CSV 저장
    with open(OUTPUT_FILE, "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(f, fieldnames=["카드번호", "혜택"])
        writer.writeheader()
        writer.writerows(results)

    print(f"완료. {len(results)}개 카드 저장 -> {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
    driver.quit()
