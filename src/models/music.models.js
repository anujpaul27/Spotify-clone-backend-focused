const mongoose = require('mongoose')

const musicSchema = new mongoose.Schema({
    uri: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    }, 
    artist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    }
})

const db = mongoose.connection.useDb('SpotifyDB')
const musicModel = db.model('music', musicSchema) 

module.exports = musicModel