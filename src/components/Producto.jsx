const formatoPrecio = new Intl.NumberFormat('es-CL', {
    style: 'currency', currency: 'CLP', maximumFractionDigits: 0
});

export { formatoPrecio };

export default function Producto({ producto, seleccionado, onAgregar }) {
    return <div className="col">
        <article className="card h-100 product-card border-secondary-subtle">
            <img src={producto.imagen} className="card-img-top" alt={producto.nombre} loading="lazy" />
            <div className="card-body d-flex flex-column">
                <span className="badge text-bg-info align-self-start mb-2">{producto.categoria}</span>
                <h3 className="card-title h5">{producto.nombre}</h3>
                <p className="card-text text-secondary flex-grow-1">{producto.descripcion}</p>
                <div className="d-flex justify-content-between align-items-center gap-2 mt-3">
                    <strong>{formatoPrecio.format(producto.precio)}</strong>
                    <button className={`btn btn-sm ${seleccionado ? 'btn-outline-info' : 'btn-info'}`} type="button" onClick={() => onAgregar(producto)}>
                        {seleccionado ? 'En el carrito · +1' : 'Agregar'}
                    </button>
                </div>
            </div>
        </article>
    </div>;
}
