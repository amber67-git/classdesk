// Language sweep for ClassDesk — a browser check, run by hand before a release that touches the UI.
//
//   node .github/scripts/i18n-sweep.mjs [--url http://127.0.0.1:8777/index.html] [--pages dashboard,students]
//
// validate.mjs proves that every marked string has Korean. This script proves the other half: it
// opens the app in Korean and lists the UI text that is STILL English (a label nobody marked), then
// opens it in English and lists any Korean that leaked into the UI. Only structural elements are
// read — menus, headings, buttons, labels, column heads, placeholders, titles, empty states — never
// the rows themselves, because names, book titles and notes are the user's own words in either
// language. Exits 1 when something is found.
//
// Needs Playwright with Chromium (`npm i -g playwright && npx playwright install chromium` once);
// it is deliberately not part of CI, which stays dependency-free. Playwright is looked up from the
// current folder, then NODE_PATH, then the global npm folder.
import { createRequire } from "node:module";
import { execSync } from "node:child_process";

function loadPlaywright() {
  const roots = [process.cwd() + "/", ...(process.env.NODE_PATH || "").split(":").filter(Boolean).map((d) => d + "/")];
  try { roots.push(execSync("npm root -g", { stdio: ["ignore", "pipe", "ignore"] }).toString().trim() + "/"); } catch {}
  for (const r of roots) { try { return createRequire(r)("playwright"); } catch {} }
  console.error("playwright not found — install it globally (npm i -g playwright && npx playwright install chromium) or set NODE_PATH to its node_modules");
  process.exit(2);
}
const { chromium } = loadPlaywright();

const arg = (name, def) => { const i = process.argv.indexOf(name); return i > 0 ? process.argv[i + 1] : def; };
const URL = arg("--url", "http://127.0.0.1:8777/index.html");
const ALL_PAGES = ["dashboard", "students", "sessions", "reading", "payments", "reports", "curriculum", "books", "booklib", "material", "settings"];
const PAGES = arg("--pages", "").split(",").filter(Boolean).length ? arg("--pages", "").split(",") : ALL_PAGES;
// Dialogs opened on each page (the function that opens it, run in the page).
const MODALS = { students: ["openStudentModal()"], sessions: ["openLessonModal()"], curriculum: ["openCurrModal()"], payments: ["openIncomeModal()"], dashboard: [] };

// Words that are the same in both languages and may stay as they are.
const SAME = /^(AR|L\d+|Lexile|ISBN|PIN|API|OK|PDF|CSV|JSON|URL|ID|Google|Firebase|ClassDesk|CLASSDESK|English|한국어|KST|₩.*|[\d\s.,:%/()+\-–—·•…*→]*|v\d+.*|AM|PM|WB|AMBER LIBRARY|e\.g\..*)$/;
const UI = [".ni", ".tb-title", ".sb-sub", ".sc-lbl", ".sc-sub", ".ct", ".btn", ".stab-btn", "label", "th", ".grid-head>*", ".col-hdr", "option", ".u-hint", ".empty p", ".mt>span", ".fg label", ".badge", ".std-arch-badge", ".cell-muted2", ".ph-lbl", "h3", ".mn-label"];

