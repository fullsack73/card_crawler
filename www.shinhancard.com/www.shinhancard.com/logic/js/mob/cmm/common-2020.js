//notation: js file can only use this kind of comments
//since comments will cause error when use in webview.loadurl,
//comments will be remove by java use regexp
(function () {
	var agent = navigator.userAgent;
	agent = agent.toLowerCase();

	if (agent.indexOf("shcardapp") != -1 && agent.indexOf("shchatbot") != -1) {
		$(".app_hidden").hide();
	}

	if (agent.indexOf("premiumcoupon") != -1) {
		$("#shcHead").hide();
	}

	if (window.WebViewJavascriptBridge) {
		return; __QUEUE_MESSAGE__
	}
	if (deviceInfo.os != 'android') {
		return;
	}

	var messagingIframe;
	var sendMessageQueue = [];
	var receiveMessageQueue = [];
	var messageHandlers = {};

	var CUSTOM_PROTOCOL_SCHEME = 'yy';
	var QUEUE_HAS_MESSAGE = '/';

	var responseCallbacks = {};
	var uniqueId = 1;

	var base64encodechars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
	function base64encode(str) {
		if (str === undefined) {
			return str;
		}

		var out, i, len;
		var c1, c2, c3;
		len = str.length;
		i = 0;
		out = "";
		while (i < len) {
			c1 = str.charCodeAt(i++) & 0xff;
			if (i == len) {
				out += base64encodechars.charAt(c1 >> 2);
				out += base64encodechars.charAt((c1 & 0x3) << 4);
				out += "==";
				break;
			}
			c2 = str.charCodeAt(i++);
			if (i == len) {
				out += base64encodechars.charAt(c1 >> 2);
				out += base64encodechars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xf0) >> 4));
				out += base64encodechars.charAt((c2 & 0xf) << 2);
				out += "=";
				break;
			}
			c3 = str.charCodeAt(i++);
			out += base64encodechars.charAt(c1 >> 2);
			out += base64encodechars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xf0) >> 4));
			out += base64encodechars.charAt(((c2 & 0xf) << 2) | ((c3 & 0xc0) >> 6));
			out += base64encodechars.charAt(c3 & 0x3f);
		}
		return out;
	}

	function _createQueueReadyIframe(doc) {
		messagingIframe = doc.createElement('iframe');
		messagingIframe.style.display = 'none';
		doc.documentElement.appendChild(messagingIframe);
	}

	function isAndroid() {
		var ua = navigator.userAgent.toLowerCase();
		var isA = ua.indexOf("android") > -1;
		if (isA) {
			return true;
		}
		return false;
	}

	function isIphone() {
		var ua = navigator.userAgent.toLowerCase();
		var isIph = ua.indexOf("iphone") > -1;
		if (isIph) {
			return true;
		}
		return false;
	}

	//set default messageHandler
	function init(messageHandler) {
		if (WebViewJavascriptBridge._messageHandler) {
			throw new Error('WebViewJavascriptBridge.init called twice');
		}
		WebViewJavascriptBridge._messageHandler = messageHandler;
		var receivedMessages = receiveMessageQueue;
		receiveMessageQueue = null;
		for (var i = 0; i < receivedMessages.length; i++) {
			_dispatchMessageFromNative(receivedMessages[i]);
		}
	}

	function send(data, responseCallback) {
		_doSend({
			data: data
		}, responseCallback);
	}

	function registerHandler(handlerName, handler) {
		messageHandlers[handlerName] = handler;
	}

	function callHandler(handlerName, data, responseCallback) {
		_doSend({
			handlerName: handlerName,
			data: data
		}, responseCallback);
	}

	//sendMessage add message, ??native?理 sendMessage
	function _doSend(message, responseCallback) {
		if (responseCallback) {
			var callbackId = 'cb_' + (uniqueId++) + '_' + new Date().getTime();
			responseCallbacks[callbackId] = responseCallback;
			message.callbackId = callbackId;
		}

		sendMessageQueue.push(message);
		messagingIframe.src = CUSTOM_PROTOCOL_SCHEME + '://' + QUEUE_HAS_MESSAGE;
	}

	// 提供?native?用,?函?作用:?取sendMessageQueue返回?native,由于android不能直接?取返回的?容,所以使用url shouldOverrideUrlLoading 的方式返回?容
	function _fetchQueue() {
		var messageQueueString = JSON.stringify(sendMessageQueue);
		sendMessageQueue = [];
		//add by hq
		if (isIphone()) {
			return messageQueueString;
			//android can't read directly the return data, so we can reload iframe src to communicate with java
		} else if (isAndroid()) {
			messagingIframe.src = CUSTOM_PROTOCOL_SCHEME + '://return/_fetchQueue/' + encodeURIComponent(messageQueueString);
		}
	}
	//提供?native使用,
	function _dispatchMessageFromNative(messageJSON) {
		setTimeout(function () {
			var message = JSON.parse(messageJSON);
			var responseCallback;
			//java call finished, now need to call js callback function
			if (message.responseId) {
				responseCallback = responseCallbacks[message.responseId];
				if (!responseCallback) {
					return;
				}
				responseCallback(message.responseData);
				delete responseCallbacks[message.responseId];
			} else {
				//直接?送
				if (message.callbackId) {
					var callbackResponseId = message.callbackId;
					responseCallback = function (responseData) {
						_doSend({
							responseId: callbackResponseId,
							responseData: responseData
						});
					};
				}

				var handler = WebViewJavascriptBridge._messageHandler;
				if (message.handlerName) {
					handler = messageHandlers[message.handlerName];
				}
				//??指定handler
				try {
					handler(message.data, responseCallback);
				} catch (exception) {
					if (typeof console != 'undefined') {
						console.log("WebViewJavascriptBridge: WARNING: javascript handler threw.", message, exception);
					}
				}
			}
		});
	}
	//提供?native?用,receiveMessageQueue 在?在?面加?完后???null,所以
	function _handleMessageFromNative(messageJSON) {
		//console.log(messageJSON);
		receiveMessageQueue = null;
		if (receiveMessageQueue) {
			receiveMessageQueue.push(messageJSON);
		} else {
			_dispatchMessageFromNative(messageJSON);
		}
	}
	var WebViewJavascriptBridge = window.WebViewJavascriptBridge = {
		init: init,
		send: send,
		registerHandler: registerHandler,
		callHandler: callHandler,
		_fetchQueue: _fetchQueue,
		_handleMessageFromNative: _handleMessageFromNative
	};
	var doc = document;
	_createQueueReadyIframe(doc);
	var readyEvent = doc.createEvent('Events');
	readyEvent.initEvent('WebViewJavascriptBridgeReady');
	readyEvent.bridge = WebViewJavascriptBridge;
	doc.dispatchEvent(readyEvent);
})();
//app bridge.js
//초기화 함수
function setupWebViewJavascriptBridge(callback) {
	if (deviceInfo.app != 'shcardapp' && deviceInfo.app != 'shfanapp') return;
	//alert(navigator.userAgent);
	if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
	else { document.addEventListener('WebViewJavascriptBridgeReady', function () { callback(WebViewJavascriptBridge); }, false); }
	if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
	window.WVJBCallbacks = [callback];
	if (window.navigator.userAgent.indexOf('ttest') < 0) {
	try {
		var WVJBIframe = document.createElement('iframe');
		WVJBIframe.style.display = 'none';
		WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
		document.documentElement.appendChild(WVJBIframe);
		setTimeout(function () { document.documentElement.removeChild(WVJBIframe) }, 0);
	} catch (e) { }
	}
}
//WebViewJavascriptBridge 로딩
setupWebViewJavascriptBridge(function (bridge) {
	// registerHandler : 단말 -> Web 호출 핸들러 정의
	// 호출메소드명, 콜백함수(웹에서 처리후 단말로 콜백을 위한 함수)
	// 실제 기능은 페이지에서 function 를 구현한다.
	bridge.registerHandler('shpw_recvAuthSms', function (data, responseCallback) { if (typeof (data) == 'string') data = JSON.parse(data); shpw_recvAuthSms(data, responseCallback); });
	//보안키패드 글자 추가
	bridge.registerHandler('shpw_secKbdAdd', function (data, responseCallback) { if (typeof (data) == 'string') data = JSON.parse(data); shpw_secKbdAdd(data, responseCallback); });
	// 보안 키 패드 글자 삭제
	bridge.registerHandler('shpw_secKbdDel', function (data, responseCallback) { if (typeof (data) == 'string') data = JSON.parse(data); shpw_secKbdDel(data, responseCallback); });
	//보안키패드 입력 초기화
	bridge.registerHandler('shpw_secKbdReset', function (data, responseCallback) { if (typeof (data) == 'string') data = JSON.parse(data); shpw_secKbdReset(data, responseCallback); });
	//보안키패드 입력 취소
	bridge.registerHandler('shpw_secKbdCancel', function (data, responseCallback) { if (typeof (data) == 'string') data = JSON.parse(data); shpw_secKbdCancel(data, responseCallback); });
	//보안키패드 입력 완료
	bridge.registerHandler('shpw_secKbdComp', function (data, responseCallback) { if (typeof (data) == 'string') data = JSON.parse(data); shpw_secKbdComp(data, responseCallback); });
	//웹 이전 화면으로 이동
	bridge.registerHandler('shpw_onBackPress', function (data, responseCallback) { if (typeof (data) == 'string') data = JSON.parse(data); shpw_onBackPress(data, responseCallback); });

	//onResume Event
	bridge.registerHandler('onResume', function (data, responseCallback) { if (typeof (data) == 'string') data = JSON.parse(data); onResume(data, responseCallback); });

	bridge.registerHandler('shpw_ansimclick', function (data, responseCallback) { if (typeof (data) == 'string') data = JSON.parse(data); shpw_ansimclick(data, responseCallback); });
	bridge.registerHandler('shpw_mSSOLogin', function (data, responseCallback) { if (typeof (data) == 'string') data = JSON.parse(data); shpw_mSSOLogin(data, responseCallback); });
	bridge.registerHandler('shpw_PhoneCall', function (data, responseCallback) { if (typeof (data) == 'string') data = JSON.parse(data); shpw_PhoneCall(data, responseCallback); });
	bridge.registerHandler('shpw_selectPhoneNm', function (data, responseCallback) { if (typeof (data) == 'string') data = JSON.parse(data); shpw_selectPhoneNm(data, responseCallback); });
	bridge.registerHandler('shpw_goHistBack', function (data, responseCallback) { if (typeof (data) == 'string') data = JSON.parse(data); shpw_goHistBack(data, responseCallback); });

});
//callHandler : Web -> 단말 호출 핸들러
//Web -> 단말 호출은 send 함수를 호출을 각 페이지에서 정의함
//method: 호출메소드명, data: json 형태의 호출 파라메터, func: 콜백함수(단말에서 처리후 웹으로 콜백을 위한 함수)
function send(method, data, func) {
	//프리미엄쿠폰앱 관련 수정 :  shcouponapp 추가.
	if (deviceInfo.app != 'shcardapp' && deviceInfo.app != 'shfanapp' && deviceInfo.app != 'shcouponapp') return;
	if (window.navigator.userAgent.indexOf('ttest') < 0) {
	var isWhile = true;
	var startTime = new Date().getTime();
	// 안드로이드에서 WebViewJavascriptBridge 로딩이전에 콜이 들어가는 현상으로 인한 처리
	while (isWhile) {
		if (window.WebViewJavascriptBridge) {
			isWhile = false;
		}
		// 오류가 발생하더라도. 무한루프는 방지
		if (new Date().getTime() - startTime > 5000) {
			isWhile = false;
			return;
		}
	}
	// 안드로이드에서 동시에 여러 요청이 들어올경우 실행되지 않는 경우 발생.
	setTimeout(function () {
		WebViewJavascriptBridge.callHandler(method, data, func);
	}, 10);
	}
}

