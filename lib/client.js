window.__ModuleLoader__.load({id:"dsh-github-studio",factory:(require)=>{var module={exports:{}};var exports=module.exports;
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client.jsx
var client_exports = {};
__export(client_exports, {
  GitHubIcon: () => GitHubIcon,
  GitHubSettings: () => GitHubSettings,
  apply: () => apply,
  inject: () => inject,
  name: () => name
});
module.exports = __toCommonJS(client_exports);
var import_react5 = __toESM(require("react"), 1);

// src/style.css
var style_default = '.dsh-github{font:14px/1.6 -apple-system,BlinkMacSystemFont,"Segoe UI","Microsoft YaHei",sans-serif;color:var(--text-primary,#1f2328);width:100%;padding:2px 0 24px;box-sizing:border-box;--gh-line:#e6e9ef;--gh-soft:#f6f7f9;--gh-muted:#68717f;--gh-blue:#4169e1}\n.dsh-github *{box-sizing:border-box}.dsh-github h2,.dsh-github h3,.dsh-github p{margin:0}.dsh-github h2{font-size:22px;font-weight:600}.dsh-github h3{font-size:15px;font-weight:600;margin:16px 0 10px}.gh-header,.gh-row,.gh-title,.gh-actions,.gh-account,.gh-attachment{display:flex;align-items:center;gap:10px}.gh-header,.gh-row,.gh-attachment{justify-content:space-between}.gh-title{gap:12px}.gh-intro{color:var(--gh-muted);margin:10px 0 22px!important}.dsh-github button,.gh-upload{font:inherit;cursor:pointer;border:1px solid var(--gh-line);background:transparent;color:inherit;border-radius:8px;padding:7px 13px;transition:background .15s}.dsh-github button:hover,.gh-upload:hover{background:var(--gh-soft)}.dsh-github button:disabled,.gh-disabled{opacity:.55;cursor:wait}.dsh-github .gh-primary{background:var(--gh-blue);border-color:var(--gh-blue);color:#fff}.dsh-github .gh-primary:hover{background:#3159cd}.dsh-github button:focus-visible,.dsh-github input:focus-visible,.dsh-github select:focus-visible,.dsh-github textarea:focus-visible,.gh-upload:focus-within{outline:2px solid var(--gh-blue);outline-offset:3px}.dsh-github a{color:var(--gh-blue);text-decoration:none;overflow-wrap:anywhere}.dsh-github a:hover{text-decoration:underline}.gh-account{padding:16px 0 20px;border-bottom:1px solid var(--gh-line)}.gh-account img{width:42px;height:42px;border-radius:50%}.gh-account>div{flex:1}.gh-account strong,.gh-account span{display:block}.gh-account span{color:var(--gh-muted);font-size:12px}.gh-account i{display:inline-block;width:6px;height:6px;border-radius:50%;background:#26834a;margin:0 4px 1px}.gh-connect{background:var(--gh-soft);padding:20px;border-radius:10px;margin-bottom:20px}.gh-connect p{color:var(--gh-muted);margin-top:6px}.gh-device{margin-top:14px;display:flex;flex-direction:column;align-items:flex-start;gap:6px}.gh-device>strong{font:600 22px/1.7 Consolas,monospace;letter-spacing:3px;color:var(--text-primary,#1f2328)}.gh-tabs{display:flex;border-bottom:1px solid var(--gh-line);gap:22px;margin-top:14px}.gh-tabs button{border:0;border-radius:0;color:var(--gh-muted);padding:12px 0;border-bottom:2px solid transparent}.gh-tabs button[aria-current]{color:var(--gh-blue);border-bottom-color:var(--gh-blue)}.gh-tabs button:hover{background:transparent;color:var(--gh-blue)}.gh-pending{width:100%;text-align:left;background:#f0f4ff!important;color:#3255af!important;margin-top:14px}.gh-empty{padding:42px 14px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:10px;color:var(--gh-muted)}.gh-empty strong{color:var(--text-primary,#1f2328);font-weight:500}.gh-empty p{max-width:340px;font-size:13px}.gh-empty svg{opacity:.45;margin-bottom:4px}.gh-section-title{margin:14px 0}.gh-section-title h3{margin:0}.gh-repositories{display:grid;gap:10px}.dsh-github .gh-repo{width:100%;text-align:left;padding:15px 16px}.gh-repo strong{font-weight:600;color:var(--gh-blue)}.gh-repo p{color:var(--gh-muted);margin:5px 0;font-size:13px}.gh-repo small{color:var(--gh-muted)}.gh-badge{border:1px solid var(--gh-line);border-radius:20px;font-size:11px;color:var(--gh-muted);padding:1px 8px;white-space:nowrap}.gh-success{color:#22733e;background:#eef8f0;border-color:#d4e8d9}.gh-failed{color:#b42318;background:#fff3f1;border-color:#f4d8d3}.gh-form{display:grid;gap:13px;padding:16px 0 20px;border-bottom:1px solid var(--gh-line)}.gh-field{display:grid;gap:5px}.gh-field>span{font-size:13px;color:var(--gh-muted)}.dsh-github input:not([type=checkbox]):not([type=file]),.dsh-github select,.dsh-github textarea{font:inherit;width:100%;padding:8px 10px;border:1px solid var(--gh-line);border-radius:7px;background:var(--input-background,transparent);color:inherit}.dsh-github textarea{resize:vertical;min-height:90px}.gh-check{display:flex;align-items:center;gap:7px;font-size:13px}.gh-check input{accent-color:var(--gh-blue)}.gh-form>.gh-primary{justify-self:start}.gh-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.dsh-github .gh-back{border:0;padding:4px 0;margin-bottom:12px;color:var(--gh-muted)}.gh-repo-heading{display:flex;align-items:center;gap:10px}.gh-branch{display:flex;align-items:center;gap:8px;margin:14px 0}.gh-branch label{display:flex;align-items:center;gap:8px;flex:1}.gh-branch input{flex:1;min-width:0}.gh-breadcrumb{display:flex;justify-content:space-between;align-items:center;background:var(--gh-soft);padding:8px 12px;overflow-wrap:anywhere;border-radius:6px}.gh-breadcrumb button{font-size:12px;padding:2px 7px}.gh-files{display:grid;margin-top:7px}.gh-files button{display:flex;align-items:center;text-align:left;gap:10px;border:0;border-bottom:1px solid var(--gh-line);border-radius:0;padding:10px 8px}.gh-files button>span:nth-child(2){flex:1;overflow-wrap:anywhere}.gh-files small{color:var(--gh-muted);font-size:11px}.gh-code,.gh-operation pre{font:12px/1.7 Consolas,"Cascadia Mono",monospace;white-space:pre-wrap;overflow-wrap:anywhere;max-height:440px;overflow:auto;padding:13px;background:var(--gh-soft);border-radius:6px}.gh-operation{padding:17px 0;border-bottom:1px solid var(--gh-line)}.gh-operation .gh-target{font-size:15px;font-weight:500;margin:7px 0;overflow-wrap:anywhere}.gh-operation p{font-size:13px;margin:8px 0;color:var(--gh-muted)}.gh-operation .gh-actions{margin-top:13px}.gh-operation details{margin:9px 0}.gh-operation summary{cursor:pointer;font-size:13px;overflow-wrap:anywhere}.gh-release{padding:14px 0;border-bottom:1px solid var(--gh-line);display:grid;gap:6px}.gh-release>small{color:var(--gh-muted)}.gh-download{display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:13px}.gh-asset-publish{display:flex;gap:8px;margin-top:8px}.gh-asset-publish select{min-width:0;flex:1}.gh-asset-publish button{white-space:nowrap}.gh-attachments{margin-top:16px}.gh-upload{font-size:13px;white-space:nowrap}.gh-upload input{display:none}.gh-attachment{border-bottom:1px solid var(--gh-line);padding:12px 0}.gh-attachment>div{min-width:0}.gh-attachment strong{font-size:13px;font-weight:500;overflow-wrap:anywhere}.gh-attachment small{display:block;color:var(--gh-muted);font-size:12px}.gh-muted{color:var(--gh-muted);font-size:12px;margin:10px 0!important}.gh-errorbox{display:flex;justify-content:space-between;align-items:flex-start;color:#b42318;background:#fff3f1;border-radius:8px;padding:10px 12px;margin:12px 0;overflow-wrap:anywhere}.gh-errorbox button{border:0;padding:0 5px;margin-left:8px}.dsh-github .gh-error{color:#b42318}.gh-working{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--gh-blue);margin-top:16px}.gh-working>span{width:10px;height:10px;border:2px solid #c2cef5;border-top-color:var(--gh-blue);border-radius:50%;animation:gh-spin .7s linear infinite}.gh-footer{font-size:11px;color:var(--gh-muted);margin-top:28px;border-top:1px solid var(--gh-line);padding-top:13px}@keyframes gh-spin{to{transform:rotate(360deg)}}@media(prefers-color-scheme:dark){.dsh-github{--gh-line:#3c414b;--gh-soft:#252931;--gh-muted:#a1a8b4;color:var(--text-primary,#e6e8ed)}.gh-empty strong,.gh-device>strong{color:var(--text-primary,#e6e8ed)}.dsh-github select option{background:#252931;color:#e6e8ed}}@media(max-width:520px){.gh-header{flex-wrap:wrap}.gh-grid{grid-template-columns:1fr}.gh-tabs{gap:16px}.gh-account{flex-wrap:wrap}.gh-asset-publish{flex-wrap:wrap}.gh-actions{flex-wrap:wrap}}@media(prefers-reduced-motion:reduce){.dsh-github *{animation:none!important;transition:none!important}}\n\n.gh-tabs .gh-refresh-repos{margin-left:auto;align-self:center;white-space:nowrap;padding:5px 10px;border:1px solid var(--gh-line);border-radius:7px;font-size:12px;line-height:1.5;min-width:68px;margin-bottom:6px;color:var(--gh-muted)}.gh-tabs .gh-refresh-repos:hover{background:var(--gh-soft)}\n.gh-browser-search{margin:18px 0 8px;padding:0 0 12px;border-bottom:1px solid var(--gh-line)}.gh-search-row{display:flex;gap:8px;align-items:center}.gh-search-row>select{width:84px!important;flex:none}.gh-search-row>input{min-width:0;flex:1}.gh-search-row>button{flex:none;white-space:nowrap}.gh-search-advanced>summary,.gh-search-preview>summary{cursor:pointer;color:var(--gh-muted);font-size:12px}.gh-search-fields{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:12px;margin:12px 0}.gh-search-fields .gh-field{min-width:0}.gh-search-preview{margin-top:8px}.gh-search-preview code{display:block;overflow-wrap:anywhere;white-space:pre-wrap;font-size:12px;background:var(--gh-soft);padding:8px;margin-top:6px}.gh-reset-search{font-size:12px!important}.gh-search-row input{font-size:13px!important}@media(max-width:520px){.gh-search-row{flex-wrap:wrap}.gh-search-row>select{width:72px!important}.gh-search-row>button{margin-left:auto}.gh-search-fields{grid-template-columns:minmax(0,1fr)}}\r\n\n.dsh-github .gh-delete-repo{margin-left:auto;flex-shrink:0;color:#b42318;border-color:#f0cdca;font-size:12px;white-space:nowrap}.dsh-github .gh-delete-repo:hover{background:#fff3f1}.gh-delete-dialog{box-sizing:border-box;border:1px solid var(--gh-line);border-radius:12px;background:var(--modal-background,#fff);color:inherit;width:min(460px,calc(100vw - 32px));max-height:calc(100vh - 48px);overflow:auto;padding:22px;font:inherit;box-shadow:0 16px 48px #0003}.gh-delete-dialog::backdrop{background:#0006}.gh-delete-dialog h3{margin:0 0 12px!important;font-size:17px!important}.gh-delete-dialog p{margin:10px 0!important;line-height:1.7}.gh-delete-target{font-weight:600;overflow-wrap:anywhere}.gh-delete-actions{display:flex;justify-content:flex-end;gap:10px;margin-top:20px;flex-wrap:wrap}.dsh-github .gh-delete-continue{background:#b42318;color:white;border-radius:8px;padding:7px 13px;text-decoration:none}.dsh-github .gh-delete-continue:hover{background:#971d14;text-decoration:none}.gh-delete-continue:focus-visible{outline:2px solid #b42318;outline-offset:3px}@media(prefers-color-scheme:dark){.gh-delete-dialog{background:var(--modal-background,#252931)}}\n.gh-ai-label{display:flex;justify-content:space-between;align-items:center;gap:12px;color:var(--gh-muted);font-size:13px}.gh-ai-label button{font-size:12px;padding:5px 9px;color:var(--gh-blue)}.gh-markdown-toolbar{display:flex;gap:6px;flex-wrap:wrap}.gh-markdown-toolbar button{font-size:12px;padding:4px 8px}.gh-image-insert{display:flex;gap:6px}.gh-image-insert input{min-width:0;flex:1}.gh-image-insert button{white-space:nowrap}.gh-markdown-preview{border:1px solid var(--gh-line);border-radius:8px;padding:14px;max-height:500px;overflow:auto;line-height:1.7}.gh-markdown-preview img{max-width:100%;height:auto}.gh-markdown-preview h1,.gh-markdown-preview h2,.gh-markdown-preview h3{margin:12px 0}.gh-markdown-preview p{margin:8px 0}.gh-markdown-preview blockquote{border-left:3px solid var(--gh-line);margin:8px 0;padding-left:12px;color:var(--gh-muted)}.gh-copy-code{position:relative;margin:10px 0;background:var(--gh-soft);border-radius:7px}.gh-copy-code>button{position:absolute;right:6px;top:6px;font-size:11px;padding:3px 7px}.gh-copy-code pre{padding:36px 12px 12px;white-space:pre-wrap;overflow-wrap:anywhere;overflow:auto;font:12px/1.7 Consolas,monospace}.gh-markdown-preview table{border-collapse:collapse}.gh-markdown-preview td,.gh-markdown-preview th{border:1px solid var(--gh-line);padding:5px 9px}@media(max-width:520px){.gh-ai-label{flex-wrap:wrap}.gh-image-insert{flex-wrap:wrap}}\r\n.dsh-github .gh-muted{overflow-wrap:anywhere}\r\n';

// src/browser-search.jsx
var import_react = __toESM(require("react"), 1);

// src/browser-query.mjs
var qualifier = (key, value) => `${key}:${/\s/.test(value) ? JSON.stringify(value) : value}`;
function browserSearch({ query = "", type = "repositories", language = "", minStars = "", license = "", pushed = "", owner = "", ownerType = "user", repo = "", path = "", symbol = "", visibility = "", sort = "" } = {}) {
  if (!["repositories", "code"].includes(type)) throw Error("\u8BF7\u9009\u62E9\u4ED3\u5E93\u6216\u4EE3\u7801\u641C\u7D22\u3002");
  const q = String(query).trim();
  if (q.length > 2e3 || /[\x00-\x1f\x7f]/.test(q)) throw Error("\u641C\u7D22\u8BED\u53E5\u8FC7\u957F\u6216\u5305\u542B\u65E0\u6548\u5B57\u7B26\u3002");
  const terms = q ? [q] : [];
  const value = (v, label) => {
    v = String(v).trim();
    if (v.length > 200 || /[\x00-\x1f\x7f]/.test(v)) throw Error(`${label}\u683C\u5F0F\u4E0D\u6B63\u786E\u3002`);
    return v;
  };
  if (language.trim()) terms.push(qualifier("language", value(language, "\u8BED\u8A00")));
  if (owner.trim()) {
    if (!["user", "org"].includes(ownerType) || !/^[a-zA-Z0-9-]{1,100}$/.test(owner.trim())) throw Error("\u4F5C\u8005\u6216\u7EC4\u7EC7\u540D\u79F0\u683C\u5F0F\u4E0D\u6B63\u786E\u3002");
    terms.push(qualifier(ownerType, owner.trim()));
  }
  if (visibility) {
    if (!["public", "private"].includes(visibility)) throw Error("\u641C\u7D22\u8303\u56F4\u65E0\u6548\u3002");
    terms.push("is:" + visibility);
  }
  if (type === "repositories") {
    if (minStars !== "") {
      if (!/^\d+$/.test(String(minStars)) || !Number.isSafeInteger(Number(minStars))) throw Error("\u6700\u4F4E Star \u6570\u9700\u8981\u586B\u5199\u975E\u8D1F\u6574\u6570\u3002");
      terms.push("stars:>=" + Number(minStars));
    }
    if (license) {
      if (!["mit", "apache-2.0", "gpl-3.0", "bsd-3-clause", "mpl-2.0", "unlicense"].includes(license)) throw Error("\u8BB8\u53EF\u8BC1\u9009\u9879\u65E0\u6548\u3002");
      terms.push("license:" + license);
    }
    if (pushed) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(pushed) || !Number.isFinite(Date.parse(pushed)) || new Date(pushed).toISOString().slice(0, 10) !== pushed) throw Error("\u66F4\u65B0\u8D77\u59CB\u65E5\u671F\u65E0\u6548\u3002");
      terms.push("pushed:>=" + pushed);
    }
    if (sort && !["stars", "updated", "forks"].includes(sort)) throw Error("\u6392\u5E8F\u9009\u9879\u65E0\u6548\u3002");
  } else {
    if (repo.trim()) {
      const r = value(repo, "\u4ED3\u5E93");
      if (!/^[A-Za-z0-9-]+\/[A-Za-z0-9_.-]+$/.test(r)) throw Error("\u9650\u5B9A\u4ED3\u5E93\u9700\u586B\u5199\u201C\u4F5C\u8005/\u4ED3\u5E93\u540D\u201D\u3002");
      terms.push("repo:" + r);
    }
    if (path.trim()) terms.push(qualifier("path", value(path, "\u6587\u4EF6\u8DEF\u5F84")));
    if (symbol.trim()) terms.push(qualifier("symbol", value(symbol, "\u7B26\u53F7\u540D\u79F0")));
  }
  if (!terms.length) throw Error("\u8BF7\u8F93\u5165\u5173\u952E\u8BCD\u6216\u9009\u62E9\u81F3\u5C11\u4E00\u4E2A\u7B5B\u9009\u6761\u4EF6\u3002");
  const combined = terms.join(" "), url = new URL("https://github.com/search");
  url.searchParams.set("q", combined);
  url.searchParams.set("type", type);
  if (type === "repositories" && sort) {
    url.searchParams.set("s", sort);
    url.searchParams.set("o", "desc");
  }
  return { url: url.href, query: combined, type, sort: type === "repositories" ? sort : "" };
}

// src/browser-search.jsx
var initial = { language: "", minStars: "", license: "", pushed: "", owner: "", ownerType: "user", repo: "", path: "", symbol: "", visibility: "", sort: "" };
function BrowserSearch() {
  const [query, setQuery] = (0, import_react.useState)(""), [type, setType] = (0, import_react.useState)("repositories"), [filters, setFilters] = (0, import_react.useState)(initial), [error, setError] = (0, import_react.useState)("");
  const set = (key, value) => {
    setFilters((old) => ({ ...old, [key]: value }));
    setError("");
  };
  let result = null;
  try {
    result = browserSearch({ query, type, ...filters });
  } catch {
  }
  const field = (key, label, input) => /* @__PURE__ */ import_react.default.createElement("label", { className: "gh-field" }, /* @__PURE__ */ import_react.default.createElement("span", null, label), input ?? /* @__PURE__ */ import_react.default.createElement("input", { "aria-label": label, value: filters[key], onChange: (e) => set(key, e.target.value) }));
  return /* @__PURE__ */ import_react.default.createElement("form", { className: "gh-browser-search", "aria-label": "GitHub \u5B98\u7F51\u641C\u7D22", action: "https://github.com/search", method: "get", target: "_blank", rel: "noopener noreferrer", onSubmit: (e) => {
    try {
      browserSearch({ query, type, ...filters });
      setError("");
    } catch (ex) {
      e.preventDefault();
      setError(ex.message);
    }
  } }, /* @__PURE__ */ import_react.default.createElement("input", { type: "hidden", name: "q", value: result?.query ?? "" }), /* @__PURE__ */ import_react.default.createElement("input", { type: "hidden", name: "type", value: type }), result?.sort && /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement("input", { type: "hidden", name: "s", value: result.sort }), /* @__PURE__ */ import_react.default.createElement("input", { type: "hidden", name: "o", value: "desc" })), /* @__PURE__ */ import_react.default.createElement("div", { className: "gh-search-row" }, /* @__PURE__ */ import_react.default.createElement("select", { "aria-label": "\u641C\u7D22\u7C7B\u578B", value: type, onChange: (e) => {
    setType(e.target.value);
    setError("");
  } }, /* @__PURE__ */ import_react.default.createElement("option", { value: "repositories" }, "\u4ED3\u5E93"), /* @__PURE__ */ import_react.default.createElement("option", { value: "code" }, "\u4EE3\u7801")), /* @__PURE__ */ import_react.default.createElement("input", { "aria-label": "\u641C\u7D22 GitHub", value: query, maxLength: 2e3, onChange: (e) => {
    setQuery(e.target.value);
    setError("");
  }, placeholder: type === "code" ? "\u8F93\u5165\u4EE3\u7801\u5173\u952E\u8BCD\u6216 GitHub \u641C\u7D22\u8BED\u53E5" : "\u641C\u7D22 GitHub \u9879\u76EE\u6216\u8F93\u5165\u641C\u7D22\u6761\u4EF6" }), /* @__PURE__ */ import_react.default.createElement("button", { className: "gh-primary", type: "submit" }, "\u5B98\u7F51\u641C\u7D22 \u2197")), /* @__PURE__ */ import_react.default.createElement("p", { className: "gh-muted" }, "\u5728\u6D4F\u89C8\u5668\u6253\u5F00 GitHub \u5B98\u7F51\uFF0C\u4F7F\u7528\u6D4F\u89C8\u5668\u4E2D\u767B\u5F55\u7684\u8D26\u53F7\u3002"), /* @__PURE__ */ import_react.default.createElement("details", { className: "gh-search-advanced" }, /* @__PURE__ */ import_react.default.createElement("summary", null, "\u9AD8\u7EA7\u7B5B\u9009"), /* @__PURE__ */ import_react.default.createElement("div", { className: "gh-search-fields" }, field("language", "\u7F16\u7A0B\u8BED\u8A00", /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement("input", { "aria-label": "\u7F16\u7A0B\u8BED\u8A00", list: "gh-search-languages", value: filters.language, onChange: (e) => set("language", e.target.value), placeholder: "\u4E0D\u9650" }), /* @__PURE__ */ import_react.default.createElement("datalist", { id: "gh-search-languages" }, ["Python", "JavaScript", "TypeScript", "Go", "Rust", "Java", "C++", "C#"].map((x) => /* @__PURE__ */ import_react.default.createElement("option", { key: x, value: x }))))), field("visibility", "\u641C\u7D22\u8303\u56F4", /* @__PURE__ */ import_react.default.createElement("select", { "aria-label": "\u641C\u7D22\u8303\u56F4", value: filters.visibility, onChange: (e) => set("visibility", e.target.value) }, /* @__PURE__ */ import_react.default.createElement("option", { value: "" }, "\u5B98\u7F51\u9ED8\u8BA4\u8303\u56F4"), /* @__PURE__ */ import_react.default.createElement("option", { value: "public" }, "\u4EC5\u516C\u5F00\u9879\u76EE"), /* @__PURE__ */ import_react.default.createElement("option", { value: "private" }, "\u4EC5\u79C1\u6709\u9879\u76EE"))), field("ownerType", "\u9650\u5B9A\u7C7B\u578B", /* @__PURE__ */ import_react.default.createElement("select", { "aria-label": "\u9650\u5B9A\u7C7B\u578B", value: filters.ownerType, onChange: (e) => set("ownerType", e.target.value) }, /* @__PURE__ */ import_react.default.createElement("option", { value: "user" }, "\u4F5C\u8005"), /* @__PURE__ */ import_react.default.createElement("option", { value: "org" }, "\u7EC4\u7EC7"))), field("owner", "\u4F5C\u8005\u6216\u7EC4\u7EC7\u540D\u79F0"), type === "repositories" ? /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, field("minStars", "\u6700\u4F4E Star \u6570", /* @__PURE__ */ import_react.default.createElement("input", { "aria-label": "\u6700\u4F4E Star \u6570", type: "number", min: "0", step: "1", value: filters.minStars, onChange: (e) => set("minStars", e.target.value), placeholder: "\u4E0D\u9650" })), field("sort", "\u6392\u5E8F\u65B9\u5F0F", /* @__PURE__ */ import_react.default.createElement("select", { "aria-label": "\u6392\u5E8F\u65B9\u5F0F", value: filters.sort, onChange: (e) => set("sort", e.target.value) }, /* @__PURE__ */ import_react.default.createElement("option", { value: "" }, "\u76F8\u5173\u6027"), /* @__PURE__ */ import_react.default.createElement("option", { value: "stars" }, "Star \u6700\u591A"), /* @__PURE__ */ import_react.default.createElement("option", { value: "updated" }, "\u6700\u8FD1\u66F4\u65B0"), /* @__PURE__ */ import_react.default.createElement("option", { value: "forks" }, "Fork \u6700\u591A"))), field("license", "\u5F00\u6E90\u8BB8\u53EF\u8BC1", /* @__PURE__ */ import_react.default.createElement("select", { "aria-label": "\u5F00\u6E90\u8BB8\u53EF\u8BC1", value: filters.license, onChange: (e) => set("license", e.target.value) }, /* @__PURE__ */ import_react.default.createElement("option", { value: "" }, "\u4E0D\u9650"), /* @__PURE__ */ import_react.default.createElement("option", { value: "mit" }, "MIT"), /* @__PURE__ */ import_react.default.createElement("option", { value: "apache-2.0" }, "Apache 2.0"), /* @__PURE__ */ import_react.default.createElement("option", { value: "gpl-3.0" }, "GPL 3.0"), /* @__PURE__ */ import_react.default.createElement("option", { value: "bsd-3-clause" }, "BSD 3-Clause"), /* @__PURE__ */ import_react.default.createElement("option", { value: "mpl-2.0" }, "MPL 2.0"), /* @__PURE__ */ import_react.default.createElement("option", { value: "unlicense" }, "Unlicense"))), field("pushed", "\u6700\u8FD1\u63A8\u9001\u8D77\u59CB\u65E5", /* @__PURE__ */ import_react.default.createElement("input", { "aria-label": "\u6700\u8FD1\u63A8\u9001\u8D77\u59CB\u65E5", type: "date", value: filters.pushed, onChange: (e) => set("pushed", e.target.value) }))) : /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, field("repo", "\u9650\u5B9A\u4ED3\u5E93\uFF08\u4F5C\u8005/\u4ED3\u5E93\u540D\uFF09"), field("path", "\u6587\u4EF6\u8DEF\u5F84"), field("symbol", "\u51FD\u6570\u6216\u7C7B\u540D\uFF08symbol\uFF09"))), /* @__PURE__ */ import_react.default.createElement("button", { type: "button", className: "gh-reset-search", onClick: () => {
    setFilters(initial);
    setError("");
  } }, "\u6E05\u9664\u7B5B\u9009"), /* @__PURE__ */ import_react.default.createElement("p", { className: "gh-muted" }, "\u53EF\u76F4\u63A5\u5728\u641C\u7D22\u6846\u624B\u5199 GitHub \u9AD8\u7EA7\u8BED\u6CD5\uFF1B\u7B5B\u9009\u6761\u4EF6\u4F1A\u8FFD\u52A0\u5230\u8BED\u53E5\u540E\u3002\u4EE3\u7801\u6A21\u5F0F\u8FD8\u652F\u6301\u5B98\u7F51\u7684\u6B63\u5219\u4E0E\u7B26\u53F7\u641C\u7D22\u3002")), result && /* @__PURE__ */ import_react.default.createElement("details", { className: "gh-search-preview" }, /* @__PURE__ */ import_react.default.createElement("summary", null, "\u67E5\u770B\u641C\u7D22\u8BED\u53E5"), /* @__PURE__ */ import_react.default.createElement("code", null, result.query)), error && /* @__PURE__ */ import_react.default.createElement("p", { className: "gh-error", role: "alert" }, error));
}

