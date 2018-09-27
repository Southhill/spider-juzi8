const { summaryLogger } = require('./log')
const { addEntity, getEntity } = require('node-gv')
const { JuziModel, SourceModel } = require('./schemas')

function chock(ms) {
    const dt = Date.now()
    while(Date.now() < dt + ms) {}
}

function finishSummary() {
    const et = new Date()
    const st = getEntity('startTime')
    const len = getEntity('spideredFailUrlList').length
    addEntity('endTime', et)
    const distTime = (et - st) / 1000
    const juziCount = JuziModel.estimatedDocumentCount()
    const sourceCount = SourceModel.estimatedDocumentCount()
    summaryLogger.info(`\n
    <-----------------summary start----------------->\n
    开始时间：${st.toLocaleString()}\n
    结束时间：${et.toLocaleString()}\n
    共计时间： ${distTime}秒\n
    爬取成功的Juzi共有 ${juziCount} 条\n
    爬取成功的Source共有 ${sourceCount} 条\n
    爬取失败的网址共有 ${len} 条\n
    <-----------------summary end----------------->\n
    `)
}

module.exports = {
    chock,
    finishSummary
}
