var Ntm = window.Ntm || {};

Ntm.Settings = {"tags":[{"type":"PLUGIN","id":"TAG-96331","name":"홈페이지 (검색완료/카드상세/이벤트상세)","enabled":true,"triggers":["TRG-00001"],"exceptions":[],"pluginType":"nlogger","logType":"EVENT","path":"","parameters":{"nth_app_tcd":"VAR-57535","nth_url":"VAR-17641","nth_act_tcd":"VAR-27783","nth_time":"VAR-25848","bne_c":"VAR-60840","evt_nm":"VAR-43439","crd_pd_id":"VAR-12856","query":"VAR-36845","logsearch":"VAR-54489"},"cookies":{"nth_session":"VAR-46802"}},{"type":"SCRIPT","id":"TAG-37088","name":"collectAdTGID","enabled":true,"triggers":["TRG-33061"],"exceptions":[],"code":"function() {\n  //광고 ID 수집용 태깅\n  var isLogged = Ntm.Cookie.get('nth_isLogged');\n  var tgid = Ntm.Cookie.get('TGID');\n  var uid = Ntm.Cookie.get('mbw_wlog') || Ntm.Cookie.get('wiselog_id') || '';\n  var adpartner = 'TG360';\n  var adchannel = \"WEB\";\n\n  try{\n    if ( isLogged == '' || isLogged == \"0\"){\n  // 앱 , 모바일 , PC 구분\n      if ( tgid !== '' && uid !== '' ){\n        if ( window.deviceInfo ){\n          if ( deviceInfo.app ){\n            adchannel = \"APP\";\n          }else if ( deviceInfo.mobile ){\n            adchannel = \"MWEB\";\n          }else{\n            adchannel = \"WEB\";\n          }\n        }\n     // 여기에 코드를 작성하세요\n\n        {{nlogger}}.log(\n          \"TG360WEB\",\n          {\n            \"nth_tgid\" : tgid,\n            \"nth_adpartner\" : adpartner,\n            \"nth_adchannel\" : adchannel\n          },\n          {\n            \"wiselog_id\" : uid\n          },\n          null,\n          \"ADINFO\"\n        );\n        Ntm.Cookie.set('nth_isLogged',\"1\", {path : \"/\"});\n      }\n    }\n  }catch (e){\n    console.log(\"TG60 ID Logging Error\");\n  }\n}","approval":"DONE","logs":[{"time":1647567134407,"userId":"nethru2","action":"CONFIRM","comment":""}]}],"triggers":[{"type":"GENERAL","id":"TRG-00001","name":"페이지로드(검색완료/카드상세/이벤트상세)","event":"DOMREADY","conditions":[{"operator":"GREATERTHANOREQUALS","variable":"VAR-60840","value":"1"}]},{"type":"GENERAL","id":"TRG-33061","name":"collectAdTGID","event":"DOMREADY","conditions":[]}],"variables":[{"type":"BUILTIN","id":"VAR-00001","name":"url","description":"페이지 전체 URL"},{"type":"BUILTIN","id":"VAR-00002","name":"host","description":"페이지 URL 호스트"},{"type":"BUILTIN","id":"VAR-00003","name":"path","description":"페이지 URL 경로"},{"type":"BUILTIN","id":"VAR-00004","name":"params","description":"페이지 URL 파라미터"},{"type":"BUILTIN","id":"VAR-00005","name":"paramDict","description":"페이지 URL 파라미터 (객체)"},{"type":"BUILTIN","id":"VAR-00006","name":"hash","description":"페이지 URL 해시"},{"type":"BUILTIN","id":"VAR-00007","name":"referrer","description":"이전 방문 페이지 주소"},{"type":"BUILTIN","id":"VAR-00008","name":"title","description":"페이지 제목"},{"type":"BUILTIN","id":"VAR-00009","name":"clickId","description":"클릭 항목 ID"},{"type":"BUILTIN","id":"VAR-00010","name":"clickClass","description":"클릭 항목 클래스명"},{"type":"BUILTIN","id":"VAR-00011","name":"clickText","description":"클릭 항목 텍스트"},{"type":"BUILTIN","id":"VAR-00012","name":"clickTag","description":"클릭 항목 태그명"},{"type":"BUILTIN","id":"VAR-00013","name":"customData","description":"커스텀 이벤트 변수"},{"type":"PLUGIN","id":"VAR-00014","name":"nlogger","description":"넷스루 로깅 모듈"},{"type":"STRING","id":"VAR-27783","name":"9.액션유형코드(로드)","description":null,"value":"P"},{"type":"SCRIPT","id":"VAR-25848","name":"12.타임스탬프","description":null,"code":"function() {\n  var date = new Date();\n  var timestamp = date.getTime();\n  \n  return timestamp;\n}","approval":"DONE","logs":[{"time":1623746351780,"userId":"nethru","action":"CONFIRM","comment":""}]},{"type":"SCRIPT","id":"VAR-12856","name":"17.카드상품ID","description":null,"code":"function() {\n\tvar crd_pd_id = '';\n  \tvar url = document.location.pathname;\n\t\n  \tif (url.indexOf(\"/pconts/html/card/apply\") != -1) {\t//이벤트상세 페이지일 경우만\n    \tcrd_pd_id = window._n_p2;\n    }\n  \t\n \tconsole.log('카드상품ID :: ' + crd_pd_id); \n  \treturn crd_pd_id;\n}","approval":"DONE","logs":[{"time":1623746361976,"userId":"nethru","action":"CONFIRM","comment":""}]},{"type":"SCRIPT","id":"VAR-36845","name":"18.검색단어내용","description":null,"code":"function() {\n  \tvar srh_wod_tt = '';\n  \tvar url = document.location.pathname;\n  \tvar params = document.location.search;\n  \n  \tif (url.indexOf(\"/mob/MOBFM004N/MOBFM004R0201.shc\") != -1) {\t//검색완료 페이지에서만\n  \t\tsrh_wod_tt = params.split(\"query=\")[1].split(\"&\")[0];\n    }\n  \n  \treturn srh_wod_tt;\n}","approval":"DONE","logs":[{"time":1623746364832,"userId":"nethru","action":"CONFIRM","comment":""}]},{"type":"SCRIPT","id":"VAR-54489","name":"19.인기검색단어내용","description":null,"code":"function() {\n  \tvar hot_srh_wod_tt = '';\n  \tvar url = document.location.pathname;\n  \tvar params = document.location.search;\n  \n  \tif (url.indexOf(\"/mob/MOBFM004N/MOBFM004R0201.shc\") != -1) {\t//검색완료 페이지에서만\n  \t\thot_srh_wod_tt = params.split(\"logsearch=\")[1].split(\"&\")[0];\n    }\n  \n  \treturn hot_srh_wod_tt;\n}","approval":"DONE","logs":[{"time":1623746367537,"userId":"nethru","action":"CONFIRM","comment":""}]},{"type":"SCRIPT","id":"VAR-17641","name":"8.호출URL","description":null,"code":"function() {   \n  var url = document.location.pathname;\n  \n  if (url.indexOf(\"#\") != -1) {\n  \turl = url.split(\"#\")[0];\n  }\n  \n  return url;\n}","approval":"DONE","logs":[{"time":1624003205337,"userId":"nethru","action":"CONFIRM","comment":""}]},{"type":"SCRIPT","id":"VAR-60840","name":"15.업무구분","description":null,"code":"function() {\n\tvar bne_c = 0;\n  \tvar url = document.location.pathname;\n\t\n  \tif (url.indexOf(\"/mob/MOBFM004N/MOBFM004R0201.shc\") != -1) { //검색완료\n    \tbne_c = 1;\n    } else if (url.indexOf(\"/pconts/html/card/apply\") != -1) { //카드상세\n      \tbne_c = 2;\n    } else if (url.indexOf(\"/pconts/html/benefit/event\") != -1) { //이벤트상세\n      \tbne_c = 3;\n    }\n  \n  \treturn bne_c;\n}","approval":"DONE","logs":[{"time":1623746355403,"userId":"nethru","action":"CONFIRM","comment":""}]},{"type":"SCRIPT","id":"VAR-46802","name":"2.세션ID","description":null,"code":"function() {\n  var nth_sid = '';\n  nth_sid = Ntm.Cookie.get('nth_session');\n  \n  if( ! nth_sid ){\n    nth_sid = Ntm.Plugin.nlogger.generateUuid();\n    Ntm.Cookie.set('nth_session', nth_sid, {domain : 'shinhancard.com', path:'/'});\n  }\n  \n  return nth_sid;\n}","approval":"DONE","logs":[{"time":1623746313661,"userId":"nethru","action":"CONFIRM","comment":""}]},{"type":"SCRIPT","id":"VAR-57535","name":"1.앱유형코드","description":null,"code":"function() {\n   var app_tcd = \"SHC\";\n \n   return app_tcd;\n}","approval":"DONE","logs":[{"time":1624003202242,"userId":"nethru","action":"CONFIRM","comment":""}]},{"type":"SCRIPT","id":"VAR-43439","name":"16.이벤트명","description":null,"code":"function() {\n\tvar evt_nm = '';\n  \tvar url = document.location.pathname;\n\t\n  \tif (url.indexOf(\"/pconts/html/benefit/event\") != -1) {\t//이벤트상세 페이지일 경우만\n    \tevt_nm = window._n_p3;\n    }\n  \t\n \tconsole.log('이벤트명 :: ' + evt_nm); \n  \treturn evt_nm;\n}","approval":"DONE","logs":[{"time":1623746358332,"userId":"nethru","action":"CONFIRM","comment":""}]}],"lastModified":"2022-04-11 13:09:10","plugins":[{"type":"PLUGIN","id":"VAR-00014","name":"nlogger","description":"넷스루 로깅 모듈"}]};

