import { Router } from "express";
import { readJSON, writeJSON } from "./_util.js";

const router = Router();

// Pipeline
router.get("/pipeline", (req, res) => {
  try { res.json(readJSON("pipeline.json")); }
  catch { res.json({ all: [], mortgage: [], referral: [] }); }
});

// Pace tracker
router.get("/pace", (req, res) => {
  try { res.json(readJSON("pace-tracker.json")); }
  catch { res.json({ goal: 200000, closedDeals: [], totalGross: 0 }); }
});

router.post("/pace/deal", (req, res) => {
  const data = (() => { try { return readJSON("pace-tracker.json"); } catch { return { goal: 200000, closedDeals: [], totalGross: 0 }; } })();
  const deal = {
    id: `d_${Date.now()}`,
    amount: req.body.amount || 0,
    client: req.body.client || "",
    type: req.body.type || "purchase",
    closedDate: req.body.closedDate || new Date().toISOString().slice(0, 10),
  };
  data.closedDeals.push(deal);
  data.totalGross += deal.amount;
  data.lastUpdated = new Date().toISOString();
  writeJSON("pace-tracker.json", data);
  res.json(data);
});

// Referral partners
router.get("/partners", (req, res) => {
  try { res.json(readJSON("referral-partners.json")); }
  catch { res.json({ partners: [] }); }
});

router.post("/partners", (req, res) => {
  const data = (() => { try { return readJSON("referral-partners.json"); } catch { return { partners: [] }; } })();
  const partner = {
    id: `rp_${Date.now()}`,
    name: req.body.name || "",
    company: req.body.company || "",
    type: req.body.type || "",
    status: "active",
    lastTouch: null,
    notes: req.body.notes || "",
  };
  data.partners.push(partner);
  data.lastModified = new Date().toISOString();
  writeJSON("referral-partners.json", data);
  res.json(partner);
});

router.patch("/partners/:id", (req, res) => {
  const data = (() => { try { return readJSON("referral-partners.json"); } catch { return { partners: [] }; } })();
  const p = data.partners.find(p => p.id === req.params.id);
  if (!p) return res.status(404).json({ error: "Not found" });
  Object.assign(p, req.body);
  data.lastModified = new Date().toISOString();
  writeJSON("referral-partners.json", data);
  res.json(p);
});

// GHL leads
router.get("/leads", (req, res) => {
  try { res.json(readJSON("ghl-leads.json")); }
  catch { res.json([]); }
});

export default router;
