const express = require('express'),
    app = express(),
    cors = require('cors'),
    axios = require('axios'),
    gTTS = require('gtts'),
    fs = require('fs'),
    port = 3000,
    decicatorias_max = 5

const {
    PLAYLIST_CANCIONES,
    PLAYLIST_ANIMACIONES,
    PLAYLIST_SIMON,
    PLAYLIST_KAHOOT,
    PLAYLIST_OTRAS,
    URL_GET_QUEUED_STEPS,
    URL_GET_PLAYING_STATUS,
    URL_CLEAR_BACKGROUND,
    URL_SET_BACKGROUND,
    URL_GET_PLAYLIST_STEPS,
    URL_ENQUEUE_SONG,
    URL_STOP_ANIMATIONS,
    URL_XLIGTHS_COMMAND,
    URL_SET_VOLUME,
    URL_SET_TEST_MODE_ON,
    URL_SET_TEST_MODE_OFF,
    URL_STOP_ALL,
    URL_SIGUIENTE,
    FILE_COMENTARIOS,
    FILE_ANIMACION_BTC,
    SEPARADOR,
    SIMON_SAYS_TXT,
    SIMON_SAYS_ERROR_TXT,
    SHOW_PATH
} = require('./constants');

const BASE_URL = require('./baseUrl')
const esInapropiadoZPK = require('./ZPKModerator'); // Importar la función desde ZPKModerator.js
const obtenerPreguntasAleatorias = require('./kahoot_preguntas')

WEB_DATA = {}

WEB_DATA.i = 0
WEB_DATA.lengthms = 0
WEB_DATA.canciones = []
WEB_DATA.cancionesCola = []
WEB_DATA.cancionesSeleccionables = []
WEB_DATA.cancionesEnProceso = [] // Guarda las canciones pendientes de encolar. Para quitarlas de la lista de seleccionables mientras se procesan
WEB_DATA.sonando = ''
WEB_DATA.sonando_real = ''
WEB_DATA.colaInterna = [] // Aqui se guardan las peticiones de las canciones y los simones dice con datos internos
WEB_DATA.cancionesColaParaWeb = []

WEB_DATA.secuenciaSimon = []
WEB_DATA.secuenciaJugador = []
WEB_DATA.colors = ['simon_dice_verde', 'simon_dice_rojo', 'simon_dice_amarillo', 'simon_dice_azul', 'simon_dice_ok', 'simon_dice_error']
WEB_DATA.temporizadoresSimon = {}
WEB_DATA.temporizadoresSimonTurnoJugador = {}
WEB_DATA.postSimonTimeout = {}
WEB_DATA.simon_dice_status = 'sds_end'
WEB_DATA.simon_dice_timeout = 5
// sds_starting: Poniendo el inicio
// sds_simon: simon esta ejecutando la secuencia
// sds_player: Turno del jugador (botones habilitados)
// sds_ok: Tocando secuencia de ok
// sds_end: Partida terminada 
WEB_DATA.simon_dice_record = {
    jugador: undefined,
    aciertos: undefined,
    fecha: undefined
}  // Se guarda el jugador y la puntuacion del record

const kahootPreguntasMax = 2
const kahootSecuencias = {
    // Inicio
    inicio: "inicio", // 13s
    inicio_naranja: "inicio_jugador_naranja", // 6s
    inicio_magenta: "inicio_jugador_magenta",
    inicio_cian: "inicio_jugador_cian",
    inicio_blanco: "inicio_jugador_blanco",
    inicio_azul: "inicio_jugador_azul",
    inicio_amarillo: "inicio_jugador_amarillo",
    // Preguntas
    pregunta: "pregunta", // 12s
    cambio: "cambio",
    // Final
    fin: "fin",
    fin_naranja: "fin_jugador_naranja",
    fin_magenta: "fin_jugador_magenta",
    fin_cian: "fin_jugador_cian",
    fin_blanco: "fin_jugador_blanco",
    fin_azul: "fin_jugador_azul",
    fin_amarillo: "fin_jugador_amarillo"
}
const kahootColores = [
    'azul',
    'amarillo',
    'blanco',
    'magenta',
    'cian',
    'naranja',
]

function reiniciarKahootVariables() {
    WEB_DATA.kahootEstado = ''
    WEB_DATA.kahootTimeouts = {}
    WEB_DATA.kahootInterval = {}
    WEB_DATA.kahootInciado = false
    WEB_DATA.kahootPreguntaIndex = 0
    WEB_DATA.kahootPreguntasElegidas = obtenerPreguntasAleatorias(kahootPreguntasMax)
    WEB_DATA.kahootJugadores = [] // {nombre: string, puntuacion: int, color: string}
    WEB_DATA.kahootJugadoresRespondido = []
}
reiniciarKahootVariables()


function now(){
    var now = new Date()
    return now
}

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())


app.get('/test_mode_on', (req, res) => {
    console.log(now() + ' ' + URL_SET_TEST_MODE_ON)
    axios.get(URL_SET_TEST_MODE_ON)
        .then()
        .catch(err => { console.log(now() + ' ' + err) })
    res.json({
        testmode: on
    })
}
)

app.get('/test_mode_off', (req, res) => {
    console.log(now() + ' ' + URL_SET_TEST_MODE_OFF)
    axios.get(URL_SET_TEST_MODE_OFF)
        .then()
        .catch(err => { console.log(now() + ' ' + err) })
    res.json({
        testmode: off
    })
}
)

app.get('/set_volume_to', (req, res) => {
    setVolumen(req.query.volumen)
})

function setVolumen(volumen) {
    let action3 = URL_SET_VOLUME(volumen)
    axios.post(action3)
        .then(() => console.log(now() + ' ' + 'Volumen al ' + volumen + ': ' + action3))
}

function setVolumenFueraDeHora(volumen) {
    var now = new Date()
    var desde = new Date()
    desde.setHours(21, 30)
    var hasta = new Date()
    hasta.setHours(18, 30)
    if (now > desde || now < hasta) { setVolumen(volumen) }
}

app.get('/stop_all', (req, res) => {
    axios.get(URL_STOP_ALL)
        .then(res.json({ response: 'hecho' }))
        .catch(err => res.json({ error: err.toString() }))

}
)

app.get('/siguiente', (req, res) => {
    axios.get(URL_SIGUIENTE)
        .then(res.json({ response: 'hecho' }))
        .catch(err => res.json({ error: err.toString() }))

}
)

app.get('/canciones', (req, res) => {
    return res.json(
        {
            cancionesCola: WEB_DATA.cancionesColaParaWeb,
            //                           cancionesCola: WEB_DATA.cancionesCola,
            cancionesSinReproducir: WEB_DATA.cancionesSeleccionables,
            cancionesEnProceso: WEB_DATA.cancionesEnProceso,
            lengthms: WEB_DATA.lengthms,
            sonando: WEB_DATA.sonando,
            progreso: WEB_DATA.progreso,
        }
    )
})


