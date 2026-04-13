import { useState } from "react";
import { C, cardStyle, pillStyle } from "../styles/tokens";
import Card from "../components/Card";
import Badge from "../components/Badge";
import ProgressBar from "../components/ProgressBar";
import EmptyState from "../components/EmptyState";
import { useApi, apiPatch } from "../hooks/useApi";
import { relativeTime } from "../utils/format";

const SEVERITY_COLORS = { high: C.red, medium: C.amber, low: C.txt3 };
const STATUS_COLORS = { active: C.green, paused: C.amber, done: C.txt3 };
const PRIORITY_ORDER = { critical: 0, high: 1, medium: 2, low: 3 };

export default function Projects() {
  const { data, refresh } = useApi("/api/projects", 30000);
  const [expanded, setExpanded] = useState(null);

  const projects = (data?.projects || []).sort((a, b) =>
    (PRIORITY_ORDER[a.priority] ?? 9) - (PRIORITY_ORDER[b.priority] ?? 9)
  );
  const alerts = (data?.alerts || []).filter(a => !a.resolved);

  async function resolveAlert(id) {
    await apiPatch(`/api/projects/alerts/${id}`, { resolved: true });
    refresh();
  }

  return (
    <div className="fade-in">
      <h2 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 16px" }}>Projects</h2>

      {/* Active Alerts */}
      {alerts.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.red, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
            Alerts ({alerts.length})
          </div>
          {alerts.map(alert => (
            <Card key={alert.id} style={{
              padding: 14, marginBottom: 8,
              border: `1px solid ${(SEVERITY_COLORS[alert.severity] || C.amber)}30`,
              background: `${(SEVERITY_COLORS[alert.severity] || C.amber)}08`,
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ fontSize: 16 }}>
                  {alert.type === "deadline" ? "⏰" : alert.type === "security" ? "🔒" : alert.type === "schedule" ? "📅" : "⚠️"}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, lineHeight: 1.4 }}>{alert.text}</div>
                  {alert.dueDate && (
                    <div style={{ fontSize: 11, color: SEVERITY_COLORS[alert.severity] || C.amber, marginTop: 4 }}>
                      {alert.dueDate < new Date().toISOString().slice(0, 10) ? "OVERDUE" : `Due ${alert.dueDate}`}
                    </div>
                  )}
                </div>
                <button onClick={() => resolveAlert(alert.id)} style={{
                  background: "none", border: `1px solid ${C.glassBd}`, borderRadius: 6,
                  color: C.txt3, fontSize: 11, padding: "4px 8px", cursor: "pointer", fontFamily: "inherit",
                }}>
                  Dismiss
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Projects */}
      {projects.length === 0 ? (
        <EmptyState icon="📋" title="No projects" message="Projects will appear here as Claude sessions track your work" />
      ) : (
        projects.map(project => {
          const isExpanded = expanded === project.id;
          return (
            <Card
              key={project.id}
              onClick={() => setExpanded(isExpanded ? null : project.id)}
              style={{
                marginBottom: 12,
                cursor: "pointer",
                border: project.priority === "critical"
                  ? `1px solid ${C.lime}30`
                  : `1px solid ${C.glassBd}`,
                background: project.priority === "critical"
                  ? `linear-gradient(135deg, ${C.limeGlow}, transparent)`
                  : C.glass,
              }}
            >
              {/* Header */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: isExpanded ? 14 : 0 }}>
                <span style={{ fontSize: 22 }}>{project.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 600 }}>{project.name}</div>
                  <div style={{ fontSize: 12, color: C.txt3, marginTop: 2 }}>
                    {project.summary.slice(0, 80)}{project.summary.length > 80 ? "..." : ""}
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                  <Badge text={project.priority} type={project.priority === "critical" ? "urgent" : project.priority} />
                  <span style={{ fontSize: 10, color: C.txt3 }}>{isExpanded ? "▲" : "▼"}</span>
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="fade-in" style={{ borderTop: `1px solid ${C.glassBd}`, paddingTop: 14 }}>
                  {/* Summary */}
                  <div style={{ fontSize: 13, color: C.txt2, marginBottom: 14, lineHeight: 1.5 }}>
                    {project.summary}
                  </div>

                  {/* Next Actions */}
                  {project.nextActions?.length > 0 && (
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: C.lime, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
                        Next Actions
                      </div>
                      {project.nextActions.map((action, i) => (
                        <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 6 }}>
                          <span style={{ color: C.lime, fontSize: 12, marginTop: 1 }}>→</span>
                          <span style={{ fontSize: 13, color: C.txt, lineHeight: 1.4 }}>{action}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Blockers */}
                  {project.blockers?.length > 0 && (
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: C.red, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
                        Blockers
                      </div>
                      {project.blockers.map((blocker, i) => (
                        <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 6 }}>
                          <span style={{ color: C.red, fontSize: 12, marginTop: 1 }}>!</span>
                          <span style={{ fontSize: 13, color: C.txt2, lineHeight: 1.4 }}>{blocker}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Recent Decisions */}
                  {project.decisions?.length > 0 && (
                    <div style={{ marginBottom: 8 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: C.txt3, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
                        Decision Log
                      </div>
                      {project.decisions.slice(-5).reverse().map((d, i) => (
                        <div key={i} style={{
                          display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 6,
                          paddingLeft: 8, borderLeft: `2px solid ${C.glassBd}`,
                        }}>
                          <span style={{ fontSize: 11, color: C.txt3, minWidth: 60, flexShrink: 0 }}>{d.date}</span>
                          <span style={{ fontSize: 12, color: C.txt2, lineHeight: 1.4 }}>{d.text}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Last Updated */}
                  <div style={{ fontSize: 11, color: C.txt3, textAlign: "right", marginTop: 8 }}>
                    Updated {relativeTime(project.lastUpdated)}
                  </div>
                </div>
              )}
            </Card>
          );
        })
      )}
    </div>
  );
}
