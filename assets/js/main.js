
const URL_CANCIONES = `http://${BASE_URL('3000')}/canciones`
const URL_TEST_MODE_ON = `http://${BASE_URL('3000')}/test_mode_on`
const URL_TEST_MODE_OFF = `http://${BASE_URL('3000')}/test_mode_off`
const URL_STOP_ALL = `http://${BASE_URL('3000')}/stop_all`
const URL_SIGUIENTE = `http://${BASE_URL('3000')}/siguiente`
const URL_VOLUMEN = volumen => `http://${BASE_URL('3000')}/set_volume_to?volumen=${volumen}`

const SONGS_CONT = document.getElementById('canciones')
const PLAYING_CONT = document.getElementById('sonando')
const QUEUE_CONT = document.getElementById('cola')

const dialog = document.getElementById('customDialog')
const openDialogBtn = document.getElementById('openDialogBtn')
const closeDialogBtn = document.getElementById('closeDialogBtn')
const fileInput = document.getElementById('fileInput')
const cameraPreview = document.getElementById('cameraPreview')
const textInput = document.getElementById('textInput')
const submitBtn = document.getElementById('submitBtn')

// Función para abrir el modal y desactivar el scroll
//openDialogBtn.addEventListener('click', () => {
//    dialog.showModal();
//    document.body.classList.add('no-scroll');// Desactiva el scroll
//})

// Función para cerrar el modal y reactivar el scroll
//closeDialogBtn.addEventListener('click', closeDialog);
//dialog.addEventListener('click', (e) => {
//    if (e.target === dialog) {
//        closeDialog();
//    }
//});
//
//// Cerrar el modal al hacer clic fuera del contenido
//dialog.addEventListener('click', (e) => {
//    if (e.target === dialog) {
//        closeDialog();
//    }
//})
//
//// Mostrar vista previa de la imagen seleccionada
//fileInput.addEventListener('change', (e) => {
//    const file = e.target.files[0]
//    if (file) {
//        const reader = new FileReader()
//        reader.onload = (e) => {
//            cameraPreview.src = e.target.result
//            cameraPreview.style.display = 'block' 
//        }
//        reader.readAsDataURL(file)
//    }
//})

// Evento de enviar (simple alerta por ahora)
//submitBtn.addEventListener('click', () => {
//    alert('¡Mensaje enviado!')
//    // Añadimos la canción a la cola
//    var url = URL_CANCIONES,
//    params = {
//        method: 'POST',
//        mode: 'cors',
//        body: JSON.stringify({
//            cancion: "Noche de paz",
//            dedicatoria: textInput.value,
//            imagen: cameraPreview.src
//        }),
//        headers: { 'Content-Type': 'application/json' },
//    }
//
//    var request = new Request(url, params)
//    var resp_aux
//
//    fetch(request)
//        .then(res => resp_aux = res.clone())
//        .then(res => res.json())
//        .then(res => {
//            console.log('Cancion puesta a la cola')
//        })
//        .catch(err => console.log(err))
//
//    closeDialog()
//    document.body.classList.remove('no-scroll')
//})
//
//
//// Función para cerrar el modal
//function closeDialog() {
//    dialog.close();
//    document.body.classList.remove('no-scroll'); // Reactiva el scroll
//    cameraPreview.style.display = 'none'
//    fileInput.value = ""
//    textInput.value = ""
//}

/* ******************************
    * DIV CANCIÓN SONANDO: '<div class="card p-2 m-2">' + name + '</div>'
    * DIV CANCIÓN SELECCIONABLE: '<div class="card p-2 m-2 seleccionable" onCLick="onSeleccionable(this)">' + name + '</div>'
****************************** */

function siguiente() {
    fetch(URL_SIGUIENTE)
}

function stopall() {
    fetch(URL_STOP_ALL)
}

function testmodeon() {
    fetch(URL_TEST_MODE_ON)
}

