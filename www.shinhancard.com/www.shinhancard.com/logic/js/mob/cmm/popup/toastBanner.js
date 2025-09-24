/**
* @description 
* @author 강환성
* @version 1.0
* @since 2020.12.07
*/
(function () {

$svc.popup('toastBanner', function ($param, $close) {
	var vo=$svc.bind({name:'toastBanner',url:'/mob/cmm/COMMON/toastBanner.ahtml'}); 
	var on=vo.event();

	vo.render(function() {
		// 배너 리스트 그리기
		$svc.get('util').promiseAll(bannerRender())
		.then(function() {
			// 스와이퍼 재생
			swiperStart();
		});
	});

	//
	// == inner function == //
	function swiperStart() {
		if($('#tostSwiper1').find('.swiper-slide').length>1){
			var tostSwiper1 = new Swiper('#tostSwiper1 .swiper-container', {
				autoplay: {
					delay: 4000,
					disableOnInteraction: false,
				},
				loop: true,
				slidesPerView: 1,
				autoHeight:true,
				navigation: {
					nextEl: '#tostSwiper1 .nav-button-next',
					prevEl: '#tostSwiper1 .nav-button-prev',
				},
				pagination: {
					el: '#tostSwiper1 .swiper-pagination',
					type: 'fraction',
				}
			});

			// 스와이퍼 재생,일시정지 버튼
			var $btnPause = $('#tostSwiper1 .swiper-button-pause');
			var $btnStart = $('#tostSwiper1 .swiper-button-play');
			$btnStart.hide();
			$btnPause.click(function() {
				tostSwiper1.autoplay.stop();
				$btnPause.hide();
				$btnStart.show();
			});
			$btnStart.click(function() {
				tostSwiper1.autoplay.start();
				$btnPause.show();
				$btnStart.hide();
			})
		}else{
			$('.swiper-controls').hide();
			$('.nav-button-prev').hide();
			$('.nav-button-next').hide();
		}
	}

	function bannerRender() {
		return _.map(getTargetItems(), function(vl) {
			var each = bannerItem(vl);

			if(each.hpgBnnFcd == '2' && each.hpgBnnHtmlUrlAr)
				return appendHtmlBanner(each);
			else if(each.hpgBnnFcd == '1' && each.hpgBnnImgPhNm)
				return appendImageBanner(each);
			else return emptiyBanner();
		});

		//
		// == inner function == //
		function emptiyBanner() {
			var df = $.Deferred();
			setTimeout(function() { df.resolve() }, 1);
			return df.promise();
		}
		function addRow() {
			var li = getWrapper().appendChild(document.createElement('li'));
			return $(li).addClass('swiper-slide');
		}

		function appendImageBanner(arg) {
			var df = $.Deferred();
			var $li = addRow();

			setTimeout(function() {
				$li.html([
					'<a href="'+ arg.hpgBnnMovUrlAr +'" class="s-item" style="'+ arg.style +'">',
						'<div class="text-sec">',
							'<div class="s-tit1">'+ arg.hpgBnnTilNm +'</div>',
							'<div class="s-txt1">'+ arg.hpgBnnSmrTt +'</div>',
							'<span class="tost1-btn">바로가기</span>',
						'</div>',
						'<div class="img-sec">',
						'<img src="'+ arg.hpgBnnImgPhNm +'" alt="'+ arg.hpgBnnImgRplChaVl +'">',
						'</div>',
					'</a>',
				].join(''));

				df.resolve();
			}, 100);
			return df.promise();
		}
		function appendHtmlBanner(arg) {
			var $li = addRow();
			return $svc.get('http').html(arg.hpgBnnHtmlUrlAr)
			.then(function(text) {
				$li.append(text);
			});
		}
		function bannerItem(arg) {
			var result = {};
			result.hpgBnnMovUrlAr = arg.hpgBnnMovUrlAr.trim() || '#';
			result.style = 'background-color:' + (arg.hpgBnnBgrOloVl.trim() || '#000');
			result.hpgBnnTilNm = arg.hpgBnnTilNm.trim();
			result.hpgBnnSmrTt = arg.hpgBnnSmrTt.trim();
			result.hpgBnnImgRplChaVl = arg.hpgBnnImgRplChaVl.trim();
			result.hpgBnnImgPhNm = arg.hpgBnnImgPhNm.trim();
			result.hpgBnnHtmlUrlAr = arg.hpgBnnHtmlUrlAr.trim();
			result.hpgBnnFcd = arg.hpgBnnFcd.trim();
			return result;
		}
		function getTargetItems() {
			var targets = $menu.toastBnn.targets;
			var datas = $menu.toastBnn.datas;
			return _.map(targets[$param.menuId], function(vl) {
				return datas[vl];
			});
		}
	}
	function getWrapper() {
		return document.querySelector('#tostSwiper1 .swiper-wrapper');
	}
});

})(window);
