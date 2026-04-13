import { C, cardStyle } from "../styles/tokens";

export default function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 1000, padding: 20,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        ...cardStyle, background: C.bgM, border: `1px solid ${C.glassBd}`,
        width: "100%", maxWidth: 440, maxHeight: "80vh", overflow: "auto",
      }} className="fade-in">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>{title}</h3>
          <button onClick={onClose} style={{
            background: "none", border: "none", color: C.txt3, fontSize: 20, cursor: "pointer",
          }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}
