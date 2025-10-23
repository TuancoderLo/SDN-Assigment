const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Member = require("./models/Member");
const Brand = require("./models/Brand");
const Perfume = require("./models/Perfume");

dotenv.config();

// Connect to database
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

const seedData = async () => {
  try {
    // Clear existing data
    await Member.deleteMany();
    await Brand.deleteMany();
    await Perfume.deleteMany();

    console.log("Cleared existing data");

    // Create Admin
    const admin = await Member.create({
      email: "admin@myteam.com",
      password: "admin123",
      name: "Do Nam Trung",
      YOB: 1990,
      gender: true,
      isAdmin: true,
    });

    // Create Regular Members
    const member1 = await Member.create({
      email: "member1@test.com",
      password: "member123",
      name: "Nguyen Van A",
      YOB: 1995,
      gender: true,
      isAdmin: false,
    });

    const member2 = await Member.create({
      email: "member2@test.com",
      password: "member123",
      name: "Tran Thi B",
      YOB: 1998,
      gender: false,
      isAdmin: false,
    });

    console.log("Members created:", { admin, member1, member2 });

    // Create Brands
    const dior = await Brand.create({ brandName: "Dior" });
    const chanel = await Brand.create({ brandName: "Chanel" });
    const tomFord = await Brand.create({ brandName: "Tom Ford" });
    const creed = await Brand.create({ brandName: "Creed" });
    const versace = await Brand.create({ brandName: "Versace" });

    console.log("Brands created");

    // Create Perfumes
    const perfumes = [
      {
        perfumeName: "Sauvage",
        uri: "https://www.dior.com/beauty/version-5.1432748111912/resize-image/ep/0/390/100/0/packshot/image/c1/ca/c1ca887d74ec661bda9f19b2c03fef4f_0000000000003348_001_8300.jpg",
        price: 120,
        concentration: "EDT",
        description: "A fresh and woody fragrance inspired by wide-open spaces",
        ingredients: "Bergamot, Pepper, Ambroxan, Cedar",
        volume: 100,
        targetAudience: "male",
        brand: dior._id,
        comments: [],
      },
      {
        perfumeName: "J'adore",
        uri: "https://www.dior.com/beauty/version-5.1432748111912/resize-image/ep/0/390/100/0/packshot/image/f8/f5/f8f5b0e16e44e27ae03a5c9a4bb1f273_0000000000003348_002_8300.jpg",
        price: 150,
        concentration: "Extrait",
        description: "The feminine, floral and sensual scent",
        ingredients: "Ylang-Ylang, Rose, Jasmine",
        volume: 75,
        targetAudience: "female",
        brand: dior._id,
        comments: [],
      },
      {
        perfumeName: "Chanel No. 5",
        uri: "https://www.chanel.com/images//t_one//w_0.51,h_0.51,c_crop/q_auto:good,f_jpg,fl_lossy,dpr_1.1/w_620/chanel-no-5-eau-de-parfum-spray-3-4fl-oz--packshot-default-126530-8834529411102.jpg",
        price: 180,
        concentration: "EDP",
        description: "The legendary fragrance, timeless and classic",
        ingredients: "Aldehydes, Jasmine, Rose, Vanilla, Sandalwood",
        volume: 100,
        targetAudience: "female",
        brand: chanel._id,
        comments: [],
      },
      {
        perfumeName: "Bleu de Chanel",
        uri: "https://www.chanel.com/images//t_one//w_0.51,h_0.51,c_crop/q_auto:good,f_jpg,fl_lossy,dpr_1.1/w_620/bleu-de-chanel-eau-de-parfum-spray-3-4fl-oz--packshot-default-107660-8834529345566.jpg",
        price: 165,
        concentration: "EDP",
        description:
          "A woody aromatic fragrance for the man who defies convention",
        ingredients: "Citrus, Incense, Cedar, Sandalwood",
        volume: 100,
        targetAudience: "male",
        brand: chanel._id,
        comments: [],
      },
      {
        perfumeName: "Black Orchid",
        uri: "https://www.tomford.com/dw/image/v2/AANG_PRD/on/demandware.static/-/Sites-tomford-master-catalog/default/dw2b6e4a5c/images/large/T0X5_5ml_BLACK_ORCHID.jpg",
        price: 200,
        concentration: "EDP",
        description: "A luxurious and sensual fragrance with dark accords",
        ingredients: "Black Truffle, Ylang-Ylang, Black Orchid, Patchouli",
        volume: 50,
        targetAudience: "unisex",
        brand: tomFord._id,
        comments: [],
      },
      {
        perfumeName: "Oud Wood",
        uri: "https://www.tomford.com/dw/image/v2/AANG_PRD/on/demandware.static/-/Sites-tomford-master-catalog/default/dw91f3e0ef/images/large/T0X1_5ml_OUD_WOOD.jpg",
        price: 250,
        concentration: "EDP",
        description: "Rare oud wood is surrounded by exotic spices",
        ingredients: "Oud Wood, Sandalwood, Rosewood, Cardamom, Amber",
        volume: 50,
        targetAudience: "unisex",
        brand: tomFord._id,
        comments: [],
      },
      {
        perfumeName: "Aventus",
        uri: "https://creedfragrances.com/cdn/shop/products/aventus-edp-100ml-flacon-front_1024x1024.jpg",
        price: 450,
        concentration: "EDP",
        description: "Strength, vision and success",
        ingredients: "Pineapple, Bergamot, Apple, Birch, Musk, Oak Moss",
        volume: 100,
        targetAudience: "male",
        brand: creed._id,
        comments: [],
      },
      {
        perfumeName: "Eros",
        uri: "https://www.versace.com/dw/image/v2/ABAO_PRD/on/demandware.static/-/Sites-ver-master-catalog/default/dw8e0f4f9a/original/90_8011003845354_01_FRA_EROS_EDT_100ml_F.jpg",
        price: 95,
        concentration: "EDT",
        description: "A fragrance for a strong, passionate man",
        ingredients: "Mint, Green Apple, Tonka Bean, Vanilla, Cedar",
        volume: 100,
        targetAudience: "male",
        brand: versace._id,
        comments: [],
      },
      {
        perfumeName: "Bright Crystal",
        uri: "https://www.versace.com/dw/image/v2/ABAO_PRD/on/demandware.static/-/Sites-ver-master-catalog/default/dw8e0f4f9a/original/90_8011003845354_02_FRA_BRIGHT_CRYSTAL_EDT_90ml_F.jpg",
        price: 85,
        concentration: "EDT",
        description: "A fresh, luminous fragrance",
        ingredients: "Pomegranate, Peony, Magnolia, Musk, Mahogany",
        volume: 90,
        targetAudience: "female",
        brand: versace._id,
        comments: [],
      },
    ];

    await Perfume.insertMany(perfumes);
    console.log("Perfumes created");

    console.log("\n=== Seed Data Summary ===");
    console.log("Admin Account:");
    console.log("  Email: admin@myteam.com");
    console.log("  Password: admin123");
    console.log("\nMember Accounts:");
    console.log("  Email: member1@test.com");
    console.log("  Password: member123");
    console.log("  Email: member2@test.com");
    console.log("  Password: member123");
    console.log("\n========================");

    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

seedData();
