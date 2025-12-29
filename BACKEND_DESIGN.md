# World War Photos Archiver - Backend Design

## Overview

The backend is a Node.js application built with Fastify, providing REST APIs and Server-Sent Events (SSE) for the frontend. It orchestrates browser automation via Playwright, manages downloads, and persists state in SQLite.

## Technology Stack

- **Runtime:** Node.js 18+ (ESM modules)
- **Framework:** Fastify 4.x (high performance, TypeScript-friendly)
- **Browser Automation:** Playwright 1.40+ (Chromium)
- **Database:** Better-SQLite3 (synchronous, embedded)
- **HTTP Client:** Native fetch API or Playwright requests
- **Validation:** Zod for schema validation
- **Logging:** Pino (structured JSON logs)

## Architecture Layers

```
┌─────────────────────────────────────────────────────────┐
│                      HTTP/SSE Layer                      │
│  (Fastify Routes: REST APIs + Server-Sent Events)       │
└─────────────────────────────────────────────────────────┘
                          ↓↑
┌─────────────────────────────────────────────────────────┐
│                    Service Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Session    │  │   Discovery  │  │   Download   │  │
│  │   Manager    │  │   Crawler    │  │   Engine     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↓↑
┌─────────────────────────────────────────────────────────┐
│                 Infrastructure Layer                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Playwright  │  │   SQLite     │  │     File     │  │
│  │   Manager    │  │   Database   │  │    System    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## API Endpoints

### Session Management

#### POST /api/session/launch-browser
Launch Playwright browser for manual session setup.

**Request:**
```json
{}
```

**Response:**
```json
{
  "sessionId": "sess_abc123",
  "status": "browser_launched",
  "message": "Complete verification in browser, then call /save-session"
}
```

**Process:**
1. Start Playwright with persistent context
2. Navigate to worldwarphotos.info
3. Store browser instance in memory map
4. Return session ID

---

#### POST /api/session/save-session
Save browser state after manual verification.

**Request:**
```json
{
  "sessionId": "sess_abc123"
}
```

**Response:**
```json
{
  "sessionId": "sess_abc123",
  "status": "saved",
  "sessionType": "playwright",
  "expiresAt": "2024-12-30T12:00:00Z"
}
```

**Process:**
1. Get browser context from session map
2. Save storage state to disk (cookies, localStorage)
3. Close browser
4. Store session metadata in SQLite
5. Return success

---

#### POST /api/session/import-cookies
Import cookies from user's browser.

**Request:**
```json
{
  "cookies": [
    {
      "name": "session_token",
      "value": "xyz789",
      "domain": ".worldwarphotos.info"
    }
  ]
}
```

**Response:**
```json
{
  "sessionId": "sess_def456",
  "status": "verified",
  "message": "Cookies imported and verified"
}
```

**Process:**
1. Validate cookie format
2. Create new Playwright context with cookies
3. Make test request to verify access
4. Save cookies to SQLite
5. Return session ID

---

#### GET /api/session/verify
Verify current session is still valid.

**Request:**
```
GET /api/session/verify
```

**Response:**
```json
{
  "valid": true,
  "sessionType": "playwright",
  "lastVerified": "2024-12-29T10:30:00Z",
  "testUrl": "https://www.worldwarphotos.info/germany/luftwaffe/",
  "statusCode": 200
}
```

**Process:**
1. Load session from SQLite
2. Create Playwright context with stored state
3. Navigate to test category page
4. Check response status (200 = valid, 403/429 = invalid)
5. Update last_verified_at timestamp
6. Return validation result

---

#### DELETE /api/session/clear
Clear current session.

**Request:**
```
DELETE /api/session/clear
```

**Response:**
```json
{
  "success": true,
  "message": "Session cleared"
}
```

---

### Category Discovery

#### POST /api/categories/discover
Start discovering category hierarchy.

**Request:**
```json
{
  "startUrls": [
    "https://www.worldwarphotos.info/germany/",
    "https://www.worldwarphotos.info/united-states/"
  ]
}
```

**Response:**
```json
{
  "jobId": "discovery_xyz123",
  "status": "started",
  "message": "Discovery started. Monitor progress via SSE."
}
```

**Process:**
1. Create discovery job in SQLite
2. Start async crawling process
3. Return job ID for SSE subscription
4. Emit progress events during crawl

---

#### GET /api/categories/tree
Get discovered category tree.

**Request:**
```
GET /api/categories/tree?parentId=0&maxDepth=3
```

**Response:**
```json
{
  "categories": [
    {
      "id": 1,
      "parentId": null,
      "slug": "germany",
      "name": "Germany",
      "url": "https://www.worldwarphotos.info/germany/",
      "level": 0,
      "albumCount": 342,
      "children": [
        {
          "id": 2,
          "parentId": 1,
          "slug": "luftwaffe",
          "name": "Luftwaffe",
          "url": "https://www.worldwarphotos.info/germany/luftwaffe/",
          "level": 1,
          "albumCount": 87,
          "children": []
        }
      ]
    }
  ]
}
```

---

#### GET /api/categories/search
Search categories by name.

**Request:**
```
GET /api/categories/search?q=spitfire&limit=20
```

**Response:**
```json
{
  "results": [
    {
      "id": 42,
      "name": "Spitfire",
      "path": "United Kingdom > RAF > Spitfire",
      "albumCount": 18
    }
  ],
  "total": 1
}
```

---

### Album Management

#### GET /api/albums/:albumId/images
Get images for a specific album.

**Request:**
```
GET /api/albums/42/images
```

**Response:**
```json
{
  "album": {
    "id": 42,
    "name": "Spitfire Variants",
    "url": "https://www.worldwarphotos.info/.../spitfire/"
  },
  "images": [
    {
      "id": 1001,
      "url": "https://www.worldwarphotos.info/wp-content/uploads/2024/spitfire-mk1.jpg",
      "originalFilename": "spitfire-mk1.jpg",
      "estimatedSize": 245760
    }
  ],
  "total": 18
}
```

---

### Download Management

#### POST /api/downloads/create-job
Create a new download job.

**Request:**
```json
{
  "name": "WW2 German Aircraft",
  "albumIds": [1, 2, 3, 42],
  "config": {
    "downloadDir": "/Users/researcher/Downloads/ww2-photos",
    "concurrency": 3,
    "delayMs": 1000,
    "jitterMs": 500,
    "retryAttempts": 5,
    "skipExisting": true,
    "generateManifest": true,
    "verifyChecksums": false,
    "namingRules": {
      "folderPattern": "{nation}/{category_path}/{album_title}",
      "filePattern": "{album_title}__{index}__{original_filename}"
    }
  }
}
```

**Response:**
```json
{
  "jobId": "job_abc123",
  "status": "created",
  "totalAlbums": 4,
  "estimatedImages": 127,
  "message": "Job created. Call /start to begin downloading."
}
```

**Process:**
1. Validate album IDs exist
2. Create download_jobs record
3. Create job_items for each album
4. Resolve all image URLs from albums
5. Create images records with status='pending'
6. Return job ID

---

#### POST /api/downloads/:jobId/start
Start a download job.

**Request:**
```json
{
  "jobId": "job_abc123"
}
```

**Response:**
```json
{
  "jobId": "job_abc123",
  "status": "running",
  "message": "Download started. Monitor via SSE at /api/status/stream"
}
```

**Process:**
1. Update job status to 'running'
2. Start download workers (based on concurrency setting)
3. Workers pull pending images from queue
4. Emit SSE progress events
5. Return immediately

---

#### POST /api/downloads/:jobId/pause
Pause a running download job.

**Request:**
```
POST /api/downloads/job_abc123/pause
```

**Response:**
```json
{
  "jobId": "job_abc123",
  "status": "paused",
  "progress": 45.2
}
```

**Process:**
1. Set job status to 'paused'
2. Signal workers to stop after current downloads
3. Update database with current progress
4. Return status

---

#### POST /api/downloads/:jobId/resume
Resume a paused download job.

**Request:**
```
POST /api/downloads/job_abc123/resume
```

**Response:**
```json
{
  "jobId": "job_abc123",
  "status": "running"
}
```

**Process:**
1. Update job status to 'running'
2. Restart workers
3. Resume from last checkpoint
4. Return status

---

#### POST /api/downloads/:jobId/cancel
Cancel a download job.

**Request:**
```
POST /api/downloads/job_abc123/cancel
```

**Response:**
```json
{
  "jobId": "job_abc123",
  "status": "cancelled",
  "downloaded": 618,
  "failed": 3,
  "pending": 757
}
```

**Process:**
1. Signal workers to stop immediately
2. Update job status to 'cancelled'
3. Return final statistics

---

#### GET /api/downloads/:jobId/status
Get current job status.

**Request:**
```
GET /api/downloads/job_abc123/status
```

**Response:**
```json
{
  "jobId": "job_abc123",
  "status": "running",
  "progress": 45.2,
  "stats": {
    "total": 1375,
    "completed": 618,
    "failed": 3,
    "pending": 754,
    "speed": 2.3,
    "eta": 720
  },
  "currentAlbums": [
    {
      "albumId": 1,
      "name": "Transport Aircraft",
      "progress": 76,
      "currentFile": "ju52.jpg"
    }
  ]
}
```

---

#### POST /api/downloads/dry-run
Simulate a download job without downloading.

**Request:**
```json
{
  "albumIds": [1, 2, 3],
  "config": { /* same as create-job */ }
}
```

**Response:**
```json
{
  "totalImages": 127,
  "estimatedSize": 3145728000,
  "files": [
    {
      "albumTitle": "Transport Aircraft",
      "localPath": "germany/luftwaffe/transport-aircraft/transport-aircraft__001__ju52.jpg",
      "exists": false,
      "url": "https://..."
    }
  ],
  "conflicts": [],
  "warnings": [
    "Directory not writable: /path/to/dir"
  ]
}
```

---

### Status & Monitoring

#### GET /api/status/stream
Server-Sent Events stream for real-time updates.

**Request:**
```
GET /api/status/stream?jobId=job_abc123
```

**Response:**
```
Content-Type: text/event-stream

