export default function Navbar({ cantidad }) {
    return (<header>
        <nav className="navbar navbar-expand-lg navbar-dark fixed-top border-bottom border-secondary-subtle" aria-label="Navegaci&oacute;n principal">
            <div className="container">
                <a className="navbar-brand fw-bold text-info" href="#inicio">Pixel Store</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menuPrincipal" aria-controls="menuPrincipal" aria-expanded="false" aria-label="Abrir men&uacute;"><span className="navbar-toggler-icon"></span></button>
                <div className="collapse navbar-collapse" id="menuPrincipal">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item"><a className="nav-link active" href="#inicio">Inicio</a></li>
                        <li className="nav-item"><a className="nav-link" href="#productos">Productos</a></li>
                        <li className="nav-item"><a className="nav-link" href="#gestion">Catálogo</a></li><li className="nav-item"><a className="nav-link" href="#contacto">Contacto</a></li>
                    </ul>
                    <button className="btn btn-outline-info position-relative" type="button" data-bs-toggle="offcanvas" data-bs-target="#panelCarrito" aria-controls="panelCarrito">Carrito <span id="contadorCarrito" className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" aria-live="polite">{cantidad}</span></button>
                </div>
            </div>
        </nav>
    </header>);
}
