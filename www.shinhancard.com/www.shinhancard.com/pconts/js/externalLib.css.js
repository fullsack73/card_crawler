/* preload  */
(function () {
	var ver = new Date().getDate() + '' +(new Date().getHours());
	var deVer = new Date().getDate() + (new Date().getHours() > 18 ? '3' : '2');
	
	const host = window.location.hostname;
	const firstLabel = host.split('.')[0];

	const isLocal = /^localhost$/.test(host);
	const isDev = firstLabel.startsWith("dev");
	const isTest = firstLabel.startsWith("tst");

	const CDN = Object.freeze({
    local: "",
    dev: "",
    tst: "https://tst.cdnu.www.shinhancard.com",
    prod: "https://cdnu.www.shinhancard.com",
  });

	let cdnAddr = isLocal || isDev ? CDN.dev : isTest ? CDN.tst : CDN.prod;


    document.write(
      "<li" +
        'nk rel="preload" as="font" type="font/woff2" hre' +
        'f="/pconts/fonts/shcard/SpoqaHanSansNeo-Regular.woff2" crossorigin />\n' +
        "<li" +
        'nk rel="preload" as="font" type="font/woff2" hre' +
        'f="/pconts/fonts/shcard/SpoqaHanSansNeo-Medium.woff2" crossorigin />\n' +
        "<li" +
        'nk rel="preload" as="style" hre' +
        `f="${cdnAddr}/pconts/css/shcard/shc-fonts.css?ver=` +
        ver +
        '" />\n' +
        "<li" +
        'nk rel="preload" as="style" hre' +
        `f="${cdnAddr}/pconts/css/shcard/common-2020.css?ver=2020" />\n` +
        "<li" +
        'nk rel="preload" as="style" hre' +
        `f="${cdnAddr}/pconts/css/shcard/common-pc-2020.css?ver=2020" />\n` +
        "<li" +
        'nk rel="preload" as="style" hre' +
        `f="${cdnAddr}/pconts/css/dx-com-2021.css?ver=` +
        ver +
        '" />\n' +
        "<li" +
        'nk rel="preload" as="style" hre' +
        `f="${cdnAddr}/pconts/css/shcard/shc-js-lib.css?ver=2020" />\n` +
        "<li" +
        'nk rel="preload" as="script" hre' +
        `f="${cdnAddr}/pconts/js/jquery-3.4.1.min.js" />\n` +
        "<li" +
        'nk rel="preload" as="script" hre' +
        `f="${cdnAddr}/pconts/js/shcard/shc-js-lib.js" />\n` +
        "<li" +
        'nk rel="preload" as="script" hre' +
        `f="${cdnAddr}/pconts/js/common.js?v=` +
        ver +
        '" />\n' +
        "<li" +
        'nk rel="preload" as="script" hre' +
        `f="${cdnAddr}/pconts/js/operation.js?v=` +
        ver +
        '"/>\n' +
        "<li" +
        'nk rel="preload" as="script" hre' +
        `f="${cdnAddr}/pconts/js/jquery.custom.select.js"/>\n`
    );
})();