event: progress
data: {"jobId":"job_abc123","completed":618,"total":1375,"speed":2.3}

event: album_progress
data: {"albumId":1,"completed":19,"total":25,"current":"ju52.jpg"}

event: log
data: {"level":"info","message":"Downloading: ju52.jpg","timestamp":"2024-12-29T10:30:00Z"}

event: error
data: {"imageId":1042,"file":"spitfire.jpg","error":"404 Not Found","retry":0}

event: complete
data: {"jobId":"job_abc123","downloaded":1372,"failed":3,"duration":1122}
```

---

## Service Layer Design

### SessionManager

**Purpose:** Manage browser sessions and authentication state.

**Key Methods:**

```typescript
class SessionManager {
  // Launch browser for manual session setup
  async launchBrowser(): Promise<SessionInfo>

  // Save browser state after manual verification
  async saveSession(sessionId: string): Promise<void>

  // Import cookies from user's browser
  async importCookies(cookies: Cookie[]): Promise<SessionInfo>

  // Verify session is still valid
  async verifySession(sessionId: string): Promise<VerificationResult>

  // Get authenticated browser context
  async getBrowserContext(sessionId: string): Promise<BrowserContext>

  // Clear session data
  async clearSession(sessionId: string): Promise<void>
}
```

**Implementation Details:**

```typescript
interface SessionInfo {
  sessionId: string
  sessionType: 'playwright' | 'cookie'
  isActive: boolean
  lastVerified: Date
  expiresAt: Date
}

