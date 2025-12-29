# World War Photos Archiver - Implementation Guide

## Quick Start

This guide walks you through implementing and running the World War Photos Archiver application locally.

## Prerequisites

- **Node.js:** 18.x or higher
- **npm:** 9.x or higher (or pnpm/yarn)
- **OS:** macOS, Linux, or Windows 10+
- **Disk Space:** 10GB+ recommended for downloaded images
- **RAM:** 4GB minimum, 8GB recommended

## Project Structure Creation

### Step 1: Initialize Root Workspace

```bash
mkdir world-war-photos-archiver
cd world-war-photos-archiver

# Initialize root package.json with workspaces
cat > package.json <<EOF
{
  "name": "world-war-photos-archiver",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "frontend",
    "backend",
    "shared"
  ],
  "scripts": {
    "dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\"",
    "dev:frontend": "npm run dev --workspace=frontend",
    "dev:backend": "npm run dev --workspace=backend",
    "build": "npm run build --workspaces",
    "start": "npm run start --workspace=backend"
  },
  "devDependencies": {
    "concurrently": "^8.2.2",
    "typescript": "^5.3.3"
  }
}
EOF

npm install
```

---

## Backend Setup

### Step 2: Initialize Backend

```bash
mkdir backend
cd backend

npm init -y

# Install dependencies
npm install \
  fastify@^4.25.1 \
  @fastify/cors@^8.5.0 \
  playwright@^1.40.0 \
  better-sqlite3@^9.2.2 \
  pino@^8.17.2 \
  pino-pretty@^10.3.1 \
  zod@^3.22.4

# Install dev dependencies
npm install -D \
  @types/node@^20.10.6 \
  @types/better-sqlite3@^7.6.8 \
  tsx@^4.7.0 \
  nodemon@^3.0.2

# Install Playwright browsers
npx playwright install chromium
```

### Step 3: Backend Configuration Files

**tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "node",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**package.json scripts**

```json
{
  "scripts": {
    "dev": "nodemon --watch src --exec tsx src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  }
}
```

### Step 4: Create Backend Directory Structure

```bash
mkdir -p src/{routes,services,models,database,utils}
mkdir -p data/{sessions,logs}
mkdir -p downloads
```

### Step 5: Create Database Schema

**src/database/schema.sql**

```sql
-- Sessions
CREATE TABLE IF NOT EXISTS sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL UNIQUE,
  session_type TEXT NOT NULL CHECK(session_type IN ('playwright', 'cookie')),
  session_data TEXT,
  is_active BOOLEAN DEFAULT 1,
  last_verified_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  parent_id INTEGER,
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  level INTEGER DEFAULT 0,
  estimated_count INTEGER DEFAULT 0,
  discovered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES categories(id)
);

CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- Albums
CREATE TABLE IF NOT EXISTS albums (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id INTEGER NOT NULL,
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  url TEXT NOT NULL UNIQUE,
  image_count INTEGER DEFAULT 0,
  parsed BOOLEAN DEFAULT 0,
  parsed_at DATETIME,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE INDEX IF NOT EXISTS idx_albums_category ON albums(category_id);

-- Images
CREATE TABLE IF NOT EXISTS images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  album_id INTEGER NOT NULL,
  url TEXT NOT NULL UNIQUE,
  original_filename TEXT,
  local_path TEXT,
  file_size INTEGER,
  download_status TEXT DEFAULT 'pending' CHECK(download_status IN ('pending', 'downloading', 'completed', 'failed')),
  retry_count INTEGER DEFAULT 0,
  error_message TEXT,
  downloaded_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (album_id) REFERENCES albums(id)
);

CREATE INDEX IF NOT EXISTS idx_images_album ON images(album_id);
CREATE INDEX IF NOT EXISTS idx_images_status ON images(download_status);

-- Download Jobs
CREATE TABLE IF NOT EXISTS download_jobs (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  config TEXT NOT NULL,
  status TEXT DEFAULT 'created' CHECK(status IN ('created', 'running', 'paused', 'completed', 'cancelled', 'failed')),
  progress REAL DEFAULT 0,
  started_at DATETIME,
  completed_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Job Items
CREATE TABLE IF NOT EXISTS job_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  job_id TEXT NOT NULL,
  album_id INTEGER NOT NULL,
  status TEXT DEFAULT 'pending',
  FOREIGN KEY (job_id) REFERENCES download_jobs(id),
  FOREIGN KEY (album_id) REFERENCES albums(id)
);

-- Manifests
CREATE TABLE IF NOT EXISTS manifests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  image_id INTEGER NOT NULL,
  source_url TEXT NOT NULL,
  local_path TEXT NOT NULL,
  file_hash TEXT,
  downloaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (image_id) REFERENCES images(id)
);
```

