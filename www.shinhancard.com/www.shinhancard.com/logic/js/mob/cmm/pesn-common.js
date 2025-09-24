(function () {
    var ver = new Date().getDate() + (new Date().getHours()>18 ? '3' : '2');

    // 로직관련 변경되는 공통 파일들
    document.write('<script src="' + '/logic/js/mob/cmm/service-2020.js?v='+ ver +'"></scr' + 'ipt>');
    document.write('<script src="' + '/logic/js/mob/cmm/common-2020.js?v='+ ver +'"></scr' + 'ipt>');
    document.write('<script src="' + '/logic/js/mob/cmm/util-2020.js?v='+ ver +'"></scr' + 'ipt>');
    document.write('<script src="' + '/logic/js/mob/cmm/crust-default-2020.js?v='+ ver +'"></scr' + 'ipt>');
})();