// EJEMPLOS EN CARPETA DE EJEMPLOS
app.get('/simon', (req, res) => {
    try {
        var { jugador, nuevaPartida } = req.query
        var partidaString = 'Simon dice ' + jugador
        var index = WEB_DATA.cancionesCola.indexOf(partidaString) // Buscamos el index en el que esta el simon del usuario-

        if (index !== -1 && nuevaPartida === "true") {
            return res.status(500).json({ error: 'Ese nombre de jugador ya tiene una partida abierta, por favor seleccione otro nombre de usuario' })
        }

        var responseJson = { record: WEB_DATA.simon_dice_record }

        if (index === -1 && nuevaPartida === "true") { // No existe el simon en la cola, se crea
            WEB_DATA.colaInterna.push(req)
            WEB_DATA.cancionesCola.push(partidaString)
            // Reiniciar o crear un nuevo temporizador para el ID
            setSimonTimer(jugador, 5)
            responseJson.status = 'inQueue'
        } else if (index === -1 || WEB_DATA.postSimonTimeout[jugador]) {
            delete WEB_DATA.postSimonTimeout[jugador]
            responseJson.status = 'quit'
        }
        else if (index === 0 && (WEB_DATA.sonando.length == 0 || WEB_DATA.sonando == partidaString)) { // Si esta en primera posicion y no hay nada sonando
            responseJson.status = 'running'
        } else {
            // Reiniciar o crear un nuevo temporizador para el ID
            setSimonTimer(jugador, 5)
            responseJson.status = 'inQueue'
        }
        responseJson.sds = WEB_DATA.simon_dice_status
        return res.status(200).json(responseJson)
    }
    catch (e) {
        let txt = SIMON_SAYS_ERROR_TXT
        fs.appendFileSync(txt, now() + ' ' + e + ": " + e.message + '\n')
    }
})

app.post('/simon', async (req, res) => {
    try {
        var { accion, color, jugador } = req.body
        var colorIndexRandom = Math.floor(Math.random() * 3.999999); // random entre 0 y 3
        var esSecuenciaCorrecta = true
        var secsTimeout = null

        if (WEB_DATA.cancionesCola.indexOf("Simon dice " + jugador) !== 0) {
            return
        }

        if (accion === 'start') { // Accion que llega cuando llega a la web de los controles del simon dice
            // Si tiene un nombre váldio y no existe una partida con ese mismo nombre se añade la petición a la cola
            WEB_DATA.secuenciaSimon = []
            WEB_DATA.secuenciaJugador = []
            WEB_DATA.secuenciaSimon.push(WEB_DATA.colors[colorIndexRandom])
            WEB_DATA.simon_dice_status = 'sds_starting'
            console.log(now() + ' ' + "[simon dice]: STARTING " + WEB_DATA.secuenciaSimon)
            await setVolumenFueraDeHora(5)
            await encolarCancion('simon_dice_inicio', PLAYLIST_SIMON)
            // encolamos la primera
            for (let i = 0; i < WEB_DATA.secuenciaSimon.length; i++) {
                let cancion = WEB_DATA.secuenciaSimon[i] + '_' + (i + 1)
                await encolarCancion(cancion, PLAYLIST_SIMON)
            }
            //secsTimeout = WEB_DATA.secuenciaSimon.length * 0.6 * 1000 + 5
            setSimonTimer(jugador, 20, true)
            setSimonTimerTurnoJugador(jugador, 11) // 11 segundos para el inicio
            //WEB_DATA.simon_dice_status = 'sds_player'

        } else if (accion === 'select') { // Se captura la secuencia y se compara con la que hace simon
            //WEB_DATA.simon_dice_status = 'sds_player'
            WEB_DATA.secuenciaJugador.push(color)
            for (let i = 0; i < WEB_DATA.secuenciaJugador.length; i++) {
                if (WEB_DATA.secuenciaJugador[i] !== WEB_DATA.secuenciaSimon[i]) {
                    esSecuenciaCorrecta = false
                    break
                }
            }

            let aciertos = WEB_DATA.secuenciaSimon.length

            console.log(now() + ' ' + "[" + jugador + " dice]: " + WEB_DATA.secuenciaJugador)

            if (esSecuenciaCorrecta === false) {
                console.log(now() + ' ' + "[simon dice]: FIN ")
                WEB_DATA.simon_dice_status = 'sds_end'
                setSimonTimer(jugador, 0, true)
            } else {
                // Se ejecuta el color seleccionado por el jugador
                WEB_DATA.simon_dice_status = 'sds_player_color_play'
                setSimonTimer(jugador, WEB_DATA.simon_dice_timeout, true)
                let cancionJ = color + '_' + (WEB_DATA.secuenciaJugador.length + 2)
                await encolarCancion(cancionJ, PLAYLIST_SIMON)
                

                if (WEB_DATA.secuenciaJugador.length === WEB_DATA.secuenciaSimon.length) {
                    WEB_DATA.simon_dice_status = 'sds_ok'
                    secsTimeout = WEB_DATA.secuenciaSimon.length * 0.6 * 1000
                    // Se ejecuta la secuencia de OK
                    await encolarCancion(`simon_dice_ok_${WEB_DATA.secuenciaSimon.length}`, PLAYLIST_SIMON)
                    // Guardar record
                    if (aciertos > WEB_DATA.simon_dice_record.aciertos) {
                        WEB_DATA.simon_dice_record = {
                            jugador: jugador,
                            aciertos: aciertos,
                            fecha: new Date()
                        }
                    }
                    // Secuencia entera correcta
                    WEB_DATA.secuenciaJugador = []
                    WEB_DATA.secuenciaSimon.push(WEB_DATA.colors[colorIndexRandom])
                    console.log(now() + ' ' + "[simon dice]: " + WEB_DATA.secuenciaSimon)
                    WEB_DATA.simon_dice_status = 'sds_simon'
                    // se ejecuta la secuencia de colores entera
                    for (let i = 0; i < WEB_DATA.secuenciaSimon.length; i++) {
                        let cancion = WEB_DATA.secuenciaSimon[i] + '_' + (i + 1)
                        await encolarCancion(cancion, PLAYLIST_SIMON)
                    }
                    WEB_DATA.timeoutIncrement = 10 + 1 * (WEB_DATA.secuenciaSimon.length + 1)
                    //WEB_DATA.timeoutIncrement = 4
                    setSimonTimer(jugador, WEB_DATA.timeoutIncrement, true)
                    setSimonTimerTurnoJugador(jugador, 3 + 0.6 * WEB_DATA.secuenciaSimon.length) // medio segundo por cada color que tiene que sonar

                } else { // Secuencia acertada pero no completa
                    setSimonTimerTurnoJugador(jugador, 0) // micro segundo para que suene lo pulsado
                    // Esperando pulsacion del jugador
                    //WEB_DATA.simon_dice_status = 'sds_player'
                    //WEB_DATA.timeoutIncrement = 4
                }

            }
        } else {
            esSecuenciaCorrecta = false
        }

        return res.status(200).json({ esSecuenciaCorrecta: esSecuenciaCorrecta, cantidadColores: WEB_DATA.secuenciaSimon.length, timeout: secsTimeout })
    }
    catch (e) {
        console.log(now() + ' error post simon ' + e.message)
        let txt = SIMON_SAYS_ERROR_TXT
        fs.appendFileSync(txt, now() + ' ' + e + '\n')
    }
})


