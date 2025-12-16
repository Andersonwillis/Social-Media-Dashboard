import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App.jsx";
import SignInPage from "./pages/SignInPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import AnalyticsPage from "./pages/AnalyticsPage.jsx";
import GoalsPage from "./pages/GoalsPage.jsx";
import ReportsPage from "./pages/ReportsPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import Navigation from "./components/Navigation.jsx";
import "./styles.css";

// Import your Clerk Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  console.warn("Missing Clerk Publishable Key");
}

// Layout wrapper for authenticated pages
function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <main className="max-w-5xl mx-auto px-4 py-8">
        <Navigation />
        {children}
      </main>
    </div>
  );
}

function RootLayout() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Sign-in is now the landing page */}
        <Route path="/" element={<SignInPage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up/*" element={<SignUpPage />} />
        
        {/* Dashboard pages with navigation (require sign-in) */}
        <Route path="/dashboard" element={<DashboardLayout><App /></DashboardLayout>} />
        <Route path="/analytics" element={<DashboardLayout><AnalyticsPage /></DashboardLayout>} />
        <Route path="/goals" element={<DashboardLayout><GoalsPage /></DashboardLayout>} />
        <Route path="/reports" element={<DashboardLayout><ReportsPage /></DashboardLayout>} />
        <Route path="/settings" element={<DashboardLayout><SettingsPage /></DashboardLayout>} />
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ClerkProvider 
      publishableKey={PUBLISHABLE_KEY}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignInUrl="/dashboard"
      afterSignUpUrl="/dashboard"
    >
      <RootLayout />
    </ClerkProvider>
  </React.StrictMode>
);