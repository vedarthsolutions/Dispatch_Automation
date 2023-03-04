(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[Object.keys(cb)[0]])((mod = {exports: {}}).exports, mod), mod.exports;
  };
  var __reExport = (target, module, desc) => {
    if (module && typeof module === "object" || typeof module === "function") {
      for (let key of __getOwnPropNames(module))
        if (!__hasOwnProp.call(target, key) && key !== "default")
          __defProp(target, key, {get: () => module[key], enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable});
    }
    return target;
  };
  var __toModule = (module) => {
    return __reExport(__markAsModule(__defProp(module != null ? __create(__getProtoOf(module)) : {}, "default", module && module.__esModule && "default" in module ? {get: () => module.default, enumerable: true} : {value: module, enumerable: true})), module);
  };

  // node_modules/dynamsoft-code-parser/dist/dcp.js
  var require_dcp = __commonJS({
    "node_modules/dynamsoft-code-parser/dist/dcp.js"(exports, module) {
      !function(e2, t2) {
        typeof exports == "object" && typeof module != "undefined" ? t2(exports) : typeof define == "function" && define.amd ? define(["exports"], t2) : t2(((e2 = typeof globalThis != "undefined" ? globalThis : e2 || self).Dynamsoft = e2.Dynamsoft || {}, e2.Dynamsoft.DCP = {}));
      }(exports, function(e2) {
        "use strict";
        const t2 = typeof self == "undefined", r2 = " is not allowed to change after `createInstance` or `loadWasm` is called.", s3 = !t2 && document.currentScript && (document.currentScript.getAttribute("data-license") || document.currentScript.getAttribute("data-productKeys") || document.currentScript.getAttribute("data-licenseKey") || document.currentScript.getAttribute("data-handshakeCode") || document.currentScript.getAttribute("data-organizationID")) || "", n2 = !t2 && document.currentScript && document.currentScript.getAttribute("data-sessionPassword") || "", i3 = (e3) => {
          if (e3 == null)
            e3 = [];
          else {
            e3 = e3 instanceof Array ? [...e3] : [e3];
            for (let r3 = 0; r3 < e3.length; ++r3) {
              if (!t2) {
                let t3 = document.createElement("a");
                t3.href = e3[r3], e3[r3] = t3.href;
              }
              e3[r3].endsWith("/") || (e3[r3] += "/");
            }
          }
          return e3;
        }, a2 = (() => {
          if (!t2 && document.currentScript) {
            let e3 = document.currentScript.src, t3 = e3.indexOf("?");
            if (t3 != -1)
              e3 = e3.substring(0, t3);
            else {
              let t4 = e3.indexOf("#");
              t4 != -1 && (e3 = e3.substring(0, t4));
            }
            return e3.substring(0, e3.lastIndexOf("/") + 1);
          }
          return "./";
        })();
        let o3, c2, l2, d2, _2;
        if (typeof navigator != "undefined" && (o3 = navigator, c2 = o3.userAgent, l2 = o3.platform, d2 = o3.mediaDevices), !t2) {
          const e3 = {init: function() {
            this.browser = this.searchString(this.dataBrowser) || "unknownBrowser", this.version = this.searchVersion(c2) || this.searchVersion(o3.appVersion) || 0, this.OS = this.searchString(this.dataOS) || "unknownOS", this.OS == "Linux" && c2.indexOf("Windows NT") != -1 && (this.OS = "HarmonyOS");
          }, searchString: function(e4) {
            for (let t3 = 0; t3 < e4.length; t3++) {
              let r3 = e4[t3].string, s4 = e4[t3].prop;
              if (this.versionSearchString = e4[t3].versionSearch || e4[t3].identity, r3) {
                if (r3.indexOf(e4[t3].subString) != -1)
                  return e4[t3].identity;
              } else if (s4)
                return e4[t3].identity;
            }
          }, searchVersion: function(e4) {
            let t3 = e4.indexOf(this.versionSearchString);
            if (t3 != -1)
              return parseFloat(e4.substring(t3 + this.versionSearchString.length + 1));
          }, dataBrowser: [{string: c2, subString: "Edge", identity: "Edge"}, {string: c2, subString: "OPR", identity: "OPR"}, {string: c2, subString: "Chrome", identity: "Chrome"}, {string: o3.vendor, subString: "Apple", identity: "Safari", versionSearch: "Version"}, {string: c2, subString: "Firefox", identity: "Firefox"}, {string: c2, subString: "MSIE", identity: "Explorer", versionSearch: "MSIE"}], dataOS: [{string: c2, subString: "HarmonyOS", identity: "HarmonyOS"}, {string: c2, subString: "Android", identity: "Android"}, {string: c2, subString: "iPhone", identity: "iPhone"}, {string: l2, subString: "Win", identity: "Windows"}, {string: l2, subString: "Mac", identity: "Mac"}, {string: l2, subString: "Linux", identity: "Linux"}]};
          e3.init(), _2 = {browser: e3.browser, version: e3.version, OS: e3.OS};
        }
        t2 && (_2 = {browser: "ssr", version: 0, OS: "ssr"});
        const u2 = typeof WebAssembly != "undefined" && c2 && !(/Safari/.test(c2) && !/Chrome/.test(c2) && /\(.+\s11_2_([2-6]).*\)/.test(c2)), h2 = !(typeof Worker == "undefined"), f2 = !(!d2 || !d2.getUserMedia), g2 = async () => {
          let e3 = false;
          if (f2)
            try {
              (await d2.getUserMedia({video: true})).getTracks().forEach((e4) => {
                e4.stop();
              }), e3 = true;
            } catch (e4) {
            }
          return e3;
        };
        _2.browser === "Chrome" && _2.version > 66 || _2.browser === "Safari" && _2.version > 13 || _2.browser === "OPR" && _2.version > 43 || _2.browser === "Edge" && _2.version;
        const p2 = (e3) => e3 && typeof e3 == "object" && typeof e3.then == "function";
        var E2, C2, y2;
        e2.EnumErrorCode = void 0, (E2 = e2.EnumErrorCode || (e2.EnumErrorCode = {}))[E2.DCP_OK = 0] = "DCP_OK", E2[E2.DCP_NULL_POINTER = -10002] = "DCP_NULL_POINTER", E2[E2.DCP_LICENSE_INVALID = -10003] = "DCP_LICENSE_INVALID", E2[E2.DCP_LICENSE_EXPIRED = -10004] = "DCP_LICENSE_EXPIRED", E2[E2.DCP_INVALID_DATA = -90003] = "DCP_INVALID_DATA", E2[E2.DCP_INVALID_KEY = -90004] = "DCP_INVALID_KEY", E2[E2.DCP_NOT_VALID_VDS_TYPE = -90005] = "DCP_NOT_VALID_VDS_TYPE", E2[E2.DCP_VDS_CHECK_FAILED = -90006] = "DCP_VDS_CHECK_FAILED", E2[E2.DCP_VDS_INVALID_CER = -90007] = "DCP_VDS_INVALID_CER", E2[E2.DCP_VDS_INVALID_SIGNATURE = -90008] = "DCP_VDS_INVALID_SIGNATURE", E2[E2.DCP_VDS_CANNOT_OPEN_CERTIFICATE = -90009] = "DCP_VDS_CANNOT_OPEN_CERTIFICATE", E2[E2.DCP_LICENSE_DOMAIN_NOT_MATCH = -10043] = "DCP_LICENSE_DOMAIN_NOT_MATCH", E2[E2.DCP_AADHAAR_CHECK_FAILED = -90011] = "DCP_AADHAAR_CHECK_FAILED", E2[E2.DCP_NOT_SUPPORTED_YET = -10006] = "DCP_NOT_SUPPORTED_YET", E2[E2.DCP_NO_LICENSE = -2e4] = "DCP_NO_LICENSE", E2[E2.DCP_LICENSE_SYNC_FAILED = -20003] = "DCP_LICENSE_SYNC_FAILED", E2[E2.DCP_TRIAL_LICENSE = -20010] = "DCP_TRIAL_LICENSE", E2[E2.DCP_FAILED_TO_REACH_DLS = -20200] = "DCP_FAILED_TO_REACH_DLS", e2.EnumCodeFormat = void 0, (C2 = e2.EnumCodeFormat || (e2.EnumCodeFormat = {}))[C2.CF_AUTO = 0] = "CF_AUTO", C2[C2.CF_DL_SOUTH_AFRICA = 1] = "CF_DL_SOUTH_AFRICA", C2[C2.CF_DL_AAMVA = 2] = "CF_DL_AAMVA", C2[C2.CF_ID_SOUTH_AFRICA = 3] = "CF_ID_SOUTH_AFRICA", C2[C2.CF_VIN = 4] = "CF_VIN", C2[C2.CF_VDS_NC = 5] = "CF_VDS_NC", C2[C2.CF_AADHAAR = 6] = "CF_AADHAAR";
        class m2 {
          constructor() {
            this._instanceID = void 0, this._lastInnerParseDuration = 0, this.bDestroyed = false;
          }
          static getVersion() {
            return this._version;
          }
          static get license() {
            return this._license;
          }
          static set license(e3) {
            ((e4, t3) => {
              const s4 = e4;
              if (!s4._pLoad.isEmpty)
                throw new Error("`license`" + r2);
              s4._license = t3;
            })(m2, e3);
          }
          static set sessionPassword(e3) {
            ((e4, t3) => {
              const s4 = e4;
              if (!s4._pLoad.isEmpty)
                throw new Error("`sessionPassword`" + r2);
              s4._sessionPassword = t3;
            })(m2, e3);
          }
          static get sessionPassword() {
            return this._sessionPassword;
          }
          static async detectEnvironment() {
            return await (async () => ({wasm: u2, worker: h2, getUserMedia: f2, camera: await g2(), browser: _2.browser, version: _2.version, OS: _2.OS}))();
          }
          static get _bUseFullFeature() {
            return this.__bUseFullFeature;
          }
          static set _bUseFullFeature(e3) {
            if (!this._pLoad.isEmpty)
              throw new Error("`_bUseFullFeature` is not allowed to change after `createInstance` or `loadWasm` is called.");
            m2.__bUseFullFeature = e3;
          }
          static get deviceFriendlyName() {
            return this._deviceFriendlyName;
          }
          static set deviceFriendlyName(e3) {
            ((e4, t3) => {
              const s4 = e4;
              if (!s4._pLoad.isEmpty)
                throw new Error("`deviceFriendlyName`" + r2);
              s4._deviceFriendlyName = t3 || "";
            })(m2, e3);
          }
          static get engineResourcePath() {
            return this._engineResourcePath;
          }
          static set engineResourcePath(e3) {
            if (!this._pLoad.isEmpty)
              throw new Error("`engineResourcePath` is not allowed to change after `createInstance` or `loadWasm` is called.");
            m2._engineResourcePath = ((e4) => {
              if (e4 == null && (e4 = "./"), !t2) {
                let t3 = document.createElement("a");
                t3.href = e4, e4 = t3.href;
              }
              return e4.endsWith("/") || (e4 += "/"), e4;
            })(e3);
          }
          static get licenseServer() {
            return this._licenseServer;
          }
          static set licenseServer(e3) {
            ((e4, t3) => {
              const s4 = e4;
              if (!s4._pLoad.isEmpty)
                throw new Error("`licenseServer`" + r2);
              s4._licenseServer = i3(t3);
            })(m2, e3);
          }
          static async loadWasm() {
            if (this._pLoad.isEmpty) {
              let {lt: e3, l: t3, ls: s4, sp: n3, rmk: a3} = ((e4) => {
                const t4 = e4;
                if (t4._pLoad.isEmpty) {
                  let e5, r3, s5 = t4._license || "", n4 = JSON.parse(JSON.stringify(t4._licenseServer)), a4 = t4._sessionPassword, o4 = 0;
                  if (s5.startsWith("t") || s5.startsWith("f"))
                    o4 = 0;
                  else if (s5.length === 0 || s5.startsWith("P") || s5.startsWith("L") || s5.startsWith("Y") || s5.startsWith("A"))
                    o4 = 1;
                  else {
                    o4 = 2;
                    const t5 = s5.indexOf(":");
                    if (t5 != -1 && (s5 = s5.substring(t5 + 1)), s5.startsWith("DLS2")) {
                      let t6 = s5.substring(4);
                      try {
                        t6 = atob(t6);
                      } catch (e6) {
                        throw new Error("Format Error: The license string you specified is invalid, please check to make sure it is correct.");
                      }
                      const r4 = JSON.parse(t6);
                      if (s5 = r4.handshakeCode ? r4.handshakeCode : r4.organizationID ? r4.organizationID : "", typeof s5 == "number" && (s5 = JSON.stringify(s5)), n4.length === 0) {
                        let e6 = [];
                        r4.mainServerURL && (e6[0] = r4.mainServerURL), r4.standbyServerURL && (e6[1] = r4.standbyServerURL), n4 = i3(e6);
                      }
                      !a4 && r4.sessionPassword && (a4 = r4.sessionPassword), e5 = r4.remark;
                    }
                    (s5 === "200001" || s5.startsWith("200001-")) && (n4 && n4.length || (s5 = "")), s5 || (o4 = 1);
                  }
                  if (o4 && (globalThis.crypto || (r3 = "Please upgrade your browser to support online key."), globalThis.crypto.subtle || (r3 = "Require https to use online key in this browser.")), r3) {
                    if (o4 !== 1)
                      throw new Error(r3);
                    o4 = 0, console.warn(r3), t4._lastErrorCode = -1, t4._lastErrorString = r3;
                  }
                  return o4 === 1 && (s5 = "", console.warn("Applying for a public trial license ...")), {lt: o4, l: s5, ls: n4, sp: a4, rmk: e5};
                }
                throw new Error("Can't preprocess license again" + r2);
              })(m2);
              this._pLoad.task = async (r3, i4) => {
                let o4 = m2.engineResourcePath + m2._workerName;
                m2.engineResourcePath.startsWith(location.origin) || (o4 = await fetch(o4).then((e4) => e4.blob()).then((e4) => URL.createObjectURL(e4))), m2._dcpWorker = new Worker(o4), m2._dcpWorker.onerror = (e4) => {
                  let t4 = new Error(e4.message);
                  i4(t4);
                }, m2._dcpWorker.onmessage = async (t4) => {
                  let s5 = t4.data ? t4.data : t4;
                  switch (s5.type) {
                    case "log":
                      m2._onLog && m2._onLog(s5.message);
                      break;
                    case "load": {
                      s5.message && (s5.message = s5.message.replace("(https://www.dynamsoft.com/purchase-center/)", "(https://www.dynamsoft.com/store/dynamsoft-code-parser/#javascript)"));
                      let t5, n4 = false;
                      e3 === 1 && (n4 = true), s5.success ? (m2._dcpWorker.onerror = null, m2._version = s5.version + "(JS " + m2._jsVersion + "." + m2._jsEditVersion + ")", m2._onLog && m2._onLog("load dcp worker success"), s5.message && console.warn(s5.message)) : (t5 = new Error(s5.message), t5.stack = s5.stack + "\n" + t5.stack, n4 || s5.ltsErrorCode == 111 && s5.message.toLowerCase().indexOf("trial license") != -1 && (n4 = true)), n4 && m2.showDialog(s5.success ? "warn" : "error", s5.message), s5.success ? r3() : i4(t5);
                      break;
                    }
                    case "task": {
                      let e4 = s5.id, t5 = s5.body;
                      try {
                        m2._taskCallbackMap.get(e4)(t5), m2._taskCallbackMap.delete(e4);
                      } catch (t6) {
                        throw m2._taskCallbackMap.delete(e4), t6;
                      }
                      break;
                    }
                    default:
                      m2._onLog && m2._onLog(t4);
                  }
                }, m2._dcpWorker.postMessage({type: "loadWasm", engineResourcePath: m2.engineResourcePath, bUseFullFeature: m2._bUseFullFeature, bd: m2._bWasmDebug, v: m2._jsVersion, brtk: !!e3, bptk: e3 === 1, l: t3, dm: location.origin.startsWith("http") ? location.origin : "https://localhost", os: _2, fn: m2.deviceFriendlyName, ls: s4, sp: n3, rmk: a3});
              };
            }
            await this._pLoad;
          }
          static async showDialog(e3, t3) {
            await (async (e4, t4, r3) => {
              if (!e4._bNeverShowDialog)
                try {
                  let s4 = await fetch(e4.engineResourcePath + "dls.license.dialog.html");
                  if (!s4.ok)
                    throw Error("Get license dialog fail. Network Error: " + s4.statusText);
                  let n3 = await s4.text();
                  if (!n3.trim().startsWith("<"))
                    throw Error("Get license dialog fail. Can't get valid HTMLElement.");
                  let i4 = document.createElement("div");
                  i4.innerHTML = n3;
                  let a3 = [];
                  for (let e5 = 0; e5 < i4.childElementCount; ++e5) {
                    let t5 = i4.children[e5];
                    t5 instanceof HTMLStyleElement && (a3.push(t5), document.head.append(t5));
                  }
                  let o4 = i4.childElementCount == 1 ? i4.children[0] : i4;
                  o4.remove();
                  let c3, l3, d3, _3, u3, h3 = [o4], f3 = o4.children;
                  for (let e5 of f3)
                    h3.push(e5);
                  for (let e5 = 0; e5 < h3.length; ++e5)
                    for (let t5 of h3[e5].children)
                      h3.push(t5);
                  for (let e5 of h3)
                    if (!c3 && e5.classList.contains("dls-license-mask"))
                      c3 = e5, e5.addEventListener("click", (t5) => {
                        if (e5 == t5.target) {
                          o4.remove();
                          for (let e6 of a3)
                            e6.remove();
                        }
                      });
                    else if (!l3 && e5.classList.contains("dls-license-icon-close"))
                      l3 = e5, e5.addEventListener("click", () => {
                        o4.remove();
                        for (let e6 of a3)
                          e6.remove();
                      });
                    else if (!d3 && e5.classList.contains("dls-license-icon-error"))
                      d3 = e5, t4 != "error" && e5.remove();
                    else if (!_3 && e5.classList.contains("dls-license-icon-warn"))
                      _3 = e5, t4 != "warn" && e5.remove();
                    else if (!u3 && e5.classList.contains("dls-license-msg-content")) {
                      u3 = e5;
                      let t5 = r3;
                      for (; t5; ) {
                        let r4 = t5.indexOf("["), s5 = t5.indexOf("]", r4), n4 = t5.indexOf("(", s5), i5 = t5.indexOf(")", n4);
                        if (r4 == -1 || s5 == -1 || n4 == -1 || i5 == -1) {
                          e5.appendChild(new Text(t5));
                          break;
                        }
                        r4 > 0 && e5.appendChild(new Text(t5.substring(0, r4)));
                        let a4 = document.createElement("a"), o5 = t5.substring(r4 + 1, s5);
                        a4.innerText = o5;
                        let c4 = t5.substring(n4 + 1, i5);
                        a4.setAttribute("href", c4), a4.setAttribute("target", "_blank"), e5.appendChild(a4), t5 = t5.substring(i5 + 1);
                      }
                    }
                  document.body.appendChild(o4);
                } catch (t5) {
                  e4._onLog && e4._onLog(t5.message || t5);
                }
            })(this, e3, t3);
          }
          static async createInstanceInWorker() {
            return await m2.loadWasm(), await new Promise((e3, t3) => {
              let r3 = m2._nextTaskID++;
              m2._taskCallbackMap.set(r3, (r4) => {
                if (r4.success)
                  return e3(r4.instanceID);
                {
                  let e4 = new Error(r4.message);
                  return e4.stack = r4.stack + "\n" + e4.stack, t3(e4);
                }
              }), m2._dcpWorker.postMessage({type: "createInstance", id: r3});
            });
          }
          static async createInstance() {
            let e3 = new m2();
            return e3._instanceID = await m2.createInstanceInWorker(), e3;
          }
          async setCryptoPublicKey(e3) {
            if (this.bDestroyed)
              throw new Error('"CodeParser" instance has destroyed');
            if (!e3 || typeof e3 != "string")
              throw new Error("The public key must be rolled into a value of type string");
            return await new Promise((t3, r3) => {
              let s4 = m2._nextTaskID++;
              m2._taskCallbackMap.set(s4, (e4) => {
                if (e4.success)
                  return t3();
                {
                  let t4 = new Error(e4.message);
                  return t4.stack = e4.stack + "\n" + t4.stack, r3(t4);
                }
              }), m2._dcpWorker.postMessage({type: "setCryptoPublicKey", id: s4, instanceID: this._instanceID, key: e3});
            });
          }
          async setCertificate(e3) {
            if (this.bDestroyed)
              throw new Error('"CodeParser" instance has destroyed');
            if (!(e3 && (e3 instanceof Uint8Array || e3 instanceof ArrayBuffer || typeof e3 == "string")))
              throw new Error("`setCertificate` must pass in a Uint8Array, ArrayBuffer type value");
            let t3;
            if (typeof e3 == "string") {
              let r3 = await new Promise((t4, r4) => {
                let s5 = new XMLHttpRequest();
                s5.open("GET", e3, true), s5.responseType = "blob", s5.send(), s5.onloadend = async () => {
                  t4(s5.response);
                }, s5.onerror = () => {
                  r4(new Error("Network Error: " + s5.statusText));
                };
              }), s4 = new FileReader();
              await new Promise((e4, t4) => {
                s4.onload = e4, s4.readAsArrayBuffer(r3);
              }), t3 = new Uint8Array(s4.result);
            }
            return await new Promise((r3, s4) => {
              let n3 = m2._nextTaskID++;
              e3 instanceof ArrayBuffer && (e3 = new Uint8Array(e3));
              let i4 = typeof e3 == "string" ? t3 : e3;
              m2._taskCallbackMap.set(n3, (e4) => {
                if (e4.success)
                  return r3();
                {
                  let t4 = new Error(e4.message);
                  return t4.stack = e4.stack + "\n" + t4.stack, s4(t4);
                }
              }), m2._dcpWorker.postMessage({type: "setCertificate", id: n3, instanceID: this._instanceID, cer: i4});
            });
          }
          async setCodeFormat(t3) {
            if (this.bDestroyed)
              throw new Error('"CodeParser" instance has destroyed');
            if (t3 === void 0 || !e2.EnumCodeFormat.hasOwnProperty(t3))
              throw new Error("`setCodeFormat` must pass in a value of type EnumCodeFormat");
            return await new Promise((e3, r3) => {
              let s4 = m2._nextTaskID++;
              m2._taskCallbackMap.set(s4, (t4) => {
                if (t4.success)
                  return e3();
                {
                  let e4 = new Error(t4.message);
                  return e4.stack = t4.stack + "\n" + e4.stack, r3(e4);
                }
              }), m2._dcpWorker.postMessage({type: "setCodeFormat", id: s4, instanceID: this._instanceID, format: t3});
            });
          }
          async parseData(e3) {
            if (this.bDestroyed)
              throw new Error('"CodeParser" instance has destroyed');
            if (!(e3 && (e3 instanceof Array || e3 instanceof Uint8Array || typeof e3 == "string")))
              throw new Error("`parseData` must pass in an Array or Uint8Array or string");
            return await new Promise((t3, r3) => {
              let s4 = m2._nextTaskID++;
              e3 instanceof Array && (e3 = Uint8Array.from(e3)), typeof e3 == "string" && (e3 = Uint8Array.from(this._stringToUint8Array(e3))), m2._taskCallbackMap.set(s4, async (e4) => {
                if (e4.success) {
                  let r4 = JSON.parse(e4.parseReturn);
                  return this._setDescription(r4), t3(r4.result ? r4.result : r4);
                }
                {
                  let t4 = new Error(e4.message);
                  return t4.stack = e4.stack + "\n" + t4.stack, r3(t4);
                }
              }), m2._dcpWorker.postMessage({type: "parseData", id: s4, instanceID: this._instanceID, source: e3});
            });
          }
          _stringToUint8Array(e3) {
            let t3 = [];
            for (let r3 = 0; r3 < e3.length; ++r3)
              t3.push(e3.charCodeAt(r3));
            return t3;
          }
          _setDescription(t3) {
            if (t3.description === "Unknown error.") {
              for (const r3 in e2.EnumErrorCode)
                if (e2.EnumErrorCode[r3] === t3.exception) {
                  t3.description = r3;
                  break;
                }
            }
          }
          destroyContext() {
            if (m2._onLog && m2._onLog("destroyContext()"), this.bDestroyed)
              return;
            this.bDestroyed = true;
            let e3 = m2._nextTaskID++;
            m2._taskCallbackMap.set(e3, (e4) => {
              if (!e4.success) {
                let t3 = new Error(e4.message);
                throw t3.stack = e4.stack + "\n" + t3.stack, t3;
              }
            }), m2._dcpWorker.postMessage({type: "destroyContext", id: e3, instanceID: this._instanceID});
          }
        }
        m2._jsVersion = "1.1.0", m2._jsEditVersion = "20220708", m2._version = `loading...(JS ${m2._jsVersion}.${m2._jsEditVersion})`, m2._license = s3, m2._workerName = `dcp-${m2._jsVersion}.browser.worker.js`, m2._bWasmDebug = false, m2._pLoad = new class extends Promise {
          constructor(e3) {
            let t3, r3;
            super((e4, s4) => {
              t3 = e4, r3 = s4;
            }), this._s = "pending", this.resolve = (e4) => {
              this.isPending && (p2(e4) ? this.task = e4 : (this._s = "fulfilled", t3(e4)));
            }, this.reject = (e4) => {
              this.isPending && (this._s = "rejected", r3(e4));
            }, this.task = e3;
          }
          get status() {
            return this._s;
          }
          get isPending() {
            return this._s === "pending";
          }
          get isFulfilled() {
            return this._s === "fulfilled";
          }
          get isRejected() {
            return this._s === "rejected";
          }
          get task() {
            return this._task;
          }
          set task(e3) {
            let t3;
            this._task = e3, p2(e3) ? t3 = e3 : typeof e3 == "function" && (t3 = new Promise(e3)), t3 && (async () => {
              try {
                const r3 = await t3;
                e3 === this._task && this.resolve(r3);
              } catch (t4) {
                e3 === this._task && this.reject(t4);
              }
            })();
          }
          get isEmpty() {
            return this._task == null;
          }
        }(), m2._bNeverShowDialog = false, m2._sessionPassword = n2, m2.browserInfo = _2, m2.__bUseFullFeature = false, m2._deviceFriendlyName = "", m2._taskCallbackMap = new Map(), m2._nextTaskID = 0, m2._engineResourcePath = a2, m2._licenseServer = [], e2.EnumResultInfoType = void 0, (y2 = e2.EnumResultInfoType || (e2.EnumResultInfoType = {}))[y2.RIT_DRIVER_LICENSE_AAMVA = 0] = "RIT_DRIVER_LICENSE_AAMVA", y2[y2.RIT_PERSONAL_ID = 1] = "RIT_PERSONAL_ID", y2[y2.RIT_VDSNC = 2] = "RIT_VDSNC", y2[y2.RIT_AADHAAR = 3] = "RIT_AADHAAR", y2[y2.RIT_DRIVER_LICENSE_SOUTH_AFRICA = 4] = "RIT_DRIVER_LICENSE_SOUTH_AFRICA", e2.CodeParser = m2, Object.defineProperty(e2, "__esModule", {value: true});
      });
    }
  });

  // ../e_dispatch/e_dispatch/public/js/scan_qrcode.js
  frappe.provide("frappe.customscan_qrcode");

  // ../../node_modules/dynamsoft-camera-enhancer/dist/dce.pure.mjs
  function e(e2, t2, i3, s3) {
    return new (i3 || (i3 = Promise))(function(o3, n2) {
      function r2(e3) {
        try {
          h2(s3.next(e3));
        } catch (e4) {
          n2(e4);
        }
      }
      function a2(e3) {
        try {
          h2(s3.throw(e3));
        } catch (e4) {
          n2(e4);
        }
      }
      function h2(e3) {
        var t3;
        e3.done ? o3(e3.value) : (t3 = e3.value, t3 instanceof i3 ? t3 : new i3(function(e4) {
          e4(t3);
        })).then(r2, a2);
      }
      h2((s3 = s3.apply(e2, t2 || [])).next());
    });
  }
  var t = !!(typeof global == "object" && global.process && global.process.release && global.process.release.name && typeof HTMLCanvasElement == "undefined");
  var i = !t && typeof self == "undefined";
  var s = class {
    constructor() {
      this._canvasMaxWH = s.browserInfo.OS == "iPhone" || s.browserInfo.OS == "Android" ? 2048 : 4096, this._singleFrameMode = !(navigator && navigator.mediaDevices && navigator.mediaDevices.getUserMedia), this._singleFrameModeIpt = () => {
        let t2 = document.createElement("input");
        return t2.setAttribute("type", "file"), t2.setAttribute("accept", "image/*"), t2.setAttribute("capture", ""), t2.addEventListener("change", () => e(this, void 0, void 0, function* () {
          let e2 = t2.files[0];
          t2.value = "", this.onSingleFrameAcquired(e2);
        })), t2;
      }, this._clickIptSingleFrameMode = () => {
        this._singleFrameModeIpt().click();
      }, this.styleEls = [], this.bSaveOriCanvas = true, this.maxVideoCvsLength = 3, this.videoCvses = [], this.videoGlCvs = null, this.videoGl = null, this.glImgData = null, this._onCameraSelChange = () => {
        this.play(this._selCam.value).then(() => {
          this._isOpen || this.stop();
        });
      }, this._onResolutionSelChange = () => {
        let e2, t2;
        if (this._selRsl && this._selRsl.selectedIndex != -1) {
          let i3 = this._selRsl.options[this._selRsl.selectedIndex];
          e2 = i3.getAttribute("data-width"), t2 = i3.getAttribute("data-height");
        }
        this.play(void 0, e2, t2).then(() => {
          this._isOpen || this.stop();
        });
      }, this._onCloseBtnClick = () => {
        this.close();
      }, this._isOpen = false, this.videoSettings = {video: {width: {ideal: 1280}, height: {ideal: 720}, facingMode: {ideal: "environment"}}}, this.iPlayRound = 0, this.promisePlay = null, this._allCameras = [], this._currentCamera = null, this._videoTrack = null, this._lastDeviceId = void 0, this._vc_bPlayingVideoBeforeHide = false, this._ev_documentHideEvent = () => {
        document.visibilityState === "visible" ? this._vc_bPlayingVideoBeforeHide && (s.browserInfo.browser == "Firefox" ? this.play() : this._video.play(), this._vc_bPlayingVideoBeforeHide = false) : this._video && !this._video.paused && (this._vc_bPlayingVideoBeforeHide = true, this._video.pause());
      }, this._video = null, this._bgLoading = null, this._selCam = null, this._bgCamera = null, this._selRsl = null, this._optGotRsl = null, this._btnClose = null, this._region = null, this.bChangeRegionIndexManually = false, this._regionIndex = -1, this._loopInterval = 0, this._frameQueueMaxLength = 1, this._frameQueue = [], this._bFetchingLoopStarted = false, this._bStoppedByPause = false, this.alwaysRefreshBuffer = true, this._bufferRefreshInterval = 0, this.bDestroyed = false;
    }
    static getVersion() {
      return this._version;
    }
    static detectEnvironment() {
      return e(this, void 0, void 0, function* () {
        let e2 = {wasm: typeof WebAssembly != "undefined" && (typeof navigator == "undefined" || !(/Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent) && /\(.+\s11_2_([2-6]).*\)/.test(navigator.userAgent))), worker: !!(t ? process.version >= "v12" : typeof Worker != "undefined"), getUserMedia: !(typeof navigator == "undefined" || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia), camera: false, browser: this.browserInfo.browser, version: this.browserInfo.version, OS: this.browserInfo.OS};
        if (e2.getUserMedia)
          try {
            (yield navigator.mediaDevices.getUserMedia({video: true})).getTracks().forEach((e3) => {
              e3.stop();
            }), e2.camera = true;
          } catch (e3) {
          }
        return e2;
      });
    }
    static get engineResourcePath() {
      return this._engineResourcePath;
    }
    static set engineResourcePath(e2) {
      if (this._hasEngineResourceLoaded)
        throw new Error("`engineResourcePath` is not allowed to change after `createInstance` is called.");
      if (e2 == null && (e2 = "./"), t || i)
        s._engineResourcePath = e2;
      else {
        let t2 = document.createElement("a");
        t2.href = e2, s._engineResourcePath = t2.href;
      }
      this._engineResourcePath.endsWith("/") || (s._engineResourcePath += "/");
    }
    static get defaultUIElementURL() {
      var e2;
      return (e2 = this._defaultUIElementURL) === null || e2 === void 0 ? void 0 : e2.replace("@engineResourcePath/", s.engineResourcePath);
    }
    static set defaultUIElementURL(e2) {
      this._defaultUIElementURL = e2;
    }
    getUIElement() {
      return this.UIElement;
    }
    setUIElement(t2) {
      return e(this, void 0, void 0, function* () {
        if (typeof t2 == "string" || t2 instanceof String) {
          if (!t2.trim().startsWith("<")) {
            let e3 = yield fetch(t2);
            if (!e3.ok)
              throw Error("setUIElement(elementOrUrl): Network Error: " + e3.statusText);
            t2 = yield e3.text();
          }
          if (!t2.trim().startsWith("<"))
            throw Error("setUIElement(elementOrUrl): Can't get valid HTMLElement.");
          let e2 = document.createElement("div");
          e2.innerHTML = t2;
          for (let t3 = 0; t3 < e2.childElementCount; ++t3) {
            let i3 = e2.children[t3];
            i3 instanceof HTMLStyleElement && (this.styleEls.push(i3), document.head.append(i3));
          }
          (t2 = e2.childElementCount == 1 ? e2.children[0] : e2).remove();
        }
        this.UIElement = t2;
      });
    }
    get singleFrameMode() {
      return this._singleFrameMode;
    }
    set singleFrameMode(e2) {
      if (this._isOpen)
        throw new Error("`singleFrameMode` is not allowed to change when camera is open.");
      this._singleFrameMode = e2;
    }
    get ifSaveOriginalImageInACanvas() {
      return this.bSaveOriCanvas;
    }
    set ifSaveOriginalImageInACanvas(e2) {
      this.bSaveOriCanvas = e2;
    }
    _bindUI() {
      if (!this.UIElement)
        throw new Error("Need to define `UIElement` before opening.");
      let e2 = [this.UIElement], t2 = this.UIElement.children;
      for (let i4 of t2)
        e2.push(i4);
      for (let t3 = 0; t3 < e2.length; ++t3)
        for (let i4 of e2[t3].children)
          e2.push(i4);
      let i3 = null;
      for (let t3 of e2)
        !this._video && t3.classList.contains("dce-video") ? (this._video = t3, this._video.setAttribute("playsinline", "true")) : !this._bgLoading && t3.classList.contains("dce-bg-loading") ? this._bgLoading = t3 : !this._bgCamera && t3.classList.contains("dce-bg-camera") ? this._bgCamera = t3 : !this._selCam && t3.classList.contains("dce-sel-camera") ? this._selCam = t3 : !this._selRsl && t3.classList.contains("dce-sel-resolution") ? (this._selRsl = t3, this._selRsl.options.length || (this._selRsl.innerHTML = [this._optGotRsl ? "" : '<option class="dce-opt-gotResolution" value="got"></option>', '<option data-width="1920" data-height="1080">ask 1920 x 1080</option>', '<option data-width="1280" data-height="720">ask 1280 x 720</option>', '<option data-width="640" data-height="480">ask 640 x 480</option>'].join(""), this._optGotRsl = this._optGotRsl || this._selRsl.options[0])) : !this._optGotRsl && t3.classList.contains("dce-opt-gotResolution") ? this._optGotRsl = t3 : !this._btnClose && t3.classList.contains("dce-btn-close") ? this._btnClose = t3 : !this._video && t3.classList.contains("dce-existingVideo") ? (this._video = t3, this._video.setAttribute("playsinline", "true")) : !i3 && t3.tagName && t3.tagName.toLowerCase() == "video" && (i3 = t3);
      if (!this._video && i3 && (this._video = i3), this.singleFrameMode ? this._video && (this._video.addEventListener("click", this._clickIptSingleFrameMode), this._video.style.cursor = "pointer", this._video.setAttribute("title", "Take a photo")) : this._bgLoading && (this._bgLoading.style.display = ""), this.singleFrameMode ? (this._video && (this._video.addEventListener("click", this._clickIptSingleFrameMode), this._video.style.cursor = "pointer", this._video.setAttribute("title", "Take a photo")), this._bgCamera && (this._bgCamera.style.display = "")) : this._bgLoading && (this._bgLoading.style.display = ""), this._selCam && this._selCam.addEventListener("change", this._onCameraSelChange), this._selRsl && this._selRsl.addEventListener("change", this._onResolutionSelChange), this._btnClose && this._btnClose.addEventListener("click", this._onCloseBtnClick), !this._video)
        throw this._unbindUI(), Error("Can not find HTMLVideoElement with class `dce-video`");
      this._isOpen = true;
    }
    _unbindUI() {
      this.singleFrameMode ? (this._video && (this._video.removeEventListener("click", this._clickIptSingleFrameMode), this._video.style.cursor = "", this._video.removeAttribute("title")), this._bgCamera && (this._bgCamera.style.display = "none")) : this._bgLoading && (this._bgLoading.style.display = "none"), this._selCam && this._selCam.removeEventListener("change", this._onCameraSelChange), this._selRsl && this._selRsl.removeEventListener("change", this._onResolutionSelChange), this._btnClose && this._btnClose.removeEventListener("click", this._onCloseBtnClick), this._video = null, this._selCam = null, this._selRsl = null, this._optGotRsl = null, this._btnClose = null, this._isOpen = false;
    }
    _assertOpen() {
      if (!this._isOpen)
        throw Error("The camera is not open.");
    }
    get video() {
      return this._video;
    }
    set region(e2) {
      this._region = e2, this._bFetchingLoopStarted && (this._regionIndex = -1, this._fetchingLoop(false));
    }
    get region() {
      return this._region;
    }
    set regionIndex(e2) {
      this.bChangeRegionIndexManually && (this._region instanceof Array && this._region.length > e2 ? this._regionIndex = e2 : this._regionIndex = 0);
    }
    get regionIndex() {
      return this._regionIndex;
    }
    set loopInterval(e2) {
      e2 >= 0 && (this._loopInterval = e2), this._bFetchingLoopStarted && this._fetchingLoop(false);
    }
    get loopInterval() {
      return this._loopInterval;
    }
    set frameQueueMaxLength(e2) {
      for (this._frameQueueMaxLength = e2; this._frameQueue && this._frameQueue.length > this._frameQueueMaxLength; )
        this._frameQueue.shift();
    }
    get frameQueueMaxLength() {
      return this._frameQueueMaxLength;
    }
    get frameQueue() {
      return JSON.parse(JSON.stringify(this._frameQueue));
    }
    set bufferRefreshInterval(e2) {
      this._bufferRefreshInterval = e2;
    }
    get bufferRefreshInterval() {
      return this._bufferRefreshInterval;
    }
    isContextDestroyed() {
      return this.bDestroyed;
    }
    static createInstance(i3) {
      return e(this, void 0, void 0, function* () {
        if (t)
          throw new Error("`CameraEnhancer` is not supported in Node.js.");
        let e2 = new s();
        (typeof i3 == "string" || i3 instanceof String) && (i3 = JSON.parse(i3));
        for (let t2 in i3)
          e2[t2] = i3[t2];
        return yield e2.setUIElement(this.defaultUIElementURL), this._hasEngineResourceLoaded = true, document.addEventListener("visibilitychange", e2._ev_documentHideEvent), e2;
      });
    }
    play(t2, i3, o3) {
      return e(this, void 0, void 0, function* () {
        if (this._assertOpen(), this._video && this.videoSrc) {
          yield new Promise((t4, i4) => {
            this._video.onloadedmetadata = () => e(this, void 0, void 0, function* () {
              this._video.onloadedmetadata = null, yield this._video.play(), t4();
            }), typeof this.videoSrc == "string" || this.videoSrc instanceof String ? this._video.src = this.videoSrc : this._video.srcObject = this.videoSrc, setTimeout(() => i4(new Error("Failed to play video. Timeout.")), 4e3);
          });
          let t3 = {width: this._video.videoWidth, height: this._video.videoHeight};
          return this.onPlayed && setTimeout(() => {
            this.onPlayed(t3);
          }, 0), t3;
        }
        if (this.singleFrameMode)
          return this._clickIptSingleFrameMode(), {width: 0, height: 0};
        const n2 = ++this.iPlayRound;
        return this.promisePlay && (yield this.promisePlay, n2 < this.iPlayRound) ? {width: this._video.videoWidth, height: this._video.videoHeight} : (this.promisePlay = (() => e(this, void 0, void 0, function* () {
          var n3;
          try {
            this._video && this._video.srcObject && this.stop(), s._onLog && s._onLog("DCE: ======before video========"), yield this.getAllCameras();
            let r2 = () => {
              if (this.bDestroyed)
                throw l2 && l2.getTracks().forEach((e2) => {
                  e2.stop();
                }), this._video.srcObject = null, this._videoTrack = null, this._currentCamera = null, new Error("The CameraEnhancer instance has been destroyed.");
            };
            const a2 = JSON.parse(JSON.stringify(this.videoSettings));
            let h2;
            typeof a2.video == "boolean" && (a2.video = {}), i3 && (a2.video.width = {ideal: i3}), o3 && (a2.video.height = {ideal: o3});
            const d2 = ["rear", "back", "r\xFCck", "arri\xE8re", "trasera", "tr\xE1s", "traseira", "posteriore", "\u540E\u9762", "\u5F8C\u9762", "\u80CC\u9762", "\u540E\u7F6E", "\u5F8C\u7F6E", "\u80CC\u7F6E", "\u0437\u0430\u0434\u043D\u0435\u0439", "\u0627\u0644\u062E\u0644\u0641\u064A\u0629", "\uD6C4", "arka", "achterzijde", "\u0E2B\u0E25\u0E31\u0E07", "baksidan", "bagside", "sau", "bak", "tylny", "takakamera", "belakang", "\u05D0\u05D7\u05D5\u05E8\u05D9\u05EA", "\u03C0\u03AF\u03C3\u03C9", "spate", "h\xE1ts\xF3", "zadn\xED", "darrere", "zadn\xE1", "\u0437\u0430\u0434\u043D\u044F", "stra\u017Enja", "belakang", "\u092C\u0948\u0915"];
            let l2, g2 = () => {
              for (let e2 of this._allCameras) {
                let t3 = e2.label.toLowerCase();
                if (t3 && d2.some((e3) => t3.indexOf(e3) != -1) && /\b0(\b)?/.test(t3)) {
                  delete a2.video.facingMode, a2.video.deviceId = {ideal: e2.deviceId};
                  break;
                }
              }
              a2.video.deviceId || ["Android", "HarmonyOS"].indexOf(s.browserInfo.OS) == -1 || (delete a2.video.facingMode, a2.video.deviceId = {ideal: this._allCameras[this._allCameras.length - 1].deviceId});
            };
            if (t2)
              delete a2.video.facingMode, a2.video.deviceId = {exact: t2}, this._lastDeviceId = t2;
            else if (a2.video.deviceId)
              ;
            else if (this._lastDeviceId)
              delete a2.video.facingMode, a2.video.deviceId = {exact: this._lastDeviceId};
            else if (a2.video.facingMode) {
              let e2 = a2.video.facingMode;
              e2 instanceof Array && e2.length && (e2 = e2[0]), e2 = e2.exact || e2.ideal || e2, e2 === "environment" && (h2 = !!a2.video.facingMode, g2());
            }
            s._onLog && s._onLog("DCE: ======try getUserMedia========");
            let c2, u2 = [0, 500], _2 = null, v2 = null, m2 = (t3) => e(this, void 0, void 0, function* () {
              for (let e2 of u2) {
                r2(), e2 && (yield new Promise((t4) => setTimeout(t4, e2))), r2();
                {
                  const e3 = t3.video.deviceId;
                  v2 = e3 ? e3.exact || e3.ideal || e3 : null;
                }
                try {
                  s._onLog && s._onLog("DCE: ask " + JSON.stringify(t3)), l2 = yield navigator.mediaDevices.getUserMedia(t3);
                  break;
                } catch (e3) {
                  _2 = e3, s._onLog && s._onLog("DCE: " + e3.message || e3);
                }
              }
            });
            if (yield m2(a2), !l2) {
              if (s._onLog && s._onLog("DCE: ======try getUserMedia again========"), c2 = JSON.parse(JSON.stringify(a2)), typeof c2.video == "object") {
                s.browserInfo.OS == "iPhone" ? (i3 >= 1280 || o3 >= 1280 ? c2.video.width = 1280 : i3 >= 640 || o3 >= 640 ? c2.video.width = 640 : (i3 < 640 || o3 < 640) && (c2.video.width = 320), delete c2.video.height) : h2 && !a2.video.deviceId ? (delete c2.video.facingMode, this._allCameras.length && (c2.video.deviceId = {ideal: this._allCameras[this._allCameras.length - 1].deviceId})) : c2.video = true;
              }
              s._onLog && s._onLog("DCE: " + c2), yield m2(c2);
            }
            if (l2 || (u2 = [1e3, 2e3], yield m2(a2)), l2 || (yield m2(c2)), !l2)
              throw _2;
            const f2 = () => {
              const e2 = l2.getVideoTracks();
              let t3, i4;
              if (e2.length && (t3 = this._videoTrack = e2[0]), this._video && t3) {
                if (t3.label) {
                  for (let e3 of this._allCameras)
                    if (t3.label == e3.label) {
                      e3._checked = true, i4 = e3, this._lastDeviceId = e3.deviceId;
                      break;
                    }
                }
                if (!i4 && v2) {
                  for (let e3 of this._allCameras)
                    if (v2 == e3.deviceId) {
                      t3.label && (e3._checked = true, e3.label = t3.label), i4 = e3, this._lastDeviceId = e3.deviceId;
                      break;
                    }
                }
              }
              this._currentCamera = i4;
            };
            if (yield this.getAllCameras(), r2(), h2) {
              f2(), g2();
              let e2 = a2.video.deviceId;
              e2 && (e2 = e2.exact || e2.ideal || e2);
              let t3 = (n3 = this._currentCamera) === null || n3 === void 0 ? void 0 : n3.deviceId;
              !e2 || t3 && e2 == t3 || (l2.getTracks().forEach((e3) => {
                e3.stop();
              }), u2 = [0, 500, 1e3, 2e3], yield m2(a2));
            }
            r2();
            const p2 = () => e(this, void 0, void 0, function* () {
              s._onLog && s._onLog("======play video========"), yield new Promise((t3, i4) => {
                this._video.onloadedmetadata = () => e(this, void 0, void 0, function* () {
                  this._video.onloadedmetadata = null, yield this._video.play(), t3();
                }), this._video.srcObject = l2, setTimeout(() => i4(new Error("Failed to play video. Timeout.")), 4e3);
              });
            });
            yield p2(), s._onLog && s._onLog("DCE: ======played video========"), this._bgLoading && (this._bgLoading.style.animationPlayState = "paused");
            const b2 = "got " + this._video.videoWidth + "x" + this._video.videoHeight;
            this._optGotRsl && (this._optGotRsl.setAttribute("data-width", this._video.videoWidth), this._optGotRsl.setAttribute("data-height", this._video.videoHeight), this._optGotRsl.innerText = b2, this._selRsl && this._optGotRsl.parentNode == this._selRsl && (this._selRsl.value = "got")), s._onLog && s._onLog("DCE: " + b2), f2(), r2(), this._renderSelCameraInfo();
            let y2 = {width: this._video.videoWidth, height: this._video.videoHeight};
            return this.onPlayed && setTimeout(() => {
              this.onPlayed(y2);
            }, 0), this.promisePlay = null, y2;
          } catch (e2) {
            throw this.promisePlay = null, e2;
          }
        }))(), yield this.promisePlay);
      });
    }
    resume() {
      return e(this, void 0, void 0, function* () {
        yield this.play(), this._bStoppedByPause && (this._bStoppedByPause = false, this.startFetchingLoop());
      });
    }
    pause() {
      this._video && this._video.pause(), this._bFetchingLoopStarted && (this.stopFetchingLoop(), this._bStoppedByPause = true);
    }
    close() {
      return e(this, void 0, void 0, function* () {
        this.stop(), this._unbindUI(), this.UIElement.style.display = "none", this.stopFetchingLoop();
      });
    }
    open() {
      return e(this, void 0, void 0, function* () {
        return this._bindUI(), this.UIElement.parentNode || (this.UIElement.style.position = "fixed", this.UIElement.style.left = "0", this.UIElement.style.top = "0", document.body.append(this.UIElement)), this.UIElement.style.display == "none" && (this.UIElement.style.display = ""), yield this.play();
      });
    }
    stop() {
      this._video && this._video.srcObject && (s._onLog && s._onLog("DCE: ======stop video========"), this._video.srcObject.getTracks().forEach((e2) => {
        e2.stop();
      }), this._video.srcObject = null, this._videoTrack = null, this._currentCamera = null), this._video && this._video.classList.contains("dce-existingVideo") && (s._onLog && s._onLog("DCE: ======stop existing video========"), this._video.pause(), this._video.currentTime = 0), this._bgLoading && (this._bgLoading.style.animationPlayState = ""), this._frameQueue.length = 0;
    }
    getAllCameras() {
      return e(this, void 0, void 0, function* () {
        const e2 = yield navigator.mediaDevices.enumerateDevices(), t2 = [], i3 = [];
        if (this._allCameras)
          for (let e3 of this._allCameras)
            e3._checked && i3.push(e3);
        for (let s3 = 0; s3 < e2.length; s3++) {
          let o3, n2 = e2[s3];
          if (n2.kind == "videoinput") {
            for (let e3 of i3)
              n2.deviceId == e3.deviceId && (o3 = e3);
            o3 || (o3 = {}, o3.deviceId = n2.deviceId, o3.label = n2.label ? n2.label : "camera " + s3), t2.push(o3);
          }
        }
        return this._allCameras = t2, s._onLog && s._onLog("DCE: " + JSON.stringify(this._allCameras)), Promise.resolve(t2);
      });
    }
    _renderSelCameraInfo() {
      if (this._selCam && (this._selCam.innerHTML = ""), this._selCam) {
        let e2;
        for (let t2 of this._allCameras) {
          let i3 = document.createElement("option");
          i3.value = t2.deviceId, i3.innerText = t2.label, this._selCam.append(i3), t2.deviceId && this._currentCamera && this._currentCamera.deviceId == t2.deviceId && (e2 = i3);
        }
        this._selCam.value = e2 ? e2.value : "";
      }
    }
    getSelectedCamera() {
      return e(this, void 0, void 0, function* () {
        return this._currentCamera;
      });
    }
    selectCamera(t2) {
      return e(this, void 0, void 0, function* () {
        return yield this.play(t2.deviceId || t2);
      });
    }
    getResolution() {
      return this._isOpen ? [this._video.videoWidth, this._video.videoHeight] : null;
    }
    setResolution(t2, i3) {
      return e(this, void 0, void 0, function* () {
        let e2, s3;
        return this._isOpen ? (t2 instanceof Array ? (e2 = t2[0], s3 = t2[1]) : (e2 = t2, s3 = i3), yield this.play(null, e2, s3)) : yield Promise.reject(new Error("The camera is not open."));
      });
    }
    getVideoSettings() {
      return JSON.parse(JSON.stringify(this.videoSettings));
    }
    updateVideoSettings(e2) {
      return this.videoSettings = JSON.parse(JSON.stringify(e2)), this._lastDeviceId = null, this._isOpen ? this.play() : Promise.resolve();
    }
    isOpen() {
      return this._isOpen;
    }
    getCapabilities() {
      return this._assertOpen(), this._videoTrack.getCapabilities ? this._videoTrack.getCapabilities() : {};
    }
    getCameraSettings() {
      return this._assertOpen(), this._videoTrack.getSettings();
    }
    getConstraints() {
      return this._assertOpen(), this._videoTrack.getConstraints();
    }
    applyConstraints(t2) {
      return e(this, void 0, void 0, function* () {
        if (this._assertOpen(), !this._videoTrack.applyConstraints)
          throw Error("Not supported.");
        return yield this._videoTrack.applyConstraints(t2);
      });
    }
    turnOnTorch() {
      return e(this, void 0, void 0, function* () {
        if (this._assertOpen(), this.getCapabilities().torch)
          return yield this._videoTrack.applyConstraints({advanced: [{torch: true}]});
        throw Error("Not supported.");
      });
    }
    turnOffTorch() {
      return e(this, void 0, void 0, function* () {
        if (this._assertOpen(), this.getCapabilities().torch)
          return yield this._videoTrack.applyConstraints({advanced: [{torch: false}]});
        throw Error("Not supported.");
      });
    }
    setColorTemperature(t2) {
      return e(this, void 0, void 0, function* () {
        this._assertOpen();
        let e2 = this.getCapabilities().colorTemperature;
        if (!e2)
          throw Error("Not supported.");
        return t2 < e2.min ? t2 = e2.min : t2 > e2.max && (t2 = e2.max), yield this._videoTrack.applyConstraints({advanced: [{colorTemperature: t2}]});
      });
    }
    setExposureCompensation(t2) {
      return e(this, void 0, void 0, function* () {
        this._assertOpen();
        let e2 = this.getCapabilities().exposureCompensation;
        if (!e2)
          throw Error("Not supported.");
        return t2 < e2.min ? t2 = e2.min : t2 > e2.max && (t2 = e2.max), yield this._videoTrack.applyConstraints({advanced: [{exposureCompensation: t2}]});
      });
    }
    setZoom(t2) {
      return e(this, void 0, void 0, function* () {
        this._assertOpen();
        let e2 = this.getCapabilities().zoom;
        if (!e2)
          throw Error("Not supported.");
        return t2 < e2.min ? t2 = e2.min : t2 > e2.max && (t2 = e2.max), yield this._videoTrack.applyConstraints({advanced: [{zoom: t2}]});
      });
    }
    setFrameRate(t2) {
      return e(this, void 0, void 0, function* () {
        this._assertOpen();
        let e2 = this.getCapabilities().frameRate;
        if (!e2)
          throw Error("Not supported.");
        return t2 < e2.min ? t2 = e2.min : t2 > e2.max && (t2 = e2.max), yield this._videoTrack.applyConstraints({width: {ideal: Math.max(this._video.videoWidth, this._video.videoHeight)}, frameRate: t2});
      });
    }
    getFrameRate() {
      return this.getCameraSettings().frameRate;
    }
    getFrame(e2) {
      if (this.bDestroyed)
        throw Error("The DCE instance has been destroyed.");
      this._assertOpen(), s._onLog && s._onLog("DCE: getFrame(region?)");
      const t2 = Date.now(), i3 = this._video.videoWidth, o3 = this._video.videoHeight, n2 = Math.max(i3, o3);
      let r2, a2;
      if (n2 > this._canvasMaxWH) {
        let e3 = this._canvasMaxWH / n2;
        r2 = Math.round(i3 * e3), a2 = Math.round(o3 * e3);
      } else
        r2 = i3, a2 = o3;
      let h2 = 0, d2 = 0, l2 = i3, g2 = o3, c2 = i3, u2 = o3;
      if (e2) {
        let t3, s3, n3, _3;
        e2.regionMeasuredByPercentage ? (t3 = e2.regionLeft * r2 / 100, s3 = e2.regionTop * a2 / 100, n3 = e2.regionRight * r2 / 100, _3 = e2.regionBottom * a2 / 100) : (t3 = e2.regionLeft, s3 = e2.regionTop, n3 = e2.regionRight, _3 = e2.regionBottom), c2 = n3 - t3, l2 = Math.round(c2 / r2 * i3), u2 = _3 - s3, g2 = Math.round(u2 / a2 * o3), h2 = Math.round(t3 / r2 * i3), d2 = Math.round(s3 / a2 * o3);
      }
      let _2 = h2 == 0 && d2 == 0 && i3 == l2 && o3 == g2 && i3 == c2 && o3 == u2;
      if (!this.bSaveOriCanvas && _2) {
        this.videoGlCvs || (this.videoGlCvs = globalThis.OffscreenCanvas ? new OffscreenCanvas(c2, u2) : document.createElement("canvas"));
        const e3 = this.videoGlCvs;
        e3.width == c2 && e3.height == u2 || (e3.height = u2, e3.width = c2, this.videoGl && this.videoGl.viewport(0, 0, c2, u2));
        const i4 = this.videoGl || e3.getContext("webgl", {alpha: false, antialias: false, depth: false, stencil: false, preserveDrawingBuffer: true}) || e3.getContext("experimental-webgl", {alpha: false, antialias: false, depth: false, stencil: false, preserveDrawingBuffer: true});
        if (!this.videoGl) {
          this.videoGl = i4;
          const e4 = i4.createShader(i4.VERTEX_SHADER);
          i4.shaderSource(e4, "\nattribute vec4 a_position;\nattribute vec2 a_uv;\n\nvarying vec2 v_uv;\n\nvoid main() {\n    gl_Position = a_position;\n    v_uv = a_uv;\n}\n"), i4.compileShader(e4), i4.getShaderParameter(e4, i4.COMPILE_STATUS) || console.error("An error occurred compiling the shaders: " + i4.getShaderInfoLog(e4));
          const t3 = i4.createShader(i4.FRAGMENT_SHADER);
          i4.shaderSource(t3, "\nprecision lowp float;\n\nvarying vec2 v_uv;\n\nuniform sampler2D u_texture;\n\nvoid main() {\n    vec4 sample =  texture2D(u_texture, v_uv);\n    float grey = 0.299 * sample.r + 0.587 * sample.g + 0.114 * sample.b;\n    gl_FragColor = vec4(grey, 0.0, 0.0, 1.0);\n}\n"), i4.compileShader(t3), i4.getShaderParameter(t3, i4.COMPILE_STATUS) || console.error("An error occurred compiling the shaders: " + i4.getShaderInfoLog(t3));
          const s3 = i4.createProgram();
          i4.attachShader(s3, e4), i4.attachShader(s3, t3), i4.linkProgram(s3), i4.getProgramParameter(s3, i4.LINK_STATUS) || console.error("Unable to initialize the shader program: " + i4.getProgramInfoLog(s3)), i4.useProgram(s3), i4.bindBuffer(i4.ARRAY_BUFFER, i4.createBuffer()), i4.bufferData(i4.ARRAY_BUFFER, new Float32Array([-1, 1, 0, 1, 1, 1, 1, 1, -1, -1, 0, 0, 1, -1, 1, 0]), i4.STATIC_DRAW);
          const o5 = i4.getAttribLocation(s3, "a_position");
          i4.enableVertexAttribArray(o5), i4.vertexAttribPointer(o5, 2, i4.FLOAT, false, 16, 0);
          const n4 = i4.getAttribLocation(s3, "a_uv");
          i4.enableVertexAttribArray(n4), i4.vertexAttribPointer(n4, 2, i4.FLOAT, false, 16, 8), i4.activeTexture(i4.TEXTURE0), i4.bindTexture(i4.TEXTURE_2D, i4.createTexture()), i4.texParameteri(i4.TEXTURE_2D, i4.TEXTURE_WRAP_S, i4.CLAMP_TO_EDGE), i4.texParameteri(i4.TEXTURE_2D, i4.TEXTURE_WRAP_T, i4.CLAMP_TO_EDGE), i4.texParameteri(i4.TEXTURE_2D, i4.TEXTURE_MIN_FILTER, i4.NEAREST), i4.texParameteri(i4.TEXTURE_2D, i4.TEXTURE_MAG_FILTER, i4.NEAREST), i4.uniform1i(i4.getUniformLocation(s3, "u_texture"), 0);
        }
        (!this.glImgData || this.glImgData.length < c2 * u2 * 4) && (this.glImgData = new Uint8Array(c2 * u2 * 4)), i4.texImage2D(i4.TEXTURE_2D, 0, i4.RGBA, i4.RGBA, i4.UNSIGNED_BYTE, this._video);
        let o4 = s._onLog ? Date.now() : 0;
        i4.drawArrays(i4.TRIANGLE_STRIP, 0, 4), s._onLog && s._onLog("DCE: Grey cost: " + (Date.now() - o4));
        const n3 = this.glImgData;
        i4.readPixels(0, 0, i4.drawingBufferWidth, i4.drawingBufferHeight, i4.RGBA, i4.UNSIGNED_BYTE, n3);
        let r3 = s._onLog ? Date.now() : 0, a3 = new Uint8Array(new Uint32Array(n3.buffer));
        s._onLog && s._onLog("DCE: Extract grey cost: " + (Date.now() - r3));
        const h3 = Date.now();
        return {canvas: null, data: a3, region: null, sx: 0, sy: 0, width: c2, height: u2, timeSpent: h3 - t2, timeStamp: h3};
      }
      {
        let i4 = null;
        if (this.bSaveOriCanvas)
          i4 = document.createElement("canvas"), i4.width = c2, i4.height = u2, i4.dbrCtx2d = i4.getContext("2d");
        else {
          for (let e3 of this.videoCvses)
            if (e3.width == c2 && e3.height == u2) {
              i4 = e3;
              break;
            }
          i4 || (globalThis.OffscreenCanvas ? i4 = new OffscreenCanvas(c2, u2) : (i4 = document.createElement("canvas"), i4.width = c2, i4.height = u2), i4.dbrCtx2d = i4.getContext("2d"), this.videoCvses.length >= this.maxVideoCvsLength && (this.videoCvses = this.videoCvses.slice(1)), this.videoCvses.push(i4));
        }
        const s3 = i4.dbrCtx2d;
        _2 ? s3.drawImage(this._video, 0, 0) : s3.drawImage(this._video, h2, d2, l2, g2, 0, 0, c2, u2);
        let o4 = i4.dbrCtx2d || i4.getContext("2d");
        if (i4.width === 0 || i4.height === 0)
          return null;
        let n3 = o4.getImageData(0, 0, i4.width, i4.height).data;
        const r3 = Date.now();
        return {data: n3, canvas: i4, region: e2, sx: h2, sy: d2, width: l2, height: g2, timeSpent: r3 - t2, timeStamp: r3};
      }
    }
    getCurrentRegion() {
      let e2;
      if (this._region)
        if (this._region instanceof Array) {
          if (this.bChangeRegionIndexManually) {
            if (this._regionIndex >= this._region.length)
              throw new Error("the 'regionIndex' should be less than the length of region array.");
          } else
            ++this._regionIndex >= this._region.length && (this._regionIndex = 0);
          e2 = this._region[this._regionIndex];
        } else
          e2 = this._region;
      else
        e2 = null;
      return e2;
    }
    _fetchingLoop(e2) {
      if (this.bDestroyed)
        return void this.stopFetchingLoop();
      if (!this._isOpen || !this.isFetchingLoopStarted())
        return void this.stopFetchingLoop();
      if (this._video.paused)
        return s._onLog && s._onLog("DCE: Video is paused. Ask in 1s."), this._frameLoopTimeoutId && clearTimeout(this._frameLoopTimeoutId), void (this._frameLoopTimeoutId = setTimeout(() => {
          this._fetchingLoop(true);
        }, 1e3));
      const t2 = () => {
        s._onLog && s._onLog("DCE: start fetching a frame: " + Date.now());
        let e3 = this.getCurrentRegion(), t3 = this.getFrame(e3);
        this._frameQueue && this._frameQueue.length >= this._frameQueueMaxLength && this._frameQueue.shift(), this._frameQueue.push(t3), s._onLog && s._onLog("DCE: finish fetching a frame: " + Date.now());
      }, i3 = () => {
        this._frameLoopTimeoutId2 && clearTimeout(this._frameLoopTimeoutId2), this._bufferRefreshInterval <= 0 || (this._frameLoopTimeoutId2 = setTimeout(() => {
          this.bDestroyed ? this.stopFetchingLoop() : this._isOpen && this.isFetchingLoopStarted() ? this._video.paused ? this._frameLoopTimeoutId && clearTimeout(this._frameLoopTimeoutId) : (s._onLog && s._onLog("DCE: second timeout executes: " + Date.now()), t2(), i3()) : this.stopFetchingLoop();
        }, this._bufferRefreshInterval));
      };
      e2 && (this._frameQueue.length < this._frameQueueMaxLength ? (t2(), i3()) : this.alwaysRefreshBuffer && t2()), this._frameLoopTimeoutId && clearTimeout(this._frameLoopTimeoutId), this._frameLoopTimeoutId = setTimeout(() => {
        this._fetchingLoop(true);
      }, this._loopInterval);
    }
    startFetchingLoop() {
      if (this.bDestroyed)
        throw Error("The DCE instance has been destroyed.");
      if (this._assertOpen(), this._video.paused)
        throw Error("The video is paused.");
      this.isFetchingLoopStarted() || (this._bFetchingLoopStarted = true, s._onLog && s._onLog("start fetching loop: " + Date.now()), this._fetchingLoop(true));
    }
    isFetchingLoopStarted() {
      return this._bFetchingLoopStarted;
    }
    stopFetchingLoop() {
      this._bFetchingLoopStarted && (s._onLog && s._onLog("stop fetching loop: " + Date.now()), this._frameLoopTimeoutId && clearTimeout(this._frameLoopTimeoutId), this._frameQueue.length = 0, this._bFetchingLoopStarted = false);
    }
    getFrameFromBuffer(e2) {
      return this._frameQueue && this._frameQueue.length ? e2 ? e2 < this._frameQueue.length ? (this._frameLoopTimeoutId2 && clearTimeout(this._frameLoopTimeoutId2), this._frameQueue.splice(e2, 1)[0]) : void 0 : (this._frameLoopTimeoutId2 && clearTimeout(this._frameLoopTimeoutId2), this._frameQueue.shift()) : null;
    }
    getQueueLength() {
      return this._frameQueue.length;
    }
  };
  s._jsVersion = "2.0.3", s._jsEditVersion = "20210628", s._version = "JS " + s._jsVersion + "." + s._jsEditVersion, s.browserInfo = function() {
    if (!t && !i) {
      var e2 = {init: function() {
        this.browser = this.searchString(this.dataBrowser) || "unknownBrowser", this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || "unknownVersion", this.OS = this.searchString(this.dataOS) || "unknownOS", this.OS == "Linux" && navigator.userAgent.indexOf("Windows NT") != -1 && (this.OS = "HarmonyOS");
      }, searchString: function(e3) {
        for (var t2 = 0; t2 < e3.length; t2++) {
          var i3 = e3[t2].string, s3 = e3[t2].prop;
          if (this.versionSearchString = e3[t2].versionSearch || e3[t2].identity, i3) {
            if (i3.indexOf(e3[t2].subString) != -1)
              return e3[t2].identity;
          } else if (s3)
            return e3[t2].identity;
        }
      }, searchVersion: function(e3) {
        var t2 = e3.indexOf(this.versionSearchString);
        if (t2 != -1)
          return parseFloat(e3.substring(t2 + this.versionSearchString.length + 1));
      }, dataBrowser: [{string: navigator.userAgent, subString: "Edge", identity: "Edge"}, {string: navigator.userAgent, subString: "OPR", identity: "OPR"}, {string: navigator.userAgent, subString: "Chrome", identity: "Chrome"}, {string: navigator.vendor, subString: "Apple", identity: "Safari", versionSearch: "Version"}, {string: navigator.userAgent, subString: "Firefox", identity: "Firefox"}, {string: navigator.userAgent, subString: "MSIE", identity: "Explorer", versionSearch: "MSIE"}], dataOS: [{string: navigator.userAgent, subString: "HarmonyOS", identity: "HarmonyOS"}, {string: navigator.userAgent, subString: "Android", identity: "Android"}, {string: navigator.userAgent, subString: "iPhone", identity: "iPhone"}, {string: navigator.platform, subString: "Win", identity: "Windows"}, {string: navigator.platform, subString: "Mac", identity: "Mac"}, {string: navigator.platform, subString: "Linux", identity: "Linux"}]};
      return e2.init(), {browser: e2.browser, version: e2.version, OS: e2.OS};
    }
    if (i)
      return {browser: "ssr", version: 0, OS: "ssr"};
  }(), s._hasEngineResourceLoaded = false, s._engineResourcePath = (() => {
    if (t)
      return "";
    if (!i && document.currentScript) {
      let e2 = document.currentScript.src, t2 = e2.indexOf("?");
      if (t2 != -1)
        e2 = e2.substring(0, t2);
      else {
        let t3 = e2.indexOf("#");
        t3 != -1 && (e2 = e2.substring(0, t3));
      }
      return e2.substring(0, e2.lastIndexOf("/") + 1);
    }
    return "./";
  })(), s._defaultUIElementURL = "@engineResourcePath/dce.ui.html";
  var o = class {
    static get browserInfo() {
      return s.browserInfo;
    }
    static getVersion() {
      return s.getVersion();
    }
    static detectEnvironment() {
      return s.detectEnvironment();
    }
    static get engineResourcePath() {
      return s.engineResourcePath;
    }
    static set engineResourcePath(e2) {
      s.engineResourcePath = e2;
    }
    static get _onLog() {
      return s._onLog;
    }
    static set _onLog(e2) {
      s._onLog = e2;
    }
  };
  o.CameraEnhancer = s;

  // ../../node_modules/dynamsoft-javascript-barcode/dist/dbr.browser.pure.esm.js
  function i2(e2, t2, i3, n2) {
    return new (i3 || (i3 = Promise))(function(r2, s3) {
      function o3(e3) {
        try {
          d2(n2.next(e3));
        } catch (e4) {
          s3(e4);
        }
      }
      function a2(e3) {
        try {
          d2(n2.throw(e3));
        } catch (e4) {
          s3(e4);
        }
      }
      function d2(e3) {
        var t3;
        e3.done ? r2(e3.value) : (t3 = e3.value, t3 instanceof i3 ? t3 : new i3(function(e4) {
          e4(t3);
        })).then(o3, a2);
      }
      d2((n2 = n2.apply(e2, t2 || [])).next());
    });
  }
  var n;
  var r;
  var s2;
  var o2;
  !function(e2) {
    e2[e2.IPF_Binary = 0] = "IPF_Binary", e2[e2.IPF_BinaryInverted = 1] = "IPF_BinaryInverted", e2[e2.IPF_GrayScaled = 2] = "IPF_GrayScaled", e2[e2.IPF_NV21 = 3] = "IPF_NV21", e2[e2.IPF_RGB_565 = 4] = "IPF_RGB_565", e2[e2.IPF_RGB_555 = 5] = "IPF_RGB_555", e2[e2.IPF_RGB_888 = 6] = "IPF_RGB_888", e2[e2.IPF_ARGB_8888 = 7] = "IPF_ARGB_8888", e2[e2.IPF_RGB_161616 = 8] = "IPF_RGB_161616", e2[e2.IPF_ARGB_16161616 = 9] = "IPF_ARGB_16161616", e2[e2.IPF_ABGR_8888 = 10] = "IPF_ABGR_8888", e2[e2.IPF_ABGR_16161616 = 11] = "IPF_ABGR_16161616", e2[e2.IPF_BGR_888 = 12] = "IPF_BGR_888";
  }(n || (n = {})), function(e2) {
    e2[e2.DBR_SYSTEM_EXCEPTION = 1] = "DBR_SYSTEM_EXCEPTION", e2[e2.DBR_SUCCESS = 0] = "DBR_SUCCESS", e2[e2.DBR_UNKNOWN = -1e4] = "DBR_UNKNOWN", e2[e2.DBR_NO_MEMORY = -10001] = "DBR_NO_MEMORY", e2[e2.DBR_NULL_REFERENCE = -10002] = "DBR_NULL_REFERENCE", e2[e2.DBR_LICENSE_INVALID = -10003] = "DBR_LICENSE_INVALID", e2[e2.DBR_LICENSE_EXPIRED = -10004] = "DBR_LICENSE_EXPIRED", e2[e2.DBR_FILE_NOT_FOUND = -10005] = "DBR_FILE_NOT_FOUND", e2[e2.DBR_FILETYPE_NOT_SUPPORTED = -10006] = "DBR_FILETYPE_NOT_SUPPORTED", e2[e2.DBR_BPP_NOT_SUPPORTED = -10007] = "DBR_BPP_NOT_SUPPORTED", e2[e2.DBR_INDEX_INVALID = -10008] = "DBR_INDEX_INVALID", e2[e2.DBR_BARCODE_FORMAT_INVALID = -10009] = "DBR_BARCODE_FORMAT_INVALID", e2[e2.DBR_CUSTOM_REGION_INVALID = -10010] = "DBR_CUSTOM_REGION_INVALID", e2[e2.DBR_MAX_BARCODE_NUMBER_INVALID = -10011] = "DBR_MAX_BARCODE_NUMBER_INVALID", e2[e2.DBR_IMAGE_READ_FAILED = -10012] = "DBR_IMAGE_READ_FAILED", e2[e2.DBR_TIFF_READ_FAILED = -10013] = "DBR_TIFF_READ_FAILED", e2[e2.DBR_QR_LICENSE_INVALID = -10016] = "DBR_QR_LICENSE_INVALID", e2[e2.DBR_1D_LICENSE_INVALID = -10017] = "DBR_1D_LICENSE_INVALID", e2[e2.DBR_DIB_BUFFER_INVALID = -10018] = "DBR_DIB_BUFFER_INVALID", e2[e2.DBR_PDF417_LICENSE_INVALID = -10019] = "DBR_PDF417_LICENSE_INVALID", e2[e2.DBR_DATAMATRIX_LICENSE_INVALID = -10020] = "DBR_DATAMATRIX_LICENSE_INVALID", e2[e2.DBR_PDF_READ_FAILED = -10021] = "DBR_PDF_READ_FAILED", e2[e2.DBR_PDF_DLL_MISSING = -10022] = "DBR_PDF_DLL_MISSING", e2[e2.DBR_PAGE_NUMBER_INVALID = -10023] = "DBR_PAGE_NUMBER_INVALID", e2[e2.DBR_CUSTOM_SIZE_INVALID = -10024] = "DBR_CUSTOM_SIZE_INVALID", e2[e2.DBR_CUSTOM_MODULESIZE_INVALID = -10025] = "DBR_CUSTOM_MODULESIZE_INVALID", e2[e2.DBR_RECOGNITION_TIMEOUT = -10026] = "DBR_RECOGNITION_TIMEOUT", e2[e2.DBR_JSON_PARSE_FAILED = -10030] = "DBR_JSON_PARSE_FAILED", e2[e2.DBR_JSON_TYPE_INVALID = -10031] = "DBR_JSON_TYPE_INVALID", e2[e2.DBR_JSON_KEY_INVALID = -10032] = "DBR_JSON_KEY_INVALID", e2[e2.DBR_JSON_VALUE_INVALID = -10033] = "DBR_JSON_VALUE_INVALID", e2[e2.DBR_JSON_NAME_KEY_MISSING = -10034] = "DBR_JSON_NAME_KEY_MISSING", e2[e2.DBR_JSON_NAME_VALUE_DUPLICATED = -10035] = "DBR_JSON_NAME_VALUE_DUPLICATED", e2[e2.DBR_TEMPLATE_NAME_INVALID = -10036] = "DBR_TEMPLATE_NAME_INVALID", e2[e2.DBR_JSON_NAME_REFERENCE_INVALID = -10037] = "DBR_JSON_NAME_REFERENCE_INVALID", e2[e2.DBR_PARAMETER_VALUE_INVALID = -10038] = "DBR_PARAMETER_VALUE_INVALID", e2[e2.DBR_DOMAIN_NOT_MATCHED = -10039] = "DBR_DOMAIN_NOT_MATCHED", e2[e2.DBR_RESERVEDINFO_NOT_MATCHED = -10040] = "DBR_RESERVEDINFO_NOT_MATCHED", e2[e2.DBR_AZTEC_LICENSE_INVALID = -10041] = "DBR_AZTEC_LICENSE_INVALID", e2[e2.DBR_LICENSE_DLL_MISSING = -10042] = "DBR_LICENSE_DLL_MISSING", e2[e2.DBR_LICENSEKEY_NOT_MATCHED = -10043] = "DBR_LICENSEKEY_NOT_MATCHED", e2[e2.DBR_REQUESTED_FAILED = -10044] = "DBR_REQUESTED_FAILED", e2[e2.DBR_LICENSE_INIT_FAILED = -10045] = "DBR_LICENSE_INIT_FAILED", e2[e2.DBR_PATCHCODE_LICENSE_INVALID = -10046] = "DBR_PATCHCODE_LICENSE_INVALID", e2[e2.DBR_POSTALCODE_LICENSE_INVALID = -10047] = "DBR_POSTALCODE_LICENSE_INVALID", e2[e2.DBR_DPM_LICENSE_INVALID = -10048] = "DBR_DPM_LICENSE_INVALID", e2[e2.DBR_FRAME_DECODING_THREAD_EXISTS = -10049] = "DBR_FRAME_DECODING_THREAD_EXISTS", e2[e2.DBR_STOP_DECODING_THREAD_FAILED = -10050] = "DBR_STOP_DECODING_THREAD_FAILED", e2[e2.DBR_SET_MODE_ARGUMENT_ERROR = -10051] = "DBR_SET_MODE_ARGUMENT_ERROR", e2[e2.DBR_LICENSE_CONTENT_INVALID = -10052] = "DBR_LICENSE_CONTENT_INVALID", e2[e2.DBR_LICENSE_KEY_INVALID = -10053] = "DBR_LICENSE_KEY_INVALID", e2[e2.DBR_LICENSE_DEVICE_RUNS_OUT = -10054] = "DBR_LICENSE_DEVICE_RUNS_OUT", e2[e2.DBR_GET_MODE_ARGUMENT_ERROR = -10055] = "DBR_GET_MODE_ARGUMENT_ERROR", e2[e2.DBR_IRT_LICENSE_INVALID = -10056] = "DBR_IRT_LICENSE_INVALID", e2[e2.DBR_MAXICODE_LICENSE_INVALID = -10057] = "DBR_MAXICODE_LICENSE_INVALID", e2[e2.DBR_GS1_DATABAR_LICENSE_INVALID = -10058] = "DBR_GS1_DATABAR_LICENSE_INVALID", e2[e2.DBR_GS1_COMPOSITE_LICENSE_INVALID = -10059] = "DBR_GS1_COMPOSITE_LICENSE_INVALID", e2[e2.DBR_DOTCODE_LICENSE_INVALID = -10061] = "DBR_DOTCODE_LICENSE_INVALID", e2[e2.DMERR_NO_LICENSE = -2e4] = "DMERR_NO_LICENSE", e2[e2.DMERR_LICENSE_SYNC_FAILED = -20003] = "DMERR_LICENSE_SYNC_FAILED", e2[e2.DMERR_TRIAL_LICENSE = -20010] = "DMERR_TRIAL_LICENSE", e2[e2.DMERR_FAILED_TO_REACH_LTS = -20200] = "DMERR_FAILED_TO_REACH_LTS";
  }(r || (r = {})), function(e2) {
    e2[e2.IMRDT_IMAGE = 1] = "IMRDT_IMAGE", e2[e2.IMRDT_CONTOUR = 2] = "IMRDT_CONTOUR", e2[e2.IMRDT_LINESEGMENT = 4] = "IMRDT_LINESEGMENT", e2[e2.IMRDT_LOCALIZATIONRESULT = 8] = "IMRDT_LOCALIZATIONRESULT", e2[e2.IMRDT_REGIONOFINTEREST = 16] = "IMRDT_REGIONOFINTEREST", e2[e2.IMRDT_QUADRILATERAL = 32] = "IMRDT_QUADRILATERAL";
  }(s2 || (s2 = {})), function(e2) {
    e2[e2.BF_ALL = -31457281] = "BF_ALL", e2[e2.BF_ONED = 1050623] = "BF_ONED", e2[e2.BF_GS1_DATABAR = 260096] = "BF_GS1_DATABAR", e2[e2.BF_CODE_39 = 1] = "BF_CODE_39", e2[e2.BF_CODE_128 = 2] = "BF_CODE_128", e2[e2.BF_CODE_93 = 4] = "BF_CODE_93", e2[e2.BF_CODABAR = 8] = "BF_CODABAR", e2[e2.BF_ITF = 16] = "BF_ITF", e2[e2.BF_EAN_13 = 32] = "BF_EAN_13", e2[e2.BF_EAN_8 = 64] = "BF_EAN_8", e2[e2.BF_UPC_A = 128] = "BF_UPC_A", e2[e2.BF_UPC_E = 256] = "BF_UPC_E", e2[e2.BF_INDUSTRIAL_25 = 512] = "BF_INDUSTRIAL_25", e2[e2.BF_CODE_39_EXTENDED = 1024] = "BF_CODE_39_EXTENDED", e2[e2.BF_GS1_DATABAR_OMNIDIRECTIONAL = 2048] = "BF_GS1_DATABAR_OMNIDIRECTIONAL", e2[e2.BF_GS1_DATABAR_TRUNCATED = 4096] = "BF_GS1_DATABAR_TRUNCATED", e2[e2.BF_GS1_DATABAR_STACKED = 8192] = "BF_GS1_DATABAR_STACKED", e2[e2.BF_GS1_DATABAR_STACKED_OMNIDIRECTIONAL = 16384] = "BF_GS1_DATABAR_STACKED_OMNIDIRECTIONAL", e2[e2.BF_GS1_DATABAR_EXPANDED = 32768] = "BF_GS1_DATABAR_EXPANDED", e2[e2.BF_GS1_DATABAR_EXPANDED_STACKED = 65536] = "BF_GS1_DATABAR_EXPANDED_STACKED", e2[e2.BF_GS1_DATABAR_LIMITED = 131072] = "BF_GS1_DATABAR_LIMITED", e2[e2.BF_PATCHCODE = 262144] = "BF_PATCHCODE", e2[e2.BF_PDF417 = 33554432] = "BF_PDF417", e2[e2.BF_QR_CODE = 67108864] = "BF_QR_CODE", e2[e2.BF_DATAMATRIX = 134217728] = "BF_DATAMATRIX", e2[e2.BF_AZTEC = 268435456] = "BF_AZTEC", e2[e2.BF_MAXICODE = 536870912] = "BF_MAXICODE", e2[e2.BF_MICRO_QR = 1073741824] = "BF_MICRO_QR", e2[e2.BF_MICRO_PDF417 = 524288] = "BF_MICRO_PDF417", e2[e2.BF_GS1_COMPOSITE = -2147483648] = "BF_GS1_COMPOSITE", e2[e2.BF_MSI_CODE = 1048576] = "BF_MSI_CODE", e2[e2.BF_NULL = 0] = "BF_NULL";
  }(o2 || (o2 = {})), typeof global == "object" && global.process && global.process.release && global.process.release.name;
  var a = typeof self == "undefined";
  var d = a ? {} : self;
  var _ = class {
    constructor() {
      this._canvasMaxWH = _.browserInfo.OS == "iPhone" || _.browserInfo.OS == "Android" ? 2048 : 4096, this._instanceID = void 0, this.bSaveOriCanvas = false, this.oriCanvas = null, this.bFilterRegionInJs = true, this._region = null, this._timeStartDecode = null, this._timeEnterInnerDBR = null, this._timeGetMessage = null, this._bUseWebgl = true, this.decodeRecords = {}, this.bDestroyed = false, this._lastErrorCode = 0, this._lastErrorString = "", this._lastInnerDecodeDuration = 0;
    }
    static get version() {
      return this._version;
    }
    static get license() {
      return this._license;
    }
    static set license(e2) {
      if (this._loadWasmStatus != "unload")
        throw new Error("`license` is not allowed to change after `createInstance` or `loadWasm` is called.");
      _._license = e2;
    }
    static get productKeys() {
      return this._license;
    }
    static set productKeys(e2) {
      _.license = e2;
    }
    static get handshakeCode() {
      return this._license;
    }
    static set handshakeCode(e2) {
      _.license = e2;
    }
    static get organizationID() {
      return this._license;
    }
    static set organizationID(e2) {
      _.license = e2;
    }
    static set sessionPassword(e2) {
      if (this._loadWasmStatus != "unload")
        throw new Error("`sessionPassword` is not allowed to change after `createInstance` or `loadWasm` is called.");
      _._sessionPassword = e2;
    }
    static get sessionPassword() {
      return this._sessionPassword;
    }
    static detectEnvironment() {
      return i2(this, void 0, void 0, function* () {
        let e2 = {wasm: typeof WebAssembly != "undefined" && (typeof navigator == "undefined" || !(/Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent) && /\(.+\s11_2_([2-6]).*\)/.test(navigator.userAgent))), worker: !(typeof Worker == "undefined"), getUserMedia: !(typeof navigator == "undefined" || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia), camera: false, browser: this.browserInfo.browser, version: this.browserInfo.version, OS: this.browserInfo.OS};
        if (e2.getUserMedia)
          try {
            (yield navigator.mediaDevices.getUserMedia({video: true})).getTracks().forEach((e3) => {
              e3.stop();
            }), e2.camera = true;
          } catch (e3) {
          }
        return e2;
      });
    }
    static get engineResourcePath() {
      return this._engineResourcePath;
    }
    static set engineResourcePath(e2) {
      if (this._loadWasmStatus != "unload")
        throw new Error("`engineResourcePath` is not allowed to change after `createInstance` or `loadWasm` is called.");
      if (e2 == null && (e2 = "./"), a)
        _._engineResourcePath = e2;
      else {
        let t2 = document.createElement("a");
        t2.href = e2, _._engineResourcePath = t2.href;
      }
      this._engineResourcePath.endsWith("/") || (_._engineResourcePath += "/");
    }
    static get licenseServer() {
      return this._licenseServer;
    }
    static set licenseServer(e2) {
      if (this._loadWasmStatus != "unload")
        throw new Error("`licenseServer` is not allowed to change after `createInstance` or `loadWasm` is called.");
      if (e2 == null)
        _._licenseServer = [];
      else {
        e2 instanceof Array || (e2 = [e2]);
        for (let t2 = 0; t2 < e2.length; ++t2) {
          if (!a) {
            let i3 = document.createElement("a");
            i3.href = e2[t2], e2[t2] = i3.href;
          }
          e2[t2].endsWith("/") || (e2[t2] += "/");
        }
        _._licenseServer = e2;
      }
    }
    static get deviceFriendlyName() {
      return this._deviceFriendlyName;
    }
    static set deviceFriendlyName(e2) {
      if (this._loadWasmStatus != "unload")
        throw new Error("`deviceFriendlyName` is not allowed to change after `createInstance` or `loadWasm` is called.");
      _._deviceFriendlyName = e2 || "";
    }
    static get _bUseFullFeature() {
      return this.__bUseFullFeature;
    }
    static set _bUseFullFeature(e2) {
      if (this._loadWasmStatus != "unload")
        throw new Error("`_bUseFullFeature` is not allowed to change after `createInstance` or `loadWasm` is called.");
      _.__bUseFullFeature = e2;
    }
    get ifSaveOriginalImageInACanvas() {
      return this.bSaveOriCanvas;
    }
    set ifSaveOriginalImageInACanvas(e2) {
      this.bSaveOriCanvas = e2;
    }
    getOriginalImageInACanvas() {
      return this.oriCanvas;
    }
    set region(e2) {
      this._region = e2;
    }
    get region() {
      return this._region;
    }
    static isLoaded() {
      return this._loadWasmStatus == "loadSuccess";
    }
    isContextDestroyed() {
      return this.bDestroyed;
    }
    static get lastErrorCode() {
      return this._lastErrorCode;
    }
    static get lastErrorString() {
      return this._lastErrorString;
    }
    get lastErrorCode() {
      return this._lastErrorCode;
    }
    get lastErrorString() {
      return this._lastErrorString;
    }
    static loadWasm() {
      return i2(this, void 0, void 0, function* () {
        let e2, t2 = _._license, n2 = JSON.parse(JSON.stringify(_._licenseServer)), s3 = _._sessionPassword, o3 = null, a2 = null, l2 = 0;
        if (t2.startsWith("t") || t2.startsWith("f"))
          l2 = 0;
        else if (t2.length === 0 || t2.startsWith("P") || t2.startsWith("L"))
          l2 = 1;
        else {
          l2 = 2;
          const e3 = t2.indexOf(":");
          if (e3 != -1 && (t2 = t2.substring(e3 + 1)), t2.startsWith("DLS2")) {
            let e4 = t2.substring(4);
            e4 = atob(e4);
            const i3 = JSON.parse(e4);
            if (i3.handshakeCode ? t2 = i3.handshakeCode : i3.organizationID && (t2 = i3.organizationID), typeof t2 == "number" && (t2 = JSON.stringify(t2)), t2 || (t2 = ""), n2.length === 0) {
              let e5 = [];
              i3.mainServerURL && (e5[0] = i3.mainServerURL), i3.standbyServerURL && (e5[1] = i3.standbyServerURL), _.licenseServer = e5, n2 = _.licenseServer;
            }
            !s3 && i3.sessionPassword && (s3 = i3.sessionPassword), i3.chargeWay && (a2 = i3.chargeWay), i3.limitedLicenseModules && (o3 = i3.limitedLicenseModules);
          }
        }
        if (l2 && (d.crypto || (e2 = "Please upgrade your browser to support online key."), d.crypto.subtle || (e2 = "Require https to use online key in this browser.")), e2) {
          if (l2 !== 1)
            throw new Error(e2);
          l2 = 0, console.warn(e2), _._lastErrorCode = r.DMERR_FAILED_TO_REACH_LTS, _._lastErrorString = e2;
        }
        return l2 === 1 && (t2 = "", console.warn("Automatically apply for a public trial license.")), yield new Promise((e3, r2) => i2(this, void 0, void 0, function* () {
          switch (_._loadWasmStatus) {
            case "unload": {
              _._loadWasmStatus = "loading";
              let e4 = _.engineResourcePath + _._workerName;
              _.engineResourcePath.startsWith(location.origin) || (e4 = yield fetch(e4).then((e5) => e5.blob()).then((e5) => URL.createObjectURL(e5))), _._dbrWorker = new Worker(e4), _._dbrWorker.onerror = (e5) => {
                _._loadWasmStatus = "loadFail";
                let t3 = new Error(e5.message);
                _._loadWasmErr = t3;
                for (let e6 of _._loadWasmCallbackArr)
                  e6(t3);
                _._loadWasmCallbackArr = [];
              }, _._dbrWorker.onmessage = (e5) => i2(this, void 0, void 0, function* () {
                let t3 = e5.data ? e5.data : e5;
                switch (t3.type) {
                  case "log":
                    _._onLog && _._onLog(t3.message);
                    break;
                  case "load": {
                    t3.message && (t3.message = t3.message.replace("(https://www.dynamsoft.com/purchase-center/)", "(https://www.dynamsoft.com/store/dynamsoft-barcode-reader/#javascript)"));
                    let e6 = false;
                    if (l2 === 1 && (e6 = true), t3.success) {
                      _._loadWasmStatus = "loadSuccess", _._version = t3.version + "(JS " + _._jsVersion + "." + _._jsEditVersion + ")", _._onLog && _._onLog("load dbr worker success");
                      for (let e7 of _._loadWasmCallbackArr)
                        e7();
                      _._loadWasmCallbackArr = [], _._dbrWorker.onerror = null, t3.message && console.warn(t3.message);
                    } else {
                      let i3 = new Error(t3.message);
                      i3.stack = t3.stack + "\n" + i3.stack, _._loadWasmStatus = "loadFail", _._loadWasmErr = i3;
                      for (let e7 of _._loadWasmCallbackArr)
                        e7(i3);
                      _._loadWasmCallbackArr = [], e6 || t3.ltsErrorCode == 111 && t3.message.toLowerCase().indexOf("trial license") != -1 && (e6 = true);
                    }
                    e6 && _.showDialog(t3.success ? "warn" : "error", t3.message);
                    break;
                  }
                  case "task": {
                    let e6 = t3.id, i3 = t3.body;
                    try {
                      _._taskCallbackMap.get(e6)(i3), _._taskCallbackMap.delete(e6);
                    } catch (t4) {
                      throw _._taskCallbackMap.delete(e6), t4;
                    }
                    break;
                  }
                  default:
                    _._onLog && _._onLog(e5);
                }
              }), _._dbrWorker.postMessage({type: "loadWasm", bd: _._bWasmDebug, engineResourcePath: _.engineResourcePath, version: _._jsVersion, brtk: !!l2, bptk: l2 === 1, lcs: t2, dm: location.origin.startsWith("http") ? location.origin : "https://localhost", bUseFullFeature: _._bUseFullFeature, browserInfo: _.browserInfo, deviceFriendlyName: _.deviceFriendlyName, ls: n2, sp: s3, lm: o3, cw: a2});
            }
            case "loading":
              _._loadWasmCallbackArr.push((t3) => {
                t3 ? r2(t3) : e3();
              });
              break;
            case "loadSuccess":
              e3();
              break;
            case "loadFail":
              r2(_._loadWasmErr);
          }
        }));
      });
    }
    static showDialog(e2, t2) {
      return i2(this, void 0, void 0, function* () {
        if (!_._bNeverShowDialog)
          try {
            let i3 = yield fetch(_.engineResourcePath + "dls.license.dialog.html");
            if (!i3.ok)
              throw Error("Get license dialog fail. Network Error: " + i3.statusText);
            let n2 = yield i3.text();
            if (!n2.trim().startsWith("<"))
              throw Error("Get license dialog fail. Can't get valid HTMLElement.");
            let r2 = document.createElement("div");
            r2.innerHTML = n2;
            let s3 = [];
            for (let e3 = 0; e3 < r2.childElementCount; ++e3) {
              let t3 = r2.children[e3];
              t3 instanceof HTMLStyleElement && (s3.push(t3), document.head.append(t3));
            }
            let o3 = r2.childElementCount == 1 ? r2.children[0] : r2;
            o3.remove();
            let a2, d2, l2, c2, u2, h2 = [o3], g2 = o3.children;
            for (let e3 of g2)
              h2.push(e3);
            for (let e3 = 0; e3 < h2.length; ++e3)
              for (let t3 of h2[e3].children)
                h2.push(t3);
            for (let i4 of h2)
              if (!a2 && i4.classList.contains("dls-license-mask"))
                a2 = i4, i4.addEventListener("click", (e3) => {
                  if (i4 == e3.target) {
                    o3.remove();
                    for (let e4 of s3)
                      e4.remove();
                  }
                });
              else if (!d2 && i4.classList.contains("dls-license-icon-close"))
                d2 = i4, i4.addEventListener("click", () => {
                  o3.remove();
                  for (let e3 of s3)
                    e3.remove();
                });
              else if (!l2 && i4.classList.contains("dls-license-icon-error"))
                l2 = i4, e2 != "error" && i4.remove();
              else if (!c2 && i4.classList.contains("dls-license-icon-warn"))
                c2 = i4, e2 != "warn" && i4.remove();
              else if (!u2 && i4.classList.contains("dls-license-msg-content")) {
                u2 = i4;
                let e3 = t2;
                for (; e3; ) {
                  let t3 = e3.indexOf("["), n3 = e3.indexOf("]", t3), r3 = e3.indexOf("(", n3), s4 = e3.indexOf(")", r3);
                  if (t3 == -1 || n3 == -1 || r3 == -1 || s4 == -1) {
                    i4.appendChild(new Text(e3));
                    break;
                  }
                  t3 > 0 && i4.appendChild(new Text(e3.substring(0, t3)));
                  let o4 = document.createElement("a"), a3 = e3.substring(t3 + 1, n3);
                  o4.innerText = a3;
                  let d3 = e3.substring(r3 + 1, s4);
                  o4.setAttribute("href", d3), o4.setAttribute("target", "_blank"), i4.appendChild(o4), e3 = e3.substring(s4 + 1);
                }
              }
            document.body.appendChild(o3);
          } catch (e3) {
            _._onLog && _._onLog(e3.message || e3);
          }
      });
    }
    static createInstanceInWorker(e2 = false) {
      return i2(this, void 0, void 0, function* () {
        return yield _.loadWasm(), yield new Promise((t2, i3) => {
          let n2 = _._nextTaskID++;
          _._taskCallbackMap.set(n2, (e3) => {
            if (e3.success)
              return t2(e3.instanceID);
            {
              let t3 = new Error(e3.message);
              return t3.stack = e3.stack + "\n" + t3.stack, i3(t3);
            }
          }), _._dbrWorker.postMessage({type: "createInstance", id: n2, bScanner: e2});
        });
      });
    }
    static createInstance() {
      return i2(this, void 0, void 0, function* () {
        let e2 = new _();
        return e2._instanceID = yield _.createInstanceInWorker(), e2;
      });
    }
    decode(e2) {
      return i2(this, void 0, void 0, function* () {
        _._onLog && _._onLog("decode(source: any)"), _._onLog && (this._timeStartDecode = Date.now());
        {
          let t2 = {};
          return !this.region || this.region instanceof Array || (t2.region = JSON.parse(JSON.stringify(this.region))), e2 instanceof Blob ? yield this._decode_Blob(e2, t2) : e2 instanceof ArrayBuffer ? yield this._decode_ArrayBuffer(e2, t2) : e2 instanceof Uint8Array || e2 instanceof Uint8ClampedArray ? yield this._decode_Uint8Array(e2, t2) : e2 instanceof HTMLImageElement || typeof ImageBitmap != "undefined" && e2 instanceof ImageBitmap ? yield this._decode_Image(e2, t2) : e2 instanceof HTMLCanvasElement || typeof OffscreenCanvas != "undefined" && e2 instanceof OffscreenCanvas ? yield this._decode_Canvas(e2, t2) : e2 instanceof HTMLVideoElement ? yield this._decode_Video(e2, t2) : typeof e2 == "string" ? e2.substring(0, 11) == "data:image/" ? yield this._decode_Base64(e2, t2) : yield this._decode_Url(e2, t2) : yield Promise.reject(TypeError("'_decode(source, config)': Type of 'source' should be 'Blob', 'ArrayBuffer', 'Uint8Array', 'HTMLImageElement', 'HTMLCanvasElement', 'HTMLVideoElement', 'String(base64 with image mime)' or 'String(url)'."));
        }
      });
    }
    decodeBase64String(e2) {
      return i2(this, void 0, void 0, function* () {
        let t2 = {};
        return !this.region || this.region instanceof Array || (t2.region = JSON.parse(JSON.stringify(this.region))), this._decode_Base64(e2, t2);
      });
    }
    decodeUrl(e2) {
      return i2(this, void 0, void 0, function* () {
        let t2 = {};
        return !this.region || this.region instanceof Array || (t2.region = JSON.parse(JSON.stringify(this.region))), this._decode_Url(e2, t2);
      });
    }
    _decodeBuffer_Uint8Array(e2, t2, n2, r2, s3, o3) {
      return i2(this, void 0, void 0, function* () {
        return yield new Promise((i3, a2) => {
          let d2 = _._nextTaskID++;
          _._taskCallbackMap.set(d2, (e3) => {
            if (e3.success) {
              let t3, n3 = _._onLog ? Date.now() : 0;
              _._onLog && _._onLog("worker return result: " + n3), this._lastInnerDecodeDuration = e3.duration;
              try {
                t3 = this._handleRetJsonString(e3.decodeReturn);
              } catch (e4) {
                return a2(e4);
              }
              if (_._onLog) {
                let e4 = Date.now();
                _._onLog("DBR time get result: " + n3), _._onLog("Handle image cost: " + (this._timeEnterInnerDBR - this._timeStartDecode)), _._onLog("DBR worker decode image cost: " + (n3 - this._timeEnterInnerDBR)), _._onLog("DBR worker handle results: " + (e4 - n3)), _._onLog("Total decode image cost: " + (e4 - this._timeStartDecode));
              }
              return i3(t3);
            }
            {
              let t3 = new Error(e3.message);
              return t3.stack = e3.stack + "\n" + t3.stack, a2(t3);
            }
          }), this._timeEnterInnerDBR = Date.now(), _._onLog && _._onLog("Send buffer to worker:" + this._timeEnterInnerDBR), _._dbrWorker.postMessage({type: "decodeBuffer", id: d2, instanceID: this._instanceID, body: {buffer: e2, width: t2, height: n2, stride: r2, format: s3, config: o3}}, [e2.buffer]), _._onLog && o3 && o3._timeEndGettingFrame && _._onLog("decode image delay: " + (this._timeEnterInnerDBR - o3._timeEndGettingFrame));
        });
      });
    }
    _decodeBuffer_Blob(e2, t2, n2, r2, s3, o3) {
      return i2(this, void 0, void 0, function* () {
        _._onLog && _._onLog("_decodeBuffer_Blob(buffer,width,height,stride,format)");
        const i3 = e2.arrayBuffer ? yield e2.arrayBuffer() : yield new Promise((t3, i4) => {
          let n3 = new FileReader();
          n3.readAsArrayBuffer(e2), n3.onload = () => {
            t3(n3.result);
          }, n3.onerror = () => {
            i4(n3.error);
          };
        });
        return yield this._decodeBuffer_Uint8Array(new Uint8Array(i3), t2, n2, r2, s3, o3);
      });
    }
    decodeBuffer(e2, t2, n2, r2, s3, o3) {
      return i2(this, void 0, void 0, function* () {
        let i3;
        return _._onLog && _._onLog("decodeBuffer(buffer,width,height,stride,format)"), _._onLog && (this._timeStartDecode = Date.now()), e2 instanceof Uint8Array || e2 instanceof Uint8ClampedArray ? i3 = yield this._decodeBuffer_Uint8Array(e2, t2, n2, r2, s3, o3) : e2 instanceof ArrayBuffer ? i3 = yield this._decodeBuffer_Uint8Array(new Uint8Array(e2), t2, n2, r2, s3, o3) : e2 instanceof Blob && (i3 = yield this._decodeBuffer_Blob(e2, t2, n2, r2, s3, o3)), i3;
      });
    }
    _decodeFileInMemory_Uint8Array(e2) {
      return i2(this, void 0, void 0, function* () {
        return yield new Promise((t2, i3) => {
          let n2 = _._nextTaskID++;
          _._taskCallbackMap.set(n2, (e3) => {
            if (e3.success) {
              let n3;
              this._lastInnerDecodeDuration = e3.duration;
              try {
                n3 = this._handleRetJsonString(e3.decodeReturn);
              } catch (e4) {
                return i3(e4);
              }
              return t2(n3);
            }
            {
              let t3 = new Error(e3.message);
              return t3.stack = e3.stack + "\n" + t3.stack, i3(t3);
            }
          }), _._dbrWorker.postMessage({type: "decodeFileInMemory", id: n2, instanceID: this._instanceID, body: {bytes: e2}});
        });
      });
    }
    getRuntimeSettings() {
      return i2(this, void 0, void 0, function* () {
        return yield new Promise((e2, t2) => {
          let i3 = _._nextTaskID++;
          _._taskCallbackMap.set(i3, (i4) => {
            if (i4.success) {
              let t3 = JSON.parse(i4.results);
              return this.userDefinedRegion != null && (t3.region = JSON.parse(JSON.stringify(this.userDefinedRegion))), e2(t3);
            }
            {
              let e3 = new Error(i4.message);
              return e3.stack = i4.stack + "\n" + e3.stack, t2(e3);
            }
          }), _._dbrWorker.postMessage({type: "getRuntimeSettings", id: i3, instanceID: this._instanceID});
        });
      });
    }
    updateRuntimeSettings(e2) {
      return i2(this, void 0, void 0, function* () {
        let t2;
        if (typeof e2 == "string")
          if (e2 == "speed") {
            let e3 = yield this.getRuntimeSettings();
            yield this.resetRuntimeSettings(), t2 = yield this.getRuntimeSettings(), t2.barcodeFormatIds = e3.barcodeFormatIds, t2.barcodeFormatIds_2 = e3.barcodeFormatIds_2, t2.region = e3.region, t2.deblurLevel = 3, t2.expectedBarcodesCount = 0, t2.localizationModes = [2, 0, 0, 0, 0, 0, 0, 0];
          } else if (e2 == "balance") {
            let e3 = yield this.getRuntimeSettings();
            yield this.resetRuntimeSettings(), t2 = yield this.getRuntimeSettings(), t2.barcodeFormatIds = e3.barcodeFormatIds, t2.barcodeFormatIds_2 = e3.barcodeFormatIds_2, t2.region = e3.region, t2.deblurLevel = 5, t2.expectedBarcodesCount = 512, t2.localizationModes = [2, 16, 0, 0, 0, 0, 0, 0];
          } else if (e2 == "coverage") {
            let e3 = yield this.getRuntimeSettings();
            yield this.resetRuntimeSettings(), t2 = yield this.getRuntimeSettings(), t2.barcodeFormatIds = e3.barcodeFormatIds, t2.barcodeFormatIds_2 = e3.barcodeFormatIds_2, t2.region = e3.region;
          } else
            t2 = JSON.parse(e2);
        else {
          if (typeof e2 != "object")
            throw TypeError("'UpdateRuntimeSettings(settings)': Type of 'settings' should be 'string' or 'PlainObject'.");
          if (t2 = JSON.parse(JSON.stringify(e2)), t2.region instanceof Array) {
            let e3 = t2.region;
            [e3.regionLeft, e3.regionTop, e3.regionLeft, e3.regionBottom, e3.regionMeasuredByPercentage].some((e4) => e4 !== void 0) && (t2.region = {regionLeft: e3.regionLeft || 0, regionTop: e3.regionTop || 0, regionRight: e3.regionRight || 0, regionBottom: e3.regionBottom || 0, regionMeasuredByPercentage: e3.regionMeasuredByPercentage || 0});
          }
        }
        if (!_._bUseFullFeature) {
          if ((t2.barcodeFormatIds & ~(o2.BF_ONED | o2.BF_QR_CODE | o2.BF_PDF417 | o2.BF_DATAMATRIX)) != 0 || t2.barcodeFormatIds_2 != 0)
            throw Error("Some of the specified barcode formats are not supported in the compact version. Please try the full-featured version.");
          if (t2.intermediateResultTypes != 0)
            throw Error("Intermediate results is not supported in the compact version. Please try the full-featured version.");
        }
        if (this.bFilterRegionInJs) {
          let e3 = t2.region;
          if (e3 instanceof Array)
            throw Error("The `region` of type `Array` is only allowed in `BarcodeScanner`.");
          this.userDefinedRegion = JSON.parse(JSON.stringify(e3)), (e3.regionLeft || e3.regionTop || e3.regionRight || e3.regionBottom || e3.regionMeasuredByPercentage) && (e3.regionLeft || e3.regionTop || e3.regionRight != 100 || e3.regionBottom != 100 || !e3.regionMeasuredByPercentage) ? this.region = e3 : this.region = null, t2.region = {regionLeft: 0, regionTop: 0, regionRight: 0, regionBottom: 0, regionMeasuredByPercentage: 0};
        } else
          this.userDefinedRegion = null, this.region = null;
        return yield new Promise((e3, i3) => {
          let n2 = _._nextTaskID++;
          _._taskCallbackMap.set(n2, (t3) => {
            if (t3.success) {
              try {
                this._handleRetJsonString(t3.updateReturn);
              } catch (e4) {
                i3(e4);
              }
              return e3();
            }
            {
              let e4 = new Error(t3.message);
              return e4.stack = t3.stack + "\n" + e4.stack, i3(e4);
            }
          }), _._dbrWorker.postMessage({type: "updateRuntimeSettings", id: n2, instanceID: this._instanceID, body: {settings: JSON.stringify(t2)}});
        });
      });
    }
    resetRuntimeSettings() {
      return i2(this, void 0, void 0, function* () {
        return this.userDefinedRegion = null, this.region = null, yield new Promise((e2, t2) => {
          let i3 = _._nextTaskID++;
          _._taskCallbackMap.set(i3, (i4) => {
            if (i4.success)
              return e2();
            {
              let e3 = new Error(i4.message);
              return e3.stack = i4.stack + "\n" + e3.stack, t2(e3);
            }
          }), _._dbrWorker.postMessage({type: "resetRuntimeSettings", id: i3, instanceID: this._instanceID});
        });
      });
    }
    outputSettingsToString() {
      return i2(this, void 0, void 0, function* () {
        if (!_._bUseFullFeature)
          throw Error("outputSettingsToString() is not supported in the compact version. Please try the full-featured version.");
        return yield new Promise((e2, t2) => {
          let i3 = _._nextTaskID++;
          _._taskCallbackMap.set(i3, (i4) => {
            if (i4.success)
              return e2(i4.results);
            {
              let e3 = new Error(i4.message);
              return e3.stack = i4.stack + "\n" + e3.stack, t2(e3);
            }
          }), _._dbrWorker.postMessage({type: "outputSettingsToString", id: i3, instanceID: this._instanceID});
        });
      });
    }
    initRuntimeSettingsWithString(e2) {
      return i2(this, void 0, void 0, function* () {
        if (!_._bUseFullFeature)
          throw Error("initRuntimeSettingsWithString() is not supported in the compact version. Please try the full-featured version.");
        if (typeof e2 == "string")
          e2 = e2;
        else {
          if (typeof e2 != "object")
            throw TypeError("'initRuntimeSettingstWithString(settings)': Type of 'settings' should be 'string' or 'PlainObject'.");
          e2 = JSON.stringify(e2);
        }
        return yield new Promise((t2, i3) => {
          let n2 = _._nextTaskID++;
          _._taskCallbackMap.set(n2, (e3) => {
            if (e3.success) {
              try {
                this._handleRetJsonString(e3.initReturn);
              } catch (e4) {
                i3(e4);
              }
              return t2();
            }
            {
              let t3 = new Error(e3.message);
              return t3.stack = e3.stack + "\n" + t3.stack, i3(t3);
            }
          }), _._dbrWorker.postMessage({type: "initRuntimeSettingsWithString", id: n2, instanceID: this._instanceID, body: {settings: e2}});
        });
      });
    }
    _decode_Blob(e2, t2) {
      return i2(this, void 0, void 0, function* () {
        _._onLog && _._onLog("_decode_Blob(blob: Blob)");
        let i3 = null, n2 = null;
        if (typeof createImageBitmap != "undefined")
          try {
            i3 = yield createImageBitmap(e2);
          } catch (e3) {
          }
        i3 || (n2 = yield function(e3) {
          return new Promise((t3, i4) => {
            let n3 = URL.createObjectURL(e3), r3 = new Image();
            r3.dbrObjUrl = n3, r3.src = n3, r3.onload = () => {
              t3(r3);
            }, r3.onerror = (e4) => {
              i4(new Error("Can't convert blob to image : " + (e4 instanceof Event ? e4.type : e4)));
            };
          });
        }(e2));
        let r2 = yield this._decode_Image(i3 || n2, t2);
        return i3 && i3.close(), r2;
      });
    }
    _decode_ArrayBuffer(e2, t2) {
      return i2(this, void 0, void 0, function* () {
        return yield this._decode_Blob(new Blob([e2]), t2);
      });
    }
    _decode_Uint8Array(e2, t2) {
      return i2(this, void 0, void 0, function* () {
        return yield this._decode_Blob(new Blob([e2]), t2);
      });
    }
    _decode_Image(e2, t2) {
      return i2(this, void 0, void 0, function* () {
        _._onLog && _._onLog("_decode_Image(image: HTMLImageElement|ImageBitmap)"), t2 = t2 || {};
        let i3, n2, r2, s3, o3 = e2 instanceof HTMLImageElement ? e2.naturalWidth : e2.width, a2 = e2 instanceof HTMLImageElement ? e2.naturalHeight : e2.height, l2 = t2.region;
        if (l2) {
          let e3, t3, r3, s4;
          l2.regionMeasuredByPercentage ? (e3 = l2.regionLeft * o3 / 100, t3 = l2.regionTop * a2 / 100, r3 = l2.regionRight * o3 / 100, s4 = l2.regionBottom * a2 / 100) : (e3 = l2.regionLeft, t3 = l2.regionTop, r3 = l2.regionRight, s4 = l2.regionBottom), i3 = e3, n2 = t3, o3 = Math.round(r3 - e3), a2 = Math.round(s4 - t3);
        } else
          i3 = 0, n2 = 0;
        const c2 = Math.max(o3, a2);
        if (c2 > this._canvasMaxWH) {
          const e3 = this._canvasMaxWH / c2;
          o3 > a2 ? (r2 = this._canvasMaxWH, s3 = Math.round(a2 * e3)) : (r2 = Math.round(o3 * e3), s3 = this._canvasMaxWH);
        } else
          r2 = o3, s3 = a2;
        let u2, h2;
        !this.bSaveOriCanvas && d.OffscreenCanvas ? u2 = new OffscreenCanvas(r2, s3) : (u2 = document.createElement("canvas"), u2.width = r2, u2.height = s3), u2.getContext("2d").drawImage(e2, i3, n2, o3, a2, 0, 0, r2, s3), e2.dbrObjUrl && URL.revokeObjectURL(e2.dbrObjUrl), l2 ? (h2 = JSON.parse(JSON.stringify(t2)), delete h2.region) : h2 = t2;
        let g2 = yield this._decode_Canvas(u2, h2);
        return _.fixResultLocationWhenFilterRegionInJs(l2, g2, i3, n2, o3, a2, r2, s3), g2;
      });
    }
    _decode_Canvas(e2, t2) {
      return i2(this, void 0, void 0, function* () {
        if (_._onLog && _._onLog("_decode_Canvas(canvas:HTMLCanvasElement)"), e2.crossOrigin && e2.crossOrigin != "anonymous")
          throw "cors";
        (this.bSaveOriCanvas || this.singleFrameMode) && (this.oriCanvas = e2);
        let i3 = (e2.dbrCtx2d || e2.getContext("2d")).getImageData(0, 0, e2.width, e2.height).data;
        return yield this._decodeBuffer_Uint8Array(i3, e2.width, e2.height, 4 * e2.width, n.IPF_ABGR_8888, t2);
      });
    }
    _decode_Video(e2, t2) {
      return i2(this, void 0, void 0, function* () {
        if (_._onLog && _._onLog("_decode_Video(video)"), !(e2 instanceof HTMLVideoElement))
          throw TypeError("'_decode_Video(video [, config] )': Type of 'video' should be 'HTMLVideoElement'.");
        if (e2.crossOrigin && e2.crossOrigin != "anonymous")
          throw "cors";
        t2 = t2 || {};
        let i3, n2, r2, s3, o3 = e2.videoWidth, a2 = e2.videoHeight, l2 = t2.region;
        if (l2) {
          let e3, t3, r3, s4;
          l2.regionMeasuredByPercentage ? (e3 = l2.regionLeft * o3 / 100, t3 = l2.regionTop * a2 / 100, r3 = l2.regionRight * o3 / 100, s4 = l2.regionBottom * a2 / 100) : (e3 = l2.regionLeft, t3 = l2.regionTop, r3 = l2.regionRight, s4 = l2.regionBottom), i3 = e3, n2 = t3, o3 = Math.round(r3 - e3), a2 = Math.round(s4 - t3);
        } else
          i3 = 0, n2 = 0;
        const c2 = Math.max(o3, a2);
        if (c2 > this._canvasMaxWH) {
          const e3 = this._canvasMaxWH / c2;
          o3 > a2 ? (r2 = this._canvasMaxWH, s3 = Math.round(a2 * e3)) : (r2 = Math.round(o3 * e3), s3 = this._canvasMaxWH);
        } else
          r2 = o3, s3 = a2;
        let u2 = null;
        !this.bSaveOriCanvas && d.OffscreenCanvas ? u2 = new OffscreenCanvas(r2, s3) : (u2 = document.createElement("canvas"), u2.width = r2, u2.height = s3);
        let h2;
        (u2.dbrCtx2d = u2.getContext("2d")).drawImage(e2, i3, n2, o3, a2, 0, 0, r2, s3), l2 ? (h2 = JSON.parse(JSON.stringify(t2)), delete h2.region) : h2 = t2;
        let g2 = yield this._decode_Canvas(u2, t2);
        return l2 && _.fixResultLocationWhenFilterRegionInJs(l2, g2, i3, n2, o3, a2, r2, s3), g2;
      });
    }
    _decode_Base64(e2, t2) {
      return i2(this, void 0, void 0, function* () {
        if (_._onLog && _._onLog("_decode_Base64(base64Str)"), typeof e2 != "string")
          return Promise.reject("'_decode_Base64(base64Str, config)': Type of 'base64Str' should be 'string'.");
        e2.substring(0, 11) == "data:image/" && (e2 = e2.substring(e2.indexOf(",") + 1));
        {
          let i3 = atob(e2), n2 = i3.length, r2 = new Uint8Array(n2);
          for (; n2--; )
            r2[n2] = i3.charCodeAt(n2);
          return yield this._decode_Blob(new Blob([r2]), t2);
        }
      });
    }
    _decode_Url(e2, t2) {
      return i2(this, void 0, void 0, function* () {
        if (_._onLog && _._onLog("_decode_Url(url)"), typeof e2 != "string")
          throw TypeError("'_decode_Url(url, config)': Type of 'url' should be 'string'.");
        e2 = e2;
        {
          let n2 = yield new Promise((t3, n3) => {
            let r2 = new XMLHttpRequest();
            r2.open("GET", e2, true), r2.responseType = "blob", r2.send(), r2.onloadend = () => i2(this, void 0, void 0, function* () {
              t3(r2.response);
            }), r2.onerror = () => {
              n3(new Error("Network Error: " + r2.statusText));
            };
          });
          return yield this._decode_Blob(n2, t2);
        }
      });
    }
    _decode_FilePath(e2, t2) {
      return i2(this, void 0, void 0, function* () {
        throw _._onLog && _._onLog("_decode_FilePath(path)"), Error("'_decode_FilePath(path, config)': The method is only supported in node environment.");
      });
    }
    static fixResultLocationWhenFilterRegionInJs(e2, t2, i3, n2, r2, s3, o3, a2) {
      if (e2 && t2.length > 0)
        for (let e3 of t2) {
          let t3 = e3.localizationResult;
          t3.resultCoordinateType == 2 && (t3.x1 *= 0.01 * o3, t3.x2 *= 0.01 * o3, t3.x3 *= 0.01 * o3, t3.x4 *= 0.01 * o3, t3.y1 *= 0.01 * a2, t3.y2 *= 0.01 * a2, t3.y3 *= 0.01 * a2, t3.y4 *= 0.01 * a2);
          let d2 = o3 / r2, _2 = a2 / s3;
          t3.x1 = t3.x1 / d2 + i3, t3.x2 = t3.x2 / d2 + i3, t3.x3 = t3.x3 / d2 + i3, t3.x4 = t3.x4 / d2 + i3, t3.y1 = t3.y1 / _2 + n2, t3.y2 = t3.y2 / _2 + n2, t3.y3 = t3.y3 / _2 + n2, t3.y4 = t3.y4 / _2 + n2, t3.resultCoordinateType == 2 && (t3.x1 *= 100 / r2, t3.x2 *= 100 / r2, t3.x3 *= 100 / r2, t3.x4 *= 100 / r2, t3.y1 *= 100 / s3, t3.y2 *= 100 / s3, t3.y3 *= 100 / s3, t3.y4 *= 100 / s3);
        }
    }
    static BarcodeReaderException(e2, t2) {
      let i3, n2 = r.DBR_UNKNOWN;
      return typeof e2 == "number" ? (n2 = e2, i3 = new Error(t2)) : i3 = new Error(e2), i3.code = n2, i3;
    }
    _handleRetJsonString(e2) {
      let t2 = r;
      if (e2.textResults) {
        for (let t3 = 0; t3 < e2.textResults.length; t3++) {
          let i3 = e2.textResults[t3];
          try {
            let e3 = i3.barcodeText, t4 = "";
            for (let i4 = 0; i4 < e3.length; i4++)
              t4 += String.fromCharCode(e3[i4]);
            try {
              i3.barcodeText = decodeURIComponent(escape(t4));
            } catch (e4) {
              i3.barcodeText = t4;
            }
          } catch (e3) {
            i3.barcodeText = "";
          }
          if (i3.exception != null) {
            _._setWarnnedEx.has(i3.exception) || (_._setWarnnedEx.add(i3.exception), console.warn(i3.exception));
            let e3 = {};
            i3.exception.split(";").forEach((t4) => {
              let i4 = t4.indexOf(":");
              e3[t4.substring(0, i4)] = t4.substring(i4 + 1);
            }), i3.exception = e3;
          }
        }
        return e2.decodeRecords ? this.decodeRecords = e2.decodeRecords : this.decodeRecords = {}, this._lastErrorCode = e2.exception, this._lastErrorString = e2.description, e2.exception && !_._setWarnnedEx.has(e2.description) && (_._setWarnnedEx.add(e2.description), console.warn(e2.description)), e2.textResults;
      }
      if (e2.exception == t2.DBR_SUCCESS)
        return e2.data;
      throw _.BarcodeReaderException(e2.exception, e2.description);
    }
    setModeArgument(e2, t2, n2, r2) {
      return i2(this, void 0, void 0, function* () {
        return yield new Promise((i3, s3) => {
          let o3 = _._nextTaskID++;
          _._taskCallbackMap.set(o3, (e3) => {
            if (e3.success) {
              try {
                this._handleRetJsonString(e3.setReturn);
              } catch (e4) {
                return s3(e4);
              }
              return i3();
            }
            {
              let t3 = new Error(e3.message);
              return t3.stack = e3.stack + "\n" + t3.stack, s3(t3);
            }
          }), _._dbrWorker.postMessage({type: "setModeArgument", id: o3, instanceID: this._instanceID, body: {modeName: e2, index: t2, argumentName: n2, argumentValue: r2}});
        });
      });
    }
    getModeArgument(e2, t2, n2) {
      return i2(this, void 0, void 0, function* () {
        return yield new Promise((i3, r2) => {
          let s3 = _._nextTaskID++;
          _._taskCallbackMap.set(s3, (e3) => {
            if (e3.success) {
              let t3;
              try {
                t3 = this._handleRetJsonString(e3.getReturn);
              } catch (e4) {
                return r2(e4);
              }
              return i3(t3);
            }
            {
              let t3 = new Error(e3.message);
              return t3.stack = e3.stack + "\n" + t3.stack, r2(t3);
            }
          }), _._dbrWorker.postMessage({type: "getModeArgument", id: s3, instanceID: this._instanceID, body: {modeName: e2, index: t2, argumentName: n2}});
        });
      });
    }
    getIntermediateResults() {
      return i2(this, void 0, void 0, function* () {
        return yield new Promise((e2, t2) => {
          let i3 = _._nextTaskID++;
          _._taskCallbackMap.set(i3, (i4) => {
            if (i4.success)
              return e2(i4.results);
            {
              let e3 = new Error(i4.message);
              return e3.stack = i4.stack + "\n" + e3.stack, t2(e3);
            }
          }), _._dbrWorker.postMessage({type: "getIntermediateResults", id: i3, instanceID: this._instanceID});
        });
      });
    }
    getIntermediateCanvas() {
      return i2(this, void 0, void 0, function* () {
        let e2 = yield this.getIntermediateResults(), t2 = [];
        for (let i3 of e2)
          if (i3.dataType == s2.IMRDT_IMAGE)
            for (let e3 of i3.results) {
              const i4 = e3.bytes;
              let r2;
              switch (_._onLog && _._onLog(" " + i4.length + " " + i4.byteLength + " " + e3.width + " " + e3.height + " " + e3.stride + " " + e3.format), e3.format) {
                case n.IPF_ABGR_8888:
                  r2 = new Uint8ClampedArray(i4);
                  break;
                case n.IPF_RGB_888: {
                  const e4 = i4.length / 3;
                  r2 = new Uint8ClampedArray(4 * e4);
                  for (let t3 = 0; t3 < e4; ++t3)
                    r2[4 * t3] = i4[3 * t3 + 2], r2[4 * t3 + 1] = i4[3 * t3 + 1], r2[4 * t3 + 2] = i4[3 * t3], r2[4 * t3 + 3] = 255;
                  break;
                }
                case n.IPF_GrayScaled: {
                  const e4 = i4.length;
                  r2 = new Uint8ClampedArray(4 * e4);
                  for (let t3 = 0; t3 < e4; t3++)
                    r2[4 * t3] = r2[4 * t3 + 1] = r2[4 * t3 + 2] = i4[t3], r2[4 * t3 + 3] = 255;
                  break;
                }
                case n.IPF_Binary:
                case n.IPF_BinaryInverted: {
                  e3.width = 8 * e3.stride, e3.height = i4.length / e3.stride;
                  const t3 = i4.length;
                  r2 = new Uint8ClampedArray(8 * t3 * 4);
                  for (let e4 = 0; e4 < t3; e4++) {
                    let t4 = i4[e4];
                    for (let i5 = 0; i5 < 8; ++i5)
                      r2[4 * (8 * e4 + i5)] = r2[4 * (8 * e4 + i5) + 1] = r2[4 * (8 * e4 + i5) + 2] = (128 & t4) / 128 * 255, r2[4 * (8 * e4 + i5) + 3] = 255, t4 <<= 1;
                  }
                  break;
                }
                default:
                  console.warn("unknow intermediate image", e3);
              }
              if (!r2)
                continue;
              let s3 = new ImageData(r2, e3.width, e3.height), o3 = document.createElement("canvas");
              o3.width = e3.width, o3.height = e3.height, o3.getContext("2d").putImageData(s3, 0, 0), t2.push(o3);
            }
        return t2;
      });
    }
    destroy() {
      return this.destroyContext();
    }
    destroyContext() {
      if (_._onLog && _._onLog("destroyContext()"), !this.bDestroyed)
        return this.bDestroyed = true, new Promise((e2, t2) => {
          let i3 = _._nextTaskID++;
          _._taskCallbackMap.set(i3, (i4) => {
            if (i4.success)
              return e2();
            {
              let e3 = new Error(i4.message);
              return e3.stack = i4.stack + "\n" + e3.stack, t2(e3);
            }
          }), _._dbrWorker.postMessage({type: "destroyContext", id: i3, instanceID: this._instanceID});
        });
    }
  };
  _._jsVersion = "8.8.7", _._jsEditVersion = "20220125", _._version = "loading...(JS " + _._jsVersion + "." + _._jsEditVersion + ")", _._license = !a && document.currentScript && (document.currentScript.getAttribute("data-license") || document.currentScript.getAttribute("data-productKeys") || document.currentScript.getAttribute("data-licenseKey") || document.currentScript.getAttribute("data-handshakeCode") || document.currentScript.getAttribute("data-organizationID")) || "", _._sessionPassword = !a && document.currentScript && document.currentScript.getAttribute("data-sessionPassword") || "", _.browserInfo = function() {
    if (!a) {
      var e2 = {init: function() {
        this.browser = this.searchString(this.dataBrowser) || "unknownBrowser", this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || "unknownVersion", this.OS = this.searchString(this.dataOS) || "unknownOS", this.OS == "Linux" && navigator.userAgent.indexOf("Windows NT") != -1 && (this.OS = "HarmonyOS");
      }, searchString: function(e3) {
        for (var t2 = 0; t2 < e3.length; t2++) {
          var i3 = e3[t2].string, n2 = e3[t2].prop;
          if (this.versionSearchString = e3[t2].versionSearch || e3[t2].identity, i3) {
            if (i3.indexOf(e3[t2].subString) != -1)
              return e3[t2].identity;
          } else if (n2)
            return e3[t2].identity;
        }
      }, searchVersion: function(e3) {
        var t2 = e3.indexOf(this.versionSearchString);
        if (t2 != -1)
          return parseFloat(e3.substring(t2 + this.versionSearchString.length + 1));
      }, dataBrowser: [{string: navigator.userAgent, subString: "Edge", identity: "Edge"}, {string: navigator.userAgent, subString: "OPR", identity: "OPR"}, {string: navigator.userAgent, subString: "Chrome", identity: "Chrome"}, {string: navigator.vendor, subString: "Apple", identity: "Safari", versionSearch: "Version"}, {string: navigator.userAgent, subString: "Firefox", identity: "Firefox"}, {string: navigator.userAgent, subString: "MSIE", identity: "Explorer", versionSearch: "MSIE"}], dataOS: [{string: navigator.userAgent, subString: "HarmonyOS", identity: "HarmonyOS"}, {string: navigator.userAgent, subString: "Android", identity: "Android"}, {string: navigator.userAgent, subString: "iPhone", identity: "iPhone"}, {string: navigator.platform, subString: "Win", identity: "Windows"}, {string: navigator.platform, subString: "Mac", identity: "Mac"}, {string: navigator.platform, subString: "Linux", identity: "Linux"}]};
      return e2.init(), {browser: e2.browser, version: e2.version, OS: e2.OS};
    }
    if (a)
      return {browser: "ssr", version: 0, OS: "ssr"};
  }(), _._workerName = "dbr-" + _._jsVersion + ".worker.js", _._engineResourcePath = (() => {
    if (!a && document.currentScript) {
      let e2 = document.currentScript.src, t2 = e2.indexOf("?");
      if (t2 != -1)
        e2 = e2.substring(0, t2);
      else {
        let t3 = e2.indexOf("#");
        t3 != -1 && (e2 = e2.substring(0, t3));
      }
      return e2.substring(0, e2.lastIndexOf("/") + 1);
    }
    return "./";
  })(), _._licenseServer = [], _._deviceFriendlyName = "", _._isShowRelDecodeTimeInResults = false, _._bWasmDebug = false, _._bNeverShowDialog = false, _.__bUseFullFeature = true, _._nextTaskID = 0, _._taskCallbackMap = new Map(), _._loadWasmStatus = "unload", _._loadWasmCallbackArr = [], _._lastErrorCode = 0, _._lastErrorString = "", _._setWarnnedEx = new Set(), _._loadWasmErr = null, typeof global == "object" && global.process && global.process.release && global.process.release.name;
  var l = class extends _ {
    constructor() {
      super(), this._clickIptSingleFrameMode = () => {
      }, this.intervalTime = 0, this.bSaveOriCanvas = false, this._intervalGetVideoFrame = 0, this.array_getFrameTimeCost = [], this.array_decodeFrameTimeCost = [], this._indexCurrentDecodingFrame = 0, this._bPauseScan = false, this._intervalDetectVideoPause = 1e3, this._cvsDrawArea = null, this._divScanArea = null, this._divScanLight = null, this._selCam = null, this._selRsl = null, this._btnClose = null, this._soundOnSuccessfullRead = new Audio("data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjI5LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAABQAAAkAAgICAgICAgICAgICAgICAgICAgKCgoKCgoKCgoKCgoKCgoKCgoKCgwMDAwMDAwMDAwMDAwMDAwMDAwMDg4ODg4ODg4ODg4ODg4ODg4ODg4P//////////////////////////AAAAAExhdmM1OC41NAAAAAAAAAAAAAAAACQEUQAAAAAAAAJAk0uXRQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/+MYxAANQAbGeUEQAAHZYZ3fASqD4P5TKBgocg+Bw/8+CAYBA4XB9/4EBAEP4nB9+UOf/6gfUCAIKyjgQ/Kf//wfswAAAwQA/+MYxAYOqrbdkZGQAMA7DJLCsQxNOij///////////+tv///3RWiZGBEhsf/FO/+LoCSFs1dFVS/g8f/4Mhv0nhqAieHleLy/+MYxAYOOrbMAY2gABf/////////////////usPJ66R0wI4boY9/8jQYg//g2SPx1M0N3Z0kVJLIs///Uw4aMyvHJJYmPBYG/+MYxAgPMALBucAQAoGgaBoFQVBUFQWDv6gZBUFQVBUGgaBr5YSgqCoKhIGg7+IQVBUFQVBoGga//SsFSoKnf/iVTEFNRTMu/+MYxAYAAANIAAAAADEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV"), this.bPlaySoundOnSuccessfulRead = false, this.bVibrateOnSuccessfulRead = false, this.vibrateDuration = 300, this.regionMaskFillStyle = "rgba(0,0,0,0.5)", this.regionMaskStrokeStyle = "rgb(254,142,20)", this.regionMaskLineWidth = 2, this.barcodeFillStyle = "rgba(254,180,32,0.3)", this.barcodeStrokeStyle = "rgba(254,180,32,0.9)", this.barcodeLineWidth = 1, this.beingLazyDrawRegionsults = false, this.dce = null, this._onCameraSelChange = () => {
        this._divScanLight && (this._divScanLight.style.display = "none"), this._drawRegionsults(), this.array_decodeFrameTimeCost.length = 0, this.array_getFrameTimeCost.length = 0, this._intervalGetVideoFrame = 0;
      }, this._onResolutionSelChange = () => {
        this._divScanLight && (this._divScanLight.style.display = "none"), this._drawRegionsults(), this.array_decodeFrameTimeCost.length = 0, this.array_getFrameTimeCost.length = 0, this._intervalGetVideoFrame = 0;
      }, this._onCloseBtnClick = () => {
        this.hide();
      };
    }
    static get defaultUIElementURL() {
      var e2;
      return (e2 = l._defaultUIElementURL) === null || e2 === void 0 ? void 0 : e2.replace("@engineResourcePath/", _.engineResourcePath);
    }
    static set defaultUIElementURL(e2) {
      l._defaultUIElementURL = e2;
    }
    getUIElement() {
      return this.dce.getUIElement();
    }
    setUIElement(e2) {
      return i2(this, void 0, void 0, function* () {
        yield this.dce.setUIElement(e2);
      });
    }
    get singleFrameMode() {
      return this.dce.singleFrameMode;
    }
    set singleFrameMode(e2) {
      this.dce.singleFrameMode = e2, e2 && (() => {
        i2(this, void 0, void 0, function* () {
          let e3 = yield this.getScanSettings();
          e3.oneDTrustFrameCount = 1, yield this.updateScanSettings(e3);
        });
      })();
    }
    get ifSaveOriginalImageInACanvas() {
      return this.bSaveOriCanvas;
    }
    set ifSaveOriginalImageInACanvas(e2) {
      this.bSaveOriCanvas = e2, this.dce && (this.dce.ifSaveOriginalImageInACanvas = e2);
    }
    _assertOpen() {
      if (!this.dce.isOpen())
        throw Error("The scanner is not open.");
    }
    get soundOnSuccessfullRead() {
      return this._soundOnSuccessfullRead;
    }
    set soundOnSuccessfullRead(e2) {
      e2 instanceof HTMLAudioElement ? this._soundOnSuccessfullRead = e2 : this._soundOnSuccessfullRead = new Audio(e2);
    }
    get whenToPlaySoundforSuccessfulRead() {
      return this.bPlaySoundOnSuccessfulRead === true ? "frame" : this.bPlaySoundOnSuccessfulRead ? this.bPlaySoundOnSuccessfulRead : "never";
    }
    set whenToPlaySoundforSuccessfulRead(e2) {
      this.bPlaySoundOnSuccessfulRead = e2 !== "never" && e2;
    }
    get whenToVibrateforSuccessfulRead() {
      return this.bVibrateOnSuccessfulRead === true ? "frame" : this.bVibrateOnSuccessfulRead ? this.bVibrateOnSuccessfulRead : "never";
    }
    set whenToVibrateforSuccessfulRead(e2) {
      this.bVibrateOnSuccessfulRead = e2 !== "never" && e2;
    }
    set region(e2) {
      this._region = e2, this.dce && (this.dce.region = e2), this.singleFrameMode || (this.beingLazyDrawRegionsults = true, setTimeout(() => {
        this.beingLazyDrawRegionsults && this._drawRegionsults();
      }, 500)), this.array_decodeFrameTimeCost.length = 0, this.array_getFrameTimeCost.length = 0, this._intervalGetVideoFrame = 0;
    }
    get region() {
      return this._region;
    }
    createDCEInstance() {
      return i2(this, void 0, void 0, function* () {
        this.dce || (_._onLog && _._onLog("createDCEInstance()"), s.defaultUIElementURL = null, this.dce = yield s.createInstance(), this.dce.bChangeRegionIndexManually = true, this.dce.regionIndex = 0, this.dce.bufferRefreshInterval = 200, this.dce.alwaysRefreshBuffer = false, this.dce.ifSaveOriginalImageInACanvas = false, this.dce.onSingleFrameAcquired = (e2) => i2(this, void 0, void 0, function* () {
          let t2 = yield this.decode(e2);
          yield this.clearMapDecodeRecord();
          for (let e3 of t2)
            delete e3.bUnduplicated;
          if (this._drawRegionsults(t2), this.onFrameRead && this.isOpen() && !this._bPauseScan && this.onFrameRead(t2), this.onUniqueRead && this.isOpen() && !this._bPauseScan)
            for (let e3 of t2)
              this.onUniqueRead(e3.barcodeText, e3);
        }), this._clickIptSingleFrameMode = this.dce._clickIptSingleFrameMode);
      });
    }
    static createInstance(e2) {
      return i2(this, void 0, void 0, function* () {
        let t2 = new l();
        yield t2.createDCEInstance(), t2._instanceID = yield l.createInstanceInWorker(true), typeof e2 == "string" && (e2 = JSON.parse(e2));
        for (let i3 in e2)
          t2[i3] = e2[i3];
        return yield t2.setUIElement(l.defaultUIElementURL), t2.singleFrameMode && console.warn("The `navigator.mediaDevices.getUserMedia` is unavailable. automatically change to `singleFrameMode`."), t2.singleFrameMode || (yield t2.updateRuntimeSettings("single")), t2;
      });
    }
    decode(e2) {
      return super.decode(e2);
    }
    decodeBase64String(e2) {
      return super.decodeBase64String(e2);
    }
    decodeUrl(e2) {
      return super.decodeUrl(e2);
    }
    decodeBuffer(e2, t2, i3, n2, r2, s3) {
      return super.decodeBuffer(e2, t2, i3, n2, r2, s3);
    }
    decodeCurrentFrame(e2) {
      return i2(this, void 0, void 0, function* () {
        this._assertOpen();
        let t2 = null;
        e2 && e2.region && (t2 = e2.region);
        let i3 = this.dce.getFrame(t2);
        if (i3 && i3.canvas === null) {
          let {data: e3, width: t3, height: r2} = i3;
          return yield this._decodeBuffer_Uint8Array(e3, t3, r2, t3, n.IPF_GrayScaled);
        }
        if (i3 && i3.canvas) {
          let {data: e3, canvas: t3, region: r2, sx: s3, sy: o3, sWidth: a2, sHeight: d2} = i3;
          (this.bSaveOriCanvas || this.singleFrameMode) && (this.oriCanvas = t3);
          let l2 = yield this._decodeBuffer_Uint8Array(e3, t3.width, t3.height, 4 * t3.width, n.IPF_ABGR_8888);
          return _.fixResultLocationWhenFilterRegionInJs(r2, l2, s3, o3, a2, d2, t3.width, t3.height), l2;
        }
      });
    }
    clearMapDecodeRecord() {
      return i2(this, void 0, void 0, function* () {
        return yield new Promise((e2, t2) => {
          let i3 = _._nextTaskID++;
          _._taskCallbackMap.set(i3, (i4) => {
            if (i4.success)
              return e2();
            {
              let e3 = new Error(i4.message);
              return e3.stack = i4.stack + "\n" + e3.stack, t2(e3);
            }
          }), _._dbrWorker.postMessage({type: "clearMapDecodeRecord", id: i3, instanceID: this._instanceID});
        });
      });
    }
    static isRegionSinglePreset(e2) {
      return JSON.stringify(e2) == JSON.stringify(l.singlePresetRegion);
    }
    static isRegionNormalPreset(e2) {
      return e2.regionLeft == 0 && e2.regionTop == 0 && e2.regionRight == 0 && e2.regionBottom == 0 && e2.regionMeasuredByPercentage == 0;
    }
    updateRuntimeSettings(e2) {
      return i2(this, void 0, void 0, function* () {
        let t2;
        if (typeof e2 == "string")
          if (e2 == "speed") {
            let e3 = yield this.getRuntimeSettings();
            yield this.resetRuntimeSettings(), t2 = yield this.getRuntimeSettings(), t2.barcodeFormatIds = e3.barcodeFormatIds, t2.barcodeFormatIds_2 = e3.barcodeFormatIds_2, l.isRegionSinglePreset(e3.region) || (t2.region = e3.region);
          } else if (e2 == "balance") {
            let e3 = yield this.getRuntimeSettings();
            yield this.resetRuntimeSettings(), t2 = yield this.getRuntimeSettings(), t2.barcodeFormatIds = e3.barcodeFormatIds, t2.barcodeFormatIds_2 = e3.barcodeFormatIds_2, l.isRegionSinglePreset(e3.region) || (t2.region = e3.region), t2.deblurLevel = 3, t2.expectedBarcodesCount = 512, t2.localizationModes = [2, 16, 0, 0, 0, 0, 0, 0], t2.timeout = 1e5;
          } else if (e2 == "coverage") {
            let e3 = yield this.getRuntimeSettings();
            yield this.resetRuntimeSettings(), t2 = yield this.getRuntimeSettings(), t2.barcodeFormatIds = e3.barcodeFormatIds, t2.barcodeFormatIds_2 = e3.barcodeFormatIds_2, l.isRegionSinglePreset(e3.region) || (t2.region = e3.region), t2.deblurLevel = 5, t2.expectedBarcodesCount = 512, t2.scaleDownThreshold = 1e5, t2.localizationModes = [2, 16, 4, 8, 0, 0, 0, 0], t2.timeout = 1e5;
          } else if (e2 == "single") {
            let e3 = yield this.getRuntimeSettings();
            yield this.resetRuntimeSettings(), t2 = yield this.getRuntimeSettings(), t2.barcodeFormatIds = e3.barcodeFormatIds, t2.barcodeFormatIds_2 = e3.barcodeFormatIds_2, l.isRegionNormalPreset(e3.region) ? t2.region = JSON.parse(JSON.stringify(l.singlePresetRegion)) : t2.region = e3.region, t2.expectedBarcodesCount = 1, t2.localizationModes = [16, 2, 0, 0, 0, 0, 0, 0], t2.barcodeZoneMinDistanceToImageBorders = 0;
          } else
            t2 = JSON.parse(e2);
        else {
          if (typeof e2 != "object")
            throw TypeError("'UpdateRuntimeSettings(settings)': Type of 'settings' should be 'string' or 'PlainObject'.");
          if (t2 = JSON.parse(JSON.stringify(e2)), t2.region instanceof Array) {
            let i3 = e2.region;
            [i3.regionLeft, i3.regionTop, i3.regionLeft, i3.regionBottom, i3.regionMeasuredByPercentage].some((e3) => e3 !== void 0) && (t2.region = {regionLeft: i3.regionLeft || 0, regionTop: i3.regionTop || 0, regionRight: i3.regionRight || 0, regionBottom: i3.regionBottom || 0, regionMeasuredByPercentage: i3.regionMeasuredByPercentage || 0});
          }
        }
        if (!_._bUseFullFeature) {
          if ((t2.barcodeFormatIds & ~(o2.BF_ONED | o2.BF_QR_CODE | o2.BF_PDF417 | o2.BF_DATAMATRIX)) != 0 || t2.barcodeFormatIds_2 != 0)
            throw Error("Some of the specified barcode formats are not supported in the compact version. Please try the full-featured version.");
          if (t2.intermediateResultTypes != 0)
            throw Error("Intermediate results is not supported in the compact version. Please try the full-featured version.");
        }
        {
          let e3 = t2.region;
          if (this.bFilterRegionInJs ? this.userDefinedRegion = JSON.parse(JSON.stringify(e3)) : this.userDefinedRegion = null, e3 instanceof Array)
            if (e3.length) {
              for (let t3 = 0; t3 < e3.length; ++t3) {
                let i3 = e3[t3];
                i3 && ((i3.regionLeft || i3.regionTop || i3.regionRight || i3.regionBottom || i3.regionMeasuredByPercentage) && (i3.regionLeft || i3.regionTop || i3.regionRight != 100 || i3.regionBottom != 100 || !i3.regionMeasuredByPercentage) || (e3[t3] = null));
              }
              this.region = e3;
            } else
              this.region = null;
          else
            (e3.regionLeft || e3.regionTop || e3.regionRight || e3.regionBottom || e3.regionMeasuredByPercentage) && (e3.regionLeft || e3.regionTop || e3.regionRight != 100 || e3.regionBottom != 100 || !e3.regionMeasuredByPercentage) ? this.region = e3 : this.region = null;
          this.bFilterRegionInJs && (t2.region = {regionLeft: 0, regionTop: 0, regionRight: 0, regionBottom: 0, regionMeasuredByPercentage: 0});
        }
        yield new Promise((e3, i3) => {
          let n2 = _._nextTaskID++;
          _._taskCallbackMap.set(n2, (t3) => {
            if (t3.success) {
              try {
                this._handleRetJsonString(t3.updateReturn);
              } catch (e4) {
                i3(e4);
              }
              return e3();
            }
            {
              let e4 = new Error(t3.message);
              return e4.stack = t3.stack + "\n" + e4.stack, i3(e4);
            }
          }), _._dbrWorker.postMessage({type: "updateRuntimeSettings", id: n2, instanceID: this._instanceID, body: {settings: JSON.stringify(t2)}});
        }), e2 == "single" && (yield this.setModeArgument("BinarizationModes", 0, "EnableFillBinaryVacancy", "0"), yield this.setModeArgument("LocalizationModes", 0, "ScanDirection", "2"), yield this.setModeArgument("BinarizationModes", 0, "BlockSizeX", "71"), yield this.setModeArgument("BinarizationModes", 0, "BlockSizeY", "71"));
      });
    }
    _bindUI() {
      let e2 = this.getUIElement();
      if (!e2)
        throw new Error("Need to define `UIElement` before opening.");
      let t2 = [e2];
      for (let e3 = 0; e3 < t2.length; ++e3)
        for (let i3 of t2[e3].children)
          t2.push(i3);
      for (let e3 of t2)
        this.dce._video || !e3.classList.contains("dce-video") && !e3.classList.contains("dbrScanner-video") ? this.dce._bgLoading || !e3.classList.contains("dce-bg-loading") && !e3.classList.contains("dbrScanner-bg-loading") ? this.dce._bgCamera || !e3.classList.contains("dce-bg-camera") && !e3.classList.contains("dbrScanner-bg-camera") ? !this._cvsDrawArea && e3.classList.contains("dbrScanner-cvs-drawarea") ? this._cvsDrawArea = e3 : !this._divScanArea && e3.classList.contains("dbrScanner-cvs-scanarea") ? this._divScanArea = e3 : !this._divScanLight && e3.classList.contains("dbrScanner-scanlight") ? this._divScanLight = e3 : this.dce._selCam || !e3.classList.contains("dce-sel-camera") && !e3.classList.contains("dbrScanner-sel-camera") ? !this.dce._selRsl && e3.classList.contains("dbrScanner-sel-resolution") ? (this.dce._selRsl = e3, this.dce._selRsl.options.length || (this.dce._selRsl.innerHTML = [this.dce._optGotRsl ? "" : '<option class="dbrScanner-opt-gotResolution" value="got"></option>', '<option data-width="1920" data-height="1080">ask 1920 x 1080</option>', '<option data-width="1280" data-height="720">ask 1280 x 720</option>', '<option data-width="640" data-height="480">ask 640 x 480</option>'].join(""), this.dce._optGotRsl = this.dce._optGotRsl || this.dce._selRsl.options[0])) : this.dce._optGotRsl || !e3.classList.contains("dce-opt-gotResolution") && !e3.classList.contains("dbrScanner-opt-gotResolution") ? this.dce._btnClose || !e3.classList.contains("dce-btn-close") && !e3.classList.contains("dbrScanner-btn-close") ? this.dce._video || !e3.classList.contains("dce-existingVideo") && !e3.classList.contains("dbrScanner-existingVideo") || (this.dce._video = e3, this.dce._video.setAttribute("playsinline", "true"), this.dce.singleFrameMode = false) : this.dce._btnClose = e3 : this.dce._optGotRsl = e3 : this.dce._selCam = e3 : this.dce._bgCamera = e3 : this.dce._bgLoading = e3 : (this.dce._video = e3, this.dce._video.setAttribute("playsinline", "true"));
      if (this.dce._bindUI(), this._selCam = this.dce._selCam, this._selRsl = this.dce._selRsl, this._btnClose = this.dce._btnClose, this.singleFrameMode && (this._cvsDrawArea && (this._cvsDrawArea.addEventListener("click", this._clickIptSingleFrameMode), this._cvsDrawArea.style.cursor = "pointer", this._cvsDrawArea.setAttribute("title", "Take a photo")), this._divScanArea && (this._divScanArea.addEventListener("click", this._clickIptSingleFrameMode), this._divScanArea.style.cursor = "pointer", this._divScanArea.setAttribute("title", "Take a photo"))), this._selCam && this._selCam.addEventListener("change", this._onCameraSelChange), this._selRsl && this._selRsl.addEventListener("change", this._onResolutionSelChange), this._btnClose && this._btnClose.addEventListener("click", this._onCloseBtnClick), !this.dce.video)
        throw this._unbindUI(), Error("Can not find HTMLVideoElement with class `dbrScanner-video`.");
    }
    _unbindUI() {
      this._clearRegionsults(), this.singleFrameMode && (this._cvsDrawArea && (this._cvsDrawArea.removeEventListener("click", this._clickIptSingleFrameMode), this._cvsDrawArea.style.cursor = "", this._cvsDrawArea.removeAttribute("title")), this._divScanArea && (this._divScanArea.removeEventListener("click", this._clickIptSingleFrameMode), this._divScanArea.style.cursor = "", this._divScanArea.removeAttribute("title"))), this._selCam && this._selCam.removeEventListener("change", this._onCameraSelChange), this._selRsl && this._selRsl.removeEventListener("change", this._onResolutionSelChange), this._btnClose && this._btnClose.removeEventListener("click", this._onCloseBtnClick), this.dce._unbindUI(), this._cvsDrawArea = null, this._divScanArea = null, this._divScanLight = null, this._selCam = null, this._selRsl = null, this._btnClose = null;
    }
    set onPlayed(e2) {
      this.dce.onPlayed = e2;
    }
    get onPlayed() {
      return this.dce.onPlayed;
    }
    get onUnduplicatedRead() {
      return this.onUniqueRead;
    }
    set onUnduplicatedRead(e2) {
      this.onUniqueRead = e2;
    }
    getAllCameras() {
      return i2(this, void 0, void 0, function* () {
        return this.dce.getAllCameras();
      });
    }
    getCurrentCamera() {
      return i2(this, void 0, void 0, function* () {
        return this.dce.getSelectedCamera();
      });
    }
    setCurrentCamera(e2) {
      return i2(this, void 0, void 0, function* () {
        return this.dce.selectCamera(e2);
      });
    }
    getResolution() {
      return this.dce.getResolution();
    }
    setResolution(e2, t2) {
      return i2(this, void 0, void 0, function* () {
        return this.dce.setResolution(e2, t2);
      });
    }
    getScanSettings() {
      return i2(this, void 0, void 0, function* () {
        return yield new Promise((e2, t2) => {
          let i3 = _._nextTaskID++;
          _._taskCallbackMap.set(i3, (i4) => {
            if (i4.success) {
              let t3 = i4.results;
              return t3.intervalTime = this.intervalTime, e2(t3);
            }
            {
              let e3 = new Error(i4.message);
              return e3.stack += "\n" + i4.stack, t2(e3);
            }
          }), _._dbrWorker.postMessage({type: "getScanSettings", id: i3, instanceID: this._instanceID});
        });
      });
    }
    updateScanSettings(e2) {
      return i2(this, void 0, void 0, function* () {
        return this.intervalTime = e2.intervalTime, yield new Promise((t2, i3) => {
          let n2 = _._nextTaskID++;
          _._taskCallbackMap.set(n2, (e3) => {
            if (e3.success)
              return t2();
            {
              let t3 = new Error(e3.message);
              return t3.stack += "\n" + e3.stack, i3(t3);
            }
          }), l._dbrWorker.postMessage({type: "updateScanSettings", id: n2, instanceID: this._instanceID, body: {settings: e2}});
        });
      });
    }
    getVideoSettings() {
      return this.dce.getVideoSettings();
    }
    updateVideoSettings(e2) {
      return this.dce.updateVideoSettings(e2);
    }
    isOpen() {
      return this.dce && this.dce.isOpen();
    }
    _show() {
      let e2 = this.getUIElement();
      e2.parentNode || (e2.style.position = "fixed", e2.style.left = "0", e2.style.top = "0", document.body.append(e2)), e2.style.display == "none" && (e2.style.display = "");
    }
    stop() {
      this.dce.stop(), this._divScanLight && (this._divScanLight.style.display = "none"), this._drawRegionsults(), this.array_decodeFrameTimeCost.length = 0, this.array_getFrameTimeCost.length = 0, this._intervalGetVideoFrame = 0;
    }
    pause() {
      this.dce.pause(), this._divScanLight && (this._divScanLight.style.display = "none");
    }
    play(e2, t2, n2) {
      return i2(this, void 0, void 0, function* () {
        return this.dce.play(e2, t2, n2);
      });
    }
    pauseScan() {
      this._assertOpen(), this._bPauseScan = true, this._divScanLight && (this._divScanLight.style.display = "none");
    }
    resumeScan() {
      this._assertOpen(), this._bPauseScan = false;
    }
    getCapabilities() {
      return this.dce.getCapabilities();
    }
    getCameraSettings() {
      return this.dce.getCameraSettings();
    }
    getConstraints() {
      return this.dce.getConstraints();
    }
    applyConstraints(e2) {
      return i2(this, void 0, void 0, function* () {
        return this.dce.applyConstraints(e2);
      });
    }
    turnOnTorch() {
      return i2(this, void 0, void 0, function* () {
        return this.dce.turnOnTorch();
      });
    }
    turnOffTorch() {
      return i2(this, void 0, void 0, function* () {
        return this.dce.turnOffTorch();
      });
    }
    setColorTemperature(e2) {
      return i2(this, void 0, void 0, function* () {
        return this.dce.setColorTemperature(e2);
      });
    }
    setExposureCompensation(e2) {
      return i2(this, void 0, void 0, function* () {
        return this.dce.setExposureCompensation(e2);
      });
    }
    setZoom(e2) {
      return i2(this, void 0, void 0, function* () {
        return this.dce.setZoom(e2);
      });
    }
    setFrameRate(e2) {
      return i2(this, void 0, void 0, function* () {
        return this.dce.setFrameRate(e2);
      });
    }
    getFrameRate() {
      return this.dce.getFrameRate();
    }
    _cloneDecodeResults(e2) {
      if (e2 instanceof Array) {
        let t2 = [];
        for (let i3 of e2)
          t2.push(this._cloneDecodeResults(i3));
        return t2;
      }
      {
        let t2 = e2;
        return JSON.parse(JSON.stringify(t2, (e3, t3) => e3 == "oriVideoCanvas" || e3 == "searchRegionCanvas" ? void 0 : t3));
      }
    }
    _loopReadVideo() {
      return i2(this, void 0, void 0, function* () {
        if (this.bDestroyed)
          return void this.dce.stopFetchingLoop();
        if (!this.isOpen())
          return this.dce.stopFetchingLoop(), void (yield this.clearMapDecodeRecord());
        if (!this.dce.video || this.dce.video.paused || this._bPauseScan)
          return _._onLog && _._onLog("Video or scan is paused. Ask in 1s."), this.dce.stopFetchingLoop(), yield this.clearMapDecodeRecord(), this._loopReadVideoTimeoutId && clearTimeout(this._loopReadVideoTimeoutId), void (this._loopReadVideoTimeoutId = setTimeout(() => {
            this._loopReadVideo();
          }, this._intervalDetectVideoPause));
        this._divScanLight && this._divScanLight.style.display == "none" && (this._divScanLight.style.display = ""), _._onLog && _._onLog("======= once read ======="), _._onLog && (this._timeStartDecode = Date.now());
        let e2 = this._getVideoFrame();
        if (!e2)
          return this._loopReadVideoTimeoutId && clearTimeout(this._loopReadVideoTimeoutId), void (this._loopReadVideoTimeoutId = setTimeout(() => {
            this._loopReadVideo();
          }, 0));
        (() => i2(this, void 0, void 0, function* () {
          if (e2 && e2.canvas === null) {
            let {data: t2, width: i3, height: r2, timeStamp: s3} = e2, o3 = {timeStamp: s3};
            return yield this._decodeBuffer_Uint8Array(t2, i3, r2, i3, n.IPF_GrayScaled, o3);
          }
          if (e2 && e2.canvas) {
            let {data: t2, canvas: i3, region: r2, sx: s3, sy: o3, width: a2, height: d2, timeStamp: l2} = e2, c2 = {timeStamp: l2};
            (this.bSaveOriCanvas || this.singleFrameMode) && (this.oriCanvas = i3);
            let u2 = yield this._decodeBuffer_Uint8Array(t2, i3.width, i3.height, 4 * i3.width, n.IPF_ABGR_8888, c2);
            return _.fixResultLocationWhenFilterRegionInJs(r2, u2, s3, o3, i3.width, i3.height, a2, d2), u2;
          }
          {
            let e3 = new Error("imgData is empty.");
            return new Promise((t2) => t2(e3));
          }
        }))().then((e3) => {
          _._onLog && _._onLog(e3);
          let t2 = this.array_decodeFrameTimeCost, i3 = this.array_getFrameTimeCost, n2 = this._indexCurrentDecodingFrame;
          if ((() => {
            if (this.region instanceof Array) {
              for (t2[n2] && t2[n2] instanceof Array || (t2[n2] = []); t2[n2].length >= 5; )
                t2[n2].shift();
              t2[n2].push(this._lastInnerDecodeDuration);
            } else {
              for (; t2.length >= 5; )
                t2.shift();
              t2.push(this._lastInnerDecodeDuration);
            }
          })(), this._intervalGetVideoFrame = (() => {
            let e4 = 0;
            if (this.region instanceof Array) {
              let r2 = 0, s3 = 0;
              r2 = n2 + 1 >= this.region.length ? 0 : n2 + 1, s3 = r2 + 1 >= this.region.length ? 0 : r2 + 1, e4 = t2[r2] && t2[r2].length && i3[s3] && i3[s3].length ? Math.min(...t2[r2]) - Math.max(...i3[s3]) : 0;
            } else if (i3 && i3.length) {
              let n3 = Math.min(...t2), r2 = Math.max(...i3);
              n3 && r2 && (e4 = n3 - r2);
            } else
              e4 = 0;
            return e4 > 0 ? e4 : 0;
          })() + this.intervalTime, this.isOpen() && this.dce.video && !this.dce.video.paused && !this._bPauseScan) {
            if (this.bPlaySoundOnSuccessfulRead && e3.length) {
              let t3 = false;
              if (this.bPlaySoundOnSuccessfulRead === true || this.bPlaySoundOnSuccessfulRead === "frame")
                t3 = true;
              else if (this.bPlaySoundOnSuccessfulRead === "unduplicated") {
                for (let i4 of e3)
                  if (i4.bUnduplicated) {
                    t3 = true;
                    break;
                  }
              }
              t3 && (this.soundOnSuccessfullRead.currentTime = 0, this.soundOnSuccessfullRead.play().catch((e4) => {
                console.warn("Autoplay not allowed. User interaction required: " + (e4.message || e4));
              }));
            }
            if (navigator.vibrate && this.bVibrateOnSuccessfulRead && e3.length) {
              let t3 = false;
              if (this.bVibrateOnSuccessfulRead === true || this.bVibrateOnSuccessfulRead === "frame")
                t3 = true;
              else if (this.bVibrateOnSuccessfulRead === "unduplicated") {
                for (let i4 of e3)
                  if (i4.bUnduplicated) {
                    t3 = true;
                    break;
                  }
              }
              if (t3)
                try {
                  navigator.vibrate(this.vibrateDuration);
                } catch (e4) {
                  console.warn("Vibration not allowed. User interaction required: " + (e4.message || e4));
                }
            }
            if (this.onFrameRead) {
              let t3 = this._cloneDecodeResults(e3);
              for (let e4 of t3)
                delete e4.bUnduplicated;
              this.onFrameRead(t3);
            }
            if (this.onUniqueRead)
              for (let t3 of e3)
                t3.bUnduplicated && this.onUniqueRead(t3.barcodeText, this._cloneDecodeResults(t3));
            this._drawRegionsults(e3);
          }
          this._loopReadVideoTimeoutId && clearTimeout(this._loopReadVideoTimeoutId), this.intervalTime ? this._loopReadVideoTimeoutId = setTimeout(() => {
            this._loopReadVideo();
          }, this.intervalTime) : this._loopReadVideo();
        }).catch((e3) => {
          this.dce.stopFetchingLoop(), _._onLog && _._onLog(e3.message || e3), this._loopReadVideoTimeoutId && clearTimeout(this._loopReadVideoTimeoutId), this._loopReadVideoTimeoutId = setTimeout(() => {
            this._loopReadVideo();
          }, Math.max(this.intervalTime, 1e3)), e3.message == "platform error" || console.warn(e3.message);
        });
      });
    }
    _getVideoFrame() {
      let e2 = this.dce.isFetchingLoopStarted();
      if (this.dce.loopInterval = this._intervalGetVideoFrame, e2 || this.dce.startFetchingLoop(), !this.dce.getQueueLength())
        return this.dce.loopInterval = 0, null;
      let t2 = this.dce.getFrameFromBuffer();
      this._indexCurrentDecodingFrame = this.dce.regionIndex, this.region instanceof Array && this.dce.regionIndex++;
      return ((e3) => {
        let t3 = e3.timeSpent, i3 = this.array_getFrameTimeCost;
        if (this.region instanceof Array) {
          let e4 = this._indexCurrentDecodingFrame;
          for (i3[e4] && i3[e4] instanceof Array || (i3[e4] = []); i3[e4].length >= 5; )
            i3[e4].shift();
          i3[e4].push(t3);
        } else {
          for (; i3.length >= 5; )
            i3.shift();
          i3.push(t3);
        }
      })(t2), t2;
    }
    _drawRegionsults(e2) {
      let t2, i3, n2;
      if (this.beingLazyDrawRegionsults = false, this.singleFrameMode) {
        if (!this.oriCanvas)
          return;
        t2 = "contain", i3 = this.oriCanvas.width, n2 = this.oriCanvas.height;
      } else {
        if (!this.dce.video)
          return;
        t2 = this.dce.video.style.objectFit || "contain", i3 = this.dce.video.videoWidth, n2 = this.dce.video.videoHeight;
      }
      let r2 = this.region;
      if (r2 && (!r2.regionLeft && !r2.regionRight && !r2.regionTop && !r2.regionBottom && !r2.regionMeasuredByPercentage || r2 instanceof Array ? r2 = null : r2.regionMeasuredByPercentage ? r2 = r2.regionLeft || r2.regionRight || r2.regionTop !== 100 || r2.regionBottom !== 100 ? {regionLeft: Math.round(r2.regionLeft / 100 * i3), regionTop: Math.round(r2.regionTop / 100 * n2), regionRight: Math.round(r2.regionRight / 100 * i3), regionBottom: Math.round(r2.regionBottom / 100 * n2)} : null : (r2 = JSON.parse(JSON.stringify(r2)), delete r2.regionMeasuredByPercentage)), this._cvsDrawArea) {
        this._cvsDrawArea.style.objectFit = t2;
        let s3 = this._cvsDrawArea;
        s3.width = i3, s3.height = n2;
        let o3 = s3.getContext("2d");
        if (r2) {
          o3.fillStyle = this.regionMaskFillStyle, o3.fillRect(0, 0, s3.width, s3.height), o3.globalCompositeOperation = "destination-out", o3.fillStyle = "#000";
          let e3 = Math.round(this.regionMaskLineWidth / 2);
          o3.fillRect(r2.regionLeft - e3, r2.regionTop - e3, r2.regionRight - r2.regionLeft + 2 * e3, r2.regionBottom - r2.regionTop + 2 * e3), o3.globalCompositeOperation = "source-over", o3.strokeStyle = this.regionMaskStrokeStyle, o3.lineWidth = this.regionMaskLineWidth, o3.rect(r2.regionLeft, r2.regionTop, r2.regionRight - r2.regionLeft, r2.regionBottom - r2.regionTop), o3.stroke();
        }
        if (e2) {
          o3.globalCompositeOperation = "destination-over", o3.fillStyle = this.barcodeFillStyle, o3.strokeStyle = this.barcodeStrokeStyle, o3.lineWidth = this.barcodeLineWidth, e2 = e2 || [];
          for (let t3 of e2) {
            let e3 = t3.localizationResult;
            o3.beginPath(), o3.moveTo(e3.x1, e3.y1), o3.lineTo(e3.x2, e3.y2), o3.lineTo(e3.x3, e3.y3), o3.lineTo(e3.x4, e3.y4), o3.fill(), o3.beginPath(), o3.moveTo(e3.x1, e3.y1), o3.lineTo(e3.x2, e3.y2), o3.lineTo(e3.x3, e3.y3), o3.lineTo(e3.x4, e3.y4), o3.closePath(), o3.stroke();
          }
        }
        this.singleFrameMode && (o3.globalCompositeOperation = "destination-over", o3.drawImage(this.oriCanvas, 0, 0));
      }
      if (this._divScanArea && this.dce.video) {
        let e3 = this.dce.video.offsetWidth, t3 = this.dce.video.offsetHeight, s3 = 1;
        e3 / t3 < i3 / n2 ? (s3 = e3 / i3, this._divScanArea.style.left = "0", this._divScanArea.style.top = Math.round((t3 - n2 * s3) / 2) + "px") : (s3 = t3 / n2, this._divScanArea.style.left = Math.round((e3 - i3 * s3) / 2) + "px", this._divScanArea.style.top = "0");
        let o3 = r2 ? Math.round(r2.regionLeft * s3) : 0, a2 = r2 ? Math.round(r2.regionTop * s3) : 0, d2 = r2 ? Math.round(r2.regionRight * s3 - o3) : Math.round(i3 * s3), _2 = r2 ? Math.round(r2.regionBottom * s3 - a2) : Math.round(n2 * s3);
        this._divScanArea.style.marginLeft = o3 + "px", this._divScanArea.style.marginTop = a2 + "px", this._divScanArea.style.width = d2 + "px", this._divScanArea.style.height = _2 + "px";
      }
    }
    _clearRegionsults() {
      this._cvsDrawArea && (this._cvsDrawArea.width = this._cvsDrawArea.height = 0);
    }
    open() {
      return i2(this, void 0, void 0, function* () {
        this._bindUI();
        let e2 = yield this.play();
        return this.singleFrameMode || (this._loopReadVideoTimeoutId && clearTimeout(this._loopReadVideoTimeoutId), this._drawRegionsults(), this._loopReadVideo()), e2;
      });
    }
    openVideo() {
      return i2(this, void 0, void 0, function* () {
        this._bindUI();
        let e2 = yield this.play();
        return this._bPauseScan = true, this.singleFrameMode || (this._loopReadVideoTimeoutId && clearTimeout(this._loopReadVideoTimeoutId), this._drawRegionsults(), this._loopReadVideo()), e2;
      });
    }
    close() {
      return i2(this, void 0, void 0, function* () {
        this.stop(), this._unbindUI(), this._bPauseScan = false;
      });
    }
    show() {
      return i2(this, void 0, void 0, function* () {
        this._bindUI(), this._show();
        let e2 = yield this.play();
        return this.singleFrameMode || (this._loopReadVideoTimeoutId && clearTimeout(this._loopReadVideoTimeoutId), this._drawRegionsults(), this._loopReadVideo()), e2;
      });
    }
    showVideo() {
      return i2(this, void 0, void 0, function* () {
        this._bindUI(), this._show();
        let e2 = yield this.play();
        return this._bPauseScan = true, this.singleFrameMode || (this._loopReadVideoTimeoutId && clearTimeout(this._loopReadVideoTimeoutId), this._drawRegionsults(), this._loopReadVideo()), e2;
      });
    }
    hide() {
      return i2(this, void 0, void 0, function* () {
        this.stop(), this._unbindUI(), this._bPauseScan = false, this.getUIElement().style.display = "none";
      });
    }
    destroy() {
      return this.destroyContext();
    }
    destroyContext() {
      const e2 = Object.create(null, {destroyContext: {get: () => super.destroyContext}});
      return i2(this, void 0, void 0, function* () {
        yield this.close(), this.bDestroyed || (yield e2.destroyContext.call(this));
      });
    }
  };
  var c;
  var u;
  var h;
  var g;
  var R;
  var E;
  var I;
  var A;
  var S;
  var D;
  var f;
  var m;
  var T;
  var M;
  var C;
  var L;
  var O;
  var N;
  var y;
  var B;
  var p;
  var v;
  var b;
  var F;
  var P;
  var w;
  var V;
  l._defaultUIElementURL = "@engineResourcePath/dbr.scanner.html", l.singlePresetRegion = [null, {regionLeft: 0, regionTop: 30, regionRight: 100, regionBottom: 70, regionMeasuredByPercentage: 1}, {regionLeft: 25, regionTop: 25, regionRight: 75, regionBottom: 75, regionMeasuredByPercentage: 1}, {regionLeft: 25, regionTop: 25, regionRight: 75, regionBottom: 75, regionMeasuredByPercentage: 1}], function(e2) {
    e2[e2.BICM_DARK_ON_LIGHT = 1] = "BICM_DARK_ON_LIGHT", e2[e2.BICM_LIGHT_ON_DARK = 2] = "BICM_LIGHT_ON_DARK", e2[e2.BICM_DARK_ON_DARK = 4] = "BICM_DARK_ON_DARK", e2[e2.BICM_LIGHT_ON_LIGHT = 8] = "BICM_LIGHT_ON_LIGHT", e2[e2.BICM_DARK_LIGHT_MIXED = 16] = "BICM_DARK_LIGHT_MIXED", e2[e2.BICM_DARK_ON_LIGHT_DARK_SURROUNDING = 32] = "BICM_DARK_ON_LIGHT_DARK_SURROUNDING", e2[e2.BICM_SKIP = 0] = "BICM_SKIP", e2[e2.BICM_REV = 2147483648] = "BICM_REV";
  }(c || (c = {})), function(e2) {
    e2[e2.BCM_AUTO = 1] = "BCM_AUTO", e2[e2.BCM_GENERAL = 2] = "BCM_GENERAL", e2[e2.BCM_SKIP = 0] = "BCM_SKIP", e2[e2.BCM_REV = 2147483648] = "BCM_REV";
  }(u || (u = {})), function(e2) {
    e2[e2.BF2_NULL = 0] = "BF2_NULL", e2[e2.BF2_POSTALCODE = 32505856] = "BF2_POSTALCODE", e2[e2.BF2_NONSTANDARD_BARCODE = 1] = "BF2_NONSTANDARD_BARCODE", e2[e2.BF2_USPSINTELLIGENTMAIL = 1048576] = "BF2_USPSINTELLIGENTMAIL", e2[e2.BF2_POSTNET = 2097152] = "BF2_POSTNET", e2[e2.BF2_PLANET = 4194304] = "BF2_PLANET", e2[e2.BF2_AUSTRALIANPOST = 8388608] = "BF2_AUSTRALIANPOST", e2[e2.BF2_RM4SCC = 16777216] = "BF2_RM4SCC", e2[e2.BF2_DOTCODE = 2] = "BF2_DOTCODE";
  }(h || (h = {})), function(e2) {
    e2[e2.BM_AUTO = 1] = "BM_AUTO", e2[e2.BM_LOCAL_BLOCK = 2] = "BM_LOCAL_BLOCK", e2[e2.BM_SKIP = 0] = "BM_SKIP", e2[e2.BM_THRESHOLD = 4] = "BM_THRESHOLD", e2[e2.BM_REV = 2147483648] = "BM_REV";
  }(g || (g = {})), function(e2) {
    e2[e2.ECCM_CONTRAST = 1] = "ECCM_CONTRAST";
  }(R || (R = {})), function(e2) {
    e2[e2.CFM_GENERAL = 1] = "CFM_GENERAL";
  }(E || (E = {})), function(e2) {
    e2[e2.CCM_AUTO = 1] = "CCM_AUTO", e2[e2.CCM_GENERAL_HSV = 2] = "CCM_GENERAL_HSV", e2[e2.CCM_SKIP = 0] = "CCM_SKIP", e2[e2.CCM_REV = 2147483648] = "CCM_REV";
  }(I || (I = {})), function(e2) {
    e2[e2.CICM_GENERAL = 1] = "CICM_GENERAL", e2[e2.CICM_SKIP = 0] = "CICM_SKIP", e2[e2.CICM_REV = 2147483648] = "CICM_REV";
  }(A || (A = {})), function(e2) {
    e2[e2.CM_IGNORE = 1] = "CM_IGNORE", e2[e2.CM_OVERWRITE = 2] = "CM_OVERWRITE";
  }(S || (S = {})), function(e2) {
    e2[e2.DM_SKIP = 0] = "DM_SKIP", e2[e2.DM_DIRECT_BINARIZATION = 1] = "DM_DIRECT_BINARIZATION", e2[e2.DM_THRESHOLD_BINARIZATION = 2] = "DM_THRESHOLD_BINARIZATION", e2[e2.DM_GRAY_EQUALIZATION = 4] = "DM_GRAY_EQUALIZATION", e2[e2.DM_SMOOTHING = 8] = "DM_SMOOTHING", e2[e2.DM_MORPHING = 16] = "DM_MORPHING", e2[e2.DM_DEEP_ANALYSIS = 32] = "DM_DEEP_ANALYSIS", e2[e2.DM_SHARPENING = 64] = "DM_SHARPENING", e2[e2.DM_BASED_ON_LOC_BIN = 128] = "DM_BASED_ON_LOC_BIN", e2[e2.DM_SHARPENING_SMOOTHING = 256] = "DM_SHARPENING_SMOOTHING";
  }(D || (D = {})), function(e2) {
    e2[e2.DRM_AUTO = 1] = "DRM_AUTO", e2[e2.DRM_GENERAL = 2] = "DRM_GENERAL", e2[e2.DRM_SKIP = 0] = "DRM_SKIP", e2[e2.DRM_REV = 2147483648] = "DRM_REV";
  }(f || (f = {})), function(e2) {
    e2[e2.DPMCRM_AUTO = 1] = "DPMCRM_AUTO", e2[e2.DPMCRM_GENERAL = 2] = "DPMCRM_GENERAL", e2[e2.DPMCRM_SKIP = 0] = "DPMCRM_SKIP", e2[e2.DPMCRM_REV = 2147483648] = "DPMCRM_REV";
  }(m || (m = {})), function(e2) {
    e2[e2.GTM_INVERTED = 1] = "GTM_INVERTED", e2[e2.GTM_ORIGINAL = 2] = "GTM_ORIGINAL", e2[e2.GTM_SKIP = 0] = "GTM_SKIP", e2[e2.GTM_REV = 2147483648] = "GTM_REV";
  }(T || (T = {})), function(e2) {
    e2[e2.IPM_AUTO = 1] = "IPM_AUTO", e2[e2.IPM_GENERAL = 2] = "IPM_GENERAL", e2[e2.IPM_GRAY_EQUALIZE = 4] = "IPM_GRAY_EQUALIZE", e2[e2.IPM_GRAY_SMOOTH = 8] = "IPM_GRAY_SMOOTH", e2[e2.IPM_SHARPEN_SMOOTH = 16] = "IPM_SHARPEN_SMOOTH", e2[e2.IPM_MORPHOLOGY = 32] = "IPM_MORPHOLOGY", e2[e2.IPM_SKIP = 0] = "IPM_SKIP", e2[e2.IPM_REV = 2147483648] = "IPM_REV";
  }(M || (M = {})), function(e2) {
    e2[e2.IRSM_MEMORY = 1] = "IRSM_MEMORY", e2[e2.IRSM_FILESYSTEM = 2] = "IRSM_FILESYSTEM", e2[e2.IRSM_BOTH = 4] = "IRSM_BOTH";
  }(C || (C = {})), function(e2) {
    e2[e2.IRT_NO_RESULT = 0] = "IRT_NO_RESULT", e2[e2.IRT_ORIGINAL_IMAGE = 1] = "IRT_ORIGINAL_IMAGE", e2[e2.IRT_COLOUR_CLUSTERED_IMAGE = 2] = "IRT_COLOUR_CLUSTERED_IMAGE", e2[e2.IRT_COLOUR_CONVERTED_GRAYSCALE_IMAGE = 4] = "IRT_COLOUR_CONVERTED_GRAYSCALE_IMAGE", e2[e2.IRT_TRANSFORMED_GRAYSCALE_IMAGE = 8] = "IRT_TRANSFORMED_GRAYSCALE_IMAGE", e2[e2.IRT_PREDETECTED_REGION = 16] = "IRT_PREDETECTED_REGION", e2[e2.IRT_PREPROCESSED_IMAGE = 32] = "IRT_PREPROCESSED_IMAGE", e2[e2.IRT_BINARIZED_IMAGE = 64] = "IRT_BINARIZED_IMAGE", e2[e2.IRT_TEXT_ZONE = 128] = "IRT_TEXT_ZONE", e2[e2.IRT_CONTOUR = 256] = "IRT_CONTOUR", e2[e2.IRT_LINE_SEGMENT = 512] = "IRT_LINE_SEGMENT", e2[e2.IRT_FORM = 1024] = "IRT_FORM", e2[e2.IRT_SEGMENTATION_BLOCK = 2048] = "IRT_SEGMENTATION_BLOCK", e2[e2.IRT_TYPED_BARCODE_ZONE = 4096] = "IRT_TYPED_BARCODE_ZONE", e2[e2.IRT_PREDETECTED_QUADRILATERAL = 8192] = "IRT_PREDETECTED_QUADRILATERAL";
  }(L || (L = {})), function(e2) {
    e2[e2.LM_SKIP = 0] = "LM_SKIP", e2[e2.LM_AUTO = 1] = "LM_AUTO", e2[e2.LM_CONNECTED_BLOCKS = 2] = "LM_CONNECTED_BLOCKS", e2[e2.LM_LINES = 8] = "LM_LINES", e2[e2.LM_STATISTICS = 4] = "LM_STATISTICS", e2[e2.LM_SCAN_DIRECTLY = 16] = "LM_SCAN_DIRECTLY", e2[e2.LM_STATISTICS_MARKS = 32] = "LM_STATISTICS_MARKS", e2[e2.LM_STATISTICS_POSTAL_CODE = 64] = "LM_STATISTICS_POSTAL_CODE", e2[e2.LM_CENTRE = 128] = "LM_CENTRE", e2[e2.LM_ONED_FAST_SCAN = 256] = "LM_ONED_FAST_SCAN", e2[e2.LM_REV = 2147483648] = "LM_REV";
  }(O || (O = {})), function(e2) {
    e2[e2.PDFRM_RASTER = 1] = "PDFRM_RASTER", e2[e2.PDFRM_AUTO = 2] = "PDFRM_AUTO", e2[e2.PDFRM_VECTOR = 4] = "PDFRM_VECTOR", e2[e2.PDFRM_REV = 2147483648] = "PDFRM_REV";
  }(N || (N = {})), function(e2) {
    e2[e2.QRECL_ERROR_CORRECTION_H = 0] = "QRECL_ERROR_CORRECTION_H", e2[e2.QRECL_ERROR_CORRECTION_L = 1] = "QRECL_ERROR_CORRECTION_L", e2[e2.QRECL_ERROR_CORRECTION_M = 2] = "QRECL_ERROR_CORRECTION_M", e2[e2.QRECL_ERROR_CORRECTION_Q = 3] = "QRECL_ERROR_CORRECTION_Q";
  }(y || (y = {})), function(e2) {
    e2[e2.RPM_AUTO = 1] = "RPM_AUTO", e2[e2.RPM_GENERAL = 2] = "RPM_GENERAL", e2[e2.RPM_GENERAL_RGB_CONTRAST = 4] = "RPM_GENERAL_RGB_CONTRAST", e2[e2.RPM_GENERAL_GRAY_CONTRAST = 8] = "RPM_GENERAL_GRAY_CONTRAST", e2[e2.RPM_GENERAL_HSV_CONTRAST = 16] = "RPM_GENERAL_HSV_CONTRAST", e2[e2.RPM_SKIP = 0] = "RPM_SKIP", e2[e2.RPM_REV = 2147483648] = "RPM_REV";
  }(B || (B = {})), function(e2) {
    e2[e2.RCT_PIXEL = 1] = "RCT_PIXEL", e2[e2.RCT_PERCENTAGE = 2] = "RCT_PERCENTAGE";
  }(p || (p = {})), function(e2) {
    e2[e2.RT_STANDARD_TEXT = 0] = "RT_STANDARD_TEXT", e2[e2.RT_RAW_TEXT = 1] = "RT_RAW_TEXT", e2[e2.RT_CANDIDATE_TEXT = 2] = "RT_CANDIDATE_TEXT", e2[e2.RT_PARTIAL_TEXT = 3] = "RT_PARTIAL_TEXT";
  }(v || (v = {})), function(e2) {
    e2[e2.SUM_AUTO = 1] = "SUM_AUTO", e2[e2.SUM_LINEAR_INTERPOLATION = 2] = "SUM_LINEAR_INTERPOLATION", e2[e2.SUM_NEAREST_NEIGHBOUR_INTERPOLATION = 4] = "SUM_NEAREST_NEIGHBOUR_INTERPOLATION", e2[e2.SUM_SKIP = 0] = "SUM_SKIP", e2[e2.SUM_REV = 2147483648] = "SUM_REV";
  }(b || (b = {})), function(e2) {
    e2[e2.TP_REGION_PREDETECTED = 1] = "TP_REGION_PREDETECTED", e2[e2.TP_IMAGE_PREPROCESSED = 2] = "TP_IMAGE_PREPROCESSED", e2[e2.TP_IMAGE_BINARIZED = 4] = "TP_IMAGE_BINARIZED", e2[e2.TP_BARCODE_LOCALIZED = 8] = "TP_BARCODE_LOCALIZED", e2[e2.TP_BARCODE_TYPE_DETERMINED = 16] = "TP_BARCODE_TYPE_DETERMINED", e2[e2.TP_BARCODE_RECOGNIZED = 32] = "TP_BARCODE_RECOGNIZED";
  }(F || (F = {})), function(e2) {
    e2[e2.TFM_AUTO = 1] = "TFM_AUTO", e2[e2.TFM_GENERAL_CONTOUR = 2] = "TFM_GENERAL_CONTOUR", e2[e2.TFM_SKIP = 0] = "TFM_SKIP", e2[e2.TFM_REV = 2147483648] = "TFM_REV";
  }(P || (P = {})), function(e2) {
    e2[e2.TROM_CONFIDENCE = 1] = "TROM_CONFIDENCE", e2[e2.TROM_POSITION = 2] = "TROM_POSITION", e2[e2.TROM_FORMAT = 4] = "TROM_FORMAT", e2[e2.TROM_SKIP = 0] = "TROM_SKIP", e2[e2.TROM_REV = 2147483648] = "TROM_REV";
  }(w || (w = {})), function(e2) {
    e2[e2.TDM_AUTO = 1] = "TDM_AUTO", e2[e2.TDM_GENERAL_WIDTH_CONCENTRATION = 2] = "TDM_GENERAL_WIDTH_CONCENTRATION", e2[e2.TDM_SKIP = 0] = "TDM_SKIP", e2[e2.TDM_REV = 2147483648] = "TDM_REV";
  }(V || (V = {}));
  var U = class {
    static get version() {
      return _.version;
    }
    static get productKeys() {
      return _.productKeys;
    }
    static set productKeys(e2) {
      _.productKeys = e2;
    }
    static get handshakeCode() {
      return _.handshakeCode;
    }
    static set handshakeCode(e2) {
      _.handshakeCode = e2;
    }
    static get organizationID() {
      return _.organizationID;
    }
    static set organizationID(e2) {
      _.organizationID = e2;
    }
    static get sessionPassword() {
      return _.sessionPassword;
    }
    static set sessionPassword(e2) {
      _.sessionPassword = e2;
    }
    static get browserInfo() {
      return _.browserInfo;
    }
    static detectEnvironment() {
      return _.detectEnvironment();
    }
    static get _workerName() {
      return _._workerName;
    }
    static set _workerName(e2) {
      _._workerName = e2;
    }
    static get engineResourcePath() {
      return _.engineResourcePath;
    }
    static set engineResourcePath(e2) {
      _.engineResourcePath = e2;
    }
    static get licenseServer() {
      return _.licenseServer;
    }
    static set licenseServer(e2) {
      _.licenseServer = e2;
    }
    static get deviceFriendlyName() {
      return _.deviceFriendlyName;
    }
    static set deviceFriendlyName(e2) {
      _.deviceFriendlyName = e2;
    }
    static get _onLog() {
      return _._onLog;
    }
    static set _onLog(e2) {
      _._onLog = e2;
    }
    static get _bWasmDebug() {
      return _._bWasmDebug;
    }
    static set _bWasmDebug(e2) {
      _._bWasmDebug = e2;
    }
    static get _bUseFullFeature() {
      return _._bUseFullFeature;
    }
    static set _bUseFullFeature(e2) {
      _._bUseFullFeature = e2;
    }
    static get _dbrWorker() {
      return _._dbrWorker;
    }
    static isLoaded() {
      return _.isLoaded();
    }
    static isWasmLoaded() {
      return _.isLoaded();
    }
    static loadWasm() {
      return _.loadWasm();
    }
  };
  U.DBR = U, U.BarcodeReader = _, U.BarcodeScanner = l, U.CameraEnhancer = o, U.EnumBarcodeColourMode = c, U.EnumBarcodeComplementMode = u, U.EnumBarcodeFormat = o2, U.EnumBarcodeFormat_2 = h, U.EnumBinarizationMode = g, U.EnumClarityCalculationMethod = R, U.EnumClarityFilterMode = E, U.EnumColourClusteringMode = I, U.EnumColourConversionMode = A, U.EnumConflictMode = S, U.EnumDeblurMode = D, U.EnumDeformationResistingMode = f, U.EnumDPMCodeReadingMode = m, U.EnumErrorCode = r, U.EnumGrayscaleTransformationMode = T, U.EnumImagePixelFormat = n, U.EnumImagePreprocessingMode = M, U.EnumIMResultDataType = s2, U.EnumIntermediateResultSavingMode = C, U.EnumIntermediateResultType = L, U.EnumLocalizationMode = O, U.EnumPDFReadingMode = N, U.EnumQRCodeErrorCorrectionLevel = y, U.EnumRegionPredetectionMode = B, U.EnumResultCoordinateType = p, U.EnumResultType = v, U.EnumScaleUpMode = b, U.EnumTerminatePhase = F, U.EnumTextFilterMode = P, U.EnumTextResultOrderMode = w, U.EnumTextureDetectionMode = V;

  // ../e_dispatch/e_dispatch/public/js/dbr.js
  _.engineResourcePath = "https://cdn.jsdelivr.net/npm/dynamsoft-javascript-barcode@9.3.1/dist/";
  _.license = "DLS2eyJoYW5kc2hha2VDb2RlIjoiMTAxNTA3MDI4LVRYbFhaV0pRY205cVgyUmljZyIsIm9yZ2FuaXphdGlvbklEIjoiMTAxNTA3MDI4IiwiY2hlY2tDb2RlIjotOTE0NDIyMjIzfQ==";

  // ../e_dispatch/e_dispatch/public/js/dcp.js
  var import_dynamsoft_code_parser = __toModule(require_dcp());
  import_dynamsoft_code_parser.CodeParser.engineResourcePath = "https://cdn.jsdelivr.net/npm/dynamsoft-code-parser@1.1.0/dist/";
  import_dynamsoft_code_parser.CodeParser.license = "DLS2eyJoYW5kc2hha2VDb2RlIjoiMTAxNTA3MDI4LVRYbFhaV0pRY205cVgyUmljZyIsIm9yZ2FuaXphdGlvbklEIjoiMTAxNTA3MDI4IiwiY2hlY2tDb2RlIjotOTE0NDIyMjIzfQ==";
  (async () => {
    try {
      await import_dynamsoft_code_parser.CodeParser.loadWasm();
    } catch (ex) {
      const msg = ex.message || ex;
      console.error(msg);
      alert(msg);
    }
  })();
})();
/*!
 * Dynamsoft JavaScript Library
 * @product Dynamsoft Barcode Reader JS Edition
 * @website http://www.dynamsoft.com
 * @copyright Copyright 2022, Dynamsoft Corporation
 * @author Dynamsoft
 * @version 8.8.7 (js 20220125)
 * @fileoverview Dynamsoft JavaScript Library for Barcode Reader
 * More info on DBR JS: https://www.dynamsoft.com/barcode-reader/sdk-javascript/
 */
/*!
 * Dynamsoft JavaScript Library
 * @product Dynamsoft Camera Enhancer JS Edition
 * @website http://www.dynamsoft.com
 * @copyright Copyright 2021, Dynamsoft Corporation
 * @author Dynamsoft
 * @version 2.0.3 (js 20210628)
 * @fileoverview Dynamsoft JavaScript Library for Camera Enhancer
 * More info on DBR JS: https://www.dynamsoft.com/barcode-reader/sdk-javascript/
 */
/*!
 * Dynamsoft JavaScript Library
 * @product Dynamsoft Code Parser JS Edition
 * @website http://www.dynamsoft.com
 * @copyright Copyright 2022, Dynamsoft Corporation
 * @author Dynamsoft
 * @version 1.1.0 (js 20220708)
 * @fileoverview Dynamsoft JavaScript Library for Barcode Reader
 * More info on dcp JS: https://www.dynamsoft.com/code-parser/sdk-javascript/
 */
//# sourceMappingURL=edispatch.bundle.5UBMYBZP.js.map
