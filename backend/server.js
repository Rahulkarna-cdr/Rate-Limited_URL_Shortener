//Server.js
import {config} from "./utils/config.js";
import connectDB from "./config/connection.db.js";

import app from "./app.js";

const startServer = async()=>{
  try{
    await connectDB();
    app.listen(config.PORT, () => {
      console.log(`Server is running on port ${config.PORT}`);
    });    
  }
  catch(error){
    console.error("Failed to start Server:", error.message);
    process.exit(1)
  }
}

startServer()