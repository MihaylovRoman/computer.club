const jwt = require('jsonwebtoken')

module.exports = function (role) {
    return function (req, res, next) {
        const authHeader = req.headers['authorization']

        const token = authHeader && authHeader.split(' ')[1]

        if (!token) return res.status(401).json({ message: "Не авторизован" })

        jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
            if (err) return res.status(403).json({ message: 'Недействительный токен' })
            if (user.role !== role) return res.status(403).json({ message: "Нет доступа" })
            req.user = user;
            next()
        })
    }
};