import { Router } from 'express'
import { register, login } from '../controllers/auth.controller'

const router = Router()

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Créer un compte candidat
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: candidat@email.com
 *               password:
 *                 type: string
 *                 example: Test1234
 *               role:
 *                 type: string
 *                 enum: [CANDIDAT, ADMIN]
 *                 example: CANDIDAT
 *     responses:
 *       201:
 *         description: Compte créé, email de confirmation envoyé
 *       400:
 *         description: Données invalides
 */
router.post('/register', register)

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Connexion
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: candidat@email.com
 *               password:
 *                 type: string
 *                 example: Test1234
 *     responses:
 *       200:
 *         description: Connexion réussie, retourne un token JWT
 *       401:
 *         description: Identifiants invalides
 */
router.post('/login', login)

export default router