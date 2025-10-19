const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: 1,
      max: 5,
    },
    content: {
      type: String,
      required: [true, "Comment content is required"],
      trim: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: [true, "Author is required"],
    },
  },
  {
    timestamps: true,
  }
);

const perfumeSchema = new mongoose.Schema(
  {
    perfumeName: {
      type: String,
      required: [true, "Perfume name is required"],
      trim: true,
    },
    uri: {
      type: String,
      required: [true, "Image URI is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price must be positive"],
    },
    concentration: {
      type: String,
      required: [true, "Concentration is required"],
      enum: ["Extrait", "EDP", "EDT", "EDC", "Eau Fraiche"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    ingredients: {
      type: String,
      required: [true, "Ingredients are required"],
    },
    volume: {
      type: Number,
      required: [true, "Volume is required"],
      min: [0, "Volume must be positive"],
    },
    targetAudience: {
      type: String,
      required: [true, "Target audience is required"],
      enum: ["male", "female", "unisex"],
    },
    comments: [commentSchema],
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: [true, "Brand is required"],
    },
  },
  {
    timestamps: true,
  }
);

// Index for search
perfumeSchema.index({ perfumeName: "text", description: "text" });

module.exports = mongoose.model("Perfume", perfumeSchema);
