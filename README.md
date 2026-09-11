# Bomberos Voluntarios de Pavón Arriba

Sitio institucional hecho con **React + Vite**, mismo formato de proyecto que los otros sitios: CSS separado por componente y un archivo central de contenido (`src/data.js`) para que se pueda actualizar la web sin tocar el diseño.

## Stack

- React + Vite
- framer-motion (animaciones, carrusel, lightbox)
- lucide-react (íconos)
- CSS plano organizado por componente
- Modo claro / oscuro (sin selector de idioma — este sitio es solo en español)

## Cómo correrlo

```bash
npm install
npm run dev
```

Abrí `http://localhost:5173`.

Build de producción:

```bash
npm run build
npm run preview
```

## Todo el contenido vive en `src/data.js`

Este es el único archivo que necesitás tocar para mantener la web actualizada. Está dividido en bloques, cada uno con instrucciones en comentarios arriba. Un resumen:

### Número de guardia y contacto
`institution.guardPhoneDisplay` / `guardPhoneTel` — el número que aparece en la franja roja de arriba de todo y en la sección de contacto. `institution.email` tiene un mail de ejemplo, reemplazalo por el real.

### Redes sociales
Array `socials`. Reemplazá cada `url` por el link real. Si no usan alguna red, borrá esa línea.

### Carrusel de arriba de todo
Array `carouselImages`. Para agregar una foto:
1. Subí el archivo a `public/carousel/`
2. Agregá una línea: `{ id: 4, src: '/carousel/nombre-del-archivo.jpg', alt: 'Descripción' }`

### Galería de fotos (más abajo en la página)
Mismo mecanismo que el carrusel, pero con la carpeta `public/gallery/` y el array `galleryPhotos`. Al hacer click en una foto se abre más grande.

### Historia
Array `historyParagraphs` — cada elemento es un párrafo. Reemplazá el texto de ejemplo por la historia real cuando la tengas.

### Cuerpo Activo
Array `activeCorps`. Cada persona es un objeto:
```js
{ id: 5, firstName: 'Nombre', lastName: 'Apellido', rank: 'Bombero' }
```

### Comisión Directiva
Array `board`, mismo formato pero con `role` en vez de `rank`:
```js
{ id: 4, firstName: 'Nombre', lastName: 'Apellido', role: 'Vocal' }
```

### Noticias
Array `news`. Se ordenan solas de la más nueva a la más vieja según el campo `date` (formato `AAAA-MM-DD`):
```js
{
  id: 2,
  date: '2026-09-15',
  title: 'Título de la noticia',
  body: 'Texto de la noticia.',
  image: '/news/nombre-del-archivo.jpg', // opcional, dejar '' si no hay foto
}
```
Si agregás una imagen, subila a `public/news/`.

### En Memoria (Tognolo)
Objeto `memorial`. Completá `years` cuando tengas las fechas, y reemplazá `public/memoria/placeholder.svg` por la foto real (mismo nombre de archivo o actualizá el campo `photo`).

### Ubicación
Objeto `location`, ya cargado con las coordenadas del link de Google Maps que pasaste. Si en algún momento cambia la dirección del cuartel, actualizá `lat`, `lng` y `mapsUrl`.

## Estructura

```
src/
├── App.jsx
├── data.js                  # Todo el contenido editable
├── context/ThemeContext.jsx # Modo claro / oscuro (persistido en localStorage)
├── styles/index.css         # Paleta institucional (rojo / azul noche) + variables dark
└── components/
    ├── GuardBar.jsx / .css      # Franja roja fija con el número de guardia
    ├── Header.jsx / .css        # Nav + menú hamburguesa en mobile
    ├── Carousel.jsx / .css      # Carrusel de fotos al inicio
    ├── History.jsx / .css
    ├── ActiveCorps.jsx / .css
    ├── Board.jsx / .css
    ├── News.jsx / .css
    ├── Gallery.jsx / .css       # Galería con lightbox
    ├── Memorial.jsx / .css      # En memoria de Tognolo
    ├── LocationMap.jsx / .css   # Google Maps embebido
    ├── Contact.jsx / .css
    └── Footer.jsx / .css
```
