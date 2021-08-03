const mongoose = require('mongoose');
const Schema = mongoose.Schema;
            
const todosSchema = new Schema({
    text: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});
            
module.exports = User = mongoose.model('todos', todosSchema);