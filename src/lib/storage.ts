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
  try {
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
      
      // Provide more specific error messages
      if (error.message.includes('Bucket not found')) {
        throw new Error('Storage bucket not found. Please create the "events" bucket in Supabase.');
      } else if (error.message.includes('new row violates row-level security policy')) {
        throw new Error('Permission denied. Please check storage policies in Supabase.');
      } else if (error.message.includes('The resource already exists')) {
        throw new Error('File already exists. Please try again with a different name.');
      }
      
      throw new Error(error.message || 'Failed to upload image');
    }

    if (!data) {
      throw new Error('Upload failed: No data returned');
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    if (!urlData?.publicUrl) {
      throw new Error('Failed to get image URL');
    }

    return urlData.publicUrl;
  } catch (error: any) {
    console.error('Storage upload error:', error);
    throw error;
  }
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

