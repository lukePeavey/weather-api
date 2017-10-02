const request = require('supertest')
const app = require('../src/app')
const { stringify } = require('query-string')

describe('Test weather routes', () => {
  test('The response status should be 200', async () => {
    const params = {
      features: 'conditions'
    }
    const response = await request(app).get(`/weather?${stringify(params)}`)
    expect(response.statusCode).toBe(200)
  })

  test('Response should have current_observation property', async () => {
    const params = {
      features: 'conditions'
    }
    const response = await request(app).get(`/weather?${stringify(params)}`)
    const data = JSON.parse(response.text)
    expect(data).toHaveProperty('current_observation')
  })
})
