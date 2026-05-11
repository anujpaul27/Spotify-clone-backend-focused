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



module.exports = {
    register
}