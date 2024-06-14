const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

class BookedController {
    async getAllBooked(req, res) {
        const { id } = req.user

        try {
            const bookeds = await prisma.booked.findMany({
                where: {
                    userId: id
                }
            })

            res.json(bookeds)

        } catch (e) {
            console.log('Get bookeds err', e)
            res.status(500).json({ message: "Непредвиненная ошибка" })
        }
    }

    async getSeatsByBookedId(req, res) {
        const { bookedId } = req.query
        const booked_id = parseInt(bookedId)
        
        try {
            const seats = await prisma.seat.findMany({
                where: {
                    Booked: {
                        some: {
                            id: booked_id
                        }
                    }
                }
            })
            res.json(seats)
        } catch (e) {
            console.log('Get seats by booked id err', e)
            res.status(500).json({ message: "Непредвиденная ошибка" })
        }
    }
    async cancelBooked(req, res) {
        const { bookedId } = req.params
        const booked_id = parseInt(bookedId)

        try {
            await prisma.seat.updateMany({
                where: {
                    Booked: {
                        some: {
                            id: booked_id
                        }
                    }
                },
                data: {
                    status: "FREE"
                }
            })
            await prisma.booked.delete({
                where: {
                    id: booked_id
                }
                
            })
            res.json({message: "Запись отменена"})
        } catch (e) {
            console.log('Cancel booked err', e)
            res.status(500).json({message: 'Ошибка отмены'})
        }
    }

    async activateBooked(req, res) {
        const { bookedId } = req.body
        const { id } = req.user
        const booked_id = parseInt(bookedId)

        try {
            const user = await prisma.user.findUnique({
                where: {
                    id
                }
            })
            const manyBooked = await prisma.booked.findMany({
                where: {
                    userId: user.id,
                    status: 'PROCESS'
                }
            })
            const total = manyBooked.reduce((acc, index) => acc = acc + index.total, 0)
            const booked = await prisma.booked.findUnique({
                where: {
                    id: booked_id
                }
            })
            if (user.balance < booked.total + total) {
                res.status(300).json({ message: "Недостаточно средств" })
            }
            const today = new Date().toISOString()
            await prisma.booked.update({
                where: {
                    id: booked_id
                },
                data: {
                    dateStart: today,
                    status: "PROCESS"
                }
            })

            res.json({ message: "Игровой сеанс начался" })
        } catch (e) {
            console.log('activate booked err', e)
            res.status(500).json({message: 'Ошибка начала сеанса'})
        }

    }
}

module.exports = new BookedController()