// src/delete-link.jsx
var import_react2 = __toESM(require("react"), 1);
function repositoryDeleteSettings(repo, login) {
  if (typeof login !== "string" || typeof repo?.owner !== "string" || repo.owner.toLowerCase() !== login.toLowerCase()) return null;
  if (!/^[A-Za-z0-9-]+$/.test(repo.owner) || typeof repo.name !== "string" || !/^(?!\.{1,2}$)[A-Za-z0-9_.-]+$/.test(repo.name)) return null;
  return `https://github.com/${encodeURIComponent(repo.owner)}/${encodeURIComponent(repo.name)}/settings#danger-zone`;
}
function DeleteRepositoryLink({ repo, login, disabled = false }) {
  const dialog = (0, import_react2.useRef)(null), url = repositoryDeleteSettings(repo, login);
  (0, import_react2.useEffect)(() => {
    dialog.current?.close();
  }, [repo?.full_name, login]);
  if (!url) return null;
  return /* @__PURE__ */ import_react2.default.createElement(import_react2.default.Fragment, null, /* @__PURE__ */ import_react2.default.createElement("button", { type: "button", className: "gh-delete-repo", disabled, onClick: () => dialog.current.showModal() }, "\u5220\u9664\u4ED3\u5E93"), /* @__PURE__ */ import_react2.default.createElement("dialog", { className: "gh-delete-dialog", ref: dialog, "aria-labelledby": "gh-delete-title", "aria-describedby": "gh-delete-description", onKeyDown: (e) => {
    if (e.key === "Escape") e.stopPropagation();
  } }, /* @__PURE__ */ import_react2.default.createElement("h3", { id: "gh-delete-title" }, "\u524D\u5F80 GitHub \u5220\u9664\u4ED3\u5E93\uFF1F"), /* @__PURE__ */ import_react2.default.createElement("p", { className: "gh-delete-target" }, repo.owner, "/", repo.name), /* @__PURE__ */ import_react2.default.createElement("p", { id: "gh-delete-description" }, "\u786E\u8BA4\u540E\u5C06\u5728\u6D4F\u89C8\u5668\u6253\u5F00\u8FD9\u4E2A\u4ED3\u5E93\u7684\u8BBE\u7F6E\u9875\u3002\u8BF7\u5728\u5B98\u7F51\u627E\u5230 Danger Zone\uFF08\u5371\u9669\u533A\u57DF\uFF09\uFF0C\u6838\u5BF9\u4ED3\u5E93\u5E76\u6309 GitHub \u7684\u63D0\u793A\u5B8C\u6210\u5220\u9664\u3002"), /* @__PURE__ */ import_react2.default.createElement("p", { className: "gh-muted" }, "\u5220\u9664\u4F1A\u5F71\u54CD\u4ED3\u5E93\u53CA\u76F8\u5173\u53D1\u5E03\uFF0C\u8BF7\u5148\u786E\u8BA4\u662F\u5426\u9700\u8981\u5907\u4EFD\u3002\u6B64\u5904\u786E\u8BA4\u53EA\u4F1A\u6253\u5F00\u7F51\u9875\uFF0C\u4ED3\u5E93\u4E0D\u4F1A\u7ACB\u5373\u5220\u9664\u3002\u5B98\u7F51\u4F7F\u7528\u6D4F\u89C8\u5668\u4E2D\u767B\u5F55\u7684\u8D26\u53F7\u3002"), /* @__PURE__ */ import_react2.default.createElement("div", { className: "gh-delete-actions" }, /* @__PURE__ */ import_react2.default.createElement("button", { type: "button", autoFocus: true, onClick: () => dialog.current.close() }, "\u53D6\u6D88"), /* @__PURE__ */ import_react2.default.createElement("a", { className: "gh-delete-continue", href: url, target: "_blank", rel: "noopener noreferrer", onClick: () => dialog.current.close() }, "\u524D\u5F80\u5B98\u7F51\u5220\u9664"))));
}

