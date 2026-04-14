import { C } from "../styles/tokens";

const TABS = [
  { key: "dashboard", label: "Home", icon: "⚡" },
  { key: "tasks", label: "Tasks", icon: "✓" },
  { key: "emails", label: "Mail", icon: "📬" },
  { key: "projects", label: "Hub", icon: "🎯" },
  { key: "business", label: "Biz", icon: "🏦" },
  { key: "personal", label: "Life", icon: "🧬" },
  { key: "calendar", label: "Cal", icon: "📅" },
  { key: "quantum", label: "QE", icon: "📈" },
];

export default function TabBar({ active, onSelect }) {
  return (
    <nav style={{
      display: "flex",
      borderTop: `1px solid ${C.glassBd}`,
      background: C.bgL,
      padding: "4px 0 env(safe-area-inset-bottom, 4px)",
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
    }}>
      {TABS.map(t => {
        const isActive = active === t.key;
        return (
          <button
            key={t.key}
            onClick={() => onSelect(t.key)}
            style={{
              flex: "1 1 0",
              minWidth: 0,
              background: "none",
              border: "none",
              color: isActive ? C.lime : C.txt3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
              padding: "6px 4px",
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "color 0.15s",
              position: "relative",
            }}
          >
            {isActive && (
              <div style={{
                position: "absolute", top: -1, left: "20%", right: "20%",
                height: 2, background: C.lime, borderRadius: 1,
              }} />
            )}
            <span style={{ fontSize: 16 }}>{t.icon}</span>
            <span style={{ fontSize: 9, fontWeight: isActive ? 700 : 500 }}>{t.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
