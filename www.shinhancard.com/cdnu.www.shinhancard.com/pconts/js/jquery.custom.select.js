var selectJS = {
	enable: true,
	ui_select: '.ui_select', 
	init: function(){
		var self = this;
		$(self.ui_select).find('select').each(function(){
			self.update(this);
		});
	},
	reInit: function(){},
	update: function(obj, callback){

		var self = this;
		var $el = $(obj).closest(self.ui_select);
		var $select = $(obj);
		var $options = $select.find('option');
		var id = null;
		var title = null;
		if(!$select.hasClass('c-select')){
			if ($select.is('[title]') == true && $select.attr('title').length > 0){title = $select.attr('title')}
			if ($select.is('[id]') == true && $select.attr('id').length > 0){id = $select.attr('id')}
			if ($select.closest('.select_wrap').is('[title]') == true && $select.closest('.select_wrap').attr('title').length > 0){title = $select.closest('.select_wrap').attr('title')}
			var isPlaceholder = $select.is('[data-placeholder="true"]');
			var html_select_frame, html_select_inner;
			var lensOptions = $options.length > 0;
			html_select_frame = ''
				+ '<button type="button" class="ui_select_btn" aria-expanded="false" aria-haspopup="listbox"><span class="ui_select_value"></span></button>'
				+ '<div class="ui_select_menu">'
				+ '<div class="ui_select_scr">'
				+ '	<ul class="ui_select_list" role="listbox">'
				+ '	</ul>'
				+ '</div>'
				+ '</div>';
			
			var html_option = '';
			var idx_selected;
			var link = 'javascript:;';
			$options.each(function(i){
				if ($(this).prop('selected')) { idx_selected = i }
				//if ($el.hasClass('ui_select_link')) { link = $(this).val() } 버튼클릭하는걸로 변경
				html_option += '<li role="option" class="ui_select_option"><a href="'+link+'" role="button">'+ $(this).text() +'</a></li>';
			})

			// Init Setting
			if (self.enable == true){ $el.removeClass('is_natived') } else { $el.addClass('is_natived') }
			if ($el.attr('data-enable') == 'true') { $el.removeClass('is_natived') }
			if ($el.attr('data-enable') == 'false') { $el.addClass('is_natived') }
			if ($el.hasClass('set_select') == false || $el.find('.ui_select_menu').length == 0) { $select.before(html_select_frame) }
			//if ($options.length > 0){ $el.find('.ui_select_list').html(html_option);}
			if ($options.length > 0){ $el.find('.ui_select_list').html(html_option)} else { $el.find('.ui_select_value').text('') }
			if ($select.is(':disabled')){ $el.find('.ui_select_btn').addClass('is_disabled').prop('disabled', true);} 
			else { $el.find('.ui_select_btn').removeClass('is_disabled').prop('disabled', false) }
			if (title != null) { $el.find('.ui_select_btn').attr('title', title) } 
			else if ($select.is('[id]') == true && $('label[for='+id+']').length > 0){ $el.find('.ui_select_btn').attr('title', $('label[for='+id+']').text()) }
			// Options Setting
			var $uiOptions = $el.find('.ui_select_list .ui_select_option'); // UI Options Variable
			if (isPlaceholder) { $uiOptions.eq(0).addClass('is_placeholder') } // Placeholder Binding
			if (lensOptions){ $el.find('.ui_select_value').text($options.eq(0).text()) } // Value Binding
			self.selected($uiOptions.eq(idx_selected), $select);
			if (!$('body').hasClass('mobile') && !$('body').hasClass('app_shfan') && $el.hasClass('is_natived') == false) { $select.attr({'aria-hidden':'true', 'tabindex':'-1'}) }
					
			// Scrolling Setting
			var itemH = 41;
			if ($el.is('[data-view]')) { 
				var scrH = $el.attr('data-view') * itemH;
				$el.find('.ui_select_scr').css({'max-height': scrH}) ;
			}
			$el.find('.ui_select_scr').mCustomScrollbar({scrollInertia:300});

			// Ending	
			$el.addClass('set_select');
			self.event($el);
			if (callback) { callback }
		}
	},
	event: function($el){
		var self = this;
		var $uiButton = $el.find('.ui_select_btn');
		var $uiValue = $el.find('.ui_select_value');
		var $uiMenu = $el.find('.ui_select_menu');
		var $uiOptions = $el.find('.ui_select_option');
		var $select = $el.find('select');
		var $label = $('label[for="'+$select.attr('id')+'"]');

		// 버튼 클릭
		$uiButton.not('.is_disabled').off('click.uiSelect').on('click.uiSelect', function(){
			var $btn = $(this);
			$uiMenu.stop().toggle(0, function(){
				if ($(this).is(':visible')){ 
					$btn.attr({'aria-expanded':'true'}); 
					$uiOptions.filter('.is_selected').find('a').trigger('focus');
					$el.addClass('is_active');
					self.direction();
				}
				else if (!$(this).is(':visible')){ 
					$btn.attr({'aria-expanded':'false'}); 
					$uiOptions.removeClass('is_focus');
					$el.removeClass('is_active');
					$el.removeAttr('data-direction');
				}
			});
		})

		// 버튼 포커스
		$uiButton.off('focus.uiSelect').on('focus.uiSelect', function(){
			$(this).addClass('is_focus');
		}).off('blur.uiSelect').on('blur.uiSelect', function(){
			$(this).removeClass('is_focus');
		})

		// 라벨 클릭
		$label.off('click.uiSelect').on('click.uiSelect', function(e){
			e.preventDefault();
			if ($('.btn_tooltip').has(e.target).length > 0) {} else { $uiButton.focus() }
		})

		// 목록 클릭
		$uiOptions.off('click.uiSelect').on('click.uiSelect', function(e){
			$uiMenu.stop().hide();
			$uiOptions.removeClass('is_focus');
			$el.removeClass('is_active');
			$uiButton.focus();
			self.selected($(this), $select);
			$select.trigger('change');
			$el.removeAttr('data-direction');
			if (!$el.hasClass('ui_select_link')) {
				e.preventDefault();
			}
			// (2022 웹접근성 수정) 2022.04.08 마재광 추가 s
			// 셀렉트 박스에서 버튼을 선택 후에도 버튼의 상태값이 확장됨으로 확인
			$uiButton.attr({'aria-expanded':'false'}); 
		});

		// 목록 포커스 인
		$uiOptions.off('focusin.uiSelect').on('focusin.uiSelect', function(e){
			var idx = $(this).index();
			$(this).addClass('is_focus').siblings().removeClass('is_focus');
			//self.selected($(this), $select);
			e.stopPropagation();
		});

		// 목록 포커스 아웃
		$uiOptions.off('focusout.uiSelect').on('focusout.uiSelect', function(e){
			$(this).removeClass('is_focus');
		});

		if (!$('body').hasClass('mobile') && !$('body').hasClass('app_shfan') && $el.hasClass('is_natived') == false) { 
			$select.off('focus.uiSelect').on('focus.uiSelect', function(e){
				setTimeout(function(){ $uiButton.trigger('focus') }, 10);
			});
		}

		// 셀렉트 변경
		$select.filter('[data-target-visible=true]').on('change', function(){
			var id = $(this).val();
			$('#'+id).addClass('is_visible').siblings().removeClass('is_visible');
		});
		/*
		$select.on('change', function(){
			var idx = 0;
			$(this).find('option').each(function(i){
				if ($(this).prop('selected')){ idx = i }
			});
			
			var $selected = $(this).closest('.ui_select').find('.ui_select_option').eq(idx);
			$uiValue.text($selected.text());
			$uiOptions.addClass('is_selected').siblings().removeClass('is_selected');
			$uiOptions.attr({'aria-selected':'true'}).siblings().removeClass('is_selected').attr({'aria-selected':'false'});
			console.log($(this).val());
		})
		*/

		$('[data-select]').off('click.selectBtn').on('click.selectBtn', function(){
			var id = $(this).attr('data-select');
			var url = $('#'+id).val();
			window.location = url;
		})
	},
	direction: function(){
		var self = this;
		var $el = $('.ui_select.is_active');
		var $btn = $el.find('.ui_select_btn');
		var pos_y = $(window).scrollTop() + ($(window).height()/2);
		var ele_y = $btn.offset().top + ($btn.outerHeight()/2);

		if ($el.hasClass('ui_select_down')) { 
			// 수동 - 아래로
			$el.attr({'data-direction':'down'}) 
		} else if ($el.hasClass('ui_select_up')) { 
			// 수동 - 위로
			$el.attr({'data-direction':'up'}) 
		} else {
			// 자동 - 셀렉트가 화면중앙을 기준으로 방향을 결정
			if (pos_y < ele_y) { $el.attr({'data-direction':'up'}) } else { $el.attr({'data-direction':'down'}) }
		}
	},
	selected: function($selected, $select){
		var self = this;
		var idx = $selected.index();
		var $button = $selected.closest('.ui_select').find('.ui_select_btn');
		if(idx < 0) return;
		$selected.addClass('is_selected').siblings().removeClass('is_selected');
		$selected.attr({'aria-selected':'true'}).siblings().removeClass('is_selected').attr({'aria-selected':'false'});
		$select.find('option').eq(idx).prop("selected", true);

		if ( $selected.hasClass('is_placeholder') ) {
			$button.addClass('is_placeholder');
		} else if ($button.hasClass('is_placeholder')){
			$button.removeClass('is_placeholder');
		}
		$button.find('.ui_select_value').text($selected.text());
		$select.find('option').eq(idx).prop("selected", true);
	}
};