function setSimonTimer(jugador, segundos, post) {
    clearTimeout(WEB_DATA.temporizadoresSimon[jugador]);
    WEB_DATA.temporizadoresSimon[jugador] = setTimeout(() => {
        // Acción a realizar cuando se alcanza el timeout
        console.log(now() + ' ' + `Timeout para persona ${jugador}, se cierra su partida porque ha pasado mas de ${segundos} segundos sin recibir una llamada`);

        WEB_DATA.colaInterna = WEB_DATA.colaInterna.filter(elem => elem.query.jugador !== jugador) // Eliminamos al jugador porque se ha desconectado
        WEB_DATA.cancionesCola = WEB_DATA.cancionesCola.filter(elem => elem !== 'Simon dice ' + jugador)
        if (post) { // Se termina una partida del simon

            console.log(now() + ' ' + "[simon dice] Secuencia fallada " + jugador)

            // Grabo el log de puntuacion
            let aciertos = WEB_DATA.secuenciaSimon.length - 1
            let txt = SIMON_SAYS_TXT
            fs.appendFileSync(txt, now() + ' ' + aciertos + ' aciertos ' + ' ' + jugador + '\n')

            WEB_DATA.postSimonTimeout[jugador] = true
            WEB_DATA.secuenciaSimon = []

            // Se ejecuta secuencia de error
            encolarCancion('simon_dice_error', PLAYLIST_SIMON)
        }
        WEB_DATA.timeoutIncrement = 0
        delete WEB_DATA.temporizadoresSimon[jugador]

        //Encolar todas las peticiones hasta el siguiente simon dice
        let reqEncolar
        while (WEB_DATA.colaInterna.length > 0 && (WEB_DATA.colaInterna[0].body.cancion.includes('Simon dice') || WEB_DATA.colaInterna[0].body.cancion.includes('Kahoot'))) {
            reqEncolar = WEB_DATA.colaInterna.shift()
            encolarCancionDedicatoriaPost(reqEncolar)
        }

    }, segundos * 1000); // segundos de timeout
}

function setSimonTimerTurnoJugador(jugador, segundos) {
    clearTimeout(WEB_DATA.temporizadoresSimonTurnoJugador[jugador]);
    WEB_DATA.temporizadoresSimonTurnoJugador[jugador] =setTimeout(() => {
        // Acción a realizar cuando se alcanza el timeout
        console.log(now() + ' ' + `Turno del jugador pasados ${segundos} segundos`);
        // Establece el turno para el jugador
        WEB_DATA.simon_dice_status = 'sds_player'
        delete WEB_DATA.temporizadoresSimonTurnoJugador[jugador]



    }, segundos * 1000); // segundos de timeout
}


app.post('/canciones', async (req, res) => {
    let body = req.body
    let cancion = body.cancion

    // let ahora = new Date();
    // if (ahora.getHours() < 18 || (ahora.getHours() == 18 && ahora.getMinutes() < 30) || (ahora.getHours() == 21 && ahora.getMinutes() > 30) || ahora.getHours() >= 22) {
    //     return res.status(500).json({ response: 'Solo se puede seleccionar canciones de 18:30 a 21:30, ¡Vente a esas horas y disfruta del espectáculo! ;)' })
    // }
    // if (WEB_DATA.cancionesCola.length >= CANCIONES_max)
    //     return res.status(100).json({ response: 'No se pueden añadir más canciones a la cola, hay que esperar a que termine alguna' })   
    // if (WEB_DATA.lengthms >= 5 * 60 * 1000)
    //     return res.status(500).json({ message: 'Ya hay mas de 5 minutos de canciones, hay que esperar a que termine alguna' })


    // Validar si el comentario es inapropiado
    const esInapropiado = await esInapropiadoZPK(body.dedicatoria);

    if (esInapropiado || body.dedicatoria == 'caca')   {
        saveDirectory = `${SHOW_PATH}/secuencias/`
        // Guardo el historico de censuras
        txt = saveDirectory + 'censura.txt'
        fs.appendFileSync(txt, `${now()} ${cancion} - ${body.dedicatoria}\n`)

        // Enviar respuesta con mensaje de error si el comentario es inapropiado
        return res.json({
          success: false,
          message: 'Nos preocupa que una mente inteligente haga este comentario. Lee un libro por favor, sólo uno.',
        });
    }

    WEB_DATA.cancionesCola.push(cancion) // Metemos la cancion en cola para que se muestre en la web
    if (WEB_DATA.cancionesCola.filter(elemCola => elemCola.includes('Simon dice ')).length > 0 || WEB_DATA.cancionesCola.filter(elemCola => elemCola.includes('Kahoot')).length > 0) {
        WEB_DATA.colaInterna.push(req) // Metemos el object de la peticion para hacerla cuando no haya simones en cola
        return
    }

    if (cancion == 'Cumpleaños Feliz') {
        encolarCancionFelizCumplePost(req)    // Validar si el comentario es inapropiado
    } else if (cancion == 'Mensaje del dia') {        
        if (WEB_DATA.cancionesEnProceso.includes(cancion)) {
            return res.json({
                success: false,
                message: 'Ya hay un mensaje del dia en espera.',
            });
        } else {
            encolarCancionMensajeDelDiaPost(req)
        }
        
    } else { encolarCancionDedicatoriaPost(req) }
})

