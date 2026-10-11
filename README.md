# Pixel Store

Tienda de videojuegos con catálogo dinámico, filtros, carrito, gestión del catálogo y formulario de contacto. Utiliza React, JavaScript, HTML5, CSS3 y Bootstrap 5 sobre Vite.

## Instalación

Requiere Node.js 20.19 o superior en la serie 20, o 22.12 o superior.

```sh
npm ci
npm run dev
```

Abre la URL que muestra la terminal. El sitio requiere un servidor; abrir el HTML directamente no ejecuta la aplicación.

## Uso

- Inicio muestra la portada y el carrusel de destacados.
- Productos carga videojuegos desde `assets/data/productos.json`. Las tarjetas incluyen imagen, nombre, categoría, descripción y precio en CLP.
- Los filtros se combinan con la búsqueda por nombre, categoría o descripción. Pulsa Buscar para aplicar el texto y bórralo para retirarlo.
- Agregar incorpora un videojuego al carrito. Repetir la acción aumenta su cantidad. El panel permite eliminar productos y vaciar el carrito.
- Catálogo permite añadir videojuegos con nombre, categoría, precio entero positivo, descripción y portada local. Eliminar requiere confirmación y retira el videojuego también del carrito.
- Contacto valida nombre, email y mensaje, muestra errores junto a cada campo y enfoca el primero incorrecto.

El catálogo y el carrito se reinician al recargar. El envío del formulario es simulado: no se transmite información ni se envían correos. Finalizar compra permanece deshabilitado; no se procesan pagos. La gestión del catálogo es local y no incluye autenticación.

## Estructura

```text
index.html
assets/
  css/styles.css
  data/productos.json
  img/
src/
  main.jsx
  App.jsx
  components/
    Navbar.jsx
    Inicio.jsx
    ListaVideojuegos.jsx
    Producto.jsx
    Carrito.jsx
    GestionCatalogo.jsx
    FormularioContacto.jsx
    CampoFormulario.jsx
tests/
  tienda.spec.js
  formularios.spec.js
scripts/
  empaquetar.ps1
```

`App` centraliza el estado del catálogo, categorías y carrito, y distribuye datos y callbacks mediante props. `ListaVideojuegos` mantiene la búsqueda y genera tarjetas con `filter` y `map`. Los formularios mantienen valores, errores y confirmaciones con `useState`. `useEffect` carga el JSON mediante Fetch API y cancela solicitudes pendientes al desmontar. React actualiza el DOM al cambiar el estado; los formularios enfocan el primer campo inválido.

Bootstrap aporta navegación colapsable, carrusel, tarjetas, formularios, alertas y panel lateral. Su cuadrícula y Flexbox organizan el sitio; el CSS propio ajusta colores, foco, imágenes y pantallas estrechas.

Para incorporar portadas, agrega archivos a `assets/img/`. Modifica el catálogo inicial en el JSON: cada objeto necesita `id` numérico único, `nombre`, `categoria`, `precio` positivo, `descripcion` e `imagen` con una ruta de portada existente.

## Compilación

```sh
npm run build
npm run preview
```

`dist` contiene el sitio compilado. Las rutas relativas permiten alojarlo en un subdirectorio.

## Pruebas

```sh
npx playwright install chromium
npm test
```

La configuración incluye siete escenarios para Chromium, Google Chrome y Microsoft Edge: carrito y totales, filtros y navegación móvil, error de carga y reintento, contacto inválido y válido, altas y bajas del catálogo, formularios a 320 px y recuperación de un catálogo inválido. Las pruebas compilan y sirven el sitio automáticamente.

Para ejecutar un solo navegador:

```sh
npm test -- --project=chromium
```

Las capturas de cada escenario y navegador se guardan en `test-results/`. Chrome y Edge deben estar instalados para ejecutar la suite completa.

## Repositorio y publicación

Repositorio: https://github.com/JotaXIII/Frontend-1

Rama de desarrollo: `eft-s9`.

```sh
npm run deploy
```

Este comando compila y publica `dist` en la rama remota `gh-pages`, reemplazando su contenido. GitHub Pages debe apuntar a esa rama y su carpeta raíz. La publicación es independiente del envío del código fuente.

## Paquete y presentación

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/empaquetar.ps1
```

Genera `JuanCarlos_Osega_PFY2201_EFT_FRONT_END_I.zip` en la carpeta superior, con una carpeta interna del mismo nombre. Incluye código, recursos, configuración, dependencias declaradas, pruebas y documentación; excluye `.git`, `node_modules`, compilaciones y resultados temporales.

La guía de presentación está en [PRESENTACION.md](PRESENTACION.md). El video individual debe grabarse y exportarse en MP4.

## Resultado de verificación

Los siete escenarios pasan en Chromium, Google Chrome y Microsoft Edge: 21 pruebas en total, con vistas de escritorio y pantallas de 390 y 320 px. Firefox y WebKit están disponibles mediante PLAYWRIGHT_ALL_ENGINES=1, pero sus ejecutables no pudieron iniciar en este entorno; su compatibilidad queda pendiente de verificación.
