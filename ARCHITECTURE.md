# World War Photos Archiver - System Architecture

## Overview

A production-grade local application for browsing and downloading images from worldwarphotos.info, designed for historians and researchers. The system respects copyright, robots.txt, and site terms while providing a reliable, resumable download experience.

## Legal & Ethical Framework

**CRITICAL CONSTRAINTS:**
- Personal archival and research use only
- Respects robots.txt and site terms of service
- No anti-bot bypass or fingerprint spoofing
- Requires legitimate browser sessions (Playwright persistent context or user cookies)
- Clear UI disclaimer about copyright and proper use
- Fails gracefully when access is denied

## System Architecture

### Technology Stack

**Frontend:**
- **Framework:** Next.js 15 (App Router) - Leverages existing codebase
- **UI Library:** React 18 + TailwindCSS + DaisyUI
- **State Management:** React Context + SWR for server state
- **Components:** Radix UI primitives for tree view, dialogs, progress
- **Real-time Updates:** Server-Sent Events (SSE) for download progress

**Backend:**
- **Runtime:** Node.js 18+
- **Framework:** Fastify (lightweight, fast, TypeScript-friendly)
- **Browser Automation:** Playwright with persistent context
- **Database:** Better-SQLite3 (embedded, no server needed)
- **File System:** Native Node.js streams for memory-efficient downloads
- **Job Queue:** Bull or custom queue with SQLite persistence

**Optional Desktop Wrapper:**
- **Electron:** For standalone desktop application
- **Electron Builder:** For cross-platform packaging

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        User Interface                        │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────┐│
│  │  Session   │→│  Category  │→│  Download  │→│Monitor ││
│  │   Setup    │  │  Browser   │  │  Planner   │  │ Screen ││
│  └────────────┘  └────────────┘  └────────────┘  └────────┘│
│                         ↓↑ HTTP/SSE                          │
└─────────────────────────────────────────────────────────────┘
                          ↓↑
┌─────────────────────────────────────────────────────────────┐
│                      Backend API Layer                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Session  │  │ Category │  │ Download │  │  Status  │   │
│  │   API    │  │   API    │  │   API    │  │   SSE    │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                          ↓↑
┌─────────────────────────────────────────────────────────────┐
│                     Core Services Layer                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Session    │  │   Discovery  │  │   Download   │     │
│  │   Manager    │  │   Crawler    │  │   Engine     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│         ↓                 ↓                    ↓            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Playwright Browser Manager              │  │
│  │    (Persistent Context + Cookie Management)          │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                          ↓↑
┌─────────────────────────────────────────────────────────────┐
│                     Data & Storage Layer                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   SQLite     │  │   File       │  │   Config     │     │
│  │   Database   │  │   System     │  │   Manager    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

## Folder Structure

```
world-war-photos-archiver/
├── frontend/                    # Next.js application
│   ├── app/
│   │   ├── page.tsx            # Home/disclaimer
│   │   ├── session/
│   │   │   └── page.tsx        # Session setup screen
│   │   ├── categories/
│   │   │   └── page.tsx        # Category browser screen
│   │   ├── planner/
│   │   │   └── page.tsx        # Download planner screen
│   │   └── monitor/
│   │       └── page.tsx        # Download monitor screen
│   ├── components/
│   │   ├── CategoryTree.tsx
│   │   ├── DownloadProgress.tsx
│   │   ├── SessionSetup.tsx
│   │   └── LogViewer.tsx
│   ├── lib/
│   │   ├── api-client.ts       # Backend API wrapper
│   │   └── sse-client.ts       # SSE event handling
│   └── package.json
│
├── backend/                     # Node.js backend
│   ├── src/
│   │   ├── server.ts           # Fastify server setup
│   │   ├── routes/
│   │   │   ├── session.ts      # Session management routes
│   │   │   ├── categories.ts   # Category discovery routes
│   │   │   ├── downloads.ts    # Download management routes
│   │   │   └── status.ts       # SSE status stream
│   │   ├── services/
│   │   │   ├── SessionManager.ts
│   │   │   ├── DiscoveryCrawler.ts
│   │   │   ├── DownloadEngine.ts
│   │   │   ├── PlaywrightManager.ts
│   │   │   └── StateManager.ts
│   │   ├── models/
│   │   │   ├── Category.ts
│   │   │   ├── Album.ts
│   │   │   └── Download.ts
│   │   ├── database/
│   │   │   ├── schema.sql
│   │   │   └── database.ts
│   │   └── utils/
│   │       ├── file-utils.ts
│   │       ├── retry.ts
│   │       └── slugify.ts
│   └── package.json
│
├── shared/                      # Shared types and constants
│   ├── types.ts                # TypeScript interfaces
│   └── constants.ts            # Shared constants
│
├── electron/                    # Optional Electron wrapper
│   ├── main.js                 # Electron main process
│   ├── preload.js             # Preload script
│   └── package.json
│
├── downloads/                   # Default download directory
│   └── .gitkeep
│
├── data/                       # SQLite database and state
│   ├── app.db                 # Main database
│   └── logs/                  # Application logs
│
├── docs/                       # Documentation
│   ├── API.md                 # Backend API documentation
│   └── EXAMPLES.md            # Usage examples
│
├── package.json               # Root workspace config
├── README.md                  # Main documentation
└── .env.example              # Environment variables template
```

