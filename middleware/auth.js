const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

/**
 * Middleware para verificar token JWT
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Token de acesso não fornecido' 
    });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'default_secret', (err, user) => {
    if (err) {
      return res.status(403).json({ 
        success: false, 
        message: 'Token inválido ou expirado' 
      });
    }
    
    req.user = user;
    next();
  });
};

/**
 * Middleware para verificar se o usuário está editando seu próprio perfil
 */
const verifyOwnership = (req, res, next) => {
  const { userId } = req.params;
  const tokenUserId = req.user?.userId || req.user?.id;

  if (!tokenUserId) {
    return res.status(401).json({ 
      success: false, 
      message: 'Usuário não autenticado' 
    });
  }

  // Converte ambos para string para comparação (suporta ObjectId e strings)
  const userIdStr = userId?.toString();
  const tokenUserIdStr = tokenUserId?.toString();

  if (userIdStr !== tokenUserIdStr) {
    return res.status(403).json({ 
      success: false, 
      message: 'Você não tem permissão para editar este perfil' 
    });
  }

  next();
};

module.exports = {
  authenticateToken,
  verifyOwnership
};

