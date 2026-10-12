import { useId, useRef } from 'react';

const formatoPrecio = new Intl.NumberFormat('es-CL', {
    style: 'currency', currency: 'CLP', maximumFractionDigits: 0
});

export { formatoPrecio };

export default function Producto({ producto, cantidad = 0, onAgregar, onCantidad }) {
    const seleccionado = cantidad > 0;
    const controlesCantidad = <div className="d-inline-flex align-items-center gap-2" role="group" aria-label={`Cantidad de ${producto.nombre}`}>
        <button type="button" className="btn btn-sm btn-outline-info" onClick={() => onCantidad(producto.id, -1)} aria-label={`Disminuir cantidad de ${producto.nombre}`}>−</button>
        <span aria-label={`Unidades de ${producto.nombre}`} aria-live="polite">{cantidad}</span>
        <button type="button" className="btn btn-sm btn-outline-info" onClick={() => onAgregar(producto)} aria-label={`Aumentar cantidad de ${producto.nombre}`}>+</button>
    </div>;
    const visor = useRef(null);
    const tituloVisor = useId();
    return <div className="col">
        <article className="card h-100 product-card border-secondary-subtle">
            <button type="button" className="portada-boton" aria-label={`Ampliar imagen de ${producto.nombre}`} onClick={() => visor.current.showModal()}>
                <img src={producto.imagen} className="card-img-top" alt={producto.nombre} loading="lazy" />
            </button>
            <div className="card-body d-flex flex-column">
                <div className="d-flex flex-wrap gap-1 mb-2" aria-label="Categorías">
                    {producto.categorias.map(categoria => <span key={categoria} className="badge text-bg-info">{categoria}</span>)}
                </div>
                <h3 className="card-title h5">{producto.nombre}</h3>
                <p className="card-text text-secondary flex-grow-1">{producto.descripcion}</p>
                <div className="d-flex justify-content-between align-items-center gap-2 mt-3">
                    <strong>{formatoPrecio.format(producto.precio)}</strong>
                    {seleccionado ? controlesCantidad : <button className="btn btn-sm btn-info" type="button" onClick={() => onAgregar(producto)}>Agregar</button>}
                </div>
            </div>
        </article>
        <dialog ref={visor} className="visor-imagen" aria-labelledby={tituloVisor} onClick={evento => { if (evento.target === evento.currentTarget) visor.current.close(); }}>
            <div className="visor-contenido">
                <div className="d-flex justify-content-end mb-3">
                    <button type="button" className="btn-close btn-close-white flex-shrink-0" aria-label="Cerrar imagen" onClick={() => visor.current.close()} />
                </div>
                <div className="visor-detalle">
                    <img src={producto.imagen} alt={`Portada completa de ${producto.nombre}`} className="imagen-completa" />
                    <div className="visor-datos">
                        <h2 id={tituloVisor} className="h2 mb-3">{producto.nombre}</h2>
                        <div className="d-flex flex-wrap gap-2 mb-3" aria-label="Categorías del juego">
                            {producto.categorias.map(categoria => <span key={categoria} className="badge text-bg-info">{categoria}</span>)}
                        </div>
                        <p className="text-secondary mb-4">{producto.descripcion}</p>
                        <p className="small text-secondary mb-1">Precio en CLP</p>
                        <strong className="h3 mb-0">{formatoPrecio.format(producto.precio)}</strong>
                        <div className="mt-4">
                            {seleccionado ? controlesCantidad : <button type="button" className="btn btn-info" onClick={() => onAgregar(producto)}>Agregar al carrito</button>}
                        </div>
                    </div>
                </div>
            </div>
        </dialog>
    </div>;
}
