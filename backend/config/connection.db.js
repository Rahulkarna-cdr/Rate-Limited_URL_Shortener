import mongoose from 'mongoose'
import {config} from '../utils/config.js'

const connectDB = async ()=>{
    try{
        await mongoose.connect(config.MONGODB_URI)
        console.log("Database connected successfully")
    }
    catch(error){
        console.error("Database Connection failed", error.message)
        throw error;
    }
}

export default connectDB;