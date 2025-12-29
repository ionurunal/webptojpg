# World War Photos Archiver - UI Design

## Design Principles

1. **Clarity:** Every action and status must be immediately understandable
2. **Trust:** Show exactly what the tool will do before it does it
3. **Transparency:** Display real-time progress and clear error messages
4. **Respect:** Prominent legal disclaimer and ethical guidelines
5. **Reliability:** Visual feedback for all long-running operations

## Visual Design Language

- **Framework:** TailwindCSS + DaisyUI components
- **Theme:** Professional, research-focused (light mode primary, optional dark mode)
- **Typography:** System fonts, monospace for technical data
- **Icons:** Lucide React or Heroicons
- **Color Palette:**
  - Primary: Blue (trust, stability)
  - Success: Green (downloads complete)
  - Warning: Amber (rate limits, paused)
  - Error: Red (failures, access denied)
  - Neutral: Gray (disabled, secondary info)

## Application Shell

### Main Layout

```
┌─────────────────────────────────────────────────────────┐
│  [Logo] World War Photos Archiver        [Settings] [?] │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌─ Progress Steps ─────────────────────────────────┐  │
│  │  1. Session → 2. Browse → 3. Plan → 4. Download │  │
│  └─────────────────────────────────────────────────┘  │
│                                                          │
│  ┌─ Main Content Area ─────────────────────────────┐  │
│  │                                                   │  │
│  │              [Active Screen Content]             │  │
│  │                                                   │  │
│  │                                                   │  │
│  └───────────────────────────────────────────────────┘  │
│                                                          │
│  [Status Bar: Session Active ✓ | Categories: 247]      │
└─────────────────────────────────────────────────────────┘
```

### Navigation

- **Stepper Component:** Visual progress through 4 main stages
- **Breadcrumbs:** Show current location in deep category trees
- **Quick Actions:** Sticky footer with primary CTAs

## Screen 1: Home & Legal Disclaimer

### Purpose
Initial landing page with legal notice and project introduction.

### Layout

```
┌──────────────────────────────────────────────────────────┐
│                                                           │
│  ⚠️  Legal Notice & Terms of Use                          │
│                                                           │
│  This tool is designed for personal archival and          │
│  research purposes only.                                  │
│                                                           │
│  You must:                                                │
│  ✓ Respect copyright laws and site terms of service      │
│  ✓ Check robots.txt before downloading                   │
│  ✓ Use reasonable rate limits                            │
│  ✓ Obtain proper authorization if required               │
│                                                           │
│  The developers are not responsible for misuse.           │
│                                                           │
│  [ ] I understand and agree to use this tool responsibly  │
│                                                           │
│             [Continue to Session Setup]                   │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

### Components

- **Alert Banner:** High-visibility warning styling
- **Checkbox:** Required confirmation before proceeding
- **Button:** Disabled until checkbox is checked

### Actions

1. User reads and checks agreement
2. "Continue" button enables
3. Navigate to Session Setup screen

## Screen 2: Session Setup

### Purpose
Establish and verify a legitimate browser session to access the website.

### Layout

```
┌──────────────────────────────────────────────────────────┐
│  Session Setup                                            │
│                                                           │
│  Choose how to authenticate with worldwarphotos.info:    │
│                                                           │
│  ┌─ Option A: Playwright Browser (Recommended) ────────┐│
│  │                                                       ││
│  │  Launch a real browser, manually complete any        ││
│  │  verification, then save the session.                ││
│  │                                                       ││
│  │  Status: ○ Not started                               ││
│  │                                                       ││
│  │  [Launch Browser]  [Save Session]                    ││
│  └───────────────────────────────────────────────────────┘│
│                                                           │
│  ┌─ Option B: Import Cookies (Advanced) ────────────────┐│
│  │                                                       ││
│  │  Paste cookies from your browser's developer tools:  ││
│  │                                                       ││
│  │  ┌─────────────────────────────────────────────────┐ ││
│  │  │ {                                               │ ││
│  │  │   "cookies": [...]                              │ ││
│  │  │ }                                               │ ││
│  │  └─────────────────────────────────────────────────┘ ││
│  │                                                       ││
│  │  [Import & Verify]                                   ││
│  └───────────────────────────────────────────────────────┘│
│                                                           │
│  ┌─ Current Session ────────────────────────────────────┐│
│  │  Status: ✓ Active                                    ││
│  │  Type: Playwright Browser                            ││
│  │  Last Verified: 2 minutes ago                        ││
│  │                                                       ││
│  │  [Test Session]  [Clear Session]                     ││
│  └───────────────────────────────────────────────────────┘│
│                                                           │
│                               [Next: Browse Categories →] │
└──────────────────────────────────────────────────────────┘
```

### Option A: Playwright Browser Flow

**Step 1 - Launch Browser:**
```
[Launch Browser] button clicked
  ↓
