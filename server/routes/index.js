const Router = require('express')
const authToken = require('../middleware/auth.middleware')
const checkRole = require('../middleware/checkRole.middleware')
const AdminController = require('../controllers/hall.controller')
const UserController = require('../controllers/user.controller')
const multer = require('multer')
const path = require('path')
const HallController = require('../controllers/hall.controller')


const storage = multer.diskStorage({
    destination: 'uploads',
    filename: function (req, file, cb) {
        const unique = Date.now() + "-" + Math.round(Math.random() * 1E9)
        const ext = path.extname(file.originalname)
        cb(null, file.filename + '-' + unique + ext)
    }
})
const uploads = multer({ storage: storage })



const router = Router()

// USER
router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.get('/auth', authToken, UserController.check)
router.post('/topUpBalance', authToken, UserController.TopUpBalance)



// HALL
router.post('/registerHall', authToken, checkRole('ADMIN'), uploads.single('image'), HallController.HallRegister)
router.delete('/deleteHall', authToken, checkRole('ADMIN'), HallController.deleteHall)
router.get('/getHall/:name', HallController.getHall)
router.get('/getAllHalls', HallController.getAllHalls)

module.exports = router
