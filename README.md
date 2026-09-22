# Pixel Store

Tienda digital de videojuegos con diseño responsivo, catálogo dinámico y carrito de compras.

## Estructura

```text
index.html
assets/
├── css/styles.css
├── data/productos.json
├── img/
└── js/app.js
```

## Funcionalidades

- Diseño responsivo con Bootstrap 5.
- Navbar adaptable y carrusel de imágenes.
- Catálogo cargado desde un archivo JSON local mediante Fetch API.
- Búsqueda de productos mediante formulario.
- Carrito dinámico con cantidades, total y eliminación de productos.
- Mensaje visible cuando la carga del catálogo falla.
- Código JavaScript organizado en funciones reutilizables.

## Ejecución

Para que Fetch API pueda leer el archivo JSON local, abre el proyecto mediante un servidor local y visita `index.html`.

El proyecto está preparado para publicarse en GitHub Pages desde la rama `gh-pages`.
