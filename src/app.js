const mongoose = require('mongoose')

const Schemas = require('../schemas')
const spiderConf = require('../config/spider.json')
const dbConf = require('../config/db.json')
const Spider = require('./spider')
const { logger } = require('./log')

const { authInfo, dbUri } = dbConf
const { spiderUrl } = spiderConf

mongoose.connect(dbUri, authInfo)

const Juzi = mongoose.model('Juzi', Schemas.Juzi)

global.toSpiderUrlList = [spiderUrl]
global.spideredFailUrlList = []

logger.info('爬虫程序开始运行......');
while(global.toSpiderUrlList.length) {
    Spider(global.toSpiderUrlList.shift())
}
logger.info('爬虫程序结束运行......')
