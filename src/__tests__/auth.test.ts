import request from 'supertest'
import app from '../app'

jest.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn().mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Invalid login credentials' }
      }),
      signUp: jest.fn().mockResolvedValue({
        data: { user: null },
        error: { message: 'Already registered' }
      })
    }
  },
  supabaseAdmin: {
    auth: {
      admin: {
        updateUserById: jest.fn().mockResolvedValue({ error: null })
      }
    },
    storage: {
      from: jest.fn().mockReturnValue({
        upload: jest.fn().mockResolvedValue({ error: null }),
        getPublicUrl: jest.fn().mockReturnValue({ data: { publicUrl: 'https://mock.url/file.pdf' } })
      })
    }
  }
}))

describe('Auth Routes', () => {
  describe('POST /api/auth/register', () => {
    it('should return 400 if email is missing', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ password: 'Test1234' })

      expect(res.status).toBe(400)
      expect(res.body.error).toBe('Tous les champs sont requis')
    })

    it('should return 400 if password is missing', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'test@test.com' })

      expect(res.status).toBe(400)
      expect(res.body.error).toBe('Tous les champs sont requis')
    })
  })

  describe('POST /api/auth/login', () => {
    it('should return 400 if email is missing', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ password: 'Test1234' })

      expect(res.status).toBe(400)
      expect(res.body.error).toBe('Email et mot de passe requis')
    })

    it('should return 401 if credentials are invalid', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'wrong@test.com', password: 'wrongpassword' })

      expect(res.status).toBe(401)
    })
  })
})