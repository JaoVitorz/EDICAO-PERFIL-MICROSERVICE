const { body, validationResult } = require('express-validator');

/**
 * Middleware para tratar erros de validação
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Dados inválidos',
      errors: errors.array()
    });
  }
  next();
};

/**
 * Validações para atualização de perfil
 */
const validateProfileUpdate = [
  body('nome')
    .optional()
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Nome deve ter entre 2 e 255 caracteres'),
  
  body('telefone')
    .optional()
    .trim()
    .matches(/^[\d\s\(\)\-\+]+$/)
    .withMessage('Telefone inválido'),
  
  body('data_nascimento')
    .optional()
    .isISO8601()
    .withMessage('Data de nascimento deve estar no formato ISO8601 (YYYY-MM-DD)')
    .custom((value) => {
      const birthDate = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 13 || age > 120) {
        throw new Error('Data de nascimento inválida');
      }
      return true;
    }),
  
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Bio deve ter no máximo 1000 caracteres'),
  
  body('cidade')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Cidade deve ter no máximo 100 caracteres'),
  
  body('estado')
    .optional()
    .trim()
    .isLength({ min: 2, max: 2 })
    .withMessage('Estado deve ter 2 caracteres (UF)'),
  
  body('cep')
    .optional()
    .trim()
    .matches(/^\d{5}-?\d{3}$/)
    .withMessage('CEP deve estar no formato 00000-000 ou 00000000'),
  
  body('endereco')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Endereço deve ter no máximo 255 caracteres'),
  
  body('numero')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('Número deve ter no máximo 20 caracteres'),
  
  body('complemento')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Complemento deve ter no máximo 100 caracteres'),
  
  body('foto_perfil')
    .optional()
    .custom((value) => {
      // Permite URL ou string vazia (para quando vier do upload)
      if (!value || value === '') return true;
      // Se tiver valor, deve ser URL válida
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    })
    .withMessage('Foto de perfil deve ser uma URL válida'),
  
  handleValidationErrors
];

module.exports = {
  validateProfileUpdate,
  handleValidationErrors
};

