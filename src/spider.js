const superagent = require('superagent')
const cheerio = require('cheerio')

const { logger, errorLogger } = require('./log')

class Spider {
    constructor(url) {
        this.url = url

        logger.info(`开始爬取网址：${this.url}`)
        superagent.get(this.url).end(function (err, res) {
            // 抛错拦截
            if (err) {
                global.spideredFailUrlList.push(this.url)
                errorLogger.error(`爬取网址${this.url}失败`, err)
            }
            this.analysisPage(res)
            console.log('爬虫程序结束运行......')
        })
        logger.info(`爬取网址：${this.url}结束.`)
    }

    analysisPage(res) {
        logger.info(`分析网址：${this.url}爬取后的内容`)
        let $ = cheerio.load(res.text, {
            decodeEntities: false
        })
        let $container = $('.main3 .left')
        let $listHTML = $container.find('.sons .cont')
        fs.writeFileSync('juzis.txt', '', 'utf8')
        logger.info(`存储网址：${this.url}分析后的内容`)
        $listHTML.each((idx, ele) => {
          const $ele = $(ele)
          const text = $ele.find('span').first().text()
          const author = $ele.find('a').first().text()
            // let juziData = new Juzi({
            //     authorName: author || '未知',
            //     text: text
            // })
            // juziData.save(err => {
            //     if (err) {
            //         console.log(err)
            //     } else {
            //         console.log('存储成功')
            //     }
            // })
          fs.appendFileSync('juzis.txt', `${idx + 1}. ${text} - ${author || '未知'}\n`, 'utf8')
        })
    }

    archiveItem() {

    }

    pushDiscoverUrl() {

    }
}

module.exports = Spider
