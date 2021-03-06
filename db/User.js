const mongoose = require("mongoose");
const { Schema } = mongoose;
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require("bcryptjs");

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    match: [
      /^[a-z0-9_-]+$/i,
      "Username can only contain letters, numbers, _, and -"
    ],
    minlength: [3, "Username must be between 3 and 18 characters"],
    maxlength: [18, "Username must be between 3 and 18 characters"]
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Invalid email"
    ]
  },
  password: {
    type: String,
    required: true,
    trim: true,
    match: [
      /(?=.*[a-z])(?=.*[0-9]).*/i,
      "Password must contain at least one letter and one number"
    ],
    immutable: {
      allowOnNew: true
    }
  },
  displayName: {
    type: String,
    trim: true,
    match: [
      /^[a-z'-\s]+$/i,
      "Display name can only include letters, spaces, ', and -"
    ],
    required: true,
    minlength: [3, "Display name must be between 3 and 18 characters"],
    maxlength: [18, "Display name must be between 3 and 18 characters"]
  },
  following: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      immutable: true
    }
  ],
  _publicKey: {
    type: String,
    immutable: true
  },
  _privateKey: {
    // AES encrypted
    type: String,
    immutable: true
  },
  imageUrl: {
    type: String,
    default:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Anonymous_emblem.svg/1920px-Anonymous_emblem.svg.png"
  },
  location: {
    type: String,
    trim: true
  },
  website: {
    type: String,
    trim: true
  },
  birthday: {
    type: Date
  },
  _joinedAt: {
    type: Number,
    immutable: true,
    default: Date.now
  },
  tracks: [
    {
      type: Schema.Types.ObjectId,
      ref: "Track",
      immutable: true
    }
  ]
});
userSchema.plugin(uniqueValidator);
userSchema.pre(`save`, function(next) {
  if (this.isModified("name")) {
    this.name = this.name.replace(/(\s(?=\s))+/g, ""); // Remove extra white space
  }
  if (this.isModified("password")) {
    if (this.password.length >= 6 && this.password.length <= 20) {
      bcrypt
        .hash(this.password, 10)
        .then(hashed => {
          this.password = hashed;
          next();
        })
        .catch(err => {
          this.invalidate("password", err);
          next();
        });
    } else {
        this.invalidate("password", new Error('Password must be between 6 and 20 characters'))
        next();
    }
  } else {
    next();
  }
});

module.exports = mongoose.model("User", userSchema);
