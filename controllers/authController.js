const Member = require("../models/Member");
const generateToken = require("../utils/generateToken");

// @desc    Register a new member
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { email, password, name, YOB, gender } = req.body;

    // Check if member exists
    const memberExists = await Member.findOne({ email });

    if (memberExists) {
      return res.status(400).json({
        success: false,
        message: "Member already exists with this email",
      });
    }

    // Create member (password will be hashed automatically by pre-save hook)
    const member = await Member.create({
      email,
      password,
      name,
      YOB,
      gender,
      isAdmin: false, // Default is not admin
    });

    if (member) {
      res.status(201).json({
        success: true,
        data: {
          _id: member._id,
          email: member.email,
          name: member.name,
          YOB: member.YOB,
          gender: member.gender,
          isAdmin: member.isAdmin,
          token: generateToken(member._id),
        },
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid member data",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Login member
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for member email
    const member = await Member.findOne({ email }).select("+password");

    if (!member) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check if password matches
    const isMatch = await member.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generateToken(member._id);

    // Set cookie for UI
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      success: true,
      data: {
        _id: member._id,
        email: member.email,
        name: member.name,
        YOB: member.YOB,
        gender: member.gender,
        isAdmin: member.isAdmin,
        token: token,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get current logged in member
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const member = await Member.findById(req.user._id);

    res.json({
      success: true,
      data: member,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Logout member (clear cookie)
// @route   POST /api/auth/logout
// @access  Public
exports.logout = (req, res) => {
  res.clearCookie("token");

  res.json({
    success: true,
    message: "Logged out successfully",
  });
};
