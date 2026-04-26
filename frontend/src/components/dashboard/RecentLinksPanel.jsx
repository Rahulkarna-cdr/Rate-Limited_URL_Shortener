export default function RecentLinksPanel({ recentLinks, buildShortLink, onSelectCode }) {
  return (
    <section className="panel">
      <div className="section-head">
        <h2>Recent Links</h2>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>SHORT URL</th>
              <th>ORIGINAL URL</th>
              <th>CLICKS</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {recentLinks.length === 0 ? (
              <tr>
                <td colSpan="4" className="empty-row">
                  No links yet. Create one above.
                </td>
              </tr>
            ) : (
              recentLinks.map((row) => (
                <tr key={row.shortCode}>
                  <td>
                    <button
                      type="button"
                      className="link-like"
                      onClick={() => onSelectCode(row.shortCode)}
                      title="Load this code in analytics form"
                    >
                      {buildShortLink(row.shortCode)}
                    </button>
                  </td>
                  <td className="truncate-cell">{row.originalUrl}</td>
                  <td>{row.clicks}</td>
                  <td>
                    <span className="status-pill active">{row.status}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
