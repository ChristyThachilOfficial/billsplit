const db = require('../config/db')
const jwt = require('jsonwebtoken')
const { ObjectId } = require("mongodb")
const bcrypt = require('bcrypt')

module.exports = {

    //signup user
    doSignup: async (req, res) => {
        let user = await db.get().collection('user').findOne({ email: req.body.email })
        if (user) {
            res.status(409).json({
                message: "Entered credentials already exists"
            })
        } else {
            await bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        error: err
                    })
                } else {
                    db.get().collection('user').insertOne({
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        email: req.body.email,
                        password: hash
                    })
                        .then((response) => {
                            let token = jwt.sign({ email: req.body.email, userId: response.insertedId }, 'secret', { expiresIn: '1hr' })

                            res.status(201).json({
                                message: "user created",
                                token: token
                            })
                        }).catch((err) => {
                            res.status(500).json({
                                error: err
                            })
                        })
                }
            })
        }

    },


    //user login
    doLogin: async (req, res) => {
        let response = {}
        let user = await db.get().collection('user').findOne({ email: req.body.email })
        if (user) {
            bcrypt.compare(req.body.password, user.password).then((status) => {
                if (status) {
                    let token = jwt.sign({ email: req.body.email, userId: user._id,username:user.firstName }, 'secret', { expiresIn: '1hr' })
                        response.user = user,
                        response.status = true
                        res.status(200).json({
                        message: "Auth success",
                        token: token
                    })
                } else {
                    res.status(401).json({
                        message: "Incorrect Email or password"
                    })
                }
            })
        } else {
            res.status(404).json({
                message: "User not found"
            })
        }
    },

    getFriends: async (req, res) => {
        let friends = await db.get().collection('user').find().toArray()
        if (friends) {
            res.status(200).json({
                message: 'users found',
                users: friends
            })
        } else {
            res.status(404).json({
                message:'friends not found'
            })
        }
    }
}