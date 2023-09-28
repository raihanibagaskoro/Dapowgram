const express = require('express')
const Controller = require('./controllers/controller')
const app = express()
const port = 3000

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: true}))

app.get('/', Controller.homePage)
app.get('/register', Controller.registerform)
app.post('/register', Controller.postregister)
app.get('/login', Controller.loginform)
app.post('/login', Controller.postlogin)

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})