# World War Photos Archiver - Example Output Structure

## Download Folder Structure

This document shows what your downloaded files will look like after using the archiver.

## Default Naming Rules

**Folder Pattern:** `{nation}/{category_path}/{album_title}/`

**File Pattern:** `{album_title}__{index}__{original_filename}`

## Example Directory Tree

```
downloads/
│
├── germany/
│   ├── luftwaffe/
│   │   ├── transport-aircraft/
│   │   │   ├── transport-aircraft__001__ju52-cockpit-view.jpg
│   │   │   ├── transport-aircraft__002__ju52-loading-troops.jpg
│   │   │   ├── transport-aircraft__003__ju52-formation-flight.jpg
│   │   │   └── ... (25 images total)
│   │   │
│   │   ├── fighter-aircraft/
│   │   │   ├── bf-109/
│   │   │   │   ├── bf-109__001__bf109-e4-profile.jpg
│   │   │   │   ├── bf-109__002__bf109-cockpit.jpg
│   │   │   │   └── ... (42 images)
│   │   │   │
│   │   │   └── fw-190/
│   │   │       ├── fw-190__001__fw190-a8-sturmbock.jpg
│   │   │       ├── fw-190__002__fw190-d9-dora.jpg
│   │   │       └── ... (38 images)
│   │   │
│   │   └── bomber-aircraft/
│   │       ├── he-111/
│   │       │   └── ... (28 images)
│   │       └── ju-88/
│   │           └── ... (31 images)
│   │
│   ├── wehrmacht/
│   │   ├── panzer-tanks/
│   │   │   ├── panzer-iv/
│   │   │   │   ├── panzer-iv__001__panzer-iv-ausf-h.jpg
│   │   │   │   └── ... (56 images)
│   │   │   │
│   │   │   └── tiger-tank/
│   │   │       ├── tiger-tank__001__tiger-i-heavy.jpg
│   │   │       └── ... (67 images)
│   │   │
│   │   └── infantry/
│   │       └── ... (multiple albums)
│   │
│   └── kriegsmarine/
│       └── ... (naval categories)
│
├── united-states/
│   ├── usaaf/
│   │   ├── heavy-bombers/
│   │   │   ├── b-17-flying-fortress/
│   │   │   │   ├── b-17-flying-fortress__001__b17-formation.jpg
│   │   │   │   ├── b-17-flying-fortress__002__b17-bomb-bay.jpg
│   │   │   │   └── ... (73 images)
│   │   │   │
│   │   │   └── b-24-liberator/
│   │   │       └── ... (58 images)
│   │   │
│   │   ├── fighters/
│   │   │   ├── p-51-mustang/
│   │   │   │   └── ... (92 images)
│   │   │   └── p-47-thunderbolt/
│   │   │       └── ... (64 images)
│   │   │
│   │   └── medium-bombers/
│   │       └── ... (multiple albums)
│   │
│   ├── us-army/
│   │   └── ... (ground forces)
│   │
│   └── us-navy/
│       └── ... (naval categories)
│
├── united-kingdom/
│   ├── raf/
│   │   ├── fighters/
│   │   │   ├── spitfire/
│   │   │   │   ├── spitfire__001__spitfire-mk-i.jpg
│   │   │   │   ├── spitfire__002__spitfire-mk-v.jpg
│   │   │   │   ├── spitfire__003__spitfire-mk-ix.jpg
│   │   │   │   └── ... (89 images)
│   │   │   │
│   │   │   └── hurricane/
│   │   │       └── ... (54 images)
│   │   │
│   │   └── bombers/
│   │       ├── lancaster/
│   │       │   └── ... (78 images)
│   │       └── halifax/
│   │           └── ... (42 images)
│   │
│   └── royal-navy/
│       └── ... (naval categories)
│
├── soviet-union/
│   ├── vvs/
│   │   ├── fighters/
│   │   │   ├── yak-fighters/
│   │   │   │   └── ... (47 images)
│   │   │   └── lavochkin-fighters/
│   │   │       └── ... (38 images)
│   │   │
│   │   └── ground-attack/
│   │       ├── il-2-sturmovik/
│   │       │   └── ... (61 images)
│   │       └── ... (other albums)
│   │
│   └── red-army/
│       └── ... (ground forces)
│
└── manifest.json
```

