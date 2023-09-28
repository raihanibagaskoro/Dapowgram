const { User, Post, Comment, Profile } = require('../models/index')
const bcrypt = require('bcryptjs')
const {published} = require('../helpers/helper');
const { Op } = require('sequelize');


class Controller{
    static indexPage(req, res){
        res.render('index')
    }
    static homePage(req, res){
        const title = req.query.title;
        const id = req.session.userId;
        const option = {}
        if(title) {
            option.title = {
                [Op.iLike]: `%${title}%`
            }
        }
        User.findOne({
            where: { id}
        })
        .then(dataUser => {
            const UserId = dataUser.id
            return Post.findAll({
                include: [User, Comment],
                where: {
                    UserId, ...option
                }
            })
        })
        .then(data => {
            res.render('home', { data })
        })
        .catch(err => {
            res.send(err)
        })
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
        .then(data => {
            const UserId = data.id
            const {fullName, bio, hobby} = ""
            return Profile.create({
                fullName, bio, hobby, UserId
            })
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

    static profilePage(req, res){
        const UserId = req.session.userId
        // console.log(req.session);
        // console.log(UserId);
        Profile.findOne({
            include: [User],
            where: {
                UserId
            }
        })
        .then(data => {
            res.render("profilePage", {data})
        })
        .catch(err => {
            res.send(err)
        })
    }

    static getEditBio(req, res){
        const UserId = req.session.userId
        Profile.findOne({
            where: {
                UserId
            }
        })
        .then(data => {
            res.render("editBio", {data})
        })
        .catch(err => {
            res.send(err)
        })
    }

    static postGetBio(req, res){
        // const UserId = req.session.userId
        const id = +req.params.id
        const {fullName, bio, hobby} = req.body
        Profile.update({
            fullName, bio, hobby
        },
        {
            where: {id}
        }
        )
        .then(() => {
            res.redirect(`/profile`)
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


    static detailPost(req, res) {
        const id = req.params.id
        Post.findByPk(id, {
            include: [User, Comment]
        })
        .then(data => {
            console.log(data.Comments);
            res.render('auth-pages/detailpost', { data, published})
        })
        .catch(err => {
            res.send(err)
        })
    }

    static addComment(req, res) {
        const PostId = +req.params.id
        const UserId = req.session.userId
        const { content } = req.body
        console.log(req.session.UserId);
        Comment.create({
            content, PostId, UserId
        })
        .then(() => {
            res.redirect(`/detailpost/${PostId}`)
        })
        .catch(err => {
            console.log(err);
            res.send(err)
        })
    }


    static deletePost(req, res) {
        const id = req.params.id
        Post.destroy({
            where : {id}
        })
        .then(() => {
            res.redirect('/home')
        })
        .catch(err => {
            res.send(err)
        })
    }
    static addLike(req, res) {
        const id = req.params.id;
        let PostId;
        Comment.findByPk(+id)
            .then(comment => {
                PostId = comment.PostId;
                const like = comment.totalLike + 1;
                return comment.update({totalLike: like});
            })
            .then(() => {
                res.redirect('/detailpost/'+PostId);
            })
            .catch(err => res.send(err));
    }

}

module.exports = Controller