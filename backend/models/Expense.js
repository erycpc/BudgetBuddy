import mongoose from 'mongoose'

const { Schema } = mongoose

const expenseSchema = new Schema({
    description: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    category: {
        type: String,
        required: true,
        enum: ['Food', 'Transport', 'Bills', 'Shopping', 'Health', 'Entertainment', 'Other']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true })

const Expense = mongoose.model('Expense', expenseSchema)
export default Expense