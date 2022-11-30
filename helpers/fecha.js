const esVendedor = (usuarioId, mantencionUsuarioId) =>{
    return usuarioId === mantencionUsuarioId
}

const formatiarFechaMantencion = fecha =>{
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
    formatiarFechaMantencion
}