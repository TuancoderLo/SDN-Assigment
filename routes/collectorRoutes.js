const express = require("express");
const router = express.Router();
const { getAllMembers } = require("../controllers/collectorController");
const { protect, adminOnly } = require("../middleware/auth");

// Admin only route
router.get("/", protect, adminOnly, getAllMembers);

module.exports = router;
