'use strict'

const { test, beforeEach, describe } = require('node:test')

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

beforeEach(() => {
  accessSecretVersion.resetHistory()
  accessSecretVersion.resetBehavior()
})

describe('get', () => {
  test('happy path', async (t) => {
    const client = new GcpClient()
    accessSecretVersion.resolves([
      {
        payload: {
          data: Buffer.from('secret payload')
        }
      }
    ])

    const secret = await client.get('projects/project-id/secrets/secret-key/versions/latest')

    t.assert.ok(accessSecretVersion.called, 'calls accessSecretVersion')
    t.assert.ok(
      accessSecretVersion.calledWith({
        name: 'projects/project-id/secrets/secret-key/versions/latest'
      }),
      'provides ref as name to accessSecretVersion'
    )
    t.assert.equal(secret, 'secret payload', 'converts payload.data to sting')
  })

  test('sdk error', async (t) => {
    const client = new GcpClient()

    accessSecretVersion.rejects(new Error())

    const promise = client.get('projects/project-id/secrets/secret-key/versions/latest')

    await t.assert.rejects(promise, 'throws error')
  })
})
