const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const UserSchema = mongoose.Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    name: {
      first: { type: String, required: true },
      last: { type: String, required: true }
    },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    deactivated: { type: Boolean, default: false }
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
  }
)

UserSchema.virtual('fullName').get(function() {
  return `${this.name.first} ${this.name.last}`
})

/**
 * Password Encryption
 * User passwords are encrypted prior to saving the entry in the database.
 */
UserSchema.pre('save', async function hashPassword(next) {
  const user = this
  if (!user || !user.isModified('password')) {
    return next()
  }
  try {
    const salt = await bcrypt.genSalt(5)
    user.password = await bcrypt.hash(user.password, salt, null)
    return next()
  } catch (err) {
    return next()
  }
})

/**
 * Compare password
 * Adds a custom method to the user model that checks if plain text
 * password matches the encrypted password for that user. This is used
 * to verify password during the login process.
 */
UserSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password)
  } catch (err) {
    throw new Error(err)
  }
}

const User = mongoose.model('user', UserSchema)
module.exports = User
