const mongoose = require('mongoose')

const { Schema } = mongoose
const { Types: { ObjectId } } = Schema

const userSchema = new Schema({
    name: {  // 이름
        type: String,
        required: true,
    },
    email: { // 연락처
        type: String,
        required: true,
        unique: true,
    },
    userId: { // 아이디
        type: String,
        required: true,
    },
    password: { // 비밀번호
        type: String,
        required: true,
    },
    isAdmin: { // 관리자 여부
        type: Boolean,
        default: false,
    },
    createdAt: { // 가입날짜
        type: Date,
        default: Date.now,
    },
    lastModifiedAt: { // 수정날짜
        type: Date,
        default: Date.now,
    },
    token: {  // DB에 저장하여 테스트하기 위해 시험적으로 사용
        type: String,
    }
})

const Saleuser = mongoose.model('Saleuser', userSchema)
module.exports = Saleuser