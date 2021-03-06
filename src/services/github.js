const unique = require('../helpers/unique')
const header = require('../helpers/header')
const httpService = require('./http')
const chalk = require('chalk')

const github = {
  /**
   *
   * @param  {} route
   * @param  {} since
   * Gets comments from GitHub
   */
  async comments(route, since) {
    const date = new Date(since)
    let logins = []
    let comments = []
    let firstLogins = []
    let remainingLogins = []
    try {
      let response = await httpService.get(route)
      // If we have a response
      if (response && response.statusText === 'OK') {
        const headers = response.headers

        // Fetch last page and reverse
        remainingLogins = await header.checkHeader(headers, 'continuous', date)

        // Add results to logins array
        if (remainingLogins) {
          logins = [...remainingLogins]
        }

        // Filter first request by Date/Time
        response.data.map((stats) => {
          let fetchDate = new Date(stats.created_at)
          if (fetchDate > date) {
            if (stats.user['login']) {
              firstLogins.push(stats.user['login'])
            }
          }
        })

        // Merge all logins into array
        logins = [...logins, ...firstLogins]

        // Count how many logins in array as a comment
        comments = await unique.getUniqueComments(logins)
      }

      return comments
    } catch (e) {
      console.error(chalk.red(e))
    }
  },
  /**
   * Gets pulls from GitHub
   * @param  {} route
   */
  async since(route) {
    let logins = []
    let comments = []
    let firstLogins = []
    let remainingLogins = []

    try {
      const json = await httpService.get(route)

      // If we have a response
      if (json && json.statusText === 'OK') {
        const headers = json.headers
        remainingLogins = await header.checkHeader(headers, 'since', false)

        // Add results to logins array
        if (remainingLogins) {
          logins = [...remainingLogins]
        }

        json.data.map((stats) => {
          if (stats.user['login']) {
            firstLogins.push(stats.user['login'])
          }
        })

        // Merge all logins into one array
        logins = [...logins, ...firstLogins]

        // Count how many logins in array as a comment
        comments = await unique.getUniqueComments(logins)
      }

      return comments
    } catch (e) {
      console.error(chalk.red(e))
    }
  },
  /**
   * Gets Stats frm GitHub
   * @param  {} route
   */
  async stats(route) {
    const totals = []

    try {
      const json = await httpService.get(route)

      // If we have a response
      if (json && json.statusText === 'OK') {
        // Create JSON schema template
        json.data.map((stats) => {
          if (stats.author['login']) {
            totals.push({
              login: stats.author['login'],
              comments: 0,
              total: stats.total,
            })
          }
        })
      }

      return totals
    } catch (e) {
      console.error(chalk.red(e))
    }
  },
}

module.exports = github
