import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App.jsx";
import SignInPage from "./pages/SignInPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import "./styles.css";

// Import your Clerk Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key. Add VITE_CLERK_PUBLISHABLE_KEY to your .env file");
}

function RootLayout() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Authentication pages */}
        <Route path="/sign-in/*" element={<SignInPage />} />
        <Route path="/sign-up/*" element={<SignUpPage />} />
        
        {/* Dashboard (wrapped in layout) */}
        <Route 
          path="/" 
          element={
            <div className="min-h-screen bg-slate-950 text-slate-50">
              <main className="max-w-5xl mx-auto px-4 py-8">
                <App />
              </main>
            </div>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <RootLayout />
    </ClerkProvider>
  </React.StrictMode>
);