import { Response } from 'express'
import { AuthRequest } from '../middleware/auth.middleware'
import { supabase } from '../lib/supabase'
import prisma from '../lib/prisma'

type DocumentType = 'cv' | 'lm' | 'pi'

const uploadFile = async (
  req: AuthRequest,
  res: Response,
  docType: DocumentType,
  urlField: 'cvUrl' | 'motivationLetterUrl' | 'idDocumentUrl'
) => {
  try {
    const file = req.file
    if (!file) {
      return res.status(400).json({ error: 'Aucun fichier fourni' })
    }

    const application = await prisma.application.findUnique({
      where: { userId: req.userId }
    })
    if (!application) {
      return res.status(404).json({ error: 'Candidature introuvable' })
    }

    const ext = file.originalname.split('.').pop()
    const firstName = application.firstName.toLowerCase().replace(/\s/g, '_')
    const lastName = application.lastName.toLowerCase().replace(/\s/g, '_')
    const fileName = `${docType}_${firstName}_${lastName}.${ext}`

    const { error } = await supabase.storage
      .from('candidature-docs')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: true
      })

    if (error) {
      return res.status(500).json({ error: 'Erreur upload Supabase', details: error.message })
    }

    const { data: urlData } = supabase.storage
      .from('candidature-docs')
      .getPublicUrl(fileName)

    await prisma.application.update({
      where: { id: application.id },
      data: { [urlField]: urlData.publicUrl }
    })

    return res.status(200).json({
      message: 'Fichier uploadé avec succès',
      url: urlData.publicUrl,
      fileName
    })
  } catch (error) {
    return res.status(500).json({ error: 'Erreur serveur' })
  }
}

export const uploadCV = (req: AuthRequest, res: Response) =>
  uploadFile(req, res, 'cv', 'cvUrl')

export const uploadMotivation = (req: AuthRequest, res: Response) =>
  uploadFile(req, res, 'lm', 'motivationLetterUrl')

export const uploadIdentity = (req: AuthRequest, res: Response) =>
  uploadFile(req, res, 'pi', 'idDocumentUrl')