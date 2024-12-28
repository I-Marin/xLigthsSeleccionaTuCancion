const axios = require('axios');
const fs = require('fs')

// Reemplaza con tu clave de API proporcionada por ZPK Moderator
// https://zpk.systems/admin-applications/post-creation-detail/84 con cuenta Google como acceso
const API_KEY = fs.readFileSync('webserver/ZPK_key');
const APPLICATION_ID = 'u282i84na9nIV';

// Función para verificar si un texto es inapropiado
async function esInapropiadoZPK(texto) {
  const endpoint = 'https://zpk.systems/api/moderator/scan';

  try {
    // Configuración de la solicitud
    const response = await axios.post(
      endpoint,
      {
        application_id: APPLICATION_ID, // ID de la aplicación
        api_key: `${API_KEY}`, // API KEY de autenticación
        messages: [
          {
            text: texto,                // Texto a analizar
            // Opcional: puedes añadir 'source_id' y 'message_id' si es necesario
          } ],
        language: 'es',    // Idioma del texto (español)
      },
      {
        headers: {

        },
      }
    );

    // Procesar la respuesta
    const { success, messages, cost } = response.data;
    if (success) {
      const resultado = messages[0];
      //console.log(`Texto analizado: "${texto}"`);
      //console.log('Resultados del análisis:', resultado);
      //console.log(`Costo de la solicitud: €${cost}`);

      // Determina si el texto es inapropiado según las categorías analizadas
      const esInapropiado = Object.values(resultado.categories).some(
        (categoria) => categoria.danger === true
      );

      return esInapropiado;
    } else {
      console.error('La solicitud ZPK no fue exitosa.');
      return false;
    }
  } catch (error) {
    console.error('Error al llamar a la API de ZPK Moderator:', error.response?.data || error.message);
    return false; // Devuelve false en caso de error
  }
}


// Exportar la función
module.exports = esInapropiadoZPK;

// Ejemplo de uso
(async () => {
  const texto = 'Este texto debería da ok'; // Texto que deseas analizar
  const resultado = await esInapropiadoZPK(texto);

  if (resultado) {
    console.log('Nos preocupa que una mente inteligente haga este comentario. No lo añadiremos. Lee un libro, sólo uno.');
  } else {
    console.log('El texto es adecuado.');
  }
})();
