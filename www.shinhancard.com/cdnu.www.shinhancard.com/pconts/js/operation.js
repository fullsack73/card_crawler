/* 2020-02-20 DX운영팀 */
var opVer = new Date().getDate() + '' + (new Date().getHours());
//파비콘
$('link[rel=apple-touch-icon-precomposed]').attr('href','/pconts/images/ico_favicon196.png?v=' + opVer);
$('link[rel*=shortcut]').attr('href','/pconts/images/ico_favicon96.ico?v=' + opVer);

//리다이렉팅
(function(){
    var ver = new Date().getDate() + '' + (new Date().getHours());
    document.write('<scr' + 'ipt  src="' + '/pconts/js/redir/reDir.js?v=' + ver + '" defer><\/scr' + 'ipt>')
})();


// 20221025603930 뷰저블 신규 코드 적용 요청
(function(w, d, a){
	w.__beusablerumclient__ = {
	load : function(src){
	var b = d.createElement("script");
	b.src = src; b.async=true; b.type = "text/javascript";
	d.getElementsByTagName("head")[0].appendChild(b);
	}
	};w.__beusablerumclient__.load(a + "?url=" + encodeURIComponent(d.URL));
})(window, document, "//rum.beusable.net/load/b160818e192411u967");

//버튼 링크 모바일 / PC 분기문 
function dxlinkControll(className,pcLink1,mLink2){
	var dxNa=navigator.userAgent;
	if(dxNa.indexOf('Windows') > -1 || dxNa.indexOf('Macintosh') > -1) {
		$(className).attr('href',pcLink1);
	} else {
		$(className).attr('href', mLink2);
	}
}

//dev
if(document.URL.indexOf('devprj2')>-1||document.URL.indexOf('tstprj2')>-1){
$('html').addClass('devcss');
}

//파라미터 GET
function dxGetParam(paramNm){
	var url = location.search;
	//console.log("url : " + url);
	var pramSetArr = url.substring(1).split("&");  if(url.substring(1).length > 0){
		var paramArr = new Array;
		for(var i=0; i<pramSetArr.length; i++){
		paramArr = pramSetArr[i].split("=");
		if(paramNm == paramArr[0]){
			return paramArr[1];
		}
		}
	}  return "";
}

//버튼 파라미터 SET (분기처리)
function dxSetParam(btn,param,paraVal){
	if(document.URL.indexOf(paraVal)>0){
		$(btn).each(function(){
//console.log()
			var linkUrl=$(this).length>0?$(this).attr('href'):'noBtn';
			paraVal=(paraVal==null)?'':paraVal;
			if(linkUrl.indexOf(param)>-1){
				linkUrlIdx=linkUrl.indexOf(param);
				linkUrlKey=linkUrl.substring(linkUrlIdx,9999);
				linkUrlEnd=linkUrlKey.indexOf('&')>-1?linkUrlKey.indexOf('&'):9999;
				linkUrlKey=linkUrlKey.substring(0,linkUrlEnd);
				linkUrl=linkUrl.replace(linkUrlKey,param+'='+paraVal);
			}else{
				var chain= (linkUrl.indexOf('?')>-1)?'&':'?'
				linkUrl=linkUrl+chain+param+'='+paraVal;
			}
			$(this).attr('href',linkUrl);
//console.log()
		});
	}
}
//버튼 파라미터 SET (카드신청용)
function dxSetParamCard(btn,param,paraVal){
	if(document.URL.indexOf(paraVal)>0&&document.URL.indexOf('.html')){
		var setParam=setInterval(function(){
			a=a+1
			if($(btn).length>0){
				$(btn).each(function(){
					var linkUrl=$(this).length>0?$(this).attr('data-move-url'):'noBtn';
					paraVal=(paraVal==null)?'':paraVal;
					if(linkUrl.indexOf(param)>-1){
						linkUrlIdx=linkUrl.indexOf(param);
						linkUrlKey=linkUrl.substring(linkUrlIdx,9999);
						linkUrlEnd=linkUrlKey.indexOf('&')>-1?linkUrlKey.indexOf('&'):9999;
						linkUrlKey=linkUrlKey.substring(0,linkUrlEnd);
						linkUrl=linkUrl.replace(linkUrlKey,param+'='+paraVal);


					}else{
						var chain= (linkUrl.indexOf('?')>-1)?'&':'?'
						linkUrl=linkUrl+chain+param+'='+paraVal;
					}
					$(this).attr('data-move-url',linkUrl);
//console.log($(btn).attr('data-move-url'))
				});
				clearInterval(setParam)
				//console.log((a/1000)+'sec')
			}else if(a>3000){
				clearInterval(setParam)
				//console.log((a/1000)+'sec')
			}
		
		},1)	
	}
}

/* 레이어 관련 */
$(function(){
	//레이어 열기 DOM
	$('.dxOpenLayer').click(function(){
		var targetId=$(this).attr('href');
		var targetBtn=this;
		dxLayerOpen(targetId,targetBtn)
		return false;
	});
});
//레이어 열기 function
function dxLayerOpen(targetId,targetBtn){
	var flag=0;
	if(targetBtn){
		flag=1;
		var $tBtn=$(targetBtn);
		$tBtn.addClass('oldFocus');
		$(targetId).attr('tabindex','0').addClass('on').focus();
	}
	
	$('.dxLayerClose').click(function(){
		$(this).parents('.c-layer-wrap').removeClass('on').removeAttr('tabindex');
		if(flag==1){
			$tBtn.focus().removeClass('oldFocus');
		}else{
			$('#skipNavi').focus();
		}
		return false;
	});
}
//레이어 닫기 function
function dxLayerClose(targetId){
	$(targetId).removeClass('on').removeAttr('tabindex');
	if($('.oldFocus').length>0){
		$('.oldFocus').focus();
	}
}

//이벤트 full link
function eventFullLink(){
	var i=0
	var evtFull=setInterval(function(){	
	i=i+1
		if($('.event_list').length>0&&document.URL.indexOf('/index.html')<0){
			$('.event_list .title').each(function(){
				if($(this).closest('.item').find('.linkObj').length===0){
					clone=$(this).clone().removeClass('title').addClass('linkObj');
					$(this).closest('.item').append(clone);

				}
			});
			$('#nextList, #evtTab01, #evtTab02, #evtTab03, #evtCat1 , #evtCat2, #evtCat3, #evtCat4, #evtCat5, #sortId1 > a, #sortId2 > a, #sortId3 > a, .tab_list > li > a, .tab_list > li > button').off('mousedown').on('mousedown', function(){
				//console.log('aaa')
				//eventFullLink();
			});
			clearInterval(evtFull);
		}else if(i>10){
			clearInterval(evtFull);
		}

	
	},1000);
//console.log('item')
}



/* 이벤트 관련 */
$(function(){
	//이벤트 full link

if($('.type_event.result').length>0){
$('.type_event.result').click(function(){
eventFullLink();
//console.log('click')
})
}
	eventFullLink();
	

	var evtType=dxGetParam('hpgEvtBjChCd');
var thisUrl=document.URL
thisUrl=thisUrl.split('/')
thisUrl= thisUrl.slice(-1)[0]
thisUrl=thisUrl.split('.')
thisUrl=thisUrl[0]
	var  evtGoView=['/mob/MOBFM026N/MOBFM026C01.shc?reUrl='+thisUrl,'/mob/MOBFM04002N/MOBFM04002C01.shc?reUrl='+thisUrl,'/mob/MOBFW11011N/MOBFW11011C03.shc?reUrl='+thisUrl,'/mob/MOBFW11011N/MOBFW11011C01.shc?reUrl='+thisUrl]
	var  evtEndView=['/mob/MOBFM026N/MOBFM026C10.shc?reUrl='+thisUrl,'/mob/MOBFM04002N/MOBFM04002C01.shc?reUrl='+thisUrl,'/mob/MOBFW11011N/MOBFW11011C04.shc?reUrl='+thisUrl,'/mob/MOBFW11011N/MOBFW11011C02.shc?reUrl='+thisUrl]

	if(document.URL.indexOf('/pconts/html/benefit/event/')>-1||document.URL.indexOf('/pconts/html/topsClub/topsEvent/')>-1&&document.URL.indexOf('.html')>-1){

		// 이미지 alt br 빼기
		if($('img').length>0){
		var altText;
		$('img').each(function(){
			altText= $(this).attr('alt');
			if(typeof altText== 'undefined'){
				//console.log('undefined')
			}else{
				altText=altText.replace(/\<br\>/g,'');
				altText=altText.replace(/\<br \/>/g,'');
				altText=altText.replace(/\<br\/>/g,'');
				altText=altText.replace(/\<(.*)\>/g,'');
				$(this).attr('alt',altText)
				//console.log(altText)
			}
		})
		}

		//인라인 스타일 제거
		$('#eventContents *').each(function(){
			if($(this).attr('style')){
			$(this).attr('style').indexOf('display')>-1?'':$(this).removeAttr('style');
			}
		});
		
		//지난 이벤트 처리
		var endValue=$('#endEventDate').text();
		var d=new Date(); 
		a=d.getFullYear()<10?'0'+d.getFullYear():d.getFullYear();
		b=d.getMonth()+1<10?'0'+parseInt(d.getMonth()+1) : d.getMonth()+1
		c=d.getDate()<10?'0'+d.getDate():d.getDate();
		var curValue= String(a)+String(b)+String(c);
		endValue = endValue.split('.');
		endValue= endValue[0] + endValue[1] + endValue[2];
		//console.log(endValue);
		//console.log(curValue);
		if((curValue*1) > endValue*1){
			//console.log('지난이벤트');
			
			if($('#evtApply').length>0){
                //문구삽입
				if($('.past_event').length<1){
					$('.con.accordion_wrap').before('<div class="past_event"><p>응모가 마감되었습니다. 감사합니다. <span style="display:none;">TEST</span></p></div>');
				}
            }else{
                if($('.past_event').length<1){
                    $('.con.accordion_wrap').before('<div class="past_event"><p>이벤트가 종료되었습니다. 감사합니다. <span style="display:none;">TEST</span></p></div>');
                }
            }
			
			//버튼 링크 변경
			$('.btn_wrap  a').each(function(){
				if($(this).attr('onclick')){
					var elm =$(this).attr('onclick');
					elm=elm.replace('goEventApplying','goUcEventView');
					$(this).attr('onclick',elm)
					$(this).find('span').text('결과 확인')

					//문구삽입
					// if($('.past_event').length<1){
					// 	$('.accordion_wrap').before('<div class="past_event"><p>응모가 마감되었습니다. 감사합니다. <span style="display:none;">TEST</span></p></div>');
					// }
				// }else{
				// 	if($('.past_event').length<1){
				// 		$('.accordion_wrap').before('<div class="past_event"><p>이벤트가 종료되었습니다. 감사합니다. <span style="display:none;">TEST</span></p></div>');
				// 	}
				}
				if($('#evtGoView').length>0){
					if(evtType=='evnPgsList01'||evtType=='evnEndList01'){
							$('#evtGoView').attr('href',evtEndView[0]);
					}else if(evtType=='evnPgsList04'||evtType=='evnEndList04'){
							$('#evtGoView').attr('href',evtEndView[1]);
					}else if(evtType=='evnPgsList02'||evtType=='evnEndList02'){
							$('#evtGoView').attr('href',evtEndView[2]);
					}else if(evtType=='evnPgsList03'||evtType=='evnEndList03'){
							$('#evtGoView').attr('href',evtEndView[3]);
					}else{
							$('#evtGoView').attr('href',evtEndView[0]);
					}
					$('#evtGoView').attr('id','evtEndView')
				}
			});	
		}else{
			//console.log('진행중이벤트');
			//이벤트 상세 분기
			if(evtType=='evnPgsList01'||evtType=='evnEndList01'){
					//$('#header').attr('data-head-title','이벤트')
					//$('#evtTypeTitle').text('이벤트');
					$('.evt_detail').addClass(evtType);
					$('#evtGoView').attr('href',evtGoView[0]);
					$('#evtEndView').attr('href',evtEndView[0]);
			}else if(evtType=='evnPgsList04'||evtType=='evnEndList04'){
					//$('#header').attr('data-head-title','Tops 이벤트')
					//$('#evtTypeTitle').text('Tops 이벤트');
					$('.evt_detail').addClass(evtType);
					$('#evtGoView').attr('href',evtGoView[1]);
					$('#evtEndView').attr('href',evtEndView[1]);
			}else if(evtType=='evnPgsList02'||evtType=='evnEndList02'){
					//$('#header').attr('data-head-title','신한그룹 이벤트')
					//$('#evtTypeTitle').text('신한그룹 이벤트');
					$('.evt_detail').addClass(evtType);
					$('#evtGoView').attr('href',evtGoView[2]);
					$('#evtEndView').attr('href',evtEndView[2]);
			}else if(evtType=='evnPgsList03'||evtType=='evnEndList03'){
					//$('#header').attr('data-head-title','LG/GS/LS/LIG 패밀리 이벤트')
					//$('#evtTypeTitle').text('LG/GS/LS/LIG 패밀리 이벤트');
					$('.evt_detail').addClass(evtType);
					$('#evtGoView').attr('href',evtGoView[3]);
					$('#evtEndView').attr('href',evtEndView[3]);
			}
			//console.log(getEvtType);

		}
	}
});

/* 기타 유용한기능 */
$(function(){

	setTimeout(function(){
	//fixed-Top 메뉴
	if($('.fixed-top').length>0){
		var headPos =$('header').height();
		$(window).scroll(function(){
			var winPos=$('html, body').scrollTop();
			if(winPos>headPos){
				$('.fixed-top').css('top',headPos).addClass('active')
			}else{
				$('.fixed-top').css('top',0).removeClass('active')
			}
		});
	}
	},300);


	//아름인 배너 컨트롤
	if(document.URL.match('MOBFM145R01.shc')&&$('.areamin_bnr .item').length==1){
		$('.areamin_bnr .swiper-controls').hide();
	}

});

// 해쉬 바로가기 스크롤
function dxMoveHash(elm){

	if(!$(elm).hasClass('on')){
		$(elm).addClass('on').siblings().removeClass('on')
		yPos=$($(elm).attr('href')).offset().top -$('#header').height();;
		$('html, body').animate({'scrollTop':yPos-10},300)
		//console.log(yPos)
	}

}

//탭 c-tab : onclick="dxcTab(this,콘트클래스);return false"
function dxcTab(elm,target){
	$(elm).addClass('on').siblings().removeClass('on');
	$('.'+target).hide();
	$($(elm).attr('href')).show();
}

//c-tab2 : onclick="dxcTab2(this);return false"
function dxcTab2(elm){
	$(elm).addClass('on').siblings().removeClass('on');
	$('.c-tab2-cont').hide();
	$($(elm).attr('href')).show();
}

// 피씨 모바일 디바이스 분기처리
function dxDeviceNav() {
	var dxNav=navigator.userAgent;
	if(dxNav.indexOf('Windows') > -1 || dxNav.indexOf('Macintosh') > -1) {
		$('.pc-device').show();
		$('.m-device').hide();
	} else {
		$('.pc-device').hide();
		$('.m-device').show();
	}
}


function dxCardTerms(a,b){
	var sNum=b
	var popStart='<div id="popMedium" class="pop_wrap medium is_visible is_active" role="dialog"><div id='+ sNum+'></div></div>';
	$('body').append(popStart);
	$('#'+sNum).load(a,function(){
		$('#'+sNum+' .btn_close').click(function(){
			$(this).parents('.pop_wrap').remove();
		})
	})
}					

/* 챗봇노출 */
//if(document.URL.indexOf('tstprj2-')>-1||document.URL.indexOf('devprj2-')>-1){
var a=0
chatBotUrl=['/mob/MOBFM006N/MOBFM006R01.shc','/pconts/html/benefit/main/main.html','/pconts/html/finance/main/main.html','/pconts/html/card/main/main.html','/pconts/html/life/main/main.html','/pconts/html/mobile/main/main.html','/pconts/html/lifeService/main/main.html','/pconts/html/topsClub/main/main.html', '/mob/MOBFM12101N/MOBFM12101R01.shc']
for(var i=0;i<chatBotUrl.length;i++){

	if(document.URL.indexOf(chatBotUrl[i])>-1){

		var setUpChatBot= setInterval(function(){
a=a+1
			if($('.quick_fixed').length>0){

						$('.quick_fixed').append('<div id="main_chatbot"></div>');
						$('#main_chatbot').load('/pconts/html/chatbot.html?ver=1');
						clearInterval(setUpChatBot)
//console.log((a/1000)+'sec')
			}else if(a>3000){
						clearInterval(setUpChatBot)
//console.log((a/1000)+'sec')
}

		},1)
	}
}
//}


