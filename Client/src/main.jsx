import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import App from "./App.jsx";
import "./styles.css";

function AboutPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">About this dashboard</h2>
      <p>
        This app is built with React, a Node/Express API, and a lowdb JSON
        database. It shows follower counts and overview stats from the backend.
      </p>
      <p>
        The theme toggle and the cards use React state and props, while the
        data is loaded over HTTP from the Node server.
      </p>
    </div>
  );
}

function RootLayout() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 text-slate-50">
        {/* Top nav uses Tailwind */}
        <header className="border-b border-slate-800">
          <div className="max-w-5xl mx-auto flex items-center justify-between py-4 px-4">
            <h1 className="text-lg md:text-2xl font-bold">
              Social Media Dashboard
            </h1>
            <nav className="flex gap-4 text-sm md:text-base">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  [
                    "hover:underline underline-offset-4",
                    isActive ? "font-semibold" : "text-slate-300",
                  ].join(" ")
                }
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  [
                    "hover:underline underline-offset-4",
                    isActive ? "font-semibold" : "text-slate-300",
                  ].join(" ")
                }
              >
                About
              </NavLink>
            </nav>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 py-8">
          <Routes>
            {/* Your existing dashboard UI */}
            <Route path="/" element={<App />} />
            {/* Simple second page to prove routing */}
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RootLayout />
  </React.StrictMode>
);