// src/new-repository.jsx
var import_react4 = __toESM(require("react"), 1);

// src/repository-name-field.jsx
var import_react3 = __toESM(require("react"), 1);

// src/repository-name.mjs
var repositoryNameHint = "\u4EC5\u652F\u6301\u82F1\u6587\u5B57\u6BCD\u3001\u6570\u5B57\u3001\u8FDE\u5B57\u7B26\uFF08-\uFF09\u3001\u4E0B\u5212\u7EBF\uFF08_\uFF09\u548C\u82F1\u6587\u53E5\u70B9\uFF08.\uFF09\uFF0C\u4E0D\u652F\u6301\u4E2D\u6587\u6216\u7A7A\u683C\uFF0C\u6700\u591A 100 \u4E2A\u5B57\u7B26\u3002";
function repositoryNameError(value) {
  if (typeof value !== "string" || !value) return "\u8BF7\u586B\u5199\u4ED3\u5E93\u540D\u79F0\u3002";
  if (value.length > 100) return "\u4ED3\u5E93\u540D\u79F0\u4E0D\u80FD\u8D85\u8FC7 100 \u4E2A\u5B57\u7B26\u3002";
  if (!/^[A-Za-z0-9_.-]+$/.test(value)) return "\u4ED3\u5E93\u540D\u79F0\u4E0D\u80FD\u5305\u542B\u4E2D\u6587\u3001\u7A7A\u683C\u6216\u5176\u4ED6\u7279\u6B8A\u5B57\u7B26\uFF0C\u8BF7\u4F7F\u7528\u82F1\u6587\u5B57\u6BCD\u3001\u6570\u5B57\u3001-\u3001_ \u6216\u82F1\u6587\u53E5\u70B9\u3002";
  if (value === "." || value === "..") return "\u4ED3\u5E93\u540D\u79F0\u4E0D\u80FD\u4EC5\u4E3A\u4E00\u4E2A\u6216\u4E24\u4E2A\u82F1\u6587\u53E5\u70B9\u3002";
  return "";
}

