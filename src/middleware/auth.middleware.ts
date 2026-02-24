import { Request, Response, NextFunction } from 'express'
import { supabase } from '../lib/supabase'
import prisma from '../lib/prisma'

export interface AuthRequest extends Request {
  userId?: string
  userRole?: string
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token manquant' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const { data, error } = await supabase.auth.getUser(token)

    if (error || !data.user) {
      return res.status(401).json({ error: 'Token invalide ou expiré' })
    }

    // Récupérer le rôle depuis notre table
    const user = await prisma.user.findUnique({
      where: { id: data.user.id }
    })

    req.userId = data.user.id
    req.userRole = user?.role || 'CANDIDAT'
    next()
  } catch {
    return res.status(401).json({ error: 'Token invalide' })
  }
}

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.userRole !== 'ADMIN') {
    return res.status(403).json({ error: 'Accès réservé aux administrateurs' })
  }
  next()
}