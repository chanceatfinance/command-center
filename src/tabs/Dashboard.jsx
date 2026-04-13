import { useState, useEffect } from "react";
import { C, cardStyle } from "../styles/tokens";
import Card from "../components/Card";
import StatCard from "../components/StatCard";
import Badge from "../components/Badge";
import ProgressBar from "../components/ProgressBar";
import { useApi } from "../hooks/useApi";
import { getWarmestActions } from "../utils/priorities";
import { getGreeting, getDayProgress, getDaughterAge, formatCurrency } from "../utils/format";

const QUOTES = [
  "The deal is in the follow-up.",
  "Your 360 tenants are your warmest leads.",
  "One conversation away from your first close.",
  "Discipline equals freedom.",
  "75 minutes of focused action beats 8 hours of busy work.",
  "The best time to plant a tree was yesterday. The second best is now.",
  "Revenue-generating activities first. Everything else can wait.",
];

export default function Dashboard({ onNavigate }) {
  const { data: taskData, refresh: refreshTasks } = useApi("/api/tasks", 30000);
  const { data: paceData } = useApi("/api/business/pace", 60000);
  const { data: goalsData } = useApi("/api/personal", 60000);
  const [quote] = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)]);

  const tasks = taskData?.tasks || [];
  const openTasks = tasks.filter(t => t.status === "open");
  const doneToday = tasks.filter(t => t.status === "done" && t.completedAt?.startsWith(new Date().toISOString().slice(0, 10)));
  const warmest = getWarmestActions(tasks, 3);
  const theOneThing = warmest[0];
  const nextUp = warmest.slice(1);

  const totalStreak = (goalsData?.habits || []).reduce((sum, h) => sum + h.streak, 0);

  return (
    <div className="fade-in">
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, color: C.txt3, marginBottom: 4 }}>
          {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0 }}>
          {getGreeting()}, Chance
        </h1>
        <div style={{ fontSize: 13, color: C.txt3, fontStyle: "italic", marginTop: 6 }}>
          "{quote}"
        </div>
      </div>

      {/* Day Progress */}
      <div style={{ marginBottom: 20 }}>
        <ProgressBar value={getDayProgress()} max={100} color={C.lime} height={3} />
      </div>

      {/* THE ONE THING */}
      {theOneThing ? (
        <Card style={{
          background: `linear-gradient(135deg, ${C.limeGlow}, transparent)`,
          border: `1px solid ${C.lime}30`,
          marginBottom: 16,
          cursor: "pointer",
        }} onClick={() => onNavigate("tasks")}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.lime, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
            The One Thing
          </div>
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, lineHeight: 1.3 }}>
            {theOneThing.text}
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <Badge text={theOneThing.category} type={theOneThing.category} />
            <Badge text={theOneThing.priority} type={theOneThing.priority} />
            {theOneThing.dueDate && (
              <span style={{ fontSize: 11, color: C.txt3 }}>Due {theOneThing.dueDate}</span>
            )}
          </div>
        </Card>
      ) : (
        <Card style={{ textAlign: "center", padding: 30 }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>🎯</div>
          <div style={{ color: C.txt2 }}>No open tasks — add one to get moving</div>
        </Card>
      )}

      {/* Next Up */}
      {nextUp.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: C.txt3, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
            Next Up
          </div>
          {nextUp.map(t => (
            <Card key={t.id} style={{ padding: 14, marginBottom: 8, cursor: "pointer" }} onClick={() => onNavigate("tasks")}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 8, height: 8, borderRadius: 4,
                  background: t.priority === "high" ? C.red : t.priority === "medium" ? C.amber : C.txt3,
                  flexShrink: 0,
                }} />
                <span style={{ fontSize: 14, flex: 1 }}>{t.text}</span>
                <Badge text={t.category} type={t.category} />
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Quick Stats */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <StatCard label="Open" value={openTasks.length} color={C.lime} icon="📋" />
        <StatCard label="Done Today" value={doneToday.length} color={C.green} icon="✓" />
        <StatCard label="Streak" value={totalStreak} color={C.amber} icon="🔥" />
      </div>

      {/* Deal Progress */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>2026 Goal</span>
          <span style={{ fontSize: 13, color: C.lime, fontWeight: 600 }}>
            {formatCurrency(paceData?.totalGross || 0)} / {formatCurrency(paceData?.goal || 200000)}
          </span>
        </div>
        <ProgressBar
          value={paceData?.totalGross || 0}
          max={paceData?.goal || 200000}
          color={C.lime}
          height={8}
        />
        <div style={{ fontSize: 11, color: C.txt3, marginTop: 6 }}>
          {(paceData?.closedDeals || []).length} deals closed
        </div>
      </Card>

      {/* Family */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 24 }}>👶</span>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Baby girl is {getDaughterAge()} old</div>
            <div style={{ fontSize: 12, color: C.txt3 }}>Make every minute count</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
