# World War Photos Archiver - Complete Design Summary

## 📋 Project Overview

A production-grade local application for browsing and downloading images from worldwarphotos.info. Designed for historians and researchers with emphasis on legal compliance, reliability, and user trust.

## 🎯 Key Principles

1. **Legal & Ethical First** - Respects copyright, robots.txt, and site terms
2. **Transparency** - Shows exactly what will be done before doing it
3. **Reliability** - Resume support, retry logic, state persistence
4. **User Trust** - Clear disclaimers, no hidden operations
5. **Production Quality** - Enterprise-grade architecture and error handling

## 📚 Documentation Structure

This design is split across 6 comprehensive documents:

### 1. ARCHITECTURE.md
**What:** System architecture, technology stack, and data models

**Key Sections:**
- Technology choices (Next.js, Fastify, Playwright, SQLite)
- System architecture diagram
- Folder structure (frontend/backend/shared)
- SQLite database schema (7 tables)
- Service layer components (SessionManager, DiscoveryCrawler, DownloadEngine)
- Error handling strategy
- Performance considerations
- Security guidelines

**Read this first** to understand the overall system design.

---

### 2. UI_DESIGN.md
**What:** Complete UI/UX design for all application screens

**Key Sections:**
- Design principles and visual language
- Application shell and navigation
- 5 main screens:
  1. Home & Legal Disclaimer
  2. Session Setup (Playwright browser vs Cookie import)
  3. Category Browser (tree view, search, filter)
  4. Download Planner (settings, naming rules, dry run)
  5. Download Monitor (real-time progress, logs, controls)
- Component specifications
- Responsive design guidelines
- Accessibility features
- Error states and loading indicators

**Read this** to understand the user experience flow.

---

### 3. BACKEND_DESIGN.md
**What:** Backend services, APIs, and scraping logic

**Key Sections:**
- 20+ REST API endpoints (session, categories, downloads, status)
- Server-Sent Events (SSE) for real-time updates
- Service layer implementations:
  - SessionManager (Playwright persistent context)
  - DiscoveryCrawler (BFS category traversal)
  - DownloadEngine (concurrent workers with retry)
- HTML parsing strategies (multiple selector patterns)
- Pagination handling
- Rate limiting with adaptive backoff
- Database operations and transactions
- Error handling (session expired, rate limits, network errors)

**Read this** to implement the backend services.

---

### 4. CODE_EXAMPLES.md
**What:** Production-ready code snippets for all core features

**Key Sections:**
- Playwright session management (launch, save, verify)
- Category discovery crawler (HTML parsing, pagination)
- Image download with streaming (memory-efficient)
- Retry logic with exponential backoff
- React UI components:
  - CategoryTree (hierarchical checkbox tree)
  - DownloadProgress (real-time stats)
  - LogViewer (SSE-based live logs)
- Server-Sent Events implementation
- SQLite database operations
- Utility functions (slugify, disk space, rate limiter)
- Complete download orchestration example

**Copy-paste ready** TypeScript/React code for implementation.

---

### 5. IMPLEMENTATION_README.md
**What:** Step-by-step setup and running instructions

**Key Sections:**
- Prerequisites and system requirements
- 15-step setup process:
  - Root workspace initialization
  - Backend setup (Fastify, Playwright, SQLite)
  - Frontend setup (Next.js, TailwindCSS, DaisyUI)
  - Shared types package
  - Environment configuration
- First-time usage guide
- Production build instructions
- Optional Electron desktop wrapper
- Troubleshooting common issues
- Configuration tips (download settings, naming rules)
- Database maintenance
- Performance tuning
- Security checklist

**Follow this** to build and run the application.

---

### 6. EXAMPLE_OUTPUT.md
**What:** What the downloaded files and folders look like

**Key Sections:**
- Example directory tree structure
- Manifest.json format
- File naming details and slugification rules
- Alternative naming patterns
- Statistics example
- Disk space considerations
- File integrity verification
- Metadata preservation
- Backup recommendations
- Command-line usage examples

**Reference this** to understand output organization.

---

## 🏗️ Technology Stack Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | Next.js 15 + React 18 | UI framework |
| Styling | TailwindCSS + DaisyUI | Component library |
| Backend | Fastify 4 | HTTP server |
| Browser | Playwright | Session + scraping |
| Database | Better-SQLite3 | State persistence |
| Real-time | Server-Sent Events | Progress updates |
| Desktop (optional) | Electron | Standalone app |

## 📊 Project Structure

