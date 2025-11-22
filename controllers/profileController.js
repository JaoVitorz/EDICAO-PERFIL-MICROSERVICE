const Profile = require("../models/Profile");

/**
 * Buscar perfil do usuário
 */
const getProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "ID do usuário inválido",
      });
    }

    const profile = await Profile.findByUserId(userId);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Perfil não encontrado",
      });
    }

    res.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error("Erro ao buscar perfil:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Atualizar perfil do usuário
 */
const updateProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "ID do usuário inválido",
      });
    }

    // Prepara dados para atualização (remove campos vazios)
    const profileData = {};
    const allowedFields = [
      "nome",
      "telefone",
      "data_nascimento",
      "foto_perfil",
      "bio",
      "cidade",
      "estado",
      "cep",
      "endereco",
      "numero",
      "complemento",
    ];

    allowedFields.forEach((field) => {
      if (
        req.body[field] !== undefined &&
        req.body[field] !== null &&
        req.body[field] !== ""
      ) {
        profileData[field] = req.body[field];
      }
    });

    // Verifica se há dados para atualizar
    if (Object.keys(profileData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Nenhum dado fornecido para atualização",
      });
    }

    // Atualiza ou cria o perfil
    const updatedProfile = await Profile.updateOrCreate(userId, profileData);

    if (!updatedProfile) {
      return res.status(500).json({
        success: false,
        message: "Erro ao atualizar perfil",
      });
    }

    res.json({
      success: true,
      message: "Perfil atualizado com sucesso",
      data: updatedProfile,
    });
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Buscar perfil do usuário autenticado
 */
const getMyProfile = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Usuário não autenticado",
      });
    }

    console.log(`\n🔍 Buscando perfil do usuário ${userId}...`);
    const profile = await Profile.findByUserId(userId);

    if (!profile) {
      console.log(`⚠️ Perfil não encontrado para o usuário ${userId}`);
      return res.status(404).json({
        success: false,
        message: "Perfil não encontrado",
      });
    }

    console.log("✅ Perfil encontrado:");
    console.log("- foto_perfil:", profile.foto_perfil);
    console.log("- nome:", profile.nome);
    console.log("- email:", profile.email);

    res.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error("❌ Erro ao buscar perfil:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Atualizar perfil do usuário autenticado
 */
const updateMyProfile = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Usuário não autenticado",
      });
    }

    // Prepara dados para atualização
    const profileData = {};
    const allowedFields = [
      "nome",
      "telefone",
      "data_nascimento",
      "foto_perfil",
      "bio",
      "cidade",
      "estado",
      "cep",
      "endereco",
      "numero",
      "complemento",
    ];

    allowedFields.forEach((field) => {
      if (
        req.body[field] !== undefined &&
        req.body[field] !== null &&
        req.body[field] !== ""
      ) {
        profileData[field] = req.body[field];
      }
    });

    // Verifica se há dados para atualizar
    if (Object.keys(profileData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Nenhum dado fornecido para atualização",
      });
    }

    // Atualiza ou cria o perfil
    const updatedProfile = await Profile.updateOrCreate(userId, profileData);

    if (!updatedProfile) {
      return res.status(500).json({
        success: false,
        message: "Erro ao atualizar perfil",
      });
    }

    res.json({
      success: true,
      message: "Perfil atualizado com sucesso",
      data: updatedProfile,
    });
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Upload de foto de perfil
 * A URL da imagem já foi processada pelo middleware uploadProfilePhoto
 */
const uploadProfilePhoto = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Usuário não autenticado",
      });
    }

    // A URL da imagem já foi adicionada ao req.body pelo middleware uploadProfilePhoto
    const fotoUrl = req.body.foto_perfil;
    const publicId = req.body.foto_perfil_public_id;

    if (!fotoUrl) {
      return res.status(400).json({
        success: false,
        message:
          "Erro ao processar upload da imagem. O middleware não retornou uma URL válida.",
      });
    }

    console.log(
      `Atualizando perfil do usuário ${userId} com nova foto: ${fotoUrl}`
    );

    // Atualiza o perfil com a nova foto
    const updatedProfile = await Profile.updateOrCreate(userId, {
      foto_perfil: fotoUrl,
    });

    if (!updatedProfile) {
      return res.status(500).json({
        success: false,
        message: "Erro ao salvar a foto no perfil",
      });
    }

    res.json({
      success: true,
      message: "Foto de perfil atualizada com sucesso",
      data: {
        foto_perfil: updatedProfile.foto_perfil,
        public_id: publicId,
      },
    });
  } catch (error) {
    console.error("Erro ao fazer upload da foto de perfil:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao salvar a foto no banco de dados",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getMyProfile,
  updateMyProfile,
  uploadProfilePhoto,
};
