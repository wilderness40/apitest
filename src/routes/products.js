/* 환경설정 - 모듈임포트 */
const express = require('express')
const Product = require('../models/Product')
const expressAsyncHandler = require('express-async-handler')
const { isAuth } = require('../../auth')

const mongoose = require('mongoose')
const { Types: { ObjectId }} = mongoose

const router = express.Router()

/* api 라우터 설계 -  시작 */
// 상품등록
router.post('/', isAuth, expressAsyncHandler(async(req, res, next) => {
    // 이미 존재하는 상품 거르기
  const existProduct = await Product.findOne({
    user: req.user._id,
    name: req.body.name,
    })
    if(existProduct){
       res.status(405).json({ code: 405, message: '이미 존재하는 제품입니다'})
       console.log('이미 존재하는 제품입니다')
    }else{
      const product = new Product({
        user: req.user._id,
        name: req.body.name,
        category: req.body.category,
        imgUrl: req.body.imgUrl,
    })
    const newProduct = await product.save() // DB에 저장한다
    if(!product){
        res.status(401).json({ code: 401, message: '제품 정보를 입력해주세요'})
        console.log('제품 정보를 입력해주세요')
    }else{
        res.status(200).json({
            code: 200,
            message: '제품이 등록되었습니다',
            newProduct,
        })
        console.log('제품이 등록되었습니다')
    }
}
}))
// 전체 상품 조회
router.get('/', isAuth, expressAsyncHandler(async(req, res, next) => {
    const products = await Product.find({ user: req.user._id}).populate('user')
    if(products.length == 0){
        res.status(404).json({ code: 404, message: '제품을 찾을 수 없습니다'})
        console.log('제품을 찾을 수 없습니다')
    }else
    res.status(200).json({code: 200, message:'제품리스트', products})
    console.log('제품리스트 조회완료')
}))
// 특정 상품 조회
router.get('/:id', isAuth, expressAsyncHandler(async(req, res, next) => {
    const product = await Product.findOne({ 
        user: req.user._id, // isAuth(req.user = userInfo)에서 전달된 user id값
        _id: req.params.id, // url에 입력된 제품id값
    })
    if(!product){
        res.status(404).json({ code: 404, message: '제품을 찾을 수 없습니다'})
        console.log('제품을 찾을 수 없습니다')
    }else
    res.status(200).json({code: 200, message:'제품을 찾았습니다', product})
    console.log('제품을 찾았습니다')
}))
// 특정 상품 변경
router.put('/:id', isAuth, expressAsyncHandler(async(req, res, next) => {
    const product = await Product.findOne({
        user: req.user._id, // isAuth(req.user = userInfo)에서 전달된 user id값
        _id: req.params.id, // url에 입력된 제품id값
    })
    if(!product){
        res.status(404).json({ code: 404, message: '제품을 찾을 수 없습니다'})
        console.log('제품을 찾을 수 없습니다')
    }else{
        product.category = req.body.category || product.category 
        product.name = req.body.name || product.name 
        product.imgUrl = req.body.imgUrl || product.imgUrl 
        product.description = req.body.description || product.description 

        const updateProduct = await product.save() // DB에 저장한다
        const { category, name, imgUrl, description  } = updateProduct
        res.status(200).json({
            code: 200,
            message: '제품정보가 변경되었습니다',
            category, name, imgUrl, description,
        })
        console.log('제품정보가 변경되었습니다')
    }
}))
// 특정 상품 삭제
router.delete('/:id', isAuth, expressAsyncHandler(async(req, res, next) => {
    const product = await Product.findByIdAndDelete({
        user: req.user._id, // isAuth(req.user = userInfo)에서 전달된 user id값
        _id: req.params.id, // url에 입력된 제품id값
    })
    if(!product){
        res.status(404).json({ code: 404, message: '제품을 찾을 수 없습니다'})
        console.log('제품을 찾을 수 없습니다')
    }else{
        res.status(204).json({ code: 204, message: '제품이 삭제되었습니다'})
        console.log('제품이 삭제되었습니다')
    }
}))

// 라우터 익스포트
module.exports = router