function encolarCancionDedicatoriaPost(req) {
    let body = req.body
    let cancion = body.cancion

    if (!WEB_DATA.canciones.includes(cancion))
        return res.status(500).json({ response: 'La canción no se encuentra en la playlist' })

    WEB_DATA.cancionesEnProceso.push(cancion)

    let dedicatoria = body.dedicatoria != '' ? body.dedicatoria : undefined,
        saveDirectory = `${SHOW_PATH}/secuencias/`,
        fileName,
        imagen = body.imagen ? body.imagen : undefined
    // Guardo el historico de canciones
    txt = saveDirectory + 'canciones.txt'
    fs.appendFileSync(txt, now() + ' ' + cancion + '\n')

    if (dedicatoria /*|| imagen */) {
        if (WEB_DATA.i >= decicatorias_max)
            WEB_DATA.i = 0

        fileName = `dedicatoria${++WEB_DATA.i}`
        let seq = 'secuencias/' + fileName + '.xsq'
        let mp3 = saveDirectory + fileName + '.mp3'
        let jpg = saveDirectory + fileName + '.jpg'
        let txt = saveDirectory + fileName + '.txt'
        console.log(now() + ' ' + 'DEDICATORIA: ' + dedicatoria + '\nARCHIVO: ' + fileName + '\n')
        new gTTS('La siguiente canción tiene esta dedicatoria: ' + dedicatoria, 'es')
            .save(mp3, (err, result) => {
                if (err)
                    return console.log(now() + ' ' + err)
                fs.writeFileSync(txt, dedicatoria.toUpperCase())
                // Guardo el historico de dedicatorias
                txt = saveDirectory + 'dedicatorias.txt'
                fs.appendFileSync(txt, now() + ' ' + dedicatoria + '\n')

                //if (!imagen) {
                //    fs.unlinkSync('');
                //    fs.copyFileSync()
                //}


                // Abro la secuencia
                err = ''
                let action1 = URL_XLIGTHS_COMMAND('openSequence' + '?force=False&seq=' + seq)
                axios.get(action1)
                    .then(() => {
                        // Renderizo
                        let action2 = URL_XLIGTHS_COMMAND('renderAll')
                        axios.get(action2)
                            .then(() => {
                                // Guardo la secuencia
                                let action3 = URL_XLIGTHS_COMMAND('saveSequence')
                                axios.get(action3)
                                    .then(() => {
                                        let action4 = URL_XLIGTHS_COMMAND('closeSequence')
                                        axios.get(action4)
                                            .then(() => {
                                                let action5 = URL_ENQUEUE_SONG(fileName, 'DEDICATORIAS')
                                                axios.post(action5)
                                                    .then(() => {
                                                        console.log(now() + ' ' + 'Dedicatoria añadida: ' + dedicatoria)
                                                        WEB_DATA.cancionesCola.push(cancion)
                                                        WEB_DATA.cancionesEnProceso = WEB_DATA.cancionesEnProceso.filter(c => c != cancion)
                                                        encolarCancion(cancion, PLAYLIST_CANCIONES)
                                                    }) //then5
                                                    .catch(e => {
                                                        console.log(now() + ' ' + 'No se ha podido añadir la secuencia\n' + ':\n ' + e)
                                                        WEB_DATA.cancionesEnProceso = WEB_DATA.cancionesEnProceso.filter(c => c != cancion)
                                                        encolarCancion(cancion, PLAYLIST_CANCIONES)
                                                    }) //catch5
                                            }) //then4
                                            .catch(e => {
                                                console.log(now() + ' ' + 'Error ' + action4 + ':\n ' + e + '\n\n')
                                                WEB_DATA.cancionesEnProceso = WEB_DATA.cancionesEnProceso.filter(c => c != cancion)
                                                encolarCancion(cancion, PLAYLIST_CANCIONES)
                                            }) //catch4
                                    }) //then3
                                    .catch(e => {
                                        console.log(now() + ' ' + 'Error ' + action3 + ':\n ' + e + '\n\n')
                                        WEB_DATA.cancionesEnProceso = WEB_DATA.cancionesEnProceso.filter(c => c != cancion)
                                        encolarCancion(cancion, PLAYLIST_CANCIONES)
                                    }) //catch3
                            }) //then2
                            .catch(e => {
                                console.log(now() + ' ' + 'Error ' + action2 + ':\n ' + e + '\n\n')
                                WEB_DATA.cancionesEnProceso = WEB_DATA.cancionesEnProceso.filter(c => c != cancion)
                                encolarCancion(cancion, PLAYLIST_CANCIONES)
                            }) //catch2
                    }) //then1
                    .catch(e => {
                        console.log(now() + ' ' + 'Error ' + action1 + ':\n ' + e + '\n\n')
                        WEB_DATA.cancionesEnProceso = WEB_DATA.cancionesEnProceso.filter(c => c != cancion)
                        encolarCancion(cancion, PLAYLIST_CANCIONES)
                    }) //catch1
            }); // gTTS de la dedicatoria

        // var waitTill = new Date(new Date().getTime() + 1 * 1000);
        // // while (waitTill > new Date()) { }
        // // console.log(now() + ' ' + 'Waited 1 s')





    } else { // No hay dedicatoria
        WEB_DATA.cancionesEnProceso = WEB_DATA.cancionesEnProceso.filter(c => c != cancion)
        encolarCancion(cancion, PLAYLIST_CANCIONES)
    }
}

function encolarCancionFelizCumplePost(req) {
    let body = req.body
    let cancion = body.cancion

    if (!WEB_DATA.canciones.includes(cancion))
        return res.status(500).json({ response: 'La canción no se encuentra en la playlist' })

    WEB_DATA.cancionesEnProceso.push(cancion)

    let dedicatoria = body.dedicatoria != '' ? body.dedicatoria : undefined,
        saveDirectory = `${SHOW_PATH}/secuencias/`,
        fileName
    // Guardo el historico de canciones
    txt = saveDirectory + 'canciones.txt'
    fs.appendFileSync(txt, now() + ' ' + cancion + '\n')

    if (dedicatoria) {

        fileName = `Happy Birthday`
        let seq = 'secuencias/' + fileName + '.xsq'
        let txt = saveDirectory + fileName + '.txt'
        console.log(now() + ' ' + 'Cumpleaños Feliz: ' + dedicatoria + '\nARCHIVO: ' + fileName + '\n')

        fs.writeFileSync(txt, dedicatoria.toUpperCase())
        // Guardo el historico de dedicatorias
        txt = saveDirectory + 'dedicatorias.txt'
        fs.appendFileSync(txt, now() + ' (Cumpleaños Feliz) ' + dedicatoria + '\n')


        // Abro la secuencia
        err = ''
        let action1 = URL_XLIGTHS_COMMAND('openSequence' + '?force=False&seq=' + seq)
        axios.get(action1)
            .then(() => {
                // Renderizo
                let action2 = URL_XLIGTHS_COMMAND('renderAll')
                axios.get(action2)
                    .then(() => {
                        // Guardo la secuencia
                        let action3 = URL_XLIGTHS_COMMAND('saveSequence')
                        axios.get(action3)
                            .then(() => {
                                let action4 = URL_XLIGTHS_COMMAND('closeSequence')
                                axios.get(action4)
                                    .then(() => {
                                        WEB_DATA.cancionesCola.push(cancion)
                                        WEB_DATA.cancionesEnProceso = WEB_DATA.cancionesEnProceso.filter(c => c != cancion)
                                        encolarCancion(cancion, PLAYLIST_CANCIONES)
                                    })//then 4
                                    .catch(e => {
                                        console.log(now() + ' ' + 'Error ' + action4 + ':\n ' + e + '\n\n')
                                        WEB_DATA.cancionesEnProceso = WEB_DATA.cancionesEnProceso.filter(c => c != cancion)
                                        encolarCancion(cancion, PLAYLIST_CANCIONES)
                                    }) //catch4
                            }) //then3
                            .catch(e => {
                                console.log(now() + ' ' + 'Error ' + action3 + ':\n ' + e + '\n\n')
                                WEB_DATA.cancionesEnProceso = WEB_DATA.cancionesEnProceso.filter(c => c != cancion)
                                encolarCancion(cancion, PLAYLIST_CANCIONES)
                            }) //catch3
                    }) //then2
                    .catch(e => {
                        console.log(now() + ' ' + 'Error ' + action2 + ':\n ' + e + '\n\n')
                        WEB_DATA.cancionesEnProceso = WEB_DATA.cancionesEnProceso.filter(c => c != cancion)
                        encolarCancion(cancion, PLAYLIST_CANCIONES)
                    }) //catch2
            }) //then1
            .catch(e => {
                console.log(now() + ' ' + 'Error ' + action1 + ':\n ' + e + '\n\n')
                WEB_DATA.cancionesEnProceso = WEB_DATA.cancionesEnProceso.filter(c => c != cancion)
                encolarCancion(cancion, PLAYLIST_CANCIONES)
            }) //catch1


        // var waitTill = new Date(new Date().getTime() + 1 * 1000);
        // // while (waitTill > new Date()) { }
        // // console.log(now() + ' ' + 'Waited 1 s')

    } else { // No hay dedicatoria
        WEB_DATA.cancionesEnProceso = WEB_DATA.cancionesEnProceso.filter(c => c != cancion)
        encolarCancion(cancion, PLAYLIST_CANCIONES)
    }
}