// sms 인증
function shpw_recvAuthSms(data) {
	try {
		if ($("input[data-plugin-value='t05.ano']").length > 1) {
			$("input[data-plugin-value='t05.ano']:last").val(data.sms);
		} else {
			$("#sms_auth_num").val(data.sms);
		}
	} catch (e) {
		$("#sms_auth_num").val(data.sms);
	}
}

function shpw_selectPhoneNm(data, responseCallback){
	if(window.shpw_selectPhoneNmCallBack){
		window.shpw_selectPhoneNmCallBack(data);
	}
};

function checkVaccine() {
	// 2020/1/31 mVaccine 사용 안하기로 결정됨
//	var RTCheckRtnUrl = "http://m.shinhancard.com/jsp/sys/check/rt.jsp";
//	var RTCheckRtnParamName = "check";
//	var RealTimeCheckRtnUrl = RTCheckRtnUrl;
//	var RealTimeCheckParamName = "check2";
//	var RealTimeCheckType = "CARD";
//	if (document.getElementById('start').contentDocument == null) {
//		alert("백신 설치가 되어있지 않습니다.");
//		location.href = "market://details?id=kr.co.shiftworks.vguardweb";
//	}
//	else
//		location.href = "vguardstart://RTCheckRtnUrl=" + RTCheckRtnUrl + "?" + RTCheckRtnParamName + "=&RealTimeCheck=" + RealTimeCheckRtnUrl + "?" + RealTimeCheckParamName + "=&cardName=" + RealTimeCheckType + "&inc=" + '<%=new kr.co.shiftworks.encoder.Encrypt().encoding()%>';
}

