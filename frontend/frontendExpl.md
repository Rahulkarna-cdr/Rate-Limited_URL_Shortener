# Frontend Codebase Explanation (Non-CSS)

This document explains the frontend **file by file**, then **line by line**, excluding CSS files as requested.

## Scope and Notes

- Included: React source files, service layer, Vite config, ESLint config, HTML entry, and manifest/docs files.
- Excluded: `src/App.css`, `src/index.css` (as requested), binary assets (`.png`), and generated lockfile internals (`package-lock.json`).
- Why `package-lock.json` is not explained line-by-line: it is auto-generated dependency metadata and not hand-written app logic.

---

## 1) `src/main.jsx`

### What this file does

Bootstraps React and mounts your `App` component into the HTML element with id `root`.

### Line-by-line

- **Line 1**: Imports `StrictMode` from React (extra dev-time checks and warnings).
- **Line 2**: Imports `createRoot` for React 18+ rendering API.
- **Line 3**: Imports global stylesheet `index.css`.
- **Line 4**: Imports the root app component from `App.jsx`.
- **Line 5**: Empty line for readability.
- **Line 6**: Finds the DOM node with id `root`, creates React root, and starts render call.
- **Line 7**: Wraps app in `StrictMode`.
- **Line 8**: Renders `<App />`.
- **Line 9**: Closes `StrictMode`.
- **Line 10**: Closes `render(...)`.
- **Line 11**: Trailing newline.

---

## 2) `src/App.jsx`

### What this file does

Acts as the orchestration layer:
- owns top-level state,
- calls API service methods,
- computes derived values,
- passes props/handlers to presentational dashboard components.

### Line-by-line

