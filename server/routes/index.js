const Router = require('express')
const authenticateToken = require('../middleware/auth.middleware')
const checkRole = require('../middleware/checkRole.middleware')
const UserController = require('../controllers/user.controller')
const multer = require('multer')
const path = require('path')
const HallController = require('../controllers/hall.controller')
const SeatController = require('../controllers/seat.controller')
const BookedController = require('../controllers/booked.controller')
const { scheduleJob } = require('node-schedule')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const storage = multer.diskStorage({
    destination: 'uploads',
    filename: function (req, file, cb) {
        const unique = Date.now() + "-" + Math.round(Math.random() * 1E9)
        const ext = path.extname(file.originalname)
        cb(null, file.filename + '-' + unique + ext)
    }
})
const uploads = multer({ storage: storage })

scheduleJob('*/5 * * * *', async () => {
    console.log('Обновление баланса')
    try {
        const activeBooked = await prisma.booked.findMany({
            where: {
                status: 'PROCESS'
            }
        })

        await Promise.all(activeBooked.map(async (booked) => {
            const hall = await prisma.hall.findUnique({
                where: {
                    id: booked.hallId
                }
            })

            const updateBalance = hall.price / 12

            const user = await prisma.user.findUnique({
                where: {
                    id: booked.userId
                }
            })

            const date = booked.dateStart.setHours(booked.dateStart.getHours() + booked.hours)
            const currentDate = new Date()
            if (date < currentDate) {
                
                chanceFunc(booked.id)
            }
            if ((user.balance - updateBalance) < 0) {

                chanceFunc(booked.id)

            } else {
                await prisma.user.update({
                    where: {
                        id: user.id
                    },
                    data: {
                        balance: user.balance - updateBalance
                    }
                })
            }
        }))

    } catch (e) {
        console.log('schedule err', e)
    }
})

async function chanceFunc(id) {
    const seats = await prisma.seat.updateMany({
        where: {
            Booked: {
                some: {
                    id
                }
            }
        },
        data: {
            status: "FREE"
        }
    })

    await prisma.booked.delete({
        where: {
            id
        }
    })
}

const router = Router()

// USER
router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.get('/auth', authenticateToken, UserController.check)
router.post('/topUpBalance', authenticateToken, UserController.TopUpBalance)
router.post('/tokenUpdate', authenticateToken, UserController.tokenUpdate)

// HALL
router.post('/registerHall', authenticateToken, checkRole('ADMIN'), uploads.single('image'), HallController.HallRegister)
router.delete('/deleteHall', authenticateToken, checkRole('ADMIN'), HallController.deleteHall)
router.get('/getHall/:name', HallController.getHall)
router.get('/getAllHalls', HallController.getAllHalls)

// SEAT
router.get('/getAllSeats/:name', SeatController.getAllSeats)
router.post('/occupiedSeats', authenticateToken, SeatController.occupiedSeats)

// BOOKED
router.get('/getAllBooked', authenticateToken, BookedController.getAllBooked)
router.get('/getSeatsByBookedId', authenticateToken, BookedController.getSeatsByBookedId)
router.delete('/cancelBooked', authenticateToken, BookedController.cancelBooked)
router.put('/activateBooked', authenticateToken, BookedController.activateBooked)



module.exports = router
