import { useMemo, useState, useEffect } from "react";
import "./App.css";
import TopBar from "./components/dashboard/TopBar";
import ShortenPanel from "./components/dashboard/ShortenPanel";
import RecentLinksPanel from "./components/dashboard/RecentLinksPanel";
import AnalyticsPanel from "./components/dashboard/AnalyticsPanel";
import {
  buildShortLink,
  fetchAnalytics,
  fetchRecentLinks,
  shortenUrl,
} from "./services/shortenerApi";

export default function App() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortenLoading, setShortenLoading] = useState(false);
  const [shortenError, setShortenError] = useState("");
  const [shortenResult, setShortenResult] = useState(null);

  const [analyticsCode, setAnalyticsCode] = useState("");
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsError, setAnalyticsError] = useState("");
  const [analyticsResult, setAnalyticsResult] = useState(null);
  const [retryAfter, setRetryAfter] = useState(null);

  const [recentLinks, setRecentLinks] = useState([]);

  // Fetch recent links from backend on mount
  useEffect(() => {
    fetchRecentLinks().then(setRecentLinks).catch(() => { });
  }, []);

  const shortLink = useMemo(() => {
    if (!shortenResult?.shortUrl) return "";
    return buildShortLink(shortenResult.shortUrl);
  }, [shortenResult]);

  const analyticsSeries = useMemo(() => {
    if (!analyticsResult?.clicksSeries) return [];
    return analyticsResult.clicksSeries;
  }, [analyticsResult]);

  async function handleShortenSubmit(e) {
    e.preventDefault();

    if (retryAfter !== null) return;

    setShortenLoading(true);
    setShortenError("");

    try {
      const body = await shortenUrl(originalUrl.trim());

      setShortenResult(body);
      fetchRecentLinks().then(setRecentLinks).catch(() => { });
      setOriginalUrl("");
    } catch (err) {
      if (err.status === 429 && err.retryAfter) {
        const waitTime = err.retryAfter;
        setRetryAfter(waitTime);

        const interval = setInterval(() => {
          setRetryAfter((prev) => {
            const next = prev - 1;
            if (next <= 0) {
              clearInterval(interval);
              setShortenError("");
              return null;
            }
            return next;
          });
        }, 1000);
      } else {
        setShortenError(err.message || "Unable to shorten URL.");
      }
    } finally {
      setShortenLoading(false);
    }
  }

  async function handleAnalyticsSubmit(e) {
    e.preventDefault();
    setAnalyticsLoading(true);
    setAnalyticsError("");

    try {
      const body = await fetchAnalytics(analyticsCode.trim());

      setAnalyticsResult(body);

      setRecentLinks((prev) =>
        prev.map((item) =>
          item.shortCode === body.shortCode
            ? { ...item, clicks: body.totalClicks }
            : item
        )
      );
    } catch (err) {
      setAnalyticsError(err.message || "Unable to fetch analytics.");
    } finally {
      setAnalyticsLoading(false);
    }
  }

  async function handleCopy() {
    if (!shortLink) return;
    try {
      await navigator.clipboard.writeText(shortLink);
    } catch {
      window.alert("Copy failed. Please copy manually.");
    }
  }

  return (
    <div className="app-shell">
      <TopBar />

      <main className="container">
        <ShortenPanel
          originalUrl={originalUrl}
          setOriginalUrl={setOriginalUrl}
          loading={shortenLoading}
          error={shortenError}
          shortenResult={shortenResult}
          shortLink={shortLink}
          retryAfter={retryAfter}
          onSubmit={handleShortenSubmit}
          onCopy={handleCopy}
        />

        <RecentLinksPanel
          recentLinks={recentLinks}
          buildShortLink={buildShortLink}
          onSelectCode={setAnalyticsCode}
        />

        <AnalyticsPanel
          analyticsCode={analyticsCode}
          setAnalyticsCode={setAnalyticsCode}
          analyticsLoading={analyticsLoading}
          analyticsError={analyticsError}
          analyticsResult={analyticsResult}
          analyticsSeries={analyticsSeries}
          onSubmit={handleAnalyticsSubmit}
          buildShortLink={buildShortLink}
        />
      </main>
    </div>
  );
}