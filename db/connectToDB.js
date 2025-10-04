const { default: mongoose } = require("mongoose")
require('dotenv').config()

const connectToDb = async () => {
    try{

        await mongoose.connect(process.env.MONGO_URL)
        console.log("conected sucsessfully")

    }catch(e){
        console.log('couldnt connect to mongodb')
    }
}


module.exports = connectToDb