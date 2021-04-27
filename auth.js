const msal = require('@azure/msal-node')

/**
 * Configuration object to be passed to MSAL instance on creation.
 * For a full list of MSAL Node configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-node/docs/configuration.md
 */
const msalConfig = {
  auth: {
    clientId: process.env.CLIENT_ID,
    authority: process.env.AAD_ENDPOINT + process.env.TENANT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  },
}

/**
 * With client credentials flows permissions need to be granted in the portal by a tenant administrator.
 * The scope is always in the format '<resource>/.default'. For more, visit:
 * https://docs.microsoft.com/azure/active-directory/develop/v2-oauth2-client-creds-grant-flow
 */
const tokenRequest = {
  scopes: [
    process.env.GRAPH_ENDPOINT + '.default',
    'api://094dd3ec-f54c-41c8-be4b-d7405110e0f6' + './default',
    // 'api://434411eb-9ba1-42a3-8bce-c3055d816197' + '/.default'
  ],
}

const apiConfig = {
  users: process.env.GRAPH_ENDPOINT + 'v1.0/users',
}

/**
 * Initialize a confidential client application. For more info, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-node/docs/initialize-confidential-client-application.md
 */
const cca = new msal.ConfidentialClientApplication(msalConfig)

/**
 * Acquires token with client credentials.
 * @param {object} tokenRequest
 */
async function getToken(tokenRequest) {
  return await cca.acquireTokenByClientCredential(tokenRequest)
}

module.exports = {
  apiConfig: apiConfig,
  tokenRequest: tokenRequest,
  getToken: getToken,
}

// const config = {
//   auth: {
//     clientId: process.env.CLIENT_ID,
//     authority: `https://login.microsoftonline.com/${process.env.TENANT_ID}`,
//     clientSecret: process.env.CLIENT_SECRET,
//   },
//   system: {
//     loggerOptions: {
//       loggerCallback(loglevel, message, containsPii) {
//         console.log(message)
//       },
//       piiLoggingEnabled: false,
//       logLevel: msal.LogLevel.Verbose,
//     },
//   },
// }

// // Create msal application object
// const pca = new msal.ConfidentialClientApplication(config)

// const authCodeUrlParameters = {
//   scopes: ['Files.ReadWrite.All'],
//   redirectUri: process.env.REDIRECT_URI,
// }

// async function getAuthCodeUrl(req, res) {
//   try {
//     const authCodeUrl = await pca.getAuthCodeUrl(authCodeUrlParameters)

//     res.redirect(authCodeUrl)
//   } catch (error) {
//     console.log(JSON.stringify(error))
//     return error
//   }
// }

// async function getToken(req, res) {
//   try {
//     const tokenRequest = {
//       code: req.query.code,
//       scopes: [''],
//       redirectUri: process.env.REDIRECT_URI,
//     }

//     const tokenResponse = await pca.acquireTokenByCode(tokenRequest)

//     console.log('\nResponse: \n:', tokenResponse)

//     await fs.writeFile('token.json', tokenResponse)

//     res.sendStatus(200)
//   } catch (error) {
//     console.log(error)
//     return error
//   }
// }

// module.exports = {
//   getAuthCodeUrl,
//   getToken,
// }
