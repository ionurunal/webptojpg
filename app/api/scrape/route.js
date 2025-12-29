import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request) {
    try {
        const { url } = await request.json();

        if (!url || !url.startsWith('http')) {
            return NextResponse.json(
                { error: 'Valid URL is required' },
                { status: 400 }
            );
        }

        // Fetch the page
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            },
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: `Failed to fetch: ${response.status}` },
                { status: response.status }
            );
        }

        const html = await response.text();
        const $ = cheerio.load(html);

        // Find all images
        const images = [];
        const seenUrls = new Set();

        // Try multiple selectors for different image patterns
        const selectors = [
            'img[src*="wp-content/uploads"]',
            '.gallery-item img',
            'article img',
            '.entry-content img',
            'a[href$=".jpg"] img',
            'a[href$=".jpeg"] img',
            'a[href$=".png"] img',
            'a[href$=".webp"] img',
        ];

        selectors.forEach(selector => {
            $(selector).each((i, elem) => {
                const $elem = $(elem);
                const src = $elem.attr('src') || $elem.attr('data-src');
                const parent = $elem.parent('a');
                const href = parent.attr('href');

                // Prefer full-size image link if available
                let imageUrl = href && (href.endsWith('.jpg') || href.endsWith('.jpeg') || href.endsWith('.png') || href.endsWith('.webp'))
                    ? href
                    : src;

                if (imageUrl) {
                    // Make absolute URL
                    if (imageUrl.startsWith('/')) {
                        const urlObj = new URL(url);
                        imageUrl = `${urlObj.protocol}//${urlObj.host}${imageUrl}`;
                    } else if (!imageUrl.startsWith('http')) {
                        imageUrl = new URL(imageUrl, url).toString();
                    }

                    // Remove thumbnail sizes
                    imageUrl = imageUrl.replace(/-\d+x\d+\.(jpg|jpeg|png|webp)$/i, '.$1');

                    // Avoid duplicates
                    if (!seenUrls.has(imageUrl) && !imageUrl.includes('thumbnail')) {
                        seenUrls.add(imageUrl);

                        const alt = $elem.attr('alt') || '';
                        const title = $elem.attr('title') || alt;

                        images.push({
                            url: imageUrl,
                            alt: alt,
                            title: title,
                            filename: imageUrl.split('/').pop().split('?')[0],
                        });
                    }
                }
            });
        });

        // Also find direct links to images
        $('a[href$=".jpg"], a[href$=".jpeg"], a[href$=".png"], a[href$=".webp"]').each((i, elem) => {
            let href = $(elem).attr('href');

            if (href) {
                if (href.startsWith('/')) {
                    const urlObj = new URL(url);
                    href = `${urlObj.protocol}//${urlObj.host}${href}`;
                } else if (!href.startsWith('http')) {
                    href = new URL(href, url).toString();
                }

                if (!seenUrls.has(href)) {
                    seenUrls.add(href);
                    images.push({
                        url: href,
                        alt: $(elem).text() || '',
                        title: $(elem).attr('title') || '',
                        filename: href.split('/').pop().split('?')[0],
                    });
                }
            }
        });

        return NextResponse.json({
            success: true,
            url: url,
            count: images.length,
            images: images,
        });

    } catch (error) {
        console.error('Scrape error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to scrape page' },
            { status: 500 }
        );
    }
}
