import { Router } from "express";
import { readJSON, writeJSON } from "./_util.js";

const router = Router();

router.get("/", (req, res) => {
  try { res.json(readJSON("emails.json")); }
  catch { res.json({ emails: [], stats: {}, synced_at: null }); }
});

// Mark email as read
router.patch("/:id/read", (req, res) => {
  try {
    const data = readJSON("emails.json");
    const email = data.emails.find(e => e.id === req.params.id);
    if (email) {
      email.unread = false;
      writeJSON("emails.json", data);
    }
    res.json({ ok: true });
  } catch { res.json({ ok: false }); }
});

export default router;
