const { summaryLogger } = require('./log')
const { JuziModel, SourceModel } = require('./schemas')

function chock(ms) {
    const dt = Date.now()
    while(Date.now() < dt + ms) {}
}

function finishSummary() {
    global.endTime = new Date()
    const distTime = global.endTime - global.startTime / 1000
    const juziCount = JuziModel.estimatedDocumentCount()
    const sourceCount = SourceModel.estimatedDocumentCount()
    summaryLogger.info(`\n
    <-----------------summary start----------------->\n
    开始时间：${global.startTime.toLocaleString()}\n
    结束时间：${global.endTime.toLocaleString()}\n
    共计时间： ${distTime}秒\n
    爬取成功的Juzi共有 ${juziCount} 条\n
    爬取成功的Source共有 ${sourceCount} 条\n
    爬取失败的网址共有 ${global.spideredFailUrlList.length} 条\n
    <-----------------summary end----------------->\n
    `)
}

module.exports = {
    chock,
    finishSummary
}
