const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

class AdminController {
    async UserRegister(req, res) {
        const { passport, name, phone, time } = req.body

        if (!passport || !name || !phone || !time) {
            return res.status(400).json({message: "Заполните поля!"})
        }


    }

}

module.exports = new AdminController()