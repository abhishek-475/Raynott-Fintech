const mongoose = require('mongoose')

const TransactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fromAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account'
    },
    toAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account'
    },
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ['deposit', 'withdraw', 'transfer'],
        required: true
    },
    description: {
        type: String
    }
}, { timestamps: true })

module.exports = mongoose.model('Transaction', TransactionSchema)