$svc.popup('lpSignPolling', function ($param, $close) {
	var vo = $svc.bind({ name: 'lpSignPolling', url: '/mob/cmm/MOBFMAUTH/lpPolling.ahtml' });
	var on = vo.event();
	vo.render(function () { $svc.loadingBar(true, '인증 처리중 입니다.') });
	$param.call.close = function () { $svc.loadingBar(false), $close() }
});
$svc.service('sign', function () {
	var util = $svc.get('util');
	var o = {}, m = { pollTime: 2000, pollCnt: 30 };
	var intervalID = null;	// 페이판 인증 polling PC
	var pollKey = null;		// 페이판 인증 polling 모바일 웹, 페이판

	if (deviceInfo.app != 'shcardapp' && deviceInfo.app != 'shfanapp') {
		// "G3": 설치형, "G4": 비설치형
		try {
			if (deviceInfo.mobile) {
				Delfino.setModule('G4');
			}else {
				var moduleType =  util.getCookie('shinhan.moduleType');

				if (moduleType) {
					Delfino.setModule(moduleType);
				}
			}
		} catch (e) { }
	}

	// 전자서명 요청
	o.requestSign=function (forSignObj, callback, signMsg) {
		var pollPrm = { call: {} }, pollCnt = 0;
		var serialData = signMsg ? signMsg : Object.keys(forSignObj).map(function (k) { return k + "=" + forSignObj[k] }).join("&");
		if (deviceInfo.app == 'shcardapp' || deviceInfo.app == 'shfanapp') app();
		else web();

		function web() {
			Delfino.sign({data: signMsg, dataType:'formattedText'}, null, function(result) {
				if (result.message=='cancel') {
					callback(result, false, "서명 취소 되었습니다.");
				}
				else {
					callback(result, true, "서명 완료 되었습니다.");
				}
			});
		}

		function app(){
			var obj = {};
	        obj.origine_message = serialData;
	        send('shpa_getSignedMessage', JSON.stringify(obj), function(data) {
	        	$log("error :: ", data);
	        	//pollPrm.call.close();
	        	if(typeof(data) == 'string'){
	        		data = JSON.parse(data);
	                if( data.res == 'ok' ) {
	                	var result = { status: 1, message: '서명 완료 되었습니다.',
	                			signData: data.signed_message, delfinoNonce: data.delfinoNonce, vidRandom: data.vidRandom };
	                	callback (result, true, "서명 완료 되었습니다.");
	                } else {
	                	var result = { status: 0, message: '서명 취소 되었습니다.' };
	                	callback (result, false, "서명 취소 되었습니다.");
	                }
	        	} else {
                	var result = { status: -1, message: '처리 중 오류가 발생했습니다.' };
                	callback (result, false, "처리 중 오류가 발생했습니다.");
                }
	        });
		}
	}
	o.requestCertLogin = function (forSignObj, callback) {
//		if(module) {
//			Delfino.setModule(module);
//		}
		o.requestCert(forSignObj,callback);
	}

	// 전자서명 요청 통합인증
	o.requestCert = function (forSignObj, callback) {
		var pollPrm = { call: {} }, pollCnt = 0;
		var serialData = Object.keys(forSignObj).map(function (k) { return k + "=" + forSignObj[k] }).join("&");
		if (deviceInfo.app == 'shcardapp' || deviceInfo.app == 'shfanapp') app();
		else web();

		function web() {
			ui.commonAccess.disable($('#wrap'), 'certification');
			var loginType = (forSignObj.certType == "VID" ? "login=vidLogin" : "login=certLogin");
			Delfino.login(loginType, function (result) {
				if (result.message=='cancel') {
					callback(result, false, "인증 취소 되었습니다.");
				}
				else {
					$('<input></input>').attr({ name: 'serviceName', id: 'serviceName', value: forSignObj.serviceName, type: 'hidden' }).appendTo($('form'));
					callback(result, true, "인증 처리 되었습니다.");
				}
				
				if(typeof forSignObj.moduleName !== 'undefined' && forSignObj.moduleName !== null && forSignObj.moduleName !== ""){
					setTimeout(function(){
						$(forSignObj.moduleName.target.parentElement).focus();
					},1000);
//					
				}
				
				setTimeout(function(){ ui.commonAccess.enable($('#wrap'), 'certification'); }, 100);
			});
		}

		function app() {
			var obj = {};
			obj.origine_message = serialData;
			send('shpa_getSignedMessage', JSON.stringify(obj), function (data) {
				$log("error :: ", data);
	        	if(typeof(data) == 'string'){
	        		data = JSON.parse(data);
	                if( data.res == 'ok' ) {
	                	var result = { status: 1, message: '인증 처리 되었습니다.',
	                			signData: data.signed_message, delfinoNonce: data.delfinoNonce, vidRandom: data.vidRandom };
	                	callback (result, true, "인증 처리 되었습니다.");
	                } else {
	                	var result = { status: 0, message: '인증 취소 되었습니다.' };
	                	callback (result, false, "인증 취소 되었습니다.");
	                }
	        	} else {
                	var result = { status: -1, message: '처리 중 오류가 발생했습니다.' };
                	callback (result, false, "처리 중 오류가 발생했습니다.");
                }
			});
		}
	}
	//인증서가져오기
	o.importCert = function () {
		if (deviceInfo.app == 'shcardapp' || deviceInfo.app == 'shfanapp') {
			send("shpa_getCertListPc", "", function (json) {
			});
		} else {
			Delfino.importCertificate();
		}
	}
	//인증서 내보내기
	o.exportCert = function () {
		ui.commonAccess.disable($('#wrap'), 'certification');
		
		// web에서만 호출됨.
		Delfino.exportCertificate(function(result) {
			if (result.status == 0) {
				alert("내보내기 취소"); //사용자취소
			} else if (result.status == 1) {
				alert("내보내기 성공");
			} else {
				alert(result.message + "[" + result.status + "]");
			}
			setTimeout(function(){ ui.commonAccess.enable($('#wrap'), 'certification'); }, 100);
			
		});
	}
	//인증서관리
	o.managerCert = function () {
		if (deviceInfo.app == 'shcardapp' || deviceInfo.app == 'shfanapp') {
			send("shpa_certManage", "", function (json) {
			});
		} else {
			Delfino.manageCertificate();
		}
	}
	// app card type 02 인 경우 인증 완료 확인 요청.
	o.requestAppCardConfirm=function(authParam, callback){

		if(authParam.APPC_TS_ID == undefined || authParam.APPC_TS_ID == '') {
			callback(authParam, false, '');
			return;
		}

		$svc.get('http').submit('/mob/cmm/MOBFMAUTH/PesnAppCardAuthCheck.ajax',{
			gubun:'M',
			appcTsId:authParam.APPC_TS_ID
		},'not').then(function(rsHttp){
			if(!rsHttp)return;
			if (rsHttp.NC_RCD!='0004' && rsHttp.NC_RCD!='0022')
				return popup.alert('인증처리실패<br/>'+rsHttp.NC_RCD);
			else if (rsHttp.NC_RCD=='0004'){
				$svc.get('http').submit('/mob/cmm/MOBFMAUTH/PesnFan.ajax', authParam, 'not').then(function(rsHttp){
					if(!rsHttp)return vo.focus(e);

					callback(authParam);
				}, function(){vo.focus(e)});
			}

		}, function(){

		});
	}
	//SOL 앱에서 공동인증서 복사하기
	o.shpa_getCertShinhanBank = function ( obj, callback){
		if (deviceInfo.app == 'shautoapp' || deviceInfo.app=='shfanapp' || deviceInfo.app == 'shcardapp') { // 앱일경우
			if(deviceInfo.os.match(/iphone/i) || deviceInfo.os.match(/ipad/i) || deviceInfo.os.match(/ipod/i)){
				//ios
				//$log('shpa_getCertShinhanBank : send');
				send('shpa_getCertShinhanBank', JSON.stringify(obj || {}), function(data) {
					if(typeof(data) == 'string'){
						data = JSON.parse(data);
					}
					//$log('shpa_getCertShinhanBank : callback ' , data);
					callback && callback (data);
				});
			}else{
				//Android
				$svc.get('popup').alert('ios에서만 제공되는 기능입니다.');
				//alert('ios에서만 제공되는 기능입니다.');
			}
		}else{
			//alert('ios 앱에서만 제공되는 기능입니다.');
			$svc.get('popup').alert('ios 앱에서만 제공되는 기능입니다.');
		}

	}
	// AppCard 요청 (FAN)
	o.requestAppCard = _.throttle(function (forSignObj, callback) {
		var $param = forSignObj.param;
		$log('requestAppCard : ' + (new Date).getTime());
		var pollPrm = { call: {} };
		var pollCnt = 0;
		m.pollCnt = 15;
		// 팝업연동
		var paramCall = {
			// 새로고침 눌렀을 때 실행되는 함수
			reload: function() {
				web();
			},
			// 개발테스트용도
			dev: dev
		};

		if (!deviceInfo.app && !deviceInfo.mobile) {
			if(intervalID) {
				if($param.config.state != undefined) {
					fnCloseAppCardPlugin();
				} else {
					return;
				}
			}
			web();
		}else if (deviceInfo.app == 'shcardapp') {
			app();
		}else {
			mob();
		}

		function mob() {
			// 0506 임시로 개발도 풀어놓음..
			// 바로 다시 막을 예정..
			if (deviceInfo.mode.indexOf('local') > -1 //|| deviceInfo.mode.indexOf('dev') > -1
					) {
				dev();
				return;
			}

			pollKey && clearInterval(pollKey);

			$svc.get('http').json('/mob/cmm/MOBFMAUTH/PesnAppCardAuthReq.ajax', {
				appcOCtsTsPcd: '001',
				wbPgeUrlAr: location.pathname
			}, 'not').then(function (rsHttp) {
				if (!rsHttp || !rsHttp.APPC_TS_ID || rsHttp.NC_RCD != '0004')
					return callback(forSignObj, false, 'FAN 인증키 오류입니다.<br/>' + rsHttp.NC_RCD);

				checkApplicationInstall('shfanapp', 'srCode=' + rsHttp.APPC_ST_N);

				if(forSignObj.type&&'02' == forSignObj.type){
					forSignObj.APPC_ST_N = rsHttp.APPC_ST_N;
					forSignObj.APPC_TS_ID = rsHttp.APPC_TS_ID;
					callback(forSignObj, true, '');
				}else{
					pollKey = setInterval(function () {
						if (++pollCnt >= m.pollCnt) {
							clearInterval(pollKey);
							return callback(forSignObj, false, '인증대기시간 초과.');
						}

						$svc.get('http').json('/mob/cmm/MOBFMAUTH/PesnAppCardAuthCheck.ajax', {
							gubun: 'A',
							appcTsId: rsHttp.APPC_TS_ID
						}, 'not').then(function (rsHttp) {
							if (!rsHttp) {
								clearInterval(pollKey);
								return;
							}
							if (rsHttp.NC_RCD != '0004' && rsHttp.NC_RCD != '0022') {
								clearInterval(pollKey);
								callback(forSignObj, false, '인증처리실패<br/>' + rsHttp.NC_RCD);
								return;
							}
							if (rsHttp.NC_RCD == '0004') {
								clearInterval(pollKey);
								callback(forSignObj, true, '인증되었습니다.');
								return;
							}
						}, function () {
							clearInterval(pollKey);
							callback(forSignObj, false, '');
						});
					}, m.pollTime);
				}
			}, function () {
				callback(forSignObj, false, '');
			});
		}

		function app() {
			$svc.get('http').json('/mob/cmm/MOBFMAUTH/PesnAppCardAuthReq.ajax', {
				appcOCtsTsPcd: '001',
				wbPgeUrlAr: location.pathname
			}, 'not').then(function (rsHttp) {
				if (!rsHttp || !rsHttp.APPC_TS_ID || rsHttp.NC_RCD != '0004')
					return callback(forSignObj, false, 'FAN 인증키 오류입니다.<br/>' + rsHttp.NC_RCD);

				var obj = { 'packageName': "shinhan-sr-ansimclick://pay?srCode=" + rsHttp.APPC_ST_N };
				$svc.get('Native').executeShinhanApp(obj, function () { });
				window.onResume = function () {
					//App이 다시 활성화 되었을 경우.
					window.onResume = undefined;
					$svc.get('http').json('/mob/cmm/MOBFMAUTH/PesnAppCardAuthCheck.ajax', {
						gubun: 'M',
						appcTsId: rsHttp.APPC_TS_ID
					}, 'not').then(function (rsHttp) {
						if (!rsHttp || rsHttp.NC_RCD != '0004')
							return callback(forSignObj, false, '인증처리실패<br/>' + rsHttp.NC_RCD);
						callback(forSignObj, true, '인증되었습니다.');
					}, function () {
						callback(forSignObj, false, '');
					});
				};
			}, function () {
				callback(forSignObj, false, '');
			});
		}

		var isShowAppCardPop = false;

		function web() {
			if(($param == undefined || $param.config.state == undefined) && (deviceInfo.mode.indexOf('local') > -1 || deviceInfo.mode.indexOf('dev') > -1)) {
				dev();
				return;
			}

			$svc.get('http').json('/mob/cmm/MOBFMAUTH/PesnAppCardAuthReq.ajax', {
				appcOCtsTsPcd: '001',
				wbPgeUrlAr: location.pathname
			}, 'not').then(function (rsHttp) {
				if (!rsHttp) return;
				else {
					fnAuthAppCardCallback(rsHttp);
				}
			}, function (error) {
			});
		}

		function dev() {
			window.open('/pjsp/dev/pesnAuth/t06.jsp', 'dev');
			dev_next();
		}
		function dev_next() {
			if (++pollCnt >= m.pollCnt) {
				return callback(forSignObj, false, '인증대기시간 초과.');
			}
			$svc.get('http').json('/mob/cmm/MOBFMAUTH/DevPesnAuthPolling.ajax',{},'not').then(function(rsHttp){
				if (!rsHttp) {
					return;
				}
				if (!rsHttp.t06 || rsHttp.t06.length==0) {
					setTimeout(function(){dev_next()}, m.pollTime);
				}
				else {
					if (paramCall.appCardAuthClose) paramCall.appCardAuthClose();
					return callback(forSignObj, rsHttp.t06=='c'?false:true, rsHttp.t06=='c'?'인증취소':'인증완료.');
				}
			}, function(){
				callback(forSignObj, false, '');
			});
		}

		function fnAuthAppCardCallback(json) {
			var status = json.NC_RCD;
			var msg = json.SO_MSG;

			if (status == '0004') {
				var today = new Date();

				$svc.get('http').json('/mob/cmm/MOBFMAUTH/PesnFanQrCode.ajax', { w: 120, h: 120, t: today.getTime() })
					.then(function (rsHttp) {
						var state = null;
						var chkAppTimer = $param.config.chkAppTimer != undefined ? $param.config.chkAppTimer : null;
						var chkPollKey = $param.config.chkPollKey != undefined ? $param.config.chkPollKey : null;
						var appcStN = '';
						// QR 화면으로 띄우기 위한 변수 Check
						if($param != undefined && $param.config.state != undefined) {
							state = $param.config.state;
						}
						
						if(state) { // 로그인일경우
							appcStN = '<div class="pesn-qr">';
							appcStN += '<div class="pesn-qr-img">';
							appcStN += '<button class="pesn-qr-refresh" data-plugin-click="fnReloadAppCard()"><span>새로고침</span></button>';
							if((deviceInfo.mode.indexOf('local') > -1 || deviceInfo.mode.indexOf('dev') > -1)) {
								appcStN += '<img src="data:image\/png;base64, ' + rsHttp.encodedImage + '" alt="인증용 QR" data-plugin-click="inputPNum()">';
							} else {
								appcStN += '<img src="data:image\/png;base64, ' + rsHttp.encodedImage + '" alt="인증용 QR">';
							}
							appcStN += '</div>';
							appcStN += '<span class="pesn-qr-gap">또는</span>';
							appcStN += '<span class="pesn-qr-num">' + json.APPC_ST_N + '</span>';
						} else {
							if(state != null) {
								appcStN = '<button id="resetBtn" class="dxdimd" data-plugin-click="fnReloadAppCard()" aria-errormessage="dxerrmsg"><span>새로고침</span></button>';
							}
							
							if(state != null && (deviceInfo.mode.indexOf('local') > -1 || deviceInfo.mode.indexOf('dev') > -1)) {
								appcStN += '<span class="qrcode_img"><img src="data:image\/png;base64, ' + rsHttp.encodedImage + '" alt="QR코드" data-plugin-click="inputPNum()"></span>';
							} else { 
								appcStN += '<span class="qrcode_img"><img src="data:image\/png;base64, ' + rsHttp.encodedImage + '" alt="QR코드"></span>';
							}
							
							if(state != null) {
								appcStN += '<span class="dxcen">또는</span>';
							}
							
							appcStN += '<strong>' + json.APPC_ST_N + '</strong>';
						}
						
						$('#appcStN').html(appcStN);

						fnOpenAppCardPop({
							appcStN: appcStN,
							appcTsId: json.APPC_TS_ID,
							call: paramCall,
							callback: callback,
							state: state,
							pollKey: pollKey,
							chkAppTimer: chkAppTimer,
							chkPollKey: chkPollKey,
							dev_next : function dev_next() {
								if (++pollCnt >= m.pollCnt) {
									return callback(forSignObj, false, '인증대기시간 초과.');
								}
								$svc.get('http').json('/mob/cmm/MOBFMAUTH/DevPesnAuthPolling.ajax',{},'not').then(function(rsHttp){
									if (!rsHttp) {
										return;
									}
									if (!rsHttp.t06 || rsHttp.t06.length==0) {
										setTimeout(function(){dev_next()}, m.pollTime);
									}
									else {
										if (paramCall.appCardAuthClose) paramCall.appCardAuthClose();
										return callback(forSignObj, rsHttp.t06=='c'?false:true, rsHttp.t06=='c'?'인증취소':'인증완료.');
									}
								}, function(){
									callback(forSignObj, false, '');
								});
							}
						});
					}, function () {
						vo.focus(event)
					});
			}
			else {
				if (msg == '') $svc.get('popup').alert('처리가 지연되어 죄송합니다. 잠시후 다시 이용해 주세요.').then(function () { });
				if (status != '') $svc.get('popup').alert(msg + "(" + status + ")").then(function () { });
				return;
			}
		}

		function fnOpenAppCardPop(param) {
			if(intervalID) {
				clearInterval(intervalID);
			}

			// 10분 대기
			var downCounter = 10 * 60;

			function appcard_timer() {
				if (downCounter >= 0) {
					try {
						downCounter--;
						var mm = util.lPad(Math.floor(downCounter / 60) + '', 2, '0');
						var ss = util.lPad((downCounter % 60) + '', 2, '0');
						$('#appcardTimer').text(mm + '분 ' + ss + '초');
						$("#appcardTimerProgressbar").attr("style", "width:" + Math.ceil(downCounter / 6) + "%");
						
						if (downCounter == 0 && param.state == null) {
							fnCloseAppCardPop('제한시간이 경과되었습니다. 다시 이용해 주세요.');
						} else if(downCounter == 0 && param.state != null) {
							fnCloseAppCardPlugin();
						}

					} catch (err) { }
				}
			}

			var mm = util.lPad(Math.floor(downCounter / 60) + '', 2, '0');
			var ss = util.lPad((downCounter % 60) + '', 2, '0');
			$('#appcardTimer').text(mm + '분 ' + ss + '초');
			$('#appcardTimerProgressbar').attr('style', 'width:100%');

			intervalID = window.setInterval(appcard_timer, 1000);
			
			// 폴링 값 담기
			if(param.chkAppTimer != null) {
				chkAppTimer = intervalID;
			}

			if (isShowAppCardPop) {
				param.call.setAppcTsId && param.call.setAppcTsId(param.appcTsId);
			} else {
				if(param.state != null) {
					// plugin
					$svc.get('plugin').load({ name: 'appCardAuth', param: param });
				} else {
					$svc.get('popup').open({ name: 'appCardAuth', param: param }).then(function(res) {
						if(res) {
							callback(forSignObj, res.succeed, res.message);
						}
						fnCloseAppCardPop();
					});
				}
				
			}
			isShowAppCardPop = true;
		}

		function fnCloseAppCardPop(msg) {
			clearInterval(intervalID);
			intervalID = null;

			if (msg) $svc.get('popup').alert(msg);

			isShowAppCardPop = false;
		}
		
		function fnCloseAppCardPlugin() {
			clearInterval(intervalID);
			intervalID = null;
		}
	}, 2000);
	return o;
});

