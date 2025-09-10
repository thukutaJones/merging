const mongoose = require('mongoose');

const HomeCardSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    }
});

module.exports = mongoose.model('HomeCard', HomeCardSchema);