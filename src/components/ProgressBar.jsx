import { C } from "../styles/tokens";

export default function ProgressBar({ value, max, color = C.lime, height = 6, label }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div>
      {label && (
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 11, color: C.txt2 }}>
          <span>{label}</span>
          <span>{Math.round(pct)}%</span>
        </div>
      )}
      <div style={{ background: C.glass, borderRadius: height, height, overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${pct}%`, background: color,
          borderRadius: height, transition: "width 0.5s ease",
        }} />
      </div>
    </div>
  );
}
