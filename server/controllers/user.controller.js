const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')

const generateJwt = (id, role, name, balance) => {
    return jwt.sign(
        ({
            id,
            role,
            name,
            balance
        }),
        process.env.SECRET_KEY,
        { expiresIn: '3h' })
}


class UserController {
    async register(req, res) {
        const { name, phone, password, confirmPassword } = req.body

        if (!name || !confirmPassword || !phone || !password) {
            return res.status(400).json({ message: "Заполните поля" })
        }
        try {
            const user = await prisma.user.findUnique({
                where: {
                    phone
                }
            })
            if (user) {
                return res.status(400).json({ message: 'Пользователь уже существует' })
            }
            if (password !== confirmPassword) {
                return res.status(500).json({ message: "Пароли не совпадают" })
            }
            const hashPassword = await bcrypt.hash(password, 10)
            const currentUser = await prisma.user.create({
                data: {
                    name,
                    phone: phone,
                    password: hashPassword,
                }
            })
            res.json(currentUser)
        } catch (e) {
            console.log("Error in register", e)
            res.status(500).json({ message: 'Internal server error' })
        }
    }


    async login(req, res) {
        const { phone, password } = req.body
        if (!phone || !password) {
            return res.status(400).json({ message: "Заполните поля" })
        }

        try {
            const user = await prisma.user.findUnique({
                where: {
                    phone
                }
            })
            if (!user) {
                return res.status(400).json({ message: "Неверный логин или пароль" })
            }
            const validPassword = await bcrypt.compare(password, user.password)
            if (!validPassword) {
                return res.status(400).json({ message: "Неверный логин или пароль" })
            }
            const token = generateJwt(user.id, user.role, user.name, user.balance)
            res.json({ token })

        } catch (e) {
            console.log("Error in login", e)
            res.status(500).json({ message: 'Ошибка сервера' })
        }
    }
    
    async check(req, res, next) {
        const { id, role, name, balance } = req.user
        const token = generateJwt(id, role, name, balance)
        return res.json({ token })
    }
}

module.exports = new UserController()