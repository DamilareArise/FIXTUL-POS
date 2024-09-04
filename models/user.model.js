const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userRegSchema = mongoose.Schema({
    email: { type: String, require: true, unique: true },
    username: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    date: { type: Date, default: Date.now }
})

let saltRound = 10
userRegSchema.pre('save', function (next) {
    bcrypt.hash(this.password, saltRound, (err, hashedPassword) => {
        console.log(this.password, hashedPassword);

        if (err) {
            console.log('password could not be hashed');
        }
        else {
            this.password = hashedPassword
            next()
        }
    })
})

userRegSchema.methods.validatePassword = function (password, callback) {
    bcrypt.compare(password, this.password, (err, isMatch) => {
        if (!err) {     
            callback(err, isMatch)
        }
        else {
            console.log('password could not be compared');
            next()
        }
    })
}

let userRegModel = mongoose.model('account_collection', userRegSchema)
module.exports = userRegModel