import { Request, Response } from 'express'
import { supabaseAdmin } from '../lib/supabase'
import prisma from '../lib/prisma'
import { AuthRequest } from '../middleware/auth.middleware'

const uploadFile = async (
  req: AuthRequest,
  res: Response,
  documentType: string
) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Fichier manquant' })
    }

    const application = await prisma.application.findUnique({
      where: { id: String(req.params.id) }
    })

    if (!application) {
      return res.status(404).json({ error: 'Candidature introuvable' })
    }

    if (application.userId !== req.userId) {
      return res.status(403).json({ error: 'Accès refusé' })
    }

    const ext = req.file.originalname.split('.').pop()
    
    // Nettoyer le nom pour supprimer les caractères spéciaux
    const sanitize = (str: string) =>
      str.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9]/g, '_')
        .toLowerCase()

    const firstName = sanitize(application.firstName)
    const lastName = sanitize(application.lastName)
    const docType = documentType.toLowerCase()
    
    const fileName = `${docType}_${firstName}_${lastName}.${ext}`
    const storagePath = `${application.id}/${fileName}`

    const { error: uploadError } = await supabaseAdmin.storage
      .from('candidature-docs')
      .upload(storagePath, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: true
      })

    if (uploadError) {
      return res.status(500).json({ error: uploadError.message })
    }

    const document = await prisma.applicationDocument.create({
      data: {
        applicationId: application.id,
        type: documentType as any,
        fileName,
        storagePath,
        mimeType: req.file.mimetype,
        fileSize: req.file.size
      }
    })

    return res.status(200).json(document)
  } catch (error: any) {
    console.error('Upload error:', error.message)
    return res.status(500).json({ error: 'Erreur serveur' })
  }
}

export const uploadCV = (req: AuthRequest, res: Response) => uploadFile(req, res, 'CV')
export const uploadMotivation = (req: AuthRequest, res: Response) => uploadFile(req, res, 'PORTFOLIO')
export const uploadIdentity = (req: AuthRequest, res: Response) => uploadFile(req, res, 'IDENTITY')