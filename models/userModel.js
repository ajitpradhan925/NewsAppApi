const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userSchema = mongoose.Schema(
    {
        name: {
            type: 'string',
            required: true
        },
        email: {
            type: 'string',
            required: true,
            unique: true
        },
        password: {
            type: 'string',
            required: true
        },
        avatar: {
            type: 'string',
            default: ''
        },
        favorites: [{
            news: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'News'
            }
        }],
        active: {
            type: Boolean,
            default: false
        },
        otp: {
            type: String
        },
        activeToken: String,
        activeExpires: Date,
    }
)


userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next()
    }

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

module.exports = mongoose.model('User', userSchema)
