/**
* @description 프론트엔드 프레임워크(개인 홈페이지 통합)
* @author 정용석
* @version 0.1
*  @since 2019.9
*/

// Underscore.js 1.8.3
// http://underscorejs.org
// (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
// Underscore may be freely distributed under the MIT license.
(function () { function n(n) { function t(t, r, e, u, i, o) { for (; i >= 0 && o > i; i += n) { var a = u ? u[i] : i; e = r(e, t[a], a, t) } return e } return function (r, e, u, i) { e = b(e, i, 4); var o = !k(r) && m.keys(r), a = (o || r).length, c = n > 0 ? 0 : a - 1; return arguments.length < 3 && (u = r[o ? o[c] : c], c += n), t(r, e, u, o, c, a) } } function t(n) { return function (t, r, e) { r = x(r, e); for (var u = O(t), i = n > 0 ? 0 : u - 1; i >= 0 && u > i; i += n)if (r(t[i], i, t)) return i; return -1 } } function r(n, t, r) { return function (e, u, i) { var o = 0, a = O(e); if ("number" == typeof i) n > 0 ? o = i >= 0 ? i : Math.max(i + a, o) : a = i >= 0 ? Math.min(i + 1, a) : i + a + 1; else if (r && i && a) return i = r(e, u), e[i] === u ? i : -1; if (u !== u) return i = t(l.call(e, o, a), m.isNaN), i >= 0 ? i + o : -1; for (i = n > 0 ? o : a - 1; i >= 0 && a > i; i += n)if (e[i] === u) return i; return -1 } } function e(n, t) { var r = I.length, e = n.constructor, u = m.isFunction(e) && e.prototype || a, i = "constructor"; for (m.has(n, i) && !m.contains(t, i) && t.push(i); r--;)i = I[r], i in n && n[i] !== u[i] && !m.contains(t, i) && t.push(i) } var u = this, i = u._, o = Array.prototype, a = Object.prototype, c = Function.prototype, f = o.push, l = o.slice, s = a.toString, p = a.hasOwnProperty, h = Array.isArray, v = Object.keys, g = c.bind, y = Object.create, d = function () { }, m = function (n) { return n instanceof m ? n : this instanceof m ? void (this._wrapped = n) : new m(n) }; "undefined" != typeof exports ? ("undefined" != typeof module && module.exports && (exports = module.exports = m), exports._ = m) : u._ = m, m.VERSION = "1.8.3"; var b = function (n, t, r) { if (t === void 0) return n; switch (null == r ? 3 : r) { case 1: return function (r) { return n.call(t, r) }; case 2: return function (r, e) { return n.call(t, r, e) }; case 3: return function (r, e, u) { return n.call(t, r, e, u) }; case 4: return function (r, e, u, i) { return n.call(t, r, e, u, i) } }return function () { return n.apply(t, arguments) } }, x = function (n, t, r) { return null == n ? m.identity : m.isFunction(n) ? b(n, t, r) : m.isObject(n) ? m.matcher(n) : m.property(n) }; m.iteratee = function (n, t) { return x(n, t, 1 / 0) }; var _ = function (n, t) { return function (r) { var e = arguments.length; if (2 > e || null == r) return r; for (var u = 1; e > u; u++)for (var i = arguments[u], o = n(i), a = o.length, c = 0; a > c; c++) { var f = o[c]; t && r[f] !== void 0 || (r[f] = i[f]) } return r } }, j = function (n) { if (!m.isObject(n)) return {}; if (y) return y(n); d.prototype = n; var t = new d; return d.prototype = null, t }, w = function (n) { return function (t) { return null == t ? void 0 : t[n] } }, A = Math.pow(2, 53) - 1, O = w("length"), k = function (n) { var t = O(n); return "number" == typeof t && t >= 0 && A >= t }; m.each = m.forEach = function (n, t, r) { t = b(t, r); var e, u; if (k(n)) for (e = 0, u = n.length; u > e; e++)t(n[e], e, n); else { var i = m.keys(n); for (e = 0, u = i.length; u > e; e++)t(n[i[e]], i[e], n) } return n }, m.map = m.collect = function (n, t, r) { t = x(t, r); for (var e = !k(n) && m.keys(n), u = (e || n).length, i = Array(u), o = 0; u > o; o++) { var a = e ? e[o] : o; i[o] = t(n[a], a, n) } return i }, m.reduce = m.foldl = m.inject = n(1), m.reduceRight = m.foldr = n(-1), m.find = m.detect = function (n, t, r) { var e; return e = k(n) ? m.findIndex(n, t, r) : m.findKey(n, t, r), e !== void 0 && e !== -1 ? n[e] : void 0 }, m.filter = m.select = function (n, t, r) { var e = []; return t = x(t, r), m.each(n, function (n, r, u) { t(n, r, u) && e.push(n) }), e }, m.reject = function (n, t, r) { return m.filter(n, m.negate(x(t)), r) }, m.every = m.all = function (n, t, r) { t = x(t, r); for (var e = !k(n) && m.keys(n), u = (e || n).length, i = 0; u > i; i++) { var o = e ? e[i] : i; if (!t(n[o], o, n)) return !1 } return !0 }, m.some = m.any = function (n, t, r) { t = x(t, r); for (var e = !k(n) && m.keys(n), u = (e || n).length, i = 0; u > i; i++) { var o = e ? e[i] : i; if (t(n[o], o, n)) return !0 } return !1 }, m.contains = m.includes = m.include = function (n, t, r, e) { return k(n) || (n = m.values(n)), ("number" != typeof r || e) && (r = 0), m.indexOf(n, t, r) >= 0 }, m.invoke = function (n, t) { var r = l.call(arguments, 2), e = m.isFunction(t); return m.map(n, function (n) { var u = e ? t : n[t]; return null == u ? u : u.apply(n, r) }) }, m.pluck = function (n, t) { return m.map(n, m.property(t)) }, m.where = function (n, t) { return m.filter(n, m.matcher(t)) }, m.findWhere = function (n, t) { return m.find(n, m.matcher(t)) }, m.max = function (n, t, r) { var e, u, i = -1 / 0, o = -1 / 0; if (null == t && null != n) { n = k(n) ? n : m.values(n); for (var a = 0, c = n.length; c > a; a++)e = n[a], e > i && (i = e) } else t = x(t, r), m.each(n, function (n, r, e) { u = t(n, r, e), (u > o || u === -1 / 0 && i === -1 / 0) && (i = n, o = u) }); return i }, m.min = function (n, t, r) { var e, u, i = 1 / 0, o = 1 / 0; if (null == t && null != n) { n = k(n) ? n : m.values(n); for (var a = 0, c = n.length; c > a; a++)e = n[a], i > e && (i = e) } else t = x(t, r), m.each(n, function (n, r, e) { u = t(n, r, e), (o > u || 1 / 0 === u && 1 / 0 === i) && (i = n, o = u) }); return i }, m.shuffle = function (n) { for (var t, r = k(n) ? n : m.values(n), e = r.length, u = Array(e), i = 0; e > i; i++)t = m.random(0, i), t !== i && (u[i] = u[t]), u[t] = r[i]; return u }, m.sample = function (n, t, r) { return null == t || r ? (k(n) || (n = m.values(n)), n[m.random(n.length - 1)]) : m.shuffle(n).slice(0, Math.max(0, t)) }, m.sortBy = function (n, t, r) { return t = x(t, r), m.pluck(m.map(n, function (n, r, e) { return { value: n, index: r, criteria: t(n, r, e) } }).sort(function (n, t) { var r = n.criteria, e = t.criteria; if (r !== e) { if (r > e || r === void 0) return 1; if (e > r || e === void 0) return -1 } return n.index - t.index }), "value") }; var F = function (n) { return function (t, r, e) { var u = {}; return r = x(r, e), m.each(t, function (e, i) { var o = r(e, i, t); n(u, e, o) }), u } }; m.groupBy = F(function (n, t, r) { m.has(n, r) ? n[r].push(t) : n[r] = [t] }), m.indexBy = F(function (n, t, r) { n[r] = t }), m.countBy = F(function (n, t, r) { m.has(n, r) ? n[r]++ : n[r] = 1 }), m.toArray = function (n) { return n ? m.isArray(n) ? l.call(n) : k(n) ? m.map(n, m.identity) : m.values(n) : [] }, m.size = function (n) { return null == n ? 0 : k(n) ? n.length : m.keys(n).length }, m.partition = function (n, t, r) { t = x(t, r); var e = [], u = []; return m.each(n, function (n, r, i) { (t(n, r, i) ? e : u).push(n) }), [e, u] }, m.first = m.head = m.take = function (n, t, r) { return null == n ? void 0 : null == t || r ? n[0] : m.initial(n, n.length - t) }, m.initial = function (n, t, r) { return l.call(n, 0, Math.max(0, n.length - (null == t || r ? 1 : t))) }, m.last = function (n, t, r) { return null == n ? void 0 : null == t || r ? n[n.length - 1] : m.rest(n, Math.max(0, n.length - t)) }, m.rest = m.tail = m.drop = function (n, t, r) { return l.call(n, null == t || r ? 1 : t) }, m.compact = function (n) { return m.filter(n, m.identity) }; var S = function (n, t, r, e) { for (var u = [], i = 0, o = e || 0, a = O(n); a > o; o++) { var c = n[o]; if (k(c) && (m.isArray(c) || m.isArguments(c))) { t || (c = S(c, t, r)); var f = 0, l = c.length; for (u.length += l; l > f;)u[i++] = c[f++] } else r || (u[i++] = c) } return u }; m.flatten = function (n, t) { return S(n, t, !1) }, m.without = function (n) { return m.difference(n, l.call(arguments, 1)) }, m.uniq = m.unique = function (n, t, r, e) { m.isBoolean(t) || (e = r, r = t, t = !1), null != r && (r = x(r, e)); for (var u = [], i = [], o = 0, a = O(n); a > o; o++) { var c = n[o], f = r ? r(c, o, n) : c; t ? (o && i === f || u.push(c), i = f) : r ? m.contains(i, f) || (i.push(f), u.push(c)) : m.contains(u, c) || u.push(c) } return u }, m.union = function () { return m.uniq(S(arguments, !0, !0)) }, m.intersection = function (n) { for (var t = [], r = arguments.length, e = 0, u = O(n); u > e; e++) { var i = n[e]; if (!m.contains(t, i)) { for (var o = 1; r > o && m.contains(arguments[o], i); o++); o === r && t.push(i) } } return t }, m.difference = function (n) { var t = S(arguments, !0, !0, 1); return m.filter(n, function (n) { return !m.contains(t, n) }) }, m.zip = function () { return m.unzip(arguments) }, m.unzip = function (n) { for (var t = n && m.max(n, O).length || 0, r = Array(t), e = 0; t > e; e++)r[e] = m.pluck(n, e); return r }, m.object = function (n, t) { for (var r = {}, e = 0, u = O(n); u > e; e++)t ? r[n[e]] = t[e] : r[n[e][0]] = n[e][1]; return r }, m.findIndex = t(1), m.findLastIndex = t(-1), m.sortedIndex = function (n, t, r, e) { r = x(r, e, 1); for (var u = r(t), i = 0, o = O(n); o > i;) { var a = Math.floor((i + o) / 2); r(n[a]) < u ? i = a + 1 : o = a } return i }, m.indexOf = r(1, m.findIndex, m.sortedIndex), m.lastIndexOf = r(-1, m.findLastIndex), m.range = function (n, t, r) { null == t && (t = n || 0, n = 0), r = r || 1; for (var e = Math.max(Math.ceil((t - n) / r), 0), u = Array(e), i = 0; e > i; i++ , n += r)u[i] = n; return u }; var E = function (n, t, r, e, u) { if (!(e instanceof t)) return n.apply(r, u); var i = j(n.prototype), o = n.apply(i, u); return m.isObject(o) ? o : i }; m.bind = function (n, t) { if (g && n.bind === g) return g.apply(n, l.call(arguments, 1)); if (!m.isFunction(n)) throw new TypeError("Bind must be called on a function"); var r = l.call(arguments, 2), e = function () { return E(n, e, t, this, r.concat(l.call(arguments))) }; return e }, m.partial = function (n) { var t = l.call(arguments, 1), r = function () { for (var e = 0, u = t.length, i = Array(u), o = 0; u > o; o++)i[o] = t[o] === m ? arguments[e++] : t[o]; for (; e < arguments.length;)i.push(arguments[e++]); return E(n, r, this, this, i) }; return r }, m.bindAll = function (n) { var t, r, e = arguments.length; if (1 >= e) throw new Error("bindAll must be passed function names"); for (t = 1; e > t; t++)r = arguments[t], n[r] = m.bind(n[r], n); return n }, m.memoize = function (n, t) { var r = function (e) { var u = r.cache, i = "" + (t ? t.apply(this, arguments) : e); return m.has(u, i) || (u[i] = n.apply(this, arguments)), u[i] }; return r.cache = {}, r }, m.delay = function (n, t) { var r = l.call(arguments, 2); return setTimeout(function () { return n.apply(null, r) }, t) }, m.defer = m.partial(m.delay, m, 1), m.throttle = function (n, t, r) { var e, u, i, o = null, a = 0; r || (r = {}); var c = function () { a = r.leading === !1 ? 0 : m.now(), o = null, i = n.apply(e, u), o || (e = u = null) }; return function () { var f = m.now(); a || r.leading !== !1 || (a = f); var l = t - (f - a); return e = this, u = arguments, 0 >= l || l > t ? (o && (clearTimeout(o), o = null), a = f, i = n.apply(e, u), o || (e = u = null)) : o || r.trailing === !1 || (o = setTimeout(c, l)), i } }, m.debounce = function (n, t, r) { var e, u, i, o, a, c = function () { var f = m.now() - o; t > f && f >= 0 ? e = setTimeout(c, t - f) : (e = null, r || (a = n.apply(i, u), e || (i = u = null))) }; return function () { i = this, u = arguments, o = m.now(); var f = r && !e; return e || (e = setTimeout(c, t)), f && (a = n.apply(i, u), i = u = null), a } }, m.wrap = function (n, t) { return m.partial(t, n) }, m.negate = function (n) { return function () { return !n.apply(this, arguments) } }, m.compose = function () { var n = arguments, t = n.length - 1; return function () { for (var r = t, e = n[t].apply(this, arguments); r--;)e = n[r].call(this, e); return e } }, m.after = function (n, t) { return function () { return --n < 1 ? t.apply(this, arguments) : void 0 } }, m.before = function (n, t) { var r; return function () { return --n > 0 && (r = t.apply(this, arguments)), 1 >= n && (t = null), r } }, m.once = m.partial(m.before, 2); var M = !{ toString: null }.propertyIsEnumerable("toString"), I = ["valueOf", "isPrototypeOf", "toString", "propertyIsEnumerable", "hasOwnProperty", "toLocaleString"]; m.keys = function (n) { if (!m.isObject(n)) return []; if (v) return v(n); var t = []; for (var r in n) m.has(n, r) && t.push(r); return M && e(n, t), t }, m.allKeys = function (n) { if (!m.isObject(n)) return []; var t = []; for (var r in n) t.push(r); return M && e(n, t), t }, m.values = function (n) { for (var t = m.keys(n), r = t.length, e = Array(r), u = 0; r > u; u++)e[u] = n[t[u]]; return e }, m.mapObject = function (n, t, r) { t = x(t, r); for (var e, u = m.keys(n), i = u.length, o = {}, a = 0; i > a; a++)e = u[a], o[e] = t(n[e], e, n); return o }, m.pairs = function (n) { for (var t = m.keys(n), r = t.length, e = Array(r), u = 0; r > u; u++)e[u] = [t[u], n[t[u]]]; return e }, m.invert = function (n) { for (var t = {}, r = m.keys(n), e = 0, u = r.length; u > e; e++)t[n[r[e]]] = r[e]; return t }, m.functions = m.methods = function (n) { var t = []; for (var r in n) m.isFunction(n[r]) && t.push(r); return t.sort() }, m.extend = _(m.allKeys), m.extendOwn = m.assign = _(m.keys), m.findKey = function (n, t, r) { t = x(t, r); for (var e, u = m.keys(n), i = 0, o = u.length; o > i; i++)if (e = u[i], t(n[e], e, n)) return e }, m.pick = function (n, t, r) { var e, u, i = {}, o = n; if (null == o) return i; m.isFunction(t) ? (u = m.allKeys(o), e = b(t, r)) : (u = S(arguments, !1, !1, 1), e = function (n, t, r) { return t in r }, o = Object(o)); for (var a = 0, c = u.length; c > a; a++) { var f = u[a], l = o[f]; e(l, f, o) && (i[f] = l) } return i }, m.omit = function (n, t, r) { if (m.isFunction(t)) t = m.negate(t); else { var e = m.map(S(arguments, !1, !1, 1), String); t = function (n, t) { return !m.contains(e, t) } } return m.pick(n, t, r) }, m.defaults = _(m.allKeys, !0), m.create = function (n, t) { var r = j(n); return t && m.extendOwn(r, t), r }, m.clone = function (n) { return m.isObject(n) ? m.isArray(n) ? n.slice() : m.extend({}, n) : n }, m.tap = function (n, t) { return t(n), n }, m.isMatch = function (n, t) { var r = m.keys(t), e = r.length; if (null == n) return !e; for (var u = Object(n), i = 0; e > i; i++) { var o = r[i]; if (t[o] !== u[o] || !(o in u)) return !1 } return !0 }; var N = function (n, t, r, e) { if (n === t) return 0 !== n || 1 / n === 1 / t; if (null == n || null == t) return n === t; n instanceof m && (n = n._wrapped), t instanceof m && (t = t._wrapped); var u = s.call(n); if (u !== s.call(t)) return !1; switch (u) { case "[object RegExp]": case "[object String]": return "" + n == "" + t; case "[object Number]": return +n !== +n ? +t !== +t : 0 === +n ? 1 / +n === 1 / t : +n === +t; case "[object Date]": case "[object Boolean]": return +n === +t }var i = "[object Array]" === u; if (!i) { if ("object" != typeof n || "object" != typeof t) return !1; var o = n.constructor, a = t.constructor; if (o !== a && !(m.isFunction(o) && o instanceof o && m.isFunction(a) && a instanceof a) && "constructor" in n && "constructor" in t) return !1 } r = r || [], e = e || []; for (var c = r.length; c--;)if (r[c] === n) return e[c] === t; if (r.push(n), e.push(t), i) { if (c = n.length, c !== t.length) return !1; for (; c--;)if (!N(n[c], t[c], r, e)) return !1 } else { var f, l = m.keys(n); if (c = l.length, m.keys(t).length !== c) return !1; for (; c--;)if (f = l[c], !m.has(t, f) || !N(n[f], t[f], r, e)) return !1 } return r.pop(), e.pop(), !0 }; m.isEqual = function (n, t) { return N(n, t) }, m.isEmpty = function (n) { return null == n ? !0 : k(n) && (m.isArray(n) || m.isString(n) || m.isArguments(n)) ? 0 === n.length : 0 === m.keys(n).length }, m.isElement = function (n) { return !(!n || 1 !== n.nodeType) }, m.isArray = h || function (n) { return "[object Array]" === s.call(n) }, m.isObject = function (n) { var t = typeof n; return "function" === t || "object" === t && !!n }, m.each(["Arguments", "Function", "String", "Number", "Date", "RegExp", "Error"], function (n) { m["is" + n] = function (t) { return s.call(t) === "[object " + n + "]" } }), m.isArguments(arguments) || (m.isArguments = function (n) { return m.has(n, "callee") }), "function" != typeof /./ && "object" != typeof Int8Array && (m.isFunction = function (n) { return "function" == typeof n || !1 }), m.isFinite = function (n) { return isFinite(n) && !isNaN(parseFloat(n)) }, m.isNaN = function (n) { return m.isNumber(n) && n !== +n }, m.isBoolean = function (n) { return n === !0 || n === !1 || "[object Boolean]" === s.call(n) }, m.isNull = function (n) { return null === n }, m.isUndefined = function (n) { return n === void 0 }, m.has = function (n, t) { return null != n && p.call(n, t) }, m.noConflict = function () { return u._ = i, this }, m.identity = function (n) { return n }, m.constant = function (n) { return function () { return n } }, m.noop = function () { }, m.property = w, m.propertyOf = function (n) { return null == n ? function () { } : function (t) { return n[t] } }, m.matcher = m.matches = function (n) { return n = m.extendOwn({}, n), function (t) { return m.isMatch(t, n) } }, m.times = function (n, t, r) { var e = Array(Math.max(0, n)); t = b(t, r, 1); for (var u = 0; n > u; u++)e[u] = t(u); return e }, m.random = function (n, t) { return null == t && (t = n, n = 0), n + Math.floor(window.crypto.getRandomValues(new Uint32Array(1))/4294967296 * (t - n + 1)) }, m.now = Date.now || function () { return (new Date).getTime() }; var B = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#x27;", "`": "&#x60;" }, T = m.invert(B), R = function (n) { var t = function (t) { return n[t] }, r = "(?:" + m.keys(n).join("|") + ")", e = RegExp(r), u = RegExp(r, "g"); return function (n) { return n = null == n ? "" : "" + n, e.test(n) ? n.replace(u, t) : n } }; m.escape = R(B), m.unescape = R(T), m.result = function (n, t, r) { var e = null == n ? void 0 : n[t]; return e === void 0 && (e = r), m.isFunction(e) ? e.call(n) : e }; var q = 0; m.uniqueId = function (n) { var t = ++q + ""; return n ? n + t : t }, m.templateSettings = { evaluate: /<%([\s\S]+?)%>/g, interpolate: /<%=([\s\S]+?)%>/g, escape: /<%-([\s\S]+?)%>/g }; var K = /(.)^/, z = { "'": "'", "\\": "\\", "\r": "r", "\n": "n", "\u2028": "u2028", "\u2029": "u2029" }, D = /\\|'|\r|\n|\u2028|\u2029/g, L = function (n) { return "\\" + z[n] }; m.template = function (n, t, r) { !t && r && (t = r), t = m.defaults({}, t, m.templateSettings); var e = RegExp([(t.escape || K).source, (t.interpolate || K).source, (t.evaluate || K).source].join("|") + "|$", "g"), u = 0, i = "__p+='"; n.replace(e, function (t, r, e, o, a) { return i += n.slice(u, a).replace(D, L), u = a + t.length, r ? i += "'+\n((__t=(" + r + "))==null?'':_.escape(__t))+\n'" : e ? i += "'+\n((__t=(" + e + "))==null?'':__t)+\n'" : o && (i += "';\n" + o + "\n__p+='"), t }), i += "';\n", t.variable || (i = "with(obj||{}){\n" + i + "}\n"), i = "var __t,__p='',__j=Array.prototype.join," + "print=function(){__p+=__j.call(arguments,'');};\n" + i + "return __p;\n"; try { var o = new Function(t.variable || "obj", "_", i) } catch (a) { throw a.source = i, a } var c = function (n) { return o.call(this, n, m) }, f = t.variable || "obj"; return c.source = "function(" + f + "){\n" + i + "}", c }, m.chain = function (n) { var t = m(n); return t._chain = !0, t }; var P = function (n, t) { return n._chain ? m(t).chain() : t }; m.mixin = function (n) { m.each(m.functions(n), function (t) { var r = m[t] = n[t]; m.prototype[t] = function () { var n = [this._wrapped]; return f.apply(n, arguments), P(this, r.apply(m, n)) } }) }, m.mixin(m), m.each(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function (n) { var t = o[n]; m.prototype[n] = function () { var r = this._wrapped; return t.apply(r, arguments), "shift" !== n && "splice" !== n || 0 !== r.length || delete r[0], P(this, r) } }), m.each(["concat", "join", "slice"], function (n) { var t = o[n]; m.prototype[n] = function () { return P(this, t.apply(this._wrapped, arguments)) } }), m.prototype.value = function () { return this._wrapped }, m.prototype.valueOf = m.prototype.toJSON = m.prototype.value, m.prototype.toString = function () { return "" + this._wrapped }, "function" == typeof define && define.amd && define("underscore", [], function () { return m }) }).call(this);
// @description shinhancard service
// @author S04674
// @version 0.4
//  since 2016.12

// jQuery Ajax Session Storage Cache Library v1.1
// https://github.com/alexfarrill
// Copyright 2011, Alex Farrill
// Modified by ysjung on November 3, 2019
(function(e){var s=function(t){if(t.ajax_options&&t.ajax_options.url){var o,a=s.options||{},i=a.namespace||"session-cache",n=a.skip_cache||!!t.skip_cache;if(this.ajax_options=e.extend({},t.ajax_options,{context:this,success:[t.ajax_options.success,this.cacheResponse]}),n)this.performAjax();else{if(!t.key)return void alert("ajax_ssc: missing required options");this.key=i+"-"+t.key,this.minutes_to_expiration=t.minutes_to_expiration,o=this.getSessionStorageCache(),!1===o?this.performAjax():e.proxy(t.ajax_options.success,this)(o)}}else alert("ajax_ssc: missing required options")};s.prototype.performAjax=function(){e.ajax(this.ajax_options)},s.prototype.supportsSessionStorage=function(){try{return!!sessionStorage.getItem}catch(e){return!1}},s.prototype.cacheResponse=function(e,s,t){var o=(new Date).getTime()+6e4*parseFloat(this.minutes_to_expiration),a=JSON.stringify({responseText:t.responseText,expires_at:o,dataType:t.responseJSON?"json":"text"});this.setSessionStorageCache(a)},s.prototype.getSessionStorageCache=function(){if(this.supportsSessionStorage()){var e,s,t=sessionStorage.getItem(this.key),o=(new Date).getTime();return!!t&&(e=JSON.parse(t),s=e.expires_at,Math.floor(s)>o&&("json"===e.dataType?JSON.parse(e.responseText):e.responseText))}return!1},s.prototype.setSessionStorageCache=function(e){this.key&&this.supportsSessionStorage()&&sessionStorage.setItem(this.key,e)},e.ajax_ssc=function(t){var o=e.extend({},e.ajax_ssc.defaults,t);new s(o)},e.ajax_ssc.defaults={minutes_to_expiration:10}})(jQuery);

!function (global) {


	 //C2020062975633 챗봇 UI 추가
	try{
		if(opener && opener.parent && opener.parent.shchatbotChecker && opener.parent.shchatbotChecker == true ){
			var str = window.navigator.userAgent;
			navigator.__defineGetter__('userAgent',function() {
				return str +' shchatbot';
			});
		}
		/*
		if(document.URL.indexOf("MOBFM149R01")> -1){
			var str = window.navigator.userAgent;
			navigator.__defineGetter__('userAgent',function() {
				return str.replace(/shchatbot/gi,'');
			});
		}
		*/
	}catch(e){
	}

	//C2020080699351 추가
	/*
	try{
		if(document.URL.indexOf("MOBFM001C01")> -1){
			var str = window.navigator.userAgent;
			navigator.__defineGetter__('userAgent',function() {
				return str.replace(/shchatbot/gi,'');
			});
		}
	}catch(e){
	}
	*/

	function error(n) {
		var e = new Error(n);
		e.name = 'ReferenceError';	// Deferred에서 exception시 log표시하기 위함.
		throw e;
	}
	function closePopup() {
		// 팝업닫힘
		if(_layerPopups.length > 0) {
			var n = _layerPopups.pop();
			var $popupBindView = $('#__flying_partition__ > [data-bind-view=' + n.name + ']');
			var $pop = $popupBindView.find('.pop_wrap');
			global.popClose && global.popClose($pop, function(){
				$popupBindView.remove();
			});
		}
	}
	function renderLoadingBar(show, txt) {
		$('#__flying_partition__ .progress').remove();
		$('#__flying_partition__ .dimmed_main').remove();
		if (show) {
			$('#__flying_partition__').append('<div id="loadingLayer" class="progress">'
                    + '<div class="dx_loading" aria-hidden="true"></div>'
                    + '<em class="hidden-text">로딩 중</em>'
                    + '<script src="/pconts/js/lottie.js"></script>'
                    + '<script>'
                      + 'var ani01 = bodymovin.loadAnimation({\n'
                          + 'container: document.querySelector(\'.dx_loading\'),\n'
                          + 'path: \'/pconts/images/dx/com/page_loading.json\',\n'
                          + 'renderer: \'svg\',\n'
                          + 'loop: true,\n'
                          + 'autoplay: true,\n'
                      + ' });'
                   + '</script>'
               + '</div>');
		}
	}
	/**
	 * @param bindingType 'bind' 또는 'plugin'
	 */
	function $getBindingElement(bindingType, viewName) {
		return $('[data-' + bindingType + '-view=' + viewName + ']');
	}

	/**
	 * BindingElement를 찾는 jQuery plugin
	 * @param bindingProp visible | class | attr | text | html | cms | value  등
	 * @param name
	 */
	jQuery.fn.findBindingElement = function(bindingProp, name) {
		if(this.length === 1) {
			var vo = this.data('svcVO');
			if(name) {
				return this.find('[data-' + vo.bindingType + '-' + bindingProp + '="' + name + '"]');
			} else {
				if(vo) {
					var q = '[data-' + vo.bindingType + '-view] [data-' + vo.bindingType + '-' + bindingProp + ']';
					var nestedEls = this.find(q);
					return this.find('[data-' + vo.bindingType + '-' + bindingProp + ']').not(nestedEls);
				}
			}
		}
		return $('');
	}

	function isRadioOrCheckbox(inputType) {
		return ('radio' == inputType || 'checkbox' == inputType) && true;
	}

	function loadHtml(url, option) {
		if (url) {
			return _service.http().html(url, option);
		} else {
			return function (dfd) {
				dfd.resolve();
				return dfd.promise();
			}($.Deferred());
		}
	}
	function h(n) {
		$log('history', n);
		$svc.get('ajax').form('/mob/cmm/COMMON/' + n + '.ajax', {}, false, true);
	}
	function nv(v) {
		return navigator.userAgent.toLowerCase().indexOf(v) > -1 ? v : ''
	}
	var initUI = _.debounce(function() {
		if (global.ui) {
			setTimeout(function () {
				global.ui.afterLoading();
				global.ui.formType();
			}, 1);
		}
	}, 100);

	function runExpression(expr, ref) {
		var e = ref;
		_.each(expr.split('.'), function (n) {
			if (n.indexOf('[') < 0) {
				if(void 0 == e[n]) {
					e[n]={};
				}
				return e = e[n];
			} else {
				_.each(n.replace(/\']/g, '').split("['"), function (n) {
					if(void 0 == e[n]) {
						e[n]={};
					}
					return e = e[n];
				});
			}
		});
	}

	function isValidExpression(expr, ref) {
		var e = _.clone(ref);
		var valid = true;
		_.each(expr.split('.'), function (n) {
			if (n.indexOf('[') < 0) {
				if(void 0 == e[n]) {
					valid = false;
					return false;
				}
				return e = e[n];
			} else {
				_.each(n.replace(/\']/g, '').split("['"), function (n) {
					if(void 0 == e[n]) {
						valid = false;
						return false;
					}
					return e = e[n];
				});
			}
		});
		return valid;
	}

	function createViewObject(bindingType, bindingObj) {
	!_.isObject(bindingObj) && error('bind type error::object 타입으로 입력');
	!bindingObj.name && error('bind type error:: name 항목은 필수 입력: ' + bindingType);

	var c = _.clone(bindingObj),
		_event = {}/* 함수 */,
		_eachTemplate = {}/* each템플릿 */,
		_eachValue = {}/* each데이터 */,
		_observerFuncs = {}/* 옵저버함수 */,
		lb = {}/* 옵저버체크 */,
		_lamp = {} /* 램프 */,
		_promoLinkList = [] /*cmslink 데이터*/

	var $view = $getBindingElement(bindingType, c.name);

	function loadCmslink(menuId) {
		var deffed = $.Deferred();

		if (menuId) {
			if (_promoLinkList && _promoLinkList.length > 0){
				loadCms();
			}
			_service.http().html('/pconts/json/promoLinkList.json').then(function(resJson){
				if (!resJson || !resJson.promoLinkList) {
					deffed.resolve();
					return;
				}

				_promoLinkList = resJson.promoLinkList;

				loadCms();
			});
		}else {
			deffed.resolve();
		}

		return deffed.promise();

		function loadCms(){
			for (var i=0; i<_promoLinkList.length; i++){
				var prmoLink = _promoLinkList[i];
				if (prmoLink.pageId == menuId) {
					loadHtml(prmoLink.promoUrl).then(function(res){
						deffed.resolve(res);
						return;
					});

					return;
				}
			}
			deffed.resolve();
		}
	}

	function update() {
		function dispatch(obj) {
			var ss = obj.v && obj.v.split(',');
			return Function('a', 'b', 'c',
				'a.' + obj.t.replace('(', '.call(' + (obj.v ? 'b' : 'a') + (obj.t.indexOf('()') < 0 ? ',' : '')).replace(')', ',c)'))(_event, ss && _eachValue[ss[0]][ss[1]], obj.e)
		}

		// ESC키 눌렀을 때 팝업 종료
		$(document).off('keyup.lpClose').on('keyup.lpClose', function(e) {
			if (e.keyCode == 27) {
				var $popupBindView = $('#__flying_partition__ > [data-bind-view]:visible:last')
				var $close = $popupBindView.data('$close');
				$close && $close();
			}
		});
		$('#__flying_partition__ .btn_close').off('click.lpClose').on('click.lpClose', function (e) {
			// 해당팝업의 $close를 호출함.
			var $popupBindView = $(e.currentTarget).closest('[data-bind-view]');
			var $close = $popupBindView.data('$close');
			$close && $close();
		});

		$view.findBindingElement('click').off('click.bindview').on('click.bindview', function (e) {
			if (!$(e.currentTarget).data(bindingType + 'Valid')) {
				dispatch({
					n: c.name,
					t: $(e.currentTarget).data(bindingType + 'Click'),
					v: $(e.currentTarget).data(bindingType + 'Item'),
					e: e
				});
			} else {
				if (!$(e.currentTarget).hasClass('btn_disabled')) {
					dispatch({
						n: c.name,
						t: $(e.currentTarget).data(bindingType + 'Click'),
						v: $(e.currentTarget).data(bindingType + 'Item'),
						e: e
					});
				}
			}
			if ($(e.currentTarget).attr('href')) {
				e.preventDefault();
			}
		});

		$view.findBindingElement('change').off('change.bindview').on('change.bindview', function (e) {
			dispatch({
				n: c.name,
				t: $(e.currentTarget).data(bindingType + 'Change'),
				v: $(e.currentTarget).data(bindingType + 'Item'),
				e: e
			});

			// 공통 UI에 아코디언 처리 이벤트 동작을 위한 예외처리
			if ($(e.currentTarget).closest('.radio_default').closest('.accordion_header').length == 0) return false;
		});

		_.each($view.findBindingElement('watch'), function (el) {
			return function (inputType, watchId) {
				var k = _.contains(['text', 'number', 'tel', 'password'], inputType) || el.tagName.toLowerCase() === 'textarea',
					stat = {};

				if (watchId) {
					$(el)
						.off('change.watch').on('change.watch', function (e) {
							var o = [];
							if (inputType) {
								_.each($('[data-' + bindingType + '-watch=' + watchId + ']'), function (n) {

									if ($(n).prop('checked')) {
										o.push($(n).val());
									}
								});
							} else {
								o = $(el).val();
							}

							if (_observerFuncs[watchId]) {
								lb[watchId] = _observerFuncs[watchId](k ? $(el).val() : o, lb, stat);
							}

							var $error = $(e.currentTarget);
							if ((window.bh && !window.bh.isRunning()) && $error.hasClass('inca_keypad')) {
								if (!lb[watchId]) {
									$error.addClass('error');
								} else {
									$error.removeClass('error');
								}
							}
						})
						.off('focus.watch').on('focus.watch', function (e) {
							// 빨간색 테두리 제거
							var $error;
							if(e.currentTarget.tagName === 'SELECT') {
								$error = $(e.currentTarget.parentElement);
							} else if(isRadioOrCheckbox(inputType)) {
								$error = $(e.currentTarget).closest('.radio_wrap, .check_wrap');
							} else {
								$error = $(e.currentTarget);
							}
							$error.removeClass('error');
						})
						.off('checkvalidation.watch').on('checkvalidation.watch', function (e) {
							// TODO: 어떤 경우인지 확인 필요
							if ($(e.currentTarget).prop('disabled')) {
								$(e.currentTarget.parentElement).addClass('focus');
								return;
							}

							if (_observerFuncs[watchId]) {
								lb[watchId] = _observerFuncs[watchId]($(el).val(), lb, stat);
							}

							// 빨간색 테두리 처리
							var $error;
							if(e.currentTarget.tagName === 'SELECT') {
								$error = $(e.currentTarget.parentElement);
							} else if(isRadioOrCheckbox(inputType)) {
								$error = $(e.currentTarget).closest('.radio_wrap, .check_wrap');
							} else {
								$error = $(e.currentTarget);
							}

							if (!deviceInfo.mobile) {
								if (!lb[watchId]) {
									$error.addClass('error');
								} else {
									$error.removeClass('error');
								}
							}
							return lb[watchId];
						})
						.off('blur.watch').on('blur.watch', function (e) {
							setTimeout(function () {
								$(e.currentTarget).trigger('checkvalidation');
							}, 50);
						})
						.off('paste.watch').on('paste.watch', function (e) {
							setTimeout(function () {
								$(e.currentTarget).trigger('checkvalidation');
							}, 50);
						})
						.off('keyup.watch').on('keyup.watch', function (n) {
							if (k && _observerFuncs[watchId]) {
								lb[watchId] = _observerFuncs[watchId]($(el).val(), lb, stat);
							}
						});
				}
			}($(el).attr('type'), $(el).data(bindingType + 'Watch'))
		});

		initUI();
	}

	var vo = {
		$view: $view,
		name: c.name,
		bindingType: bindingType,
		update: update,
		render: function (afterRender) {
			$view.length < 1 && error('엘리먼트 없음 view name:: ' + bindingType + ':: ' + c.name);
			$view.length > 1 && error('엘리먼트 중복 view name:: ' + bindingType + ':: ' + c.name);
			loadHtml(c.url).then(function (res) {
				if (c.url && res) {
					$view.html(res);
				}
				if (c.tpl) {
					$view.html(c.tpl);
				}

				c.beforeRender && c.beforeRender($view);

				$view.show();

				if(st.length > 0 && st.indexOf(c.name) > -1) {
					var cmmHeader = $svc.get('cmmHeader');
					cmmHeader.setTitle(cmmHeader.getTitle());

					ui && ui.quickTop && ui.quickTop.scrolled && ui.quickTop.scrolled();

                    // C2025021977775  pc홈페이지 모바일 홈페이지 웹접근성 심사 관련 대응 요청의건
                    // step2 이후에서 본문바로가기 시 step1으로 이동하는 문제 해결
                    setTimeout(function() {
                        $('#skipNavi, #skipNavi >a').off('click').on('click', function(event) {
                            event.preventDefault();
                            $('#container').attr("tabindex", 0).focus();
                        });
                    }, 1000);

				}

				_.each($view.findBindingElement('cms'), function (el) {
					return function (url) {
						loadHtml(url).then(function (res) {
							$(el).html(res);
							update();
						})
					}($(el).data(bindingType + 'Cms'));
				});

				_.each($view.findBindingElement('cmslink'), function (el) {
					return function (pageId) {
						loadCmslink(pageId).then(function (res) {
							$(el).html(res);
							update();
						})
					}($(el).data(bindingType + 'Cmslink'));
				});

				_.each($view.findBindingElement('each'), function (el) {
					_.each($(el).find('[data-' + bindingType + '-click]'), function (t) {
						$(t).attr('data-' + bindingType + '-item', $(el).data(bindingType + 'Each') + ',{{=$index}}');
					});

					_.each($(el).find('[data-' + bindingType + '-change]'), function (t) {
						$(t).attr('data-' + bindingType + '-item', $(el).data(bindingType + 'Each') + ',{{=$index}}');
					});

					_.each($(el).find('[data-' + bindingType + '-each]'), function (t) {
						$(t).html('{{ _.each(' + $(t).data(bindingType + 'Each') + ',function($val,$key){ }}' + $(t).html() + '{{ }) }}');
					});

					_eachTemplate[$(el).data(bindingType + 'Each')] = _.template($(el).html());

					$(el).html('');

					if(el.tagName == 'SELECT') {
						global.selectJS.update(el);
					}
				});

				_.each($view.findBindingElement('text'), function (el) {
					$(el).text('');
				});

				_.each($view.findBindingElement('html'), function (el) {
					$(el).html('');
				});

				_.each($view.findBindingElement('visible'), function (el) {
					$(el).hide();
				});

				_.each($view.findBindingElement('disabled'), function (el) {
					$(el).prop('disabled', true);
				});

				_.each($view.findBindingElement('lamp'), function (el) {
					$(el).hide();
				});

				if (_.isFunction(afterRender)) {
					afterRender();
				}

				if($view.find('.pop_wrap').length > 0) {
					if (global.ui) {
						global.ui.layerComm.open();
					}
				}

				setTimeout(function () {
					update();
				}, 100);
			});
		},
		pull: function () {
			var data = {};
			_.each($view.findBindingElement('value'), function (el) {
				return function (expr, inputType) {
					runExpression(expr, data);
					Function('a', 'b',
						isRadioOrCheckbox(inputType) ? '_.isEmpty(b.' + expr + ')&&(b.' + expr + '=[]), $(a).is(":checked")&&b.' + expr + '.push($(a).val())'
							: 'b.' + expr + '=$(a).val()')(el, data);
				}($(el).data(bindingType + 'Value'), $(el).attr('type'));
			});
			return data;
		},
		push: function (data) {
			function evalExpr(el, expr, onceNotEqualListKey) {
				var i, variable, constant;
				var onceNotEqualList = $(el).data(onceNotEqualListKey);
				for(i=0;i<ops.length;i++) {
					if(expr.indexOf(ops[i]) > -1) {
						var n = expr.split(ops[i]);
						variable = n[0].trim();
						constant = n[1].trim().replace(/'/g, '');
						runExpression(variable, cloneData);
						// !=일때 variable이 push내용에 없어도 true되도록 처리하기 위한 코드
						if(ops[i] == '!=' && !onceNotEqualList) {
							$(el).data(onceNotEqualListKey, true);
							return Function('a', 'return _.isBoolean(a.' + expr + ')?a.' + expr + ':undefined')(cloneData);
						} else {
							return Function('a', 'b', 'return _.isObject(a.' + variable + ')&&_.isEmpty(a.' + variable + ')?undefined:a.' + variable + ops[i] + 'b')(cloneData, constant);
						}
					}
				}
				// 일치하는 연산자가 없으면, boolean 처리
				if(i == ops.length) {
					// variable or !variable
					var notEq = '';
					if(expr.charAt(0) === '!') {
						expr = expr.substr(1);
						notEq = '!';
					}

					runExpression(expr, cloneData);

					if(notEq == '!' && !onceNotEqualList) {
						$(el).data(onceNotEqualListKey, true);
						return Function('a', 'return _.isBoolean(a.' + expr + ')? ' + notEq + '(a.' + expr + '):true')(cloneData);
					} else {
						return Function('a', 'return _.isBoolean(a.' + expr + ')? ' + notEq + '(a.' + expr + '):undefined')(cloneData);
					}
				}
			}

			if (_.isObject(data)) {
				var data = _.clone(data);
				global.$index = 0;
				global.$data = {};

				_.each($view.findBindingElement('each'), function (el) {
					(function (expr) {
						if (expr) {
							if(!isValidExpression(expr, data)) {
								return;
							}

							var html = '',
								template = _eachTemplate[expr],
								o = Function('a', 'return a.' + expr)(data);
							if (_.isArray(o)) {
								_eachValue[expr] = o;
								_.each(o, function (data, index) {
									global.$index = index;
									global.$data = data;
									html += template(data);
								})
								$(el).html(html);
							}
						}
					})($(el).data(bindingType + 'Each'));

					(function (expr) {
						if (expr) {
							if(!isValidExpression(expr, data)) {
								return;
							}
							Function('a', 'b', '!_.isObject(b.' + expr + ')&&$(a).val(b.' + expr + ')')(el, data);
						}
					})($(el).data(bindingType + 'Selected'));

					// 1. global selectJS 확인
					if(global.selectJS) {
						// 2. select 확인
						if(el.tagName == 'SELECT') {
							global.selectJS.update(el);
						}
					}
				});

				_.each($view.findBindingElement('text'), function (el) {
					(function (expr) {
						if (expr) {
							if(!isValidExpression(expr, data)) {
								return;
							}

							Function('a', 'b', '!_.isObject(b.' + expr + ')&&$(a).text(b.' + expr + ')')(el, data);
						}
					})($(el).data(bindingType + 'Text'));
				});

				_.each($view.findBindingElement('html'), function (el) {
					(function (expr) {
						if (expr) {
							if(!isValidExpression(expr, data)) {
								return;
							}

							Function('a', 'b', '!_.isObject(b.' + expr + ')&&$(a).html(b.' + expr + ')')(el, data);
						}
					})($(el).data(bindingType + 'Html'));
				});

				_.each($view.findBindingElement('value'), function (el) {
					(function (expr, inputType) {
						if (expr) {
							if(!isValidExpression(expr, data)) {
								return;
							}

							if(isRadioOrCheckbox(inputType) && el.name) {
								var $view = $(el).closest('[data-' + bindingType + '-view]');
								var $els = $view.find('[name="' + el.name + '"]');
								Function('a', 'b', '$(a).val(b.' + expr + ')')($els, data);
							} else {
								Function('a', 'b', '_.isObject(b.' + expr + ')?!_.isEmpty(b.' + expr + ')&&$(a).val(b.' + expr + '):$(a).val(b.' + expr + ')')(el, data);
							}
						}
					})($(el).data(bindingType + 'Value'), $(el).attr('type'));

					// 1. global selectJS 확인
					if(global.selectJS) {
						// 2. select 확인
						if(el.tagName == 'SELECT') {
							global.selectJS.update(el);
						}
					}
				});

				var cloneData = _.clone(data);
				_.each($view.findBindingElement('attr'), function (el) {
					(function (expr) {
						if (expr) {
							runExpression(expr, cloneData);
							Function('a', 'b', '!_.isEmpty(b.' + expr + ')&&$(a).attr(b.' + expr + ')')(el, cloneData);
						}
					})($(el).data(bindingType + 'Attr'));
				});

				var ops = ['==', '!=', '>=', '<=', '>', '<'];	// 연산자
				_.each($view.findBindingElement('class'), function (el) {
					(function (exprBig) {
						if (exprBig) {
							try {
								_.each(exprBig.split(','), function (e) {
									var a = e.split(':');
									var className = a[0].trim();
									var expr = a[1].trim();
									var result = evalExpr(el, expr, 'onceNotEqualListForClass');
									if(typeof result !== 'undefined') {
										if(result) {
											$(el).addClass(className);
										} else {
											$(el).removeClass(className);
										}
									}
								});
							} catch(e) {
								console.error(e);
							}
						}
					})($(el).data(bindingType + 'Class'));
				});

				_.each($view.findBindingElement('visible'), function (el) {
					(function (expr) {
						if (!expr) return;

						try {
							var visible = evalExpr(el, expr, 'onceNotEqualListForVisible');
							if(typeof visible !== 'undefined') {
								if (visible) {
									$(el).show();
								} else {
									$(el).hide();
								}
							}
						} catch(e) {
							console.error(e);
						}

					})($(el).data(bindingType + 'Visible'));
				});

				_.each($view.findBindingElement('disabled'), function (el) {
					(function (expr) {
						if (!expr) return;

						try {
							var disabled = evalExpr(el, expr, 'onceNotEqualListForDisabled');
							if(typeof disabled !== 'undefined') {
								if (disabled) {
									$(el).prop('disabled', true);
								} else {
									$(el).prop('disabled', false);
								}
							}
						} catch(e) {
							console.error(e);
						}

					})($(el).data(bindingType + 'Disabled'));
				});

				delete global.$index;
				delete global.$data;
				update();
			}
		},
		lamp: function (lampId, obj, isValid) {
			if (!obj) return;

			if (obj.text) {	// invalid임.
				_.each($view.findBindingElement('lamp'), function (el) {
					if (lampId == $(el).data(bindingType + 'Lamp')) {
						$(el).text(obj.text).show();
					}
				});
			} else if(obj.html) {
				_.each($view.findBindingElement('lamp'), function (el) {
					if (lampId == $(el).data(bindingType + 'Lamp')) {
						$(el).html(obj.html).show();
					}
				})
			} else {
				_.each($view.findBindingElement('lamp'), function (el) {
					if (lampId == $(el).data(bindingType + 'Lamp')) {
						$(el).hide();
					}
				});
			}
			if(isValid) {
				_lamp[lampId] = true;
			} else {
				_lamp[lampId] = false;
			}

			if(obj.valid) {
				var validLamps = [];
				_.each(obj.fixed, function (nn) {
					if (_lamp[nn]) {
						validLamps.push(nn);
					}
				});

				if(_.isFunction(obj.valid)) {
					if(obj.fixed && obj.fixed.length == validLamps.length) {
						obj.valid(true);
					} else {
						obj.valid(false);
					}
				} else {
					_.each($view.findBindingElement('valid'), function (el) {
						if (obj.valid == $(el).data(bindingType + 'Valid')) {
							if(obj.fixed && obj.fixed.length == validLamps.length) {
								$(el).prop('disabled', false);
							} else {
								$(el).prop('disabled', true);
							}
						}
					});
				}
			}
			return isValid;
		},
		event: function () {
			return _event = {};
		},
		getAllObjects: function() {
			return {
				events: _event,
				eachTemplate: _eachTemplate,
				eachValue: _eachValue,
				watches: _observerFuncs,
				lamps: lb
			};
		},
		focus: function (e) {
			var sl;
			if (_.isString(e)) {
				var $el = $view.findBindingElement('focus', e);
				if ($el.length > 0) {
					sl = $el;
				}
			} else {
				if(e) {
					sl = e.currentTarget;
				}
			}
			if(sl) {
				$(sl).after('<a href="#" id="focusLure"></a>');
				$('#focusLure').focus();
				setTimeout(function () {
					$(sl).focus();
					$('#focusLure').remove();
				}, 10);
			}
		},
		watch: function (watchId, cb) {
			if (watchId && _.isFunction(cb)) {
				_observerFuncs[watchId] = cb;
				lb[watchId] = false;
			}
		},
		triggerWatch: function (watchId) {
			return $view.findBindingElement('watch', watchId).triggerHandler('checkvalidation');
		}
	};
	$view.data('svcVO', vo);

	return vo;
	}

	var _$svc = function (n) {
		return n instanceof _$svc ? n : this instanceof _$svc ? void (this._svc = n) : new _$svc(n);
	};

	'undefined' != typeof exports ?
		(
			'undefined' != typeof module && module.exports && (exports = module.exports = _$svc),
			exports.$svc = _$svc
		)
		: global.$svc = _$svc;

	// {{ }}, {{=expression}}, {{-expression}}
	_.templateSettings = {
		evaluate: /\{\{(.+?)\}\}/g,
		interpolate: /\{\{=(.+?)\}\}/g,
		escape: /\{\{-(.+?)\}\}/g
	};

	var _service = {}/* 서비스 */,
		_view = {}/* 뷰 */,
		_plugin = {}/* 플러그인 */,
		_popup = {}/* 팝업 */,
		_bootstrap = {}/* 부트스트랩 */,
		_historyback = {}/* 히스토리백 */,
		_layerPopups = []/* 레이어팝업 */,
		lk = {}/* CMS경로 */,
		st = []/* 스텝관리 */,
		loadingBarCount = 0,
		log = false;

	_$svc.getAllObjects = function() {
		return {
			view : _view,
			plugin : _plugin,
			popup : _popup,
			service : _service
		};
	}
	_$svc.debug = function (onff) {
		log = onff;
	};
	_$svc.backStep = function (name, cb) {
		_historyback[name] = cb;
	};
	_$svc.reload = function (step) {
		setTimeout(function () {
			location.reload();
		}, 200);
		$('body').hide();
		h('frontReload');
		if (step) {
			history.go((step - 1) * -1);
		}
	};
	_$svc.startView = _$svc.bootstrap = function (name, lib) {
		if (name) {
			_bootstrap = {
				name: name,
				lib: lib
			};
		}
	};
	_$svc.get = function (serviceId) {
		return _service[serviceId]();
	};
	_$svc.bind = function (obj) {
		return createViewObject(obj.plugin ? "plugin" : "bind", obj);
	};
	_$svc.service = function (serviceId, cb) {
		_service[serviceId] && error('중복 등록 service: ' + serviceId);
		_service[serviceId] = cb;
	};
	_$svc.view = function (name, cb) {
		_view[name] && error('중복 등록 view: ' + name);
		_view[name] = cb;
	};
	_$svc.plugin = function (name, cb) {
		_plugin[name] && error('중복 등록 plugin: ' + name);
		_plugin[name] = cb;
	};
	_$svc.popup = function (name, cb) {
		_popup[name] && error('중복 등록 popup: ' + name);
		_popup[name] = cb;
	};
	_$svc.loadingBar = function (show, text) {
		renderLoadingBar(show, text || '');

		$('#__flying_partition__ [data-party-dimmed]').remove();

		if(show) {
			$('#__flying_partition__ >div:last').before('<div data-party-dimmed="" class="layer_dimmed type white_bg" style="z-index:1100;display:block;"></div>');
		} else {
			$('#__flying_partition__ .layer_dimmed').removeClass('type2');
		}
	};
	_$svc.serviceReady = function(callback) {
		if(_$svc._serviceReady) {
			callback();
		} else {
			$(document).on('service-ready', callback);
		}
	}

	_service.ajax = function () {
		function getUrl(url, cached) {
			return url + (cached ? '' : '?v=' + _.now());
		}
		function encodeParam(n) {
			return _.map(n, function (n, t) {
				return [t, '=', encodeURIComponent(n)].join('');
			}).join('&');
		}
		return {
			html: function (url, sync, cached, option) {
				return function (dfd) {
					if (url) {

						var ajax_options = {
							async: !sync,
							type: 'get',
							contentType: 'text/html',
							dataType: /\.jso?n?/.test(url) ? 'json' : 'html',
							url: getUrl(url, cached),
							success: function (res) {
								dfd.resolve(res);
							},
							error: function (res) {
								if (res.status == 200) {
									var obj = {};
									try {
										obj = JSON.parse(res.responseText);
									} catch(e) {
									}
									dfd.resolve(obj);
								} else {
									dfd.reject(res);
								}
							}
						};

						var options = {
							ajax_options: ajax_options
						};

						if(_.isObject(option) && _.isObject(option.cache)) {
							options.skip_cache = false;
							options.key = url;
							if(option.cache.minutes_to_expiration) {
								options.minutes_to_expiration = option.cache.minutes_to_expiration;
							}
						} else {
							options.skip_cache = true;
						}

						$.ajax_ssc(options);

					} else {
						dfd.resolve();
					}
					return dfd.promise();
				}($.Deferred());
			},
			form: function (url, param, sync, isSubmit, cache) {
				return function (dfd) {
					var ajax_options = {
						async: !sync,
						type: 'post',
						contentType: 'application/x-www-form-urlencoded;charset=utf-8',
						url: getUrl(url, true),
						data: isSubmit ? encodeParam(param) : 'mbw_json=' + encodeURIComponent(JSON.stringify(param)),
						success: function (res) {
							dfd.resolve({ data: res || {}, status: 200 })
						},
						error: function (res) {
							dfd.resolve({ status: 200 == res.status ? 500 : res.status });
						}
					};

					var options = {
						ajax_options: ajax_options
					};

					if(_.isObject(cache)) {
						options.skip_cache = false;
						options.key = url;
						if(cache.minutes_to_expiration) {
							options.minutes_to_expiration = cache.minutes_to_expiration;
						}
					} else {
						options.skip_cache = true;
					}

					$.ajax_ssc(options);
					return dfd.promise();
				}($.Deferred());
			},

			form_: function (url, param, sync, isSubmit, cache, headers) {
			    return function (dfd) {
                    var ajax_options = {
                        async: !sync,
                        type: 'post',
                        headers,
                        contentType: 'application/x-www-form-urlencoded;charset=utf-8',
                        url: getUrl(url, true),
                        data: isSubmit ? encodeParam(param) : 'mbw_json=' + encodeURIComponent(JSON.stringify(param)),
                        success: function (res) {
                            dfd.resolve({ data: res || {}, status: 200 })
                        },
                        error: function (res) {
                            dfd.resolve({ status: 200 == res.status ? 500 : res.status });
                        }
                    };

                    var options = {
                        ajax_options: ajax_options
                    };

                    if(_.isObject(cache)) {
                        options.skip_cache = false;
                        options.key = url;
                        if(cache.minutes_to_expiration) {
                            options.minutes_to_expiration = cache.minutes_to_expiration;
                        }
                    } else {
                        options.skip_cache = true;
                    }

                    $.ajax_ssc(options);
                    return dfd.promise();
                }($.Deferred());
			}
		}
	};
	_service.http = function () {
		function showLoadingBar(loadingbarState) {

            // ajax, submit 처리 시 loadingBarCount 초기화가 되지않아
            // loading 생성 안될때 강제 초기화
			if (loadingbarState == 'force'){
			    loadingBarCount = 0;
			}

			if (loadingbarState != 'not') {
				setTimeout(function () {
					if (loadingBarCount++ < 1) {
						_$svc.loadingBar(true);
					}
					if (loadingbarState && 'on' == loadingbarState) {
						loadingBarCount++;
					}
				}, 1);
			}
		}
		function hideLoadingBar(loadingbarState) {
			if (loadingbarState != 'not') {
				setTimeout(function () {
					if (loadingbarState && 'off' == loadingbarState) {
						--loadingBarCount;
					}
					if (--loadingBarCount < 1) {
						loadingBarCount = 0;
						_$svc.loadingBar(false);
					}
				}, 1);
			}
		}

        // ajax callback
		function ajaxFormSubmit_callback(v, url, option, dfd) {
            $log('%chttp:: ' + url + '\n', 'color:#33d;', v.data);
            hideLoadingBar(option.loadingbarState);

            setTimeout(function () {
                if (200 != v.status) {
                    $log('통신 에러가 발생했습니다.');
                    return dfd.reject();
                }
                if (!v.data) {
                    $log('데이터 수신중 에러가 발생했습니다.', url);
                    return dfd.reject();
                }
                if (!v.data.mbw_result) {
                    $log('데이터 수신 결과가 존재하지 않습니다.', url);
                    return dfd.reject();
                }
                if ("S" != v.data.mbw_result.toUpperCase()) {
                    if(!String.prototype.endsWith){
                        String.prototype.endsWith=function(searchString, position){
                            var subjectString = this.toString();
                            if((typeof position !== 'number') || (!isFinite(position))|| (Math.floor(position)!==position)||(position>subjectString.length)){
                                position=subjectString.length;
                            }

                            position-=searchString.length;
                            var lastIndex=subjectString.indexOf(searchString,position);
                            return lastIndex!==1&&lastIndex===position;
                        }
                    }
                    if(v.data.mbw_message.endsWith('certNotExist')){
                        $svc.get('popup').guide('등록된 공동인증서만 로그인 가능합니다.','처음 한 번만 등록하면 편리하게 로그인 할 수 있습니다.','공동인증서 등록하기')
                        .then(function(){
                            $svc.get('location').href(v.data.mbw_returnurl);
                        });
                        return;
                    }
                    if(!option.skipAlert) {

                        // ajax 오류팝업발생 전 lpAlert영역이 이미 있으면 오류방지를 위해 팝업닫기 추가
                        if( _layerPopups.length == 1 && _layerPopups[0].name == 'lpAlert' ){
                            closePopup();
                        }

                        setTimeout(function () {
                            $svc.get('popup').alert(v.data.mbw_message.replace(/\\n/g, '<br/>') || '데이터 처리중 에러가 발생했습니다.')
                            .then(function () {
                                if (_.contains(['scwi.err.com.cmm.authlogin', 'scwi.err.com.cmm.duplogin'], v.data.mbw_code)) {
                                    $svc.get('location').goLogin();
                                } else {
                                    dfd.reject(v.data);
                                }
                            });
                        }, 500);
                    } else {
                        dfd.reject(v.data);
                    }
                    return;
                }
                dfd.resolve(v.data.mbw_json)
            }, 50)
        }

		function ajaxFormSubmit(url, param, option, headers) {
			return function (dfd) {
				if (!url) {
					$svc.get('popup').alert('URL이 입력되지 않았습니다.').then(function () {
						dfd.reject()
					});
					return dfd.promise();
				}

				showLoadingBar(option.loadingbarState);
				$log('%chttp:: ' + url + '\n', 'color:#d33;', param);

                if (typeof headers !== 'undefined')
                    _service.ajax().form_(url, param || {}, false, option.isSubmit, option.cache, headers).then(v => ajaxFormSubmit_callback(v, url, option, dfd));
                else
				    _service.ajax().form(url, param || {}, false, option.isSubmit, option.cache).then(v => ajaxFormSubmit_callback(v, url, option, dfd));

				return dfd.promise();

			}($.Deferred());
		}

		if ($('#__flying_partition__').length < 1) {
			$('body').append('<div id="__flying_partition__"></div>');
		}

		return {
			json: function (url, param, option, headers) {

			    if (typeof headers !== 'undefined') {
                    return ajaxFormSubmit(url, param, {
                        isSubmit: false
                    }, headers);
			    }

			    if (typeof option === 'undefined') {
                    return ajaxFormSubmit(url, param, {
                        isSubmit: false
                    });
                } else if(typeof option === 'string') {
                    return ajaxFormSubmit(url, param, {
                        isSubmit: false,
                        loadingbarState: option
                    });
                }

				return ajaxFormSubmit(url, param, {
					isSubmit: false,
					loadingbarState: option.loadingbarState,
					skipAlert: option.skipAlert,
					cache: option.cache
				});
			},
			submit: function (url, param, option, headers) {

			    if (typeof headers !== 'undefined') {
                    return ajaxFormSubmit(url, param, {
                        isSubmit: false
                    }, headers);
                }

				if(typeof option === 'undefined') {
					return ajaxFormSubmit(url, param, {
						isSubmit: true
					});
				} else if(typeof option === 'string') {
					return ajaxFormSubmit(url, param, {
						isSubmit: true,
						loadingbarState: option
					});
				}

				return ajaxFormSubmit(url, param, {
					isSubmit: true,
					loadingbarState: option.loadingbarState,
					skipAlert: option.skipAlert
				});
			},
			html: function (url, option) {

				var usingLoadingbar;
				if(_.isObject(option)) {
					usingLoadingbar = option.usingLoadingbar;
				} else {
					usingLoadingbar = option;
				}

				usingLoadingbar && showLoadingBar();
				return _service.ajax().html(url, false, false, option).then(function (res) {
					usingLoadingbar && hideLoadingBar();
					return res || '';
				});
			},
			cms: function (url, usingLoadingbar) {
				usingLoadingbar && showLoadingBar();
				return _service.ajax().html(lk.httpCms + url, false, false).then(function (res) {
					usingLoadingbar && hideLoadingBar();
					return res || '';
				});
			},
			search: function (url, param, usingLoadingbar) {
				url = url + (param ? '?' + _.map(param, function (v, k) { return v = k + '=' + v }).join('&') : '');
				usingLoadingbar && showLoadingBar();
				return _service.ajax().html(lk.httpSrch + url, false, true).then(function (res) {
					usingLoadingbar && hideLoadingBar();
					return res || '';
				});
			}
		};
	};
	_service.view = function () {
		var dfd = $.Deferred();
		return {
			load: function (v) {

                // 공통팝업을 닫지않고 페이지전환시 남아있는팝업영역을 삭제하여 오류 방지
                // 영향도 최소화를 위해 옵션값 설정부만 작동
                if( v.closePopup == true ){
                    closePopup();
                }

				!_view[v.name] && error('등록되지 않은 view 호출:: ' + v.name);

				var p = location.origin + location.pathname + '?' + _.map(function () {
					var sh = { vname: v.name };
					if (location.search) {
						_.each(location.search.replace(/\?/, '').split('&'), function (n, t) {
							var ss = n.split('=');
							sh[ss[0]] = (ss[0] == 'vname') ? v.name : ss[1];
						});
					}
					return sh;
				}(), function (n, t) {
					return [t, '=', n].join('');
				}).join('&');

                if (v.name != _bootstrap.name) {
                    if (!v.notHistory) {
//						history.pushState({ name: v.name, end: v.end }, '', p);
                        history.pushState({ name: v.name, end: v.end,  step:v.step}, '', p);
                        st.push(v.name);
                    }
                }
                if (v.end) {
                    history.pushState({ end: v.end }, '', p);
                    st.push(v.name);
                }

				_$svc.get('tracking').wLog(v);
				if (!v.append) {
					$('[data-bind-view]').hide();
				}

				if (_.isFunction(_view[v.name])) {
					_view[v.name](v.param, function (t) {
						$getBindingElement('bind', v.name).html('');
						history.back();
					});
				}

				if (global.$emnet[v.name]) {
					_$svc.get('tracking').emnetLog(global.$emnet[v.name]);
				}

				return dfd.promise()
			},
			getVO: function(v) {
				!_view[v.name] && error('등록되지 않은 view 호출:: ' + v.name);
				return $('[data-bind-view="' + v.name +'"]').data('svcVO');
			}
		}
	};

	_service.plugin = function () {
		return {
			load: function (n, e) {
				!_plugin[n.name] && error('등록되지 않은 plugin 호출:: ' + n.name);
				if (_.isFunction(_plugin[n.name])) {
					return _plugin[n.name](n.param, e);
				}
			},
			getVO: function(n) {
				!_plugin[n.name] && error('등록되지 않은 plugin 호출:: ' + n.name);
				return $('[data-plugin-view="' + n.name +'"]').data('svcVO');
			}
		}
	};
	_service.popup = function () {
		var r = {},
			dfd = $.Deferred();

		function arrangeBackgroundColor() {
			// 모든 팝업의 background-color는 background-color를 rgba(0,0,0,0)으로 변경
			$('#__flying_partition__ .pop_wrap').css('background-color', 'rgba(0,0,0,0)');

			var lastIndex = _layerPopups.length - 1;
			if(lastIndex >= 0) {
				// 마지막 팝업의 background-color의 style을 제거
				$('#__flying_partition__ [data-bind-view="' + _layerPopups[lastIndex].name + '"] .pop_wrap').css('background-color', '');

				if(lastIndex > 0) {
					// 마지막 팝업의 전 팝업의 background-color를 rgba(0,0,0,0.1)로 변경
					$('#__flying_partition__ [data-bind-view="' + _layerPopups[lastIndex - 1].name + '"] .pop_wrap').css('background-color', 'rgba(0,0,0,0.1)');
				}
			}
		}

		function open(n, u) {
			$getBindingElement('bind', n.name).length > 0 && error('중복 호출 popup element:: ' + n.name);

			if (!u) {
				$svc.get('tracking').wLog(n);
			}
			dfd = $.Deferred();
			r = n;

			_layerPopups.push(n);

			$('#__flying_partition__').append('<div data-bind-view="' + r.name + '">' + i(u) + '</div>');

			var $close = _.once(function(result) {
				closePopup();
				setTimeout(function () {
					dfd.resolve(result);
				}, 50);

				arrangeBackgroundColor();
			});
			var $popupBindView = $getBindingElement('bind', r.name);
			$popupBindView.data('$close', $close);

			arrangeBackgroundColor();

			_popup[r.name](r.param, $close);
			var $pop = $popupBindView.find('.pop_wrap');
			global.popOpen && global.popOpen($pop);

			return dfd.promise();
		}

		function i(n) {
			return {
				alert: '<div id="popSmallAlert" class="pop_wrap pop_alert" role="alertdialog" aria-modal="true" aria-describedby="popSmallAlertDesc"><article class="popup popup_type01"><div class="pop_cont"><div class="pop_msg"><p id="popSmallAlertDesc" data-bind-html="message"></p></div></div><div class="pop_btn btn_wrap"><button type="button" class="btn default blue" data-bind-click="close()">확인</button></div></article></div>'
				, confirm: '<div id="popSmallConfirm" class="pop_wrap pop_confirm" role="alertdialog" aria-modal="true" aria-describedby="popSmallConfirmDesc"><article class="popup popup_type01"><div class="pop_cont"><div class="pop_msg"><p id="popSmallConfirmDesc" data-bind-html="message"></p></div></div><div class="pop_btn btn_wrap btn_group pd_min"><button type="button" class="btn line_gray left" data-bind-click="no()"><span data-bind-text="btn.no">취소</span></button><button type="button" class="btn default blue" data-bind-click="yes()"><span data-bind-text="btn.yes">확인</span></button></div></article></div>'
				, guide: '<div id="popSmallAlert" class="pop_wrap pop_alert" role="alertdialog" aria-modal="true" aria-describedby="popSmallAlertDesc"><article class="popup popup_type01"><div class="pop_cont"><div class="pop_msg"><h3 id="popSmallAlertDesc" data-bind-html="title"></h3></div></div><div class="pop_cont"><div class="pop_msg"><p id="popSmallAlertDesc" data-bind-html="desc"></p></div></div><div class="pop_btn btn_wrap"><button type="button" class="btn default blue" data-bind-click="close()" data-bind-html="btnNm"></button></div></article></div>'
			}[n] || '';
		}

		if ($('#__flying_partition__').length < 1) {
			$('body').append('<div id="__flying_partition__"></div>');
		}

		return {
			open: open,
			guide:function(title,desc,btnNm,url){
				return open({
					name: 'lpAlert',
					param:{
						title:title,
						desc:desc,
						btnNm:btnNm
					}
				},'guide');
				
			},
			alert: function (message) {
				return open({
					name: 'lpAlert',
					param: {
						message: message
					}
				}, 'alert');
			},
			confirm: function (message, o) {
				return open({
					name: 'lpConfirm',
					param: {
						message: message,
						btn: {
							yes: (o && o.yes) || '확인',
							no: (o && o.no) || '취소'
						}
					}
				}, 'confirm');
			}
		}
	};

	global.$menu = {};
	global.$emnet = {};
	global.$wlog = { load: false };
	window.$GA4 = {};
	
	global.$log = function () {
		log && console.log.apply(console, _.toArray(arguments))
	}
	global.$dlog = function () {
		log && console.debug && console.debug.apply(console, _.toArray(arguments))
	}
	global.onpopstate = function (e) {
		var name = e.state ? e.state.name || _bootstrap.name : _bootstrap.name;
		if (e.state && e.state.end) {
			return history.go(-1 * (e.state.end));
		}
		st.pop();
		if (_historyback[name]) {
			_historyback[name](st);
		}

		$('[data-bind-view]').hide();
		$('[data-bind-view=' + (name) + ']').show();

		if (_historyback[name + '_after']) {
			_historyback[name + '_after'](st);
		}

		_layerPopups.forEach(function(val) {
			var $popupBindView = $getBindingElement('bind', val.name);
			var $close = $popupBindView.data('$close');

			_.isFunction($close) && $close();

		});
		_layerPopups = [];

		// 팝업 제거
		$('#__flying_partition__').html('');
		popCloseScroll && popCloseScroll();
	}
	/* global.deviceInfo = {
		local:(location.host.indexOf('localhost')>=0 || location.host.indexOf('127.0.0.1')>=0),
		os: _.find(['windows nt', 'windows phone', 'ipod', 'iphone', 'ipad', 'android', 'androidtablet', 'webos','blackberry', 'zunewp7', 'macintosh', 'linux'], function (v) { return nv(v) }),
		browser: _.find(['chrome', 'safari', 'firefox', 'opera', 'msie'], function (v) { return nv(v) }),
		app:_.find(['shcardapp','shfanapp','sharedplatform','shcouponapp', 'spay/pay_billpayment_webview', 'shmyshopapp'], function(v){return nv(v)}),
		mobile: _.find(['windows nt','macintosh', 'linux'], function(v){return nv(v)}) ? false : true
	}*/
	// C2020062975633 챗봇 UI 추가
	global.deviceInfo = {
			local:(location.host.indexOf('localhost')>=0 || location.host.indexOf('127.0.0.1')>=0),
			os: _.find(['windows nt', 'windows phone', 'ipod', 'iphone', 'ipad', 'android', 'androidtablet', 'webos','blackberry', 'zunewp7', 'macintosh', 'linux'], function (v) { return nv(v) }),
			browser: _.find(['chrome', 'safari', 'firefox', 'opera', 'msie'], function (v) { return nv(v) }),
			app:_.find(['shcardapp','shfanapp','sharedplatform','shcouponapp', 'spay/pay_billpayment_webview', 'shmyshopapp'], function(v){return nv(v)}),
			mobile: _.find(['shcardapp','shfanapp','sharedplatform','shcouponapp', 'spay/pay_billpayment_webview', 'shmyshopapp',
							'android', 'iphone os', 'ipad' ], function(v){return nv(v)}) ? true : false,
			chatbot: _.find(['shchatbot'], function(v){return nv(v)}) ? true : false,
			nos: _.find(['windows nt 5.1', 'windows nt 6.0', 'windows nt 6.1'], function(v){return nv(v)}) ? true : false,
					
		}
	// 2019.12.13 이재원 C2019120456641  삼성페이앱內 월납신청화면 추가 페이지 제작 - 삼성페이 userAgent 적용
	// C2020052098791-1 [ICSR] 리눅스용 NOS 가상키패드 크기 조정, 설치파일 다운로드 링크 수정 - linux 정보추가
	var ssgBackUrl = '';
	global.setSsgpayBackUrl = function (v) {
		ssgBackUrl = v;
	};
	global.movePage = function () {
		if (ssgBackUrl != '') {
			location.href = ssgBackUrl;
		} else {
			history.back();
		}
	};

	// C2022042679651-2 홈페이지 시작/종료 팝업
	function chkSePopup(pList) {			 
		var currDate = $svc.get('util').formatDate(new Date(), 'yyyyMMddhh24miss'); 
		var popArr = pList; // 세션에 저장한 조회된 팝업 데이터
		var nextPopupFlag = false;	// cmmPopup.js 호출 
		var popArr2 = [];
		var cnt=0;
		var userDeviceInfo = deviceInfo.app;
		var hpgXpoCd;

        // C2025020468161 iOS 감지 강화
		function isIOS() {
            return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
                   (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
        }

        function isPC() {
            return /Win|Mac|Linux/.test(navigator.userAgent || navigator.vendor || window.opera);
        }

		// 앱
		if(userDeviceInfo == 'shfanapp') {
			// android
			if(deviceInfo.os == 'android') {
				for(k=0; k<popArr.length; k++) {
					hpgXpoCd = popArr[k].hpgBnnXpoChlCcd;	// 홈페이지배너노출채널구분코드
					if(hpgXpoCd == '2') { // 앱 미노출. 1:미노출, 2:노출
						// C2025020468161 앱에서 노출은 노출디바이스가 아닌 앱 미노출여부로 판단.
						if (popArr[k].hpgOsCcd == "11" || popArr[k].hpgOsCcd == "12"|| popArr[k].hpgOsCcd == "13" ||
						    popArr[k].hpgOsCcd == "14" || popArr[k].hpgOsCcd == "15"|| popArr[k].hpgOsCcd == "16" || popArr[k].hpgOsCcd == "17"
						    ) {
							popArr2[cnt++] = popArr[k];
						}
					}
				}
			// ios	
			} else if ( deviceInfo.os ==  'ipod' || deviceInfo.os ==  'iphone' || deviceInfo.os == 'ipad' || isIOS() ) {
				for(k=0; k<popArr.length; k++) {
					hpgXpoCd = popArr[k].hpgBnnXpoChlCcd;	// 홈페이지배너노출채널구분코드
					if(hpgXpoCd == '2') { // 앱 미노출. 1:미노출, 2:노출
						// C2025020468161 앱에서 노출은 노출디바이스가 아닌 앱 미노출여부로 판단.
						if (popArr[k].hpgOsCcd == "11" || popArr[k].hpgOsCcd == "12"|| popArr[k].hpgOsCcd == "13" ||
                            popArr[k].hpgOsCcd == "14" || popArr[k].hpgOsCcd == "15"|| popArr[k].hpgOsCcd == "16" || popArr[k].hpgOsCcd == "17"
                            ) {
							popArr2[cnt++] = popArr[k];
						}
					}
				}
			}
		} else { // 모바일 웹, 웹

			// C2025020468161 web을 pc와 모바일웹으로 구분
			// 모바일웹
			if ( deviceInfo.mobile || isIOS() ) {
                // android
                if ( deviceInfo.os == 'android' ) {
                    for(k=0; k<popArr.length; k++) {
                        hpgXpoCd = popArr[k].hpgBnnXpoChlCcd;	// 홈페이지배너노출채널구분코드
                        if(hpgXpoCd != "B" && (popArr[k].hpgOsCcd == "12" || popArr[k].hpgOsCcd == "14" || popArr[k].hpgOsCcd == "16" || popArr[k].hpgOsCcd == "17")) {
                            popArr2[cnt++] = popArr[k];
                        }
                    }
                }
                // ios
                else if ( deviceInfo.os ==  'ipod' || deviceInfo.os ==  'iphone' || deviceInfo.os == 'ipad' || isIOS() ) {
                    for(k=0; k<popArr.length; k++) {
                        hpgXpoCd = popArr[k].hpgBnnXpoChlCcd;	// 홈페이지배너노출채널구분코드
                        if(hpgXpoCd != "B" && (popArr[k].hpgOsCcd == "12" || popArr[k].hpgOsCcd == "13" || popArr[k].hpgOsCcd == "15" || popArr[k].hpgOsCcd == "17")) {
                            popArr2[cnt++] = popArr[k];
                        }
                    }
                }
			}
			// PC
			else if ( isPC() ) {
			//else {
			    for(k=0; k<popArr.length; k++) {
                    hpgXpoCd = popArr[k].hpgBnnXpoChlCcd;	// 홈페이지배너노출채널구분코드
                    if(hpgXpoCd != "B" && (popArr[k].hpgOsCcd == "11" || popArr[k].hpgOsCcd == "15" || popArr[k].hpgOsCcd == "16" || popArr[k].hpgOsCcd == "17")) {
                        popArr2[cnt++] = popArr[k];
                    }
                }
			}
		}
		
		if(popArr2.length > 0) {
			//다시보지않기 체크
			if(!$svc.get('util').isNull(localStorage.getItem('sEPopup'))) {
				var lsData= JSON.parse(localStorage.getItem('sEPopup'));
				if(lsData == '') {
					nextPopupFlag = true;
				}
				for(i=0; i<popArr2.length; i++) {
					if(!nextPopupFlag){
						for(j=0; j<lsData.length; j++) {
							if(popArr2[i].hpgBnnRgn == lsData[j].hpgBnnRgn) { 
								if(lsData[j].pupXpoF=='N' || (lsData[j].pupXpoF=='Y' && currDate>=lsData[j].expireDate)){ // 다시보지않기 Y이지만 만료기한이 지난 팝업이 1개라도 존재할 경우||다시보지않기 N일 경우
										nextPopupFlag = true;
										break;
								} else if(lsData[j].pupXpoF=='Y' && currDate<lsData[j].expireDate) {
									nextPopupFlag = false;
									break;
								}
							} else {
								if(j == (lsData.length-1)) { // 로컬 스토리지엔 없는 새로운 팝업이 있을 경우
									nextPopupFlag = true;
									break;
								}
							}
						}
					} else {
						break;
					}
				}	
				
			} else {
				nextPopupFlag = true;
			}
		}
		
		//  시작/종료 팝업을 출력하기 위해 처리용 js 파일 호출, param=popArr2
		if(nextPopupFlag) {
			$svc.get('util').loadJS(['/logic/js/mob/cmm/popup/cmmPopup.js'], function () {
				$svc.get('popup').open({name: 'cmmPopup', param: popArr2}).then(function(){
				});
			});
		}
	}

	$(document).ready(function () {

		var param = {};

		if (location.search) {
			_.each(location.search.replace(/\?/, '').split('&'), function (n, t) {
				var v = n.split('=');
				if (v[0] == 'from' && v[1] == 'SSGPAY') {
					param = { 'from': 'SSGPAY' };
					deviceInfo.app = 'ssgpay';
					$('[data-bind-include=cmmHeader]').hide();
					$('[data-bind-include=cmmFooter]').hide();
					return;
				}
			});
		}

		var appCfg = {};
		try {
			appCfg = $svc.get('util').fromJson(localStorage.getItem('appCfg')) || {}
		}
		catch (er) {
		}

		_.each($('[data-bind-include]'), function (n) {
			var nm = $(n).data('bindInclude');
			$(n).attr('data-plugin-view', nm);
			$svc.get('plugin').load({ name: nm, param: { headType: $(n).data('headType') } });

		});

		_.each($('[data-include]'), function (n) {
			loadHtml($(n).data('include')).then(function (m) {
				if (m) {
					$(n).html(m);
				}
			});
		});

		// bootstrap일때는 Library가 다 로딩되고,
		// frontHistoryCheck.ajax에서 데이터를 가지고 왔을때 view.load()가 실행되도록 처리하기 위한
		// Deferred 2개 생성
		var dfdBootstrapLibLoad, dfdBootstrapViewLoad;
		if (_bootstrap.name) {
			dfdBootstrapLibLoad = $.Deferred();
			dfdBootstrapViewLoad = $.Deferred();

			$('body').hide();

			if(typeof _bootstrap.lib !== 'undefined' && _bootstrap.lib.length > 0) {
				var bootstrapLoadLibCount = 0;

				// 캐시업데이트 정책은 어떻게?
				// 예) 법인일부코드에 적용되어 있는 20시 이후에 캐시가 되도록 함.
				// var ver = new Date().getDate()+(new Date().getHours()>19 ? '1' : '0');
				// 예) 항상 캐시가 안되도록 함.
				// var ver = _.now();

				var ver = new Date().getDate()+(new Date().getHours()>19 ? '1' : '0');
				var query = '?v=' + ver;
				function addNoCacheQuery(path) {
					if(path.indexOf('?') > -1) {
						return path;
					}
					return path + query;
				}

				$svc.get('util').loadJS(_.map(_bootstrap.lib, addNoCacheQuery), function() {
					if(++bootstrapLoadLibCount === _bootstrap.lib.length) {
						dfdBootstrapLibLoad.resolve();
					}
				});
			} else {
				dfdBootstrapLibLoad.resolve();
			}
		}

		/* C2022042679651-2 홈페이지 시작/종료 팝업에서 사용: 전체데이터 조회가 아닌 진입하려는 화면의 데이터만 조회하기 위하여 필요  */
		param.hpgXpoTrrCcd = "1";	// 홈페이지 노출영역 구분코드
		
		var hpgPopOpenUrlAr = location.href.replace(location.origin, ''); // 진입할 경로 url 
		
		if(hpgPopOpenUrlAr.indexOf('?')> -1) { // param값이 있을 경우
			param.hpgBnnXpoSceUrlAr = hpgPopOpenUrlAr.substr(0, hpgPopOpenUrlAr.indexOf('?')); // '?'를 기준으로 뒷부분 제외한 url
		} else {	// '?'가 없을 경우
			param.hpgBnnXpoSceUrlAr = hpgPopOpenUrlAr; // 진입할 경로 url
		}
		

		$svc.get('ajax').form('/mob/cmm/COMMON/frontHistoryCheck.ajax', param, false, true).then(function (n) {
			if (!n || !n.data || !n.data.mbw_json) {
				$log('화면 데이터 수신 실패');
				lk.httpCms = '';
				lk.httpSrch = '';
				window.callMenu && callMenu();
				return;
			}
			
			/* C2022042679651-2 홈페이지 시작/종료 팝업 */
			// 각 메뉴의 메인화면 진입 시 조회가  아닌 실시간으로 데이터 조회하게끔 수정 20220517 > DX챕터 요청
			if(typeof n.data.mbw_json.popupList != 'undefined') {
				if(n.data.mbw_json.popupList.length > 0) {
					var pList = n.data.mbw_json.popupList;
					chkSePopup(pList);
				}
			} 

			// 넷퍼넬 토큰 반환처리
			var netfunelAfterActionFlag = n.data.mbw_json.netfunelAfterActionFlag;
			if(netfunelAfterActionFlag == 'Y'){
				$.getScript('/logic/js/mob/cmm/netfunnel/netfunnel.js').then(function() {
					NetFunnel_Complete();
				});
			}

			deviceInfo.mode = n.data.mbw_json.mode;
			$svc.get('tracking').load();
			if(deviceInfo.app == 'shcardapp') {
				$('#shcHead').addClass('app');
			}
			
			// C2021081757551 로그수집을 위한 와이즈콜랙터 스크립트 적용  
			// WISECOLLECTOR TRACKING SCRIPT CODE START

			var sid = "";
			var serverMode = deviceInfo.mode;

			if(deviceInfo.mobile == true && (deviceInfo.app == 'shfanapp' || deviceInfo.app == 'shpay')) {
			    if(serverMode == 'dev' || serverMode == 'tst') {
			    	sid = "81537";
			    }
			    else if (serverMode == 'run') {
			    	sid = "13780";
			    }
			}
			else{                                                                                   // 플레이 판 외에서 호출했을 때
			      if(serverMode =='dev' || serverMode == 'tst'){
			           sid = "74418";
			       }else if(serverMode == 'run'){
			           sid = "79728";
			      }
			}


			function wiseCollector(sid, cb) {
				var wiselog_id = $svc.get('util').getCookie('mbw_wlog');
				cb(wiselog_id);
				
				if (sid) {
					(function(f,d,k,h){var b;var a=m()+"ver="+c(d);g();function e(){var o=document.getElementsByTagName(f)[0];var n=document.createElement(f);n.async=true;n.charset="utf-8";n.src=a;o.parentNode.insertBefore(n,o)}function m(){return window.location.protocol=="https:"?"https://wcl.shinhancard.com/static/" + sid + "/install.js?":"http://wcl.shinhancard.com/static/" + sid + "/install.js?"}function c(n){var o=new Date().getTime();var p=n*1000*60;return n>0?Math.floor(o/p)*p:o}function g(){var n=l();if(!n){return false}n.open("GET",a,true);n.withCredentials=h;n.send(null);n.onload=function(){j();e()};n.onerror=n.onabort=function(){j()};i(function(){n.abort()},k)}function l(){var q;var o=[function(){return new XDomainRequest()},function(){return new XMLHttpRequest()},function(){return new ActiveXObject("Msxml2.XMLHTTP")},function(){return new ActiveXObject("Msxml3.XMLHTTP")},function(){return new ActiveXObject("Microsoft.XMLHTTP")}];for(var n=0;n<o.length;n++){try{q=o[n]()}catch(p){continue}break}return q}function i(o,n){b=setTimeout(o,n)}function j(){if(b){clearTimeout(b);b=null}}})("script",1440,/*{{timeout}}*/1000,/*{{withCredentials}}*/false);
				}
			}
			wiseCollector(sid, function (wiselog_id){
				if (wiselog_id != "") {
					$svc.get('util').setCookie('wiselog_id', wiselog_id);
				}
				else {
					$svc.get('util').setCookie('wiselog_id', "", {expireDay:-1});
				}
			});
			
			//C2024062053051  TG360 비식별 유저키 싱크 서비스 해지의 건 
			/*
			window.$tgid = $svc.get('util').getCookie('TGID');
			if(Boolean(n.data.mbw_json.login)&&!Boolean($tgid)){
				$svc.get('util').loadJS(['https://tags.widerplanet.com/api/1.0/shtags.js?type=getId&sid=3'],function(event){
					$svc.get('util').setCookie('TGID', TGID);
				},true);
				$tgid = $svc.get('util').getCookie('TGID');
				$pcid = $svc.get('util').getCookie('PCID');
				$svc.get('util').loadJS(['https://tags.widerplanet.com/api/1.0/shtags.js?type=sync&sid=3&hcuid='+$pcid],function(){
				},true);
				//Ntm.Event.fireUserDefined("collectAdTGID",{nth_tgid:$tgid,nth_adpartner:"TG360"});
			}else if(!Boolean(n.data.mbw_json.login)&&Boolean($tgid)){
				$svc.get('util').setCookie('TGID', '');
			}
			*/

			// WISECOLLECTOR TRACKING SCRIPT CODE END
			
			$('body').show();
			lk = n.data.mbw_json;
			global.$menu.login = lk && lk.login;
			global.$menu.vip = lk && lk.vip;
			global.$menu.userName=lk&&lk.userName;
			global.$menu.loginInitTime=lk&&lk.loginInitTime;	// 10:00
			global.$menu.loginPopupTime=lk&&lk.loginPopupTime;	// 01:00
			global.$menu.arsLogin=lk&&lk.arsLogin;
			global.$menu.arsNumber=lk&&lk.arsNumber;
			global.$menu.xpoCusTcd=lk&&lk.xpoCusTcd;			// 회원유형
			global.$menu.xpoCreChkCcd=lk&&lk.xpoCreChkCcd;		// 카드유형
			//global.$menu.currentMenuId=lk&&lk.request&&lk.request.crustMenuId;		// 메뉴ID
			global.$menu.ecareCrmPrmtId=lk&&lk.ecareCrmPrmtId;	// eCare CRM프로모션 ID
			global.$menu.psnMsg=lk&&lk.psnMsg;					// 개인화 메세지


			if(global.callMenu) {
				global.callMenu();
			}

			if (_bootstrap.name) {
				dfdBootstrapViewLoad.resolve();
			}

			if (lk.from == 'SSGPAY') {
				deviceInfo.app = 'ssgpay';
				$('[data-bind-include=cmmHeader]').hide();
				$('[data-bind-include=cmmFooter]').hide();
			}
			
			try{
				$svc.get('http').submit('/mob/cmm/COMMON/outerScriptUse.ajax', {}, 'not').then(function(rsHttp){
					if (rsHttp.outerScriptUse == "Y") {
						var outerScriptChecker=$svc.get('util').getCookie('outerScriptChecker');
						var outerScriptFilter=$svc.get('util').getCookie('outerScriptFilter');

						if(outerScriptChecker == 'y'){ //웹키퍼를 이미 체크한 경우
							if(outerScriptFilter == 'y'){//외부스크립트 차단할 경우

							}else{//외부스크립트 차단이 필요없을 경우
								// C2023110172881 카드홈페이지 GA4 전송시 14세미만 제외 요청
								if(lk.GA4 && lk.GA4.up_chk_ft == "N") {
									// C2023070762901  GA360의 GA4 전환 구축 ( 페이지 제목 및 고객속성 전송) 
									var ga4LoadCnt = 2;
									$svc.get('util').loadJS([
										'/logic/js/lib/googleAnalyticsBuilder-2023.js',
										'/logic/js/lib/googleAnalytics4-2023.js',
									], function () {
										if (--ga4LoadCnt) return;
										$GA4 = $svc.get('GA4');
										$GA4.send(lk.GA4, deviceInfo.app);
									});
								}
							}

						}else{//웹키퍼를 아직 체크하지 않았을 경우
							var xmlHttp = new XMLHttpRequest();
							xmlHttp.open("GET","https://www.google-analytics.com",true);
							xmlHttp.send();
							if(xmlHttp.responseText.indexOf('사이트 차단 안내')>-1){
								$svc.get('util').setCookie('outerScriptFilter', 'y', {expireDay: 1});
							}else{
								$svc.get('util').setCookie('outerScriptFilter', 'n', {expireDay: 1});
								// C2023110172881 카드홈페이지 GA4 전송시 14세미만 제외 요청
								if(lk.GA4 && lk.GA4.up_chk_ft == "N") {
									// C2023070762901  GA360의 GA4 전환 구축 ( 페이지 제목 및 고객속성 전송) 
									var ga4LoadCnt = 2;
									$svc.get('util').loadJS([
										'/logic/js/lib/googleAnalyticsBuilder-2023.js',
										'/logic/js/lib/googleAnalytics4-2023.js',
									], function () {
										if (--ga4LoadCnt) return;
										$GA4 = $svc.get('GA4');
										$GA4.send(lk.GA4, deviceInfo.app);
									});
								}
							}
							$svc.get('util').setCookie('outerScriptChecker', 'y', {expireDay: 1});
						}
					}else{
						// C2023110172881 카드홈페이지 GA4 전송시 14세미만 제외 요청
						if(lk.GA4 && lk.GA4.up_chk_ft == "N") {
							// C2023070762901  GA360의 GA4 전환 구축 ( 페이지 제목 및 고객속성 전송) 
							var ga4LoadCnt = 2;
							$svc.get('util').loadJS([
								'/logic/js/lib/googleAnalyticsBuilder-2023.js',
								'/logic/js/lib/googleAnalytics4-2023.js',
							], function () {
								if (--ga4LoadCnt) return;
								$GA4 = $svc.get('GA4');
								$GA4.send(lk.GA4, deviceInfo.app);
							});
						}
					}
				});

			}catch(e){

			}
			
	        if(n.data.mbw_json.agreeSndMalCd&&n.data.mbw_json.agreeSndMalCd == 'N'){
	        	$svc.get('util').loadJS(['/logic/js/mob/cmm/popup/agreeSndMalCd.js'],function(){
	    	        $svc.get('popup').open({name:'agreeSndMalCd'}).then(function(rs){
	    				$log('result', rs);
	    			});
	        	});
	        }
		});

		// bootstrap일때는 Library가 다 로딩되고,
		// frontHistoryCheck.ajax에서 데이터를 가지고 왔을때 view.load()가 실행한다.
		if (_bootstrap.name) {
			$.when(dfdBootstrapLibLoad, dfdBootstrapViewLoad).done(function() {
				$svc.get('view').load({
					name: _bootstrap.name,
					param: lk,
					notHistory: true
				});

				$(document).trigger('service-ready');
				$svc._serviceReady = true;
			});
		} else {
			$(document).trigger('service-ready');
			$svc._serviceReady = true;
		}
	});
	$svc.popup('lpGuide', function ($param, $close) {
		var vo = $svc.bind({ name: 'lpAlert' });
		var on = vo.event();

		vo.render(function () {
			vo.push($param);
		});
		on.close = function () {
			$close();
		}
	});
	$svc.popup('lpAlert', function ($param, $close) {
		var vo = $svc.bind({ name: 'lpAlert' });
		var on = vo.event();

		vo.render(function () {
			vo.push($param);
		});
		on.close = function () {
			$close();
		}
	});
	$svc.popup('lpConfirm', function ($param, $close) {
		var vo = $svc.bind({ name: 'lpConfirm' });
		var on = vo.event();

		vo.render(function () {
			vo.push($param);
		});
		on.yes = function () {
			$close(true);
		}
		on.no = function () {
			$close(false);
		}
	});

	$(function() {
		// 임시 팝업 보정 코드
		oldUILayerCommOpen = ui.layerComm.open;
		ui.layerComm.open = function() {
			$('.layer_dimmed').remove();
			var $popup = $('.layer_popup, .layer_fulltype');
			if($popup.length > 0) {
				$popup.removeClass('layer_popup layer_fulltype wrap_pop_full show').addClass('popup popup_type01');
				$popup.find('.popup_head, .pop_header').removeClass('popup_head pop_header').addClass('pop_head');
				$popup.find('.popup_content, .pop_content').removeClass('popup_content pop_content').addClass('pop_cont');
			}
			if($('#__flying_partition__ .pop_wrap').length === 0) {
				if($('.layer_fulltype').length > 0) {
					$popup.wrap('<div class="pop_wrap large">');
				} else {
					$popup.wrap('<div class="pop_wrap">');
				}
			}
			oldUILayerCommOpen();
		}
	});


}(window);

