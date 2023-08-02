'use strict'

const SecretManagerServiceClient = require('@google-cloud/secret-manager').SecretManagerServiceClient

class GcpClient {
  constructor() {
    this.sdk = new SecretManagerServiceClient()
  }

  async get(name) {
    const [version] = await this.sdk.accessSecretVersion({ name })
    return version.payload.data.toString('utf8')
  }
}

module.exports = GcpClient