async function scan(page, lang) {
  // Each hit: {page, where, text}. "where" is the selector + the modal if one is open.
  return page.evaluate(({ UI, SAME: sameSrc, lang }) => {
    const SAME = new RegExp(sameSrc.source);
    const vis = (el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== "hidden"; };
    // Words that are the same in both languages are removed before the test, so "API 키" passes.
    const SAME_WORDS = /\b(API|AR|PIN|PDF|CSV|JSON|URL|ID|OK|Google|Firebase|ClassDesk|CLASSDESK|KST|Lexile|ISBN|L\d+|AM|PM|WB|OAuth|iPhone|iPad|AMBER LIBRARY|e\.g\.)\b|\[[a-z_()]+\]/g;
    const bad = (s) => {
      const v = s.replace(/\s+/g, " ").trim();
      if (!v || SAME.test(v)) return false;
      return lang === "ko" ? /[A-Za-z]{2,}/.test(v.replace(SAME_WORDS, "")) : /[가-힣]/.test(v);
    };
    // The user's own words, in either language, are never a finding: anything that contains a
    // student's name, a book/workbook/material title, a curriculum entry or a tag the user typed.
    const data = [];
    const push = (v) => { if (typeof v === "string" && v.trim().length >= 2) data.push(v.trim()); };
    // The app's collections are top-level let/const, so they are read by name, not off window.
    const g = (name) => { try { return eval(name) || []; } catch { return []; } };
    g("students").forEach((s) => { push(s.name); push(s.k); push(s.parent); push(s.notes); });
    g("bookLib").forEach((b) => { push(b.title); push(b.author); push(b.publisher); push(b.cat); push(b.genre); });
    g("books").forEach((b) => { push(b.name); push(b.brand); push(b.comment); });
    g("materials").forEach((m) => { push(m.name); push(m.comment); });
    g("curriculum").forEach((c) => { push(c.topic); push(c.cat); });
    g("settings.activities").forEach(push);
    g("settings.workbooks").forEach((w) => push(typeof w === "string" ? w : w.name));
    const isData = (v) => data.some((d) => v.includes(d));
    // Rows are data too; inside a row only badges, buttons and tooltips are the app's own words.
    const ROW = ".std-row,.grid-row,.pr,tbody tr,.cal-day,.todo-row";
    const hits = [];
    const seen = new Set();
    const where = (el) => { const mo = el.closest(".mo"); return (mo ? "#" + mo.id + " " : "") + el.tagName.toLowerCase() + (el.className && typeof el.className === "string" ? "." + el.className.trim().split(/\s+/).slice(0, 2).join(".") : ""); };
    document.querySelectorAll(UI.join(",")).forEach((el) => {
      const inOpenModal = el.closest(".mo") ? el.closest(".mo").classList.contains("show") : true;
      if (!inOpenModal) return;
      if (el.tagName === "OPTION" ? !vis(el.closest("select")) : !vis(el)) return;
      if (el.closest(ROW) && !el.matches(".badge,button,[title]")) return;
      // Own text only (children are checked on their own)
      const own = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.nodeValue).join(" ");
      const texts = [own];
      if (el.placeholder) texts.push(el.placeholder);
      if (el.title) texts.push(el.title);
      if (el.tagName === "OPTION") texts.push(el.textContent);
      texts.forEach((tx) => { if (bad(tx) && !isData(tx)) { const k = where(el) + "|" + tx.trim(); if (!seen.has(k)) { seen.add(k); hits.push({ where: where(el), text: tx.replace(/\s+/g, " ").trim() }); } } });
    });
    const openOnly = (el) => (el.closest(".mo") ? el.closest(".mo").classList.contains("show") : true);
    document.querySelectorAll("input[placeholder],textarea[placeholder]").forEach((el) => { if (openOnly(el) && vis(el) && bad(el.placeholder) && !isData(el.placeholder)) hits.push({ where: where(el) + " placeholder", text: el.placeholder }); });
    document.querySelectorAll("[title]").forEach((el) => { if (openOnly(el) && vis(el) && bad(el.title) && !isData(el.title)) hits.push({ where: where(el) + " title", text: el.title }); });
    return hits;
  }, { UI, SAME: { source: SAME.source }, lang });
}

const browser = await chromium.launch({ args: ["--no-sandbox"] });
let total = 0;
for (const lang of ["ko", "en"]) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, locale: lang === "ko" ? "ko-KR" : "en-GB" });
  await ctx.route(/gstatic\.com\/firebasejs|googleapis\.com\/(?!css)|accounts\.google/, (r) => r.abort());
  const page = await ctx.newPage();
  await page.goto(URL);
  await page.evaluate((lang) => { localStorage.setItem("mc_onboarded", "1"); localStorage.setItem("mc_last_export", new Date().toISOString()); const s = JSON.parse(localStorage.getItem("mc_settings") || "{}"); s.lang = lang; localStorage.setItem("mc_settings", JSON.stringify(s)); }, lang);
  await page.goto(URL);
  await page.waitForFunction(() => typeof showPage === "function" && typeof LANG === "string");
  console.log(`\n== ${lang === "ko" ? "Korean mode: English left in the UI" : "English mode: Korean left in the UI"} ==`);
  for (const pg of PAGES) {
    await page.evaluate((pg) => { showPage(pg); if (pg === "payments" && typeof pmSwitchTab === "function") pmSwitchTab("summary"); }, pg);
    await page.waitForTimeout(150);
    let hits = await scan(page, lang);
    for (const open of MODALS[pg] || []) {
      await page.evaluate((o) => { try { eval(o); } catch (e) { console.error(e); } }, open);
      await page.waitForTimeout(100);
      hits = hits.concat(await scan(page, lang));
      await page.evaluate(() => document.querySelectorAll(".mo.show").forEach((m) => m.classList.remove("show")));
    }
    const uniq = [...new Map(hits.map((h) => [h.where + "|" + h.text, h])).values()];
    total += uniq.length;
    console.log(`${pg}: ${uniq.length ? uniq.length + " found" : "clean"}`);
    uniq.slice(0, 60).forEach((h) => console.log(`   ${h.where.padEnd(34)} ${JSON.stringify(h.text)}`));
    if (uniq.length > 60) console.log(`   … ${uniq.length - 60} more`);
  }
  await ctx.close();
}
await browser.close();
console.log(total ? `\n${total} untranslated string(s)` : "\nclean in both languages");
process.exit(total ? 1 : 0);
