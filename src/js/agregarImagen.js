import  {Dropzone} from 'dropzone'


const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')


Dropzone.options.imagen = {
    dictDefaultMessage: 'Sube Tus Imagenes Aquí',
    aceptedFiles: '.png,.jpg,.jpeg,.pdf',
    maxFilesize:5,
    maxFiles:1,
    parallelUploads:1,
    autoProcessQueue:false,
    addRemoveLinks:true,
    dictRemoveFile: 'Borrar Imagen',
    dictMaxFilesExceeded :'El Limite es una imagen',
    headers:{
        'CSRF-Token' : token
    },
    paramName: 'imagen',
    init: function(){
        const dropzone =  this
        const btnPublicar = document.querySelector('#publicar')
       
        btnPublicar.addEventListener('click',function(){
            dropzone.processQueue()
        })

        dropzone.on('queuecomplete' ,function(){
            if(dropzone.getActiveFiles().length == 0){
                window.location.href = '/mis-equipos'
            }
        })
    }
}
