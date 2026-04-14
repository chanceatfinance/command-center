import { Router } from "express";
import { readFileSync, statSync } from "fs";
import { join } from "path";

const router = Router();
const QE_DIR = process.env.QE_DIR || "/Users/clawdbot/Desktop/quantum-edge";

const defaultState = {
  version: 3, mode: "paper",
  stats: { starting_balance: 10000, balance: 10000, total_trades: 0, total_pnl: 0, total_fees: 0, max_drawdown: 0, win_rate: 0, profit_factor: 0, largest_win: 0, largest_loss: 0, peak_equity: 10000 },
  positions: [], recent_trades: [], equity_curve: [],
};

router.get("/", (req, res) => {
  let state = { ...defaultState };
  let recentLog = [];
  let trades = [];
  let online = false;

  try {
    state = JSON.parse(readFileSync(join(QE_DIR, "bot_state.json"), "utf-8"));
    const stat = statSync(join(QE_DIR, "bot_state.json"));
    online = (Date.now() - stat.mtimeMs) < 600000; // fresh within 10 min
  } catch (e) {}

  try {
    const logContent = readFileSync(join(QE_DIR, "quantum_edge.log"), "utf-8");
    recentLog = logContent.split("\n").filter(l => l.trim()).slice(-20);
  } catch (e) {}

  try {
    const csvContent = readFileSync(join(QE_DIR, "trade_journal.csv"), "utf-8");
    const lines = csvContent.split("\n").filter(l => l.trim());
    if (lines.length > 1) {
      const headers = lines[0].split(",");
      trades = lines.slice(1).slice(-20).map(line => {
        const vals = line.split(",");
        const obj = {};
        headers.forEach((h, i) => obj[h.trim()] = vals[i]?.trim() || "");
        return obj;
      });
    }
  } catch (e) {}

  res.json({
    state, recentLog, trades, online,
    config: {
      pairs: ["BTC/USD:USD", "ETH/USD:USD", "SOL/USD:USD"],
      timeframe: "1h", mode: "paper", exchange: "Kraken Futures", leverage: "3x",
    },
  });
});

export default router;
