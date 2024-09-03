const express = require('express')
const { signinPage, registerPage, register, signin } = require('../controllers/user.controller')
const userRouter = express.Router()

userRouter.get('/', signinPage)
userRouter.get('/encoded-reg', registerPage)
userRouter.post('/register', register)
userRouter.post('/signin', signin)

module.exports = userRouter