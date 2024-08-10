const express = require('express')
const router = express.Router()


router.get('/fixinvo',(req, res)=>{
    res.render('fixinvo')
})

router.get('/',(req, res)=>{
    res.render('invoice')
})

router.get('/fixhistory',(req, res)=>{
    res.render('fixhistory')
})

router.get('/invoicedetail',(req, res)=>{
    res.render('invoicedetail')
})

router.get('/salesin',(req, res)=>{
    res.render('salesin')
})

router.get('/saleshistory',(req, res)=>{
    res.render('saleshistory')
})

router.get('/reciept',(req, res)=>{
    res.render('reciept')
})


module.exports = router