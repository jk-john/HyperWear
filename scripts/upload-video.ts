import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL is not set in .env.local');
  process.exit(1);
}

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY is not set in .env.local');
  console.log('📝 Please add your service role key to .env.local:');
  console.log('   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function uploadVideo() {
  try {
    console.log('🎬 Starting video upload to Supabase...');

    // Read the video file
    const videoPath = resolve(process.cwd(), 'public/video-homepage.mp4');
    const videoBuffer = readFileSync(videoPath);

    console.log(`📁 Video file size: ${(videoBuffer.length / 1024 / 1024).toFixed(2)} MB`);

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('media')
      .upload('videos/homepage-background.mp4', videoBuffer, {
        contentType: 'video/mp4',
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      throw error;
    }

    console.log('✅ Video uploaded successfully!');
    console.log('📍 File path:', data.path);

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('media')
      .getPublicUrl('videos/homepage-background.mp4');

    console.log('🌐 Public URL:', urlData.publicUrl);
    console.log('🎉 You can now update your Hero component to use this URL!');
    console.log('');
    console.log('💡 Next steps:');
    console.log('   1. Verify the video loads at the URL above');
    console.log('   2. Run: rm public/video-homepage.mp4');
    console.log('   3. Push your changes to remove the large file from git');

  } catch (error) {
    console.error('❌ Upload failed:', error);
  }
}

uploadVideo(); 