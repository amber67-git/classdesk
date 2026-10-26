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
// counted — inside <script> the same characters are strings that build HTML at runtime.
const markup = html
  .replace(/<script(?:\s[^>]*)?>[\s\S]*?<\/script>/g, "")
  .replace(/<style>[\s\S]*?<\/style>/g, "");
let tagsOk = true;
for (const tag of ["a", "select", "textarea", "div"]) {
  const open = (markup.match(new RegExp("<" + tag + "(?:\\s[^>]*)?>", "gi")) || []).length;
  const close = (markup.match(new RegExp("</" + tag + ">", "gi")) || []).length;
  if (open !== close) {
    tagsOk = false;
    fail(`<${tag}> in the page markup: ${open} opened, ${close} closed`);
  }
}
if (tagsOk) ok("page markup tags balanced");

// ── sw.js ───────────────────────────────────────────────────────────────────
if (existsSync("sw.js")) {
  try {
    execFileSync(process.execPath, ["--check", "sw.js"], { stdio: "pipe" });
    ok("sw.js parses");
  } catch (e) {
    fail("sw.js has a syntax error:\n" + String(e.stderr || e.message).trim());
  }
}

// ── manifest ────────────────────────────────────────────────────────────────
if (existsSync("manifest.webmanifest")) {
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
