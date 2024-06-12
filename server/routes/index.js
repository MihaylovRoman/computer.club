const Router = require('express')
const authToken = require('../middleware/auth.middleware')
const checkRole = require('../middleware/checkRole.middleware')
const AdminController = require('../controllers/admin.controller')
const UserController = require('../controllers/user.controller')





const router = Router()

// USER
router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.get('/auth', authToken, UserController.check)


module.exports = router
