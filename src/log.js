const log4js = require('log4js')

log4js.configure({
    appenders: {
        console: { type: 'console' },
        spider: {
            type: 'file',
            filename: 'logs/spider.log',
            maxLogSize: 100 * 1024 * 1024, // 100Mb
            encoding: 'utf-8',
        },
        summary: {
            type: 'file',
            filename: 'logs/summary.log',
            maxLogSize: 1024 * 1024, // 1Mb
            encoding: 'utf-8',
        },
        error: {
            type: 'file',
            filename: 'logs/error.log',
            maxLogSize: 10 * 1024 * 1024,
            encoding: 'utf-8',
            flag: 'w+',
        }
    },
    replaceConsole: true,
    pm2: true,
    categories: {
        default: { appenders: ['console'], level: 'info' },
        spider: { appenders: ['console', 'spider'], level: 'info' },
        summary: { appenders: ['console', 'summary'], level: 'info' },
        error: { appenders: ['console', 'error'], level: 'error' },
    }
})

exports.logger = log4js.getLogger('spider')
exports.errorLogger = log4js.getLogger('error')
exports.summaryLogger = log4js.getLogger('summary')
