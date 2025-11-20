const mongoose = require('mongoose');

/**
 * Schema do Perfil de Usuário
 * Coleção: profiles
 */
const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  nome: {
    type: String,
    trim: true,
    maxlength: 255
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    maxlength: 255
  },
  telefone: {
    type: String,
    trim: true,
    maxlength: 20
  },
  data_nascimento: {
    type: Date
  },
  tipo_usuario: {
    type: String,
    enum: ['tutor', 'instituicao', 'clinica'],
    default: 'tutor'
  },
  foto_perfil: {
    type: String,
    maxlength: 500
  },
  bio: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  cidade: {
    type: String,
    trim: true,
    maxlength: 100
  },
  estado: {
    type: String,
    trim: true,
    uppercase: true,
    maxlength: 2
  },
  cep: {
    type: String,
    trim: true,
    maxlength: 10
  },
  endereco: {
    type: String,
    trim: true,
    maxlength: 255
  },
  numero: {
    type: String,
    trim: true,
    maxlength: 20
  },
  complemento: {
    type: String,
    trim: true,
    maxlength: 100
  }
}, {
  timestamps: true, // Cria automaticamente createdAt e updatedAt
  collection: 'profiles' // Nome da coleção no MongoDB
});

// Índices para melhor performance
profileSchema.index({ userId: 1 });
profileSchema.index({ email: 1 });
profileSchema.index({ tipo_usuario: 1 });

/**
 * Método estático para buscar perfil por userId
 */
profileSchema.statics.findByUserId = async function(userId) {
  try {
    // Converte string para ObjectId se necessário
    const userIdObj = mongoose.Types.ObjectId.isValid(userId) 
      ? new mongoose.Types.ObjectId(userId) 
      : userId;
    
    return await this.findOne({ userId: userIdObj });
  } catch (error) {
    throw error;
  }
};

/**
 * Método estático para atualizar ou criar perfil
 */
profileSchema.statics.updateOrCreate = async function(userId, profileData) {
  try {
    // Converte string para ObjectId se necessário
    const userIdObj = mongoose.Types.ObjectId.isValid(userId) 
      ? new mongoose.Types.ObjectId(userId) 
      : userId;
    
    // Remove campos undefined/null/vazios
    const updateData = {};
    Object.keys(profileData).forEach(key => {
      if (profileData[key] !== undefined && profileData[key] !== null && profileData[key] !== '') {
        updateData[key] = profileData[key];
      }
    });

    const options = {
      upsert: true, // Cria se não existir
      new: true, // Retorna o documento atualizado
      setDefaultsOnInsert: true
    };

    return await this.findOneAndUpdate(
      { userId: userIdObj },
      { $set: updateData },
      options
    );
  } catch (error) {
    throw error;
  }
};

/**
 * Método estático para verificar se usuário existe
 */
profileSchema.statics.userExists = async function(userId) {
  try {
    const userIdObj = mongoose.Types.ObjectId.isValid(userId) 
      ? new mongoose.Types.ObjectId(userId) 
      : userId;
    
    const count = await this.countDocuments({ userId: userIdObj });
    return count > 0;
  } catch (error) {
    throw error;
  }
};

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
