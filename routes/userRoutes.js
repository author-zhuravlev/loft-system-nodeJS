const { Router } = require('express')
const userControllers = require('../controllers/userControllers')
const router = Router()

router.delete('/users/:id', userControllers.deleteUser)
router.get('/users', userControllers.getUsers)
router.patch(
  '/users/:id/permission',
  userControllers.updatePermissionUser
)

module.exports = router
