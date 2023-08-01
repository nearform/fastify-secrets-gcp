'use strict'

const SecretManagerServiceClient = require('@google-cloud/secret-manager').SecretManagerServiceClient

class GcpClient {
  constructor() {
    this.sdk = new SecretManagerServiceClient()
  }

  async get(name) {
    try {
      const [version] = await this.sdk.accessSecretVersion({ name })
      return version.payload.data.toString('utf8')
    } catch (err) {
      throw new Error(err)
    }
  }
}

module.exports = GcpClient
