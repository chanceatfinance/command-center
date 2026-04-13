import { C } from "../styles/tokens";

const TABS = [
  { key: "dashboard", label: "Home", icon: "⚡" },
  { key: "tasks", label: "Tasks", icon: "✓" },
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
      padding: "6px 0 env(safe-area-inset-bottom, 6px)",
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 100,
    }}>
      {TABS.map(t => {
        const isActive = active === t.key;
        return (
          <button
            key={t.key}
            onClick={() => onSelect(t.key)}
            style={{
              flex: 1,
              background: "none",
              border: "none",
              color: isActive ? C.lime : C.txt3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              padding: "8px 0",
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "color 0.15s",
              position: "relative",
            }}
          >
            {isActive && (
              <div style={{
                position: "absolute", top: -1, left: "25%", right: "25%",
                height: 2, background: C.lime, borderRadius: 1,
              }} />
            )}
            <span style={{ fontSize: 18 }}>{t.icon}</span>
            <span style={{ fontSize: 10, fontWeight: isActive ? 700 : 500 }}>{t.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
