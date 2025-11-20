const jwt = require('jsonwebtoken');
require('dotenv').config();

const secret = process.env.JWT_SECRET || 'default_secret_key_change_in_production';

// Gera um token JWT para testes
const token = jwt.sign(
  {
    userId: '507f1f77bcf86cd799439011', // ObjectId de exemplo
    email: 'usuario@test.com',
    tipo: 'user'
  },
  secret,
  { expiresIn: '24h' }
);

console.log('✅ TOKEN GERADO COM SUCESSO:\n');
console.log(token);
console.log('\n📋 Use no Swagger: Authorization: Bearer ' + token);
console.log('\n⏰ Validade: 24 horas');

