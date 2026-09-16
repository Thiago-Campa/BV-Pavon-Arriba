// ============================================================
// DATOS DE LA INSTITUCIÓN — este es el archivo que vas a editar
// para mantener la web al día. Cada sección de abajo indica
// cómo agregar o cambiar contenido.
// ============================================================

export const institution = {
  name: 'Bomberos Voluntarios de Pavón Arriba',
  town: 'Pavón Arriba, Santa Fe, Argentina',
  // Logo: se usa arriba de todo en el header y como ícono de la pestaña del navegador.
  logo: '/gallery/Logo cuartel.jpg',
  // Número de guardia: se muestra siempre arriba de todo, en toda la web.
  guardPhoneDisplay: '3469 69-1535',
  guardPhoneTel: '+543469691535',
  email: 'contacto@bomberospavonarriba.org.ar', // TODO: reemplazar por el mail real
}

// Redes sociales — reemplazá cada "url" por el link real cuando lo tengas.
// Si alguna red no la usan, simplemente borrá esa línea del array.
export const socials = [
  { key: 'facebook', label: 'Facebook', url: 'https://www.facebook.com/profile.php?id=100067850570501', icon: 'Facebook' },
  { key: 'instagram', label: 'Instagram', url: 'https://www.instagram.com/bomberos.pavon.arriba/', icon: 'Instagram' },
  { key: 'whatsapp', label: 'WhatsApp', url: 'https://wa.me/5493469691535', icon: 'MessageCircle' },
]

// ------------------------------------------------------------
// CARRUSEL (arriba de todo, apenas se abre la página)
// ------------------------------------------------------------
export const carouselImages = [
  { id: 1, src: '/gallery/frente cuartel.png', alt: 'Frente del cuartel de Bomberos Voluntarios de Pavón Arriba' },
  { id: 2, src: '/gallery/cuerpo activo acto.png', alt: 'Cuerpo activo en un acto institucional' },
  { id: 3, src: '/gallery/cuerpo activo 2.webp', alt: 'Cuerpo activo junto a la unidad forestal' },
]

// ------------------------------------------------------------
// GALERÍA DE FOTOS (más abajo en la página, con más fotos)
// ------------------------------------------------------------
export const galleryPhotos = [
  { id: 1, src: '/gallery/galeria 1.png', caption: '' },
  { id: 2, src: '/gallery/galeria 2.png', caption: '' },
  { id: 3, src: '/gallery/galeria 3.png', caption: '' },
  { id: 4, src: '/gallery/galeria 4.png', caption: '' },
  { id: 5, src: '/gallery/galeria 5.png', caption: '' },
  { id: 6, src: '/gallery/galeria 6.png', caption: '' },
  { id: 7, src: '/gallery/galeria 7.png', caption: '' },
  { id: 8, src: '/gallery/galeria 8.png', caption: '' },
  { id: 9, src: '/gallery/galeria 9.png', caption: '' },
  { id: 10, src: '/gallery/galeria 10.png', caption: '' },
  { id: 11, src: '/gallery/galeria 11.png', caption: '' },
  { id: 12, src: '/gallery/galeria 12.png', caption: '' },
]

// ------------------------------------------------------------
// HISTORIA — cada elemento del array es un párrafo.
// ------------------------------------------------------------
export const historyParagraphs = [
  'Acá va la historia de los Bomberos Voluntarios de Pavón Arriba: cuándo y por qué se fundó el cuartel, quiénes fueron sus primeros integrantes, y los hitos más importantes del camino recorrido.',
  'Podés escribir varios párrafos — cada uno va a aparecer como un bloque de texto separado. Cuando tengas el contenido definitivo, reemplazá estos textos de ejemplo en el archivo src/data.js.',
]

