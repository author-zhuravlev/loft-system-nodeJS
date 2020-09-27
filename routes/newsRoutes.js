const { Router } = require('express')
const passport = require('passport')
const { check } = require('express-validator')
const newsControllers = require('../controllers/newsControllers')
const router = Router()

router.get(
  '/news',
  passport.authenticate('jwt', { session: false }),
  newsControllers.getNews
)
router.post(
  '/news',
  passport.authenticate('jwt', { session: false }),
  [
    check('text', 'Введите текст новости!').isString(),
    check('title ', 'Введите заголовок новости!').isString()
  ],
  newsControllers.createNews
)
router.patch(
  '/news/:id',
  passport.authenticate('jwt', { session: false }),
  [
    check('text', 'Введите текст новости!').exists(),
    check('title ', 'Введите заголовок новости!').exists()
  ],
  newsControllers.updateNews
)
router.delete(
  '/news/:id',
  passport.authenticate('jwt', { session: false }),
  newsControllers.deleteNews
)

module.exports = router
