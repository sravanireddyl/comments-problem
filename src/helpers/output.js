const leftPad = require('left-pad')

module.exports = function(users) {
  // Log empty lines for readability
  console.log('')
  console.log('')
  let spaces
  // Print to command line
  if (users && users[0]) {
    spaces = users[0].comments.toString().length

    users.map((user) => {
      let comments = leftPad(user.comments.toString(), spaces)
      let login = user.login
      let commits = user.total

      console.log(`${comments} comments, ${login} (${commits} commits)`)
    })
  }
}
