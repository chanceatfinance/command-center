import { useState } from "react";
import { C } from "./styles/tokens";
import TabBar from "./components/TabBar";
import Dashboard from "./tabs/Dashboard";
import Tasks from "./tabs/Tasks";
import Business from "./tabs/Business";
import Personal from "./tabs/Personal";
import Calendar from "./tabs/Calendar";
import QuantumEdge from "./tabs/QuantumEdge";

const TABS = {
  dashboard: Dashboard,
  tasks: Tasks,
  business: Business,
  personal: Personal,
  calendar: Calendar,
  quantum: QuantumEdge,
};

export default function App() {
  const [tab, setTab] = useState("dashboard");
  const Tab = TABS[tab];

  return (
    <div style={{
      maxWidth: 600,
      margin: "0 auto",
      padding: "16px 16px 80px",
      minHeight: "100vh",
      overflowY: "auto",
      height: "100vh",
    }}>
      <Tab onNavigate={setTab} />
      <TabBar active={tab} onSelect={setTab} />
    </div>
  );
}
