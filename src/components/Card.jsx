import { cardStyle } from "../styles/tokens";

export default function Card({ children, style, onClick }) {
  return (
    <div onClick={onClick} style={{ ...cardStyle, ...style }}>
      {children}
    </div>
  );
}
