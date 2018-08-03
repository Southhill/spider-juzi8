const superagent = require('superagent')
const cheerio = require('cheerio')
const mongoose = require('mongoose')

const fs = require('fs')

const Schemas = require('./schemas')

const spiderConf = require('../config/spider.json')

const authInfo = {
    user: 'juzi8user',
    pass: '123456.pwd'
}
mongoose.connect('mongodb://@localhost:27017/juzi8', authInfo)

const Juzi = mongoose.model('Juzi', Schemas.Juzi)

console.log('爬虫程序开始运行......');
superagent.get(spiderConf.url).end(function (err, res) {
    // 抛错拦截
    if (err) {
        throw Error(err);
    }
    let $ = cheerio.load(res.text, {
        decodeEntities: false
    })
    let $container = $('.main3 .left')
    let $listHTML = $container.find('.sons .cont')
    fs.writeFileSync('juzis.txt', '', 'utf8')
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
    console.log('爬虫程序结束运行......')
});
