'use client';

import { useState, useEffect } from 'react';
import { Markdown } from '../../components/markdown';

const tagName = 'randomWiki';
const randomWikiUrl = 'https://en.wikipedia.org/api/rest_v1/page/random/summary';
const maxExtractLength = 200;

const explainer = `
This page demonstrates client-side data fetching from Wikipedia's random article API.

The component fetches a random Wikipedia article when the page loads or when you click the "Get New Article" button.

~~~jsx
const url = 'https://en.wikipedia.org/api/rest_v1/page/random/summary';

function RandomArticleComponent() {
    const [article, setArticle] = useState(null);

    useEffect(() => {
        fetch(url).then(res => res.json()).then(setArticle);
    }, []);
    // ...render
}
~~~

This approach uses client-side rendering to avoid build-time network issues while still providing dynamic content.
`;

export default function Page() {
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchArticle = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(randomWikiUrl);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            const data = await response.json();
            setArticle(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticle();
    }, []);

    return (
        <>
            <h1>Random Wikipedia Article</h1>
            <Markdown content={explainer} />
            <button
                className="btn btn-primary mt-4"
                onClick={fetchArticle}
                disabled={loading}
            >
                {loading ? 'Loading...' : 'Get New Article'}
            </button>
            <RandomWikiArticle article={article} loading={loading} error={error} />
        </>
    );
}

function RandomWikiArticle({ article, loading, error }) {
    if (loading) {
        return (
            <div className="bg-white text-neutral-600 card my-6 max-w-2xl">
                <div className="card-body py-4">
                    <p className="italic">Loading random Wikipedia article...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white text-neutral-600 card my-6 max-w-2xl">
                <div className="card-body py-4">
                    <p className="text-red-600">Error: {error}</p>
                </div>
            </div>
        );
    }

    if (!article) {
        return null;
    }

    let extract = article.extract;
    if (extract && extract.length > maxExtractLength) {
        extract = extract.slice(0, extract.slice(0, maxExtractLength).lastIndexOf(' ')) + ' [...]';
    }

    return (
        <div className="bg-white text-neutral-600 card my-6 max-w-2xl">
            <div className="card-title text-3xl px-8 pt-8">{article.title}</div>
            <div className="card-body py-4">
                <div className="text-lg font-bold">{article.description}</div>
                <p className="italic">{extract}</p>
                <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={article.content_urls?.desktop?.page}
                    className="link link-primary"
                >
                    Read more on Wikipedia →
                </a>
            </div>
        </div>
    );
}