function encolarCancionMensajeDelDiaPost(req) {
    let body = req.body
    let cancion = body.cancion

    WEB_DATA.cancionesEnProceso.push(cancion)

    let dedicatoria = body.dedicatoria != '' ? body.dedicatoria : undefined,
        saveDirectory = `${SHOW_PATH}/secuencias/`,
        fileName
    // Guardo el historico de canciones
    txt = saveDirectory + 'Mensaje del dia.txt'
    fs.appendFileSync(txt, now() + ' ' + cancion + '\n')

    if (dedicatoria) {

        fileName = `Mensaje del dia`
        let seq = 'secuencias/' + fileName + '.xsq'
        let txt = saveDirectory + fileName + '.txt'
        console.log(now() + ' ' + 'Mensaje del dia: ' + dedicatoria + '\nARCHIVO: ' + fileName + '\n')

        fs.writeFileSync(txt, dedicatoria.toUpperCase())
        // Guardo el historico de dedicatorias
        txt = saveDirectory + 'dedicatorias.txt'
        fs.appendFileSync(txt, now() + ' (Mensaje del dia) ' + dedicatoria + '\n')


        // Abro la secuencia
        err = ''
        let action1 = URL_XLIGTHS_COMMAND('openSequence' + '?force=False&seq=' + seq)
        axios.get(action1)
            .then(() => {
                // Renderizo
                let action2 = URL_XLIGTHS_COMMAND('renderAll')
                axios.get(action2)
                    .then(() => {
                        // Guardo la secuencia
                        let action3 = URL_XLIGTHS_COMMAND('saveSequence')
                        axios.get(action3)
                            .then(() => {
                                let action4 = URL_XLIGTHS_COMMAND('closeSequence')
                                axios.get(action4)
                                    .then(() => {
                                        WEB_DATA.cancionesCola.push(cancion)
                                        WEB_DATA.cancionesEnProceso = WEB_DATA.cancionesEnProceso.filter(c => c != cancion)
                                        encolarCancion(cancion, PLAYLIST_OTRAS)
                                    })//then 4
                                    .catch(e => {
                                        console.log(now() + ' ' + 'Error ' + action4 + ':\n ' + e + '\n\n')
                                        WEB_DATA.cancionesEnProceso = WEB_DATA.cancionesEnProceso.filter(c => c != cancion)
                                        encolarCancion(cancion, PLAYLIST_OTRAS)
                                    }) //catch4
                            }) //then3
                            .catch(e => {
                                console.log(now() + ' ' + 'Error ' + action3 + ':\n ' + e + '\n\n')
                                WEB_DATA.cancionesEnProceso = WEB_DATA.cancionesEnProceso.filter(c => c != cancion)
                                encolarCancion(cancion, PLAYLIST_OTRAS)
                            }) //catch3
                    }) //then2
                    .catch(e => {
                        console.log(now() + ' ' + 'Error ' + action2 + ':\n ' + e + '\n\n')
                        WEB_DATA.cancionesEnProceso = WEB_DATA.cancionesEnProceso.filter(c => c != cancion)
                        encolarCancion(cancion, PLAYLIST_OTRAS)
                    }) //catch2
            }) //then1
            .catch(e => {
                console.log(now() + ' ' + 'Error ' + action1 + ':\n ' + e + '\n\n')
                WEB_DATA.cancionesEnProceso = WEB_DATA.cancionesEnProceso.filter(c => c != cancion)
                encolarCancion(cancion, PLAYLIST_OTRAS)
            }) //catch1


        // var waitTill = new Date(new Date().getTime() + 1 * 1000);
        // // while (waitTill > new Date()) { }
        // // console.log(now() + ' ' + 'Waited 1 s')

    } else { // No hay dedicatoria
        WEB_DATA.cancionesEnProceso = WEB_DATA.cancionesEnProceso.filter(c => c != cancion)
        encolarCancion(cancion, PLAYLIST_OTRAS)
    }
}



async function encolarCancion(cancion, playlist) {
    if (!playlist) { playlist = PLAYLIST_CANCIONES }
    // var playlist = !esSimon ? PLAYLIST_CANCIONES : PLAYLIST_SIMON
    try {
        // WEB_DATA.cancionesEnProceso = [] //WEB_DATA.cancionesEnProceso.filter(c => c != cancion)

        let action1 = URL_ENQUEUE_SONG(cancion, playlist)
        await axios.post(action1)
        if (playlist != PLAYLIST_SIMON) {
            console.log(now() + ' ' + 'Canción añadida a la cola: ' + cancion)
        }
        // // Paro el background
        // let action2 = URL_CLEAR_BACKGROUND
        // axios.post(action2)
        //     .then(() => console.log(now() + ' ' + 'Parado el background: ' + action2))
        //     .catch(e => res.status(500).json({ response: 'No se han podido parar las animaciones: ' + e }))


        // let action3 = URL_SET_VOLUME(50)
        // axios.post(action3)
        //     .then(() => console.log(now() + ' ' + 'Volumen al 50: ' + action3))
        //     .catch(e => res.status(500).json({ response: 'No se ha podido modificar volumen: ' + e }))
    } catch (error) {
        console.log(now() + ' ' + 'Error encolando cancion : ' + error);
    }

}

async function encolarCancionYEsperar(cancion, playlist) {
    await encolarCancion(cancion, playlist)
    while (WEB_DATA.sonando_real != cancion) {
        await axios.get(URL_GET_PLAYING_STATUS)
            .then(resData2 => {
                if (resData2.data.status == 'idle') {
                    WEB_DATA.sonando_real = ''
                }
                else {
                    WEB_DATA.sonando_real = resData2.data.step
                }
            })
            .catch(err => { console.log(now() + ' ' + err) })
    }
    while (WEB_DATA.sonando_real === cancion || WEB_DATA.cancionesCola.indexOf(cancion) != -1) {
        await axios.get(URL_GET_PLAYING_STATUS)
            .then(resData2 => {
                if (resData2.data.status == 'idle') {
                    WEB_DATA.sonando_real = ''
                }
                else {
                    WEB_DATA.sonando_real = resData2.data.step
                }
            })
            .catch(err => { console.log(now() + ' ' + err) })
    }
}

app.get('/renderall', (req, res) => {

    renderSongsFromArray([
        'secuencias/All I Want For Christmas is You.xsq',
        'secuencias/Animacion1.xsq',
        'secuencias/Animacion2.xsq',
        'secuencias/Animacion3.xsq',
        'secuencias/Animacion4.xsq',
        'secuencias/Animacion5.xsq',
        'secuencias/Animacion6.xsq',
        'secuencias/Animacion7.xsq',
        'secuencias/Animacion8.xsq',
        'secuencias/Animacion9.xsq',
        'secuencias/Animacion10.xsq',
        'secuencias/Animacion11.xsq',
        'secuencias/AnimacionBTC.xsq',
        'secuencias/Campanadas.xsq',
        'secuencias/Cant stop the feeling.xsq',
        'secuencias/Christmas Tecno Mix.xsq',
        'secuencias/Crystalize - Christmas on Runway.xsq',
        'secuencias/Cuento de navidad.xsq',
        'secuencias/Cumpleaños Feliz.xsq',
        'secuencias/dedicatoria1.xsq',
        'secuencias/dedicatoria2.xsq',
        'secuencias/dedicatoria3.xsq',
        'secuencias/El Tamborilero - Rafael.xsq',
        'secuencias/Frosty the Snowman.xsq',
        'secuencias/Happy Christmas.xsq',
        'secuencias/Here Comes Santa Claus.xsq',
        'secuencias/Inicio Show.xsq',
        'secuencias/Let It Snow.xsq',
        'secuencias/Los peces en el rio.xsq',
        'secuencias/Michael Jackson Mix.xsq',
        'secuencias/Noche de paz.xsq',
        'secuencias/Blanca Navidad - La Oreja de Van Gogh.xsq',
        'secuencias/Pentatonix Carol of the bells.xsq',
        'secuencias/Phineas and Ferb - Winter Vacation.xsq',
        'secuencias/Ping Pong Christmas.xsq',
        'secuencias/Show830.xsq',
        'secuencias/Star Wars.xsq'
    ])
    return res.status(500).json({ response: 'Renderizando' })
})

