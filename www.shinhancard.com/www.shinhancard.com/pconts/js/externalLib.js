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
  "<scr" +
    'ipt src="' +
    `${cdnAddr}/pconts/js/jquery-3.4.1.min.js"></scr` +
    "ipt>\n" +
    "<scr" +
    'ipt src="' +
    `${cdnAddr}/pconts/js/shcard/shc-js-lib.js"></scr` +
    "ipt>\n"
);