/* eslint-disable */
/* prettier-ignore */
/*pako 1.0.10 nodeca/pako */
!function(t) {
    if ("object" == typeof exports && "undefined" != typeof module)
        module.exports = t();
    else if ("function" == typeof define && define.amd)
        define([], t);
    else {
        ("undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this).pako = t()
    }
}(function() {
    return function i(s, h, l) {
        function o(e, t) {
            if (!h[e]) {
                if (!s[e]) {
                    var a = "function" == typeof require && require;
                    if (!t && a)
                        return a(e, !0);
                    if (_)
                        return _(e, !0);
                    var n = new Error("Cannot find module '" + e + "'");
                    throw n.code = "MODULE_NOT_FOUND",
                    n
                }
                var r = h[e] = {
                    exports: {}
                };
                s[e][0].call(r.exports, function(t) {
                    return o(s[e][1][t] || t)
                }, r, r.exports, i, s, h, l)
            }
            return h[e].exports
        }
        for (var _ = "function" == typeof require && require, t = 0; t < l.length; t++)
            o(l[t]);
        return o
    }({
        1: [function(t, e, a) {
            "use strict";
            var n = "undefined" != typeof Uint8Array && "undefined" != typeof Uint16Array && "undefined" != typeof Int32Array;
            a.assign = function(t) {
                for (var e, a, n = Array.prototype.slice.call(arguments, 1); n.length; ) {
                    var r = n.shift();
                    if (r) {
                        if ("object" != typeof r)
                            throw new TypeError(r + "must be non-object");
                        for (var i in r)
                            e = r,
                            a = i,
                            Object.prototype.hasOwnProperty.call(e, a) && (t[i] = r[i])
                    }
                }
                return t
            }
            ,
            a.shrinkBuf = function(t, e) {
                return t.length === e ? t : t.subarray ? t.subarray(0, e) : (t.length = e,
                t)
            }
            ;
            var r = {
                arraySet: function(t, e, a, n, r) {
                    if (e.subarray && t.subarray)
                        t.set(e.subarray(a, a + n), r);
                    else
                        for (var i = 0; i < n; i++)
                            t[r + i] = e[a + i]
                },
                flattenChunks: function(t) {
                    var e, a, n, r, i, s;
                    for (e = n = 0,
                    a = t.length; e < a; e++)
                        n += t[e].length;
                    for (s = new Uint8Array(n),
                    e = r = 0,
                    a = t.length; e < a; e++)
                        i = t[e],
                        s.set(i, r),
                        r += i.length;
                    return s
                }
            }
              , i = {
                arraySet: function(t, e, a, n, r) {
                    for (var i = 0; i < n; i++)
                        t[r + i] = e[a + i]
                },
                flattenChunks: function(t) {
                    return [].concat.apply([], t)
                }
            };
            a.setTyped = function(t) {
                t ? (a.Buf8 = Uint8Array,
                a.Buf16 = Uint16Array,
                a.Buf32 = Int32Array,
                a.assign(a, r)) : (a.Buf8 = Array,
                a.Buf16 = Array,
                a.Buf32 = Array,
                a.assign(a, i))
            }
            ,
            a.setTyped(n)
        }
        , {}],
        2: [function(t, e, a) {
            "use strict";
            var l = t("./common")
              , r = !0
              , i = !0;
            try {
                String.fromCharCode.apply(null, [0])
            } catch (t) {
                r = !1
            }
            try {
                String.fromCharCode.apply(null, new Uint8Array(1))
            } catch (t) {
                i = !1
            }
            for (var o = new l.Buf8(256), n = 0; n < 256; n++)
                o[n] = 252 <= n ? 6 : 248 <= n ? 5 : 240 <= n ? 4 : 224 <= n ? 3 : 192 <= n ? 2 : 1;
            function _(t, e) {
                if (e < 65534 && (t.subarray && i || !t.subarray && r))
                    return String.fromCharCode.apply(null, l.shrinkBuf(t, e));
                for (var a = "", n = 0; n < e; n++)
                    a += String.fromCharCode(t[n]);
                return a
            }
            o[254] = o[254] = 1,
            a.string2buf = function(t) {
                var e, a, n, r, i, s = t.length, h = 0;
                for (r = 0; r < s; r++)
                    55296 == (64512 & (a = t.charCodeAt(r))) && r + 1 < s && 56320 == (64512 & (n = t.charCodeAt(r + 1))) && (a = 65536 + (a - 55296 << 10) + (n - 56320),
                    r++),
                    h += a < 128 ? 1 : a < 2048 ? 2 : a < 65536 ? 3 : 4;
                for (e = new l.Buf8(h),
                r = i = 0; i < h; r++)
                    55296 == (64512 & (a = t.charCodeAt(r))) && r + 1 < s && 56320 == (64512 & (n = t.charCodeAt(r + 1))) && (a = 65536 + (a - 55296 << 10) + (n - 56320),
                    r++),
                    a < 128 ? e[i++] = a : (a < 2048 ? e[i++] = 192 | a >>> 6 : (a < 65536 ? e[i++] = 224 | a >>> 12 : (e[i++] = 240 | a >>> 18,
                    e[i++] = 128 | a >>> 12 & 63),
                    e[i++] = 128 | a >>> 6 & 63),
                    e[i++] = 128 | 63 & a);
                return e
            }
            ,
            a.buf2binstring = function(t) {
                return _(t, t.length)
            }
            ,
            a.binstring2buf = function(t) {
                for (var e = new l.Buf8(t.length), a = 0, n = e.length; a < n; a++)
                    e[a] = t.charCodeAt(a);
                return e
            }
            ,
            a.buf2string = function(t, e) {
                var a, n, r, i, s = e || t.length, h = new Array(2 * s);
                for (a = n = 0; a < s; )
                    if ((r = t[a++]) < 128)
                        h[n++] = r;
                    else if (4 < (i = o[r]))
                        h[n++] = 65533,
                        a += i - 1;
                    else {
                        for (r &= 2 === i ? 31 : 3 === i ? 15 : 7; 1 < i && a < s; )
                            r = r << 6 | 63 & t[a++],
                            i--;
                        1 < i ? h[n++] = 65533 : r < 65536 ? h[n++] = r : (r -= 65536,
                        h[n++] = 55296 | r >> 10 & 1023,
                        h[n++] = 56320 | 1023 & r)
                    }
                return _(h, n)
            }
            ,
            a.utf8border = function(t, e) {
                var a;
                for ((e = e || t.length) > t.length && (e = t.length),
                a = e - 1; 0 <= a && 128 == (192 & t[a]); )
                    a--;
                return a < 0 ? e : 0 === a ? e : a + o[t[a]] > e ? a : e
            }
        }
        , {
            "./common": 1
        }],
        3: [function(t, e, a) {
            "use strict";
            e.exports = function(t, e, a, n) {
                for (var r = 65535 & t | 0, i = t >>> 16 & 65535 | 0, s = 0; 0 !== a; ) {
                    for (a -= s = 2e3 < a ? 2e3 : a; i = i + (r = r + e[n++] | 0) | 0,
                    --s; )
                        ;
                    r %= 65521,
                    i %= 65521
                }
                return r | i << 16 | 0
            }
        }
        , {}],
        4: [function(t, e, a) {
            "use strict";
            var h = function() {
                for (var t, e = [], a = 0; a < 256; a++) {
                    t = a;
                    for (var n = 0; n < 8; n++)
                        t = 1 & t ? 3988292384 ^ t >>> 1 : t >>> 1;
                    e[a] = t
                }
                return e
            }();
            e.exports = function(t, e, a, n) {
                var r = h
                  , i = n + a;
                t ^= -1;
                for (var s = n; s < i; s++)
                    t = t >>> 8 ^ r[255 & (t ^ e[s])];
                return -1 ^ t
            }
        }
        , {}],
        5: [function(t, e, a) {
            "use strict";
            var l, u = t("../utils/common"), o = t("./trees"), f = t("./adler32"), c = t("./crc32"), n = t("./messages"), _ = 0, d = 4, p = 0, g = -2, m = -1, b = 4, r = 2, v = 8, w = 9, i = 286, s = 30, h = 19, y = 2 * i + 1, k = 15, z = 3, x = 258, B = x + z + 1, A = 42, C = 113, S = 1, j = 2, E = 3, U = 4;
            function D(t, e) {
                return t.msg = n[e],
                e
            }
            function I(t) {
                return (t << 1) - (4 < t ? 9 : 0)
            }
            function O(t) {
                for (var e = t.length; 0 <= --e; )
                    t[e] = 0
            }
            function q(t) {
                var e = t.state
                  , a = e.pending;
                a > t.avail_out && (a = t.avail_out),
                0 !== a && (u.arraySet(t.output, e.pending_buf, e.pending_out, a, t.next_out),
                t.next_out += a,
                e.pending_out += a,
                t.total_out += a,
                t.avail_out -= a,
                e.pending -= a,
                0 === e.pending && (e.pending_out = 0))
            }
            function T(t, e) {
                o._tr_flush_block(t, 0 <= t.block_start ? t.block_start : -1, t.strstart - t.block_start, e),
                t.block_start = t.strstart,
                q(t.strm)
            }
            function L(t, e) {
                t.pending_buf[t.pending++] = e
            }
            function N(t, e) {
                t.pending_buf[t.pending++] = e >>> 8 & 255,
                t.pending_buf[t.pending++] = 255 & e
            }
            function R(t, e) {
                var a, n, r = t.max_chain_length, i = t.strstart, s = t.prev_length, h = t.nice_match, l = t.strstart > t.w_size - B ? t.strstart - (t.w_size - B) : 0, o = t.window, _ = t.w_mask, d = t.prev, u = t.strstart + x, f = o[i + s - 1], c = o[i + s];
                t.prev_length >= t.good_match && (r >>= 2),
                h > t.lookahead && (h = t.lookahead);
                do {
                    if (o[(a = e) + s] === c && o[a + s - 1] === f && o[a] === o[i] && o[++a] === o[i + 1]) {
                        i += 2,
                        a++;
                        do {} while (o[++i] === o[++a] && o[++i] === o[++a] && o[++i] === o[++a] && o[++i] === o[++a] && o[++i] === o[++a] && o[++i] === o[++a] && o[++i] === o[++a] && o[++i] === o[++a] && i < u);
                        if (n = x - (u - i),
                        i = u - x,
                        s < n) {
                            if (t.match_start = e,
                            h <= (s = n))
                                break;
                            f = o[i + s - 1],
                            c = o[i + s]
                        }
                    }
                } while ((e = d[e & _]) > l && 0 != --r);
                return s <= t.lookahead ? s : t.lookahead
            }
            function H(t) {
                var e, a, n, r, i, s, h, l, o, _, d = t.w_size;
                do {
                    if (r = t.window_size - t.lookahead - t.strstart,
                    t.strstart >= d + (d - B)) {
                        for (u.arraySet(t.window, t.window, d, d, 0),
                        t.match_start -= d,
                        t.strstart -= d,
                        t.block_start -= d,
                        e = a = t.hash_size; n = t.head[--e],
                        t.head[e] = d <= n ? n - d : 0,
                        --a; )
                            ;
                        for (e = a = d; n = t.prev[--e],
                        t.prev[e] = d <= n ? n - d : 0,
                        --a; )
                            ;
                        r += d
                    }
                    if (0 === t.strm.avail_in)
                        break;
                    if (s = t.strm,
                    h = t.window,
                    l = t.strstart + t.lookahead,
                    o = r,
                    _ = void 0,
                    _ = s.avail_in,
                    o < _ && (_ = o),
                    a = 0 === _ ? 0 : (s.avail_in -= _,
                    u.arraySet(h, s.input, s.next_in, _, l),
                    1 === s.state.wrap ? s.adler = f(s.adler, h, _, l) : 2 === s.state.wrap && (s.adler = c(s.adler, h, _, l)),
                    s.next_in += _,
                    s.total_in += _,
                    _),
                    t.lookahead += a,
                    t.lookahead + t.insert >= z)
                        for (i = t.strstart - t.insert,
                        t.ins_h = t.window[i],
                        t.ins_h = (t.ins_h << t.hash_shift ^ t.window[i + 1]) & t.hash_mask; t.insert && (t.ins_h = (t.ins_h << t.hash_shift ^ t.window[i + z - 1]) & t.hash_mask,
                        t.prev[i & t.w_mask] = t.head[t.ins_h],
                        t.head[t.ins_h] = i,
                        i++,
                        t.insert--,
                        !(t.lookahead + t.insert < z)); )
                            ;
                } while (t.lookahead < B && 0 !== t.strm.avail_in)
            }
            function F(t, e) {
                for (var a, n; ; ) {
                    if (t.lookahead < B) {
                        if (H(t),
                        t.lookahead < B && e === _)
                            return S;
                        if (0 === t.lookahead)
                            break
                    }
                    if (a = 0,
                    t.lookahead >= z && (t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + z - 1]) & t.hash_mask,
                    a = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h],
                    t.head[t.ins_h] = t.strstart),
                    0 !== a && t.strstart - a <= t.w_size - B && (t.match_length = R(t, a)),
                    t.match_length >= z)
                        if (n = o._tr_tally(t, t.strstart - t.match_start, t.match_length - z),
                        t.lookahead -= t.match_length,
                        t.match_length <= t.max_lazy_match && t.lookahead >= z) {
                            for (t.match_length--; t.strstart++,
                            t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + z - 1]) & t.hash_mask,
                            a = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h],
                            t.head[t.ins_h] = t.strstart,
                            0 != --t.match_length; )
                                ;
                            t.strstart++
                        } else
                            t.strstart += t.match_length,
                            t.match_length = 0,
                            t.ins_h = t.window[t.strstart],
                            t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + 1]) & t.hash_mask;
                    else
                        n = o._tr_tally(t, 0, t.window[t.strstart]),
                        t.lookahead--,
                        t.strstart++;
                    if (n && (T(t, !1),
                    0 === t.strm.avail_out))
                        return S
                }
                return t.insert = t.strstart < z - 1 ? t.strstart : z - 1,
                e === d ? (T(t, !0),
                0 === t.strm.avail_out ? E : U) : t.last_lit && (T(t, !1),
                0 === t.strm.avail_out) ? S : j
            }
            function K(t, e) {
                for (var a, n, r; ; ) {
                    if (t.lookahead < B) {
                        if (H(t),
                        t.lookahead < B && e === _)
                            return S;
                        if (0 === t.lookahead)
                            break
                    }
                    if (a = 0,
                    t.lookahead >= z && (t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + z - 1]) & t.hash_mask,
                    a = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h],
                    t.head[t.ins_h] = t.strstart),
                    t.prev_length = t.match_length,
                    t.prev_match = t.match_start,
                    t.match_length = z - 1,
                    0 !== a && t.prev_length < t.max_lazy_match && t.strstart - a <= t.w_size - B && (t.match_length = R(t, a),
                    t.match_length <= 5 && (1 === t.strategy || t.match_length === z && 4096 < t.strstart - t.match_start) && (t.match_length = z - 1)),
                    t.prev_length >= z && t.match_length <= t.prev_length) {
                        for (r = t.strstart + t.lookahead - z,
                        n = o._tr_tally(t, t.strstart - 1 - t.prev_match, t.prev_length - z),
                        t.lookahead -= t.prev_length - 1,
                        t.prev_length -= 2; ++t.strstart <= r && (t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + z - 1]) & t.hash_mask,
                        a = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h],
                        t.head[t.ins_h] = t.strstart),
                        0 != --t.prev_length; )
                            ;
                        if (t.match_available = 0,
                        t.match_length = z - 1,
                        t.strstart++,
                        n && (T(t, !1),
                        0 === t.strm.avail_out))
                            return S
                    } else if (t.match_available) {
                        if ((n = o._tr_tally(t, 0, t.window[t.strstart - 1])) && T(t, !1),
                        t.strstart++,
                        t.lookahead--,
                        0 === t.strm.avail_out)
                            return S
                    } else
                        t.match_available = 1,
                        t.strstart++,
                        t.lookahead--
                }
                return t.match_available && (n = o._tr_tally(t, 0, t.window[t.strstart - 1]),
                t.match_available = 0),
                t.insert = t.strstart < z - 1 ? t.strstart : z - 1,
                e === d ? (T(t, !0),
                0 === t.strm.avail_out ? E : U) : t.last_lit && (T(t, !1),
                0 === t.strm.avail_out) ? S : j
            }
            function M(t, e, a, n, r) {
                this.good_length = t,
                this.max_lazy = e,
                this.nice_length = a,
                this.max_chain = n,
                this.func = r
            }
            function P() {
                this.strm = null,
                this.status = 0,
                this.pending_buf = null,
                this.pending_buf_size = 0,
                this.pending_out = 0,
                this.pending = 0,
                this.wrap = 0,
                this.gzhead = null,
                this.gzindex = 0,
                this.method = v,
                this.last_flush = -1,
                this.w_size = 0,
                this.w_bits = 0,
                this.w_mask = 0,
                this.window = null,
                this.window_size = 0,
                this.prev = null,
                this.head = null,
                this.ins_h = 0,
                this.hash_size = 0,
                this.hash_bits = 0,
                this.hash_mask = 0,
                this.hash_shift = 0,
                this.block_start = 0,
                this.match_length = 0,
                this.prev_match = 0,
                this.match_available = 0,
                this.strstart = 0,
                this.match_start = 0,
                this.lookahead = 0,
                this.prev_length = 0,
                this.max_chain_length = 0,
                this.max_lazy_match = 0,
                this.level = 0,
                this.strategy = 0,
                this.good_match = 0,
                this.nice_match = 0,
                this.dyn_ltree = new u.Buf16(2 * y),
                this.dyn_dtree = new u.Buf16(2 * (2 * s + 1)),
                this.bl_tree = new u.Buf16(2 * (2 * h + 1)),
                O(this.dyn_ltree),
                O(this.dyn_dtree),
                O(this.bl_tree),
                this.l_desc = null,
                this.d_desc = null,
                this.bl_desc = null,
                this.bl_count = new u.Buf16(k + 1),
                this.heap = new u.Buf16(2 * i + 1),
                O(this.heap),
                this.heap_len = 0,
                this.heap_max = 0,
                this.depth = new u.Buf16(2 * i + 1),
                O(this.depth),
                this.l_buf = 0,
                this.lit_bufsize = 0,
                this.last_lit = 0,
                this.d_buf = 0,
                this.opt_len = 0,
                this.static_len = 0,
                this.matches = 0,
                this.insert = 0,
                this.bi_buf = 0,
                this.bi_valid = 0
            }
            function G(t) {
                var e;
                return t && t.state ? (t.total_in = t.total_out = 0,
                t.data_type = r,
                (e = t.state).pending = 0,
                e.pending_out = 0,
                e.wrap < 0 && (e.wrap = -e.wrap),
                e.status = e.wrap ? A : C,
                t.adler = 2 === e.wrap ? 0 : 1,
                e.last_flush = _,
                o._tr_init(e),
                p) : D(t, g)
            }
            function J(t) {
                var e, a = G(t);
                return a === p && ((e = t.state).window_size = 2 * e.w_size,
                O(e.head),
                e.max_lazy_match = l[e.level].max_lazy,
                e.good_match = l[e.level].good_length,
                e.nice_match = l[e.level].nice_length,
                e.max_chain_length = l[e.level].max_chain,
                e.strstart = 0,
                e.block_start = 0,
                e.lookahead = 0,
                e.insert = 0,
                e.match_length = e.prev_length = z - 1,
                e.match_available = 0,
                e.ins_h = 0),
                a
            }
            function Q(t, e, a, n, r, i) {
                if (!t)
                    return g;
                var s = 1;
                if (e === m && (e = 6),
                n < 0 ? (s = 0,
                n = -n) : 15 < n && (s = 2,
                n -= 16),
                r < 1 || w < r || a !== v || n < 8 || 15 < n || e < 0 || 9 < e || i < 0 || b < i)
                    return D(t, g);
                8 === n && (n = 9);
                var h = new P;
                return (t.state = h).strm = t,
                h.wrap = s,
                h.gzhead = null,
                h.w_bits = n,
                h.w_size = 1 << h.w_bits,
                h.w_mask = h.w_size - 1,
                h.hash_bits = r + 7,
                h.hash_size = 1 << h.hash_bits,
                h.hash_mask = h.hash_size - 1,
                h.hash_shift = ~~((h.hash_bits + z - 1) / z),
                h.window = new u.Buf8(2 * h.w_size),
                h.head = new u.Buf16(h.hash_size),
                h.prev = new u.Buf16(h.w_size),
                h.lit_bufsize = 1 << r + 6,
                h.pending_buf_size = 4 * h.lit_bufsize,
                h.pending_buf = new u.Buf8(h.pending_buf_size),
                h.d_buf = 1 * h.lit_bufsize,
                h.l_buf = 3 * h.lit_bufsize,
                h.level = e,
                h.strategy = i,
                h.method = a,
                J(t)
            }
            l = [new M(0,0,0,0,function(t, e) {
                var a = 65535;
                for (a > t.pending_buf_size - 5 && (a = t.pending_buf_size - 5); ; ) {
                    if (t.lookahead <= 1) {
                        if (H(t),
                        0 === t.lookahead && e === _)
                            return S;
                        if (0 === t.lookahead)
                            break
                    }
                    t.strstart += t.lookahead,
                    t.lookahead = 0;
                    var n = t.block_start + a;
                    if ((0 === t.strstart || t.strstart >= n) && (t.lookahead = t.strstart - n,
                    t.strstart = n,
                    T(t, !1),
                    0 === t.strm.avail_out))
                        return S;
                    if (t.strstart - t.block_start >= t.w_size - B && (T(t, !1),
                    0 === t.strm.avail_out))
                        return S
                }
                return t.insert = 0,
                e === d ? (T(t, !0),
                0 === t.strm.avail_out ? E : U) : (t.strstart > t.block_start && (T(t, !1),
                t.strm.avail_out),
                S)
            }
            ), new M(4,4,8,4,F), new M(4,5,16,8,F), new M(4,6,32,32,F), new M(4,4,16,16,K), new M(8,16,32,32,K), new M(8,16,128,128,K), new M(8,32,128,256,K), new M(32,128,258,1024,K), new M(32,258,258,4096,K)],
            a.deflateInit = function(t, e) {
                return Q(t, e, v, 15, 8, 0)
            }
            ,
            a.deflateInit2 = Q,
            a.deflateReset = J,
            a.deflateResetKeep = G,
            a.deflateSetHeader = function(t, e) {
                return t && t.state ? 2 !== t.state.wrap ? g : (t.state.gzhead = e,
                p) : g
            }
            ,
            a.deflate = function(t, e) {
                var a, n, r, i;
                if (!t || !t.state || 5 < e || e < 0)
                    return t ? D(t, g) : g;
                if (n = t.state,
                !t.output || !t.input && 0 !== t.avail_in || 666 === n.status && e !== d)
                    return D(t, 0 === t.avail_out ? -5 : g);
                if (n.strm = t,
                a = n.last_flush,
                n.last_flush = e,
                n.status === A)
                    if (2 === n.wrap)
                        t.adler = 0,
                        L(n, 31),
                        L(n, 139),
                        L(n, 8),
                        n.gzhead ? (L(n, (n.gzhead.text ? 1 : 0) + (n.gzhead.hcrc ? 2 : 0) + (n.gzhead.extra ? 4 : 0) + (n.gzhead.name ? 8 : 0) + (n.gzhead.comment ? 16 : 0)),
                        L(n, 255 & n.gzhead.time),
                        L(n, n.gzhead.time >> 8 & 255),
                        L(n, n.gzhead.time >> 16 & 255),
                        L(n, n.gzhead.time >> 24 & 255),
                        L(n, 9 === n.level ? 2 : 2 <= n.strategy || n.level < 2 ? 4 : 0),
                        L(n, 255 & n.gzhead.os),
                        n.gzhead.extra && n.gzhead.extra.length && (L(n, 255 & n.gzhead.extra.length),
                        L(n, n.gzhead.extra.length >> 8 & 255)),
                        n.gzhead.hcrc && (t.adler = c(t.adler, n.pending_buf, n.pending, 0)),
                        n.gzindex = 0,
                        n.status = 69) : (L(n, 0),
                        L(n, 0),
                        L(n, 0),
                        L(n, 0),
                        L(n, 0),
                        L(n, 9 === n.level ? 2 : 2 <= n.strategy || n.level < 2 ? 4 : 0),
                        L(n, 3),
                        n.status = C);
                    else {
                        var s = v + (n.w_bits - 8 << 4) << 8;
                        s |= (2 <= n.strategy || n.level < 2 ? 0 : n.level < 6 ? 1 : 6 === n.level ? 2 : 3) << 6,
                        0 !== n.strstart && (s |= 32),
                        s += 31 - s % 31,
                        n.status = C,
                        N(n, s),
                        0 !== n.strstart && (N(n, t.adler >>> 16),
                        N(n, 65535 & t.adler)),
                        t.adler = 1
                    }
                if (69 === n.status)
                    if (n.gzhead.extra) {
                        for (r = n.pending; n.gzindex < (65535 & n.gzhead.extra.length) && (n.pending !== n.pending_buf_size || (n.gzhead.hcrc && n.pending > r && (t.adler = c(t.adler, n.pending_buf, n.pending - r, r)),
                        q(t),
                        r = n.pending,
                        n.pending !== n.pending_buf_size)); )
                            L(n, 255 & n.gzhead.extra[n.gzindex]),
                            n.gzindex++;
                        n.gzhead.hcrc && n.pending > r && (t.adler = c(t.adler, n.pending_buf, n.pending - r, r)),
                        n.gzindex === n.gzhead.extra.length && (n.gzindex = 0,
                        n.status = 73)
                    } else
                        n.status = 73;
                if (73 === n.status)
                    if (n.gzhead.name) {
                        r = n.pending;
                        do {
                            if (n.pending === n.pending_buf_size && (n.gzhead.hcrc && n.pending > r && (t.adler = c(t.adler, n.pending_buf, n.pending - r, r)),
                            q(t),
                            r = n.pending,
                            n.pending === n.pending_buf_size)) {
                                i = 1;
                                break
                            }
                            L(n, i = n.gzindex < n.gzhead.name.length ? 255 & n.gzhead.name.charCodeAt(n.gzindex++) : 0)
                        } while (0 !== i);
                        n.gzhead.hcrc && n.pending > r && (t.adler = c(t.adler, n.pending_buf, n.pending - r, r)),
                        0 === i && (n.gzindex = 0,
                        n.status = 91)
                    } else
                        n.status = 91;
                if (91 === n.status)
                    if (n.gzhead.comment) {
                        r = n.pending;
                        do {
                            if (n.pending === n.pending_buf_size && (n.gzhead.hcrc && n.pending > r && (t.adler = c(t.adler, n.pending_buf, n.pending - r, r)),
                            q(t),
                            r = n.pending,
                            n.pending === n.pending_buf_size)) {
                                i = 1;
                                break
                            }
                            L(n, i = n.gzindex < n.gzhead.comment.length ? 255 & n.gzhead.comment.charCodeAt(n.gzindex++) : 0)
                        } while (0 !== i);
                        n.gzhead.hcrc && n.pending > r && (t.adler = c(t.adler, n.pending_buf, n.pending - r, r)),
                        0 === i && (n.status = 103)
                    } else
                        n.status = 103;
                if (103 === n.status && (n.gzhead.hcrc ? (n.pending + 2 > n.pending_buf_size && q(t),
                n.pending + 2 <= n.pending_buf_size && (L(n, 255 & t.adler),
                L(n, t.adler >> 8 & 255),
                t.adler = 0,
                n.status = C)) : n.status = C),
                0 !== n.pending) {
                    if (q(t),
                    0 === t.avail_out)
                        return n.last_flush = -1,
                        p
                } else if (0 === t.avail_in && I(e) <= I(a) && e !== d)
                    return D(t, -5);
                if (666 === n.status && 0 !== t.avail_in)
                    return D(t, -5);
                if (0 !== t.avail_in || 0 !== n.lookahead || e !== _ && 666 !== n.status) {
                    var h = 2 === n.strategy ? function(t, e) {
                        for (var a; ; ) {
                            if (0 === t.lookahead && (H(t),
                            0 === t.lookahead)) {
                                if (e === _)
                                    return S;
                                break
                            }
                            if (t.match_length = 0,
                            a = o._tr_tally(t, 0, t.window[t.strstart]),
                            t.lookahead--,
                            t.strstart++,
                            a && (T(t, !1),
                            0 === t.strm.avail_out))
                                return S
                        }
                        return t.insert = 0,
                        e === d ? (T(t, !0),
                        0 === t.strm.avail_out ? E : U) : t.last_lit && (T(t, !1),
                        0 === t.strm.avail_out) ? S : j
                    }(n, e) : 3 === n.strategy ? function(t, e) {
                        for (var a, n, r, i, s = t.window; ; ) {
                            if (t.lookahead <= x) {
                                if (H(t),
                                t.lookahead <= x && e === _)
                                    return S;
                                if (0 === t.lookahead)
                                    break
                            }
                            if (t.match_length = 0,
                            t.lookahead >= z && 0 < t.strstart && (n = s[r = t.strstart - 1]) === s[++r] && n === s[++r] && n === s[++r]) {
                                i = t.strstart + x;
                                do {} while (n === s[++r] && n === s[++r] && n === s[++r] && n === s[++r] && n === s[++r] && n === s[++r] && n === s[++r] && n === s[++r] && r < i);
                                t.match_length = x - (i - r),
                                t.match_length > t.lookahead && (t.match_length = t.lookahead)
                            }
                            if (t.match_length >= z ? (a = o._tr_tally(t, 1, t.match_length - z),
                            t.lookahead -= t.match_length,
                            t.strstart += t.match_length,
                            t.match_length = 0) : (a = o._tr_tally(t, 0, t.window[t.strstart]),
                            t.lookahead--,
                            t.strstart++),
                            a && (T(t, !1),
                            0 === t.strm.avail_out))
                                return S
                        }
                        return t.insert = 0,
                        e === d ? (T(t, !0),
                        0 === t.strm.avail_out ? E : U) : t.last_lit && (T(t, !1),
                        0 === t.strm.avail_out) ? S : j
                    }(n, e) : l[n.level].func(n, e);
                    if (h !== E && h !== U || (n.status = 666),
                    h === S || h === E)
                        return 0 === t.avail_out && (n.last_flush = -1),
                        p;
                    if (h === j && (1 === e ? o._tr_align(n) : 5 !== e && (o._tr_stored_block(n, 0, 0, !1),
                    3 === e && (O(n.head),
                    0 === n.lookahead && (n.strstart = 0,
                    n.block_start = 0,
                    n.insert = 0))),
                    q(t),
                    0 === t.avail_out))
                        return n.last_flush = -1,
                        p
                }
                return e !== d ? p : n.wrap <= 0 ? 1 : (2 === n.wrap ? (L(n, 255 & t.adler),
                L(n, t.adler >> 8 & 255),
                L(n, t.adler >> 16 & 255),
                L(n, t.adler >> 24 & 255),
                L(n, 255 & t.total_in),
                L(n, t.total_in >> 8 & 255),
                L(n, t.total_in >> 16 & 255),
                L(n, t.total_in >> 24 & 255)) : (N(n, t.adler >>> 16),
                N(n, 65535 & t.adler)),
                q(t),
                0 < n.wrap && (n.wrap = -n.wrap),
                0 !== n.pending ? p : 1)
            }
            ,
            a.deflateEnd = function(t) {
                var e;
                return t && t.state ? (e = t.state.status) !== A && 69 !== e && 73 !== e && 91 !== e && 103 !== e && e !== C && 666 !== e ? D(t, g) : (t.state = null,
                e === C ? D(t, -3) : p) : g
            }
            ,
            a.deflateSetDictionary = function(t, e) {
                var a, n, r, i, s, h, l, o, _ = e.length;
                if (!t || !t.state)
                    return g;
                if (2 === (i = (a = t.state).wrap) || 1 === i && a.status !== A || a.lookahead)
                    return g;
                for (1 === i && (t.adler = f(t.adler, e, _, 0)),
                a.wrap = 0,
                _ >= a.w_size && (0 === i && (O(a.head),
                a.strstart = 0,
                a.block_start = 0,
                a.insert = 0),
                o = new u.Buf8(a.w_size),
                u.arraySet(o, e, _ - a.w_size, a.w_size, 0),
                e = o,
                _ = a.w_size),
                s = t.avail_in,
                h = t.next_in,
                l = t.input,
                t.avail_in = _,
                t.next_in = 0,
                t.input = e,
                H(a); a.lookahead >= z; ) {
                    for (n = a.strstart,
                    r = a.lookahead - (z - 1); a.ins_h = (a.ins_h << a.hash_shift ^ a.window[n + z - 1]) & a.hash_mask,
                    a.prev[n & a.w_mask] = a.head[a.ins_h],
                    a.head[a.ins_h] = n,
                    n++,
                    --r; )
                        ;
                    a.strstart = n,
                    a.lookahead = z - 1,
                    H(a)
                }
                return a.strstart += a.lookahead,
                a.block_start = a.strstart,
                a.insert = a.lookahead,
                a.lookahead = 0,
                a.match_length = a.prev_length = z - 1,
                a.match_available = 0,
                t.next_in = h,
                t.input = l,
                t.avail_in = s,
                a.wrap = i,
                p
            }
            ,
            a.deflateInfo = "pako deflate (from Nodeca project)"
        }
        , {
            "../utils/common": 1,
            "./adler32": 3,
            "./crc32": 4,
            "./messages": 6,
            "./trees": 7
        }],
        6: [function(t, e, a) {
            "use strict";
            e.exports = {
                2: "need dictionary",
                1: "stream end",
                0: "",
                "-1": "file error",
                "-2": "stream error",
                "-3": "data error",
                "-4": "insufficient memory",
                "-5": "buffer error",
                "-6": "incompatible version"
            }
        }
        , {}],
        7: [function(t, e, a) {
            "use strict";
            var l = t("../utils/common")
              , h = 0
              , o = 1;
            function n(t) {
                for (var e = t.length; 0 <= --e; )
                    t[e] = 0
            }
            var _ = 0
              , s = 29
              , d = 256
              , u = d + 1 + s
              , f = 30
              , c = 19
              , g = 2 * u + 1
              , m = 15
              , r = 16
              , p = 7
              , b = 256
              , v = 16
              , w = 17
              , y = 18
              , k = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0]
              , z = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13]
              , x = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7]
              , B = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]
              , A = new Array(2 * (u + 2));
            n(A);
            var C = new Array(2 * f);
            n(C);
            var S = new Array(512);
            n(S);
            var j = new Array(256);
            n(j);
            var E = new Array(s);
            n(E);
            var U, D, I, O = new Array(f);
            function q(t, e, a, n, r) {
                this.static_tree = t,
                this.extra_bits = e,
                this.extra_base = a,
                this.elems = n,
                this.max_length = r,
                this.has_stree = t && t.length
            }
            function i(t, e) {
                this.dyn_tree = t,
                this.max_code = 0,
                this.stat_desc = e
            }
            function T(t) {
                return t < 256 ? S[t] : S[256 + (t >>> 7)]
            }
            function L(t, e) {
                t.pending_buf[t.pending++] = 255 & e,
                t.pending_buf[t.pending++] = e >>> 8 & 255
            }
            function N(t, e, a) {
                t.bi_valid > r - a ? (t.bi_buf |= e << t.bi_valid & 65535,
                L(t, t.bi_buf),
                t.bi_buf = e >> r - t.bi_valid,
                t.bi_valid += a - r) : (t.bi_buf |= e << t.bi_valid & 65535,
                t.bi_valid += a)
            }
            function R(t, e, a) {
                N(t, a[2 * e], a[2 * e + 1])
            }
            function H(t, e) {
                for (var a = 0; a |= 1 & t,
                t >>>= 1,
                a <<= 1,
                0 < --e; )
                    ;
                return a >>> 1
            }
            function F(t, e, a) {
                var n, r, i = new Array(m + 1), s = 0;
                for (n = 1; n <= m; n++)
                    i[n] = s = s + a[n - 1] << 1;
                for (r = 0; r <= e; r++) {
                    var h = t[2 * r + 1];
                    0 !== h && (t[2 * r] = H(i[h]++, h))
                }
            }
            function K(t) {
                var e;
                for (e = 0; e < u; e++)
                    t.dyn_ltree[2 * e] = 0;
                for (e = 0; e < f; e++)
                    t.dyn_dtree[2 * e] = 0;
                for (e = 0; e < c; e++)
                    t.bl_tree[2 * e] = 0;
                t.dyn_ltree[2 * b] = 1,
                t.opt_len = t.static_len = 0,
                t.last_lit = t.matches = 0
            }
            function M(t) {
                8 < t.bi_valid ? L(t, t.bi_buf) : 0 < t.bi_valid && (t.pending_buf[t.pending++] = t.bi_buf),
                t.bi_buf = 0,
                t.bi_valid = 0
            }
            function P(t, e, a, n) {
                var r = 2 * e
                  , i = 2 * a;
                return t[r] < t[i] || t[r] === t[i] && n[e] <= n[a]
            }
            function G(t, e, a) {
                for (var n = t.heap[a], r = a << 1; r <= t.heap_len && (r < t.heap_len && P(e, t.heap[r + 1], t.heap[r], t.depth) && r++,
                !P(e, n, t.heap[r], t.depth)); )
                    t.heap[a] = t.heap[r],
                    a = r,
                    r <<= 1;
                t.heap[a] = n
            }
            function J(t, e, a) {
                var n, r, i, s, h = 0;
                if (0 !== t.last_lit)
                    for (; n = t.pending_buf[t.d_buf + 2 * h] << 8 | t.pending_buf[t.d_buf + 2 * h + 1],
                    r = t.pending_buf[t.l_buf + h],
                    h++,
                    0 === n ? R(t, r, e) : (R(t, (i = j[r]) + d + 1, e),
                    0 !== (s = k[i]) && N(t, r -= E[i], s),
                    R(t, i = T(--n), a),
                    0 !== (s = z[i]) && N(t, n -= O[i], s)),
                    h < t.last_lit; )
                        ;
                R(t, b, e)
            }
            function Q(t, e) {
                var a, n, r, i = e.dyn_tree, s = e.stat_desc.static_tree, h = e.stat_desc.has_stree, l = e.stat_desc.elems, o = -1;
                for (t.heap_len = 0,
                t.heap_max = g,
                a = 0; a < l; a++)
                    0 !== i[2 * a] ? (t.heap[++t.heap_len] = o = a,
                    t.depth[a] = 0) : i[2 * a + 1] = 0;
                for (; t.heap_len < 2; )
                    i[2 * (r = t.heap[++t.heap_len] = o < 2 ? ++o : 0)] = 1,
                    t.depth[r] = 0,
                    t.opt_len--,
                    h && (t.static_len -= s[2 * r + 1]);
                for (e.max_code = o,
                a = t.heap_len >> 1; 1 <= a; a--)
                    G(t, i, a);
                for (r = l; a = t.heap[1],
                t.heap[1] = t.heap[t.heap_len--],
                G(t, i, 1),
                n = t.heap[1],
                t.heap[--t.heap_max] = a,
                t.heap[--t.heap_max] = n,
                i[2 * r] = i[2 * a] + i[2 * n],
                t.depth[r] = (t.depth[a] >= t.depth[n] ? t.depth[a] : t.depth[n]) + 1,
                i[2 * a + 1] = i[2 * n + 1] = r,
                t.heap[1] = r++,
                G(t, i, 1),
                2 <= t.heap_len; )
                    ;
                t.heap[--t.heap_max] = t.heap[1],
                function(t, e) {
                    var a, n, r, i, s, h, l = e.dyn_tree, o = e.max_code, _ = e.stat_desc.static_tree, d = e.stat_desc.has_stree, u = e.stat_desc.extra_bits, f = e.stat_desc.extra_base, c = e.stat_desc.max_length, p = 0;
                    for (i = 0; i <= m; i++)
                        t.bl_count[i] = 0;
                    for (l[2 * t.heap[t.heap_max] + 1] = 0,
                    a = t.heap_max + 1; a < g; a++)
                        c < (i = l[2 * l[2 * (n = t.heap[a]) + 1] + 1] + 1) && (i = c,
                        p++),
                        l[2 * n + 1] = i,
                        o < n || (t.bl_count[i]++,
                        s = 0,
                        f <= n && (s = u[n - f]),
                        h = l[2 * n],
                        t.opt_len += h * (i + s),
                        d && (t.static_len += h * (_[2 * n + 1] + s)));
                    if (0 !== p) {
                        do {
                            for (i = c - 1; 0 === t.bl_count[i]; )
                                i--;
                            t.bl_count[i]--,
                            t.bl_count[i + 1] += 2,
                            t.bl_count[c]--,
                            p -= 2
                        } while (0 < p);
                        for (i = c; 0 !== i; i--)
                            for (n = t.bl_count[i]; 0 !== n; )
                                o < (r = t.heap[--a]) || (l[2 * r + 1] !== i && (t.opt_len += (i - l[2 * r + 1]) * l[2 * r],
                                l[2 * r + 1] = i),
                                n--)
                    }
                }(t, e),
                F(i, o, t.bl_count)
            }
            function V(t, e, a) {
                var n, r, i = -1, s = e[1], h = 0, l = 7, o = 4;
                for (0 === s && (l = 138,
                o = 3),
                e[2 * (a + 1) + 1] = 65535,
                n = 0; n <= a; n++)
                    r = s,
                    s = e[2 * (n + 1) + 1],
                    ++h < l && r === s || (h < o ? t.bl_tree[2 * r] += h : 0 !== r ? (r !== i && t.bl_tree[2 * r]++,
                    t.bl_tree[2 * v]++) : h <= 10 ? t.bl_tree[2 * w]++ : t.bl_tree[2 * y]++,
                    i = r,
                    (h = 0) === s ? (l = 138,
                    o = 3) : r === s ? (l = 6,
                    o = 3) : (l = 7,
                    o = 4))
            }
            function W(t, e, a) {
                var n, r, i = -1, s = e[1], h = 0, l = 7, o = 4;
                for (0 === s && (l = 138,
                o = 3),
                n = 0; n <= a; n++)
                    if (r = s,
                    s = e[2 * (n + 1) + 1],
                    !(++h < l && r === s)) {
                        if (h < o)
                            for (; R(t, r, t.bl_tree),
                            0 != --h; )
                                ;
                        else
                            0 !== r ? (r !== i && (R(t, r, t.bl_tree),
                            h--),
                            R(t, v, t.bl_tree),
                            N(t, h - 3, 2)) : h <= 10 ? (R(t, w, t.bl_tree),
                            N(t, h - 3, 3)) : (R(t, y, t.bl_tree),
                            N(t, h - 11, 7));
                        i = r,
                        (h = 0) === s ? (l = 138,
                        o = 3) : r === s ? (l = 6,
                        o = 3) : (l = 7,
                        o = 4)
                    }
            }
            n(O);
            var X = !1;
            function Y(t, e, a, n) {
                var r, i, s, h;
                N(t, (_ << 1) + (n ? 1 : 0), 3),
                i = e,
                s = a,
                h = !0,
                M(r = t),
                h && (L(r, s),
                L(r, ~s)),
                l.arraySet(r.pending_buf, r.window, i, s, r.pending),
                r.pending += s
            }
            a._tr_init = function(t) {
                X || (function() {
                    var t, e, a, n, r, i = new Array(m + 1);
                    for (n = a = 0; n < s - 1; n++)
                        for (E[n] = a,
                        t = 0; t < 1 << k[n]; t++)
                            j[a++] = n;
                    for (j[a - 1] = n,
                    n = r = 0; n < 16; n++)
                        for (O[n] = r,
                        t = 0; t < 1 << z[n]; t++)
                            S[r++] = n;
                    for (r >>= 7; n < f; n++)
                        for (O[n] = r << 7,
                        t = 0; t < 1 << z[n] - 7; t++)
                            S[256 + r++] = n;
                    for (e = 0; e <= m; e++)
                        i[e] = 0;
                    for (t = 0; t <= 143; )
                        A[2 * t + 1] = 8,
                        t++,
                        i[8]++;
                    for (; t <= 255; )
                        A[2 * t + 1] = 9,
                        t++,
                        i[9]++;
                    for (; t <= 279; )
                        A[2 * t + 1] = 7,
                        t++,
                        i[7]++;
                    for (; t <= 287; )
                        A[2 * t + 1] = 8,
                        t++,
                        i[8]++;
                    for (F(A, u + 1, i),
                    t = 0; t < f; t++)
                        C[2 * t + 1] = 5,
                        C[2 * t] = H(t, 5);
                    U = new q(A,k,d + 1,u,m),
                    D = new q(C,z,0,f,m),
                    I = new q(new Array(0),x,0,c,p)
                }(),
                X = !0),
                t.l_desc = new i(t.dyn_ltree,U),
                t.d_desc = new i(t.dyn_dtree,D),
                t.bl_desc = new i(t.bl_tree,I),
                t.bi_buf = 0,
                t.bi_valid = 0,
                K(t)
            }
            ,
            a._tr_stored_block = Y,
            a._tr_flush_block = function(t, e, a, n) {
                var r, i, s = 0;
                0 < t.level ? (2 === t.strm.data_type && (t.strm.data_type = function(t) {
                    var e, a = 4093624447;
                    for (e = 0; e <= 31; e++,
                    a >>>= 1)
                        if (1 & a && 0 !== t.dyn_ltree[2 * e])
                            return h;
                    if (0 !== t.dyn_ltree[18] || 0 !== t.dyn_ltree[20] || 0 !== t.dyn_ltree[26])
                        return o;
                    for (e = 32; e < d; e++)
                        if (0 !== t.dyn_ltree[2 * e])
                            return o;
                    return h
                }(t)),
                Q(t, t.l_desc),
                Q(t, t.d_desc),
                s = function(t) {
                    var e;
                    for (V(t, t.dyn_ltree, t.l_desc.max_code),
                    V(t, t.dyn_dtree, t.d_desc.max_code),
                    Q(t, t.bl_desc),
                    e = c - 1; 3 <= e && 0 === t.bl_tree[2 * B[e] + 1]; e--)
                        ;
                    return t.opt_len += 3 * (e + 1) + 5 + 5 + 4,
                    e
                }(t),
                r = t.opt_len + 3 + 7 >>> 3,
                (i = t.static_len + 3 + 7 >>> 3) <= r && (r = i)) : r = i = a + 5,
                a + 4 <= r && -1 !== e ? Y(t, e, a, n) : 4 === t.strategy || i === r ? (N(t, 2 + (n ? 1 : 0), 3),
                J(t, A, C)) : (N(t, 4 + (n ? 1 : 0), 3),
                function(t, e, a, n) {
                    var r;
                    for (N(t, e - 257, 5),
                    N(t, a - 1, 5),
                    N(t, n - 4, 4),
                    r = 0; r < n; r++)
                        N(t, t.bl_tree[2 * B[r] + 1], 3);
                    W(t, t.dyn_ltree, e - 1),
                    W(t, t.dyn_dtree, a - 1)
                }(t, t.l_desc.max_code + 1, t.d_desc.max_code + 1, s + 1),
                J(t, t.dyn_ltree, t.dyn_dtree)),
                K(t),
                n && M(t)
            }
            ,
            a._tr_tally = function(t, e, a) {
                return t.pending_buf[t.d_buf + 2 * t.last_lit] = e >>> 8 & 255,
                t.pending_buf[t.d_buf + 2 * t.last_lit + 1] = 255 & e,
                t.pending_buf[t.l_buf + t.last_lit] = 255 & a,
                t.last_lit++,
                0 === e ? t.dyn_ltree[2 * a]++ : (t.matches++,
                e--,
                t.dyn_ltree[2 * (j[a] + d + 1)]++,
                t.dyn_dtree[2 * T(e)]++),
                t.last_lit === t.lit_bufsize - 1
            }
            ,
            a._tr_align = function(t) {
                var e;
                N(t, 2, 3),
                R(t, b, A),
                16 === (e = t).bi_valid ? (L(e, e.bi_buf),
                e.bi_buf = 0,
                e.bi_valid = 0) : 8 <= e.bi_valid && (e.pending_buf[e.pending++] = 255 & e.bi_buf,
                e.bi_buf >>= 8,
                e.bi_valid -= 8)
            }
        }
        , {
            "../utils/common": 1
        }],
        8: [function(t, e, a) {
            "use strict";
            e.exports = function() {
                this.input = null,
                this.next_in = 0,
                this.avail_in = 0,
                this.total_in = 0,
                this.output = null,
                this.next_out = 0,
                this.avail_out = 0,
                this.total_out = 0,
                this.msg = "",
                this.state = null,
                this.data_type = 2,
                this.adler = 0
            }
        }
        , {}],
        "/lib/deflate.js": [function(t, e, a) {
            "use strict";
            var s = t("./zlib/deflate")
              , h = t("./utils/common")
              , l = t("./utils/strings")
              , r = t("./zlib/messages")
              , i = t("./zlib/zstream")
              , o = Object.prototype.toString
              , _ = 0
              , d = -1
              , u = 0
              , f = 8;
            function c(t) {
                if (!(this instanceof c))
                    return new c(t);
                this.options = h.assign({
                    level: d,
                    method: f,
                    chunkSize: 16384,
                    windowBits: 15,
                    memLevel: 8,
                    strategy: u,
                    to: ""
                }, t || {});
                var e = this.options;
                e.raw && 0 < e.windowBits ? e.windowBits = -e.windowBits : e.gzip && 0 < e.windowBits && e.windowBits < 16 && (e.windowBits += 16),
                this.err = 0,
                this.msg = "",
                this.ended = !1,
                this.chunks = [],
                this.strm = new i,
                this.strm.avail_out = 0;
                var a = s.deflateInit2(this.strm, e.level, e.method, e.windowBits, e.memLevel, e.strategy);
                if (a !== _)
                    throw new Error(r[a]);
                if (e.header && s.deflateSetHeader(this.strm, e.header),
                e.dictionary) {
                    var n;
                    if (n = "string" == typeof e.dictionary ? l.string2buf(e.dictionary) : "[object ArrayBuffer]" === o.call(e.dictionary) ? new Uint8Array(e.dictionary) : e.dictionary,
                    (a = s.deflateSetDictionary(this.strm, n)) !== _)
                        throw new Error(r[a]);
                    this._dict_set = !0
                }
            }
            function n(t, e) {
                var a = new c(e);
                if (a.push(t, !0),
                a.err)
                    throw a.msg || r[a.err];
                return a.result
            }
            c.prototype.push = function(t, e) {
                var a, n, r = this.strm, i = this.options.chunkSize;
                if (this.ended)
                    return !1;
                n = e === ~~e ? e : !0 === e ? 4 : 0,
                "string" == typeof t ? r.input = l.string2buf(t) : "[object ArrayBuffer]" === o.call(t) ? r.input = new Uint8Array(t) : r.input = t,
                r.next_in = 0,
                r.avail_in = r.input.length;
                do {
                    if (0 === r.avail_out && (r.output = new h.Buf8(i),
                    r.next_out = 0,
                    r.avail_out = i),
                    1 !== (a = s.deflate(r, n)) && a !== _)
                        return this.onEnd(a),
                        !(this.ended = !0);
                    0 !== r.avail_out && (0 !== r.avail_in || 4 !== n && 2 !== n) || ("string" === this.options.to ? this.onData(l.buf2binstring(h.shrinkBuf(r.output, r.next_out))) : this.onData(h.shrinkBuf(r.output, r.next_out)))
                } while ((0 < r.avail_in || 0 === r.avail_out) && 1 !== a);
                return 4 === n ? (a = s.deflateEnd(this.strm),
                this.onEnd(a),
                this.ended = !0,
                a === _) : 2 !== n || (this.onEnd(_),
                !(r.avail_out = 0))
            }
            ,
            c.prototype.onData = function(t) {
                this.chunks.push(t)
            }
            ,
            c.prototype.onEnd = function(t) {
                t === _ && ("string" === this.options.to ? this.result = this.chunks.join("") : this.result = h.flattenChunks(this.chunks)),
                this.chunks = [],
                this.err = t,
                this.msg = this.strm.msg
            }
            ,
            a.Deflate = c,
            a.deflate = n,
            a.deflateRaw = function(t, e) {
                return (e = e || {}).raw = !0,
                n(t, e)
            }
            ,
            a.gzip = function(t, e) {
                return (e = e || {}).gzip = !0,
                n(t, e)
            }
        }
        , {
            "./utils/common": 1,
            "./utils/strings": 2,
            "./zlib/deflate": 5,
            "./zlib/messages": 6,
            "./zlib/zstream": 8
        }]
    }, {}, [])("/lib/deflate.js")
});

