require('../src/db/mongoose')

const User =  require('../src\/models/user')

// User.findByIdAndUpdate('5dac58e95c32bc40d5eb9767', { age : 1 }).then((user) => {
//     console.log(user)

//     return User.countDocuments({ age: 1 })
// }).then((result) => {
//     console.log(result)
// }).catch((error) => {

// })


const updateAgeAndCount = async (id, age) => {
    await User.findByIdAndUpdate(id, { age })
    const count = await User.countDocuments({ age })

    return count
}

updateAgeAndCount('5dac58e95c32bc40d5eb9767', 2).then((result) => {
    console.log(result)
}).catch((error) => {
    console.log(error)
})