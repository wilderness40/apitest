
/* 환경설정 - 모듈임포트 */
const express = require('express')
const User = require('../models/User')
const expressAsyncHandler = require('express-async-handler')
const { generateToken, isAuth } = require('../../auth')

const router = express.Router()

/* api 라우터 설계 - 시작 */
// 회원가입
router.post('/register', expressAsyncHandler(async(req, res, next) => {
    console.log(req.body)
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        userId: req.body.userId,
        password: req.body.password,
    })
    user.token = generateToken(user) // 토큰 생성
    const newUser = await user.save() // DB에 저장한다
    if(!user){  
        res.status(401).json({ code: 401, message: '회원정보를 모두 입력해주세요'})
        console.log('회원정보를 모두 입력해주세요')
    }else{
        const { name, email, userId, password, isAdmin, createdAt, token} = newUser
        res.json({
            code: 200,
            // token: generateToken(newUser),  // 로그아웃 기능을 위해 DB에 토큰을 저장함
            message: '회원가입이 완료되었습니다',
            name, email, userId, password, isAdmin, createdAt, token
        })
        console.log('회원가입이 완료되었습니다')
    }   
}))
// 로그인
router.post('/login', expressAsyncHandler(async(req, res, next) => {
    const loginUser = await User.findOne({
        email: req.body.email,
        password: req.body.password,
    })

    if(!loginUser){
        res.status(401).json({ code: 401, messagae: '입력한 정보가 올바르지 않습니다'})
        console.log('입력한 정보가 올바르지 않습니다')
    }else{
        const { name, email, userId, isAdmin, lastModifiedAt } = loginUser
        res.json({
            code:200,
            message: `${loginUser.name} 님의 방문을 환영합니다`,
            token: generateToken(loginUser),
            name, email, userId, isAdmin, lastModifiedAt,
        })  
        console.log(`${loginUser.name} 님의 방문을 환영합니다`)
    }
}))
// 로그아웃
router.post('/logout', isAuth, expressAsyncHandler(async(req, res, next) => {
    const loginUser = await User.findOne({
        email: req.body.email,
        password: req.body.password,
    })
    if(!loginUser || !loginUser.token){
        res.status(404).json({ code: 404, messagae: '이미 로그아웃 되었습니다'})
        console.log('이미 로그아웃 되었습니다')
    }else {
        loginUser.token = ""  // DB 내 토큰 초기화
        const logoutUser = await loginUser.save()
        res.status(200).json({
            code:200,
            token: '토큰 초기화, 다시 로그인하세요',
            message: '정상적으로 로그아웃 되었습니다',
        })  
        console.log('정상적으로 로그아웃 되었습니다')
    }
}))
// 사용자정보 변경
router.put('/:id', isAuth, expressAsyncHandler(async(req, res, next) => {
    const user = await User.findById(req.params.id)
    if(!user){ 
        res.status(404).json({ code: 404, message: '회원정보가 존재하지 않습니다'})
        console.log('회원정보가 존재하지 않습니다')
    }else{
        user.password = req.body.password || user.password
        user.isAdmin = req.body.isAdmin || user.isAdmin
        user.lastModifiedAt = new Date()

        const updatedUser = await user.save() // DB에 저장한다
        const { name, email, userId, isAdmin, lastModifiedAt  } = updatedUser
        res.json({
            code:200, 
            message: '회원정보가 수정되었습니다',
            token: generateToken(updatedUser), 
            name, email, userId, isAdmin, lastModifiedAt
        })
        console.log('회원정보가 수정되었습니다')
    }
}))
// 사용자정보 삭제
router.delete('/:id', isAuth, expressAsyncHandler(async(req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id)
    if(!user){
        res.status(404).json({ code: 404, message: '회원정보가 존재하지 않습니다'})
        console.log('회원정보가 존재하지 않습니다')
    }else{
        res.status(204).json({ code: 204, message: '회원탈퇴가 정상처리 되었습니다'})
        console.log('회원탈퇴가 정상처리 되었습니다')
    }
}))
/* api 라우터 설계 - 끝*/

// 라우터 익스포트
module.exports = router