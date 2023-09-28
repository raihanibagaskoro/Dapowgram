const express = require('express')
const Controller = require('./controllers/controller')
const app = express()
const port = 3000

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: true}))

app.get('/', (req, res) => {
  res.redirect('loginPage')
})
app.get('/register', Controller.getRegister)
app.post('/register', Controller.postRegister)
app.get('/login', Controller.getLogin)
app.post('/login')

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})