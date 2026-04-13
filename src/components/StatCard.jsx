import { C, cardStyle } from "../styles/tokens";

export default function StatCard({ label, value, sub, color = C.lime, icon }) {
  return (
    <div style={{ ...cardStyle, flex: 1, minWidth: 120, textAlign: "center" }}>
      {icon && <div style={{ fontSize: 20, marginBottom: 4 }}>{icon}</div>}
      <div style={{ fontSize: 28, fontWeight: 700, color, letterSpacing: "-0.02em" }}>{value}</div>
      <div style={{ fontSize: 12, color: C.txt2, marginTop: 2 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: C.txt3, marginTop: 2 }}>{sub}</div>}
    </div>
  );
}
