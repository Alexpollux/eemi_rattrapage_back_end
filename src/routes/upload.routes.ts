import { Router } from 'express'
import { uploadCV, uploadMotivation, uploadIdentity } from '../controllers/upload.controller'
import { authenticate } from '../middleware/auth.middleware'
import { upload } from '../middleware/upload.middleware'

const router = Router()

/**
 * @swagger
 * /api/applications/{id}/cv:
 *   post:
 *     summary: Upload du CV
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: CV uploadé avec succès
 */
router.post('/:id/cv', authenticate, upload.single('file'), uploadCV)

/**
 * @swagger
 * /api/applications/{id}/motivation:
 *   post:
 *     summary: Upload de la lettre de motivation
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Lettre uploadée avec succès
 */
router.post('/:id/motivation', authenticate, upload.single('file'), uploadMotivation)

/**
 * @swagger
 * /api/applications/{id}/identity:
 *   post:
 *     summary: Upload de la pièce d'identité
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Pièce d'identité uploadée avec succès
 */
router.post('/:id/identity', authenticate, upload.single('file'), uploadIdentity)

export default router