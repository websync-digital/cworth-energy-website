import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Uploads a file to Cloudinary (replacing Supabase for cost optimization)
 * @param file - The file to upload
 * @returns Promise<string> - The public URL of the uploaded file
 */
export const uploadFile = async (file: File): Promise<string> => {
    // Import here to avoid circular dependencies
    const { uploadToCloudinary } = await import('./cloudinaryClient');
    
    try {
        const url = await uploadToCloudinary(file);
        return url;
    } catch (error) {
        console.error('File upload error:', error);
        throw error;
    }
};

/**
 * [DEPRECATED] Use countImagesInCloudinary from cloudinaryClient.ts instead
 * Lists all images that exist in Cloudinary for the product folder
 */
export const countImagesInBucket = async (): Promise<number> => {
    console.warn('[DEPRECATED] countImagesInBucket - Supabase bucket is no longer used');
    console.warn('Use the Cloudinary API or dashboard to check image count');
    return 0;
};
