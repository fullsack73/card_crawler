(function (global) {
	/* Main Script */
	var GTMcode = 'GTM-MQQ4TRV';		// ==> GA4구축: 신규 신한플레이 GTM 코드로 변경
	var AndroidWebview = 'GA_Android';
	var iOS_Webview_WK = 'GA_iOS_WK';
	var iOS_WebView_UI = 'GA_iOS_UI';
	var CustomObject = {};			// ==> GA4구축: 변경
	var virtualObject = {};			// ==> GA4구축: 추가
	var gaLoad = { APP: false };	// ==> GA4구축: 변경
	var browserInfo = navigator.userAgent;
	if (browserInfo.indexOf(AndroidWebview) > -1 || browserInfo.indexOf(iOS_Webview_WK) > -1 || browserInfo.indexOf(iOS_WebView_UI) > -1) {
		gaLoad.APP = true;
	}
	
	// GA4 구축 추가: dataLayer 초기화 함수
	// 해당 함수는 dataLayer를 초기화하여 이전 데이터의 중복 전송을 방지합니다.
	resetDataLayer = function (targetObject) {
		var setGTM = {};
		for (key in targetObject) {
			setGTM[key] = undefined;
		}

		return dataLayer.push(setGTM);
	}

	// GA4 구축 추가: object merge함수
	mergeObjects = function() {
		var resObj = {};
		for(var i=0; i < arguments.length; i += 1) {
			var obj = arguments[i],
				keys = Object.keys(obj);
			for(var j=0; j < keys.length; j += 1) {
				resObj[keys[j]] = obj[keys[j]];
			}
		}

		return resObj;
	}

	// GA4구축 수정: 이벤트 전송 함수 (GA4에서는 category, action, label 사용 X)
	// 가상페이지에서 발생한 이벤트를 처리하기 위한 구분자 'isVirtual' Boolean 파라미터 추가 
	// 1. GAInfo 객체에 이벤트 데이터 GAInfo_GA 객체를 mergeObjects 함수를 사용하여 할당
	// 2. 웹일 경우, 가상페이지에서 발생한 이벤트면 가상페이지 데이터와 이벤트 데이터를 병합
	// 3. GTM에서 트리거로 사용할 변수 event: 'ga_event' 추가 설정하여 dataLayer.push 하여 데이터 전송
	// 4. resetDataLayer 함수 호출을 통해 dataLayer 초기화
	// 5. 앱일 경우, 페이지(가상페이지) 데이터와 이벤트 데이터를 병합하여 전송 유형 구분자 type:"E" 설정 후 dataForBridge 함수 호출
	global.GADatasend_Event = function (GAInfo_GA, isVirtual) {
		try {
			var GAInfo = mergeObjects(GAInfo_GA);

			if (!gaLoad.APP) {
				isVirtual ? (GAInfo = mergeObjects(virtualObject, GAInfo)) : GAInfo;
				GAInfo.event = 'ga_event';
				dataLayer.push(GAInfo);
				resetDataLayer(GAInfo);
			} else {
				isVirtual ? (GAInfo = mergeObjects(virtualObject, GAInfo)) : (GAInfo = mergeObjects(CustomObject, GAInfo));
				GAInfo.type = 'E';
				dataForBridge('shpa_sendGAEvent', GAInfo);
			}
		} catch (e) { }
	};

	// GA4구축 수정: 가상페이지뷰 전송 함수
	// 1. GAInfo 객체에 가상페이지 데이터 GAInfo_GA 객체를 mergeObjects 함수를 사용하여 할당
	// 2. 웹일 경우, GTM에서 트리거로 사용할 변수 event: 'ga_virtual' 추가 설정하여 dataLayer.push 하여 데이터 전송
	// 3. resetDataLater 함수 호출을 통해 dataLayer 초기화
	// 4. 앱일 경우 GAInfo에 전송 유형 구분자 type:"P" 설정 후 dataForBridge 함수 호출
	global.GADatasend_Page = function (GAInfo_GA) {
		try {
			var GAInfo = mergeObjects(GAInfo_GA);
			virtualObject = mergeObjects(GAInfo_GA);

			if (!gaLoad.APP) {
				GAInfo.event = 'ga_virtual';
				dataLayer.push(GAInfo);
				resetDataLayer(GAInfo);
			} else {
				GAInfo.type = 'P';
				dataForBridge('shpa_sendGAScreen', GAInfo);
			}
		} catch (e) { }
	};

	// GA4구축 수정: 페이지뷰 전송 함수
	// 1. 상단에서 전역변수로 선언한 CustomObject 객체에 페이지 데이터 GAInfo 객체를 mergeObjects 함수를 사용하여 할당
	// 2. 웹일 경우, dataLayer에 페이지 데이터 GAInfo 객체를 설정
	// 3. GTM 추적 코드를 통해 GTM 로드 => 로드된 GTM 컨테이너에서 GA4로 페이지뷰 전송
	// 4. 앱일경우, GAInfo에 전송 유형 구분자 type:"P" 설정 후 dataForBridge 함수 호출	
	global.GA_Init = function (GAInfo) {
		try {
			//앱에서 실행된 웹뷰가 아닐경우
			CustomObject = mergeObjects(GAInfo);

			if (!gaLoad.APP) {
				dataLayer = [GAInfo];	

				(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
				new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
				j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
				'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
				})(window,document,'script','dataLayer',GTMcode);    

			} else {
				GAInfo.type = 'P';
				dataForBridge('shpa_sendGAScreen', GAInfo);
			}
		} catch (e) { }
	};

	// GA4 구축 수정: 이벤트 리스너 함수 => GA4는 카테고리,액션,라벨을 사용하지 않아 ep_ 가 포함된 속성들을 객체에 설정하도록 수정
	// 이벤트 매개변수('ep_')들과 이벤트명('event_name')을 GAData에 설정한 뒤 가상페이지에서 발생한 이벤트인지 판별하여 GADatasend_Event 함수 호출
	// 해당 주석 코드는 <body></body> 태그 맨 아래쪽에 넣어주세요(넣으실 때는 주석 해제해주세요)
	$(document).ready(function () {
		var gpGaEventClickClass = document.getElementsByClassName('gp_className');
		for (var i = 0; i < gpGaEventClickClass.length; i++) {
			gpGaEventClickClass[i].addEventListener('click', function (event) {
				var ELE = event.currentTarget;
				var ATTR = ELE.getAttributeNames();
				var GAData = {};
				for (var j = 0; j < ATTR.length; j++) {
					if (ATTR[j].indexOf('ep_') !== -1) {
						GAData[ATTR[j]] = ELE.getAttribute(ATTR[j]);
					}
				}
				GAData['event_name'] = ELE.getAttribute('event_name');

				var isVirtual = ELE.getAttribute('isVirtual');
				
				if (isVirtual === 'true') {
					global.GADatasend_Event(GAData, true);
				} else {
					global.GADatasend_Event(GAData, false);
				}

			});
		}
	});

})(window);