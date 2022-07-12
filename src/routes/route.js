const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const bookController = require('../controllers/bookController')
const reviewController = require('../controllers/reviewController')
const {authenticate, authorise} = require("../middleware/middleware")

router.post("/register", userController.registerUser)
router.post("/login",userController.loginUser)


router.post("/books",authenticate,authorise,bookController.createBook)
router.get("/books",authenticate,bookController.getFilterdBooks)
router.get("/books/:bookId",authenticate,bookController.getBookByParam)
router.put("/books/:bookId",authenticate,authorise,bookController.updateBook)
router.delete("/books/:bookId",authenticate,authorise,bookController.deleteBook)

router.post("/books/:bookId/review",reviewController.createReview)
router.put("/books/:bookId/review/:reviewId",reviewController.updateReview)
router.delete("/books/:bookId/review/:reviewId",reviewController.deleteReview)



module.exports = router;