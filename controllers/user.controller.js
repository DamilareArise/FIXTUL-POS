const express = require("express");
const userRegModel = require('../models/user.model')
const jwt = require('jsonwebtoken')

const signinPage = (req, res) =>{
    res.render('signin', { status: true, message: 'Invalid Password' })
}

const signin = (req, res) =>{
  userRegModel.findOne({ username: req.body.username })
    .then((data) => {
      if (data) {
        // valid username
        data.validatePassword(req.body.password, (err, isMatch) => {
          if (!isMatch) {
            // invalid password
            res.render('signin', { status: false, message: 'Invalid Password' });
          } else {
            // valid password
            const token = jwt.sign({ userId: data._id }, process.env.SECRET_KEY, {
              expiresIn: '24h'
            });
            // Store token in cookies (optional) or session, then redirect to a dashboard
            req.session.token = token
            res.redirect('/'); 
          }
        });
      } else {
        // invalid email
        res.render('signin', { status: false, message: 'User not found' });
      }
    })
    .catch((err) => {
      res.render('signin', { status: false, message: err.message });
    });
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
        res.redirect('/user')
    })
    .catch((err) => {
        res.send({ status: false, message: err })
    })
}

const logout = (req, res)=>{
  req.session.destroy()
  res.redirect('/user')
}

module.exports = {signinPage, signin, registerPage, register, logout}