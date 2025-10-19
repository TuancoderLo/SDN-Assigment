const Member = require("../models/Member");
const bcrypt = require("bcrypt");

// @desc    Get member profile
// @route   GET /api/members/:id
// @access  Private (Self only)
exports.getMemberProfile = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

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

// @desc    Update member profile
// @route   PUT /api/members/:id
// @access  Private (Self only - not even admin can edit)
exports.updateMemberProfile = async (req, res) => {
  try {
    const { email, name, YOB, gender } = req.body;

    const member = await Member.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    // Update fields (password and isAdmin cannot be changed here)
    if (email) member.email = email;
    if (name) member.name = name;
    if (YOB) member.YOB = YOB;
    if (gender !== undefined) member.gender = gender;

    const updatedMember = await member.save();

    res.json({
      success: true,
      data: updatedMember,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Change member password
// @route   PUT /api/members/:id/password
// @access  Private (Self only)
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide current and new password",
      });
    }

    const member = await Member.findById(req.params.id).select("+password");

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    // Verify current password
    const isMatch = await member.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Update password (will be hashed by pre-save hook)
    member.password = newPassword;
    await member.save();

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get member's comments
// @route   GET /api/members/:id/comments
// @access  Private (Self only)
exports.getMemberComments = async (req, res) => {
  try {
    const Perfume = require("../models/Perfume");

    const perfumes = await Perfume.find({ "comments.author": req.params.id })
      .populate("brand", "brandName")
      .select("perfumeName uri comments brand");

    // Filter to show only the member's comments
    const memberComments = perfumes.map((perfume) => {
      const memberComment = perfume.comments.find(
        (comment) => comment.author.toString() === req.params.id
      );

      return {
        perfumeId: perfume._id,
        perfumeName: perfume.perfumeName,
        perfumeImage: perfume.uri,
        brand: perfume.brand,
        comment: memberComment,
      };
    });

    res.json({
      success: true,
      count: memberComments.length,
      data: memberComments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
