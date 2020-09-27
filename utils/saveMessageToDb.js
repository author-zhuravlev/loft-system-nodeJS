const Message = require('../models/Message')

const save = async (message, senderId, recipientId) => {
  await new Message({
    senderId,
    recipientId,
    messages: [message]
  }).save()
}

const update = async (message, senderId, recipientId) => {
  await Message.findOneAndUpdate(
    { senderId, recipientId },
    { $push: { messages: message } },
    { new: true }
  )
}

const saveMessages = async (message, senderId, recipientId) => {
  try {
    await save(message, senderId, recipientId)
    await save(message, recipientId, senderId)
  } catch (err) {
    console.log(err)
  }
}
const updateMessages = async (message, senderId, recipientId) => {
  try {
    await update(message, senderId, recipientId)
    await update(message, recipientId, senderId)
  } catch (err) {
    console.log(err)
  }
}

module.exports = async message => {
  try {
    const { senderId, recipientId } = message
    const correspondence = await Message.findOne({ senderId, recipientId })

    correspondence
      ? await updateMessages(message, senderId, recipientId)
      : await saveMessages(message, senderId, recipientId)
  } catch (err) {
    console.log(err)
  }
}
