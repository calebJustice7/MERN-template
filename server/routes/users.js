const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Users = require('../models/User');
const validator = require('../validators/validators');
const checkAuth = require('../middleware/check-auth');
const { cloudinary } = require('../config/cloudinary');

router.post('/login', (req, res) => {
    const { errors, isValid } = validator.loginValidator(req.body);
    if (!isValid) {
        res.status(200).json({ message: 'An error occured', errors, success: false });
    } else {
        Users.findOne({ email: req.body.email }).then(user => {
            console.log(user);
            if (!user) {
                res.status(200).json({ message: 'Email does not exist', success: false });
            } else {
                bcrypt.compare(req.body.password, user.password)
                    .then(success => {
                        if (!success) {
                            res.status(200).json({ message: 'Password does not match', success: false });
                        } else {
                            const payload = { id: user._id }
                            jwt.sign(
                                payload,
                                process.env.APP_SECRET, { expiresIn: 86400 },
                                (err, token) => {
                                    res.json({
                                        user: user,
                                        token: 'Bearer token: ' + token,
                                        success: true
                                    })
                                }
                            )
                        }
                    })
            }
        })
    }
});

router.post('/register', (req, res) => {
    const { errors, isValid } = validator.registerValidator(req.body);
    if (!isValid) {
        res.status(200).json({ message: 'Something went wrong registering', success: false, errors });
    } else {
        Users.findOne({ email: req.body.email }).then(user => {
            if (user) {
                res.status(200).json({ message: 'Email is already in use!', success: false });
            } else {
                const { email, username, password } = req.body;
                const newUser = new Users({ email, username, password });
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save().then((user) => {
                            res.json({ message: 'User Account Created', success: true, user })
                        }).catch(err => res.status(200).json({ message: 'Something went wrong creating user', success: false }))
                    })
                })
            }
        })
    }
})

router.delete('/:id', async(req, res) => {
    if (!req.params.id) {
        res.status(200).json({ message: 'Must provide user id to remove', success: false });
    } else {
        let deleted = await Users.deleteOne({ _id: req.params.id }, (err) => {
            if (err) {
                res.status(200).json({ message: 'Something went wrong deleting user', success: false, error: err });
            }
        })
        res.status(200).json({ message: 'User deleted successfully', success: true, data: deleted });
    }
})

router.get('/:id', (req, res) => {
    if (!req.params.id) {
        res.json({ message: 'Must provide user id to find', success: false });
    } else {
        Users.findOne({ _id: req.params.id }).then(ress => {
            res.status(200).json({ success: true, data: ress });
        }).catch(er => {
            res.json({ message: er.message, success: false });
        })
    }
})

router.post('/', (req, res) => {
    if (req.body.query) {
        req.body.query = {};
    }
    Users.findOne(req.body.query).then(users => {
        res.status(200).json({ success: true, data: users });
    }).catch(er => {
        res.status(200).json({ message: er, success: false });
    })
})

module.exports = router;