- **Line 1**: Imports React hooks `useMemo` and `useState`.
- **Line 2**: Imports component-level stylesheet.
- **Line 3**: Imports top header component.
- **Line 4**: Imports URL-shortening panel component.
- **Line 5**: Imports recent-links table panel.
- **Line 6**: Imports analytics panel.
- **Lines 7-11**: Imports API helpers (`buildShortLink`, `fetchAnalytics`, `shortenUrl`) from service layer.
- **Line 12**: Empty line.
- **Line 13**: Declares helper function `generateSevenDaySeries(totalClicks)`.
- **Line 14**: Comment clarifying this is currently placeholder distribution logic.
- **Line 15**: Defines click-per-day weight pattern for seven days.
- **Line 16**: Converts pattern ratios to rounded integer click counts (minimum `1`).
- **Line 17**: Ends helper function.
- **Line 18**: Empty line.
- **Line 19**: Declares and exports root `App` component.
- **Line 20**: State for long URL input.
- **Line 21**: State for shorten submit loading spinner/button lock.
- **Line 22**: State for shorten error message.
- **Line 23**: State for shorten API response object.
- **Line 24**: Empty line.
- **Line 25**: State for analytics shortcode input.
- **Line 26**: State for analytics loading state.
- **Line 27**: State for analytics error message.
- **Line 28**: State for analytics result payload.
- **Line 29**: Empty line.
- **Line 30**: Comment: recent links are local session-only until backend list endpoint exists.
- **Line 31**: State array storing recent links table rows.
- **Line 32**: Memoized derived full short URL.
- **Line 33**: Guard: if no shortcode yet, return empty string.
- **Line 34**: Builds full short URL using service helper.
- **Line 35**: Recomputes only when `shortenResult` changes.
- **Line 36**: Empty line.
- **Line 37**: Memoized analytics series data.
- **Line 38**: Guard: no analytics result means empty series.
- **Line 39**: Generates mock 7-day series from total clicks.
- **Line 40**: Recomputes only when analytics result changes.
- **Line 41**: Empty line.
- **Line 42**: Defines async form submit handler for shorten flow.
- **Line 43**: Prevents browser full-page form submit reload.
- **Line 44**: Enables loading state.
- **Line 45**: Clears previous shorten error.
- **Line 46**: Empty line.
- **Line 47**: Starts `try` block.
- **Line 48**: Calls API `shortenUrl` with trimmed user input.
- **Line 49**: Empty line.
- **Line 50**: Stores shorten API response.
- **Line 51**: Empty line.
- **Line 52**: Extracts shortcode from API response.
- **Line 53**: Updates recent links state using functional update.
- **Line 54**: Checks whether this shortcode already exists.
- **Line 55**: If duplicate, keep previous state unchanged.
- **Line 56**: Returns new recent-links array when not duplicate.
- **Lines 57-63**: Constructs new row object (shortCode, originalUrl, clicks placeholder, status).
- **Line 64**: Prepends new row to previous rows.
- **Line 65**: Trims list to max 6 rows.
- **Line 66**: Ends state updater.
- **Line 67**: Empty line.
- **Line 68**: Clears URL input field after success.
- **Line 69**: Starts error handling block.
- **Line 70**: Special-case 429 rate-limit with retry-after message.
- **Line 71**: Builds friendly retry string.
- **Line 72**: Generic error fallback.
- **Line 73**: Stores generic error message.
- **Line 74**: Ends `if/else`.
- **Line 75**: `finally` always runs.
- **Line 76**: Stops loading spinner regardless of success/failure.
- **Line 77**: Ends shorten handler.
- **Line 78**: Empty line.
- **Line 79**: Defines analytics submit handler.
- **Line 80**: Prevents native form submit reload.
- **Line 81**: Enables analytics loading state.
- **Line 82**: Clears previous analytics error.
- **Line 83**: Empty line.
- **Line 84**: Starts `try`.
- **Line 85**: Calls analytics API with trimmed short code.
- **Line 86**: Empty line.
- **Line 87**: Stores analytics response payload.
- **Line 88**: Empty line.
- **Line 89**: Comment: synchronize table click count from analytics response.
- **Line 90**: Functional update for recent links.
- **Line 91**: Iterates rows.
- **Lines 92-94**: If same shortcode, replace row `clicks` with server total.
- **Line 95**: Otherwise keep row unchanged.
- **Line 96**: Ends map updater.
- **Line 97**: Ends `try`.
- **Line 98**: Analytics error handler.
- **Line 99**: Stores message or fallback.
- **Line 100**: `finally` starts.
- **Line 101**: Stops analytics loading state.
- **Line 102**: Ends analytics handler.
- **Line 103**: Empty line.
- **Line 104**: Defines copy-to-clipboard handler.
- **Line 105**: Guard: no link means do nothing.
- **Line 106**: Starts `try`.
- **Line 107**: Writes short link to clipboard.
- **Line 108**: Copy failure catch.
- **Line 109**: Shows alert fallback if copy API fails.
- **Line 110**: Ends catch.
- **Line 111**: Ends copy handler.
- **Line 112**: Empty line.
- **Line 113**: Starts JSX return.
- **Line 114**: Top shell wrapper.
- **Line 115**: Renders top bar component.
- **Line 116**: Empty line.
- **Line 117**: Main content container.
- **Lines 118-127**: Renders `ShortenPanel` and injects all needed props (input state, loading, errors, result, handlers).
- **Line 128**: Empty line.
- **Lines 129-133**: Renders `RecentLinksPanel`, passing rows, URL builder, and select handler.
- **Line 134**: Empty line.
- **Lines 135-144**: Renders `AnalyticsPanel`, passing analytics state, derived series, submit handler, and link builder.
- **Line 145**: Closes main.
- **Line 146**: Closes shell.
- **Line 147**: Ends JSX return.
- **Line 148**: Ends component.

---

## 3) `src/services/shortenerApi.js`

### What this file does

Centralizes frontend API behavior:
- base URL resolution,
- JSON parsing with safe fallback,
- standard error object shaping,
- endpoint-specific request functions.

### Line-by-line

