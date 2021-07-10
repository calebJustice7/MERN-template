const mongoose = require('mongoose');
const Schema = mongoose.Schema;
            
const todosSchema = new Schema({
    todo: {
        type: String,
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        required: true
    },
}, {
    timestamps: true
});
            
module.exports = User = mongoose.model('todos', todosSchema);