app.get('/comentarios', (req, res) => {
    let comentarios = fs.readFileSync(FILE_COMENTARIOS, { encoding: 'utf-8' })
    comentarios = comentarios.split(SEPARADOR)
    let comentariosValidados = []
    comentarios.forEach(c => {
        let err = false
        try {
            c = JSON.parse(c)
            // console.log(c)
            for (let property in c) {
                if (property !== 'nombre' && property !== 'comentario' && property !== 'estrellas' && property !== 'date')
                    err = true
                if (property === 'estrellas' && parseInt(c[property]) > 5)
                    c[property] = '5'
            }
        } catch (error) { err = true }

        if (!err)
            comentariosValidados.push(c)
    })
    // console.log(now() + ' ' + comentariosValidados)
    res.json({ comentarios: comentariosValidados })
})

//app.post('/comentarios', (req, res) => {
    // console.log(now() + ' ' + req.body)
//    let request = req.body
//    request.date = new Date()
//    fs.appendFileSync(FILE_COMENTARIOS, JSON.stringify(request) + SEPARADOR)
//    res.redirect(`http://micasasevedelejos.tudelanicos.com:31500/xScheduleWeb/comentarios.html`)
//})


app.post('/comentarios', async (req, res) => {
    let request = req.body;
    const comentario = request.comentario;

    try {
        // Validar si el comentario es inapropiado
        const esInapropiado = await esInapropiadoZPK(comentario);
    
        if (esInapropiado )   {
            saveDirectory = `${SHOW_PATH}/secuencias/`
            // Guardo el historico de censuras
            txt = saveDirectory + 'censura.txt'
            fs.appendFileSync(txt, `${now()} Comentarios - ${comentario}\n`)

            // Enviar respuesta con mensaje de error si el comentario es inapropiado
            return res.json({
            success: false,
            message: 'Nos preocupa que una mente inteligente haga este comentario. Lee un libro por favor, sólo uno.',
            });
        }
        
    
        // Guardar el comentario si es válido
        request.date = new Date();
        fs.appendFileSync(FILE_COMENTARIOS, JSON.stringify(request) + SEPARADOR);
    
        // Enviar respuesta de éxito
        res.json({
          success: true,
          message: 'Tu comentario ha sido enviado correctamente.',
        });


    } catch (error) {
      console.error('Error procesando el comentario:', error.message);
      res.status(500).send('Hubo un error al procesar tu comentario.');
    }
  });

app.get('/kahoot', async (req, res) => {
    const { jugador } = req.body

    setKahootTimeout(jugador)

    return res.status(200).json({
        status: WEB_DATA.kahootEstado,
        pregunta: WEB_DATA.kahootPreguntasElegidas[WEB_DATA.kahootPreguntaIndex].pregunta,
        respuestas: WEB_DATA.kahootPreguntasElegidas[WEB_DATA.kahootPreguntaIndex].respuestas,
        hanRespondido: WEB_DATA.kahootJugadoresRespondido,
    })
})

app.post('/kahoot', async (req, res) => {
    let { jugador, respuesta } = req.body

    // El jugador ya a respondido
    if (WEB_DATA.kahootJugadoresRespondido.filter(jug => jug !== jugador) > 0) {
        return
    }

    if (respuesta === WEB_DATA.kahootPreguntasElegidas[WEB_DATA.kahootPreguntaIndex].solucion) {
        WEB_DATA.kahootJugadores.find(jug === jug.nombre === jugador).puntuacion += 10 - WEB_DATA.kahootJugadoresRespondido.length
    }
    WEB_DATA.kahootJugadoresRespondido.push(jugador)
})

app.post('/kahoot/nuevo-jugador', async (req, res) => {
    // Si la partida no esta creada se crea
    if (WEB_DATA.kahootEstado === '') {

    }
    // Si la partida esta en curso
    const { nombreJugador } = req.body

    if (!WEB_DATA.kahootEstado.includes['waitingPlayers', 'queue']) {
        return res.status(503).json({error: "No se puede unir mientras hay una partida activa"})
    }
    // Si el jugador ya existe
    if (WEB_DATA.kahootJugadores.filter(jug => jug.nombre === nombreJugador) > 0) {
        return res.status(409).json({error: "Ese nombre ya existe en la partida, por favor, selecciona otro nombre para jugar"})
    }
    
    let jugador = {nombre: nombreJugador, puntuacion: 0}
    WEB_DATA.kahootJugadores.push(jugador)
    setKahootTimeout(jugador.nombre)
})

function setKahootTimeout(jugador) {
    clearTimeout(WEB_DATA.kahootTimeouts[jugador])
    WEB_DATA.kahootTimeouts[jugador] = setTimeout(() => {
        // Si da timeout y esta en el estado de cola, esperando jugadores o el juego parado se quita al jugador
        if (WEB_DATA.kahootEstado.includes(['queue', 'waitingPlayers', ''])) {
            WEB_DATA.kahootJugadores = WEB_DATA.kahootJugadores.filter(jug => jugador !== jug.nombre)
            // Si no hay jugadores después de eliminarlo se reincian las variables
            if (WEB_DATA.kahootJugadores.length <= 0) {
                finalizarKahoot()
            }
        }
    }, 3000)
}

app.get('/kahoot/inicio', async (req, res) => {
    if (WEB_DATA.kahootEstado != 'waiting' && WEB_DATA.kahootEstado != 'waitingPlayers') {
        return;
    }

    encolarCancion(kahootSecuencias.inicio, PLAYLIST_KAHOOT)
    WEB_DATA.kahootJugadores.forEach(async (jug, index) => {
        jug.color = kahootColores[index]
        let secuenciaJugador = `inicio_${jug.color}`
        fs.writeFileSync(`${SHOW_PATH}/secuencias/kahoot/jugador_${jug.color}.txt`, jug.nombre)
        renderizarEncolarKahoot(kahootSecuencias[secuenciaJugador])
    })
    
    buclePreguntasKahoot()
})

