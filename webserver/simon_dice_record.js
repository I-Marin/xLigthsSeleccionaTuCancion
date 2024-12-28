const fs = require('fs');

// Ruta del archivo de texto
const filePath = 'C:/xLights/Show2024/secuencias/simon_dice/simon_dice.txt';


// Lee el archivo de texto
fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error al leer el archivo:', err);
        return;
    }

    // Divide el contenido del archivo por líneas
    const lines = data.trim().split('\n');

    let recordMax = 0; // Valor inicial para encontrar el máximo
    let jugador = ''


    // Itera sobre cada línea del archivo
    lines.forEach(line => {
        console.log('Linea:', line);
        // Busca el número antes de 'aciertos' en la línea usando la expresión regular
        const logg = line.substring(68, 70);

        const aciertos = parseInt(logg);
        console.log('Aciertos:', aciertos);

        // Comprueba si el valor actual de logg es mayor que el máximo encontrado hasta ahora
        if (!isNaN(aciertos) && aciertos > recordMax) {
            recordMax = aciertos;
            const startIndex = line.indexOf("aciertos  ");
            jugador = line.substring(startIndex + "aciertos  ".length).trim();
        }

    });


    if (recordMax === 0) {
        console.log('No se encontró ningún valor de logg en el archivo.');
    } else {
        console.log('El mayor valor de log encontrado es:', recordMax, 'y fue', jugador);
    }
});
