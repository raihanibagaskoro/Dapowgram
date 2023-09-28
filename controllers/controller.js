const { User } = require('../models/index')
const bcrypt = require('bcryptjs')

class Controller{
    static homePage(req, res) {
        res.render('index')
    }
    // get register
    static registerform(req, res) {
        res.render('auth-pages/registerPage')
    }

    // post register
    static postregister(req, res) {
        const { username, password } = req.body
        User.create({
            username, password
        })
        .then(newUser => {
            res.redirect('/login')
        })
        .catch(err => {
            console.log(err);
            res.send(err)
        })
    }

    // get login
    static loginform(req, res) {
        const { error } = req.query
        res.render('auth-pages/loginPage', { error })
    }

    // post login
    static postlogin(req, res) {
        // apakah dari username dan password yang diinput, usernya ada?
        // -- findOne user dari username
        // -- kalo user ada, compare plain password apakah sama dengan hash password (di database)
        // -- kalo gak sama passwordnya, gak boleh masuk ke redirect home atau apalah/keluar error
        // -- kalo passwordnya sesuai, maka berhasil redirect

        const { username, password } = req.body
        User.findOne({
            where: {
                username
            }
        })
        .then(user => {
            if (user) {
                const validPassword = bcrypt.compareSync(password, user.password)
                if (validPassword) {
                    // case user berhasil login

                    req.session.userId = user.id
                    req.session.role = user.role  // set session di login
                    return res.redirect('/')
                } else {
                    const error = "invalid password"
                    return res.redirect(`/login?error=${error}`)
                }
            } else {
                const error = "invalid password"
                return res.redirect(`/login?error=${error}`)
            }
        })
        .catch(err => {
            res.send(err)
        })

    }

    static logout(req, res) {
        req.session.destroy(err => {
            if (err) {
                res.send(err)
            } else {
                res.redirect('/login')
            }
        })
    }

    // static profilepage(req, res) {
    //     res.render('profile')
    // }

}

module.exports = Controller