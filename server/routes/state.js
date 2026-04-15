import { Router } from "express";
import { readJSON, writeJSON } from "./_util.js";

const router = Router();
const FILE = "app-state.json";

function load() {
  try { return readJSON(FILE); }
  catch {
    return { tasks: [], habits: [], xpActions: [], totalXP: 0, lastModified: null };
  }
}

// GET /api/state — load full app state
router.get("/", (req, res) => {
  res.json(load());
});

// PUT /api/state — save full app state
router.put("/", (req, res) => {
  const state = {
    tasks: req.body.tasks || [],
    habits: req.body.habits || [],
    xpActions: req.body.xpActions || [],
    totalXP: req.body.totalXP || 0,
    lastModified: new Date().toISOString(),
  };
  writeJSON(FILE, state);
  res.json({ ok: true, lastModified: state.lastModified });
});

// PATCH /api/state/tasks — update just tasks
router.patch("/tasks", (req, res) => {
  const state = load();
  state.tasks = req.body.tasks || state.tasks;
  state.lastModified = new Date().toISOString();
  writeJSON(FILE, state);
  res.json({ ok: true });
});

// PATCH /api/state/habits — update just habits
router.patch("/habits", (req, res) => {
  const state = load();
  state.habits = req.body.habits || state.habits;
  state.lastModified = new Date().toISOString();
  writeJSON(FILE, state);
  res.json({ ok: true });
});

// PATCH /api/state/xp — update XP actions + total
router.patch("/xp", (req, res) => {
  const state = load();
  state.xpActions = req.body.xpActions || state.xpActions;
  state.totalXP = req.body.totalXP ?? state.totalXP;
  state.lastModified = new Date().toISOString();
  writeJSON(FILE, state);
  res.json({ ok: true });
});

export default router;
