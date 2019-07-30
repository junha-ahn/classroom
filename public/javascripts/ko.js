!function(t, n) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = n() : "function" == typeof define && define.amd ? define(n) : ((t = t || self).vdp_translation_ko = t.vdp_translation_ko || {},
    t.vdp_translation_ko.js = n())
}(this, function() {
    "use strict";
    function t(t, n) {
        for (var e = 0; e < n.length; e++) {
            var r = n[e];
            r.enumerable = r.enumerable || !1,
            r.configurable = !0,
            "value"in r && (r.writable = !0),
            Object.defineProperty(t, r.key, r)
        }
    }
    var n = new (function() {
        function n(t, e, r, o) {
            !function(t, n) {
                if (!(t instanceof n))
                    throw new TypeError("Cannot call a class as a function")
            }(this, n),
            this.language = t,
            this.months = e,
            this.monthsAbbr = r,
            this.days = o,
            this.rtl = !1,
            this.ymd = !1,
            this.yearSuffix = ""
        }
        var e, r, o;
        return e = n,
        (r = [{
            key: "language",
            get: function() {
                return this._language
            },
            set: function(t) {
                if ("string" != typeof t)
                    throw new TypeError("Language must be a string");
                this._language = t
            }
        }, {
            key: "months",
            get: function() {
                return this._months
            },
            set: function(t) {
                if (12 !== t.length)
                    throw new RangeError("There must be 12 months for ".concat(this.language, " language"));
                this._months = t
            }
        }, {
            key: "monthsAbbr",
            get: function() {
                return this._monthsAbbr
            },
            set: function(t) {
                if (12 !== t.length)
                    throw new RangeError("There must be 12 abbreviated months for ".concat(this.language, " language"));
                this._monthsAbbr = t
            }
        }, {
            key: "days",
            get: function() {
                return this._days
            },
            set: function(t) {
                if (7 !== t.length)
                    throw new RangeError("There must be 7 days for ".concat(this.language, " language"));
                this._days = t
            }
        }]) && t(e.prototype, r),
        o && t(e, o),
        n
    }())("Korean",["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],["일", "월", "화", "수", "목", "금", "토"]);
    return n.yearSuffix = "년",
    n.ymd = !0,
    n
});
