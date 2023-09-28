const { User, Post, Comment, Profile } = require('../models/index')
const bcrypt = require('bcryptjs')
const multer = require('multer')


class Controller{
    static homePage(req, res) {
        res.render('home')
    }
    // get register
    static registerform(req, res) {
        res.render('auth-pages/registerPage')
    }

    // post register
    static postregister(req, res) {
        const { username, password, role} = req.body
        User.create({
            username, password, role
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

        const { username, password} = req.body
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
                    // console.log("berhasil login");

                    req.session.userId = user.id
                    req.session.role = user.role  // set session di login
                    return res.redirect('/home')
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

    static uploadPost(req, res) {
        const UserId = req.session.userId
        const { title, theme } = req.body
        const fileName = req.file.filename
        Post.create({
            title, fileName, theme, UserId
        })
        .then(data => {
            res.redirect('/home')
        })
        .catch(err => {
            res.send(err)
        })
    }
    
    static uploadPage(req, res) {
        res.render('auth-pages/post')
    }

    static listPost(req, res) {
        const id = req.session.userId
        User.findOne({
            where: { id }
        })
        .then(dataUser => {
            const UserId = dataUser.id
            return Post.findAll({
                include: [User, Comment],
                where: {
                    UserId
                }
            })
        })
        .then(data => {
            res.render('auth-pages/listPage', { data })
        })
        .catch(err => {
            res.send(err)
        })
    }

    static detailPost(req, res) {
        const id = req.params.id
        Post.findOne({
            where: { id },
            include: [Comment]
        })
        .then(data => {
            res.render('auth-pages/detailpost', { data })
        })
        .catch(err => {
            res.send(err)
        })
    }



}

module.exports = Controller