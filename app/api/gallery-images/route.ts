import { createClient } from '@supabase/supabase-js';
import { getSupabaseServiceRoleKey, getSupabaseStorageUrl } from '@/lib/supabase/config';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = createClient(
      getSupabaseStorageUrl(),
      getSupabaseServiceRoleKey()
    );
    
    const { data: files, error } = await supabase.storage
      .from('hyperwear-images')
      .list('', {
        limit: 100,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' },
      });

    if (error) {
      console.error('Error fetching gallery images:', error);
      return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 });
    }

    if (!files || files.length === 0) {
      return NextResponse.json({ images: [] });
    }

    // Generate public URLs for all images
    const imageUrls = files
      .filter(file => {
        // Only include image files
        const isImage = /\.(jpg|jpeg|png|webp|gif)$/i.test(file.name);
        return isImage && file.name !== '.emptyFolderPlaceholder';
      })
      .map(file => {
        const { data: { publicUrl } } = supabase.storage
          .from('hyperwear-images')
          .getPublicUrl(file.name);
        return publicUrl;
      });

    return NextResponse.json({ 
      images: imageUrls,
      count: imageUrls.length 
    });

  } catch (error) {
    console.error('Unexpected error fetching gallery images:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Cache for 5 minutes
export const revalidate = 300;