function testmodeoff() {
    fetch(URL_TEST_MODE_OFF)
}

function volumen(vol) {
    fetch(URL_VOLUMEN(vol))
}

const appendSongToDiv = (element, songName, isInQueue) => {
    let songDiv = document.createElement('div')
    songDiv.className = 'card p-2 m-2 '
    songDiv.innerHTML = songName
    // return alert(songName)
    songDiv.id = 'ID_' + songName

    let existe = ""
    try {
        existe = document.getElementById('ID_' + songName).id
    } catch { }

    if (existe == "") {
        if (!isInQueue) {
            songDiv.className += 'seleccionable'
            songDiv.setAttribute('onclick', 'onSeleccionable(this)')
            //            SONGS_CONT.append(songDiv)
        } else {
            songDiv.className += 'espera'
            //            QUEUE_CONT.append(songDiv)

        }
        element.append(songDiv)
        // if (element.id == 'sonando') {
        //     let barraProgreso = document.createElement('div')
        //     barraProgreso.id = 'barra-progreso'
        //     songDiv.append(barraProgreso)
        // }
    }
}

const onSeleccionable = selecionable => {
    fetch(URL_CANCIONES)
        .then(response => response.json()
            .then(data => {
                
                if (selecionable.textContent != 'Mensaje del dia') {
                    if (data.cancionesCola.length >= 5)
                        return alert("Muchas canciones en cola, espera a que acabe una y podrás seleccionar la tuya )")
                    if (data.lengthms >= 8 * 60 * 1000)
                        return alert("Mucho tiempo de canciones en cola, espera a que acabe una y podrás seleccionar la tuya )")

                    let ahora = new Date()
                    if (ahora.getHours() < 18 || (ahora.getHours() == 18 && ahora.getMinutes() < 30) || (ahora.getHours() == 21 && ahora.getMinutes() > 30) || ahora.getHours() >= 22) {
                        var passw = prompt('Por el bienestar de nuestros vecinos, canciones solo de 18:30 a 21:30, ¡Vente entre esas horas y disfruta del espectáculo! )')
                        if (passw != '131313')
                            return
                    }
                }

                let texto = '¡¡Es tu oportunidad!! \nPuedes escribir una dedicatoria para que suene antes de la canción:\n\n' + selecionable.textContent + '\n\n (Si eres vergonzoso, no te preocupes deja el campo en blanco y no sonará nada)'
                if (selecionable.textContent == 'Cumpleaños Feliz')
                    texto = 'Nombre de la persona que cumple años'
                if (selecionable.textContent == 'Mensaje del dia')
                    texto = 'El mensaje que escribas aparecerá cada 30 minutos hasta que alguien lo cambie'
                var dedicatoria = prompt(texto)
                if (selecionable.textContent == 'Cumpleaños Feliz' && dedicatoria == '')
                    return alert("No podemos cantar el Cumpelaños Feliz sin saber a quien")

                if (dedicatoria != undefined) {
                    if (checkPalabrotas(dedicatoria) == true) {
                        return alert('Mensaje no adecuado')
                    }

                    // Añadimos la canción a la cola
                    var url = URL_CANCIONES,
                        params = {
                            method: 'POST',
                            mode: 'cors',
                            body: JSON.stringify({
                                cancion: selecionable.textContent,
                                dedicatoria: dedicatoria
                            }),
                            headers: { 'Content-Type': 'application/json' },
                        }

                    var request = new Request(url, params)
                    var resp_aux

                    fetch(request)
                        .then(res => resp_aux = res.clone())
                        .then(res => res.json())
                        .then(res => {
                            console.log('Cancion puesta a la cola')
                            if (res.success === false){
                                alert (res.message)

                                }
                        })
                        .catch(err => console.log(err))
                }
                else { alert('Cancelada la selección de canción') }
            })
        )
}

