const config = require('config')
const fieldValidation = require('../utils/fieldValidation')
const News = require('../models/News')
const errorHandler = require('../utils/errorHandler')
const findNewsAndRename_ID = require('../utils/findNewsAndRename_ID')

module.exports.getNews = async (req, res) => {
  try {
    const allNews = await findNewsAndRename_ID(News)

    res.status(200).json(allNews)
  } catch (err) {
    errorHandler(res, err)
  }
}

module.exports.createNews = async (req, res) => {
  try {
    fieldValidation(req, res, config.get('validation').createError)

    const { text, title } = req.body
    const user = req.user

    await new News({
      text,
      title,
      user
    }).save()

    const allNews = await findNewsAndRename_ID(News)

    res.status(201).json(allNews)
  } catch (err) {
    errorHandler(res, err)
  }
}

module.exports.updateNews = async (req, res) => {
  try {
    fieldValidation(req, res, config.get('validation').updateError)

    await News.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { new: true }
    )

    const allNews = await findNewsAndRename_ID(News)

    res.status(201).json(allNews)
  } catch (err) {
    errorHandler(res, err)
  }
}

module.exports.deleteNews = async (req, res) => {
  try {
    await News.remove({ _id: req.params.id })

    const allNews = await findNewsAndRename_ID(News)

    res.status(201).json(allNews)
  } catch (err) {
    errorHandler(res, err)
  }
}
