const mongoose = require('mongoose');
const { Schema } = mongoose;

const dmSchema = new Schema({
    /*
        Contents of direct messages are AES encrypted with a hash combination of
        the sender's password and id (concatenated and also hashed) and the receiver's id. 
        The resulting key is RSA encrypted with the sender and receiver's public keys.
        This gives only the sender and receiver access to their direct messages.

        The sender's hash of their password and id is created upon login and 
        stored in a JWT payload. The JWT is stored in cookies.
    */
    content: {              // AESencrypt(message, hashKey = SHA256(SHA256(sender.password + sender.id) + receiver.id))
        type: String,
        required: true,
        immutable: {
            allowOnNew: true
        }
    },
    receiverEncryptedKey: { // RSAencrypt(hashKey, receiver.publicKey)
        type: String,
        required: true,
        immutable: true
    },
    senderEncryptedKey: {   // RSAencrypt(hashKey, sender.publicKey)
        type: String,
        required: true,
        immutable: true
    },
    from: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        immutable: {
            allowOnNew: true
        }
    },
    to: {
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