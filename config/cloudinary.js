const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Configuração do Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Upload de imagem para o Cloudinary
 * @param {Buffer} fileBuffer - Buffer do arquivo
 * @param {String} folder - Pasta no Cloudinary (opcional)
 * @returns {Promise<Object>} - URL e informações da imagem
 */
const uploadImage = async (fileBuffer, folder = 'pet-joyful/profiles') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: 'image',
        transformation: [
          { width: 500, height: 500, crop: 'limit' },
          { quality: 'auto' },
          { format: 'jpg' }
        ]
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve({
            url: result.secure_url,
            public_id: result.public_id,
            width: result.width,
            height: result.height
          });
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
};

/**
 * Deleta imagem do Cloudinary
 * @param {String} publicId - Public ID da imagem
 * @returns {Promise<Object>}
 */
const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Erro ao deletar imagem do Cloudinary:', error);
    throw error;
  }
};

module.exports = {
  uploadImage,
  deleteImage,
  cloudinary
};

