import mongoose from "mongoose";
export const databaseConnection = async () => {
    try {
        const mongoUri:(string | undefined) = process.env.MONGODB_URL
        console.log(mongoUri)
        const mongooseConnection:object = await mongoose.connect(`${mongoUri}`,{autoIndex:false})
    } catch (error) {
        console.log("error at database  connection",error)
    }
}