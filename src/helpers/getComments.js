const getComment = {
  async getComment(logins) {
    const comments = []
    const uniqueLogins = []

    try {
      // Create unique array of logins & data template
      await logins.map((login) => {
        if (!uniqueLogins.includes(login)) {
          uniqueLogins.push(login)

          // Create data template
          comments.push({
            login: login,
            comments: 0,
            total: 0,
          })
        }
      })

      // Map all logins to unique data template
      await logins.map((login) => {
        uniqueLogins.map((unique) => {
          if (login === unique) {
            let index = comments.findIndex(
              (comment) => comment.login === unique,
            )
            comments[index]['comments'] += 1
          }
        })
      })

      return comments
    } catch (e) {
      console.log(e)
    }
  },
}

module.exports = getComment