## Data Models

### SQLite Schema

```sql
-- Session management
CREATE TABLE sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_type TEXT NOT NULL, -- 'playwright' | 'cookie'
  session_data TEXT, -- JSON: cookies, storage state
  is_active BOOLEAN DEFAULT 1,
  last_verified_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Category hierarchy
CREATE TABLE categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  parent_id INTEGER,
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  level INTEGER, -- 0=root, 1=nation/topic, 2=subcategory
  estimated_count INTEGER DEFAULT 0,
  discovered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES categories(id)
);

-- Albums (final image containers)
CREATE TABLE albums (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id INTEGER NOT NULL,
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  image_count INTEGER DEFAULT 0,
  parsed BOOLEAN DEFAULT 0,
  parsed_at DATETIME,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Images to download
CREATE TABLE images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  album_id INTEGER NOT NULL,
  url TEXT NOT NULL UNIQUE,
  original_filename TEXT,
  local_path TEXT,
  file_size INTEGER,
  download_status TEXT DEFAULT 'pending', -- 'pending' | 'downloading' | 'completed' | 'failed'
  retry_count INTEGER DEFAULT 0,
  error_message TEXT,
  downloaded_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (album_id) REFERENCES albums(id)
);

-- Download jobs (user selections)
CREATE TABLE download_jobs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  config TEXT NOT NULL, -- JSON: concurrency, delays, retry settings
  status TEXT DEFAULT 'created', -- 'created' | 'running' | 'paused' | 'completed' | 'failed'
  progress REAL DEFAULT 0, -- 0-100
  started_at DATETIME,
  completed_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Job items (selected albums)
CREATE TABLE job_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  job_id INTEGER NOT NULL,
  album_id INTEGER NOT NULL,
  status TEXT DEFAULT 'pending',
  FOREIGN KEY (job_id) REFERENCES download_jobs(id),
  FOREIGN KEY (album_id) REFERENCES albums(id)
);

-- Download manifest (audit trail)
CREATE TABLE manifests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  image_id INTEGER NOT NULL,
  source_url TEXT NOT NULL,
  local_path TEXT NOT NULL,
  file_hash TEXT, -- SHA256 for verification
  downloaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (image_id) REFERENCES images(id)
);
```

## Core Components

### 1. Session Manager

**Responsibilities:**
- Manage Playwright persistent browser context
- Handle cookie import/export
- Verify session validity
- Detect and handle session expiration

**Key Features:**
- Persistent browser profile stored locally
- Session validation endpoint
- Auto-detection of verification pages
- Clear error messages for access failures

### 2. Discovery Crawler

**Responsibilities:**
- Navigate category hierarchy
- Extract album links
- Parse image URLs from album pages
- Handle pagination

**Key Features:**
- Breadth-first traversal
- Deduplication of URLs
- Progress tracking
- Graceful error handling

### 3. Download Engine

**Responsibilities:**
- Queue management
- Concurrent downloads with limits
- Stream-based file writing
- Retry logic with exponential backoff
- Progress reporting

