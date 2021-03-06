/*!
	supportkit 1.0.0
	License : http://supportkit.io/terms.html
*/
! function(a) {
    if ("object" == typeof exports && "undefined" != typeof module) module.exports = a();
    else if ("function" == typeof define && define.amd) define([], a);
    else {
        var b;
        b = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this, b.SupportKit = a()
    }
}(function() {
    var define, module, exports;
    return function a(b, c, d) {
        function e(g, h) {
            if (!c[g]) {
                if (!b[g]) {
                    var i = "function" == typeof require && require;
                    if (!h && i) return i(g, !0);
                    if (f) return f(g, !0);
                    var j = new Error("Cannot find module '" + g + "'");
                    throw j.code = "MODULE_NOT_FOUND", j
                }
                var k = c[g] = {
                    exports: {}
                };
                b[g][0].call(k.exports, function(a) {
                    var c = b[g][1][a];
                    return e(c ? c : a)
                }, k, k.exports, a, b, c, d)
            }
            return c[g].exports
        }
        for (var f = "function" == typeof require && require, g = 0; g < d.length; g++) e(d[g]);
        return e
    }({
        1: [function(a, b, c) {
            ! function(d, e) {
                if ("function" == typeof define && define.amd) define(["underscore", "backbone"], function(a, b) {
                    return e(d, b, a)
                });
                else if ("undefined" != typeof c) {
                    var f = a("underscore"),
                        g = a("backbone");
                    e(d, g, f), "undefined" != typeof b && b.exports && (b.exports = g), c = g
                } else e(d, d.Backbone, d._)
            }(this, function(a, b, c) {
                "use strict";
                var d, e, f, g, h, i, j, k, l, m, n, o = {};
                d = b.Model, e = b.Collection, f = d.prototype, h = e.prototype, g = b.Events, b.Associations = {
                    VERSION: "0.6.2"
                }, b.Associations.scopes = [];
                var p = function() {
                        return l
                    },
                    q = function(a) {
                        (!c.isString(a) || c.size(a) < 1) && (a = "."), l = a, j = new RegExp("[\\" + l + "\\[\\]]+", "g"), k = new RegExp("[^\\" + l + "\\[\\]]+", "g")
                    };
                try {
                    Object.defineProperty(b.Associations, "SEPARATOR", {
                        enumerable: !0,
                        get: p,
                        set: q
                    })
                } catch (r) {}
                b.Associations.Many = b.Many = "Many", b.Associations.One = b.One = "One", b.Associations.Self = b.Self = "Self", b.Associations.SEPARATOR = ".", b.Associations.getSeparator = p, b.Associations.setSeparator = q, b.Associations.EVENTS_BUBBLE = !0, b.Associations.EVENTS_WILDCARD = !0, b.Associations.EVENTS_NC = !1, q(), i = b.AssociatedModel = b.Associations.AssociatedModel = d.extend({
                    relations: void 0,
                    _proxyCalls: void 0,
                    constructor: function(a, b) {
                        b && b.__parents__ && (this.parents = [b.__parents__]), d.apply(this, arguments)
                    },
                    on: function(a, d, e) {
                        var f = g.on.apply(this, arguments);
                        if (b.Associations.EVENTS_NC) return f;
                        var h = /\s+/;
                        if (c.isString(a) && a && !h.test(a) && d) {
                            var i = t(a);
                            i && (o[i] = "undefined" == typeof o[i] ? 1 : o[i] + 1)
                        }
                        return f
                    },
                    off: function(a, d, e) {
                        if (b.Associations.EVENTS_NC) return g.off.apply(this, arguments);
                        var f = /\s+/,
                            h = this._events,
                            i = {},
                            j = h ? c.keys(h) : [],
                            k = !a && !d && !e,
                            l = c.isString(a) && !f.test(a);
                        if (k || l)
                            for (var m = 0, n = j.length; n > m; m++) i[j[m]] = h[j[m]] ? h[j[m]].length : 0;
                        var p = g.off.apply(this, arguments);
                        if (k || l)
                            for (m = 0, n = j.length; n > m; m++) {
                                var q = t(j[m]);
                                q && (h[j[m]] ? o[q] -= i[j[m]] - h[j[m]].length : o[q] -= i[j[m]])
                            }
                        return p
                    },
                    get: function(a) {
                        var b = this.__attributes__,
                            c = f.get.call(this, a),
                            d = b ? w(c) ? c : b[a] : c;
                        return w(d) ? d : this._getAttr.apply(this, arguments)
                    },
                    set: function(a, b, d) {
                        var e, f;
                        return c.isObject(a) || null == a ? (e = a, d = b) : (e = {}, e[a] = b), f = this._set(e, d), this._processPendingEvents(), f
                    },
                    _set: function(a, b) {
                        var e, f, g, h, i = this;
                        if (!a) return this;
                        this.__attributes__ = a;
                        for (e in a)
                            if (f || (f = {}), e.match(j)) {
                                var k = s(e),
                                    l = c.initial(k),
                                    m = k[k.length - 1],
                                    n = this.get(l);
                                n instanceof d && (h = f[n.cid] || (f[n.cid] = {
                                    model: n,
                                    data: {}
                                }), h.data[m] = a[e])
                            } else h = f[this.cid] || (f[this.cid] = {
                                model: this,
                                data: {}
                            }), h.data[e] = a[e];
                        if (f)
                            for (g in f) h = f[g], this._setAttr.call(h.model, h.data, b) || (i = !1);
                        else i = this._setAttr.call(this, a, b);
                        return delete this.__attributes__, i
                    },
                    _setAttr: function(g, h) {
                        var i;
                        if (h || (h = {}), h.unset)
                            for (i in g) g[i] = void 0;
                        return this.parents = this.parents || [], this.relations && c.each(this.relations, function(f) {
                            var i, j, k, l, m = f.key,
                                n = f.scope || a,
                                o = this._transformRelatedModel(f, g),
                                p = this._transformCollectionType(f, o, g),
                                q = c.isString(f.map) ? u(f.map, n) : f.map,
                                r = this.attributes[m],
                                s = r && r.idAttribute,
                                t = !1;
                            if (j = f.options ? c.extend({}, f.options, h) : h, g[m]) {
                                if (i = c.result(g, m), i = q ? q.call(this, i, p ? p : o) : i, w(i))
                                    if (f.type === b.Many) r ? (r._deferEvents = !0, r[j.reset ? "reset" : "set"](i instanceof e ? i.models : i, j), k = r) : (t = !0, i instanceof e ? k = i : (k = this._createCollection(p || e, f.collectionOptions || (o ? {
                                        model: o
                                    } : {})), k[j.reset ? "reset" : "set"](i, j)));
                                    else {
                                        if (f.type !== b.One) throw new Error("type attribute must be specified and have the values Backbone.One or Backbone.Many");
                                        var v = i instanceof d ? i.attributes.hasOwnProperty(s) : i.hasOwnProperty(s),
                                            x = i instanceof d ? i.attributes[s] : i[s];
                                        r && v && r.attributes[s] === x ? (r._deferEvents = !0, r._set(i instanceof d ? i.attributes : i, j), k = r) : (t = !0, i instanceof d ? k = i : (j.__parents__ = this, k = new o(i, j), delete j.__parents__))
                                    } else k = i;
                                g[m] = k, l = k, (t || l && !l._proxyCallback) && (l._proxyCallback || (l._proxyCallback = function() {
                                    return b.Associations.EVENTS_BUBBLE && this._bubbleEvent.call(this, m, l, arguments)
                                }), l.on("all", l._proxyCallback, this))
                            }
                            g.hasOwnProperty(m) && this._setupParents(g[m], this.attributes[m])
                        }, this), f.set.call(this, g, h)
                    },
                    _bubbleEvent: function(a, c, f) {
                        var g, h, i = f,
                            j = i[0].split(":"),
                            k = j[0],
                            p = "nested-change" == i[0],
                            q = "change" === k,
                            r = i[1],
                            s = -1,
                            u = c._proxyCalls,
                            v = j[1],
                            w = !v || -1 == v.indexOf(l);
                        if (!p && (w && (n = t(i[0]) || a), b.Associations.EVENTS_NC || o[n])) {
                            if (b.Associations.EVENTS_WILDCARD && /\[\*\]/g.test(v)) return this;
                            if (c instanceof e && (q || v) && (s = c.indexOf(m || r)), this instanceof d && (m = this), v = a + (-1 !== s && (q || v) ? "[" + s + "]" : "") + (v ? l + v : ""), b.Associations.EVENTS_WILDCARD && (h = v.replace(/\[\d+\]/g, "[*]")), g = [], g.push.apply(g, i), g[0] = k + ":" + v, b.Associations.EVENTS_WILDCARD && v !== h && (g[0] = g[0] + " " + k + ":" + h), u = c._proxyCalls = u || {}, this._isEventAvailable.call(this, u, v)) return this;
                            if (u[v] = !0, q && (this._previousAttributes[a] = c._previousAttributes, this.changed[a] = c), this.trigger.apply(this, g), b.Associations.EVENTS_NC && q && this.get(v) != i[2]) {
                                var x = ["nested-change", v, i[1]];
                                i[2] && x.push(i[2]), this.trigger.apply(this, x)
                            }
                            return u && v && delete u[v], m = void 0, this
                        }
                    },
                    _isEventAvailable: function(a, b) {
                        return c.find(a, function(a, c) {
                            return -1 !== b.indexOf(c, b.length - c.length)
                        })
                    },
                    _setupParents: function(a, b) {
                        a && (a.parents = a.parents || [], -1 == c.indexOf(a.parents, this) && a.parents.push(this)), b && b.parents.length > 0 && b != a && (b.parents = c.difference(b.parents, [this]), b._proxyCallback && b.off("all", b._proxyCallback, this))
                    },
                    _createCollection: function(a, b) {
                        b = c.defaults(b, {
                            model: a.model
                        });
                        var d = new a([], c.isFunction(b) ? b.call(this) : b);
                        return d.parents = [this], d
                    },
                    _processPendingEvents: function() {
                        this._processedEvents || (this._processedEvents = !0, this._deferEvents = !1, c.each(this._pendingEvents, function(a) {
                            a.c.trigger.apply(a.c, a.a)
                        }), this._pendingEvents = [], c.each(this.relations, function(a) {
                            var b = this.attributes[a.key];
                            b && b._processPendingEvents && b._processPendingEvents()
                        }, this), delete this._processedEvents)
                    },
                    _transformRelatedModel: function(e, f) {
                        var g = e.relatedModel,
                            h = e.scope || a;
                        if (!g || g.prototype instanceof d || (g = c.isFunction(g) ? g.call(this, e, f) : g), g && c.isString(g) && (g = g === b.Self ? this.constructor : u(g, h)), e.type === b.One) {
                            if (!g) throw new Error("specify a relatedModel for Backbone.One type");
                            if (!(g.prototype instanceof b.Model)) throw new Error("specify an AssociatedModel or Backbone.Model for Backbone.One type")
                        }
                        return g
                    },
                    _transformCollectionType: function(f, g, h) {
                        var i = f.collectionType,
                            j = f.scope || a;
                        if (i && c.isFunction(i) && i.prototype instanceof d) throw new Error("type is of Backbone.Model. Specify derivatives of Backbone.Collection");
                        if (!i || i.prototype instanceof e || (i = c.isFunction(i) ? i.call(this, f, h) : i), i && c.isString(i) && (i = u(i, j)), i && !i.prototype instanceof e) throw new Error("collectionType must inherit from Backbone.Collection");
                        if (f.type === b.Many && !g && !i) throw new Error("specify either a relatedModel or collectionType");
                        return i
                    },
                    trigger: function(a) {
                        this._deferEvents ? (this._pendingEvents = this._pendingEvents || [], this._pendingEvents.push({
                            c: this,
                            a: arguments
                        })) : f.trigger.apply(this, arguments)
                    },
                    toJSON: function(a) {
                        var b, d = {};
                        return d[this.idAttribute] = this.id, this.visited || (this.visited = !0, d = f.toJSON.apply(this, arguments), a && a.serialize_keys && (d = c.pick(d, a.serialize_keys)), this.relations && c.each(this.relations, function(e) {
                            var f = e.key,
                                g = e.remoteKey,
                                h = this.attributes[f],
                                i = !e.isTransient,
                                j = e.serialize || [],
                                k = c.clone(a);
                            delete d[f], i && (j.length && (k ? k.serialize_keys = j : k = {
                                serialize_keys: j
                            }), b = h && h.toJSON ? h.toJSON(k) : h, d[g || f] = c.isArray(b) ? c.compact(b) : b)
                        }, this), delete this.visited), d
                    },
                    clone: function(a) {
                        return new this.constructor(this.toJSON(a))
                    },
                    cleanup: function(a) {
                        a = a || {}, c.each(this.relations, function(a) {
                            var b = this.attributes[a.key];
                            b && (b._proxyCallback && b.off("all", b._proxyCallback, this), b.parents = c.difference(b.parents, [this]))
                        }, this), !a.listen && this.off()
                    },
                    destroy: function(a) {
                        a = a ? c.clone(a) : {}, a = c.defaults(a, {
                            remove_references: !0,
                            listen: !0
                        });
                        var b = this;
                        if (a.remove_references && a.wait) {
                            var d = a.success;
                            a.success = function(c) {
                                d && d(b, c, a), b.cleanup(a)
                            }
                        }
                        var e = f.destroy.apply(this, [a]);
                        return a.remove_references && !a.wait && b.cleanup(a), e
                    },
                    _getAttr: function(a) {
                        var b, d, f = this,
                            g = this.__attributes__,
                            h = s(a);
                        if (!(c.size(h) < 1)) {
                            for (d = 0; d < h.length && (b = h[d], f); d++) f = f instanceof e ? isNaN(b) ? void 0 : f.at(b) : g ? w(f.attributes[b]) ? f.attributes[b] : g[b] : f.attributes[b];
                            return f
                        }
                    }
                });
                var s = function(a) {
                        return "" === a ? [""] : c.isString(a) ? a.match(k) : a || []
                    },
                    t = function(a) {
                        if (!a) return a;
                        var b = a.split(":");
                        return b.length > 1 ? (a = b[b.length - 1], b = a.split(l), b.length > 1 ? b[b.length - 1].split("[")[0] : b[0].split("[")[0]) : ""
                    },
                    u = function(a, d) {
                        var e, f = [d];
                        f.push.apply(f, b.Associations.scopes);
                        for (var g, h = 0, i = f.length; i > h && (!(g = f[h]) || !(e = c.reduce(a.split(l), function(a, b) {
                                return a[b]
                            }, g))); ++h);
                        return e
                    },
                    v = function(a, b, d) {
                        var e, f;
                        return c.find(a, function(a) {
                            return e = c.find(a.relations, function(c) {
                                return a.get(c.key) === b
                            }, this), e ? (f = a, !0) : void 0
                        }, this), e && e.map ? e.map.call(f, d, b) : d
                    },
                    w = function(a) {
                        return !c.isUndefined(a) && !c.isNull(a)
                    },
                    x = {};
                return c.each(["set", "remove", "reset"], function(a) {
                    x[a] = e.prototype[a], h[a] = function(b, c) {
                        return this.model.prototype instanceof i && this.parents && (arguments[0] = v(this.parents, this, b)), x[a].apply(this, arguments)
                    }
                }), x.trigger = h.trigger, h.trigger = function(a) {
                    this._deferEvents ? (this._pendingEvents = this._pendingEvents || [], this._pendingEvents.push({
                        c: this,
                        a: arguments
                    })) : x.trigger.apply(this, arguments)
                }, h._processPendingEvents = i.prototype._processPendingEvents, h.on = i.prototype.on, h.off = i.prototype.off, b
            })
        }, {
            backbone: 6,
            underscore: 35
        }],
        2: [function(a, b, c) {
            ! function(d, e) {
                if ("function" == typeof define && define.amd) define(["backbone", "underscore", "backbone.wreqr", "backbone.babysitter"], function(a, b) {
                    return d.Marionette = d.Mn = e(d, a, b)
                });
                else if ("undefined" != typeof c) {
                    var f = a("backbone"),
                        g = a("underscore");
                    a("backbone.wreqr"), a("backbone.babysitter");
                    b.exports = e(d, f, g)
                } else d.Marionette = d.Mn = e(d, d.Backbone, d._)
            }(this, function(a, b, c) {
                "use strict";
                var d = a.Marionette,
                    e = a.Mn,
                    f = b.Marionette = {};
                f.VERSION = "2.4.3", f.noConflict = function() {
                    return a.Marionette = d, a.Mn = e, this
                }, f.Deferred = b.$.Deferred, f.FEATURES = {}, f.isEnabled = function(a) {
                    return !!f.FEATURES[a]
                }, f.extend = b.Model.extend, f.isNodeAttached = function(a) {
                    return b.$.contains(document.documentElement, a)
                }, f.mergeOptions = function(a, b) {
                    a && c.extend(this, c.pick(a, b))
                }, f.getOption = function(a, b) {
                    return a && b ? a.options && void 0 !== a.options[b] ? a.options[b] : a[b] : void 0
                }, f.proxyGetOption = function(a) {
                    return f.getOption(this, a)
                }, f._getValue = function(a, b, d) {
                    return c.isFunction(a) && (a = d ? a.apply(b, d) : a.call(b)), a
                }, f.normalizeMethods = function(a) {
                    return c.reduce(a, function(a, b, d) {
                        return c.isFunction(b) || (b = this[b]), b && (a[d] = b), a
                    }, {}, this)
                }, f.normalizeUIString = function(a, b) {
                    return a.replace(/@ui\.[a-zA-Z_$0-9]*/g, function(a) {
                        return b[a.slice(4)]
                    })
                }, f.normalizeUIKeys = function(a, b) {
                    return c.reduce(a, function(a, c, d) {
                        var e = f.normalizeUIString(d, b);
                        return a[e] = c, a
                    }, {})
                }, f.normalizeUIValues = function(a, b, d) {
                    return c.each(a, function(e, g) {
                        c.isString(e) ? a[g] = f.normalizeUIString(e, b) : c.isObject(e) && c.isArray(d) && (c.extend(e, f.normalizeUIValues(c.pick(e, d), b)), c.each(d, function(a) {
                            var d = e[a];
                            c.isString(d) && (e[a] = f.normalizeUIString(d, b))
                        }))
                    }), a
                }, f.actAsCollection = function(a, b) {
                    var d = ["forEach", "each", "map", "find", "detect", "filter", "select", "reject", "every", "all", "some", "any", "include", "contains", "invoke", "toArray", "first", "initial", "rest", "last", "without", "isEmpty", "pluck"];
                    c.each(d, function(d) {
                        a[d] = function() {
                            var a = c.values(c.result(this, b)),
                                e = [a].concat(c.toArray(arguments));
                            return c[d].apply(c, e)
                        }
                    })
                };
                var g = f.deprecate = function(a, b) {
                    c.isObject(a) && (a = a.prev + " is going to be removed in the future. Please use " + a.next + " instead." + (a.url ? " See: " + a.url : "")), void 0 !== b && b || g._cache[a] || (g._warn("Deprecation warning: " + a), g._cache[a] = !0)
                };
                g._warn = "undefined" != typeof console && (console.warn || console.log) || function() {}, g._cache = {}, f._triggerMethod = function() {
                        function a(a, b, c) {
                            return c.toUpperCase()
                        }
                        var b = /(^|:)(\w)/gi;
                        return function(d, e, f) {
                            var g = arguments.length < 3;
                            g && (f = e, e = f[0]);
                            var h, i = "on" + e.replace(b, a),
                                j = d[i];
                            return c.isFunction(j) && (h = j.apply(d, g ? c.rest(f) : f)), c.isFunction(d.trigger) && (g + f.length > 1 ? d.trigger.apply(d, g ? f : [e].concat(c.drop(f, 0))) : d.trigger(e)), h
                        }
                    }(), f.triggerMethod = function(a) {
                        return f._triggerMethod(this, arguments)
                    }, f.triggerMethodOn = function(a) {
                        var b = c.isFunction(a.triggerMethod) ? a.triggerMethod : f.triggerMethod;
                        return b.apply(a, c.rest(arguments))
                    }, f.MonitorDOMRefresh = function(a) {
                        function b() {
                            a._isShown = !0, d()
                        }

                        function c() {
                            a._isRendered = !0, d()
                        }

                        function d() {
                            a._isShown && a._isRendered && f.isNodeAttached(a.el) && f.triggerMethodOn(a, "dom:refresh", a)
                        }
                        a._isDomRefreshMonitored || (a._isDomRefreshMonitored = !0, a.on({
                            show: b,
                            render: c
                        }))
                    },
                    function(a) {
                        function b(b, d, e, f) {
                            var g = f.split(/\s+/);
                            c.each(g, function(c) {
                                var f = b[c];
                                if (!f) throw new a.Error('Method "' + c + '" was configured as an event handler, but does not exist.');
                                b.listenTo(d, e, f)
                            })
                        }

                        function d(a, b, c, d) {
                            a.listenTo(b, c, d)
                        }

                        function e(a, b, d, e) {
                            var f = e.split(/\s+/);
                            c.each(f, function(c) {
                                var e = a[c];
                                a.stopListening(b, d, e)
                            })
                        }

                        function f(a, b, c, d) {
                            a.stopListening(b, c, d)
                        }

                        function g(b, d, e, f, g) {
                            if (d && e) {
                                if (!c.isObject(e)) throw new a.Error({
                                    message: "Bindings must be an object or function.",
                                    url: "marionette.functions.html#marionettebindentityevents"
                                });
                                e = a._getValue(e, b), c.each(e, function(a, e) {
                                    c.isFunction(a) ? f(b, d, e, a) : g(b, d, e, a)
                                })
                            }
                        }
                        a.bindEntityEvents = function(a, c, e) {
                            g(a, c, e, d, b)
                        }, a.unbindEntityEvents = function(a, b, c) {
                            g(a, b, c, f, e)
                        }, a.proxyBindEntityEvents = function(b, c) {
                            return a.bindEntityEvents(this, b, c)
                        }, a.proxyUnbindEntityEvents = function(b, c) {
                            return a.unbindEntityEvents(this, b, c)
                        }
                    }(f);
                var h = ["description", "fileName", "lineNumber", "name", "message", "number"];
                return f.Error = f.extend.call(Error, {
                    urlRoot: "http://marionettejs.com/docs/v" + f.VERSION + "/",
                    constructor: function(a, b) {
                        c.isObject(a) ? (b = a, a = b.message) : b || (b = {});
                        var d = Error.call(this, a);
                        c.extend(this, c.pick(d, h), c.pick(b, h)), this.captureStackTrace(), b.url && (this.url = this.urlRoot + b.url)
                    },
                    captureStackTrace: function() {
                        Error.captureStackTrace && Error.captureStackTrace(this, f.Error)
                    },
                    toString: function() {
                        return this.name + ": " + this.message + (this.url ? " See: " + this.url : "")
                    }
                }), f.Error.extend = f.extend, f.Callbacks = function() {
                    this._deferred = f.Deferred(), this._callbacks = []
                }, c.extend(f.Callbacks.prototype, {
                    add: function(a, b) {
                        var d = c.result(this._deferred, "promise");
                        this._callbacks.push({
                            cb: a,
                            ctx: b
                        }), d.then(function(c) {
                            b && (c.context = b), a.call(c.context, c.options)
                        })
                    },
                    run: function(a, b) {
                        this._deferred.resolve({
                            options: a,
                            context: b
                        })
                    },
                    reset: function() {
                        var a = this._callbacks;
                        this._deferred = f.Deferred(), this._callbacks = [], c.each(a, function(a) {
                            this.add(a.cb, a.ctx)
                        }, this)
                    }
                }), f.Controller = function(a) {
                    this.options = a || {}, c.isFunction(this.initialize) && this.initialize(this.options)
                }, f.Controller.extend = f.extend, c.extend(f.Controller.prototype, b.Events, {
                    destroy: function() {
                        return f._triggerMethod(this, "before:destroy", arguments), f._triggerMethod(this, "destroy", arguments), this.stopListening(), this.off(), this
                    },
                    triggerMethod: f.triggerMethod,
                    mergeOptions: f.mergeOptions,
                    getOption: f.proxyGetOption
                }), f.Object = function(a) {
                    this.options = c.extend({}, c.result(this, "options"), a), this.initialize.apply(this, arguments)
                }, f.Object.extend = f.extend, c.extend(f.Object.prototype, b.Events, {
                    initialize: function() {},
                    destroy: function() {
                        return this.triggerMethod("before:destroy"), this.triggerMethod("destroy"), this.stopListening(), this
                    },
                    triggerMethod: f.triggerMethod,
                    mergeOptions: f.mergeOptions,
                    getOption: f.proxyGetOption,
                    bindEntityEvents: f.proxyBindEntityEvents,
                    unbindEntityEvents: f.proxyUnbindEntityEvents
                }), f.Region = f.Object.extend({
                    constructor: function(a) {
                        if (this.options = a || {}, this.el = this.getOption("el"), this.el = this.el instanceof b.$ ? this.el[0] : this.el, !this.el) throw new f.Error({
                            name: "NoElError",
                            message: 'An "el" must be specified for a region.'
                        });
                        this.$el = this.getEl(this.el), f.Object.call(this, a)
                    },
                    show: function(a, b) {
                        if (this._ensureElement()) {
                            this._ensureViewIsIntact(a), f.MonitorDOMRefresh(a);
                            var d = b || {},
                                e = a !== this.currentView,
                                g = !!d.preventDestroy,
                                h = !!d.forceShow,
                                i = !!this.currentView,
                                j = e && !g,
                                k = e || h;
                            if (i && this.triggerMethod("before:swapOut", this.currentView, this, b), this.currentView && delete this.currentView._parent, j ? this.empty() : i && k && this.currentView.off("destroy", this.empty, this), k) {
                                a.once("destroy", this.empty, this), this._renderView(a), a._parent = this, i && this.triggerMethod("before:swap", a, this, b), this.triggerMethod("before:show", a, this, b), f.triggerMethodOn(a, "before:show", a, this, b), i && this.triggerMethod("swapOut", this.currentView, this, b);
                                var l = f.isNodeAttached(this.el),
                                    m = [],
                                    n = c.extend({
                                        triggerBeforeAttach: this.triggerBeforeAttach,
                                        triggerAttach: this.triggerAttach
                                    }, d);
                                return l && n.triggerBeforeAttach && (m = this._displayedViews(a), this._triggerAttach(m, "before:")), this.attachHtml(a), this.currentView = a, l && n.triggerAttach && (m = this._displayedViews(a), this._triggerAttach(m)), i && this.triggerMethod("swap", a, this, b), this.triggerMethod("show", a, this, b), f.triggerMethodOn(a, "show", a, this, b), this
                            }
                            return this
                        }
                    },
                    triggerBeforeAttach: !0,
                    triggerAttach: !0,
                    _triggerAttach: function(a, b) {
                        var d = (b || "") + "attach";
                        c.each(a, function(a) {
                            f.triggerMethodOn(a, d, a, this)
                        }, this)
                    },
                    _displayedViews: function(a) {
                        return c.union([a], c.result(a, "_getNestedViews") || [])
                    },
                    _renderView: function(a) {
                        a.supportsRenderLifecycle || f.triggerMethodOn(a, "before:render", a), a.render(), a.supportsRenderLifecycle || f.triggerMethodOn(a, "render", a)
                    },
                    _ensureElement: function() {
                        if (c.isObject(this.el) || (this.$el = this.getEl(this.el), this.el = this.$el[0]), !this.$el || 0 === this.$el.length) {
                            if (this.getOption("allowMissingEl")) return !1;
                            throw new f.Error('An "el" ' + this.$el.selector + " must exist in DOM")
                        }
                        return !0
                    },
                    _ensureViewIsIntact: function(a) {
                        if (!a) throw new f.Error({
                            name: "ViewNotValid",
                            message: "The view passed is undefined and therefore invalid. You must pass a view instance to show."
                        });
                        if (a.isDestroyed) throw new f.Error({
                            name: "ViewDestroyedError",
                            message: 'View (cid: "' + a.cid + '") has already been destroyed and cannot be used.'
                        })
                    },
                    getEl: function(a) {
                        return b.$(a, f._getValue(this.options.parentEl, this))
                    },
                    attachHtml: function(a) {
                        this.$el.contents().detach(), this.el.appendChild(a.el)
                    },
                    empty: function(a) {
                        var b = this.currentView,
                            c = a || {},
                            d = !!c.preventDestroy;
                        return b ? (b.off("destroy", this.empty, this), this.triggerMethod("before:empty", b), d || this._destroyView(), this.triggerMethod("empty", b), delete this.currentView, d && this.$el.contents().detach(), this) : void 0
                    },
                    _destroyView: function() {
                        var a = this.currentView;
                        a.isDestroyed || (a.supportsDestroyLifecycle || f.triggerMethodOn(a, "before:destroy", a), a.destroy ? a.destroy() : (a.remove(), a.isDestroyed = !0), a.supportsDestroyLifecycle || f.triggerMethodOn(a, "destroy", a))
                    },
                    attachView: function(a) {
                        return this.currentView && delete this.currentView._parent, a._parent = this, this.currentView = a, this
                    },
                    hasView: function() {
                        return !!this.currentView
                    },
                    reset: function() {
                        return this.empty(), this.$el && (this.el = this.$el.selector), delete this.$el, this
                    }
                }, {
                    buildRegion: function(a, b) {
                        if (c.isString(a)) return this._buildRegionFromSelector(a, b);
                        if (a.selector || a.el || a.regionClass) return this._buildRegionFromObject(a, b);
                        if (c.isFunction(a)) return this._buildRegionFromRegionClass(a);
                        throw new f.Error({
                            message: "Improper region configuration type.",
                            url: "marionette.region.html#region-configuration-types"
                        })
                    },
                    _buildRegionFromSelector: function(a, b) {
                        return new b({
                            el: a
                        })
                    },
                    _buildRegionFromObject: function(a, b) {
                        var d = a.regionClass || b,
                            e = c.omit(a, "selector", "regionClass");
                        return a.selector && !e.el && (e.el = a.selector), new d(e)
                    },
                    _buildRegionFromRegionClass: function(a) {
                        return new a
                    }
                }), f.RegionManager = f.Controller.extend({
                    constructor: function(a) {
                        this._regions = {}, this.length = 0, f.Controller.call(this, a), this.addRegions(this.getOption("regions"))
                    },
                    addRegions: function(a, b) {
                        return a = f._getValue(a, this, arguments), c.reduce(a, function(a, d, e) {
                            return c.isString(d) && (d = {
                                selector: d
                            }), d.selector && (d = c.defaults({}, d, b)), a[e] = this.addRegion(e, d), a
                        }, {}, this)
                    },
                    addRegion: function(a, b) {
                        var c;
                        return c = b instanceof f.Region ? b : f.Region.buildRegion(b, f.Region), this.triggerMethod("before:add:region", a, c), c._parent = this, this._store(a, c), this.triggerMethod("add:region", a, c), c
                    },
                    get: function(a) {
                        return this._regions[a]
                    },
                    getRegions: function() {
                        return c.clone(this._regions)
                    },
                    removeRegion: function(a) {
                        var b = this._regions[a];
                        return this._remove(a, b), b
                    },
                    removeRegions: function() {
                        var a = this.getRegions();
                        return c.each(this._regions, function(a, b) {
                            this._remove(b, a)
                        }, this), a
                    },
                    emptyRegions: function() {
                        var a = this.getRegions();
                        return c.invoke(a, "empty"), a
                    },
                    destroy: function() {
                        return this.removeRegions(), f.Controller.prototype.destroy.apply(this, arguments)
                    },
                    _store: function(a, b) {
                        this._regions[a] || this.length++, this._regions[a] = b
                    },
                    _remove: function(a, b) {
                        this.triggerMethod("before:remove:region", a, b), b.empty(), b.stopListening(), delete b._parent, delete this._regions[a], this.length--, this.triggerMethod("remove:region", a, b)
                    }
                }), f.actAsCollection(f.RegionManager.prototype, "_regions"), f.TemplateCache = function(a) {
                    this.templateId = a
                }, c.extend(f.TemplateCache, {
                    templateCaches: {},
                    get: function(a, b) {
                        var c = this.templateCaches[a];
                        return c || (c = new f.TemplateCache(a), this.templateCaches[a] = c), c.load(b)
                    },
                    clear: function() {
                        var a, b = c.toArray(arguments),
                            d = b.length;
                        if (d > 0)
                            for (a = 0; d > a; a++) delete this.templateCaches[b[a]];
                        else this.templateCaches = {}
                    }
                }), c.extend(f.TemplateCache.prototype, {
                    load: function(a) {
                        if (this.compiledTemplate) return this.compiledTemplate;
                        var b = this.loadTemplate(this.templateId, a);
                        return this.compiledTemplate = this.compileTemplate(b, a), this.compiledTemplate
                    },
                    loadTemplate: function(a, c) {
                        var d = b.$(a);
                        if (!d.length) throw new f.Error({
                            name: "NoTemplateError",
                            message: 'Could not find template: "' + a + '"'
                        });
                        return d.html()
                    },
                    compileTemplate: function(a, b) {
                        return c.template(a, b)
                    }
                }), f.Renderer = {
                    render: function(a, b) {
                        if (!a) throw new f.Error({
                            name: "TemplateNotFoundError",
                            message: "Cannot render the template since its false, null or undefined."
                        });
                        var d = c.isFunction(a) ? a : f.TemplateCache.get(a);
                        return d(b)
                    }
                }, f.View = b.View.extend({
                    isDestroyed: !1,
                    supportsRenderLifecycle: !0,
                    supportsDestroyLifecycle: !0,
                    constructor: function(a) {
                        this.render = c.bind(this.render, this), a = f._getValue(a, this), this.options = c.extend({}, c.result(this, "options"), a), this._behaviors = f.Behaviors(this), b.View.call(this, this.options), f.MonitorDOMRefresh(this)
                    },
                    getTemplate: function() {
                        return this.getOption("template")
                    },
                    serializeModel: function(a) {
                        return a.toJSON.apply(a, c.rest(arguments))
                    },
                    mixinTemplateHelpers: function(a) {
                        a = a || {};
                        var b = this.getOption("templateHelpers");
                        return b = f._getValue(b, this), c.extend(a, b)
                    },
                    normalizeUIKeys: function(a) {
                        var b = c.result(this, "_uiBindings");
                        return f.normalizeUIKeys(a, b || c.result(this, "ui"))
                    },
                    normalizeUIValues: function(a, b) {
                        var d = c.result(this, "ui"),
                            e = c.result(this, "_uiBindings");
                        return f.normalizeUIValues(a, e || d, b)
                    },
                    configureTriggers: function() {
                        if (this.triggers) {
                            var a = this.normalizeUIKeys(c.result(this, "triggers"));
                            return c.reduce(a, function(a, b, c) {
                                return a[c] = this._buildViewTrigger(b), a
                            }, {}, this)
                        }
                    },
                    delegateEvents: function(a) {
                        return this._delegateDOMEvents(a), this.bindEntityEvents(this.model, this.getOption("modelEvents")), this.bindEntityEvents(this.collection, this.getOption("collectionEvents")), c.each(this._behaviors, function(a) {
                            a.bindEntityEvents(this.model, a.getOption("modelEvents")), a.bindEntityEvents(this.collection, a.getOption("collectionEvents"))
                        }, this), this
                    },
                    _delegateDOMEvents: function(a) {
                        var d = f._getValue(a || this.events, this);
                        d = this.normalizeUIKeys(d), c.isUndefined(a) && (this.events = d);
                        var e = {},
                            g = c.result(this, "behaviorEvents") || {},
                            h = this.configureTriggers(),
                            i = c.result(this, "behaviorTriggers") || {};
                        c.extend(e, g, d, h, i), b.View.prototype.delegateEvents.call(this, e)
                    },
                    undelegateEvents: function() {
                        return b.View.prototype.undelegateEvents.apply(this, arguments), this.unbindEntityEvents(this.model, this.getOption("modelEvents")), this.unbindEntityEvents(this.collection, this.getOption("collectionEvents")), c.each(this._behaviors, function(a) {
                            a.unbindEntityEvents(this.model, a.getOption("modelEvents")), a.unbindEntityEvents(this.collection, a.getOption("collectionEvents"))
                        }, this), this
                    },
                    _ensureViewIsIntact: function() {
                        if (this.isDestroyed) throw new f.Error({
                            name: "ViewDestroyedError",
                            message: 'View (cid: "' + this.cid + '") has already been destroyed and cannot be used.'
                        })
                    },
                    destroy: function() {
                        if (this.isDestroyed) return this;
                        var a = c.toArray(arguments);
                        return this.triggerMethod.apply(this, ["before:destroy"].concat(a)), this.isDestroyed = !0, this.triggerMethod.apply(this, ["destroy"].concat(a)), this.unbindUIElements(), this.isRendered = !1, this.remove(), c.invoke(this._behaviors, "destroy", a), this
                    },
                    bindUIElements: function() {
                        this._bindUIElements(), c.invoke(this._behaviors, this._bindUIElements)
                    },
                    _bindUIElements: function() {
                        if (this.ui) {
                            this._uiBindings || (this._uiBindings = this.ui);
                            var a = c.result(this, "_uiBindings");
                            this.ui = {}, c.each(a, function(a, b) {
                                this.ui[b] = this.$(a)
                            }, this)
                        }
                    },
                    unbindUIElements: function() {
                        this._unbindUIElements(), c.invoke(this._behaviors, this._unbindUIElements)
                    },
                    _unbindUIElements: function() {
                        this.ui && this._uiBindings && (c.each(this.ui, function(a, b) {
                            delete this.ui[b]
                        }, this), this.ui = this._uiBindings, delete this._uiBindings)
                    },
                    _buildViewTrigger: function(a) {
                        var b = c.defaults({}, a, {
                                preventDefault: !0,
                                stopPropagation: !0
                            }),
                            d = c.isObject(a) ? b.event : a;
                        return function(a) {
                            a && (a.preventDefault && b.preventDefault && a.preventDefault(), a.stopPropagation && b.stopPropagation && a.stopPropagation());
                            var c = {
                                view: this,
                                model: this.model,
                                collection: this.collection
                            };
                            this.triggerMethod(d, c)
                        }
                    },
                    setElement: function() {
                        var a = b.View.prototype.setElement.apply(this, arguments);
                        return c.invoke(this._behaviors, "proxyViewProperties", this), a
                    },
                    triggerMethod: function() {
                        var a = f._triggerMethod(this, arguments);
                        return this._triggerEventOnBehaviors(arguments), this._triggerEventOnParentLayout(arguments[0], c.rest(arguments)), a
                    },
                    _triggerEventOnBehaviors: function(a) {
                        for (var b = f._triggerMethod, c = this._behaviors, d = 0, e = c && c.length; e > d; d++) b(c[d], a)
                    },
                    _triggerEventOnParentLayout: function(a, b) {
                        var d = this._parentLayoutView();
                        if (d) {
                            var e = f.getOption(d, "childViewEventPrefix"),
                                g = e + ":" + a,
                                h = [this].concat(b);
                            f._triggerMethod(d, g, h);
                            var i = f.getOption(d, "childEvents"),
                                j = d.normalizeMethods(i);
                            j && c.isFunction(j[a]) && j[a].apply(d, h)
                        }
                    },
                    _getImmediateChildren: function() {
                        return []
                    },
                    _getNestedViews: function() {
                        var a = this._getImmediateChildren();
                        return a.length ? c.reduce(a, function(a, b) {
                            return b._getNestedViews ? a.concat(b._getNestedViews()) : a
                        }, a) : a
                    },
                    _getAncestors: function() {
                        for (var a = [], b = this._parent; b;) a.push(b), b = b._parent;
                        return a
                    },
                    _parentLayoutView: function() {
                        var a = this._getAncestors();
                        return c.find(a, function(a) {
                            return a instanceof f.LayoutView
                        })
                    },
                    normalizeMethods: f.normalizeMethods,
                    mergeOptions: f.mergeOptions,
                    getOption: f.proxyGetOption,
                    bindEntityEvents: f.proxyBindEntityEvents,
                    unbindEntityEvents: f.proxyUnbindEntityEvents
                }), f.ItemView = f.View.extend({
                    constructor: function() {
                        f.View.apply(this, arguments)
                    },
                    serializeData: function() {
                        if (!this.model && !this.collection) return {};
                        var a = [this.model || this.collection];
                        return arguments.length && a.push.apply(a, arguments), this.model ? this.serializeModel.apply(this, a) : {
                            items: this.serializeCollection.apply(this, a)
                        }
                    },
                    serializeCollection: function(a) {
                        return a.toJSON.apply(a, c.rest(arguments))
                    },
                    render: function() {
                        return this._ensureViewIsIntact(), this.triggerMethod("before:render", this), this._renderTemplate(), this.isRendered = !0, this.bindUIElements(), this.triggerMethod("render", this), this
                    },
                    _renderTemplate: function() {
                        var a = this.getTemplate();
                        if (a !== !1) {
                            if (!a) throw new f.Error({
                                name: "UndefinedTemplateError",
                                message: "Cannot render the template since it is null or undefined."
                            });
                            var b = this.mixinTemplateHelpers(this.serializeData()),
                                c = f.Renderer.render(a, b, this);
                            return this.attachElContent(c), this
                        }
                    },
                    attachElContent: function(a) {
                        return this.$el.html(a), this
                    }
                }), f.CollectionView = f.View.extend({
                    childViewEventPrefix: "childview",
                    sort: !0,
                    constructor: function(a) {
                        this.once("render", this._initialEvents), this._initChildViewStorage(), f.View.apply(this, arguments), this.on({
                            "before:show": this._onBeforeShowCalled,
                            show: this._onShowCalled,
                            "before:attach": this._onBeforeAttachCalled,
                            attach: this._onAttachCalled
                        }), this.initRenderBuffer()
                    },
                    initRenderBuffer: function() {
                        this._bufferedChildren = []
                    },
                    startBuffering: function() {
                        this.initRenderBuffer(), this.isBuffering = !0
                    },
                    endBuffering: function() {
                        var a, b = this._isShown && f.isNodeAttached(this.el);
                        this.isBuffering = !1, this._isShown && this._triggerMethodMany(this._bufferedChildren, this, "before:show"), b && this._triggerBeforeAttach && (a = this._getNestedViews(), this._triggerMethodMany(a, this, "before:attach")), this.attachBuffer(this, this._createBuffer()), b && this._triggerAttach && (a = this._getNestedViews(), this._triggerMethodMany(a, this, "attach")), this._isShown && this._triggerMethodMany(this._bufferedChildren, this, "show"), this.initRenderBuffer()
                    },
                    _triggerMethodMany: function(a, b, d) {
                        var e = c.drop(arguments, 3);
                        c.each(a, function(a) {
                            f.triggerMethodOn.apply(a, [a, d, a, b].concat(e))
                        })
                    },
                    _initialEvents: function() {
                        this.collection && (this.listenTo(this.collection, "add", this._onCollectionAdd), this.listenTo(this.collection, "remove", this._onCollectionRemove), this.listenTo(this.collection, "reset", this.render), this.getOption("sort") && this.listenTo(this.collection, "sort", this._sortViews))
                    },
                    _onCollectionAdd: function(a, b, d) {
                        var e = void 0 !== d.at && (d.index || b.indexOf(a));
                        if ((this.getOption("filter") || e === !1) && (e = c.indexOf(this._filteredSortedModels(e), a)), this._shouldAddChild(a, e)) {
                            this.destroyEmptyView();
                            var f = this.getChildView(a);
                            this.addChild(a, f, e)
                        }
                    },
                    _onCollectionRemove: function(a) {
                        var b = this.children.findByModel(a);
                        this.removeChildView(b), this.checkEmpty()
                    },
                    _onBeforeShowCalled: function() {
                        this._triggerBeforeAttach = this._triggerAttach = !1, this.children.each(function(a) {
                            f.triggerMethodOn(a, "before:show", a)
                        })
                    },
                    _onShowCalled: function() {
                        this.children.each(function(a) {
                            f.triggerMethodOn(a, "show", a)
                        })
                    },
                    _onBeforeAttachCalled: function() {
                        this._triggerBeforeAttach = !0
                    },
                    _onAttachCalled: function() {
                        this._triggerAttach = !0
                    },
                    render: function() {
                        return this._ensureViewIsIntact(), this.triggerMethod("before:render", this), this._renderChildren(), this.isRendered = !0, this.triggerMethod("render", this), this
                    },
                    reorder: function() {
                        var a = this.children,
                            b = this._filteredSortedModels(),
                            d = c.find(b, function(b) {
                                return !a.findByModel(b)
                            });
                        if (d) this.render();
                        else {
                            var e = c.map(b, function(b, c) {
                                var d = a.findByModel(b);
                                return d._index = c, d.el
                            });
                            this.triggerMethod("before:reorder"), this._appendReorderedChildren(e), this.triggerMethod("reorder")
                        }
                    },
                    resortView: function() {
                        f.getOption(this, "reorderOnSort") ? this.reorder() : this.render()
                    },
                    _sortViews: function() {
                        var a = this._filteredSortedModels(),
                            b = c.find(a, function(a, b) {
                                var c = this.children.findByModel(a);
                                return !c || c._index !== b
                            }, this);
                        b && this.resortView()
                    },
                    _emptyViewIndex: -1,
                    _appendReorderedChildren: function(a) {
                        this.$el.append(a)
                    },
                    _renderChildren: function() {
                        this.destroyEmptyView(), this.destroyChildren({
                            checkEmpty: !1
                        }), this.isEmpty(this.collection) ? this.showEmptyView() : (this.triggerMethod("before:render:collection", this), this.startBuffering(), this.showCollection(), this.endBuffering(), this.triggerMethod("render:collection", this), this.children.isEmpty() && this.getOption("filter") && this.showEmptyView())
                    },
                    showCollection: function() {
                        var a, b = this._filteredSortedModels();
                        c.each(b, function(b, c) {
                            a = this.getChildView(b), this.addChild(b, a, c)
                        }, this)
                    },
                    _filteredSortedModels: function(a) {
                        var b = this.getViewComparator(),
                            d = this.collection.models;
                        if (a = Math.min(Math.max(a, 0), d.length - 1), b) {
                            var e;
                            a && (e = d[a], d = d.slice(0, a).concat(d.slice(a + 1))), d = this._sortModelsBy(d, b), e && d.splice(a, 0, e)
                        }
                        return this.getOption("filter") && (d = c.filter(d, function(a, b) {
                            return this._shouldAddChild(a, b)
                        }, this)), d
                    },
                    _sortModelsBy: function(a, b) {
                        return "string" == typeof b ? c.sortBy(a, function(a) {
                            return a.get(b)
                        }, this) : 1 === b.length ? c.sortBy(a, b, this) : a.sort(c.bind(b, this))
                    },
                    showEmptyView: function() {
                        var a = this.getEmptyView();
                        if (a && !this._showingEmptyView) {
                            this.triggerMethod("before:render:empty"), this._showingEmptyView = !0;
                            var c = new b.Model;
                            this.addEmptyView(c, a), this.triggerMethod("render:empty")
                        }
                    },
                    destroyEmptyView: function() {
                        this._showingEmptyView && (this.triggerMethod("before:remove:empty"), this.destroyChildren(), delete this._showingEmptyView, this.triggerMethod("remove:empty"))
                    },
                    getEmptyView: function() {
                        return this.getOption("emptyView")
                    },
                    addEmptyView: function(a, b) {
                        var d, e = this._isShown && !this.isBuffering && f.isNodeAttached(this.el),
                            g = this.getOption("emptyViewOptions") || this.getOption("childViewOptions");
                        c.isFunction(g) && (g = g.call(this, a, this._emptyViewIndex));
                        var h = this.buildChildView(a, b, g);
                        h._parent = this, this.proxyChildEvents(h), h.once("render", function() {
                            this._isShown && f.triggerMethodOn(h, "before:show", h), e && this._triggerBeforeAttach && (d = this._getViewAndNested(h), this._triggerMethodMany(d, this, "before:attach"))
                        }, this), this.children.add(h), this.renderChildView(h, this._emptyViewIndex), e && this._triggerAttach && (d = this._getViewAndNested(h), this._triggerMethodMany(d, this, "attach")), this._isShown && f.triggerMethodOn(h, "show", h)
                    },
                    getChildView: function(a) {
                        var b = this.getOption("childView");
                        if (!b) throw new f.Error({
                            name: "NoChildViewError",
                            message: 'A "childView" must be specified'
                        });
                        return b
                    },
                    addChild: function(a, b, c) {
                        var d = this.getOption("childViewOptions");
                        d = f._getValue(d, this, [a, c]);
                        var e = this.buildChildView(a, b, d);
                        return this._updateIndices(e, !0, c), this.triggerMethod("before:add:child", e), this._addChildView(e, c), this.triggerMethod("add:child", e), e._parent = this, e
                    },
                    _updateIndices: function(a, b, c) {
                        this.getOption("sort") && (b && (a._index = c), this.children.each(function(c) {
                            c._index >= a._index && (c._index += b ? 1 : -1)
                        }))
                    },
                    _addChildView: function(a, b) {
                        var c, d = this._isShown && !this.isBuffering && f.isNodeAttached(this.el);
                        this.proxyChildEvents(a), a.once("render", function() {
                            this._isShown && !this.isBuffering && f.triggerMethodOn(a, "before:show", a), d && this._triggerBeforeAttach && (c = this._getViewAndNested(a), this._triggerMethodMany(c, this, "before:attach"))
                        }, this), this.children.add(a), this.renderChildView(a, b), d && this._triggerAttach && (c = this._getViewAndNested(a), this._triggerMethodMany(c, this, "attach")), this._isShown && !this.isBuffering && f.triggerMethodOn(a, "show", a)
                    },
                    renderChildView: function(a, b) {
                        return a.supportsRenderLifecycle || f.triggerMethodOn(a, "before:render", a), a.render(), a.supportsRenderLifecycle || f.triggerMethodOn(a, "render", a), this.attachHtml(this, a, b), a
                    },
                    buildChildView: function(a, b, d) {
                        var e = c.extend({
                                model: a
                            }, d),
                            g = new b(e);
                        return f.MonitorDOMRefresh(g), g
                    },
                    removeChildView: function(a) {
                        return a ? (this.triggerMethod("before:remove:child", a), a.supportsDestroyLifecycle || f.triggerMethodOn(a, "before:destroy", a), a.destroy ? a.destroy() : a.remove(), a.supportsDestroyLifecycle || f.triggerMethodOn(a, "destroy", a), delete a._parent, this.stopListening(a), this.children.remove(a), this.triggerMethod("remove:child", a), this._updateIndices(a, !1), a) : a
                    },
                    isEmpty: function() {
                        return !this.collection || 0 === this.collection.length
                    },
                    checkEmpty: function() {
                        this.isEmpty(this.collection) && this.showEmptyView()
                    },
                    attachBuffer: function(a, b) {
                        a.$el.append(b)
                    },
                    _createBuffer: function() {
                        var a = document.createDocumentFragment();
                        return c.each(this._bufferedChildren, function(b) {
                            a.appendChild(b.el)
                        }), a
                    },
                    attachHtml: function(a, b, c) {
                        a.isBuffering ? a._bufferedChildren.splice(c, 0, b) : a._insertBefore(b, c) || a._insertAfter(b)
                    },
                    _insertBefore: function(a, b) {
                        var c, d = this.getOption("sort") && b < this.children.length - 1;
                        return d && (c = this.children.find(function(a) {
                            return a._index === b + 1
                        })), c ? (c.$el.before(a.el), !0) : !1
                    },
                    _insertAfter: function(a) {
                        this.$el.append(a.el)
                    },
                    _initChildViewStorage: function() {
                        this.children = new b.ChildViewContainer
                    },
                    destroy: function() {
                        return this.isDestroyed ? this : (this.triggerMethod("before:destroy:collection"), this.destroyChildren({
                            checkEmpty: !1
                        }), this.triggerMethod("destroy:collection"), f.View.prototype.destroy.apply(this, arguments))
                    },
                    destroyChildren: function(a) {
                        var b = a || {},
                            d = !0,
                            e = this.children.map(c.identity);
                        return c.isUndefined(b.checkEmpty) || (d = b.checkEmpty), this.children.each(this.removeChildView, this), d && this.checkEmpty(), e
                    },
                    _shouldAddChild: function(a, b) {
                        var d = this.getOption("filter");
                        return !c.isFunction(d) || d.call(this, a, b, this.collection)
                    },
                    proxyChildEvents: function(a) {
                        var b = this.getOption("childViewEventPrefix");
                        this.listenTo(a, "all", function() {
                            var d = c.toArray(arguments),
                                e = d[0],
                                f = this.normalizeMethods(c.result(this, "childEvents"));
                            d[0] = b + ":" + e, d.splice(1, 0, a), "undefined" != typeof f && c.isFunction(f[e]) && f[e].apply(this, d.slice(1)), this.triggerMethod.apply(this, d)
                        })
                    },
                    _getImmediateChildren: function() {
                        return c.values(this.children._views)
                    },
                    _getViewAndNested: function(a) {
                        return [a].concat(c.result(a, "_getNestedViews") || [])
                    },
                    getViewComparator: function() {
                        return this.getOption("viewComparator")
                    }
                }), f.CompositeView = f.CollectionView.extend({
                    constructor: function() {
                        f.CollectionView.apply(this, arguments)
                    },
                    _initialEvents: function() {
                        this.collection && (this.listenTo(this.collection, "add", this._onCollectionAdd), this.listenTo(this.collection, "remove", this._onCollectionRemove), this.listenTo(this.collection, "reset", this._renderChildren), this.getOption("sort") && this.listenTo(this.collection, "sort", this._sortViews))
                    },
                    getChildView: function(a) {
                        var b = this.getOption("childView") || this.constructor;
                        return b
                    },
                    serializeData: function() {
                        var a = {};
                        return this.model && (a = c.partial(this.serializeModel, this.model).apply(this, arguments)), a
                    },
                    render: function() {
                        return this._ensureViewIsIntact(), this._isRendering = !0, this.resetChildViewContainer(), this.triggerMethod("before:render", this), this._renderTemplate(), this._renderChildren(), this._isRendering = !1, this.isRendered = !0, this.triggerMethod("render", this), this
                    },
                    _renderChildren: function() {
                        (this.isRendered || this._isRendering) && f.CollectionView.prototype._renderChildren.call(this)
                    },
                    _renderTemplate: function() {
                        var a = {};
                        a = this.serializeData(), a = this.mixinTemplateHelpers(a), this.triggerMethod("before:render:template");
                        var b = this.getTemplate(),
                            c = f.Renderer.render(b, a, this);
                        this.attachElContent(c), this.bindUIElements(), this.triggerMethod("render:template")
                    },
                    attachElContent: function(a) {
                        return this.$el.html(a), this
                    },
                    attachBuffer: function(a, b) {
                        var c = this.getChildViewContainer(a);
                        c.append(b)
                    },
                    _insertAfter: function(a) {
                        var b = this.getChildViewContainer(this, a);
                        b.append(a.el)
                    },
                    _appendReorderedChildren: function(a) {
                        var b = this.getChildViewContainer(this);
                        b.append(a)
                    },
                    getChildViewContainer: function(a, b) {
                        if (a.$childViewContainer) return a.$childViewContainer;
                        var c, d = f.getOption(a, "childViewContainer");
                        if (d) {
                            var e = f._getValue(d, a);
                            if (c = "@" === e.charAt(0) && a.ui ? a.ui[e.substr(4)] : a.$(e), c.length <= 0) throw new f.Error({
                                name: "ChildViewContainerMissingError",
                                message: 'The specified "childViewContainer" was not found: ' + a.childViewContainer
                            })
                        } else c = a.$el;
                        return a.$childViewContainer = c, c
                    },
                    resetChildViewContainer: function() {
                        this.$childViewContainer && (this.$childViewContainer = void 0)
                    }
                }), f.LayoutView = f.ItemView.extend({
                    regionClass: f.Region,
                    options: {
                        destroyImmediate: !1
                    },
                    childViewEventPrefix: "childview",
                    constructor: function(a) {
                        a = a || {}, this._firstRender = !0, this._initializeRegions(a), f.ItemView.call(this, a)
                    },
                    render: function() {
                        return this._ensureViewIsIntact(), this._firstRender ? this._firstRender = !1 : this._reInitializeRegions(), f.ItemView.prototype.render.apply(this, arguments)
                    },
                    destroy: function() {
                        return this.isDestroyed ? this : (this.getOption("destroyImmediate") === !0 && this.$el.remove(), this.regionManager.destroy(), f.ItemView.prototype.destroy.apply(this, arguments))
                    },
                    showChildView: function(a, b) {
                        return this.getRegion(a).show(b)
                    },
                    getChildView: function(a) {
                        return this.getRegion(a).currentView
                    },
                    addRegion: function(a, b) {
                        var c = {};
                        return c[a] = b, this._buildRegions(c)[a]
                    },
                    addRegions: function(a) {
                        return this.regions = c.extend({}, this.regions, a), this._buildRegions(a)
                    },
                    removeRegion: function(a) {
                        return delete this.regions[a], this.regionManager.removeRegion(a)
                    },
                    getRegion: function(a) {
                        return this.regionManager.get(a)
                    },
                    getRegions: function() {
                        return this.regionManager.getRegions()
                    },
                    _buildRegions: function(a) {
                        var b = {
                            regionClass: this.getOption("regionClass"),
                            parentEl: c.partial(c.result, this, "el")
                        };
                        return this.regionManager.addRegions(a, b)
                    },
                    _initializeRegions: function(a) {
                        var b;
                        this._initRegionManager(), b = f._getValue(this.regions, this, [a]) || {};
                        var d = this.getOption.call(a, "regions");
                        d = f._getValue(d, this, [a]), c.extend(b, d), b = this.normalizeUIValues(b, ["selector", "el"]), this.addRegions(b)
                    },
                    _reInitializeRegions: function() {
                        this.regionManager.invoke("reset")
                    },
                    getRegionManager: function() {
                        return new f.RegionManager
                    },
                    _initRegionManager: function() {
                        this.regionManager = this.getRegionManager(), this.regionManager._parent = this, this.listenTo(this.regionManager, "before:add:region", function(a) {
                            this.triggerMethod("before:add:region", a)
                        }), this.listenTo(this.regionManager, "add:region", function(a, b) {
                            this[a] = b, this.triggerMethod("add:region", a, b)
                        }), this.listenTo(this.regionManager, "before:remove:region", function(a) {
                            this.triggerMethod("before:remove:region", a)
                        }), this.listenTo(this.regionManager, "remove:region", function(a, b) {
                            delete this[a], this.triggerMethod("remove:region", a, b)
                        })
                    },
                    _getImmediateChildren: function() {
                        return c.chain(this.regionManager.getRegions()).pluck("currentView").compact().value()
                    }
                }), f.Behavior = f.Object.extend({
                    constructor: function(a, b) {
                        this.view = b, this.defaults = c.result(this, "defaults") || {}, this.options = c.extend({}, this.defaults, a), this.ui = c.extend({}, c.result(b, "ui"), c.result(this, "ui")), f.Object.apply(this, arguments)
                    },
                    $: function() {
                        return this.view.$.apply(this.view, arguments)
                    },
                    destroy: function() {
                        return this.stopListening(), this
                    },
                    proxyViewProperties: function(a) {
                        this.$el = a.$el, this.el = a.el
                    }
                }), f.Behaviors = function(a, b) {
                    function c(a, d) {
                        return b.isObject(a.behaviors) ? (d = c.parseBehaviors(a, d || b.result(a, "behaviors")), c.wrap(a, d, b.keys(g)), d) : {}
                    }

                    function d(a, b) {
                        this._view = a, this._behaviors = b, this._triggers = {}
                    }

                    function e(a) {
                        return a._uiBindings || a.ui
                    }
                    var f = /^(\S+)\s*(.*)$/,
                        g = {
                            behaviorTriggers: function(a, b) {
                                var c = new d(this, b);
                                return c.buildBehaviorTriggers()
                            },
                            behaviorEvents: function(c, d) {
                                var g = {};
                                return b.each(d, function(c, d) {
                                    var h = {},
                                        i = b.clone(b.result(c, "events")) || {};
                                    i = a.normalizeUIKeys(i, e(c));
                                    var j = 0;
                                    b.each(i, function(a, e) {
                                        var g = e.match(f),
                                            i = g[1] + "." + [this.cid, d, j++, " "].join(""),
                                            k = g[2],
                                            l = i + k,
                                            m = b.isFunction(a) ? a : c[a];
                                        h[l] = b.bind(m, c)
                                    }, this), g = b.extend(g, h)
                                }, this), g
                            }
                        };
                    return b.extend(c, {
                        behaviorsLookup: function() {
                            throw new a.Error({
                                message: "You must define where your behaviors are stored.",
                                url: "marionette.behaviors.html#behaviorslookup"
                            })
                        },
                        getBehaviorClass: function(b, d) {
                            return b.behaviorClass ? b.behaviorClass : a._getValue(c.behaviorsLookup, this, [b, d])[d]
                        },
                        parseBehaviors: function(a, d) {
                            return b.chain(d).map(function(d, e) {
                                var f = c.getBehaviorClass(d, e),
                                    g = new f(d, a),
                                    h = c.parseBehaviors(a, b.result(g, "behaviors"));
                                return [g].concat(h)
                            }).flatten().value()
                        },
                        wrap: function(a, c, d) {
                            b.each(d, function(d) {
                                a[d] = b.partial(g[d], a[d], c)
                            })
                        }
                    }), b.extend(d.prototype, {
                        buildBehaviorTriggers: function() {
                            return b.each(this._behaviors, this._buildTriggerHandlersForBehavior, this), this._triggers
                        },
                        _buildTriggerHandlersForBehavior: function(c, d) {
                            var f = b.clone(b.result(c, "triggers")) || {};
                            f = a.normalizeUIKeys(f, e(c)), b.each(f, b.bind(this._setHandlerForBehavior, this, c, d))
                        },
                        _setHandlerForBehavior: function(a, b, c, d) {
                            var e = d.replace(/^\S+/, function(a) {
                                return a + ".behaviortriggers" + b
                            });
                            this._triggers[e] = this._view._buildViewTrigger(c)
                        }
                    }), c
                }(f, c), f.AppRouter = b.Router.extend({
                    constructor: function(a) {
                        this.options = a || {}, b.Router.apply(this, arguments);
                        var c = this.getOption("appRoutes"),
                            d = this._getController();
                        this.processAppRoutes(d, c), this.on("route", this._processOnRoute, this)
                    },
                    appRoute: function(a, b) {
                        var c = this._getController();
                        this._addAppRoute(c, a, b)
                    },
                    _processOnRoute: function(a, b) {
                        if (c.isFunction(this.onRoute)) {
                            var d = c.invert(this.getOption("appRoutes"))[a];
                            this.onRoute(a, d, b)
                        }
                    },
                    processAppRoutes: function(a, b) {
                        if (b) {
                            var d = c.keys(b).reverse();
                            c.each(d, function(c) {
                                this._addAppRoute(a, c, b[c])
                            }, this)
                        }
                    },
                    _getController: function() {
                        return this.getOption("controller")
                    },
                    _addAppRoute: function(a, b, d) {
                        var e = a[d];
                        if (!e) throw new f.Error('Method "' + d + '" was not found on the controller');
                        this.route(b, d, c.bind(e, a))
                    },
                    mergeOptions: f.mergeOptions,
                    getOption: f.proxyGetOption,
                    triggerMethod: f.triggerMethod,
                    bindEntityEvents: f.proxyBindEntityEvents,
                    unbindEntityEvents: f.proxyUnbindEntityEvents
                }), f.Application = f.Object.extend({
                    constructor: function(a) {
                        this._initializeRegions(a), this._initCallbacks = new f.Callbacks, this.submodules = {}, c.extend(this, a), this._initChannel(), f.Object.apply(this, arguments)
                    },
                    execute: function() {
                        this.commands.execute.apply(this.commands, arguments)
                    },
                    request: function() {
                        return this.reqres.request.apply(this.reqres, arguments)
                    },
                    addInitializer: function(a) {
                        this._initCallbacks.add(a)
                    },
                    start: function(a) {
                        this.triggerMethod("before:start", a), this._initCallbacks.run(a, this), this.triggerMethod("start", a)
                    },
                    addRegions: function(a) {
                        return this._regionManager.addRegions(a)
                    },
                    emptyRegions: function() {
                        return this._regionManager.emptyRegions()
                    },
                    removeRegion: function(a) {
                        return this._regionManager.removeRegion(a)
                    },
                    getRegion: function(a) {
                        return this._regionManager.get(a)
                    },
                    getRegions: function() {
                        return this._regionManager.getRegions()
                    },
                    module: function(a, b) {
                        var d = f.Module.getClass(b),
                            e = c.toArray(arguments);
                        return e.unshift(this), d.create.apply(d, e)
                    },
                    getRegionManager: function() {
                        return new f.RegionManager
                    },
                    _initializeRegions: function(a) {
                        var b = c.isFunction(this.regions) ? this.regions(a) : this.regions || {};
                        this._initRegionManager();
                        var d = f.getOption(a, "regions");
                        return c.isFunction(d) && (d = d.call(this, a)), c.extend(b, d), this.addRegions(b), this
                    },
                    _initRegionManager: function() {
                        this._regionManager = this.getRegionManager(), this._regionManager._parent = this, this.listenTo(this._regionManager, "before:add:region", function() {
                            f._triggerMethod(this, "before:add:region", arguments)
                        }), this.listenTo(this._regionManager, "add:region", function(a, b) {
                            this[a] = b, f._triggerMethod(this, "add:region", arguments)
                        }), this.listenTo(this._regionManager, "before:remove:region", function() {
                            f._triggerMethod(this, "before:remove:region", arguments)
                        }), this.listenTo(this._regionManager, "remove:region", function(a) {
                            delete this[a], f._triggerMethod(this, "remove:region", arguments)
                        })
                    },
                    _initChannel: function() {
                        this.channelName = c.result(this, "channelName") || "global", this.channel = c.result(this, "channel") || b.Wreqr.radio.channel(this.channelName), this.vent = c.result(this, "vent") || this.channel.vent, this.commands = c.result(this, "commands") || this.channel.commands, this.reqres = c.result(this, "reqres") || this.channel.reqres
                    }
                }), f.Module = function(a, b, d) {
                    this.moduleName = a, this.options = c.extend({}, this.options, d), this.initialize = d.initialize || this.initialize, this.submodules = {}, this._setupInitializersAndFinalizers(), this.app = b, c.isFunction(this.initialize) && this.initialize(a, b, this.options)
                }, f.Module.extend = f.extend, c.extend(f.Module.prototype, b.Events, {
                    startWithParent: !0,
                    initialize: function() {},
                    addInitializer: function(a) {
                        this._initializerCallbacks.add(a)
                    },
                    addFinalizer: function(a) {
                        this._finalizerCallbacks.add(a)
                    },
                    start: function(a) {
                        this._isInitialized || (c.each(this.submodules, function(b) {
                            b.startWithParent && b.start(a)
                        }), this.triggerMethod("before:start", a), this._initializerCallbacks.run(a, this), this._isInitialized = !0, this.triggerMethod("start", a))
                    },
                    stop: function() {
                        this._isInitialized && (this._isInitialized = !1, this.triggerMethod("before:stop"), c.invoke(this.submodules, "stop"), this._finalizerCallbacks.run(void 0, this), this._initializerCallbacks.reset(), this._finalizerCallbacks.reset(), this.triggerMethod("stop"))
                    },
                    addDefinition: function(a, b) {
                        this._runModuleDefinition(a, b)
                    },
                    _runModuleDefinition: function(a, d) {
                        if (a) {
                            var e = c.flatten([this, this.app, b, f, b.$, c, d]);
                            a.apply(this, e)
                        }
                    },
                    _setupInitializersAndFinalizers: function() {
                        this._initializerCallbacks = new f.Callbacks, this._finalizerCallbacks = new f.Callbacks
                    },
                    triggerMethod: f.triggerMethod
                }), c.extend(f.Module, {
                    create: function(a, b, d) {
                        var e = a,
                            f = c.drop(arguments, 3);
                        b = b.split(".");
                        var g = b.length,
                            h = [];
                        return h[g - 1] = d, c.each(b, function(b, c) {
                            var g = e;
                            e = this._getModule(g, b, a, d), this._addModuleDefinition(g, e, h[c], f)
                        }, this), e
                    },
                    _getModule: function(a, b, d, e, f) {
                        var g = c.extend({}, e),
                            h = this.getClass(e),
                            i = a[b];
                        return i || (i = new h(b, d, g), a[b] = i, a.submodules[b] = i), i
                    },
                    getClass: function(a) {
                        var b = f.Module;
                        return a ? a.prototype instanceof b ? a : a.moduleClass || b : b
                    },
                    _addModuleDefinition: function(a, b, c, d) {
                        var e = this._getDefine(c),
                            f = this._getStartWithParent(c, b);
                        e && b.addDefinition(e, d), this._addStartWithParent(a, b, f)
                    },
                    _getStartWithParent: function(a, b) {
                        var d;
                        return c.isFunction(a) && a.prototype instanceof f.Module ? (d = b.constructor.prototype.startWithParent, c.isUndefined(d) ? !0 : d) : c.isObject(a) ? (d = a.startWithParent, c.isUndefined(d) ? !0 : d) : !0
                    },
                    _getDefine: function(a) {
                        return !c.isFunction(a) || a.prototype instanceof f.Module ? c.isObject(a) ? a.define : null : a
                    },
                    _addStartWithParent: function(a, b, c) {
                        b.startWithParent = b.startWithParent && c, b.startWithParent && !b.startWithParentIsConfigured && (b.startWithParentIsConfigured = !0, a.addInitializer(function(a) {
                            b.startWithParent && b.start(a)
                        }))
                    }
                }), f
            })
        }, {
            backbone: 6,
            "backbone.babysitter": 3,
            "backbone.wreqr": 4,
            underscore: 35
        }],
        3: [function(a, b, c) {
            ! function(d, e) {
                if ("function" == typeof define && define.amd) define(["backbone", "underscore"], function(a, b) {
                    return e(a, b)
                });
                else if ("undefined" != typeof c) {
                    var f = a("backbone"),
                        g = a("underscore");
                    b.exports = e(f, g)
                } else e(d.Backbone, d._)
            }(this, function(a, b) {
                "use strict";
                var c = a.ChildViewContainer;
                return a.ChildViewContainer = function(a, b) {
                    var c = function(a) {
                        this._views = {}, this._indexByModel = {}, this._indexByCustom = {}, this._updateLength(), b.each(a, this.add, this)
                    };
                    b.extend(c.prototype, {
                        add: function(a, b) {
                            var c = a.cid;
                            return this._views[c] = a, a.model && (this._indexByModel[a.model.cid] = c), b && (this._indexByCustom[b] = c), this._updateLength(), this
                        },
                        findByModel: function(a) {
                            return this.findByModelCid(a.cid)
                        },
                        findByModelCid: function(a) {
                            var b = this._indexByModel[a];
                            return this.findByCid(b)
                        },
                        findByCustom: function(a) {
                            var b = this._indexByCustom[a];
                            return this.findByCid(b)
                        },
                        findByIndex: function(a) {
                            return b.values(this._views)[a]
                        },
                        findByCid: function(a) {
                            return this._views[a]
                        },
                        remove: function(a) {
                            var c = a.cid;
                            return a.model && delete this._indexByModel[a.model.cid], b.any(this._indexByCustom, function(a, b) {
                                return a === c ? (delete this._indexByCustom[b], !0) : void 0
                            }, this), delete this._views[c], this._updateLength(), this
                        },
                        call: function(a) {
                            this.apply(a, b.tail(arguments))
                        },
                        apply: function(a, c) {
                            b.each(this._views, function(d) {
                                b.isFunction(d[a]) && d[a].apply(d, c || [])
                            })
                        },
                        _updateLength: function() {
                            this.length = b.size(this._views)
                        }
                    });
                    var d = ["forEach", "each", "map", "find", "detect", "filter", "select", "reject", "every", "all", "some", "any", "include", "contains", "invoke", "toArray", "first", "initial", "rest", "last", "without", "isEmpty", "pluck", "reduce"];
                    return b.each(d, function(a) {
                        c.prototype[a] = function() {
                            var c = b.values(this._views),
                                d = [c].concat(b.toArray(arguments));
                            return b[a].apply(b, d)
                        }
                    }), c
                }(a, b), a.ChildViewContainer.VERSION = "0.1.10", a.ChildViewContainer.noConflict = function() {
                    return a.ChildViewContainer = c, this
                }, a.ChildViewContainer
            })
        }, {
            backbone: 6,
            underscore: 35
        }],
        4: [function(a, b, c) {
            ! function(d, e) {
                if ("function" == typeof define && define.amd) define(["backbone", "underscore"], function(a, b) {
                    return e(a, b)
                });
                else if ("undefined" != typeof c) {
                    var f = a("backbone"),
                        g = a("underscore");
                    b.exports = e(f, g)
                } else e(d.Backbone, d._)
            }(this, function(a, b) {
                "use strict";
                var c = a.Wreqr,
                    d = a.Wreqr = {};
                return a.Wreqr.VERSION = "1.3.5", a.Wreqr.noConflict = function() {
                    return a.Wreqr = c, this
                }, d.Handlers = function(a, b) {
                    var c = function(a) {
                        this.options = a, this._wreqrHandlers = {}, b.isFunction(this.initialize) && this.initialize(a)
                    };
                    return c.extend = a.Model.extend, b.extend(c.prototype, a.Events, {
                        setHandlers: function(a) {
                            b.each(a, function(a, c) {
                                var d = null;
                                b.isObject(a) && !b.isFunction(a) && (d = a.context, a = a.callback), this.setHandler(c, a, d)
                            }, this)
                        },
                        setHandler: function(a, b, c) {
                            var d = {
                                callback: b,
                                context: c
                            };
                            this._wreqrHandlers[a] = d, this.trigger("handler:add", a, b, c)
                        },
                        hasHandler: function(a) {
                            return !!this._wreqrHandlers[a]
                        },
                        getHandler: function(a) {
                            var b = this._wreqrHandlers[a];
                            if (b) return function() {
                                return b.callback.apply(b.context, arguments)
                            }
                        },
                        removeHandler: function(a) {
                            delete this._wreqrHandlers[a]
                        },
                        removeAllHandlers: function() {
                            this._wreqrHandlers = {}
                        }
                    }), c
                }(a, b), d.CommandStorage = function() {
                    var c = function(a) {
                        this.options = a, this._commands = {}, b.isFunction(this.initialize) && this.initialize(a)
                    };
                    return b.extend(c.prototype, a.Events, {
                        getCommands: function(a) {
                            var b = this._commands[a];
                            return b || (b = {
                                command: a,
                                instances: []
                            }, this._commands[a] = b), b
                        },
                        addCommand: function(a, b) {
                            var c = this.getCommands(a);
                            c.instances.push(b)
                        },
                        clearCommands: function(a) {
                            var b = this.getCommands(a);
                            b.instances = []
                        }
                    }), c
                }(), d.Commands = function(a, b) {
                    return a.Handlers.extend({
                        storageType: a.CommandStorage,
                        constructor: function(b) {
                            this.options = b || {}, this._initializeStorage(this.options), this.on("handler:add", this._executeCommands, this), a.Handlers.prototype.constructor.apply(this, arguments)
                        },
                        execute: function(a) {
                            a = arguments[0];
                            var c = b.rest(arguments);
                            this.hasHandler(a) ? this.getHandler(a).apply(this, c) : this.storage.addCommand(a, c)
                        },
                        _executeCommands: function(a, c, d) {
                            var e = this.storage.getCommands(a);
                            b.each(e.instances, function(a) {
                                c.apply(d, a)
                            }), this.storage.clearCommands(a)
                        },
                        _initializeStorage: function(a) {
                            var c, d = a.storageType || this.storageType;
                            c = b.isFunction(d) ? new d : d, this.storage = c
                        }
                    })
                }(d, b), d.RequestResponse = function(a, b) {
                    return a.Handlers.extend({
                        request: function(a) {
                            return this.hasHandler(a) ? this.getHandler(a).apply(this, b.rest(arguments)) : void 0
                        }
                    })
                }(d, b), d.EventAggregator = function(a, b) {
                    var c = function() {};
                    return c.extend = a.Model.extend, b.extend(c.prototype, a.Events), c
                }(a, b), d.Channel = function(c) {
                    var d = function(b) {
                        this.vent = new a.Wreqr.EventAggregator, this.reqres = new a.Wreqr.RequestResponse, this.commands = new a.Wreqr.Commands, this.channelName = b
                    };
                    return b.extend(d.prototype, {
                        reset: function() {
                            return this.vent.off(), this.vent.stopListening(), this.reqres.removeAllHandlers(), this.commands.removeAllHandlers(), this
                        },
                        connectEvents: function(a, b) {
                            return this._connect("vent", a, b), this
                        },
                        connectCommands: function(a, b) {
                            return this._connect("commands", a, b), this
                        },
                        connectRequests: function(a, b) {
                            return this._connect("reqres", a, b), this
                        },
                        _connect: function(a, c, d) {
                            if (c) {
                                d = d || this;
                                var e = "vent" === a ? "on" : "setHandler";
                                b.each(c, function(c, f) {
                                    this[a][e](f, b.bind(c, d))
                                }, this)
                            }
                        }
                    }), d
                }(d), d.radio = function(a, b) {
                    var c = function() {
                        this._channels = {}, this.vent = {}, this.commands = {}, this.reqres = {}, this._proxyMethods()
                    };
                    b.extend(c.prototype, {
                        channel: function(a) {
                            if (!a) throw new Error("Channel must receive a name");
                            return this._getChannel(a)
                        },
                        _getChannel: function(b) {
                            var c = this._channels[b];
                            return c || (c = new a.Channel(b), this._channels[b] = c), c
                        },
                        _proxyMethods: function() {
                            b.each(["vent", "commands", "reqres"], function(a) {
                                b.each(d[a], function(b) {
                                    this[a][b] = e(this, a, b)
                                }, this)
                            }, this)
                        }
                    });
                    var d = {
                            vent: ["on", "off", "trigger", "once", "stopListening", "listenTo", "listenToOnce"],
                            commands: ["execute", "setHandler", "setHandlers", "removeHandler", "removeAllHandlers"],
                            reqres: ["request", "setHandler", "setHandlers", "removeHandler", "removeAllHandlers"]
                        },
                        e = function(a, c, d) {
                            return function(e) {
                                var f = a._getChannel(e)[c];
                                return f[d].apply(f, b.rest(arguments))
                            }
                        };
                    return new c
                }(d, b), a.Wreqr
            })
        }, {
            backbone: 6,
            underscore: 35
        }],
        5: [function(a, b, c) {
            ! function(b) {
                "function" == typeof define && define.amd ? define(["underscore", "backbone", "exports"], b) : "object" == typeof c ? b(a("underscore"), a("backbone"), c) : b(_, Backbone, {})
            }(function(a, b, c) {
                b.Stickit = c, c._handlers = [], c.addHandler = function(b) {
                    b = a.map(a.flatten([b]), function(b) {
                        return a.defaults({}, b, {
                            updateModel: !0,
                            updateView: !0,
                            updateMethod: "text"
                        })
                    }), this._handlers = this._handlers.concat(b)
                }, c.ViewMixin = {
                    _modelBindings: null,
                    unstickit: function(b, c) {
                        if (a.isObject(c)) return void a.each(c, function(a, c) {
                            this.unstickit(b, c)
                        }, this);
                        var d = [],
                            e = [];
                        this._modelBindings = a.reject(this._modelBindings, function(a) {
                            return b && a.model !== b || c && a.config.selector != c ? void 0 : (a.model.off(a.event, a.fn), e.push(a.config._destroy), d.push(a.model), !0)
                        }), a.invoke(a.uniq(d), "trigger", "stickit:unstuck", this.cid), a.each(a.uniq(e), function(a) {
                            a.call(this)
                        }, this), this.$el.off(".stickit" + (b ? "." + b.cid : ""), c)
                    },
                    stickit: function(b, c) {
                        var d = b || this.model,
                            e = c || a.result(this, "bindings") || {};
                        this._modelBindings || (this._modelBindings = []), this.addBinding(d, e);
                        var f = this.remove;
                        return f.stickitWrapped || (this.remove = function() {
                            var a = this;
                            return this.unstickit(), f && (a = f.apply(this, arguments)), a
                        }), this.remove.stickitWrapped = !0, this
                    },
                    addBinding: function(b, c, e) {
                        var p = b || this.model,
                            q = ".stickit." + p.cid;
                        if (e = e || {}, a.isObject(c)) {
                            var r = c;
                            return void a.each(r, function(a, b) {
                                this.addBinding(p, b, a)
                            }, this)
                        }
                        var s = ":el" === c ? this.$el : this.$(c);
                        if (this.unstickit(p, c), s.length) {
                            a.isString(e) && (e = {
                                observe: e
                            }), a.isFunction(e.observe) && (e.observe = e.observe.call(this));
                            var t = k(s, e),
                                u = t.observe;
                            t.selector = c, t.view = this;
                            var v = t.bindId = a.uniqueId(),
                                w = a.extend({
                                    stickitChange: t
                                }, t.setOptions);
                            if (t._destroy = function() {
                                    f.call(this, t.destroy, s, p, t)
                                }, l(s, t, p, u), n(s, t, p, u), m(s, t, p, u), u) {
                                a.each(t.events, function(b) {
                                    var e = b + q,
                                        h = function(a) {
                                            var b = f.call(this, t.getVal, s, a, t, d.call(arguments, 1)),
                                                c = g(t.updateModel, b, a, t);
                                            c && i(p, u, b, w, t)
                                        },
                                        j = ":el" === c ? "" : c;
                                    this.$el.on(e, j, a.bind(h, this))
                                }, this), a.each(a.flatten([u]), function(a) {
                                    h(p, "change:" + a, t, function(a, b, c) {
                                        var d = c && c.stickitChange && c.stickitChange.bindId;
                                        if (d !== v) {
                                            var e = j(p, u, t);
                                            o(s, t, e, p)
                                        }
                                    })
                                });
                                var x = j(p, u, t);
                                o(s, t, x, p, !0)
                            }
                            f.call(this, t.initialize, s, p, t)
                        }
                    }
                }, a.extend(b.View.prototype, c.ViewMixin);
                var d = [].slice,
                    e = function(b, c) {
                        var d = (c || "").split("."),
                            e = a.reduce(d, function(a, b) {
                                return a[b]
                            }, b);
                        return null == e ? b : e
                    },
                    f = function(b) {
                        return b = a.isString(b) ? e(this, b) : b, b ? b.apply(this, d.call(arguments, 1)) : void 0
                    },
                    g = function(b, c, d) {
                        if (a.isBoolean(b)) return b;
                        if (a.isFunction(b) || a.isString(b)) {
                            var e = a.last(arguments).view;
                            return f.apply(e, arguments)
                        }
                        return !1
                    },
                    h = function(a, b, c, d) {
                        var e = c.view;
                        a.on(b, d, e), e._modelBindings.push({
                            model: a,
                            event: b,
                            fn: d,
                            config: c
                        })
                    },
                    i = function(b, c, d, e, g) {
                        var h = {},
                            i = g.view;
                        g.onSet && (d = f.call(i, g.onSet, d, g)), g.set ? f.call(i, g.set, c, d, e, g) : (h[c] = d, a.isArray(c) && a.isArray(d) && (h = a.reduce(c, function(b, c, e) {
                            return b[c] = a.has(d, e) ? d[e] : null, b
                        }, {})), b.set(h, e))
                    },
                    j = function(b, c, d) {
                        var e = d.view,
                            g = function(a) {
                                return b[d.escape ? "escape" : "get"](a)
                            },
                            h = function(a) {
                                return null == a ? "" : a
                            },
                            i = a.isArray(c) ? a.map(c, g) : g(c);
                        return d.onGet && (i = f.call(e, d.onGet, i, d)), a.isArray(i) ? a.map(i, h) : h(i)
                    },
                    k = c.getConfiguration = function(b, d) {
                        var e = [{
                            updateModel: !1,
                            updateMethod: "text",
                            update: function(a, b, c, d) {
                                a[d.updateMethod] && a[d.updateMethod](b)
                            },
                            getVal: function(a, b, c) {
                                return a[c.updateMethod]()
                            }
                        }];
                        e = e.concat(a.filter(c._handlers, function(a) {
                            return b.is(a.selector)
                        })), e.push(d);
                        var f = a.extend.apply(a, e);
                        return a.has(f, "updateView") || (f.updateView = !f.visible), f
                    },
                    l = function(b, c, d, e) {
                        var f = ["autofocus", "autoplay", "async", "checked", "controls", "defer", "disabled", "hidden", "indeterminate", "loop", "multiple", "open", "readonly", "required", "scoped", "selected"],
                            g = c.view;
                        a.each(c.attributes || [], function(i) {
                            i = a.clone(i), i.view = g;
                            var k = "",
                                l = i.observe || (i.observe = e),
                                m = function() {
                                    var c = a.contains(f, i.name) ? "prop" : "attr",
                                        e = j(d, l, i);
                                    "class" === i.name ? (b.removeClass(k).addClass(e), k = e) : b[c](i.name, e)
                                };
                            a.each(a.flatten([l]), function(a) {
                                h(d, "change:" + a, c, m)
                            }), m()
                        })
                    },
                    m = function(b, c, d, e) {
                        a.each(c.classes || [], function(e, f) {
                            a.isString(e) && (e = {
                                observe: e
                            }), e.view = c.view;
                            var g = e.observe,
                                i = function() {
                                    var a = j(d, g, e);
                                    b.toggleClass(f, !!a)
                                };
                            a.each(a.flatten([g]), function(a) {
                                h(d, "change:" + a, c, i)
                            }), i()
                        })
                    },
                    n = function(b, c, d, e) {
                        if (null != c.visible) {
                            var g = c.view,
                                i = function() {
                                    var h = c.visible,
                                        i = c.visibleFn,
                                        k = j(d, e, c),
                                        l = !!k;
                                    (a.isFunction(h) || a.isString(h)) && (l = !!f.call(g, h, k, c)), i ? f.call(g, i, b, l, c) : b.toggle(l)
                                };
                            a.each(a.flatten([e]), function(a) {
                                h(d, "change:" + a, c, i)
                            }), i()
                        }
                    },
                    o = function(a, b, c, d, e) {
                        var h = b.view;
                        g(b.updateView, c, b) && (f.call(h, b.update, a, c, d, b), e || f.call(h, b.afterUpdate, a, c, b))
                    };
                return c.addHandler([{
                    selector: "[contenteditable]",
                    updateMethod: "html",
                    events: ["input", "change"]
                }, {
                    selector: "input",
                    events: ["propertychange", "input", "change"],
                    update: function(a, b) {
                        a.val(b)
                    },
                    getVal: function(a) {
                        return a.val()
                    }
                }, {
                    selector: "textarea",
                    events: ["propertychange", "input", "change"],
                    update: function(a, b) {
                        a.val(b)
                    },
                    getVal: function(a) {
                        return a.val()
                    }
                }, {
                    selector: 'input[type="radio"]',
                    events: ["change"],
                    update: function(a, b) {
                        a.filter('[value="' + b + '"]').prop("checked", !0)
                    },
                    getVal: function(a) {
                        return a.filter(":checked").val()
                    }
                }, {
                    selector: 'input[type="checkbox"]',
                    events: ["change"],
                    update: function(c, d, e, f) {
                        if (c.length > 1) d || (d = []), c.each(function(c, e) {
                            var f = b.$(e),
                                g = a.contains(d, f.val());
                            f.prop("checked", g)
                        });
                        else {
                            var g = a.isBoolean(d) ? d : d === c.val();
                            c.prop("checked", g)
                        }
                    },
                    getVal: function(c) {
                        var d;
                        if (c.length > 1) d = a.reduce(c, function(a, c) {
                            var d = b.$(c);
                            return d.prop("checked") && a.push(d.val()), a
                        }, []);
                        else {
                            d = c.prop("checked");
                            var e = c.val();
                            "on" !== e && null != e && (d = d ? c.val() : null)
                        }
                        return d
                    }
                }, {
                    selector: "select",
                    events: ["change"],
                    update: function(c, d, g, h) {
                        var i, k = h.selectOptions,
                            l = k && k.collection || void 0,
                            m = c.prop("multiple");
                        if (!k) {
                            k = {};
                            var n = function(a) {
                                return a.map(function(a, c) {
                                    var d = b.$(c).data("stickit-bind-val");
                                    return {
                                        value: void 0 !== d ? d : c.value,
                                        label: c.text
                                    }
                                }).get()
                            };
                            c.find("optgroup").length ? (l = {
                                opt_labels: []
                            }, c.find("> option").length && (l.opt_labels.push(void 0), a.each(c.find("> option"), function(a) {
                                l[void 0] = n(b.$(a))
                            })), a.each(c.find("optgroup"), function(a) {
                                var c = b.$(a).attr("label");
                                l.opt_labels.push(c), l[c] = n(b.$(a).find("option"))
                            })) : l = n(c.find("option"))
                        }
                        k.valuePath = k.valuePath || "value", k.labelPath = k.labelPath || "label", k.disabledPath = k.disabledPath || "disabled";
                        var o = function(c, d, f) {
                            a.each(c, function(c) {
                                var g, h, i, j = b.$("<option/>"),
                                    l = c,
                                    n = function(b, c, d) {
                                        j.text(b), l = c, j.data("stickit-bind-val", l), a.isArray(l) || a.isObject(l) || j.val(l), d === !0 && j.prop("disabled", "disabled")
                                    };
                                "__default__" === c ? (g = f.label, h = f.value, i = f.disabled) : (g = e(c, k.labelPath), h = e(c, k.valuePath), i = e(c, k.disabledPath)), n(g, h, i);
                                var o = function() {
                                    return m || null == l || null == f || l !== f ? a.isObject(f) && a.isEqual(l, f) ? !0 : !1 : !0
                                };
                                o() ? j.prop("selected", !0) : m && a.isArray(f) && a.each(f, function(b) {
                                    a.isObject(b) && (b = e(b, k.valuePath)), (b === l || a.isObject(b) && a.isEqual(l, b)) && j.prop("selected", !0)
                                }), d.append(j)
                            })
                        };
                        if (c.find("*").remove(), a.isString(l)) {
                            var p = window;
                            0 === l.indexOf("this.") && (p = this), l = l.replace(/^[a-z]*\.(.+)$/, "$1"), i = e(p, l)
                        } else i = a.isFunction(l) ? f.call(this, l, c, h) : l;
                        if (i instanceof b.Collection) {
                            var q = i,
                                r = function() {
                                    var a = j(g, h.observe, h);
                                    f.call(this, h.update, c, a, g, h)
                                },
                                s = function() {
                                    q.off("add remove reset sort", r)
                                },
                                t = function() {
                                    s(), q.off("stickit:selectRefresh"), g.off("stickit:selectRefresh")
                                };
                            q.trigger("stickit:selectRefresh"), q.once("stickit:selectRefresh", s, this), q.on("add remove reset sort", r, this), g.trigger("stickit:selectRefresh"), g.once("stickit:selectRefresh", function() {
                                g.off("stickit:unstuck", t)
                            }), g.once("stickit:unstuck", t, this), i = i.toJSON()
                        }
                        if (k.defaultOption) {
                            var u = a.isFunction(k.defaultOption) ? k.defaultOption.call(this, c, h) : k.defaultOption;
                            o(["__default__"], c, u)
                        }
                        if (a.isArray(i)) o(i, c, d);
                        else if (i.opt_labels) a.each(i.opt_labels, function(a) {
                            var e = b.$("<optgroup/>").attr("label", a);
                            o(i[a], e, d), c.append(e)
                        });
                        else {
                            var v, w = [];
                            for (var x in i) v = {}, v[k.valuePath] = x, v[k.labelPath] = i[x], w.push(v);
                            w = a.sortBy(w, k.comparator || k.labelPath), o(w, c, d)
                        }
                    },
                    getVal: function(c) {
                        var d = c.find("option:selected");
                        return c.prop("multiple") ? a.map(d, function(a) {
                            return b.$(a).data("stickit-bind-val")
                        }) : d.data("stickit-bind-val")
                    }
                }]), c
            })
        }, {
            backbone: 6,
            underscore: 35
        }],
        6: [function(a, b, c) {
            (function(b) {
                ! function(d) {
                    var e = "object" == typeof self && self.self == self && self || "object" == typeof b && b.global == b && b;
                    if ("function" == typeof define && define.amd) define(["underscore", "jquery", "exports"], function(a, b, c) {
                        e.Backbone = d(e, c, a, b)
                    });
                    else if ("undefined" != typeof c) {
                        var f, g = a("underscore");
                        try {
                            f = a("jquery")
                        } catch (h) {}
                        d(e, c, g, f)
                    } else e.Backbone = d(e, {}, e._, e.jQuery || e.Zepto || e.ender || e.$)
                }(function(a, b, c, d) {
                    var e = a.Backbone,
                        f = [].slice;
                    b.VERSION = "1.2.1", b.$ = d, b.noConflict = function() {
                        return a.Backbone = e, this
                    }, b.emulateHTTP = !1, b.emulateJSON = !1;
                    var g = function(a, b, d) {
                            switch (a) {
                                case 1:
                                    return function() {
                                        return c[b](this[d])
                                    };
                                case 2:
                                    return function(a) {
                                        return c[b](this[d], a)
                                    };
                                case 3:
                                    return function(a, e) {
                                        return c[b](this[d], a, e)
                                    };
                                case 4:
                                    return function(a, e, f) {
                                        return c[b](this[d], a, e, f)
                                    };
                                default:
                                    return function() {
                                        var a = f.call(arguments);
                                        return a.unshift(this[d]), c[b].apply(c, a)
                                    }
                            }
                        },
                        h = function(a, b, d) {
                            c.each(b, function(b, e) {
                                c[e] && (a.prototype[e] = g(b, e, d))
                            })
                        },
                        i = b.Events = {},
                        j = /\s+/,
                        k = function(a, b, d, e, f) {
                            var g, h = 0;
                            if (d && "object" == typeof d) {
                                void 0 !== e && "context" in f && void 0 === f.context && (f.context = e);
                                for (g = c.keys(d); h < g.length; h++) b = a(b, g[h], d[g[h]], f)
                            } else if (d && j.test(d))
                                for (g = d.split(j); h < g.length; h++) b = a(b, g[h], e, f);
                            else b = a(b, d, e, f);
                            return b
                        };
                    i.on = function(a, b, c) {
                        return l(this, a, b, c)
                    };
                    var l = function(a, b, c, d, e) {
                        if (a._events = k(m, a._events || {}, b, c, {
                                context: d,
                                ctx: a,
                                listening: e
                            }), e) {
                            var f = a._listeners || (a._listeners = {});
                            f[e.id] = e
                        }
                        return a
                    };
                    i.listenTo = function(a, b, d) {
                        if (!a) return this;
                        var e = a._listenId || (a._listenId = c.uniqueId("l")),
                            f = this._listeningTo || (this._listeningTo = {}),
                            g = f[e];
                        if (!g) {
                            var h = this._listenId || (this._listenId = c.uniqueId("l"));
                            g = f[e] = {
                                obj: a,
                                objId: e,
                                id: h,
                                listeningTo: f,
                                count: 0
                            }
                        }
                        return l(a, b, d, this, g), this
                    };
                    var m = function(a, b, c, d) {
                        if (c) {
                            var e = a[b] || (a[b] = []),
                                f = d.context,
                                g = d.ctx,
                                h = d.listening;
                            h && h.count++, e.push({
                                callback: c,
                                context: f,
                                ctx: f || g,
                                listening: h
                            })
                        }
                        return a
                    };
                    i.off = function(a, b, c) {
                        return this._events ? (this._events = k(n, this._events, a, b, {
                            context: c,
                            listeners: this._listeners
                        }), this) : this
                    }, i.stopListening = function(a, b, d) {
                        var e = this._listeningTo;
                        if (!e) return this;
                        for (var f = a ? [a._listenId] : c.keys(e), g = 0; g < f.length; g++) {
                            var h = e[f[g]];
                            if (!h) break;
                            h.obj.off(b, d, this)
                        }
                        return c.isEmpty(e) && (this._listeningTo = void 0), this
                    };
                    var n = function(a, b, d, e) {
                        if (a) {
                            var f, g = 0,
                                h = e.context,
                                i = e.listeners;
                            if (b || d || h) {
                                for (var j = b ? [b] : c.keys(a); g < j.length; g++) {
                                    b = j[g];
                                    var k = a[b];
                                    if (!k) break;
                                    for (var l = [], m = 0; m < k.length; m++) {
                                        var n = k[m];
                                        d && d !== n.callback && d !== n.callback._callback || h && h !== n.context ? l.push(n) : (f = n.listening, f && 0 === --f.count && (delete i[f.id], delete f.listeningTo[f.objId]))
                                    }
                                    l.length ? a[b] = l : delete a[b]
                                }
                                return c.size(a) ? a : void 0
                            }
                            for (var o = c.keys(i); g < o.length; g++) f = i[o[g]], delete i[f.id], delete f.listeningTo[f.objId]
                        }
                    };
                    i.once = function(a, b, d) {
                        var e = k(o, {}, a, b, c.bind(this.off, this));
                        return this.on(e, void 0, d)
                    }, i.listenToOnce = function(a, b, d) {
                        var e = k(o, {}, b, d, c.bind(this.stopListening, this, a));
                        return this.listenTo(a, e)
                    };
                    var o = function(a, b, d, e) {
                        if (d) {
                            var f = a[b] = c.once(function() {
                                e(b, f), d.apply(this, arguments)
                            });
                            f._callback = d
                        }
                        return a
                    };
                    i.trigger = function(a) {
                        if (!this._events) return this;
                        for (var b = Math.max(0, arguments.length - 1), c = Array(b), d = 0; b > d; d++) c[d] = arguments[d + 1];
                        return k(p, this._events, a, void 0, c), this
                    };
                    var p = function(a, b, c, d) {
                            if (a) {
                                var e = a[b],
                                    f = a.all;
                                e && f && (f = f.slice()), e && q(e, d), f && q(f, [b].concat(d))
                            }
                            return a
                        },
                        q = function(a, b) {
                            var c, d = -1,
                                e = a.length,
                                f = b[0],
                                g = b[1],
                                h = b[2];
                            switch (b.length) {
                                case 0:
                                    for (; ++d < e;)(c = a[d]).callback.call(c.ctx);
                                    return;
                                case 1:
                                    for (; ++d < e;)(c = a[d]).callback.call(c.ctx, f);
                                    return;
                                case 2:
                                    for (; ++d < e;)(c = a[d]).callback.call(c.ctx, f, g);
                                    return;
                                case 3:
                                    for (; ++d < e;)(c = a[d]).callback.call(c.ctx, f, g, h);
                                    return;
                                default:
                                    for (; ++d < e;)(c = a[d]).callback.apply(c.ctx, b);
                                    return
                            }
                        };
                    i.bind = i.on, i.unbind = i.off, c.extend(b, i);
                    var r = b.Model = function(a, b) {
                        var d = a || {};
                        b || (b = {}), this.cid = c.uniqueId(this.cidPrefix), this.attributes = {}, b.collection && (this.collection = b.collection), b.parse && (d = this.parse(d, b) || {}), d = c.defaults({}, d, c.result(this, "defaults")), this.set(d, b), this.changed = {}, this.initialize.apply(this, arguments)
                    };
                    c.extend(r.prototype, i, {
                        changed: null,
                        validationError: null,
                        idAttribute: "id",
                        cidPrefix: "c",
                        initialize: function() {},
                        toJSON: function(a) {
                            return c.clone(this.attributes)
                        },
                        sync: function() {
                            return b.sync.apply(this, arguments)
                        },
                        get: function(a) {
                            return this.attributes[a]
                        },
                        escape: function(a) {
                            return c.escape(this.get(a))
                        },
                        has: function(a) {
                            return null != this.get(a)
                        },
                        matches: function(a) {
                            return !!c.iteratee(a, this)(this.attributes)
                        },
                        set: function(a, b, d) {
                            if (null == a) return this;
                            var e;
                            if ("object" == typeof a ? (e = a, d = b) : (e = {})[a] = b, d || (d = {}), !this._validate(e, d)) return !1;
                            var f = d.unset,
                                g = d.silent,
                                h = [],
                                i = this._changing;
                            this._changing = !0, i || (this._previousAttributes = c.clone(this.attributes), this.changed = {});
                            var j = this.attributes,
                                k = this.changed,
                                l = this._previousAttributes;
                            this.idAttribute in e && (this.id = e[this.idAttribute]);
                            for (var m in e) b = e[m], c.isEqual(j[m], b) || h.push(m), c.isEqual(l[m], b) ? delete k[m] : k[m] = b, f ? delete j[m] : j[m] = b;
                            if (!g) {
                                h.length && (this._pending = d);
                                for (var n = 0; n < h.length; n++) this.trigger("change:" + h[n], this, j[h[n]], d)
                            }
                            if (i) return this;
                            if (!g)
                                for (; this._pending;) d = this._pending, this._pending = !1, this.trigger("change", this, d);
                            return this._pending = !1, this._changing = !1, this
                        },
                        unset: function(a, b) {
                            return this.set(a, void 0, c.extend({}, b, {
                                unset: !0
                            }))
                        },
                        clear: function(a) {
                            var b = {};
                            for (var d in this.attributes) b[d] = void 0;
                            return this.set(b, c.extend({}, a, {
                                unset: !0
                            }))
                        },
                        hasChanged: function(a) {
                            return null == a ? !c.isEmpty(this.changed) : c.has(this.changed, a)
                        },
                        changedAttributes: function(a) {
                            if (!a) return this.hasChanged() ? c.clone(this.changed) : !1;
                            var b = this._changing ? this._previousAttributes : this.attributes,
                                d = {};
                            for (var e in a) {
                                var f = a[e];
                                c.isEqual(b[e], f) || (d[e] = f)
                            }
                            return c.size(d) ? d : !1
                        },
                        previous: function(a) {
                            return null != a && this._previousAttributes ? this._previousAttributes[a] : null
                        },
                        previousAttributes: function() {
                            return c.clone(this._previousAttributes)
                        },
                        fetch: function(a) {
                            a = c.extend({
                                parse: !0
                            }, a);
                            var b = this,
                                d = a.success;
                            return a.success = function(c) {
                                var e = a.parse ? b.parse(c, a) : c;
                                return b.set(e, a) ? (d && d.call(a.context, b, c, a), void b.trigger("sync", b, c, a)) : !1
                            }, N(this, a), this.sync("read", this, a)
                        },
                        save: function(a, b, d) {
                            var e;
                            null == a || "object" == typeof a ? (e = a, d = b) : (e = {})[a] = b, d = c.extend({
                                validate: !0,
                                parse: !0
                            }, d);
                            var f = d.wait;
                            if (e && !f) {
                                if (!this.set(e, d)) return !1
                            } else if (!this._validate(e, d)) return !1;
                            var g = this,
                                h = d.success,
                                i = this.attributes;
                            d.success = function(a) {
                                g.attributes = i;
                                var b = d.parse ? g.parse(a, d) : a;
                                return f && (b = c.extend({}, e, b)), b && !g.set(b, d) ? !1 : (h && h.call(d.context, g, a, d), void g.trigger("sync", g, a, d))
                            }, N(this, d), e && f && (this.attributes = c.extend({}, i, e));
                            var j = this.isNew() ? "create" : d.patch ? "patch" : "update";
                            "patch" !== j || d.attrs || (d.attrs = e);
                            var k = this.sync(j, this, d);
                            return this.attributes = i, k
                        },
                        destroy: function(a) {
                            a = a ? c.clone(a) : {};
                            var b = this,
                                d = a.success,
                                e = a.wait,
                                f = function() {
                                    b.stopListening(), b.trigger("destroy", b, b.collection, a)
                                };
                            a.success = function(c) {
                                e && f(), d && d.call(a.context, b, c, a), b.isNew() || b.trigger("sync", b, c, a)
                            };
                            var g = !1;
                            return this.isNew() ? c.defer(a.success) : (N(this, a), g = this.sync("delete", this, a)), e || f(), g
                        },
                        url: function() {
                            var a = c.result(this, "urlRoot") || c.result(this.collection, "url") || M();
                            if (this.isNew()) return a;
                            var b = this.get(this.idAttribute);
                            return a.replace(/[^\/]$/, "$&/") + encodeURIComponent(b)
                        },
                        parse: function(a, b) {
                            return a
                        },
                        clone: function() {
                            return new this.constructor(this.attributes)
                        },
                        isNew: function() {
                            return !this.has(this.idAttribute)
                        },
                        isValid: function(a) {
                            return this._validate({}, c.defaults({
                                validate: !0
                            }, a))
                        },
                        _validate: function(a, b) {
                            if (!b.validate || !this.validate) return !0;
                            a = c.extend({}, this.attributes, a);
                            var d = this.validationError = this.validate(a, b) || null;
                            return d ? (this.trigger("invalid", this, d, c.extend(b, {
                                validationError: d
                            })), !1) : !0
                        }
                    });
                    var s = {
                        keys: 1,
                        values: 1,
                        pairs: 1,
                        invert: 1,
                        pick: 0,
                        omit: 0,
                        chain: 1,
                        isEmpty: 1
                    };
                    h(r, s, "attributes");
                    var t = b.Collection = function(a, b) {
                            b || (b = {}), b.model && (this.model = b.model), void 0 !== b.comparator && (this.comparator = b.comparator), this._reset(), this.initialize.apply(this, arguments), a && this.reset(a, c.extend({
                                silent: !0
                            }, b))
                        },
                        u = {
                            add: !0,
                            remove: !0,
                            merge: !0
                        },
                        v = {
                            add: !0,
                            remove: !1
                        };
                    c.extend(t.prototype, i, {
                        model: r,
                        initialize: function() {},
                        toJSON: function(a) {
                            return this.map(function(b) {
                                return b.toJSON(a)
                            })
                        },
                        sync: function() {
                            return b.sync.apply(this, arguments)
                        },
                        add: function(a, b) {
                            return this.set(a, c.extend({
                                merge: !1
                            }, b, v))
                        },
                        remove: function(a, b) {
                            b = c.extend({}, b);
                            var d = !c.isArray(a);
                            a = d ? [a] : c.clone(a);
                            var e = this._removeModels(a, b);
                            return !b.silent && e && this.trigger("update", this, b), d ? e[0] : e
                        },
                        set: function(a, b) {
                            b = c.defaults({}, b, u), b.parse && !this._isModel(a) && (a = this.parse(a, b));
                            var d = !c.isArray(a);
                            a = d ? a ? [a] : [] : a.slice();
                            var e, f, g, h, i, j = b.at;
                            null != j && (j = +j), 0 > j && (j += this.length + 1);
                            for (var k = this.comparator && null == j && b.sort !== !1, l = c.isString(this.comparator) ? this.comparator : null, m = [], n = [], o = {}, p = b.add, q = b.merge, r = b.remove, s = !k && p && r ? [] : !1, t = !1, v = 0; v < a.length; v++) {
                                if (g = a[v], h = this.get(g)) r && (o[h.cid] = !0), q && g !== h && (g = this._isModel(g) ? g.attributes : g, b.parse && (g = h.parse(g, b)), h.set(g, b), k && !i && h.hasChanged(l) && (i = !0)), a[v] = h;
                                else if (p) {
                                    if (f = a[v] = this._prepareModel(g, b), !f) continue;
                                    m.push(f), this._addReference(f, b)
                                }
                                f = h || f, f && (e = this.modelId(f.attributes), !s || !f.isNew() && o[e] || (s.push(f), t = t || !this.models[v] || f.cid !== this.models[v].cid), o[e] = !0)
                            }
                            if (r) {
                                for (var v = 0; v < this.length; v++) o[(f = this.models[v]).cid] || n.push(f);
                                n.length && this._removeModels(n, b)
                            }
                            if (m.length || t)
                                if (k && (i = !0), this.length += m.length, null != j)
                                    for (var v = 0; v < m.length; v++) this.models.splice(j + v, 0, m[v]);
                                else {
                                    s && (this.models.length = 0);
                                    for (var w = s || m, v = 0; v < w.length; v++) this.models.push(w[v])
                                }
                            if (i && this.sort({
                                    silent: !0
                                }), !b.silent) {
                                for (var x = null != j ? c.clone(b) : b, v = 0; v < m.length; v++) null != j && (x.index = j + v), (f = m[v]).trigger("add", f, this, x);
                                (i || t) && this.trigger("sort", this, b), (m.length || n.length) && this.trigger("update", this, b)
                            }
                            return d ? a[0] : a
                        },
                        reset: function(a, b) {
                            b = b ? c.clone(b) : {};
                            for (var d = 0; d < this.models.length; d++) this._removeReference(this.models[d], b);
                            return b.previousModels = this.models, this._reset(), a = this.add(a, c.extend({
                                silent: !0
                            }, b)), b.silent || this.trigger("reset", this, b), a
                        },
                        push: function(a, b) {
                            return this.add(a, c.extend({
                                at: this.length
                            }, b))
                        },
                        pop: function(a) {
                            var b = this.at(this.length - 1);
                            return this.remove(b, a)
                        },
                        unshift: function(a, b) {
                            return this.add(a, c.extend({
                                at: 0
                            }, b))
                        },
                        shift: function(a) {
                            var b = this.at(0);
                            return this.remove(b, a)
                        },
                        slice: function() {
                            return f.apply(this.models, arguments)
                        },
                        get: function(a) {
                            if (null == a) return void 0;
                            var b = this.modelId(this._isModel(a) ? a.attributes : a);
                            return this._byId[a] || this._byId[b] || this._byId[a.cid]
                        },
                        at: function(a) {
                            return 0 > a && (a += this.length), this.models[a]
                        },
                        where: function(a, b) {
                            var d = c.matches(a);
                            return this[b ? "find" : "filter"](function(a) {
                                return d(a.attributes)
                            })
                        },
                        findWhere: function(a) {
                            return this.where(a, !0)
                        },
                        sort: function(a) {
                            if (!this.comparator) throw new Error("Cannot sort a set without a comparator");
                            return a || (a = {}), c.isString(this.comparator) || 1 === this.comparator.length ? this.models = this.sortBy(this.comparator, this) : this.models.sort(c.bind(this.comparator, this)), a.silent || this.trigger("sort", this, a), this
                        },
                        pluck: function(a) {
                            return c.invoke(this.models, "get", a)
                        },
                        fetch: function(a) {
                            a = c.extend({
                                parse: !0
                            }, a);
                            var b = a.success,
                                d = this;
                            return a.success = function(c) {
                                var e = a.reset ? "reset" : "set";
                                d[e](c, a), b && b.call(a.context, d, c, a), d.trigger("sync", d, c, a)
                            }, N(this, a), this.sync("read", this, a)
                        },
                        create: function(a, b) {
                            b = b ? c.clone(b) : {};
                            var d = b.wait;
                            if (a = this._prepareModel(a, b), !a) return !1;
                            d || this.add(a, b);
                            var e = this,
                                f = b.success;
                            return b.success = function(a, b, c) {
                                d && e.add(a, c), f && f.call(c.context, a, b, c)
                            }, a.save(null, b), a
                        },
                        parse: function(a, b) {
                            return a
                        },
                        clone: function() {
                            return new this.constructor(this.models, {
                                model: this.model,
                                comparator: this.comparator
                            })
                        },
                        modelId: function(a) {
                            return a[this.model.prototype.idAttribute || "id"]
                        },
                        _reset: function() {
                            this.length = 0, this.models = [], this._byId = {}
                        },
                        _prepareModel: function(a, b) {
                            if (this._isModel(a)) return a.collection || (a.collection = this), a;
                            b = b ? c.clone(b) : {}, b.collection = this;
                            var d = new this.model(a, b);
                            return d.validationError ? (this.trigger("invalid", this, d.validationError, b), !1) : d
                        },
                        _removeModels: function(a, b) {
                            for (var c = [], d = 0; d < a.length; d++) {
                                var e = this.get(a[d]);
                                if (e) {
                                    var f = this.indexOf(e);
                                    this.models.splice(f, 1), this.length--, b.silent || (b.index = f, e.trigger("remove", e, this, b)), c.push(e), this._removeReference(e, b)
                                }
                            }
                            return c.length ? c : !1
                        },
                        _isModel: function(a) {
                            return a instanceof r
                        },
                        _addReference: function(a, b) {
                            this._byId[a.cid] = a;
                            var c = this.modelId(a.attributes);
                            null != c && (this._byId[c] = a), a.on("all", this._onModelEvent, this)
                        },
                        _removeReference: function(a, b) {
                            delete this._byId[a.cid];
                            var c = this.modelId(a.attributes);
                            null != c && delete this._byId[c], this === a.collection && delete a.collection, a.off("all", this._onModelEvent, this)
                        },
                        _onModelEvent: function(a, b, c, d) {
                            if ("add" !== a && "remove" !== a || c === this) {
                                if ("destroy" === a && this.remove(b, d), "change" === a) {
                                    var e = this.modelId(b.previousAttributes()),
                                        f = this.modelId(b.attributes);
                                    e !== f && (null != e && delete this._byId[e], null != f && (this._byId[f] = b))
                                }
                                this.trigger.apply(this, arguments)
                            }
                        }
                    });
                    var w = {
                        forEach: 3,
                        each: 3,
                        map: 3,
                        collect: 3,
                        reduce: 4,
                        foldl: 4,
                        inject: 4,
                        reduceRight: 4,
                        foldr: 4,
                        find: 3,
                        detect: 3,
                        filter: 3,
                        select: 3,
                        reject: 3,
                        every: 3,
                        all: 3,
                        some: 3,
                        any: 3,
                        include: 2,
                        contains: 2,
                        invoke: 0,
                        max: 3,
                        min: 3,
                        toArray: 1,
                        size: 1,
                        first: 3,
                        head: 3,
                        take: 3,
                        initial: 3,
                        rest: 3,
                        tail: 3,
                        drop: 3,
                        last: 3,
                        without: 0,
                        difference: 0,
                        indexOf: 3,
                        shuffle: 1,
                        lastIndexOf: 3,
                        isEmpty: 1,
                        chain: 1,
                        sample: 3,
                        partition: 3
                    };
                    h(t, w, "models");
                    var x = ["groupBy", "countBy", "sortBy", "indexBy"];
                    c.each(x, function(a) {
                        c[a] && (t.prototype[a] = function(b, d) {
                            var e = c.isFunction(b) ? b : function(a) {
                                return a.get(b)
                            };
                            return c[a](this.models, e, d)
                        })
                    });
                    var y = b.View = function(a) {
                            this.cid = c.uniqueId("view"), c.extend(this, c.pick(a, A)), this._ensureElement(), this.initialize.apply(this, arguments)
                        },
                        z = /^(\S+)\s*(.*)$/,
                        A = ["model", "collection", "el", "id", "attributes", "className", "tagName", "events"];
                    c.extend(y.prototype, i, {
                        tagName: "div",
                        $: function(a) {
                            return this.$el.find(a)
                        },
                        initialize: function() {},
                        render: function() {
                            return this
                        },
                        remove: function() {
                            return this._removeElement(), this.stopListening(), this
                        },
                        _removeElement: function() {
                            this.$el.remove()
                        },
                        setElement: function(a) {
                            return this.undelegateEvents(), this._setElement(a), this.delegateEvents(), this
                        },
                        _setElement: function(a) {
                            this.$el = a instanceof b.$ ? a : b.$(a), this.el = this.$el[0]
                        },
                        delegateEvents: function(a) {
                            if (a || (a = c.result(this, "events")), !a) return this;
                            this.undelegateEvents();
                            for (var b in a) {
                                var d = a[b];
                                if (c.isFunction(d) || (d = this[d]), d) {
                                    var e = b.match(z);
                                    this.delegate(e[1], e[2], c.bind(d, this))
                                }
                            }
                            return this
                        },
                        delegate: function(a, b, c) {
                            return this.$el.on(a + ".delegateEvents" + this.cid, b, c), this
                        },
                        undelegateEvents: function() {
                            return this.$el && this.$el.off(".delegateEvents" + this.cid), this
                        },
                        undelegate: function(a, b, c) {
                            return this.$el.off(a + ".delegateEvents" + this.cid, b, c), this
                        },
                        _createElement: function(a) {
                            return document.createElement(a)
                        },
                        _ensureElement: function() {
                            if (this.el) this.setElement(c.result(this, "el"));
                            else {
                                var a = c.extend({}, c.result(this, "attributes"));
                                this.id && (a.id = c.result(this, "id")), this.className && (a["class"] = c.result(this, "className")), this.setElement(this._createElement(c.result(this, "tagName"))), this._setAttributes(a)
                            }
                        },
                        _setAttributes: function(a) {
                            this.$el.attr(a)
                        }
                    }), b.sync = function(a, d, e) {
                        var f = B[a];
                        c.defaults(e || (e = {}), {
                            emulateHTTP: b.emulateHTTP,
                            emulateJSON: b.emulateJSON
                        });
                        var g = {
                            type: f,
                            dataType: "json"
                        };
                        if (e.url || (g.url = c.result(d, "url") || M()), null != e.data || !d || "create" !== a && "update" !== a && "patch" !== a || (g.contentType = "application/json", g.data = JSON.stringify(e.attrs || d.toJSON(e))), e.emulateJSON && (g.contentType = "application/x-www-form-urlencoded", g.data = g.data ? {
                                model: g.data
                            } : {}), e.emulateHTTP && ("PUT" === f || "DELETE" === f || "PATCH" === f)) {
                            g.type = "POST", e.emulateJSON && (g.data._method = f);
                            var h = e.beforeSend;
                            e.beforeSend = function(a) {
                                return a.setRequestHeader("X-HTTP-Method-Override", f), h ? h.apply(this, arguments) : void 0
                            }
                        }
                        "GET" === g.type || e.emulateJSON || (g.processData = !1);
                        var i = e.error;
                        e.error = function(a, b, c) {
                            e.textStatus = b, e.errorThrown = c, i && i.call(e.context, a, b, c)
                        };
                        var j = e.xhr = b.ajax(c.extend(g, e));
                        return d.trigger("request", d, j, e), j
                    };
                    var B = {
                        create: "POST",
                        update: "PUT",
                        patch: "PATCH",
                        "delete": "DELETE",
                        read: "GET"
                    };
                    b.ajax = function() {
                        return b.$.ajax.apply(b.$, arguments)
                    };
                    var C = b.Router = function(a) {
                            a || (a = {}), a.routes && (this.routes = a.routes), this._bindRoutes(), this.initialize.apply(this, arguments)
                        },
                        D = /\((.*?)\)/g,
                        E = /(\(\?)?:\w+/g,
                        F = /\*\w+/g,
                        G = /[\-{}\[\]+?.,\\\^$|#\s]/g;
                    c.extend(C.prototype, i, {
                        initialize: function() {},
                        route: function(a, d, e) {
                            c.isRegExp(a) || (a = this._routeToRegExp(a)), c.isFunction(d) && (e = d, d = ""), e || (e = this[d]);
                            var f = this;
                            return b.history.route(a, function(c) {
                                var g = f._extractParameters(a, c);
                                f.execute(e, g, d) !== !1 && (f.trigger.apply(f, ["route:" + d].concat(g)), f.trigger("route", d, g), b.history.trigger("route", f, d, g))
                            }), this
                        },
                        execute: function(a, b, c) {
                            a && a.apply(this, b)
                        },
                        navigate: function(a, c) {
                            return b.history.navigate(a, c), this
                        },
                        _bindRoutes: function() {
                            if (this.routes) {
                                this.routes = c.result(this, "routes");
                                for (var a, b = c.keys(this.routes); null != (a = b.pop());) this.route(a, this.routes[a])
                            }
                        },
                        _routeToRegExp: function(a) {
                            return a = a.replace(G, "\\$&").replace(D, "(?:$1)?").replace(E, function(a, b) {
                                return b ? a : "([^/?]+)"
                            }).replace(F, "([^?]*?)"), new RegExp("^" + a + "(?:\\?([\\s\\S]*))?$")
                        },
                        _extractParameters: function(a, b) {
                            var d = a.exec(b).slice(1);
                            return c.map(d, function(a, b) {
                                return b === d.length - 1 ? a || null : a ? decodeURIComponent(a) : null
                            })
                        }
                    });
                    var H = b.History = function() {
                            this.handlers = [], c.bindAll(this, "checkUrl"), "undefined" != typeof window && (this.location = window.location, this.history = window.history)
                        },
                        I = /^[#\/]|\s+$/g,
                        J = /^\/+|\/+$/g,
                        K = /#.*$/;
                    H.started = !1, c.extend(H.prototype, i, {
                        interval: 50,
                        atRoot: function() {
                            var a = this.location.pathname.replace(/[^\/]$/, "$&/");
                            return a === this.root && !this.getSearch()
                        },
                        matchRoot: function() {
                            var a = this.decodeFragment(this.location.pathname),
                                b = a.slice(0, this.root.length - 1) + "/";
                            return b === this.root
                        },
                        decodeFragment: function(a) {
                            return decodeURI(a.replace(/%25/g, "%2525"))
                        },
                        getSearch: function() {
                            var a = this.location.href.replace(/#.*/, "").match(/\?.+/);
                            return a ? a[0] : ""
                        },
                        getHash: function(a) {
                            var b = (a || this).location.href.match(/#(.*)$/);
                            return b ? b[1] : ""
                        },
                        getPath: function() {
                            var a = this.decodeFragment(this.location.pathname + this.getSearch()).slice(this.root.length - 1);
                            return "/" === a.charAt(0) ? a.slice(1) : a
                        },
                        getFragment: function(a) {
                            return null == a && (a = this._usePushState || !this._wantsHashChange ? this.getPath() : this.getHash()), a.replace(I, "")
                        },
                        start: function(a) {
                            if (H.started) throw new Error("Backbone.history has already been started");
                            if (H.started = !0, this.options = c.extend({
                                    root: "/"
                                }, this.options, a), this.root = this.options.root, this._wantsHashChange = this.options.hashChange !== !1, this._hasHashChange = "onhashchange" in window, this._useHashChange = this._wantsHashChange && this._hasHashChange, this._wantsPushState = !!this.options.pushState, this._hasPushState = !(!this.history || !this.history.pushState), this._usePushState = this._wantsPushState && this._hasPushState, this.fragment = this.getFragment(), this.root = ("/" + this.root + "/").replace(J, "/"), this._wantsHashChange && this._wantsPushState) {
                                if (!this._hasPushState && !this.atRoot()) {
                                    var b = this.root.slice(0, -1) || "/";
                                    return this.location.replace(b + "#" + this.getPath()), !0
                                }
                                this._hasPushState && this.atRoot() && this.navigate(this.getHash(), {
                                    replace: !0
                                })
                            }
                            if (!this._hasHashChange && this._wantsHashChange && !this._usePushState) {
                                this.iframe = document.createElement("iframe"), this.iframe.src = "javascript:0", this.iframe.style.display = "none", this.iframe.tabIndex = -1;
                                var d = document.body,
                                    e = d.insertBefore(this.iframe, d.firstChild).contentWindow;
                                e.document.open(), e.document.close(), e.location.hash = "#" + this.fragment
                            }
                            var f = window.addEventListener || function(a, b) {
                                return attachEvent("on" + a, b)
                            };
                            return this._usePushState ? f("popstate", this.checkUrl, !1) : this._useHashChange && !this.iframe ? f("hashchange", this.checkUrl, !1) : this._wantsHashChange && (this._checkUrlInterval = setInterval(this.checkUrl, this.interval)), this.options.silent ? void 0 : this.loadUrl()
                        },
                        stop: function() {
                            var a = window.removeEventListener || function(a, b) {
                                return detachEvent("on" + a, b)
                            };
                            this._usePushState ? a("popstate", this.checkUrl, !1) : this._useHashChange && !this.iframe && a("hashchange", this.checkUrl, !1), this.iframe && (document.body.removeChild(this.iframe), this.iframe = null), this._checkUrlInterval && clearInterval(this._checkUrlInterval), H.started = !1
                        },
                        route: function(a, b) {
                            this.handlers.unshift({
                                route: a,
                                callback: b
                            })
                        },
                        checkUrl: function(a) {
                            var b = this.getFragment();
                            return b === this.fragment && this.iframe && (b = this.getHash(this.iframe.contentWindow)), b === this.fragment ? !1 : (this.iframe && this.navigate(b), void this.loadUrl())
                        },
                        loadUrl: function(a) {
                            return this.matchRoot() ? (a = this.fragment = this.getFragment(a), c.any(this.handlers, function(b) {
                                return b.route.test(a) ? (b.callback(a), !0) : void 0
                            })) : !1
                        },
                        navigate: function(a, b) {
                            if (!H.started) return !1;
                            b && b !== !0 || (b = {
                                trigger: !!b
                            }), a = this.getFragment(a || "");
                            var c = this.root;
                            ("" === a || "?" === a.charAt(0)) && (c = c.slice(0, -1) || "/");
                            var d = c + a;
                            if (a = this.decodeFragment(a.replace(K, "")), this.fragment !== a) {
                                if (this.fragment = a, this._usePushState) this.history[b.replace ? "replaceState" : "pushState"]({}, document.title, d);
                                else {
                                    if (!this._wantsHashChange) return this.location.assign(d);
                                    if (this._updateHash(this.location, a, b.replace), this.iframe && a !== this.getHash(this.iframe.contentWindow)) {
                                        var e = this.iframe.contentWindow;
                                        b.replace || (e.document.open(), e.document.close()), this._updateHash(e.location, a, b.replace)
                                    }
                                }
                                return b.trigger ? this.loadUrl(a) : void 0
                            }
                        },
                        _updateHash: function(a, b, c) {
                            if (c) {
                                var d = a.href.replace(/(javascript:|#).*$/, "");
                                a.replace(d + "#" + b)
                            } else a.hash = "#" + b
                        }
                    }), b.history = new H;
                    var L = function(a, b) {
                        var d, e = this;
                        d = a && c.has(a, "constructor") ? a.constructor : function() {
                            return e.apply(this, arguments)
                        }, c.extend(d, e, b);
                        var f = function() {
                            this.constructor = d
                        };
                        return f.prototype = e.prototype, d.prototype = new f, a && c.extend(d.prototype, a), d.__super__ = e.prototype, d
                    };
                    r.extend = t.extend = C.extend = y.extend = H.extend = L;
                    var M = function() {
                            throw new Error('A "url" property or function must be specified')
                        },
                        N = function(a, b) {
                            var c = b.error;
                            b.error = function(d) {
                                c && c.call(b.context, a, d, b), a.trigger("error", a, d, b)
                            }
                        };
                    return b
                })
            }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
        }, {
            jquery: 17,
            underscore: 35
        }],
        7: [function(a, b, c) {
            (function(a) {
                function b(a, b) {
                    for (var c = 0, d = a.length - 1; d >= 0; d--) {
                        var e = a[d];
                        "." === e ? a.splice(d, 1) : ".." === e ? (a.splice(d, 1), c++) : c && (a.splice(d, 1), c--)
                    }
                    if (b)
                        for (; c--; c) a.unshift("..");
                    return a
                }

                function d(a, b) {
                    if (a.filter) return a.filter(b);
                    for (var c = [], d = 0; d < a.length; d++) b(a[d], d, a) && c.push(a[d]);
                    return c
                }
                var e = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/,
                    f = function(a) {
                        return e.exec(a).slice(1)
                    };
                c.resolve = function() {
                    for (var c = "", e = !1, f = arguments.length - 1; f >= -1 && !e; f--) {
                        var g = f >= 0 ? arguments[f] : a.cwd();
                        if ("string" != typeof g) throw new TypeError("Arguments to path.resolve must be strings");
                        g && (c = g + "/" + c, e = "/" === g.charAt(0))
                    }
                    return c = b(d(c.split("/"), function(a) {
                        return !!a
                    }), !e).join("/"), (e ? "/" : "") + c || "."
                }, c.normalize = function(a) {
                    var e = c.isAbsolute(a),
                        f = "/" === g(a, -1);
                    return a = b(d(a.split("/"), function(a) {
                        return !!a
                    }), !e).join("/"), a || e || (a = "."), a && f && (a += "/"), (e ? "/" : "") + a
                }, c.isAbsolute = function(a) {
                    return "/" === a.charAt(0)
                }, c.join = function() {
                    var a = Array.prototype.slice.call(arguments, 0);
                    return c.normalize(d(a, function(a, b) {
                        if ("string" != typeof a) throw new TypeError("Arguments to path.join must be strings");
                        return a
                    }).join("/"))
                }, c.relative = function(a, b) {
                    function d(a) {
                        for (var b = 0; b < a.length && "" === a[b]; b++);
                        for (var c = a.length - 1; c >= 0 && "" === a[c]; c--);
                        return b > c ? [] : a.slice(b, c - b + 1)
                    }
                    a = c.resolve(a).substr(1), b = c.resolve(b).substr(1);
                    for (var e = d(a.split("/")), f = d(b.split("/")), g = Math.min(e.length, f.length), h = g, i = 0; g > i; i++)
                        if (e[i] !== f[i]) {
                            h = i;
                            break
                        }
                    for (var j = [], i = h; i < e.length; i++) j.push("..");
                    return j = j.concat(f.slice(h)), j.join("/")
                }, c.sep = "/", c.delimiter = ":", c.dirname = function(a) {
                    var b = f(a),
                        c = b[0],
                        d = b[1];
                    return c || d ? (d && (d = d.substr(0, d.length - 1)), c + d) : "."
                }, c.basename = function(a, b) {
                    var c = f(a)[2];
                    return b && c.substr(-1 * b.length) === b && (c = c.substr(0, c.length - b.length)), c
                }, c.extname = function(a) {
                    return f(a)[3]
                };
                var g = "b" === "ab".substr(-1) ? function(a, b, c) {
                    return a.substr(b, c)
                } : function(a, b, c) {
                    return 0 > b && (b = a.length + b), a.substr(b, c)
                }
            }).call(this, a("_process"))
        }, {
            _process: 8
        }],
        8: [function(a, b, c) {
            function d() {
                k = !1, h.length ? j = h.concat(j) : l = -1, j.length && e()
            }

            function e() {
                if (!k) {
                    var a = setTimeout(d);
                    k = !0;
                    for (var b = j.length; b;) {
                        for (h = j, j = []; ++l < b;) h[l].run();
                        l = -1, b = j.length
                    }
                    h = null, k = !1, clearTimeout(a)
                }
            }

            function f(a, b) {
                this.fun = a, this.array = b
            }

            function g() {}
            var h, i = b.exports = {},
                j = [],
                k = !1,
                l = -1;
            i.nextTick = function(a) {
                var b = new Array(arguments.length - 1);
                if (arguments.length > 1)
                    for (var c = 1; c < arguments.length; c++) b[c - 1] = arguments[c];
                j.push(new f(a, b)), 1 !== j.length || k || setTimeout(e, 0)
            }, f.prototype.run = function() {
                this.fun.apply(null, this.array)
            }, i.title = "browser", i.browser = !0, i.env = {}, i.argv = [], i.version = "", i.versions = {}, i.on = g, i.addListener = g, i.once = g, i.off = g, i.removeListener = g, i.removeAllListeners = g, i.emit = g, i.binding = function(a) {
                throw new Error("process.binding is not supported")
            }, i.cwd = function() {
                return "/"
            }, i.chdir = function(a) {
                throw new Error("process.chdir is not supported")
            }, i.umask = function() {
                return 0
            }
        }, {}],
        9: [function(a, b, c) {
            (function(a) {
                ! function(d) {
                    function e(a) {
                        throw RangeError(H[a])
                    }

                    function f(a, b) {
                        for (var c = a.length, d = []; c--;) d[c] = b(a[c]);
                        return d
                    }

                    function g(a, b) {
                        var c = a.split("@"),
                            d = "";
                        c.length > 1 && (d = c[0] + "@", a = c[1]), a = a.replace(G, ".");
                        var e = a.split("."),
                            g = f(e, b).join(".");
                        return d + g
                    }

                    function h(a) {
                        for (var b, c, d = [], e = 0, f = a.length; f > e;) b = a.charCodeAt(e++), b >= 55296 && 56319 >= b && f > e ? (c = a.charCodeAt(e++), 56320 == (64512 & c) ? d.push(((1023 & b) << 10) + (1023 & c) + 65536) : (d.push(b), e--)) : d.push(b);
                        return d
                    }

                    function i(a) {
                        return f(a, function(a) {
                            var b = "";
                            return a > 65535 && (a -= 65536, b += K(a >>> 10 & 1023 | 55296), a = 56320 | 1023 & a), b += K(a)
                        }).join("")
                    }

                    function j(a) {
                        return 10 > a - 48 ? a - 22 : 26 > a - 65 ? a - 65 : 26 > a - 97 ? a - 97 : w
                    }

                    function k(a, b) {
                        return a + 22 + 75 * (26 > a) - ((0 != b) << 5)
                    }

                    function l(a, b, c) {
                        var d = 0;
                        for (a = c ? J(a / A) : a >> 1, a += J(a / b); a > I * y >> 1; d += w) a = J(a / I);
                        return J(d + (I + 1) * a / (a + z))
                    }

                    function m(a) {
                        var b, c, d, f, g, h, k, m, n, o, p = [],
                            q = a.length,
                            r = 0,
                            s = C,
                            t = B;
                        for (c = a.lastIndexOf(D), 0 > c && (c = 0), d = 0; c > d; ++d) a.charCodeAt(d) >= 128 && e("not-basic"), p.push(a.charCodeAt(d));
                        for (f = c > 0 ? c + 1 : 0; q > f;) {
                            for (g = r, h = 1, k = w; f >= q && e("invalid-input"), m = j(a.charCodeAt(f++)), (m >= w || m > J((v - r) / h)) && e("overflow"), r += m * h, n = t >= k ? x : k >= t + y ? y : k - t, !(n > m); k += w) o = w - n, h > J(v / o) && e("overflow"), h *= o;
                            b = p.length + 1, t = l(r - g, b, 0 == g), J(r / b) > v - s && e("overflow"), s += J(r / b), r %= b, p.splice(r++, 0, s)
                        }
                        return i(p)
                    }

                    function n(a) {
                        var b, c, d, f, g, i, j, m, n, o, p, q, r, s, t, u = [];
                        for (a = h(a), q = a.length, b = C, c = 0, g = B, i = 0; q > i; ++i) p = a[i], 128 > p && u.push(K(p));
                        for (d = f = u.length, f && u.push(D); q > d;) {
                            for (j = v, i = 0; q > i; ++i) p = a[i], p >= b && j > p && (j = p);
                            for (r = d + 1, j - b > J((v - c) / r) && e("overflow"), c += (j - b) * r, b = j, i = 0; q > i; ++i)
                                if (p = a[i], b > p && ++c > v && e("overflow"), p == b) {
                                    for (m = c, n = w; o = g >= n ? x : n >= g + y ? y : n - g, !(o > m); n += w) t = m - o, s = w - o, u.push(K(k(o + t % s, 0))), m = J(t / s);
                                    u.push(K(k(m, 0))), g = l(c, r, d == f), c = 0, ++d
                                }++c, ++b
                        }
                        return u.join("")
                    }

                    function o(a) {
                        return g(a, function(a) {
                            return E.test(a) ? m(a.slice(4).toLowerCase()) : a
                        })
                    }

                    function p(a) {
                        return g(a, function(a) {
                            return F.test(a) ? "xn--" + n(a) : a
                        })
                    }
                    var q = "object" == typeof c && c && !c.nodeType && c,
                        r = "object" == typeof b && b && !b.nodeType && b,
                        s = "object" == typeof a && a;
                    (s.global === s || s.window === s || s.self === s) && (d = s);
                    var t, u, v = 2147483647,
                        w = 36,
                        x = 1,
                        y = 26,
                        z = 38,
                        A = 700,
                        B = 72,
                        C = 128,
                        D = "-",
                        E = /^xn--/,
                        F = /[^\x20-\x7E]/,
                        G = /[\x2E\u3002\uFF0E\uFF61]/g,
                        H = {
                            overflow: "Overflow: input needs wider integers to process",
                            "not-basic": "Illegal input >= 0x80 (not a basic code point)",
                            "invalid-input": "Invalid input"
                        },
                        I = w - x,
                        J = Math.floor,
                        K = String.fromCharCode;
                    if (t = {
                            version: "1.3.2",
                            ucs2: {
                                decode: h,
                                encode: i
                            },
                            decode: m,
                            encode: n,
                            toASCII: p,
                            toUnicode: o
                        }, "function" == typeof define && "object" == typeof define.amd && define.amd) define("punycode", function() {
                        return t
                    });
                    else if (q && r)
                        if (b.exports == q) r.exports = t;
                        else
                            for (u in t) t.hasOwnProperty(u) && (q[u] = t[u]);
                    else d.punycode = t
                }(this)
            }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
        }, {}],
        10: [function(a, b, c) {
            "use strict";

            function d(a, b) {
                return Object.prototype.hasOwnProperty.call(a, b)
            }
            b.exports = function(a, b, c, f) {
                b = b || "&", c = c || "=";
                var g = {};
                if ("string" != typeof a || 0 === a.length) return g;
                var h = /\+/g;
                a = a.split(b);
                var i = 1e3;
                f && "number" == typeof f.maxKeys && (i = f.maxKeys);
                var j = a.length;
                i > 0 && j > i && (j = i);
                for (var k = 0; j > k; ++k) {
                    var l, m, n, o, p = a[k].replace(h, "%20"),
                        q = p.indexOf(c);
                    q >= 0 ? (l = p.substr(0, q), m = p.substr(q + 1)) : (l = p, m = ""), n = decodeURIComponent(l), o = decodeURIComponent(m), d(g, n) ? e(g[n]) ? g[n].push(o) : g[n] = [g[n], o] : g[n] = o
                }
                return g
            };
            var e = Array.isArray || function(a) {
                return "[object Array]" === Object.prototype.toString.call(a)
            }
        }, {}],
        11: [function(a, b, c) {
            "use strict";

            function d(a, b) {
                if (a.map) return a.map(b);
                for (var c = [], d = 0; d < a.length; d++) c.push(b(a[d], d));
                return c
            }
            var e = function(a) {
                switch (typeof a) {
                    case "string":
                        return a;
                    case "boolean":
                        return a ? "true" : "false";
                    case "number":
                        return isFinite(a) ? a : "";
                    default:
                        return ""
                }
            };
            b.exports = function(a, b, c, h) {
                return b = b || "&", c = c || "=", null === a && (a = void 0), "object" == typeof a ? d(g(a), function(g) {
                    var h = encodeURIComponent(e(g)) + c;
                    return f(a[g]) ? d(a[g], function(a) {
                        return h + encodeURIComponent(e(a))
                    }).join(b) : h + encodeURIComponent(e(a[g]))
                }).join(b) : h ? encodeURIComponent(e(h)) + c + encodeURIComponent(e(a)) : ""
            };
            var f = Array.isArray || function(a) {
                    return "[object Array]" === Object.prototype.toString.call(a)
                },
                g = Object.keys || function(a) {
                    var b = [];
                    for (var c in a) Object.prototype.hasOwnProperty.call(a, c) && b.push(c);
                    return b
                }
        }, {}],
        12: [function(a, b, c) {
            "use strict";
            c.decode = c.parse = a("./decode"), c.encode = c.stringify = a("./encode")
        }, {
            "./decode": 10,
            "./encode": 11
        }],
        13: [function(a, b, c) {
            function d() {
                this.protocol = null, this.slashes = null, this.auth = null, this.host = null, this.port = null, this.hostname = null, this.hash = null, this.search = null, this.query = null, this.pathname = null, this.path = null, this.href = null
            }

            function e(a, b, c) {
                if (a && j(a) && a instanceof d) return a;
                var e = new d;
                return e.parse(a, b, c), e
            }

            function f(a) {
                return i(a) && (a = e(a)), a instanceof d ? a.format() : d.prototype.format.call(a)
            }

            function g(a, b) {
                return e(a, !1, !0).resolve(b)
            }

            function h(a, b) {
                return a ? e(a, !1, !0).resolveObject(b) : b
            }

            function i(a) {
                return "string" == typeof a
            }

            function j(a) {
                return "object" == typeof a && null !== a
            }

            function k(a) {
                return null === a
            }

            function l(a) {
                return null == a
            }
            var m = a("punycode");
            c.parse = e, c.resolve = g, c.resolveObject = h, c.format = f, c.Url = d;
            var n = /^([a-z0-9.+-]+:)/i,
                o = /:[0-9]*$/,
                p = ["<", ">", '"', "`", " ", "\r", "\n", "	"],
                q = ["{", "}", "|", "\\", "^", "`"].concat(p),
                r = ["'"].concat(q),
                s = ["%", "/", "?", ";", "#"].concat(r),
                t = ["/", "?", "#"],
                u = 255,
                v = /^[a-z0-9A-Z_-]{0,63}$/,
                w = /^([a-z0-9A-Z_-]{0,63})(.*)$/,
                x = {
                    javascript: !0,
                    "javascript:": !0
                },
                y = {
                    javascript: !0,
                    "javascript:": !0
                },
                z = {
                    http: !0,
                    https: !0,
                    ftp: !0,
                    gopher: !0,
                    file: !0,
                    "http:": !0,
                    "https:": !0,
                    "ftp:": !0,
                    "gopher:": !0,
                    "file:": !0
                },
                A = a("querystring");
            d.prototype.parse = function(a, b, c) {
                if (!i(a)) throw new TypeError("Parameter 'url' must be a string, not " + typeof a);
                var d = a;
                d = d.trim();
                var e = n.exec(d);
                if (e) {
                    e = e[0];
                    var f = e.toLowerCase();
                    this.protocol = f, d = d.substr(e.length)
                }
                if (c || e || d.match(/^\/\/[^@\/]+@[^@\/]+/)) {
                    var g = "//" === d.substr(0, 2);
                    !g || e && y[e] || (d = d.substr(2), this.slashes = !0)
                }
                if (!y[e] && (g || e && !z[e])) {
                    for (var h = -1, j = 0; j < t.length; j++) {
                        var k = d.indexOf(t[j]); - 1 !== k && (-1 === h || h > k) && (h = k)
                    }
                    var l, o;
                    o = -1 === h ? d.lastIndexOf("@") : d.lastIndexOf("@", h), -1 !== o && (l = d.slice(0, o), d = d.slice(o + 1), this.auth = decodeURIComponent(l)), h = -1;
                    for (var j = 0; j < s.length; j++) {
                        var k = d.indexOf(s[j]); - 1 !== k && (-1 === h || h > k) && (h = k)
                    } - 1 === h && (h = d.length), this.host = d.slice(0, h), d = d.slice(h), this.parseHost(), this.hostname = this.hostname || "";
                    var p = "[" === this.hostname[0] && "]" === this.hostname[this.hostname.length - 1];
                    if (!p)
                        for (var q = this.hostname.split(/\./), j = 0, B = q.length; B > j; j++) {
                            var C = q[j];
                            if (C && !C.match(v)) {
                                for (var D = "", E = 0, F = C.length; F > E; E++) D += C.charCodeAt(E) > 127 ? "x" : C[E];
                                if (!D.match(v)) {
                                    var G = q.slice(0, j),
                                        H = q.slice(j + 1),
                                        I = C.match(w);
                                    I && (G.push(I[1]), H.unshift(I[2])), H.length && (d = "/" + H.join(".") + d), this.hostname = G.join(".");
                                    break
                                }
                            }
                        }
                    if (this.hostname.length > u ? this.hostname = "" : this.hostname = this.hostname.toLowerCase(), !p) {
                        for (var J = this.hostname.split("."), K = [], j = 0; j < J.length; ++j) {
                            var L = J[j];
                            K.push(L.match(/[^A-Za-z0-9_-]/) ? "xn--" + m.encode(L) : L)
                        }
                        this.hostname = K.join(".")
                    }
                    var M = this.port ? ":" + this.port : "",
                        N = this.hostname || "";
                    this.host = N + M, this.href += this.host, p && (this.hostname = this.hostname.substr(1, this.hostname.length - 2), "/" !== d[0] && (d = "/" + d))
                }
                if (!x[f])
                    for (var j = 0, B = r.length; B > j; j++) {
                        var O = r[j],
                            P = encodeURIComponent(O);
                        P === O && (P = escape(O)), d = d.split(O).join(P)
                    }
                var Q = d.indexOf("#"); - 1 !== Q && (this.hash = d.substr(Q), d = d.slice(0, Q));
                var R = d.indexOf("?");
                if (-1 !== R ? (this.search = d.substr(R), this.query = d.substr(R + 1), b && (this.query = A.parse(this.query)),
                        d = d.slice(0, R)) : b && (this.search = "", this.query = {}), d && (this.pathname = d), z[f] && this.hostname && !this.pathname && (this.pathname = "/"), this.pathname || this.search) {
                    var M = this.pathname || "",
                        L = this.search || "";
                    this.path = M + L
                }
                return this.href = this.format(), this
            }, d.prototype.format = function() {
                var a = this.auth || "";
                a && (a = encodeURIComponent(a), a = a.replace(/%3A/i, ":"), a += "@");
                var b = this.protocol || "",
                    c = this.pathname || "",
                    d = this.hash || "",
                    e = !1,
                    f = "";
                this.host ? e = a + this.host : this.hostname && (e = a + (-1 === this.hostname.indexOf(":") ? this.hostname : "[" + this.hostname + "]"), this.port && (e += ":" + this.port)), this.query && j(this.query) && Object.keys(this.query).length && (f = A.stringify(this.query));
                var g = this.search || f && "?" + f || "";
                return b && ":" !== b.substr(-1) && (b += ":"), this.slashes || (!b || z[b]) && e !== !1 ? (e = "//" + (e || ""), c && "/" !== c.charAt(0) && (c = "/" + c)) : e || (e = ""), d && "#" !== d.charAt(0) && (d = "#" + d), g && "?" !== g.charAt(0) && (g = "?" + g), c = c.replace(/[?#]/g, function(a) {
                    return encodeURIComponent(a)
                }), g = g.replace("#", "%23"), b + e + c + g + d
            }, d.prototype.resolve = function(a) {
                return this.resolveObject(e(a, !1, !0)).format()
            }, d.prototype.resolveObject = function(a) {
                if (i(a)) {
                    var b = new d;
                    b.parse(a, !1, !0), a = b
                }
                var c = new d;
                if (Object.keys(this).forEach(function(a) {
                        c[a] = this[a]
                    }, this), c.hash = a.hash, "" === a.href) return c.href = c.format(), c;
                if (a.slashes && !a.protocol) return Object.keys(a).forEach(function(b) {
                    "protocol" !== b && (c[b] = a[b])
                }), z[c.protocol] && c.hostname && !c.pathname && (c.path = c.pathname = "/"), c.href = c.format(), c;
                if (a.protocol && a.protocol !== c.protocol) {
                    if (!z[a.protocol]) return Object.keys(a).forEach(function(b) {
                        c[b] = a[b]
                    }), c.href = c.format(), c;
                    if (c.protocol = a.protocol, a.host || y[a.protocol]) c.pathname = a.pathname;
                    else {
                        for (var e = (a.pathname || "").split("/"); e.length && !(a.host = e.shift()););
                        a.host || (a.host = ""), a.hostname || (a.hostname = ""), "" !== e[0] && e.unshift(""), e.length < 2 && e.unshift(""), c.pathname = e.join("/")
                    }
                    if (c.search = a.search, c.query = a.query, c.host = a.host || "", c.auth = a.auth, c.hostname = a.hostname || a.host, c.port = a.port, c.pathname || c.search) {
                        var f = c.pathname || "",
                            g = c.search || "";
                        c.path = f + g
                    }
                    return c.slashes = c.slashes || a.slashes, c.href = c.format(), c
                }
                var h = c.pathname && "/" === c.pathname.charAt(0),
                    j = a.host || a.pathname && "/" === a.pathname.charAt(0),
                    m = j || h || c.host && a.pathname,
                    n = m,
                    o = c.pathname && c.pathname.split("/") || [],
                    e = a.pathname && a.pathname.split("/") || [],
                    p = c.protocol && !z[c.protocol];
                if (p && (c.hostname = "", c.port = null, c.host && ("" === o[0] ? o[0] = c.host : o.unshift(c.host)), c.host = "", a.protocol && (a.hostname = null, a.port = null, a.host && ("" === e[0] ? e[0] = a.host : e.unshift(a.host)), a.host = null), m = m && ("" === e[0] || "" === o[0])), j) c.host = a.host || "" === a.host ? a.host : c.host, c.hostname = a.hostname || "" === a.hostname ? a.hostname : c.hostname, c.search = a.search, c.query = a.query, o = e;
                else if (e.length) o || (o = []), o.pop(), o = o.concat(e), c.search = a.search, c.query = a.query;
                else if (!l(a.search)) {
                    if (p) {
                        c.hostname = c.host = o.shift();
                        var q = c.host && c.host.indexOf("@") > 0 ? c.host.split("@") : !1;
                        q && (c.auth = q.shift(), c.host = c.hostname = q.shift())
                    }
                    return c.search = a.search, c.query = a.query, k(c.pathname) && k(c.search) || (c.path = (c.pathname ? c.pathname : "") + (c.search ? c.search : "")), c.href = c.format(), c
                }
                if (!o.length) return c.pathname = null, c.search ? c.path = "/" + c.search : c.path = null, c.href = c.format(), c;
                for (var r = o.slice(-1)[0], s = (c.host || a.host) && ("." === r || ".." === r) || "" === r, t = 0, u = o.length; u >= 0; u--) r = o[u], "." == r ? o.splice(u, 1) : ".." === r ? (o.splice(u, 1), t++) : t && (o.splice(u, 1), t--);
                if (!m && !n)
                    for (; t--; t) o.unshift("..");
                !m || "" === o[0] || o[0] && "/" === o[0].charAt(0) || o.unshift(""), s && "/" !== o.join("/").substr(-1) && o.push("");
                var v = "" === o[0] || o[0] && "/" === o[0].charAt(0);
                if (p) {
                    c.hostname = c.host = v ? "" : o.length ? o.shift() : "";
                    var q = c.host && c.host.indexOf("@") > 0 ? c.host.split("@") : !1;
                    q && (c.auth = q.shift(), c.host = c.hostname = q.shift())
                }
                return m = m || c.host && o.length, m && !v && o.unshift(""), o.length ? c.pathname = o.join("/") : (c.pathname = null, c.path = null), k(c.pathname) && k(c.search) || (c.path = (c.pathname ? c.pathname : "") + (c.search ? c.search : "")), c.auth = a.auth || c.auth, c.slashes = c.slashes || a.slashes, c.href = c.format(), c
            }, d.prototype.parseHost = function() {
                var a = this.host,
                    b = o.exec(a);
                b && (b = b[0], ":" !== b && (this.port = b.substr(1)), a = a.substr(0, a.length - b.length)), a && (this.hostname = a)
            }
        }, {
            punycode: 9,
            querystring: 12
        }],
        14: [function(a, b, c) {
            function d(a, b) {
                var c = {},
                    d = b || {},
                    e = a.split(/; */),
                    h = d.decode || g;
                return e.forEach(function(a) {
                    var b = a.indexOf("=");
                    if (!(0 > b)) {
                        var d = a.substr(0, b).trim(),
                            e = a.substr(++b, a.length).trim();
                        '"' == e[0] && (e = e.slice(1, -1)), void 0 == c[d] && (c[d] = f(e, h))
                    }
                }), c
            }

            function e(a, b, c) {
                var d = c || {},
                    e = d.encode || h,
                    f = [a + "=" + e(b)];
                if (null != d.maxAge) {
                    var g = d.maxAge - 0;
                    if (isNaN(g)) throw new Error("maxAge should be a Number");
                    f.push("Max-Age=" + g)
                }
                return d.domain && f.push("Domain=" + d.domain), d.path && f.push("Path=" + d.path), d.expires && f.push("Expires=" + d.expires.toUTCString()), d.httpOnly && f.push("HttpOnly"), d.secure && f.push("Secure"), f.join("; ")
            }

            function f(a, b) {
                try {
                    return b(a)
                } catch (c) {
                    return a
                }
            }
            c.parse = d, c.serialize = e;
            var g = decodeURIComponent,
                h = encodeURIComponent
        }, {}],
        15: [function(a, b, c) {
            (function(c, d) {
                (function() {
                    "use strict";

                    function e(a) {
                        return "function" == typeof a || "object" == typeof a && null !== a
                    }

                    function f(a) {
                        return "function" == typeof a
                    }

                    function g(a) {
                        return "object" == typeof a && null !== a
                    }

                    function h(a) {
                        T = a
                    }

                    function i(a) {
                        X = a
                    }

                    function j() {
                        return function() {
                            c.nextTick(o)
                        }
                    }

                    function k() {
                        return function() {
                            S(o)
                        }
                    }

                    function l() {
                        var a = 0,
                            b = new $(o),
                            c = document.createTextNode("");
                        return b.observe(c, {
                                characterData: !0
                            }),
                            function() {
                                c.data = a = ++a % 2
                            }
                    }

                    function m() {
                        var a = new MessageChannel;
                        return a.port1.onmessage = o,
                            function() {
                                a.port2.postMessage(0)
                            }
                    }

                    function n() {
                        return function() {
                            setTimeout(o, 1)
                        }
                    }

                    function o() {
                        for (var a = 0; W > a; a += 2) {
                            var b = ba[a],
                                c = ba[a + 1];
                            b(c), ba[a] = void 0, ba[a + 1] = void 0
                        }
                        W = 0
                    }

                    function p() {
                        try {
                            var b = a,
                                c = b("vertx");
                            return S = c.runOnLoop || c.runOnContext, k()
                        } catch (d) {
                            return n()
                        }
                    }

                    function q() {}

                    function r() {
                        return new TypeError("You cannot resolve a promise with itself")
                    }

                    function s() {
                        return new TypeError("A promises callback cannot return that same promise.")
                    }

                    function t(a) {
                        try {
                            return a.then
                        } catch (b) {
                            return fa.error = b, fa
                        }
                    }

                    function u(a, b, c, d) {
                        try {
                            a.call(b, c, d)
                        } catch (e) {
                            return e
                        }
                    }

                    function v(a, b, c) {
                        X(function(a) {
                            var d = !1,
                                e = u(c, b, function(c) {
                                    d || (d = !0, b !== c ? y(a, c) : A(a, c))
                                }, function(b) {
                                    d || (d = !0, B(a, b))
                                }, "Settle: " + (a._label || " unknown promise"));
                            !d && e && (d = !0, B(a, e))
                        }, a)
                    }

                    function w(a, b) {
                        b._state === da ? A(a, b._result) : b._state === ea ? B(a, b._result) : C(b, void 0, function(b) {
                            y(a, b)
                        }, function(b) {
                            B(a, b)
                        })
                    }

                    function x(a, b) {
                        if (b.constructor === a.constructor) w(a, b);
                        else {
                            var c = t(b);
                            c === fa ? B(a, fa.error) : void 0 === c ? A(a, b) : f(c) ? v(a, b, c) : A(a, b)
                        }
                    }

                    function y(a, b) {
                        a === b ? B(a, r()) : e(b) ? x(a, b) : A(a, b)
                    }

                    function z(a) {
                        a._onerror && a._onerror(a._result), D(a)
                    }

                    function A(a, b) {
                        a._state === ca && (a._result = b, a._state = da, 0 !== a._subscribers.length && X(D, a))
                    }

                    function B(a, b) {
                        a._state === ca && (a._state = ea, a._result = b, X(z, a))
                    }

                    function C(a, b, c, d) {
                        var e = a._subscribers,
                            f = e.length;
                        a._onerror = null, e[f] = b, e[f + da] = c, e[f + ea] = d, 0 === f && a._state && X(D, a)
                    }

                    function D(a) {
                        var b = a._subscribers,
                            c = a._state;
                        if (0 !== b.length) {
                            for (var d, e, f = a._result, g = 0; g < b.length; g += 3) d = b[g], e = b[g + c], d ? G(c, d, e, f) : e(f);
                            a._subscribers.length = 0
                        }
                    }

                    function E() {
                        this.error = null
                    }

                    function F(a, b) {
                        try {
                            return a(b)
                        } catch (c) {
                            return ga.error = c, ga
                        }
                    }

                    function G(a, b, c, d) {
                        var e, g, h, i, j = f(c);
                        if (j) {
                            if (e = F(c, d), e === ga ? (i = !0, g = e.error, e = null) : h = !0, b === e) return void B(b, s())
                        } else e = d, h = !0;
                        b._state !== ca || (j && h ? y(b, e) : i ? B(b, g) : a === da ? A(b, e) : a === ea && B(b, e))
                    }

                    function H(a, b) {
                        try {
                            b(function(b) {
                                y(a, b)
                            }, function(b) {
                                B(a, b)
                            })
                        } catch (c) {
                            B(a, c)
                        }
                    }

                    function I(a, b) {
                        var c = this;
                        c._instanceConstructor = a, c.promise = new a(q), c._validateInput(b) ? (c._input = b, c.length = b.length, c._remaining = b.length, c._init(), 0 === c.length ? A(c.promise, c._result) : (c.length = c.length || 0, c._enumerate(), 0 === c._remaining && A(c.promise, c._result))) : B(c.promise, c._validationError())
                    }

                    function J(a) {
                        return new ha(this, a).promise
                    }

                    function K(a) {
                        function b(a) {
                            y(e, a)
                        }

                        function c(a) {
                            B(e, a)
                        }
                        var d = this,
                            e = new d(q);
                        if (!V(a)) return B(e, new TypeError("You must pass an array to race.")), e;
                        for (var f = a.length, g = 0; e._state === ca && f > g; g++) C(d.resolve(a[g]), void 0, b, c);
                        return e
                    }

                    function L(a) {
                        var b = this;
                        if (a && "object" == typeof a && a.constructor === b) return a;
                        var c = new b(q);
                        return y(c, a), c
                    }

                    function M(a) {
                        var b = this,
                            c = new b(q);
                        return B(c, a), c
                    }

                    function N() {
                        throw new TypeError("You must pass a resolver function as the first argument to the promise constructor")
                    }

                    function O() {
                        throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.")
                    }

                    function P(a) {
                        this._id = ma++, this._state = void 0, this._result = void 0, this._subscribers = [], q !== a && (f(a) || N(), this instanceof P || O(), H(this, a))
                    }

                    function Q() {
                        var a;
                        if ("undefined" != typeof d) a = d;
                        else if ("undefined" != typeof self) a = self;
                        else try {
                            a = Function("return this")()
                        } catch (b) {
                            throw new Error("polyfill failed because global object is unavailable in this environment")
                        }
                        var c = a.Promise;
                        (!c || "[object Promise]" !== Object.prototype.toString.call(c.resolve()) || c.cast) && (a.Promise = na)
                    }
                    var R;
                    R = Array.isArray ? Array.isArray : function(a) {
                        return "[object Array]" === Object.prototype.toString.call(a)
                    };
                    var S, T, U, V = R,
                        W = 0,
                        X = ({}.toString, function(a, b) {
                            ba[W] = a, ba[W + 1] = b, W += 2, 2 === W && (T ? T(o) : U())
                        }),
                        Y = "undefined" != typeof window ? window : void 0,
                        Z = Y || {},
                        $ = Z.MutationObserver || Z.WebKitMutationObserver,
                        _ = "undefined" != typeof c && "[object process]" === {}.toString.call(c),
                        aa = "undefined" != typeof Uint8ClampedArray && "undefined" != typeof importScripts && "undefined" != typeof MessageChannel,
                        ba = new Array(1e3);
                    U = _ ? j() : $ ? l() : aa ? m() : void 0 === Y && "function" == typeof a ? p() : n();
                    var ca = void 0,
                        da = 1,
                        ea = 2,
                        fa = new E,
                        ga = new E;
                    I.prototype._validateInput = function(a) {
                        return V(a)
                    }, I.prototype._validationError = function() {
                        return new Error("Array Methods must be provided an Array")
                    }, I.prototype._init = function() {
                        this._result = new Array(this.length)
                    };
                    var ha = I;
                    I.prototype._enumerate = function() {
                        for (var a = this, b = a.length, c = a.promise, d = a._input, e = 0; c._state === ca && b > e; e++) a._eachEntry(d[e], e)
                    }, I.prototype._eachEntry = function(a, b) {
                        var c = this,
                            d = c._instanceConstructor;
                        g(a) ? a.constructor === d && a._state !== ca ? (a._onerror = null, c._settledAt(a._state, b, a._result)) : c._willSettleAt(d.resolve(a), b) : (c._remaining--, c._result[b] = a)
                    }, I.prototype._settledAt = function(a, b, c) {
                        var d = this,
                            e = d.promise;
                        e._state === ca && (d._remaining--, a === ea ? B(e, c) : d._result[b] = c), 0 === d._remaining && A(e, d._result)
                    }, I.prototype._willSettleAt = function(a, b) {
                        var c = this;
                        C(a, void 0, function(a) {
                            c._settledAt(da, b, a)
                        }, function(a) {
                            c._settledAt(ea, b, a)
                        })
                    };
                    var ia = J,
                        ja = K,
                        ka = L,
                        la = M,
                        ma = 0,
                        na = P;
                    P.all = ia, P.race = ja, P.resolve = ka, P.reject = la, P._setScheduler = h, P._setAsap = i, P._asap = X, P.prototype = {
                        constructor: P,
                        then: function(a, b) {
                            var c = this,
                                d = c._state;
                            if (d === da && !a || d === ea && !b) return this;
                            var e = new this.constructor(q),
                                f = c._result;
                            if (d) {
                                var g = arguments[d - 1];
                                X(function() {
                                    G(d, e, g, f)
                                })
                            } else C(c, e, a, b);
                            return e
                        },
                        "catch": function(a) {
                            return this.then(null, a)
                        }
                    };
                    var oa = Q,
                        pa = {
                            Promise: na,
                            polyfill: oa
                        };
                    "function" == typeof define && define.amd ? define(function() {
                        return pa
                    }) : "undefined" != typeof b && b.exports ? b.exports = pa : "undefined" != typeof this && (this.ES6Promise = pa), oa()
                }).call(this)
            }).call(this, a("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
        }, {
            _process: 8
        }],
        16: [function(require, module, exports) {
            (function(process, global) {
                ! function() {
                    "use strict";
                    var Faye = {
                        VERSION: "1.1.1",
                        BAYEUX_VERSION: "1.0",
                        ID_LENGTH: 160,
                        JSONP_CALLBACK: "jsonpcallback",
                        CONNECTION_TYPES: ["long-polling", "cross-origin-long-polling", "callback-polling", "websocket", "eventsource", "in-process"],
                        MANDATORY_CONNECTION_TYPES: ["long-polling", "callback-polling", "in-process"],
                        ENV: "undefined" != typeof window ? window : global,
                        extend: function(a, b, c) {
                            if (!b) return a;
                            for (var d in b) b.hasOwnProperty(d) && (a.hasOwnProperty(d) && c === !1 || a[d] !== b[d] && (a[d] = b[d]));
                            return a
                        },
                        random: function(a) {
                            a = a || this.ID_LENGTH;
                            for (var b = Math.ceil(a * Math.log(2) / Math.log(36)), c = csprng(a, 36); c.length < b;) c = "0" + c;
                            return c
                        },
                        validateOptions: function(a, b) {
                            for (var c in a)
                                if (this.indexOf(b, c) < 0) throw new Error("Unrecognized option: " + c)
                        },
                        clientIdFromMessages: function(a) {
                            var b = this.filter([].concat(a), function(a) {
                                return "/meta/connect" === a.channel
                            });
                            return b[0] && b[0].clientId
                        },
                        copyObject: function(a) {
                            var b, c, d;
                            if (a instanceof Array) {
                                for (b = [], c = a.length; c--;) b[c] = Faye.copyObject(a[c]);
                                return b
                            }
                            if ("object" == typeof a) {
                                b = null === a ? null : {};
                                for (d in a) b[d] = Faye.copyObject(a[d]);
                                return b
                            }
                            return a
                        },
                        commonElement: function(a, b) {
                            for (var c = 0, d = a.length; d > c; c++)
                                if (-1 !== this.indexOf(b, a[c])) return a[c];
                            return null
                        },
                        indexOf: function(a, b) {
                            if (a.indexOf) return a.indexOf(b);
                            for (var c = 0, d = a.length; d > c; c++)
                                if (a[c] === b) return c;
                            return -1
                        },
                        map: function(a, b, c) {
                            if (a.map) return a.map(b, c);
                            var d = [];
                            if (a instanceof Array)
                                for (var e = 0, f = a.length; f > e; e++) d.push(b.call(c || null, a[e], e));
                            else
                                for (var g in a) a.hasOwnProperty(g) && d.push(b.call(c || null, g, a[g]));
                            return d
                        },
                        filter: function(a, b, c) {
                            if (a.filter) return a.filter(b, c);
                            for (var d = [], e = 0, f = a.length; f > e; e++) b.call(c || null, a[e], e) && d.push(a[e]);
                            return d
                        },
                        asyncEach: function(a, b, c, d) {
                            var e = a.length,
                                f = -1,
                                g = 0,
                                h = !1,
                                i = function() {
                                    return g -= 1, f += 1, f === e ? c && c.call(d) : void b(a[f], k)
                                },
                                j = function() {
                                    if (!h) {
                                        for (h = !0; g > 0;) i();
                                        h = !1
                                    }
                                },
                                k = function() {
                                    g += 1, j()
                                };
                            k()
                        },
                        toJSON: function(a) {
                            return this.stringify ? this.stringify(a, function(a, b) {
                                return this[a] instanceof Array ? this[a] : b
                            }) : JSON.stringify(a)
                        }
                    };
                    "undefined" != typeof module ? module.exports = Faye : "undefined" != typeof window && (window.Faye = Faye), Faye.Class = function(a, b) {
                            "function" != typeof a && (b = a, a = Object);
                            var c = function() {
                                    return this.initialize ? this.initialize.apply(this, arguments) || this : this
                                },
                                d = function() {};
                            return d.prototype = a.prototype, c.prototype = new d, Faye.extend(c.prototype, b), c
                        },
                        function() {
                            function a(a, b) {
                                if (a.indexOf) return a.indexOf(b);
                                for (var c = 0; c < a.length; c++)
                                    if (b === a[c]) return c;
                                return -1
                            }
                            var b = Faye.EventEmitter = function() {},
                                c = "function" == typeof Array.isArray ? Array.isArray : function(a) {
                                    return "[object Array]" === Object.prototype.toString.call(a)
                                };
                            b.prototype.emit = function(a) {
                                if ("error" === a && (!this._events || !this._events.error || c(this._events.error) && !this._events.error.length)) throw arguments[1] instanceof Error ? arguments[1] : new Error("Uncaught, unspecified 'error' event.");
                                if (!this._events) return !1;
                                var b = this._events[a];
                                if (!b) return !1;
                                if ("function" == typeof b) {
                                    switch (arguments.length) {
                                        case 1:
                                            b.call(this);
                                            break;
                                        case 2:
                                            b.call(this, arguments[1]);
                                            break;
                                        case 3:
                                            b.call(this, arguments[1], arguments[2]);
                                            break;
                                        default:
                                            var d = Array.prototype.slice.call(arguments, 1);
                                            b.apply(this, d)
                                    }
                                    return !0
                                }
                                if (c(b)) {
                                    for (var d = Array.prototype.slice.call(arguments, 1), e = b.slice(), f = 0, g = e.length; g > f; f++) e[f].apply(this, d);
                                    return !0
                                }
                                return !1
                            }, b.prototype.addListener = function(a, b) {
                                if ("function" != typeof b) throw new Error("addListener only takes instances of Function");
                                return this._events || (this._events = {}), this.emit("newListener", a, b), this._events[a] ? c(this._events[a]) ? this._events[a].push(b) : this._events[a] = [this._events[a], b] : this._events[a] = b, this
                            }, b.prototype.on = b.prototype.addListener, b.prototype.once = function(a, b) {
                                var c = this;
                                return c.on(a, function d() {
                                    c.removeListener(a, d), b.apply(this, arguments)
                                }), this
                            }, b.prototype.removeListener = function(b, d) {
                                if ("function" != typeof d) throw new Error("removeListener only takes instances of Function");
                                if (!this._events || !this._events[b]) return this;
                                var e = this._events[b];
                                if (c(e)) {
                                    var f = a(e, d);
                                    if (0 > f) return this;
                                    e.splice(f, 1), 0 == e.length && delete this._events[b]
                                } else this._events[b] === d && delete this._events[b];
                                return this
                            }, b.prototype.removeAllListeners = function(a) {
                                return 0 === arguments.length ? (this._events = {}, this) : (a && this._events && this._events[a] && (this._events[a] = null), this)
                            }, b.prototype.listeners = function(a) {
                                return this._events || (this._events = {}), this._events[a] || (this._events[a] = []), c(this._events[a]) || (this._events[a] = [this._events[a]]), this._events[a]
                            }
                        }(), Faye.Namespace = Faye.Class({
                            initialize: function() {
                                this._used = {}
                            },
                            exists: function(a) {
                                return this._used.hasOwnProperty(a)
                            },
                            generate: function() {
                                for (var a = Faye.random(); this._used.hasOwnProperty(a);) a = Faye.random();
                                return this._used[a] = a
                            },
                            release: function(a) {
                                delete this._used[a]
                            }
                        }),
                        function() {
                            var a, b = setTimeout;
                            a = "function" == typeof setImmediate ? function(a) {
                                setImmediate(a)
                            } : "object" == typeof process && process.nextTick ? function(a) {
                                process.nextTick(a)
                            } : function(a) {
                                b(a, 0)
                            };
                            var c = 0,
                                d = 1,
                                e = 2,
                                f = function(a) {
                                    return a
                                },
                                g = function(a) {
                                    throw a
                                },
                                h = function(a) {
                                    if (this._state = c, this._onFulfilled = [], this._onRejected = [], "function" == typeof a) {
                                        var b = this;
                                        a(function(a) {
                                            m(b, a)
                                        }, function(a) {
                                            o(b, a)
                                        })
                                    }
                                };
                            h.prototype.then = function(a, b) {
                                var c = new h;
                                return i(this, a, c), j(this, b, c), c
                            };
                            var i = function(a, b, e) {
                                    "function" != typeof b && (b = f);
                                    var g = function(a) {
                                        k(b, a, e)
                                    };
                                    a._state === c ? a._onFulfilled.push(g) : a._state === d && g(a._value)
                                },
                                j = function(a, b, d) {
                                    "function" != typeof b && (b = g);
                                    var f = function(a) {
                                        k(b, a, d)
                                    };
                                    a._state === c ? a._onRejected.push(f) : a._state === e && f(a._reason)
                                },
                                k = function(b, c, d) {
                                    a(function() {
                                        l(b, c, d)
                                    })
                                },
                                l = function(a, b, c) {
                                    var d;
                                    try {
                                        d = a(b)
                                    } catch (e) {
                                        return o(c, e)
                                    }
                                    d === c ? o(c, new TypeError("Recursive promise chain detected")) : m(c, d)
                                },
                                m = h.fulfill = h.resolve = function(a, b) {
                                    var c, d, e = !1;
                                    try {
                                        if (c = typeof b, d = null !== b && ("function" === c || "object" === c) && b.then, "function" != typeof d) return n(a, b);
                                        d.call(b, function(b) {
                                            e ^ (e = !0) && m(a, b)
                                        }, function(b) {
                                            e ^ (e = !0) && o(a, b)
                                        })
                                    } catch (f) {
                                        if (!(e ^ (e = !0))) return;
                                        o(a, f)
                                    }
                                },
                                n = function(a, b) {
                                    if (a._state === c) {
                                        a._state = d, a._value = b, a._onRejected = [];
                                        for (var e, f = a._onFulfilled; e = f.shift();) e(b)
                                    }
                                },
                                o = h.reject = function(a, b) {
                                    if (a._state === c) {
                                        a._state = e, a._reason = b, a._onFulfilled = [];
                                        for (var d, f = a._onRejected; d = f.shift();) d(b)
                                    }
                                };
                            h.all = function(a) {
                                return new h(function(b, c) {
                                    var d, e = [],
                                        f = a.length;
                                    if (0 === f) return b(e);
                                    for (d = 0; f > d; d++)(function(a, d) {
                                        h.fulfilled(a).then(function(a) {
                                            e[d] = a, 0 === --f && b(e)
                                        }, c)
                                    })(a[d], d)
                                })
                            }, h.defer = a, h.deferred = h.pending = function() {
                                var a = {};
                                return a.promise = new h(function(b, c) {
                                    a.fulfill = a.resolve = b, a.reject = c
                                }), a
                            }, h.fulfilled = h.resolved = function(a) {
                                return new h(function(b, c) {
                                    b(a)
                                })
                            }, h.rejected = function(a) {
                                return new h(function(b, c) {
                                    c(a)
                                })
                            }, "undefined" == typeof Faye ? module.exports = h : Faye.Promise = h
                        }(), Faye.Set = Faye.Class({
                            initialize: function() {
                                this._index = {}
                            },
                            add: function(a) {
                                var b = void 0 !== a.id ? a.id : a;
                                return this._index.hasOwnProperty(b) ? !1 : (this._index[b] = a, !0)
                            },
                            forEach: function(a, b) {
                                for (var c in this._index) this._index.hasOwnProperty(c) && a.call(b, this._index[c])
                            },
                            isEmpty: function() {
                                for (var a in this._index)
                                    if (this._index.hasOwnProperty(a)) return !1;
                                return !0
                            },
                            member: function(a) {
                                for (var b in this._index)
                                    if (this._index[b] === a) return !0;
                                return !1
                            },
                            remove: function(a) {
                                var b = void 0 !== a.id ? a.id : a,
                                    c = this._index[b];
                                return delete this._index[b], c
                            },
                            toArray: function() {
                                var a = [];
                                return this.forEach(function(b) {
                                    a.push(b)
                                }), a
                            }
                        }), Faye.URI = {
                            isURI: function(a) {
                                return a && a.protocol && a.host && a.path
                            },
                            isSameOrigin: function(a) {
                                var b = Faye.ENV.location;
                                return a.protocol === b.protocol && a.hostname === b.hostname && a.port === b.port
                            },
                            parse: function(a) {
                                if ("string" != typeof a) return a;
                                var b, c, d, e, f, g, h = {},
                                    i = function(b, c) {
                                        a = a.replace(c, function(a) {
                                            return h[b] = a, ""
                                        }), h[b] = h[b] || ""
                                    };
                                for (i("protocol", /^[a-z]+\:/i), i("host", /^\/\/[^\/\?#]+/), /^\//.test(a) || h.host || (a = Faye.ENV.location.pathname.replace(/[^\/]*$/, "") + a), i("pathname", /^[^\?#]*/), i("search", /^\?[^#]*/), i("hash", /^#.*/), h.protocol = h.protocol || Faye.ENV.location.protocol, h.host ? (h.host = h.host.substr(2), b = h.host.split(":"), h.hostname = b[0], h.port = b[1] || "") : (h.host = Faye.ENV.location.host, h.hostname = Faye.ENV.location.hostname, h.port = Faye.ENV.location.port), h.pathname = h.pathname || "/", h.path = h.pathname + h.search, c = h.search.replace(/^\?/, ""), d = c ? c.split("&") : [], g = {}, e = 0, f = d.length; f > e; e++) b = d[e].split("="), g[decodeURIComponent(b[0] || "")] = decodeURIComponent(b[1] || "");
                                return h.query = g, h.href = this.stringify(h), h
                            },
                            stringify: function(a) {
                                var b = a.protocol + "//" + a.hostname;
                                return a.port && (b += ":" + a.port), b += a.pathname + this.queryString(a.query) + (a.hash || "")
                            },
                            queryString: function(a) {
                                var b = [];
                                for (var c in a) a.hasOwnProperty(c) && b.push(encodeURIComponent(c) + "=" + encodeURIComponent(a[c]));
                                return 0 === b.length ? "" : "?" + b.join("&")
                            }
                        }, Faye.Error = Faye.Class({
                            initialize: function(a, b, c) {
                                this.code = a, this.params = Array.prototype.slice.call(b), this.message = c
                            },
                            toString: function() {
                                return this.code + ":" + this.params.join(",") + ":" + this.message
                            }
                        }), Faye.Error.parse = function(a) {
                            if (a = a || "", !Faye.Grammar.ERROR.test(a)) return new this(null, [], a);
                            var b = a.split(":"),
                                c = parseInt(b[0]),
                                d = b[1].split(","),
                                a = b[2];
                            return new this(c, d, a)
                        }, Faye.Error.versionMismatch = function() {
                            return new this(300, arguments, "Version mismatch").toString()
                        }, Faye.Error.conntypeMismatch = function() {
                            return new this(301, arguments, "Connection types not supported").toString()
                        }, Faye.Error.extMismatch = function() {
                            return new this(302, arguments, "Extension mismatch").toString()
                        }, Faye.Error.badRequest = function() {
                            return new this(400, arguments, "Bad request").toString()
                        }, Faye.Error.clientUnknown = function() {
                            return new this(401, arguments, "Unknown client").toString()
                        }, Faye.Error.parameterMissing = function() {
                            return new this(402, arguments, "Missing required parameter").toString()
                        }, Faye.Error.channelForbidden = function() {
                            return new this(403, arguments, "Forbidden channel").toString()
                        }, Faye.Error.channelUnknown = function() {
                            return new this(404, arguments, "Unknown channel").toString()
                        }, Faye.Error.channelInvalid = function() {
                            return new this(405, arguments, "Invalid channel").toString()
                        }, Faye.Error.extUnknown = function() {
                            return new this(406, arguments, "Unknown extension").toString()
                        }, Faye.Error.publishFailed = function() {
                            return new this(407, arguments, "Failed to publish").toString()
                        }, Faye.Error.serverError = function() {
                            return new this(500, arguments, "Internal server error").toString()
                        }, Faye.Deferrable = {
                            then: function(a, b) {
                                var c = this;
                                return this._promise || (this._promise = new Faye.Promise(function(a, b) {
                                    c._fulfill = a, c._reject = b
                                })), 0 === arguments.length ? this._promise : this._promise.then(a, b)
                            },
                            callback: function(a, b) {
                                return this.then(function(c) {
                                    a.call(b, c)
                                })
                            },
                            errback: function(a, b) {
                                return this.then(null, function(c) {
                                    a.call(b, c)
                                })
                            },
                            timeout: function(a, b) {
                                this.then();
                                var c = this;
                                this._timer = Faye.ENV.setTimeout(function() {
                                    c._reject(b)
                                }, 1e3 * a)
                            },
                            setDeferredStatus: function(a, b) {
                                this._timer && Faye.ENV.clearTimeout(this._timer), this.then(), "succeeded" === a ? this._fulfill(b) : "failed" === a ? this._reject(b) : delete this._promise
                            }
                        }, Faye.Publisher = {
                            countListeners: function(a) {
                                return this.listeners(a).length
                            },
                            bind: function(a, b, c) {
                                var d = Array.prototype.slice,
                                    e = function() {
                                        b.apply(c, d.call(arguments))
                                    };
                                return this._listeners = this._listeners || [], this._listeners.push([a, b, c, e]), this.on(a, e)
                            },
                            unbind: function(a, b, c) {
                                this._listeners = this._listeners || [];
                                for (var d, e = this._listeners.length; e--;) d = this._listeners[e], d[0] === a && (!b || d[1] === b && d[2] === c) && (this._listeners.splice(e, 1), this.removeListener(a, d[3]))
                            }
                        }, Faye.extend(Faye.Publisher, Faye.EventEmitter.prototype), Faye.Publisher.trigger = Faye.Publisher.emit, Faye.Timeouts = {
                            addTimeout: function(a, b, c, d) {
                                if (this._timeouts = this._timeouts || {}, !this._timeouts.hasOwnProperty(a)) {
                                    var e = this;
                                    this._timeouts[a] = Faye.ENV.setTimeout(function() {
                                        delete e._timeouts[a], c.call(d)
                                    }, 1e3 * b)
                                }
                            },
                            removeTimeout: function(a) {
                                this._timeouts = this._timeouts || {};
                                var b = this._timeouts[a];
                                b && (Faye.ENV.clearTimeout(b), delete this._timeouts[a])
                            },
                            removeAllTimeouts: function() {
                                this._timeouts = this._timeouts || {};
                                for (var a in this._timeouts) this.removeTimeout(a)
                            }
                        }, Faye.Logging = {
                            LOG_LEVELS: {
                                fatal: 4,
                                error: 3,
                                warn: 2,
                                info: 1,
                                debug: 0
                            },
                            writeLog: function(a, b) {
                                if (Faye.logger) {
                                    var c = Array.prototype.slice.apply(a),
                                        d = "[Faye",
                                        e = this.className,
                                        f = c.shift().replace(/\?/g, function() {
                                            try {
                                                return Faye.toJSON(c.shift())
                                            } catch (a) {
                                                return "[Object]"
                                            }
                                        });
                                    for (var g in Faye) e || "function" == typeof Faye[g] && this instanceof Faye[g] && (e = g);
                                    e && (d += "." + e), d += "] ", "function" == typeof Faye.logger[b] ? Faye.logger[b](d + f) : "function" == typeof Faye.logger && Faye.logger(d + f)
                                }
                            }
                        },
                        function() {
                            for (var a in Faye.Logging.LOG_LEVELS)(function(a) {
                                Faye.Logging[a] = function() {
                                    this.writeLog(arguments, a)
                                }
                            })(a)
                        }(), Faye.Grammar = {
                            CHANNEL_NAME: /^\/(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)))+(\/(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)))+)*$/,
                            CHANNEL_PATTERN: /^(\/(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)))+)*\/\*{1,2}$/,
                            ERROR: /^([0-9][0-9][0-9]:(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)| |\/|\*|\.))*(,(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)| |\/|\*|\.))*)*:(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)| |\/|\*|\.))*|[0-9][0-9][0-9]::(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)| |\/|\*|\.))*)$/,
                            VERSION: /^([0-9])+(\.(([a-z]|[A-Z])|[0-9])(((([a-z]|[A-Z])|[0-9])|\-|\_))*)*$/
                        }, Faye.Extensible = {
                            addExtension: function(a) {
                                this._extensions = this._extensions || [], this._extensions.push(a), a.added && a.added(this)
                            },
                            removeExtension: function(a) {
                                if (this._extensions)
                                    for (var b = this._extensions.length; b--;) this._extensions[b] === a && (this._extensions.splice(b, 1), a.removed && a.removed(this))
                            },
                            pipeThroughExtensions: function(a, b, c, d, e) {
                                if (this.debug("Passing through ? extensions: ?", a, b), !this._extensions) return d.call(e, b);
                                var f = this._extensions.slice(),
                                    g = function(b) {
                                        if (!b) return d.call(e, b);
                                        var h = f.shift();
                                        if (!h) return d.call(e, b);
                                        var i = h[a];
                                        return i ? void(i.length >= 3 ? h[a](b, c, g) : h[a](b, g)) : g(b)
                                    };
                                g(b)
                            }
                        }, Faye.extend(Faye.Extensible, Faye.Logging), Faye.Channel = Faye.Class({
                            initialize: function(a) {
                                this.id = this.name = a
                            },
                            push: function(a) {
                                this.trigger("message", a)
                            },
                            isUnused: function() {
                                return 0 === this.countListeners("message")
                            }
                        }), Faye.extend(Faye.Channel.prototype, Faye.Publisher), Faye.extend(Faye.Channel, {
                            HANDSHAKE: "/meta/handshake",
                            CONNECT: "/meta/connect",
                            SUBSCRIBE: "/meta/subscribe",
                            UNSUBSCRIBE: "/meta/unsubscribe",
                            DISCONNECT: "/meta/disconnect",
                            META: "meta",
                            SERVICE: "service",
                            expand: function(a) {
                                var b = this.parse(a),
                                    c = ["/**", a],
                                    d = b.slice();
                                d[d.length - 1] = "*", c.push(this.unparse(d));
                                for (var e = 1, f = b.length; f > e; e++) d = b.slice(0, e), d.push("**"), c.push(this.unparse(d));
                                return c
                            },
                            isValid: function(a) {
                                return Faye.Grammar.CHANNEL_NAME.test(a) || Faye.Grammar.CHANNEL_PATTERN.test(a)
                            },
                            parse: function(a) {
                                return this.isValid(a) ? a.split("/").slice(1) : null
                            },
                            unparse: function(a) {
                                return "/" + a.join("/")
                            },
                            isMeta: function(a) {
                                var b = this.parse(a);
                                return b ? b[0] === this.META : null
                            },
                            isService: function(a) {
                                var b = this.parse(a);
                                return b ? b[0] === this.SERVICE : null
                            },
                            isSubscribable: function(a) {
                                return this.isValid(a) ? !this.isMeta(a) && !this.isService(a) : null
                            },
                            Set: Faye.Class({
                                initialize: function() {
                                    this._channels = {}
                                },
                                getKeys: function() {
                                    var a = [];
                                    for (var b in this._channels) a.push(b);
                                    return a
                                },
                                remove: function(a) {
                                    delete this._channels[a]
                                },
                                hasSubscription: function(a) {
                                    return this._channels.hasOwnProperty(a)
                                },
                                subscribe: function(a, b, c) {
                                    for (var d, e = 0, f = a.length; f > e; e++) {
                                        d = a[e];
                                        var g = this._channels[d] = this._channels[d] || new Faye.Channel(d);
                                        b && g.bind("message", b, c)
                                    }
                                },
                                unsubscribe: function(a, b, c) {
                                    var d = this._channels[a];
                                    return d ? (d.unbind("message", b, c), d.isUnused() ? (this.remove(a), !0) : !1) : !1
                                },
                                distributeMessage: function(a) {
                                    for (var b = Faye.Channel.expand(a.channel), c = 0, d = b.length; d > c; c++) {
                                        var e = this._channels[b[c]];
                                        e && e.trigger("message", a.data)
                                    }
                                }
                            })
                        }), Faye.Publication = Faye.Class(Faye.Deferrable), Faye.Subscription = Faye.Class({
                            initialize: function(a, b, c, d) {
                                this._client = a, this._channels = b, this._callback = c, this._context = d, this._cancelled = !1
                            },
                            cancel: function() {
                                this._cancelled || (this._client.unsubscribe(this._channels, this._callback, this._context), this._cancelled = !0)
                            },
                            unsubscribe: function() {
                                this.cancel()
                            }
                        }), Faye.extend(Faye.Subscription.prototype, Faye.Deferrable), Faye.Client = Faye.Class({
                            UNCONNECTED: 1,
                            CONNECTING: 2,
                            CONNECTED: 3,
                            DISCONNECTED: 4,
                            HANDSHAKE: "handshake",
                            RETRY: "retry",
                            NONE: "none",
                            CONNECTION_TIMEOUT: 60,
                            DEFAULT_ENDPOINT: "/bayeux",
                            INTERVAL: 0,
                            initialize: function(a, b) {
                                this.info("New client created for ?", a), b = b || {}, Faye.validateOptions(b, ["interval", "timeout", "endpoints", "proxy", "retry", "scheduler", "websocketExtensions", "tls", "ca"]), this._endpoint = a || this.DEFAULT_ENDPOINT, this._channels = new Faye.Channel.Set, this._dispatcher = new Faye.Dispatcher(this, this._endpoint, b), this._messageId = 0, this._state = this.UNCONNECTED, this._responseCallbacks = {}, this._advice = {
                                    reconnect: this.RETRY,
                                    interval: 1e3 * (b.interval || this.INTERVAL),
                                    timeout: 1e3 * (b.timeout || this.CONNECTION_TIMEOUT)
                                }, this._dispatcher.timeout = this._advice.timeout / 1e3, this._dispatcher.bind("message", this._receiveMessage, this), Faye.Event && void 0 !== Faye.ENV.onbeforeunload && Faye.Event.on(Faye.ENV, "beforeunload", function() {
                                    Faye.indexOf(this._dispatcher._disabled, "autodisconnect") < 0 && this.disconnect()
                                }, this)
                            },
                            addWebsocketExtension: function(a) {
                                return this._dispatcher.addWebsocketExtension(a)
                            },
                            disable: function(a) {
                                return this._dispatcher.disable(a)
                            },
                            setHeader: function(a, b) {
                                return this._dispatcher.setHeader(a, b)
                            },
                            handshake: function(a, b) {
                                if (this._advice.reconnect !== this.NONE && this._state === this.UNCONNECTED) {
                                    this._state = this.CONNECTING;
                                    var c = this;
                                    this.info("Initiating handshake with ?", Faye.URI.stringify(this._endpoint)), this._dispatcher.selectTransport(Faye.MANDATORY_CONNECTION_TYPES), this._sendMessage({
                                        channel: Faye.Channel.HANDSHAKE,
                                        version: Faye.BAYEUX_VERSION,
                                        supportedConnectionTypes: this._dispatcher.getConnectionTypes()
                                    }, {}, function(d) {
                                        d.successful ? (this._state = this.CONNECTED, this._dispatcher.clientId = d.clientId, this._dispatcher.selectTransport(d.supportedConnectionTypes), this.info("Handshake successful: ?", this._dispatcher.clientId), this.subscribe(this._channels.getKeys(), !0), a && Faye.Promise.defer(function() {
                                            a.call(b)
                                        })) : (this.info("Handshake unsuccessful"), Faye.ENV.setTimeout(function() {
                                            c.handshake(a, b)
                                        }, 1e3 * this._dispatcher.retry), this._state = this.UNCONNECTED)
                                    }, this)
                                }
                            },
                            connect: function(a, b) {
                                if (this._advice.reconnect !== this.NONE && this._state !== this.DISCONNECTED) {
                                    if (this._state === this.UNCONNECTED) return this.handshake(function() {
                                        this.connect(a, b)
                                    }, this);
                                    this.callback(a, b), this._state === this.CONNECTED && (this.info("Calling deferred actions for ?", this._dispatcher.clientId), this.setDeferredStatus("succeeded"), this.setDeferredStatus("unknown"), this._connectRequest || (this._connectRequest = !0, this.info("Initiating connection for ?", this._dispatcher.clientId), this._sendMessage({
                                        channel: Faye.Channel.CONNECT,
                                        clientId: this._dispatcher.clientId,
                                        connectionType: this._dispatcher.connectionType
                                    }, {}, this._cycleConnection, this)))
                                }
                            },
                            disconnect: function() {
                                if (this._state === this.CONNECTED) {
                                    this._state = this.DISCONNECTED, this.info("Disconnecting ?", this._dispatcher.clientId);
                                    var a = new Faye.Publication;
                                    return this._sendMessage({
                                        channel: Faye.Channel.DISCONNECT,
                                        clientId: this._dispatcher.clientId
                                    }, {}, function(b) {
                                        b.successful ? (this._dispatcher.close(), a.setDeferredStatus("succeeded")) : a.setDeferredStatus("failed", Faye.Error.parse(b.error))
                                    }, this), this.info("Clearing channel listeners for ?", this._dispatcher.clientId), this._channels = new Faye.Channel.Set, a
                                }
                            },
                            subscribe: function(a, b, c) {
                                if (a instanceof Array) return Faye.map(a, function(a) {
                                    return this.subscribe(a, b, c)
                                }, this);
                                var d = new Faye.Subscription(this, a, b, c),
                                    e = b === !0,
                                    f = this._channels.hasSubscription(a);
                                return f && !e ? (this._channels.subscribe([a], b, c), d.setDeferredStatus("succeeded"), d) : (this.connect(function() {
                                    this.info("Client ? attempting to subscribe to ?", this._dispatcher.clientId, a), e || this._channels.subscribe([a], b, c), this._sendMessage({
                                        channel: Faye.Channel.SUBSCRIBE,
                                        clientId: this._dispatcher.clientId,
                                        subscription: a
                                    }, {}, function(e) {
                                        if (!e.successful) return d.setDeferredStatus("failed", Faye.Error.parse(e.error)), this._channels.unsubscribe(a, b, c);
                                        var f = [].concat(e.subscription);
                                        this.info("Subscription acknowledged for ? to ?", this._dispatcher.clientId, f), d.setDeferredStatus("succeeded")
                                    }, this)
                                }, this), d)
                            },
                            unsubscribe: function(a, b, c) {
                                if (a instanceof Array) return Faye.map(a, function(a) {
                                    return this.unsubscribe(a, b, c)
                                }, this);
                                var d = this._channels.unsubscribe(a, b, c);
                                d && this.connect(function() {
                                    this.info("Client ? attempting to unsubscribe from ?", this._dispatcher.clientId, a), this._sendMessage({
                                        channel: Faye.Channel.UNSUBSCRIBE,
                                        clientId: this._dispatcher.clientId,
                                        subscription: a
                                    }, {}, function(a) {
                                        if (a.successful) {
                                            var b = [].concat(a.subscription);
                                            this.info("Unsubscription acknowledged for ? from ?", this._dispatcher.clientId, b)
                                        }
                                    }, this)
                                }, this)
                            },
                            publish: function(a, b, c) {
                                Faye.validateOptions(c || {}, ["attempts", "deadline"]);
                                var d = new Faye.Publication;
                                return this.connect(function() {
                                    this.info("Client ? queueing published message to ?: ?", this._dispatcher.clientId, a, b), this._sendMessage({
                                        channel: a,
                                        data: b,
                                        clientId: this._dispatcher.clientId
                                    }, c, function(a) {
                                        a.successful ? d.setDeferredStatus("succeeded") : d.setDeferredStatus("failed", Faye.Error.parse(a.error))
                                    }, this)
                                }, this), d
                            },
                            _sendMessage: function(a, b, c, d) {
                                a.id = this._generateMessageId();
                                var e = this._advice.timeout ? 1.2 * this._advice.timeout / 1e3 : 1.2 * this._dispatcher.retry;
                                this.pipeThroughExtensions("outgoing", a, null, function(a) {
                                    a && (c && (this._responseCallbacks[a.id] = [c, d]), this._dispatcher.sendMessage(a, e, b || {}))
                                }, this)
                            },
                            _generateMessageId: function() {
                                return this._messageId += 1, this._messageId >= Math.pow(2, 32) && (this._messageId = 0), this._messageId.toString(36)
                            },
                            _receiveMessage: function(a) {
                                var b, c = a.id;
                                void 0 !== a.successful && (b = this._responseCallbacks[c], delete this._responseCallbacks[c]), this.pipeThroughExtensions("incoming", a, null, function(a) {
                                    a && (a.advice && this._handleAdvice(a.advice), this._deliverMessage(a), b && b[0].call(b[1], a))
                                }, this)
                            },
                            _handleAdvice: function(a) {
                                Faye.extend(this._advice, a), this._dispatcher.timeout = this._advice.timeout / 1e3, this._advice.reconnect === this.HANDSHAKE && this._state !== this.DISCONNECTED && (this._state = this.UNCONNECTED, this._dispatcher.clientId = null, this._cycleConnection())
                            },
                            _deliverMessage: function(a) {
                                a.channel && void 0 !== a.data && (this.info("Client ? calling listeners for ? with ?", this._dispatcher.clientId, a.channel, a.data), this._channels.distributeMessage(a))
                            },
                            _cycleConnection: function() {
                                this._connectRequest && (this._connectRequest = null, this.info("Closed connection for ?", this._dispatcher.clientId));
                                var a = this;
                                Faye.ENV.setTimeout(function() {
                                    a.connect()
                                }, this._advice.interval)
                            }
                        }), Faye.extend(Faye.Client.prototype, Faye.Deferrable), Faye.extend(Faye.Client.prototype, Faye.Publisher), Faye.extend(Faye.Client.prototype, Faye.Logging), Faye.extend(Faye.Client.prototype, Faye.Extensible), Faye.Dispatcher = Faye.Class({
                            MAX_REQUEST_SIZE: 2048,
                            DEFAULT_RETRY: 5,
                            UP: 1,
                            DOWN: 2,
                            initialize: function(a, b, c) {
                                this._client = a, this.endpoint = Faye.URI.parse(b), this._alternates = c.endpoints || {}, this.cookies = Faye.Cookies && new Faye.Cookies.CookieJar, this._disabled = [], this._envelopes = {}, this.headers = {}, this.retry = c.retry || this.DEFAULT_RETRY, this._scheduler = c.scheduler || Faye.Scheduler, this._state = 0, this.transports = {}, this.wsExtensions = [], this.proxy = c.proxy || {}, "string" == typeof this._proxy && (this._proxy = {
                                    origin: this._proxy
                                });
                                var d = c.websocketExtensions;
                                if (d) {
                                    d = [].concat(d);
                                    for (var e = 0, f = d.length; f > e; e++) this.addWebsocketExtension(d[e])
                                }
                                this.tls = c.tls || {}, this.tls.ca = this.tls.ca || c.ca;
                                for (var g in this._alternates) this._alternates[g] = Faye.URI.parse(this._alternates[g]);
                                this.maxRequestSize = this.MAX_REQUEST_SIZE
                            },
                            endpointFor: function(a) {
                                return this._alternates[a] || this.endpoint
                            },
                            addWebsocketExtension: function(a) {
                                this.wsExtensions.push(a)
                            },
                            disable: function(a) {
                                this._disabled.push(a)
                            },
                            setHeader: function(a, b) {
                                this.headers[a] = b
                            },
                            close: function() {
                                var a = this._transport;
                                delete this._transport, a && a.close()
                            },
                            getConnectionTypes: function() {
                                return Faye.Transport.getConnectionTypes()
                            },
                            selectTransport: function(a) {
                                Faye.Transport.get(this, a, this._disabled, function(a) {
                                    this.debug("Selected ? transport for ?", a.connectionType, Faye.URI.stringify(a.endpoint)), a !== this._transport && (this._transport && this._transport.close(), this._transport = a, this.connectionType = a.connectionType)
                                }, this)
                            },
                            sendMessage: function(a, b, c) {
                                c = c || {};
                                var d, e = a.id,
                                    f = c.attempts,
                                    g = c.deadline && (new Date).getTime() + 1e3 * c.deadline,
                                    h = this._envelopes[e];
                                h || (d = new this._scheduler(a, {
                                    timeout: b,
                                    interval: this.retry,
                                    attempts: f,
                                    deadline: g
                                }), h = this._envelopes[e] = {
                                    message: a,
                                    scheduler: d
                                }), this._sendEnvelope(h)
                            },
                            _sendEnvelope: function(a) {
                                if (this._transport && !a.request && !a.timer) {
                                    var b = a.message,
                                        c = a.scheduler,
                                        d = this;
                                    if (!c.isDeliverable()) return c.abort(), void delete this._envelopes[b.id];
                                    a.timer = Faye.ENV.setTimeout(function() {
                                        d.handleError(b)
                                    }, 1e3 * c.getTimeout()), c.send(), a.request = this._transport.sendMessage(b)
                                }
                            },
                            handleResponse: function(a) {
                                var b = this._envelopes[a.id];
                                void 0 !== a.successful && b && (b.scheduler.succeed(), delete this._envelopes[a.id], Faye.ENV.clearTimeout(b.timer)), this.trigger("message", a), this._state !== this.UP && (this._state = this.UP, this._client.trigger("transport:up"))
                            },
                            handleError: function(a, b) {
                                var c = this._envelopes[a.id],
                                    d = c && c.request,
                                    e = this;
                                if (d) {
                                    d.then(function(a) {
                                        a && a.abort && a.abort()
                                    });
                                    var f = c.scheduler;
                                    f.fail(), Faye.ENV.clearTimeout(c.timer), c.request = c.timer = null, b ? this._sendEnvelope(c) : c.timer = Faye.ENV.setTimeout(function() {
                                        c.timer = null, e._sendEnvelope(c)
                                    }, 1e3 * f.getInterval()), this._state !== this.DOWN && (this._state = this.DOWN, this._client.trigger("transport:down"))
                                }
                            }
                        }), Faye.extend(Faye.Dispatcher.prototype, Faye.Publisher), Faye.extend(Faye.Dispatcher.prototype, Faye.Logging), Faye.Scheduler = function(a, b) {
                            this.message = a, this.options = b, this.attempts = 0
                        }, Faye.extend(Faye.Scheduler.prototype, {
                            getTimeout: function() {
                                return this.options.timeout
                            },
                            getInterval: function() {
                                return this.options.interval
                            },
                            isDeliverable: function() {
                                var a = this.options.attempts,
                                    b = this.attempts,
                                    c = this.options.deadline,
                                    d = (new Date).getTime();
                                return void 0 !== a && b >= a ? !1 : void 0 !== c && d > c ? !1 : !0
                            },
                            send: function() {
                                this.attempts += 1
                            },
                            succeed: function() {},
                            fail: function() {},
                            abort: function() {}
                        }), Faye.Transport = Faye.extend(Faye.Class({
                            DEFAULT_PORTS: {
                                "http:": 80,
                                "https:": 443,
                                "ws:": 80,
                                "wss:": 443
                            },
                            SECURE_PROTOCOLS: ["https:", "wss:"],
                            MAX_DELAY: 0,
                            batching: !0,
                            initialize: function(a, b) {
                                this._dispatcher = a, this.endpoint = b, this._outbox = [], this._proxy = Faye.extend({}, this._dispatcher.proxy), !this._proxy.origin && Faye.NodeAdapter && (this._proxy.origin = Faye.indexOf(this.SECURE_PROTOCOLS, this.endpoint.protocol) >= 0 ? process.env.HTTPS_PROXY || process.env.https_proxy : process.env.HTTP_PROXY || process.env.http_proxy)
                            },
                            close: function() {},
                            encode: function(a) {
                                return ""
                            },
                            sendMessage: function(a) {
                                return this.debug("Client ? sending message to ?: ?", this._dispatcher.clientId, Faye.URI.stringify(this.endpoint), a), this.batching ? (this._outbox.push(a), this._flushLargeBatch(), this._promise = this._promise || new Faye.Promise, a.channel === Faye.Channel.HANDSHAKE ? (this.addTimeout("publish", .01, this._flush, this), this._promise) : (a.channel === Faye.Channel.CONNECT && (this._connectMessage = a), this.addTimeout("publish", this.MAX_DELAY, this._flush, this), this._promise)) : Faye.Promise.fulfilled(this.request([a]))
                            },
                            _flush: function() {
                                this.removeTimeout("publish"), this._outbox.length > 1 && this._connectMessage && (this._connectMessage.advice = {
                                    timeout: 0
                                }), Faye.Promise.fulfill(this._promise, this.request(this._outbox)), delete this._promise, this._connectMessage = null, this._outbox = []
                            },
                            _flushLargeBatch: function() {
                                var a = this.encode(this._outbox);
                                if (!(a.length < this._dispatcher.maxRequestSize)) {
                                    var b = this._outbox.pop();
                                    this._flush(), b && this._outbox.push(b)
                                }
                            },
                            _receive: function(a) {
                                if (a) {
                                    a = [].concat(a), this.debug("Client ? received from ? via ?: ?", this._dispatcher.clientId, Faye.URI.stringify(this.endpoint), this.connectionType, a);
                                    for (var b = 0, c = a.length; c > b; b++) this._dispatcher.handleResponse(a[b])
                                }
                            },
                            _handleError: function(a, b) {
                                a = [].concat(a), this.debug("Client ? failed to send to ? via ?: ?", this._dispatcher.clientId, Faye.URI.stringify(this.endpoint), this.connectionType, a);
                                for (var c = 0, d = a.length; d > c; c++) this._dispatcher.handleError(a[c])
                            },
                            _getCookies: function() {
                                var a = this._dispatcher.cookies,
                                    b = Faye.URI.stringify(this.endpoint);
                                return a ? Faye.map(a.getCookiesSync(b), function(a) {
                                    return a.cookieString()
                                }).join("; ") : ""
                            },
                            _storeCookies: function(a) {
                                var b, c = this._dispatcher.cookies,
                                    d = Faye.URI.stringify(this.endpoint);
                                if (a && c) {
                                    a = [].concat(a);
                                    for (var e = 0, f = a.length; f > e; e++) b = Faye.Cookies.Cookie.parse(a[e]), c.setCookieSync(b, d)
                                }
                            }
                        }), {
                            get: function(a, b, c, d, e) {
                                var f = a.endpoint;
                                Faye.asyncEach(this._transports, function(f, g) {
                                    var h = f[0],
                                        i = f[1],
                                        j = a.endpointFor(h);
                                    return Faye.indexOf(c, h) >= 0 ? g() : Faye.indexOf(b, h) < 0 ? (i.isUsable(a, j, function() {}), g()) : void i.isUsable(a, j, function(b) {
                                        if (!b) return g();
                                        var c = i.hasOwnProperty("create") ? i.create(a, j) : new i(a, j);
                                        d.call(e, c)
                                    })
                                }, function() {
                                    throw new Error("Could not find a usable connection type for " + Faye.URI.stringify(f))
                                })
                            },
                            register: function(a, b) {
                                this._transports.push([a, b]), b.prototype.connectionType = a
                            },
                            getConnectionTypes: function() {
                                return Faye.map(this._transports, function(a) {
                                    return a[0]
                                })
                            },
                            _transports: []
                        }), Faye.extend(Faye.Transport.prototype, Faye.Logging), Faye.extend(Faye.Transport.prototype, Faye.Timeouts), Faye.Event = {
                            _registry: [],
                            on: function(a, b, c, d) {
                                var e = function() {
                                    c.call(d)
                                };
                                a.addEventListener ? a.addEventListener(b, e, !1) : a.attachEvent("on" + b, e), this._registry.push({
                                    _element: a,
                                    _type: b,
                                    _callback: c,
                                    _context: d,
                                    _handler: e
                                })
                            },
                            detach: function(a, b, c, d) {
                                for (var e, f = this._registry.length; f--;) e = this._registry[f], a && a !== e._element || b && b !== e._type || c && c !== e._callback || d && d !== e._context || (e._element.removeEventListener ? e._element.removeEventListener(e._type, e._handler, !1) : e._element.detachEvent("on" + e._type, e._handler), this._registry.splice(f, 1), e = null)
                            }
                        }, void 0 !== Faye.ENV.onunload && Faye.Event.on(Faye.ENV, "unload", Faye.Event.detach, Faye.Event), "object" != typeof JSON && (JSON = {}),
                        function() {
                            function f(a) {
                                return 10 > a ? "0" + a : a
                            }

                            function quote(a) {
                                return escapable.lastIndex = 0, escapable.test(a) ? '"' + a.replace(escapable, function(a) {
                                    var b = meta[a];
                                    return "string" == typeof b ? b : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
                                }) + '"' : '"' + a + '"'
                            }

                            function str(a, b) {
                                var c, d, e, f, g, h = gap,
                                    i = b[a];
                                switch (i && "object" == typeof i && "function" == typeof i.toJSON && (i = i.toJSON(a)), "function" == typeof rep && (i = rep.call(b, a, i)), typeof i) {
                                    case "string":
                                        return quote(i);
                                    case "number":
                                        return isFinite(i) ? String(i) : "null";
                                    case "boolean":
                                    case "null":
                                        return String(i);
                                    case "object":
                                        if (!i) return "null";
                                        if (gap += indent, g = [], "[object Array]" === Object.prototype.toString.apply(i)) {
                                            for (f = i.length, c = 0; f > c; c += 1) g[c] = str(c, i) || "null";
                                            return e = 0 === g.length ? "[]" : gap ? "[\n" + gap + g.join(",\n" + gap) + "\n" + h + "]" : "[" + g.join(",") + "]", gap = h, e
                                        }
                                        if (rep && "object" == typeof rep)
                                            for (f = rep.length, c = 0; f > c; c += 1) "string" == typeof rep[c] && (d = rep[c], e = str(d, i), e && g.push(quote(d) + (gap ? ": " : ":") + e));
                                        else
                                            for (d in i) Object.prototype.hasOwnProperty.call(i, d) && (e = str(d, i), e && g.push(quote(d) + (gap ? ": " : ":") + e));
                                        return e = 0 === g.length ? "{}" : gap ? "{\n" + gap + g.join(",\n" + gap) + "\n" + h + "}" : "{" + g.join(",") + "}", gap = h, e
                                }
                            }
                            "function" != typeof Date.prototype.toJSON && (Date.prototype.toJSON = function() {
                                return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null
                            }, String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function() {
                                return this.valueOf()
                            });
                            var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
                                escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
                                gap, indent, meta = {
                                    "\b": "\\b",
                                    "	": "\\t",
                                    "\n": "\\n",
                                    "\f": "\\f",
                                    "\r": "\\r",
                                    '"': '\\"',
                                    "\\": "\\\\"
                                },
                                rep;
                            Faye.stringify = function(a, b, c) {
                                var d;
                                if (gap = "", indent = "", "number" == typeof c)
                                    for (d = 0; c > d; d += 1) indent += " ";
                                else "string" == typeof c && (indent = c);
                                if (rep = b, b && "function" != typeof b && ("object" != typeof b || "number" != typeof b.length)) throw new Error("JSON.stringify");
                                return str("", {
                                    "": a
                                })
                            }, "function" != typeof JSON.stringify && (JSON.stringify = Faye.stringify), "function" != typeof JSON.parse && (JSON.parse = function(text, reviver) {
                                function walk(a, b) {
                                    var c, d, e = a[b];
                                    if (e && "object" == typeof e)
                                        for (c in e) Object.prototype.hasOwnProperty.call(e, c) && (d = walk(e, c), void 0 !== d ? e[c] = d : delete e[c]);
                                    return reviver.call(a, b, e)
                                }
                                var j;
                                if (text = String(text), cx.lastIndex = 0, cx.test(text) && (text = text.replace(cx, function(a) {
                                        return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
                                    })), /^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) return j = eval("(" + text + ")"), "function" == typeof reviver ? walk({
                                    "": j
                                }, "") : j;
                                throw new SyntaxError("JSON.parse")
                            })
                        }(), Faye.Transport.WebSocket = Faye.extend(Faye.Class(Faye.Transport, {
                            UNCONNECTED: 1,
                            CONNECTING: 2,
                            CONNECTED: 3,
                            batching: !1,
                            isUsable: function(a, b) {
                                this.callback(function() {
                                    a.call(b, !0)
                                }), this.errback(function() {
                                    a.call(b, !1)
                                }), this.connect()
                            },
                            request: function(a) {
                                this._pending = this._pending || new Faye.Set;
                                for (var b = 0, c = a.length; c > b; b++) this._pending.add(a[b]);
                                var d = new Faye.Promise;
                                return this.callback(function(b) {
                                    b && (b.send(Faye.toJSON(a)), Faye.Promise.fulfill(d, b))
                                }, this), this.connect(), {
                                    abort: function() {
                                        d.then(function(a) {
                                            a.close()
                                        })
                                    }
                                }
                            },
                            connect: function() {
                                if (!Faye.Transport.WebSocket._unloaded && (this._state = this._state || this.UNCONNECTED, this._state === this.UNCONNECTED)) {
                                    this._state = this.CONNECTING;
                                    var a = this._createSocket();
                                    if (!a) return this.setDeferredStatus("failed");
                                    var b = this;
                                    a.onopen = function() {
                                        a.headers && b._storeCookies(a.headers["set-cookie"]), b._socket = a, b._state = b.CONNECTED, b._everConnected = !0, b._ping(), b.setDeferredStatus("succeeded", a)
                                    };
                                    var c = !1;
                                    a.onclose = a.onerror = function() {
                                        if (!c) {
                                            c = !0;
                                            var d = b._state === b.CONNECTED;
                                            a.onopen = a.onclose = a.onerror = a.onmessage = null, delete b._socket, b._state = b.UNCONNECTED, b.removeTimeout("ping"), b.setDeferredStatus("unknown");
                                            var e = b._pending ? b._pending.toArray() : [];
                                            delete b._pending, d ? b._handleError(e, !0) : b._everConnected ? b._handleError(e) : b.setDeferredStatus("failed")
                                        }
                                    }, a.onmessage = function(a) {
                                        var c = JSON.parse(a.data);
                                        if (c) {
                                            c = [].concat(c);
                                            for (var d = 0, e = c.length; e > d; d++) void 0 !== c[d].successful && b._pending.remove(c[d]);
                                            b._receive(c)
                                        }
                                    }
                                }
                            },
                            close: function() {
                                this._socket && this._socket.close()
                            },
                            _createSocket: function() {
                                var a = Faye.Transport.WebSocket.getSocketUrl(this.endpoint),
                                    b = this._dispatcher.headers,
                                    c = this._dispatcher.wsExtensions,
                                    d = this._getCookies(),
                                    e = this._dispatcher.tls,
                                    f = {
                                        extensions: c,
                                        headers: b,
                                        proxy: this._proxy,
                                        tls: e
                                    };
                                return "" !== d && (f.headers.Cookie = d), Faye.WebSocket ? new Faye.WebSocket.Client(a, [], f) : Faye.ENV.MozWebSocket ? new MozWebSocket(a) : Faye.ENV.WebSocket ? new WebSocket(a) : void 0
                            },
                            _ping: function() {
                                this._socket && (this._socket.send("[]"), this.addTimeout("ping", this._dispatcher.timeout / 2, this._ping, this))
                            }
                        }), {
                            PROTOCOLS: {
                                "http:": "ws:",
                                "https:": "wss:"
                            },
                            create: function(a, b) {
                                var c = a.transports.websocket = a.transports.websocket || {};
                                return c[b.href] = c[b.href] || new this(a, b), c[b.href]
                            },
                            getSocketUrl: function(a) {
                                return a = Faye.copyObject(a), a.protocol = this.PROTOCOLS[a.protocol], Faye.URI.stringify(a)
                            },
                            isUsable: function(a, b, c, d) {
                                this.create(a, b).isUsable(c, d)
                            }
                        }), Faye.extend(Faye.Transport.WebSocket.prototype, Faye.Deferrable), Faye.Transport.register("websocket", Faye.Transport.WebSocket), Faye.Event && void 0 !== Faye.ENV.onbeforeunload && Faye.Event.on(Faye.ENV, "beforeunload", function() {
                            Faye.Transport.WebSocket._unloaded = !0
                        }), Faye.Transport.EventSource = Faye.extend(Faye.Class(Faye.Transport, {
                            initialize: function(a, b) {
                                if (Faye.Transport.prototype.initialize.call(this, a, b), !Faye.ENV.EventSource) return this.setDeferredStatus("failed");
                                this._xhr = new Faye.Transport.XHR(a, b), b = Faye.copyObject(b), b.pathname += "/" + a.clientId;
                                var c = new EventSource(Faye.URI.stringify(b)),
                                    d = this;
                                c.onopen = function() {
                                    d._everConnected = !0, d.setDeferredStatus("succeeded")
                                }, c.onerror = function() {
                                    d._everConnected ? d._handleError([]) : (d.setDeferredStatus("failed"), c.close())
                                }, c.onmessage = function(a) {
                                    d._receive(JSON.parse(a.data))
                                }, this._socket = c
                            },
                            close: function() {
                                this._socket && (this._socket.onopen = this._socket.onerror = this._socket.onmessage = null, this._socket.close(), delete this._socket)
                            },
                            isUsable: function(a, b) {
                                this.callback(function() {
                                    a.call(b, !0)
                                }), this.errback(function() {
                                    a.call(b, !1)
                                })
                            },
                            encode: function(a) {
                                return this._xhr.encode(a)
                            },
                            request: function(a) {
                                return this._xhr.request(a)
                            }
                        }), {
                            isUsable: function(a, b, c, d) {
                                var e = a.clientId;
                                return e ? void Faye.Transport.XHR.isUsable(a, b, function(e) {
                                    return e ? void this.create(a, b).isUsable(c, d) : c.call(d, !1)
                                }, this) : c.call(d, !1)
                            },
                            create: function(a, b) {
                                var c = a.transports.eventsource = a.transports.eventsource || {},
                                    d = a.clientId,
                                    e = Faye.copyObject(b);
                                return e.pathname += "/" + (d || ""), e = Faye.URI.stringify(e), c[e] = c[e] || new this(a, b), c[e]
                            }
                        }), Faye.extend(Faye.Transport.EventSource.prototype, Faye.Deferrable), Faye.Transport.register("eventsource", Faye.Transport.EventSource), Faye.Transport.XHR = Faye.extend(Faye.Class(Faye.Transport, {
                            encode: function(a) {
                                return Faye.toJSON(a)
                            },
                            request: function(a) {
                                var b = this.endpoint.href,
                                    c = Faye.ENV.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest,
                                    d = this;
                                c.open("POST", b, !0), c.setRequestHeader("Content-Type", "application/json"), c.setRequestHeader("Pragma", "no-cache"), c.setRequestHeader("X-Requested-With", "XMLHttpRequest");
                                var e = this._dispatcher.headers;
                                for (var f in e) e.hasOwnProperty(f) && c.setRequestHeader(f, e[f]);
                                var g = function() {
                                    c.abort()
                                };
                                return void 0 !== Faye.ENV.onbeforeunload && Faye.Event.on(Faye.ENV, "beforeunload", g), c.onreadystatechange = function() {
                                    if (c && 4 === c.readyState) {
                                        var b = null,
                                            e = c.status,
                                            f = c.responseText,
                                            h = e >= 200 && 300 > e || 304 === e || 1223 === e;
                                        if (void 0 !== Faye.ENV.onbeforeunload && Faye.Event.detach(Faye.ENV, "beforeunload", g), c.onreadystatechange = function() {}, c = null, !h) return d._handleError(a);
                                        try {
                                            b = JSON.parse(f)
                                        } catch (i) {}
                                        b ? d._receive(b) : d._handleError(a)
                                    }
                                }, c.send(this.encode(a)), c
                            }
                        }), {
                            isUsable: function(a, b, c, d) {
                                c.call(d, Faye.URI.isSameOrigin(b))
                            }
                        }), Faye.Transport.register("long-polling", Faye.Transport.XHR), Faye.Transport.CORS = Faye.extend(Faye.Class(Faye.Transport, {
                            encode: function(a) {
                                return "message=" + encodeURIComponent(Faye.toJSON(a))
                            },
                            request: function(a) {
                                var b, c = Faye.ENV.XDomainRequest ? XDomainRequest : XMLHttpRequest,
                                    d = new c,
                                    e = this._dispatcher.headers,
                                    f = this;
                                if (d.open("POST", Faye.URI.stringify(this.endpoint), !0), d.setRequestHeader) {
                                    d.setRequestHeader("Pragma", "no-cache");
                                    for (b in e) e.hasOwnProperty(b) && d.setRequestHeader(b, e[b])
                                }
                                var g = function() {
                                    return d ? (d.onload = d.onerror = d.ontimeout = d.onprogress = null, void(d = null)) : !1
                                };
                                return d.onload = function() {
                                    var b = null;
                                    try {
                                        b = JSON.parse(d.responseText)
                                    } catch (c) {}
                                    g(), b ? f._receive(b) : f._handleError(a)
                                }, d.onerror = d.ontimeout = function() {
                                    g(), f._handleError(a)
                                }, d.onprogress = function() {}, d.send(this.encode(a)), d
                            }
                        }), {
                            isUsable: function(a, b, c, d) {
                                if (Faye.URI.isSameOrigin(b)) return c.call(d, !1);
                                if (Faye.ENV.XDomainRequest) return c.call(d, b.protocol === Faye.ENV.location.protocol);
                                if (Faye.ENV.XMLHttpRequest) {
                                    var e = new Faye.ENV.XMLHttpRequest;
                                    return c.call(d, void 0 !== e.withCredentials)
                                }
                                return c.call(d, !1)
                            }
                        }), Faye.Transport.register("cross-origin-long-polling", Faye.Transport.CORS), Faye.Transport.JSONP = Faye.extend(Faye.Class(Faye.Transport, {
                            encode: function(a) {
                                var b = Faye.copyObject(this.endpoint);
                                return b.query.message = Faye.toJSON(a), b.query.jsonp = "__jsonp" + Faye.Transport.JSONP._cbCount + "__", Faye.URI.stringify(b)
                            },
                            request: function(a) {
                                var b = document.getElementsByTagName("head")[0],
                                    c = document.createElement("script"),
                                    d = Faye.Transport.JSONP.getCallbackName(),
                                    e = Faye.copyObject(this.endpoint),
                                    f = this;
                                e.query.message = Faye.toJSON(a), e.query.jsonp = d;
                                var g = function() {
                                    if (!Faye.ENV[d]) return !1;
                                    Faye.ENV[d] = void 0;
                                    try {
                                        delete Faye.ENV[d]
                                    } catch (a) {}
                                    c.parentNode.removeChild(c)
                                };
                                return Faye.ENV[d] = function(a) {
                                    g(), f._receive(a)
                                }, c.type = "text/javascript", c.src = Faye.URI.stringify(e), b.appendChild(c), c.onerror = function() {
                                    g(), f._handleError(a)
                                }, {
                                    abort: g
                                }
                            }
                        }), {
                            _cbCount: 0,
                            getCallbackName: function() {
                                return this._cbCount += 1, "__jsonp" + this._cbCount + "__"
                            },
                            isUsable: function(a, b, c, d) {
                                c.call(d, !0)
                            }
                        }), Faye.Transport.register("callback-polling", Faye.Transport.JSONP)
                }()
            }).call(this, require("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
        }, {
            _process: 8
        }],
        17: [function(a, b, c) {
            ! function(a, c) {
                "object" == typeof b && "object" == typeof b.exports ? b.exports = a.document ? c(a, !0) : function(a) {
                    if (!a.document) throw new Error("jQuery requires a window with a document");
                    return c(a)
                } : c(a)
            }("undefined" != typeof window ? window : this, function(a, b) {
                function c(a) {
                    var b = "length" in a && a.length,
                        c = ea.type(a);
                    return "function" === c || ea.isWindow(a) ? !1 : 1 === a.nodeType && b ? !0 : "array" === c || 0 === b || "number" == typeof b && b > 0 && b - 1 in a
                }

                function d(a, b, c) {
                    if (ea.isFunction(b)) return ea.grep(a, function(a, d) {
                        return !!b.call(a, d, a) !== c
                    });
                    if (b.nodeType) return ea.grep(a, function(a) {
                        return a === b !== c
                    });
                    if ("string" == typeof b) {
                        if (ma.test(b)) return ea.filter(b, a, c);
                        b = ea.filter(b, a)
                    }
                    return ea.grep(a, function(a) {
                        return ea.inArray(a, b) >= 0 !== c
                    })
                }

                function e(a, b) {
                    do a = a[b]; while (a && 1 !== a.nodeType);
                    return a
                }

                function f(a) {
                    var b = ua[a] = {};
                    return ea.each(a.match(ta) || [], function(a, c) {
                        b[c] = !0
                    }), b
                }

                function g() {
                    oa.addEventListener ? (oa.removeEventListener("DOMContentLoaded", h, !1), a.removeEventListener("load", h, !1)) : (oa.detachEvent("onreadystatechange", h), a.detachEvent("onload", h))
                }

                function h() {
                    (oa.addEventListener || "load" === event.type || "complete" === oa.readyState) && (g(), ea.ready())
                }

                function i(a, b, c) {
                    if (void 0 === c && 1 === a.nodeType) {
                        var d = "data-" + b.replace(za, "-$1").toLowerCase();
                        if (c = a.getAttribute(d), "string" == typeof c) {
                            try {
                                c = "true" === c ? !0 : "false" === c ? !1 : "null" === c ? null : +c + "" === c ? +c : ya.test(c) ? ea.parseJSON(c) : c
                            } catch (e) {}
                            ea.data(a, b, c)
                        } else c = void 0
                    }
                    return c
                }

                function j(a) {
                    var b;
                    for (b in a)
                        if (("data" !== b || !ea.isEmptyObject(a[b])) && "toJSON" !== b) return !1;
                    return !0
                }

                function k(a, b, c, d) {
                    if (ea.acceptData(a)) {
                        var e, f, g = ea.expando,
                            h = a.nodeType,
                            i = h ? ea.cache : a,
                            j = h ? a[g] : a[g] && g;
                        if (j && i[j] && (d || i[j].data) || void 0 !== c || "string" != typeof b) return j || (j = h ? a[g] = W.pop() || ea.guid++ : g), i[j] || (i[j] = h ? {} : {
                            toJSON: ea.noop
                        }), ("object" == typeof b || "function" == typeof b) && (d ? i[j] = ea.extend(i[j], b) : i[j].data = ea.extend(i[j].data, b)), f = i[j], d || (f.data || (f.data = {}), f = f.data), void 0 !== c && (f[ea.camelCase(b)] = c), "string" == typeof b ? (e = f[b], null == e && (e = f[ea.camelCase(b)])) : e = f, e
                    }
                }

                function l(a, b, c) {
                    if (ea.acceptData(a)) {
                        var d, e, f = a.nodeType,
                            g = f ? ea.cache : a,
                            h = f ? a[ea.expando] : ea.expando;
                        if (g[h]) {
                            if (b && (d = c ? g[h] : g[h].data)) {
                                ea.isArray(b) ? b = b.concat(ea.map(b, ea.camelCase)) : b in d ? b = [b] : (b = ea.camelCase(b), b = b in d ? [b] : b.split(" ")), e = b.length;
                                for (; e--;) delete d[b[e]];
                                if (c ? !j(d) : !ea.isEmptyObject(d)) return
                            }(c || (delete g[h].data, j(g[h]))) && (f ? ea.cleanData([a], !0) : ca.deleteExpando || g != g.window ? delete g[h] : g[h] = null)
                        }
                    }
                }

                function m() {
                    return !0
                }

                function n() {
                    return !1
                }

                function o() {
                    try {
                        return oa.activeElement
                    } catch (a) {}
                }

                function p(a) {
                    var b = Ka.split("|"),
                        c = a.createDocumentFragment();
                    if (c.createElement)
                        for (; b.length;) c.createElement(b.pop());
                    return c
                }

                function q(a, b) {
                    var c, d, e = 0,
                        f = typeof a.getElementsByTagName !== xa ? a.getElementsByTagName(b || "*") : typeof a.querySelectorAll !== xa ? a.querySelectorAll(b || "*") : void 0;
                    if (!f)
                        for (f = [], c = a.childNodes || a; null != (d = c[e]); e++) !b || ea.nodeName(d, b) ? f.push(d) : ea.merge(f, q(d, b));
                    return void 0 === b || b && ea.nodeName(a, b) ? ea.merge([a], f) : f
                }

                function r(a) {
                    Ea.test(a.type) && (a.defaultChecked = a.checked)
                }

                function s(a, b) {
                    return ea.nodeName(a, "table") && ea.nodeName(11 !== b.nodeType ? b : b.firstChild, "tr") ? a.getElementsByTagName("tbody")[0] || a.appendChild(a.ownerDocument.createElement("tbody")) : a
                }

                function t(a) {
                    return a.type = (null !== ea.find.attr(a, "type")) + "/" + a.type, a
                }

                function u(a) {
                    var b = Va.exec(a.type);
                    return b ? a.type = b[1] : a.removeAttribute("type"), a
                }

                function v(a, b) {
                    for (var c, d = 0; null != (c = a[d]); d++) ea._data(c, "globalEval", !b || ea._data(b[d], "globalEval"))
                }

                function w(a, b) {
                    if (1 === b.nodeType && ea.hasData(a)) {
                        var c, d, e, f = ea._data(a),
                            g = ea._data(b, f),
                            h = f.events;
                        if (h) {
                            delete g.handle, g.events = {};
                            for (c in h)
                                for (d = 0, e = h[c].length; e > d; d++) ea.event.add(b, c, h[c][d])
                        }
                        g.data && (g.data = ea.extend({}, g.data))
                    }
                }

                function x(a, b) {
                    var c, d, e;
                    if (1 === b.nodeType) {
                        if (c = b.nodeName.toLowerCase(), !ca.noCloneEvent && b[ea.expando]) {
                            e = ea._data(b);
                            for (d in e.events) ea.removeEvent(b, d, e.handle);
                            b.removeAttribute(ea.expando)
                        }
                        "script" === c && b.text !== a.text ? (t(b).text = a.text, u(b)) : "object" === c ? (b.parentNode && (b.outerHTML = a.outerHTML), ca.html5Clone && a.innerHTML && !ea.trim(b.innerHTML) && (b.innerHTML = a.innerHTML)) : "input" === c && Ea.test(a.type) ? (b.defaultChecked = b.checked = a.checked, b.value !== a.value && (b.value = a.value)) : "option" === c ? b.defaultSelected = b.selected = a.defaultSelected : ("input" === c || "textarea" === c) && (b.defaultValue = a.defaultValue)
                    }
                }

                function y(b, c) {
                    var d, e = ea(c.createElement(b)).appendTo(c.body),
                        f = a.getDefaultComputedStyle && (d = a.getDefaultComputedStyle(e[0])) ? d.display : ea.css(e[0], "display");
                    return e.detach(), f
                }

                function z(a) {
                    var b = oa,
                        c = _a[a];
                    return c || (c = y(a, b), "none" !== c && c || ($a = ($a || ea("<iframe frameborder='0' width='0' height='0'/>")).appendTo(b.documentElement), b = ($a[0].contentWindow || $a[0].contentDocument).document, b.write(), b.close(), c = y(a, b), $a.detach()), _a[a] = c), c
                }

                function A(a, b) {
                    return {
                        get: function() {
                            var c = a();
                            if (null != c) return c ? void delete this.get : (this.get = b).apply(this, arguments)
                        }
                    }
                }

                function B(a, b) {
                    if (b in a) return b;
                    for (var c = b.charAt(0).toUpperCase() + b.slice(1), d = b, e = mb.length; e--;)
                        if (b = mb[e] + c, b in a) return b;
                    return d
                }

                function C(a, b) {
                    for (var c, d, e, f = [], g = 0, h = a.length; h > g; g++) d = a[g], d.style && (f[g] = ea._data(d, "olddisplay"), c = d.style.display, b ? (f[g] || "none" !== c || (d.style.display = ""), "" === d.style.display && Ca(d) && (f[g] = ea._data(d, "olddisplay", z(d.nodeName)))) : (e = Ca(d), (c && "none" !== c || !e) && ea._data(d, "olddisplay", e ? c : ea.css(d, "display"))));
                    for (g = 0; h > g; g++) d = a[g], d.style && (b && "none" !== d.style.display && "" !== d.style.display || (d.style.display = b ? f[g] || "" : "none"));
                    return a
                }

                function D(a, b, c) {
                    var d = ib.exec(b);
                    return d ? Math.max(0, d[1] - (c || 0)) + (d[2] || "px") : b
                }

                function E(a, b, c, d, e) {
                    for (var f = c === (d ? "border" : "content") ? 4 : "width" === b ? 1 : 0, g = 0; 4 > f; f += 2) "margin" === c && (g += ea.css(a, c + Ba[f], !0, e)), d ? ("content" === c && (g -= ea.css(a, "padding" + Ba[f], !0, e)), "margin" !== c && (g -= ea.css(a, "border" + Ba[f] + "Width", !0, e))) : (g += ea.css(a, "padding" + Ba[f], !0, e), "padding" !== c && (g += ea.css(a, "border" + Ba[f] + "Width", !0, e)));
                    return g
                }

                function F(a, b, c) {
                    var d = !0,
                        e = "width" === b ? a.offsetWidth : a.offsetHeight,
                        f = ab(a),
                        g = ca.boxSizing && "border-box" === ea.css(a, "boxSizing", !1, f);
                    if (0 >= e || null == e) {
                        if (e = bb(a, b, f), (0 > e || null == e) && (e = a.style[b]), db.test(e)) return e;
                        d = g && (ca.boxSizingReliable() || e === a.style[b]), e = parseFloat(e) || 0
                    }
                    return e + E(a, b, c || (g ? "border" : "content"), d, f) + "px"
                }

                function G(a, b, c, d, e) {
                    return new G.prototype.init(a, b, c, d, e)
                }

                function H() {
                    return setTimeout(function() {
                        nb = void 0
                    }), nb = ea.now()
                }

                function I(a, b) {
                    var c, d = {
                            height: a
                        },
                        e = 0;
                    for (b = b ? 1 : 0; 4 > e; e += 2 - b) c = Ba[e], d["margin" + c] = d["padding" + c] = a;
                    return b && (d.opacity = d.width = a), d
                }

                function J(a, b, c) {
                    for (var d, e = (tb[b] || []).concat(tb["*"]), f = 0, g = e.length; g > f; f++)
                        if (d = e[f].call(c, b, a)) return d
                }

                function K(a, b, c) {
                    var d, e, f, g, h, i, j, k, l = this,
                        m = {},
                        n = a.style,
                        o = a.nodeType && Ca(a),
                        p = ea._data(a, "fxshow");
                    c.queue || (h = ea._queueHooks(a, "fx"), null == h.unqueued && (h.unqueued = 0, i = h.empty.fire, h.empty.fire = function() {
                        h.unqueued || i()
                    }), h.unqueued++, l.always(function() {
                        l.always(function() {
                            h.unqueued--, ea.queue(a, "fx").length || h.empty.fire()
                        })
                    })), 1 === a.nodeType && ("height" in b || "width" in b) && (c.overflow = [n.overflow, n.overflowX, n.overflowY], j = ea.css(a, "display"), k = "none" === j ? ea._data(a, "olddisplay") || z(a.nodeName) : j, "inline" === k && "none" === ea.css(a, "float") && (ca.inlineBlockNeedsLayout && "inline" !== z(a.nodeName) ? n.zoom = 1 : n.display = "inline-block")), c.overflow && (n.overflow = "hidden", ca.shrinkWrapBlocks() || l.always(function() {
                        n.overflow = c.overflow[0], n.overflowX = c.overflow[1], n.overflowY = c.overflow[2]
                    }));
                    for (d in b)
                        if (e = b[d], pb.exec(e)) {
                            if (delete b[d], f = f || "toggle" === e, e === (o ? "hide" : "show")) {
                                if ("show" !== e || !p || void 0 === p[d]) continue;
                                o = !0
                            }
                            m[d] = p && p[d] || ea.style(a, d)
                        } else j = void 0;
                    if (ea.isEmptyObject(m)) "inline" === ("none" === j ? z(a.nodeName) : j) && (n.display = j);
                    else {
                        p ? "hidden" in p && (o = p.hidden) : p = ea._data(a, "fxshow", {}), f && (p.hidden = !o), o ? ea(a).show() : l.done(function() {
                            ea(a).hide()
                        }), l.done(function() {
                            var b;
                            ea._removeData(a, "fxshow");
                            for (b in m) ea.style(a, b, m[b])
                        });
                        for (d in m) g = J(o ? p[d] : 0, d, l), d in p || (p[d] = g.start, o && (g.end = g.start, g.start = "width" === d || "height" === d ? 1 : 0))
                    }
                }

                function L(a, b) {
                    var c, d, e, f, g;
                    for (c in a)
                        if (d = ea.camelCase(c), e = b[d], f = a[c], ea.isArray(f) && (e = f[1], f = a[c] = f[0]), c !== d && (a[d] = f, delete a[c]), g = ea.cssHooks[d], g && "expand" in g) {
                            f = g.expand(f), delete a[d];
                            for (c in f) c in a || (a[c] = f[c], b[c] = e)
                        } else b[d] = e
                }

                function M(a, b, c) {
                    var d, e, f = 0,
                        g = sb.length,
                        h = ea.Deferred().always(function() {
                            delete i.elem
                        }),
                        i = function() {
                            if (e) return !1;
                            for (var b = nb || H(), c = Math.max(0, j.startTime + j.duration - b), d = c / j.duration || 0, f = 1 - d, g = 0, i = j.tweens.length; i > g; g++) j.tweens[g].run(f);
                            return h.notifyWith(a, [j, f, c]), 1 > f && i ? c : (h.resolveWith(a, [j]), !1)
                        },
                        j = h.promise({
                            elem: a,
                            props: ea.extend({}, b),
                            opts: ea.extend(!0, {
                                specialEasing: {}
                            }, c),
                            originalProperties: b,
                            originalOptions: c,
                            startTime: nb || H(),
                            duration: c.duration,
                            tweens: [],
                            createTween: function(b, c) {
                                var d = ea.Tween(a, j.opts, b, c, j.opts.specialEasing[b] || j.opts.easing);
                                return j.tweens.push(d), d
                            },
                            stop: function(b) {
                                var c = 0,
                                    d = b ? j.tweens.length : 0;
                                if (e) return this;
                                for (e = !0; d > c; c++) j.tweens[c].run(1);
                                return b ? h.resolveWith(a, [j, b]) : h.rejectWith(a, [j, b]), this
                            }
                        }),
                        k = j.props;
                    for (L(k, j.opts.specialEasing); g > f; f++)
                        if (d = sb[f].call(j, a, k, j.opts)) return d;
                    return ea.map(k, J, j), ea.isFunction(j.opts.start) && j.opts.start.call(a, j), ea.fx.timer(ea.extend(i, {
                        elem: a,
                        anim: j,
                        queue: j.opts.queue
                    })), j.progress(j.opts.progress).done(j.opts.done, j.opts.complete).fail(j.opts.fail).always(j.opts.always)
                }

                function N(a) {
                    return function(b, c) {
                        "string" != typeof b && (c = b, b = "*");
                        var d, e = 0,
                            f = b.toLowerCase().match(ta) || [];
                        if (ea.isFunction(c))
                            for (; d = f[e++];) "+" === d.charAt(0) ? (d = d.slice(1) || "*", (a[d] = a[d] || []).unshift(c)) : (a[d] = a[d] || []).push(c)
                    }
                }

                function O(a, b, c, d) {
                    function e(h) {
                        var i;
                        return f[h] = !0, ea.each(a[h] || [], function(a, h) {
                            var j = h(b, c, d);
                            return "string" != typeof j || g || f[j] ? g ? !(i = j) : void 0 : (b.dataTypes.unshift(j), e(j), !1)
                        }), i
                    }
                    var f = {},
                        g = a === Rb;
                    return e(b.dataTypes[0]) || !f["*"] && e("*")
                }

                function P(a, b) {
                    var c, d, e = ea.ajaxSettings.flatOptions || {};
                    for (d in b) void 0 !== b[d] && ((e[d] ? a : c || (c = {}))[d] = b[d]);
                    return c && ea.extend(!0, a, c), a
                }

                function Q(a, b, c) {
                    for (var d, e, f, g, h = a.contents, i = a.dataTypes;
                        "*" === i[0];) i.shift(), void 0 === e && (e = a.mimeType || b.getResponseHeader("Content-Type"));
                    if (e)
                        for (g in h)
                            if (h[g] && h[g].test(e)) {
                                i.unshift(g);
                                break
                            }
                    if (i[0] in c) f = i[0];
                    else {
                        for (g in c) {
                            if (!i[0] || a.converters[g + " " + i[0]]) {
                                f = g;
                                break
                            }
                            d || (d = g)
                        }
                        f = f || d
                    }
                    return f ? (f !== i[0] && i.unshift(f), c[f]) : void 0
                }

                function R(a, b, c, d) {
                    var e, f, g, h, i, j = {},
                        k = a.dataTypes.slice();
                    if (k[1])
                        for (g in a.converters) j[g.toLowerCase()] = a.converters[g];
                    for (f = k.shift(); f;)
                        if (a.responseFields[f] && (c[a.responseFields[f]] = b), !i && d && a.dataFilter && (b = a.dataFilter(b, a.dataType)), i = f, f = k.shift())
                            if ("*" === f) f = i;
                            else if ("*" !== i && i !== f) {
                        if (g = j[i + " " + f] || j["* " + f], !g)
                            for (e in j)
                                if (h = e.split(" "), h[1] === f && (g = j[i + " " + h[0]] || j["* " + h[0]])) {
                                    g === !0 ? g = j[e] : j[e] !== !0 && (f = h[0], k.unshift(h[1]));
                                    break
                                }
                        if (g !== !0)
                            if (g && a["throws"]) b = g(b);
                            else try {
                                b = g(b)
                            } catch (l) {
                                return {
                                    state: "parsererror",
                                    error: g ? l : "No conversion from " + i + " to " + f
                                }
                            }
                    }
                    return {
                        state: "success",
                        data: b
                    }
                }

                function S(a, b, c, d) {
                    var e;
                    if (ea.isArray(b)) ea.each(b, function(b, e) {
                        c || Vb.test(a) ? d(a, e) : S(a + "[" + ("object" == typeof e ? b : "") + "]", e, c, d)
                    });
                    else if (c || "object" !== ea.type(b)) d(a, b);
                    else
                        for (e in b) S(a + "[" + e + "]", b[e], c, d)
                }

                function T() {
                    try {
                        return new a.XMLHttpRequest
                    } catch (b) {}
                }

                function U() {
                    try {
                        return new a.ActiveXObject("Microsoft.XMLHTTP")
                    } catch (b) {}
                }

                function V(a) {
                    return ea.isWindow(a) ? a : 9 === a.nodeType ? a.defaultView || a.parentWindow : !1
                }
                var W = [],
                    X = W.slice,
                    Y = W.concat,
                    Z = W.push,
                    $ = W.indexOf,
                    _ = {},
                    aa = _.toString,
                    ba = _.hasOwnProperty,
                    ca = {},
                    da = "1.11.3",
                    ea = function(a, b) {
                        return new ea.fn.init(a, b)
                    },
                    fa = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
                    ga = /^-ms-/,
                    ha = /-([\da-z])/gi,
                    ia = function(a, b) {
                        return b.toUpperCase()
                    };
                ea.fn = ea.prototype = {
                    jquery: da,
                    constructor: ea,
                    selector: "",
                    length: 0,
                    toArray: function() {
                        return X.call(this)
                    },
                    get: function(a) {
                        return null != a ? 0 > a ? this[a + this.length] : this[a] : X.call(this)
                    },
                    pushStack: function(a) {
                        var b = ea.merge(this.constructor(), a);
                        return b.prevObject = this, b.context = this.context, b
                    },
                    each: function(a, b) {
                        return ea.each(this, a, b)
                    },
                    map: function(a) {
                        return this.pushStack(ea.map(this, function(b, c) {
                            return a.call(b, c, b)
                        }))
                    },
                    slice: function() {
                        return this.pushStack(X.apply(this, arguments))
                    },
                    first: function() {
                        return this.eq(0)
                    },
                    last: function() {
                        return this.eq(-1)
                    },
                    eq: function(a) {
                        var b = this.length,
                            c = +a + (0 > a ? b : 0);
                        return this.pushStack(c >= 0 && b > c ? [this[c]] : [])
                    },
                    end: function() {
                        return this.prevObject || this.constructor(null)
                    },
                    push: Z,
                    sort: W.sort,
                    splice: W.splice
                }, ea.extend = ea.fn.extend = function() {
                    var a, b, c, d, e, f, g = arguments[0] || {},
                        h = 1,
                        i = arguments.length,
                        j = !1;
                    for ("boolean" == typeof g && (j = g, g = arguments[h] || {}, h++), "object" == typeof g || ea.isFunction(g) || (g = {}), h === i && (g = this,
                            h--); i > h; h++)
                        if (null != (e = arguments[h]))
                            for (d in e) a = g[d], c = e[d], g !== c && (j && c && (ea.isPlainObject(c) || (b = ea.isArray(c))) ? (b ? (b = !1, f = a && ea.isArray(a) ? a : []) : f = a && ea.isPlainObject(a) ? a : {}, g[d] = ea.extend(j, f, c)) : void 0 !== c && (g[d] = c));
                    return g
                }, ea.extend({
                    expando: "jQuery" + (da + Math.random()).replace(/\D/g, ""),
                    isReady: !0,
                    error: function(a) {
                        throw new Error(a)
                    },
                    noop: function() {},
                    isFunction: function(a) {
                        return "function" === ea.type(a)
                    },
                    isArray: Array.isArray || function(a) {
                        return "array" === ea.type(a)
                    },
                    isWindow: function(a) {
                        return null != a && a == a.window
                    },
                    isNumeric: function(a) {
                        return !ea.isArray(a) && a - parseFloat(a) + 1 >= 0
                    },
                    isEmptyObject: function(a) {
                        var b;
                        for (b in a) return !1;
                        return !0
                    },
                    isPlainObject: function(a) {
                        var b;
                        if (!a || "object" !== ea.type(a) || a.nodeType || ea.isWindow(a)) return !1;
                        try {
                            if (a.constructor && !ba.call(a, "constructor") && !ba.call(a.constructor.prototype, "isPrototypeOf")) return !1
                        } catch (c) {
                            return !1
                        }
                        if (ca.ownLast)
                            for (b in a) return ba.call(a, b);
                        for (b in a);
                        return void 0 === b || ba.call(a, b)
                    },
                    type: function(a) {
                        return null == a ? a + "" : "object" == typeof a || "function" == typeof a ? _[aa.call(a)] || "object" : typeof a
                    },
                    globalEval: function(b) {
                        b && ea.trim(b) && (a.execScript || function(b) {
                            a.eval.call(a, b)
                        })(b)
                    },
                    camelCase: function(a) {
                        return a.replace(ga, "ms-").replace(ha, ia)
                    },
                    nodeName: function(a, b) {
                        return a.nodeName && a.nodeName.toLowerCase() === b.toLowerCase()
                    },
                    each: function(a, b, d) {
                        var e, f = 0,
                            g = a.length,
                            h = c(a);
                        if (d) {
                            if (h)
                                for (; g > f && (e = b.apply(a[f], d), e !== !1); f++);
                            else
                                for (f in a)
                                    if (e = b.apply(a[f], d), e === !1) break
                        } else if (h)
                            for (; g > f && (e = b.call(a[f], f, a[f]), e !== !1); f++);
                        else
                            for (f in a)
                                if (e = b.call(a[f], f, a[f]), e === !1) break; return a
                    },
                    trim: function(a) {
                        return null == a ? "" : (a + "").replace(fa, "")
                    },
                    makeArray: function(a, b) {
                        var d = b || [];
                        return null != a && (c(Object(a)) ? ea.merge(d, "string" == typeof a ? [a] : a) : Z.call(d, a)), d
                    },
                    inArray: function(a, b, c) {
                        var d;
                        if (b) {
                            if ($) return $.call(b, a, c);
                            for (d = b.length, c = c ? 0 > c ? Math.max(0, d + c) : c : 0; d > c; c++)
                                if (c in b && b[c] === a) return c
                        }
                        return -1
                    },
                    merge: function(a, b) {
                        for (var c = +b.length, d = 0, e = a.length; c > d;) a[e++] = b[d++];
                        if (c !== c)
                            for (; void 0 !== b[d];) a[e++] = b[d++];
                        return a.length = e, a
                    },
                    grep: function(a, b, c) {
                        for (var d, e = [], f = 0, g = a.length, h = !c; g > f; f++) d = !b(a[f], f), d !== h && e.push(a[f]);
                        return e
                    },
                    map: function(a, b, d) {
                        var e, f = 0,
                            g = a.length,
                            h = c(a),
                            i = [];
                        if (h)
                            for (; g > f; f++) e = b(a[f], f, d), null != e && i.push(e);
                        else
                            for (f in a) e = b(a[f], f, d), null != e && i.push(e);
                        return Y.apply([], i)
                    },
                    guid: 1,
                    proxy: function(a, b) {
                        var c, d, e;
                        return "string" == typeof b && (e = a[b], b = a, a = e), ea.isFunction(a) ? (c = X.call(arguments, 2), d = function() {
                            return a.apply(b || this, c.concat(X.call(arguments)))
                        }, d.guid = a.guid = a.guid || ea.guid++, d) : void 0
                    },
                    now: function() {
                        return +new Date
                    },
                    support: ca
                }), ea.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(a, b) {
                    _["[object " + b + "]"] = b.toLowerCase()
                });
                var ja = function(a) {
                    function b(a, b, c, d) {
                        var e, f, g, h, i, j, l, n, o, p;
                        if ((b ? b.ownerDocument || b : O) !== G && F(b), b = b || G, c = c || [], h = b.nodeType, "string" != typeof a || !a || 1 !== h && 9 !== h && 11 !== h) return c;
                        if (!d && I) {
                            if (11 !== h && (e = sa.exec(a)))
                                if (g = e[1]) {
                                    if (9 === h) {
                                        if (f = b.getElementById(g), !f || !f.parentNode) return c;
                                        if (f.id === g) return c.push(f), c
                                    } else if (b.ownerDocument && (f = b.ownerDocument.getElementById(g)) && M(b, f) && f.id === g) return c.push(f), c
                                } else {
                                    if (e[2]) return $.apply(c, b.getElementsByTagName(a)), c;
                                    if ((g = e[3]) && v.getElementsByClassName) return $.apply(c, b.getElementsByClassName(g)), c
                                }
                            if (v.qsa && (!J || !J.test(a))) {
                                if (n = l = N, o = b, p = 1 !== h && a, 1 === h && "object" !== b.nodeName.toLowerCase()) {
                                    for (j = z(a), (l = b.getAttribute("id")) ? n = l.replace(ua, "\\$&") : b.setAttribute("id", n), n = "[id='" + n + "'] ", i = j.length; i--;) j[i] = n + m(j[i]);
                                    o = ta.test(a) && k(b.parentNode) || b, p = j.join(",")
                                }
                                if (p) try {
                                    return $.apply(c, o.querySelectorAll(p)), c
                                } catch (q) {} finally {
                                    l || b.removeAttribute("id")
                                }
                            }
                        }
                        return B(a.replace(ia, "$1"), b, c, d)
                    }

                    function c() {
                        function a(c, d) {
                            return b.push(c + " ") > w.cacheLength && delete a[b.shift()], a[c + " "] = d
                        }
                        var b = [];
                        return a
                    }

                    function d(a) {
                        return a[N] = !0, a
                    }

                    function e(a) {
                        var b = G.createElement("div");
                        try {
                            return !!a(b)
                        } catch (c) {
                            return !1
                        } finally {
                            b.parentNode && b.parentNode.removeChild(b), b = null
                        }
                    }

                    function f(a, b) {
                        for (var c = a.split("|"), d = a.length; d--;) w.attrHandle[c[d]] = b
                    }

                    function g(a, b) {
                        var c = b && a,
                            d = c && 1 === a.nodeType && 1 === b.nodeType && (~b.sourceIndex || V) - (~a.sourceIndex || V);
                        if (d) return d;
                        if (c)
                            for (; c = c.nextSibling;)
                                if (c === b) return -1;
                        return a ? 1 : -1
                    }

                    function h(a) {
                        return function(b) {
                            var c = b.nodeName.toLowerCase();
                            return "input" === c && b.type === a
                        }
                    }

                    function i(a) {
                        return function(b) {
                            var c = b.nodeName.toLowerCase();
                            return ("input" === c || "button" === c) && b.type === a
                        }
                    }

                    function j(a) {
                        return d(function(b) {
                            return b = +b, d(function(c, d) {
                                for (var e, f = a([], c.length, b), g = f.length; g--;) c[e = f[g]] && (c[e] = !(d[e] = c[e]))
                            })
                        })
                    }

                    function k(a) {
                        return a && "undefined" != typeof a.getElementsByTagName && a
                    }

                    function l() {}

                    function m(a) {
                        for (var b = 0, c = a.length, d = ""; c > b; b++) d += a[b].value;
                        return d
                    }

                    function n(a, b, c) {
                        var d = b.dir,
                            e = c && "parentNode" === d,
                            f = Q++;
                        return b.first ? function(b, c, f) {
                            for (; b = b[d];)
                                if (1 === b.nodeType || e) return a(b, c, f)
                        } : function(b, c, g) {
                            var h, i, j = [P, f];
                            if (g) {
                                for (; b = b[d];)
                                    if ((1 === b.nodeType || e) && a(b, c, g)) return !0
                            } else
                                for (; b = b[d];)
                                    if (1 === b.nodeType || e) {
                                        if (i = b[N] || (b[N] = {}), (h = i[d]) && h[0] === P && h[1] === f) return j[2] = h[2];
                                        if (i[d] = j, j[2] = a(b, c, g)) return !0
                                    }
                        }
                    }

                    function o(a) {
                        return a.length > 1 ? function(b, c, d) {
                            for (var e = a.length; e--;)
                                if (!a[e](b, c, d)) return !1;
                            return !0
                        } : a[0]
                    }

                    function p(a, c, d) {
                        for (var e = 0, f = c.length; f > e; e++) b(a, c[e], d);
                        return d
                    }

                    function q(a, b, c, d, e) {
                        for (var f, g = [], h = 0, i = a.length, j = null != b; i > h; h++)(f = a[h]) && (!c || c(f, d, e)) && (g.push(f), j && b.push(h));
                        return g
                    }

                    function r(a, b, c, e, f, g) {
                        return e && !e[N] && (e = r(e)), f && !f[N] && (f = r(f, g)), d(function(d, g, h, i) {
                            var j, k, l, m = [],
                                n = [],
                                o = g.length,
                                r = d || p(b || "*", h.nodeType ? [h] : h, []),
                                s = !a || !d && b ? r : q(r, m, a, h, i),
                                t = c ? f || (d ? a : o || e) ? [] : g : s;
                            if (c && c(s, t, h, i), e)
                                for (j = q(t, n), e(j, [], h, i), k = j.length; k--;)(l = j[k]) && (t[n[k]] = !(s[n[k]] = l));
                            if (d) {
                                if (f || a) {
                                    if (f) {
                                        for (j = [], k = t.length; k--;)(l = t[k]) && j.push(s[k] = l);
                                        f(null, t = [], j, i)
                                    }
                                    for (k = t.length; k--;)(l = t[k]) && (j = f ? aa(d, l) : m[k]) > -1 && (d[j] = !(g[j] = l))
                                }
                            } else t = q(t === g ? t.splice(o, t.length) : t), f ? f(null, g, t, i) : $.apply(g, t)
                        })
                    }

                    function s(a) {
                        for (var b, c, d, e = a.length, f = w.relative[a[0].type], g = f || w.relative[" "], h = f ? 1 : 0, i = n(function(a) {
                                return a === b
                            }, g, !0), j = n(function(a) {
                                return aa(b, a) > -1
                            }, g, !0), k = [function(a, c, d) {
                                var e = !f && (d || c !== C) || ((b = c).nodeType ? i(a, c, d) : j(a, c, d));
                                return b = null, e
                            }]; e > h; h++)
                            if (c = w.relative[a[h].type]) k = [n(o(k), c)];
                            else {
                                if (c = w.filter[a[h].type].apply(null, a[h].matches), c[N]) {
                                    for (d = ++h; e > d && !w.relative[a[d].type]; d++);
                                    return r(h > 1 && o(k), h > 1 && m(a.slice(0, h - 1).concat({
                                        value: " " === a[h - 2].type ? "*" : ""
                                    })).replace(ia, "$1"), c, d > h && s(a.slice(h, d)), e > d && s(a = a.slice(d)), e > d && m(a))
                                }
                                k.push(c)
                            }
                        return o(k)
                    }

                    function t(a, c) {
                        var e = c.length > 0,
                            f = a.length > 0,
                            g = function(d, g, h, i, j) {
                                var k, l, m, n = 0,
                                    o = "0",
                                    p = d && [],
                                    r = [],
                                    s = C,
                                    t = d || f && w.find.TAG("*", j),
                                    u = P += null == s ? 1 : Math.random() || .1,
                                    v = t.length;
                                for (j && (C = g !== G && g); o !== v && null != (k = t[o]); o++) {
                                    if (f && k) {
                                        for (l = 0; m = a[l++];)
                                            if (m(k, g, h)) {
                                                i.push(k);
                                                break
                                            }
                                        j && (P = u)
                                    }
                                    e && ((k = !m && k) && n--, d && p.push(k))
                                }
                                if (n += o, e && o !== n) {
                                    for (l = 0; m = c[l++];) m(p, r, g, h);
                                    if (d) {
                                        if (n > 0)
                                            for (; o--;) p[o] || r[o] || (r[o] = Y.call(i));
                                        r = q(r)
                                    }
                                    $.apply(i, r), j && !d && r.length > 0 && n + c.length > 1 && b.uniqueSort(i)
                                }
                                return j && (P = u, C = s), p
                            };
                        return e ? d(g) : g
                    }
                    var u, v, w, x, y, z, A, B, C, D, E, F, G, H, I, J, K, L, M, N = "sizzle" + 1 * new Date,
                        O = a.document,
                        P = 0,
                        Q = 0,
                        R = c(),
                        S = c(),
                        T = c(),
                        U = function(a, b) {
                            return a === b && (E = !0), 0
                        },
                        V = 1 << 31,
                        W = {}.hasOwnProperty,
                        X = [],
                        Y = X.pop,
                        Z = X.push,
                        $ = X.push,
                        _ = X.slice,
                        aa = function(a, b) {
                            for (var c = 0, d = a.length; d > c; c++)
                                if (a[c] === b) return c;
                            return -1
                        },
                        ba = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
                        ca = "[\\x20\\t\\r\\n\\f]",
                        da = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
                        ea = da.replace("w", "w#"),
                        fa = "\\[" + ca + "*(" + da + ")(?:" + ca + "*([*^$|!~]?=)" + ca + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + ea + "))|)" + ca + "*\\]",
                        ga = ":(" + da + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + fa + ")*)|.*)\\)|)",
                        ha = new RegExp(ca + "+", "g"),
                        ia = new RegExp("^" + ca + "+|((?:^|[^\\\\])(?:\\\\.)*)" + ca + "+$", "g"),
                        ja = new RegExp("^" + ca + "*," + ca + "*"),
                        ka = new RegExp("^" + ca + "*([>+~]|" + ca + ")" + ca + "*"),
                        la = new RegExp("=" + ca + "*([^\\]'\"]*?)" + ca + "*\\]", "g"),
                        ma = new RegExp(ga),
                        na = new RegExp("^" + ea + "$"),
                        oa = {
                            ID: new RegExp("^#(" + da + ")"),
                            CLASS: new RegExp("^\\.(" + da + ")"),
                            TAG: new RegExp("^(" + da.replace("w", "w*") + ")"),
                            ATTR: new RegExp("^" + fa),
                            PSEUDO: new RegExp("^" + ga),
                            CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + ca + "*(even|odd|(([+-]|)(\\d*)n|)" + ca + "*(?:([+-]|)" + ca + "*(\\d+)|))" + ca + "*\\)|)", "i"),
                            bool: new RegExp("^(?:" + ba + ")$", "i"),
                            needsContext: new RegExp("^" + ca + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + ca + "*((?:-\\d)?\\d*)" + ca + "*\\)|)(?=[^-]|$)", "i")
                        },
                        pa = /^(?:input|select|textarea|button)$/i,
                        qa = /^h\d$/i,
                        ra = /^[^{]+\{\s*\[native \w/,
                        sa = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
                        ta = /[+~]/,
                        ua = /'|\\/g,
                        va = new RegExp("\\\\([\\da-f]{1,6}" + ca + "?|(" + ca + ")|.)", "ig"),
                        wa = function(a, b, c) {
                            var d = "0x" + b - 65536;
                            return d !== d || c ? b : 0 > d ? String.fromCharCode(d + 65536) : String.fromCharCode(d >> 10 | 55296, 1023 & d | 56320)
                        },
                        xa = function() {
                            F()
                        };
                    try {
                        $.apply(X = _.call(O.childNodes), O.childNodes), X[O.childNodes.length].nodeType
                    } catch (ya) {
                        $ = {
                            apply: X.length ? function(a, b) {
                                Z.apply(a, _.call(b))
                            } : function(a, b) {
                                for (var c = a.length, d = 0; a[c++] = b[d++];);
                                a.length = c - 1
                            }
                        }
                    }
                    v = b.support = {}, y = b.isXML = function(a) {
                        var b = a && (a.ownerDocument || a).documentElement;
                        return b ? "HTML" !== b.nodeName : !1
                    }, F = b.setDocument = function(a) {
                        var b, c, d = a ? a.ownerDocument || a : O;
                        return d !== G && 9 === d.nodeType && d.documentElement ? (G = d, H = d.documentElement, c = d.defaultView, c && c !== c.top && (c.addEventListener ? c.addEventListener("unload", xa, !1) : c.attachEvent && c.attachEvent("onunload", xa)), I = !y(d), v.attributes = e(function(a) {
                            return a.className = "i", !a.getAttribute("className")
                        }), v.getElementsByTagName = e(function(a) {
                            return a.appendChild(d.createComment("")), !a.getElementsByTagName("*").length
                        }), v.getElementsByClassName = ra.test(d.getElementsByClassName), v.getById = e(function(a) {
                            return H.appendChild(a).id = N, !d.getElementsByName || !d.getElementsByName(N).length
                        }), v.getById ? (w.find.ID = function(a, b) {
                            if ("undefined" != typeof b.getElementById && I) {
                                var c = b.getElementById(a);
                                return c && c.parentNode ? [c] : []
                            }
                        }, w.filter.ID = function(a) {
                            var b = a.replace(va, wa);
                            return function(a) {
                                return a.getAttribute("id") === b
                            }
                        }) : (delete w.find.ID, w.filter.ID = function(a) {
                            var b = a.replace(va, wa);
                            return function(a) {
                                var c = "undefined" != typeof a.getAttributeNode && a.getAttributeNode("id");
                                return c && c.value === b
                            }
                        }), w.find.TAG = v.getElementsByTagName ? function(a, b) {
                            return "undefined" != typeof b.getElementsByTagName ? b.getElementsByTagName(a) : v.qsa ? b.querySelectorAll(a) : void 0
                        } : function(a, b) {
                            var c, d = [],
                                e = 0,
                                f = b.getElementsByTagName(a);
                            if ("*" === a) {
                                for (; c = f[e++];) 1 === c.nodeType && d.push(c);
                                return d
                            }
                            return f
                        }, w.find.CLASS = v.getElementsByClassName && function(a, b) {
                            return I ? b.getElementsByClassName(a) : void 0
                        }, K = [], J = [], (v.qsa = ra.test(d.querySelectorAll)) && (e(function(a) {
                            H.appendChild(a).innerHTML = "<a id='" + N + "'></a><select id='" + N + "-\f]' msallowcapture=''><option selected=''></option></select>", a.querySelectorAll("[msallowcapture^='']").length && J.push("[*^$]=" + ca + "*(?:''|\"\")"), a.querySelectorAll("[selected]").length || J.push("\\[" + ca + "*(?:value|" + ba + ")"), a.querySelectorAll("[id~=" + N + "-]").length || J.push("~="), a.querySelectorAll(":checked").length || J.push(":checked"), a.querySelectorAll("a#" + N + "+*").length || J.push(".#.+[+~]")
                        }), e(function(a) {
                            var b = d.createElement("input");
                            b.setAttribute("type", "hidden"), a.appendChild(b).setAttribute("name", "D"), a.querySelectorAll("[name=d]").length && J.push("name" + ca + "*[*^$|!~]?="), a.querySelectorAll(":enabled").length || J.push(":enabled", ":disabled"), a.querySelectorAll("*,:x"), J.push(",.*:")
                        })), (v.matchesSelector = ra.test(L = H.matches || H.webkitMatchesSelector || H.mozMatchesSelector || H.oMatchesSelector || H.msMatchesSelector)) && e(function(a) {
                            v.disconnectedMatch = L.call(a, "div"), L.call(a, "[s!='']:x"), K.push("!=", ga)
                        }), J = J.length && new RegExp(J.join("|")), K = K.length && new RegExp(K.join("|")), b = ra.test(H.compareDocumentPosition), M = b || ra.test(H.contains) ? function(a, b) {
                            var c = 9 === a.nodeType ? a.documentElement : a,
                                d = b && b.parentNode;
                            return a === d || !(!d || 1 !== d.nodeType || !(c.contains ? c.contains(d) : a.compareDocumentPosition && 16 & a.compareDocumentPosition(d)))
                        } : function(a, b) {
                            if (b)
                                for (; b = b.parentNode;)
                                    if (b === a) return !0;
                            return !1
                        }, U = b ? function(a, b) {
                            if (a === b) return E = !0, 0;
                            var c = !a.compareDocumentPosition - !b.compareDocumentPosition;
                            return c ? c : (c = (a.ownerDocument || a) === (b.ownerDocument || b) ? a.compareDocumentPosition(b) : 1, 1 & c || !v.sortDetached && b.compareDocumentPosition(a) === c ? a === d || a.ownerDocument === O && M(O, a) ? -1 : b === d || b.ownerDocument === O && M(O, b) ? 1 : D ? aa(D, a) - aa(D, b) : 0 : 4 & c ? -1 : 1)
                        } : function(a, b) {
                            if (a === b) return E = !0, 0;
                            var c, e = 0,
                                f = a.parentNode,
                                h = b.parentNode,
                                i = [a],
                                j = [b];
                            if (!f || !h) return a === d ? -1 : b === d ? 1 : f ? -1 : h ? 1 : D ? aa(D, a) - aa(D, b) : 0;
                            if (f === h) return g(a, b);
                            for (c = a; c = c.parentNode;) i.unshift(c);
                            for (c = b; c = c.parentNode;) j.unshift(c);
                            for (; i[e] === j[e];) e++;
                            return e ? g(i[e], j[e]) : i[e] === O ? -1 : j[e] === O ? 1 : 0
                        }, d) : G
                    }, b.matches = function(a, c) {
                        return b(a, null, null, c)
                    }, b.matchesSelector = function(a, c) {
                        if ((a.ownerDocument || a) !== G && F(a), c = c.replace(la, "='$1']"), !(!v.matchesSelector || !I || K && K.test(c) || J && J.test(c))) try {
                            var d = L.call(a, c);
                            if (d || v.disconnectedMatch || a.document && 11 !== a.document.nodeType) return d
                        } catch (e) {}
                        return b(c, G, null, [a]).length > 0
                    }, b.contains = function(a, b) {
                        return (a.ownerDocument || a) !== G && F(a), M(a, b)
                    }, b.attr = function(a, b) {
                        (a.ownerDocument || a) !== G && F(a);
                        var c = w.attrHandle[b.toLowerCase()],
                            d = c && W.call(w.attrHandle, b.toLowerCase()) ? c(a, b, !I) : void 0;
                        return void 0 !== d ? d : v.attributes || !I ? a.getAttribute(b) : (d = a.getAttributeNode(b)) && d.specified ? d.value : null
                    }, b.error = function(a) {
                        throw new Error("Syntax error, unrecognized expression: " + a)
                    }, b.uniqueSort = function(a) {
                        var b, c = [],
                            d = 0,
                            e = 0;
                        if (E = !v.detectDuplicates, D = !v.sortStable && a.slice(0), a.sort(U), E) {
                            for (; b = a[e++];) b === a[e] && (d = c.push(e));
                            for (; d--;) a.splice(c[d], 1)
                        }
                        return D = null, a
                    }, x = b.getText = function(a) {
                        var b, c = "",
                            d = 0,
                            e = a.nodeType;
                        if (e) {
                            if (1 === e || 9 === e || 11 === e) {
                                if ("string" == typeof a.textContent) return a.textContent;
                                for (a = a.firstChild; a; a = a.nextSibling) c += x(a)
                            } else if (3 === e || 4 === e) return a.nodeValue
                        } else
                            for (; b = a[d++];) c += x(b);
                        return c
                    }, w = b.selectors = {
                        cacheLength: 50,
                        createPseudo: d,
                        match: oa,
                        attrHandle: {},
                        find: {},
                        relative: {
                            ">": {
                                dir: "parentNode",
                                first: !0
                            },
                            " ": {
                                dir: "parentNode"
                            },
                            "+": {
                                dir: "previousSibling",
                                first: !0
                            },
                            "~": {
                                dir: "previousSibling"
                            }
                        },
                        preFilter: {
                            ATTR: function(a) {
                                return a[1] = a[1].replace(va, wa), a[3] = (a[3] || a[4] || a[5] || "").replace(va, wa), "~=" === a[2] && (a[3] = " " + a[3] + " "), a.slice(0, 4)
                            },
                            CHILD: function(a) {
                                return a[1] = a[1].toLowerCase(), "nth" === a[1].slice(0, 3) ? (a[3] || b.error(a[0]), a[4] = +(a[4] ? a[5] + (a[6] || 1) : 2 * ("even" === a[3] || "odd" === a[3])), a[5] = +(a[7] + a[8] || "odd" === a[3])) : a[3] && b.error(a[0]), a
                            },
                            PSEUDO: function(a) {
                                var b, c = !a[6] && a[2];
                                return oa.CHILD.test(a[0]) ? null : (a[3] ? a[2] = a[4] || a[5] || "" : c && ma.test(c) && (b = z(c, !0)) && (b = c.indexOf(")", c.length - b) - c.length) && (a[0] = a[0].slice(0, b), a[2] = c.slice(0, b)), a.slice(0, 3))
                            }
                        },
                        filter: {
                            TAG: function(a) {
                                var b = a.replace(va, wa).toLowerCase();
                                return "*" === a ? function() {
                                    return !0
                                } : function(a) {
                                    return a.nodeName && a.nodeName.toLowerCase() === b
                                }
                            },
                            CLASS: function(a) {
                                var b = R[a + " "];
                                return b || (b = new RegExp("(^|" + ca + ")" + a + "(" + ca + "|$)")) && R(a, function(a) {
                                    return b.test("string" == typeof a.className && a.className || "undefined" != typeof a.getAttribute && a.getAttribute("class") || "")
                                })
                            },
                            ATTR: function(a, c, d) {
                                return function(e) {
                                    var f = b.attr(e, a);
                                    return null == f ? "!=" === c : c ? (f += "", "=" === c ? f === d : "!=" === c ? f !== d : "^=" === c ? d && 0 === f.indexOf(d) : "*=" === c ? d && f.indexOf(d) > -1 : "$=" === c ? d && f.slice(-d.length) === d : "~=" === c ? (" " + f.replace(ha, " ") + " ").indexOf(d) > -1 : "|=" === c ? f === d || f.slice(0, d.length + 1) === d + "-" : !1) : !0
                                }
                            },
                            CHILD: function(a, b, c, d, e) {
                                var f = "nth" !== a.slice(0, 3),
                                    g = "last" !== a.slice(-4),
                                    h = "of-type" === b;
                                return 1 === d && 0 === e ? function(a) {
                                    return !!a.parentNode
                                } : function(b, c, i) {
                                    var j, k, l, m, n, o, p = f !== g ? "nextSibling" : "previousSibling",
                                        q = b.parentNode,
                                        r = h && b.nodeName.toLowerCase(),
                                        s = !i && !h;
                                    if (q) {
                                        if (f) {
                                            for (; p;) {
                                                for (l = b; l = l[p];)
                                                    if (h ? l.nodeName.toLowerCase() === r : 1 === l.nodeType) return !1;
                                                o = p = "only" === a && !o && "nextSibling"
                                            }
                                            return !0
                                        }
                                        if (o = [g ? q.firstChild : q.lastChild], g && s) {
                                            for (k = q[N] || (q[N] = {}), j = k[a] || [], n = j[0] === P && j[1], m = j[0] === P && j[2], l = n && q.childNodes[n]; l = ++n && l && l[p] || (m = n = 0) || o.pop();)
                                                if (1 === l.nodeType && ++m && l === b) {
                                                    k[a] = [P, n, m];
                                                    break
                                                }
                                        } else if (s && (j = (b[N] || (b[N] = {}))[a]) && j[0] === P) m = j[1];
                                        else
                                            for (;
                                                (l = ++n && l && l[p] || (m = n = 0) || o.pop()) && ((h ? l.nodeName.toLowerCase() !== r : 1 !== l.nodeType) || !++m || (s && ((l[N] || (l[N] = {}))[a] = [P, m]), l !== b)););
                                        return m -= e, m === d || m % d === 0 && m / d >= 0
                                    }
                                }
                            },
                            PSEUDO: function(a, c) {
                                var e, f = w.pseudos[a] || w.setFilters[a.toLowerCase()] || b.error("unsupported pseudo: " + a);
                                return f[N] ? f(c) : f.length > 1 ? (e = [a, a, "", c], w.setFilters.hasOwnProperty(a.toLowerCase()) ? d(function(a, b) {
                                    for (var d, e = f(a, c), g = e.length; g--;) d = aa(a, e[g]), a[d] = !(b[d] = e[g])
                                }) : function(a) {
                                    return f(a, 0, e)
                                }) : f
                            }
                        },
                        pseudos: {
                            not: d(function(a) {
                                var b = [],
                                    c = [],
                                    e = A(a.replace(ia, "$1"));
                                return e[N] ? d(function(a, b, c, d) {
                                    for (var f, g = e(a, null, d, []), h = a.length; h--;)(f = g[h]) && (a[h] = !(b[h] = f))
                                }) : function(a, d, f) {
                                    return b[0] = a, e(b, null, f, c), b[0] = null, !c.pop()
                                }
                            }),
                            has: d(function(a) {
                                return function(c) {
                                    return b(a, c).length > 0
                                }
                            }),
                            contains: d(function(a) {
                                return a = a.replace(va, wa),
                                    function(b) {
                                        return (b.textContent || b.innerText || x(b)).indexOf(a) > -1
                                    }
                            }),
                            lang: d(function(a) {
                                return na.test(a || "") || b.error("unsupported lang: " + a), a = a.replace(va, wa).toLowerCase(),
                                    function(b) {
                                        var c;
                                        do
                                            if (c = I ? b.lang : b.getAttribute("xml:lang") || b.getAttribute("lang")) return c = c.toLowerCase(), c === a || 0 === c.indexOf(a + "-");
                                        while ((b = b.parentNode) && 1 === b.nodeType);
                                        return !1
                                    }
                            }),
                            target: function(b) {
                                var c = a.location && a.location.hash;
                                return c && c.slice(1) === b.id
                            },
                            root: function(a) {
                                return a === H
                            },
                            focus: function(a) {
                                return a === G.activeElement && (!G.hasFocus || G.hasFocus()) && !!(a.type || a.href || ~a.tabIndex)
                            },
                            enabled: function(a) {
                                return a.disabled === !1
                            },
                            disabled: function(a) {
                                return a.disabled === !0
                            },
                            checked: function(a) {
                                var b = a.nodeName.toLowerCase();
                                return "input" === b && !!a.checked || "option" === b && !!a.selected
                            },
                            selected: function(a) {
                                return a.parentNode && a.parentNode.selectedIndex, a.selected === !0
                            },
                            empty: function(a) {
                                for (a = a.firstChild; a; a = a.nextSibling)
                                    if (a.nodeType < 6) return !1;
                                return !0
                            },
                            parent: function(a) {
                                return !w.pseudos.empty(a)
                            },
                            header: function(a) {
                                return qa.test(a.nodeName)
                            },
                            input: function(a) {
                                return pa.test(a.nodeName)
                            },
                            button: function(a) {
                                var b = a.nodeName.toLowerCase();
                                return "input" === b && "button" === a.type || "button" === b
                            },
                            text: function(a) {
                                var b;
                                return "input" === a.nodeName.toLowerCase() && "text" === a.type && (null == (b = a.getAttribute("type")) || "text" === b.toLowerCase())
                            },
                            first: j(function() {
                                return [0]
                            }),
                            last: j(function(a, b) {
                                return [b - 1]
                            }),
                            eq: j(function(a, b, c) {
                                return [0 > c ? c + b : c]
                            }),
                            even: j(function(a, b) {
                                for (var c = 0; b > c; c += 2) a.push(c);
                                return a
                            }),
                            odd: j(function(a, b) {
                                for (var c = 1; b > c; c += 2) a.push(c);
                                return a
                            }),
                            lt: j(function(a, b, c) {
                                for (var d = 0 > c ? c + b : c; --d >= 0;) a.push(d);
                                return a
                            }),
                            gt: j(function(a, b, c) {
                                for (var d = 0 > c ? c + b : c; ++d < b;) a.push(d);
                                return a
                            })
                        }
                    }, w.pseudos.nth = w.pseudos.eq;
                    for (u in {
                            radio: !0,
                            checkbox: !0,
                            file: !0,
                            password: !0,
                            image: !0
                        }) w.pseudos[u] = h(u);
                    for (u in {
                            submit: !0,
                            reset: !0
                        }) w.pseudos[u] = i(u);
                    return l.prototype = w.filters = w.pseudos, w.setFilters = new l, z = b.tokenize = function(a, c) {
                        var d, e, f, g, h, i, j, k = S[a + " "];
                        if (k) return c ? 0 : k.slice(0);
                        for (h = a, i = [], j = w.preFilter; h;) {
                            (!d || (e = ja.exec(h))) && (e && (h = h.slice(e[0].length) || h), i.push(f = [])), d = !1, (e = ka.exec(h)) && (d = e.shift(), f.push({
                                value: d,
                                type: e[0].replace(ia, " ")
                            }), h = h.slice(d.length));
                            for (g in w.filter) !(e = oa[g].exec(h)) || j[g] && !(e = j[g](e)) || (d = e.shift(), f.push({
                                value: d,
                                type: g,
                                matches: e
                            }), h = h.slice(d.length));
                            if (!d) break
                        }
                        return c ? h.length : h ? b.error(a) : S(a, i).slice(0)
                    }, A = b.compile = function(a, b) {
                        var c, d = [],
                            e = [],
                            f = T[a + " "];
                        if (!f) {
                            for (b || (b = z(a)), c = b.length; c--;) f = s(b[c]), f[N] ? d.push(f) : e.push(f);
                            f = T(a, t(e, d)), f.selector = a
                        }
                        return f
                    }, B = b.select = function(a, b, c, d) {
                        var e, f, g, h, i, j = "function" == typeof a && a,
                            l = !d && z(a = j.selector || a);
                        if (c = c || [], 1 === l.length) {
                            if (f = l[0] = l[0].slice(0), f.length > 2 && "ID" === (g = f[0]).type && v.getById && 9 === b.nodeType && I && w.relative[f[1].type]) {
                                if (b = (w.find.ID(g.matches[0].replace(va, wa), b) || [])[0], !b) return c;
                                j && (b = b.parentNode), a = a.slice(f.shift().value.length)
                            }
                            for (e = oa.needsContext.test(a) ? 0 : f.length; e-- && (g = f[e], !w.relative[h = g.type]);)
                                if ((i = w.find[h]) && (d = i(g.matches[0].replace(va, wa), ta.test(f[0].type) && k(b.parentNode) || b))) {
                                    if (f.splice(e, 1), a = d.length && m(f), !a) return $.apply(c, d), c;
                                    break
                                }
                        }
                        return (j || A(a, l))(d, b, !I, c, ta.test(a) && k(b.parentNode) || b), c
                    }, v.sortStable = N.split("").sort(U).join("") === N, v.detectDuplicates = !!E, F(), v.sortDetached = e(function(a) {
                        return 1 & a.compareDocumentPosition(G.createElement("div"))
                    }), e(function(a) {
                        return a.innerHTML = "<a href='#'></a>", "#" === a.firstChild.getAttribute("href")
                    }) || f("type|href|height|width", function(a, b, c) {
                        return c ? void 0 : a.getAttribute(b, "type" === b.toLowerCase() ? 1 : 2)
                    }), v.attributes && e(function(a) {
                        return a.innerHTML = "<input/>", a.firstChild.setAttribute("value", ""), "" === a.firstChild.getAttribute("value")
                    }) || f("value", function(a, b, c) {
                        return c || "input" !== a.nodeName.toLowerCase() ? void 0 : a.defaultValue
                    }), e(function(a) {
                        return null == a.getAttribute("disabled")
                    }) || f(ba, function(a, b, c) {
                        var d;
                        return c ? void 0 : a[b] === !0 ? b.toLowerCase() : (d = a.getAttributeNode(b)) && d.specified ? d.value : null
                    }), b
                }(a);
                ea.find = ja, ea.expr = ja.selectors, ea.expr[":"] = ea.expr.pseudos, ea.unique = ja.uniqueSort, ea.text = ja.getText, ea.isXMLDoc = ja.isXML, ea.contains = ja.contains;
                var ka = ea.expr.match.needsContext,
                    la = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
                    ma = /^.[^:#\[\.,]*$/;
                ea.filter = function(a, b, c) {
                    var d = b[0];
                    return c && (a = ":not(" + a + ")"), 1 === b.length && 1 === d.nodeType ? ea.find.matchesSelector(d, a) ? [d] : [] : ea.find.matches(a, ea.grep(b, function(a) {
                        return 1 === a.nodeType
                    }))
                }, ea.fn.extend({
                    find: function(a) {
                        var b, c = [],
                            d = this,
                            e = d.length;
                        if ("string" != typeof a) return this.pushStack(ea(a).filter(function() {
                            for (b = 0; e > b; b++)
                                if (ea.contains(d[b], this)) return !0
                        }));
                        for (b = 0; e > b; b++) ea.find(a, d[b], c);
                        return c = this.pushStack(e > 1 ? ea.unique(c) : c), c.selector = this.selector ? this.selector + " " + a : a, c
                    },
                    filter: function(a) {
                        return this.pushStack(d(this, a || [], !1))
                    },
                    not: function(a) {
                        return this.pushStack(d(this, a || [], !0))
                    },
                    is: function(a) {
                        return !!d(this, "string" == typeof a && ka.test(a) ? ea(a) : a || [], !1).length
                    }
                });
                var na, oa = a.document,
                    pa = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,
                    qa = ea.fn.init = function(a, b) {
                        var c, d;
                        if (!a) return this;
                        if ("string" == typeof a) {
                            if (c = "<" === a.charAt(0) && ">" === a.charAt(a.length - 1) && a.length >= 3 ? [null, a, null] : pa.exec(a), !c || !c[1] && b) return !b || b.jquery ? (b || na).find(a) : this.constructor(b).find(a);
                            if (c[1]) {
                                if (b = b instanceof ea ? b[0] : b, ea.merge(this, ea.parseHTML(c[1], b && b.nodeType ? b.ownerDocument || b : oa, !0)), la.test(c[1]) && ea.isPlainObject(b))
                                    for (c in b) ea.isFunction(this[c]) ? this[c](b[c]) : this.attr(c, b[c]);
                                return this
                            }
                            if (d = oa.getElementById(c[2]), d && d.parentNode) {
                                if (d.id !== c[2]) return na.find(a);
                                this.length = 1, this[0] = d
                            }
                            return this.context = oa, this.selector = a, this
                        }
                        return a.nodeType ? (this.context = this[0] = a, this.length = 1, this) : ea.isFunction(a) ? "undefined" != typeof na.ready ? na.ready(a) : a(ea) : (void 0 !== a.selector && (this.selector = a.selector, this.context = a.context), ea.makeArray(a, this))
                    };
                qa.prototype = ea.fn, na = ea(oa);
                var ra = /^(?:parents|prev(?:Until|All))/,
                    sa = {
                        children: !0,
                        contents: !0,
                        next: !0,
                        prev: !0
                    };
                ea.extend({
                    dir: function(a, b, c) {
                        for (var d = [], e = a[b]; e && 9 !== e.nodeType && (void 0 === c || 1 !== e.nodeType || !ea(e).is(c));) 1 === e.nodeType && d.push(e), e = e[b];
                        return d
                    },
                    sibling: function(a, b) {
                        for (var c = []; a; a = a.nextSibling) 1 === a.nodeType && a !== b && c.push(a);
                        return c
                    }
                }), ea.fn.extend({
                    has: function(a) {
                        var b, c = ea(a, this),
                            d = c.length;
                        return this.filter(function() {
                            for (b = 0; d > b; b++)
                                if (ea.contains(this, c[b])) return !0
                        })
                    },
                    closest: function(a, b) {
                        for (var c, d = 0, e = this.length, f = [], g = ka.test(a) || "string" != typeof a ? ea(a, b || this.context) : 0; e > d; d++)
                            for (c = this[d]; c && c !== b; c = c.parentNode)
                                if (c.nodeType < 11 && (g ? g.index(c) > -1 : 1 === c.nodeType && ea.find.matchesSelector(c, a))) {
                                    f.push(c);
                                    break
                                }
                        return this.pushStack(f.length > 1 ? ea.unique(f) : f)
                    },
                    index: function(a) {
                        return a ? "string" == typeof a ? ea.inArray(this[0], ea(a)) : ea.inArray(a.jquery ? a[0] : a, this) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
                    },
                    add: function(a, b) {
                        return this.pushStack(ea.unique(ea.merge(this.get(), ea(a, b))))
                    },
                    addBack: function(a) {
                        return this.add(null == a ? this.prevObject : this.prevObject.filter(a))
                    }
                }), ea.each({
                    parent: function(a) {
                        var b = a.parentNode;
                        return b && 11 !== b.nodeType ? b : null
                    },
                    parents: function(a) {
                        return ea.dir(a, "parentNode")
                    },
                    parentsUntil: function(a, b, c) {
                        return ea.dir(a, "parentNode", c)
                    },
                    next: function(a) {
                        return e(a, "nextSibling")
                    },
                    prev: function(a) {
                        return e(a, "previousSibling")
                    },
                    nextAll: function(a) {
                        return ea.dir(a, "nextSibling")
                    },
                    prevAll: function(a) {
                        return ea.dir(a, "previousSibling")
                    },
                    nextUntil: function(a, b, c) {
                        return ea.dir(a, "nextSibling", c)
                    },
                    prevUntil: function(a, b, c) {
                        return ea.dir(a, "previousSibling", c)
                    },
                    siblings: function(a) {
                        return ea.sibling((a.parentNode || {}).firstChild, a)
                    },
                    children: function(a) {
                        return ea.sibling(a.firstChild)
                    },
                    contents: function(a) {
                        return ea.nodeName(a, "iframe") ? a.contentDocument || a.contentWindow.document : ea.merge([], a.childNodes)
                    }
                }, function(a, b) {
                    ea.fn[a] = function(c, d) {
                        var e = ea.map(this, b, c);
                        return "Until" !== a.slice(-5) && (d = c), d && "string" == typeof d && (e = ea.filter(d, e)), this.length > 1 && (sa[a] || (e = ea.unique(e)), ra.test(a) && (e = e.reverse())), this.pushStack(e)
                    }
                });
                var ta = /\S+/g,
                    ua = {};
                ea.Callbacks = function(a) {
                    a = "string" == typeof a ? ua[a] || f(a) : ea.extend({}, a);
                    var b, c, d, e, g, h, i = [],
                        j = !a.once && [],
                        k = function(f) {
                            for (c = a.memory && f, d = !0, g = h || 0, h = 0, e = i.length, b = !0; i && e > g; g++)
                                if (i[g].apply(f[0], f[1]) === !1 && a.stopOnFalse) {
                                    c = !1;
                                    break
                                }
                            b = !1, i && (j ? j.length && k(j.shift()) : c ? i = [] : l.disable())
                        },
                        l = {
                            add: function() {
                                if (i) {
                                    var d = i.length;
                                    ! function f(b) {
                                        ea.each(b, function(b, c) {
                                            var d = ea.type(c);
                                            "function" === d ? a.unique && l.has(c) || i.push(c) : c && c.length && "string" !== d && f(c)
                                        })
                                    }(arguments), b ? e = i.length : c && (h = d, k(c))
                                }
                                return this
                            },
                            remove: function() {
                                return i && ea.each(arguments, function(a, c) {
                                    for (var d;
                                        (d = ea.inArray(c, i, d)) > -1;) i.splice(d, 1), b && (e >= d && e--, g >= d && g--)
                                }), this
                            },
                            has: function(a) {
                                return a ? ea.inArray(a, i) > -1 : !(!i || !i.length)
                            },
                            empty: function() {
                                return i = [], e = 0, this
                            },
                            disable: function() {
                                return i = j = c = void 0, this
                            },
                            disabled: function() {
                                return !i
                            },
                            lock: function() {
                                return j = void 0, c || l.disable(), this
                            },
                            locked: function() {
                                return !j
                            },
                            fireWith: function(a, c) {
                                return !i || d && !j || (c = c || [], c = [a, c.slice ? c.slice() : c], b ? j.push(c) : k(c)), this
                            },
                            fire: function() {
                                return l.fireWith(this, arguments), this
                            },
                            fired: function() {
                                return !!d
                            }
                        };
                    return l
                }, ea.extend({
                    Deferred: function(a) {
                        var b = [
                                ["resolve", "done", ea.Callbacks("once memory"), "resolved"],
                                ["reject", "fail", ea.Callbacks("once memory"), "rejected"],
                                ["notify", "progress", ea.Callbacks("memory")]
                            ],
                            c = "pending",
                            d = {
                                state: function() {
                                    return c
                                },
                                always: function() {
                                    return e.done(arguments).fail(arguments), this
                                },
                                then: function() {
                                    var a = arguments;
                                    return ea.Deferred(function(c) {
                                        ea.each(b, function(b, f) {
                                            var g = ea.isFunction(a[b]) && a[b];
                                            e[f[1]](function() {
                                                var a = g && g.apply(this, arguments);
                                                a && ea.isFunction(a.promise) ? a.promise().done(c.resolve).fail(c.reject).progress(c.notify) : c[f[0] + "With"](this === d ? c.promise() : this, g ? [a] : arguments)
                                            })
                                        }), a = null
                                    }).promise()
                                },
                                promise: function(a) {
                                    return null != a ? ea.extend(a, d) : d
                                }
                            },
                            e = {};
                        return d.pipe = d.then, ea.each(b, function(a, f) {
                            var g = f[2],
                                h = f[3];
                            d[f[1]] = g.add, h && g.add(function() {
                                c = h
                            }, b[1 ^ a][2].disable, b[2][2].lock), e[f[0]] = function() {
                                return e[f[0] + "With"](this === e ? d : this, arguments), this
                            }, e[f[0] + "With"] = g.fireWith
                        }), d.promise(e), a && a.call(e, e), e
                    },
                    when: function(a) {
                        var b, c, d, e = 0,
                            f = X.call(arguments),
                            g = f.length,
                            h = 1 !== g || a && ea.isFunction(a.promise) ? g : 0,
                            i = 1 === h ? a : ea.Deferred(),
                            j = function(a, c, d) {
                                return function(e) {
                                    c[a] = this, d[a] = arguments.length > 1 ? X.call(arguments) : e, d === b ? i.notifyWith(c, d) : --h || i.resolveWith(c, d)
                                }
                            };
                        if (g > 1)
                            for (b = new Array(g), c = new Array(g), d = new Array(g); g > e; e++) f[e] && ea.isFunction(f[e].promise) ? f[e].promise().done(j(e, d, f)).fail(i.reject).progress(j(e, c, b)) : --h;
                        return h || i.resolveWith(d, f), i.promise()
                    }
                });
                var va;
                ea.fn.ready = function(a) {
                    return ea.ready.promise().done(a), this
                }, ea.extend({
                    isReady: !1,
                    readyWait: 1,
                    holdReady: function(a) {
                        a ? ea.readyWait++ : ea.ready(!0)
                    },
                    ready: function(a) {
                        if (a === !0 ? !--ea.readyWait : !ea.isReady) {
                            if (!oa.body) return setTimeout(ea.ready);
                            ea.isReady = !0, a !== !0 && --ea.readyWait > 0 || (va.resolveWith(oa, [ea]), ea.fn.triggerHandler && (ea(oa).triggerHandler("ready"), ea(oa).off("ready")))
                        }
                    }
                }), ea.ready.promise = function(b) {
                    if (!va)
                        if (va = ea.Deferred(), "complete" === oa.readyState) setTimeout(ea.ready);
                        else if (oa.addEventListener) oa.addEventListener("DOMContentLoaded", h, !1), a.addEventListener("load", h, !1);
                    else {
                        oa.attachEvent("onreadystatechange", h), a.attachEvent("onload", h);
                        var c = !1;
                        try {
                            c = null == a.frameElement && oa.documentElement
                        } catch (d) {}
                        c && c.doScroll && ! function e() {
                            if (!ea.isReady) {
                                try {
                                    c.doScroll("left")
                                } catch (a) {
                                    return setTimeout(e, 50)
                                }
                                g(), ea.ready()
                            }
                        }()
                    }
                    return va.promise(b)
                };
                var wa, xa = "undefined";
                for (wa in ea(ca)) break;
                ca.ownLast = "0" !== wa, ca.inlineBlockNeedsLayout = !1, ea(function() {
                        var a, b, c, d;
                        c = oa.getElementsByTagName("body")[0], c && c.style && (b = oa.createElement("div"), d = oa.createElement("div"), d.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px", c.appendChild(d).appendChild(b), typeof b.style.zoom !== xa && (b.style.cssText = "display:inline;margin:0;border:0;padding:1px;width:1px;zoom:1", ca.inlineBlockNeedsLayout = a = 3 === b.offsetWidth, a && (c.style.zoom = 1)), c.removeChild(d))
                    }),
                    function() {
                        var a = oa.createElement("div");
                        if (null == ca.deleteExpando) {
                            ca.deleteExpando = !0;
                            try {
                                delete a.test
                            } catch (b) {
                                ca.deleteExpando = !1
                            }
                        }
                        a = null
                    }(), ea.acceptData = function(a) {
                        var b = ea.noData[(a.nodeName + " ").toLowerCase()],
                            c = +a.nodeType || 1;
                        return 1 !== c && 9 !== c ? !1 : !b || b !== !0 && a.getAttribute("classid") === b
                    };
                var ya = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
                    za = /([A-Z])/g;
                ea.extend({
                    cache: {},
                    noData: {
                        "applet ": !0,
                        "embed ": !0,
                        "object ": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
                    },
                    hasData: function(a) {
                        return a = a.nodeType ? ea.cache[a[ea.expando]] : a[ea.expando], !!a && !j(a)
                    },
                    data: function(a, b, c) {
                        return k(a, b, c)
                    },
                    removeData: function(a, b) {
                        return l(a, b)
                    },
                    _data: function(a, b, c) {
                        return k(a, b, c, !0)
                    },
                    _removeData: function(a, b) {
                        return l(a, b, !0)
                    }
                }), ea.fn.extend({
                    data: function(a, b) {
                        var c, d, e, f = this[0],
                            g = f && f.attributes;
                        if (void 0 === a) {
                            if (this.length && (e = ea.data(f), 1 === f.nodeType && !ea._data(f, "parsedAttrs"))) {
                                for (c = g.length; c--;) g[c] && (d = g[c].name, 0 === d.indexOf("data-") && (d = ea.camelCase(d.slice(5)), i(f, d, e[d])));
                                ea._data(f, "parsedAttrs", !0)
                            }
                            return e
                        }
                        return "object" == typeof a ? this.each(function() {
                            ea.data(this, a)
                        }) : arguments.length > 1 ? this.each(function() {
                            ea.data(this, a, b)
                        }) : f ? i(f, a, ea.data(f, a)) : void 0
                    },
                    removeData: function(a) {
                        return this.each(function() {
                            ea.removeData(this, a)
                        })
                    }
                }), ea.extend({
                    queue: function(a, b, c) {
                        var d;
                        return a ? (b = (b || "fx") + "queue", d = ea._data(a, b), c && (!d || ea.isArray(c) ? d = ea._data(a, b, ea.makeArray(c)) : d.push(c)), d || []) : void 0
                    },
                    dequeue: function(a, b) {
                        b = b || "fx";
                        var c = ea.queue(a, b),
                            d = c.length,
                            e = c.shift(),
                            f = ea._queueHooks(a, b),
                            g = function() {
                                ea.dequeue(a, b)
                            };
                        "inprogress" === e && (e = c.shift(), d--), e && ("fx" === b && c.unshift("inprogress"), delete f.stop, e.call(a, g, f)), !d && f && f.empty.fire()
                    },
                    _queueHooks: function(a, b) {
                        var c = b + "queueHooks";
                        return ea._data(a, c) || ea._data(a, c, {
                            empty: ea.Callbacks("once memory").add(function() {
                                ea._removeData(a, b + "queue"), ea._removeData(a, c)
                            })
                        })
                    }
                }), ea.fn.extend({
                    queue: function(a, b) {
                        var c = 2;
                        return "string" != typeof a && (b = a, a = "fx", c--), arguments.length < c ? ea.queue(this[0], a) : void 0 === b ? this : this.each(function() {
                            var c = ea.queue(this, a, b);
                            ea._queueHooks(this, a), "fx" === a && "inprogress" !== c[0] && ea.dequeue(this, a)
                        })
                    },
                    dequeue: function(a) {
                        return this.each(function() {
                            ea.dequeue(this, a)
                        })
                    },
                    clearQueue: function(a) {
                        return this.queue(a || "fx", [])
                    },
                    promise: function(a, b) {
                        var c, d = 1,
                            e = ea.Deferred(),
                            f = this,
                            g = this.length,
                            h = function() {
                                --d || e.resolveWith(f, [f])
                            };
                        for ("string" != typeof a && (b = a, a = void 0), a = a || "fx"; g--;) c = ea._data(f[g], a + "queueHooks"), c && c.empty && (d++, c.empty.add(h));
                        return h(), e.promise(b)
                    }
                });
                var Aa = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
                    Ba = ["Top", "Right", "Bottom", "Left"],
                    Ca = function(a, b) {
                        return a = b || a, "none" === ea.css(a, "display") || !ea.contains(a.ownerDocument, a)
                    },
                    Da = ea.access = function(a, b, c, d, e, f, g) {
                        var h = 0,
                            i = a.length,
                            j = null == c;
                        if ("object" === ea.type(c)) {
                            e = !0;
                            for (h in c) ea.access(a, b, h, c[h], !0, f, g)
                        } else if (void 0 !== d && (e = !0, ea.isFunction(d) || (g = !0), j && (g ? (b.call(a, d), b = null) : (j = b, b = function(a, b, c) {
                                return j.call(ea(a), c)
                            })), b))
                            for (; i > h; h++) b(a[h], c, g ? d : d.call(a[h], h, b(a[h], c)));
                        return e ? a : j ? b.call(a) : i ? b(a[0], c) : f
                    },
                    Ea = /^(?:checkbox|radio)$/i;
                ! function() {
                    var a = oa.createElement("input"),
                        b = oa.createElement("div"),
                        c = oa.createDocumentFragment();
                    if (b.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", ca.leadingWhitespace = 3 === b.firstChild.nodeType, ca.tbody = !b.getElementsByTagName("tbody").length, ca.htmlSerialize = !!b.getElementsByTagName("link").length, ca.html5Clone = "<:nav></:nav>" !== oa.createElement("nav").cloneNode(!0).outerHTML, a.type = "checkbox", a.checked = !0, c.appendChild(a), ca.appendChecked = a.checked, b.innerHTML = "<textarea>x</textarea>", ca.noCloneChecked = !!b.cloneNode(!0).lastChild.defaultValue, c.appendChild(b), b.innerHTML = "<input type='radio' checked='checked' name='t'/>", ca.checkClone = b.cloneNode(!0).cloneNode(!0).lastChild.checked, ca.noCloneEvent = !0, b.attachEvent && (b.attachEvent("onclick", function() {
                            ca.noCloneEvent = !1
                        }), b.cloneNode(!0).click()), null == ca.deleteExpando) {
                        ca.deleteExpando = !0;
                        try {
                            delete b.test
                        } catch (d) {
                            ca.deleteExpando = !1
                        }
                    }
                }(),
                function() {
                    var b, c, d = oa.createElement("div");
                    for (b in {
                            submit: !0,
                            change: !0,
                            focusin: !0
                        }) c = "on" + b, (ca[b + "Bubbles"] = c in a) || (d.setAttribute(c, "t"), ca[b + "Bubbles"] = d.attributes[c].expando === !1);
                    d = null
                }();
                var Fa = /^(?:input|select|textarea)$/i,
                    Ga = /^key/,
                    Ha = /^(?:mouse|pointer|contextmenu)|click/,
                    Ia = /^(?:focusinfocus|focusoutblur)$/,
                    Ja = /^([^.]*)(?:\.(.+)|)$/;
                ea.event = {
                    global: {},
                    add: function(a, b, c, d, e) {
                        var f, g, h, i, j, k, l, m, n, o, p, q = ea._data(a);
                        if (q) {
                            for (c.handler && (i = c, c = i.handler, e = i.selector), c.guid || (c.guid = ea.guid++), (g = q.events) || (g = q.events = {}), (k = q.handle) || (k = q.handle = function(a) {
                                    return typeof ea === xa || a && ea.event.triggered === a.type ? void 0 : ea.event.dispatch.apply(k.elem, arguments)
                                }, k.elem = a), b = (b || "").match(ta) || [""], h = b.length; h--;) f = Ja.exec(b[h]) || [], n = p = f[1], o = (f[2] || "").split(".").sort(), n && (j = ea.event.special[n] || {}, n = (e ? j.delegateType : j.bindType) || n, j = ea.event.special[n] || {}, l = ea.extend({
                                type: n,
                                origType: p,
                                data: d,
                                handler: c,
                                guid: c.guid,
                                selector: e,
                                needsContext: e && ea.expr.match.needsContext.test(e),
                                namespace: o.join(".")
                            }, i), (m = g[n]) || (m = g[n] = [], m.delegateCount = 0, j.setup && j.setup.call(a, d, o, k) !== !1 || (a.addEventListener ? a.addEventListener(n, k, !1) : a.attachEvent && a.attachEvent("on" + n, k))), j.add && (j.add.call(a, l), l.handler.guid || (l.handler.guid = c.guid)), e ? m.splice(m.delegateCount++, 0, l) : m.push(l), ea.event.global[n] = !0);
                            a = null
                        }
                    },
                    remove: function(a, b, c, d, e) {
                        var f, g, h, i, j, k, l, m, n, o, p, q = ea.hasData(a) && ea._data(a);
                        if (q && (k = q.events)) {
                            for (b = (b || "").match(ta) || [""], j = b.length; j--;)
                                if (h = Ja.exec(b[j]) || [], n = p = h[1], o = (h[2] || "").split(".").sort(), n) {
                                    for (l = ea.event.special[n] || {}, n = (d ? l.delegateType : l.bindType) || n, m = k[n] || [], h = h[2] && new RegExp("(^|\\.)" + o.join("\\.(?:.*\\.|)") + "(\\.|$)"), i = f = m.length; f--;) g = m[f], !e && p !== g.origType || c && c.guid !== g.guid || h && !h.test(g.namespace) || d && d !== g.selector && ("**" !== d || !g.selector) || (m.splice(f, 1), g.selector && m.delegateCount--, l.remove && l.remove.call(a, g));
                                    i && !m.length && (l.teardown && l.teardown.call(a, o, q.handle) !== !1 || ea.removeEvent(a, n, q.handle), delete k[n])
                                } else
                                    for (n in k) ea.event.remove(a, n + b[j], c, d, !0);
                            ea.isEmptyObject(k) && (delete q.handle, ea._removeData(a, "events"))
                        }
                    },
                    trigger: function(b, c, d, e) {
                        var f, g, h, i, j, k, l, m = [d || oa],
                            n = ba.call(b, "type") ? b.type : b,
                            o = ba.call(b, "namespace") ? b.namespace.split(".") : [];
                        if (h = k = d = d || oa, 3 !== d.nodeType && 8 !== d.nodeType && !Ia.test(n + ea.event.triggered) && (n.indexOf(".") >= 0 && (o = n.split("."), n = o.shift(), o.sort()), g = n.indexOf(":") < 0 && "on" + n, b = b[ea.expando] ? b : new ea.Event(n, "object" == typeof b && b), b.isTrigger = e ? 2 : 3, b.namespace = o.join("."), b.namespace_re = b.namespace ? new RegExp("(^|\\.)" + o.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, b.result = void 0, b.target || (b.target = d), c = null == c ? [b] : ea.makeArray(c, [b]), j = ea.event.special[n] || {}, e || !j.trigger || j.trigger.apply(d, c) !== !1)) {
                            if (!e && !j.noBubble && !ea.isWindow(d)) {
                                for (i = j.delegateType || n, Ia.test(i + n) || (h = h.parentNode); h; h = h.parentNode) m.push(h), k = h;
                                k === (d.ownerDocument || oa) && m.push(k.defaultView || k.parentWindow || a)
                            }
                            for (l = 0;
                                (h = m[l++]) && !b.isPropagationStopped();) b.type = l > 1 ? i : j.bindType || n, f = (ea._data(h, "events") || {})[b.type] && ea._data(h, "handle"), f && f.apply(h, c), f = g && h[g], f && f.apply && ea.acceptData(h) && (b.result = f.apply(h, c), b.result === !1 && b.preventDefault());
                            if (b.type = n, !e && !b.isDefaultPrevented() && (!j._default || j._default.apply(m.pop(), c) === !1) && ea.acceptData(d) && g && d[n] && !ea.isWindow(d)) {
                                k = d[g], k && (d[g] = null), ea.event.triggered = n;
                                try {
                                    d[n]()
                                } catch (p) {}
                                ea.event.triggered = void 0, k && (d[g] = k)
                            }
                            return b.result
                        }
                    },
                    dispatch: function(a) {
                        a = ea.event.fix(a);
                        var b, c, d, e, f, g = [],
                            h = X.call(arguments),
                            i = (ea._data(this, "events") || {})[a.type] || [],
                            j = ea.event.special[a.type] || {};
                        if (h[0] = a, a.delegateTarget = this, !j.preDispatch || j.preDispatch.call(this, a) !== !1) {
                            for (g = ea.event.handlers.call(this, a, i), b = 0;
                                (e = g[b++]) && !a.isPropagationStopped();)
                                for (a.currentTarget = e.elem, f = 0;
                                    (d = e.handlers[f++]) && !a.isImmediatePropagationStopped();)(!a.namespace_re || a.namespace_re.test(d.namespace)) && (a.handleObj = d, a.data = d.data, c = ((ea.event.special[d.origType] || {}).handle || d.handler).apply(e.elem, h), void 0 !== c && (a.result = c) === !1 && (a.preventDefault(), a.stopPropagation()));
                            return j.postDispatch && j.postDispatch.call(this, a), a.result
                        }
                    },
                    handlers: function(a, b) {
                        var c, d, e, f, g = [],
                            h = b.delegateCount,
                            i = a.target;
                        if (h && i.nodeType && (!a.button || "click" !== a.type))
                            for (; i != this; i = i.parentNode || this)
                                if (1 === i.nodeType && (i.disabled !== !0 || "click" !== a.type)) {
                                    for (e = [], f = 0; h > f; f++) d = b[f], c = d.selector + " ", void 0 === e[c] && (e[c] = d.needsContext ? ea(c, this).index(i) >= 0 : ea.find(c, this, null, [i]).length), e[c] && e.push(d);
                                    e.length && g.push({
                                        elem: i,
                                        handlers: e
                                    })
                                }
                        return h < b.length && g.push({
                            elem: this,
                            handlers: b.slice(h)
                        }), g
                    },
                    fix: function(a) {
                        if (a[ea.expando]) return a;
                        var b, c, d, e = a.type,
                            f = a,
                            g = this.fixHooks[e];
                        for (g || (this.fixHooks[e] = g = Ha.test(e) ? this.mouseHooks : Ga.test(e) ? this.keyHooks : {}), d = g.props ? this.props.concat(g.props) : this.props, a = new ea.Event(f), b = d.length; b--;) c = d[b], a[c] = f[c];
                        return a.target || (a.target = f.srcElement || oa), 3 === a.target.nodeType && (a.target = a.target.parentNode), a.metaKey = !!a.metaKey, g.filter ? g.filter(a, f) : a
                    },
                    props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
                    fixHooks: {},
                    keyHooks: {
                        props: "char charCode key keyCode".split(" "),
                        filter: function(a, b) {
                            return null == a.which && (a.which = null != b.charCode ? b.charCode : b.keyCode), a
                        }
                    },
                    mouseHooks: {
                        props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
                        filter: function(a, b) {
                            var c, d, e, f = b.button,
                                g = b.fromElement;
                            return null == a.pageX && null != b.clientX && (d = a.target.ownerDocument || oa, e = d.documentElement, c = d.body, a.pageX = b.clientX + (e && e.scrollLeft || c && c.scrollLeft || 0) - (e && e.clientLeft || c && c.clientLeft || 0), a.pageY = b.clientY + (e && e.scrollTop || c && c.scrollTop || 0) - (e && e.clientTop || c && c.clientTop || 0)), !a.relatedTarget && g && (a.relatedTarget = g === a.target ? b.toElement : g), a.which || void 0 === f || (a.which = 1 & f ? 1 : 2 & f ? 3 : 4 & f ? 2 : 0), a
                        }
                    },
                    special: {
                        load: {
                            noBubble: !0
                        },
                        focus: {
                            trigger: function() {
                                if (this !== o() && this.focus) try {
                                    return this.focus(), !1
                                } catch (a) {}
                            },
                            delegateType: "focusin"
                        },
                        blur: {
                            trigger: function() {
                                return this === o() && this.blur ? (this.blur(), !1) : void 0
                            },
                            delegateType: "focusout"
                        },
                        click: {
                            trigger: function() {
                                return ea.nodeName(this, "input") && "checkbox" === this.type && this.click ? (this.click(), !1) : void 0
                            },
                            _default: function(a) {
                                return ea.nodeName(a.target, "a")
                            }
                        },
                        beforeunload: {
                            postDispatch: function(a) {
                                void 0 !== a.result && a.originalEvent && (a.originalEvent.returnValue = a.result)
                            }
                        }
                    },
                    simulate: function(a, b, c, d) {
                        var e = ea.extend(new ea.Event, c, {
                            type: a,
                            isSimulated: !0,
                            originalEvent: {}
                        });
                        d ? ea.event.trigger(e, null, b) : ea.event.dispatch.call(b, e), e.isDefaultPrevented() && c.preventDefault()
                    }
                }, ea.removeEvent = oa.removeEventListener ? function(a, b, c) {
                    a.removeEventListener && a.removeEventListener(b, c, !1)
                } : function(a, b, c) {
                    var d = "on" + b;
                    a.detachEvent && (typeof a[d] === xa && (a[d] = null), a.detachEvent(d, c))
                }, ea.Event = function(a, b) {
                    return this instanceof ea.Event ? (a && a.type ? (this.originalEvent = a, this.type = a.type, this.isDefaultPrevented = a.defaultPrevented || void 0 === a.defaultPrevented && a.returnValue === !1 ? m : n) : this.type = a, b && ea.extend(this, b), this.timeStamp = a && a.timeStamp || ea.now(), void(this[ea.expando] = !0)) : new ea.Event(a, b)
                }, ea.Event.prototype = {
                    isDefaultPrevented: n,
                    isPropagationStopped: n,
                    isImmediatePropagationStopped: n,
                    preventDefault: function() {
                        var a = this.originalEvent;
                        this.isDefaultPrevented = m, a && (a.preventDefault ? a.preventDefault() : a.returnValue = !1)
                    },
                    stopPropagation: function() {
                        var a = this.originalEvent;
                        this.isPropagationStopped = m, a && (a.stopPropagation && a.stopPropagation(), a.cancelBubble = !0)
                    },
                    stopImmediatePropagation: function() {
                        var a = this.originalEvent;
                        this.isImmediatePropagationStopped = m, a && a.stopImmediatePropagation && a.stopImmediatePropagation(), this.stopPropagation()
                    }
                }, ea.each({
                    mouseenter: "mouseover",
                    mouseleave: "mouseout",
                    pointerenter: "pointerover",
                    pointerleave: "pointerout"
                }, function(a, b) {
                    ea.event.special[a] = {
                        delegateType: b,
                        bindType: b,
                        handle: function(a) {
                            var c, d = this,
                                e = a.relatedTarget,
                                f = a.handleObj;
                            return (!e || e !== d && !ea.contains(d, e)) && (a.type = f.origType, c = f.handler.apply(this, arguments), a.type = b), c
                        }
                    }
                }), ca.submitBubbles || (ea.event.special.submit = {
                    setup: function() {
                        return ea.nodeName(this, "form") ? !1 : void ea.event.add(this, "click._submit keypress._submit", function(a) {
                            var b = a.target,
                                c = ea.nodeName(b, "input") || ea.nodeName(b, "button") ? b.form : void 0;
                            c && !ea._data(c, "submitBubbles") && (ea.event.add(c, "submit._submit", function(a) {
                                a._submit_bubble = !0
                            }), ea._data(c, "submitBubbles", !0))
                        })
                    },
                    postDispatch: function(a) {
                        a._submit_bubble && (delete a._submit_bubble, this.parentNode && !a.isTrigger && ea.event.simulate("submit", this.parentNode, a, !0))
                    },
                    teardown: function() {
                        return ea.nodeName(this, "form") ? !1 : void ea.event.remove(this, "._submit")
                    }
                }), ca.changeBubbles || (ea.event.special.change = {
                    setup: function() {
                        return Fa.test(this.nodeName) ? (("checkbox" === this.type || "radio" === this.type) && (ea.event.add(this, "propertychange._change", function(a) {
                            "checked" === a.originalEvent.propertyName && (this._just_changed = !0)
                        }), ea.event.add(this, "click._change", function(a) {
                            this._just_changed && !a.isTrigger && (this._just_changed = !1), ea.event.simulate("change", this, a, !0)
                        })), !1) : void ea.event.add(this, "beforeactivate._change", function(a) {
                            var b = a.target;
                            Fa.test(b.nodeName) && !ea._data(b, "changeBubbles") && (ea.event.add(b, "change._change", function(a) {
                                !this.parentNode || a.isSimulated || a.isTrigger || ea.event.simulate("change", this.parentNode, a, !0)
                            }), ea._data(b, "changeBubbles", !0))
                        })
                    },
                    handle: function(a) {
                        var b = a.target;
                        return this !== b || a.isSimulated || a.isTrigger || "radio" !== b.type && "checkbox" !== b.type ? a.handleObj.handler.apply(this, arguments) : void 0
                    },
                    teardown: function() {
                        return ea.event.remove(this, "._change"), !Fa.test(this.nodeName)
                    }
                }), ca.focusinBubbles || ea.each({
                    focus: "focusin",
                    blur: "focusout"
                }, function(a, b) {
                    var c = function(a) {
                        ea.event.simulate(b, a.target, ea.event.fix(a), !0)
                    };
                    ea.event.special[b] = {
                        setup: function() {
                            var d = this.ownerDocument || this,
                                e = ea._data(d, b);
                            e || d.addEventListener(a, c, !0), ea._data(d, b, (e || 0) + 1)
                        },
                        teardown: function() {
                            var d = this.ownerDocument || this,
                                e = ea._data(d, b) - 1;
                            e ? ea._data(d, b, e) : (d.removeEventListener(a, c, !0), ea._removeData(d, b))
                        }
                    }
                }), ea.fn.extend({
                    on: function(a, b, c, d, e) {
                        var f, g;
                        if ("object" == typeof a) {
                            "string" != typeof b && (c = c || b, b = void 0);
                            for (f in a) this.on(f, b, c, a[f], e);
                            return this
                        }
                        if (null == c && null == d ? (d = b, c = b = void 0) : null == d && ("string" == typeof b ? (d = c, c = void 0) : (d = c, c = b, b = void 0)), d === !1) d = n;
                        else if (!d) return this;
                        return 1 === e && (g = d, d = function(a) {
                            return ea().off(a), g.apply(this, arguments)
                        }, d.guid = g.guid || (g.guid = ea.guid++)), this.each(function() {
                            ea.event.add(this, a, d, c, b)
                        })
                    },
                    one: function(a, b, c, d) {
                        return this.on(a, b, c, d, 1)
                    },
                    off: function(a, b, c) {
                        var d, e;
                        if (a && a.preventDefault && a.handleObj) return d = a.handleObj, ea(a.delegateTarget).off(d.namespace ? d.origType + "." + d.namespace : d.origType, d.selector, d.handler), this;
                        if ("object" == typeof a) {
                            for (e in a) this.off(e, b, a[e]);
                            return this
                        }
                        return (b === !1 || "function" == typeof b) && (c = b, b = void 0), c === !1 && (c = n), this.each(function() {
                            ea.event.remove(this, a, c, b)
                        })
                    },
                    trigger: function(a, b) {
                        return this.each(function() {
                            ea.event.trigger(a, b, this)
                        })
                    },
                    triggerHandler: function(a, b) {
                        var c = this[0];
                        return c ? ea.event.trigger(a, b, c, !0) : void 0
                    }
                });
                var Ka = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
                    La = / jQuery\d+="(?:null|\d+)"/g,
                    Ma = new RegExp("<(?:" + Ka + ")[\\s/>]", "i"),
                    Na = /^\s+/,
                    Oa = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
                    Pa = /<([\w:]+)/,
                    Qa = /<tbody/i,
                    Ra = /<|&#?\w+;/,
                    Sa = /<(?:script|style|link)/i,
                    Ta = /checked\s*(?:[^=]|=\s*.checked.)/i,
                    Ua = /^$|\/(?:java|ecma)script/i,
                    Va = /^true\/(.*)/,
                    Wa = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,
                    Xa = {
                        option: [1, "<select multiple='multiple'>", "</select>"],
                        legend: [1, "<fieldset>", "</fieldset>"],
                        area: [1, "<map>", "</map>"],
                        param: [1, "<object>", "</object>"],
                        thead: [1, "<table>", "</table>"],
                        tr: [2, "<table><tbody>", "</tbody></table>"],
                        col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
                        td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
                        _default: ca.htmlSerialize ? [0, "", ""] : [1, "X<div>", "</div>"]
                    },
                    Ya = p(oa),
                    Za = Ya.appendChild(oa.createElement("div"));
                Xa.optgroup = Xa.option, Xa.tbody = Xa.tfoot = Xa.colgroup = Xa.caption = Xa.thead, Xa.th = Xa.td, ea.extend({
                    clone: function(a, b, c) {
                        var d, e, f, g, h, i = ea.contains(a.ownerDocument, a);
                        if (ca.html5Clone || ea.isXMLDoc(a) || !Ma.test("<" + a.nodeName + ">") ? f = a.cloneNode(!0) : (Za.innerHTML = a.outerHTML, Za.removeChild(f = Za.firstChild)), !(ca.noCloneEvent && ca.noCloneChecked || 1 !== a.nodeType && 11 !== a.nodeType || ea.isXMLDoc(a)))
                            for (d = q(f), h = q(a), g = 0; null != (e = h[g]); ++g) d[g] && x(e, d[g]);
                        if (b)
                            if (c)
                                for (h = h || q(a), d = d || q(f), g = 0; null != (e = h[g]); g++) w(e, d[g]);
                            else w(a, f);
                        return d = q(f, "script"), d.length > 0 && v(d, !i && q(a, "script")), d = h = e = null, f
                    },
                    buildFragment: function(a, b, c, d) {
                        for (var e, f, g, h, i, j, k, l = a.length, m = p(b), n = [], o = 0; l > o; o++)
                            if (f = a[o], f || 0 === f)
                                if ("object" === ea.type(f)) ea.merge(n, f.nodeType ? [f] : f);
                                else if (Ra.test(f)) {
                            for (h = h || m.appendChild(b.createElement("div")), i = (Pa.exec(f) || ["", ""])[1].toLowerCase(), k = Xa[i] || Xa._default, h.innerHTML = k[1] + f.replace(Oa, "<$1></$2>") + k[2], e = k[0]; e--;) h = h.lastChild;
                            if (!ca.leadingWhitespace && Na.test(f) && n.push(b.createTextNode(Na.exec(f)[0])), !ca.tbody)
                                for (f = "table" !== i || Qa.test(f) ? "<table>" !== k[1] || Qa.test(f) ? 0 : h : h.firstChild, e = f && f.childNodes.length; e--;) ea.nodeName(j = f.childNodes[e], "tbody") && !j.childNodes.length && f.removeChild(j);
                            for (ea.merge(n, h.childNodes), h.textContent = ""; h.firstChild;) h.removeChild(h.firstChild);
                            h = m.lastChild
                        } else n.push(b.createTextNode(f));
                        for (h && m.removeChild(h), ca.appendChecked || ea.grep(q(n, "input"), r), o = 0; f = n[o++];)
                            if ((!d || -1 === ea.inArray(f, d)) && (g = ea.contains(f.ownerDocument, f), h = q(m.appendChild(f), "script"), g && v(h), c))
                                for (e = 0; f = h[e++];) Ua.test(f.type || "") && c.push(f);
                        return h = null, m
                    },
                    cleanData: function(a, b) {
                        for (var c, d, e, f, g = 0, h = ea.expando, i = ea.cache, j = ca.deleteExpando, k = ea.event.special; null != (c = a[g]); g++)
                            if ((b || ea.acceptData(c)) && (e = c[h], f = e && i[e])) {
                                if (f.events)
                                    for (d in f.events) k[d] ? ea.event.remove(c, d) : ea.removeEvent(c, d, f.handle);
                                i[e] && (delete i[e], j ? delete c[h] : typeof c.removeAttribute !== xa ? c.removeAttribute(h) : c[h] = null, W.push(e))
                            }
                    }
                }), ea.fn.extend({
                    text: function(a) {
                        return Da(this, function(a) {
                            return void 0 === a ? ea.text(this) : this.empty().append((this[0] && this[0].ownerDocument || oa).createTextNode(a))
                        }, null, a, arguments.length)
                    },
                    append: function() {
                        return this.domManip(arguments, function(a) {
                            if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                                var b = s(this, a);
                                b.appendChild(a)
                            }
                        })
                    },
                    prepend: function() {
                        return this.domManip(arguments, function(a) {
                            if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                                var b = s(this, a);
                                b.insertBefore(a, b.firstChild)
                            }
                        })
                    },
                    before: function() {
                        return this.domManip(arguments, function(a) {
                            this.parentNode && this.parentNode.insertBefore(a, this)
                        })
                    },
                    after: function() {
                        return this.domManip(arguments, function(a) {
                            this.parentNode && this.parentNode.insertBefore(a, this.nextSibling)
                        })
                    },
                    remove: function(a, b) {
                        for (var c, d = a ? ea.filter(a, this) : this, e = 0; null != (c = d[e]); e++) b || 1 !== c.nodeType || ea.cleanData(q(c)), c.parentNode && (b && ea.contains(c.ownerDocument, c) && v(q(c, "script")), c.parentNode.removeChild(c));
                        return this
                    },
                    empty: function() {
                        for (var a, b = 0; null != (a = this[b]); b++) {
                            for (1 === a.nodeType && ea.cleanData(q(a, !1)); a.firstChild;) a.removeChild(a.firstChild);
                            a.options && ea.nodeName(a, "select") && (a.options.length = 0)
                        }
                        return this
                    },
                    clone: function(a, b) {
                        return a = null == a ? !1 : a, b = null == b ? a : b, this.map(function() {
                            return ea.clone(this, a, b)
                        })
                    },
                    html: function(a) {
                        return Da(this, function(a) {
                            var b = this[0] || {},
                                c = 0,
                                d = this.length;
                            if (void 0 === a) return 1 === b.nodeType ? b.innerHTML.replace(La, "") : void 0;
                            if (!("string" != typeof a || Sa.test(a) || !ca.htmlSerialize && Ma.test(a) || !ca.leadingWhitespace && Na.test(a) || Xa[(Pa.exec(a) || ["", ""])[1].toLowerCase()])) {
                                a = a.replace(Oa, "<$1></$2>");
                                try {
                                    for (; d > c; c++) b = this[c] || {}, 1 === b.nodeType && (ea.cleanData(q(b, !1)), b.innerHTML = a);
                                    b = 0
                                } catch (e) {}
                            }
                            b && this.empty().append(a)
                        }, null, a, arguments.length)
                    },
                    replaceWith: function() {
                        var a = arguments[0];
                        return this.domManip(arguments, function(b) {
                            a = this.parentNode, ea.cleanData(q(this)), a && a.replaceChild(b, this)
                        }), a && (a.length || a.nodeType) ? this : this.remove()
                    },
                    detach: function(a) {
                        return this.remove(a, !0)
                    },
                    domManip: function(a, b) {
                        a = Y.apply([], a);
                        var c, d, e, f, g, h, i = 0,
                            j = this.length,
                            k = this,
                            l = j - 1,
                            m = a[0],
                            n = ea.isFunction(m);
                        if (n || j > 1 && "string" == typeof m && !ca.checkClone && Ta.test(m)) return this.each(function(c) {
                            var d = k.eq(c);
                            n && (a[0] = m.call(this, c, d.html())), d.domManip(a, b)
                        });
                        if (j && (h = ea.buildFragment(a, this[0].ownerDocument, !1, this), c = h.firstChild, 1 === h.childNodes.length && (h = c), c)) {
                            for (f = ea.map(q(h, "script"), t), e = f.length; j > i; i++) d = h, i !== l && (d = ea.clone(d, !0, !0), e && ea.merge(f, q(d, "script"))), b.call(this[i], d, i);
                            if (e)
                                for (g = f[f.length - 1].ownerDocument, ea.map(f, u), i = 0; e > i; i++) d = f[i], Ua.test(d.type || "") && !ea._data(d, "globalEval") && ea.contains(g, d) && (d.src ? ea._evalUrl && ea._evalUrl(d.src) : ea.globalEval((d.text || d.textContent || d.innerHTML || "").replace(Wa, "")));
                            h = c = null
                        }
                        return this
                    }
                }), ea.each({
                    appendTo: "append",
                    prependTo: "prepend",
                    insertBefore: "before",
                    insertAfter: "after",
                    replaceAll: "replaceWith"
                }, function(a, b) {
                    ea.fn[a] = function(a) {
                        for (var c, d = 0, e = [], f = ea(a), g = f.length - 1; g >= d; d++) c = d === g ? this : this.clone(!0), ea(f[d])[b](c), Z.apply(e, c.get());
                        return this.pushStack(e)
                    }
                });
                var $a, _a = {};
                ! function() {
                    var a;
                    ca.shrinkWrapBlocks = function() {
                        if (null != a) return a;
                        a = !1;
                        var b, c, d;
                        return c = oa.getElementsByTagName("body")[0], c && c.style ? (b = oa.createElement("div"), d = oa.createElement("div"), d.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px", c.appendChild(d).appendChild(b), typeof b.style.zoom !== xa && (b.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:1px;width:1px;zoom:1", b.appendChild(oa.createElement("div")).style.width = "5px", a = 3 !== b.offsetWidth), c.removeChild(d), a) : void 0
                    }
                }();
                var ab, bb, cb = /^margin/,
                    db = new RegExp("^(" + Aa + ")(?!px)[a-z%]+$", "i"),
                    eb = /^(top|right|bottom|left)$/;
                a.getComputedStyle ? (ab = function(b) {
                        return b.ownerDocument.defaultView.opener ? b.ownerDocument.defaultView.getComputedStyle(b, null) : a.getComputedStyle(b, null)
                    }, bb = function(a, b, c) {
                        var d, e, f, g, h = a.style;
                        return c = c || ab(a), g = c ? c.getPropertyValue(b) || c[b] : void 0, c && ("" !== g || ea.contains(a.ownerDocument, a) || (g = ea.style(a, b)), db.test(g) && cb.test(b) && (d = h.width, e = h.minWidth, f = h.maxWidth, h.minWidth = h.maxWidth = h.width = g, g = c.width, h.width = d, h.minWidth = e, h.maxWidth = f)), void 0 === g ? g : g + ""
                    }) : oa.documentElement.currentStyle && (ab = function(a) {
                        return a.currentStyle
                    }, bb = function(a, b, c) {
                        var d, e, f, g, h = a.style;
                        return c = c || ab(a), g = c ? c[b] : void 0, null == g && h && h[b] && (g = h[b]), db.test(g) && !eb.test(b) && (d = h.left, e = a.runtimeStyle, f = e && e.left, f && (e.left = a.currentStyle.left), h.left = "fontSize" === b ? "1em" : g, g = h.pixelLeft + "px", h.left = d, f && (e.left = f)), void 0 === g ? g : g + "" || "auto"
                    }),
                    function() {
                        function b() {
                            var b, c, d, e;
                            c = oa.getElementsByTagName("body")[0], c && c.style && (b = oa.createElement("div"), d = oa.createElement("div"), d.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px", c.appendChild(d).appendChild(b), b.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;display:block;margin-top:1%;top:1%;border:1px;padding:1px;width:4px;position:absolute", f = g = !1, i = !0, a.getComputedStyle && (f = "1%" !== (a.getComputedStyle(b, null) || {}).top, g = "4px" === (a.getComputedStyle(b, null) || {
                                width: "4px"
                            }).width, e = b.appendChild(oa.createElement("div")), e.style.cssText = b.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0", e.style.marginRight = e.style.width = "0", b.style.width = "1px", i = !parseFloat((a.getComputedStyle(e, null) || {}).marginRight), b.removeChild(e)), b.innerHTML = "<table><tr><td></td><td>t</td></tr></table>", e = b.getElementsByTagName("td"), e[0].style.cssText = "margin:0;border:0;padding:0;display:none", h = 0 === e[0].offsetHeight, h && (e[0].style.display = "", e[1].style.display = "none", h = 0 === e[0].offsetHeight), c.removeChild(d))
                        }
                        var c, d, e, f, g, h, i;
                        c = oa.createElement("div"), c.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", e = c.getElementsByTagName("a")[0], d = e && e.style, d && (d.cssText = "float:left;opacity:.5", ca.opacity = "0.5" === d.opacity, ca.cssFloat = !!d.cssFloat, c.style.backgroundClip = "content-box", c.cloneNode(!0).style.backgroundClip = "", ca.clearCloneStyle = "content-box" === c.style.backgroundClip, ca.boxSizing = "" === d.boxSizing || "" === d.MozBoxSizing || "" === d.WebkitBoxSizing, ea.extend(ca, {
                            reliableHiddenOffsets: function() {
                                return null == h && b(), h
                            },
                            boxSizingReliable: function() {
                                return null == g && b(), g
                            },
                            pixelPosition: function() {
                                return null == f && b(), f
                            },
                            reliableMarginRight: function() {
                                return null == i && b(), i
                            }
                        }))
                    }(), ea.swap = function(a, b, c, d) {
                        var e, f, g = {};
                        for (f in b) g[f] = a.style[f], a.style[f] = b[f];
                        e = c.apply(a, d || []);
                        for (f in b) a.style[f] = g[f];
                        return e
                    };
                var fb = /alpha\([^)]*\)/i,
                    gb = /opacity\s*=\s*([^)]*)/,
                    hb = /^(none|table(?!-c[ea]).+)/,
                    ib = new RegExp("^(" + Aa + ")(.*)$", "i"),
                    jb = new RegExp("^([+-])=(" + Aa + ")", "i"),
                    kb = {
                        position: "absolute",
                        visibility: "hidden",
                        display: "block"
                    },
                    lb = {
                        letterSpacing: "0",
                        fontWeight: "400"
                    },
                    mb = ["Webkit", "O", "Moz", "ms"];
                ea.extend({
                    cssHooks: {
                        opacity: {
                            get: function(a, b) {
                                if (b) {
                                    var c = bb(a, "opacity");
                                    return "" === c ? "1" : c
                                }
                            }
                        }
                    },
                    cssNumber: {
                        columnCount: !0,
                        fillOpacity: !0,
                        flexGrow: !0,
                        flexShrink: !0,
                        fontWeight: !0,
                        lineHeight: !0,
                        opacity: !0,
                        order: !0,
                        orphans: !0,
                        widows: !0,
                        zIndex: !0,
                        zoom: !0
                    },
                    cssProps: {
                        "float": ca.cssFloat ? "cssFloat" : "styleFloat"
                    },
                    style: function(a, b, c, d) {
                        if (a && 3 !== a.nodeType && 8 !== a.nodeType && a.style) {
                            var e, f, g, h = ea.camelCase(b),
                                i = a.style;
                            if (b = ea.cssProps[h] || (ea.cssProps[h] = B(i, h)), g = ea.cssHooks[b] || ea.cssHooks[h], void 0 === c) return g && "get" in g && void 0 !== (e = g.get(a, !1, d)) ? e : i[b];
                            if (f = typeof c, "string" === f && (e = jb.exec(c)) && (c = (e[1] + 1) * e[2] + parseFloat(ea.css(a, b)), f = "number"), null != c && c === c && ("number" !== f || ea.cssNumber[h] || (c += "px"), ca.clearCloneStyle || "" !== c || 0 !== b.indexOf("background") || (i[b] = "inherit"), !(g && "set" in g && void 0 === (c = g.set(a, c, d))))) try {
                                i[b] = c
                            } catch (j) {}
                        }
                    },
                    css: function(a, b, c, d) {
                        var e, f, g, h = ea.camelCase(b);
                        return b = ea.cssProps[h] || (ea.cssProps[h] = B(a.style, h)), g = ea.cssHooks[b] || ea.cssHooks[h], g && "get" in g && (f = g.get(a, !0, c)), void 0 === f && (f = bb(a, b, d)), "normal" === f && b in lb && (f = lb[b]), "" === c || c ? (e = parseFloat(f), c === !0 || ea.isNumeric(e) ? e || 0 : f) : f
                    }
                }), ea.each(["height", "width"], function(a, b) {
                    ea.cssHooks[b] = {
                        get: function(a, c, d) {
                            return c ? hb.test(ea.css(a, "display")) && 0 === a.offsetWidth ? ea.swap(a, kb, function() {
                                return F(a, b, d)
                            }) : F(a, b, d) : void 0
                        },
                        set: function(a, c, d) {
                            var e = d && ab(a);
                            return D(a, c, d ? E(a, b, d, ca.boxSizing && "border-box" === ea.css(a, "boxSizing", !1, e), e) : 0)
                        }
                    }
                }), ca.opacity || (ea.cssHooks.opacity = {
                    get: function(a, b) {
                        return gb.test((b && a.currentStyle ? a.currentStyle.filter : a.style.filter) || "") ? .01 * parseFloat(RegExp.$1) + "" : b ? "1" : ""
                    },
                    set: function(a, b) {
                        var c = a.style,
                            d = a.currentStyle,
                            e = ea.isNumeric(b) ? "alpha(opacity=" + 100 * b + ")" : "",
                            f = d && d.filter || c.filter || "";
                        c.zoom = 1, (b >= 1 || "" === b) && "" === ea.trim(f.replace(fb, "")) && c.removeAttribute && (c.removeAttribute("filter"), "" === b || d && !d.filter) || (c.filter = fb.test(f) ? f.replace(fb, e) : f + " " + e)
                    }
                }), ea.cssHooks.marginRight = A(ca.reliableMarginRight, function(a, b) {
                    return b ? ea.swap(a, {
                        display: "inline-block"
                    }, bb, [a, "marginRight"]) : void 0
                }), ea.each({
                    margin: "",
                    padding: "",
                    border: "Width"
                }, function(a, b) {
                    ea.cssHooks[a + b] = {
                        expand: function(c) {
                            for (var d = 0, e = {}, f = "string" == typeof c ? c.split(" ") : [c]; 4 > d; d++) e[a + Ba[d] + b] = f[d] || f[d - 2] || f[0];
                            return e
                        }
                    }, cb.test(a) || (ea.cssHooks[a + b].set = D)
                }), ea.fn.extend({
                    css: function(a, b) {
                        return Da(this, function(a, b, c) {
                            var d, e, f = {},
                                g = 0;
                            if (ea.isArray(b)) {
                                for (d = ab(a), e = b.length; e > g; g++) f[b[g]] = ea.css(a, b[g], !1, d);
                                return f
                            }
                            return void 0 !== c ? ea.style(a, b, c) : ea.css(a, b)
                        }, a, b, arguments.length > 1)
                    },
                    show: function() {
                        return C(this, !0)
                    },
                    hide: function() {
                        return C(this)
                    },
                    toggle: function(a) {
                        return "boolean" == typeof a ? a ? this.show() : this.hide() : this.each(function() {
                            Ca(this) ? ea(this).show() : ea(this).hide()
                        })
                    }
                }), ea.Tween = G, G.prototype = {
                    constructor: G,
                    init: function(a, b, c, d, e, f) {
                        this.elem = a, this.prop = c, this.easing = e || "swing", this.options = b, this.start = this.now = this.cur(), this.end = d, this.unit = f || (ea.cssNumber[c] ? "" : "px")
                    },
                    cur: function() {
                        var a = G.propHooks[this.prop];
                        return a && a.get ? a.get(this) : G.propHooks._default.get(this)
                    },
                    run: function(a) {
                        var b, c = G.propHooks[this.prop];
                        return this.options.duration ? this.pos = b = ea.easing[this.easing](a, this.options.duration * a, 0, 1, this.options.duration) : this.pos = b = a, this.now = (this.end - this.start) * b + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), c && c.set ? c.set(this) : G.propHooks._default.set(this), this
                    }
                }, G.prototype.init.prototype = G.prototype, G.propHooks = {
                    _default: {
                        get: function(a) {
                            var b;
                            return null == a.elem[a.prop] || a.elem.style && null != a.elem.style[a.prop] ? (b = ea.css(a.elem, a.prop, ""), b && "auto" !== b ? b : 0) : a.elem[a.prop]
                        },
                        set: function(a) {
                            ea.fx.step[a.prop] ? ea.fx.step[a.prop](a) : a.elem.style && (null != a.elem.style[ea.cssProps[a.prop]] || ea.cssHooks[a.prop]) ? ea.style(a.elem, a.prop, a.now + a.unit) : a.elem[a.prop] = a.now
                        }
                    }
                }, G.propHooks.scrollTop = G.propHooks.scrollLeft = {
                    set: function(a) {
                        a.elem.nodeType && a.elem.parentNode && (a.elem[a.prop] = a.now)
                    }
                }, ea.easing = {
                    linear: function(a) {
                        return a
                    },
                    swing: function(a) {
                        return .5 - Math.cos(a * Math.PI) / 2
                    }
                }, ea.fx = G.prototype.init, ea.fx.step = {};
                var nb, ob, pb = /^(?:toggle|show|hide)$/,
                    qb = new RegExp("^(?:([+-])=|)(" + Aa + ")([a-z%]*)$", "i"),
                    rb = /queueHooks$/,
                    sb = [K],
                    tb = {
                        "*": [function(a, b) {
                            var c = this.createTween(a, b),
                                d = c.cur(),
                                e = qb.exec(b),
                                f = e && e[3] || (ea.cssNumber[a] ? "" : "px"),
                                g = (ea.cssNumber[a] || "px" !== f && +d) && qb.exec(ea.css(c.elem, a)),
                                h = 1,
                                i = 20;
                            if (g && g[3] !== f) {
                                f = f || g[3], e = e || [], g = +d || 1;
                                do h = h || ".5", g /= h, ea.style(c.elem, a, g + f); while (h !== (h = c.cur() / d) && 1 !== h && --i)
                            }
                            return e && (g = c.start = +g || +d || 0, c.unit = f, c.end = e[1] ? g + (e[1] + 1) * e[2] : +e[2]), c
                        }]
                    };
                ea.Animation = ea.extend(M, {
                        tweener: function(a, b) {
                            ea.isFunction(a) ? (b = a, a = ["*"]) : a = a.split(" ");
                            for (var c, d = 0, e = a.length; e > d; d++) c = a[d], tb[c] = tb[c] || [], tb[c].unshift(b)
                        },
                        prefilter: function(a, b) {
                            b ? sb.unshift(a) : sb.push(a)
                        }
                    }), ea.speed = function(a, b, c) {
                        var d = a && "object" == typeof a ? ea.extend({}, a) : {
                            complete: c || !c && b || ea.isFunction(a) && a,
                            duration: a,
                            easing: c && b || b && !ea.isFunction(b) && b
                        };
                        return d.duration = ea.fx.off ? 0 : "number" == typeof d.duration ? d.duration : d.duration in ea.fx.speeds ? ea.fx.speeds[d.duration] : ea.fx.speeds._default, (null == d.queue || d.queue === !0) && (d.queue = "fx"), d.old = d.complete, d.complete = function() {
                            ea.isFunction(d.old) && d.old.call(this), d.queue && ea.dequeue(this, d.queue)
                        }, d
                    }, ea.fn.extend({
                        fadeTo: function(a, b, c, d) {
                            return this.filter(Ca).css("opacity", 0).show().end().animate({
                                opacity: b
                            }, a, c, d)
                        },
                        animate: function(a, b, c, d) {
                            var e = ea.isEmptyObject(a),
                                f = ea.speed(b, c, d),
                                g = function() {
                                    var b = M(this, ea.extend({}, a), f);
                                    (e || ea._data(this, "finish")) && b.stop(!0)
                                };
                            return g.finish = g, e || f.queue === !1 ? this.each(g) : this.queue(f.queue, g)
                        },
                        stop: function(a, b, c) {
                            var d = function(a) {
                                var b = a.stop;
                                delete a.stop, b(c)
                            };
                            return "string" != typeof a && (c = b, b = a, a = void 0), b && a !== !1 && this.queue(a || "fx", []), this.each(function() {
                                var b = !0,
                                    e = null != a && a + "queueHooks",
                                    f = ea.timers,
                                    g = ea._data(this);
                                if (e) g[e] && g[e].stop && d(g[e]);
                                else
                                    for (e in g) g[e] && g[e].stop && rb.test(e) && d(g[e]);
                                for (e = f.length; e--;) f[e].elem !== this || null != a && f[e].queue !== a || (f[e].anim.stop(c), b = !1, f.splice(e, 1));
                                (b || !c) && ea.dequeue(this, a)
                            })
                        },
                        finish: function(a) {
                            return a !== !1 && (a = a || "fx"), this.each(function() {
                                var b, c = ea._data(this),
                                    d = c[a + "queue"],
                                    e = c[a + "queueHooks"],
                                    f = ea.timers,
                                    g = d ? d.length : 0;
                                for (c.finish = !0, ea.queue(this, a, []), e && e.stop && e.stop.call(this, !0), b = f.length; b--;) f[b].elem === this && f[b].queue === a && (f[b].anim.stop(!0), f.splice(b, 1));
                                for (b = 0; g > b; b++) d[b] && d[b].finish && d[b].finish.call(this);
                                delete c.finish
                            })
                        }
                    }), ea.each(["toggle", "show", "hide"], function(a, b) {
                        var c = ea.fn[b];
                        ea.fn[b] = function(a, d, e) {
                            return null == a || "boolean" == typeof a ? c.apply(this, arguments) : this.animate(I(b, !0), a, d, e)
                        }
                    }), ea.each({
                        slideDown: I("show"),
                        slideUp: I("hide"),
                        slideToggle: I("toggle"),
                        fadeIn: {
                            opacity: "show"
                        },
                        fadeOut: {
                            opacity: "hide"
                        },
                        fadeToggle: {
                            opacity: "toggle"
                        }
                    }, function(a, b) {
                        ea.fn[a] = function(a, c, d) {
                            return this.animate(b, a, c, d)
                        }
                    }), ea.timers = [], ea.fx.tick = function() {
                        var a, b = ea.timers,
                            c = 0;
                        for (nb = ea.now(); c < b.length; c++) a = b[c], a() || b[c] !== a || b.splice(c--, 1);
                        b.length || ea.fx.stop(), nb = void 0
                    }, ea.fx.timer = function(a) {
                        ea.timers.push(a), a() ? ea.fx.start() : ea.timers.pop()
                    }, ea.fx.interval = 13, ea.fx.start = function() {
                        ob || (ob = setInterval(ea.fx.tick, ea.fx.interval))
                    }, ea.fx.stop = function() {
                        clearInterval(ob), ob = null
                    }, ea.fx.speeds = {
                        slow: 600,
                        fast: 200,
                        _default: 400
                    }, ea.fn.delay = function(a, b) {
                        return a = ea.fx ? ea.fx.speeds[a] || a : a, b = b || "fx", this.queue(b, function(b, c) {
                            var d = setTimeout(b, a);
                            c.stop = function() {
                                clearTimeout(d)
                            }
                        })
                    },
                    function() {
                        var a, b, c, d, e;
                        b = oa.createElement("div"), b.setAttribute("className", "t"), b.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", d = b.getElementsByTagName("a")[0], c = oa.createElement("select"), e = c.appendChild(oa.createElement("option")), a = b.getElementsByTagName("input")[0], d.style.cssText = "top:1px", ca.getSetAttribute = "t" !== b.className, ca.style = /top/.test(d.getAttribute("style")), ca.hrefNormalized = "/a" === d.getAttribute("href"), ca.checkOn = !!a.value, ca.optSelected = e.selected, ca.enctype = !!oa.createElement("form").enctype, c.disabled = !0, ca.optDisabled = !e.disabled, a = oa.createElement("input"), a.setAttribute("value", ""), ca.input = "" === a.getAttribute("value"), a.value = "t", a.setAttribute("type", "radio"), ca.radioValue = "t" === a.value
                    }();
                var ub = /\r/g;
                ea.fn.extend({
                    val: function(a) {
                        var b, c, d, e = this[0]; {
                            if (arguments.length) return d = ea.isFunction(a), this.each(function(c) {
                                var e;
                                1 === this.nodeType && (e = d ? a.call(this, c, ea(this).val()) : a, null == e ? e = "" : "number" == typeof e ? e += "" : ea.isArray(e) && (e = ea.map(e, function(a) {
                                    return null == a ? "" : a + ""
                                })), b = ea.valHooks[this.type] || ea.valHooks[this.nodeName.toLowerCase()], b && "set" in b && void 0 !== b.set(this, e, "value") || (this.value = e))
                            });
                            if (e) return b = ea.valHooks[e.type] || ea.valHooks[e.nodeName.toLowerCase()], b && "get" in b && void 0 !== (c = b.get(e, "value")) ? c : (c = e.value, "string" == typeof c ? c.replace(ub, "") : null == c ? "" : c)
                        }
                    }
                }), ea.extend({
                    valHooks: {
                        option: {
                            get: function(a) {
                                var b = ea.find.attr(a, "value");
                                return null != b ? b : ea.trim(ea.text(a))
                            }
                        },
                        select: {
                            get: function(a) {
                                for (var b, c, d = a.options, e = a.selectedIndex, f = "select-one" === a.type || 0 > e, g = f ? null : [], h = f ? e + 1 : d.length, i = 0 > e ? h : f ? e : 0; h > i; i++)
                                    if (c = d[i], !(!c.selected && i !== e || (ca.optDisabled ? c.disabled : null !== c.getAttribute("disabled")) || c.parentNode.disabled && ea.nodeName(c.parentNode, "optgroup"))) {
                                        if (b = ea(c).val(), f) return b;
                                        g.push(b)
                                    }
                                return g
                            },
                            set: function(a, b) {
                                for (var c, d, e = a.options, f = ea.makeArray(b), g = e.length; g--;)
                                    if (d = e[g], ea.inArray(ea.valHooks.option.get(d), f) >= 0) try {
                                        d.selected = c = !0
                                    } catch (h) {
                                        d.scrollHeight
                                    } else d.selected = !1;
                                return c || (a.selectedIndex = -1), e
                            }
                        }
                    }
                }), ea.each(["radio", "checkbox"], function() {
                    ea.valHooks[this] = {
                        set: function(a, b) {
                            return ea.isArray(b) ? a.checked = ea.inArray(ea(a).val(), b) >= 0 : void 0
                        }
                    }, ca.checkOn || (ea.valHooks[this].get = function(a) {
                        return null === a.getAttribute("value") ? "on" : a.value
                    })
                });
                var vb, wb, xb = ea.expr.attrHandle,
                    yb = /^(?:checked|selected)$/i,
                    zb = ca.getSetAttribute,
                    Ab = ca.input;
                ea.fn.extend({
                    attr: function(a, b) {
                        return Da(this, ea.attr, a, b, arguments.length > 1)
                    },
                    removeAttr: function(a) {
                        return this.each(function() {
                            ea.removeAttr(this, a)
                        })
                    }
                }), ea.extend({
                    attr: function(a, b, c) {
                        var d, e, f = a.nodeType;
                        if (a && 3 !== f && 8 !== f && 2 !== f) return typeof a.getAttribute === xa ? ea.prop(a, b, c) : (1 === f && ea.isXMLDoc(a) || (b = b.toLowerCase(), d = ea.attrHooks[b] || (ea.expr.match.bool.test(b) ? wb : vb)), void 0 === c ? d && "get" in d && null !== (e = d.get(a, b)) ? e : (e = ea.find.attr(a, b), null == e ? void 0 : e) : null !== c ? d && "set" in d && void 0 !== (e = d.set(a, c, b)) ? e : (a.setAttribute(b, c + ""), c) : void ea.removeAttr(a, b))
                    },
                    removeAttr: function(a, b) {
                        var c, d, e = 0,
                            f = b && b.match(ta);
                        if (f && 1 === a.nodeType)
                            for (; c = f[e++];) d = ea.propFix[c] || c, ea.expr.match.bool.test(c) ? Ab && zb || !yb.test(c) ? a[d] = !1 : a[ea.camelCase("default-" + c)] = a[d] = !1 : ea.attr(a, c, ""), a.removeAttribute(zb ? c : d)
                    },
                    attrHooks: {
                        type: {
                            set: function(a, b) {
                                if (!ca.radioValue && "radio" === b && ea.nodeName(a, "input")) {
                                    var c = a.value;
                                    return a.setAttribute("type", b), c && (a.value = c), b
                                }
                            }
                        }
                    }
                }), wb = {
                    set: function(a, b, c) {
                        return b === !1 ? ea.removeAttr(a, c) : Ab && zb || !yb.test(c) ? a.setAttribute(!zb && ea.propFix[c] || c, c) : a[ea.camelCase("default-" + c)] = a[c] = !0, c
                    }
                }, ea.each(ea.expr.match.bool.source.match(/\w+/g), function(a, b) {
                    var c = xb[b] || ea.find.attr;
                    xb[b] = Ab && zb || !yb.test(b) ? function(a, b, d) {
                        var e, f;
                        return d || (f = xb[b], xb[b] = e, e = null != c(a, b, d) ? b.toLowerCase() : null, xb[b] = f), e
                    } : function(a, b, c) {
                        return c ? void 0 : a[ea.camelCase("default-" + b)] ? b.toLowerCase() : null
                    }
                }), Ab && zb || (ea.attrHooks.value = {
                    set: function(a, b, c) {
                        return ea.nodeName(a, "input") ? void(a.defaultValue = b) : vb && vb.set(a, b, c)
                    }
                }), zb || (vb = {
                    set: function(a, b, c) {
                        var d = a.getAttributeNode(c);
                        return d || a.setAttributeNode(d = a.ownerDocument.createAttribute(c)), d.value = b += "", "value" === c || b === a.getAttribute(c) ? b : void 0
                    }
                }, xb.id = xb.name = xb.coords = function(a, b, c) {
                    var d;
                    return c ? void 0 : (d = a.getAttributeNode(b)) && "" !== d.value ? d.value : null
                }, ea.valHooks.button = {
                    get: function(a, b) {
                        var c = a.getAttributeNode(b);
                        return c && c.specified ? c.value : void 0
                    },
                    set: vb.set
                }, ea.attrHooks.contenteditable = {
                    set: function(a, b, c) {
                        vb.set(a, "" === b ? !1 : b, c)
                    }
                }, ea.each(["width", "height"], function(a, b) {
                    ea.attrHooks[b] = {
                        set: function(a, c) {
                            return "" === c ? (a.setAttribute(b, "auto"), c) : void 0
                        }
                    }
                })), ca.style || (ea.attrHooks.style = {
                    get: function(a) {
                        return a.style.cssText || void 0
                    },
                    set: function(a, b) {
                        return a.style.cssText = b + ""
                    }
                });
                var Bb = /^(?:input|select|textarea|button|object)$/i,
                    Cb = /^(?:a|area)$/i;
                ea.fn.extend({
                    prop: function(a, b) {
                        return Da(this, ea.prop, a, b, arguments.length > 1)
                    },
                    removeProp: function(a) {
                        return a = ea.propFix[a] || a, this.each(function() {
                            try {
                                this[a] = void 0, delete this[a]
                            } catch (b) {}
                        })
                    }
                }), ea.extend({
                    propFix: {
                        "for": "htmlFor",
                        "class": "className"
                    },
                    prop: function(a, b, c) {
                        var d, e, f, g = a.nodeType;
                        if (a && 3 !== g && 8 !== g && 2 !== g) return f = 1 !== g || !ea.isXMLDoc(a), f && (b = ea.propFix[b] || b, e = ea.propHooks[b]), void 0 !== c ? e && "set" in e && void 0 !== (d = e.set(a, c, b)) ? d : a[b] = c : e && "get" in e && null !== (d = e.get(a, b)) ? d : a[b]
                    },
                    propHooks: {
                        tabIndex: {
                            get: function(a) {
                                var b = ea.find.attr(a, "tabindex");
                                return b ? parseInt(b, 10) : Bb.test(a.nodeName) || Cb.test(a.nodeName) && a.href ? 0 : -1
                            }
                        }
                    }
                }), ca.hrefNormalized || ea.each(["href", "src"], function(a, b) {
                    ea.propHooks[b] = {
                        get: function(a) {
                            return a.getAttribute(b, 4)
                        }
                    }
                }), ca.optSelected || (ea.propHooks.selected = {
                    get: function(a) {
                        var b = a.parentNode;
                        return b && (b.selectedIndex, b.parentNode && b.parentNode.selectedIndex), null
                    }
                }), ea.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function() {
                    ea.propFix[this.toLowerCase()] = this
                }), ca.enctype || (ea.propFix.enctype = "encoding");
                var Db = /[\t\r\n\f]/g;
                ea.fn.extend({
                    addClass: function(a) {
                        var b, c, d, e, f, g, h = 0,
                            i = this.length,
                            j = "string" == typeof a && a;
                        if (ea.isFunction(a)) return this.each(function(b) {
                            ea(this).addClass(a.call(this, b, this.className))
                        });
                        if (j)
                            for (b = (a || "").match(ta) || []; i > h; h++)
                                if (c = this[h], d = 1 === c.nodeType && (c.className ? (" " + c.className + " ").replace(Db, " ") : " ")) {
                                    for (f = 0; e = b[f++];) d.indexOf(" " + e + " ") < 0 && (d += e + " ");
                                    g = ea.trim(d), c.className !== g && (c.className = g)
                                }
                        return this
                    },
                    removeClass: function(a) {
                        var b, c, d, e, f, g, h = 0,
                            i = this.length,
                            j = 0 === arguments.length || "string" == typeof a && a;
                        if (ea.isFunction(a)) return this.each(function(b) {
                            ea(this).removeClass(a.call(this, b, this.className))
                        });
                        if (j)
                            for (b = (a || "").match(ta) || []; i > h; h++)
                                if (c = this[h], d = 1 === c.nodeType && (c.className ? (" " + c.className + " ").replace(Db, " ") : "")) {
                                    for (f = 0; e = b[f++];)
                                        for (; d.indexOf(" " + e + " ") >= 0;) d = d.replace(" " + e + " ", " ");
                                    g = a ? ea.trim(d) : "", c.className !== g && (c.className = g)
                                }
                        return this
                    },
                    toggleClass: function(a, b) {
                        var c = typeof a;
                        return "boolean" == typeof b && "string" === c ? b ? this.addClass(a) : this.removeClass(a) : ea.isFunction(a) ? this.each(function(c) {
                            ea(this).toggleClass(a.call(this, c, this.className, b), b)
                        }) : this.each(function() {
                            if ("string" === c)
                                for (var b, d = 0, e = ea(this), f = a.match(ta) || []; b = f[d++];) e.hasClass(b) ? e.removeClass(b) : e.addClass(b);
                            else(c === xa || "boolean" === c) && (this.className && ea._data(this, "__className__", this.className), this.className = this.className || a === !1 ? "" : ea._data(this, "__className__") || "")
                        })
                    },
                    hasClass: function(a) {
                        for (var b = " " + a + " ", c = 0, d = this.length; d > c; c++)
                            if (1 === this[c].nodeType && (" " + this[c].className + " ").replace(Db, " ").indexOf(b) >= 0) return !0;
                        return !1
                    }
                }), ea.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function(a, b) {
                    ea.fn[b] = function(a, c) {
                        return arguments.length > 0 ? this.on(b, null, a, c) : this.trigger(b)
                    }
                }), ea.fn.extend({
                    hover: function(a, b) {
                        return this.mouseenter(a).mouseleave(b || a)
                    },
                    bind: function(a, b, c) {
                        return this.on(a, null, b, c)
                    },
                    unbind: function(a, b) {
                        return this.off(a, null, b)
                    },
                    delegate: function(a, b, c, d) {
                        return this.on(b, a, c, d)
                    },
                    undelegate: function(a, b, c) {
                        return 1 === arguments.length ? this.off(a, "**") : this.off(b, a || "**", c)
                    }
                });
                var Eb = ea.now(),
                    Fb = /\?/,
                    Gb = /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;
                ea.parseJSON = function(b) {
                    if (a.JSON && a.JSON.parse) return a.JSON.parse(b + "");
                    var c, d = null,
                        e = ea.trim(b + "");
                    return e && !ea.trim(e.replace(Gb, function(a, b, e, f) {
                        return c && b && (d = 0), 0 === d ? a : (c = e || b, d += !f - !e, "")
                    })) ? Function("return " + e)() : ea.error("Invalid JSON: " + b)
                }, ea.parseXML = function(b) {
                    var c, d;
                    if (!b || "string" != typeof b) return null;
                    try {
                        a.DOMParser ? (d = new DOMParser, c = d.parseFromString(b, "text/xml")) : (c = new ActiveXObject("Microsoft.XMLDOM"), c.async = "false", c.loadXML(b))
                    } catch (e) {
                        c = void 0
                    }
                    return c && c.documentElement && !c.getElementsByTagName("parsererror").length || ea.error("Invalid XML: " + b), c
                };
                var Hb, Ib, Jb = /#.*$/,
                    Kb = /([?&])_=[^&]*/,
                    Lb = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm,
                    Mb = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
                    Nb = /^(?:GET|HEAD)$/,
                    Ob = /^\/\//,
                    Pb = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,
                    Qb = {},
                    Rb = {},
                    Sb = "*/".concat("*");
                try {
                    Ib = location.href
                } catch (Tb) {
                    Ib = oa.createElement("a"), Ib.href = "", Ib = Ib.href
                }
                Hb = Pb.exec(Ib.toLowerCase()) || [], ea.extend({
                    active: 0,
                    lastModified: {},
                    etag: {},
                    ajaxSettings: {
                        url: Ib,
                        type: "GET",
                        isLocal: Mb.test(Hb[1]),
                        global: !0,
                        processData: !0,
                        async: !0,
                        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                        accepts: {
                            "*": Sb,
                            text: "text/plain",
                            html: "text/html",
                            xml: "application/xml, text/xml",
                            json: "application/json, text/javascript"
                        },
                        contents: {
                            xml: /xml/,
                            html: /html/,
                            json: /json/
                        },
                        responseFields: {
                            xml: "responseXML",
                            text: "responseText",
                            json: "responseJSON"
                        },
                        converters: {
                            "* text": String,
                            "text html": !0,
                            "text json": ea.parseJSON,
                            "text xml": ea.parseXML
                        },
                        flatOptions: {
                            url: !0,
                            context: !0
                        }
                    },
                    ajaxSetup: function(a, b) {
                        return b ? P(P(a, ea.ajaxSettings), b) : P(ea.ajaxSettings, a)
                    },
                    ajaxPrefilter: N(Qb),
                    ajaxTransport: N(Rb),
                    ajax: function(a, b) {
                        function c(a, b, c, d) {
                            var e, k, r, s, u, w = b;
                            2 !== t && (t = 2, h && clearTimeout(h), j = void 0, g = d || "", v.readyState = a > 0 ? 4 : 0, e = a >= 200 && 300 > a || 304 === a, c && (s = Q(l, v, c)), s = R(l, s, v, e), e ? (l.ifModified && (u = v.getResponseHeader("Last-Modified"), u && (ea.lastModified[f] = u), u = v.getResponseHeader("etag"), u && (ea.etag[f] = u)), 204 === a || "HEAD" === l.type ? w = "nocontent" : 304 === a ? w = "notmodified" : (w = s.state, k = s.data, r = s.error, e = !r)) : (r = w, (a || !w) && (w = "error", 0 > a && (a = 0))), v.status = a, v.statusText = (b || w) + "", e ? o.resolveWith(m, [k, w, v]) : o.rejectWith(m, [v, w, r]), v.statusCode(q), q = void 0, i && n.trigger(e ? "ajaxSuccess" : "ajaxError", [v, l, e ? k : r]), p.fireWith(m, [v, w]), i && (n.trigger("ajaxComplete", [v, l]), --ea.active || ea.event.trigger("ajaxStop")))
                        }
                        "object" == typeof a && (b = a, a = void 0), b = b || {};
                        var d, e, f, g, h, i, j, k, l = ea.ajaxSetup({}, b),
                            m = l.context || l,
                            n = l.context && (m.nodeType || m.jquery) ? ea(m) : ea.event,
                            o = ea.Deferred(),
                            p = ea.Callbacks("once memory"),
                            q = l.statusCode || {},
                            r = {},
                            s = {},
                            t = 0,
                            u = "canceled",
                            v = {
                                readyState: 0,
                                getResponseHeader: function(a) {
                                    var b;
                                    if (2 === t) {
                                        if (!k)
                                            for (k = {}; b = Lb.exec(g);) k[b[1].toLowerCase()] = b[2];
                                        b = k[a.toLowerCase()]
                                    }
                                    return null == b ? null : b
                                },
                                getAllResponseHeaders: function() {
                                    return 2 === t ? g : null
                                },
                                setRequestHeader: function(a, b) {
                                    var c = a.toLowerCase();
                                    return t || (a = s[c] = s[c] || a, r[a] = b), this
                                },
                                overrideMimeType: function(a) {
                                    return t || (l.mimeType = a), this
                                },
                                statusCode: function(a) {
                                    var b;
                                    if (a)
                                        if (2 > t)
                                            for (b in a) q[b] = [q[b], a[b]];
                                        else v.always(a[v.status]);
                                    return this
                                },
                                abort: function(a) {
                                    var b = a || u;
                                    return j && j.abort(b), c(0, b), this
                                }
                            };
                        if (o.promise(v).complete = p.add, v.success = v.done, v.error = v.fail, l.url = ((a || l.url || Ib) + "").replace(Jb, "").replace(Ob, Hb[1] + "//"), l.type = b.method || b.type || l.method || l.type, l.dataTypes = ea.trim(l.dataType || "*").toLowerCase().match(ta) || [""], null == l.crossDomain && (d = Pb.exec(l.url.toLowerCase()), l.crossDomain = !(!d || d[1] === Hb[1] && d[2] === Hb[2] && (d[3] || ("http:" === d[1] ? "80" : "443")) === (Hb[3] || ("http:" === Hb[1] ? "80" : "443")))), l.data && l.processData && "string" != typeof l.data && (l.data = ea.param(l.data, l.traditional)), O(Qb, l, b, v), 2 === t) return v;
                        i = ea.event && l.global, i && 0 === ea.active++ && ea.event.trigger("ajaxStart"), l.type = l.type.toUpperCase(), l.hasContent = !Nb.test(l.type), f = l.url, l.hasContent || (l.data && (f = l.url += (Fb.test(f) ? "&" : "?") + l.data, delete l.data), l.cache === !1 && (l.url = Kb.test(f) ? f.replace(Kb, "$1_=" + Eb++) : f + (Fb.test(f) ? "&" : "?") + "_=" + Eb++)), l.ifModified && (ea.lastModified[f] && v.setRequestHeader("If-Modified-Since", ea.lastModified[f]), ea.etag[f] && v.setRequestHeader("If-None-Match", ea.etag[f])), (l.data && l.hasContent && l.contentType !== !1 || b.contentType) && v.setRequestHeader("Content-Type", l.contentType), v.setRequestHeader("Accept", l.dataTypes[0] && l.accepts[l.dataTypes[0]] ? l.accepts[l.dataTypes[0]] + ("*" !== l.dataTypes[0] ? ", " + Sb + "; q=0.01" : "") : l.accepts["*"]);
                        for (e in l.headers) v.setRequestHeader(e, l.headers[e]);
                        if (l.beforeSend && (l.beforeSend.call(m, v, l) === !1 || 2 === t)) return v.abort();
                        u = "abort";
                        for (e in {
                                success: 1,
                                error: 1,
                                complete: 1
                            }) v[e](l[e]);
                        if (j = O(Rb, l, b, v)) {
                            v.readyState = 1, i && n.trigger("ajaxSend", [v, l]), l.async && l.timeout > 0 && (h = setTimeout(function() {
                                v.abort("timeout")
                            }, l.timeout));
                            try {
                                t = 1, j.send(r, c)
                            } catch (w) {
                                if (!(2 > t)) throw w;
                                c(-1, w)
                            }
                        } else c(-1, "No Transport");
                        return v
                    },
                    getJSON: function(a, b, c) {
                        return ea.get(a, b, c, "json")
                    },
                    getScript: function(a, b) {
                        return ea.get(a, void 0, b, "script")
                    }
                }), ea.each(["get", "post"], function(a, b) {
                    ea[b] = function(a, c, d, e) {
                        return ea.isFunction(c) && (e = e || d, d = c, c = void 0), ea.ajax({
                            url: a,
                            type: b,
                            dataType: e,
                            data: c,
                            success: d
                        })
                    }
                }), ea._evalUrl = function(a) {
                    return ea.ajax({
                        url: a,
                        type: "GET",
                        dataType: "script",
                        async: !1,
                        global: !1,
                        "throws": !0
                    })
                }, ea.fn.extend({
                    wrapAll: function(a) {
                        if (ea.isFunction(a)) return this.each(function(b) {
                            ea(this).wrapAll(a.call(this, b))
                        });
                        if (this[0]) {
                            var b = ea(a, this[0].ownerDocument).eq(0).clone(!0);
                            this[0].parentNode && b.insertBefore(this[0]), b.map(function() {
                                for (var a = this; a.firstChild && 1 === a.firstChild.nodeType;) a = a.firstChild;
                                return a
                            }).append(this)
                        }
                        return this
                    },
                    wrapInner: function(a) {
                        return ea.isFunction(a) ? this.each(function(b) {
                            ea(this).wrapInner(a.call(this, b))
                        }) : this.each(function() {
                            var b = ea(this),
                                c = b.contents();
                            c.length ? c.wrapAll(a) : b.append(a)
                        })
                    },
                    wrap: function(a) {
                        var b = ea.isFunction(a);
                        return this.each(function(c) {
                            ea(this).wrapAll(b ? a.call(this, c) : a)
                        })
                    },
                    unwrap: function() {
                        return this.parent().each(function() {
                            ea.nodeName(this, "body") || ea(this).replaceWith(this.childNodes)
                        }).end()
                    }
                }), ea.expr.filters.hidden = function(a) {
                    return a.offsetWidth <= 0 && a.offsetHeight <= 0 || !ca.reliableHiddenOffsets() && "none" === (a.style && a.style.display || ea.css(a, "display"))
                }, ea.expr.filters.visible = function(a) {
                    return !ea.expr.filters.hidden(a)
                };
                var Ub = /%20/g,
                    Vb = /\[\]$/,
                    Wb = /\r?\n/g,
                    Xb = /^(?:submit|button|image|reset|file)$/i,
                    Yb = /^(?:input|select|textarea|keygen)/i;
                ea.param = function(a, b) {
                    var c, d = [],
                        e = function(a, b) {
                            b = ea.isFunction(b) ? b() : null == b ? "" : b, d[d.length] = encodeURIComponent(a) + "=" + encodeURIComponent(b)
                        };
                    if (void 0 === b && (b = ea.ajaxSettings && ea.ajaxSettings.traditional), ea.isArray(a) || a.jquery && !ea.isPlainObject(a)) ea.each(a, function() {
                        e(this.name, this.value)
                    });
                    else
                        for (c in a) S(c, a[c], b, e);
                    return d.join("&").replace(Ub, "+")
                }, ea.fn.extend({
                    serialize: function() {
                        return ea.param(this.serializeArray())
                    },
                    serializeArray: function() {
                        return this.map(function() {
                            var a = ea.prop(this, "elements");
                            return a ? ea.makeArray(a) : this
                        }).filter(function() {
                            var a = this.type;
                            return this.name && !ea(this).is(":disabled") && Yb.test(this.nodeName) && !Xb.test(a) && (this.checked || !Ea.test(a))
                        }).map(function(a, b) {
                            var c = ea(this).val();
                            return null == c ? null : ea.isArray(c) ? ea.map(c, function(a) {
                                return {
                                    name: b.name,
                                    value: a.replace(Wb, "\r\n")
                                }
                            }) : {
                                name: b.name,
                                value: c.replace(Wb, "\r\n")
                            }
                        }).get()
                    }
                }), ea.ajaxSettings.xhr = void 0 !== a.ActiveXObject ? function() {
                    return !this.isLocal && /^(get|post|head|put|delete|options)$/i.test(this.type) && T() || U()
                } : T;
                var Zb = 0,
                    $b = {},
                    _b = ea.ajaxSettings.xhr();
                a.attachEvent && a.attachEvent("onunload", function() {
                    for (var a in $b) $b[a](void 0, !0)
                }), ca.cors = !!_b && "withCredentials" in _b, _b = ca.ajax = !!_b, _b && ea.ajaxTransport(function(a) {
                    if (!a.crossDomain || ca.cors) {
                        var b;
                        return {
                            send: function(c, d) {
                                var e, f = a.xhr(),
                                    g = ++Zb;
                                if (f.open(a.type, a.url, a.async, a.username, a.password), a.xhrFields)
                                    for (e in a.xhrFields) f[e] = a.xhrFields[e];
                                a.mimeType && f.overrideMimeType && f.overrideMimeType(a.mimeType), a.crossDomain || c["X-Requested-With"] || (c["X-Requested-With"] = "XMLHttpRequest");
                                for (e in c) void 0 !== c[e] && f.setRequestHeader(e, c[e] + "");
                                f.send(a.hasContent && a.data || null), b = function(c, e) {
                                    var h, i, j;
                                    if (b && (e || 4 === f.readyState))
                                        if (delete $b[g], b = void 0, f.onreadystatechange = ea.noop, e) 4 !== f.readyState && f.abort();
                                        else {
                                            j = {}, h = f.status, "string" == typeof f.responseText && (j.text = f.responseText);
                                            try {
                                                i = f.statusText
                                            } catch (k) {
                                                i = ""
                                            }
                                            h || !a.isLocal || a.crossDomain ? 1223 === h && (h = 204) : h = j.text ? 200 : 404
                                        }
                                    j && d(h, i, j, f.getAllResponseHeaders())
                                }, a.async ? 4 === f.readyState ? setTimeout(b) : f.onreadystatechange = $b[g] = b : b()
                            },
                            abort: function() {
                                b && b(void 0, !0)
                            }
                        }
                    }
                }), ea.ajaxSetup({
                    accepts: {
                        script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
                    },
                    contents: {
                        script: /(?:java|ecma)script/
                    },
                    converters: {
                        "text script": function(a) {
                            return ea.globalEval(a), a
                        }
                    }
                }), ea.ajaxPrefilter("script", function(a) {
                    void 0 === a.cache && (a.cache = !1), a.crossDomain && (a.type = "GET", a.global = !1)
                }), ea.ajaxTransport("script", function(a) {
                    if (a.crossDomain) {
                        var b, c = oa.head || ea("head")[0] || oa.documentElement;
                        return {
                            send: function(d, e) {
                                b = oa.createElement("script"), b.async = !0, a.scriptCharset && (b.charset = a.scriptCharset), b.src = a.url, b.onload = b.onreadystatechange = function(a, c) {
                                    (c || !b.readyState || /loaded|complete/.test(b.readyState)) && (b.onload = b.onreadystatechange = null, b.parentNode && b.parentNode.removeChild(b), b = null, c || e(200, "success"))
                                }, c.insertBefore(b, c.firstChild)
                            },
                            abort: function() {
                                b && b.onload(void 0, !0)
                            }
                        }
                    }
                });
                var ac = [],
                    bc = /(=)\?(?=&|$)|\?\?/;
                ea.ajaxSetup({
                    jsonp: "callback",
                    jsonpCallback: function() {
                        var a = ac.pop() || ea.expando + "_" + Eb++;
                        return this[a] = !0, a
                    }
                }), ea.ajaxPrefilter("json jsonp", function(b, c, d) {
                    var e, f, g, h = b.jsonp !== !1 && (bc.test(b.url) ? "url" : "string" == typeof b.data && !(b.contentType || "").indexOf("application/x-www-form-urlencoded") && bc.test(b.data) && "data");
                    return h || "jsonp" === b.dataTypes[0] ? (e = b.jsonpCallback = ea.isFunction(b.jsonpCallback) ? b.jsonpCallback() : b.jsonpCallback, h ? b[h] = b[h].replace(bc, "$1" + e) : b.jsonp !== !1 && (b.url += (Fb.test(b.url) ? "&" : "?") + b.jsonp + "=" + e), b.converters["script json"] = function() {
                        return g || ea.error(e + " was not called"), g[0]
                    }, b.dataTypes[0] = "json", f = a[e], a[e] = function() {
                        g = arguments
                    }, d.always(function() {
                        a[e] = f, b[e] && (b.jsonpCallback = c.jsonpCallback, ac.push(e)), g && ea.isFunction(f) && f(g[0]), g = f = void 0
                    }), "script") : void 0
                }), ea.parseHTML = function(a, b, c) {
                    if (!a || "string" != typeof a) return null;
                    "boolean" == typeof b && (c = b, b = !1), b = b || oa;
                    var d = la.exec(a),
                        e = !c && [];
                    return d ? [b.createElement(d[1])] : (d = ea.buildFragment([a], b, e), e && e.length && ea(e).remove(), ea.merge([], d.childNodes))
                };
                var cc = ea.fn.load;
                ea.fn.load = function(a, b, c) {
                    if ("string" != typeof a && cc) return cc.apply(this, arguments);
                    var d, e, f, g = this,
                        h = a.indexOf(" ");
                    return h >= 0 && (d = ea.trim(a.slice(h, a.length)), a = a.slice(0, h)), ea.isFunction(b) ? (c = b, b = void 0) : b && "object" == typeof b && (f = "POST"), g.length > 0 && ea.ajax({
                        url: a,
                        type: f,
                        dataType: "html",
                        data: b
                    }).done(function(a) {
                        e = arguments, g.html(d ? ea("<div>").append(ea.parseHTML(a)).find(d) : a)
                    }).complete(c && function(a, b) {
                        g.each(c, e || [a.responseText, b, a])
                    }), this
                }, ea.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function(a, b) {
                    ea.fn[b] = function(a) {
                        return this.on(b, a)
                    }
                }), ea.expr.filters.animated = function(a) {
                    return ea.grep(ea.timers, function(b) {
                        return a === b.elem
                    }).length
                };
                var dc = a.document.documentElement;
                ea.offset = {
                    setOffset: function(a, b, c) {
                        var d, e, f, g, h, i, j, k = ea.css(a, "position"),
                            l = ea(a),
                            m = {};
                        "static" === k && (a.style.position = "relative"), h = l.offset(), f = ea.css(a, "top"), i = ea.css(a, "left"), j = ("absolute" === k || "fixed" === k) && ea.inArray("auto", [f, i]) > -1, j ? (d = l.position(), g = d.top, e = d.left) : (g = parseFloat(f) || 0, e = parseFloat(i) || 0), ea.isFunction(b) && (b = b.call(a, c, h)), null != b.top && (m.top = b.top - h.top + g), null != b.left && (m.left = b.left - h.left + e), "using" in b ? b.using.call(a, m) : l.css(m)
                    }
                }, ea.fn.extend({
                    offset: function(a) {
                        if (arguments.length) return void 0 === a ? this : this.each(function(b) {
                            ea.offset.setOffset(this, a, b)
                        });
                        var b, c, d = {
                                top: 0,
                                left: 0
                            },
                            e = this[0],
                            f = e && e.ownerDocument;
                        if (f) return b = f.documentElement, ea.contains(b, e) ? (typeof e.getBoundingClientRect !== xa && (d = e.getBoundingClientRect()), c = V(f), {
                            top: d.top + (c.pageYOffset || b.scrollTop) - (b.clientTop || 0),
                            left: d.left + (c.pageXOffset || b.scrollLeft) - (b.clientLeft || 0)
                        }) : d
                    },
                    position: function() {
                        if (this[0]) {
                            var a, b, c = {
                                    top: 0,
                                    left: 0
                                },
                                d = this[0];
                            return "fixed" === ea.css(d, "position") ? b = d.getBoundingClientRect() : (a = this.offsetParent(), b = this.offset(), ea.nodeName(a[0], "html") || (c = a.offset()), c.top += ea.css(a[0], "borderTopWidth", !0), c.left += ea.css(a[0], "borderLeftWidth", !0)), {
                                top: b.top - c.top - ea.css(d, "marginTop", !0),
                                left: b.left - c.left - ea.css(d, "marginLeft", !0)
                            }
                        }
                    },
                    offsetParent: function() {
                        return this.map(function() {
                            for (var a = this.offsetParent || dc; a && !ea.nodeName(a, "html") && "static" === ea.css(a, "position");) a = a.offsetParent;
                            return a || dc
                        })
                    }
                }), ea.each({
                    scrollLeft: "pageXOffset",
                    scrollTop: "pageYOffset"
                }, function(a, b) {
                    var c = /Y/.test(b);
                    ea.fn[a] = function(d) {
                        return Da(this, function(a, d, e) {
                            var f = V(a);
                            return void 0 === e ? f ? b in f ? f[b] : f.document.documentElement[d] : a[d] : void(f ? f.scrollTo(c ? ea(f).scrollLeft() : e, c ? e : ea(f).scrollTop()) : a[d] = e)
                        }, a, d, arguments.length, null)
                    }
                }), ea.each(["top", "left"], function(a, b) {
                    ea.cssHooks[b] = A(ca.pixelPosition, function(a, c) {
                        return c ? (c = bb(a, b), db.test(c) ? ea(a).position()[b] + "px" : c) : void 0
                    })
                }), ea.each({
                    Height: "height",
                    Width: "width"
                }, function(a, b) {
                    ea.each({
                        padding: "inner" + a,
                        content: b,
                        "": "outer" + a
                    }, function(c, d) {
                        ea.fn[d] = function(d, e) {
                            var f = arguments.length && (c || "boolean" != typeof d),
                                g = c || (d === !0 || e === !0 ? "margin" : "border");
                            return Da(this, function(b, c, d) {
                                var e;
                                return ea.isWindow(b) ? b.document.documentElement["client" + a] : 9 === b.nodeType ? (e = b.documentElement, Math.max(b.body["scroll" + a], e["scroll" + a], b.body["offset" + a], e["offset" + a], e["client" + a])) : void 0 === d ? ea.css(b, c, g) : ea.style(b, c, d, g)
                            }, b, f ? d : void 0, f, null)
                        }
                    })
                }), ea.fn.size = function() {
                    return this.length
                }, ea.fn.andSelf = ea.fn.addBack, "function" == typeof define && define.amd && define("jquery", [], function() {
                    return ea
                });
                var ec = a.jQuery,
                    fc = a.$;
                return ea.noConflict = function(b) {
                    return a.$ === ea && (a.$ = fc), b && a.jQuery === ea && (a.jQuery = ec), ea
                }, typeof b === xa && (a.jQuery = a.$ = ea), ea
            })
        }, {}],
        18: [function(a, b, c) {
            var d = a("lodash._baseflatten"),
                e = a("lodash._createwrapper"),
                f = a("lodash.functions"),
                g = a("lodash.restparam"),
                h = 1,
                i = g(function(a, b) {
                    b = b.length ? d(b) : f(a);
                    for (var c = -1, g = b.length; ++c < g;) {
                        var i = b[c];
                        a[i] = e(a[i], h, a)
                    }
                    return a
                });
            b.exports = i
        }, {
            "lodash._baseflatten": 19,
            "lodash._createwrapper": 22,
            "lodash.functions": 26,
            "lodash.restparam": 32
        }],
        19: [function(a, b, c) {
            function d(a) {
                return !!a && "object" == typeof a
            }

            function e(a, b, c) {
                for (var f = -1, h = a.length, k = -1, l = []; ++f < h;) {
                    var m = a[f];
                    if (d(m) && g(m) && (c || j(m) || i(m))) {
                        b && (m = e(m, b, c));
                        for (var n = -1, o = m.length; ++n < o;) l[++k] = m[n]
                    } else c || (l[++k] = m)
                }
                return l
            }

            function f(a) {
                return function(b) {
                    return null == b ? void 0 : b[a]
                }
            }

            function g(a) {
                return null != a && h(l(a))
            }

            function h(a) {
                return "number" == typeof a && a > -1 && a % 1 == 0 && k >= a
            }
            var i = a("lodash.isarguments"),
                j = a("lodash.isarray"),
                k = 9007199254740991,
                l = f("length");
            b.exports = e
        }, {
            "lodash.isarguments": 20,
            "lodash.isarray": 21
        }],
        20: [function(a, b, c) {
            function d(a) {
                return !!a && "object" == typeof a
            }

            function e(a) {
                return function(b) {
                    return null == b ? void 0 : b[a]
                }
            }

            function f(a) {
                return null != a && g(m(a))
            }

            function g(a) {
                return "number" == typeof a && a > -1 && a % 1 == 0 && l >= a
            }

            function h(a) {
                return d(a) && f(a) && k.call(a) == i
            }
            var i = "[object Arguments]",
                j = Object.prototype,
                k = j.toString,
                l = 9007199254740991,
                m = e("length");
            b.exports = h
        }, {}],
        21: [function(a, b, c) {
            function d(a) {
                return "string" == typeof a ? a : null == a ? "" : a + ""
            }

            function e(a) {
                return !!a && "object" == typeof a
            }

            function f(a, b) {
                var c = null == a ? void 0 : a[b];
                return h(c) ? c : void 0
            }

            function g(a) {
                return "number" == typeof a && a > -1 && a % 1 == 0 && u >= a
            }

            function h(a) {
                return null == a ? !1 : r.call(a) == k ? s.test(p.call(a)) : e(a) && n.test(a)
            }

            function i(a) {
                return a = d(a), a && m.test(a) ? a.replace(l, "\\$&") : a
            }
            var j = "[object Array]",
                k = "[object Function]",
                l = /[.*+?^${}()|[\]\/\\]/g,
                m = RegExp(l.source),
                n = /^\[object .+?Constructor\]$/,
                o = Object.prototype,
                p = Function.prototype.toString,
                q = o.hasOwnProperty,
                r = o.toString,
                s = RegExp("^" + i(p.call(q)).replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"),
                t = f(Array, "isArray"),
                u = 9007199254740991,
                v = t || function(a) {
                    return e(a) && g(a.length) && r.call(a) == j
                };
            b.exports = v
        }, {}],
        22: [function(a, b, c) {
            (function(c) {
                function d(a, b, c) {
                    for (var d = c.length, e = -1, f = A(a.length - d, 0), g = -1, h = b.length, i = Array(f + h); ++g < h;) i[g] = b[g];
                    for (; ++e < d;) i[c[e]] = a[e];
                    for (; f--;) i[g++] = a[e++];
                    return i
                }

                function e(a, b, c) {
                    for (var d = -1, e = c.length, f = -1, g = A(a.length - e, 0), h = -1, i = b.length, j = Array(g + i); ++f < g;) j[f] = a[f];
                    for (var k = f; ++h < i;) j[k + h] = b[h];
                    for (; ++d < e;) j[k + c[d]] = a[f++];
                    return j
                }

                function f(a, b) {
                    function d() {
                        var f = this && this !== c && this instanceof d ? e : a;
                        return f.apply(b, arguments)
                    }
                    var e = g(a);
                    return d
                }

                function g(a) {
                    return function() {
                        var b = arguments;
                        switch (b.length) {
                            case 0:
                                return new a;
                            case 1:
                                return new a(b[0]);
                            case 2:
                                return new a(b[0], b[1]);
                            case 3:
                                return new a(b[0], b[1], b[2]);
                            case 4:
                                return new a(b[0], b[1], b[2], b[3]);
                            case 5:
                                return new a(b[0], b[1], b[2], b[3], b[4])
                        }
                        var c = o(a.prototype),
                            d = a.apply(c, b);
                        return m(d) ? d : c
                    }
                }

                function h(a, b, f, i, j, k, m, o, y, z) {
                    function B() {
                        for (var s = arguments.length, t = s, u = Array(s); t--;) u[t] = arguments[t];
                        if (i && (u = d(u, i, j)), k && (u = e(u, k, m)), F || H) {
                            var x = B.placeholder,
                                J = p(u, x);
                            if (s -= J.length, z > s) {
                                var K = o ? n(o) : null,
                                    L = A(z - s, 0),
                                    M = F ? J : null,
                                    N = F ? null : J,
                                    O = F ? u : null,
                                    P = F ? null : u;
                                b |= F ? v : w, b &= ~(F ? w : v), G || (b &= ~(q | r));
                                var Q = h(a, b, f, O, M, P, N, K, y, L);
                                return Q.placeholder = x, Q
                            }
                        }
                        var R = D ? f : this,
                            S = E ? R[a] : a;
                        return o && (u = l(u, o)), C && y < u.length && (u.length = y), this && this !== c && this instanceof B && (S = I || g(a)), S.apply(R, u)
                    }
                    var C = b & x,
                        D = b & q,
                        E = b & r,
                        F = b & t,
                        G = b & s,
                        H = b & u,
                        I = E ? null : g(a);
                    return B
                }

                function i(a, b, d, e) {
                    function f() {
                        for (var b = -1, g = arguments.length, j = -1, k = e.length, l = Array(g + k); ++j < k;) l[j] = e[j];
                        for (; g--;) l[j++] = arguments[++b];
                        var m = this && this !== c && this instanceof f ? i : a;
                        return m.apply(h ? d : this, l)
                    }
                    var h = b & q,
                        i = g(a);
                    return f
                }

                function j(a, b, c, d, e, g, j, k) {
                    var l = b & r;
                    if (!l && "function" != typeof a) throw new TypeError(y);
                    var m = d ? d.length : 0;
                    if (m || (b &= ~(v | w), d = e = null), m -= e ? e.length : 0, b & w) {
                        var n = d,
                            o = e;
                        d = e = null
                    }
                    var p = [a, b, c, d, e, n, o, g, j, k];
                    if (p[9] = null == k ? l ? 0 : a.length : A(k - m, 0) || 0, b == q) var s = f(p[0], p[2]);
                    else s = b != v && b != (q | v) || p[4].length ? h.apply(void 0, p) : i.apply(void 0, p);
                    return s
                }

                function k(a, b) {
                    return a = "number" == typeof a || z.test(a) ? +a : -1, b = null == b ? C : b, a > -1 && a % 1 == 0 && b > a
                }

                function l(a, b) {
                    for (var c = a.length, d = B(b.length, c), e = n(a); d--;) {
                        var f = b[d];
                        a[d] = k(f, c) ? e[f] : void 0
                    }
                    return a
                }

                function m(a) {
                    var b = typeof a;
                    return !!a && ("object" == b || "function" == b)
                }
                var n = a("lodash._arraycopy"),
                    o = a("lodash._basecreate"),
                    p = a("lodash._replaceholders"),
                    q = 1,
                    r = 2,
                    s = 4,
                    t = 8,
                    u = 16,
                    v = 32,
                    w = 64,
                    x = 128,
                    y = "Expected a function",
                    z = /^\d+$/,
                    A = Math.max,
                    B = Math.min,
                    C = 9007199254740991;
                b.exports = j
            }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
        }, {
            "lodash._arraycopy": 23,
            "lodash._basecreate": 24,
            "lodash._replaceholders": 25
        }],
        23: [function(a, b, c) {
            function d(a, b) {
                var c = -1,
                    d = a.length;
                for (b || (b = Array(d)); ++c < d;) b[c] = a[c];
                return b
            }
            b.exports = d
        }, {}],
        24: [function(a, b, c) {
            function d(a) {
                var b = typeof a;
                return !!a && ("object" == b || "function" == b)
            }
            var e = function() {
                function a() {}
                return function(b) {
                    if (d(b)) {
                        a.prototype = b;
                        var c = new a;
                        a.prototype = null
                    }
                    return c || {}
                }
            }();
            b.exports = e
        }, {}],
        25: [function(a, b, c) {
            function d(a, b) {
                for (var c = -1, d = a.length, f = -1, g = []; ++c < d;) a[c] === b && (a[c] = e, g[++f] = c);
                return g
            }
            var e = "__lodash_placeholder__";
            b.exports = d
        }, {}],
        26: [function(a, b, c) {
            function d(a) {
                return e(a, f(a))
            }
            var e = a("lodash._basefunctions"),
                f = a("lodash.keysin");
            b.exports = d
        }, {
            "lodash._basefunctions": 27,
            "lodash.keysin": 29
        }],
        27: [function(a, b, c) {
            function d(a, b) {
                for (var c = -1, d = b.length, f = -1, g = []; ++c < d;) {
                    var h = b[c];
                    e(a[h]) && (g[++f] = h)
                }
                return g
            }
            var e = a("lodash.isfunction");
            b.exports = d
        }, {
            "lodash.isfunction": 28
        }],
        28: [function(a, b, c) {
            (function(a) {
                function c(a) {
                    return "function" == typeof a || !1
                }

                function d(a) {
                    return "string" == typeof a ? a : null == a ? "" : a + ""
                }

                function e(a) {
                    return !!a && "object" == typeof a
                }

                function f(a, b) {
                    var c = null == a ? void 0 : a[b];
                    return g(c) ? c : void 0
                }

                function g(a) {
                    return null == a ? !1 : p.call(a) == i ? q.test(n.call(a)) : e(a) && l.test(a)
                }

                function h(a) {
                    return a = d(a), a && k.test(a) ? a.replace(j, "\\$&") : a
                }
                var i = "[object Function]",
                    j = /[.*+?^${}()|[\]\/\\]/g,
                    k = RegExp(j.source),
                    l = /^\[object .+?Constructor\]$/,
                    m = Object.prototype,
                    n = Function.prototype.toString,
                    o = m.hasOwnProperty,
                    p = m.toString,
                    q = RegExp("^" + h(n.call(o)).replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"),
                    r = f(a, "Uint8Array"),
                    s = c(/x/) || r && !c(r) ? function(a) {
                        return p.call(a) == i
                    } : c;
                b.exports = s
            }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
        }, {}],
        29: [function(a, b, c) {
            function d(a, b) {
                return a = "number" == typeof a || j.test(a) ? +a : -1, b = null == b ? m : b, a > -1 && a % 1 == 0 && b > a
            }

            function e(a) {
                return "number" == typeof a && a > -1 && a % 1 == 0 && m >= a
            }

            function f(a) {
                var b = typeof a;
                return !!a && ("object" == b || "function" == b)
            }

            function g(a) {
                if (null == a) return [];
                f(a) || (a = Object(a));
                var b = a.length;
                b = b && e(b) && (i(a) || h(a)) && b || 0;
                for (var c = a.constructor, g = -1, j = "function" == typeof c && c.prototype === a, k = Array(b), m = b > 0; ++g < b;) k[g] = g + "";
                for (var n in a) m && d(n, b) || "constructor" == n && (j || !l.call(a, n)) || k.push(n);
                return k
            }
            var h = a("lodash.isarguments"),
                i = a("lodash.isarray"),
                j = /^\d+$/,
                k = Object.prototype,
                l = k.hasOwnProperty,
                m = 9007199254740991;
            b.exports = g
        }, {
            "lodash.isarguments": 30,
            "lodash.isarray": 31
        }],
        30: [function(a, b, c) {
            arguments[4][20][0].apply(c, arguments)
        }, {
            dup: 20
        }],
        31: [function(a, b, c) {
            arguments[4][21][0].apply(c, arguments)
        }, {
            dup: 21
        }],
        32: [function(a, b, c) {
            function d(a, b) {
                if ("function" != typeof a) throw new TypeError(e);
                return b = f(void 0 === b ? a.length - 1 : +b || 0, 0),
                    function() {
                        for (var c = arguments, d = -1, e = f(c.length - b, 0), g = Array(e); ++d < e;) g[d] = c[b + d];
                        switch (b) {
                            case 0:
                                return a.call(this, g);
                            case 1:
                                return a.call(this, c[0], g);
                            case 2:
                                return a.call(this, c[0], c[1], g)
                        }
                        var h = Array(b + 1);
                        for (d = -1; ++d < b;) h[d] = c[d];
                        return h[b] = g, a.apply(this, h)
                    }
            }
            var e = "Expected a function",
                f = Math.max;
            b.exports = d
        }, {}],
        33: [function(a, b, c) {
            "use strict";
            ! function(d, e) {
                "function" == typeof define && define.amd ? define(["marionette", "underscore"], e) : "object" == typeof c && (b.exports = e(a("backbone.marionette"), a("underscore")))
            }(this, function(a, b) {
                return a.Behavior.extend({
                    onRender: function() {
                        this.options = a.normalizeUIKeys(this.options, Object.getPrototypeOf(this.view).ui), b(this.options).forEach(function(a, c) {
                            var d = this.view.$(c);
                            b(a).isObject() ? b(a).forEach(function(a, b) {
                                a = a || {}, d[b](a)
                            }, this) : b(a).isString() && d[a]()
                        }, this)
                    }
                })
            })
        }, {
            "backbone.marionette": 2,
            underscore: 35
        }],
        34: [function(a, b, c) {
            "use strict";
            ! function(d, e) {
                "function" == typeof define && define.amd ? define(["marionette", "underscore", "backbone.stickit"], e) : "object" == typeof c && (b.exports = e(a("backbone.marionette"), a("underscore"), a("backbone.stickit")))
            }(this, function(a, b, c) {
                var d = a.Behavior.extend({
                    _patchGetters: function() {
                        b.each(this.options, b.bind(function(a, c) {
                            (b.isString(a) || a.observe) && (b.isString(a) && (a = {
                                observe: a
                            }), a.onGet = b.wrap(a.onGet, function(a, c, d) {
                                var e = this.model.get.bind(this.model),
                                    f = b.isArray(d.observe) ? b.map(d.observe, e) : e(d.observe);
                                return a ? a.call(this, c, d) : f
                            }), this.options[c] = a)
                        }, this))
                    },
                    onRender: function() {
                        this.options = a.normalizeUIKeys(this.options, Object.getPrototypeOf(this.view).ui), d.patchGetters && this._patchGetters(), this.view.bindings = this.options, this.view.stickit()
                    },
                    onDestroy: function() {
                        this.view.unstickit()
                    }
                }, {
                    patchGetters: !1
                });
                return d
            })
        }, {
            "backbone.marionette": 2,
            "backbone.stickit": 5,
            underscore: 35
        }],
        35: [function(a, b, c) {
            (function() {
                function a(a) {
                    function b(b, c, d, e, f, g) {
                        for (; f >= 0 && g > f; f += a) {
                            var h = e ? e[f] : f;
                            d = c(d, b[h], h, b)
                        }
                        return d
                    }
                    return function(c, d, e, f) {
                        d = v(d, f, 4);
                        var g = !C(c) && u.keys(c),
                            h = (g || c).length,
                            i = a > 0 ? 0 : h - 1;
                        return arguments.length < 3 && (e = c[g ? g[i] : i], i += a), b(c, d, e, g, i, h)
                    }
                }

                function d(a) {
                    return function(b, c, d) {
                        c = w(c, d);
                        for (var e = B(b), f = a > 0 ? 0 : e - 1; f >= 0 && e > f; f += a)
                            if (c(b[f], f, b)) return f;
                        return -1
                    }
                }

                function e(a, b, c) {
                    return function(d, e, f) {
                        var g = 0,
                            h = B(d);
                        if ("number" == typeof f) a > 0 ? g = f >= 0 ? f : Math.max(f + h, g) : h = f >= 0 ? Math.min(f + 1, h) : f + h + 1;
                        else if (c && f && h) return f = c(d, e), d[f] === e ? f : -1;
                        if (e !== e) return f = b(m.call(d, g, h), u.isNaN), f >= 0 ? f + g : -1;
                        for (f = a > 0 ? g : h - 1; f >= 0 && h > f; f += a)
                            if (d[f] === e) return f;
                        return -1
                    }
                }

                function f(a, b) {
                    var c = H.length,
                        d = a.constructor,
                        e = u.isFunction(d) && d.prototype || j,
                        f = "constructor";
                    for (u.has(a, f) && !u.contains(b, f) && b.push(f); c--;) f = H[c], f in a && a[f] !== e[f] && !u.contains(b, f) && b.push(f)
                }
                var g = this,
                    h = g._,
                    i = Array.prototype,
                    j = Object.prototype,
                    k = Function.prototype,
                    l = i.push,
                    m = i.slice,
                    n = j.toString,
                    o = j.hasOwnProperty,
                    p = Array.isArray,
                    q = Object.keys,
                    r = k.bind,
                    s = Object.create,
                    t = function() {},
                    u = function(a) {
                        return a instanceof u ? a : this instanceof u ? void(this._wrapped = a) : new u(a)
                    };
                "undefined" != typeof c ? ("undefined" != typeof b && b.exports && (c = b.exports = u), c._ = u) : g._ = u, u.VERSION = "1.8.3";
                var v = function(a, b, c) {
                        if (void 0 === b) return a;
                        switch (null == c ? 3 : c) {
                            case 1:
                                return function(c) {
                                    return a.call(b, c)
                                };
                            case 2:
                                return function(c, d) {
                                    return a.call(b, c, d)
                                };
                            case 3:
                                return function(c, d, e) {
                                    return a.call(b, c, d, e)
                                };
                            case 4:
                                return function(c, d, e, f) {
                                    return a.call(b, c, d, e, f)
                                }
                        }
                        return function() {
                            return a.apply(b, arguments)
                        }
                    },
                    w = function(a, b, c) {
                        return null == a ? u.identity : u.isFunction(a) ? v(a, b, c) : u.isObject(a) ? u.matcher(a) : u.property(a)
                    };
                u.iteratee = function(a, b) {
                    return w(a, b, 1 / 0)
                };
                var x = function(a, b) {
                        return function(c) {
                            var d = arguments.length;
                            if (2 > d || null == c) return c;
                            for (var e = 1; d > e; e++)
                                for (var f = arguments[e], g = a(f), h = g.length, i = 0; h > i; i++) {
                                    var j = g[i];
                                    b && void 0 !== c[j] || (c[j] = f[j])
                                }
                            return c
                        }
                    },
                    y = function(a) {
                        if (!u.isObject(a)) return {};
                        if (s) return s(a);
                        t.prototype = a;
                        var b = new t;
                        return t.prototype = null, b
                    },
                    z = function(a) {
                        return function(b) {
                            return null == b ? void 0 : b[a]
                        }
                    },
                    A = Math.pow(2, 53) - 1,
                    B = z("length"),
                    C = function(a) {
                        var b = B(a);
                        return "number" == typeof b && b >= 0 && A >= b
                    };
                u.each = u.forEach = function(a, b, c) {
                    b = v(b, c);
                    var d, e;
                    if (C(a))
                        for (d = 0, e = a.length; e > d; d++) b(a[d], d, a);
                    else {
                        var f = u.keys(a);
                        for (d = 0, e = f.length; e > d; d++) b(a[f[d]], f[d], a)
                    }
                    return a
                }, u.map = u.collect = function(a, b, c) {
                    b = w(b, c);
                    for (var d = !C(a) && u.keys(a), e = (d || a).length, f = Array(e), g = 0; e > g; g++) {
                        var h = d ? d[g] : g;
                        f[g] = b(a[h], h, a)
                    }
                    return f
                }, u.reduce = u.foldl = u.inject = a(1), u.reduceRight = u.foldr = a(-1), u.find = u.detect = function(a, b, c) {
                    var d;
                    return d = C(a) ? u.findIndex(a, b, c) : u.findKey(a, b, c), void 0 !== d && -1 !== d ? a[d] : void 0
                }, u.filter = u.select = function(a, b, c) {
                    var d = [];
                    return b = w(b, c), u.each(a, function(a, c, e) {
                        b(a, c, e) && d.push(a)
                    }), d
                }, u.reject = function(a, b, c) {
                    return u.filter(a, u.negate(w(b)), c)
                }, u.every = u.all = function(a, b, c) {
                    b = w(b, c);
                    for (var d = !C(a) && u.keys(a), e = (d || a).length, f = 0; e > f; f++) {
                        var g = d ? d[f] : f;
                        if (!b(a[g], g, a)) return !1
                    }
                    return !0
                }, u.some = u.any = function(a, b, c) {
                    b = w(b, c);
                    for (var d = !C(a) && u.keys(a), e = (d || a).length, f = 0; e > f; f++) {
                        var g = d ? d[f] : f;
                        if (b(a[g], g, a)) return !0
                    }
                    return !1
                }, u.contains = u.includes = u.include = function(a, b, c, d) {
                    return C(a) || (a = u.values(a)), ("number" != typeof c || d) && (c = 0), u.indexOf(a, b, c) >= 0
                }, u.invoke = function(a, b) {
                    var c = m.call(arguments, 2),
                        d = u.isFunction(b);
                    return u.map(a, function(a) {
                        var e = d ? b : a[b];
                        return null == e ? e : e.apply(a, c)
                    })
                }, u.pluck = function(a, b) {
                    return u.map(a, u.property(b))
                }, u.where = function(a, b) {
                    return u.filter(a, u.matcher(b))
                }, u.findWhere = function(a, b) {
                    return u.find(a, u.matcher(b))
                }, u.max = function(a, b, c) {
                    var d, e, f = -(1 / 0),
                        g = -(1 / 0);
                    if (null == b && null != a) {
                        a = C(a) ? a : u.values(a);
                        for (var h = 0, i = a.length; i > h; h++) d = a[h], d > f && (f = d)
                    } else b = w(b, c), u.each(a, function(a, c, d) {
                        e = b(a, c, d), (e > g || e === -(1 / 0) && f === -(1 / 0)) && (f = a, g = e)
                    });
                    return f
                }, u.min = function(a, b, c) {
                    var d, e, f = 1 / 0,
                        g = 1 / 0;
                    if (null == b && null != a) {
                        a = C(a) ? a : u.values(a);
                        for (var h = 0, i = a.length; i > h; h++) d = a[h], f > d && (f = d)
                    } else b = w(b, c), u.each(a, function(a, c, d) {
                        e = b(a, c, d), (g > e || e === 1 / 0 && f === 1 / 0) && (f = a, g = e)
                    });
                    return f
                }, u.shuffle = function(a) {
                    for (var b, c = C(a) ? a : u.values(a), d = c.length, e = Array(d), f = 0; d > f; f++) b = u.random(0, f), b !== f && (e[f] = e[b]), e[b] = c[f];
                    return e
                }, u.sample = function(a, b, c) {
                    return null == b || c ? (C(a) || (a = u.values(a)), a[u.random(a.length - 1)]) : u.shuffle(a).slice(0, Math.max(0, b))
                }, u.sortBy = function(a, b, c) {
                    return b = w(b, c), u.pluck(u.map(a, function(a, c, d) {
                        return {
                            value: a,
                            index: c,
                            criteria: b(a, c, d)
                        }
                    }).sort(function(a, b) {
                        var c = a.criteria,
                            d = b.criteria;
                        if (c !== d) {
                            if (c > d || void 0 === c) return 1;
                            if (d > c || void 0 === d) return -1
                        }
                        return a.index - b.index
                    }), "value")
                };
                var D = function(a) {
                    return function(b, c, d) {
                        var e = {};
                        return c = w(c, d), u.each(b, function(d, f) {
                            var g = c(d, f, b);
                            a(e, d, g)
                        }), e
                    }
                };
                u.groupBy = D(function(a, b, c) {
                    u.has(a, c) ? a[c].push(b) : a[c] = [b]
                }), u.indexBy = D(function(a, b, c) {
                    a[c] = b
                }), u.countBy = D(function(a, b, c) {
                    u.has(a, c) ? a[c]++ : a[c] = 1
                }), u.toArray = function(a) {
                    return a ? u.isArray(a) ? m.call(a) : C(a) ? u.map(a, u.identity) : u.values(a) : []
                }, u.size = function(a) {
                    return null == a ? 0 : C(a) ? a.length : u.keys(a).length
                }, u.partition = function(a, b, c) {
                    b = w(b, c);
                    var d = [],
                        e = [];
                    return u.each(a, function(a, c, f) {
                        (b(a, c, f) ? d : e).push(a)
                    }), [d, e]
                }, u.first = u.head = u.take = function(a, b, c) {
                    return null == a ? void 0 : null == b || c ? a[0] : u.initial(a, a.length - b)
                }, u.initial = function(a, b, c) {
                    return m.call(a, 0, Math.max(0, a.length - (null == b || c ? 1 : b)))
                }, u.last = function(a, b, c) {
                    return null == a ? void 0 : null == b || c ? a[a.length - 1] : u.rest(a, Math.max(0, a.length - b))
                }, u.rest = u.tail = u.drop = function(a, b, c) {
                    return m.call(a, null == b || c ? 1 : b)
                }, u.compact = function(a) {
                    return u.filter(a, u.identity)
                };
                var E = function(a, b, c, d) {
                    for (var e = [], f = 0, g = d || 0, h = B(a); h > g; g++) {
                        var i = a[g];
                        if (C(i) && (u.isArray(i) || u.isArguments(i))) {
                            b || (i = E(i, b, c));
                            var j = 0,
                                k = i.length;
                            for (e.length += k; k > j;) e[f++] = i[j++]
                        } else c || (e[f++] = i)
                    }
                    return e
                };
                u.flatten = function(a, b) {
                    return E(a, b, !1)
                }, u.without = function(a) {
                    return u.difference(a, m.call(arguments, 1))
                }, u.uniq = u.unique = function(a, b, c, d) {
                    u.isBoolean(b) || (d = c, c = b, b = !1), null != c && (c = w(c, d));
                    for (var e = [], f = [], g = 0, h = B(a); h > g; g++) {
                        var i = a[g],
                            j = c ? c(i, g, a) : i;
                        b ? (g && f === j || e.push(i), f = j) : c ? u.contains(f, j) || (f.push(j), e.push(i)) : u.contains(e, i) || e.push(i)
                    }
                    return e
                }, u.union = function() {
                    return u.uniq(E(arguments, !0, !0))
                }, u.intersection = function(a) {
                    for (var b = [], c = arguments.length, d = 0, e = B(a); e > d; d++) {
                        var f = a[d];
                        if (!u.contains(b, f)) {
                            for (var g = 1; c > g && u.contains(arguments[g], f); g++);
                            g === c && b.push(f)
                        }
                    }
                    return b
                }, u.difference = function(a) {
                    var b = E(arguments, !0, !0, 1);
                    return u.filter(a, function(a) {
                        return !u.contains(b, a)
                    })
                }, u.zip = function() {
                    return u.unzip(arguments)
                }, u.unzip = function(a) {
                    for (var b = a && u.max(a, B).length || 0, c = Array(b), d = 0; b > d; d++) c[d] = u.pluck(a, d);
                    return c
                }, u.object = function(a, b) {
                    for (var c = {}, d = 0, e = B(a); e > d; d++) b ? c[a[d]] = b[d] : c[a[d][0]] = a[d][1];
                    return c
                }, u.findIndex = d(1), u.findLastIndex = d(-1), u.sortedIndex = function(a, b, c, d) {
                    c = w(c, d, 1);
                    for (var e = c(b), f = 0, g = B(a); g > f;) {
                        var h = Math.floor((f + g) / 2);
                        c(a[h]) < e ? f = h + 1 : g = h
                    }
                    return f
                }, u.indexOf = e(1, u.findIndex, u.sortedIndex), u.lastIndexOf = e(-1, u.findLastIndex), u.range = function(a, b, c) {
                    null == b && (b = a || 0, a = 0), c = c || 1;
                    for (var d = Math.max(Math.ceil((b - a) / c), 0), e = Array(d), f = 0; d > f; f++, a += c) e[f] = a;
                    return e
                };
                var F = function(a, b, c, d, e) {
                    if (!(d instanceof b)) return a.apply(c, e);
                    var f = y(a.prototype),
                        g = a.apply(f, e);
                    return u.isObject(g) ? g : f
                };
                u.bind = function(a, b) {
                    if (r && a.bind === r) return r.apply(a, m.call(arguments, 1));
                    if (!u.isFunction(a)) throw new TypeError("Bind must be called on a function");
                    var c = m.call(arguments, 2),
                        d = function() {
                            return F(a, d, b, this, c.concat(m.call(arguments)))
                        };
                    return d
                }, u.partial = function(a) {
                    var b = m.call(arguments, 1),
                        c = function() {
                            for (var d = 0, e = b.length, f = Array(e), g = 0; e > g; g++) f[g] = b[g] === u ? arguments[d++] : b[g];
                            for (; d < arguments.length;) f.push(arguments[d++]);
                            return F(a, c, this, this, f)
                        };
                    return c
                }, u.bindAll = function(a) {
                    var b, c, d = arguments.length;
                    if (1 >= d) throw new Error("bindAll must be passed function names");
                    for (b = 1; d > b; b++) c = arguments[b], a[c] = u.bind(a[c], a);
                    return a
                }, u.memoize = function(a, b) {
                    var c = function(d) {
                        var e = c.cache,
                            f = "" + (b ? b.apply(this, arguments) : d);
                        return u.has(e, f) || (e[f] = a.apply(this, arguments)), e[f]
                    };
                    return c.cache = {}, c
                }, u.delay = function(a, b) {
                    var c = m.call(arguments, 2);
                    return setTimeout(function() {
                        return a.apply(null, c)
                    }, b)
                }, u.defer = u.partial(u.delay, u, 1), u.throttle = function(a, b, c) {
                    var d, e, f, g = null,
                        h = 0;
                    c || (c = {});
                    var i = function() {
                        h = c.leading === !1 ? 0 : u.now(), g = null, f = a.apply(d, e), g || (d = e = null)
                    };
                    return function() {
                        var j = u.now();
                        h || c.leading !== !1 || (h = j);
                        var k = b - (j - h);
                        return d = this, e = arguments, 0 >= k || k > b ? (g && (clearTimeout(g), g = null), h = j, f = a.apply(d, e), g || (d = e = null)) : g || c.trailing === !1 || (g = setTimeout(i, k)), f
                    }
                }, u.debounce = function(a, b, c) {
                    var d, e, f, g, h, i = function() {
                        var j = u.now() - g;
                        b > j && j >= 0 ? d = setTimeout(i, b - j) : (d = null, c || (h = a.apply(f, e), d || (f = e = null)))
                    };
                    return function() {
                        f = this, e = arguments, g = u.now();
                        var j = c && !d;
                        return d || (d = setTimeout(i, b)), j && (h = a.apply(f, e), f = e = null), h
                    }
                }, u.wrap = function(a, b) {
                    return u.partial(b, a)
                }, u.negate = function(a) {
                    return function() {
                        return !a.apply(this, arguments)
                    }
                }, u.compose = function() {
                    var a = arguments,
                        b = a.length - 1;
                    return function() {
                        for (var c = b, d = a[b].apply(this, arguments); c--;) d = a[c].call(this, d);
                        return d
                    }
                }, u.after = function(a, b) {
                    return function() {
                        return --a < 1 ? b.apply(this, arguments) : void 0
                    }
                }, u.before = function(a, b) {
                    var c;
                    return function() {
                        return --a > 0 && (c = b.apply(this, arguments)), 1 >= a && (b = null), c
                    }
                }, u.once = u.partial(u.before, 2);
                var G = !{
                        toString: null
                    }.propertyIsEnumerable("toString"),
                    H = ["valueOf", "isPrototypeOf", "toString", "propertyIsEnumerable", "hasOwnProperty", "toLocaleString"];
                u.keys = function(a) {
                    if (!u.isObject(a)) return [];
                    if (q) return q(a);
                    var b = [];
                    for (var c in a) u.has(a, c) && b.push(c);
                    return G && f(a, b), b
                }, u.allKeys = function(a) {
                    if (!u.isObject(a)) return [];
                    var b = [];
                    for (var c in a) b.push(c);
                    return G && f(a, b), b
                }, u.values = function(a) {
                    for (var b = u.keys(a), c = b.length, d = Array(c), e = 0; c > e; e++) d[e] = a[b[e]];
                    return d
                }, u.mapObject = function(a, b, c) {
                    b = w(b, c);
                    for (var d, e = u.keys(a), f = e.length, g = {}, h = 0; f > h; h++) d = e[h], g[d] = b(a[d], d, a);
                    return g
                }, u.pairs = function(a) {
                    for (var b = u.keys(a), c = b.length, d = Array(c), e = 0; c > e; e++) d[e] = [b[e], a[b[e]]];
                    return d
                }, u.invert = function(a) {
                    for (var b = {}, c = u.keys(a), d = 0, e = c.length; e > d; d++) b[a[c[d]]] = c[d];
                    return b
                }, u.functions = u.methods = function(a) {
                    var b = [];
                    for (var c in a) u.isFunction(a[c]) && b.push(c);
                    return b.sort()
                }, u.extend = x(u.allKeys), u.extendOwn = u.assign = x(u.keys), u.findKey = function(a, b, c) {
                    b = w(b, c);
                    for (var d, e = u.keys(a), f = 0, g = e.length; g > f; f++)
                        if (d = e[f], b(a[d], d, a)) return d
                }, u.pick = function(a, b, c) {
                    var d, e, f = {},
                        g = a;
                    if (null == g) return f;
                    u.isFunction(b) ? (e = u.allKeys(g), d = v(b, c)) : (e = E(arguments, !1, !1, 1), d = function(a, b, c) {
                        return b in c
                    }, g = Object(g));
                    for (var h = 0, i = e.length; i > h; h++) {
                        var j = e[h],
                            k = g[j];
                        d(k, j, g) && (f[j] = k)
                    }
                    return f
                }, u.omit = function(a, b, c) {
                    if (u.isFunction(b)) b = u.negate(b);
                    else {
                        var d = u.map(E(arguments, !1, !1, 1), String);
                        b = function(a, b) {
                            return !u.contains(d, b)
                        }
                    }
                    return u.pick(a, b, c)
                }, u.defaults = x(u.allKeys, !0), u.create = function(a, b) {
                    var c = y(a);
                    return b && u.extendOwn(c, b), c
                }, u.clone = function(a) {
                    return u.isObject(a) ? u.isArray(a) ? a.slice() : u.extend({}, a) : a
                }, u.tap = function(a, b) {
                    return b(a), a
                }, u.isMatch = function(a, b) {
                    var c = u.keys(b),
                        d = c.length;
                    if (null == a) return !d;
                    for (var e = Object(a), f = 0; d > f; f++) {
                        var g = c[f];
                        if (b[g] !== e[g] || !(g in e)) return !1
                    }
                    return !0
                };
                var I = function(a, b, c, d) {
                    if (a === b) return 0 !== a || 1 / a === 1 / b;
                    if (null == a || null == b) return a === b;
                    a instanceof u && (a = a._wrapped), b instanceof u && (b = b._wrapped);
                    var e = n.call(a);
                    if (e !== n.call(b)) return !1;
                    switch (e) {
                        case "[object RegExp]":
                        case "[object String]":
                            return "" + a == "" + b;
                        case "[object Number]":
                            return +a !== +a ? +b !== +b : 0 === +a ? 1 / +a === 1 / b : +a === +b;
                        case "[object Date]":
                        case "[object Boolean]":
                            return +a === +b
                    }
                    var f = "[object Array]" === e;
                    if (!f) {
                        if ("object" != typeof a || "object" != typeof b) return !1;
                        var g = a.constructor,
                            h = b.constructor;
                        if (g !== h && !(u.isFunction(g) && g instanceof g && u.isFunction(h) && h instanceof h) && "constructor" in a && "constructor" in b) return !1
                    }
                    c = c || [], d = d || [];
                    for (var i = c.length; i--;)
                        if (c[i] === a) return d[i] === b;
                    if (c.push(a), d.push(b), f) {
                        if (i = a.length, i !== b.length) return !1;
                        for (; i--;)
                            if (!I(a[i], b[i], c, d)) return !1
                    } else {
                        var j, k = u.keys(a);
                        if (i = k.length, u.keys(b).length !== i) return !1;
                        for (; i--;)
                            if (j = k[i], !u.has(b, j) || !I(a[j], b[j], c, d)) return !1
                    }
                    return c.pop(), d.pop(), !0
                };
                u.isEqual = function(a, b) {
                    return I(a, b)
                }, u.isEmpty = function(a) {
                    return null == a ? !0 : C(a) && (u.isArray(a) || u.isString(a) || u.isArguments(a)) ? 0 === a.length : 0 === u.keys(a).length
                }, u.isElement = function(a) {
                    return !(!a || 1 !== a.nodeType)
                }, u.isArray = p || function(a) {
                    return "[object Array]" === n.call(a)
                }, u.isObject = function(a) {
                    var b = typeof a;
                    return "function" === b || "object" === b && !!a
                }, u.each(["Arguments", "Function", "String", "Number", "Date", "RegExp", "Error"], function(a) {
                    u["is" + a] = function(b) {
                        return n.call(b) === "[object " + a + "]"
                    }
                }), u.isArguments(arguments) || (u.isArguments = function(a) {
                    return u.has(a, "callee")
                }), "function" != typeof /./ && "object" != typeof Int8Array && (u.isFunction = function(a) {
                    return "function" == typeof a || !1
                }), u.isFinite = function(a) {
                    return isFinite(a) && !isNaN(parseFloat(a))
                }, u.isNaN = function(a) {
                    return u.isNumber(a) && a !== +a
                }, u.isBoolean = function(a) {
                    return a === !0 || a === !1 || "[object Boolean]" === n.call(a)
                }, u.isNull = function(a) {
                    return null === a
                }, u.isUndefined = function(a) {
                    return void 0 === a
                }, u.has = function(a, b) {
                    return null != a && o.call(a, b)
                }, u.noConflict = function() {
                    return g._ = h, this
                }, u.identity = function(a) {
                    return a
                }, u.constant = function(a) {
                    return function() {
                        return a
                    }
                }, u.noop = function() {}, u.property = z, u.propertyOf = function(a) {
                    return null == a ? function() {} : function(b) {
                        return a[b]
                    }
                }, u.matcher = u.matches = function(a) {
                    return a = u.extendOwn({}, a),
                        function(b) {
                            return u.isMatch(b, a)
                        }
                }, u.times = function(a, b, c) {
                    var d = Array(Math.max(0, a));
                    b = v(b, c, 1);
                    for (var e = 0; a > e; e++) d[e] = b(e);
                    return d
                }, u.random = function(a, b) {
                    return null == b && (b = a, a = 0), a + Math.floor(Math.random() * (b - a + 1))
                }, u.now = Date.now || function() {
                    return (new Date).getTime()
                };
                var J = {
                        "&": "&amp;",
                        "<": "&lt;",
                        ">": "&gt;",
                        '"': "&quot;",
                        "'": "&#x27;",
                        "`": "&#x60;"
                    },
                    K = u.invert(J),
                    L = function(a) {
                        var b = function(b) {
                                return a[b]
                            },
                            c = "(?:" + u.keys(a).join("|") + ")",
                            d = RegExp(c),
                            e = RegExp(c, "g");
                        return function(a) {
                            return a = null == a ? "" : "" + a, d.test(a) ? a.replace(e, b) : a
                        }
                    };
                u.escape = L(J), u.unescape = L(K), u.result = function(a, b, c) {
                    var d = null == a ? void 0 : a[b];
                    return void 0 === d && (d = c), u.isFunction(d) ? d.call(a) : d
                };
                var M = 0;
                u.uniqueId = function(a) {
                    var b = ++M + "";
                    return a ? a + b : b
                }, u.templateSettings = {
                    evaluate: /<%([\s\S]+?)%>/g,
                    interpolate: /<%=([\s\S]+?)%>/g,
                    escape: /<%-([\s\S]+?)%>/g
                };
                var N = /(.)^/,
                    O = {
                        "'": "'",
                        "\\": "\\",
                        "\r": "r",
                        "\n": "n",
                        "\u2028": "u2028",
                        "\u2029": "u2029"
                    },
                    P = /\\|'|\r|\n|\u2028|\u2029/g,
                    Q = function(a) {
                        return "\\" + O[a]
                    };
                u.template = function(a, b, c) {
                    !b && c && (b = c), b = u.defaults({}, b, u.templateSettings);
                    var d = RegExp([(b.escape || N).source, (b.interpolate || N).source, (b.evaluate || N).source].join("|") + "|$", "g"),
                        e = 0,
                        f = "__p+='";
                    a.replace(d, function(b, c, d, g, h) {
                        return f += a.slice(e, h).replace(P, Q), e = h + b.length, c ? f += "'+\n((__t=(" + c + "))==null?'':_.escape(__t))+\n'" : d ? f += "'+\n((__t=(" + d + "))==null?'':__t)+\n'" : g && (f += "';\n" + g + "\n__p+='"), b
                    }), f += "';\n", b.variable || (f = "with(obj||{}){\n" + f + "}\n"), f = "var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n" + f + "return __p;\n";
                    try {
                        var g = new Function(b.variable || "obj", "_", f)
                    } catch (h) {
                        throw h.source = f, h
                    }
                    var i = function(a) {
                            return g.call(this, a, u)
                        },
                        j = b.variable || "obj";
                    return i.source = "function(" + j + "){\n" + f + "}", i
                }, u.chain = function(a) {
                    var b = u(a);
                    return b._chain = !0, b
                };
                var R = function(a, b) {
                    return a._chain ? u(b).chain() : b
                };
                u.mixin = function(a) {
                    u.each(u.functions(a), function(b) {
                        var c = u[b] = a[b];
                        u.prototype[b] = function() {
                            var a = [this._wrapped];
                            return l.apply(a, arguments), R(this, c.apply(u, a))
                        }
                    })
                }, u.mixin(u), u.each(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function(a) {
                    var b = i[a];
                    u.prototype[a] = function() {
                        var c = this._wrapped;
                        return b.apply(c, arguments), "shift" !== a && "splice" !== a || 0 !== c.length || delete c[0], R(this, c)
                    }
                }), u.each(["concat", "join", "slice"], function(a) {
                    var b = i[a];
                    u.prototype[a] = function() {
                        return R(this, b.apply(this._wrapped, arguments))
                    }
                }), u.prototype.value = function() {
                    return this._wrapped
                }, u.prototype.valueOf = u.prototype.toJSON = u.prototype.value, u.prototype.toString = function() {
                    return "" + this._wrapped
                }, "function" == typeof define && define.amd && define("underscore", [], function() {
                    return u
                })
            }).call(this)
        }, {}],
        36: [function(a, b, c) {
            function d(a) {
                return a.replace(/[\/]+/g, "/").replace(/\/\?/g, "?").replace(/\/\#/g, "#").replace(/\:\//g, "://")
            }
            b.exports = function() {
                var a = [].slice.call(arguments, 0).join("/");
                return d(a)
            }
        }, {}],
        37: [function(a, b, c) {
            "use strict";
            var d = a("extend"),
                e = a("url"),
                f = a("path");
            b.exports = function() {
                var a, b, c = Array.prototype.slice.call(arguments),
                    g = {};
                return c.length ? 1 === c.length ? c[0] : (b = c.map(function(b) {
                    var c = "function" == typeof b ? b() : String(b || "");
                    if (!c) return "";
                    var f = e.parse(c, !0);
                    return !a && f && (a = f), d(g, f.query), f.pathname
                }).filter(function(a) {
                    return !!a
                }), delete a.search, a.query = g, a.pathname = f.join.apply(f, b).replace(new RegExp("\\" + f.sep, "g"), "/"), e.format(a)) : ""
            }
        }, {
            extend: 38,
            path: 7,
            url: 13
        }],
        38: [function(a, b, c) {
            var d, e = Object.prototype.hasOwnProperty,
                f = Object.prototype.toString,
                g = function(a) {
                    return "function" == typeof Array.isArray ? Array.isArray(a) : "[object Array]" === f.call(a)
                },
                h = function(a) {
                    "use strict";
                    if (!a || "[object Object]" !== f.call(a)) return !1;
                    var b = e.call(a, "constructor"),
                        c = a.constructor && a.constructor.prototype && e.call(a.constructor.prototype, "isPrototypeOf");
                    if (a.constructor && !b && !c) return !1;
                    var g;
                    for (g in a);
                    return g === d || e.call(a, g)
                };
            b.exports = function i() {
                "use strict";
                var a, b, c, e, f, j, k = arguments[0],
                    l = 1,
                    m = arguments.length,
                    n = !1;
                for ("boolean" == typeof k ? (n = k, k = arguments[1] || {}, l = 2) : ("object" != typeof k && "function" != typeof k || null == k) && (k = {}); m > l; ++l)
                    if (a = arguments[l], null != a)
                        for (b in a) c = k[b], e = a[b], k !== e && (n && e && (h(e) || (f = g(e))) ? (f ? (f = !1, j = c && g(c) ? c : []) : j = c && h(c) ? c : {}, k[b] = i(n, j, e)) : e !== d && (k[b] = e));
                return k
            }
        }, {}],
        39: [function(a, b, c) {
            (function(a) {
                var c;
                if (a.crypto && crypto.getRandomValues) {
                    var d = new Uint8Array(16);
                    c = function() {
                        return crypto.getRandomValues(d), d
                    }
                }
                if (!c) {
                    var e = new Array(16);
                    c = function() {
                        for (var a, b = 0; 16 > b; b++) 0 === (3 & b) && (a = 4294967296 * Math.random()), e[b] = a >>> ((3 & b) << 3) & 255;
                        return e
                    }
                }
                b.exports = c
            }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
        }, {}],
        40: [function(a, b, c) {
            function d(a, b, c) {
                var d = b && c || 0,
                    e = 0;
                for (b = b || [], a.toLowerCase().replace(/[0-9a-f]{2}/g, function(a) {
                        16 > e && (b[d + e++] = j[a])
                    }); 16 > e;) b[d + e++] = 0;
                return b
            }

            function e(a, b) {
                var c = b || 0,
                    d = i;
                return d[a[c++]] + d[a[c++]] + d[a[c++]] + d[a[c++]] + "-" + d[a[c++]] + d[a[c++]] + "-" + d[a[c++]] + d[a[c++]] + "-" + d[a[c++]] + d[a[c++]] + "-" + d[a[c++]] + d[a[c++]] + d[a[c++]] + d[a[c++]] + d[a[c++]] + d[a[c++]]
            }

            function f(a, b, c) {
                var d = b && c || 0,
                    f = b || [];
                a = a || {};
                var g = void 0 !== a.clockseq ? a.clockseq : n,
                    h = void 0 !== a.msecs ? a.msecs : (new Date).getTime(),
                    i = void 0 !== a.nsecs ? a.nsecs : p + 1,
                    j = h - o + (i - p) / 1e4;
                if (0 > j && void 0 === a.clockseq && (g = g + 1 & 16383), (0 > j || h > o) && void 0 === a.nsecs && (i = 0), i >= 1e4) throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
                o = h, p = i, n = g, h += 122192928e5;
                var k = (1e4 * (268435455 & h) + i) % 4294967296;
                f[d++] = k >>> 24 & 255, f[d++] = k >>> 16 & 255, f[d++] = k >>> 8 & 255, f[d++] = 255 & k;
                var l = h / 4294967296 * 1e4 & 268435455;
                f[d++] = l >>> 8 & 255, f[d++] = 255 & l, f[d++] = l >>> 24 & 15 | 16, f[d++] = l >>> 16 & 255, f[d++] = g >>> 8 | 128, f[d++] = 255 & g;
                for (var q = a.node || m, r = 0; 6 > r; r++) f[d + r] = q[r];
                return b ? b : e(f)
            }

            function g(a, b, c) {
                var d = b && c || 0;
                "string" == typeof a && (b = "binary" == a ? new Array(16) : null, a = null), a = a || {};
                var f = a.random || (a.rng || h)();
                if (f[6] = 15 & f[6] | 64, f[8] = 63 & f[8] | 128, b)
                    for (var g = 0; 16 > g; g++) b[d + g] = f[g];
                return b || e(f)
            }
            for (var h = a("./rng"), i = [], j = {}, k = 0; 256 > k; k++) i[k] = (k + 256).toString(16).substr(1), j[i[k]] = k;
            var l = h(),
                m = [1 | l[0], l[1], l[2], l[3], l[4], l[5]],
                n = 16383 & (l[6] << 8 | l[7]),
                o = 0,
                p = 0,
                q = g;
            q.v1 = f, q.v4 = g, q.parse = d, q.unparse = e, b.exports = q
        }, {
            "./rng": 39
        }],
        41: [function(a, b, c) {
            ! function(d, e) {
                "function" == typeof define && define.amd ? define(["underscore", "marionette"], e) : "object" == typeof c && (b.exports = e(a("underscore"), a("backbone.marionette")))
            }(this, function(a, b) {
                "use strict";
                return b.Object.extend({
                    viewClass: b.ItemView,
                    viewOptions: {},
                    viewEvents: {},
                    viewTriggers: {},
                    modelEvents: {},
                    collectionEvents: {},
                    isDestroyedWithView: !0,
                    constructor: function(a) {
                        a || (a = {}), a.model && (this.model = a.model, this.modelEvents = this.getModelEvents(), b.bindEntityEvents(this, this.model, this.modelEvents)), a.collection && (this.collection = a.collection, this.collectionEvents = this.getCollectionEvents(), b.bindEntityEvents(this, this.collection, this.collectionEvents)), b.Object.call(this, a)
                    },
                    getViewClass: function() {
                        return this.getOption("viewClass")
                    },
                    _getOption: function(b) {
                        var c = this.getOption(b);
                        return a.isFunction(c) && (c = c.call(this)), c
                    },
                    getViewOptions: function() {
                        var b = {};
                        this.model && (b.model = this.model), this.collection && (b.collection = this.collection);
                        var c = this._getOption("viewOptions");
                        return a.extend(b, c)
                    },
                    getViewEvents: function() {
                        return this._getOption("viewEvents")
                    },
                    getViewTriggers: function() {
                        return this._getOption("viewTriggers")
                    },
                    getModelEvents: function() {
                        return this._getOption("modelEvents")
                    },
                    getCollectionEvents: function() {
                        return this._getOption("collectionEvents")
                    },
                    buildView: function() {
                        var a = this.getViewOptions(),
                            b = this.getViewClass(),
                            c = new b(a);
                        return this.bindEvents(c), this.bindTriggers(c), c
                    },
                    bindEvents: function(a) {
                        this.viewEvents = this.getViewEvents(), b.bindEntityEvents(this, a, this.viewEvents), this.triggerMethod("bind:events", a)
                    },
                    bindTriggers: function(b) {
                        this.viewTriggers = this.getViewTriggers(), a.each(this.viewTriggers, function(a, c) {
                            this._buildTrigger(b, c, a)
                        }, this), this.triggerMethod("bind:triggers", b)
                    },
                    _buildTrigger: function(b, c, d) {
                        this.listenTo(b, c, a.bind(function() {
                            this.trigger.apply(this, a.union([d], a.toArray(arguments)))
                        }, this))
                    },
                    hasView: function() {
                        return this.view && !this.view.isDestroyed
                    },
                    getView: function() {
                        return (!this.view || this.view.isDestroyed) && (this.view = this.buildView(), this.getOption("isDestroyedWithView") && this.listenTo(this.view, "destroy", this.destroy)), this.view
                    },
                    onDestroy: function() {
                        this.view && !this.view.isDestroyed && this.view.destroy()
                    }
                })
            })
        }, {
            "backbone.marionette": 2,
            underscore: 35
        }],
        42: [function(a, b, c) {
            ! function() {
                "use strict";

                function a(a) {
                    if ("string" != typeof a && (a = a.toString()), /[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(a)) throw new TypeError("Invalid character in header field name");
                    return a.toLowerCase()
                }

                function b(a) {
                    return "string" != typeof a && (a = a.toString()), a
                }

                function c(a) {
                    this.map = {}, a instanceof c ? a.forEach(function(a, b) {
                        this.append(b, a)
                    }, this) : a && Object.getOwnPropertyNames(a).forEach(function(b) {
                        this.append(b, a[b])
                    }, this)
                }

                function d(a) {
                    return a.bodyUsed ? Promise.reject(new TypeError("Already read")) : void(a.bodyUsed = !0)
                }

                function e(a) {
                    return new Promise(function(b, c) {
                        a.onload = function() {
                            b(a.result)
                        }, a.onerror = function() {
                            c(a.error)
                        }
                    })
                }

                function f(a) {
                    var b = new FileReader;
                    return b.readAsArrayBuffer(a), e(b)
                }

                function g(a) {
                    var b = new FileReader;
                    return b.readAsText(a), e(b)
                }

                function h() {
                    return this.bodyUsed = !1, this._initBody = function(a) {
                        if (this._bodyInit = a, "string" == typeof a) this._bodyText = a;
                        else if (n.blob && Blob.prototype.isPrototypeOf(a)) this._bodyBlob = a;
                        else if (n.formData && FormData.prototype.isPrototypeOf(a)) this._bodyFormData = a;
                        else {
                            if (a) throw new Error("unsupported BodyInit type");
                            this._bodyText = ""
                        }
                    }, n.blob ? (this.blob = function() {
                        var a = d(this);
                        if (a) return a;
                        if (this._bodyBlob) return Promise.resolve(this._bodyBlob);
                        if (this._bodyFormData) throw new Error("could not read FormData body as blob");
                        return Promise.resolve(new Blob([this._bodyText]))
                    }, this.arrayBuffer = function() {
                        return this.blob().then(f)
                    }, this.text = function() {
                        var a = d(this);
                        if (a) return a;
                        if (this._bodyBlob) return g(this._bodyBlob);
                        if (this._bodyFormData) throw new Error("could not read FormData body as text");
                        return Promise.resolve(this._bodyText)
                    }) : this.text = function() {
                        var a = d(this);
                        return a ? a : Promise.resolve(this._bodyText)
                    }, n.formData && (this.formData = function() {
                        return this.text().then(k)
                    }), this.json = function() {
                        return this.text().then(JSON.parse)
                    }, this
                }

                function i(a) {
                    var b = a.toUpperCase();
                    return o.indexOf(b) > -1 ? b : a
                }

                function j(a, b) {
                    if (b = b || {}, this.url = a, this.credentials = b.credentials || "omit", this.headers = new c(b.headers), this.method = i(b.method || "GET"), this.mode = b.mode || null, this.referrer = null, ("GET" === this.method || "HEAD" === this.method) && b.body) throw new TypeError("Body not allowed for GET or HEAD requests");
                    this._initBody(b.body)
                }

                function k(a) {
                    var b = new FormData;
                    return a.trim().split("&").forEach(function(a) {
                        if (a) {
                            var c = a.split("="),
                                d = c.shift().replace(/\+/g, " "),
                                e = c.join("=").replace(/\+/g, " ");
                            b.append(decodeURIComponent(d), decodeURIComponent(e))
                        }
                    }), b
                }

                function l(a) {
                    var b = new c,
                        d = a.getAllResponseHeaders().trim().split("\n");
                    return d.forEach(function(a) {
                        var c = a.trim().split(":"),
                            d = c.shift().trim(),
                            e = c.join(":").trim();
                        b.append(d, e)
                    }), b
                }

                function m(a, b) {
                    b || (b = {}), this._initBody(a), this.type = "default", this.url = null, this.status = b.status, this.ok = this.status >= 200 && this.status < 300, this.statusText = b.statusText, this.headers = b.headers instanceof c ? b.headers : new c(b.headers), this.url = b.url || ""
                }
                if (!self.fetch) {
                    c.prototype.append = function(c, d) {
                        c = a(c), d = b(d);
                        var e = this.map[c];
                        e || (e = [], this.map[c] = e), e.push(d)
                    }, c.prototype["delete"] = function(b) {
                        delete this.map[a(b)]
                    }, c.prototype.get = function(b) {
                        var c = this.map[a(b)];
                        return c ? c[0] : null
                    }, c.prototype.getAll = function(b) {
                        return this.map[a(b)] || []
                    }, c.prototype.has = function(b) {
                        return this.map.hasOwnProperty(a(b))
                    }, c.prototype.set = function(c, d) {
                        this.map[a(c)] = [b(d)]
                    }, c.prototype.forEach = function(a, b) {
                        Object.getOwnPropertyNames(this.map).forEach(function(c) {
                            this.map[c].forEach(function(d) {
                                a.call(b, d, c, this)
                            }, this)
                        }, this)
                    };
                    var n = {
                            blob: "FileReader" in self && "Blob" in self && function() {
                                try {
                                    return new Blob, !0
                                } catch (a) {
                                    return !1
                                }
                            }(),
                            formData: "FormData" in self
                        },
                        o = ["DELETE", "GET", "HEAD", "OPTIONS", "POST", "PUT"];
                    h.call(j.prototype), h.call(m.prototype), self.Headers = c, self.Request = j, self.Response = m, self.fetch = function(a, b) {
                        var c;
                        return c = j.prototype.isPrototypeOf(a) && !b ? a : new j(a, b), new Promise(function(a, b) {
                            function d() {
                                return "responseURL" in e ? e.responseURL : /^X-Request-URL:/m.test(e.getAllResponseHeaders()) ? e.getResponseHeader("X-Request-URL") : void 0
                            }
                            var e = new XMLHttpRequest;
                            e.onload = function() {
                                var c = 1223 === e.status ? 204 : e.status;
                                if (100 > c || c > 599) return void b(new TypeError("Network request failed"));
                                var f = {
                                        status: c,
                                        statusText: e.statusText,
                                        headers: l(e),
                                        url: d()
                                    },
                                    g = "response" in e ? e.response : e.responseText;
                                a(new m(g, f))
                            }, e.onerror = function() {
                                b(new TypeError("Network request failed"))
                            }, e.open(c.method, c.url, !0), "include" === c.credentials && (e.withCredentials = !0), "responseType" in e && n.blob && (e.responseType = "blob"), c.headers.forEach(function(a, b) {
                                e.setRequestHeader(b, a)
                            }), e.send("undefined" == typeof c._bodyInit ? null : c._bodyInit)
                        })
                    }, self.fetch.polyfill = !0
                }
            }()
        }, {}],
        43: [function(a, b, c) {
            "use strict";
            a("es6-promise").polyfill(), a("whatwg-fetch"), a("./utils/backbone.ajax");
            var d = a("jquery");
            a("./utils/jquery.support.cssproperty"), "function" != typeof Object.getPrototypeOf && ("object" == typeof "test".__proto__ ? Object.getPrototypeOf = function(a) {
                return a.__proto__
            } : Object.getPrototypeOf = function(a) {
                return a.constructor.prototype
            });
            var e = a("backbone");
            e.$ = d;
            var f = a("backbone.marionette");
            a("backbone-associations");
            var g = a("marionette.behaviors/lib/behaviors/stickit-behavior"),
                h = a("marionette.behaviors/lib/behaviors/jquery-behavior");
            f.Behaviors.behaviorsLookup = function() {
                return {
                    stickit: g,
                    jQuery: h
                }
            }
        }, {
            "./utils/backbone.ajax": 59,
            "./utils/jquery.support.cssproperty": 61,
            backbone: 6,
            "backbone-associations": 1,
            "backbone.marionette": 2,
            "es6-promise": 15,
            jquery: 17,
            "marionette.behaviors/lib/behaviors/jquery-behavior": 33,
            "marionette.behaviors/lib/behaviors/stickit-behavior": 34,
            "whatwg-fetch": 42
        }],
        44: [function(a, b, c) {
            "use strict";
            var d = a("backbone"),
                e = a("../models/conversation");
            b.exports = d.Collection.extend({
                model: e,
                url: "conversations/"
            })
        }, {
            "../models/conversation": 54,
            backbone: 6
        }],
        45: [function(a, b, c) {
            "use strict";
            var d = a("backbone"),
                e = a("../models/message");
            b.exports = d.Collection.extend({
                model: e,
                comparator: "received"
            })
        }, {
            "../models/message": 56,
            backbone: 6
        }],
        46: [function(a, b, c) {
            "use strict";
            var d, e = a("jquery"),
                f = a("lodash.bindall"),
                g = a("underscore"),
                h = a("view-controller"),
                i = a("../endpoint"),
                j = a("../vent"),
                k = a("../faye"),
                l = a("../models/conversation"),
                m = a("../collections/conversations"),
                n = a("../views/chatView"),
                o = a("../views/headerView"),
                p = a("../views/conversationView"),
                q = a("../views/settingsHeaderView"),
                r = a("../views/emailNotificationView"),
                s = a("../controllers/chatInputController"),
                t = a("../controllers/settingsController");
            b.exports = h.extend({
                viewClass: n,
                viewEvents: {
                    focus: "resetUnread"
                },
                initialize: function() {
                    f(this), this.isOpened = !1, this.user = this.getOption("user"), this.uiText = this.getOption("uiText") || {}, this.collection = new m
                },
                open: function() {
                    this.view && this.chatInputController && !this.isOpened && (this.isOpened = !0, this.view.open(), this.conversationView.positionLogo(), this.isMobileDevice() || this.chatInputController.focus())
                },
                close: function() {
                    this.view && this.isOpened && (this.isOpened = !1, this.view.close(), this.resetUnread())
                },
                toggle: function() {
                    this.isOpened ? this.close() : this.open()
                },
                sendMessage: function(a) {
                    var b = this;
                    return new Promise(function(a, c) {
                        b.conversation.isNew() ? b.conversation = b.collection.create(b.conversation, {
                            success: a,
                            error: c
                        }) : a(b.conversation)
                    }).then(this._initFaye).then(function(a) {
                        return b.user._save({}, {
                            wait: !0
                        }).then(g.constant(a))
                    }).then(function(b) {
                        return new Promise(function(c, d) {
                            b.get("messages").create({
                                authorId: i.appUserId,
                                text: a
                            }, {
                                success: c,
                                error: d
                            })
                        })
                    }).then(function(a) {
                        var c = b.conversation.get("messages").filter(function(a) {
                            return a.get("authorId") === i.appUserId
                        });
                        return b.getOption("emailCaptureEnabled") && 1 === c.length && !b.user.get("email") && b._showEmailNotification(), a
                    })
                },
                scrollToBottom: function() {
                    this.conversationView && !this.conversationView.isDestroyed && this.conversationView.scrollToBottom()
                },
                _showEmailNotification: function() {
                    var a = new r({
                        settingsNotificationText: this.uiText.settingsNotificationText
                    });
                    this.listenTo(a, "notification:close", this._hideEmailNotification), this.listenTo(a, "settings:navigate", this._showSettings), this.listenToOnce(a, "destroy", function() {
                        this.stopListening(a)
                    }), this.getView().notifications.show(a)
                },
                _hideEmailNotification: function() {
                    this.getView().notifications.empty()
                },
                _showSettings: function() {
                    this._hideEmailNotification(), this._renderSettingsHeader(), this._renderSettingsView()
                },
                _hideSettings: function() {
                    this.getView().settings.empty(), this._renderChatHeader()
                },
                _receiveMessage: function(a) {
                    this.conversation && (this.conversation.get("appMakers").get(a.authorId) || this.conversation.get("appMakers").add({
                        id: a.authorId
                    }), this.conversation.get("messages").add(a))
                },
                _getConversation: function() {
                    if (this.conversation) {
                        if (this.conversation.isNew() && this.collection.length > 0) {
                            var a = this.collection.at(0).toJSON();
                            this.conversation.get("messages").forEach(function(b) {
                                a.messages.push(b.toJSON())
                            }), this.conversation.set(a), this.collection.shift(), this.collection.unshift(this.conversation)
                        }
                    } else this.collection.length > 0 ? this.conversation = this.collection.at(0) : this.conversation = new l({
                        appUserId: i.appUserId
                    });
                    return Promise.resolve(this.conversation)
                },
                _initFaye: function(a) {
                    return a.isNew() ? Promise.resolve(a) : k.init(a.id).then(function(b) {
                        return this._fayeClient = b, a
                    }.bind(this))
                },
                _initConversation: function() {
                    var a;
                    return a = this.collection.length > 0 && !this.collection.at(0).isNew() ? this._getConversation() : this.collection.fetch().then(this._getConversation).then(this._initFaye).then(g.bind(function(a) {
                        return a.isNew() && this.listenTo(this.user, "change:conversationStarted", this.onConversationStarted), a
                    }, this))
                },
                _initMessagingBus: function(a) {
                    return this.listenTo(j, "receive:message", this._receiveMessage), a
                },
                _manageUnread: function(a) {
                    return this._updateUnread(), this.listenTo(a.get("messages"), "add", this._updateUnread), a
                },
                _renderChatHeader: function() {
                    var a = new o({
                        model: this.model,
                        headerText: this.uiText.headerText,
                        emailCaptureEnabled: this.getOption("emailCaptureEnabled")
                    });
                    this.listenTo(a, "toggle", this.toggle), this.listenTo(a, "notification:click", this._showSettings), this.listenTo(a, "destroy", function() {
                        this.stopListening(a)
                    }), this.getView().header.show(a)
                },
                _renderSettingsHeader: function() {
                    var a = new q({
                        settingsHeaderText: this.uiText.settingsHeaderText
                    });
                    this.listenTo(a, "settings:close", this._hideSettings), this.listenTo(a, "widget:close", function() {
                        this.toggle(), this._hideSettings()
                    }), this.listenToOnce(a, "destroy", function() {
                        this.stopListening(a)
                    }), this.getView().header.show(a)
                },
                _renderSettingsView: function() {
                    var a = new t({
                        model: this.user,
                        viewOptions: {
                            emailCaptureEnabled: this.getOption("emailCaptureEnabled"),
                            readOnlyEmail: this.getOption("readOnlyEmail"),
                            settingsText: this.uiText.settingsText,
                            settingsReadOnlyText: this.uiText.settingsReadOnlyText,
                            settingsInputPlaceholder: this.uiText.settingsInputPlaceholder,
                            settingsSaveButtonText: this.uiText.settingsSaveButtonText
                        }
                    });
                    this.listenToOnce(a, "settings:close", this._hideSettings), this.listenToOnce(a, "destroy", function() {
                        this.stopListening(a)
                    }), this.getView().settings.show(a.getView())
                },
                _renderConversation: function() {
                    this.conversationView = new p({
                        model: this.model,
                        collection: this.model.get("messages"),
                        childViewOptions: {
                            conversation: this.model
                        },
                        introText: this.uiText.introText
                    }), this.isMobileDevice() && this.listenTo(this.conversationView, "render", function() {
                        d = window.innerHeight, window.addEventListener("resize", function() {
                            this.keyboardToggled(window.innerHeight < d)
                        }.bind(this), !1)
                    }), this.getView().main.show(this.conversationView)
                },
                _renderConversationInput: function() {
                    this.chatInputController = new s({
                        model: this.model,
                        collection: this.model.get("messages"),
                        viewOptions: {
                            inputPlaceholder: this.uiText.inputPlaceholder,
                            sendButtonText: this.uiText.sendButtonText
                        }
                    }), this.listenTo(this.chatInputController, "message:send", this.sendMessage), this.listenTo(this.chatInputController, "message:read", this.resetUnread), this.getView().footer.show(this.chatInputController.getView())
                },
                _renderWidget: function(a) {
                    this.model = a, this._renderChatHeader(), this._renderConversation(), this._renderConversationInput()
                },
                onConversationStarted: function(a, b) {
                    b && (this.stopListening(this.user, "change:conversationStarted", this.onConversationStarted), this._initConversation())
                },
                getWidget: function() {
                    var a = this.getView();
                    return a.isRendered ? e.Deferred().resolve(a) : (a.render()._reInitializeRegions(), this._initConversation().then(this._initMessagingBus).then(this._manageUnread).then(this._renderWidget).then(function() {
                        return a
                    }))
                },
                _getLatestReadTimeKey: function() {
                    return "sk_latestts_" + (i.userId || "anonymous")
                },
                _getLatestReadTime: function() {
                    var a, b = this._getLatestReadTimeKey();
                    try {
                        a = parseInt(localStorage.getItem(b) || 0)
                    } catch (c) {
                        a = 0
                    }
                    return a
                },
                _setLatestReadTime: function(a) {
                    var b = this._getLatestReadTimeKey();
                    localStorage.setItem(b, a)
                },
                _updateUnread: function() {
                    var a = this._getLatestReadTime(),
                        b = this.conversation.get("messages").chain().filter(function(a) {
                            return !this.conversation.get("appUsers").get(a.get("authorId"))
                        }.bind(this)).filter(function(b) {
                            return Math.floor(b.get("received")) > a
                        }).value();
                    this.unread !== b.length && this.conversation.set("unread", b.length);
                },
                clearUnread: function() {
                    var a = this._getLatestReadTimeKey();
                    localStorage.removeItem(a)
                },
                resetUnread: function() {
                    var a = 0,
                        b = this.conversation.get("messages").max(function(a) {
                            return a.get("received")
                        });
                    b !== -(1 / 0) && (a = Math.floor(b.get("received"))), this._setLatestReadTime(a), this._updateUnread()
                },
                keyboardToggled: function(a) {
                    this.conversationView && !this.conversationView.isDestroyed && this.conversationView.keyboardToggled(a)
                },
                isMobileDevice: function() {
                    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
                },
                onDestroy: function() {
                    this._fayeClient && this._fayeClient.disconnect(), h.prototype.onDestroy.call(this)
                }
            })
        }, {
            "../collections/conversations": 44,
            "../controllers/chatInputController": 47,
            "../controllers/settingsController": 48,
            "../endpoint": 49,
            "../faye": 50,
            "../models/conversation": 54,
            "../vent": 62,
            "../views/chatView": 64,
            "../views/conversationView": 65,
            "../views/emailNotificationView": 66,
            "../views/headerView": 67,
            "../views/settingsHeaderView": 69,
            jquery: 17,
            "lodash.bindall": 18,
            underscore: 35,
            "view-controller": 41
        }],
        47: [function(a, b, c) {
            "use strict";
            var d = a("underscore"),
                e = a("view-controller"),
                f = a("../views/chatInputView");
            b.exports = e.extend({
                viewClass: f,
                viewEvents: {
                    "message:send": "onMessageSend"
                },
                viewTriggers: {
                    "message:read": "message:read"
                },
                onMessageSend: function() {
                    var a = this.view.getValue();
                    d.isEmpty(a.trim()) || (this.view.resetValue(), this.trigger("message:send", a))
                },
                focus: function() {
                    this.view.focus()
                }
            })
        }, {
            "../views/chatInputView": 63,
            underscore: 35,
            "view-controller": 41
        }],
        48: [function(a, b, c) {
            "use strict";
            var d = a("view-controller"),
                e = a("../views/settingsView");
            b.exports = d.extend({
                viewClass: e,
                viewTriggers: {
                    "settings:close": "settings:close"
                },
                viewEvents: {
                    "settings:save": "onSettingsSave"
                },
                viewOptions: {
                    readOnlyEmail: !1
                },
                modelEvents: {
                    "change:email": "onEmailChange",
                    sync: "onModelSync"
                },
                initialize: function() {
                    this.savedEmail = this.model.get("email"), this.isDirty = !1
                },
                onSettingsSave: function() {
                    this.isDirty ? (this.listenToOnce(this.model, "sync", function() {
                        this.trigger("settings:close")
                    }), this.model._save({}, {
                        wait: !0
                    })) : this.trigger("settings:close")
                },
                onEmailChange: function() {
                    this.isDirty = !0
                },
                onModelSync: function() {
                    this.isDirty = !1, this.savedEmail = this.model.get("email")
                },
                onDestroy: function() {
                    this.isDirty && this.model.set("email", this.savedEmail)
                }
            })
        }, {
            "../views/settingsView": 70,
            "view-controller": 41
        }],
        49: [function(a, b, c) {
            var d = "https://sdk.supportkit.io";
            b.exports.rootUrl = d, b.exports.appToken = void 0, b.exports.jwt = void 0, b.exports.appUserId = void 0, b.exports.userId = void 0, b.exports.reset = function() {
                delete this.jwt, delete this.appUserId, delete this.userId
            }
        }, {}],
        50: [function(a, b, c) {
            "use strict";
            var d = a("faye"),
                e = a("./endpoint"),
                f = a("./vent");
            b.exports.init = function(a) {
                var b = new d.Client(e.rootUrl + "/faye");
                return b.addExtension({
                    outgoing: function(a, b) {
                        "/meta/subscribe" === a.channel && (e.jwt ? a.jwt = e.jwt : a.appUserId = e.appUserId, a.appToken = e.appToken), b(a)
                    }
                }), b.subscribe("/conversations/" + a, function(a) {
                    f.trigger("receive:message", a)
                })
            }
        }, {
            "./endpoint": 49,
            "./vent": 62,
            faye: 16
        }],
        51: [function(a, b, c) {
            (function(c) {
                "use strict";
                a("./bootstrap");
                var d = a("backbone"),
                    e = a("underscore"),
                    f = a("jquery"),
                    g = (a("cookie"), a("uuid")),
                    h = a("url-join"),
                    i = a("lodash.bindall"),
                    j = a("./models/event"),
                    k = a("./models/rule"),
                    l = a("./models/appUser"),
                    m = a("./controllers/chatController"),
                    n = a("./endpoint"),
                    o = a("./utils/api"),
                    p = "sk_deviceid";
                a("../stylesheets/main.less");
                var q = d.Collection.extend({
                        model: j
                    }),
                    r = d.Collection.extend({
                        model: k
                    }),
                    s = function() {
                        i(this), this._widgetRendered = !1, this.user = new l, this._eventCollection = new q, this._ruleCollection = new r
                    };
                e.extend(s.prototype, d.Events, {
                    VERSION: "1.0.0",
                    defaultText: {
                        headerText: "Hi there!",
                        inputPlaceholder: "Type a message...",
                        sendButtonText: "Send",
                        introText: "This is the beginning of your conversation.<br/> Ask me anything!",
                        settingsText: "You can leave me your email so that we can get back to you this way.",
                        settingsReadOnlyText: "I'll get back to you at this email address.",
                        settingsInputPlaceholder: "Your email address",
                        settingsSaveButtonText: "Save",
                        settingsHeaderText: "Email Settings",
                        settingsNotificationText: 'In case we\'re slow to respond you can <a href="#" data-ui-settings-link>leave us your email</a>.'
                    },
                    _checkReady: function(a) {
                        if (!this.ready) throw new Error(a || "Can't use this function until the SDK is ready.")
                    },
                    init: function(a) {
                        if (this.ready) return Promise.resolve();
                        if (/lebo|awle|pide|obo|rawli/i.test(navigator.userAgent)) {
                            var b = f("<a>").attr("href", "https://supportkit.io?utm_source=widget").text("In app messaging by supportkit");
                            return f(function() {
                                f("body").append(b)
                            }), this.ready = !0, Promise.resolve()
                        }
                        if (!f.support.cssProperty("transform")) return Promise.reject(new Error("SupportKit is not supported on this browser. Missing capability: css-transform"));
                        this.ready = !1, a = a || {};
                        var c = !e.isEmpty(a.email),
                            d = a.emailCaptureEnabled && !c,
                            g = e.extend({}, this.defaultText, a.customText);
                        return this.options = e.defaults(a, {
                            emailCaptureEnabled: d,
                            readOnlyEmail: c,
                            uiText: g
                        }), "string" == typeof a && (a = {
                            appToken: a
                        }), "object" != typeof a ? Promise.reject(new Error("init method accepts an object or string")) : (n.appToken = a.appToken, a.serviceUrl && (n.rootUrl = a.serviceUrl), n.appToken ? this.login(a.userId, a.jwt) : Promise.reject(new Error("init method requires an appToken")))
                    },
                    login: function(a, b) {
                        this.user.isNew() || !a || this.user.get("userId") || this._chatController.clearUnread(), this._cleanState();
                        var c = {
                            deviceId: this.getDeviceId(),
                            deviceInfo: {
                                URL: document.location.host,
                                userAgent: navigator.userAgent,
                                referrer: document.referrer,
                                browserLanguage: navigator.language,
                                currentUrl: document.location.href,
                                sdkVersion: this.VERSION,
                                currentTitle: document.title,
                                platform: "web"
                            }
                        };
                        return a && (c.userId = a, n.userId = a), b && (n.jwt = b), o.call({
                            url: "appboot",
                            method: "POST",
                            data: c
                        }).then(e(function(a) {
                            return this.user.set(a.appUser), n.appUserId = this.user.id, this._eventCollection.url = h("appusers", this.user.id, "event"), this._eventCollection.reset(a.events, {
                                parse: !0
                            }), this._ruleCollection.reset(a.rules, {
                                parse: !0
                            }), this.user.save(e.pick(this.options, l.EDITABLE_PROPERTIES), {
                                parse: !0,
                                wait: !0
                            })
                        }).bind(this)).then(e(function() {
                            return this._renderWidget()
                        }).bind(this))["catch"](function(a) {
                            var b = a && (a.message || a.statusText);
                            console.error("SupportKit init error: ", b)
                        })
                    },
                    logout: function() {
                        return Promise.resolve(this.ready ? this.login() : void 0)
                    },
                    getDeviceId: function() {
                        var a;
                        return a = localStorage.getItem(p) || g.v4().replace(/-/g, ""), localStorage.setItem(p, a), a
                    },
                    resetUnread: function() {
                        this._checkReady(), this._chatController.resetUnread()
                    },
                    sendMessage: function(a) {
                        return this._checkReady("Can not send messages until init has completed"), this._chatController.sendMessage(a)
                    },
                    open: function() {
                        this._checkReady(), this._chatController.open()
                    },
                    close: function() {
                        this._checkReady(), this._chatController.close()
                    },
                    updateUser: function(a) {
                        if ("object" != typeof a) return new Promise(function(a, b) {
                            b(new Error("updateUser accepts an object as parameter"))
                        });
                        var b = this.user;
                        return new Promise(function(c, d) {
                            b.save(a, {
                                parse: !0,
                                wait: !0
                            }).then(function() {
                                c(b)
                            })["catch"](d)
                        })
                    },
                    track: function(a) {
                        this._checkReady();
                        var b = this._rulesContainEvent(a);
                        b ? this._eventCollection.create({
                            name: a,
                            user: this.user
                        }, {
                            success: e.bind(this._checkConversationState, this)
                        }) : this._ensureEventExists(a)
                    },
                    _ensureEventExists: function(a) {
                        var b = this._hasEvent(a);
                        b || o.call({
                            url: "event",
                            method: "PUT",
                            data: {
                                name: a
                            }
                        }).then(e.bind(function() {
                            this._eventCollection.add({
                                name: a,
                                user: this.user
                            })
                        }, this))
                    },
                    _rulesContainEvent: function(a) {
                        return !!this._ruleCollection.find(function(b) {
                            return !!b.get("events").findWhere({
                                name: a
                            })
                        })
                    },
                    _hasEvent: function(a) {
                        return "skt-appboot" === a || !!this._eventCollection.findWhere({
                            name: a
                        })
                    },
                    _checkConversationState: function() {
                        (!this._chatController.conversation || this._chatController.conversation.isNew()) && this._chatController._initConversation()
                    },
                    _renderWidget: function() {
                        return this._chatController = new m({
                            user: this.user,
                            readOnlyEmail: this.options.readOnlyEmail,
                            emailCaptureEnabled: this.options.emailCaptureEnabled,
                            uiText: this.options.uiText
                        }), this._chatController.getWidget().then(function(a) {
                            f("body").append(a.el), this._widgetRendered = !0, e(function() {
                                this._chatController.scrollToBottom()
                            }).chain().bind(this).delay(), this.ready = !0, this.appbootedOnce || (this.track("skt-appboot"), this.appbootedOnce = !0), this.trigger("ready")
                        }.bind(this))
                    },
                    _cleanState: function() {
                        this.user.clear(), this._ruleCollection.reset(), this._eventCollection.reset(), this._widgetRendered && this._chatController.destroy(), n.reset(), this.ready = !1, this._widgetRendered = !1
                    },
                    destroy: function() {
                        this._cleanState(), delete n.appToken
                    }
                }), b.exports = c.SupportKit = new s
            }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
        }, {
            "../stylesheets/main.less": 71,
            "./bootstrap": 43,
            "./controllers/chatController": 46,
            "./endpoint": 49,
            "./models/appUser": 53,
            "./models/event": 55,
            "./models/rule": 57,
            "./utils/api": 58,
            backbone: 6,
            cookie: 14,
            jquery: 17,
            "lodash.bindall": 18,
            underscore: 35,
            "url-join": 36,
            uuid: 40
        }],
        52: [function(a, b, c) {
            "use strict";
            var d = a("backbone-associations"),
                e = a("underscore");
            b.exports = d.AssociatedModel.extend({
                parse: function(a) {
                    return e.isObject(a) ? a : {
                        id: a
                    }
                }
            })
        }, {
            "backbone-associations": 1,
            underscore: 35
        }],
        53: [function(a, b, c) {
            "use strict";
            var d = a("underscore"),
                e = a("backbone-associations"),
                f = b.exports = e.AssociatedModel.extend({
                    idAttribute: "_id",
                    initialize: function() {
                        this._throttleSave = d.throttle(this._save.bind(this), 5e3)
                    },
                    parse: function(a) {
                        return d.isObject(a) ? a : {
                            _id: a
                        }
                    },
                    url: function() {
                        return "appusers/" + this.id
                    },
                    defaults: function() {
                        return {
                            properties: {},
                            conversationStarted: !1
                        }
                    },
                    isDirty: function(a) {
                        a || (a = {});
                        var b = d.extend({}, this.attributes, a);
                        return !this._lastPropertyValues || d.some(f.EDITABLE_PROPERTIES, function(a) {
                            return !d.isEqual(this._lastPropertyValues[a], b[a])
                        }.bind(this))
                    },
                    _save: function(a, b) {
                        a || (a = {}), b || (b = {});
                        var c = b && b.success;
                        return new Promise(function(g) {
                            return this.isDirty(a) ? (b.success = d.bind(function(a, b, d) {
                                this._lastPropertyValues = this.pick(f.EDITABLE_PROPERTIES), c && c(a, b, d), g(a, b, d)
                            }, this), e.Model.prototype.save.call(this, a, b)) : (c && c(this, null, null), g(this, null, null))
                        }.bind(this))
                    },
                    save: function(a, b) {
                        return this._throttleSave.call(this, a, b)
                    }
                }, {
                    EDITABLE_PROPERTIES: ["givenName", "surname", "email", "properties"]
                })
        }, {
            "backbone-associations": 1,
            underscore: 35
        }],
        54: [function(a, b, c) {
            "use strict";
            var d = a("backbone-associations"),
                e = a("url-join"),
                f = a("./appMaker"),
                g = a("./appUser"),
                h = a("../collections/messages");
            b.exports = d.AssociatedModel.extend({
                idAttribute: "_id",
                urlRoot: "conversations/",
                defaults: function() {
                    return {
                        unread: 0,
                        messages: [],
                        appUsers: [],
                        appMakers: []
                    }
                },
                relations: [{
                    type: d.Many,
                    key: "messages",
                    collectionType: function() {
                        var a = this;
                        return h.extend({
                            url: function() {
                                return e(a.url(), "/messages/")
                            }
                        })
                    }
                }, {
                    type: d.Many,
                    key: "appMakers",
                    relatedModel: f
                }, {
                    type: d.Many,
                    key: "appUsers",
                    relatedModel: g
                }]
            })
        }, {
            "../collections/messages": 45,
            "./appMaker": 52,
            "./appUser": 53,
            "backbone-associations": 1,
            "url-join": 36
        }],
        55: [function(a, b, c) {
            "use strict";
            var d = a("underscore"),
                e = a("backbone-associations"),
                f = a("./appUser");
            b.exports = e.AssociatedModel.extend({
                parse: function(a) {
                    return d.isObject(a) ? a : {
                        name: a
                    }
                },
                relations: [{
                    type: e.One,
                    key: "user",
                    relatedModel: f
                }]
            })
        }, {
            "./appUser": 53,
            "backbone-associations": 1,
            underscore: 35
        }],
        56: [function(a, b, c) {
            "use strict";
            var d = a("backbone-associations");
            b.exports = d.AssociatedModel.extend({
                idAttribute: "_id"
            })
        }, {
            "backbone-associations": 1
        }],
        57: [function(a, b, c) {
            "use strict";
            var d = a("underscore"),
                e = a("backbone-associations"),
                f = a("./event");
            b.exports = e.AssociatedModel.extend({
                idAttribute: "_id",
                parse: function(a) {
                    return d(a).extend({
                        events: d(a.events || []).map(function(a) {
                            return {
                                name: a
                            }
                        })
                    })
                },
                relations: [{
                    type: e.Many,
                    key: "events",
                    relatedModel: f
                }]
            })
        }, {
            "./event": 55,
            "backbone-associations": 1,
            underscore: 35
        }],
        58: [function(a, b, c) {
            "use strict";

            function d(a, b) {
                var c = "";
                for (var d in b) b.hasOwnProperty(d) && null !== b[d] && (c += "&" + encodeURIComponent(d) + "=" + encodeURIComponent(b[d]));
                return c && (a += (~a.indexOf("?") ? "&" : "?") + c.substring(1)), a
            }

            function e(a) {
                if (a.status >= 200 && a.status < 300) return a;
                throw new Error(a.statusText)
            }

            function f(a) {
                return 202 !== a.status && 204 !== a.status ? a.json() : void 0
            }
            var g = a("underscore"),
                h = a("../endpoint"),
                i = a("urljoin");
            b.exports.call = function(a) {
                var b = i(h.rootUrl, "/api/", a.url),
                    c = a.data,
                    j = a.method;
                g.isString(c) && (c = JSON.parse(c)), c = g.extend({}, c, {
                    appUserId: h.appUserId
                });
                var k = {
                    method: j
                };
                "GET" === j ? b = d(b, c) : ("POST" === j || "PUT" === j) && (k.body = JSON.stringify(c));
                var l = {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                };
                return h.appToken && (l["app-token"] = h.appToken), h.jwt && (l.Authorization = "Bearer " + h.jwt), k.headers = l, new Promise(function(c, d) {
                    fetch(b, k).then(e).then(f).then(function(b) {
                        "function" == typeof a.success && a.success(b), c(b)
                    })["catch"](function(b) {
                        "function" == typeof a.error && a.error(b), d(b)
                    })
                })
            }
        }, {
            "../endpoint": 49,
            underscore: 35,
            urljoin: 37
        }],
        59: [function(a, b, c) {
            "use strict";
            var d = a("backbone"),
                e = a("./api");
            d.ajax = function(a) {
                return a.method = a.type, delete a.type, e.call(a)
            }
        }, {
            "./api": 58,
            backbone: 6
        }],
        60: [function(a, b, c) {
            "use strict";

            function d(a, b) {
                b || (b = {});
                var c = /(^|[\s\n]|<br\/?>)((?:[a-z]*):\/\/[\-A-Z0-9+\u0026\u2019@#\/%?=()~_|!:,.;]*[\-A-Z0-9+\u0026@#\/%=~()_|])/gi,
                    d = e.map(b, function(a, b) {
                        return b + '="' + a + '"'
                    }).join(" ");
                return a.replace(c, "$1<a " + d + " href='$2'>$2</a>")
            }
            var e = a("underscore");
            b.exports = {
                autolink: d
            }
        }, {
            underscore: 35
        }],
        61: [function(a, b, c) {
            "use strict";
            var d = a("jquery");
            d.support.cssProperty = function() {
                function a(a, b) {
                    var c = document.body || document.documentElement,
                        d = c.style;
                    if ("undefined" == typeof d) return !1;
                    if ("string" == typeof d[a]) return b ? a : !0;
                    for (var e = ["Moz", "Webkit", "Khtml", "O", "ms", "Icab"], a = a.charAt(0).toUpperCase() + a.substr(1), f = 0; f < e.length; f++)
                        if ("string" == typeof d[e[f] + a]) return b ? e[f] + a : !0;
                    return !1
                }
                return a
            }()
        }, {
            jquery: 17
        }],
        62: [function(a, b, c) {
            var d = a("backbone.marionette");
            b.exports = new d.Object
        }, {
            "backbone.marionette": 2
        }],
        63: [function(a, b, c) {
            var d = a("backbone.marionette"),
                e = a("../../templates/chatInput.tpl");
            b.exports = d.ItemView.extend({
                id: "sk-footer",
                template: e,
                events: {
                    "submit form": "submit",
                    "click .send": "submit",
                    "keyup input": "resetUnread"
                },
                triggers: {
                    "submit @ui.form": "message:send",
                    "click @ui.sendButton": "message:send",
                    "keyup @ui.input": "message:read"
                },
                ui: {
                    input: "[data-ui-input]",
                    form: "[data-ui-form]",
                    sendButton: "[data-ui-send]"
                },
                getValue: function() {
                    return this.ui.input.val()
                },
                resetValue: function() {
                    this.ui.input.val("")
                },
                focus: function() {
                    this.ui.input.focus()
                },
                serializeData: function() {
                    return {
                        inputPlaceholder: this.getOption("inputPlaceholder"),
                        sendButtonText: this.getOption("sendButtonText")
                    }
                }
            })
        }, {
            "../../templates/chatInput.tpl": 73,
            "backbone.marionette": 2
        }],
        64: [function(a, b, c) {
            var d = a("backbone.marionette"),
                e = a("../../templates/chat.tpl");
            b.exports = d.LayoutView.extend({
                id: "sk-container",
                template: e,
                className: "sk-noanimation sk-close",
                triggers: {
                    "focus @ui.wrapper": "focus"
                },
                modelEvents: {
                    change: "open"
                },
                ui: {
                    wrapper: "#sk-wrapper"
                },
                regions: {
                    header: "[data-region-header]",
                    notifications: "[data-region-notifications]",
                    settings: "[data-region-settings]",
                    main: "[data-region-main]",
                    footer: "[data-region-footer]"
                },
                open: function() {
                    this.enableAnimation(), this.$el.removeClass("sk-close").addClass("sk-appear")
                },
                close: function() {
                    this.enableAnimation(), this.$el.removeClass("sk-appear").addClass("sk-close")
                },
                toggle: function() {
                    this.enableAnimation(), this.$el.toggleClass("sk-appear sk-close")
                },
                enableAnimation: function() {
                    this.$el.removeClass("sk-noanimation")
                }
            })
        }, {
            "../../templates/chat.tpl": 72,
            "backbone.marionette": 2
        }],
        65: [function(a, b, c) {
            var d = a("../../templates/conversation.tpl"),
                e = a("backbone.marionette"),
                f = a("./messageView");
            b.exports = e.CompositeView.extend({
                id: "sk-conversation",
                childView: f,
                template: d,
                childViewContainer: "[data-ui-messages]",
                ui: {
                    logo: ".sk-logo",
                    intro: ".sk-intro",
                    messages: "[data-ui-messages]"
                },
                scrollToBottom: function(a) {
                    a ? this.$el.scrollTop(this.$el.get(0).scrollHeight) : this.$el.scrollTop(this.$el.get(0).scrollHeight - this.$el.outerHeight() - this.ui.logo.outerHeight())
                },
                onAddChild: function() {
                    this.scrollToBottom(), this.positionLogo()
                },
                onShow: function() {
                    this.scrollToBottom()
                },
                serializeData: function() {
                    return {
                        introText: this.getOption("introText")
                    }
                },
                keyboardToggled: function(a) {
                    a ? (this.ui.logo.hide(), this.scrollToBottom(!0)) : (this.ui.logo.show(), this.scrollToBottom())
                },
                positionLogo: function() {
                    var a = this.$el.outerHeight(),
                        b = this.ui.logo.outerHeight(),
                        c = this.ui.intro.outerHeight(),
                        d = this.ui.messages.outerHeight(),
                        e = a - (c + d + b);
                    e > b ? this.ui.logo.addClass("anchor-bottom") : this.ui.logo.removeClass("anchor-bottom")
                }
            })
        }, {
            "../../templates/conversation.tpl": 74,
            "./messageView": 68,
            "backbone.marionette": 2
        }],
        66: [function(a, b, c) {
            "use strict";
            var d = a("backbone.marionette"),
                e = a("underscore"),
                f = a("../../templates/emailNotification.tpl");
            b.exports = d.ItemView.extend({
                tagName: "p",
                template: f,
                ui: {
                    close: "[data-ui-close]",
                    settingsLink: "[data-ui-settings-link]"
                },
                triggers: {
                    "click @ui.close": "notification:close",
                    "click @ui.settingsLink": "settings:navigate"
                },
                onRender: function() {
                    this.$el.hide(), e.defer(e.bind(this.transitionIn_, this))
                },
                transitionIn_: function() {
                    this.$el.slideDown()
                },
                remove: function() {
                    var a = e.bind(function() {
                        d.ItemView.prototype.remove.call(this)
                    }, this);
                    this.$el.slideUp(400, a)
                },
                serializeData: function() {
                    return e.extend(d.ItemView.prototype.serializeData.call(this), {
                        settingsNotificationText: this.getOption("settingsNotificationText")
                    })
                }
            })
        }, {
            "../../templates/emailNotification.tpl": 75,
            "backbone.marionette": 2,
            underscore: 35
        }],
        67: [function(a, b, c) {
            "use strict";
            var d = a("backbone.marionette"),
                e = a("../../templates/header.tpl");
            b.exports = d.ItemView.extend({
                id: "sk-header",
                triggers: {
                    click: "toggle",
                    "click @ui.notificationBadge": "notification:click"
                },
                template: e,
                ui: {
                    badge: "[data-ui-badge]",
                    notificationBadge: "[data-ui-notification-badge]"
                },
                behaviors: {
                    stickit: {
                        "@ui.badge": {
                            observe: "unread",
                            visible: "isBadgeVisible",
                            updateView: !0
                        }
                    }
                },
                isBadgeVisible: function(a) {
                    return a > 0
                },
                serializeData: function() {
                    return {
                        headerText: this.getOption("headerText"),
                        emailCaptureEnabled: this.getOption("emailCaptureEnabled")
                    }
                }
            })
        }, {
            "../../templates/header.tpl": 76,
            "backbone.marionette": 2
        }],
        68: [function(a, b, c) {
            var d = a("backbone.marionette"),
                e = a("urljoin"),
                f = a("jquery"),
                g = a("underscore"),
                h = a("../utils/html"),
                i = a("../../templates/message.tpl"),
                j = a("../endpoint");
            b.exports = d.ItemView.extend({
                template: i,
                className: function() {
                    return "sk-row " + (this._isAppMaker() ? "sk-left-row" : "sk-right-row")
                },
                ui: {
                    name: "[data-ui-name]",
                    message: "[data-ui-message]",
                    avatar: "[data-ui-avatar]",
                    action: ".sk-action"
                },
                events: {
                    "mouseup @ui.action": "onActionMouseup"
                },
                behaviors: {
                    stickit: {
                        "@ui.name": {
                            observe: "name",
                            onGet: function(a) {
                                return this._isAppMaker() ? a : ""
                            }
                        },
                        "@ui.message": {
                            observe: ["text", "actions"],
                            update: function(a, b) {
                                if (b[0].trim().length > 0) {
                                    var c = f("<div/>").text(b[0]).html().replace(/\n/g, "<br />");
                                    c = h.autolink(c, {
                                        "class": "link",
                                        target: "_blank"
                                    }), b[1] && b[1].length > 0 && a.addClass("has-actions"), a.html(c)
                                }
                            }
                        },
                        "@ui.avatar": {
                            observe: ["avatarUrl", "authorId"],
                            update: function(a, b) {
                                var c = b[0],
                                    d = b[1];
                                this._isAppMaker() && (c = c || e(j.rootUrl, "/api/users/", d, "/avatar"), a.attr("src", c))
                            },
                            visible: function() {
                                return this._isAppMaker()
                            },
                            updateView: !0
                        }
                    }
                },
                _isAppMaker: function() {
                    var a = this.getOption("conversation").get("appMakers");
                    return !!a.findWhere({
                        id: this.model.get("authorId")
                    })
                },
                serializeData: function() {
                    var a = d.ItemView.prototype.serializeData.call(this);
                    return g.defaults(a, {
                        actions: []
                    })
                },
                onActionMouseup: function(a) {
                    f(a.target).blur()
                }
            })
        }, {
            "../../templates/message.tpl": 77,
            "../endpoint": 49,
            "../utils/html": 60,
            "backbone.marionette": 2,
            jquery: 17,
            underscore: 35,
            urljoin: 37
        }],
        69: [function(a, b, c) {
            "use strict";
            var d = a("backbone.marionette"),
                e = a("underscore"),
                f = a("../../templates/settingsHeader.tpl");
            b.exports = d.ItemView.extend({
                id: "sk-settings-header",
                ui: {
                    closeButton: "[data-ui-close]"
                },
                triggers: {
                    click: "settings:close",
                    "click @ui.closeButton": "widget:close"
                },
                template: f,
                serializeData: function() {
                    return e.extend(d.ItemView.prototype.serializeData.call(this), {
                        settingsHeaderText: this.getOption("settingsHeaderText")
                    })
                }
            })
        }, {
            "../../templates/settingsHeader.tpl": 79,
            "backbone.marionette": 2,
            underscore: 35
        }],
        70: [function(a, b, c) {
            var d = a("backbone.marionette"),
                e = a("underscore"),
                f = a("jquery"),
                g = a("lodash.bindall"),
                h = a("../../templates/settings.tpl");
            b.exports = d.ItemView.extend({
                id: "sk-settings",
                template: h,
                ui: {
                    email: "[data-ui-email]",
                    saveButton: "[data-ui-save]",
                    formMessage: "[data-ui-form-message]",
                    form: "[data-ui-form]"
                },
                behaviors: {
                    stickit: {
                        "@ui.email": {
                            observe: "email",
                            onSet: "onEmailSet",
                            update: "emailUpdate"
                        }
                    }
                },
                triggers: {
                    "click @ui.saveButton": "settings:save"
                },
                events: {
                    "submit @ui.form": "onFormSubmit"
                },
                initialize: function() {
                    g(this)
                },
                emailUpdate: function(a, b) {
                    a.val(b), this.getOption("readOnlyEmail") && a.attr("disabled", !0)
                },
                onEmailSet: function(a) {
                    var b = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
                        c = b.test(a);
                    return c ? (this.ui.email.parent().removeClass("has-error"), this.ui.saveButton.removeAttr("disabled")) : (this.ui.email.parent().addClass("has-error"), this.ui.saveButton.attr("disabled", !0)), a
                },
                onFormSubmit: function(a) {
                    a.preventDefault();
                    var b = this.ui.email.parent().hasClass("has-error");
                    b || this.trigger("settings:save")
                },
                showSavedMessage: function() {
                    var a = f('<span><i class="fa fa-check success"></i> Saved!</span>'),
                        b = function() {
                            a.fadeOut(500, a.remove)
                        };
                    this.ui.formMessage.append(a), e(b).chain().bind(this).delay(400)
                },
                serializeData: function() {
                    var a = d.ItemView.prototype.serializeData.apply(this, e.toArray(arguments));
                    return e.extend(a, {
                        readOnlyEmail: this.getOption("readOnlyEmail"),
                        settingsText: this.getOption("settingsText"),
                        settingsReadOnlyText: this.getOption("settingsReadOnlyText"),
                        settingsInputPlaceholder: this.getOption("settingsInputPlaceholder"),
                        settingsSaveButtonText: this.getOption("settingsSaveButtonText")
                    })
                },
                onRender: function() {
                    this.$el.hide(), e.defer(e.bind(this.transitionIn, this))
                },
                transitionIn: function() {
                    this.$el.animate({
                        width: "toggle",
                        opacity: 1
                    }, 250)
                },
                transitionOut: function(a) {
                    this.$el.animate({
                        width: "toggle",
                        opacity: 0
                    }, 250, a)
                },
                remove: function() {
                    var a = e.bind(function() {
                        d.ItemView.prototype.remove.call(this)
                    }, this);
                    this.transitionOut(a)
                }
            })
        }, {
            "../../templates/settings.tpl": 78,
            "backbone.marionette": 2,
            jquery: 17,
            "lodash.bindall": 18,
            underscore: 35
        }],
        71: [function(a, b, c) {
            ! function() {
                var a = document.getElementsByTagName("head")[0],
                    b = document.createElement("style");
                b.type = "text/css";
                var c = ".sk-appear{-webkit-transform:translateY(90%);transform:translateY(90%);-webkit-animation:sk-appear-frames .4s cubic-bezier(.62, .28, .23, .99);animation:sk-appear-frames .4s cubic-bezier(.62, .28, .23, .99);-webkit-animation-delay:0s;animation-delay:0s;-webkit-animation-fill-mode:forwards;animation-fill-mode:forwards}.sk-appear #sk-handle{-webkit-transform:rotate(270deg);transform:rotate(270deg);-webkit-animation:sk-rotate-frames .4s cubic-bezier(.62, .28, .23, .99);animation:sk-rotate-frames .4s cubic-bezier(.62, .28, .23, .99);-webkit-animation-delay:0s;animation-delay:0s;-webkit-animation-fill-mode:forwards;animation-fill-mode:forwards}@-webkit-keyframes sk-appear-frames{0%{-webkit-transform:translateY(90%)}100%{-webkit-transform:translateY(0)}}@keyframes sk-appear-frames{0%{transform:translateY(90%)}100%{transform:translateY(0)}}@-webkit-keyframes sk-rotate-frames{0%{-webkit-transform:rotate(270deg)}100%{-webkit-transform:rotate(90deg)}}@keyframes sk-rotate-frames{0%{transform:rotate(270deg)}100%{transform:rotate(90deg)}}.sk-close{-webkit-transform:translateY(10%);transform:translateY(10%);-webkit-animation:sk-close-frames .4s cubic-bezier(.62, .28, .23, .99);animation:sk-close-frames .4s cubic-bezier(.62, .28, .23, .99);-webkit-animation-delay:0s;animation-delay:0s;-webkit-animation-fill-mode:forwards;animation-fill-mode:forwards}@-webkit-keyframes sk-close-frames{0%{-webkit-transform:translateY(0)}100%{-webkit-transform:translateY(90%)}}@keyframes sk-close-frames{0%{transform:translateY(0)}100%{transform:translateY(90%)}}.sk-close #sk-handle{-webkit-transform:rotate(90deg);transform:rotate(90deg);-webkit-animation:sk-rotate-close-frames .7s cubic-bezier(.62, .28, .23, .99);animation:sk-rotate-close-frames .7s cubic-bezier(.62, .28, .23, .99);-webkit-animation-delay:0s;animation-delay:0s;-webkit-animation-fill-mode:forwards;animation-fill-mode:forwards}@-webkit-keyframes sk-rotate-close-frames{0%{-webkit-transform:rotate(90deg)}100%{-webkit-transform:rotate(270deg)}}@keyframes sk-rotate-close-frames{0%{transform:rotate(90deg)}100%{transform:rotate(270deg)}}.sk-noanimation{-webkit-animation:none;animation:none}.sk-noselect{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;-webkit-touch-callout:none;-khtml-user-select:none}#sk-container{position:fixed;bottom:0;right:10px;margin-bottom:-1px;box-shadow:0 0 24px rgba(0,0,0,0.15);border:1px solid rgba(0,0,0,0.15);font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-weight:400;font-size:13px;line-height:1.4;border-radius:10px 10px 0 0;color:#333;-webkit-transform:translate(0, 90%);-ms-transform:translate(0, 90%);-o-transform:translate(0, 90%);transform:translate(0, 90%);z-index:2147483647;text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased;-moz-font-smoothing:antialiased;/*!\n *  Font Awesome custom set up\n */}#sk-container div,#sk-container a,#sk-container form,#sk-container input{-webkit-box-sizing:content-box;box-sizing:content-box}#sk-container #sk-wrapper{background:#3f3f3f;width:330px;height:420px;position:relative;border-radius:10px 10px 0 0}@media (max-width:768px){#sk-container{right:0;border-radius:0;width:100%}#sk-container.sk-appear,#sk-container.sk-appear #sk-wrapper{height:100%}#sk-container #sk-wrapper{width:100%}}@font-face{font-family:'FontAwesome';src:url('//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/fonts/fontawesome-webfont.eot?v=4.4.0');src:url('//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/fonts/fontawesome-webfont.eot?#iefix&v=4.4.0') format('embedded-opentype'),url('//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/fonts/fontawesome-webfont.woff2?v=4.4.0') format('woff2'),url('//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/fonts/fontawesome-webfont.woff?v=4.4.0') format('woff'),url('//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/fonts/fontawesome-webfont.ttf?v=4.4.0') format('truetype'),url('//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/fonts/fontawesome-webfont.svg?v=4.4.0#fontawesomeregular') format('svg');font-weight:normal;font-style:normal}#sk-container .fa{display:inline-block;font:normal normal normal 14px/1 FontAwesome;font-size:inherit;text-rendering:auto;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}#sk-container .fa-envelope-o:before{content:\"\\f003\"}#sk-container .fa-gear:before,#sk-container .fa-cog:before{content:\"\\f013\"}#sk-container .fa-check:before{content:\"\\f00c\"}#sk-container .fa-times:before{content:\"\\f00d\"}#sk-container .fa-arrow-left:before{content:\"\\f060\"}#sk-container .fa-arrow-up:before{content:\"\\f062\"}#sk-container html,#sk-container body,#sk-container div,#sk-container span,#sk-container applet,#sk-container object,#sk-container iframe,#sk-container h1,#sk-container h2,#sk-container h3,#sk-container h4,#sk-container h5,#sk-container h6,#sk-container p,#sk-container blockquote,#sk-container pre,#sk-container a,#sk-container abbr,#sk-container acronym,#sk-container address,#sk-container big,#sk-container cite,#sk-container code,#sk-container del,#sk-container dfn,#sk-container em,#sk-container img,#sk-container ins,#sk-container kbd,#sk-container q,#sk-container s,#sk-container samp,#sk-container small,#sk-container strike,#sk-container strong,#sk-container sub,#sk-container sup,#sk-container tt,#sk-container var,#sk-container b,#sk-container u,#sk-container i,#sk-container center,#sk-container dl,#sk-container dt,#sk-container dd,#sk-container ol,#sk-container ul,#sk-container li,#sk-container fieldset,#sk-container form,#sk-container label,#sk-container legend,#sk-container table,#sk-container caption,#sk-container tbody,#sk-container tfoot,#sk-container thead,#sk-container tr,#sk-container th,#sk-container td,#sk-container article,#sk-container aside,#sk-container canvas,#sk-container details,#sk-container embed,#sk-container figure,#sk-container figcaption,#sk-container footer,#sk-container header,#sk-container hgroup,#sk-container menu,#sk-container nav,#sk-container output,#sk-container ruby,#sk-container section,#sk-container summary,#sk-container time,#sk-container mark,#sk-container audio,#sk-container video{border:0;font-size:100%;font:inherit;vertical-align:baseline;margin:0;padding:0}#sk-container article,#sk-container aside,#sk-container details,#sk-container figcaption,#sk-container figure,#sk-container footer,#sk-container header,#sk-container hgroup,#sk-container menu,#sk-container nav,#sk-container section{display:block}#sk-container body{line-height:1}#sk-container ol,#sk-container ul{list-style:none}#sk-container blockquote,#sk-container q{quotes:none}#sk-container blockquote:before,#sk-container blockquote:after,#sk-container q:before,#sk-container q:after{content:none}#sk-container table{border-collapse:collapse;border-spacing:0}#sk-container .input-group{padding:5px 0}#sk-container .input-group.has-error .input{border-color:#d9534f}#sk-container .input{background-color:#fbfbfb;border:1px solid #e8e8e8;padding:0 9px;border-radius:4px;height:33px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:13px}#sk-container .input::-webkit-input-placeholder,#sk-container .input:-moz-placeholder,#sk-container .input::-moz-placeholder,#sk-container .input:-ms-input-placeholder{color:#00aeff;opacity:1}#sk-container .input:focus{background-color:white;color:#212121;outline:0}#sk-container .btn{display:inline-block;margin-bottom:0;font-weight:normal;text-align:center;vertical-align:middle;touch-action:manipulation;cursor:pointer;background-image:none;border:1px solid transparent;white-space:nowrap;padding:6px 12px;font-size:13px;line-height:1.42857143;border-radius:4px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}#sk-container .btn:focus,#sk-container .btn:active:focus,#sk-container .btn.active:focus,#sk-container .btn.focus,#sk-container .btn:active.focus,#sk-container .btn.active.focus{outline:thin dotted;outline:5px auto -webkit-focus-ring-color;outline-offset:-2px}#sk-container .btn:hover,#sk-container .btn:focus,#sk-container .btn.focus{color:#333;text-decoration:none}#sk-container .btn:active,#sk-container .btn.active{outline:0;background-image:none;-webkit-box-shadow:inset 0 3px 5px rgba(0,0,0,0.125);box-shadow:inset 0 3px 5px rgba(0,0,0,0.125)}#sk-container .btn.disabled,#sk-container .btn[disabled],fieldset[disabled] #sk-container .btn{cursor:not-allowed;opacity:.65;filter:alpha(opacity=65);-webkit-box-shadow:none;box-shadow:none}a#sk-container .btn.disabled,fieldset[disabled] a#sk-container .btn{pointer-events:none}#sk-container .btn-sk-primary{color:white;background-color:#00aeff;border-color:#00aeff}#sk-container .btn-sk-primary:focus,#sk-container .btn-sk-primary.focus{color:white;background-color:#008bcc;border-color:#005780}#sk-container .btn-sk-primary:hover{color:white;background-color:#008bcc;border-color:#0084c2}#sk-container .btn-sk-primary:active,#sk-container .btn-sk-primary.active,.open>.dropdown-toggle#sk-container .btn-sk-primary{color:white;background-color:#008bcc;border-color:#0084c2}#sk-container .btn-sk-primary:active:hover,#sk-container .btn-sk-primary.active:hover,.open>.dropdown-toggle#sk-container .btn-sk-primary:hover,#sk-container .btn-sk-primary:active:focus,#sk-container .btn-sk-primary.active:focus,.open>.dropdown-toggle#sk-container .btn-sk-primary:focus,#sk-container .btn-sk-primary:active.focus,#sk-container .btn-sk-primary.active.focus,.open>.dropdown-toggle#sk-container .btn-sk-primary.focus{color:white;background-color:#0073a8;border-color:#005780}#sk-container .btn-sk-primary:active,#sk-container .btn-sk-primary.active,.open>.dropdown-toggle#sk-container .btn-sk-primary{background-image:none}#sk-container .btn-sk-primary.disabled,#sk-container .btn-sk-primary[disabled],fieldset[disabled] #sk-container .btn-sk-primary,#sk-container .btn-sk-primary.disabled:hover,#sk-container .btn-sk-primary[disabled]:hover,fieldset[disabled] #sk-container .btn-sk-primary:hover,#sk-container .btn-sk-primary.disabled:focus,#sk-container .btn-sk-primary[disabled]:focus,fieldset[disabled] #sk-container .btn-sk-primary:focus,#sk-container .btn-sk-primary.disabled.focus,#sk-container .btn-sk-primary[disabled].focus,fieldset[disabled] #sk-container .btn-sk-primary.focus,#sk-container .btn-sk-primary.disabled:active,#sk-container .btn-sk-primary[disabled]:active,fieldset[disabled] #sk-container .btn-sk-primary:active,#sk-container .btn-sk-primary.disabled.active,#sk-container .btn-sk-primary[disabled].active,fieldset[disabled] #sk-container .btn-sk-primary.active{background-color:#00aeff;border-color:#00aeff}#sk-container .btn-sk-primary .badge{color:#00aeff;background-color:white}#sk-container a.btn{text-decoration:none}#sk-container.sk-appear .sk-appear-hidden{display:none}#sk-container.sk-appear .sk-appear-visible{display:block}#sk-container.sk-close .sk-close-hidden{display:none}#sk-container.sk-close .sk-close-visible{display:block}#sk-container #sk-header{z-index:1;height:28px;box-size:border-box;line-height:28px;padding:6px 18px;position:relative;background-color:white;cursor:pointer;border-radius:8px 8px 0 0;font-size:16px;font-weight:300;text-align:center}#sk-container #sk-header .fa{line-height:28px;color:#808080;font-size:15px}#sk-container #sk-header .sk-close-handle,#sk-container #sk-header .sk-show-handle{position:absolute;top:6px;right:10px}#sk-container #sk-header .sk-back-handle{display:inline-block;margin-right:8px}#sk-container #sk-header .sk-close-handle .fa{font-size:17px}#sk-container #sk-badge{background-color:#e74c3c;border-radius:100px;box-shadow:0 0 0 1px #cf2615;color:white;position:absolute;top:11px;left:10px;padding:0 6px;font-size:12px;font-weight:400;line-height:18px}#sk-container #sk-notification-badge{position:absolute;top:7px;right:36px;display:none}#sk-container.sk-appear #sk-notification-badge{display:block}#sk-container #sk-settings-header{z-index:1;height:28px;box-size:border-box;line-height:28px;padding:6px 18px;position:relative;background-color:white;cursor:pointer;border-radius:8px 8px 0 0;font-size:16px;font-weight:300}#sk-container #sk-settings-header .fa{line-height:28px;color:#808080;font-size:15px}#sk-container #sk-settings-header .sk-close-handle,#sk-container #sk-settings-header .sk-show-handle{position:absolute;top:6px;right:10px}#sk-container #sk-settings-header .sk-back-handle{display:inline-block;margin-right:8px}#sk-container #sk-settings-header .sk-close-handle .fa{font-size:17px}#sk-container .sk-notifications{position:absolute;z-index:1;overflow:hidden;width:100%;border-top:1px solid rgba(0,0,0,0.1);background-color:white;box-shadow:0 1px 3px rgba(0,0,0,0.1)}#sk-container .sk-notifications p{margin:18px}#sk-container .sk-notifications p a{color:#00aeff}#sk-container .sk-notifications p .sk-notification-close{font-size:20px;font-weight:600;position:absolute;top:0;right:10px;right:0;display:none;width:22px;height:32px;padding-left:10px;text-decoration:none;color:#808080}#sk-container .sk-notifications:hover .sk-notification-close{display:block}@media (max-width:768px){#sk-container [data-region-main]{height:calc(100% - 45px - 28px - 2*6px)}}#sk-container [data-region-main] #sk-conversation{padding:18px 18px 0 13px;height:calc(317px);overflow-y:scroll;overflow-x:hidden}@media (max-width:768px){#sk-container [data-region-main] #sk-conversation{height:calc(100%  - 18px)}}#sk-container [data-region-main] #sk-conversation:not(*:root){margin-right:3px}#sk-container [data-region-main] #sk-conversation .sk-intro{color:#b0b0b0;font-size:12px;line-height:1.3}#sk-container [data-region-main] #sk-conversation .sk-row{clear:both}#sk-container [data-region-main] #sk-conversation .sk-row .sk-msg-wrapper{max-width:100%;position:relative}#sk-container [data-region-main] #sk-conversation .sk-row .sk-msg-wrapper .sk-msg{box-shadow:0 1px 2px rgba(0,0,0,0.22);font-size:14px;line-height:20px;padding:8px 12px;position:relative;border-radius:4px;word-break:break-word;word-wrap:break-word;-webkit-hyphens:auto;-moz-hyphens:auto;-ms-hyphens:auto;-o-hyphens:auto;hyphens:auto}#sk-container [data-region-main] #sk-conversation .sk-row .sk-msg-wrapper .sk-msg:after{bottom:11px;border:solid transparent;content:\" \";height:0;width:0;position:absolute;pointer-events:none;border-color:rgba(0,174,255,0);border-left-color:#00aeff;border-width:6px;margin-top:-6px}#sk-container [data-region-main] #sk-conversation .sk-row .sk-msg-wrapper .sk-msg .has-actions{margin-bottom:5px;display:inline-block}#sk-container [data-region-main] #sk-conversation .sk-row .sk-msg-wrapper .sk-msg a.link{text-decoration:underline}#sk-container [data-region-main] #sk-conversation .sk-row .sk-msg-wrapper .sk-from{position:absolute;white-space:nowrap;top:-20px;font-size:12px;color:#797979;font-weight:500}#sk-container [data-region-main] #sk-conversation .sk-row .sk-msg-wrapper .sk-action{margin-bottom:5px}#sk-container [data-region-main] #sk-conversation .sk-row .sk-msg-wrapper .sk-action .btn{white-space:inherit}#sk-container [data-region-main] #sk-conversation .sk-row .sk-msg-wrapper .sk-action:last-child{margin-bottom:0}#sk-container [data-region-main] #sk-conversation .sk-row .sk-msg-wrapper .sk-action a.btn{display:block}#sk-container [data-region-main] #sk-conversation .sk-row.sk-left-row{padding-top:30px}#sk-container [data-region-main] #sk-conversation .sk-row.sk-left-row .sk-msg-wrapper{display:inline-block;max-width:200px}#sk-container [data-region-main] #sk-conversation .sk-row.sk-left-row .sk-msg-wrapper .sk-msg{background-color:white;color:#333}#sk-container [data-region-main] #sk-conversation .sk-row.sk-left-row .sk-msg-wrapper .sk-msg:after{right:100%;border-color:rgba(236,236,236,0);border-right-color:white}#sk-container [data-region-main] #sk-conversation .sk-row.sk-left-row .sk-msg-wrapper .sk-msg a.link,#sk-container [data-region-main] #sk-conversation .sk-row.sk-left-row .sk-msg-wrapper .sk-msg a.link:visited{color:#00aeff}#sk-container [data-region-main] #sk-conversation .sk-row.sk-left-row .sk-msg-avatar{width:35px;border-radius:50%;margin-right:10px;margin-bottom:-14px;display:inline-block}#sk-container [data-region-main] #sk-conversation .sk-row.sk-right-row{padding-top:10px}#sk-container [data-region-main] #sk-conversation .sk-row.sk-right-row .sk-msg{background-color:#00aeff;float:right;color:white;max-width:204px}#sk-container [data-region-main] #sk-conversation .sk-row.sk-right-row .sk-msg:after{left:100%;border-color:rgba(0,174,255,0);border-left-color:#00aeff}#sk-container [data-region-main] #sk-conversation .sk-row.sk-right-row .sk-msg a.link,#sk-container [data-region-main] #sk-conversation .sk-row.sk-right-row .sk-msg a.link:visited{color:white}#sk-container [data-region-main] #sk-conversation .sk-row:last-child{padding-bottom:10px}#sk-container [data-region-main] #sk-conversation .sk-clear{clear:both}#sk-container [data-region-main] #sk-conversation::-webkit-scrollbar-track{border-radius:10px;box-shadow:inset 0 -6px 0 0 rgba(240,240,240,0.97),inset 0 6px 0 0 rgba(240,240,240,0.97);background-color:rgba(230,230,230,0.97)}#sk-container [data-region-main] #sk-conversation::-webkit-scrollbar{width:8px;background-color:rgba(240,240,240,0.97)}#sk-container [data-region-main] #sk-conversation::-webkit-scrollbar-thumb{border-radius:10px;box-shadow:inset 0 -6px 0 0 rgba(240,240,240,0.97),inset 0 6px 0 0 rgba(240,240,240,0.97);background-color:rgba(210,210,210,0.97)}#sk-container [data-region-main] #sk-conversation .sk-logo{padding-top:10px;margin-bottom:10px;margin-left:calc(50% - 100px)}#sk-container [data-region-main] #sk-conversation .sk-logo a{font-size:12px;color:#bbb;text-decoration:none}#sk-container [data-region-main] #sk-conversation .sk-logo .sk-image,#sk-container [data-region-main] #sk-conversation .sk-logo .sk-image-retina{position:relative;left:2px;top:3px}@media (-o-min-device-pixel-ratio:5/4),(-webkit-min-device-pixel-ratio:1.25),(min-resolution:120dpi){#sk-container [data-region-main] #sk-conversation .sk-logo .sk-image,#sk-container [data-region-main] #sk-conversation .sk-logo .sk-image-retina{display:none}}#sk-container [data-region-main] #sk-conversation .sk-logo .sk-image-retina{width:83px;display:none}@media (-o-min-device-pixel-ratio:5/4),(-webkit-min-device-pixel-ratio:1.25),(min-resolution:120dpi){#sk-container [data-region-main] #sk-conversation .sk-logo .sk-image-retina{display:inherit}}#sk-container [data-region-main] #sk-conversation .sk-logo.anchor-bottom{position:absolute;left:0;bottom:45px}#sk-container #sk-footer{position:relative;width:100%;height:45px;bottom:0;left:0;border:none;box-shadow:0 -1px 3px rgba(0,0,0,0.1);background-color:white;z-index:1}#sk-container #sk-footer .message-input{width:75%;margin:5px 9px}#sk-container #sk-footer .send{margin-top:1px;right:0;color:#b2b2b2;font-weight:600;position:absolute;height:40px;line-height:42px;text-decoration:none;padding:0 10px}#sk-container #sk-footer .send:hover{color:#00aeff}#sk-container #sk-settings{box-sizing:border-box;border-top:1px solid rgba(0,0,0,0.1);position:absolute;height:100%;z-index:2;background-color:white;overflow:hidden;opacity:0;font-size:13px}#sk-container #sk-settings .settings-wrapper{width:330px;padding:20px;box-sizing:border-box}@media (max-width:768px){#sk-container #sk-settings .settings-wrapper{width:100%}}#sk-container #sk-settings .settings-wrapper .input-group{position:relative}#sk-container #sk-settings .settings-wrapper .input-group i.before-icon{color:#bdbdbd;position:absolute;top:16px;left:11px}#sk-container #sk-settings .settings-wrapper .input-group .email-input{box-sizing:border-box;padding:0 9px 0 30px;width:100%}#sk-container #sk-settings .settings-wrapper .input-group .form-message{padding:6px 12px;font-size:13px;line-height:1.42857143;border-radius:4px;vertical-align:middle}#sk-container #sk-settings .settings-wrapper .input-group .form-message i.success{color:#5cb85c}";
                b.styleSheet ? b.styleSheet.cssText = c : b.appendChild(document.createTextNode(c)), a.appendChild(b)
            }()
        }, {}],
        72: [function(require, module, exports) {
            require("underscore");
            module.exports = function(obj) {
                var __p = "";
                Array.prototype.join;
                with(obj || {}) __p += '<div id="sk-wrapper"><div data-region-header class="sk-noselect"></div><div data-region-notifications class="sk-notifications"></div><div data-region-settings></div><div data-region-main></div><div data-region-footer></div></div>';
                return __p
            }
        }, {
            underscore: 35
        }],
        73: [function(require, module, exports) {
            require("underscore");
            module.exports = function(obj) {
                var __t, __p = "";
                Array.prototype.join;
                with(obj || {}) __p += '<form data-ui-form><input placeholder="' + (null == (__t = inputPlaceholder) ? "" : __t) + '" class="input message-input" data-ui-input><a href="#" class="send" data-ui-send>' + (null == (__t = sendButtonText) ? "" : __t) + "</a></form>";
                return __p
            }
        }, {
            underscore: 35
        }],
        74: [function(require, module, exports) {
            require("underscore");
            module.exports = function(obj) {
                var __t, __p = "";
                Array.prototype.join;
                with(obj || {}) __p += '<div class="sk-intro">' + (null == (__t = introText) ? "" : __t) + '</div><div data-ui-messages></div><div class="sk-logo"><a href="https://supportkit.io/?utm_source=widget" target="_blank">In-App Messaging by <img class="sk-image" src="https://cdn.supportkit.io/images/logo_webwidget.png" alt="SupportKit"> <img class="sk-image-retina" src="https://cdn.supportkit.io/images/logo_webwidget_2x.png" alt="SupportKit"></a></div>';
                return __p
            }
        }, {
            underscore: 35
        }],
        75: [function(require, module, exports) {
            require("underscore");
            module.exports = function(obj) {
                var __t, __p = "";
                Array.prototype.join;
                with(obj || {}) __p += "" + (null == (__t = settingsNotificationText) ? "" : __t) + ' <a href="#" data-ui-close class="sk-notification-close">&times;</a>';
                return __p
            }
        }, {
            underscore: 35
        }],
        76: [function(require, module, exports) {
            require("underscore");
            module.exports = function(obj) {
                var __t, __p = "";
                Array.prototype.join;
                with(obj || {}) __p += "" + (null == (__t = headerText) ? "" : __t) + '<div id="sk-badge" data-ui-badge></div>', emailCaptureEnabled && (__p += '<div id="sk-notification-badge" data-ui-notification-badge><i class="fa fa-gear"></i></div>'), __p += '<div class="sk-show-handle sk-appear-hidden hidden-sm"><i class="fa fa-arrow-up"></i></div><div class="sk-close-handle sk-close-hidden"><i class="fa fa-times"></i></div>';
                return __p
            }
        }, {
            underscore: 35
        }],
        77: [function(require, module, exports) {
            var _ = require("underscore");
            module.exports = function(obj) {
                var __t, __p = "";
                Array.prototype.join;
                with(obj || {}) __p += '<img data-ui-avatar class="sk-msg-avatar"><div class="sk-msg-wrapper"><div data-ui-name class="sk-from"></div><div class="sk-msg"><span data-ui-message></span>', _(actions).each(function(a) {
                    __p += '<div class="sk-action"><a class="btn btn-sk-primary" href="' + (null == (__t = a.uri) ? "" : __t) + '" target="_blank">' + (null == (__t = a.text) ? "" : __t) + "</a></div>"
                }), __p += '</div></div><div class="sk-clear"></div>';
                return __p
            }
        }, {
            underscore: 35
        }],
        78: [function(require, module, exports) {
            require("underscore");
            module.exports = function(obj) {
                var __t, __p = "";
                Array.prototype.join;
                with(obj || {}) __p += '<div class="settings-wrapper"><p>', __p += readOnlyEmail ? "" + (null == (__t = settingsReadOnlyText) ? "" : __t) : "" + (null == (__t = settingsText) ? "" : __t), __p += '</p><form data-ui-form><div class="input-group"><i class="fa fa-envelope-o before-icon"></i> <input type="text" placeholder="' + (null == (__t = settingsInputPlaceholder) ? "" : __t) + '" class="input email-input" data-ui-email></div>', readOnlyEmail || (__p += '<div class="input-group"><button type="button" class="btn btn-sk-primary" data-ui-save>' + (null == (__t = settingsSaveButtonText) ? "" : __t) + '</button> <span class="form-message" data-ui-form-message></span></div>'), __p += "</form></div>";
                return __p
            }
        }, {
            underscore: 35
        }],
        79: [function(require, module, exports) {
            require("underscore");
            module.exports = function(obj) {
                var __t, __p = "";
                Array.prototype.join;
                with(obj || {}) __p += '<div class="sk-back-handle"><i class="fa fa-arrow-left"></i></div>' + (null == (__t = settingsHeaderText) ? "" : __t) + '<div class="sk-close-handle" data-ui-close><i class="fa fa-times"></i></div>';
                return __p
            }
        }, {
            underscore: 35
        }]
    }, {}, [51])(51)
});
