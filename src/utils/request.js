const superAgent = require('superagent')
const saProxy = require('superagent-proxy')

const userAgents = require('../const/userAgent')
const { spiderUrl } = require('../../config/spider.json')

saProxy(superAgent) // superAgent class add proxy method

const randomUA  = () => {
    const len = userAgents.length
    const randomNum = parseInt(Math.random() * len)
    return userAgents[randomNum]
}

const request = function(url, cb) {
    return superAgent.get(url)
        .set('referer', spiderUrl)
        .set('User-Agent', randomUA())
        .end(cb)
}

module.exports = request