**Key Features:**
- Memory-efficient streaming
- Configurable concurrency (1-5)
- Rate limiting with jitter
- Resume capability
- Atomic file writes

### 4. State Manager

**Responsibilities:**
- SQLite database operations
- Transaction management
- State persistence
- Recovery after crashes

**Key Features:**
- ACID transactions
- Idempotent operations
- Migration support
- Backup/restore

## Communication Flow

### 1. Session Setup Flow

```
User → Frontend → POST /api/session/create
                 ← Session ID
User → Opens persistent browser manually
User → Completes verification/login
User → Frontend → POST /api/session/verify
                 ← Success/Failure + Details
```

### 2. Category Discovery Flow

```
User → Frontend → POST /api/categories/discover
Backend → Playwright → Navigate category pages
Backend → Parse HTML → Extract links
Backend → SQLite → Store hierarchy
Backend → SSE → Progress updates
Frontend ← SSE ← Real-time status
```

### 3. Download Flow

```
User → Frontend → POST /api/downloads/start
Backend → SQLite → Create download job
Backend → Queue → Add albums to queue
Backend → Download Engine → Start workers
Backend → Playwright → Fetch images with session
Backend → File System → Stream to disk
Backend → SQLite → Update progress
Backend → SSE → Status updates
Frontend ← SSE ← Real-time progress
```

## Error Handling Strategy

### Session Errors
- **Expired Session:** Stop downloads, notify user, request re-verification
- **403 Forbidden:** Check robots.txt, inform user, don't retry
- **Verification Page Detected:** Pause, notify user to update session

### Download Errors
- **429 Rate Limit:** Auto slow down, exponential backoff (5s, 10s, 20s)
- **Network Timeout:** Retry with exponential backoff (max 5 retries)
- **Disk Full:** Stop all downloads, clear error message
- **File Write Error:** Retry with temp directory, escalate if persistent

### Discovery Errors
- **Page Structure Changed:** Log warning, continue with available data
- **Pagination Error:** Complete current page, mark as partially discovered
- **Network Errors:** Retry entire category after delay

## Performance Considerations

### Memory Management
- Stream downloads to disk (never buffer full images in memory)
- Limit concurrent Playwright pages (max 2)
- Use SQLite WAL mode for concurrent reads/writes
- Implement cursor-based pagination for large result sets

### Rate Limiting
- Default: 1 request per second + random jitter (0-500ms)
- Adaptive: Slow down on 429 responses
- User-configurable delay range (500ms - 5s)

### Scalability
- Support 10,000+ albums
- Handle 100,000+ images per session
- Resume after days/weeks of downtime
- Efficient database queries with proper indexes

## Security Considerations

### User Data
- Store browser sessions locally only
- Encrypt session data at rest (optional)
- Never log sensitive cookies
- Clear instructions for session isolation

### File System
- Validate and sanitize all filenames
- Prevent directory traversal attacks
- Check available disk space before downloads
- Verify file integrity with hashes (optional)

### Network
- Use HTTPS exclusively
- Validate SSL certificates
- No direct shell command execution
- Sanitize all user inputs

## Monitoring & Observability

### Logging
- **Levels:** DEBUG, INFO, WARN, ERROR
- **Format:** Structured JSON logs
- **Rotation:** Daily rotation, 30-day retention
- **Destinations:** Console + file system

### Metrics
- Categories discovered count
- Albums parsed count
- Images downloaded count
- Success rate percentage
- Average download speed
- Error counts by type

### Status Reporting
- Real-time progress via SSE
- Download speed (MB/s)
- ETA calculation
- Error summary
- Resource usage (disk space)

## Future Extensibility

### Plugin System
- Custom naming rules
- Post-download image processing
- Alternative storage backends
- Custom metadata extraction

### Multi-Site Support
- Abstract site-specific parsers
- Configurable site profiles
- Shared download engine
- Unified UI

### Cloud Backup
- Optional cloud sync
- Manifest upload to S3/Blob storage
- Distributed download coordination

## Next Steps

See implementation guides:
- `UI_DESIGN.md` - Frontend screens and components
- `BACKEND_DESIGN.md` - Backend services and APIs
- `CODE_EXAMPLES.md` - Key code snippets
- `IMPLEMENTATION_README.md` - Build and run instructions
