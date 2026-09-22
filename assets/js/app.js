const catalogo = document.querySelector("#catalogo");
const estadoCatalogo = document.querySelector("#estadoCatalogo");
const formularioBusqueda = document.querySelector("#formularioBusqueda");
const campoBusqueda = document.querySelector("#busqueda");
const listaCarrito = document.querySelector("#listaCarrito");
const contadorCarrito = document.querySelector("#contadorCarrito");
const totalCarrito = document.querySelector("#totalCarrito");
const botonVaciar = document.querySelector("#vaciarCarrito");
const enlacesCategoria = document.querySelectorAll(".filtro-categoria");

let productos = [];
let carrito = [];

const productosRespaldo = [
    { id: 1, nombre: "Battlefield 6", categoria: "Acci\u00f3n", descripcion: "Combate a gran escala, destrucci\u00f3n t\u00e1ctica y acci\u00f3n en equipo.", precio: 59990, imagen: "assets/img/battlefield.jpg" },
    { id: 2, nombre: "Helldivers II", categoria: "Cooperativo", descripcion: "Defiende la galaxia junto a tu escuadr\u00f3n en misiones explosivas.", precio: 39990, imagen: "assets/img/helldivers.webp" },
    { id: 3, nombre: "Returnal", categoria: "Aventura", descripcion: "Rompe el ciclo de un planeta alien\u00edgena que cambia con cada derrota.", precio: 29990, imagen: "assets/img/returnal.jpg" },
    { id: 4, nombre: "Shadow of the Colossus", categoria: "Cl\u00e1sicos", descripcion: "Enfrenta criaturas monumentales en una aventura inolvidable.", precio: 24990, imagen: "assets/img/shadow.jpg" }
];

const formatoPrecio = new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0
});

// Muestra un mensaje de estado para informar el resultado de una acción.
function mostrarEstado(mensaje, tipo = "info") {
    estadoCatalogo.textContent = mensaje;
    estadoCatalogo.className = `alert alert-${tipo}`;
}

// Obtiene los productos almacenados en el archivo JSON local.
async function cargarProductos() {
    if (window.location.protocol === "file:") {
        productos = productosRespaldo;
        renderizarProductos(productos);
        return;
    }

    try {
        const respuesta = await fetch("assets/data/productos.json");
        if (!respuesta.ok) throw new Error("No fue posible cargar los productos.");
        productos = await respuesta.json();
        renderizarProductos(productos);
    } catch (error) {
        productos = productosRespaldo;
        renderizarProductos(productos);
        mostrarEstado("No se pudo leer el catálogo principal. Se muestran productos de respaldo.", "warning");
    }
}

// Crea las tarjetas visibles a partir de una lista de productos.
function renderizarProductos(lista) {
    catalogo.replaceChildren();

    if (lista.length === 0) {
        mostrarEstado("No encontramos productos con esa búsqueda.", "warning");
        return;
    }

    estadoCatalogo.className = "alert d-none";
    const fragmento = document.createDocumentFragment();

    lista.forEach((producto) => {
        const columna = document.createElement("div");
        columna.className = "col";
        columna.innerHTML = `
            <article class="card h-100 product-card border-secondary-subtle">
                <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}" loading="lazy">
                <div class="card-body d-flex flex-column">
                    <span class="badge text-bg-info align-self-start mb-2">${producto.categoria}</span>
                    <h3 class="card-title h5">${producto.nombre}</h3>
                    <p class="card-text text-secondary flex-grow-1">${producto.descripcion}</p>
                    <div class="d-flex justify-content-between align-items-center gap-2 mt-3">
                        <strong>${formatoPrecio.format(producto.precio)}</strong>
                        <button class="btn btn-info btn-sm" type="button" data-producto-id="${producto.id}">Agregar</button>
                    </div>
                </div>
            </article>`;
        fragmento.append(columna);
    });

    catalogo.append(fragmento);
}

// Agrega un producto al carrito o aumenta su cantidad.
function agregarAlCarrito(id) {
    const producto = productos.find((item) => item.id === id);
    const item = carrito.find((elemento) => elemento.id === id);

    if (!producto) return;
    if (item) item.cantidad += 1;
    else carrito.push({ ...producto, cantidad: 1 });
    renderizarCarrito();
}

// Dibuja los productos seleccionados y calcula el total.
function renderizarCarrito() {
    listaCarrito.replaceChildren();
    const cantidadTotal = carrito.reduce((total, item) => total + item.cantidad, 0);
    const precioTotal = carrito.reduce((total, item) => total + item.precio * item.cantidad, 0);
    contadorCarrito.textContent = cantidadTotal;
    totalCarrito.textContent = formatoPrecio.format(precioTotal);

    if (carrito.length === 0) {
        const mensaje = document.createElement("p");
        mensaje.className = "text-secondary";
        mensaje.textContent = "Tu carrito está vacío.";
        listaCarrito.append(mensaje);
        return;
    }

    carrito.forEach((item) => {
        const elemento = document.createElement("div");
        elemento.className = "d-flex justify-content-between gap-3 border-bottom border-secondary pb-3";
        elemento.innerHTML = `
            <div>
                <h3 class="h6 mb-1">${item.nombre}</h3>
                <small class="text-secondary">${item.cantidad} × ${formatoPrecio.format(item.precio)}</small>
            </div>
            <button class="btn btn-sm btn-outline-light align-self-start" type="button" data-eliminar-id="${item.id}" aria-label="Eliminar ${item.nombre}">×</button>`;
        listaCarrito.append(elemento);
    });
}

// Filtra el catálogo según el texto ingresado.
function buscarProductos(evento) {
    evento.preventDefault();
    const termino = campoBusqueda.value.trim().toLowerCase();
    const resultados = productos.filter((producto) =>
        `${producto.nombre} ${producto.categoria} ${producto.descripcion}`.toLowerCase().includes(termino)
    );
    renderizarProductos(resultados);
}

// Muestra los productos pertenecientes a una categoría.
function filtrarPorCategoria(evento) {
    evento.preventDefault();
    const categoria = evento.currentTarget.dataset.categoria;
    campoBusqueda.value = "";
    enlacesCategoria.forEach((enlace) => {
        const seleccionado = enlace === evento.currentTarget;
        enlace.classList.toggle("active", seleccionado);
        enlace.setAttribute("aria-pressed", String(seleccionado));
    });
    const resultados = categoria
        ? productos.filter((producto) => producto.categoria === categoria)
        : productos;
    renderizarProductos(resultados);
    document.querySelector("#productos").scrollIntoView({ behavior: "smooth" });
}

formularioBusqueda.addEventListener("submit", buscarProductos);

enlacesCategoria.forEach((enlace) => {
    enlace.addEventListener("click", filtrarPorCategoria);
});

catalogo.addEventListener("click", (evento) => {
    const boton = evento.target.closest("[data-producto-id]");
    if (boton) agregarAlCarrito(Number(boton.dataset.productoId));
});

listaCarrito.addEventListener("click", (evento) => {
    const boton = evento.target.closest("[data-eliminar-id]");
    if (!boton) return;
    carrito = carrito.filter((item) => item.id !== Number(boton.dataset.eliminarId));
    renderizarCarrito();
});

botonVaciar.addEventListener("click", () => {
    carrito = [];
    renderizarCarrito();
});

cargarProductos();
renderizarCarrito();
