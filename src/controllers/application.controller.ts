import { Response } from 'express'
import prisma from '../lib/prisma'
import { AuthRequest } from '../middleware/auth.middleware'

export const createApplication = async (req: AuthRequest, res: Response) => {
  try {
    const existing = await prisma.application.findFirst({
      where: { userId: req.userId }
    })

    if (existing) {
      return res.status(409).json({ error: 'Une candidature existe déjà pour ce compte' })
    }

    const {
      program, rhythm, campus, currentLevel, currentSchool,
      firstName, lastName, email, phone, dateOfBirth, nationality,
      motivationLetter, discoveryChannel,
      cvUrl, idDocumentUrl
    } = req.body

    const application = await prisma.application.create({
      data: {
        userId: req.userId!,
        program, rhythm, campus, currentLevel, currentSchool,
        firstName, lastName, email, phone,
        dateOfBirth: new Date(dateOfBirth),
        nationality,
        motivationLetter, discoveryChannel,
        cvUrl: cvUrl || null,
        idDocumentUrl: idDocumentUrl || null
      }
    })

    return res.status(201).json(application)
  } catch (error: any) {
    console.error('createApplication error:', error.message)
    return res.status(500).json({ error: 'Erreur serveur' })
  }
}

export const getMyApplication = async (req: AuthRequest, res: Response) => {
  try {
    const application = await prisma.application.findFirst({
      where: { userId: req.userId }
    })

    if (!application) {
      return res.status(404).json({ error: 'Aucune candidature trouvée' })
    }

    return res.status(200).json(application)
  } catch (error: any) {
    return res.status(500).json({ error: 'Erreur serveur' })
  }
}

export const getAllApplications = async (req: AuthRequest, res: Response) => {
  try {
    const { status, search, page = '1', limit = '10' } = req.query

    const pageNum = Math.max(1, parseInt(page as string, 10))
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10)))
    const skip = (pageNum - 1) * limitNum

    const where: any = {}

    if (status && ['PENDING', 'ACCEPTED', 'REJECTED'].includes(status as string)) {
      where.status = status
    }

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    }

    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
        include: {
          user: { select: { email: true, firstName: true, lastName: true } }
        }
      }),
      prisma.application.count({ where })
    ])

    return res.status(200).json({ applications, total, page: pageNum, limit: limitNum })
  } catch (error: any) {
    return res.status(500).json({ error: 'Erreur serveur' })
  }
}

export const getApplicationById = async (req: AuthRequest, res: Response) => {
  try {
    const application = await prisma.application.findUnique({
      where: { id: String(req.params.id) },
      include: {
        user: { select: { email: true, firstName: true, lastName: true } }
      }
    })

    if (!application) {
      return res.status(404).json({ error: 'Candidature introuvable' })
    }

    return res.status(200).json(application)
  } catch (error: any) {
    return res.status(500).json({ error: 'Erreur serveur' })
  }
}

export const updateStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body

    if (!['PENDING', 'ACCEPTED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ error: 'Statut invalide' })
    }

    const application = await prisma.application.update({
      where: { id: String(req.params.id) },
      data: {
        status,
        statusUpdatedAt: new Date()
      }
    })

    return res.status(200).json(application)
  } catch (error: any) {
    return res.status(500).json({ error: 'Erreur serveur' })
  }
}