const User = require('../models/User')
const errorHandler = require('../utils/errorHandler')
const findUsersAndRename_ID = require('../utils/findUsersAndRename_ID')

module.exports.deleteUser = async (req, res) => {
  try {
    await User.remove({ _id: req.params.id })

    res.status(200).json({
      message: 'Пользователь удалён!'
    })
  } catch (err) {
    errorHandler(res, err)
  }
}

module.exports.getUsers = async (req, res) => {
  try {
    const allUsers = await findUsersAndRename_ID(User)

    res.status(200).json(allUsers)
  } catch (err) {
    errorHandler(res, err)
  }
}

module.exports.updatePermissionUser = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { new: true }
    )

    res.status(201).json(user)
  } catch (err) {
    errorHandler(res, err)
  }
}
