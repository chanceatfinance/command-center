import { useState, useEffect, useCallback } from "react";

// ── Colors ──────────────────────────────────────────────────────────
const CLR = {
  bg: "#0a0a0a", card: "#141414", border: "#1f1f1f", nav: "#111", navBorder: "#1a1a1a",
  text: "#f0f0f0", dim: "#999", muted: "#666", faint: "#444",
  lime: "#EBFF45", cyan: "#00D4FF", pink: "#FF6B9D", purple: "#A78BFA",
  green: "#4ADE80", red: "#FF4444", orange: "#FF8C00", blue: "#3B82F6",
};
const ACCT = {
  "chanceatfinance@gmail.com": { label: "AFF", color: CLR.lime },
  "chance@360suitesla.com": { label: "360", color: CLR.cyan },
  "chancecstevens@gmail.com": { label: "Personal", color: CLR.pink },
  "chance@affloans.com": { label: "AFF Loans", color: CLR.purple },
};
const PRIO_CLR = { critical: CLR.red, high: CLR.orange, medium: CLR.lime, low: CLR.muted };
const font = "'SF Pro Display',-apple-system,system-ui,sans-serif";

// ── Styles ──────────────────────────────────────────────────────────
const S = {
  card: { background: CLR.card, border: `1px solid ${CLR.border}`, borderRadius: 12, padding: 14, marginBottom: 10 },
  stat: (c) => ({ flex: 1, textAlign: "center", padding: 10, background: "#1a1a1a", borderRadius: 10, border: `1px solid ${c}33` }),
  pill: (c) => ({ display: "inline-block", padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700, textTransform: "uppercase", background: c + "22", color: c, marginRight: 4 }),
  section: { fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8, marginTop: 16 },
  bar: (pct, c) => ({ height: 6, borderRadius: 3, background: CLR.border, overflow: "hidden", children: null }),
  btn: (active) => ({ padding: "6px 12px", borderRadius: 8, border: `1px solid ${active ? CLR.lime : CLR.border}`, background: active ? CLR.lime + "18" : "transparent", color: active ? CLR.lime : CLR.muted, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: font }),
};
function Bar({ pct, color = CLR.lime, h = 6 }) {
  return <div style={{ height: h, borderRadius: h / 2, background: CLR.border, overflow: "hidden" }}>
    <div style={{ height: "100%", width: `${Math.min(pct, 100)}%`, background: color, borderRadius: h / 2, transition: "width 0.4s" }} />
  </div>;
}
function Pill({ text, color }) { return <span style={S.pill(color)}>{text}</span>; }
function Stat({ label, value, color = CLR.lime }) {
  return <div style={S.stat(color)}><div style={{ fontSize: 22, fontWeight: 700, color }}>{value}</div><div style={{ fontSize: 10, color: CLR.muted, marginTop: 2 }}>{label}</div></div>;
}

