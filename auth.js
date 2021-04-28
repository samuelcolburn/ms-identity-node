const querystring = require('querystring')
const msal = require('@azure/msal-node')
const fetch = require('cross-fetch')
const { readBody } = require('./fetch')

const { pipeline } = require('stream')
const { promisify } = require('util')

// const graphConfig = makeConfig(process.env.CLIENT_ID, process.env.CLIENT_SECRET)
// const clientConfig = makeConfig(process.env.CLIENT_ID, process.env.CLIENT_SECRET)

// const graphTokenRequest = tokenRequest(process.env.GRAPH_ENDPOINT + DEFAULT_SCOPE)
// const clientTokenRequest = tokenRequest(process.env.CLIENT_ENDPOINT + DEFAULT_SCOPE)
// const graphApp = new msal.ConfidentialClientApplication(graphConfig)
// const clientApp = new msal.ConfidentialClientApplication(clientConfig)
// const getGraphToken = getToken(graphApp)
// const getClientToken = getToken(clientApp)
// graphTokenRequest: graphTokenRequest,
// clientTokenRequest: clientTokenRequest,
// getGraphToken: getGraphToken,
// getClientToken: getClientToken,

const DEFAULT_SCOPE = '.default'

const makeConfig = (clientId, clientSecret) => ({
  auth: {
    clientId,
    authority: process.env.AAD_ENDPOINT + process.env.TENANT_ID,
    clientSecret,
  },
  system: {
    loggerOptions: {
      loggerCallback(loglevel, message, containsPii) {
        console.log(message)
      },
      piiLoggingEnabled: false,
      logLevel: msal.LogLevel.Verbose,
    },
  },
})

const tokenRequest = (scope) => ({ scopes: [scope] })

const exposedConfig = makeConfig(process.env.EXPOSED_CLIENT_ID, process.env.EXPOSED_CLIENT_SECRET)

const exposedTokenRequest = tokenRequest(process.env.EXPOSED_CLIENT_ENDPOINT + DEFAULT_SCOPE)

const exposedApp = new msal.ConfidentialClientApplication(exposedConfig)

const getToken = (app) => async (tokenRequest) => {
  return await app.acquireTokenByClientCredential(tokenRequest)
}

const getAccessToken = async () => {
  try {
    const response = await fetch(process.env.AAD_ENDPOINT + process.env.TENANT_ID, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify({
        grant_type: 'client_credentials',
        client_id: process.env.EXPOSED_CLIENT_ID,
        scopes: [process.env.EXPOSED_CLIENT_ENDPOINT + DEFAULT_SCOPE],
        client_secret: process.env.EXPOSED_CLIENT_SECRET,
        resource: process.env.EXPOSED_CLIENT_ENDPOINT,
      }),
    })

    const result = await readBody(response.body)

    console.log('result: ', result)

    return result
  } catch (error) {
    console.log('error getting acces token: ', error)
    throw new Error('access error')
  }
}

const getExposedToken = getToken(exposedApp)

module.exports = {
  exposedTokenRequest: exposedTokenRequest,
  getAccessToken: getAccessToken,
  getExposedToken: getExposedToken,
}