- **Line 1**: Defines API base from env var fallback to localhost backend.
- **Line 2**: Empty line.
- **Line 3**: Helper parses response JSON; returns `{}` if body isn’t valid JSON.
- **Line 4**: Empty line.
- **Line 5**: Declares `createApiError` helper.
- **Line 6**: Normalizes backend message to `body.msg` or default message.
- **Line 7**: Reads `Retry-After` header for rate-limit responses.
- **Line 8**: Returns consistent error object.
- **Line 9**: Includes HTTP status.
- **Line 10**: Includes message text.
- **Line 11**: Converts `Retry-After` to number or `null`.
- **Line 12**: Ends object.
- **Line 13**: Ends helper.
- **Line 14**: Empty line.
- **Line 15**: Exports helper to build full short URL by shortcode.
- **Line 16**: Removes trailing slash from base URL before appending code.
- **Line 17**: Empty line.
- **Line 18**: Exports function for POST shorten endpoint.
- **Line 19**: Calls `fetch` to `/api/shorten`.
- **Line 20**: HTTP method is POST.
- **Line 21**: Sends JSON content-type header.
- **Line 22**: Sends payload `{ originalUrl }`.
- **Line 23**: Ends fetch options.
- **Line 24**: Parses response body safely.
- **Line 25**: Empty line.
- **Line 26**: If non-2xx response...
- **Line 27**: throw normalized API error object.
- **Line 28**: Ends if.
- **Line 29**: Empty line.
- **Line 30**: Return success response body.
- **Line 31**: Ends shorten function.
- **Line 32**: Empty line.
- **Line 33**: Exports function for analytics endpoint.
- **Line 34**: Calls `fetch` with encoded short code.
- **Line 35**: Uses `encodeURIComponent` for safe URL path usage.
- **Line 36**: Ends fetch call.
- **Line 37**: Parses response body safely.
- **Line 38**: Empty line.
- **Line 39**: If non-2xx response...
- **Line 40**: throw normalized API error object.
- **Line 41**: Ends if.
- **Line 42**: Empty line.
- **Line 43**: Returns success response body.
- **Line 44**: Ends analytics function.
- **Line 45**: Trailing newline.

---

## 4) `src/components/dashboard/TopBar.jsx`

### What this file does

Simple presentational header component for app branding.

### Line-by-line

- **Line 1**: Exports functional component `TopBar`.
- **Line 2**: Starts returned JSX.
- **Line 3**: Renders header element with `topbar` class.
- **Line 4**: Shows product label `SHORT.IO`.
- **Line 5**: Closes header.
- **Line 6**: Ends JSX return.
- **Line 7**: Ends component.
- **Line 8**: Trailing newline.

---

## 5) `src/components/dashboard/ShortenPanel.jsx`

### What this file does

Presentational + form-input component for creating short links and showing latest shorten result.

### Line-by-line

- **Line 1**: Exports `ShortenPanel` with destructured props.
- **Lines 2-9**: Props include input value/setter, loading/error/result, generated link, submit/copy handlers.
- **Line 10**: Closes prop list.
- **Line 11**: Starts JSX return.
- **Line 12**: Panel section wrapper.
- **Line 13**: Input label for accessibility.
- **Line 14**: Label text.
- **Line 15**: Closes label.
- **Line 16**: Empty line.
- **Line 17**: Form binds submit handler from parent.
- **Line 18**: URL input field starts.
- **Line 19**: Input id links to label `htmlFor`.
- **Line 20**: Native URL validation type.
- **Line 21**: Placeholder for guidance.
- **Line 22**: Controlled value from state.
- **Line 23**: On change, updates parent state.
- **Line 24**: Marks field as required.
- **Line 25**: Closes input.
- **Line 26**: Submit button; disabled while loading.
- **Line 27**: Shows dynamic text based on loading state.
- **Line 28**: Closes button.
- **Line 29**: Closes form.
- **Line 30**: Empty line.
- **Line 31**: Metadata row under form.
- **Line 32**: Error text area; keeps space to prevent layout jump.
- **Line 33**: Shows static rate-limit info.
- **Line 34**: Ends metadata row.
- **Line 35**: Empty line.
- **Line 36**: Conditionally render result card only if shorten succeeded.
- **Line 37**: Result container.
- **Line 38**: Content wrapper.
- **Line 39**: Small title text.
- **Line 40**: Clickable short link in new tab.
- **Line 41**: Displays link string.
- **Line 42**: Closes anchor.
- **Line 43**: Closes text wrapper.
- **Line 44**: Copy button wired to parent handler.
- **Line 45**: Button text.
- **Line 46**: Closes button.
- **Line 47**: Closes result card.
- **Line 48**: Ends conditional render.
- **Line 49**: Closes panel section.
- **Line 50**: Ends return.
- **Line 51**: Ends component.
- **Line 52**: Trailing newline.

---

## 6) `src/components/dashboard/RecentLinksPanel.jsx`

### What this file does

Renders recent-link table and lets user click a short link row to prefill analytics lookup.

