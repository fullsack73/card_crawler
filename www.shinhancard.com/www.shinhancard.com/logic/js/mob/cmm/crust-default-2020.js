/**
* @description 헤더,푸터 (개인 홈페이지 통합)
* @author 정용석
* @version 1.0
*   @since 2019.11
*/

(function (global) {
	$svc.plugin('cmmHeader', function ($param, $close) {


		// C2022071474081 박광훈파트장님 요청으로 화면별 유도페이지 체크
		checkBridgePage();

		var defTitle = '신한카드';
		var http = $svc.get('http');

		var ajaxDynamicTagIndex1 = 0;
		var ajaxDynamicTagIndex2 = 0;

		var tDepthVl = [];
		var fDepthVl = [];
		var gnbFavSwiper1='';
		// 모바일 최근이용메뉴 스와이퍼
		var gnbFavSwiper2='';
		//전체메뉴 탭 스와이퍼
		var haedAllMenuNav='';
		var headType = $param.headType || '';
		var url = '/mob/cmm/COMMON/defaultHeader-2020.ahtml';

		// shc-index 가 class 에 없는 경우 입력 한다.
		var div_wrap = $('#wrap');
		if( !div_wrap.hasClass('shc-index') ){
			div_wrap.addClass('shc-index');
		}

		if (headType == 'main') {
			//url = '/mob/cmm/COMMON/defaultHeaderMain-2020.ahtml';
			url = '';	// 메인에 헤더는 main.html에 있음.
		}else if (headType == 'subMain') {
			url = '/mob/cmm/COMMON/defaultHeaderSubMain-2020.ahtml';
		}else if (headType == 'search') {
			url = '/mob/cmm/COMMON/defaultHeaderSearch-2020.ahtml'

		}

		var vo = $svc.bind({ name: 'cmmHeader', url: !$('#header').hasClass('main') && url, plugin: true });
		var logoutDownCounter;
		var logoutPopupCounter;

		var on = vo.event(),
			vl = {},
			lc = {},
			srch = {},
			srchLog = {},
			prm = {},
			util = $svc.get('util');

		lc.headType = headType;

		// 헤더 마이오토 눌렀을 때 뜨는 드롭다운메뉴
		$(document).on('click focusin', '.dropdown', function (e) {
			var self = $(this);
			if(e.type=='click') {
				self.next('.dropdown_menu').removeClass('hide');
				self.next('.dropdown_menu').find('.btn_family').eq(0).focus();
			} else if (e.type=='focusin') {
				self.next('.dropdown_menu').addClass('hide');
			}
		});
		$(document).on('click', '.btn_up_close', function (e) {
			e.preventDefault();
			var self = $(this);
			var dropdownMenu = self.closest('.dropdown_menu');
			dropdownMenu.addClass('hide');
			setTimeout(function () {
				self.parent().parent().find('.dropdown').focus();
			}, 10);
		});

		// 메뉴 툴팁 클릭
		$(document).on('click', '.menu-tip-trigger', function (e) {
			if(!$(this).hasClass('on')){
				$('.menu-tip-pop').fadeOut(300);
				$('.menu-tip-trigger.on').removeClass('on');
				$(this).addClass('on').next().attr('tabindex','0').fadeIn(300).focus();
			}
		});

		$(document).on('click', '.ac_btn_keyword', function (e) {
			var self = $(this);
			clickSearchLog(self[0], srchLog);
		});

		$(document).on('click', '.menu-tip-close', function (e) {
			$(this).parent().fadeOut(300).prev().removeClass('on').focus();
		});

		vo.render(function () {
			//$svc.get('util').sLoginTimer(window.opener);
			/*
			try{
				recursionLoginTimer(window.opener);
			}catch(e){

			}
			*/
			var cmmHeaderSvc = $svc.get('cmmHeader');


			var list = ['shcapp-non-header', 'shchatbot'];
			var agent = navigator.userAgent.toLowerCase();

			//  C2020062975633 챗봇 UI 추가
			if(!(deviceInfo.mobile==true && deviceInfo.chatbot==true && deviceInfo.app!='shcardapp')){
				RegExp(list.join('|')).test(agent) && ($('[data-bind-include=cmmHeader]').hide() && $('body').addClass('app_shfan'));
			}

			if ({  shfanapp: true, sharedplatform: true, ssgpay: true, shcouponapp: true }[deviceInfo.app]) {

				$('body').addClass('app_shfan');
				$('[data-bind-include=cmmHeader]').hide();
				$('[data-bind-include=cmmFooter]').hide();
			}

			//C2020062975633 챗봇 UI 추가
			if(deviceInfo.app=='shcardapp' && deviceInfo.chatbot==true){
				$('body').addClass('app_shfan');
				$('[data-bind-include=cmmHeader]').hide();
				$('[data-bind-include=cmmFooter]').hide();
			}



			lc.isMain = $('#header').hasClass('main') ? 'Y' : 'N';

			deviceInfo.app == 'shcardapp' && $('#header').addClass('app');

			$svc.menuReady(function() {
				var gnblist = cmmHeaderSvc.targetLink($("#skipNavi").data('targetLink'));
				var psnMsg = {};

				if ($menu.login) {
					// 자동 로그아웃 타이머 시작
					resetAutoLogoutTime();
					startAutoLogoutTimer();

					// 개인화 메시지
					psnMsg = getPsnMsgObj($menu.psnMsg);

					/*
					 * C2020080597581 운영 반영 되면 안 되는 소스
					if (document.referrer.indexOf('next_chatbot=chatbot') > 0) {
						if (!window.location.origin) {
							  window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
						}
						var url = window.location.origin + '/eer/EERPROXY/chatWindow.shc';

						openWebView(url, 'chatbot');
					}
					*/
				}

				vo.push({
					gnblist: gnblist,
					psnMsg: psnMsg,
					isArsLogin: $menu.arsLogin,
					menuReady: true,
					isMain: lc.isMain,
					isSearch: lc.headType == 'search' ? false : true,
					isApp: deviceInfo.app == 'shcardapp' ? 'Y' : 'N',
					login: $menu.login ? 'Y' : 'N',
					userName: $menu.userName || '-',
					isSpay: 'spay/pay_billpayment_webview' == deviceInfo.app,
					//C2020062975633 챗봇 UI 추가
					//isMobileChatbotOrisSpay: deviceInfo.mobile==true && deviceInfo.chatbot==true && deviceInfo.app!='shcardapp'
					isSpayAndisChatbotMobileWeb: ('spay/pay_billpayment_webview' == deviceInfo.app) || (deviceInfo.mobile==true && deviceInfo.chatbot==true && deviceInfo.app!='shcardapp')

				});

				// 1 Depth 선택 표시
				/* if($menu.sub.d1 >= 0) {
					// 메뉴에서 선택된 1depth가 실제 gnb 순서와 다를 수도 있음.
					var d1Title = $menu.list[$menu.sub.d1].title;
					var selectedIndex = -1;
					$('#gnbUl li a span').each(function(i) {
						if(d1Title === this.textContent) {
							selectedIndex = i;
							return false;
						}
					});

					if(selectedIndex >= 0) {
						$('#gnbUl .swiper-slide').eq(selectedIndex).addClass('current');
					}
				} */


				if (lc.isMain == 'N') {
					//var title;
					//CMS파일에 대해서는 title 우선순위를 다르게 처리함.
					/*
					if(/^\/pconts/.test(location.pathname)) {
						title = $($('[data-bind-include=cmmHeader]')[0]).data('headTitle') || ($menu.sub.data && $menu.sub.data.iaTitle);
					} else {
						title = $menu.sub.data && $menu.sub.data.iaTitle || $($('[data-bind-include=cmmHeader]')[0]).data('headTitle');
					}*/

					var title = $menu.sub.data && $menu.sub.data.iaTitle || $($('[data-bind-include=cmmHeader]')[0]).data('headTitle');
					if (['shfanapp', 'ssgpay', 'shcouponapp'].indexOf(deviceInfo.app) >= 0) {
						$('body').addClass('app_shfan');
						$('[data-bind-include=cmmHeader]').hide();
						$('[data-bind-include=cmmFooter]').hide();

						if ('shfanapp' == deviceInfo.app) {
							send('shpa_topTitleChg', { titleNm: title });
						}

						//C2021071692871  [신한페이판 리부트]신한페이판 노출용 홈페이지 헤더 분기영역 조정
						if('shfanapp' == deviceInfo.app && agent.indexOf('shpay') != -1){
							$('.head_title').hide();
							$('.util_wrap').hide();

							//C2023092758612 - 신한플레이 메인화면>카드홈 웹뷰개발 관련 / 카드홈일때
							if(agent.indexOf('cardhome') != -1){
								$('#header .header_body .body_inner').height(40);
								$('#header .header_body').height(40);
								$('.main #container').css('padding-top','40px');
								$('[data-bind-include=cmmHeader]').show();
								$('body').removeClass('app_shfan').addClass('shpay');
							}
						}
					}

					//C2020062975633 챗봇 UI 추가
					if(deviceInfo.app=='shcardapp' && deviceInfo.chatbot==true){
						$('body').addClass('app_shfan');
						$('[data-bind-include=cmmHeader]').hide();
						$('[data-bind-include=cmmFooter]').hide();
						send('shpa_topTitleChg', { titleNm: defTitle + '_' + title });

					}

					cmmHeaderSvc.setTitle(title);
				}

				// 자주 찾는 검색어
				chkFreqSrch();

				//추천 검색어
				chkRecommendSrch();

				if (headType == 'main') {
					cmmHeaderSvc.showMainEvent();

					// 인기검색어조회
//					http.json('/mob/MOBFM004N/MOBFM004R13.ajax', { label: 'service' }, {cache: {minutes_to_expiration: 10}, loadingbarState : 'not', skipAlert : true}).then(function (dt) {
//						if (!dt && !dt.recommendMenuSearch) {
//							return $svc.get('popup').alert('인기검색어가 없습니다');
//						}
//
//						var resRecommendMenuSearchList = dt.recommendMenuSearch.list || [];
//						var visibleRecommendList = [];
//						for(var i=0; i<resRecommendMenuSearchList.length; i++){
//							var resRecommendMenu = resRecommendMenuSearchList[i];
//							if(i<6) {
//								visibleRecommendList.push(resRecommendMenu);
//							} else {
//								break;
//							}
//						}
//
//						vo.push({
//							recommendMenuSearchList: visibleRecommendList || []
//						});
//					});

				}else if (headType == 'subMain') {
					cmmHeaderSvc.showSubMainEvent();
				} else {
					cmmHeaderSvc.showEvent();
				}
				mMenuPcSubList(gnblist);
				// CSR : C2022071474081 4->3depth 작업
				set4DepthData();
				fnHaedAllMenuNav(); // 1depth메뉴 스와이퍼
				fnGnbFavSwiper2();
				if(global.menuCompleteAfter) {
					global.menuCompleteAfter();
				}
			});

			cmmHeaderSvc.setTitle();

			$('.js_autoComplete').on('focus', showLate);
			$('.js_autoComplete').on('keyup', _.debounce(changeSearch, 200));		// event
			$('.js_autoComplete').on('keyup', enterQuery);

			$('.btn_clear').on('click', function(){
				$('#totalSrchQuck').val('');
				$('.srch_input_wrap .btn_clear').hide();
				$('.js_autoComplete').focus();
			});

			$('.srch_ico').on('click', function() {
				var query = $('#totalSrchQuck').val();
				var tempQuery = $('#totalSrchQuck').prop("temp");
				var placeHolder = '';

				if (query === undefined || query === '') {
					if(tempQuery === undefined || tempQuery === '') {
						placeHolder = $('#totalSrchQuck').attr('searchkeyword');
						if (placeHolder === undefined || placeHolder === ''){
							$svc.get('popup').alert("검색어를 입력하세요.");
							$('#totalSrchQuck').focus();
							return;
						}
					}
				}
				goQuery(placeHolder);
			});

			$('#mainSearchClick').on('click', function() {
				var query = $('#mainSearch_pc').val();
				var tempQuery = $('#mainSearch_pc').prop("temp");

				if (query === undefined || query === '') {
					if(tempQuery === undefined || tempQuery === '') {
						$svc.get('popup').alert("검색어를 입력하세요.");
						$('#mainSearch_pc').focus();
						return;
					}
				}
				goQuery();
			});

			shcAppHeaderRender();

			//현재 햄버거바 클릭시 나오는 전체메뉴 탭 스크롤 위치에 따라 메뉴 변동 2022-08-04 추가
			$('.allmenu_nav_wrap .allmenu_body').on('scroll', function(){
				var setTime = '';
				$('.allmenu_nav_wrap .tab_content').each(function(i){
					var scTop=$('.allmenu_nav_wrap .allmenu_body').scrollTop()
					var tPos=$(this).position().top + $('.allmenu_nav_wrap .allmenu_body').scrollTop() - 30
					if (Math.round(scTop) > Math.round(tPos)) {
						clearTimeout(setTime);
						var $this = $(this);
						setTime = setTimeout(function(){
							haedAllMenuNav.slideTo(i);
							$('#haedAllMenuNav').find('.tab_list .swiper-slide').eq(i).addClass('current').siblings().removeClass('current');
							$('#haedAllMenuNav').find('.tab_list .swiper-slide').eq(i).addClass('current').find('a').addClass('on')
							$('#haedAllMenuNav').find('.tab_list .swiper-slide').eq(i).addClass('current').siblings().find('a').removeClass('on');
							//console.log(i + '!!!')
						return; });
					}
				})
			});
		});

		on.back = function () {
			//C2020062975633 챗봇 UI 추가

			if(document.referrer.indexOf('chatWindow.shc') > 0 ){
				//history.back();
				window.close();
			}else{
				history.back()
			}

			//C2020083161931 추가
			//history.back()
		};
		on.search = function (e) {
		 	srch = util.fromJson(localStorage.getItem('srch')) || {};
			srch.lateItems = srch.lateItems || [];

			vo.push({
				srch: {
					lateItems: (!srch.autoLate && srch.lateItems) || []
				}
			});

		 };

		on.srch = {
		 	go: function (event) {
				ui.quickSrch.open(event.currentTarget);
				/*C2023022184436-2 - 23년 웹접근성 품질인증 심사대응을 위한 화면수정 및 보완 대응개발 요청 */
//				setTimeout(function () {
//					$('.js_autoComplete').focus();
//				}, 300);
		 	},
		 	close: function () {
				ui.quickSrch.close(event.currentTarget);
		 	},
		 	autoLate: function (e) {
		 		if(srch.autoLate) {
		 				vo.focus(e);
						srch.autoLate = '';
						srch.lstKindYn = 'Y';
						srch.lateItems = [];
						localStorage.setItem('srch', util.toJson(srch));
						$('.autoComplete_swiper').css('display','none');
	 					vo.push({
	 						srch: {
	 							autoLate: '자동 저장 끄기',
								lateItems: srch.lateItems,
								lstKindYn:'Y'
	 						}
	 					});
		 		} else {
		 			$svc.get('popup').confirm('최근 검색어 저장을 끄시겠습니까?').then(function (yn) {
		 				if(yn) {
		 					vo.focus(e);
							srch.autoLate = 'N';
							srch.lstKindYn = 'N';

							localStorage.setItem('srch', util.toJson(srch));

			 				vo.push({
			 					srch: {
			 						autoLate: '자동 저장 켜기',
									lstKindYn:'N',
									lateItems: []
			 					}
							});
						}
		 			})
		 		}
//		 		if(srch.autoLate) {
//		 				vo.focus(e);
//						srch.autoLate = '';
//						srch.lstKindYn = 'Y';
//						localStorage.setItem('srch', util.toJson(srch));
//
//		 					vo.push({
//		 						srch: {
//		 							autoLate: '자동 저장 끄기',
//									lateItems: srch.lateItems,
//									lstKindYn:'Y'
//		 						}
//		 					});
//		 		} else {
//		 				vo.focus(e);
//					    srch.autoLate = 'N';
//					    srch.lstKindYn = 'N';
//
//						localStorage.setItem('srch', util.toJson(srch));
//
//		 				vo.push({
//		 					srch: {
//		 						autoLate: '자동 저장 켜기',
//								lstKindYn:'N',
//								lateItems: []
//		 					}
//						 });
//		 		}
		 	},
		 	setLateText: function () {
		 		$('.js_autoComplete').val(this.keyword);
		 		goQuery();
		 	},
		 	lateDel: function () {
		 		var item = this;
		 		srch.lateItems = _.reject(srch.lateItems, function (v) {
		 			return v.keyword == item.keyword;
		 		});
		 		if (_.isEmpty(srch.lateItems)) {
		 			srch.lateItems = [];
					$('.autoComplete_swiper').css('display','none');
		 		}
		 		localStorage.setItem('srch', util.toJson(srch));
		 		vo.push({
		 			srch: {
		 				lateItems: srch.lateItems
		 			}
		 		});
		 	},
		 	//24.10.08 삭제
//		 	lateDelAll: function (e) {
//		 		$svc.get('popup').confirm('최근 검색어를 모두 삭제하시겠습니까?').then(function (yn) {
//		 			vo.focus(e);
//		 			if (yn) {
//		 				srch.lateItems = [];
//		 				localStorage.setItem('srch', util.toJson(srch));
//		 				vo.push({
//		 					srch: {
//		 						lateItems: []
//		 					}
//		 				});
//		 			}
//		 		});
//		 	},
		 	setArkText: function (k) {
				var keyword = this.keyword;
				keyword = keyword.split('<em class="srch_keyword">').join('');
				keyword = keyword.split('</em>').join('');

		 		$('.js_autoComplete').val(keyword);
		 		if(k) {
		 			goQuery();
		 		}
		 	},
		 	autoArk: function(e) {
		 		if(srch.autoArk) {
		 			$svc.get('popup').confirm('자동완성을 켜시겠습니까?').then(function (yn) {
		 				vo.focus(e);
		 				if(yn) {
							 srch.autoArk = '';
							 srch.autoArkYn = 'Y';
		 					localStorage.setItem('srch', util.toJson(srch));
		 					vo.push({
		 						srch: {
		 							autoArk: '자동완성 끄기',
									 arkItems: ark.items,
									 autoArkYn:'Y'
		 						}
		 					});
		 				}
		 			});
		 		} else {
		 			$svc.get('popup').confirm('자동완성을 끄시겠습니까?').then(function (yn) {
		 				vo.focus(e);
		 				if(yn) {
		 					srch.autoArk = 'N';

						 srch.autoArkYn = 'N';
		 				localStorage.setItem('srch', util.toJson(srch));
		 				vo.push({
		 					srch: {
		 						autoArk: '자동완성 켜기',
								 arkItems: [],
								 autoArkYn:'N'
		 					}
						 });
						}
		 			});
		 		}
		 	},
		 	arkBanner: function(url) {
				if (url.indexOf('https://') != 0) {
					$svc.get('location').href(url);
				} else if (deviceInfo.app == 'shcardapp' || deviceInfo.app=='shfanapp'){
					openAppUrl(url);
				}
			}
		};

		on.gotoInternalLink = function(e) {
			var title = $(e.currentTarget).find('span').text();

			for(var i = 0; i < $menu.list.length; i++) {
				if ($menu.list[i].title == title || $menu.list[i].iaTitle == title) {
					var url = $menu.list[i].link;
					if (url) {
						$svc.get('location').href(url);
					}
					return;
				}
			}
		};

		on.gotoLink = function(target) {
			if(target == 'corp') {
				fnLoadShcCorp('/cconts/html/main.html');
//				$svc.get('location').href('https://www.shinhancard.com/cconts/html/main.html');
			} else if(target == 'store') {
				openAppUrl('https://www.shinhancard.com/conts/store/main.jsp');
//				$svc.get('location').href('https://www.shinhancard.com/conts/store/main.jsp');
			} else if(target == 'hppbiz') {
				openAppUrl('https://www.shinhancard.com/conts/hppbiz/main.jsp');
//				$svc.get('location').href('https://www.shinhancard.com/conts/hppbiz/main.jsp');
			} else if(target == 'myauto') {
				//$svc.get('location').href('https://myauto.shinhancard.com');
				fnLoadMyAuto('/conts/html/main.html');
			} else if(target == 'mycar') {
				fnLoadMyCar('/conts/html/main.html');
				//$svc.get('location').href('https://mycar.shinhancard.com/');
			} else if(target == 'tops') {
				$svc.get('location').href('https://tops.shinhancard.com/');
			} else if(target == 'allthat') {
				//$svc.get('location').href('https://allthat.shinhancard.com/');
				fnLoadNAP('/');
			} else if(target == 'arumin') {
				$svc.get('location').href('/mob/MOBFM711N/MOBFM711R01.shc');
			} else if(target == 'lifemall') {
				$svc.get('location').href('https://www.shinhancard.com/');
			} else if(target == 'plus') {
				$svc.get('location').href('https://www.shinhancard.com/');
			} else if(target == 'bigdata') { //C2021080451342 홈페이지 상단링크 수정
				$svc.get('location').href('https://databada.shinhancard.com');
			} else if(target == 'shinhanbank') {
				$svc.get('location').href('https://www.shinhan.com/');
			}
		}

		on.mMenu = {
			open: function (e) {
				try {
					var incaNos = $svc.get('incaNos');
					if (incaNos) incaNos.close();
				} catch (e) {}

				mMenuTablist();

				global.ui.fullMenu.open(e.currentTarget, '#fullMenuWrap');

				//현재 current 된 메뉴로 이동 2022-08-04 추가
				$('#haedAllMenuNav').find('.tab_list .swiper-slide.current > a').click();

				if(!$('#haedAllMenuNav').hasClass('no-swiper')){
					haedAllMenuNav.destroy(); // 1depth메뉴 스와이프 파괴
				}
				fnHaedAllMenuNav(); // 1depth메뉴 스와이프 생성
				if(!$('#gnbFavSwiper2').hasClass('no-swiper')){
					gnbFavSwiper2.destroy(); //최근이용메뉴 스와이프 파괴
				}


//				var fmsi = $svc.get('util').getCookie('fmsi');
//				if (typeof fmsi !== 'string') {
//					fmsi = '0';
//				}
//				if (fmsi=='1') {
//					$('.fullMenu_nav > .tab_list > li:eq(0)').removeClass('current').children().attr('aria-selected','false');
//					$('.fullMenu_nav > .tab_list > li:eq(1)').addClass('current').children().attr('aria-selected','true');
//					$('#fullMenuTabCont_1').removeClass('current');
//					$('#fullMenuTabCont_2').addClass('current');
//				}
//				else {
//					$('.fullMenu_nav > .tab_list > li:eq(1)').removeClass('current').children().attr('aria-selected','false');
//					$('.fullMenu_nav > .tab_list > li:eq(0)').addClass('current').children().attr('aria-selected','true');
//					$('#fullMenuTabCont_2').removeClass('current');
//					$('#fullMenuTabCont_1').addClass('current');
//				}
			},
			close: function (e) {
				global.ui.fullMenu.close(e.currentTarget, '#fullMenuWrap');
				// 전체메뉴 쿠키 저장
				var fmsi = $('#fullMenuTabCont_1').hasClass('current') ? '0' : '1';
				$svc.get('util').setCookie('fmsi', fmsi, {expireDay:365});
			},
			login: function () {
				$svc.get('location').goLogin();
			},
			logout: function () {
				$svc.get('popup').confirm('로그아웃 하시겠습니까?').then(function (yn) {
					if(yn) {
						$svc.get('location').goLogout();
					}
				});
			},
			extendLogoutTime: function(e) {  // 자동로그아웃 시간 연장
				http.submit('/mob/cmm/MOBFMLOGIN/CMMExtendLogoutTimeC.ajax').then(function(rsHttp){
					if (rsHttp.result == "logout") {
						alert("이미 세션이 만료되어 로그아웃됩니다.");
						$svc.get('location').goLogout();
					}
					else {
						resetAutoLogoutTime();
					}
				});
			},
			tit: function (idx) {
				if (this.link) {
					return $svc.get('location').href(this.link);
				}
			},
			goLink: function (url) {
				if (url) {
					$svc.get('location').href(url);
				}
				return false
			},
			goHome: function () {
				$svc.get('location').goHome();
			}
		};

		on.goPushList = function() {
			$svc.get('Native').goPushList('{}', function(data){});
			return false;
		};

		on.gotoSearch = function(keyword) {
			$('.js_autoComplete').val(keyword);
			goQuery();
		};

		on.callArs = function(){
			var v = {
				code: '01008'
			}

			$svc.get('http').submit('/mob/MOBFM007N/MOBFM00706.ajax', v).then(function(data) {
				window.location.href = 'tel:' + $menu.arsNumber;
			}, function(error) {
				$log('loading error', error);
			});
		}

		// 챗봇 기능
		on.chatBot = function(){
			//console.log("useragent chatBot : "+navigator.userAgent.toLowerCase());

			var keyword = $('#query').val();
			if (!window.location.origin) {
				  window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
			}

			var ver;
			var chk_ver = 537;


			var url = window.location.origin + '/eer/EERPROXY/chatWindowNA.shc';


			//C2020100687111 챗봇 비로그인 서비스 관련 2단계 개발요청
			if (deviceInfo.app && deviceInfo.app == 'shcardapp') {
				send('shpa_appVersion', {}, function (data) {
					if (typeof (data) == 'string') data = JSON.parse(data);
				    if (data && data.ver) {
				      ver = data.ver.replace(/\./gi, '');

				      if(parseInt(ver)<parseInt(chk_ver)){
				    	  url= window.location.origin + '/eer/EERPROXY/chatWindow.shc';
						  openWebView(url, 'chatbot');
				      }else{
						  openWebView(url, 'chatbot');
				      }
				    }else{
						  openWebView(url, 'chatbot');
				    }
				});

			}else{
				  openWebView(url, 'chatbot');
			}

			/*
			if (keyword) {
				$svc.get('http').json('/mob/cmm/COMMON/EncodeBase64.ajax', {query:keyword}).then(function(rsHttp) {
					if (rsHttp && rsHttp.query) {
						url = url + '?query=' + rsHttp.query;
					}
					$svc.get('location').href(url);
				});
				return;
			}
			*/



		}

		// 플레이 유도 브릿지페이지 체크
		function checkBridgePage() {
			var urlList = {
				"/mob/MOBFM501N/MOBFM501R31.shc" : "MOBFM501R31", // 혜택>마이샵쿠폰
				"/mob/MOBFM022N/MOBFM022R01.shc" : "MOBFM022R01", // 혜택>포인트조회
				"/mob/MOBFM031N/MOBFM031R01.shc" : "MOBFM031R01", // 마이>이용내역>카드이용실척충족현황
				"/mob/MOBFM051N/MOBFM051R01.shc" : "MOBFM051R01", // 마이>이용한도>이용한도조회
				"/mob/MOBFM047N/MOBFM047R20.shc" : "MOBFM047R20", // 마이>이용금액결제>즉시결제
				"/mob/MOBFM047N/MOBFM047R01.shc" : "MOBFM047R20", // 마이>이용금액결제>즉시결제 ASIS
				"/mob/MOBFM02521N/MOBFM02521R01.shc" : "MOBFM02521R01", // 마이>내가받은혜택
				"/mob/MOBFM045N/MOBFM045R01.shc": "MOBFM045R01", // 마이>카드이용내역(매출전표)
				"/mob/MOBFM043N/MOBFM043R01.shc": "MOBFM043R01", // 마이>이용대금명세서
				"/mob/MOBFM052N/MOBFM052C02.shc" : "MOBFM052C02", // 마이>이용한도 상향신청
				"/mob/MOBFM289N/MOBFM289C01.shc" : "MOBFM289C01", // 고객센터>카드재발급신청
				"/mob/MOBFM087N/MOBFM087N01.shc" : "MOBFM087N01", // 금융>장기카드대출
				"/mob/MOBFM086N/MOBFM086C23.shc" : "MOBFM086C23", // 금융>단기카드대출>카드대금결제
				"/mob/MOBFM086N/MOBFM086C22.shc" : "MOBFM086C22", // 금융>단기카드대출>계좌입금
				"/mob/MOBFM094N/MOBFM094N00.shc" : "MOBFM094N00", // 금융>일부결제금액이월약정>이용안내
				"/mob/MOBFM003N/MOBFM003C01.shc" : "MOBFM003C01", // 회원가입
				"/mob/MOBFM001N/MOBFM001C01.shc" : "MOBFM001C01"  // 로그인
			}

			var loc = location.href.replace(location.origin, '');
			if(loc.indexOf('?') > -1) {
				loc = loc.substr(0, loc.indexOf('?'));
			}

			if(urlList[loc] != undefined) {
				if(deviceInfo.app && deviceInfo.app == 'shcardapp') {
					if (urlList[loc] == "MOBFM001C01") {
						$svc.get('location').go('/mob/cmm/COMMONBRIDGEN/endCardBridgePage.shc', {'url':loc, 'screenId':urlList[loc]});
					} else {
						$svc.get('location').go('/mob/cmm/COMMONBRIDGEN/cardBridgePage.shc', {'url':loc, 'screenId':urlList[loc]});
					}
				}
			}
		}

		cbm.main = on.mMenu.open;

		var autoLogoutTO = null;
		function startAutoLogoutTimer() {
			var param = {};
			autoLogoutTO = setInterval(function(){
				logoutDownCounter = logoutDownCounter - 1;
				if (logoutDownCounter < 0) {
					clearInterval(autoLogoutTO);
					autoLogoutTO = null;

					if(!deviceInfo.local) {
						param.callAutoLogOut();
						//$svc.get('popup').alert('세션이 만료되었습니다.').then(function () {
						//	$svc.get('location').goLogout();
						//});
					}

				}else if(logoutDownCounter != logoutPopupCounter) {
					var mm = util.lPad(Math.floor(logoutDownCounter / 60) + '', 2, '0');
					var ss = util.lPad((logoutDownCounter % 60) + '', 2, '0');
					$("#logoutTime").text(mm + ':' + ss);
					$("#logoutTimeTooltip").text(mm + ':' + ss); // C2023080981241 main.html 툴팁에서 사용.
					$("#logoutTimeMo").text(mm + ':' + ss); // C2023080981241 main.html 툴팁에서 사용.
					$("#logoutTimeMoTooltip").text(mm + ':' + ss); // C2023080981241 main.html 툴팁에서 사용.
					$('#logOutPopCount').text(ss);	//로그아웃 팝업

				} else {
					if(!deviceInfo.local) {
						param.time = logoutDownCounter;
						$svc.get('popup').open({name: 'cmmLogOut', param: param}).then(function(rsPop){
							if(rsPop) {
								on.mMenu.extendLogoutTime();
							}else {
								clearInterval(autoLogoutTO);
								autoLogoutTO = null;
								$svc.get('location').goLogout();
							}
						});
					}
				}
			}, 1000);
		}

		function resetAutoLogoutTime() {
			$("#logoutTime").text($menu.loginInitTime);
			$("#logoutTimeTooltip").text($menu.loginInitTime); // C2023080981241 main.html 툴팁에서 사용.
			$("#logoutTimeMo").text($menu.loginInitTime); // C2023080981241 main.html 툴팁에서 사용.
			$("#logoutTimeMoTooltip").text($menu.loginInitTime); // C2023080981241 main.html 툴팁에서 사용.

			logoutDownCounter = getLoginTime($menu.loginInitTime, '10:00');
			logoutPopupCounter = getLoginTime($menu.loginPopupTime, '01:00');
		}
		/*
		function recursionLoginTimer(t) {
			if(t!=null){
				alert('recursionLoginTimer call')
				return recursionLoginTimer(t.opener);
			}else{

				if ($menu.login) {
					alert('login timer call');
					//location.reload();
					// 자동 로그아웃 타이머 시작
					resetAutoLogoutTime();
					startAutoLogoutTimer();
				}
			}
		}
		*/

		function getLoginTime(loginTime, def){
			var time = loginTime || def;
			var mm = parseInt(time.split(':')[0], 10);
			var ss = parseInt(time.split(':')[1], 10);

			return mm * 60 + ss;
		}

		function getPsnMsgObj(psnMsg) {

			var obj = {};
			var msg = '';

			var color = psnMsg.color.substr(8,2);
			if(color=='01'){
				msg='(하늘)';
			}else if(color=='02'){
				msg='(황금)';
			}else if(color=='03'){
				msg='(주황)';
			}else if(color=='04'){
				msg='(초록)';
			}else if(color=='05'){
				msg='(보라)';
			}else if(color=='06'){
				msg='(분홍)';
			}else if(color=='07'){
				msg='(연남)';
			}

			obj.colorTxt='나만의 확인메세지'+msg;
			obj.message = psnMsg.message || '';
			obj.color = { class: 'sinceDate ' + (psnMsg.color || '') };
			obj.icon = { class: 'left ' +( psnMsg.icon || '') };

			if(psnMsg.icon=='A01'){
			  obj.iconTxt ='라쿤 - 플리';
			}else if(psnMsg.icon=='A02'){
			  obj.iconTxt ='부엉이 - 레이';
			}else if(psnMsg.icon=='A03'){
			  obj.iconTxt ='곰 - 쏠';
			}else if(psnMsg.icon=='A04'){
			  obj.iconTxt ='두더지 - 몰리';
			}else if(psnMsg.icon=='B01'){
			  obj.iconTxt ='공룡 - 리노';
			}else if(psnMsg.icon=='B02'){
			  obj.iconTxt ='여우 - 슈';
			}else if(psnMsg.icon=='B03'){
			  obj.iconTxt ='펭귄 - 도레미';
			}else if(psnMsg.icon=='B04'){
			  obj.iconTxt ='바다사자 - 루루와 라라';
			}else{
			  obj.iconTxt='라쿤 - 플리';
			}

			obj.level = psnMsg.level || '';

			obj.loginTime = psnMsg.loginTime && $svc.get('util').formatDate(psnMsg.loginTime, 'yyyy.MM.dd hh24:mi');

			return obj;
		}

		function enterQuery(e) {
			var query = $('#totalSrchQuck').val();
			var placeHolder = '';
			//var tempQuery = $('#totalSrchQuck').prop("temp");
			if ($("#quickSrch").find('.is_active').length > 0) {
				if (e.keyCode == 13) {
					if (!e.target.value) {
						if (e.target.temp === undefined || e.target.temp === '') {
							placeHolder = $('#totalSrchQuck').attr('searchkeyword');
							if (placeHolder === undefined || placeHolder === ''){
								$svc.get('popup').alert("검색어를 입력하세요.");
								vo.focus(e);
								return;
							}
						}
					}
					goQuery(placeHolder);
				}
			}

			if(query.length > 0) {
				$('.srch_input_wrap .btn_clear').show();
			}
			else {
				$('.srch_input_wrap .btn_clear').hide();
			}

		}

		function goQuery(placeholder) {
			setTimeout(function () {
				var v = '',
					i = _.findIndex(srch.lateItems, function (c) { return c.keyword == v });
				var isExist = false;

				$('.js_autoComplete').each(function(index, item) {
					var value = item.value;
					var tempValue = item.temp;

					if ( value.length > 0 ) {
						v = value;
						isExist = true;
					} else {
						if ( !isExist && tempValue && tempValue.length > 0 )
							v = tempValue;
					}
				});

				if ( srch.lateItems != undefined ) {
					if(i > -1) {
						srch.lateItems.splice(i, 1)
					}
					//srch.lateItems.unshift({ keyword: v });
					if(srch.lateItems.length > 10) {
						srch.lateItems.splice(10);
					}
				}
				if (placeholder != undefined && placeholder !== '') {
					// placeholder param 이  null 또는 undefined 또는 '' 가 아닌 경우
					// = 검색어 입력이 안된경우 placeholder로 조회한다
					v = placeholder
				}
				srch.query = v;
				if(v && srch.lstKindYn=='Y') {
					localStorage.setItem('srch', util.toJson(srch));
				}

				window.location.href = '/mob/MOBFM004N/MOBFM004R0201.shc?query=' + encodeURIComponent(v);
			}, 1);
		}

		// 메뉴 라벨 및 설명 추가
		function setDepthData(m1, tx) {
			if(navigator.userAgent.toLowerCase().indexOf('mobile') > 0 || deviceInfo.app =='shcardapp') {
				if(m1.label == '01') {tx.push('<span class="icon-text-a2">New</span>');}
				else if(m1.label == '02') {tx.push('<span class="icon-text-a3">Update</span>');}
				else if(m1.label == '03') {tx.push('<span class="icon-text-a5">Beta</span>');}
			}

			if(m1.menuDesc == 'Y') {
				tx.push('<div class="menu-tip-box">');
				tx.push('<button class="menu-tip-trigger" role="button" title="메뉴안내">안내</button>');
				tx.push('<div class="menu-tip-pop">');
				tx.push('<p class="text">'+m1.menuDescVal+'</p>');
				tx.push('<button class="menu-tip-close">닫기</button>');
				tx.push('</div>');
				tx.push('</div>');
			}

			return tx;
		}

		function mMenuTablist() {
			if (!$menu.list) return $svc.get('popup').alert('메뉴데이터가 존재하지 않습니다.');

			if($menu.login){
				$menu.list = filterMenuData($menu.list);
			}

			var d1SelIndex = ($menu.sub.d1 < 0) ? 0 : $menu.sub.d1;
			vo.push({
				mMenu: {
					list: $menu.list,
					d1SelIndex: d1SelIndex
				},
				login: $menu.login ? 'Y' : 'N'
			});

			var tx = [];
			var txTab = [];

			// C2024020776544-1 24년 장애인차별금지법 웹접근성 품질인증 심사대응 (role="button" > role="tab")
			$menu.list.forEach(function(d1, index) {
				txTab.push('<li role="none" class="swiper-slide ' + (index == d1SelIndex ? 'current' : '') + '" data-plugin-class="current:mMenu.d1SelIndex'+ index +'">');
				txTab.push('<a href="#fullMenuTabCont_2'+ index +'" id="fullMenuTabNav_2'+ index +'" aria-controls="fullMenuTabCont_2'+ index +'" role="tab" aria-selected="false">');
				txTab.push('<span><i class="icon icon1"></i>'+d1.title+'</span>');
				txTab.push('</a>');
				txTab.push('</li>');

				tx.push('<div id="fullMenuTabCont_2' + index + '" class="tab_content ' + (index == d1SelIndex ? 'current' : '') + '" role="tabpanel" aria-labelledby="fullMenuTabNav_2' + index + '">');
				var iaTitle = '';
				if(_.isEmpty(d1.iaTitle)) {
					iaTitle = d1.title;
				} else {
					iaTitle = d1.iaTitle;
				}

				////////////// C2020091671561 홈페이지 검색기능 수정 개발 요청 //////////////////
				if(localStorage.getItem(d1.title) != null) {
					var lsKeyword = JSON.parse(localStorage.getItem(d1.title));
					var today = new Date();

					if(today.getTime() > lsKeyword[lsKeyword.length-1].expiresAt) { // 만료시
						localStorage.removeItem(d1.title);
					}
				}

				var topMenuParam = {};
				topMenuParam.query = encodeURIComponent(d1.title);

				////////////// C2020091671561 홈페이지 검색기능 수정 개발 요청 //////////////////

				tx.push('<div class="m-line"><span class="name">'+ d1.title +'</span></div>');
				tx.push('<h1 class="allmenu_title"><a href="' + d1.link + '"><span class="m-name">' + iaTitle + '</span></a></h1>');
				tx.push('<div class="allmenu_cont">');

				if(!_.isEmpty(d1.menu)) {
					d1.menu.forEach(function(d2, index) {
						var isEmpty3Depth  = _.isEmpty(d2.menu);

						tx.push('<div class="allmenu_list">');
						if($menu.sub.d2 === index) {
							// 선택된 2depth 처리
						}

						tx.push('<h2 class="tit">');

						if(isEmpty3Depth) {
							tx.push('<a href="javascript:;" ' + getOnclickHtml(d2) + (d2.urlTcd == '02' ? 'class="outlink"' : '') + '><span class="m-name">' + d2.title + '</span></a>');
						}else {
							tx.push('<span class="m-name">'+d2.title+'</span>');
						}

						tx = setDepthData(d2, tx);

						tx.push('</h2>');

						if(!isEmpty3Depth) {
							tx.push('<ul class="dep1_list">');
							d2.menu.forEach(function(d3, index) {
								var isEmpty4Depth  = _.isEmpty(d3.menu);

								if($menu.sub.d3 === index) {
									// 선택된 3depth 처리
								}

								tx.push('<li class="dep1_item"><a href="javascript:;" class="dep1_link ' + (d3.urlTcd == '02' ? 'outlink' : '') + '" ' + getOnclickHtml(d3) + '><span class="m-name">'  + d3.title + '</span></a>');

								tx = setDepthData(d3, tx);

								tx.push('</li>');
							});
							tx.push('</ul>');
						}
						tx.push('</div>');
					});
				}
				tx.push('</div></div>');
			});
			$('#tabSelectedCheck').html(txTab.join(''));
			$('.allmenu_body').html(tx.join(''));

			//현재 햄버거바 클릭시 나오는 전체메뉴 1뎁스탭  curent 된 메뉴에 on 클래스 추가  2022-08-04 추가
			$('#haedAllMenuNav').find('.tab_list .swiper-slide.current > a').addClass('on');

			//현재 햄버거바 클릭시 나오는 전체메뉴 탭  클릭 해당 컨텐츠 이동  2022-08-04 추가
			$('#haedAllMenuNav .swiper-slide > a').click(function(){
				var targetPos = $($(this).attr('href')).position().top + $('.allmenu_nav_wrap .allmenu_body').scrollTop();
				if($(this).parent().index()==0){
					targetPos=0
				}
				$('.allmenu_nav_wrap .allmenu_body').stop().animate({'scrollTop':targetPos},300);
				//console.log(targetPos)
				targetPos=0;
			});

			//20220923 IOS 16ver에서 최근이용메뉴가 작동하지 않아 주석처리
//			if(navigator.userAgent.toLowerCase().indexOf('mobile') > 0 || deviceInfo.app =='shcardapp') {
//				var txTmpHtml = "";
//				var menuSetIsLogin = $menu.login;
//				if(menuSetIsLogin) {
//					$svc.get('http').submit('/mob/cmm/COMMONLATELYSN/getLatelySearchList.ajax', "").then(function(rs) {
//						if(rs.latelySearchList.length > 0) {
//							$("#gnbFavSwiper2").show();
//							for(var i=0; i<rs.latelySearchList.length; i++){
//								var data = rs.latelySearchList[i];
//								txTmpHtml += '<li class="swiper-slide">';
//								txTmpHtml += '<a class="btn-word" href="#none" onclick="goMenuLink(\''+data.mobWbSceUrlAr+'\', \''+data.mobWbSceUrlTcd+'\', \''+data.mobWbMnuId+'\')" role="button">'+rs.latelySearchList[i].mobWbMnuSceNm+'</a>';
//								txTmpHtml += '</li>';
//							}
//							$("#gnbFavSwiper2Ui").html(txTmpHtml);
//							fnGnbFavSwiper2(); //최근이용메뉴
//						} else {
//							$("#gnbFavSwiper2NoData").show();
//						}
//					}, function(error) {
//						$log('loading error', error);
//					});
//				} else {
//					$("#gnbFavSwiper2NoLogin").show();
//				}
//			}

			// 알림함일 경우 Native Bridge 호출
			$('#fullMenuTabCont_2 a:contains("알림함")').attr({
				'href': '#',
				'data-plugin-click': 'goPushList()'
			}).removeAttr('onclick');

			//$('.allmenu_nav li a').attr('title', '미선택됨');
			//$('.allmenu_nav li.current a').attr('title', '선택됨');

			vo.update();

			if(!$menu.events || !$menu.events["전체메뉴 핫배너"]){
				return;
			}
			var menuTabInfos = $menu.events["전체메뉴 핫배너"] || {};

			if(menuTabInfos.length > 0){
				menuTabInfos.sort(function(a, b){
					return a.eventRank - b.eventRank;
				});

				var menuTabBanner = menuTabInfos[0];		// 전체메뉴 핫배너는 첫번째 1개만 노출
				if (!_.isEmpty(menuTabBanner)){
					var bannerTx = [];
					bannerTx.push('<div class="event_allmenu">');
					bannerTx.push('<p class="event_cont">');
					bannerTx.push('<a href="javascript:;"' +' class="link" onclick="goEventLink(\'' + util.mergeUriQueryParam(menuTabBanner.link, 'logbanner', 'Menu_Hot')
									+ '\', \''+menuTabBanner.linkType + '\')" data-link-type="' + menuTabBanner.linkType + '">');
					bannerTx.push('<span class="img" aria-hidden="true"><img src="' + menuTabBanner.image + '" alt="' + menuTabBanner.alt + '"></span>');
					bannerTx.push('<strong class="tit arw">' + menuTabBanner.title+'</br>'+menuTabBanner.text+'</strong></a></p></div>');
					$('.allmenu_etc').html(bannerTx.join(''));
				}
			}

		}

		// PC GNB 최근이용메뉴 스와이퍼 (PC 에서 마우스오버하면 나오는 최근이용메뉴 스와이프) 2022-08-04 추가
		function fnGnbFavSwiper1(){
			if($('#gnbFavSwiper1 .swiper-slide').length>1){
				gnbFavSwiper1 = new Swiper('#gnbFavSwiper1 .swiper-container', {
					slidesPerView: 'auto',
					spaceBetween: 0,
					allowTouchMove: true,
					freeMode: true,
					navigation: {
						nextEl: '#gnbFavSwiper1 .swiper-button-next',
						prevEl: '#gnbFavSwiper1 .swiper-button-prev',
					},
					observer: true,
					obsereParents: true,
					watchSlidesVisibility: true,
					on: {
						init: function(){
							ui.swiperAccess($('#gnbFavSwiper1 .swiper-container'), 'auto');
						},
						slideChangeTransitionStart: function(){
							ui.swiperAccess($('#gnbFavSwiper1 .swiper-container'), 'auto');
						},
						resize: function(){
							ui.swiperAccess($('#gnbFavSwiper1 .swiper-container'), 'auto');
						},
					}
				});
				$('#gnbFavSwiper1').removeClass('no-swiper') // 08-04 스와이퍼가 실행되면 no-swiper 클래스 삭제
			}else{
				$('#gnbFavSwiper1').addClass('no-swiper')
			}
		}

		// 햄버거바 클릭시 나오는  최근이용메뉴 스와이퍼 2022-08-04 추가
		function fnGnbFavSwiper2(){
			if($('#gnbFavSwiper2 .swiper-slide').length>1){
				 gnbFavSwiper2 = new Swiper('#gnbFavSwiper2 .swiper-container', {
					slidesPerView: 'auto',
					spaceBetween: 0,
					allowTouchMove: true,
					freeMode: true,
					navigation: {
						nextEl: '#gnbFavSwiper2 .swiper-button-next',
						prevEl: '#gnbFavSwiper2 .swiper-button-prev',
					},
					observer: true,
					obsereParents: true,
					watchSlidesVisibility: true,
					on: {
						init: function(){
							ui.swiperAccess($('#gnbFavSwiper2 .swiper-container'), 'auto');
						},
						slideChangeTransitionStart: function(){
							ui.swiperAccess($('#gnbFavSwiper2 .swiper-container'), 'auto');
						},
						resize: function(){
							ui.swiperAccess($('#gnbFavSwiper2 .swiper-container'), 'auto');
						},
					}
				});
				$('#gnbFavSwiper2').removeClass('no-swiper') // 08-04 스와이퍼가 실행되면 no-swiper 클래스 삭제
			}else{
				$('#gnbFavSwiper2').addClass('no-swiper')
			}
		}

		//햄버거바 클릭시 나오는 전체메뉴 1댑스탭 스와이퍼 2022-08-04 추가
		function fnHaedAllMenuNav(){
			if($('#haedAllMenuNav .swiper-slide').length>1){
				haedAllMenuNav = new Swiper('#haedAllMenuNav .swiper-container', {
					slidesPerView: 'auto',
					spaceBetween: 0,
					//allowTouchMove: true,
					freeMode: true,
					navigation: {
						nextEl: '#haedAllMenuNav .swiper-button-next',
						prevEl: '#haedAllMenuNav .swiper-button-prev',
					},
					observer: true,
					obsereParents: true,
					watchSlidesVisibility: true,
					on: {
						init: function(){
							ui.swiperAccess($('#haedAllMenuNav .swiper-container'), 'auto');
						},
						slideChangeTransitionStart: function(){
							ui.swiperAccess($('#haedAllMenuNav .swiper-container'), 'auto');
						},
						resize: function(){
							ui.swiperAccess($('#haedAllMenuNav .swiper-container'), 'auto');
						},
					}
				});
				$('#haedAllMenuNav').removeClass('no-swiper') // 08-04 스와이퍼가 실행되면 no-swiper 클래스 삭제
			}else{
				$('#haedAllMenuNav').addClass('no-swiper')
			}
		}

		function getOnclickHtml(data) {
			var html = 'onclick="goMenuLink(\'data.link\', \'data.urlTcd\', \'data.id\')"';

			html = html.replace('data.link', data.link);
			html = html.replace('data.urlTcd', data.urlTcd);
			html = html.replace('data.id', data.id);

			return html;
		}

		function set4DepthData() {
			var tDepthLen = tDepthVl.length;
			var fDepthlen = fDepthVl.length;

			var depthTx = [];
			var headerTitle = "";
			var tabBol = false;

			depthTx.push('<div class="tab_type01 swiper_tab depth4-tab" id="tabSwiper0"><div class="tab_pull">');
			depthTx.push('<button type="button" class="swiper-button-prev swiper-button-disabled" tabindex="0" role="button" title="이전 슬라이드 보기" aria-disabled="true">');
			depthTx.push('<span class="blind">이전</span></button>');
			depthTx.push('<button type="button" class="swiper-button-next swiper-button-disabled" tabindex="0" role="button" title="다음 슬라이드 보기" aria-disabled="true">');
			depthTx.push('<span class="blind">다음</span></button>');
			depthTx.push('<div class="swiper-container swiper-container-initialized swiper-container-horizontal">');
			depthTx.push('<ul class="tab_list swiper-wrapper" role="tablist" style="transform: translate3d(0px, 0px, 0px);">');

			for(var i=0; i<tDepthLen; i++) {
				for(var j=0; j<fDepthlen; j++) {
					var loc = location.href.replace(location.origin, '');
					var subLoc = "";
					var fDepthUrlCheck = $.trim(fDepthVl[j].link).indexOf('?') > 1; // 4depth url '?' 뒤 파라미터 체크

					fDepthUrlCheck ? (subLoc = loc) : (loc.indexOf('?') > -1 ? subLoc = loc.substr(0, loc.indexOf('?')) : subLoc = loc);

					if(subLoc == $.trim(fDepthVl[j].link) && $.trim(tDepthVl[i].id) == $.trim(fDepthVl[j].parentId)) {
						headerTitle = tDepthVl[i].title;
						tabBol = true;
						tDepthVl[i].menu.forEach(function(d4, index) {
							depthTx.push('<li class="swiper-slide ' + (subLoc == $.trim(d4.link) ? 'current' : '') + ' swiper-slide-active" role="none">');
							depthTx.push('<a href="'+ d4.link +'" data-link="true" role="tab" aria-selected="true" class="role_link">' + d4.title + '</a></li>');
						});
					}
				}
			}

			depthTx.push('</ul><span class="swiper-notification" aria-live="assertive" aria-atomic="true"></span></div></div></div>');
			if(tabBol && $(".tab_type01.depth4-tab").length < 1) {
				$('.h_title38').text(headerTitle);
				$('.h_title38').after(depthTx.join(''));
			}
		}

		function mMenuPcSubList(gnblist) {
			if (!$menu.list) return $svc.get('popup').alert('메뉴데이터가 존재하지 않습니다.');

			if($menu.login){
				$menu.list = filterMenuData($menu.list);
			}

			var targetTitle = '';
			gnblist.forEach(function(obj) {
				if(!_.isEmpty(obj.current)){
					targetTitle = obj.title;
				}
			});

			var tx = [];
			$menu.list.forEach(function(d1, index) {

				var topMenuParam = {};
				topMenuParam.query = encodeURIComponent(d1.title);

				// play app의 경우 1depth 혜택/디지털을 세팅하지 않고 4depth 구조에 관한 데이터만 세팅
				if('shfanapp' == deviceInfo.app && (d1.title == '혜택' || d1.title == '디지털')) {
					if(!_.isEmpty(d1.menu)) {
						d1.menu.forEach(function(d2, index) {
							var isEmpty3Depth  = _.isEmpty(d2.menu);
							if(!isEmpty3Depth) {
								d2.menu.forEach(function(d3, index) {
									var isEmpty4Depth  = _.isEmpty(d3.menu);
									if(!isEmpty4Depth) {
										tDepthVl.push(d3);
										d3.menu.forEach(function(d4, index) {
											fDepthVl.push(d4);
										});
									}
								});
							}
						});
					}
				}  else {
				    // C2025021977775  pc홈페이지 모바일 홈페이지 웹접근성 심사 관련 대응 요청의건 (role="tab" 삭제)
					// C2024020776544-1 24년 장애인차별금지법 웹접근성 품질인증 심사대응 (role="button" > role="tab")
					if(targetTitle == d1.title){
						tx.push('<li class="menu' + index + ' swiper-slide swiper-slide-active current"><a href="'+ d1.link +'" class="role_link"><span>' + d1.title + '</span></a>') ;
					} else {
						tx.push('<li class="menu' + index + ' swiper-slide swiper-slide-active"><a href="'+ d1.link +'" class="role_link"><span>' + d1.title + '</span></a>') ;
					}

					tx.push('<div class="allmenu_group">');
					tx.push('<div id="topMenuParent_' + index + '" class="allmenu_scroll">');

					////////////// C2020091671561 홈페이지 검색기능 수정 개발 요청 //////////////////

					if(localStorage.getItem(d1.title) != null) {
						var lsKeyword = JSON.parse(localStorage.getItem(d1.title));
						var today = new Date();

						if(today.getTime() > lsKeyword[lsKeyword.length-1].expiresAt) { // 만료시
							localStorage.removeItem(d1.title);
						}
					}

					var iaTitle = '';
					if(_.isEmpty(d1.iaTitle)) {
						iaTitle = d1.title;
					} else {
						iaTitle = d1.iaTitle;
					}

					tx.push('<div class="allmenu_title">');
					tx.push('<a href="' + d1.link + '" role="button"><span class="m-name">'+ iaTitle +'</span></a>');
					tx.push('</div>');
					tx.push('<div class="allmenu_cont">');

					if(!_.isEmpty(d1.menu)) {
						d1.menu.forEach(function(d2, index) {
							var isEmpty3Depth  = _.isEmpty(d2.menu);

							tx.push('<div class="allmenu_list">');
							if($menu.sub.d2 === index) {
								// 선택된 2depth 처리
							}

							tx.push('<h2 class="tit">');

							if(isEmpty3Depth) {
								tx.push('<a href="javascript:;" ' + getOnclickHtml(d2) + (d2.urlTcd == '02' ? 'class="outlink"' : '') + '><span class="m-name">' + d2.title + '</span></a>');
							}else {
								tx.push('<span class="m-name">'+ d2.title +'</span>');
							}

							// 뱃지 & 메뉴 tooltip 추가
							tx = setDepthData(d2, tx);

							tx.push('</h2>');

							if(!isEmpty3Depth) {
								tx.push('<ul class="dep1_list">');
								d2.menu.forEach(function(d3, index) {
									var isEmpty4Depth  = _.isEmpty(d3.menu);

									tx.push('<li class="dep1_item"><a href="javascript:;" class="dep1_link ' + (d3.urlTcd == '02' ? 'outlink' : '') + '" ' + getOnclickHtml(d3) + '><span class="m-name">' + d3.title + '</span></a>');
									if(!isEmpty4Depth) {
										tDepthVl.push(d3); 				// CSR : C2022071474081 4->3depth 작업
										d3.menu.forEach(function(d4, index) {
											fDepthVl.push(d4); 				// CSR : C2022071474081 4->3depth 작업
										});
									}
									tx = setDepthData(d3, tx);
									tx.push('</li>');
								});
								tx.push('</ul>');
							}
							tx.push('</div>');
						});
					}
					tx.push('</div></div>');
					tx.push('<div class="gnb-swiper-nav">');

					var beforeIdx = 0;
					var afterIdx = 0;
					if(index == 0) {
						afterIdx = index+1;
					} else if(0 < index < $menu.list.length) {
						beforeIdx = index-1;
						afterIdx = index+1;
					} else if(index == $menu.list.length-1){
						beforeIdx = index-1;
					}

					if(index != 0) {
						var beforeD1Title = $menu.list[beforeIdx].title;
						tx.push('<button class="gnb-swiper-nav-prev" role="button" onclick="$(\'#header .gnb_wrap .nav_area .menu'+ beforeIdx +' > a\').focus();">');
						tx.push('<span class="text">'+ beforeD1Title +'</span>');
						tx.push('</button>');
					}

					if(index != $menu.list.length-1) {
						var afterD1Title = $menu.list[afterIdx].title;
						tx.push('<button class="gnb-swiper-nav-next" role="button" onclick="$(\'#header .gnb_wrap .nav_area .menu'+ afterIdx +' > a\').focus();">');
						tx.push('<span class="text">'+ afterD1Title +'</span>');
						tx.push('</button>');
					}

					tx.push('</div>');
					tx.push('</div></li>');
				}


			});
			$('#gnbUl').html(tx.join(''));

			//20220923 IOS 16ver에서 최근이용메뉴가 작동하지 않아 주석처리
//			if(navigator.userAgent.toLowerCase().indexOf('mobile') < 0 && deviceInfo.app !='shcardapp') {
//				var txTmpHtml = "";
//				var menuSetIsLogin = $menu.login;
//				if(menuSetIsLogin) {
//					$svc.get('http').submit('/mob/cmm/COMMONLATELYSN/getLatelySearchList.ajax', "").then(function(rs) {
//						if(rs.latelySearchList.length > 0) {
//							$("#gnbFavSwiper1").show();
//							for(var i=0; i<rs.latelySearchList.length; i++){
//								var data = rs.latelySearchList[i];
//								txTmpHtml += '<li class="swiper-slide">';
//								txTmpHtml += '<a class="btn-word" href="#none" onclick="goMenuLink(\''+data.mobWbSceUrlAr+'\', \''+data.mobWbSceUrlTcd+'\', \''+data.mobWbMnuId+'\')" role="button">'+rs.latelySearchList[i].mobWbMnuSceNm+'</a>';
//								txTmpHtml += '</li>';
//							}
//							$("#gnbFavSwiper1Ui").html(txTmpHtml);
//							fnGnbFavSwiper1();
//						} else {
//							$("#gnbFavSwiper1NoData").show();
//						}
//
//					}, function(error) {
//						$log('loading error', error);
//					});
//				} else {
//					$("#gnbFavSwiper1NoLogin").show();
//				}
//			}
		}

		function filterMenuData(data){
			var r = data.filter(function(o){
				if(o.menu) o.menu = filterMenuData(o.menu);
				return menuPersonCheck(o);
			})
			return r;
		}

		function menuPersonCheck(menuObj){
			var isViewMenu = true;
			var xpoCusTcd = $menu.xpoCusTcd;
			var xpoCreChkCcd = $menu.xpoCreChkCcd;
			//if(!xpoCusTcd.includes(menuObj.memCd)){	Array.includes 가 IE지원안함
			if(xpoCusTcd.indexOf(menuObj.memCd) == -1){
				isViewMenu = false;
				return isViewMenu;
			}

			//if(!xpoCreChkCcd.includes(menuObj.crdCd)){	//Array.includes 가 IE지원안함
			if(xpoCreChkCcd.indexOf(menuObj.crdCd) == -1){
				isViewMenu = false;
				return isViewMenu;
			}

			return isViewMenu;
		}

		// C2022062059923 신한플레이/홈페이지 검색창 UI 변경 (자주 찾는 검색어)
		// 추천 검색어 (/api/seargest/recommend-keyword)
		function chkFreqSrch() {
			var data = 'freqSrch';
			var today = new Date();
			var visibleFreqList = [];

			if(localStorage.getItem(data) != null) {
				var lsKeyword = JSON.parse(localStorage.getItem(data));

				if(today.getTime() > lsKeyword[lsKeyword.length-1].expiresAt) {
					localStorage.removeItem(data);
				}
			}

			// localStroage에 자주찾는 검색어가 저장 되어 있는 경우
			if(localStorage.getItem(data) != null) {
				var lsItem = JSON.parse(localStorage.getItem(data));

				lsItem.forEach(function(dt, index) {
					if(dt.expiresAt) {
						return;
					}
					visibleFreqList.push(dt);
				})

				srchLog.freqItems = visibleFreqList || [];
				vo.push({
				    srch: {
				        freqItems: srchLog.freqItems
				    }
				});

			} else {
				// localStroage 에 자주찾는 검색어가 저장 되어 없는 경우
				http.json('/mob/MOBFM004N/MOBFM004R13.ajax', { label: 'service' }, {cache: {minutes_to_expiration: 10}, loadingbarState : 'not', skipAlert : true}).then(function (dt) {
					if (!dt.recommendMenuSearch || _.isEmpty(dt.recommendMenuSearch)) return;

					if (!dt && !dt.recommendMenuSearch) {
						return $svc.get('popup').alert('추천 검색어가 없습니다.');
					}

					var resFreqList = dt.recommendMenuSearch.keywords || [];

					for(var i=0; i<resFreqList.length; i++){
						var resFreqMenu = resFreqList[i];
						if(i<7) {
							visibleFreqList.push(resFreqMenu);
						} else {
							break;
						}
					}

					srchLog.freqItems = visibleFreqList || [];
					vo.push({
					    srch: {
					        freqItems: srchLog.freqItems
					    }
					});

					var expire_date = new Date(today.getTime() + 600000); // 만료기간 10분
					visibleFreqList.push({"expiresAt":expire_date.getTime()});
					localStorage.setItem(data, JSON.stringify(visibleFreqList));

				});
			}
		}

		// 추천 컨텐츠 (/api/seargest/recommend-content)
		function chkRecommendSrch() {
			var data = 'recommendSrch';
			var today = new Date();
			var visibleRecommendList = [];

			if(localStorage.getItem(data) != null) {
				var lsKeyword = JSON.parse(localStorage.getItem(data));

				if(today.getTime() > lsKeyword[lsKeyword.length-1].expiresAt) {
					localStorage.removeItem(data);
				}
			}

			if(localStorage.getItem(data) != null) {
				var lsItem = JSON.parse(localStorage.getItem(data));

				lsItem.forEach(function(dt, index) {
					if(dt.expiresAt) {
						return;
					}
					visibleRecommendList.push(dt);
				})

				srchLog.recommendItems = visibleRecommendList || [];
				vo.push({
				    srch: {
				        recommendItems: srchLog.recommendItems
				    }
				});

			} else {
				$svc.get('http').submit('/mob/MOBFM004N/MOBFM004R26.ajax', "", 'not').then(function(dt) {
					if (!dt.topPopResult || _.isEmpty(dt.topPopResult)) return;

					if (!dt && !dt.topPopResult) {
						return $svc.get('popup').alert('추천 컨텐츠가 없습니다');
					}

					var visibleRecommendList = dt.topPopResult.contents	 || [];

					srchLog.recommendItems = visibleRecommendList || [];
					vo.push({
					    srch: {
					        recommendItems: srchLog.recommendItems
					    }
					});

					var expire_date = new Date(today.getTime() + 600000); // 만료기간 10분
					visibleRecommendList.push({"expiresAt":expire_date.getTime()});
					localStorage.setItem(data, JSON.stringify(visibleRecommendList));

				}, function(error) {
					$log('loading error', error);
				});
			}
		}

		global.goMenuLink = function (url, linkType, menuId) {
			// 전체메뉴 쿠키 저장
			var fmsi = $('#fullMenuTabCont_1').hasClass('current') ? '0' : '1';
			$svc.get('util').setCookie('fmsi', fmsi, {expireDay:365});

			if(!url) return false;

			switch(linkType) {
			case '02':
				linkType02(); break;
			case '03':
				linkType03(); break;
			default:
				linkTypeDefault();
			}

			return false;

			//
			// == 내부함수: global.goMenuLink ==
			function linkType02() {
				// 라이프 하위메뉴 화면이동처리를 위한 예외처리
				if (url.indexOf('MOBFM384R02.html') > 0 && deviceInfo.app) {
					$svc.get('location').href(url);
				} else {
					var myCarPath = composeMyCarPath(url);
					// 새창 열림- 마이카는 로그인처리 병행
					myCarPath ? fnLoadMyCar(myCarPath) : openAppUrl(url);
				}
			}
			function composeMyCarPath(url) {
				if(/mycar\.shinhancard\.com/.test(url)) {
					return url.replace(/^(:?.*)mycar\.shinhancard\.com/, '');
				} else return '';
			}
			function linkType03() {
				// 스크립트 코드 실행
				eval(url);
			}
			function linkTypeDefault() {
				// 라이프 하위메뉴 화면이동처리를 위한 예외처리
				if (url.indexOf('MOBFM384R02.html') > 0) {
					$svc.get('location').href(url);
				} else {
					// 현재창 열림
					var urlArry = url.split('?');
					var link = urlArry[0];

					var form = $('<form>').attr({action:link, method:'GET'});
					form.append($('<input>').attr({
						type: 'hidden',
						name: 'crustMenuId',
						value: menuId
					}));

					if (urlArry.length > 1) {
						urlArry[1].replace(/([^=&]+)=([^&]*)/gi, function(m, key, value) {
							form.append($('<input>').attr({
								type: 'hidden',
								name: key,
								value: value
							}));
						});
					}

					$('body').append(form);
					form.submit();
					form.remove();
				}
			}
		} // global.goMenuLink

		// 배너 새창/외부링크 처리
		global.goEventLink = function (url, linkType) {
			if (!url) {
				return false;
			}

			if (linkType == '1'){
				$svc.get('location').href(url);
			} else {
				// 새창 열림
				openAppUrl(url);
			}
		}

		global.todayEventClose = function () {
			var opt = {
				expireDate:util.addDays(util.formatDate(new Date(), 'yyyyMMdd'), 1)
			};
			if($('#todayCloseBnr').is(':checked')){
				util.setHpgLocalStorage('todayEventClose', 'Y', opt);
			} else {
				util.setHpgLocalStorage('todayEventClose', 'N', opt);
			}

		}

		var ark = {
			value: '',
			items: []
		};
		function changeSearch(e) {
//			if(e.target.value.length > 0) {
//				$('.btn_delete_sch').show()
//		 	} else {
//		 		$('.btn_delete_sch').hide();
//		 	}

			ark.value = e.target.value.trim();
			if (ark.value == '') {
				 vo.push({
				 	srch: {
				 		lstKind: 'late',
				 		lateItems: (!srch.autoLate && srch.lateItems) || []
				 	}
				 });
				return;
			}


			http.json('/mob/MOBFM004N/MOBFM004R10.ajax', { query: encodeURIComponent(ark.value) }, 'not').then(function (rsHttp) {
				//if (!rsHttp || rsHttp.responsestatus != 0) return;
				if (!rsHttp.autoCompleteSearch || _.isEmpty(rsHttp.autoCompleteSearch)) return;

				var maxBadgeCount = rsHttp.autoCompleteSearch.maxBadgeCount;
				var autoSearchArr = [];
				_.each(rsHttp.autoCompleteSearch.keywordResponse || [], function(r) {
						r.onlyKeyword = r.keyword;
						r.keyword = r.highlight;
						r.keyword = r.keyword.split('¶PS¶').join('<em class="srch_keyword">');
						r.keyword = r.keyword.split('¶PE¶').join('</em>');
						if (r.badgeYn === 'Y' && maxBadgeCount > 0) {
							r.badgeTag = '<span class="icon-text-a5">추천</span>'
							maxBadgeCount--;
						} else {
							r.badgeTag = '<span class="icon-text-a5" style="display:none;">추천</span>'
						}

						autoSearchArr.push(r);
				});

				ark.items = autoSearchArr || [];

				srchLog.srchKeyword = ark.value;
				srchLog.arkItems = srch.autoArk ? [] : ark.items;

				vo.push({
				 	srch: {
				 		lstKind: 'ark',
						 arkItems: srchLog.arkItems
				 	}
				});
			});

			// 자동완성 배너
			http.json('/mob/MOBFM004N/MOBFM004R28.ajax', { queryText: encodeURIComponent(ark.value) }, 'not').then(function (rsHttp) {
				//if (!rsHttp || rsHttp.responsestatus != 0) return;
				if (!rsHttp.autoBannerResult || _.isEmpty(rsHttp.autoBannerResult)) return;

	            _.each(rsHttp.autoBannerResult.bannerResponse, function(r) {
	                 if (r.highlight != null) {
	                     r.highlight = r.highlight.split('¶PS¶').join('<em class="srch_keyword">');
	                     r.highlight = r.highlight.split('¶PE¶').join('</em>');
	                 }

	            });

	            srchLog.srchKeyword = ark.value;
	            srchLog.autoBanner = srch.autoBanner ? [] : rsHttp.autoBannerResult.bannerResponse;

				vo.push({
				 	srch: {
				 		autoBanner : srchLog.autoBanner
				 	}
				});
			});
		}

		 function showLate() {

			srch = util.fromJson(localStorage.getItem('srch')) || {};
			srch.lateItems = srch.lateItems || [];

		 	vo.push({
		 		srch: {
		 			lstKind: 'late',
		 			autoArk: srch.autoArk ? '자동완성 켜기' : '자동완성 끄기',
		 			autoLate: srch.autoLate ? '자동 저장 켜기' : '자동 저장 끄기',
		 			lateText: srch.autoLate ? '<p style="padding:10px;"><b>최근 검색어 저장이 꺼져 있습니다.</b><br/>검색어 저장을 원하신다면, 자동저장 기능을 켜주십시오</p>' : '<strong class="tit_list">최근 검색어</strong>',
					lateItems: (!srch.autoLate && srch.lateItems) || [],
					lstKindYn: srch.lstKindYn,
					autoArkYn: srch.autoArkYn
		 		}
		 	});

		 	// C2024020776541-4 24년 장애인차별금지법 웹접근성 품질인증 심사대응 #1 - Mo0-9-2
		 	// 최근검색어가 없을때 이전, 다음 슬라이드 버튼이 숨어있는 상태 - 초점이 버튼에 이동하지 않도록 수정
		 	if(srch.lateItems.length > 0){
		 		$('.autoComplete_swiper').css('display','block');
		 	}else{
		 		$('.autoComplete_swiper').css('display','none');
		 	}

		 	//$('.js_autoComplete').val('');
		 	$('#totalSrchQuck').addClass('active');
		 	$('.srch_input_wrap .label_srch').hide();
			$('.srch_input_wrap .srch_ico').show();
			$('.srch_input_wrap input').css('padding-left',10);
		 }

		global.callMenu = function (retry) {
			/*
			http.cms('search_placeHolder.js').then(function (dt) {
				lc.keyword = dt.keyword[0] || '';
			});*/

			// 접속 device별 메뉴정보 JSON경로(menuPMW:모웹, menuPPW:PC웹, menuPMA:APP)
			var menuJsonPath = '';
			if (!retry) {
				menuJsonPath = '/logic/json/menuPMW.json';
				if(deviceInfo.app){
					menuJsonPath = '/logic/json/menuPMA.json';
				} else {
					if (deviceInfo.mobile) {
						menuJsonPath = '/logic/json/menuPMW.json';
					} else {
						menuJsonPath = '/logic/json/menuPPW.json';
					}
				}
			}
			else {
				menuJsonPath = '/pconts/json/menuPMW.json';
				if(deviceInfo.app){
					menuJsonPath = '/pconts/json/menuPMA.json';
				} else {
					if (deviceInfo.mobile) {
						menuJsonPath = '/pconts/json/menuPMW.json';
					} else {
						menuJsonPath = '/pconts/json/menuPPW.json';
					}
				}
			}

			// 캐시 메뉴정보 요청
			var dfdMenu = http.html(menuJsonPath, {cache: {minutes_to_expiration: 10}}).then(function (dt) {
				if (!dt || !dt.root || !dt.root.menu) {
					if (!retry) {
						setTimeout(function(){ global.callMenu(true); }, 50);
						return;
					}
					$menu.list = [];
					$menu.sub = {
						d1: -1,
						d2: -1,
						d3: -1,
						d4: -1,
						data: {}
					};
					return $svc.get('popup').alert('메뉴 데이터가 없습니다.');
				}
				$menu.list = _.clone(dt.root.menu);
				$menu.sub = {
					d1: -1,
					d2: -1,
					d3: -1,
					d4: -1,
					data: {}
				};

				/* if(global.menuCompleteAfter) {
					global.menuCompleteAfter();
				}*/
			}, function () {
				if (!retry) {
					setTimeout(function(){ global.callMenu(true); }, 50);
					return;
				}
				if(lc.isMain == 'N') {
					$svc.get('cmmHeader').setTitle($($('[data-bind-include=cmmHeader]')[0]).data('headTitle'));
					$log('메뉴 수신 오류.');
				}
			});

			// event
			var dfdEvent = http.html('/logic/json/eventBanner.json')
			.then(function (dt) {
				if (!dt && !dt.root && !dt.root.evtBnn) {
					return $svc.get('popup').alert('이벤트 데이터가 없습니다.');
				}

				// 메인 이벤트 데이터
				$menu.events = makeMainEventData();
				// 토스트 베너 이벤트 데이터
				$menu.toastBnn = makeToastEventData();

				//
				// == 내부 함수 ==
				function makeMainEventData() {
					var bannerArea = {
							'01' : '메인 핫배너',
							'02' : '전체메뉴 핫배너',
							'03' : '서브메인 탑배너',
							'05' : '상세화면 컨텐츠배너'
					};
					var bannerSubArea = {
							'01' : '마이',
							'02' : '혜택',
							'03' : '금융',
							'04' : '카드',
							'05' : '편의',
							'06' : '라이프',
							'07' : '디지털',
							'08' : 'TopsClub',
							'09' : '고객센터'
					};

					// events를 swiper에서 사용 가능하도록 변환
					var result = {};

					var events = dt.root.evtBnn;
					for(var i=0;i<events.length;i++) {
						var event = events[i];
						var xpoTrmFcd = event.hpgBnnXpoTrmFcd || '02'	// 노출구분코드(01:기간형, 02:상시형, 03:crm)
						if(xpoTrmFcd == '01'){
							if(util.getDiffDay(util.formatDate(new Date(), 'yyyyMMdd'), event.hpgBnnBulEdd) < 0){
								continue;
							}
							if(util.getDiffDay(event.hpgBnnBulStd, util.formatDate(new Date(), 'yyyyMMdd')) < 0){
								continue;
							}
						}

						var bannerDetailArr = event.EHPGA0065 || [];
						for(var j=0;j<bannerDetailArr.length;j++) {
							var bannerChild = event.EHPGA0065[j];

							var bannerAreaCd = bannerChild.hpgBnnXpoTrrCd;
							var bannerSubAreaCd = util.trim(bannerChild.hpgBnnXpoBneCd);
							var bannerUrl = util.trim(bannerChild.hpgBnnXpoSceUrlAr);

							var bannerAreaName = bannerArea[bannerAreaCd] || '';
							var bannerSubAreaName = bannerSubArea[bannerSubAreaCd] || '';

							var subMainArr = [];
							if(bannerAreaCd == '03'){
								subMainArr.push(bannerSubAreaName);
							}

							var financeUrlArr = [];
							if(bannerAreaCd == '05' && bannerSubAreaCd == '03'){
								bannerAreaName = '금융상세';
								financeUrlArr.push(bannerUrl);
							}

							var cardUrlArr = [];
							if(bannerAreaCd == '05' && bannerSubAreaCd == '04'){
								bannerAreaName = '카드상세';
								cardUrlArr.push(bannerUrl);
							}

							result[bannerAreaName] = result[bannerAreaName] || [];
							result[bannerAreaName].push({
								title: util.trim(event.hpgBnnTilNm || ''),
								text: util.trim(event.hpgBnnSmrTt || ''),
								link: util.trim(event.hpgBnnMovUrlAr || 'javascript:;'),
								linkType: util.trim(event.hpgBnnTarSmmCcd || ''),
								image: util.trim(event.hpgBnnImgPhNm || ''),
								alt: util.trim(event.hpgBnnImgRplChaVl || ''),
								bgColor: util.trim(event.hpgBnnBgrOloVl || '#fffffff'),
								btnText: util.trim(event.hpgBnnBtnDescTt || ''),
								btnUrl: util.trim(event.hpgBnnBtnUrlAr || ''),
								eventType : util.trim(event.hpgBnnTcd || ''),
								crmPrmtId : util.trim(event.hpgBnnWbMoId || ''),
								eventRank : util.trim(bannerChild.hpgBnnXpoPryRk || ''),
								// 노출처리
								subType: subMainArr || [],
								cardShowUrls: cardUrlArr || [],
								financeShowUrls: financeUrlArr || []
							});
						}
					}

					return result;
				}

				function makeToastEventData() {
					if(!dt.root.ptLeCont) return;

					var targets = {};	// 노출 타겟 아이디
					var datas = {};		// 베너 데이터

					var bnnDatas = [];
					// 배너 노출 타겟 아디디 세팅
					_.each(dt.root.ptLeCont, function(vl) {
						if(!vl || !vl.hpgBnnXpoMobWbSceId) return;

						// 베너 스크린 아이디
						var listAsc = _.sortBy(vl.EHPGA0072, function(vl) { return vl.hpgBnnXpoPryRk });
						var bnnIds = _.map(listAsc, function(vl) { return vl.hpgBnnId });
						bnnDatas = _.union(bnnDatas, bnnIds);
						targets[vl.hpgBnnXpoMobWbSceId] = bnnIds;
					});

					// 배너 데이터 세팅
					_.each(bnnDatas, function(id) {
						datas[id] = _.find(dt.root.evtBnn, function(vl) {
							return id == vl.hpgBnnId;
						});
					});

					return {
						targets: targets,
						datas: datas
					}
				}
			}, function () {
				$menu.events = {};
				$log('이벤트 수신 오류.');
			});

			$.when(dfdMenu, dfdEvent).done(function() {
				$(document).trigger('menu-ready');
				$svc._menuReady = true;

				// 토스트 배너 팝업 스크립트 로드
				$svc.get('util').loadJS(['/logic/js/mob/cmm/popup/toastBanner.js']);
			}).then(function() {
			});
		};

	});

	$svc.menuReady = function(callback) {
		if($svc._menuReady) {
			callback();
		} else {
			$(document).on('menu-ready', callback);
		}
	}

	var cbm = {};
	$svc.service('cmmHeader', function ($param) {
		var SUBMAIN_TYPES = {
			"마이": '/mob/MOBFM006N/MOBFM006R01.shc',
			"혜택": '/pconts/html/benefit/main/main.html',
			"금융": '/pconts/html/finance/main/main.html',
			"카드": '/pconts/html/card/main/main.html',
			"편의": '/pconts/html/life/main/main.html',
			"라이프": '/pconts/html/lifeService/main/main.html',
			"디지털": '/pconts/html/mobile/main/main.html',
			"TopsClub": '/pconts/html/topsClub/main/main.html',
			"고객센터": '/mob/MOBFM12101N/MOBFM12101R01.shc',
			"전용회원": '/pconts/html/familyMember/MOBFW11001.html'
		};
		var SUBMAIN_TYPES_AddParam = {
			"마이": 'Smn_Top_My',
			"혜택": 'Smn_Top_Bnft',
			"금융": 'Smn_Top_Fin',
			"카드": 'Smn_Top_Card',
			"편의": 'Smn_Top_Conv',
			"라이프": 'Smn_Top_Life',
			"디지털": 'Smn_Top_Digt',
			"TopsClub": 'Smn_Top_Tops',
			"고객센터": 'Smn_Top_Cntr',
			"전용회원": 'Smn_Top_OnlyMem'
		};

		function setTitle(t) {
			var $title = $('#header .mobile_title_wrap .mobile_title, .contents_heading h3');
			if($title.length > 0) {
				if(!t) {
					t = $('body').data('headerTitle') || '';
				}
				$title.text(t);
			}

			$('body').data('headerTitle', t);
		}
		function getTitle() {
			var $title = $('#header .mobile_title_wrap .mobile_title, .contents_heading h3 :eq(0)');

			if($title.length > 0) {
				return $title.text() || '';
			}else {
				return $($('[data-bind-include=cmmHeader]')[0]).data('headTitle') || '';
			}
		}

		/**
		 * 토스트 베너 팝업을 띄웁니다.
		 */
		function toastBanner(menuId, target) {
			if(!$menu.toastBnn || !$menu.toastBnn.targets) return;
			if(!$menu.toastBnn.targets[menuId]) return;

			$svc.get('popup')
			.open({
				name: 'toastBanner',
				param: { menuId: menuId }
			})
			.then(function() {
				target && $(target).focus();
			});
		}

		return {
			setTitle: setTitle,
			getTitle: getTitle,
			toastBanner: toastBanner,
			getMenu: function () {
				return $menu
			},
			isLogin: function (d) {
				return $svc.get('http').json('/mob/cmm/COMMON/isLogin.ajax', {}, !d && 'not')
			},
			showMenu: function (k) {
				cbm[k] && cbm[k]()
			},
			targetLink: function (link) {
				if (!link) {
					link = location.href.replace(location.origin, '');
					if (link.indexOf('#') > 0) {
						link = link.substr(0, link.indexOf('#'));
					}
				}

				var curentMenuId = $svc.get('util').getParameter('crustMenuId');

				var gnblist= [];
				function recursiveSearchMenu(menuList, depth) {
					var foundDepth =  false;
					$.each(menuList, function (index, obj) {
						var foundMenu = false;

						if (curentMenuId){
							if (curentMenuId == obj.id) {
								foundMenu = true;
							}
						}else if (obj.link) {
							// menu에 해당 link(url)이 있는 지 확인
							if (obj.link.indexOf('?') > 0) {
								if (obj.link.replace(/ /g, '') == link) {
									foundMenu = true;
								}
							} else {
								if (obj.link.replace(/ /g, '') == link.split('?')[0]) {
									foundMenu = true;
								}
							}
						}

						// 찾았으면 정보 저장;
						if (foundMenu) {
							$menu.sub['d' + depth] = index;
							$menu.sub.data = obj;
							foundDepth = true;

						}

						// 하위 메뉴가 있는 지 확인
						if (obj.menu && !_.isEmpty(obj.menu)) {
							if (recursiveSearchMenu(obj.menu, depth + 1)) {
								$menu.sub['d' + depth] = index;
								foundDepth = true;
							}
						}

						//gnb 데이터 생성
						if (depth == 1) {
							gnblist.push({
								title: obj.title,
								current: ''
							});
						}
					});


					return foundDepth;
				}

				recursiveSearchMenu($menu.list, 1);

				if(curentMenuId && $menu.login) {
					// 메뉴이력정보 저장
					$svc.get('http').submit('/mob/cmm/MOBMNUCNCHIS/insMnuCncHisData.ajax', {"mobWbMnuId" : curentMenuId},'not').then(function(rsHttp){
					});
				}


				if ($menu.sub.d1 > -1 ) {
					gnblist[$menu.sub.d1].current = 'current';
				}

				return gnblist;
			},
			mainTab: function () {
				var prm = {};
				if ($('#header').hasClass('main')) {
					_.each(location.search.replace('?', '').split('&'), function (v) {
						var p = v.split('=');
						prm[p[0]] = p[1];
					});
					setTimeout(function () {
						if (prm.t) {
							$("ul.list_nav li").eq(prm.t).find('a').eq(0).trigger('click');
						}
					}, 100);
				}
			},
			showMainEvent: function () {
				if(!$menu.events || !$menu.events["메인 핫배너"]){
					return;
				}

				var tplEventMain = _.template($('#tplEventMain').html());

				var mainHotEvents = $menu.events["메인 핫배너"];
				mainHotEvents.sort(function(a, b){
					return a.eventRank - b.eventRank;
				});

				_.each(mainHotEvents || [], function(r) {
					r.link = $svc.get('util').mergeUriQueryParam(r.link, 'logbanner', 'Main_Hot');
				});

				$('.event_mainVisual').html(tplEventMain({
					events: mainHotEvents
				}));

				var html = '';
				for(var i=0;i<mainHotEvents.length;i++) {
					html += '<div class="headerBg bg_' + (i+1) + '" data-name="mainBgArea' + (i+1) + '" aria-hidden="true"></div>';
				}
				$('.headerBg_wrap').html(html);

				global.ui.eventBanner.mainVisual();
			},
			showSubMainEvent: function () {
				if(!$menu.events || !$menu.events["서브메인 탑배너"]){
					return;
				}

				if($svc.get('util').getHpgLocalStorage('todayEventClose') == 'Y'){
					return;
				}

				var tplEventSubTop = _.template($('#tplEventSubTop').html());
				var subMainInfos = $menu.events["서브메인 탑배너"] || [];
				var resultSubMainEvents = [];
				for(var i=0;i<subMainInfos.length;i++) {
					var subTypes = subMainInfos[i].subType;
					for(var j=0;j<subTypes.length;j++) {
						if(location.pathname.indexOf(SUBMAIN_TYPES[subTypes[j]]) > -1) {
							// 서브메인 탑배너별로 logbanner 파라메터 add
							subMainInfos[i].link = $svc.get('util').mergeUriQueryParam(subMainInfos[i].link, 'logbanner', SUBMAIN_TYPES_AddParam[subTypes[j]]);

							if(subMainInfos[i].eventType == '02'){
								if($menu.login){
									var ecareCrmPrmtId = $menu.ecareCrmPrmtId || '';
									var crmPrmtId = subMainInfos[i].crmPrmtId;
									if(ecareCrmPrmtId.indexOf(crmPrmtId) == -1){
										break;
									}
								} else {
									break;
								}
							}

							// 노출 결정
							resultSubMainEvents.push(subMainInfos[i]);
							break;
						}
					}
				}

				if(resultSubMainEvents.length > 0) {
					resultSubMainEvents.sort(function(a, b){
						return a.eventRank - b.eventRank;
					});

					$('.event_subTop').html(tplEventSubTop({
						events: resultSubMainEvents
					}));
					global.ui.eventBanner.subTop();
				} else {
					$('.event_subTop').hide();
				}

			},
			showEvent: function() {
				if(!$menu.events){
					return;
				}
				// 금융상세 (financeDetails 필터적용)
				// 카드상세 (cardShowUrls 필터적용)
				var tplEventDetailForCard = _.template($('#tplEventDetailForCard').html());
				var tplEventDetailForCardAndFinance = _.template($('#tplEventDetailForCardAndFinance').html());

				//var detailInfos = $menu.events["카드상세"];
				var detailInfos = $menu.events["카드상세"] || [];
				var resultCardDetailEvents = [];
				for(var i=0;i<detailInfos.length;i++) {
					var cardShowUrls = detailInfos[i].cardShowUrls;
					for(var j=0;j<cardShowUrls.length;j++) {
						if(location.pathname.indexOf(cardShowUrls[j]) > -1) {
							// logbanner 파라메터 add
							detailInfos[i].link = $svc.get('util').mergeUriQueryParam(detailInfos[i].link, 'logbanner', 'Cont_Card');
							// 노출 결정
							resultCardDetailEvents.push(detailInfos[i]);
							break;
						}
					}
				}
				if(resultCardDetailEvents.length > 0) {
					$('.event_subBanner').show();
					resultCardDetailEvents.sort(function(a, b){
						return a.eventRank - b.eventRank;
					});

					$('.event_subBanner').html(tplEventDetailForCard({
						events: resultCardDetailEvents
					}));
					global.ui.eventBanner.subBanner();
					return;
				}

				detailInfos = $menu.events["금융상세"] || [];
				var resultFinanceDetailEvents = [];
				for(var i=0;i<detailInfos.length;i++) {
					var financeShowUrls = detailInfos[i].financeShowUrls;
					for(var j=0;j<financeShowUrls.length;j++) {
						if(location.pathname.indexOf(financeShowUrls[j]) > -1) {
							// logbanner 파라메터 add
							detailInfos[i].link = $svc.get('util').mergeUriQueryParam(detailInfos[i].link, 'logbanner', 'Cont_Fin');
							// 노출 결정
							resultFinanceDetailEvents.push(detailInfos[i]);
							break;
						}
					}
				}

				if(resultFinanceDetailEvents.length > 0) {
					$('.event_subBanner').show();
					resultFinanceDetailEvents.sort(function(a, b){
						return a.eventRank - b.eventRank;
					});

					$('.event_subBanner').html(tplEventDetailForCardAndFinance({
						events: resultFinanceDetailEvents
					}));
					global.ui.eventBanner.subBanner();
				} else {
					$('.event_subBanner').hide();
				}
			}
		}
	});

	$svc.plugin('cmmFooter', function ($param, $close) {
		$svc.debug(location.hash == '#debug');
		if (deviceInfo.local) {
			_.each($('img'), function (v) {
				var src = $(v).attr('src');
				if (src) {
					if(_.contains(['pconts', '_ICSFiles'], src.split('/')[1] || '')) {
						$(v).attr('src', 'https://devprj2-www.shinhancard.com' + src);
					}
				}
			});
			$svc.debug(true);
		}

		if ({ shfanapp: true, shcardapp: true, sharedplatform: true, ssgpay: true, shcouponapp: true, 'spay/pay_billpayment_webview': true }[deviceInfo.app]) {
			return $('[data-bind-include=cmmFooter]').hide();
		}

		var vo = $svc.bind({ name: 'cmmFooter', url: '/pconts/html/common/default-footer-2020.html', plugin: true });
		var e = vo.event();

		vo.render(function() {
			shcAppFooterRender();
		});
	});

	//emnet 로그
	$svc.service('tracking', function () {
		function emnet(l) {
			$log('이엠넷 로그', l);
			try {
				if (!_.contains(['local', 'dev'], deviceInfo.mode)) {
					_trs_v_conv(l.CDN, l.CDE);
				}
			}
			catch (e) { $log('이엠넷로그 로드 실패') }
		}
		function wl6Logging() {
			$log('와이즈로그 화면진입');
			$wlog.load = true;
			//	_n_uid_cookie='mbw_wlog';
			_n_uid_cookie = { shcardapp: 'mbw_wlog', shfanapp: 'wiselog_id' }[deviceInfo.app] || 'mbw_wlog';	//FAN에서 부여한 쿠키값 수정
			_n_c_field1 = { shcardapp: '', shfanapp: 'sno' }[deviceInfo.app] || '';		// 앱카드장비어플리케이션고유값 추가

			// C2018090798242  New플랫폼 내 모바일홈페이지 호출 시 와이즈로그 분리 적재 요청의 件
			// pemver : New플랫폼(newplatform) -> pemver로 변경 요청 건
			var agent = navigator.userAgent;
			var pemver = agent.indexOf('pemver');
			var newp = agent.indexOf('newp');

			if (deviceInfo.mobile) {
				var appSid = {};

				if (pemver > -1) {
					appSid = { shcardapp: 'app_shcard', shfanapp: 'shp_shcard' };
				} else if (newp > -1){
					appSid = { shcardapp: 'app_shcard', shfanapp: 'np_shcard' };
				} else {
					appSid = { shcardapp: 'app_shcard', shfanapp: 'fa_shcard' };
				}

				_n_sid = appSid[deviceInfo.app] || 'mow_shcard';

			}else {
				_n_sid = 'pcw_shcard';
			}

			$log('_n_sid : ', _n_sid);
			$log('_n_uid_cookie : ', _n_uid_cookie);
			$log('_n_c_field1 : ', _n_c_field1);
			try {
				if (_.contains(['local', 'dev'], deviceInfo.mode)) {
					$log('와이즈 로그[n_logging]')
				} else {
					n_logging()
				}
			} catch (e) { $log('와이즈로그 로드 실패') }
		}
		return {
			load: function () {
				if (!_.isEmpty($emnet)) {
					$svc.get('util').loadJS(['/logic/js/lib/trs_esc_shcd_m.js'], function () {
						$log('이엠넷로그 화면진입');
						$emnet.load = true;
						emnet($emnet.now);
					});
				}

				if (!$wlog.direct) {
					$svc.get('util').loadJS(['/logic/js/lib/wl6.js'], function () {
						wl6Logging();
					});
				}
			},
			wLog: function (n) {
				if (!$wlog.load) return;
				$log('와이즈로그 [n_click_logging]', location.href + (location.search.length > 0 ? '&' : '?') + 'vid=' + (n.name || '') + (n.wlog ? ('&' + _.map(n.wlog, function (v, k) { return v = k + '=' + v }).join('&')) : ''));
				if (!_.contains(['local', 'dev'], deviceInfo.mode)) {
					$svc.get('util').loadJS(['/logic/js/lib/wl6.js'], function () {
						n_click_logging(location.href + (location.search.length > 0 ? '&' : '?') + 'vid=' + (n.name || '') + (n.wlog ? ('&' + _.map(n.wlog, function (v, k) { return v = k + '=' + v }).join('&')) : ''));
					});
				}
			},
			wLogDirect: function (after) {
				if (after) {
					after();
				}
				wl6Logging();
			},
			emnetLog: function (l) {
				if ($emnet.load) {
					emnet(l)
				} else {
					$emnet.now = l;
				}
			}
		};
	});

	$svc.popup('cmmLogOut', function($param, $close){

		var vo = $svc.bind({ name: 'cmmLogOut', url: '/mob/cmm/COMMON/cmmLogOut.ahtml' });
		var on = vo.event();

		$param.callAutoLogOut = function(){
			// 로그아웃 처리
			$svc.get('http').json('/mob/cmm/MOBFMLOGIN/CMMServiceMemLoginC.ajax', {
				mode: 'logOut',
				channel: 'person'
			}).then(function (rsHttp) {
				if (deviceInfo.app == 'shcardapp') send('shpa_setLogout',{},function(data){});
				vo.push({
					complete: 'Y'
				});
			});
		}

		vo.render(function () {
			var v = {
				time: $param.time,
				complete: 'N'
			}
			vo.push(v);
		});
		on.yes = function () {
			$close(true);
		}
		on.no = function () {
			$close(false);
		}
		on.confirm = function() {
			$svc.get('location').goHome();
		}
	})

	global.onload = function () {
		if ({ ipod: true, iphone: true, ipad: true }[deviceInfo.os] && { shfanapp: true, shcouponapp: true }[deviceInfo.app] && agent.indexOf('shpay') == -1) {
			setTimeout(function () {
				$('body').addClass('app_shfan');
				$('[data-bind-include=cmmHeader]').hide();
				$('[data-bind-include=cmmFooter]').hide();
				if ({ shfanapp: true }[deviceInfo.app]) {
					send('shpa_topTitleChg', { titleNm: $('title').text() })
				}
			}, 300);
		}

		if ({ ssgpay: true }[deviceInfo.app]) {
			setTimeout(function () {
				$('body').addClass('app_shfan');
				$('[data-bind-include=cmmHeader]').hide();
				$('[data-bind-include=cmmFooter]').hide();
			}, 300);
		}

		var _refer = '';
		if (location.search) {
			_.each(location.search.replace(/\?/, '').split('&'), function (n, t) {
				var v = n.split('=');
				if (v[0] == '_refer') {
					_refer = v[1];
					return;
				}
			});
		}

		if (_refer != '') {
			var _scheme = _refer.split('://')[0];
			_refer = _refer.substr(_scheme.length + 3);
			var _authority = "";
			if (_refer.indexOf('/') != -1) {
				_authority = _refer.substr(0, _refer.indexOf('/'));
			}
			else {
				_authority = _refer;
			}

			_refer = _scheme + "://" + _authority;
		}
		$svc.get('util').loadJS(['/logic/js/lib/wp_astg_34707.js']);

		// C2020121575561 고객 행동패턴 분석을 위한 추천검색 스크립트 삽입 요청
		$svc.get('util').loadJS(['/logic/js/mob/cmm/ibricks_wrc.js']);

		//2018년 개발 건 삭제
//		$svc.get('util').loadJS(['https://www.googletagmanager.com/gtag/js?id=UA-116830115-1'], function () {
//			gtag('js', new Date());
//			gtag('config', 'UA-116830115-1', { 'linker': { 'domains': ['emnet.co.kr'] }, 'page_referrer': _refer });
//		});
//		$svc.get('util').loadJS(['https://www.googletagmanager.com/gtag/js?id=UA-117605458-1'], function () {
//			gtag('js', new Date());
//			gtag('config', 'UA-117605458-1', { 'linker': { 'domains': ['shinhan.com', 'shinhaninvest.com', 'shinhanlife.co.kr', 'shinhancard.com'], 'accept_incoming': true }, 'page_referrer': _refer });
//		});
	};

	// googletagmanager C2018070562141  [ICSR] GA(Google Analystics) 스크립트 지주사 긴급 추가건
	global.dataLayer = global.dataLayer || [];
	global.gtag = function () {
		arguments.length && dataLayer.push(arguments);
	};

	var shcAppHeaderRender = function() {


	    var list = ['shcapp-non-header', 'shchatbot'];
		var agent = navigator.userAgent.toLowerCase();

		//C2020062975633 챗봇 UI 추가
		if(!(deviceInfo.mobile==true && deviceInfo.chatbot==true && deviceInfo.app!='shcardapp')){
			RegExp(list.join('|')).test(agent) && ($('[data-bind-include=cmmHeader]').hide() && $('body').addClass('app_shfan'));
		}




	};
	var shcAppFooterRender = function() {

	    var list = ['shcapp-non-footer', 'shchatbot'];
	    var agent = navigator.userAgent.toLowerCase();
	    RegExp(list.join('|')).test(agent) && $('[data-bind-include=cmmFooter]').hide();

	};

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
	};

	// 카카오 픽셀
	$svc.service('kkp',function(){
		var kakaoPixelID = '5474293016352212775';
		return{
			init:function(){
				$svc.get('util').loadJS(['//t1.daumcdn.net/adfit/static/kp.js'],function(){
					kakaoPixel(kakaoPixelID).pageView('shinhancard');
				});
			},
			viewContent:function(param){
				if(typeof kakaoPixel != 'undefined') kakaoPixel(kakaoPixelID).viewContent(param);
			},
			purchase:function(param){
				if(typeof kakaoPixel != 'undefined') kakaoPixel(kakaoPixelID).purchase(param)
			}
		}
	});

	$svc.get('kkp').init();

	//  페이스북 픽셀
	$svc.service('fbp',function(){
		var facebookPixelID = '197504078219898';
		function fbp_init(f,b,e,v,n,t,s){
			if(f.fbq) return;
			n=f.fbq=function(){
				n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)
			};
			if(!f._fbq) f._fbq=n;
			n.push=n;
			n.loaded=!0;
			n.version='2.0';
			n.queue=[];
			t=b.createElement(e);
			t.async=!0;
			t.src=v;
			s=b.getElementsByTagName(e)[0];
			s.parentNode.insertBefore(t,s)

			fbq('init', facebookPixelID);
			fbq('track', 'PageView');

		}
		return{
			init:function(){
				fbp_init(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
			},
			fbq:function(param1, param2){
				fbq(param1, param2);
			}
		}
	});

	$svc.get('fbp').init();

})(window);