// 200723 추가
function arCls(tar,cls){
	if(!$(tar).hasClass(cls)){
		$(tar).addClass(cls);
	}else{
		$(tar).removeClass(cls);
	}
}

// 카드신청 라디오버튼 더보기 함수(arCls 변경)
function arCls2(tar, cls, pcTar, moTar) {
	if(!$(tar).hasClass(cls)) {
		$(tar).addClass(cls);
		var focusTar = $(window).outerWidth() > 1100 ? pcTar : moTar
		var getFoucsId = $(tar).closest('.open').find('.radio_wrap li input')[focusTar - 1].id;
		setTimeout(function() {
			$('#' + getFoucsId).focus();
		},200)
	}else{
		$(tar).removeClass(cls);
	}
}

//상세페이지 유투브 동영상
$(function(){
	var ytbPos=0;
	if($('.youtube-sec').length>0&&document.URL.match('.html')){
		$(window).scroll(function(){
			ytbPos=$('.youtube-sec').offset().top + $('.youtube-sec').height() ;
			if($(window).scrollTop()>ytbPos&&!$('.youtube-sec').hasClass('active')&&!$('.youtube-sec').hasClass('closed')){
				$('.youtube-sec').addClass('active')
			}else if($(window).scrollTop()<ytbPos&&$('.youtube-sec').hasClass('active')){
				$('.youtube-sec').removeClass('active');
			}else if($(window).scrollTop()<ytbPos&&$('.youtube-sec').hasClass('closed')){
				$('.youtube-sec').removeClass('closed');
			}
		}).scroll();
	}
	$('.youtube-sec .btn-close').click(function(){
		$('.youtube-sec').removeClass('active').addClass('closed');
$('#ytPlayer')[0].contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}','*');
		return false;
	})
});

// 검색
/*$(function(){
setTimeout(function(){
$('.srch_input_wrap .btn_clear').click(function(){
	//$('#totalSrchQuck').focus();
});
},500)
});*/


//구축스타일 가이드 리다이렉팅
if(document.URL.indexOf('https://devprj2-www.shinhancard.com/prjconts/html/guide/guide.html')>-1){
location.href="https://devprj2-www.shinhancard.com/pconts/dx/guide/2020/guide.html"
}

//ID Tab (이벤트 : onclick="popTabConts(this);return false;"  콘첸츠 클래스: .popTabConts) 
function popTabConts(elm){
	if(!$(elm).parent().hasClass('current')){
		$(elm).parent().addClass('current').siblings().removeClass('current');
		$($(elm).attr('href')).show().siblings('.popTabConts').hide();
	}		
}

//약관 바로가기
function newTermsConts(){
	//약관 클래스, 아이디 입히기
	$('.t-tit1').each(function(i){
		var stest=/제(\d{1,3})조/;
		if(stest.test($(this).find('b').text())==true){
			$(this).addClass('termLoc').attr('id','termLoc'+i)
		}
	});
	$('.t-tit0').each(function(i){
		var stest=/제(\d{1,3})장/;
		if(stest.test($(this).find('b').text())==true){
			$(this).addClass('termLoc').attr('id','termLocT'+i)
		}
	});
	
	//약관 바로가기 목록 생성
	var addHtml='<ul>\n';
	var item='';
	var itemLen=Math.ceil($('.termLoc').length/3)
	$('.termLoc').each(function(idx){
		var itemText=$(this).find('b').text();
		var itemId=$(this).attr('id');
		if(idx==itemLen){
			item='</ul>\n<ul>\n<li><a href="#'+itemId+'" class="term-loc-item">'+itemText+'</a></li>\n';
		}else if(idx==itemLen*2){
			item='</ul>\n<ul>\n<li><a href="#'+itemId+'" class="term-loc-item">'+itemText+'</a></li>\n';
		}else{
			item='<li><a href="#'+itemId+'" class="term-loc-item">'+itemText+'</a></li>\n';
		}
		addHtml+=item
	});
	addHtml+='</ul>\n'
	$('.terms-loc-trg').append(addHtml);
	
	//약관 바로가기 액션
	$('.term-loc-item').click(function(){
		if($(window).width()>1099){
			var tYpos=$($(this).attr('href')).position().top + 100;
		}else{
			var tYpos=$($(this).attr('href')).position().top + 50;
		}
		$('html, body').stop().animate({'scrollTop':tYpos},500);
		return false;
	});
	
	//현재 진행 프로그래스
	$('.terms-loc-trg').append('<div class="terms-progress"><div class="terms-progress-item"></div></div>');
	function termsProgress(){
		termsTop=$('.termsConts').offset().top;
		termsEnd=$('.btn_cont').offset().top;
		termsHeight=$('.termsConts').height();
		winHeight=$(window).height();
		tScrollTop=$(window).scrollTop();
		tScrollBottom=$(document).height()-$(window).height()-$(window).scrollTop();
		tScrollHeight=$('html, body').prop('scrollHeight');
		if(tScrollTop>10){
			$('.terms-progress').addClass('on');
		}else{
			$('.terms-progress').removeClass('on');
		}
		if(tScrollTop>termsTop&&tScrollTop<termsEnd){
			calTop=tScrollTop-termsTop;
			totalScroll=~~(calTop/(termsHeight-winHeight)*100);
			$('.terms-progress-item').css('width',totalScroll+'%');
		}else if(tScrollTop<termsTop){
			$('.terms-progress-item').css('width',0)
		}
	}
	
	$(window).on('scroll resize',function(){
	termsProgress();
	}).resize();
}


//shPlay swiper
function fanPlaySwiper(elm){
if($('#guideSwiper').find('.swiper-slide').length>1){
	var guideSwiper = new Swiper(elm+' .swiper-container', {
	loop: false,
	slidesPerView: 1,
	height: '100%',
	pagination: {
		el: elm+' .swiper-pagination',
	},
	navigation: {
			nextEl: '#guideSwiper .nav-button-next',
			prevEl: '#guideSwiper .nav-button-prev',
	}
	});
}else{
	$(elm+' .swiper-controls').hide();
	$(elm+' .nav-button-prev').hide();
	$(elm+' .nav-button-next').hide();
}
}

/*제페토*/
function jepetoItemSwiper() {
	var swiper = new Swiper('.jepetoItem', {
		slidesPerView: 'auto',
		spaceBetween: 10,
		centeredSlide: true,
		watchSlidesVisibility: true,
					observeParents:true,
					observeSlideChidren:true,
					observer:true,
		on: {
			init: function () {
				ui.swiperAccess($('.jepetoItem'), 'auto');
			},
			slideChangeTransitionStart: function () {
				ui.swiperAccess($('.jepetoItem'), 'auto');
			},
			resize: function () {
				ui.swiperAccess($('.jepetoItem'), 'auto');
			},
		}
	});
	// 누르면 그림 메인 그림 바뀜
	// var $prevImg = $("#previewImg");
	// $("input[type='radio']").on("change", function () {
	// 	var imgName = $(this).val();
	// 	console.log(imgName);
	// 	$prevImg.attr('src', '/pconts/images/dx/contents/' + imgName + '.png');
	// });
}

$(function() {
	$('.jepetoOpen').click(function() {
		jepetoItemSwiper();
	});
});

/* 공동인증서 복사안내 탭 제거 */
$(function(){
	if(document.URL.match('MOBFM167N/MOBFM167C01')){
		$('body').addClass('MOBFM167C01')
	}                                
});           

//카드 상세 파라미터
$(function(){
	if(document.URL.match('/pconts/html/card/')&&document.URL.match('.html')){
		var SHC_CLL_N=dxGetParam('SHC_CLL_N');
		var datakey=dxGetParam('datakey');
		var trstId=dxGetParam('trstId');
		var agcCd=dxGetParam('agcCd');
		var pdCd=dxGetParam('pdCd');
		var paykey=dxGetParam('paykey');
		var paydat=dxGetParam('paydat');
		var rtnurl=dxGetParam('rtnurl');
		var rmhopsCd=dxGetParam('rmhopsCd');
		var sbRecommN=dxGetParam('sbRecommN');

		dxSetParamCard('#cardCompareAfter .btn_wrap button.default','SHC_CLL_N',SHC_CLL_N);
		dxSetParamCard('#cardCompareAfter .btn_wrap button.default','datakey',datakey);
		dxSetParamCard('#cardCompareAfter .btn_wrap button.default','trstId',trstId);
		dxSetParamCard('#cardCompareAfter .btn_wrap button.default','agcCd',agcCd);
		dxSetParamCard('#cardCompareAfter .btn_wrap button.default','pdCd',pdCd);
		dxSetParamCard('#cardCompareAfter .btn_wrap button.default','paykey',paykey);
		dxSetParamCard('#cardCompareAfter .btn_wrap button.default','paydat',paydat);
		dxSetParamCard('#cardCompareAfter .btn_wrap button.default','rtnurl',rtnurl);
		dxSetParamCard('#cardCompareAfter .btn_wrap button.default','rmhopsCd',rmhopsCd);
		dxSetParamCard('#cardCompareAfter .btn_wrap button.default','sbRecommN',sbRecommN);
	}
})

//BOON 카드 팝업
$(function(){
	if(document.URL.match('1188441_2207.html')||document.URL.match('1188442_2207.html')){
var text =  '<p>신세계백화점VIP 서비스는 카드발급 다음날부터 적용됩니다.<br>(세일리지 사용/VIP 라운지 출입카드 등록/스페셜마일리지 적립 외)</p>'

		var layerObj = '<div id="theBOON1" class="pop_wrap small" role="dialog"><article class="popup popup_type01" tabindex="0"><div class="pop_head"><h3>안내</h3></div><div class="pop_cont" tabindex="0">' + text + '</div><div class="pop_btn btn_wrap btn_group"><button type="button" class="btn default blue" onclick="popClose(\'#theBOON1\');return false;"><span>확인</span></button></div></article></div>'
		var a=dxGetParam('EntryLoc1');
		var b=dxGetParam('EntryLoc2');
		var c=dxGetParam('PtnrHd');
		if(a=='TM5389'&&b=='2937'&&c=='a'){
			$('body').append(layerObj)
			popOpen('#theBOON1');
		}
		if(a=='TM5390'&&b=='2938'&&c=='a'){
			$('body').append(layerObj)
			popOpen('#theBOON1');
		}
	}
});

$(function(){
	// header 제거 파라미터
	var landType=dxGetParam('landType');
	if(landType==='Y'){
		$('body').addClass('landType');
	}
	//카드상세 공유하기 버튼 감추기 파라미터
	var noShare=dxGetParam('noShare');
	if(noShare==='Y'){
		$('body').addClass('noShare');
	}
	//console.log(landType)
})

//그외
//카드상세 하단 혜택 스와이퍼 복제
function cardDetatilClone(url){
	$('.card_detail_tab').load(url+' .card_detail_tab',function(){
		$('.btn_move').click(function(){
			var idxNum= $(this).attr('data-target');
			$('#tab08_'+idxNum).find('a').click();
		});
	});
}

//대출 공지사항 팝업 (3월 7일 삭제예정)
/*
$(function(){
	var loadUrl=['/customLoan/MOBFM294R01.html', '/immediateLoan/MOBFM171R01.html','/workLoan/MOBFM095R01.html', '/businessLoan/MOBFM340R01.html', '/SHCFRW032/SHCFRW032R01.html', '/carLaon/MOBFM097R01.html'];
	var loanHtml= '<div id="popType01" class="pop_wrap small is_visible is_active" role="dialog"><div id="cmsLoad"></div></div>'
	for(var i=0;i<loadUrl.length;i++){
		if(document.URL.match(loadUrl[i])){
			$('body').append(loanHtml);
			$('#cmsLoad').load('/pconts/html/popup/1215734_3211.html');
		}
	}
})
*/

//긴급 팝업 (긴급)
/* 
$(function(){
	var loadUrl=['/customLoan/MOBFM294R01.html', '/immediateLoan/MOBFM171R01.html','/workLoan/MOBFM095R01.html', '/businessLoan/MOBFM340R01.html', '/SHCFRW032/SHCFRW032R01.html', '/carLaon/MOBFM097R01.html'];
	//var loadUrl=['/pconts/html/card/apply/credit/','/pconts/html/card/apply/check/']
	var loanHtml= '<div id="popType01" class="pop_wrap small is_visible is_active" role="dialog"><div id="cmsLoad"></div></div>'
	for(var i=0;i<loadUrl.length;i++){
		if(document.URL.match(loadUrl[i])){
			$('body').append(loanHtml);
			$('#cmsLoad').load('/pconts/html/popup/1215667_3211.html');
		}
	}
})
*/

//완료 페이지의 판귄이미지를 체크,느낌표,엑스 아이콘으로 디자인 변경
function dxIcoComplete() {
	var dxIcon01 = ['.complete_body', '.comp_area']
	var dxIcon02 = ['.complete_body.img06', '.complete_body.type01', '.complete_body.type02', '.complete_body.type01_op20', '.complete_body.type01_op40', '.comp_area.bg_comp', '.complete_body.dxicon02']
	var dxIcon03 = ['.complete_body.img05', '.complete_body.dxicon03'];
	// 체크 아이콘
	$.each(dxIcon01, function(index, item) {
        if(!$(item).is('.dxicon01, .dxicon02, .dxicon03')) {
            $(item).prepend('<i class="icon"></i>');
        }
		$(item).addClass('dxicon01');
	})
	// 느낌표 아이콘
	$.each(dxIcon02, function(index, item) {
		$(item).removeClass('dxicon01').addClass('dxicon02');
	})
	// 엑스 아이콘
	$.each(dxIcon03, function(index, item) {
        $(item).removeClass('dxicon01').addClass('dxicon03');
	})
}
$(function(){
	// dxIcoComplete();
});

//응모형 이벤트에서 pLay는 제외하고 응모버튼을 목록 버튼으로 변경
function dxExceptpLay() {
	if (deviceInfo.app !== "shfanapp") {
		setTimeout(function() {
			var evtGoView = document.querySelector('#evtGoView');
			var evtApply = document.querySelector('#evtApply');
			var reUrl = document.URL.substring(document.URL.lastIndexOf('/') + 1, document.URL.length).split('.')[0];
			if(!!evtGoView) {
				evtGoView.style.display = 'none';
			}
			if(!!evtApply) {
				evtApply.outerHTML = '<a id="evtGoView" href="/mob/MOBFM026N/MOBFM026C01.shc?reUrl=' +  reUrl + '" role="button" class="btn default blue next"><span>목록</span></a>';
			}
		},100)
	}
}