### Line-by-line

- **Line 1**: Exports `RecentLinksPanel` with props for rows, URL builder, and row-click handler.
- **Line 2**: Starts JSX return.
- **Line 3**: Section panel wrapper.
- **Line 4**: Header row container.
- **Line 5**: Section heading.
- **Line 6**: Closes heading wrapper.
- **Line 7**: Empty line.
- **Line 8**: Table container (scroll/responsive wrapper).
- **Line 9**: Starts table element.
- **Line 10**: Table head starts.
- **Line 11**: Header row starts.
- **Line 12**: Column title for short URL.
- **Line 13**: Column title for original URL.
- **Line 14**: Column title for clicks.
- **Line 15**: Column title for status.
- **Line 16**: Ends header row.
- **Line 17**: Ends table head.
- **Line 18**: Starts table body.
- **Line 19**: If there are no recent links...
- **Line 20**: empty-state row.
- **Line 21**: One cell spanning all four columns.
- **Line 22**: Empty-state message text.
- **Line 23**: Close cell.
- **Line 24**: Close row.
- **Line 25**: Else branch starts.
- **Line 26**: Maps each link row to a table row.
- **Line 27**: Row key is shortcode.
- **Line 28**: Starts first cell.
- **Line 29**: Renders button (acts as interactive short-link item).
- **Line 30**: Explicit non-submit button.
- **Line 31**: Styling class for link-like button appearance.
- **Line 32**: Clicking row sets analytics short code in parent state.
- **Line 33**: Tooltip for clarity.
- **Line 34**: Closes opening button tag.
- **Line 35**: Displays computed full short URL.
- **Line 36**: Closes button.
- **Line 37**: Ends first cell.
- **Line 38**: Second cell with truncated original URL.
- **Line 39**: Third cell with click count.
- **Line 40**: Fourth cell starts.
- **Line 41**: Status badge (`ACTIVE` currently).
- **Line 42**: Ends status cell.
- **Line 43**: Ends row.
- **Line 44**: Ends map callback.
- **Line 45**: Ends conditional.
- **Line 46**: Ends tbody.
- **Line 47**: Ends table.
- **Line 48**: Ends table wrapper.
- **Line 49**: Ends panel section.
- **Line 50**: Ends return.
- **Line 51**: Ends component.
- **Line 52**: Trailing newline.

---

## 7) `src/components/dashboard/AnalyticsPanel.jsx`

### What this file does

Handles analytics UI section:
- short code input form,
- error display,
- chart rendering via child component,
- summary stats cards.

### Line-by-line

- **Line 1**: Imports child chart component.
- **Line 2**: Empty line.
- **Line 3**: Exports analytics panel component with props.
- **Lines 4-12**: Props include analytics input/state, submit handler, chart series, and link builder.
- **Line 13**: Starts JSX return.
- **Line 14**: Section panel wrapper.
- **Line 15**: Section header row.
- **Line 16**: Left side header container.
- **Line 17**: Section title.
- **Line 18**: Subtitle text.
- **Line 19**: Closes left header block.
- **Line 20**: Analytics lookup form with submit handler.
- **Line 21**: Input starts.
- **Line 22**: Text input type.
- **Line 23**: Placeholder guidance.
- **Line 24**: Controlled value from parent state.
- **Line 25**: On change updates parent state.
- **Line 26**: Required field.
- **Line 27**: Closes input.
- **Line 28**: Submit button disabled while loading.
- **Line 29**: Dynamic button text while loading.
- **Line 30**: Closes button.
- **Line 31**: Closes form.
- **Line 32**: Closes header row.
- **Line 33**: Empty line.
- **Line 34**: Conditional error display.
- **Line 35**: Empty line.
- **Line 36**: Conditional rendering for successful analytics response.
- **Line 37**: Fragment start.
- **Line 38**: Shows full short link as sub-title.
- **Line 39**: Empty line.
- **Line 40**: Renders `AnalyticsChart` with computed series.
- **Line 41**: Empty line.
- **Line 42**: Starts summary stats grid.
- **Line 43**: Stat card 1 wrapper.
- **Line 44**: Label "TOTAL CLICKS".
- **Line 45**: Value from `analyticsResult.totalClicks`.
- **Line 46**: Ends card 1.
- **Line 47**: Stat card 2 wrapper.
- **Line 48**: Label "CREATED".
- **Line 49**: Formats backend `createdAt` date for user locale.
- **Line 50**: Ends card 2.
- **Line 51**: Stat card 3 wrapper.
- **Line 52**: Label "TOP REFERRER".
- **Line 53**: Placeholder `N/A` (backend endpoint not yet providing this).
- **Line 54**: Ends card 3.
- **Line 55**: Stat card 4 wrapper.
- **Line 56**: Label "TOP DEVICE".
- **Line 57**: Placeholder `N/A`.
- **Line 58**: Ends card 4.
- **Line 59**: Ends stats grid.
- **Line 60**: Ends fragment.
- **Line 61**: Ends analytics conditional.
- **Line 62**: Ends section.
- **Line 63**: Ends return.
- **Line 64**: Ends component.
- **Line 65**: Trailing newline.

