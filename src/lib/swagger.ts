import swaggerJsdoc from 'swagger-jsdoc'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'EEMI Candidature API',
      version: '1.0.0',
      description: 'API de gestion des candidatures EEMI'
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Serveur local'
      },
      {
        url: 'https://eemirattrapagebackend-production.up.railway.app',
        description: 'Serveur de production'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./src/routes/*.ts']
}

export const swaggerSpec = swaggerJsdoc(options)