//센터 툴팁 열기
function openTooltipCenter(tar, btn) {
    var $target = $(tar);
    var $tooltip = $target.find(".tooltip_box");
    var $btn = $(btn);
    var posLeft;
    var posTop;
    var posBtm;
    var setTime;
    var events;
    var tarWidth = $target.width();

    // 올릴떈 삭제
    var isPcOnly = $('html').hasClass('isPcOnly');
    // 올릴떈 삭제


    $btn.addClass('on')
    $btn.removeClass('off')

    var resizePos = function(){
        if ($(window).width() > 1082) {
            posLeft = $btn.offset().left - (tarWidth / 2);
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

            // 툴팁 버튼이 너무 왼쪽에 붙어있을 때
            if($btn.offset().left < 200) {
                posLeft = posLeft + 80;
            }

            // 툴팁 버튼이 너무 오른쪽에 붙어있을 때
            if($btn.offset().left > 1080 && $(window).width() > 1100 && $(window).width() < 1520 ) {
                posLeft = posLeft - 140;
            }

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
                posBtm = posBtm - $(header).outerHeight() + 6;
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

    window.addEventListener('resize', function() {
        if($target) { $target.css('display', 'none')}
        if($btn) {
            $($btn).removeClass('on')
            $($btn).addClass('off')
        }
    })

    $('.tooltip_wrap:visible').not(tar).find('.btn_close').trigger('click');
    $target.fadeIn(300, function () {
		/* 2023 접근성 수정 */
		$target.find('.tooltip_cont').attr('tabindex', 0).focus();
		// 기존소스 $target.find('.tooltip_cont').attr({'tabindex': 0, 'role': 'text' }).focus();
    });

    if ($target.parent('.contents').length === 0 && $target.closest('.contents').length === 1) {
        $target.appendTo('.contents');
    }

    closeTooltipCenter(tar, btn);
};

//센터 툴팁 닫기
function closeTooltipCenter(tar, btn, state){
    var $target = $(tar);
    var $tooltip = $target.find(".tooltip_box");
    var $btnClose = $target.find(".btn_close");
    var $btn = $(btn);
    $btnClose.off('click.pub').on({
        "click.pub" : function(){
            $btn.removeClass('on')
            $btn.addClass('off')
            $target.fadeOut(300, function(){
                if ($('.tooltip_wrap:visible').length == 0) { $btn.focus() }
            });
        }
    });
};

// iOS 신한플레이에서 팝업창 오픈시 하단 버튼이 플레이 하단 메뉴에 가려지는 현상으로 인해 pop_open의 overflow:hidden 제거
setTimeout(function() {
	if(navigator.userAgent.toLowerCase().indexOf('iphone') > -1 && $('body').hasClass('app_pLay')) {
		$('html').addClass('os_ios_html');
	}
},1000);

// 카드 신청 페이지에 fmyCrdYn=Y 가 붙는 경우 버튼 링크 변경(/pconts/html/card/apply/credit/1216829_2207.html?fmyCrdYn1=Y)
function dxCardApplyBtnFn() {
	var pcApplyBtn = document.querySelector('#cardCompareAfter .bton_in');
	var mApplyBtn = document.querySelector('#cardCompareAfter .ntob');
	if(pcApplyBtn.getAttribute('data-move-url').indexOf('fmyCrdYn') === -1 || mApplyBtn.getAttribute('data-move-url').indexOf('fmyCrdYn') === -1) {
		var ApplyBtn = document.querySelectorAll('#cardCompareAfter .bton_in, #cardCompareAfter .ntob');
		for(var i = 0; i < ApplyBtn.length; i++) {
			ApplyBtn[i].setAttribute('data-move-url' , ApplyBtn[i].getAttribute('data-move-url') + '&fmyCrdYn=Y')
		}
	}
}
if(dxGetParam('fmyCrdYn') === 'Y' && window.location.href.indexOf('/pconts/html/card/apply/') > -1) {
	var dxCardApplyInterv= setInterval(function(){
		dxCardApplyBtnFn()
		clearInterval(dxCardApplyInterv);
	},1000);
}

//
$(function(){
	if($('.dx-btnFloating').length>0){
		var cloneBtn=$('#fixedBtn').clone().attr('id','cloneBtn').attr('class','cloneBtn t1').wrapInner('<div class="c-article"></div>')
		$('body').append(cloneBtn);
		$(window).scroll(function(){
		if($(window).scrollTop()>$('#fixedBtn').offset().top){
			$('.cloneBtn').addClass('on');
		}else{
			$('.cloneBtn').removeClass('on');
		}
		}).scroll();
	}

	// 서비스/금융 카테고리 스크롤 시 #wrap과 cloneBtn 여백 추가(.btnShowHide은 페이지마다 clone스크립트가 삽입되어 있음)
	if($('.dx-btnFloating').length>0 || $('.btnShowHide').length>0) {
		$(window).scroll(function() {
			if($(window).scrollTop() > $('#fixedBtn').offset().top) {
				$('#wrap').addClass('cloneBtn-open');
			} else{
				$('#wrap').removeClass('cloneBtn-open');
			}
		}).scroll();
	}
})



// 4depth
function dxDepth4 (id, title, tabTitle) {
	var dxInterval = setInterval(function(){
	a = a + 1
		if(typeof($menu.list)=='object'){
			//console.log('interval-in')
			var depthTx = [];
			var tabBol = false;
			var headerTitle = "";
			
			depthTx.push('<div class="tab_type01 swiper_tab depth4-tab" id="tabSwiper0"><div class="tab_pull">');
			depthTx.push('<button type="button" class="swiper-button-prev swiper-button-disabled" tabindex="0" role="button" title="이전 슬라이드 보기" aria-disabled="true">');
			depthTx.push('<span class="blind">이전</span></button>');
			depthTx.push('<button type="button" class="swiper-button-next swiper-button-disabled" tabindex="0" role="button" title="다음 슬라이드 보기" aria-disabled="true">');
			depthTx.push('<span class="blind">다음</span></button>');
			depthTx.push('<div class="swiper-container swiper-container-initialized swiper-container-horizontal">');
			depthTx.push('<ul class="tab_list swiper-wrapper" role="tablist" style="transform: translate3d(0px, 0px, 0px);">');
			if(!_.isEmpty($menu.list)) {
				
				$menu.list.forEach(function(d1, index) {
					
					if(!_.isEmpty(d1.menu)) {
						
						d1.menu.forEach(function(d2, index) {
							
							var isEmpty3Depth  = _.isEmpty(d2.menu);
							
							if(!isEmpty3Depth) {
								
								d2.menu.forEach(function(d3, index) {
									
									var isEmpty4Depth  = _.isEmpty(d3.menu);
									
									if(!isEmpty4Depth) {
										
										d3.menu.forEach(function(d4, index) {
											
											tabBol = true;
											if(id != "" && title != "" && tabTitle != "") {
												if(d4.parentId == id) {
													headerTitle = title;
													depthTx.push('<li class="swiper-slide ' + (tabTitle == $.trim(d4.title) ? 'current' : '') + '  swiper-slide-active" role="none">');
													depthTx.push('<a href="'+ d4.link +'" data-link="true" role="tab" aria-selected="true" class="role_link">' + d4.title + '</a></li>');
												}
											}
										});
									} 
								});
							}
						});
					}
				});
			}
			depthTx.push('</ul><span class="swiper-notification" aria-live="assertive" aria-atomic="true"></span></div></div></div>');
			if(tabBol) {
				$('.h_title38').after(depthTx.join(''));
				$('.h_title38').text(headerTitle);
			}
			clearInterval(dxInterval)
			//console.log('clearInterval')
		}else if(a>5000){
			clearInterval(dxInterval)
			//console.log('5000 clearInterval')
		}
		//console.log($menu.list )
	},10);
}

/* 공지사항 목록 버튼 변경 */
$(function(){
if(document.URL.match('/helpdesk/dataRoom/MOBFM164/')){
	$('.btn_wrap.m_fixed .btn.default.blue.next').attr('href','/mob/MOBFM164N/MOBFM164R05.shc')
}
});



/* 검색 접근성 추가 */
function dxHandleAccPopOn(fillter) {
    //console.log('if 전 ', document.body.classList.contains('slowTotalSearch'))
    if( document.body.classList.contains('slowTotalSearch') ) return;
    setTimeout(function(){
        
        //console.log('on 실행됨')
        // if(fillter === "main") {
        //     ui.commonAccess.disable($('#wrap').siblings(), 'modal');
        //     ui.commonAccess.disable($('#quickSrch').siblings(), 'modal');
        //     ui.commonAccess.disable($('#container'), 'modal');
        //     ui.commonAccess.disable($('#footer'), 'modal');
        //     return;
        // }
        // ui.swiperAccess($('.autoComplete_swiper .swiper-container'), 'auto');
        // ui.commonAccess.disable($('#skipNavi'), 'modal');
        // ui.commonAccess.disable($('#header'), 'modal');
        // ui.commonAccess.disable($('.totalSrch_header').siblings(), 'modal');
        // ui.commonAccess.disable($('.totalSrch_container').siblings(), 'modal');
        // ui.commonAccess.disable($('.quick_fixed'), 'modal');
        if(document.body) {document.body.classList.add('slowTotalSearch')}
    }, 0)
}
function dxHandleAccPopOff(fillter) {
    //console.log('off 실행됨')
    if(fillter === "main") {
    //     ui.commonAccess.enable($('#wrap').siblings(), 'modal');
    //     ui.commonAccess.enable($('#quickSrch').siblings(), 'modal');
        ui.commonAccess.enable($('#container'), 'modal');
        ui.commonAccess.enable($('#footer'), 'modal');
        return;
    }
    // ui.commonAccess.enable($('#skipNavi'), 'modal');
	// ui.commonAccess.enable($('#header'), 'modal');
	// ui.commonAccess.enable($('.totalSrch_header').siblings(), 'modal');
	// ui.commonAccess.enable($('.totalSrch_container').siblings(), 'modal');
	// ui.commonAccess.enable($('.quick_fixed'), 'modal');
    // ui.commonAccess.enable($('#container'), 'modal');
    var totalcont = $('section.contents');
    setTimeout(function() {
        if(document.body) {document.body.classList.remove('slowTotalSearch')}
    }, 350)
}



// 툴팁 추가
function dxOpenTooltip(tar, btn){
	var $target = $(tar);
	var $tooltip = $target.find(".tooltip_box");
	var $btn = $(btn);
	var setTime;
	var events;
	var posLeft;
	var posRight;
	var posTop;
	var posBtm;
	var resizePos = function() {
		var winWidth = $(window).width();
		var boxWidth = $('.SH_submain').length > 0 ? $btn.closest('.m-article').width() :  $btn.closest('.ly_inner').width();
        // 마이샵에서 툴팁 사용시 SH_submian 이나 ly_inner를 찾을 수 없어 myshop-inner를 활용하게끔 수정.
        if($('.myshop-inner').length > 0 && $('.ly-inner').length === 0) boxWidth = $btn.closest('.myshop-inner').width();
		var marginHalf = (winWidth - boxWidth) / 2;
		var $targetWidth = $target.width();
		var $targetWidthHalf = $target.width() / 2;
		var $btnwidthHaft = $btn.width() / 2;

		posLeft = $btn.offset().left;
		//아래로 노출(기본값)
		posTop = $btn.offset().top + 32;
		
		//위로 노출
		if ($btn.attr('data-vertical') == 'up') {
			$target.addClass('up');
			posTop = $btn.offset().top - $target.outerHeight() - 10;
		}
		// content에 있을때
		if ($target.closest('.contents').length) {
			posTop = posTop - $(header).outerHeight();
		}

		if(posLeft < marginHalf + $targetWidthHalf - $btnwidthHaft) {
			// 좌측인 경우
			$target.prop('style').removeProperty('right');
			$target.removeClass('right');
			$target.addClass('left');
			posLeft = posLeft + $btnwidthHaft;
		} else if(posLeft > marginHalf + boxWidth - $targetWidthHalf - $btnwidthHaft) {
			// 우측인 경우
			$target.prop('style').removeProperty('left');
			$target.removeClass('left');
			$target.addClass('right');
			posRight = winWidth - $btn.offset().left - $btnwidthHaft;
		} else {
			// 중앙인 경우
			$target.prop('style').removeProperty('right');
			$target.removeClass('left');
			$target.removeClass('right');
			posLeft = posLeft - $targetWidthHalf + $btnwidthHaft;
		}
		if($target.hasClass('right')) {
			// 우측인 경우 right 설정
			$target.stop().animate({top: posTop, right: posRight}, 0);
		} else {
			// 중앙과 좌측은 left 설정
			$target.stop().animate({top: posTop, left: posLeft }, 0);
		}
	}

	// if ($target.parent('.contents').length === 0 && $target.closest('.contents').length === 1) {
    //     $target.appendTo('.contents');
    // }

	resizePos();
	if (isPcOnly) { events = 'scroll' } else { events = 'resize scroll'}
	$(window).on(events, function(){
		clearTimeout(setTime);
		setTime = setTimeout(function(){ resizePos() }, 500);
	});

	// service-2020.js에서 .btn_close 클릭 시 팝업을 닫는 로직으로 인해 .btn_tooltip_close로 닫기 추가
	if($('.tooltip_wrap:visible').not(tar).find('.btn_close').length !== 0) {
		$('.tooltip_wrap:visible').not(tar).find('.btn_close').trigger('click');
	} else {
		$('.tooltip_wrap:visible').not(tar).find('.btn_tooltip_close').trigger('click');
	}
	$target.fadeIn(300, function () {
		$target.addClass('tooltip-open');
		$target.find('.tooltip_cont').attr({'tabindex': 0, 'role': 'text' }).focus();
	});

	dxCloseTooltip(tar, btn);
};

//툴팁 닫기
function dxCloseTooltip(tar, btn, state){
	console.log(tar, btn)
	var $target = $(tar);
	var $tooltip = $target.find(".tooltip_box");
	// service-2020.js에서 .btn_close 클릭 시 팝업을 닫는 로직으로 인해 .btn_tooltip_close로 닫기 추가
	var $btnClose = $target.find(".btn_close").length !== 0 ? $target.find(".btn_close") : $target.find(".btn_tooltip_close");
	var $btn = $(btn);
	console.log('$target', $target, '$(tar)', $(tar))
	console.log('$btnClose', $btnClose)
	$btnClose.off('click.pub').on({
		"click.pub" : function(){
			$target.fadeOut(300, function(){
				if ($('.tooltip_wrap:visible').length == 0) { $btn.focus() }
			});
			$target.removeClass('tooltip-open')
		}
	});
};

// 서브메인 스와이프
function dxSwiper1(elm, slideNum) {
	if($(elm + ' .swiper-slide').length > 1) {
		var dxSwiper1 = new Swiper(elm + ' .swiper-container', {
			slidesPerView: slideNum, // PC 개수
			autoHeight:false,
			spaceBetween: 30,
			navigation: {
				nextEl: elm + ' .swiper-button-next',
				prevEl: elm + ' .swiper-button-prev',
			},
			watchSlidesVisibility: true,
			on: {
				beforeInit: function() {
					// 슬라이드가 5개 이상인 경우 클래스 추가(디자인 변경용도)
					if($(elm + ' .swiper-container .swiper-slide').length > 4) {
						$(this.el).parent().addClass('type2');
					}
					// 슬라이드가 7개 이상인 경우 auto 설정(가로값 고정)
					if($(elm + ' .swiper-container .swiper-slide').length > 6) {
						this.params.slidesPerView = 'auto'
					}
				},
				init: function() {
					ui.swiperAccess($(elm + ' .swiper-container .swiper-container'), 'auto');
					// spaceBetween 값 지정하기 위해 리사이즈 강제 실행
					setTimeout(function() {
						window.dispatchEvent(new Event('resize'));
					})
				},
				slideChangeTransitionStart: function() {
					ui.swiperAccess($(elm + ' .swiper-container .swiper-container'), 'auto');
				},
				resize: function() {
					ui.swiperAccess($(elm + ' .swiper-container .swiper-container'), 'auto');
					// 서브메인이라 1200px 기준 4개 이하인 경우 spaceBetween 30설정
					this.params.spaceBetween = ($(window).outerWidth() > 1200) && this.slides.length < 5 ? 30 : 18
					this.slideTo(0);
					this.update();
				},
			},
			breakpoints: {
				1200: { // MO auto
					slidesPerView: 'auto',
				},
			},
		});
	} else {
		$(elm).addClass('no-swiper')
	}
}
                                                                                                        
                                                                                                                                                                                                         
// 상위 클릭 시(이벤트 전파) ele가 있으면  tab으로 포커스와 탭이동
// 인자: [{ ele: "아이디 or 클래스명", tab: "$(dom)" }]
function dxSelectTabs(eles) {
	if(!eles) return;
	return function(e) {
		for(var i = 0; i < eles.length; i++) {
			if(e.target.classList.contains(eles[i].ele.slice(1)) || e.target.closest(eles[i].ele)) {
				eles[i].tab.click();
				eles[i].tab.focus();
				return false;
			}
		}
	}
}


// 마이서브메인 - 결제할 금액 툴팁 닫은 후 포커스 이동
function dxFocusMiniTooltip() {
    $('#mini_tooltip').hide();
    setTimeout(function() {
        $('#mini_tooltip').next().find('.btn').focus();
    },300)
}

// 마이서브메인 - 툴팁 오늘 하루 보지않기
function setTostLS(a,b){
    localStorage.setItem(a,b);
}
	
function delTostLS(a){
    localStorage.removeItem(a);
}
	
function getTostLS(a){
    return localStorage.getItem(a);
}
	
function checkMyTooltip(){
    var showDate= new Date();
    var getDate= getTostLS('tooltip01');
    var CompareDate = new Date(getDate);	
    if(getDate == undefined || getDate == null || CompareDate.getTime() <= showDate.getTime()){
        $('#mini_tooltip').css('display','inline-flex');
    }
	// console.log("설정시간 : " + CompareDate + CompareDate.getTime() +"\n현재시간 : " +showDate + showDate.getTime())
}
	
function myTooltip(){
    var showDate = new Date();
    showDate.setDate(showDate.getDate()+1);
    setTostLS('tooltip01',showDate);
    dxFocusMiniTooltip();
}
                                                                                              
// 헤더 툴팁
$(function(){
    setTimeout(function(){
        $('.userTime_btn').on('click', function(){
            var target = $(this).parents('.timer').next();
            $(this).attr('aria-expanded', 'true');
            target.fadeIn();
            //return hdFlag = true;
        });
        $('.userSate_close').on('click', function(){
            var target02 = $(this).parents('.userTime_tooltip');
            var target02_btn = target02.siblings('.timer').children('.userTime_btn');
            target02.fadeOut();
            target02_btn.attr('aria-expanded', 'false');
            setTimeout(function(){
                target02_btn.focus();
            },500);
            //return hdFlag = false;
        });
    },500);
});


// 라디오 버튼 일정개수만 보여주고 더보기 버튼으로 추가 노출 시 사용(/pconts/dx/svn/my/MOBFM018C01_2.html)
function moreRadio(tarEle, listItem) {
	var tar = document.getElementById(tarEle);
	var item = tar.querySelectorAll(listItem);
	var toggleBtn = document.querySelector('[aria-controls="' + tarEle + '"]');
	var hiddenItemIndex = null;
	// 히든요소 인덱스 찾기
	for(var i = 0; i < item.length; i++) {
		var li = item[i];
		var computerSTyle = window.getComputedStyle(li);
		if(window.getComputedStyle(li).display === 'none') {
			hiddenItemIndex = i;
			break;
		}
	}
	// 버튼 토글
	if(toggleBtn.getAttribute('aria-expanded') === 'false') {
		tar.classList.add('expand');
		toggleBtn.setAttribute('aria-expanded', true);
		toggleBtn.innerHTML = '<span>접기</span>';
		// 포커스 이동 제거
		// item[hiddenItemIndex].querySelector('input').focus();
	} else {
		tar.classList.remove('expand');
		toggleBtn.setAttribute('aria-expanded', false);
		toggleBtn.innerHTML = '<span>더보기</span>';
	}
}

//SOL트래블 체크 카드 페이지 > 해외 이용 프로모션 > 마스터 트래블 리워드 서비스 보러가기: /pconts/html/card/apply/check/1225714_2206.html
//SOL트래블 체크 > 가맹점 혜택 더보기 버튼: /pconts/html/card/travel/travel_check.html
//마스터카드 가맹점 혜택 안내: /pconts/html/card/travel/mtrguide.html
function mtrInfoSwiper(elm){
	var cSwiper = new Swiper(elm + ' .swiper-container', {
		pagination: {
			el: elm + ' .swiper-pagination',
			clickable:'true',
		},
		slidesPerView:2, 
		spaceBetween:148,
		//noSwiping: true,
		//noSwipingClass: 'no-swiping',
		breakpoints: {
			640: {
					slidesPerView: 1,
					spaceBetween:0,
					//noSwiping: false,
				},
			},    
		watchSlidesVisibility: true,
		on: {
			init: function(){ 
				ui.swiperAccess($(elm + ' .swiper-container'));
			},
			slideChangeTransitionStart: function(){ 
				ui.swiperAccess($(elm + ' .swiper-container'));
			},
			resize: function(){ 
				ui.swiperAccess($(elm + ' .swiper-container'));
			},
		}
	});
}

// 20240326403437 카드신청 카드 선택 페이지
function dxCardBridge() {
	if (window.NodeList && !NodeList.prototype.forEach) {
		NodeList.prototype.forEach = Array.prototype.forEach;
	}
	if (document.querySelector('#cardBridgeSwiper .swiper-container') !== null) {
		var cardBridgeSwiper = new Swiper('#cardBridgeSwiper .swiper-container', {
			slidesPerView: 'auto',
			centeredSlides: true,
			navigation: {
				nextEl: '#cardBridgeSwiper .swiper-button-next',
				prevEl: '#cardBridgeSwiper .swiper-button-prev',
			},
			pagination: {
				el: '#cardBridgeSwiper .swiper-pagination',
				type: 'bullets',
				clickable: true
			},
			watchSlidesVisibility: true,
			on: {
				init: function () {
					cardBridgeSwiperA11y();  // 웹 접근성
					cardFlipping();          // 카드 회전
					setCardTitle(this);      // 슬라이드 title 세팅
					setCardAria(this);       // 슬라이드 aria 세팅
					setCardName(this);       // 카드이름 세팅
					showCheckDesign();       // 카드이름 체크 디자인
					setTooltip();            // 툴팁
					setCheckbox(this);       // 엑티브된 슬라이드 체크박스 선택
					setCardContents(this);   // 카드별 콘텐츠 영역
				},
				slideChange: function () {
					setCardName(this);       // 카드이름 세팅
					setCheckbox(this);       // 엑티브된 슬라이드 체크박스 선택
					setCardContents(this);   // 카드별 콘텐츠 영역
				},
				transitionEnd: function () {
					cardBridgeSwiperA11y();  // 웹 접근성
					setCardTitle(this);      // 슬라이드 title 세팅
					setCardAria(this);       // 슬라이드 aria 세팅
					showCheckDesign();       // 카드이름 체크 디자인
				},
				resize: function () {
					// cardBridgeSwiperA11y();  // 웹 접근성
				}
			}
		});
	}

	// 카드 회전
	function cardFlipping() {
		if (navigator.userAgent.indexOf('Trident') !== -1) {
			if(!Element.prototype.matches) {
				Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
			}

			if(!Element.prototype.closest) {
				Element.prototype.closest = function(s) {
					var el = this;
					do {
						if(el.matches(s)) return el;
						el = el.parentElement || el.parentNode;
					} while (el !== null && el.nodeType === 1);
					return null;
				}
			}
		}

		var cardBtn = document.querySelectorAll('button.card-btn');
		if(cardBtn.length > 0) {
			cardBtn.forEach(function (item, index) {
				item.addEventListener('click', function () {
					var isActiveSlide = this.closest('.swiper-slide').classList.contains('swiper-slide-active');
					if (isActiveSlide) {
						if (navigator.userAgent.indexOf('Trident') !== -1) { //익스에서는 플립안됨
							var cardBack = this.querySelector('.card-back');
							cardBack.classList.toggle('cardRotate')
							return false
						}
						if (this.closest('.swiper-slide').classList.contains('swiper-slide-active')) {
							this.parentElement.classList.toggle('flip180');
							// 카드가 회전하는 동안 overflow:visible로 유지하기 위에 flipping 추가
							this.parentElement.classList.add('flipping');
							setTimeout(function () {
								this.parentElement.classList.remove('flipping');
							}.bind(this), 500)
						}
					}
				});
			})
		}
	}

	// 엑티브된 슬라이드 체크박스 선택
	function setCheckbox(swiper) {
		var cardBridgeSlides = document.querySelectorAll('#cardBridgeSwiper .swiper-slide');
		var hasInput = true;
		cardBridgeSlides.forEach(function(item) {
			hasInput = item.querySelector('input') !== null ? true : false
			if(hasInput) {
				item.querySelector('input').checked = false;
			}
		})
		if(hasInput) {
			swiper.slides[swiper.activeIndex].querySelector('input').checked = true;
		}
	}

	// 웹 접근성
	function cardBridgeSwiperA11y() {
		ui.commonAccess.disable($('#cardBridgeSwiper .swiper-slide'), 'swiper');
		ui.commonAccess.enable($('#cardBridgeSwiper .swiper-slide-active'), 'swiper');
	}

	// 카드별 이름 세팅
	function setCardName(swiper) {
		document.getElementById('cardBridgeTit').textContent = swiper.slides[swiper.activeIndex].dataset.cardName;
	}

	// 카드별 이름 체크 디자인
	function showCheckDesign() {
		var cardBridgeCheck = document.getElementById('cardBridgeTit')
		cardBridgeCheck.classList.remove('show')
		setTimeout(function() {
			cardBridgeCheck.classList.add('show')
		},200)
	}

	// 카드별 콘텐츠 영역 노출
	function setCardContents(swiper) {
		var cardBridgeArea = document.querySelectorAll('.cardBridge-contents');
		cardBridgeArea.forEach(function(item) {
			item.classList.remove('show')
			document.getElementById('cardArea' + swiper.activeIndex).classList.add('show')
		})
	}

	// 슬라이드 title 세팅
	function setCardTitle(swiper) {
		var activeSlideBtn = swiper.slides[swiper.activeIndex].querySelector('.card-btn');
		for (var i = 0; i < swiper.slides.length; i++) {
			// title 초기화
			var slidesBtn = swiper.slides[i].querySelector('.card-btn');
			slidesBtn.setAttribute('title', '카드 선택하기')
		}
		activeSlideBtn.setAttribute('title', '선택된 카드 반대편 보기');
	}

	// 슬라이드 aria 세팅
	function setCardAria(swiper) {
		var slidesBtn = swiper.slides[swiper.activeIndex].querySelector('button.card-btn');
		if(slidesBtn !== null) {
			slidesBtn.addEventListener('click', function () {
				var cardFornt = this.querySelector('.card-front');
				var cardBack = this.querySelector('.card-back');
				var isFlip = event.currentTarget.parentElement.classList.contains('flip180');
				if (isFlip) {
					cardFornt.setAttribute('aria-hidden', true);
					cardBack.setAttribute('aria-hidden', false);
				} else {
					cardFornt.setAttribute('aria-hidden', false);
					cardBack.setAttribute('aria-hidden', true);
				}
			})
		}
	}

	// 툴팁
	function setTooltip() {
		var cardBridgeTooltip = document.getElementById('cardBridgeTooltip');
		if(cardBridgeTooltip) {
			var cardBridgeTooltipBtn = cardBridgeTooltip.querySelector('.btn-tooltip');
			cardBridgeTooltipBtn.addEventListener('click', function () {
				cardBridgeTooltip.classList.add('hide');
				document.querySelector('#cardBridgeSwiper .swiper-slide-active .card-btn').focus();
			})
		}
	}

	
}

document.addEventListener('DOMContentLoaded', function () {
	dxCardBridge();
});
             

function dxReForm1() {
    //input type=tel에 삭제버튼 기능 적용
    if(!$('.form_ele.type1 .input-txt')) return;
    $('.form_ele.type1 .input-txt').on('input',function(){
        ui.inputClearButtonAction($(this));
    })
}

function dxReFixed1(){
    var btnWrap = $('.btn_wrap.fixed1-dx');
    if(!$('.btn_wrap.fixed1-dx')) return
    setTimeout(function(){
        var footer = $('#footer');   
        var footerTop = footer.offset().top;
        // 초기 버튼위치 조정
        adjustButtonPosition();
        
        // 스크롤 이벤트 핸들러
        $(window).scroll(function(){
            adjustButtonPosition();
        });

        // 브라우저 크기 변경 이벤트 핸들러
        $(window).resize(function(){
            adjustButtonPosition();
        })

        // 버튼 위치 조정 함수
        function adjustButtonPosition(){
            var windowWidth = $(window).width();

            if(windowWidth > 1100){
                var windowHeight = $(window).height();
                var scrollTop = $(window).scrollTop();
                var windowBottom = scrollTop + windowHeight;
                var footerTop = footer.offset().top;

                if(windowBottom >= footerTop){
                    btnWrap.css({'bottom': (windowBottom - footerTop) + 'px'});
                } else{
                    btnWrap.css({'bottom': '0'});
                }
            } else {
                btnWrap.css({'bottom': '0'});
            }
        };
    },100)    
}

//처음카드 초기 셋팅
function startCard(){
	if(!$('section').is('#startCard')) return;
	
	//하단 fixed 버튼 padding을 주기위한..
	if($('section').is('#startCard') == true){
		$('#wrap').addClass('startCard-wrap')
	}     

	//text-flow animation
	var play = true;
	var tflowControl = $('#text-flow-control');
	var tflowSpan = $('.text-flow > div > span');
	tflowControl.on('click',function(){
		if(play){
			tflowSpan.css('animation-play-state','paused');
			play = false;
			$(this).addClass('paused').attr('aria-pressed',true).find('.hidden-text').text('재생')
		}
		else {
			tflowSpan.css('animation-play-state','running');
			play = true;
			$(this).removeClass('paused').attr('aria-pressed',false).find('.hidden-text').text('멈춤')
		}
	})  

	/* 상단 lottie */
	var travalChCardVisual = bodymovin.loadAnimation({
		container: document.querySelector('.lottie'),
		path: '/pconts/images/dx/contents/st-firstcard_PC.json',
		renderer: 'svg',
		autoplay: true,
	});

	// 버튼 제어
	var fixedBtn = document.getElementById('fixedBtn');
	window.addEventListener('scroll', function() {
		// 스크롤 시 버튼 fixed
		var scrollPos = window.innerHeight + scrollY
		if(scrollY > 400) {
			fixedBtn.classList.add('fixed');
		} else {
			fixedBtn.classList.remove('fixed');
		}
	})

	function dxCardStart() {
		if (window.NodeList && !NodeList.prototype.forEach) {
			NodeList.prototype.forEach = Array.prototype.forEach;
		}
		if (document.querySelector('#startcardSwiper .swiper-container') !== null) {
			var cardBridgeSwiper = new Swiper('#startcardSwiper .swiper-container', {
				slidesPerView: 'auto',
				centeredSlides: true,
				navigation: {
					nextEl: '#startcardSwiper .swiper-button-next',
					prevEl: '#startcardSwiper .swiper-button-prev',
				},
				pagination: {
					el: '#startcardSwiper .swiper-pagination',
					type: 'bullets',
					clickable: true
				},
				watchSlidesVisibility: true,
				on: {
					init: function () {
						cardBridgeSwiperA11y();  // 웹 접근성
						cardFlipping();          // 카드 회전
						setCardTitle(this);      // 슬라이드 title 세팅
						setCardAria(this);       // 슬라이드 aria 세팅
						setCardName(this);       // 카드이름 세팅
					},
					slideChange: function () {
						setCardName(this);       // 카드이름 세팅
					},
					transitionEnd: function () {
						cardBridgeSwiperA11y();  // 웹 접근성
						setCardTitle(this);      // 슬라이드 title 세팅
						setCardAria(this);       // 슬라이드 aria 세팅
					},
					resize: function () {
						cardBridgeSwiperA11y();  // 웹 접근성
					}
				}
			});
		}

		// 카드 회전
		function cardFlipping() {
			if (navigator.userAgent.indexOf('Trident') !== -1) {
				if (!Element.prototype.matches) {
					Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
				}

				if (!Element.prototype.closest) {
					Element.prototype.closest = function (s) {
						var el = this;
						do {
							if (el.matches(s)) return el;
							el = el.parentElement || el.parentNode;
						} while (el !== null && el.nodeType === 1);
						return null;
					}
				}
			}

			var cardBtn = document.querySelectorAll('.card-btn');
			cardBtn.forEach(function (item, index) {
				item.addEventListener('click', function () {
					var isActiveSlide = this.closest('.swiper-slide').classList.contains('swiper-slide-active');
					if (isActiveSlide) {
						if (navigator.userAgent.indexOf('Trident') !== -1) { //익스에서는 플립안됨
							var cardBack = this.querySelector('.card-back');
							cardBack.classList.toggle('cardRotate')
							return false
						}
						if (this.closest('.swiper-slide').classList.contains('swiper-slide-active')) {
							this.parentElement.classList.toggle('flip180');
							// 카드가 회전하는 동안 overflow:visible로 유지하기 위에 flipping 추가
							this.parentElement.classList.add('flipping');
							setTimeout(function () {
								this.parentElement.classList.remove('flipping');
							}.bind(this), 500)
						}
					}
				});
			})
		}

		// 웹 접근성
		function cardBridgeSwiperA11y() {
			ui.commonAccess.disable($('#startcardSwiper .swiper-slide'), 'swiper');
			ui.commonAccess.enable($('#startcardSwiper .swiper-slide-active'), 'swiper');
		}

		// 카드이름 세팅
		function setCardName(swiper) {
			document.getElementById('cardBridgeTit').textContent = swiper.slides[swiper.activeIndex].dataset.cardName;
		}

		// 슬라이드 title 세팅
		function setCardTitle(swiper) {
			var activeSlideBtn = swiper.slides[swiper.activeIndex].querySelector('.card-btn');
			for (var i = 0; i < swiper.slides.length; i++) {
				// title 초기화
				var slidesBtn = swiper.slides[i].querySelector('.card-btn');
				slidesBtn.setAttribute('title', '카드 선택하기')
			}
			activeSlideBtn.setAttribute('title', '선택된 카드 반대편 보기');
		}

		// 슬라이드 aria 세팅
		function setCardAria(swiper) {
			var slidesBtn = swiper.slides[swiper.activeIndex].querySelector('.card-btn');
			slidesBtn.addEventListener('click', function () {
				var cardFornt = this.querySelector('.card-front');
				var cardBack = this.querySelector('.card-back');
				var isFlip = event.currentTarget.parentElement.classList.contains('flip180');
				if (isFlip) {
					cardFornt.setAttribute('aria-hidden', true);
					cardBack.setAttribute('aria-hidden', false);
				} else {
					cardFornt.setAttribute('aria-hidden', false);
					cardBack.setAttribute('aria-hidden', true);
				}
			})
		}
	}
	dxCardStart() 
}


/* common.js의 progressScroll 커스텀 - 일부결제금액이월약정(리볼빙) 페이지의 안내사용 팝업에 사용 */
function progressScroll2() {
	var $eleProgress = $('.progress_bar');
	var maxScroll;
	var curScroll;
	var perScroll;
	$eleProgress.each(function () {
		if ($(this).is('[data-scroll]') == true && $(this).closest('.pop_wrap')) {
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
}

// 숫자 증가시키기(타겟, 시간)
function dxCountIncrease(target, dur) {
	var counterElement = document.querySelector(target);
	// 요소에 애니메이션 적용
	var countLimit = parseInt(counterElement.textContent, 10);
	var duration = dur; // 애니메이션 시간(ms)
	var start = null;

	function step(timestamp) {
		if(!start) start = timestamp;
		var progress = timestamp - start;
		var percentage = Math.min(progress / duration, 1); // 진행률은 최대 1까지

		// 값 계산
		var currentValue = Math.floor(countLimit * percentage).toLocaleString(); // 쉼표 추가
		counterElement.textContent = currentValue;

		// 애니메이션 종료 조건
		if(progress < duration) {
			requestAnimationFrame(step);
		}
	}
	requestAnimationFrame(step)
}
// 사용 예시 dxCountIncrease('#countIncrease1', 2000); 
 

$(document).ready(function () {


if ($('div[data-bind-view^="MOBFM043"]').length > 0) {
	function hisavecall(mutationsList){
		for(var i = 0; i < mutationsList.length; i++){
			var mutation = mutationsList[i];
			if(mutation.attributeName === 'style'){
				var displayStyle = $(mutation.target).css('display');
				if(displayStyle === 'none'){
					console.log('none')
				} else if(displayStyle === 'block'){
					if($('#hisv_chg_inner').css('display') === 'none' ){
						$('#hisv_chg_inner').after('<div class="ly_inner"><div class="btn_wrap btn-wrap-dx btn-third usage_info_btn gap60"><button type="button" class="btn btn_sm btn_print print only-pc" title="새 창열기"><span>인쇄하기</span></button></div></div>')
					}
				}
			}
		}
	}
	
	var observer = new MutationObserver(hisavecall);
	var targetview = document.querySelector('[data-bind-view="MOBFM043R0301"]');
	observer.observe(targetview, { attributes : true});
}


                                                     

// 이용대금 명세서
// 명세서 박스 레이아웃 함수

// var selector = 'div[data-bind-view^="MOBFM043"]';
// var targetNode = $(selector);

// 	targetNode.each(function(){
// 			var observer = new MutationObserver(function(matationList){
// 			for(var i = 0; i < matationList.length; i++){
// 				var mutation = matationList[i];
// 				if(mutation.type === 'attributes' && mutation.attributeName === 'style'){
// 					contsLayout($('.usage_payBoxWrap .payBox .conts'));
// 				}
// 			}
// 		});

// 		observer.observe(this, {attributes : true});
// 	});


// function contsLayout(elements) {
// 	var $wrap = $('.usage_payBoxWrap .payBox');
// 	var columns = 2;
// 	var columnsHeight = Array(columns).fill(0);
// 	var columnsWidth = ($wrap.width() - 20) / columns;
// 	var visibleEle = elements.filter(':visible');
// 	visibleEle.each(function () {
// 		var $cont = $(this);
// 		var minHightColumn = columnsHeight.indexOf(Math.min.apply(null, columnsHeight));
// 		var top = columnsHeight[minHightColumn];
// 		var left = minHightColumn * (columnsWidth + 20);
// 		$cont.css({
// 			top: top,
// 			left: left
// 		});
// 		columnsHeight[minHightColumn] += $cont.outerHeight(true) + 20;
// 	});
// 	var maxHeightConts = Math.max.apply(null, columnsHeight);
// 	$wrap.css('height', (maxHeightConts - 20) + 'px');
// 	// conts 박스 1개일 경우 full 클래스 추가
// 	if(visibleEle.length == 1 ){
// 		$('.usage_payBoxWrap').addClass('full');
// 	}else{
// 		$('.usage_payBoxWrap').removeClass('full');
// 	}

// };

// var targetSelectors = $('.usage_payBoxWrap .payBox .conts')
// targetSelectors.each(function(){
// 		var observerconts = new MutationObserver(function(matationList){
// 		for(var i = 0; i < matationList.length; i++){
// 			var mutation = matationList[i];
// 			if(mutation.type === 'attributes' && mutation.attributeName === 'style'){
// 				contsLayout($('.usage_payBoxWrap .payBox .conts'));
// 			}
// 		}
// 	});
// 	observerconts.observe(this, {attributes : true});
// });

// $(window).on('load',function(){
// 	//초기 레이아웃 설정
// 	contsLayout($('.usage_payBoxWrap .payBox .conts'));
// });
// $(window).on('resize',function(){
// 	//창크기변화 레이아웃 설정
// 	contsLayout($('.usage_payBoxWrap .payBox .conts'));
// });
$(document).ajaxStop(function () {
	// if ($('.usage_payBoxWrap').length > 0) {
	// 	setTimeout(function () {
	// 		contsLayout($('.usage_payBoxWrap .payBox .conts'));
	// 		var targetSelectors = $('.usage_payBoxWrap .payBox .conts')
	// 			  targetSelectors.each(function(){
	// 			  var observerconts = new MutationObserver(function(matationList){
	// 			  for(var i = 0; i < matationList.length; i++){
	// 				  var mutation = matationList[i];
	// 				  if(mutation.type === 'attributes' && mutation.attributeName === 'style'){
	// 					  contsLayout($('.usage_payBoxWrap .payBox .conts'));
	// 				  }
	// 			  }
	// 		  });
	// 		  observerconts.observe(this, {attributes : true});
	// 		  });
	// 	},100)
	// 	$('.usage_payBoxWrap .conts .accordion_header button').click(function () {
	// 		setTimeout(function () {
	// 			contsLayout($('.usage_payBoxWrap .payBox .conts'))
	// 		}, 0)
	// 	});
	// }


	// 장기카드대출 금융계산기 폰트 사이즈 변경 script
	if ($('div[data-bind-view^="MOBFM607"]').length > 0) {
		var windowWidth = $(window).width();

		$('#overWrapCalcul.btn').on('click', function () {
			setTimeout(function () {
				$('#loan_calculate02 .sctest .ui_select select').change(function () {
					var selectIndex = $(this).prop('selectedIndex');
					if (selectIndex === 1) {
						$(this).css('font-size', '16px')
						$('.sctest .ui_select_value').css('font-size', '16px');
						if(windowWidth < 1100){
							$(this).css('font-size', '14px')
							$('.sctest .ui_select_value').css('font-size', '14px');
						}
					} else {
						$(this).css('font-size', '24px')
						$('.sctest .ui_select_value').css('font-size', '24px');
					}
					if (windowWidth < 321) {
						$(this).css('font-size', '16px')
					}
				});
			}, 100)

		})
	};



});



  // 이용대금 명세서 월 선택팝업 스크롤 위치
  $(".loan_ns_ver .this_month").click( function() {
      var popupbox = $(".month_select").closest(".pop_cont");
      setTimeout( function() {
          if( $(".pop-dx.pop_tf").length > 0 ) {
              monthActiveScrollTo();
          }
      }, 210);
  });

  function monthActiveScrollTo() {
      var popbox = $(".pop-dx.pop_tf .pop_cont");
      var topLocation = document.querySelector(".pop_tf .pop_cont .btn-group4-item.active").offsetTop;
      if( $(popbox).height() / 2 > topLocation ) {
          return;
      }

      $(popbox).animate({scrollTop: topLocation}, 0);
  }

});

//common.js > ui.selectShowEvent(); > 20240725609910 카드이용 안내 팝업
function designSelectShowCont(selector){ 
    var listSelectboxWrap = $(selector + '.select_wrap');
    var btnSelect = $(selector + ' .btn_select'); 
    var listSelectbox = $(selector + ' .list_selectbox');
    var listSelectboxAlink = listSelectbox.find('li a');
    
  
    btnSelect.on('click', function(event){ 
        //event.preventDefault();//기본 링크 방지                
        $(this).parent().addClass('hide-before');// .select_wrap::before 요소 숨기기              
    }); 

    listSelectboxAlink.on('click', function(event){ //.list_selectbox li .txt-option 클릭 시 .is_selected 추가               
       // event.preventDefault();//기본 링크 방지
        listSelectbox.find('li').removeClass('is_selected');
        $(this).parent('li').addClass('is_selected');
        var targetId = $(this).attr('href');//href의 속성 값 가져오기 (#useGuide01)
        $('.use-guide').hide();//디폴트로 .use-guide 요소 제거
        $(targetId).show();//targetId에 해당하는 요소만 표시
        $(this).parent().parent().parent().removeClass('hide-before'); // .select_wrap::before 요소 보이기 
		$('.pop-dx-sel .pop_cont').scrollTop('0')
    });  
}

// 20240806651274 The PET 카드 런칭 기념 경품이벤트 제작요청 
function dxPetEvt() {
    var agreeInputs = document.querySelectorAll('#eventContents .radio_agree input'),
        txtInputs = document.querySelectorAll('.inputSns'),
        clearBtns = document.querySelectorAll('#eventContents .btn_clear'),
        applyBtn = document.querySelector('#evtApply'),
        isAgree = false,
        isSns = false;
    agreeInputs.forEach(function(agree) { // 동의하기 버튼
        agree.addEventListener('click', function () {
            var agree1_1 = document.querySelector('#agree1_1').checked;
            var agree1_2 = document.querySelector('#agree1_2').checked;
            var agree2_1 = document.querySelector('#agree2_1').checked;
            var agree2_2 = document.querySelector('#agree2_2').checked;
            if (agree1_1 && agree2_1) { // 전체 동의 
                isAgree = true;
            } else {
                isAgree = false;
                if (
                    (agree !== document.querySelector('#agree1_1') && agree2_2) ||
                    (agree !== document.querySelector('#agree2_1') && agree1_2)
                ){ 
                    popOpen('#popAlert', this);                  
                } 
            } 
        })
    })   

    txtInputs.forEach(function(txt) { // 텍스트 인풋
        txt.addEventListener('input', function () {
            var isInputValue = Array.from(txtInputs).some(function (input) {
                return input.value.trim() !== '';// trim() / 입력된 공백 제거
            });
            isSns = isInputValue;
        })
    });

    applyBtn.addEventListener('click', function(e) {
        e.preventDefault();
        if (isSns && isAgree) { // 동의하기 2개 미선택, SNS인풋 미입력 시 팝업 노출
        } else {
            popOpen('#popAlert5', this);
        }
    })

    // 입력 초기화 버튼
    // clearBtns.forEach(function(button, index) {
    //     button.addEventListener('click', function(){
    //         var clickedBtn = this; // 클릭한 버튼
    //         var otherBtns = Array.from(clearBtns).filter(function(btn) {
    //             return btn !== clickedBtn;
    //         }).every(function(btn) {
    //             return btn.classList.contains('hide');
    //         });
    //         var clickedBtnIsHide = !clickedBtn.classList.contains('hide');

    //         if (otherBtns && clickedBtnIsHide) {
    //             isSns = false;
    //         }
    //     });
    // });
}
//

function bottomsheetGradient() {
    var elements = [
        '.pop-dx.small_tf .pop_cont',
        '.pop-dx.medium.pop_tf .pop_cont',
        '.pop-dx.medium02.pop_tf .pop_cont'
    ];
    elements.forEach(function(selector){
        var element = $(selector);
        element.on("scroll", function() {
            var scrollT = Math.floor($(this).scrollTop());
            if( scrollT > 0 ) {
                $(this).prev('.pop_head').addClass("gradient_tf");
            } else {
                $(this).prev('.pop_head').removeClass("gradient_tf");
            }
        });
    });
}

function popupViewCheck() {
	var popupViewConfig = { 
		attributes: true,
		attributeFilter: ['style'],
		childList: true
	};
	var callback = function(mutationList, popupViewObserver) {
		for ( var i=0; i < mutationList.length; i++ ) {
			var mutation = mutationList[i];
			if( mutation.type == "childList" ) {
				setTimeout( function() {
					bottomsheetGradient(); 
				}, 100);
			}
		}
	}
	var popupViewObserver = new MutationObserver(callback);
	var popupViewLocation = [
		'body', 
		'#__flying_partition__',
	];
	popupViewLocation.forEach(function(i) {
		popupViewLocation = document.querySelector(i);
		if( !popupViewLocation ) {
				return;
		}
		popupViewObserver.observe(popupViewLocation, popupViewConfig);
	});
}

$(document).ready(function() {
	
	setTimeout( function() {
		popupViewCheck();
	}, 10)
    bottomsheetGradient();
});


// 금융계산기 selectbox 선택 시
$(document).on("click", ".pop_calcul .calcul_box .ui_select_btn", function() {
    var uiSelectContainer = $(this).next().find(".mCSB_container");
    var uiSelectActionHeight = $(".pop_calcul .calcul_box .select_wrap select").outerHeight() + 1;
    var uiSelectIndex = $(uiSelectContainer).children().find("> li.is_selected").index();

    $(uiSelectContainer).css("top", -( uiSelectIndex * uiSelectActionHeight ) - uiSelectIndex );
});

// 금융계산기 selectbox 옵션 선택 시
$(document).on("click", ".pop_calcul .calcul_box .ui_select .ui_select_option a", function() {
    var selectOptionClicked = $(this);
    var scrollPositionTop = $(this).closest(".mCSB_container").css("top");
    var uiSelectContainer = $(selectOptionClicked).closest(".mCSB_container");

    $(uiSelectContainer).css("top", scrollPositionTop); // scroll position
});

// select_wrap.type02 선택된 옵션으로 스크롤이동
// selectbox 선택 시
$(document).on("click", ".select_wrap.type02 .ui_select_btn", function() {
    var uiSelectContainer = $(this).next().find(".mCSB_container");
    var uiSelectActionHeight = $(".select_wrap.type02 select").outerHeight() + 1;
    var uiSelectIndex = $(uiSelectContainer).children().find("> li.is_selected").index();
    if(uiSelectIndex > 0){
        var uiSelectIndex = uiSelectIndex - 1;
    }
    $(uiSelectContainer).css("top", -( uiSelectIndex * uiSelectActionHeight ) - uiSelectIndex );
});

// selectbox 옵션 선택 시
$(document).on("click", ".select_wrap.type02 .ui_select .ui_select_option a", function() {
    var selectOptionClicked = $(this);
    var scrollPositionTop = $(this).closest(".mCSB_container").css("top");
    var uiSelectContainer = $(selectOptionClicked).closest(".mCSB_container");

    $(uiSelectContainer).css("top", scrollPositionTop); // scroll position
});


function designSelectHandleEvent(event) {
	var winWidth = $(window).width();
	if( winWidth > 1100 ) {
		var $target = $(event.currentTarget);
		switch (event.type) {
			case 'click':
				$target.toggleClass("active");
				break;
			case 'focusout':
				$target.removeClass("active");
				break;
		}	
	}
}

// 디자인 셀렉트박스 화살표
var $calculSelector = $(".pop_calcul .calcul_box .selectDate");
$calculSelector.on("click focusout", designSelectHandleEvent);   


// 장기카드대출 금융계산기 월 상환금액 팝업 클릭 시
$(document).on("click", "#popCalculResult.calcul_result .btn_close", function() {
    if( $("#loan_calculate02").length > 0 ) {
        $('body').addClass('pop_open');
    }
});

// 장기카드대출 금융계산기 버튼 focus 이동
$(document).on("click", "#loan_calculate02.pop_calcul .btn_close", function() {
    $("#overWrapCalcul").focus();
});


// 클릭 여부를 나타내는 플래그
var wasClicked = false;
function handleLoanSelectPop(event) {
    // click 및 mousedown 이벤트
    if( event.type === "mousedown" || event.type === "click" ) {
        wasClicked = true;
    }

    // focus 이벤트
    if( event.type === "focus" ) {
        if( !wasClicked ) {
            var $element = $(this);
            var offsetTop = $element.offset().top - $(window).height() / 2;
            $("html, body").animate({ scrollTop: offsetTop }, 0);
        }
        wasClicked = fasle;
    }
    
    // 이벤트 등록
    $(".loan_select_pop").on('mousedown click focus', handleLoanSelectPop);
}


function cardloanAnimationAndText() {
    var text_1 = "약 30초 정도 소요돼요.";
    var text_2 = "거의 다 불러왔어요!";
    var text_change_interval = 10000; // 10초

    function loadLottieAnimation() {
        bodymovin.loadAnimation({
			container: document.querySelector("#loading_lottie"),
			path: '/pconts/images/dx/contents/dx_cardLoan_loading.json', //string
			renderer: 'svg',
			loop: true, //bool
			autoplay: true, //bool
		});
    }

    function changeText() {
        var $loadingText = $("#loading_txt");
        var currentText = $loadingText.text();
        $loadingText.text(currentText === text_1 ? text_2 : text_1 );
    }

    if( $("#loading_lottie").length === 0 ) {
        return;
    }

    $.getScript("/pconts/js/lottie.js")
        .done(function (script, txtStatus) {
            //console.log('lottieJS LOAD');
            loadLottieAnimation();
        })
        .fail(function (jqxhr, settings, exception) {
            //console.log('lottieJS LOAD FAIL')
        });

    setInterval(changeText, text_change_interval); // 주기적으로 텍스트 변경
}

// 장기카드대출 로딩중 MOBFM607C03.html
setTimeout( function() {
    cardloanAnimationAndText();
}, 100);



var floatingButton = {
    init: function() {
		
        var $sectionContent = $("section.dx-common-layout");

        // fixedBtn 클래스가 없으면 플로팅 실행 안함
        if( !$sectionContent.hasClass("fixedBtn") ) {
            return;
        }

        var winWidth = $(window).width();
        if( winWidth > 1100 ) {
            $(window).on("scroll", this.updateButtonPosition.bind(this)).scroll();

            // 플로팅 버튼 위치 초기화
            setTimeout( this.checkFooterPosition.bind(this), 0 );

			// 브라우저 크기 대응
            $(window).on("resize", this.updateButtonPosition.bind(this));
            $(window).on("resize", this.checkFooterPosition.bind(this));
        }

        // 섹션 내용 하단 여백 조정
        this.adjustPaddingBottom();
    },

    updateButtonPosition: function() {

		// 모바일에서 실행 x
        if( $(window).width() < 1101 ) {
			$(".btn_wrap.line_fixed").css({ 'bottom': '0' });
            return;
        }

        var $btnWrap = $(".btn_wrap.line_fixed");
        var $footer = $("#footer");

        var winHeight = $(window).height();
        var scrollTop = $(window).scrollTop();
        var windowBottom = scrollTop + winHeight;
        var footerTop = $footer.offset().top || windowBottom;
        // var footerTop = $footer.offset().top;

        $btnWrap.each( function() {
            var $this = $(this);
            var $closestSection = $this.closest(".dx-common-layout");

            if( $this.is(":visible") && $closestSection.is(":visible") ) {
                if( windowBottom >= footerTop ) {
                    $this.css({ 'bottom': (windowBottom - footerTop) + 'px' });
                } else {
                    $this.css({ 'bottom': '0' });
                }
            }
        });
    },

    checkFooterPosition: function() {
		
        var $btnWrap = $(".btn_wrap.line_fixed");
        var $footer = $("#footer");
        var winHeight = $(window).height();
        var documentHeight = $(document).innerHeight();
        var footerHeight = $footer.height();

        $btnWrap.each( function() {
            var $this = $(this);

            if( $this.is(":visible") ) {
                if( (documentHeight - winHeight) - footerHeight > footerHeight ) {
                    $footer.css({ 'top': '0' });
                } else if ( (documentHeight - winHeight) - footerHeight <= 0 ) {
                    $footer.css({ 'top': footerHeight });
                }
            }

			if ( !$this.closest(".dx-common-layout").hasClass("fixedBtn") ) {
				$footer.css({ 'top': '0' });
			}
        });

		// 완료페이지 접근 시 체크
		var $sectionComplete = $(".dx-common-layout.complete-page-dx");
		setTimeout( function() {
			$sectionComplete.each( function() {
				if( $(this).is(":visible") ) {
					$footer.css({ 'top': '0' });
				}
			});
		}, 100);
    },

    adjustPaddingBottom: function() {
		
		var $footer = $("#footer");
        var $btnWrap = $(".btn_wrap.line_fixed");
        var $btnWrapTf = $(".btn_wrap.btn-wrap-tf.m_fixed_none");

        var winWidth = $(window).width();
        var btnWraMargin = winWidth > 1100 ? 60 : 20; // PC 또는 모바일 여백

		$btnWrapTf.each( function() {
            var $this = $(this);
			var $closestContents = $this.closest(".contents");
			if( $closestContents.length && $closestContents.is(":visible") ) {
				$this.closest(".contents").addClass("clear");
				$footer.css({ 'top': '0' });
				return;
			}
        });

        $btnWrap.each( function() {
            var $this = $(this);
            var btnWrapHeight = $this.outerHeight();
            var $closestSection = $this.closest(".dx-common-layout.fixedBtn");

            if( $this.is(":visible") ) {
				$closestSection.css({ 'padding-bottom': btnWrapHeight + btnWraMargin });
			}
        });
    }
};


// 페이지 로드 및 크기 변경 감지
$(document).ready(function() {
    floatingButton.init();

    var resizeObserver;
    if( typeof ResizeObserver !== "undefined" ) {
        resizeObserver = new ResizeObserver(function(entries) {
            for ( var i=0; i < entries.length; i++ ) {
                (function() {
                    setTimeout( function() {
                        floatingButton.init();
                    }, 10)
                })();
            }
        }); 
    }

    var containerElement = document.getElementById("container");
    if( containerElement && resizeObserver ) {
        resizeObserver.observe(containerElement);   
    }

	function floatingMutation() {
		var floatingTargetNode = document.getElementById("container");
		if( !floatingTargetNode ) {
			return;
		}
		var floatingConfig = {
			attributes: true,
			childList: true,
			subtree: true
		};

        var callback = function(mutationList, floatingObserver) {
            for ( var i=0; i < mutationList.length; i++ ) {
                var mutation = mutationList[i];
                if( mutation.type == "childList" ) {
					floatingButton.init();
				}
            }
		}
		var floatingObserver = new MutationObserver(callback);
		floatingObserver.observe(floatingTargetNode, floatingConfig);
	}
	floatingMutation();

});



// 모바일 브라우저 100vh 정의
function setViewportHeight(){
    var vh = $(window).height() * 0.01;
    $(':root').css('--vh', vh + 'px');
}
setViewportHeight();
$(window).on('resize', setViewportHeight);



// 인증계좌선택팝업 내 툴팁 위치값 대응
$(function(){
    function popTooltip(){
        setTimeout(function(){
            $('#__flying_partition__').on('click', '.authAccount_pop .btn-tooltip-dx', function(){
                var $btn = $(this);
                var $target = $('#authAccount'); // 인증계좌 툴팁
    
                var resizePos = function(){
                    var popPosLeft = $('#fnLayerBank .popup').offset().left;
                    var posLeft = $btn.offset().left;
                    var posLeft = posLeft - popPosLeft - 24;
                    var $targetWidthHalf = $target.width() / 2;
                    var $btnwidthHaft = $btn.width() / 2;
            
                    if(posLeft < $targetWidthHalf) { // 말풍선 꼬리 좌측인 경우
                        $target.prop('style').removeProperty('right');
                        $target.removeClass('right');
                        $target.addClass('left');
                        var posLeft = posLeft + $btnwidthHaft;
                        var posTop = 0 - $target.height() - 10;
                        $target.css({top: posTop, left: posLeft}, 0);
                    }
                }
            
                $(window).on('resize', function(){
                    setTimeout(function(){
                        resizePos();
                    }, 500)
                });
            
                resizePos();
            });
        }, 500)
    }
    popTooltip();
});

//이벤트 파라미터가 로그인후 없어져서 sessionStorage로 저장해서 사용
function setEventSS(a, b){ sessionStorage.setItem(a, b); }
function getEventSS(a){ return sessionStorage.getItem(a); }
function delEventSS(a){ sessionStorage.removeItem(a); }
            
// sessionStorage를 이용한 버튼 파라미터 값 설정
function dxSetSS(btn,param,paraVal){  
    $(btn).each(function(){
        var linkUrl=$(this).length>0?$(this).attr('href'):'noBtn';
        paraVal=(paraVal==null)?'':paraVal;
        if(linkUrl.indexOf(param)>-1){
            linkUrlIdx=linkUrl.indexOf(param);
            linkUrlKey=linkUrl.substring(linkUrlIdx,9999);
            linkUrlEnd=linkUrlKey.indexOf('&')>-1?linkUrlKey.indexOf('&'):9999;
            linkUrlKey=linkUrlKey.substring(0,linkUrlEnd);
            linkUrl=linkUrl.replace(linkUrlKey,param+'='+paraVal);
        }else{
            var chain= (linkUrl.indexOf('?')>-1)?'&':'?'
            linkUrl=linkUrl+chain+param+'='+paraVal;
        }
        $(this).attr('href',linkUrl);
    });                
}


function cardServiceAnimation() {
	// MOBFM608C01.html 단기카드대출 이용안내 로띠 영역
	if ( $('.dx_loan_progress').length > 0 ) {
		
		function getLottieAni01(){
			if($(window).width() > 500){
				return '/pconts/images/dx/contents/limit_graph_PC_2.json'
			}else{
				return '/pconts/images/dx/contents/limit_graph_Mo_2.json'
			}
		}
		function getLottieAni02(){
			if($(window).width() > 500){
				return '/pconts/images/dx/contents/limit_graph_PC_loop_2.json'
			}else{
				return '/pconts/images/dx/contents/limit_graph_Mo_loop_2.json'
			}
		}

		var lottie_1 = bodymovin.loadAnimation({
			container: document.querySelector('#lottie_1'),
			path: getLottieAni01(), //string
			renderer: 'svg',
			loop: false, //bool
			autoplay: false, //bool
		});

		var lottie_2 = bodymovin.loadAnimation({
			container: document.querySelector('#lottie_2'),
			path: getLottieAni02(), //string
			renderer: 'svg',
			loop: true, //bool
			autoplay: false, //bool
		});
		$('#lottie_2').hide();
		

		var observer = new IntersectionObserver(function (entries) {
			entries.forEach(function (entry) {
				if (entry.isIntersecting) {
					lottieControl()
				} else {
					lottie_1.stop();
					lottie_2.stop();
					$('#lottie_2').hide();
				}
			})
		});
		function lottieControl() {
			lottie_1.play();
			$('#lottie_1').show();
			lottie_1.addEventListener('complete', function () {
				lottie_1.stop();
				$('#lottie_1').hide();
				lottie_2.play();
				$('#lottie_2').show();
			})
		}
		observer.observe(document.querySelector('.lottie_wrap'))
	}

}


// 단기대출 로띠 영역 체크
function cashserviceInit() {
    if ( !$('div[data-bind-view="MOBFM608C01"]').length > 0 ) {
        return;
    }

    var cashserviceLottieTargetNode = document.querySelector("#cpDiv");
    var cashserviceLottieConfig = {
        attributes: true,
        attributeFilter: ['style']
    };

    var cashserviceLottieCallback = function(mutationList, cashserviceLottieObserver) {
        for ( var i=0; i < mutationList.length; i++ ) {
            var mutation = mutationList[i];
            if( mutation.type == "attributes" && mutation.attributeName == "style" ) {
                var cpDivDisplay = window.getComputedStyle(cashserviceLottieTargetNode).display;
                if( cpDivDisplay == "block" ) {
                    $.getScript("/pconts/js/lottie.js")
                    .done(function (script, txtStatus) {
                        cardServiceAnimation(); // 로띠 호출
                    })
                    .fail(function (jqxhr, settings, exception) {
                        console.log('lottieJS LOAD FAIL')
                    });

                }
            }
        }
    }
    var cashserviceLottieObserver = new MutationObserver(cashserviceLottieCallback);
    cashserviceLottieObserver.observe(cashserviceLottieTargetNode, cashserviceLottieConfig);

    // 뒤로가기 체크
    var cardService608C01TargetNode = document.querySelector('div[data-bind-view="MOBFM608C01"]');
    var cardService608C01Config = {
        attributes: true,
        attributeFilter: ['style']
    };
    var cardService608C01Callback = function(mutationList, cardService608C01Observer) {
        for ( var i=0; i < mutationList.length; i++ ) {
            var mutation = mutationList[i];
            if( mutation.type == "attributes" && mutation.attributeName == "style" ) {
                var cardService608C01Display = window.getComputedStyle(cardService608C01TargetNode).display;

                if( cardService608C01Display == "block" ) {
                    if( $("#cpDiv").is(":visible") ) {
                        $("#cpDiv").find("svg").remove();
                        $.getScript("/pconts/js/lottie.js")
                        .done(function (script, txtStatus) {
                            setTimeout( function() {
                                cardServiceAnimation();
                            }, 10);
                        })
                        .fail(function (jqxhr, settings, exception) {
                            console.log('lottieJS LOAD FAIL')
                        });
                    }
                }
            }
        }
    }
    var cardService608C01Observer = new MutationObserver(cardService608C01Callback);
    cardService608C01Observer.observe(cardService608C01TargetNode, cardService608C01Config);
}

$(document).ready(function() {
	cashserviceInit();
});


/* 20240820379648 */
function scrollMoveFnc() {                                      
    // 1. 버튼 선택 시 selected 클래스 추가(선택된 버튼의 디자인 변경)
    // 2. 선택되지 않은 버튼은 selected 클래스 제거
    // 3. 스크롤 이동

    document.querySelectorAll('[data-scroll-btn]').forEach(function(item) {
        item.addEventListener('click', function() {
            var scrollBtn = this.dataset.scrollBtn;
            var scrollTarget = this.dataset.scrollTarget;
            var scrollGap = this.dataset.scrollGap === undefined ? 0 : this.dataset.scrollGap; // 스크롤 이동 시 필요한 추가 높이 값
            //클릭 시 모든 버튼에서 'selected' class 제거
            document.querySelectorAll('[data-scroll-btn="' + scrollBtn + '"]').forEach(function(el) {
                el.classList.remove('selected');
                el.setAttribute('aria-selected', false);
            })



            // 클릭 한 현재 버튼에 'selected' class 추가
            this.classList.add('selected');
            this.setAttribute('aria-selected', true);
                                        
            var scrollMoveArea = document.getElementById(scrollTarget);// 클릭한 후 스크롤 이동할 대상 요소 선택


            //'scrollMoveArea.getBoundingClientRect().top' 현재 뷰포트에서 요소의 상대적인 위치(화면 상단과의 거리)
            //'window.pageYOffset' 전체 페이지에서 현재 스크롤된 위치
            //'offsetHeight' 페이지 상단에 고정된 헤더의 높이
            //scrollGap 그 외 여유공간
            var contentsTop = scrollMoveArea.getBoundingClientRect().top + window.pageYOffset - document.getElementById('header').offsetHeight - scrollGap;
            scrollMoveArea.setAttribute('tabindex', 0); //포커스 위한 tabindex 설명
            scrollMoveArea.focus();//포커스를 콘텐츠로 이동
            window.scrollTo({
                top: contentsTop, // 계산된 위치로 스크롤 이동
                behavior:'smooth' // 부드러운 효과
            })
        })
    })
}
            
// scrollMoveFnc(); 
document.addEventListener('DOMContentLoaded', function() {
    scrollMoveFnc(); //  data-scroll-btn="spyScroll" data-scroll-target="scrollMoveArea"  클릭할 요소에 필수
})



$(document).on('click', '.listPlus_toggleButton', function(){ 
    $('.hidden_listitem').toggleClass('show');
    $(this).toggleClass('active');

    if ($(this).attr('aria-expanded') ==='true'){
        $(this).attr('aria-expanded','false');
    }else{
        $(this).attr('aria-expanded','true');
    }
});


function initScrollGradient(scrollSelector, topSelector) {
    var scrollElement = $(scrollSelector);
    var topElement = $(topSelector);
    $(scrollElement).on("scroll", function() {
        var scrollTop = Math.floor( $(scrollElement).scrollTop() );
        if( scrollTop > 0 ) {
            $(topElement).addClass("gradient");
        } else {
            $(topElement).removeClass("gradient");
        }
    });
}

function handleSelectAptClick() {
    if( $("#pop_address").length > 0 ) {
        initScrollGradient(".pop-dx.address_pop .pop_cont", ".pop-dx.address_pop .boxing-form-list");
    }
}

function handleSelectHoClick() {
    if( $("#pop_aptlist2").length > 0 ) {
        initScrollGradient(".pop-dx.pop-search .scroll-gradient", ".pop-dx.pop-search .pop-search-top");
    }
}

$(document).ready(function() {
	// 아파트관리비 호 선택 팝업
	$(".boxing-form-cont #selectedHo").click( function() {
		setTimeout(handleSelectHoClick, 300);
	});

	// 아파트관리비 주소검색 팝업
	$(".box-select-pop-wrap .box-select-pop.inputbox").click( function() {
		setTimeout(handleSelectAptClick, 300);
	});
});

function authkeypadCheck() {
    if( $(window).width() < 1101 ) {
        return;
    }
    $(document).on('focusout', '.dx-authbox-wrap.card .inca_keypad', function(e) {
        var contaienr = $(e.currentTarget).closest("#container");
        if ( $('.nppfs-keypad').is(':visible') && !$(this).closest("section.dx-common-layout").hasClass("fixedBtn") ) {
            if( !$(contaienr).hasClass("bottomCheck") ) {
                $(contaienr).addClass("bottomCheck")
            }
        }
    });
    $(document).on('click focusin', function(e) {
        if ( $('.nppfs-keypad').has(e.target).length === 0 && $(e.target).hasClass('inca_keypad') == false && $('.nppfs-keypad').is(':visible') == false ) {
            if( $("#container").hasClass("bottomCheck") ) {
                $("#container").removeClass("bottomCheck");
            }
        }
    });
}
authkeypadCheck();

// 멀티게이지
function setMultiGauge(containerId) {
	var container = document.getElementById(containerId);
	var values = container.dataset.multiGaugeValues.split(',').map(Number);
	var gagueTitle = container.dataset.multiGaugeTitle;
	var track = container.querySelector('.gauge-track');
	var steps = Array.from(container.querySelectorAll('.gauge-steps button'));
	var selectedRange = container.querySelector('.gauge-selected-range');
	var startIndicator = container.querySelector('.start-indicator');
	var endIndicator = container.querySelector('.end-indicator');
	var gaugeStepsTexts = container.querySelectorAll('.gauge-steps-text');
	var startValueInput = container.querySelector('.gauge-start-value');
	var endValueInput = container.querySelector('.gauge-end-value');
	var stepCount = values.length - 1;
	var trackWidth = track.offsetWidth;
	var stepWidth = trackWidth / stepCount;
	var startValue = parseInt(startValueInput.value) ?? values[0];
	var endValue = parseInt(endValueInput.value) ?? values[stepCount];
	var startStep = values.indexOf(startValue);
	var endStep = values.indexOf(endValue);

	steps.forEach(function(step, index) {
		if (values[index] !== undefined) {
			step.dataset.value = values[index];
		}
	});

	function updateSelectedRange() {
		var startPos = startStep * stepWidth;
		var endPos = endStep * stepWidth;
		selectedRange.style.left = startPos + 'px';
		selectedRange.style.width = endPos - startPos + 'px';
		startValueInput.value = steps[startStep].dataset.value;
		endValueInput.value = steps[endStep].dataset.value;
		updateAriaAttributes();
	}

	function updateAriaAttributes() {
		setAriaAttributes(startIndicator, true);
		setAriaAttributes(endIndicator, false);
	}

	function setAriaAttributes(indicator, isStart) {
		indicator.setAttribute('role', 'slider');
		indicator.setAttribute('aria-valuemin', isStart ? values[0] : values[startStep]);
		indicator.setAttribute('aria-valuemax', isStart ? values[endStep] : values[stepCount]);
		indicator.setAttribute('aria-valuenow', isStart ? startValue : endValue);
		if (/Android/i.test(navigator.userAgent)) {
			indicator.setAttribute('aria-hidden', 'true');
		}
	}

	function updateIndicator(indicator, step, isStart) {
		var newPosition = step * stepWidth;
		var indicatorOffset = indicator.offsetWidth / 2;
		if (isStart) {
			newPosition -= indicatorOffset;
		} else {
			newPosition -= indicatorOffset;
		}
		indicator.style.left = newPosition + 'px';
		var value = values[step];
		if (isStart) startValue = value;
		else endValue = value;
	}

	function handleTrackClick(e) {
		var trackRect = track.getBoundingClientRect();
		var clickPosition = e.clientX - trackRect.left;
		var clickedStep = Math.round(clickPosition / stepWidth);

		if (Math.abs(clickedStep - startStep) < Math.abs(clickedStep - endStep)) {
			startStep = Math.min(clickedStep, endStep);
			updateIndicator(startIndicator, startStep, true);
		} else {
			endStep = Math.max(clickedStep, startStep);
			updateIndicator(endIndicator, endStep, false);
		}
		updateSelectedRange();
	}

	function handleDrag(indicator, isStart) {
		var isDragging = false;

		function onMouseDown(e) {
			isDragging = true;
			indicator.style.cursor = 'grabbing';
			e.preventDefault();
		}

		function onMouseMove(e) {
			if (!isDragging) return;

			var clientX = e.clientX || (e.touches && e.touches[0]?.clientX);
			var trackRect = track.getBoundingClientRect();
			var newStep = Math.round((clientX - trackRect.left) / stepWidth);

			if (isStart) {
				startStep = Math.max(0, Math.min(newStep, endStep));
			} else {
				endStep = Math.max(startStep, Math.min(newStep, stepCount));
			}

			updateIndicator(indicator, isStart ? startStep : endStep, isStart);
			updateSelectedRange();
		}

		function onMouseUp() {
			isDragging = false;
			indicator.style.cursor = 'grab';
		}
		indicator.addEventListener('mousedown', onMouseDown);
		document.addEventListener('mousemove', onMouseMove);
		document.addEventListener('mouseup', onMouseUp);

		indicator.addEventListener('touchstart', onMouseDown);
		document.addEventListener('touchmove', onMouseMove);
		document.addEventListener('touchend', onMouseUp);
	}

	function handleKeyboard(indicator, isStart) {
		indicator.addEventListener('keydown', function(e) {
			if (e.key === 'ArrowRight') {
				if (isStart) startStep = Math.min(startStep + 1, endStep);
				else endStep = Math.min(endStep + 1, stepCount);
			} else if (e.key === 'ArrowLeft') {
				if (isStart) startStep = Math.max(startStep - 1, 0);
				else endStep = Math.max(endStep - 1, startStep);
			}

			updateIndicator(indicator, isStart ? startStep : endStep, isStart);
			updateSelectedRange();

			gaugeStepsTexts.forEach(function (span) {
				span.innerHTML = '';
			});
		});
	}

	function updateStepText(stepElement, startStep, endStep, steps, isStart) {
		var span = stepElement.querySelector('.gauge-steps-text');
		span.innerHTML = '';

		var stepText = stepElement.textContent.trim();
		var textContent = '';

		if (isStart) {
			if(startStep === endStep) {
				textContent = gagueTitle + ' ' + stepText + ' 선택됨';
			} else {
				textContent = gagueTitle + ' ' + stepText + '에서 ' + steps[endStep].textContent.trim() + ' 선택됨';
			}
		} else {
			if(startStep === endStep) {
				textContent = gagueTitle + ' ' + steps[startStep].textContent.trim() + ' 선택됨';
			} else {
				textContent = gagueTitle + ' ' + steps[startStep].textContent.trim() + '에서 ' + stepText + ' 선택됨';
			}
		}

		span.innerHTML = textContent;
	}

	steps.forEach(function (step, index) {
		step.addEventListener("click", function () {
			var clickedValue = values[index];
			var distanceToStart = Math.abs(clickedValue - startValue);
			var distanceToEnd = Math.abs(clickedValue - endValue);

			var parent = this.parentNode;
			var siblings = Array.from(parent.children);
			var otherSiblings = siblings.filter(function(sibling) {
				return sibling !== this;
			});

			otherSiblings.forEach(function (otherSibling) {
				otherSibling.querySelector('.gauge-steps-text').textContent = '';
			});

			function moveIndicator(isStart, stepIndex, value) {
				if (isStart) {
					startStep = stepIndex;
					startValue = value;
					updateIndicator(startIndicator, startStep, true);
				} else {
					endStep = stepIndex;
					endValue = value;
					updateIndicator(endIndicator, endStep, false);
				}
			}

			if (index === startStep) {
				moveIndicator(false, index, clickedValue);
				updateStepText(this, startStep, endStep, steps, false);
			} else if (index === endStep) {
				moveIndicator(true, index, clickedValue);
				updateStepText(this, startStep, endStep, steps, true);
			} else {
				if (distanceToStart < distanceToEnd || (distanceToStart === distanceToEnd)) {
					if (index < endStep) {
						moveIndicator(true, index, clickedValue);
						updateStepText(this, startStep, endStep, steps, true);
					} else {
						moveIndicator(false, index, clickedValue);
						updateStepText(this, startStep, endStep, steps, false);
					}
				} else {
					moveIndicator(false, index, clickedValue);
					updateStepText(this, startStep, endStep, steps, false);
				}
			}

			updateSelectedRange();
		});
	});

	handleDrag(startIndicator, true);
	handleDrag(endIndicator, false);
	handleKeyboard(startIndicator, true);
	handleKeyboard(endIndicator, false);

	function updateAllPositions() {
		trackWidth = track.offsetWidth;
		stepWidth = trackWidth / stepCount;

		updateIndicator(startIndicator, startStep, true);
		updateIndicator(endIndicator, endStep, false);
		updateSelectedRange();
	}

	window.addEventListener('resize', updateAllPositions);

	updateIndicator(startIndicator, startStep, true);
	updateIndicator(endIndicator, endStep, false);
	updateSelectedRange();
}

// 가맹점 정보
$(document).on("click", ".pop-usagelog .accordion-dx.storehisory .toggle_btn", function() {
    $usage_popcont = $(this).closest(".pop_cont");
    $usage_popheader = $(this).closest(".pop_cont").prev();
    $usage_popheaderHeight = Math.floor($usage_popheader.outerHeight());
    $usage_buttonOffsetTop = Math.floor($(this).offset().top);

    $accordianTotalsum = $(".accordion-dx.accordion_wrap.totalsum");
    $accordianTotalsumBody = $accordianTotalsum.find(".accordion_body");

    setTimeout( function() {
        if( $accordianTotalsumBody.is(":visible") ) {
            $usage_buttonOffsetTop += $usage_popheaderHeight;
        } else {
            $usage_buttonOffsetTop -= $usage_popheaderHeight;
        }
        $usage_popcont.animate({ 'scrollTop': $usage_buttonOffsetTop }, 0);
    }, 1);
});

// 결제계좌변경
document.addEventListener('DOMContentLoaded', () => {
    const imprReQuest = document.querySelector('.impr-paymentAccount .re-quest');
    // ARS 요청 - 이벤트 위임
    document.body.addEventListener('click', (e) => {
        const imprARSTab = e.target.closest('#tab01_impr-ARS');
        const imprJointTab = e.target.closest('#tab01_impr-joint');

        if(imprARSTab && imprReQuest){
            imprReQuest.style.display = 'flex';  
        }

        if(imprJointTab && imprReQuest){
            imprReQuest.style.display = 'none';
        }
    });

    const imprPayAccountObserver = new MutationObserver(() => {
        const imprARSTabEle = document.getElementById('tab01_impr-ARS');
        if(imprARSTabEle && imprReQuest){
            if(imprARSTabEle.classList.contains('current')){
                imprReQuest.style.display = 'flex';
            }else{
                imprReQuest.style.display = 'none';
            }
        }
    });

    const imprTargetNode = document.querySelector('.impr-paymentAccount');
    if(imprTargetNode){
        imprPayAccountObserver.observe(imprTargetNode, {attributes:true, subtree:true, attributeFilter:['class']});
    }

    document.body.addEventListener('click', function(e){
        const imprArrowBtn = e.target.closest('.arrow-btn');
        if(!imprArrowBtn) return;
        const imprBankWrap = imprArrowBtn.closest('.bank-wrap');
        if(!imprBankWrap) return;

        const imprBankBtn = imprBankWrap.querySelector('.bank-btn');
        const imprInfoDiv = imprBankWrap.querySelector('.info');

        if(imprBankBtn){
            const isHidden = imprBankBtn.style.display === 'none' || imprBankBtn.style.display === '';
            imprBankBtn.style.display = isHidden ? 'block' : "none";
            imprArrowBtn.style.display = isHidden ? 'none' : 'block';
            imprInfoDiv.style.display = isHidden ? 'block' : 'none';
            imprBankWrap.classList.toggle('active', isHidden);

            //접근성
            imprArrowBtn.setAttribute('aria-expanded', String(isHidden));
        }
    });
});

// 명세서 수령방법 토글
document.addEventListener('DOMContentLoaded', function () {
    const updateToggleText = (titleElement, fromText, toText) => {
        const textNodes = Array.from(titleElement.childNodes).filter(
            (node) => node.nodeType === node.TEXT_NODE
        );
        textNodes.forEach((node) => {
            if (node.textContent.includes(fromText)) {
                node.textContent = node.textContent.replace(fromText, toText);
            }
        });
    }

    document.addEventListener("change", function (event) {
        if (!event.target.matches(".impr-statement .set_AutoComplete")) return;
        const checkbox = event.target;
        const titleElement = checkbox.closest('.toggle_wrap')?.querySelector(".title");
        if (!titleElement) return;
        const [fromText, toText] = checkbox.checked ? ["SOL페이 앱으로 받기", "SOL페이 앱으로 받는 중"] : ["SOL페이 앱으로 받는 중", "SOL페이 앱으로 받기"];
        updateToggleText(titleElement, fromText, toText);
    });

    const initCheckToggles = () => {
        const checkToggles = document.querySelectorAll(".impr-statement .set_AutoComplete:checked");

        if(checkToggles.length === 0) {
            return false;
        }

        checkToggles.forEach((checkbox) => {
            const titleElement = checkbox.closest(".toggle_wrap")?.querySelector(".title");
            if (titleElement) {
                updateToggleText(titleElement, "SOL페이 앱으로 받기", "SOL페이 앱으로 받는 중");
            }
        });

        return true;
    }

    const tryInit = () => {
        if (!initCheckToggles()) {
            requestAnimationFrame(tryInit);
        } 
    }

    tryInit ();
});

	// 20250708 민생회복 소비쿠폰 focus 추천검색어 클릭시 클리어 버튼 생성 
    $(document).on('click', '.impr-subsidy .place-rec-wrap .rec-list .btn-rec', function() {
        $('.btn_clear').removeClass('hide');
    });
	// 20250708 민생회복 소비쿠폰 focus 추천검색어 클릭시 클리어 버튼 생성 

function imprAdjustMapWrapClass(){
  const $imprTabWrap = $('.tab_wrap').filter(function(){
    return $(this).find('.tab_type01.swiper_tab').length > 0 && $(this).closest('.place-rec-wrap').length === 0;
    });
    const $imprMapWrap = $('.impr-map-wrap, .impr-map-wrap .map_view');

    const isAllHidden = !$imprTabWrap.length || $imprTabWrap.filter(':visible').length === 0;
    
    if(isAllHidden){
      $imprMapWrap.addClass('impr-filterTab');
    }else{
      $imprMapWrap.removeClass('impr-filterTab');
    }
}

function imprNextBtn() {
 	const target = $('#nextBtn');
	if(target.length > 0) {
		const isDisabled = target.prop('disabled');

		if(!isDisabled) {
			target.focus();
		}
	}
}

$(function(){
  setTimeout(imprAdjustMapWrapClass, 100);
//  setTimeout(imprNextBtn, 100);
  const imprObserver = new MutationObserver(() => {
    imprAdjustMapWrapClass();
//	imprNextBtn();
  });
  imprObserver.observe(document.body, {
    attributes:true,
    childList:true,
    subtree:true,
    attributeFilter:['style', 'class']
  })
})


// 250424 분할납부 예상수수료 팝업
$(document).on("click", "#popPaymentPee .impr-select-label", function () {
const $popup = $("#popPaymentPee");
const $selectBtn = $(this);
const $optionsBox = $popup.find(".impr-select-option-wrap");
const $popCont = $popup.find(".pop_cont");

const isOpen = $selectBtn.hasClass("is-open");

$selectBtn.attr("aria-expanded", !isOpen);
$selectBtn.toggleClass("is-open");
$optionsBox.toggleClass("is-open");

if (!isOpen) {
    $optionsBox.css("display", "block");
    $popCont.addClass("none-overflow");
    const $activeOption = $optionsBox.find(".btn-group4-item.active .btn-group4-btn");
    if ($activeOption.length) {
        setTimeout(() => {
            $activeOption.focus();
        }, 0);
    }
} else {
    $optionsBox.css("display", "none");
    $popCont.removeClass("none-overflow");
}
});
// 250424 분할납부 옵션 클릭 시 팝업 레이어 닫고 overflow 해제
$(document).on("click", "#popPaymentPee .btn-group4-btn", function () {
    const $popup = $("#popPaymentPee");
    const $selectBtn = $popup.find(".impr-select-label");
    const $optionsBox = $popup.find(".impr-select-option-wrap");
    const $popCont = $popup.find(".pop_cont");

    $selectBtn.removeClass("is-open").attr("aria-expanded", false);
    $optionsBox.removeClass("is-open").css("display", "none");
    $popCont.removeClass("none-overflow");
});

  //=================================================================
  // 접근성 : 탭 규칙 data-tabRole 사용
  //=================================================================

$(document).on('click', '.impr-paymentAccount-wrap [role="tab"], [data-tabRole="impr-customTab"] [role="tab"]', function(e) {
    e.preventDefault();
    activateTab($(this));
});

$(document).on('keydown', '.impr-paymentAccount-wrap [role="tab"], [data-tabRole="impr-customTab"] [role="tab"]', function(e) {
  if (e.key === ' ') {
    e.preventDefault();
    activateTab($(this));
  }
});

function activateTab($tab) {
  const targetId = $tab.attr('aria-controls');
  const $tabpanel = $('#' + targetId);

  const $tabList = $tab.closest('[role="tablist"]');
  const $tabItems = $tabList.find('[role="tab"]');
  const $panelWrap = $tabList.closest('.impr-paymentAccount-wrap, [data-tabRole="impr-customTab"]').find('.tab_wrap');
  const fixedBottomBtnWrap = document.querySelector('.impr-paymentAccount-wrap .btn_wrap.m_fixed'); // 하단 고정 버튼 영역

  $tabItems.attr('aria-selected', 'false').parent().removeClass('current');
  $tab.attr('aria-selected', 'true').parent().addClass('current');

  // start: 20250801471295 사설인증서 탭 선택 시에만 하단 버튼 히든
  if (targetId === "section01_private" && fixedBottomBtnWrap) {
    fixedBottomBtnWrap.style.setProperty("display", "none");
  } else if (targetId !== "section01_private" && fixedBottomBtnWrap) {
    fixedBottomBtnWrap.style.setProperty("display", "block");
  }
  // end: 20250801471295 사설인증서 탭 선택 시에만 하단 버튼 히든   

//  $panelWrap.find('[role="tabpanel"]').removeClass('current').hide();
    const panelSelector = $tabItems.map(function() {
		const id = $(this).attr('aria-controls');
		return id ? '#' + id : null;
  	}).get().filter(Boolean).join(',');
	if (panelSelector) $(panelSelector).removeClass('current').hide();

  $tabpanel.addClass('current').show();

  const $firstButton = $tabpanel.find('button, a').first();
  $(document).one('keydown.moveToPanel', function(e) {
    if(e.key === 'Tab' && !e.shiftKey && $firstButton.length) {
	  e.preventDefault();
      $firstButton.focus();
    }
  });
}

/********** 메리어트 & 싱가포르 / 내카드 실적혜택 공통 **********/

function runProgress($container) {
// 아코디언 닫혀있으면 skip
const $accordionBody = $container.closest(".accordion_body");
if ($accordionBody.length && !$accordionBody.is(":visible")) return;

// 요소 캐싱
const $bar = $container.find(".progress-bar");
const targetAmount = parseFloat($bar.data("target-amount"));
const currentAmount = parseFloat($bar.data("current-amount"));
const $fill = $container.find(".progress-fill");
const $amountLabel = $container.find(".progress-amount");
const $steps = $container.find(".step");

$amountLabel.hide();

const stepAmounts = $steps.map(function () {
return parseFloat($(this).data("amount"));
}).get();

const barWidth = $bar.width();
const stepWidth = $(".step").width();
const gap = (barWidth - stepWidth * stepAmounts.length) / (stepAmounts.length - 1);

// step 중심 좌표 계산
const stepCentersPx = stepAmounts.map((_, i) => i * (gap + stepWidth) + stepWidth / 2);
const stepCentersPercent = stepCentersPx.map(x => (x / barWidth) * 100);

// 진행 퍼센트 계산
let progressPercent = 0;
for (let i = 1; i < stepAmounts.length; i++) {
const prevAmt = stepAmounts[i - 1];
const nextAmt = stepAmounts[i];
const prevPercent = stepCentersPercent[i - 1];
const nextPercent = stepCentersPercent[i];

if (currentAmount >= prevAmt && currentAmount <= nextAmt) {
  const ratio = (currentAmount - prevAmt) / (nextAmt - prevAmt);
  progressPercent = prevPercent + ratio * (nextPercent - prevPercent);
  break;
}
}
if (currentAmount >= targetAmount) progressPercent = 100;

let desiredFillWidthPx = (progressPercent / 100) * barWidth;
desiredFillWidthPx = Math.min(desiredFillWidthPx, barWidth);

// 최소 길이 보정
const minFillPx = 36;
if (currentAmount > 0 && desiredFillWidthPx < minFillPx) {
desiredFillWidthPx = minFillPx;
}

// prev step center + 15 보정
function isEqual(a, b, tolerance = 0.1) {
return Math.abs(a - b) < tolerance;
}

// prev step center + 15 보정
if (currentAmount > 0) {
let prevIndex = 0;

for (let i = 0; i < stepCentersPx.length; i++) {
  if (isEqual(desiredFillWidthPx, stepCentersPx[i])) {
    prevIndex = i;
    break;
  }
  if (desiredFillWidthPx < stepCentersPx[i]) {
    prevIndex = Math.max(i - 1, 0);
    break;
  }
}

if (
  !isEqual(desiredFillWidthPx, stepCentersPx[prevIndex]) &&
  desiredFillWidthPx < (stepCentersPx[prevIndex] || 0) + 15
) {
  desiredFillWidthPx = Math.min(stepCentersPx[prevIndex] + 15, barWidth);
}
}


$amountLabel.css({
display: "block",
position: "absolute",
left: "-9999px",
visibility: "hidden"
});
const currentAmountText = currentAmount.toLocaleString() + "원";
$amountLabel.text(currentAmountText);

// 라벨 제한 위치 계산
const labelWidth = $amountLabel.outerWidth() || 0;
$amountLabel.hide().css({ visibility: "", position: "", left: "" });

const lastIndex = stepCentersPx.length - 1;
const limitPx = Math.max(stepCentersPx[lastIndex] - labelWidth / 2 + stepWidth / 2, 0);

if (progressPercent < 100 && desiredFillWidthPx > limitPx) {
desiredFillWidthPx = limitPx;
}

// step 라벨 텍스트 설정
$steps.each(function (i) {
$(this).find(".amount-label").text(formatKoreanAmount(stepAmounts[i]));
});

// 애니메이션
const rawProgressPercent = progressPercent;
const duration = Math.min(
Math.max((parseInt($container.data("duration"), 10) || 1500) * (currentAmount / targetAmount), 300),
2000
);

let start = null;
requestAnimationFrame(function animateProgress(timestamp) {
if (!start) start = timestamp;
const elapsed = timestamp - start;
const ratio = Math.min(elapsed / duration, 1);
const currentWidthPx = desiredFillWidthPx * ratio;

$fill.css("width", `${currentWidthPx}px`);
$bar.find("#clip-rect").attr("width", `${currentWidthPx}px`);

$amountLabel.css({ visibility: "hidden" });
const labelWidth = $amountLabel.outerWidth() || 0;
// 라벨 위치 설정
const centerPos = currentWidthPx;
const leftEdge = centerPos - labelWidth / 2;
const rightEdge = centerPos + labelWidth / 2;
$amountLabel.hide().css({ visibility: "" });


const isLastStep =
progressPercent >= stepCentersPercent[stepCentersPercent.length - 1];


// 먼저 right over 체크
if (!isLastStep && rightEdge > barWidth) {
  $amountLabel
    .css({
      left: `${barWidth - labelWidth}px`,
      right: "auto",
      transform: "none"
    })
    .removeClass("middle left-end right-end")
    .addClass("right-over-zone");
}
// 왼쪽 끝 처리
else if (currentAmount === 0 || desiredFillWidthPx < minFillPx) {
  $amountLabel
    .css({
      left: 0,
      right: "auto",
      transform: "none"
    })
    .removeClass("middle right-end right-over-zone")
    .addClass("left-end");
}
// 마지막 스텝 처리
else if (isLastStep) {
  $amountLabel
    .css({
      left: "auto",
      right: "0",
      transform: "none"
    })
    .removeClass("middle left-end right-over-zone")
    .addClass("right-end");
}
// 그 외엔 가운데
else {
  $amountLabel
    .css({
      left: `${Math.round(centerPos)}px`,
      right: "auto",
      transform: "translateX(-50%)"
    })
    .removeClass("left-end right-end right-over-zone")
    .addClass("middle");
}

// step 활성화
$steps.each(function (i) {
  if (rawProgressPercent === 0) {
    $(this).removeClass("is-active");
    return;
  }
  const stepPercent = stepCentersPercent[i];
  const stepPixel = (stepPercent / rawProgressPercent) * desiredFillWidthPx;
  $(this).toggleClass("is-active", currentWidthPx >= stepPixel);
});

if (ratio < 1) {
  requestAnimationFrame(animateProgress);
} else {
  if (currentAmount >= targetAmount) {
    $fill.css("width", desiredFillWidthPx + "px");
    $amountLabel.css({ left: "auto", right: "0", transform: "none" });
  }
  $amountLabel.fadeIn();
}
});
}

// 페이지 load 시 실행
$(document).ready(function () {
//  setTimeout(function() {
//  	$('[data-ui="impr-progress"]').each(function () {
//  		runProgress($(this));
//  	});
//  }, 1500);


// 아코디언 클릭시 실행
$(document).on("click", ".accordion_header", function () {
const $this = $(this);
const $section = $this.next(".accordion_body");

const resetProgress = ($container) => {
  const $fill = $container.find(".progress-fill");
  const $amountLabel = $container.find(".progress-amount");
  const $steps = $container.find(".step");

  $fill.css("width", "0");
  $amountLabel.hide();
  $steps.removeClass("is-active");
};

if ($this.hasClass('on')) {
  // 현재 열리는 아코디언의 progress 실행
  $section.find('[data-ui="impr-progress"]').each(function () {
    const $container = $(this);
    setTimeout(() => {
      runProgress($container);
    }, 100);
  });

  // 다른 아코디언들의 progress 초기화
  $(".accordion_body").not($section).find('[data-ui="impr-progress"]').each(function () {
    const $body = $(this);
    const $header = $body.prev(".accordion_header");

    if ($header.hasClass("on")) {
      return;
    }

    $body.find('[data-ui="impr-progress"]').each(function () {
      resetProgress($(this));
    });
  });
} else {
  // 현재 닫히는 아코디언 progress 초기화
  $section.find('[data-ui="impr-progress"]').each(function () {
    resetProgress($(this));
  });
}
});
});

// 금액 단위 포맷 함수
function formatKoreanAmount(amount) {
if (amount >= 100000000) {
return (amount / 100000000).toFixed(1).replace(/\.0$/, "") + "억";
} else if (amount >= 10000000) {
return (amount / 10000000).toFixed(1).replace(/\.0$/, "") + "천";
} else if (amount >= 1000000) {
return (amount / 1000000).toFixed(1).replace(/\.0$/, "") + "백";
} else {
return amount.toLocaleString() + "원";
}
}

$(document).on('click', '[data-ui="impr-exclusive-active"] button, [data-ui="impr-exclusive-active"] a', function() {
const $parent = $(this).closest('[data-ui="impr-exclusive-active"]');
$parent.find('button, a').removeClass('active');
$(this).addClass('active');
});

/********** 메리어트 & 싱가포르 / 내카드 실적혜택 공통 **********/


// STICKY EVENT
function bsStickyFiexedEvt() {
  const headerHeight = $(window).width() < 1100 ? 56 : 130;
    
  setTimeout(function() {
    $('[stickyState]').each(function() {
      const $this = $(this);
      const state = $this.attr('stickyState');
  
      // html내에 true 설정 시 class 추가
      if (state === "true") {
          $this.addClass('sticky');
      } else {
          $this.removeClass('sticky');
      }
  
      if ($this.hasClass('sticky')) {
          
        // stickyState 설정된 노드의 부모 높이값을 강제반영 (fixed 됐을때 그 공간을 유지해야 하므로)
        setTimeout(function() {
            const childHeight = $this.outerHeight();
            $this.parent().height(childHeight);
        }, 500)
  
        
        const offsetTop = $this.offset().top;
  
        $(window).on('scroll', function() {
            const scrollTop = $(window).scrollTop();
  
            // 130은 신한카드 페이지 상단 헤더 높이값
            if (scrollTop > offsetTop - headerHeight) {
                $this.addClass('on');
            } else {
                $this.removeClass('on');
            }      
            
        })
      }
    })
  }, 300) 

  if (deviceInfo.app == "shfanapp") {
    $('.sticky_area').addClass('is-shfanapp')
  }
}


// ANCHOR EVENT
function bsAncEvt() {

// 꼭알아두세요 영역 부모노드 만들기
  $('.con.accordion_wrap.btm_line').attr('id', 'target03')

  const $anchors = $('a[anc-target]');

  const sections = $anchors.map(function() {
      const $link = $(this);
      const selector = $link.attr('anc-target');
      const $section = $(selector).first();

      if($section.length) {
          return { link: $link, section: $section};
      }
      return null;
  }).get().filter(Boolean);

  function getOffsetValue($link) {
      const scrollOffsetRaw = $link.attr('anc-scroll') || '0|0';
      const [pcOffset, moOffset] = scrollOffsetRaw.split('|').map(Number);
      const isMobile = window.innerWidth < 1100;
      return isMobile ? 56 + moOffset : 130 + pcOffset;
  }

  $(document).on('click', 'a[anc-target]', function(e) {
      e.preventDefault();

      const $this = $(this);
      const selector = $this.attr('anc-target');

      if(!selector) return;

      const $target = $(selector);

      if($target.length) {
          const offsetValue = getOffsetValue($this);
          const targetPosition = Math.floor($target.offset().top - offsetValue);

          $('html, body').stop(true).animate({ scrollTop: targetPosition}, 400);
      }
  })

  function updateActiveAnchor() {
      const scrollTop = $(window).scrollTop();

      for(let i = 0; i < sections.length; i++) {
          const $link = sections[i].link;

          if(!sections[i].section.is(':visible')) continue;

          const offset = getOffsetValue($link);
          const top = sections[i].section.offset().top - offset -1;
          const bottom = top + sections[i].section.outerHeight();

          if (scrollTop >= top && scrollTop < bottom) {
              $anchors.removeClass('on');
              $link.addClass('on')
              break;
          } 
      }
  }


  $(window).on('scroll', updateActiveAnchor);
  $(window).trigger('scroll');

}


// 20250609488438 [개발형] 카테고리별 결제 최대 70만원 프로모션 START

function bsDisabledButton() {
  // 아코디언 눌렀을 경우 disabled
  $('.check_btn').on('click', function(e) {
      e.preventDefault();

      $(this).addClass('disabled')
      
      $('.check_info').slideDown(200, function() {
          $(this).css('display', 'flex');
          bsStickyFiexedEvt();
          // 버튼 클릭시 슬라이드 다운되는 영역 높이값 재 측정
      })

  })
}                                                                     
                                                     
// 20250818476647 마이신한포인트 결제 안내 페이지                                   
 $(function(){
    $(".my-point-section .evt-tooltip").on("click", function(){
        $(this).siblings("#evt-tooltip-con").addClass('on')
    });
    $(".my-point-section .evt-tooltip-close").on("click", function(){
        $(this).parents("#evt-tooltip-con").removeClass('on')
    });
});