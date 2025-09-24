var isPcOnly = $('html').hasClass('isPcOnly');
var gallerySwiper = null;
var certifyCardSwiper = null;
var certifySwiping = null;
var certifySwipingPop = null;
var tabSwiping = null;
var tabSwipingPop = null;
var tabSwipingSub = null;
var totalSrchId = null;
var eventListSwiper = null;
var eventTopSwiper = null;
var setTimeGnb;
var cardDetailSwiper;
var cardInfoSwiper = [];
var gnbComm = null;
var gnbMobile = null;
var eventMainSwiper = null;
var getToday = function(){
	var d = new Date();
	var year = d.getFullYear(), month = d.getMonth() + 1, day = d.getDate();
	var strMonth, strDay;
	if (month < 10) { strMonth = '0'+ month } else { strMonth = month }
	if (day < 10) { strDay = '0'+ day } else { strDay = day }
	getDate = year + '-' + strMonth + '-' + strDay;
	return getDate;
}
//마지막 타켓 엘리먼트 저장
var $docActiveElPrev = $('body');
var $docActiveEl = $('body');
$(document).off('focusin.docActiveEl click.docActiveEl').on('focusin.docActiveEl click.docActiveEl', function(e){ 
	$docActiveElPrev = $docActiveEl;
	$docActiveEl = $(e.target); 
}) 

var lastScrollTop = 0;

// 검색 팝업의 '이런 정보를 찾고 계세요?' swiper
var quickSrchInfoSwiper = null;

function setAppAgent(){
	var app;
	var appUA = ['shcardapp','shfanapp','sharedplatform','shcouponapp', 'spay/pay_billpayment_webview'];
	var _ua = navigator.userAgent.toLowerCase();
	for (var i = 0; i < appUA.length; i++){
		if (_ua.indexOf(appUA[i]) > -1){
			app = appUA[i];
		}
	}
	
	if (app == 'shcardapp') { $('body').addClass('app app_shcard') }
	else if (app == 'shfanapp') { $('body').addClass('app app_shfan app_pLay') }
	else if (app == 'sharedplatform') { $('body').addClass('app app_sharedplatform') }
	else if (app == 'shcouponapp') { $('body').addClass('app app_shcoupon') }
	else if (app == 'spay/pay_billpayment_webview') { $('body').addClass('app app_spay') }
	else { $('body').addClass('web') }
}

// 웹접근성모드 (Fixed Layout 해제 및 모든 예외사항 처리로 활용)
/*
var setAccessMode = {
	text: null,
	init: function(){
		var html = ''
			+'<div class="accessMode">'
			+'	<button type="button" onclick="setAccessMode.reset(event)">현재 접근성 기본 상태입니다. 최적화 상태로 설정하려면 실행해주시기 바랍니다.</button>'
			+'</div>';
		$('#wrap').prepend(html);
	},
	checked: function(){
		return $('body').hasClass('is_accessMode');
	},
	reset: function(event){
		if (this.checked()){
			$('body').removeClass('is_accessMode');
			this.text = '현재 접근성 최적화 상태입니다. 기본 상태로 설정하려면 실행해주시기 바랍니다.'
		} else {
			$('body').addClass('is_accessMode');	
			this.text = '현재 접근성 기본 상태입니다. 최적화 상태로 설정하려면 실행해주시기 바랍니다.'
		}
		$('div.accessMode button').text(this.text);
		//console.log(event);
	}
}
*/

$(document).ready(function() {
	setAppAgent();
	//setAccessMode.init();
	ui.init();
    popupUI();
	setPrint.init();
});

