'use client';

import { useState } from 'react';
import { Download, Link as LinkIcon, Image as ImageIcon, Loader2 } from 'lucide-react';

export default function Page() {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState([]);
    const [error, setError] = useState('');
    const [downloading, setDownloading] = useState(new Set());

    const handleScrape = async (e) => {
        e.preventDefault();
        if (!url) return;

        setLoading(true);
        setError('');
        setImages([]);

        try {
            const response = await fetch('/api/scrape', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to scrape');
            }

            setImages(data.images || []);

            if (data.images.length === 0) {
                setError('No images found on this page');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const downloadImage = async (image) => {
        setDownloading(prev => new Set(prev).add(image.url));

        try {
            const response = await fetch(image.url);
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = image.filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(blobUrl);
        } catch (err) {
            console.error('Download failed:', err);
        } finally {
            setDownloading(prev => {
                const next = new Set(prev);
                next.delete(image.url);
                return next;
            });
        }
    };

    const downloadAll = async () => {
        for (const image of images) {
            await downloadImage(image);
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <ImageIcon className="w-12 h-12 text-indigo-600" />
                        <h1 className="text-4xl font-bold text-gray-900">Photo Scraper</h1>
                    </div>
                    <p className="text-lg text-gray-600 mb-2">
                        Download images from worldwarphotos.info
                    </p>
                    <p className="text-sm text-gray-500">
                        ⚠️ Please respect copyright and terms of service
                    </p>
                </div>

                <form onSubmit={handleScrape} className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Enter Page URL
                    </label>
                    <div className="flex gap-3">
                        <div className="flex-1 relative">
                            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="url"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://www.worldwarphotos.info/germany/luftwaffe/"
                                className="input input-bordered w-full pl-10"
                                disabled={loading}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading || !url}
                            className="btn btn-primary min-w-32"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Scraping...
                                </>
                            ) : (
                                'Find Images'
                            )}
                        </button>
                    </div>
                    {error && (
                        <div className="alert alert-error mt-4">
                            <span>{error}</span>
                        </div>
                    )}
                </form>

                {images.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">
                                Found {images.length} Images
                            </h2>
                            <button
                                onClick={downloadAll}
                                className="btn btn-primary"
                                disabled={downloading.size > 0}
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Download All
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {images.map((image, index) => (
                                <div
                                    key={index}
                                    className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                                >
                                    <div className="aspect-square relative bg-gray-200">
                                        <img
                                            src={image.url}
                                            alt={image.alt || `Image ${index + 1}`}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <p className="text-sm font-medium text-gray-900 truncate mb-1">
                                            {image.title || image.filename}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate mb-3">
                                            {image.filename}
                                        </p>
                                        <button
                                            onClick={() => downloadImage(image)}
                                            disabled={downloading.has(image.url)}
                                            className="btn btn-sm btn-primary w-full"
                                        >
                                            {downloading.has(image.url) ? (
                                                <>
                                                    <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                                                    Downloading...
                                                </>
                                            ) : (
                                                <>
                                                    <Download className="w-3 h-3 mr-2" />
                                                    Download
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {images.length === 0 && !loading && (
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Example URLs</h3>
                        <div className="space-y-2">
                            {[
                                'https://www.worldwarphotos.info/germany/luftwaffe/',
                                'https://www.worldwarphotos.info/usa/usaaf/',
                                'https://www.worldwarphotos.info/uk/raf/',
                            ].map(exampleUrl => (
                                <button
                                    key={exampleUrl}
                                    onClick={() => setUrl(exampleUrl)}
                                    className="block w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition-colors"
                                >
                                    {exampleUrl}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
