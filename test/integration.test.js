'use strict'

const { test, teardown } = require('tap')
const uuid = require('uuid')
const Fastify = require('fastify')
const SecretManagerServiceClient = require('@google-cloud/secret-manager').SecretManagerServiceClient

const FastifySecrets = require('../')

const SECRET_ID = uuid.v4()
const SECRET_CONTENT = uuid.v4()
const PROJECT_NAME = `projects/${process.env.TEST_PROJECT_ID}`
const SECRET_NAME = `${PROJECT_NAME}/secrets/${SECRET_ID}`

const client = new SecretManagerServiceClient()

async function createSecret() {
  const [secret] = await client.createSecret({
    parent: PROJECT_NAME,
    secret: {
      name: SECRET_ID,
      replication: {
        automatic: {}
      }
    },
    secretId: SECRET_ID
  })

  await client.addSecretVersion({
    parent: secret.name,
    payload: {
      data: Buffer.from(SECRET_CONTENT, 'utf8')
    }
  })
}

teardown(async function deleteSecret() {
  return client.deleteSecret({
    name: SECRET_NAME
  })
})

test('integration', async (t) => {
  t.plan(1)

  await createSecret()

  const fastify = Fastify({
    logger: process.env.TEST_LOGGER || false
  })

  fastify.register(FastifySecrets, {
    secrets: {
      test: `${SECRET_NAME}/versions/latest`
    }
  })

  await fastify.ready()

  t.has(
    fastify.secrets,
    {
      test: SECRET_CONTENT
    },
    'decorates fastify with secret content'
  )
})
