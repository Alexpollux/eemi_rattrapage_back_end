import multer from 'multer'

const storage = multer.memoryStorage()

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowed = ['application/pdf', 'image/png', 'image/jpg', 'image/jpeg']
  if (allowed.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Format non accepté. Utilisez PDF, PNG, JPG ou JPEG'))
  }
}

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5 Mo
})