$svc.popup('appCardAuth', function ($param, $close) {
	var url = $param.url;
	var vo = $svc.bind({ name: 'appCardAuth', url: '/mob/cmm/MOBFMAUTH/appCardAuth.ahtml' });
	var on = vo.event();
	var appcTsId = $param.appcTsId;
	$param.call && ($param.call.appCardAuthClose = $close);

	$param.call && ($param.call.setAppcTsId = function (changId){
		appcTsId = changId;
	});

	vo.render(function () {
		ui.layerComm.open();
		$('#appcStN').html($param.appcStN);
	});
	on.close = function () {
		$close();
	};
	on.fnReloadAppCard = function () {
		$param.call && $param.call.reload();
	};
	
	on.fnSubmitAppCard = function () {
		if (deviceInfo.mode.indexOf('local') > -1 //|| deviceInfo.mode.indexOf('dev') > -1
				) {
			$param.call && $param.call.dev();
			return;
		}

		$svc.get('http').json('/mob/cmm/MOBFMAUTH/PesnAppCardAuthCheck.ajax', {
			gubun: 'A',
			appcTsId: appcTsId
		}, 'not').then(function (rsHttp) {
			if (!rsHttp || rsHttp.NC_RCD != '0004') {
				if(rsHttp.NC_RCD == '0022') {
					$close({
						succeed: false,
						message: '앱카드 인증이 진행되지 않았습니다.'
					});
					return;
				} else {
					$close({
						succeed: false,
						message: '인증처리실패<br/>' + rsHttp.NC_RCD
					});
					return;
				}
			}
			if(rsHttp.NC_RCD == '0004') {
				$close({
					succeed: true,
					message: '인증되었습니다.'
				});
			}
		}, function () {
			$close({
				succeed: false,
				message: ''
			});
		});
	};
});

$svc.plugin('appCardAuth', function ($param) {
	var url = "/mob/cmm/MOBFMAUTH/";
	// state == true : 로그인 화면
	if($param.state) {
		url += "appCardAuthLoginQr.ahtml";
	} else { // 다른 인증 수단 화면
		url += "appCardAuthQr.ahtml";
	}
	
	var vo = $svc.bind({name:'appCardAuth', plugin:true, url:url});
	var on = vo.event();
	var appcTsId = $param.appcTsId;
	var pollKey = $param.pollKey; // 폴링
	var popState = true;
	
	$param.call && ($param.call.setAppcTsId = function (changId){
		appcTsId = changId;
	});
	
	vo.render(function() {
		ui.layerComm.open();
		
		$('#appcStN').html($param.appcStN);		
	});

	// 새로고침 이벤트
	on.fnReloadAppCard = function () {
		if($param.state && $(".pesn-auth").hasClass("expire")) { // state == true : 로그인 화면
			$(".pesn-auth").removeClass("expire");
			var subtxt = '신한 SOL페이 앱에서 QR스캔&middot;결제코드입력 버튼을 눌러<br>QR코드를 촬영하거나 결제코드를 입력해주세요.';
			$(".pesn-auth-subtxt").html(subtxt);
		} else { // 다른 인증 수단 화면
			if($("#pesnAuthTabLICont06").find($(".join_con_text")).hasClass("dx_expiration")) {
				$("#pesnAuthTabLICont06").find($(".join_con_text")).removeClass("dx_expiration");
			}
		}
		$param.call && $param.call.reload();
	};
	
	// 로컬 or 개발 일 때 QR 클릭 시 P고객정보 입력 창 띄우기
	on.inputPNum = function () {
		window.open('/pjsp/dev/pesnAuth/t06.jsp', 'dev');
		$param.dev_next();
	}
	
	// 폴링 Setting
	pollKey = setInterval(function () {
		var playChk = $("#appcardTimer").attr("playChk");
		if(playChk == "1") {
			if($("#appcardTimer").text() != "00분 00초") {
				$svc.get('http').json('/mob/cmm/MOBFMAUTH/PesnAppCardAuthCheck.ajax', {
					gubun: 'A',
					appcTsId: appcTsId
				}, 'not').then(function (rsHttp) {
					if(rsHttp.NC_RCD == '0004') { // 인증 완료 시
						clearInterval(pollKey);
						$param.callback($param, true, '인증되었습니다.');
					} else if(rsHttp.NC_RCD == '0022') { // 폴링으로 인하여 인증 여부 판단 -> 인증 진행 안되었을 때

					} else { // 인증 실패 시
						clearInterval(pollKey);
						return $svc.get('popup').alert('인증처리실패<br/>');
					}
				}, function () {
					clearInterval(pollKey);			
				});
			} else {
				//clearInterval(pollKey); // 폴링 종료
				// 기간 만료시 상단 영역에 클래스 추가
				if($param.state) { // state == true : 로그인 화면
					$(".pesn-auth").addClass("expire");
					var subtxt = '인증시간이 만료되었습니다.<br>[새로고침] 후 다시 시도해 주세요.';
					$(".pesn-auth-subtxt").html(subtxt);
				} else { // 다른 인증 수단 화면
					$("#pesnAuthTabLICont06").find($(".join_con_text")).addClass("dx_expiration");
				}
				if(popState) {
					popState = false;
					$svc.get('popup').alert("제한시간이 경과되었습니다. 다시 이용해 주세요.").then(function() {
						popState = true;
						// 자동 새로고침
						on.fnReloadAppCard();
					});
				}
			}
		} else if(playChk != "0") {
			clearInterval(pollKey);
		}
	}, 3000);
	
	// 폴링 값 담기
	chkPollKey = pollKey;
});

