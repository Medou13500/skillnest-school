import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SkillNest API",
      version: "1.0.0",
      description: `
API Backend SkillNest

Authentification basée sur :
- Access Token JWT (court)
- Refresh Token stocké en base (long, rotatif)

Flux standard :
1. Login → access_token + refresh_token
2. Access token expire → refresh
3. Logout → invalidation refresh token
      `,
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local server",
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

  // ⚠️ IMPORTANT : chemins RELATIFS au root
  apis: ["./src/routes/**/*.ts"],
};

export default swaggerJsdoc(options);
