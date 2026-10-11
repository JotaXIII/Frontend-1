import { useEffect, useState } from 'react';
import Navbar from './components/Navbar.jsx';
import Inicio from './components/Inicio.jsx';
import ListaVideojuegos from './components/ListaVideojuegos.jsx';
import FormularioContacto from './components/FormularioContacto.jsx';
import GestionCatalogo from './components/GestionCatalogo.jsx';
import Carrito from './components/Carrito.jsx';

const imagenes = import.meta.glob('../assets/img/*', { eager: true, query: '?url', import: 'default' });
const urlCatalogo = new URL('../assets/data/productos.json', import.meta.url).href;
const categoriasBase = ['Acción', 'Cooperativo', 'Aventura', 'Clásicos'];

export default function App() {
    const [productos, setProductos] = useState([]);
    const [carrito, setCarrito] = useState([]);
    const [categoria, setCategoria] = useState('Todos');
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const [intento, setIntento] = useState(0);

    // Cancela la carga pendiente al desmontar el componente.
    useEffect(() => {
        const controlador = new AbortController();
        async function cargarProductos() {
            setCargando(true);
            setError('');
            try {
                const respuesta = await fetch(urlCatalogo, { signal: controlador.signal });
                if (!respuesta.ok) throw new Error('Carga fallida');
                const datos = await respuesta.json();
                if (!Array.isArray(datos) || datos.some(item => !Number.isFinite(item.id) || !Number.isFinite(item.precio) || typeof item.nombre !== 'string' || typeof item.categoria !== 'string' || typeof item.descripcion !== 'string' || typeof item.imagen !== 'string')) throw new Error('Datos inválidos');
                const ids = new Set(datos.map(item => item.id));
                if (ids.size !== datos.length || datos.some(item => item.precio <= 0 || !imagenes[`../${item.imagen}`])) throw new Error('Datos inválidos');
                setProductos(datos.map(item => ({ ...item, imagen: imagenes[`../${item.imagen}`] })));
            } catch (fallo) {
                if (fallo.name !== 'AbortError') setError('No fue posible cargar el catálogo. Intenta nuevamente.');
            } finally {
                if (!controlador.signal.aborted) setCargando(false);
            }
        }
        cargarProductos();
        return () => controlador.abort();
    }, [intento]);

    // Actualiza las cantidades sin modificar el estado anterior.
    function agregarProducto(producto) {
        setCarrito(actual => actual.some(item => item.id === producto.id)
            ? actual.map(item => item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item)
            : [...actual, { ...producto, cantidad: 1 }]);
    }

    function agregarVideojuego(datos) {
        setProductos(actual => [...actual, { ...datos, id: crypto.randomUUID() }]);
        setCategoria('Todos');
    }

    function eliminarVideojuego(id) {
        setProductos(actual => actual.filter(item => item.id !== id));
        setCarrito(actual => actual.filter(item => item.id !== id));
        setCategoria('Todos');
    }

    const categorias = ['Todos', ...new Set([...categoriasBase, ...productos.map(item => item.categoria)])];
    const cantidad = carrito.reduce((suma, item) => suma + item.cantidad, 0);
    const portadas = Object.entries(imagenes).map(([ruta, url]) => ({ nombre: ruta.split('/').pop(), url }));

    return <>
        <Navbar cantidad={cantidad} />
        <main>
            <Inicio />
            <ListaVideojuegos productos={productos} carrito={carrito} categoria={categoria} categorias={categorias} onCategoria={setCategoria} cargando={cargando} error={error} onReintentar={() => setIntento(actual => actual + 1)} onAgregar={agregarProducto} />
            <GestionCatalogo productos={productos} categorias={categorias.slice(1)} portadas={portadas} deshabilitado={cargando || Boolean(error)} onAgregar={agregarVideojuego} onEliminar={eliminarVideojuego} />
            <FormularioContacto />
        </main>
        <div className="offcanvas offcanvas-end text-bg-dark" tabIndex="-1" id="panelCarrito" aria-labelledby="tituloCarrito">
            <div className="offcanvas-header border-bottom border-secondary"><h2 id="tituloCarrito" className="offcanvas-title h4">Tu carrito</h2><button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Cerrar carrito" /></div>
            <div className="offcanvas-body d-flex flex-column"><Carrito carrito={carrito} onEliminar={id => setCarrito(actual => actual.filter(item => item.id !== id))} onVaciar={() => setCarrito([])} /></div>
        </div>
        <footer className="py-4 border-top border-secondary-subtle"><div className="container text-center text-secondary"><p className="mb-0">© 2026 Pixel Store · La maravilla de jugar al alcance de todos.</p></div></footer>
    </>;
}
