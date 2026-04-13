import { C } from "../styles/tokens";
import Card from "../components/Card";
import StatCard from "../components/StatCard";
import Badge from "../components/Badge";
import EmptyState from "../components/EmptyState";
import { useApi } from "../hooks/useApi";
import { formatCurrency } from "../utils/format";

export default function QuantumEdge() {
  const { data } = useApi("/api/quantum", 15000);

  if (!data) return <div style={{ textAlign: "center", padding: 40, color: C.txt3 }}>Loading...</div>;

  const { state, trades, online, config } = data;
  const stats = state?.stats || {};
  const positions = state?.positions || [];
  const equity = state?.equity_curve || [];

  const pnlColor = stats.total_pnl >= 0 ? C.green : C.red;

  // SVG Equity chart
  const chartH = 120;
  const chartW = 300;
  let chartPath = "";
  if (equity.length > 1) {
    const values = equity.map(e => e.equity || e);
    const min = Math.min(...values) * 0.99;
    const max = Math.max(...values) * 1.01;
    const range = max - min || 1;
    chartPath = values.map((v, i) => {
      const x = (i / (values.length - 1)) * chartW;
      const y = chartH - ((v - min) / range) * chartH;
      return `${i === 0 ? "M" : "L"}${x},${y}`;
    }).join(" ");
  }

  return (
    <div className="fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Quantum Edge</h2>
        <Badge text={online ? "Online" : "Offline"} type={online ? "online" : "offline"} />
      </div>

      {/* Mode Badge */}
      <div style={{ marginBottom: 16, display: "flex", gap: 8, alignItems: "center" }}>
        <Badge text={config?.mode || "paper"} type="active" />
        <span style={{ fontSize: 12, color: C.txt3 }}>
          {config?.exchange} · {config?.leverage} · {config?.timeframe}
        </span>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <StatCard label="Balance" value={`$${stats.balance?.toFixed(2) || "0"}`} color={C.lime} />
        <StatCard label="P&L" value={`${stats.total_pnl >= 0 ? "+" : ""}$${stats.total_pnl?.toFixed(2) || "0"}`} color={pnlColor} />
        <StatCard label="Win Rate" value={`${(stats.win_rate * 100 || 0).toFixed(1)}%`} color={C.cyan} />
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <StatCard label="Trades" value={stats.total_trades || 0} color={C.txt2} />
        <StatCard label="Max DD" value={`${(stats.max_drawdown * 100 || 0).toFixed(1)}%`} color={C.red} />
        <StatCard label="P. Factor" value={(stats.profit_factor || 0).toFixed(2)} color={C.purple} />
      </div>

      {/* Equity Curve */}
      {equity.length > 1 && (
        <Card style={{ marginBottom: 16, padding: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Equity Curve</div>
          <svg viewBox={`0 0 ${chartW} ${chartH}`} style={{ width: "100%", height: chartH }}>
            <path d={chartPath} fill="none" stroke={C.lime} strokeWidth="2" />
            {/* Start/end labels */}
            {equity.length > 0 && (
              <>
                <text x="4" y="14" fill={C.txt3} fontSize="10">${(equity[equity.length - 1]?.equity || equity[equity.length - 1])?.toFixed(0)}</text>
                <text x="4" y={chartH - 4} fill={C.txt3} fontSize="10">${(equity[0]?.equity || equity[0])?.toFixed(0)}</text>
              </>
            )}
          </svg>
        </Card>
      )}

      {/* Open Positions */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Open Positions</div>
        {positions.length === 0 ? (
          <div style={{ fontSize: 13, color: C.txt3, textAlign: "center", padding: 16 }}>No open positions</div>
        ) : (
          positions.map((pos, i) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "10px 0",
              borderBottom: i < positions.length - 1 ? `1px solid ${C.glassBd}` : "none",
            }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{pos.pair || pos.symbol}</div>
                <div style={{ fontSize: 12, color: pos.side === "long" ? C.green : C.red }}>
                  {pos.side?.toUpperCase()} {pos.size}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 14, color: (pos.unrealized_pnl || 0) >= 0 ? C.green : C.red }}>
                  {(pos.unrealized_pnl || 0) >= 0 ? "+" : ""}{formatCurrency(pos.unrealized_pnl || 0)}
                </div>
                <div style={{ fontSize: 11, color: C.txt3 }}>Entry: ${pos.entry_price}</div>
              </div>
            </div>
          ))
        )}
      </Card>

      {/* Recent Trades */}
      <Card>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Recent Trades</div>
        {trades.length === 0 ? (
          <EmptyState icon="📈" title="No trades yet" message="Bot is waiting for signals" />
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ color: C.txt3, borderBottom: `1px solid ${C.glassBd}` }}>
                  <th style={{ textAlign: "left", padding: "6px 8px", fontWeight: 500 }}>Pair</th>
                  <th style={{ textAlign: "left", padding: "6px 8px", fontWeight: 500 }}>Side</th>
                  <th style={{ textAlign: "right", padding: "6px 8px", fontWeight: 500 }}>P&L</th>
                  <th style={{ textAlign: "right", padding: "6px 8px", fontWeight: 500 }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {trades.slice(-10).reverse().map((t, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${C.glassBd}` }}>
                    <td style={{ padding: "6px 8px" }}>{t.pair || t.symbol || "—"}</td>
                    <td style={{ padding: "6px 8px", color: t.side === "long" ? C.green : C.red }}>{t.side || "—"}</td>
                    <td style={{ padding: "6px 8px", textAlign: "right", color: parseFloat(t.pnl) >= 0 ? C.green : C.red }}>
                      {parseFloat(t.pnl) >= 0 ? "+" : ""}{parseFloat(t.pnl || 0).toFixed(2)}
                    </td>
                    <td style={{ padding: "6px 8px", textAlign: "right", color: C.txt3 }}>{(t.date || t.exit_time || "").slice(0, 10)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Config */}
      <Card style={{ marginTop: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Config</div>
        <div style={{ fontSize: 12, color: C.txt3, lineHeight: 1.8 }}>
          Pairs: {config?.pairs?.join(", ")}<br />
          Strategy: Trend Following (EMA 8/21 + ADX &gt; 25)<br />
          Risk: ATR-based stops (2x ATR SL, 4x ATR TP)
        </div>
      </Card>
    </div>
  );
}
