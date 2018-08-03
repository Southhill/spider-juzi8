const mongoose = require('mongoose')

const Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

exports.Juzi = new Schema({
    author: ObjectId,
    text: String,
    translateTe: String,
    authorName: String
})

exports.Author = new Schema({
    name: String
})
