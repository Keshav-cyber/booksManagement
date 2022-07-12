const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const bookModel = require("../models/bookModel")
const userModel = require("../models/userModel")



const authenticate = function (req, res, next) {
    try {
        let token = req.headers["X-Api-Key"]
        if (!token) token = req.headers["x-api-key"]
        if (!token) return res.status(400).send({ status: false, msg: "token must be present" })
        let decodedToken = jwt.verify(token, 'book-management-project')
        if (!decodedToken) return res.status(400).send({ status: false, msg: "token is not valid" })
        req.userLogedIn = decodedToken.userId
        next()
      } catch (err) {
       return res.status(500).send({ status: false, Error: err.message })
      }
    }
    




const authorise = async function (req, res, next) {
    try {
         
        let fromBodyuserId = req.body.userId
        let userLogedIn = req.userLogedIn
        let fromParamBookId = req.params.bookId
     if(fromBodyuserId){ 
          if(!mongoose.isValidObjectId(fromBodyuserId)) return res.status(400).send({
            status: false,
            message: "enter valid userId"
          })

        if( fromBodyuserId != userLogedIn) return res.status(403).send({
            status: false,
            message: "user loggedin is not authorised to create for another user"
          })
          next()
        }

        if(fromParamBookId){

            let book = await bookModel.findById({_id:fromParamBookId,isDeleted:false})
            if(!book) return res.status(404).send({
                status: false,
                message: "book is not found"
              })
              if( book.userId!= userLogedIn) return res.status(403).send({
                status: false,
                message: "user loggedin is not authorised to create for another user"
              })
              next()
        }
        
         

    } catch (error) {
        res.status(500).send({ msg: error.message })
    }
}


module.exports = {authenticate, authorise}