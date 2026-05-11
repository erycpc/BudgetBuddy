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
                id: userExists._id,
                name: userExists.name,
                email: userExists.email,
                avatar: userExists.avatar
            }
        })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' })
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true }
    ).select('-password')

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    const user = await User.findById(req.user._id)
    const isMatch = await bcrypt.compare(currentPassword, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' })
    }

    user.password = newPassword
    await user.save() // pre-save hook will hash the new password
    res.json({ message: 'Password updated successfully' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}