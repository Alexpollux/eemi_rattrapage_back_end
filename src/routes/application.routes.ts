import { Router } from 'express'
import {
  createApplication,
  getMyApplication,
  getAllApplications,
  getApplicationById,
  updateStatus,
  updateDocuments
} from '../controllers/application.controller'
import { authenticate, requireAdmin } from '../middleware/auth.middleware'

const router = Router()

/**
 * @swagger
 * /api/applications:
 *   post:
 *     summary: Soumettre une candidature
 *     tags: [Candidatures]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [firstName, lastName, phone, birthDate, currentLevel, currentSchool, desiredProgram]
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               phone:
 *                 type: string
 *               birthDate:
 *                 type: string
 *                 format: date
 *               currentLevel:
 *                 type: string
 *               currentSchool:
 *                 type: string
 *               desiredProgram:
 *                 type: string
 *     responses:
 *       201:
 *         description: Candidature créée
 *       401:
 *         description: Non authentifié
 *       409:
 *         description: Candidature déjà existante
 */
router.post('/', authenticate, createApplication)

/**
 * @swagger
 * /api/applications/me:
 *   get:
 *     summary: Récupérer sa propre candidature
 *     tags: [Candidatures]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Candidature trouvée
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Aucune candidature trouvée
 */
router.get('/me', authenticate, getMyApplication)

/**
 * @swagger
 * /api/applications:
 *   get:
 *     summary: Lister toutes les candidatures (admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des candidatures
 *       403:
 *         description: Accès refusé
 */
router.get('/', authenticate, requireAdmin, getAllApplications)

/**
 * @swagger
 * /api/applications/{id}:
 *   get:
 *     summary: Récupérer une candidature par ID (admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Candidature trouvée
 *       404:
 *         description: Candidature introuvable
 */
router.get('/:id', authenticate, requireAdmin, getApplicationById)

/**
 * @swagger
 * /api/applications/{id}/status:
 *   patch:
 *     summary: Modifier le statut d'une candidature (admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *               status:
 *                 type: string
 *                 enum: [PENDING, ACCEPTED, REJECTED]
 *     responses:
 *       200:
 *         description: Statut mis à jour
 *       400:
 *         description: Statut invalide
 */
router.patch('/:id/status', authenticate, requireAdmin, updateStatus)

router.patch('/:id/documents', authenticate, updateDocuments)

export default router