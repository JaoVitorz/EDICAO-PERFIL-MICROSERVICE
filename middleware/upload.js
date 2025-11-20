const multer = require("multer");
const { uploadImage } = require("../config/cloudinary");

// Configuração do multer para armazenar em memória
const storage = multer.memoryStorage();

// Filtro de arquivos - apenas imagens
const fileFilter = (req, file, cb) => {
  // Verifica se é uma imagem
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Apenas arquivos de imagem são permitidos!"), false);
  }
};

// Configuração do multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB máximo
  },
});

/**
 * Middleware para fazer upload de foto de perfil
 */
const uploadProfilePhoto = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(); // Se não houver arquivo, continua sem erro
    }

    // Faz upload para o Cloudinary
    const result = await uploadImage(req.file.buffer, "pet-joyful/profiles");

    // Adiciona a URL da imagem ao body da requisição
    req.body.foto_perfil = result.url;

    next();
  } catch (error) {
    console.error("Erro ao fazer upload da imagem:", error);
    return res.status(500).json({
      success: false,
      message: "Erro ao fazer upload da imagem",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = {
  upload,
  uploadProfilePhoto,
};