Ntm.Console = function() {
    var _this = {};

    _this.log = function() {
        if(!Ntm.Preview.isPreviewMode()) return;
        console.log.apply(this, arguments);
    };

    return {
        log: _this.log
    }
}();

Ntm.Cookie = function() {
    var _this = {};

    _this.get = function(key, decode) {
        var map = _this.map(decode);
        var value = map[key];

        return value ? value : "";
    };

    _this.set = function(key, value, options) {
        if(!options) options = {};

        document.cookie = key + '=' + encodeURIComponent(value) + ';' +
            (options.expires ? 'expires=' + options.expires + ';' : '') +
            (options.path ? 'path=' + options.path + ';' : '') +
            (options.domain ? 'domain=' + options.domain : '');
    };

    _this.remove = function(key, options) {
        _this.set(key, "", Ntm.Helper.extend({
            expires: "Thu, 01-Jan-1970 00:00:01 GMT",
            path: "/"
        }, options));
    };

    _this.map = function(decode) {
        var cookies = document.cookie.split(';');
        var cookieMap = {};

        for (var index = 0; index < cookies.length; index++) {
            var cookie = cookies[index].trim();
            if(cookie.length === 0) continue;

            var token = cookie.split('=');
            var key = token.shift();
            var value = token.join("=");

            if(decode) value = decodeURIComponent(value);

            cookieMap[key] = value;
        }

        return cookieMap;
    };

    return {
        get: _this.get,
        set: _this.set,
        remove: _this.remove
    }
}();

