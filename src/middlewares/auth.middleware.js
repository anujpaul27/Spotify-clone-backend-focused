const jwt = require('jsonwebtoken')

async function authArtist (req,res,next)
{
    // get the token from the cookies and check it
    const token = req.cookies.token;
    if (!token)
    {
        return res.status(401).json({
            message: `Unauthorize`
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
        req.user = decode;
        next();

    } catch(err)
    {
        res.status(401).json({
            message: `Unauthorize for ${err.message}`
        })
    }
}

async function authUser(req,res,next)
{
    const token = req.cookies.token;
    if(!token)
    {
        return res.status(401).json({
            message: 'Unauthorize User'
        })
    }

    try 
    {
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        if (decode.role !== 'user' && decode.role !== 'artist')
        {
            return res.status(403).json({
                message: 'Your do not have a access.'
            })
        }
        req.user = decode;
        next();
    } 
    catch (err)
    {
        res.status(404).json({
            message: err.message
        })
    }
}

module.exports = {authArtist, authUser}