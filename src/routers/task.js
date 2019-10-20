const express = require('express')
const router = new express.Router()

const Task = require('../models/task')

router.post('/tasks', (req, res) => {
    const task = new Task(req.body)
    task.save().then(() => {
        res.status(201).send(task)
    }).catch((error) => {
        res.status(400).send(error)
    })
})

router.get('/tasks', async (req, res) => {
    try {
        const task = await Task.find()
        res.status(200).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const task = Task.findById(_id)
        console.log(task)

        if (task) {
            return res.status(200).send(task)
        } 
        res.status(404).send('Not Found!')
    } catch (e) {
        res.status(400).send(e)
    }
})

router.patch('/tasks/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'isCompleted']
    const isVerifiedOperation = updates.every((update) => allowedUpdates.includes(update))

    if (updates.length == 0 || !isVerifiedOperation) {
        return res.status(400).send('Invalid updates!')
    }

    try {
        const task = await Task.findById(req.params.id)
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()

        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true, age: 4 })
        // if (!task) {
        //     return res.status(404).send('Not Found!')
        // }

        return res.status(200).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router;