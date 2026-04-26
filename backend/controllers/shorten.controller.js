import Url from "../models/url.models.js";
import ClickEvent from "../models/clickEvent.models.js";
import crypto from "crypto"

//generating shortcode using in-built node package crypto
const generateAlias = (length = 3) => {
  const bytes = crypto.randomBytes(length)
  return bytes.toString("hex")
}

export const handleShortenUrl = async (req, res, next) => {
  try {
    const { originalUrl } = req.body;

    if (!originalUrl || typeof originalUrl !== "string" || !/^https?:\/\/.+\..+/.test(originalUrl)) {
      const err = new Error("Invalid URL");
      err.statusCode = 400;
      throw err;
    }

    //check if the URL is already shortened
    const existingUrl = await Url.findOne({ originalUrl })
    if (existingUrl) {
      return res.status(200).json({ msg: "URL already shortened", shortUrl: existingUrl.shortCode });
    }

    //generate short code using generateAlias function
    const shortCode = generateAlias()

    const newUrl = new Url({
      originalUrl: originalUrl,
      shortCode: shortCode
    })

    const savedUrl = await newUrl.save()
    return res.status(201).json({ msg: "URL shortened successfully", shortUrl: savedUrl.shortCode });
  } catch (error) {
    return next(error)
  }
};

// GET /:shortCode
export const handleRedirect = async (req, res, next) => {
  try {
    const { shortCode } = req.params;
    const foundUrl = await Url.findOne({ shortCode });

    if (!foundUrl) {
      const err = new Error("Short URL not found");
      err.statusCode = 404;
      throw err;
    }
    // fire-and-forget is okay, but awaited write is safer initially
    const redirectUrl = new ClickEvent({
      urlId: foundUrl._id,
      clickedAt: new Date()
    })
    await redirectUrl.save()
    return res.status(302).redirect(foundUrl.originalUrl);
  } catch (error) {
    return next(error)
  }
};

//GET /api/shorten/recent
export const handleRecentLinks = async (req, res, next) => {
  try {
    const links = await Url.find()
      .select('originalUrl shortCode')
      .sort({ createdAt: -1 })
      .limit(10)

    const linksWithClicks = await Promise.all(
      links.map(async (link) => {
        const clicks = await ClickEvent.countDocuments({ urlId: link._id });
        return {
          shortCode: link.shortCode,
          originalUrl: link.originalUrl,
          status: link.status ?? "ACTIVE",
          clicks,
        };
      })
    );

    return res.status(200).json({ msg: "Recent Links", links: linksWithClicks });

  }
  catch (error) {
    return next(error)
  }
}