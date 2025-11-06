const STORAGE_KEY = "smd-theme"; // 'auto' | 'dark' | 'light'

function applyTheme(mode) {
  const body = document.body;
  body.classList.remove("theme-light", "theme-dark", "theme-auto", "theme-dark-active");
  body.classList.add(`theme-${mode}`);

  if (mode === "auto" && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    body.classList.add("theme-dark-active");
  }

  const isDark =
    mode === "dark" ||
    (mode === "auto" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  const btn = document.getElementById("theme-toggle");
  if (btn) btn.setAttribute("aria-checked", String(isDark));
}

function loadTheme() {
  const saved = localStorage.getItem(STORAGE_KEY) || "auto";
  applyTheme(saved);
}

function nextMode(cur) {
  if (cur === "auto") return "dark";
  if (cur === "dark") return "light";
  return "auto";
}

export function setupThemeToggle() {
  loadTheme();

  const btn = document.getElementById("theme-toggle");
  if (btn) {
    btn.addEventListener("click", () => {
      const current = localStorage.getItem(STORAGE_KEY) || "auto";
      const mode = nextMode(current);
      localStorage.setItem(STORAGE_KEY, mode);
      applyTheme(mode);
    });
  }

  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", () => {
    if ((localStorage.getItem(STORAGE_KEY) || "auto") === "auto") applyTheme("auto");
  });
}