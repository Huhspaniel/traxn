const mongoose = require('mongoose');
const { Schema } = mongoose;

const trackSchema = new Schema({
    content: {
        type: String,
        trim: true,
        required: true,
        minlength: 2
    },
    _postedAt: {
        type: Date,
        immutable: true,
        defaultValue: new Date
    },
    _updatedAt: { // Allow updates? TBD
        type: Date,
        immutable: true
    },
    taggedUsers: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    tags: [{
        type: String,
        trim: true,
        match: /^[a-z0-9-_]+$/i
    }],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        immutable: {
            allowOnInit: true
        }
    }
})
trackSchema.plugin(function immutableValidator(schema, options) {
    schema.pre('validate', function () {
        const isImmutable = ({ path, options: { immutable } }) => (
            immutable && this.isModified(path) && !(this.isNew && immutable.allowOnInit)
        );
        schema.eachPath((path, schemaType) => {
            if (isImmutable(schemaType)) {
                this.invalidate(path, new Error('Field is immutable'), this[path]);
            }
        });
    });
})
trackSchema.pre('save', function () {
    if (this.isNew) {
        this._postedAt = new Date();
        this._updatedAt = undefined;
    } else if (this.isModified()) {
        this._updatedAt = new Date();
    }

    if (this.isModified('content')) {
        this.content = this.content.replace(/(\s(?=\s))+/g, ''); // Remove extra white space
    }
})

module.exports = mongoose.model('Track', trackSchema);
