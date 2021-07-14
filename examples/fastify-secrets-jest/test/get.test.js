afterAll(() => {
  fastify.close()
})

describe('GET /', () => {
  it('should return', async () => {
    const response = await fastify.inject({
      method: 'GET',
      url: '/'
    })

    expect(response.statusCode).toEqual(200)
  })
})