interface VerificationResult {
  valid: boolean
  statusCode: number
  testUrl: string
  error?: string
}

// Storage format for Playwright state
interface PlaywrightState {
  cookies: Cookie[]
  origins: {
    origin: string
    localStorage: Array<{ name: string; value: string }>
  }[]
}
```

**Session Lifecycle:**

```
1. Launch Browser
   ↓
   Create persistent context in ~/.cache/ww-photos-archiver/playwright/
   ↓
   Store session ID in SQLite
   ↓
   Return session ID

2. User completes verification manually

3. Save Session
   ↓
   Call context.storageState() to export state
   ↓
   Save to disk and SQLite
   ↓
   Close browser

4. Use Session
   ↓
   Load storage state from disk
   ↓
   Create new context with storageState option
   ↓
   Make requests with authenticated context
```

**Error Handling:**

- **Expired Session:** Detected via 403/captcha page → Set isActive=false → Notify user
- **Corrupt State File:** Delete and require re-authentication
- **Browser Launch Failure:** Clear error message, check Playwright installation

---

### DiscoveryCrawler

**Purpose:** Navigate site hierarchy and extract category/album structure.

**Key Methods:**

```typescript
class DiscoveryCrawler {
  // Start discovery from root URLs
  async discover(startUrls: string[], jobId: string): Promise<void>

