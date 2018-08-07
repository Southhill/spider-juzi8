const { summaryLogger } = require('./log')

function chock(ms) {
    const dt = Date.now()
    while(Date.now() < dt + ms) {}
}

function finishSummary() {
    global.endTime = new Date()
    const distTime = global.endTime - global.startTime / 1000
    summaryLogger.info(`\n
    <-----------------summary start----------------->\n
    开始时间：${global.startTime.toLocaleString()}\n
    结束时间：${global.endTime.toLocaleString()}\n
    共计时间： ${distTime}秒\n
    爬取失败的网址共有${global.spideredFailUrlList.length}条\n
    <-----------------summary end----------------->\n
    `)
}

module.exports = {
    chock,
    finishSummary
}
