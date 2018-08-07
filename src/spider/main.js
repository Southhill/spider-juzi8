const superagent = require('superagent')
const cheerio = require('cheerio')

const { logger, errorLogger } = require('../log')
const { JuziModel } = require('../schemas')
const { spiderUrl } = require('../../config/spider.json')
const { baseUrl } = require('../const')

class MainSpider {
    constructor(url, cb) {
        this.url = url,
        this.finishHandler = () => {
            if (global.toSpiderUrlList.length) {
                const url = global.toSpiderUrlList.shift()
                new MainSpider(url)
                global.spideredUrlList.push(url)
            } else {
                if (typeof MainSpider.finished === 'function') {
                    MainSpider.finished()
                }
            }
        }
        this.resultList = []

        logger.info(`开始爬取网址：${this.url}`)
        const self = this
        superagent.get(self.url).set('referer', spiderUrl).end(function (err, res) {
            // 抛错拦截
            if (err) {
                global.spideredFailUrlList.push({ url: self.url, reason: '爬取失败', type: 'main' })
                errorLogger.error(`爬取网址${self.url}失败:\n ${err}`)
            }
            logger.info(`爬取网址：${self.url}结束.`)
            self.analysisPage(res)
        })
    }

    analysisPage(res) {
        logger.info(`分析网址：${this.url}爬取后的内容`)
        const $ = cheerio.load(res.text, {
            decodeEntities: false
        })
        const $container = $('.main3 .left')
        const $listHTML = $container.find('.sons').children()
        $listHTML.each((idx, ele) => {
            const $ele = $(ele)
            const content = $ele.children().eq(0).text()
            const $source = $ele.children().eq(2)
            let source
            if ($source.length) {
                source = $source.text()
                const href = $source.attr('href')
                if (href) {
                    const realHref = `${baseUrl}${href}`
                    if (global.spideredUrlList.indexOf(realHref) === -1) {
                        global.toSpiderSourceUrlList.push(realHref)
                    }
                }
            } else {
                source = '未知'
            }
            this.resultList.push({ content, source })
        })

        const $page = $container.find('.pages')
        this.discoverNewUrls($page)

        this.archiveResult()
        
    }

    archiveResult() {
        JuziModel.create(this.resultList).then(res => {
            logger.info(`成功归档网址：${this.url}分析后的内容`)
        }).catch(err => {
            global.spideredFailUrlList.push({ url: this.url, reason: '归档失败', type: 'main' })
            errorLogger.error(`归档网址：${this.url}失败:\n${err}`)
        })
        this.finishHandler()
    }

    discoverNewUrls($page) {
        $page.find('a').each((idx, a) => {     
            const url = a.attribs.href
            if (url) {
                const realUrl = `${baseUrl}${url}`
                if (global.spideredUrlList.indexOf(realUrl) === -1) {
                    global.toSpiderUrlList.push(realUrl)
                }
            }
        })
    }
}


module.exports = MainSpider
