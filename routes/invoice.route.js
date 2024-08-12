const express = require('express')
const router = express.Router()
const invoiceModel = require('../models/invoice.model')


router.get('/fixinvo',(req, res)=>{
    res.render('fixinvo',{saved:true})
})

router.post('/fix-invoice', (req, res)=>{
    invoiceInfo = req.body;
    let form = new invoiceModel(invoiceInfo)
    form.save()
    .then(()=>{
        console.log('Invoice saved')
        res.redirect('fixhistory')
    })
    .catch((err)=>{
        console.log(err,'Invoice not saved')
        res.render('fixinvo', {saved: false})
    })
})

router.get('/',(req, res)=>{
    res.render('invoice')
})

router.get('/fixhistory',(req, res)=>{
    invoiceModel.find()
    .then((invoices)=>{
        console.log(invoices);
        
        res.render('fixhistory',{invoices:invoices})
    })
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