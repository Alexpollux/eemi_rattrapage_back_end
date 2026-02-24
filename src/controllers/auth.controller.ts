import { Request, Response } from 'express'
import { supabase } from '../lib/supabase'
import prisma from '../lib/prisma'

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' })
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { role: role === 'ADMIN' ? 'ADMIN' : 'CANDIDAT' }
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
          id: data.user.id,
          email: data.user.email!,
          role: role === 'ADMIN' ? 'ADMIN' : 'CANDIDAT'
        }
      })
    } catch (prismaError: any) {
      console.error('Prisma error:', prismaError.message)
      // L'utilisateur Supabase est créé, on retourne quand même un succès
    }

    return res.status(201).json({
      message: 'Compte créé avec succès. Vérifiez votre email pour confirmer votre inscription.',
      user: {
        id: data.user.id,
        email: data.user.email,
        role: role === 'ADMIN' ? 'ADMIN' : 'CANDIDAT'
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
      where: { id: data.user.id }
    })

    return res.status(200).json({
      token: data.session.access_token,
      user: {
        id: data.user.id,
        email: data.user.email,
        role: user?.role || 'CANDIDAT'
      }
    })
  } catch (error: any) {
    console.error('Login error:', error.message)
    return res.status(500).json({ error: error.message })
  }
}