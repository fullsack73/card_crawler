(function () {
  var ver = new Date().getDate() + "" + new Date().getHours();

  const host = window.location.hostname;
  const firstLabel = host.split(".")[0];

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
      'nk rel="shortcut icon" type="image/x-icon" hre' +
      'f="/pconts/images/ico_favicon96.ico?v=2020" />\n' +
      "<li" +
      'nk type="image/x-icon" rel="apple-touch-icon-precomposed" hre' +
      'f="/pconts/images/ico_favicon196.png?v=2020" />\n' +
      "<li" +
      'nk rel="stylesheet" hre' +
      'f="' +
      `${cdnAddr}/pconts/css/shcard/shc-fonts.css?ver=` +
      ver +
      '" media="all"  />\n' +
      "<li" +
      'nk rel="stylesheet" hre' +
      'f="' +
      `${cdnAddr}/pconts/css/shcard/shc-js-lib.css?ver=2020" media="all"  />\n`
  );
  if (document.querySelector("html").className.indexOf("isPcOnly") > -1) {
    // isPcOnly
    document.write(
      "<li" +
        'nk rel="stylesheet" href="' +
        `${cdnAddr}/pconts/css/shcard/common-pc-2020.css?ver=2020" media="all"  />\n` +
        "<li" +
        'nk rel="stylesheet" hre' +
        'f="' +
        `${cdnAddr}/pconts/css/dx-com-2021.css?ver=181727` +
        
        '" media="all"  />\n' +
        "<li" +
        'nk rel="stylesheet" hre' +
        'f="' +
        `${cdnAddr}/pconts/css/shcard/shc-com.css?ver=` +
        ver +
        '" media="all"  />\n' +
        "<li" +
        'nk rel="stylesheet" hre' +
        'f="' +
        `${cdnAddr}/pconts/css/shcard/shc-card.css?ver=` +
        ver +
        '" media="all"  />\n' +
        "<li" +
        'nk rel="stylesheet" hre' +
        'f="' +
        `${cdnAddr}/pconts/css/dx-operation.css?ver=` +
        ver +
        '" media="all"  />'
    );
  } else {
    //normal
    document.write(
      "<li" +
        'nk rel="stylesheet" href="' +
        `${cdnAddr}/pconts/css/shcard/common-pc-2020.css?ver=2020" media="all"  />\n` +
        "<li" +
        'nk rel="stylesheet" hre' +
        'f="' +
        `${cdnAddr}/pconts/css/shcard/common-2020.css?ver=2020" media="all"  />\n` +
        "<li" +
        'nk rel="stylesheet" hre' +
        'f="' +
        `${cdnAddr}/pconts/css/dx-com-2021.css?ver=20250915` +
        
        '" media="all"  />\n' +
        "<li" +
        'nk rel="stylesheet" hre' +
        'f="' +
        `${cdnAddr}/pconts/css/shcard/shc-com.css?ver=` +
        ver +
        '" media="all"  />\n' +
        "<li" +
        'nk rel="stylesheet" hre' +
        'f="' +
        `${cdnAddr}/pconts/css/shcard/shc-card.css?ver=` +
        ver +
        '" media="all"  />\n' +
        "<li" +
        'nk rel="stylesheet" hre' +
        'f="' +
        `${cdnAddr}/pconts/css/dx-operation.css?ver=` +
        ver +
        '" media="all"  />'
    );
  }
  if (window.location.href.indexOf("https://dev.") > -1 || window.location.href.indexOf("https://tst.") > -1) {
    document.write("<li" + 'nk rel="stylesheet" hre' + 'f="' + `${cdnAddr}/pconts/css/shcard/shc-op.css?ver=` + ver + '" media="all" />');
    document.write("<li" + 'nk rel="stylesheet" hre' + 'f="' + `${cdnAddr}/pconts/css/shcard/shc-impr.css?ver=` + ver + '" media="all" />');
  }
})();
