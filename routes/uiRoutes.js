const express = require("express");
const router = express.Router();

// Test page - for debugging
router.get("/test", (req, res) => {
  res.render("test", {
    title: "Test Page",
    page: "test",
  });
});

// Simple test page - no layout
router.get("/simple", (req, res) => {
  res.render("simple", {
    title: "Simple Test",
    page: "simple",
  });
});

// Home page without layout - for testing
router.get("/home-test", (req, res) => {
  res.render("index-no-layout", {
    title: "Home Test",
    page: "home",
  });
});

// Auth debug page
router.get("/auth-debug", (req, res) => {
  res.render("auth-debug", {
    title: "Auth Debug",
    page: "debug",
  });
});

// Home page
router.get("/", (req, res) => {
  res.render("index", {
    title: "Perfume Store",
    page: "home",
  });
});

// Welcome page - to check authentication
router.get("/welcome", (req, res) => {
  res.render("welcome", {
    title: "Welcome - Perfume Store",
    page: "welcome",
  });
});

// Perfumes page
router.get("/perfumes", (req, res) => {
  res.render("perfumes/index", {
    title: "All Perfumes",
    page: "perfumes",
  });
});

// Single perfume page
router.get("/perfumes/:id", (req, res) => {
  res.render("perfumes/detail", {
    title: "Perfume Details",
    page: "perfumes",
    perfumeId: req.params.id,
  });
});

// Brands page
router.get("/brands", (req, res) => {
  res.render("brands/index", {
    title: "All Brands",
    page: "brands",
  });
});

// Members page
router.get("/members", (req, res) => {
  res.render("members/index", {
    title: "Members",
    page: "members",
  });
});

// Auth pages
router.get("/login", (req, res) => {
  res.render("auth/login", {
    title: "Login",
    page: "login",
  });
});

router.get("/register", (req, res) => {
  res.render("auth/register", {
    title: "Register",
    page: "register",
  });
});

module.exports = router;
