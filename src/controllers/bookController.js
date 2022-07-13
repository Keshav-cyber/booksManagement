const mongoose = require('mongoose')
const bookModel = require('../models/bookModel')
const reviewModel = require('../models/reviewModel')
const userModel = require('../models/userModel')

const { isValid, isValidDate, isValidName, isValidISBN, isValidTitleName } = require('./validation')

//===================================================Create Book Api =================================================

const createBook = async function (req, res) {
    try {

        //destructuring request body
        let { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = req.body
        if (Object.keys(req.body).length < 1) return res.status(400).send({
            status: false,
            message: "Insert data "
        })

        //checking if title is present or not
        if (!isValid(title)) {
            return res.status(400).send({ status: false, message: " title is required" })
        }

        //checking for valid title
        if (!isValidTitleName(title)) {
            return res.status(400).send({ status: false, message: " title is not valid min length 2" })
        }

        //checking for uniqueness of title
        const isAvailable = await bookModel.find({ title: title })
        if (isAvailable.length > 0) { return res.status(400).send({ status: false, message: "title already available,use different one" }) }


        //checking if excerpt is present or not
        if (!isValid(excerpt)) {
            return res.status(400).send({ status: false, message: "excerpt is required" })
        }

        //checking if except is valid
        if (!isValidName(excerpt)) {
            return res.status(400).send({ status: false, message: "enter valid excerpt" })
        }

        //checking if userId is present or not
        if (!isValid(userId)) {
            return res.status(400).send({ status: false, message: "UserId is required" })
        }

        //checking for valid userId
        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "Enter Valid userId" })
        }

        //checking for uniqueness of userId
        const user = await userModel.find({ _id: userId })
        if (user.length === 0) {
            return res.status(400).send({ status: false, message: "No user with given Id found" })
        }

        //checking if ISBN is present or not
        if (!isValid(ISBN)) {
            return res.status(400).send({ status: false, message: "ISBN is required" })
        }

        //checking if ISBN is valid or not
        if (!isValidISBN(ISBN)) {
            return res.status(400).send({ status: false, message: "ISBN is not valid ISBN" })
        }

        //checking for uniqueness of ISBN
        const uniqueISBN = await bookModel.find({ ISBN: ISBN })
        if (uniqueISBN.length > 0) { return res.status(400).send({ status: false, message: "ISBN already available, use different one" }) }



        //checking if category is present or not
        if (!isValid(category)) {
            return res.status(400).send({ status: false, message: "Category is required" })
        }

        //checking if category is valid
        if (!isValidName(category)) {
            return res.status(400).send({ status: false, message: "enter valid Category " })
        }

        //checking if subcategory is a non empty Object
        if (typeof (subcategory) != 'object' || subcategory.length < 1) {
            return res.status(400).send({ status: false, message: "SubCategory is required" })
        }

        //validating each element of subcategory
        for (let item of subcategory) {
            if (!isValid(item)) { return res.status(400).send({ msg: "not valid SubCategory items" }) }
        }

        //checking if released date is present and available in valid format
        if (!isValid(releasedAt)) {
            return res.status(400).send({ status: false, message: "Released is required" })
        }
        if (!isValidDate(releasedAt)) {
            return res.status(400).send({ status: false, message: "Date is note valid format(YYYY-MM-DD)" })
        }

        //creating and returning created book
        let createBook = await bookModel.create(req.body)

        res.status(201).send({
            status: true,
            message: 'Success',
            data: createBook
        })

    }
    catch (error) {
        return res.status(500).send({ msg: error.message })
    }
}

//===================================================get Book Api =================================================


