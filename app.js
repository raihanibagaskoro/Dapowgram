const express = require('express')
const Controller = require('./controllers/controller')
const app = express()
const port = 3000
const session = require('express-session')
const path = require('path')
const multer = require('multer')

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


app.get('/', Controller.indexPage)


app.use(function (req, res, next) {
    
    if (!req.session.userId) {
        const error = "please login first"
        res.redirect(`/login?error=${error}`)
    } else {
        next()
    }

})

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
      callback(null, 'Images')
  },
  filename: (req, file, callback) => {
      console.log(file)
      callback(null, Date.now() + '-' + file.originalname)
  }
})

const upload = multer({ storage: storage})

app.get('/Images/:imageName', (req, res) => {
  const imageName = req.params.imageName
  const imagePath = path.join(__dirname, 'Images', imageName)
  res.sendFile(imagePath)
})

app.get('/upload', Controller.uploadPage)
app.post('/upload', upload.single("fileName"), Controller.uploadPost)
app.get('/home', Controller.homePage)
app.get('/detailpost/:id', Controller.detailPost)
app.post('/detailpost/:id', Controller.addComment)
app.get('/deletepost/:id', Controller.deletePost)

app.get('/profile', Controller.profilePage)
app.get('/editbio', Controller.getEditBio)
app.post('/editbio/:id', Controller.postGetBio)
app.get('/addLike/:id', Controller.addLike);




app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})


