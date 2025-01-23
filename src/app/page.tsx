"use client"
import Image from "next/image";
import Tamara from "/public/tamara.png";
import TamaraMobile from "/public/tamaraMobile.jpeg";
import FlowerBackgroundOne from "/public/background_flower.png"
import FlowerBackgroundTwo from "/public/background_flower_2.png"
import Casa from "/public/casa.jpeg";
import { useEffect, useRef, useState } from "react";
import { uploadImage, getImages } from '../utils/supabaseClient'; 
import Swal from 'sweetalert2'

export default function Home() {
  const Toast = Swal.mixin({
    toast: true,
    position: 'bottom-end',
    iconColor: 'white',
    customClass: {
      popup: 'colored-toast',
    },
    showConfirmButton: false,
    timer: 1000,
    timerProgressBar: true,
  })


  const [targetDate] = useState("2025-02-15T20:00:00Z");

  const calculateTimeLeft = () => {
    const difference = new Date(targetDate).getTime() - new Date().getTime();

    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);


  const [activeSection, setActiveSection] = useState<string>("inicio");
  const sections = ["inicio", "fecha", "asistencia", "fotos"];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;

      // Recorremos las secciones para determinar cuál está en la vista
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop - 100; // Ajusta el valor según tu navbar
          const offsetBottom = offsetTop + element.offsetHeight;

          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveSection(section);
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);


  const handleScrollTo = (event: React.MouseEvent, targetId: string) => {
    event.preventDefault(); // Prevenir el comportamiento predeterminado del link
    const targetElement = document.getElementById(targetId);
    setIsMenuOpen(false);
    if (targetElement) {
      const screenWidth = window.innerWidth;
      const offset = screenWidth < 970 ? 350 : 100;
      window.scrollTo({
        top: targetElement.offsetTop - offset, 
        behavior: "smooth",
      });
    }
  };


  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imagesToUpload, setImagesToUpload] = useState<File[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setImagesToUpload(Array.from(files));  // Convierte FileList a un array
    }
  };

  const handleUpload = async () => {
    if (imagesToUpload.length > 0) {
      Toast.fire({
        icon: "info",
        title: "¡Subiendo imagenes!",
      });
      const uploadPromises = imagesToUpload.map(async (image) => {
        return await uploadImage(image);
      });
  
      const results = await Promise.all(uploadPromises);

      const failedUploads = results.filter((path) => path === null);

      if (failedUploads.length > 0) {
        Toast.fire({
          icon: "error",
          title: `No se pudieron subir ${failedUploads.length} imágenes. Intenta nuevamente.`,
        });
      } else {
        Toast.fire({
          icon: "success",
          title: "Todas las imágenes fueron subidas exitosamente.",
        });

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        fetchImages();
      }
    return;
    };
    Toast.fire({
      icon: "error",
      title: "Selecciona imagenes antes de subir",
    });
  }

  const [images, setImages] = useState<unknown[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1); 
  const [totalPages, setTotalPages] = useState<number>(0); 
  const [pageSize] = useState<number>(20); 

  const fetchImages = async () => {
    const { images, totalPages } = await getImages(currentPage, pageSize); 
    setImages(images);
    setTotalPages(totalPages);
  };

  useEffect(() => {
    fetchImages();
  }, [currentPage]); 

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage); 
    }
  };


  return (
    <div className="mainDiv">
      <header className={`navbar ${isMenuOpen ? "activeNav" : ""}`}>
        <div>
          <div className={activeSection === "inicio" ? "active" : ""}>
            <a onClick={(e) => handleScrollTo(e, "inicio")}>Inicio</a>
          </div>
          <div className={activeSection === "fecha" ? "active" : ""}>
            <a  onClick={(e) => handleScrollTo(e, "fecha")}>Fecha</a>
          </div>
          <div className={activeSection === "asistencia" ? "active" : ""}>
            <a onClick={(e) => handleScrollTo(e, "asistencia")}>Confirmar Asistencia</a>
          </div>
          <div className={activeSection === "fotos" ? "active" : ""}>
            <a onClick={(e) => handleScrollTo(e, "fotos")}>Subi tus Fotos</a>
          </div>
        </div>
        <span className="menu-toggle onlyMobile" onClick={toggleMenu}>
          {isMenuOpen ? "X" : "☰"} {/* Cambiar entre X y hamburguesa */}
        </span>
      </header>
      <div className="yellowBackground">
        <section id="inicio" className="sectionOne sectionPadding section">
          <div className="onlyMobile responsiveImg">
            <p className="onlyMobile">¡Llegó mi graduación!</p>
            <Image src={TamaraMobile} alt="imagen de tamara" width={685} height={685}/>
          </div>
          <div className="textColumn">
            <p className="onlyDesktop">¡Llegó mi graduación!</p>
            <h2>Dra Shirley Rodriguez</h2>
            <p>16/12/2024</p>
            <p className="differentFont">Después de 5 años de <b>estudio, café ☕, lagrimas 😭 y de &quot;este es mi último examen&quot; ✍️</b>, llegó el momento de celebrar. 
            Prepárate para un juicio sin apelación: <b>bailar, reír, brindar y disfrutar</b>. Ven con tus mejores argumentos para celebrar este logro, <b>porque la ley de la noche será pasarla increíble</b>.</p>
          </div>
          <div className="imageColumn onlyDesktop">
            <Image src={Tamara} alt="imagen de tamara" width={522} height={685}/>
          </div>
        </section>
        <Image className="backgroundFlowerOne" src={FlowerBackgroundOne} alt="" width={550} height={356}/>
        <Image className="backgroundFlowerTwo" src={FlowerBackgroundTwo} alt="" width={350} height={535}/>
      </div>
      <div className="whiteBackground">
        <section id="fecha" className="sectionTwo sectionPadding section">
          <p>Faltan <b>{timeLeft.days}</b> dias,  <b>{timeLeft.hours}</b> horas, <b>{timeLeft.minutes}</b> minutos, <b>{timeLeft.seconds}</b> segundos.</p>
          <h3>Sabado <u>15 de febrero</u> a partir de las <u>20:00</u> horas.</h3>
          <p>
            <b>Codigo de vestimenta:</b> Vení como quieras, pero recuerda: <b>¡la actitud es obligatoria y hay piscina!</b> 😎<br />
            <b>Recordatorio:</b> Si vas a tomar alcohol, traelo que la comida ya esta pronta.  
          </p>
          <h3>Ubicacion <span className="onlyDesktop">📌</span></h3>
          <p className="button"><a href="https://www.google.com/maps?q=-30.9849948883057,-55.5038642883301" target="_blank">Apreta aca para la ubicacion!</a></p>
          <div className="location">
            <iframe src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3420.4798402287024!2d-55.506439224409654!3d-30.984994874463684!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMzDCsDU5JzA2LjAiUyA1NcKwMzAnMTMuOSJX!5e0!3m2!1ses!2suy!4v1737563930433!5m2!1ses!2suy" width="600" height="450" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
            <Image src={Casa} alt="imagen de la casa" width={600} height={450}/>
          </div>
        </section>
        <Image className="backgroundFlowerFour" src={FlowerBackgroundTwo} alt="" width={350} height={535}/>
      </div>
      <div className="yellowBackground">
        <section id="asistencia" className="sectionThree sectionPadding section">
          <h3>Confirmar asistencia</h3>
          <p>Confirma tu asistencia antes del 01/02 porque ya me gradué de &quot;procrastinación&quot;. 🥳</p>
          <div>
            <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSfK9J_G2XbA4BOnWgGONQh4K_RJv0JQtukQ4DHvl1YmnkHgcw/viewform?embedded=true" width="650" height="1300">Cargando…</iframe>
          </div>
        </section>
        
      </div>
      <div className="whiteBackground">
        <section id="fotos" className="sectionFour sectionPadding section">
          <h3>Subí las fotos que saques en la fiesta, asi las guardo 😊</h3>
          <div className="inputAndButton">
            <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple />
            <p>Una vez seleccionadas las imagenes, dale click al siguiente boton!</p>
            <button onClick={handleUpload}>Subir fotos</button>
          </div>
          <div className="gallery">
          {images.length > 0 ? (
            images.map((image, index) => (
              <div key={index}>
                <img
                  src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/tamara/images/${(image as { name: string }).name}`}
                  alt={`Imagen ${index + 1}`}
                  width="300"
                  height="300"
                />
              </div>
            ))
          ) : (
            <p>Aun no hay imagenes!</p>
          )}
          </div>
          <div className="pagination">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
              Anterior
            </button>
            <span>Página {currentPage}</span>
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
              Siguiente
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
