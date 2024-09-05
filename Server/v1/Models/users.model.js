const mongoose = require('mongoose')
const validator = require('validator')
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const { type } = require('os')

const userSchema = mongoose.Schema(
  {
    profileImage: {
      type: Object,
      default: null
    },
    email: {
      type: String,
      validate: [validator.isEmail, 'Provide a valid Email'],
      trim: true,
      lowercase: true,
      unique: true,
      required: [true, 'Email address is required'],
    },
    password: {
      type: String,
      required: [false, 'Password is required'],
      validate: {
        validator: (value) =>
          validator.isStrongPassword(value, {
            minLength: 6,
            minNumbers: 1,
            minUppercase: 1,
            minSymbols: 1,
          }),
        message: 'Password {VALUE} is not strong enough.',
      },
    },

    firstName: String,
    lastName: String,

    phone: String,
    age: String,
    city: String,
    state: String,
    zip: String,
    country: String,

    displayName: {
      type: String,
      trim: true,
      minLength: [3, 'Name must be at least 3 characters.'],
      maxLength: [100, 'Name is too large'],
    },


    imageURL: {
      type: String,
      validate: [validator.isURL, 'Please provide a valid url'],
    },
    status: {
      type: String,
      default: 'active',
      enum: ['active', 'inactive', 'blocked'],
    },

    confirmationToken: String,
    confirmationTokenExpires: Date,

    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
  }
)

userSchema.pre('save', function (next) {
  if (!this.isModified('password')) {
    //  only run if password is modified, otherwise it will change every time we save the user!
    return next()
  }
  const password = this.password

  const hashedPassword = bcrypt.hashSync(password)

  this.password = hashedPassword
  this.confirmPassword = undefined

  next()
})

userSchema.methods.comparePassword = function (password, hash) {
  const isPasswordValid = bcrypt.compareSync(password, hash)
  return isPasswordValid
}

userSchema.methods.generateConfirmationToken = function () {
  const token = crypto.randomBytes(32).toString('hex')

  this.confirmationToken = token

  const date = new Date()

  date.setDate(date.getDate() + 1)
  this.confirmationTokenExpires = date

  return token
}

const Users = mongoose.model('users', userSchema)

module.exports = Users