```
world-war-photos-archiver/
├── frontend/              # Next.js React app
│   ├── app/              # Pages (session, categories, planner, monitor)
│   ├── components/       # Reusable UI components
│   └── lib/              # API client, hooks
│
├── backend/              # Fastify server
│   ├── src/
│   │   ├── routes/      # API endpoints
│   │   ├── services/    # Business logic
│   │   ├── database/    # SQLite schema & queries
│   │   └── utils/       # Helper functions
│   └── data/            # SQLite DB, sessions, logs
│
├── shared/               # TypeScript types
│   └── src/types.ts
│
├── electron/             # Desktop wrapper (optional)
│   └── main.js
│
├── downloads/            # Downloaded images
│
└── docs/                 # This documentation
```

## 🔄 Application Flow

### Session Setup
```
User launches browser → Completes verification → Saves session → Ready
```

### Category Discovery
```
User clicks "Discover" → Backend crawls site → Stores hierarchy → Shows tree
```

### Download Planning
```
User selects albums → Configures settings → Runs dry run → Starts download
```

### Download Execution
```
Backend creates job → Workers fetch images → Stream to disk → Update progress via SSE
```

## 🔑 Core Features

### Session Management
- **Playwright Persistent Context** - Real browser with cookies
- **Cookie Import** - Advanced option for manual setup
- **Verification** - Tests session before downloads
- **Expiration Detection** - Stops gracefully when session expires

### Category Discovery
- **Recursive Crawl** - BFS traversal of category hierarchy
- **Multiple Selectors** - Handles various HTML patterns
- **Pagination** - Auto-detects and follows page links
- **Progress Updates** - Real-time SSE events
- **Error Resilience** - Continues on page failures

### Download Engine
- **Concurrent Workers** - 1-5 parallel downloads
- **Stream to Disk** - No memory buffering
- **Exponential Backoff** - Retry failed downloads (2s, 4s, 8s, 16s, 32s)
- **Rate Limiting** - Configurable delays + jitter
- **Adaptive Throttling** - Slows down on 429 responses
- **Atomic Writes** - Temp file + rename (no partial files)
- **Resume Support** - Continue after restart
- **Manifest Generation** - Audit trail with checksums

### UI Features
- **Tree View** - Hierarchical category browser with checkboxes
- **Search & Filter** - Find specific categories/albums
- **Dry Run** - Preview downloads without fetching
- **Real-time Progress** - SSE-powered live updates
- **Live Logs** - Color-coded event stream
- **Pause/Resume/Cancel** - Full download control
- **Error List** - Track failed downloads with retry

## 📏 Naming & Organization

### Default Naming Rules

**Folder:**
```
{nation}/{category_path}/{album_title}/
```

**File:**
```
{album_title}__{index}__{original_filename}
```

**Example:**
```
downloads/
└── germany/
    └── luftwaffe/
        └── transport-aircraft/
            └── transport-aircraft__001__ju52-cockpit-view.jpg
```

### Slugification

All names are filesystem-safe:
- Lowercase
- Hyphens instead of spaces
- No special characters
- Max 100 characters

## 🚀 Quick Start

```bash
# 1. Clone and setup
git clone <repo>
cd world-war-photos-archiver
npm install

# 2. Setup backend
cd backend
npm install
npx playwright install chromium

# 3. Setup frontend
cd ../frontend
npm install

# 4. Start development
cd ..
npm run dev

# 5. Open browser
open http://localhost:3000
```

## 🔒 Legal & Ethical Guidelines

**DO:**
- ✅ Use for personal archival and research
- ✅ Check robots.txt
- ✅ Use reasonable rate limits
- ✅ Respect copyright notices
- ✅ Obtain proper permissions if required

**DON'T:**
- ❌ Bypass anti-bot systems by hacking
- ❌ Use for commercial purposes without permission
- ❌ Redistribute downloaded content illegally
- ❌ Overwhelm the source website with requests
- ❌ Circumvent access controls

## 🎨 Design Highlights

### User Experience
- **Wizard-style flow** - Clear steps from session to download
- **Progress transparency** - Always show what's happening
- **Graceful errors** - Clear messages, suggested actions
- **No surprises** - Dry run before actual downloads

### Technical Excellence
- **Memory efficient** - Streaming downloads
- **Resumable** - Persistent state in SQLite
- **Concurrent** - Parallel downloads with limits
- **Adaptive** - Adjusts to rate limits automatically
- **Type-safe** - Full TypeScript coverage
- **Production-ready** - Proper error handling, logging, monitoring

