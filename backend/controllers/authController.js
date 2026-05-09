import bcrypt from 'bcryptjs';
import User from '../models/User.js'
import jwt from 'jsonwebtoken'

export const register = async (req, res) => {
  try {
    // validate fields
    const { name, email, password } = req.body
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please fill in all fields' })
    }

    // check if email exists
    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ message: 'Email already in use' })
    }

    // create the user
    const user = await User.create({ name, email, password })

    // generate token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    )

    // send response
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    })

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const login = async (req, res) => {
    try {
        // validate all fields
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ message: 'Please fill in your email and password' })
        }

        const userExists = await User.findOne({ email })
        if (!userExists)
            return res.status(400).json({ message: 'Invalid Credentials'})
    

        const isMatch = await bcrypt.compare(password, userExists.password)
        if (!isMatch)
            return res.status(400).json({ message: 'Invalid Credentials' })

        const token = jwt.sign(
            { id: userExists._id},
            process.env.JWT_SECRET,
            { expiresIn: '30d'}
        )

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar
            }
        })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}