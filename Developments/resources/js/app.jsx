// resources/js/app.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./AppRouter";   // import App.jsx
import "../css/app.css";        // css nếu có
import UserManagement from "./pages/UserManagement";

const container = document.getElementById("app");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
