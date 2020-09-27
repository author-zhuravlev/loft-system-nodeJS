const path = require('path')
const http = require('http')
const express = require('express')
const mongoose = require('mongoose')
const config = require('config')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const passport = require('passport')
const socketIo = require('socket.io')
const authRoutes = require('./routes/authRoutes')
const newsRoutes = require('./routes/newsRoutes')
const profileRoutes = require('./routes/profileRoutes')
const userRoutes = require('./routes/userRoutes')
const saveMessageToDb = require('./utils/saveMessageToDb')
const getMessageFromDb = require('./utils/getMessageFromDb')

const app = express()
const server = http.createServer(app)
const io = socketIo.listen(server)
const PORT = process.env.PORT || config.get('PORT') || 5000

app.use(passport.initialize())
require('./middleware/passport')(passport)
app.use(cors())
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('/api', authRoutes)
app.use('/api', newsRoutes)
app.use('/api', profileRoutes)
app.use('/api', userRoutes)

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client', 'build')))

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}

const connectedUsers = {}

io.on('connection', socket => {
  const socketId = socket.id
  console.log('a user connected')

  socket.on('users:connect', ({ userId, username }) => {
    const user = { socketId, userId, username }
    connectedUsers[socketId] = user
    socket.emit('users:list', Object.values(connectedUsers))
    socket.broadcast.emit('users:add', user)
  })
  socket.on('message:add',async data => {
    socket.emit('message:add', data)
    socket.broadcast.to(data.roomId).emit('message:add', data)
    await saveMessageToDb(data)
  })
  socket.on('message:history', async data => {
    const historyMessage = await getMessageFromDb(data)
    socket.emit('message:history', historyMessage.messages)
  })
  socket.on('disconnect', () => {
    delete connectedUsers[socketId]
    socket.broadcast.emit('users:leave', socketId)
  })
})

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || config.get('MONGODB_URI'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    })

    server.listen(PORT, () => {
      console.log(`Server has been started on PORT: ${PORT}`)
    })
  } catch (err) {
    console.log(`Server error: ${err.message}`)
    process.exit(1)
  }
}
start()
