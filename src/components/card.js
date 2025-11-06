const DATA_URL = "/src/data/cards.json";

const formatCount = (n) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}m`;
  if (n >= 10_000)   return `${(n / 1_000).toFixed(n % 1_000 === 0 ? 0 : 1)}k`;
  return Number(n).toLocaleString();
};

const iconFor = (brand) => `./images/icon-${brand}.svg`;
const deltaIcon = (dir) => `./images/icon-${dir}.svg`;

function followerCard({ brand, handle, label, count, deltaDirection, deltaValue, displayName }) {
  const name = handle ?? displayName ?? "";
  return `
    <article class="card card--top" data-brand="${brand}" tabindex="0">
      <header class="handle">
        <img src="${iconFor(brand)}" alt="" aria-hidden="true" />
        <span>${name}</span>
      </header>
      <p class="count" aria-label="${label} count">${formatCount(count)}</p>
      <p class="label">${label}</p>
      <p class="delta ${deltaDirection === "up" ? "delta--up" : "delta--down"}">
        <img src="${deltaIcon(deltaDirection)}" alt="" aria-hidden="true" />
        <span>${formatCount(deltaValue)} Today</span>
      </p>
    </article>
  `;
}

function overviewCard({ brand, metric, value, deltaDirection, deltaPercent }) {
  return `
    <article class="card card--overview" data-brand="${brand}" tabindex="0">
      <p class="metric">${metric}</p>
      <img class="brand" src="${iconFor(brand)}" alt="" aria-hidden="true" />
      <p class="value">${formatCount(value)}</p>
      <p class="delta ${deltaDirection === "up" ? "delta--up" : "delta--down"}">
        <img src="${deltaIcon(deltaDirection)}" alt="" aria-hidden="true" />
        <span>${deltaPercent}%</span>
      </p>
    </article>
  `;
}

async function loadData() {
  const res = await fetch(DATA_URL, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load ${DATA_URL}`);
  return res.json();
}

export async function renderCards() {
  const followersEl = document.getElementById("followers");
  const overviewEl  = document.getElementById("overview");

  try {
    const { followers = [], overview = [] } = await loadData();

    followersEl.innerHTML = followers.map(followerCard).join("");
    overviewEl.innerHTML  = overview.map(overviewCard).join("");

    const total = followers.reduce((sum, f) => sum + (Number(f.count) || 0), 0);
    const totalEl = document.getElementById("total-followers");
    if (totalEl) totalEl.textContent = total.toLocaleString();
  } catch {
    followersEl.innerHTML = `<p role="alert">Could not load data.</p>`;
    overviewEl.innerHTML  = "";
  }
}