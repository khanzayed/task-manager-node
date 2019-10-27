const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'Name cannot be nil']
    }, 
    email: {
        type: String,
        unique: true,
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
    },
    avatar: {
        type: Buffer
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
})

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('Email and password do not match!')
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('Email and password do not match!')
    }

    return user
}

userSchema.pre('save', async function(next) {
    console.log('Just before saving!')

    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8)
    }

    next()
})

userSchema.methods.generateAuthToken = async function() {
    const token = jwt.sign({ _id: this._id.toString() }, process.env.JWT_SECRET_KEY, { expiresIn: '7 days' })
    this.tokens = this.tokens.concat({ token })

    return token
}

userSchema.methods.verifyAuthToken = async function(token) {
    return jwt.verify(token, process.env.JWT_SECRET_KEY)
}

userSchema.methods.toJSON = function() {
    const userObject = this.toObject()
    delete userObject.tokens
    delete userObject.password
    delete userObject._id
    delete userObject.avatar

    return userObject
}

userSchema.pre('remove', async function(next) {
    await Task.deleteMany({ owner: this._id })

    next()
})

//userSchema.post()

const User = mongoose.model('User', userSchema)

module.exports = User;