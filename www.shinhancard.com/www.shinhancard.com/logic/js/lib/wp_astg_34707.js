'use strict';

(function(w) {

    // 스크립트가 두번 삽입된 경우이므로 리턴함
    if (w.widerplanet_tag_pixel) {
        return;
    }

    var isMobile = /(mobile|android)/gi.test(navigator.userAgent) ? true : false;
    var requestUrl = '//astg.widerplanet.com/delivery/wpc.php?v=1&ver=pixel&r=1&im=img';

    function tag(uri) {
        try {
            var rq_url = requestUrl,
                referer = document.referrer,
                loc = uri ? uri : document.location.href,
                charset = w.document.charset || (w.parent.document.characterSet || ''),
                tagImage = new Image();

            rq_url += '&ti=34707';
            rq_url += '&ty=auto';
            rq_url += '&device=' + (isMobile ? 'mobile' : 'web');

            if (charset) {
                rq_url += '&charset=' + charset;
            }

            rq_url += '&tc=' + new Date().getTime();

            if (referer) {
                rq_url += "&ref=" + encodeURIComponent(referer);
            }
            if (loc) {
                rq_url += "&loc=" + encodeURIComponent(loc);
            }

            tagImage.src = rq_url;
        } catch(e) {}
    }

    w.widerplanet_tag_pixel = {
        tag: tag
    }

    if (!w.wptp) {
        w.wptp = w.widerplanet_tag_pixel;
    }

    tag();

})(window);