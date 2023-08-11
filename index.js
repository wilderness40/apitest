/* 환경설정 - 시작*/
// 패키지 임포트
const express = require('express') // expres 임포트
const app = express()
const cors = require('cors')
const logger = require('morgan')
const mongoose = require('mongoose')

const axios = require('axios')

const usersRouter = require('./src/routes/users')
const productsRouter = require('./src/routes/products')
const config = require('./config')


let products = {}

// 몽고DB 연결
mongoose.connect(config.MONGODB_URL)
.then(() => console.log('몽고DB가 연결되었습니다'))
.catch(e=> console.log(`몽고DB 연결오류 발생 : ${e}`))


/* 환경설정 - 끝*/


/* 공통 미들웨어 - 시작*/ 
app.use(express.json()) // request body 파싱
app.use(logger('tiny')) // logger 설정

app.use('/api/users', usersRouter) // user라우터 설정
app.use('/api/products', productsRouter) // product라우터 설정
/* 공통 미들웨어 - 끝 */

/* api 설계 - 시작*/
app.get('/hello', (req, res) => {  // 서버연결 테스트
    res.json('연결테스트')
    console.log('연결테스트')
})

// 폴백 핸들러
app.use((req, res, next) => {  // 사용자가 요청한 페이지가 없는 경우
    res.status(404).send('페이지를 찾을 수 없습니다')
    console.log('페이지를 찾을 수 없습니다')
})
app.use((err, req, res, next) => { // 서버 내부 오류 처리
    console.error(err.stack)
    res.status(500).send('서버에 문제가 발생하였습니다.')
    console.log('서버에 문제가 발생하였습니다.')
})

/* api 설계 - 끝*/

/* 서버실행 */
app.listen(3500, () => {  
    console.log('포트 연결완료 : 3500')
})
