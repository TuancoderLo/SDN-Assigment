const Perfume = require("../models/Perfume");

// @desc    Get all perfumes with filters and search
// @route   GET /api/perfumes
// @access  Public
exports.getAllPerfumes = async (req, res) => {
  try {
    const { search, brand, targetAudience, concentration } = req.query;

    let query = {};

    // Search by perfume name
    if (search) {
      query.perfumeName = { $regex: search, $options: "i" };
    }

    // Filter by brand
    if (brand) {
      query.brand = brand;
    }

    // Filter by target audience
    if (targetAudience) {
      query.targetAudience = targetAudience;
    }

    // Filter by concentration
    if (concentration) {
      query.concentration = concentration;
    }

    const perfumes = await Perfume.find(query)
      .populate("brand", "brandName")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: perfumes.length,
      data: perfumes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single perfume with full details
// @route   GET /api/perfumes/:perfumeId
// @access  Public
exports.getPerfumeById = async (req, res) => {
  try {
    const perfume = await Perfume.findById(req.params.perfumeId)
      .populate("brand", "brandName")
      .populate("comments.author", "name email");

    if (!perfume) {
      return res.status(404).json({
        success: false,
        message: "Perfume not found",
      });
    }

    res.json({
      success: true,
      data: perfume,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create new perfume
// @route   POST /api/perfumes
// @access  Private/Admin
exports.createPerfume = async (req, res) => {
  try {
    const perfume = await Perfume.create(req.body);

    // Populate brand info
    await perfume.populate("brand", "brandName");

    res.status(201).json({
      success: true,
      data: perfume,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update perfume
// @route   PUT /api/perfumes/:perfumeId
// @access  Private/Admin
exports.updatePerfume = async (req, res) => {
  try {
    const perfume = await Perfume.findByIdAndUpdate(
      req.params.perfumeId,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate("brand", "brandName");

    if (!perfume) {
      return res.status(404).json({
        success: false,
        message: "Perfume not found",
      });
    }

    res.json({
      success: true,
      data: perfume,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete perfume
// @route   DELETE /api/perfumes/:perfumeId
// @access  Private/Admin
exports.deletePerfume = async (req, res) => {
  try {
    const perfume = await Perfume.findByIdAndDelete(req.params.perfumeId);

    if (!perfume) {
      return res.status(404).json({
        success: false,
        message: "Perfume not found",
      });
    }

    res.json({
      success: true,
      message: "Perfume deleted successfully",
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Add comment/rating to perfume
// @route   POST /api/perfumes/:perfumeId/comments
// @access  Private (Members only)
exports.addComment = async (req, res) => {
  try {
    const { rating, content } = req.body;
    const perfume = await Perfume.findById(req.params.perfumeId);

    if (!perfume) {
      return res.status(404).json({
        success: false,
        message: "Perfume not found",
      });
    }

    // Check if user already commented on this perfume
    const alreadyCommented = perfume.comments.find(
      (comment) => comment.author.toString() === req.user._id.toString()
    );

    if (alreadyCommented) {
      return res.status(400).json({
        success: false,
        message: "You have already commented on this perfume",
      });
    }

    // Add new comment
    const comment = {
      rating: Number(rating),
      content,
      author: req.user._id,
    };

    perfume.comments.push(comment);
    await perfume.save();

    // Populate the author info for the response
    await perfume.populate("comments.author", "name email");

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      data: perfume,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update own comment on perfume
// @route   PUT /api/perfumes/:perfumeId/comments/:commentId
// @access  Private (Comment author only)
exports.updateComment = async (req, res) => {
  try {
    const { rating, content } = req.body;
    const perfume = await Perfume.findById(req.params.perfumeId);

    if (!perfume) {
      return res.status(404).json({
        success: false,
        message: "Perfume not found",
      });
    }

    const comment = perfume.comments.id(req.params.commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Check if the user is the author of the comment
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only edit your own comments",
      });
    }

    // Update comment
    if (rating) comment.rating = Number(rating);
    if (content) comment.content = content;

    await perfume.save();
    await perfume.populate("comments.author", "name email");

    res.json({
      success: true,
      message: "Comment updated successfully",
      data: perfume,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete own comment from perfume
// @route   DELETE /api/perfumes/:perfumeId/comments/:commentId
// @access  Private (Comment author only)
exports.deleteComment = async (req, res) => {
  try {
    const perfume = await Perfume.findById(req.params.perfumeId);

    if (!perfume) {
      return res.status(404).json({
        success: false,
        message: "Perfume not found",
      });
    }

    const comment = perfume.comments.id(req.params.commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Check if the user is the author of the comment
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own comments",
      });
    }

    // Remove comment
    comment.deleteOne();
    await perfume.save();

    res.json({
      success: true,
      message: "Comment deleted successfully",
      data: perfume,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