---

## 8) `src/components/dashboard/AnalyticsChart.jsx`

### What this file does

Bridges React with Chart.js imperative API:
- creates chart when data changes,
- destroys previous chart instance to avoid leaks,
- renders `<canvas>` target.

### Line-by-line

- **Line 1**: Imports React refs/effect hooks.
- **Line 2**: Imports Chart.js auto bundle (registers built-in chart types/scales/plugins).
- **Line 3**: Empty line.
- **Line 4**: Defines static x-axis labels for week days.
- **Line 5**: Empty line.
- **Line 6**: Exports component receiving `analyticsSeries`.
- **Line 7**: Ref to canvas DOM element.
- **Line 8**: Ref to active chart instance.
- **Line 9**: Empty line.
- **Line 10**: Effect hook runs after render when `analyticsSeries` changes.
- **Line 11**: Guard: if canvas is not mounted yet, exit.
- **Line 12**: Empty line.
- **Line 13**: Build chart data: use given series if available...
- **Line 14**: ...true branch uses provided data.
- **Line 15**: ...otherwise fallback seven zeros.
- **Line 16**: Grabs 2D drawing context from canvas.
- **Line 17**: Empty line.
- **Line 18**: If a previous chart instance exists...
- **Line 19**: destroy it before creating new one.
- **Line 20**: Ends if.
- **Line 21**: Empty line.
- **Line 22**: Creates and stores new Chart instance.
- **Line 23**: Chooses `bar` chart type.
- **Line 24**: Starts data config.
- **Line 25**: Applies weekday labels to x-axis.
- **Line 26**: Starts datasets array.
- **Line 27**: Dataset object starts.
- **Line 28**: Dataset label.
- **Line 29**: Data values for bars.
- **Line 30**: Bar fill color.
- **Line 31**: Bar border color.
- **Line 32**: Border width.
- **Line 33**: Rounded bar corners.
- **Line 34**: Maximum bar width.
- **Line 35**: Hover color.
- **Line 36**: Ends dataset.
- **Line 37**: Ends datasets array.
- **Line 38**: Ends data object.
- **Line 39**: Starts options object.
- **Line 40**: Responsive chart.
- **Line 41**: Disable fixed aspect ratio so container height controls chart.
- **Line 42**: Animation speed.
- **Line 43**: Plugin config start.
- **Line 44**: Hide legend for one-series chart.
- **Line 45**: Tooltip style config start.
- **Line 46**: Tooltip background color.
- **Line 47**: Tooltip title color.
- **Line 48**: Tooltip body color.
- **Line 49**: Tooltip border color.
- **Line 50**: Tooltip border width.
- **Line 51**: Tooltip padding.
- **Line 52**: Hide color box in tooltip.
- **Line 53**: Ends tooltip config.
- **Line 54**: Ends plugin config.
- **Line 55**: Axis scale config start.
- **Line 56**: X-axis config start.
- **Line 57**: Hides vertical grid lines.
- **Line 58**: X tick config start.
- **Line 59**: X tick text color.
- **Line 60**: X tick font style.
- **Line 61**: Ends x ticks config.
- **Line 62**: X-axis border color.
- **Line 63**: Ends x-axis config.
- **Line 64**: Y-axis config start.
- **Line 65**: Y-axis starts at zero.
- **Line 66**: Y ticks config start.
- **Line 67**: Y tick text color.
- **Line 68**: No decimal precision in labels.
- **Line 69**: Ends y ticks config.
- **Line 70**: Y grid line color.
- **Line 71**: Y-axis border color.
- **Line 72**: Ends y-axis config.
- **Line 73**: Ends scales.
- **Line 74**: Ends options.
- **Line 75**: Ends Chart constructor config.
- **Line 76**: Empty line.
- **Line 77**: Effect cleanup function start.
- **Line 78**: If chart exists...
- **Line 79**: destroy chart instance.
- **Line 80**: clear chart ref.
- **Line 81**: ends if.
- **Line 82**: ends cleanup.
- **Line 83**: effect depends on `analyticsSeries`.
- **Line 84**: Empty line.
- **Line 85**: Starts JSX return.
- **Line 86**: Outer card container.
- **Line 87**: Inner wrapper controlling chart height.
- **Line 88**: Canvas element attached to `chartCanvasRef`.
- **Line 89**: Close inner wrapper.
- **Line 90**: Close outer wrapper.
- **Line 91**: End JSX return.
- **Line 92**: End component.
- **Line 93**: Trailing newline.

