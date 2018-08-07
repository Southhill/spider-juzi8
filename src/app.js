const spiderConf = require('../config/spider.json')
const dbConf = require('../config/db.json')
const MainSpider = require('./spider/main')
const SourceSpider = require('./spider/source')
const MongooseConf = require('./mongoose.conf')
const { logger } = require('./log')
const { finishSummary } = require('./util')

const { authInfo, dbUri } = dbConf
const { entryUrl } = spiderConf

global.toSpiderUrlList = [entryUrl] // 待爬取的网址类别1
global.toSpiderSourceUrlList = [] // 待爬取的网址类别2
global.spideredFailUrlList = [] // 爬取失败的网址
global.spideredUrlList = [] // 已爬取的网址
global.startTime = new Date()

logger.info('爬虫程序开始运行......')
const mgc = new MongooseConf(dbUri, authInfo) // 数据库配置

mgc.init(() => {
    logger.info('准备爬取第一个网址类别')
    const url = global.toSpiderUrlList.shift()
    new MainSpider(url)
    global.spideredUrlList.push(url)
})

MainSpider.finished = () => {
    logger.info('准备爬取第二个网址类别')
    const url = global.toSpiderSourceUrlList.shift()
    if (url) {
        new SourceSpider(url)
        global.spideredUrlList.push(url)
    }
}

SourceSpider.finished = () => {
    logger.info('爬虫程序结束运行......')
    finishSummary()
}

