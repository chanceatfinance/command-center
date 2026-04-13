import { Router } from "express";
import { readJSON, writeJSON } from "./_util.js";

const router = Router();
const FILE = "tasks.json";

function load() {
  try { return readJSON(FILE); }
  catch { return { tasks: [], lastModified: null }; }
}

function save(data) {
  data.lastModified = new Date().toISOString();
  writeJSON(FILE, data);
}

// GET /api/tasks?status=open&category=business
router.get("/", (req, res) => {
  const data = load();
  let tasks = data.tasks;
  if (req.query.status) tasks = tasks.filter(t => t.status === req.query.status);
  if (req.query.category) tasks = tasks.filter(t => t.category === req.query.category);
  res.json({ tasks, lastModified: data.lastModified });
});

// POST /api/tasks
router.post("/", (req, res) => {
  const data = load();
  const task = {
    id: `t_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    text: req.body.text || "New task",
    category: req.body.category || "personal",
    subcategory: req.body.subcategory || null,
    priority: req.body.priority || "medium",
    status: "open",
    dueDate: req.body.dueDate || null,
    createdAt: new Date().toISOString(),
    completedAt: null,
    notes: req.body.notes || "",
  };
  data.tasks.unshift(task);
  save(data);
  res.json(task);
});

// PATCH /api/tasks/:id
router.patch("/:id", (req, res) => {
  const data = load();
  const task = data.tasks.find(t => t.id === req.params.id);
  if (!task) return res.status(404).json({ error: "Task not found" });

  const allowed = ["text", "category", "subcategory", "priority", "status", "dueDate", "notes"];
  for (const key of allowed) {
    if (req.body[key] !== undefined) task[key] = req.body[key];
  }
  if (req.body.status === "done" && !task.completedAt) {
    task.completedAt = new Date().toISOString();
  }
  save(data);
  res.json(task);
});

// DELETE /api/tasks/:id
router.delete("/:id", (req, res) => {
  const data = load();
  data.tasks = data.tasks.filter(t => t.id !== req.params.id);
  save(data);
  res.json({ deleted: true });
});

export default router;
