import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Producto from './components/Producto.jsx';
import Carrito from './components/Carrito.jsx';

const imagenes = import.meta.glob('../assets/img/*', { eager: true, query: '?url', import: 'default' });
const urlCatalogo = new URL('../assets/data/productos.json', import.meta.url).href;
const categorias = ['Todos', 'Acción', 'Cooperativo', 'Aventura', 'Clásicos'];

export default function App() {
    const [productos, setProductos] = useState([]);
    const [carrito, setCarrito] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [termino, setTermino] = useState('');
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

    const visibles = productos.filter(producto =>
        (categoria === 'Todos' || producto.categoria === categoria) &&
        `${producto.nombre} ${producto.categoria} ${producto.descripcion}`.toLocaleLowerCase('es').includes(termino.toLocaleLowerCase('es'))
    );
    const cantidad = carrito.reduce((suma, item) => suma + item.cantidad, 0);

    return <>
        {createPortal(String(cantidad), document.getElementById('contadorCarrito'))}
        {createPortal(<>
            <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-end gap-3 mb-4">
                <div>
                    <p className="eyebrow mb-2">Selección Pixel</p><h2 id="tituloProductos" className="display-5 fw-bold mb-2">Productos</h2><p className="text-secondary mb-0">Encuentra tu próxima aventura.</p>
                    <div className="btn-group mt-3" role="group" aria-label="Filtrar productos">
                        {categorias.map(nombre => <button key={nombre} className={`btn btn-outline-info filtro-categoria ${categoria === nombre ? 'active' : ''}`} type="button" aria-pressed={categoria === nombre} onClick={() => setCategoria(nombre)}>{nombre}</button>)}
                    </div>
                </div>
                <form id="formularioBusqueda" className="d-flex gap-2" role="search" onSubmit={evento => { evento.preventDefault(); setTermino(busqueda.trim()); }}>
                    <label className="visually-hidden" htmlFor="busqueda">Buscar productos</label>
                    <input id="busqueda" className="form-control" type="search" placeholder="Buscar juegos..." autoComplete="off" value={busqueda} onChange={evento => { setBusqueda(evento.target.value); if (!evento.target.value) setTermino(''); }} />
                    <button className="btn btn-outline-info" type="submit">Buscar</button>
                </form>
            </div>
            <div role="status" aria-live="polite">
                {cargando && <p className="alert alert-info">Cargando productos...</p>}
                {error && <div className="alert alert-warning">{error} <button className="btn btn-outline-dark btn-sm" onClick={() => setIntento(actual => actual + 1)}>Reintentar</button></div>}
                {!cargando && !error && visibles.length === 0 && <p className="alert alert-warning">No encontramos productos con esa búsqueda.</p>}
            </div>
            <div id="catalogo" className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4" aria-busy={cargando}>
                {!cargando && !error && visibles.map(producto => <Producto key={producto.id} producto={producto} seleccionado={carrito.some(item => item.id === producto.id)} onAgregar={agregarProducto} />)}
            </div>
        </>, document.getElementById('contenidoProductos'))}
        {createPortal(<Carrito carrito={carrito} onEliminar={id => setCarrito(actual => actual.filter(item => item.id !== id))} onVaciar={() => setCarrito([])} />, document.getElementById('contenidoCarrito'))}
    </>;
}
