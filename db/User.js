const mongoose = require('mongoose');
const { Schema } = mongoose;
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        match: [
            /^[a-z0-9_-]+$/i,
            'Username can only contain letters, numbers, _, and -'
        ]
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Invalid email'
        ]
    },
    password: {
        type: String,
        required: true,
        trim: true,
        match: [
            /(?=.*[a-z])(?=.*[0-9]).*/i,
            'Password must contain at least one letter and one number'
        ]
    },
    displayName: {
        type: String,
        trim: true,
        match: [
            /^[a-z'-\s]+$/i,
            'Dipslay name can only include letters, spaces, \', and -'
        ]
    },
    following: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    _publicKey: {
        type: String,
        immutable: true
    },
    _privateKey: { // AES encrypted
        type: String,
        immutable: true
    }
})
userSchema.plugin(uniqueValidator);
userSchema.pre(`save`, function (next) {
    if (this.isModified('name')) {
        this.name = this.name.replace(/(\s(?=\s))+/g, ''); // Remove extra white space
    }

    var user = this;
    //if (!user.isModified('password')) return next();
    bcrypt.hash(user.password, 10)
        .then(function (hashed) {
            user.password = hashed;
            next();
        })
        .catch(function (err) {
            res.json({ status: "error", message: err });
        });
});

module.exports = mongoose.model('User', userSchema);
