const get = require('../helpers/get')
const chalk = require('chalk')
module.exports = async function(next, last, date) {
  let routes = []
  let logins = []
  const begin = /.*(\?page=)/
  const end = /(&per_page=).*/
  const pattern = /.*(\?page=)|(&per_page=).*/
  const regex = new RegExp(pattern, 'g')
  const nextInt = parseInt(next.replace(regex, ''), 0)
  const lastInt = parseInt(last.replace(regex, ''), 0)
  const diff = lastInt - nextInt

  // Create placeholder route to inject
  // remaining routes in between "next" & "last"
  let url = ''
  let urlBegin = next.replace(end, '')
  let urlEnd = next.replace(begin, '')
  let start = urlBegin.slice(0, urlBegin.length - 1)
  let finish = urlEnd.slice(1)

  try {
    // First add routes we know we need
    await routes.push(next, last)

    // Inject remaining routes between "next" & "last"
    if (diff > 1) {
      for (let i = nextInt + 1; i < lastInt; i++) {
        url = start + i + finish
        await routes.push(url)
      }
    }

    // If supplied a date from /github/index.js
    if (date !== false) {
      let urls = routes.sort().reverse()

      // Fetch every URL simulataneously
      let jsonArray = await Promise.all(urls.map((url) => get(url))).catch(
        (e) => {
          console.error(chalk.red(e))
        },
      )

      // Map to logins array
      await jsonArray.map((json) => {
        json.data.map((data) => {
          let fetchDate = new Date(data.created_at)

          // Filter incoming JSON by Date/Time
          if (fetchDate > date && data.user['login']) {
            logins.push(data.user['login'])
          }
        })
      })
    } else {
      // Fetch every URL simulataneously
      let jsonArray = await Promise.all(
        routes.sort().map((route) => get(route)),
      ).catch((e) => {
        console.error(chalk.red(e))
      })

      // Map to logins array
      await jsonArray.map((json) => {
        json.data.map((data) => {
          if (data.user['login']) {
            logins.push(data.user['login'])
          }
        })
      })
    }

    return logins
  } catch (e) {
    console.error(chalk.red(e))
  }
}
