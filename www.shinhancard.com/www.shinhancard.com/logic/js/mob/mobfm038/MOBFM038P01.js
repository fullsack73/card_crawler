/** 
* @description 카드비교함
* @author S04675
* @version 1.0
* @since 2016.02.13
*/

;(function() {
	$svc.popup('MOBFM038P01', function($param, $close) {
		var vo    = $svc.bind({name:'MOBFM038P01', url: '/mob/MOBFM038N/MOBFM038P01.ahtml'});
		var on 	  = vo.event();
		var lc    = {};
		var vl    = {};
		
		vo.render(function(){
			$log('############# MOBFM038P01 render ###############');
			$log('$param', $param);
			
			lc.list = $param['list'];
			
			init();
		});
		
		on.close = function() {
			$close();
		};
		
		function init() {
			var o1 		 = _.clone(_.find(window.cardList, function(v, k) { return 0 == v['hpgCrdPdId'].indexOf(lc.list[0]); } ));
			var o2 		 = _.clone(_.find(window.cardList, function(v, k) { return 0 == v['hpgCrdPdId'].indexOf(lc.list[1]); } ));
			var s  		 = '';
			var afeMin1	 = '';
			var afeMax1	 = '';
			var afeMin2	 = '';
			var afeMax2	 = '';
			var svc1		 = '';
			var svc2		 = '';
			var svcCode1 = '';
			var svcCode2 = '';
			var addInfo1 = false;
			var addInfo2 = false;
			var addInfo3 = false;
			var addInfo4 = false;
			var addInfo5 = false;
			var addInfo6 = false;
			
			vl.o1 = o1;
			vl.o2 = o2;
			
			vl.img1 = {src: o1['imgInfo'][0]['hpgCrdPdCrdImgUrlAr']};
			vl.img2 = {src: o2['imgInfo'][0]['hpgCrdPdCrdImgUrlAr']};
			
			if(o1['imgInfo'][0]['hpgCrdPdImgFrmF'] === 'Y') {
				$('#img1').closest('div').addClass('vertical');
			}
			
			if(o2['imgInfo'][0]['hpgCrdPdImgFrmF'] === 'Y') {
				$('#img2').closest('div').addClass('vertical');
			}
			
			/*vl.viewUrl1 = {href: o1['viewUrl'] || '#'};
			vl.viewUrl2 = {href: o2['viewUrl'] || '#'};*/
			
			vl.url1 = {href: o1['hpgCrdPdUrlAr']};
			vl.url2 = {href: o2['hpgCrdPdUrlAr']};
			
			//연회비
			o1.afeInfoText = afeList(o1);
			o2.afeInfoText = afeList(o2);
			
			if(o1.afeInfoText || o2.afeInfoText) {
				addInfo1 = true;
			}
			
			//혜택유형
			if(o1['hpgCrdPdBnfTcd'] == "1") {
				o1.bnTypeVal = "적립형";
			} else if(o1['hpgCrdPdBnfTcd'] == "2") {
				o1.bnTypeVal = "할인형";
			} else if(o1['hpgCrdPdBnfTcd'] == "3") {
				o1.bnTypeVal = "마일리지";
			}
			
			if(o2['hpgCrdPdBnfTcd'] == "1") {
				o2.bnTypeVal = "적립형";
			} else if(o2['hpgCrdPdBnfTcd'] == "2") {
				o2.bnTypeVal = "할인형";
			} else if(o1['hpgCrdPdBnfTcd'] == "3") {
				o2.bnTypeVal = "마일리지";
			}
			
			if(o2.bnTypeVal || o2.bnTypeVal) {
				addInfo2 = true;
			}
			
			//주요혜택
			o1['svcInfo'].forEach(function(val) {
				svc1 += '<li>'+val['hpgCrdPdSvTpNm']+' '+val['hpgCrdPdSvTpTt']+'</li>';
			})
			
			o2['svcInfo'].forEach(function(val) {
				svc2 += '<li>'+val['hpgCrdPdSvTpNm']+' '+val['hpgCrdPdSvTpTt']+'</li>';
			})
			
			if(svc1 || svc2) {
				o1.svc = svc1;
				o2.svc = svc2;
				addInfo3 = true;
			}
			
			//혜택특성
			svcCode1 = svcCodeList(o1);
			svcCode2 = svcCodeList(o2);
			
			if(svcCode1 || svcCode2) {
				vl.svcCode1 = svcCode1;
				vl.svcCode2 = svcCode2;
				addInfo4 = true;
			}

			vo.push(vl);
			
			$('#MOBFM038R0101_tr_01').show();
			if(!addInfo1){$('.MOBFM038P01_list_01').remove()};
			if(!addInfo2){$('.MOBFM038P01_list_02').remove()};
			if(!addInfo3){$('.MOBFM038P01_list_03').remove()};
			if(!addInfo4){$('.MOBFM038P01_list_04').remove()};
		}
		
		function afeList(o) {
		    var afeMin = '';
		    var afeMax = '';
	    	var afeInfoText = '';

		    o['afeInfo'].forEach(function(afeInfo) {
		        var price = '';

		        if(afeInfo['hpgCrdPdWlAfeGuaTt'] == '없음') {
		            price = 0;
		        } else {
		            price = afeInfo['hpgCrdPdWlAfeGuaTt'].replace(/[^0-9]/g,"");
		        }

		        if(price === ''){
		            return true;
		        }

		        if(afeMin === '' && afeMax === '') {
		            afeMin = price;
		            afeMax = price;
		        } else {
		            if(parseInt(afeMin) > parseInt(price)) {
		                afeMin = price;
		            }
		            if(parseInt(afeMax) < parseInt(price)) {
		                afeMax = price;
		            }
		        }
		    })

		    if(afeMin !== '' && afeMax !== '') {
		        if(parseInt(afeMin) < parseInt(afeMax)) {
		            if(afeMin != 0) {
		            	afeInfoText = (afeMin + '원 ~ ' + afeMax + '원').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
		            } else {
		            	afeInfoText = ('없음 ~ ' + afeMax + '원').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
		            }
		        } else {
		            if(afeMin != 0) {
		            	afeInfoText = (afeMin + '원').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
		            } else {
		            	afeInfoText = ('없음');
		            }
		        }
		    }
		    
		    return afeInfoText;
		}
		
		function svcCodeList(o) {
			var svcCode = '';
			var benefitQuality = o['hpgCrdPdPvSvDescTt'].split(",");
			if (benefitQuality.length > 5) {
				benefitQuality = benefitQuality.slice(0, 5);
			} 
				
			benefitQuality.forEach(function(value){
				switch(value) {
					case "1" :
						svcCode += '<li><span class="item item01">어디서나</span></li>';
						break;
					case "2" :
						svcCode += '<li><span class="item item02">주유</span></li>';
						break;
					case "3" :
						svcCode += '<li><span class="item item03">대형마트</span></li>';
						break;
					case "4" :
						svcCode += '<li><span class="item item04">편의점</span></li>';
						break;
					case "5" :
						svcCode += '<li><span class="item item05">쇼핑</span></li>';
						break;
					case "6" :
						svcCode += '<li><span class="item item06">영화/공연</span></li>';
						break;
					case "7" :
						svcCode += '<li><span class="item item07">외식/배달</span></li>';
						break;
					case "8" :
						svcCode += '<li><span class="item item08">카페/베이커리</span></li>';
						break;
					case "9" :
						svcCode += '<li><span class="item item09">대중교통</span></li>';
						break;
					case "10" :
						svcCode += '<li><span class="item item10">병원/약국</span></li>';
						break;
					case "11" :
						svcCode += '<li><span class="item item11">공과금</span></li>';
						break;
					case "12" :
						svcCode += '<li><span class="item item12">통신/렌탈</span></li>';
						break;
					case "13" :
						svcCode += '<li><span class="item item13">교육/육아</span></li>';
						break;
					case "14" :
						svcCode += '<li><span class="item item14">레저/스포츠</span></li>';
						break;
					case "15" :
						svcCode += '<li><span class="item item15">항공/마일리지</span></li>';
						break;
					case "16" :
						svcCode += '<li><span class="item item16">공항라운지</span></li>';
						break;						
					case "17" :
						svcCode += '<li><span class="item item17">뷰티</span></li>';
						break;						
					case "18" :
						svcCode += '<li><span class="item item18">간편결제</span></li>';
						break;						
					case "19" :
						svcCode += '<li><span class="item item19">구독</span></li>';
						break;						
					case "20" :
						svcCode += '<li><span class="item item20">여행/숙박</span></li>';
						break;						
					case "21" :
						svcCode += '<li><span class="item item21">금융</span></li>';
						break;						
					case "22" :
						svcCode += '<li><span class="item item22">할인</span></li>';
						break;						
					case "23" :
						svcCode += '<li><span class="item item23">적립</span></li>';
						break;						
					case "24" :
						svcCode += '<li><span class="item item24">청소년</span></li>';
						break;						
				}
			});
			
			return svcCode;
		}
	});
})();