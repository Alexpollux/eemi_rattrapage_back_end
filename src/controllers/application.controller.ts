import { Response } from 'express'
import { AuthRequest } from '../middleware/auth.middleware'
import prisma from '../lib/prisma'

// Créer une candidature
export const createApplication = async (req: AuthRequest, res: Response) => {
  try {
    const existing = await prisma.application.findUnique({
      where: { userId: req.userId }
    })
    if (existing) {
      return res.status(409).json({ error: 'Vous avez déjà soumis une candidature' })
    }

    const {
      firstName, lastName, phone, birthDate,
      currentLevel, currentSchool, desiredProgram
    } = req.body

    if (!firstName || !lastName || !phone || !birthDate || !currentLevel || !currentSchool || !desiredProgram) {
      return res.status(400).json({ error: 'Tous les champs sont requis' })
    }

    const application = await prisma.application.create({
      data: {
        userId: req.userId!,
        firstName, lastName, phone,
        birthDate: new Date(birthDate),
        currentLevel, currentSchool, desiredProgram
      }
    })

    return res.status(201).json({ application })
  } catch (error) {
    return res.status(500).json({ error: 'Erreur serveur' })
  }
}

// Récupérer sa propre candidature (candidat)
export const getMyApplication = async (req: AuthRequest, res: Response) => {
  try {
    const application = await prisma.application.findUnique({
      where: { userId: req.userId }
    })
    if (!application) {
      return res.status(404).json({ error: 'Aucune candidature trouvée' })
    }
    return res.status(200).json({ application })
  } catch (error) {
    return res.status(500).json({ error: 'Erreur serveur' })
  }
}

// Lister toutes les candidatures (admin)
export const getAllApplications = async (req: AuthRequest, res: Response) => {
  try {
    const applications = await prisma.application.findMany({
      include: { user: { select: { email: true } } },
      orderBy: { createdAt: 'desc' }
    })
    return res.status(200).json({ applications })
  } catch (error) {
    return res.status(500).json({ error: 'Erreur serveur' })
  }
}

// Récupérer une candidature par ID (admin)
export const getApplicationById = async (req: AuthRequest, res: Response) => {
  try {
    const application = await prisma.application.findUnique({
      where: { id: req.params.id },
      include: { user: { select: { email: true } } }
    })
    if (!application) {
      return res.status(404).json({ error: 'Candidature introuvable' })
    }
    return res.status(200).json({ application })
  } catch (error) {
    return res.status(500).json({ error: 'Erreur serveur' })
  }
}

// Modifier le statut (admin)
export const updateStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body
    if (!['PENDING', 'ACCEPTED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ error: 'Statut invalide' })
    }

    const application = await prisma.application.update({
      where: { id: req.params.id },
      data: { status }
    })

    return res.status(200).json({ application })
  } catch (error) {
    return res.status(500).json({ error: 'Erreur serveur' })
  }
}