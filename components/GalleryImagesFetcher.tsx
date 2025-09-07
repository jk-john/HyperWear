import { createClient } from '@/lib/supabase/client';

interface GalleryImagesFetcherProps {
  children: (images: string[]) => React.ReactNode;
}

async function fetchGalleryImages(): Promise<string[]> {
  try {
    const supabase = createClient();
    
    const { data: files, error } = await supabase.storage
      .from('hyperwear-images')
      .list('', {
        limit: 100,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' },
      });

    if (error) {
      console.error('Error fetching gallery images:', error);
      return [];
    }

    if (!files || files.length === 0) {
      return [];
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

    return imageUrls;

  } catch (error) {
    console.error('Unexpected error fetching gallery images:', error);
    return [];
  }
}

export default async function GalleryImagesFetcher({ children }: GalleryImagesFetcherProps) {
  const images = await fetchGalleryImages();
  
  // Fallback images if Supabase fetch fails
  const fallbackImages = [
    "https://auth.hyperwear.io/storage/v1/object/public/hyperwear-images/DSC02198.jpg",
    "https://auth.hyperwear.io/storage/v1/object/public/hyperwear-images/DSC02218.jpg",
    "https://auth.hyperwear.io/storage/v1/object/public/hyperwear-images/DSC02232.jpg",
    "https://auth.hyperwear.io/storage/v1/object/public/hyperwear-images/DSC02234.jpg",
    "https://auth.hyperwear.io/storage/v1/object/public/hyperwear-images/DSC02235.jpg",
  ];
  
  const finalImages = images.length > 0 ? images : fallbackImages;
  
  return <>{children(finalImages)}</>;
}