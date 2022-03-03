const argv = require('yargs').argv
const chalk = require('chalk')
const getComments = require('./helpers/comments');
const output = require('./helpers/output')
async function start() {
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
      const data = await getComments(repo, isoString);
      output(data);
    } else {
      console.log('\nInvalid repo, please try again')
    }
  } catch (err) {
    console.log(err)
    console.error(chalk.red(err))
    
  }
}

start();
