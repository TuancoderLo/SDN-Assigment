const Member = require("../models/Member");

// @desc    Get all members (collectors)
// @route   GET /api/collectors
// @access  Private/Admin only
exports.getAllMembers = async (req, res) => {
  try {
    const members = await Member.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: members.length,
      data: members,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
