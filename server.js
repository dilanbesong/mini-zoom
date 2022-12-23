const express = require('express')
const { v4 } = require('uuid')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.redirect(`/${v4()}`)
})

app.get('/:room', (req, res) => {
    res.render('room', {roomId: req.params.room})
})

io.on('connection', (socket) => {
   socket.on('join-room', (roomId, userId) => {

     socket.join(roomId)

     socket.to(roomId).emit('user-connected', userId)

     socket.on('disconnect', () => {
       socket.to(roomId).emit('user-disconnected', userId)
     })

   })
})

server.listen(process.env.PORT || 3000, () => { console.log('server is running...') })
    


