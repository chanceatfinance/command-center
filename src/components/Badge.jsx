import { C } from "../styles/tokens";

const COLORS = {
  high: C.red, medium: C.amber, low: C.txt3,
  business: C.lime, personal: C.pink, urgent: C.red,
  mortgage: C.lime, suites: C.cyan, referral: C.purple, fitness: C.green,
  online: C.green, offline: C.txt3, active: C.green, inactive: C.txt3,
};

export default function Badge({ text, type }) {
  const color = COLORS[type] || COLORS[text] || C.txt2;
  return (
    <span style={{
      display: "inline-block",
      fontSize: 10,
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: "0.05em",
      color,
      background: color + "18",
      border: `1px solid ${color}30`,
      borderRadius: 6,
      padding: "2px 8px",
    }}>
      {text}
    </span>
  );
}
