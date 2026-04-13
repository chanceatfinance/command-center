import express from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { existsSync } from "fs";
import tasksRouter from "./routes/tasks.js";
import calendarRouter from "./routes/calendar.js";
import businessRouter from "./routes/business.js";
import personalRouter from "./routes/personal.js";
import quantumRouter from "./routes/quantum.js";
import { readJSON, writeJSON } from "./routes/_util.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, "..");

const app = express();
app.use(cors());
app.use(express.json());

// API routes
app.use("/api/tasks", tasksRouter);
app.use("/api/calendar", calendarRouter);
app.use("/api/business", businessRouter);
app.use("/api/personal", personalRouter);
app.use("/api/quantum", quantumRouter);

// GHL Webhook — inline since it's a single endpoint
app.post("/api/ghl-webhook", (req, res) => {
  const payload = req.body;
  const event = {
    type: payload.type || "unknown",
    timestamp: new Date().toISOString(),
    contact: {
      id: payload.contact_id || payload.contactId,
      name: [payload.first_name || payload.firstName, payload.last_name || payload.lastName].filter(Boolean).join(" "),
      email: payload.email,
      phone: payload.phone,
      source: payload.source || payload.lead_source,
    },
    pipeline: {
      stage: payload.pipeline_stage || payload.pipelineStage,
      opportunityId: payload.opportunity_id || payload.opportunityId,
    },
    raw: payload,
  };

  let leads = [];
  try { leads = readJSON("ghl-leads.json"); } catch (e) {}
  leads.push(event);
  if (leads.length > 200) leads = leads.slice(-200);
  writeJSON("ghl-leads.json", leads);
  res.json({ received: true });
});

// Serve frontend in production
const distPath = join(ROOT, "dist");
if (existsSync(distPath)) {
  app.use(express.static(distPath));
  // SPA fallback — only for non-API routes
  app.use((req, res, next) => {
    if (req.method === "GET" && !req.path.startsWith("/api")) {
      res.sendFile(join(distPath, "index.html"));
    } else {
      next();
    }
  });
}

const PORT = process.env.PORT || 3141;
app.listen(PORT, () => {
  console.log(`Command Center API on http://localhost:${PORT}`);
});
