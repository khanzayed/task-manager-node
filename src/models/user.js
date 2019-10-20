const mongoose = require('mongoose')
const validator = require('validator')

const User = mongoose.model('User', {
    name: {
        type: String,
        trim: true,
        required: [true, 'Name cannot be nil']
    }, 
    email: {
        type: String,
        requred: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be greater than 0')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (value.length < 7) {
                throw new Error('Password must be greater than 6 charachters')
            }

            if (validator.contains(value, 'password')) {
                throw new Error('Password cannot contain password')
            }
        }
    }
})

module.exports = User;