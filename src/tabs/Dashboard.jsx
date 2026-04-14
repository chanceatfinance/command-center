import { useState } from "react";
import { C, cardStyle } from "../styles/tokens";
import Card from "../components/Card";
import StatCard from "../components/StatCard";
import Badge from "../components/Badge";
import ProgressBar from "../components/ProgressBar";
import { useApi } from "../hooks/useApi";
import { getWarmestActions } from "../utils/priorities";
import { getGreeting, getDayProgress, getDaughterAge, formatCurrency, formatTime, relativeTime } from "../utils/format";

const QUOTES = [
  "The deal is in the follow-up.",
  "Your 360 tenants are your warmest leads.",
  "One conversation away from your first close.",
  "Discipline equals freedom.",
  "75 minutes of focused action beats 8 hours of busy work.",
  "Revenue-generating activities first. Everything else can wait.",
  "You don't need more time. You need more focus.",
];

export default function Dashboard({ onNavigate }) {
  const { data: taskData } = useApi("/api/tasks", 30000);
  const { data: paceData } = useApi("/api/business/pace", 60000);
  const { data: goalsData } = useApi("/api/personal", 60000);
  const { data: projectData } = useApi("/api/projects", 60000);
  const { data: emailData } = useApi("/api/emails", 60000);
  const { data: calData } = useApi("/api/calendar", 60000);
  const [quote] = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)]);

  const tasks = taskData?.tasks || [];
  const openTasks = tasks.filter(t => t.status === "open");
  const todayStr = new Date().toISOString().slice(0, 10);
  const doneToday = tasks.filter(t => t.status === "done" && t.completedAt?.startsWith(todayStr));
  const warmest = getWarmestActions(tasks, 3);
  const theOneThing = warmest[0];
  const nextUp = warmest.slice(1);

  const habits = goalsData?.habits || [];
  const totalStreak = habits.reduce((sum, h) => sum + h.streak, 0);
  const habitsCompletedToday = habits.filter(h => h.lastDate === todayStr).length;

  const activeAlerts = (projectData?.alerts || []).filter(a => !a.resolved);

  // Today's calendar
  const todayEvents = (calData?.events || [])
    .filter(e => e.start?.startsWith(todayStr))
    .sort((a, b) => a.start.localeCompare(b.start));

  // Important emails
  const importantEmails = (emailData?.emails || [])
    .filter(e => e.unread && (e.category === "action_required" || e.category === "security"))
    .slice(0, 3);

  const emailStats = emailData?.stats || {};

  return (
    <div className="fade-in">
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 12, color: C.txt3, marginBottom: 2 }}>
          {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>
          {getGreeting()}, Chance
        </h1>
        <div style={{ fontSize: 12, color: C.txt3, fontStyle: "italic", marginTop: 4 }}>
          "{quote}"
        </div>
      </div>

      {/* Day Progress */}
      <ProgressBar value={getDayProgress()} max={100} color={C.lime} height={3} />
      <div style={{ height: 12 }} />

      {/* Alerts Banner */}
      {activeAlerts.length > 0 && (
        <Card style={{
          padding: 12, marginBottom: 12,
          border: `1px solid ${C.red}30`,
          background: `${C.red}06`,
          cursor: "pointer",
        }} onClick={() => onNavigate("projects")}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 14 }}>🚨</span>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: C.red }}>{activeAlerts.length} alert{activeAlerts.length > 1 ? "s" : ""}</span>
              <span style={{ fontSize: 12, color: C.txt3 }}> — {activeAlerts[0]?.text.slice(0, 50)}...</span>
            </div>
            <span style={{ color: C.txt3, fontSize: 12 }}>→</span>
          </div>
        </Card>
      )}

      {/* THE ONE THING */}
      {theOneThing ? (
        <Card style={{
          background: `linear-gradient(135deg, ${C.limeGlow}, transparent)`,
          border: `1px solid ${C.lime}30`,
          marginBottom: 12,
          cursor: "pointer",
          padding: 16,
        }} onClick={() => onNavigate("tasks")}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.lime, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>
            The One Thing
          </div>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6, lineHeight: 1.3 }}>
            {theOneThing.text}
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <Badge text={theOneThing.category} type={theOneThing.category} />
            {theOneThing.dueDate && (
              <span style={{ fontSize: 11, color: theOneThing.dueDate <= todayStr ? C.red : C.txt3 }}>
                {theOneThing.dueDate <= todayStr ? "Overdue" : `Due ${theOneThing.dueDate}`}
              </span>
            )}
          </div>
        </Card>
      ) : (
        <Card style={{ textAlign: "center", padding: 24, marginBottom: 12 }}>
          <div style={{ fontSize: 20 }}>🎯</div>
          <div style={{ color: C.txt2, fontSize: 13 }}>No tasks — add one to get moving</div>
        </Card>
      )}

      {/* Quick Stats Row */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <StatCard label="Open" value={openTasks.length} color={C.lime} />
        <StatCard label="Done" value={doneToday.length} color={C.green} />
        <StatCard label="Habits" value={`${habitsCompletedToday}/${habits.length}`} color={C.amber} />
        <StatCard label="Mail" value={emailStats.totalUnread || 0} color={C.cyan} />
      </div>

      {/* Next Up */}
      {nextUp.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          {nextUp.map(t => (
            <Card key={t.id} style={{ padding: 10, marginBottom: 6, cursor: "pointer" }} onClick={() => onNavigate("tasks")}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{
                  width: 6, height: 6, borderRadius: 3,
                  background: t.priority === "high" ? C.red : t.priority === "medium" ? C.amber : C.txt3,
                }} />
                <span style={{ fontSize: 13, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.text}</span>
                <Badge text={t.category} type={t.category} />
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Today's Schedule */}
      <Card style={{ marginBottom: 12, cursor: "pointer" }} onClick={() => onNavigate("calendar")}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>Today's Schedule</span>
          <span style={{ fontSize: 11, color: C.txt3 }}>{todayEvents.length} event{todayEvents.length !== 1 ? "s" : ""}</span>
        </div>
        {todayEvents.length === 0 ? (
          <div style={{ fontSize: 12, color: C.txt3, textAlign: "center", padding: 8 }}>
            Calendar is clear — protect this time
          </div>
        ) : (
          todayEvents.slice(0, 4).map((e, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: C.lime, fontWeight: 600, minWidth: 55 }}>
                {formatTime(e.start)}
              </span>
              <span style={{ fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {e.summary}
              </span>
            </div>
          ))
        )}
      </Card>

      {/* Important Emails */}
      {importantEmails.length > 0 && (
        <Card style={{ marginBottom: 12, cursor: "pointer" }} onClick={() => onNavigate("emails")}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Priority Emails</div>
          {importantEmails.map(email => (
            <div key={email.id} style={{
              display: "flex", gap: 8, alignItems: "center",
              padding: "6px 0", borderBottom: `1px solid ${C.glassBd}`,
            }}>
              <span style={{ fontSize: 12 }}>{email.category === "security" ? "🔒" : "🔴"}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {email.subject}
                </div>
                <div style={{ fontSize: 11, color: C.txt3 }}>{email.from} · {relativeTime(email.date)}</div>
              </div>
            </div>
          ))}
        </Card>
      )}

      {/* Deal Progress */}
      <Card style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>$200K Goal</span>
          <span style={{ fontSize: 12, color: C.lime, fontWeight: 600 }}>
            {formatCurrency(paceData?.totalGross || 0)}
          </span>
        </div>
        <ProgressBar value={paceData?.totalGross || 0} max={paceData?.goal || 200000} color={C.lime} height={6} />
      </Card>

      {/* Family */}
      <Card style={{ marginBottom: 12, padding: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20 }}>👶</span>
          <div>
            <span style={{ fontSize: 13, fontWeight: 600 }}>Baby girl is {getDaughterAge()} old</span>
            <span style={{ fontSize: 12, color: C.txt3 }}> · Make every minute count</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