/*
 *  **************************************************************************
 *  Licensed Materials - Property of HCL
 *  (c) Copyright HCL Technologies Ltd.  2020. All Rights Reserved.
 *  US Government Users Restricted Rights - Use, duplication or disclosure
 *  restricted by GSA ADP Schedule Contract with HCL Technologies.
 *  **************************************************************************
 */

/* HCL Discover Core 12.2 */
if (window.DCX) {
    throw "Attempting to recreate DCX. Library may be included more than once on the page."
}
window.DCX = (function() {
    var x, r, B, H, o, D, e, f, E;
    function y(T, K, L, U, N) {
        var R = null
          , V = null
          , P = DCX.getModule("replay")
          , S = DCX.getModule("DCCookie")
          , W = DCX.getModule("performance")
          , O = DCX.getModule("universalLogger")
          , M = null
          , Q = E.getOriginAndPath()
          , J = E.getQueryString(window.location.search);
        if (!K || typeof K !== "string") {
            return
        }
        V = {
            type: 2,
            screenview: {
                type: T,
                name: K,
                originalUrl: (N && N.path) || Q.path,
                url: DCX.normalizeUrl("", ((N && N.path) || Q.path), 2),
                host: (N && N.origin) || Q.origin,
                referrer: L,
                title: (N && N.title) || document.title,
                queryString: (N && N.queryString) || J
            }
        };
        if (!(J || (N && N.queryString))) {
            delete V.screenview.queryString
        }
        if (!L || typeof L !== "string") {
            delete V.screenview.referrer
        }
        if (T === "LOAD") {
            M = {
                type: "screenview_load",
                name: K
            }
        } else {
            if (T === "UNLOAD") {
                M = {
                    type: "screenview_unload",
                    name: K
                }
            }
        }
        if (M && P) {
            R = P.onevent(M)
        }
        if (R) {
            V.dcid = R
        }
        if (T === "LOAD" || T === "UNLOAD") {
            D.post("", V)
        }
        if (M && S) {
            S.onevent(M)
        }
        if (M && W) {
            W.onevent(M)
        }
        if (M && O) {
            O.onevent(M)
        }
    }
    function z(J) {
        var K;
        if (!J || !J.coords) {
            return
        }
        K = {
            type: 13,
            geolocation: {
                lat: J.coords.latitude,
                "long": J.coords.longitude,
                accuracy: Math.ceil(J.coords.accuracy)
            }
        };
        D.post("", K)
    }
    function t() {
        var J;
        J = {
            type: 13,
            geolocation: {
                errorCode: 201,
                error: "Permission denied."
            }
        };
        D.post("", J)
    }
    var d = (new Date()).getTime(), k, F = {}, b = {}, h = false, j = null, s = false, v = (function() {
        var K, M = [];
        function L(Q) {
            var N = f.framesBlacklist, P, O;
            K = K || [];
            Q = Q || null;
            if (typeof N !== "undefined" && N.length > 0) {
                for (O = 0; O < N.length; O += 1) {
                    P = B.queryAll(N[O], Q);
                    if (P && P.length > 0) {
                        K = K.concat(P)
                    }
                }
                M = M.concat(B.queryAll("iframe", Q))
            }
        }
        function J(O) {
            var N = C.getServiceConfig("domCapture")
              , P = N && N.options && N.options.captureFrames;
            if (P === false) {
                return true
            }
            if (E.indexOf(M, O) < 0) {
                L(O.ownerDocument)
            }
            return E.indexOf(K, O) > -1
        }
        J.clearCache = function() {
            K = null
        }
        ;
        return J
    }()), w = null, l = {
        config: ["getConfig", "updateConfig", "getCoreConfig", "updateCoreConfig", "getModuleConfig", "updateModuleConfig", "getServiceConfig", "updateServiceConfig"],
        queue: ["post", "setAutoFlush", "flushAll"],
        browserBase: ["getXPathFromNode", "processDOMEvent"]
    }, A = (function() {
        var J = {};
        return {
            normalizeModuleEvents: function(O, M, Q, L) {
                var K = J[O]
                  , P = false
                  , N = false;
                Q = Q || C._getLocalTop();
                L = L || Q.document;
                if (K) {
                    return
                }
                J[O] = {
                    loadFired: false,
                    pageHideFired: false
                };
                E.forEach(M, function(R) {
                    switch (R.name) {
                    case "load":
                        P = true;
                        M.push(E.mixin(E.mixin({}, R), {
                            name: "pageshow"
                        }));
                        break;
                    case "unload":
                        N = true;
                        M.push(E.mixin(E.mixin({}, R), {
                            name: "pagehide"
                        }));
                        M.push(E.mixin(E.mixin({}, R), {
                            name: "beforeunload"
                        }));
                        break;
                    case "change":
                        if (E.isLegacyIE && C.getFlavor() === "w3c") {
                            M.push(E.mixin(E.mixin({}, R), {
                                name: "propertychange"
                            }))
                        }
                        break
                    }
                });
                if (!P && !N) {
                    delete J[O];
                    return
                }
                J[O].silentLoad = !P;
                J[O].silentUnload = !N;
                if (!P) {
                    M.push({
                        name: "load",
                        target: Q
                    })
                }
                if (!N) {
                    M.push({
                        name: "unload",
                        target: Q
                    })
                }
            },
            canPublish: function(K, M) {
                var L;
                if (J.hasOwnProperty(K) === false) {
                    return true
                }
                L = J[K];
                switch (M.type) {
                case "load":
                    L.pageHideFired = false;
                    L.loadFired = true;
                    return !L.silentLoad;
                case "pageshow":
                    L.pageHideFired = false;
                    M.type = "load";
                    return !L.loadFired && !L.silentLoad;
                case "pagehide":
                    M.type = "unload";
                    L.loadFired = false;
                    L.pageHideFired = true;
                    return !L.silentUnload;
                case "unload":
                case "beforeunload":
                    M.type = "unload";
                    L.loadFired = false;
                    return !L.pageHideFired && !L.silentUnload
                }
                return true
            },
            isUnload: function(K) {
                return typeof K === "object" ? (K.type === "unload" || K.type === "beforeunload" || K.type === "pagehide") : false
            }
        }
    }()), G = {}, c = {}, a = {}, n = function() {}, q = null, p = true, g = function() {}, m = false, u = (function() {
        var K = window.location
          , M = K.pathname
          , L = K.hash
          , O = E && E.getQueryString(K.search) || ""
          , J = E && E.getOriginAndPath(K) || ""
          , N = ""
          , P = document.title;
        return function() {
            var V = K.pathname
              , Q = K.hash
              , T = N
              , U = E && E.getOriginAndPath(K) || ""
              , S = document.title
              , R = E && E.getQueryString(K.search) || "";
            if (V !== M) {
                T = DCX.normalizeUrl("", V + Q, 2)
            } else {
                if (Q !== L) {
                    T = DCX.normalizeUrl("", Q, 2)
                }
            }
            if (T !== N) {
                if (N) {
                    y("UNLOAD", N, null, null, {
                        path: J && J.path,
                        origin: J && J.origin,
                        prevHash: L,
                        queryString: O,
                        title: P
                    })
                }
                y("LOAD", T);
                N = T;
                M = V;
                L = Q;
                J = U;
                P = S;
                O = R
            }
        }
    }()), i = function(L, S) {
        var M, K, N, R = false, J = f.blockedElements, P, Q, O;
        if (!J || !J.length) {
            i = function() {
                return false
            }
            ;
            return R
        }
        if (!L || !L.nodeType) {
            return R
        }
        S = S || E.getDocument(L);
        for (M = 0,
        N = J.length; M < N && !R; M += 1) {
            Q = B.queryAll(J[M], S);
            for (K = 0,
            O = Q.length; K < O && !R; K += 1) {
                P = Q[K];
                R = P.contains ? P.contains(L) : P === L
            }
        }
        return R
    }, I = function(K) {
        var J = false
          , L = ["intent:", "mailto:", "sms:", "tel:"];
        if (K && E.getTagName(K) === "a" && L.indexOf(K.protocol) !== -1) {
            J = true
        }
        return J
    }, C = {
        _loadGlobalsForUnitTesting: function(J) {
            E = J.utils;
            x = J.getService("ajax");
            r = J.getService("browserBase");
            B = J.getService("browser");
            H = J.getService("config");
            o = J.getService("domCapture");
            D = J.getService("queue");
            e = J.getService("serializer");
            f = H ? H.getCoreConfig() : null
        },
        getStartTime: function() {
            return d
        },
        getPageId: function() {
            return k || "#"
        },
        getLibraryVersion: function() {
            return "12.2.0"
        },
        getInternalVersion: function() {
            var J = this.getCoreConfig();
            if (J.version) {
                return J.version
            }
        },
        getCurrentWebEvent: function() {
            return G
        },
        normalizeUrl: function(L, K, M) {
            if (typeof K === "undefined") {
                K = L
            }
            var J = this.getCoreConfig();
            if (J.normalization && J.normalization.urlFunction) {
                return J.normalization.urlFunction(K, M)
            }
            return K
        },
        init: function(K, L) {
            var J;
            E = this.utils;
            if (E.isLegacyIE) {
                return
            }
            q = L;
            if (!p) {
                throw "init must only be called once!"
            }
            k = "P." + E.getRandomString(28);
            p = false;
            J = function(M) {
                M = M || window.event || {};
                if (M.type === "load" || document.readyState !== "loading") {
                    if (document.removeEventListener) {
                        document.removeEventListener("DOMContentLoaded", J, false);
                        window.removeEventListener("load", J, false)
                    } else {
                        document.detachEvent("onreadystatechange", J);
                        window.detachEvent("onload", J)
                    }
                    n(K, L)
                }
            }
            ;
            if (document.readyState === "complete" || (document.readyState === "interactive" && !E.isIE)) {
                setTimeout(J)
            } else {
                if (document.addEventListener) {
                    document.addEventListener("DOMContentLoaded", J, false);
                    window.addEventListener("load", J, false)
                } else {
                    document.attachEvent("onreadystatechange", J);
                    window.attachEvent("onload", J)
                }
            }
        },
        isInitialized: function() {
            return h
        },
        getState: function() {
            return j
        },
        setState: function(K, L) {
            var J = {
                destroyedParent: K,
                jMsg: L
            };
            j = K + "(" + L.destroyedBy + ") : " + L.destroyedReason;
            DCX.logCustomEvent("state", J, 6);
            sessionStorage.setItem("DCXLabState", JSON.stringify(J))
        },
        setWorkerStatus: function(J) {
            s = J
        },
        getWorkerStatus: function() {
            return s
        },
        destroy: function(L) {
            var M = ""
              , K = ""
              , Q = null
              , N = null
              , J = null
              , O = false;
            if (p) {
                return false
            }
            this.stopAll();
            if (!L) {
                for (M in c) {
                    if (c.hasOwnProperty(M)) {
                        K = M.split("|")[0];
                        Q = c[M].target;
                        O = c[M].delegateTarget || undefined;
                        B.unsubscribe(K, Q, this._publishEvent, O)
                    }
                }
            }
            for (N in b) {
                if (b.hasOwnProperty(N)) {
                    J = b[N].instance;
                    if (J && typeof J.destroy === "function") {
                        J.destroy()
                    }
                    b[N].instance = null
                }
            }
            v.clearCache();
            c = {};
            h = false;
            p = true;
            if (j === "unloading" || j === "loaded") {
                j = "destroyed"
            }
            if (typeof q === "function") {
                try {
                    q("destroyed")
                } catch (P) {}
            }
        },
        _updateModules: function(L) {
            var O = null
              , K = null
              , J = true;
            if (f && f.modules) {
                try {
                    for (K in f.modules) {
                        if (f.modules.hasOwnProperty(K)) {
                            O = f.modules[K];
                            if (F.hasOwnProperty(K)) {
                                if (O.enabled === false) {
                                    this.stop(K);
                                    continue
                                }
                                this.start(K);
                                if (O.events) {
                                    this._registerModuleEvents(K, O.events, L)
                                }
                            }
                        }
                    }
                    this._registerModuleEvents.clearCache()
                } catch (N) {
                    var M = {
                        destroyedReason: "UIC destroyed while update Modules.",
                        destroyedBy: "_updateModules",
                        destroyedByModule: K
                    };
                    DCX.setState("_updateModules", M);
                    C.destroy();
                    J = false
                }
            } else {
                J = false
            }
            return J
        },
        rebind: function(J) {
            C._updateModules(J)
        },
        getSessionData: function() {
            if (!C.isInitialized()) {
                return
            }
            var M = null, J = null, K, L;
            if (!f || !f.sessionDataEnabled) {
                return null
            }
            J = f.sessionData || {};
            K = J.sessionQueryName;
            if (K) {
                L = E.getQueryStringValue(K, J.sessionQueryDelim)
            } else {
                K = J.sessionCookieName || "TLTSID";
                L = E.getCookieValue(K)
            }
            if (K && L) {
                M = M || {};
                M.dcxSCN = K;
                M.dcxSCV = L;
                M.dcxSCVNeedsHashing = !!J.sessionValueNeedsHashing
            }
            return M
        },
        logGeolocation: function(J) {
            var N = C.getModuleConfig("replay") || {}
              , M = E.getValue(N, "geolocation.options", {
                timeout: 30000,
                enableHighAccuracy: true,
                maximumAge: 0
            })
              , L = E.getValue(N, "geolocation.enabled", false)
              , K = window.navigator;
            if (!J) {
                if (!L || !K || !K.geolocation || !K.geolocation.getCurrentPosition) {
                    return
                }
                K.geolocation.getCurrentPosition(z, t, M)
            } else {
                z(J)
            }
        },
        logCustomEvent: function(M, K, J) {
            if (!C.isInitialized()) {
                return
            }
            var L = null;
            if (!M || typeof M !== "string") {
                M = "CUSTOM"
            }
            if (!J || typeof J !== "number") {
                J = 5
            }
            K = K || {};
            L = {
                type: J,
                customEvent: {
                    name: M,
                    data: K
                }
            };
            D.post("", L)
        },
        logExceptionEvent: function(M, K, J) {
            if (!C.isInitialized()) {
                return
            }
            var L = null;
            if (!M || typeof M !== "string") {
                return
            }
            K = K || "";
            J = J || "";
            L = {
                type: 6,
                exception: {
                    description: M,
                    url: K,
                    line: J
                }
            };
            D.post("", L)
        },
        logFormCompletion: function(J, L) {
            if (!C.isInitialized()) {
                return
            }
            var K = {
                type: 15,
                formCompletion: {
                    submitted: !!J,
                    valid: (typeof L === "boolean" ? L : null)
                }
            };
            D.post("", K)
        },
        logScreenviewLoad: function(L, K, J) {
            if (!C.isInitialized()) {
                return
            }
            y("LOAD", L, K, J)
        },
        logScreenviewUnload: function(J) {
            if (!C.isInitialized()) {
                return
            }
            y("UNLOAD", J)
        },
        logDOMCapture: function(J, M) {
            var N = null, L, K, O;
            if (!this.isInitialized()) {
                return N
            }
            if (E.isLegacyIE) {
                return N
            }
            if (o) {
                J = J || window.document;
                K = this.getServiceConfig("domCapture");
                M = E.mixin({}, K.options, M);
                L = o.captureDOM(J, M);
                if (L) {
                    N = M.dcid || ("dcid-" + E.getSerialNumber() + "." + (new Date()).getTime());
                    L.dcid = N;
                    L.eventOn = !!M.eventOn;
                    O = {
                        type: 12,
                        domCapture: L
                    };
                    D.post("", O);
                    if (M.qffd !== false && !m && O.domCapture.fullDOM) {
                        D.flush();
                        m = true
                    }
                } else {
                    N = null
                }
            }
            return N
        },
        performDOMCapture: function(L, J, K) {
            return this.logDOMCapture(J, K)
        },
        performFormCompletion: function(K, J, L) {
            return this.logFormCompletion(J, L)
        },
        _bridgeCallback: function(K) {
            var J = a[K];
            if (J && J.enabled) {
                return J
            }
            return null
        },
        logScreenCapture: function() {
            if (!C.isInitialized()) {
                return
            }
            var J = C._bridgeCallback("screenCapture");
            if (J !== null) {
                J.cbFunction()
            }
        },
        enableDiscoverFramework: function() {
            if (!C.isInitialized()) {
                return
            }
            var J = C._bridgeCallback("enableDiscoverFramework");
            if (J !== null) {
                J.cbFunction()
            }
        },
        disableDiscoverFramework: function() {
            if (!C.isInitialized()) {
                return
            }
            var J = C._bridgeCallback("disableDiscoverFramework");
            if (J !== null) {
                J.cbFunction()
            }
        },
        startNewTLFSession: function() {
            if (!C.isInitialized()) {
                return
            }
            var J = C._bridgeCallback("startNewTLFSession");
            if (J !== null) {
                J.cbFunction()
            }
        },
        currentSessionId: function() {
            if (!C.isInitialized()) {
                return
            }
            var K, J = C._bridgeCallback("currentSessionId");
            if (J !== null) {
                K = J.cbFunction()
            }
            return K
        },
        defaultValueForConfigurableItem: function(J) {
            if (!C.isInitialized()) {
                return
            }
            var L, K = C._bridgeCallback("defaultValueForConfigurableItem");
            if (K !== null) {
                L = K.cbFunction(J)
            }
            return L
        },
        valueForConfigurableItem: function(J) {
            if (!C.isInitialized()) {
                return
            }
            var L, K = C._bridgeCallback("valueForConfigurableItem");
            if (K !== null) {
                L = K.cbFunction(J)
            }
            return L
        },
        setConfigurableItem: function(K, M) {
            if (!C.isInitialized()) {
                return
            }
            var J = false
              , L = C._bridgeCallback("setConfigurableItem");
            if (L !== null) {
                J = L.cbFunction(K, M)
            }
            return J
        },
        addAdditionalHttpHeader: function(K, M) {
            if (!C.isInitialized()) {
                return
            }
            var J = false
              , L = C._bridgeCallback("addAdditionalHttpHeader");
            if (L !== null) {
                J = L.cbFunction(K, M)
            }
            return J
        },
        logCustomEventBridge: function(L, M, K) {
            if (!C.isInitialized()) {
                return
            }
            var J = false
              , N = C._bridgeCallback("logCustomEventBridge");
            if (N !== null) {
                J = N.cbFunction(L, M, K)
            }
            return J
        },
        registerBridgeCallbacks: function(R) {
            var O, M, P, L = null, N, S, K, J;
            if (!R) {
                return false
            }
            if (R.length === 0) {
                a = {};
                return false
            }
            try {
                for (O = 0,
                P = R.length; O < P; O += 1) {
                    L = R[O];
                    if (typeof L === "object" && L.cbType && L.cbFunction) {
                        N = {
                            enabled: L.enabled,
                            cbFunction: L.cbFunction,
                            cbOrder: L.order || 0
                        };
                        if (E.isUndefOrNull(a[L.cbType])) {
                            if (N.enabled) {
                                a[L.cbType] = N
                            }
                        } else {
                            if (!E.isArray(a[L.cbType])) {
                                a[L.cbType] = [a[L.cbType]]
                            }
                            S = a[L.cbType];
                            for (M = 0,
                            K = false,
                            J = S.length; M < J; M += 1) {
                                if (S[M].cbOrder === N.cbOrder && S[M].cbFunction === N.cbFunction) {
                                    K = true;
                                    if (!N.enabled) {
                                        S.splice(M, 1);
                                        if (!S.length) {
                                            delete a[L.cbType]
                                        }
                                    }
                                } else {
                                    if (S[M].cbOrder > N.cbOrder) {
                                        break
                                    }
                                }
                            }
                            if (!K) {
                                if (N.enabled) {
                                    S.splice(M, 0, N)
                                }
                            }
                        }
                    }
                }
            } catch (Q) {
                return false
            }
            return true
        },
        redirectQueue: function(M) {
            var P, O, L, K, J, Q, N;
            if (!M || !M.length) {
                return M
            }
            K = a.messageRedirect;
            if (!K) {
                return M
            }
            if (!E.isArray(K)) {
                J = [K]
            } else {
                J = K
            }
            for (O = 0,
            Q = J.length; O < Q; O += 1) {
                K = J[O];
                if (K && K.enabled) {
                    for (P = 0,
                    L = M.length; P < L; P += 1) {
                        N = K.cbFunction(e.serialize(M[P]), M[P]);
                        if (N && typeof N === "object") {
                            M[P] = N
                        } else {
                            M.splice(P, 1);
                            P -= 1;
                            L = M.length
                        }
                    }
                }
            }
            return M
        },
        _hasSameOrigin: function(J) {
            try {
                return J.document.location.host === document.location.host && J.document.location.protocol === document.location.protocol
            } catch (K) {}
            return false
        },
        provideRequestHeaders: function() {
            var O = null, L = a.addRequestHeaders, K, N, M;
            if (!E.isArray(L)) {
                K = [L]
            } else {
                K = L
            }
            for (M = 0,
            N = K.length; M < N; M += 1) {
                L = K[M];
                if (L && L.enabled) {
                    var J = L.cbFunction();
                    if (J) {
                        O = (O || []).concat(J)
                    }
                }
            }
            return O
        },
        _registerModuleEvents: (function() {
            var L, N = 0, M = function(R, Q, P) {
                if (R === "window") {
                    return Q
                }
                if (R === "document") {
                    return P
                }
                return R
            };
            function O(P, V, X) {
                var W = E.getDocument(X), R = C._getLocalTop(), Q = E.isIFrameDescendant(X), U, T, S;
                X = X || W;
                A.normalizeModuleEvents(P, V, R, W);
                if (Q) {
                    U = r.ElementData.prototype.examineID(X).id;
                    if (typeof U === "string") {
                        U = U.slice(0, U.length - 1);
                        for (T in c) {
                            if (c.hasOwnProperty(T)) {
                                for (S = 0; S < c[T].length; S += 1) {
                                    if (P === c[T][S]) {
                                        if (T.indexOf(U) !== -1) {
                                            delete c[T];
                                            break
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                E.forEach(V, function(Y) {
                    var ab = M(Y.target, R, W) || W
                      , aa = M(Y.delegateTarget, R, W)
                      , Z = "";
                    if (Y.recurseFrames !== true && Q) {
                        return
                    }
                    if (typeof ab === "string") {
                        if (Y.delegateTarget && C.getFlavor() === "jQuery") {
                            Z = C._buildToken4delegateTarget(Y.name, ab, Y.delegateTarget);
                            if (!c.hasOwnProperty(Z)) {
                                c[Z] = [P];
                                c[Z].target = ab;
                                c[Z].delegateTarget = aa;
                                B.subscribe(Y.name, ab, C._publishEvent, aa, Z)
                            } else {
                                c[Z].push(P)
                            }
                        } else {
                            E.forEach(B.queryAll(ab, X), function(ac) {
                                var ad = L.get(ac);
                                if (!ad) {
                                    ad = r.ElementData.prototype.examineID(ac);
                                    L.set(ac, ad)
                                }
                                Z = Y.name + "|" + ad.id + ad.idType;
                                if (E.indexOf(c[Z], P) !== -1) {
                                    return
                                }
                                c[Z] = c[Z] || [];
                                c[Z].push(P);
                                c[Z].target = ac;
                                B.subscribe(Y.name, ac, C._publishEvent)
                            })
                        }
                    } else {
                        Z = C._buildToken4bubbleTarget(Y.name, ab, typeof Y.target === "undefined");
                        if (!c.hasOwnProperty(Z)) {
                            c[Z] = [P];
                            B.subscribe(Y.name, ab, C._publishEvent)
                        } else {
                            if (E.indexOf(c[Z], P) === -1) {
                                c[Z].push(P)
                            }
                        }
                    }
                    if (Z !== "") {
                        if (typeof ab !== "string") {
                            c[Z].target = ab
                        }
                    }
                })
            }
            function K(P) {
                var Q = E.getIFrameWindow(P);
                return (Q !== null) && C._hasSameOrigin(Q) && (Q.document !== null) && Q.document.readyState === "complete"
            }
            function J(S, Q, W) {
                W = W || C._getLocalTop().document;
                L = L || new E.WeakMap();
                O(S, Q, W);
                if (S !== "performance") {
                    var V = null, R = null, P = B.queryAll("iframe, frame", W), U, T;
                    for (U = 0,
                    T = P.length; U < T; U += 1) {
                        V = P[U];
                        if (v(V)) {
                            continue
                        }
                        if (K(V)) {
                            R = E.getIFrameWindow(V);
                            C._registerModuleEvents(S, Q, R.document);
                            o.observeWindow(R);
                            continue
                        }
                        N += 1;
                        (function(Z, X, aa) {
                            var Y = null
                              , ab = {
                                moduleName: Z,
                                moduleEvents: X,
                                hIFrame: aa,
                                _registerModuleEventsDelayed: function() {
                                    var ac = null;
                                    if (!v(aa)) {
                                        ac = E.getIFrameWindow(aa);
                                        if (C._hasSameOrigin(ac)) {
                                            C._registerModuleEvents(Z, X, ac.document);
                                            o.observeWindow(ac)
                                        }
                                    }
                                    N -= 1;
                                    if (!N) {
                                        C._publishEvent({
                                            type: "loadWithFrames",
                                            custom: true
                                        })
                                    }
                                }
                            };
                            E.addEventListener(aa, "load", function() {
                                ab._registerModuleEventsDelayed()
                            });
                            if (E.isLegacyIE && K(aa)) {
                                Y = E.getIFrameWindow(aa);
                                E.addEventListener(Y.document, "readystatechange", function() {
                                    ab._registerModuleEventsDelayed()
                                })
                            }
                        }(S, Q, V))
                    }
                }
            }
            J.clearCache = function() {
                if (L) {
                    L.clear();
                    L = null
                }
            }
            ;
            return J
        }()),
        _buildToken4currentTarget: function(K) {
            var L = K.nativeEvent ? K.nativeEvent.currentTarget : null
              , J = L ? r.ElementData.prototype.examineID(L) : {
                id: K.target ? K.target.id : null,
                idType: K.target ? K.target.idType : -1
            };
            return K.type + "|" + J.id + J.idType
        },
        _buildToken4delegateTarget: function(J, L, K) {
            return J + "|" + L + "|" + K
        },
        _buildToken4bubbleTarget: function(K, Q, P, T) {
            var N = C._getLocalTop(), J, U = function(V) {
                var W = null;
                if (C._hasSameOrigin(J.parent)) {
                    E.forEach(B.queryAll("iframe, frame", J.parent.document), function(X) {
                        var Y = null;
                        if (!v(X)) {
                            Y = E.getIFrameWindow(X);
                            if (C._hasSameOrigin(Y) && Y.document === V) {
                                W = X
                            }
                        }
                    })
                }
                return W
            }, R = E.getDocument(Q), S = null, M, L = K, O;
            if (R) {
                J = R.defaultView || R.parentWindow
            }
            if (Q === window || Q === window.window) {
                L += "|null-2|window"
            } else {
                if (P && J && C._hasSameOrigin(J.parent) && typeof R !== "undefined" && N.document !== R) {
                    S = U(R);
                    if (S) {
                        M = r.ElementData.prototype.examineID(S);
                        L += "|" + M.xPath + "-2"
                    }
                } else {
                    if (T && T !== document && C.getFlavor() === "jQuery") {
                        L += "|null-2|" + E.getTagName(Q) + "|" + E.getTagName(T)
                    } else {
                        L += "|null-2|document"
                    }
                }
            }
            return L
        },
        _reinitConfig: function() {
            C._updateModules()
        },
        _publishEvent: function(J) {
            var K = null, M = null, O = (J.delegateTarget && J.data) ? J.data : C._buildToken4currentTarget(J), P = null, Q, R, S, L = null, T = false, U = false, W = J.delegateTarget || null, V, N;
            G = J;
            if (J.type.match(/^(click|change|blur|mouse|touch)/)) {
                g();
                D.resetFlushTimer()
            }
            V = E.getValue(f, "screenviewAutoDetect", true);
            if (V) {
                u()
            }
            if ((J.type === "load" || J.type === "pageshow") && !J.nativeEvent.customLoad) {
                G = {};
                return
            }
            if (J.type === "click") {
                w = J.target.element
            }
            if (J.type === "beforeunload") {
                T = false;
                N = (E.getTagName(w) === "a") ? w : document.activeElement;
                if (N) {
                    if (I(N)) {
                        T = true
                    } else {
                        E.forEach(f.ieExcludedLinks, function(Y) {
                            var Z, X, aa = B.queryAll(Y);
                            for (Z = 0,
                            X = aa ? aa.length : 0; Z < X; Z += 1) {
                                if (typeof aa[Z] !== undefined && aa[Z] === w) {
                                    T = true;
                                    break
                                }
                            }
                        })
                    }
                }
                if (T) {
                    G = {};
                    return
                }
            }
            if (A.isUnload(J)) {
                j = "unloading"
            }
            if (J.type === "change" && E.isLegacyIE && C.getFlavor() === "w3c" && (J.target.element.type === "checkbox" || J.target.element.type === "radio")) {
                G = {};
                return
            }
            if (J.type === "propertychange") {
                if (J.nativeEvent.propertyName === "checked" && (J.target.element.type === "checkbox" || (J.target.element.type === "radio" && J.target.element.checked))) {
                    J.type = "change";
                    J.target.type = "INPUT"
                } else {
                    G = {};
                    return
                }
            }
            if (J.target && i(J.target.element)) {
                G = {};
                return
            }
            if (!c.hasOwnProperty(O)) {
                if (J.hasOwnProperty("nativeEvent")) {
                    S = J.nativeEvent.currentTarget || J.nativeEvent.target
                }
                O = C._buildToken4bubbleTarget(J.type, S, true, W)
            }
            if (c.hasOwnProperty(O)) {
                P = c[O];
                for (Q = 0,
                R = P.length; Q < R; Q += 1) {
                    K = P[Q];
                    M = C.getModule(K);
                    L = E.mixin({}, J);
                    if (M && C.isStarted(K) && typeof M.onevent === "function") {
                        U = A.canPublish(K, L);
                        if (U) {
                            M.onevent(L)
                        }
                    }
                }
            }
            if (L && L.type === "unload" && U) {
                C.destroy()
            }
            G = {}
        },
        _getLocalTop: function() {
            return window.window
        },
        addModule: function(J, K) {
            F[J] = {
                creator: K,
                instance: null,
                context: null,
                messages: []
            };
            if (this.isInitialized()) {
                this.start(J)
            }
        },
        getModule: function(J) {
            if (F[J] && F[J].instance) {
                return F[J].instance
            }
            return null
        },
        removeModule: function(J) {
            this.stop(J);
            delete F[J]
        },
        isStarted: function(J) {
            return F.hasOwnProperty(J) && F[J].instance !== null
        },
        start: function(K) {
            var L = F[K]
              , J = null;
            if (L && L.instance === null) {
                L.context = new DCX.ModuleContext(K,this);
                J = L.instance = L.creator(L.context);
                if (typeof J.init === "function") {
                    J.init()
                }
            }
        },
        startAll: function() {
            var J = null;
            for (J in F) {
                if (F.hasOwnProperty(J)) {
                    this.start(J)
                }
            }
        },
        stop: function(K) {
            var L = F[K]
              , J = null;
            if (L && L.instance !== null) {
                J = L.instance;
                if (typeof J.destroy === "function") {
                    J.destroy()
                }
                L.instance = L.context = null
            }
        },
        stopAll: function() {
            var J = null;
            for (J in F) {
                if (F.hasOwnProperty(J)) {
                    this.stop(J)
                }
            }
        },
        addService: function(K, J) {
            b[K] = {
                creator: J,
                instance: null
            }
        },
        getService: function(J) {
            if (b.hasOwnProperty(J)) {
                if (!b[J].instance) {
                    try {
                        b[J].instance = b[J].creator(this);
                        if (typeof b[J].instance.init === "function") {
                            b[J].instance.init()
                        }
                    } catch (K) {
                        E.clog("UIC terminated due to error when instanciating the " + J + " service.");
                        throw K
                    }
                    if (typeof b[J].instance.getServiceName !== "function") {
                        b[J].instance.getServiceName = function() {
                            return J
                        }
                    }
                }
                return b[J].instance
            }
            return null
        },
        removeService: function(J) {
            delete b[J]
        },
        broadcast: function(M) {
            var L = 0
              , J = 0
              , N = null
              , K = null;
            if (M && typeof M === "object") {
                for (N in F) {
                    if (F.hasOwnProperty(N)) {
                        K = F[N];
                        if (E.indexOf(K.messages, M.type) > -1) {
                            if (typeof K.instance.onmessage === "function") {
                                K.instance.onmessage(M)
                            }
                        }
                    }
                }
            }
        },
        listen: function(J, L) {
            var K = null;
            if (this.isStarted(J)) {
                K = F[J];
                if (E.indexOf(K.messages, L) === -1) {
                    K.messages.push(L)
                }
            }
        },
        fail: function(M, L, J) {
            M = "UIC FAILED. " + M;
            try {
                var K = {
                    destroyedReason: "UIC FAILED. " + M,
                    destroyedBy: "fail",
                };
                DCX.setState("_publishEvent", K);
                C.destroy(!!J)
            } finally {
                E.clog(M);
                throw new C.UICError(M,L)
            }
        },
        UICError: (function() {
            function J(K, L) {
                this.message = K;
                this.code = L
            }
            J.prototype = new Error();
            J.prototype.name = "UICError";
            J.prototype.constructor = J;
            return J
        }()),
        getFlavor: function() {
            return "w3c"
        },
        isScreenviewInAccessList: function(L, K) {
            var J = K.some(function(N) {
                if (typeof N === "string") {
                    return (L || "").includes(N)
                } else {
                    if (typeof N === "object" && N.regex) {
                        var M = new RegExp(N.regex,N.flag);
                        return M.test(L)
                    }
                }
                return false
            });
            return J
        }
    };
    g = function() {
        var L = null
          , K = E.getValue(f, "inactivityTimeout", 600000);
        if (!K) {
            g = function() {}
            ;
            return
        }
        function J() {
            E.clog("UIC self-terminated due to inactivity timeout.");
            var M = {
                destroyedReason: "UIC self-terminated due to inactivity timeout.",
                destroyedBy: "inactivityTimeoutHandler"
            };
            DCX.setState("resetInactivityTimer", M);
            try {
                if (!f.sessionKeepAlive) {
                    C.destroy()
                }
            } catch (N) {
                C.destroy()
            }
        }
        g = function() {
            if (L) {
                clearTimeout(L);
                L = null
            }
            L = setTimeout(J, K)
        }
        ;
        g()
    }
    ;
    n = function(L, X) {
        var J, O, M, V, R, N, W, K, P, Q;
        if (h) {
            E.clog("DCX.init() called more than once. Ignoring.");
            return
        }
        if (DCX && DCX.replay) {
            return
        }
        H = C.getService("config");
        H.updateConfig(L);
        x = C.getService("ajax");
        r = C.getService("browserBase");
        B = C.getService("browser");
        o = C.getService("domCapture");
        D = C.getService("queue");
        e = C.getService("serializer");
        f = H.getCoreConfig();
        M = H.getModuleConfig("DCCookie") || {};
        N = M.sessionizationCookieName || "TLTSID";
        W = E.getCookieValue(N);
        if (W === "DND") {
            if (j !== "destroyed") {
                var S = {
                    destroyedReason: "Cookie value is DND",
                    destroyedBy: "sessionCookieValue"
                };
                DCX.setState("_init", S);
                C.destroy()
            }
            return
        }
        if (!C._updateModules()) {
            if (j !== "destroyed") {
                var S = {
                    destroyedReason: "UIC destroyed while updating modules",
                    destroyedBy: "core._updateModules"
                };
                DCX.setState("_init", S);
                C.destroy()
            }
            return
        }
        if (H.subscribe) {
            H.subscribe("configupdated", C._reinitConfig)
        }
        h = true;
        j = "loaded";
        try {
            if (typeof DCExtensionNotify === "function") {
                DCExtensionNotify("Initialized")
            }
        } catch (U) {}
        J = {
            type: "load",
            target: window.window,
            srcElement: window.window,
            currentTarget: window.window,
            bubbles: true,
            cancelBubble: false,
            cancelable: true,
            timeStamp: +new Date(),
            customLoad: true
        };
        O = new r.WebEvent(J);
        C._publishEvent(O);
        V = C.getServiceConfig("queue");
        R = V.queues || [];
        for (Q = 0; Q < R.length; Q += 1) {
            if (!W && M.dcAppKey) {
                K = R[Q].endpoint;
                P = R[Q].killswitchURL || (K.match("collectorPost") ? K.replace("collectorPost", "switch/" + M.dcAppKey) : null);
                if (P) {
                    x.sendRequest({
                        type: "GET",
                        url: P,
                        async: true,
                        timeout: 5000,
                        oncomplete: function(Y) {
                            if (Y.responseText === "0") {
                                C.setAutoFlush(false);
                                E.setCookie(N, "DND");
                                var Z = {
                                    destroyedReason: "UIC destroyed while kill switch URL",
                                    destroyedBy: "killswitchURl"
                                };
                                DCX.setState("_init", Z);
                                C.destroy()
                            }
                        }
                    })
                }
            }
            if (R[Q].checkEndpoint) {
                x.sendRequest({
                    oncomplete: function(Y) {},
                    timeout: R[Q].endpointCheckTimeout || 3000,
                    url: R[Q].endpoint,
                    headers: {
                        "X-PageId": k,
                        "X-Discover-SaaS-AppKey": M.dcAppKey,
                        "X-Discover-EndpointCheck": true
                    },
                    async: true,
                    error: function(Y) {
                        if (Y.success) {
                            return
                        }
                        C.setAutoFlush(false);
                        var Z = {
                            destroyedReason: "UIC destroyed while checking end point.",
                            destroyedBy: "checkEndPointinit"
                        };
                        DCX.setState("_init", Z);
                        C.destroy()
                    }
                })
            }
        }
        if (typeof q === "function") {
            try {
                q("initialized")
            } catch (T) {}
        }
        if (JSON.parse(sessionStorage.getItem("DCXLabState")) !== null) {
            var S = JSON.parse(sessionStorage.getItem("DCXLabState"));
            DCX.logCustomEvent("LastState", S, 6);
            sessionStorage.removeItem("DCXLabState")
        }
    }
    ;
    (function() {
        var K = null, L, J;
        for (K in l) {
            if (l.hasOwnProperty(K)) {
                for (L = 0,
                J = l[K].length; L < J; L += 1) {
                    (function(N, M) {
                        C[M] = function() {
                            var O = this.getService(N);
                            if (O) {
                                return O[M].apply(O, arguments)
                            }
                        }
                    }(K, l[K][L]))
                }
            }
        }
    }());
    return C
}());
(function() {
    var a = window.navigator.userAgent.toLowerCase()
      , i = (a.indexOf("msie") !== -1 || a.indexOf("trident") !== -1)
      , c = (function() {
        var j = !!window.performance;
        return (i && (!j || document.documentMode < 9))
    }())
      , e = (a.indexOf("android") !== -1)
      , f = /(ipad|iphone|ipod)/.test(a)
      , d = (a.indexOf("opera mini") !== -1)
      , b = 1
      , h = {
        "a:": "link",
        "button:button": "button",
        "button:submit": "button",
        "input:button": "button",
        "input:checkbox": "checkBox",
        "input:color": "colorPicker",
        "input:date": "datePicker",
        "input:datetime": "datetimePicker",
        "input:datetime-local": "datetime-local",
        "input:email": "emailInput",
        "input:file": "fileInput",
        "input:image": "button",
        "input:month": "month",
        "input:number": "numberPicker",
        "input:password": "textBox",
        "input:radio": "radioButton",
        "input:range": "slider",
        "input:reset": "button",
        "input:search": "searchBox",
        "input:submit": "button",
        "input:tel": "tel",
        "input:text": "textBox",
        "input:time": "timePicker",
        "input:url": "urlBox",
        "input:week": "week",
        "select:": "selectList",
        "select:select-one": "selectList",
        "textarea:": "textBox",
        "textarea:textarea": "textBox"
    }
      , g = {
        isIE: i,
        isLegacyIE: c,
        isAndroid: e,
        isLandscapeZeroDegrees: false,
        isiOS: f,
        isOperaMini: d,
        isUndefOrNull: function(j) {
            return typeof j === "undefined" || j === null
        },
        isArray: function(j) {
            return !!(j && Object.prototype.toString.call(j) === "[object Array]")
        },
        getSerialNumber: function() {
            var j;
            j = b;
            b += 1;
            return j
        },
        getRandomString: function(o, n) {
            var m, l, j = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789", k = "";
            if (!o) {
                return k
            }
            if (typeof n !== "string") {
                n = j
            }
            for (m = 0,
            l = n.length; m < o; m += 1) {
                k += n.charAt(Math.floor(Math.random() * l))
            }
            return k
        },
        getValue: function(o, n, k) {
            var m, j, l;
            k = typeof k === "undefined" ? null : k;
            if (!o || typeof o !== "object" || typeof n !== "string") {
                return k
            }
            l = n.split(".");
            for (m = 0,
            j = l.length; m < j; m += 1) {
                if (this.isUndefOrNull(o) || typeof o[l[m]] === "undefined") {
                    return k
                }
                o = o[l[m]]
            }
            return o
        },
        indexOf: function(m, l) {
            var k, j;
            if (m && m.indexOf) {
                return m.indexOf(l)
            }
            if (m && m instanceof Array) {
                for (k = 0,
                j = m.length; k < j; k += 1) {
                    if (m[k] === l) {
                        return k
                    }
                }
            }
            return -1
        },
        forEach: function(n, m, l) {
            var k, j;
            if (!n || !n.length || !m || !m.call) {
                return
            }
            for (k = 0,
            j = n.length; k < j; k += 1) {
                m.call(l, n[k], k, n)
            }
        },
        some: function(n, m) {
            var k, j, l = false;
            for (k = 0,
            j = n.length; k < j; k += 1) {
                l = m(n[k], k, n);
                if (l) {
                    return l
                }
            }
            return l
        },
        convertToArray: function(l) {
            var m = 0
              , k = l.length
              , j = [];
            while (m < k) {
                j.push(l[m]);
                m += 1
            }
            return j
        },
        mixin: function(n) {
            var m, l, k, j;
            for (k = 1,
            j = arguments.length; k < j; k += 1) {
                l = arguments[k];
                for (m in l) {
                    if (Object.prototype.hasOwnProperty.call(l, m)) {
                        n[m] = l[m]
                    }
                }
            }
            return n
        },
        extend: function(j, k, l) {
            var m = "";
            for (m in l) {
                if (Object.prototype.hasOwnProperty.call(l, m)) {
                    if (j && Object.prototype.toString.call(l[m]) === "[object Object]") {
                        if (typeof k[m] === "undefined") {
                            k[m] = {}
                        }
                        this.extend(j, k[m], l[m])
                    } else {
                        k[m] = l[m]
                    }
                }
            }
            return k
        },
        clone: function(k) {
            var l, j;
            if (null === k || "object" !== typeof k) {
                return k
            }
            if (k instanceof Object) {
                l = (Object.prototype.toString.call(k) === "[object Array]") ? [] : {};
                for (j in k) {
                    if (Object.prototype.hasOwnProperty.call(k, j)) {
                        l[j] = this.clone(k[j])
                    }
                }
                return l
            }
        },
        parseVersion: function(l) {
            var m, j, k = [];
            if (!l || !l.length) {
                return k
            }
            k = l.split(".");
            for (m = 0,
            j = k.length; m < j; m += 1) {
                k[m] = /^[0-9]+$/.test(k[m]) ? parseInt(k[m], 10) : k[m]
            }
            return k
        },
        isEqual: function(l, k) {
            var m, n, p, o, j;
            if (l === k) {
                return true
            }
            if (typeof l !== typeof k) {
                return false
            }
            if (l instanceof Object && k instanceof Object) {
                if (Object.prototype.toString.call(l) === "[object Array]" && Object.prototype.toString.call(k) === "[object Array]") {
                    if (l.length !== k.length) {
                        return false
                    }
                    for (m = 0,
                    j = l.length; m < j; m += 1) {
                        if (!this.isEqual(l[m], k[m])) {
                            return false
                        }
                    }
                    return true
                }
                if (Object.prototype.toString.call(l) === "[object Object]" && Object.prototype.toString.call(k) === "[object Object]") {
                    for (m = 0; m < 2; m += 1) {
                        for (p in l) {
                            if (l.hasOwnProperty(p)) {
                                if (!k.hasOwnProperty(p)) {
                                    return false
                                }
                                n = this.isEqual(l[p], k[p]);
                                if (!n) {
                                    return false
                                }
                            }
                        }
                        o = l;
                        l = k;
                        k = o
                    }
                    return true
                }
            }
            return false
        },
        createObject: (function() {
            var j = null
              , k = null;
            if (typeof Object.create === "function") {
                j = Object.create
            } else {
                k = function() {}
                ;
                j = function(l) {
                    if (typeof l !== "object" && typeof l !== "function") {
                        throw new TypeError("Object prototype need to be an object!")
                    }
                    k.prototype = l;
                    return new k()
                }
            }
            return j
        }()),
        access: function(o, m) {
            var n = m || window, k, l, j;
            if (typeof o !== "string" || (typeof n !== "object" && n !== null)) {
                return
            }
            k = o.split(".");
            for (l = 0,
            j = k.length; l < j; l += 1) {
                if (l === 0 && k[l] === "window") {
                    continue
                }
                if (!Object.prototype.hasOwnProperty.call(n, k[l])) {
                    return
                }
                n = n[k[l]];
                if (l < (j - 1) && !(n instanceof Object)) {
                    return
                }
            }
            return n
        },
        isNumeric: function(j) {
            var k = false;
            if (g.isUndefOrNull(j) || !(/\S/.test(j))) {
                return k
            }
            k = !isNaN(j * 2);
            return k
        },
        isUpperCase: function(j) {
            return j === j.toUpperCase() && j !== j.toLowerCase()
        },
        isLowerCase: function(j) {
            return j === j.toLowerCase() && j !== j.toUpperCase()
        },
        extractResponseHeaders: function(l) {
            var n = {}, k, j, m = null;
            if (!l || !l.length) {
                l = []
            } else {
                l = l.split("\n")
            }
            for (k = 0,
            j = l.length; k < j; k += 1) {
                m = l[k].split(": ");
                if (m.length === 2) {
                    n[m[0]] = m[1]
                }
            }
            return n
        },
        getTargetState: function(q) {
            var j = {
                a: ["innerText", "href"],
                input: {
                    range: ["maxValue:max", "value"],
                    checkbox: ["value", "checked"],
                    radio: ["value", "checked"],
                    image: ["src"]
                },
                select: ["value"],
                button: ["value", "innerText"],
                textarea: ["value"]
            }
              , l = this.getTagName(q)
              , r = j[l] || null
              , m = null
              , k = null
              , n = 0
              , p = 0
              , o = null
              , s = "";
            if (r !== null) {
                if (Object.prototype.toString.call(r) === "[object Object]") {
                    r = r[q.type] || ["value"]
                }
                k = {};
                for (s in r) {
                    if (r.hasOwnProperty(s)) {
                        if (r[s].indexOf(":") !== -1) {
                            o = r[s].split(":");
                            k[o[0]] = q[o[1]]
                        } else {
                            if (r[s] === "innerText") {
                                k[r[s]] = this.trim(q.innerText || q.textContent)
                            } else {
                                k[r[s]] = q[r[s]]
                            }
                        }
                    }
                }
            }
            if (l === "select" && q.options && !isNaN(q.selectedIndex)) {
                k.index = q.selectedIndex;
                if (k.index >= 0 && k.index < q.options.length) {
                    m = q.options[q.selectedIndex];
                    k.value = m.getAttribute("value") || m.getAttribute("label") || m.text || m.innerText;
                    k.text = m.text || m.innerText
                }
            }
            return k
        },
        getDocument: function(j) {
            var k = j;
            if (j && j.nodeType !== 9) {
                if (j.getRootNode) {
                    k = j.getRootNode()
                } else {
                    k = j.ownerDocument || j.document
                }
            }
            return k
        },
        getWindow: function(k) {
            try {
                if (k.self !== k) {
                    var j = g.getDocument(k);
                    return (!g.isUndefOrNull(j.defaultView)) ? (j.defaultView) : (j.parentWindow)
                }
            } catch (l) {
                k = null
            }
            return k
        },
        getOriginAndPath: function(j) {
            var l = {}, k;
            j = j || window.location;
            if (j.origin) {
                l.origin = j.origin
            } else {
                l.origin = (j.protocol || "") + "//" + (j.host || "")
            }
            l.path = (j.pathname || "").split(";", 1)[0];
            if (l.origin.indexOf("file://") > -1) {
                k = l.path.match(/(.*)(\/.*app.*)/);
                if (k !== null) {
                    l.path = k[2]
                }
            }
            return l
        },
        getQueryString: function(q) {
            try {
                q = q.replace("?", "") + "";
                if (q.length) {
                    var l = q.split("&");
                    var m = {};
                    var p, o, j;
                    for (var k = 0; k < l.length; k++) {
                        p = (l[k]).split("=");
                        o = decodeURIComponent(p[0]);
                        if (o.length === 0) {
                            continue
                        }
                        j = decodeURIComponent(p[1]);
                        if (typeof m[o] === "undefined") {
                            m[o] = j
                        } else {
                            if (m[o]instanceof Array) {
                                m[o].push(j)
                            } else {
                                m[o] = [m[o], j]
                            }
                        }
                    }
                    return m
                }
            } catch (n) {
                return ""
            }
        },
        getIFrameWindow: function(l) {
            var j = null;
            if (!l) {
                return j
            }
            try {
                j = l.contentWindow || (l.contentDocument ? l.contentDocument.parentWindow : null)
            } catch (k) {}
            return j
        },
        getTagName: function(k) {
            var j = "";
            if (g.isUndefOrNull(k)) {
                return j
            }
            if (k === document || k.nodeType === 9) {
                j = "document"
            } else {
                if (k === window || k === window.window) {
                    j = "window"
                } else {
                    if (typeof k === "string") {
                        j = k.toLowerCase()
                    } else {
                        if (k.tagName) {
                            j = k.tagName.toLowerCase()
                        } else {
                            if (k.nodeName) {
                                j = k.nodeName.toLowerCase()
                            } else {
                                j = ""
                            }
                        }
                    }
                }
            }
            return j
        },
        getDcType: function(m) {
            var j, l, k = "";
            if (g.isUndefOrNull(m) || !m.type) {
                return k
            }
            j = m.type.toLowerCase();
            l = j + ":";
            if (m.subType) {
                l += m.subType.toLowerCase()
            }
            k = h[l] || j;
            return k
        },
        isIFrameDescendant: function(k) {
            var j = g.getWindow(k);
            return (j ? (j != DCX._getLocalTop()) : false)
        },
        getOrientationMode: function(j) {
            var k = "INVALID";
            if (typeof j !== "number") {
                return k
            }
            switch (j) {
            case 0:
            case 180:
            case 360:
                k = "PORTRAIT";
                break;
            case 90:
            case -90:
            case 270:
                k = "LANDSCAPE";
                break;
            default:
                k = "UNKNOWN";
                break
            }
            return k
        },
        clog: (function(j) {
            return function() {}
        }(window)),
        trim: function(j) {
            if (!j || !j.toString) {
                return j
            }
            return j.toString().replace(/^\s+|\s+$/g, "")
        },
        ltrim: function(j) {
            if (!j || !j.toString) {
                return j
            }
            return j.toString().replace(/^\s+/, "")
        },
        rtrim: function(j) {
            if (!j || !j.toString) {
                return j
            }
            return j.toString().replace(/\s+$/, "")
        },
        setCookie: function(t, k, r, v, o, j) {
            var p, q, n, m, l = "", u, s = j ? ";secure" : "";
            if (!t) {
                return
            }
            t = encodeURIComponent(t);
            k = encodeURIComponent(k);
            n = (o || location.hostname).split(".");
            u = ";path=" + (v || "/");
            if (typeof r === "number") {
                if (this.isIE) {
                    m = new Date();
                    m.setTime(m.getTime() + (r * 1000));
                    l = ";expires=" + m.toUTCString()
                } else {
                    l = ";max-age=" + r
                }
            }
            for (q = n.length,
            p = (q === 1 ? 1 : 2); p <= q; p += 1) {
                document.cookie = t + "=" + k + ";domain=" + n.slice(-p).join(".") + u + l + s;
                if (this.getCookieValue(t) === k) {
                    break
                }
                if (q === 1) {
                    document.cookie = t + "=" + k + u + l + s
                }
            }
        },
        getCookieValue: function(p, r) {
            var m, n, l, q, k = null, j;
            try {
                r = r || document.cookie;
                if (!p || !p.toString) {
                    return null
                }
                p += "=";
                j = p.length;
                q = r.split(";");
                for (m = 0,
                n = q.length; m < n; m += 1) {
                    l = q[m];
                    l = g.ltrim(l);
                    if (l.indexOf(p) === 0) {
                        k = l.substring(j, l.length);
                        break
                    }
                }
            } catch (o) {
                k = null
            }
            return k
        },
        getQueryStringValue: function(o, r, k) {
            var n, m, s, l = null, p;
            try {
                k = k || window.location.search;
                s = k.length;
                if (!o || !o.toString || !s) {
                    return null
                }
                r = r || "&";
                k = r + k.substring(1);
                o = r + o + "=";
                n = k.indexOf(o);
                if (n !== -1) {
                    p = n + o.length;
                    m = k.indexOf(r, p);
                    if (m === -1) {
                        m = s
                    }
                    l = decodeURIComponent(k.substring(p, m))
                }
            } catch (q) {}
            return l
        },
        addEventListener: (function() {
            if (window.addEventListener) {
                return function(k, j, l) {
                    k.addEventListener(j, l, false)
                }
            }
            return function(k, j, l) {
                k.attachEvent("on" + j, l)
            }
        }()),
        matchTarget: function(u, q) {
            var o, m, n, t = -1, s, k, l, p, r, v = document;
            if (!u || !q) {
                return t
            }
            if (!this.browserService || !this.browserBaseService) {
                this.browserService = DCX.getService("browser");
                this.browserBaseService = DCX.getService("browserBase")
            }
            if (q.idType === -2) {
                n = this.browserBaseService.getNodeFromID(q.id, q.idType);
                v = this.getDocument(n)
            }
            for (o = 0,
            p = u.length; o < p && t === -1; o += 1) {
                r = u[o];
                if (typeof r === "string") {
                    s = this.browserService.queryAll(r, v);
                    for (m = 0,
                    k = s ? s.length : 0; m < k; m += 1) {
                        if (s[m]) {
                            l = this.browserBaseService.ElementData.prototype.examineID(s[m]);
                            if (l.idType === q.idType && l.id === q.id) {
                                t = o;
                                break
                            }
                        }
                    }
                } else {
                    if (r && r.id && r.idType && q.idType && q.idType.toString() === r.idType.toString()) {
                        switch (typeof r.id) {
                        case "string":
                            if (r.id === q.id) {
                                t = o
                            }
                            break;
                        case "object":
                            if (!r.cRegex) {
                                r.cRegex = new RegExp(r.id.regex,r.id.flags)
                            }
                            r.cRegex.lastIndex = 0;
                            if (r.cRegex.test(q.id)) {
                                t = o
                            }
                            break
                        }
                    }
                }
            }
            return t
        },
        WeakMap: (function() {
            function j(n, m) {
                var l, k;
                n = n || [];
                for (l = 0,
                k = n.length; l < k; l += 1) {
                    if (n[l][0] === m) {
                        return l
                    }
                }
                return -1
            }
            return function() {
                var k = [];
                this.set = function(m, n) {
                    var l = j(k, m);
                    k[l > -1 ? l : k.length] = [m, n]
                }
                ;
                this.get = function(m) {
                    var l = k[j(k, m)];
                    return (l ? l[1] : undefined)
                }
                ;
                this.clear = function() {
                    k = []
                }
                ;
                this.has = function(l) {
                    return (j(k, l) >= 0)
                }
                ;
                this.remove = function(m) {
                    var l = j(k, m);
                    if (l >= 0) {
                        k.splice(l, 1)
                    }
                }
                ;
                this["delete"] = this.remove
            }
        }())
    };
    if (typeof DCX === "undefined" || !DCX) {
        window.DCX = {}
    }
    DCX.utils = g
}());
(function() {
    DCX.EventTarget = function() {
        this._handlers = {}
    }
    ;
    DCX.EventTarget.prototype = {
        constructor: DCX.EventTarget,
        publish: function(c, f) {
            var d = 0
              , a = 0
              , b = this._handlers[c]
              , e = {
                type: c,
                data: f
            };
            if (typeof b !== "undefined") {
                for (a = b.length; d < a; d += 1) {
                    b[d](e)
                }
            }
        },
        subscribe: function(a, b) {
            if (!this._handlers.hasOwnProperty(a)) {
                this._handlers[a] = []
            }
            this._handlers[a].push(b)
        },
        unsubscribe: function(c, e) {
            var d = 0
              , a = 0
              , b = this._handlers[c];
            if (b) {
                for (a = b.length; d < a; d += 1) {
                    if (b[d] === e) {
                        b.splice(d, 1);
                        return
                    }
                }
            }
        }
    }
}());
DCX.ModuleContext = (function() {
    var a = ["broadcast", "getConfig:getModuleConfig", "listen", "post", "getXPathFromNode", "performDOMCapture", "performFormCompletion", "isInitialized", "getStartTime", "normalizeUrl"];
    return function(f, d) {
        var h = {}
          , g = 0
          , b = a.length
          , j = null
          , e = null
          , c = null;
        for (g = 0; g < b; g += 1) {
            j = a[g].split(":");
            if (j.length > 1) {
                c = j[0];
                e = j[1]
            } else {
                c = j[0];
                e = j[0]
            }
            h[c] = (function(i) {
                return function() {
                    var k = d.utils.convertToArray(arguments);
                    k.unshift(f);
                    return d[i].apply(d, k)
                }
            }(e))
        }
        h.utils = d.utils;
        return h
    }
}());
DCX.addService("config", function(a) {
    function d(f, e) {
        a.utils.extend(true, f, e);
        c.publish("configupdated", c.getConfig())
    }
    var b = {
        core: {},
        modules: {},
        services: {}
    }
      , c = a.utils.extend(false, a.utils.createObject(new DCX.EventTarget()), {
        getConfig: function() {
            return b
        },
        updateConfig: function(e) {
            d(b, e)
        },
        getCoreConfig: function() {
            return b.core
        },
        updateCoreConfig: function(e) {
            d(b.core, e)
        },
        getServiceConfig: function(e) {
            return b.services[e] || {}
        },
        updateServiceConfig: function(f, e) {
            if (typeof b.services[f] === "undefined") {
                b.services[f] = {}
            }
            d(b.services[f], e)
        },
        getModuleConfig: function(e) {
            return b.modules[e] || {}
        },
        updateModuleConfig: function(f, e) {
            if (typeof b.modules[f] === "undefined") {
                b.modules[f] = {}
            }
            d(b.modules[f], e)
        },
        destroy: function() {
            b = {
                core: {},
                modules: {},
                services: {}
            }
        }
    });
    return c
});
DCX.addService("queue", function(q) {
    var K = q.utils
      , k = null
      , i = {}
      , F = 1500000
      , p = q.getService("ajax")
      , c = q.getService("browser")
      , e = q.getService("encoder")
      , u = q.getService("serializer")
      , D = q.getService("config")
      , r = q.getService("message")
      , z = null
      , m = {}
      , H = true
      , h = true
      , y = {
        5: {
            limit: 300,
            count: 0
        },
        6: {
            limit: 400,
            count: 0
        }
    }
      , d = []
      , B = false
      , t = (function() {
        var Q = {};
        function T(U) {
            return typeof Q[U] !== "undefined"
        }
        function M(U, V) {
            if (!T(U)) {
                Q[U] = {
                    lastOffset: 0,
                    data: [],
                    queueId: U,
                    url: V.url,
                    eventThreshold: V.eventThreshold,
                    sizeThreshold: V.sizeThreshold || 0,
                    timerInterval: V.timerInterval,
                    size: -1,
                    serializer: V.serializer,
                    encoder: V.encoder,
                    crossDomainEnabled: !!V.crossDomainEnabled,
                    crossDomainIFrame: V.crossDomainIFrame
                }
            }
            return Q[U]
        }
        function O(U) {
            if (T(U)) {
                delete Q[U]
            }
        }
        function R(U) {
            if (T(U)) {
                return Q[U]
            }
            return null
        }
        function P(V) {
            var U = R(V);
            if (U !== null) {
                U.data = []
            }
        }
        function S(U) {
            var V = null;
            if (T(U)) {
                V = R(U).data;
                P(U)
            }
            return V
        }
        function N(W, Y) {
            var U = null
              , X = null
              , aa = window.dcBridge
              , V = window.iOSJSONShuttle;
            try {
                X = u.serialize(Y)
            } catch (Z) {
                X = "Serialization failed: " + (Z.name ? Z.name + " - " : "") + Z.message;
                Y = {
                    error: X
                }
            }
            if ((typeof aa !== "undefined") && (typeof aa.addMessage === "function")) {
                aa.addMessage(X)
            } else {
                if ((typeof V !== "undefined") && (typeof V === "function")) {
                    V(X)
                } else {
                    if (T(W)) {
                        U = R(W);
                        U.data.push(Y);
                        U.data = q.redirectQueue(U.data);
                        if (U.sizeThreshold) {
                            X = u.serialize(U.data);
                            U.size = X.length
                        }
                        return U.data.length
                    }
                }
            }
            return 0
        }
        return {
            exists: T,
            add: M,
            remove: O,
            reset: function() {
                Q = {}
            },
            get: R,
            clear: P,
            flush: S,
            push: N
        }
    }());
    function n(M) {
        if (M && M.id) {
            K.extend(true, d[M.id - 1], {
                xhrRspEnd: r.createMessage({
                    type: 0
                }).offset,
                success: M.success,
                statusCode: M.statusCode,
                statusText: M.statusText
            })
        }
    }
    function w() {
        return window.location.pathname
    }
    function A(O, S, P, R) {
        var M = t.get(O)
          , Q = {
            name: S,
            value: P
        }
          , N = null;
        if (typeof S !== "string" || typeof P !== "string") {
            return
        }
        if (!M.headers) {
            M.headers = {
                once: [],
                always: []
            }
        }
        N = !!R ? M.headers.always : M.headers.once;
        N.push(Q)
    }
    function g(O, R) {
        var Q = 0
          , N = 0
          , M = t.get(O)
          , S = M.headers
          , P = null;
        R = R || {};
        function T(V, X) {
            var W = 0
              , U = 0
              , Y = null;
            for (W = 0,
            U = V.length; W < U; W += 1) {
                Y = V[W];
                X[Y.name] = Y.value
            }
        }
        if (S) {
            P = [S.always, S.once];
            for (Q = 0,
            N = P.length; Q < N; Q += 1) {
                T(P[Q], R)
            }
        }
        return R
    }
    function o(N) {
        var M = null
          , O = null;
        if (!t.exists(N)) {
            throw new Error("Queue: " + N + " does not exist!")
        }
        M = t.get(N);
        O = M ? M.headers : null;
        if (O) {
            O.once = []
        }
    }
    function l() {
        var N = 0, M, P, O = q.provideRequestHeaders();
        if (O && O.length) {
            for (N = 0,
            M = O.length; N < M; N += 1) {
                P = O[N];
                A("DEFAULT", P.name, P.value, P.recurring)
            }
        }
        return N
    }
    function J(Q) {
        var P, M, O = [], N = "";
        if (!Q || !Q.length) {
            return N
        }
        for (P = 0,
        M = Q.length; P < M; P += 1) {
            O[Q[P].type] = true
        }
        for (P = 0,
        M = O.length; P < M; P += 1) {
            if (O[P]) {
                if (N) {
                    N += ","
                }
                N += P
            }
        }
        return N
    }
    function j(ab, R) {
        var V = t.get(ab), ad = V.url ? t.flush(ab) : null, O = ad ? ad.length : 0, Q = {
            "Content-Type": "application/json",
            "X-PageId": q.getPageId(),
            "X-Discover": "device (UIC) Lib/12.2.0",
            "X-DiscoverType": "GUI",
            "X-Discover-Page-Url": w(),
            "X-Discover-SyncXHR": (!!R).toString()
        }, P = null, M = r.createMessage({
            type: 0
        }).offset, Z = V.serializer || "json", N = V.encoder, X, S, U, ac = q.getState() === "unloading", aa = null, ae = k.dcxWorker || null;
        if (!O || !V) {
            return
        }
        U = M - ad[O - 1].offset;
        if (U > (F + 60000)) {
            return
        }
        V.lastOffset = ad[O - 1].offset;
        Q["X-Discover-MessageTypes"] = J(ad);
        ad = r.wrapMessages(ad);
        if (k.xhrLogging) {
            P = ad.serialNumber;
            d[P - 1] = {
                serialNumber: P,
                xhrReqStart: M
            };
            ad.log = {
                xhr: d
            }
        }
        l();
        g(ab, Q);
        function T() {
            var af = {
                state: false,
                error: "Failed to load worker file."
            };
            DCX.logCustomEvent("workerStatus", af, 6);
            k.dcxWorker = null;
            ae = null;
            DCX.setWorkerStatus(false)
        }
        function W() {
            return new Promise(function(ag, af) {
                ae.onerror = function(ah) {
                    T()
                }
                ;
                ae.onmessageerror = function(ah) {
                    T()
                }
                ;
                ae.onmessage = function(ai) {
                    var ah;
                    ah = ai.data;
                    n(ah)
                }
            }
            )
        }
        if (ae && !DCX.getWorkerStatus()) {
            W().then(function() {
                console.log("Worker successfully loaded");
                workerLoaded = true;
                DCX.setWorkerStatus(true)
            })
        }
        if (ae && !(R || ac)) {
            ae.postMessage({
                id: P,
                url: V.url,
                headers: Q,
                data: ad,
                isUnloading: ac
            })
        } else {
            if (Z) {
                ad = u.serialize(ad, Z)
            }
            if (N) {
                S = e.encode(ad, N);
                if (S) {
                    if (S.data && !S.error) {
                        ad = S.data;
                        Q["Content-Encoding"] = S.encoding
                    } else {
                        ad = S.error
                    }
                }
            }
            if (V.crossDomainEnabled) {
                aa = K.getIFrameWindow(V.crossDomainIFrame);
                if (!aa) {
                    return
                }
                X = {
                    request: {
                        id: P,
                        url: V.url,
                        async: !R,
                        headers: Q,
                        data: ad
                    }
                };
                if (!K.isIE && typeof window.postMessage === "function") {
                    aa.postMessage(X, V.crossDomainIFrame.src)
                } else {
                    try {
                        aa.sendMessage(X)
                    } catch (Y) {
                        return
                    }
                }
            } else {
                p.sendRequest({
                    id: P,
                    oncomplete: n,
                    url: V.url,
                    async: !R,
                    isUnloading: ac,
                    headers: Q,
                    data: ad
                })
            }
        }
        o(ab)
    }
    function I(Q) {
        var N = null
          , P = k.queues
          , O = 0;
        try {
            if (P && P.length && P.length > 0) {
                for (O = 0; O < P.length; O += 1) {
                    N = P[O];
                    j(N.qid, Q)
                }
                return true
            }
        } catch (M) {
            return false
        }
    }
    function L(O, T) {
        var V, P = r.createMessage(T), U = t.get(O), ac, M, R;
        var aa = P.screenViewPath
          , Q = q.getCoreConfig()
          , ab = Q && Q.screenViewAllowlist || []
          , S = Q && Q.screenViewBlocklist || []
          , N = Q && Q.ignoreEvent || [];
        if (ab && ab.length) {
            var Y = DCX.isScreenviewInAccessList(aa, ab);
            if (!Y) {
                return
            }
        }
        if (S && S.length) {
            var X = DCX.isScreenviewInAccessList(aa, S);
            if (X) {
                return
            }
        }
        if (P.type === 4 && P.target && P.event) {
            var Z = N.some(function(ah) {
                var ag = ah.type === P.event.type
                  , ad = ah.attr && ah.attr.split("=")
                  , af = ad[0]
                  , ai = ad[1]
                  , ae = af && P.target[af] && new RegExp(ai).test(P.target[af]);
                return ag && (ae)
            });
            if (P.target.ignore) {
                Z = true
            }
            if (Z) {
                return
            }
        }
        V = U.data.length;
        if (V) {
            M = P.offset - U.data[V - 1].offset;
            if (M > F) {
                t.flush(O);
                var W = {
                    destroyedReason: "UIC destroyed while  Safety check to ensure the data to be added is not stale beyond the inactivity timeout.",
                    destroyedBy: "queueManager"
                };
                DCX.setState("addToQueue", W);
                q.destroy();
                return
            }
        }
        V = t.push(O, P);
        ac = U.size;
        if ((V >= U.eventThreshold || ac >= U.sizeThreshold) && H && q.getState() !== "unloading") {
            R = q.getCurrentWebEvent();
            if (R.type === "click" && q.getState() == "unloading" && V > 0) {
                if (h) {
                    h = false;
                    window.setTimeout(function() {
                        if (t.exists(O)) {
                            j(O);
                            h = true
                        }
                    }, 500)
                }
            } else {
                j(O)
            }
        }
    }
    function a(O) {
        var M, N = false;
        if (!O || !O.type) {
            return true
        }
        M = y[O.type];
        if (M) {
            M.count += 1;
            if (M.count > M.limit) {
                N = true;
                if (M.count === M.limit + 1) {
                    L("DEFAULT", {
                        type: 16,
                        dataLimit: {
                            messageType: O.type,
                            maxCount: M.limit
                        }
                    })
                }
            }
        }
        return N
    }
    function G(O) {
        var N = null
          , R = k.queues
          , Q = ""
          , P = 0
          , M = 0;
        for (P = 0; P < R.length; P += 1) {
            N = R[P];
            if (N && N.modules) {
                for (M = 0; M < N.modules.length; M += 1) {
                    Q = N.modules[M];
                    if (Q === O) {
                        return N.qid
                    }
                }
            }
        }
        return z.qid
    }
    function x(O, M) {
        m[O] = window.setTimeout(function N() {
            j(O);
            m[O] = window.setTimeout(N, M)
        }, M)
    }
    function f(N) {
        var M = false;
        if (N && m[N]) {
            window.clearTimeout(m[N]);
            delete m[N];
            M = true
        }
        return M
    }
    function v() {
        var M = 0;
        for (M in m) {
            if (m.hasOwnProperty(M)) {
                f(M)
            }
        }
        m = {}
    }
    function b(N) {
        var M;
        if (!N) {
            return
        }
        if (f(N)) {
            M = t.get(N);
            if (M.timerInterval) {
                x(N, M.timerInterval)
            }
        }
    }
    function E(M) {}
    function s(M) {
        k = M;
        i = q.getCoreConfig();
        F = K.getValue(i, "inactivityTimeout", 600000);
        K.forEach(k.queues, function(N, O) {
            var P = null;
            if (N.qid === "DEFAULT") {
                z = N
            }
            if (N.crossDomainEnabled) {
                P = c.query(N.crossDomainFrameSelector);
                if (!P) {
                    q.fail("Cross domain iframe not found")
                }
            }
            t.add(N.qid, {
                url: N.endpoint,
                eventThreshold: N.maxEvents,
                sizeThreshold: N.maxSize || 0,
                serializer: N.serializer,
                encoder: N.encoder,
                timerInterval: N.timerInterval || 0,
                crossDomainEnabled: N.crossDomainEnabled || false,
                crossDomainIFrame: P
            });
            if (typeof N.timerInterval !== "undefined" && N.timerInterval > 0) {
                x(N.qid, N.timerInterval)
            }
        });
        D.subscribe("configupdated", E);
        B = true
    }
    function C() {
        if (H) {
            I(!k.asyncReqOnUnload)
        }
        D.unsubscribe("configupdated", E);
        v();
        t.reset();
        k = null;
        z = null;
        B = false
    }
    return {
        init: function() {
            if (!B) {
                s(D.getServiceConfig("queue") || {})
            } else {}
        },
        destroy: function() {
            C()
        },
        _getQueue: function(M) {
            return t.get(M).data
        },
        setAutoFlush: function(M) {
            if (M === true) {
                H = true
            } else {
                H = false
            }
        },
        flush: function(M) {
            M = M || z.qid;
            if (!t.exists(M)) {
                throw new Error("Queue: " + M + " does not exist!")
            }
            j(M)
        },
        flushAll: function(M) {
            return I(!!M)
        },
        post: function(N, O, M) {
            if (!q.isInitialized()) {
                return
            }
            M = M || G(N);
            if (!t.exists(M)) {
                return
            }
            if (!a(O)) {
                L(M, O)
            }
        },
        resetFlushTimer: function(M) {
            M = M || z.qid;
            if (!t.exists(M)) {
                return
            }
            b(M)
        }
    }
});
DCX.addService("browserBase", function(r) {
    var g, L = r.utils, h = {
        optgroup: true,
        option: true,
        nobr: true
    }, p = {}, e, m = null, A, w, f, q, F = false;
    function s() {
        e = r.getService("config");
        m = r.getService("serializer");
        A = e ? e.getServiceConfig("browser") : {};
        w = A.hasOwnProperty("blacklist") ? A.blacklist : [];
        f = A.hasOwnProperty("customid") ? A.customid : []
    }
    function b() {
        s();
        if (e) {
            e.subscribe("configupdated", s)
        }
        F = true
    }
    function G() {
        if (e) {
            e.unsubscribe("configupdated", s)
        }
        F = false
    }
    function v(P) {
        var N, M, O;
        if (!P || !P.id || typeof P.id !== "string") {
            return false
        }
        for (N = 0,
        M = w.length; N < M; N += 1) {
            if (typeof w[N] === "string") {
                if (P.id === w[N]) {
                    return false
                }
            } else {
                if (typeof w[N] === "object") {
                    if (!w[N].cRegex) {
                        w[N].cRegex = new RegExp(w[N].regex,w[N].flags)
                    }
                    w[N].cRegex.lastIndex = 0;
                    if (w[N].cRegex.test(P.id)) {
                        return false
                    }
                }
            }
        }
        return true
    }
    function o(O, P) {
        var M = {
            type: null,
            subType: null
        }, N;
        if (!O) {
            return M
        }
        N = O.type;
        switch (N) {
        case "focusin":
            N = "focus";
            break;
        case "focusout":
            N = "blur";
            break;
        default:
            break
        }
        M.type = N;
        return M
    }
    function y(N) {
        var M = {
            type: null,
            subType: null
        };
        if (!N) {
            return M
        }
        M.type = L.getTagName(N);
        M.subType = N.type || null;
        return M
    }
    function c(M, O, N) {
        var S = {
            HTML_ID: "-1",
            XPATH_ID: "-2",
            ATTRIBUTE_ID: "-3"
        }, R, P = null, Q;
        if (!M || !O) {
            return P
        }
        R = N || window.document;
        O = O.toString();
        if (O === S.HTML_ID) {
            if (R.getElementById) {
                P = R.getElementById(M)
            } else {
                if (R.querySelector) {
                    P = R.querySelector("#" + M)
                }
            }
        } else {
            if (O === S.ATTRIBUTE_ID) {
                Q = M.split("=");
                if (R.querySelector) {
                    P = R.querySelector("[" + Q[0] + '="' + Q[1] + '"]')
                }
            } else {
                if (O === S.XPATH_ID) {
                    P = p.xpath(M, R)
                }
            }
        }
        return P
    }
    q = (function() {
        var M = {
            nobr: true,
            p: true
        };
        return function(S, P) {
            var V, T, ac = document.documentElement, U = false, aa = null, R = null, Y = null, Z = [], N, X = true, Q = r._getLocalTop(), O = "", W = false, ad;
            while (X) {
                X = false;
                O = L.getTagName(S);
                if (O && !W) {
                    if (M[O]) {
                        S = S.parentNode;
                        X = true;
                        continue
                    }
                }
                for (U = v(S); S && [1, 9].indexOf(S.nodeType) > -1 && S !== document && (P || !U); U = v(S)) {
                    Y = S.parentNode;
                    if (!Y) {
                        R = L.getWindow(S);
                        if (!R) {
                            return Z
                        }
                        Y = (R !== Q) ? R.frameElement : ac
                    }
                    aa = Y.firstChild;
                    if (!aa) {
                        Z.push(["XPath Error(1)"]);
                        S = null;
                        break
                    }
                    for (T = 0; aa; aa = aa.nextSibling) {
                        if (aa.nodeType === 1 && L.getTagName(aa) === O) {
                            if (aa === S) {
                                N = [O, T];
                                if (W) {
                                    N.push("h");
                                    W = false
                                }
                                Z[Z.length] = N;
                                break
                            }
                            T += 1
                        }
                    }
                    if (Y.nodeType === 11) {
                        S = Y.host;
                        W = true
                    } else {
                        S = Y
                    }
                    O = L.getTagName(S)
                }
                if (U && !P) {
                    N = [S.id];
                    if (W) {
                        if (!N[1]) {
                            N.push(0)
                        }
                        N.push("h");
                        W = false
                    }
                    Z[Z.length] = N;
                    if (L.isIFrameDescendant(S)) {
                        X = true;
                        S = L.getWindow(S).frameElement
                    } else {
                        try {
                            if (!ac.contains(S)) {
                                X = true;
                                ad = S.getRootNode();
                                S = ad.host;
                                W = true
                            }
                        } catch (ab) {}
                    }
                }
            }
            return Z.reverse()
        }
    }());
    function C(M) {
        var N = "null";
        if (!M || !M.length) {
            return N
        }
        N = m.serialize(M, "json");
        return N
    }
    function u(O, N, Q) {
        var P, M;
        M = q(O, !!N);
        if (Q) {
            P = M
        } else {
            P = C(M)
        }
        return P
    }
    function K(N) {
        var O = {
            left: -1,
            top: -1
        }, M;
        N = N || document;
        M = N.documentElement || N.body.parentNode || N.body;
        O.left = Math.round((typeof window.pageXOffset === "number") ? window.pageXOffset : M.scrollLeft);
        O.top = Math.round((typeof window.pageYOffset === "number") ? window.pageYOffset : M.scrollTop);
        return O
    }
    function J(M) {
        return M && typeof M.originalEvent !== "undefined" && typeof M.isDefaultPrevented !== "undefined" && !M.isSimulated
    }
    function j(M) {
        if (!M) {
            return null
        }
        if (M.type && M.type.indexOf("touch") === 0) {
            if (J(M)) {
                M = M.originalEvent
            }
            if (M.type === "touchstart") {
                M = M.touches[M.touches.length - 1]
            } else {
                if (M.type === "touchend") {
                    M = M.changedTouches[0]
                }
            }
        }
        return M
    }
    function t(P) {
        var S = P || window.event
          , R = document.documentElement
          , M = document.body
          , Q = false
          , O = null
          , N = 0;
        if (J(S)) {
            S = S.originalEvent
        }
        if (typeof P === "undefined" || typeof S.target === "undefined") {
            S.target = S.srcElement || window.window;
            S.timeStamp = Number(new Date());
            if (S.pageX === null || typeof S.pageX === "undefined") {
                S.pageX = S.clientX + ((R && R.scrollLeft) || (M && M.scrollLeft) || 0) - ((R && R.clientLeft) || (M && M.clientLeft) || 0);
                S.pageY = S.clientY + ((R && R.scrollTop) || (M && M.scrollTop) || 0) - ((R && R.clientTop) || (M && M.clientTop) || 0)
            }
            S.preventDefault = function() {
                this.returnValue = false
            }
            ;
            S.stopPropagation = function() {
                this.cancelBubble = true
            }
        }
        if (window.chrome && S.path !== undefined && S.type === "click") {
            if (S.path.length === undefined) {
                return S
            }
            for (N = 0; N < S.path.length; N++) {
                if (L.getTagName(S.path[N]) === "button") {
                    Q = true;
                    O = S.path[N];
                    N = S.path.length
                }
            }
            if (Q) {
                return {
                    originalEvent: S,
                    target: O,
                    srcElement: O,
                    type: S.type,
                    pageX: document.body.scrollLeft + O.getBoundingClientRect().left,
                    pageY: document.body.scrollTop + O.getBoundingClientRect().top
                }
            }
        }
        return S
    }
    function x(O) {
        var N, M, P, Q = null;
        if (!O || !O.type) {
            return null
        }
        if (O.type.indexOf("touch") === 0) {
            Q = j(O).target
        } else {
            if (typeof O.composedPath === "function") {
                P = O.composedPath();
                if (P && P.length) {
                    Q = P[0];
                    for (N = 0,
                    M = P.length; N < M; N += 1) {
                        if (L.getTagName(P[N]) === "a") {
                            Q = P[N];
                            break
                        }
                    }
                } else {
                    Q = O.target || window.window
                }
            } else {
                if (O.srcElement) {
                    Q = O.srcElement
                } else {
                    Q = O.target
                }
            }
        }
        while (Q && h[L.getTagName(Q)]) {
            if (Q.parentElement) {
                Q = Q.parentElement
            } else {
                break
            }
        }
        return Q
    }
    function I(N) {
        var Q = 0
          , P = 0
          , O = document.documentElement
          , M = document.body;
        N = j(N);
        if (N) {
            if (N.pageX || N.pageY) {
                Q = N.pageX;
                P = N.pageY
            } else {
                if (N.clientX || N.clientY) {
                    Q = N.clientX + (O ? O.scrollLeft : (M ? M.scrollLeft : 0)) - (O ? O.clientLeft : (M ? M.clientLeft : 0));
                    P = N.clientY + (O ? O.scrollTop : (M ? M.scrollTop : 0)) - (O ? O.clientTop : (M ? M.clientTop : 0))
                }
            }
        }
        return {
            x: Q,
            y: P
        }
    }
    p.xpath = function(V, X) {
        var S = null, N, U = null, Y = false, M, Q, P, O, R, W;
        if (!V) {
            return null
        }
        S = m.parse(V);
        X = X || document;
        N = X;
        if (!S) {
            return null
        }
        for (Q = 0,
        R = S.length; Q < R && N; Q += 1) {
            U = S[Q];
            Y = U.length > 1 && U[U.length - 1] === "h";
            if (U.length === 1 || (U.length === 2 && Y)) {
                if (X.getElementById) {
                    N = X.getElementById(U[0])
                } else {
                    if (X.querySelector) {
                        N = X.querySelector("#" + U[0])
                    } else {
                        N = null
                    }
                }
            } else {
                for (P = 0,
                O = -1,
                W = N.childNodes.length; P < W; P += 1) {
                    if (N.childNodes[P].nodeType === 1 && L.getTagName(N.childNodes[P]) === U[0].toLowerCase()) {
                        O += 1;
                        if (O === U[1]) {
                            N = N.childNodes[P];
                            break
                        }
                    }
                }
                if (O !== U[1]) {
                    return null
                }
            }
            if (!N) {
                return null
            }
            if (Y) {
                if (Q < R - 1) {
                    if (!N.shadowRoot) {
                        return null
                    }
                    N = N.shadowRoot;
                    X = N
                }
            }
            M = L.getTagName(N);
            if (M === "frame" || M === "iframe") {
                try {
                    N = L.getIFrameWindow(N).document;
                    X = N
                } catch (T) {}
            }
        }
        return (N === X || !N) ? null : N
    }
    ;
    function l(M, N) {
        this.x = Math.round(M || 0);
        this.y = Math.round(N || 0)
    }
    function a(N, M) {
        this.width = Math.round(N || 0);
        this.height = Math.round(M || 0)
    }
    function d(N, O) {
        var Q, M, P;
        O = x(N);
        Q = this.examineID(O);
        M = y(O);
        P = this.examinePosition(N, O);
        this.element = O;
        this.id = Q.id;
        this.idType = Q.idType;
        this.type = M.type;
        this.subType = M.subType;
        this.state = this.examineState(O);
        this.position = new l(P.x,P.y);
        this.size = new a(P.width,P.height);
        this.xPath = Q.xPath;
        this.name = Q.name
    }
    d.HTML_ID = -1;
    d.XPATH_ID = -2;
    d.ATTRIBUTE_ID = -3;
    d.prototype.examineID = function(S, N) {
        var Q = {
            id: "",
            idType: 0,
            xPath: "",
            name: ""
        }, M = f.length, P, O = document.documentElement, T;
        if (!S) {
            return Q
        }
        Q.xPath = u(S);
        Q.name = S.name;
        try {
            T = typeof O.contains === "function" ? O.contains(S) : true;
            if ((T || N) && (!L.getWindow(S) || !L.isIFrameDescendant(S))) {
                if (v(S)) {
                    Q.id = S.id;
                    Q.idType = d.HTML_ID
                } else {
                    if (f.length && S.attributes) {
                        while (M) {
                            M -= 1;
                            P = S.attributes[f[M]];
                            if (typeof P !== "undefined") {
                                Q.id = f[M] + "=" + (P.value || P);
                                Q.idType = d.ATTRIBUTE_ID
                            }
                        }
                    }
                }
            }
        } catch (R) {}
        if (!Q.id) {
            Q.id = Q.xPath;
            if (Q.id !== "null") {
                Q.idType = d.XPATH_ID
            }
        }
        return Q
    }
    ;
    d.prototype.examineState = function(M) {
        return L.getTargetState(M)
    }
    ;
    function E() {
        var N = 1, O, Q, M;
        if (document.body.getBoundingClientRect) {
            try {
                O = document.body.getBoundingClientRect()
            } catch (P) {
                return N
            }
            Q = O.right - O.left;
            M = document.body.offsetWidth;
            N = Math.round((Q / M) * 100) / 100
        }
        return N
    }
    function n(N) {
        var P, M, O, R;
        if (!N || !N.getBoundingClientRect) {
            return {
                x: 0,
                y: 0,
                width: 0,
                height: 0
            }
        }
        try {
            P = N.getBoundingClientRect();
            R = K(document)
        } catch (Q) {
            return {
                x: 0,
                y: 0,
                width: 0,
                height: 0
            }
        }
        M = {
            x: P.left + R.left,
            y: P.top + R.top,
            width: P.right - P.left,
            height: P.bottom - P.top
        };
        if (L.isIE) {
            M.x -= document.documentElement.clientLeft;
            M.y -= document.documentElement.clientTop;
            O = E();
            if (O !== 1) {
                M.x = Math.round(M.x / O);
                M.y = Math.round(M.y / O);
                M.width = Math.round(M.width / O);
                M.height = Math.round(M.height / O)
            }
        }
        return M
    }
    d.prototype.examinePosition = function(N, O) {
        var P = I(N)
          , M = n(O);
        M.x = (P.x || P.y) ? Math.round(Math.abs(P.x - M.x)) : M.width / 2;
        M.y = (P.x || P.y) ? Math.round(Math.abs(P.y - M.y)) : M.height / 2;
        return M
    }
    ;
    function H() {
        var M = (typeof window.orientation === "number") ? window.orientation : 0;
        if (L.isLandscapeZeroDegrees) {
            if (Math.abs(M) === 180 || Math.abs(M) === 0) {
                M = 90
            } else {
                if (Math.abs(M) === 90) {
                    M = 0
                }
            }
        }
        return M
    }
    function B(S) {
        var P, M, R, Q, O, N;
        if (S) {
            return S
        }
        R = r.getCoreConfig() || {};
        O = R.modules;
        S = {};
        for (N in O) {
            if (O.hasOwnProperty(N) && O[N].events) {
                for (P = 0,
                M = O[N].events.length; P < M; P += 1) {
                    Q = O[N].events[P];
                    if (Q.state) {
                        S[Q.name] = Q.state
                    }
                }
            }
        }
        return S
    }
    function i(M) {
        var N;
        g = B(g);
        if (g[M.type]) {
            N = L.getValue(M, g[M.type], null)
        }
        return N
    }
    function k(N) {
        var P, M, O;
        this.data = N.data || null;
        this.delegateTarget = N.delegateTarget || null;
        if (N.gesture || (N.originalEvent && N.originalEvent.gesture)) {
            this.gesture = N.gesture || N.originalEvent.gesture;
            this.gesture.idType = (new d(this.gesture,this.gesture.target)).idType
        }
        N = t(N);
        P = I(N);
        this.custom = false;
        this.nativeEvent = this.custom === true ? null : N;
        this.position = new l(P.x,P.y);
        this.target = new d(N,N.target);
        this.orientation = H();
        O = i(N);
        if (O) {
            this.target.state = O
        }
        this.timestamp = (new Date()).getTime();
        M = o(N, this.target);
        this.type = M.type;
        this.subType = M.subType
    }
    function D(M) {
        if (r.isInitialized()) {
            r._publishEvent(new k(M))
        } else {}
    }
    function z(R) {
        var Q = "", O = [], N, M = "", P = [];
        if (!(this instanceof z)) {
            return null
        }
        if (typeof R !== "object" || !(R && R.nodeType)) {
            this.fullXpath = "";
            this.xpath = "";
            this.fullXpathList = [];
            this.xpathList = [];
            return
        }
        if (R.nodeType === 3) {
            R = R.parentElement
        }
        P = q(R, false);
        N = P[0];
        if (P.length && (N.length === 1 || (N.length === 2 && N[1] === "h"))) {
            O = q(R, true)
        } else {
            O = L.clone(P)
        }
        this.xpath = C(P);
        this.xpathList = P;
        this.fullXpath = C(O);
        this.fullXpathList = O;
        this.applyPrefix = function(U) {
            var S, T;
            if (!(U instanceof z) || !U.fullXpathList.length) {
                return
            }
            T = U.fullXpathList[U.fullXpathList.length - 1];
            S = this.fullXpathList.shift();
            if (L.isEqual(S[0], T[0])) {
                this.fullXpathList = U.fullXpathList.concat(this.fullXpathList)
            } else {
                this.fullXpathList.unshift(S);
                return
            }
            this.fullXpath = C(this.fullXpathList);
            S = this.xpathList.shift();
            if (S.length === 1) {
                this.xpathList.unshift(S);
                return
            }
            this.xpathList = U.xpathList.concat(this.xpathList);
            this.xpath = C(this.xpathList)
        }
        ;
        this.compare = function(S) {
            if (!(S instanceof z)) {
                return 0
            }
            return (this.fullXpathList.length - S.fullXpathList.length)
        }
        ;
        this.isSame = function(S) {
            var T = false;
            if (!(S instanceof z)) {
                return T
            }
            if (this.compare(S) === 0) {
                T = (this.fullXpath === S.fullXpath)
            }
            return T
        }
        ;
        this.containedIn = function(U, T) {
            var W, V, S, X;
            if (!(U instanceof z)) {
                return false
            }
            if (U.fullXpathList.length > this.fullXpathList.length) {
                return false
            }
            for (W = 0,
            S = U.fullXpathList.length; W < S; W += 1) {
                if (!L.isEqual(U.fullXpathList[W], this.fullXpathList[W])) {
                    return false
                }
            }
            if (!T) {
                for (V = W,
                S = this.fullXpathList.length; V < S; V += 1) {
                    X = this.fullXpathList[V];
                    if (X[X.length - 1] === "h") {
                        return false
                    }
                }
            }
            return true
        }
    }
    z.prototype = (function() {
        return {}
    }());
    return {
        init: function() {
            if (!F) {
                b()
            } else {}
        },
        destroy: function() {
            G()
        },
        WebEvent: k,
        ElementData: d,
        Xpath: z,
        processDOMEvent: D,
        getNormalizedOrientation: H,
        getXPathFromNode: function(N, O, M, P) {
            return u(O, M, P)
        },
        getNodeFromID: c,
        queryDom: p
    }
});
DCX.addService("browser", function(d) {
    var m = d.utils
      , h = d.getService("config")
      , f = d.getService("browserBase")
      , n = d.getService("ajax")
      , g = null
      , c = null
      , k = h ? h.getServiceConfig("browser") : {}
      , b = m.getValue(k, "useCapture", true)
      , l = false
      , e = {
        NO_QUERY_SELECTOR: "NOQUERYSELECTOR"
    }
      , p = function(q) {
        return function(s) {
            var r = new f.WebEvent(s);
            if (s.type === "resize" || s.type === "hashchange") {
                setTimeout(function() {
                    q(r)
                }, 5)
            } else {
                q(r)
            }
        }
    }
      , a = {
        list2Array: function(s) {
            var r = s.length, q = [], t;
            if (typeof s.length === "undefined") {
                return [s]
            }
            for (t = 0; t < r; t += 1) {
                q[t] = s[t]
            }
            return q
        },
        find: function(s, r, q) {
            q = q || "css";
            return this.list2Array(this[q](s, r))
        },
        css: function(r, u) {
            var v = this
              , y = null
              , w = document.getElementsByTagName("body")[0]
              , x = k.jQueryObject ? m.access(k.jQueryObject) : window.jQuery
              , t = k.sizzleObject ? m.access(k.sizzleObject) : window.Sizzle;
            if (typeof document.querySelectorAll === "undefined") {
                v.css = function(A, z) {
                    z = z || document;
                    return v.Sizzle(A, z)
                }
                ;
                if (typeof v.Sizzle === "undefined") {
                    try {
                        if (w === t("html > body", document)[0]) {
                            v.Sizzle = t
                        }
                    } catch (s) {
                        try {
                            if (w === x(document).find("html > body").get()[0]) {
                                v.Sizzle = function(A, z) {
                                    return x(z).find(A).get()
                                }
                            }
                        } catch (q) {
                            d.fail("Neither querySelectorAll nor Sizzle was found.", e.NO_QUERY_SELECTOR)
                        }
                    }
                }
            } else {
                v.css = function(A, z) {
                    z = z || document;
                    return z.querySelectorAll(A)
                }
            }
            return v.css(r, u)
        }
    }
      , o = (function() {
        var q = new m.WeakMap();
        return {
            add: function(r) {
                var s = q.get(r) || [p(r), 0];
                s[1] += 1;
                q.set(r, s);
                return s[0]
            },
            find: function(r) {
                var s = q.get(r);
                return s ? s[0] : null
            },
            remove: function(r) {
                var s = q.get(r);
                if (s) {
                    s[1] -= 1;
                    if (s[1] <= 0) {
                        q.remove(r)
                    }
                }
            }
        }
    }());
    function j() {
        var r = k.jQueryObject ? m.access(k.jQueryObject) : window.jQuery
          , q = k.sizzleObject ? m.access(k.sizzleObject) : window.Sizzle;
        if (!document.querySelectorAll && !r && !q) {
            d.fail("querySelectorAll does not exist!", e.NO_QUERY_SELECTOR)
        }
    }
    function i() {
        a.xpath = f.queryDom.xpath;
        j();
        if (typeof document.addEventListener === "function") {
            g = function(s, q, r) {
                s.addEventListener(q, r, b)
            }
            ;
            c = function(s, q, r) {
                s.removeEventListener(q, r, b)
            }
        } else {
            if (typeof document.attachEvent !== "undefined") {
                g = function(s, q, r) {
                    s.attachEvent("on" + q, r)
                }
                ;
                c = function(s, q, r) {
                    s.detachEvent("on" + q, r)
                }
            } else {
                throw new Error("Unsupported browser")
            }
        }
        l = true
    }
    return {
        init: function() {
            if (!l) {
                i()
            } else {}
        },
        destroy: function() {
            l = false
        },
        getServiceName: function() {
            return "W3C"
        },
        query: function(t, r, q) {
            try {
                return a.find(t, r, q)[0] || null
            } catch (s) {
                return []
            }
        },
        queryAll: function(t, r, q) {
            try {
                return a.find(t, r, q)
            } catch (s) {
                return []
            }
        },
        subscribe: function(q, t, r) {
            var s = o.add(r);
            g(t, q, s)
        },
        unsubscribe: function(q, u, r) {
            var s = o.find(r);
            if (s) {
                try {
                    c(u, q, s)
                } catch (t) {}
                o.remove(r)
            }
        }
    }
});
DCX.addService("ajax", function(e) {
    var k = e.utils, i, m = false, b = false, j = false;
    function g(p) {
        var o = ""
          , n = [];
        for (o in p) {
            if (p.hasOwnProperty(o)) {
                n.push([o, p[o]])
            }
        }
        return n
    }
    function h(p) {
        var o = ""
          , n = "?";
        for (o in p) {
            if (p.hasOwnProperty(o)) {
                n += encodeURIComponent(o) + "=" + encodeURIComponent(p[o]) + "&"
            }
        }
        return n.slice(0, -1)
    }
    function l(n) {
        var p, q = false, o = h(n.headers);
        if (typeof n.data === "string") {
            p = n.data
        } else {
            p = n.data ? new Uint8Array(n.data) : ""
        }
        q = navigator.sendBeacon(n.url + o, p);
        return q
    }
    function f(o) {
        var q = o.headers || {}
          , p = o.id || 0
          , n = o.oncomplete || function() {}
        ;
        q["X-Requested-With"] = "fetch";
        window.fetch(o.url, {
            method: o.type,
            headers: q,
            body: o.data,
            mode: "cors",
            credentials: "omit",
            keepalive: o.isUnloading,
            cache: "no-store"
        }).then(function(s) {
            var r = {
                success: s.ok,
                statusCode: s.status,
                statusText: s.statusText,
                id: p
            };
            if (r.success) {
                s.json().then(function(t) {
                    r.data = t;
                    n(r)
                })["catch"](function(t) {
                    r.statusCode = 1;
                    r.statusText = t.message;
                    n(r)
                });
                n(r)
            }
        })["catch"](function(s) {
            var r = {
                success: false,
                statusCode: 2,
                statusText: s.message,
                id: p
            };
            n(r);
            o.headers["X-Requested-With"] = "";
            d(o)
        })
    }
    function a(o) {
        if (typeof o !== "function") {
            return
        }
        return function n(q) {
            var s, p, r = false;
            if (!q) {
                return
            }
            s = q.target;
            if (!s) {
                return o(q)
            }
            p = s.status;
            if (p >= 200 && p < 300) {
                r = true
            }
            o({
                headers: k.extractResponseHeaders(s.getAllResponseHeaders()),
                responseText: s.responseText,
                statusCode: p,
                statusText: s.statusText,
                id: s.id,
                success: r
            })
        }
    }
    function d(v) {
        var u = i(), o = [["X-Requested-With", "XMLHttpRequest"]], t = 0, p = typeof v.async !== "boolean" ? true : v.async, r = "", s = null, q, n;
        if (v.headers) {
            o = o.concat(g(v.headers))
        }
        if (v.contentType) {
            o.push(["Content-Type", v.contentType])
        }
        u.open(v.type.toUpperCase(), v.url, p);
        for (q = 0,
        n = o.length; q < n; q += 1) {
            r = o[q];
            if (r[0] && r[1]) {
                u.setRequestHeader(r[0], r[1])
            }
        }
        if (v.error) {
            v.error = a(v.error);
            u.addEventListener("error", v.error)
        }
        u.onreadystatechange = s = function() {
            if (u.readyState === 4) {
                u.onreadystatechange = s = function() {}
                ;
                if (v.timeout) {
                    window.clearTimeout(t)
                }
                v.oncomplete({
                    id: v.id,
                    headers: k.extractResponseHeaders(u.getAllResponseHeaders()),
                    responseText: (u.responseText || null),
                    statusCode: u.status,
                    statusText: u.statusText,
                    success: (u.status >= 200 && u.status < 300)
                });
                u = null
            }
        }
        ;
        u.send(v.data || null);
        s();
        if (v.timeout) {
            t = window.setTimeout(function() {
                if (!u) {
                    return
                }
                u.onreadystatechange = function() {}
                ;
                if (u.readyState !== 4) {
                    u.abort();
                    if (typeof v.error === "function") {
                        v.error({
                            id: v.id,
                            statusCode: u.status,
                            statusText: "timeout",
                            success: false
                        })
                    }
                }
                v.oncomplete({
                    id: v.id,
                    headers: k.extractResponseHeaders(u.getAllResponseHeaders()),
                    responseText: (u.responseText || null),
                    statusCode: u.status,
                    statusText: "timeout",
                    success: false
                });
                u = null
            }, v.timeout)
        }
    }
    function c() {
        var n = e.getServiceConfig("queue");
        if (typeof window.XMLHttpRequest !== "undefined") {
            i = function() {
                return new XMLHttpRequest()
            }
        } else {
            i = function() {
                return new ActiveXObject("Microsoft.XMLHTTP")
            }
        }
        if (n) {
            m = k.getValue(n, "useBeacon", true) && (typeof navigator.sendBeacon === "function");
            b = k.getValue(n, "useFetch", true) && (typeof window.fetch === "function")
        }
        j = true
    }
    return {
        init: function() {
            if (!j) {
                c()
            }
        },
        destroy: function() {
            j = false
        },
        sendRequest: function(n) {
            var p = true, o;
            n.type = n.type || "POST";
            if ((n.isUnloading || !n.async) && m) {
                p = false;
                o = l(n);
                if (!o) {
                    p = true
                }
            }
            if (p) {
                if (n.isUnloading && b) {
                    f(n)
                } else {
                    d(n)
                }
            }
        }
    }
});
DCX.addService("domCapture", function(b) {
    var af = b.getService("config"), j = b.getService("browserBase"), w = b.getService("browser"), ac, E, x = {
        maxMutations: 100,
        maxLength: 1000000,
        captureShadowDOM: false,
        captureFrames: false,
        removeScripts: true,
        removeComments: true,
        captureStyle: true,
        removeBase64: 50000
    }, U = {
        childList: true,
        attributes: true,
        attributeOldValue: true,
        characterData: true,
        subtree: true
    }, Q = {
        attributes: true,
        attributeOldValue: true,
        subtree: true
    }, s = (typeof window.MutationObserver !== "undefined"), T, av = U, M, H = Q, y = [], i = [], l = [], t = [], d = [], at = 0, G = 100, ar = false, F = false, A = false, am = 1, g = function() {}, ak = function() {}, u = function() {}, J = b._publishEvent, K = b.utils;
    function ap() {
        t = [];
        d = [];
        at = 0;
        ar = false
    }
    function D(az) {
        var ay, ax, aw;
        if (!az || !az.length) {
            return
        }
        az = az.sort(function(aB, aA) {
            return aB.compare(aA)
        });
        for (ay = 0; ay < az.length; ay += 1) {
            aw = az[ay];
            for (ax = ay + 1; ax < az.length; ax += 0) {
                if (az[ax].containedIn(aw)) {
                    az.splice(ax, 1)
                } else {
                    ax += 1
                }
            }
        }
    }
    function aa(ay) {
        var ax, aw;
        if (!ay) {
            return ay
        }
        for (ax = 0,
        aw = ay.length; ax < aw; ax += 1) {
            delete ay[ax].oldValue
        }
        return ay
    }
    function o(aA, ay) {
        var ax, aw, az = -1;
        if (!aA || !ay) {
            return az
        }
        for (ax = 0,
        aw = aA.length; ax < aw; ax += 1) {
            if (aA[ax].name === ay) {
                az = ax;
                break
            }
        }
        return az
    }
    function C(az, aB) {
        var ay, ax, aw, aA;
        for (ay = 0,
        ax = az.length,
        aA = false; ay < ax; ay += 1) {
            aw = az[ay];
            if (aw.name === aB.name) {
                if (aw.oldValue === aB.value) {
                    az.splice(ay, 1)
                } else {
                    aw.value = aB.value
                }
                aA = true;
                break
            }
        }
        if (!aA) {
            az.push(aB)
        }
        return az
    }
    function r(aC, aw) {
        var aB, az, ay, aD, aF, aE, aA, ax = 0;
        aC.removedNodes = aw.removedNodes.length;
        aC.addedNodes = K.convertToArray(aw.addedNodes);
        for (aB = 0,
        aD = t.length; aB < aD; aB += 1) {
            aE = t[aB];
            if (aC.isSame(aE)) {
                if (aC.removedNodes) {
                    for (az = 0; az < aw.removedNodes.length; az += 1) {
                        ay = aE.addedNodes.indexOf(aw.removedNodes[az]);
                        if (ay !== -1) {
                            aE.addedNodes.splice(ay, 1);
                            aC.removedNodes -= 1
                        }
                    }
                }
                aE.removedNodes += aC.removedNodes;
                aE.addedNodes.concat(aC.addedNodes);
                if (!aE.removedNodes && !aE.addedNodes.length) {
                    aA = false;
                    for (az = 0; az < t.length; az += 1) {
                        if (aE !== t[az] && t[az].containedIn(aE)) {
                            aA = true;
                            break
                        }
                    }
                    if (!aA) {
                        t.splice(aB, 1);
                        ax = -1
                    }
                }
                aF = true;
                break
            }
        }
        if (!aF) {
            t.push(aC);
            ax = 1
        }
        return ax
    }
    function X(ax, aB) {
        var az, ay, aw, aC = false, aA, aD;
        for (az = 0,
        aw = t.length; !aC && az < aw; az += 1) {
            aD = t[az];
            if (ax.containedIn(aD)) {
                aA = aD.addedNodes;
                for (ay = 0; ay < aA.length; ay += 1) {
                    if (aA[ay].contains && aA[ay].contains(aB)) {
                        aC = true;
                        break
                    }
                }
            }
        }
        return aC
    }
    function I(aw) {
        var ax = aw.attributeName;
        return ax === "type" && aw.oldValue === "password" && aw.target[ax] === "text"
    }
    function R(aw) {
        var ay = b.getService("config")
          , ax = ay.getServiceConfig("message");
        if (ax && ax.maskVisiblePasswords) {
            aw.target.setAttribute("dcxMaskVisiblePassword", true)
        }
    }
    function Z(aw) {
        var ax = I(aw);
        if (ax) {
            R(aw)
        }
    }
    function O(aA, aw) {
        var ay, aB, aD, az, aE, aC = null, ax = 0;
        aD = aw.attributeName;
        if (I(aw)) {
            R(aw);
            return ax
        }
        if (aD === "checked" || aD === "selected") {
            aC = j.ElementData.prototype.examineID(aw.target);
            if (ac.isPrivacyMatched(aC)) {
                return ax
            }
            aC = null
        }
        if (aD === "value") {
            aC = j.ElementData.prototype.examineID(aw.target);
            aC.currState = K.getTargetState(aw.target) || {};
            if (aC.currState.value) {
                ac.applyPrivacyToTarget(aC)
            } else {
                aC = null
            }
        }
        aA.attributes = [{
            name: aD,
            oldValue: aw.oldValue,
            value: aC ? aC.currState.value : aw.target.getAttribute(aD)
        }];
        az = aA.attributes[0];
        if (az.oldValue === az.value) {
            return ax
        }
        for (ay = 0,
        aB = d.length,
        aE = false; ay < aB; ay += 1) {
            aC = d[ay];
            if (aA.isSame(aC)) {
                aC.attributes = C(aC.attributes, az);
                if (!aC.attributes.length) {
                    d.splice(ay, 1);
                    ax = -1
                } else {
                    if (X(aA, aw.target)) {
                        d.splice(ay, 1);
                        ax = -1
                    }
                }
                aE = true;
                break
            }
        }
        if (!aE && !X(aA, aw.target)) {
            d.push(aA);
            ax = 1
        }
        return ax
    }
    function P(az) {
        var aB, aw, aA, ax, ay;
        if (!az || !az.length) {
            return
        }
        if (ar) {
            at += az.length;
            return
        }
        for (aB = 0,
        aw = az.length; aB < aw && at < G; aB += 1) {
            ax = az[aB];
            ay = new j.Xpath(ax.target);
            if (ay) {
                aA = ay.fullXpathList;
                if (aA.length && aA[0][0] === "html") {
                    switch (ax.type) {
                    case "characterData":
                    case "childList":
                        at += r(ay, ax);
                        break;
                    case "attributes":
                        at += O(ay, ax);
                        break;
                    default:
                        K.clog("Unknown mutation type: " + ax.type);
                        break
                    }
                }
            }
        }
        if (at >= G) {
            ar = true;
            at += aw - aB
        }
    }
    function k() {
        var az;
        var aB, aw, aA, ax, ay;
        az = new window.MutationObserver(function(aC) {
            if (aC) {
                if (!aC || !aC.length) {
                    return
                }
                for (aB = 0,
                aw = aC.length; aB < aw && at < G; aB += 1) {
                    ax = aC[aB];
                    ay = new j.Xpath(ax.target);
                    if (ay) {
                        aA = ay.fullXpathList;
                        if (aA.length && aA[0][0] === "html") {
                            switch (ax.type) {
                            case "attributes":
                                Z(ax);
                                break;
                            default:
                                break
                            }
                        }
                    }
                }
            }
        }
        );
        return az
    }
    function L() {
        var aw;
        aw = new window.MutationObserver(function(ax) {
            if (ax) {
                P(ax);
                K.clog("Processed [" + ax.length + "] mutation records.")
            }
        }
        );
        return aw
    }
    function h(ax) {
        var az, aw, ay, aD, aC, aB = af.getCoreConfig(), aA = af.getServiceConfig("message");
        af.subscribe("configupdated", u);
        ac = b.getService("message");
        E = ax;
        E.options = K.mixin({}, x, E.options);
        s = s && K.getValue(E, "diffEnabled", true);
        G = K.getValue(E.options, "maxMutations", 100);
        if (s) {
            av = K.getValue(E, "diffObserverConfig", U);
            T = L();
            y.push(window)
        }
        if (!s && aA.maskVisiblePasswords) {
            H = K.getValue(E, "customObserverConfig", Q);
            M = k();
            y.push(window)
        }
        for (ay in aB.modules) {
            if (aB.modules.hasOwnProperty(ay)) {
                aC = aB.modules[ay].events || [];
                for (az = 0,
                aw = aC.length; az < aw; az += 1) {
                    if (aC[az].attachToShadows) {
                        aD = aC[az].name;
                        if (l.indexOf(aD) === -1) {
                            l.push(aD)
                        }
                    }
                }
            }
        }
        A = true
    }
    function p() {
        af.unsubscribe("configupdated", u);
        if (T) {
            T.disconnect()
        }
        if (M) {
            M.disconnect()
        }
        A = false
    }
    function v() {
        var aw;
        aw = "tlt-" + K.getSerialNumber();
        return aw
    }
    function f(ay, ax, aw) {
        var aA, aC, aB, az, aE, aD = [];
        if (!ay || !ay.getElementsByTagName || !ax) {
            return aD
        }
        if (aw && aw.length === 2) {
            aC = aw[0];
            aB = aw[1]
        }
        az = ay.getElementsByTagName(ax);
        if (az && az.length) {
            for (aA = az.length - 1; aA >= 0; aA -= 1) {
                aE = az[aA];
                if (!aC) {
                    aD.push(aE)
                } else {
                    if (aE[aC] === aB) {
                        aD.push(aE)
                    }
                }
            }
        }
        return aD
    }
    function ai(aC, aA, aB) {
        var az, ay, aD, ax, aw;
        if (!aC || !aC.getElementsByTagName || !aA) {
            return
        }
        if (aB && aB.length === 2) {
            ay = aB[0];
            aD = aB[1]
        }
        ax = aC.getElementsByTagName(aA);
        if (ax && ax.length) {
            for (az = ax.length - 1; az >= 0; az -= 1) {
                aw = ax[az];
                if (!ay) {
                    aw.parentNode.removeChild(aw)
                } else {
                    if (aw[ay] === aD) {
                        aw.parentNode.removeChild(aw)
                    }
                }
            }
        }
        return aC
    }
    function al(aA, ay) {
        var az, aw, aB = f(aA, "img"), ax = new RegExp("^data:image/(.*?);base64");
        for (az = 0; az < aB.length; az++) {
            aw = aB[az];
            if (ax.test(aw.src) && (aw.src.length > ay)) {
                aw.src = "";
                aw.setAttribute("removedByDCX", true)
            }
        }
        return aA
    }
    function m(aw, ax) {
        if (aw) {
            aw = aw.replaceAll(/url\(["']?data:(application\/x-font-[^;]+|image\/[^;]+);base64,([^)"']+?)["']?\)/gi, function(az, aA, ay) {
                if (ay.length > ax) {
                    return "url()"
                }
                return az
            })
        }
        return aw
    }
    function Y(aw, aB, ax) {
        var aC = aw.getElementsByTagName(aB);
        for (var aA = 0; aA < aC.length; aA++) {
            var az = aC[aA];
            if (az) {
                for (var ay = 0; ay < ax.length; ay++) {
                    if (ax && ax[ay]) {
                        az.removeAttribute(ax[ay])
                    }
                }
            }
        }
    }
    function e(ay, aw) {
        var ax, az;
        for (ax = 0; ay.hasChildNodes() && ax < ay.childNodes.length; ax += 1) {
            az = ay.childNodes[ax];
            if (az.nodeType === aw) {
                ay.removeChild(az);
                ax -= 1
            } else {
                if (az.hasChildNodes()) {
                    e(az, aw)
                }
            }
        }
        return ay
    }
    function au(aA, az) {
        var ay, ax, aw;
        if (!aA || !aA.getElementsByTagName || !az) {
            return
        }
        ax = aA.querySelectorAll(az);
        if (ax && ax.length) {
            for (ay = ax.length - 1; ay >= 0; ay -= 1) {
                aw = ax[ay];
                aw.parentNode.removeChild(aw)
            }
        }
        return aA
    }
    function an(ay) {
        var ax, aw = null;
        if (!ay || !ay.doctype) {
            return null
        }
        ax = ay.doctype;
        if (ax) {
            aw = "<!DOCTYPE " + ax.name + (ax.publicId ? ' PUBLIC "' + ax.publicId + '"' : "") + (!ax.publicId && ax.systemId ? " SYSTEM" : "") + (ax.systemId ? ' "' + ax.systemId + '"' : "") + ">"
        }
        return aw
    }
    function ao(aC, aD) {
        var aB, ay, aA, az, ax, aw;
        if (!aD) {
            return
        }
        az = aC.querySelectorAll("input");
        ax = aD.querySelectorAll("input");
        if (ax) {
            for (aB = 0,
            aw = ax.length; aB < aw; aB += 1) {
                ay = az[aB];
                aA = ax[aB];
                switch (aA.type) {
                case "checkbox":
                case "radio":
                    if (K.isIE ? ay.checked : aA.checked) {
                        aA.setAttribute("checked", "checked")
                    } else {
                        aA.removeAttribute("checked")
                    }
                    break;
                default:
                    aA.setAttribute("value", aA.value);
                    if (!aA.getAttribute("type")) {
                        aA.setAttribute("type", "text")
                    }
                    break
                }
            }
        }
    }
    function ab(aC, aD) {
        var az, aw, aB, ax, ay, aA;
        if (!aC || !aC.getElementsByTagName || !aD || !aD.getElementsByTagName) {
            return
        }
        ax = aC.getElementsByTagName("textarea");
        aA = aD.getElementsByTagName("textarea");
        if (ax && aA) {
            for (az = 0,
            aw = ax.length; az < aw; az += 1) {
                aB = ax[az];
                ay = aA[az];
                ay.setAttribute("value", aB.value);
                ay.value = ay.textContent = aB.value
            }
        }
    }
    function ah(aw, aB) {
        var ax, aD, aC, aE, az, ay, aA;
        if (!aw || !aw.getElementsByTagName || !aB || !aB.getElementsByTagName) {
            return
        }
        aD = aw.getElementsByTagName("select");
        aE = aB.getElementsByTagName("select");
        if (aD) {
            for (az = 0,
            aA = aD.length; az < aA; az += 1) {
                ax = aD[az];
                aC = aE[az];
                for (ay = 0; ay < ax.options.length; ay += 1) {
                    if (ay === ax.selectedIndex || ax.options[ay].selected) {
                        aC.options[ay].setAttribute("selected", "selected")
                    } else {
                        aC.options[ay].removeAttribute("selected")
                    }
                }
            }
        }
    }
    function W(ax, ay) {
        var aw, az = null;
        if (ax) {
            aw = ax.nodeType || -1;
            switch (aw) {
            case 11:
                az = ax.innerHTML;
                break;
            case 9:
                az = ax.documentElement ? ax.documentElement.outerHTML : "";
                break;
            case 1:
                az = ay ? ax.innerHTML : ax.outerHTML;
                break;
            default:
                az = null;
                break
            }
        }
        return az
    }
    function a(ay) {
        var aw, ax = false;
        if (ay && typeof ay === "object") {
            aw = ay.nodeType || -1;
            switch (aw) {
            case 9:
            case 1:
                ax = true;
                break;
            default:
                ax = false;
                break
            }
        }
        return ax
    }
    function q(aD, aM, ax) {
        var aG, aF, aH, aN, aE = ["iframe", "frame"], aL, ay, aB, aK, az, aJ, aA = {
            frames: []
        }, aO, aC, aw;
        for (aF = 0; aF < aE.length; aF += 1) {
            aN = aE[aF];
            aO = aD.getElementsByTagName(aN);
            aC = aM.getElementsByTagName(aN);
            if (aO) {
                for (aG = 0,
                aH = aO.length; aG < aH; aG += 1) {
                    try {
                        aL = aO[aG];
                        ay = K.getIFrameWindow(aL);
                        if (ay && ay.document && ay.location.href !== "about:blank") {
                            aB = ay.document;
                            aK = ak(aB, aB, "", ax);
                            az = v();
                            aC[aG].setAttribute("tltid", az);
                            aK.tltid = az;
                            aw = K.getOriginAndPath(aB.location);
                            aK.host = aw.origin;
                            aK.url = aw.path;
                            aK.charset = aB.characterSet || aB.charset;
                            aJ = aC[aG].getAttribute("src");
                            if (!aJ) {
                                aJ = ay.location.href;
                                aC[aG].setAttribute("src", aJ)
                            }
                            aA.frames = aA.frames.concat(aK.frames);
                            delete aK.frames;
                            aA.frames.push(aK)
                        }
                    } catch (aI) {}
                }
            }
        }
        return aA
    }
    function N(ax) {
        var ay, aw, az;
        ax.DCXListeners = ax.DCXListeners || {};
        for (ay = 0,
        aw = l.length; ay < aw; ay += 1) {
            az = l[ay];
            if (!ax.DCXListeners[az]) {
                w.subscribe(az, ax, J);
                ax.DCXListeners[az] = true
            }
        }
    }
    function z(ay) {
        var aD = ay.adoptedStyleSheets || "";
        var aB = "";
        for (var aA = 0; aA < aD.length; aA++) {
            try {
                var az = aD[aA].cssRules && aD[aA].cssRules.length;
                for (var ax = 0; ax < az; ax++) {
                    var aC = aD[aA].cssRules[ax].cssText;
                    aC = aC.replace("opacity: 0;", "opacity: 1;");
                    aC = aC.replace("visibility: hidden;", "visibility: visible;");
                    aB = aB + " " + aC
                }
            } catch (aw) {}
        }
        return aB
    }
    function ag() {
        return ("setTimeout(() => { const rootElement = document.body;function traverse(element) {if (element.getAttribute('shadow-dom-id')) {const childNodes = element.childNodes;let shadowHtmlContent = '';for (let i = 0; i < childNodes.length; i++) {const childNode = childNodes[i];if (childNode.nodeType === Node.COMMENT_NODE) {continue;}if (childNode.nodeName === 'HCLDISCOVER') {while (element.firstChild !== childNode) {element.removeChild(element.firstChild);}if (element.firstChild === childNode) {element.removeChild(childNode);}break;} else {shadowHtmlContent += childNode.outerHTML || childNode.nodeValue;}}const rootHTML = shadowHtmlContent;const selector = element.tagName.toLowerCase();if (!customElements.get(selector)) {customElements.define(selector, class extends HTMLElement {html = rootHTML;constructor(html) {super();this.html = html;const template = document.createElement('template');template.innerHTML = this.html || rootHTML;const shadowRoot = this.attachShadow({ mode: 'open' });shadowRoot.appendChild(template.content.cloneNode(true));}});}const getClassInstance = customElements.get(selector);const newClass = new getClassInstance(rootHTML);element.shadowRoot.innerHTML = newClass.shadowRoot.innerHTML;}if (element.shadowRoot) {const childrenShadow = element.shadowRoot.children || [];for (let i = 0; i < childrenShadow.length; i++) {traverse(childrenShadow[i]);}}const children = element.children || [];for (let i = 0; i < children.length; i++) {traverse(children[i]);}}traverse(rootElement);}, 500);")
    }
    function B(aI, aO, ay, aH) {
        var aK, aL, aC, ax, aE, aJ, aD = {
            shadows: []
        }, aB, aG, aA, aF = ".TLUIHighlighting { background-color: #AFFFC9 !important; outline-color:#2FBF5E !important; outline-style:solid !important; z-index:5000 !important; }", aw = ay.salesforceDomCaptureConfig;
        if (!aI || (!aH && !aI.children)) {
            return aD
        }
        if (aH) {
            aE = [aI]
        } else {
            aE = aI.children
        }
        for (aK = 0,
        aL = aE.length; aK < aL; aK += 1) {
            ax = aE[aK];
            if (ax.shadowRoot) {
                aJ = new j.Xpath(ax);
                aC = ak(ax.ownerDocument, ax.shadowRoot, "", ay);
                aB = g(ax);
                aG = z(ax.shadowRoot);
                aA = "shadow_dom_" + v();
                aB.setAttribute("shadow-dom-id", aA);
                if (aw && aw.captureFullDom) {
                    aB.innerHTML = aC.root + '<style addedBy="StyleByShadowDOm">' + aF + aG + "</style>" + aB.innerHTML;
                    aq(aB, ax)
                } else {
                    aB.innerHTML = aC.root + '<style addedBy="StyleByShadowDOm">' + aF + aG + "</style><hclDiscover></hclDiscover>" + aB.innerHTML
                }
                aD.shadows.push({
                    root: W(aB),
                    xpath: aJ.xpath
                });
                aD.shadows = aD.shadows.concat(aC.shadows);
                N(ax.shadowRoot);
                if (s) {
                    try {
                        T.observe(ax.shadowRoot, av);
                        ax.shadowRoot.DCXListeners.mutation = true;
                        if (K.indexOf(i, ax) === -1) {
                            i.push(ax)
                        }
                    } catch (aM) {}
                }
                if (!s) {
                    var aN = b.getService("config")
                      , az = aN.getServiceConfig("message");
                    if (!az.maskVisiblePasswords) {
                        return
                    }
                    try {
                        M.observe(ax.shadowRoot, H);
                        ax.shadowRoot.DCXListeners.mutation = true;
                        if (K.indexOf(i, ax) === -1) {
                            i.push(ax)
                        }
                    } catch (aM) {}
                }
            }
            aC = B(ax, null, ay);
            aD.shadows = aD.shadows.concat(aC.shadows)
        }
        return aD
    }
    function aq(aw, az) {
        if (aw.tagName.toLowerCase() === "lightning-primitive-input-simple" && az.value) {
            aw.setAttribute("dcx-value", az.value);
            var ay = aw.querySelector("lightning-primitive-input-simple input");
            if (ay && az.value) {
                ay.setAttribute("value", az.value)
            }
        } else {
            if (aw.tagName.toLowerCase() === "lightning-radio-group" && az.shadowRoot) {
                var aE = az.shadowRoot.querySelectorAll('input[type="radio"]');
                if (aE && aE.length) {
                    var ay = aw.querySelectorAll('lightning-radio-group input[type="radio"]');
                    aA(aE, ay)
                }
            } else {
                if (aw.tagName.toLowerCase() === "lightning-input" && az.shadowRoot) {
                    var ax = az.shadowRoot.querySelectorAll('input[type="checkbox"]');
                    if (ax.length) {
                        var ay = aw.querySelectorAll('lightning-input input[type="checkbox"]');
                        if (ay.length) {
                            aA(ax, ay)
                        }
                    }
                } else {
                    if (aw.tagName.toLowerCase() === "lightning-combobox" && az.shadowRoot) {
                        var aD = az.shadowRoot.querySelector("lightning-base-combobox"), aB;
                        if (aD.shadowRoot) {
                            aB = aD.shadowRoot.innerHTML
                        }
                        var aC = aw.querySelector("lightning-base-combobox");
                        aC.innerHTML = aB
                    }
                }
            }
        }
        function aA(aH, aF) {
            for (var aG = 0; aG < aH.length; aG++) {
                if (aF[aG]) {
                    if (aH[aG].checked) {
                        aF[aG].setAttribute("checked", true)
                    }
                }
            }
        }
    }
    function aj(aC) {
        var aA, ay, aw, az, ax, aB, aD = 0;
        if (!aC) {
            return aD
        }
        if (aC.root) {
            aD += aC.root.length;
            if (aC.frames) {
                for (aA = 0,
                aw = aC.frames.length; aA < aw; aA += 1) {
                    if (aC.frames[aA].root) {
                        aD += aC.frames[aA].root.length
                    }
                }
            }
        } else {
            if (aC.diffs) {
                for (aA = 0,
                aw = aC.diffs.length; aA < aw; aA += 1) {
                    aB = aC.diffs[aA];
                    aD += aB.xpath.length;
                    if (aB.root) {
                        aD += aB.root.length
                    } else {
                        if (aB.attributes) {
                            for (ay = 0,
                            az = aB.attributes.length; ay < az; ay += 1) {
                                ax = aB.attributes[ay];
                                aD += ax.name.length;
                                if (ax.value) {
                                    aD += ax.value.length
                                }
                            }
                        }
                    }
                }
            }
        }
        return aD
    }
    function V() {
        var az, ay, aw, ax;
        for (az = 0,
        aw = t.length; az < aw && d.length; az += 1) {
            ax = t[az];
            for (ay = 0; ay < d.length; ay += 1) {
                if (d[ay].containedIn(ax)) {
                    d.splice(ay, 1);
                    ay -= 1
                }
            }
        }
    }
    function ad(az) {
        var ay, aw, ax, aA, aB = [];
        if (!az || !az.children) {
            return aB
        }
        aA = az.children;
        for (ay = 0,
        aw = aA.length; ay < aw; ay += 1) {
            ax = aA[ay];
            if (ax.shadowRoot) {
                if (!ax.shadowRoot.DCXListeners) {
                    aB.push([ax, ax.shadowRoot])
                }
                aB = aB.concat(ad(ax.shadowRoot))
            }
            aB = aB.concat(ad(ax))
        }
        return aB
    }
    function S(aC, ay) {
        var az, aw, aA, aB, ax;
        if (!aC || !ay) {
            return
        }
        if (!ay.captureShadowDOM) {
            return
        }
        ax = ad(aC, ay);
        for (az = 0,
        aw = ax.length,
        aA = []; az < aw; az += 1) {
            aB = B(ax[az][0], null, ay, true);
            aA = aA.concat(aB.shadows)
        }
        return aA
    }
    function ae(aB, ay) {
        var aC, ax, aA, az, aw;
        aC = ak(aB, aB, null, ay);
        if (!aC) {
            aC = {}
        }
        aC.charset = aB.characterSet || aB.charset;
        ax = K.getOriginAndPath(aB.location);
        aC.host = ax.origin;
        aC.url = ax.path;
        return aC
    }
    function c(az) {
        var aK, aL, aA = {
            fullDOM: false,
            diffs: [],
            attributeDiffs: {}
        }, aG, aF, aH, aC, aE, aN, aB, aD, ax = az && az.salesforceDomCaptureConfig, aw = new RegExp("^data:image/(.*?);base64");
        D(t);
        V();
        aC = az.captureShadowDOM;
        az.captureShadowDOM = false;
        for (aK = 0,
        aL = t.length; aK < aL; aK += 1) {
            aB = t[aK];
            aN = j.getNodeFromID(aB && aB.xpath, -2);
            if (!aN) {
                continue
            }
            if (aB.isShadowHost) {
                aN = aN.shadowRoot;
                if (!aN.DCXListeners) {
                    continue
                }
            }
            if (aN === window.document.body || aN === window.document.documentElement) {
                az.captureShadowDOM = aC;
                return ae(window.document, az)
            }
            aG = ak(window.document, aN, aB, az);
            if (ax && ax.captureDiffShadow && aG.root) {
                var aM = n(aN);
                if (!(aG.root || "").includes("<head>")) {
                    var aI = ak(window.document, aM, aB, az);
                    aG.root = aI.root
                }
            }
            delete aG.originalSize;
            if (aG.shadows && aG.shadows.length === 0) {
                delete aG.shadows
            }
            if (aG.frames && aG.frames.length === 0) {
                delete aG.frames
            }
            aG.xpath = aB.xpath;
            aA.diffs.push(aG)
        }
        function aJ(aP, aO) {
            if (!aP || !aP.name) {
                return
            }
            aA.attributeDiffs[aG.xpath][aP.name] = {
                value: aP.value
            }
        }
        function ay(aR) {
            var aP, aO, aQ;
            for (aP = 0,
            aQ = aR.length; aP < aQ; aP += 1) {
                aO = aR[aP];
                if (aO.name === "src" && aw.test(aO.value) && aO.value.length > az.removeBase64) {
                    aO.value = "";
                    aR.push({
                        name: "removedByDCX",
                        value: true
                    });
                    break
                }
            }
            return aR
        }
        for (aK = 0,
        aL = d.length; aK < aL; aK += 1) {
            aB = d[aK];
            aF = o(aB.attributes, "id");
            if (aF > -1) {
                aN = j.getNodeFromID(aB.xpath, -2);
                aH = new j.Xpath(aN,false,aB.attributes[aF].oldValue);
                aB.xpath = aH.xpath
            }
            aD = aa(aB.attributes);
            if (az.hasOwnProperty("removeBase64")) {
                aN = j.getNodeFromID(aB.xpath, -2);
                if (aN && aN.tagName.toLowerCase() === "img" && aD) {
                    aD = ay(aD)
                }
            }
            aG = {
                xpath: aB.xpath,
                attributes: aD
            };
            aA.diffs.push(aG);
            aA.attributeDiffs[aG.xpath] = {};
            K.forEach(aG.attributes, aJ)
        }
        az.captureShadowDOM = aC;
        aE = S(window.document, az);
        if (aE && aE.length) {
            if (!(ax && ax.captureDiffShadow)) {
                aA.shadows = aE
            }
        }
        return aA
    }
    function n(ay) {
        function aB(aC) {
            var aD = document.createElement(aC.nodeName);
            Array.from(aC.attributes).forEach(function(aE) {
                aD.setAttribute(aE.name, aE.value)
            });
            return aD
        }
        function aw(aE, aD) {
            if (aE.tagName.toLowerCase() === "lightning-primitive-input-simple") {
                var aC = aE.value;
                if (aC && aD) {
                    aD.setAttribute("dcx-value", aC)
                }
            }
        }
        function ax(aF) {
            var aE = aF.querySelector("lightning-primitive-input-simple");
            if (aE) {
                var aC = aE.getAttribute("dcx-value")
                  , aD = aF.querySelector("lightning-primitive-input-simple input");
                if (aD && aC) {
                    aD.setAttribute("value", aC)
                }
            }
        }
        function aA(aD, aE) {
            if (aD.shadowRoot) {
                var aC = aD.shadowRoot;
                aC.childNodes.forEach(function(aG) {
                    if (aG.nodeType === Node.ELEMENT_NODE) {
                        var aH = aB(aG);
                        aw(aG, aH);
                        aA(aG, aH);
                        aE.appendChild(aH)
                    } else {
                        if (aG.nodeType === Node.TEXT_NODE) {
                            var aI = document.createTextNode(aG.nodeValue);
                            aE.appendChild(aI)
                        } else {
                            if (aG.nodeType === Node.COMMENT_NODE) {
                                var aF = document.createComment(aG.nodeValue);
                                aE.appendChild(aF)
                            }
                        }
                    }
                })
            }
            aD.childNodes.forEach(function(aI) {
                if (aI.nodeType === Node.ELEMENT_NODE) {
                    var aH = aB(aI);
                    aA(aI, aH);
                    ax(aH);
                    aE.appendChild(aH)
                } else {
                    if (aI.nodeType === Node.TEXT_NODE) {
                        var aG = document.createTextNode(aI.nodeValue);
                        aE.appendChild(aG)
                    } else {
                        if (aI.nodeType === Node.COMMENT_NODE) {
                            var aF = document.createComment(aI.nodeValue);
                            aE.appendChild(aF)
                        }
                    }
                }
            })
        }
        var az = aB(ay);
        aA(ay, az);
        return az
    }
    g = function(ay) {
        var az = null;
        if (a(ay)) {
            az = ay.cloneNode(true);
            if (!az && ay.documentElement) {
                az = ay.documentElement.cloneNode(true)
            }
            var aw = b.getCoreConfig().doNotCaptureElements || {};
            for (var ax = aw.length - 1; ax >= 0; ax -= 1) {
                au(az, aw[ax])
            }
        }
        return az
    }
    ;
    ak = function(aU, aI, aL, az) {
        var aB = true, aR, aG, aC, aH = {}, aT, aO, aQ, aA;
        if (!aU || !aI) {
            return aH
        }
        aR = g(aI, aU);
        if (!aR && aI.host) {
            aB = false;
            aO = document.createElement("div");
            aO.id = "srph-" + Date.now();
            aQ = W(aI);
            aO.innerHTML = aQ;
            aR = aO
        } else {
            if (!aR) {
                return aH
            }
        }
        if (aR) {
            if (!!az.removeScripts) {
                ai(aR, "script");
                ai(aR, "noscript")
            }
            if (!az.keepImports) {
                ai(aR, "link", ["rel", "import"]);
                ai(aR, "link", ["rel", "stylesheet"]);
                ai(aR, "link", ["rel", "Stylesheet"])
            }
            if (az.removeAttributes && az.removeAttributes.length) {
                var aP = az.removeAttributes, aM;
                for (aM = 0; aM < aP.length; aM++) {
                    var ax = aP[aM].tagName;
                    var aF = aP[aM].attrList;
                    if (ax && aF && aF.length) {
                        Y(aR, ax, aF)
                    }
                }
            }
            if (!!az.removeComments) {
                e(aR, 8)
            }
            if (!az.captureStyle) {
                ai(aR, "style")
            }
            if (typeof aR === "object" && (typeof aR.createElement === "function" || aR.tagName === "HEAD") && az.captureJSS) {
                var aw = (aU && aU.defaultView && aU.defaultView.frameElement) ? aU : document;
                var ay = aw.styleSheets.length;
                var aE = "";
                for (var aM = 0; aM < ay; aM++) {
                    try {
                        var aD = aw.styleSheets[aM].cssRules.length;
                        for (var aK = 0; aK < aD; aK++) {
                            aE = aE + " " + aw.styleSheets[aM].cssRules[aK].cssText
                        }
                    } catch (aJ) {}
                }
                if (az.customStyle) {
                    aE = aE + az.customStyle
                }
                if (az.hasOwnProperty("removeBase64")) {
                    aE = m(aE, az.removeBase64)
                }
                if (!aR.createElement) {
                    aR.innerHTML += '<style added_by="HCL DISCOVER JSS Style Capture">' + aE + "</style>"
                } else {
                    var aN = aR.createElement("style");
                    aN.setAttribute("added_by", "HCL DISCOVER JSS Style Capture");
                    aN.innerHTML = aE;
                    aR.getElementsByTagName("head")[0].appendChild(aN)
                }
                if (typeof DCX !== "undefined" && ay) {
                    aH.origCSSsize = aE.length
                }
            }
            if (az.hasOwnProperty("removeBase64")) {
                al(aR, az.removeBase64)
            }
            ah(aI, aR);
            ao(aI, aR);
            ab(aI, aR);
            aR = ac.applyPrivacyToNode(aR, aL, aU);
            if (!!az.captureFrames) {
                aG = q(aI, aR, az)
            }
        }
        if (!!az.captureShadowDOM) {
            aC = B(aI, aB ? aR : null, az);
            if (aC.shadows && aC.shadows.length > 0 && az.sendShadodomScript && aR && typeof aR === "object" && (typeof aR.createElement === "function")) {
                var aS = document.createElement("script");
                aS.setAttribute("id", "discover_shadow_dom");
                aS.textContent = ag();
                aR.getElementsByTagName("body")[0].appendChild(aS)
            }
        }
        if (aG) {
            aH = K.mixin(aH, aG)
        }
        if (aC) {
            aH = K.mixin(aH, aC)
        }
        aT = (an(aI) || "") + W(aR || aI, !aB);
        aH.root = ac.applyPrivacyPatterns(aT);
        return aH
    }
    ;
    u = function() {
        af = b.getService("config");
        h(af.getServiceConfig("domCapture") || {})
    }
    ;
    return {
        init: function() {
            af = b.getService("config");
            if (!A) {
                h(af.getServiceConfig("domCapture") || {})
            } else {}
        },
        destroy: function() {
            p()
        },
        observeWindow: function(ay) {
            var ax, aw;
            if (!ay) {
                return
            }
            if (!K.getValue(E, "options.captureFrames", false) && !(ay === window)) {
                return
            }
            if (K.indexOf(y, ay) === -1) {
                y.push(ay)
            }
        },
        captureDOM: function(ax, ay) {
            var az, aw, aC = null, aA, aD = 0;
            if (!A || K.isLegacyIE) {
                return aC
            }
            ay = K.mixin({}, E.options, ay);
            ax = ax || window.document;
            if (!F || !s || ar || ay.forceFullDOM) {
                if (T) {
                    T.disconnect()
                }
                if (M) {
                    M.disconnect()
                }
                aC = ae(ax, ay);
                aC.fullDOM = true;
                aC.forced = !!(ar || ay.forceFullDOM);
                F = true;
                if (T) {
                    for (az = 0,
                    aw = y.length; az < aw; az += 1) {
                        aA = y[az];
                        try {
                            T.observe(aA.document, av)
                        } catch (aB) {
                            y.splice(az, 1);
                            aw = y.length;
                            az -= 1
                        }
                    }
                }
                if (M) {
                    for (az = 0,
                    aw = y.length; az < aw; az += 1) {
                        aA = y[az];
                        try {
                            M.observe(aA.document, H)
                        } catch (aB) {
                            y.splice(az, 1);
                            aw = y.length;
                            az -= 1
                        }
                    }
                }
            } else {
                aC = c(ay);
                aC.fullDOM = (aC.diffs) ? false : true
            }
            if (s) {
                aC.mutationCount = at
            }
            ap();
            if (ay.maxLength) {
                aD = aj(aC);
                if (aD > ay.maxLength) {
                    aC = {
                        errorCode: 101,
                        error: "Captured length (" + aD + ") exceeded limit (" + ay.maxLength + ")."
                    }
                }
            }
            if (aC.fullDOM) {
                aC.origDOMSize = aD
            } else {
                aC.origDiffSize = aD
            }
            return aC
        }
    }
});
DCX.addService("encoder", function(a) {
    var f = {}
      , g = null
      , b = null
      , d = false;
    function e(j) {
        var i = null;
        if (!j) {
            return i
        }
        i = f[j];
        if (i && typeof i.encode === "string") {
            i.encode = a.utils.access(i.encode)
        }
        return i
    }
    function h(i) {
        f = i;
        g.subscribe("configupdated", b);
        d = true
    }
    function c() {
        g.unsubscribe("configupdated", b);
        d = false
    }
    b = function() {
        g = a.getService("config");
        h(g.getServiceConfig("encoder") || {})
    }
    ;
    return {
        init: function() {
            g = a.getService("config");
            if (!d) {
                h(g.getServiceConfig("encoder") || {})
            } else {}
        },
        destroy: function() {
            c()
        },
        encode: function(m, l) {
            var k, i, j = {
                data: null,
                encoding: null,
                error: null
            };
            if ((typeof m !== "string" && !m) || !l) {
                j.error = "Invalid " + (!m ? "data" : "type") + " parameter.";
                return j
            }
            k = e(l);
            if (!k) {
                j.error = "Specified encoder (" + l + ") not found.";
                return j
            }
            if (typeof k.encode !== "function") {
                j.error = "Configured encoder (" + l + ") encode method is not a function.";
                return j
            }
            try {
                i = k.encode(m)
            } catch (n) {
                j.error = "Encoding failed: " + (n.name ? n.name + " - " : "") + n.message;
                return j
            }
            if (!i || a.utils.getValue(i, "buffer", null) === null) {
                j.error = "Encoder (" + l + ") returned an invalid result.";
                return j
            }
            j.data = i.buffer;
            j.encoding = k.defaultEncoding;
            return j
        }
    }
});
DCX.addService("message", function(v) {
    var R = v.utils, q = 0, s = 0, J = 0, j = 0, r = new Date(), i = v.getService("browserBase"), b = v.getService("browser"), h = v.getService("config"), A = h.getServiceConfig("message") || {}, m = v.normalizeUrl("", window.location.href), O = window.location.hostname, S = A.hasOwnProperty("privacy") ? A.privacy : [], c, G = {}, P = {
        lower: "x",
        upper: "X",
        numeric: "9",
        symbol: "@"
    }, f = parseFloat((window.devicePixelRatio || 1).toFixed(2)), g = window.screen || {}, a = g.width || 0, y = g.height || 0, Q = i.getNormalizedOrientation(), k = !R.isiOS ? a : Math.abs(Q) === 90 ? y : a, E = !R.isiOS ? y : Math.abs(Q) === 90 ? a : y, M = (window.screen ? window.screen.height - window.screen.availHeight : 0), L = window.innerWidth || document.documentElement.clientWidth, n = window.innerHeight || document.documentElement.clientHeight, I = false, x = {}, B;
    function e(V) {
        var U = ""
          , W = V.timestamp || (new Date()).getTime();
        this.timestamp = W;
        delete V.timestamp;
        this.type = V.type;
        this.offset = W - r.getTime();
        if (V.type === 2 && V.screenview && V.screenview.type === "LOAD") {
            if (V.screenview.name !== "root" && V.screenview.name !== "rootWithFrames") {
                var T = V.screenview.name;
                if (T && T.indexOf("#") === 0) {
                    B = location.pathname + T
                } else {
                    B = T
                }
            } else {
                B = location.pathname + location.hash
            }
        }
        this.screenViewPath = B || location.pathname + location.hash;
        this.screenViewPath = DCX.normalizeUrl("", this.screenViewPath);
        this.screenviewOffset = 0;
        if (V.type === 2) {
            q = s;
            s = W;
            if (V.screenview.type === "UNLOAD") {
                this.screenviewOffset = W - (q || r.getTime())
            }
        } else {
            if (s) {
                this.screenviewOffset = W - s
            }
        }
        if (!this.type) {
            return
        }
        this.count = (j += 1);
        this.fromWeb = true;
        for (U in V) {
            if (V.hasOwnProperty(U)) {
                this[U] = V[U]
            }
        }
    }
    G.PVC_MASK_EMPTY = function(T) {
        return ""
    }
    ;
    G.PVC_MASK_BASIC = function(U) {
        var T = "XXXXX";
        if (typeof U !== "string") {
            return ""
        }
        return (U.length ? T : "")
    }
    ;
    G.PVC_MASK_TYPE = function(X) {
        var U, W = 0, T = 0, V = "";
        if (typeof X !== "string") {
            return V
        }
        U = X.split("");
        for (W = 0,
        T = U.length; W < T; W += 1) {
            if (R.isNumeric(U[W])) {
                V += P.numeric
            } else {
                if (R.isUpperCase(U[W])) {
                    V += P.upper
                } else {
                    if (R.isLowerCase(U[W])) {
                        V += P.lower
                    } else {
                        V += P.symbol
                    }
                }
            }
        }
        return V
    }
    ;
    G.PVC_MASK_EMPTY.maskType = 1;
    G.PVC_MASK_BASIC.maskType = 2;
    G.PVC_MASK_TYPE.maskType = 3;
    G.PVC_MASK_CUSTOM = {
        maskType: 4
    };
    function d(T, V) {
        var U = G.PVC_MASK_BASIC;
        if (typeof V !== "string") {
            return V
        }
        if (!T) {
            U = G.PVC_MASK_BASIC
        } else {
            if (T.maskType === G.PVC_MASK_EMPTY.maskType) {
                U = G.PVC_MASK_EMPTY
            } else {
                if (T.maskType === G.PVC_MASK_BASIC.maskType) {
                    U = G.PVC_MASK_BASIC
                } else {
                    if (T.maskType === G.PVC_MASK_TYPE.maskType) {
                        U = G.PVC_MASK_TYPE
                    } else {
                        if (T.maskType === G.PVC_MASK_CUSTOM.maskType) {
                            if (typeof T.maskFunction === "string") {
                                U = R.access(T.maskFunction)
                            } else {
                                U = T.maskFunction
                            }
                            if (typeof U !== "function") {
                                U = G.PVC_MASK_BASIC
                            }
                        }
                    }
                }
            }
        }
        return U(V)
    }
    function D(T, U) {
        var V;
        if (!T || !U) {
            return
        }
        for (V in U) {
            if (U.hasOwnProperty(V)) {
                if (V === "value") {
                    U[V] = d(T, U[V])
                } else {
                    delete U[V]
                }
            }
        }
    }
    function N(T, U) {
        return (R.matchTarget(T, U) !== -1)
    }
    function H(Z) {
        var V, T, W, Y, U, X;
        if (!Z) {
            return ""
        }
        for (V = 0,
        T = c.length; V < T; V += 1) {
            X = c[V];
            U = (!(X.screenview && X.screenview.length) || (X.screenview && X.screenview.some(function(aa) {
                return window.location.href.includes(aa)
            })));
            if (U) {
                X.cRegex.lastIndex = 0;
                Z = Z.replace(X.cRegex, X.replacement)
            }
        }
        return Z
    }
    function F(aa) {
        var X, T, W, U, Z = false, Y, V;
        if (!aa || (!aa.currState && !aa.prevState)) {
            return aa
        }
        Y = aa.prevState;
        V = aa.currState;
        for (X = 0,
        T = S.length; X < T; X += 1) {
            U = S[X];
            W = R.getValue(U, "exclude", false);
            if (N(U.targets, aa) !== W) {
                D(U, Y);
                D(U, V);
                Z = true;
                break
            }
        }
        if (!Z) {
            if (Y && Y.value) {
                Y.value = H(Y.value)
            }
            if (V && V.value) {
                V.value = H(V.value)
            }
        }
        return aa
    }
    function o(T) {
        if (!T || !T.target) {
            return T
        }
        F(T.target);
        return T
    }
    function l(W, U) {
        var V, T, Y, X;
        if (!U || !W) {
            return
        }
        if (W.value) {
            Y = d(U, W.value);
            W.setAttribute("value", Y);
            W.value = Y
        }
        if (W.checked) {
            W.removeAttribute("checked")
        }
        if (R.getTagName(W) === "select") {
            W.selectedIndex = -1;
            for (V = 0,
            T = W.options.length; V < T; V += 1) {
                X = W.options[V];
                X.removeAttribute("selected");
                X.selected = false
            }
        } else {
            if (R.getTagName(W) === "textarea") {
                W.textContent = W.value
            }
        }
    }
    function u(af, ac, ag, al, Y, ab) {
        var ah, ae, ad, ai, V, W, aa = [], aj, T, Z, X, ak, U;
        if (!af.length && !Y.length && !ab) {
            return []
        }
        U = b.queryAll("input, select, textarea", ac);
        if (!U || !U.length) {
            return []
        }
        for (ah = 0,
        ai = Y.length; ah < ai; ah += 1) {
            ae = U.indexOf(Y[ah]);
            if (ae !== -1) {
                U.splice(ae, 1)
            }
        }
        if (af.length) {
            for (ah = 0,
            ai = U.length,
            aa = []; ah < ai; ah += 1) {
                if (U[ah].value) {
                    W = i.ElementData.prototype.examineID(U[ah], true);
                    if (W.idType === -2) {
                        aj = new i.Xpath(U[ah]);
                        aj.applyPrefix(ag);
                        W.id = aj.xpath
                    }
                    aa.push({
                        id: W.id,
                        idType: W.idType,
                        element: U[ah]
                    })
                }
            }
        }
        for (ah = 0,
        ai = af.length; ah < ai; ah += 1) {
            X = S[af[ah].ruleIndex];
            T = R.getValue(X, "exclude", false);
            ak = X.targets[af[ah].targetIndex];
            if (typeof ak.id === "string" && ak.idType === -2) {
                for (ae = 0; ae < aa.length; ae += 1) {
                    if (aa[ae].idType === ak.idType && aa[ae].id === ak.id) {
                        V = aa[ae] && aa[ae].element;
                        if (!T) {
                            l(V, X)
                        } else {
                            ad = U.indexOf(V);
                            U.splice(ad, 1)
                        }
                    }
                }
            } else {
                for (ae = 0; ae < aa.length; ae += 1) {
                    ak.cRegex.lastIndex = 0;
                    if (aa[ae].idType === ak.idType && ak.cRegex.test(aa[ae].id)) {
                        V = aa[ae].element;
                        if (!T) {
                            l(V, X)
                        } else {
                            ad = U.indexOf(V);
                            U.splice(ad, 1)
                        }
                    }
                }
            }
        }
        if (ab) {
            for (ah = 0,
            ai = U.length; ah < ai; ah += 1) {
                l(U[ah], ab)
            }
        }
    }
    function p(aa, af, al) {
        var ag, ac, ab, V, T, W = [], Z, ah, ad, X, U, ai, ae = [], ak, aj, Y;
        if (!aa || !al) {
            return null
        }
        for (ag = 0,
        ah = S.length; ag < ah; ag += 1) {
            ad = S[ag];
            T = R.getValue(ad, "exclude", false);
            if (T) {
                Z = ad
            }
            aj = ad.targets;
            for (ac = 0,
            Y = aj.length; ac < Y; ac += 1) {
                ak = aj[ac];
                if (typeof ak === "string") {
                    U = b.queryAll(ak, aa);
                    if (!T) {
                        for (ab = 0,
                        ai = U.length; ab < ai; ab += 1) {
                            V = U[ab];
                            l(V, ad)
                        }
                    } else {
                        W = W.concat(U)
                    }
                } else {
                    if (typeof ak.id === "string") {
                        switch (ak.idType) {
                        case -1:
                        case -3:
                            V = i.getNodeFromID(ak.id, ak.idType, aa);
                            if (!T) {
                                l(V, ad)
                            } else {
                                W.push(V)
                            }
                            break;
                        case -2:
                            ae.push({
                                ruleIndex: ag,
                                targetIndex: ac,
                                exclude: T
                            });
                            break;
                        default:
                            break
                        }
                    } else {
                        ae.push({
                            ruleIndex: ag,
                            targetIndex: ac,
                            exclude: T
                        })
                    }
                }
            }
        }
        u(ae, aa, af, al, W, Z);
        return aa
    }
    function t(X) {
        var V, T, U, W = false;
        if (!X) {
            return W
        }
        for (V = 0,
        T = S.length; V < T; V += 1) {
            U = S[V];
            if (N(U.targets, X)) {
                W = true;
                break
            }
        }
        return W
    }
    function w() {
        var W, V, T, Z, aa, Y, U, X;
        h = v.getService("config");
        A = h.getServiceConfig("message") || {};
        S = A.privacy || [];
        c = A.privacyPatterns || [];
        for (W = 0,
        aa = S.length; W < aa; W += 1) {
            Z = S[W];
            U = Z.targets;
            for (V = 0,
            X = U.length; V < X; V += 1) {
                Y = U[V];
                if (typeof Y === "object") {
                    if (typeof Y.idType === "string") {
                        Y.idType = +Y.idType
                    }
                    if (typeof Y.id === "object") {
                        Y.cRegex = new RegExp(Y.id.regex,Y.id.flags)
                    }
                }
            }
        }
        for (T = c.length,
        W = T - 1; W >= 0; W -= 1) {
            Z = c[W];
            if (typeof Z.pattern === "object") {
                Z.cRegex = new RegExp(Z.pattern.regex,Z.pattern.flags)
            } else {
                c.splice(W, 1)
            }
        }
    }
    function z() {
        if (h.subscribe) {
            h.subscribe("configupdated", w)
        }
        w();
        I = true
    }
    function K() {
        h.unsubscribe("configupdated", w);
        I = false
    }
    function C(ab) {
        var Y = ab.dcid, V = ab.shadows || [], X = ab.fullDOM, ac = 1, W, Z, aa, U, T;
        if (V.length === 0 || !X) {
            return
        }
        for (aa in x) {
            if (x.hasOwnProperty(aa)) {
                x[aa].age += 1
            }
        }
        for (W = 0,
        Z = V.length; W < Z; W += 1) {
            U = V[W];
            T = x[U.xpath];
            if (T && T.root === U.root) {
                T.hitCount += 1;
                T.age -= 1;
                U.cacheDCID = T.dcid;
                delete U.root
            } else {
                x[U.xpath] = {
                    root: U.root,
                    dcid: Y,
                    hitCount: 0,
                    age: 0
                }
            }
        }
        for (aa in x) {
            if (x.hasOwnProperty(aa)) {
                T = x[aa];
                if (T.age > T.hitCount + ac) {
                    delete x[aa]
                }
            }
        }
    }
    return {
        init: function() {
            if (!I) {
                z()
            } else {}
        },
        destroy: function() {
            K()
        },
        applyPrivacyToNode: p,
        applyPrivacyToMessage: o,
        applyPrivacyToTarget: F,
        applyPrivacyPatterns: H,
        isPrivacyMatched: t,
        createMessage: function(T) {
            if (typeof T.type === "undefined") {
                throw new TypeError("Invalid queueEvent given!")
            }
            if (T.type === 12) {
                C(T.domCapture)
            }
            return o(new e(T))
        },
        wrapMessages: function(W) {
            var V = DCX.getCoreConfig();
            var T = 0;
            if (window && window.sessionStorage && window.localStorage) {
                if (!window.sessionStorage.DCXTab) {
                    window.sessionStorage.setItem("DCXTab", Date.now())
                }
                T = window.sessionStorage.DCXTab
            }
            var U = {
                messageVersion: "10.0.0.0",
                serialNumber: (J += 1),
                sessions: [{
                    id: v.getPageId(),
                    startTime: r.getTime(),
                    timezoneOffset: r.getTimezoneOffset(),
                    messages: W,
                    clientEnvironment: {
                        webEnvironment: {
                            libVersion: "12.2.0",
                            internalVersion: V.version,
                            domain: O,
                            page: m,
                            referrer: document.referrer,
                            screen: {
                                devicePixelRatio: f,
                                deviceWidth: k,
                                deviceHeight: E,
                                deviceToolbarHeight: M,
                                width: L,
                                height: n,
                                orientation: Q
                            },
                            tabID: T
                        }
                    }
                }]
            }
              , X = U.sessions[0].clientEnvironment.webEnvironment.screen;
            X.orientationMode = R.getOrientationMode(X.orientation);
            return U
        }
    }
});
DCX.addService("serializer", function(core) {
    function serializeToJSON(obj) {
        var str, key, len = 0;
        if (typeof obj !== "object" || obj === null) {
            switch (typeof obj) {
            case "function":
            case "undefined":
                return "null";
            case "string":
                return '"' + obj.replace(/\"/g, '\\"') + '"';
            default:
                return String(obj)
            }
        } else {
            if (Object.prototype.toString.call(obj) === "[object Array]") {
                str = "[";
                for (key = 0,
                len = obj.length; key < len; key += 1) {
                    if (Object.prototype.hasOwnProperty.call(obj, key)) {
                        str += serializeToJSON(obj[key]) + ","
                    }
                }
            } else {
                str = "{";
                for (key in obj) {
                    if (Object.prototype.hasOwnProperty.call(obj, key)) {
                        str = str.concat('"', key, '":', serializeToJSON(obj[key]), ",");
                        len += 1
                    }
                }
            }
        }
        if (len > 0) {
            str = str.substring(0, str.length - 1)
        }
        str += String.fromCharCode(str.charCodeAt(0) + 2);
        return str
    }
    var configService = core.getService("config")
      , serialize = {}
      , parse = {}
      , defaultSerializers = {
        json: (function() {
            if (typeof window.JSON !== "undefined") {
                return {
                    serialize: window.JSON.stringify,
                    parse: window.JSON.parse
                }
            }
            return {
                serialize: serializeToJSON,
                parse: function(data) {
                    return eval("(" + data + ")")
                }
            }
        }())
    }
      , updateConfig = null
      , isInitialized = false;
    function addObjectIfExist(paths, rootObj, propertyName) {
        var i, len, obj;
        paths = paths || [];
        for (i = 0,
        len = paths.length; i < len; i += 1) {
            obj = paths[i];
            if (typeof obj === "string") {
                obj = core.utils.access(obj)
            }
            if (typeof obj === "function") {
                rootObj[propertyName] = obj;
                break
            }
        }
    }
    function checkParserAndSerializer() {
        var isParserAndSerializerInvalid;
        if (typeof serialize.json !== "function" || typeof parse.json !== "function") {
            isParserAndSerializerInvalid = true
        } else {
            if (typeof parse.json('{"foo": "bar"}') === "undefined") {
                isParserAndSerializerInvalid = true
            } else {
                isParserAndSerializerInvalid = parse.json('{"foo": "bar"}').foo !== "bar"
            }
            if (typeof parse.json("[1, 2]") === "undefined") {
                isParserAndSerializerInvalid = true
            } else {
                isParserAndSerializerInvalid = isParserAndSerializerInvalid || parse.json("[1, 2]")[0] !== 1;
                isParserAndSerializerInvalid = isParserAndSerializerInvalid || parse.json("[1,2]")[1] !== 2
            }
            isParserAndSerializerInvalid = isParserAndSerializerInvalid || serialize.json({
                foo: "bar"
            }) !== '{"foo":"bar"}';
            isParserAndSerializerInvalid = isParserAndSerializerInvalid || serialize.json([1, 2]) !== "[1,2]"
        }
        return isParserAndSerializerInvalid
    }
    function initSerializerService(config) {
        var format;
        for (format in config) {
            if (config.hasOwnProperty(format)) {
                addObjectIfExist(config[format].stringifiers, serialize, format);
                addObjectIfExist(config[format].parsers, parse, format)
            }
        }
        if (!(config.json && config.json.hasOwnProperty("defaultToBuiltin")) || config.json.defaultToBuiltin === true) {
            serialize.json = serialize.json || defaultSerializers.json.serialize;
            parse.json = parse.json || defaultSerializers.json.parse
        }
        if (typeof serialize.json !== "function" || typeof parse.json !== "function") {
            core.fail("JSON parser and/or serializer not provided in the UIC config. Can't continue.")
        }
        if (checkParserAndSerializer()) {
            core.fail("JSON stringification and parsing are not working as expected")
        }
        if (configService) {
            configService.subscribe("configupdated", updateConfig)
        }
        isInitialized = true
    }
    function destroy() {
        serialize = {};
        parse = {};
        if (configService) {
            configService.unsubscribe("configupdated", updateConfig)
        }
        isInitialized = false
    }
    updateConfig = function() {
        configService = core.getService("config");
        initSerializerService(configService.getServiceConfig("serializer"))
    }
    ;
    return {
        init: function() {
            var ssConfig;
            if (!isInitialized) {
                ssConfig = configService ? configService.getServiceConfig("serializer") : {};
                initSerializerService(ssConfig)
            } else {}
        },
        destroy: function() {
            destroy()
        },
        parse: function(data, type) {
            var parsedData;
            type = type || "json";
            try {
                parsedData = parse[type](data)
            } catch (e) {
                this.init();
                parsedData = parse[type](data)
            }
            return parsedData
        },
        serialize: function(data, type) {
            var serializedData;
            type = type || "json";
            try {
                serializedData = serialize[type](data)
            } catch (e) {
                this.init();
                serializedData = serialize[type](data)
            }
            return serializedData
        }
    }
});
DCX.addModule("DCCookie",function(d){var l={},m=0,i="WCXSID",k="TLTSID",w="_vz",a="CoreID6",s,r,f,b=null,x,j=[],t=d.utils;function o(){var z="123456789",A=t.getRandomString(1,z)+t.getRandomString(31,z+"0");return A}function p(){var C="viz_";var A=13;var z="";for(var B=0;B<A;B++){var D=Math.floor(Math.random()*16).toString(16);z+=D}return C+z}function h(){var B=o(),z=!!l.secureDCXSID,A;t.setCookie(k,B,A,A,A,z);return t.getCookieValue(k)}function c(){var B=p(),z=!!l.secureDCXSID,A;t.setCookie(w,B,A,A,A,z);return t.getCookieValue(w)}function n(){if(b||!window.cmRetrieveUserID){return}try{window.cmRetrieveUserID(function(A){b=A})}catch(z){b=null}}function g(D){var z,A,C,B;if(!localStorage||!D){return}C=localStorage.getItem(D);if(C){A=C.split("|");z=parseInt(A[0],10);if(Date.now()>z){localStorage.removeItem(D)}else{B=A[1]}}return B}function y(B,A){var z;if(!localStorage||!B){return}A=A||(B.includes("_vz")?p():o());z=Date.now()+m;localStorage.setItem(B,z+"|"+A);return g(B)}function q(B){var z;var A=window.localStorage;if(!A||!B){return}z=A.getItem(B);if(z===null){z="xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(E){var C=Math.random()*16|0,D=E=="x"?C:(C&3|8);return C.toString(16)});A.setItem(B,z)}return z}function e(z){var B=t.getValue(z,"sessionIDUsesCookie",true),A=t.getValue(z,"sessionIDUsesStorage",false);j=[];if(z.dcAppKey){x=z.dcAppKey;j.push({name:"X-Discover-SaaS-AppKey",value:x})}if(z.visitorCookieName){a=z.visitorCookieName}if(z.wcxCookieName){i=z.wcxCookieName}s=t.getCookieValue(i);if(s){j.push({name:"X-WCXSID",value:s})}if(z.sessionizationCookieName){k=z.sessionizationCookieName}if(A){m=t.getValue(z,"sessionIDStorageDCX",600000);r=g(k);f=r}if(!r&&B){r=t.getCookieValue(k);f=r}if(!r){if(s){r=s}else{if(A){r=y(k)}if(!r&&B){r=h()}}}if(!f&&B){f=t.getCookieValue(w)}if(!f){if(A){f=y(w)}if(!f&&B){f=c()}}if(!r){r="Check7UIC7Cookie7Configuration77"}j.push({name:"X-Discover-SaaS-TLTSID",value:r});j.push({name:"X-Discover-VIZID",value:f});j.push({name:"X-DCXVID",value:q("X-DCXVID")});if(j.length){DCX.registerBridgeCallbacks([{enabled:true,cbType:"addRequestHeaders",cbFunction:function(){return j}}])}}function u(E){var B,A,z=false,D,C=l.appCookieWhitelist;if(!C||!C.length){return z}for(B=0,A=C.length;B<A&&!z;B+=1){D=C[B];if(D.regex){if(!D.cRegex){D.cRegex=new RegExp(D.regex,D.flags)}D.cRegex.lastIndex=0;z=D.cRegex.test(E)}else{z=(D===E)}}return z}function v(){var D,C,E,F={},A,J=document.cookie,B=[],I="",z="";if(!J){return}B=J.split("; ");for(D=0,E=B.length;D<E;D+=1){A=B[D];C=A.indexOf("=");if(C>=0){try{I=decodeURIComponent(A.substr(0,C))}catch(H){I=A.substr(0,C)}}z=A.substr(C+1);if(u(I)){try{F[I]=decodeURIComponent(z)}catch(G){F[I]=z}}}if(b&&!F[a]){F[a]=b}d.post({type:14,cookies:F})}return{init:function(){l=d.getConfig()||{};e(l);n()},destroy:function(){if(l.sessionIDUsesStorage){y(k,r)}},onevent:function(z){switch(z.type){case"screenview_load":if(t.getValue(l,"appCookieWhitelist.length",0)){n();v()}break;default:break}}}});
if (DCX && typeof DCX.addModule === "function") {
    DCX.addModule("performance", function(b) {
        var n = {
            loadReceived: false,
            unloadReceived: false,
            screenviewLoadReceived: false,
            screenviewUnLoadReceived: false,
            perfEventSent: false
        }, c, k = {}, g = 0, f = [], m, l = 0, s, q = b.utils;
        function t(w, u) {
            var y = 0
              , v = {}
              , z = ""
              , x = 0;
            if (!w || typeof w !== "object" || !w.navigationStart) {
                return {}
            }
            y = w.navigationStart;
            for (z in w) {
                if (Object.prototype.hasOwnProperty.call(w, z) || typeof w[z] === "number") {
                    x = w[z];
                    if (typeof x === "number" && x && z !== "navigationStart") {
                        v[z] = x - y
                    } else {
                        v[z] = x
                    }
                }
            }
            return v
        }
        function e(w) {
            var x = 0, v, u;
            if (w) {
                v = (w.responseEnd > 0 && w.responseEnd < w.domLoading) ? w.responseEnd : w.domLoading;
                u = w.loadEventStart;
                if (q.isNumeric(v) && q.isNumeric(u) && u > v) {
                    x = u - v
                }
            }
            return x
        }
        function a(v) {
            var u = b.getStartTime();
            if (v.timestamp > u && !l) {
                l = v.timestamp - u
            }
        }
        function o(B) {
            var x = "UNKNOWN", w = {
                type: 7,
                performance: {}
            }, y, D, C, u, z, A, v;
            if (!B || n.perfEventSent) {
                return
            }
            D = B.performance || {};
            v = D.timing;
            y = D.navigation;
            if (v) {
                if (!v.loadEventStart) {
                    return
                }
                w.performance.timing = t(v, s.filter);
                w.performance.timing.renderTime = e(v)
            } else {
                if (s.calculateRenderTime) {
                    w.performance.timing = {
                        renderTime: l,
                        calculated: true
                    }
                } else {
                    return
                }
            }
            if (s.renderTimeThreshold && w.performance.timing.renderTime > s.renderTimeThreshold) {
                w.performance.timing.invalidRenderTime = w.performance.timing.renderTime;
                delete w.performance.timing.renderTime
            }
            if (D.getEntriesByType) {
                C = D.getEntriesByType("paint");
                for (z = 0,
                A = C.length; z < A; z += 1) {
                    u = C[z];
                    if (u.startTime > 0) {
                        w.performance.timing[u.name] = Math.round(u.startTime)
                    }
                }
            }
            if (y) {
                switch (y.type) {
                case 0:
                    x = "NAVIGATE";
                    break;
                case 1:
                    x = "RELOAD";
                    break;
                case 2:
                    x = "BACKFORWARD";
                    break;
                default:
                    x = "UNKNOWN";
                    break
                }
                w.performance.navigation = {
                    type: x,
                    redirectCount: y.redirectCount
                }
            }
            b.post(w);
            n.perfEventSent = true
        }
        function h() {
            if (!k.lcp && !k.fid && !k.cls) {
                return
            }
            var u = {
                type: 7,
                performance: {
                    metricsSummary: {
                        lcp: k.lcp,
                        fid: k.fid,
                        cls: k.cls
                    }
                }
            };
            b.post(u);
            r()
        }
        function r() {
            k = {}
        }
        function d(u) {
            switch (u.entryType) {
            case "largest-contentful-paint":
                k.lcp = Math.round(u.startTime);
                break;
            case "first-input":
                k.fid = Math.round(u.processingStart - u.startTime);
                break;
            case "layout-shift":
                j(u);
                break
            }
            if (typeof k.lcp !== "undefined" && typeof k.fid !== "undefined" && typeof k.cls !== "undefined") {
                h()
            }
        }
        function j(v) {
            if (!v.hadRecentInput) {
                var w = f[0] || v;
                var u = f[f.length - 1] || v;
                if (g && v.startTime - u.startTime < 1000 && v.startTime - w.startTime < 5000) {
                    g += v.value;
                    f.push(v)
                } else {
                    g = v.value;
                    f = [v]
                }
                if (g > m.value) {
                    m.value = g;
                    m.entries = f
                }
            }
        }
        function p() {
            if (m.value > 0) {
                k.cls = Number(m.value.toFixed(2))
            }
        }
        function i() {
            p();
            h();
            g = 0;
            f = [];
            m = {
                value: 0,
                entries: []
            };
            r()
        }
        return {
            init: function() {
                s = b.getConfig();
                g = 0;
                f = [];
                m = {
                    value: 0,
                    entries: []
                };
                c = new PerformanceObserver(function(u) {
                    u.getEntries().forEach(function(v) {
                        d(v)
                    })
                }
                );
                c.observe({
                    type: "largest-contentful-paint",
                    buffered: true
                });
                c.observe({
                    type: "first-input",
                    buffered: true
                });
                c.observe({
                    type: "layout-shift",
                    buffered: true
                });
                window.addEventListener("visibilitychange", function() {
                    if (document.visibilityState === "hidden") {
                        p()
                    }
                })
            },
            destroy: function() {
                s = null;
                c.disconnect()
            },
            onevent: function(u) {
                if (typeof u !== "object" || !u.type) {
                    return
                }
                switch (u.type) {
                case "load":
                    n.loadReceived = true;
                    a(u);
                    setTimeout(function() {
                        if (b.isInitialized()) {
                            o(window)
                        }
                    }, q.getValue(s, "delay", 2000));
                    if (!n.screenviewLoadReceived) {
                        h()
                    }
                    break;
                case "screenview_load":
                    n.screenviewLoadReceived = true;
                    if (!n.perfEventSent) {
                        o(window)
                    }
                    h();
                    break;
                case "screenview_unload":
                    n.screenviewUnLoadReceived = true;
                    i();
                    break;
                case "unload":
                    n.unloadReceived = true;
                    if (!n.screenviewUnLoadReceived) {
                        i()
                    }
                    if (!n.perfEventSent) {
                        o(window)
                    }
                    break;
                default:
                    break
                }
            },
            onmessage: function(u) {}
        }
    })
} else {}
DCX.addModule("rageClicks", function(b) {
    var r = DCX.getModuleConfig("rageClicks")
      , e = false;
    var f, c, a, p, t, i;
    var l = [], q = [], v = new Map(), g = new Map(), o = r.clickInterval || 4000, m = r.rageMin || 5, d = DCX.getCoreConfig(), h, u = function(x) {
        return x == f
    };
    function n() {
        if (p.getAttribute("data-dcxid")) {
            f = p.getAttribute("data-dcxid");
            a = "data-dcxid"
        } else {
            if (p.id) {
                f = p.id;
                a = "id"
            } else {
                f = b.getXPathFromNode(p);
                a = "xpath"
            }
        }
    }
    function s() {
        var y = g.get(f)
          , z = c - y;
        if (z <= o) {
            l.push(f)
        } else {
            g.set(f, c);
            for (var x = 0; x < l.length; x++) {
                if (l[x] === f) {
                    l.splice(x, 1)
                }
            }
            v["delete"](f);
            for (var x = 0; x < q.length; x++) {
                if (q[x] === f) {
                    q.splice(x, 1)
                }
            }
        }
    }
    function w() {
        const y = p.nodeName.toLowerCase();
        const z = y === "a";
        const x = z ? p.getAttribute("href") : null;
        const A = {
            type: 20,
            struggle: {
                struggleType: z ? "deadLink" : "rageclick",
                elementtype: a,
                element: f,
                linkHREF: x,
            },
        };
        if (!z) {
            delete A.struggle.linkHREF
        }
        b.post(A)
    }
    function k(y) {
        var x = q.filter(u);
        if (x.length <= 0) {
            v.set(f, y);
            q.push(f);
            w()
        }
    }
    function j() {
        e = true;
        document.addEventListener("click", function(x) {
            p = x.target;
            n();
            c = Date.now();
            if (!g.has(f)) {
                g.set(f, c)
            }
            if (g.has(f)) {
                s()
            }
            t = l.filter(u);
            i = t.length;
            if (i >= m) {
                k(i)
            }
        })
    }
    return {
        init: function() {
            r = b.getConfig()
        },
        destroy: function() {},
        onevent: function(x) {
            switch (x.type) {
            case "load":
                h = d.modules && d.modules.rageClicks && d.modules.rageClicks.enabled;
                if (h) {
                    j()
                }
                break;
            case "unload":
                e = false;
                break;
            default:
                break
            }
        },
        version: "1.3.2"
    }
});
DCX.addModule("replay", function(ac) {
    var T = ac.utils, F = 0, ah = {
        scale: 0,
        timestamp: 0
    }, aw = {}, aq = null, t = [], K = 0, Q = true, O = null, ag = null, A = false, o = 0, U = "", al = "", N = (new Date()).getTime(), n = 0, an = null, x = null, aa = null, ai = null, R = null, H = null, d = {}, P = {}, M = 0, X = 0, c = {
        inFocus: false
    }, ap = null, z = ac.getConfig() || {}, p = DCX.getCoreConfig(), W = DCX.getServiceConfig("domCapture"), f = W && W.options && W.options.salesforceDomCaptureConfig || {}, e = T.getValue(z, "viewPortWidthHeightLimit", 10000), k = 1, I = 1, J, y = {
        cellMaxX: 10,
        cellMaxY: 10,
        cellMinWidth: 20,
        cellMinHeight: 20
    };
    function S() {
        var ax;
        for (ax in aw) {
            if (aw.hasOwnProperty(ax)) {
                aw[ax].visitedCount = 0
            }
        }
    }
    function av(az) {
        var ax = false
          , ay = "|button|image|submit|reset|"
          , aA = null;
        if (typeof az !== "object" || !az.type) {
            return ax
        }
        switch (az.type.toLowerCase()) {
        case "input":
            aA = "|" + (az.subType || "") + "|";
            if (ay.indexOf(aA.toLowerCase()) === -1) {
                ax = false
            } else {
                ax = true
            }
            break;
        case "select":
        case "textarea":
            ax = false;
            break;
        default:
            ax = true;
            break
        }
        return ax
    }
    function am(ay) {
        var ax = [];
        ay = ay.parentNode;
        while (ay) {
            ax.push(ay);
            ay = ay.parentNode
        }
        return ax
    }
    function j(ax) {
        return T.some(ax, function(az) {
            var ay = T.getTagName(az);
            if (ay === "a" || ay === "button") {
                return az
            }
            return null
        })
    }
    function aj(ax) {
        var az = ax.type
          , ay = ax.target;
        if (typeof az === "string") {
            az = az.toLowerCase()
        } else {
            az = "unknown"
        }
        if (az === "blur") {
            az = "focusout"
        }
        if (az === "change") {
            if (ay.type === "INPUT") {
                switch (ay.subType) {
                case "text":
                case "date":
                case "time":
                    az = ay.subType + "Change";
                    break;
                default:
                    az = "valueChange";
                    break
                }
            } else {
                if (ay.type === "TEXTAREA") {
                    az = "textChange"
                } else {
                    az = "valueChange"
                }
            }
        }
        return az
    }
    function i(ax, az, ay) {
        var aA = null;
        if (!ax) {
            return aA
        }
        az = az || {};
        az.eventOn = Q;
        Q = false;
        if (ay) {
            aA = "dcid-" + T.getSerialNumber() + "." + (new Date()).getTime() + "s";
            window.setTimeout(function() {
                az.dcid = aA;
                ac.performDOMCapture(ax, az)
            }, ay)
        } else {
            delete az.dcid;
            aA = ac.performDOMCapture(ax, az)
        }
        return aA
    }
    function at(ay, aK, az) {
        var aF, aD, aM = false, aA = {}, aL = false, aC, aH, aJ = null, aE = 0, aI, aG, ax, aB;
        if (!ay || (!aK && !az)) {
            return aJ
        }
        if (!aK && !(ay === "load" || ay === "unload")) {
            return aJ
        }
        z = ac.getConfig() || {};
        aL = T.getValue(z, "domCapture.enabled", false);
        if (!aL || T.isLegacyIE) {
            return aJ
        }
        aH = T.getValue(z, "domCapture.triggers") || [];
        for (aF = 0,
        aI = aH.length; !aM && aF < aI; aF += 1) {
            aC = aH[aF];
            if (aC.event === ay) {
                if (ay === "load" || ay === "unload") {
                    if (aC.screenviews) {
                        ax = aC.screenviews;
                        for (aD = 0,
                        aB = ax.length; !aM && aD < aB; aD += 1) {
                            aG = ax[aD];
                            switch (typeof aG) {
                            case "object":
                                if (!aG.cRegex) {
                                    aG.cRegex = new RegExp(aG.regex,aG.flags)
                                }
                                aG.cRegex.lastIndex = 0;
                                aM = aG.cRegex.test(az);
                                break;
                            case "string":
                                aM = (aG === az);
                                break;
                            default:
                                break
                            }
                        }
                    } else {
                        aM = true
                    }
                } else {
                    if (aC.targets) {
                        aM = (-1 !== T.matchTarget(aC.targets, aK))
                    } else {
                        aM = true
                    }
                }
            }
        }
        if (aM) {
            aE = aC.delay || (aC.event === "load" ? 7 : 0);
            aA.forceFullDOM = !!aC.fullDOMCapture;
            aJ = i(window.document, aA, aE)
        }
        return aJ
    }
    function ak(aI) {
        var aA, aB, aC = T.getValue(aI, "webEvent.target", {}), ax = aC.type, aE = aC.subType || "", ay = T.getDcType(aC), aF = am(T.getValue(aC, "element")), aH = null, aD = T.getValue(aC, "position.relXY"), aG = T.getValue(aI, "webEvent.subType", null), az = function(aJ) {
            if (aJ && aJ.element && aJ.element.id) {
                return aJ.element.id
            }
            return ""
        };
        aA = {
            timestamp: T.getValue(aI, "webEvent.timestamp", 0),
            type: 4,
            target: {
                origID: az(aC),
                id: aC.id || "",
                idType: aC.idType,
                name: aC.name,
                dcType: ay,
                type: ax,
                position: {
                    width: T.getValue(aC, "size.width"),
                    height: T.getValue(aC, "size.height")
                },
                currState: aI.currState || null
            },
            event: {
                dcEvent: aj(T.getValue(aI, "webEvent")),
                type: T.getValue(aI, "webEvent.type", "UNKNOWN")
            }
        };
        if (aA.target.origID === undefined || aA.target.origID === "") {
            delete aA.target.origID
        }
        if (aE) {
            aA.target.subType = aE
        }
        if (aD) {
            aA.target.position.relXY = aD
        }
        if (typeof aI.dwell === "number" && aI.dwell > 0) {
            aA.target.dwell = aI.dwell
        }
        if (typeof aI.visitedCount === "number") {
            aA.target.visitedCount = aI.visitedCount
        }
        if (typeof aI.prevState !== "undefined") {
            aA.prevState = aI.prevState
        }
        if (aG) {
            aA.event.subType = aG
        }
        aH = j(aF);
        aA.target.isParentLink = !!aH;
        if (aH) {
            if (aH.href) {
                aA.target.currState = aA.target.currState || {};
                aA.target.currState.href = aA.target.currState.href || aH.href
            }
            if (aH.value) {
                aA.target.currState = aA.target.currState || {};
                aA.target.currState.value = aA.target.currState.value || aH.value
            }
            if (aH.innerText || aH.textContent) {
                aA.target.currState = aA.target.currState || {};
                aA.target.currState.innerText = T.trim(aA.target.currState.innerText || aH.innerText || aH.textContent)
            }
        }
        if (T.isUndefOrNull(aA.target.currState)) {
            delete aA.target.currState
        }
        if (T.isUndefOrNull(aA.target.name)) {
            delete aA.target.name
        }
        return aA
    }
    function Z(ax) {
        ac.post(ax)
    }
    function au(aB) {
        var az = 0, ax, aC = aB.length, aE, aD, aA, aF = {
            mouseout: true,
            mouseover: true
        }, ay = [];
        for (az = 0; az < aC; az += 1) {
            aE = aB[az];
            if (!aE) {
                continue
            }
            if (aF[aE.event.type]) {
                ay.push(aE)
            } else {
                for (ax = az + 1; ax < aC && aB[ax]; ax += 1) {
                    if (!aF[aB[ax].event.type]) {
                        break
                    }
                }
                if (ax < aC) {
                    aD = aB[ax];
                    if (aD && aE.target.id === aD.target.id && aE.event.type !== aD.event.type) {
                        if (aE.event.type === "click") {
                            aA = aE;
                            aE = aD;
                            aD = aA
                        }
                        if (aD.event.type === "click") {
                            aE.target.position = aD.target.position;
                            az += 1
                        } else {
                            if (aD.event.type === "blur") {
                                aE.target.dwell = aD.target.dwell;
                                aE.target.visitedCount = aD.target.visitedCount;
                                aE.focusInOffset = aD.focusInOffset;
                                aE.target.position = aD.target.position;
                                az += 1
                            }
                        }
                        aB[ax] = null;
                        aB[az] = aE
                    }
                }
                ay.push(aB[az])
            }
        }
        for (aE = ay.shift(); aE; aE = ay.shift()) {
            if (!(aE && aE.type === 4 && aE.target && aE.target.ignore)) {
                ac.post(aE)
            }
        }
        aB.splice(0, aB.length)
    }
    function G(ax, ay) {
        if (typeof ax !== "string") {
            return
        }
        if (P[ax]) {
            P[ax].console.repeats = P[ax].console.repeats + 1
        } else {
            ac.post({
                type: 6,
                console: {
                    description: ax,
                    type: ay
                }
            });
            P[ax] = {
                console: {
                    description: ax,
                    repeats: 1,
                    type: ay,
                }
            }
        }
    }
    function ar(ay) {
        var aA = null, aB, aD = T.getValue(ay, "nativeEvent.message"), az = T.getValue(ay, "nativeEvent.filename", ""), ax = T.getValue(ay, "nativeEvent.lineno", -1), aC = T.getValue(ay, "nativeEvent.error");
        if (typeof aD !== "string") {
            return
        }
        if (az) {
            az = ac.normalizeUrl(az, 6)
        }
        if (aC && aC.stack) {
            aB = aC.stack.toString()
        } else {
            aB = (aD + " " + az + " " + ax).toString()
        }
        if (d[aB]) {
            d[aB].exception.repeats = d[aB].exception.repeats + 1
        } else {
            aA = {
                type: 6,
                exception: {
                    description: aD,
                    url: az,
                    line: ax
                }
            };
            ac.post(aA);
            d[aB] = {
                exception: {
                    description: aD,
                    url: az,
                    line: ax,
                    repeats: 1
                }
            }
        }
        o += 1
    }
    function v(ax, ay) {
        t.push(ak({
            webEvent: ax,
            id: ay,
            currState: T.getValue(ax, "target.state")
        }))
    }
    function V(ay, aA) {
        var aC = false, ax = false, aE, az, aF, aB = 0;
        if (!ay) {
            return
        }
        if (t.length === 0) {
            return
        }
        aA = aA || (aw[ay] ? aw[ay].webEvent : {});
        if (aA.type === "blur" || aA.type === "change") {
            aF = T.getValue(aA, "target.state", null)
        } else {
            if (aA.target) {
                aF = T.getTargetState(aA.target.element) || {}
            } else {
                aF = {}
            }
        }
        az = t[t.length - 1];
        if (aw[ay]) {
            az.focusInOffset = aw[ay].focusInOffset;
            az.target.visitedCount = aw[ay].visitedCount;
            if (aw[ay].focus) {
                aw[ay].dwell = Number(new Date()) - aw[ay].focus;
                az.target.dwell = aw[ay].dwell
            }
            if (!aw[ay].processedChange && aw[ay].prevState) {
                if (!T.isEqual(aw[ay].prevState, aF)) {
                    ax = true;
                    aA.type = "change";
                    az.event.type = aA.type;
                    az.event.dcEvent = aj(aA);
                    az.target.prevState = aw[ay].prevState;
                    az.target.currState = aF
                }
            }
        } else {
            aw[ay] = {}
        }
        if (az.event.type === "click") {
            if (!av(az.target)) {
                az.target.currState = aF;
                aC = true
            }
        } else {
            if (az.event.type === "focus") {
                aC = true
            }
        }
        if (aC) {
            az.event.type = "blur";
            az.event.dcEvent = "focusout"
        }
        if (!az.dcid) {
            aE = at(az.event.type, aA.target);
            if (aE) {
                az.dcid = aE
            }
        }
        c.inFocus = false;
        var aH = false
          , aG = f.events && f.events.ignoreInputTypeEvent
          , aD = f.events && f.events.observeDropdownEvent;
        if (aD && aD.triggerFullDom) {
            aH = D(t, c, aD)
        }
        if (aG) {
            w(t, aw, c)
        }
        au(t);
        ad(aH, aD)
    }
    function D(ax, ay, az) {
        return (ax && ax[0] && ax[0].type === 4 && ax[0].event && ax[0].event.type === "click" && ay && ay.target && ay.target.element && az.triggerFullDom.some(function(aA) {
            if (aA.closest && !aA.type) {
                return ay.target.element.closest(aA.closest)
            }
            if (aA.closest) {
                var aB = ay.target.element.closest("lightning-base-combobox-item");
                return aB && aB.closest(aA.closest)
            }
            return false
        }))
    }
    function w(aA, az, aB) {
        if (aA && aA[0] && aA[0].type === 4 && aA[0].event && aA[0].target && aA[0].event.type === "change") {
            if (aA[0].target.type === "input") {
                aA[0].target.ignore = true
            } else {
                if (aA[0].target.type === "lightning-primitive-input-simple") {
                    aD(aA, az, aB)
                } else {
                    if (aA[0].target.type === "lightning-combobox") {
                        ax()
                    } else {
                        if (aA[0].target.type === "lightning-radio-group") {
                            ay()
                        } else {
                            if (aA[0].target.type === "lightning-input") {
                                aC()
                            }
                        }
                    }
                }
            }
        }
        function aD() {
            var aG = aA[0].target;
            if (aG.name) {
                Object.keys(az).forEach(function(aH) {
                    if (az[aH] && az[aH].webEvent && az[aH].webEvent.target) {
                        if (az[aH].webEvent.target.name === aG.name && az[aH].webEvent.target.type !== "lightning-primitive-input-simple") {
                            aG.id = az[aH].webEvent.target.id;
                            aG.idType = az[aH].webEvent.target.idType;
                            aG.type = az[aH].webEvent.target.type;
                            if (!aG.currState && aB.target.element.value) {
                                aG.currState = {
                                    value: aB.target.element.value
                                }
                            }
                        }
                    }
                })
            } else {
                if (aB.target && aB.target.element && aB.target.type === "lightning-primitive-input-simple" && aB.target.element.shadowRoot) {
                    var aF = aB.target.element.shadowRoot.querySelector("input") || {};
                    var aE = aF.id;
                    if (aE && az[aE]) {
                        aG.id = az[aE].webEvent.target.id;
                        aG.idType = az[aE].webEvent.target.idType;
                        aG.type = az[aE].webEvent.target.type;
                        if (!aG.currState && aB.target.element.value) {
                            aG.currState = {
                                value: aB.target.element.value
                            }
                        }
                    }
                }
            }
        }
        function ax() {
            if (aA[0].target.name) {
                Object.keys(az).forEach(function(aE) {
                    if (az[aE] && az[aE].webEvent && az[aE].webEvent.target && az[aE].webEvent.target.name === aA[0].target.name && az[aE].webEvent.target.name !== undefined && aA[0].target.name !== undefined && az[aE].webEvent.target.type !== "lightning-combobox") {
                        aA[0].target.id = az[aE].webEvent.target.id;
                        aA[0].target.idType = az[aE].webEvent.target.idType;
                        aA[0].target.type = az[aE].webEvent.target.type;
                        if (!aA[0].target.currState && aB.target.element.value) {
                            aA[0].target.currState = {
                                innerText: aB.target.element.value
                            }
                        }
                    }
                })
            }
        }
        function ay() {
            Object.keys(az).forEach(function(aE) {
                if (az[aE] && az[aE].webEvent && az[aE].webEvent.target && az[aE].webEvent.target.name !== undefined && aA[0].target.name !== undefined && az[aE].webEvent.target.name === aA[0].target.name && az[aE].webEvent.target.type !== "lightning-radio-group") {
                    aA[0].target.id = az[aE].webEvent.target.id;
                    aA[0].target.idType = az[aE].webEvent.target.idType;
                    aA[0].target.type = az[aE].webEvent.target.type
                }
            })
        }
        function aC() {
            Object.keys(az).forEach(function(aE) {
                if (az[aE] && az[aE].webEvent && az[aE].webEvent.target && az[aE].webEvent.target.name !== undefined && aA[0].target.name !== undefined && az[aE].webEvent.target.name === aA[0].target.name && az[aE].webEvent.target.type !== "lightning-input") {
                    aA[0].target.id = az[aE].webEvent.target.id;
                    aA[0].target.idType = az[aE].webEvent.target.idType;
                    aA[0].target.type = az[aE].webEvent.target.type
                }
            })
        }
    }
    function ad(ax, ay) {
        if (ax) {
            setTimeout(function() {
                var az = new CustomEvent(ay && ay.name || "dropDownCapture");
                document.dispatchEvent(az)
            }, 200)
        }
    }
    function g(ay, ax) {
        if (c.inFocus && c.target.id === ay) {
            return
        }
        if (c.inFocus) {
            V(c.target.id, c)
        }
        c = ax;
        c.inFocus = true;
        if (!aw[ay]) {
            aw[ay] = {}
        }
        aw[ay].focus = c.dwellStart = Number(new Date());
        aw[ay].focusInOffset = aa ? c.dwellStart - Number(aa) : -1;
        if (ax.type === "focus" || ax.type === "click") {
            aw[ay].prevState = T.getValue(ax, "target.state")
        }
        aw[ay].visitedCount = aw[ay].visitedCount + 1 || 1;
        aw[ay].webEvent = ax;
        aw[ay].processedChange = false;
        aw[ay].processedClick = false;
        v(ax, ay)
    }
    function E(aC, az) {
        var ay = false, aA, aB = t.length, ax = aB ? t[aB - 1] : null;
        if (!ax) {
            return ay
        }
        aA = ax.target.id;
        if (aA !== aC && ax.target.dcxype !== "selectList") {
            if (az.type === "focus" || az.type === "click" || az.type === "change") {
                V(aA);
                ay = true
            }
        }
        return ay
    }
    function s(az, ay) {
        var ax;
        g(az, ay);
        ax = t[t.length - 1];
        ax.event.type = "change";
        ax.event.dcEvent = aj(ay);
        ax.target.currState = ay.target.state;
        if (aw[az].prevState) {
            ax.target.prevState = aw[az].prevState
        }
        aw[az].webEvent = ay;
        aw[az].processedChange = true
    }
    function ao(aC) {
        var aB, aF, ay, ax, aA = T.getValue(aC, "target.element", {}), aG = T.getValue(aC, "target.size.width", aA.offsetWidth), az = T.getValue(aC, "target.size.height", aA.offsetHeight), aE = T.getValue(aC, "target.position.x", 0), aD = T.getValue(aC, "target.position.y", 0);
        aB = aG ? Math.max(aG / y.cellMaxX, y.cellMinWidth) : y.cellMinWidth;
        aF = az ? Math.max(az / y.cellMaxY, y.cellMinHeight) : y.cellMinHeight;
        ay = Math.floor(aE / aB);
        ax = Math.floor(aD / aF);
        if (!isFinite(ay)) {
            ay = 0
        }
        if (!isFinite(ax)) {
            ax = 0
        }
        return ay + "," + ax
    }
    function B(aA, az) {
        var ay, ax;
        if (az.target.type === "select" && ap && ap.target.id === aA) {
            ap = null;
            return
        }
        g(aA, az);
        ay = ao(az);
        az.target.position.relXY = ay;
        ax = t[t.length - 1];
        ax.event.type = "click";
        ax.event.dcEvent = aj(az);
        ax.target.position.relXY = ay;
        aw[aA].webEvent = az;
        aw[aA].processedClick = true;
        if (av(az.target)) {
            V(aA, az)
        }
        ap = az
    }
    function a(ay) {
        var ax = ay.orientation
          , az = {
            type: 4,
            event: {
                type: "orientationchange"
            },
            target: {
                prevState: {
                    orientation: F,
                    orientationMode: T.getOrientationMode(F)
                },
                currState: {
                    orientation: ax,
                    orientationMode: T.getOrientationMode(ax)
                }
            }
        };
        Z(az);
        F = ax
    }
    function b(ay) {
        var ax = false;
        if (!ay) {
            return ax
        }
        ax = (ah.scale === ay.scale && Math.abs((new Date()).getTime() - ah.timestamp) < 500);
        return ax
    }
    function L(ax) {
        ah.scale = ax.scale;
        ah.rotation = ax.rotation;
        ah.timestamp = (new Date()).getTime()
    }
    function u() {
        var ax, ay;
        ax = k - I;
        if (isNaN(ax)) {
            ay = "INVALID"
        } else {
            if (ax < 0) {
                ay = "CLOSE"
            } else {
                if (ax > 0) {
                    ay = "OPEN"
                } else {
                    ay = "NONE"
                }
            }
        }
        return ay
    }
    function q(aB) {
        var aG = document.documentElement || {}, aD = document.body || {}, aH = window.screen, ay = aH.width, az = aH.height, aC = T.getValue(aB, "orientation", 0), aE = !T.isiOS ? ay : Math.abs(aC) === 90 ? az : ay, aA = {
            type: 1,
            clientState: {
                pageWidth: document.width || (!aG ? 0 : aG.offsetWidth),
                pageHeight: Math.max((!document.height ? 0 : document.height), (!aG ? 0 : aG.offsetHeight), (!aG ? 0 : aG.scrollHeight)),
                viewPortWidth: window.innerWidth || aG.clientWidth,
                viewPortHeight: window.innerHeight || aG.clientHeight,
                viewPortX: Math.round(window.pageXOffset || (!aG ? (!aD ? 0 : aD.scrollLeft) : aG.scrollLeft || 0)),
                viewPortY: Math.round(window.pageYOffset || (!aG ? (!aD ? 0 : aD.scrollTop) : aG.scrollTop || 0)),
                deviceOrientation: aC,
                event: T.getValue(aB, "type")
            }
        }, aF = aA.clientState, ax;
        ag = ag || aA;
        if (aF.event === "unload" && aF.viewPortHeight === aF.pageHeight && aF.viewPortWidth === aF.pageWidth) {
            if (ag.clientState.viewPortHeight < aF.viewPortHeight) {
                aF.viewPortHeight = ag.clientState.viewPortHeight;
                aF.viewPortWidth = ag.clientState.viewPortWidth
            }
        }
        if ((aF.viewPortY + aF.viewPortHeight) > aF.pageHeight) {
            aF.viewPortY = aF.pageHeight - aF.viewPortHeight
        }
        if (aF.viewPortY < 0) {
            aF.viewPortY = 0
        }
        ax = !aF.viewPortWidth ? 1 : (aE / aF.viewPortWidth);
        aF.deviceScale = ax.toFixed(3);
        aF.viewTime = 0;
        if (ai && R) {
            aF.viewTime = R.getTime() - ai.getTime()
        }
        if (aB.type === "scroll") {
            aF.viewPortXStart = ag.clientState.viewPortX;
            aF.viewPortYStart = ag.clientState.viewPortY
        }
        return aA
    }
    function Y() {
        var ax;
        if (O) {
            ax = O.clientState;
            if (ax.viewPortHeight > 0 && ax.viewPortHeight < e && ax.viewPortWidth > 0 && ax.viewPortWidth < e) {
                Z(O)
            }
            ag = O;
            O = null;
            ai = H || ai;
            R = null
        }
        Y.timeoutId = 0
    }
    function r(ax) {
        var ay = null;
        if (T.isOperaMini) {
            return
        }
        O = q(ax);
        if (ax.type === "scroll" || ax.type === "resize") {
            if (Y.timeoutId) {
                window.clearTimeout(Y.timeoutId)
            }
            Y.timeoutId = window.setTimeout(Y, T.getValue(z, "scrollTimeout", 2000))
        } else {
            if (ax.type === "touchstart" || ax.type === "load") {
                if (O) {
                    I = parseFloat(O.clientState.deviceScale)
                }
            } else {
                if (ax.type === "touchend") {
                    if (O) {
                        k = parseFloat(O.clientState.deviceScale);
                        Y()
                    }
                }
            }
        }
        if (ax.type === "load" || ax.type === "unload") {
            if (ax.type === "unload" && N) {
                ay = T.clone(O);
                ay.clientState.event = "attention";
                ay.clientState.viewTime = (new Date()).getTime() - N
            }
            Y();
            if (ay) {
                O = ay;
                Y()
            }
        }
        return O
    }
    function af(ay) {
        var ax = T.getValue(ay, "nativeEvent.touches.length", 0);
        if (ax === 2) {
            r(ay)
        }
    }
    function m(aA) {
        var az, ay = {}, aB = T.getValue(aA, "nativeEvent.rotation", 0) || T.getValue(aA, "nativeEvent.touches[0].webkitRotationAngle", 0), aC = T.getValue(aA, "nativeEvent.scale", 1), ax = null, aD = {
            type: 4,
            event: {
                type: "touchend"
            },
            target: {
                id: T.getValue(aA, "target.id"),
                idType: T.getValue(aA, "target.idType")
            }
        };
        az = T.getValue(aA, "nativeEvent.changedTouches.length", 0) + T.getValue(aA, "nativeEvent.touches.length", 0);
        if (az !== 2) {
            return
        }
        r(aA);
        ax = {
            rotation: aB ? aB.toFixed(2) : 0,
            scale: k ? k.toFixed(2) : 1
        };
        ax.pinch = u();
        ay.scale = I ? I.toFixed(2) : 1;
        aD.target.prevState = ay;
        aD.target.currState = ax;
        Z(aD)
    }
    function ae(aH, aA) {
        var aE = ["type", "name", "target.id"], az = null, aB, aD, aC = true, aF = 10, ay = 0, aG = 0, ax = 0;
        if (!aH || !aA || typeof aH !== "object" || typeof aA !== "object") {
            return false
        }
        for (aB = 0,
        aD = aE.length; aC && aB < aD; aB += 1) {
            az = aE[aB];
            if (T.getValue(aH, az) !== T.getValue(aA, az)) {
                aC = false;
                break
            }
        }
        if (aC) {
            aG = T.getValue(aH, "timestamp");
            ax = T.getValue(aA, "timestamp");
            if (!(isNaN(aG) && isNaN(ax))) {
                ay = Math.abs(T.getValue(aH, "timestamp") - T.getValue(aA, "timestamp"));
                if (isNaN(ay) || ay > aF) {
                    aC = false
                }
            }
        }
        return aC
    }
    function l(ax) {
        var az = {
            type: 4,
            event: {
                type: ax.type
            },
            target: {
                id: T.getValue(ax, "target.id"),
                idType: T.getValue(ax, "target.idType"),
                currState: T.getValue(ax, "target.state")
            }
        }, ay;
        ay = at(ax.type, ax.target);
        if (ay) {
            az.dcid = ay
        }
        Z(az)
    }
    function C(aC) {
        var aA = window.console;
        if (!aA) {
            return
        }
        var az = [];
        function ax(aF) {
            function aE(aG, aH) {
                if (typeof aH === "object" && aH !== null) {
                    if (aH instanceof HTMLElement) {
                        return aH.outerHTML
                    } else {
                        if (az.indexOf(aH) !== -1) {
                            return "[Circular Reference]"
                        }
                    }
                    az.push(aH)
                }
                return aH
            }
            return JSON.stringify(aF, aE)
        }
        function aD(aF) {
            var aE = aA[aF];
            aA[aF] = function() {
                var aG = Array.prototype.slice.apply(arguments);
                var aI = [];
                aG.forEach(function(aJ) {
                    try {
                        if (aJ instanceof Error) {
                            aJ.stack ? aI.push(aJ.stack + " ") : ((aJ.name ? aI.push(aJ.name + " ") : ""),
                            (aJ.message ? aI.push(aJ.message + " ") : ""))
                        } else {
                            aI.push(JSON.stringify(aJ))
                        }
                    } catch (aL) {
                        try {
                            aI.push(ax(aJ))
                        } catch (aK) {
                            aA.error('Unable to log this console message of type "' + aF + '" from UIC. Please check the console for additional details.')
                        }
                    }
                });
                var aH = aI.join(" ");
                G(aH, aF);
                aE.apply(aA, arguments)
            }
        }
        var ay = aC && aC.length ? aC : ["log", "warn", "info", "error"];
        for (var aB = 0; aB < ay.length; aB++) {
            aD(ay[aB])
        }
    }
    function h(ay) {
        var ax = T.getValue(z, "geolocation"), az;
        if (!ax || !ax.enabled) {
            return
        }
        az = ax.triggers || [];
        if (!az.length) {
            return
        }
        if (az[0].event === ay) {
            DCX.logGeolocation()
        }
    }
    function ab(aD, aB) {
        var aC, az = null, aA, ay, ax;
        if (aD && Object.keys(aD).length) {
            for (aC in aD) {
                if (aD.hasOwnProperty(aC)) {
                    aA = aD[aC].exception;
                    if (aA.repeats > 1) {
                        az = {
                            type: 6,
                            exception: aA
                        };
                        ac.post(az)
                    }
                    delete aD[aC]
                }
            }
        }
        if (p && p.captureConsole && p.captureConsole.enabled) {
            if (aB && Object.keys(aB).length) {
                for (var ay in aB) {
                    if (aB.hasOwnProperty(ay)) {
                        ax = aB[ay].console;
                        if (ax.repeats > 1) {
                            ac.post({
                                type: 6,
                                console: ax
                            })
                        }
                        delete aB[ay]
                    }
                }
            }
        }
    }
    return {
        init: function() {
            t = []
        },
        destroy: function() {
            V(aq);
            t = [];
            if (Y.timeoutId) {
                window.clearTimeout(Y.timeoutId);
                Y.timeoutId = 0
            }
            if (A) {
                A = false
            }
        },
        onevent: function(ay) {
            var aB = null, az = null, ax, aA;
            if (typeof ay !== "object" || !ay.type) {
                return
            }
            if (ae(ay, an)) {
                an = ay;
                return
            }
            an = ay;
            aB = T.getValue(ay, "target.id");
            if (!aw[aB]) {
                aw[aB] = {}
            }
            E(aB, ay);
            switch (ay.type) {
            case "hashchange":
                break;
            case "focus":
                az = g(aB, ay);
                break;
            case "blur":
                az = V(aB, ay);
                break;
            case "click":
                az = B(aB, ay);
                break;
            case "change":
                az = s(aB, ay);
                break;
            case "orientationchange":
                az = a(ay);
                break;
            case "touchstart":
                af(ay);
                break;
            case "touchend":
                az = m(ay);
                break;
            case "loadWithFrames":
                DCX.logScreenviewLoad("rootWithFrames");
                break;
            case "load":
                if (p && p.captureConsole && p.captureConsole.enabled) {
                    C(p.captureConsole.methods)
                }
                F = ay.orientation;
                ai = new Date();
                if (typeof window.orientation !== "number" || T.isAndroid) {
                    aA = (window.screen.width > window.screen.height ? 90 : 0);
                    ax = window.orientation;
                    if (Math.abs(ax) !== aA && !(ax === 180 && aA === 0)) {
                        T.isLandscapeZeroDegrees = true;
                        if (Math.abs(ax) === 180 || Math.abs(ax) === 0) {
                            F = 90
                        } else {
                            if (Math.abs(ax) === 90) {
                                F = 0
                            }
                        }
                    }
                }
                setTimeout(function() {
                    if (ac.isInitialized()) {
                        r(ay)
                    }
                }, 100);
                h(ay.type);
                DCX.logScreenviewLoad("root");
                break;
            case "screenview_load":
                aa = new Date();
                S();
                az = at("load", null, ay.name);
                break;
            case "screenview_unload":
                ab(d, P);
                az = at("unload", null, ay.name);
                break;
            case "resize":
            case "scroll":
                if (!R) {
                    R = new Date()
                }
                H = new Date();
                r(ay);
                break;
            case "unload":
                ab(d, P);
                if (t != null) {
                    au(t)
                }
                R = new Date();
                r(ay);
                DCX.logScreenviewUnload("root");
                break;
            case "error":
                ar(ay);
                break;
            default:
                l(ay);
                break
            }
            aq = aB;
            return az
        },
        onmessage: function() {}
    }
});
if (DCX && typeof DCX.addModule === "function") {
    DCX.addModule("usability", function(e) {
        var A = e.utils
          , p = {}
          , C = {
            updateInterval: 250,
            hoverThreshold: 1000,
            hoverThresholdMax: 2 * 60 * 1000,
            gridCellMaxX: 10,
            gridCellMaxY: 10,
            gridCellMinWidth: 20,
            gridCellMinHeight: 20
        }
          , d = 50;
        function y(I) {
            var H = e.getConfig() || {}
              , J = H[I];
            return typeof J === "number" ? J : C[I]
        }
        function G(O, I) {
            var N = A.getValue(O, "webEvent.target", {})
              , J = A.getValue(N, "element.tagName") || ""
              , K = J.toLowerCase() === "input" ? A.getValue(N, "element.type") : ""
              , H = A.getDcType(N)
              , L = function(P) {
                if (P && P.element && P.element.id) {
                    return P.element.id
                }
                return ""
            }
              , M = {
                type: 9,
                event: {
                    hoverDuration: O.hoverDuration,
                    hoverToClick: A.getValue(I, "hoverToClick")
                },
                target: {
                    origID: L(N),
                    id: N.id || "",
                    idType: N.idType || "",
                    name: N.name || "",
                    dcType: H,
                    type: J,
                    subType: K,
                    position: {
                        width: A.getValue(N, "element.offsetWidth", 0),
                        height: A.getValue(N, "element.offsetHeight", 0),
                        relXY: O.relXY
                    }
                }
            };
            if ((typeof M.target.origID) === undefined || M.target.origID === "") {
                delete M.target.origID
            }
            if ((typeof M.target.id) === undefined || M.target.id === "") {
                return
            }
            e.post(M)
        }
        function i(H) {
            if (H && !H.nodeType && H.element) {
                H = H.element
            }
            return H
        }
        function s(H) {
            H = i(H);
            return !H || H === document.body || H === document.html || H === document
        }
        function j(H) {
            H = i(H);
            if (!H) {
                return null
            }
            return H.parentNode
        }
        function n(H) {
            H = i(H);
            if (!H) {
                return null
            }
            return H.offsetParent || H.parentElement || j(H)
        }
        function w(I, J) {
            var H = 0;
            if (!J || J === I) {
                return false
            }
            J = j(J);
            while (!s(J) && H++ < d) {
                if (J === I) {
                    return true
                }
                J = j(J)
            }
            if (H >= d) {
                A.clog("Usability isChildOf() hit iterations limit")
            }
            return false
        }
        function E(H) {
            if (H.nativeEvent) {
                H = H.nativeEvent
            }
            return H
        }
        function z(H) {
            return E(H).target
        }
        function h(H) {
            H = i(H);
            if (!H) {
                return -1
            }
            return H.nodeType || -1
        }
        function D(H) {
            H = i(H);
            if (!H) {
                return ""
            }
            return H.tagName ? H.tagName.toUpperCase() : ""
        }
        function t(H) {
            if (!H) {
                return
            }
            if (H.nativeEvent) {
                H = H.nativeEvent
            }
            if (H.stopPropagation) {
                H.stopPropagation()
            } else {
                if (H.cancelBubble) {
                    H.cancelBubble()
                }
            }
        }
        function m(I) {
            var H = D(I);
            return h(I) !== 1 || H === "TR" || H === "TBODY" || H === "THEAD"
        }
        function g(H) {
            if (!H) {
                return ""
            }
            if (H.xPath) {
                return H.xPath
            }
            H = i(H);
            return e.getXPathFromNode(H)
        }
        function B(I, H) {
            var J = p[I];
            if (J && J[H]) {
                return J[H]()
            }
        }
        function v(I, K, J, H) {
            this.xPath = I !== null ? g(I) : "";
            this.domNode = I;
            this.hoverDuration = 0;
            this.hoverUpdateTime = 0;
            this.gridX = Math.max(K, 0);
            this.gridY = Math.max(J, 0);
            this.parentKey = "";
            this.updateTimer = -1;
            this.disposed = false;
            this.childKeys = {};
            this.webEvent = H;
            this.getKey = function() {
                return this.xPath + ":" + this.gridX + "," + this.gridY
            }
            ;
            this.update = function() {
                var M = new Date().getTime()
                  , L = this.getKey();
                if (this.hoverUpdateTime !== 0) {
                    this.hoverDuration += M - this.hoverUpdateTime
                }
                this.hoverUpdateTime = M;
                clearTimeout(this.updateTimer);
                this.updateTimer = setTimeout(function() {
                    B(L, "update")
                }, y("updateInterval"))
            }
            ;
            this.dispose = function(L) {
                clearTimeout(this.updateTimer);
                delete p[this.getKey()];
                this.disposed = true;
                if (L) {
                    var M = this.clone();
                    p[M.getKey()] = M;
                    M.update()
                }
            }
            ;
            this.process = function(P) {
                clearTimeout(this.updateTimer);
                if (this.disposed) {
                    return false
                }
                var N = false
                  , O = this
                  , M = null
                  , L = 0;
                if (this.hoverDuration >= y("hoverThreshold")) {
                    this.hoverDuration = Math.min(this.hoverDuration, y("hoverThresholdMax"));
                    N = true;
                    G(this, {
                        hoverToClick: !!P
                    });
                    while (typeof O !== "undefined" && L++ < d) {
                        O.dispose(P);
                        O = p[O.parentKey]
                    }
                    if (L >= d) {
                        A.clog("Usability process() hit iterations limit")
                    }
                } else {
                    this.dispose(P)
                }
                return N
            }
            ;
            this.clone = function() {
                var L = new v(this.domNode,this.gridX,this.gridY);
                L.parentKey = this.parentKey;
                return L
            }
        }
        function F(J, H, K, I) {
            return new v(J,H,K,I)
        }
        function r(J) {
            if (J && J.position) {
                return {
                    x: J.position.x,
                    y: J.position.y
                }
            }
            J = i(J);
            var H = J && J.getBoundingClientRect ? J.getBoundingClientRect() : null
              , N = H ? H.left : (J ? J.offsetLeft : 0)
              , M = H ? H.top : (J ? J.offsetHeight : 0)
              , P = N
              , O = M
              , K = 0
              , I = 0
              , L = n(J)
              , Q = 0;
            while (L && Q++ < d) {
                if (s(L)) {
                    break
                }
                K = L.offsetLeft - (L.scrollLeft || 0);
                I = L.offsetTop - (L.scrollTop || 0);
                if (K !== P || I !== O) {
                    N += K;
                    M += I;
                    P = K;
                    O = I
                }
                L = n(L)
            }
            if (Q >= d) {
                A.clog("Usability calculateNodeOffset() hit iterations limit")
            }
            if (isNaN(N)) {
                N = 0
            }
            if (isNaN(M)) {
                M = 0
            }
            return {
                x: N,
                y: M
            }
        }
        function a(L, J, I) {
            L = i(L);
            var K = r(L)
              , H = J - K.x
              , M = I - K.y;
            if (!isFinite(H)) {
                H = 0
            }
            if (!isFinite(M)) {
                M = 0
            }
            return {
                x: H,
                y: M
            }
        }
        function x(H, I) {
            H = Math.floor(Math.min(Math.max(H, 0), 1) * 100) / 100;
            I = Math.floor(Math.min(Math.max(I, 0), 1) * 100) / 100;
            return H + "," + I
        }
        function f(L, O, N) {
            L = i(L);
            var J = L.getBoundingClientRect ? L.getBoundingClientRect() : null
              , T = J ? J.width : L.offsetWidth
              , K = J ? J.height : L.offsetHeight
              , M = T && T > 0 ? Math.max(T / y("gridCellMaxX"), y("gridCellMinWidth")) : y("gridCellMinWidth")
              , Q = K && K > 0 ? Math.max(K / y("gridCellMaxY"), y("gridCellMinHeight")) : y("gridCellMinHeight")
              , I = Math.floor(O / M)
              , H = Math.floor(N / Q)
              , S = T > 0 ? O / T : 0
              , P = K > 0 ? N / K : 0
              , R = "";
            if (!isFinite(I)) {
                I = 0
            }
            if (!isFinite(H)) {
                H = 0
            }
            R = x(S, P);
            return {
                x: I,
                y: H,
                relXY: R
            }
        }
        function c(M) {
            var N = M
              , O = M.getKey()
              , I = {}
              , J = null
              , L = null
              , K = false
              , H = 0;
            I[O] = true;
            while (typeof N !== "undefined" && H++ < d) {
                I[N.parentKey] = true;
                if (N.parentKey === "" || N.parentKey === N.getKey()) {
                    break
                }
                if (H >= d) {
                    A.clog("Usability cleanupHoverEvents() hit iterations limit")
                }
                N = p[N.parentKey]
            }
            for (J in p) {
                if (p.hasOwnProperty(J) && !I[J]) {
                    N = p[J];
                    if (N) {
                        if (!K) {
                            K = N.process()
                        } else {
                            N.dispose()
                        }
                    }
                }
            }
        }
        function u(I, K) {
            var L = null
              , H = null
              , J = false;
            for (H in p) {
                if (p.hasOwnProperty(H)) {
                    L = p[H];
                    if (L && L.domNode === I && L.getKey() !== K) {
                        if (!J) {
                            J = L.process()
                        } else {
                            L.dispose()
                        }
                    }
                }
            }
        }
        function b(L, J, K) {
            if (!J) {
                J = L.target
            }
            if (s(J)) {
                return null
            }
            if (A.isiOS || A.isAndroid) {
                return null
            }
            var H, Q, M, P, N, O, I;
            if (!m(J)) {
                H = a(J, L.position.x, L.position.y);
                Q = f(J, H.x, H.y);
                M = new v(J,Q.x,Q.y,L);
                M.relXY = Q.relXY;
                P = M.getKey();
                if (p[P]) {
                    M = p[P]
                } else {
                    p[P] = M
                }
                M.update();
                if (!K) {
                    I = n(J);
                    if (I) {
                        O = b(L, I, true);
                        if (O !== null) {
                            N = O.getKey();
                            P = M.getKey();
                            if (P !== N) {
                                M.parentKey = N
                            }
                        }
                    }
                    c(M)
                }
            } else {
                M = b(L, n(J), K)
            }
            return M
        }
        function q(H) {
            H = E(H);
            if (w(H.target, H.relatedTarget)) {
                return
            }
            u(H.target)
        }
        function l(J) {
            var K = null
              , H = null
              , I = false;
            for (H in p) {
                if (p.hasOwnProperty(H)) {
                    K = p[H];
                    if (K) {
                        if (!I) {
                            I = K.process(true)
                        } else {
                            K.dispose()
                        }
                    }
                }
            }
        }
        function o(H) {
            e.performFormCompletion(true)
        }
        function k(I) {
            var H = A.getValue(I, "target.id");
            if (!H) {
                return
            }
            switch (I.type) {
            case "mousemove":
                b(I);
                break;
            case "mouseout":
                q(I);
                break;
            case "click":
                l(I);
                break;
            case "submit":
                o(I);
                break;
            default:
                break
            }
        }
        return {
            init: function() {},
            destroy: function() {
                var I, H;
                for (I in p) {
                    if (p.hasOwnProperty(I)) {
                        p[I].dispose();
                        delete p[I]
                    }
                }
            },
            onevent: function(H) {
                if (typeof H !== "object" || !H.type) {
                    return
                }
                k(H)
            },
            onmessage: function(H) {},
            createHoverEvent: F,
            cleanupHoverEvents: c,
            eventMap: p
        }
    })
}
;
/* AjaxListener 1.07 */
DCX.addModule("ajaxListener", function(N) {
    var C = {}, w = false, m, A, k, v, j, f, O = N.utils;
    function i(R) {
        var T, P, U, S = false, Q = C.urlBlocklist;
        if (!R || !Q) {
            return S
        }
        for (T = 0,
        P = Q.length; !S && T < P; T += 1) {
            U = Q[T];
            S = U.cRegex.test(R)
        }
        return S
    }
    function r(R, W, Q) {
        var T, P, U = {}, V = C.filters, S;
        if (!V || !V.length) {
            return U
        }
        for (T = 0,
        P = V.length,
        S = false; !S && T < P; T += 1) {
            U = V[T];
            S = true;
            if (U.url) {
                S = U.url.cRegex.test(R)
            }
            if (S && U.method) {
                S = U.method.cRegex.test(W)
            }
            if (S && U.status) {
                S = U.status.cRegex.test(Q)
            }
        }
        if (!S) {
            U = null
        }
        return U
    }
    function g(T) {
        var V = {}, R, P, U, Q, S;
        T = T.split(/[\r\n]+/);
        for (R = 0,
        P = T.length; R < P; R += 1) {
            U = T[R].split(": ");
            Q = U[0];
            S = O.rtrim(U[1]);
            if (Q && Q.length) {
                V[Q] = S
            }
        }
        return V
    }
    function E(S, T, Q) {
        if (typeof S === "object" && S !== null) {
            for (var P in S) {
                if (P === T || (T instanceof RegExp && T.test(P))) {
                    S[P] = Q
                } else {
                    if (typeof S[P] === "object") {
                        E(S[P], T, Q)
                    }
                }
            }
        } else {
            if (typeof S === "string") {
                const R = new RegExp(T,"gi");
                S = S.replace(R, Q).trim()
            }
        }
        return S
    }
    function n(S, P) {
        if (typeof S !== "object" && typeof S !== "string") {
            return S
        }
        var R = S && JSON.stringify(S);
        try {
            P.forEach(function(T) {
                S = E(S, T.field, T.replacement)
            });
            return S
        } catch (Q) {
            console.error("Error occurred while hiding sensitive info:", Q);
            return typeof S === "string" ? S : JSON.parse(R)
        }
    }
    function J(S, R) {
        if (typeof S === "object") {
            var Q = JSON.stringify(S);
            try {
                S = Q;
                R.forEach(function(T) {
                    var V = T.pattern
                      , U = new RegExp(V.regex,V.flags);
                    if (U.test(S)) {
                        S = S.replace(U, T.replacement)
                    }
                });
                return JSON.parse(S)
            } catch (P) {
                console.error("wrong Privacy Pattern passed", P);
                return JSON.parse(Q)
            }
        } else {
            R.forEach(function(T) {
                var V = T.pattern
                  , U = new RegExp(V.regex,V.flags);
                if (U.test(S)) {
                    S = S.replace(U, T.replacement)
                }
            });
            return S
        }
    }
    function c(W, S) {
        var V = {
            type: 3,
            connectionEvent: {
                name: "ajaxListener",
                data: {
                    interfaceType: "XHR"
                }
            }
        }, R, Q = V.connectionEvent.data, P;
        if (!W) {
            return
        }
        R = document.createElement("a");
        R.href = W.tListener.url;
        Q.originalURL = R.host + (R.pathname[0] === "/" ? "" : "/") + R.pathname;
        Q.requestURL = N.normalizeUrl ? N.normalizeUrl(Q.originalURL, 3) : Q.originalURL;
        Q.description = "API Monitor - " + Q.requestURL;
        Q.method = W.tListener.method;
        Q.status = W.status;
        Q.statusText = W.statusText || "";
        Q.async = W.tListener.async;
        Q.ajaxResponseTime = W.tListener.end - W.tListener.start;
        Q.locationHref = N.normalizeUrl(document.location.href, 3);
        if (S.queryString && window.location.search) {
            Q.queryString = O.getQueryString(window.location.search)
        }
        if (S.requestHeaders) {
            Q.requestHeaders = W.tListener.reqHeaders
        }
        if (S.requestData && typeof W.tListener.reqData === "string" && !W.tListener.isSystemXHR) {
            Q.request = M(W.tListener.reqData, S.parseRequestString);
            if (S.privacyPatterns.length > 0 && Object.keys(Q.request).length) {
                try {
                    Q.request = J(Q.request, S.privacyPatterns)
                } catch (U) {}
            }
            if (S.sensitiveFields.length > 0 && Object.keys(Q.request).length) {
                try {
                    Q.request = n(Q.request, S.sensitiveFields)
                } catch (U) {}
            }
        }
        if (S.responseHeaders) {
            Q.responseHeaders = g(W.getAllResponseHeaders())
        }
        if (S.responseData) {
            if (typeof W.responseType === "undefined") {
                P = W.responseText
            } else {
                if (W.responseType === "" || W.responseType === "text") {
                    P = W.response
                } else {
                    if (W.responseType === "json") {
                        Q.response = W.response
                    } else {
                        Q.response = typeof W.response
                    }
                }
            }
            if (P) {
                try {
                    Q.response = JSON.parse(P)
                } catch (T) {
                    Q.response = P
                }
                if (S.privacyPatterns.length > 0 && Object.keys(Q.response).length) {
                    try {
                        Q.response = J(Q.response, S.privacyPatterns)
                    } catch (U) {}
                }
                if (S.sensitiveFields.length > 0 && Object.keys(Q.response).length) {
                    try {
                        Q.response = n(Q.response, S.sensitiveFields)
                    } catch (U) {}
                }
            }
            if (W.responseType) {
                Q.responseType = W.responseType
            }
        }
        N.post(V)
    }
    function e(R) {
        var T, S = {}, Q = R.entries(), P = Q.next();
        while (!P.done) {
            T = P.value;
            S[T[0]] = T[1];
            P = Q.next()
        }
        return S
    }
    function x(P) {
        return e(P)
    }
    function M(Q, P) {
        var S = Q;
        if (!Q) {
            return S
        }
        if (typeof Q === "object" && Q.toString().indexOf("FormData") !== -1) {
            S = e(Q)
        } else {
            if (typeof Q === "string") {
                try {
                    S = JSON.parse(Q)
                } catch (R) {
                    if (P) {
                        S = G(Q)
                    } else {
                        S = Q
                    }
                }
            }
        }
        return S
    }
    function G(Q) {
        try {
            var S = decodeURIComponent(Q);
            if (S === Q) {
                return Q
            }
            var T = new URLSearchParams(S);
            var P = {};
            T.forEach(function(V, U) {
                P[U] = V
            });
            return P
        } catch (R) {
            return Q
        }
    }
    function o(Q, X, T) {
        var P = {
            type: 3,
            connectionEvent: {
                name: "ajaxListener",
                data: {
                    interfaceType: "fetch"
                }
            }
        }, S, V = P.connectionEvent.data, W;
        S = document.createElement("a");
        S.href = Q.url;
        V.originalURL = S.host + (S.pathname[0] === "/" ? "" : "/") + S.pathname;
        V.requestURL = N.normalizeUrl ? N.normalizeUrl(V.originalURL, 3) : V.originalURL;
        V.description = "API Monitor - " + V.requestURL;
        V.method = Q.initData.method;
        V.status = X.status;
        V.statusText = X.statusText || "";
        V.async = true;
        V.ajaxResponseTime = Q.end - Q.start;
        V.responseType = X.type;
        V.locationHref = N.normalizeUrl(document.location.href, 3);
        if (T.queryString && window.location.search) {
            V.queryString = O.getQueryString(window.location.search)
        }
        if (T.requestHeaders) {
            var R;
            try {
                R = Q.initData.headers && Q.initData.headers.toString()
            } catch (U) {
                R = Q.initData.headers && JSON.stringify(Q.initData.headers)
            }
            if (R && R.indexOf("Headers") !== -1) {
                V.requestHeaders = x(Q.initData.headers)
            } else {
                V.requestHeaders = Q.initData.headers || ""
            }
        }
        if (T.requestData && typeof Q.body !== "undefined" && !Q.isSystemXHR) {
            V.request = M(Q.body, T.parseRequestString);
            if (T.privacyPatterns.length > 0 && Object.keys(V.request).length) {
                try {
                    V.request = J(V.request, T.privacyPatterns)
                } catch (U) {}
            }
            if (T.sensitiveFields.length > 0 && Object.keys(V.request).length) {
                try {
                    V.request = n(V.request, T.sensitiveFields)
                } catch (U) {}
            }
        }
        if (T.responseHeaders) {
            V.responseHeaders = x(X.headers)
        }
        if (T.responseData) {
            W = X.headers.get("content-type");
            if (W && W.indexOf("application/json") !== -1) {
                X.clone().json().then(function(Y) {
                    V.response = Y;
                    if (T.privacyPatterns.length > 0 && Object.keys(V.response).length) {
                        try {
                            V.response = J(V.response, T.privacyPatterns)
                        } catch (Z) {}
                    }
                    if (T.sensitiveFields.length > 0 && Object.keys(V.response).length) {
                        try {
                            V.response = n(V.response, T.sensitiveFields)
                        } catch (Z) {}
                    }
                    N.post(P)
                });
                return
            }
            if (W && (W.indexOf("text") !== -1 || W.indexOf("xml") !== -1)) {
                X.clone().text().then(function(Y) {
                    V.response = Y;
                    if (T.privacyPatterns.length > 0 && Object.keys(V.response).length) {
                        try {
                            V.response = J(V.response, T.privacyPatterns)
                        } catch (Z) {}
                    }
                    if (T.sensitiveFields.length > 0 && Object.keys(V.response).length) {
                        try {
                            V.response = n(V.response, T.sensitiveFields)
                        } catch (Z) {}
                    }
                    N.post(P)
                });
                return
            }
            V.response = "Not logging unsupported response content: " + W
        }
        N.post(P)
    }
    function b(T) {
        var R, Q = T.tListener.url, U = T.tListener.method, P = T.status.toString(), S = {
            requestHeaders: false,
            requestData: false,
            responseHeaders: false,
            responseData: false,
            parseRequestString: false
        };
        R = r(Q, U, P);
        if (R) {
            if (R.log) {
                S = R.log
            }
            c(T, S)
        }
    }
    function p(P, T) {
        var S, R = P.url, V = P.initData.method, Q = T.status.toString(), U = {
            requestHeaders: false,
            requestData: false,
            responseHeaders: false,
            responseData: false,
            parseRequestString: false
        };
        if (i(R)) {
            return
        }
        S = r(R, V, Q);
        if (S) {
            if (S.log) {
                U = S.log
            }
            o(P, T, U)
        }
    }
    function y(Q) {
        var R, P;
        if (!Q || !Q.target) {
            return
        }
        R = Q.target;
        P = R.readyState;
        if (P === 4) {
            R.removeEventListener("readystatechange", y);
            R.tListener.end = Date.now();
            b(R)
        }
    }
    function a(Q) {
        var P = Q.setRequestHeader;
        Q.setRequestHeader = function(U, S) {
            var T = this
              , R = T.tListener;
            if (U && U.length) {
                R.reqHeaders[U] = S
            }
            return P.apply(T, arguments)
        }
    }
    function H(P) {
        var Q = P.send;
        P.send = function(S) {
            var T = this
              , R = T.tListener;
            if (S) {
                R.reqData = S
            }
            R.start = Date.now();
            return Q.apply(T, arguments)
        }
    }
    function l(Q) {
        var R, P, S;
        P = DCX.getServiceConfig("queue");
        S = P.queues || [];
        for (R = 0; R < S.length; R += 1) {
            if (S[R].endpoint && Q.indexOf(S[R].endpoint) !== -1) {
                return true
            }
        }
        return false
    }
    function q(S, P, Q) {
        var R = this;
        if (w && !i(P)) {
            R.addEventListener("readystatechange", y);
            R.tListener = {
                method: S,
                url: P,
                async: (typeof Q === "undefined") ? true : !!Q,
                reqHeaders: {},
                isSystemXHR: l(P)
            };
            a(R);
            H(R)
        }
        return m.apply(R, arguments)
    }
    function I() {
        if (XMLHttpRequest) {
            m = XMLHttpRequest.prototype.open;
            XMLHttpRequest.prototype.open = q
        }
    }
    function B() {
        A = window.fetch;
        window.fetch = function(R, Q) {
            var S, P = t(R, Q);
            S = A.apply(this, arguments);
            return S.then(function(T) {
                z(P, T);
                return T
            })
        }
    }
    function t(S, R, Q) {
        var P = {};
        if (!(C && (Object.keys(C) || []).length) && Q) {
            C = Q;
            s(C)
        }
        if (typeof S === "object") {
            P.initData = S;
            P.url = S.url;
            P.initData.clone().text().then(function(T) {
                if (T.length > 0) {
                    P.body = T
                }
            })
        } else {
            P.initData = R || {};
            P.url = S;
            if (R && R.body) {
                P.body = R.body
            }
        }
        P.isSystemXHR = l(P.url);
        P.start = Date.now();
        return P
    }
    function z(P, Q) {
        P.end = Date.now();
        p(P, Q)
    }
    function F() {
        var Q = window.WebSocket;
        var P = function() {
            var R = new (Function.prototype.bind.apply(Q, [null].concat(Array.from(arguments))));
            d(R);
            return R
        };
        window.WebSocket = P
    }
    function d(P) {
        if (i(P.url)) {
            return
        }
        P.addEventListener("message", function(R) {
            D("Websocket", P, R)
        });
        var Q = P.send;
        P.send = function(R) {
            D("Websocket", P, {
                data: R
            });
            return Q.apply(this, arguments)
        }
    }
    function h() {
        var Q = window.EventSource;
        var P = function(S, R) {
            var T = new Q(S,R);
            u(T, R);
            return T
        };
        window.EventSource = P
    }
    function u(Q, P) {
        if (i(Q.url)) {
            return
        }
        Q.addEventListener("message", function(R) {
            D("Eventsource", Q, R, P)
        });
        Q.addEventListener("put", function(R) {
            D("Eventsource", Q, R, P)
        })
    }
    function D(U, R, S, P) {
        var T = {
            type: 3,
            connectionEvent: {
                name: "ajaxListener",
                data: {
                    interfaceType: U,
                }
            }
        };
        var Q = T.connectionEvent.data;
        Q.originalURL = R.url;
        Q.status = R.readyState;
        if (S.timeStamp) {
            Q.timestamp = S.timeStamp
        }
        P ? L(S.data, T, P) : L(S.data, T)
    }
    function L(T, V, P) {
        var R = V.connectionEvent.data;
        if (typeof T === "string") {
            try {
                T = JSON.parse(T)
            } catch (U) {}
        }
        var Q = r(R.originalURL, "", R.status);
        var S = {
            privacyPatterns: [],
            sensitiveFields: [],
            requestData: false,
            requestHeaders: false,
            responseHeaders: false,
            responseData: false,
            queryString: false
        };
        R.requestURL = N.normalizeUrl ? N.normalizeUrl(R.originalURL, 3) : R.originalURL;
        R.locationHref = N.normalizeUrl(document.location.href, 3);
        if (Q && Q.log) {
            S = Q.log
        }
        if (S.queryString && window.location.search) {
            R.queryString = O.getQueryString(window.location.search)
        }
        if (S.requestHeaders && P && P.headers) {
            R.requestHeaders = P.headers
        }
        if (S.responseData) {
            if (S.privacyPatterns.length > 0 && T) {
                try {
                    T = J(T, S.privacyPatterns)
                } catch (U) {}
            }
            if (S.sensitiveFields.length > 0 && T) {
                try {
                    T = n(T, S.sensitiveFields)
                } catch (U) {}
            }
            R.response = T
        }
        N.post(V)
    }
    function K(P) {
        if (P && P.regex) {
            P.cRegex = new RegExp(P.regex,P.flags)
        }
    }
    function s(R) {
        var S, P, T, U = [], Q = O.getValue(R, "skipSafetyCheck", false);
        if (R && R.filters) {
            U = R.filters
        }
        for (S = 0,
        P = U.length; S < P; S += 1) {
            T = U[S];
            O.forEach([T.url, T.method, T.status], K)
        }
        if (R && R.urlBlocklist) {
            O.forEach(R.urlBlocklist, K)
        }
        k = O.getValue(R, "xhrEnabled", true) && window.XMLHttpRequest;
        if (k && !Q && (XMLHttpRequest.toString().indexOf("[native code]") === -1 || XMLHttpRequest.toString().indexOf("XMLHttpRequest") === -1)) {
            k = false
        }
        v = O.getValue(R, "fetchEnabled", true) && window.fetch;
        if (v && !Q && window.fetch.toString().indexOf("[native code]") === -1) {
            v = false
        }
        j = O.getValue(R, "webSocketEnabled", false) && window.WebSocket;
        if (j && !Q && window.WebSocket.toString().indexOf("[native code]") === -1) {
            j = false
        }
        f = O.getValue(R, "eventSourceEnabled", false) && window.EventSource;
        if (f && !Q && window.EventSource.toString().indexOf("[native code]") === -1) {
            f = false
        }
    }
    return {
        init: function() {
            C = N.getConfig();
            s(C)
        },
        destroy: function() {
            w = false
        },
        onevent: function(P) {
            switch (P.type) {
            case "load":
                if (k) {
                    I()
                }
                if (v && !(this.onFetchReq && this.onFetchResolve)) {
                    B()
                }
                if (j) {
                    F()
                }
                if (f) {
                    h()
                }
                w = true;
                break;
            case "unload":
                w = false;
                break;
            default:
                break
            }
        },
        version: "1.0.7"
    }
});

/* Resource Monitor v1.1.8 */
DCX.addModule("resourceMonitor", function(a) {
    var h = DCX.getModuleConfig("resourceMonitor")
      , d = false
      , o = a.utils;
    var l = h.responseTime, i = h.blockInitiatorTypes || [], e = h.blocklist || [], p = o.getValue(h, "mixedModeViolation", false), b = {}, q, g = {};
    function r() {
        if (typeof window.location.host !== "undefined") {
            if (performance !== undefined) {
                var t = performance.getEntriesByType("resource");
                for (var s = 0; s < t.length; s++) {
                    f(t[s])
                }
            }
        }
    }
    function j(s) {
        for (var t = 0; t < e.length; ++t) {
            var u = e[t];
            if (s.indexOf(u) > -1) {
                return true
            }
        }
        return false
    }
    function f(x) {
        if (i.indexOf(x.initiatorType) === -1) {
            if (!b[x.name + "_" + x.fetchStart]) {
                var s = x.name;
                if (!j(s)) {
                    var u = (x.responseEnd).toFixed(2);
                    var w = (x.responseEnd - x.startTime).toFixed(2);
                    var t = (x.transferSize / 1024).toFixed(2);
                    if (w > l) {
                        var v = "Resource Monitor - " + x.initiatorType + " (" + (w / 1000).toFixed(2) + " secs)";
                        var z = {
                            description: v,
                            urlNormalized: a.normalizeUrl(s, 17),
                            urlFull: x.name,
                            initiator: x.initiatorType,
                            response_time: w,
                            total_time: u,
                            "size(kBytes)": t,
                            responseStatus: x.responseStatus
                        };
                        if (typeof DCX !== "undefined") {
                            a.post({
                                type: 17,
                                resourceMonitorData: z
                            })
                        }
                    }
                    b[x.name + "_" + x.fetchStart] = true
                }
            }
        }
        if (p && !j(x.name)) {
            var s = x.name || ""
              , u = (x.responseEnd).toFixed(2)
              , w = (x.responseEnd - x.startTime).toFixed(2)
              , t = (x.transferSize / 1024).toFixed(2)
              , y = location.protocol;
            if (s.startsWith("http://") && y === "https") {
                var v = "Mixed Mode violation - " + x.initiatorType + " (" + (w / 1000).toFixed(2) + " secs)";
                var z = {
                    description: v,
                    urlNormalized: a.normalizeUrl(s, 17),
                    urlFull: x.name,
                    initiator: x.initiatorType,
                    response_time: w,
                    total_time: u,
                    "size(kBytes)": t,
                    responseStatus: x.responseStatus
                };
                if (typeof DCX !== "undefined") {
                    a.post({
                        type: 17,
                        resourceMonitorData: z
                    })
                }
            }
        }
    }
    function n(s) {
        if (!j(s.blockedURI)) {
            if (g[s.blockedURI]) {
                g[s.blockedURI].repeats += 1
            } else {
                var t = {
                    description: "CSP Violation",
                    documentURI: s.documentURI,
                    referrer: a.normalizeUrl(s.referrer, 17),
                    blockedURI: a.normalizeUrl(s.blockedURI, 17),
                    violatedDirective: s.violatedDirective,
                    originalPolicy: s.originalPolicy,
                    sourceFile: s.sourceFile,
                    line: s.lineNumber,
                    columnNumber: s.columnNumber,
                    disposition: s.disposition,
                    responseStatus: s.responseStatus
                };
                if (typeof DCX !== "undefined") {
                    a.post({
                        type: 17,
                        resourceMonitorData: t
                    })
                }
                g[s.blockedURI] = t;
                g[s.blockedURI].repeats = 1
            }
        }
    }
    function k() {
        var t = (g && Object.keys(g) || []), s;
        for (s = 0; s < t.length; s++) {
            if (g && g[s] && g[s].repeats > 1) {
                a.post({
                    type: 17,
                    resourceMonitorData: g[s]
                })
            }
        }
        g = {}
    }
    function c() {
        try {
            q = new PerformanceObserver(function(t) {
                t.getEntries().forEach(function(u) {
                    f(u)
                })
            }
            );
            q.observe({
                entryTypes: ["resource"]
            })
        } catch (s) {}
        if (h.logCspViolations) {
            window.addEventListener("securitypolicyviolation", n)
        }
    }
    function m() {
        if (q) {
            q.disconnect();
            q = null
        }
    }
    return {
        init: function() {
            h = a.getConfig();
            c()
        },
        destroy: function() {
            b = {};
            m();
            k()
        },
        onevent: function(s) {
            switch (s.type) {
            case "unload":
                b = {};
                k();
                break;
            case "screenview_unload":
                k();
                break;
            default:
                break
            }
            if (typeof s !== "object" || !s.type) {
                return
            }
            if (s) {
                if (navigator.vendor.indexOf("Apple") > -1) {
                    setTimeout(function() {
                        if (document.readyState === "complete") {
                            r()
                        }
                    }, 300)
                } else {
                    r()
                }
            }
        },
        version: "1.1.8"
    }
});

/* UTM Campaign v1.3 */
DCX.addModule("utmLogger", function(c) {
    var k = {}, f = false, m, o = c.utils, p, i, b, r, q, n = [];
    function a(z, v) {
        var w = new Date();
        var y = {
            value: z,
            expiry: w.getTime() + v * (24 * 60 * 60 * 1000),
        };
        var x = "utmCampaign_" + y.expiry;
        localStorage.setItem(x, JSON.stringify(y));
        n.push(x)
    }
    function l() {
        var v = new Date();
        n = n.filter(function(x) {
            var w = localStorage.getItem(x);
            if (w) {
                var y = JSON.parse(w);
                if (v.getTime() < y.expiry) {
                    return true
                } else {
                    localStorage.removeItem(x);
                    q = Number(q) - 1;
                    localStorage.setItem("utmCount", q);
                    return false
                }
            }
            return false
        })
    }
    function e(v) {
        var w = JSON.parse(localStorage.getItem(v) || "{}");
        return w && w.value
    }
    function t(w, v) {
        w = w.replace(/[\[\]]/g, "\\$&");
        var y = new RegExp("[?&]" + w + "(=([^&#]*)|&|#|$)")
          , x = y.exec(v);
        if (!x) {
            return null
        }
        if (!x[2]) {
            return ""
        }
        return decodeURIComponent(x[2].replace(/\+/g, " "))
    }
    function h() {
        var x = s(), v;
        n = u();
        l();
        if (x) {
            if (!j(x)) {
                q = Number(q) + 1;
                localStorage.setItem("utmCount", q);
                a(x, p)
            }
        }
        if (Number(q) > 0 || x) {
            for (var w = 0; w < n.length; w++) {
                var x = {};
                x = e(n[w]);
                if (x) {
                    if (typeof DCX !== "undefined") {
                        v = {
                            type: 21,
                            utmData: x
                        };
                        c.post(v)
                    }
                }
                sessionStorage.setItem("utmLogger", true)
            }
        }
    }
    function s() {
        if (t("utm_campaign", window.location.href)) {
            return {
                utm_campaign: t("utm_campaign", window.location.href),
                utm_content: t("utm_content", window.location.href) || "",
                utm_medium: t("utm_medium", window.location.href) || "",
                utm_source: t("utm_source", window.location.href) || "",
                utm_term: t("utm_term", window.location.href) || "",
                DCXVID: localStorage.getItem("X-DCXVID") || "",
                TLTSID: r
            }
        }
        return null
    }
    function u() {
        return Object.keys(localStorage).filter(function(v) {
            return v.startsWith("utmCampaign_")
        }).reduce(function(v, w) {
            v.push(w);
            return v
        }, [])
    }
    function j(v) {
        return n.some(function(w) {
            const x = e(w);
            return (x && x.utm_campaign === v.utm_campaign && x.utm_content === v.utm_content && x.utm_medium === v.utm_medium && x.utm_source === v.utm_source && x.DCXVID === v.DCXVID && x.TLTSID === v.TLTSID)
        })
    }
    function g() {
        var w = DCX.getModuleConfig("DCCookie") || {}
          , v = w.sessionizationCookieName || "TLTSID"
          , x = o.getCookieValue(v);
        return x
    }
    function d(v) {
        m = o.getValue(v, "utmEnabled", false);
        p = o.getValue(v, "maxDays", 90),
        i = o.getValue(v, "maxCampaigns", 50),
        b = localStorage.getItem("X-DCXVID"),
        q = localStorage.getItem("utmCount") || 0,
        r = g()
    }
    return {
        init: function() {
            k = c.getConfig();
            d(k)
        },
        destroy: function() {
            f = false
        },
        onevent: function(v) {
            switch (v.type) {
            case "load":
                if (m) {
                    h()
                }
                f = true;
                break;
            case "unload":
                f = false;
                break;
            default:
                break
            }
        },
        version: "1.3"
    }
});

(function() {
    "use strict";
    var config, isReinitialized = false, DCX = window.DCX, changeTarget;

    if (DCX.getFlavor() === "w3c" && DCX.utils.isLegacyIE) {
        changeTarget = "input, select, textarea, button";
    }

    // *** DCX UIC CONFIGURATION BEGINS HERE ***
    config = {
        core: {
            blockedElements: [],
            version: {
                author: "HCL Discover",
                date: "7/29/2025",
            },
            doNotCaptureElements: [],
            inactivityTimeout: 25 * 60 * 1000,
            // 25 Minutes
            modules: {
                replay: {
                    events: [{
                        name: "change",
                        target: changeTarget,
                        recurseFrames: true,
                        attachToShadows: true
                    }, {
                        name: "click",
                        recurseFrames: true
                    }, {
                        name: "hashchange",
                        target: window
                    }, {
                        name: "focus",
                        target: changeTarget,
                        recurseFrames: true
                    }, {
                        name: "blur",
                        target: changeTarget,
                        recurseFrames: true
                    }, {
                        name: "load",
                        target: window
                    }, {
                        name: "unload",
                        target: window
                    }, {
                        name: "resize",
                        target: window
                    }, {
                        name: "scroll",
                        target: window
                    }, {
                        name: "orientationchange",
                        target: window
                    }, {
                        name: "touchend"
                    }, {
                        name: "touchstart"
                    }, ],
                },
                usability: {
                    events: [{
                        name: "click",
                        recurseFrames: true
                    }, {
                        name: "mousemove",
                        recurseFrames: true
                    }, {
                        name: "mouseout",
                        recurseFrames: true
                    }, {
                        name: "submit",
                        recurseFrames: true
                    }, ],
                },
                performance: {
                    events: [{
                        name: "load",
                        target: window
                    }, {
                        name: "unload",
                        target: window
                    }, ],
                },
                DCCookie: {
                    enabled: true,
                },
                rageClicks: {
                    enabled: true,
                    events: [{
                        name: "load",
                        target: window
                    }]
                },
                resourceMonitor: {
                    enabled: true,
                    events: [{
                        name: "screenview_load",
                        target: window
                    }, {
                        name: "load",
                        target: window
                    }]
                },
                ajaxListener: {
                    enabled: false,
                    events: [{
                        name: "load",
                        target: window
                    }]
                },
                utmLogger: {
                    enabled: true,
                    events: [{
                        name: "load",
                        target: window
                    }]
                }
            },
            normalization: {
                urlFunction: function(urlOrPath, messageType) {
                    return urlOrPath;
                }
            },
            sessionDataEnabled: false,
            sessionKeepAlive: false,
            sessionData: {
                sessionValueNeedsHashing: true,
                sessionQueryName: "sessionID",
                sessionQueryDelim: ";",
                sessionCookieName: "jsessionid",
            },
            screenviewAutoDetect: true,
            framesBlacklist: ["#iframe1"],
            captureConsole: {
                enabled: false,
                methods: []
            },
            screenViewBlocklist: [],
            screenViewAllowlist: []
        },
        services: {
            queue: {
                asyncReqOnUnload: true,
                useBeacon: true,
                useFetch: true,
                xhrLogging: false,
                //dcxWorker: window.fetch && window.Worker ? new Worker("dcxWorker.js") : null,
                queues: [{
                    qid: "DEFAULT",
                    endpoint: "https://unidiscover-packet-fwdr.prod.dcr.hxun.aws.now.hclsoftware.cloud/DiscoverUIPost.php",
                    maxEvents: 5,
                    timerInterval: 3000,
                    maxSize: 300000,
                    checkEndpoint: false,
                    encoder: "gzip",
                    endpointCheckTimeout: 3000
                }]
            },
            message: {
                maskVisiblePasswords: false,
                privacy: [{
                    targets: ["input[type=password]", ],
                    maskType: 2,
                }],
                privacyPatterns: []
            },
            serializer: {
                json: {
                    defaultToBuiltin: true,
                    parsers: ["JSON.parse"],
                    stringifiers: ["JSON.stringify"],
                }
            },
            encoder: {
                gzip: {
                    encode: "window.pako.gzip",
                    defaultEncoding: "gzip",
                }
            },
            domCapture: {
                diffEnabled: true,
                options: {
                    maxMutations: 200,
                    maxLength: 10000000,
                    captureFrames: false,
                    captureShadowDOM: false,
                    sendShadodomScript: false,
                    captureStyle: false,
                    keepImports: true,
                    removeComments: true,
                    removeScripts: true,
                    removeBase64: 50000,
                    captureJSS: false,
                    //customStyle: "#className {display: none;}"
                }
            },
            browser: {
                sizzleObject: "window.Sizzle",
                jQueryObject: "window.jQuery",
                /*blacklist: [{ regex: ".*", flags: "ig" }],*/
                customid: ["data-dcxid", "name"]
            }
        },
        modules: {
            usability: {
                hoverThreshold: 2000,
            },
            performance: {
                calculateRenderTime: true,
                renderTimeThreshold: 600000,
            },
            replay: {
                geolocation: {
                    enabled: false,
                    triggers: []
                },
                domCapture: {
                    enabled: true,
                    triggers: [{
                        event: "load",
                        fullDOMCapture: true,
                        delay: 300,
                    }, {
                        event: "click",
                        targets: ["input[type=radio]", "input[type=checkbox]"],
                        delay: 100,
                    }, {
                        event: "click"
                    }, {
                        event: "change"
                    }, ],
                },
            },
            DCCookie: {
                appCookieWhitelist: [{
                    regex: ".*",
                }, ],
                dcAppKey: ""
            },
            rageClicks: {
                clickInterval: 4000,
                rageMin: 5,
            },
            ajaxListener: {
                skipSafetyCheck: true,
                xhrEnabled: true,
                fetchEnabled: true,
                webSocketEnabled: true,
                eventSourceEnabled: true,
                urlBlocklist: [],
                filters: [{
                    log: {
                        status: {
                            regex: "^[3|4|5]\d\d$"
                        },
                        requestHeaders: true,
                        requestData: true,
                        responseHeaders: true,
                        responseData: true,
                        queryString: true,
                        parseRequestString: true,
                        sensitiveFields: [],
                        privacyPatterns: []
                    }
                }]
            },
            resourceMonitor: {
                responseTime: 2000,
                blockInitiatorTypes: [],
                blocklist: [],
                mixedModeViolation: true,
                logCspViolation: true
            },
            utmLogger: {
                utmEnabled: true,
                maxDays: 90,
                maxCampaigns: 50
            }
        }
    };

    if (document.documentMode === 11) {
        config.services.queue.useFetch = false;
        config.services.queue.useBeacon = false;
        config.services.queue.DCXWorker = false;
        config.services.message.privacyPatterns = [];
    }

    DCX.init(config);
}
)();