Backend starts Playwright with persistent context
  ↓
Browser window opens showing worldwarphotos.info
  ↓
UI shows: "Browser launched. Complete any verification, then click Save."
```

**Step 2 - Save Session:**
```
User completes verification manually in browser
  ↓
[Save Session] button clicked
  ↓
Backend saves browser state (cookies, local storage)
  ↓
Browser closes
  ↓
UI shows: "Session saved ✓"
```

### Option B: Cookie Import Flow

**Import Process:**
```
User pastes JSON cookie data
  ↓
[Import & Verify] clicked
  ↓
Backend validates format
  ↓
Backend tests cookies with test request
  ↓
Success: "Cookies verified ✓" | Failure: "Invalid or expired cookies"
```

### Session Status Component

**States:**
- **Not configured:** Gray indicator, "Setup required"
- **Active:** Green indicator, timestamp
- **Expired:** Red indicator, "Re-verification needed"
- **Testing:** Blue spinner, "Verifying..."

### Test Session Button

**Action:**
```
Backend makes test request to category page
  ↓
Success: "Session valid ✓ (200 OK)"
  ↓
Failure: "Access denied (403)" or "Verification page detected"
```

### Components

- **Radio Group:** Toggle between Option A and B
- **Code Editor:** Monaco or simple textarea for JSON
- **Status Badge:** Visual session state indicator
- **Action Buttons:** Primary/secondary button hierarchy

## Screen 3: Category Browser

### Purpose
Discover and explore the site's category hierarchy, select categories for download.

### Layout

```
┌──────────────────────────────────────────────────────────┐
│  Category Browser                                         │
│                                                           │
│  ┌─ Actions ──────────────────────────────────────────┐  │
│  │  [Discover Categories]  [Refresh]                  │  │
│  │                                                     │  │
│  │  🔍 Search: [______________]  Filter: [All Nations]│  │
│  └─────────────────────────────────────────────────────┘  │
│                                                           │
│  ┌─ Category Tree ────────────────────┬─ Details ──────┐ │
│  │                                    │                 │ │
│  │  ☐ Germany (342 albums)           │  Germany        │ │
│  │    ├─☐ Luftwaffe (87)             │  └─ Luftwaffe   │ │
│  │    │  ├─☐ Fighters (34)           │                 │ │
│  │    │  ├─☐ Bombers (28)            │  87 albums      │ │
│  │    │  └─☑ Transport (25) ✓        │  ~2,175 images  │ │
│  │    ├─☐ Wehrmacht (156)            │                 │ │
│  │    └─☐ Kriegsmarine (99)          │  Selected:      │ │
│  │  ☐ United States (289)            │  1 album        │ │
│  │  ☐ United Kingdom (183)           │  25 images est. │ │
│  │  ☐ Soviet Union (145)             │                 │ │
│  │  ...                               │  [Add to Plan]  │ │
│  │                                    │                 │ │
│  └────────────────────────────────────┴─────────────────┘ │
│                                                           │
│  Discovery Progress: ████████████░░░░░░ 65% (159/247)   │
│                                                           │
│                         [Continue to Download Planner →] │
└──────────────────────────────────────────────────────────┘
```

### Discover Categories Flow

**Initial State:**
```
Tree view shows: "No categories discovered yet"
[Discover Categories] button visible
```

**Discovery Process:**
```
User clicks [Discover Categories]
  ↓
Backend starts crawling from root category pages
  ↓
