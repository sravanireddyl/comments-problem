const path = require('../constants/routes')
const github = require('./github')
const chalk = require('chalk')
/* Get Comments data  from git hub for comments stats pulls and issues
 sort data group by unique users
*/

const comments = {

  /**
   * Fetch comments by using repo and isoString
   * Handle response , sort and group by Users
   * @param  {} repo
   * @param  {} isoString
   */
  async getCount(repo, isoString) {
    let responses = []
    let users = []
    let uniq = []

    // Format ISO String to URL param string
    let since = '&since=' + isoString
    since += '&sort=created&direction=desc'

    try {
      // Fetch all routes asynchronously
      let [comments, issues, pulls, stats] = await Promise.all([
        github.comments(repo + path.comments, isoString),
        github.since(repo + path.issues + since),
        github.since(repo + path.pulls + since),
        github.stats(repo + path.stats),
      ]).catch((e) => {
        console.error(chalk.red(e))
      })
      // If callbacks are not empty,
      // add their contents to generic data wrapper
      if (comments.length) {
        responses.push(comments)
      }

      if (issues.length) {
        responses.push(issues)
      }

      if (pulls.length) {
        responses.push(pulls)
      }

      if (stats.length) {
        responses.push(stats)
      }

      // Add pages of array objects to one uniform array
      responses.map((response) => {
        response.map((data) => {
          users.push(data)
        })
      })

      users.map((user) => {
        if (!uniq.includes(user.login)) {
          uniq.push(user.login)
        }
      })

      // Return combined user data
      uniq.map((login, i) => {
        users.map((user) => {
          // Set first loop values
          let comments = 0
          let total = 0

          if (login === user.login) {
            // Update value if properties exist
            if (uniq[i].comments) {
              comments = uniq[i].comments
            }

            if (uniq[i].total) {
              total = uniq[i].total
            }

            // Return an object in custom mapped array
            uniq[i] = {
              login: login,
              comments: (comments += user.comments),
              total: (total += user.total),
            }

            return uniq[i]
          }
        })
      })

      // Sort by Comments
      let sortedUsers = uniq.sort((a, b) => b.comments - a.comments)
      return sortedUsers
    } catch (err) {
      console.error(chalk.red(err))

    }
  },
}
module.exports = comments
