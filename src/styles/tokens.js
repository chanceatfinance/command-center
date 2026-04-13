export const C = {
  bg: "#0a0a0a",
  bgL: "#111113",
  bgM: "#1a1a1c",
  card: "#161618",
  glass: "rgba(255,255,255,0.05)",
  glassBd: "rgba(255,255,255,0.10)",
  glassHover: "rgba(255,255,255,0.08)",
  // Text
  txt: "rgba(240,240,240,0.92)",
  txt2: "rgba(240,240,240,0.55)",
  txt3: "rgba(240,240,240,0.30)",
  white: "#f0f0f0",
  // Accents
  lime: "#ebff45",
  limeGlow: "rgba(235,255,69,0.12)",
  cyan: "#5ce1ff",
  pink: "#ff1493",
  green: "#5eea96",
  red: "#ff5555",
  amber: "#fbbf24",
  purple: "#a78bfa",
  blue: "#3b82f6",
  orange: "#f7931a",
  // Semantic
  mortgage: "#ebff45",
  suites: "#5ce1ff",
  personal: "#ff1493",
  done: "#5eea96",
  urgent: "#ff5555",
};

export const font = "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

export const cardStyle = {
  background: C.glass,
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: `1px solid ${C.glassBd}`,
  borderRadius: 16,
  padding: 20,
};

export const pillStyle = (active) => ({
  background: active ? C.lime : C.glass,
  color: active ? C.bg : C.txt2,
  border: `1px solid ${active ? C.lime : C.glassBd}`,
  borderRadius: 20,
  padding: "7px 14px",
  fontSize: 12,
  fontWeight: 600,
  cursor: "pointer",
  fontFamily: "inherit",
  transition: "all 0.15s",
});

export const inputStyle = {
  background: C.glass,
  border: `1px solid ${C.glassBd}`,
  borderRadius: 10,
  padding: "10px 14px",
  color: C.white,
  fontSize: 14,
  outline: "none",
  fontFamily: "inherit",
  width: "100%",
  boxSizing: "border-box",
};

export const btnStyle = (bg = C.lime, fg = C.bg) => ({
  background: bg,
  color: fg,
  border: "none",
  borderRadius: 10,
  padding: "10px 18px",
  fontWeight: 600,
  fontSize: 13,
  cursor: "pointer",
  fontFamily: "inherit",
  transition: "opacity 0.15s",
});