// src/repository-name-field.jsx
function RepositoryNameField({ action }) {
  const [error, setError] = (0, import_react3.useState)("");
  const validate = (e) => {
    const message = repositoryNameError(e.currentTarget.value);
    e.currentTarget.setCustomValidity(message);
    setError(message);
  };
  return /* @__PURE__ */ import_react3.default.createElement("div", { className: "gh-field" }, /* @__PURE__ */ import_react3.default.createElement("div", { className: "gh-ai-label" }, /* @__PURE__ */ import_react3.default.createElement("label", { htmlFor: "gh-repository-name" }, "\u4ED3\u5E93\u540D\u79F0"), action), /* @__PURE__ */ import_react3.default.createElement("input", { id: "gh-repository-name", name: "name", required: true, maxLength: 100, placeholder: "my-project", "aria-describedby": error ? "gh-repository-name-hint gh-repository-name-error" : "gh-repository-name-hint", "aria-invalid": !!error, onChange: validate, onInvalid: validate }), /* @__PURE__ */ import_react3.default.createElement("small", { id: "gh-repository-name-hint", className: "gh-muted" }, repositoryNameHint), error && /* @__PURE__ */ import_react3.default.createElement("small", { id: "gh-repository-name-error", className: "gh-error", role: "alert" }, error));
}

// src/new-repository.jsx
function NewRepositoryForm({ upload, apiCall, onPrepare, busy = false }) {
  const [files, setFiles] = (0, import_react4.useState)([]), [description, setDescription] = (0, import_react4.useState)(""), [working, setWorking] = (0, import_react4.useState)(""), [error, setError] = (0, import_react4.useState)(""), [saved, setSaved] = (0, import_react4.useState)(""), [readFiles, setReadFiles] = (0, import_react4.useState)([]);
  const picker = (0, import_react4.useRef)(null);
  const ingest = async (e) => {
    const chosen = [...e.target.files];
    e.target.value = "";
    if (!chosen.length) return;
    if ((/* @__PURE__ */ new Set([...files.map((x) => x.name), ...chosen.map((x) => x.name)])).size > 10) {
      setError("\u4E00\u6B21\u6700\u591A\u4F20\u516510\u4E2A\u6587\u4EF6\u3002");
      return;
    }
    setWorking("upload");
    setError("");
    try {
      for (const f of chosen) {
        const result = await upload(f);
        if (!result.id) throw Error("\u6587\u4EF6\u6682\u5B58\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5\u3002");
        setFiles((old) => [...old.filter((x) => x.name !== result.name), result]);
      }
    } catch (ex) {
      setError(ex.message);
    } finally {
      setWorking("");
    }
  };
  const generate = async (e) => {
    setWorking("ai");
    setError("");
    const form = e.currentTarget.form, repoName = new FormData(form).get("name");
    try {
      const r = await apiCall("ai/program", { assetIds: files.map((f) => f.id), repoName, existingDescription: description });
      setDescription(r.text);
      setSaved(r.draftPath);
      setReadFiles(r.readFiles ?? []);
    } catch (ex) {
      setError(ex.message);
    } finally {
      setWorking("");
    }
  };
  return /* @__PURE__ */ import_react4.default.createElement("form", { className: "gh-form", "aria-label": "\u65B0\u5EFA\u4ED3\u5E93", onSubmit: (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    onPrepare({ name: f.get("name"), description, private: f.get("private") === "on" });
  } }, /* @__PURE__ */ import_react4.default.createElement(RepositoryNameField, { action: /* @__PURE__ */ import_react4.default.createElement("button", { type: "button", disabled: busy || !!working, onClick: () => picker.current.click() }, working === "upload" ? "\u4F20\u5165\u4E2D\u2026" : "\u4F20\u5165\u7A0B\u5E8F/\u4EE3\u7801") }), /* @__PURE__ */ import_react4.default.createElement("input", { ref: picker, type: "file", multiple: true, "aria-label": "\u4F20\u5165\u7A0B\u5E8F\u6216\u4EE3\u7801\u6587\u4EF6", style: { display: "none" }, onChange: ingest }), files.length > 0 && /* @__PURE__ */ import_react4.default.createElement("div", { className: "gh-imported-files" }, files.map((f) => /* @__PURE__ */ import_react4.default.createElement("div", { className: "gh-attachment", key: f.id }, /* @__PURE__ */ import_react4.default.createElement("span", null, f.name, "\uFF08", Math.max(1, Math.round(f.size / 1024)), " KB\uFF09"), /* @__PURE__ */ import_react4.default.createElement("button", { type: "button", disabled: !!working || busy, onClick: () => setFiles((old) => old.filter((x) => x.id !== f.id)) }, "\u53D6\u6D88\u9009\u7528")))), /* @__PURE__ */ import_react4.default.createElement("p", { className: "gh-muted" }, "\u5148\u4F20\u5165\u4EE3\u7801\u3001README\u6216\u5305\u542B\u6E90\u7801\u7684ZIP\uFF0CAI\u5C06\u8BFB\u53D6\u5185\u5BB9\u518D\u4ECB\u7ECD\u3002\u6587\u4EF6\u6682\u5B58\u672C\u673A\uFF0C\u4E0D\u4F1A\u6267\u884C\uFF1B\u7EAF\u5B89\u88C5\u5305\u9700\u53E6\u9644\u53EF\u8BFB\u6E90\u7801\u6216\u8BF4\u660E\u3002\u4F7F\u7528Harness\u9ED8\u8BA4\u6A21\u578B\uFF0C\u4F1A\u4EA7\u751F\u76F8\u5E94\u6A21\u578B\u7528\u91CF\u3002\u7A0B\u5E8F\u53D1\u5E03\u9875\u9644\u4EF6\u6D41\u7A0B\u4FDD\u6301\u539F\u6837\u3002"), /* @__PURE__ */ import_react4.default.createElement("div", { className: "gh-field" }, /* @__PURE__ */ import_react4.default.createElement("div", { className: "gh-ai-label" }, /* @__PURE__ */ import_react4.default.createElement("label", { htmlFor: "gh-new-repo-description" }, "\u4ECB\u7ECD"), /* @__PURE__ */ import_react4.default.createElement("button", { type: "button", disabled: !files.length || !!working || busy, title: !files.length ? "\u8BF7\u5148\u4F20\u5165\u7A0B\u5E8F\u6216\u4EE3\u7801\u6587\u4EF6" : "\u8BFB\u53D6\u5DF2\u4F20\u5165\u7684\u6E90\u7801\u548C\u8BF4\u660E\uFF0C\u751F\u6210\u9879\u76EE\u4ECB\u7ECD", onClick: generate }, working === "ai" ? "\u8BFB\u53D6\u5E76\u751F\u6210\u4E2D\u2026" : "AI \u81EA\u52A8\u4ECB\u7ECD")), /* @__PURE__ */ import_react4.default.createElement("textarea", { id: "gh-new-repo-description", name: "description", rows: 3, maxLength: 350, value: description, disabled: !!working, onChange: (e) => setDescription(e.target.value), placeholder: "\u8FD9\u4E2A\u9879\u76EE\u7528\u6765\u505A\u4EC0\u4E48" })), readFiles.length > 0 && /* @__PURE__ */ import_react4.default.createElement("details", { className: "gh-muted" }, /* @__PURE__ */ import_react4.default.createElement("summary", null, "AI\u4F9D\u636E ", readFiles.length, " \u4E2A\u6E90\u7801\u6216\u8BF4\u660E\u7247\u6BB5\u751F\u6210\uFF08\u672A\u8FD0\u884C\u7A0B\u5E8F\uFF09"), /* @__PURE__ */ import_react4.default.createElement("ul", null, readFiles.map((n) => /* @__PURE__ */ import_react4.default.createElement("li", { key: n }, n)))), error && /* @__PURE__ */ import_react4.default.createElement("p", { className: "gh-error", role: "alert" }, error), saved && /* @__PURE__ */ import_react4.default.createElement("p", { className: "gh-muted" }, "\u4ECB\u7ECD\u8349\u7A3F\u5DF2\u4FDD\u5B58\u81F3GitHub\u5DE5\u4F5C\u533A\uFF1A", saved), /* @__PURE__ */ import_react4.default.createElement("label", { className: "gh-check" }, /* @__PURE__ */ import_react4.default.createElement("input", { type: "checkbox", name: "private" }), "\u521B\u5EFA\u4E3A\u79C1\u6709\u4ED3\u5E93\uFF08\u9ED8\u8BA4\u516C\u5F00\uFF09"), /* @__PURE__ */ import_react4.default.createElement("button", { className: "gh-primary", disabled: busy || !!working }, "\u9884\u89C8\u521B\u5EFA"));
}