var ui = {
    init: function() {
		//Settings
        ui.userAgent();				//디바이스체크
        ui.resizeEvent();			//리사이즈함수
        ui.onlyPcInit(); 			//PC 전용
		ui.familyDrop();			//패밀리사이트 드롭메뉴
		
		//Layout

		//Librarys
        ui.mobVhIinit(); 			//모바일 전용, 배경 컬러가 있는 div 바닥까지 붙이기
		ui.autoComplete.event();	//자동완성 이벤트
        ui.accordionInit();			//아코디언 설정
        ui.accordionEvent();		//아코디언 이벤트
        ui.buttonListEvent();		//버튼목록 이벤트
        ui.cardSelect();			//카드선택
        ui.calenderDateSelect();	//달력선택
		ui.datepickerInit();		//달력플러그인 설정
		ui.datepickerEvent();		//달력플러그인 이벤트
		ui.emailInit();				//이메일 설정
		ui.userState.event();		//개인화 이벤트
		ui.graphBadge();			//이용한도조회 그래프
		ui.benefitExpand();	//혜택보기 접근성(기능은 개발에 있음)
		ui.graphBar();				//프로그레스 설정
        ui.inputClearButtonEvent();	//인풋 키워드삭제 이벤트
        ui.interactionEvent();		//인풋 인터렉션
		ui.customScroll.init();		//커스텀스크롤 설정
		ui.selectGoPage();			//셀렉트 페이지이동
		ui.popOverInit();			//팝오버 초기화
		ui.progressScroll();		//스크롤 프로그레스바
        ui.requestSMS();			//심사결과 SMS신청
        ui.selectJSInit();			//디자인셀렉트 설정
        ui.selectShowEvent();		//목록선택 기능
		ui.spyScroll();				//스파이스크롤 설정
		ui.paymentToal();			//이용명세서 결제금액 스티키
		ui.stickyScroll.init();		//스티키스크롤 설정
		ui.tabEvent();				//탭 이벤트
        ui.tooltipCard.event();		//카드툴팁 닫기(개발에서 별도 처리하고 있음)
		ui.galleryCardSwiper();		//갤러리 카드스와이프
		ui.galleryCardAccordion();	//갤러리 카드아코디언
		ui.aboutDepp();				//Deep카드 아코디언
		ui.recomCard();				//내게 맞는 카드 찾기 필터
    },

    // userAgent
    userAgent: function() {
        var os = "os_" + ua_result.os.name;
        var platform = ua_result.platform;
        var browser = ua_result.browser.name;
        var version = "ver_" + ua_result.browser.version.major;
        var ua = os + " " + platform + " " + browser + " " + version;
        
        if (navigator.userAgent.indexOf("shcardapp") != -1) ua = ua + " shcardApp";
		if (ua_result.platform == 'tablet' && window.orientation == 0 && window.outerWidth == 1024){ ua = ua + " tabletPro" }
		if (ua_result.platform == 'tablet' && window.orientation == 90 && window.outerWidth > 1100){ ua = ua + " tabletPro" }

        $("body").addClass(ua);

		if ($('#wrap').hasClass('main') && $(window).width() >= 1024 && $('body').hasClass('mobile')){
			var tabletStyles = function(){
				$('link').each(function(){
					var src = $(this).attr('href');
					if (src.indexOf('common.css') != -1 ){ $(this).attr('href', src.replace('common.css', 'common_pc.css')) }
					if (src.indexOf('contents.css') != -1 ){ $(this).attr('href', src.replace('contents.css', 'contents_pc.css')); }
				});
			}
			tabletStyles();
		}
    },
   
    // resize
    resizeEvent : function() {
		if (!isPcOnly) {
			$(window).resize(function() {
				resizeHandler();
			});
		}
    },

    // only pc
    onlyPcInit : function() {
        if($('.only_pc').length) {
            $('body').css('overflow-x','auto');
        }
    },

	quickTop: {
		init: function(){
			var self = this;
			self.action();
			self.event();
		},
		event: function(){
			var self = this;
			$(window).off('scroll.quickTop').on('scroll.quickTop', function(){ self.action() });
			$(document).off('click.quickTop').on('click.quickTop', '.quick_top .top', function(e){
				e.preventDefault();
				self.scrolled();
			});
		},
		scrolled: function(){
            $('body').attr('tabindex', '0').focus();
            $(window).scrollTop(0);
		},
		action: function(){
			if ($('div.quick_fixed').closest('#header').length){
				$('div.quick_fixed').appendTo($('#container'));
			}
			//if ($(window).scrollTop() > 1){ $('div.quick_top').addClass('is_visible') }
			//else { $('div.quick_top').removeClass('is_visible') }

                  var st = window.pageYOffset || document.documentElement.scrollTop;
                  var pageHeight = document.documentElement.scrollHeight - window.innerHeight;
                  var scrollBottomDiff = pageHeight - st;

                  if(scrollBottomDiff < 50){
                      $('div.quick_top').removeClass('is_visible');
                  }else if(st > 100){
                      if(st > lastScrollTop){
                          $('div.quick_top').removeClass('is_visible');
                      }else{
                          $('div.quick_top').addClass('is_visible');
                      }
                  }else{
                      $('div.quick_top').removeClass('is_visible');
                  }

                  lastScrollTop = st <= 0 ? 0 : st;
		},
	},

	mobVhHandler : function($this) {
		var win_h = $(window).outerHeight();
		var pos_top = $this.offset().top;
		var gap = 0;
		var total = win_h - pos_top;
		$('div.btn_wrap.m_fixed:visible').each(function(){
			gap = parseInt($('.contents').css('padding-bottom'));
		});
		$this.css('min-height', total - gap).closest('div.login_wrap.min_height').each(function(){
			$(this).height(total - gap);
		})
	},

    // 하단 컨텐츠 배경 컬러가 있을때 풀로 채울때
    mobVhIinit : function() {
        $('.mob_vh:visible').each(function(){
			var $this = $(this);
			if($(window).innerWidth()<=1100 && $this.closest('.form_type').length == 0) {
				var $this = $(this);
				var setTime;
				ui.mobVhHandler($this);
				if ($this.closest('div.login_wrap.min_height').length == 0){
					//로그인화면 리사이징 제외
					$(window).off('resize.mobVhinit').on('resize.mobVhinit', function() {
						clearTimeout(setTime);
						setTime = setTimeout(function(){ ui.mobVhHandler($this) }, 100);
					});
				}
			} else {
				$this.not('.contents').removeAttr('style');
			}
		})
    },

	setSrchHeader: function(){
		var $totalSrch = $('div.totalSrch_wrap');
		var $utilSrchBtn = $('#header .util_wrap .btn_ico_search');
		if ($totalSrch.length) { $utilSrchBtn.remove() }
	},

	// 웹접근성 - 초점공통
	commonAccess: {
		$eleFocusTags: 'input:not([tabindex]), button:not([tabindex]), a:not([tabindex]), select:not([tabindex]), textarea:not([tabindex])',
		$eleTabindex: '[tabindex="0"]',
		$eleTabindexM: '[tabindex="-1"]',

		// 포커스 비활성화
		disable: function($eleDisable, module){
			$eleDisable.attr({'aria-hidden':'true'}).addClass('is-disable-'+module+'-ariaHidden');
			$eleDisable.find(this.$eleTabindexM).addClass('is-disable-'+module+'-fixed');
			$eleDisable.find(this.$eleFocusTags).attr({'tabindex':'-1'}).addClass('is-disable-'+module+'-tags');
			$eleDisable.find(this.$eleTabindex).attr({'tabindex':'-1'}).addClass('is-disable-'+module+'-tabindex');
		},

		// 포커스 활성화
		enable: function($eleEnable, module){
			$eleEnable.attr({'aria-hidden':'false'}).removeClass('is-disable-'+module+'-ariaHidden');
			$eleEnable.find('.is-disable-'+module+'-tags').removeClass('is-disable-'+module+'-tags').removeAttr('tabindex');
			$eleEnable.find('.is-disable-'+module+'-tabindex').removeClass('is-disable-'+module+'-tabindex').attr({'tabindex':'0'});
			$eleEnable.find('.is-disable-'+module+'-fixed').removeClass('is-disable-'+module+'-fixed');
		},
	},

	// 웹접근성 - Swiper
	swiperAccess: function($container, mode){
		// 키다운이벤트 제어
		$container.find('.nav-button-next, .nav-button-prev, .swiper-button-next, .swiper-button-prev').off('keydown.pub').on('keydown.pub', function(e){
			if (e.keyCode == 13) { e.preventDefault(); e.stopPropagation(); }
		});

		//마이샵혜택
		if ($container.closest('.mys_swiper').length){
			// Init Vaariables		
			if (!$container.hasClass('swiper-container')){ $container = $container.find('.swiper-container').eq(0); }
			var $slideActiveLink = $container.find('> .swiper-wrapper > .swiper-slide-active').find('a');
			var $slideActiveNotLink = $container.find('> .swiper-wrapper > .swiper-slide').not('.swiper-slide-active').find('a');
			var $slideVisibleLink = $container.find('> .swiper-wrapper > .swiper-slide-visible').find('a');
			var $slideVisibleNotLink = $container.find('> .swiper-wrapper > .swiper-slide').not('.swiper-slide-visible').find('a');
			ui.commonAccess.disable($slideVisibleNotLink, 'swiper');
			ui.commonAccess.enable($slideVisibleLink, 'swiper');
		}

		// Init Vaariables		
		if (!$container.hasClass('swiper-container')){ $container = $container.find('.swiper-container').eq(0); }
		var $slideActive = $container.find('> .swiper-wrapper > .swiper-slide-active');
		var $slideActiveNot = $container.find('> .swiper-wrapper > .swiper-slide').not('.swiper-slide-active');
		var $slideVisible = $container.find('> .swiper-wrapper > .swiper-slide-visible');
		var $slideVisibleNot = $container.find('> .swiper-wrapper > .swiper-slide').not('.swiper-slide-visible');
		
		// Reset
		$container.addClass(mode);

		// 상위 스와이프가 있고 활성화이거나, 상위 스와이프가 없는 경우 웹접근성 처리
		if ($container.closest('.swiper-slide-active').length || $container.closest('.swiper-slide').length == 0 || $container.closest('.swiper-slide').siblings().length == 0) {

			// 'centered' 옵션
			if ($container.hasClass('centered') == true) {
				ui.commonAccess.disable($slideActiveNot, 'swiper');
				ui.commonAccess.enable($slideActive, 'swiper');
			}

			// 'auto' 옵션
			else if ($container.hasClass('auto') == true) {
				ui.commonAccess.disable($slideVisibleNot, 'swiper');
				ui.commonAccess.enable($slideVisible, 'swiper');
			}

			// 기본모드
			else {
				ui.commonAccess.disable($slideVisibleNot, 'swiper');
				ui.commonAccess.enable($slideVisible, 'swiper');
			}
		}
			
		// 활성 슬라이드의 자식에 스와이프가 있는 경우 (포커싱 리셋)
		$slideActive.find('.swiper-container').each(function(i){
			// Child Swiper
			var $childSlideActive = $(this).find('> .swiper-wrapper > .swiper-slide-active');
			var $childSlideActiveNot = $(this).find('> .swiper-wrapper > .swiper-slide').not('.swiper-slide-active');
			var $childSlideVisible = $(this).find('> .swiper-wrapper > .swiper-slide-visible');
			var $childSlideVisibleNot = $(this).find('> .swiper-wrapper > .swiper-slide').not('.swiper-slide-visible');

			// 'centered' 옵션
			if ($(this).hasClass('centered') == false) {
				ui.commonAccess.disable($childSlideActiveNot, 'swiper');
				ui.commonAccess.enable($childSlideActive, 'swiper');
			}

			// 'auto' 옵션
			else if ($(this).hasClass('auto') == true) {
				ui.commonAccess.disable($childSlideVisibleNot, 'swiper');
				ui.commonAccess.enable($childSlideVisible, 'swiper');
			}

			// 기본모드
			else {
				ui.commonAccess.disable($childSlideVisibleNot, 'swiper');
				ui.commonAccess.enable($childSlideVisible, 'swiper');
			}
		})

		// 비활성 슬라이드의 자식에 스와이프가 있는 경우
		$slideActive.siblings().find('.swiper-container').each(function(){
			ui.commonAccess.disable($(this), 'swiper');
		})

		//예외처리
		if ($container.hasClass('date_swipe_group')){
			ui.commonAccess.disable($container.find('> .swiper-wrapper > .swiper-slide-visible').first(), 'swiper');
			ui.commonAccess.disable($container.find('> .swiper-wrapper > .swiper-slide-visible').last(), 'swiper');
			//$container.find('> .swiper-wrapper > .swiper-slide-visible').first().removeClass('swiper-slide-visible');
			//$container.find('> .swiper-wrapper > .swiper-slide-visible').last().removeClass('swiper-slide-visible');
		}

		//다음,이전 Disabled
		/*
		var $disableSiblings = $container.siblings('.swiper-button-disabled');
		var $disableChildren = $container.children('.swiper-button-disabled');
		$disableSiblings.each(function(){
			if ($(this).attr('title') == '이전 슬라이드 보기'){ $(this).attr('title', '이전 슬라이드 없음') }
			if ($(this).attr('title') == '다음 슬라이드 보기'){ $(this).attr('title', '다음 슬라이드 없음') }
		})
		$disableChildren.each(function(){
			if ($(this).attr('title') == '이전 슬라이드 보기'){ $(this).attr('title', '이전 슬라이드 없음') }
			if ($(this).attr('title') == '다음 슬라이드 보기'){ $(this).attr('title', '다음 슬라이드 없음') }
		})
		if ($disableChildren.length == 2){ $disableChildren.hide() } 
		if ($disableSiblings.length == 2){ $disableSiblings.hide() }
		if ($disableSiblings.length == 1){ $disableSiblings.show() }
		if ($disableChildren.length == 1){ $disableChildren.show() }
		*/
	},

	// 웹접근성 - 아코디언
	accordionAccess: {
		init: function($toggleBtn){
			//약관동의는 전체보기, 나머지는 자세히
			if ($toggleBtn.hasClass('btn_acc_check')){ $toggleBtn.children('span').text('전체보기') }
			else if ($toggleBtn.find('.blind').length) {
				$toggleBtn.find('.blind').text('자세히보기');
				if ($toggleBtn.find('.blind').length > 1) {
					$toggleBtn.find('.blind').eq(0).siblings('.blind').remove();
				}
			}
		}
	},

	familyDrop: function(){
		$(document).off('click.dropdownBtn').on('click.dropdownBtn', '.sitelink_wrap .toggle_btn', function (e) {
			var $btn = $(this);
			$btn.next('.link_list').stop().slideToggle('fast');
			$btn.parent().toggleClass("on");
			if ($(this).parent().hasClass('on')){ $btn.attr('aria-expanded','true') }
			else {$btn.attr('aria-expanded','false') }

			$btn.parent().siblings().find('.link_list').stop().slideUp('fast');
			$btn.parent().siblings().find('.toggle_btn').attr('aria-expanded','false');
			$btn.parent().siblings().removeClass('on');
		});
		$(document).off('click.dropdownList').on('click.dropdownList', '.sitelink_wrap a', function (e) {
			$(this).closest('.link_list').stop().slideUp();  
			$(this).closest('.link_list').parent().removeClass("on");
			$(this).closest('.link_list').siblings('.toggle_btn').attr('aria-expanded','false');
		});
		$(document).off('focusin.dropdownBack click.dropdownBack').on('focusin.dropdownBack click.dropdownBack', function (e) {
			if ($('.sitelink_wrap').has(e.target).length === 0 && $('.sitelink_wrap > .on').length) {
				$('.sitelink_wrap > .on > .link_list').stop().slideUp('fast');
				$('.sitelink_wrap .toggle_btn').attr('aria-expanded','false');
			}
		});
	},

	// Email Domain
	emailInit: function() {
		$('.input-email').not('.set_email').each(function() {
			var $this = $(this);
			if(!$this.data('enhanced')) {
				$this.after('<ul class="input-email-list">' +
					'<li><a href="#">naver.com</a></li>' +
					'<li><a href="#">hanmail.net</a></li>' +
					'<li><a href="#">nate.com</a></li>' +
					'<li><a href="#">hotmail.com</a></li>' +
					'<li><a href="#">korea.com</a></li>' +
					'<li><a href="#">daum.net</a></li>' +
					'<li><a href="#">empal.com</a></li>' +
					'<li><a href="#">dreamwiz.com</a></li>' +
					'<li><a href="#">gmail.com</a></li>' +
					'<li><a href="#">shinhan.com</a></li>' +
				'</ul>');
				$this.data('enhanced', true);
			}
			$this.addClass('set_email');
		});
	},

    // input clear button
	inputClearButtonAction: function(el){
		var totalLen = el.val().length;
		el.next('.btn_clear').removeClass('hide').addClass(totalLen>0?'':'hide');        	

	},
    inputClearButtonEvent : function() {
        var timeVal = 0;
		if ($('.js_autoComplete').length){
			$('.js_autoComplete').each(function(){
				ui.inputClearButtonAction($(this));
			})
		} else { 
			$('body').off('DOMNodeInserted.clearButton').on('DOMNodeInserted.clearButton', '.js_cjs_autoCompleteomplete', function(){
				ui.inputClearButtonAction($('.js_autoComplete'));
			})
		}
        $(document).off('keyup.inputClear').on('keyup.inputClear', 'input[type=text], input[type=number], input[type=password], input[type=search]', function() {
            ui.inputClearButtonAction($(this));
        });
        $(document).off('click.inputClear').on('click.inputClear', '.btn_clear', function() {
			$(this).prev('input').each(function(){
            	ui.inputClearButtonAction($(this));
            	//$(this).addClass('focused');
				$(this).val('').focus();
			})
			$(this).closest('.bank_wrap_box').find('input').each(function(){
            	ui.inputClearButtonAction($(this));
				//$(this).addClass('focused');
            	$(this).val('').parent().focus();
			})
			$(this).addClass('hide');
        });
    },
	accordionAction: function($this) {		
		var self = $this;
		if($this.attr('type')=='radio') {
			self = $this.parent();
		}
		var $wrap = self.closest('.accordion_wrap');
		var $header = self.parent();
		var wrapperIdx = $header.attr('data-wrapper');
		var idx = $header.attr('data-idx');
		var idxWrap = $header.attr('data-wrapper');
		
		// 아코디언이 라디오 일때
		if($this.attr('type')=='radio') {
			if($this.attr('selected')=='selected') {
				if(self.hasClass('on')) {
					self.removeClass('on');
					self.parent().removeClass('on');
					$wrap.find('.accordion_body').eq(idx).hide();
				} else {
					$wrap.find('.accordion_header[data-wrapper="'+idxWrap+'"]').removeClass('on');
					$wrap.find('.accordion_header[data-wrapper="'+idxWrap+'"]').find('.arrow_updn').removeClass('on');
					$wrap.find('.accordion_body[data-wrapper="'+idxWrap+'"]').hide();
					self.addClass('on');
					self.parent().addClass('on');
					$wrap.find('.accordion_body[data-wrapper="'+idxWrap+'"]').eq(idx).show();
				}
			} else {
				$this.attr('selected','selected');
				$wrap.find('.accordion_header').not('.private').find('.arrow_updn').removeClass('on');
				$wrap.find('.accordion_body').not('.private').hide();
				self.addClass('on');
				self.parent().addClass('on');
				$wrap.find('.accordion_body').eq(idx).show();
			}
		// 아코디언이 버튼 일때
		} else {
			if(self.hasClass('on')) {
				self.removeClass('on');
				self.parent().removeClass('on');
				$wrap.find('.accordion_body[data-wrapper="'+idxWrap+'"]').eq(idx).hide();
			} else {
				if ($wrap.hasClass('all_acc') || $wrap.hasClass('agree_depth01') || $wrap.parent().hasClass('agree_depth02')){
					$wrap.siblings().find('.accordion_header').removeClass('on');
					$wrap.siblings().find('.accordion_header').find('.toggle_btn').removeClass('on');
					$wrap.siblings().find('.accordion_body').hide();
					self.addClass('on');
					self.parent().addClass('on');
					$wrap.find('.accordion_body[data-wrapper="'+idxWrap+'"][data-idx="'+idx+'"]').show();
				} else {
					$wrap.find('.accordion_header[data-wrapper="'+idxWrap+'"]').not('.private').removeClass('on');
					$wrap.find('.accordion_header[data-wrapper="'+idxWrap+'"]').not('.private').find('.toggle_btn').removeClass('on');
					$wrap.find('.accordion_body[data-wrapper="'+idxWrap+'"]').not('.private').hide();
					self.addClass('on');
					self.parent().addClass('on');
					$wrap.find('.accordion_body[data-wrapper="'+idxWrap+'"][data-idx="'+idx+'"]').show();
				}
			}
			self.filter('.on').attr({'aria-expanded':'true'});
			// (2022 웹접근성 수정) 2022.04.08 마재광 추가 s
			// ↓↓ 기존 펼쳐진 상태의 아코디언이 접기 상태의 아코디언 활성화시 자동으로 접히며 상태값이 변경되지 않아 발생되는 오류
			$('.accordion_wrap .toggle_btn').not('.on').attr({'aria-expanded':'false'});
			// self.not('.on').attr({'aria-expanded':'false'}); // 기존에 있던 false 스크립트 주석
			// (2022 웹접근성 수정) 2022.04.08 마재광 추가 e
		}
	},

	accordionScroll: function($btn){
		var eleT = $btn.offset().top;
		var scrT = $(window).scrollTop();
		var winH = $(window).height();
		var gapT = winH * 0.4;
		var tarT = winH * 0.5;
		if (eleT > scrT + winH - gapT){
			setTimeout(function(){
				$('html, body').stop().animate({'scrollTop':scrT + gapT}, 500);
			}, 100)
		}
	},

    accordionEvent: function() {
        $(document).off('click.accordionBtn').on('click.accordionBtn', '.accordion_wrap:not(.not_toggle) .accordion_header .toggle_btn', function(e) {
            if ($(this).attr('role')=='button') {
                e.preventDefault();
            }
			ui.accordionAction($(this));
        });
		$(document).off('change.accordionRadio').on('change.accordionRadio', '.accordion_header .radio_default input', function(){
			var $eleWrap = $(this).closest('.accordion_header');
			var $toggleBtn = $eleWrap.find('.toggle_btn').not('.on');
			if ($(this).prop('checked') == true){
				$(this).attr({'aria-expanded':'true'});
				$toggleBtn.trigger('click');
			} else {
				$(this).attr({'aria-expanded':'false'});
			}
		});
		$(document).off('change.accordionCheck').on('change.accordionCheck', '.accordion_check.all_acc .accordion_header .check_agree input', function(){
			var $eleWrap = $(this).closest('.accordion_header');
			var $toggleBtn = $eleWrap.find('.btn_acc_check');
			if ($(this).prop('checked') == true){
				$(this).attr({'aria-expanded':'true'});
				$toggleBtn.addClass('check');
			} else {
				$(this).attr({'aria-expanded':'false'});
				$toggleBtn.removeClass('check');
			}
		});
    },

    // accordion
    accordionInit : function() {
        /*
            .accordion_body 태그에 
            .private 클래스가 있으면, 각각의 토글기능
            .private 클래스가 없으면, 전체 체크 됨
        */
        for(var i=0; i<$('.accordion_wrap').not('.not_toggle').length; i++) {
            var wrapper = $('.accordion_wrap').not('.not_toggle');
            var head = wrapper.eq(i).find('.accordion_header').not('.inner');
			var con = wrapper.eq(i).find('.accordion_body').not('.inner');
			
			var headInner = wrapper.eq(i).find('.accordion_header.inner');
			var conInner = wrapper.eq(i).find('.accordion_body.inner');

            
            head.attr('data-wrapper',i);
            for(var a=0; a<head.length; a++) {
				head.eq(a).attr('data-idx', a);
            }
            con.attr('data-wrapper',i);
            for(var a=0; a<con.length; a++) {
                con.eq(a).attr('data-idx', a);
			}
			headInner.attr('data-wrapper',i);
			for(var a=0; a<headInner.length; a++) {
				headInner.eq(a).attr('data-idx', a);
			}
			conInner.attr('data-wrapper',i);
			for(var a=0; a<conInner.length; a++) {
				conInner.eq(a).attr('data-idx', a);
            }
			/*
            for(var a=0; a<head.length; a++) {
                if(wrapper.eq(i).find('.accordion_header').eq(a).find('>label').length) {
                    if(wrapper.eq(i).find('.accordion_header').eq(a).hasClass('on')){
                        wrapper.eq(i).find('.accordion_body').eq(a).show();
                    } else {
                        wrapper.eq(i).find('.accordion_body').eq(a).hide();
                    }
					ui.accordionAccess();
                }
            }
			*/
            
            if(wrapper.eq(i).find('.accordion_header').not('.inner').length) {
                var headers = wrapper.eq(i).find('.accordion_header').not('.inner').find('.toggle_btn.on');
                for(var a=0;a<headers.length; a++) {
                    var idx = headers.parent().attr('data-idx');
                    head.eq(idx).addClass('on');
                }
            }
			head.find('.toggle_btn').each(function(){ 
				ui.accordionAccess.init($(this));
				$(this).filter('.on').attr({'aria-expanded':'true'});
				$(this).not('.on').attr({'aria-expanded':'false'});
			});
        }

		//Accordion FAQ
		$('div.accordion_wrap.faq').each(function(){
			var $btn = $(this).find('.toggle_btn');
			var $inner = $(this).find('.accordion_body .inner');
			// 2023 접근성 삭제 $inner.attr('role', 'text');
			$btn.find('.qusetion').length == 0 && $btn.prepend('<span class="qusetion" aria-label="질문 : ">Q</span>');
			$inner.find('.answer').length == 0 && $inner.prepend('<span class="answer" role="text" aria-label="답변 : ">A</span>');
		})
    },

	// 가상키패드체크
	keypadCheck: {
		focused: false,
		visibled: false,
		event: function(){
			var self = this;
			$(document).off('focusin.keypadCheck').on('focusin.keypadCheck', '.inca_keypad', function(e){
				if (self.focused == false && self.visibled == false){
					self.focused = true;
				}
			});
			$(document).off('focusout.keypadCheck').on('focusout.keypadCheck', '.inca_keypad', function(e){
				setTimeout(function(){
					if (self.focused == true && $('.nppfs-keypad').is(':visible')){
						self.visibled = true;
						$('body').addClass('is_kaypadNumber');
						if ($('.login_wrap.min_height').length && $('body').hasClass('mobile')){
							$(window).scrollTop($(document).height() - $(window).outerHeight());
						}
					}
					self.focused = false;
				}, 100);
			});
			$(document).off('click.keypadCheckDoc focusin.keypadCheckDoc').on('click.keypadCheckDoc focusin.keypadCheckDoc', function(e){
				if ($('.nppfs-keypad').has(e.target).length === 0 && $(e.target).hasClass('inca_keypad') == false) {
					if (self.focused == false && self.visibled == true){
						self.focused = false; self.visibled = false;
						$('body').removeClass('is_kaypadNumber');
					}
				}
			});
		},
	},

	// 셀렉트 페이지 이동
	selectGoPage: function(){
		$(document).off('click.selectGoPage').on('click.selectGoPage', '.finance_customer_top .select_area .btn', function(){
			var url = $('#minwon').val();
			window.location.href = url;
		})
	},

	addrSelect: function(obj){
		$(obj).attr({'aria-selected':'true', 'title':'주소 선택됨'}).siblings().find('a').attr({'aria-selected':'false', 'title':'주소 선택하기'});
		$(obj).closest('tr').addClass('is_selected').siblings().removeClass('is_selected');
	},

	popSubScroll: function(){
		var $eleScroll = $('.pop_sub_cont');
		var $elePopBtnSub = $('.pop_sub_foot');
		var $elePopBtn = $eleScroll.closest('.popup').find('.pop_btn');
		var elePopBtnH = 0;
		if ($elePopBtn.length) { elePopBtnH = $elePopBtn.outerHeight() } else { elePopBtnH = 0 }

		var reset = function(value){
			$eleScroll.css({'height':value});
		}
		var init = function(){
			if ($(window).width() > 1100){
				var height = parseInt($eleScroll.attr('data-height'));
				reset(height);
			} else {
				var height = $(window).height() - $eleScroll.offset().top - elePopBtnH - $elePopBtnSub.outerHeight();
				reset(height);
			}
			popPosition('.pop_wrap:visible', 300);
		}
		init();
		if (!isPcOnly) { $(window).on('resize', function(){ init() }) }
	},

	fmAccordionEvent: function(){
		$(document).off('click.fmAccor').on('click.fmAccor', '.dep1_list a', function(e){
			if ($(this).next().length){
				$(this).next().stop().slideToggle('fast');
				$(this).parent().siblings().children('ul').stop().slideUp('fast');
			}
		});
	},

    selectShowEvent : function() {
        // 디자인 select
        $(document).off('click.selectShow1').on('click.selectShow1', '.select_wrap .btn_select', function(evt) {
            evt.preventDefault();
            if(!$(this).parent().hasClass('disabled')) {
                if($(this).hasClass('focused')) {
                    $(this).removeClass('focused');
					$(this).attr('aria-expanded', 'false');
					$(this).closest('.select_wrap').find('.list_selectbox').hide();
                } else {
                    $(this).addClass('focused');
					$(this).attr('aria-expanded', 'true');
					$(this).closest('.select_wrap').find('.list_selectbox').show();
                }
            }
        });

        $(document).off('focusin.selectShow2').on('focusin.selectShow2', '.select_wrap .list_selectbox li', function() {
            $(this).parent().prev().addClass('focused');
            $(this).parent().prev().attr('aria-expanded', 'true');
			$(this).closest('.list_selectbox').show();
        });

        $(document).off('click.selectShow3').on('click.selectShow3', '.select_wrap .list_selectbox li a', function(evt) {
            evt.preventDefault();
            $(this).parent().parent().prev().text($(this).text());
            $(this).parent().parent().prev().focus();
            $(this).parent().parent().prev().removeClass('focused');
			$(this).parent().parent().prev().attr('aria-expanded', 'false');
			$(this).closest('.list_selectbox').hide();
        });
    },

	/* 달력 UI */
	datepickerInit: function(){
		//datepicker
		if(isMobile.any() && isMobile.iOS() == false){
			$('.datepicker.onlyPC').not('.set_datepicker').each(function(){
				var strDate = $(this).val();
				var title = $(this).attr('title');
				$(this).parent().append('<input class="datepicker onlyMO clone" type="date" value="'+strDate+'" title="'+title+'">');
				$(this).attr({'aria-hidden':'true', 'tabindex':'-1'}).addClass('set_datepicker');
			});
			$('.datepicker.onlyMO').off('change.datepicker').on('change.datepicker',function(){
				var $val = $(this).val();
				$(this).siblings('.datepicker.onlyPC').val($val).trigger('change');
			});
			// 텍스트인풋데이터를 데이트인풋에 업데이트
			$('.datepicker.onlyPC').off('change.datepicker').on('change.datepicker',function(){
				var $val = $(this).val();
				$(this).siblings('.datepicker.onlyMO').val($val);
			});
		} else if($('.datepicker').length > 0 ){
			var maxNum = 9999;
			$('.datepicker').each(function(){
				if ($(this).attr('data-max-date') == '0'){ maxNum = 0 }
				var options = {
					closeText: '닫기',
					prevText: '이전달',
					nextText: '다음달',
					currentText: '오늘',
					monthNames: ['01','02','03','04','05','06','07','08','09','10','11','12'],
					dayNamesMin: ['일','월','화','수','목','금','토'],
					dateFormat: 'yy-mm-dd',
					yearSuffix: '.',
					showMonthAfterYear: true,
					showButtonPanel: true,
					showOn: 'button',// 2024 웹접근성으로 both > button으로 수정
					maxDate: maxNum,
					//changeMonth: true,
					//changeYear: true,
					//buttonImageOnly: false,
					buttonText: '기간조회',
onClose:function(){
//console.log($(this).attr('value'))
}
				}
				$(this).datepicker(options);
				// (2022 웹접근성 수정) 2022.04.26 마재광 수정 달력 열림 -> 달력 열기
				$('.ui-datepicker-trigger').attr('title', '달력 열기').html('<span>기간조회</span>');
			})

			//리사이즈시 위치값 문제로 캘린더 닫기
			$(window).off('resize.datepicker').on('resize.datepicker', function(){
				$('.ui-datepicker-close').trigger('click');
			});
		}
		ui.datepickerReset();
	},
	datepickerEvent: function(){
		var state;
		$(document).off('input.datepickerEvent').on('input.datepickerEvent', '.datepicker.onlyPC', function(e){
			var $this = $(this);
			var value = $this.val();
			var lens = value.length;
			var str = value.split('');
			var strDate = '';
			if (state >= lens && lens == 8) { str.splice(8,1); lens = lens - 1 }
			if (state >= lens && lens == 5) { str.splice(5,1); lens = lens - 1 }
			state = lens;
			if (lens > 10) { lens = 10 }
			for (var i = 0; i < lens; i++){
				strDate = strDate + str[i];
				if (i == 3 && str[4] != '-') {strDate = strDate + '-'}
				if (i == 6 && str[7] != '-' ) {strDate = strDate + '-'}
			}
			$this.val(strDate);
		});
		$(document).off('change.datepickerEvent').on('change.datepickerEvent', '.datepicker', function(e){
			var value = $(this).val();
			$(this).parent('.input_date').prevAll('.input_date').each(function(){
				if(isMobile.any()){ 
$(this).find('.datepicker.onlyMO').attr({'max': value})

}else { $(this).find('.datepicker.onlyPC').datepicker("option", "maxDate", value) }
			})
			// (2022 웹접근성 수정) 2022.04.26 마재광 수정 달력 열림 -> 달력 열기
			$('.ui-datepicker-trigger').attr('title', '달력 열기').html('<span>기간조회</span>');
$('#sDateText').each(function(){
$(this).next().attr('value',$(this).attr('value'));
})
$('#eDateText').each(function(){
$(this).next().attr('value',$(this).attr('value'));
});
		});
	},
	datepickerReset: function(){
		$('.datepicker.onlyPC').each(function(){
			var $this = $(this);
			if(isMobile.any()){
				//Disabled 처리
				if ($this.is(':disabled') == true || $this.prop('disabled') == true ){
					$this.next('.datepicker.onlyMO').attr('disabled', 'disabled').prop('disabled', true);
				} else {
					$this.next('.datepicker.onlyMO').removeAttr('disabled').prop('disabled', false);
				}
				//Value설정
				var $val = $this.val();
				$this.siblings('.datepicker.onlyMO').val($val);
				//오늘날짜설정
				if ($this.attr('data-max-date') == '0'){ $this.next('.datepicker.onlyMO').attr('max', getToday()); }
			} else {
				//Disabled 처리
				if ($this.is(':disabled') == true || $this.prop('disabled') == true ){
					$this.next('.ui-datepicker-trigger').attr('disabled', 'disabled').prop('disabled', true);
				} else {
					$this.next('.ui-datepicker-trigger').removeAttr('disabled').prop('disabled', false);
				}
				//오늘날짜설정
				if ($this.attr('data-max-date') == '0'){ $this.datepicker("option", "maxDate", getToday()) }
			}

			//제목설정
			var strTitle = $this.attr('title');
			strTitle = strTitle.replace('YYY-YM-MDD 형식으로 입력', 'YYYY-MM-DD 형식으로 입력');
			$this.attr({'title':strTitle, 'maxLength':'10'});
		});
	},

    requestSMS : function(){
        $(document).off('click.requestSMS').on('click.requestSMS', '.request_sms input[type=radio]', function() {
            if($(this).hasClass('agree_y')){
                $(".request_sms .phoneNum").attr("disabled", false);
            }
            if ($(this).hasClass('agree_n')) {
                $(".request_sms .phoneNum").attr("disabled", true);
            }
        });
    },
    
	tableScroll: {
		init: function(){
			var self = this;
			self.reset();
			self.event();
		},
		reset: function(){
			$('.table_scroll_area:visible').each(function(){ 
				var $ele = $(this);
				if ($('body').width() > 1100) {
					$ele.mCustomScrollbar('destroy');
					$ele.find('.table_wrap').removeAttr('style');
				} else {
					//설정값 적용
					var w_table = 1080;
					$ele.children().css({'width': w_table});
					if ($ele.attr('data-axis') == 'x'){
						ui.customScroll.axisX($ele);
					} else {
						ui.customScroll.axis($ele);
					}
				}
				$(this).addClass('is_scrolled');
			})
		},
		event: function(){
			var self = this;
			var setTime;
			$(window).off('resize.tableScroll').on('resize.tableScroll', function(){
				clearTimeout(setTime);
				setTime = setTimeout(function(){ self.reset() }, 100);
			})
		},
		touchScroll: function(pageScr){
			var current = $(window).scrollTop();
			$(window).scrollTop(current + pageScr);
			//console.log(current, pageScr);
		}
	},

	customScroll: {
		init: function(){
			var self = this;
			// PC, Mobile 공통
			$('.mCustom').each(function(){
				if ($(this).hasClass('mCustom-x')){ self.axisX($(this)) } 
				else { self.axis($(this)) }
			});

			// Mobile 전용
			$('body.mobile .mCustom-mobile').each(function(){ 
				if ($(this).hasClass('mCustom-x')){ self.axisX($(this)) } 
				else { self.axis($(this)) }
			});

			// PC 전용
			$('body.pc .mCustom-pc').each(function(){ 
				if ($(this).hasClass('mCustom-x')){ self.axisX($(this)) } 
				else { self.axis($(this)) }
			});
		},
		axisX: function($ele){
			$ele.mCustomScrollbar({axis:'x', advanced:'', scrollInertia:300});
			this.update($ele);
		},
		axis: function($ele){
			$ele.mCustomScrollbar({scrollInertia:300});
		},
		update: function($ele){ 
			$ele.mCustomScrollbar('update');
		},
	},
	selectJSInit: function(){
		selectJS.init();
		var setTimeSelect;
		$(window).off('scroll.selectJS resize.selectJS').on('scroll.selectJS resize.selectJS', function(){
			clearTimeout(setTimeSelect);
			setTimeSelect = setTimeout(function(){
				if ($('.ui_select.is_active').length){
					selectJS.direction();
				}
			},50);
		})
	},
	moreAccess : {
		options: null,
		init: function(sel, str){
			this.options = { sel: sel, $items: $(sel),  lens: $(sel).length, type: str}
		},
		test: function(){
			var self = this.options;
			var $eleClone = self.$items.clone();
			self.$items.eq(self.lens-1).after($eleClone);
			ui.moreAccess.action();
		},
		action: function(){
			var self = this.options;
			var pageLens = $('.js_more_focus').length;
			if (self.type == undefined){
				self.$items = $(self.sel);
				self.$items.eq(self.lens).css({'position':'relative'});
				self.$items.eq(self.lens).children().css({'position':'relative', 'z-index':'2'});
				/* pageLens 가 제대로 작동하지 않아 문구 수정 */
				// self.$items.eq(self.lens).children().eq(0).before('<div class="js_more_focus" role="text" tabindex="0" style="position:absolute; left:0; top:0; right:0; bottom:0; z-index:10"><span class="blind">목록 '+ (pageLens+2) +'페이지 시작</span></div>');
				self.$items.eq(self.lens).children().eq(0).before('<div class="js_more_focus" role="text" tabindex="0" style="position:absolute; left:0; top:0; right:0; bottom:0; z-index:1"><span class="hidden-text">추가 목록 시작</span></div>'); //IOS접근성 초점고려한 임의태그 추가
				self.$items.eq(self.lens).find('.js_more_focus').focus();
			} else if (self.type == 'table'){
				self.$items = $(self.sel);
				self.$items.eq(self.lens).children().eq(0).attr({'tabindex':0, 'title':'목록 '+ (pageLens+2) +'페이지 시작'}).focus();
			} else if (self.type == 'accordion'){
				self.$items = $(self.sel);
				self.$items.eq(self.lens).css({'position':'relative'});
				self.$items.eq(self.lens).find('>.accordion_header').children().css({'position':'relative', 'z-index':'2'});
				self.$items.eq(self.lens).find('>.accordion_header').children().eq(0).before('<div class="js_more_focus" role="text" tabindex="0" style="position:absolute; left:0; top:0; right:0; bottom:0; z-index:10"><span class="blind">목록 '+ (pageLens+2) +'페이지 시작</span></div>'); //IOS접근성 초점고려한 임의태그 추가
				self.$items.eq(self.lens).find('.js_more_focus').focus();
			}
		},
	},
	
	moreAccessCMS : {
		options: null,
		init: function(sel, btn){
			this.options = { $items:$(sel), $btn:$(btn), lensPage:10, pageNum: 1, pageTotal: null}
			this.reset();
		},
		reset: function(){
			var self = this.options;
			var lensTotal = self.$items.length; // li 총갯수 18개
			var indexItem = 0; // 목록번호
			var indexPage = 0; // 페이지단위
			var currentPage = 1; // 페이지번호
			if (lensTotal % self.lensPage > 0) {
				self.pageTotal = parseInt(lensTotal / self.lensPage) + 1;
			} else if (lensTotal % self.lensPage == 0) {
				self.pageTotal = parseInt(lensTotal / self.lensPage);
			}

			// 페이지 단위만큼 반복 (처음부터, 전체목록 개수까지)
			for (indexPage = 0; indexPage < lensTotal;) {
				// 페이지 단위내에서 반복 (현재 페이지 단위부터, 다음 페이지 단위까지)
				for (indexItem = indexPage; indexItem < indexPage + self.lensPage;) {
					// 아이템에 페이지번호 적용
					self.$items.eq(indexItem).each(function(){
						$(this).attr('data-page', currentPage);
					})
					indexItem = indexItem + 1;
				}
				indexPage = indexPage + self.lensPage;
				currentPage = currentPage + 1;
			}

			// 초기화
			var $itemsFirst = self.$items.filter('[data-page=1]').eq(0);
			//console.log($itemsFirst);
			this.title($itemsFirst);
			self.$items.hide();
			self.$items.filter('[data-page=1]').show();
			self.$btn.attr('data-page', self.pageNum).find('.nums').text('1/'+ (self.pageTotal));
		},
		title: function($item, callback){
			var self = this.options;
			$item.css({'position':'relative'});
			$item.children().css({'position':'relative', 'z-index':'11'});
			$item.children().eq(0).before('<div class="js_more_focus" role="text" tabindex="0" style="position:absolute; left:0; top:0; right:0; bottom:0; z-index:10"><span class="blind">목록 '+ (self.pageNum) +'페이지 시작</span></div>'); //IOS접근성 초점고려한 임의태그 추가
			if (callback) { callback() }
		},
		action: function(btn){
			var self = this.options;
			var $btn = $(btn);
			var pageIdx = parseInt($btn.attr('data-page'));
			if (pageIdx + 1 < self.pageTotal+1) {
				self.pageNum = pageIdx + 1;
				self.$items.filter('[data-page='+self.pageNum+']').show();
				$btn.attr('data-page', self.pageNum).find('.nums').text(self.pageNum+'/'+ (self.pageTotal));
				
				var $itemsFirst = self.$items.filter('[data-page='+self.pageNum+']').eq(0);
				this.title($itemsFirst, function(){ $itemsFirst.find('.js_more_focus').focus() });
			} 
		}
	},

	pageLoad: function(id, src, callback){
		$(id).load(src, function(){
			if (callback) callback;
			ui.fullMenu.init();
		});	
	},

	listType: function(btn, id, type){
		$(id).attr({'data-type': type});
		$(btn).addClass('is_selected').attr({'aria-selected':'true'}).siblings().attr({'aria-selected':'false'}).removeClass('is_selected');
	},

	gnbSubNav: {
		$eleWrap: null, $eleInner: null, $eleDimmer: null, isActive: 'closed',
		init: function(){
			if ($('.gnbSub_wrap').length) {
				this.$eleWrap = $('.gnbSub_wrap');
				this.$eleInner = this.$eleWrap.find('.gnbSub_inner');
				this.$eleDimmer = this.$eleWrap.find('.gnbSub_dimmer');
				this.$eleGroup = $('.gnb_fulldown').find('.allmenu_group');
			}
			this.event();
		},
		event: function(){
			var self = this;
			var setTimeStart = null,  setTimeEnd = null;
			// Gnb Navigation
			$('body.msie .gnb_fulldown .dep1 > li > a').off('click.gnbSubNav').on('click.gnbSubNav', function(e){
				var url = $(this).attr('href');
				window.location.pathname = url;
			});

			//$('.gnb_fulldown a').off('click.gnbSubNav').on('click.gnbSubNav', function(e){
			$('.gnb_fulldown .dep1 > li > a').off('focusin.gnbSubNav mouseenter.gnbSubNav').on('focusin.gnbSubNav mouseenter.gnbSubNav', function(e){
				if ($(window).outerWidth() > 1023 && $('.quickSrch_wrap').hasClass('is_visible') == false) {
					var $this = $(this);
					self.isActive = 'closed';
					clearTimeout(setTimeEnd);
					setTimeStart = setTimeout(function(){
						// GNB 이벤트 발생
						if ( self.$eleWrap.hasClass('is_visible')) { self.change($this) }  // 이미 활성화된 경우
						else { self.open($this) } // 비 활성화된 경우
					}, 300);
				}
			});
			$('.gnb_fulldown .dep1 > li > a').off('focusout.gnbSubNav mouseleave.gnbSubNav').on('focusout.gnbSubNav mouseleave.gnbSubNav', function(e){
				if ($(window).outerWidth() > 1023 && $('.quickSrch_wrap').hasClass('is_visible') == false) {
					self.isActive = 'opened';
					clearTimeout(setTimeStart);
					setTimeEnd = setTimeout(function(){
						self.close();
					}, 300);
				}
			});

			// Gnb Sub Navigation
			$('.allmenu_group , .gnb-fav-menu').off('focusin.gnbSubNav mouseenter.gnbSubNav').on('focusin.gnbSubNav mouseenter.gnbSubNav', function(e){
				//if ($(window).outerWidth() > 1100 ) {
				if ($(window).outerWidth() > 1023 ) {
					clearTimeout(setTimeEnd);
				}
			});
			$('.allmenu_group').off('focusout.gnbSubNav mouseleave.gnbSubNav').on('focusout.gnbSubNav mouseleave.gnbSubNav', function(e){
				//if ($(window).outerWidth() > 1100 ) {
				if ($(window).outerWidth() > 1023 ) {
					clearTimeout(setTimeStart);
					setTimeEnd = setTimeout(function(){ 
						if (self.$eleInner.hasClass('is_active')){ self.close() }
					}, 300);
				}
			});
		},
		reset: function($link){
			var self = this;
			var $eleGroupActive = $link.next('.allmenu_group');
			var $eleGnbSubWrap = $('.gnbSub_wrap');
			var $eleScroll = $link.next('.allmenu_group').find('.allmenu_scroll');
			self.$eleGroup.removeClass('is_preved is_nexted is_current is_active');
			$eleGroupActive.addClass('is_current is_visible');
			$eleGroupActive.parent().prevAll().find('.allmenu_group').addClass('is_preved');
			$eleGroupActive.parent().nextAll().find('.allmenu_group').addClass('is_nexted');
			$eleScroll.css({'height':$eleScroll.find('.allmenu_cont').outerHeight()});
			//$eleScroll.mCustomScrollbar({scrollInertia:200});
			setTimeout( function(){ $eleGroupActive.addClass('is_active') }, 50);
			self.$eleGroup.one('transitionend', function(){
				if (!$(this).hasClass('is_active')){
					$(this).removeClass('is_visible');
				}
			})
		},
		responsive: function($link, hei){
			var $eleGroupActive = $link.next('.allmenu_group');
			var winH = $(window).height();
			var grpH = $eleGroupActive.offset().top;
			var gapH = 120;
			var maxH = winH - gapH - grpH;
			if (maxH < hei){ hei = maxH }
			var self = this;
			self.$eleInner.height(hei);
			$link.next('.allmenu_group').height(hei);
		},
		change: function($link){
			var self = this;
			self.reset($link);
			var $eleScroll = $link.next('.allmenu_group').find('.allmenu_scroll');
			var hei = $eleScroll.outerHeight() + $eleScroll.offset().top - $('#gnbSubWrap').offset().top;
			self.responsive($link, hei);
			self.$eleGroup.one('transitionend', function(){
				if ($(this).hasClass('is_active')){
					ui.commonAccess.enable($(this), 'gnb');
					ui.commonAccess.disable($(this).parent().siblings().find('.allmenu_group'), 'gnb');
				}
			});
		},
		open: function($link){
			var self = this;
			self.reset($link);
			self.$eleWrap.addClass('is_visible');
			var $eleScroll = $link.next('.allmenu_group').find('.allmenu_scroll');
			var hei = $eleScroll.outerHeight() + $eleScroll.offset().top - $('#gnbSubWrap').offset().top;
			$('#header').addClass('is_gnbOpend');
			setTimeout(function(){
				self.responsive($link, hei);
				self.$eleInner.addClass('is_active');
				self.$eleDimmer.addClass('is_active');
			});
			self.$eleDimmer.stop().fadeIn(300, function(){
				$(this).find('a, button').first().focus();
				ui.commonAccess.enable($link.parent(), 'gnb');
				ui.commonAccess.disable($link.parent().siblings().find('.allmenu_group'), 'gnb');
				self.isActive = 'opened';
			});
			popOpenScroll();
		},
		close: function(){
			var self = this;
			self.$eleInner.removeClass('is_active').height(0);
			self.$eleGroup.height(0);
			$('#header').removeClass('is_gnbOpend');
			self.$eleDimmer.removeClass('is_active');
			self.$eleDimmer.stop().fadeOut(300, function(){
				self.$eleWrap.removeClass('is_visible');
				self.$eleGroup.removeClass('is_preved is_nexted is_current is_active');
				ui.commonAccess.enable(self.$eleGroup, 'gnb');
				self.isActive = 'closed';
			});
			popCloseScroll();
		}
	},

	userState: {
		event: function(){
			var self = this;
			$(document).off('click.userState').on('click.userState', '.userState_toggle', function(e){
				if ($(this).next().hasClass('is_active') == false){ self.open($(this)); } 
				else { self.open($(this)); }
			})
			$(document).off('click.userStateBack focusin.userStateBack').on('click.userStateBack focusin.userStateBack', function(e){
				if ($(e.target).hasClass('userState_toggle') == false && $('.userState_toggle').has(e.target).length === 0 && $('.userState_tooltip').has(e.target).length === 0) {
					self.close($('.userState_toggle'));
				}
			})
		},
		open: function($btn){
			var $ele = $btn.next();
			$ele.addClass('is_visible');
			setTimeout(function(){ $ele.addClass('is_active') }, 100);
			$ele.one('transitionend', function(){
				if ($ele.hasClass('is_active')){
					$btn.attr('aria-expanded', 'true');
				}
			})
		},
		close: function($btn){
			var $ele = $btn.next();
			$ele.removeClass('is_active');
			$ele.one('transitionend', function(){
				if (!$ele.hasClass('is_active')){
					$ele.removeClass('is_visible');
					$btn.attr('aria-expanded', 'false');
				}
			})
		}
	},

	fullMenu: {
		init: function(){
			var $fullWrap = $('div.fullMenu_wrap');
			var $quickNav = $fullWrap.find('div.quick_nav_wrap');
			var $allmenuNav = $fullWrap.find('div.allmenu_nav_wrap');
			var $btnExpand = $allmenuNav.find('.allmenu_list .btn_expand');
			$fullWrap.attr({'role':'modal', 'aria-modal':'true'});
			$quickNav.attr({'tabindex':'0'});
			// 2023 접근성 삭제 $allmenuNav.attr({'tabindex':'0'});
			$btnExpand.attr({'aria-expanded':'false'});
			this.event();

			//개인화
			//$('.userState_wrap')
		},
		event: function(){
			$(document).off('click.fullMenu').on('click.fullMenu', '.allmenu_list .btn_expand', function(){
				$(this).next('.dep2_list').toggle();
				$(this).toggleClass('is_expend');
				if ($(this).hasClass('is_expend')){ $(this).attr({'aria-expanded':'true'}) }
				else { $(this).attr({'aria-expanded':'false'}) }
			});
			$(document).off('click.fullMenuList').on('click.fullMenuList', '.allmenu_nav .tab_list li', function(e){
				$('.allmenu_nav_wrap').scrollTop(0);
			});
		},
		open: function(btn, id){
			$('#header').addClass('is_fullmenu_opened');
			$(id).addClass('is-opened');
			$(btn).attr({'aria-expanded':'true'});
			$('.fullMenu_focus').focus();
			ui.commonAccess.disable($(id).siblings(), 'fullmenu');
			ui.commonAccess.disable($('#header').siblings(), 'fullmenu');
			popOpenScroll();
		},
		close: function(btn, id){
			$('#header').removeClass('is_fullmenu_opened');
			$(id).removeClass('is-opened');
			$('.fullMenu_opener').attr({'aria-expanded':'false'}).focus();
			ui.commonAccess.enable($(id).siblings(), 'fullmenu');
			ui.commonAccess.enable($('#header').siblings(), 'fullmenu');
			popCloseScroll();
		},
	},

	// Tab
	tabInit : function(){
		var setTabItem = function($this){
			//Label Reset
			$this.attr({'role':'none'});
			$this.children('label').removeAttr('role');

			//Current
			var $current = $this.filter('.current');
			var $currents = $current.siblings();
			$current.children().not('label').attr({'aria-selected':'true'}).removeAttr('title');
			$currents.children().not('label').attr('aria-selected', 'false');
			$current.children('label').attr({'title':'선택됨'})
			$currents.children('label').removeAttr('title');
		}
		$('.tab_list').find('li').each(function(){
			if($(this).parents('.global_nav').length>0){
				$(this).find('a').removeAttr('role').removeAttr('aria-selected');
			}
			 setTabItem($(this));
		 });

		$('[role=tablist]').find('li').each(function(){
			if($(this).parents('.global_nav').length>0){
				$(this).find('a').removeAttr('role').removeAttr('aria-selected');
			}
			setTabItem($(this));
		});


		$('.radio_tab_wrap').find('li > label').each(function(){
			$(this).removeAttr('aria-selected title');
			$(this).children('input').next('span').attr('role', 'text');
		})
		$('.radio_tab_wrap02').find('li > label').each(function(){
			$(this).removeAttr('aria-selected title');
			$(this).children('input').next('span').attr('role', 'text');
		})
		$('.check_default').each(function(){
			$(this).children('span').attr('role', 'text');
		})
		$('.mys-m-sort').find('.item.on').each(function(){
			$(this).attr('title', '선택됨');
		})
		$('.mys-nav').find('.item.on').each(function(){
			$(this).attr('title', '선택됨');
		})
		$('.check_btn, .radio_btn').each(function(){
			$(this).removeAttr('role aria-selected').children('span').attr('role', 'text');	
		});
	},

    // tab
    tabEvent : function() {
		$(document).off('click.tabEvent').on('click.tabEvent', '[role=tablist] li', function(e){
			if ( $(this).find('a').attr('data-link') != 'true' && $(this).find('label').length == 0){ 
				e.preventDefault();
			}

			if ($(this).find('a').attr('data-link') != 'true'){
				e.stopPropagation();

				var $tabitem = $(this);
				var $tabitems = $tabitem.siblings();
				var $tabpanel = $('#'+$tabitem.children().attr('aria-controls'));
				var $tabpanels = $tabpanel.siblings();

				// 버튼
				if ($(this).find('label').length == 0){
					$tabitem.addClass("current").children().attr({'aria-selected':'true'});
					$tabitems.removeClass("current").children().attr({'aria-selected':'false'});
				}

				// 내용
				if ($tabpanel.length && $(this).find('a').attr('data-role') != 'spyScroll'){
					$tabpanel.addClass("current");
					$tabpanels.removeClass("current");
				}
			}

			if ($(this).closest('.swiper_tab').length){
				var idx = $(this).index();
				if ($(this).closest('.swiper_tab').find('.swiper_tabCont').length && !ui.isPesnAuth($(this).closest('.swiper_tab'))) {
					if ($(this).closest('.pop_wrap').length){ certifySwipingPop.slideTo(idx) } 
					else { certifySwiping.slideTo(idx) }
				}
			}
		})

		$(document).off('focusin.radioEvent').on('focusin.radioEvent', '.radio_wrap.type_flex.type_btn .radio_btn input', function(e){
			$(this).closest('label').addClass('is_focused').siblings().removeClass('is_focused');
			if ($(this).prop('checked')){
				$(this).closest('label').addClass('is_checked').siblings().removeClass('is_checked');
			}
		});
		$(document).off('focusout.radioEvent').on('focusout.radioEvent', '.radio_wrap.type_flex.type_btn .radio_btn input', function(e){
			$(this).closest('label').removeClass('is_focused');
		});
		/*
		$(document).off('change.radioEvent').on('change.radioEvent', '.radio_wrap.type_flex.type_btn .radio_btn input', function(e){
			if ($(this).prop('checked')){
				$(this).closest('label').addClass('is_checked').siblings().removeClass('is_checked');
			}
		});
		*/
    },

	orderItems: {
		event: function(){
			// if ($('body').hasClass('pc')){
			// 	$(document).off('change.orderItems').on('change.orderItems', '.order_item .check_default input', function(e){
			// 		var id = $(this).attr('id');
			// 		setTimeout(function(){ $('#'+id).focus() }, 50);
			// 	})
			// } else {
			// 	$(document).off('click.orderItems').on('click.orderItems', '.order_item .check_default input', function(e){
			// 		var id = $(this).attr('id');
			// 		setTimeout(function(){ $('#'+id).focus() }, 50);
			// 	})
			// }
		},
	},
	tooltipCard: {
		event: function(){
			$(document).off('click.tooltipCard').on('click.tooltipCard', '.tooltip_close', function(){
				ui.tooltipCard.close($(this));
			})
		},
		close: function($this){
			//내카드관리
			$this.closest('.card_swiper').each(function(){
				$('.tooltip_card_swiper').hide();
				if ($(this).find('.swiper-pagination').length){
					$(this).find('.swiper-pagination').attr({'role':'text', 'tabindex':'0'}).focus();
				} else if ($(this).find('.swiper-slide').eq(0).find('.card_top_info .text_link').length) {
					$(this).find('.swiper-slide').eq(0).find('.card_top_info .text_link').focus();
				}
			});
			//필터
			$this.closest('.reportlist_filter_wrap').each(function(){
				$(this).find('.filter_toggle').focus();
			});
			//이용내역
			$this.closest('.report_usage_detail:visible').each(function(){
				if ($(this).find('.usage_list > li').eq(0).find('dt button').length){
					$(this).find('.usage_list > li').eq(0).find('dt button').focus();
				}
			});
			//즉시결제
			$this.closest('.list_group:visible').each(function(){
				if ($(this).find('.list_headnote01:visible .check_default').length){
					$(this).find('.list_headnote01:visible .check_default input').focus();
				} else if ($(this).find('.list01 > ul > li').eq(0).find('.usage_info .link strong').length){
					$(this).find('.list01 > ul > li').eq(0).find('.usage_info .link strong').attr('tabindex', '0').focus();
				} else if ($(this).find('.list01 > ul > li').eq(0).find('.usage_info .link').length){
					$(this).find('.list01 > ul > li').eq(0).find('.usage_info .link').attr('tabindex', '0').focus();
				} else if ($(this).find('.list01 > ul > li').eq(0).find('.usage_info .title_area strong').length){
					$(this).find('.list01 > ul > li').eq(0).find('.usage_info .title_area strong').attr('tabindex', '0').focus();
				}
			});
			//이용대금명세서
			$this.closest('.mu_card_wrap:visible').each(function(){
				if ($(this).find('.mu_card_list .swiper-slide').eq(0).find('input').length){
					$(this).find('.mu_card_list .swiper-slide').eq(0).find('input').focus();
				}
				// if ($(this).find('.mucP:visible').length){
				// 	$(this).find('.mucP').focus();
				// } else {
				// }
			});
			//할부이용상세
			$this.closest('.list01:visible').each(function(){
				if ($(this).find('.mypage_usage_detail > ul > li').eq(0).find('.link strong').length){
					$(this).find('.mypage_usage_detail > ul > li').eq(0).find('.link strong').attr('tabindex','0').focus();
				}
				// if ($(this).find('.mucP:visible').length){
				// 	$(this).find('.mucP').focus();
				// } else {
				// }
			});
			//
			$this.closest('.card_usage_wrap:visible').each(function(){
				if ($('.card_usage_list > li').eq(0).find('.usage_item .left_con strong').length){
					$('.card_usage_list > li').eq(0).find('.usage_item .left_con strong').attr('tabindex','0').focus();
				}
			})
			//console.log($this);
		},
		open: function(){
			$('.tooltip_card_swiper').show();
		}
	},

	//표현방법에 대한 접근성이슈도 있어서 공통처리
	cardIconAlt: function() {
		$('span.ico_card_logo, .card-type .ico_card_logo, li.card_icon').each(function(){
			var $this = $(this);
			var name;
			if ($this.hasClass('ct01') || $this.hasClass('visa')){ name = '비자 카드'; }
			if ($this.hasClass('ct02') || $this.hasClass('master')){ name = '마스터 카드'; }
			if ($this.hasClass('ct03')){ name = '아메리칸 익스프레스 카드'; }
			if ($this.hasClass('ct04')){ name = '제이씨비 카드'; }
			if ($this.hasClass('ct05')){ name = '유알에스 카드'; }
			if ($this.hasClass('ct06')){ name = '국내 카드'; }
			if ($this.hasClass('ct07')){ name = '유니온페이 카드'; }
			if ($this.hasClass('ct08')){ name = '에스앤 카드'; }
			if ($this.hasClass('ct09')){ name = '비씨 카드'; }

			if ($this.hasClass('ico_card_logo')){ $(this).attr('role','text').text(name) }
			if ($this.hasClass('card_icon')){ $(this).html('<span role="text">'+ name +'</span>') }
		});

		var imgCardAlt = function($img){
			var src = $img.attr('src');
			if (src.indexOf('overseas_pay_master') > -1){ $img.attr('alt', '마스터 카드') }
			else if (src.indexOf('overseas_pay_visa') > -1){ $img.attr('alt', '비자 카드') }
			else if (src.indexOf('overseas_pay_amex') > -1){ $img.attr('alt', '아메리칸 익스프레스 카드') }
			else if (src.indexOf('overseas_pay_union') > -1){ $img.attr('alt', '유니온페이 카드') }
			else if (src.indexOf('overseas_pay_urs') > -1){ $img.attr('alt', '유알에스 카드') }
			else if (src.indexOf('overseas_pay_sn') > -1){ $img.attr('alt', '에스앤 카드') }
			else if (src.indexOf('overseas_pay_jcb') > -1){ $img.attr('alt', '제이시비 카드') }
			else if (src.indexOf('overseas_pay_domestic') > -1){ $img.attr('alt', '국내 카드') }
			var $em = $(this).find('em');
			if ($em.length){
				$em.attr('aria-hidden', 'true');
			}
		}
		//찾아드림, 카드상세, 브랜드안내
		$('.card_brand, .ico_brand, .popcard_img').each(function(){
			imgCardAlt($(this).find('img'));
		});
	},

    // tab Swiper
	tabSwiperAction: function(obj, initNum){
		var $obj = $(obj);
		var options = {
			slidesPerView : 'auto',
			//freeMode : true,
			initialSlide : initNum,
			resistanceRatio: 0,
			navigation: {
				nextEl : obj+ ' .swiper-button-next',
				prevEl : obj+ ' .swiper-button-prev',
			},
			/*
			watchSlidesVisibility: true,
			on: {
				init: function(){ 
					ui.swiperAccess($obj.find('.swiper-container'));
				},
				slideChangeTransitionStart: function(){
					ui.swiperAccess($obj.find('.swiper-container'));
				},
				resize: function(){
					ui.swiperAccess($obj.find('.swiper-container'));
				}
			}
			*/
		}
		if ($obj.find('.swiper-slide').length > 0) {
			if ($obj.closest('.pop_wrap').length == 0){
				tabSwiping = new Swiper(obj+ ' .swiper-container', options);
				setTimeout(function(){ tabSwiping.update() }, 0);
			}
			if ($obj.closest('.pop_wrap').length == 1) {
				if (tabSwipingPop != null){ tabSwipingPop.destroy(); tabSwipingPop = null; }
				tabSwipingPop = new Swiper(obj+ ' .swiper-container', options);
				setTimeout(function(){ tabSwipingPop.update() }, 0);
			}
		}
	},

	tabChange: function($obj, idx){
		$obj.closest('.tab_type01:visible').find('.tab_list .swiper-slide').eq(idx).addClass('current').siblings().removeClass('current');
		if ($obj.closest('.pop_wrap').length){
			tabSwipingPop.slideTo(idx);
		} else {
			tabSwiping.slideTo(idx);
		}
	},

    tabSwiper: function(n) {
		$('.tab_type01.swiper_tab').each(function(i){
			$(this).attr('id', 'tabSwiper'+i);
			//탭구조가 여러개임
			var tabNav = '#tabSwiper'+i+' > .ly_inner > .tab_pull';
			if ($(this).children('.tab_pull').length){ tabNav = '#tabSwiper'+i+' > .tab_pull' }
			if ($(this).children('.tab_sticky').length){ tabNav = '#tabSwiper'+i+' > .tab_sticky > .ly_inner > .tab_pull' } //디지털메인
			var $tabNav = $(tabNav);

			if($tabNav.find('> .swiper-container > .swiper-wrapper > .swiper-slide:visible').length) {
				// Ver2.0 통합버전
				var initNum = 0; //변수 생성은 한번만
				// 링크탭 활성화번호
				//.filter('[data-link="true"]') 조건제거(개발에서 탭을 선택할때마다 호출되므로 모든 선택된 탭의 값이 필요함)
				$tabNav.find('> .swiper-container > .swiper-wrapper > .swiper-slide.current').children().each(function(){
					initNum = $(this).parent().index();
				})
				// 팝업의 특정 탭을 활성화 할때 (활성화된 경우 0으로 초기값 설정안되는 문제 수동활성화)
				if (tabSwiping != null && typeof(n) == 'number' && n == 0) {
					tabSwiping.slideTo(n);
				}
				// 팝업의 특정 탭을 활성화 할때 (선택상태 설정 및 초기활성화 설정)
				if (typeof(n) == 'number') {
					initNum = n;
					$tabNav.find('li').eq(n).children().trigger('click');
				}
				if (!ui.isPesnAuth($(this).find('.swiper_tabCont'))){ 
					if ($tabNav.children('.swiper-button-next').length === 0) { $tabNav.prepend('<button type="button" class="swiper-button-next"><span class="blind">다음</span></button>') }
					if ($tabNav.children('.swiper-button-prev').length === 0) { $tabNav.prepend('<button type="button" class="swiper-button-prev"><span class="blind">이전</span></button>') }
					ui.tabSwiperAction(tabNav, initNum)
				}
			}
			if ($(this).hasClass('has_sticky')){
				ui.tabScrollSticky.init();
			}
		})

		$('.tab_type03.swiper_tab:visible').each(function(){
			var initNum = 0;
			var $obj = $(this);
			if ($obj.find('.swiper-slide:visible').length){
				initNum = $obj.find('.swiper-slide.current').index();
				if ($obj.find('.tab_pull').children('.swiper-button-prev').length === 0) { $obj.find('.tab_pull').prepend('<button type="button" class="swiper-button-prev"><span class="blind">이전</span></button>') }
				if ($obj.find('.tab_pull').children('.swiper-button-next').length === 0) { $obj.find('.tab_pull').prepend('<button type="button" class="swiper-button-next"><span class="blind">다음</span></button>') }
				tabSwipingSub = new Swiper($obj.find('.swiper-container'), {
					slidesPerView : 'auto',
					//freeMode : true,
					initialSlide : initNum,
					resistanceRatio: 0,
					watchSlidesVisibility: true,
					navigation: {
						nextEl : $obj.find('.swiper-button-next'),
						prevEl : $obj.find('.swiper-button-prev'),
					},
					on: {
						init: function(){ 
							ui.swiperAccess($obj.find('.swiper-container'));
						},
						slideChangeTransitionStart: function(){
							ui.swiperAccess($obj.find('.swiper-container'));
						},
						resize: function(){
							ui.swiperAccess($obj.find('.swiper-container'));
						},
						click: function() {
								this.slideTo(this.clickedIndex)
						}
					}
				});
			}
		});
    },
	
	tabScrollSticky: {
		init: function(){
			if ($('.tab_type01.has_sticky').length){
				this.action();
				this.event();
			}
		},
		event: function(){
			var self = this;
			$(window).on('scroll', function(){
				self.action();
			})
			// 2022.09.29 리사이즈시에도 적용
			$(window).on('resize', function(){
				self.action();
			})
		},
		action: function(){
			//Sticky
			var $tabWrap = $('.tab_type01.has_sticky');
			var $tabSticky = $('.tab_type01.has_sticky .tab_sticky');
			var $header = $('#header');
			var tarTop = 0;
			// if (!$('body').hasClass('app_shfan')){ tarTop = $header.outerHeight() }
			// 2022.09.29 GNB오픈시 header 높이값 변경으로 인해 탭이 하단으로 내려가는 오류 수정
			if (!$('body').hasClass('app_shfan')){ tarTop = $('#header .header_inner').outerHeight();}
			var eleTop = $tabWrap.offset().top;
			var scrTop = $(window).scrollTop();
			if (tarTop > eleTop - scrTop){
				$tabWrap.addClass('is_fixed');
				$tabSticky.css({top:tarTop});
			} else {
				$tabWrap.removeClass('is_fixed');
				$tabSticky.css({top:0});
			}

			//Select
			var $tabCont = $tabWrap.find('.tab_cont');
			var tabHei = $tabSticky.outerHeight();
			var gatTop = 0;
			var setTime;
			var idx;
			$tabCont.each(function(i){
				if (Math.round(tarTop + tabHei) > Math.round($(this).offset().top - scrTop - ($(this).outerHeight()/3))) {
					clearTimeout(setTime);
					var $this = $(this);
					setTime = setTimeout(function(){ ui.tabChange($this, i); return; });
				}
			})
		}
	},

	collapse: {
		toggle: function(_this, id, callback) {
			if ($(id).is(':visible')) { this.close(id, _this, callback) } 
			else {this.open(id, _this, callback) }
		},
		open: function(_this, id, callback) {
			var $eleTar = $('#'+id);
			var $eleBtn = $(_this);
			var $eleBtnSiblings = $('[aria-controls="'+id+'"]');
			$eleTar.removeClass('hide');
			$eleBtnSiblings.attr({'aria-expanded':'false'});
			$eleBtn.attr({'aria-expanded':'true'});

			if ($eleTar.attr('data-sync') == 'true'){
				var name = $eleTar.attr('data-name');
				$('[data-name="'+ name +'"]').not('#' + id).each(function(){
					$(this).addClass('hide');
					var id = $(this).attr('id');
					$('[aria-controls="'+ id +'"]').attr({'aria-expanded':'false'});
				})
			}
		},
		close: function(_this, id, callback) {
			var $eleTar = $('#'+id);
			var $eleBtn = $(_this);
			$eleTar.addClass('hide');
			$eleBtn.attr({'aria-expanded':'false'});
		}
	},

	selected: {
		toggle: function(_this, callback) {
			if ($(_this).attr('aria-selected') == 'true') { this.false(_this, callback) } 
			else {this.true(_this, callback) }
		},
		true: function(_this, callback) {
			var $eleBtn = $(_this);
			var name = $eleBtn.attr('data-name');
			var $eleBtnSiblings = $('[data-name="'+name+'"]');
			$eleBtnSiblings.attr({'aria-selected':'false'});
			$eleBtn.attr({'aria-selected':'true'});
		},
		false: function(_this, callback) {
			var $eleBtn = $(_this);
			var name = $eleBtn.attr('data-name');
			$eleBtn.attr({'aria-selected':'false'});
		}
	},

	// 이용한도조회 그래프
	graphBadge : function(){
		var action = function(){
			var graph = $(".bar_graph.has_badge");
			for (var a = 0; a < graph.length; a++) {
				var $eleAvailable = graph.eq(a).children(".badge.available");
				var $eleCurrent = graph.eq(a).children(".badge.current");
				var userAvailable = stringToInt($eleAvailable.children("dd").children("span").text());
				var userCurrent = stringToInt($eleCurrent.children("dd").children("span").text());
				var graphPrint = (userCurrent / userAvailable) * 100;
				var badgeWidth = (graph.eq(a).children(".badge").width()) / 2;
				var badgePosition = (graph.eq(a).children(".bar").width() / 100) * graphPrint;
				if (graphPrint >= 100) {
					$eleCurrent.addClass("full");
					$eleCurrent.css({right: -5, left:'auto'});
					$eleCurrent.children("dd").text("상향가능한도에 도달했습니다.");
					graph.eq(a).children(".bar").children("span").css("width", '100%');
				} else {
					if (graphPrint < 10){ 
						$eleCurrent.addClass("empty");
						if ($('body').hasClass('msie')) { $eleCurrent.css({'transform':'translateX('+(badgeWidth-5)+'px)'}) }
					 } else {
						$eleCurrent.removeClass("empty");
						 if ($('body').hasClass('msie')) { $eleCurrent.css({'transform':'translateX(0px)'}) }
					 }
					$eleCurrent.css("left", badgePosition - badgeWidth);
					graph.eq(a).children(".bar").children("span").css("width", graphPrint + '%');
					if (userAvailable == 0) { $eleCurrent.addClass('zero') } 
				};
			}
		}
		var setTimeResize;
		var init = function(){
			setTimeResize = setTimeout(function(){ action() },200);
		}
		$(window).off('resizeEnd.graphBadge').on('resizeEnd.graphBadge', function(){
			clearTimeout(setTimeResize); init();
		})
		init();
	},

    // 이용한도조회 Bar 그래프
	graphBar : function(){
		if ($(".bar_graph_wrap").length){
			var graph = $(".bar_graph_wrap");
			for(var a=0; a<graph.length; a++) {
				var userAvailable = stringToInt(graph.eq(a).children(".parts.available").children("dd").children("span").text());
				var userCurrent = stringToInt(graph.eq(a).children(".parts.current").children("dd").children("span").text());
				var graphPrint = (userCurrent/userAvailable) * 100;
				graph.eq(a).children(".bar_graph").children(".bar").children("span").css("width", graphPrint+'%')
			}
		}
	},

	galleryCardSwiper : function(){
		if($(".gallyer_swiper").length > 0){
            gallerySwiper = new Swiper('.gallyer_swiper .swiper-container', {
				autoHeight: true,
				slidesPerView: 1,
                navigation : {
                    prevEl:'.swiper-button-prev',
                    nextEl:'.swiper-button-next'
				},
				//simulateTouch : false,
				watchSlidesVisibility: true,
				on: {
					init: function(){ 
						ui.swiperAccess($(".gallyer_swiper .swiper-container"));
					},
					slideChangeTransitionStart: function(){ 
						ui.swiperAccess($(".gallyer_swiper .swiper-container"));
					},
					resize: function(){ 
						ui.swiperAccess($(".gallyer_swiper .swiper-container"));
					}
				}
            });
        }
	},

	galleryCardAccordion : function(){
		if($(".new_accordion_wrap").length > 0){
			$(".new_accordion_wrap .accordion_header .toggle_btn").on({
				"click" : function(e){
					if($(this).attr('role')=='button'){
						e.preventDefault();
					}
					var self = $(this);
					var selfTxt = $(this).find("span");
					var $wrap = self.closest('.accordion_wrap');
					var $header = self.parent();
					var idx = $header.attr('data-idx');
					var idxWrap = $header.attr('data-wrapper');

					if(self.hasClass('on')) {
						self.removeClass('on').attr('aria-expanded', 'false');
						self.parent().removeClass('on');
						selfTxt.text("더보기");
						$wrap.find('.accordion_body[data-wrapper="'+idxWrap+'"]').eq(idx).hide();
					} else {
						$wrap.find('.accordion_header[data-wrapper="'+idxWrap+'"]').not('.private').removeClass('on');
						$wrap.find('.accordion_header[data-wrapper="'+idxWrap+'"]').not('.private').find('.toggle_btn').removeClass('on').attr('aria-expanded', 'false');
						$wrap.find('.accordion_body[data-wrapper="'+idxWrap+'"]').not('.private').hide();
						self.addClass('on').attr('aria-expanded', 'true');
						self.parent().addClass('on');
						selfTxt.text("닫기");
						$wrap.find('.accordion_body[data-wrapper="'+idxWrap+'"][data-idx="'+idx+'"]').show();
					}

					if(gallerySwiper){
						gallerySwiper.update();
					}
				}
			});
		}
	},

	aboutDepp : function(){
		if($(".shcd_main_menu").length){
			var $eleShcdLink = $('.shcd_main_menu a');
			$eleShcdLink.attr('aria-expanded','false');
			$eleShcdLink.on('focus', function(){
				$(this).closest('.atc').addClass('active').find('a').attr('aria-expanded','true');
				$(this).closest('.atc').siblings().find('a').attr('aria-expanded','false');
			});
			$eleShcdLink.on('blur', function(){
				$(this).closest('.atc').removeClass('active').find('a').attr('aria-expanded','false');
			});
		}

		if($(".video_item").length){
			var isVideoModalShow = false;
			$('.video_item a').on('click', function(e){
				e.preventDefault();
				$('#shcdMainVideoModal').addClass('shcd-active');
				var youtube = $(this).data('youtube');
				var title = $(this).data('title');
				var html = '<iframe width="560" height="315" src="https://www.youtube.com/embed/' + youtube + '?autoplay=1&amp;rel=0&amp;showinfo=0" frameborder="0" gesture="media" allow="encrypted-media" allowfullscreen></iframe>';
				$('#shcdMainVideoModal .shcd-video-player').html(html);
				$('#shcdMainVideoModal #videoPopTit').html(title);
				isVideoModalShow = true;

				popOpen('#shcdMainVideoModal');
			});

			$('.shcd-main-video-modal .shcd-main-video-modal-btn-close').on('click', function(e){
				e.preventDefault();
				$('#shcdMainVideoModal').removeClass('shcd-active');
				$('#shcdMainVideoModal .shcd-video-player').html('');
				$('#shcdMainVideoModal #videoPopTit').html('');
				isVideoModalShow = false;
			});

			$(document).off('touchmove.aboutDepp').on('touchmove.aboutDepp', function(e){
				if ( isVideoModalShow ) {
					e.preventDefault();
					return false;
				}
			});
		}
	},

	paymentToal: function(){
		$('.payment_total').each(function(){
			var resizeTime;
			var $ele = $(this);
			var $eleParent = $ele.parent();
			function reset(){
				var hei = $ele.outerHeight();
				active();
			}
			function active(){
				var winTop = $(window).scrollTop() + $(window).outerHeight() - 50;
				var conTop = $eleParent.offset().top;
				if (winTop >= conTop) {
					$ele.removeClass('is_fixed');
				} else {
					$ele.addClass('is_fixed');
				}
			}
			reset();
			$(window).on('resize.pub', function(){ 
				clearTimeout(resizeTime);
				resizeTime = setTimeout(function(){ reset() },200);
			})
			$(window).on('scroll.pub', function(){ active(); })
		})
	},

	recomCard : function(){
		if($(".card_filter_search_wrap").length > 0){
			var $btn = $("#openFilter"), 
			$filter = $(".card_filter_search_wrap"),
			$filterBtn = $filter.find(".btn_close"),
			$filterTit = $filter.find(".filter_tit"),
			speed = 200,
			$dim = $("<div class='dimmed'></div>"),
			$wrap = $("#wrap");

			//default
			//ui.commonAccess.disable($('#wrap'), 'filter');
			//$('#wrap').attr({'aria-hidden':'false'}).removeClass('is-disable-filter-ariaHidden');
			//ui.commonAccess.enable($filter, 'filter');
			if ($('body').hasClass('pc')){
				//ui.commonAccess.disable($('#wrap').siblings(), 'filter');
				//ui.commonAccess.disable($('#container').siblings(), 'filter');
			} else {
				//ui.commonAccess.disable($filter.parents().siblings(), 'filter');

			}

			//$("body").addClass("hidden");
/* 접근성 */
function recomCardAria(elm){
var tidx=(elm=='true')?'-1':'0'
var ftidx=(elm=='true')?'0':'-1'
var felm=(elm=='true')?'false':'true'
// 2024 웹접근성 초점문제로 삭제 $('#header, #skipNavi, .content_print, #cardCompare, #cardCompareAfter, #footer, .quick_fixed').attr({'aria-hidden':elm,'tabindex':tidx})
$('#header, #skipNavi, .content_print, #footer, .quick_fixed').attr({'aria-hidden':elm,'tabindex':tidx})
$('#popDetailFilter').attr({'aria-hidden':felm,'tabindex':ftidx})
}

// (2022 웹접근성 수정) 2022.04.08 마재광 추가: 인풋 선택시 포커스이동으로 인해 주석
// $('#popDetailFilter .filter_header').attr('tabindex','0').focus();
$('#popDetailFilter .btn_close, #popDetailFilter .btn default').click(function(){
recomCardAria('false');
})
$('#popDetailFilter .btn_close, #popDetailFilter .btn default').keydown(function(e){
if(e.keyCode==13){
recomCardAria('false');
}
})
$('#cardCompareAfter #openFilter').click(function(){
recomCardAria('true');
})
/* //접근성 */

			$btn.off('click.recomCard').on("click.recomCard", function(e){
				$filter.show().stop().animate({"left":0}, speed);
				$wrap.find(".dimmed").remove();
				$wrap.append($dim);

				$filterTit.attr({'tabindex':'0'}).focus();
				//ui.commonAccess.disable($('#wrap'), 'filter');
				//$('#wrap').attr({'aria-hidden':'false'}).removeClass('is-disable-filter-ariaHidden');
				//ui.commonAccess.enable($filter, 'filter');
				if ($('body').hasClass('pc')){
					//ui.commonAccess.disable($('#wrap').siblings(), 'filter');
					//ui.commonAccess.disable($('#container').siblings(), 'filter');
				} else {
					//ui.commonAccess.disable($filter.parents().siblings(), 'filter');
				}
				//$("body").addClass("hidden");
			});

			$filterBtn.off('click.recomCard').on("click.recomCard", function(){
				$filter.stop().animate({"left":"-100%"}, speed, function(){
					$wrap.find(".dimmed").remove();
					$filter.hide();

					$btn.attr({'tabindex':'0'}).focus();
					//ui.commonAccess.enable($('#wrap'), 'filter');
					//ui.commonAccess.enable($('#wrap').siblings(), 'filter');
					if ($('body').hasClass('pc')){
						//ui.commonAccess.enable($('#wrap').siblings(), 'filter');
						//ui.commonAccess.enable($('#container').siblings(), 'filter');
					} else {
						//ui.commonAccess.enable($filter.parents().siblings(), 'filter');
					}
					//$("body").removeClass("hidden");
				});
			});

			$(document).off('click.recomCard focusin.recomCard').on('click.recomCard focusin.recomCard', function(e){
				if ($('.card_filter_search_wrap:visible').has(e.target).length == 0 && $('#header:visible').has(e.target).length == 0 && $('#skipNavi:visible').has(e.target).length == 0 && $('#openFilter').has(e.target).length == 0 && $(e.target).hasClass('filter_toggle') == false) {
					if ($('body').hasClass('pc')){ $('.card_filter_search_wrap:visible').find('.btn_close').trigger('click') }
					//$("body").removeClass("hidden");
				}
			})
		}
	},

	cardCertifySwiper : function(){
		var eleSwiper = '.shcard_slide_wrap';
		var $eleSwiper = $(eleSwiper);
		var $eleSwiperContainer = $(eleSwiper+' .swiper-container');
		var clsNoSwiper = 'no_swiper';
		if ($(eleSwiper).find('.swiper-slide').length > 1){
			$eleSwiper.removeClass(clsNoSwiper);
			certifyCardSwiper = new Swiper(eleSwiper+' .swiper-container', {
				slidesPerView: 1,
				spaceBetween: 60,
				centeredSlides: true,
				//allowTouchMove: false,
				watchSlidesVisibility: true,
				navigation: {
					nextEl: eleSwiper+' .nav-button-next',
					prevEl: eleSwiper+' .nav-button-prev',
				},
				pagination: ui.pageChangeOption(eleSwiper+' .swiper-container'),
				on: {
					init: function(){ 
						ui.swiperAccess($eleSwiperContainer, 'centered');
					},
					slideChangeTransitionStart: function(){ 
						ui.swiperAccess($eleSwiperContainer, 'centered');
					},
				}
			});
			$eleSwiper.off('pointerdown').on('pointerdown', function(e) {
				if ($(e.target).is('input')) { $(e.target).focus() };
				//return false;
			});
		} else {
			$eleSwiper.addClass(clsNoSwiper);
		}
	},
	
	isPesnAuth: function($ele){
		var $tabCont = $ele;
		
		if ( $tabCont.closest('[data-plugin-view="loanCardAuth"], [data-plugin-view="pesnAuth"], [data-plugin-view="pesnAuthOther"], [data-plugin-view="pesnAuthSimpleCard"], [data-plugin-view="pesnAuthJoin"]').length > 0 ){
			return true;
		}
		return false;
	},

    commCertifySwiperPop : function(popID){
		var obj = '#'+popID+' .swiper_tabCont';
		var $obj = $(obj);
		if (certifySwipingPop != null) { certifySwipingPop.destroy(); certifySwipingPop = null; }
		certifySwipingPop = new Swiper(obj, {
			autoHeight: true,
			slidesPerView: 1,
			touchMoveStop: true,
			threshold: 20,
			navigation: {
				nextEl : obj+' .swiper-button-next',
				prevEl : obj+' .swiper-button-prev',
			},
			watchSlidesVisibility: true,
			on: {
				init: function(){ 
					ui.swiperAccess($obj);
					$(obj+' > .swiper-wrapper > .swiper-slide').css('width', '100%');
				},
				slideChangeTransitionStart: function(){ 
					$(obj+' > .swiper-wrapper > .swiper-slide').css('width', '100%');
					var idx = $(obj+' > .swiper-wrapper > .swiper-slide-active').index();
					ui.swiperAccess($obj);
					ui.tabChange($obj, idx);
					ui.mobVhIinit();
				},
			}
		});

    },

    commCertifySwiper : function(){
		var setTime = null;
		var action = function($this){
			if (!ui.isPesnAuth($this)) {
				var tabScroll = function(){
					var pos_t = $('.tab_type01 .tab_pull').offset().top;
					var target_t = $('#header').outerHeight();
					if ($('.top_banner:visible').length){
						target_t = target_t + $('.top_banner:visible').outerHeight();
					}
					$('html, body').stop().animate({scrollTop: pos_t - target_t}, 300);
				}
				var obj = '.swiper_tabCont.swiper-container';
				var $obj = $(obj);
				var mobile = $('body').hasClass('mobile');
				var setHeight = function(idx){
					var slideHeight = $(obj+' > .swiper-wrapper > .swiper-slide').eq(idx).children().outerHeight();
					if (typeof(slideHeight) == 'number'){ $(obj).css('height', slideHeight); }
				}
				certifySwiping = new Swiper(obj, {
					autoHeight: true,
					slidesPerView: 1,
					//touchMoveStop: true,
					threshold: 20,
					navigation: {
						nextEl : obj+' .swiper-button-next',
						prevEl : obj+' .swiper-button-prev',
					},

					watchSlidesVisibility: true,
					on: {
						init: function(){ 
							ui.swiperAccess($obj);
							if (mobile){ setHeight() }
							$(obj+' > .swiper-wrapper > .swiper-slide').css('width', '100%');
						},
						slideChangeTransitionStart: function(){ 
							$(obj+' > .swiper-wrapper > .swiper-slide').css('width', '100%');
							var idx = $(obj+' > .swiper-wrapper > .swiper-slide-active').index();
							ui.swiperAccess($obj);
							ui.tabChange($obj, idx);
							tabScroll();
							//ui.mobVhIinit();
						},
						slideChangeTransitionEnd: function(){
							var idx = $(obj+' > .swiper-wrapper > .swiper-slide-active').index();
							if (mobile){ setHeight(idx) }
						}
					}
				});
			}
		}	

		if ($('.swiper_tabCont > .swiper-wrapper > .swiper-slide:visible').length){ action($('.swiper_tabCont')) }
		$('body').off('DOMNodeInserted.certify').on('DOMNodeInserted.certify', '.swiper_tabCont .swiper-slide', function(){ action($('.swiper_tabCont')) });

    },

    // button list
    buttonListEvent : function() {
        $(document).off('click.buttonList').on('click.buttonList', '.btn_list button', function(e) {
            var $btnList = $(this).closest('.btn_list');
            $btnList.find('button').removeClass('current');
            $(this).addClass('current');
		});

		$(document).off('click.buttonList2').on('click.buttonList2', '.btn_wrap.flex_wrap.add_money_group button', function(e) {
			var self=$(this);
			self.parent().children().removeClass('clicked').attr({'aria-selected':'false'});
			self.addClass('clicked').attr({'aria-selected':'true'});
		});
    },

    // interaction
    interactionEvent : function() {
        $(document).off('focusin.interaction').on('focusin.interaction', '.interaction input', function(e) {
        	if(isMobile.any() && $(this).hasClass('inca_keypad')) return false;
            $(this).closest(".interaction").addClass("is_focus");
        });

        $(document).off('focusout.interaction').on('focusout.interaction', '.interaction input', function(e) {
        	if(isMobile.any() && $(this).hasClass('inca_keypad')) return false;
            var input_val = $(this).val();
            if(input_val.length == 0){
                $(this).closest(".interaction").removeClass("is_focus");      
            } 
        });
    },
    
    // logic framework와 연결되는 함수들
    afterLoading: function() {    	
    },

	// 폼타입에서 호출해야될 기능들 적용
    formType: function() {
		ui.skipNav();				//스킵네비게이션 리셋
		ui.gnbSwiper();				//GNB Swiper
		ui.fullMenu.init();			//전체메뉴
		ui.accordionInit();			//아코디언 설정
        ui.anchorReset();			//링크 설정
		ui.tabInit();				//탭 설정
		ui.quickTop.init();			//상담, 챗봇, 상단바로가기
        ui.emailInit();				//이메일 설정
		ui.mobVhIinit();			//모바일 영역채우기
		ui.datepickerInit();		//달력 설정
		ui.autoComplete.init();		//자동완성 설정
		ui.tabSwiper();				//탭 스와이프
		ui.cardIconAlt();			//카드아이콘 대체텍스트
		ui.commCertifySwiper();		//공통영역 스와이프(본인인증은 개발에서 처리)
		ui.searchInput();			//검색인풋 설정
		ui.keypadCheck.event();		//보안키패드 노출시 설정
		ui.keyword.init(); 			//자주하는 질문 키워드
		ui.keyword_srch.init(); 	//통합검색 키워드
		ui.gnbSubNav.init();		//GNB 서브메뉴
		ui.tooltipLabel(); 			//라벨안에 들어간 툴팁버튼 밖으로 빼기 (사파리 e.target 대응)
		ui.spyScrollGlobal.init();	//가려지는 포커스요소 스파이스크롤
		ui.myCardInfo.init();		//카드선택
		ui.flowStep.init();			//스탭 설정
		ui.textTipAlert();		//에러텍스트 설정
		ui.orderItems.event();
		ui.recomCard();	
		popBtnTitle();				//팝업타이틀 삭제
		selectJS.init();			//Select 공통디자인
		setPrint.init();			//프린트설정(날짜, 시간 등)
    },

    layerComm: {
    	open: function() {
    		var $pop = $("#__flying_partition__ .pop_wrap");
			if($pop.length > 0){
				popOpen($pop.last());
			}
    	}
    },

	skipNav: function(){
		var $skipNav = $('#skipNavi');
		var attrStr = '';
        if ($('.pop_wrap.is_visible').length){ attrStr = 'tabindex="0"' } 
        /* 20240821 테스트
		if ($('.pop_wrap.is_visible').length){ attrStr = 'tabindex="-1"' 
            console.log(attrStr);
        }
        else {attrStr = '';
            console.log(attrStr);
        } */

		if ($skipNav.length){ $skipNav.html('<a href="#container" '+attrStr+'>본문 바로가기</a>') }
		else {$('#wrap').before('<div id="skipNavi"><a href="#container" '+attrStr+'>본문 바로가기</a></div>')}
	},

	// 앵커, href="#" 의미없는 값을 처리한 것에 대해 이벤트처리
	anchorReset: function(){
		var $links = $('a');
		var $buttons = $('button');
		var $noneLinks = $('a[href=""], a[href="#"], a[href="#n"], a[href="#none"]');
		$noneLinks.off('click.noneLink').on('click.noneLink', function(e){ e.preventDefault(); });
		$(document).off('click.anchorReset').on('click.anchorReset', 'body.pc a[href^="tel"]', function(e){ e.preventDefault() });
		$(document).off('click.anchorDevice').on('click.anchorDevice', 'body.pc a[data-link="mobile"]', function(e){ e.preventDefault() });
		$links.filter('[role=tab]').addClass('role_link');
		$links.not('.role_link').attr({'role':'button'});
		$links.filter('.outlink').attr({'title':'새창열기'});
		$buttons.filter('.btn_outlink').attr({'title':'새창열기'});
	},

	footerExpand: function(btn, id){
		var $btn = $(btn),
			$btnLabel = $btn.find('.label'),
			$id = $('#'+id);

		$id.toggle();
		if ($id.is(':visible')){
			$btn.addClass('is_expanded').attr('aria-expanded','true');
			var top = $(window).scrollTop() + $id.outerHeight();
			$(window).scrollTop(top);
		}
		else if ($id.is(':hidden')){
			$btn.removeClass('is_expanded').attr('aria-expanded','false');
		}
	},

	tooltipLabel: function(){
		/*
		$('.btn_tooltip').each(function(){
			var title = $(this).attr('title');
			//title = title.replace('팝업열기', '툴팁보기');
			$(this).attr('title', title);
		});
		*/
		$('.btn_tooltip').parent('label').each(function(){
			$(this).after($(this).find('.btn_tooltip'));
		});
	},

	gageCustom: {
		isEvent: false,
		stick: false,
		eventTimer: null,
		isStart: null,
		isEnd: null,
		init: function(){
			var self = this;
			var $gageWrap = $('.gage_wrap');
			if ($gageWrap.length){
				$gageWrap.each(function(i){
					var message;
					var title = $gageWrap.data('title');
					var id = "keyTooltip" +i;
					if ($(this).hasClass('single')) { 
						message = title +' 조절바를 숫자키 1부터 0(10)까지 이동거리를 설정할 수 있습니다.';
					}
					if ($(this).hasClass('multi')) { 
						message = title +' 조절바는 스탭 단위로 이동합니다.';
						$(this).attr({'data-valuefrom':0, 'data-valueto':0 });
					}
					if ($(this).hasClass('is_readonly')) { 
						message = title +' 조절바는 읽기전용이므로 제어할 수 없습니다.';
					}
					if ($(this).find('.key_tooltip').length == 0){
						$(this).prepend('<div class="key_tooltip" id="'+id+'" tabindex="0" role="tooltip">'+message+'</div>');
					}
					$(this).attr('aria-describedby', id);
				});
				self.event($gageWrap.not('.is_readonly'));
				$gageWrap.each(function(){ 
					self.reset($(this));
				});
				$(window).on('resize.pub', function(){
					$gageWrap.each(function(){ self.reset($(this)) });
				})
			}
		},
		event: function($gageWrap){
			var self = this;
			var page_s;
			var page_e;
			var pos_e;
			var $gageWrap;
			var $btn;
			var isTarget = 'start';
			var keyUnit;
			var keyDirection;
			$gageWrap.find('.gage_bar').on('click.pub', function(e){
				var $this = $(this);
				$gageWrap = $this.closest('.gage_wrap');
				if ($gageWrap.hasClass('single')){
					self.action($gageWrap, e.offsetX, 'start', 'click');
				} else if ($gageWrap.hasClass('multi')){
					if (isTarget == 'start') { 
						self.action($gageWrap, e.offsetX, 'start', 'click'); isTarget = 'end';
					} else { 
						var end_x = $gageWrap.find('.gage_bar').width() - e.offsetX;
						self.action($gageWrap, end_x, 'end', 'click'); isTarget = 'start'; 
					}
				}
				if ($gageWrap.is('[data-sync]')){ 
					var id = '#'+$gageWrap.attr('[data-sync]');
					$(id).trigger('focusout');
				 }
			})
			$gageWrap.find('.circle_btn').on('touchstart.gageCustom mousedown.gageCustom', function(e){
				e.stopPropagation();
				$btn = $(this);
				$gageWrap = $(this).closest('.gage_wrap');
				if (e.type == 'touchstart') { page_s = e.touches[0].pageX }
				else if (e.type == 'mousedown'){ page_s = e.pageX }
				self.isEvent = true;
				if ($gageWrap.is('[data-sync]')){ 
					var id = '#'+$gageWrap.attr('[data-sync]');
					$btn.focus();
				 }
			});
			$(document).off('touchmove.gageCustom mousemove.gageCustom').on('touchmove.gageCustom mousemove.gageCustom', function(e){
				if (self.isEvent == true){
					e.stopPropagation();
					if ($btn && $btn.hasClass('start')) {
						if (e.type == 'touchmove') { var ePageX = e.touches[0].pageX }
						else if (e.type == 'mousemove'){ var ePageX = e.pageX } 
						page_e = ePageX - $gageWrap.find('.gage_bar').offset().left;
						self.action($gageWrap, page_e, 'start', 'move');
					}
					else if ($btn && $btn.hasClass('end')) {
						if (e.type == 'touchmove') { var ePageX = e.touches[0].pageX }
						else if (e.type == 'mousemove'){ var ePageX = e.pageX } 
						page_e = $gageWrap.find('.gage_bar').width() + $gageWrap.find('.gage_bar').offset().left - ePageX;
						self.action($gageWrap, page_e, 'end', 'move');
					}
				}
			});
			$(document).off('touchend.gageCustom mouseleave.gageCustom mouseup.gageCustom').on('touchend.gageCustom mouseleave.gageCustom mouseup.gageCustom' , function(e){
				e.stopPropagation();
				self.isEvent = false;
			});
			$gageWrap.find('.circle_btn').on('touchend.pub mouseup.pub', function(e){
				$(document).off('keyup.gageCustom');
				e.stopPropagation();
				self.isEvent = false;
			});
			$(document).off('focusin.gageCustom').on('focusin.gageCustom', '.circle_btn', function(e){
				e.stopPropagation();
				self.isEvent = true;
				var $this = $(this);
				//console.log(this);
				var $gageWrap = $this.closest('.gage_wrap');
				if ($gageWrap.hasClass('single')){ keyUnit = 10 }
				else if ($gageWrap.hasClass('multi')){ keyUnit = $gageWrap.find('.gage_bar').width() / (Number($gageWrap.data('steps')) - 1); }
				//console.log(keyUnit);
				keyTarget = $gageWrap;
				page_e = $this.offset().left - $gageWrap.find('.gage_bar').offset().left + 15;
				if ($this.hasClass('start')) { keyDirection = 'start' }
				if ($this.hasClass('end')) { keyDirection = 'end'; page_e = page_e - $gageWrap.find('.gage_bar').width(); console.log(page_s);}
				//console.log(page_s);
				
				// var setTimeKey;
				// var keyTooltip = {
				// 	enable: function($gageWrap){ $gageWrap.find('.key_tooltip').addClass('is_focus') },
				// 	disable: function($gageWrap){ $gageWrap.find('.key_tooltip').removeClass('is_focus') }
				// }

				$this.off('focusout.gageCustom').on('focusout.gageCustom', function(e){
					$(document).off('keydown.gageCustom');
					// setTimeKey = setTimeout(function(){
					// 	keyTooltip.disable($gageWrap);
					// },300);
				});
				
				$this.off('keydown.gageCustom').on('keydown.gageCustom', function(e){
					self.isEvent = false;
					if (keyTarget && keyTarget.hasClass('single')){
						//키보드 단위설정
						if (e.keyCode >= 49 && e.keyCode <= 57){ keyUnit = e.keyCode - 48 }
						else if (e.keyCode == 48){ keyUnit = 10 }
						if (e.keyCode == 37 && self.isStart != 'min') {
							page_e = page_e - keyUnit;
							self.action($gageWrap, page_e, keyDirection, 'move');
							//console.log(self.isStart);
							//keyTooltip.enable($gageWrap);
						}
						if (e.keyCode == 39 && self.isStart != 'max') {
							page_e = page_e + keyUnit;
							self.action($gageWrap, page_e, keyDirection, 'move');
							//keyTooltip.enable($gageWrap);
						}
					} else if (keyTarget && keyTarget.hasClass('multi')){
						if (e.keyCode == 37 && self.isStart != 'min' && $(this).hasClass('start')) { page_e = page_e - keyUnit }
						if (e.keyCode == 39 && self.isStart != 'max' && $(this).hasClass('start')) { page_e = page_e + keyUnit }
						if (e.keyCode == 37 && self.isStart != 'max' && $(this).hasClass('end')) { page_e = page_e + keyUnit }
						if (e.keyCode == 39 && self.isStart != 'min' && $(this).hasClass('end')) { page_e = page_e - keyUnit }
						self.action($gageWrap, page_e, keyDirection, 'move');
						//clearTimeout(setTimeKey);
					}
					//console.log(self.isStart, self.isEnd);
				});
			});
		},
		reset: function($gageWrap, mode){
			var $gageWrap = $gageWrap;
			var $gageBar = $gageWrap.find('.gage_bar');
			var $bar = $gageBar.find('.bar');
			var $btn = $gageWrap.find('.circle_btn');
			var strTitle = $gageWrap.attr('data-title');
			var strNowVal = $gageWrap.attr('aria-valuenow');
			var strMinVal = $gageWrap.attr('aria-valuemin');
			var strMaxVal = $gageWrap.attr('aria-valuemax');
			
			if ($gageWrap.hasClass('single')){
				var per = parseInt($gageWrap.attr('data-pervalue'));
				var px = parseInt(($gageBar.outerWidth()/100) * per);
				if (mode != 'action'){
					$bar.css({'transition':'none', 'transform':'translateX('+ per +'%)'});
					$btn.css({'transition':'none', 'transform':'translateX('+ px +'px)'});
				}
				$btn.attr({'title':strTitle+' 최대 '+strMaxVal+'% 중 '+strNowVal+'%'});
				$gageWrap.attr({'title':strTitle+' 최대 '+strMaxVal+'% 중 '+strNowVal+'%'});
			}
			if ($gageWrap.hasClass('multi')){
				var fromPer = parseInt($gageWrap.attr('data-valuefrom'));
				var toPer = parseInt($gageWrap.attr('data-valueto'));
				var fromPx = parseInt(($gageBar.outerWidth()/100) * fromPer);
				var toPx = parseInt(($gageBar.outerWidth()/100) * toPer);
				var startVal = 0;
				var endVal = 4;
				var unit_s = '원';
				var unit_e = '원';
				var stepValueSplit = $gageWrap.attr('data-step-value');
				if ($gageWrap.is('[data-step-start]')){ startVal = parseInt($gageWrap.attr('data-step-start')) }
				if ($gageWrap.is('[data-step-end]')){ endVal = parseInt($gageWrap.attr('data-step-end')) }
				if (endVal == parseInt($gageWrap.attr('data-steps')) - 1){ unit_e = '원 초과' }
				stepValueSplit = stepValueSplit.split(',');
				$btn.filter('.start').attr({'title':strTitle+' '+ $gageWrap.find('.gage_text>span').eq(startVal).text()});
				$btn.filter('.end').attr({'title':strTitle+' '+ $gageWrap.find('.gage_text>span').eq(endVal).text()});
				$gageWrap.attr({'title':strTitle + ' ' + strMinVal+unit_s+' 부터 '+strMaxVal+unit_e+' 까지 선택할 수 있습니다.' });
				if (mode != 'action'){
					$bar.css({'transition':'none', 'left': fromPx +'px', 'right': toPx +'px'});
					$btn.filter('.start').css({'transition':'none', 'transform':'translateX('+ fromPx +'px)'})
					$btn.filter('.end').css({'transition':'none', 'transform':'translateX('+ (toPx * -1) +'px)'})
				}
			}
		},
		action: function($gageWrap, posX, target, events, perVal){
			//console.log(posX);
			var self = this;
			var $gageBar = $gageWrap.find('.gage_bar');
			var $bar = $gageBar.find('.bar');
			var $rangeSingle = $gageWrap.not('.is_readonly').filter('.single').find('.range'); 
			var $rangeStart = $gageWrap.filter('.multi').find('.range.start');
			var $rangeEnd = $gageWrap.filter('.multi').find('.range.end');
			var $btn = $gageWrap.find('.circle_btn');
			var $maxValue = parseInt($gageWrap.attr('aria-valuemax'));
			var per = parseInt(Math.round((100/$gageBar.outerWidth()) * posX));
			var perGap = parseInt((100/$gageBar.outerWidth()) * $btn.outerWidth());
			var value = per;
			var minValue = parseInt($gageWrap.attr('aria-valuemin'));
			var step = parseInt($gageWrap.attr('data-steps'));
			var stepPer = 100/(step-1);
			var stepValueSplit = $gageWrap.attr('data-step-value');
			var minLimit = 0;
			var stepValue;
			var dataFunc;
			var px;

			// 기본범위 범위조정
			self.isStart = 'now';
			if (per < 0) { per = 0; value = 0; self.isStart = 'min';}
			if (per > 100) { per = 100; value = 100; self.isStart = 'max';}

			// 최소값 조정 (0보다 클때)
			if ($gageWrap.is('[data-min-id]') == true){ minLimit = $('#'+$gageWrap.attr('data-min-id')).val();}
			if (minValue < minLimit) { minValue = minLimit;}
			if (minValue > 0) {
				if (per < minValue || value < minValue) { per = minValue; value = minValue }
			}
			
			// 최종값 적용
			if ($gageWrap.hasClass('single')){
				if (value <= minLimit){ self.isStart = 'min'; }
				px = parseInt(($gageBar.outerWidth()/100) * per);
				// 스타일 적용
				if (events == 'click'){
					$bar.css({'transition':'all 0.3s ease', 'transform':'translateX('+ per +'%)'});
					$btn.css({'transition':'all 0.3s ease', 'transform':'translateX('+ px +'px)'});
				} else {
					$bar.css({'transition':'none', 'transform':'translateX('+ per +'%)'});
					$btn.css({'transition':'none', 'transform':'translateX('+ px +'px)'});
				}

				if (typeof(perVal) == 'number'){ value = perVal; per = perVal }
				$gageWrap.not('.is_readonly').attr({'aria-valuenow':value});
				$gageWrap.attr('data-pervalue', per);
				$rangeSingle.val(value);
				self.reset($gageWrap.not('.is_readonly'), 'action');
			}
			if ($gageWrap.hasClass('multi')){
				// 이동구간 설정
				if (target == 'start' && per > 100 - parseInt($gageWrap.attr('data-valueto')) - perGap) {
					value = 100 - parseInt($gageWrap.attr('data-valueto')) - perGap;
					value = per = 100 - parseInt($gageWrap.attr('data-valueto')) - perGap;
				} 
				else if (target == 'end' && per > 100 - parseInt($gageWrap.attr('data-valuefrom')) - perGap) {
					value = per = 100 - parseInt($gageWrap.attr('data-valuefrom')) - perGap;
				}
				// 스탭 설정
				if (typeof(step) == 'number'){					
					stepValueSplit = stepValueSplit.split(',');
					if ($gageWrap.is('[data-step-end]') == false){ $gageWrap.attr('data-step-end', '4') }
					for (var i = 0 ; i < step ; i++) {
						if (per > i * stepPer - (stepPer/2) && per < i * stepPer + (stepPer/2)) {
							value = per = i * stepPer;
							if (target == 'start' && $gageWrap.attr('data-evented') != 'start')  {
								//console.log(target);
								stepValue = stepValueSplit[i];
								$gageWrap.attr('data-step-start', i);
								value = (i) * stepPer;
								per = (i) * stepPer;
								if (i == 0){ self.isStart = 'min'; }
								if (i == step - 1){ self.isStart = 'max'; }
							}
							else if (target == 'end' && $gageWrap.attr('data-evented') != 'end') {
								stepValue = stepValueSplit[step - i - 1]; // 역배열 Index
								$gageWrap.attr('data-step-end', step - i - 1); // 정배열 Index
								value = (i) * stepPer;
								per = (i) * stepPer; 
								if (i == 0){ self.isEnd = 'min'; }
								if (i == step - 1){ self.isEnd = 'max'; }
							}
						}
					}
				}
				// 스타일 설정
				px = parseInt(($gageBar.outerWidth()/100) * per);
				if (events == 'click' || typeof(step) == 'number'){
					if (target == 'start') {
						$bar.css({'transition':'all 0.3s ease', 'left': px +'px'});
						$btn.filter('.start').css({'transition':'all 0.3s ease', 'transform':'translateX('+ px +'px)'});
						$gageWrap.attr({'data-valuefrom':value});
						$rangeStart.val(stepValue);
						
					} else if (target == 'end') {
						$bar.css({'transition':'all 0.3s ease', 'right': px +'px'});
						$btn.filter('.end').css({'transition':'all 0.3s ease', 'transform':'translateX('+ (px * -1) +'px)'});
						$gageWrap.attr({'data-valueto':value});
						$rangeEnd.val(stepValue);
					}
				} else {
					if (target == 'start') {
						$bar.css({'transition':'none', 'left': px +'px'});
						$btn.filter('.start').css({'transition':'none', 'transform':'translateX('+ px +'px)'});
						$gageWrap.attr({'data-valuefrom':value});
						$rangeStart.val(stepValue);
					} else if (target == 'end') {
						$bar.css({'transition':'none', 'right': px +'px'});
						$btn.filter('.end').css({'transition':'none', 'transform':'translateX('+ (px * -1) +'px)'});
						$gageWrap.attr({'data-valueto':value});
						$rangeEnd.val(stepValue);
					}
				}
				self.reset($gageWrap, 'action');
			}

			// 데이터연동
			if ($gageWrap.attr('data-sync') != ''){
				var $input = $('#'+ $gageWrap.attr('data-sync'));
				if ($input.is(':focus') == false)  { $input.val(value); }
			}

			// 콜백
			if ($gageWrap.is('[data-func]') == true){
				var func = Function($gageWrap.attr('data-func')+'()');
				func();
			}

			return value;
		},
		calc: function(id, val){
			var self = this;
			var $gageWrap = $('#'+id);
			//고정값일때
			if ($gageWrap.hasClass('is_readonly')){
				var $gageBar = $gageWrap.find('.gage_bar');
				var $btn = $gageWrap.find('.circle_btn');
				var posX = ($gageBar.outerWidth()/parseInt($gageWrap.attr('aria-valuemax')) * val);
				var strTitle = $gageWrap.attr('data-title');
				var strMaxVal = $gageWrap.attr('aria-valuemax');
				var $rangeSingle = $gageWrap.filter('.single').find('.range'); 

				$gageWrap.attr({'aria-valuenow':val});
				$btn.attr({'title':strTitle+' 최대 '+strMaxVal+'회 중 '+val+'회'});
				$rangeSingle.val(val);
				self.action($gageWrap, posX, 'start');
			} 
			//퍼센트일때
			else {
				var $gageBar = $gageWrap.find('.gage_bar');
				var $btn = $gageWrap.find('.circle_btn');
				var posX = parseInt(($gageBar.outerWidth()/100) * val);
				$gageWrap.attr({'data-pervalue':val});
				self.action($gageWrap, posX, 'start', null, parseInt(val));
			}
		},
		calcPoint: function(id, val){
			var self = this;
			var $gageWrap = $('#'+id);	
		}
	},

	// 혜택보기 (기능은 개발에 있음, 접근성대응)
	benefitExpand: function(){
		$(document).off('click.benefitView').on('click.benefitView', '.myinfo_card_wrap .btn_bf_detail', function(e){
			if ($(this).closest('.benefit_detail_wrap').hasClass('on')) {
				$('em', this).empty().html('접힘');
			} else {
				$('em', this).empty().html('펼처짐');
			}
		})
	},

	// gnb swiper
	gnbSwiper: function(){
		var commSwiper = function(){
			var eleContainer = '.body_inner .gnb_navi';
			var initNum = $(eleContainer).find('.swiper-slide.current').index();
			if (initNum == -1){initNum = 0}
			if ($('.body_inner .gnb_navi .swiper-slide:visible').length && gnbComm == null && $(window).width() < 1101){
if($('#header .gnb_wrap .swiper-button-prev').length<1){
$('#gnbUl').before('<div class="swiper-button-prev" tabindex="-1" role="button" title="이전 슬라이드 보기" aria-disabled="true"></div>')
 $('#gnbUl').before('<div class="swiper-button-next" tabindex="0" role="button" title="다음 슬라이드 보기" aria-disabled="false"></div>')
}
				gnbComm = new Swiper(eleContainer+ ' .swiper-container', {
on:{
slideChange:function(){
$('.gnb_navi .swiper-slide > a').attr('aria-hidden','true').attr('tabindex','-1');
$('.gnb_navi .swiper-slide-visible > a').attr('aria-hidden','false').attr('tabindex','0');
//console.log('scrollbarDragEnd')
},
},
					slidesPerView: 'auto',
					spaceBetween: 0,
					initialSlide: initNum,
					//centeredSlides: true,
					//centeredSlidesBounds: true,
					allowTouchMove: false,
					freeMode:true,
					watchSlidesVisibility: true,
					navigation: {
						nextEl: eleContainer+' .swiper-button-next',
						prevEl: eleContainer+' .swiper-button-prev',
					}, 
					breakpoints: {
						1100: {
							allowTouchMove: true,
						}
					},

				});
$('.gnb_navi .swiper-slide > a').attr('aria-hidden','true').attr('tabindex','-1');
$('.gnb_navi .swiper-slide-visible > a').attr('aria-hidden','false').attr('tabindex','0');
			} else if ($(window).width() > 1100 && gnbComm != null) {
				gnbComm.destroy();
				gnbComm = null;
			}
// $('.gnb_navi .swiper-slide > a').attr('aria-selected','false');
// $('.gnb_navi .swiper-slide.current > a').attr('aria-selected','true');
		}

		var mainSwiper = function(){
			if ($('.main_index .main_con .gnb_navi .swiper-slide:visible').length && gnbMobile == null && $(window).width() < 1101){
				var eleContainer = '.main_index .main_con .gnb_navi';
				gnbMobile = new Swiper(eleContainer+ ' .swiper-container', {
					slidesPerView: 'auto',
					spaceBetween: 0,
					allowTouchMove: false,
					freeMode:true,
					navigation: {
						nextEl: eleContainer+' .swiper-button-next',
						prevEl: eleContainer+' .swiper-button-prev',
					}, 
					breakpoints: {
						1100: {
							allowTouchMove: true,
						}
					},
				});
			}
		}

		commSwiper();
		mainSwiper();
		$(window).off('resizeEnd.gnbSwiper scroll.gnbSwiper').on('resizeEnd.gnbSwiper scroll.gnbSwiper', function(){ commSwiper(); mainSwiper(); });
	},

	// 이벤트 전체
	eventBanner: {
		init: function(){
			var self = this;
			$('.event_mainVisual.has_swiper:visible').each(function(){ self.mainVisual() });
			$('.event_subBanner.has_swiper:visible').each(function(){ self.subBanner() });
			$('.event_subVisual.has_swiper:visible').each(function(){ self.subVisual() });
			$('.event_subTop:visible').each(function(){ self.subTop() });
			$('.event_list_swiper:visible').each(function(){ self.eventList() });
			$('.evt_detail').find('.img-sec img').each(function(){ self.rename($(this)) });
		},
		rename: function($img){
			var alt = $img.attr('alt');
			if (alt.indexOf('<br>') > -1){
				$img.attr('alt', alt.replace('<br>', ' '));
			} else if (alt.indexOf('<br />') > -1){
				$img.attr('alt', alt.replace('<br />', ' '));
			} else if (alt.indexOf('<br/>') > -1){
				$img.attr('alt', alt.replace('<br/>', ' '));
			}
		},
		bgSet: function(eleContainer, type){
			var self = this;
			var colorCode;
			var colorTarget;
			var $container = $(eleContainer);
			var $slides = $container.find('.swiper-slide');
			var $slideActive = $container.find('.swiper-slide-active');
			var idx = parseInt($slideActive.data('swiper-slide-index'));
			if ($slides.length > 1){
				colorCode = $slideActive.attr('data-color');
				colorTarget = $slideActive.attr('data-target');
			} else if ($slides.length == 1) {
				$slides.addClass('swiper-slide-active');
				colorCode = $slides.attr('data-color');
				colorTarget = $slides.attr('data-target');
				idx = 0;
			}
			$('[data-name='+ colorTarget +']').css({'background-color':colorCode});
			if (type == 'mainVisual') { 
				$('div.headerBg.bg_'+(idx+1)).addClass('is_active').siblings().removeClass('is_active');
			};
			
			if ($slideActive.find('.event_cont').hasClass('skin_light')) {
				$container.closest('.event_bnr').addClass('skin_light');
			} else {
				$container.closest('.event_bnr').removeClass('skin_light');
			}
		},
		mainVisual: function(){
			var self = this;
			var eleContainer = '.event_mainVisual.has_swiper';
			var touchSetTime = null;
			if ($(eleContainer+' .swiper-slide').length > 1){
				eventMainSwiper = new Swiper(eleContainer+' .swiper-container', {
					autoplay: { 
						delay: 4000,
						disableOnInteraction: false
					},
					effect: 'fade',
					speed: 500,
					loop: true,
					resistanceRatio: 0,
					watchSlidesVisibility: true,
					navigation: {
						nextEl: eleContainer+' .swiper-button-next',
						prevEl: eleContainer+' .swiper-button-prev',
					}, 
					pagination: {
						el: eleContainer+' .swiper-pagination',
						type: 'fraction'
					},
					on: {
						init: function(){ 
							self.bgSet(eleContainer, 'mainVisual');
							ui.swiperAccess($(eleContainer+' .swiper-container'));
						},
						slideChangeTransitionStart: function(){
							self.bgSet(eleContainer, 'mainVisual');
							$(eleContainer).addClass('is_focusin');
							ui.swiperAccess($(eleContainer+' .swiper-container'));
						},
						slideChangeTransitionEnd: function(){
							clearTimeout(touchSetTime);
							touchSetTime = setTimeout(function(){
								$(eleContainer).removeClass('is_focusin');
							}, 2000);
						}
					}
				});
				$(document).off('click.mainVisualPause').on('click.mainVisualPause', '.event_mainVisual .swiper-button-pause', function () {
					$(this).closest('.swiper-controls').addClass('is_stoped').removeClass('is_played');
					$('.event_mainVisual .swiper-button-play').focus();
					eventMainSwiper != null && eventMainSwiper.autoplay.stop();
				});
				$(document).off('click.mainVisualPlay').on('click.mainVisualPlay', '.event_mainVisual .swiper-button-play', function () {
					$(this).closest('.swiper-controls').addClass('is_played').removeClass('is_stoped');
					$('.event_mainVisual .swiper-button-pause').focus();
					eventMainSwiper != null &&  eventMainSwiper.autoplay.start();
				});
				var focusSetTime;
				$(document).off('focusin.mainVisual mouseenter.mainVisual').on('focusin.mainVisual mouseenter.mainVisual', '.event_mainVisual', function () {
					clearTimeout(focusSetTime);
					$(this).addClass('is_focusin');
				});
				$(document).off('focusout.mainVisual mouseleave.mainVisual').on('focusout.mainVisual mouseleave.mainVisual', '.event_mainVisual', function () {
					var $this = $(this);
					focusSetTime = setTimeout(function(){
						$this.removeClass('is_focusin');
					})
				});
				$(eleContainer).removeClass('no_swiper');
			} else {
				$(eleContainer).addClass('no_swiper');
				self.bgSet(eleContainer, 'mainVisual');
			}
		},
		subBanner: function(){
			var self = this;
			var eleContainer = '.event_subBanner.has_swiper';
			var bgSet = function(colorCode, colorTarget){
				$('[data-name='+ colorTarget +']').css({'background-color':colorCode});
			}
			if ($(eleContainer+' .swiper-slide').length > 1){
				var subBannerSwiper = new Swiper(eleContainer+' .swiper-container', {
					autoplay: { 
						delay: 4000,
						disableOnInteraction: false
					},
					effect: 'fade',
					speed: 500,
					loop: true,
					resistanceRatio: 0,
					watchSlidesVisibility: true,
					navigation: {
						nextEl: eleContainer+' .swiper-button-next',
						prevEl: eleContainer+' .swiper-button-prev',
					}, 
					pagination: {
						el: eleContainer+' .swiper-pagination',
						type: 'fraction'
					},
					on: {
						init: function(){ 
							self.bgSet(eleContainer, 'subPage');
							ui.swiperAccess($(eleContainer+' .swiper-container'));
						},
						slideChangeTransitionStart: function(){ 
							self.bgSet(eleContainer, 'subPage');
							ui.swiperAccess($(eleContainer+' .swiper-container'));
						},
					}

				});
				$(document).off('click.subBannerPause').on('click.subBannerPause', eleContainer+' .swiper-button-pause', function () {
					$(this).closest('.swiper-controls').addClass('is_stoped').removeClass('is_played');
					$(eleContainer+' .swiper-button-play').focus();
					console.log('stoped');
					subBannerSwiper.autoplay.stop();
				});
				$(document).off('click.subBannerPlay').on('click.subBannerPlay', eleContainer+' .swiper-button-play', function () {
					$(this).closest('.swiper-controls').addClass('is_played').removeClass('is_stoped');
					$(eleContainer+' .swiper-button-pause').focus();
					console.log('start');
					subBannerSwiper.autoplay.start();
				});
				$(eleContainer).removeClass('no_swiper');
			} else {
				self.bgSet(eleContainer, 'event_subBanner');
				$(eleContainer).addClass('no_swiper');
			}
		},
		subVisual: function(){
			var self = this;
			var eleContainer = '.event_subVisual.has_swiper';
			var bgSet = function(colorCode, colorTarget){
				$('[data-name='+ colorTarget +']').css({'background-color':colorCode});
			}
			if ($(eleContainer+' .swiper-slide').length > 1){
				var subVisualSwiper = new Swiper(eleContainer+' .swiper-container', {
					autoplay: { 
						delay: 4000,
						disableOnInteraction: false
					},
					effect: 'fade',
					speed: 500,
					loop: true,
					resistanceRatio: 0,
					watchSlidesVisibility: true,
					navigation: {
						nextEl: eleContainer+' .swiper-button-next',
						prevEl: eleContainer+' .swiper-button-prev',
					}, 
					pagination: {
						el: eleContainer+' .swiper-pagination',
						type: 'fraction'
					},
					on: {
						init: function(){ 
							self.bgSet(eleContainer, 'subPage');
							ui.swiperAccess($(eleContainer+' .swiper-container'));
						},
						slideChangeTransitionStart: function(){ 
							self.bgSet(eleContainer, 'subPage');
							ui.swiperAccess($(eleContainer+' .swiper-container'));
						},
					}

				});
				$(document).off('click.subVisualPause').on('click.subVisualPause', eleContainer+' .swiper-button-pause', function () {
					$(this).closest('.swiper-controls').addClass('is_stoped').removeClass('is_played');
					$(eleContainer+' .swiper-button-play').focus();
					subVisualSwiper.autoplay.stop();
				});
				$(document).off('click.subVisualPlay').on('click.subVisualPlay', eleContainer+' .swiper-button-play', function () {
					$(this).closest('.swiper-controls').addClass('is_played').removeClass('is_stoped');
					$(eleContainer+' .swiper-button-pause').focus();
					subVisualSwiper.autoplay.start();
				});
				$(eleContainer).removeClass('no_swiper');
			} else {
				self.bgSet(eleContainer, 'event_subBanner');
				$(eleContainer).addClass('no_swiper');
			}
		},
		subTop: function(){
			var self = this;
			if ($('.event_subTop:visible').closest('#header').length){ 
				$('body').addClass('has_eventTopBnr');
				setTimeout(function(){ if (eventTopSwiper != null) { eventTopSwiper.update(); ui.tabScrollSticky.init(); } }, 600);
			}

			$(document).off('click.eventTopBnr').on('click.eventTopBnr', '.event_subTop .event_close', function(e){
				$('body.has_eventTopBnr').removeClass('has_eventTopBnr');
				$(this).closest('.event_subTop').one('transitionend', function(){
					if ($('body').hasClass('has_eventTopBnr') == false){
						$(this).closest('.event_subTop').hide();
					}
					if ($('.tab_sticky').length){
						ui.tabScrollSticky.init();
					}
				});
			});

			var eleContainer = '.event_subTop.has_swiper';
			if ($(eleContainer+' .swiper-slide').length > 1){
				eventTopSwiper = new Swiper(eleContainer+' .swiper-container', {
					autoplay: { 
						delay: 4000,
						disableOnInteraction: false
					},
					effect: 'fade',
					speed: 500,
					loop: true,
					resistanceRatio: 0,
					watchSlidesVisibility: true,
					navigation: {
						nextEl: eleContainer+' .swiper-button-next',
						prevEl: eleContainer+' .swiper-button-prev',
					}, 
					pagination: {
						el: eleContainer+' .swiper-pagination',
						type: 'fraction'
					},
					on: {
						init: function(){ 
							self.bgSet(eleContainer, 'subTop');
							ui.swiperAccess($('.event_mainVisual .swiper-container'));
						},
						slideChangeTransitionStart: function(){ 
							self.bgSet(eleContainer, 'subTop');
							ui.swiperAccess($(eleContainer+' .swiper-container'));
						},
					}

				});
				$(document).off('click.subTopPause').on('click.subTopPause', eleContainer+' .swiper-button-pause', function () {
					$(this).closest('.swiper-controls').addClass('is_stoped').removeClass('is_played');
					$(eleContainer+' .swiper-button-play').focus();
					eventTopSwiper.autoplay.stop();
				});
				$(document).off('click.subTopPlay').on('click.subTopPlay', eleContainer+' .swiper-button-play', function () {
					$(this).closest('.swiper-controls').addClass('is_played').removeClass('is_stoped');
					$(eleContainer+' .swiper-button-pause').focus();
					eventTopSwiper.autoplay.start();
				});
				$(eleContainer).removeClass('no_swiper');
			} else {
				self.bgSet(eleContainer, 'event_subTop');
				$(eleContainer).addClass('no_swiper');
			}
		},
		allMenu: function(){
			/* 스와이프 안함
			var eleContainer = '.event_allmenu';
			if ($(eleContainer+' .swiper-slide').length > 1) {
				var eventSwiper = new Swiper(eleContainer+' .swiper-container', {
					autoplay: { delay: 4000 },
					//effect: 'fade',
					speed: 500,
					navigation: {
						nextEl: eleContainer+' .swiper-button-next',
						prevEl: eleContainer+' .swiper-button-prev',
					}, 
					pagination: {
						el: eleContainer+' .swiper-pagination',
						type: 'fraction'
					},
					on: {
						init: function(){ 
							ui.swiperAccess($(eleContainer+' .swiper-container'));
						},
						slideChangeTransitionStart: function(){ 
							ui.swiperAccess($(eleContainer+' .swiper-container'));
						},
					}
				});
				$(eleContainer+' .swiper-button-pause').click(function () {
					eventSwiper.autoplay.stop();
				});
			} else {
				$(eleContainer).addClass('no_swiper');
			}
			*/
		},
		eventList: function(){
			var action = function(){
				var eleContainer = '.event_list_swiper';
				if ($(window).width() < 1101 && $('.event_list_swiper .swiper-slide').length > 1 && eventListSwiper == null) {
					eventListSwiper = new Swiper(eleContainer+' .swiper-container', {
						slidesPerView: 'auto',
						//freeMode: true,
						//spaceBetween: 20,
						watchSlidesVisibility: true,
						navigation: {
							nextEl: eleContainer+' .swiper-button-next',
							prevEl: eleContainer+' .swiper-button-prev',
						},
						on: {
							init: function(){ 
								ui.swiperAccess($(eleContainer+' .swiper-container'));
							},
							slideChangeTransitionStart: function(){ 
								ui.swiperAccess($(eleContainer+' .swiper-container'));
							},
						},
					});
					$(eleContainer).removeClass('no_swiper');
				} else if ($(window).width() > 1100 && eventListSwiper != null){
					eventListSwiper.destroy();
					$(eleContainer).addClass('no_swiper');
					eventListSwiper = null;
				} else if ($(window).width() < 1101 && $('.event_list_swiper .swiper-slide').length < 2 && eventListSwiper == null){
					$(eleContainer).addClass('no_swiper');
				}
			}
			action();
			$(window).off('resize.eventList').on('resize.eventList', function(){ action() });
		},
	},

	wonAnimate: {
		init: function(){
			var self = this;
			$('.js_animate_won').not('.is_animated').each(function(){
				var $this = $(this);
				var lens = $this.text().length;
				var text = $this.text();
				var wid = $this.outerWidth();
				var hei = $this.outerHeight();
				var type = 'num';
				var htmlNum = '';
				$this.css({ width: wid, height: hei }).attr({'role':'text'});	
				for (var i = 0; i < lens; i++) {
					if ( parseInt($this.text()[i]) > -1 ) { 
						type = 'num';
						htmlNum = htmlNum + '<span class="txt '+ type +'" data-num="'+ $this.text()[i] +'"></span>';
					} else { 
						type = '';
						htmlNum = htmlNum + '<span class="txt '+ type +'"><i class="n" data-num="'+ $this.text()[i] +'"></i></span>';
					}
				}
				$this.html(htmlNum);
				$this.append('<span class="blind">'+ text +'</span>');
				$this.find('.num').each(function(){
					var htmlItems = '';
					for (var i = 0; i < 10; i++) {
						htmlItems = htmlItems + '<i class="n" data-num="'+ i +'"></i>';
					}
					$(this).html(htmlItems);
				});
				setTimeout(function(){
					self.action($this.find('.num'), 0);
				},500);
// 2021. 04.05 웹접근성 관련 스크린리더로 접근시 무의미한 글자로 접근 방지
				$this.find('.txt').attr({'aria-hidden':'true'});
				$(this).addClass('is_animated');
			})				
		}, 
		action: function($ele, num){
			var self = this;
			var per = parseInt($ele.eq(num).attr('data-num')) * 10;
			var dur_s = 0.5;
			var dur_m = 500;
			$ele.eq(num).attr('style', 'transition-duration:'+ dur_s +'s; transform:translateY(-'+ per +'%)');
			if ($ele.eq(num + 1).length){
				setTimeout(function(){
					self.action($ele, num + 1);
				}, 150);
			}
		}
	},
	mainPrallexInit: function(){
		var device = null;
		var sizeW = null;
		var sizeH = null;

		var resizeInit = function(){
			sizeW = $(window).width();
			sizeH = $(window).outerHeight();

			/* Pad 조건추가 */
			//if (sizeW <= 1100){
			if (sizeW <= 1023){
				ui.mainParallexAction();
			} else { 
				$('#header').removeClass('step-state1 step-state2 step-state3').removeAttr('style');
				//$('#header').removeAttr('style');
				scrollInit();
			}
		}

		var scrollInit = function(){
			/* Pad 조건추가 */
			//if (sizeW <= 1100){
			if (sizeW <= 1023){ 
				ui.mainParallexAction();
			} else {
				if ($(window).scrollTop() > 0){
					$('#header').addClass('is_scrolled');
				} else {
					if (!$('.gnbSub_wrap').hasClass('is_visible')){
						$('#header').removeClass('is_scrolled');
					}
				}
			}
		}

		var resetInit = function(){
			$(window).scrollTop(0);
			$('#header').removeClass('step-state1 step-state2 step-state3 is_scrolled').removeAttr('style');
		}

		resizeInit(); scrollInit();
		//var setTimeResize = null, setTimeChange = null;
		$(window).off('resizeEnd.pubMain').on('resizeEnd.pubMain', function(){ resizeInit(); });
		$(window).off('orientationchange.pubMain').on('orientationchange.pubMain', function(){ resetInit(); });
		//$(document).off('scroll.pubMain').on('scroll.pubMain', function () { if ($('body').hasClass('pop_open') == false) { scrollInit() } });
		$(document).off('scroll.pubMain').on('scroll.pubMain', function () { scrollInit() });
	},
	mainParallexAction: function(){
/*
		var banFlag = $('body').hasClass('has_eventTopBnr')&&!$('body').hasClass('app_shfan');
		var minPos = 0; // 최소값
		var maxHei = $('body').hasClass('app_shfan')?406:466; // 최대길이
		var minHei = banFlag == true?210:150; // 최대길이
		var gapHei = 40; // Step2 에서 GNB만큼 이동하는 위치
		var step1 = 140; // 검색을 숨김
		var step2 = 240; // GNB를 숨김
		var step3 = 280; // 헤더를 숨김
		var $header = $('#header');
		var scrTop = $(window).scrollTop();
		// Area Styles - Height, Padding
		if ( scrTop <= maxHei - minHei && scrTop > 0){
			$('.main_index #header').css({'height':maxHei - scrTop});
		} else if (scrTop > maxHei - minHei){
			$('.main_index #header').css({'height':minHei});
		} else if (scrTop == 0){
			$('.main_index #header').removeAttr('style');
		}

		// Step1 - 검색활성 True/False
		if ( scrTop > step1 ){ 
			$header.addClass('step-state1');
			$('.util_mobile .search_btn').removeAttr('tabindex aria-hidden');
			ui.commonAccess.disable($('.main_index .main_con .main_search'), 'mainParallax');
		} else {
			$header.removeClass('step-state1');
			$('.util_mobile .search_btn').attr({'tabindex':'-1', 'aria-hidden':'true'});
			ui.commonAccess.enable($('.main_index .main_con .main_search'), 'mainParallax');
		}

		// Step2 - GNB전환 True/False
		if ( scrTop > step2 ) {
			$header.addClass('step-state2');
			ui.commonAccess.disable($('.main_index .header_body'), 'mainParallax');
		} else {
			$header.removeClass('step-state2');
			ui.commonAccess.enable($('.main_index .header_body'), 'mainParallax');
		}

		// Step3 - LOGO활성 True/False
		if ( scrTop > step3 ) {
			$header.addClass('step-state3');
		} else {
			$header.removeClass('step-state3');
		}
		//console.log(scrTop);
*/
	},
	mainIndex: function(){
		var maincardSwiper = null;
		var financeSwiper = null;
		var swipeAction = function(){
			if ($('.main_card_wrap .swiper-slide').length > 1&& $('#mainCardWrap1').length < 1) {
				$('.main_card_wrap .swiper-slide p').attr('role','text');
				maincardSwiper = new Swiper('.main_card_wrap .swiper-container', {
					slidesPerView: 5,
					freeMode: true,
					watchSlidesVisibility: true,
					navigation: {
						nextEl: '.main_card_wrap .nav-button-next',
						prevEl: '.main_card_wrap .nav-button-prev',
					},
					on: {
						init: function(){ 
							ui.swiperAccess($('.main_card_wrap .swiper-container'), 'auto');
						},
						slideChangeTransitionStart: function(){ 
							ui.swiperAccess($('.main_card_wrap .swiper-container'), 'auto');
						},
					},
					breakpoints: {
						960: { spaceBetween: 0, slidesPerView: 'auto' },
						961: { spaceBetween: 0, slidesPerView: 7 },
						1023: { spaceBetween: 0, slidesPerView: 7 },
						1024: { spaceBetween: 0, slidesPerView: 5 },
					}
				});
			}
			
			if ($(window).width() < 1101 && $('.main_finance_wrap .swiper-slide').length > 1 && financeSwiper == null) {
				financeSwiper = new Swiper('.main_finance_wrap .swiper-container', {
					slidesPerView: 5,
					spaceBetween: 10,
					freeMode: true,
					watchSlidesVisibility: true,
					navigation: {
						nextEl: '.main_finance_wrap .nav-button-next',
						prevEl: '.main_finance_wrap .nav-button-prev',
					},
					on: {
						init: function(){ 
							ui.swiperAccess($('.main_finance_wrap .swiper-container'), 'auto');
						},
						slideChangeTransitionStart: function(){ 
							ui.swiperAccess($('.main_finance_wrap .swiper-container'), 'auto');
						},
					},
					breakpoints: {
						480: { slidesPerView: 2.8 },
						481: { slidesPerView: 3.8 },
						768: { slidesPerView: 3.8 },
						769: { slidesPerView: 5 },
					}
				});
			} else if ($(window).width() > 1100 && financeSwiper != null){
				financeSwiper.destroy();
				financeSwiper = null;
			}
			//console.log(financeSwiper);
		}

		swipeAction();
		$(window).on('resizeEnd.mainIndex', function(){ swipeAction() });
	},
	
	cardFind_swiper: function() {
		var cardFindSwiper = null;
		var eleContainer = '.cardFind_swiper';
		if ($(eleContainer+' .swiper-slide').length > 1) {
			cardFindSwiper = new Swiper(eleContainer+'.swiper-container', {
				slidesPerView: 'auto',
				freeMode: true,
				watchSlidesVisibility: true,
				navigation: {
					nextEl: eleContainer+' .nav-button-next',
					prevEl: eleContainer+' .nav-button-prev',
				},
				on: {
					init: function(){ 
						ui.swiperAccess($(eleContainer+'.swiper-container'), 'auto');
					},
					slideChangeTransitionStart: function(){ 
						ui.swiperAccess($(eleContainer+'.swiper-container'), 'auto');
					},
				},
			});
		} else if ($(window).width() > 1100 && cardFindSwiper != null){
			cardFindSwiper.destroy();
			cardFindSwiper = null;
		}
	},

    // 캘린더 날짜 선택
    calenderDateSelect: function() {
        if ($('.ui_calendar_box').length) {
            $('.ui_calendar_box').on('click', '.cal_btn', function () {
                $(this).closest('.ui_calendar_days').find('.day_item').removeClass('cal_selected');
                $(this).parent().addClass('cal_selected');
            });
        }
    },

    // 리스트형 카드 선택 (라디오버튼)
    cardSelect: function() {
        if ($('.card_select_item.operate').length) {
            $('.card_select_item label').on('click focusin', function () {
                $(this).closest('.card_select_list').find('input').prop('checked', false);
                $(this).closest('.card_select_list').find('.card_select_item').removeClass('opened selected');
                $(this).children('input').prop('checked', true);
                $(this).closest('.card_select_item').addClass('opened selected');
            });
        } else if ($('.card_select_item').length) {
            $('.card_select_item').addClass('opened');

            $('.card_select_item label').on('click focusin', function () {
                $(this).closest('.card_select_list').find('.card_select_item').removeClass('selected');
                $(this).closest('.card_select_item').addClass('selected');
            });
        }
	},

	popOverInit: function(){
		$(document).off('click.popOver focusin.popOver').on('click.popOver focusin.popOver', function(e){
			if ($('.popover_wrap.is_active').length ) {
				//console.log(e.target);
				var id = $('.popover_wrap.is_active').attr('id');
				if ($('.popover_wrap').has(e.target).length === 0 && $(e.target).is('[aria-controls='+id+']') == false && $('[aria-controls='+id+']').has(e.target).length === 0) {
					ui.popOverClose(id);
				}
			}
		})
		$(window).off('resize.popOverInit').on('resize.popOverInit', function(){
			ui.popOverReset();
		})
	},

	textTipAlert: function(){
		/* 2023 접근성 수정 - 오류 메시지만 포커스 이동 */
		$('.text_tip.error').each(function(){ $(this).attr('tabindex','0').removeAttr('role') });
		// 기존소스 주석 $('.text_tip').each(function(){ $(this).attr('tabindex','0').removeAttr('role') });
	},

	popOverReset: function(){
		var $eleActive = $('.popover_wrap.is_active');
		if ($eleActive.length){
			// Elements
			var id = $eleActive.attr('id');
			var $id = $('#'+id);
			var $btn = $('[aria-controls='+ id.replace('#','') +']');
			var $cont = $eleActive.find('.popover_cont');
			var foot_h = 0; 
			if ($id.find('.popover_foot').length) { foot_h = $id.find('.popover_foot').outerHeight() }
			var cont_h = $id.find('.popover').outerHeight() - foot_h - ($id.find('.popover').outerHeight() - $id.find('.popover').height());
			$cont.css({'height':cont_h});
			if ($('body').hasClass('pc')){ $cont.mCustomScrollbar('update') } 

			//Position
			var pos_t = $btn.offset().top + $btn.outerHeight();
			var pos_l;
			if ($(window).width() > 1101) {
				pos_l = $btn.offset().left + parseInt($btn.outerWidth() / 2) - parseInt($id.outerWidth() / 2);
			} else {
				pos_l = ($(window).width() / 2) - ($id.outerWidth() / 2);
			}
			$id.css({left:pos_l, top:pos_t});

			//Scrolling
		}
	},
	popOverOpen: function(id, btn, title) {
		var setTime;
		var $id = $(id);
		var $btn = $(btn);

		if ($id.is(':hidden')) {
			$id.show();
			clearTimeout(setTime);
			setTime = setTimeout(function(){ $id.addClass('is_active'); ui.popOverReset(); });
			$btn.addClass('is_active');
			if ($('body').hasClass('pc')) { $id.find('.popover_cont').mCustomScrollbar({scrollInertia:200}) }			
			$id.one('transitionend -webkit-transitionend', function(){
				if ($id.hasClass('is_active')) {
					$id.prepend('<div class="popover_focus" role="text" tabindex="0">'+ title +' 레이어 팝업</div>');
					$id.find('.popover_focus').focus();
				}
			})
		}
	},
	popOverClose: function(id) {
		var setTime;
		var $id = $('#'+id);
		var $focus = $('.is_active[aria-controls=' + id + ']');

		clearTimeout(setTime);
		$id.removeClass('is_active');
		$id.one('transitionend -webkit-transitionend', function(){
			if (!$id.hasClass('is_active')) {
				$id.hide();
				$focus.removeClass('is_active').focus();
			}
		})
	},

	// 스크롤에 반응하는 스티키
	stickyScroll: {
		init: function(){
			var self = this;
			// 혜택 서비스신청 버튼 (/html/guide/pages02.html)
			$('.sticky_scroll.m_fixed').not('.is_scrolled').each(function(i){
				var $this = $(this);
				// 모바일용이고 모바일 일때
				if ($this.closest('.set_mob').length && $('body').hasClass('mobile') == true) {
					$this.css({'transition':'transform 0.3s ease'});
					self.event($(this)); 
					self.action($(this));
					$(this).addClass('is_scrolled');
				}
			});
		},
		event: function($this){
			var self = this;
			$(window).on('resize scroll', function(){ self.action($this); });
		},
		action: function($this){
			var eleTarget = $this.attr('data-target');
			var $eleTarget = $('[data-name="'+ eleTarget +'"]').filter(':visible');
			if ($eleTarget.length == 0){ $this.css({'transform':'translateY(100%)'}); return }
			var pos_scr = $(window).scrollTop();
			var pos_cen = $eleTarget.offset().top + ($eleTarget.outerHeight()/2) - $('#header').outerHeight();
			var pos_show = '0';
			var pos_hide = '100%';
			var pos_val;

			var elePosition = function(value){ 
				$this.css({'transform':'translateY('+ value +')'});
			}

			if (pos_scr > pos_cen) { 
				pos_val = pos_show; 
				elePosition(pos_val);
			} else { 
				pos_val = pos_hide; 
				elePosition(pos_val);
			}
		},
	},
	// 스파이스크롤
	spyScroll: function() {
        $('[data-role=spyScroll]').off('click').on('click', function (e) {
            e.preventDefault();
            //기본값
            var $ele = $(this);
            var $eleScroll = $($(this).attr('data-scroll')); //대상 스크롤
            var $eleTarget = $($(this).attr('href')); //클릭한 아이디
            var minusGap = $eleScroll.offset().top;
			var gapHeader = 0;
            var gap = 0;
            var eleTop = 0; //엘리먼트 위치값

			$ele.addClass('is_scrolled');
			//갭을 주는 경우
			if ($(this).is('[data-gap]') == true){
				gap = $(this).attr('data-gap');
			}
            // Body 아닌경우, scroll.top 위치값을 더해준다. (스크롤에 관계없에 동일한 위치값을 가져옴.)
            if ($eleScroll.is('body') == false) { eleTop = $eleTarget.offset().top + $eleScroll.scrollTop(); }
            // Body인경우, 위치값만 적용한다.
            else { eleTop = $eleTarget.offset().top; $eleScroll = $('body, html'); gapHeader = $('#header').outerHeight(); }
            //동작
            var scrTop = eleTop - parseInt(gap) - minusGap - gapHeader;
            $eleScroll.stop().animate({ 'scrollTop': scrTop }, 300, function(){ $ele.addClass('is_scrolled') });
        })
    },

	spyScrollGlobal: {
		$ele: null,
		init: function(){
			this.$ele = $('#container a, #container button, #container input').not('.js_autoComplete');
 			this.event(this.$ele);
		},
		event: function(obj){
			var self = this;
			obj.off('focusin.spyScrollGlobal').on('focusin.spyScrollGlobal', function(e){ 
				//모바일 환경 감지 후 focusin 이벤트 무시
				if (self.isMobile()) {
					return; // iOS 등 모바일 환경일 경우 실행하지 않음
				}
				self.scrolled($(this));
			});
		},
		scrolled: function(obj){
			var gap_t = 30;
			var tar_t = $('#header').height() + gap_t;
			var obj_t = obj.offset().top;
			var scr_h = $(window).scrollTop();
			var sum_t = obj_t - tar_t;
			if ($('#wrap').hasClass('main_index') && $(window).width() > 1100){ tar_t = 130 } //PC고정헤더
			else if ($('#wrap').hasClass('main_index') && $(window).width() <= 1100){ tar_t = 150 } //Mobile고정헤더
			if (obj_t - scr_h < tar_t){
				$('html, body').stop().animate({'scrollTop': sum_t});
			}
		},
		isMobile:function() {
			//모바일 디바이스 감지
			return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
		}
	},

	selectOption: function(id, selector){
		$(selector).removeClass('current');
		$(id).addClass('current');
		ui.selectScroll();
	},

	searchInput: function(){
		var update = function($eleInput){
			$eleInput.each(function(){
				var $eleWrap = $(this).closest('.srch_input_wrap');
				if ($(this).val() != '') { $eleWrap.addClass('is_valued');}
				else { $eleWrap.removeClass('is_valued');}
			})
		}
		update($('.srch_input_wrap input'));
		$(document).off('keyup.searchInput').on('keyup.searchInput', '.srch_input_wrap input', function(){
			update($(this));
		})

		if ($('body').hasClass('pc')){ 
			$('.main_search .input_wrap label input').attr('type', 'text');
			$('.srch_input_wrap input').attr('type', 'text');
		}	
	},

	selectScroll: function(){
		$('.pop_wrap:visible .select_wrap:visible .list_selectbox').each(function(){
			var $popWrap = $('.pop_wrap:visible');
			var $popCont = $popWrap.find('.pop_cont');
			var $selectBox = $(this);
			var action = function(){
				var pop_top = $popCont.offset().top;
				var pop_hei = $popCont.outerHeight();
				$popWrap.find('.guide_sec:visible').each(function(i){
					var sec_top = $(this).offset().top;
					var sec_hei = $popCont.children().outerHeight();
					var sec_gap = 0;
					var id = null;
					if ($popWrap.find('.tab_cont').length) {
						sec_gap = parseInt($popWrap.find('.tab_cont:visible').find('.guide_sec').last().css('margin-bottom'));
					} else {
						sec_gap = parseInt($popWrap.find('.guide_sec').last().find('.marker_dot').css('margin-bottom'));
					}
					var sec_scr = sec_hei + sec_gap - $popCont.height() - 5;

					if (pop_top + (pop_hei/4) > sec_top){
						id = $(this).attr('id');
						var text = $selectBox.find('[href="#'+id+'"]').text();
						$selectBox.prev('.btn_select').text(text);
					} 
					else if ($popCont.scrollTop() == 0){
						if ($popWrap.find('.tab_cont').length) {
							id = $popWrap.find('.tab_cont:visible').find('.guide_sec').eq(0).attr('id');
						} else {
							id = $popWrap.find('.guide_sec').eq(0).attr('id');
						}
						var text = $selectBox.find('[href="#'+id+'"]').text();
						$selectBox.prev('.btn_select').text(text);
					} else if ($popCont.scrollTop() > sec_scr){
						if ($popWrap.find('.tab_cont').length) {
							id = $popWrap.find('.tab_cont:visible').find('.guide_sec').last().attr('id');
						} else {
							id = $popWrap.find('.guide_sec').last().attr('id');
						}
						var text = $selectBox.find('[href="#'+id+'"]').text();
						$selectBox.prev('.btn_select').text(text);
					}
				})
			}
			$('.pop_wrap:visible .pop_cont').off('scroll.selectScroll').on('scroll.selectScroll', function(){ action(); });
			$(window).off('resize.selectScroll').on('resize.selectScroll', function(){ action(); });
		})
	},

	// 프로그레스 스크롤
    progressScroll: function() {
        var $eleProgress = $('.progress_bar');
        var maxScroll;
        var curScroll;
        var perScroll;
        $eleProgress.each(function () {
            if ($(this).is('[data-scroll=".pop_cont"]') == true) {
                $eleScroll = $($(this).attr('data-scroll'));
                $eleScroll.on('scroll', function () {
                    maxScroll = parseInt($eleScroll.css('padding-top')) + parseInt($eleScroll.css('padding-bottom')) + $eleScroll.children().outerHeight() - $eleScroll.height();
                    curScroll = $(this).scrollTop();
                    perScroll = (curScroll / maxScroll) * 100;
                    if (perScroll > 98) { perScroll = 100 }
                    $eleProgress.find('.bar').css('width', perScroll + '%').text(perScroll + '%');
                })
            }
        })
	},

	autoComplete: {
		init: function(){
			$('input').not('.set_AutoComplete').each(function(){
				$(this).addClass('set_AutoComplete').attr({'autocomplete':'off'});
			})
		},
		event: function(){
			var self = this;
			var focusActive = function($this){
				//var $this = $(this);
				var selectId = $this.attr("id");
				
				if ( selectId == "query" || selectId == "queryMob") {
		    		totalSrchId = "totalQuickSrch";
		    	} else {
		    		totalSrchId = "quickSrch";
		    	}
	
				$('.quickSrch_inner').addClass('is_focused');
				
				//서브공통인경우
				if ($('.quickSrch_wrap').hasClass('is_visible')) {
					// ui.quickSrch.open() 으로 여는 경우
					self.open();
					self.reset($this);
				} else {
					// opener로 quickSrch 여는 경우
					var opener = function(){
						ui.quickSrch.open($this, function(){
							$('.autoComplete_wrap').addClass('is_visible');
							$("#" + totalSrchId).addClass('is_acOnly');
							self.reset($this);
						});
					}
					//if ($(this).closest('.totalSrch_wrap').length || $(this).closest('.main_search').length && $(window).width() > 1100 || $(window).outerHeight() > 1365){
					if ($(this).closest('.totalSrch_wrap').length || $(this).closest('.main_search').length && $(window).width() > 1100){
						$('html, body').stop().animate({'scrollTop':0}, 200, function(){ opener() });
					} else {
						opener();
					}
				}
				
				if ( selectId == "mainSearch_mo" ) {
					// 2023 접근성 - 메인 모바일 검색팝업 열릴 때 input으로 포커스 - quickSrch.open 에서 보내고 있기에 주석처리
					// $('#totalSrchQuck.js_autoComplete').focus();
				} else if ( selectId == "query" ) {
					var userAgent = navigator.userAgent;
					if ( userAgent.indexOf('Android') > -1 || userAgent.indexOf('iPhone') > -1 ) {
						$('#queryMob.js_autoComplete').focus();
					}
				}
			}
			$(document).off('focus.autoComplete').on('focus.autoComplete', '.js_autoComplete', function(e){
				if ($('body').hasClass('pc') && $(this).data('focusReturn') != true){ 
					focusActive($(this));
				} else if ($('body').hasClass('pc') && $(this).data('focusReturn') == true){ 
					$(this).data('focusReturn', false);
				}
			})
			$(document).off('click.autoComplete').on('click.autoComplete', '.js_autoComplete', function(e){
				focusActive($(this));
			})

			$(document).off('click.autoCompleteOpt').on('click.autoCompleteOpt', '.ac_option_left button', function(e){
				$(this).closest('.autoComplete_wrap').data('focused', true);
			})
			$(document).off('focusin.autoComplete').on('focusin.autoComplete', function(e){
				if ($('.autoComplete_wrap').hasClass('is_visible') && $('body').hasClass('pc')) {
					if (e.type == 'focusin' && !$('.autoComplete_wrap.is_visible').data('focused') && $('.quickSrch_inner').has(e.target).length === 0 && $(e.target).hasClass('js_autoComplete') == false && $(e.target).hasClass('search_btn') == false && $(e.target).hasClass('btn_clear') == false){
						$('.quickSrch_inner').removeClass('is_focused');
						//self.close(); //류인규20210805
					}
				}
			});
			$(window).off('resize.autoComplete').on('resize.autoComplete', function(){
				if ($('.autoComplete_wrap.is_visible').length) {
					var $ele = $('.js_autoComplete');
					if ($('.totalSrch_wrap').length) { $ele = $('.totalSrch_wrap .js_autoComplete') }
					if ($('.main_search').length) { $ele = $('.main_search .js_autoComplete') }
					self.reset($ele);
				}
			})
		},
		reset: function($this){
			//if ($(window).outerWidth() > 1100 || $(window).outerHeight() > 1365) {
			if ($(window).outerWidth() > 1100) {
				//console.log(totalSrchId);
				if (totalSrchId == "totalQuickSrch") {
					var posL = 0 //$this.offset().left - $(".ly_inner").offset().left + 3
					,	posT = $this.parent().outerHeight()
					,	posW = $this.parent().outerWidth();
					$('#' + totalSrchId + ' .quickSrch_inner').css({ top:posT });
					
					var dimmerT = $('#' + totalSrchId + ' .quickSrch_inner').offset().top;
					$('#' + totalSrchId + ' .quickSrch_dimmer').css({top:dimmerT});
					//console.log(dimmerT);
				} else if ($('.main_index').length == 1) {
					var posL = $this.parent().offset().left
					,	posT = $this.parent().offset().top + $this.parent().outerHeight()
					,	posW = $this.parent().outerWidth();
					$('#' + totalSrchId + ' .quickSrch_inner').css({ width: posW, left:posL, top:posT }).next('.quickSrch_dimmer').css({ top:posT });
				}
			} else {
				$('#' + totalSrchId + ' .quickSrch_inner').removeAttr('style');
			}
		},
		open: function(btn){
			$('.autoComplete_wrap').addClass('is_visible');
		},
		close: function(btn){
			$('.autoComplete_wrap').removeClass('is_visible');
			if ($("#" + totalSrchId).hasClass('is_acOnly') == true) {
				ui.quickSrch.close();
			}
		},
	},

	quickSrch: {
		opener: null, //기본값정의(상황에 따라 수동으로 설정함)
		event: function(){
			var self = this;
			$(document).off('click.quickSrch').on('click.quickSrch', function(e){
				if ($("#" + totalSrchId).has(e.target).legnth === 0 && $('.main_search').has(e.target).length === 0){
					self.close();
				}
			})
			/*
			$(document).off('click.quickSrchClose').on('click.quickSrchClose', '.quickSrch_close', function(e){
				self.close();
			})
			*/
		},
		open: function(obj, callback){
			if (totalSrchId == null){ totalSrchId = 'quickSrch' }
			if ($("#" + totalSrchId).length) {
				var self = this;
				var $eleWrap = $("#" + totalSrchId);
				var $eleOpner = $(obj);
				self.opener = $(obj);
				$eleWrap.addClass('is_visible');
				$eleWrap.find('.quickSrch_inner').removeAttr('style');
				if ($('.totalSrch_wrap').length) { $("#" + totalSrchId).addClass('page_search'); }
				setTimeout(function(){ $eleWrap.find('.quickSrch_dimmer').addClass('is_active');}, 0); //50에서 0으로
				setTimeout(function(){ $eleWrap.find('.quickSrch_inner').addClass('is_active');}, 0); //100에서 0으로
				$eleWrap.find('.quickSrch_inner').one('transitionend', function(){
					if ($(this).hasClass('is-active')){
						$eleOpner.attr({'aria-expanded':'true'});
						$('body.mobile').addClass('is_srchOpen');
					}
				});
				if ($('body').hasClass('mobile')){ 
					$eleWrap.addClass('is_acOnly');
					$eleOpner.attr({'aria-expanded':'true'});
					$('body.mobile').addClass('is_srchOpen');
					$('.autoComplete_wrap').addClass('is_visible');
					$('.quickSrch_inner').addClass('is_focused');
				 }
				if (callback) { callback() }
				//if ($(window).width() < 1101 && $(window).outerHeight() < 1366){ ui.commonAccess.disable($('#quickSrch_wrap').siblings(), 'is_quickSrch')}



				// 24.08 접근성 정리
                // 25접근성-레이어용 div는 aria-hidden영향을 받지 않도록..
				if ($('#totalQuickSrch').length) {
					// 통합검색 페이지
					ui.commonAccess.disable($('#wrap').siblings().not('#__flying_partition__'), 'quickSrch');
					ui.commonAccess.disable($('#container').siblings(), 'quickSrch');
					ui.commonAccess.disable($('.totalSrch_wrap').siblings(), 'quickSrch');
					ui.commonAccess.disable($('.totalSrch_header').siblings(), 'quickSrch');
					ui.commonAccess.disable($('#totalSrchOffsetLeft').siblings(), 'quickSrch');
					if ($('body').hasClass('pc')){
						// 통합검색 - 피씨
						ui.commonAccess.disable($('#totalQuickSrch .srch_input_wrap'), 'quickSrch');
					} else if ($('body').hasClass('mobile')){
						// 통합검색 - 모바일
						ui.commonAccess.disable($('#totalSrchOffsetLeft > .srch_input_wrap '), 'quickSrch');
					}
				} else {
					// 통합검색 페이지를 제외한 모든 페이지
					ui.commonAccess.disable($('#wrap').siblings().not('#__flying_partition__'), 'quickSrch');
					ui.commonAccess.disable($('#header').siblings(), 'quickSrch');
					ui.commonAccess.disable($('#quickSrch').siblings(), 'quickSrch');
				}
				
				/* 24.08 접근성 정리로 인한 주석
				if ($('body').hasClass('mobile')){
					// 24.08 접근성 정리로 인한 주석 ui.commonAccess.disable($('#wrap'), 'is_quickSrch');
					// 24.08 접근성 정리로 인한 주석 $('#wrap').attr({'aria-hidden':'false'}).removeClass('is-disable-is_quickSrch-ariaHidden');
					// 24.08 접근성 정리로 인한 주석 ui.commonAccess.enable($('.quickSrch_wrap'), 'is_quickSrch'); // 주석처리시 자주 찾는 검색어, 추천 검색어 접근 불가
					// if ($('.totalSrch_wrap').length){
					// } else {
					// 	ui.commonAccess.disable($('.quickSrch_wrap').siblings(), 'is_quickSrch');
					// 	ui.commonAccess.disable($('#header').siblings(), 'is_quickSrch');
					// }
					// 2023 접근성 추가
					//	- 주석처리 된 아래 2개 접근성 소스 필요해 보임
					//	- 아래 소스 없으면 모바일에서 메인/서브 헤더의 돋보기 버튼 클릭 시 바닥 페이지 접근 가능
					//
					if ($('.totalSrch_wrap').length) {
						// 통합검색 페이지
					} else {
						// 24.08 접근성 정리로 인한 주석 ui.commonAccess.disable($('.quickSrch_wrap').siblings(), 'is_quickSrch');
						// 24.08 접근성 정리로 인한 주석 ui.commonAccess.disable($('#header').siblings(), 'is_quickSrch');
					}
				} else if ($('body').hasClass('pc')){
					// 24.08 접근성 정리로 인한 주석 ui.commonAccess.disable($('#header').siblings(), 'is_quickSrch');
					// 24.08 접근성 정리로 인한 주석 ui.commonAccess.disable($('#header').children(), 'is_quickSrch');
					if ($('.main_search').length){
						// 24.08 접근성 정리로 인한 주석 ui.commonAccess.enable($('.main_index .main_con').prevAll(), 'is_quickSrch');
						// 24.08 접근성 정리로 인한 주석 ui.commonAccess.enable($('.main_search .input_wrap.pc_only'), 'is_quickSrch');
						eventMainSwiper != null && eventMainSwiper.autoplay.stop();
					}
					// 24.08 접근성 정리로 인한 주석 ui.commonAccess.enable($('.quickSrch_wrap'), 'is_quickSrch'); // 주석처리시 자주 찾는 검색어, 추천 검색어 접근 불가
				} 
				*/

				// 2023 접근성 - iOS 검색팝업의 input으로 가는 포커스 오류로 인해 setTimeout 설정(모바일 메인/서브 공통)
				// 기존소스 주석 if ($(window).width() < 1101){ $eleWrap.find('.js_autoComplete').focus();}
				if ($(window).width() > 1100) {
					// 피씨
					// 24.08 기존소스 주석처리하고 아래 분기처리 추가  $eleWrap.find('.js_autoComplete').focus();
					if($eleOpner.is('.btn_ico_search')) {
						// 헤더 공통(메인 헤더 포함)
						$eleWrap.find('.js_autoComplete').focus(); // .js_autoComplete 포커스가 가야만 검색관련 내용이 노출됨(모두 동일)
						$('.quickSrch_inner').attr('tabindex', 0).focus(); // .js_autoComplete로만 포커스를 보낸 후 keyup이 발생하면 '검색어를 입력하세요' 경고창이 뜸(모두 동일)
					} else {
						if($('.main_search').length) {
							// 메인 검색바
							$('#wrap').addClass('pc-search-on'); // 메인에서 검색바 버튼을 통해 오픈시 디자인 변경을 하기 위한 용도로 넣은 클래스 제거
							$("#quickSrch").addClass('is_acOnly');
							$eleWrap.find('.js_autoComplete').focus();
							$('.quickSrch_inner').attr('tabindex', 0).focus();
						} else {
							// 통합검색
							$eleWrap.find('.js_autoComplete').focus();
						}
					}

					if($('.main_search').length) {
						eventMainSwiper != null && eventMainSwiper.autoplay.stop();
					}
				} else {
					// 모바일
					setTimeout(function() {
						$eleWrap.find('.js_autoComplete').focus();
					},350)
				}

				// '이런 정보를 찾고 계세요?' swiper 실행
				if(!quickSrchInfoSwiper && $('#quickSrchInfoSwiper .swiper-slide').length >= 4) {
					quickSrchInfoSwiper = new Swiper('#quickSrchInfoSwiper .swiper-container', {
						autoplay: {
							delay:1500,
							disableOnInteraction: false,
						},
						loop: true,
						slidesPerView: 'auto',
						navigation: {
							nextEl: '#quickSrchInfoSwiper .nav-button-next',
							prevEl: '#quickSrchInfoSwiper .nav-button-prev',
						},
						pagination: {
							el: '.quickSrch-swiper-pagination',
							clickable: true,
						},
						spaceBetween: 8,
						watchSlidesVisibility: true,
						observeParents:true,
						observer:true,
						on: {
							init: function () {
								ui.swiperAccess($('#quickSrchInfoSwiper .swiper-container'), 'auto');
							},
							slideChangeTransitionStart: function () {
								ui.swiperAccess($('#quickSrchInfoSwiper .swiper-container'), 'auto');
							},
							slideChangeTransitionEnd: function () {
								// 첫번째 슬라이드에서는 이전 슬라이드로 못가게 막음.
								// 이전 버튼으로 이동 중 첫번째 슬라이드에 도착하면 이전 버튼의 포커스가 사라지는 접근성 이슈로 기능 제거
								/* var realIndex = this.realIndex;
								var isAtFirstSlide = realIndex === 0;
								var prevBtn = document.querySelector('#quickSrchInfoSwiper .nav-button-prev');
								if(isAtFirstSlide) {
									this.allowSlidePrev = false;
									prevBtn.setAttribute('disabled', true);
								} else {
									this.allowSlidePrev = true;
									prevBtn.removeAttribute('disabled');
								} */
							},
							resize: function () {
								ui.swiperAccess($('#quickSrchInfoSwiper .swiper-container'), 'auto');
							},
						},
					});

					// 재생 일시정지
					var quickSrchInfoSwiperWrap = document.querySelector('#quickSrchInfoSwiper')
					var quickSrchInfoSwiperContainer = document.querySelector('#quickSrchInfoSwiper .swiper-container')
					var btnPlay = document.getElementById('btnPlay');
					var btnPause = document.getElementById('btnPause');
					var isAutoPlay = true;
					// 일시정지 상태에서 재생 버튼 클릭 시
					btnPlay.addEventListener('click', function() {
						autoPlayStart();
						btnPause.focus();
						isAutoPlay = true;
					});
					// 자동재생 상태에서 일시정지 버튼 클릭 시
					btnPause.addEventListener('click', function() {
						autoPlayStop();
						btnPlay.focus();
						isAutoPlay = false;
					});

					quickSrchInfoSwiperContainer.addEventListener('mouseenter', function() {
						if(isAutoPlay === true) {
							autoPlayStop()
						}
					});
					quickSrchInfoSwiperContainer.addEventListener('mouseleave', function() {
						if(isAutoPlay === true) {
							autoPlayStart();
						}
					});

					quickSrchInfoSwiperWrap.addEventListener('focusin', function() {
						if(isAutoPlay === true) {
							quickSrchInfoSwiper.autoplay.stop();
						}
					});
					quickSrchInfoSwiperWrap.addEventListener('focusout', function() {
						if(isAutoPlay === true) {
							quickSrchInfoSwiper.autoplay.start();
						}
					});

					function autoPlayStart() {
						btnPlay.disabled = true;
						btnPause.disabled = false;
						quickSrchInfoSwiper.autoplay.start();
					}
					
					function autoPlayStop() {
						btnPlay.disabled = false;
						btnPause.disabled = true;
						quickSrchInfoSwiper.autoplay.stop();
					}
				} else {
					$('#quickSrchInfoSwiper').addClass('no-swiper');
				}
				
				popOpenScroll();
				self.event();
			}
		},
		close: function(btn){
			// 24.08 접근성 정리
			if ($('#totalQuickSrch').length) {
				// 통합검색 페이지
				ui.commonAccess.enable($('#wrap').siblings(), 'quickSrch');
				ui.commonAccess.enable($('#container').siblings(), 'quickSrch');
				ui.commonAccess.enable($('.totalSrch_wrap').siblings(), 'quickSrch');
				ui.commonAccess.enable($('.totalSrch_header').siblings(), 'quickSrch');
				ui.commonAccess.enable($('#totalSrchOffsetLeft').siblings(), 'quickSrch');
				if ($('body').hasClass('pc')){
					// 통합검색 - 피씨
					ui.commonAccess.enable($('#totalQuickSrch .srch_input_wrap'), 'quickSrch');
				} else if ($('body').hasClass('mobile')){
					// 통합검색 -모바일
					ui.commonAccess.enable($('#totalSrchOffsetLeft > .srch_input_wrap '), 'quickSrch');
				}
			} else {
				// 통합검색 페이지를 제외한 모든 페이지
				ui.commonAccess.enable($('#wrap').siblings(), 'quickSrch');
				ui.commonAccess.enable($('#header').siblings(), 'quickSrch');
				ui.commonAccess.enable($('#quickSrch').siblings(), 'quickSrch');
			}

			// 메인에서 검색바 버튼을 통해 오픈시 디자인 변경을 하기 위한 용도로 넣은 클래스 제거
			if ($('body').hasClass('pc') && $('.main_search').length) {
				$('#wrap').removeClass('pc-search-on');
			}

			// 오픈 시 포커스 보내기 위한 용도로 넣은 tabindex 제거
			$('.quickSrch_inner').removeAttr('tabindex');


			//if ($(window).width() < 1101){ totalSrchId = $('.quickSrch_wrap').attr('id') }
			// 24.08 접근성 정리로 인한 주석 ui.commonAccess.enable($('#wrap'), 'is_quickSrch');
			// 24.08 접근성 정리로 인한 주석 ui.commonAccess.enable($('.quickSrch_wrap').siblings(), 'is_quickSrch');
			// totalSrchId 통합검색은 totalQuickSrch 아니면 quickSrch
			if (totalSrchId != "totalQuickSrch") {
				//if ($(window).width() < 1101 && $(window).outerHeight() < 1366){ totalSrchId = $('.quickSrch_wrap').attr('id') }
				if ($(window).width() < 1101){ totalSrchId = $('.quickSrch_wrap').attr('id') }
			}
			if ($("#" + totalSrchId).length) {
				var $eleWrap = $("#" + totalSrchId);
				var $eleOpner = this.opener;
				
				eventMainSwiper != null && eventMainSwiper.autoplay.start();
				/* 수동체크 */
				if ($('.main_search').length) {
					if ($('#header').hasClass('.step-state1')){ $eleOpner = $('.search_btn:visible') }
					else if ($('body').hasClass('mobile')){
						$eleOpner = $('.main_search .input_wrap.mo_only .main-search-btn');
					} else if ($('body').hasClass('pc')){
						if($eleOpner.is('.btn_ico_search')) {
							$eleOpner = $('#header .header_body .body_inner .btn_ico_search');
						} else {
							$eleOpner = $('.main_search .input_wrap.pc_only .main-search-btn');
						}
					}
					eventMainSwiper != null && eventMainSwiper.autoplay.start();
				} else {
					if ($('body').hasClass('mobile')){
						if ($('.totalSrch_wrap').length){ 
							$eleOpner = $('.srch_input_wrap .js_autoComplete');
						} else {
							$eleOpner = $('#header .util_wrap .btn_ico_search');
							// 24.08 접근성 정리로 인한 주석 ui.commonAccess.enable($('.quickSrch_wrap').siblings(), 'is_quickSrch');  // 2023 접근성 추가
							// 24.08 접근성 정리로 인한 주석 ui.commonAccess.enable($('#header').siblings(), 'is_quickSrch');  // 2023 접근성 추가
						}
					} else if ($('body').hasClass('pc')){
						$eleOpner = $('#header .header_body .body_inner .btn_ico_search');
					}
				}

				$eleWrap.find('.autoComplete_wrap').removeClass('is_visible');
				$eleWrap.find('.quickSrch_inner').removeClass('is_focused');
				setTimeout(function(){ $eleWrap.find('.quickSrch_inner').removeClass('is_active');}, 0); //10에서 0으로
				setTimeout(function(){ $eleWrap.find('.quickSrch_dimmer').removeClass('is_active');}, 0); //50에서 0으로
				setTimeout(function(){ $(window).trigger('quickSrchDimmerOut'); }, 0); //301에서 0으로
				//if ($eleWrap.hasClass('is_acOnly') && $(window).width() > 1100 || $(window).outerHeight() > 1365){
				//PC 메인, 통합검색
				$(window).one('quickSrchDimmerOut', function(){
					if ($(window).width() > 1100){
						$eleWrap.removeClass('is_visible');
						$eleOpner.attr({'aria-expanded':'false'});
						$("#" + totalSrchId).removeClass('is_acOnly');
						if ($('.main_search').length) {
							setTimeout(function() {
								$eleOpner.data('focusReturn', true).focus();
							},300)
						} else if ($('.totalSrch_wrap').length){
							$('.srch_input_wrap .js_autoComplete').data('focusReturn', true).focus();
						} else {
							$eleOpner.data('focusReturn', true).focus();
						}
					} 
					//모바일
					else {
						$eleWrap.removeClass('is_visible');
						$eleOpner.attr({'aria-expanded':'false'});
						$("#" + totalSrchId).removeClass('is_acOnly');
						$('body.mobile').removeClass('is_srchOpen');
						/* 2023 접근성 iOS 사파리에서 포커스 문제로 setTimeout 추가 s */
						// 기존소스 주석 $eleOpner.focus();
						setTimeout(function() {$eleOpner.focus()},300)
					}
				});
				popCloseScroll();
				//if ($(window).width < 1101 && $(window).outerHeight() < 1366){ ui.commonAccess.enable($('#quickSrch_wrap').siblings(), 'is_quickSrch')}
			}

			// '이런 정보를 찾고 계세요?' swiper 제거
			if(quickSrchInfoSwiper) {
				quickSrchInfoSwiper.destroy(true, true)
				quickSrchInfoSwiper = null;
				document.getElementById('btnPlay').disabled = true;
				document.getElementById('btnPause').disabled = false;
			}
		}
	},

	flowStep: {
		init: function(){
			var self = this;
			$('.flow_step').each(function(){
				var $current = $(this).find('li.current');
				var $items = $(this).find('li').length;
				//초기화
				$(this).attr('role', 'text').find('ul').removeAttr('role aria-label');
				$(this).children('.blind').remove();
				//설정
				$(this).append('<span class="blind">현재 '+($current.index()+1)+'단계 진행중</span>');
			})
		},
	},

	myCardInfo: {
		init: function(){
			$('div.my_card_info').each(function(){
				var $cardInfo = $(this);
				var $cardSwiper = $cardInfo.find('.card_swiper');
				var $cardSelect = $cardInfo.find('.card_select');
				var $switch = $cardInfo.find('label.switch > input');

				if ($switch.length && $switch.prop('checked')){
					$cardSwiper.hide();
					$cardSelect.show();
				} else {
					$cardSwiper.show();
					$cardSelect.hide();
				}
			})
			$('.card_swiper').each(function(){
				if ($(this).find('.swiper-slide:visible').length == 1 ) {
					$(this).addClass('no_swiper');
				} else if ($(this).find('.swiper-slide:visible').length > 1){
					$(this).removeClass('no_swiper');
				}

				if ($('body').hasClass('pc')){
					$(this).find('.card_img').each(function(){
						if ($(this).find('.blind').length == 0){
							var blind = $(this).find('img').attr('alt');
							$(this).attr('role','text').find('img').attr('aria-hidden', 'true');
							$(this).append('<span class="blind">'+blind+'</span>')
						}
						if ($(this).next('input.chk').next('.chk_focus').length == 0){
							$(this).next('input.chk').after('<span class="chk_focus" aria-hidden="true"></span>');
						}
					})
				}
			})

		}
	},

	// 자주하는 질문 키워드
	keyword: {
		init: function () {
			ui.keyword.keywordSelect();
			ui.keyword.keywordToggleEvent();
			ui.keyword.keywordToggleAction($('.keyword_category_box'));
		},

		// 키워드 클릭시 선택됨 표시
		keywordSelect: function () {
			var selectedMenu = null;
			$('.keyword_category li').off('click').on('click', function () {
				if (selectedMenu) { selectedMenu.removeClass('is_selected') }
				$(this).addClass('is_selected');
				selectedMenu = $(this);
			});
		},

		// 안보이는 키워드 접근성 추가
		keywordToggleAction: function (action) {
			var lens = 6;
			var $ele = $('.keyword_category li');
			if (action == 'open') {
				$('.keyword_category_box').addClass('is_opened');
				$ele.eq(lens - 1).nextAll().find('button').attr({ 'tabindex': '0', 'aria-hidden': 'false' });
				$ele.eq(lens).prevAll().find('button').attr({ 'tabindex': '0', 'aria-hidden': 'false' });
			} else if (action == 'close') {
				$('.keyword_category_box').removeClass('is_opened');
				$ele.eq(lens - 1).nextAll().find('button').attr({ 'tabindex': '-1px', 'aria-hidden': 'true' });
				$ele.eq(lens).prevAll().find('button').attr({ 'tabindex': '0', 'aria-hidden': 'false' });
			}
		},

		keywordToggleEvent: function () {
			// 키워드 클릭시 보이는 영역 높이 조정 및 접근성
			$('.keyword_category_toggle .btn_toggle').off('click').on('click', function(){
				var $eleBox = $(this).closest('.keyword_category_box');
				var $eleLabel = $(this).find('span');
				var action = '';
				if (!$eleBox.hasClass('is_opened')){ action = 'open'; $eleLabel.text('접기') } 
				else if ($eleBox.hasClass('is_opened')){ action = 'close'; $eleLabel.text('펼치기') }
				ui.keyword.keywordToggleAction(action);
			});
		}
	},

	// 통합검색 질문 키워드
	keyword_srch: {
		init: function () {
			ui.keyword_srch.keywordSelect();
			ui.keyword_srch.keywordToggleEvent();
			ui.keyword_srch.keywordToggleAction($('.totalSrch_header'));
		},

		// 키워드 클릭시 선택됨 표시
		keywordSelect: function () {
			var selectedMenu = null;
			$('.srch_tags_wrap button').off('click').on('click', function () {
				if (selectedMenu) { selectedMenu.removeClass('is_selected') }
				$(this).addClass('is_selected');
				selectedMenu = $(this);
			});
		},

		// 안보이는 키워드 접근성 추가
		keywordToggleAction: function (action) {
			var lens = 6;
			var $ele = $('.srch_tags_wrap button');
			if (action == 'open') {
				$('.totalSrch_header').addClass('is_opened');
				$ele.eq(lens - 1).nextAll().attr({ 'tabindex': '0', 'aria-hidden': 'false' });
				$ele.eq(lens).prevAll().attr({ 'tabindex': '0', 'aria-hidden': 'false' });
			} else if (action == 'close') {
				$('.totalSrch_header').removeClass('is_opened');
				$ele.eq(lens - 1).nextAll().attr({ 'tabindex': '-1px', 'aria-hidden': 'true' });
				$ele.eq(lens).prevAll().attr({ 'tabindex': '0', 'aria-hidden': 'false' });
			}
		},

		keywordToggleEvent: function () {
			// 키워드 클릭시 보이는 영역 높이 조정 및 접근성
			$('.srch_tags_toggle .btn_toggle').off('click').on('click', function(){
				var $eleBox = $(this).closest('.totalSrch_header');
				var $eleLabel = $(this).find('span');
				var action = '';
				if (!$eleBox.hasClass('is_opened')){ action = 'open'; $eleLabel.text('접기') } 
				else if ($eleBox.hasClass('is_opened')){ action = 'close'; $eleLabel.text('펼치기') }
				ui.keyword_srch.keywordToggleAction(action);
			});
		}
	},

	pageChangeOption: function(ele) {
		if ($(ele + ' .swiper-slide').length < 6){
			return  {
				el: ele+' .swiper-pagination', 
				type: 'bullets'
			}
		} else {
			return {
				el: ele+' .swiper-pagination', 
				type: 'fraction', 
				renderFraction: function(currentClass, totalClass) {
					return '<span class="' + currentClass + '"></span>' + '/' + '<span class="' + totalClass + '"></span>';
				}
			}
		}
	},

	/* ------------------------------------------------------
		TopsClub (TC)
	-------------------------------------------------------*/
	TC_swiper: {
		premium: function(){
			var premiumSwiper = null;
			var eleContainer = '.topsclub_premium_swiper';
			if ($(eleContainer+' .swiper-slide').length > 1){
				premiumSwiper = new Swiper(eleContainer+' .swiper-container', {
					autoplay: { delay: 4000 },
					speed: 500,
					navigation: {
						nextEl: eleContainer+' .nav-button-next',
						prevEl: eleContainer+' .nav-button-prev',
					}, 
					pagination: {
						el: eleContainer+' .swiper-pagination',
						type: 'fraction'
					},
					on: {
						init: function(){ 
							ui.swiperAccess($(eleContainer+' .swiper-container'));
						},
						slideChangeTransitionStart: function(){ 
							ui.swiperAccess($(eleContainer+' .swiper-container'));
						},
					}

				});
				$(eleContainer+' .swiper-button-pause').off('click').on('click', function () {
					$(this).closest('.swiper-controls').addClass('is_stoped').removeClass('is_played');
					$(eleContainer+' .swiper-button-play').focus();
					premiumSwiper.autoplay.stop();
				});
				$(eleContainer+' .swiper-button-play').off('click').on('click', function () {
					$(this).closest('.swiper-controls').addClass('is_played').removeClass('is_stoped');
					$(eleContainer+' .swiper-button-pause').focus();
					premiumSwiper.autoplay.start();
				});
			} else {
				$(eleContainer).addClass('no_swiper');
			}
		},
		topsTheme: function(){
			var topsThemeSwiper = null;
			var eleContainer = '.swiper_topsTheme';
			if ($(eleContainer+' .swiper-slide').length > 1){
				topsThemeSwiper = new Swiper(eleContainer+' .swiper-container', {
					slidesPerView: 4,
					speed: 500,
					navigation: {
						nextEl: eleContainer+' .nav-button-next',
						prevEl: eleContainer+' .nav-button-prev',
					}, 
					pagination: {
						el: eleContainer+' .swiper-pagination',
						type: 'fraction'
					},
					breakpoints: {
						640: { slidesPerView: 2 },
						641: { slidesPerView: 3 },
						1100: { slidesPerView: 3 },
						1101: { slidesPerView: 4 }
					},
					on: {
						init: function(){ 
							ui.swiperAccess($(eleContainer+' .swiper-container'));
						},
						slideChangeTransitionStart: function(){ 
							ui.swiperAccess($(eleContainer+' .swiper-container'));
						},
					}

				});
			} else {
				$(eleContainer).addClass('no_swiper');
			}
		},
		mainVisual: function(){
			var tcMainVisualwiper = null;
			var eleContainer = '.submain_premium .premium_visual';
			if ($(eleContainer+' .swiper-slide:visible').length > 1){
				tcMainVisualwiper = new Swiper(eleContainer+' .swiper-container', {
					autoplay: { delay: 4000 },
					speed: 500,
					watchSlidesVisibility: true,
					navigation: {
						nextEl: eleContainer+' .nav-button-next',
						prevEl: eleContainer+' .nav-button-prev',
					}, 
					pagination: {
						el: eleContainer+' .swiper-pagination',
						type: 'fraction'
					},
					on: {
						init: function(){ 
							ui.swiperAccess($(eleContainer+' .swiper-container'));
						},
						slideChangeTransitionStart: function(){ 
							ui.swiperAccess($(eleContainer+' .swiper-container'));
						},
					}

				});
				$(eleContainer+' .swiper-button-pause').off('click').on('click', function () {
					$(this).closest('.swiper-controls').addClass('is_stoped').removeClass('is_played');
					$(eleContainer+' .swiper-button-play').focus();
					tcMainVisualwiper.autoplay.stop();
				});
				$(eleContainer+' .swiper-button-play').off('click').on('click', function () {
					$(this).closest('.swiper-controls').addClass('is_played').removeClass('is_stoped');
					$(eleContainer+' .swiper-button-pause').focus();
					tcMainVisualwiper.autoplay.start();
				});
			} else {
				$(eleContainer).addClass('no_swiper');
			}
		},
		mainInfoItems: function(){
			var mainInfoSwiper = null;
			var eleContainer = '.submain_premium .premium_info';
			if ($(eleContainer+' .swiper-slide:visible').length > 1){
				mainInfoSwiper = new Swiper(eleContainer+' .swiper-container', {
					speed: 500,
					slidesPerView: 5, 
					resistanceRatio: 0,
					spaceBetween: 10,
					watchSlidesVisibility: true,
					navigation: {
						nextEl: eleContainer+' .swiper-button-next',
						prevEl: eleContainer+' .swiper-button-prev',
					}, 
					breakpoints: {
						960: {slidesPerView: 'auto', resistanceRatio: 0.6,},
						961: {slidesPerView: 5, resistanceRatio: 0},
					},
					on: {
						init: function(){
							var option = '';
							if ($(window).width() < 961) { option = 'auto' }
							ui.swiperAccess($(eleContainer+' .swiper-container', option));
						},
						slideChangeTransitionStart: function(){ 
							var option = '';
							if ($(window).width() < 961) { option = 'auto' }
							ui.swiperAccess($(eleContainer+' .swiper-container', option));
						},
					}
				});
			}
		},
		mainPlusAction: function(){
			var plusSwiper = null;
			var eleContainer = '.swiper_topsPlus';
			if ($(eleContainer+' .swiper-slide:visible').length > 1){
				plusSwiper = new Swiper(eleContainer+ ' .swiper-container', {
					autoplay: { delay: 4000 },
					cssMode: true,
					slidesPerView: 1,
					disableOnInteraction: false,
					watchSlidesVisibility: true,
					loop: true,
					navigation : {
						nextEl: eleContainer+ ' .nav-button-next',
						prevEl: eleContainer+ ' .nav-button-prev'
					},
					pagination: {
						el: eleContainer+' .swiper-pagination',
						type: 'fraction'
					},
					watchSlidesVisibility: true,
					on: {
						init: function(){ 
							ui.swiperAccess($(eleContainer+ ' .swiper-container'), 'centered');
						},
						slideChangeTransitionStart: function(){ 
							ui.swiperAccess($(eleContainer+ ' .swiper-container'), 'centered');
						},
						resize: function(){ 
							ui.swiperAccess($(eleContainer+ ' .swiper-container'), 'centered');
						}
					},
				});
				$(eleContainer+' .swiper-button-pause').off('click').on('click', function () {
					$(this).closest('.swiper-controls').addClass('is_stoped').removeClass('is_played');
					$(eleContainer+' .swiper-button-play').focus();
					plusSwiper.autoplay.stop();
				});
				$(eleContainer+' .swiper-button-play').off('click').on('click', function () {
					$(this).closest('.swiper-controls').addClass('is_played').removeClass('is_stoped');
					$(eleContainer+' .swiper-button-pause').focus();
					plusSwiper.autoplay.start();
				});
				$(eleContainer).removeClass('no_swiper');
			} else {
				$(eleContainer).addClass('no_swiper');
			}
		},
		specialSwiperAction: function(){
			var specialSwiper = null;
			var eleContainer = '.premium_special';
			if ($(eleContainer+' .swiper-slide:visible').length > 1){
				specialSwiper = new Swiper(eleContainer+ ' .swiper-container', {
					cssMode: true,
					slidesPerView: 3,
					slideToClickedSlide: true,
					centeredSlides: true,
					watchSlidesVisibility: true,
					loop: true,
					navigation : {
						nextEl: eleContainer+ ' .btnNav_right',
						prevEl: eleContainer+ ' .btnNav_left'
					},
					pagination: {
						el: eleContainer+' .swiper-pagination',
						type: 'fraction'
					},
					watchSlidesVisibility: true,
					on: {
						init: function(){ 
							ui.swiperAccess($(eleContainer+ ' .swiper-container'), 'centered');
						},
						slideChangeTransitionStart: function(){ 
							ui.swiperAccess($(eleContainer+ ' .swiper-container'), 'centered');
						},
						resize: function(){ 
							ui.swiperAccess($(eleContainer+ ' .swiper-container'), 'centered');
						}
					},
					breakpoints: {
						854: { slidesPerView: 1.4, loop: false, },
						855: { slidesPerView: 3, loop: true, }
					},
				});
				$(eleContainer).removeClass('no_swiper');
			} else {
				$(eleContainer).addClass('no_swiper');
			}
		},
	},
	
	/* ------------------------------------------------------
		MyShop
	-------------------------------------------------------*/
	mys_swiper: {
		premium: function(){
			var premiumSwiper = null;
			var eleContainer = '.mys_swiper';
			if ($(eleContainer+' .swiper-slide').length > 1){
				premiumSwiper = new Swiper(eleContainer+' .swiper-container', {
					autoplay: { delay: 4000 },
					slidesPerView: 1,
                    loop: true,
                    autoHeight: false,
					watchSlidesVisibility: true,
					navigation: {
						nextEl: eleContainer+' .nav-button-next',
						prevEl: eleContainer+' .nav-button-prev',
					}, 
					pagination: {
						el: eleContainer+' .swiper-pagination',
						type: 'fraction'
					},
					on: {
						init: function(){ 
							ui.swiperAccess($(eleContainer+' .swiper-container'));
						},
						slideChangeTransitionStart: function(){ 
							ui.swiperAccess($(eleContainer+' .swiper-container'));
						},
					}

				});
				$(eleContainer+' .swiper-button-pause').off('click').on('click', function () {
					$(this).closest('.swiper-controls').addClass('is_stoped').removeClass('is_played');
					$(eleContainer+' .swiper-button-play').focus();
					premiumSwiper.autoplay.stop();
				});
				$(eleContainer+' .swiper-button-play').off('click').on('click', function () {
					$(this).closest('.swiper-controls').addClass('is_played').removeClass('is_stoped');
					$(eleContainer+' .swiper-button-pause').focus();
					premiumSwiper.autoplay.start();
				});
			} else {
				$(eleContainer).addClass('no_swiper');
			}
		}
	},

	// 마이샵 - 아코디언
	toggleType1: function() {
		$(".accordian_type").find("dt .btn_toggle").attr("aria-expanded", "false");
		$(".accordian_type.on").find("dt .btn_toggle").attr("aria-expanded", "true");
		
		$(".accordian_type .btn_toggle").off("click.toggle").on("click.toggle", function() {
			var $toggleWrap = $(this).closest(".accordian_type");
			var $button = $(this);
			var $content = $toggleWrap.find(".cont_toggle");
			
			if (!$toggleWrap.hasClass("disabled")) {
				if(!$toggleWrap.hasClass("on")) {
					$toggleWrap.siblings(".accordian_type").removeClass("on").find("dt .btn_toggle").attr("aria-expanded", "false");
					$toggleWrap.addClass("on").find("dt .btn_toggle").attr("aria-expanded", "true");
					$(window).scrollTop($toggleWrap.offset().top);
				} else {
					$toggleWrap.removeClass("on").find("dt .btn_toggle").attr("aria-expanded", "false");
				} 
			}
			return false;
		});
	}
 }

