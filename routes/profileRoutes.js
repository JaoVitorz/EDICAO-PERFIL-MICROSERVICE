const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { authenticateToken, verifyOwnership } = require('../middleware/auth');
const { validateProfileUpdate } = require('../middleware/validation');
const { upload, uploadProfilePhoto } = require('../middleware/upload');

/**
 * @swagger
 * /api/profile/me:
 *   get:
 *     summary: Buscar perfil do usuário autenticado
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil encontrado com sucesso
 *       401:
 *         description: Não autenticado
 *       404:
 *         description: Perfil não encontrado
 */
router.get('/me', authenticateToken, profileController.getMyProfile);

/**
 * @swagger
 * /api/profile/me:
 *   put:
 *     summary: Atualizar perfil do usuário autenticado
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               telefone:
 *                 type: string
 *               data_nascimento:
 *                 type: string
 *                 format: date
 *               foto_perfil:
 *                 type: string
 *               bio:
 *                 type: string
 *               cidade:
 *                 type: string
 *               estado:
 *                 type: string
 *               cep:
 *                 type: string
 *               endereco:
 *                 type: string
 *               numero:
 *                 type: string
 *               complemento:
 *                 type: string
 *     responses:
 *       200:
 *         description: Perfil atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autenticado
 */
router.put('/me', authenticateToken, validateProfileUpdate, profileController.updateMyProfile);

/**
 * @swagger
 * /api/profile/me/photo:
 *   post:
 *     summary: Upload de foto de perfil do usuário autenticado
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               foto:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Foto de perfil atualizada com sucesso
 *       400:
 *         description: Nenhuma imagem fornecida
 *       401:
 *         description: Não autenticado
 */
router.post('/me/photo', authenticateToken, upload.single('foto'), uploadProfilePhoto, profileController.uploadProfilePhoto);

/**
 * @swagger
 * /api/profile/{userId}:
 *   get:
 *     summary: Buscar perfil por ID
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Perfil encontrado
 *       404:
 *         description: Perfil não encontrado
 */
router.get('/:userId', authenticateToken, profileController.getProfile);

/**
 * @swagger
 * /api/profile/{userId}:
 *   put:
 *     summary: Atualizar perfil por ID
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               telefone:
 *                 type: string
 *               data_nascimento:
 *                 type: string
 *                 format: date
 *               foto_perfil:
 *                 type: string
 *               bio:
 *                 type: string
 *               cidade:
 *                 type: string
 *               estado:
 *                 type: string
 *               cep:
 *                 type: string
 *               endereco:
 *                 type: string
 *               numero:
 *                 type: string
 *               complemento:
 *                 type: string
 *     responses:
 *       200:
 *         description: Perfil atualizado com sucesso
 *       403:
 *         description: Sem permissão para editar este perfil
 *       404:
 *         description: Perfil não encontrado
 */
router.put('/:userId', authenticateToken, verifyOwnership, validateProfileUpdate, profileController.updateProfile);

module.exports = router;

