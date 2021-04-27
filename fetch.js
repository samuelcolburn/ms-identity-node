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

    const body = await res.json()

    if (res.ok) {
      return res.body
    } else {
      console.log('error fetching api')
      console.log('status: ', res.status)
      console.log('statusText: ', res.statusText)
      console.log('message: ', body)
      return {
        status: res.status,
        statusText: res.statusText,
        body,
      }
    }
  } catch (error) {
    console.log(error)
    return error
  }
}

module.exports = {
  callApi: callApi,
}