// src/client.jsx
var name = "github-connect-ui";
var inject = ["slots"];
var API = "/dsh-github/api/";
async function call(name2, { method = "GET", body, headers, signal } = {}) {
  const r = await fetch(API + name2, { method, headers: body instanceof File ? headers : { "Content-Type": "application/json", ...headers }, body: body === void 0 ? void 0 : body instanceof File ? body : JSON.stringify(body), signal });
  let data;
  try {
    data = await r.json();
  } catch {
    throw Error("GitHub \u8FDE\u63A5\u670D\u52A1\u8FD4\u56DE\u5F02\u5E38\uFF0C\u8BF7\u68C0\u67E5\u63D2\u4EF6\u662F\u5426\u542F\u7528\u3002");
  }
  if (!r.ok) throw Error(data.error ?? "\u8BF7\u6C42\u5931\u8D25\u3002");
  return data;
}
var post = (name2, body = {}) => call(name2, { method: "POST", body });
function GitHubIcon({ size = 20 }) {
  return /* @__PURE__ */ import_react5.default.createElement("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": "true" }, /* @__PURE__ */ import_react5.default.createElement("path", { d: "M12 .8a11.2 11.2 0 0 0-3.54 21.83c.56.1.76-.24.76-.54v-2.09c-3.13.68-3.79-1.33-3.79-1.33-.51-1.29-1.25-1.63-1.25-1.63-1.02-.7.08-.69.08-.69 1.13.08 1.72 1.16 1.72 1.16 1 1.72 2.63 1.22 3.27.93.1-.73.39-1.22.71-1.5-2.5-.29-5.13-1.25-5.13-5.54 0-1.22.44-2.22 1.16-3-.12-.28-.5-1.42.11-2.95 0 0 .95-.3 3.08 1.15a10.7 10.7 0 0 1 5.61 0c2.14-1.45 3.08-1.15 3.08-1.15.61 1.53.23 2.67.11 2.95.73.78 1.16 1.78 1.16 3 0 4.3-2.63 5.25-5.14 5.53.4.35.76 1.03.76 2.08v3.08c0 .3.2.65.77.54A11.2 11.2 0 0 0 12 .8Z" }));
}
var kindLabel = { create_repository: "\u521B\u5EFA\u4ED3\u5E93", commit_files: "\u63D0\u4EA4\u6587\u4EF6", create_release: "\u53D1\u5E03\u7248\u672C", upload_asset: "\u4E0A\u4F20\u7A0B\u5E8F\u9644\u4EF6" };
var statusLabel = { pending: "\u5F85\u786E\u8BA4", checking: "\u68C0\u67E5\u8D26\u53F7\u4E2D", running: "\u6B63\u5728\u6267\u884C", completed: "\u5DF2\u5B8C\u6210", failed: "\u5931\u8D25", cancelled: "\u5DF2\u53D6\u6D88", expired: "\u5DF2\u8FC7\u671F" };
var sizeLabel = (n) => n >= 1024 ** 2 ? (n / 1024 ** 2).toFixed(1) + " MB" : n >= 1024 ? (n / 1024).toFixed(1) + " KB" : n + " B";
function Field({ label, children }) {
  return /* @__PURE__ */ import_react5.default.createElement("label", { className: "gh-field" }, /* @__PURE__ */ import_react5.default.createElement("span", null, label), children);
}
function Empty({ title, children }) {
  return /* @__PURE__ */ import_react5.default.createElement("div", { className: "gh-empty" }, /* @__PURE__ */ import_react5.default.createElement(GitHubIcon, { size: 30 }), /* @__PURE__ */ import_react5.default.createElement("strong", null, title), /* @__PURE__ */ import_react5.default.createElement("p", null, children));
}
function Operation({ op, assets, onConfirm, onReject, busy }) {
  const a = op.args, attachment = assets.find((f) => f.id === a.assetId);
  return /* @__PURE__ */ import_react5.default.createElement("article", { className: "gh-operation" }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "gh-row" }, /* @__PURE__ */ import_react5.default.createElement("strong", null, kindLabel[op.kind]), /* @__PURE__ */ import_react5.default.createElement("span", { className: "gh-badge " + (op.status === "completed" ? "gh-success" : op.status === "failed" ? "gh-failed" : "") }, statusLabel[op.status] ?? op.status)), /* @__PURE__ */ import_react5.default.createElement("div", { className: "gh-target" }, op.kind === "create_repository" ? `${op.account}/${a.name}` : `${a.owner}/${a.repo}`), op.kind === "create_repository" && /* @__PURE__ */ import_react5.default.createElement("p", null, "\u53EF\u89C1\u6027\uFF1A", /* @__PURE__ */ import_react5.default.createElement("strong", null, a.private ? "\u79C1\u6709" : "\u516C\u5F00\uFF0C\u6240\u6709\u4EBA\u53EF\u89C1"), /* @__PURE__ */ import_react5.default.createElement("br", null), a.description), op.kind === "commit_files" && /* @__PURE__ */ import_react5.default.createElement(import_react5.default.Fragment, null, /* @__PURE__ */ import_react5.default.createElement("p", null, "\u76EE\u6807\u5206\u652F\uFF1A", a.branch, /* @__PURE__ */ import_react5.default.createElement("br", null), "\u63D0\u4EA4\u8BF4\u660E\uFF1A", a.message), a.files.map((f) => /* @__PURE__ */ import_react5.default.createElement("details", { key: f.path }, /* @__PURE__ */ import_react5.default.createElement("summary", null, f.path), /* @__PURE__ */ import_react5.default.createElement("pre", null, f.content)))), op.kind === "create_release" && /* @__PURE__ */ import_react5.default.createElement(import_react5.default.Fragment, null, /* @__PURE__ */ import_react5.default.createElement("p", null, "\u6807\u9898\uFF1A", a.name, /* @__PURE__ */ import_react5.default.createElement("br", null), "\u7248\u672C\uFF1A", a.tag_name, "\u3000\u76EE\u6807\uFF1A", a.target_commitish, /* @__PURE__ */ import_react5.default.createElement("br", null), a.draft ? "\u4FDD\u5B58\u4E3A\u8349\u7A3F" : "\u6B63\u5F0F\u53D1\u5E03", a.prerelease ? " \xB7 \u9884\u53D1\u5E03" : ""), /* @__PURE__ */ import_react5.default.createElement("details", { open: true }, /* @__PURE__ */ import_react5.default.createElement("summary", null, "\u66F4\u65B0\u8BF4\u660E"), /* @__PURE__ */ import_react5.default.createElement("pre", null, a.body || "\u672A\u586B\u5199"))), op.kind === "upload_asset" && /* @__PURE__ */ import_react5.default.createElement("p", null, "Release\uFF1A", a.releaseId, /* @__PURE__ */ import_react5.default.createElement("br", null), "\u9644\u4EF6\uFF1A", attachment?.name ?? a.assetId, " ", attachment && `\uFF08${sizeLabel(attachment.size)}\uFF09`), op.error && /* @__PURE__ */ import_react5.default.createElement("p", { className: "gh-error" }, op.error, /* @__PURE__ */ import_react5.default.createElement("br", null), op.message), op.result?.html_url && /* @__PURE__ */ import_react5.default.createElement("a", { href: op.result.html_url, target: "_blank", rel: "noreferrer" }, "\u5728 GitHub \u67E5\u770B"), op.result?.browser_download_url && /* @__PURE__ */ import_react5.default.createElement("a", { href: op.result.browser_download_url, target: "_blank", rel: "noreferrer" }, "\u4E0B\u8F7D\u5DF2\u53D1\u5E03\u7684\u9644\u4EF6"), op.status === "pending" && /* @__PURE__ */ import_react5.default.createElement("div", { className: "gh-actions" }, /* @__PURE__ */ import_react5.default.createElement("button", { className: "gh-primary", disabled: busy, onClick: () => onConfirm(op.id) }, "\u786E\u8BA4", kindLabel[op.kind]), /* @__PURE__ */ import_react5.default.createElement("button", { disabled: busy, onClick: () => onReject(op.id) }, "\u53D6\u6D88")));
}
function GitHubSettings() {
  const [state, setState] = (0, import_react5.useState)(null), [error, setError] = (0, import_react5.useState)(""), [busy, setBusy] = (0, import_react5.useState)(""), [tab, setTab] = (0, import_react5.useState)("repos"), [repositories, setRepositories] = (0, import_react5.useState)([]), [page, setPage] = (0, import_react5.useState)(1), [hasMore, setHasMore] = (0, import_react5.useState)(false), [selected, setSelected] = (0, import_react5.useState)(null), [ref, setRef] = (0, import_react5.useState)(""), [folder, setFolder] = (0, import_react5.useState)(""), [content, setContent] = (0, import_react5.useState)(null), [releases, setReleases] = (0, import_react5.useState)([]), [create, setCreate] = (0, import_react5.useState)(false), [uploadProgress, setUploadProgress] = (0, import_react5.useState)("");
  const active = (0, import_react5.useRef)(true), selection = (0, import_react5.useRef)(null), releasesSeq = (0, import_react5.useRef)(0);
  selection.current = selected;
  const refresh = (0, import_react5.useCallback)(async () => {
    const s = await call("state");
    if (active.current) setState((prev) => {
      const transient = s.errorKind && s.errorKind !== "auth";
      return transient && prev?.user ? { ...prev, error: s.error, errorKind: s.errorKind } : s;
    });
    return s;
  }, []);
  (0, import_react5.useEffect)(() => {
    active.current = true;
    let running = false;
    const poll = async () => {
      if (running) return;
      running = true;
      try {
        await refresh();
      } catch (e) {
        if (active.current) setError(e.message);
      } finally {
        running = false;
      }
    };
    poll();
    const t = setInterval(poll, 4e3);
    return () => {
      active.current = false;
      clearInterval(t);
    };
  }, [refresh]);
  const act = async (label, fn) => {
    setBusy(label);
    setError("");
    try {
      await fn();
      await refresh();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy("");
    }
  };
  const listRepos = async (next = 1) => {
    const result = await call("repos?page=" + next);
    setRepositories((old) => next === 1 ? result.repositories : [...old, ...result.repositories]);
    setPage(next);
    setHasMore(result.hasMore);
  };
  (0, import_react5.useEffect)(() => {
    if (state?.user?.id) listRepos().catch((e) => setError(e.message));
    else {
      setRepositories([]);
      setSelected(null);
      setContent(null);
    }
  }, [state?.user?.id]);
  const openRepo = async (r) => {
    setSelected(r);
    setRef(r.default_branch);
    setFolder("");
    setContent(null);
    setReleases([]);
    await read(r, "", r.default_branch);
  };
  const read = async (r, p, branch = ref) => {
    const data = await call("contents?" + new URLSearchParams({ owner: r.owner, repo: r.name, path: p, ref: branch }));
    if (selection.current?.full_name === r.full_name) {
      setFolder(p);
      setContent(data);
    }
  };
  const loadReleases = async (r = selected) => {
    if (!r) return;
    const seq = ++releasesSeq.current;
    const rows = await call("releases?" + new URLSearchParams({ owner: r.owner, repo: r.name }));
    if (seq === releasesSeq.current) setReleases(rows);
  };
  const prepare = async (kind, args) => {
    await post("prepare", { kind, args });
    setTab("operations");
  };
  const pending = state?.operations?.filter((o) => o.status === "pending").length ?? 0;
  const login = state?.login ?? {}, logged = !!state?.user;
  const confirm = (id) => act("\u6B63\u5728\u6267\u884C\u64CD\u4F5C", async () => {
    const result = await post("confirm", { id });
    if (result.status === "failed") throw Error(result.error);
    if (selected) await loadReleases();
  });
  return /* @__PURE__ */ import_react5.default.createElement("div", { className: "dsh-github" }, /* @__PURE__ */ import_react5.default.createElement("style", null, style_default), /* @__PURE__ */ import_react5.default.createElement("header", { className: "gh-header" }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "gh-title" }, /* @__PURE__ */ import_react5.default.createElement(GitHubIcon, { size: 26 }), /* @__PURE__ */ import_react5.default.createElement("h2", null, "GitHub")), !logged && /* @__PURE__ */ import_react5.default.createElement("button", { className: "gh-primary", disabled: !!busy || ["preparing", "waiting"].includes(login.state), onClick: () => act("\u6B63\u5728\u8FDE\u63A5", () => post("auth/start")) }, login.state === "preparing" ? "\u6B63\u5728\u51C6\u5907\u767B\u5F55\u2026" : login.state === "waiting" ? "\u7B49\u5F85\u6388\u6743\u2026" : "\u767B\u5F55 GitHub")), /* @__PURE__ */ import_react5.default.createElement("p", { className: "gh-intro" }, "\u8FDE\u63A5\u4F60\u7684\u8D26\u53F7\uFF0C\u5728\u804A\u5929\u4E2D\u6D4F\u89C8\u4ED3\u5E93\u3001\u63D0\u4EA4\u4EE3\u7801\u548C\u53D1\u5E03\u7A0B\u5E8F\u3002"), state && !logged && /* @__PURE__ */ import_react5.default.createElement("details", { open: !state.clientId, className: "gh-connect" }, /* @__PURE__ */ import_react5.default.createElement("summary", null, "\u767B\u5F55\u5E94\u7528\u914D\u7F6E", state.clientId ? "\uFF08\u5DF2\u914D\u7F6E\uFF09" : "\uFF08\u53D1\u5E03\u8005\u9996\u6B21\u914D\u7F6E\uFF09"), /* @__PURE__ */ import_react5.default.createElement("p", null, "\u63D2\u4EF6\u53D1\u5E03\u8005\u53EA\u9700\u6CE8\u518C\u4E00\u6B21 GitHub OAuth App\uFF0C\u5E76\u542F\u7528 Device Flow\u3002\u6700\u7EC8\u7528\u6237\u4F7F\u7528\u540C\u4E00\u4E2A Client ID \u767B\u5F55\uFF0C\u4E0D\u9700\u8981 Client Secret\u3002"), /* @__PURE__ */ import_react5.default.createElement("a", { href: "https://github.com/settings/applications/new", target: "_blank", rel: "noreferrer" }, "\u6253\u5F00 GitHub \u5E94\u7528\u6CE8\u518C\u9875\u9762"), /* @__PURE__ */ import_react5.default.createElement("form", { className: "gh-form", onSubmit: (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    act("\u6B63\u5728\u4FDD\u5B58", () => post("auth/configure", { clientId: f.get("clientId") }));
  } }, /* @__PURE__ */ import_react5.default.createElement(Field, { label: "OAuth App Client ID" }, /* @__PURE__ */ import_react5.default.createElement("input", { name: "clientId", required: true, defaultValue: state.clientId ?? "", placeholder: "\u586B\u5199\u53D1\u5E03\u8005\u7684 Client ID" })), /* @__PURE__ */ import_react5.default.createElement("button", { disabled: !!busy }, "\u4FDD\u5B58\u5E94\u7528\u914D\u7F6E"))), error && /* @__PURE__ */ import_react5.default.createElement("div", { role: "alert", className: "gh-errorbox" }, error, /* @__PURE__ */ import_react5.default.createElement("button", { "aria-label": "\u5173\u95ED\u63D0\u793A", onClick: () => setError("") }, "\xD7")), state?.user && state.errorKind && state.errorKind !== "auth" && /* @__PURE__ */ import_react5.default.createElement("p", { role: "status", className: "gh-muted" }, "GitHub \u6682\u65F6\u4E0D\u53EF\u7528\uFF08", state.error, "\uFF09\uFF0C\u5DF2\u4FDD\u7559\u5F53\u524D\u754C\u9762\u72B6\u6001\u5E76\u81EA\u52A8\u91CD\u8BD5\u3002"), state?.hasCredential && !logged && /* @__PURE__ */ import_react5.default.createElement("button", { disabled: !!busy, onClick: () => act("\u6B63\u5728\u6E05\u9664\u672C\u5730\u8FDE\u63A5", () => post("auth/logout")) }, "\u6E05\u9664\u672C\u5730\u8FDE\u63A5"), !state && /* @__PURE__ */ import_react5.default.createElement("p", { role: "status", className: "gh-muted" }, "\u6B63\u5728\u68C0\u67E5\u8FDE\u63A5\u2026"), logged ? /* @__PURE__ */ import_react5.default.createElement("section", { className: "gh-account" }, /* @__PURE__ */ import_react5.default.createElement("img", { src: state.user.avatar_url, alt: "" }), /* @__PURE__ */ import_react5.default.createElement("div", null, /* @__PURE__ */ import_react5.default.createElement("strong", null, state.user.name || state.user.login), /* @__PURE__ */ import_react5.default.createElement("span", null, "@", state.user.login, " ", /* @__PURE__ */ import_react5.default.createElement("i", null), " \u5DF2\u8FDE\u63A5")), /* @__PURE__ */ import_react5.default.createElement("button", { disabled: !!busy, onClick: () => act("\u6B63\u5728\u65AD\u5F00", () => post("auth/logout")) }, "\u65AD\u5F00\u8FDE\u63A5")) : /* @__PURE__ */ import_react5.default.createElement("section", { className: "gh-connect" }, /* @__PURE__ */ import_react5.default.createElement("strong", null, "\u8FDE\u63A5\u4F60\u7684 GitHub \u8D26\u53F7"), /* @__PURE__ */ import_react5.default.createElement("p", null, "\u70B9\u51FB\u53F3\u4E0A\u65B9\u767B\u5F55\uFF0C\u5728 GitHub \u5B98\u65B9\u9875\u9762\u5B8C\u6210\u6388\u6743\u3002\u8BF7\u5728 GitHub \u5B98\u65B9\u6388\u6743\u9875\u8F93\u5165\u8BBE\u5907\u4EE3\u7801\u3002"), login.state === "waiting" && /* @__PURE__ */ import_react5.default.createElement("div", { className: "gh-device" }, /* @__PURE__ */ import_react5.default.createElement("span", null, "\u5728\u6388\u6743\u9875\u9762\u8F93\u5165\u8BBE\u5907\u4EE3\u7801"), /* @__PURE__ */ import_react5.default.createElement("strong", null, login.code || "\u6B63\u5728\u83B7\u53D6\u2026"), /* @__PURE__ */ import_react5.default.createElement("a", { href: "https://github.com/login/device", target: "_blank", rel: "noreferrer" }, "\u6253\u5F00 GitHub \u6388\u6743\u9875\u9762")), login.state === "preparing" && /* @__PURE__ */ import_react5.default.createElement("p", { role: "status" }, "\u6B63\u5728\u8BF7\u6C42 GitHub \u8BBE\u5907\u6388\u6743\uFF0C\u8BF7\u7A0D\u5019\u2026"), login.state === "error" && /* @__PURE__ */ import_react5.default.createElement("p", { className: "gh-error" }, login.message)), /* @__PURE__ */ import_react5.default.createElement(BrowserSearch, null), pending > 0 && tab !== "operations" && /* @__PURE__ */ import_react5.default.createElement("button", { className: "gh-pending", onClick: () => setTab("operations") }, pending, " \u9879\u64CD\u4F5C\u7B49\u5F85\u786E\u8BA4\uFF0C\u70B9\u51FB\u9884\u89C8"), /* @__PURE__ */ import_react5.default.createElement("nav", { className: "gh-tabs", "aria-label": "GitHub \u529F\u80FD" }, [["repos", "\u4ED3\u5E93"], ["releases", "\u7A0B\u5E8F\u53D1\u5E03"], ["operations", `\u64CD\u4F5C\u8BB0\u5F55${pending ? " (" + pending + ")" : ""}`]].map(([id, label]) => /* @__PURE__ */ import_react5.default.createElement("button", { key: id, "aria-current": tab === id ? "page" : void 0, onClick: () => {
    setTab(id);
    if (id === "releases" && selected) act("\u6B63\u5728\u8BFB\u53D6\u7248\u672C", () => loadReleases());
  } }, label)), /* @__PURE__ */ import_react5.default.createElement("button", { className: "gh-refresh-repos", disabled: !logged || !!busy, onClick: () => act("\u6B63\u5728\u5237\u65B0\u4ED3\u5E93", () => listRepos(1)) }, busy === "\u6B63\u5728\u5237\u65B0\u4ED3\u5E93" ? "\u5237\u65B0\u4E2D\u2026" : "\u5237\u65B0\u5E93")), tab === "repos" && (!logged ? /* @__PURE__ */ import_react5.default.createElement(Empty, { title: "\u767B\u5F55\u540E\u67E5\u770B\u4ED3\u5E93" }, "\u9009\u62E9\u4F60\u7684\u9879\u76EE\uFF0C\u8BA9 DeepSeek \u9605\u8BFB\u548C\u5206\u6790\u4EE3\u7801\u3002") : /* @__PURE__ */ import_react5.default.createElement(import_react5.default.Fragment, null, /* @__PURE__ */ import_react5.default.createElement("div", { className: "gh-row gh-section-title" }, /* @__PURE__ */ import_react5.default.createElement("h3", null, selected ? "\u4ED3\u5E93\u6587\u4EF6" : "\u6211\u7684\u4ED3\u5E93"), /* @__PURE__ */ import_react5.default.createElement("div", { className: "gh-actions" }, /* @__PURE__ */ import_react5.default.createElement("button", { disabled: !!busy, onClick: () => act("\u6B63\u5728\u5237\u65B0", () => listRepos()) }, "\u5237\u65B0"), /* @__PURE__ */ import_react5.default.createElement("button", { onClick: () => setCreate(!create) }, "\u65B0\u5EFA\u4ED3\u5E93"))), create && /* @__PURE__ */ import_react5.default.createElement(NewRepositoryForm, { busy: !!busy, apiCall: post, upload: (file) => call("upload", { method: "POST", body: file, headers: { "x-file-name": encodeURIComponent(file.name), "Content-Type": "application/octet-stream" } }), onPrepare: (args) => act("\u6B63\u5728\u51C6\u5907\u4ED3\u5E93", () => prepare("create_repository", args)) }), selected ? /* @__PURE__ */ import_react5.default.createElement(import_react5.default.Fragment, null, /* @__PURE__ */ import_react5.default.createElement("button", { className: "gh-back", onClick: () => {
    setSelected(null);
    setContent(null);
  } }, "\u2039 \u8FD4\u56DE\u4ED3\u5E93\u5217\u8868"), /* @__PURE__ */ import_react5.default.createElement("div", { className: "gh-repo-heading" }, /* @__PURE__ */ import_react5.default.createElement("a", { href: selected.html_url, target: "_blank", rel: "noreferrer" }, selected.full_name), /* @__PURE__ */ import_react5.default.createElement("span", { className: "gh-badge" }, selected.private ? "\u79C1\u6709" : "\u516C\u5F00"), /* @__PURE__ */ import_react5.default.createElement(DeleteRepositoryLink, { repo: selected, login: state.user.login, disabled: !!busy })), /* @__PURE__ */ import_react5.default.createElement("form", { className: "gh-branch", onSubmit: (e) => {
    e.preventDefault();
    act("\u6B63\u5728\u8BFB\u53D6\u6587\u4EF6", () => read(selected, "", ref));
  } }, /* @__PURE__ */ import_react5.default.createElement("label", null, "\u5206\u652F ", /* @__PURE__ */ import_react5.default.createElement("input", { value: ref, onChange: (e) => setRef(e.target.value), "aria-label": "\u5206\u652F" })), /* @__PURE__ */ import_react5.default.createElement("button", { disabled: !!busy }, "\u5207\u6362")), /* @__PURE__ */ import_react5.default.createElement("div", { className: "gh-breadcrumb" }, "/", folder, folder && /* @__PURE__ */ import_react5.default.createElement("button", { onClick: () => act("\u6B63\u5728\u8BFB\u53D6\u76EE\u5F55", () => read(selected, folder.split("/").slice(0, -1).join("/"))) }, "\u4E0A\u4E00\u7EA7")), content?.kind === "directory" ? /* @__PURE__ */ import_react5.default.createElement("div", { className: "gh-files" }, [...content.entries].sort((a, b) => (a.type === "dir" ? 0 : 1) - (b.type === "dir" ? 0 : 1) || a.name.localeCompare(b.name)).map((f) => /* @__PURE__ */ import_react5.default.createElement("button", { key: f.path, onClick: () => act("\u6B63\u5728\u8BFB\u53D6\u6587\u4EF6", () => read(selected, f.path)) }, /* @__PURE__ */ import_react5.default.createElement("span", { "aria-hidden": "true" }, f.type === "dir" ? "\u25B8" : "\u2311"), /* @__PURE__ */ import_react5.default.createElement("span", null, f.name), /* @__PURE__ */ import_react5.default.createElement("small", null, f.type === "dir" ? "\u6587\u4EF6\u5939" : sizeLabel(f.size))))) : content?.kind === "file" ? /* @__PURE__ */ import_react5.default.createElement("pre", { className: "gh-code" }, content.content) : /* @__PURE__ */ import_react5.default.createElement("p", { className: "gh-muted" }, "\u6B63\u5728\u8BFB\u53D6\u2026")) : /* @__PURE__ */ import_react5.default.createElement("div", { className: "gh-repositories" }, repositories.length ? repositories.map((r) => /* @__PURE__ */ import_react5.default.createElement("button", { className: "gh-repo", key: r.full_name, onClick: () => act("\u6B63\u5728\u8BFB\u53D6\u4ED3\u5E93", () => openRepo(r)) }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "gh-row" }, /* @__PURE__ */ import_react5.default.createElement("strong", null, r.full_name), /* @__PURE__ */ import_react5.default.createElement("span", { className: "gh-badge" }, r.private ? "\u79C1\u6709" : "\u516C\u5F00")), r.description && /* @__PURE__ */ import_react5.default.createElement("p", null, r.description), /* @__PURE__ */ import_react5.default.createElement("small", null, r.default_branch))) : /* @__PURE__ */ import_react5.default.createElement(Empty, { title: "\u8FD8\u6CA1\u6709\u53EF\u663E\u793A\u7684\u4ED3\u5E93" }, "\u53EF\u4EE5\u65B0\u5EFA\u4E00\u4E2A\u9879\u76EE\uFF0C\u6216\u68C0\u67E5\u8D26\u53F7\u662F\u5426\u5177\u6709\u8BBF\u95EE\u6743\u9650\u3002"), hasMore && /* @__PURE__ */ import_react5.default.createElement("button", { disabled: !!busy, onClick: () => act("\u6B63\u5728\u8BFB\u53D6\u4ED3\u5E93", () => listRepos(page + 1)) }, "\u52A0\u8F7D\u66F4\u591A")))), tab === "releases" && (!logged ? /* @__PURE__ */ import_react5.default.createElement(Empty, { title: "\u53D1\u5E03\u4F60\u7684\u7B2C\u4E00\u4E2A\u7248\u672C" }, "\u767B\u5F55\u540E\uFF0C\u628A\u5B89\u88C5\u5305\u6216\u538B\u7F29\u5305\u53D1\u5E03\u5230\u81EA\u5DF1\u7684\u4ED3\u5E93\u3002") : /* @__PURE__ */ import_react5.default.createElement(import_react5.default.Fragment, null, /* @__PURE__ */ import_react5.default.createElement("h3", null, "\u53D1\u5E03\u5230\u4ED3\u5E93"), /* @__PURE__ */ import_react5.default.createElement("select", { "aria-label": "\u53D1\u5E03\u76EE\u6807\u4ED3\u5E93", value: selected?.full_name ?? "", onChange: (e) => {
    const r = repositories.find((r2) => r2.full_name === e.target.value);
    setSelected(r ?? null);
    setRef(r?.default_branch ?? "");
    setReleases([]);
    if (r) act("\u6B63\u5728\u8BFB\u53D6\u7248\u672C", () => loadReleases(r));
  } }, /* @__PURE__ */ import_react5.default.createElement("option", { value: "" }, "\u8BF7\u9009\u62E9\u4ED3\u5E93"), repositories.filter((r) => r.owner === state.user.login).map((r) => /* @__PURE__ */ import_react5.default.createElement("option", { key: r.full_name }, r.full_name))), selected && /* @__PURE__ */ import_react5.default.createElement(import_react5.default.Fragment, null, /* @__PURE__ */ import_react5.default.createElement("form", { className: "gh-form", onSubmit: (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    act("\u6B63\u5728\u51C6\u5907\u7248\u672C", () => prepare("create_release", { owner: selected.owner, repo: selected.name, tag_name: f.get("tag"), name: f.get("title") || f.get("tag"), body: f.get("body"), target_commitish: f.get("branch"), draft: f.get("draft") === "on", prerelease: f.get("prerelease") === "on" }));
  } }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "gh-grid" }, /* @__PURE__ */ import_react5.default.createElement(Field, { label: "\u7248\u672C\u6807\u7B7E" }, /* @__PURE__ */ import_react5.default.createElement("input", { name: "tag", placeholder: "v1.0.0", required: true })), /* @__PURE__ */ import_react5.default.createElement(Field, { label: "\u76EE\u6807\u5206\u652F" }, /* @__PURE__ */ import_react5.default.createElement("input", { key: selected.full_name, name: "branch", defaultValue: selected.default_branch, required: true }))), /* @__PURE__ */ import_react5.default.createElement(Field, { label: "\u7248\u672C\u6807\u9898" }, /* @__PURE__ */ import_react5.default.createElement("input", { name: "title", placeholder: "\u9996\u4E2A\u6B63\u5F0F\u7248\u672C" })), /* @__PURE__ */ import_react5.default.createElement(Field, { label: "\u66F4\u65B0\u8BF4\u660E" }, /* @__PURE__ */ import_react5.default.createElement("textarea", { name: "body", rows: 4, placeholder: "\u4ECB\u7ECD\u8FD9\u4E2A\u7248\u672C\u7684\u65B0\u589E\u529F\u80FD\u548C\u4FEE\u590D\u5185\u5BB9" })), /* @__PURE__ */ import_react5.default.createElement("div", { className: "gh-actions" }, /* @__PURE__ */ import_react5.default.createElement("label", { className: "gh-check" }, /* @__PURE__ */ import_react5.default.createElement("input", { type: "checkbox", name: "draft" }), "\u8349\u7A3F"), /* @__PURE__ */ import_react5.default.createElement("label", { className: "gh-check" }, /* @__PURE__ */ import_react5.default.createElement("input", { type: "checkbox", name: "prerelease" }), "\u9884\u53D1\u5E03")), /* @__PURE__ */ import_react5.default.createElement("button", { className: "gh-primary", disabled: !!busy }, "\u9884\u89C8\u53D1\u5E03\u7248\u672C")), /* @__PURE__ */ import_react5.default.createElement("div", { className: "gh-row" }, /* @__PURE__ */ import_react5.default.createElement("h3", null, "\u5DF2\u6709\u7248\u672C"), /* @__PURE__ */ import_react5.default.createElement("button", { disabled: !!busy, onClick: () => act("\u6B63\u5728\u5237\u65B0\u7248\u672C", () => loadReleases()) }, "\u5237\u65B0")), releases.length ? releases.map((r) => /* @__PURE__ */ import_react5.default.createElement("div", { className: "gh-release", key: r.id }, /* @__PURE__ */ import_react5.default.createElement("a", { href: r.html_url, target: "_blank", rel: "noreferrer" }, /* @__PURE__ */ import_react5.default.createElement("strong", null, r.name || r.tag_name)), /* @__PURE__ */ import_react5.default.createElement("small", null, r.tag_name, r.draft ? " \xB7 \u8349\u7A3F" : ""), r.assets.map((f) => /* @__PURE__ */ import_react5.default.createElement("a", { className: "gh-download", key: f.id, href: f.browser_download_url, target: "_blank", rel: "noreferrer" }, "\u2193 ", f.name, " ", /* @__PURE__ */ import_react5.default.createElement("small", null, sizeLabel(f.size)))), state.attachments.length > 0 && /* @__PURE__ */ import_react5.default.createElement("form", { className: "gh-asset-publish", onSubmit: (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    act("\u6B63\u5728\u51C6\u5907\u9644\u4EF6", () => prepare("upload_asset", { owner: selected.owner, repo: selected.name, releaseId: r.id, assetId: f.get("asset") }));
  } }, /* @__PURE__ */ import_react5.default.createElement("select", { name: "asset", "aria-label": "\u9009\u62E9\u5DF2\u6682\u5B58\u7684\u9644\u4EF6" }, state.attachments.map((a) => /* @__PURE__ */ import_react5.default.createElement("option", { key: a.id, value: a.id }, a.name, "\uFF08", sizeLabel(a.size), "\uFF09"))), /* @__PURE__ */ import_react5.default.createElement("button", { disabled: !!busy }, "\u9884\u89C8\u4E0A\u4F20")))) : /* @__PURE__ */ import_react5.default.createElement("p", { className: "gh-muted" }, "\u8FD9\u4E2A\u4ED3\u5E93\u5C1A\u65E0 Release\u3002")), /* @__PURE__ */ import_react5.default.createElement("section", { className: "gh-attachments" }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "gh-row" }, /* @__PURE__ */ import_react5.default.createElement("h3", null, "\u5F85\u53D1\u5E03\u9644\u4EF6"), /* @__PURE__ */ import_react5.default.createElement("label", { className: "gh-upload " + (busy ? "gh-disabled" : "") }, "\u9009\u62E9\u5B89\u88C5\u5305", /* @__PURE__ */ import_react5.default.createElement("input", { type: "file", disabled: !!busy, onChange: (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size >= 2 * 1024 ** 3) {
      setError("\u9644\u4EF6\u5FC5\u987B\u5C0F\u4E8E 2 GiB\u3002");
      return;
    }
    act("\u6B63\u5728\u6682\u5B58\u9644\u4EF6", async () => {
      setUploadProgress("\u6B63\u5728\u4FDD\u5B58 " + file.name + "\uFF08" + sizeLabel(file.size) + "\uFF09");
      try {
        await call("upload", { method: "POST", body: file, headers: { "x-file-name": encodeURIComponent(file.name), "Content-Type": "application/octet-stream" } });
      } finally {
        setUploadProgress("");
      }
    });
  } }))), /* @__PURE__ */ import_react5.default.createElement("p", { className: "gh-muted" }, "\u652F\u6301\u5DF2\u6709\u7684 .exe\u3001.msi\u3001.apk\u3001.zip \u7B49\u6587\u4EF6\u3002\u9009\u62E9\u540E\u5148\u6682\u5B58\u5230\u672C\u673A\uFF0C\u786E\u8BA4\u4E0A\u4F20\u540E\u624D\u4F1A\u53D1\u5E03\u5230 GitHub\u3002"), uploadProgress && /* @__PURE__ */ import_react5.default.createElement("p", { role: "status" }, uploadProgress), state.attachments.map((a) => /* @__PURE__ */ import_react5.default.createElement("div", { className: "gh-attachment", key: a.id }, /* @__PURE__ */ import_react5.default.createElement("div", null, /* @__PURE__ */ import_react5.default.createElement("strong", null, a.name), /* @__PURE__ */ import_react5.default.createElement("small", null, sizeLabel(a.size))), /* @__PURE__ */ import_react5.default.createElement("button", { disabled: !!busy, onClick: () => act("\u6B63\u5728\u79FB\u9664\u9644\u4EF6", () => post("attachment/remove", { id: a.id })) }, "\u79FB\u9664")))))), tab === "operations" && /* @__PURE__ */ import_react5.default.createElement(import_react5.default.Fragment, null, state?.operations?.length ? state.operations.map((op) => /* @__PURE__ */ import_react5.default.createElement(Operation, { key: op.id, op, assets: state.attachments, busy: !!busy, onConfirm: confirm, onReject: (id) => act("\u6B63\u5728\u53D6\u6D88", () => post("reject", { id })) })) : /* @__PURE__ */ import_react5.default.createElement(Empty, { title: "\u6682\u65E0\u64CD\u4F5C" }, "\u8BA9 DeepSeek \u51C6\u5907\u63D0\u4EA4\u6216\u53D1\u5E03\u540E\uFF0C\u5728\u8FD9\u91CC\u9884\u89C8\u5E76\u786E\u8BA4\u3002"), /* @__PURE__ */ import_react5.default.createElement("p", { className: "gh-muted" }, "\u5F85\u786E\u8BA4\u64CD\u4F5C 30 \u5206\u949F\u540E\u8FC7\u671F\uFF1B\u91CD\u542F\u63D2\u4EF6\u540E\u9700\u91CD\u65B0\u51C6\u5907\u3002")), busy && /* @__PURE__ */ import_react5.default.createElement("div", { className: "gh-working", role: "status" }, /* @__PURE__ */ import_react5.default.createElement("span", null), busy, "\u2026"), /* @__PURE__ */ import_react5.default.createElement("footer", { className: "gh-footer" }, "\u53D1\u5E03\u524D\u8BF7\u6838\u5BF9\u516C\u5F00\u8303\u56F4\u548C\u6587\u4EF6\u5185\u5BB9\u3002\u79C1\u6709\u4EE3\u7801\u4EA4\u7ED9\u6A21\u578B\u5206\u6790\u524D\uFF0C\u8BF7\u786E\u8BA4\u53EF\u4EE5\u53D1\u9001\u7ED9\u5F53\u524D\u6A21\u578B\u670D\u52A1\u3002"));
}
function apply(ctx) {
  ctx.slots.inject("settings.section", () => ctx.slots.register({ name: "settings.section", id: "github-connect", order: 35, label: "GitHub" }, () => import_react5.default.createElement(GitHubSettings)));
  ctx.slots.inject("settings.section.icon", () => ctx.slots.register({ name: "settings.section.icon", id: "github-connect" }, (props) => import_react5.default.createElement(GitHubIcon, { size: props?.size ?? 20 })));
}
return module.exports;}});
