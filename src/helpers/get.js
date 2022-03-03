const axios = require('axios')
const config = require('../config')


// Github API URL
const baseURL = 'https://api.github.com/repos/'

// create HTTPS request
const http = axios.create({
  baseURL: baseURL,
  headers: {
    Authorization: `token ${config.GITHUB_PERSONAL_ACCESS_TOKEN}`,
  },
})

// general purpose "GET"
module.exports = async function(url) {
  try {
  
    // Send URL request
    let request = await http.get(url)

    // Return resolved Promise
    return request
  } catch (e) {
    error(e)
    stacktrace(e)
  }
}
