import { Router } from "express";
import { readJSON, writeJSON } from "./_util.js";

const router = Router();
const FILE = "projects.json";

function load() {
  try { return readJSON(FILE); }
  catch { return { projects: [], alerts: [], lastModified: null }; }
}

// GET /api/projects
router.get("/", (req, res) => {
  res.json(load());
});

// PATCH /api/projects/:id — update a project
router.patch("/:id", (req, res) => {
  const data = load();
  const project = data.projects.find(p => p.id === req.params.id);
  if (!project) return res.status(404).json({ error: "Not found" });
  Object.assign(project, req.body);
  project.lastUpdated = new Date().toISOString();
  data.lastModified = new Date().toISOString();
  writeJSON(FILE, data);
  res.json(project);
});

// POST /api/projects/:id/decisions — add a decision
router.post("/:id/decisions", (req, res) => {
  const data = load();
  const project = data.projects.find(p => p.id === req.params.id);
  if (!project) return res.status(404).json({ error: "Not found" });
  const decision = {
    date: req.body.date || new Date().toISOString().slice(0, 10),
    text: req.body.text,
  };
  project.decisions.push(decision);
  project.lastUpdated = new Date().toISOString();
  data.lastModified = new Date().toISOString();
  writeJSON(FILE, data);
  res.json(decision);
});

// PATCH /api/projects/alerts/:id — resolve/update an alert
router.patch("/alerts/:id", (req, res) => {
  const data = load();
  const alert = data.alerts.find(a => a.id === req.params.id);
  if (!alert) return res.status(404).json({ error: "Not found" });
  Object.assign(alert, req.body);
  data.lastModified = new Date().toISOString();
  writeJSON(FILE, data);
  res.json(alert);
});

export default router;
