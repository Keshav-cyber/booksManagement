const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const bookController = require('../controllers/bookController')
const reviewController = require('../controllers/reviewController')
const {authenticate, authorise} = require("../middleware/middleware")

router.post("/register", userController.registerUser)    //H
router.post("/login",userController.loginUser)          //H


router.post("/books",authenticate,authorise,bookController.createBook)        //H
router.get("/books",authenticate,bookController.getFilterdBooks)  //K
router.get("/books/:bookId",authenticate,bookController.getBookByParam)  //K
router.put("/books/:bookId",authenticate,authorise,bookController.updateBook)  //K
router.delete("/books/:bookId",authenticate,authorise,bookController.deleteBook)  //K

router.post("/books/:bookId/review",reviewController.createReview)
router.put("/books/:bookId/review/:reviewId",reviewController.updateReview)
router.delete("/books/:bookId/review/:reviewId",reviewController.deleteReview)



module.exports = router;