$(document).off("click.modalClose").on("click.modalClose",".modal_close", function(){
	$(this).parent().parent().stop().fadeOut("fast", function(e){
		$(this).removeClass("on");
	});
	$("body").removeClass("hidden");
});

/* Print */
var printWindow = function(url, param){
	var options = ''
	if ($('body').hasClass('pc')) { options = 'width=800, height=768, location=no, menubar=no, status=no, toolbar=no, scrollbars=yes' }
	if (param.pageMode == 'pub'){
		window.open(url, 'popupPrint', options);
	} else {
		window.open('about:blank', 'popupPrint', options);
		var $form = $('<form>');
		$form.attr({
			target: 'popupPrint',
			action: url,
			method: 'post'
		});

		$('body').append($form);
		$.each(param, function(key, value){
			$form.append($('<input>').attr({
				type: 'hidden',
				name: key,
				value: value
			}));
		});
		$form.submit();
		$form.remove();
	}
}
var setPrint = {
	keyControl: null,
	init: function(){
		// 요소가 있는지 체크
		if ($('.content_print').length === 0) {
			$('body').prepend('<div class="content_print"><span><img src="/pconts/images/common/shinhancard_logo.png" alt="Shinhancard"></span><span class="print_date"></span></div>');
		}
		// 중복이벤트 제거
		if ($('.print').length) { $('.print').removeAttr('onclick') }
		//if ($('.btn_print').length) { $('.btn_print').removeAttr('onclick') }
		this.setDate();
		this.event();
	},
	event: function(){
		var self = this;
		$('body').off('keydown.setPrint').on('keydown.setPrint', function(e){
			// Control 키
			if (self.keyControl == null && e.keyCode == 17) { 
				self.keyControl = true;
			}
			// 프린트용 (p) 키)
			if (self.keyControl == true && e.keyCode == 80) { 
				self.setDate();
			}
			// 테스트용 (i 키)
			if (self.keyControl == true && e.keyCode == 73) { 
				self.setDate();
			}
		});
		$('body').off('keyup.setPrint').on('keyup.setPrint', function(e){
			// Control 키
			if (self.keyControl == true && e.keyCode == 17) { 
				self.keyControl = null;
			}
		});
		$(document).off('click.setPrint').on('click.setPrint', '.print', function(){
			self.setDate();
			window.print();
		})
	},
	setDate: function(){
		var d = new Date();
		var str = '';
		getDate = d.getFullYear() + '.' + (d.getMonth() + 1) + '.' + d.getDate();
		getTime = d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
		str = getDate + '  ' + getTime;
		this.reset(str);	
	},
	reset: function(str){
		if ($('.content_print').length) { 
			$('.print_date').html(str);
		}
	},
}

