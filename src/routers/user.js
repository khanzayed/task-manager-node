const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const sharp = require('sharp')
const sendGrid = require('../emails/accounts.js')

const User = require('../models/user')

router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        const token = await user.generateAuthToken()
        const { name, age } = user

        await user.save()

        sendGrid.sendWelcomeEmail(user.email, user.name)

        res.status(200).send({ user, token })
    } catch (e) {
        res.status(400).send(error)
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        await user.save()

        res.status(200).send({ user, token })
    } catch (e) {
        res.status(404).send(error)
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => (token !== req.token))
        await req.user.save()

        res.status(200).send('LogOut done!')
    } catch (e) {
        res.status(404).send(error)
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()

        res.status(200).send('LogOut for all done!')
    } catch (e) {
        res.status(404).send(error)
    }
})

router.get('/users', auth, async (req, res) => {
    try {
        res.status(200).send(req.user)
    } catch (e) {
        res.status(404).send(error)
    }
})

router.patch('/users', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValisOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValisOperation) {
        return res.status(400).send('Invalid updates!')
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()

        // const result = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true})
        // if (!result) {
        //     return res.status(404).send()
        // }
        const { name, age } = req.user
        res.status(200).send({ name, age })
    } catch (e) {
        res.status(404).send(error)
    }
})

router.delete('/users/delete', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.sendStatus(200).send(req.user)
    } catch (e) {
        res.status(404).send(error)
    }
})

const multer = require('multer')
var upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, callback) {
        if (file.originalname.endsWith('.jpg') || file.originalname.endsWith('.jpeg') || file.originalname.endsWith('.jpeg')) {
            callback(undefined, true)
        } else {
            callback(new Error('File must be of type JPEG, JPG or PNG!'))
        }
    }
})

router.post('/users/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 300, height: 300 }).png().toBuffer()
    req.user.avatar = buffer

    try {
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(400).send({ error: e.message })
    }
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.delete('/users/avatar', auth, async (req, res) => {
    req.user.avatar = undefined

    try {
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(400).send({ error: e.message })
    }
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

//
//http://localhost:3000/users/5db4402c85d4d236779c10f9/avatar
router.get('/users/:id/avatar', async (req, res) => {
    try {

        const user = await User.findById(req.params.id)
        if (!user.avatar) {
            throw new Error('No file found!')
        }

        res.set('Content-Type', 'image/png')
        res.status(200).send(user.avatar)
    } catch (error) {
        res.status(404).send({ error: error.message })
    }
})

module.exports = router