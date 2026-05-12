const musicModel = require("../models/music.models");
const jwt = require('jsonwebtoken')
const {uploadFile} = require('../services/storage.services')
const albumModel = require("../models/album.models");

async function CreateMusic(req, res) {    
  // 1. Get the token from the cookies
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  try {
    // 2. Verify the token and decode it to get the user information
    const decode = jwt.verify(token, process.env.jwt_secret);

    if (decode.role !== "artist") {
      res.status(403).json({
        message: "Your do not create music",
      }); 
    }

    // 3. get title and file from the req.body 
    const {title} = req.body;
    const file = req.file;

    // 4. convert to the file to imagekit url
    const response = await uploadFile(file.buffer.toString('base64'))

    // 5. Create music and save to the DB
    const newMusic = await musicModel.create({
        uri: response.url,
        title,
        artist: decode.id,
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

  const token = req.cookies.token;
  if(!token)
  {
    return res.status(401).json({
      message: 'Unauthorize',
    })
  }

  try {
    const decode = jwt.verify(token,process.env.JWT_SECRET)
    if (decode.role !== 'artist')
    {
      return res.status(403).json({
        message: "Album only be created by artist",
      })
    }

    const {title, musics} = req.body;
    const album = await albumModel.create({
      title,  
      musics, 
      artist: decode.id,
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


module.exports = {CreateMusic,CreateAlbum}