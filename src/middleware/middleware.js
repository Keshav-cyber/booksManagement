const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const bookModel = require("../models/bookModel")
const userModel = require("../models/userModel")



const authenticate = function (req, res, next) {
  try {
    //checking if token is available
    let token = req.headers["X-Api-Key"]
    if (!token) token = req.headers["x-api-key"]
    if (!token) return res.status(400).send({ status: false, msg: "token must be present" })

    //decoding token
    let decodedToken = jwt.verify(token, 'book-management-project', function (err, decodedToken) {
      if (err) return res.status(400).send({ status: false, msg: "token is not valid or expired" })
      req.userLogedIn = decodedToken.userId
      next()
    })

  } catch (err) {
    return res.status(500).send({ status: false, Error: err.message })
  }
}





const authorise = async function (req, res, next) {
  try {

    //setting value of userId,loggedIn user and bookId
    let fromBodyuserId = req.body.userId
    let userLogedIn = req.userLogedIn
    let fromParamBookId = req.params.bookId

    //checking for valid userID
    if (fromBodyuserId) {
      if (!mongoose.isValidObjectId(fromBodyuserId)) return res.status(400).send({
        status: false,
        message: "enter valid userId"
      })

      //checking if loggedIn user and book's userId is same or not
      if (fromBodyuserId != userLogedIn) return res.status(403).send({
        status: false,
        message: "user loggedin is not authorised to create for another user"
      })
      next()
    }

    if (fromParamBookId) {

      //checking for valid bookId
      if (!mongoose.isValidObjectId(fromParamBookId)) return res.status(400).send({
        status: false,
        message: "enter valid bookId"
      })
      //checking if book is available or undeleted
      let book = await bookModel.findById({ _id: fromParamBookId, isDeleted: false })
      if (!book) return res.status(404).send({
        status: false,
        message: "book is not found"
      })

      //checking if loggedIn user and book's userId is same or not
      if (book.userId != userLogedIn) return res.status(403).send({
        status: false,
        message: "user loggedin is not authorised to create for another user"
      })
      next()
    }
    
    if (!fromBodyuserId && !fromParamBookId) {
      next()
    }


  } catch (error) {
    res.status(500).send({ msg: error.message })
  }
}


module.exports = { authenticate, authorise }