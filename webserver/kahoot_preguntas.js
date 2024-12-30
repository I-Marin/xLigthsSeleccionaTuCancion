const PREGUNTAS = [
    {
        pregunta: "¿EN QUÉ PAÍS SE ORIGINÓ LA TRADICIÓN DEL ÁRBOL DE NAVIDAD?",
        respuestas: ["ITALIA", "ALEMANIA", "FRANCIA", "INGLATERRA"],
        solucion: "ALEMANIA"
    },
    {
        pregunta: "¿QUÉ SE CELEBRA EL 25 DE DICIEMBRE?",
        respuestas: ["LOS REYES MAGOS", "LA ANUNCIACIÓN", "NACIMIENTO DE JESÚS", "LA PASCUA"],
        solucion: "NACIMIENTO DE JESÚS"
    },
    {
        pregunta: "¿CÓMO SE LLAMA EN INGLÉS EL VILLANCICO QUE EMPIEZA CON 'NOCHE DE PAZ'?",
        respuestas: ["JINGLE BELLS", "SILENT NIGHT", "WHITE CHRISTMAS", "O HOLY NIGHT"],
        solucion: "SILENT NIGHT"
    },
    {
        pregunta: "¿QUÉ PAÍS ES FAMOSO POR ENVIAR ÁRBOLES DE NAVIDAD AL REINO UNIDO COMO SÍMBOLO DE AMISTAD?",
        respuestas: ["CANADÁ", "NORUEGA", "SUECIA", "DINAMARCA"],
        solucion: "NORUEGA"
    },
    {
        pregunta: "¿QUÉ FESTIVIDAD SIGUE INMEDIATAMENTE DESPUÉS DE LA NAVIDAD EN EL CALENDARIO CRISTIANO?",
        respuestas: ["LA EPIFANÍA", "AÑO NUEVO", "SAN ESTEBAN", "LA CUARESMA"],
        solucion: "SAN ESTEBAN"
    },
    {
        pregunta: "¿QUÉ FIGURA TRAE REGALOS A LOS NIÑOS EN ESPAÑA EL 6 DE ENERO?",
        respuestas: ["PAPÁ NOEL", "OLENTZERO", "LOS REYES MAGOS", "SAN NICOLÁS"],
        solucion: "LOS REYES MAGOS"
    },
    {
        pregunta: "¿EN QUÉ PAÍS COMENZÓ LA TRADICIÓN DE PAPÁ NOEL VESTIDO DE ROJO?",
        respuestas: ["FRANCIA", "ESTADOS UNIDOS", "FINLANDIA", "HOLANDA"],
        solucion: "ESTADOS UNIDOS"
    },
    {
        pregunta: "¿QUÉ DULCE SE COME TRADICIONALMENTE EN ITALIA DURANTE LA NAVIDAD?",
        respuestas: ["ROSCÓN DE REYES", "PANETTONE", "MAZAPÁN", "PESTIÑOS"],
        solucion: "PANETTONE"
    },
    {
        pregunta: "¿QUÉ SIGNIFICA LA PALABRA 'ADVIENTO'?",
        respuestas: ["ESPERANZA", "LLEGADA", "FIESTA", "MILAGRO"],
        solucion: "LLEGADA"
    },
    {
        pregunta: "¿QUÉ ANIMAL LLEVÓ A MARÍA A BELÉN SEGÚN LA TRADICIÓN POPULAR?",
        respuestas: ["UN CAMELLO", "UN BURRO", "UN CABALLO", "UNA MULA"],
        solucion: "UN BURRO"
    },
    {
        pregunta: "¿EN QUÉ PAÍS SE CELEBRA EL 'DÍA DE LAS VELITAS' EL 7 DE DICIEMBRE?",
        respuestas: ["VENEZUELA", "MÉXICO", "COLOMBIA", "PERÚ"],
        solucion: "COLOMBIA"
    },
    {
        pregunta: "¿CUÁL ES EL NOMBRE DEL FESTIVAL JUDÍO QUE COINCIDE CON LA TEMPORADA NAVIDEÑA?",
        respuestas: ["ROSH HASHANÁ", "HANUKKAH", "YOM KIPUR", "PESAJ"],
        solucion: "HANUKKAH"
    },
    {
        pregunta: "¿QUÉ PERSONAJE NAVIDEÑO SE LLAMA 'DED MOROZ' EN RUSIA?",
        respuestas: ["SAN NICOLÁS", "PAPÁ NOEL", "EL NIÑO JESÚS", "EL HOMBRE DE NIEVE"],
        solucion: "PAPÁ NOEL"
    },
    {
        pregunta: "¿QUÉ FLOR SE ASOCIA TRADICIONALMENTE CON LA NAVIDAD?",
        respuestas: ["ROSA", "FLOR DE PASCUA", "MARGARITA", "TULIPÁN"],
        solucion: "FLOR DE PASCUA"
    },
    {
        pregunta: "¿QUIÉN ESCRIBIÓ 'CUENTO DE NAVIDAD'?",
        respuestas: ["MARK TWAIN", "CHARLES DICKENS", "JANE AUSTEN", "VICTOR HUGO"],
        solucion: "CHARLES DICKENS"
    },
    {
        pregunta: "¿CÓMO SE LLAMA EL BASTÓN DULCE QUE SE CUELGA EN LOS ÁRBOLES DE NAVIDAD?",
        respuestas: ["BASTÓN DE CARAMELO", "BASTÓN DE JENGIBRE", "BASTÓN DE AZÚCAR", "BASTÓN DE MENTA"],
        solucion: "BASTÓN DE CARAMELO"
    },
    {
        pregunta: "¿QUÉ ÁNGEL ANUNCIÓ A MARÍA QUE SERÍA MADRE DE JESÚS?",
        respuestas: ["MIGUEL", "GABRIEL", "RAFAEL", "URIEL"],
        solucion: "GABRIEL"
    },
    {
        pregunta: "¿EN QUÉ PAÍS SE ORIGINARON LOS VILLANCICOS?",
        respuestas: ["INGLATERRA", "ESPAÑA", "ALEMANIA", "FRANCIA"],
        solucion: "INGLATERRA"
    },
    {
        pregunta: "¿QUÉ ANIMAL APARECE EN EL PESEBRE JUNTO AL NIÑO JESÚS SEGÚN LA TRADICIÓN?",
        respuestas: ["GALLO", "BUEY", "CABALLO", "ZORRO"],
        solucion: "BUEY"
    },
    {
        pregunta: "¿EN QUÉ AÑO SE ESTRENÓ LA PELÍCULA 'SOLO EN CASA'?",
        respuestas: ["1990", "1989", "1991", "1988"],
        solucion: "1990"
    },
    {
        pregunta: "¿QUÉ PAÍS INTRODUJO EL VILLANCICO 'NOCHE DE PAZ' AL MUNDO?",
        respuestas: ["AUSTRIA", "ALEMANIA", "SUIZA", "ITALIA"],
        solucion: "AUSTRIA"
    },
    {
        pregunta: "¿QUÉ PLANTA SE CONSIDERA UN SÍMBOLO DE LA NAVIDAD Y ES POPULAR PARA DECORAR?",
        respuestas: ["ACEBO", "HIEDRA", "MUÉRDAGO", "PINO"],
        solucion: "MUÉRDAGO"
    },
    {
        pregunta: "¿CÓMO SE DICE 'FELIZ NAVIDAD' EN ALEMÁN?",
        respuestas: ["MERRY CHRISTMAS", "JOYEUX NOËL", "FRÖHLICHE WEIHNACHTEN", "BUON NATALE"],
        solucion: "FRÖHLICHE WEIHNACHTEN"
    },
    {
        pregunta: "¿QUÉ COMIDA SE CONSIDERA TRADICIONAL EN INGLATERRA PARA EL DÍA DE NAVIDAD?",
        respuestas: ["PAVO ASADO", "JAMÓN GLASEADO", "POLLO", "LOMO DE CERDO"],
        solucion: "PAVO ASADO"
    },
    {
        pregunta: "¿QUÉ MARATÓN DE PELÍCULAS ES POPULAR DURANTE LA NAVIDAD?",
        respuestas: ["HARRY POTTER", "STAR WARS", "SOLO EN CASA", "EL SEÑOR DE LOS ANILLOS"],
        solucion: "SOLO EN CASA"
    }
];

function obtenerPreguntasAleatorias(numeroPreguntas) {
    // Crear una copia de las preguntas para no modificar el original
    const preguntasDisponibles = [...PREGUNTAS];

    // Ajustar el número de preguntas si es mayor al total disponible
    const numeroFinal = Math.min(numeroPreguntas, preguntasDisponibles.length);

    // Seleccionar preguntas aleatorias sin repetición
    const preguntasSeleccionadas = [];
    for (let i = 0; i < numeroFinal; i++) {
        const indiceAleatorio = Math.floor(Math.random() * preguntasDisponibles.length);
        const pregunta = { ...preguntasDisponibles[indiceAleatorio] }; // Copiar la pregunta

        // Desordenar el array de respuestas
        pregunta.respuestas = pregunta.respuestas.sort(() => Math.random() - 0.5);

        preguntasSeleccionadas.push(pregunta);
        preguntasDisponibles.splice(indiceAleatorio, 1); // Eliminar la pregunta seleccionada
    }

    console.log({preguntasSeleccionadas})
    return preguntasSeleccionadas;
}

module.exports = obtenerPreguntasAleatorias;