function buclePreguntasKahoot() {
    if (kahootPreguntasMax <= WEB_DATA.kahootPreguntaIndex) { // If para finalizar el bucle y el show
        encolarCancion(kahootSecuencias.fin, PLAYLIST_KAHOOT)

        // Determinar la puntuación más alta
        const maxPuntuacion = Math.max(...WEB_DATA.kahootJugadores.map(jugador => jugador.puntuacion));
        // Filtrar los jugadores con la puntuación más alta
        const ganadores = WEB_DATA.kahootJugadores.filter(jugador => jugador.puntuacion === maxPuntuacion);

        ganadores.forEach(jug => {
            let secuenciaJugadorFin = `fin_${jug.color}`
            renderizarEncolarKahoot(kahootSecuencias[secuenciaJugadorFin])
        })
        WEB_DATA.kahootEstado = 'quit'
        setTimeout(finalizarKahoot, 10000)
        return
    }
    WEB_DATA.kahootEstado = 'running'

    let puntuacionesStr = ''
    WEB_DATA.kahootJugadores.forEach(jug => puntuacionesStr += `${jug.nombre}: ${jug.puntuacion}\n`)
    fs.writeFileSync(`${SHOW_PATH}/secuencias/kahoot/puntuaciones.txt`, puntuacionesStr)
    renderizarEncolarKahoot(kahootSecuencias.cambio)

    let preguntaActual = WEB_DATA.kahootPreguntasElegidas[WEB_DATA.kahootPreguntaIndex]
    fs.writeFileSync(`${SHOW_PATH}/secuencias/kahoot/pregunta.txt`, preguntaActual.pregunta)
    preguntaActual.respuestas.forEach((respuesta, index) => {
        let letras = ['A','B','C','D']
        fs.writeFileSync(`${SHOW_PATH}/secuencias/kahoot/pregunta_${letras[index]}.txt`, respuesta)
    })
    fs.writeFileSync(`${SHOW_PATH}/secuencias/kahoot/pregunta_respuesta.txt`, preguntaActual.solucion)
    renderizarEncolarKahoot(kahootSecuencias.pregunta)

    WEB_DATA.kahootInterval = setInterval(async () => {
        let secuenciaSonando = (await axios.get(URL_GET_PLAYING_STATUS)).data.step
        if (secuenciaSonando === kahootSecuencias.pregunta) {
            clearInterval(WEB_DATA.kahootInterval)
            WEB_DATA.kahootEstado = 'waitingAnwers'
            // Seteamos un Timeout de 10 segundos (tiempo para responder) para que renderize las puntuaciones y la siguiente pregunta
            setTimeout(() => {
                WEB_DATA.kahootPreguntaIndex++
                WEB_DATA.kahootJugadoresRespondido = []
                buclePreguntasKahoot()
            }, 10 * 1000)
        }
    }, 500)
}

function finalizarKahoot() {
    reiniciarKahootVariables()
    if (WEB_DATA.sonando.includes("Kahoot")) {
        encolarHastaJuego()
        WEB_DATA.cancionesCola.shift()
    }
}

function renderizarEncolarKahoot(secuencia) {
    renderizarCancion(`secuencias/kahoot/${secuencia}.fseq`)
    encolarCancion(secuencia, PLAYLIST_KAHOOT)
}

// Temporizador para poner ANIMACIONES
function startBackground() {
    //console.log(now() + ' ' + 'Background timer')
    // Busco el estado del Scheduler
    axios.get(URL_GET_PLAYING_STATUS)
        .then(resData => {
            if (resData.data.status == 'idle' && WEB_DATA.secuenciaSimon.length <= 0) {
                // Pongo las animaciones
                let action = URL_SET_BACKGROUND(PLAYLIST_ANIMACIONES)
                axios.post(action)
                    .then(() => { })
                    .catch(e => res.status(500).json({ response: 'No se han podido parar las animaciones: ' + e }))
            }

        })
        .catch(err => { console.log(now() + ' ' + err) })

}

// Temporizador para poner Agradecimientos
function startAgradecimientos() {
    //console.log(now() + ' ' + 'Background timer')

    if (WEB_DATA.secuenciaSimon.length > 0) { return }

    // Pongo los agradecimientos con volumen 0 cuando estamos fuera de horario
    setVolumenFueraDeHora(0)
    encolarCancion('Inicio Show', PLAYLIST_OTRAS)
    encolarCancion('Agradecimientos', PLAYLIST_OTRAS)
    encolarCancion('Mensaje del dia', PLAYLIST_OTRAS)
}



// Temporizador para ver cancion sonando, y modificar colas
async function procesaColas() {

    axios.get(URL_GET_QUEUED_STEPS)
        .then(resData => {
            axios.get(URL_GET_PLAYING_STATUS)
                .then(resData2 => {
                    if (resData2.data.status == 'idle') {
                        WEB_DATA.sonando = ''
                        WEB_DATA.progreso = 100
                    }
                    else {
                        WEB_DATA.sonando = '    ' + resData2.data.step + ' ' + resData2.data.left.substring(0, resData2.data.left.indexOf('.', 0))
                        WEB_DATA.progreso = ~~(resData2.data.positionms / resData2.data.lengthms * 100)
                    }
                    WEB_DATA.sonando_real = WEB_DATA.sonando
                    if (WEB_DATA.sonando.includes('simon_dice_')) {
                        WEB_DATA.sonando = ''
                        WEB_DATA.progreso = 0
                    }

                    WEB_DATA.lengthms = 0
                    resData.data.steps.forEach(element => {
                        WEB_DATA.lengthms = WEB_DATA.lengthms + parseInt(element.lengthms)
                    });

                    //WEB_DATA.cancionesCola = resData.data.steps.map(step => step.name)
                    WEB_DATA.cancionesSeleccionables = WEB_DATA.canciones.filter(can => !WEB_DATA.cancionesCola.includes(can))
                    WEB_DATA.cancionesSeleccionables = WEB_DATA.cancionesSeleccionables.filter(can => !WEB_DATA.cancionesEnProceso.includes(can))
                    WEB_DATA.cancionesCola = WEB_DATA.cancionesCola.filter(can => !(can == resData2.data.step))

                    WEB_DATA.cancionesColaParaWeb = Array.from(WEB_DATA.cancionesCola)
                    if (WEB_DATA.cancionesCola.length > 0) {

                        if ((WEB_DATA.cancionesCola[0].includes("Simon dice ") || WEB_DATA.cancionesCola[0].includes("Kahoot")) && WEB_DATA.sonando == '') {
                            // Hay un simon dice jugando
                            WEB_DATA.sonando = WEB_DATA.cancionesCola[0]
                            WEB_DATA.progreso = 0
                            WEB_DATA.cancionesColaParaWeb.shift()
                            if (WEB_DATA.sonando.includes('Kahoot') && WEB_DATA.kahootEstado === 'queue') { 
                                WEB_DATA.kahootEstado === 'waitingPlayers' 
                            }   
                        }
                    }
                })
                .catch(err => { console.log(now() + ' ' + err) })
        })
        .catch(err => { })

}

function encolarHastaJuego() {
    let reqEncolar
    while (WEB_DATA.colaInterna.length > 0 && (WEB_DATA.colaInterna[0].body.cancion.includes('Simon dice') || WEB_DATA.colaInterna[0].body.cancion.includes('Kahoot'))) {
        reqEncolar = WEB_DATA.colaInterna.shift()
        encolarCancionDedicatoriaPost(reqEncolar)
    }
}

