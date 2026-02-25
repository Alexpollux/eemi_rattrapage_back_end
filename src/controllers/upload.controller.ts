import { Response } from 'express'
import { supabaseAdmin } from '../lib/supabase'
import { AuthRequest } from '../middleware/auth.middleware'

const uploadFile = async (req: AuthRequest, res: Response, folder: string) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Fichier manquant' })
    }

    const ext = req.file.originalname.split('.').pop()

    const sanitize = (str: string) =>
      str.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9]/g, '_')
        .toLowerCase()

    const userId = sanitize(req.userId || 'user')
    const fileName = `${folder}_${userId}_${Date.now()}.${ext}`
    const storagePath = `temp/${fileName}`

    const { error: uploadError } = await supabaseAdmin.storage
      .from('candidature-docs')
      .upload(storagePath, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: true
      })

    if (uploadError) {
      return res.status(500).json({ error: uploadError.message })
    }

    const { data } = supabaseAdmin.storage
      .from('candidature-docs')
      .getPublicUrl(storagePath)

    return res.status(200).json({ url: data.publicUrl, path: storagePath })
  } catch (error: any) {
    console.error('Upload error:', error.message)
    return res.status(500).json({ error: 'Erreur serveur' })
  }
}

export const uploadCV = (req: AuthRequest, res: Response) => uploadFile(req, res, 'cv')
export const uploadIdentity = (req: AuthRequest, res: Response) => uploadFile(req, res, 'identity')