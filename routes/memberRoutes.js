const express = require("express");
const router = express.Router();
const {
  getAllMembers,
  getMemberProfile,
  updateMemberProfile,
  changePassword,
  getMemberComments,
} = require("../controllers/memberController");
const { protect, isSelfOnly } = require("../middleware/auth");

// Public route to get all members
router.get("/", getAllMembers);

// All other routes require authentication and self-only access
router.get("/:id", protect, isSelfOnly, getMemberProfile);
router.put("/:id", protect, isSelfOnly, updateMemberProfile);
router.put("/:id/password", protect, isSelfOnly, changePassword);
router.get("/:id/comments", protect, isSelfOnly, getMemberComments);

module.exports = router;
