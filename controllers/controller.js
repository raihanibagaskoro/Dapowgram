const {User} = require('../models/index')

class Controller{
    static getRegister(req, res){
        res.render("auth-pages/registerPage")
    }
    static postRegister(req, res){
        const {username, password} = req.body

        User.create({
            username, password
        })
        .then(data => {
            res.redirect('/login')
        })
    }
    static getLogin(req, res){
        res.render("auth-pages/loginPage")
    }
}

module.exports = Controller