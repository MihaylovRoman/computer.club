const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')

const generateJwt = (id, role, name, balance, session) => {
    return jwt.sign(
        ({
            id,
            role,
            name,
            balance,
            session
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

            let session = false
            const activeBooked = await prisma.booked.findFirst({
                where: {
                    userId: user.id,
                    status: 'PROCESS'
                    
                }
            })
            if(activeBooked) session = true

            const token = generateJwt(user.id, user.role, user.name, user.balance, session)
            res.json({ token })

        } catch (e) {
            console.log("Error in login", e)
            res.status(500).json({ message: 'Ошибка сервера' })
        }
    }

    async TopUpBalance(req, res) {
        const { userId, money } = req.body
        const user_id = parseInt(userId)
        try {
            if (!userId || !money) {
                return res.status(400).json({ message: "Данные о пользователе не найдены" })
            }
            const currentUser = await prisma.user.findUnique({
                where: {
                    id: user_id
                }
            })
            const updatedUser = await prisma.user.update({
                where: {
                    id: user_id
                },
                data: {
                    balance: parseFloat(currentUser.balance) + parseFloat(money)
                }
            })

            let session = false
            const activeBooked = await prisma.booked.findFirst({
                where: {
                    userId: currentUser.id,
                    status: 'PROCESS'
                    
                }
            })
            if(activeBooked) session = true

            const token = generateJwt(updatedUser.id, updatedUser.role, updatedUser.name, updatedUser.balance, session)
            res.json({ token })

        } catch (e) {
            console.log("TopUpBalance error", e)
            res.status(500).json({ message: "Ошибка пополнения баланса" })
        }
    }

    async tokenUpdate(req, res) {
        const {id} = req.user
        
        const user = await prisma.user.findUnique({
            where: {
                id
            }
        })

        let session = false
            const activeBooked = await prisma.booked.findFirst({
                where: {
                    userId: user.id,
                    status: 'PROCESS'
                    
                }
            })
            if(activeBooked) session = true

        const token = generateJwt(user.id, user.role, user.name, user.balance, session)
        res.json({ token })

    }


    async check(req, res, next) {
        const { id, role, name, balance } = req.user

        const token = generateJwt(id, role, name, balance)
        res.json({ token })
    }
}

module.exports = new UserController()