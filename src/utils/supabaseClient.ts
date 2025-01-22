import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const uploadImage = async (file: File) => {
    const filePath = `images/${file.name}`;

    const { data, error } = await supabase.storage
        .from('tamara') 
        .upload(filePath, file);

    if (error) {
        console.error('Error uploading file:', error.message);
        return null;
    }

    console.log('File uploaded successfully:', data);
    return data?.path;
};

export const getImages = async () => {
    const { data, error } = await supabase.storage
      .from('tamara') 
      .list('images', { limit: 10, offset: 0 });
    if (error) {
      console.error('Error fetching images:', error.message);
      return [];
    }
  
    return data;
};



export const supabase = createClient(supabaseUrl, supabaseAnonKey);


