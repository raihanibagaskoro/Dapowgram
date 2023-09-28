const express = require('express')
const Controller = require('./controllers/controller')
const app = express()
const port = 3000
const session = require('express-session')

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))

app.use(session({
    secret: 'this is secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        sameSite: true
    }
}))


app.get('/register', Controller.registerform)
app.post('/register', Controller.postregister)
app.get('/login', Controller.loginform)
app.post('/login', Controller.postlogin)
app.get('/logout', Controller.logout)





app.use(function (req, res, next) {
    if (!req.session.userId) {
        const error = "please login first"
        res.redirect(`/login?error=${error}`)
    } else {
        next()
    }

})

// app.use(function (req, res, next) {
//     if (req.session.userId && req.session.role !== 'user') {
//         const error = "you have no acces"
//         res.redirect(`/login?error=${error}`)
//     } else {
//         next()
//     }

// })

app.get('/home', Controller.homePage)



app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})