---

## 9) `index.html`

### What this file does

Static HTML shell Vite serves; React mounts into `#root`.

### Line-by-line

- **Line 1**: HTML5 doctype declaration.
- **Line 2**: Root html element with `lang="en"`.
- **Line 3**: Head section starts.
- **Line 4**: UTF-8 encoding.
- **Line 5**: Sets SVG favicon path.
- **Line 6**: Viewport meta for responsive scaling.
- **Line 7**: Browser tab title.
- **Line 8**: Ends head.
- **Line 9**: Body starts.
- **Line 10**: Mount node for React app.
- **Line 11**: Loads frontend entry module (`main.jsx`).
- **Line 12**: Ends body.
- **Line 13**: Ends html document.
- **Line 14**: Trailing newline.

---

## 10) `vite.config.js`

### What this file does

Vite configuration enabling React plugin.

### Line-by-line

- **Line 1**: Imports `defineConfig` helper from Vite.
- **Line 2**: Imports React plugin for Vite.
- **Line 3**: Empty line.
- **Line 4**: Comment with Vite config docs URL.
- **Line 5**: Exports Vite config object.
- **Line 6**: Registers React plugin in `plugins` array.
- **Line 7**: Closes config.
- **Line 8**: Trailing newline.

---

## 11) `eslint.config.js`

### What this file does

Defines lint rules for JS/JSX files using modern flat-config style.

### Line-by-line

- **Line 1**: Imports base JavaScript lint rules.
- **Line 2**: Imports browser/global variable presets.
- **Line 3**: Imports React hooks lint plugin.
- **Line 4**: Imports React refresh lint plugin.
- **Line 5**: Imports config helpers from ESLint flat config package.
- **Line 6**: Empty line.
- **Line 7**: Exports array-based flat config.
- **Line 8**: Globally ignore built output directory `dist`.
- **Line 9**: Starts per-file config block.
- **Line 10**: Applies config to `.js` and `.jsx`.
- **Line 11**: Starts inherited config presets.
- **Line 12**: Base JS recommended rules.
- **Line 13**: React hooks recommended rules.
- **Line 14**: React refresh rules optimized for Vite.
- **Line 15**: Ends extends list.
- **Line 16**: Language options block starts.
- **Line 17**: Exposes browser globals (`window`, `document`, etc.).
- **Line 18**: Enables JSX parsing feature.
- **Line 19**: Ends language options.
- **Line 20**: Ends file config block.
- **Line 21**: Ends exported config array.
- **Line 22**: Trailing newline.

---

## 12) `package.json`

### What this file does

Project manifest:
- app metadata,
- scripts,
- runtime dependencies,
- dev-time tool dependencies.

### Line-by-line