Real-time updates via SSE:
  - Progress bar updates (X/Y categories)
  - Tree view populates incrementally
  - Status: "Discovering: Germany > Luftwaffe > Fighters..."
  ↓
Complete: "Discovered 247 categories, 3,892 albums"
```

### Tree View Component

**Features:**
- **Hierarchical:** Indent levels for subcategories
- **Checkboxes:**
  - Parent checkbox selects all children
  - Indeterminate state when some children selected
- **Expand/Collapse:** Click category name to toggle
- **Metadata:** Show album count and estimated images
- **Icons:**
  - 📁 Category (closed)
  - 📂 Category (open)
  - 🖼️ Album (leaf node)

**Interaction:**
```
Click category name → Expand/collapse children
Click checkbox → Select/deselect for download
Hover → Highlight, show tooltip with full path
```

### Search & Filter

**Search:**
- Real-time filtering of tree view
- Search by: category name, album title
- Highlight matching text
- Show match count: "12 results"

**Filter:**
- Dropdown: "All Nations", "Germany", "United States", etc.
- Dropdown: "All Topics", "Aircraft", "Tanks", "Ships", etc.
- Combined filters: AND logic

### Details Panel

**Shows:**
- Full category path breadcrumb
- Total albums in selection
- Estimated image count
- Download size estimate (if available)
- Quick stats (most popular subcategory, etc.)

**Actions:**
- [Add to Plan]: Add selected items to download queue
- [View Sample]: Open sample album in new tab

### Components

- **Tree View:** Radix UI Accordion or custom recursive component
- **Search Input:** Debounced search with clear button
- **Filter Dropdown:** Multi-select dropdown
- **Progress Bar:** Linear progress with percentage
- **Side Panel:** Resizable split view

## Screen 4: Download Planner

### Purpose
Configure download settings, review selections, and initiate downloads.

### Layout

```
┌──────────────────────────────────────────────────────────┐
│  Download Planner                                         │
│                                                           │
│  ┌─ Selected Albums ──────────────────────────────────┐  │
│  │                                                     │  │
│  │  ✓ Germany > Luftwaffe > Transport (25 albums)     │  │
│  │  ✓ United States > Army Air Forces > B-17 (12)     │  │
│  │  ✓ United Kingdom > RAF > Spitfire (18)            │  │
│  │                                              [Edit] │  │
│  │  Total: 55 albums, ~1,375 images estimated         │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                           │
│  ┌─ Download Settings ────────────────────────────────┐  │
│  │                                                     │  │
│  │  Download Directory:                               │  │
│  │  [/Users/researcher/Downloads/ww2-photos] [Browse] │  │
│  │                                                     │  │
│  │  Concurrency: [3▼] parallel downloads              │  │
│  │  Delay: [1000] ms + [500] ms jitter                │  │
│  │  Retry attempts: [5▼]                              │  │
│  │                                                     │  │
│  │  ☑ Skip existing files                             │  │
│  │  ☑ Generate download manifest                      │  │
│  │  ☐ Verify files with checksums (slower)            │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                           │
│  ┌─ Naming Rules ─────────────────────────────────────┐  │
│  │                                                     │  │
│  │  Folder: {nation}/{category_path}/{album_title}/   │  │
│  │  File: {album_title}__{index}__{original_filename} │  │
│  │                                                     │  │
│  │  Example:                                           │  │
│  │  germany/luftwaffe/transport-aircraft/              │
│  │    └─ transport-aircraft__001__ju52-cockpit.jpg    │  │
│  │                                         [Customize] │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                           │
│  ┌─ Dry Run Preview ──────────────────────────────────┐  │
│  │  [Run Dry Run] - Preview files without downloading │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                           │
│                  [← Back]  [Start Download]               │
└──────────────────────────────────────────────────────────┘
```

### Download Settings

**Concurrency:**
- Slider or dropdown: 1-5 parallel downloads
- Default: 3
- Explanation: "Higher values are faster but may trigger rate limits"

**Delay & Jitter:**
- Base delay: 500-5000ms (default: 1000ms)
- Jitter: 0-2000ms (default: 500ms)
- Explanation: "Random delay reduces detection. Total: 1000-1500ms per request"

**Retry Attempts:**
- Dropdown: 1-10 retries
- Default: 5
- Exponential backoff: 2s, 4s, 8s, 16s, 32s

**Options:**
- **Skip existing files:** Check local filesystem before downloading
- **Generate manifest:** Create JSON audit trail
- **Verify checksums:** Calculate SHA256 for integrity (slower)

### Directory Picker

**Native file picker dialog:**
```
[Browse] → Opens system file picker
User selects directory
Path updates in input field
Validation: Check write permissions and available space
```

### Naming Rules

**Default Pattern:**
- Folder: `{nation}/{category_path}/{album_title}/`
- File: `{album_title}__{index}__{original_filename}`

**Customization Dialog:**
```
Available variables:
- {nation}: Top-level category (e.g., "germany")
- {category_path}: Full path (e.g., "luftwaffe/fighters")
- {album_title}: Album name (e.g., "bf-109-variants")
- {index}: Sequential number (001, 002, ...)
- {original_filename}: Original file name
- {date}: Download date (YYYY-MM-DD)

