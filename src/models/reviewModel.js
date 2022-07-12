
const mongoose = require('mongoose')

const ObjectId = mongoose.Schema.Types.ObjectId

const reviewSchema = new mongoose.Schema({
    bookId: {
        type: ObjectId,
        ref: "Book",
        required: true
    },
    reviewedBy: {                   // value: reviewer's name
        type: String,
        required: true,
        default: 'Guest',
        trim:true
    },
    reviewedAt: {
        type: Date,
        required: true
    },
    rating: {                               //review, rating, reviewer's name
        type: Number,
        required: true
    },
    review: {                       // optional
        type: String,
        trim:true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
},{timestamps: true})


module.exports =  mongoose.model("Review",reviewSchema)