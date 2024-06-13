const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

class SeatController {
    async getAllSeats(req, res) {
        const { name } = req.params
        try {
            const hall = await prisma.hall.findUnique({
                where: {
                    name
                }
            })
            const seats = await prisma.seat.findMany({
                where: {
                    hallId: hall.id
                }
            })

            res.json(seats)
        }
        catch (e) {
            console.log("Get seats err", e)
        }

    }

    async occupiedSeats(req, res) {
        const { seats, userId, hallName, total, hours } = req.body
        const hour = parseInt(hours)

        try {

            const hall = await prisma.hall.findUnique({
                where: {
                    name: hallName
                }
            })

            const booked = await prisma.booked.create({
                data: {
                    userId,
                    hallId: hall.id,
                    total,
                    hours: hour
                }
            })


            await Promise.all(seats.map(async (seat) => {
                const currentSeat = await prisma.seat.findUnique({
                    where: {
                        id: seat
                    }
                })
                await prisma.seat.update({
                    where: {
                        id: currentSeat.id
                    },
                    data: {
                        status: "OCCUPIED",
                    }
                })
                await prisma.booked.update({
                    where: {
                        id: booked.id
                    },
                    data: {
                        seat: {
                            connect: {
                                id: currentSeat.id
                            }
                        }
                    }
                })

            }))

            res.json({message: "Места забронированы"})
        } catch (e) {
            console.log("Booked err", e)
            res.status(500).json({message: "Не удалось забронировать места"})
        }


    }


}

module.exports = new SeatController()