- **Line 1**: JSON object starts.
- **Line 2**: Package name `frontend`.
- **Line 3**: Marked `private` (cannot accidentally publish to npm).
- **Line 4**: Version number.
- **Line 5**: Uses ESM (`import/export`) syntax.
- **Line 6**: Script map starts.
- **Line 7**: `npm run dev` starts Vite dev server.
- **Line 8**: `npm run build` creates production bundle.
- **Line 9**: `npm run lint` runs ESLint.
- **Line 10**: `npm run preview` serves built app locally.
- **Line 11**: Ends scripts.
- **Line 12**: Runtime dependencies start.
- **Line 13**: Chart.js runtime library.
- **Line 14**: React library.
- **Line 15**: React DOM renderer.
- **Line 16**: Ends dependencies.
- **Line 17**: Dev dependencies start.
- **Line 18**: ESLint core JS rule package.
- **Line 19**: React type definitions (useful for editor tooling).
- **Line 20**: React DOM type definitions.
- **Line 21**: Vite React plugin.
- **Line 22**: ESLint engine.
- **Line 23**: React hooks lint plugin.
- **Line 24**: React refresh lint plugin.
- **Line 25**: Browser/node globals package.
- **Line 26**: Vite build tool.
- **Line 27**: Ends dev dependencies.
- **Line 28**: Ends JSON.
- **Line 29**: Trailing newline.

---

## 13) `.gitignore`

### What this file does

Prevents committing transient/generated/local files.

### Line-by-line

- **Line 1**: Section comment for logs.
- **Line 2**: Ignore `logs` directory.
- **Line 3**: Ignore any `.log` file.
- **Line 4**: Ignore npm debug logs.
- **Line 5**: Ignore yarn debug logs.
- **Line 6**: Ignore yarn error logs.
- **Line 7**: Ignore pnpm debug logs.
- **Line 8**: Ignore lerna logs.
- **Line 9**: Empty line.
- **Line 10**: Ignore `node_modules`.
- **Line 11**: Ignore Vite build output folder.
- **Line 12**: Ignore SSR build output.
- **Line 13**: Ignore local override files (`*.local`).
- **Line 14**: Empty line.
- **Line 15**: Section comment for editor files.
- **Line 16**: Ignore `.vscode` folder contents...
- **Line 17**: ...except `extensions.json` so recommended extensions can be shared.
- **Line 18**: Ignore JetBrains `.idea`.
- **Line 19**: Ignore macOS Finder metadata.
- **Line 20**: Ignore Visual Studio `.suo`.
- **Line 21**: Ignore Visual Studio `.ntvs*`.
- **Line 22**: Ignore Visual Studio `.njsproj`.
- **Line 23**: Ignore solution files.
- **Line 24**: Ignore Vim swap/temp files.
- **Line 25**: Trailing newline.

---

## 14) `README.md`

### What this file does

Default template README from Vite React starter.

### Line-by-line

- **Line 1**: Main title.
- **Line 2**: Empty line.
- **Line 3**: One-line description of template purpose.
- **Line 4**: Empty line.
- **Line 5**: Intro to available official plugins.
- **Line 6**: Empty line.
- **Line 7**: Bullet for React plugin (Oxc-based transform pipeline).
- **Line 8**: Bullet for React SWC plugin.
- **Line 9**: Empty line.
- **Line 10**: Section heading about React Compiler.
- **Line 11**: Empty line.
- **Line 12**: Notes compiler not enabled by default and links docs.
- **Line 13**: Empty line.
- **Line 14**: Section heading about extending ESLint config.
- **Line 15**: Empty line.
- **Line 16**: Suggestion to use TS template for production-grade type-aware linting.
- **Line 17**: Trailing newline.

---

## 15) SVG Asset Files (Quick Context)

These are not app logic files, but they are text-based source assets:

- `public/favicon.svg`
- `public/icons.svg`
- `src/assets/react.svg`
- `src/assets/vite.svg`

They define vector graphics used by browser tab icon / branding visuals. Since they are design assets (not application behavior), they are usually not explained line-by-line in code architecture docs.

---

## End-to-End Frontend Flow (High-level)

1. `index.html` loads `src/main.jsx`.
2. `main.jsx` mounts `App`.
3. `App.jsx` holds state and handlers.
4. `ShortenPanel` collects URL input -> `shortenerApi.shortenUrl`.
5. `RecentLinksPanel` displays local recent list and can prefill analytics code.
6. `AnalyticsPanel` submits shortcode -> `shortenerApi.fetchAnalytics`.
7. `AnalyticsChart` visualizes `analyticsSeries` in Chart.js.

If you want, next I can create a second document named `frontendDataFlow.md` with diagrams (request/response shapes, prop flow tree, state transitions, and event sequence charts).