$svc.service('Native', function () {
	var o = {};
	/**
	 * 앱 실행 관련 API
	 */

	// 신한 앱 실행
	o.executeShinhanApp = function (param, callback) {
		$log('shpa_executeShinhanApp : send ');
		send('shpa_executeShinhanApp', JSON.stringify(param), function (data) {
			if (typeof (data) == 'string') {
				data = JSON.parse(data);
			}
			$log('shpa_executeShinhanApp : callback ', data);
			callback(data);
		});
	};

	// 앱 설치체크
	o.appInsChk = function (param, callback) {
		$log('appInsChk : send ');
		var obj = {};
		if (deviceInfo.os == 'android') {
			obj.packageName = param.packageName;
		} else {
			obj.packageName = param.schemeName;
		}

		send('shpa_appInsChk', JSON.stringify(obj), function (data) {
			if (typeof (data) == 'string') {
				data = JSON.parse(data);
			}
			$log('shpa_appInsChk : callback ', data);
			callback(data);
		});
	};


	/**
	 * Device 및 Config 관련 API
	 */
	// 인증키값 가져오기.
	o.getAuthKey = function (obj, callback) {
		$log('shpa_getAuthKey : send ');
		send('shpa_getAuthKey', JSON.stringify(obj), function (data) {
			if (typeof (data) == 'string') {
				data = JSON.parse(data);
			}
			$log('shpa_getAuthKey : callback ', data);
			callback(data);
		});
	};

	// 인증키값 설정.
	o.setAuthKey = function (obj, callback) {
		$log('shpa_setAuthKey : send ');
		send('shpa_setAuthKey', JSON.stringify(obj), function (data) {
			if (typeof (data) == 'string') {
				data = JSON.parse(data);
			}
			$log('shpa_setAuthKey : callback ', data);
			callback(data);
		});
	};

	// AppHmac
	o.getAppHmac = function (obj, callback) {
		$log('shpa_getAppHmac : send');
		send('shpa_getAppHmac', JSON.stringify(obj), function (data) {
			$log('shpa_getAppHmac', data);
			if (typeof (data) == 'string') {
				data = JSON.parse(data);
			}
			$log('shpa_getAppHmac : callback ', data);
			callback(data);
		});
	};

	// DeviceInfo
	o.getDeviceInfo = function (obj, callback) {
		$log('shpa_getDeviceInfo : send');
		send('shpa_getDeviceInfo', {}, function (data) {
			if (typeof (data) == 'string') {
				data = JSON.parse(data);
			}
			$log('shpa_getDeviceInfo : callback ', data);
			callback(data);
		});
	};

	// 보안키패드 초기화
	var keySec_retry = 0;
	o.setKeySecKbd = function (obj, callback) {
		$log('shpa_setKeySecKbd : send');
		$svc.get('http').json('/mob/cmm/COMMON/IncaNosPublicKeyC.ajax', {}, 'not').then(function (rsHttp) {
			if (!rsHttp) return;
			send('shpa_setKeySecKbd', JSON.stringify(rsHttp), function (data) {
				if (typeof (data) == 'string') data = JSON.parse(data);
				if (data.res != 'ok') {
					return $svc.get('popup').alert('잠시 후 다시 시도 해주세요.').then(function() {
						if (++keySec_retry < 3)
							setTimeout(function(){ o.setKeySecKbd(obj, callback); }, 100);
					});
				} else {
					keySec_retry = 0;
					var frm = document.frm;
					if (obj && obj.frm)
						frm = obj.frm;
					if($('#incaNos_publicKey').length > 0)$('#incaNos_publicKey').remove();
					if($('#incaNos_uuid').length > 0)$('#incaNos_uuid').remove();
					$('<input></input>').attr({type:'hidden', name:'incaNos_publicKey', id:'incaNos_publicKey', value:rsHttp.publicKey}).appendTo(frm);
					$('<input></input>').attr({type:'hidden', name:'incaNos_uuid', id:'incaNos_uuid', value:rsHttp.uuid}).appendTo(frm);
				}
			});
		}, function (error) {
			$svc.get('popup').alert('잠시 후 다시 시도 해주세요.').then(function() {
				if (++keySec_retry < 3)
					setTimeout(function(){ o.setKeySecKbd(obj, callback); }, 100);
			});
		});
	};

	// 로그인데이터 세팅
	o.setLoginTime = function (obj, callback) {
		$log('shpa_setLoginTime : send');
		send('shpa_setLoginTime', JSON.stringify(obj), function (data) {
			if (typeof (data) == 'string') {
				data = JSON.parse(data);
			}
			$log('shpa_loginTime : callback ', data);
			callback(data);
		});
	};

	// 환경설정 smartArs 설정
	o.setSmartArsOnOff = function (obj, callback) {
		$log('shpa_setSmartArsOnOff : send');
		send('shpa_setSmartArsOnOff', JSON.stringify(obj), function (data) {
			if (typeof (data) == 'string') {
				data = JSON.parse(data);
			}
			$log('setSmartArsOnOff : callback ', data);
			callback(data);
		});
	};

	// 환경설정 smartArs 설정
	o.getSmartArsOnOff = function (obj, callback) {
		$log('shpa_getSmartArsOnOff : send');
		send('shpa_getSmartArsOnOff', JSON.stringify(obj), function (data) {
			if (typeof (data) == 'string') {
				data = JSON.parse(data);
			}
			$log('shpa_getSmartArsOnOff : callback ', data);
			callback(data);
		});
	};


	// 환경설정 뱃지설정
	o.setBadgeVisible = function (obj, callback) {
		$log('shpa_setBadgeVisible : send');
		send('shpa_setBadgeVisible', JSON.stringify(obj), function (data) {
			if (typeof (data) == 'string') {
				data = JSON.parse(data);
			}
			$log('shpa_setBadgeVisible : callback ', data);
			callback(data);
		});
	};

	// 환경설정 뱃지설정
	o.getBadgeVisible = function (obj, callback) {
		$log('shpa_getBadgeVisible : send');
		send('shpa_getBadgeVisible', JSON.stringify(obj), function (data) {
			if (typeof (data) == 'string') {
				data = JSON.parse(data);
			}
			$log('shpa_getBadgeVisible : callback ', data);
			callback(data);
		});
	};

	// Push RegistrationID
	o.getPushRegistrationID = function (obj, callack) {
		$log('shpa_getPushRegistrationID : send');
		send('shpa_getPushRegistrationID', JSON.stringify(obj), function (data) {
			if (typeof (data) == 'string') {
				data = JSON.parse(data);
			}
			$log('shpa_getPushRegistrationID : callack ', data);
			callack(data);
		});
	};

	// Push 디바이스 동의 설정
	o.setPushDeviceAgree = function (obj, callback) {
		$log('shpa_setPushDeviceAgree : send');
		send('shpa_setPushDeviceAgree', JSON.stringify(obj), function (data) {
			if (typeof (data) == 'string') {
				data = JSON.parse(data);
			}
			$log('shpa_setPushDeviceAgree : callback ', data);
			callback(data);
		});
	};

	// Push 사용자 동의 설정
	o.setPushRestAgree = function (obj, callback) {
		$log('shpa_setPushRestAgree');
		send('shpa_setPushRestAgree', JSON.stringify(obj), function (data) {
			if (typeof (data) == 'string') {
				data = JSON.parse(data);
			}
			$log('shpa_setPushRestAgree : callback ', data);
			callback(data);
		});
	};


	// Push 동의여부 (디바이스, 사용자 둘다)
	o.getPushAgreeInfo = function (obj, callback) {
		$log('shpa_getPushAgreeInfo : send');
		send('shpa_getPushAgreeInfo', JSON.stringify(obj), function (data) {
			if (typeof (data) == 'string') {
				data = JSON.parse(data);
			}
			$log('shpa_getPushAgreement : callback ', data);
			callback(data);
		});
	};

	// 새로운 푸시 갯수
	o.getNewPushCount = function (obj, callback) {
		$log('shpa_getNewPushCount : send');
		send('shpa_getNewPushCount', '{}', function (data) {
			if (typeof (data) == 'string') {
				data = JSON.parse(data);
			}
			$log('shpa_getNewPushCount : callback ', data);
			callback(data);
		});
	};


	// Push 리스트 Web 용
	o.getPushList = function (obj, callback) {
		$log('shpa_getPushList : send');
		send('shpa_getPushList', JSON.stringify(obj), function (data) {
			if (typeof (data) == 'string') {
				data = JSON.parse(data);
			}
			$log('shpa_getPushList : callback ', data);
			callback(data);
		});
	};
	// Push 리스트 Native App으로 이동
	o.goPushList = function (obj, callback) {
		$log('shpa_goPushList : send');
		send('shpa_goPushList', JSON.stringify(obj), function (data) {
			if (typeof (data) == 'string') {
				data = JSON.parse(data);
			}
			$log('shpa_goPushList : callback ', data);
			callback(data);
		});
	};


	// Push 동의여부 (디바이스, 사용자 둘다)
	o.getPushDetail = function (obj, callback) {
		$log('shpa_getPushDetail : send');
		send('shpa_getPushDetail', JSON.stringify(obj), function (data) {
			if (typeof (data) == 'string') {
				data = JSON.parse(data);
			}
			$log('shpa_getPushDetail : callback ', data);
			callback(data);
		});
	};

	// 외부브라우져 열기
	o.openBrowser = function (obj, callback) {
		$log('shpa_openBrowser : send');
		send('shpa_openBrowser', JSON.stringify(obj), function (data) {
			if (typeof (data) == 'string') {
				data = JSON.parse(data);
			}
			$log('shpa_openBrowser : callback ', data);
			callback(data);
		});
	};

	o.appScraping = function (obj, callback) {

		// scrap svc code
		var str_svccode = 'm9100106';  // 건강보험
		var pnz_svccode = 'm9110110';  // 연금공단
		var nts_svccode = 'm9079002';  // 국세청(홈텍스)

		var svcorder_t;

		if (undefined == obj.svcorder || obj.svcorder == null) {
			if (obj.svctype == 'card') {
				svcorder_t = ['str', 'pnz'];
			} else {
				svcorder_t = ['str'];
			}
		} else {
			svcorder_t = obj.svcorder;
		}

		var flag_str = 'N';
		var flag_pnz = 'N';
		var flag_nts = 'N';

		for (i = 0; i < svcorder_t.length; i++) {
			if (svcorder_t[i] == 'str') {
				flag_str = 'Y';
			} else if (svcorder_t[i] == 'pnz') {
				flag_pnz = 'Y';
			} else if (svcorder_t[i] == 'nts') {
				flag_nts = 'Y';
			}
		}

		// FAN App내 Scraping 적용
		//if(deviceInfo.app=='shcardapp' || ( deviceInfo.app == 'shfanapp' && flag_nts == 'N') ){
		if (deviceInfo.app == 'shcardapp' || deviceInfo.app == 'shfanapp') {
			$log('shpa_appScraping : send [' + deviceInfo.app + ']');

			// 국세청 버전체크 로직 추가
			// FAN 내 국세청 스크래핑 추가 3.8.1
			var chk_ver = 501;  //5.0.1

			if (deviceInfo.app == 'shcardapp') {

				if (flag_nts == 'Y') {
					// 국세청
					chk_ver = 512;
				} else {
					// 기존 로직
					if (deviceInfo.os == 'android') {
						chk_ver = 502;
					} else {
						chk_ver = 503;
					}
				}
			} else if (deviceInfo.app == 'shfanapp') {
				if (flag_nts == 'Y')
					chk_ver = 381;
				else
					chk_ver = 376;
			}

			//버전체크 하여 일정버전 이상이면 진행
			//일정버전 이하이면 svctype=card 를 제외한 나머지는 스크래핑 불가메세지 출력

			// shcardapp 현재버전 5.0.1 보다 이후 버전에서만 호출 가능함
			// shfanapp 현재버전 3.7.6 보다 이후 버전에서만 호출 가능함

			var ver;
			send('shpa_appVersion', {}, function (data) {
				if (typeof (data) == 'string') data = JSON.parse(data);
				if (data && data.ver) {
					ver = data.ver.replace(/\./gi, '');
				}

				// svccode exchange
				var svclist = obj.svcorder;
				var n_svclist = [];
				for (i = 0; i < svclist.length; i++) {
					if (svclist[i] == 'str') {
						n_svclist.push(str_svccode);
					} else if (svclist[i] == 'pnz') {
						n_svclist.push(pnz_svccode);
					} else if (svclist[i] == 'nts') {
						n_svclist.push(nts_svccode);
					}
				}
				obj.svcorder = n_svclist;

				if (ver && parseInt(ver, 10) >= chk_ver) {

					// Scraping
					go_scrap(obj, callback);
					//					send('shpa_appScraping', JSON.stringify( obj), function(data) {
					//
					//				    	if(typeof(data) == 'string'){
					//				    		data = JSON.parse(data);
					//				    	}
					//				    	$log('shpa_appScraping : callback ' , data);
					//				    	callback (data);
					//				    });
				} else {
					//체크버전 이하일 경우는 card 일때만 동작
					if (obj.svctype == 'card' && deviceInfo.app == 'shcardapp') {
						// Scraping
						go_scrap(obj, callback);

						//						send('shpa_appScraping', JSON.stringify( obj), function(data) {
						//					    	if(typeof(data) == 'string'){
						//					    		data = JSON.parse(data);
						//					    	}
						//							$log('shpa_appScraping : callback ' , data);
						//					    	callback (data);
						//					    });
					} else {
						$svc.get('popup').alert('스크래핑은 최신앱으로 업데이트 후에 이용 가능합니다.');
					}
				}
			});


		} else {
			if (deviceInfo.os == 'windows nt') {
				window.open('/pjsp/dev/pesnAuth/scraping.jsp', 'dev');
				window.devScraping = function (data) {
					callback && callback(data);
				}
				return;
			}

			if (obj.svctype == 'card') {
				checkApplicationInstall('shfanapp', JSON.stringify(obj), '', 'shinhanfanscrapingv1');
			} else {
				checkApplicationInstall('shcardapp', JSON.stringify(obj), '', 'smshinhanscraping');
			}

		}
	};

	//스크래핑(플라이하이)
	o.appFHScraping = function ( obj, callback){
		// scrap svc code
		var str_svccode = 'm9100106';  // 건강보험
		var pnz_svccode = 'm9110110';  // 연금공단
		var nts_svccode = 'm9079002';  // 국세청(홈텍스)
		var gov_k_svccode = 'm9030022';  // 정부24(가맹점)
		var gov_o_svccode = 'm9230010';  // 정부24(직장인)
		var gov_b_svccode = 'm9170025';  // 정부24(사업자)

		var svcorder_t;

		if(undefined == obj.svcorder || obj.svcorder == null){
			if(obj.svctype == 'card'){
				svcorder_t = ['str','pnz'];
			}else{
				svcorder_t = ['str'];
			}
		}else{
			svcorder_t = obj.svcorder;
		}

		if(deviceInfo.app=='shcardapp'){
			$log('shpa_appScraping : send ['+deviceInfo.app+']');

			var chk_ver = 522;  //5.2.2
//			if(deviceInfo.app=='shcardapp'){
//				if (deviceInfo.os =='android'){
//					chk_ver = 502;
//				} else {
//					chk_ver = 503;
//				}
//			}

			var ver;
			send('shpa_appVersion', {}, function(data) {
				if(typeof(data) == 'string') data = JSON.parse(data);
				if ( data && data.ver ) {
					ver = data.ver.replace(/\./gi, '');
				}

				// svccode exchange
				var svclist = obj.svcorder;
				var n_svclist = [];
				for(i=0; i< svclist.length; i++){
					if(svclist[i] == 'str'){
						n_svclist.push(str_svccode);
					} else if(svclist[i] == 'pnz'){
						n_svclist.push(pnz_svccode);
					} else if(svclist[i] == 'nts'){
						n_svclist.push(nts_svccode);
					} else if(svclist[i] == 'gov_k'){
						n_svclist.push(gov_k_svccode);
					} else if(svclist[i] == 'gov_o'){
						n_svclist.push(gov_o_svccode);
					} else if(svclist[i] == 'gov_b'){
						n_svclist.push(gov_b_svccode);
					}
				}
				obj.svcorder = n_svclist;

				if ( ver && parseInt(ver,10) >= chk_ver ) {
//					 go_scrap(obj, callback);
					send('shpa_appFHScraping', JSON.stringify( obj), function(data) {
				    	if(typeof(data) == 'string'){
				    		data = JSON.parse(data);
				    	}
				    	$log('shpa_appFHScraping : callback ' , data);
				    	callback (data);
				    });
				} else {
				    $svc.get('popup').alert('스크래핑은 최신앱으로 업데이트 후에 이용 가능합니다.');
				}
			});
		} else {
			if(deviceInfo.os == 'windows nt') {
				window.open('/pjsp/dev/pesnAuth/scraping.jsp', 'dev');
				window.devScraping = function(data) {
					callback && callback (data);
				}
				return;
			}

			if(obj.svctype == 'card'){
				checkApplicationInstall ('shfanapp', JSON.stringify(obj),'','shinhanfanscrapingv1');
			}else{
				checkApplicationInstall ('shcardapp',JSON.stringify(obj),'','smshinhanscraping');
			}
		}
	};
	o.appPopup = function (obj, callback) {
		if (deviceInfo.app == 'shcardapp') {
			$log('shpa_popup : send');
			send('shpa_popup', JSON.stringify(obj), function (data) {
				if (typeof (data) == 'string') {
					data = JSON.parse(data);
				}
				$log('shpa_popup : callback ', data);
				callback(data);
			});
		}
	}

	o.smsReceiver = function () {
		if (deviceInfo.app == 'shcardapp' && deviceInfo.os == 'android') {
			$log('shpa_smsReceiver : send');
			send('shpa_smsReceiver', "{}", function (data) {
			});
		}
	};

	// 2018.01.17. 시작페이지 설정
	o.setStartPage = function (obj, callback) {
		$log('shpa_setStartPage : send');
		send('shpa_setStartPage', JSON.stringify(obj), function (data) {
			if (typeof (data) == 'string') {
				data = JSON.parse(data);
			}
			$log('shpa_setStartPage : callback ', data);
			callback(data);
		});
	};

	// FAN App Push 동의 설정
	o.setPushInfo = function (obj, callback) {
		send('shpa_setPushInfo', obj, function (data) {
			if (typeof (data) == 'string') data = JSON.parse(data);

			$log('shpa_setPushInfo : callback ', data);
			callback(data);
		});
	};

	// 등록지문확인 - 단말기 지문인증 등록여부
	o.isTouchIDRegisterDevice = function (obj, callback) {
		send('shpa_isTouchIDRegisterDevice', obj, function (data) {
			if (typeof (data) == 'string') data = JSON.parse(data);

			$log('shpa_isTouchIDRegisterDevice : callback ', data);
			callback(data);
		});
	};

	// 등록지문확인 - FIDO 등록여부
	o.isUserRegisterTouchID = function (obj, callback) {
		send('shpa_isUserRegisterTouchID', obj, function (data) {
			if (typeof (data) == 'string') data = JSON.parse(data);

			$log('shpa_isUserRegisterTouchID : callback ', data);
			callback(data);
		});
	};

	// 지문등록 - FIDO 사용자 등록
	o.registTouchID = function (obj, callback) {
		send('shpa_registTouchID', obj, function (data) {
			if (typeof (data) == 'string') data = JSON.parse(data);

			$log('shpa_registTouchID : callback ', data);
			callback(data);
		});
	};

	// 지문삭제 - FIDO 사용자 해제
	o.unregistTouchID = function (obj, callback) {
		send('shpa_unregistTouchID', obj, function (data) {
			if (typeof (data) == 'string') data = JSON.parse(data);

			$log('shpa_unregistTouchID : callback ', data);
			callback(data);
		});
	};

	// 지문 로그인 - FIDO 사용자 인증
	o.authTouchID = function (obj, callback) {
		send('shpa_authTouchID', obj, function (data) {
			if (typeof (data) == 'string') data = JSON.parse(data);

			$log('shpa_authTouchID : callback ', data);
			callback(data);
		});
	};

	o.isNewFanApp = function(callback){
		if (deviceInfo.app != 'shfanapp') {
			callback(false);
			return;
		}

		send('shpa_appVersion', {}, function (data) {
			if (typeof (data) == 'string') data = JSON.parse(data);
			if (data && data.ver) {
				ver = data.ver.replace(/\./gi, '');
			}

			// 2020 NEW FanApp 4.0.0
			if (ver && parseInt(ver, 10) >= 400) {
				callback(true);
			}else {
				callback(false);
			}
		});
	}

	return o;
});

