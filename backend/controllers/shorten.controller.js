import Url from "../models/url.models.js";
import ClickEvent from "../models/clickEvent.models.js";
import crypto from "crypto"

//generating shortcode using in-built node package crypto
const generateAlias = (length=3)=>{
    const bytes = crypto.randomBytes(length)
    return bytes.toString("hex")
}

export const handleShortenUrl = async (req, res) => {
    try {
        const { originalUrl } = req.body;

        if (!originalUrl || typeof originalUrl !== "string" || !/^https?:\/\/.+\..+/.test(originalUrl)) {
            return res.status(200).json({ msg: "Invalid URL"})
        }

    //check if the URL is already shortened
    const existingUrl = await Url.findOne({ originalUrl })
    if (existingUrl) {
        return res.status(400).json({ msg: "URL already shortened", shortUrl: existingUrl.shortCode});
    }

    //generate short code using generateAlias function
    const shortCode = generateAlias()
    
    const newUrl = new Url({
        originalUrl: originalUrl,
        shortCode: shortCode
    })

    const savedUrl = await newUrl.save()
    return res.status(201).json({msg:"URL shortened successfully", shortUrl: savedUrl.shortCode});
} catch (error) {
    res.status(500).json({ msg: "Internal server error", error: error.message});
  }
};

// GET /:shortCode
export const handleRedirect = async (req, res) => {
    try {
      const { shortCode } = req.params;
      const foundUrl = await Url.findOne({ shortCode });
      
      if (!foundUrl) {
        return res.status(404).json({ msg: "Short URL not found" });
      }
      // fire-and-forget is okay, but awaited write is safer initially
      const redirectUrl = new ClickEvent({
        urlId: foundUrl._id,
        clickedAt: new Date()
      })
      await redirectUrl.save()
      return res.status(302).redirect(foundUrl.originalUrl);
    } catch (error) {
      return res.status(500).json({ msg: "Internal server error", error: error.message });
    }
  };
  