// lpPopup
var lpOpen = function(el) {
	var $el = $(el);
	$el.addClass("on");
    $el.stop().fadeIn("fast");

    var windowsHeight = $(window).height();
    var modalHeight = $(".modal_area").height();
    var modalPosition = (windowsHeight - modalHeight)/2
    $(".modal_area").css("top", modalPosition);
    $("body").addClass("hidden");
}

var lpClose = function(el) {
	var $el = $(el);
	$el.stop().fadeOut("fast",function(){
        $el.removeClass("on");
    });
    $("body").removeClass("hidden");
}

var resizeHandler = function() {
    if (this.resizeTO) {
		clearTimeout(this.resizeTO);
	}
	this.resizeTO = setTimeout(function () {
		$(this).trigger('resizeEnd');
	}, 300);
}

/* 모바일 에이전트 구분 */
var isMobile = {
	Android: function () {return navigator.userAgent.match(/Android/i) == null ? false : true;},
	BlackBerry: function () {return navigator.userAgent.match(/BlackBerry/i) == null ? false : true;},
	iOS: function () {return navigator.userAgent.match(/iPhone|iPad|iPod/i) == null ? false : true;},
	IOSPad: function () {return navigator.userAgent.match(/iPad/i) == null ? false : true;},
	Opera: function () {return navigator.userAgent.match(/Opera Mini/i) == null ? false : true;},
	Windows: function () {return navigator.userAgent.match(/IEMobile/i) == null ? false : true;},

	shcardapp: function () {return navigator.userAgent.match(/shcardapp/i) == null ? false : true;},
	shfanapp: function () {return navigator.userAgent.match(/shfanapp/i) == null ? false : true;},
	sharedplatform: function () {return navigator.userAgent.match(/sharedplatform/i) == null ? false : true;},
	shcouponapp: function () {return navigator.userAgent.match(/shcouponapp/i) == null ? false : true;},
	
	//IOSPadPro: function () {return isMobile.IOSPad() && $(window).width() >= 1024;},
	tabletPro: function () {return $('body').hasClass('tabletPro')},
	any: function () {return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows() || isMobile.shcardapp() || isMobile.shfanapp() || isMobile.sharedplatform() || isMobile.shcouponapp() )}
}

