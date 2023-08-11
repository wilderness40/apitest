const mongoose = require('mongoose')

const { Schema } = mongoose
const { Types: { ObjectId } } = Schema

const productsSchema = new Schema({
    user: { // 사용자 ID
        type: ObjectId,
        required: true,
        ref: 'Saleuser',
    },
    name: { // 이름
        type: String,
        required: true,
        trim: true,
    },
    category: { // 카테고리
        type: String,
        required: true,
        trim: true,
    },
    imgUrl: { // 이미지 경로
        type: String,
        required: true,
        trim: true,
    },
    description: { // 설명
        type: String,
    },
    createdAt: { // 생성날짜
        type: Date,
        default: Date.now,
    },
    lastModifiedAt: { // 수정날짜
        type: Date,
        default: Date.now,
    }
})

const Productlist = mongoose.model('Productlist', productsSchema)
module.exports = Productlist