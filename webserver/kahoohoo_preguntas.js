const PREGUNTAS = [
    {
        pregunta: "¿En qué país se originó la tradición del árbol de Navidad?",
        respuestas: ["Italia", "Alemania", "Francia", "Inglaterra"],
        solucion: "Alemania"
    },
    {
        pregunta: "¿Qué se celebra el 25 de diciembre?",
        respuestas: ["La llegada de los Reyes Magos", "La Anunciación", "El nacimiento de Jesús", "La Pascua"],
        solucion: "El nacimiento de Jesús"
    },
    {
        pregunta: "¿Cómo se llama el villancico que empieza con 'Noche de paz'?",
        respuestas: ["Jingle Bells", "Silent Night", "White Christmas", "O Holy Night"],
        solucion: "Silent Night"
    },
    {
        pregunta: "¿Qué país es famoso por enviar árboles de Navidad al Reino Unido como símbolo de amistad?",
        respuestas: ["Canadá", "Noruega", "Suecia", "Dinamarca"],
        solucion: "Noruega"
    },
    {
        pregunta: "¿Qué festividad sigue inmediatamente después de la Navidad en el calendario cristiano?",
        respuestas: ["La Epifanía", "Año Nuevo", "El Día de San Esteban", "La Cuaresma"],
        solucion: "El Día de San Esteban"
    },
    {
        pregunta: "¿Qué figura trae regalos a los niños en España el 6 de enero?",
        respuestas: ["Papá Noel", "El Olentzero", "Los Reyes Magos", "San Nicolás"],
        solucion: "Los Reyes Magos"
    },
    {
        pregunta: "¿En qué país comenzó la tradición de Papá Noel vestido de rojo?",
        respuestas: ["Francia", "Estados Unidos", "Finlandia", "Holanda"],
        solucion: "Estados Unidos"
    },
    {
        pregunta: "¿Qué dulce se come tradicionalmente en Italia durante la Navidad?",
        respuestas: ["Roscón de Reyes", "Panettone", "Mazapán", "Pestiños"],
        solucion: "Panettone"
    },
    {
        pregunta: "¿Qué significa la palabra 'adviento'?",
        respuestas: ["Esperanza", "Llegada", "Fiesta", "Milagro"],
        solucion: "Llegada"
    },
    {
        pregunta: "¿Qué animal llevó a María a Belén según la tradición popular?",
        respuestas: ["Un camello", "Un burro", "Un caballo", "Una mula"],
        solucion: "Un burro"
    },
    {
        pregunta: "¿En qué país se celebra el 'Día de las Velitas' el 7 de diciembre?",
        respuestas: ["Venezuela", "México", "Colombia", "Perú"],
        solucion: "Colombia"
    },
    {
        pregunta: "¿Cuál es el nombre del festival judío que coincide con la temporada navideña?",
        respuestas: ["Rosh Hashaná", "Hanukkah", "Yom Kipur", "Pesaj"],
        solucion: "Hanukkah"
    },
    {
        pregunta: "¿Qué personaje navideño se llama 'Ded Moroz' en Rusia?",
        respuestas: ["San Nicolás", "Papá Noel", "El Niño Jesús", "El Hombre de Nieve"],
        solucion: "Papá Noel"
    },
    {
        pregunta: "¿Qué flor se asocia tradicionalmente con la Navidad?",
        respuestas: ["Rosa", "Flor de Pascua", "Margarita", "Tulipán"],
        solucion: "Flor de Pascua"
    },
    {
        pregunta: "¿Quién escribió 'Cuento de Navidad'?",
        respuestas: ["Mark Twain", "Charles Dickens", "Jane Austen", "Victor Hugo"],
        solucion: "Charles Dickens"
    },
    {
        pregunta: "¿Cómo se llama el bastón dulce que se cuelga en los árboles de Navidad?",
        respuestas: ["Bastón de caramelo", "Bastón de jengibre", "Bastón de azúcar", "Bastón de menta"],
        solucion: "Bastón de caramelo"
    },
    {
        pregunta: "¿Qué ángel anunció a María que sería madre de Jesús?",
        respuestas: ["Miguel", "Gabriel", "Rafael", "Uriel"],
        solucion: "Gabriel"
    },
    {
        pregunta: "¿En qué país se originaron los villancicos?",
        respuestas: ["Inglaterra", "España", "Alemania", "Francia"],
        solucion: "Inglaterra"
    },
    {
        pregunta: "¿Qué animal aparece en el pesebre junto al Niño Jesús según la tradición?",
        respuestas: ["Gallo", "Buey", "Caballo", "Zorro"],
        solucion: "Buey"
    },
    {
        pregunta: "¿En qué año se estrenó la película 'Solo en casa'?",
        respuestas: ["1990", "1989", "1991", "1988"],
        solucion: "1990"
    },
    {
        pregunta: "¿Qué país introdujo el villancico 'Noche de Paz' al mundo?",
        respuestas: ["Austria", "Alemania", "Suiza", "Italia"],
        solucion: "Austria"
    },
    {
        pregunta: "¿Qué planta se considera un símbolo de la Navidad y es popular para decorar?",
        respuestas: ["Acebo", "Hiedra", "Muérdago", "Pino"],
        solucion: "Muérdago"
    },
    {
        pregunta: "¿Cómo se dice 'Feliz Navidad' en alemán?",
        respuestas: ["Merry Christmas", "Joyeux Noël", "Fröhliche Weihnachten", "Buon Natale"],
        solucion: "Fröhliche Weihnachten"
    },
    {
        pregunta: "¿Qué comida se considera tradicional en Inglaterra para el día de Navidad?",
        respuestas: ["Pavo asado", "Jamón glaseado", "Pollo", "Lomo de cerdo"],
        solucion: "Pavo asado"
    },
    {
        pregunta: "¿Qué maratón de películas es popular durante la Navidad?",
        respuestas: ["Harry Potter", "Star Wars", "Solo en casa", "El Señor de los Anillos"],
        solucion: "Solo en casa"
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
obtenerPreguntasAleatorias(10)
module.exports = obtenerPreguntasAleatorias;
