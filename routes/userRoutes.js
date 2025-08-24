const express = require('express');
const router = express.Router();

// Minimal — you can expand later
router.get('/health', (_req, res) => res.json({ ok: true }));

module.exports = router;
