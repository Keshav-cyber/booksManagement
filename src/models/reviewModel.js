

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
        default: 'Guest'
    },
    reviewedAt: {
        type: Date,
        required: true
    },
    rating: {
        type: Number,
        minlength: 1,
        maxlength: 5,
        required: true
    },
    review: {                       // optional
        type: String
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
},{timeStamps: true})


module.exports =  mongoose.model("Review",reviewSchema)