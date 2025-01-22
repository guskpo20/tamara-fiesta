import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL or Key is missing in environment variables');
}

export const uploadImage = async (file: File) => {
  // Renombrar el archivo añadiendo un timestamp o un UUID para que sea único
  const uniqueFileName = `${Date.now()}-${file.name}`;  // Usa el timestamp como prefijo
  
  const filePath = `images/${uniqueFileName}`;

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

export const getImages = async (page: number, pageSize: number) => {
  const offset = (page - 1) * pageSize;

  // Listar imágenes con paginación
  const { data, error } = await supabase.storage
    .from('tamara')
    .list('images', { limit: pageSize, offset: offset });

  if (error) {
    console.error('Error fetching images:', error.message);
    return { images: [], totalPages: 0 };
  }

  // Obtener el total de imágenes (sin paginación para obtener el total completo)
  const { data: allImages, error: allImagesError } = await supabase.storage
    .from('tamara')
    .list('images', { limit: 10000 }); // Obtén un número alto de archivos (ajusta según sea necesario)

  if (allImagesError) {
    console.error('Error fetching all images:', allImagesError.message);
    return { images: [], totalPages: 0 };
  }

  const totalCount = allImages.length;
  const totalPages = totalCount ? Math.ceil(totalCount / pageSize) : 0;

  // Ordenar las imágenes por fecha si es necesario
  const sortedImages = data.sort((a, b) => {
    const dateA = new Date(a.created_at || 0);
    const dateB = new Date(b.created_at || 0);
    return dateB.getTime() - dateA.getTime(); // Orden descendente
  });

  return { images: sortedImages, totalPages };
};



export const supabase = createClient(supabaseUrl, supabaseAnonKey);


