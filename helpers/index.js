const esVendedor = (usuarioId, equipoUsuarioId) =>{
    return usuarioId === equipoUsuarioId
}

const formatiarFecha = fecha =>{
    const nuevaFecha = new Date(fecha).toISOString().slice()
    const opciones = {
        weekday:'long',
        year:'numeric',
        month:'short',
        day:'numeric'
    }

    return new Date(nuevaFecha).toLocaleDateString('es-ES', opciones)
}


export {
    esVendedor,
    formatiarFecha
}