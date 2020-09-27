const { Schema, model } = require('mongoose')

const messageSchema = new Schema({
  senderId: String,
  recipientId: String,
  messages: [Object]
})

module.exports = model('messages', messageSchema)