// ── Helpers ──────────────────────────────────────────────────────────
function weekdaysSince(start) {
  let d = new Date(start), now = new Date(), count = 0;
  while (d <= now) { const dow = d.getDay(); if (dow > 0 && dow < 6) count++; d.setDate(d.getDate() + 1); }
  return count;
}
const suitesYTD = () => weekdaysSince("2026-01-01") * 236.80;
function greeting() { const h = new Date().getHours(); return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening"; }
function babyAge() {
  const born = new Date("2025-07-15"), now = new Date();
  const m = (now.getFullYear() - born.getFullYear()) * 12 + now.getMonth() - born.getMonth();
  return m < 24 ? `${m} months old` : `${Math.floor(m / 12)}y ${m % 12}m old`;
}
function daysBetween(a, b) { return Math.floor((new Date(b) - new Date(a)) / 86400000); }
const fmtDate = (d) => new Date(d).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
const fmtTime = (d) => new Date(d).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
const fmtK = (n) => n >= 1000 ? `$${(n / 1000).toFixed(1)}K` : `$${n.toLocaleString()}`;

const QUOTES = [
  "You don't need more time. You need more focus.",
  "Your 360 tenants are your warmest leads.",
  "Be the dad your daughter thinks you are.",
  "The deal is in the follow-up.",
  "One conversation away from your first close.",
  "Discipline equals freedom.",
  "75 minutes of focused action beats 8 hours of busy work.",
  "Revenue-generating activities first. Everything else can wait.",
  "Stop planning. Start doing.",
  "Your network is your net worth.",
];
const HUSBAND_TIPS = [
  "Plan a surprise date night this week.",
  "Put the phone away during dinner — be fully present.",
  "Ask her about her day before talking about yours.",
  "Tell her she's a great mom.",
  "Send her a midday text just to say you're thinking of her.",
  "Do one chore she usually handles without being asked.",
  "Write her a quick love note and leave it somewhere she'll find it.",
  "Compliment something specific — not just 'you look nice.'",
  "Listen without trying to fix anything.",
  "Remember: you're on the same team.",
];
const dailyIndex = () => Math.floor(Date.now() / 86400000);

// ── Default Data ────────────────────────────────────────────────────
const DEFAULT_TASKS = [
  { id: "t1", text: "Close first mortgage deal — 60 day sprint", cat: "mortgage", priority: "critical", status: "doing", due: "2026-06-14" },
  { id: "t4", text: "Send 12 Tier 1 referral partner outreach drafts", cat: "mortgage", priority: "high", status: "todo" },
  { id: "t5", text: "GoHighLevel — subscribe or cancel by Apr 17", cat: "mortgage", priority: "critical", status: "todo", due: "2026-04-17" },
  { id: "t6", text: "Verify Lead Connector + Gmail access", cat: "mortgage", priority: "medium", status: "todo" },
  { id: "t7", text: "Verify Google account recovery event Apr 5", cat: "personal", priority: "medium", status: "todo" },
  { id: "t8", text: "Constellation Rd #398 — new building under contract", cat: "suites", priority: "medium", status: "doing" },
  { id: "t10", text: "Get to EOS — any workout counts", cat: "personal", priority: "high", status: "todo" },
  { id: "t11", text: "Schedule Marek Health baseline labs", cat: "personal", priority: "low", status: "todo" },
  { id: "t12", text: "CA smog check + DMV renewal by June 2", cat: "personal", priority: "low", status: "todo", due: "2026-06-02" },
  { id: "t13", text: "Set up CapCut Pro + Metricool accounts", cat: "mortgage", priority: "high", status: "todo" },
  { id: "t14", text: "Create Google Drive 'Content Machine' folder for raw footage", cat: "mortgage", priority: "high", status: "todo" },
  { id: "t15", text: "Monday batch film: 2 mortgage tips + 1 operator + 1 local", cat: "mortgage", priority: "high", status: "todo" },
  { id: "t16", text: "Friday batch film: 2 new construction walkthroughs + 1 mortgage + 1 car clip", cat: "mortgage", priority: "high", status: "todo" },
];
const DEFAULT_HABITS = [
  { id: "h1", name: "5:15 Workout", icon: "💪", done: false },
  { id: "h2", name: "Mortgage block", icon: "🏦", done: false },
  { id: "h3", name: "Content posted", icon: "🎬", done: false },
  { id: "h4", name: "Prospecting", icon: "🎯", done: false },
  { id: "h5", name: "Family time", icon: "👨‍👩‍👧", done: false },
  { id: "h6", name: "Read/Yoga", icon: "📖", done: false },
];
const DEFAULT_XP_ACTIONS = [
  { id: "x1", pillar: "dad", name: "Avery bath + bedtime routine", xp: 15, done: false },
  { id: "x2", pillar: "dad", name: "Quality playtime with Avery", xp: 15, done: false },
  { id: "x3", pillar: "husband", name: "Dinner with Tatum (phone away)", xp: 15, done: false },
  { id: "x4", pillar: "husband", name: "Thoughtful gesture for Tatum", xp: 15, done: false },
  { id: "x5", pillar: "friend", name: "Reach out to a friend", xp: 10, done: false },
  { id: "x6", pillar: "friend", name: "Help someone without being asked", xp: 15, done: false },
  { id: "x7", pillar: "entrepreneur", name: "7-8:15 AM mortgage block completed", xp: 20, done: false },
  { id: "x8", pillar: "entrepreneur", name: "Prospecting call or email", xp: 10, done: false },
  { id: "x9", pillar: "entrepreneur", name: "Lead follow-up in GHL", xp: 15, done: false },
  { id: "x15", pillar: "entrepreneur", name: "Content edited + posted", xp: 10, done: false },
  { id: "x16", pillar: "entrepreneur", name: "Batch filmed (Mon/Fri)", xp: 20, done: false },
  { id: "x10", pillar: "health", name: "5:15 AM workout completed", xp: 20, done: false },
  { id: "x17", pillar: "health", name: "Protein shakes (AM + PM)", xp: 10, done: false },
  { id: "x11", pillar: "health", name: "Electrolytes + creatine", xp: 5, done: false },
  { id: "x12", pillar: "health", name: "Clean meals all day", xp: 10, done: false },
  { id: "x13", pillar: "faith", name: "9:30 PM read or yoga", xp: 15, done: false },
  { id: "x14", pillar: "faith", name: "Gratitude / prayer / meditation", xp: 10, done: false },
];
const PILLARS = [
  { key: "dad", icon: "👨‍👧", label: "Dad", color: CLR.pink },
  { key: "husband", icon: "💍", label: "Husband", color: CLR.lime },
  { key: "friend", icon: "🤝", label: "Friend", color: CLR.cyan },
  { key: "entrepreneur", icon: "🏦", label: "Entrepreneur", color: CLR.purple },
  { key: "health", icon: "💪", label: "Health", color: CLR.green },
  { key: "faith", icon: "🙏", label: "Faith", color: "#FB923C" },
];
const DEFAULT_CAL = [
  { id: "c2", summary: "Pipeline Meeting", start: "2026-04-14T10:30:00", end: "2026-04-14T11:30:00", acct: "chance@affloans.com" },
  { id: "c3", summary: "Loan Bro Meeting", start: "2026-04-14T11:00:00", end: "2026-04-14T11:30:00", acct: "chanceatfinance@gmail.com" },
  { id: "c4", summary: "360 Suites Mastermind Workshop", start: "2026-04-14T12:00:00", end: "2026-04-14T14:00:00", acct: "chance@360suitesla.com" },
  { id: "c9", summary: "GHL Trial Expires Tonight!", start: "2026-04-17T22:44:00", end: "2026-04-17T23:00:00", acct: "chanceatfinance@gmail.com" },
  { id: "c14", summary: "Debbie training — Old Rd", start: "2026-04-15T10:00:00", end: "2026-04-15T12:00:00", acct: "chance@360suitesla.com" },
  { id: "c15", summary: "Josh property walkthrough", start: "2026-04-17T09:00:00", end: "2026-04-17T10:00:00", acct: "chance@360suitesla.com" },
];
const DEFAULT_EMAILS = [
  { id: "e1", from: "HighLevel Inc.", subject: "Your trial ends soon", snippet: "Trial ends April 17 at 10:44 PM PDT.", acct: "chanceatfinance@gmail.com", date: "2026-04-11T05:45:00Z", priority: "critical" },
  { id: "e2", from: "Google", subject: "Security alert — Lead Connector", snippet: "You allowed Lead Connector access to your Google Account.", acct: "chanceatfinance@gmail.com", date: "2026-04-11T07:12:00Z", priority: "high" },
  { id: "e3", from: "Google", subject: "Security alert — Leadconnector for Gmail", snippet: "You allowed Leadconnector for Gmail access.", acct: "chanceatfinance@gmail.com", date: "2026-04-11T07:11:00Z", priority: "high" },
  { id: "e4", from: "Anthropic, PBC", subject: "Your receipt #2809-7248-1793", snippet: "Your receipt from Anthropic.", acct: "chanceatfinance@gmail.com", date: "2026-04-13T00:33:00Z", priority: "low" },
  { id: "e5", from: "Render", subject: "Build failed for command-center", snippet: "Exited with status 127.", acct: "chanceatfinance@gmail.com", date: "2026-04-14T04:03:00Z", priority: "medium" },
  { id: "e6", from: "Claude Team", subject: "Tips to get the most out of Claude Code", snippet: "Power user shortcuts and tips.", acct: "chanceatfinance@gmail.com", date: "2026-04-07T14:59:00Z", priority: "low" },
];
const ALERTS = [
  { id: "a1", text: "GoHighLevel trial expires Apr 17 @ 10:44 PM PDT", priority: "critical", due: "2026-04-17" },
  { id: "a2", text: "Lead Connector Google access — verify intentional", priority: "high" },
  { id: "a3", text: "Google account recovery event Apr 5 — verify", priority: "medium" },
  { id: "a4", text: "Tue Apr 14: Pipeline 10:30 + Loan Bro 11:00 + Mastermind 12:00 overlap", priority: "high", due: "2026-04-14" },
];

// ── Load/Save State ─────────────────────────────────────────────────
const KEY = "cc_v2_state";
function loadState() {
  try { const s = localStorage.getItem(KEY); return s ? JSON.parse(s) : null; } catch { return null; }
}
function saveState(state) {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
}

// ════════════════════════════════════════════════════════════════════
// APP
// ════════════════════════════════════════════════════════════════════
export default function App() {
  const saved = loadState();
  const [tab, setTab] = useState("home");
  const [tasks, setTasks] = useState(saved?.tasks || DEFAULT_TASKS);
  const [habits, setHabits] = useState(saved?.habits || DEFAULT_HABITS);
  const [xpActions, setXpActions] = useState(saved?.xpActions || DEFAULT_XP_ACTIONS);
  const [totalXP, setTotalXP] = useState(saved?.totalXP || 0);
  const [calDay, setCalDay] = useState(new Date().toISOString().slice(0, 10));
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({ text: "", cat: "mortgage", priority: "medium" });

  const level = Math.floor(totalXP / 100) + 1;
  const xpInLevel = totalXP % 100;
  const todayXP = xpActions.filter(a => a.done).reduce((s, a) => s + a.xp, 0);
  const totalPossibleXP = xpActions.reduce((s, a) => s + a.xp, 0);

  // Persist
  useEffect(() => { saveState({ tasks, habits, xpActions, totalXP }); }, [tasks, habits, xpActions, totalXP]);

  // Also sync tasks to backend for Claude session access
  useEffect(() => {
    fetch("/api/tasks", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ tasks, lastModified: new Date().toISOString() }) }).catch(() => {});
  }, [tasks]);

  const todayStr = new Date().toISOString().slice(0, 10);
  const openTasks = tasks.filter(t => t.status !== "done");
  const doneTasks = tasks.filter(t => t.status === "done");
  const habitsToday = habits.filter(h => h.done).length;
  const theOneThing = tasks.filter(t => t.status !== "done").sort((a, b) => {
    const po = { critical: 0, high: 1, medium: 2, low: 3 };
    if (a.status === "doing" && b.status !== "doing") return -1;
    if (b.status === "doing" && a.status !== "doing") return 1;
    return (po[a.priority] || 9) - (po[b.priority] || 9);
  })[0];

  const income360 = suitesYTD();

  function toggleHabit(id) { setHabits(h => h.map(x => x.id === id ? { ...x, done: !x.done } : x)); }
  function toggleXP(id) {
    setXpActions(a => {
      const updated = a.map(x => x.id === id ? { ...x, done: !x.done } : x);
      const newTotal = updated.filter(x => x.done).reduce((s, x) => s + x.xp, 0);
      setTotalXP(newTotal);
      return updated;
    });
  }
  function cycleTaskStatus(id) {
    setTasks(t => t.map(x => x.id === id ? { ...x, status: x.status === "todo" ? "doing" : x.status === "doing" ? "done" : "todo" } : x));
  }
  function deleteTask(id) { setTasks(t => t.filter(x => x.id !== id)); }
  function addTask() {
    if (!newTask.text.trim()) return;
    setTasks(t => [...t, { id: `t_${Date.now()}`, text: newTask.text, cat: newTask.cat, priority: newTask.priority, status: "todo" }]);
    setNewTask({ text: "", cat: "mortgage", priority: "medium" });
    setShowAddTask(false);
  }

  const statusIcon = { todo: "⬜", doing: "🔵", done: "✅" };
  const catIcon = { mortgage: "🏦", suites: "🏢", personal: "👤" };

  // ── TAB: HOME ───────────────────────────────────────────────────
  function HomeTab() {
    const todayEvents = DEFAULT_CAL.filter(e => e.start.startsWith(todayStr)).sort((a, b) => a.start.localeCompare(b.start));
    return <>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: CLR.muted }}>{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</div>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: "2px 0 0" }}>{greeting()}, Chance</h1>
        <div style={{ fontSize: 12, color: CLR.lime, fontStyle: "italic", marginTop: 4 }}>"{QUOTES[dailyIndex() % QUOTES.length]}"</div>
      </div>

      {ALERTS.length > 0 && <div style={{ ...S.card, border: `1px solid ${CLR.red}33`, background: `${CLR.red}08`, cursor: "pointer" }} onClick={() => setTab("hub")}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span>🚨</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: CLR.red }}>{ALERTS.length} alerts</span>
          <span style={{ fontSize: 12, color: CLR.muted, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>— {ALERTS[0].text}</span>
          <span style={{ color: CLR.muted }}>→</span>
        </div>
      </div>}

      {theOneThing && <div style={{ ...S.card, border: `1px solid ${CLR.lime}44`, background: `${CLR.lime}08` }} onClick={() => setTab("tasks")}>
        <div style={{ fontSize: 10, fontWeight: 700, color: CLR.lime, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>The One Thing</div>
        <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>{theOneThing.text}</div>
        <div><Pill text={theOneThing.priority} color={PRIO_CLR[theOneThing.priority]} />{theOneThing.due && <span style={{ fontSize: 11, color: theOneThing.due <= todayStr ? CLR.red : CLR.muted }}>{theOneThing.due <= todayStr ? "OVERDUE" : `Due ${theOneThing.due}`}</span>}</div>
      </div>}

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <Stat label="Open" value={openTasks.length} color={CLR.lime} />
        <Stat label="Done" value={doneTasks.length} color={CLR.green} />
        <Stat label="Habits" value={`${habitsToday}/5`} color={CLR.orange} />
        <Stat label={`Lv${level}`} value={`${xpInLevel}xp`} color={CLR.purple} />
      </div>

      {todayEvents.length > 0 && <div style={S.card}>
        <div style={S.section}>Today's Schedule</div>
        {todayEvents.map(e => {
          const a = ACCT[e.acct] || { label: "?", color: CLR.muted };
          return <div key={e.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: a.color, fontWeight: 600, minWidth: 55 }}>{fmtTime(e.start)}</span>
            <span style={{ fontSize: 12, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.summary}</span>
            <Pill text={a.label} color={a.color} />
          </div>;
        })}
      </div>}

      <div style={S.card}>
        <div style={S.section}>Priority Emails</div>
        {DEFAULT_EMAILS.filter(e => e.priority === "critical" || e.priority === "high").map(e => {
          const a = ACCT[e.acct] || { label: "?", color: CLR.muted };
          return <div key={e.id} style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "6px 0", borderBottom: `1px solid ${CLR.border}` }}>
            <span style={{ fontSize: 12 }}>{e.priority === "critical" ? "🔴" : "🟡"}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.subject}</div>
              <div style={{ fontSize: 11, color: CLR.muted }}>{e.from}</div>
            </div>
            <Pill text={a.label} color={a.color} />
          </div>;
        })}
      </div>

      <div style={S.card}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>$200K Goal</span>
          <span style={{ fontSize: 12, color: CLR.lime }}>{fmtK(income360)} / $200K</span>
        </div>
        <Bar pct={(income360 / 200000) * 100} />
        <div style={{ fontSize: 11, color: CLR.muted, marginTop: 4 }}>360 W-2: {fmtK(income360)} · Mortgage: $0</div>
      </div>

      {/* Daily Schedule */}
      {(() => {
        const SCHED = [
          { time: "5:00", label: "Electrolytes + creatine", icon: "💧", block: "health" },
          { time: "5:15", label: "Workout", icon: "💪", block: "health" },
          { time: "6:10", label: "Protein shake + vitamins + shower", icon: "🥤", block: "health" },
          { time: "6:30", label: "Take dogs out", icon: "🐕", block: "personal" },
          { time: "7:00", label: "Mortgage debrief / work / content", icon: "🏦", block: "business" },
          { time: "8:15", label: "Breakfast — protein yogurt + coffee", icon: "☕", block: "personal" },
          { time: "8:30", label: "Edit + post content", icon: "🎬", block: "business" },
          { time: "9:00", label: "360 Suites", icon: "🏢", block: "suites" },
          { time: "12:30", label: "Home — take dogs out", icon: "🐕", block: "personal" },
          { time: "1:00", label: "Lunch + 360 Suites PM", icon: "🏢", block: "suites" },
          { time: "5:00", label: "Take dogs out", icon: "🐕", block: "personal" },
          { time: "6:00", label: "Dinner + family time", icon: "👨‍👩‍👧", block: "family" },
          { time: "8:30", label: "Avery bath", icon: "🛁", block: "family" },
          { time: "9:00", label: "Protein shake", icon: "🥤", block: "health" },
          { time: "9:30", label: "Read / yoga", icon: "📖", block: "faith" },
          { time: "10:00", label: "Bed", icon: "😴", block: "personal" },
        ];
        const blockColor = { health: CLR.green, business: CLR.lime, suites: CLR.cyan, personal: CLR.muted, family: CLR.pink, faith: "#FB923C" };
        const nowH = new Date().getHours(), nowM = new Date().getMinutes();
        const nowTotal = nowH * 60 + nowM;
        return <div style={S.card}>
          <div style={S.section}>Daily Schedule</div>
          {SCHED.map((s, i) => {
            const [h, m] = s.time.split(":").map(Number);
            const sTotal = h * 60 + m;
            const nextTotal = i < SCHED.length - 1 ? (() => { const [nh, nm] = SCHED[i+1].time.split(":").map(Number); return nh * 60 + nm; })() : 1440;
            const isCurrent = nowTotal >= sTotal && nowTotal < nextTotal;
            const isPast = nowTotal >= nextTotal;
            return <div key={i} style={{
              display: "flex", alignItems: "center", gap: 8, padding: "5px 0",
              borderLeft: isCurrent ? `3px solid ${CLR.lime}` : "3px solid transparent",
              paddingLeft: 8, opacity: isPast ? 0.4 : 1,
              background: isCurrent ? `${CLR.lime}08` : "transparent", borderRadius: isCurrent ? 6 : 0,
            }}>
              <span style={{ fontSize: 10, color: blockColor[s.block] || CLR.muted, fontWeight: 600, minWidth: 38 }}>{s.time}</span>
              <span style={{ fontSize: 12 }}>{s.icon}</span>
              <span style={{ fontSize: 12, color: isCurrent ? CLR.text : CLR.muted }}>{s.label}</span>
            </div>;
          })}
        </div>;
      })()}

      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        <div style={{ ...S.card, flex: 1, textAlign: "center" }}>
          <div style={{ fontSize: 24 }}>💍</div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>Tatum</div>
          <div style={{ fontSize: 10, color: CLR.muted }}>Married 11/13/24</div>
          <div style={{ fontSize: 10, color: CLR.muted }}>Together since 9/5/16</div>
          <div style={{ fontSize: 10, color: CLR.lime, fontStyle: "italic", marginTop: 4 }}>{HUSBAND_TIPS[dailyIndex() % HUSBAND_TIPS.length]}</div>
        </div>
        <div style={{ ...S.card, flex: 1, textAlign: "center" }}>
          <div style={{ fontSize: 24 }}>👶</div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>Avery</div>
          <div style={{ fontSize: 10, color: CLR.muted }}>{babyAge()}</div>
          <div style={{ fontSize: 10, color: CLR.muted }}>Born July 15, 2025</div>
        </div>
      </div>
    </>;
  }

  // ── TAB: TASKS ──────────────────────────────────────────────────
  function TasksTab() {
    const [catF, setCatF] = useState("all");
    const [statusF, setStatusF] = useState("all");
    const filtered = tasks.filter(t => (catF === "all" || t.cat === catF) && (statusF === "all" || t.status === statusF));
    const sorted = [...filtered].sort((a, b) => {
      const so = { doing: 0, todo: 1, done: 2 }; const po = { critical: 0, high: 1, medium: 2, low: 3 };
      if (so[a.status] !== so[b.status]) return so[a.status] - so[b.status];
      return (po[a.priority] || 9) - (po[b.priority] || 9);
    });
    const counts = { todo: tasks.filter(t => t.status === "todo").length, doing: tasks.filter(t => t.status === "doing").length, done: tasks.filter(t => t.status === "done").length };

    return <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Tasks</h2>
        <button onClick={() => setShowAddTask(true)} style={{ ...S.btn(true), padding: "8px 14px" }}>+ Add</button>
      </div>
      <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
        {[["all", "All"], ["mortgage", "🏦 Mortgage"], ["suites", "🏢 360"], ["personal", "👤 Personal"]].map(([k, l]) =>
          <button key={k} onClick={() => setCatF(k)} style={S.btn(catF === k)}>{l}</button>)}
      </div>
      <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
        {[["all", "All"], ["todo", "⬜ To Do"], ["doing", "🔵 Doing"], ["done", "✅ Done"]].map(([k, l]) =>
          <button key={k} onClick={() => setStatusF(k)} style={S.btn(statusF === k)}>{l}</button>)}
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <Stat label="To Do" value={counts.todo} color={CLR.muted} />
        <Stat label="In Progress" value={counts.doing} color={CLR.blue} />
        <Stat label="Done" value={counts.done} color={CLR.green} />
      </div>
      {sorted.map(t => <div key={t.id} style={{ ...S.card, display: "flex", alignItems: "flex-start", gap: 10, opacity: t.status === "done" ? 0.5 : 1 }}>
        <span onClick={() => cycleTaskStatus(t.id)} style={{ cursor: "pointer", fontSize: 18, marginTop: 1 }}>{statusIcon[t.status]}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, textDecoration: t.status === "done" ? "line-through" : "none", marginBottom: 4 }}>{t.text}</div>
          <div><Pill text={t.cat} color={t.cat === "mortgage" ? CLR.lime : t.cat === "suites" ? CLR.cyan : CLR.pink} />
          <Pill text={t.priority} color={PRIO_CLR[t.priority]} />
          {t.due && <span style={{ fontSize: 10, color: t.due <= todayStr ? CLR.red : CLR.muted }}>{t.due <= todayStr ? "OVERDUE " : ""}{t.due}</span>}</div>
        </div>
        <span onClick={() => deleteTask(t.id)} style={{ cursor: "pointer", color: CLR.muted, fontSize: 16 }}>×</span>
      </div>)}
      {showAddTask && <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 16 }}>
        <div style={{ ...S.card, background: "#1a1a1a", width: "100%", maxWidth: 400 }} onClick={e => e.stopPropagation()}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Add Task</h3>
          <input value={newTask.text} onChange={e => setNewTask({ ...newTask, text: e.target.value })} placeholder="What needs to get done?" onKeyDown={e => e.key === "Enter" && addTask()}
            style={{ width: "100%", padding: 10, background: CLR.card, border: `1px solid ${CLR.border}`, borderRadius: 8, color: CLR.text, fontSize: 14, outline: "none", fontFamily: font, marginBottom: 10, boxSizing: "border-box" }} autoFocus />
          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            <select value={newTask.cat} onChange={e => setNewTask({ ...newTask, cat: e.target.value })} style={{ flex: 1, padding: 8, background: CLR.card, border: `1px solid ${CLR.border}`, borderRadius: 8, color: CLR.text, fontSize: 12, fontFamily: font }}>
              <option value="mortgage">🏦 Mortgage</option><option value="suites">🏢 360 Suites</option><option value="personal">👤 Personal</option>
            </select>
            <select value={newTask.priority} onChange={e => setNewTask({ ...newTask, priority: e.target.value })} style={{ flex: 1, padding: 8, background: CLR.card, border: `1px solid ${CLR.border}`, borderRadius: 8, color: CLR.text, fontSize: 12, fontFamily: font }}>
              <option value="critical">Critical</option><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option>
            </select>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={addTask} style={{ ...S.btn(true), flex: 1, padding: 12 }}>Add</button>
            <button onClick={() => setShowAddTask(false)} style={{ ...S.btn(false), flex: 1, padding: 12 }}>Cancel</button>
          </div>
        </div>
      </div>}
    </>;
  }

  // ── TAB: HUB ────────────────────────────────────────────────────
  function HubTab() {
    const projects = [
      { name: "First Mortgage Deal", color: CLR.red, priority: "critical", desc: "Close first mortgage deal — 60-day window. 0 pipeline opportunities." },
      { name: "Referral Partners", color: CLR.orange, priority: "high", desc: "Build from 2 to 10. 12 Tier 1 outreach drafts ready." },
      { name: "Content Machine", color: CLR.orange, priority: "high", desc: "13 posts/week across 7 platforms. 4 pillars: New Construction, Mortgage, Operator, Local. Batch film Mon AM + Fri PM." },
      { name: "360 Executive Suites", color: CLR.lime, priority: "medium", desc: "GM of 4 buildings. Constellation Rd #398 under contract." },
    ];
    return <>
      <h2 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 12px" }}>Hub</h2>
      <div style={{ ...S.card, border: `1px solid ${CLR.red}33` }}>
        <div style={S.section}>🚨 Alerts</div>
        {ALERTS.map(a => <div key={a.id} style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "6px 0", borderBottom: `1px solid ${CLR.border}` }}>
          <Pill text={a.priority} color={PRIO_CLR[a.priority]} />
          <span style={{ fontSize: 12, flex: 1 }}>{a.text}</span>
          {a.due && <span style={{ fontSize: 10, color: a.due <= todayStr ? CLR.red : CLR.muted }}>{a.due}</span>}
        </div>)}
      </div>
      <div style={S.section}>Active Projects</div>
      {projects.map(p => <div key={p.name} style={{ ...S.card, borderLeft: `3px solid ${p.color}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>{p.name}</span>
          <Pill text={p.priority} color={PRIO_CLR[p.priority]} />
        </div>
        <div style={{ fontSize: 12, color: CLR.muted }}>{p.desc}</div>
      </div>)}
      <div style={S.section}>Connected Accounts</div>
      <div style={S.card}>
        {Object.entries(ACCT).map(([email, { label, color }]) => <div key={email} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: `1px solid ${CLR.border}` }}>
          <div style={{ width: 8, height: 8, borderRadius: 4, background: color }} />
          <Pill text={label} color={color} />
          <span style={{ fontSize: 11, color: CLR.muted }}>{email}</span>
        </div>)}
      </div>
    </>;
  }

  // ── TAB: BIZ ────────────────────────────────────────────────────
  function BizTab() {
    const monthsLeft = 12 - new Date().getMonth();
    const mortgageNeeded = Math.max(0, 200000 - income360);
    const monthlyNeeded = Math.ceil(mortgageNeeded / Math.max(monthsLeft, 1));
    const pipelines = [
      { name: "Purchase", stages: ["New Lead", "Contacted", "Pre-Qual Sched.", "Pre-Approved", "In Process", "Closed Won"] },
      { name: "Refinance", stages: ["New Lead", "Contacted", "Rate Quoted", "App Submitted", "Underwriting", "Closed Won"] },
      { name: "Second Opinion", stages: ["Urgent Review", "Reviewed", "Competing Offer", "Decision Pend.", "Processing", "Closed Won"] },
    ];
    return <>
      <h2 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 12px" }}>Business</h2>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <Stat label="Deals Closed" value="0" color={CLR.green} />
        <Stat label="Gross Revenue" value="$0" color={CLR.lime} />
        <Stat label="Pipeline" value="0" color={CLR.cyan} />
      </div>
      <div style={S.card}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>$200K Goal Tracker</span>
          <span style={{ fontSize: 12, color: CLR.lime }}>{fmtK(income360)} / $200K</span>
        </div>
        <Bar pct={(income360 / 200000) * 100} />
        <div style={{ fontSize: 11, color: CLR.muted, marginTop: 6 }}>360 W-2: {fmtK(income360)} · Mortgage: $0</div>
        <div style={{ fontSize: 11, color: CLR.muted }}>{monthsLeft} months left · Need ~{fmtK(monthlyNeeded)}/mo from mortgage</div>
      </div>
      <div style={S.section}>Mortgage Pipeline</div>
      {pipelines.map(p => <div key={p.name} style={S.card}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>{p.name}</div>
        {p.stages.map(s => <div key={s} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
          <span style={{ fontSize: 11, color: CLR.muted, width: 100, flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s}</span>
          <div style={{ flex: 1, height: 4, background: CLR.border, borderRadius: 2 }} />
          <span style={{ fontSize: 11, color: CLR.faint, width: 16, textAlign: "right" }}>0</span>
        </div>)}
      </div>)}
      <div style={S.section}>Referral Partners (2/10)</div>
      <div style={S.card}>
        <Bar pct={20} color={CLR.purple} h={4} />
        <div style={{ marginTop: 8 }}>
          {[{ name: "Rafferty Yao", type: "IUL/FIA" }, { name: "Emilie Dujardin", type: "KW Realtor" }].map(p =>
            <div key={p.name} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: 12 }}>
              <span>{p.name}</span><span style={{ color: CLR.muted }}>{p.type}</span>
            </div>)}
        </div>
      </div>
    </>;
  }

  // ── TAB: LIFE ───────────────────────────────────────────────────
  function LifeTab() {
    const goals = [
      { icon: "🏦", title: "Close first mortgage deal", cur: 0, max: 1, color: CLR.lime },
      { icon: "💰", title: "$200K gross in 2026", cur: income360, max: 200000, color: CLR.lime, fmt: true },
      { icon: "💪", title: "EOS 3x per week", cur: 0, max: 3, color: CLR.green },
      { icon: "📞", title: "5 prospecting touches/week", cur: 0, max: 5, color: CLR.cyan },
      { icon: "🎬", title: "13 posts/week", cur: 0, max: 13, color: CLR.orange },
      { icon: "🤝", title: "10 referral partners", cur: 2, max: 10, color: CLR.purple },
    ];
    return <>
      <h2 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 12px" }}>Life</h2>
      <div style={S.section}>Today's Habits</div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {habits.map(h => <div key={h.id} onClick={() => toggleHabit(h.id)} style={{
          flex: "1 0 60px", textAlign: "center", padding: 12, borderRadius: 12, cursor: "pointer",
          background: h.done ? `${CLR.green}15` : CLR.card, border: `1px solid ${h.done ? CLR.green + "44" : CLR.border}`, transition: "all 0.2s",
        }}>
          <div style={{ fontSize: 22 }}>{h.icon}</div>
          <div style={{ fontSize: 10, color: h.done ? CLR.green : CLR.muted, fontWeight: 600, marginTop: 2 }}>{h.name}</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: h.done ? CLR.green : CLR.faint, marginTop: 2 }}>{h.done ? "✓" : "—"}</div>
        </div>)}
      </div>
      <div style={S.section}>Goals</div>
      {goals.map(g => <div key={g.title} style={{ ...S.card }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <span style={{ fontSize: 12 }}>{g.icon} {g.title}</span>
          <span style={{ fontSize: 11, color: g.color }}>{g.fmt ? fmtK(g.cur) : g.cur} / {g.fmt ? fmtK(g.max) : g.max}</span>
        </div>
        <Bar pct={(g.cur / g.max) * 100} color={g.color} h={4} />
      </div>)}
      <div style={S.section}>Family</div>
      <div style={{ display: "flex", gap: 8 }}>
        <div style={{ ...S.card, flex: 1, textAlign: "center" }}>
          <div style={{ fontSize: 24 }}>💍</div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>Tatum</div>
          <div style={{ fontSize: 10, color: CLR.muted }}>Married 11/13/24</div>
          <div style={{ fontSize: 10, color: CLR.muted }}>Together since 9/5/16</div>
          <div style={{ fontSize: 10, color: CLR.lime, fontStyle: "italic", marginTop: 4, lineHeight: 1.3 }}>{HUSBAND_TIPS[dailyIndex() % HUSBAND_TIPS.length]}</div>
        </div>
        <div style={{ ...S.card, flex: 1, textAlign: "center" }}>
          <div style={{ fontSize: 24 }}>👶</div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>Avery</div>
          <div style={{ fontSize: 10, color: CLR.muted }}>{babyAge()}</div>
          <div style={{ fontSize: 10, color: CLR.muted }}>Born July 15, 2025</div>
        </div>
      </div>
      <div style={{ ...S.card, textAlign: "center", marginTop: 8 }}>
        <span style={{ fontSize: 20 }}>🐕🐕🐕</span>
        <div style={{ fontSize: 13, fontWeight: 600 }}>3 Huskies — The pack</div>
      </div>
    </>;
  }

  // ── TAB: CAL ────────────────────────────────────────────────────
  function CalTab() {
    const days = Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() + i); return d.toISOString().slice(0, 10); });
    const dayEvents = DEFAULT_CAL.filter(e => e.start.startsWith(calDay)).sort((a, b) => a.start.localeCompare(b.start));
    return <>
      <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Calendar</h2>
      <div style={{ fontSize: 11, color: CLR.muted, marginBottom: 12 }}>All 4 accounts</div>
      <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
        {Object.entries(ACCT).map(([_, { label, color }]) => <div key={label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <div style={{ width: 6, height: 6, borderRadius: 3, background: color }} />
          <span style={{ fontSize: 10, color: CLR.muted }}>{label}</span>
        </div>)}
      </div>
      <div style={{ display: "flex", gap: 6, marginBottom: 16, overflowX: "auto" }}>
        {days.map(d => {
          const dt = new Date(d + "T12:00:00");
          const isActive = calDay === d;
          return <button key={d} onClick={() => setCalDay(d)} style={{
            flex: "1 0 42px", padding: "8px 4px", borderRadius: 10, cursor: "pointer", textAlign: "center", fontFamily: font,
            background: isActive ? `${CLR.lime}15` : CLR.card, border: `1px solid ${isActive ? CLR.lime : CLR.border}`, color: isActive ? CLR.lime : CLR.text,
          }}>
            <div style={{ fontSize: 10, color: isActive ? CLR.lime : CLR.muted }}>{dt.toLocaleDateString("en-US", { weekday: "short" })}</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{dt.getDate()}</div>
          </button>;
        })}
      </div>
      {dayEvents.length === 0 ? <div style={{ ...S.card, textAlign: "center", color: CLR.muted, fontSize: 13 }}>No events — protect this time</div> :
        dayEvents.map(e => {
          const a = ACCT[e.acct] || { label: "?", color: CLR.muted };
          return <div key={e.id} style={{ ...S.card, borderLeft: `3px solid ${a.color}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 12, color: a.color, fontWeight: 600 }}>{fmtTime(e.start)}{e.end ? ` — ${fmtTime(e.end)}` : ""}</div>
                <div style={{ fontSize: 13, marginTop: 2 }}>{e.summary}</div>
              </div>
              <Pill text={a.label} color={a.color} />
            </div>
          </div>;
        })}
    </>;
  }

  // ── TAB: QE ─────────────────────────────────────────────────────
  function QETab() {
    return <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Quantum Edge</h2>
        <Pill text="PAPER" color={CLR.green} />
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <Stat label="Portfolio" value="$10,000" color={CLR.lime} />
        <Stat label="P&L" value="$0.00" color={CLR.green} />
        <Stat label="Return" value="0.0%" color={CLR.cyan} />
      </div>
      <div style={S.card}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>Investment Goal</span>
          <span style={{ fontSize: 12, color: CLR.lime }}>$10K / $50K</span>
        </div>
        <Bar pct={20} />
      </div>
      <div style={S.section}>Holdings</div>
      <div style={S.card}>
        {[{ sym: "BTC", price: "$84,250", units: "0", color: "#F7931A" }, { sym: "ETH", price: "$3,180", units: "0", color: "#627EEA" }, { sym: "SOL", price: "$148.50", units: "0", color: CLR.purple }].map(h =>
          <div key={h.sym} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${CLR.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: 4, background: h.color }} />
              <span style={{ fontSize: 13, fontWeight: 600 }}>{h.sym}</span>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 13 }}>{h.price}</div>
              <div style={{ fontSize: 10, color: CLR.muted }}>{h.units} units</div>
            </div>
          </div>)}
      </div>
      <div style={S.section}>Trading Bot</div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <Stat label="Trades" value="0" color={CLR.muted} />
        <Stat label="Max DD" value="0.0%" color={CLR.red} />
        <Stat label="P.Factor" value="0.00" color={CLR.purple} />
      </div>
      <div style={{ ...S.card, textAlign: "center", color: CLR.muted, fontSize: 13, padding: 24 }}>
        📈 Waiting for signals
      </div>
      <div style={S.card}>
        <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Config</div>
        <div style={{ fontSize: 11, color: CLR.muted, lineHeight: 1.8 }}>
          Pairs: BTC/USD, ETH/USD, SOL/USD<br />
          Strategy: EMA 8/21 + ADX &gt; 25<br />
          Risk: ATR stops (2x SL, 4x TP) · 3x leverage
        </div>
      </div>
    </>;
  }

  // ── TAB: SCORE ──────────────────────────────────────────────────
  function ScoreTab() {
    return <>
      <h2 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 4px" }}>Life Scoreboard</h2>
      <div style={{ ...S.card, textAlign: "center", background: `${CLR.purple}10`, border: `1px solid ${CLR.purple}33` }}>
        <div style={{ fontSize: 11, color: CLR.muted, textTransform: "uppercase", letterSpacing: 1 }}>Level</div>
        <div style={{ fontSize: 42, fontWeight: 800, color: CLR.purple }}>{level}</div>
        <div style={{ fontSize: 13, color: CLR.text }}>{totalXP} total XP · {todayXP}/{totalPossibleXP} today</div>
        <div style={{ marginTop: 8 }}><Bar pct={xpInLevel} color={CLR.purple} h={8} /></div>
        <div style={{ fontSize: 10, color: CLR.muted, marginTop: 4 }}>{xpInLevel}/100 XP to Level {level + 1}</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
        {PILLARS.map(p => {
          const actions = xpActions.filter(a => a.pillar === p.key);
          const earned = actions.filter(a => a.done).reduce((s, a) => s + a.xp, 0);
          const total = actions.reduce((s, a) => s + a.xp, 0);
          return <div key={p.key} style={{ ...S.card, textAlign: "center", padding: 10 }}>
            <div style={{ fontSize: 22 }}>{p.icon}</div>
            <div style={{ fontSize: 10, fontWeight: 700, color: p.color, marginTop: 2 }}>{p.label}</div>
            <div style={{ fontSize: 12, color: CLR.text, marginTop: 2 }}>{earned}/{total}</div>
            <div style={{ marginTop: 4 }}><Bar pct={total > 0 ? (earned / total) * 100 : 0} color={p.color} h={3} /></div>
          </div>;
        })}
      </div>

      <div style={S.section}>Today's Actions</div>
      {PILLARS.map(p => {
        const actions = xpActions.filter(a => a.pillar === p.key);
        return <div key={p.key} style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: p.color, marginBottom: 6 }}>{p.icon} {p.label}</div>
          {actions.map(a => <div key={a.id} onClick={() => toggleXP(a.id)} style={{
            ...S.card, display: "flex", alignItems: "center", gap: 10, cursor: "pointer", padding: 12,
            background: a.done ? `${CLR.green}10` : CLR.card, border: `1px solid ${a.done ? CLR.green + "33" : CLR.border}`,
          }}>
            <span style={{ fontSize: 16 }}>{a.done ? "✅" : "⬜"}</span>
            <span style={{ flex: 1, fontSize: 13 }}>{a.name}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: a.done ? CLR.green : p.color }}>+{a.xp} XP</span>
          </div>)}
        </div>;
      })}
    </>;
  }

  // ── NAV ─────────────────────────────────────────────────────────
  const TABS = [
    { key: "home", icon: "⚡", label: "Home" },
    { key: "tasks", icon: "✓", label: "Tasks" },
    { key: "hub", icon: "🎯", label: "Hub" },
    { key: "biz", icon: "🏦", label: "Biz" },
    { key: "life", icon: "🧬", label: "Life" },
    { key: "cal", icon: "📅", label: "Cal" },
    { key: "qe", icon: "📈", label: "QE" },
    { key: "score", icon: "🏆", label: "Score" },
  ];

  const tabContent = { home: HomeTab, tasks: TasksTab, hub: HubTab, biz: BizTab, life: LifeTab, cal: CalTab, qe: QETab, score: ScoreTab };
  const ActiveTab = tabContent[tab];

  return <div style={{ fontFamily: font, display: "flex", flexDirection: "column", height: "100dvh", width: "100%", background: CLR.bg, color: CLR.text }}>
    <div style={{ flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch", padding: "env(safe-area-inset-top, 12px) 14px 8px" }}>
      <ActiveTab />
      <div style={{ height: 70 }} />
    </div>
    <nav style={{
      display: "flex", justifyContent: "space-around", padding: "6px 2px env(safe-area-inset-bottom, 6px)",
      background: CLR.nav, borderTop: `1px solid ${CLR.navBorder}`, position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100,
      backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
    }}>
      {TABS.map(t => <button key={t.key} onClick={() => setTab(t.key)} style={{
        background: "none", border: "none", color: tab === t.key ? CLR.lime : CLR.muted,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 1, padding: "4px 0",
        cursor: "pointer", fontFamily: font, minWidth: 0, flex: 1,
      }}>
        <span style={{ fontSize: 17 }}>{t.icon}</span>
        <span style={{ fontSize: 9, fontWeight: tab === t.key ? 700 : 500 }}>{t.label}</span>
      </button>)}
    </nav>
  </div>;
}
