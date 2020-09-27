const bcrypt = require('bcryptjs')
const config = require('config')
const fieldValidation = require('../utils/fieldValidation')
const User = require('../models/User')
const errorHandler = require('../utils/errorHandler')
const {
  generateTokens,
  updateRefreshTokenInDB,
  addDataTokenToUserObject,
} = require('../utils/authHelper')

module.exports.login = async (req, res) => {
 try {
   fieldValidation(req, res, config.get('validation').loginError)

   const { username, password } = req.body
   const candidate = await User.findOne({ username })

   if (candidate) {
     const result = bcrypt.compareSync(password, candidate.password)

     if (result) {
       const newTokens = generateTokens(candidate._id)

       await updateRefreshTokenInDB(
         { _id: candidate._id},
         newTokens.refreshToken,
         newTokens.refreshTokenExpiredAt
       )
       addDataTokenToUserObject(candidate, newTokens)

       candidate.id = candidate._id

       res.status(200).json(candidate)
     } else {
       res.status(401).json({
         message: 'Неправильное имя пользователя или пароль!'
       })
     }
   } else {
     res.status(404).json({
       message: 'Пользователь не найден!'
     })
   }
 } catch (err) {
   errorHandler(res, err)
 }
}

module.exports.registration = async (req, res) => {
  try {
    fieldValidation(req, res, config.get('validation').registrationError)

    const { username, surName, firstName, middleName, password } = req.body

    let permission
    const checkUsers = await User.find()

    if (checkUsers.length) {
      permission = {
        chat: { C: true, R: true, U: false, D: false },
        news: { C: true, R: true, U: false, D: false },
        settings: { C: false, R: false, U: false, D: false }
      }

      const candidate = await User.findOne({ username })

      if (candidate) {
        return res.status(409).json({
          message: 'Такой пользователь уже существует!'
        })
      }
    } else {
      permission = {
        chat: { C: true, R: true, U: true, D: true },
        news: { C: true, R: true, U: true, D: true },
        settings: { C: true, R: true, U: true, D: true }
      }
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const user = new User({
      username,
      surName,
      firstName,
      middleName,
      permission,
      password: hashedPassword
    })
    await user.save()

    user.id = user._id

    res.status(201).json(user)
  } catch (err) {
    errorHandler(res, err)
  }
}

module.exports.refreshToken = async (req, res) => {
  try {
    const token = req.headers['authorization']
    const newTokens = generateTokens(req.user._id)

    await updateRefreshTokenInDB(
      { refreshToken: token },
      newTokens.refreshToken,
      newTokens.refreshTokenExpiredAt
    )

    res.status(200).json(newTokens)
  } catch (err) {
    errorHandler(res, err)
  }
}
