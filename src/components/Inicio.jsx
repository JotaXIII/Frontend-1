import imagen0 from '../../assets/img/battlefield.jpg';
import imagen1 from '../../assets/img/helldivers.webp';
import imagen2 from '../../assets/img/returnal.jpg';

export default function Inicio() {
    return (<section id="inicio" className="hero-section d-flex align-items-center" aria-labelledby="tituloPrincipal">
            <div className="container py-5">
                <div className="row align-items-center g-4 g-lg-5">
                    <div className="col-lg-7">
                        <p className="eyebrow">Tienda digital de videojuegos</p>
                        <h1 id="tituloPrincipal" className="display-1 fw-bold">La maravilla de jugar al alcance de todos.</h1>
                        <p className="lead text-secondary">Descubre aventuras inolvidables, combates intensos y mundos para explorar.</p>
                        <a className="btn btn-info btn-lg fw-semibold mt-3" href="#productos">Explorar productos</a>
                    </div>
                    <div className="col-lg-5">
                        <div id="carruselPrincipal" className="carousel slide shadow-lg" data-bs-ride="carousel" aria-label="Promociones destacadas">
                            <div className="carousel-indicators"><button type="button" data-bs-target="#carruselPrincipal" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Promoci&oacute;n 1"></button><button type="button" data-bs-target="#carruselPrincipal" data-bs-slide-to="1" aria-label="Promoci&oacute;n 2"></button><button type="button" data-bs-target="#carruselPrincipal" data-bs-slide-to="2" aria-label="Promoci&oacute;n 3"></button></div>
                            <div className="carousel-inner rounded-4 overflow-hidden">
                                <div className="carousel-item active"><img src={imagen0} className="d-block w-100" alt="Combate de Battlefield 6" /></div>
                                <div className="carousel-item"><img src={imagen1} className="d-block w-100" alt="Batalla espacial de Helldivers II" /></div>
                                <div className="carousel-item"><img src={imagen2} className="d-block w-100" alt="Mundo alien&iacute;gena de Returnal" /></div>
                            </div>
                            <button className="carousel-control-prev" type="button" data-bs-target="#carruselPrincipal" data-bs-slide="prev" aria-label="Anterior"><span className="carousel-control-prev-icon"></span></button><button className="carousel-control-next" type="button" data-bs-target="#carruselPrincipal" data-bs-slide="next" aria-label="Siguiente"><span className="carousel-control-next-icon"></span></button>
                        </div>
                    </div>
                </div>
            </div>
        </section>);
}
