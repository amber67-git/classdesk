// Pre-deploy checks for ClassDesk.
//
// index.html IS the app and GitHub Pages serves it straight from the branch, so a syntax error
// reaches the live site within a minute of the push — there is no build step to catch it first.
// Run this before pushing:  node .github/scripts/validate.mjs
//
// No dependencies, on purpose: the repo has no package.json and should not grow one.

import { readFileSync, existsSync, writeFileSync, mkdtempSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";

const problems = [];
const notes = [];
const fail = (m) => problems.push(m);
const ok = (m) => notes.push(m);

// ── index.html ──────────────────────────────────────────────────────────────
const html = readFileSync("index.html", "utf8");

// The app's code lives in the longest inline <script>. Checking it with the real parser is the
// only check that truly matters: a stray bracket there takes the whole app down.
const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
let main = "";
if (!scripts.length) {
  fail("index.html has no inline <script>");
} else {
  main = scripts.reduce((a, b) => (a.length > b.length ? a : b));
  const file = join(mkdtempSync(join(tmpdir(), "classdesk-")), "main.js");
  writeFileSync(file, main);
  try {
    execFileSync(process.execPath, ["--check", file], { stdio: "pipe" });
    ok(`main <script> parses (${Math.round(main.length / 1024)} KB)`);
  } catch (e) {
    fail("main <script> has a syntax error:\n" + String(e.stderr || e.message).trim());
  }
}

// Unbalanced braces in CSS silently swallow every rule that follows.
let styleIdx = 0;
for (const m of html.matchAll(/<style>([\s\S]*?)<\/style>/g)) {
  styleIdx++;
  const open = (m[1].match(/{/g) || []).length;
  const close = (m[1].match(/}/g) || []).length;
  if (open !== close) fail(`<style> block #${styleIdx}: ${open} "{" vs ${close} "}"`);
}
if (styleIdx) ok(`${styleIdx} <style> block(s) balanced`);

// The deploy is confirmed by reading this value back off the live site, so it has to be there.
const ver = html.match(/APP_VERSION\s*=\s*"(v\d+)"/);
if (!ver) fail('APP_VERSION="vNN" not found in index.html');
else ok(`APP_VERSION ${ver[1]}`);

// Settings → Guide ends with the version it was reviewed against. The owner wants every release
// that changes how the app is used to add a "What's new" line there, so the footer must keep up:
// a release bumps it (after adding the line, or deciding none is needed).
const guideVer = html.match(/Guide written against version:\s*<b>(v\d+)<\/b>/);
if (!guideVer) fail('Settings → Guide footer "Guide written against version: <b>vNN</b>" not found');
else if (ver && guideVer[1] !== ver[1]) fail(`Settings → Guide footer says ${guideVer[1]} but APP_VERSION is ${ver[1]} — add a "What's new" line if the release changes how the app is used, then update the footer`);
else ok(`Guide footer matches APP_VERSION (${guideVer[1]})`);

// Since v129 the Guide has a Korean copy too (lang="ko"); the app shows the one that matches the
// language. Both footers and both newest "What's new" entries must carry APP_VERSION, so a release
// cannot update one copy and forget the other.
const guideKoVer = html.match(/설명서 기준 버전:\s*<b>(v\d+)<\/b>/);
if (!guideKoVer) fail('Korean Guide footer "설명서 기준 버전: <b>vNN</b>" not found');
else if (ver && guideKoVer[1] !== ver[1]) fail(`Korean Guide footer says ${guideKoVer[1]} but APP_VERSION is ${ver[1]} — update the Korean copy of the Guide as well`);
else ok(`Korean Guide footer matches APP_VERSION (${guideKoVer[1]})`);
for (const lang of ["en", "ko"]) {
  const at = html.indexOf(`guide-body" lang="${lang}"`);
  const top = at < 0 ? null : html.slice(at).match(/<dt>(v\d+)(?:–v\d+)? · /);
  if (at < 0) fail(`Guide copy lang="${lang}" not found`);
  else if (!top) fail(`Guide copy lang="${lang}" has no "What's new" entries`);
  else if (ver && top[1] !== ver[1]) fail(`newest "What's new" entry in the ${lang} Guide is ${top[1]} but APP_VERSION is ${ver[1]}`);
  else ok(`newest "What's new" entry in the ${lang} Guide is ${top[1]}`);
}

// An unclosed <a> once wrapped half of the Settings page in a link. Only the real markup can be
// examined — inside <script> the same characters are strings that build HTML at runtime — so
// script and style bodies are blanked out, keeping the newlines so reported lines stay true.
const blank = (s) => s.replace(/[^\n]/g, "");
const markup = html
  .replace(/<script(?:\s[^>]*)?>[\s\S]*?<\/script>/g, blank)
  .replace(/<style>[\s\S]*?<\/style>/g, blank);
const lineAt = (i) => markup.slice(0, i).split("\n").length;

// Counting opens against closes is not enough: <a><div>x</a></div> balances but the browser
// silently repairs it into something else. Walk them as a stack so the ORDER is checked too.
const TRACKED = ["a", "select", "textarea", "div"];
const stack = [];
let nestingOk = true;
for (const m of markup.matchAll(/<(\/?)([a-zA-Z][a-zA-Z0-9-]*)(?:\s[^>]*?)?(\/?)>/g)) {
  const closing = m[1] === "/";
  const name = m[2].toLowerCase();
  const selfClosing = m[3] === "/";
  if (!TRACKED.includes(name) || selfClosing) continue;
  if (!closing) {
    stack.push({ name, at: m.index });
    continue;
  }
  const top = stack.pop();
  if (!top) {
    fail(`line ${lineAt(m.index)}: </${name}> closes a tag that was never opened`);
    nestingOk = false;
    break;
  }
  if (top.name !== name) {
    fail(`line ${lineAt(m.index)}: <${top.name}> opened on line ${lineAt(top.at)} is closed by </${name}>`);
    nestingOk = false;
    break;
  }
}
if (nestingOk && stack.length) {
  const last = stack[stack.length - 1];
  fail(`<${last.name}> opened on line ${lineAt(last.at)} is never closed (${stack.length} tag(s) left open)`);
  nestingOk = false;
}
if (nestingOk) ok(`page markup nests correctly (${TRACKED.join(", ")})`);

// ── language (v124) ─────────────────────────────────────────────────────────
// The UI is English and Korean. The English text is the dictionary key: tx("Add student") in the
// script, or the text of an element marked data-i18n in the markup (data-i18n-ph → its placeholder,
// data-i18n-title → its title, data-i18n-opts → a <select>'s options). This cross-check reads every
// key the app uses and the Korean dictionary (I18N.ko between the i18n-dict markers) and fails when
// a key has no Korean, when a Korean line is used nowhere, or when markup is marked in a way the
// runtime cannot translate (text nested inside a child element).
const dictM = html.match(/\/\* i18n-dict-start \*\/\s*const I18N=(\{[\s\S]*?\});\s*\/\* i18n-dict-end \*\//);
if (!dictM) {
  fail("language dictionary not found (/* i18n-dict-start */ const I18N={…}; /* i18n-dict-end */)");
} else {
  let I18N = null;
  try {
    I18N = new Function("return " + dictM[1])();
  } catch (e) {
    fail("language dictionary does not evaluate: " + e.message);
  }
  if (I18N) {
    const ko = I18N.ko || {};
    const used = new Map(); // key → first place it is used
    const use = (k, where) => { if (!used.has(k)) used.set(k, where); };
    const decode = (s) => s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ");
    const lineInHtml = (i) => html.slice(0, i).split("\n").length;

    // Script: tx("…"), tx('…'), tx(`…`) — a template with ${} is not a key the dictionary can hold.
    // Comment lines are blanked first (the rules above quote tx("…") as an example).
    const mainAt = html.indexOf(main);
    const code = main.replace(/^[ \t]*\/\/[^\n]*/gm, (c) => " ".repeat(c.length));
    // txSafe("…") is tx for messages that may fire before the language is set up — same keys.
    for (const m of code.matchAll(/\btx(?:Safe)?\(\s*(["'`])((?:\\.|(?!\1)[^\\])*)\1/g)) {
      const line = lineInHtml(mainAt + m.index);
      if (m[1] === "`" && m[2].includes("${")) { fail(`line ${line}: tx(\`…\`) / txSafe(\`…\`) with \${} — the key must be a fixed string; use {name} placeholders and a second argument`); continue; }
      const k = m[2].replace(/\\(n|t|'|"|\\|`)/g, (_, c) => ({ n: "\n", t: "\t" }[c] ?? c));
      use(k, `script line ${line}`);
    }
    if (/\b(?:const|let|var)\s+tx\b|\btx\s*=>|\(\s*tx\s*[,)]/.test(main)) fail("the script declares a local variable named tx — that is the translator; rename the variable");
    // Inline handlers in the markup (onclick="…tx('Saved')…") count too.
    for (const m of markup.matchAll(/\btx\(\s*(["'`])((?:\\.|(?!\1)[^\\])*)\1/g)) use(m[2].replace(/&quot;/g, '"').replace(/&#39;/g, "'"), `markup line ${lineAt(m.index)} (handler)`);

    // Markup: walk the tags with a depth counter to find each marked element's own text.
    const VOID = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"]);
    const tags = [...markup.matchAll(/<(\/?)([a-zA-Z][a-zA-Z0-9-]*)((?:\s[^>]*?)?)(\/?)>/g)];
    const attr = (attrs, name) => { const a = attrs.match(new RegExp(`\\s${name}="([^"]*)"`)); return a ? decode(a[1]) : null; };
    const hasFlag = (attrs, name) => new RegExp(`\\s${name}(?=[\\s/>]|$)`).test(attrs + " ");
    for (let i = 0; i < tags.length; i++) {
      const m = tags[i];
      if (m[1] === "/") continue;
      const attrs = m[3] || "";
      const line = lineAt(m.index);
      if (hasFlag(attrs, "data-i18n-ph")) { const v = attr(attrs, "placeholder"); if (v == null) fail(`line ${line}: data-i18n-ph on an element with no placeholder`); else use(v, `markup line ${line} (placeholder)`); }
      if (hasFlag(attrs, "data-i18n-title")) { const v = attr(attrs, "title"); if (v == null) fail(`line ${line}: data-i18n-title on an element with no title`); else use(v, `markup line ${line} (title)`); }
      const wantText = hasFlag(attrs, "data-i18n"), wantOpts = hasFlag(attrs, "data-i18n-opts");
      if (!wantText && !wantOpts) continue;
      if (VOID.has(m[2].toLowerCase()) || m[4] === "/") { fail(`line ${line}: data-i18n on <${m[2]}>, which has no text`); continue; }
      // find the matching close tag
      let depth = 0, j = i + 1, end = -1;
      for (; j < tags.length; j++) {
        const n = tags[j];
        if (VOID.has(n[2].toLowerCase()) || n[4] === "/") continue;
        if (n[1] === "/") { if (depth === 0) { end = j; break; } depth--; } else depth++;
      }
      if (end < 0) { fail(`line ${line}: <${m[2]} data-i18n> is never closed`); continue; }
      if (wantOpts) {
        const inner = markup.slice(m.index + m[0].length, tags[end].index);
        for (const o of inner.matchAll(/<option\b[^>]*>([^<]*)<\/option>/g)) { const v = decode(o[1].trim()); if (v) use(v, `markup line ${line} (option)`); }
        continue;
      }
      // Direct text only: the runtime translates the element's own text nodes, not its children's.
      let pos = m.index + m[0].length, d = 0, own = [], nested = false;
      for (let k = i + 1; k <= end; k++) {
        const n = tags[k];
        const text = markup.slice(pos, n.index);
        if (text.trim()) { if (d === 0) own.push(decode(text.trim())); else nested = true; }
        pos = n.index + n[0].length;
        if (VOID.has(n[2].toLowerCase()) || n[4] === "/") continue;
        if (n[1] === "/") d--; else d++;
      }
      if (nested) fail(`line ${line}: <${m[2]} data-i18n> has text inside a child element, which applyI18n does not translate — mark the child instead`);
      if (!own.length) fail(`line ${line}: <${m[2]} data-i18n> has no text of its own`);
      own.forEach((v) => use(v, `markup line ${line}`));
    }

    const missing = [...used].filter(([k]) => typeof ko[k] !== "string" || !ko[k].trim());
    const unused = Object.keys(ko).filter((k) => !used.has(k));
    if (missing.length) fail(`${missing.length} UI string(s) have no Korean in I18N.ko:\n` + missing.map(([k, w]) => `       ${JSON.stringify(k)}  ← ${w}`).join("\n"));
    if (unused.length) fail(`${unused.length} Korean line(s) in I18N.ko are used nowhere (stale key?):\n` + unused.map((k) => `       ${JSON.stringify(k)}`).join("\n"));
    if (!missing.length && !unused.length) ok(`language: ${used.size} UI strings, all with Korean`);
  }
}

// ── files index.html depends on ─────────────────────────────────────────────
// These ship next to index.html and the page loads both. Missing is a broken deploy, not a
// reason to skip the check.
if (!existsSync("sw.js")) {
  fail("sw.js is missing — index.html registers it as the service worker");
} else {
  try {
    execFileSync(process.execPath, ["--check", "sw.js"], { stdio: "pipe" });
    ok("sw.js parses");
  } catch (e) {
    fail("sw.js has a syntax error:\n" + String(e.stderr || e.message).trim());
  }
}

if (!existsSync("manifest.webmanifest")) {
  fail('manifest.webmanifest is missing — index.html links it with <link rel="manifest">');
} else {
  try {
    const mf = JSON.parse(readFileSync("manifest.webmanifest", "utf8"));
    for (const icon of mf.icons || []) {
      // "?v=NN" is a cache-buster (a changed URL makes Android re-fetch the installed icon), not part of the file name
      const file = (icon.src || "").split(/[?#]/)[0];
      if (file && !existsSync(file)) fail(`manifest icon missing from the repo: ${icon.src}`);
    }
    ok(`manifest.webmanifest is valid JSON (${(mf.icons || []).length} icons)`);
  } catch (e) {
    fail("manifest.webmanifest is not valid JSON: " + e.message);
  }
}

// ── privacy ─────────────────────────────────────────────────────────────────
// This repo is public and CLAUDE.md carries real student names and schedules. The local working
// copy is expected to exist; only a TRACKED file would be a leak.
try {
  execFileSync("git", ["ls-files", "--error-unmatch", "CLAUDE.md"], { stdio: "pipe" });
  fail("CLAUDE.md is tracked by git — it holds real student names and must stay gitignored");
} catch {
  ok("CLAUDE.md is not tracked");
}

// ── report ──────────────────────────────────────────────────────────────────
for (const n of notes) console.log("  ok   " + n);
for (const p of problems) console.error("  FAIL " + p);
console.log(problems.length ? `\n${problems.length} problem(s)` : "\nall checks passed");
process.exit(problems.length ? 1 : 0);
