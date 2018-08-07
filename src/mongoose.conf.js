const mongoose = require('mongoose')

const { JuziModel, SourceModel } = require('./schemas')
const { logger, errorLogger } = require('./log')


class MongooseConf {
    constructor(dbUri, authInfo) {
        this.dbUri = dbUri
        this.authInfo = authInfo
    }
    init(cb) {
        logger.info('配置数据库，并进行初始化操作。')
        mongoose.connect(this.dbUri, this.authInfo)
        Promise.all([JuziModel.remove(), SourceModel.remove()])
            .then(() => {
                logger.info('移除数据库表残留数据')
                if (typeof cb === 'function') {
                    cb()
                }
            })
            .catch(err => {
                errorLogger.error('移除数据库表残留数据失败', err)
            })
    }
}

module.exports = MongooseConf
