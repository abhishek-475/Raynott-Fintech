const mongoose = require('mongoose')

const AccountSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        default: 'My Account'
    },
    type: {
        type: String,
        enum: ['savings', 'checking'],
        default: 'checking'
    },
    balance: {
        type: Number,
        default: 0
    },
    currency: {
        type: String,
        default: 'INR'
    }
}, { timestamps: true })

module.exports = mongoose.model('Account', AccountSchema)