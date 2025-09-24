/* 2022-04 */
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
    '<script src="' +
      `${cdnAddr}/pconts/js/jquery.custom.select.js"><\/scr` +
      "ipt>\n" +
      "<scr" +
      'ipt src="' +
      `${cdnAddr}/pconts/js/shcard/shc-com.js?v=` +
      ver +
      '" defer></scr' +
      "ipt>\n" +
      "<scr" +
      'ipt src="' +
      `${cdnAddr}/pconts/js/common.js?v=` +
      ver +
      '"></scr' +
      "ipt>\n" +
      "<scr" +
      'ipt src="' +
      `${cdnAddr}/pconts/js/operation.js?v=` +
      ver +
      '"></scr' +
      "ipt>\n" +
      "<scr" +
      'ipt src="' +
      `${cdnAddr}/pconts/js/redir/reDir.js?v=` +
      ver +
      '" defer></scr' +
      "ipt>\n"
  );
})();