$(document).on('click.uiSelect focusin.uiSelect', function(e){
	$('.ui_select').each(function(){
		if ($(this).has(e.target).length == 0){
			$(this).find('.ui_select_menu').stop().hide();
			$(this).find('.ui_select_menu .ui_select_option.is_focus').removeClass('is_focus').attr('aria-selected','false');
			$(this).removeClass('is_active');
			$(this).removeAttr('data-direction');
			// (2022 웹접근성 수정) 2022.04.08 마재광 추가 s
			// 셀렉트 박스에서 버튼을 선택 후에도 버튼의 상태값이 확장됨으로 확인
			$(this).find('.ui_select_btn').attr('aria-expanded','false');
		}
	});
});
/* 방향키 사용안함
$(document).keydown(function(e){
	if (e.keyCode == 38 || e.keyCode == 40) {
		if ($('.ui_select_option.is_focus').length || $('.ui_select_btn.is_focus').length || $('.input-email-list li.is_focused').length){
			e.preventDefault();
		} else {
			e.preventDefault = false;
		}
	}
});
$(document).keyup(function(e){
	if (e.keyCode == 38) {
		$('.ui_select_option.is_focus').each(function(){
			if ($(this).prev().length){ $(this).prev().find('a').trigger('focus');}				
		});
		$('.ui_select_btn.is_focus').each(function(){
			var $selected = $(this).closest('.ui_select').find('.ui_select_option.is_selected');
			var $select = $(this).closest('.ui_select').find('select');
			if ($selected.prev().length){ selectJS.selected($selected.prev(), $select); $select.trigger('change'); }
		});
	}
	if (e.keyCode == 40) {
		$('.ui_select_option.is_focus').each(function(){
			if ($(this).next().length){ $(this).next().find('a').trigger('focus');}
		});
		$('.ui_select_btn.is_focus').each(function(){
			var $selected = $(this).closest('.ui_select').find('.ui_select_option.is_selected');
			var $select = $(this).closest('.ui_select').find('select');
			if ($selected.next().length){ selectJS.selected($selected.next(), $select); $select.trigger('change'); }
		});
	}
});
*/