//일반 : "/pconts/html/redirect/cardReDir1.html"
//상품공시실 : "/pconts/html/redirect/cardReDir2.html"
if(document.URL.indexOf('.html')>-1){  //  .html 일때만 실행
	// 정보( 페이지명, 기존주소, 이동될 주소)
	var dxRedirCard=[

		{
			"name" : "산림조합 Deep Dream Platinum+",
			"rURL" : "/pconts/html/card/apply/credit/1229705_2207.html",
			"newURL" : "/pconts/html/redirect/cardReDir3.html"
		},

		{
			"name" : "신협 신한카드 Hi-Point",
			"rURL" : "/pconts/html/card/apply/credit/1229613_2207.html",
			"newURL" : "/pconts/html/redirect/cardReDir3.html"
		},

		{
			"name" : "ShinhanCard Foreigner-only Loan",
			"rURL" : "/pconts/html/finance/generalLoan/foreignerLoan/en/MOBFM380R03.html",
			"newURL" : "/pconts/html/redirect/cardReDir3.html"
		},

		{
			"name" : "금융주소 한번에 서비스",
			"rURL" : "/pconts/html/myPage/myInfo/MOBFM04031/refer/MOBFM04031R03.html",
			"newURL" : "/error/404error.html"
		},

		{
			"name" : "",
			"rURL" : "/pconts/html/benefit/event/1230579_2239.html",
			"newURL" : "/pconts/html/benefit/event/1224997_2239.html"
		},

		{
			"name" : "이벤트",
			"rURL" : "/pconts/html/benefit/event/1230578_2239.html",
			"newURL" : "/pconts/html/benefit/event/1229499_2239.html"
		},

		{
			"name" : "TMON x 신한카드 X5 통합 시즌권 구매 시 캐시백 혜택 안내(히든)",
			"rURL" : "/pconts/html/benefit/event/1225382_2239.html",
			"newURL" : "/pconts/html/redirect/cardReDir1.html"
		},

		{
			"name" : "TMON x 신한카드 X5 통합 시즌권 구매 시 캐시백 혜택 안내(히든)",
			"rURL" : "/pconts/html/benefit/event/1224995_2239.html",
			"newURL" : "/pconts/html/redirect/cardReDir1.html"
		},

		{
			"name" : "TMON x 신한카드 X5 통합 시즌권 구매 시 캐시백 혜택 안내(히든)",
			"rURL" : "/pconts/html/benefit/event/1224878_2239.html",
			"newURL" : "/pconts/html/redirect/cardReDir1.html"
		},

		{
			"name" : "TMON x 신한카드 X5 통합 시즌권 구매 시 캐시백 혜택 안내(히든)",
			"rURL" : "/pconts/html/benefit/event/1224453_2239.html",
			"newURL" : "/pconts/html/redirect/cardReDir1.html"
		},

		{
			"name" : "TMON x 신한카드 X5 통합 시즌권 구매 시 캐시백 혜택 안내(히든)",
			"rURL" : "/pconts/html/benefit/event/1224160_2239.html",
			"newURL" : "/pconts/html/redirect/cardReDir1.html"
		},

		{
			"name" : "해외이의신청",
			"rURL" : "/pconts/html/helpdesk/totalService/MOBFM12552/MOBFM12552J/MOBFM12552R14.html",
			"newURL" : "/pconts/html/helpdesk/consumer/MOBFM12552R14/MOBFM12552R14R01.html"
		},

		{
			"name" : "신한카드 Pick E 선불(김천중 학생증카드)",
			"rURL" : "/pconts/html/card/apply/prepaid/1224989_2387.html",
			"newURL" : "/pconts/html/card/apply/prepaid/1225211_2387.html"
		},

		{
			"name" : "보리페이 이벤트",
			"rURL" : "/pconts/html/benefit/event/1226413_2239.html",
			"newURL" : "/pconts/html/main.html"
		},

		{
			"name" : "신한카드 Pick E 선불(천천중 학생증카드)",
			"rURL" : "/pconts/html/card/apply/prepaid/1225078_2387.html",
			"newURL" : "/pconts/html/redirect/cardReDir3.html"
		},

		{
			"name" : "신한카드 Pick E 체크(천천중 학생증카드)",
			"rURL" : "/pconts/html/card/apply/check/1225083_2206.html",
			"newURL" : "/pconts/html/redirect/cardReDir3.html"
		},

		{
			"name" : "신한카드 봄 체크(도구리)",
			"rURL" : "/pconts/html/card/apply/check/1223605_2206.html",
			"newURL" : "/pconts/html/card/apply/check/1221136_2206.html"
		},

		{
			"name" : "신한카드 봄(도구리)",
			"rURL" : "/pconts/html/card/apply/credit/1223604_2207.html",
			"newURL" : "/pconts/html/card/apply/credit/1221135_2207.html"
		},

		{
			"name" : "신한 Meme(밈) LoL",
			"rURL" : "/pconts/html/card/apply/prepaid/1217224_2387.html",
			"newURL" : "/pconts/html/redirect/cardReDir3.html"
		},

		{
			"name" : "신한smart결제 ",
			"rURL" : "/pconts/html/life/payment/smartPay/MOBFM07006R01.html",
			"newURL" : "/pconts/html/redirect/cardReDir3.html"
		},

		{
			"name" : "노머니노아트",
			"rURL" : "/pconts/html/card/designCard/MOBFM661/MOBFM661R01.html",
			"newURL" : "/pconts/html/card/character/MOBFM700R01.html"
		},

		{
			"name" : "시그니처카드",
			"rURL" : "/pconts/html/card/designCard/MOBFM283/MOBFM283R01.html",
			"newURL" : "/pconts/html/redirect/cardReDir3.html"
		},

		{
			"name" : "캐릭터카드(구) ",
			"rURL" : "/pconts/html/card/designCard/MOBFM285/MOBFM285R01.html",
			"newURL" : "/pconts/html/card/character/MOBFM700R01.html"
		},

		{
			"name" : "신한카드 최대 16만원 캐시백 이벤트",
			"rURL" : "/pconts/html/benefit/event/1222269_2239.html",
			"newURL" : "/pconts/html/redirect/cardReDir3.html"
		},

		{
			"name" : "신한카드 최대 16만원 캐시백 이벤트",
			"rURL" : "/pconts/html/benefit/event/1222268_2239.html",
			"newURL" : "/pconts/html/redirect/cardReDir3.html"
		},

		{
			"name" : "신한카드 최대 16만원 캐시백 이벤트",
			"rURL" : "/pconts/html/benefit/event/1222264_2239.html",
			"newURL" : "/pconts/html/redirect/cardReDir3.html"
		},

		{
			"name" : "신한카드 최대 16만원 캐시백 이벤트",
			"rURL" : "/pconts/html/benefit/event/1222284_2239.html",
			"newURL" : "/pconts/html/redirect/cardReDir3.html"
		},

		{
			"name" : "스타벅스, 올리브영 등 할인받고 100% 당첨 룰렛까지~!",
			"rURL" : "/pconts/html/benefit/event/1221893_2239.html",
			"newURL" : "/pconts/html/redirect/cardReDir3.html"
		},

		{
			"name" : "기타대출 > 딥편한 대출",
			"rURL" : "/pconts/html/finance/otherLoan/deepLoan/MOBFM335R01.html",
			"newURL" : "/pconts/html/redirect/cardReDir3.html"
		},

		{
			"name" : "일반대출(신용대출) > 페이충전대출",
			"rURL" : "/pconts/html/finance/generalLoan/SpocketMoney/MOBFM505R01.html",
			"newURL" : "/pconts/html/redirect/cardReDir3.html"
		},

		{
			"name" : "일반대출(신용대출) > 아파트소유자대출",
			"rURL" : "/pconts/html/finance/generalLoan/aptLoan/MOBFM098R01.html",
			"newURL" : "/pconts/html/redirect/cardReDir3.html"
		},

		{
			"name" : "일반대출(신용대출) > 외국인 전용대출(한글)",
			"rURL" : "/pconts/html/finance/generalLoan/foreignerLoan/kr/MOBFM380R02.html",
			"newURL" : "/pconts/html/redirect/cardReDir3.html"
		},

		{
			"name" : "일반대출(신용대출) > 직장인대출",
			"rURL" : "/pconts/html/finance/generalLoan/workLoan/MOBFM095R01.html",
			"newURL" : "/pconts/html/redirect/cardReDir3.html"
		},

		{
			"name" : "오직 D-Club 회원만! 11만원 이용하고 11만원 다시 돌려받자!",
			"rURL" : "/pconts/html/benefit/event/1217423_2239.html",
			"newURL" : "/pconts/html/redirect/cardReDir3.html"
		},

		{
			"name" : "오직 D-Club 회원만 11만원 캐시백 받자!",
			"rURL" : "/pconts/html/benefit/event/1220128_2239.html",
			"newURL" : "/pconts/html/redirect/cardReDir3.html"
		},

		{
			"name" : "D-Club멤버십 혜택 지금 바로 응모하세요(히든)",
			"rURL" : "/pconts/html/benefit/event/1216503_2239.html",
			"newURL" : "/pconts/html/redirect/cardReDir3.html"
		},

		{
			"name" : "[디클럽 ]`23.2월 캐시백 이벤트 리다이렉트요청",
			"rURL" : "/pconts/html/benefit/event/1220550_2239.html",
			"newURL" : "/pconts/html/redirect/cardReDir3.html"
		},

		{
			"name" : "[FeeBiz챕터] 이벤트페이지 - 마이픽앤팩 서비스 가입 이벤트 제작 요청",
			"rURL" : "/pconts/html/benefit/event/1220176_2239.html",
			"newURL" : "/pconts/html/benefit/event/1220142_2239.html"
		},

		{
			"name" : "프레딧 멤버십 신한카드 런칭 15만원 캐시백 이벤트!",
			"rURL" : "/pconts/html/benefit/event/1218243_2239.html",
			"newURL" : "/pconts/html/main.html"
		},

		{
			"name" : "홈플러스 브릿지페이지",
			"rURL" : "/pconts/html/landing/homeplus_one.html",
			"newURL" : "/pconts/html/redirect/cardReDir3.html"
		},

		{
			"name" : "충주예성여자고등학교 신한 Meme(밈) 학생증 카드",
			"rURL" : "/pconts/html/card/apply/check/1216349_2206.html",
			"newURL" : "/pconts/html/card/apply/prepaid/1216349_2387.html"
		},

		{
			"name" : "청원고등학교 신한 Meme(밈) 학생증 카드",
			"rURL" : "/pconts/html/card/apply/check/1216348_2206.html",
			"newURL" : "/pconts/html/card/apply/prepaid/1216348_2387.html"
		},

		{
			"name" : "인창고등학교 신한 Meme(밈) 학생증 카드",
			"rURL" : "/pconts/html/card/apply/check/1216347_2206.html",
			"newURL" : "/pconts/html/card/apply/prepaid/1216347_2387.html"
		},

		{
			"name" : "양현고등학교 신한 Meme(밈) 학생증 카드",
			"rURL" : "/pconts/html/card/apply/check/1216346_2206.html",
			"newURL" : "/pconts/html/card/apply/prepaid/1216346_2387.html"
		},

		{
			"name" : "상서고등학교 신한 Meme(밈) 학생증 카드",
			"rURL" : "/pconts/html/card/apply/check/1216345_2206.html",
			"newURL" : "/pconts/html/card/apply/prepaid/1216345_2387.html"
		},

		{
			"name" : "경북기계금속고등학교 신한 Meme(밈) 학생증 카드",
			"rURL" : "/pconts/html/card/apply/check/1216343_2206.html",
			"newURL" : "/pconts/html/card/apply/prepaid/1216343_2387.html"
		},

		{
			"name" : "죽전고등학교 신한 Meme(밈) 학생증 카드",
			"rURL" : "/pconts/html/card/apply/check/1216289_2206.html",
			"newURL" : "/pconts/html/card/apply/prepaid/1216289_2387.html"
		},

		{
			"name" : "성지고등학교 신한 Meme(밈) 학생증 카드",
			"rURL" : "/pconts/html/card/apply/check/1216288_2206.html",
			"newURL" : "/pconts/html/card/apply/prepaid/1216288_2387.html"
		},

		{
			"name" : "충주여자고등학교 신한 Meme(밈) 학생증 카드",
			"rURL" : "/pconts/html/card/apply/check/1216282_2206.html",
			"newURL" : "/pconts/html/card/apply/prepaid/1216282_2387.html"
		},

		{
			"name" : "충주고등학교 신한 Meme(밈) 학생증 카드",
			"rURL" : "/pconts/html/card/apply/check/1216281_2206.html",
			"newURL" : "/pconts/html/card/apply/prepaid/1216281_2387.html"
		},

		{
			"name" : "성문고등학교 신한 Meme(밈) 학생증 카드",
			"rURL" : "/pconts/html/card/apply/check/1216280_2206.html",
			"newURL" : "/pconts/html/card/apply/prepaid/1216280_2387.html"
		},

		{
			"name" : "상우고등학교 신한 Meme(밈) 학생증 카드",
			"rURL" : "/pconts/html/card/apply/check/1216268_2206.html",
			"newURL" : "/pconts/html/card/apply/prepaid/1216268_2387.html"
		},

		{
			"name" : "호남제일고등학교 신한 Meme(밈) 학생증 카드",
			"rURL" : "/pconts/html/card/apply/check/1216267_2206.html",
			"newURL" : "/pconts/html/card/apply/prepaid/1216267_2387.html"
		},

		{
			"name" : "신한카드 FANtastic S 체크(LoL)",
			"rURL" : "/pconts/html/card/apply/check/1216821_2206.html",
			"newURL" : "/pconts/html/redirect/cardReDir3.html"
		},

		{
			"name" : "디지털구독 STARBUCKS 오더",
			"rURL" : "/pconts/html/life/napbu/MOBFM531/MOBFM531R05.html",
			"newURL" : "/pconts/html/redirect/cardReDir3.html"
		},

		{
			"name" : "우체국 x 신한카드 우체국 신한 우정 적금",
			"rURL" : "/pconts/html/benefit/event/1199223_2239.html",
			"newURL" : "/pconts/html/redirect/cardReDir1.html"
		},

		{
			"name" : "프리미엄론/프라임드림론 신청",
			"rURL" : "/pconts/html/finance/cardLoan/premiumLoan/MOBFM090R01.html",
			"newURL" : "/pconts/html/redirect/cardReDir3.html"
		},

		{
			"name" : "몰테일 GS칼텍스 신한카드 Shine",
			"rURL" : "/pconts/html/card/apply/credit/1195391_2207.html",
			"newURL" : "/pconts/html/redirect/cardReDir3.html"
		},

		{
			"name" : "지자체 재난지원금은 신한카드와 함께(랜딩)",
			"rURL" : "/pconts/html/landing/SHCFRW045.html",
			"newURL" : "/pconts/html/redirect/cardReDir3.html"
		},

		{
			"name" : "네이버페이 라인프렌즈 신한카드 이벤트",
			"rURL" : "/pconts/html/benefit/event/1198361_2239.html",
			"newURL" : "/pconts/html/redirect/cardReDir1.html"
		},

		{
			"name" : "테슬라, 꿈의 차를 낮은 금리&포인트 혜택",
			"rURL" : "/pconts/html/benefit/event/1196081_2239.html",
			"newURL" : "/pconts/html/benefit/event/1197156_2239.html"
		},

		{
			"name" : "신한카드 S20체크(박보검 한정판)",
			"rURL" : "/pconts/html/card/apply/check/1192503_2206.html",
			"newURL" : "/pconts/html/main.html"
		},

	]

	var newLoc=''; //이동될 주소 변수
	for(var i=0;i<dxRedirCard.length;i++){
		if(document.URL.indexOf(dxRedirCard[i].rURL)>-1){
			newLoc=dxRedirCard[i].newURL //
					
			var docURL = document.URL //브라우저 주소정보
			var docURLIdx=docURL.indexOf('?')
			var URLparam=docURL.indexOf('?')>-1?docURL.substring(docURLIdx,9999):''; //파라미터 정보
			
			var devc=document.URL.indexOf('https://devprj2-')>-1?'https://devprj2-www.':'https://www.'; // 데브인지 아닌지 구분
			//location.href= devc+'shinhancard.com'+newLoc+URLparam; //해당  URL 에 파라미터 값 붙혀 이동
			location.href= getEscapeXSS(devc)+'shinhancard.com'+getEscapeXSS(newLoc)+getEscapeXSS(URLparam);//
			//console.log(URLparam);
			//console.log(dxRedirCard[i].name);
			//console.log(devc+'shinhancard.com'+newLoc+URLparam);
		}
	} 
}

/* XSS 공격 방지를 위해 변환된 문자를 원본 문자로 복원 */
function getEscapeXSS(inputText){
	var plainText = inputText;
	if (plainText != '')
	{
		var source = ["<", ">", "\"", "'", "(", ")"];
		var target = ["&lt;","&gt;","&quot;","&#47;","&#40;","&#41;"];
		for(var  i = 0; i < source.length; i++)
		{
			if(plainText.indexOf(source[i]) > -1)
			{
				plainText = plainText.replace(source[i], target[i]);
			}
		}
	}
	return plainText;
}  