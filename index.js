require('dotenv').config()

const fs = require('fs/promises')
const express = require('express')
const msal = require('@azure/msal-node')
const isAfter = require('date-fns/isAfter')
const SERVER_PORT = process.env.PORT || 3000
const REDIRECT_URI = 'http://localhost:3000/redirect'

const auth = require('./auth')
const fetch = require('./fetch')

// Create Express App and Routes
const app = express()

app.get('/', async (req, res) => {
  try {
    const authResponse = await auth.getToken(auth.tokenRequest)

    const users = await fetch.callApi({
      endpoint: auth.apiConfig.users,
      accessToken: authResponse.accessToken,
      headers: { 'Content-Type': 'application/json' },
    })
    console.log('users: ', users)
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
