(function(user_id, content_id, menu_path) {
	// 통합검색 결과에 대해 특정 콘텐츠를 클릭하여 이동하는 경우 해당하는 내용을 LOG를 저장하는 서버로 전송하는 스크립트
	var searchLog = {  
		getCrustMenuId : function() {
			var params = {};  
			var result = "None";
			window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(
					str, key, value) {
				params[key] = value;
			});
			try {
				result = params.crustMenuId;
				if (result == undefined)
					result = "None";
				return result;

			} catch (error) {
				return result;
			}
		},
		getUserIdByCookie : function(key) {
			var cookieKey = key + "=";
			var result = "guest";
			var cookieArr = document.cookie.split(';');
			try {
				for (var i = 0; i < cookieArr.length; i++) {
					if (cookieArr[i][0] === " ") {
						cookieArr[i] = cookieArr[i].substring(1)
					}
					if (cookieArr[i].indexOf(key) === 0) {
						result = cookieArr[i].slice(cookieKey.length,
								cookieArr[i].length);
					}

				}
				return result;

			} catch (error) {
				return result;
			}
		},

		getCurrentSearchkeyword : function() {
			var keywordHistory = "";
			var currentSearchKeyword = "None";
			try {
				keywordHistory = JSON.parse(localStorage['srch']);
				currentSearchKeyword = keywordHistory.query;
				return currentSearchKeyword;

			} catch (error) {
				return currentSearchKeyword;
			}

		},

		getCategory : function() {
			var currentURL = window.location.pathname.split('/');
			var category = "None";
			try {
				category = currentURL[3];
				return category;

			} catch (error) {
				return category;
			}

		},
		getContentsID : function() {
			return window.location.pathname;
			// /pconts/html/life/napbu/MOBFM126/MOBFM126R01.html
		},
		clickedMenu : function() {
			/*
			var url = 'https://dev-wrc.shinhancard.com/wrc/WRCN/wrcWeb.ajax';
			if (deviceInfo.mode && deviceInfo.mode.indexOf('tst') > -1) {
				url = 'https://tst-wrc.shinhancard.com/wrc/WRCN/wrcWeb.ajax';
			} else if (deviceInfo.mode && deviceInfo.mode.indexOf('run') > -1) {
				url = 'https://wrc.shinhancard.com/wrc/WRCN/wrcWeb.ajax';
			}
			*/
			
			//C2021102188021  [마이카] 내차팔기 서비스 신청 페이지 동의문구 수정 요청 
			var url = 'https://wrc.shinhancard.com/wrc/WRCN/wrcWeb.ajax';
			if (deviceInfo.mode && deviceInfo.mode.indexOf('tst') > -1) {
				url = 'https://tst-wrc.shinhancard.com/wrc/WRCN/wrcWeb.ajax';
			} else if (deviceInfo.mode && deviceInfo.mode.indexOf('dev') > -1) {
				url = 'https://dev-wrc.shinhancard.com/wrc/WRCN/wrcWeb.ajax';
			}
			
			try {
				$.ajax({
					url : url,
					xhrFields : {
						withCredentials : true
					},
					type : 'GET',
					dataType : 'jsonp',
					crossDomain: true,
					contentType : 'application/javascript; charset=utf-8',
					jsonp : 'callback', 
					data : {
						"user_id" : this.getUserIdByCookie("mbw_wlog"),
						"content_id" : this.getContentsID(),
						"menu_path" : this.getCrustMenuId()
					},
					success : function(data, textStatus, jqXHR) {
						//console.log("Web transmission complete!");
					},
					error : function(jqXHR, textStatus, errorThrown) {
						//console.log("Web error occured..");
					}
				});

			} catch (error) {
				return true;
			}

		},
		searchAfterClicked : function() {
			/*
			var url = 'https://dev-wrc.shinhancard.com/wrc/WRCN/wrcSearch.ajax';
			if (deviceInfo.mode && deviceInfo.mode.indexOf('tst') > -1) {
				url = 'https://tst-wrc.shinhancard.com/wrc/WRCN/wrcSearch.ajax';
			} else if (deviceInfo.mode && deviceInfo.mode.indexOf('run') > -1) {
				url = 'https://wrc.shinhancard.com/wrc/WRCN/wrcSearch.ajax';
			}
			*/
			
			//C2021102188021  [마이카] 내차팔기 서비스 신청 페이지 동의문구 수정 요청 
			var url = 'https://wrc.shinhancard.com/wrc/WRCN/wrcSearch.ajax';
			if (deviceInfo.mode && deviceInfo.mode.indexOf('tst') > -1) {
				url = 'https://tst-wrc.shinhancard.com/wrc/WRCN/wrcSearch.ajax';
			} else if (deviceInfo.mode && deviceInfo.mode.indexOf('dev') > -1) {
				url = 'https://dev-wrc.shinhancard.com/wrc/WRCN/wrcSearch.ajax';
			}

			try {
				$.ajax({
					url : url,
					xhrFields : {
						withCredentials : true
					},
					type : 'GET',
					dataType : 'jsonp',
					crossDomain: true,
					contentType : 'application/javascript; charset=utf-8',
					jsonp : 'callback',
					data : {
						"user_id" : this.getUserIdByCookie("mbw_wlog"),
						"content_id" : this.getContentsID(),
						"keyword" : this.getCurrentSearchkeyword(),
						"category" : this.getCategory()
					},
					success : function(data, textStatus, jqXHR) {
						//console.log("Search transmission complete!");
					},
					error : function(jqXHR, textStatus, errorThrown) {
						//console.log("Search error occured..");
					}
				});

			} catch (error) {
				return true;

			}
		}
	};
	searchLog.clickedMenu();
	searchLog.searchAfterClicked();
})();