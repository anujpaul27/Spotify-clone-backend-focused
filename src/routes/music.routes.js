const express = require('express')
const musicController = require('../controllers/music.controller')
const router = express.Router()
const multer = require('multer')
const authMiddleware = require('../middlewares/auth.middleware')


const upload = multer({
    storage: multer.memoryStorage()
})

router.post('/upload',authMiddleware.authArtist, upload.single('music'), musicController.CreateMusic)
router.post('/album',authMiddleware.authArtist, musicController.CreateAlbum)

router.get('/allmusics',musicController.GetAllMusic) 


module.exports = router 