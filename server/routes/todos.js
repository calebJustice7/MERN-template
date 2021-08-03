const express = require('express');
const router = express.Router();
const todos = require('../models/todos');
const checkAuth = require('../middleware/check-auth');

router.post('/', (req, res) => {
    if (!Object.keys(req.body).length) {
        req.body = {};
    }
    todos.find(req.body.query).then(data => {
            res.json({ data, success: true });
        })
        .catch(err => {
            res.json({ message: 'Something went wrong getting todos', success: false })
        })
})

router.post('/create', (req, res) => {
    let newObj = new todos({
        ...req.body,
    });

    newObj.save().then(data => {
        res.json({ data, success: true });
    }).catch(err => {
        res.json({ message: err.message, success: false, error: err });
    })
})

router.delete('/:_id', async(req, res) => {
    if (!req.params._id) {
        res.json({ message: 'Must provide todos id to remove', success: false });
    } else {
        let deleted = await todos.deleteOne({ _id: req.params._id }, (err) => {
            if (err) {
                res.json({ message: 'Something went wrong deleting todos', success: false, error: err });
            }
        })
        res.status(200).json({ message: 'todos deleted successfully', success: true, data: deleted });
    }
})

router.get('/:id', async(req, res) => {
    if (!req.params.id) {
        res.json({ message: 'Must provide todos id to remove', success: false });
    } else {
        todos.findOne({ _id: req.params.id }).then(ress => {
            res.json({ data: ress, success: true });
        }).catch(er => {
            res.json({ message: er.message, success: false });
        })
    }
})

module.exports = router;