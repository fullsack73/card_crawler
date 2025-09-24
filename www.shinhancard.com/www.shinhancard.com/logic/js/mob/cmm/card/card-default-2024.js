/**
* @description 카드 공통
* @author 김가영
* @version 1.0
* @since 2019.12
*/

(function(){	
	$svc.debug(true);
	var util = $svc.get('util');
	$svc.service('cardUtil', function() {
		
		// vo
		var cardListVo;			//카드목록 Vo
		var cardCompareVo;	//카드비교함 Vo
		var cardDetailVo;			//카드상세 Vo
		var designCardVo;		//디자인카드 Vo
		
		// 카드비교함 변수
		var cardComparePageIds = [];
		var $areaCardCompare = $('#cardCompare'),
		     $areaCardCompareAfter = $('#cardCompareAfter');
		
		// 찾아드림 변수
		var cardSearchData = {};
		
		// 카드목록
		$svc.plugin('cmmCardList', function($param, $close) {
			//-----------------------------------------------------------
			//view binding variable
			//-----------------------------------------------------------
//			var url = '/mob/cmm/MOBFMCARD/listTypeCardList.ahtml';
//			var url = '/mob/cmm/MOBFMCARD/imageTypeCardList-2024.ahtml';
			
			// type=1 : 목록형, type=2 : 이미지형, type=3 : 추천카드보기(이미지형) , type=4 : 선불카드보기(목록형), type=5 : 패밀리
//			if ($param.type === '1') {
//				url = '/mob/cmm/MOBFMCARD/listTypeCardList.ahtml';
//			} else if ($param.type === '2' || $param.type === '3' || $param.type === '5') {
//				url = '/mob/cmm/MOBFMCARD/imageTypeCardList.ahtml';
//			} else if ($param.type === '4') {
//				url = '/mob/cmm/MOBFMCARD/listTypePrepayCardList.ahtml';
//			}
			
			cardListVo = $svc.bind({name:'cmmCardList', plugin: true});
			var on = cardListVo.event();
			
			//-----------------------------------------------------------
			//local variable
			//-----------------------------------------------------------
			var http = $svc.get('http');
			var compareVl = {};
			var vl = {};
			var lc = {};
			var pageCount = 9;
			vl.isY = 'Y';
			lc.search = {};
			vl.pageIds = [];
			
			//-----------------------------------------------------------
			//view initialize
			//-----------------------------------------------------------
			cardListVo.render(function() {
				$log('cmmCardList init', $param);
				vl.listId = $param.listId;
				
				lc.title = $param.title||'';
				var cardType = $param.cardType||'';
				
				if(cardType == 'all') lc.search.cardType = '';
				else if(cardType == 'credit') lc.search.cardType = '1';
				else if(cardType == 'check') lc.search.cardType = '2';
				else lc.search.cardType = '';
				
				init();
			});
			
			//-----------------------------------------------------------
			//event binding
			//-----------------------------------------------------------
			on.movePage = function(url) {
//				$svc.get('location').go(url);
				location.href = url;
			}
			
			on.addCompare = function (e) {
				var tThis = $(this);
				var pageId = tThis[0].hpgCrdPdId.toString();
				$log('pageId', pageId);
				
				if (!$areaCardCompareAfter.hasClass('compare_gapt')) {
					$areaCardCompareAfter.addClass('compare_gapt');
				}
				
				if (_.indexOf(cardComparePageIds, pageId) > -1) {
					$svc.get('popup').alert('카드비교함에 이미 담겨 있습니다.').then(function () {
						cardListVo.focus(e);
					});
					return;
				}
				if (cardComparePageIds.length === 0) {
					$svc.get('popup').alert('선택한 카드가 카드비교함에 담겼습니다.').then(function () {
						cardComparePageIds.push(pageId);
						setItem();
						compareVl.count = '1';
						compareVl.cardCompareShow = true;
						cardCompareVo.push(compareVl);						
						cardListVo.focus(e);
						//$('.js-cp-open').attr("tabindex", 0).focus();
					});
					return;
				}
				if (cardComparePageIds.length === 1) {
					$svc.get('popup').alert('선택한 카드가 카드비교함에 담겼습니다.').then(function () {
						cardComparePageIds.push(pageId);
						setItem();
						compareVl.count = '2';
						cardCompareVo.push(compareVl);
						$('.js-cp-open').click();
						$('.js-cp-open').attr("tabindex", 0).focus();
					});
					return;
				}
				if (cardComparePageIds.length === 2) {
					loadCardList().then(function() {
						var v = _.find(window.cardList, function(v,i) { return -1 < v['hpgCrdPdId'].indexOf(cardComparePageIds[1]); });
						
						$svc.get('popup').confirm('카드비교함이 꽉 찼습니다. [' + function () { return v && v['hpgCrdPdNm']; }() + ']를(을) 삭제하고 새 카드를 담을까요?').then(function (y) {
							if (y) {
								cardComparePageIds.pop();
								cardComparePageIds.push(pageId);
								setItem();
								$('.js-cp-open').click();
								$('.js-cp-open').attr("tabindex", 0).focus();
							} else {
								cardListVo.focus(e);
							}
						});
						return;
					});
				}
			}
			
			on.showNextPage = function (e){
				var p = vl.page;
				vl.page = p+1;
				if(vl.page < vl.totalPage) vl.hasNextPage = true;
				else vl.hasNextPage = false;
				
				$log('vl : ', vl);
				cardListVo.push(vl);

				cardListVo.$view.find('.card_thumb_list_wrap li[data-page="'+vl.page+'"]').first().find('a').first().focus();
			}
			
			on.showCardSearchPopup = function(e){
				var pm = {};
				pm.focusKeyword = false;
				if($(e.currentTarget).hasClass('btn-searchinput')){
					pm.focusKeyword = true;
				}
				pm.search = lc.search;
				pm.cardList = lc.totalCardList;
				pm.title = lc.title;
				
				$svc.get('popup').open({ name: 'cardSearchPopUp', param: pm }).then(function (rs) {
					if(rs){
						initTotalCardList();
						
						vl.hasSearchResult = true;
						vl.cardList = rs.cardSearchList;
						vl.page = 1;
						vl.totalPage = Math.ceil(vl.cardList.length/pageCount);
						vl.hasNextPage = false;
						if(vl.page < vl.totalPage) vl.hasNextPage = true;
						
						lc.search = rs.search;
						vl.searchCount = vl.cardList.length;
						vl.benefitDetailTitle = lc.search.benefitDetailTitle;
						
						if(util.isEmpty(lc.search.keyword)) vl.searchKeywordHtml = "<span>원하는 카드를 찾아보세요</span>";
						else vl.searchKeywordHtml = "<span class='searchdone'>"+lc.search.keyword+"</span><span class='blind'>검색됨</span>";
						
						vl.benefitDetailCountHtml = "<span></span>";
						vl.hasBenefitDetail = false;
						if(!util.isEmpty(lc.search.benefitDetail)){
							vl.hasBenefitDetail = true;
							vl.benefitDetailCntHtml = "<span>"+lc.search.benefitDetail.split("^").length+"</span><span class='blind'>개의 필터 선택됨</span>";
						}else{
							vl.hasBenefitDetail = false;
							vl.benefitDetailCntHtml = "<span></span>";
						}
						
						vl.searchAnnualHtml = "연회비·<b>전체</b>";			// 연회비 · <b >1~3</b>만원
						if(lc.search.annualFeeMin == '') lc.search.annualFeeMin = '0';
						if(lc.search.annualFeeMax == '') lc.search.annualFeeMax = '55000';
						
						if(lc.search.annualFeeMin == '0' && lc.search.annualFeeMax == '55000'){
							vl.searchAnnualHtml = "연회비·<b>전체</b>";			// 연회비 · <b >1~3</b>만원
						}else if(lc.search.annualFeeMin == '0' && lc.search.annualFeeMax == '0'){
							vl.searchAnnualHtml = "연회비·<b>없음</b>";
						}else if(lc.search.annualFeeMin == '55000' && lc.search.annualFeeMax == '55000'){
							vl.searchAnnualHtml = "연회비·<b>5</b>만원초과";
						}else if(lc.search.annualFeeMin != '0' && lc.search.annualFeeMax == '55000'){
							vl.searchAnnualHtml = "연회비·<b>" + lc.search.annualFeeMin.substring(0,1) + "~5</b>만원초과";
						}else if(lc.search.annualFeeMin == lc.search.annualFeeMax){
							vl.searchAnnualHtml = "연회비·<b>" + lc.search.annualFeeMin.substring(0,1) + "</b>만원";
						}else{
							vl.searchAnnualHtml = "연회비·<b>" + lc.search.annualFeeMin.substring(0,1) + "~" + lc.search.annualFeeMax.substring(0,1) + "</b>만원";			// 연회비 · <b >1~3</b>만원
						}
						
						_.each(vl.cardList,function(v,idx){
							v.page = Math.ceil((idx+1)/pageCount);
							
							v.hpgCrdPdSvTxt = '';
							_.each(v.svcInfo, function(o,i) {
							    v.hpgCrdPdSvTxt += ("<div class='txt1'>" + highlightTxt(o.hpgCrdPdSvTpNm + ' ' + o.hpgCrdPdSvTpTt) + "</div>");
							});
						});
						
						vl.recommCardList = [];
						if(vl.cardList.length == 0){
							var recommCnt = 2;
							if(lc.totalCardList.length < recommCnt) recommCnt = lc.totalCardList.length;
							for(var i=0;i<recommCnt;i++){
								vl.recommCardList.push(lc.totalCardList[i]);
							}
						}
						cardListVo.push(vl);
					}

					cardListVo.focus(e);
				});
			}
			//-----------------------------------------------------------
			//local function
			//-----------------------------------------------------------
			function init() {
				loadPageIdsByListId(vl.listId)
				.then(function(data) {
					vl.pageIds = data;
					return loadTotalCardList();
				})
				.then(function() {
					getCardListHtml(vl.pageIds);
					if ($param.isCardCompare != 'N') {
						$svc.get('plugin').load({name: 'cardCompare', param: $param});
					}
				});
			}

			function highlightTxt(txt){
			    var rtnTxt = '';
			    if(txt == '') return '';
                rtnTxt = txt;

                if(!util.isEmpty(lc.search.keyword)){
                    var keywords = lc.search.keyword.split(" ");
                    var searchWords = [];
                    _.each(keywords, function(kword, j){
                        if(j == 0) searchWords.push(kword);
                        else {
                            if(!_.contains(searchWords,kword)) searchWords.push(kword);
                        }
                    });
                    _.each(searchWords, function(kword, j){
                        rtnTxt = replaceAll(rtnTxt, kword);
                    });
                }

                return rtnTxt;
			}

			function replaceAll(orgTxt, keyword){
				var ltxt = orgTxt.toLowerCase();
				var lkeyword = keyword.toLowerCase();
				var rtnTxt = '';
				
				var spTxt = ltxt.split(lkeyword);
				var len = spTxt.length;
				if(len > 0){
					var si = 0;
					
					for(var i=0;i<len;i++){
						var ssi = si + spTxt[i].length;
						var eei = ssi + lkeyword.length;
						
						var replaceTxt = '';
						if(orgTxt.length > ssi) replaceTxt = orgTxt.substring(ssi, eei);
						if(replaceTxt != '') replaceTxt = '<span class="search_txt">'+replaceTxt+'</span>';
						
						rtnTxt += orgTxt.substring(si, ssi) + replaceTxt;
						
						si = ssi + lkeyword.length;
					}
				}else{
					rtnTxt = orgTxt;
				}
				
				return rtnTxt;
			}
			
			function initTotalCardList(){
				_.each(lc.totalCardList, function(o,i){
					o.hpgCrdPdSvTxt = '';
					_.each(o.svcInfo, function(v,i) {
						o.hpgCrdPdSvTxt += ("<div class='txt1'>" + v.hpgCrdPdSvTpNm + ' ' + v.hpgCrdPdSvTpTt + "</div>");
					});
				});
			}
			
			function getCardListHtml(pageIds) {
				
				vl.cardList = [];
				vl.page = 1;

				var RecommN = getParaVal('RecommN');
				var cnt = 0;
				_.each(pageIds, function(v,idx) {
					var result = _.find(window.cardList, function(d) { return v === d.hpgCrdPdId });
					if (result) {
						cnt++;
						var thumbImgInfo = _.find(result.imgInfo, function(m) { return m.hpgCrdPdImgCcd === '2' });	//썸네일 이미지 여부
						if (thumbImgInfo) {
							// 이미지 세로 여부
							result.imgVertical = (thumbImgInfo.hpgCrdPdImgFrmF === 'Y') ? 'vertical' : '';
							result.imgVerticalType = (thumbImgInfo.hpgCrdPdImgFrmF === 'Y') ? 'vertical_type' : '';
							
							result.imgUrl = thumbImgInfo.hpgCrdPdCrdImgUrlAr;
							result.imgDesc = thumbImgInfo.hpgCrdPdCrdImgRplVl;
							
							// 복수 이미지 여부
							var etcImage = _.find(result.imgInfo, function(d) { return d.hpgCrdPdImgCcd === '3' });
							result.imgMore = (etcImage) ? 'more' : '';
						}
						//태그 여부
						result.isNew = (result.hpgCrdPdLblXrsF === 'Y' && result.hpgCrdPdPfrF === 'Y') ? 'Y' : 'N';
						result.isBest = (result.hpgCrdPdLblXrsF === 'Y' && result.hpgCrdPdBstF === 'Y') ?  'Y' : 'N';
						result.isCashback = (result.hpgCrdPdLblXrsF === 'Y' && result.hpgCrdPdCsbF === 'Y') ? 'Y' : 'N';
						result.isHpgOnly = (result.hpgCrdPdLblXrsF === 'Y' && result.hpgCrdPdOnlExvF === 'Y') ? 'Y' : 'N';
						
						result.noBadge = "N";
						if(result.isNew == 'N' && result.isBest == 'N' && result.isCashback == 'N' && result.isHpgOnly == 'N') result.noBadge = "Y";
						
						if (_.isEmpty(result.cardLink)) {
							result.cardLink = {fllAplUrl: '', smpAplUrl: ''};							
						}
						if (_.isEmpty(result.cardLink.fllAplUrl)) {
							result.hpgCrdPdPcOnlPtSeF = 'N';
							result.cardLink.fllAplUrl = '';
						} else {
							result.cardLink.fllAplUrl = getCardLinkUrlAddParam(result.cardLink.fllAplUrl, 'targetID', vl.listId);
						}
						
						if (_.isEmpty(result.cardLink.smpAplUrl)) {
							result.hpgCrdPdPcSimPtSeF = 'N';
							result.cardLink.smpAplUrl = '';
						} else {
							result.cardLink.smpAplUrl = getCardLinkUrlAddParam(result.cardLink.smpAplUrl, 'targetID', vl.listId);
							result.cardLink.smpAplUrl = getCardLinkUrlAddParam(result.cardLink.smpAplUrl, 'pageId', result.hpgCrdPdId);
						}
						
						if (_.isEmpty(result.hpgCrdPdSmrTt)) {
							result.hpgCrdPdSmrTt = '';
						}

						//as-is type=1 : 목록형, type=2 : 이미지형, type=3 : 추천카드보기(이미지형) , type=4 : 선불카드보기(목록형), type=5 : 패밀리
						// 해당 type 에 따른 파라메터 설정은 추후 필요시 요청하기로함.
//						if( vl.type === '3'){
//							if (deviceInfo.mobile) {	
//								// MOBILE일 경우 
//								var fllRcmUrl = getCardLinkUrlOnly(result.hpgCrdPdUrlAr) + '?' + result.cardLink.fllRcmUrl;
//								result.hpgCrdPdUrlAr = getCardLinkUrlAddParam(fllRcmUrl, 'targetID', vl.listId);
//								result.hpgCrdPdUrlAr = getCardLinkUrlAddParam(fllRcmUrl, 'pageId', result.hpgCrdPdId);
//								result.hpgCrdPdUrlAr = getCardLinkUrlAddParam(fllRcmUrl, 'RecommN', RecommN);
//							}else{
//								// PC일 경우
//								var smpRcmUrl = getCardLinkUrlOnly(result.hpgCrdPdUrlAr) + '?' + result.cardLink.smpRcmUrl;
//								result.hpgCrdPdUrlAr = getCardLinkUrlAddParam(smpRcmUrl, 'targetID', vl.listId);
//								result.hpgCrdPdUrlAr = getCardLinkUrlAddParam(smpRcmUrl, 'pageId', result.hpgCrdPdId);
//								result.hpgCrdPdUrlAr = getCardLinkUrlAddParam(smpRcmUrl, 'RecommN', RecommN);
//							}
//						}else if( vl.type === '5'){		// 패밀리
//							result.hpgCrdPdUrlAr = getCardLinkUrlAddParam(result.hpgCrdPdUrlAr, 'fmyCrdYn', 'Y');							
//							result.hpgCrdPdUrlAr = getCardLinkUrlAddParam(result.hpgCrdPdUrlAr, 'btnApp', '1');							
//						}
						
						// 혜택 목록 여부
						result.svcInfo = (!_.isEmpty(result.svcInfo) && result.svcInfo.length > 3) ? result.svcInfo.slice(0, 3) : result.svcInfo;
						
						result.hpgCrdPdSvTxt = '';
						_.each(result.svcInfo, function(v,i) {
							v.hpgCrdPdSvTcd = (!_.isEmpty(v.hpgCrdPdSvTcd) && v.hpgCrdPdSvTcd.length == 1) ? '0' + v.hpgCrdPdSvTcd : v.hpgCrdPdSvTcd;

							result.hpgCrdPdSvTxt += ("<div class='txt1'>" + v.hpgCrdPdSvTpNm + ' ' + v.hpgCrdPdSvTpTt + "</div>");
						});
						
						result.page = Math.ceil(cnt/pageCount);
						vl.cardList.push(result);
					}
				});								
				
				vl.hasSearchResult = false;
				vl.searchKeywordHtml = "<span>원하는 카드를 찾아보세요</span>";
				vl.benefitDetailCntHtml = "<span></span>";

				vl.totalPage = Math.ceil(vl.cardList.length/pageCount);
				vl.hasNextPage = false;
				if(vl.page < vl.totalPage) vl.hasNextPage = true;
				
				lc.totalCardList = vl.cardList;
				
				$log('vl : ', vl);
				cardListVo.push(vl);

			}			
		});
		
		// 링크 파라미터 연결
		function getCardLinkUrlAddParam(linkUrl, param, paraVal) {
			paraVal = (paraVal == null) ? '' : paraVal;
			
			if(!_.isEmpty(linkUrl)){
				if (linkUrl.indexOf(param)>-1) {
					var linkUrlIdx = linkUrl.indexOf(param);
					var linkUrlKey = linkUrl.substring(linkUrlIdx, 9999);
					var linkUrlEnd = linkUrlKey.indexOf('&') > -1 ? linkUrlKey.indexOf('&') : 9999;
					linkUrl = linkUrl.replace(linkUrlKey, param + '=' + paraVal);
				} else {
					var chain = (linkUrl.indexOf('?') > -1) ? '&' : '?';
					linkUrl = linkUrl + chain + param + '=' + paraVal;
				}
			}
			
			return linkUrl;
		}
		
		// 링크 파라미터 제거
		function getCardLinkUrlOnly(linkUrl){
			if(!_.isEmpty(linkUrl)){
				var linkUrlIdx = linkUrl.indexOf('?');
				if(linkUrlIdx > -1){
					linkUrl = linkUrl.substring(0, linkUrlIdx);
				}
			}
			return linkUrl;
		}
		
		//카드 비교하기
		$svc.plugin('cardCompare', function($param,$close) {
			//-----------------------------------------------------------
			//view binding variable
			//-----------------------------------------------------------
			cardCompareVo = $svc.bind({name:'cardCompare', plugin: true, url: '/mob/cmm/MOBFMCARD/cardCompare.ahtml'});
			var on = cardCompareVo.event();
			
			//-----------------------------------------------------------
			//local variable
			//-----------------------------------------------------------
			var http = $svc.get('http');
			var vl = {};
			var lc = {};
						
			//-----------------------------------------------------------
			//view initialize
			//-----------------------------------------------------------
			cardCompareVo.render(function() {
				$log('cardCompare init', $param);
				init();
			});
			
			//-----------------------------------------------------------
			//event binding
			//-----------------------------------------------------------
			on.cardCompare = function(e) {
				if (vl.btnCompareAttr.disabled) {
					return;
				}
				$log('비교하기');
				$svc.get('popup').open({ name: 'MOBFM038P01', param: { list: cardComparePageIds } }).then(function (rs) {
					cardCompareVo.focus(e);
				});
			}
			
			on.openCardCompare = function(e) {
				if (vl.isOpen != 'Y') {					
					refreshCardList();
					vl.isOpen = 'Y';
					vl.isOpenTxt = '닫기';
				} else {
					vl.isOpen = 'N';
					vl.isOpenTxt = '열기';
				}
				e.target.focus();
				vl.cardCompareShow = true;
				cardCompareVo.push(vl);
			}
			
			on.cardCompareDel = function(e) {
				$log('카드삭제');
				var pageId = $(e.currentTarget).attr('id');
				cardComparePageIds = _.without(cardComparePageIds, pageId);
				if (cardComparePageIds.length === 0) {
					vl.isOpen = 'N';
					vl.isOpenTxt = '열기';
					vl.cardCompareShow = false;
					vl.count = '';
					$areaCardCompareAfter.removeClass('compare_gapt');
				} else if (cardComparePageIds.length === 1) {
					vl.count = '1';
					$('.card_add')[1].focus();
				}
				cardCompareVo.push(vl);
				setItem();
				refreshCardList();
			}
			
			on.addCard = function() {
				vl.isOpen = 'N';
				vl.isOpenTxt = '열기';
				cardCompareVo.push(vl);
				
				setTimeout(function() {
//					if ($('.card_detail').length > 0) {
						var p = location.pathname;
						if (-1 < p.indexOf('/premium/')) {
							location.href = '/pconts/html/card/premium/MOBFM278R01.html';
						} else if (-1 < p.indexOf('/credit/')) {
							location.href = '/pconts/html/card/credit/MOBFM281/MOBFM281R11.html';
						} else if (-1 < p.indexOf('/check/')) {
							location.href = '/pconts/html/card/check/MOBFM282R11.html';
						}
//					}
				}, 100);
			}
			
			//-----------------------------------------------------------
			//local function
			//-----------------------------------------------------------
			function init() {
				lc.cardCompareStorage = localStorage.getItem('cardCompare');
				
				vl.cardCompareShow = false;
				
				if (lc.cardCompareStorage) {
					cardComparePageIds = JSON.parse(lc.cardCompareStorage);
				}
				
				$svc.get('util').loadJS(['/logic/js/mob/mobfm038/MOBFM038P01.js']);
				
				/* 상단 비교함 영역 생성 되는 경우 스크립트에서 compare_gapt 클래스 생성하여 상단 여백 조절 */
				$areaCardCompareAfter.removeClass('compare_gapt');
				
				if (cardComparePageIds.length > 0) {
					$areaCardCompareAfter.addClass('compare_gapt');
					
					if(cardComparePageIds.length === 1) {
						vl.count = '1';
					} else {
						vl.count = '2';
					}
					vl.cardCompareShow = true;
				}
				
				if (cardComparePageIds.length < 2) {
					vl.btnCompare = {disabled: true}
				}

				vl.isOpen = 'N';
				vl.isOpenTxt = '열기';
				cardCompareVo.push(vl);
			}
			
			function refreshCardList() {
				loadCardList().then(function() {
					if (cardComparePageIds.length === 2) {
						vl.btnCompareTxt = '비교하기';
						vl.btnCompareAttr = {disabled : false};
						vl.count = '2';
					} else {
						vl.btnCompareTxt = '비교하기 (1/2)';
						vl.btnCompareAttr = {disabled : true};
						vl.count = '1';
					}
					
					var o1 = _.find(window.cardList, function(v,i) { return (v['hpgCrdPdId'].indexOf(cardComparePageIds[0]) == 0) });
					var o2 = _.find(window.cardList, function(v,i) { return (v['hpgCrdPdId'].indexOf(cardComparePageIds[1]) == 0) });
					if (o1) {
						o1.existYn = 'Y';						
						o1.delBtnAttr = {title: o1.hpgCrdPdNm + ' 삭제', id:o1.hpgCrdPdId};
						o1.cardDetailAttr = {href: o1.hpgCrdPdUrlAr};
						o1.imgAttr = {src: o1.imgInfo[0].hpgCrdPdCrdImgUrlAr, alt: o1.imgInfo[0].hpgCrdPdCrdImgRplVl, verticalYn: o1.imgInfo[0].hpgCrdPdImgFrmF};						
					} else {
						o1 = {existYn : 'N'};
					}
					
					if (o2) {
						o2.existYn = 'Y';						
						o2.delBtnAttr = {title: o2.hpgCrdPdNm + ' 삭제', id:o2.hpgCrdPdId};
						o2.cardDetailAttr = {href: o2.hpgCrdPdUrlAr};
						o2.imgAttr = {src: o2.imgInfo[0].hpgCrdPdCrdImgUrlAr, alt: o2.imgInfo[0].hpgCrdPdCrdImgRplVl, verticalYn: o2.imgInfo[0].hpgCrdPdImgFrmF};
					} else {
						o2 = {existYn : 'N'};
					}
					
					vl.o1 = o1;
					vl.o2 = o2;
					
					cardCompareVo.push(vl);
					
					if (cardComparePageIds.length === 1) {
						// 웹 접근성 포커스 이동
						$('.card_add')[1].focus();
					}
				})
			}			
			
		});
		
		// 카드상세 결제은행 팝업
		$svc.popup('paymentBankPopup', function($param, $close) {
			//-----------------------------------------------------------
			//view binding variable
			//-----------------------------------------------------------
		    var paymentBankVo = $svc.bind({name:'paymentBankPopup', url: '/mob/cmm/MOBFMCARD/paymentBankPopup.ahtml'});
		    //-----------------------------------------------------------
			//local variable
			//-----------------------------------------------------------
			var paymentBankOn = paymentBankVo.event();
			var paymentBankVl = {};
			//-----------------------------------------------------------
			//view initialize
			//-----------------------------------------------------------
			paymentBankVo.render(function() {				
				$log('paymentBankPopup init', $param);
				paymentBankVl.bankList = $param.bankList;
				
				paymentBankVo.push(paymentBankVl);
				bottomsheetGradient();
			});
		    //-----------------------------------------------------------
			//event binding
			//-----------------------------------------------------------
			paymentBankOn.close = function(){
				$close();
			}
			//-----------------------------------------------------------
			//local function
			//-----------------------------------------------------------
			function bottomsheetGradient(){ // 바텀시트 그라디언트
				var elements = ['.pop-dx.pop-gradient .pop_cont'];
				
				elements.forEach(function(selector){
					var eleCont = $(selector);
					eleCont.on("scroll",function() {
						var scrollT = Math.floor($(this).scrollTop());
						if(scrollT > 0){
								$(this).siblings('.pop_head').addClass("gradient");
						}else{
								$(this).siblings('.pop_head').removeClass("gradient");
						}
					});
				});
			}
		});
		
		// 카드상세 연회비 팝업
		$svc.popup('annualFeePopup', function($param, $close) {
			//-----------------------------------------------------------
			//view binding variable
			//-----------------------------------------------------------
			var annualFeeVo = $svc.bind({name:'annualFeePopup', url: '/mob/cmm/MOBFMCARD/annualFeePopup.ahtml'});
			//-----------------------------------------------------------
			//local variable
			//-----------------------------------------------------------
			var annualFeeOn = annualFeeVo.event();
			var annualFeeVl = {};
			//-----------------------------------------------------------
			//view initialize
			//-----------------------------------------------------------
			annualFeeVo.render(function() {				
				$log('annualFeePopup init', $param);
				annualFeeVl.afeInfo = $param.afeInfo;
				
				annualFeeVo.push(annualFeeVl);
				bottomsheetGradient();
			});
			//-----------------------------------------------------------
			//event binding
			//-----------------------------------------------------------
			annualFeeOn.close = function(){
				$close();
			}
			//-----------------------------------------------------------
			//local function
			//-----------------------------------------------------------
			function bottomsheetGradient(){ // 바텀시트 그라디언트
				var elements = ['.pop-dx.pop-gradient .pop_cont'];
				
				elements.forEach(function(selector){
					var eleCont = $(selector);
					eleCont.on("scroll",function() {
						var scrollT = Math.floor($(this).scrollTop());
						if(scrollT > 0){
								$(this).siblings('.pop_head').addClass("gradient");
						}else{
								$(this).siblings('.pop_head').removeClass("gradient");
						}
					});
				});
			}
			
		});
		
		// 카드상세
		$svc.plugin('cmmCardDetail', function($param,$close) {
			//-----------------------------------------------------------
			//view binding variable
			//-----------------------------------------------------------
			cardDetailVo = $svc.bind({name:'cmmCardDetail', plugin: true});
			//-----------------------------------------------------------
			//local variable
			//-----------------------------------------------------------
			var http = $svc.get('http');
			var vl = {};
			var lc={};
			var on = cardDetailVo.event();
			var compareVl = {};
			var commCardSwiper;
			
			//-----------------------------------------------------------
			//view initialize
			//-----------------------------------------------------------
			cardDetailVo.render(function() {
				$log('cmmCardDetail init', $param);
				vl.pageId = $param.pageId;
				vl.popup = $param.popup ? 'Y' : 'N';
				vl.isCardCompare = true;
				vl.isShow=true;
				vl.isShowGuide = false;
//				vl.cardType = $param.cardType?$param.cardType:'2';
				$log('cmmCardDetail vl', vl);
				init();
			});
			
			//-----------------------------------------------------------
			//event binding
			//-----------------------------------------------------------
			on.addCompare = function (e) {
				var pageId = $(e.currentTarget).data('pageId').toString();
				$log('pageId', pageId);
				
				if (!$areaCardCompareAfter.hasClass('compare_gapt')) {
					$areaCardCompareAfter.addClass('compare_gapt');
				}
				
				if (_.indexOf(cardComparePageIds, pageId) > -1) {
					$svc.get('popup').alert('카드비교함에 이미 담겨 있습니다.').then(function () {
						cardDetailVo.focus(e);
					});
					return;
				}
				if (cardComparePageIds.length === 0) {
					$svc.get('popup').alert('선택한 카드가 카드비교함에 담겼습니다.').then(function () {
						cardComparePageIds.push(pageId);
						setItem();						
						compareVl.count = '1';
						compareVl.cardCompareShow = true;
						cardCompareVo.push(compareVl);						
						cardDetailVo.focus(e);
						//$('.js-cp-open').attr("tabindex", 0).focus();
					});
					return;
				}
				if (cardComparePageIds.length === 1) {
					$svc.get('popup').alert('선택한 카드가 카드비교함에 담겼습니다.').then(function () {
						cardComparePageIds.push(pageId);
						setItem();
						compareVl.count = '2';
						cardCompareVo.push(compareVl);
						$('.js-cp-open').click();
						$('.js-cp-open').attr("tabindex", 0).focus();
					});
					return;
				}
				if (cardComparePageIds.length === 2) {
					loadCardList().then(function() {
						var v = _.find(window.cardList, function(v,i) { return -1 < v['hpgCrdPdId'].indexOf(cardComparePageIds[1]); });
						
						$svc.get('popup').confirm('카드비교함이 꽉 찼습니다. [' + function () { return v && v['hpgCrdPdNm']; }() + ']를(을) 삭제하고 새 카드를 담을까요?').then(function (y) {
							if (y) {
								cardComparePageIds.pop();
								cardComparePageIds.push(pageId);
								setItem();
								$('.js-cp-open').click();
								$('.js-cp-open').attr("tabindex", 0).focus();
							} else {
								cardDetailVo.focus(e);
							}
						});
						return;
					});
				}
			}
			
			on.movePage = function(e) {
				var pageUrl = $(e.currentTarget).attr('data-move-url');
				var id = $(e.currentTarget).attr('id');
				
				if(!id) {
					return;
				}
								
				var param = {pageId: vl.pageId};
				
				$svc.get('http').json('/mob/MOBFM038N/MOBFM038C0164.ajax', param)
				.then(function(rsHttp) {
					 if (!rsHttp) return;
					 
					 $log('rsHttp :', rsHttp);					
					 
					 var applyName = '';					 
					 var isApplyAvaliable = false;
					 switch(id) {
					 	case 'pcSimpleCardApplyBtn':
					 		applyName = '간편신청'
					 		if (rsHttp.hpgCrdPdPcSimPtSeF === 'Y')  isApplyAvaliable = true;
					 		break;
					 	case 'mSimpleCardApplyBtn':
					 		applyName = '간편신청'
						 	if (rsHttp.hpgCrdPdSimPtSeF === 'Y')  isApplyAvaliable = true;
					 		break;
					 	case 'pcOnlineCardApplyBtn':
					 		applyName = '온라인신청'
							if (rsHttp.hpgCrdPdPcOnlPtSeF === 'Y')  isApplyAvaliable = true;
					 		break;
					 	case 'mOnlineCardApplyBtn':
					 		applyName = '온라인신청'
							if (rsHttp.hpgCrdPdOnlPtSeF === 'Y')  isApplyAvaliable = true;
					 		break;
					 	case 'mPhoneApplyBtn':
					 		applyName = '전화신청'
							if (rsHttp.hpgCrdPdPhnPtSeF === 'Y')  isApplyAvaliable = true;
					 		break;
					 	case 'mTalkApplyBtn':
					 		applyName = 'Talk신청'
							if (rsHttp.hpgCrdPdCslPtSeF === 'Y')  isApplyAvaliable = true;
					 		break;
				 		default:
				 			break;
					 }
					 
					 if (!isApplyAvaliable) {
						 $svc.get('popup').alert(vl.cardNm + '는(은) ' + applyName + '을 하실 수 없습니다.').then(function () {
							 cardListVo.focus(e);
						 });
					 } else {
						 if(vl.pageId === '201604040001'){
							 //네이버페이 체크카드일 경우 새창 열기
							 $log('pageUrl :', pageUrl);		
							 openAppUrl(pageUrl);
						}else{
//							$svc.get('location').go(pageUrl);
							if (lc.isNetFunnel) {
								//pageUrl = getChangeParam(pageUrl, 'empSeq', '500');
								NetFunnel_Action({action_id:"pr_mob_kakao_01"}, function(ev,ret){
									NetFunnel_Complete();
									location.href = pageUrl;
								});
							} else {
								location.href = pageUrl;
							}
						}
					 }
				});				
			}
			
			on.openAppUrl = function(url) {
				openAppUrl(url);
			}
			
			//팝업 열기
			on.popOpen = function(inParam) {
				$log('popOpen init');
				var url1 = location.origin + '/mob/MOBFM281N/MOBFM281P001.shc?popId=' + inParam;
				var url2 = location.origin + '/mob/MOBFM281N/MOBFM281P002.shc?popId=' + inParam;
				
				//혜택보기에서 팝업 오픈 or 쁘띠엘린 할인 팝업일 경우 새창으로 열기
				if(inParam === 'onlinepop' || (vl.popup === 'Y' && inParam === 'center_pop')){
					$log('popOpen url2 ' + url2);
					openAppUrl(url2);
				}else if(vl.popup === 'Y'){
						$log('popOpen url1 ' + url1);
						openAppUrl(url1);
				}else{
					popOpen('#'+inParam);
				}
			}
			
			on.openPaymentBankPop = function(){
				$svc.get('popup').open({name: 'paymentBankPopup', param: {bankList:vl.bankList}}).then(function() {
					
				});
			}
			on.openAnnualFeePop = function(){
				$svc.get('popup').open({name: 'annualFeePopup', param: {afeInfo:vl.afeInfo}}).then(function() {
					$('.btn-pop').focus();
				});
			}
			//-----------------------------------------------------------
			//local function
			//-----------------------------------------------------------
			function init() {
				loadTotalCardList().
				then(function() {
					bindCardDetailInfo(vl.pageId);
					cardDetailVo.push(vl);
					commCardSwiper();
					handleMFloatingBox();
					setCardApplyBtnAttr();
					
					// 디자인카드 > 혜택보기 팝업 내부일 경우 카드비교함 노출하지 않음
					if ($param.popup != 'Y') {
						$svc.get('plugin').load({name: 'cardCompare', param: $param});
					}
					
//					if( $('ul.benefits li').length > 0){
//						$('ul.benefits li').each(function(idx,o){
//					        var _this = $(this);
//					        var _thisBackImg = _this.css('background-image');
//
//					        _this.removeAttr('class').addClass('icon')
//					        .css('background-image', _thisBackImg);
//					    });
//					}
				});
			}
			
			function bindCardDetailInfo(pageId) {
				var result = _.find(window.cardList, function(c) { return pageId === c.hpgCrdPdId });
				
				if (result) {
					// card title
					vl.cardNm = result.hpgCrdPdNm;
		
					var thumbImgInfo = _.find(result.imgInfo, function(m) { return m.hpgCrdPdImgCcd === '2' });
					
					if (util.isEmpty(thumbImgInfo)) {
						thumbImgInfo = {
							hpgCrdPdCrdImgUrlAr: '/pconts/images/common/share/default_card.png'
						};
					}
					
					// card title, sns공유하기 버튼, 비교함담기 버튼
					var cardNmArea = '<h1>'+result.hpgCrdPdNm+'</h1>';
					cardNmArea += '<button class="btn_sns" onclick="goEventSNSShare(\'' + result.hpgCrdPdNm + '\',\'' + location.origin + thumbImgInfo.hpgCrdPdCrdImgUrlAr + '\')" title="카드비교 팝업열기"><img src="/pconts/images/dx/contents/share-2024.png" alt="sns 공유하기 버튼이미지"><span class="btn_sns_balloon">공유하기</span></button>';
					cardNmArea += '<button class="btn_card_add" data-plugin-visible="isCardCompare" data-plugin-click="addCompare()" data-page-id="' + result.hpgCrdPdId + '"><img src="/pconts/images/dx/contents/file-plus-2024.png" alt="비교함 버튼이미지"><span class="btn_add_balloon">비교함 담기</span></button>';
					vl.cardNmArea = cardNmArea;
					
					// card description
					vl.cardDesc = result.hpgCrdPdSmrTt;
					
					// card benefit					
					vl.svcInfo = ( !_.isEmpty(result.svcInfo) && result.svcInfo.length > 3 ) ? result.svcInfo.slice(0, 3) : result.svcInfo;
					
//					var svcInfoArea = '';
//					_.each(result.svcInfo, function(v,i) {
//						v.hpgCrdPdSvTcd = (!_.isEmpty(v.hpgCrdPdSvTcd) && v.hpgCrdPdSvTcd.length == 1) ? '0' + v.hpgCrdPdSvTcd : v.hpgCrdPdSvTcd;
//						svcInfoArea += '<li><span>' + v.hpgCrdPdSvTpNm+'</span><b>' + v.hpgCrdPdSvTpTt + '</b></li>';
//					});
//					vl.svcInfoArea = svcInfoArea;
//					$log('vl.svcInfoArea : '+vl.svcInfoArea);
					
					// 카드신청 버튼 노출 여부
					vl.pcSimple = result.hpgCrdPdPcSimPtSeF;
					vl.pcOnline = result.hpgCrdPdPcOnlPtSeF;
					vl.mSimple = result.hpgCrdPdSimPtSeF;
					vl.mOnline = result.hpgCrdPdOnlPtSeF;
					
					//talk신청 및 전화신청 버튼 노출 여부
					var evttp = getParaVal('evttp');
					if(evttp === 'rmc'){
						vl.mPhone = 'N';
						vl.mTalk = 'N';
					}else{
						vl.mPhone = result.hpgCrdPdPhnPtSeF;
						vl.mTalk = result.hpgCrdPdCslPtSeF;
					}
					
					// 카드 연회비
					vl.afeInfo = result.afeInfo;
					vl.afeInfoArea = '';
					_.each(vl.afeInfo, function(v,i) {
						var brandData = getbrandDataByBrandCode(v.hpgCrdPdCrdBrdCd);
						v.brandImgUrl = brandData.brandImgUrl;
						v.brandNm = brandData.brandNm;						
						
						v.afeOption = getAfeOption(v.hpgCrdPdAfeCcd);
						v.bseAfe = (!_.isEmpty(v.hpgCrdPdBseAfeGuaTt)) ? getAnnualFeeFormat(v.hpgCrdPdBseAfeGuaTt) : '';
						v.aflAfe = (!_.isEmpty(v.hpgCrdPdAflAfeGuaTt)) ? getAnnualFeeFormat(v.hpgCrdPdAflAfeGuaTt) : '';
						v.wlAfe = (!_.isEmpty(v.hpgCrdPdWlAfeGuaTt)) ? getAnnualFeeFormat(v.hpgCrdPdWlAfeGuaTt) : '';
						
						v.hpgCrdPdBseAfeGuaTt = util.addCommas(v.hpgCrdPdBseAfeGuaTt);
						v.hpgCrdPdAflAfeGuaTt = util.addCommas(v.hpgCrdPdAflAfeGuaTt);
						v.hpgCrdPdWlAfeGuaTt = util.addCommas(v.hpgCrdPdWlAfeGuaTt);
						
						vl.afeInfoArea += '<li><span class="ico_brand"><img src="'+v.brandImgUrl+'" alt="'+v.brandNm+'"></span><span>'+v.wlAfe+'('+v.afeOption+')</span></li>';
					});
					
					// 결제은행 (체크카드인 경우 노출)
					var $bankList = $('#paymentBankList');
					if ($bankList.length > 0) {						
						if (!_.isEmpty(result.hpgCrdPdStBkDescTt)) {
							var bankCodeList = result.hpgCrdPdStBkDescTt.split(',');
							vl.bankList = [];					
							_.each(bankCodeList, function(v,i) {
								var bankInfo = getBankInfoByBankCode(v);
								vl.bankList.push(bankInfo);
							});
						}											
					}
					
				}
			}
			
			// 연회비 format
			function getAnnualFeeFormat(annualFee) {
				var formatAnnualFee = '';
				annualFee = parseInt(annualFee);
				
				if (annualFee == 0) {
					return '없음';
				}
				
				if (annualFee >= 10000) {
					var fee1 = annualFee / 10000;
					formatAnnualFee = parseInt(fee1) + '만';
					if (annualFee % 10000) {
						var fee2 = (annualFee - (parseInt(fee1)*10000)) / 1000;
						formatAnnualFee += parseInt(fee2) + '천';
					}
				} else {
					var fee3 = annualFee / 1000;
					formatAnnualFee += parseInt(fee3) + '천';
				}
				formatAnnualFee += '원';
				
				return formatAnnualFee;
			}
			
			function getBankInfoByBankCode(bankCode) {
				var bankInfo = { bankNm: '', bankImgUrl: ''};
				
				switch(bankCode) {
					case '088':
						bankInfo.bankNm = '신한';
						bankInfo.bankImgUrl = '/pconts/images/bank/bg_icon_bank01_01.png';	//C2022101467841  [디지털채널관리시스템] 신한투자증권 사명 및 그룹사심볼 변경건 - pconts/images/bank/bg_icon_bank01.png
						break;
					case '003':
						bankInfo.bankNm = 'IBK기업';
						bankInfo.bankImgUrl = '/pconts/images/bank/bg_icon_bank02.png';
						break;
					case '004':
						bankInfo.bankNm = 'KB국민';
						bankInfo.bankImgUrl = '/pconts/images/bank/bg_icon_bank03.png';
						break;
					case '023':
						bankInfo.bankNm = 'SC제일';
						bankInfo.bankImgUrl = '/pconts/images/bank/bg_icon_bank04.png';
						break;
					case '031':
						bankInfo.bankNm = '아이엠뱅크(구.대구)';
						bankInfo.bankImgUrl = '/pconts/images/bank/bg_icon_bank05.png';
						break;
					case '037':
						bankInfo.bankNm = '전북';
						bankInfo.bankImgUrl = '/pconts/images/bank/bg_icon_bank06.png';
						break;
					case '032':
						bankInfo.bankNm = '부산';
						bankInfo.bankImgUrl = '/pconts/images/bank/bg_icon_bank07.png';
						break;
					case '034':
						bankInfo.bankNm = '광주';
						bankInfo.bankImgUrl = '/pconts/images/bank/bg_icon_bank08.png';
						break;
					case '020':
						bankInfo.bankNm = '우리';
						bankInfo.bankImgUrl = '/pconts/images/bank/bg_icon_bank09.png';
						break;
					case '035':
						bankInfo.bankNm = '제주';
						bankInfo.bankImgUrl = '/pconts/images/bank/bg_icon_bank10_01.png';	//C2022101467841  [디지털채널관리시스템] 신한투자증권 사명 및 그룹사심볼 변경건 - pconts/images/bank/bg_icon_bank10.png
						break;
					case '081':
						bankInfo.bankNm = 'KEB하나';
						bankInfo.bankImgUrl = '/pconts/images/bank/bg_icon_bank11.png';
						break;
					case '011':
						bankInfo.bankNm = 'NH농협';
						bankInfo.bankImgUrl = '/pconts/images/bank/bg_icon_bank12.png';
						break;
					case '039':
						bankInfo.bankNm = '경남';
						bankInfo.bankImgUrl = '/pconts/images/bank/bg_icon_bank13.png';
						break;
					case '012':
						bankInfo.bankNm = '지역농협';
						bankInfo.bankImgUrl = '/pconts/images/bank/bg_icon_bank14.png';
						break;
					case '045':
						bankInfo.bankNm = '새마을금고';
						bankInfo.bankImgUrl = '/pconts/images/bank/bg_icon_bank15.png';
						break;
					case '007':
						bankInfo.bankNm = '수협';
						bankInfo.bankImgUrl = '/pconts/images/bank/bg_icon_bank16.png';
						break;
					case '048':
						bankInfo.bankNm = '신협';
						bankInfo.bankImgUrl = '/pconts/images/bank/bg_icon_bank17.png';
						break;
					case '071':
						bankInfo.bankNm = '우체국';
						bankInfo.bankImgUrl = '/pconts/images/bank/bg_icon_bank18.png';
						break;
					case '002':
						bankInfo.bankNm = '산업';
						bankInfo.bankImgUrl = '/pconts/images/bank/bg_icon_bank20.png';
						break;
					case '005':
						bankInfo.bankNm = '(구)외환';
						bankInfo.bankImgUrl = '/pconts/images/bank/bg_icon_bank21.png';
						break;
					case '027':
						bankInfo.bankNm = '한국시티은행(한미)';
						bankInfo.bankImgUrl = '/pconts/images/bank/bg_icon_bank22.png';
						break;
					case '054':
						bankInfo.bankNm = 'HSBC';
						bankInfo.bankImgUrl = '/pconts/images/bank/bg_icon_bank23.png';
						break;
					case '021':
						bankInfo.bankNm = '(구)조흥';
						bankInfo.bankImgUrl = '/pconts/images/bank/bg_icon_bank24.png';
						break;
					case '026':
						bankInfo.bankNm = '(구)신한';
						bankInfo.bankImgUrl = '/pconts/images/bank/bg_icon_bank25.png';
						break;
					case '055':
						bankInfo.bankNm = '도이치은행';
						bankInfo.bankImgUrl = '/pconts/images/bank/bg_icon_bank26.png';
						break;
					case '089':
						bankInfo.bankNm = 'K뱅크';
						bankInfo.bankImgUrl = '/pconts/images/bank/bg_icon_bank27.png';
						break;
					case '090':
						bankInfo.bankNm = '카카오뱅크';
						bankInfo.bankImgUrl = '/pconts/images/bank/bg_icon_bank28.png';
						break;
					case '053':
						bankInfo.bankNm = '시티';
						bankInfo.bankImgUrl = '/pconts/images/bank/bg_icon_bank29.png';
						break;
					case '278':
						bankInfo.bankNm = '신한투자증권';										//C2022101467841  [디지털채널관리시스템] 신한투자증권 사명 및 그룹사심볼 변경건 - 신한금투
						bankInfo.bankImgUrl = '/pconts/images/bank/bg_icon_bank44_01.png';	//C2022101467841  [디지털채널관리시스템] 신한투자증권 사명 및 그룹사심볼 변경건 - pconts/images/bank/bg_icon_bank44.png
						break;
	
					default:
						break;						
				}
				
				console.log('bankInfo', bankInfo);
				return bankInfo;
			}
			
			function getbrandDataByBrandCode(brandCode) {				
				var brandData = {brandImgUrl:'', brandNm: ''}
				switch(brandCode) {
					case '0':
						brandData.brandImgUrl = '/pconts/images/contents/card/overseas_pay_domestic.png';
						brandData.brandNm = 'Local';
						break;
					case '1':
						brandData.brandImgUrl = '/pconts/images/contents/card/overseas_pay_master.png';
						brandData.brandNm = 'Master';
						break;
					case '2':
						brandData.brandImgUrl = '/pconts/images/contents/card/overseas_pay_visa.png';
						brandData.brandNm = 'VISA';
						break;
					case '3':
						brandData.brandImgUrl = '/pconts/images/contents/card/overseas_pay_jcb.png';
						brandData.brandNm = 'JCB';
						break;
					case '4':
						brandData.brandImgUrl = '/pconts/images/contents/card/overseas_pay_amex.png';
						brandData.brandNm = 'Amex';
						break;
					case '5':
						brandData.brandImgUrl = '/pconts/images/contents/card/overseas_pay_union.png';
						brandData.brandNm = 'UPI';
						break;
					case '6':
						brandData.brandImgUrl = '/pconts/images/contents/card/overseas_pay_urs.png';
						brandData.brandNm = 'URS';
						break;
					case '8':
						brandData.brandImgUrl = '/pconts/images/contents/card/overseas_pay_sn.png';
						brandData.brandNm = 'S&';
						break;
					default:
						break;
				}
				
				return brandData;
			}
			
			function getAfeOption(optionCode) {
				var afeOption = '';
				switch(optionCode) {
					case '1':
						afeOption = '일반';
						break;
					case '2':
						afeOption = '캐시백';
						break;
					case '3':
						afeOption = '마일리지';
						break;
					case '4':
						afeOption = 'Platinum';
						break;
					case '5':
						afeOption = 'Silver';
						break;
					case '6':
						afeOption = 'Gold';
						break;
					case '7':
						afeOption = 'Signature';
						break;
					case '8':
						afeOption = 'Infinite';
						break;
					case '9':
						afeOption = 'Diamond';
						break;
					case 'A':
						afeOption = 'Prestige';
						break;
					case 'B':
						afeOption = 'Platinum Elite';
						break;
					case 'C':
						afeOption = 'World';
						break;
					case 'D':
						afeOption = 'Platinum/캐시백';
						break;
					case 'E':
						afeOption = 'Platinum/항공';
						break;
					case 'F':
						afeOption = 'Signature/캐시백';
						break;
					case 'G':
						afeOption = 'Signature/항공';
						break;
					case 'H':
						afeOption = 'Signature/기본';
						break;
					case 'I':
						afeOption = 'Diamond/기본';
						break;
					case 'J':
						afeOption = 'Diamond/항공';
						break;
					case 'K':
						afeOption = 'Platinum/모바일단독';
						break;	
					case 'L':
						afeOption = '일반/마이신한포인트';
						break;
					case 'M':
						afeOption = '일반/스카이패스';
						break;
					case 'N':
						afeOption = 'World/마이신한포인트';
						break;
					case 'O':
						afeOption = 'World/스카이패스';
						break;
					case 'P':
						afeOption = 'Silver/모바일단독';
						break;
					default:
						break;
				}
				return afeOption;
			}

			function commCardSwiper() {
				var eleSwiper = '.card_slider';
				var $eleSwiper = $(eleSwiper);
				var $eleSwiperContainer = $(eleSwiper+ ' .swiper-container');
				var $eleSwiperSlide = $(eleSwiper+ ' .swiper-slide');
				var clsNoSwiper = 'no_swiper';
				if ($eleSwiperSlide.length > 1){
					$eleSwiper.removeClass(clsNoSwiper);
					commCardSwiper = new Swiper(eleSwiper+ ' .swiper-container', {
						slidesPerView: 'auto',
						spaceBetween: 60,
						centeredSlides: true,
						//allowTouchMove: false,
						watchSlidesVisibility: true,
						navigation: {
							nextEl: eleSwiper+ ' .nav-button-next',
							prevEl: eleSwiper+ ' .nav-button-prev',
						},
						pagination: {
							el: eleSwiper+ ' .swiper-pagination',
							clickable: true,
							//type: 'fraction' // 191031 카드 6개 이상일 때 숫자표시
						},
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
			}
			
			function handleMFloatingBox() {
				var wW;
				var swW = 1100;
				var start = 100;
				var $targetBtn = $(".m_floatiing_box");
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
				
				$(window).scroll();
			}
			
			function setCardApplyBtnAttr() {
				vl.pcSimpleAttr = {id: 'pcSimpleCardApplyBtn'};
				vl.mSimpleAttr = {id: 'mSimpleCardApplyBtn'};
				vl.pcOnlineAttr = {id: 'pcOnlineCardApplyBtn'};
				vl.mOnlineAttr = {id: 'mOnlineCardApplyBtn'};
				vl.mPhoneAttr = {id: 'mPhoneApplyBtn'}
				vl.mTalkAttr = {id: 'mTalkApplyBtn'}
				
				cardDetailVo.push(vl);
				
				vl.pcSimpleAttr['data-move-url'] = $('#pcSimpleCardApplyBtn').data('moveUrl');
				vl.mSimpleAttr['data-move-url'] = $('#mSimpleCardApplyBtn').data('moveUrl');
				vl.pcOnlineAttr['data-move-url'] = $('#pcOnlineCardApplyBtn').data('moveUrl');
				vl.mOnlineAttr['data-move-url'] = $('#mOnlineCardApplyBtn').data('moveUrl');
				vl.mPhoneAttr['data-move-url'] = $('#mPhoneApplyBtn').data('moveUrl');
				vl.mTalkAttr['data-move-url'] = $('#mTalkApplyBtn').data('moveUrl');
				
				handleCardApplyLink();
			}
			
			function handleCardApplyLink() {
				var paraOrign = document.URL;
				
				// NVAR [ MOBILE(간편신청), PC(간편신청) ] : 네이버 트래픽코드 파라미터
				var NVAR = getParaVal('NVAR');
				var NVADID = getParaVal('NVADID');
				getCardLinkUrl(vl.pcSimpleAttr, 'NVAR', NVAR);
				getCardLinkUrl(vl.pcSimpleAttr, 'NVADID', NVADID);
				getCardLinkUrl(vl.mSimpleAttr, 'NVAR', NVAR);
				getCardLinkUrl(vl.mSimpleAttr, 'NVADID', NVADID);
				
				// trstId, pdCd [ MOBILE(간편신청), PC(간편신청) ] : 맥스카드 관련 파라미터
				var trstId = getParaVal('trstId');
				var pdCd = getParaVal('pdCd');
				getCardLinkUrl(vl.pcSimpleAttr,'trstId',trstId);
				getCardLinkUrl(vl.pcSimpleAttr,'pdCd',pdCd);
				getCardLinkUrl(vl.mSimpleAttr,'trstId',trstId);
				getCardLinkUrl(vl.mSimpleAttr,'pdCd',pdCd);
				
				// evttp [ MOBILE(간편신청, 온라인신청, Talk카드신청), PC(간편신청, 온라인신청) ]
				var evttp = getParaVal('evttp');
				getCardLinkUrl(vl.mSimpleAttr,'evttp',evttp);
				getCardLinkUrl(vl.mOnlineAttr,'evttp',evttp);
				getCardLinkUrl(vl.mTalkAttr,'evttp',evttp);
				getCardLinkUrl(vl.pcSimpleAttr,'evttp',evttp);
				getCardLinkUrl(vl.pcOnlineAttr,'evttp',evttp);
				
				// RecommN [ MOBILE(간편신청, 온라인신청, Talk카드신청), PC(간편신청, 온라인신청) ]
				var RecommN = getParaVal('&RecommN');
				getCardLinkUrl(vl.mSimpleAttr,'RecommN',RecommN);
				getCardLinkUrl(vl.mOnlineAttr,'RecommN',RecommN);
				getCardLinkUrl(vl.mTalkAttr,'RecommN',RecommN);
				getCardLinkUrl(vl.pcSimpleAttr,'RecommN',RecommN);
				getCardLinkUrl(vl.pcOnlineAttr,'RecommN',RecommN);
				
				// kccRecommN [ MOBILE(간편신청, 온라인신청), PC(간편신청, 온라인신청) ]
				var kccRecommN = getParaVal('kccRecommN');
				getCardLinkUrl(vl.mSimpleAttr,'kccRecommN',kccRecommN);
				getCardLinkUrl(vl.mOnlineAttr,'kccRecommN',kccRecommN);
				getCardLinkUrl(vl.pcSimpleAttr,'kccRecommN',kccRecommN);
				getCardLinkUrl(vl.pcOnlineAttr,'kccRecommN',kccRecommN);
				
				// EntryLoc1 간편신청 [ MOBILE(간편신청), PC(간편신청) ]
				getInputParam(vl.mSimpleAttr, 'EntryLoc1', 'EntryLoc', 10);
				getInputParam(vl.pcSimpleAttr, 'EntryLoc1', 'EntryLoc', 10);		
				
				// EntryLoc2 온라인카드신청 [ MOBILE(온라인신청), PC(온라인신청) ]
				getInputParam(vl.mOnlineAttr, 'EntryLoc2', 'EntryLoc', 10);
				getInputParam(vl.pcOnlineAttr, 'EntryLoc2', 'EntryLoc', 10);
				
				// empseq 모집인코드 [ MOBILE(온라인신청), PC(온라인신청) ]
				getInputParam(vl.mOnlineAttr, 'empSeq', 'empSeq', 7);
				getInputParam(vl.pcOnlineAttr, 'empSeq', 'empSeq', 7);
				
				// agcCd [ MOBILE(온라인신청) ]
				var agcCd = getParaVal('agcCd');
				getCardLinkUrl(vl.mOnlineAttr,'agcCd',agcCd);
				
				// datakey [ MOBILE(온라인신청) ]
				var datakey = getParaVal('datakey');
				getCardLinkUrl(vl.mOnlineAttr,'datakey',datakey);
				
				// EntryShp [ MOBILE(간편신청) ]
				var EntryShp = getParaVal('EntryShp');
				getCardLinkUrl(vl.mSimpleAttr,'EntryShp',EntryShp);
								
				// EntryLoc4 시그니처 신청 배너				
				if(paraOrign.indexOf('EntryLoc4')>-1){
					var EntryLoc1=getParaVal('EntryLoc1');
					var EntryLoc2=getParaVal('EntryLoc2');
					var EntryLoc4=getParaVal('EntryLoc4');
					var empSeq4=getParaVal('empSeq4');
					var datakey=getParaVal('datakey');
					var agcCd=getParaVal('agcCd');
					
					// TODO 시그니처 신청 배너 문의 후 getCardLinkUrl 수정필요.
					// 시그니처 상세보기
					//getCardLinkUrl('#paraAppBtn1','EntryLoc1',EntryLoc1);
					//getCardLinkUrl('#paraAppBtn1','EntryLoc2',EntryLoc2);
					//getCardLinkUrl('#paraAppBtn1','EntryLoc4',EntryLoc4);
					//getCardLinkUrl('#paraAppBtn1','empSeq4',empSeq4);
					//getCardLinkUrl('#paraAppBtn1','datakey',datakey);
					//getCardLinkUrl('#paraAppBtn1','agcCd',agcCd);
					
					// 시그니처 신청
					//getCardLinkUrl('#paraAppBtn2','EntryLoc',EntryLoc4);
					//getCardLinkUrl('#paraAppBtn2','empSeq',empSeq4);
					//getCardLinkUrl('#paraAppBtn2','datakey',datakey);
					//getCardLinkUrl('#paraAppBtn2','agcCd',agcCd);
				}
								
				// cuRecommnN [ MOBILE(온라인신청) ]
				var cuRecommN=getParaVal('cuRecommN');
				getCardLinkUrl(vl.mOnlineAttr,'cuRecommN',cuRecommN);	
				getCardLinkUrl(vl.mSimpleAttr,'cuRecommN',cuRecommN);
				getCardLinkUrl(vl.pcSimpleAttr,'cuRecommN',cuRecommN);
				getCardLinkUrl(vl.pcOnlineAttr,'cuRecommN',cuRecommN);
				
				// SHC_CLL_N [ MOBILE(간편신청, 온라인신청) ]
				var SHC_CLL_N=getParaVal('SHC_CLL_N');
				getCardLinkUrl(vl.mSimpleAttr,'SHC_CLL_N',SHC_CLL_N);
				getCardLinkUrl(vl.mOnlineAttr,'SHC_CLL_N',SHC_CLL_N);
				
				// auto [ MOBILE(온라인신청) ]
				var auto =getParaVal('auto');
				getCardLinkUrl(vl.mOnlineAttr,'auto',auto);
				
				// USER_ID [ MOBILE(온라인신청) ]
				var USER_ID = getParaVal('USER_ID');
				getCardLinkUrl(vl.mOnlineAttr,'USER_ID',USER_ID);
				getCardLinkUrl(vl.pcOnlineAttr,'USER_ID',USER_ID);
				
				// EntryLoc3 [ MOBILE(Talk카드신청) ]
				getInputParam(vl.mTalkAttr, 'EntryLoc3', 'EntryLoc', 10);
				
				// btnApp
				if(paraOrign.indexOf('btnApp')>-1){
					var idxN=paraOrign.indexOf('btnApp')+7
					var btnApp=paraOrign.substring(idxN,9999)
					endStr=btnApp.indexOf('&')>-1?btnApp.indexOf('&'):9999;
					btnApp=btnApp.substring(0,endStr)
					if(btnApp.indexOf(0)>-1){
						vl.mPhone = 'N';
					}
					if(btnApp.indexOf(1)>-1){
						vl.mSimple = 'N';
						vl.pcSimple = 'N';
					}
					if(btnApp.indexOf(2)>-1){
						vl.mOnline = 'N';
						vl.pcOnline = 'N';
					}
					if(btnApp.indexOf(3)>-1){
						vl.mTalk = 'N';
					}
					//시그니쳐
					if(btnApp.indexOf('4')>-1){
						// TODO 시그니쳐 배너영역 숨기기
						$('.box_signature').remove();
					}
				}
				
				// PtnrHd : 당사 채널에서는 신청 받지 않고, 제휴 채널을 통해서만 신청을 받아야 하는 경우
				var cardCUrl = [
				//'/pconts/html/card/apply/credit/1188458_2207.html', //광역알뜰교통 신한카드
				//'/pconts/html/card/apply/check/1188369_2206.html', //광역알뜰교통 신한카드 체크
				'/pconts/html/card/apply/credit/1188442_2207.html', //THE BOON VIP 신한카드
				'/pconts/html/card/apply/credit/1188441_2207.html' //THE BOON SVIP 신한카드
				];
				if(paraOrign.indexOf('PtnrHd=a')<1){
					var ptnrHdUrl = _.find(cardCUrl, function(v) { return paraOrign.indexOf(v) > -1 });
					if (ptnrHdUrl) {
						// 카드비교함 숨기기
						$param.popup = 'Y';
						// 카드비교함 담기 버튼 숨기기
						vl.isCardCompare = false;
						// 카드신청버튼 숨기기
						vl.isShow = false;
						// 유의사항 보여주기
						vl.isShowGuide = true;
					}
				}
				
				var netFunnelCardUrl = [
						'/pconts/html/card/apply/check/1187963_2206.html', // 카카오페이
						'/pconts/html/card/apply/check/1198442_2206.html', // 카카오페이
						'/pconts/html/card/apply/credit/1198942_2207.html', // 더모아
						'/pconts/html/card/apply/credit/1210364_2207.html' // 더모아
				];
				
				if(paraOrign.indexOf('PtnrHd=a')<1){
					var isNetFunnelCard = _.find(netFunnelCardUrl, function(v) { return paraOrign.indexOf(v) > -1 });
					lc.isNetFunnel = false
					if (isNetFunnelCard) {
						if ( !util.isEmpty(getParaVal('USER_ID')) ) {
							lc.isNetFunnel = true;
						}
					}
				}
				
				
				// targetID [ MOBILE(간편신청, 온라인신청), PC(간편신청, 온라인신청) ]
				var targetID = getParaVal('targetID');
				getCardLinkUrl(vl.mSimpleAttr,'targetID',targetID);
				getCardLinkUrl(vl.mOnlineAttr,'targetID',targetID);
				getCardLinkUrl(vl.pcSimpleAttr,'targetID',targetID);
				getCardLinkUrl(vl.pcOnlineAttr,'targetID',targetID);
				
				// pageId [ MOBILE(간편신청), PC(간편신청) ]
				getCardLinkUrl(vl.mSimpleAttr,'pageId',vl.pageId);
				getCardLinkUrl(vl.pcSimpleAttr,'pageId',vl.pageId);
				
				// hwno [ MOBILE(온라인신청), PC(온라인신청) ]
				var hwno = getParaVal('hwno');
				getCardLinkUrl(vl.mOnlineAttr,'hwno',hwno);
				getCardLinkUrl(vl.pcOnlineAttr,'hwno',hwno);
				
				// tid [ MOBILE(온라인신청), PC(온라인신청) ]
				var kakaoTid = getParaVal('tid');
				getCardLinkUrl(vl.mOnlineAttr,'tid',kakaoTid);
				getCardLinkUrl(vl.pcOnlineAttr,'tid',kakaoTid);
				
				// npayToken
				var npayToken = getParaVal('npayToken');
				getCardLinkUrl(vl.mOnlineAttr,'npayToken',npayToken);
				getCardLinkUrl(vl.pcOnlineAttr,'npayToken',npayToken);
				
				cardDetailVo.push(vl);
				
				if(vl.mOnline == 'N'){
					if(vl.mSimple == 'Y'){
						$("#mSimpleCardApplyBtn").removeClass('lightgray').addClass('blue');
					}
				}
				if(vl.pcOnline == 'N'){
					if(vl.pcSimple == 'Y'){
						$("#pcSimpleCardApplyBtn").removeClass('lightgray').addClass('blue');
					}
				}
				
			}			
			
			// 링크 파라미터 연결
			function getCardLinkUrl(attr, param, paraVal) {
				if (document.URL.indexOf(paraVal) > -1 || param == 'pageId') {
					var linkUrl = attr['data-move-url'];
					paraVal = (paraVal == null) ? '' : paraVal;
					if (!_.isEmpty(linkUrl)) {
						if (linkUrl.indexOf(param)>-1) {
							var linkUrlIdx = linkUrl.indexOf(param);
							var linkUrlKey = linkUrl.substring(linkUrlIdx, 9999);
							var linkUrlEnd = linkUrlKey.indexOf('&') > -1 ? linkUrlKey.indexOf('&') : 9999;
							var linkUrlBefore = linkUrl.substring(0, linkUrlIdx-1);
							var linkUrlAfter = linkUrlKey.substring(linkUrlEnd, 9999);
							var linkUrlTmp = linkUrlBefore + linkUrlAfter;
							var chain = (linkUrlTmp.indexOf('?') > -1) ? '&' : '?';
							linkUrl = linkUrlTmp + chain + param + '=' + paraVal;
						} else {
							var chain = (linkUrl.indexOf('?') > -1) ? '&' : '?';
							linkUrl = linkUrl + chain + param + '=' + paraVal;
						}
					}
					attr['data-move-url'] = linkUrl;
				}
			}
			
			// 존재하는 파라미터 값 교체
			function getInputParam(attr, inParam, outParam, plusIdx) {
				var paraOrign = document.URL;
				if (paraOrign.indexOf(inParam) > -1) {
					var idxN1 = paraOrign.indexOf(inParam) + plusIdx;
					var EntryLoc1 = paraOrign.substring(idxN1, 9999);
					var endStr1 = (EntryLoc1.indexOf('&') > -1) ? EntryLoc1.indexOf('&') : 9999;
					EntryLoc1 = EntryLoc1.substring(0, endStr1);
					var link1 = attr['data-move-url'];
					
					var outParamIdx = outParam+'=';
					if (!_.isEmpty(link1) && link1.indexOf(outParamIdx) > -1) {
						var link1Idx = link1.indexOf(outParam);
						var link1Entry = link1.substring(link1Idx, 9999);
						var link1End = (link1Entry.indexOf('&') > -1) ? link1Entry.indexOf('&') : 9999;
						link1Entry = link1Entry.substring(0, link1End);
						link1 = link1.replace(link1Entry, outParamIdx + EntryLoc1);
						attr['data-move-url'] = link1;
					}else{
						attr['data-move-url'] = '';
					}
				}
			}
			
			function getChangeParam(orignUrl, inParam, outParam){
				var changeUrl = orignUrl;
				if (orignUrl.indexOf(inParam) > -1) {
					
					var pmIdx = orignUrl.indexOf(inParam);
					var pm = orignUrl.substring(pmIdx, 9999);
					var pmEnd = (pm.indexOf('&') > -1) ? pm.indexOf('&') : 9999;
					pm = pm.substring(0, pmEnd);
					changeUrl = orignUrl.replace(pm, inParam+'='+outParam);
					
				}
				
				return changeUrl;
			}
		});
		
		// 디자인 카드
		$svc.plugin('cmmDesignCard', function($param,$close) {
			
			//-----------------------------------------------------------
			//view binding variable
			//-----------------------------------------------------------
			designCardVo = $svc.bind({name:'cmmDesignCard', plugin: true});
			//-----------------------------------------------------------
			//local variable
			//-----------------------------------------------------------
			var http = $svc.get('http');
			var vl = {};
			var on = designCardVo.event();
			
			//-----------------------------------------------------------
			//view initialize
			//-----------------------------------------------------------
			designCardVo.render(function() {
				$log('cmmDesignCard init', $param);				
			});
			
			//-----------------------------------------------------------
			//event binding
			//-----------------------------------------------------------
			on.openBenefitPopup = function(benefitUrl, pageId) {
				$svc.get('popup').open({name: 'cardBenefit', param: {url: benefitUrl, pageId: pageId}}).then(function() {
					$log('popup Open');
				});
			}
			
			on.movePage = function(moveUrl) {
				var empSeq = getParaVal('empSeq');
				
				// MOBILE일 경우 카드신청 URL에 모집인코드 500 추가
				if (deviceInfo.mobile) {	
					empSeq = (_.isEmpty(empSeq)) ? '500' : empSeq;					
				}				
				moveUrl = getCardLinkUrlAddParam(moveUrl, 'empSeq', empSeq);
				
//				$svc.get('location').go(moveUrl);
				location.href = moveUrl;
			}
		});
		
		$svc.popup('cardBenefit', function($param, $close) {
			var name="cardBenefit";
			var vo = $svc.bind({name: name, url: '/mob/cmm/MOBFMCARD/cardBenefitPopup.ahtml'});
			var on = vo.event();
			
			on.close = function() {
				$close();
			}
			
			vo.render(function() {
				$log('popup init', $param);
				$svc.get('ajax').html($param.url)
				.then(function(data) {
					vo.push({ wcms: { html: data } });										
					getCardDetailInfo({pageId: $param.pageId, popup: 'Y'});
					ui.layerComm.open();					
				});
			});
		});
		
		// 캐릭터카드
		$svc.plugin('cmsCardInfoBind', function($param, $close) {
			//-----------------------------------------------------------
			//view binding variable
			//-----------------------------------------------------------
			var vo = $svc.bind({name:'cmsCardInfoBind', plugin: true});
			
			//-----------------------------------------------------------
			//local variable
			//-----------------------------------------------------------
			var vl = {};
			var lc = {};
			var on = vo.event();
			
			//-----------------------------------------------------------
			//view initialize
			//-----------------------------------------------------------
			vo.render(function() {
				$log('cmsCardInfoBind init', $param);
				
				init();
			});
			
			//-----------------------------------------------------------
			//event binding
			//-----------------------------------------------------------
			
			
			//-----------------------------------------------------------
			//local function
			//-----------------------------------------------------------
			function init() {
				loadTotalCardList()
				.then(function() {
					lc.pageIds = $param.pageIds;
					getCardInfo(lc.pageIds);
				});
			}			
							
			function getCardInfo(pageIds) {
				_.each(pageIds, function(v,i) {
					var result = _.find(window.cardList, function(d) { return v === d.hpgCrdPdId });
					if (result) {
						vl['cardName'+(i+1)] = result.hpgCrdPdNm;
						vl['cardDesc'+(i+1)] = result.hpgCrdPdSmrTt;
						vl['cardAttr'+(i+1)] = {href : result.hpgCrdPdUrlAr};
						
					}else{
						vl['cardName'+(i+1)] = '';
						vl['cardDesc'+(i+1)] = '';
						vl['cardAttr'+(i+1)] = {href : ''};
					}
				});
				vo.push(vl);
			}
		});
		
		// 카드찾기 팝업
		$svc.popup('cardSearchPopUp', function($param,$close) {
			//-----------------------------------------------------------
			//view binding variable
			//-----------------------------------------------------------
			var cardSearchPopUpVo = $svc.bind({name:'cardSearchPopUp', url: '/mob/cmm/MOBFMCARD/cardSearchPopup.ahtml'});
			
			//-----------------------------------------------------------
			//local variable
			//-----------------------------------------------------------
			var http = $svc.get('http');
			var util = $svc.get('util');
			var popup = $svc.get('popup');
			var vl = {};
			var lc = {};
			var on = cardSearchPopUpVo.event();
			var $view = cardSearchPopUpVo.$view;
			
			vl.isY = 'Y';
			lc.search = {};
			lc.searchResultItems = [];			
			
			//-----------------------------------------------------------
			//view initialize
			//-----------------------------------------------------------
			cardSearchPopUpVo.render(function() {
				$log('cardSearchPopUpVo init', $param);

				init();
				
				var focusKeyword = $param.focusKeyword||false;
				if(focusKeyword) setTimeout(function(){$view.find('input[type="text"].input-search-addr').focus();},500);
			});
			
			on.addBenefit = function(e) {
				$log('addBenefit');
				if($view.find("input[name='benefitDetail']:checked").length > 5){
					$(e.currentTarget).prop("checked", false);
				}
			}
			
			on.removeKeyword = function(e) {
				e.stopPropagation();
				$view.find("#keyword").val('');
				cardSearchPopUpVo.focus('keyword');
			}
			
			on.dataInit = function() {
				vl.search.keyword = '';
				vl.search.page = '1';
				vl.search.size = '500';
				vl.search.annualFeeMin = '0';
				vl.search.annualFeeMax = '55000';
				vl.search.benefitDetail = '';
				
				dataReset();
			}
			
			on.searchResult = function() {
				getSearchRequestData();
			}
			
			//-----------------------------------------------------------
			//local function
			//-----------------------------------------------------------
			function init() {
				lc.totalCardList = $param.cardList;
				initSearchParam();
			}
			
			function getSearchRequestData() {
				var data = cardSearchPopUpVo.pull();
				$log('data :' + JSON.stringify(data.search));
				lc.search = data.search;
				
				vl.search.page = '1';
				
				//keyword
				vl.search.keyword = lc.search.keyword||'';
				
				// annualFee
				vl.search.annualFeeMin = '';
				vl.search.annualFeeMax = '';
				
				if(vl.search.cardType != '2'){
					vl.search.annualFeeMin = lc.search.annualFeeMin;
					vl.search.annualFeeMax = '';
					// 5만원 초과인 경우 검색엔진에 max값 보내지 않음
					var annualFeeMax = lc.search.annualFeeMax;
					if (annualFeeMax != '55000') {
						vl.search.annualFeeMax = annualFeeMax;
					}
				}
				
				// benefitDetail
				vl.search.benefitDetail = '';
				vl.search.benefitDetailTitle = [];
				_.each(lc.search.benefitDetail, function(v,i){
					if(i == 0) vl.search.benefitDetail = v;
					else vl.search.benefitDetail += "^" + v;
					
					$view.find("input[name='benefitDetail']").each(function(){
						var benefit = $(this).val();
						
						if(v == benefit){
							vl.search.benefitDetailTitle.push({title:$(this).attr('data-name')});
						}
					});
				});

				searchCardListByFilter();
			}
			
			// 검색엔진 필터조회
			function searchCardListByFilter() {
				$log('검색엔진 request : ', vl.search);
				lc.searchResultItems = [];
				vl.search.dataSet = 'N';
				
				http.json('/mob/MOBFM004N/MOBFM004R22.ajax', vl.search, 'not').then(function(rsHttp) {
					$log('rsHttp : ', rsHttp.cardFinderSearch);
					var cardFinderSearch = rsHttp.cardFinderSearch;
					if (cardFinderSearch && cardFinderSearch.code == '200') {
						lc.searchResultItems = cardFinderSearch.list;																
					}
					
					getCardFindResultList();
				});
			}
			
			// 필터결과 카드목록
			function getCardFindResultList() {
				vl.cardSearchList = [];
				_.each(lc.totalCardList, function(v,i) {
					var result = _.find(lc.searchResultItems, function(d) { return d.seq == v.hpgCrdPdId });
					if (result) {
						vl.cardSearchList.push(v);
					}
				});
				
				$close(vl);
			}
			
			function dataReset() {
				// 키워드
				$view.find("#keyword").val(vl.search.keyword);
				
				// 연회비
				if(vl.search.cardType == '2'){
					$view.find("#annualFeeTitle").hide();
					$view.find("#annualFeeTxt").hide();
					$view.find("#annualFee").hide();
				}else{
					$view.find(".gauge-start-value").val(vl.search.annualFeeMin);
					$view.find(".gauge-end-value").val(vl.search.annualFeeMax);
					$(function(){setMultiGauge('annualFee');});
				}
				
				// 카드 혜택
				$view.find("input[name='benefitDetail']").prop("checked", false);
				
				if(vl.search.benefitDetail != ''){
					var arryBenefitDetail = (vl.search.benefitDetail).split("^");
					for(var i=0; i < arryBenefitDetail.length; i++) {
						var benefitDetail = arryBenefitDetail[i];
						
						$view.find("input[name='benefitDetail']").each(function(){
							var benefit = $(this).val();
							
							if(benefitDetail == benefit){
								$(this).prop("checked",true);
							}
						});
					}
				}
			}
			
			function initSearchParam() {
				vl.search = $param.search || {};
				if(!vl.search.keyword) vl.search.keyword = '';
				if(!vl.search.cardType) vl.search.cardType = '';
				if(!vl.search.annualFeeMin) vl.search.annualFeeMin = '0';
				if(!vl.search.annualFeeMax) vl.search.annualFeeMax = '55000';
				if(!vl.search.benefitDetail) vl.search.benefitDetail = '';
				
				vl.search.page = '1';
				vl.search.size = '500';
				vl.title = $param.title||'';
				if(vl.title != "") vl.title += " 상세 검색";
				else vl.title = "카드 상세 검색";
				
				$view.find("#title").text(vl.title);

				// cardType 1:신용, 2:체크
				// 체크인경우만 청소년은 노출한다.
				if(vl.search.cardType != '2') $view.find("#benefitDetail24").closest("li").hide();
				
				dataReset();
			}
			
		});
		
		//문화센터/가맹점 조회 팝업
		$svc.plugin('centerPop', function($param, $close) {
			//-----------------------------------------------------------
			//view binding variable
			//-----------------------------------------------------------
			var vo = $svc.bind({name:'MOBFM281P02', plugin: true, url: '/mob/MOBFM281N/MOBFM281P02.ahtml'});
		    //-----------------------------------------------------------
			//local variable
			//-----------------------------------------------------------
			var http = $svc.get('http');
			var on = vo.event();
			var page = 1;
			
			var tempSearchVal = '';
			
			/*
			 * franchiseeData.resultCode
			 * 0000 : 검색성공 
			 * 0001 : 가맹점명/가맹점간판명/가맹점주소 선택하지 않음
			 * 0002 : 검색어 입력하지 않음
			 * 0003 : 검색결과 가맹점 없음
			 */
			var franchiseeData = {resultCode : '', franchiseeList : [], hasMoreData : ''};
			//-----------------------------------------------------------
			//view initialize
			//-----------------------------------------------------------
			vo.render(function() {
				$log('centerPop init', $param);
				init();
				// 지정된 파라미터를 받는 이동인 경우 팝업 표시
				$param.callBackPop();
			});
		    //-----------------------------------------------------------
			//event binding
			//-----------------------------------------------------------
		    on.searchFranchisee = function(e) {
		    	getFranchiseeSearchData(e);
			}
		    on.getMoreFranchisee = function(e) {
		    	getMoreFranchiseeSearchData(e);
		    	//ui.moreAccess.action();
		    }
			//-----------------------------------------------------------
			//local function
			//-----------------------------------------------------------
		    function init() {
		    	franchiseeData = {franchiseeList : [], resultCode : '0002'};
    			vo.push({
    				franchiseeData: franchiseeData
				});
		    }
		    function getValidatedInput(e) {
		    	var data = {
		    		searchOption : $('#center_pop').find('select[name=searchOption]').val(),
		    		searchVal : tempSearchVal
		    	};
		    	if ( data.searchOption == '0' || data.searchOption == '' ) {
		    		franchiseeData = {franchiseeList : [], resultCode : '0001', hasMoreData : 'N'};
		    		vo.push({
	    				franchiseeData: franchiseeData
					});
		            return false;
		    	} else {
		    		if ( data.searchVal == '' ) {
		    			franchiseeData = {franchiseeList : [], resultCode : '0002', hasMoreData : 'N'};
		    			vo.push({
		    				franchiseeData: franchiseeData
						});
		    			return false;
		    		}
		    	}
		    	return data;
		    };
		    
		    function getFranchiseeSearchData(e) {
		    	page = 1;
		    	tempSearchVal = $('#center_pop').find('input[name=searchVal]').val();
		    	var data;
		    	if ( !(data = getValidatedInput(e)) ) {
		    		return;
		    	}
		    	data.page = page;
		    	http.json('/mob/MOBFM281N/MOBFM281P01.ajax', data)
				.then(function(rsHttp) {
					if(!rsHttp) return;
					if(rsHttp.mbw_result == "Y") {
						
						var franchiseeList = getFranchiseeList(rsHttp);
						franchiseeData.franchiseeList = franchiseeList;
						franchiseeData.resultCode = franchiseeList.length == 0 ? '0003' : '0000';
						franchiseeData.hasMoreData = (rsHttp.total - franchiseeData.franchiseeList.length) > 0 ? 'Y' : 'N';
						vo.push({
							franchiseeData: franchiseeData
						});
					}
				});	
		    };
		    
		    function getMoreFranchiseeSearchData(e) {
		    	var data;
		    	if ( !(data = getValidatedInput(e)) ) {
		    		return;
		    	}
		    	data.page = ++page;
		    	http.json('/mob/MOBFM281N/MOBFM281P01.ajax', data)
				.then(function(rsHttp) {
					if(!rsHttp) return;
					if(rsHttp.mbw_result == "Y") {
						
						var franchiseeList = getFranchiseeList(rsHttp);
						franchiseeData.franchiseeList = franchiseeData.franchiseeList.concat(franchiseeList);
						franchiseeData.resultCode = '0000';
						franchiseeData.hasMoreData = (rsHttp.total - franchiseeData.franchiseeList.length) > 0 ? 'Y' : 'N';
						vo.push({
							franchiseeData: franchiseeData
						});
					}
				});	
		    };
		    
		    function getFranchiseeList(rsHttp) {
		    	var len = rsHttp.mchtNm ? rsHttp.mchtNm.length : 0;
		    	var franchiseeList = [];
				for ( var i = 0; i < len; i++ ) {
					var franchisee = {
							devonindex : rsHttp.devonindex[i],
							addr : rsHttp.addr[i],
							bsnN : rsHttp.bsnN[i],
							mchtHmpUrl : rsHttp.mchtHmpUrl[i],
							mchtMmTxt : rsHttp.mchtMmTxt[i],
							mchtN : rsHttp.mchtN[i],
							mchtNm : rsHttp.mchtNm[i],
							telnum : rsHttp.telnum[i]
					};
					if ( !rsHttp.mchtRlSsgnNm[i] || rsHttp.mchtRlSsgnNm[i] == '' ) {
						franchisee.mchtRlSsgnNm = rsHttp.mchtNm[i];
					} else {
						franchisee.mchtRlSsgnNm = rsHttp.mchtRlSsgnNm[i];
					}
					franchiseeList.push(franchisee);
				}
				return franchiseeList;
		    }
		});
		
		//쁘띠엘린 할인(레이디카드 고객) 조회 팝업
		$svc.plugin('petitOnlinePop', function($param, $close) {
			//-----------------------------------------------------------
			//view binding variable
			//-----------------------------------------------------------
		    var vo = $svc.bind({name:'MOBFM281P03', plugin: true , url: '/mob/MOBFM281N/MOBFM281P03.ahtml'});
		    //-----------------------------------------------------------
			//local variable
			//-----------------------------------------------------------
			var http = $svc.get('http');
			var incaNos = $svc.get('incaNos');
			var on = vo.event();
			var lc = {
				lampObj: {
					fixed: ['cardnum'],
					valid: function(isValid) {
						$('#petitConfirmBtn').prop('disabled', !isValid);
					}
				}
			};
			//-----------------------------------------------------------
			//view initialize
			//-----------------------------------------------------------
			vo.render(function() {
				incaNos.init(document.ladyOnlineForm);
				$log('petitOnlinePop init', $param);
			});
		    //-----------------------------------------------------------
			//event binding
			//-----------------------------------------------------------
		    on.send = function() {
		    	var param = vo.pull();
		    	
		        if( incaNos.dashLen(param.cardnum) < 15 ) {
		            $svc.get('popup').alert('카드번호는 15자리 이상 입력하세요.');
		            return vo.lamp('cardnum', $.extend({ text : '카드번호를 자릿수를 확인해 주세요.' }, lc.lampObj));
		        }
		        incaNos.encrypted('#petitOnlineForm', param);

		        http.submit('/mob/MOBFM281N/MOBFM281P02.ajax', param).then(function(rsHttp) {
					if( !rsHttp ) return;
					$log('MOBFM281P02 rsHttp : ', rsHttp);
					var msg = rsHttp.bodyData.msg;
					if( msg.length > 0 ) {  
						$svc.get('popup').alert(msg.replace('/<br>/gi','\n'));
						return;
					} else {  
						//쁘띠엘린으로 서브밋 
						pettitSubmit();
					}
				}, function(error) {
					$log('error : ', error);
				});
		    }
			//-----------------------------------------------------------
			//local function
			//-----------------------------------------------------------
		    function pettitSubmit() {
		    	var petitelinForm = document.petitelinForm;
		    	petitelinForm.target="_blank";
		    	petitelinForm.submit();
		    }
		    vo.watch('cardnum', function(v,a) {
				v = $("#cardnum").val();
				if (!v || incaNos.dashLen(v) === 0) {
					return vo.lamp('cardnum', $.extend({text :'카드번호는 필수입니다.'}, lc.lampObj));
				} else if (incaNos.dashLen(v) < 15) {
					return vo.lamp('cardnum', $.extend({text :'카드번호 자릿수를 확인해주세요.'}, lc.lampObj));
				}
				return vo.lamp('cardnum', lc.lampObj , true);
			});
		});
		
		//주차장 지도 팝업
		$svc.plugin('parkingMapPop', function($param, $close) {
			//-----------------------------------------------------------
			//view binding variable
			//-----------------------------------------------------------
		    var vo = $svc.bind({name:'MOBFM281P01', plugin: true , url: '/mob/MOBFM281N/MOBFM281P01.ahtml'});
		    //-----------------------------------------------------------
			//local variable
			//-----------------------------------------------------------
			var http = $svc.get('http');
			var on = vo.event();
			//-----------------------------------------------------------
			//view initialize
			//-----------------------------------------------------------
			vo.render(function() {				
				$log('parkingMapPop init', $param);
			});
		    //-----------------------------------------------------------
			//event binding
			//-----------------------------------------------------------
		    
			//-----------------------------------------------------------
			//local function
			//-----------------------------------------------------------
		});
		
		var getCardList = function($param) {
			$svc.get('plugin').load({name: 'cmmCardList', param: $param});			
		}
		
		var getCardDetailInfo = function($param) {
			$svc.get('plugin').load({name: 'cmmCardDetail', param: $param});
		}
		
		var getSimpleSearchResult = function($param) {
			$param = { listId: 'simpleSearch', type: '1', pageIds: $param.pageIds };
			$svc.get('plugin').load({name: 'cmmCardList', param: $param});
		}
		
		var getCardFindCardList = function($param) {
			$svc.get('plugin').load({name: 'cardFind', param: $param});
		}
		
		var getCmsCardInfoList = function($param) {
			$svc.get('plugin').load({name: 'cmsCardInfoBind', param: $param});
		}
		
		var loadDesignCard = function($param) {
			$svc.get('plugin').load({name: 'cmmDesignCard', param: $param});
		}			
		
		var loadCardInfoByPageId = function(pageId) {
			var df = $.Deferred();
			loadTotalCardList()
			.then(function() {			
				var result = _.find(window.cardList, function(v) { return pageId === v.hpgCrdPdId });
				df.resolve(result);				
			})
			.fail(function() {
				df.reject(e);
			})
			return df.promise();
		}
		
		var loadPageIdsByListId = function(listId) {
			var df = $.Deferred();
			$svc.get('http').html('/logic/json/cardlist_data.json')
			.then(function(data) {
				$log('ctgSceInfo : ', data.ctgSceInfo);
				
				if (!data && !data.ctgSceInfo) {
					return;
				}
				
				window.cardListIdList = data.ctgSceInfo;
				var result = _.find(data.ctgSceInfo, function(v) { return listId === v.hpgCrdCtgSceId });
				var pageIds = [];
				if (result) {
					_.each(result.ctgSceSnInfo, function(v,i) {
						if (v.hpgCrdCtgCrdPdSeF === 'Y') {
							pageIds.push(v.hpgCrdPdId);
						}
					});
					df.resolve(pageIds);
				} else {
					df.reject();
				}								
			})
			.fail(function(e) {
				df.reject(e);				
			})
			
			return df.promise();
		}
		
		var loadTotalCardList = function() {
			var df = $.Deferred();
			var cardInfo = $svc.get('http').html('/logic/json/cardinfo_data.json');
			var cardLinkInfo = $svc.get('http').html('/pconts/json/cardLinkList.json');
			
			$svc.get('util').promiseAll([cardInfo, cardLinkInfo])
			.then(function(data) {
				$log('promise data :', data);
				window.cardInfoList = data[0].cardInfo;
				window.cardLinkList = data[1].cardLinkList;
				
				var cardList = [];				
				_.each(window.cardInfoList, function(v,i) {
					if (v.hpgCrdPdSeF === 'Y') {
						var result = _.find(window.cardLinkList, function(d) { return v.hpgCrdPdId === d.hpgCrdPdId });
						v['cardLink'] = result;
						cardList.push(v);
					}
				});
				
				window.cardList = cardList;
				df.resolve();
			})
			.fail(function(e) {
				df.reject();
			})
			
			return df.promise();
		}
		
		var loadCardList = function() {
			if (window.cardList) {
				var r = $.Deferred();
				r.resolve();
				return r.promise();
			} else {
				return loadTotalCardList();
			}
		}
		
		var setItem = function() {
			localStorage.setItem('cardCompare', JSON.stringify(cardComparePageIds));
		}
		
		var getCenterPop = function($param) {
			$param = $param ? $param : {};
			var callBackPop = function() {
				var inHref = unescape(location.href);
				var params = (inHref.slice(inHref.indexOf('?') + 1, inHref.length)).split('&');
				
				for ( var i = 0; i < params.length; i++ ) {
					var paramName = params[i].split('=')[0];
					var paramVal = params[i].split('=')[1];
					if ( !paramName || !paramVal ) {
						continue;
					}
					if ( paramName == 'from' && paramVal == 'pop' ) {
						popOpen('#center_pop');
						break;
					}
				}
			}
			$param.callBackPop = callBackPop;
			$svc.get('plugin').load({name: 'centerPop', param: $param});
		}
		 
		var getPetitOnlinePop = function($param) {
			$svc.get('plugin').load({name: 'petitOnlinePop', param: $param});
		}
		
		var getParkingMapPop = function($param) {
			$svc.get('plugin').load({name:'parkingMapPop', param: $param});
		}
		
		return {
			getCardList : getCardList,											// listId로 카드목록 조회
			getCardDetailInfo : getCardDetailInfo,							// 카드상세
			getSimpleSearchResult : getSimpleSearchResult,			// 간단찾기 결과 카드목록 조회
			getCardFindCardList : getCardFindCardList,					// 찾아드림
			getCmsCardInfoList : getCmsCardInfoList,					// 캐릭터카드(CMS에서 정의된 카드에 카드명 등 카드정보 매핑)
			loadDesignCard : loadDesignCard,								// 디자인카드(혜택보기)
			loadCardInfoByPageId : loadCardInfoByPageId,			// pageId로 해당 카드정보 조회
			loadPageIdsByListId : loadPageIdsByListId,					// listId로 해당 카드목록 및 카드정보 조회
			loadTotalCardList : loadTotalCardList,							// 전체 카드목록정보 조회
			loadCardList : loadCardList,										// 카드목록 존재 여부 확인 후 없으면 전체 카드목록 조회
			setItem : setItem,														// 카드비교함 - localStorage에 비교대상 카드 pageId 저장
			getCenterPop : getCenterPop,									// 문화센터/가맹점 찾기 팝업
			getPetitOnlinePop : getPetitOnlinePop, 						// 온라인매장 할인 팝업
			getParkingMapPop : getParkingMapPop						// 주차장 팝업
		}
	});
})();