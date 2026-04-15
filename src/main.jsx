import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Minimal global reset
const style = document.createElement("style");
style.textContent = `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body, #root { height: 100%; width: 100%; background: #0a0a0a; overflow: hidden; -webkit-text-size-adjust: 100%; -webkit-tap-highlight-color: transparent; }
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
input, select, textarea, button { font-family: inherit; }
`;
document.head.appendChild(style);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode><App /></React.StrictMode>
);
