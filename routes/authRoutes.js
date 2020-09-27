const { Router } = require('express')
const { check } = require('express-validator')
const passport = require('passport')
const authControllers = require('../controllers/authControllers')
const router = Router()

router.post(
  '/login',
  [
    check('username', 'Некоректный username!').isLength({ min: 2 }),
    check('password', 'Минимальная длина пароля 6 символов!').isLength({ min: 6 })
  ],
  authControllers.login
)
router.post(
  '/registration',
  [
    check('username', 'Некоректный username!').isLength({ min: 2 }),
    check('surName', 'Некоректный username!').isLength({ min: 2 }),
    check('firstName', 'Некоректный username!').isLength({ min: 2 }),
    check('middleName', 'Некоректный username!').isLength({ min: 2 }),
    check('password', 'Минимальная длина пароля 6 символов!').isLength({ min: 6 })
  ],
  authControllers.registration
)
router.post(
  '/refresh-token',
  passport.authenticate('jwt', { session: false }),
  authControllers.refreshToken
)

module.exports = router
