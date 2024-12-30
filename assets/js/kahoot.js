const kahootDisponible = true // Si esta a true funciona la pagina normal, sino se pone que no esta disponible

const $botones_contestar = document.getElementById('botones_contestar')
const $cola_canciones   = document.getElementById('cola-canciones-cont')
const $msg = document.getElementById('msg')
const $start_button= document.getElementById('start-button')
const $recordAciertos = document.getElementById('record-aciertos')
const $recordJugador = document.getElementById('record-jugador')
const $body = document.getElementById('body')
const URL_KAHOOT_ESTADO_GET = (jugador) => `http://${BASE_URL('3000')}/kahoot?jugador=${jugador}`
const URL_KAHOOT_INICIAR_PARTIDA_GET = `http://${BASE_URL('3000')}/kahoot/inicio`
const URL_KAHOOT_NUEVO_JUGADOR_POST = `http://${BASE_URL('3000')}/kahoot/nuevo-jugador`
const URL_KAHOOT_POST = `http://${BASE_URL('3000')}/kahoot`

const KAHOOT_DATA = {}
KAHOOT_DATA.status = ''
KAHOOT_DATA.hanRespondido = []
KAHOOT_DATA.pregunta = 'Pregunta'
KAHOOT_DATA.respuestas = ['Opción 1','Opción 2', 'Opción 3', 'Opción 4']



KAHOOT_DATA.jugador = prompt('Bienvenido al Juego de preguntas navideño, por favor, introduce tu nombre:')
if (!KAHOOT_DATA.jugador || KAHOOT_DATA.jugador.trim() === '') { location.href = 'index.html'; }
else {
    desactivarBotones(true)
    postNuevoJugador(true)

    // Intervalo para sepamos si el usuario esta activo o no y su estado en la cola
    setInterval(async () => {

        var { status, pregunta, respuestas, hanRespondido, jugadores } = await getEstado()
        if (status) {
            KAHOOT_DATA.status = status // running: Jugando - waitingAnswers: Esperando respuestas - queue: EnEspera - waitingPlayers: Debe salir boton de iniciar Juego - quit: Mandar al index
            KAHOOT_DATA.pregunta = pregunta //texto de la pregunta
            KAHOOT_DATA.respuestas = respuestas // array con las respuestas
            KAHOOT_DATA.hanRespondido = hanRespondido // array de los jugadores que ya han respondido, para evitar dobles respuestas    
            KAHOOT_DATA.jugadores = jugadores // array de los jugadores y colores    
        }
        if (KAHOOT_DATA.status === 'quit') {
            location.href = 'index.html'
            return
        }

        if (KAHOOT_DATA.status === 'running' || KAHOOT_DATA.hanRespondido.includes(KAHOOT_DATA.jugador)) {
            $msg.innerHTML = "ATENTO"
        }

        if (KAHOOT_DATA.status != 'waitingPlayers') {
            $start_button.setAttribute("style", "display: none;")
        } else {$start_button.removeAttribute("style")}

        if (KAHOOT_DATA.status === 'queue') {
            $msg.innerHTML = "Espere a que acaben las canciones"
        }


        if (KAHOOT_DATA.status == 'waitingAnswers' && !KAHOOT_DATA.hanRespondido.includes(KAHOOT_DATA.jugador)) {
            activarBotones()
        } else { desactivarBotones(false) }

        // Siempre actualizo la pregunta y las respuestas
        document.getElementById('kahoot_pregunta').textContent = KAHOOT_DATA.pregunta;
        document.getElementById('kahoot_verde').textContent = "";
        document.getElementById('kahoot_rojo').textContent = "";
        document.getElementById('kahoot_amarillo').textContent = "";
        document.getElementById('kahoot_azul').textContent = "";
        if (KAHOOT_DATA.respuestas.length >= 1) {
            document.getElementById('kahoot_verde').textContent = KAHOOT_DATA.respuestas[0];
        }
        if (KAHOOT_DATA.respuestas.length >= 2) {
            document.getElementById('kahoot_rojo').textContent = KAHOOT_DATA.respuestas[1];
        }
        if (KAHOOT_DATA.respuestas.length >= 3) {
            document.getElementById('kahoot_amarillo').textContent = KAHOOT_DATA.respuestas[2];
        }
        if (KAHOOT_DATA.respuestas.length >= 4) {
            document.getElementById('kahoot_azul').textContent = KAHOOT_DATA.respuestas[3];
        }

        //Mostrar jugadores
                // Contenedor para los jugadores
                const jugadoresContainer = document.getElementById('jugadores');
                jugadoresContainer.innerHTML = '';
// Colores disponibles
const coloresHex = {
    azul: '#0000FF',
    amarillo: '#FFFF00',
    blanco: '#FFFFFF',
    magenta: '#FF00FF',
    cian: '#00FFFF',
    naranja: '#FFA500'
};

// Mostrar cada jugador con su nombre y color
KAHOOT_DATA.jugadores.forEach(jugador => {
    const jugadorDiv = document.createElement('div');
    jugadorDiv.className = 'jugador';
    // Obtener el color correspondiente en formato HEX
    const colorHex = coloresHex[jugador.color] || '#000000'; // Por defecto negro si no coincide

    jugadorDiv.style.backgroundColor = colorHex;
    jugadorDiv.style.color = '#000'; // Asegurar que el texto sea legible en colores oscuros
    jugadorDiv.style.padding = '10px';
    jugadorDiv.style.borderRadius = '5px';
    jugadorDiv.style.marginBottom = '10px';
    jugadorDiv.textContent = `${jugador.nombre}`;
    jugadoresContainer.appendChild(jugadorDiv);
});

    }, 500)
}
 

async function getEstado() {
    try {
        var res = await fetch(URL_KAHOOT_ESTADO_GET(KAHOOT_DATA.jugador))
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

async function getIniciaPartida() {
    try {
        var res = await fetch(URL_KAHOOT_INICIAR_PARTIDA_GET)
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

function postNuevoJugador() {
    var url = URL_KAHOOT_NUEVO_JUGADOR_POST,
    params = {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify({
            jugador: KAHOOT_DATA.jugador
        }),
        headers: { 'Content-Type': 'application/json' },
    }

    var request = new Request(url, params)

    fetch(request)
        .then(data => data.json()
            .then(data => {
                if (data.error) {
                    alert(data.error)
                    location.href = 'index.html'; // redireccionamos a la pagina principal
                    return
                }
            }))
        .catch(err => console.log(err))
}

function postRespuesta(respuesta) {
    var url = URL_KAHOOT_POST,
    params = {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify({
            respuesta: respuesta,
            jugador: KAHOOT_DATA.jugador
        }),
        headers: { 'Content-Type': 'application/json' },
    }

    var request = new Request(url, params)

    fetch(request)
        .then(data => data.json()
            .then(data => {

            }))
        .catch(err => console.log(err))

}

function activarBotones() {
    $cola_canciones.setAttribute("style", "display: none;")
    $msg.setAttribute("style", "display: none;")
    $botones_contestar.removeAttribute("style")
}

function desactivarBotones(activarCola) {
    if (activarCola) {
        $cola_canciones.removeAttribute("style")
        $msg.removeAttribute("style")
    }
    $botones_contestar.setAttribute("style", "display: none;")
}

function seleccionarRespuesta(boton) {
    desactivarBotones(false)
    postRespuesta(boton.innerHTML)
    //setTimeout(activarBotones, 250) // Activamos los botones una vez ejecutada la secuencia del color
}