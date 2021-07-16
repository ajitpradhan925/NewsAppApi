const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
    author: {
        type: String
    },
    title: {
        type: String
    },
    content: {
        type: String
    },
    url: {
        type: String
    },
    urlToImage: {
        type: String
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    views: {
        type: Number,
        default: 0
    },
    timeToRead: {
        type: String
    },
    comments: [],
    like: {
        type: Number
    },
    addToSlider: {
        type: Boolean,
        default: false
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        comment: String
    }],
    notifyUser: {
        type: Boolean,
        default: false
    },
    addedAt: {
        type: Date
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    }
});


module.exports = mongoose.model('News', newsSchema)
