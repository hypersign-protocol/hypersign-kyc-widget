var BlinkIDWasmSDK = (() => {
  var _scriptDir =
    typeof document !== "undefined" && document.currentScript
      ? document.currentScript.src
      : undefined;

  return function (BlinkIDWasmSDK = {}) {
    /*

 Copyright 2019 The Emscripten Authors
 SPDX-License-Identifier: MIT

 Copyright 2013 The Emscripten Authors
 SPDX-License-Identifier: MIT

 This file gets implicatly injected as a `--post-js` file when
 emcc is run with `--emrun`
*/
    var g;
    g || (g = typeof BlinkIDWasmSDK !== "undefined" ? BlinkIDWasmSDK : {});
    var aa, ba;
    g.ready = new Promise(function (a, b) {
      aa = a;
      ba = b;
    });
    g.Ob || (g.Ob = 0);
    g.Ob++;
    g.ENVIRONMENT_IS_PTHREAD ||
      g.$ww ||
      (function (a) {
        function b(m, n, r) {
          var p = new XMLHttpRequest();
          p.open("GET", m, !0);
          p.responseType = "arraybuffer";
          p.onprogress = function (q) {
            var k = n;
            q.total && (k = q.total);
            if (q.loaded) {
              p.tc
                ? (g.ob[m].loaded = q.loaded)
                : ((p.tc = !0),
                  g.ob || (g.ob = {}),
                  (g.ob[m] = { loaded: q.loaded, total: k }));
              var t = (k = q = 0),
                x;
              for (x in g.ob) {
                var z = g.ob[x];
                q += z.total;
                k += z.loaded;
                t++;
              }
              q = Math.ceil((q * g.Ob) / t);
              g.setStatus &&
                g.setStatus("Downloading data... (" + k + "/" + q + ")");
            } else !g.ob && g.setStatus && g.setStatus("Downloading data...");
          };
          p.onerror = function () {
            throw Error("NetworkError for: " + m);
          };
          p.onload = function () {
            if (
              200 == p.status ||
              304 == p.status ||
              206 == p.status ||
              (0 == p.status && p.response)
            )
              r(p.response);
            else throw Error(p.statusText + " : " + p.responseURL);
          };
          p.send(null);
        }
        function c(m) {
          console.error("package error:", m);
        }
        function d() {
          function m(q, k, t) {
            this.start = q;
            this.end = k;
            this.audio = t;
          }
          function n(q) {
            if (!q) throw "Loading data file failed." + Error().stack;
            if (q.constructor.name !== ArrayBuffer.name)
              throw "bad input to processPackageData" + Error().stack;
            q = new Uint8Array(q);
            m.prototype.xc = q;
            q = a.files;
            for (var k = 0; k < q.length; ++k)
              m.prototype.Xb[q[k].filename].onload();
            g.removeRunDependency(
              "datafile_/opt/jenkins/android-arm64-huawei-p30-pro/root/E0/sdk-blinkid-in-browser/resources/basic/BlinkIDWasmSDK.data",
            );
          }
          g.FS_createPath("/", "microblink", !0, !0);
          m.prototype = {
            Xb: {},
            open: function (q, k) {
              this.name = k;
              this.Xb[k] = this;
              g.addRunDependency("fp " + this.name);
            },
            send: function () {},
            onload: function () {
              this.finish(this.xc.subarray(this.start, this.end));
            },
            finish: function (q) {
              g.FS_createDataFile(this.name, null, q, !0, !0, !0);
              g.removeRunDependency("fp " + this.name);
              this.Xb[this.name] = null;
            },
          };
          for (var r = a.files, p = 0; p < r.length; ++p)
            new m(r[p].start, r[p].end, r[p].audio || 0).open(
              "GET",
              r[p].filename,
            );
          g.addRunDependency(
            "datafile_/opt/jenkins/android-arm64-huawei-p30-pro/root/E0/sdk-blinkid-in-browser/resources/basic/BlinkIDWasmSDK.data",
          );
          g.lc || (g.lc = {});
          g.lc[
            "/opt/jenkins/android-arm64-huawei-p30-pro/root/E0/sdk-blinkid-in-browser/resources/basic/BlinkIDWasmSDK.data"
          ] = { nd: !1 };
          l ? (n(l), (l = null)) : (h = n);
        }
        "object" === typeof window
          ? window.encodeURIComponent(
              window.location.pathname
                .toString()
                .substring(
                  0,
                  window.location.pathname.toString().lastIndexOf("/"),
                ) + "/",
            )
          : "undefined" === typeof process &&
            "undefined" !== typeof location &&
            encodeURIComponent(
              location.pathname
                .toString()
                .substring(0, location.pathname.toString().lastIndexOf("/")) +
                "/",
            );
        "function" !== typeof g.locateFilePackage ||
          g.locateFile ||
          ((g.locateFile = g.locateFilePackage),
          u(
            "warning: you defined Module.locateFilePackage, that has been renamed to Module.locateFile (using your locateFilePackage for now)",
          ));
        var e = g.locateFile
            ? g.locateFile("BlinkIDWasmSDK.data", "")
            : "BlinkIDWasmSDK.data",
          f = a.remote_package_size,
          h = null,
          l = g.getPreloadedPackage ? g.getPreloadedPackage(e, f) : null;
        l ||
          b(
            e,
            f,
            function (m) {
              h ? (h(m), (h = null)) : (l = m);
            },
            c,
          );
        g.calledRun ? d() : (g.preRun || (g.preRun = []), g.preRun.push(d));
      })({
        files: [
          {
            filename:
              "/microblink/Model_07c7ab860e77ec2e92bb822f6d62424b8595a5beb4340f6b2f7f6a4cffa5d050.strop",
            start: 0,
            end: 120418,
          },
          {
            filename:
              "/microblink/Model_2880751121560047e6dc571bc8ff4683aeb863886f7c0789234594ceb1e23577.strop",
            start: 120418,
            end: 124356,
          },
          {
            filename:
              "/microblink/Model_36d8e94f4cb46097bd6b7385f2aa91fcdee1a5fefeec59e56d1b9e82c94b00a7.strop",
            start: 124356,
            end: 494152,
          },
          {
            filename:
              "/microblink/Model_473ac5f5e256623c0a6b282698c1f1b033b9fb5359e6aa142e9fb4a4022afe4e.strop",
            start: 494152,
            end: 501034,
          },
          {
            filename:
              "/microblink/Model_4cd5265c0ff4b156aef99f1a065de02ebd81cd59c7da18a3335ff08761e94679.strop",
            start: 501034,
            end: 1438358,
          },
          {
            filename:
              "/microblink/Model_500f4403bf221021bb85c3e758d59f69841635787f6f4201a4ffe5e68733f8bb.strop",
            start: 1438358,
            end: 2021496,
          },
          {
            filename:
              "/microblink/Model_61057f0b3552585d0b521a4232a22a7708bdafc0182213276897a50447dbdcbe.strop",
            start: 2021496,
            end: 4993140,
          },
          {
            filename:
              "/microblink/Model_82ae7b860c6b4cb8249534e0004901bc46dee18fd3adbe535809abeefbf4fd88.strop",
            start: 4993140,
            end: 9711456,
          },
          {
            filename:
              "/microblink/Model_8326c5065a6d8451d6d004db73babf4a4a9f502c68643a14934cc098d04bf44f.strop",
            start: 9711456,
            end: 10128560,
          },
          {
            filename:
              "/microblink/Model_b452fd3cd4037080cfcb4c423dba5bc58c8ceafc28427fdf9c5778fb353f088e.strop",
            start: 10128560,
            end: 10135410,
          },
          {
            filename:
              "/microblink/Model_b4a5587987232550b8e116065e9312acfa386e289c67c2f61d3556ef1571b1ba.strop",
            start: 10135410,
            end: 10927924,
          },
          {
            filename:
              "/microblink/Model_d2bcaf18d17504513598e04f472c035b3d4f22d8653d5a79c05b4508a4b547b3.strop",
            start: 10927924,
            end: 11361440,
          },
          {
            filename:
              "/microblink/Model_e4f1f62f68ec44b71ecad3fb3f3b48fe3790beb5ab325611e17d63af06e9f644.strop",
            start: 11361440,
            end: 11417954,
          },
          {
            filename:
              "/microblink/Model_ed586fd6ca47c8eebb513c4ffaaacc2c54e92162b145062d7022519fba0911de.strop",
            start: 11417954,
            end: 12131186,
          },
          {
            filename:
              "/microblink/Model_faf688599c7e261a2a7404730f69ed029115bb0d3e7a3657731d88e701720efe.strop",
            start: 12131186,
            end: 12147924,
          },
          {
            filename: "/microblink/ccc_lookup_table.zzip",
            start: 12147924,
            end: 12168393,
          },
          {
            filename: "/microblink/face_detector_model.zzip",
            start: 12168393,
            end: 12265251,
          },
        ],
        remote_package_size: 12265251,
      });
    g.onAbort = function (a) {
      u("Aborted with message: " + a);
      try {
        throw new WebAssembly.RuntimeError(a);
      } catch (b) {
        u("Stacktrace: " + b.stack);
      }
    };
    var crypto = {
      getRandomValues: function (a) {
        for (var b = 0; b < a.length; b++) a[b] = (256 * Math.random()) | 0;
      },
    };
    if ("object" == typeof window) {
      g.arguments = window.location.search.substr(1).trim().split("&");
      for (let a = 0; a < g.arguments.length; ++a)
        g.arguments[a] = decodeURI(g.arguments[a]);
      g.arguments[0] || (g.arguments = []);
    }
    var ca = Object.assign({}, g),
      da = "./this.program",
      ea = (a, b) => {
        throw b;
      },
      fa = "object" == typeof window,
      ha = "function" == typeof importScripts,
      ia = "",
      ja,
      ka,
      la;
    if (fa || ha)
      ha
        ? (ia = self.location.href)
        : "undefined" != typeof document &&
          document.currentScript &&
          (ia = document.currentScript.src),
        _scriptDir && (ia = _scriptDir),
        (ia =
          0 !== ia.indexOf("blob:")
            ? ia.substr(0, ia.replace(/[?#].*/, "").lastIndexOf("/") + 1)
            : ""),
        (ja = (a) => {
          var b = new XMLHttpRequest();
          b.open("GET", a, !1);
          b.send(null);
          return b.responseText;
        }),
        ha &&
          (la = (a) => {
            var b = new XMLHttpRequest();
            b.open("GET", a, !1);
            b.responseType = "arraybuffer";
            b.send(null);
            return new Uint8Array(b.response);
          }),
        (ka = (a, b, c) => {
          var d = new XMLHttpRequest();
          d.open("GET", a, !0);
          d.responseType = "arraybuffer";
          d.onload = () => {
            200 == d.status || (0 == d.status && d.response)
              ? b(d.response)
              : c();
          };
          d.onerror = c;
          d.send(null);
        });
    var ma = g.print || console.log.bind(console),
      u = g.printErr || console.warn.bind(console);
    Object.assign(g, ca);
    ca = null;
    g.thisProgram && (da = g.thisProgram);
    g.quit && (ea = g.quit);
    var na;
    g.wasmBinary && (na = g.wasmBinary);
    var noExitRuntime = g.noExitRuntime || !1;
    "object" != typeof WebAssembly && oa("no native wasm support detected");
    var pa,
      qa = !1,
      ra,
      sa = "undefined" != typeof TextDecoder ? new TextDecoder("utf8") : void 0;
    function ta(a, b, c) {
      var d = b + c;
      for (c = b; a[c] && !(c >= d); ) ++c;
      if (16 < c - b && a.buffer && sa) return sa.decode(a.subarray(b, c));
      for (d = ""; b < c; ) {
        var e = a[b++];
        if (e & 128) {
          var f = a[b++] & 63;
          if (192 == (e & 224)) d += String.fromCharCode(((e & 31) << 6) | f);
          else {
            var h = a[b++] & 63;
            e =
              224 == (e & 240)
                ? ((e & 15) << 12) | (f << 6) | h
                : ((e & 7) << 18) | (f << 12) | (h << 6) | (a[b++] & 63);
            65536 > e
              ? (d += String.fromCharCode(e))
              : ((e -= 65536),
                (d += String.fromCharCode(
                  55296 | (e >> 10),
                  56320 | (e & 1023),
                )));
          }
        } else d += String.fromCharCode(e);
      }
      return d;
    }
    function v(a, b) {
      return a ? ta(w, a, b) : "";
    }
    function A(a, b, c, d) {
      if (!(0 < d)) return 0;
      var e = c;
      d = c + d - 1;
      for (var f = 0; f < a.length; ++f) {
        var h = a.charCodeAt(f);
        if (55296 <= h && 57343 >= h) {
          var l = a.charCodeAt(++f);
          h = (65536 + ((h & 1023) << 10)) | (l & 1023);
        }
        if (127 >= h) {
          if (c >= d) break;
          b[c++] = h;
        } else {
          if (2047 >= h) {
            if (c + 1 >= d) break;
            b[c++] = 192 | (h >> 6);
          } else {
            if (65535 >= h) {
              if (c + 2 >= d) break;
              b[c++] = 224 | (h >> 12);
            } else {
              if (c + 3 >= d) break;
              b[c++] = 240 | (h >> 18);
              b[c++] = 128 | ((h >> 12) & 63);
            }
            b[c++] = 128 | ((h >> 6) & 63);
          }
          b[c++] = 128 | (h & 63);
        }
      }
      b[c] = 0;
      return c - e;
    }
    function ua(a) {
      for (var b = 0, c = 0; c < a.length; ++c) {
        var d = a.charCodeAt(c);
        127 >= d
          ? b++
          : 2047 >= d
            ? (b += 2)
            : 55296 <= d && 57343 >= d
              ? ((b += 4), ++c)
              : (b += 3);
      }
      return b;
    }
    var C, w, va, D, E, G, wa, xa;
    function ya() {
      var a = pa.buffer;
      g.HEAP8 = C = new Int8Array(a);
      g.HEAP16 = va = new Int16Array(a);
      g.HEAP32 = E = new Int32Array(a);
      g.HEAPU8 = w = new Uint8Array(a);
      g.HEAPU16 = D = new Uint16Array(a);
      g.HEAPU32 = G = new Uint32Array(a);
      g.HEAPF32 = wa = new Float32Array(a);
      g.HEAPF64 = xa = new Float64Array(a);
    }
    var za,
      Aa = [],
      Ba = [],
      Ca = [],
      Da = [],
      Ea = !1,
      Fa = 0;
    function Ga() {
      var a = g.preRun.shift();
      Aa.unshift(a);
    }
    var Ha = 0,
      Ia = null,
      Ja = null;
    function Ka() {
      Ha++;
      g.monitorRunDependencies && g.monitorRunDependencies(Ha);
    }
    function La() {
      Ha--;
      g.monitorRunDependencies && g.monitorRunDependencies(Ha);
      if (0 == Ha && (null !== Ia && (clearInterval(Ia), (Ia = null)), Ja)) {
        var a = Ja;
        Ja = null;
        a();
      }
    }
    function oa(a) {
      if (g.onAbort) g.onAbort(a);
      a = "Aborted(" + a + ")";
      u(a);
      qa = !0;
      ra = 1;
      a = new WebAssembly.RuntimeError(
        a + ". Build with -sASSERTIONS for more info.",
      );
      ba(a);
      throw a;
    }
    function Ma(a) {
      return a.startsWith("data:application/octet-stream;base64,");
    }
    var Na;
    Na = "BlinkIDWasmSDK.wasm";
    if (!Ma(Na)) {
      var Oa = Na;
      Na = g.locateFile ? g.locateFile(Oa, ia) : ia + Oa;
    }
    function Pa(a) {
      try {
        if (a == Na && na) return new Uint8Array(na);
        if (la) return la(a);
        throw "both async and sync fetching of the wasm failed";
      } catch (b) {
        oa(b);
      }
    }
    function Qa(a) {
      return na || (!fa && !ha) || "function" != typeof fetch
        ? Promise.resolve().then(function () {
            return Pa(a);
          })
        : fetch(a, { credentials: "same-origin" })
            .then(function (b) {
              if (!b.ok) throw "failed to load wasm binary file at '" + a + "'";
              return b.arrayBuffer();
            })
            .catch(function () {
              return Pa(a);
            });
    }
    function Ra(a, b, c) {
      return Qa(a)
        .then(function (d) {
          return WebAssembly.instantiate(d, b);
        })
        .then(function (d) {
          return d;
        })
        .then(c, function (d) {
          u("failed to asynchronously prepare wasm: " + d);
          oa(d);
        });
    }
    function Sa(a, b) {
      var c = Na;
      return na ||
        "function" != typeof WebAssembly.instantiateStreaming ||
        Ma(c) ||
        "function" != typeof fetch
        ? Ra(c, a, b)
        : fetch(c, { credentials: "same-origin" }).then(function (d) {
            return WebAssembly.instantiateStreaming(d, a).then(b, function (e) {
              u("wasm streaming compile failed: " + e);
              u("falling back to ArrayBuffer instantiation");
              return Ra(c, a, b);
            });
          });
    }
    var J,
      K,
      Va = {
        355819: (a) => {
          a = v(a);
          throw Error(
            "Failed to reconfigure RecognizerRunner due to following error: " +
              a,
          );
        },
        355955: (a, b, c, d) => {
          a = v(a);
          b = v(b);
          c = v(c);
          d = v(d);
          throw Error(a + b + c + d);
        },
        356171: (a, b) => {
          a = v(a);
          b = v(b);
          throw Error(a + b);
        },
        356281: (a) => {
          throw Error(v(a));
        },
        356324: () => {
          throw Error(
            "Unable to perform that operation while recognizer is in use!",
          );
        },
        356407: () => {
          throw Error(
            "Unable to perform that operation while recognizer is in use!",
          );
        },
        356490: () => {
          throw Error(
            "Unable to perform that operation while recognizer is in use!",
          );
        },
      };
    function Wa(a) {
      this.name = "ExitStatus";
      this.message = "Program terminated with exit(" + a + ")";
      this.status = a;
    }
    function Xa(a) {
      for (; 0 < a.length; ) a.shift()(g);
    }
    function Ya(a) {
      this.Ra = a - 24;
      this.cd = function (b) {
        G[(this.Ra + 4) >> 2] = b;
      };
      this.$c = function (b) {
        G[(this.Ra + 8) >> 2] = b;
      };
      this.ad = function () {
        E[this.Ra >> 2] = 0;
      };
      this.Zc = function () {
        C[(this.Ra + 12) >> 0] = 0;
      };
      this.bd = function () {
        C[(this.Ra + 13) >> 0] = 0;
      };
      this.Kc = function (b, c) {
        this.Yc();
        this.cd(b);
        this.$c(c);
        this.ad();
        this.Zc();
        this.bd();
      };
      this.Yc = function () {
        G[(this.Ra + 16) >> 2] = 0;
      };
    }
    var Za = 0,
      $a = (a, b) => {
        for (var c = 0, d = a.length - 1; 0 <= d; d--) {
          var e = a[d];
          "." === e
            ? a.splice(d, 1)
            : ".." === e
              ? (a.splice(d, 1), c++)
              : c && (a.splice(d, 1), c--);
        }
        if (b) for (; c; c--) a.unshift("..");
        return a;
      },
      L = (a) => {
        var b = "/" === a.charAt(0),
          c = "/" === a.substr(-1);
        (a = $a(
          a.split("/").filter((d) => !!d),
          !b,
        ).join("/")) ||
          b ||
          (a = ".");
        a && c && (a += "/");
        return (b ? "/" : "") + a;
      },
      ab = (a) => {
        var b = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/
          .exec(a)
          .slice(1);
        a = b[0];
        b = b[1];
        if (!a && !b) return ".";
        b && (b = b.substr(0, b.length - 1));
        return a + b;
      },
      bb = (a) => {
        if ("/" === a) return "/";
        a = L(a);
        a = a.replace(/\/$/, "");
        var b = a.lastIndexOf("/");
        return -1 === b ? a : a.substr(b + 1);
      };
    function cb() {
      if (
        "object" == typeof crypto &&
        "function" == typeof crypto.getRandomValues
      ) {
        var a = new Uint8Array(1);
        return () => {
          crypto.getRandomValues(a);
          return a[0];
        };
      }
      return () => oa("randomDevice");
    }
    function db() {
      for (var a = "", b = !1, c = arguments.length - 1; -1 <= c && !b; c--) {
        b = 0 <= c ? arguments[c] : "/";
        if ("string" != typeof b)
          throw new TypeError("Arguments to path.resolve must be strings");
        if (!b) return "";
        a = b + "/" + a;
        b = "/" === b.charAt(0);
      }
      a = $a(
        a.split("/").filter((d) => !!d),
        !b,
      ).join("/");
      return (b ? "/" : "") + a || ".";
    }
    function eb(a, b) {
      var c = Array(ua(a) + 1);
      a = A(a, c, 0, c.length);
      b && (c.length = a);
      return c;
    }
    var fb = [];
    function gb(a, b) {
      fb[a] = { input: [], Xa: [], sb: b };
      hb(a, ib);
    }
    var ib = {
        open: function (a) {
          var b = fb[a.node.xb];
          if (!b) throw new M(43);
          a.Va = b;
          a.seekable = !1;
        },
        close: function (a) {
          a.Va.sb.Db(a.Va);
        },
        Db: function (a) {
          a.Va.sb.Db(a.Va);
        },
        read: function (a, b, c, d) {
          if (!a.Va || !a.Va.sb.ic) throw new M(60);
          for (var e = 0, f = 0; f < d; f++) {
            try {
              var h = a.Va.sb.ic(a.Va);
            } catch (l) {
              throw new M(29);
            }
            if (void 0 === h && 0 === e) throw new M(6);
            if (null === h || void 0 === h) break;
            e++;
            b[c + f] = h;
          }
          e && (a.node.timestamp = Date.now());
          return e;
        },
        write: function (a, b, c, d) {
          if (!a.Va || !a.Va.sb.Tb) throw new M(60);
          try {
            for (var e = 0; e < d; e++) a.Va.sb.Tb(a.Va, b[c + e]);
          } catch (f) {
            throw new M(29);
          }
          d && (a.node.timestamp = Date.now());
          return e;
        },
      },
      jb = {
        ic: function (a) {
          if (!a.input.length) {
            var b = null;
            "undefined" != typeof window && "function" == typeof window.prompt
              ? ((b = window.prompt("Input: ")), null !== b && (b += "\n"))
              : "function" == typeof readline &&
                ((b = readline()), null !== b && (b += "\n"));
            if (!b) return null;
            a.input = eb(b, !0);
          }
          return a.input.shift();
        },
        Tb: function (a, b) {
          null === b || 10 === b
            ? (ma(ta(a.Xa, 0)), (a.Xa = []))
            : 0 != b && a.Xa.push(b);
        },
        Db: function (a) {
          a.Xa && 0 < a.Xa.length && (ma(ta(a.Xa, 0)), (a.Xa = []));
        },
      },
      kb = {
        Tb: function (a, b) {
          null === b || 10 === b
            ? (u(ta(a.Xa, 0)), (a.Xa = []))
            : 0 != b && a.Xa.push(b);
        },
        Db: function (a) {
          a.Xa && 0 < a.Xa.length && (u(ta(a.Xa, 0)), (a.Xa = []));
        },
      };
    function lb(a) {
      a = 65536 * Math.ceil(a / 65536);
      var b = mb(65536, a);
      b ? (w.fill(0, b, b + a), (a = b)) : (a = 0);
      return a;
    }
    var N = {
      fb: null,
      hb: function () {
        return N.createNode(null, "/", 16895, 0);
      },
      createNode: function (a, b, c, d) {
        if (24576 === (c & 61440) || 4096 === (c & 61440)) throw new M(63);
        N.fb ||
          (N.fb = {
            dir: {
              node: {
                eb: N.Pa.eb,
                $a: N.Pa.$a,
                tb: N.Pa.tb,
                Hb: N.Pa.Hb,
                pc: N.Pa.pc,
                Nb: N.Pa.Nb,
                qc: N.Pa.qc,
                oc: N.Pa.oc,
                Kb: N.Pa.Kb,
              },
              stream: { lb: N.Qa.lb },
            },
            file: {
              node: { eb: N.Pa.eb, $a: N.Pa.$a },
              stream: {
                lb: N.Qa.lb,
                read: N.Qa.read,
                write: N.Qa.write,
                Zb: N.Qa.Zb,
                ub: N.Qa.ub,
                Ib: N.Qa.Ib,
              },
            },
            link: {
              node: { eb: N.Pa.eb, $a: N.Pa.$a, yb: N.Pa.yb },
              stream: {},
            },
            bc: { node: { eb: N.Pa.eb, $a: N.Pa.$a }, stream: nb },
          });
        c = ob(a, b, c, d);
        16384 === (c.mode & 61440)
          ? ((c.Pa = N.fb.dir.node), (c.Qa = N.fb.dir.stream), (c.Oa = {}))
          : 32768 === (c.mode & 61440)
            ? ((c.Pa = N.fb.file.node),
              (c.Qa = N.fb.file.stream),
              (c.Ta = 0),
              (c.Oa = null))
            : 40960 === (c.mode & 61440)
              ? ((c.Pa = N.fb.link.node), (c.Qa = N.fb.link.stream))
              : 8192 === (c.mode & 61440) &&
                ((c.Pa = N.fb.bc.node), (c.Qa = N.fb.bc.stream));
        c.timestamp = Date.now();
        a && ((a.Oa[b] = c), (a.timestamp = c.timestamp));
        return c;
      },
      od: function (a) {
        return a.Oa
          ? a.Oa.subarray
            ? a.Oa.subarray(0, a.Ta)
            : new Uint8Array(a.Oa)
          : new Uint8Array(0);
      },
      ec: function (a, b) {
        var c = a.Oa ? a.Oa.length : 0;
        c >= b ||
          ((b = Math.max(b, (c * (1048576 > c ? 2 : 1.125)) >>> 0)),
          0 != c && (b = Math.max(b, 256)),
          (c = a.Oa),
          (a.Oa = new Uint8Array(b)),
          0 < a.Ta && a.Oa.set(c.subarray(0, a.Ta), 0));
      },
      Vc: function (a, b) {
        if (a.Ta != b)
          if (0 == b) (a.Oa = null), (a.Ta = 0);
          else {
            var c = a.Oa;
            a.Oa = new Uint8Array(b);
            c && a.Oa.set(c.subarray(0, Math.min(b, a.Ta)));
            a.Ta = b;
          }
      },
      Pa: {
        eb: function (a) {
          var b = {};
          b.Bc = 8192 === (a.mode & 61440) ? a.id : 1;
          b.Qb = a.id;
          b.mode = a.mode;
          b.Rc = 1;
          b.uid = 0;
          b.Ic = 0;
          b.xb = a.xb;
          b.size =
            16384 === (a.mode & 61440)
              ? 4096
              : 32768 === (a.mode & 61440)
                ? a.Ta
                : 40960 === (a.mode & 61440)
                  ? a.link.length
                  : 0;
          b.uc = new Date(a.timestamp);
          b.Qc = new Date(a.timestamp);
          b.zc = new Date(a.timestamp);
          b.vc = 4096;
          b.wc = Math.ceil(b.size / b.vc);
          return b;
        },
        $a: function (a, b) {
          void 0 !== b.mode && (a.mode = b.mode);
          void 0 !== b.timestamp && (a.timestamp = b.timestamp);
          void 0 !== b.size && N.Vc(a, b.size);
        },
        tb: function () {
          throw pb[44];
        },
        Hb: function (a, b, c, d) {
          return N.createNode(a, b, c, d);
        },
        pc: function (a, b, c) {
          if (16384 === (a.mode & 61440)) {
            try {
              var d = qb(b, c);
            } catch (f) {}
            if (d) for (var e in d.Oa) throw new M(55);
          }
          delete a.parent.Oa[a.name];
          a.parent.timestamp = Date.now();
          a.name = c;
          b.Oa[c] = a;
          b.timestamp = a.parent.timestamp;
          a.parent = b;
        },
        Nb: function (a, b) {
          delete a.Oa[b];
          a.timestamp = Date.now();
        },
        qc: function (a, b) {
          var c = qb(a, b),
            d;
          for (d in c.Oa) throw new M(55);
          delete a.Oa[b];
          a.timestamp = Date.now();
        },
        oc: function (a) {
          var b = [".", ".."],
            c;
          for (c in a.Oa) a.Oa.hasOwnProperty(c) && b.push(c);
          return b;
        },
        Kb: function (a, b, c) {
          a = N.createNode(a, b, 41471, 0);
          a.link = c;
          return a;
        },
        yb: function (a) {
          if (40960 !== (a.mode & 61440)) throw new M(28);
          return a.link;
        },
      },
      Qa: {
        read: function (a, b, c, d, e) {
          var f = a.node.Oa;
          if (e >= a.node.Ta) return 0;
          a = Math.min(a.node.Ta - e, d);
          if (8 < a && f.subarray) b.set(f.subarray(e, e + a), c);
          else for (d = 0; d < a; d++) b[c + d] = f[e + d];
          return a;
        },
        write: function (a, b, c, d, e, f) {
          b.buffer === C.buffer && (f = !1);
          if (!d) return 0;
          a = a.node;
          a.timestamp = Date.now();
          if (b.subarray && (!a.Oa || a.Oa.subarray)) {
            if (f) return (a.Oa = b.subarray(c, c + d)), (a.Ta = d);
            if (0 === a.Ta && 0 === e)
              return (a.Oa = b.slice(c, c + d)), (a.Ta = d);
            if (e + d <= a.Ta) return a.Oa.set(b.subarray(c, c + d), e), d;
          }
          N.ec(a, e + d);
          if (a.Oa.subarray && b.subarray) a.Oa.set(b.subarray(c, c + d), e);
          else for (f = 0; f < d; f++) a.Oa[e + f] = b[c + f];
          a.Ta = Math.max(a.Ta, e + d);
          return d;
        },
        lb: function (a, b, c) {
          1 === c
            ? (b += a.position)
            : 2 === c && 32768 === (a.node.mode & 61440) && (b += a.node.Ta);
          if (0 > b) throw new M(28);
          return b;
        },
        Zb: function (a, b, c) {
          N.ec(a.node, b + c);
          a.node.Ta = Math.max(a.node.Ta, b + c);
        },
        ub: function (a, b, c, d, e) {
          if (32768 !== (a.node.mode & 61440)) throw new M(43);
          a = a.node.Oa;
          if (e & 2 || a.buffer !== C.buffer) {
            if (0 < c || c + b < a.length)
              a = a.subarray
                ? a.subarray(c, c + b)
                : Array.prototype.slice.call(a, c, c + b);
            c = !0;
            b = lb(b);
            if (!b) throw new M(48);
            C.set(a, b);
          } else (c = !1), (b = a.byteOffset);
          return { Ra: b, $b: c };
        },
        Ib: function (a, b, c, d) {
          N.Qa.write(a, b, 0, d, c, !1);
          return 0;
        },
      },
    };
    function rb(a, b, c) {
      var d = "al " + a;
      ka(
        a,
        (e) => {
          e || oa('Loading data file "' + a + '" failed (no arrayBuffer).');
          b(new Uint8Array(e));
          d && La(d);
        },
        () => {
          if (c) c();
          else throw 'Loading data file "' + a + '" failed.';
        },
      );
      d && Ka(d);
    }
    var sb = null,
      tb = {},
      ub = [],
      vb = 1,
      wb = null,
      xb = !0,
      M = null,
      pb = {},
      zb = (a, b = {}) => {
        a = db(a);
        if (!a) return { path: "", node: null };
        b = Object.assign({ hc: !0, Vb: 0 }, b);
        if (8 < b.Vb) throw new M(32);
        a = a.split("/").filter((h) => !!h);
        for (var c = sb, d = "/", e = 0; e < a.length; e++) {
          var f = e === a.length - 1;
          if (f && b.parent) break;
          c = qb(c, a[e]);
          d = L(d + "/" + a[e]);
          c.vb && (!f || (f && b.hc)) && (c = c.vb.root);
          if (!f || b.Cb)
            for (f = 0; 40960 === (c.mode & 61440); )
              if (
                ((c = yb(d)),
                (d = db(ab(d), c)),
                (c = zb(d, { Vb: b.Vb + 1 }).node),
                40 < f++)
              )
                throw new M(32);
        }
        return { path: d, node: c };
      },
      Ab = (a) => {
        for (var b; ; ) {
          if (a === a.parent)
            return (
              (a = a.hb.kc),
              b ? ("/" !== a[a.length - 1] ? a + "/" + b : a + b) : a
            );
          b = b ? a.name + "/" + b : a.name;
          a = a.parent;
        }
      },
      Bb = (a, b) => {
        for (var c = 0, d = 0; d < b.length; d++)
          c = ((c << 5) - c + b.charCodeAt(d)) | 0;
        return ((a + c) >>> 0) % wb.length;
      },
      qb = (a, b) => {
        var c;
        if ((c = (c = Cb(a, "x")) ? c : a.Pa.tb ? 0 : 2)) throw new M(c, a);
        for (c = wb[Bb(a.id, b)]; c; c = c.rb) {
          var d = c.name;
          if (c.parent.id === a.id && d === b) return c;
        }
        return a.Pa.tb(a, b);
      },
      ob = (a, b, c, d) => {
        a = new Db(a, b, c, d);
        b = Bb(a.parent.id, a.name);
        a.rb = wb[b];
        return (wb[b] = a);
      },
      Eb = { r: 0, "r+": 2, w: 577, "w+": 578, a: 1089, "a+": 1090 },
      Fb = (a) => {
        var b = ["r", "w", "rw"][a & 3];
        a & 512 && (b += "w");
        return b;
      },
      Cb = (a, b) => {
        if (xb) return 0;
        if (!b.includes("r") || a.mode & 292) {
          if (
            (b.includes("w") && !(a.mode & 146)) ||
            (b.includes("x") && !(a.mode & 73))
          )
            return 2;
        } else return 2;
        return 0;
      },
      Gb = (a, b) => {
        try {
          return qb(a, b), 20;
        } catch (c) {}
        return Cb(a, "wx");
      },
      Hb = (a = 0) => {
        for (; 4096 >= a; a++) if (!ub[a]) return a;
        throw new M(33);
      },
      Jb = (a, b) => {
        Ib ||
          ((Ib = function () {
            this.Jb = {};
          }),
          (Ib.prototype = {}),
          Object.defineProperties(Ib.prototype, {
            object: {
              get: function () {
                return this.node;
              },
              set: function (c) {
                this.node = c;
              },
            },
            flags: {
              get: function () {
                return this.Jb.flags;
              },
              set: function (c) {
                this.Jb.flags = c;
              },
            },
            position: {
              get: function () {
                return this.Jb.position;
              },
              set: function (c) {
                this.Jb.position = c;
              },
            },
          }));
        a = Object.assign(new Ib(), a);
        b = Hb(b);
        a.jb = b;
        return (ub[b] = a);
      },
      nb = {
        open: (a) => {
          a.Qa = tb[a.node.xb].Qa;
          a.Qa.open && a.Qa.open(a);
        },
        lb: () => {
          throw new M(70);
        },
      },
      hb = (a, b) => {
        tb[a] = { Qa: b };
      },
      Kb = (a, b) => {
        var c = "/" === b,
          d = !b;
        if (c && sb) throw new M(10);
        if (!c && !d) {
          var e = zb(b, { hc: !1 });
          b = e.path;
          e = e.node;
          if (e.vb) throw new M(10);
          if (16384 !== (e.mode & 61440)) throw new M(54);
        }
        b = { type: a, rd: {}, kc: b, Pc: [] };
        a = a.hb(b);
        a.hb = b;
        b.root = a;
        c ? (sb = a) : e && ((e.vb = b), e.hb && e.hb.Pc.push(b));
      },
      P = (a, b, c) => {
        var d = zb(a, { parent: !0 }).node;
        a = bb(a);
        if (!a || "." === a || ".." === a) throw new M(28);
        var e = Gb(d, a);
        if (e) throw new M(e);
        if (!d.Pa.Hb) throw new M(63);
        return d.Pa.Hb(d, a, b, c);
      },
      Lb = (a, b, c) => {
        "undefined" == typeof c && ((c = b), (b = 438));
        return P(a, b | 8192, c);
      },
      Mb = (a, b) => {
        if (!db(a)) throw new M(44);
        var c = zb(b, { parent: !0 }).node;
        if (!c) throw new M(44);
        b = bb(b);
        var d = Gb(c, b);
        if (d) throw new M(d);
        if (!c.Pa.Kb) throw new M(63);
        c.Pa.Kb(c, b, a);
      },
      Nb = (a) => {
        var b = zb(a, { parent: !0 }).node;
        if (!b) throw new M(44);
        var c = bb(a);
        a = qb(b, c);
        a: {
          try {
            var d = qb(b, c);
          } catch (f) {
            d = f.Wa;
            break a;
          }
          var e = Cb(b, "wx");
          d = e ? e : 16384 === (d.mode & 61440) ? 31 : 0;
        }
        if (d) throw new M(d);
        if (!b.Pa.Nb) throw new M(63);
        if (a.vb) throw new M(10);
        b.Pa.Nb(b, c);
        b = Bb(a.parent.id, a.name);
        if (wb[b] === a) wb[b] = a.rb;
        else
          for (b = wb[b]; b; ) {
            if (b.rb === a) {
              b.rb = a.rb;
              break;
            }
            b = b.rb;
          }
      },
      yb = (a) => {
        a = zb(a).node;
        if (!a) throw new M(44);
        if (!a.Pa.yb) throw new M(28);
        return db(Ab(a.parent), a.Pa.yb(a));
      },
      Ob = (a, b) => {
        a = zb(a, { Cb: !b }).node;
        if (!a) throw new M(44);
        if (!a.Pa.eb) throw new M(63);
        return a.Pa.eb(a);
      },
      Pb = (a) => Ob(a, !0),
      Qb = (a, b) => {
        a = "string" == typeof a ? zb(a, { Cb: !0 }).node : a;
        if (!a.Pa.$a) throw new M(63);
        a.Pa.$a(a, {
          mode: (b & 4095) | (a.mode & -4096),
          timestamp: Date.now(),
        });
      },
      Sb = (a, b, c) => {
        if ("" === a) throw new M(44);
        if ("string" == typeof b) {
          var d = Eb[b];
          if ("undefined" == typeof d)
            throw Error("Unknown file open mode: " + b);
          b = d;
        }
        c = b & 64 ? (("undefined" == typeof c ? 438 : c) & 4095) | 32768 : 0;
        if ("object" == typeof a) var e = a;
        else {
          a = L(a);
          try {
            e = zb(a, { Cb: !(b & 131072) }).node;
          } catch (f) {}
        }
        d = !1;
        if (b & 64)
          if (e) {
            if (b & 128) throw new M(20);
          } else (e = P(a, c, 0)), (d = !0);
        if (!e) throw new M(44);
        8192 === (e.mode & 61440) && (b &= -513);
        if (b & 65536 && 16384 !== (e.mode & 61440)) throw new M(54);
        if (
          !d &&
          (c = e
            ? 40960 === (e.mode & 61440)
              ? 32
              : 16384 === (e.mode & 61440) && ("r" !== Fb(b) || b & 512)
                ? 31
                : Cb(e, Fb(b))
            : 44)
        )
          throw new M(c);
        if (b & 512 && !d) {
          c = e;
          c = "string" == typeof c ? zb(c, { Cb: !0 }).node : c;
          if (!c.Pa.$a) throw new M(63);
          if (16384 === (c.mode & 61440)) throw new M(31);
          if (32768 !== (c.mode & 61440)) throw new M(28);
          if ((d = Cb(c, "w"))) throw new M(d);
          c.Pa.$a(c, { size: 0, timestamp: Date.now() });
        }
        b &= -131713;
        e = Jb({
          node: e,
          path: Ab(e),
          flags: b,
          seekable: !0,
          position: 0,
          Qa: e.Qa,
          md: [],
          error: !1,
        });
        e.Qa.open && e.Qa.open(e);
        !g.logReadFiles || b & 1 || (Rb || (Rb = {}), a in Rb || (Rb[a] = 1));
        return e;
      },
      Tb = (a) => {
        if (null === a.jb) throw new M(8);
        a.Pb && (a.Pb = null);
        try {
          a.Qa.close && a.Qa.close(a);
        } catch (b) {
          throw b;
        } finally {
          ub[a.jb] = null;
        }
        a.jb = null;
      },
      Ub = (a, b, c) => {
        if (null === a.jb) throw new M(8);
        if (!a.seekable || !a.Qa.lb) throw new M(70);
        if (0 != c && 1 != c && 2 != c) throw new M(28);
        a.position = a.Qa.lb(a, b, c);
        a.md = [];
      },
      Vb = (a, b, c, d, e, f) => {
        if (0 > d || 0 > e) throw new M(28);
        if (null === a.jb) throw new M(8);
        if (0 === (a.flags & 2097155)) throw new M(8);
        if (16384 === (a.node.mode & 61440)) throw new M(31);
        if (!a.Qa.write) throw new M(28);
        a.seekable && a.flags & 1024 && Ub(a, 0, 2);
        var h = "undefined" != typeof e;
        if (!h) e = a.position;
        else if (!a.seekable) throw new M(70);
        b = a.Qa.write(a, b, c, d, e, f);
        h || (a.position += b);
        return b;
      },
      Wb = () => {
        M ||
          ((M = function (a, b) {
            this.name = "ErrnoError";
            this.node = b;
            this.Xc = function (c) {
              this.Wa = c;
            };
            this.Xc(a);
            this.message = "FS error";
          }),
          (M.prototype = Error()),
          (M.prototype.constructor = M),
          [44].forEach((a) => {
            pb[a] = new M(a);
            pb[a].stack = "<generic error, no stack>";
          }));
      },
      Xb,
      Yb = (a, b) => {
        var c = 0;
        a && (c |= 365);
        b && (c |= 146);
        return c;
      },
      Zb = (a, b) => {
        a = "string" == typeof a ? a : Ab(a);
        for (b = b.split("/").reverse(); b.length; ) {
          var c = b.pop();
          if (c) {
            var d = L(a + "/" + c);
            try {
              P(d, 16895, 0);
            } catch (e) {}
            a = d;
          }
        }
        return d;
      },
      $b = (a, b, c, d) => {
        a = L(("string" == typeof a ? a : Ab(a)) + "/" + b);
        c = Yb(c, d);
        return P(a, ((void 0 !== c ? c : 438) & 4095) | 32768, 0);
      },
      ac = (a, b, c, d, e, f) => {
        var h = b;
        a &&
          ((a = "string" == typeof a ? a : Ab(a)),
          (h = b ? L(a + "/" + b) : a));
        a = Yb(d, e);
        h = P(h, ((void 0 !== a ? a : 438) & 4095) | 32768, 0);
        if (c) {
          if ("string" == typeof c) {
            b = Array(c.length);
            d = 0;
            for (e = c.length; d < e; ++d) b[d] = c.charCodeAt(d);
            c = b;
          }
          Qb(h, a | 146);
          b = Sb(h, 577);
          Vb(b, c, 0, c.length, 0, f);
          Tb(b);
          Qb(h, a);
        }
        return h;
      },
      bc = (a, b, c, d) => {
        a = L(("string" == typeof a ? a : Ab(a)) + "/" + b);
        b = Yb(!!c, !!d);
        bc.jc || (bc.jc = 64);
        var e = (bc.jc++ << 8) | 0;
        hb(e, {
          open: (f) => {
            f.seekable = !1;
          },
          close: () => {
            d && d.buffer && d.buffer.length && d(10);
          },
          read: (f, h, l, m) => {
            for (var n = 0, r = 0; r < m; r++) {
              try {
                var p = c();
              } catch (q) {
                throw new M(29);
              }
              if (void 0 === p && 0 === n) throw new M(6);
              if (null === p || void 0 === p) break;
              n++;
              h[l + r] = p;
            }
            n && (f.node.timestamp = Date.now());
            return n;
          },
          write: (f, h, l, m) => {
            for (var n = 0; n < m; n++)
              try {
                d(h[l + n]);
              } catch (r) {
                throw new M(29);
              }
            m && (f.node.timestamp = Date.now());
            return n;
          },
        });
        return Lb(a, b, e);
      },
      cc = (a) => {
        if (!(a.Mc || a.Nc || a.link || a.Oa)) {
          if ("undefined" != typeof XMLHttpRequest)
            throw Error(
              "Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.",
            );
          if (ja)
            try {
              (a.Oa = eb(ja(a.url), !0)), (a.Ta = a.Oa.length);
            } catch (b) {
              throw new M(29);
            }
          else throw Error("Cannot load without read() or XMLHttpRequest.");
        }
      },
      dc = (a, b, c, d, e) => {
        function f() {
          this.Sb = !1;
          this.Bb = [];
        }
        function h(p, q, k, t, x) {
          p = p.node.Oa;
          if (x >= p.length) return 0;
          t = Math.min(p.length - x, t);
          if (p.slice) for (var z = 0; z < t; z++) q[k + z] = p[x + z];
          else for (z = 0; z < t; z++) q[k + z] = p.get(x + z);
          return t;
        }
        f.prototype.get = function (p) {
          if (!(p > this.length - 1 || 0 > p)) {
            var q = p % this.cc;
            return this.Eb((p / this.cc) | 0)[q];
          }
        };
        f.prototype.Wc = function (p) {
          this.Eb = p;
        };
        f.prototype.ac = function () {
          var p = new XMLHttpRequest();
          p.open("HEAD", c, !1);
          p.send(null);
          if (!((200 <= p.status && 300 > p.status) || 304 === p.status))
            throw Error("Couldn't load " + c + ". Status: " + p.status);
          var q = Number(p.getResponseHeader("Content-length")),
            k,
            t = (k = p.getResponseHeader("Accept-Ranges")) && "bytes" === k;
          p = (k = p.getResponseHeader("Content-Encoding")) && "gzip" === k;
          var x = 1048576;
          t || (x = q);
          var z = this;
          z.Wc((F) => {
            var H = F * x,
              y = (F + 1) * x - 1;
            y = Math.min(y, q - 1);
            if ("undefined" == typeof z.Bb[F]) {
              var O = z.Bb;
              if (H > y)
                throw Error(
                  "invalid range (" + H + ", " + y + ") or no bytes requested!",
                );
              if (y > q - 1)
                throw Error(
                  "only " + q + " bytes available! programmer error!",
                );
              var B = new XMLHttpRequest();
              B.open("GET", c, !1);
              q !== x && B.setRequestHeader("Range", "bytes=" + H + "-" + y);
              B.responseType = "arraybuffer";
              B.overrideMimeType &&
                B.overrideMimeType("text/plain; charset=x-user-defined");
              B.send(null);
              if (!((200 <= B.status && 300 > B.status) || 304 === B.status))
                throw Error("Couldn't load " + c + ". Status: " + B.status);
              H =
                void 0 !== B.response
                  ? new Uint8Array(B.response || [])
                  : eb(B.responseText || "", !0);
              O[F] = H;
            }
            if ("undefined" == typeof z.Bb[F]) throw Error("doXHR failed!");
            return z.Bb[F];
          });
          if (p || !q)
            (x = q = 1),
              (x = q = this.Eb(0).length),
              ma(
                "LazyFiles on gzip forces download of the whole file when length is accessed",
              );
          this.sc = q;
          this.rc = x;
          this.Sb = !0;
        };
        if ("undefined" != typeof XMLHttpRequest) {
          if (!ha)
            throw "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
          var l = new f();
          Object.defineProperties(l, {
            length: {
              get: function () {
                this.Sb || this.ac();
                return this.sc;
              },
            },
            cc: {
              get: function () {
                this.Sb || this.ac();
                return this.rc;
              },
            },
          });
          var m = void 0;
        } else (m = c), (l = void 0);
        var n = $b(a, b, d, e);
        l ? (n.Oa = l) : m && ((n.Oa = null), (n.url = m));
        Object.defineProperties(n, {
          Ta: {
            get: function () {
              return this.Oa.length;
            },
          },
        });
        var r = {};
        Object.keys(n.Qa).forEach((p) => {
          var q = n.Qa[p];
          r[p] = function () {
            cc(n);
            return q.apply(null, arguments);
          };
        });
        r.read = (p, q, k, t, x) => {
          cc(n);
          return h(p, q, k, t, x);
        };
        r.ub = (p, q, k) => {
          cc(n);
          var t = lb(q);
          if (!t) throw new M(48);
          h(p, C, t, q, k);
          return { Ra: t, $b: !0 };
        };
        n.Qa = r;
        return n;
      },
      fc = (a, b, c, d, e, f, h, l, m, n) => {
        function r(k) {
          function t(x) {
            n && n();
            l || ac(a, b, x, d, e, m);
            f && f();
            La(q);
          }
          ec.pd(k, p, t, () => {
            h && h();
            La(q);
          }) || t(k);
        }
        var p = b ? db(L(a + "/" + b)) : a,
          q = "cp " + p;
        Ka(q);
        "string" == typeof c ? rb(c, (k) => r(k), h) : r(c);
      },
      Q = {},
      Ib,
      Rb;
    function gc(a, b, c) {
      if ("/" === b.charAt(0)) return b;
      a = -100 === a ? "/" : hc(a).path;
      if (0 == b.length) {
        if (!c) throw new M(44);
        return a;
      }
      return L(a + "/" + b);
    }
    function ic(a, b, c) {
      try {
        var d = a(b);
      } catch (f) {
        if (f && f.node && L(b) !== L(Ab(f.node))) return -54;
        throw f;
      }
      E[c >> 2] = d.Bc;
      E[(c + 8) >> 2] = d.Qb;
      E[(c + 12) >> 2] = d.mode;
      G[(c + 16) >> 2] = d.Rc;
      E[(c + 20) >> 2] = d.uid;
      E[(c + 24) >> 2] = d.Ic;
      E[(c + 28) >> 2] = d.xb;
      K = [
        d.size >>> 0,
        ((J = d.size),
        1 <= +Math.abs(J)
          ? 0 < J
            ? (Math.min(+Math.floor(J / 4294967296), 4294967295) | 0) >>> 0
            : ~~+Math.ceil((J - +(~~J >>> 0)) / 4294967296) >>> 0
          : 0),
      ];
      E[(c + 40) >> 2] = K[0];
      E[(c + 44) >> 2] = K[1];
      E[(c + 48) >> 2] = 4096;
      E[(c + 52) >> 2] = d.wc;
      a = d.uc.getTime();
      b = d.Qc.getTime();
      var e = d.zc.getTime();
      K = [
        Math.floor(a / 1e3) >>> 0,
        ((J = Math.floor(a / 1e3)),
        1 <= +Math.abs(J)
          ? 0 < J
            ? (Math.min(+Math.floor(J / 4294967296), 4294967295) | 0) >>> 0
            : ~~+Math.ceil((J - +(~~J >>> 0)) / 4294967296) >>> 0
          : 0),
      ];
      E[(c + 56) >> 2] = K[0];
      E[(c + 60) >> 2] = K[1];
      G[(c + 64) >> 2] = (a % 1e3) * 1e3;
      K = [
        Math.floor(b / 1e3) >>> 0,
        ((J = Math.floor(b / 1e3)),
        1 <= +Math.abs(J)
          ? 0 < J
            ? (Math.min(+Math.floor(J / 4294967296), 4294967295) | 0) >>> 0
            : ~~+Math.ceil((J - +(~~J >>> 0)) / 4294967296) >>> 0
          : 0),
      ];
      E[(c + 72) >> 2] = K[0];
      E[(c + 76) >> 2] = K[1];
      G[(c + 80) >> 2] = (b % 1e3) * 1e3;
      K = [
        Math.floor(e / 1e3) >>> 0,
        ((J = Math.floor(e / 1e3)),
        1 <= +Math.abs(J)
          ? 0 < J
            ? (Math.min(+Math.floor(J / 4294967296), 4294967295) | 0) >>> 0
            : ~~+Math.ceil((J - +(~~J >>> 0)) / 4294967296) >>> 0
          : 0),
      ];
      E[(c + 88) >> 2] = K[0];
      E[(c + 92) >> 2] = K[1];
      G[(c + 96) >> 2] = (e % 1e3) * 1e3;
      K = [
        d.Qb >>> 0,
        ((J = d.Qb),
        1 <= +Math.abs(J)
          ? 0 < J
            ? (Math.min(+Math.floor(J / 4294967296), 4294967295) | 0) >>> 0
            : ~~+Math.ceil((J - +(~~J >>> 0)) / 4294967296) >>> 0
          : 0),
      ];
      E[(c + 104) >> 2] = K[0];
      E[(c + 108) >> 2] = K[1];
      return 0;
    }
    var jc = void 0;
    function kc() {
      jc += 4;
      return E[(jc - 4) >> 2];
    }
    function hc(a) {
      a = ub[a];
      if (!a) throw new M(8);
      return a;
    }
    var lc = {};
    function mc(a) {
      for (; a.length; ) {
        var b = a.pop();
        a.pop()(b);
      }
    }
    function nc(a) {
      return this.fromWireType(E[a >> 2]);
    }
    var oc = {},
      pc = {},
      qc = {};
    function rc(a) {
      if (void 0 === a) return "_unknown";
      a = a.replace(/[^a-zA-Z0-9_]/g, "$");
      var b = a.charCodeAt(0);
      return 48 <= b && 57 >= b ? "_" + a : a;
    }
    function sc(a, b) {
      a = rc(a);
      return {
        [a]: function () {
          return b.apply(this, arguments);
        },
      }[a];
    }
    function tc(a) {
      var b = Error,
        c = sc(a, function (d) {
          this.name = a;
          this.message = d;
          d = Error(d).stack;
          void 0 !== d &&
            (this.stack =
              this.toString() + "\n" + d.replace(/^Error(:[^\n]*)?\n/, ""));
        });
      c.prototype = Object.create(b.prototype);
      c.prototype.constructor = c;
      c.prototype.toString = function () {
        return void 0 === this.message
          ? this.name
          : this.name + ": " + this.message;
      };
      return c;
    }
    var uc = void 0;
    function vc(a) {
      throw new uc(a);
    }
    function wc(a, b, c) {
      function d(l) {
        l = c(l);
        l.length !== a.length && vc("Mismatched type converter count");
        for (var m = 0; m < a.length; ++m) xc(a[m], l[m]);
      }
      a.forEach(function (l) {
        qc[l] = b;
      });
      var e = Array(b.length),
        f = [],
        h = 0;
      b.forEach((l, m) => {
        pc.hasOwnProperty(l)
          ? (e[m] = pc[l])
          : (f.push(l),
            oc.hasOwnProperty(l) || (oc[l] = []),
            oc[l].push(() => {
              e[m] = pc[l];
              ++h;
              h === f.length && d(e);
            }));
      });
      0 === f.length && d(e);
    }
    function yc(a) {
      switch (a) {
        case 1:
          return 0;
        case 2:
          return 1;
        case 4:
          return 2;
        case 8:
          return 3;
        default:
          throw new TypeError("Unknown type size: " + a);
      }
    }
    var zc = void 0;
    function R(a) {
      for (var b = ""; w[a]; ) b += zc[w[a++]];
      return b;
    }
    var Ac = void 0;
    function S(a) {
      throw new Ac(a);
    }
    function xc(a, b, c = {}) {
      if (!("argPackAdvance" in b))
        throw new TypeError(
          "registerType registeredInstance requires argPackAdvance",
        );
      var d = b.name;
      a || S('type "' + d + '" must have a positive integer typeid pointer');
      if (pc.hasOwnProperty(a)) {
        if (c.Jc) return;
        S("Cannot register type '" + d + "' twice");
      }
      pc[a] = b;
      delete qc[a];
      oc.hasOwnProperty(a) &&
        ((b = oc[a]), delete oc[a], b.forEach((e) => e()));
    }
    function Bc(a) {
      S(a.Ha.Ua.Sa.name + " instance already deleted");
    }
    var Cc = !1;
    function Dc() {}
    function Ec(a) {
      --a.count.value;
      0 === a.count.value && (a.Za ? a.ab.ib(a.Za) : a.Ua.Sa.ib(a.Ra));
    }
    function Fc(a, b, c) {
      if (b === c) return a;
      if (void 0 === c.bb) return null;
      a = Fc(a, b, c.bb);
      return null === a ? null : c.Cc(a);
    }
    var Gc = {},
      Hc = [];
    function Ic() {
      for (; Hc.length; ) {
        var a = Hc.pop();
        a.Ha.pb = !1;
        a["delete"]();
      }
    }
    var Jc = void 0,
      Kc = {};
    function Lc(a, b) {
      for (void 0 === b && S("ptr should not be undefined"); a.bb; )
        (b = a.zb(b)), (a = a.bb);
      return Kc[b];
    }
    function Mc(a, b) {
      (b.Ua && b.Ra) || vc("makeClassHandle requires ptr and ptrType");
      !!b.ab !== !!b.Za &&
        vc("Both smartPtrType and smartPtr must be specified");
      b.count = { value: 1 };
      return Nc(Object.create(a, { Ha: { value: b } }));
    }
    function Nc(a) {
      if ("undefined" === typeof FinalizationRegistry)
        return (Nc = (b) => b), a;
      Cc = new FinalizationRegistry((b) => {
        Ec(b.Ha);
      });
      Nc = (b) => {
        var c = b.Ha;
        c.Za && Cc.register(b, { Ha: c }, b);
        return b;
      };
      Dc = (b) => {
        Cc.unregister(b);
      };
      return Nc(a);
    }
    function Oc() {}
    function Pc(a, b, c) {
      if (void 0 === a[b].Ya) {
        var d = a[b];
        a[b] = function () {
          a[b].Ya.hasOwnProperty(arguments.length) ||
            S(
              "Function '" +
                c +
                "' called with an invalid number of arguments (" +
                arguments.length +
                ") - expects one of (" +
                a[b].Ya +
                ")!",
            );
          return a[b].Ya[arguments.length].apply(this, arguments);
        };
        a[b].Ya = [];
        a[b].Ya[d.Ab] = d;
      }
    }
    function Qc(a, b, c) {
      g.hasOwnProperty(a)
        ? ((void 0 === c || (void 0 !== g[a].Ya && void 0 !== g[a].Ya[c])) &&
            S("Cannot register public name '" + a + "' twice"),
          Pc(g, a, a),
          g.hasOwnProperty(c) &&
            S(
              "Cannot register multiple overloads of a function with the same number of arguments (" +
                c +
                ")!",
            ),
          (g[a].Ya[c] = b))
        : ((g[a] = b), void 0 !== c && (g[a].qd = c));
    }
    function Rc(a, b, c, d, e, f, h, l) {
      this.name = a;
      this.constructor = b;
      this.qb = c;
      this.ib = d;
      this.bb = e;
      this.Ec = f;
      this.zb = h;
      this.Cc = l;
      this.Tc = [];
    }
    function Sc(a, b, c) {
      for (; b !== c; )
        b.zb ||
          S(
            "Expected null or instance of " +
              c.name +
              ", got an instance of " +
              b.name,
          ),
          (a = b.zb(a)),
          (b = b.bb);
      return a;
    }
    function Tc(a, b) {
      if (null === b)
        return this.Rb && S("null is not a valid " + this.name), 0;
      b.Ha || S('Cannot pass "' + Uc(b) + '" as a ' + this.name);
      b.Ha.Ra ||
        S("Cannot pass deleted object as a pointer of type " + this.name);
      return Sc(b.Ha.Ra, b.Ha.Ua.Sa, this.Sa);
    }
    function Vc(a, b) {
      if (null === b) {
        this.Rb && S("null is not a valid " + this.name);
        if (this.Gb) {
          var c = this.Ub();
          null !== a && a.push(this.ib, c);
          return c;
        }
        return 0;
      }
      b.Ha || S('Cannot pass "' + Uc(b) + '" as a ' + this.name);
      b.Ha.Ra ||
        S("Cannot pass deleted object as a pointer of type " + this.name);
      !this.Fb &&
        b.Ha.Ua.Fb &&
        S(
          "Cannot convert argument of type " +
            (b.Ha.ab ? b.Ha.ab.name : b.Ha.Ua.name) +
            " to parameter type " +
            this.name,
        );
      c = Sc(b.Ha.Ra, b.Ha.Ua.Sa, this.Sa);
      if (this.Gb)
        switch (
          (void 0 === b.Ha.Za &&
            S("Passing raw pointer to smart pointer is illegal"),
          this.gd)
        ) {
          case 0:
            b.Ha.ab === this
              ? (c = b.Ha.Za)
              : S(
                  "Cannot convert argument of type " +
                    (b.Ha.ab ? b.Ha.ab.name : b.Ha.Ua.name) +
                    " to parameter type " +
                    this.name,
                );
            break;
          case 1:
            c = b.Ha.Za;
            break;
          case 2:
            if (b.Ha.ab === this) c = b.Ha.Za;
            else {
              var d = b.clone();
              c = this.Uc(
                c,
                T(function () {
                  d["delete"]();
                }),
              );
              null !== a && a.push(this.ib, c);
            }
            break;
          default:
            S("Unsupporting sharing policy");
        }
      return c;
    }
    function Wc(a, b) {
      if (null === b)
        return this.Rb && S("null is not a valid " + this.name), 0;
      b.Ha || S('Cannot pass "' + Uc(b) + '" as a ' + this.name);
      b.Ha.Ra ||
        S("Cannot pass deleted object as a pointer of type " + this.name);
      b.Ha.Ua.Fb &&
        S(
          "Cannot convert argument of type " +
            b.Ha.Ua.name +
            " to parameter type " +
            this.name,
        );
      return Sc(b.Ha.Ra, b.Ha.Ua.Sa, this.Sa);
    }
    function Xc(a, b, c, d) {
      this.name = a;
      this.Sa = b;
      this.Rb = c;
      this.Fb = d;
      this.Gb = !1;
      this.ib = this.Uc = this.Ub = this.nc = this.gd = this.Sc = void 0;
      void 0 !== b.bb
        ? (this.toWireType = Vc)
        : ((this.toWireType = d ? Tc : Wc), (this.cb = null));
    }
    function Yc(a, b, c) {
      g.hasOwnProperty(a) || vc("Replacing nonexistant public symbol");
      void 0 !== g[a].Ya && void 0 !== c
        ? (g[a].Ya[c] = b)
        : ((g[a] = b), (g[a].Ab = c));
    }
    var Zc = [];
    function U(a) {
      var b = Zc[a];
      b || (a >= Zc.length && (Zc.length = a + 1), (Zc[a] = b = za.get(a)));
      return b;
    }
    function $c(a, b) {
      var c = [];
      return function () {
        c.length = 0;
        Object.assign(c, arguments);
        if (a.includes("j")) {
          var d = g["dynCall_" + a];
          d = c && c.length ? d.apply(null, [b].concat(c)) : d.call(null, b);
        } else d = U(b).apply(null, c);
        return d;
      };
    }
    function V(a, b) {
      a = R(a);
      var c = a.includes("j") ? $c(a, b) : U(b);
      "function" != typeof c &&
        S("unknown function pointer with signature " + a + ": " + b);
      return c;
    }
    var ad = void 0;
    function bd(a) {
      a = cd(a);
      var b = R(a);
      dd(a);
      return b;
    }
    function ed(a, b) {
      function c(f) {
        e[f] || pc[f] || (qc[f] ? qc[f].forEach(c) : (d.push(f), (e[f] = !0)));
      }
      var d = [],
        e = {};
      b.forEach(c);
      throw new ad(a + ": " + d.map(bd).join([", "]));
    }
    function fd(a, b) {
      for (var c = [], d = 0; d < a; d++) c.push(G[(b + 4 * d) >> 2]);
      return c;
    }
    function gd(a, b, c, d, e) {
      var f = b.length;
      2 > f &&
        S(
          "argTypes array size mismatch! Must at least get return value and 'this' types!",
        );
      var h = null !== b[1] && null !== c,
        l = !1;
      for (c = 1; c < b.length; ++c)
        if (null !== b[c] && void 0 === b[c].cb) {
          l = !0;
          break;
        }
      var m = "void" !== b[0].name,
        n = f - 2,
        r = Array(n),
        p = [],
        q = [];
      return function () {
        arguments.length !== n &&
          S(
            "function " +
              a +
              " called with " +
              arguments.length +
              " arguments, expected " +
              n +
              " args!",
          );
        q.length = 0;
        p.length = h ? 2 : 1;
        p[0] = e;
        if (h) {
          var k = b[1].toWireType(q, this);
          p[1] = k;
        }
        for (var t = 0; t < n; ++t)
          (r[t] = b[t + 2].toWireType(q, arguments[t])), p.push(r[t]);
        t = d.apply(null, p);
        if (l) mc(q);
        else
          for (var x = h ? 1 : 2; x < b.length; x++) {
            var z = 1 === x ? k : r[x - 2];
            null !== b[x].cb && b[x].cb(z);
          }
        k = m ? b[0].fromWireType(t) : void 0;
        return k;
      };
    }
    var hd = [],
      W = [
        {},
        { value: void 0 },
        { value: null },
        { value: !0 },
        { value: !1 },
      ];
    function jd(a) {
      4 < a && 0 === --W[a].Wb && ((W[a] = void 0), hd.push(a));
    }
    var X = (a) => {
        a || S("Cannot use deleted val. handle = " + a);
        return W[a].value;
      },
      T = (a) => {
        switch (a) {
          case void 0:
            return 1;
          case null:
            return 2;
          case !0:
            return 3;
          case !1:
            return 4;
          default:
            var b = hd.length ? hd.pop() : W.length;
            W[b] = { Wb: 1, value: a };
            return b;
        }
      };
    function Uc(a) {
      if (null === a) return "null";
      var b = typeof a;
      return "object" === b || "array" === b || "function" === b
        ? a.toString()
        : "" + a;
    }
    function kd(a, b) {
      switch (b) {
        case 2:
          return function (c) {
            return this.fromWireType(wa[c >> 2]);
          };
        case 3:
          return function (c) {
            return this.fromWireType(xa[c >> 3]);
          };
        default:
          throw new TypeError("Unknown float type: " + a);
      }
    }
    function ld(a, b, c) {
      switch (b) {
        case 0:
          return c
            ? function (d) {
                return C[d];
              }
            : function (d) {
                return w[d];
              };
        case 1:
          return c
            ? function (d) {
                return va[d >> 1];
              }
            : function (d) {
                return D[d >> 1];
              };
        case 2:
          return c
            ? function (d) {
                return E[d >> 2];
              }
            : function (d) {
                return G[d >> 2];
              };
        default:
          throw new TypeError("Unknown integer type: " + a);
      }
    }
    var md =
      "undefined" != typeof TextDecoder ? new TextDecoder("utf-16le") : void 0;
    function nd(a, b) {
      var c = a >> 1;
      for (var d = c + b / 2; !(c >= d) && D[c]; ) ++c;
      c <<= 1;
      if (32 < c - a && md) return md.decode(w.subarray(a, c));
      c = "";
      for (d = 0; !(d >= b / 2); ++d) {
        var e = va[(a + 2 * d) >> 1];
        if (0 == e) break;
        c += String.fromCharCode(e);
      }
      return c;
    }
    function od(a, b, c) {
      void 0 === c && (c = 2147483647);
      if (2 > c) return 0;
      c -= 2;
      var d = b;
      c = c < 2 * a.length ? c / 2 : a.length;
      for (var e = 0; e < c; ++e) (va[b >> 1] = a.charCodeAt(e)), (b += 2);
      va[b >> 1] = 0;
      return b - d;
    }
    function pd(a) {
      return 2 * a.length;
    }
    function qd(a, b) {
      for (var c = 0, d = ""; !(c >= b / 4); ) {
        var e = E[(a + 4 * c) >> 2];
        if (0 == e) break;
        ++c;
        65536 <= e
          ? ((e -= 65536),
            (d += String.fromCharCode(55296 | (e >> 10), 56320 | (e & 1023))))
          : (d += String.fromCharCode(e));
      }
      return d;
    }
    function rd(a, b, c) {
      void 0 === c && (c = 2147483647);
      if (4 > c) return 0;
      var d = b;
      c = d + c - 4;
      for (var e = 0; e < a.length; ++e) {
        var f = a.charCodeAt(e);
        if (55296 <= f && 57343 >= f) {
          var h = a.charCodeAt(++e);
          f = (65536 + ((f & 1023) << 10)) | (h & 1023);
        }
        E[b >> 2] = f;
        b += 4;
        if (b + 4 > c) break;
      }
      E[b >> 2] = 0;
      return b - d;
    }
    function sd(a) {
      for (var b = 0, c = 0; c < a.length; ++c) {
        var d = a.charCodeAt(c);
        55296 <= d && 57343 >= d && ++c;
        b += 4;
      }
      return b;
    }
    function td(a, b) {
      var c = pc[a];
      void 0 === c && S(b + " has unknown type " + bd(a));
      return c;
    }
    function ud(a, b) {
      for (var c = Array(a), d = 0; d < a; ++d)
        c[d] = td(G[(b + 4 * d) >> 2], "parameter " + d);
      return c;
    }
    var vd = {};
    function wd(a) {
      var b = vd[a];
      return void 0 === b ? R(a) : b;
    }
    var xd = [];
    function yd() {
      function a(b) {
        b.$$$embind_global$$$ = b;
        var c =
          "object" == typeof $$$embind_global$$$ && b.$$$embind_global$$$ == b;
        c || delete b.$$$embind_global$$$;
        return c;
      }
      if ("object" == typeof globalThis) return globalThis;
      if ("object" == typeof $$$embind_global$$$) return $$$embind_global$$$;
      "object" == typeof global && a(global)
        ? ($$$embind_global$$$ = global)
        : "object" == typeof self && a(self) && ($$$embind_global$$$ = self);
      if ("object" == typeof $$$embind_global$$$) return $$$embind_global$$$;
      throw Error("unable to get global object.");
    }
    function zd(a) {
      var b = xd.length;
      xd.push(a);
      return b;
    }
    var Ad = [];
    function Bd(a) {
      var b = Array(a + 1);
      return function (c, d, e) {
        b[0] = c;
        for (var f = 0; f < a; ++f) {
          var h = td(G[(d + 4 * f) >> 2], "parameter " + f);
          b[f + 1] = h.readValueFromPointer(e);
          e += h.argPackAdvance;
        }
        c = new (c.bind.apply(c, b))();
        return T(c);
      };
    }
    var Cd = {};
    function Dd(a) {
      return 0 === a % 4 && (0 !== a % 100 || 0 === a % 400);
    }
    var Ed = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335],
      Fd = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    function Gd(a) {
      return (Dd(a.getFullYear()) ? Ed : Fd)[a.getMonth()] + a.getDate() - 1;
    }
    function Hd(a) {
      var b = ua(a) + 1,
        c = Id(b);
      c && A(a, C, c, b);
      return c;
    }
    var Jd = [],
      Kd = {};
    function Y(a, b) {
      G[a >> 2] = b;
      G[(a + 4) >> 2] = (b / 4294967296) | 0;
    }
    var Ld;
    function Md(a, b, c, d, e) {
      function f() {
        var B = 0,
          Z = 0;
        y.response &&
          F &&
          0 === G[(a + 12) >> 2] &&
          (Z = y.response.byteLength);
        0 < Z && ((B = Id(Z)), w.set(new Uint8Array(y.response), B));
        G[(a + 12) >> 2] = B;
        Y(a + 16, Z);
        Y(a + 24, 0);
        (B = y.response ? y.response.byteLength : 0) && Y(a + 32, B);
        D[(a + 40) >> 1] = y.readyState;
        D[(a + 42) >> 1] = y.status;
        y.statusText && A(y.statusText, w, a + 44, 64);
      }
      var h = G[(a + 8) >> 2];
      if (h) {
        var l = v(h),
          m = a + 112,
          n = v(m);
        n || (n = "GET");
        var r = G[(m + 52) >> 2],
          p = G[(m + 56) >> 2],
          q = !!G[(m + 60) >> 2],
          k = G[(m + 68) >> 2],
          t = G[(m + 72) >> 2];
        h = G[(m + 76) >> 2];
        var x = G[(m + 80) >> 2],
          z = G[(m + 84) >> 2];
        m = G[(m + 88) >> 2];
        var F = !!(r & 1),
          H = !!(r & 2);
        r = !!(r & 64);
        k = k ? v(k) : void 0;
        t = t ? v(t) : void 0;
        var y = new XMLHttpRequest();
        y.withCredentials = q;
        y.open(n, l, !r, k, t);
        r || (y.timeout = p);
        y.td = l;
        y.responseType = "arraybuffer";
        x && ((l = v(x)), y.overrideMimeType(l));
        if (h)
          for (;;) {
            n = G[h >> 2];
            if (!n) break;
            l = G[(h + 4) >> 2];
            if (!l) break;
            h += 8;
            n = v(n);
            l = v(l);
            y.setRequestHeader(n, l);
          }
        var O = G[(a + 0) >> 2];
        Kd[O] = y;
        h = z && m ? w.slice(z, z + m) : null;
        y.onload = (B) => {
          O in Kd &&
            (f(),
            200 <= y.status && 300 > y.status
              ? b && b(a, y, B)
              : c && c(a, y, B));
        };
        y.onerror = (B) => {
          O in Kd && (f(), c && c(a, y, B));
        };
        y.ontimeout = (B) => {
          O in Kd && c && c(a, y, B);
        };
        y.onprogress = (B) => {
          if (O in Kd) {
            var Z = F && H && y.response ? y.response.byteLength : 0,
              I = 0;
            0 < Z &&
              F &&
              H &&
              ((I = Id(Z)), w.set(new Uint8Array(y.response), I));
            G[(a + 12) >> 2] = I;
            Y(a + 16, Z);
            Y(a + 24, B.loaded - Z);
            Y(a + 32, B.total);
            D[(a + 40) >> 1] = y.readyState;
            3 <= y.readyState &&
              0 === y.status &&
              0 < B.loaded &&
              (y.status = 200);
            D[(a + 42) >> 1] = y.status;
            y.statusText && A(y.statusText, w, a + 44, 64);
            d && d(a, y, B);
            I && dd(I);
          }
        };
        y.onreadystatechange = (B) => {
          O in Kd
            ? ((D[(a + 40) >> 1] = y.readyState),
              2 <= y.readyState && (D[(a + 42) >> 1] = y.status),
              e && e(a, y, B))
            : --Fa;
        };
        try {
          y.send(h);
        } catch (B) {
          c && c(a, y, B);
        }
      } else c(a, 0, "no url specified!");
    }
    function Nd(a) {
      a instanceof Wa || "unwind" == a || ea(1, a);
    }
    function Od(a) {
      ra = a;
      if (!(noExitRuntime || 0 < Fa)) {
        Pd();
        Xa(Ca);
        Xb = !1;
        Qd(0);
        for (var b = 0; b < ub.length; b++) {
          var c = ub[b];
          c && Tb(c);
        }
        Ea = !0;
      }
      ra = a;
      if (!(noExitRuntime || 0 < Fa)) {
        if (g.onExit) g.onExit(a);
        qa = !0;
      }
      ea(a, new Wa(a));
    }
    function Rd(a, b, c, d) {
      var e = Ld;
      if (e) {
        var f = G[(a + 112 + 64) >> 2];
        f || (f = G[(a + 8) >> 2]);
        var h = v(f);
        try {
          var l = e
            .transaction(["FILES"], "readwrite")
            .objectStore("FILES")
            .put(b, h);
          l.onsuccess = () => {
            D[(a + 40) >> 1] = 4;
            D[(a + 42) >> 1] = 200;
            A("OK", w, a + 44, 64);
            c(a, 0, h);
          };
          l.onerror = (m) => {
            D[(a + 40) >> 1] = 4;
            D[(a + 42) >> 1] = 413;
            A("Payload Too Large", w, a + 44, 64);
            d(a, 0, m);
          };
        } catch (m) {
          d(a, 0, m);
        }
      } else d(a, 0, "IndexedDB not available!");
    }
    function Sd(a, b, c) {
      var d = Ld;
      if (d) {
        var e = G[(a + 112 + 64) >> 2];
        e || (e = G[(a + 8) >> 2]);
        e = v(e);
        try {
          var f = d
            .transaction(["FILES"], "readonly")
            .objectStore("FILES")
            .get(e);
          f.onsuccess = (h) => {
            if (h.target.result) {
              h = h.target.result;
              var l = h.byteLength || h.length,
                m = Id(l);
              w.set(new Uint8Array(h), m);
              G[(a + 12) >> 2] = m;
              Y(a + 16, l);
              Y(a + 24, 0);
              Y(a + 32, l);
              D[(a + 40) >> 1] = 4;
              D[(a + 42) >> 1] = 200;
              A("OK", w, a + 44, 64);
              b(a, 0, h);
            } else
              (D[(a + 40) >> 1] = 4),
                (D[(a + 42) >> 1] = 404),
                A("Not Found", w, a + 44, 64),
                c(a, 0, "no data");
          };
          f.onerror = (h) => {
            D[(a + 40) >> 1] = 4;
            D[(a + 42) >> 1] = 404;
            A("Not Found", w, a + 44, 64);
            c(a, 0, h);
          };
        } catch (h) {
          c(a, 0, h);
        }
      } else c(a, 0, "IndexedDB not available!");
    }
    function Td(a, b, c) {
      var d = Ld;
      if (d) {
        var e = G[(a + 112 + 64) >> 2];
        e || (e = G[(a + 8) >> 2]);
        e = v(e);
        try {
          var f = d
            .transaction(["FILES"], "readwrite")
            .objectStore("FILES")
            .delete(e);
          f.onsuccess = (h) => {
            h = h.target.result;
            G[(a + 12) >> 2] = 0;
            Y(a + 16, 0);
            Y(a + 24, 0);
            Y(a + 32, 0);
            D[(a + 40) >> 1] = 4;
            D[(a + 42) >> 1] = 200;
            A("OK", w, a + 44, 64);
            b(a, 0, h);
          };
          f.onerror = (h) => {
            D[(a + 40) >> 1] = 4;
            D[(a + 42) >> 1] = 404;
            A("Not Found", w, a + 44, 64);
            c(a, 0, h);
          };
        } catch (h) {
          c(a, 0, h);
        }
      } else c(a, 0, "IndexedDB not available!");
    }
    var Ud = {};
    function Vd() {
      if (!Wd) {
        var a = {
            USER: "web_user",
            LOGNAME: "web_user",
            PATH: "/",
            PWD: "/",
            HOME: "/home/web_user",
            LANG:
              (
                ("object" == typeof navigator &&
                  navigator.languages &&
                  navigator.languages[0]) ||
                "C"
              ).replace("-", "_") + ".UTF-8",
            _: da || "./this.program",
          },
          b;
        for (b in Ud) void 0 === Ud[b] ? delete a[b] : (a[b] = Ud[b]);
        var c = [];
        for (b in a) c.push(b + "=" + a[b]);
        Wd = c;
      }
      return Wd;
    }
    var Wd;
    function Xd(a, b) {
      Xd.mc || (Xd.mc = cb());
      for (var c = 0; c < b; c++) C[(a + c) >> 0] = Xd.mc();
      return 0;
    }
    var Yd = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
      Zd = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    function $d(a, b, c, d) {
      function e(k, t, x) {
        for (k = "number" == typeof k ? k.toString() : k || ""; k.length < t; )
          k = x[0] + k;
        return k;
      }
      function f(k, t) {
        return e(k, t, "0");
      }
      function h(k, t) {
        function x(F) {
          return 0 > F ? -1 : 0 < F ? 1 : 0;
        }
        var z;
        0 === (z = x(k.getFullYear() - t.getFullYear())) &&
          0 === (z = x(k.getMonth() - t.getMonth())) &&
          (z = x(k.getDate() - t.getDate()));
        return z;
      }
      function l(k) {
        switch (k.getDay()) {
          case 0:
            return new Date(k.getFullYear() - 1, 11, 29);
          case 1:
            return k;
          case 2:
            return new Date(k.getFullYear(), 0, 3);
          case 3:
            return new Date(k.getFullYear(), 0, 2);
          case 4:
            return new Date(k.getFullYear(), 0, 1);
          case 5:
            return new Date(k.getFullYear() - 1, 11, 31);
          case 6:
            return new Date(k.getFullYear() - 1, 11, 30);
        }
      }
      function m(k) {
        var t = k.mb;
        for (k = new Date(new Date(k.nb + 1900, 0, 1).getTime()); 0 < t; ) {
          var x = k.getMonth(),
            z = (Dd(k.getFullYear()) ? Yd : Zd)[x];
          if (t > z - k.getDate())
            (t -= z - k.getDate() + 1),
              k.setDate(1),
              11 > x
                ? k.setMonth(x + 1)
                : (k.setMonth(0), k.setFullYear(k.getFullYear() + 1));
          else {
            k.setDate(k.getDate() + t);
            break;
          }
        }
        x = new Date(k.getFullYear() + 1, 0, 4);
        t = l(new Date(k.getFullYear(), 0, 4));
        x = l(x);
        return 0 >= h(t, k)
          ? 0 >= h(x, k)
            ? k.getFullYear() + 1
            : k.getFullYear()
          : k.getFullYear() - 1;
      }
      var n = E[(d + 40) >> 2];
      d = {
        kd: E[d >> 2],
        jd: E[(d + 4) >> 2],
        Lb: E[(d + 8) >> 2],
        Yb: E[(d + 12) >> 2],
        Mb: E[(d + 16) >> 2],
        nb: E[(d + 20) >> 2],
        gb: E[(d + 24) >> 2],
        mb: E[(d + 28) >> 2],
        sd: E[(d + 32) >> 2],
        hd: E[(d + 36) >> 2],
        ld: n ? v(n) : "",
      };
      c = v(c);
      n = {
        "%c": "%a %b %d %H:%M:%S %Y",
        "%D": "%m/%d/%y",
        "%F": "%Y-%m-%d",
        "%h": "%b",
        "%r": "%I:%M:%S %p",
        "%R": "%H:%M",
        "%T": "%H:%M:%S",
        "%x": "%m/%d/%y",
        "%X": "%H:%M:%S",
        "%Ec": "%c",
        "%EC": "%C",
        "%Ex": "%m/%d/%y",
        "%EX": "%H:%M:%S",
        "%Ey": "%y",
        "%EY": "%Y",
        "%Od": "%d",
        "%Oe": "%e",
        "%OH": "%H",
        "%OI": "%I",
        "%Om": "%m",
        "%OM": "%M",
        "%OS": "%S",
        "%Ou": "%u",
        "%OU": "%U",
        "%OV": "%V",
        "%Ow": "%w",
        "%OW": "%W",
        "%Oy": "%y",
      };
      for (var r in n) c = c.replace(new RegExp(r, "g"), n[r]);
      var p = "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(
          " ",
        ),
        q =
          "January February March April May June July August September October November December".split(
            " ",
          );
      n = {
        "%a": function (k) {
          return p[k.gb].substring(0, 3);
        },
        "%A": function (k) {
          return p[k.gb];
        },
        "%b": function (k) {
          return q[k.Mb].substring(0, 3);
        },
        "%B": function (k) {
          return q[k.Mb];
        },
        "%C": function (k) {
          return f(((k.nb + 1900) / 100) | 0, 2);
        },
        "%d": function (k) {
          return f(k.Yb, 2);
        },
        "%e": function (k) {
          return e(k.Yb, 2, " ");
        },
        "%g": function (k) {
          return m(k).toString().substring(2);
        },
        "%G": function (k) {
          return m(k);
        },
        "%H": function (k) {
          return f(k.Lb, 2);
        },
        "%I": function (k) {
          k = k.Lb;
          0 == k ? (k = 12) : 12 < k && (k -= 12);
          return f(k, 2);
        },
        "%j": function (k) {
          for (
            var t = 0, x = 0;
            x <= k.Mb - 1;
            t += (Dd(k.nb + 1900) ? Yd : Zd)[x++]
          );
          return f(k.Yb + t, 3);
        },
        "%m": function (k) {
          return f(k.Mb + 1, 2);
        },
        "%M": function (k) {
          return f(k.jd, 2);
        },
        "%n": function () {
          return "\n";
        },
        "%p": function (k) {
          return 0 <= k.Lb && 12 > k.Lb ? "AM" : "PM";
        },
        "%S": function (k) {
          return f(k.kd, 2);
        },
        "%t": function () {
          return "\t";
        },
        "%u": function (k) {
          return k.gb || 7;
        },
        "%U": function (k) {
          return f(Math.floor((k.mb + 7 - k.gb) / 7), 2);
        },
        "%V": function (k) {
          var t = Math.floor((k.mb + 7 - ((k.gb + 6) % 7)) / 7);
          2 >= (k.gb + 371 - k.mb - 2) % 7 && t++;
          if (t)
            53 == t &&
              ((x = (k.gb + 371 - k.mb) % 7),
              4 == x || (3 == x && Dd(k.nb)) || (t = 1));
          else {
            t = 52;
            var x = (k.gb + 7 - k.mb - 1) % 7;
            (4 == x || (5 == x && Dd((k.nb % 400) - 1))) && t++;
          }
          return f(t, 2);
        },
        "%w": function (k) {
          return k.gb;
        },
        "%W": function (k) {
          return f(Math.floor((k.mb + 7 - ((k.gb + 6) % 7)) / 7), 2);
        },
        "%y": function (k) {
          return (k.nb + 1900).toString().substring(2);
        },
        "%Y": function (k) {
          return k.nb + 1900;
        },
        "%z": function (k) {
          k = k.hd;
          var t = 0 <= k;
          k = Math.abs(k) / 60;
          return (
            (t ? "+" : "-") +
            String("0000" + ((k / 60) * 100 + (k % 60))).slice(-4)
          );
        },
        "%Z": function (k) {
          return k.ld;
        },
        "%%": function () {
          return "%";
        },
      };
      c = c.replace(/%%/g, "\x00\x00");
      for (r in n)
        c.includes(r) && (c = c.replace(new RegExp(r, "g"), n[r](d)));
      c = c.replace(/\0\0/g, "%");
      r = eb(c, !1);
      if (r.length > b) return 0;
      C.set(r, a);
      return r.length - 1;
    }
    function Db(a, b, c, d) {
      a || (a = this);
      this.parent = a;
      this.hb = a.hb;
      this.vb = null;
      this.id = vb++;
      this.name = b;
      this.mode = c;
      this.Pa = {};
      this.Qa = {};
      this.xb = d;
    }
    Object.defineProperties(Db.prototype, {
      read: {
        get: function () {
          return 365 === (this.mode & 365);
        },
        set: function (a) {
          a ? (this.mode |= 365) : (this.mode &= -366);
        },
      },
      write: {
        get: function () {
          return 146 === (this.mode & 146);
        },
        set: function (a) {
          a ? (this.mode |= 146) : (this.mode &= -147);
        },
      },
      Nc: {
        get: function () {
          return 16384 === (this.mode & 61440);
        },
      },
      Mc: {
        get: function () {
          return 8192 === (this.mode & 61440);
        },
      },
    });
    Wb();
    wb = Array(4096);
    Kb(N, "/");
    P("/tmp", 16895, 0);
    P("/home", 16895, 0);
    P("/home/web_user", 16895, 0);
    (() => {
      P("/dev", 16895, 0);
      hb(259, { read: () => 0, write: (b, c, d, e) => e });
      Lb("/dev/null", 259);
      gb(1280, jb);
      gb(1536, kb);
      Lb("/dev/tty", 1280);
      Lb("/dev/tty1", 1536);
      var a = cb();
      bc("/dev", "random", a);
      bc("/dev", "urandom", a);
      P("/dev/shm", 16895, 0);
      P("/dev/shm/tmp", 16895, 0);
    })();
    (() => {
      P("/proc", 16895, 0);
      var a = P("/proc/self", 16895, 0);
      P("/proc/self/fd", 16895, 0);
      Kb(
        {
          hb: () => {
            var b = ob(a, "fd", 16895, 73);
            b.Pa = {
              tb: (c, d) => {
                var e = ub[+d];
                if (!e) throw new M(8);
                c = {
                  parent: null,
                  hb: { kc: "fake" },
                  Pa: { yb: () => e.path },
                };
                return (c.parent = c);
              },
            };
            return b;
          },
        },
        "/proc/self/fd",
      );
    })();
    var ec;
    g.FS_createPath = Zb;
    g.FS_createDataFile = ac;
    g.FS_createPreloadedFile = fc;
    g.FS_unlink = Nb;
    g.FS_createLazyFile = dc;
    g.FS_createDevice = bc;
    uc = g.InternalError = tc("InternalError");
    for (var ae = Array(256), be = 0; 256 > be; ++be)
      ae[be] = String.fromCharCode(be);
    zc = ae;
    Ac = g.BindingError = tc("BindingError");
    Oc.prototype.isAliasOf = function (a) {
      if (!(this instanceof Oc && a instanceof Oc)) return !1;
      var b = this.Ha.Ua.Sa,
        c = this.Ha.Ra,
        d = a.Ha.Ua.Sa;
      for (a = a.Ha.Ra; b.bb; ) (c = b.zb(c)), (b = b.bb);
      for (; d.bb; ) (a = d.zb(a)), (d = d.bb);
      return b === d && c === a;
    };
    Oc.prototype.clone = function () {
      this.Ha.Ra || Bc(this);
      if (this.Ha.wb) return (this.Ha.count.value += 1), this;
      var a = Nc,
        b = Object,
        c = b.create,
        d = Object.getPrototypeOf(this),
        e = this.Ha;
      a = a(
        c.call(b, d, {
          Ha: {
            value: {
              count: e.count,
              pb: e.pb,
              wb: e.wb,
              Ra: e.Ra,
              Ua: e.Ua,
              Za: e.Za,
              ab: e.ab,
            },
          },
        }),
      );
      a.Ha.count.value += 1;
      a.Ha.pb = !1;
      return a;
    };
    Oc.prototype["delete"] = function () {
      this.Ha.Ra || Bc(this);
      this.Ha.pb && !this.Ha.wb && S("Object already scheduled for deletion");
      Dc(this);
      Ec(this.Ha);
      this.Ha.wb || ((this.Ha.Za = void 0), (this.Ha.Ra = void 0));
    };
    Oc.prototype.isDeleted = function () {
      return !this.Ha.Ra;
    };
    Oc.prototype.deleteLater = function () {
      this.Ha.Ra || Bc(this);
      this.Ha.pb && !this.Ha.wb && S("Object already scheduled for deletion");
      Hc.push(this);
      1 === Hc.length && Jc && Jc(Ic);
      this.Ha.pb = !0;
      return this;
    };
    g.getInheritedInstanceCount = function () {
      return Object.keys(Kc).length;
    };
    g.getLiveInheritedInstances = function () {
      var a = [],
        b;
      for (b in Kc) Kc.hasOwnProperty(b) && a.push(Kc[b]);
      return a;
    };
    g.flushPendingDeletes = Ic;
    g.setDelayFunction = function (a) {
      Jc = a;
      Hc.length && Jc && Jc(Ic);
    };
    Xc.prototype.Fc = function (a) {
      this.nc && (a = this.nc(a));
      return a;
    };
    Xc.prototype.dc = function (a) {
      this.ib && this.ib(a);
    };
    Xc.prototype.argPackAdvance = 8;
    Xc.prototype.readValueFromPointer = nc;
    Xc.prototype.deleteObject = function (a) {
      if (null !== a) a["delete"]();
    };
    Xc.prototype.fromWireType = function (a) {
      function b() {
        return this.Gb
          ? Mc(this.Sa.qb, { Ua: this.Sc, Ra: c, ab: this, Za: a })
          : Mc(this.Sa.qb, { Ua: this, Ra: a });
      }
      var c = this.Fc(a);
      if (!c) return this.dc(a), null;
      var d = Lc(this.Sa, c);
      if (void 0 !== d) {
        if (0 === d.Ha.count.value)
          return (d.Ha.Ra = c), (d.Ha.Za = a), d.clone();
        d = d.clone();
        this.dc(a);
        return d;
      }
      d = this.Sa.Ec(c);
      d = Gc[d];
      if (!d) return b.call(this);
      d = this.Fb ? d.yc : d.pointerType;
      var e = Fc(c, this.Sa, d.Sa);
      return null === e
        ? b.call(this)
        : this.Gb
          ? Mc(d.Sa.qb, { Ua: d, Ra: e, ab: this, Za: a })
          : Mc(d.Sa.qb, { Ua: d, Ra: e });
    };
    ad = g.UnboundTypeError = tc("UnboundTypeError");
    g.count_emval_handles = function () {
      for (var a = 0, b = 5; b < W.length; ++b) void 0 !== W[b] && ++a;
      return a;
    };
    g.get_first_emval = function () {
      for (var a = 5; a < W.length; ++a) if (void 0 !== W[a]) return W[a];
      return null;
    };
    Ka("library_fetch_init");
    (function (a, b) {
      try {
        var c = indexedDB.open("emscripten_filesystem", 1);
      } catch (d) {
        b(d);
        return;
      }
      c.onupgradeneeded = (d) => {
        d = d.target.result;
        d.objectStoreNames.contains("FILES") && d.deleteObjectStore("FILES");
        d.createObjectStore("FILES");
      };
      c.onsuccess = (d) => a(d.target.result);
      c.onerror = (d) => b(d);
    })(
      (a) => {
        Ld = a;
        La("library_fetch_init");
      },
      () => {
        Ld = !1;
        La("library_fetch_init");
      },
    );
    var ge = {
      sa: function (a, b, c) {
        new Ya(a).Kc(b, c);
        Za++;
        throw a;
      },
      F: function (a, b, c) {
        jc = c;
        try {
          var d = hc(a);
          switch (b) {
            case 0:
              var e = kc();
              return 0 > e ? -28 : Jb(d, e).jb;
            case 1:
            case 2:
              return 0;
            case 3:
              return d.flags;
            case 4:
              return (e = kc()), (d.flags |= e), 0;
            case 5:
              return (e = kc()), (va[(e + 0) >> 1] = 2), 0;
            case 6:
            case 7:
              return 0;
            case 16:
            case 8:
              return -28;
            case 9:
              return -1;
            default:
              return -28;
          }
        } catch (f) {
          if ("undefined" == typeof Q || "ErrnoError" !== f.name) throw f;
          return -f.Wa;
        }
      },
      da: function (a, b) {
        try {
          var c = hc(a);
          return ic(Ob, c.path, b);
        } catch (d) {
          if ("undefined" == typeof Q || "ErrnoError" !== d.name) throw d;
          return -d.Wa;
        }
      },
      ea: function (a, b, c) {
        jc = c;
        try {
          var d = hc(a);
          switch (b) {
            case 21509:
            case 21505:
              return d.Va ? 0 : -59;
            case 21510:
            case 21511:
            case 21512:
            case 21506:
            case 21507:
            case 21508:
              return d.Va ? 0 : -59;
            case 21519:
              if (!d.Va) return -59;
              var e = kc();
              return (E[e >> 2] = 0);
            case 21520:
              return d.Va ? -28 : -59;
            case 21531:
              a = e = kc();
              if (!d.Qa.Lc) throw new M(59);
              return d.Qa.Lc(d, b, a);
            case 21523:
              return d.Va ? 0 : -59;
            case 21524:
              return d.Va ? 0 : -59;
            default:
              return -28;
          }
        } catch (f) {
          if ("undefined" == typeof Q || "ErrnoError" !== f.name) throw f;
          return -f.Wa;
        }
      },
      ba: function (a, b) {
        try {
          return (a = v(a)), ic(Pb, a, b);
        } catch (c) {
          if ("undefined" == typeof Q || "ErrnoError" !== c.name) throw c;
          return -c.Wa;
        }
      },
      aa: function (a, b, c, d) {
        try {
          b = v(b);
          var e = d & 256;
          b = gc(a, b, d & 4096);
          return ic(e ? Pb : Ob, b, c);
        } catch (f) {
          if ("undefined" == typeof Q || "ErrnoError" !== f.name) throw f;
          return -f.Wa;
        }
      },
      G: function (a, b, c, d) {
        jc = d;
        try {
          b = v(b);
          b = gc(a, b);
          var e = d ? kc() : 0;
          return Sb(b, c, e).jb;
        } catch (f) {
          if ("undefined" == typeof Q || "ErrnoError" !== f.name) throw f;
          return -f.Wa;
        }
      },
      ca: function (a, b) {
        try {
          return (a = v(a)), ic(Ob, a, b);
        } catch (c) {
          if ("undefined" == typeof Q || "ErrnoError" !== c.name) throw c;
          return -c.Wa;
        }
      },
      d: function (a) {
        var b = lc[a];
        delete lc[a];
        var c = b.Ub,
          d = b.ib,
          e = b.fc,
          f = e.map((h) => h.Hc).concat(e.map((h) => h.ed));
        wc([a], f, (h) => {
          var l = {};
          e.forEach((m, n) => {
            var r = h[n],
              p = m.Eb,
              q = m.Gc,
              k = h[n + e.length],
              t = m.dd,
              x = m.fd;
            l[m.Dc] = {
              read: (z) => r.fromWireType(p(q, z)),
              write: (z, F) => {
                var H = [];
                t(x, z, k.toWireType(H, F));
                mc(H);
              },
            };
          });
          return [
            {
              name: b.name,
              fromWireType: function (m) {
                var n = {},
                  r;
                for (r in l) n[r] = l[r].read(m);
                d(m);
                return n;
              },
              toWireType: function (m, n) {
                for (var r in l)
                  if (!(r in n))
                    throw new TypeError('Missing field:  "' + r + '"');
                var p = c();
                for (r in l) l[r].write(p, n[r]);
                null !== m && m.push(d, p);
                return p;
              },
              argPackAdvance: 8,
              readValueFromPointer: nc,
              cb: d,
            },
          ];
        });
      },
      P: function () {},
      la: function (a, b, c, d, e) {
        var f = yc(c);
        b = R(b);
        xc(a, {
          name: b,
          fromWireType: function (h) {
            return !!h;
          },
          toWireType: function (h, l) {
            return l ? d : e;
          },
          argPackAdvance: 8,
          readValueFromPointer: function (h) {
            if (1 === c) var l = C;
            else if (2 === c) l = va;
            else if (4 === c) l = E;
            else throw new TypeError("Unknown boolean type size: " + b);
            return this.fromWireType(l[h >> f]);
          },
          cb: null,
        });
      },
      t: function (a, b, c, d, e, f, h, l, m, n, r, p, q) {
        r = R(r);
        f = V(e, f);
        l && (l = V(h, l));
        n && (n = V(m, n));
        q = V(p, q);
        var k = rc(r);
        Qc(k, function () {
          ed("Cannot construct " + r + " due to unbound types", [d]);
        });
        wc([a, b, c], d ? [d] : [], function (t) {
          t = t[0];
          if (d) {
            var x = t.Sa;
            var z = x.qb;
          } else z = Oc.prototype;
          t = sc(k, function () {
            if (Object.getPrototypeOf(this) !== F)
              throw new Ac("Use 'new' to construct " + r);
            if (void 0 === H.kb)
              throw new Ac(r + " has no accessible constructor");
            var O = H.kb[arguments.length];
            if (void 0 === O)
              throw new Ac(
                "Tried to invoke ctor of " +
                  r +
                  " with invalid number of parameters (" +
                  arguments.length +
                  ") - expected (" +
                  Object.keys(H.kb).toString() +
                  ") parameters instead!",
              );
            return O.apply(this, arguments);
          });
          var F = Object.create(z, { constructor: { value: t } });
          t.prototype = F;
          var H = new Rc(r, t, F, q, x, f, l, n);
          x = new Xc(r, H, !0, !1);
          z = new Xc(r + "*", H, !1, !1);
          var y = new Xc(r + " const*", H, !1, !0);
          Gc[a] = { pointerType: z, yc: y };
          Yc(k, t);
          return [x, z, y];
        });
      },
      w: function (a, b, c, d, e, f) {
        0 < b || oa();
        var h = fd(b, c);
        e = V(d, e);
        wc([], [a], function (l) {
          l = l[0];
          var m = "constructor " + l.name;
          void 0 === l.Sa.kb && (l.Sa.kb = []);
          if (void 0 !== l.Sa.kb[b - 1])
            throw new Ac(
              "Cannot register multiple constructors with identical number of parameters (" +
                (b - 1) +
                ") for class '" +
                l.name +
                "'! Overload resolution is currently only performed using the parameter count, not actual type info!",
            );
          l.Sa.kb[b - 1] = () => {
            ed("Cannot construct " + l.name + " due to unbound types", h);
          };
          wc([], h, function (n) {
            n.splice(1, 0, null);
            l.Sa.kb[b - 1] = gd(m, n, null, e, f);
            return [];
          });
          return [];
        });
      },
      i: function (a, b, c, d, e, f, h, l) {
        var m = fd(c, d);
        b = R(b);
        f = V(e, f);
        wc([], [a], function (n) {
          function r() {
            ed("Cannot call " + p + " due to unbound types", m);
          }
          n = n[0];
          var p = n.name + "." + b;
          b.startsWith("@@") && (b = Symbol[b.substring(2)]);
          l && n.Sa.Tc.push(b);
          var q = n.Sa.qb,
            k = q[b];
          void 0 === k ||
          (void 0 === k.Ya && k.className !== n.name && k.Ab === c - 2)
            ? ((r.Ab = c - 2), (r.className = n.name), (q[b] = r))
            : (Pc(q, b, p), (q[b].Ya[c - 2] = r));
          wc([], m, function (t) {
            t = gd(p, t, n, f, h);
            void 0 === q[b].Ya
              ? ((t.Ab = c - 2), (q[b] = t))
              : (q[b].Ya[c - 2] = t);
            return [];
          });
          return [];
        });
      },
      ka: function (a, b) {
        b = R(b);
        xc(a, {
          name: b,
          fromWireType: function (c) {
            var d = X(c);
            jd(c);
            return d;
          },
          toWireType: function (c, d) {
            return T(d);
          },
          argPackAdvance: 8,
          readValueFromPointer: nc,
          cb: null,
        });
      },
      I: function (a, b, c) {
        c = yc(c);
        b = R(b);
        xc(a, {
          name: b,
          fromWireType: function (d) {
            return d;
          },
          toWireType: function (d, e) {
            return e;
          },
          argPackAdvance: 8,
          readValueFromPointer: kd(b, c),
          cb: null,
        });
      },
      A: function (a, b, c, d, e, f) {
        var h = fd(b, c);
        a = R(a);
        e = V(d, e);
        Qc(
          a,
          function () {
            ed("Cannot call " + a + " due to unbound types", h);
          },
          b - 1,
        );
        wc([], h, function (l) {
          Yc(a, gd(a, [l[0], null].concat(l.slice(1)), null, e, f), b - 1);
          return [];
        });
      },
      o: function (a, b, c, d, e) {
        b = R(b);
        -1 === e && (e = 4294967295);
        e = yc(c);
        var f = (l) => l;
        if (0 === d) {
          var h = 32 - 8 * c;
          f = (l) => (l << h) >>> h;
        }
        c = b.includes("unsigned")
          ? function (l, m) {
              return m >>> 0;
            }
          : function (l, m) {
              return m;
            };
        xc(a, {
          name: b,
          fromWireType: f,
          toWireType: c,
          argPackAdvance: 8,
          readValueFromPointer: ld(b, e, 0 !== d),
          cb: null,
        });
      },
      h: function (a, b, c) {
        function d(f) {
          f >>= 2;
          var h = G;
          return new e(h.buffer, h[f + 1], h[f]);
        }
        var e = [
          Int8Array,
          Uint8Array,
          Int16Array,
          Uint16Array,
          Int32Array,
          Uint32Array,
          Float32Array,
          Float64Array,
        ][b];
        c = R(c);
        xc(
          a,
          {
            name: c,
            fromWireType: d,
            argPackAdvance: 8,
            readValueFromPointer: d,
          },
          { Jc: !0 },
        );
      },
      J: function (a, b) {
        b = R(b);
        var c = "std::string" === b;
        xc(a, {
          name: b,
          fromWireType: function (d) {
            var e = G[d >> 2],
              f = d + 4;
            if (c)
              for (var h = f, l = 0; l <= e; ++l) {
                var m = f + l;
                if (l == e || 0 == w[m]) {
                  h = v(h, m - h);
                  if (void 0 === n) var n = h;
                  else (n += String.fromCharCode(0)), (n += h);
                  h = m + 1;
                }
              }
            else {
              n = Array(e);
              for (l = 0; l < e; ++l) n[l] = String.fromCharCode(w[f + l]);
              n = n.join("");
            }
            dd(d);
            return n;
          },
          toWireType: function (d, e) {
            e instanceof ArrayBuffer && (e = new Uint8Array(e));
            var f = "string" == typeof e;
            f ||
              e instanceof Uint8Array ||
              e instanceof Uint8ClampedArray ||
              e instanceof Int8Array ||
              S("Cannot pass non-string to std::string");
            var h = c && f ? ua(e) : e.length;
            var l = Id(4 + h + 1),
              m = l + 4;
            G[l >> 2] = h;
            if (c && f) A(e, w, m, h + 1);
            else if (f)
              for (f = 0; f < h; ++f) {
                var n = e.charCodeAt(f);
                255 < n &&
                  (dd(m),
                  S("String has UTF-16 code units that do not fit in 8 bits"));
                w[m + f] = n;
              }
            else for (f = 0; f < h; ++f) w[m + f] = e[f];
            null !== d && d.push(dd, l);
            return l;
          },
          argPackAdvance: 8,
          readValueFromPointer: nc,
          cb: function (d) {
            dd(d);
          },
        });
      },
      z: function (a, b, c) {
        c = R(c);
        if (2 === b) {
          var d = nd;
          var e = od;
          var f = pd;
          var h = () => D;
          var l = 1;
        } else
          4 === b && ((d = qd), (e = rd), (f = sd), (h = () => G), (l = 2));
        xc(a, {
          name: c,
          fromWireType: function (m) {
            for (var n = G[m >> 2], r = h(), p, q = m + 4, k = 0; k <= n; ++k) {
              var t = m + 4 + k * b;
              if (k == n || 0 == r[t >> l])
                (q = d(q, t - q)),
                  void 0 === p
                    ? (p = q)
                    : ((p += String.fromCharCode(0)), (p += q)),
                  (q = t + b);
            }
            dd(m);
            return p;
          },
          toWireType: function (m, n) {
            "string" != typeof n &&
              S("Cannot pass non-string to C++ string type " + c);
            var r = f(n),
              p = Id(4 + r + b);
            G[p >> 2] = r >> l;
            e(n, p + 4, r + b);
            null !== m && m.push(dd, p);
            return p;
          },
          argPackAdvance: 8,
          readValueFromPointer: nc,
          cb: function (m) {
            dd(m);
          },
        });
      },
      e: function (a, b, c, d, e, f) {
        lc[a] = { name: R(b), Ub: V(c, d), ib: V(e, f), fc: [] };
      },
      b: function (a, b, c, d, e, f, h, l, m, n) {
        lc[a].fc.push({
          Dc: R(b),
          Hc: c,
          Eb: V(d, e),
          Gc: f,
          ed: h,
          dd: V(l, m),
          fd: n,
        });
      },
      ma: function (a, b) {
        b = R(b);
        xc(a, {
          Oc: !0,
          name: b,
          argPackAdvance: 0,
          fromWireType: function () {},
          toWireType: function () {},
        });
      },
      na: function (a) {
        var b = Kd[a];
        b && (delete Kd[a], 0 < b.readyState && 4 > b.readyState && b.abort());
      },
      ga: function () {
        return !0;
      },
      T: function () {
        throw Infinity;
      },
      m: function (a, b, c) {
        a = X(a);
        b = td(b, "emval::as");
        var d = [],
          e = T(d);
        G[c >> 2] = e;
        return b.toWireType(d, a);
      },
      L: function (a, b, c, d) {
        a = X(a);
        c = ud(b, c);
        for (var e = Array(b), f = 0; f < b; ++f) {
          var h = c[f];
          e[f] = h.readValueFromPointer(d);
          d += h.argPackAdvance;
        }
        a = a.apply(void 0, e);
        return T(a);
      },
      s: function (a, b, c, d) {
        a = xd[a];
        b = X(b);
        c = wd(c);
        a(b, c, null, d);
      },
      c: jd,
      M: function (a, b) {
        a = X(a);
        b = X(b);
        return a == b;
      },
      q: function (a) {
        if (0 === a) return T(yd());
        a = wd(a);
        return T(yd()[a]);
      },
      r: function (a, b) {
        var c = ud(a, b),
          d = c[0];
        b =
          d.name +
          "_$" +
          c
            .slice(1)
            .map(function (h) {
              return h.name;
            })
            .join("_") +
          "$";
        var e = Ad[b];
        if (void 0 !== e) return e;
        var f = Array(a - 1);
        e = zd((h, l, m, n) => {
          for (var r = 0, p = 0; p < a - 1; ++p)
            (f[p] = c[p + 1].readValueFromPointer(n + r)),
              (r += c[p + 1].argPackAdvance);
          h = h[l].apply(h, f);
          for (p = 0; p < a - 1; ++p) c[p + 1].Ac && c[p + 1].Ac(f[p]);
          if (!d.Oc) return d.toWireType(m, h);
        });
        return (Ad[b] = e);
      },
      B: function (a, b) {
        a = X(a);
        b = X(b);
        return T(a[b]);
      },
      u: function (a) {
        4 < a && (W[a].Wb += 1);
      },
      ta: function (a, b) {
        a = X(a);
        b = X(b);
        return a instanceof b;
      },
      v: function (a, b, c, d) {
        a = X(a);
        var e = Cd[b];
        e || ((e = Bd(b)), (Cd[b] = e));
        return e(a, c, d);
      },
      k: function () {
        return T([]);
      },
      f: function (a) {
        return T(wd(a));
      },
      n: function () {
        return T({});
      },
      l: function (a) {
        var b = X(a);
        mc(b);
        jd(a);
      },
      g: function (a, b, c) {
        a = X(a);
        b = X(b);
        c = X(c);
        a[b] = c;
      },
      j: function (a, b) {
        a = td(a, "_emval_take_value");
        a = a.readValueFromPointer(b);
        return T(a);
      },
      N: function (a) {
        a = X(a);
        return T(typeof a);
      },
      ha: function (a, b) {
        a = new Date(1e3 * (G[a >> 2] + 4294967296 * E[(a + 4) >> 2]));
        E[b >> 2] = a.getSeconds();
        E[(b + 4) >> 2] = a.getMinutes();
        E[(b + 8) >> 2] = a.getHours();
        E[(b + 12) >> 2] = a.getDate();
        E[(b + 16) >> 2] = a.getMonth();
        E[(b + 20) >> 2] = a.getFullYear() - 1900;
        E[(b + 24) >> 2] = a.getDay();
        E[(b + 28) >> 2] = Gd(a) | 0;
        E[(b + 36) >> 2] = -(60 * a.getTimezoneOffset());
        var c = new Date(a.getFullYear(), 6, 1).getTimezoneOffset(),
          d = new Date(a.getFullYear(), 0, 1).getTimezoneOffset();
        E[(b + 32) >> 2] =
          (c != d && a.getTimezoneOffset() == Math.min(d, c)) | 0;
      },
      ia: function (a) {
        var b = new Date(
            E[(a + 20) >> 2] + 1900,
            E[(a + 16) >> 2],
            E[(a + 12) >> 2],
            E[(a + 8) >> 2],
            E[(a + 4) >> 2],
            E[a >> 2],
            0,
          ),
          c = E[(a + 32) >> 2],
          d = b.getTimezoneOffset(),
          e = new Date(b.getFullYear(), 6, 1).getTimezoneOffset(),
          f = new Date(b.getFullYear(), 0, 1).getTimezoneOffset(),
          h = Math.min(f, e);
        0 > c
          ? (E[(a + 32) >> 2] = Number(e != f && h == d))
          : 0 < c != (h == d) &&
            ((e = Math.max(f, e)),
            b.setTime(b.getTime() + 6e4 * ((0 < c ? h : e) - d)));
        E[(a + 24) >> 2] = b.getDay();
        E[(a + 28) >> 2] = Gd(b) | 0;
        E[a >> 2] = b.getSeconds();
        E[(a + 4) >> 2] = b.getMinutes();
        E[(a + 8) >> 2] = b.getHours();
        E[(a + 12) >> 2] = b.getDate();
        E[(a + 16) >> 2] = b.getMonth();
        E[(a + 20) >> 2] = b.getYear();
        return (b.getTime() / 1e3) | 0;
      },
      Y: function (a, b, c, d, e, f, h) {
        try {
          var l = hc(d);
          if (0 !== (b & 2) && 0 === (c & 2) && 2 !== (l.flags & 2097155))
            throw new M(2);
          if (1 === (l.flags & 2097155)) throw new M(2);
          if (!l.Qa.ub) throw new M(43);
          var m = l.Qa.ub(l, a, e, b, c);
          var n = m.Ra;
          E[f >> 2] = m.$b;
          G[h >> 2] = n;
          return 0;
        } catch (r) {
          if ("undefined" == typeof Q || "ErrnoError" !== r.name) throw r;
          return -r.Wa;
        }
      },
      Z: function (a, b, c, d, e, f) {
        try {
          var h = hc(e);
          if (c & 2) {
            if (32768 !== (h.node.mode & 61440)) throw new M(43);
            d & 2 || (h.Qa.Ib && h.Qa.Ib(h, w.slice(a, a + b), f, b, d));
          }
        } catch (l) {
          if ("undefined" == typeof Q || "ErrnoError" !== l.name) throw l;
          return -l.Wa;
        }
      },
      ja: function (a, b, c) {
        function d(m) {
          return (m = m.toTimeString().match(/\(([A-Za-z ]+)\)$/))
            ? m[1]
            : "GMT";
        }
        var e = new Date().getFullYear(),
          f = new Date(e, 0, 1),
          h = new Date(e, 6, 1);
        e = f.getTimezoneOffset();
        var l = h.getTimezoneOffset();
        G[a >> 2] = 60 * Math.max(e, l);
        E[b >> 2] = Number(e != l);
        a = d(f);
        b = d(h);
        a = Hd(a);
        b = Hd(b);
        l < e
          ? ((G[c >> 2] = a), (G[(c + 4) >> 2] = b))
          : ((G[c >> 2] = b), (G[(c + 4) >> 2] = a));
      },
      a: function () {
        oa("");
      },
      p: function (a, b, c) {
        Jd.length = 0;
        var d;
        for (c >>= 2; (d = w[b++]); )
          (c += (105 != d) & c), Jd.push(105 == d ? E[c] : xa[c++ >> 1]), ++c;
        return Va[a].apply(null, Jd);
      },
      H: function () {
        return Date.now();
      },
      X: function () {
        return 2147483648;
      },
      x: () => performance.now(),
      pa: function () {
        return !ha;
      },
      fa: function (a, b, c) {
        w.copyWithin(a, b, b + c);
      },
      W: function (a) {
        var b = w.length;
        a >>>= 0;
        if (2147483648 < a) return !1;
        for (var c = 1; 4 >= c; c *= 2) {
          var d = Math,
            e = d.min;
          var f = Math.max(a, b + 2097152 / c);
          f += (65536 - (f % 65536)) % 65536;
          a: {
            var h = pa.buffer;
            try {
              pa.grow((e.call(d, 2147483648, f) - h.byteLength + 65535) >>> 16);
              ya();
              var l = 1;
              break a;
            } catch (m) {}
            l = void 0;
          }
          if (l) return !0;
        }
        return !1;
      },
      oa: function (a, b, c, d, e) {
        function f(I) {
          if (z) I();
          else if (!Ea && !qa)
            try {
              if ((I(), !(noExitRuntime || 0 < Fa)))
                try {
                  Od(ra);
                } catch (Ta) {
                  Nd(Ta);
                }
            } catch (Ta) {
              Nd(Ta);
            }
        }
        Fa += 1;
        var h = a + 112,
          l = v(h),
          m = G[(h + 36) >> 2],
          n = G[(h + 40) >> 2],
          r = G[(h + 44) >> 2],
          p = G[(h + 48) >> 2],
          q = G[(h + 52) >> 2],
          k = !!(q & 4),
          t = !!(q & 32),
          x = !!(q & 16),
          z = !!(q & 64),
          F = (I) => {
            --Fa;
            f(() => {
              m ? U(m)(I) : b && b(I);
            });
          },
          H = (I) => {
            f(() => {
              r ? U(r)(I) : d && d(I);
            });
          },
          y = (I) => {
            --Fa;
            f(() => {
              n ? U(n)(I) : c && c(I);
            });
          },
          O = (I) => {
            f(() => {
              p ? U(p)(I) : e && e(I);
            });
          };
        q = (I) => {
          Md(I, F, y, H, O);
        };
        var B = (I, Ta) => {
            Rd(
              I,
              Ta.response,
              (Ua) => {
                --Fa;
                f(() => {
                  m ? U(m)(Ua) : b && b(Ua);
                });
              },
              (Ua) => {
                --Fa;
                f(() => {
                  m ? U(m)(Ua) : b && b(Ua);
                });
              },
            );
          },
          Z = (I) => {
            Md(I, B, y, H, O);
          };
        if ("EM_IDB_STORE" === l)
          (l = G[(h + 84) >> 2]), Rd(a, w.slice(l, l + G[(h + 88) >> 2]), F, y);
        else if ("EM_IDB_DELETE" === l) Td(a, F, y);
        else if (x) {
          if (t) return 0;
          Md(a, k ? B : F, y, H, O);
        } else Sd(a, F, t ? y : k ? Z : q);
        return a;
      },
      _: function (a, b) {
        var c = 0;
        Vd().forEach(function (d, e) {
          var f = b + c;
          e = G[(a + 4 * e) >> 2] = f;
          for (f = 0; f < d.length; ++f) C[e++ >> 0] = d.charCodeAt(f);
          C[e >> 0] = 0;
          c += d.length + 1;
        });
        return 0;
      },
      $: function (a, b) {
        var c = Vd();
        G[a >> 2] = c.length;
        var d = 0;
        c.forEach(function (e) {
          d += e.length + 1;
        });
        G[b >> 2] = d;
        return 0;
      },
      K: Od,
      y: function (a) {
        try {
          var b = hc(a);
          Tb(b);
          return 0;
        } catch (c) {
          if ("undefined" == typeof Q || "ErrnoError" !== c.name) throw c;
          return c.Wa;
        }
      },
      E: function (a, b, c, d) {
        try {
          a: {
            var e = hc(a);
            a = b;
            for (var f, h = (b = 0); h < c; h++) {
              var l = G[a >> 2],
                m = G[(a + 4) >> 2];
              a += 8;
              var n = e,
                r = l,
                p = m,
                q = f,
                k = C;
              if (0 > p || 0 > q) throw new M(28);
              if (null === n.jb) throw new M(8);
              if (1 === (n.flags & 2097155)) throw new M(8);
              if (16384 === (n.node.mode & 61440)) throw new M(31);
              if (!n.Qa.read) throw new M(28);
              var t = "undefined" != typeof q;
              if (!t) q = n.position;
              else if (!n.seekable) throw new M(70);
              var x = n.Qa.read(n, k, r, p, q);
              t || (n.position += x);
              var z = x;
              if (0 > z) {
                var F = -1;
                break a;
              }
              b += z;
              if (z < m) break;
              "undefined" !== typeof f && (f += z);
            }
            F = b;
          }
          G[d >> 2] = F;
          return 0;
        } catch (H) {
          if ("undefined" == typeof Q || "ErrnoError" !== H.name) throw H;
          return H.Wa;
        }
      },
      O: function (a, b, c, d, e) {
        try {
          b =
            (c + 2097152) >>> 0 < 4194305 - !!b
              ? (b >>> 0) + 4294967296 * c
              : NaN;
          if (isNaN(b)) return 61;
          var f = hc(a);
          Ub(f, b, d);
          K = [
            f.position >>> 0,
            ((J = f.position),
            1 <= +Math.abs(J)
              ? 0 < J
                ? (Math.min(+Math.floor(J / 4294967296), 4294967295) | 0) >>> 0
                : ~~+Math.ceil((J - +(~~J >>> 0)) / 4294967296) >>> 0
              : 0),
          ];
          E[e >> 2] = K[0];
          E[(e + 4) >> 2] = K[1];
          f.Pb && 0 === b && 0 === d && (f.Pb = null);
          return 0;
        } catch (h) {
          if ("undefined" == typeof Q || "ErrnoError" !== h.name) throw h;
          return h.Wa;
        }
      },
      D: function (a, b, c, d) {
        try {
          a: {
            var e = hc(a);
            a = b;
            for (var f, h = (b = 0); h < c; h++) {
              var l = G[a >> 2],
                m = G[(a + 4) >> 2];
              a += 8;
              var n = Vb(e, C, l, m, f);
              if (0 > n) {
                var r = -1;
                break a;
              }
              b += n;
              "undefined" !== typeof f && (f += n);
            }
            r = b;
          }
          G[d >> 2] = r;
          return 0;
        } catch (p) {
          if ("undefined" == typeof Q || "ErrnoError" !== p.name) throw p;
          return p.Wa;
        }
      },
      qa: function () {
        var a = stackTrace(),
          b = ua(a) + 1,
          c = Id(b);
        A(a, w, c, b);
        return c;
      },
      U: Xd,
      Q: ce,
      C: de,
      R: ee,
      S: fe,
      ra: $d,
      V: function (a, b, c, d) {
        return $d(a, b, c, d);
      },
    };
    (function () {
      function a(c) {
        c = c.exports;
        g.asm = c;
        pa = g.asm.ua;
        ya();
        za = g.asm.ya;
        Ba.unshift(g.asm.va);
        La("wasm-instantiate");
        return c;
      }
      var b = { a: ge };
      Ka("wasm-instantiate");
      if (g.instantiateWasm)
        try {
          return g.instantiateWasm(b, a);
        } catch (c) {
          u("Module.instantiateWasm callback failed with error: " + c), ba(c);
        }
      Sa(b, function (c) {
        a(c.instance);
      }).catch(ba);
      return {};
    })();
    function dd() {
      return (dd = g.asm.wa).apply(null, arguments);
    }
    function Id() {
      return (Id = g.asm.xa).apply(null, arguments);
    }
    var Qd = (g._fflush = function () {
        return (Qd = g._fflush = g.asm.za).apply(null, arguments);
      }),
      cd = (g.___getTypeName = function () {
        return (cd = g.___getTypeName = g.asm.Aa).apply(null, arguments);
      });
    g.__embind_initialize_bindings = function () {
      return (g.__embind_initialize_bindings = g.asm.Ba).apply(null, arguments);
    };
    function Pd() {
      return (Pd = g.asm.Ca).apply(null, arguments);
    }
    function mb() {
      return (mb = g.asm.Da).apply(null, arguments);
    }
    function he() {
      return (he = g.asm.Ea).apply(null, arguments);
    }
    function ie() {
      return (ie = g.asm.Fa).apply(null, arguments);
    }
    function je() {
      return (je = g.asm.Ga).apply(null, arguments);
    }
    g.dynCall_ji = function () {
      return (g.dynCall_ji = g.asm.Ia).apply(null, arguments);
    };
    g.dynCall_jiji = function () {
      return (g.dynCall_jiji = g.asm.Ja).apply(null, arguments);
    };
    g.dynCall_viijii = function () {
      return (g.dynCall_viijii = g.asm.Ka).apply(null, arguments);
    };
    g.dynCall_iiiiij = function () {
      return (g.dynCall_iiiiij = g.asm.La).apply(null, arguments);
    };
    g.dynCall_iiiiijj = function () {
      return (g.dynCall_iiiiijj = g.asm.Ma).apply(null, arguments);
    };
    g.dynCall_iiiiiijj = function () {
      return (g.dynCall_iiiiiijj = g.asm.Na).apply(null, arguments);
    };
    g.__ZN2MB2NN28LinearDefragmentingAllocator10Allocation4nullE = 1024;
    g.___start_em_js = 355396;
    g.___stop_em_js = 355819;
    function de(a, b) {
      var c = ie();
      try {
        U(a)(b);
      } catch (d) {
        je(c);
        if (d !== d + 0) throw d;
        he(1, 0);
      }
    }
    function fe(a, b, c, d) {
      var e = ie();
      try {
        U(a)(b, c, d);
      } catch (f) {
        je(e);
        if (f !== f + 0) throw f;
        he(1, 0);
      }
    }
    function ee(a, b, c) {
      var d = ie();
      try {
        U(a)(b, c);
      } catch (e) {
        je(d);
        if (e !== e + 0) throw e;
        he(1, 0);
      }
    }
    function ce(a, b, c, d) {
      var e = ie();
      try {
        return U(a)(b, c, d);
      } catch (f) {
        je(e);
        if (f !== f + 0) throw f;
        he(1, 0);
      }
    }
    g.addRunDependency = Ka;
    g.removeRunDependency = La;
    g.FS_createPath = Zb;
    g.FS_createDataFile = ac;
    g.FS_createPreloadedFile = fc;
    g.FS_createLazyFile = dc;
    g.FS_createDevice = bc;
    g.FS_unlink = Nb;
    var ke;
    Ja = function le() {
      ke || me();
      ke || (Ja = le);
    };
    function me() {
      function a() {
        if (!ke && ((ke = !0), (g.calledRun = !0), !qa)) {
          g.noFSInit ||
            Xb ||
            ((Xb = !0),
            Wb(),
            (g.stdin = g.stdin),
            (g.stdout = g.stdout),
            (g.stderr = g.stderr),
            g.stdin
              ? bc("/dev", "stdin", g.stdin)
              : Mb("/dev/tty", "/dev/stdin"),
            g.stdout
              ? bc("/dev", "stdout", null, g.stdout)
              : Mb("/dev/tty", "/dev/stdout"),
            g.stderr
              ? bc("/dev", "stderr", null, g.stderr)
              : Mb("/dev/tty1", "/dev/stderr"),
            Sb("/dev/stdin", 0),
            Sb("/dev/stdout", 1),
            Sb("/dev/stderr", 1));
          xb = !1;
          Xa(Ba);
          aa(g);
          if (g.onRuntimeInitialized) g.onRuntimeInitialized();
          if (g.postRun)
            for (
              "function" == typeof g.postRun && (g.postRun = [g.postRun]);
              g.postRun.length;

            ) {
              var b = g.postRun.shift();
              Da.unshift(b);
            }
          Xa(Da);
        }
      }
      if (!(0 < Ha)) {
        if (g.preRun)
          for (
            "function" == typeof g.preRun && (g.preRun = [g.preRun]);
            g.preRun.length;

          )
            Ga();
        Xa(Aa);
        0 < Ha ||
          (g.setStatus
            ? (g.setStatus("Running..."),
              setTimeout(function () {
                setTimeout(function () {
                  g.setStatus("");
                }, 1);
                a();
              }, 1))
            : a());
      }
    }
    if (g.preInit)
      for (
        "function" == typeof g.preInit && (g.preInit = [g.preInit]);
        0 < g.preInit.length;

      )
        g.preInit.pop()();
    me();
    if (
      "object" == typeof window &&
      ("undefined" == typeof ENVIRONMENT_IS_PTHREAD || !ENVIRONMENT_IS_PTHREAD)
    ) {
      var ne = () => {
        var a = 0,
          b = !1,
          c = (m) => {
            var n = new XMLHttpRequest();
            n.open("POST", "stdio.html", !1);
            n.send(m);
            try {
              window.close();
            } catch (r) {}
          },
          d = (m) => {
            var n = new XMLHttpRequest();
            ++a;
            n.onreadystatechange = () => {
              4 == n.readyState && 0 == --a && b && c("^exit^" + ra);
            };
            n.open("POST", "stdio.html", !0);
            n.send(m);
          };
        if (
          -1 != document.URL.search("localhost") ||
          -1 != document.URL.search(":6931/")
        ) {
          var e = 1,
            f = ma,
            h = u;
          Ca.unshift(() => {
            0 == a ? c("^exit^" + ra) : (b = !0);
          });
          ma = (m) => {
            d("^out^" + e++ + "^" + encodeURIComponent(m));
            f(m);
          };
          u = (m) => {
            d("^err^" + e++ + "^" + encodeURIComponent(m));
            h(m);
          };
          var l = () => {
            try {
              d("^pageload^");
            } catch (m) {
              setTimeout(l, 50);
            }
          };
          l();
        }
      };
      "undefined" != typeof document && ne();
    }

    return BlinkIDWasmSDK.ready;
  };
})();
if (typeof exports === "object" && typeof module === "object")
  module.exports = BlinkIDWasmSDK;
else if (typeof define === "function" && define["amd"])
  define([], function () {
    return BlinkIDWasmSDK;
  });
else if (typeof exports === "object")
  exports["BlinkIDWasmSDK"] = BlinkIDWasmSDK;
