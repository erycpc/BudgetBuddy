import mongoose from 'mongoose'

const { Schema } = mongoose

const budgetSchema = new Schema({
    category: {
        type: String,
        required: true,
        enum: ['Food', 'Transport', 'Bills', 'Shopping', 'Health', 'Entertainment', 'Other']
    },
    limit: {
        type: Number,
        required: true
    },
    amount: {
        type: Number,
        default: 0
    },
    month: {
        type: Number,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {timestamps: true})

const Budget = mongoose.model('Budget', budgetSchema)
export default Budget