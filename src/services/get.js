const axios = require('axios')
const config = require('../config')

const chalk = require('chalk')

// Github API URL
const baseURL = config.GITHUB_BASE_URL

// create HTTPS request
const http = axios.create({
  baseURL: baseURL,
  headers: {
    Authorization: `token ${config.GITHUB_PERSONAL_ACCESS_TOKEN}`,
  },
})

// general purpose "GET"
const get = {
  async get(url) {
    try {
      // Send URL request
      let request = await http.get(url)

      // Return resolved Promise
      return request
    } catch (e) {
      console.error(chalk.red(e))
    }
  },
}

module.exports = get
