import { Router } from "express";
import { readJSON, writeJSON } from "./_util.js";

const router = Router();
const FILE = "goals.json";

function load() {
  try { return readJSON(FILE); }
  catch { return { goals: [], habits: [], lastModified: null }; }
}

router.get("/", (req, res) => {
  res.json(load());
});

// Update a goal
router.patch("/goals/:id", (req, res) => {
  const data = load();
  const goal = data.goals.find(g => g.id === req.params.id);
  if (!goal) return res.status(404).json({ error: "Not found" });
  Object.assign(goal, req.body);
  data.lastModified = new Date().toISOString();
  writeJSON(FILE, data);
  res.json(goal);
});

// Habit check-in
router.post("/habits/:id/checkin", (req, res) => {
  const data = load();
  const habit = data.habits.find(h => h.id === req.params.id);
  if (!habit) return res.status(404).json({ error: "Not found" });

  const today = new Date().toISOString().slice(0, 10);
  if (habit.lastDate === today) {
    return res.json({ habit, message: "Already checked in today" });
  }

  // Check if yesterday was the last date (for streak)
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  habit.streak = (habit.lastDate === yesterday) ? habit.streak + 1 : 1;
  habit.lastDate = today;
  if (!habit.history) habit.history = [];
  habit.history.push(today);
  if (habit.history.length > 90) habit.history = habit.history.slice(-90);

  data.lastModified = new Date().toISOString();
  writeJSON(FILE, data);
  res.json(habit);
});

export default router;
