// Importar la librería
import LlamaStackClient from 'llama-stack-client';

// Crear una instancia del cliente, configurando el entorno (opcional)
const client = new LlamaStackClient({
  environment: 'sandbox', // 'production' es el valor predeterminado
  headers: {
    'Authorization': 'Bearer tu_token_de_api_aqui'
  }
});

// Función principal para interactuar con la API
async function main() {
  try {
    // Datos para la sesión
    const params = {
      agent_id: '12345', // Reemplazar con el ID de tu agente
      session_name: 'PRUEBA', // Nombre de la sesión
    };

    // Crear una nueva sesión utilizando la API
    const session = await client.agents.sessions.create(params);
    console.log('Session ID:', session.session_id);
    
  } catch (err) {
    // Manejo de errores
    console.log({ err })
  }
}


// Llamar la función principal
main();
