const express = require('express')
require('./db/mongoose.js')

const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log('Server is up and running on port: '+ port)
})

// const Task = require('./models/task')
// const User = require('./models/user')

// const main = async () => {
//     const task = await Task.findById('5dadf4ce070a050b55a73308')
//     await task.populate('owner').execPopulate()
//     console.log(task.owner)


//     // const user = await User.findById('5dadf416e168e30adde5417b')
//     // await user.populate('tasks').execPopulate()
//     // console.log(user.tasks)
// }

// main()