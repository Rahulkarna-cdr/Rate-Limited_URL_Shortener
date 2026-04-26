
export const unknownEndpoint = (req,res) =>{
    return res.status(404).json({msg: "Unknown end point"})
}

export const errorHandler = (err, req, res, next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal server error";
    
    console.error(`[${req.method}] ${req.originalUrl} -> ${statusCode}: ${message}`);

    return res.status(statusCode).json({ msg: message });
  };

