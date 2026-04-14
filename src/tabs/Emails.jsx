import { useState } from "react";
import { C, pillStyle } from "../styles/tokens";
import Card from "../components/Card";
import Badge from "../components/Badge";
import EmptyState from "../components/EmptyState";
import { useApi } from "../hooks/useApi";
import { relativeTime } from "../utils/format";

const CATEGORY_META = {
  action_required: { label: "Action Required", color: C.red, icon: "🔴" },
  security: { label: "Security", color: C.amber, icon: "🔒" },
  billing: { label: "Billing", color: C.purple, icon: "💳" },
  system: { label: "System", color: C.cyan, icon: "⚙️" },
  useful: { label: "Useful", color: C.green, icon: "💡" },
  promotion: { label: "Promo", color: C.txt3, icon: "📢" },
};

const FILTERS = ["all", "action_required", "security", "billing", "system", "useful"];

export default function Emails() {
  const { data } = useApi("/api/emails", 60000);
  const [filter, setFilter] = useState("all");

  const emails = data?.emails || [];
  const stats = data?.stats || {};
  const filtered = filter === "all" ? emails : emails.filter(e => e.category === filter);

  return (
    <div className="fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Inbox</h2>
        <div style={{ fontSize: 12, color: C.txt3 }}>
          {stats.totalUnread || 0} unread
        </div>
      </div>

      {data?.synced_at && (
        <div style={{ fontSize: 11, color: C.txt3, marginBottom: 12 }}>
          Synced {relativeTime(data.synced_at)}
        </div>
      )}

      {/* Quick Stats */}
      <div style={{ display: "flex", gap: 8, marginBottom: 14, overflowX: "auto", paddingBottom: 4 }}>
        {stats.actionRequired > 0 && (
          <div style={{
            ...pillStyle(false), background: `${C.red}15`, borderColor: `${C.red}30`, color: C.red,
            display: "flex", alignItems: "center", gap: 4,
          }}>
            🔴 {stats.actionRequired} action
          </div>
        )}
        {stats.security > 0 && (
          <div style={{
            ...pillStyle(false), background: `${C.amber}15`, borderColor: `${C.amber}30`, color: C.amber,
            display: "flex", alignItems: "center", gap: 4,
          }}>
            🔒 {stats.security} security
          </div>
        )}
        <div style={{
          ...pillStyle(false), display: "flex", alignItems: "center", gap: 4,
        }}>
          📬 {stats.updates || 0} updates
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16, overflowX: "auto", paddingBottom: 4 }}>
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            ...pillStyle(filter === f),
            fontSize: 11,
            padding: "5px 10px",
            whiteSpace: "nowrap",
          }}>
            {f === "all" ? "All" : CATEGORY_META[f]?.label || f}
          </button>
        ))}
      </div>

      {/* Email List */}
      {filtered.length === 0 ? (
        <EmptyState icon="📭" title="No emails" message="Nothing in this category" />
      ) : (
        filtered.map(email => {
          const meta = CATEGORY_META[email.category] || { label: email.category, color: C.txt3, icon: "📧" };
          return (
            <Card key={email.id} style={{
              padding: 14, marginBottom: 8,
              borderLeft: email.unread ? `3px solid ${meta.color}` : "3px solid transparent",
              opacity: email.unread ? 1 : 0.6,
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ fontSize: 16, marginTop: 2 }}>{meta.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: meta.color }}>{email.from}</span>
                    <span style={{ fontSize: 10, color: C.txt3, flexShrink: 0 }}>{relativeTime(email.date)}</span>
                  </div>
                  <div style={{
                    fontSize: 13, fontWeight: email.unread ? 600 : 400,
                    marginBottom: 3,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {email.subject}
                  </div>
                  <div style={{
                    fontSize: 12, color: C.txt3,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {email.snippet}
                  </div>
                </div>
              </div>
            </Card>
          );
        })
      )}
    </div>
  );
}