function renderizarCancion(cancion) {
    let action1 = URL_XLIGTHS_COMMAND('openSequence' + '?force=False&seq=' + cancion)
    console.log(now() + ' ' + action1)
    axios.get(action1)
        .then(r => {
            // Renderizo
            let action2 = URL_XLIGTHS_COMMAND('renderAll')
            console.log(now() + ' ' + action2)
            axios.get(action2)
                .then(r => {
                    // Guardo la secuencia
                    let action3 = URL_XLIGTHS_COMMAND('saveSequence')
                    console.log(now() + ' ' + action3)
                    axios.get(action3)
                        .then(r => {
                            let action4 = URL_XLIGTHS_COMMAND('closeSequence')
                            return axios.get(action4)
                                .then(console.log(now() + ' ' + 'Cerrada'))
                                .catch(e => {
                                    console.log(now() + ' ' + 'Error ' + action4 + ':\n ' + e + '\n\n')
                                })
                        })
                        .catch(e => {
                            console.log(now() + ' ' + 'Error ' + action3 + ':\n ' + e + '\n\n')
                        })
                })
                .catch(e => {
                    console.log(now() + ' ' + 'Error ' + action2 + ':\n ' + e + '\n\n')
                })
        })
        .catch(e => {
            console.log(now() + ' ' + 'Error ' + action1 + ':\n ' + e + '\n\n')
        })
}

async function renderizarCancion_async(cancion) {
    let action1 = URL_XLIGTHS_COMMAND('openSequence' + '?force=False&seq=' + cancion)
    console.log(now() + ' ' + action1)
    await axios.get(action1)
    let action2 = URL_XLIGTHS_COMMAND('renderAll')
    console.log(now() + ' ' + action2 + ' ' + cancion)
    await axios.get(action2)
    let action3 = URL_XLIGTHS_COMMAND('saveSequence')
    console.log(now() + ' ' + action3 + ' ' + cancion)
    await axios.get(action3)
    let action4 = URL_XLIGTHS_COMMAND('closeSequence')
    console.log(now() + ' ' + action4 + ' ' + cancion)
    await axios.get(action4)
}

const renderSongsFromArray = songsNameArray => {
    if (songsNameArray.length <= 0)
        return

    renderizarCancion_async(songsNameArray[0])
        .then(() => {
            songsNameArray.shift() // Eliminamos el primer valor del array
            renderSongsFromArray(songsNameArray)
        })
}

function mapListByParam(list, params) {
    let paramsSplitted = params.split('.')
    if (paramsSplitted.length > 1) {
        return mapListByParam(
            list.map(elem => elem[paramsSplitted[0]]).filter(elem => elem !== undefined),
            paramsSplitted.filter((value, index) => index !== 0).join('.')
        )
    } else {
        return list.map(elem => elem[params[0]]).filter(elem => elem !== undefined)
    }
}

// Encolamos canciones cada 1 segundo por si se han quedado paradas
/*setInterval(() => {
    axios.get(URL_GET_QUEUED_STEPS)
        .then(resData => {
            axios.get(URL_GET_PLAYING_STATUS)
                .then(resData2 => {

                    var cancionSonando = resData2.data.step
                    encolarCancion(elementoCola)

                    var elementoColaInterna = WEB_DATA.colaInterna.map(elem => elem.body.cancion)
                    // Encolamos solo hasta que nos encontremos un simon, que con el map el elemento se quedara en undefined
                    for (let elementoCola in elementoColaInterna) {
                        if (elementoCola === undefined ) {
                            return
                        }
                    }
                
                    //WEB_DATA.cancionesCola = resData.data.steps.map(step => step.name)
                    WEB_DATA.cancionesSeleccionables = WEB_DATA.canciones.filter(can => !WEB_DATA.cancionesCola.includes(can))
                    WEB_DATA.cancionesSeleccionables = WEB_DATA.cancionesSeleccionables.filter(can => !WEB_DATA.cancionesEnProceso.includes(can))
                })
                .catch(err => { console.log(now() + ' ' + err) })
        })
        .catch(err => { })
}, 1000)*/

function LeeRecordSimonDice() {
    const fs = require('fs');

    // Ruta del archivo de texto
    const filePath = SIMON_SAYS_TXT;

    // Lee el archivo de texto
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo:', err);
            return;
        }

        // Divide el contenido del archivo por líneas
        const lines = data.trim().split('\n');

        let maxAciertos = 0; // Valor inicial para encontrar el máximo
        let jugador = ''
        let fecha = ''


        // Itera sobre cada línea del archivo
        lines.forEach(line => {
            // Busca el número antes de 'aciertos' en la línea usando la expresión regular
            const logg = line.substring(68, 70);
            const aciertos = parseInt(logg);

            // console.log(now() + ' ' + `[leeRecordSimonDice]: Linea ${line} - Aciertos ${aciertos}`)

            // Comprueba si el valor actual de logg es mayor que el máximo encontrado hasta ahora
            if (!isNaN(aciertos) && aciertos > maxAciertos) {
                maxAciertos = aciertos;
                const startIndex = line.indexOf("aciertos  ");
                jugador = line.substring(startIndex + "aciertos  ".length).trim();
                fecha = line.substring(0, 25).trim();
            }
        });

        if (maxAciertos === 0) {
            console.log(now() + ' ' + '[leeRecordSimonDice]: No se encontró ningún valor de log en el archivo.');
        } else {
            console.log(now() + ' ' + '[leeRecordSimonDice]: El record de Simon Dice es:', maxAciertos, 'y fue', jugador);
            WEB_DATA.simon_dice_record = {
                jugador: jugador,
                aciertos: maxAciertos,
                fecha: fecha
            }
        }
    });

}

const fetch = require('node-fetch'); // Para realizar solicitudes HTTP
//const fs = require('fs'); // Para interactuar con el sistema de archivos

// Función para obtener la cotización de BTC desde Coinbase y guardarla en un archivo
async function obtenerBTCdeCoinbase() {
    try {
        // URL de la API de Coinbase para obtener la cotización actual de BTC en USD
        const url = 'https://api.coinbase.com/v2/prices/BTC-USD/spot';

        // Solicitud a la API
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.statusText}`);
        }

        // Parsear la respuesta JSON
        const data = await response.json();

        // Extraer el precio de BTC en USD
        let precioBTC = parseFloat(data.data.amount);
        
        // Formatear el precio sin decimales y con separador de miles
        precioBTC = Math.round(precioBTC).toLocaleString('es-ES');
        
        // Formatear el contenido a guardar
        const contenido = `Cotización de BTC: ${precioBTC} $\n`;

        // Escribir la cotización en el archivo AnimacionBTC.txt
        fs.writeFileSync(FILE_ANIMACION_BTC, contenido, 'utf8');

        console.log(now() + ' ' + `Cotización de BTC ${precioBTC} $ guardada en AnimacionBTC.txt`);

        renderizarCancion('secuencias/AnimacionBTC.fseq')
    } catch (error) {
        console.log(now() + ' ' + `Error obteniendo la cotización de BTC: ${error.message}`);
    }
}


app.listen(port, () => {
    axios.get(URL_GET_PLAYLIST_STEPS)
        .then(res => WEB_DATA.canciones = res.data.steps.map(step => step.name))
        .catch(err => console.log(now() + ' ' + err))
    console.log(now() + ' ' + `Marin Falcon app STARTED and listening on http://${BASE_URL(port)}`)
    console.log(now() + ' ' + `Página de canciones: http://${BASE_URL()}/xScheduleWeb/index.html`)

    LeeRecordSimonDice()

    setInterval(startBackground, 5000);
    setInterval(startAgradecimientos, 30 * 60 * 1000);
    setInterval(procesaColas, 500);
    // setInterval(obtenerBTCdeCoinbase, 15 * 60 * 1000);
})
