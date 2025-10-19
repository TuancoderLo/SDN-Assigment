const Brand = require("../models/Brand");

// @desc    Get all brands
// @route   GET /api/brands
// @access  Public
exports.getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.find().sort({ brandName: 1 });

    res.json({
      success: true,
      count: brands.length,
      data: brands,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single brand
// @route   GET /api/brands/:brandId
// @access  Public
exports.getBrandById = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.brandId);

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }

    res.json({
      success: true,
      data: brand,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create new brand
// @route   POST /api/brands
// @access  Private/Admin
exports.createBrand = async (req, res) => {
  try {
    const { brandName } = req.body;

    const brand = await Brand.create({
      brandName,
    });

    res.status(201).json({
      success: true,
      data: brand,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update brand
// @route   PUT /api/brands/:brandId
// @access  Private/Admin
exports.updateBrand = async (req, res) => {
  try {
    const brand = await Brand.findByIdAndUpdate(req.params.brandId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }

    res.json({
      success: true,
      data: brand,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete brand
// @route   DELETE /api/brands/:brandId
// @access  Private/Admin
exports.deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findByIdAndDelete(req.params.brandId);

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }

    res.json({
      success: true,
      message: "Brand deleted successfully",
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
