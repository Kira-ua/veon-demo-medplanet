// E2E checks of the key homepage scenarios (ux/demo-home.md C1–C6) with the studio Playwright
// (~/.veon/tools via veon_pw.mjs; nothing is installed in the project).
// Usage: node tests/e2e/home.e2e.mjs [url]   (default http://localhost:4321/)
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

const studio = process.env.VEON_WEB_STUDIO || path.join(os.homedir(), "Documents", "ai-web-studio");
const pwHelper = path.join(process.env.VEON_STUDIO_SCRIPTS || path.join(studio, "quality", "scripts"), "veon_pw.mjs");
const { loadPlaywright, launchBrowser } = await import(pathToFileURL(pwHelper).href);
const { chromium } = loadPlaywright();
const url = process.argv[2] || "http://localhost:4321/";

let failed = 0;
const check = (ok, name, extra = "") => {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${extra ? ` — ${extra}` : ""}`);
  if (!ok) failed += 1;
};

const browser = await launchBrowser(chromium);
try {
  // Desktop 1440
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(url, { waitUntil: "networkidle" });
    check((await page.locator("h1").count()) === 1, "one H1");
    check(await page.locator("#hero a[href^='viber://']").first().isVisible(), "C6: Viber in hero visible");
    check(await page.locator("header a[href='tel:+380955876516']").first().isVisible(), "C6: phone in header visible");
    const ids = await page.$$eval("main > section", (s) => s.map((e) => e.id));
    check(ids.join(",") === "hero,directions,products,b2b,delivery,contacts", "sections order", ids.join(","));
    const hrefs = await page.$$eval("a[href]", (as) => as.map((a) => a.getAttribute("href")));
    check(!hrefs.some((h) => /medplanet\.com\.ua/i.test(h) && !h.startsWith("mailto:")), "no links to the old site");
    check(!hrefs.some((h) => h === "#" || h === ""), "no empty links");
    const bad = hrefs.filter((h) => !/^(#|tel:\+380955876516$|viber:\/\/chat\?number=%2B380955876516$|https:\/\/t\.me\/\+380955876516$|mailto:info@medplanet\.com\.ua)/.test(h));
    check(bad.length === 0, "only allowed link targets", bad.join(" "));
    // C1: organisation path
    await page.locator("#hero a[href='#b2b']").click();
    await page.waitForTimeout(900);
    const top = await page.locator("#b2b h2").evaluate((el) => el.getBoundingClientRect().top);
    check(top >= 72, "C1: #b2b heading not under the sticky header", `top=${Math.round(top)}`);
    const mail = await page.locator("#b2b a[href^='mailto:']").getAttribute("href");
    check(/subject=/.test(mail) && /body=/.test(mail) && /%D0%84%D0%94%D0%A0%D0%9F%D0%9E%D0%A3/.test(mail), "C1: mailto has subject and template body");
    // C2–C5: kit cell → direction
    await page.locator(".kit a[href='#dir-04']").click();
    await page.waitForTimeout(900);
    check(await page.locator("#dir-04 h3").isVisible(), "C4: kit 04 leads to direction 04");
    check((await page.locator("#dir-04 a[href='tel:+380955876516']").count()) === 1, "C4: direction 04 has a call link");
    // C2: unit / volunteer — kit 01 → tactical medicine → invoice for the unit (#b2b) or Viber on a priced kit
    await page.locator(".kit a[href='#dir-01']").click();
    await page.waitForTimeout(900);
    check(await page.locator("#dir-01 h3").isVisible(), "C2: kit 01 leads to direction 01");
    await page.locator("#dir-01 a[href='#b2b']").click();
    await page.waitForTimeout(900);
    const b2bTop = await page.locator("#b2b h2").evaluate((el) => el.getBoundingClientRect().top);
    check(b2bTop >= 72 && b2bTop < 900, "C2: direction 01 → #b2b for an invoice");
    check((await page.locator("#products a[href^='viber://']").count()) === 4, "C2: every priced item has «Замовити у Viber»");
    // C3: office / car / HORECA — kit 02 → civil kits; delivery terms visible
    await page.locator(".kit a[href='#dir-02']").click();
    await page.waitForTimeout(900);
    check(await page.locator("#dir-02").getByText("Для HORECA").isVisible(), "C3: kit 02 leads to civil kits with HORECA");
    await page.locator(".hdr__nav a[href='#delivery']").click();
    await page.waitForTimeout(900);
    check(await page.locator("#delivery table").getByText("120").isVisible(), "C3: delivery rates visible after the menu jump");
    // C5: training centre — kit 03 → STEEPEN simulators, Viber
    await page.locator(".kit a[href='#dir-03']").click();
    await page.waitForTimeout(900);
    check(await page.locator("#dir-03").getByText("STEEPEN").first().isVisible(), "C5: kit 03 leads to STEEPEN simulators");
    check(await page.locator("#dir-03 a[href^='viber://']").isVisible(), "C5: Viber from direction 03");
    // FutureLink tooltip on focus
    const fl = page.locator("#dir-04 .future-link").first();
    await page.locator("#dir-04 .dir__lead").click();
    await fl.focus();
    await page.keyboard.press("Shift+Tab");
    await page.keyboard.press("Tab");
    await page.waitForTimeout(300);
    const op = await fl.locator(".future-link__note").evaluate((el) => getComputedStyle(el).display === "block" ? "1" : "0");
    check(op === "1", "FutureLink note on focus");
    check((await fl.getAttribute("aria-disabled")) === "true", "FutureLink aria-disabled");
    await page.close();
  }
  // Phone 390
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const page = await ctx.newPage();
    await page.goto(url, { waitUntil: "networkidle" });
    const viber = await page.locator("#hero a[href^='viber://']").boundingBox();
    const org = await page.locator("#hero a[href='#b2b']").boundingBox();
    check(viber && org && viber.y + viber.height <= 844 && org.y + org.height <= 844, "390: both hero CTAs above the fold");
    check(!(await page.locator(".dock").evaluate((el) => el.classList.contains("is-shown"))), "390: dock hidden over the hero");
    await page.evaluate(() => document.getElementById("products").scrollIntoView());
    await page.waitForTimeout(500);
    check(await page.locator(".dock").evaluate((el) => el.classList.contains("is-shown")), "390: dock shown after the hero");
    // accordion
    const t = page.locator("#dir-05 [data-dir-toggle]");
    check((await t.getAttribute("aria-expanded")) === "false", "390: direction 05 collapsed");
    await t.click();
    await page.waitForTimeout(600);
    check((await t.getAttribute("aria-expanded")) === "true" && (await page.locator("#dir-05 .dir__subs").isVisible()), "390: direction 05 opens");
    // menu
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.locator(".menu summary").click();
    check(await page.locator(".menu__list a[href='#contacts']").isVisible(), "390: menu opens");
    await page.locator(".menu__list a[href='#contacts']").click();
    await page.waitForTimeout(900);
    check(!(await page.locator(".menu").evaluate((el) => el.open)), "390: menu closes after a jump");
    await ctx.close();
  }
  // No horizontal scroll and key elements inside the screen
  for (const w of [320, 375, 768, 1024, 1440]) {
    const page = await browser.newPage({ viewport: { width: w, height: 800 } });
    await page.goto(url, { waitUntil: "networkidle" });
    const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    const outside = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      return [...document.querySelectorAll("header a, header summary, .btn, h1, h2, .cts__phone")]
        .filter((el) => el.offsetParent !== null && !el.closest(".prods__scroll") && !el.closest(".menu__panel"))
        .filter((el) => { const r = el.getBoundingClientRect(); return r.width > 0 && (r.left < -1 || r.right > vw + 1); })
        .map((el) => el.className || el.tagName);
    });
    check(over <= 0 && outside.length === 0, `${w}px: no horizontal overflow`, outside.join(", "));
    await page.close();
  }
  // Reduced motion and no-JS
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
    const page = await ctx.newPage();
    await page.goto(url, { waitUntil: "networkidle" });
    const anim = await page.locator(".kit__item").first().evaluate((el) => getComputedStyle(el).animationName);
    check(anim === "none", "reduced motion: kit without animation");
    await ctx.close();
    const nojs = await browser.newContext({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false });
    const p2 = await nojs.newPage();
    await p2.goto(url, { waitUntil: "networkidle" });
    check(await p2.locator("#dir-06 .dir__subs").isVisible(), "no JS: subcategories visible");
    check(await p2.locator(".dock").isVisible(), "no JS: dock visible");
    await nojs.close();
  }
} finally {
  await browser.close();
}
console.log(failed ? `\n${failed} FAIL` : "\nALL PASS");
process.exit(failed ? 1 : 0);
