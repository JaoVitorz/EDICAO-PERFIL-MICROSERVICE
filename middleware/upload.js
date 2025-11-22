const multer = require("multer");
const { uploadImage } = require("../config/cloudinary");

// Configuração do multer para armazenar em memória
const storage = multer.memoryStorage();

// Filtro de arquivos - apenas imagens
const fileFilter = (req, file, cb) => {
  // Lista de tipos MIME aceitos
  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];

  // Verifica se é uma imagem válida
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Tipo de arquivo não permitido. Apenas imagens JPEG, PNG, GIF e WebP são aceitas. Recebido: ${file.mimetype}`
      ),
      false
    );
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
 * Configuração do multer que aceita múltiplos nomes de campo
 */
const uploadAny = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB máximo
  },
}).any(); // Aceita qualquer campo

/**
 * Middleware para debug da requisição
 */
const debugRequest = (req, res, next) => {
  console.log("\n=== DEBUG UPLOAD REQUEST ===");
  console.log("Content-Type:", req.headers["content-type"]);
  console.log("req.file:", req.file);
  console.log("req.files:", req.files);
  console.log("req.body:", req.body);
  console.log("=========================\n");
  next();
};

/**
 * Middleware para fazer upload de foto de perfil
 */
const uploadProfilePhoto = async (req, res, next) => {
  try {
    // Tenta pegar o arquivo de req.file ou req.files[0]
    let file = req.file;

    if (!file && req.files && req.files.length > 0) {
      file = req.files[0];
      req.file = file; // Normaliza para req.file
    }

    // Verifica se o arquivo foi enviado
    if (!file) {
      console.error("❌ Nenhum arquivo detectado em req.file");
      console.error("Headers:", req.headers);
      console.error("Body:", req.body);
      console.error("Files:", req.files);

      return res.status(400).json({
        success: false,
        message: "Nenhum arquivo foi enviado. Por favor, envie uma imagem.",
        debug: {
          contentType: req.headers["content-type"],
          hasFile: !!req.file,
          hasFiles: !!req.files,
          bodyKeys: Object.keys(req.body || {}),
        },
      });
    }

    // Verifica se o buffer do arquivo existe
    if (!file.buffer || file.buffer.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Arquivo inválido ou corrompido. Por favor, tente novamente.",
      });
    }

    // Valida o tipo MIME novamente
    if (!file.mimetype.startsWith("image/")) {
      return res.status(400).json({
        success: false,
        message:
          "O arquivo enviado não é uma imagem válida. Formatos aceitos: JPEG, PNG, GIF, WebP.",
      });
    }

    console.log(
      `Fazendo upload da imagem: ${file.originalname} (${file.size} bytes)`
    );

    // Faz upload para o Cloudinary
    const result = await uploadImage(file.buffer, "pet-joyful/profiles");

    // Adiciona a URL da imagem ao body da requisição
    req.body.foto_perfil = result.url;
    req.body.foto_perfil_public_id = result.public_id;

    console.log(`Upload concluído com sucesso: ${result.url}`);

    next();
  } catch (error) {
    console.error("Erro ao fazer upload da imagem:", error);

    // Mensagens de erro mais específicas
    let errorMessage = "Erro ao processar upload da imagem.";

    if (error.message.includes("Invalid image")) {
      errorMessage =
        "Arquivo inválido. Verifique se o arquivo é uma imagem válida (JPEG, PNG, GIF ou WebP).";
    } else if (error.message.includes("File size")) {
      errorMessage = "Arquivo muito grande. O tamanho máximo permitido é 5MB.";
    } else if (
      error.http_code === 401 ||
      error.message.includes("credentials")
    ) {
      errorMessage =
        "Erro de configuração do serviço de upload. Entre em contato com o suporte.";
    } else if (
      error.message.includes("network") ||
      error.message.includes("timeout")
    ) {
      errorMessage =
        "Erro de conexão ao fazer upload. Verifique sua internet e tente novamente.";
    }

    return res.status(500).json({
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Middleware para tratar erros do Multer
 */
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Erros específicos do Multer
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "Arquivo muito grande. O tamanho máximo permitido é 5MB.",
      });
    }
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        success: false,
        message:
          'Campo de arquivo inesperado. Use o campo "foto" para enviar a imagem.',
      });
    }
    return res.status(400).json({
      success: false,
      message: "Erro no upload do arquivo.",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  } else if (err) {
    // Outros erros (como o fileFilter)
    return res.status(400).json({
      success: false,
      message: err.message || "Erro ao processar o arquivo.",
    });
  }
  next();
};

module.exports = {
  upload,
  uploadAny,
  uploadProfilePhoto,
  handleMulterError,
  debugRequest,
};
