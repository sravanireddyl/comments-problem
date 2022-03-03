const apiBase = 'https://api.github.com'
const argv = require('yargs').argv
const axios = require('axios')
const config = require('./config')
const chalk = require('chalk')
const http = axios.create({
  baseURL: apiBase,
  headers: {
    Authorization: `token ${config.GITHUB_PERSONAL_ACCESS_TOKEN}`,
  },
})

async function printCommitCount() {
  try {

    const repo = argv.repo;
    const period = argv.period;
    if (repo) {
      // validate "--period"
      if (period && period.includes('d')) {
        days = period.replace(/([d])/g, '')
      }
      // convert "days" to number
      const time = parseInt(days, 0)
      let isoString = ''

      // convert time to ISO 8601 format
      if (time !== 0) {
        let date = new Date()
        date.setDate(date.getDate() - time)
        isoString = date.toISOString().replace(/(\..*)/g, 'Z')
      }
      //start(repo, isoString);
      console.log(repo);
      console.log(isoString)
    } else {
      error('\nInvalid repo, please try again')
    }
  } catch (err) {
    console.error(chalk.red(err))
    console.dir(err.response.data, { colors: true, depth: 4 })
  }
}

printCommitCount();
