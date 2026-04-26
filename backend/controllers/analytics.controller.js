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

         // Get last 7 days click data
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const clickEvents = await ClickEvent.find({ 
            urlId: urlDoc._id,
            clickedAt: { $gte: sevenDaysAgo }
        }).sort({ clickedAt: 1 });

        // Group clicks by day
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const clicksByDay = {};
        
        // Initialize last 7 days with 0
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dayKey = dayNames[d.getDay()];
            clicksByDay[dayKey] = 0;
        }

        // Count clicks per day
        clickEvents.forEach(event => {
            const dayKey = dayNames[new Date(event.clickedAt).getDay()];
            if (clicksByDay.hasOwnProperty(dayKey)) {
                clicksByDay[dayKey]++;
            }
        });

        const clicksSeries = Object.values(clicksByDay);

        return res.status(200).json({
            msg: "Short URL Analytics",
            shortCode: urlDoc.shortCode,
            originalUrl: urlDoc.originalUrl,
            createdAt: urlDoc.createdAt,
            totalClicks,
            clicksSeries
         })
    }
    catch(error){
        return next(error)
    }    
}