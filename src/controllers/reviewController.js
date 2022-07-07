const { default: mongoose } = require('mongoose')
const bookModel = require('../models/bookModel')
const reviewModel = require('../models/reviewModel')
const { isValid,isValidName } = require('./validation')

const createReview = async function(req,res){
    try{
        let { reviewedBy, review, rating} = req.body
        let bookId = req.params.bookId
        if (Object.keys(req.body).length < 1) return res.status(400).send({
            status: false,
            message: "Insert data "
        })

        if(!mongoose.isValidObjectId(bookId)){
            return res.status(400).send({status:false,message:"Enter Valid BookId"})
        }
        let book = await bookModel.findOne({_id:bookId,isDeleted:false})
        if(!book) return res.status(404).send({status:false,message:"book is not found"})
   

        if(!isValid(reviewedBy)){
            return res.status(400).send({status:false,message:"ReviewedBy is required"})
        }

        if(!rating){
            return res.status(400).send({status:false,message:"Rating is required"})
        }
        if(!(typeof(rating)=="number"  && rating >=1 && rating <=5) ){
            return res.status(400).send({status:false,message:"Rating should be number and upto 10"})
        }
        if(review){
            if(!isValid(review))  return res.status(400).send({status:false,message:"Rating should be number and upto 10"})
        }
        req.body.bookId = book._id
        req.body.reviewedAt = new Date()

        let  CreateReview = await reviewModel.create(req.body)
        let updatedBook = await bookModel.updateOne({_id:bookId},{$inc:{reviews:1}},{new:true}) 
        let reviews = await reviewModel.find({bookId:bookId,isDeleted:false})
       
        let bookF = await bookModel.findById(bookId)
        bookF._doc.reviewData = reviews
        return res.status(201).send({status:true,message:"Success",data:bookF})

    }
    catch (error) {
        res.status(500).send({ msg: error.message })
    }
    
}

module.exports.createReview = createReview

const updateReview =  async function(req,res){
    try{

        let {review,rating,reviewedBy} = req.body
        let bookId = req.params.bookId
        let reviewId= req.params.reviewId
        
       if(rating){ 
        if(!(typeof(rating)=="number"  && rating >=1 && rating <=5) ){
            return res.status(400).send({status:false,message:"Rating should be number and upto 10"})
        }}

        if(reviewedBy){
            if(!isValidName(reviewedBy)) return res.status(400).send({status:false,message:"enter alphabets only"})
        }

        let updatedReview = await reviewModel.findOneAndUpdate({bookId:bookId,_id:reviewId,isDeleted:false},{$set:req.body},{new:true})
        if(!updatedReview) return res.status(404).send({status:false,message:"No data found with given Ids"})


        let reviews = await reviewModel.find({bookId:bookId,isDeleted:false})
       
        let bookF = await bookModel.findById(bookId)
        bookF._doc.reviewData = reviews
        return res.status(201).send({status:true,message:"Success",data:bookF})
        

    }
    catch (error) {
        res.status(500).send({ msg: error.message })
    }
    
}


module.exports.updateReview = updateReview

const deleteReview = async function(req,res){
    try{
        let id = req.params.bookId
        let ID = req.params.reviewId

        if(!mongoose.isValidObjectId(id) && !mongoose.isValidObjectId(ID)){
            return res.status(400).send({status:false,message:"Enter Valid Object Id"})
        }

        const deleteData = await reviewModel.findOneAndUpdate({bookId:id,_id:ID,isDeleted:false},{isDeleted:true,},{new:true})
        
        if(!deleteData){
            return res.status(400).send({status:false,message:"No data found with given Ids"})
        }
        let book = await bookModel.updateOne({_id:id},{$inc:{reviews:-1}})
        return res.status(200).send({status:false,message:"Successfully deleted !!!"})

    }
    catch (error) {
        res.status(500).send({ msg: error.message })
    }
}

module.exports.deleteReview = deleteReview