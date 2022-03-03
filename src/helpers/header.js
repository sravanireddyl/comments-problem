const path = require('./path')
const chalk =require('chalk');

module.exports = async function(headers, direction, date) {
  let nextURL = ''
  let lastURL = ''
  let next = ''
  let last = ''
  let hasCallback = false
  const link = headers['link']
  const nextBegin = '<'
  const nextEnd = '>; rel="next", <'
  const lastBegin = 'next", <'
  const lastEnd = '>; rel="last"'

  try {
    // Check if more pages exist
    if (link !== undefined) {
      nextURL = await link.substring(
        link.indexOf(nextBegin),
        link.indexOf(nextEnd),
      )
      lastURL = await link.substring(
        link.indexOf(lastBegin),
        link.indexOf(lastEnd),
      )

      // Create new strings of "next" & "last" URLs
      next = await nextURL.replace(nextBegin, '')
      last = await lastURL.replace(lastBegin, '')
    }

    if (last.length > 0 && next.length > 0) {
      switch (direction) {
        // Issues & Pulls routes
        case 'since':
          hasCallback = await path(next, last, false)
          break
        // Repo comments route
        case 'continuous':
          hasCallback = await path(next, last, date)
          break
      }
    }

    // Return array from "path()" function
    if (hasCallback) {
      return hasCallback
    }
  } catch (e) {
    console.error(chalk.red(e))
  }
}
