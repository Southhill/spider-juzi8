const superagent = require('superagent')
const cheerio = require('cheerio')

const { logger, errorLogger } = require('../log')
const { JuziModel } = require('../schemas')
const { spiderUrl } = require('../../config/spider.json')

class MainSpider {
    constructor(url) {
        this.url = url,
        this.resultList = []

        logger.info(`开始爬取网址：${this.url}`)
        const self = this
        superagent.get(self.url).set('referer', spiderUrl).end(function (err, res) {
            // 抛错拦截
            if (err) {
                global.spideredFailUrlList.push({ url: self.url, reason: '爬取失败', type: 'main' })
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
        const $container = $('.main3 .left')
        const $listHTML = $container.find('.sons .cont')
        $listHTML.each((idx, ele) => {
            const $ele = $(ele)
            const content = $ele.children().eq(0).text()
            const source = $ele.children().eq(2).text() || '未知'
            const href = $ele.children().eq(2).href
            if (href) {
                if (global.toSpiderSourceUrlList.indexOf(href) === -1) {
                    global.toSpiderSourceUrlList.push(href)
                }
            }
            this.resultList.push({ content, source })
        })

        const $page = $container.find('.pages')
        this.discoverNewUrls($page)

        this.archiveResult()
        
    }

    archiveResult() {
        JuziModel.create(this.resultList).then(res => {
            logger.info(`归档网址：${this.url}分析后的内容`)
        }).catch(err => {
            global.spideredFailUrlList.push({ url: this.url, reason: '归档失败', type: 'main' })
            errorLogger.error(`归档网址：${this.url}失败:\n${err}`)
        })
    }

    discoverNewUrls($page) {
        $page.find('a').each((idx, a) => {
            const url = a.href
            if (url) {
                if (global.toSpiderUrlList.indexOf(url) === -1) {
                    global.toSpiderUrlList.push(url)
                }
            }
        })
    }
}

module.exports = MainSpider
