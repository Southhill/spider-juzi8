const superagent = require('superagent')
const cheerio = require('cheerio')

const { logger, errorLogger } = require('../log')
const { SourceModel } = require('../schemas')
const { spiderUrl } = require('../../config/spider.json')

class SourceSpider {
    constructor(url) {
        this.url = url,
        this.resultList = []

        logger.info(`开始爬取网址：${this.url}`)
        const self = this
        superagent.get(self.url).set('referer', spiderUrl).end(function (err, res) {
            // 抛错拦截
            if (err) {
                global.spideredFailUrlList.push({ url: self.url, reason: '爬取失败', type: 'source' })
                errorLogger.error(`爬取网址${self.url}失败:\n ${err}`)
            }
            self.analysisPage(res)
            logger.info(`爬取网址：${self.url}结束.`)
        })
    }

    analysisPage(res) {
        logger.info(`分析网址：${this.url}爬取后的内容`)
        const $ = cheerio.load(res.text, {
            decodeEntities: false
        })
        const $container = $('.main3 .right')
        const $listHTML = $container.find('.sonspic .cont')
        $listHTML.each((idx, ele) => {
            const $ele = $(ele)
            const imgUrl = $ele.find('divimg img').src
            const name = $ele.find('h2').text()
            const desc = $ele.children().last().text()
            
            this.resultList.push({ imgUrl, name, desc })
        })

        this.archiveResult()
    }

    archiveResult() {
        SourceModel.create(this.resultList).then(res => {
            logger.info(`归档网址：${this.url}分析后的内容`)
        }).catch(err => {
            global.spideredFailUrlList.push({ url: this.url, reason: '归档失败', type: 'source' })
            errorLogger.error(`归档网址：${this.url}失败:\n${err}`)
        })
    }
}

module.exports = SourceSpider
