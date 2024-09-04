const express = require('express')
const { signinPage, registerPage, register, signin, logout } = require('../controllers/user.controller')
const userRouter = express.Router()
const jwt = require('jsonwebtoken')

userRouter.get('/', signinPage)
userRouter.get('/encoded-reg', registerPage)
userRouter.post('/register', register)
userRouter.post('/signin', signin)
userRouter.get('/logout', logout)

module.exports = userRouter