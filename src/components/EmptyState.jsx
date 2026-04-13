import { C } from "../styles/tokens";

export default function EmptyState({ icon = "📭", title, message }) {
  return (
    <div style={{ textAlign: "center", padding: "40px 20px", color: C.txt3 }}>
      <div style={{ fontSize: 36, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontSize: 15, fontWeight: 600, color: C.txt2, marginBottom: 6 }}>{title}</div>
      {message && <div style={{ fontSize: 13 }}>{message}</div>}
    </div>
  );
}
