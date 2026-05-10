import mongoose from 'mongoose'

const { Schema } = mongoose

const investmentSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['Stock', 'Crypto', 'Real Estate', 'Bond', 'Other']
    },
    amountInvested: {
        type: Number,
        default: 0
    },
    currentValue: {
        type: Number,
        default: 0
    },
    date: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true })

const Investment = mongoose.model('Investment', investmentSchema)
export default Investment