All names are automatically slugified (lowercase, hyphens, safe chars)
```

### Dry Run

**Purpose:** Preview download plan without actually downloading files

**Action:**
```
User clicks [Run Dry Run]
  ↓
Backend simulates download:
  - Resolves all image URLs
  - Calculates file paths
  - Checks for existing files
  - Estimates total size
  ↓
Shows modal with:
  - List of files to download (first 100)
  - Total count and size
  - Conflicts/duplicates warning
  - [Export List] [Close]
```

### Start Download Button

**States:**
- **Ready:** Blue primary button "Start Download"
- **Invalid:** Disabled with tooltip "Fix errors: No write permission"
- **Loading:** Spinner "Preparing..."

**Action:**
```
User clicks [Start Download]
  ↓
Backend creates download job
  ↓
Navigate to Download Monitor screen
  ↓
Download begins automatically
```

### Components

- **Settings Form:** Controlled inputs with validation
- **File Path Input:** Native or custom file picker integration
- **Code Block:** Syntax-highlighted naming rule preview
- **Modal Dialog:** Dry run results viewer

## Screen 5: Download Monitor

### Purpose
Real-time monitoring of active downloads with pause/resume/cancel controls.

### Layout

```
┌──────────────────────────────────────────────────────────┐
│  Download Monitor                        [Pause] [Cancel] │
│                                                           │
│  ┌─ Overall Progress ─────────────────────────────────┐  │
│  │  ████████████████░░░░░░░░░░░░░░░░░░ 45%            │  │
│  │                                                     │  │
│  │  618 / 1,375 images downloaded                     │  │
│  │  Speed: 2.3 MB/s  |  ETA: 12 minutes               │  │
│  │  Success: 615  |  Failed: 3  |  Skipped: 0         │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                           │
│  ┌─ Active Albums ────────────────────────────────────┐  │
│  │                                                     │  │
│  │  ▶ germany/luftwaffe/transport-aircraft            │  │
│  │    ██████████████████████░░░░░ 76% (19/25)         │  │
│  │    Currently: transport-aircraft__019__ju52.jpg    │  │
│  │                                                     │  │
│  │  ⏸ united-states/usaaf/b-17-bomber                 │  │
│  │    ████░░░░░░░░░░░░░░░░░░░░░░ 12% (2/17)          │  │
│  │    Paused                                           │  │
│  │                                                     │  │
│  │  ✓ united-kingdom/raf/spitfire                     │  │
│  │    ████████████████████████████ 100% (18/18)       │  │
│  │    Completed 3 minutes ago                         │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                           │
│  ┌─ Live Log ─────────────────────────────────────────┐  │
│  │  [INFO] Downloading: ju52-cockpit-view.jpg         │  │
│  │  [SUCCESS] Saved: transport-aircraft__019__ju52... │  │
│  │  [WARN] Retry 1/5: timeout on b17-formation.jpg    │  │
│  │  [ERROR] Failed: spitfire-damaged.jpg (404)        │  │
│  │  [INFO] Album completed: spitfire (18/18)          │  │
│  │                                        [Export Log] │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                           │
│  ┌─ Errors (3) ───────────────────────────────────────┐  │
│  │  ⚠️ 404 Not Found: spitfire-damaged.jpg            │  │
│  │  ⚠️ Timeout: b17-formation.jpg (retrying...)       │  │
│  │  ⚠️ Network: p51-mustang.jpg (retry 3/5)           │  │
│  │                                     [Retry Failed]  │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                           │
│                            [← Back]  [View Downloads]     │
└──────────────────────────────────────────────────────────┘
```

### Overall Progress Section

**Displays:**
- **Progress Bar:** Animated, shows percentage
- **Counts:** Downloaded / Total images
- **Speed:** Current download speed in MB/s
- **ETA:** Estimated time remaining
- **Stats:** Success, Failed, Skipped counts

**Updates:** Real-time via SSE (Server-Sent Events)

### Active Albums List

**Each album shows:**
- **Status Icon:**
  - ▶ Downloading (animated)
  - ⏸ Paused
  - ✓ Completed (green)
  - ✗ Failed (red)
- **Album Path:** Slugified category path
- **Progress Bar:** Per-album completion
- **Current File:** What's downloading now
- **Timestamp:** Completion time for finished albums

**Interaction:**
- Click album to expand/collapse details
- Right-click for context menu: Pause, Retry, Skip

### Live Log Component

**Features:**
- **Auto-scroll:** Sticks to bottom as new entries arrive
- **Color-coded:** INFO (gray), SUCCESS (green), WARN (amber), ERROR (red)
- **Timestamp:** Optional toggle to show timestamps
- **Search:** Filter log by keyword
- **Export:** Download log as .txt file

**Log Levels:**
```
[INFO]    Starting download: album-name
[SUCCESS] Downloaded: filename.jpg (245 KB)
[WARN]    Rate limit detected, slowing down...
[ERROR]   Failed: filename.jpg (403 Forbidden)
```

### Errors Section

**Expandable list of errors:**
- **Error Type:** 404, Timeout, Network, Permission
- **File Name:** Affected file
- **Status:** "Retrying...", "Failed", "Retry 3/5"
- **Action Button:** [Retry Failed] to retry all failed downloads

### Control Buttons

**Pause:**
```
State: Downloading
Click [Pause]
  ↓
