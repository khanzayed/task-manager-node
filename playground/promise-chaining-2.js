require('../src/db/mongoose')
const Task =  require('../src\/models/task')

// const _id = '5dac5a68ac162d41216bde5b'
// Task.findByIdAndDelete(_id).then(() => {
//     return Task.countDocuments()
// }).then((result) => {
//     console.log(result)
// }).catch((error) => {
//     console.log(error)
// })

const deleteTaskAndCount = async (id) => {
    await Task.findByIdAndDelete(id)
    const count = await Task.countDocuments()

    return count
}

deleteTaskAndCount('5dac5ab58282dc41316d04b6').then((result) => {
    console.log(result)
}).catch((error) => {
    console.log(error)
})