## Manifest File Example

**downloads/manifest.json**

```json
[
  {
    "sourceUrl": "https://www.worldwarphotos.info/wp-content/uploads/2024/05/ju52-cockpit-view.jpg",
    "localPath": "germany/luftwaffe/transport-aircraft/transport-aircraft__001__ju52-cockpit-view.jpg",
    "originalFilename": "ju52-cockpit-view.jpg",
    "fileSize": 2458624,
    "fileHash": "a3f5d8c9e1b2a4f6e8d9c7b5a3f1e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a3f2",
    "downloadedAt": "2024-12-29T10:30:45.123Z"
  },
  {
    "sourceUrl": "https://www.worldwarphotos.info/wp-content/uploads/2024/05/ju52-loading-troops.jpg",
    "localPath": "germany/luftwaffe/transport-aircraft/transport-aircraft__002__ju52-loading-troops.jpg",
    "originalFilename": "ju52-loading-troops.jpg",
    "fileSize": 3127890,
    "fileHash": "b4e6c8d1f2a3b5f7e9d0c8b6a4f2e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3",
    "downloadedAt": "2024-12-29T10:30:47.456Z"
  }
]
```

## File Naming Details

### Sequential Numbering

Images are numbered sequentially within each album:
- `__001__`, `__002__`, `__003__`, ... `__099__`, `__100__`
- Zero-padded to 3 digits for proper sorting
- Resets for each album

### Slugification Rules

All folder and file names are slugified:

**Original:** `Fw 190 A-8/R2 (Sturmbock) - Cockpit View`

**Slugified:** `fw-190-a-8-r2-sturmbock-cockpit-view`

**Rules Applied:**
- Convert to lowercase
- Remove accents/diacritics
- Replace spaces with hyphens
- Remove special characters except hyphens
- No consecutive hyphens
- No leading/trailing hyphens
- Max 100 characters per segment

### Original Filename Preservation

The original filename from the website is preserved in the final part:
- `transport-aircraft__001__ju52-cockpit-view.jpg`
  - Album prefix: `transport-aircraft`
  - Index: `001`
  - Original: `ju52-cockpit-view.jpg`

This allows:
- Easy identification of source
- Preservation of descriptive names
- Unique filenames even if duplicates exist

## Alternative Naming Examples

### Flat Structure with Dates

**Pattern:**
```
Folder: downloads/{date}
File: {nation}_{album_title}_{index}_{original_filename}
```

**Output:**
```
downloads/
├── 2024-12-29/
│   ├── germany_transport-aircraft_001_ju52-cockpit.jpg
│   ├── germany_transport-aircraft_002_ju52-loading.jpg
│   ├── usa_b17-bomber_001_b17-formation.jpg
│   └── uk_spitfire_001_spitfire-mk-i.jpg
```

### Category-First Organization

**Pattern:**
```
Folder: {category_path}
File: {nation}_{album_title}_{index}_{original_filename}
```

**Output:**
```
downloads/
├── luftwaffe/
│   ├── transport-aircraft/
│   │   ├── germany_transport-aircraft_001_ju52.jpg
│   │   └── ...
│   └── fighter-aircraft/
│       └── ...
└── usaaf/
    └── ...
```

### Minimal (Original Names Only)

**Pattern:**
```
Folder: {nation}/{category_path}
File: {original_filename}
```

**Output:**
```
downloads/
├── germany/
│   └── luftwaffe/
│       ├── ju52-cockpit-view.jpg
│       ├── ju52-loading-troops.jpg
│       └── bf109-e4-profile.jpg
```

⚠️ **Warning:** May cause filename conflicts if multiple albums contain images with the same original name.

## Statistics Example

After a successful download session:

```
Download Complete ✓

Total Images: 3,847
Downloaded: 3,842 (99.9%)
Failed: 5 (0.1%)
Skipped: 0

Total Size: 8.73 GB
Duration: 2 hours 14 minutes
Average Speed: 1.8 MB/s

Organized into:
- 8 nations
- 47 categories
- 156 albums
- 3,842 images

Saved to: /Users/researcher/Downloads/ww2-photos
```

