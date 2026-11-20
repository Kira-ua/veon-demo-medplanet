// Homepage behaviour. Everything here is an enhancement: with scripting off all content stays visible.

// Mobile menu (<details>): close on anchor click, on Escape and when the layout becomes desktop.
const menu = document.querySelector<HTMLDetailsElement>(".menu");
if (menu) {
  menu.addEventListener("click", (e) => {
    const a = (e.target as HTMLElement).closest("a");
    if (a) menu.open = false;
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu.open) {
      menu.open = false;
      menu.querySelector("summary")?.focus();
    }
  });
  window.matchMedia("(min-width: 1024px)").addEventListener("change", (e) => { if (e.matches) menu.open = false; });
}

// Effect 3: subcategories of directions 03–06 fold into an accordion on phones.
document.querySelectorAll<HTMLButtonElement>("[data-dir-toggle]").forEach((btn) => {
  const dir = btn.closest<HTMLElement>(".dir");
  if (!dir) return;
  btn.addEventListener("click", () => {
    const open = btn.getAttribute("aria-expanded") === "true";
    btn.setAttribute("aria-expanded", String(!open));
    dir.toggleAttribute("data-open", !open);
  });
});

// Effect 2: after a jump from the kit, the target direction marks its number (CSS :target does the drawing).

// Effect 4: contact dock on phones appears once the hero has scrolled away.
const dock = document.querySelector<HTMLElement>(".dock");
const hero = document.getElementById("hero");
if (dock && hero && "IntersectionObserver" in window) {
  // Visible by default (no script = always there); the script tucks it away while the hero is on screen.
  const set = (shown: boolean) => {
    dock.classList.toggle("is-tucked", !shown);
    dock.classList.toggle("is-shown", shown);
    dock.inert = !shown;
  };
  const r = hero.getBoundingClientRect();
  set(!(r.bottom > 0 && r.top < window.innerHeight));
  requestAnimationFrame(() => dock.classList.add("is-armed"));
  new IntersectionObserver(([entry]) => set(!entry.isIntersecting), { threshold: 0 }).observe(hero);
}

// Copy the phone number (desktop) with a live status.
const copyBtn = document.querySelector<HTMLButtonElement>("[data-copy]");
const copyStatus = document.querySelector<HTMLElement>("[data-copy-status]");
if (copyBtn && copyStatus && navigator.clipboard) {
  copyBtn.hidden = false;
  let t = 0;
  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(copyBtn.dataset.copy || "");
      copyStatus.textContent = "Номер скопійовано";
    } catch {
      copyStatus.textContent = "Не вдалося скопіювати, наберіть номер вручну";
    }
    window.clearTimeout(t);
    t = window.setTimeout(() => { copyStatus.textContent = ""; }, 4000);
  });
}

