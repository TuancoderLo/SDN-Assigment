const express = require("express");
const router = express.Router();
const {
  getAllBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand,
} = require("../controllers/brandController");
const { protect, adminOnly } = require("../middleware/auth");

// Public routes
router.get("/", getAllBrands);
router.get("/:brandId", getBrandById);

// Admin only routes
router.post("/", protect, adminOnly, createBrand);
router.put("/:brandId", protect, adminOnly, updateBrand);
router.delete("/:brandId", protect, adminOnly, deleteBrand);

module.exports = router;
