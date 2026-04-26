export default function ShortenPanel({
  originalUrl,
  setOriginalUrl,
  loading,
  error,
  shortenResult,
  shortLink,
  retryAfter,
  onSubmit,
  onCopy,
}) {
  const isDisabled = loading || retryAfter !== null;

  return (
    <section className="panel">
      <label className="field-label" htmlFor="long-url">
        ENTER LONG URL
      </label>

      <form className="shorten-form" onSubmit={onSubmit}>
        <input
          id="long-url"
          type="url"
          placeholder="https://example.com/"
          value={originalUrl}
          onChange={(event) => setOriginalUrl(event.target.value)}
          disabled={isDisabled}
          required
        />
        <button type="submit" disabled={isDisabled}>
          {loading ? "SHORTENING..." : retryAfter ? `${retryAfter}s` : "SHORTEN"}
        </button>
      </form>

      <div className="form-meta">
        <p className="error-text">
          {retryAfter ? `Rate limited. Try again in ${retryAfter}s` : error || " "}
      </p>
        <span className="rate-pill">5 Requests per minute</span>
      </div>

      {shortenResult && (
        <div className="result-card">
          <div>
            <p className="small-muted">YOUR SHORT LINK</p>
            <a href={shortLink} target="_blank" rel="noreferrer">
              {shortLink}
            </a>
          </div>
          <button type="button" className="ghost-btn" onClick={onCopy}>
            COPY
          </button>
        </div>
      )}
    </section>
  );
}
