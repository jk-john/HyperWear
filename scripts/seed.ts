import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Supabase URL or service key not provided in .env.local");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Tests products
const products = [
  {
    id: "1",
    name: "HyperFlow Performance Tee",
    slug: "hyperflow-performance-tee",
    category: "T-shirts",
    price: 49,
    originalPrice: 65,
    colors: ["#2E2E2E", "#C8F3F3", "#3B8B8B"],
    image: "/products-img/tee-shirt.webp",
    tags: ["New", "-25%"],
    gender: "men",
  },
  {
    id: "2",
    name: "AeroFlex Running Tee",
    slug: "aeroflex-running-tee",
    category: "T-shirts",
    price: 55,
    originalPrice: 70,
    colors: ["#2E2E2E", "#C8F3F3", "#3B8B8B"],
    image: "/products-img/hoddie-2.webp",
    tags: ["New"],
    gender: "men",
  },
  {
    id: "3",
    name: "Vortex Training Tee",
    slug: "vortex-training-tee",
    category: "T-shirts",
    price: 120,
    originalPrice: 150,
    colors: ["#2E2E2E", "#C8F3F3", "#3B8B8B"],
    image: "/products-img/hoodie.webp",
    tags: ["-20%"],
    gender: "men",
  },
  {
    id: "4",
    name: "HyperWear Mug",
    slug: "hyperwear-mug",
    category: "Cups",
    price: 15,
    originalPrice: 20,
    colors: ["#FFFFFF", "#C8F3F3", "#3B8B8B"],
    image: "/products-img/mug.webp",
    tags: [],
    gender: "unisex",
  },
  {
    id: "5",
    name: "HyperWear Mug v2",
    slug: "hyperwear-mug-v2",
    category: "Cups",
    price: 15,
    originalPrice: 20,
    colors: ["#FFFFFF", "#C8F3F3", "#3B8B8B"],
    image: "/products-img/mug-2.webp",
    tags: [],
    gender: "unisex",
  },
  {
    id: "6",
    name: "HyperWear Plushie",
    slug: "hyperwear-plushie",
    category: "Plushes",
    price: 25,
    originalPrice: 30,
    colors: ["#2E2E2E", "#C8F3F3", "#3B8B8B"],
    image: "/products-img/plush.jpeg",
    tags: [],
    gender: "unisex",
  },
  {
    id: "7",
    name: "HyperWear Cap",
    slug: "hyperwear-cap",
    category: "Caps",
    price: 20,
    originalPrice: 25,
    colors: ["#2E2E2E", "#C8F3F3", "#3B8B8B"],
    image: "/products-img/caps-2.jpg",
    tags: [],
    gender: "unisex",
  },
  {
    id: "8",
    name: "Momentum Compression Tights",
    slug: "momentum-compression-tights",
    category: "T-shirts",
    price: 85,
    originalPrice: 100,
    colors: ["#2E2E2E", "#C8F3F3", "#3B8B8B"],
    image: "/products-img/plush-2.jpeg",
    tags: [],
    gender: "women",
  },
  {
    id: "9",
    name: "HyperFlow Performance Tee",
    slug: "hyperflow-performance-tee-women",
    category: "T-shirts",
    price: 49,
    originalPrice: 65,
    colors: ["#2E2E2E", "#C8F3F3", "#3B8B8B"],
    image: "/products-img/tee-shirt.webp",
    tags: ["New", "-25%"],
    gender: "women",
  },
  {
    id: "10",
    name: "HyperWear Phone Case",
    slug: "hyperwear-phone-case",
    category: "Phone Cases",
    price: 25,
    originalPrice: 30,
    colors: ["#2E2E2E", "#C8F3F3", "#3B8B8B"],
    image: "/products-img/plush-3.jpeg", // Using a placeholder image
    tags: ["New"],
    gender: "unisex",
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
      slug: product.slug,
      description: product.name, // Using name as description for now
      price: product.price,
      images: [imageUrl],
      category: product.category,
      gender: product.gender,
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
