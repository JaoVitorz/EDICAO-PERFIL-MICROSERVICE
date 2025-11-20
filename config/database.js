const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://joaojesus:oULyKDlXfS0Stg4M@cluster0.hmlyx3e.mongodb.net/petjoyful?retryWrites=true&w=majority&appName=Cluster0';

/**
 * Conecta ao MongoDB
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      // Opções de conexão (removidas opções deprecadas)
    });

    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('❌ Erro ao conectar ao MongoDB:', error.message);
    process.exit(1);
  }
};

/**
 * Fecha a conexão com o MongoDB
 */
const closeConnection = async () => {
  try {
    await mongoose.connection.close();
    console.log('✅ Conexão com MongoDB fechada');
  } catch (error) {
    console.error('❌ Erro ao fechar conexão:', error);
  }
};

// Event listeners para monitorar a conexão
mongoose.connection.on('connected', () => {
  console.log('✅ Mongoose conectado ao MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Erro na conexão do Mongoose:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ Mongoose desconectado do MongoDB');
});

module.exports = {
  connectDB,
  closeConnection,
  mongoose
};
