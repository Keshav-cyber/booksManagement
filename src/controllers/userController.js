const userModel = require('../models/userModel')
const jwt = require("jsonwebtoken")
const { isValid, isValidTitle, isValidName, isValidMobile, isValidEmail, isValidPassword } = require('./validation')


const registerUser = async function (req, res) {

    try {
        let { title, name, phone, email, password } = req.body
        if (Object.keys(req.body).length < 1) return res.status(400).send({
            status: false,
            message: "Insert data "
        })
        if (!isValid(title)) {
            return res.status(400).send({ status: false, message: " title is required" })
        }
        if (!isValidTitle(title)) {
            return res.status(400).send({ status: false, message: "enter valid title" })
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
        if (!isValidMobile(phone)) {
            return res.status(400).send({ status: false, message: "enter valid phone number" })
        }
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
        if (!isValid(password)) {
            return res.status(400).send({ status: false, message: "password is required" })
        }
        if (!isValidPassword(password)) {
            return res.status(400).send({ status: false, message: "password length is between 8 to 15" })
        }

        let createdUser = await userModel.create(req.body)

        res.status(201).send({
            status: true,
            message: 'Success',
            data: createdUser
        })
    } catch (err) {
        res.status(500).send({ msg: error.message })
    }

}
module.exports.registerUser = registerUser



const loginUser = async function (req, res) {
    try {
        if (Object.keys(req.body).length < 1) return res.status(400).send({
            status: false,
            message: "Insert data "
        })
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
        let user = await userModel.findOne({ email: email, password: password })
        if (!user) {
            return res.status(401).send({
                status: false,
                message: "Enter valid email and password"
            })
        }
        let token = jwt.sign(
            {
                userId: user._id.toString(),
               
            },
            "book-management-project",
            { expiresIn: "10s"  }
        );
        res.setHeader("x-api-key", token);
        res.status(200).send({ status: true, data: { token: token } });
    } catch (err) {
        return res.status(500).send({ msg: "Error", Error: err.message })
    }
};


module.exports.loginUser = loginUser