const getBookByParam = async function (req, res) {
    try {

        const id = req.params.bookId

        //checking if bookId is valid 
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).send({ status: false, message: "Enter valid bookId" })
        }

        //finding book
        const book = await bookModel.findOne({ _id: id, isDeleted: false })

        //When book is not available
        if (!book) {
            return res.status(404).send({ status: false, message: "No book with this ID exist" })
        }

        //finding review for given bookId
        let reviews = await reviewModel.find({ bookId: id, isDeleted: false }).select({ bookId: 1, reviewedBy: 1, reviewedAt: 1, rating: 1, review: 1 })

        //storing all the reviews in reviewsData and adding that field to book
        book._doc.reviewsData = reviews
        return res.status(200).send({ status: true, message: "Book list", data: book })

    } catch (err) {
        res.status(500).send({ msg: error.message })
    }
}


//===============================================get filterd Books Api =================================================


const getFilterdBooks = async function (req, res) {
    try {

        //finding book
        let allBooks = await bookModel.find({ $and: [req.query, { isDeleted: false }] }).select({ title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1 }).sort({ title: 1 })  // add review

        //When no book is found
        if (allBooks.length < 1) return res.status(404).send({
            status: false,
            message: "no books found"
        })

        //returning all books
        res.status(200).send({
            status: true,
            message: 'Books list',
            data: allBooks
        })

    } catch (error) {
        res.status(500).send({ msg: error.message })
    }
}

//===================================================Update Book Api =================================================

const updateBook = async function (req, res) {
    try {

        let id = req.params.bookId

        //checking for valid bookId
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).send({ status: false, message: "Invalid bookId" })
        }

        //destructiurin request body
        let { title, ISBN, excerpt, releasedAt } = req.body



        //chekcking for empty body
        if (Object.keys(req.body).length < 1) return res.status(400).send({
            status: false,
            message: "Insert data to Update "
        })

        //checking for uniqueness of title
        let checkTitle = await bookModel.findOne({ title: title, isDeleted: false })
        if (checkTitle) return res.status(400).send({
            status: false,
            message: "title is already in use , give another title"
        })


        //checking if ISBN is valid
        if (!isValidISBN(ISBN)) {
            return res.status(400).send({ status: false, message: "enter valid isbn length 10  or 13" })
        }

        //checking for uniqueness of ISBN
        let checkIsbn = await bookModel.findOne({ ISBN: ISBN, isDeleted: false })
        if (checkIsbn) return res.status(400).send({
            status: false,
            message: "isbn is already in use , give another isbn"
        })

        //checking for valid excerpt
        if (excerpt) {
            if (!isValidName(excerpt)) {
                return res.status(400).send({ status: false, message: "enter valid excerpt" })
            }
        }

        //checking for valid date
        if (releasedAt) {
            if (!isValidDate(releasedAt)) return res.status(400).send({
                status: false,
                message: "enter valid date"
            })
        }

        //finding and updating given book
        const updateData = await bookModel.findOneAndUpdate({ _id: id, isDeleted: false }, { title: title, excerpt: excerpt, ISBN: ISBN, releasedAt: releasedAt }, { new: true })

        //When book is not found
        if (!updateData) {
            return res.status(404).send({ status: false, message: "No book found with given Id" })
        }

        //returning updated book
        return res.status(200).send({ status: true, message: "Success", data: updateData })



    } catch (error) {
        res.status(500).send({ msg: error.message })
    }
}

//===================================================Delete Book Api =================================================


const deleteBook = async function (req, res) {
    try {
        const id = req.params.bookId

        //checking for valid bookId
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).send({ status: false, message: "Enter valid bookId" })
        }

        //finding and deleting book
        const deleteData = await bookModel.findOneAndUpdate({ _id: id, isDeleted: false }, { isDeleted: true, deletedAt: new Date() }, { new: true })

        //when book is not found
        if (!deleteData) { return res.status(404).send({ status: false, msg: "No book exist with this id" }) }

        //returnig message on successful deletion
        return res.status(200).send({ status: true, data: deleteData })

    }

    catch (error) {
        res.status(500).send({ msg: error.message })
    }
}



//exporting functions
module.exports.createBook = createBook
module.exports.getBookByParam = getBookByParam
module.exports.getFilterdBooks = getFilterdBooks
module.exports.updateBook = updateBook
module.exports.deleteBook = deleteBook