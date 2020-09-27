const multer = require('multer')
const format = require('date-fns/format')
const config = require('config')

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, config.get('localFilePath'))
  },
  filename(req, file, cb) {
    const date = format(new Date(), 'ddMMyyyy-HHmmss_SSS')
    cb(null, `${date}-${file.originalname}`)
  }
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

const limits = { fileSize: 1024*1024*5 }

module.exports = multer({ storage, fileFilter, limits })
