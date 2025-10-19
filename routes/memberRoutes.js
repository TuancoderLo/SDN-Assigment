const express = require("express");
const router = express.Router();
const {
  getMemberProfile,
  updateMemberProfile,
  changePassword,
  getMemberComments,
} = require("../controllers/memberController");
const { protect, isSelfOnly } = require("../middleware/auth");

// All routes require authentication and self-only access
router.get("/:id", protect, isSelfOnly, getMemberProfile);
router.put("/:id", protect, isSelfOnly, updateMemberProfile);
router.put("/:id/password", protect, isSelfOnly, changePassword);
router.get("/:id/comments", protect, isSelfOnly, getMemberComments);

module.exports = router;
