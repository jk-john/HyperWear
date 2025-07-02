import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Error: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set in your .env file.",
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);
const BUCKET_NAME = "products-images";

async function updateProductImages() {
  try {
    console.log("Fetching products...");
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("id, slug");

    if (productsError) {
      throw new Error(`Error fetching products: ${productsError.message}`);
    }

    if (!products || products.length === 0) {
      console.log("No products found.");
      return;
    }

    console.log(
      `Found ${products.length} products. Starting image update process...`,
    );

    for (const product of products) {
      const { id, slug } = product;
      if (!slug) {
        console.warn(`Product with ID ${id} has no slug. Skipping.`);
        continue;
      }

      console.log(`\nProcessing product: ${slug} (ID: ${id})`);

      const { data: files, error: listError } = await supabase.storage
        .from(BUCKET_NAME)
        .list(slug, {
          limit: 100,
          offset: 0,
          sortBy: { column: "name", order: "asc" },
        });

      if (listError) {
        console.error(
          `  - Error listing files for ${slug}: ${listError.message}`,
        );
        continue;
      }

      if (!files || files.length === 0) {
        console.log(`  - No images found for ${slug}.`);
        continue;
      }

      const imageUrls = files.map((file) => {
        const {
          data: { publicUrl },
        } = supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(`${slug}/${file.name}`);
        return publicUrl;
      });

      console.log(`  - Found ${imageUrls.length} images. Updating database...`);

      const { error: updateError } = await supabase
        .from("products")
        .update({ images: imageUrls })
        .eq("id", id);

      if (updateError) {
        console.error(
          `  - Error updating product ${slug}: ${updateError.message}`,
        );
      } else {
        console.log(`  - Successfully updated images for ${slug}.`);
      }
    }

    console.log("\nImage update process finished!");
  } catch (error) {
    console.error("An unexpected error occurred:", error.message);
  }
}

updateProductImages();
