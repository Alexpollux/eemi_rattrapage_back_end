import request from 'supertest'
import app from '../app'

describe('Application Routes', () => {
  describe('POST /api/applications', () => {
    it('should return 401 if no token provided', async () => {
      const res = await request(app)
        .post('/api/applications')
        .send({})

      expect(res.status).toBe(401)
      expect(res.body.error).toBe('Token manquant')
    })
  })

  describe('GET /api/applications/me', () => {
    it('should return 401 if no token provided', async () => {
      const res = await request(app)
        .get('/api/applications/me')

      expect(res.status).toBe(401)
    })
  })

  describe('GET /api/applications', () => {
    it('should return 401 if no token provided', async () => {
      const res = await request(app)
        .get('/api/applications')

      expect(res.status).toBe(401)
    })
  })

  describe('PATCH /api/applications/:id/status', () => {
    it('should return 401 if no token provided', async () => {
      const res = await request(app)
        .patch('/api/applications/fake-id/status')
        .send({ status: 'ACCEPTED' })

      expect(res.status).toBe(401)
    })
  })
})