### Step 6: Create Main Server File

**src/server.ts**

```typescript
import Fastify from 'fastify'
import cors from '@fastify/cors'
import { sessionRoutes } from './routes/session'
import { categoryRoutes } from './routes/categories'
import { downloadRoutes } from './routes/downloads'
import { statusRoutes } from './routes/status'
import { initializeDatabase } from './database/database'

const fastify = Fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss',
        ignore: 'pid,hostname'
      }
    }
  }
})

// Register CORS
fastify.register(cors, {
  origin: 'http://localhost:3000', // Frontend URL
  credentials: true
})

// Initialize database
const db = initializeDatabase()
fastify.decorate('db', db)

// Register routes
fastify.register(sessionRoutes)
fastify.register(categoryRoutes)
fastify.register(downloadRoutes)
fastify.register(statusRoutes)

// Health check
fastify.get('/api/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() }
})

// Start server
const start = async () => {
  try {
    await fastify.listen({ port: 3001, host: '0.0.0.0' })
    console.log('Server running at http://localhost:3001')
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()

// Graceful shutdown
process.on('SIGINT', async () => {
  await fastify.close()
  process.exit(0)
})
```

---

## Frontend Setup

### Step 7: Initialize Frontend with Next.js

```bash
cd .. # Back to root
npx create-next-app@latest frontend --typescript --tailwind --app --no-src-dir --import-alias "@/*"

cd frontend

# Install additional dependencies
npm install \
  lucide-react@^0.294.0 \
  daisyui@^4.4.24 \
  @radix-ui/react-accordion@^1.1.2 \
  @radix-ui/react-dialog@^1.0.5 \
  @radix-ui/react-progress@^1.0.3
```

### Step 8: Configure Tailwind with DaisyUI

**tailwind.config.ts**

```typescript
import type { Config } from 'tailwindcss'
import daisyui from 'daisyui'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: ['light', 'dark'],
    base: true,
    styled: true,
    utils: true,
  },
}

export default config
```

### Step 9: Frontend Directory Structure

```bash
mkdir -p app/{session,categories,planner,monitor}
mkdir -p components
mkdir -p lib
```

### Step 10: API Client Configuration

**lib/api-client.ts**

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }))
    throw new Error(error.message || `HTTP ${response.status}`)
  }

  return response.json()
}

// Session API
export const sessionAPI = {
  launchBrowser: () =>
    apiRequest<{ sessionId: string }>('/api/session/launch-browser', {
      method: 'POST',
    }),

  saveSession: (sessionId: string) =>
    apiRequest('/api/session/save-session', {
      method: 'POST',
      body: JSON.stringify({ sessionId }),
    }),

  verify: () =>
    apiRequest<{ valid: boolean }>('/api/session/verify'),

  clear: () =>
    apiRequest('/api/session/clear', { method: 'DELETE' }),
}

// Categories API
export const categoriesAPI = {
  discover: (startUrls: string[]) =>
    apiRequest<{ jobId: string }>('/api/categories/discover', {
      method: 'POST',
      body: JSON.stringify({ startUrls }),
    }),

  getTree: () =>
    apiRequest<{ categories: any[] }>('/api/categories/tree'),

  search: (query: string) =>
    apiRequest(`/api/categories/search?q=${encodeURIComponent(query)}`),
}