  // Extract category links from a page
  async extractCategories(url: string): Promise<Category[]>

  // Extract album links from a category page
  async extractAlbums(categoryUrl: string): Promise<Album[]>

  // Parse image URLs from an album page
  async parseAlbumImages(albumUrl: string): Promise<ImageInfo[]>

  // Handle pagination
  async getPaginatedResults(baseUrl: string): Promise<string[]>
}
```

**Discovery Algorithm:**

```typescript
async discover(startUrls: string[], jobId: string) {
  const queue = new Queue<CrawlTask>()
  const visited = new Set<string>()

  // Seed queue
  for (const url of startUrls) {
    queue.enqueue({ url, depth: 0, parentId: null })
  }

  while (!queue.isEmpty()) {
    const task = queue.dequeue()

    // Skip if already visited
    if (visited.has(task.url)) continue
    visited.add(task.url)

    // Get authenticated browser context
    const context = await this.sessionManager.getBrowserContext()
    const page = await context.newPage()

    try {
      // Navigate with retry
      await page.goto(task.url, { waitUntil: 'domcontentloaded' })

      // Check for verification page
      if (this.isVerificationPage(page)) {
        throw new SessionExpiredError()
      }

      // Extract category links
      const categories = await this.extractCategories(page)

      // Save to database
      for (const category of categories) {
        const categoryId = await this.db.insertCategory({
          parentId: task.parentId,
          slug: slugify(category.name),
          name: category.name,
          url: category.url,
          level: task.depth + 1
        })

        // Add to queue for recursive crawl
        if (task.depth < MAX_DEPTH) {
          queue.enqueue({
            url: category.url,
            depth: task.depth + 1,
            parentId: categoryId
          })
        }
      }

      // Extract albums (leaf nodes)
      const albums = await this.extractAlbums(page)

      for (const album of albums) {
        await this.db.insertAlbum({
          categoryId: task.parentId,
          slug: slugify(album.name),
          name: album.name,
          url: album.url
        })
      }

      // Emit progress event
      this.emitProgress(jobId, {
        discovered: visited.size,
        pending: queue.size()
      })

      // Rate limiting
      await sleep(1000 + Math.random() * 500)

    } catch (error) {
      if (error instanceof SessionExpiredError) {
        this.emitError(jobId, 'Session expired')
        break
      }
      // Log and continue
      this.logger.error({ error, url: task.url }, 'Crawl failed')
    } finally {
      await page.close()
    }
  }
}
```

**HTML Parsing:**

```typescript
async extractCategories(page: Page): Promise<Category[]> {
  return page.evaluate(() => {
    const categories: Category[] = []

    // Site-specific selectors (adjust based on actual HTML)
    const links = document.querySelectorAll('.gallery-category a, .category-grid a')

    for (const link of links) {
      const href = link.getAttribute('href')
      const name = link.textContent?.trim()

      if (href && name && !href.includes('/page/')) {
        categories.push({
          name,
          url: new URL(href, window.location.href).toString()
        })
      }
    }

    return categories
  })
}

async extractAlbums(page: Page): Promise<Album[]> {
  return page.evaluate(() => {
    const albums: Album[] = []

    // Site-specific selectors
    const albumLinks = document.querySelectorAll('.album-thumbnail a, .gallery-item a')

    for (const link of albumLinks) {
      const href = link.getAttribute('href')
      const name = link.querySelector('.album-title')?.textContent?.trim()
      const imageCount = link.querySelector('.image-count')?.textContent

      if (href && name) {
        albums.push({
          name,
          url: new URL(href, window.location.href).toString(),
          imageCount: imageCount ? parseInt(imageCount) : 0
        })
      }
    }

    return albums
  })
}

