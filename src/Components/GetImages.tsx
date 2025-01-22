'use client';

import { useEffect, useState } from 'react';
import getAllImages from "./getImages";

export default function GetImages() {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const result = await getAllImages()
        console.log(result);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, []);

  return (
    <div>
      <h1>Galería de imágenes</h1>
      <div>
        {images.map((url, index) => (
          <img key={index} src={url} alt={``} />
        ))}
      </div>
    </div>
  );
}