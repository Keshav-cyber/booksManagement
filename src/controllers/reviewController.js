const { default: mongoose } = require('mongoose')
const bookModel = require('../models/bookModel')
const reviewModel = require('../models/reviewModel')
const { isValid, isValidName } = require('./validation')


//===================================================Create Review Api =================================================


const createReview = async function (req, res) {
    try {
        let { reviewedBy, review, rating } = req.body
        let bookId = req.params.bookId
        if (Object.keys(req.body).length < 1) return res.status(400).send({
            status: false,
            message: "Insert data "
        })

        if (!mongoose.isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, message: "Enter Valid BookId" })
        }
        let book = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!book) return res.status(404).send({ status: false, message: "book is not found" })

        if (reviewedBy) {
            if (!isValidName(reviewedBy)) return res.status(400).send({ status: false, message: "eviewedBy only take alphabets" })
        }
        if (!rating) {
            return res.status(400).send({ status: false, message: "Rating is required" })
        }
        if (!(typeof (rating) == "number" && rating >= 1 && rating <= 5)) {
            return res.status(400).send({ status: false, message: "Rating should be number " })
        }

        if (review) {
            if (!isValid(review)) return res.status(400).send({ status: false, message: "Rating should be number and upto 10" })
        }
        req.body.bookId = book._id
        req.body.reviewedAt = new Date()

        let CreateReview = await reviewModel.create(req.body)
        let updatedBook = await bookModel.findOneAndUpdate({ _id: bookId }, { $inc: { reviews: 1 } }, { new: true })

        let { createdAt, updatedAt, __v, isDeleted, ...Review } = CreateReview._doc

        updatedBook._doc.reviewData = Review
        return res.status(201).send({ status: true, message: "Success", data: updatedBook })

    }
    catch (error) {
        res.status(500).send({ msg: error.message })
    }

}

//===================================================Update Review Api =================================================

const updateReview = async function (req, res) {
    try {

        let { review, rating, reviewedBy } = req.body
        let bookId = req.params.bookId
        let reviewId = req.params.reviewId
        if (!mongoose.isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, message: "enter vlaid bookId" })
        }
        if (!mongoose.isValidObjectId(reviewId)) {
            return res.status(400).send({ status: false, message: "enter vlaid reviewId" })
        }
        if (rating) {
            if (!(typeof (rating) == "number" && rating >= 1 && rating <= 5)) {
                return res.status(400).send({ status: false, message: "Rating should be number or between 1 to 5" })
            }
        }

        if (reviewedBy) {
            if (!isValidName(reviewedBy)) return res.status(400).send({ status: false, message: "enter alphabets only" })
        }
        let bookF = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!bookF) return res.status(404).send({ status: false, message: "No book found with given Id" })
        let updatedReview = await reviewModel.findOneAndUpdate({ bookId: bookId, _id: reviewId, isDeleted: false },
            { review: review, rating: rating, reviewedBy: reviewedBy }, { new: true })

        if (!updatedReview) return res.status(404).send({ status: false, message: "No review found with given Id" })
        let { createdAt, updatedAt, __v, isDeleted, ...Review } = updatedReview._doc

        bookF._doc.reviewData = Review
        return res.status(200).send({ status: true, message: "Success", data: bookF })


    }
    catch (error) {
        res.status(500).send({ msg: error.message })
    }

}

//===================================================Delete Review Api =================================================


const deleteReview = async function (req, res) {
    try {
        let id = req.params.bookId
        let ID = req.params.reviewId

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).send({ status: false, message: "Enter Valid Object bookId" })
        }
        if (!mongoose.isValidObjectId(ID)) {
            return res.status(400).send({ status: false, message: "Enter Valid Object reviewId" })
        }
        let book = await bookModel.findOne({ _id: id, isDeleted: false })
        if (!book) return res.status(400).send({ status: false, message: "No book with given bookId" })
        const deleteData = await reviewModel.findOneAndUpdate({ bookId: id, _id: ID, isDeleted: false }, { isDeleted: true, }, { new: true })

        if (!deleteData) {
            return res.status(404).send({ status: false, message: "No data found with given Id" })
        }
        let updateBook = await bookModel.updateOne({ _id: id }, { $inc: { reviews: -1 } })
        return res.status(200).send({ status: false, message: "Successfully deleted !!!" })

    }
    catch (error) {
        res.status(500).send({ msg: error.message })
    }
}



module.exports.createReview = createReview
module.exports.updateReview = updateReview
module.exports.deleteReview = deleteReview