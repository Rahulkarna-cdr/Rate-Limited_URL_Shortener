import { useMemo, useState } from "react";
import "./App.css";
import TopBar from "./components/dashboard/TopBar";
import ShortenPanel from "./components/dashboard/ShortenPanel";
import RecentLinksPanel from "./components/dashboard/RecentLinksPanel";
import AnalyticsPanel from "./components/dashboard/AnalyticsPanel";
import {
  buildShortLink,
  fetchAnalytics,
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

  // Local session-only recent links (until backend list endpoint exists)
  const [recentLinks, setRecentLinks] = useState([]);
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

    // Block if timer is active
    if (retryAfter !== null) {
        return;
    }

    setShortenLoading(true);
    setShortenError("");

    try {
      const body = await shortenUrl(originalUrl.trim());

      setShortenResult(body);

      const code = body.shortUrl;
      setRecentLinks((prev) => {
        const exists = prev.some((item) => item.shortCode === code);
        if (exists) return prev;
        return [
          {
            shortCode: code,
            originalUrl: originalUrl.trim(),
            clicks: "-",
            status: "ACTIVE",
          },
          ...prev,
        ].slice(0, 6);
      });

      setOriginalUrl("");
    } catch (err) {
      if (err.status === 429 && err.retryAfter) {
        const waitTime = err.retryAfter;
        setRetryAfter(waitTime);
        setShortenError(`${err.message} Retry in ${waitTime}s.`);

        // Start countdown
        const interval = setInterval(() => {
          setRetryAfter((prev) => {
            const next = prev - 1;
            if (next <= 0) {
              clearInterval(interval);
              setShortenError("");
              return null;
            }
            setShortenError(`Rate limited. Try again in ${next}s`);
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

      // Update local table click count if row exists
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