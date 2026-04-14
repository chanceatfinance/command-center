import { useState } from "react";
import { C } from "./styles/tokens";
import TabBar from "./components/TabBar";
import Dashboard from "./tabs/Dashboard";
import Tasks from "./tabs/Tasks";
import Business from "./tabs/Business";
import Personal from "./tabs/Personal";
import Calendar from "./tabs/Calendar";
import QuantumEdge from "./tabs/QuantumEdge";
import Projects from "./tabs/Projects";
import Emails from "./tabs/Emails";

const TABS = {
  dashboard: Dashboard,
  tasks: Tasks,
  projects: Projects,
  emails: Emails,
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
      padding: "env(safe-area-inset-top, 12px) 12px 72px",
      minHeight: "100%",
      height: "100%",
      overflowY: "auto",
      WebkitOverflowScrolling: "touch",
    }}>
      <Tab onNavigate={setTab} />
      <TabBar active={tab} onSelect={setTab} />
    </div>
  );
}
