/*
  To test one set of user data, swap out the "login"
  variable in the equality of "i.login === login"
  with the string of the user's login

  Ex: 'randomUser'
*/

const debug = {
  async debug(init, login, comments, issues, pulls, stats, uniq) {
    if (init === true) {
      console.log('-----')

      comments.map((i) => {
        if (i.login === login) {
          console.dir(i, { colors: true, depth: 4 })
        }
      })

      issues.map((i) => {
        if (i.login === login) {
          console.dir(i, { colors: true, depth: 4 })
        }
      })

      pulls.map((i) => {
        if (i.login === login) {
          console.dir(i, { colors: true, depth: 4 })
        }
      })

      stats.map((i) => {
        if (i.login === login) {
          console.dir(i, { colors: true, depth: 4 })
        }
      })

      uniq.map((i) => {
        if (i.login === login) {
          console.log('')
          console.log('COMBINED DATA IS ...')
          console.dir(i, { colors: true, depth: 4 })
          console.log('')
        }
      })
    }
  },
}

module.exports = debug
