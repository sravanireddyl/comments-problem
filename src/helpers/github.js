
const github = {}
const axios = require('axios')
const config = require('../config')
const getComments = require('./getComments')
const checkHeaders = require('./header')
const get = require('./get')

github.comments = async function (route, since) {
    
  const date = new Date(since);
  let logins = []
  let comments =[];
  firstLogins = []
    try {
        let response = await get(route);
        // If we have a response
        if (response && response.statusText === 'OK') {
            const headers = response.headers

            // Fetch last page and reverse
            remainingLogins = await checkHeaders(headers, 'continuous', date)

            // Add results to logins array
            if (remainingLogins) {
                logins = [...remainingLogins]
            }

            // Filter first request by Date/Time
            await response.data.map(stats => {
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
            comments = await getComments(logins)
        }

        return comments
    } catch (e) {
        console.log(e)
    }

}
github.since = async function(route) {
    let logins = []
    let comments = []
    let firstLogins = []
    let remainingLogins = []
  
    try {
      const json = await get(route)
    
      // If we have a response
      if (json && json.statusText === 'OK') {
        const headers = json.headers
        remainingLogins = await checkHeaders(headers, 'since', false)
  
        // Add results to logins array
        if (remainingLogins) {
          logins = [...remainingLogins]
        }
  
        await json.data.map(stats => {
          if (stats.user['login']) {
            firstLogins.push(stats.user['login'])
          }
        })
  
        // Merge all logins into one array
        logins = [...logins, ...firstLogins]
  
        // Count how many logins in array as a comment
        comments = await getComments(logins)
      }
  
      return comments
    } catch (e) {
        console.log(e);

    }
  }
  
  github.stats = async function(route) {
    const totals = []
  
    try {
      const json = await get(route)
  
      // If we have a response
      if (json && json.statusText === 'OK') {
        // Create JSON schema template
        await json.data.map(stats => {
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
     console.log(e);
    }
  }
module.exports = github

