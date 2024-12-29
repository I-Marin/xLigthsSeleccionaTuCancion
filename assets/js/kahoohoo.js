const kahoohooDisponible = true // Si esta a true funciona la pagina normal, sino se pone que no esta disponible

const $botonesCont = document.getElementById('botones-cont')
const $colaCont = document.getElementById('cola-canciones-cont')
const $msg = document.getElementById('msg')
const $recordAciertos = document.getElementById('record-aciertos')
const $recordJugador = document.getElementById('record-jugador')
const $body = document.getElementById('body')
const URL_kahoohoo_GET = (jugador, nuevaPartida) => `http://${BASE_URL('3000')}/kahoohoo?jugador=${jugador}&nuevaPartida=${nuevaPartida}`
const URL_kahoohoo_POST = `http://${BASE_URL('3000')}/kahoohoo`

const KAHOOHOO_DATA = {}
KAHOOHOO_DATA.estadoEnCola = ''
KAHOOHOO_DATA.estadoKahoohoo = ''
KAHOOHOO_DATA.longitudSecuencia = 1
KAHOOHOO_DATA.numeroSecuenciaActual = 1
KAHOOHOO_DATA.start = true

KAHOOHOO_DATA.jugador = prompt('Bienvenido al Juego de preguntas navideño, por favor, introduce tu nombre:')
if (!KAHOOHOO_DATA.jugador || KAHOOHOO_DATA.jugador.trim() === '') { location.href = 'index.html'; }
else {
    desactivarBotones(true)
    getKahoohoo(true)
        .then(data => { // Iniciamos la partida y comprobamos si tiene el mismo nombre que otro jugador
            if (data.error) {
                alert(data.error)
                location.href = 'index.html'; // redireccionamos a la pagina principal
                return
            }
        })
        .catch(e => console.log(e))

    // Intervalo para sepamos si el usuario esta activo o no y su estado en la cola
    setInterval(async () => {
        var { status, kho } = await getKahoohoo(false)
        KAHOOHOO_DATA.estadoEnCola = status
        KAHOOHOO_DATA.estadoKahoohoo = kho

        if (status === 'quit') {
            location.href = 'index.html'
            return
        }

        if (KAHOOHOO_DATA.estadoEnCola === 'running') {
            $msg.setAttribute("style", "display: none;")
        }

        if (KAHOOHOO_DATA.estadoKahoohoo == 'kho_player' || KAHOOHOO_DATA.estadoKahoohoo == 'kho_player_color_play') {
            activarBotones()
        } else { desactivarBotones() }
    }, 500)
}


async function getKahoohoo(nuevaPartida) {
    try {
        var res = await fetch(URL_kahoohoo_GET(KAHOOHOO_DATA.jugador, nuevaPartida))
        var data = await res.json()

        if (data.error) {
            console.error(data.error)
        }
        return data
    } catch (e) {
        console.log(e)
        return new Promise()
    }
}

function postKahoohoo(respuesta) {
    var url = URL_kahoohoo_POST,
    params = {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify({
            accion: accion,
            respuesta: respuesta,
            jugador: KAHOOHOO_DATA.jugador
        }),
        headers: { 'Content-Type': 'application/json' },
    }

    var request = new Request(url, params)

    fetch(request)
        .then(data => data.json()
            .then(data => {
                let { timeout } = data
                if (timeout !== null) {
                    desactivarBotones(false)
                    setTimeout(activarBotones, timeout)
                }
            }))
        .catch(err => console.log(err))
}

function activarBotones() {
    $colaCont.setAttribute("style", "display: none;")
    $botonesCont.removeAttribute("style")
}

function desactivarBotones(activarCola) {
    if (activarCola) {
        $colaCont.removeAttribute("style")
    }
    $botonesCont.setAttribute("style", "display: none;")
}

function seleccionarRespuesta(boton) {
    desactivarBotones(false)
    postKahoohoo('select', boton.getAttribute("id"))
    //setTimeout(activarBotones, 250) // Activamos los botones una vez ejecutada la secuencia del color
}