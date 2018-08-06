const mongoose = require('mongoose')

const Schema = mongoose.Schema

const Juzi = new Schema({
    content: String,
    source: String,
})

const Source = new Schema({
    name: String,
    desc: String,
    imgUrl: String,
})

const JuziModel = mongoose.model('Juzi', Juzi)
const SourceModel = mongoose.model('Source', Source)

module.exports = {
    JuziModel,
    SourceModel
}
