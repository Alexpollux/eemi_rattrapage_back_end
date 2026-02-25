import { Request, Response } from 'express'
import { supabase } from '../lib/supabase'
import prisma from '../lib/prisma'

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, role } = req.body

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'Tous les champs sont requis' })
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.FRONTEND_URL}/auth/callback`,
        data: { firstName, lastName, role: role === 'ADMIN' ? 'ADMIN' : 'CANDIDATE' }
      }
    })

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    if (!data.user) {
      return res.status(400).json({ error: 'Erreur lors de la création du compte' })
    }

    try {
      await prisma.user.create({
        data: {
          authId: data.user.id,
          email: data.user.email!,
          firstName,
          lastName,
          role: role === 'ADMIN' ? 'ADMIN' : 'CANDIDATE'
        }
      })
    } catch (prismaError: any) {
      console.error('Prisma error:', prismaError.message)
    }

    return res.status(201).json({
      message: 'Compte créé. Vérifiez votre email pour confirmer votre inscription.',
      user: {
        id: data.user.id,
        email: data.user.email,
        firstName,
        lastName,
        role: role === 'ADMIN' ? 'ADMIN' : 'CANDIDATE'
      }
    })
  } catch (error: any) {
    console.error('Register error:', error.message)
    return res.status(500).json({ error: error.message })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' })
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      return res.status(401).json({ error: error.message })
    }

    const user = await prisma.user.findUnique({
      where: { authId: data.user.id }
    })

    return res.status(200).json({
      token: data.session.access_token,
      user: {
        id: data.user.id,
        email: data.user.email,
        firstName: user?.firstName,
        lastName: user?.lastName,
        role: user?.role || 'CANDIDATE'
      }
    })
  } catch (error: any) {
    console.error('Login error:', error.message)
    return res.status(500).json({ error: error.message })
  }
}