// scraping block logic
// 인자 EBcode
function go_scrap(obj, callback) {
	$svc.get('http').json('/mob/cmm/MOBUTIL/isBlockScrap.ajax'
		, { chk_code: 'EB0316' }
		, 'not').then(function (rsHttp) {
			// block_std : YYYYMMDDHH24MISS  block 시작일시
			// block_edd : YYYYMMDDHH24MISS  block 종료일시
			// today_time : YYYYMMDDHH24MISS  server시간
			// 시작일시와 종료일시 사이일 경우 scrap block 처리
			// 2017.11.23 오픈여부를 ajax 에서 점검하여 내리는것으로 변경
			// block_yn : Y/N

			var block_yn = 'N'

			// 정상응답이 아닐경우 스크래핑 진행
			if (!rsHttp || !rsHttp.block_yn || rsHttp.block_yn != 'Y') {
				block_yn = 'N';
			} else {
				block_yn = 'Y';
			}
			// 정상응답이면서 시작일시와 종료일시 사이일 경우 scrap block 처리
			if (block_yn == 'Y') {
				$svc.get('popup').alert('건강보험공단 개편 작업으로 자동 소득 확인이 잠시 불가합니다. 상품 신청은 가능하시오니 계속 진행해 주세요.').then(function () {
					callback({ "res": "NOK" });
					return;
				});

				return;
			} else {
				// Scraping
				send('shpa_appScraping', JSON.stringify(obj), function (data) {
					if (typeof (data) == 'string') {
						data = JSON.parse(data);
					}
					$log('shpa_appScraping : callback ', data);
					callback(data);
				});
			}
		});
}


function shpw_ansimclick(ansimJson) {
	if (typeof (ansimJson) == 'string') {
		ansimJson = JSON.parse(ansimJson);
	}
	setTimeout(function () {
		var obj = { ssn2: ansimJson.pkey };
		$svc.get('http').json('/mob/cmm/COMMON/AnsimSsnDescC.ajax', obj).then(function (rsHttp) {
			if (!rsHttp) return;

			var signData = "acctid: " + ansimJson.acctid + "\n" + "amount: " + ansimJson.amount + "\n";
			var fnData = {
				ansimMode: true
				, __signData__: signData
				, __signTitle__: "안심클릭 전자서명"
				, acctid: ansimJson.acctid
				, pkey: ansimJson.pkey
			};
			var serviceName = '000';
			var fjumin1 = rsHttp.ssn1;

			var authData = "fjumin1=" + fjumin1 + "&serviceName=" + serviceName;
			authData += "&__signData__=" + fnData.__signData__;
			authData += "&__signTitle__=" + fnData.__signTitle__;
			authData += "&acctid=" + fnData.acctid;
			authData += "&pkey=" + fnData.pkey;

			var forSign = {};
			forSign.origine_message = authData;
			forSign.title = '신한카드 안심클릭 서비스';
			send('shpa_getSignedMessage', JSON.stringify(forSign), function (data) {
				if (typeof (data) == 'string') {
					data = JSON.parse(data);
				}
				if (data.res == 'ok') {
					var request = {};
					request.pkcs7SignedData = data.signed_message;
					request.acctid = ansimJson.acctid;
					request.pkey = ansimJson.pkey;
					request.serviceName = serviceName;
					request.fjumin1 = fjumin1;

					$svc.get('http').json('/mob/cmm/COMMON/AnsimCertAuthC.ajax', request).then(function (rsHttp2) {
						if (!rsHttp2) return;
						$svc.get('popup').alert('안심클릭 공동인증서(구 공인인증서) 제출이 완료됐습니다.').then(function () {
							send('shpa_moveTaskToBack', "{}", function (data) {
							});
						});;
					}, function (error) {
						$svc.get('popup').alert('안심클릭 공동인증서(구 공인인증서) 제출에 실패하였습니다.').then(function () {
							send('shpa_moveTaskToBack', "{}", function (data) {
							});
						});;;
					});
				}
			});

		},
			function (error) {
				$svc.get('popup').alert('안심클릭데이터 초기화 오류');
			});
	}, 1000);
}

