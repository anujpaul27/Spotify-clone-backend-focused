const userModel = require('../models/user.models')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')


async function register(req,res) {

    try {
        // 1. Get data as a valid variable from req.body
        const {username,email,password,role} = req.body;

        // 2. Check if user already exist with the same username or email
        const isUserAlreadyExist = await userModel.findOne({
            $or: [
                {username},
                {email}
            ]
        })

        // 3. If user already exist then return response with status code 409
        if (isUserAlreadyExist)
        {
            return res.status(409).json({
                message: 'User already exists'
            })
        }

        // 4. Hash the password for the new user before saving to mongoDB
        const hashPassword = await bcrypt.hash(password,10)

        // 5. Create a new user in the database with the data from req.body and hashed password
        const newUser = await userModel.create({
            username,
            email,
            password: hashPassword,
            role
        })

        // 6. Generate a JWT token for the new user with the user id and role as payload
        const token = jwt.sign(
            {id: newUser._id,
                role: newUser.role},
            process.env.JWT_SECRET 
        )

        // 7. Set the JWT token in the response cookie
        res.cookie('token', token)

        // 8 . finally return a successful message with the new user data and status code 201 
        res.status(201).json({
            message: 'User Create  Successful.',
            data: newUser,
        })
    } catch (err) {
        res.status(500).json ({
            message: 'Internal Server Error',
            error: err.message
        })
    }
}

async function loginUser (req,res) {
    try {
        // 1. Get data as a valid variable from req.body
        const {username,email,password} = req.body;

        // 2. Check User Validation with the username or email
        const user = await userModel.findOne({
            $or:[
                {username},
                {email}
            ]
        })

        // 3. if user do not exist return 404 
        if (!user)
        {
            return res.status(404).json ({
                message: 'Do not registered with this username or email'
            })
        }

        // 4. if have a user check password validation
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if(!isPasswordValid)
        {
            return res.status(404).json({
                message: 'Invalid Password'
            })
        }

        // 5. if password valid then create a token and save on the cookie
        const token = jwt.sign(
            {id: user._id, role: user.role},
            process.env.JWT_SECRET
        )
        res.cookie('token', token)

        // 6. success response 
        res.status(200).json({
            message: 'Login Successful',
            data: user,
        })

    } catch(err){
        res.status(500).json({
            message: err.message
        })
    }
}

module.exports = {
    register,
    loginUser
}