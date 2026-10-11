import { useState } from 'react';
import CampoFormulario from './CampoFormulario.jsx';

const inicial = { nombre: '', categorias: [], precio: '', descripcion: '', imagen: '' };

export default function GestionCatalogo({ productos, categorias, portadas, deshabilitado, onAgregar, onEliminar }) {
    const [datos, setDatos] = useState(inicial);
    const [errores, setErrores] = useState({});
    const [aviso, setAviso] = useState('');
    const [pendiente, setPendiente] = useState(null);

    function cambiar(campo, valor) {
        setDatos(actual => ({ ...actual, [campo]: valor }));
        setErrores(actual => ({ ...actual, [campo]: '' }));
        setAviso('');
    }

    function agregar(evento) {
        evento.preventDefault();
        if (deshabilitado) return;
        const fallos = {};
        if (datos.nombre.trim().length < 2) fallos.nombre = 'Ingresa un nombre de al menos 2 caracteres.';
        if (!datos.categorias.length || datos.categorias.some(categoria => !categorias.includes(categoria))) fallos.categorias = 'Selecciona al menos una categoría.';
        if (!Number.isSafeInteger(Number(datos.precio)) || Number(datos.precio) <= 0) fallos.precio = 'Ingresa un precio entero mayor que cero.';
        if (datos.descripcion.trim().length < 10) fallos.descripcion = 'Escribe una descripción de al menos 10 caracteres.';
        if (!portadas.some(item => item.url === datos.imagen)) fallos.imagen = 'Selecciona una portada.';
        setErrores(fallos);
        if (Object.keys(fallos).length) {
            document.getElementById(`juego-${Object.keys(fallos)[0]}`).focus();
            return;
        }
        onAgregar({ ...datos, nombre: datos.nombre.trim(), descripcion: datos.descripcion.trim(), precio: Number(datos.precio) });
        setAviso(`${datos.nombre.trim()} se agregó al catálogo.`);
        setDatos(inicial);
    }

    return <section id="administracion" className="py-5" aria-labelledby="tituloGestion"><div className="container">
        <p className="eyebrow">Administración</p>
        <h1 id="tituloGestion" className="h2">Gestionar catálogo</h1>
        <p className="text-secondary">Agrega o elimina videojuegos. Los cambios se conservan durante esta sesión y se reinician al recargar.</p>
        <details className="border border-secondary rounded-3 p-3">
            <summary className="fw-semibold">Abrir gestión del catálogo</summary>
            <div className="row g-4 mt-1">
                <div className="col-lg-6">
                    <h3 className="h5">Nuevo videojuego</h3>
                    <form noValidate onSubmit={agregar} aria-label="Agregar videojuego">
                        <fieldset disabled={deshabilitado}>
                            <CampoFormulario id="juego-nombre" etiqueta="Nombre del videojuego" required maxLength={100} value={datos.nombre} error={errores.nombre} onChange={e => cambiar('nombre', e.target.value)} />
                            <fieldset className="mb-3" aria-describedby={errores.categorias ? 'juego-categorias-error' : 'categorias-ayuda'}>
                                <legend className="form-label fs-6">Categorías</legend>
                                <p id="categorias-ayuda" className="small text-secondary">Selecciona una o varias categorías.</p>
                                <div className="d-flex flex-wrap gap-3">
                                    {categorias.map((categoria, indice) => {
                                        const id = indice === 0 ? 'juego-categorias' : `juego-categorias-${indice}`;
                                        return <div className="form-check" key={categoria}>
                                            <input id={id} type="checkbox" className="form-check-input" checked={datos.categorias.includes(categoria)} aria-invalid={Boolean(errores.categorias)} aria-describedby={errores.categorias ? 'juego-categorias-error' : undefined} onChange={e => cambiar('categorias', e.target.checked ? [...datos.categorias, categoria] : datos.categorias.filter(valor => valor !== categoria))} />
                                            <label htmlFor={id} className="form-check-label">{categoria}</label>
                                        </div>;
                                    })}
                                </div>
                                {errores.categorias && <div id="juego-categorias-error" className="invalid-feedback d-block">{errores.categorias}</div>}
                            </fieldset>
                            <CampoFormulario id="juego-precio" etiqueta="Precio en CLP" type="number" min="1" step="1" required value={datos.precio} error={errores.precio} onChange={e => cambiar('precio', e.target.value)} />
                            <CampoFormulario id="juego-descripcion" etiqueta="Descripción" multilinea rows={3} required maxLength={500} value={datos.descripcion} error={errores.descripcion} onChange={e => cambiar('descripcion', e.target.value)} />
                            <CampoFormulario id="juego-imagen" etiqueta="Portada" error={errores.imagen}>
                                <select id="juego-imagen" className={`form-select${errores.imagen ? ' is-invalid' : ''}`} required value={datos.imagen} aria-invalid={Boolean(errores.imagen)} aria-describedby={errores.imagen ? 'juego-imagen-error' : undefined} onChange={e => cambiar('imagen', e.target.value)}>
                                    <option value="">Selecciona una portada</option>{portadas.map(portada => <option key={portada.url} value={portada.url}>{portada.nombre}</option>)}
                                </select>
                            </CampoFormulario>
                            <button className="btn btn-info" type="submit">Agregar videojuego</button>
                        </fieldset>
                    </form>
                </div>
                <div className="col-lg-6">
                    <h3 className="h5">Videojuegos disponibles ({productos.length})</h3>
                    {productos.length === 0 && <p className="text-secondary">No hay videojuegos disponibles.</p>}
                    <ul className="list-group">
                        {productos.map(producto => <li className="list-group-item d-flex justify-content-between align-items-center gap-3" key={producto.id}>
                            <span className="text-break">{producto.nombre}</span>
                            <button type="button" className="btn btn-sm btn-outline-danger flex-shrink-0" disabled={deshabilitado} onClick={() => setPendiente(producto)} aria-label={`Eliminar del catálogo ${producto.nombre}`}>Eliminar</button>
                        </li>)}
                    </ul>
                    {pendiente && <div className="alert alert-warning mt-3" role="group" aria-label="Confirmar eliminación">
                        <p>¿Eliminar {pendiente.nombre} del catálogo y del carrito?</p>
                        <div className="d-flex gap-2"><button type="button" className="btn btn-danger" onClick={() => { onEliminar(pendiente.id); setAviso(`${pendiente.nombre} se eliminó del catálogo.`); setPendiente(null); }}>Confirmar eliminación</button><button type="button" className="btn btn-outline-dark" onClick={() => setPendiente(null)}>Cancelar</button></div>
                    </div>}
                </div>
            </div>
            <div role="status" aria-live="polite">{aviso && <p className="alert alert-success mt-3 mb-0">{aviso}</p>}</div>
        </details>
    </div></section>;
}