var Palabrotas = [
    'joder',
    'jodan',
    'joda',
    'gilipollas',
    'ostia',
    'hostia',
    'cojones',
    'coño',
    'culo',
    'ojete',
    'folle',
    'follen',
    'follar',
    'cagar',
    'cago',
    'caguen',
    'cagüen',
    'subnormal',
    'pene',
    'nepe',
    'huevos',
    'cojones',
    'cojonudo',
    'caraculo',
    'ano',
    'cabrón',
    'cabron',
    'puta',
    'puto',
    'cabron',
    'cabrones',
    'polla',
    'pollas',
    'poya',
    'poyas',
    'mamar',
    'mamada',
    'mamóm',
    'mamom',
    'chupar',
    'chupan',
    'timbre',
    'moro',
    'chupa'
]

const checkPalabrotas = (palabra) => {
    var rgx = new RegExp('\\b(' + Palabrotas.join("|") + ')\\b', "gi")
    return rgx.test(palabra)
}


var i = 0

const getPlayList = () => {
    let divsSongsQueue = Array.from(QUEUE_CONT.getElementsByTagName('div')),
        divsSongsWaiting = Array.from(SONGS_CONT.getElementsByTagName('div')),
        divsSongsPlaying = Array.from(PLAYING_CONT.getElementsByTagName('div')),
        songsQueue = divsSongsQueue.map(div => div.innerHTML),
        songsWaiting = divsSongsWaiting.map(div => div.innerHTML)


    fetch(URL_CANCIONES)
        .then(response => response.json())
        .then(data => {
            let cancionesCola = data.cancionesCola,
                cancionesSinReproducir = data.cancionesSinReproducir,
                sonando = data.sonando

            document.getElementById('cancion_sonando_span').innerHTML = data.sonando
            if (data.sonando == '') {
                PLAYING_CONT.style = 'display:none'
            }
            else
                PLAYING_CONT.style = ''
            // Añadimos el progreso
            try {
                barraProgreso = document.getElementById('barra-progreso')
                const porcentaje = `${data.progreso}%`
                barraProgreso.style.width = porcentaje
                const cantidadProgreso = document.getElementById('cantidad-progreso')
                cantidadProgreso.innerHTML = data.progreso
            } catch { }

            //Añadimos canciones a la cola
            cancionesCola
                .filter(cancion => !songsQueue.includes(cancion))
                .forEach(cancion => appendSongToDiv(QUEUE_CONT, cancion, true))
            if (cancionesCola.length == 0) {
                QUEUE_CONT.style = 'display:none'
            }
            else
                QUEUE_CONT.style = ''

            //Eliminamos canciones de la cola
            divsSongsQueue
                .filter(cancion => !cancionesCola.includes(cancion.innerHTML))
                .forEach(cancion => cancion.remove())

            //Añadimos canciones a las canciones sin reproducir
            cancionesSinReproducir
                .filter(cancion => !songsWaiting.includes(cancion))
                .filter(cancion => !sonando.includes(cancion))
                .forEach(cancion => appendSongToDiv(SONGS_CONT, cancion, false))

            let e = divsSongsWaiting.map(s => s.innerHTML)
            //Eliminamos canciones de las canciones sin reproducir
            divsSongsWaiting
                .filter(cancion => !cancionesSinReproducir.includes(cancion.innerHTML))
                .forEach(cancion => cancion.remove())

        })
        .catch(error => {
            // alert("Esta habiendo errores con las canciones, disculpe las molestias. Prueba entre las 18:30 y 21:30'(")
            console.log(error)
        })
    // console.log(i++)

    // Oculto o muestro las capas de control con el parametro args=admin
    var url = document.URL

    //if (url.includes('admin')) {
    //    document.getElementById('control').style = ''
    //    document.getElementById('volumen').style = ''
    //}
    //else {
    //    document.getElementById('control').style = 'display:none'
    //    document.getElementById('volumen').style = 'display:none'
    //}

}



getPlayList()
setInterval(getPlayList, 1000)
