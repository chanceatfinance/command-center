import { C } from "../styles/tokens";
import Card from "../components/Card";
import StatCard from "../components/StatCard";
import Badge from "../components/Badge";
import ProgressBar from "../components/ProgressBar";
import EmptyState from "../components/EmptyState";
import { useApi } from "../hooks/useApi";
import { formatCurrency, relativeTime } from "../utils/format";

export default function Business() {
  const { data: pipeData } = useApi("/api/business/pipeline", 60000);
  const { data: paceData } = useApi("/api/business/pace", 60000);
  const { data: partnerData } = useApi("/api/business/partners", 60000);
  const { data: leads } = useApi("/api/business/leads", 30000);

  const pipelines = pipeData?.all || [];
  const pace = paceData || { goal: 200000, closedDeals: [], totalGross: 0 };
  const partners = partnerData?.partners || [];
  const leadEvents = Array.isArray(leads) ? leads : [];

  // Count total active opportunities across mortgage pipelines
  const mortgagePipelines = pipelines.filter(p => !p.name.toLowerCase().includes("partner"));
  const totalLeads = mortgagePipelines.reduce((sum, p) =>
    sum + p.stages.reduce((s, st) => s + (st.count || 0), 0), 0);

  const monthsLeft = 12 - new Date().getMonth();
  const monthlyTarget = pace.goal > pace.totalGross
    ? Math.ceil((pace.goal - pace.totalGross) / Math.max(monthsLeft, 1))
    : 0;

  return (
    <div className="fade-in">
      <h2 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 16px" }}>Business</h2>

      {/* Key Stats */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <StatCard label="Deals Closed" value={pace.closedDeals.length} color={C.green} icon="🏦" />
        <StatCard label="Gross Revenue" value={formatCurrency(pace.totalGross)} color={C.lime} icon="💰" />
        <StatCard label="Pipeline" value={totalLeads} color={C.cyan} icon="📊" />
      </div>

      {/* $200K Goal */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>$200K Goal Tracker</span>
          <span style={{ fontSize: 13, color: C.lime }}>{formatCurrency(pace.totalGross)} / {formatCurrency(pace.goal)}</span>
        </div>
        <ProgressBar value={pace.totalGross} max={pace.goal} color={C.lime} height={10} />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 12, color: C.txt3 }}>
          <span>{monthsLeft} months remaining</span>
          <span>Need ~{formatCurrency(monthlyTarget)}/mo</span>
        </div>
      </Card>

      {/* Mortgage Pipeline Funnel */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Mortgage Pipeline</div>
        {mortgagePipelines.length === 0 ? (
          <EmptyState icon="📊" title="No pipelines" message="Connect GHL to see your pipeline" />
        ) : (
          mortgagePipelines.map(pipeline => (
            <div key={pipeline.id} style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, color: C.txt2, marginBottom: 6 }}>{pipeline.name}</div>
              {pipeline.stages.filter(s => !s.name.toLowerCase().includes("lost") && !s.name.toLowerCase().includes("dead")).map(stage => (
                <div key={stage.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: C.txt3, width: 120, flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {stage.name}
                  </span>
                  <div style={{ flex: 1, height: 6, background: C.glass, borderRadius: 3 }}>
                    <div style={{
                      height: "100%", width: stage.count > 0 ? `${Math.max(stage.count * 20, 10)}%` : 0,
                      background: C.lime, borderRadius: 3, transition: "width 0.3s",
                    }} />
                  </div>
                  <span style={{ fontSize: 12, color: C.txt2, width: 20, textAlign: "right" }}>{stage.count || 0}</span>
                </div>
              ))}
            </div>
          ))
        )}
      </Card>

      {/* Referral Partners */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Referral Partners</div>
        {partners.length === 0 ? (
          <EmptyState icon="🤝" title="No partners yet" message="Add your first referral partner" />
        ) : (
          partners.map(p => (
            <div key={p.id} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "10px 0",
              borderBottom: `1px solid ${C.glassBd}`,
            }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{p.name}</div>
                <div style={{ fontSize: 12, color: C.txt3 }}>{p.company} · {p.type}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <Badge text={p.status} type={p.status} />
                {p.lastTouch && (
                  <div style={{ fontSize: 11, color: C.txt3, marginTop: 4 }}>
                    Touched {relativeTime(p.lastTouch)}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </Card>

      {/* Recent GHL Events */}
      {leadEvents.length > 0 && (
        <Card>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Recent Lead Activity</div>
          {leadEvents.slice(-5).reverse().map((event, i) => (
            <div key={i} style={{
              padding: "8px 0",
              borderBottom: i < 4 ? `1px solid ${C.glassBd}` : "none",
              fontSize: 13,
            }}>
              <span style={{ color: C.lime }}>{event.contact?.name || "Unknown"}</span>
              <span style={{ color: C.txt3 }}> · {event.type} · {relativeTime(event.timestamp)}</span>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
