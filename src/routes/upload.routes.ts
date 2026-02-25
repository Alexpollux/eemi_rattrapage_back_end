import { Router } from 'express'
import { uploadCV, uploadIdentity } from '../controllers/upload.controller'
import { authenticate } from '../middleware/auth.middleware'
import { upload } from '../middleware/upload.middleware'

const router = Router()

/**
 * @swagger
 * /api/upload/cv:
 *   post:
 *     summary: Upload du CV
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
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
 *         description: URL du fichier uploadé
 */
router.post('/cv', authenticate, upload.single('file'), uploadCV)

/**
 * @swagger
 * /api/upload/identity:
 *   post:
 *     summary: Upload de la pièce d'identité
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
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
 *         description: URL du fichier uploadé
 */
router.post('/identity', authenticate, upload.single('file'), uploadIdentity)

export default router