//  C2019011868471  모바일홈페이지 페이지 내 뷰저블 솔루션 코드 삽입 요청
/**
 *
	(function (w, d, a) {
		w.__beusablerumclient__ = {
			load: function (src) {
				var b = d.createElement("script");
				b.src = src; b.async = true; b.type = "text/javascript";
				d.getElementsByTagName("head")[0].appendChild(b);
			}
		};
		w.__beusablerumclient__.load(a);
	})(window, document, '//beusable.shinhancard.com/script/b160804e144953u53/4570113e68');

 */

// C2020091671561 홈페이지 검색기능 수정 개발 요청
$(document).on("click", "#fullMenuWrap .allmenu_nav .tab_list >li > .role_link", function() {
	$("#fullMenuTabCont_2 div.gnb-quick-bar").removeClass("current"); // 인기검색어 박스에서 current를 제거
	if($('#gnbQuickBar'+$(this).parent().index()).find('.btn-word').length>0){ // 만약  #gnbQuickBar+메뉴인덱스 안에 .btn-word 가 한개보다 많다면
		$('#fullMenuWrap').removeClass('no-gnbQuickBar'); // #fullMenuWrap 에서 no-gnbQuickBar 클래스를 지우고
		$('#gnbQuickBar'+$(this).parent().index()).addClass('current'); //#gnbQuickBar+메뉴인덱스 에 current 클래스를 붙혀준다
	}else{
		$('#fullMenuWrap').addClass('no-gnbQuickBar'); // .btn-word 가 없다면 #fullMenuWrap 에 no-gnbQuickBar 클래스를 붙혀준다
	}
});
