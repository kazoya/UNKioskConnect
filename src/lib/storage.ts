import { supabase } from './supabase';

/**
 * Upload an image file to Supabase Storage
 * @param file - File to upload
 * @param path - Storage path (e.g., 'events/image.jpg')
 * @param bucket - Storage bucket name (default: 'events')
 * @returns Promise with the download URL
 */
export async function uploadImage(
  file: File,
  path: string,
  bucket: string = 'events'
): Promise<string> {
  // Upload file to Supabase Storage
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      contentType: file.type,
      cacheControl: '3600',
      upsert: false, // Don't overwrite existing files
    });

  if (error) {
    console.error('Supabase upload error:', error);
    throw new Error(error.message || 'Failed to upload image');
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);

  if (!urlData?.publicUrl) {
    throw new Error('Failed to get image URL');
  }

  return urlData.publicUrl;
}

/**
 * Generate a unique file path for event images
 * @param eventId - Event ID (or 'new' for new events)
 * @param fileName - Original file name
 * @returns Storage path
 */
export function getEventImagePath(eventId: string, fileName: string): string {
  const timestamp = Date.now();
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  return `events/${eventId}_${timestamp}_${sanitizedFileName}`;
}

