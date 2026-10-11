import { useState } from 'react';
import CampoFormulario from './CampoFormulario.jsx';

const inicial = { nombre: '', email: '', mensaje: '' };

export default function FormularioContacto() {
    const [datos, setDatos] = useState(inicial);
    const [errores, setErrores] = useState({});
    const [confirmacion, setConfirmacion] = useState('');

    function cambiar(campo, valor) {
        setDatos(actual => ({ ...actual, [campo]: valor }));
        setErrores(actual => ({ ...actual, [campo]: '' }));
        setConfirmacion('');
    }

    function enviar(evento) {
        evento.preventDefault();
        const fallos = {};
        if (datos.nombre.trim().length < 2) fallos.nombre = 'Ingresa un nombre de al menos 2 caracteres.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.email.trim())) fallos.email = 'Ingresa un correo electrónico válido.';
        if (datos.mensaje.trim().length < 10) fallos.mensaje = 'Escribe un mensaje de al menos 10 caracteres.';
        setErrores(fallos);
        setConfirmacion('');
        if (Object.keys(fallos).length) {
            document.getElementById(`contacto-${Object.keys(fallos)[0]}`).focus();
            return;
        }
        setConfirmacion(`Gracias, ${datos.nombre.trim()}. Tu mensaje ha sido enviado y pronto responderemos tu consulta. Muchas gracias.`);
        setDatos(inicial);
    }

    return <section id="contacto" className="py-5 bg-black bg-opacity-25" aria-labelledby="tituloContacto">
        <div className="container py-4"><div className="row g-4">
            <div className="col-lg-5">
                <p className="eyebrow mb-2">Hablemos</p>
                <h2 id="tituloContacto" className="display-5 fw-bold">¿Necesitas ayuda?</h2>
                <p className="text-secondary">Escríbenos para resolver tus dudas sobre productos y compras.</p>
                <p className="text-secondary">Este formulario valida tu mensaje y simula el envío.</p>
            </div>
            <div className="col-lg-7">
                <form noValidate onSubmit={enviar} aria-label="Formulario de contacto">
                    <CampoFormulario id="contacto-nombre" etiqueta="Nombre" type="text" autoComplete="name" required maxLength={80} value={datos.nombre} error={errores.nombre} onChange={e => cambiar('nombre', e.target.value)} />
                    <CampoFormulario id="contacto-email" etiqueta="Email" type="email" autoComplete="email" required maxLength={254} value={datos.email} error={errores.email} onChange={e => cambiar('email', e.target.value)} />
                    <CampoFormulario id="contacto-mensaje" etiqueta="Mensaje" multilinea rows={5} required maxLength={2000} value={datos.mensaje} error={errores.mensaje} onChange={e => cambiar('mensaje', e.target.value)} />
                    <button type="submit" className="btn btn-info">Enviar mensaje</button>
                    <div aria-live="polite" role="status">{confirmacion && <p className="alert alert-success mt-3">{confirmacion}</p>}</div>
                </form>
            </div>
        </div></div>
    </section>;
}