## Disk Space Considerations

**Typical Image Sizes:**
- Low resolution (800x600): 100-300 KB
- Medium resolution (1920x1080): 500 KB - 2 MB
- High resolution (4000x3000): 2-8 MB
- Very high resolution (6000x4000+): 8-20 MB

**Estimated Storage:**
- Small album (20 images @ 1MB avg): ~20 MB
- Medium album (50 images @ 2MB avg): ~100 MB
- Large album (100 images @ 3MB avg): ~300 MB
- Full category (500 images): ~1-2 GB
- Complete site (10,000+ images): ~20-50 GB

**Recommendations:**
- Start with single albums to test
- Check available disk space before large downloads
- Use external drive for complete site archives
- Consider compression for long-term storage

## File Integrity

### Checksum Verification (Optional)

When enabled, each file includes SHA256 hash in manifest:

```json
{
  "localPath": "germany/luftwaffe/ju52-cockpit.jpg",
  "fileHash": "a3f5d8c9e1b2a4f6e8d9c7b5a3f1e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a3f2"
}
```

**Verify file integrity:**

```bash
# macOS/Linux
shasum -a 256 germany/luftwaffe/ju52-cockpit.jpg

# Windows PowerShell
Get-FileHash germany/luftwaffe/ju52-cockpit.jpg -Algorithm SHA256
```

Compare output with hash in manifest.

## Metadata Preservation

### EXIF Data

Original EXIF metadata is preserved in JPEG files:
- Camera information (if available)
- Copyright notices
- Upload date
- GPS coordinates (rare for historical photos)

**View EXIF data:**

```bash
# Using exiftool (install via homebrew/apt)
exiftool germany/luftwaffe/ju52-cockpit.jpg
```

### Filename as Metadata

The structured naming scheme embeds metadata:
- Nation: `germany`
- Category path: `luftwaffe/transport-aircraft`
- Album: `transport-aircraft`
- Sequence: `001`
- Description: `ju52-cockpit-view`

This allows searching and organizing without a database.

## Backup Recommendations

**Essential Files to Backup:**
1. `downloads/` folder (all images)
2. `manifest.json` (audit trail)
3. `data/app.db` (application database)
4. Download job configurations

**Backup Strategies:**

**Local Backup:**
```bash
# macOS Time Machine, Linux rsync, Windows File History
rsync -av downloads/ /Volumes/Backup/ww2-photos/
```

**Cloud Backup:**
```bash
# rclone to Google Drive, Dropbox, etc.
rclone sync downloads/ gdrive:ww2-photos/
```

**Compressed Archive:**
```bash
# Create compressed backup
tar -czf ww2-photos-backup-2024-12-29.tar.gz downloads/ manifest.json

# Or zip
zip -r ww2-photos-backup-2024-12-29.zip downloads/ manifest.json
```

## Usage Examples

### Browse Downloads

```bash
# List all albums
find downloads -type d -mindepth 3 -maxdepth 3

# Count images per nation
find downloads -name "*.jpg" | cut -d'/' -f2 | sort | uniq -c

# Find specific aircraft
find downloads -name "*spitfire*"

# List largest files
find downloads -name "*.jpg" -exec ls -lh {} \; | sort -k5 -hr | head -20
```

### Search by Keyword

```bash
# Find all Spitfire images
grep -r "spitfire" manifest.json

# Find images downloaded on specific date
grep "2024-12-29" manifest.json
```

### Generate Report

```bash
# Total number of images
find downloads -name "*.jpg" | wc -l

# Total disk usage
du -sh downloads/

# Images per category
for dir in downloads/*/; do
  echo "$dir: $(find "$dir" -name "*.jpg" | wc -l) images"
done
```

## Next Steps

After downloading:

1. **Verify integrity** using manifest checksums
2. **Create backups** to multiple locations
3. **Organize further** if needed (by year, theater, etc.)
4. **Share responsibly** and legally
5. **Cite sources** properly in research

---

**Remember:** These are historical documents. Handle with respect and proper attribution.
