const config = require('config')
const { Schema, model } = require('mongoose')

const userSchema = new Schema({
  id: String,
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: config.get('pathToDefaultImage')
  },
  middleName: {
    type: String,
    required: true
  },
  permission: {
    chat: { C: Boolean, R: Boolean, U: Boolean, D: Boolean },
    news: { C: Boolean, R: Boolean, U: Boolean, D: Boolean },
    settings: { C: Boolean, R: Boolean, U: Boolean, D: Boolean }
  },
  surName: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  accessToken: {
    type: String
  },
  refreshToken: {
    type: String
  },
  accessTokenExpiredAt: {
    type: Number
  },
  refreshTokenExpiredAt: {
    type: Number
  }
})

module.exports = model('users', userSchema)
