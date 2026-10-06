import { formatoPrecio } from './Producto.jsx';

export default function Carrito({ carrito, onEliminar, onVaciar }) {
    const total = carrito.reduce((suma, item) => suma + item.precio * item.cantidad, 0);
    return <>
        <div id="listaCarrito" className="vstack gap-3 flex-grow-1" aria-live="polite">
            {carrito.length === 0 ? <p className="text-secondary">Tu carrito está vacío.</p> : carrito.map(item =>
                <div key={item.id} className="d-flex justify-content-between gap-3 border-bottom border-secondary pb-3">
                    <div><h3 className="h6 mb-1">{item.nombre}</h3><small className="text-secondary">{item.cantidad} × {formatoPrecio.format(item.precio)}</small></div>
                    <button className="btn btn-sm btn-outline-light align-self-start" type="button" onClick={() => onEliminar(item.id)} aria-label={`Eliminar ${item.nombre}`}>×</button>
                </div>
            )}
        </div>
        <div className="border-top border-secondary pt-3 mt-3">
            <div className="d-flex justify-content-between fw-bold mb-3"><span>Total</span><span id="totalCarrito">{formatoPrecio.format(total)}</span></div>
            <button id="vaciarCarrito" className="btn btn-outline-danger w-100" type="button" disabled={!carrito.length} onClick={onVaciar}>Vaciar carrito</button>
            <button className="btn btn-info w-100 mt-2" type="button" disabled>Finalizar compra</button>
            <small className="text-secondary d-block mt-2">Compra disponible próximamente.</small>
        </div>
    </>;
}
