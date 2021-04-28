const fetch = require('cross-fetch')

/**
 * Calls the endpoint with authorization bearer token.
 * @param {string} endpoint
 * @param {string} accessToken
 */
async function callApi({ endpoint, accessToken, headers = null, options = null }) {
  console.log('request made to web API at: ' + new Date().toString())

  try {
    const res = await fetch(
      endpoint,
      (options = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          ...headers,
        },
        ...options,
      })
    )

    return res
  } catch (error) {
    console.log(error)
    return error
  }
}

const readBody = async (body) => {
  let error
  body.on('error', (err) => {
    error = err
  })

  for await (const chunk of body) {
    console.dir(JSON.parse(chunk.toString()))
  }

  return new Promise((resolve, reject) => {
    body.on('close', () => {
      error ? reject(error) : resolve()
    })
  })
}

const callWithToken = async (getToken, tokenRequest, endpoint) => {
  const token = await getToken(tokenRequest)

  const res = await callApi({
    endpoint,
    accessToken: token.accessToken,
    headers: {
      'Content-Type': 'application/json',
      'x-functions-key': 'GDLaF2cmLRhTCG6s/hQpeZUNW7RCFNNI5A0T106fw9sfgi6Ly/6DlQ==',
    },
  })

  console.log(res.headers.raw())
  console.log(res.headers.get('content-type'))

  if (!res.ok) throw new Error(`unexpected response ${res.statusText}`)

  const body = await readBody(res.body)

  console.log('body: ', body)

  return body
}

module.exports = {
  callApi: callApi,
  callWithToken: callWithToken,
  readBody: readBody,
}
