import { Router } from 'express'
import {
  createApplication,
  getMyApplication,
  getAllApplications,
  getApplicationById,
  updateStatus
} from '../controllers/application.controller'
import { authenticate, requireAdmin } from '../middleware/auth.middleware'

const router = Router()

// Routes candidat
router.post('/', authenticate, createApplication)
router.get('/me', authenticate, getMyApplication)

// Routes admin
router.get('/', authenticate, requireAdmin, getAllApplications)
router.get('/:id', authenticate, requireAdmin, getApplicationById)
router.patch('/:id/status', authenticate, requireAdmin, updateStatus)

export default router