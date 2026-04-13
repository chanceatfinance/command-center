import { useState } from "react";
import { C, pillStyle } from "../styles/tokens";
import Card from "../components/Card";
import EmptyState from "../components/EmptyState";
import { useApi } from "../hooks/useApi";
import { formatTime } from "../utils/format";

export default function Calendar() {
  const { data } = useApi("/api/calendar", 60000);
  const [view, setView] = useState("week");

  const events = data?.events || [];
  const syncedAt = data?.synced_at;

  // Group events by date
  const today = new Date();
  const grouped = {};

  // Generate next 7 days
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    grouped[key] = { date: d, events: [] };
  }

  events.forEach(e => {
    const dateStr = (e.start || "").slice(0, 10);
    if (grouped[dateStr]) {
      grouped[dateStr].events.push(e);
    }
  });

  const days = Object.entries(grouped);
  const todayStr = today.toISOString().slice(0, 10);
  const displayDays = view === "day" ? days.filter(([k]) => k === todayStr) : days;

  return (
    <div className="fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Calendar</h2>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={() => setView("day")} style={pillStyle(view === "day")}>Day</button>
          <button onClick={() => setView("week")} style={pillStyle(view === "week")}>Week</button>
        </div>
      </div>

      {syncedAt && (
        <div style={{ fontSize: 11, color: C.txt3, marginBottom: 12 }}>
          Last synced: {new Date(syncedAt).toLocaleString()}
        </div>
      )}

      {displayDays.map(([dateKey, { date, events: dayEvents }]) => {
        const isToday = dateKey === todayStr;
        const dayLabel = date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

        return (
          <div key={dateKey} style={{ marginBottom: 16 }}>
            <div style={{
              fontSize: 13, fontWeight: 600,
              color: isToday ? C.lime : C.txt2,
              marginBottom: 8,
              display: "flex", alignItems: "center", gap: 8,
            }}>
              {isToday && <span style={{
                width: 6, height: 6, borderRadius: 3, background: C.lime,
              }} />}
              {isToday ? `Today — ${dayLabel}` : dayLabel}
            </div>

            {dayEvents.length === 0 ? (
              <Card style={{ padding: 14 }}>
                <div style={{ fontSize: 13, color: C.txt3, textAlign: "center" }}>
                  {isToday ? "Calendar is clear — protect this time" : "No events"}
                </div>
              </Card>
            ) : (
              dayEvents.sort((a, b) => (a.start || "").localeCompare(b.start || "")).map((event, i) => {
                const hasTime = event.start?.includes("T");
                return (
                  <Card key={i} style={{ padding: 14, marginBottom: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      {hasTime && (
                        <div style={{
                          fontSize: 12, color: C.lime, fontWeight: 600,
                          minWidth: 60, flexShrink: 0,
                        }}>
                          {formatTime(event.start)}
                        </div>
                      )}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14 }}>{event.summary}</div>
                        {event.calendar && (
                          <div style={{ fontSize: 11, color: C.txt3 }}>{event.calendar}</div>
                        )}
                      </div>
                      {hasTime && event.end && (
                        <div style={{ fontSize: 11, color: C.txt3 }}>
                          → {formatTime(event.end)}
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        );
      })}

      {events.length === 0 && (
        <EmptyState
          icon="📅"
          title="No calendar data"
          message="Sync your Google Calendar from any Claude session to see events here"
        />
      )}
    </div>
  );
}
