import { Request, Response } from 'express'
import { supabase } from '../lib/supabase'
import prisma from '../lib/prisma'

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' })
    }

    // Inscription via Supabase Auth — envoie l'email de confirmation automatiquement
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

    // Créer le profil dans notre table users
    await prisma.user.create({
      data: {
        id: data.user.id,
        email: data.user.email!,
        role: role === 'ADMIN' ? 'ADMIN' : 'CANDIDAT'
      }
    })

    return res.status(201).json({
      message: 'Compte créé avec succès. Vérifiez votre email pour confirmer votre inscription.',
      user: {
        id: data.user.id,
        email: data.user.email,
        role: role === 'ADMIN' ? 'ADMIN' : 'CANDIDAT'
      }
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

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      return res.status(401).json({ error: error.message })
    }

    // Récupérer le rôle depuis notre table users
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
  } catch (error) {
    return res.status(500).json({ error: 'Erreur serveur' })
  }
}