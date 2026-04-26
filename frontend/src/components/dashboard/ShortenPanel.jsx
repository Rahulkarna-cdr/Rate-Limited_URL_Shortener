export default function ShortenPanel({
  originalUrl,
  setOriginalUrl,
  loading,
  error,
  shortenResult,
  shortLink,
  onSubmit,
  onCopy,
}) {
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
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "SHORTENING..." : "SHORTEN"}
        </button>
      </form>

      <div className="form-meta">
        <p className="error-text">{error || " "}</p>
        <span className="rate-pill">Rate limit: 5/min per IP</span>
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
