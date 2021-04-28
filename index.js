require('dotenv').config()

const express = require('express')

const SERVER_PORT = process.env.PORT || 3000

const auth = require('./auth')
const fetch = require('./fetch')
const { getGraphToken, graphTokenRequest, getExposedToken, exposedTokenRequest } = require('./auth')

// Create Express App and Routes
const app = express()

const apiConfig = {
  graphUsers: process.env.GRAPH_ENDPOINT + 'v1.0/users',
  clientUsers: process.env.GRAPH_ENDPOINT + 'v1.0/users',
  links: 'https://wafassignmentlinks.azurewebsites.net/api/5',
}

app.get('/', async (req, res) => {
  try {
    // const graphUsers = fetch.callWithToken(
    //   auth.getGraphToken,
    //   auth.graphTokenRequest,
    //   apiConfig.graphUsers
    // )
    // const clientUsers = fetch.callWithToken(
    //   auth.getClientToken,
    //   auth.clientTokenRequest,
    //   apiConfig.clientUsers
    // )
    const links = fetch.callWithToken(
      auth.getExposedToken,
      auth.exposedTokenRequest,
      apiConfig.links
    )

    const results = await Promise.all([
      // graphUsers, clientUsers,
      links,
    ])

    console.log('results: ', results)

    res.send(results)
  } catch (error) {
    console.log('error: ', error)
    res.status(500).send(error)
  }
})

// app.get('/auth', getAuthCodeUrl)

app.get('/permissions', async (req, res) => {
  console.log('app permissions redirect:')
  console.log('req: ', req)
  console.log('res: ', res)
  res.status(200)
})

app.listen(SERVER_PORT, () =>
  console.log(`Msal Node Auth Code Sample app listening on port ${SERVER_PORT}!`)
)