Ntm.Variable = function() {
    var _this = {};

    _this.clickEvent = {};
    _this.customData = {};
    _this.addOnData = {
        param: {},
        cookie: {}
    };

    _this.setClickEvent = function(event, target) {
        _this.clickEvent = Ntm.Helper.extend(event, {
            target: target
        });
    };

    _this.setClickTarget = function(target) {
        _this.clickEvent = Ntm.Helper.extend(_this.clickEvent, {
            target: target
        });
    };

    _this.setCustomData = function(customData) {
        _this.customData = customData;
    };

    _this.getBuiltinVariable = function(name) {
        switch(name) {
            case "url":
                return window.location.href;

            case "host":
                return window.location.origin;

            case "path":
                return window.location.pathname;

            case "referrer":
                return _this.getReferer();

            case "params":
                return _this.getUrlParams();

            case "paramDict":
                return _this.getUrlParamsAsDict();

            case "title":
                return document.title;

            case "clickElement":
                return _this.getClickElement();

            case "clickId":
                return _this.getClickId();

            case "clickClass":
                return _this.getClickClass();

            case "clickText":
                return _this.getClickText();

            case "clickTag":
                return _this.getClickTag();

            case "hash":
                return window.location.hash;

            case "customData":
                return _this.customData;
        }

        return null;
    };

    _this.getReferer = function() {
        var ref = self.document.referrer;
        var parentHref = "";
        var parentRef = "";

        try {
            parentHref = top.document.location.href;
            parentRef = top.document.referrer;
        } catch (e) {
            return ref;
        }

        if(ref === parentHref) return parentRef;

        return ref;
    };

    _this.getPlugin = function(name) {
        return "Ntm.Plugin." + name;
    };

    _this.getUrlParams = function() {
        return decodeURI(window.location.search.substr(1));
    };

    _this.getUrlParamsAsDict = function() {
        var urlParams = _this.getUrlParams();
        return urlParams ? JSON.parse('{"' + decodeURI(urlParams).replace(/&/g, '","').replace(/=/g, '":"') + '"}') : ''
    };

    _this.getCookie = function(key, decode) {
        return Ntm.Cookie.get(key, decode);
    };

    _this.getClickElement = function() {
        return _this.clickEvent.target;
    };

    _this.getClickId = function() {
        if(_this.clickEvent.target) return _this.clickEvent.target.id || "";
        return "";
    };

    _this.getClickClass = function() {
        if(_this.clickEvent.target) return _this.clickEvent.target.className || "";
        return "";
    };

    _this.getClickText = function() {
        if(_this.clickEvent.target) return _this.clickEvent.target.innerText || "";
        return "";
    };

    _this.getClickTag = function() {
        if(_this.clickEvent.target) return _this.clickEvent.target.tagName || "";
        return "";
    };

    _this.getElementValue = function(variable) {
        var element;
        var clickTarget = _this.clickEvent.target;

        switch (variable.selector) {
            case "CLICK":
                element = clickTarget;
                break;

            case "ENTIRE":
                element = document.querySelector(variable.value);
                break;

            case "DESCENDANT":
                if(clickTarget) element = clickTarget.querySelector(variable.value);
                break;

            case "ASCENDANT":
                if(clickTarget) {
                    var tagName = variable.value.toUpperCase();
                    var target = clickTarget.parentElement;
                    var order = 0;

                    while(target) {
                        if(target.tagName.toUpperCase() === tagName) {
                            order++;

                            if(order == variable.order) {
                                element = target;
                                break;
                            }
                        }

                        target = target.parentElement;
                    }
                }
                break;
        }

        return element ? (variable.attribute ? element.getAttribute(variable.attribute) : element.innerText) : undefined;
    };

    _this.addOnParam = function(data) {
        _this.addOnData.param = Ntm.Helper.extend(_this.addOnData.param, data);
    };

    _this.addOnCookie = function(data) {
        _this.addOnData.cookie = Ntm.Helper.extend(_this.addOnData.cookie, data);
    };

    _this.getAddOnData = function() {
        return _this.addOnData;
    };

    _this.clearAddOnData = function() {
        _this.addOnData = {
            param: {},
            cookie: {}
        };
    };

    return {
        get: _this.getBuiltinVariable,
        getPlugin: _this.getPlugin,
        getCookie: _this.getCookie,
        getElementValue: _this.getElementValue,
        setClickEvent: _this.setClickEvent,
        setClickTarget: _this.setClickTarget,
        setCustomData: _this.setCustomData,
        addOnParam: _this.addOnParam,
        addOnCookie: _this.addOnCookie,
        getAddOnData: _this.getAddOnData,
        clearAddOnData: _this.clearAddOnData
    }
}();

Ntm.Helper = function() {
    var _this = {};

    _this.stringify = function(obj) {
        return JSON.stringify(obj);
    };

    _this.find = function (values, key, match) {
        for (var index = 0; index < values.length; index++) {
            var value = values[index];
            if (value[key] === match) {
                return value;
            }
        }

        return undefined;
    };

    _this.getVariableById = function (id) {
        return _this.find(Ntm.Settings.variables, "id", id);
    };

    _this.getVariableByName = function(name) {
        return _this.find(Ntm.Settings.variables, "name", name);
    };

    _this.copy = function(obj) {
        return JSON.parse(_this.stringify(obj));
    };

    _this.extend = function() {
        var extended = {};

        for(var index = 0; index < arguments.length; index++) {
            var source = arguments[index];

            for(var prop in source) {
                if(Object.prototype.hasOwnProperty.call(source, prop))
                    extended[prop] = source[prop];
            }
        }

        return extended;
    };

    _this.length = function(obj) {
        var count = 0;

        for(key in obj) {
            count++;
        }

        return count;
    };

    _this.replaceAll = function(text, find, replace) {
        return text ? text.split(find).join(replace) : text;
    };

    _this.isValidSettings = function() {
        return Ntm.Settings.hasOwnProperty("tags") &&
            Ntm.Settings.hasOwnProperty("triggers") &&
            Ntm.Settings.hasOwnProperty("variables");
    };

    return {
        stringify: _this.stringify,
        extend: _this.extend,
        copy: _this.copy,
        length: _this.length,
        find: _this.find,
        replaceAll: _this.replaceAll,
        getVariableById: _this.getVariableById,
        getVariableByName: _this.getVariableByName,
        isValidSettings: _this.isValidSettings
    }
}();

