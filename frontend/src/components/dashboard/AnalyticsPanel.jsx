import AnalyticsChart from "./AnalyticsChart";

export default function AnalyticsPanel({
  analyticsCode,
  setAnalyticsCode,
  analyticsLoading,
  analyticsError,
  analyticsResult,
  analyticsSeries,
  onSubmit,
  buildShortLink,
}) {
  return (
    <section className="panel">
      <div className="section-head analytics-head">
        <div>
          <h2>Analytics</h2>
          <p className="small-muted">Lookup a short code and view activity</p>
        </div>
        <form className="analytics-form" onSubmit={onSubmit}>
          <input
            type="text"
            placeholder="short code"
            value={analyticsCode}
            onChange={(event) => setAnalyticsCode(event.target.value)}
            required
          />
          <button type="submit" disabled={analyticsLoading}>
            {analyticsLoading ? "..." : "FETCH"}
          </button>
        </form>
      </div>

      {analyticsError && <p className="error-text mtop">{analyticsError}</p>}

      {analyticsResult && (
        <>
          <h3 className="analytics-title">{buildShortLink(analyticsResult.shortCode)}</h3>

          <AnalyticsChart analyticsSeries={analyticsSeries} />

          <div className="stats-grid">
            <div className="stat">
              <p className="small-muted">TOTAL CLICKS</p>
              <strong>{analyticsResult.totalClicks}</strong>
            </div>
            <div className="stat">
              <p className="small-muted">CREATED</p>
              <strong>{new Date(analyticsResult.createdAt).toLocaleDateString()}</strong>
            </div>
            <div className="stat">
              <p className="small-muted">TOP REFERRER</p>
              <strong>N/A</strong>
            </div>
            <div className="stat">
              <p className="small-muted">TOP DEVICE</p>
              <strong>N/A</strong>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
