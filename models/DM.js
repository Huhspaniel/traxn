const mongoose = require('mongoose');
const { Schema } = mongoose;

const dmSchema = new Schema({
    message: {
        type: String,
        required: true
    },
    to: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        immutable: {
            allowOnNew: true
        }
    },
    from: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        immutable: {
            allowOnNew: true
        }
    },
    _sentAt: {
        type: Date,
        immutable: true,
        defaultValue: new Date
    }
});

module.exports = mongoose.model('DM', dmSchema);