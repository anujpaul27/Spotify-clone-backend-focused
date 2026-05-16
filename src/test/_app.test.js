const request = require('supertest')
const app = require('../app')

describe('POST /api/auth/register', () => {
  it('Should return 201 OK', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
            email: 'test_1@gmail.com',
            password: 'test',
            role: 'user'
        })

    expect(res.statusCode).toBe(201)
  })
})