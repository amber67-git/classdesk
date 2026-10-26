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
if (!scripts.length) {
  fail("index.html has no inline <script>");
} else {
  const main = scripts.reduce((a, b) => (a.length > b.length ? a : b));
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
      if (icon.src && !existsSync(icon.src)) fail(`manifest icon missing from the repo: ${icon.src}`);
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