/* 레이어 팝업 */
var $mobileSize = 760,
    $popSpeed = 300,
    $popOpenBtn = '';
    
var popupUI = function () {
	$(document).off('click.popupUI').on('click.popupUI', '.ui-pop-open', function (e) {
        e.preventDefault();
        var $pop = $(this).attr('href');
        popOpen($pop, this);
    });

	if ($('.pop_app').length > 0) popfullHeight('.pop_app .pop_cont');
}

var popfullHeight = function (tar) {
	var $tar = $(tar);
	$(window).resize(function () {
		var $sum = 0,
			$winHeight = $(window).height();
		$tar.siblings('div').each(function () {
			var $height = $(this).outerHeight();
			$sum = $sum + $height;
		});
		var $tarheight = $winHeight - $sum;
		$tar.css('height', $tarheight);
	});
}

var popupResizeEndCallbacks = {};
// 각각 open할때의 event로 등록해야 함.
var popupOnResizeEnd = function(tar) {
	return function() {
		popPosition(tar, $popSpeed);
	}
}

//stringToInt
var stringToInt = function(str){
    var n=parseInt(str.replace(/,/g,""));
    return n;
}

// 필터 팝업인지 확인
var _isFilterPopup = function(tar) {
    return $(window).width() <= $mobileSize && $(tar).hasClass('point_filter_pop');
}

