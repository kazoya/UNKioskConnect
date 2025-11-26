/**
 * Upload an image file to Supabase Storage via API route
 * This uses a server-side API route to handle authentication properly
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
    // Use API route for server-side upload (bypasses auth issues)
    const formData = new FormData();
    formData.append('file', file);
    formData.append('path', path);
    formData.append('bucket', bucket);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Upload failed' }));
      throw new Error(errorData.error || `Upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.url) {
      throw new Error('Failed to get image URL from server');
    }

    return data.url;
  } catch (error: any) {
    console.error('Storage upload error:', error);
    
    // Provide user-friendly error messages
    if (error.message.includes('Bucket not found')) {
      throw new Error('Storage bucket not found. Please create the "events" bucket in Supabase.');
    } else if (error.message.includes('Permission denied') || error.message.includes('row-level security')) {
      throw new Error('Permission denied. Please check storage policies in Supabase.');
    } else if (error.message.includes('already exists')) {
      throw new Error('File already exists. Please try again.');
    }
    
    throw error;
  }
}

/**
 * Generate a unique file path for event images
 * @param eventId - Event ID (or 'new' for new events)
 * @param fileName - Original file name
 * @returns Storage path (without bucket prefix, since bucket is specified separately)
 */
export function getEventImagePath(eventId: string, fileName: string): string {
  const timestamp = Date.now();
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  // Don't include 'events/' prefix since we're uploading to 'events' bucket
  return `${eventId}_${timestamp}_${sanitizedFileName}`;
}

