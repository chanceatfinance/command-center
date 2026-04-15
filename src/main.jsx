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

/* Ambient aurora animation */
@keyframes aurora {
  0% { transform: translate(0%, 0%) rotate(0deg) scale(1); }
  25% { transform: translate(10%, -15%) rotate(45deg) scale(1.1); }
  50% { transform: translate(-5%, 10%) rotate(90deg) scale(0.95); }
  75% { transform: translate(-10%, -5%) rotate(135deg) scale(1.05); }
  100% { transform: translate(0%, 0%) rotate(180deg) scale(1); }
}
@keyframes aurora2 {
  0% { transform: translate(0%, 0%) rotate(180deg) scale(1.05); }
  25% { transform: translate(-15%, 10%) rotate(225deg) scale(0.95); }
  50% { transform: translate(10%, -10%) rotate(270deg) scale(1.1); }
  75% { transform: translate(5%, 15%) rotate(315deg) scale(1); }
  100% { transform: translate(0%, 0%) rotate(360deg) scale(1.05); }
}
@keyframes aurora3 {
  0% { transform: translate(5%, -5%) rotate(90deg) scale(1); }
  33% { transform: translate(-10%, 10%) rotate(180deg) scale(1.15); }
  66% { transform: translate(10%, 5%) rotate(270deg) scale(0.9); }
  100% { transform: translate(5%, -5%) rotate(450deg) scale(1); }
}
`;
document.head.appendChild(style);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode><App /></React.StrictMode>
);
