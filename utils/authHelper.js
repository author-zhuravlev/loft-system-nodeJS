const jwt = require('jsonwebtoken')
const config = require('config')
const User = require('../models/User')

const generateToken = (userId, type, expiresIn) => jwt.sign(
    { userId, type },
    config.get('jwt').secret,
    { expiresIn }
)

const generateTokens = userId => {
  const accessToken = generateToken(
    userId,
    config.get('jwt').tokens.access.type,
    config.get('jwt').tokens.access.expiresIn
  )
  const refreshToken = generateToken(
    userId,
    config.get('jwt').tokens.refresh.type,
    config.get('jwt').tokens.refresh.expiresIn
  )

  const accessTokenExpiredAt = jwt.verify(accessToken, config.get('jwt').secret).exp * 1000
  const refreshTokenExpiredAt = jwt.verify(refreshToken, config.get('jwt').secret).exp * 1000

  return {
    accessToken,
    accessTokenExpiredAt,
    refreshToken,
    refreshTokenExpiredAt
  }
}

const addDataTokenToUserObject = (candidate, newTokens) => {
  candidate.accessToken = `Bearer ${ newTokens.accessToken }`
  candidate.refreshToken = `Bearer ${ newTokens.refreshToken }`

  candidate.accessTokenExpiredAt = newTokens.accessTokenExpiredAt
  candidate.refreshTokenExpiredAt = newTokens.refreshTokenExpiredAt
}

const updateRefreshTokenInDB = async (filter, refreshToken, refreshTokenExpiredAt) => {
  await User.findOneAndUpdate(
    filter,
    { $set: {
        refreshToken,
        refreshTokenExpiredAt
    } },
  )
}

module.exports = {
  generateTokens,
  updateRefreshTokenInDB,
  addDataTokenToUserObject,
}
