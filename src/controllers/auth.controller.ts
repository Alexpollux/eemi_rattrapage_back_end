import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import prisma from '../lib/prisma'

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return res.status(409).json({ error: 'Email déjà utilisé' })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: role === 'ADMIN' ? 'ADMIN' : 'CANDIDAT'
      }
    })

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    )

    return res.status(201).json({
      message: 'Compte créé avec succès',
      token,
      user: { id: user.id, email: user.email, role: user.role }
    })
  } catch (error) {
    return res.status(500).json({ error: 'Erreur serveur' })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return res.status(401).json({ error: 'Identifiants invalides' })
    }

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) {
      return res.status(401).json({ error: 'Identifiants invalides' })
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    )

    return res.status(200).json({
      token,
      user: { id: user.id, email: user.email, role: user.role }
    })
  } catch (error) {
    return res.status(500).json({ error: 'Erreur serveur' })
  }
}