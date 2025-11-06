export function renderHeader() {
  return `
    <header class="header container">
      <div class="header__titles">
        <h1 class="title">Social Media Dashboard</h1>
        <p class="subtitle">Total Followers: <span id="total-followers">0</span></p>
      </div>

      <div class="theme">
        <label for="theme-toggle" class="theme__label">Dark Mode</label>
        <button
          id="theme-toggle"
          class="switch"
          role="switch"
          aria-checked="false"
          aria-label="Toggle dark mode"
        ></button>
      </div>
    </header>
  `;
}