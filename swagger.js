const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Pet-Joyful Profile Service API",
      version: "1.0.0",
      description:
        "Micro-serviço responsável pelo gerenciamento de perfis de usuários do Pet-Joyful",
      contact: {
        name: "Pet-Joyful API Support",
      },
    },
    servers: [
      {
        url: "https://edicao-perfil-microservice.onrender.com",
        description: "Servidor de produção",
      },
      {
        url: `http://localhost:${process.env.PORT || 3004}`,
        description: "Servidor de desenvolvimento",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js", "./controllers/*.js"], // Caminhos para arquivos com anotações Swagger
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  swaggerSpec,
};
