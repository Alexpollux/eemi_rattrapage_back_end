import { Router } from 'express'
import { uploadCV, uploadMotivation, uploadIdentity } from '../controllers/upload.controller'
import { authenticate } from '../middleware/auth.middleware'
import { upload } from '../middleware/upload.middleware'

const router = Router()

router.post('/:id/cv', authenticate, upload.single('file'), uploadCV)
router.post('/:id/motivation', authenticate, upload.single('file'), uploadMotivation)
router.post('/:id/identity', authenticate, upload.single('file'), uploadIdentity)

export default router