const userModel = require('../models/userModel')
const jwt = require("jsonwebtoken")
const { isValid, isValidTitle, isValidName, isValidMobile, isValidEmail, isValidPassword } = require('./validation')


//===================================================Create User Api =================================================


const registerUser = async function (req, res) {

    try {
        //destructuring request body
        let { title, name, phone, email, password, address } = req.body

        //checking if body is empty
        if (Object.keys(req.body).length < 1) return res.status(400).send({
            status: false,
            message: "Insert data "
        })
        //checking for mandatory fields
        if (!isValid(title)) {
            return res.status(400).send({ status: false, message: " title is required" })
        }
        if (!isValidTitle(title)) {
            return res.status(400).send({ status: false, message: "enter valid title from this[Mr,Mrs,Miss]" })
        }
        if (!isValid(name)) {
            return res.status(400).send({ status: false, message: "name is required" })
        }
        if (!isValidName(name)) {
            return res.status(400).send({ status: false, message: "enter valid name" })
        }

        if (!isValid(phone)) {
            return res.status(400).send({ status: false, message: "phone number is required" })
        }

        //checking if entered phone number is valid or not
        if (!isValidMobile(phone)) {
            return res.status(400).send({ status: false, message: "enter valid phone number" })
        }

        //checking for uniqueness of phone and email
        let checkPhone = await userModel.findOne({ phone: phone })
        if (checkPhone) return res.status(400).send({
            status: false,
            message: "phone number is already exists"
        })
        if (!isValid(email)) {
            return res.status(400).send({ status: false, message: "email is required" })
        }
        if (!isValidEmail(email)) {
            return res.status(400).send({ status: false, message: "enter valid email" })
        }
        let checkEmail = await userModel.findOne({ email: email })
        if (checkEmail) return res.status(400).send({
            status: false,
            message: "email is already exists"
        })

        //checking if password is available
        if (!isValid(password)) {
            return res.status(400).send({ status: false, message: "password is required" })
        }

        //checking for valid password length
        if (!isValidPassword(password)) {
            return res.status(400).send({ status: false, message: "password length is between 8 to 15" })
        }

        //checking for valid address type
        if (address) {
            if (!(typeof address == 'object') || !(Object.keys(address).length > 0)) {
                return res.status(400).send({ status: false, message: "insert address or send in object" })
            }
        }


        //creating and returning created user
        let createdUser = await userModel.create(req.body)

        res.status(201).send({
            status: true,
            message: 'Success',
            data: createdUser
        })
    } catch (error) {
        res.status(500).send({ msg: error.message })
    }

}

//===================================================Login User Api =================================================


const loginUser = async function (req, res) {
    try {

        //checking for empty body
        if (Object.keys(req.body).length < 1) return res.status(400).send({
            status: false,
            message: "Insert data "
        })

        //checking for email and password
        let email = req.body.email
        if (!email) return res.status(400).send({
            status: false,
            message: "enter email"
        })

        let password = req.body.password
        if (!password) return res.status(400).send({
            status: false,
            message: "enter password"
        })
        //finding user 
        let user = await userModel.findOne({ email: email, password: password })
        if (!user) {
            return res.status(401).send({
                status: false,
                message: "Enter valid email and password"
            })
        }

        //generating token on successful login
        let token = jwt.sign(
            {
                userId: user._id.toString(),

            },
            "book-management-project",
            { expiresIn: "24h" }
        );
        res.setHeader("x-api-key", token);
        res.status(200).send({ status: true, data: { token: token } });
    } catch (err) {
        return res.status(500).send({ msg: "Error", Error: err.message })
    }
};


//exporting functions
module.exports.registerUser = registerUser
module.exports.loginUser = loginUser