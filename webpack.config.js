import path from 'path'



export default {
    mode: 'development',
    entry:{
        mapa:'./src/js/mapa.js',
        agregarImagen:'./src/js/agregarImagen.js',
        mostrarMapa:'./src/js/mostrarMapa.js',
        mostrarEcxel:'./src/js/mostrarEcxel.js',
        // ecxel:'./src/js/ecxel.js'
        // filtro:'./src/js/filtro.js'
    },
    output:{
        filename: '[name].js',
        path: path.resolve('public/js')
    }
}