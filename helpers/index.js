const esVendedor = (usuarioId, propiedadUsuarioId) =>{
    return usuarioId === propiedadUsuarioId
}

const formatiarFecha = fecha =>{
    const nuevaFecha = new Date(fecha).toISOString().slice()
    const opciones = {
        weekday:'long',
        year:'numeric',
        month:'long',
        day:'numeric'
    }

    return new Date(nuevaFecha).toLocaleDateString('es-ES', opciones)
}


export {
    esVendedor,
    formatiarFecha
}