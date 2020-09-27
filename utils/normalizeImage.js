const Jimp = require('jimp')

module.exports = image => {
  Jimp.read(image.path)
    .then(img => {
      return img
        .autocrop()
        .resize(384, 384, Jimp.RESIZE_BEZIER)
        .write(`./client/public/assets/img/${image.filename}`)
    })
    .catch(err => {
      console.error(err)
    })
}
