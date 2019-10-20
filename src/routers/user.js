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
        await user.generateAuthToken()
        await user.save()

        res.status(200).send(user)
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

// router.get('/users/:id', auth, async (req, res) => {
//     const __id = req.params.id

//     try {
//         await User.findById(__id)

//         res.status(200).send(result)
//     } catch (e) {
//         res.status(404).send(error)
//     }
// })

router.patch('/users/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValisOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValisOperation) {
        return res.status(400).send('Invalid updates!')
    }

    try {
        const user = await User.findById(req.params.id)
        updates.forEach((update) => user[update] = req.body[update])
        await user.save()

        // const result = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true})
        // if (!result) {
        //     return res.status(404).send()
        // }
        const { name, age } = user
        res.status(200).send({ name, age })
    } catch (e) {
        res.status(404).send(error)
    }
})

router.delete('/users/:id', auth, async (req, res) => {
    try {
        const result = User.findByIdAndDelete(req.params.id)
        if (!result) {
            return res.status(404).send()
        }

        res.sendStatus(200).send()
    } catch (e) {
        res.status(404).send(error)
    }
})

module.exports = router