// Downloads API
export const downloadsAPI = {
  createJob: (data: any) =>
    apiRequest<{ jobId: string }>('/api/downloads/create-job', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  start: (jobId: string) =>
    apiRequest(`/api/downloads/${jobId}/start`, { method: 'POST' }),

  pause: (jobId: string) =>
    apiRequest(`/api/downloads/${jobId}/pause`, { method: 'POST' }),

  resume: (jobId: string) =>
    apiRequest(`/api/downloads/${jobId}/resume`, { method: 'POST' }),

  cancel: (jobId: string) =>
    apiRequest(`/api/downloads/${jobId}/cancel`, { method: 'POST' }),

  getStatus: (jobId: string) =>
    apiRequest(`/api/downloads/${jobId}/status`),
}
```

### Step 11: Environment Variables

**.env.local**

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## Shared Types Package

### Step 12: Create Shared Types

```bash
cd .. # Back to root
mkdir shared
cd shared

npm init -y

# Install TypeScript
npm install -D typescript@^5.3.3

# Configure TypeScript
cat > tsconfig.json <<EOF
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "node",
    "declaration": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true
  }
}
EOF

mkdir src
```

**src/types.ts**

```typescript
export interface Category {
  id: number
  parentId: number | null
  slug: string
  name: string
  url: string
  level: number
  albumCount: number
  children?: Category[]
}

export interface Album {
  id: number
  categoryId: number
  slug: string
  name: string
  url: string
  imageCount: number
}