async parseAlbumImages(page: Page): Promise<ImageInfo[]> {
  return page.evaluate(() => {
    const images: ImageInfo[] = []

    // Look for various image patterns
    const selectors = [
      '.gallery-item img',           // Standard gallery
      'a[data-lightbox] img',        // Lightbox links
      '.wp-block-image img',         // WordPress blocks
      'img[src*="/wp-content/uploads/"]' // Direct uploads
    ]

    const imgElements = document.querySelectorAll(selectors.join(','))

    for (const img of imgElements) {
      // Get highest quality version
      const src = img.getAttribute('data-src') ||
                  img.getAttribute('src') ||
                  img.parentElement?.getAttribute('href') // Check if wrapped in link

      if (src && !src.includes('thumbnail')) {
        images.push({
          url: new URL(src, window.location.href).toString(),
          originalFilename: src.split('/').pop() || 'image.jpg'
        })
      }
    }

    return images
  })
}
```

**Pagination Handling:**

```typescript
async getPaginatedResults(baseUrl: string): Promise<string[]> {
  const pages = [baseUrl]
  let currentPage = 1

  while (true) {
    const nextPageUrl = `${baseUrl}/page/${currentPage + 1}/`

    const response = await fetch(nextPageUrl, { method: 'HEAD' })

    if (response.status === 404) {
      break // No more pages
    }

    pages.push(nextPageUrl)
    currentPage++

    if (currentPage > 100) {
      this.logger.warn({ baseUrl }, 'Pagination limit reached')
      break
    }
  }

  return pages
}
```

**Error Resilience:**

- **Page Load Timeout:** Retry 3 times with exponential backoff
- **Selector Not Found:** Log warning, continue with available data
- **Session Expired:** Stop crawl immediately, notify user
- **Rate Limited (429):** Increase delay, retry after cooldown

---

### DownloadEngine

**Purpose:** Manage concurrent image downloads with retry logic and progress tracking.

**Key Methods:**

```typescript
class DownloadEngine {
  // Start download job
  async start(jobId: string): Promise<void>

  // Pause ongoing downloads
  async pause(jobId: string): Promise<void>

  // Resume paused downloads
  async resume(jobId: string): Promise<void>

  // Cancel and cleanup
  async cancel(jobId: string): Promise<void>

  // Download single image
  async downloadImage(imageId: number, config: DownloadConfig): Promise<void>

  // Generate final manifest
  async generateManifest(jobId: string): Promise<void>
}
```

**Implementation:**

```typescript
interface DownloadConfig {
  downloadDir: string
  concurrency: number
  delayMs: number
  jitterMs: number
  retryAttempts: number
  skipExisting: boolean
  generateManifest: boolean
  verifyChecksums: boolean
  namingRules: NamingRules
}

interface WorkerState {
  workerId: number
  status: 'idle' | 'downloading' | 'paused'
  currentImageId?: number
}

class DownloadEngine {
  private workers: Map<number, WorkerState> = new Map()
  private paused: boolean = false
  private cancelled: boolean = false

  async start(jobId: string): Promise<void> {
    const job = await this.db.getJob(jobId)
    const config = JSON.parse(job.config)

    // Update job status
    await this.db.updateJob(jobId, {
      status: 'running',
      startedAt: new Date()
    })

    // Create workers
    const workerPromises: Promise<void>[] = []

    for (let i = 0; i < config.concurrency; i++) {
      this.workers.set(i, { workerId: i, status: 'idle' })
      workerPromises.push(this.runWorker(i, jobId, config))
    }

    // Wait for all workers to complete
    await Promise.all(workerPromises)

    // Generate manifest if requested
    if (config.generateManifest) {
      await this.generateManifest(jobId)
    }

    // Mark job complete
    await this.db.updateJob(jobId, {
      status: 'completed',
      completedAt: new Date()
    })

    this.emitComplete(jobId)
  }

  private async runWorker(
    workerId: number,
    jobId: string,
    config: DownloadConfig
  ): Promise<void> {
    while (!this.cancelled) {
      // Check if paused
      if (this.paused) {
        this.workers.get(workerId)!.status = 'paused'
        await sleep(1000)
        continue
      }

      // Get next pending image
      const image = await this.db.getNextPendingImage(jobId)

      if (!image) {
        break // No more images
      }

      // Update worker state
      this.workers.get(workerId)!.status = 'downloading'
      this.workers.get(workerId)!.currentImageId = image.id

      // Update image status
      await this.db.updateImage(image.id, {
        downloadStatus: 'downloading'
      })

      try {
        // Download with retry logic
        await this.downloadImageWithRetry(image, config)

        // Mark as completed
        await this.db.updateImage(image.id, {
          downloadStatus: 'completed',
          downloadedAt: new Date()
        })

        this.emitLog(jobId, 'success', `Downloaded: ${image.originalFilename}`)

      } catch (error) {
        // Mark as failed
        await this.db.updateImage(image.id, {
          downloadStatus: 'failed',
          errorMessage: error.message
        })

        this.emitLog(jobId, 'error', `Failed: ${image.originalFilename}`)
        this.emitError(jobId, { imageId: image.id, error: error.message })
      }

      // Update progress
      this.emitProgress(jobId)

      // Rate limiting
      const delay = config.delayMs + Math.random() * config.jitterMs
      await sleep(delay)

      // Reset worker state
      this.workers.get(workerId)!.status = 'idle'
      this.workers.get(workerId)!.currentImageId = undefined
    }
  }

