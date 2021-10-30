# Union Street Media Engineering Metrics Dashboard - API

This repo contains the REST API for the engineering metrics dashboard. The web client and warehouse DDL scripts are stored in separate repos

## Installation

In the project root directory, run:

### `npm install`

Installs project dependencies

## Deploy using Serverless

`serverless deploy --stage *stage name*`

The API is structured and deployed using the [Serverless framework](https://www.serverless.com/). To deploy with Serverless, the AWS CLI must be configured locally and environment variables defined as specified in env.yml