const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const taskSchema =  mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    isCompleted: {
        type: Boolean,
        default: false
    }
})

taskSchema.pre('save', async function (next) {
    console.log('Just before saving!')

    if (this.isModified('description')) {
        this.description = this.description + '!'
    }

    next()
})

const Task = mongoose.model('Task', taskSchema)

module.exports = Task