export interface DownloadConfig {
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

export interface NamingRules {
  folderPattern: string
  filePattern: string
}

export interface DownloadStats {
  total: number
  completed: number
  failed: number
  speed: number
  eta: number
}

export interface LogEntry {
  timestamp: string
  level: 'info' | 'success' | 'warn' | 'error'
  message: string
}
```

---

## Running the Application

### Step 13: Start Development Servers

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

**Or from root (recommended):**

```bash
npm run dev
```

### Step 14: Access the Application

Open browser to: **http://localhost:3000**

Backend API: **http://localhost:3001**

---

## First Time Usage

### 1. Create Session

1. Navigate to Session Setup screen
2. Click "Launch Browser"
3. Complete any verification in the opened browser
4. Click "Save Session"
5. Verify session is active

### 2. Discover Categories

1. Go to Category Browser
2. Click "Discover Categories"
3. Wait for crawl to complete
4. Browse discovered categories in tree view

### 3. Plan Download

1. Select categories/albums you want
2. Go to Download Planner
3. Configure download settings
4. (Optional) Run Dry Run to preview
5. Click "Start Download"

### 4. Monitor Progress

1. Watch real-time progress in Download Monitor
2. View live logs
3. Pause/Resume/Cancel as needed
4. Check errors and retry failed downloads

---

## Production Build

### Build All Packages

```bash
# From root
npm run build
```

### Start Production Server

```bash
npm run start
```

Or deploy frontend to Vercel/Netlify and backend to any Node.js host.

---

## Optional: Electron Desktop App

### Step 15: Add Electron Wrapper

```bash
mkdir electron
cd electron

npm init -y

npm install \
  electron@^28.1.0 \
  electron-builder@^24.9.1
```

**electron/main.js**

```javascript
const { app, BrowserWindow } = require('electron')
const path = require('path')
const { spawn } = require('child_process')

let mainWindow
let backendProcess

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  // Load Next.js frontend
  mainWindow.loadURL('http://localhost:3000')

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

function startBackend() {
  backendProcess = spawn('node', [
    path.join(__dirname, '../backend/dist/server.js')
  ], {
    stdio: 'inherit'
  })
}

app.on('ready', () => {
  startBackend()
  setTimeout(createWindow, 2000) // Wait for backend to start
})

app.on('window-all-closed', () => {
  if (backendProcess) {
    backendProcess.kill()
  }
  app.quit()
})
```

**package.json**

```json
{
  "name": "world-war-photos-archiver-desktop",
  "version": "1.0.0",
  "main": "main.js",
  "scripts": {
    "start": "electron .",
    "build:mac": "electron-builder --mac",
    "build:win": "electron-builder --win",
    "build:linux": "electron-builder --linux"
  },
  "build": {
    "appId": "com.worldwarphotos.archiver",
    "productName": "World War Photos Archiver",
    "files": [
      "main.js",
      "../backend/dist/**/*",
      "../frontend/.next/**/*"
    ],
    "directories": {
      "output": "dist"
    }
  }
}
```

---

## Troubleshooting

### Playwright Browser Fails to Launch

```bash
# Re-install Playwright browsers
cd backend
npx playwright install --with-deps chromium
```

### SQLite Database Locked

- Ensure only one backend instance is running
- Check that no other process is using `data/app.db`

### Session Expired Immediately

- Verify worldwarphotos.info is accessible
- Check for captcha/verification pages
- Try clearing session and creating new one

### Frontend Can't Connect to Backend

- Verify backend is running on port 3001
- Check CORS configuration in backend
- Ensure `NEXT_PUBLIC_API_URL` is set correctly

### Downloads Fail with 403

- Session may have expired, re-verify
- Check robots.txt compliance
- Reduce concurrency and increase delays

---

## Configuration Tips

### Optimal Download Settings

**For Fast Connection + Respectful Scraping:**
- Concurrency: 3
- Delay: 1000ms
- Jitter: 500ms
- Retry: 5

**For Slow Connection / Avoiding Rate Limits:**
- Concurrency: 1-2
- Delay: 2000-3000ms
- Jitter: 1000ms
- Retry: 3

### Naming Rules Examples

**Organized by Nation:**
```
Folder: {nation}/{category_path}/{album_title}
File: {album_title}__{index}__{original_filename}
```

**Flat with Dates:**
```
Folder: downloads/{date}
File: {nation}_{album_title}_{index}_{original_filename}
```

**Original Structure:**
```
Folder: {category_path}
File: {original_filename}
```

---

## Maintenance

### Database Backup

```bash
# Backup database
cp data/app.db data/app.db.backup

# Export to SQL
sqlite3 data/app.db .dump > backup.sql
```

### Clear Old Sessions

```sql
-- In SQLite console
DELETE FROM sessions WHERE last_verified_at < datetime('now', '-30 days');
```

### View Statistics

```sql
-- Total categories discovered
SELECT COUNT(*) FROM categories;

-- Total images downloaded
SELECT COUNT(*) FROM images WHERE download_status = 'completed';

-- Download success rate
SELECT
  CAST(SUM(CASE WHEN download_status = 'completed' THEN 1 ELSE 0 END) AS FLOAT) / COUNT(*) * 100 as success_rate
FROM images;
```

---

## Performance Tuning

### Backend Optimizations

1. **Increase SQLite cache:**
   ```sql
   PRAGMA cache_size = 10000;
   ```

2. **Optimize Playwright:**
   ```typescript
   // Disable images for discovery (faster)
   context.route('**/*.{png,jpg,jpeg,gif}', route => route.abort())
   ```

3. **Use connection pooling:**
   Limit Playwright contexts to 2-3 max

### Frontend Optimizations

1. **Enable Next.js SWC:**
   Already enabled by default in Next.js 15

2. **Optimize tree rendering:**
   Use virtualized lists for 1000+ categories

3. **Reduce SSE frequency:**
   Throttle progress updates to 10/second max

---

## Security Checklist

- [ ] Never commit `.env` files
- [ ] Store session data locally only
- [ ] Validate all user inputs
- [ ] Sanitize filenames
- [ ] Check disk space before downloads
- [ ] Use HTTPS in production
- [ ] Implement rate limiting on API
- [ ] Regular dependency updates

---

## Support & Resources

**Documentation:**
- Architecture: `ARCHITECTURE.md`
- UI Design: `UI_DESIGN.md`
- Backend Logic: `BACKEND_DESIGN.md`
- Code Examples: `CODE_EXAMPLES.md`

**External Resources:**
- Playwright Docs: https://playwright.dev
- Fastify Docs: https://www.fastify.io
- Next.js Docs: https://nextjs.org/docs
- Better-SQLite3: https://github.com/WiseLibs/better-sqlite3

**Community:**
- Report issues on GitHub
- Check robots.txt: https://www.worldwarphotos.info/robots.txt

---

## License Considerations

**Important:** This tool is for personal archival and research use only.

Before using:
1. Review site terms of service
2. Check copyright restrictions
3. Respect robots.txt directives
4. Use appropriate rate limits
5. Obtain necessary permissions

The developers assume no liability for misuse of this software.

---

## What's Next?

1. **Implement the code** using the examples in `CODE_EXAMPLES.md`
2. **Test thoroughly** with small album sets first
3. **Monitor performance** and adjust settings
4. **Contribute improvements** back to the project
5. **Share responsibly** and legally

Happy archiving! 📚🖼️