// 팝업버튼 타이블
var popBtnTitle = function(){
	$('button, a').each(function(){
		if ($(this).is('[title]')){
			var title = $(this).attr('title');
			if (title.indexOf('팝업') > -1) { $(this).removeAttr('title') }
		}
	})
}

//팝업 열기 함수 (2.0 Version)
var popOpen = function(tar, btn, callback, focused) {
	var $tar;
	if (typeof(tar) == 'string') { $tar = $(tar); $tar.data('param', true); }
	else if (typeof(tar) == 'object'){ $tar = tar; $tar.data('param', true); }
	else if (tar == 'undefind'){ 
		$('.pop_wrap:visible').each(function(){ 
			if (!$(this).data('param')) { $tar == $(this) }
		})
	}
	//if ($tar.length < 1) return console.log(tar, 'pop_wrap 없음');
	
	// ASIS 팝업을 띄우기 위한 처리 
	/*
	if ($tar.children('.popup').length < 1) {
		$tar.children().wrapAll('<article class="popup popup_type01">');
		$tar.find('.popup_head').removeClass('popup_head').addClass('pop_head');
		$tar.find('.popup_content').removeClass('popup_content').addClass('pop_cont');
	}
	*/
	//최근초점 (변수에 저장되기위한 최소의 딜레이가 필요)
	setTimeout(function(){
		if ($('body').hasClass('os_ios')) {
			$popOpenBtn = $docActiveEl;
		} else if ($(btn).closest('.swiper-container')) {
			$popOpenBtn = $(btn);
		} else {
			$popOpenBtn = $(document.activeElement);
		}
		if (typeof($popOpenBtn) != 'object') { 
			$popOpenBtn = $('body');
		}
		if ($popOpenBtn.is('input')) {
			$popOpenBtn.addClass('is_popFocusMove');
		}
	}, 10)

	// 환경설정
	if($tar.data('opened') && $tar.find('.popup').length) return;
	if($tar.find('.popup').length) {$tar.data('opened', true)}
	var $visible = $('.pop_wrap:visible').length;
	if ($visible > 0) { $tar.css('z-index', '+=' + $visible) }
	popOpenScroll();

	// Active
	var $popup = $tar.find('.popup');
	var $popupFocus = null;
	$tar.addClass('is_visible');
	setTimeout(function(){ $tar.addClass('is_active') }, 100);
	/* 
		(2022 웹접근성 수정) 2022.04.08 마재광 추가 s
		기능이 아닌 요소에 tabindex=0을 제공하여 의미없는 초점 이동이 발생
		단, 스크롤 기능이 제공된 레이어 팝업은 제외
	*/
	// ↓↓ 기능이 아닌 요소에 tabindex=0을 제공하여 의미없는 초점 이동이 발생으로 인해 주석
	// $popup.find('.pop_cont').attr('tabindex','0');
	// ↓↓ 스크롤 기능이 제공된 레이어에 tabindex 추가
	var dxPopCont = $popup.find('.pop_cont')
	for(var i = 0; i < dxPopCont.length; i++) {
		var dxPopupContHeight = dxPopCont[i].clientHeight;
		var dxPopupContScrollHeight = dxPopCont[i].scrollHeight;
		dxPopCont.removeAttr('tabindex');
		if(dxPopupContHeight < dxPopupContScrollHeight) {
			$popup.parents('.pop_wrap').addClass('is_scrolled');
			$popup.find('.pop_cont').attr('tabindex','0');
		}
	}
	// (2022 웹접근성 수정) 2022.04.08 마재광 추가 e
	popPosition(tar);
	var isAlertPop = $popup.closest('.pop_wrap').hasClass('pop_confirm') || $popup.closest('.pop_wrap').hasClass('pop_alert');
	var isNoneTitle = $popup.find('.pop_head h3').length == 0;
	var isTitle = $popup.find('.pop_head h3').length > 0;
	if ($popup.find('.pop_focus').length == 0 && $('body').hasClass('mobile')){
		if (isAlertPop){ 
			$tar.removeAttr('role');
			$popup.prepend('<div class="pop_focus" role="text" tabindex="0"><span>웹 경고 대화상자</span></div>');	
		} else if (isNoneTitle) {
			$popup.prepend('<div class="pop_focus" role="text" tabindex="0"><span>레이어 시작</span></div>');	
		} else if (isTitle) {
			$popup.find('.pop_head h3').attr({'tabindex':'0'});
		}
	}
	$tar.removeAttr('aria-modal').find('.popup, .pop_cont').scrollTop(0);
	$tar.off('DOMNodeInserted').on('DOMNodeInserted', '.popup', function(){ popPosition(tar); $popup = $tar.find('.popup') });
	$tar.one('transitionend', function(){
		if ($(this).hasClass('is_active')) {
			// 필터 팝업이 아닌경우
			if(_isFilterPopup(tar) == false) {
				// Tab Swiper 설정
				if ($tar.find('.tab_type01.swiper_tab:visible').length) {
					if ($(btn).is('[data-pop-tabIndex]') == true) { var tabIndex = Number($(btn).attr('data-pop-tabIndex')) } 
					else { var tabIndex = null }
					if (tabSwipingPop != null){ tabSwipingPop = null }
					ui.tabSwiper(tabIndex);
				}
				// TabCont Swiper 설정
				if ($tar.find('.swiper_tabCont:visible').length){ ui.commCertifySwiperPop($tar.attr('id')) }
				// Card Swiper 설정
				if ($tar.find('.card_slider:visible').length){ commCardSwiper() }
				// 셀렉트박스 설정
				ui.selectScroll();
				if ($tar.find('.datepicker.onlyPC').length){ ui.datepickerReset() }
				// 라디오탭 접근성
				$('.check_btn, .radio_btn').each(function(){
					$(this).removeAttr('role aria-selected').children('span').attr('role', 'text');	
				});
				$('.radio_tab_wrap').find('li > label').each(function(){
					$(this).removeAttr('aria-selected');
					$(this).children('input').next('span').attr('role', 'text');
				})

			}

			// 개발코드설정
			$tar.find('input.url_blind').each(function(){
				$(this).attr({'aria-hidden':'true', 'tabindex':'-1'});
			})

			//초점적용
			// if ($tar.hasClass('pop_alert')){ if (!focused) {$popup.find('.pop_btn .btn').focus()}
			// } else { if (!focused) {$popup.focus()} }
			if ($('body').hasClass('pc')){
				$popup.attr('tabindex', '0');
				$popupFocus = $popup;
			} else if ($('body').hasClass('mobile')){
				if ($('.pop_focus').length){ $popupFocus = $('.pop_focus') }
				else if (isTitle) { $popupFocus = $popup.find('.pop_head h3') } 
			}
            if (!$popupFocus) {return false;}
			if (!focused) {$popupFocus.focus()}
			if (callback) { callback }
		}
	})

	// 서브 컨텐츠인 경우
	$tar.find('.pop_sub_cont').each(function(){
		ui.popSubScroll();
	})
	/*
	$('.table_scroll_area:visible').each(function(){ 
		ui.tableScroll.reset();
	})
	*/

	// 프린트 설정 (경고팝업과, 확인팝업 제외)
	if ($tar.hasClass('pop_confirm') == false && $tar.hasClass('pop_alert') == false) {
		$('html, body').addClass('is_popPrint');
		if ($popup.hasClass('pop_card_statement')) { $('html, body').addClass('has_popCardStatement') }
	}

	// 팝업스크롤 높이설정 (IE는 flex로 안됨)	
	$(window).off('resizeEnd.popupResize').on('resizeEnd.popupResize', function(){
		popPosition(tar);
	})

	// 웹접근성 설정
	$tar.removeAttr('aria-labelledby');
	$tar.closest('#wrap').length > 0 ? ui.commonAccess.disable($tar.siblings(), 'modal') : ui.commonAccess.disable($('#wrap'), 'modal');
	ui.commonAccess.disable($('#wrap').prevAll(), 'modal');
	// 팝업이 있는 상태에서 팝업이 뜨는 경우 활성화되어 있는 팝업에 disabled 적용
	if($('.pop-dx').not($tar).hasClass('is_active')) {
		ui.commonAccess.disable($('.pop-dx.is_active'), 'modal');
	}
}