//fan 랜딩페이지 이용하기버튼 이벤트
function fanBannerIns(screenId, fanUrl, isChanged) {	//screenId : 와이즈코드, fanUrl : 2뎁스url또는제휴사url, isChanged : 모바일판변환여부
	// 개발모드에 따른 url분기처리
	var tarUrl;
	if (fanUrl.indexOf("http") > -1) {
		tarUrl = fanUrl;
	} else {
		if (deviceInfo.mode == "run") {
			tarUrl = "https://appcard2.shinhancard.com" + fanUrl;
		} else {
			var locationUrl = location.href;
			if (locationUrl.indexOf("//tstprj") > -1) {
				tarUrl = "https://tst-appcard2.shinhancard.com" + fanUrl;
			} else {
				tarUrl = "https://dev-appcard2.shinhancard.com" + fanUrl;
			}
		}
	}
	// userAgent를 이용한 분기처리
	var fanAgent = navigator.userAgent;
	if (fanAgent.indexOf("shfanapp") > -1) {
		// 신한FAN앱일경우
		location.href = tarUrl;
	} else {
		// 신한모바일판웹일 경우
		// isChanged      true : 변환대상       false : 변환대상아님
		if (isChanged) {
			location.href = tarUrl;
		} else {
			if (fanAgent.match(/Android/i)) {
				//alert('신한앱카드 앱 실행 - Android');
				var url = 'intent://goto_screen?screenid=' + screenId + '#Intent;scheme=shinhan-appcard;package=com.shcard.smartpay;end;'; // intent값 설정
				window.top.location.href = url;
			} else if (fanAgent.match(/iPhone/i) || fanAgent.match(/iPad/i) || fanAgent.match(/iPod/i)) {
				//alert('신한앱카드 앱 실행 - ios');
				var clickAt = +new Date;
				var url = "";
				setTimeout(function () {
					var now = +new Date;
					if (now - clickAt < 2000) {
						//alert("ios 설치")
						url = 'https://itunes.apple.com/kr/app/sinhankadeu-sinhan-aebkadeu/id572462317?mt=8'; //ios appstore 이동
						window.top.location.href = url;
					}
				}, 1500);
				//alert("ios실행")
				url = 'shinhan-appcard://goto_screen?screenid=' + screenId; // ios 앱스킴값 설정
				window.top.location.href = url;
			} else {
				alert('신한 F\'AN페이(앱카드) 이용은 Android 또는 iOS 단말에서만 이용 가능합니다.');
			}
		}
	}
}


function openAppUrl(url) {
	deviceInfo.app ? send('shpa_openBrowser', JSON.stringify({ url: url })) : window.open(url);
}

// C2020062975633 챗봇 UI 추가
function openWebView(url, param) {

	if (deviceInfo.app == 'shcardapp' || deviceInfo.app == 'shfanapp') { // 신한카드앱
																			// or
																			// 페이판
		deviceInfo.app ? send('shpa_openWebView', JSON.stringify({
			url : url,
			param : param
		})) : window.open(url);
	} else if (deviceInfo.mobile == true && deviceInfo.app != 'shcardapp'
			&& deviceInfo.app != 'shfanapp') {// 신한카드 모바일웹일경우
		
		
		if (deviceInfo.os != 'android') {
			window.addEventListener('message', function(event){
				if(event.data === 'chatBotBtnFocusMsg' ){
					setChatBotFocus();
				}
			});
		}
		
		window.open(url);
		
	} else {// 신한카드 pc화면
		window.open(url, "신한카드_챗봇 파니(FANI)","width=460,height=720,resizable=0;");
	}


}


function openFileView(url, target) {
	if (deviceInfo.app) {
		var urlArry = url.split('?');
		var link = urlArry[0];

		if (urlArry.length > 1) {
			var param = urlArry[1];
			param = encodeURI(param);
			url = link + '?' + param;
		}

		if (url.indexOf('http') == -1) {
			if (deviceInfo.mode == 'local' || deviceInfo.mode == 'dev') {
				url = 'https://devprj2-www.shinhancard.com' + url;
			} else if (deviceInfo.mode == 'tst') {
				url = 'https://tstprj2-www.shinhancard.com' + url;
			} else {
				url = 'https://www.shinhancard.com' + url;
			}
		}

		send('shpa_openBrowser', JSON.stringify({ url: url }));
	}else {
		if (target && target.download) {
			target.href = target.download;
			return true;
		}
		location.href = url;
	}

	return false;
}

//마이오토앱 Load
function fnLoadMyAuto(next_url) {
	// 'next_url=/adp/ADPFM155N/ADPFM155R01.shc'
	var http = $svc.get('http');

	var domain = 'https://myauto.shinhancard.com';
	if (deviceInfo.mode.indexOf('dev') > -1) {
		domain = 'https://dev-myauto.shinhancard.com';
	} else if (deviceInfo.mode.indexOf('tst') > -1) {
		domain = 'https://tst-myauto.shinhancard.com';
	} else if (deviceInfo.mode.indexOf('local') > -1) {
		domain = 'https://dev-myauto.shinhancard.com';
	}
	var url = domain + '/adp/ADPFM001N/ADPFM001C07.shc?next_url=' + next_url;

	// 5.1.2 버전 이상에서 아래 기능이 실행 되도록 한다.
	// 2018.12.05 5.1.3 버전으로 수정함.
	if (deviceInfo.app) {
		if (deviceInfo.app == 'shcardapp' || deviceInfo.app=='shfanapp') {
			url = domain + next_url;
			openAppUrl(url);
			/*
			$log('shpa_appScraping : send');
			var chk_ver = 513;  //5.1.3
			var ver;
			send('shpa_appVersion', {}, function (data) {
				if (typeof (data) == 'string') data = JSON.parse(data);
				if (data && data.ver) {
					ver = data.ver.replace(/\./gi, '');
				}
				if (ver && parseInt(ver, 10) >= chk_ver) {
					//체크버전 이상일 경우
					var param = {};

					if ($menu.login) {
						http.json('/adp/ADPLOGINN/regAuthToken.ajax', param).then(function (rsHttp) {
							if (!rsHttp) return;
							$log("[regAuthToken] rsHttp : " + JSON.stringify(rsHttp));
							openWebView(url, rsHttp.token);

						}, function (error) {
							$log('오류');
						});
					} else {
						// 비로그인 상태에서는 next_url 화면으로 바로 진입.
						url = domain + next_url;
						openWebView(url, '');
					}
				} else {


					url = domain + next_url;
					openAppUrl(url);

					//5.1.3 버전 배포전 임시 주석처리
					//체크버전(5.1.3) 이전일 경우 (5.1.2 버전까지 해당)
					var msg = '앱을 업데이트 하시면 편리하게 MyAUTO 서비스 이용이 가능합니다.<br/>스토어로 이동하시겠습니까?';
					$svc.get('popup').confirm(msg).then(function(yn){
						if(yn){
							// 신한카드앱 스토어로 이동 처리.
							gotoApplicationStore('shcardapp');
						} else {
							url = domain + next_url;
							openAppUrl(url);
						}
					});
				}
			});*/
		} else {
			$svc.get('popup').alert('서비스 이용 지원이 되지 않는 앱입니다.(' + deviceInfo.app + ')');
		}
	} else {
		// 모바일웹인 경우
		//openAppUrl(url);
		// 2018.10.10. 모바일웹은 신규창으로 오토앱화면을 연다.
		var popup = window.open('about:blank');

		if ($menu.login) {
			var param = {};

			http.json('/adp/ADPLOGINN/regAuthToken.ajax', param).then(function (rsHttp) {
				if (!rsHttp) return;
				//$log("[regAuthToken mobweb] rsHttp : " + JSON.stringify(rsHttp));
				//openWebView(url, rsHttp.token);
				var date = new Date();
				var cookie_domain = "shinhancard.com";
				var min = 10;
				date.setTime(date.getTime() + (min * 60 * 1000));
				$log('date.toGMTString()', date.toGMTString());
				document.cookie = "MOBToken=" + escape(rsHttp.token) + "; path=/; expires=" + date.toGMTString() + "; domain=" + escape(cookie_domain);
				popup.location.href = url;

			}, function (error) {
				$log('오류');
			});
		} else {
			var date = new Date();
			var cookie_domain = "shinhancard.com";
			var min = 10;
			date.setTime(date.getTime() + (min * 60 * 1000));
			$log('date.toGMTString()', date.toGMTString());
			document.cookie = "MOBToken=; path=/; expires=" + date.toGMTString() + "; domain=" + escape(cookie_domain);

			url = domain + next_url;
			popup.location.href = url;
		}

	}

};

//마이카 Load
function fnLoadMyCar(next_url) {
	var http = $svc.get('http');
	var domain = myCarDomain();
	var url = domain + next_url;

	if(!$menu.login) return openAppUrl(url);

	http.json('/adp/ADPLOGINN/regAuthToken.ajax')
	.then(function (rsHttp) {
		openAppUrl(rsHttp ? myCarAuthUrl(rsHttp) : url);
	}, function (error) {
		openAppUrl(url);
	});


	function myCarAuthUrl(rsHttp) {
		$log("[regAuthToken mobweb] rsHttp : ", rsHttp);
		return [
			domain,
			'/adp/ADPFM001N/ADPFM001C07.shc?next_url=',
			next_url,
			"&MOBToken=",
			encodeURIComponent(rsHttp.token)
		].join('');
	}
	function myCarDomain() {
		switch(deviceInfo.mode) {
		case 'dev':
			return 'https://devprj2-mycar.shinhancard.com';
		case 'tst':
		case 'local':
			return 'https://tstprj2-mycar.shinhancard.com';
		default:
			return 'https://mycar.shinhancard.com';
		}
	}
};


