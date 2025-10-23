const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/auth");

// Admin dashboard
router.get("/admin", protect, adminOnly, async (req, res) => {
  try {
    const Perfume = require("../models/Perfume");
    const Brand = require("../models/Brand");
    const Member = require("../models/Member");

    const perfumesCount = await Perfume.countDocuments();
    const brandsCount = await Brand.countDocuments();
    const membersCount = await Member.countDocuments();
    const adminsCount = await Member.countDocuments({ isAdmin: true });

    const recentPerfumes = await Perfume.find()
      .populate("brand", "brandName")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    const recentMembers = await Member.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    res.render("admin/dashboard", {
      title: "Admin Dashboard",
      page: "admin",
      stats: {
        perfumesCount,
        brandsCount,
        membersCount,
        adminsCount,
      },
      recentPerfumes,
      recentMembers,
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    res.status(500).send("Server Error");
  }
});

// Admin perfumes management
router.get("/admin/perfumes", protect, adminOnly, async (req, res) => {
  try {
    const Perfume = require("../models/Perfume");
    const Brand = require("../models/Brand");

    const perfumes = await Perfume.find()
      .populate("brand", "brandName")
      .sort({ createdAt: -1 })
      .lean();

    const brands = await Brand.find().sort({ brandName: 1 }).lean();

    res.render("admin/perfumes", {
      title: "Manage Perfumes",
      page: "admin-perfumes",
      perfumes,
      brands,
    });
  } catch (error) {
    console.error("Admin perfumes error:", error);
    res.status(500).send("Server Error");
  }
});

// Admin members management (collectors endpoint)
router.get("/admin/members", protect, adminOnly, async (req, res) => {
  try {
    const Member = require("../models/Member");

    const members = await Member.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();

    res.render("admin/members", {
      title: "Manage Members",
      page: "admin-members",
      members,
    });
  } catch (error) {
    console.error("Admin members error:", error);
    res.status(500).send("Server Error");
  }
});

// Profile routes
router.get("/profile", protect, (req, res) => {
  res.render("profile/edit", {
    title: "Edit Profile",
    page: "profile",
    user: req.user,
  });
});

router.get("/profile/password", protect, (req, res) => {
  res.render("profile/password", {
    title: "Change Password",
    page: "profile",
  });
});

module.exports = router;
