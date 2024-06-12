const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

class HallController {
    async HallRegister(req, res) {
        const { name, price, quantity } = req.body

        let filePath;
        if (req.file && req.file.path) {
            filePath = req.file.path
        }

        if (!name || !filePath || !quantity || !price) {
            return res.status(400).json({ message: "Заполните поля!" })
        }
        const totalQuantity = parseInt(quantity)
        try {
            const currentHall = await prisma.hall.findUnique({
                where: {
                    name
                }
            })
            if (currentHall) {
                return req.status(401).json({ message: "Название зала занято!" })
            }

            const hall = await prisma.hall.create({
                data: {
                    name,
                    quantity: totalQuantity,
                    price,
                    image: `/${filePath}`
                }
            })
            for (let i = 0; i < totalQuantity; i++) {
                await prisma.seat.create({
                    data: {
                        hallId: hall.id
                    }
                })
            }

            res.json({ message: "Зал успешно создан" })
        } catch (e) {
            console.log("Register hall err", e)
            res.status(500).json({ message: "Ошибка создания зала" })
        }

    }
    async getHall(req, res) {
        const { name } = req.params
        try {
            const hall = await prisma.hall.findUnique({
                where: {
                    name
                }
            })
            res.json(hall)
        } catch (e) {
            console.log("Get hall err", e)
            res.status(500).json({ message: "Ошибка получения данных" })
        }
    }
    async deleteHall(req, res) {
        const { hallId } = req.body
        const hall_id = parseInt(hallId)

        try {
            const hall = await prisma.hall.findUnique({
                where: {
                    id: hall_id
                }
            })

            const bookeds = await prisma.booked.findMany({
                where: {
                    hallId: hall.id
                }
            })

            const seats = await prisma.booked.findMany({
                where: {
                    hallId: hall.id
                }
            })

            await Promise.all(bookeds.map(async (item) => {
                await prisma.booked.delete({
                    where: {
                        id: item.id
                    }
                })
            }))

            await Promise.all(seats.map(async (item) => {
                await prisma.seat.delete({
                    where: {
                        id: item.id
                    }
                })
            }))
        } catch (e) {
            console.log('Delete hall err', e)
            res.status(500).json({message: "Ошибка удаления зала"})
        }

    }
    async getAllHalls(req, res) {
        try {
            const halls = await prisma.hall.findMany()
            res.json(halls)
        } catch (e) {
            console.log('Get all halls err', e)
            res.status(500).json({message: "Ошибка получения данных"})
        }
    }
}

module.exports = new HallController()