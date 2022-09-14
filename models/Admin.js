const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const AdminSchema = new mongoose.Schema(
    {
        
        // username: {
        //     type: String,
        //     unique: [true, 'username has already taken'],
        //     minlength: [3, 'Username should have at least 3 characters'],
        //     maxlength: [15, 'Username cannot have more than 15 characters'],
        // },
        email: {
            type: String,
            unique: [true, 'Email has already taken'],
            validate: {
                validator: validator.isEmail,
                message: 'Please provide valid email',
            },
        },
        password: {
            type: String,
            minlength: [6, 'Password minimum length should be of 6 digits'],
        },
        userType: {
            type: Number,
            enum: [1, 2, 3], //1- Non Crypto & 2- Crypto User
            default: 1,
        },
        isAdmin: { type: Boolean, default: false },
        verificationToken: String,
        isVerified: {
            type: Boolean,
            default: false,
        },
        passwordToken: {
            type: String,
        },
        passwordTokenExpirationDate: {
            type: Date,
        },
        verifiedOn: Date,
        wallets: {
            type: [],
        },
    },
    { timestamps: true }
)

AdminSchema.pre('save', async function () {
    if (!this.isModified('password')) return
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

AdminSchema.methods.comparePassword = async function (canditatePassword) {
    const isMatch = await bcrypt.compare(canditatePassword, this.password)
    return isMatch
}

module.exports = mongoose.model('Admin', AdminSchema)
