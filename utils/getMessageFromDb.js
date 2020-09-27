const Message = require('../models/Message')

module.exports = async ({ recipientId, userId }) => {
  try {
    return await Message.findOne({ recipientId, senderId: userId })
  } catch (err) {
    console.log(err)
  }
}
