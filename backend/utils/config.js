import dotenv from "dotenv";

dotenv.config()

//Now validation of env variables

const validateEnvVariable = (varName) =>{
    let value = process.env[varName]
    if(!value){
        throw new Error(`The variable named ${varName} is missing.`)
    }
    return value;
}

export const config = {
    PORT: validateEnvVariable("PORT"),
    MONGODB_URI: validateEnvVariable("MONGODB_URI")
}
