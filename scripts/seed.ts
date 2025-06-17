import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Supabase URL or service key not provided in .env.local");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const products = [
  {
    id: "1",
    name: "HyperFlow Performance Tee",
    category: "Shirts",
    price: 49,
    originalPrice: 65,
    colors: ["#2E2E2E", "#C8F3F3", "#3B8B8B"],
    image: "/products-img/tee-shirt.webp",
    tags: ["New", "-25%"],
  },
  {
    id: "2",
    name: "AeroFlex Running Hoodie",
    category: "Hoodies",
    price: 55,
    originalPrice: 70,
    colors: ["#2E2E2E", "#C8F3F3", "#3B8B8B"],
    image: "/products-img/hoddie-2.webp",
    tags: ["New"],
  },
  {
    id: "3",
    name: "Vortex Training Hoodie",
    category: "Hoodies",
    price: 120,
    originalPrice: 150,
    colors: ["#2E2E2E", "#C8F3F3", "#3B8B8B"],
    image: "/products-img/hoodie.webp",
    tags: ["-20%"],
  },
  {
    id: "4",
    name: "HyperWear Mug",
    category: "Mugs",
    price: 15,
    originalPrice: 20,
    colors: ["#FFFFFF", "#C8F3F3", "#3B8B8B"],
    image: "/products-img/mug.webp",
    tags: [],
  },
  {
    id: "5",
    name: "HyperWear Mug v2",
    category: "Mugs",
    price: 15,
    originalPrice: 20,
    colors: ["#FFFFFF", "#C8F3F3", "#3B8B8B"],
    image: "/products-img/mug-2.webp",
    tags: [],
  },
  {
    id: "6",
    name: "HyperWear Plushie",
    category: "Plushies",
    price: 25,
    originalPrice: 30,
    colors: ["#2E2E2E", "#C8F3F3", "#3B8B8B"],
    image: "/products-img/plush.jpeg",
    tags: [],
  },
  {
    id: "7",
    name: "HyperWear Cap",
    category: "Caps",
    price: 20,
    originalPrice: 25,
    colors: ["#2E2E2E", "#C8F3F3", "#3B8B8B"],
    image: "/products-img/caps-2.jpg",
    tags: [],
  },
  {
    id: "8",
    name: "Momentum Compression Tights",
    category: "Pants",
    price: 85,
    originalPrice: 100,
    colors: ["#2E2E2E", "#C8F3F3", "#3B8B8B"],
    image: "/products-img/plush-2.jpeg",
    tags: [],
  },
  {
    id: "9",
    name: "HyperFlow Performance Tee",
    category: "Shirts",
    price: 49,
    originalPrice: 65,
    colors: ["#2E2E2E", "#C8F3F3", "#3B8B8B"],
    image: "/products-img/tee-shirt.webp",
    tags: ["New", "-25%"],
  },
];

const BUCKET_NAME = "product-images";

async function seedDatabase() {
  console.log("Starting database seed...");

  for (const product of products) {
    const imageName = product.image.split("/").pop();
    if (!imageName) {
      console.error(`Could not determine image name for product ${product.id}`);
      continue;
    }

    const imagePath = path.join(
      process.cwd(),
      "public",
      "products-img",
      imageName,
    );

    if (!fs.existsSync(imagePath)) {
      console.error(`Image not found at path: ${imagePath}`);
      continue;
    }

    const imageBuffer = fs.readFileSync(imagePath);
    const storagePath = `${imageName}`;

    console.log(`Uploading ${imageName} to Supabase Storage...`);
    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(storagePath, imageBuffer, {
        cacheControl: "3600",
        upsert: true, // Overwrite if file exists
        contentType: fs.statSync(imagePath).isFile()
          ? `image/${imageName.split(".").pop()}`
          : "image/jpeg",
      });

    if (uploadError) {
      console.error(`Error uploading image ${imageName}:`, uploadError);
      continue;
    }

    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(storagePath);

    if (!publicUrlData) {
      console.error(`Could not get public URL for ${imageName}`);
      continue;
    }

    const imageUrl = publicUrlData.publicUrl;

    console.log(`Inserting product ${product.name} into the database...`);
    const { error: insertError } = await supabase.from("products").insert({
      name: product.name,
      description: product.name, // Using name as description for now
      price: product.price,
      image_url: imageUrl,
      category: product.category,
      original_price: product.originalPrice,
      tags: product.tags,
      colors: product.colors,
    });

    if (insertError) {
      console.error(`Error inserting product ${product.name}:`, insertError);
    } else {
      console.log(`Successfully seeded product: ${product.name}`);
    }
  }

  console.log("Database seeding finished.");
}

seedDatabase().catch(console.error);
