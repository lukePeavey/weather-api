const request = require('supertest')
const app = require('../src/app')
const { stringify } = require('query-string')

describe('Test authentication routes', () => {
  test('Should respond with status 400 if request doesn\'t include required fields', async () => {
    const response = await request(app).post('/auth/login').send({})
    expect.assertions(1)
    expect(response.statusCode).toEqual(400)
  })

  test('Should respond with status 401 for invalid username or password', async () => {
    const response1 = await request(app).post(`/auth/login`).send({
      email: 'appleseed@mail.com',
      password: 'incorrect-password'
    })
    const response2 = await request(app).post(`/auth/login`).send({
      email: 'incorrect-email@mail.com',
      password: 'password'
    })
    expect.assertions(2)
    expect(response1.statusCode).toEqual(401)
    expect(response2.statusCode).toEqual(401)
  })

  test('Response should include a token property if request provides valid credentials', async () => {
    const user = {
      email: 'appleseed@mail.com',
      password: 'password'
    }
    const response = await request(app).post(`/auth/login`).send(user)
    const data = JSON.parse(response.text)
    expect.assertions(2)
    expect(response.statusCode).toEqual(200)
    expect(data).toHaveProperty('token')
  })
})