## 📦 Deliverables

This design package includes:

1. ✅ Complete architecture specification
2. ✅ Detailed UI mockups and flows
3. ✅ Backend API documentation
4. ✅ Production-ready code examples
5. ✅ Step-by-step implementation guide
6. ✅ Example outputs and usage patterns

## 🛠️ Implementation Checklist

### Phase 1: Foundation (Week 1)
- [ ] Setup project structure (frontend/backend/shared)
- [ ] Initialize SQLite database with schema
- [ ] Implement Playwright session management
- [ ] Create basic Fastify server
- [ ] Build Next.js app shell

### Phase 2: Core Features (Week 2-3)
- [ ] Session setup UI and API
- [ ] Category discovery crawler
- [ ] Category tree UI component
- [ ] Download planner UI
- [ ] Basic download engine

### Phase 3: Polish (Week 4)
- [ ] Real-time progress with SSE
- [ ] Error handling and retry logic
- [ ] Pause/resume functionality
- [ ] Manifest generation
- [ ] UI polish and animations

### Phase 4: Testing & Documentation (Week 5)
- [ ] Unit tests for services
- [ ] Integration tests for download flow
- [ ] User documentation
- [ ] Performance testing
- [ ] Security audit

## 📈 Success Metrics

**Technical:**
- Resume works after restart
- Downloads succeed >99% of the time
- Memory usage <500MB during downloads
- No data loss on crashes
- Session persists across restarts

**User Experience:**
- Setup time <5 minutes
- Error messages are clear and actionable
- Progress updates are real-time
- UI is responsive even during heavy downloads

**Legal & Ethical:**
- Respects robots.txt
- Rate limits are reasonable
- Users acknowledge legal disclaimer
- No bypassing of protections

## 🤝 Contributing

If implementing this design:

1. **Follow the architecture** in ARCHITECTURE.md
2. **Use the code examples** in CODE_EXAMPLES.md
3. **Match the UI designs** in UI_DESIGN.md
4. **Test thoroughly** before release
5. **Document changes** clearly

## 📞 Support

**For Implementation Questions:**
- Read IMPLEMENTATION_README.md first
- Check CODE_EXAMPLES.md for snippets
- Review BACKEND_DESIGN.md for API details

**For Design Questions:**
- Refer to ARCHITECTURE.md for system design
- Check UI_DESIGN.md for UX flows

**For Usage Questions:**
- See IMPLEMENTATION_README.md for setup
- Check EXAMPLE_OUTPUT.md for output format

## 🎓 Learning Resources

**Technologies Used:**
- [Playwright Docs](https://playwright.dev) - Browser automation
- [Fastify Docs](https://www.fastify.io) - Backend framework
- [Next.js Docs](https://nextjs.org/docs) - Frontend framework
- [Better-SQLite3](https://github.com/WiseLibs/better-sqlite3) - Database
- [TailwindCSS](https://tailwindcss.com) - Styling
- [DaisyUI](https://daisyui.com) - Component library

**Design Patterns:**
- Service layer pattern
- Repository pattern
- Observer pattern (SSE)
- Worker pool pattern
- State machine (download jobs)

## 🏆 Best Practices Implemented

### Code Quality
- Full TypeScript typing
- ESLint + Prettier
- Structured logging with Pino
- Error boundaries in React
- Input validation with Zod

### Performance
- Virtual scrolling for large lists
- Debounced search
- SSE throttling
- Database indexing
- Connection pooling

### Security
- Input sanitization
- Path traversal prevention
- CORS configuration
- Rate limiting
- Secure cookie handling

### Reliability
- Exponential backoff
- Circuit breaker pattern
- Database transactions
- Atomic file writes
- Graceful shutdown

## 📜 License

This is a design document for educational and personal use.

The final implementation should respect:
- Source website terms of service
- Copyright laws
- Robots.txt directives
- Fair use principles

**Use responsibly and ethically.**

---

## 🎯 Final Note

This design represents a **professional, production-ready architecture** for a local image archiving tool. It prioritizes:

1. **User trust** through transparency
2. **Legal compliance** through respect for site policies
3. **Reliability** through robust error handling
4. **Performance** through efficient streaming and concurrency
5. **Maintainability** through clean architecture

The complete documentation provides everything needed to implement this system from scratch or adapt it to similar use cases.

**Good luck with implementation!** 🚀

---

**Document Version:** 1.0
**Last Updated:** 2024-12-29
**Status:** Complete Design
**Ready for Implementation:** ✅
