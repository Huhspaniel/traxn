const mongoose = require('mongoose');
const { Schema } = mongoose;

const trackSchema = new Schema({
    content: {
        type: String,
        trim: true,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

module.exports = mongoose.model('Track', trackSchema);
