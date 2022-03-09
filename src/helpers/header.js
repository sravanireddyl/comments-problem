const path = require('./path')
const chalk = require('chalk')

const header = {
  /**
   * Check for remaining subsequent calls deoending on response headers.
   * @param  {} headers
   * @param  {} direction
   * @param  {} date
   */
  async checkHeader(headers, direction, date) {
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
        nextURL = link.substring(link.indexOf(nextBegin), link.indexOf(nextEnd))
        lastURL = link.substring(link.indexOf(lastBegin), link.indexOf(lastEnd))

        // Create new strings of "next" & "last" URLs
        next = nextURL.replace(nextBegin, '')
        last = lastURL.replace(lastBegin, '')
      }

      if (last.length > 0 && next.length > 0) {
        switch (direction) {
          // Issues & Pulls routes
          case 'since':
            hasCallback = await path.path(next, last, false)
            break
          // Repo comments route
          case 'continuous':
            hasCallback = await path.path(next, last, date)
            break
        }
      }

      if (hasCallback) {
        return hasCallback
      }
    } catch (e) {
      console.error(chalk.red(e))
    }
  },
}

module.exports = header
