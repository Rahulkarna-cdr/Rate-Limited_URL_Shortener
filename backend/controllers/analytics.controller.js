import Url from "../models/url.models.js"
import ClickEvent from "../models/clickEvent.models.js"

export const getShortUrlAnalytics = async (req, res)=>{
    try{
        const { shortCode } = req.params
        const urlDoc = await Url.findOne({shortCode})
        if(!urlDoc){
            return res.status(404).json({msg: "Short URL not found"})
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
        return res.status(500).json({msg: "Internal Server Error", error: error.message})
    }    
}