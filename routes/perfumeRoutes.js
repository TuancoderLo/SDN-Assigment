const express = require("express");
const router = express.Router();
const {
  getAllPerfumes,
  getPerfumeById,
  createPerfume,
  updatePerfume,
  deletePerfume,
  addComment,
  updateComment,
  deleteComment,
} = require("../controllers/perfumeController");
const { protect, adminOnly } = require("../middleware/auth");

// Public routes
router.get("/", getAllPerfumes);
router.get("/:perfumeId", getPerfumeById);

// Admin only routes
router.post("/", protect, adminOnly, createPerfume);
router.put("/:perfumeId", protect, adminOnly, updatePerfume);
router.delete("/:perfumeId", protect, adminOnly, deletePerfume);

// Member routes for comments
router.post("/:perfumeId/comments", protect, addComment);
router.put("/:perfumeId/comments/:commentId", protect, updateComment);
router.delete("/:perfumeId/comments/:commentId", protect, deleteComment);

module.exports = router;
