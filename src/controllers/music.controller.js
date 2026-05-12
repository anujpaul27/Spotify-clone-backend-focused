const musicModel = require("../models/music.models");
const jwt = require('jsonwebtoken')
const {uploadFile} = require('../services/storage.services')
const albumModel = require("../models/album.models");

async function CreateMusic(req, res) {    

  try {
    // 3. get title and file from the req.body 
    const {title} = req.body;
    const file = req.file;

    // 4. convert to the file to imagekit url
    const response = await uploadFile(file.buffer.toString('base64'))

    // 5. Create music and save to the DB
    const newMusic = await musicModel.create({
        uri: response.url,
        title,
        artist: req.user.id,
    })

    res.status(201).json({
        message: 'Create music successful',
        newMusic
    })

  } catch (err) {
    res.status(401).json({
      message: `Unauthorized for ${err.message}`,
    });
  }
}

async function CreateAlbum (req,res) {
  try {
    const {title, musics} = req.body;
    const album = await albumModel.create({
      title,  
      musics, 
      artist: req.user.id,
    })

    res.status(201).json({
      message: 'Album created successful.',
      data: album,
    })

  } catch (err)
  {
    res.status(500).json({
      message: err.message,
    })
  }

}

async function GetAllMusic (req,res)
{
  try {
      // 1. get music from the database 
      const musics = await musicModel.find().populate('artist')

      // 2. success response 
      res.status(200).json({
      message: 'Successfully get all music from the database',
      data: musics
    })
  } 
  catch (err)
    {
      // 3. Error response 
      res.status(500).json({
        message: err.message
      })
    }
}

module.exports = {CreateMusic,CreateAlbum, GetAllMusic}