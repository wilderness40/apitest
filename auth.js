/* 환경설정 - 모듈 임포트 */
const config = require('./config')
const jwt = require('jsonwebtoken')


// 토큰 생성
const generateToken = (user) => {
    return jwt.sign({
        _id: user._id,
        name: user.name,
        email: user.email,
        userId: user.id,
        password: user.password,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt,
    },
    config.JWT_SECRET,
    {
        expiresIn: '1d',
        issuer : 'midbar',
    }
    )
}

// 사용자 권한 확인 
const isAuth = (req, res, next) => {
    const bearerToken = req.headers.authorization 
    if(!bearerToken){ // 토큰이 없는 경우
        res.status(401).json({ message: '토큰이 존재하지 않습니다'})
        console.log('토큰이 존재하지 않습니다')
    }else{
        const token = bearerToken.slice(7, bearerToken.length)
        jwt.verify(token, config.JWT_SECRET, (err, userInfo) => {
            if(err && err.name == 'TokenExpiredError'){ // 토큰만료 에러시
                res.status(419).json({ code: 419, message: '토큰이 만료되었습니다.'})
                console.log('토큰이 만료되었습니다')
            }else if(err){  // 그 외의 에러 발생시
                res.status(401).json({ code: 401, message: '유효한 토큰이 아닙니다'})
                console.log('유효한 토큰이 아닙니다')
            }else{ // 에러가 없을경우
                req.user = userInfo
                next()
            }
        })
    }
}

// 관리자 체크

const isAdmin = (req, res, next) => {
    if(req.user && req.user.isAdmin){
        next()
    }else{
        res.status(401).json({ code: 401, message: '관리자 권한이 없습니다.'})
        console.log('관리자 권한이 없습니다.')
    }
}

module.exports = {
    generateToken,
    isAuth,
    isAdmin,
}