(function (global) {
	// json파일을 읽어오는 걸 sync에서 async로 변경함.
	var $init = {
		GA4: function () {
			var filePathInfo_mob = '/pconts/json/mob_web_screen_info_';
			var file_ext = '.js';
			function reqPath() {
				return location.pathname;
			}

			// CMS 페이지인지, LOGIC 페이지인지에 따라 다름.
			function filePath(fp, e) {
				return fp + (reqPath().split('/')[1] != 'pconts' ? 'non_pconts_2023' : 'pconts_2023') + e;
			}
			return {
				list: function () {
					return $svc.get('http').html(filePath(filePathInfo_mob, file_ext));
				},
			}
		},
		GA_SCREEN: function () {
			function isUrl(data) {
				return (data.url === location.pathname) || (data.url === location.pathname + location.search);
			}
			return {
				info: function () {
					return $init.GA4().list().then(function(res) {
						if(res.screen_info) {
							return _.find(res.screen_info, isUrl);
						}
					});
				}
			}
		},
		GA_PAGE: function () {
			return $init.GA_SCREEN().info().then(function(res) {
				var $menuList = res || {
					url: location.pathname,
					screen_name: document.title
				};
				
				function titleDepth() {
					return $menuList.screen_name.split('>')
				}
				function cookieArr() {
					return document.cookie.split(';')
				}
				function isCID() {
					var ckArr = cookieArr();
					var tt = 0;
					for (; tt < ckArr.length; ++tt) {
						if(/^_ga/.test(ckArr[tt].trim())) {
							return ckArr[tt]
						}
					}
					return false;
				}
				function fillDepth() {
					var rArr = titleDepth();
					var dStr = '';
					var j = 0;
					while (j < rArr.length) {
						dStr += rArr[j];
						rArr[j++] = dStr;
						dStr += '>';
					}
					dStr = dStr.slice(0, -1);
					while (j < 5) {
						rArr[j++] = dStr;
					}
					return rArr;
				}

				return {
					page: function () {
						return $menuList
					},
					title: function () {
						return $menuList.screen_name
					},
					depth: function () {
						return fillDepth()
					},
					cid: function () {
						return isCID()
					}
				}
			});
		}
	};

	$svc.service('GA4', function () {
		var dNum = 1;
		var isApp = !!deviceInfo.app;
		var $GAPage;
		var readyGAPage = false;
		
		$init.GA_PAGE().then(function(res) {
			$GAPage = res;
			$(document).trigger('GA4-page-ready');
			readyGAPage = true;
		});

		function GAPageReady(callback) {
			if(readyGAPage) {
				callback();
			} else {
				$(document).on('GA4-page-ready', callback);
			}
		}

		function isGaAgent(usrAg) {
			var aF = false;
			if (usrAg.indexOf('GA_Android') > -1)
				aF = true;
			else if (usrAg.indexOf('GA_iOS_WK') > -1)
				aF = true;
			else
				aF = false;
			return aF;
		}

		function dataForBridge(bgName, paramData) {
			if (isGaAgent(navigator.userAgent)) {
				var rBdata = {};
				for(key in paramData) {
					rBdata[key] = paramData[key];
				}
				global.send(bgName, rBdata);
			}
		}

		function getServiceName() {
			if(deviceInfo.app == 'shfanapp') {
				return '신한카드_페이판'
			}
			return '신한카드_신한카드';
		}

		return {
			// 가상페이지로 해당 함수 호출 시 isVirtual 변수에는 true 값 세팅 필요
			// 그 외 가상페이지가 아닐경우 $GA4.sendEvent(obj, false)로 호출
			sendEvent: function (evtObj, isVirtual) {
				GAPageReady(function() {
					var GAEvent = {};
					// $log('sending event data to GA4');
					
					for(var key in evtObj) {
						GAEvent[key] = evtObj[key];
					}
					
					(isApp) ? dataForBridge('shpa_sendGAEvent', GAEvent) : global.GADatasend_Event(GAEvent, isVirtual);
				});
			},
			sendVirtual: function (virObj) {
				GAPageReady(function() {
					// $log('sending vitual data to GA4');
					var GAVirtual = {};
					// $log('sending vitual data to GA4');
					for(var key in virObj) {
						GAVirtual[key] = virObj[key];
					}
					(isApp) ? dataForBridge('shpa_sendGAScreen', GAVirtual) : global.GADatasend_Page(GAVirtual);
				});
			},
			send: function (sd) {
				GAPageReady(function() {
					var GAInfo = {};
					
					// $log('sending logging data to GA4');
					if ($GAPage.page()) {
						GAInfo["title"] = $GAPage.title();
						GAInfo["ep_page_hybrid_url"] = location.hostname + location.pathname;
						var menuDepth = $GAPage.depth();
						for (var i=0;i<menuDepth.length;i++) {
							GAInfo["ep_page_category_" + dNum++ + "depth"] = menuDepth[i];
						}
					}
	
					if($GAPage.cid()) {
						GAInfo["up_cid"] = $GAPage.cid().split('=')[1].replace('GA1.2.', '');
					} else {
						if(typeof (ga) == 'function') {
							ga(function (tracker) {
								GAInfo["up_cid"] = tracker.get('ClientId');
							});
						} else {
							GAInfo["up_cid"] = 'undefined';
						}
					}
	
					(isApp) ? GAInfo["ep_visit_channel"] = 'APP' : GAInfo["ep_visit_channel"] = 'PC_WEB';
					
					GAInfo["ep_login_status"] = sd["up_login_status"];

					for(key in sd) {
						GAInfo[key] = sd[key];
					}
					
					$log('send to GA4 completed', GAInfo);
					(isApp) ? dataForBridge('shpa_sendGAScreen', GAInfo) : global.GA_Init(GAInfo);
				});
			}
		};
	});
})(window);