// ------------------------------------------------------------
// CUERPO ACTIVO
// ------------------------------------------------------------
export const activeCorps = [
  { id: 1, firstName: 'Maximiliano', lastName: 'Ruzzo', rank: 'Jefe' },
  { id: 2, firstName: 'Raúl', lastName: 'Campagnaro', rank: 'Sub Jefe' },
  // Sub Oficiales
  { id: 3, firstName: 'Andrés', lastName: 'Taborda', rank: 'Sub Oficial' },
  { id: 4, firstName: 'Romina', lastName: 'Ringellmann', rank: 'Sub Oficial' },
  { id: 5, firstName: 'Brian', lastName: 'Godoy', rank: 'Sub Oficial' },
  { id: 6, firstName: 'Ramiro', lastName: 'Gonzalez', rank: 'Sub Oficial' },
  // Bomberos
  { id: 7, firstName: 'Andrés', lastName: 'Soressi', rank: 'Bombero' },
  { id: 8, firstName: 'Victoria', lastName: 'Mariani', rank: 'Bombero' },
  { id: 9, firstName: 'Eduardo', lastName: 'Ramírez', rank: 'Bombero' },
  { id: 10, firstName: 'Thiago', lastName: 'Campagnaro', rank: 'Bombero' },
  { id: 11, firstName: 'Víctor', lastName: 'Monzón', rank: 'Bombero' },
  { id: 12, firstName: 'Danilo', lastName: 'Colmegna', rank: 'Bombero' },
  { id: 13, firstName: 'Katia', lastName: 'Pereira', rank: 'Bombero' },
  { id: 14, firstName: 'Nicolás', lastName: 'Pérez', rank: 'Bombero' },
  { id: 15, firstName: 'Pablo', lastName: 'De Bonis', rank: 'Bombero' },
  { id: 16, firstName: 'Cindi', lastName: 'Rinaldo', rank: 'Bombero' },
  { id: 17, firstName: 'Estefanía', lastName: 'Vallejos', rank: 'Bombero' },
  { id: 18, firstName: 'Leonardo', lastName: 'Aguirre', rank: 'Bombero' },
  { id: 19, firstName: 'Adrián', lastName: 'Gonzalez', rank: 'Bombero' },
  { id: 20, firstName: 'Esteban', lastName: 'Rovera', rank: 'Bombero' },
]

// ------------------------------------------------------------
// COMISIÓN DIRECTIVA
// ------------------------------------------------------------
export const board = [
  { id: 1, firstName: 'Juan Pablo', lastName: 'Caniggiani', role: 'Presidente' },
  { id: 2, firstName: 'Aníbal', lastName: 'Morton', role: 'Vicepresidente' },
  { id: 3, firstName: 'Nombre', lastName: 'Apellido', role: 'Secretario/a' },
  { id: 4, firstName: 'Nombre', lastName: 'Apellido', role: 'Tesorero/a' },
]

// ------------------------------------------------------------
// NOTICIAS
// ------------------------------------------------------------
export const news = [
  {
    id: 1,
    date: '2026-09-12',
    title: 'Ultima salida',
    body: 'Socorrimos a dotacion correspondiente al cuartel de la localidad de Maximo Paz, por causa de un incedio forestal.',
    image: '',
  },
]

// ------------------------------------------------------------
// EN MEMORIA — homenaje a Tognolo.
// ------------------------------------------------------------
export const memorial = {
  name: 'Morocha',
  role: 'Ex jefe y compañero de la institución',
  years: '', // ej: "1958 – 2021" — completar cuando se tenga la fecha exacta
  photo: '/gallery/morocha.png',
  tribute:
    'En memoria de nuestro compañero y ex jefe, Nestor Tognolo, quien dedicó gran parte de su vida a esta institución y a la comunidad de Pavón Arriba. Su compromiso y vocación de servicio quedan como ejemplo para todo el cuerpo activo. Este espacio está dedicado a su memoria.',
}

// ------------------------------------------------------------
// UBICACIÓN
// ------------------------------------------------------------
export const location = {
  address: 'Pavón Arriba, Santa Fe, Argentina',
  lat: -33.3101716,
  lng: -60.8256457,
  mapsUrl:
    'https://www.google.com/maps/place/Bomberos/@-33.3099655,-60.8257131,20.5z/data=!4m6!3m5!1s0x95b797005eb66aad:0x6c84f43cbe81696c!8m2!3d-33.3101716!4d-60.8256457',
}