//신한카드법인 Load
function fnLoadShcCorp(next_url) {
	// 'next_url=/adp/ADPFM155N/ADPFM155R01.shc'
	var http = $svc.get('http');

	var domain = 'https://www.shinhancard.com';
	if (deviceInfo.mode.indexOf('dev') > -1) {
		domain = 'https://devprj2-www.shinhancard.com';
	} else if (deviceInfo.mode.indexOf('tst') > -1) {
		domain = 'https://tstprj2-www.shinhancard.com';
	} else if (deviceInfo.mode.indexOf('local') > -1) {
		domain = 'https://devprj2-www.shinhancard.com';
	}
	var url = domain + next_url;

	// 5.1.6 버전 이상에서 아래 기능이 실행 되도록 한다.
	if (deviceInfo.app) {
		if (deviceInfo.app == 'shcardapp') {
			$log('shpa_appScraping : send');
			var chk_ver = 516;  //5.1.6
			var ver;
			send('shpa_appVersion', {}, function (data) {
				if (typeof (data) == 'string') data = JSON.parse(data);
				if (data && data.ver) {
					ver = data.ver.replace(/\./gi, '');
				}
				if (ver && parseInt(ver, 10) >= chk_ver) {
					//체크버전 이상일 경우
					send('shpa_changeServer', '{"dest":"crp"}', function (data) {
						if (typeof (data) == 'string') {
							data = JSON.parse(data);
						}
						$log('shpa_changeServer : callback ', data);
					});
				} else {
					url = domain + next_url;
					openAppUrl(url);
				}
			});
		} else {
			$svc.get('popup').alert('서비스 이용 지원이 되지 않는 앱입니다.(' + deviceInfo.app + ')');
		}
	} else {
		// 모바일웹인 경우
		// 2019.06.28. 모바일웹은 신규창으로 법인홈페이지 화면을 연다.
		//url = domain + next_url;
		var popup = window.open(url, '_blank');
		//popup.location.href = url;
	}

};

function checkModule(callback) {
	if ((!deviceInfo.mobile && !deviceInfo.nos) && location.href.indexOf('/mob/MOBFW12001N/MOBFW12001R02.shc') < 0) {
		var moduleType = $svc.get('util').getCookie('shinhan.moduleType');
		if (!moduleType){	// 모듈설정 안되어 있는경우
			if(location.search){
				var nxtLocUrl = '/mob/MOBFW12001N/MOBFW12001R02.shc' + location.search + '&nxtLocUrl=' + location.pathname;
				$svc.get('location').href(nxtLocUrl);
			}
			else{
				$svc.get('location').href('/mob/MOBFW12001N/MOBFW12001R02.shc');
			}

		}else if (moduleType == 'G3'){	// 설치형 모듈 설치상태 체크
			callback && callback(true); 
		}
	}
}

//mybill & pay
function fnLoadMyBill(){
	if( deviceInfo.app&&deviceInfo.app=='shcardapp' ){
		var chk_ver = 513;  //5.1.3
		var ver;
		send('shpa_appVersion', {}, function(data) {
			if(typeof(data) == 'string') data = JSON.parse(data);
			if ( data && data.ver ) {
				ver = data.ver.replace(/\./gi, '');
			}
			if ( ver && parseInt(ver,10) >= chk_ver ) {
				//체크버전 이상일 경우
				$svc.get('http').submit('/mob/MOBFM001N/MOBFM001C10.ajax', {'mode':'agree'}).then(function(rs) {
					if (rs.resultCode == '0000') {
						send('shpa_openWebView', JSON.stringify({url:rs.returnUrl, param:''}));
					}else if (rs.resultCode == '0001') {
						location.replace('/mob/MOBFM001N/MOBFM001C01.shc');
					}else if (rs.resultCode == '0010') {
						$svc.get('popup').alert('잘못된 접근입니다. 파라메터를 확인하세요.');
					}else if (rs.resultCode == '0020') {
						$svc.get('popup').alert('준회원은 이용 불가능합니다.');
					}else if (rs.resultCode == '0030') {
						$svc.get('popup').alert('개인회원만 이용 가능합니다.');
					}
				});
			} else {
				$svc.get('popup').alert('신한카드앱 5.1.3 이상 버전에서만 이용 가능합니다.');
			}
		});
	}else{
		$svc.get('popup').alert('My BILL&PAY는 신한카드 앱 또는 신한 페이판에서만 가능합니다.');
	}

};

// 2021.02.22. 챗봇 세션 동기화
function chatBotSess() {
	if($menu.login){
		$('.user_time .wgt_md').click();
	}
	return $menu.login;
};

//C2021091572321 Talk상담 이용 중 홈페이지 자동로그아웃 오류 개선 요청의 건
function tlkCslSess() {
	if($menu.login){
		$("#popCmmLogOut button:first-child + button").click();
	}
	return $menu.login;
};

function setChatBotIphoneFocus(){
	setTimeout( function(){
		var tEle = $("div.quick_chatbot");
		tEle.attr('tabindex','0');
		tEle.focus();
	}, 500);
}

function setChatBotFocus(){
	setTimeout( function(){
		var tEle = $("a.chatbot");
		tEle.focus();
	}, 500);
}

//C2022111786093 홈페이지 검색 화면 - 클릭 로그 전송 요청의 건
function clickSearchLog(eventParam, data) {
	var rdata          = {};
	var service       = "";
	var description   = "";
	var displayType   = "";
	var linkUrl       = "";
	var linkAlt       = "";
	var queryText     = "None";
	
	try {
		var targetSv  = eventParam.dataset.pluginItem.split(',')[0];
		var targetN   = parseInt(eventParam.dataset.pluginItem.split(',')[1]);
		
		// 검색어 조회
		queryText = data.srchKeyword === undefined ? "" : data.srchKeyword;
		
		if (targetSv === "srch.arkItems") { // 자동완성
			if (queryText === "") return;
			service   = "autocomplete";
			displayType = "keyword";
			description = "자동완성 문구";
		} else if (targetSv === "srch.autoBanner") { // 자동완성 배너
			if (queryText === "") return;
			service   = "autocomplete";
			displayType = data.autoBanner[targetN].category;
			linkUrl     = data.autoBanner[targetN].bannerUrl;
			description = "자동완성 배너";
		} else if (targetSv === "srch.freqItems") { // 자주 찾는 검색어
			service   = "popKeyword";
			displayType = "keyword";
			description = (targetN + 1) + "/" + data.freqItems.length;
		} else if (targetSv === "srch.recommendItems") { // 추천 검색어
			service   = "recommendKeyword";
			displayType = "keyword";
			description = (targetN + 1) + "/" + data.recommendItems.length;
		} else {
			return;
		}
		linkAlt = eventParam.innerText;
		
		rdata = {
			queryText   : queryText,
			service     : service,
			description : description,
			displayType : displayType,
			linkUrl     : linkUrl,
			linkAlt     : linkAlt
		};
		
		// 클릭 로그 API 호출
		$svc.get('http').json('/mob/MOBFM004N/MOBFM004R29.ajax', rdata).then(function(rs) {
			
		},function(error){
			$log(error);
		});
	} catch(e) {}
};

// C2024042573152-2 신한SOL페이/홈페이지 검색엔진 변경 개발 - placeholder 변경
function retrieveSearchDefault(type){
	try {
		$svc.get('http').json('/mob/MOBFM004N/MOBFM004R25.ajax', {}, 'not').then(function(rs) {
			
			if (!rs.placeHolderSearch || _.isEmpty(rs.placeHolderSearch)) return;
									
			//우선순위를 고려하여 data 배열에 순서대로 반환, 특이사항이 없을 경우 0번 항목 사용 (요구사항 반영)
			var displayText = rs.placeHolderSearch.data[0].displayText;
			var functionType = rs.placeHolderSearch.data[0].functionType;
			var functionValue = rs.placeHolderSearch.data[0].functionValue;
			
			const main_btn = document.getElementsByClassName("main-search-btn")[0];
			
			if(displayText){
				
				if (type == 'search'){
					$("#queryMob").attr("placeholder", displayText);
					$("#query").attr("placeholder", displayText);				
		
				} else if (type == 'subMain'){
					$("#totalSrchQuck").attr("placeholder", displayText);			
				} else {
					//main인 경우 
					// PC
					$("#mainSearch_pc").attr("placeholder", displayText);
					
					// MOB
					if(main_btn){
						main_btn.innerText = displayText; // 검색 placeholder main
						document.getElementById("mainSearch_mo").innerText = displayText; // 검색 placeholder pop-main
					}

					$("#totalSrchQuck").attr("placeholder", displayText);
				}				
			}		
			
			if(functionType == "search-keyword") {
				if (type == 'search'){
					$("#queryMob").attr("searchkeyword", functionValue);
					$("#query").attr("searchkeyword", functionValue);				
		
				} else if (type == 'subMain'){
					$("#totalSrchQuck").attr("searchkeyword", functionValue);			
				} else {
					//main인 경우 
					// PC
					$("#mainSearch_pc").attr("searchkeyword", functionValue);
					$("#totalSrchQuck").attr("searchkeyword", functionValue);
				}				
			}				
		},function(error){
			$log(error);
		});
	} catch(e) {
		displayText = "메뉴, 카드, 이벤트 검색";
		
		if(type == 'search'){
			$("#queryMob").attr("placeholder", displayText);
			$("#query").attr("placeholder", displayText);		
		} else if (type == 'subMain'){
			$("#totalSrchQuck").attr("placeholder", displayText);
		}
	}
};

// C2022031154692 NEW올댓 오픈에 따라 홈페이지 및 제우스시스템 to-be URL로 변경 요청
function fnLoadNAP(nextUrl) {
	
	var http = $svc.get('http');
	var util=$svc.get('util');
	var alhSsoUrl = "";
	var domain = "";

	domain = 'https://allthat.shinhancard.com';
	
	if(deviceInfo.mode.indexOf('dev') > -1 || deviceInfo.mode.indexOf('tst') > -1 || deviceInfo.mode.indexOf('local') > -1){
		/*mci가 테스트로 연결됐기 때문에 stg로 연결*/
		domain = 'https://allthat.stg.aws.shinhancard.com';
	}

	
	if($menu.login){ //로그인 상태면, 올댓SSO토큰발행 후 SSO연동 페이지로 이동
		
		alhSsoUrl = domain+"/mbr00771?P1=";
		nextUrl = nextUrl?nextUrl:'/';
		
		var param = {
			nextUrl : nextUrl 
		};
		
		http.submit('/mob/MOBFM230N/MOBFM230C02.ajax', param).then(function(rsHttp){
			if(!rsHttp) return;
			if(rsHttp.P1 != ''){
				alhSsoUrl = alhSsoUrl + rsHttp.P1;
				openAppUrl(alhSsoUrl);
			}else{
				$log('토큰값 없음 오류');
				$svc.get('popup').alert('접속이 지연되었습니다.<br />잠시 후 다시 이용하여 주십시오.');
				return;
			}
			
		},function(error){
			$log('error', error);
			$svc.get('popup').alert('접속이 지연되었습니다.<br />잠시 후 다시 이용하여 주십시오..');
		});

	}else{ //미로그인 상태면 - nextUrl로 바로 이동
		if(nextUrl.indexOf('http') > -1){
			alhSsoUrl = nextUrl;
		}else{
			alhSsoUrl = domain + nextUrl;
		}
		openAppUrl(alhSsoUrl);
	}
};


