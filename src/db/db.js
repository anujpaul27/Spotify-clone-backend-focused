const mongoose = require('mongoose')


const ConnectDB =async ()=> 
{
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('Database Connected...');
    } catch (err) {
        console.log('Database Connection Failed...', err);
    }
}

module.exports = ConnectDB