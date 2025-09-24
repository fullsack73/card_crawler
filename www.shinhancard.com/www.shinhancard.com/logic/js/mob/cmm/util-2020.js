/**
* @description 신한카드 모바일 홈페이지 util Javascript(개인 홈페이지 통합)
* @author 정용석
* @version 0.1
* @since 2019.9
*/

!function (w) {
	$svc.service('util', function () {
		function replaceAll(t, r, n) {
			return t.split(r).join(n);
		}

		function isNull(t) {
			return null === t;
		}
		
		function isUndefined(t) {
			return void 0 === t;
		}

		function isEmpty(t) {
			return isNull(t) || isUndefined(t) || _.isEmpty(t) ? (_.isNumber(t) || _.isString(t) ? (t == '' ? !0 : !1) : !0) : !1;
		}
		
		function isAlphaNumeric(t) {
			return /^[A-Za-z0-9]+$/.test(t);
		}

		function isNumeric(t) {
			return /^[0-9]+$/.test(t);
		}

		function isAlpha(t) {
			return /^[A-Za-z]+$/.test(t);
		}

		function isHangul(t) {
			return /^[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]+$/.test(t);
		}
		
		function isHangulWord(t){
			return /^[가-힣]+$/.test(t);
		}

		function getLength(t) {
			return t.length;
		}

		function isAlphaHangulNumeric(t) {
			return /^[a-z|A-Z|ㄱ-ㅎ|ㅏ-ㅣ|가-힣|0-9]+$/.test(t);
		}

		function getByteLength(t) {
			for (var r = 0, n = 0, e = 0; e = t.charCodeAt(n++); r += e >> 11 ? 3 : e >> 7 ? 2 : 1);
			return r;
		}
		
		function trim(t) {
			return t.replace(/^\s+|\s+$/g, '');
		}
		
		function lTrim(t) {
			return t.replace(/^\s+/, '');
		}
		
		function rTrim(t) {
			return t.replace(/\s+$/, '');
		}
		
		function lPad(t, r, n) {
			for (r -= getLength(t); r > 0; r--) {
				t = n + t;
			}
			return t;
		}

		function rPad(t, r, n) {
			for (r -= getLength(t); r > 0; r--) {
				t += n;
			}
			return t;
		}
		
		function addCommas(t) {
			for (t = '' + t, t = t.split('.'); /(\d+)(\d{3})/.test(t[0]);) {
				t[0] = t[0].replace(/(\d+)(\d{3})/, '$1,$2');
			}
			return t.join('.');
		}
		
		function toKrMoney(t) {
			isNumeric(t) && (t += ''),
			_.isNumber && (t += ''),
			t = t.replace(/,/g, '');
			var r = {
				n: ['', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'],
				u: ['', '십', '백', '천', '만', '십', '백', '천', '억', '십', '백', '천', '조', '십']
			}, n = 0, e = '', u = 0;
			for (i = 0; i < t.length; i++) {
				u = t.length - i - 1;
				e += r.n[t.substr(i, 1)];
				if('0' == t.substr(i, 1)) {
					n++,
					u % 4 == 0 && 4 > n && (n = 0, e += r.u[u] ? r.u[u] : '');
				} else {
					n = 0,
					e += r.u[u] ? r.u[u] : '';
				}
			}
			return e;
		}
		
		function isDate(t) {
			if (isEmpty(t) || 8 != getLength(t)) return !1;
			var r = Number(t.substring(0, 4)),
				n = Number(t.substring(4, 6)),
				u = Number(t.substring(6, 8));
			if (1 > n || n > 12) return !1;
			var i = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
				s = i[n - 1];
			return 2 == n && (r % 4 == 0 && r % 100 != 0 || r % 400 == 0) && (s = 29), 1 > u || u > s ? !1 : !0;
		}

		function isTime(t) {
			if (isEmpty(t) || 6 != getLength(t)) return !1;
			var r = Number(t.substring(0, 2)),
				n = Number(t.substring(2, 4)),
				t = Number(t.substring(4, 6));
			return 0 > r || r > 23 ? !1 : 0 > n || n > 59 ? !1 : 0 > t || t > 59 ? !1 : !0
		}

		function strToDate(t) {
			var r = t.split(' '),
				n = r[0],
				e = '000000';
			if (2 == r.length && (e = r[1]), 14 == getLength(t) && (n = t.substring(0, 8), e = t.substring(8, 14)), !isDate(n)) return null;
			if (!isTime(e)) return null;
			var u = n.substring(0, 4),
				i = Number(n.substring(4, 6)) - 1,
				s = n.substring(6, 8),
				a = e.substring(0, 2),
				o = e.substring(2, 4),
				f = e.substring(4, 6);
			return new Date(u, lPad('' + i, 2, '0'), s, a, o, f);
		}

		function formatDate(t, r) {
			var n = Object.prototype.toString.call(t);
			if('[object Date]' === n) {
				return r.replace(/(yyyy|yy|MM|dd|hh24|hh|mi|ss|ms|a\/p)/gi, function (r) {
					switch (r) {
						case 'yyyy': return '' + t.getFullYear();
						case 'yy': return lPad('' + (t.getFullYear() % 1e3), 4, '0').substring(2, 4);
						case 'MM': return lPad('' + (t.getMonth() + 1), 2, '0');
						case 'dd': return lPad('' + t.getDate(), 2, '0');
						case 'hh24': return lPad('' + t.getHours(), 2, '0');
						case 'hh': return lPad('' + ((h = t.getHours() % 12) ? h : 12), 2, '0');
						case 'mi': return lPad('' + t.getMinutes(), 2, '0');
						case 'ss': return lPad('' + t.getSeconds(), 2, '0');
						case 'ms': return lPad('' + t.getMilliseconds(), 3, '0');
						case 'a/p': return t.getHours() < 12 ? "오전" : "오후";
						default: return r;
					}
				});
			}
			else if('[object String]' === n) {
				return formatDate(strToDate(t), r);
			}
			return '';
		}
		
		function getDayOfWeek(t) {
			if (!isDate(t)) return '';
			var r = ['일', '월', '화', '수', '목', '금', '토'];
			return r[strToDate(t).getDay()];
		}

		function getDiffDay(t, r) {
			var n = strToDate(t),
				e = strToDate(r),
				u = e.getTime() - n.getTime();
			return Math.floor(u / 864e5);
		}

		function getDiffTime(t, r) {
			var n = strToDate(t),
				e = strToDate(r),
				u = e.getTime() - n.getTime();
			return Math.floor(u / 36e5);
		}

		function addDays(t, r, n) {
			var e = strToDate(t);
			e.setDate(e.getDate() + r);
			return formatDate(e, n || 'yyyyMMdd');
		}
		
		function addMonths(t, r, n) {
			var e = strToDate(t);
			e.setMonth(e.getMonth() + r);
			return formatDate(e, n || 'yyyyMMdd');
		}

		function addYears(t, r, n) {
			var e = strToDate(t);
			e.setFullYear(e.getFullYear() + r);
			return formatDate(e, n || 'yyyyMMdd');
		}
		
		function getLastDay(t, r) {
			var n = strToDate(t);
			n.setMonth(n.getMonth() + 1);
			n.setDate(0);
			return formatDate(n, r || 'yyyyMMdd');
		}
		
		function strToInt(t) {
			return typeof t === 'number' ? t : parseInt(t.replace(/,/g, ''), 10);
		}

		function strMoneyToStr(t) {
			return t.replace(/,/g, '');
		}
		
		function strToFloat(t) {
			return parseFloat(t.replace(/,/g, ''), 10);
		}
		
		function isEmail(t) {
			return /^([0-9a-zA-Z]+)([0-9a-zA-Z\._-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,3}$/.test(t);
		}
		
		function isTel(t) {
			t = formatPhone(t);
			return /^\d{2,3}-\d{3,4}-\d{4}$/.test(t);
		}
		
		function isMobile(t) {
			t = formatPhone(t);
			return /^(?:(010-?\d{4})|(01[1|6|7|8|9]-?\d{3,4}))-?(\d{4})$/.test(t);
		}

		function formatPhone(t) {
			t = replaceAll(t, '=', '');
			if(12 == t.length) {
				return t.substring(0, 4) + '-' + t.substring(4, 8) + '-' + t.substring(8, 12)
			}
			return t.replace(/(^20.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/, "$1-$2-$3")
		}
		
		function strFormat(r, n) {
			var t = 0;
			if(_.isString(r) && '' != r && _.isString(n) && '' != n) {
				return _.map(n, function (n) {
					var v = 'x' == n ? r.charAt(t) : n;
					t++;
					return v;
				}).join('');
			}
			return '';
		}
		
		function mDataToArray(t) {
			var vl = [], o = [], k = _.keys(t);
			_.each(t[k[0]], function (n, i) {
				o = [];
				_.each(k, function (v) {
					o.push(t[v][i]);
				});
				vl.push(_.object(k, o));
			});
			return vl;
		}
		
		function formData(t) {
			var frm = {};
			if($('#' + t).serialize().indexOf('&')) {
				_.each($('#' + t).serialize().split('&'), function (v) {
					if(v.indexOf('=') > 0) {
						frm[v.split('=')[0]] = v.split('=')[1];
					}
				});
			}
			return frm;
		}

		function formDataForAjax(t) {
			var frm = {};
			if($('#' + t).serialize().indexOf('&')) {
				_.each($('#' + t).serialize().split('&'), function (v) {
					if(v.indexOf('=') > 0) {
						frm[v.split('=')[0]] = decodeURIComponent(v.split('=')[1]);
					}
				});
			}
			return frm;
		}
		
		function toJson(t) {
			return JSON.stringify(t);
		}
		
		function fromJson(t) {
			return t && JSON.parse(t);
		}

		function loadJS(paths, onLoadAfter, sync) {
			var $script = $('script');
			_.each(paths, function (path) {
				// 중복해서 js가 로드되지 않도록 하기 위해서 확인해야함.
				var isDuplicated = false;
				$script.each(function() {
					if(this.src.indexOf(path) > -1) {
						console.warn(path + ' is already loaded.');
						isDuplicated = true;
						return false;
					}
				});
				if(isDuplicated) {
					onLoadAfter && onLoadAfter(path);
					return;
				}

				var head = document.getElementsByTagName('head')[0],
					script = document.createElement('script');
				script.src = path;
				script.async = (typeof sync === 'undefined') ? false : sync;
                head.appendChild(script);

                // 스크립트파일 호출오류시 개발자도구 콘솔에서 인지 가능하도록 추가
                script.onerror = function(){
                    console.log('############# [ ' + path + ' ] 스크립트 호출 실패.');
                    onLoadAfter && onLoadAfter(path);
                    return;
                }

				script.onload = function () {
					onLoadAfter && onLoadAfter(path);
				}
			});
		}
		


		function pageId() {
			var p = location.pathname.split('/');
			p = p[p.length - 1].replace('.shc', '');
			return p;
		}

		function siteCode(c) {
			if(deviceInfo.mobile) {
				return [
					{
						ipod: 'I',
						iphone: 'I',
						ipad: 'I',
						android: 'A',
						androidTablet: 'A'
					}[deviceInfo.app == 'shcardapp' && deviceInfo.os] || 'W',
					{ 
						loginPersonWeb: 'I',
						loginPersonFanApp: 'F',
						loginPersonCert: 'C',
						ShinhanSimple: 'S'
					}[c]
				].join('');				
			}

			// pc면
			return {
				loginPersonWeb: 'HP',
				loginPersonFanApp: 'HR',
				loginPersonCert: 'PH'
			}[c];
		}

		function isCmmError(error, uri) {
			if (error && error.mbw_code && error.mbw_code == 'scwi.err.hpp.sbr.session.expired') {
				if (!uri) {
					$svc.get('location').reload();
				}
				else {
					$svc.get('location').replace(uri);
				}
				return true;
			}
			return false;
		}

		function promiseAll(ar) {
			var df = $.Deferred();
			$.when.apply(null, ar).then(function () {
				df.resolve(_.toArray(arguments));
			}).fail(function () {
				df.reject(_.toArray(arguments));
			});
			return df.promise();
		}

		function nl2br(str) {
			return str.replace(/\r\n/gm, '<br>');
		}

		function srchFilterBadToken(s) {
			s = replaceAll(s, //g, ' ');
			s = replaceAll(s, //g, ' ');
			s = replaceAll(s, /\u3/g, ' ');
			return s;
		}

		function req() {
			var o = {};
			var sr = location.search;
			if(sr) {
				(function () {
					sr = sr.substring(1);
					var a = sr.split('&');
					_.each(a, function (v, k) {
						var a2 = v.split("=");
						o[a2[0]] = a2[1];
					});
				})();
			}
			return o;
		}
		
		function excelDownload(url, param) {
		    $('<form id="frmExcel" method="post" action="' + url + '">').appendTo('body');
		    $.each(param, function(name, value) {
		    	if(value && _.isString(value)) {
		    		$('#frmExcel').append('<input type="hidden" name="' + name + '" value="' + value + '"/>');
		    	}
		    });
		    $('#frmExcel').submit();
		    $('#frmExcel').remove();
		}
		
		// 마크애니용 팝업
		function markanyConfirmPopup(oform, actionUrl) {

		    alert('출력문서 생성시 다소 시간이 소요됩니다.\n\n확인 버튼을 누르시고, 잠시 기다려 주십시오.');

		    window.open('about:blank','popupMarkAny',"width=400,height=250,scrollbars=yes");
		    
		    oform.target = 'popupMarkAny';
			oform.action = actionUrl;
			oform.method = "post";
			
			oform.submit();
		}

		function setHpgLocalStorage(key, value, opt) {
			var hpgUtilStorage = JSON.parse(window.localStorage.getItem('hpgStorage') || '{}');
			if(isEmpty(opt)) opt = {};	

			var hpgObj = {};
			if(isEmpty(opt.expireDate)){
				hpgObj.expireDate = addDays(formatDate(new Date(), 'yyyyMMdd'), 365);
			} else {
				hpgObj.expireDate = opt.expireDate;
			}
			
			hpgObj.value = value;
			hpgUtilStorage[key] = hpgObj;
			window.localStorage.setItem('hpgStorage', JSON.stringify(hpgUtilStorage));
		}
		
		function getHpgLocalStorage(key) {
			
			var hpgUtilStorage = JSON.parse(window.localStorage.getItem('hpgStorage') || '{}');
			var hpgObj = hpgUtilStorage[key];

			if(isEmpty(hpgObj)){
				return "";
			}

			if(getDiffDay(formatDate(new Date(), 'yyyyMMdd'), hpgObj.expireDate) > 0){
				return hpgObj.value;
			} else {
				return "";
			}
		}

		function isVisibleTooltipLocalStorage(key) {
			var hpgUtilStorage = JSON.parse(window.localStorage.getItem('hpgStorage') || '{}');
			var hpgObj = hpgUtilStorage[key];

			if(isEmpty(hpgObj)){
				return true;
			}

			if(getDiffDay(formatDate(new Date(), 'yyyyMMdd'), hpgObj.expireDate) < 0){
				return true;
			}

			return hpgObj.value;
		}

		function getParameter(key) {
			key = key.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
			var regex = new RegExp('[\\?&]' + key + '=([^&#]*)');
			results = regex.exec(location.search);
			
			return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
		}

		function getCookie(name) {
			var nameEQ = name + '=';
			var ca = document.cookie.split(';');
			for(var i=0;i < ca.length;i++) {
				var c = ca[i];
				while (c.charAt(0)==' ') c = c.substring(1,c.length);
				if (c.indexOf(nameEQ) == 0) {
					return c.substring(nameEQ.length,c.length);
				}
			}
			return "";
		}

		function setCookie(name, value, option) {
			var name = name.replace(/\r/g, '').replace(/\n/g, '');
			var value = value.replace(/\r/g, '').replace(/\n/g, '');	
			var otp = option || {};
			var expireDay = otp.expireDay || '';
			var expires = '';

			if (expireDay) {
				var date = new Date();
				date.setTime(date.getTime()+(expireDay*24*60*60*1000));
				expires = '; expires=' + date.toGMTString();
			}
		
			var replacedCookie = name + '=' + value + expires + '; path=/';

			replacedCookie = replacedCookie.replace(/[\r\n]/g, '');
			document.cookie = replacedCookie;
		}
		
		//공동인증서 타입
		function getModuleType() {
			// 'G3' 설치형, 'G4' 비설치형
			if (deviceInfo.app == 'shcardapp' || deviceInfo.app == 'shfanapp') {
				return 'G3';	// 앱 일경우는 설치형으로 노출되도록 리턴(네이티브 연동)
			}else if (deviceInfo.mobile) {
				return 'G4'	// 모바일웹 일 경우는 비설치형
			}else {
				return getCookie('shinhan.moduleType') || 'G3';	// PC일 경우는 설치/비설치 선택
			}
		}

		function mergeUriQueryParam(uri, key, value){
			var re = new RegExp('([?&])'+key+'=.*?(&|$)', 'i');
			var separator = uri.indexOf('?') !== -1 ? '&' : '?';
		
			if(uri.match(re)){
				return uri.replace(re, '$1' + key + "=" + value + '$2');
			} else {
				return uri + separator + key + '=' + value;
			}
		}

		return {
			isNull: isNull,
			isUndefined: isUndefined,
			isEmpty: isEmpty,
			isAlphaNumeric: isAlphaNumeric,
			isNumeric: isNumeric,
			isAlpha: isAlpha,
			isHangul: isHangul,
			isHangulWord: isHangulWord,
			isAlphaHangulNumeric: isAlphaHangulNumeric,
			isEmail: isEmail,
			isTel: isTel,
			isMobile: isMobile,
			isDate: isDate,
			isTime: isTime,
			getLength: getLength,
			getByteLength: getByteLength,
			trim: trim,
			lTrim: lTrim,
			rTrim: rTrim,
			lPad: lPad,
			rPad: rPad,
			addCommas: addCommas,
			toKrMoney: toKrMoney,
			formatDate: formatDate,
			formatPhone: formatPhone,
			getDayOfWeek: getDayOfWeek,
			getDiffDay: getDiffDay,
			getDiffTime: getDiffTime,
			addDays: addDays,
			addMonths: addMonths,
			addYears: addYears,
			getLastDay: getLastDay,
			strToInt: strToInt,
			strMoneyToStr: strMoneyToStr,
			strToFloat: strToFloat,
			strToDate: strToDate,
			strFormat: strFormat,
			mDataToArray: mDataToArray,
			replaceAll: replaceAll,
			toJson: toJson,
			fromJson: fromJson,
			formData: formData,
			formDataForAjax: formDataForAjax,
			loadJS: loadJS,
			pageId: pageId,
			siteCode: siteCode,
			isCmmError: isCmmError,
			promiseAll: promiseAll,
			srchFilterBadToken: srchFilterBadToken,
			nl2br: nl2br,
			req: req,
			excelDownload: excelDownload,
			markanyConfirmPopup : markanyConfirmPopup,
			setHpgLocalStorage: setHpgLocalStorage,
			getHpgLocalStorage: getHpgLocalStorage,
			isVisibleTooltipLocalStorage: isVisibleTooltipLocalStorage,
			getParameter: getParameter,
			getCookie: getCookie,
			setCookie: setCookie,
			getModuleType: getModuleType,
			mergeUriQueryParam: mergeUriQueryParam
		};
	});

	/**
	 * page location util
	 */
	$svc.service('location', function () {
		var o = {},
			rootLink = {
				'/pconts/html/main.html': true,
				'/': true
			};
		o.reload = function () { window.location.reload() };
		o.replace = function (url, prm) { 
			var p = _.map(prm, function (n, t) { return [t, '=', encodeURIComponent(n)].join('') }).join('&');
			window.location.replace(url + (p ? '?' + p : ''));
		};
		o.back = function () { window.history.back() };
		o.nextParam = function (p) { $menu.nextParam = p || {} };
		o.href = function (url, prm) {
			var p = _.map(prm, function (n, t) { return [t, '=', encodeURIComponent(n)].join('') }).join('&');
			if (deviceInfo.app == 'shfanapp' && rootLink[url]) {
				return send('shpa_goNavBack', null);
			}
			window.location.href = url + (p ? '?' + p : '')
		};
		o.go = function (url, prm) {
			if (deviceInfo.app == 'shfanapp' && rootLink[url]) {
				return send('shpa_goNavBack', null);
			}
			// http 412 오류 수정, post -> get으로 변경
//			$('body').append('<form id="frmGo"/>');
//			var f = $('#frmGo');
//			f.attr({ action: url, method: 'post' }),
//				_.each(prm, function (v, k) {
//					f.append($('<input/>').attr({ name: k, type: 'hidden' }).val(v))
//				});
//			}
//			f.submit();
			if (url.indexOf('?') < 0) {
				var pstr = "";
				_.each(prm, function (v, k) {
					if (pstr.length > 0)
						pstr += "&";
					pstr += encodeURIComponent(k) + "=" + encodeURIComponent(v);
				});
				if (pstr.length > 0)
					url += "?" + pstr;				
			}
			location.href = url;
		};
		o.goLogin = function () {
			var p = $menu.nextParam || {};
			o.go('/mob/MOBFM001N/MOBFM001C01.shc', {
				next_url: p.referer || location.pathname,
				next_params: p ? JSON.stringify(p) : {}
			});
		};
		/*
		o.goLogin = function (url,param) {
			var p = $menu.nextParam || {};
			o.go('/mob/MOBFM001N/MOBFM001C01.shc', {
				next_url: url ? url :p.referer || location.pathname,
				next_params: p ? JSON.stringify(p) : {},
				next_chatbot:param
			});
		};
		 */
		o.goLogout = function () {
			$svc.get('http').json('/mob/cmm/MOBFMLOGIN/CMMServiceMemLoginC.ajax', {
				mode: 'logOut',
				channel: 'person'
			}).then(function (rsHttp) {
				if (deviceInfo.app == 'shcardapp') send('shpa_setLogout',{},function(data){});
				o.href(rsHttp.returnUrl || '/')
			});
		};
		o.goHome = function (){
			o.href('/pconts/html/main.html');
		};
		o.goInitialPage = function (type){
			if (type) {
				o.href('/mob/MOBFW12001N/MOBFW12001R01.shc?fr=' + type);
			}else {
				o.href('/mob/MOBFW12001N/MOBFW12001R01.shc');
			}			
		};
		o.goAppLogin = function () {
			var serverMode = deviceInfo.mode;
			var redirecUrl = "";
			var nexturl = location.pathname; 
			var agent = navigator.userAgent.toLowerCase();
			var prefix = "";  
			var ssourl = "" ;
			if(true == deviceInfo.mobile && 'shfanapp' == deviceInfo.app ) {
				if(agent.indexOf('shpay') == -1) {
				      if(serverMode == 'local') {
				      	 redirecUrl = "https://dev.payfan.shinhancard.com/fan/FANFM110N/FANFM110R01.shc";
                         prefix = "devprj2-";
				      } else if (serverMode == 'dev'){
				      	redirecUrl = "https://dev.payfan.shinhancard.com/fan/FANFM110N/FANFM110R01.shc"; 
				      	prefix = "devprj2-";
				      } else if (serverMode == 'tst'){
				      	redirecUrl =  "https://tst.payfan.shinhancard.com/fan/FANFM110N/FANFM110R01.shc";
				      	prefix = "tstprj2-";
				      } else{
				      	redirecUrl =  "https://payfan.shinhancard.com/fan/FANFM110N/FANFM110R01.shc";
				      	prefix = "";
				      }
				}else{
					if(serverMode == 'local') {
						redirecUrl = "https://dev.pay.shinhancard.com/pay/PAYFM002N/PAYFM002R01.shc";
						prefix = "devprj2-"
					} else if (serverMode == 'dev'){
						redirecUrl = "https://dev.pay.shinhancard.com/pay/PAYFM002N/PAYFM002R01.shc";
						prefix = "devprj2-"
					} else if (serverMode == 'tst'){
						redirecUrl = "https://tst.pay.shinhancard.com/pay/PAYFM002N/PAYFM002R01.shc";
						prefix = "tstprj2-";
					} else{
						redirecUrl = "https://pay.shinhancard.com/pay/PAYFM002N/PAYFM002R01.shc";
						prefix = "";
					}
				} 
			}

			if(redirecUrl!=""){
				ssourl = "https://"+prefix+"www.shinhancard.com/mob/MOBFM001N/MOBFM001C05.shc"
				redirecUrl = redirecUrl + "?nextUrl="+ssourl+"?"+"next_url="+nexturl;
				o.go(redirecUrl, {

				}); 
			}			
			
		}		
		return o;
	});
	// template util
	w.$template = {
		checked: function (i, v) {
			setTimeout(function () {
				$('#tpl_' + i).prop('checked', v);
			}, 10);
			return 'tpl_' + i;
		},
		selected: function (i, v) {
			setTimeout(function () {
				$('#tpl_' + i).prop('selected', v);
			}, 10);
			return 'tpl_' + i;
		},
		disabled: function (i, v) {
			setTimeout(function () {
				$('#tpl_' + i).prop('disabled', v);
			}, 10);
			return 'tpl_' + i;
		}
	};
	
	// swap elements
	$.fn.swap = function(b) {
		b.after('<span id="tempPwdArea"></span>');
		this.after(b);
		$('#tempPwdArea').after(this);
		$('#tempPwdArea').remove();
	}
	
}(window);

