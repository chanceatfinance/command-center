import { C, cardStyle } from "../styles/tokens";
import Card from "../components/Card";
import ProgressBar from "../components/ProgressBar";
import { useApi, apiPost, apiPatch } from "../hooks/useApi";
import { getDaughterAge } from "../utils/format";

export default function Personal() {
  const { data, refresh } = useApi("/api/personal", 30000);
  const goals = data?.goals || [];
  const habits = data?.habits || [];

  const today = new Date().toISOString().slice(0, 10);

  async function checkin(habitId) {
    await apiPost(`/api/personal/habits/${habitId}/checkin`);
    refresh();
  }

  const goalColors = {
    financial: C.lime,
    fitness: C.green,
    business: C.cyan,
  };

  return (
    <div className="fade-in">
      <h2 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 16px" }}>Life</h2>

      {/* Daily Habits */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Today's Habits</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(90px, 1fr))", gap: 10 }}>
          {habits.map(h => {
            const doneToday = h.lastDate === today;
            return (
              <div
                key={h.id}
                onClick={() => !doneToday && checkin(h.id)}
                style={{
                  ...cardStyle,
                  textAlign: "center",
                  padding: 14,
                  cursor: doneToday ? "default" : "pointer",
                  background: doneToday ? `${C.green}15` : C.glass,
                  border: `1px solid ${doneToday ? C.green + "40" : C.glassBd}`,
                  transition: "all 0.2s",
                }}
              >
                <div style={{ fontSize: 24, marginBottom: 4 }}>{h.icon}</div>
                <div style={{ fontSize: 11, color: doneToday ? C.green : C.txt2, fontWeight: 600 }}>
                  {h.name}
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, color: doneToday ? C.green : C.txt3, marginTop: 4 }}>
                  {doneToday ? "✓" : h.streak > 0 ? `${h.streak}d` : "—"}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Goals */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Goals</div>
        {goals.map(g => {
          const color = goalColors[g.area] || C.lime;
          const pct = g.target > 0 ? Math.round((g.current / g.target) * 100) : 0;
          return (
            <div key={g.id} style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 13 }}>
                  {g.icon} {g.title}
                </span>
                <span style={{ fontSize: 12, color }}>
                  {g.current} / {g.target} {g.unit.includes("dollar") ? "" : g.unit}
                </span>
              </div>
              <ProgressBar value={g.current} max={g.target} color={color} height={6} />
            </div>
          );
        })}
      </Card>

      {/* Family */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Family</div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "8px 0" }}>
          <div style={{ fontSize: 36 }}>👶</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>Your daughter</div>
            <div style={{ fontSize: 14, color: C.txt2 }}>{getDaughterAge()} old</div>
            <div style={{ fontSize: 12, color: C.txt3, marginTop: 2 }}>Born July 15, 2025</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "8px 0", borderTop: `1px solid ${C.glassBd}` }}>
          <div style={{ fontSize: 36 }}>🐕</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>3 Huskies</div>
            <div style={{ fontSize: 12, color: C.txt3 }}>The pack</div>
          </div>
        </div>
      </Card>

      {/* Fitness */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Fitness</div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ fontSize: 36 }}>🏋️</div>
          <div>
            <div style={{ fontSize: 14 }}>EOS Membership — Active</div>
            <div style={{ fontSize: 12, color: C.txt3 }}>
              Gym streak: {habits.find(h => h.id === "h_gym")?.streak || 0} days
            </div>
            <div style={{ fontSize: 12, color: C.amber, marginTop: 2 }}>
              Any movement counts. Just show up.
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
