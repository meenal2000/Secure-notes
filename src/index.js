const express = require('express')
require('./db/mongoose') // this ensures file runs and mongoose connects to DB
const User = require('./models/users')
const Task = require('./models/task')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const app = express()
const port = process.env.PORT ;

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log(' server is up and running at port ' + port)
})
// const Task = require('./models/task')
// const User = require('./models/user')

// const main = async () => {
//     // const task = await Task.findById('61e04bc943befc2cc4b4d756')
//     // await task.populate('owner').execPopulate()
//     // console.log(task.owner)

//     const user = await User.findById('61e04bc143befc2cc4b4d754')
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks)
// }

// main()