import { createClient } from '@/types/utils/supabase/server';
import { SUPABASE_PROJECT_URL } from '@/lib/supabase/config';

interface GalleryImagesFetcherProps {
  children: (images: string[]) => React.ReactNode;
}

const STORAGE_BASE = `${SUPABASE_PROJECT_URL}/storage/v1/object/public/hyperwear-images`;

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

    const imageUrls = files
      .filter(file => {
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

  const fallbackImages = [
    `${STORAGE_BASE}/DSC02198.jpg`,
    `${STORAGE_BASE}/DSC02218.jpg`,
    `${STORAGE_BASE}/DSC02232.jpg`,
    `${STORAGE_BASE}/DSC02234.jpg`,
    `${STORAGE_BASE}/DSC02235.jpg`,
  ];

  const finalImages = images.length > 0 ? images : fallbackImages;

  return <>{children(finalImages)}</>;
}