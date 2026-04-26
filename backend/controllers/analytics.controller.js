import Url from "../models/url.models.js"
import ClickEvent from "../models/clickEvent.models.js"

export const getShortUrlAnalytics = async (req, res, next)=>{
    try{
        const { shortCode } = req.params
        const urlDoc = await Url.findOne({shortCode})
        if(!urlDoc){
          const err = new Error("Short URL not found");
          err.statusCode = 404;
          throw err;
        }
        
        const totalClicks = await ClickEvent.countDocuments({ urlId: urlDoc._id})
        return res.status(200).json({
            msg: "Short URL Analytics",
            shortCode: urlDoc.shortCode,
            originalUrl: urlDoc.originalUrl,
            createdAt: urlDoc.createdAt,
            totalClicks
         })
    }
    catch(error){
        return next(error)
    }    
}