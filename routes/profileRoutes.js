const { Router } = require('express')
const passport = require('passport')
const { check } = require('express-validator')
const profileControllers = require('../controllers/profileControllers')
const upload = require('../middleware/upload')
const router = Router()

router.get(
  '/profile',
  passport.authenticate('jwt', { session: false }),
  profileControllers.autoLogin
)
router.patch(
  '/profile',
  passport.authenticate('jwt', { session: false }),
  upload.single('avatar'),
  [
    check('surName', 'Некоректный username!').isLength({ min: 2 }),
    check('firstName', 'Некоректный username!').isLength({ min: 2 }),
    check('middleName', 'Некоректный username!').isLength({ min: 2 }),
    check('oldPassword', 'Минимальная длина пароля 6 символов!').isLength({ min: 6 }),
    check('newPassword', 'Минимальная длина пароля 6 символов!')
      .if((value, { req }) => req.body.newPassword),
  ],
  profileControllers.updateUserInfo
)

module.exports = router
