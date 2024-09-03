const express = require("express");
const userRegModel = require('../models/user.model')

const signinPage = (req, res) =>{
    res.render('signin')
}

const signin = (req, res) =>{
    userRegModel.findOne({ email: req.body.email })
    .then((data) => {
      if (data) {
        // valid email
        data.validatePassword(req.body.password, (err, isMatch) => {
          if (!isMatch) {
            // invalid password
            res.send({ status: false, message: 'Invalid Password' })
          } else {
            // valid password
            res.render('invoice')
          }
        })
      } else {
        // invalid email
        res.send({ status: false, message: 'User not found' })
      }

    })
}

const registerPage = (req, res) =>{
    res.render('register')
}

const register = (req, res) =>{
    console.log(req.body);
    let form = userRegModel(req.body)
    form.save()
    .then((data) => {
        // res.send({ status: true, message: 'User created successfully' })
        res.redirect('/signin')
    })
    .catch((err) => {
        res.send({ status: false, message: err })
    })
}

module.exports = {signinPage, signin, registerPage, register}