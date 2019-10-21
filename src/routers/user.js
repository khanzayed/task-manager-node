const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')

const User = require('../models/user')

router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        const token = await user.generateAuthToken()
        const { name, age } = user

        await user.save()
        res.status(200).send({ name, age, token })
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

module.exports = router