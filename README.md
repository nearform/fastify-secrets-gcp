# Fastify Secrets Gcp

![CI](https://github.com/nearform/fastify-secrets-gcp/workflows/CI/badge.svg)

Fastify secrets plugin for Google cloud platform secrets manager

## Installation

```
npm install --save fastify-secrets-gcp
```

## Usage

### Get permissions to access gcp secrets manager

In order to be able to read from gcp secrets manager you will need some permissions.
You will also probably manage permissions in different ways in local dev and production environment.

#### Local dev environment

In general you may want to use a different secrets manager on your local machine (i.e. `fastify-secrets-env` to read secrets from env variables).

If you want run `fastify-secrets-gcp` in the local environment too you will need to follow these steps:

1. Create a GCP Service Account
2. Grant the new service account at least the role of "Secret Manager Secret Accessor"
3. Create key for the account
4. Download the key in json format
5. (optional) Place the key in the root of your project (make sure to add it to `.gitignore` to avoid commiting it)
6. Set the env variable `GOOGLE_APPLICATION_CREDENTIALS` to the absolute path of the downloaded key
7. You're ready to run your app

#### Production environment (on Cloud Run)

If you already have a custom Service Account for your service Clour Run you will need to give it access to Secrets Manager.
Otherwise you will need to create a new custom Service Account with access to Secrets Manager and assign it to Cloud Run.

In any case you will need to grant the "Secret Manager Secret Accessor" role.

### Add plugin to your fastify instance

```js

const FastifySecrets = require('fastify-secrets-gcp')

fastify.register(FastifySecrets, {
  secrets: {
    dbPassword: 'projects/PROJECT-ID/secrets/SECRET-ID/versions/latest'
  }
})

```

### Access you secrets

```js

await fastify.ready()

console.log(fastify.secrets.dbPassword) // content of projects/PROJECT-ID/secrets/SECRET-ID/versions/latest

```

### Plugin options

The plugin only expect the `secrets` object in the options.

It is a map of keys and resource ids for the secrets. `fastify-secrets-gcp` will decorate the fastify server with a `secrets` object where keys will be the same keys of the options and the value will be the content of the secret as fetched from GCP Secrets Manager

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md)

## License

Copyright NearForm Ltd 2020. Licensed under the [Apache-2.0 license](http://www.apache.org/licenses/LICENSE-2.0).
