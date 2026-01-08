import fs from "fs";
import csv from "csv-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";

dotenv.config();

const parseArray = (value) =>
  value ? value.split("|").map((v) => v.trim()) : [];

async function seedProducts() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ MongoDB connected");

  const products = [];
  const seen = new Set();

  fs.createReadStream("products.csv")
    .pipe(csv())
    .on("data", (row) => {
      const key = `${row.name}|${row.category}`;

      if (seen.has(key)) return;
      seen.add(key);

      products.push({
        name: row.name,
        description: row.description,
        images: parseArray(row.images),

        brand: row.brand,
        price: Number(row.price),
        oldPrice: Number(row.oldPrice),

        gender: row.gender,
        category: row.category,
        subCategory: row.subCategory,

        countInStock: Number(row.countInStock),
        rating: Number(row.rating),
        isFeatured: row.isFeatured === "true",

        color: row.color,
        location: row.location,

        additionalInfo: row.additionalInfo,
        dimensions: row.dimensions,

        sizes: parseArray(row.sizes),
        variants: parseArray(row.variants),

        dateCreated: new Date(row.dateCreated)
      });
    })
    .on("end", async () => {
      let inserted = 0;
      let skipped = 0;

      for (const product of products) {
        const exists = await Product.findOne({
          name: product.name,
          category: product.category
        });

        if (exists) {
          skipped++;
          continue;
        }

        await Product.create(product);
        inserted++;
      }

      console.log(`✅ Inserted: ${inserted}`);
      console.log(`⚠️ Skipped duplicates: ${skipped}`);
      process.exit();
    });
}

seedProducts();