  private async downloadImageWithRetry(
    image: ImageRecord,
    config: DownloadConfig
  ): Promise<void> {
    let lastError: Error | null = null

    for (let attempt = 0; attempt < config.retryAttempts; attempt++) {
      try {
        await this.downloadImage(image, config)
        return // Success
      } catch (error) {
        lastError = error

        // Update retry count
        await this.db.updateImage(image.id, {
          retryCount: attempt + 1
        })

        // Exponential backoff
        const backoffMs = Math.pow(2, attempt) * 1000
        await sleep(backoffMs)

        this.emitLog(
          image.jobId,
          'warn',
          `Retry ${attempt + 1}/${config.retryAttempts}: ${image.originalFilename}`
        )
      }
    }

    throw lastError
  }

  private async downloadImage(
    image: ImageRecord,
    config: DownloadConfig
  ): Promise<void> {
    // Get authenticated browser context
    const context = await this.sessionManager.getBrowserContext()

    // Resolve file path
    const album = await this.db.getAlbum(image.albumId)
    const category = await this.db.getCategoryPath(album.categoryId)
    const localPath = this.resolveFilePath(image, album, category, config.namingRules)
    const fullPath = path.join(config.downloadDir, localPath)

    // Check if exists and skip if requested
    if (config.skipExisting && fs.existsSync(fullPath)) {
      await this.db.updateImage(image.id, {
        downloadStatus: 'completed',
        localPath: fullPath,
        skipped: true
      })
      return
    }

    // Ensure directory exists
    fs.mkdirSync(path.dirname(fullPath), { recursive: true })

    // Download with Playwright (uses session cookies)
    const page = await context.newPage()

    try {
      const response = await page.goto(image.url, {
        waitUntil: 'domcontentloaded'
      })

      if (!response || !response.ok()) {
        throw new Error(`HTTP ${response?.status()}: ${image.url}`)
      }

      // Get image buffer
      const buffer = await response.body()

      // Write to disk atomically (temp file + rename)
      const tempPath = `${fullPath}.tmp`
      await fs.promises.writeFile(tempPath, buffer)
      await fs.promises.rename(tempPath, fullPath)

      // Calculate checksum if requested
      let fileHash: string | undefined
      if (config.verifyChecksums) {
        fileHash = await this.calculateSHA256(fullPath)
      }

      // Update database
      await this.db.updateImage(image.id, {
        localPath: fullPath,
        fileSize: buffer.length,
        fileHash
      })

    } finally {
      await page.close()
    }
  }

  private resolveFilePath(
    image: ImageRecord,
    album: AlbumRecord,
    categoryPath: string[],
    rules: NamingRules
  ): string {
    const nation = categoryPath[0] || 'unknown'
    const categorySlug = categoryPath.slice(1).join('/')
    const albumSlug = slugify(album.name)

    // Replace variables in patterns
    const folderPath = rules.folderPattern
      .replace('{nation}', slugify(nation))
      .replace('{category_path}', categorySlug)
      .replace('{album_title}', albumSlug)

    const fileName = rules.filePattern
      .replace('{album_title}', albumSlug)
      .replace('{index}', String(image.indexInAlbum).padStart(3, '0'))
      .replace('{original_filename}', image.originalFilename)
      .replace('{date}', new Date().toISOString().split('T')[0])

    return path.join(folderPath, fileName)
  }

  private async calculateSHA256(filePath: string): Promise<string> {
    const hash = crypto.createHash('sha256')
    const stream = fs.createReadStream(filePath)

    for await (const chunk of stream) {
      hash.update(chunk)
    }

    return hash.digest('hex')
  }

  async pause(jobId: string): Promise<void> {
    this.paused = true
    await this.db.updateJob(jobId, { status: 'paused' })
    this.emitLog(jobId, 'info', 'Download paused')
  }

