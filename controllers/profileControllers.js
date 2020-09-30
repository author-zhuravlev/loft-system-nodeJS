const config = require('config')
const bcrypt = require('bcryptjs')
const fieldValidation = require('../utils/fieldValidation')
const User = require('../models/User')
const errorHandler = require('../utils/errorHandler')
const saveFileToCloudinary = require('../utils/saveFileToCloudinary')

module.exports.autoLogin = async (req, res) => {
  try {
    const user = req.user

    user.id = user._id

    res.status(200).json(user)
  } catch (err) {
    errorHandler(res, err)
  }
}

module.exports.updateUserInfo = async (req, res) => {
  try {
    fieldValidation(req, res, config.get('validation').updateError)

    const user = req.user
    const {
      firstName,
      middleName,
      surName,
      oldPassword,
      newPassword
    } = req.body
    const result = bcrypt.compareSync(oldPassword, user.password)

    if (!result) {
      res.status(400).json({
        message: 'Вы ввели неправильный пароль!'
      })
    } else {
      const hashedPassword = newPassword
        ? await bcrypt.hash(newPassword, 12)
        : user.password

      let objectToUpdate = {
        password: hashedPassword,
        firstName,
        middleName,
        surName,
      }

      if (req.file) {
        const uploadToCloudinary = await saveFileToCloudinary(req.file.path, res)

        objectToUpdate.image = uploadToCloudinary.url
      }

      const updateUser = await User.findOneAndUpdate(
        { _id: user._id },
        { $set: objectToUpdate },
        { new: true }
      )

      updateUser.id = updateUser._id

      res.status(200).json(updateUser)
    }
  } catch (err) {
    errorHandler(res, err)
  }
}
