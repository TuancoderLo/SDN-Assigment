const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const memberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    YOB: {
      type: Number,
      required: [true, "Year of birth is required"],
      min: [1900, "Invalid year of birth"],
      max: [new Date().getFullYear(), "Invalid year of birth"],
    },
    gender: {
      type: Boolean,
      required: [true, "Gender is required"],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
memberSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
memberSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to get public profile (without password)
memberSchema.methods.toJSON = function () {
  const member = this.toObject();
  delete member.password;
  return member;
};

module.exports = mongoose.model("Member", memberSchema);