  async resume(jobId: string): Promise<void> {
    this.paused = false
    await this.db.updateJob(jobId, { status: 'running' })
    this.emitLog(jobId, 'info', 'Download resumed')
  }

  async cancel(jobId: string): Promise<void> {
    this.cancelled = true
    await this.db.updateJob(jobId, { status: 'cancelled' })
    this.emitLog(jobId, 'info', 'Download cancelled')
  }

  async generateManifest(jobId: string): Promise<void> {
    const images = await this.db.getCompletedImages(jobId)
    const manifest = images.map(img => ({
      sourceUrl: img.url,
      localPath: img.localPath,
      originalFilename: img.originalFilename,
      fileSize: img.fileSize,
      fileHash: img.fileHash,
      downloadedAt: img.downloadedAt
    }))

    const job = await this.db.getJob(jobId)
    const config = JSON.parse(job.config)
    const manifestPath = path.join(config.downloadDir, 'manifest.json')

    await fs.promises.writeFile(
      manifestPath,
      JSON.stringify(manifest, null, 2)
    )

    await this.db.insertManifestRecord(jobId, manifestPath)
  }
}
```

**Rate Limiting Strategy:**

```typescript
// Adaptive rate limiting based on response codes
class RateLimiter {
  private baseDelay: number = 1000
  private currentDelay: number = 1000
  private consecutiveSuccesses: number = 0

  async onSuccess(): Promise<void> {
    this.consecutiveSuccesses++

    // Speed up if many successes
    if (this.consecutiveSuccesses > 50) {
      this.currentDelay = Math.max(500, this.currentDelay * 0.9)
    }
  }

  async on429(): Promise<void> {
    // Slow down significantly on rate limit
    this.currentDelay = Math.min(10000, this.currentDelay * 2)
    this.consecutiveSuccesses = 0

    // Wait longer before next request
    await sleep(this.currentDelay * 5)
  }

  async onError(): Promise<void> {
    // Slight slowdown on errors
    this.currentDelay = Math.min(5000, this.currentDelay * 1.5)
    this.consecutiveSuccesses = 0
  }

  getDelay(): number {
    return this.currentDelay
  }
}
```

---

## Database Layer

### StateManager

**Purpose:** Abstract SQLite operations and provide transaction management.

**Key Methods:**

```typescript
class StateManager {
  // Session operations
  async createSession(data: SessionData): Promise<number>
  async getActiveSession(): Promise<SessionRecord | null>
  async updateSession(id: number, data: Partial<SessionData>): Promise<void>

  // Category operations
  async insertCategory(data: CategoryData): Promise<number>
  async getCategoryTree(parentId?: number): Promise<CategoryNode[]>
  async getCategoryPath(categoryId: number): Promise<string[]>

  // Album operations
  async insertAlbum(data: AlbumData): Promise<number>
  async getAlbum(id: number): Promise<AlbumRecord>
  async getAlbumsByCategory(categoryId: number): Promise<AlbumRecord[]>

  // Image operations
  async insertImage(data: ImageData): Promise<number>
  async getNextPendingImage(jobId: string): Promise<ImageRecord | null>
  async updateImage(id: number, data: Partial<ImageData>): Promise<void>
  async getCompletedImages(jobId: string): Promise<ImageRecord[]>

  // Job operations
  async createJob(data: JobData): Promise<string>
  async getJob(jobId: string): Promise<JobRecord>
  async updateJob(jobId: string, data: Partial<JobData>): Promise<void>
  async getJobStats(jobId: string): Promise<JobStats>
}
```

**Transaction Support:**

```typescript
async transaction<T>(callback: (db: Database) => T): Promise<T> {
  const db = this.db

  db.exec('BEGIN IMMEDIATE')

  try {
    const result = callback(db)
    db.exec('COMMIT')
    return result
  } catch (error) {
    db.exec('ROLLBACK')
    throw error
  }
}
```

---

## Event System (SSE)

### EventEmitter

**Purpose:** Broadcast real-time updates to connected clients.

**Implementation:**

```typescript
class SSEEmitter {
  private clients: Map<string, Response> = new Map()

  addClient(clientId: string, response: Response): void {
    this.clients.set(clientId, response)

    // Send initial connection message
    this.send(clientId, 'connected', { message: 'SSE connected' })
  }

  removeClient(clientId: string): void {
    this.clients.delete(clientId)
  }

