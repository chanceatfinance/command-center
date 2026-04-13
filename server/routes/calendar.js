import { Router } from "express";
import { readJSON, writeJSON } from "./_util.js";

const router = Router();

router.get("/", (req, res) => {
  try { res.json(readJSON("calendar.json")); }
  catch { res.json({ events: [], synced_at: null }); }
});

// Manual event add (or Claude session can write directly to data/calendar.json)
router.post("/events", (req, res) => {
  const data = (() => { try { return readJSON("calendar.json"); } catch { return { events: [], synced_at: null }; } })();
  const event = {
    id: `e_${Date.now()}`,
    summary: req.body.summary || "Event",
    start: req.body.start,
    end: req.body.end || req.body.start,
    calendar: req.body.calendar || "manual",
  };
  data.events.push(event);
  data.synced_at = new Date().toISOString();
  writeJSON("calendar.json", data);
  res.json(event);
});

export default router;
