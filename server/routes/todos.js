const express = require('express');
const router = express.Router();
const todos = require('../models/todos');
const checkAuth = require('../middleware/check-auth');

router.post('/', checkAuth, (req, res) => {
    if(!Object.keys(req.body).length) {
        req.body = {};
    }
    todos.find(req.body.query).then(data => {
        res.json({data, success: true});
    })
        .catch(err => {
            res.status(200).json({message: 'Something went wrong getting todos', success: false})
        })
})

router.post('/create', checkAuth, (req, res) => {
    let newObj = new todos({
        ...req.body,
    });

    newObj.save().then(data => {
        res.json({data, success: true});
    }).catch(err => {
        res.status(200).json({message: 'Something went wrong creating todos', success: false, error: err});
    })
})

router.delete('/:_id', checkAuth, async (req, res) => {
    if (!req.params._id) {
        res.status(200).json({message: 'Must provide todos id to remove', success: false});
    } else {
        let deleted = await todos.deleteOne({ _id: req.params._id }, (err) => {
            if (err) {
                res.status(200).json({message: 'Something went wrong deleting todos', success: false, error: err});
            }
        })
        res.status(200).json({message: 'todos deleted successfully', success: true, data: deleted});
    }
})


module.exports = router;
