const { default: mongoose } = require('mongoose')
const bookModel = require('../models/bookModel')
const userModel = require('../models/userModel')

const { isValid, isValidDate, isValidName } = require('./validation')



const createBook = async function (req, res) {
    try {
        let { title, excerpt, userId, ISBN, bookImage, category, subcategory, releasedAt } = req.body
        if (Object.keys(req.body).length < 1) return res.status(400).send({
            status: false,
            message: "Insert data "
        })

        if (!isValid(title)) {
            return res.status(400).send({ status: false, message: " title is required" })
        }

        const isAvailable = await bookModel.find({ title: title })
        if (isAvailable.length > 0) { return res.status(400).send({ status: false, message: "title already available,use different one" }) }


        if (!isValid(excerpt)) {
            return res.status(400).send({ status: false, message: "excerpt is required" })
        }
        if (!isValidName(excerpt)) {
            return res.status(400).send({ status: false, message: "enter valid excerpt" })
        }
        if (!isValid(userId)) {
            return res.status(400).send({ status: false, message: "UserId is required" })
        }

        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "Enter Valid userId" })
        }

        const user = await userModel.find({ _id: userId })
        if (user.length === 0) {
            return res.status(400).send({ status: false, message: "No user with given Id found" })
        }

        if (!isValid(ISBN)) {
            return res.status(400).send({ status: false, message: "ISBN is required" })
        }

        const uniqueISBN = await bookModel.find({ ISBN: ISBN })
        if (uniqueISBN.length > 0) { return res.status(400).send({ status: false, message: "ISBN already available, use different one" }) }

        

        if (!isValid(category)) {
            return res.status(400).send({ status: false, message: "Category is required" })
        }
        if(!isValidName(category)){
            return res.status(400).send({ status: false, message: "enter valid Category " })
        }
        if (!isValid(subcategory)) {
            return res.status(400).send({ status: false, message: "SubCategory is required" })
        }

        if (!isValid(releasedAt)) {
            return res.status(400).send({ status: false, message: "Released is required" })
        }
        if (!isValidDate(releasedAt)) {
            return res.status(400).send({ status: false, message: "Date is note valid format(YYYY-MM-DD)" })
        }
        let createBook = await bookModel.create(req.body)

        res.status(201).send({
            status: true,
            message: 'Success',
            data: createBook
        })

    }
    catch (error) {
        res.status(500).send({ msg: error.message })
    }
}

module.exports.createBook = createBook


const getBookByParam = async function (req, res) {
    try {

        const id = req.params.bookId

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).send({ status: false, message: "Enter valid bookId" })
        }

        const book = await bookModel.findOne({ _id: id, isDeleted: false })

        if (!book) {
            return res.status(400).send({ status: false, message: "No book with this ID exist" })
        }

        return res.status(200).send({ status: true, message: "Book list", data: book })

    } catch (err) {
        res.status(500).send({ msg: error.message })
    }
}

module.exports.getBookByParam = getBookByParam



const getFilterdBooks = async function (req, res) {
    try {

        let allBooks = await bookModel.find({ $and: [req.query, { isDeleted: false }] }).select({ title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1 })  // add review

        if (allBooks.length < 1) return res.status(404).send({
            status: false,
            message: "no books found"
        })

        res.status(200).send({
            status: true,
            message: 'Books list',
            data: allBooks
        })

    } catch (err) {
        res.status(500).send({ msg: error.message })
    }
}

module.exports.getFilterdBooks = getFilterdBooks

const updateBook = async function (req, res) {
    try {

        let id = req.params.bookId
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).send({ status: false, message: "Invalid bookId" })
        }
        let { title, ISBN, excerpt, releasedAt } = req.body

        if (Object.keys(req.body).length < 1) return res.status(400).send({
            status: false,
            message: "Insert data to Update "
        })
        let checkTitle = await bookModel.findOne({ title: title, isDeleted: false })
        if (checkTitle) return res.status(400).send({
            status: false,
            message: "title is already in use , give another title"
        })
        let checkIsbn = await bookModel.findOne({ ISBN: ISBN, isDeleted: false })
        if (checkIsbn) return res.status(400).send({
            status: false,
            message: "isbn is already in use , give another isbn"
        })
        if(excerpt){
            if(!isValidName(excerpt)){
                return res.status(400).send({ status: false, message: "enter valid excerpt" })
            }
        }
        if(releasedAt){
            if (!isValidDate(releasedAt)) return res.status(400).send({
                status: false,
                message: "enter valid date"
            })
        }

        const updateData = await bookModel.findOneAndUpdate({ _id: id, isDeleted: false }, { title: title, excerpt: excerpt, ISBN: ISBN, releasedAt: releasedAt }, { new: true })

        if (!updateData) {
            return res.status(404).send({ status: false, message: "No book found with given Id" })
        }

        return res.status(201).send({ status: false, message: "Success", data: updateData })



    } catch (error) {
        res.status(500).send({ msg: error.message })
    }
}

module.exports.updateBook = updateBook


const deleteBook = async function (req, res) {
    try {
        const id = req.params.bookId

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).send({ status: false, message: "Enter valid bookId" })
        }

        const deleteData = await blogModel.findOneAndUpdate({ _id: id, isDeleted: false }, { isDeleted: true, deletedAt: new Date() }, { new: true })

        if (!deleteData) { return res.status(404).send({ status: false, msg: "No book exist with this id" }) }
        return res.status(200).send({ status: true, data: deleteData })


    }

    catch (error) {
        res.status(500).send({ msg: error.message })
    }
}

module.exports.deleteBook = deleteBook