//팝업 닫기 함수 (2.0 Version)
var popClose = function(tar, callback, focused) {
	var $tar;
	if (typeof(tar) == 'string') { $tar = $(tar) } 
	else if (typeof(tar) == 'object'){ $tar = tar }

	$tar.removeData('opened');
	var $visible = $('.pop_wrap:visible').length;
	if ($visible == 1) {
		$('body').removeClass('pop_open');
		$(window).scroll();
	}
	
	/* 개발프로세스에 맞춤 (인터렉션생략) */
	// is_scrolled 추가 $tar.removeClass('is_active is_visible');
	$tar.removeClass('is_active is_visible is_scrolled');
	$tar.find('.popup, .pop_cont').removeAttr('style');
	$tar.find('.popup, .pop_cont').scrollTop(0);

	if ($('div.quickSrch_wrap.is_visible').length == 0){
		popCloseScroll();
	}

	/* 개발에서 닫기 후 삭제하고 있어서 트랜지션 사용불가
	$tar.removeClass('is_active');
	$tar.one('transitionend', function(){
		if (!$(this).hasClass('is_active')){
			$tar.find('.popup, .pop_cont').removeAttr('style');
			$tar.find('.popup, .pop_cont').scrollTop(0);
			$tar.removeClass('is_visible');
		}
	})
	*/

	// 프린트 설정
	$('html, body').removeClass('is_popPrint has_popCardStatement');

	// 접근성 호출
	// $tar.closest('#wrap').length > 0 ? ui.commonAccess.enable($tar.siblings(), 'modal') : ui.commonAccess.enable($('#wrap'), 'modal');
	// ui.commonAccess.enable($('#wrap').prevAll(), 'modal');
	/* 2023 접근성 iOS 사파리에서 포커스 문제로 setTimeout 추가 s */
	if($('.pop_wrap.is_active').length == 0) {
		// 팝업이 하나만 오픈 된 경우 enable 적용
		if(isMobile.iOS()) {
			setTimeout(function(){
				$tar.closest('#wrap').length > 0 ? ui.commonAccess.enable($tar.siblings(), 'modal') : ui.commonAccess.enable($('#wrap'), 'modal');
				ui.commonAccess.enable($('#wrap').prevAll(), 'modal');
			},200);
		} else {
			$tar.closest('#wrap').length > 0 ? ui.commonAccess.enable($tar.siblings(), 'modal') : ui.commonAccess.enable($('#wrap'), 'modal');
			ui.commonAccess.enable($('#wrap').prevAll(), 'modal');
		}
	} else {
		// 팝업이 2개이상 오픈 된 경우 enable 적용(3개 이상은 고려되지 않음)
		ui.commonAccess.enable($('.pop_wrap.is_active').not($tar), 'modal');
	}
	$('.swiper-container').each(function(i){
		if ($(this).hasClass('date_swipe_group')){ ui.swiperAccess($(this)) }		
	})
	if ($('body.mobile .main_index').length) {
		ui.mainPrallexInit();
	}

	if (typeof(callback) == 'function'){ callback() }
	else if (callback != 'undefined') { callback }
	if (!focused && typeof($popOpenBtn) == 'object'){
		if ($popOpenBtn.closest('button') == true) { $popOpenBtn = $popOpenBtn.closest('button'); }
		else if ($popOpenBtn.closest('a') == true) { $popOpenBtn = $popOpenBtn.closest('a'); }
		/* 2023 접근성 iOS 사파리에서 포커스 문제로 setTimeout 추가 s */
		// 기존소스 $popOpenBtn.attr('tabindex', '0').focus();
		if(isMobile.iOS()) {
			setTimeout(function() {$popOpenBtn.attr('tabindex', '0').focus()},300);
		} else {
			$popOpenBtn.attr('tabindex', '0').focus();
		}
		/* 2023 접근성 iOS 사파리에서 포커스 문제로 setTimeout 추가 e */

		$('.autoComplete_wrap.is_visible').each(function(e){
			$(this).data('focused', false);
		})
	} else {
		// focused가 있는 경우 포커스 보내기 위해 추가
		$(focused).attr('tabindex', '0').focus();
    }
    // ui.skipNav(); //20240821 테스트
}			

/* Ver1.0 접근성의 호환성고려가 안되어있음.
var popScrolling = false;
var popOpenScroll = function () {
	$('body').removeAttr('style');
	if (popScrolling == false) {
		popScrolling = true;
		if ($(window).width() <= $mobileSize) {
			var $winScrollTop = $(window).scrollTop();
			$('body').css('top', -$winScrollTop);
		}
	}
};

var popCloseScroll = function () {
	var $visible = $('.pop_wrap:visible').length;
	if (popScrolling == true && $visible <= 1) {
		popScrolling = false;
		var $bodyTop = Math.abs(parseInt($('body').css('top')));
		if ($bodyTop > 0) {
			$('body').removeAttr('style');
			$(window).scrollTop($bodyTop);
		}
	}
};
*/

// Ver2.0
var popScrolling = false;
var bodyScrollTop;
var popOpenScroll = function () {
	if (popScrolling == false) {
		bodyScrollTop = $(window).scrollTop();
		$('html, body').addClass('pop_open');
		$('#wrap').css({'position':'relative', top:bodyScrollTop*(-1)});
		popScrolling = true;
	} 
};

var popCloseScroll = function () {
	var $visible = $('.pop_wrap:visible').length;
	//팝업이 있을때
	if (popScrolling == true && $visible <= 1) {
		$('html, body').removeClass('pop_open');
		$('#wrap').removeAttr('style');
		$(window).scrollTop(bodyScrollTop);
		popScrolling = false;
	}	
};

var setTimePosition;
var popPosition = function (tar, speed) {
	if ($('body').hasClass('msie')){
		clearTimeout(setTimePosition);
		setTimePosition = setTimeout(function(){
			// Elements
			var $tar; 
			if ($(tar).length){ $tar = $(tar); } 
			else if ($('.pop_wrap:visible').length) { $tar = $('.pop_wrap:visible') }
			if ($tar != null) {
				var $pop = $tar.not('.pop_alert, .pop_confirm').find('.popup'),
					$popCont = $pop.find('.pop_cont:visible'),

				// Position
					popH = $pop.outerHeight();
					popMaxH = parseInt($pop.css('max-height'));
					popHeadH = 0,
					popBtnH = 0,
					popScrH = $popCont.prop('scrollHeight'),
					popConH = $popCont.outerHeight(),
					popSelect = 0;

				if (popMaxH > popH + (popScrH - popConH) ){ popMaxH = popH + (popScrH - popConH);console.log('팝업체크: 최대높이보다 작음');}
				if ($(window).height() < parseInt($pop.css('max-height'))){ popMaxH = $(window).height() - 20;console.log('팝업체크: 창보다크고, 최대높이보다 큼')}
				if ($pop.find('.pop_head').length){ popHeadH = $pop.find('.pop_head').outerHeight() + parseInt($pop.find('.pop_head').css('margin-bottom'))} else { popHeadH = 0 }
				if ($pop.find('.pop_btn').length){ popBtnH = $pop.find('.pop_btn').outerHeight() } else { popBtnH = 0 }
				if ($pop.find('> .select_wrap').length){ popSelect = $pop.find('> .select_wrap').outerHeight() } else { popSelect = 0 }
				
				//if ($())
				var calcH = 'calc(100% - '+(popHeadH + popBtnH + popSelect)+'px)';
				$pop.css({height: popMaxH});
				$popCont.css({height: calcH});
			}
		},100);
	}
}
	/*
	if ($('body').hasClass('msie')){
		// Elements
		var $wrapH = $(tar).height(),
			$pop = $(tar).find('.popup'),
			$popCont = $pop.find('.pop_cont:visible'),

		// Position
			popH = $pop.outerHeight();
			popHeadH = 0,
			popBtnH = 0,
			popSelect = 0;
		
		if ($pop.find('.pop_head').length){ popHeadH = $pop.find('.pop_head').outerHeight() + parseInt($pop.find('.pop_head').css('margin-bottom'))} else { popHeadH = 0 }
		if ($pop.find('.pop_btn').length){ popBtnH = $pop.find('.pop_btn').outerHeight() } else { popBtnH = 0 }
		if ($pop.find('> .select_wrap').length){ popSelect = $pop.find('> .select_wrap').outerHeight() } else { popSelect = 0 }
		$popCont.css({height: popH - popHeadH - popBtnH - popSelect});
	}
	*/

	/* 설정불필요 삭제대기 (에러를 고려해서 실행코드만 숨김)
	setTimeout(function () {
		var $wrapH = $(tar).height(),
			$pop = $(tar).find('.popup'),
			$popCont = $pop.find('.pop_cont'),
			$popBtn = $pop.find('.pop_btn');

		//$popCont.removeAttr('style');
		$popCont.attr({ 'tabindex': '0' });

		var $popH = $pop.outerHeight();
        var $mT = Math.max(0, ($wrapH - $popH) / 2);

        if(_isFilterPopup(tar)) {
			$mT = Math.max(0, $wrapH - $popH);
        }

	    var $popContT = $popCont.position().top;
		var $popContH = $popCont.outerHeight();
		var $popBtnH = $popBtn.outerHeight() || 0;
	    var $popContMaxH = Math.max(0, ($popH - $popContT - $popBtnH));

        if ($(window).width() <= $mobileSize && $(tar).hasClass('large')) {
            $mT = 0;
        }
        
		if ($popContH > $popContMaxH) $popCont.css({ 'height': $popContMaxH });

		if (speed > 100) {
			$pop.stop().animate({ 'margin-top': $mT }, speed);
		} else {
			$pop.css({ 'margin-top': $mT });
		}
	}, 100);
	*/

//툴팁 열기
var openTooltip = function(tar, btn){
    var $target = $(tar);
    var $tooltip = $target.find(".tooltip_box");
    var $btn = $(btn);
    var posLeft;
    var posTop;
    var posBtm;
	var setTime;
	var events;

	var resizePos = function(){
		if ($(window).width() > 1100) {
			posLeft = $btn.offset().left + 1;
			//위로 노출(기본값)
			posTop = $btn.offset().top - $target.outerHeight() - 12;
			//아래로 노출
			if ($btn.attr('data-vertical') == 'down') {
				posTop = $btn.offset().top + $btn.outerHeight() + 12;
			}
			// content에 있을때
			if ($target.closest('.contents').length) {
				posTop = posTop - $(header).outerHeight();
			}
			//console.log(posLeft, ($(window).width()/2));
			if (posLeft > $(window).width()/2) { posLeft = posLeft - 383 } //가운데보다 오른쪽인경우
			$target.stop().animate({top: posTop, left: posLeft }, 0);
		} else {
			var gapHor = 20;
			var gapVer = 8;

			posHeh = $target.outerHeight();
			posCen = $btn.offset().top + ($btn.outerHeight()/2);
			posTop = $(document).height() - $btn.offset().top;
			posBtm = $btn.offset().top + $btn.outerHeight();
			posWin = $(window).scrollTop() + ($(window).height()/2);
			if ($target.closest('.contents').length) {
				posBtm = posBtm - $(header).outerHeight();
			}

			$target.animate({top: posBtm + gapVer, left: gapHor, right: gapHor }, 0);

			if (posCen > posWin && $btn.attr('data-vertical') != 'down') {
				//$target.css({top: 'auto'});
				$target.animate({top: posBtm + gapVer - $target.outerHeight() - 50, left: gapHor, right: gapHor }, 0);
			}
		}
	}

	resizePos();
	if (isPcOnly) { events = 'scroll' } else { events = 'resize scroll' }
	$(window).on(events, function(){
		clearTimeout(setTime);
		setTime = setTimeout(function(){ resizePos() }, 100);
	});

	$('.tooltip_wrap:visible').not(tar).find('.btn_close').trigger('click');
    $target.fadeIn(300, function () {
        /* 2023 접근성 수정 */
		$target.find('.tooltip_cont').attr('tabindex', 0).focus();
		// 기존소스 주석 $target.find('.tooltip_cont').attr({'tabindex': 0, 'role': 'text' }).focus();
    });

	if ($target.parent('.contents').length === 0 && $target.closest('.contents').length === 1) {
		$target.appendTo('.contents');
	}

    closeTooltip(tar, btn);
};
$(document).off('click.tooltip focusin.tooltip').on('click.tooltip focusin.tooltip', function(e){
	if ($('.tooltip_wrap:visible').length && $('.tooltip_wrap:visible').has(e.target).length == 0 && $('.btn_tooltip').has(e.target).length == 0 && $(e.target).hasClass('btn_tooltip') == false && $(e.target).hasClass('tooltip_wrap') == false) {
		// service-2020.js에서 .btn_close 클릭 시 팝업을 닫는 로직으로 인해 .btn_tooltip_close로 닫기 추가
		if($('.tooltip_wrap:visible').find('.btn_close').length !== 0) {
			$('.tooltip_wrap:visible').find('.btn_close').trigger('click');
		} else {
			$('.tooltip_wrap:visible').find('.btn_tooltip_close').trigger('click');
		}
		//console.log($('.tooltip_wrap:visible').has(e.target).length == 0, $('.btn_tooltip').has(e.target).length == 0, $(e.target).hasClass('btn_tooltip') == false);
	}
})

//툴팁 닫기
var closeTooltip = function(tar, btn, state){
    var $target = $(tar);
    var $tooltip = $target.find(".tooltip_box");
    var $btnClose = $target.find(".btn_close");
    var $btn = $(btn);

    $btnClose.off('click.pub').on({
        "click.pub" : function(){
            $target.fadeOut(300, function(){
				if ($('.tooltip_wrap:visible').length == 0) { $btn.focus() }
            });
        }
    });
};

// 단순 아코디언 토글
var moreinfoExpend = function(target, btn){
    var $btn = $(btn);
    var $target = $(target);
    $btn.toggleClass("open");
    $target.stop().slideToggle();
}
//팝업 포커싱 관련 수정으로 인한 주석처리 2019.01.10 이태행
$(document).off('click.popCloseBtn').on('click.popCloseBtn', '.ui-pop-close', function (e) {
	var $pop = $(this).closest('.pop_wrap');
	var $popupBindView = $(e.currentTarget).closest('[data-bind-view]');
	var $close = $popupBindView.data('$close');

	if ($close){ $close() } 
	else { popClose($pop, $popOpenBtn) }
});

// 이메일 폼
$(document).off('input.inputEmail').on('input.inputEmail', '.input-email', function(e) {
	var $input = $(this);
	var $list = $input.siblings('.input-email-list');
	if(/\@$/.test($input.val())) {
		$list.show().addClass('is_visible');
	} else {
		$list.hide().removeClass('is_visible');
	}
});

$(document).off('click.inputEmail').on('click.inputEmail', '.input-email-list li', function(e) {
	var $el = $(this);
	var $input = $el.parent().siblings('.input-email');
	var $list = $input.siblings('.input-email-list');
	var val = $input.val();
	var posOfAt = val.indexOf('@');
	$input.val(val.substring(0, posOfAt + 1) + $el.text());
	$list.hide().removeClass('is_visible');
	$input.focus();
	e.preventDefault();
});
$(document).off('focusin.inputEmail').on('focusin.inputEmail', '.input-email-list li', function(e) {
	$(this).addClass('is_focused').siblings().removeClass('is_focused');
});
$(document).off('focusout.inputEmail').on('focusout.inputEmail', '.input-email-list li', function(e) {
	$(this).removeClass('is_focused');
});
$(document).off('click.inputEmail2 focusin.inputEmail2').on('click.inputEmail2 focusin.inputEmail2', function(e) {
	if ($('.input-email-list').has(e.target).length === 0 && $(e.target).hasClass('input-email') == false) {
		$('.input-email-list').hide().removeClass('is_visible');
	}
});
$(document).off('focusin.inputCheck').on('focusin.inputCheck', 'input[type="checkbox"], input[type="radio"]', function(){
	$(this).closest('label').addClass('is_focused').css({'z-index':'1'});
});
$(document).off('focusout.inputCheck').on('focusout.inputCheck', 'input[type="checkbox"], input[type="radio"]', function(){
	$(this).closest('label').removeClass('is_focused').removeAttr('style');
});
$(document).keyup(function(e){
	if (e.keyCode == 38) {
		$('.input-email-list li.is_focused').each(function(){
			if ($(this).prev().length) { $(this).prev().children('a').focus() }
		});
	}
	if (e.keyCode == 40) {
		$('.input-email-list li.is_focused').each(function(){
			if ($(this).next().length) { $(this).next().children('a').focus() }
		});
	}
	if (e.keyCode == 27) {
		/* 2024.11.07 2개 이상인 경우에도 ESC를 누르면 모든 팝업이 닫히게 되어 개발 요청(이주희)으로 수정
		$('.pop_wrap:visible').each(function(){
			popClose($(this));
		}) */
		var popVisible = $('.pop_wrap:visible');
		var popVisible_max = 0;
		var popVisible_maxIndex = null;
		popVisible.each(function(i){
			var z = $(this).css('z-index');
			if(z > popVisible_max){
				popVisible_max = z;
				popVisible_maxIndex = i;
			}
		});
		if(popVisible.length > 0){
			var popVisibleClose = $('.pop_wrap:visible').eq(popVisible_maxIndex);
			popClose($(popVisibleClose));
		}
	}
})

// 카드상세 탭영역 
$(document).ready(function(){
	$(".btn_move").on({
		"click" : function(e){
			e.preventDefault();
			var $targetIdx = $(this).parent().index()+1;
			var $swiper = $(".tab_type01 .tab_list li").eq($targetIdx).find("a").trigger("click");
		}
	});
});

// 입력제한 
!function() {
	function removeCharUsingPattern(re, element) {
		var $el = $(element);
		var inputVal = $el.val();
		if(re.test(inputVal)) {
			$el.val(inputVal.replace(re,''));
		}
	}

	//영문,한글만
	$(document).on("input.pattern", 'input.onlyAlphaHangul', function(e) {
		removeCharUsingPattern(/[^a-zA-Z가-힣ㄱ-ㅎㅏ-ㅣ\u318D\u119E\u11A2\u2022\u2025\u00B7\uFE55]/g, this);
	});

	//숫자만
	$(document).on('input.pattern', 'input.onlyNumber', function(e) {
		removeCharUsingPattern(/[^0-9]/g, this);
	});

	//영문자만
	$(document).on('input.pattern', 'input.onlyAlpha', function(e) {
		removeCharUsingPattern(/[^a-zA-Z]/g, this);
	});

	//영문,숫자만
	$(document).on('input.pattern', 'input.onlyAlphaNumber', function(e) {
		removeCharUsingPattern(/[^a-zA-Z0-9]/g, this);
	});

	//한글만
	$(document).on('input.pattern', 'input.onlyHangul', function(e) {
		removeCharUsingPattern(/[^가-힣ㄱ-ㅎㅏ-ㅣ\u318D\u119E\u11A2\u2022\u2025\u00B7\uFE55]/g, this);
	});

	//한글,영문,숫자만
	$(document).on('input.pattern', 'input.notSpecial', function(e) {
		removeCharUsingPattern(/[^0-9a-zA-Z가-힣ㄱ-ㅎㅏ-ㅣ\u318D\u119E\u11A2\u2022\u2025\u00B7\uFE55]/g, this);
	});

	//사용자 패턴
	$(document).on('input.pattern', 'input[data-pattern]', function(e) {
		var pattern = $(this).data('pattern');
		var re = new RegExp(pattern, 'g');
		removeCharUsingPattern(re, this);
	});
}();

/* ------------------------------------------------------
	카드상세 공통
-------------------------------------------------------*/
// 비교카드 비교설정
function cardCompareInit() {
	if (cardItemsLens > 0) {
		$('#cardCompare').addClass('active');
		$('#cardCompareAfter').addClass('compare_gapt');
	} else {
		$('#cardCompare').removeClass('active');
		$('#cardCompareAfter').removeClass('compare_gapt');
	}
}
//카드비교
function cardCompare(id) {
	var $ele = $(id);
	var $eleChild = $('.banner_cont, .banner_dimmed');
	var $eleBtn = $ele.find('.top_banner button');
	var $eleBtnTxt = $ele.find('.top_banner button .arrow');
	var clsActive = 'opened';
	if ($ele.hasClass(clsActive)) {
		$ele.removeClass(clsActive);
		setTimeout(function() { 
			$eleChild.hide();
			$eleBtn.attr({'aria-expanded': 'false'});
			$eleBtnTxt.text('열기');
			$eleBtn.focus();
			cardCompareInit();
			popCloseScroll();
		}, 300);
	} else {
		$eleChild.show();
		setTimeout(function() { 
			$ele.addClass(clsActive);
			$eleBtn.attr({'aria-expanded': 'true'});
			$eleBtnTxt.text('닫기');
			popOpenScroll();
		}, 10);
	}
}

// 비교상품 삭제
function cardCompareDel(btn){
	var $btn = $(btn);
	$btn.closest('.item').next('.card_img').removeClass('hidden');
	$btn.closest('.item').remove();
	cardItemsLens = $('.compare_card_list').find('.item').length;
	if ($('.compare_card_list').find('.item').length == 0) {
		setTimeout(function(){ cardCompare("#cardCompare"); }, 600);
	}
}

