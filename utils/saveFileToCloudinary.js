const cloudinary = require('cloudinary').v2
const config = require('config')
const errorHandler = require('./errorHandler')

cloudinary.config({
  cloud_name: config.get('CLOUDINARY_NAME'),
  api_key: config.get('CLOUDINARY_API_KEY'),
  api_secret: config.get('CLOUDINARY_API_SECRET')
})

module.exports = async (file, res) => {
  try {
    return await cloudinary.uploader.upload(
      file,
      { transformation: [{ width: 384, height: 384, crop: "thumb" }] }
    )
  } catch (err) {
    errorHandler(res, err)
  }
}