Backend pauses all active workers
  ↓
Button changes to [Resume]
```

**Resume:**
```
State: Paused
Click [Resume]
  ↓
Backend resumes from last checkpoint
  ↓
Button changes to [Pause]
```

**Cancel:**
```
Click [Cancel]
  ↓
Confirmation dialog: "Are you sure? Progress will be saved."
  ↓
Backend stops all workers gracefully
  ↓
Navigate to summary screen
```

### View Downloads Button

**Action:**
```
Click [View Downloads]
  ↓
Opens system file browser at download directory
```

### Real-Time Updates (SSE)

**Event Stream:**
```typescript
Event: progress
Data: { total: 1375, completed: 618, failed: 3, speed: 2.3 }

Event: album_progress
Data: { albumId: 42, completed: 19, total: 25, current: "ju52.jpg" }

Event: log
Data: { level: "info", message: "Downloading: ju52.jpg" }

Event: error
Data: { file: "spitfire.jpg", error: "404 Not Found", retryCount: 0 }

Event: complete
Data: { totalDownloaded: 1372, totalFailed: 3, duration: 720 }
```

### Components

- **Progress Bar:** Animated linear progress with gradient
- **Album List:** Virtualized list for performance (react-virtual)
- **Log Viewer:** Virtual scrolling for 10,000+ lines
- **Error List:** Collapsible accordion
- **Control Panel:** Fixed footer with action buttons

## Post-Download Summary Screen

### Purpose
Show final results and download manifest.

### Layout

```
┌──────────────────────────────────────────────────────────┐
│  Download Complete ✓                                      │
│                                                           │
│  ┌─ Summary ──────────────────────────────────────────┐  │
│  │                                                     │  │
│  │  Total Images: 1,375                               │  │
│  │  ✓ Downloaded: 1,372 (99.8%)                       │  │
│  │  ✗ Failed: 3 (0.2%)                                │  │
│  │                                                     │  │
│  │  Total Size: 2.47 GB                               │  │
│  │  Duration: 18 minutes 42 seconds                   │  │
│  │  Average Speed: 2.2 MB/s                           │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                           │
│  ┌─ Files Saved To ────────────────────────────────────┐ │
│  │  /Users/researcher/Downloads/ww2-photos/            │ │
│  │                                                     │  │
│  │  ├── germany/                                       │  │
│  │  │   └── luftwaffe/                                │  │
│  │  │       └── transport-aircraft/ (25 files)        │  │
│  │  ├── united-states/                                │  │
│  │  │   └── usaaf/                                    │  │
│  │  │       └── b-17-bomber/ (17 files)               │  │
│  │  └── united-kingdom/                               │  │
│  │      └── raf/                                      │  │
│  │          └── spitfire/ (18 files)                  │  │
│  │                                                     │  │
│  │  [Open Folder]                                      │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                           │
│  ┌─ Manifest ─────────────────────────────────────────┐  │
│  │  manifest.json created with 1,372 entries           │  │
│  │  Contains: source URLs, local paths, timestamps    │  │
│  │                                                     │  │
│  │  [View Manifest]  [Export Report]                  │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                           │
│  ┌─ Failed Downloads ─────────────────────────────────┐  │
│  │  3 files failed:                                    │  │
│  │  • spitfire-damaged.jpg (404 Not Found)             │  │
│  │  • b17-formation.jpg (Timeout)                      │  │
│  │  • p51-mustang.jpg (Network Error)                  │  │
│  │                                                     │  │
│  │  [Retry Failed]  [Export List]                     │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                           │
│  [Start New Download]  [← Back to Categories]            │
└──────────────────────────────────────────────────────────┘
```

### Components

- **Success Badge:** Large checkmark with success color
- **Stats Cards:** Grid of metric cards
- **File Tree:** Collapsible directory structure preview
- **Manifest Viewer:** Modal with JSON preview
- **Export Options:** PDF, CSV, JSON reports

## Responsive Design

### Desktop (≥1024px)
- Two-column layouts for tree view + details
- Side-by-side progress bars
- Full-featured log viewer

### Tablet (768px-1023px)
- Single column with tabs for tree/details
- Stacked progress sections
- Collapsible log viewer

### Mobile (Not Recommended)
- Show warning: "Desktop recommended for optimal experience"
- Basic monitoring view only
- No complex tree navigation

## Accessibility

- **Keyboard Navigation:** Full support for tab/arrow keys
- **Screen Readers:** ARIA labels on all interactive elements
- **Focus Indicators:** High-contrast focus rings
- **Color Contrast:** WCAG AA compliant
- **Loading States:** Clear loading indicators, no sudden changes

## Performance Optimizations

- **Virtual Scrolling:** For large category trees and logs
- **Debounced Search:** 300ms delay on search input
- **SSE Throttling:** Batch progress updates (max 10/second)
- **Lazy Loading:** Images in preview dialogs
- **Code Splitting:** Route-based chunks

## Error States

### Session Expired
```
┌─────────────────────────────────────────┐
│  ⚠️  Session Expired                    │
│                                          │
│  Your session is no longer valid.        │
│  Please return to Session Setup.         │
│                                          │
│  [Go to Session Setup]                   │
└─────────────────────────────────────────┘
```

### Network Error
```
┌─────────────────────────────────────────┐
│  ⚠️  Connection Lost                     │
│                                          │
│  Unable to reach backend server.         │
│  Check that the server is running.       │
│                                          │
│  [Retry]  [Check Status]                 │
└─────────────────────────────────────────┘
```

### Disk Full
```
┌─────────────────────────────────────────┐
│  ⚠️  Insufficient Storage                │
│                                          │
│  Not enough disk space to continue.      │
│  Free up space and try again.            │
│                                          │
│  Required: 2.5 GB                        │
│  Available: 847 MB                       │
│                                          │
│  [Change Directory]  [Cancel]            │
└─────────────────────────────────────────┘
```

## Next Steps

See implementation details:
- `CODE_EXAMPLES.md` - Component implementations
- `BACKEND_DESIGN.md` - API endpoints and data flow
