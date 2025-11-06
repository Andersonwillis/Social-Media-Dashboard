import { renderHeader } from "./components/header.js";
import { renderCards } from "./components/card.js";
import { setupThemeToggle } from "./components/themeToggle.js";
import { renderFooter } from "./components/footer.js";

const app = document.getElementById("app");

app.innerHTML = `
  ${renderHeader()}
  <main id="main-content" class="container main">
    <section id="followers" class="grid grid--top" aria-label="Accounts"></section>
    <h2 class="section-title">Overview - Today</h2>
    <section id="overview" class="grid grid--overview" aria-label="Today overview"></section>
  </main>
  ${renderFooter()}
`;

setupThemeToggle();
renderCards();