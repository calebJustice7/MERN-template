const stringUtils = require('../utils/stringUtils');

let obj = () => {
    return {
        model: (schemaName) => {
            schemaName = stringUtils('camelCase', schemaName);
            return (
`const mongoose = require('mongoose');
const Schema = mongoose.Schema;
            
const ${schemaName}Schema = new Schema({
    text: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});
            
module.exports = User = mongoose.model('${schemaName}', ${schemaName}Schema);`)
        },
        route: (schemaName, reqAuth) => {
            let newSchemaName = stringUtils('camelCase', schemaName);
            let auth = reqAuth ? ' checkAuth,' : '';
            return (
`const express = require('express');
const router = express.Router();
const ${newSchemaName} = require('../models/${schemaName}');
const checkAuth = require('../middleware/check-auth');

router.post('/',${auth} (req, res) => {
    if(!Object.keys(req.body).length) {
        req.body = {};
    }
    ${newSchemaName}.find(req.body.query).then(data => {
        res.json({data, success: true});
    })
        .catch(err => {
            res.status(200).json({message: 'Something went wrong getting ${newSchemaName}', success: false})
        })
})

router.post('/create',${auth} (req, res) => {
    let newObj = new ${newSchemaName}({
        ...req.body,
    });

    newObj.save().then(data => {
        res.json({data, success: true});
    }).catch(err => {
        res.status(200).json({message: 'Something went wrong creating ${newSchemaName}', success: false, error: err});
    })
})

router.delete('/:_id',${auth} async (req, res) => {
    if (!req.params._id) {
        res.status(200).json({message: 'Must provide ${newSchemaName} id to remove', success: false});
    } else {
        let deleted = await ${newSchemaName}.deleteOne({ _id: req.params._id }, (err) => {
            if (err) {
                res.status(200).json({message: 'Something went wrong deleting ${newSchemaName}', success: false, error: err});
            }
        })
        res.status(200).json({message: '${newSchemaName} deleted successfully', success: true, data: deleted});
    }
})


module.exports = router;
`
            )
        }
    }
}

module.exports = obj();