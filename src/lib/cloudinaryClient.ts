/**
 * Cloudinary client configuration and utilities
 * 
 * Setup:
 * 1. Create a Cloudinary account at https://cloudinary.com
 * 2. Get your Cloud Name from the dashboard
 * 3. Create an Upload Preset (Settings > Upload > Add upload preset)
 * 4. Add to .env:
 *    VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
 *    VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
 */

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
  console.warn('⚠️  Cloudinary credentials not configured. Image uploads will not work.');
  console.warn('Add these to your .env file:');
  console.warn('VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name');
  console.warn('VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset');
}

/**
 * Uploads a file to Cloudinary
 * @param file - The file to upload
 * @param folder - Optional folder path in Cloudinary (e.g., 'products')
 * @returns Promise<string> - The secure URL of the uploaded image
 */
export const uploadToCloudinary = async (
  file: File,
  folder: string = 'cworth-energy/products'
): Promise<string> => {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
    throw new Error('Cloudinary credentials not configured');
  }

  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', folder);
    formData.append('resource_type', 'auto');

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const data = await response.json() as any;
    return data.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

/**
 * Generates a Cloudinary image URL with transformations
 * @param publicId - The public ID of the image in Cloudinary
 * @param options - Optional transformation options
 * @returns Transformed image URL
 */
export const getCloudinaryUrl = (
  publicId: string,
  options?: {
    width?: number;
    height?: number;
    crop?: 'fill' | 'fit' | 'scale' | 'crop';
    quality?: 'auto' | number;
  }
): string => {
  if (!CLOUDINARY_CLOUD_NAME) {
    throw new Error('Cloudinary cloud name not configured');
  }

  const parts: string[] = ['f_auto', 'q_auto'];
  if (options?.width) parts.push(`w_${options.width}`);
  if (options?.height) parts.push(`h_${options.height}`);
  if (options?.crop) parts.push(`c_${options.crop}`);
  if (typeof options?.quality === 'number') parts.push(`q_${options.quality}`);

  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${parts.join(',')}/${publicId}`;
};

/**
 * Optimizes a full Cloudinary secure_url by injecting transformation params.
 * Pass-through for non-Cloudinary URLs (local assets, placeholders).
 */
export const optimizeCloudinaryUrl = (
  url: string,
  options: { width: number; height: number; crop?: 'fill' | 'fit' | 'scale' | 'crop' }
): string => {
  if (!url || !url.includes('res.cloudinary.com')) return url;

  const parts = [`f_auto`, `q_auto`, `w_${options.width}`, `h_${options.height}`, `c_${options.crop ?? 'fill'}`];
  // Insert transformations after /upload/
  return url.replace('/image/upload/', `/image/upload/${parts.join(',')}/`);
};

/**
 * Deletes an image from Cloudinary (requires API key and secret)
 * @param publicId - The public ID of the image to delete
 * @returns Promise<boolean> - True if deletion was successful
 */
export const deleteFromCloudinary = async (publicId: string): Promise<boolean> => {
  // Note: This requires a backend endpoint with API credentials
  // Do not expose api_secret in frontend code
  console.warn('Delete from Cloudinary should be done from backend');
  return false;
};
