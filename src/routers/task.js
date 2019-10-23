const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/tasks', auth, async (req, res) => {
    try {
        const task = await Task.find({ owner: req.user._id })
        
        if (task.length == 0) {
            return res.status(404).send('Not Found!')
        } 
        
        res.status(200).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.findOne({ _id, owner: req.user._id })
        if (!task) {
            return res.status(404).send('Not Found!')
        } 
        res.status(200).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'isCompleted']
    const isVerifiedOperation = updates.every((update) => allowedUpdates.includes(update))

    if (updates.length == 0 || !isVerifiedOperation) {
        return res.status(400).send('Invalid updates!')
    }

    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })
        if (!task) {
            return res.status(404).send('Not Found!')
        } 

        updates.forEach((update) => task[update] = req.body[update])
        await task.save()

        return res.status(200).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
        if (!task) {
            return res.status(404).send('Not Found!')
        } 

        return res.status(200).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router;