  broadcast(event: string, data: any): void {
    for (const [clientId, _] of this.clients) {
      this.send(clientId, event, data)
    }
  }

  send(clientId: string, event: string, data: any): void {
    const response = this.clients.get(clientId)
    if (!response) return

    const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`
    response.write(message)
  }
}

// Fastify route for SSE
fastify.get('/api/status/stream', async (request, reply) => {
  reply.raw.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  })

  const clientId = generateId()
  sseEmitter.addClient(clientId, reply.raw)

  request.raw.on('close', () => {
    sseEmitter.removeClient(clientId)
  })
})
```

---

## Error Handling

### Error Classes

```typescript
class SessionExpiredError extends Error {
  constructor() {
    super('Session has expired or is invalid')
    this.name = 'SessionExpiredError'
  }
}

class RateLimitError extends Error {
  constructor(retryAfter?: number) {
    super(`Rate limited. Retry after ${retryAfter}s`)
    this.name = 'RateLimitError'
  }
}

class DiskSpaceError extends Error {
  constructor(required: number, available: number) {
    super(`Insufficient disk space. Required: ${required}, Available: ${available}`)
    this.name = 'DiskSpaceError'
  }
}

class NetworkError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'NetworkError'
  }
}
```

### Global Error Handler

```typescript
fastify.setErrorHandler((error, request, reply) => {
  if (error instanceof SessionExpiredError) {
    reply.status(401).send({
      error: 'SessionExpired',
      message: error.message,
      action: 'REFRESH_SESSION'
    })
  } else if (error instanceof RateLimitError) {
    reply.status(429).send({
      error: 'RateLimited',
      message: error.message,
      action: 'SLOW_DOWN'
    })
  } else if (error instanceof DiskSpaceError) {
    reply.status(507).send({
      error: 'InsufficientStorage',
      message: error.message,
      action: 'FREE_SPACE'
    })
  } else {
    logger.error(error)
    reply.status(500).send({
      error: 'InternalError',
      message: 'An unexpected error occurred'
    })
  }
})
```

---

## Performance Optimizations

### Connection Pooling

```typescript
// Reuse Playwright browser contexts
class BrowserPool {
  private contexts: BrowserContext[] = []
  private maxContexts: number = 2

  async acquire(): Promise<BrowserContext> {
    if (this.contexts.length < this.maxContexts) {
      const context = await browser.newContext()
      this.contexts.push(context)
      return context
    }

    // Round-robin selection
    return this.contexts[Math.floor(Math.random() * this.contexts.length)]
  }
}
```

### Database Indexing

```sql
-- Optimize queries
CREATE INDEX idx_categories_parent ON categories(parent_id);
CREATE INDEX idx_albums_category ON albums(category_id);
CREATE INDEX idx_images_album ON images(album_id);
CREATE INDEX idx_images_status ON images(download_status);
CREATE INDEX idx_images_job_status ON images(album_id, download_status);
```

### Memory Management

- Stream downloads directly to disk (no buffering)
- Limit concurrent Playwright pages (max 2)
- Use database cursors for large result sets
- Close browser pages immediately after use

---

## Testing Strategy

### Unit Tests

```typescript
// Example: SessionManager tests
describe('SessionManager', () => {
  it('should launch browser and return session ID', async () => {
    const session = await sessionManager.launchBrowser()
    expect(session.sessionId).toBeDefined()
    expect(session.sessionType).toBe('playwright')
  })

  it('should verify valid session', async () => {
    const result = await sessionManager.verifySession(sessionId)
    expect(result.valid).toBe(true)
  })

  it('should detect expired session', async () => {
    // Mock 403 response
    const result = await sessionManager.verifySession(expiredSessionId)
    expect(result.valid).toBe(false)
  })
})
```

### Integration Tests

```typescript
// Example: End-to-end download flow
describe('Download Flow', () => {
  it('should download images from album', async () => {
    const jobId = await downloadEngine.createJob({
      albumIds: [testAlbumId],
      config: testConfig
    })

    await downloadEngine.start(jobId)

    const stats = await db.getJobStats(jobId)
    expect(stats.completed).toBeGreaterThan(0)
    expect(stats.failed).toBe(0)
  })
})
```

---

## Next Steps

See implementation examples:
- `CODE_EXAMPLES.md` - Complete code snippets
- `IMPLEMENTATION_README.md` - Setup and deployment guide
