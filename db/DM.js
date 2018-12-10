const mongoose = require('mongoose');
const { Schema } = mongoose;

const dmSchema = new Schema({
    /*
        Contents of direct messages are AES encrypted with a hash combination of
        the sender and receiver's ids, and a randomly generated string of characters. 
        The resulting key is RSA encrypted with the sender and receiver's public keys.
        This gives only the sender and receiver access to their direct messages.
    */
    content: {              // AESencrypt(message, hashKey = SHA256(SHA256(sender.id + receiver.id + random))
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