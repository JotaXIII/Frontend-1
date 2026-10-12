import { useState } from 'react';
import Producto from './Producto.jsx';

export default function ListaVideojuegos({ productos, carrito, categoria, categorias, onCategoria, cargando, error, onReintentar, onAgregar, onCantidad }) {
    const [busqueda, setBusqueda] = useState('');
    const [termino, setTermino] = useState('');
    const visibles = productos.filter(producto => (categoria === 'Todos' || producto.categorias.includes(categoria)) &&
        `${producto.nombre} ${producto.categorias.join(' ')} ${producto.descripcion}`.toLocaleLowerCase('es').includes(termino.toLocaleLowerCase('es')));
    return <section id="productos" className="py-5" aria-labelledby="tituloProductos"><div className="container py-4">
            <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-end gap-3 mb-4">
                <div>
                    <p className="eyebrow mb-2">Selección Pixel</p><h2 id="tituloProductos" className="display-5 fw-bold mb-2">Productos</h2><p className="text-secondary mb-0">Encuentra tu próxima aventura.</p>
                    <div className="btn-group mt-3" role="group" aria-label="Filtrar productos">
                        {categorias.map(nombre => <button key={nombre} className={`btn btn-outline-info filtro-categoria ${categoria === nombre ? 'active' : ''}`} type="button" aria-pressed={categoria === nombre} onClick={() => onCategoria(nombre)}>{nombre}</button>)}
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
                {error && <div className="alert alert-warning">{error} <button className="btn btn-outline-dark btn-sm" onClick={() => onReintentar()}>Reintentar</button></div>}
                {!cargando && !error && visibles.length === 0 && <p className="alert alert-warning">No encontramos productos con esa búsqueda.</p>}
            </div>
            <div id="catalogo" className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4" aria-busy={cargando}>
                {!cargando && !error && visibles.map(producto => <Producto key={producto.id} producto={producto} cantidad={carrito.find(item => item.id === producto.id)?.cantidad ?? 0} onAgregar={onAgregar} onCantidad={onCantidad} />)}
            </div>

    </div></section>;
}
