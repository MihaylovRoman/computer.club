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
        const { bookedId } = req.body
        const booked_id = parseInt(bookedId)

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
    }

    async activateBooked(req, res) {
        const { bookedId } = req.body
        const { id } = req.user
        const booked_id = parseInt(bookedId)

        const user = await prisma.user.findUnique({
            where: {
                id
            }
        })
        const booked = await prisma.booked.findUnique({
            where: {
                id: booked_id
            }
        })
        if (user.balance < booked.total)

            await prisma.booked.update({
                where: {
                    id: booked_id
                },
                data: {
                    dataStart: new Date().toISOString,
                    status: "PROCESS"
                }
            })

    }
}

module.exports = new BookedController()