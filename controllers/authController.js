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

    res.json({
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
