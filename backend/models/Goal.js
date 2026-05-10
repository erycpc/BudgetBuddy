import mongoose from 'mongoose'

const { Schema } = mongoose

const goalSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    targetAmount: {
        type: Number,
        required: true
    },
    savedAmount: {
        type: Number,
        default: 0
    },
    deadline: {
        type: Date,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true })

const Goal = mongoose.model('Goal', goalSchema)
export default Goal