import { createClient } from './client';

export const supabaseStorage = {
  /**
   * Upload a file to Supabase storage
   */
  async uploadFile(bucketName: string, filePath: string, file: File) {
    const supabase = createClient();
    
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    return data;
  },

  /**
   * Get public URL for a file
   */
  getPublicUrl(bucketName: string, filePath: string) {
    const supabase = createClient();
    
    const { data } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    return data.publicUrl;
  },

  /**
   * Delete a file from storage
   */
  async deleteFile(bucketName: string, filePath: string) {
    const supabase = createClient();
    
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);

    if (error) {
      throw new Error(`Delete failed: ${error.message}`);
    }
  }
};

// Pre-configured URLs for your media
export const MEDIA_URLS = {
  VIDEO_HOMEPAGE: "/hyperwear-hero-video.mp4" // Fallback to local video file
} as const; 