'use strict'

const Fastify = require('fastify')
const FastifySecrets = require('fastify-secrets-gcp')
const { fromPairs } = require('lodash')

async function build(opts = {}) {
  const app = Fastify(opts)

  const secrets = [
    [
      'api_auth0_client_secret',
      'projects/xyz/secrets/API_AUTH0_CLIENT_SECRET/versions/latest'
    ]
  ]
  await app.register(FastifySecrets, {
    secrets: fromPairs(secrets)
  })

  app.register(require('fastify-auth0-verify'), {
    domain: auth0.domain,
    audience: auth0.audience,
    secret: app.secrets.api_auth0_client_secret
  })

  app.get('/', function (request, reply) {
    reply.send('I am happy and healthy\n')
  })

  return app
}

module.exports = build
