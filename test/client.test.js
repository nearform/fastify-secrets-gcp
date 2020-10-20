'use strict'

const { test, beforeEach } = require('tap')
const sinon = require('sinon')
const proxyquire = require('proxyquire')

class Stub {
  accessSecretVersion() {}
}

const accessSecretVersion = sinon.stub(Stub.prototype, 'accessSecretVersion')

const GcpClient = proxyquire('../lib/client', {
  '@google-cloud/secret-manager': {
    SecretManagerServiceClient: Stub
  }
})

beforeEach(async () => {
  accessSecretVersion.resetHistory()
  accessSecretVersion.resetBehavior()
})

test('get', (t) => {
  t.plan(2)

  t.test('happy path', async (t) => {
    t.plan(3)

    const client = new GcpClient()
    accessSecretVersion.resolves([
      {
        payload: {
          data: Buffer.from('secret payload')
        }
      }
    ])

    const secret = await client.get('projects/project-id/secrets/secret-key/versions/latest')

    t.ok(accessSecretVersion.called, 'calls accessSecretVersion')
    t.ok(
      accessSecretVersion.calledWith({
        name: 'projects/project-id/secrets/secret-key/versions/latest'
      }),
      'provides ref as name to accessSecretVersion'
    )
    t.equal(secret, 'secret payload', 'converts payload.data to sting')
  })

  t.test('sdk error', async (t) => {
    t.plan(1)
    const client = new GcpClient()

    accessSecretVersion.rejects(new Error())

    const promise = client.get('projects/project-id/secrets/secret-key/versions/latest')

    await t.rejects(promise, 'throws error')
  })
})
