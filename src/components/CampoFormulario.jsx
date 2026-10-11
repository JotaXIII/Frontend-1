export default function CampoFormulario({ id, etiqueta, error, multilinea = false, children, ...props }) {
    const atributos = {
        id, name: id, ...props,
        className: `form-control${error ? ' is-invalid' : ''}`,
        'aria-invalid': Boolean(error),
        'aria-describedby': error ? `${id}-error` : undefined
    };
    return <div className="mb-3">
        <label className="form-label" htmlFor={id}>{etiqueta}</label>
        {children || (multilinea ? <textarea {...atributos} /> : <input {...atributos} />)}
        {error && <div id={`${id}-error`} className="invalid-feedback d-block">{error}</div>}
    </div>;
}
