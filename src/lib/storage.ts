import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FirebaseStorage } from 'firebase/storage';

/**
 * Upload an image file to Firebase Storage
 * @param storage - Firebase Storage instance
 * @param file - File to upload
 * @param path - Storage path (e.g., 'events/image.jpg')
 * @returns Promise with the download URL
 */
export async function uploadImage(
  storage: FirebaseStorage,
  file: File,
  path: string
): Promise<string> {
  const storageRef = ref(storage, path);
  
  // Upload file
  await uploadBytes(storageRef, file);
  
  // Get download URL
  const downloadURL = await getDownloadURL(storageRef);
  
  return downloadURL;
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

