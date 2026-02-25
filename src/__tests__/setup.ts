import dotenv from 'dotenv'
dotenv.config()

// Mock Supabase pour les tests
process.env.SUPABASE_URL = 'https://mock.supabase.co'
process.env.SUPABASE_ANON_KEY = 'mock-anon-key'
process.env.SUPABASE_SERVICE_KEY = 'mock-service-key'
process.env.DATABASE_URL = 'postgresql://mock:mock@localhost:5432/mock'
process.env.JWT_SECRET = 'mock-secret'