//카드정보 스와이퍼(퍼블에서만 실행함)
function commCardSwiper2() {
	$('.card_swiper').each(function(i){
		console.log(i);
		$(this).attr('id', 'cardSwiper'+i);
		var ele = '#cardSwiper'+i;
		cardInfoSwiper[i] = new Swiper(ele + ' .swiper-container', {
			watchSlidesVisibility: true,
			pagination: ui.pageChangeOption(ele), // slide 개수에 따라서 옵션적용
			watchSlidesVisibility: true,
			navigation: {
				nextEl: '.nav-button-next',
				prevEl: '.nav-button-prev',
			},
			on: {
				init: function () {
					ui.swiperAccess($(ele + ' .swiper-container'));
				},
				slideChangeTransitionStart: function () {
					ui.swiperAccess($(ele + ' .swiper-container'));
				}
			}
		});
	})
}
//카드상세 스와이퍼
function commCardSwiper() {
	var eleSwiper = '.card_slider';
	$(eleSwiper).each(function(i){
		$(this).attr('id', 'cardSwier'+i);
		var $eleSwiper = $('#cardSwier'+i);
		var $eleSwiperContainer = $('#cardSwier'+i+ ' .swiper-container');
		var $eleSwiperSlide = $('#cardSwier'+i+ ' .swiper-slide');
		var clsNoSwiper = 'no_swiper';
		if ($(eleSwiper+':visible').find('.swiper-slide').length > 1){
			$eleSwiper.removeClass(clsNoSwiper);
			cardDetailSwiper = new Swiper('#cardSwier'+i+ ' .swiper-container', {
				slidesPerView: 'auto',
				spaceBetween: 60,
				centeredSlides: true,
				//allowTouchMove: false,
				watchSlidesVisibility: true,
				navigation: {
					nextEl: eleSwiper+ ' .nav-button-next',
					prevEl: eleSwiper+ ' .nav-button-prev',
				},
				pagination: ui.pageChangeOption('#cardSwier'+i+ ' .swiper-container'),
				on: {
					init: function(){ 
						ui.swiperAccess($eleSwiperContainer, 'centered');
					},
					slideChangeTransitionStart: function(){ 
						ui.swiperAccess($eleSwiperContainer, 'centered');
					},
					resize: function(){ 
						ui.swiperAccess($eleSwiperContainer, 'centered');
					},
				}
			});
		} else {
			$eleSwiper.addClass(clsNoSwiper);
		}
	})
}
function cardFloating(){
	var wW;
	var swW = 1100;
	var start = 100;
	var $targetBtn = $(".m_floatiing_box");/*19.12.12 수정*/
	$(window).on({
		"scroll" : function(){
			var scrollTop = $(window).scrollTop();

			wW = $(window).outerWidth();
			if(wW < swW){
				if(scrollTop > start){
					$targetBtn.fadeIn(200);
				}else{
					$targetBtn.fadeOut(200);
				}
			}else{
				$targetBtn.hide();
			}
		},
		"resize" : function(){
			var wW = $(window).outerWidth();
			if(wW > swW){
				$targetBtn.hide();
			}
		}
	});
}

//My DIY 인터렉션
(function($){
	var $win = $(window);

	/* swiper 선언문 */
	function sliderInit() {
		var sliderFn = {
			sliderChartInit: function() { 
				// MDPFM120C06 - 원그래프 슬라이더
				var $slider = $('[data-slider="type01"]');
				var animateEventHandler = function() {
					var $slide = $(slider.slides),
						$activeSlide = $slide.slice(slider.activeIndex, slider.activeIndex + slider.params.slidesPerGroup),
						$inactiveSlide = $slide.not($activeSlide);

					if ($slider.visible()) {
						// 화면에 보여지면 원그래프 활성화
						$activeSlide.find('[data-chart="circle"]').addClass('is_active');		// 현재 active slide의 내부 그래프 활성화
						$inactiveSlide.find('[data-chart="circle"]').removeClass('is_active');	// 현재 inactive slide의 내부 그래프 비활성화
					} else { 
						// 화면에서 가려지면 원그래프 비활성화
						$slide.find('[data-chart="circle"]').removeClass('is_active');
					}
				}

				if ($slider.length) {
					var slider = new Swiper($slider, {
						slidesPerView: 5,
						slidesPerGroup: 5,
						spaceBetween: 48,
						observer: true,
						observeParents: true,
						watchSlidesVisibility: true,
						navigation: {
							nextEl: $slider.siblings('.swiper-button-next'),
							prevEl: $slider.siblings('.swiper-button-prev')
						},
						breakpoints: {
							1100: {
								slidesPerView: 4,
								slidesPerGroup: 4,
								spaceBetween: 0,
							}
						},
						on: {
							init: function(){ 
								ui.swiperAccess($slider);
							},
							slideChangeTransitionStart: function(){ 
								ui.swiperAccess($slider);
							},
							resize: function(){ 
								ui.swiperAccess($slider);
							},
						}
					});

					$win.on('scroll.slider resize.slider', animateEventHandler);	// 스크롤 또는 리사이즈 후 그래프 에니메이션 이벤트
					slider.on('slideChangeTransitionEnd', animateEventHandler);		// 슬라이딩 후 그래프 에니메이션 이벤트

					animateEventHandler();
				}
			},
			sliderMainInit: function() {
				// MDPFM101R01 - '나를 잘 아는 적립 추천' 슬라이드 선언
				var $slider = $('[data-slider="main_1"]');

				if ($slider.length) {
					var $controller = $slider.siblings('.controll_wrap');
					var slider = new Swiper($slider, {
						init: false,
						slidesPerView: 5,
						centeredSlides: true,
						spaceBetween: 8,
						loop: true,
						observer: true,
						observeParents: true,
						watchSlidesVisibility: true,
						autoplay: {
							delay: 4000
						},
						navigation: {
							nextEl: $slider.siblings('.swiper-button-next'),
							prevEl: $slider.siblings('.swiper-button-prev')
						},
						pagination: {
							el: $controller.find('.swiper-pagination'),
							type: 'fraction',
							renderFraction: function(currentClass, totalClass) {
								return '<span class="' + currentClass + '"></span>' +
									'/' +
									'<span class="' + totalClass + '"></span>';
							}
						},
						breakpoints: {
							1100: {
								slidesPerView: 1
							}
						},
						on: {
							init: function(){ 
								ui.swiperAccess($slider);
							},
							slideChangeTransitionStart: function(){ 
								ui.swiperAccess($slider);
							},
							resize: function(){ 
								ui.swiperAccess($slider);
							},
						}
					});

					// 슬라이딩 후 원 그래프 활성화
					var slideChangeEventHandler = function() {
						var $chart = $slider.find('[data-chart="circle"]'),
							chartValue = $(slider.slides[slider.activeIndex]).data('chartValue');

						$chart.removeClass('is_active');
						$chart.attr('data-chart-value', chartValue);
						$chart.find('.per_num').text(chartValue);
						setTimeout(function() {
							$chart.addClass('is_active');
						}, 100);
					}

					// play, stop 버튼 기능
					var slidePlayEventHandler = function() {
						if (slider.autoplay.running) {
							slider.autoplay.stop();
						} else {
							slider.autoplay.start();
						}
					}

					slider.on('init', slideChangeEventHandler);
					slider.on('slideChange', slideChangeEventHandler);
					slider.on('autoplayStart', function() {
						$controller.find('.swiper-button-play').addClass('is_active');
					});
					slider.on('autoplayStop', function() {
						$controller.find('.swiper-button-play').removeClass('is_active');
					});
					$controller.find('.swiper-button-play').on('click', slidePlayEventHandler);

					slider.init();
				}
			},
			sliderLogoInit: function() {
				// MDPFM101R01 - '멀티 멤버십' 슬라이드 선언
				var $slider = $('[data-slider="main_2"]');

				if ($slider.length) {
					var $activeImg = $('.active_img'),
						$controller = $slider.siblings('.controll_wrap');
					var slider = new Swiper($slider, {
						init: false,
						slidesPerView: 'auto',
						centeredSlides: true,
						speed: 500,
						loop: true,
						observer: true,
						observeParents: true,
						allowTouchMove: false,
						loopAdditionalSlides: 3,
						autoplay: {
							delay: 3000
						},
						navigation: {
							nextEl: $slider.siblings('.swiper-button-next'),
							prevEl: $slider.siblings('.swiper-button-prev')
						},
						pagination: {
							el: $controller.find('.swiper-pagination'),
							type: 'fraction',
							renderFraction: function(currentClass, totalClass) {
								return '<span class="' + currentClass + '"></span>' +
									'/' +
									'<span class="' + totalClass + '"></span>';
							}
						},
						on: {
							init: function(){ 
								ui.swiperAccess($slider);
							},
							slideChangeTransitionStart: function(){ 
								ui.swiperAccess($slider);
							},
							resize: function(){ 
								ui.swiperAccess($slider);
							},
						}
					});

					// 고정된 active slide의 너비 때문에 각 slide의 위치 수정
					var slideChangeEventHandler = function() {
						var $slides = $(slider.slides),
							$activeSlide = $(slider.slides[slider.activeIndex]);

						$slides.css({
							transform:''
						});
						$activeSlide.prevAll().css({
							transform:'translateX(-92px)'
						});
						$activeSlide.nextAll().css({
							transform:'translateX(92px)'
						});
					}

					// play, stop 버튼 기능
					var slidePlayEventHandler = function() {
						if (slider.autoplay.running) {
							slider.autoplay.stop();
						} else {
							slider.autoplay.start();
						}
					}

					slider.on('init', slideChangeEventHandler);
					slider.on('slideChange', slideChangeEventHandler);
					slider.on('autoplayStart', function() {
						$controller.find('.swiper-button-play').addClass('is_active');
					});
					slider.on('autoplayStop', function() {
						$controller.find('.swiper-button-play').removeClass('is_active');
					});

					// 흰색 로고의 next 슬라이딩 구현
					slider.on('slideNextTransitionStart', function() {
						$activeImg.find('li').eq(slider.realIndex).stop().animate({'left': '156px'});
						$activeImg.find('li').eq(slider.realIndex - 1).stop().animate({'left': '-123px'});
					});

					// 흰색 로고의 prev 슬라이딩 구현
					slider.on('slidePrevTransitionStart', function() {
						$activeImg.find('li').not(':eq('+ (slider.realIndex + 1) + ')').css({left:'-123px'});
						$activeImg.find('li').eq(slider.realIndex).stop().animate({'left': '156px'});
						$activeImg.find('li').eq(slider.realIndex + 1).stop().animate({'left': '100%'});
					});

					// 흰색 로고의 슬라이딩 후 위치 초기화
					slider.on('transitionEnd', function() {
						$activeImg.find('li').not(':eq('+ slider.realIndex + ')').css({left:'100%'});
					});
					$controller.find('.swiper-button-play').on('click', slidePlayEventHandler);

					slider.init();
				}
			}
		}

		sliderFn.sliderChartInit();
		sliderFn.sliderLogoInit();
		sliderFn.sliderMainInit();
	}

	function mainPickInit() {
		// MDPFM101R01 - 'My Pick 서비스' 에니메이션 구현
		var $pick = $('.pick');

		if ($pick.length) {
			$win.on('scroll.pick', function() {
				if ($pick.visible()) {
					var $countWrap = $pick.find('.pick_count');

					$win.off('scroll.pick');
					$pick.addClass('is_active');
					
					// pick 서비스 박스 호출 완료 후 이벤트
					$countWrap.on('transitionend oTransitionEnd webkitTransitionEnd', function(e) {
						var $count = $countWrap.find('.count'),
							count = 1;

						// 3 -> 6 -> 9 숫자 변경
						var interverEventHandler = function() {
							$count.stop().animate({
								'opacity': '0'
							}, 2000, function() {
								count++;

								$count.css({'opacity': '1'});
								$count.html(count * 3);
								
								count != 3 && interverEventHandler();
							});
						};

						setTimeout(interverEventHandler, 500);
					});
				}
			});
		}
	}

	function mainVisualInit() {
		// MDPFM101R01 - 상단 비쥬얼 슬라이드 구현
		var $keyVisual = $('.key_visual');

		if ($keyVisual.length) {
			var $slider = $keyVisual.find('.visual_slider'),
				$content = $keyVisual.find('.visual_content'),
				$controller = $keyVisual.find('.controll_wrap'),
				itemLen = $slider.find('.visual_item').length,
				repeat = null;

			var slider = new Swiper($slider.find('.swiper-container'), {
				init: false,
				loop: true,
				autoplay: {
					delay: 10000
				},
				observer: true,
				observeParents: true,
				navigation: {
					nextEl: $slider.find('.swiper-button-next'),
					prevEl: $slider.find('.swiper-button-prev')
				},
				pagination: {
					el: $controller.find('.swiper-pagination'),
					type: 'fraction',
					renderFraction: function(currentClass, totalClass) {
						return '<span class="' + currentClass + '"></span>' +
							'/' +
							'<span class="' + totalClass + '"></span>';
					}
				}
			});

			// swiper 구현 시 슬라이드가 한개인 경우 - autoplay 정지 및 좌우 버튼과 페이징 hide
			var initEventHandler = function() {
				if (itemLen === 1) { 
					slider.autoplay.stop();
					slider.allowTouchMove = false;
					$controller.hide();
					$slider.find('[class^="swiper-button"]').hide();
				}
			}

			// 비쥬얼 에니메이션 초기화
			var removeVisualEventHandler = function() {
				var $wave = $keyVisual.find('.wave'),
					$sortList = $keyVisual.find('.sort_list'),
					$countList = $keyVisual.find('.count_list');

				clearInterval(repeat);

				$wave.clearQueue().stop();
				$wave.removeAttr('style');
				$sortList.removeAttr('style');
				$countList.removeAttr('style');

				$sortList.find('li').removeClass('is_active active');
				$countList.find('li').removeClass('is_active active');
			}

			// 비쥬얼 에니메이션 구현
			var visualEventHandler = function() {
				var $activeSlider = $(slider.slides[slider.activeIndex]),
					$wave = $activeSlider.find('.wave'),
					$sortList = $activeSlider.find('.sort_list'),
					$countList = $activeSlider.find('.count_list'),
					count = 0, gap = 50, wW = 0;

				wW = $(window).width();

				repeat = setInterval(function() {
					var sortTop = parseInt($sortList.css('top')),
						countTop = parseInt($countList.css('top'));

					// 포인트 종류 리스트 위로 움직이는 에니메이션 구현

					if(wW <= 1100){
						gap = 30;
					}

					$sortList.css({
						//top: sortTop - 50 + 'px'
						top: sortTop - gap + 'px'
					});

					// 포인트 종류 리스트 투명도 에니메이션 구현
					$sortList.find('li:eq(' + count + ')').prev().prev().removeClass('is_active active');
					$sortList.find('li:eq(' + count + ')').prev().addClass('active');
					$sortList.find('li:eq(' + count + ')').addClass('is_active');

					// 포인트 값 리스트 투명도 에니메이션 구현
					$countList.find('li:eq(' + count + ')').prev().removeClass('is_active');
					$countList.find('li:eq(' + count + ')').addClass('is_active');
					
					count++;

					if (count == 7) {
						// 마지막 에니메이션 - 포인트 종류 리스트 투명도 0
						$sortList.find('li').removeClass('is_active active');
						clearInterval(repeat);
					} else if (count < 7) {
						// 포인트 값 리스트 위로 움직이는 에니메이션 구현
						$countList.css({
							top: countTop - 100 + 'px'
						});
					}
				}, 1000);

				// 파도 움직임
				$wave.stop().animate({
					'left': '-15px',
					'top': '103px'
				}, 1500, 'linear')
				.animate({
					'left': '-105px',
					'top': '95px'
				}, 1000, 'linear')
				.animate({
					'left': '-195px',
					'top': '21px'
				}, 1500, 'linear')
				.animate({
					'left': '-285px',
					'top': '13px'
				}, 1000, 'linear')
				.animate({
					'left': '-375px',
					'top': '-61px'
				}, 1500, 'linear');
			}

			var resizeVisualEventHandler = function(){
				removeVisualEventHandler();

				var wW = $(window).width();
				setTimeout(function(){
					if(wW == $(window).width()){
						visualEventHandler();
					}
				}, 250);
			}

			slider.on('autoplayStart', function() {
				$slider.find('.swiper-button-play').addClass('is_active');
			});
			slider.on('autoplayStop', function() {
				$slider.find('.swiper-button-play').removeClass('is_active');
			});

			// 슬라이딩 시작 시 비쥬얼 에니메이션 초기화
			slider.on('slideChangeTransitionStart', removeVisualEventHandler); 
			
			// 슬라이딩 완료 시 비쥬얼 에니메이션 시작
			slider.on('slideChangeTransitionEnd', visualEventHandler);
			slider.on('resize', resizeVisualEventHandler);
			slider.on('init', initEventHandler);
			slider.init();

			var slidePlayEventHandler = function() {
				if (slider.autoplay.running) {
					slider.autoplay.stop();
				} else {
					slider.autoplay.start();
				}
			}

			$slider.find('.swiper-button-play').on('click', slidePlayEventHandler);
		}
	}

	/* 클릭 시 스크롤 위치 이동 기능 */
	function scrollMoveInit() {
		// MDPFM120C06
		/*
		클릭 요소에 data-js="scroll" data-target="스크롤 타겟의 .class or #id"
		*/
		var $anchor = $('[data-js="scroll"]');

		$anchor.on('click', function(e) {
			var $this = $(this),
				$target = $($this.data('target'));
				$header = $("#header").outerHeight();

				//console.log($header);
			$('html, body').stop().animate({
				scrollTop: $target.offset().top - $header
			}, 500);

			e.preventDefault();
		});	
	}

	/* 적립율 계산 함수 */
	function rateChangeInit() {
		// MDPFM120C06
		var $list = $('.multi_list');

		if ($list.length) {
			var $item = $list.find('li'),
				allValue = 0;

			// 초기 적립율 계산
			$item.each(function() {
				var $value = $(this).find('.value'),
					value = parseInt($value.text());

				if (value > 0) {
					$(this).closest('li').addClass('list_checked');
				} else {
					$(this).closest('li').removeClass('list_checked');
				}

				allValue += value;
			});

			// 적립율 plus, minus 버튼 기능
			$list.find('.btn_choice button').on('click', function(e) {
				var $button = $(this),
					$value = $button.siblings('.percentage').find('.value'),
					value = $value.text();	

				if ($button.hasClass('minus') && value > 0) {
					$value.text(--value);
					allValue--;
					value == 0 && $button.closest('li').removeClass('list_checked');
				} 
				else if ($button.hasClass('plus') && value <= 4) {
					/* 20190513 수정
					if (allValue == 20) {
						alert('Making 20의 적립률이\n20%를 초과하였습니다.');
						
						return false;
					}
					*/
					$value.text(++value);
					allValue++;
					$button.closest('li').addClass('list_checked');
				}
			});

			// '모든 영역 1% 설정' 버튼 기능
			$('.btn_section .btn_t1').on('click', function() {
				$item.addClass('list_checked');
				$item.find('.value').text(1);

				// allValue = 20; 20190513 수정
			});

			// '추천항목' 체크박스 기능 - 상단 추천 적립율 비활성화 및 모든 적립율 0으로 변경
			$('.DIY_switch input[type="checkbox"]').on('change', function() {
				if (!$(this).prop('checked')) {
					$item.removeClass('list_checked');
					$item.find('.value').text(0);

					$('.survey_box.type01').find('.slide_area').slideUp();
					$('.survey_box.type01').find('.circle_graph').removeClass('is_active'); // 원 그래프 초기화

					allValue = 0;
				}else{ // 추천항목 활성화
					$('.survey_box.type01').find('.slide_area').slideDown();
				}
			});
		}
	}

	/* 체크박스 기능 구현 */
	function checkboxInit() {
		/* 
		전체 선택 기능 있을 시
		일반 체크박스에 data-checkbox="그룹명"
		전체 체크박스에 data-js="checkbox_all" data-checkbox-group='그룹명' or data-checkbox-group='["그룹명", "그룹명"]'
		*/
		var $checkbox = $('[data-checkbox]'),
			$allCheck = $('[data-js="checkbox_all"]');

		$checkbox.on('change', function() { 
			var $this = $(this),
				groupName = $this.data('checkbox'),
				$checkbox = $('[data-checkbox="' + groupName + '"'),
				$allCheckbox = $('[data-checkbox-group="' + groupName + '"'),
				groupLength = $checkbox.length,
				checkLength = $checkbox.filter(':checked').length;

			if (groupLength == checkLength) {
				$allCheckbox.prop('checked', true);
			} else {
				$allCheckbox.prop('checked', false);
			}
		});

		$allCheck.on('change', function() {
			var _this = this,
				groupName = $(this).data('checkboxGroup');	

			if ($.isArray(groupName)) {
				$.each(groupName, function(index, data) {
					$('[data-checkbox="' + data + '"').prop('checked', _this.checked).trigger('change');
				});
			} else {
				$('[data-checkbox="' + groupName + '"').prop('checked', _this.checked).trigger('change');
			}
		});
	}

	/* 공통 탭 함수 */
	function tabBtn(tabClass){
		$('.' + tabClass + ' li').on('click',function(){
			$('.' + tabClass + ' li').removeClass();
			$(this).addClass('on');
		});
	}

	/* 현재 화면에 태그가 보이는지 안보이는 확인하는 기능 */
	$.fn.visible = function(fixH) {
		var _thisO = $(this);

		var scrollT = $(window).scrollTop();
		var winH = $(window).height() - (fixH ? fixH : 0);
		var winP = scrollT + winH;

		var thisH = _thisO.outerHeight();
		var thisT = _thisO.offset().top + thisH/2;

		if ( thisT < scrollT || winP < thisT ) {
			return false;
		} else {
			return true;
		}
	}

	$(document).ready(function() {
		/* 카드선택 홈 */
		$('input[type=radio][name=cardType]').click(function() {
			var chkChoiceValue = $('input[type=radio][name=cardType]:checked').val();

			if (chkChoiceValue == '1') {
				$('#cardPop1').addClass("current");
				$('#cardPop2').removeClass("current");

			} else if (chkChoiceValue == '2') {
				$('#cardPop1').removeClass("current");
				$('#cardPop2').addClass("current");
			}
		});

		mainPickInit();
		sliderInit();
		mainVisualInit();
		scrollMoveInit();
		rateChangeInit();
		checkboxInit();
		tabBtn('DIY_tab_list');

		$('.btn_wrap .btn_t1').on('click', function() {
			$(".multi_list li").addClass('list_checked');
			$(".multi_list li").find('.value').text(1);
		});

		if($("#btnBrief").length){
			$(window).on({
				"scroll" : function(){
					var $btn = $("#btnBrief");
					var scrollTop = $(window).scrollTop();
					var screenH = $(window).outerHeight();
					var screenW = $(window).outerWidth();
					var std = $(".btn_wrap.btn_group");
					var stdPos = std.offset().top;
					var gap = 0;

					if(screenW < 1100){
						gap = 0;
					}else{
						gap = 6;
					}

					if(scrollTop + screenH - gap > stdPos){
						$btn.addClass("pos");
					}else{
						$btn.removeClass("pos");
					}
				}
			});
		}
	});
})(jQuery);

function fncBriefView() {
	var innerTextCdBank = "";

	var $list = $('.multi_list');

	if ($list.length) {
		var $item = $list.find('li'),
		localValue = 0;

		$item.each(function() {
			var $value = $(this).find('.value'),
				value = parseInt($value.text());

			if(value > 0) {
				innerTextCdBank += '<li>';
				innerTextCdBank += '<div class="ico">';
				innerTextCdBank += '<span><img src="'+$(this).find('img').attr('src')+'" alt="'+$(this).find('img').attr('alt')+'" /></span>';
				innerTextCdBank += '</div>';
				innerTextCdBank += '<div class="tit">'+$(this).find('img').attr('alt')+'</div>';
				innerTextCdBank += '<div class="per"><span class="num">'+value+'</span>%</div>';
				innerTextCdBank += '</li>';
			}

			localValue += value;
		});
	}

	document.getElementById("BriefView_per").innerHTML = localValue;
	document.getElementById("BriefView_div1").innerHTML = innerTextCdBank;

	popOpen('#ratePop');
}

// 카드 - 김동희 대리 추가
//파라미터 value 얻어오는 funtion1
function getParaVal(paraVal) {
	var pURL = document.URL;
	if (pURL.indexOf(paraVal) > -1) {
		var idx = paraVal.length + 1;
		var keyIdx1 = pURL.indexOf(paraVal) + idx;
		var keyVal = pURL.substring(keyIdx1, 9999);
		var keyIdx2 = keyVal.indexOf('&') > -1 ? keyVal.indexOf('&') : 9999;
		keyVal = keyVal.substring(0, keyIdx2);
		return keyVal
	}
}

//버튼 파라미터 연결 funtion
function getLinkUrl(btn, param, paraVal) {
	if (document.URL.indexOf(paraVal) > -1) {
		var linkUrl = $(btn).length > 0 ? $(btn).attr('href') : 'noBtn';
		paraVal = (paraVal == null) ? '' : paraVal;
		//console.log(paraVal)
		if (linkUrl.indexOf(param) > -1) {
			linkUrlIdx = linkUrl.indexOf(param);
			linkUrlKey = linkUrl.substring(linkUrlIdx, 9999);
			linkUrlEnd = linkUrlKey.indexOf('&') > -1 ? linkUrlKey.indexOf('&') : 9999;
			linkUrlKey = linkUrlKey.substring(0, linkUrlEnd);
			linkUrl = linkUrl.replace(linkUrlKey, param + '=' + paraVal);
		} else {
			var chain = (linkUrl.indexOf('?') > -1) ? '&' : '?'
			linkUrl = linkUrl + chain + param + '=' + paraVal
			//console.log(linkUrl)
		}

		$(btn).attr('href', linkUrl);
		$(btn).click(function () {
			location.href = linkUrl;
			return false;
		});
	}
}

/*
<a href="http://sh.com" onclick="winPop(this.href, { width:500, height:500, scroll:'no', resizable:0 }); return false;">
*/
function winPop(url, pm) {
	var popname = pm.name ? pm.name : 'shpopup';
	var option = 'width=' + (pm.width ? pm.width : 400) + ', height=' + (pm.height ? pm.height : 500);

	option += pm.left && pm.width ? ', left=' + pm.left : ', left=' + ((screen.width / 2) - (pm.width / 2));
	option += pm.top && pm.height ? ', top=' + pm.top : ', top=' + ((screen.height / 2) - (pm.height / 2));
	option += pm.scroll ? ', scrollbars=' + pm.scroll : ', scrollbars=no';
	option += pm.resizable ? ', resizable=' + pm.resizable : ', resizable=0';

	window.open(url, popname, option);
}



//팝업 열기 함수 (1.0 Version 수정금지)
var popOpen2 = function(tar, btn, callback) {
	if ($(tar).length < 1) return console.log('pop_wrap 없음');
	if ($(tar).children('.popup').length < 1) {
		// ASIS 팝업을 띄우기 위한 처리 
		//return console.log('popup 없음');		
		$(tar).children().wrapAll('<article class="popup popup_type01">');
		$(tar).find('.popup_head').removeClass('popup_head').addClass('pop_head');
		$(tar).find('.popup_content').removeClass('popup_content').addClass('pop_cont');
	}
	if($(tar).data('opened')) return;
	var $visible = $('.pop_wrap:visible').length;
	if (btn && btn != window) $popOpenBtn = $(btn);
	if ($visible > 0) {
		$(tar).css('z-index', '+=' + $visible);
	}

	popOpenScroll();

    var $popup = $(tar).find('.popup');

    if(_isFilterPopup(tar)) {
        // 화면 밖으로 이동
		var winH = $(window).height();
        $popup.css('margin-top', winH);
        $(tar).show();
        //popPosition(tar, 0);
        setTimeout(function() {
            var popupTop = winH - $popup.height();
					if (isMobile.any() == false) $popup.attr({ 'tabindex': 0 }).focus(); $popup.find('.pop_focus').remove();
					if (callback) { callback }
			//$popup.css({ 'transition':'margin-top 0.5s ease', 'margin-top': popupTop+'px' }).addClass('is_transition');
			//$popup.one('transitionEnd', function () {
			//	if ($(this).hasClass('is_transition')) {
			//		$(this).removeClass('is_transition');
			//	}
            //});
            //$popup.css('top', popupHeight);
			/*
            $popup.stop().animate({ top: popupTop+'px' }, $popSpeed, function () {
				console.log(popupTop);
                if (isMobile.any() == false) $popup.attr({ 'tabindex': 0 }).focus(); $popup.find('.pop_focus').remove();
            });
			*/
        }, 100);
    } else {
        $(tar).fadeIn($popSpeed, function () {
            if (isMobile.any() == false) $popup.attr({ 'tabindex': 0 }).focus(); $popup.find('.pop_focus').remove();
			
			// Tab Swiper 설정
			if ($(tar).find('.tab_type01.swiper_tab').length) {
				if ($(btn).is('[data-pop-tabIndex]') == true) {
					var tabIndex = Number($(btn).attr('data-pop-tabIndex'));
				} else { 
					var tabIndex = null; 
				}
				ui.tabSwiper(tabIndex);
			}

			// TabCont Swiper 설정
			if ($(tar).find('.swiper_tabCont:visible').length){
				ui.commCertifySwiper();
			}

			// Card Swiper 설정
			if ($(tar).find('.card_slider:visible').length){
				commCardSwiper();
			}
			
			// 셀렉트박스 설정
			ui.selectScroll();

			if (callback) { callback; }
        });
        popPosition(tar, $popSpeed);
    }
	
	var popupResizeEndCallback;
	if(typeof tar === 'object') {
		popupResizeEndCallback = popupResizeEndCallbacks[tar[0].id || tar[0].className] = popupOnResizeEnd(tar);
	} else {
		popupResizeEndCallback = popupResizeEndCallbacks[tar] = popupOnResizeEnd(tar);		
	}
	var resizeObserver = new ResizeObserver(_.throttle(function(entries) {
		if(entries[0].contentRect.width > 0) {
			popupResizeEndCallback();
		}
	}, 100));

	resizeObserver.observe($(tar).find('.pop_cont')[0]);
	$(tar).data('resizeObserver', resizeObserver);
	$(tar).data('opened', true);

	// 프린트 설정
	if ($(tar).hasClass('pop_confirm') == false && $(tar).hasClass('pop_alert') == false) {
		$('html, body').addClass('is_popPrint');
	}

	// 웹접근성 호출
	var $eleDisable = $(tar).siblings();
	var $eleEnable = $(tar);
	ui.commonAccess.disable($eleDisable, 'modal');
	ui.commonAccess.enable($eleEnable, 'modal');

	// 예외사항 처리
	$(tar).find('.pop_sub_cont').each(function(){
		ui.popSubScroll();
	})
	/*
	$('.table_scroll_area:visible').each(function(){ 
		ui.tableScroll.reset();
	})
	*/
}

//팝업 닫기 함수 (1.0 Version 수정금지)
var popClose2 = function (tar) {
	$(tar).removeData('opened');
	var $visible = $('.pop_wrap:visible').length;
	if ($visible == 1) {
		$('body').removeClass('pop_open');
		$(window).scroll();
	}
	popCloseScroll();
    
    if(_isFilterPopup(tar)) {
        var $popup = $(tar).find('.popup');
        var popupHeight = $popup.height();
			$popup.animate({'margin-top':$(window).height()}, $popSpeed, function () {
				$(tar).fadeOut($popSpeed, function () {
					if ($popOpenBtn != '') {
						if ($popOpenBtn != window) {
							$popOpenBtn.focus();
						}
						$popOpenBtn = '';
					}
				})
			});

		/*
		if ($(window).width() <= 1100){
			$popup.css({'transition':'top 0.5s ease', 'top': '100%'}).addClass('is_transition');
			$popup.one('transitionEnd', function(){
				console.log('얼쑤');
				if ($(this).hasClass('is_transition')){
					$(tar).fadeOut($popSpeed, function(){ $(this).removeAttr('style') });
					$(this).removeClass('is_transition');
				}
			})
		} else {
			$(tar).fadeOut($popSpeed, function () {
				if ($popOpenBtn != '') {
					if ($popOpenBtn != window) {
						$popOpenBtn.focus();
					}
					$popOpenBtn = '';
				}
			});
		}
		*/		
    } else {
        $(tar).find('.popup').animate({ 'margin-top': 0 }, $popSpeed, function () {
            $(this).removeAttr('style');
        });
		$(tar).fadeOut($popSpeed, function () {
			if ($popOpenBtn != '') {
				if ($popOpenBtn != window) {
					$popOpenBtn.focus();
				}
				$popOpenBtn = '';
			}
		});
    }


	var resizeObserver = $(tar).data('resizeObserver');
	if( resizeObserver ) {
		resizeObserver.unobserve($(tar).find('.pop_cont')[0]);		
	}

	// 프린트 설정
	$('html, body').removeClass('is_popPrint');


	// 접근성 호출
	var $eleEnable = $(tar).siblings();
	ui.commonAccess.enable($eleEnable, 'modal');
};
