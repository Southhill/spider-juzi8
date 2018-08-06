const mongoose = require('mongoose')

const spiderConf = require('../config/spider.json')
const dbConf = require('../config/db.json')
const MainSpider = require('./spider/main')
const SourceSpider = require('./spider/source')
const { logger } = require('./log')
const { chock } = require('./util')

const { authInfo, dbUri } = dbConf
const { entryUrl } = spiderConf

mongoose.connect(dbUri, authInfo)

global.toSpiderUrlList = [entryUrl]
global.toSpiderSourceUrlList = []
global.spideredFailUrlList = []

logger.info('爬虫程序开始运行......')
logger.info('准备爬取第一个类别')
while(global.toSpiderUrlList.length) {
    new MainSpider(global.toSpiderUrlList.shift())
    chock(2000)
}
logger.info('准备爬取第二个类别')
while(global.toSpiderSourceUrlList.length) {
    new SourceSpider(global.toSpiderSourceUrlList.shift())
    chock(2000)
}
logger.info(`爬取失败的网址共有${global.spideredFailUrlList.length}条`)
logger.info('爬虫程序结束运行......')
