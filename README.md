# Pixel Store

Tienda digital de videojuegos con diseño responsivo, catálogo dinámico y carrito de compras.

## Estructura

```text
index.html
assets/
├── css/styles.css
├── data/productos.json
└── img/
src/
├── main.jsx
├── App.jsx
└── components/
    ├── Producto.jsx
    └── Carrito.jsx
```

## Funcionalidades

- Diseño responsivo con Bootstrap 5.
- Navbar adaptable y carrusel de imágenes.
- Catálogo cargado desde un archivo JSON local mediante `useEffect` y Fetch API.
- Gestión del catálogo, carrito, búsqueda y filtros mediante `useState`.
- Búsqueda de productos mediante formulario.
- Carrito dinámico con cantidades, total y eliminación de productos.
- Estados de carga, error y reintento, búsqueda sin resultados y carrito vacío.
- Botones que cambian al agregar productos al carrito.
- Componentes funcionales reutilizables y comentarios breves.

## Ejecución

Requiere Node.js 20.19 o superior, o 22.12 o superior.

```sh
npm ci
npm run dev
```

Abre la dirección indicada por la terminal. El catálogo requiere un servidor; abrir el HTML directamente no ejecuta la aplicación.

El carrito se reinicia al recargar la página. La opción de finalizar compra permanece deshabilitada porque no se procesan pagos.

## Compilación y publicación

```sh
npm run build
npm run preview
```

La carpeta `dist` contiene el sitio compilado, con rutas relativas compatibles con un subdirectorio.

```sh
npm run deploy
```

Este comando reemplaza el sitio de la rama remota `gh-pages` con el contenido de `dist`. Revisa la versión antes de publicarla. Mantén el código fuente en una rama distinta de `gh-pages` y selecciona esa rama de publicación con la carpeta raíz en la configuración de Pages.

Código publicado: https://github.com/JotaXIII/Frontend-1/tree/exp3-s8

Sitio publicado: https://jotaxiii.github.io/Frontend-1/

La versión React y sus tres pruebas funcionales se verificaron en el sitio público.

## Evidencias

El informe actualizado está en [Juan_Osega_PFY2201_Evidencias_Semana8.pdf](Juan_Osega_PFY2201_Evidencias_Semana8.pdf). Su versión editable está en [Juan_Osega_PFY2201_Evidencias_Semana8.md](Juan_Osega_PFY2201_Evidencias_Semana8.md).

Incluye las tres capturas aportadas: catálogo con carrito, carrito vacío y sitio publicado con su URL visible. Las dos primeras muestran la ejecución local y la tercera acredita el acceso al sitio en GitHub Pages. El informe de Semana 6 se conserva como antecedente.

Para regenerar el PDF después de actualizar el contenido o las capturas:

```sh
python -m pip install reportlab
python scripts/generar_evidencias.py
```

Entrega el PDF, el enlace del repositorio y el enlace confirmado del sitio. Las capturas complementan la revisión del código y del despliegue; no sustituyen una publicación funcional.

## Verificación

```sh
npx playwright install chromium
npm test
```

Las pruebas revisan el catálogo, cantidades y total del carrito, filtros, recuperación de errores y navegación móvil. Las capturas se guardan en `capturas/`.
