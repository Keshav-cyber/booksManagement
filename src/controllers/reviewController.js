const { default: mongoose } = require('mongoose')
const bookModel = require('../models/bookModel')
const reviewModel = require('../models/reviewModel')
const { isValid, isValidName } = require('./validation')


//===================================================Create Review Api =================================================


const createReview = async function (req, res) {
    try {
        //destructuring request body
        let { reviewedBy, review, rating } = req.body
        let bookId = req.params.bookId


        //checking if body is empty
        if (Object.keys(req.body).length < 1) return res.status(400).send({
            status: false,
            message: "Insert data "
        })


        //checking for valid bookId
        if (!mongoose.isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, message: "Enter Valid BookId" })
        }


        //checking if book is available in our db
        let book = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!book) return res.status(404).send({ status: false, message: "book is not found" })



        //Checking for valid reviewer's name
        if (reviewedBy) {
            if (!isValidName(reviewedBy)) return res.status(400).send({ status: false, message: "ReviewedBy only take alphabets" })
        }


        //Checking if rating is available
        if (!rating) {
            return res.status(400).send({ status: false, message: "Rating is required" })
        }

        //checking rating type and min-max value
        if (!(typeof (rating) == "number" && rating >= 1 && rating <= 5)) {
            return res.status(400).send({ status: false, message: "Rating should be number " })
        }

        if (review) {
            if (!isValid(review)) return res.status(400).send({ status: false, message: "Rating should be number and upto 10" })
        }

        //setting value of bookId and reviewedAt
        req.body.bookId = book._id
        req.body.reviewedAt = new Date()


        //creating review
        let CreateReview = await reviewModel.create(req.body)

        //increasing number of review by 1
        let updatedBook = await bookModel.findOneAndUpdate({ _id: bookId }, { $inc: { reviews: 1 } }, { new: true })

        //removing unwanted fields and storing wanted field data into a new variable
        let { createdAt, updatedAt, __v, isDeleted, ...Review } = CreateReview._doc

        //adding new field reviewData to updatedBook
        updatedBook._doc.reviewData = Review


        //Returning created review data
        return res.status(201).send({ status: true, message: "Success", data: updatedBook })

    }
    catch (error) {
        res.status(500).send({ msg: error.message })
    }

}

//===================================================Update Review Api =================================================

const updateReview = async function (req, res) {
    try {

        //destructuring request body
        let { review, rating, reviewedBy } = req.body

        let bookId = req.params.bookId
        let reviewId = req.params.reviewId

        //checking if given bookId is valid or not
        if (!mongoose.isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, message: "enter vlaid bookId" })
        }

        //checking if given reviewId is vaid or not
        if (!mongoose.isValidObjectId(reviewId)) {
            return res.status(400).send({ status: false, message: "enter vlaid reviewId" })
        }

        //checking if type of rating is number and value between 1 and 5
        if (rating) {
            if (!(typeof (rating) == "number" && rating >= 1 && rating <= 5)) {
                return res.status(400).send({ status: false, message: "Rating should be number or between 1 to 5" })
            }
        }

        //checking for valid reviewer's name
        if (reviewedBy) {
            if (!isValidName(reviewedBy)) return res.status(400).send({ status: false, message: "enter alphabets only" })
        }


        //finding book
        let bookF = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!bookF) return res.status(404).send({ status: false, message: "No book found with given Id" })


        //finding and updating review
        let updatedReview = await reviewModel.findOneAndUpdate({ bookId: bookId, _id: reviewId, isDeleted: false },
            { review: review, rating: rating, reviewedBy: reviewedBy }, { new: true })


        //when no review with given id is found
        if (!updatedReview) return res.status(404).send({ status: false, message: "No review found with given Id" })


        //removing unwanted fields and storing wanted fields into "Review"
        let { createdAt, updatedAt, __v, isDeleted, ...Review } = updatedReview._doc

        //adding new field to bookF
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

        //checking for valid bookId and reviewId
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).send({ status: false, message: "Enter Valid Object bookId" })
        }
        if (!mongoose.isValidObjectId(ID)) {
            return res.status(400).send({ status: false, message: "Enter Valid Object reviewId" })
        }

        //finding book
        let book = await bookModel.findOne({ _id: id, isDeleted: false })
        if (!book) return res.status(400).send({ status: false, message: "No book with given bookId" })


        //deletion
        const deleteData = await reviewModel.findOneAndUpdate({ bookId: id, _id: ID, isDeleted: false }, { isDeleted: true, }, { new: true })

        if (!deleteData) {
            return res.status(404).send({ status: false, message: "No data found with given Id" })
        }

        //reducing number of reviews
        let updateBook = await bookModel.updateOne({ _id: id }, { $inc: { reviews: -1 } })
        return res.status(200).send({ status: false, message: "Successfully deleted !!!" })

    }
    catch (error) {
        res.status(500).send({ msg: error.message })
    }
}


//exporting functions
module.exports.createReview = createReview
module.exports.updateReview = updateReview
module.exports.deleteReview = deleteReview