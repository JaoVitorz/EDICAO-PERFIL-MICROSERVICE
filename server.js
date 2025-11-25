const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { connectDB, closeConnection } = require("./config/database");
const profileRoutes = require("./routes/profileRoutes");
const { swaggerUi, swaggerSpec } = require("./swagger");

const app = express();
const PORT = process.env.PORT || 3004;

// Middlewares
app.use(
  cors({
    origin: [
      "https://pet-joyful-projeto-integrador-next-js-ay4p-kzbr9m9bu.vercel.app",
      "https://edicao-perfil-microservice.onrender.com",

      "http://localhost:3000",
      "http://localhost:5000",
      "http://localhost:3004",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-api-key", "accept"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 Micro-serviço de Perfil está funcionando!",
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Micro-serviço de Perfil está funcionando",
    timestamp: new Date().toISOString(),
  });
});

// Swagger Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/api/profile", profileRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Rota não encontrada",
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Erro não tratado:", err);
  res.status(500).json({
    success: false,
    message: "Erro interno do servidor",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Conecta ao MongoDB e inicia o servidor
const startServer = async () => {
  try {
    // Conecta ao MongoDB
    await connectDB();

    // Inicia o servidor
    const server = app.listen(PORT, () => {
      console.log(`🚀 Micro-serviço de Perfil rodando na porta ${PORT}`);
      console.log(`📝 Ambiente: ${process.env.NODE_ENV || "development"}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
      console.log(`📚 Swagger Docs: http://localhost:${PORT}/api-docs`);
    });

    // Graceful shutdown
    process.on("SIGTERM", async () => {
      console.log("SIGTERM recebido, fechando servidor...");
      server.close(async () => {
        await closeConnection();
        process.exit(0);
      });
    });

    process.on("SIGINT", async () => {
      console.log("SIGINT recebido, fechando servidor...");
      server.close(async () => {
        await closeConnection();
        process.exit(0);
      });
    });
  } catch (error) {
    console.error("❌ Erro ao iniciar servidor:", error);
    process.exit(1);
  }
};

startServer();
module.exports = app;