Ntm.Evaluator = function() {
    var _this = {};

    _this.evaluate = function(variable) {
        switch(variable.type) {
            case "BUILTIN":
                return Ntm.Variable.get(variable.name);

            case "PLUGIN":
                return Ntm.Variable.getPlugin(variable.name);

            case "STRING":
            case "NUMBER":
                return variable.value;

            case "COOKIE":
                return Ntm.Variable.getCookie(variable.key);

            case "ELEMENT":
                return Ntm.Variable.getElementValue(variable);

            case "SCRIPT":
                return _this.runScript(_this.evaluateNested(variable.code));

            case "VARIABLE":
                return _this.runScript('function(){return ' + variable.value + '}');
        }

        return null;
    };

    _this.evaluateNested = function(script) {
        var variables = _this.gatherAllVariables(script);

        if(Ntm.Helper.length(variables) > 0) {
            script = _this.replaceVariablesWithinQuotations(script, variables);
            script = _this.replaceVariables(script, variables);
        }

        return script;
    };

    _this.gatherAllVariables = function(script) {
        var regex = /{{([^{}]+)}}/g;
        var variables = {};

        while(true) {
            var match = regex.exec(script);
            if(!match) break;

            var expression = match[0];
            if(variables[expression]) continue;

            var variable = Ntm.Helper.getVariableByName(match[1]);
            var evaluated = variable ? value(_this.evaluate(variable), variable.type) : value(variable);

            variables[expression] = evaluated;
        }

        return variables;

        function value(obj, type) {
            return type != "PLUGIN" ? Ntm.Helper.stringify(obj) : obj;
        }
    };

    _this.replaceVariables = function(script, variables) {
        var count = 1;
        var declarations = "";

        for(var key in variables) {
            var variable = "__ntm__" + count++;
            declarations += "var " + variable + " = " + variables[key] + ";\n";
            script = Ntm.Helper.replaceAll(script, key, variable);
        }

        var regex = /function[^{]+{/;
        var match = regex.exec(script);

        if(match) {
            var func = match[0];
            var index = match.index + func.length;
            var result = "";

            result += func + "\n";
            result += declarations + "\n";
            result += script.substring(index);
            script = result;
        }

        return script;
    };

    _this.replaceVariablesWithinQuotations = function(script, variables) {
        script = replace(script, variables, /[\"]([^\"]*)[\"]/g);
        script = replace(script, variables, /[\']([^\']*)[\']/g);
        return script;

        function replace(script, variables, regex) {
            while(true) {
                var match = regex.exec(script);
                if(!match) break;

                var quotation = match[0];
                var front = script.substring(0, match.index);
                var rear = script.substring(match.index + quotation.length);

                for(var key in variables) {
                    var value = variables[key];
                    value = Ntm.Helper.replaceAll(value, '"', '');
                    value = Ntm.Helper.replaceAll(value, "'", "");
                    quotation = Ntm.Helper.replaceAll(quotation, key, value);
                }

                script = front + quotation + rear;
                regex.lastIndex = match.index + quotation.length;
            }

            return script;
        }
    };

    _this.runScript = function(script) {
        try {
            return eval("(" + script + ")()");
        }
        catch(e) {
            Ntm.Console.log(e, script);
        }
    };

    return {
        evaluate: _this.evaluate
    }
}();

Ntm.Matcher = function() {
    var _this = {};

    _this.matchAll = function(conditions) {
        return !conditions.some(function(condition) {
            var variable = Ntm.Helper.getVariableById(condition.variable);
            var operand1 = Ntm.Evaluator.evaluate(variable);
            var operand2 = condition.value;

            return !_this.match(condition.operator, operand1, operand2);
        });
    };

    _this.match = function(operator, operand1, operand2) {
        switch (operator) {
            case "EQUALS":
                return equals(operand1, operand2);

            case "NOTEQUALS":
                return !equals(operand1, operand2);

            case "CONTAINS":
                return contains(operand1, operand2);

            case "NOTCONTAINS":
                return !contains(operand1, operand2);

            case "STARTSWITH":
                return startsWith(operand1, operand2);

            case "NOTSTARTSWITH":
                return !startsWith(operand1, operand2);

            case "ENDSWITH":
                return endsWith(operand1, operand2);

            case "NOTENDSWITH":
                return !endsWith(operand1, operand2);

            case "MATCHES":
                return match(operand1, operand2);

            case "NOTMATCHES":
                return !match(operand1, operand2);

            case "LESSTHAN":
                return lessThan(operand1, operand2);

            case "LESSTHANOREQUALS":
                return lessThan(operand1, operand2) || equals(operand1, operand2);

            case "GREATERTHAN":
                return greaterThan(operand1, operand2);

            case "GREATERTHANOREQUALS":
                return greaterThan(operand1, operand2) || equals(operand1, operand2);

            default:
                return false;
        }

        function equals(operand1, operand2) {
            switch(typeof operand1) {
                case "number":
                    return isNumber(operand2) && operand1 === Number(operand2);

                case "string":
                    return isString(operand2) && operand1.toUpperCase() === operand2.toUpperCase();

                case "boolean":
                    return isBoolean(operand2) && operand1 === toBoolean(operand2);
            }

            return false;
        }

        function contains(operand1, operand2) {
            return isString(operand1) && isString(operand2) &&
                operand1.toUpperCase().indexOf(operand2.toUpperCase()) >= 0;
        }

        function startsWith(operand1, operand2) {
            return isString(operand1) && isString(operand2) &&
                operand1.toUpperCase().indexOf(operand2.toUpperCase()) == 0;
        }

        function endsWith(operand1, operand2) {
            return isString(operand1) && isString(operand2) &&
                operand1.toUpperCase().lastIndexOf(operand2.toUpperCase()) == operand1.length - operand2.length;
        }

        function match(operand1, operand2) {
            return operand1.match(operand2);
        }

        function lessThan(operand1, operand2) {
            return isNumber(operand1) && isNumber(operand2) && Number(operand1) < Number(operand2);
        }

        function greaterThan(operand1, operand2) {
            return isNumber(operand1) && isNumber(operand2) && Number(operand1) > Number(operand2);
        }

        function isNumber(operand) {
            return !isNaN(Number(operand));
        }

        function isString(operand) {
            return typeof operand === "string";
        }

        function isBoolean(operand) {
            return operand === "true" || operand === "false";
        }

        function toBoolean(operand) {
            return operand === "true";
        }
    };

    return {
        matchAll: _this.matchAll
    }
}();

Ntm.Tag = function() {
    var _this = {};

    _this.isExecutable = function(tag) {
        var allTriggersFired = tag.triggers.every(function(id) {
            return Ntm.Trigger.getById(id).fired;
        });

        var allExceptionsNotFired = tag.exceptions.every(function(id) {
            return !Ntm.Trigger.getById(id).fired;
        });

        return allTriggersFired && allExceptionsNotFired;
    };

    _this.run = function(tag) {
        if(!tag.enabled || !_this.isExecutable(tag)) return;

        switch(tag.type) {
            case "PLUGIN":
                _this.runPlugin(tag);
                break;

            case "SCRIPT":
                Ntm.Evaluator.evaluate({
                    type: "SCRIPT",
                    code: tag.code
                });
                Ntm.Variable.clearAddOnData();
                break;
        }
    };

    _this.runPlugin = function(t) {
        var tag = Ntm.Helper.copy(t);
        var addOnData = Ntm.Variable.getAddOnData();
        var parameters = variable(Ntm.Helper.extend(tag.parameters, addOnData.param));
        var cookies = variable(Ntm.Helper.extend(tag.cookies, addOnData.cookie));

        tag.type = "SCRIPT";
        tag.code = "function() { {{" + tag.pluginType + "}}.";

        switch(tag.logType) {
            case "EVENT":
                tag.code += "event(" + parameters + "," + cookies + ");";
                break;

            case "USER":
                tag.code += "user(" + parameters + ");";
                break;

            case "ORDER":
                tag.code += "order(" + parameters + ");";
                break;

            case "CANCEL":
                tag.code += "cancel(" + parameters + ");";
                break;

            case "CANCELALL":
                tag.code += "cancelAll(" + parameters + ");";
                break;

            case "CUSTOM":
                tag.code += "log('" + tag.path + "'," + parameters + "," + cookies + ");";
                break;
        }

        tag.code += "}";

        _this.run(tag);

        function variable(obj) {
            var result = '{';

            for(key in obj) {
                var v = Ntm.Helper.getVariableById(obj[key]);
                result += result.length > 1 ? ',' : '';
                result += '"' + key + '":';
                result += v ? ('{{' + v.name + '}}') : Ntm.Helper.stringify(obj[key]);
            }

            result += '}';

            return result;
        }
    };

    _this.runAll = function() {
        Ntm.Settings.tags.forEach(function(tag) {
            _this.run(tag);
        });
    };

    _this.hasTrigger = function(tag, event) {
        return tag.triggers.some(function(id) {
            return Ntm.Trigger.getById(id).event === event;
        });
    };

    _this.getAllTriggerIds = function(tag) {
        var result = tag.exceptions ? tag.exceptions : [];
        return result.concat(tag.triggers);
    };

    return {
        run: _this.run,
        runAll: _this.runAll,
        hasTrigger: _this.hasTrigger,
        getAllTriggerIds: _this.getAllTriggerIds
    }
}();

Ntm.Trigger = function() {
    var _this = {};

    _this.settings = Ntm.Settings;

    _this.init = function(event) {
        _this.settings.triggers.forEach(function(trigger) {
            if(event && event !== trigger.event) return;
            trigger.fired = false;
        });
    };

    _this.getById = function(id) {
        return Ntm.Helper.find(_this.settings.triggers, "id", id);
    };

    _this.listByEvent = function(event) {
        var result = [];

        _this.settings.triggers.forEach(function(trigger) {
            if(trigger.event === event) result.push(trigger);
        });

        return result;
    };

    return {
        init: _this.init,
        getById: _this.getById,
        listByEvent: _this.listByEvent
    }
}();

Ntm.Event = function() {
    var _this = {};

    _this.PAGE_LOADED = "PAGELOADED";
    _this.WINDOW_LOADED = "WINDOWLOADED";
    _this.DOM_READY = "DOMREADY";
    _this.ELEMENT_CLICKED = "ELEMENTCLICKED";
    _this.CLICKED = "CLICKED";
    _this.URL_CHANGED = "URLCHANGED";
    _this.HASH_CHANGED = "HASHCHANGED";
    _this.CUSTOM = "CUSTOM";

    _this.location = null;
    _this.clickHandlers = [];
    _this.rebindTimer = null;

    _this.init = function() {
        if(document.readyState === 'interactive' || document.readyState === 'complete') _this.onDomReady();
        else {
            document.addEventListener("DOMContentLoaded", function() {
                _this.onDomReady();
            });
        }

        window.addEventListener("load", function() {
            _this.onWindowLoaded();
        });

        window.addEventListener("hashchange", function(event) {
            _this.onHashChanged(event);
        })
    };

    _this.registerObserver = function() {
        var interval = 0;
        
        if(interval <= 0 && window.MutationObserver) {
            var observer = new MutationObserver(function(mutations) {
                clearTimeout(_this.rebindTimer);
                _this.rebindTimer = setTimeout(_this.rebind, 100);
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
        else setInterval(_this.rebind, interval > 0 ? interval : 1000);
    };

    _this.bind = function() {
        document.addEventListener("click", function(event) {
            _this.handleForClick(event, event.target);
        });
    };

    _this.rebind = function() {
        var triggers = Ntm.Trigger.listByEvent(_this.ELEMENT_CLICKED);

        triggers.forEach(function(trigger) {
            var elements = _this.querySelectorAll(trigger.selector);

            for (var i = 0; i < elements.length; i++) {
                _this.clickHandlers.forEach(function(handler) {
                    elements[i].removeEventListener("click", handler);
                });
            }
        });

        _this.clickHandlers = [];

        triggers.forEach(function(trigger) {
            var elements = _this.querySelectorAll(trigger.selector);

            for (var i = 0; i < elements.length; i++) {
                var handler = function(event) {
                    _this.handleForElementClick(event, event.currentTarget, trigger);
                };

                elements[i].addEventListener("click", handler);
                _this.clickHandlers.push(handler);
            }
        });

        _this.manageLocation();

        //Ntm.Console.log("rebinded: " + _this.clickHandlers.length);
    };

    _this.manageLocation = function() {
        if(_this.location != window.location.href) _this.onUrlChanged();
        _this.location = window.location.href;
    };

    _this.querySelectorAll = function(selector) {
        var elements = [];


        _this.querySelectorAllAsArray(document, selector).forEach(function(element) {
            elements.push(element);
        });

        _this.querySelectorAllAsArray(document, "iframe").forEach(function(iframe) {
            try {
                _this.querySelectorAllAsArray(iframe.contentWindow.document, selector).forEach(function (element) {
                    elements.push(element);
                });
            }
            catch(e) {
                Ntm.Console.log("cannot bind events because of CORS problems");
            }
        });

        return elements;
    };

    _this.querySelectorAllAsArray = function(documentBase, selector) {
        var elements = documentBase.querySelectorAll(selector);
        if(elements.forEach === undefined) elements = Array.prototype.slice.call(elements);
        return elements ? elements : [];
    };

    _this.onPageLoaded = function() {
        Ntm.Console.log('%c EVENT >> PAGELOADED ', 'background:#2196F3;color:white');
        _this.location = window.location.href;
        _this.handle(_this.PAGE_LOADED);
    };

    _this.onDomReady = function() {
        Ntm.Console.log('%c EVENT >> DOMREADY ', 'background:#2196F3;color:white');
        _this.registerObserver();
        _this.bind();
        _this.rebind();
        _this.handle(_this.DOM_READY);
    };

    _this.onWindowLoaded = function() {
        Ntm.Console.log('%c EVENT >> WINDOWLOADED ', 'background:#2196F3;color:white');
        _this.handle(_this.WINDOW_LOADED);
    };

    _this.onUrlChanged = function() {
        Ntm.Console.log('%c EVENT >> URLCHANGED ', 'background:#2196F3;color:white');
        _this.handle(_this.URL_CHANGED);
    };

    _this.onHashChanged = function() {
        Ntm.Console.log('%c EVENT >> HASHCHANGED ', 'background:#2196F3;color:white');
        _this.handle(_this.HASH_CHANGED);
    };

    _this.handle = function(eventType, trigger) {
        Ntm.Trigger.init();

        var triggers = trigger ? [trigger] : Ntm.Trigger.listByEvent(eventType);

        triggers.forEach(function(trigger) {
            if(_this.match(trigger.target) && Ntm.Matcher.matchAll(trigger.conditions)) trigger.fired = true;
        });

        Ntm.Tag.runAll();
    };

    _this.handleForElementClick = function(event, target, trigger) {
        Ntm.Console.log('%c EVENT >> %s ', 'background:#2196F3;color:white', _this.ELEMENT_CLICKED, event.clientX, event.clientY, target);
        Ntm.Variable.setClickEvent(event, target);
        _this.handle(_this.ELEMENT_CLICKED, trigger);
    };

    _this.handleForClick = function(event, target) {
        Ntm.Console.log('%c EVENT >> %s ', 'background:#2196F3;color:white', _this.CLICKED, event.clientX, event.clientY, target);

        Ntm.Settings.tags.forEach(function(tag) {
            if(!Ntm.Tag.hasTrigger(tag, _this.CLICKED)) return;

            Ntm.Trigger.init(_this.CLICKED);

            Ntm.Tag.getAllTriggerIds(tag).forEach(function(triggerId) {
                var trigger = Ntm.Trigger.getById(triggerId);
                if(!trigger.event || trigger.event !== _this.CLICKED) return;

                Ntm.Variable.setClickEvent(event, target);
                if(_this.match(trigger.target) && Ntm.Matcher.matchAll(trigger.conditions)) trigger.fired = true;
            });

            Ntm.Tag.run(tag);
        });

        Ntm.Trigger.init();
    };

    _this.handleForUserDefined = function(name, data) {
        Ntm.Console.log('%c EVENT >> CUSTOM : ', 'background:#2196F3;color:white', name, data);

        Ntm.Trigger.init();
        Ntm.Variable.setCustomData(data);

        Ntm.Trigger.listByEvent(_this.CUSTOM).forEach(function(trigger) {
            if(trigger.eventName === name && Ntm.Matcher.matchAll(trigger.conditions)) trigger.fired = true;
        });

        Ntm.Tag.runAll();
    };

    _this.match = function(tagName) {
        if(tagName) {
            var target = Ntm.Variable.get("clickElement");

            while(target) {
                if(target.tagName.toUpperCase() === tagName.toUpperCase()) {
                    Ntm.Variable.setClickTarget(target);
                    return true;
                }

                target = target.parentElement;
            }

            return false;
        }

        return true;
    };

    return {
        init: _this.init,
        firePageLoaded: _this.onPageLoaded,
        fireClicked: function(event) {
            _this.handleForClick(event, event.target);
        },
        fireUserDefined: _this.handleForUserDefined
    }
}();

Ntm.Preview = function() {
    var _this = {
        previewMode: false,
        containerId: ""
    };

    _this.init = function(preview, id) {
        if(!preview) Ntm.Cookie.remove(id);

        _this.previewMode = preview;
        _this.containerId = id;

        if(!preview) return;

        _this.showPreviewBanner();
    };

    _this.showPreviewBanner = function() {
        var frame = _this.makeFrame();

        var lastNode = document.body && document.body.lastChild || document.body || document.head;
        lastNode.parentNode.insertBefore(frame, lastNode);

        var frameDocument = frame.document;
        if (frame.contentDocument) frameDocument = frame.contentDocument;
        else if (frame.contentWindow) frameDocument = frame.contentWindow.document;

        if(frameDocument) {
            var html =
                '<p style="float:left; padding-left:20px; font-size:15px; font-weight: bold; margin-top:12px">誘몃━蹂닿린 紐⑤뱶</p>' +
                '<p style="float:right; padding-right:20px; font-size:12px; margin-top:15px">理쒓렐 ?섏젙: ' + Ntm.Settings.lastModified + '</p>';

            frameDocument.open();
            frameDocument.writeln(html);
            frameDocument.close();
        }

        Ntm.Console.log('%c PREVIEW MODE ', 'background:#F44336;color:white');
    };

    _this.isPreviewMode = function() {
        return _this.previewMode;
    };

    _this.getContainerId = function() {
        return _this.containerId;
    };

    _this.makeFrame = function() {
        var iframe = document.createElement('iframe');
        iframe.src = 'about:blank';
        iframe.style.position = 'fixed';
        iframe.style.width = '100%';
        iframe.style.height = '60px';
        iframe.style.bottom = '0';
        iframe.style.borderTop = '1px solid #eee';
        iframe.style.borderRight = '0';
        iframe.style.borderLeft = '0';
        iframe.style.borderBottom = '0';
        iframe.style.margin = '0';
        iframe.style.padding = '0';
        iframe.style.visibility = 'visible';
        iframe.style.backgroundColor = '#fffacc';
        iframe.style.visible = '1';
        iframe.style.zIndex = '2147483647';
        return iframe;
    };

    return {
        init: _this.init,
        isPreviewMode: _this.isPreviewMode,
        getContainerId: _this.getContainerId
    }
}();

Ntm.Plugin = {};

Ntm.Plugin.nlogger = (function() {
    var _this = {};

    _this.serviceId = "WC-SHCARD";
    _this.baseUrlHttp = "http://wcl.shinhancard.com/nlog";
    _this.baseUrlHttps = "https://wcl.shinhancard.com/nlog";
    _this.previewServiceId = "wcpreview";
    _this.previewCotainerKey = "nth_cid";
    _this.previewTimeKey = "nth_time";
    _this.cookieKeys = [ {
  "cookie" : "PCID",
  "logging" : "PCID",
  "removable" : false,
  "required" : true,
  "always" : false,
  "builtin" : false
}, {
  "cookie" : "wiselog_id",
  "logging" : "wiselog_id",
  "removable" : false,
  "required" : false,
  "always" : false,
  "builtin" : false
}, {
  "cookie" : "sno",
  "logging" : "sno",
  "removable" : true,
  "required" : false,
  "always" : false,
  "builtin" : false
}, {
  "cookie" : null,
  "logging" : "nth_sdk",
  "removable" : false,
  "required" : false,
  "always" : false,
  "builtin" : true
}, {
  "cookie" : null,
  "logging" : "nth_locale_lang",
  "removable" : false,
  "required" : false,
  "always" : false,
  "builtin" : true
}, {
  "cookie" : null,
  "logging" : "nth_locale_country",
  "removable" : false,
  "required" : false,
  "always" : false,
  "builtin" : true
}, {
  "cookie" : null,
  "logging" : "nth_resolution",
  "removable" : false,
  "required" : false,
  "always" : false,
  "builtin" : true
}, {
  "cookie" : null,
  "logging" : "nth_screen_id",
  "removable" : false,
  "required" : false,
  "always" : false,
  "builtin" : true
}, {
  "cookie" : null,
  "logging" : "nth_screen_title",
  "removable" : false,
  "required" : false,
  "always" : false,
  "builtin" : true
} ];
    _this.cookieDomain = "shinhancard.com";

    _this.loggingByXhr = true;
    _this.withCredentials = false;
    _this.requestMethod = "get";
    _this.requestTimeout = 1000;
    _this.requestQueueSize = 10;
    _this.sessionStorageKey = "__nlogger__";

    _this.log = function(path, params, cookies, options, serviceId) {
        _this.send(_this.makeUrl("/log/event", path, params, cookies, serviceId), options);
    };

    _this.event = function(params, cookies, serviceId) {
        _this.send(_this.makeUrl("/log/event", null, params, cookies, serviceId));
    };

    _this.user = function(params) {
        _this.send(_this.makeUrl("/user", null, params));
    };

    _this.order = function(params) {
        _this.send(_this.makeUrl("/order/request", null, params));
    };

    _this.cancel = function(params) {
        _this.send(_this.makeUrl("/order/cancel", null, params));
    };

    _this.cancelAll = function(params) {
        _this.send(_this.makeUrl("/order/cancel-all", null, params));
    };

    _this.send = function(url, options) {
        if(_this.loggingByXhr) _this.sendByXhr(url);
        else {
            options = _this.extend({
                async: true,
                onSuccess: null,
                onError: null,
                callBackTimeOutAsMillis: 400
            }, options);

            _this.sendByTag(url, options);
        }
    };

    _this.makeUrl = function(action, path, params, cookies, serviceId) {
        var preview = Ntm.Preview.isPreviewMode();
        var baseUrl = window.location.protocol === "https:" ? _this.baseUrlHttps : _this.baseUrlHttp;
        var query = _this.toQueryString(params, true);
        var url = window.location.protocol + "//" + _this.getDomainWithPort();
        var hash;

        if(path) url += "/" + path;
        else {
            url += window.location.pathname + window.location.search;

            if(window.location.hash) {
                if(!window.location.search || window.location.hash.indexOf("?") >=0) url = window.location.href;
                else hash = window.location.hash;
            }
        }

        if(query) {
            url += url.indexOf("?") < 0 ? "?" : "&";
            url += query;
        }

        if(hash) url += hash;

        cookies = _this.extend(cookies, _this.getCookies());

        addCookie('nth_sdk', 'WEB');
        addCookie('nth_locale_lang', _this.getLocaleLanguage());
        addCookie('nth_locale_country', _this.getLocaleCountry());
        addCookie('nth_resolution', _this.getResolution());
        addCookie('nth_screen_id', document.location.pathname);
        addCookie('nth_screen_title', document.title);

        if(preview) {
            addCookie(_this.previewCotainerKey, Ntm.Preview.getContainerId());
            addCookie(_this.previewTimeKey, new Date().getTime());
        }

        params = {
            s: preview ? _this.previewServiceId : (serviceId ? serviceId : _this.serviceId),
            u: url,
            r: _this.getReferer(),
            a: navigator.userAgent,
            c: _this.toCookieString(cookies, true),
            v: _this.cacheBuster()
        };

        return baseUrl + action + "?" + _this.toQueryString(params, true);

        function addCookie(key, value) {
            if(!isReserved(key) && !isRequired(key)) return;

            var cookie = {};
            cookie[key] = value;

            cookies = _this.extend(cookie, cookies);
        }

        function isReserved(loggingKey) {
            return loggingKey === _this.previewCotainerKey || loggingKey === _this.previewTimeKey;
        }

        function isRequired(loggingKey) {
            for (var index = 0; index < _this.cookieKeys.length; index++) {
                var cookieKey = _this.cookieKeys[index];
                if (cookieKey.logging === loggingKey) return cookieKey.required;
            }

            return false;
        }
    };

    _this.getReferer = function() {
        var ref = self.document.referrer;
        var parentHref = "";
        var parentRef = "";

        try {
            parentHref = top.document.location.href;
            parentRef = top.document.referrer;
        } catch (e) {
            return ref;
        }

        if(ref === parentHref) return parentRef;

        return ref;
    };

    _this.getDomainWithPort = function() {
        var port = location.port;
        if (port === undefined || port === "" || port === "0" || port === 0) return document.domain;
        return document.domain + ":" + port;
    };

    _this.getDomain = function() {
        var domain = document.domain;
        if(_this.isIpType(domain)) return domain;

        var tokens = domain.split('.');
        var length = tokens.length;
        if(length !== 4 && length !== 3) return domain;

        var dm = tokens[length - 2] + '.' + tokens[length - 1];
        return tokens[length - 1].length === 2 ? tokens[length - 3] + '.' + dm : dm;
    };

    _this.isIpType = function(domain) {
        var ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        return ipRegex.test(domain);
    };

    _this.getResolution = function() {
        var screenSize = "";
        var screen = window.screen;

        if(screen != null && typeof screen === "object") {
            screenSize = screen.width + "x" + screen.height;
        }

        return screenSize;
    };

    _this.getLocaleLanguage = function() {
        var tokens = _this.getLanguage().split("-");
        return tokens.length > 0 ? tokens[0] : "";
    };

    _this.getLocaleCountry = function() {
        var tokens = _this.getLanguage().split("-");
        return tokens.length > 1 ? tokens[1] : "";
    };

    _this.getLanguage = function() {
        var language = "-";
        var navigator = window.navigator;

        if(navigator.language) language = navigator.language.toLowerCase();
        else if(navigator.userLanguage) language = navigator.userLanguage.toLowerCase();

        return language;
    };

    _this.getCookies = function() {
        var result = {};

        for(var index = 0; index < _this.cookieKeys.length; index++) {
            var keyPair = _this.cookieKeys[index];

            if(keyPair.builtin) continue;

            var value = _this.getCookie(keyPair.cookie);

            if(!value) {
                if(!keyPair.required) continue;
                value = _this.generateUuid();
                setUuid(keyPair.cookie, value);
                if(!keyPair.always) continue;
            }

            result[keyPair.logging] = value;
        }

        return result;

        function setUuid(key, value) {
            var date = new Date();
            var options = {
                path: "/",
                expires: date
            };

            if(!_this.cookieDomain) options.domain = _this.getDomain();
            else if(_this.cookieDomain !== "default") options.domain = _this.cookieDomain;

            date.setFullYear(date.getFullYear() + 10);
            _this.setCookie(key, value, options);
        }
    };

    _this.getCookie = function(key) {
        var result = new RegExp('(?:^|; )' + key + '=([^;]*)').exec(document.cookie);
        return (result != null) ? decodeURIComponent(result[1]) : null;
    };

    _this.setCookie = function(key, value, options) {
        if(!options) options = {};

        var expires = options.expires;
        var path = options.path;
        var domain = options.domain;

        document.cookie = key + '=' + encodeURIComponent(value) + ';' +
            (expires ? 'expires=' + expires.toUTCString() + ';' : '') +
            (path ? 'path=' + path + ';' : '') +
            (domain ? 'domain=' + domain : '');
    };

    _this.deleteCookie = function(key) {
        document.cookie = key + '=; expires=Thu, 01-Jan-1970 00:00:01 GMT;';
    };

    _this.generateUuid = function() {
        var result = "";

        if(typeof window.crypto != 'undefined' && typeof window.crypto.getRandomValues != 'undefined') {
            var buf = new Uint16Array(8);
            window.crypto.getRandomValues(buf);
            var S4 = function (num) {
                var ret = num.toString(16);
                while (ret.length < 4) {
                    ret = "0" + ret;
                }
                return ret;
            };

            result = (S4(buf[0]) + S4(buf[1]) + "-" + S4(buf[2]) + "-"
            + S4(buf[3]) + "-" + S4(buf[4]) + "-" + S4(buf[5])
            + S4(buf[6]) + S4(buf[7]));
        }
        else {
            result = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
                function (c) {
                    var r = Math.random() * 16 | 0, v = c == 'x' ? r
                        : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
        }

        return result + '-' + new Date().getTime();
    };

    _this.sendByTag = function(url, options) {
        var element = _this.createScriptElement(url, options);
        _this.appendElement(element);
        _this.removeElement(element);
    };

    _this.sendByXhr = function(url) {
        try {
            _this.addRequest(url);
            _this.sendAllRequests();
        } catch(e) {
            console.log("send error", e);
        }
    };

    _this.createScriptElement = function(src, options) {
        var element = document.createElement('script');
        element.type = 'text/javascript';
        element.src = src;
        element.async = options.async;
        element.charset = 'UTF-8';

        if(options.onSuccess) {
            if(typeof element.onreadystatechange !== 'undefined') {
                element.onreadystatechange = function() {
                    if(this.readyState === 'complete' || this.readyState === 'loaded')
                        setTimeout(options.onSuccess, options.callBackTimeOutAsMillis);
                };
            }
            else {
                element.onload = function() {
                    setTimeout(options.onSuccess, options.callBackTimeOutAsMillis);
                };
            }
        }

        if(options.onError) {
            element.onerror = function() {
                setTimeout(options.onError, options.callBackTimeOutAsMillis);
            };
        }

        return element;
    };

    _this.appendElement = function(element) {
        var ssc = document.getElementsByTagName('script')[0];
        ssc.parentNode.insertBefore(element, ssc);
    };

    _this.removeElement = function(element) {
        if(typeof element.remove === 'function') element.remove();
        else element.parentNode.removeChild(element);   // For IE
    };

    _this.sendAllRequests = function() {
        var requests = _this.getRequests();

        for(var i = 0; i < requests.length; i++) {
            _this.sendRequest(requests[i]);
        }

        _this.clearRequests();
    };

    _this.sendRequest = function(url) {
        var xhr = _this.createXmlHttpRequest();
        if (!xhr) return false;

        xhr.withCredentials = _this.withCredentials;

        var timer = setTimeout(function() {
            xhr.abort();
        }, _this.requestTimeout);

        if(_this.requestMethod.trim().toLowerCase() === "post") {
            var parts = url.split("?");
            xhr.open("POST", parts[0], true);
            if(xhr.setRequestHeader) xhr.setRequestHeader("Content-type", "text/plain");
            xhr.send(parts[1]);
        }
        else {
            xhr.open("GET", url, true);
            xhr.send(null);
        }

        xhr.onload = function () {
            clearTimeout(timer);
        };

        xhr.onerror = xhr.onabort = function () {
            clearTimeout(timer);
            _this.addRequest(url);
        };
    };

    _this.createXmlHttpRequest = function() {
        var xhr;
        var xhrs = [
            function() {return new XDomainRequest()},
            function() {return new XMLHttpRequest()},
            function() {return new ActiveXObject("Msxml2.XMLHTTP")},
            function() {return new ActiveXObject("Msxml3.XMLHTTP")},
            function() {return new ActiveXObject("Microsoft.XMLHTTP")}
        ];

        for (var i = 0; i < xhrs.length; i++) {
            try {
                xhr = xhrs[i]();
            }
            catch (e) {
                continue;
            }
            break;
        }

        return xhr;
    };

    _this.addRequest = function(url) {
        var requests = _this.getRequests();
        if(Object.keys(requests).length >= _this.requestQueueSize) return;
        requests.push(url);
        _this.setRequests(requests);
    };

    _this.clearRequests = function() {
        _this.setRequests([]);
    };

    _this.getRequests = function() {
        var data = sessionStorage.getItem(_this.sessionStorageKey);
        return JSON.parse(data ? data : "[]");
    };

    _this.setRequests = function(requests) {
        sessionStorage.setItem(_this.sessionStorageKey, Ntm.Helper.stringify(requests));
    };

    _this.cacheBuster = function() {
        return Math.round(Math.random() * 1999083012);
    };

    _this.extend = function() {
        var extended = {};

        for(var index = 0; index < arguments.length; index++) {
            var source = arguments[index];

            for(var prop in source) {
                if(Object.prototype.hasOwnProperty.call(source, prop))
                    extended[prop] = source[prop];
            }
        }

        return extended;
    };

    _this.toQueryString = function(obj, skipNull) {
        return _this.objectToString(obj, "&", skipNull);
    };

    _this.toCookieString = function(obj, skipNull) {
        return _this.objectToString(obj, "; ", skipNull);
    };

    _this.objectToString = function(obj, delimeter, skipNull) {
        var result = "";

        for(var prop in obj) {
            if(Object.prototype.hasOwnProperty.call(obj, prop)) {
                if(skipNull && !obj[prop]) continue;

                if(result.length > 0) result += delimeter;
                result += prop + "=" + encodeURIComponent(obj[prop]);
            }
        }

        return result;
    };

    return {
        log: _this.log,
        event: _this.event,
        user: _this.user,
        order: _this.order,
        cancel: _this.cancel,
        cancelAll: _this.cancelAll,
        generateUuid: _this.generateUuid
    };
})();



Ntm.Main = function() {
    var disabled = false;
    var preview = false;
    var id = 79728;

    if(disabled) return;
    if(!Ntm.Helper.isValidSettings()) return;

    Ntm.Preview.init(preview, id);
    Ntm.Event.firePageLoaded();
    Ntm.Event.init();
}();