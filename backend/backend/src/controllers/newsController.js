// News Controller — fetches live news from NewsAPI.org
// Builds personalized queries from user profile (crops, location, soil)
// Falls back to curated static news if NEWS_API_KEY is not configured

const NEWSAPI_BASE = 'https://newsapi.org/v2';

// In-memory cache: key -> { data, expiresAt }
const cache = new Map();
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

function getCached(key) {
    const cached = cache.get(key);
    if (cached && Date.now() < cached.expiresAt) return cached.data;
    cache.delete(key);
    return null;
}

function setCache(key, data) {
    cache.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS });
}

// Map category filter values to NewsAPI-friendly keywords
const CATEGORY_QUERIES = {
    'weather': 'india farming weather rain monsoon drought flood',
    'policy': 'india agriculture government scheme PM-KISAN MSP farmer policy subsidy',
    'market': 'india crop price mandi market agriculture commodity onion wheat rice soybean',
    'technology': 'india agriculture technology drone irrigation startup farming innovation',
    'alerts': 'india farmer alert pest disease crop damage flood drought locust',
};

// Emoji mapping by keyword match
function guessEmoji(title = '', category = '') {
    const t = title.toLowerCase();
    if (t.includes('rain') || t.includes('flood') || t.includes('drought')) return '🌧️';
    if (t.includes('price') || t.includes('market') || t.includes('mandi')) return '📈';
    if (t.includes('pest') || t.includes('disease') || t.includes('locust')) return '🦗';
    if (t.includes('scheme') || t.includes('subsidy') || t.includes('kisan') || t.includes('pm-kisan')) return '🏛️';
    if (t.includes('drone') || t.includes('technology') || t.includes('app') || t.includes('digital')) return '🚁';
    if (t.includes('wheat') || t.includes('rice') || t.includes('paddy')) return '🌾';
    if (t.includes('onion') || t.includes('tomato') || t.includes('vegetable')) return '🧅';
    if (t.includes('cotton')) return '☁️';
    if (t.includes('soybean')) return '🫘';
    if (t.includes('export') || t.includes('import')) return '🚢';
    if (t.includes('soil') || t.includes('fertilizer')) return '🌱';
    const cat = category.toLowerCase();
    if (cat.includes('weather')) return '🌤️';
    if (cat.includes('policy') || cat.includes('government')) return '📋';
    if (cat.includes('market')) return '📊';
    if (cat.includes('technology')) return '💡';
    return '🌾';
}

function getCategoryColor(category) {
    const colors = {
        'Weather': '#0891B2',
        'Policy': '#7C3AED',
        'Market': '#2563EB',
        'Technology': '#059669',
        'Alerts': '#DC2626',
        'General': '#374151',
    };
    return colors[category] || '#374151';
}

function guessCategory(title = '', description = '') {
    const text = (title + ' ' + description).toLowerCase();
    if (text.includes('rain') || text.includes('weather') || text.includes('monsoon') || text.includes('flood') || text.includes('drought')) return 'Weather';
    if (text.includes('price') || text.includes('market') || text.includes('mandi') || text.includes('export') || text.includes('commodity')) return 'Market';
    if (text.includes('scheme') || text.includes('subsidy') || text.includes('kisan') || text.includes('policy') || text.includes('government') || text.includes('ministry')) return 'Policy';
    if (text.includes('drone') || text.includes('technology') || text.includes('app') || text.includes('digital') || text.includes('sensor')) return 'Technology';
    if (text.includes('pest') || text.includes('disease') || text.includes('damage') || text.includes('loss') || text.includes('locust')) return 'Alerts';
    return 'General';
}

function timeAgo(dateStr) {
    if (!dateStr) return 'Recently';
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}

// Transform a NewsAPI article into our app's format
function transformArticle(article, idx) {
    const cat = guessCategory(article.title, article.description);
    return {
        id: article.url || `article-${idx}`,
        type: idx === 0 ? 'feature' : 'compact',
        category: cat,
        categoryColor: getCategoryColor(cat),
        emoji: guessEmoji(article.title, cat),
        title: article.title?.replace(/ - [^-]+$/, '') || 'Untitled',         // strip source suffix
        description: article.description || '',
        subtitle: `${article.source?.name || 'News'} · ${timeAgo(article.publishedAt)}`,
        time: timeAgo(article.publishedAt),
        url: article.url,
        source: article.source?.name,
        publishedAt: article.publishedAt,
    };
}

// Build a smart query from profile: crops + location + category
function buildQuery(crops = [], location = '', category = '') {
    const cropTerms = crops.slice(0, 3).join(' OR ');

    if (category && CATEGORY_QUERIES[category.toLowerCase()]) {
        const base = CATEGORY_QUERIES[category.toLowerCase()];
        // If user has crops, mix them in for relevance
        if (cropTerms) {
            return `(${base}) AND india`;
        }
        return `${base} india`;
    }

    // Default: combine crops + agriculture india
    const parts = [];
    if (cropTerms) parts.push(`(${cropTerms})`);
    parts.push('agriculture india farming');
    if (location) parts.push(location.split(',')[0].trim());

    return parts.join(' ');
}

async function fetchFromNewsAPI(query, apiKey) {
    const now = new Date();
    // Go back 7 days for freshness (free tier supports recent articles)
    const from = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const url = `${NEWSAPI_BASE}/everything?` + new URLSearchParams({
        q: query,
        from,
        language: 'en',
        sortBy: 'publishedAt',
        pageSize: '20',
        apiKey,
    });

    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok || data.status !== 'ok') {
        throw new Error(data.message || `NewsAPI error: ${res.status}`);
    }

    return data.articles || [];
}

// Static fallback articles (used when API key not configured or fetch fails)
const STATIC_NEWS = [
    {
        id: 'static-pm-kisan',
        type: 'feature',
        category: 'Policy',
        categoryColor: '#7C3AED',
        emoji: '🏛️',
        title: 'PM-KISAN: Ensure Aadhaar-bank linking to receive benefits',
        description: '₹6,000 annual benefit will be credited directly. Verify your details at pmkisan.gov.in.',
        time: 'Official',
        subtitle: 'Government of India · Official',
    },
    {
        id: 'static-msp',
        type: 'compact',
        category: 'Policy',
        categoryColor: '#7C3AED',
        emoji: '📋',
        title: 'MSP for Rabi crops announced — wheat at ₹2,275/quintal',
        subtitle: 'Ministry of Agriculture · Official',
    },
    {
        id: 'static-market',
        type: 'compact',
        category: 'Market',
        categoryColor: '#2563EB',
        emoji: '📈',
        title: 'Vegetable prices rise on supply disruption from unseasonal rains',
        subtitle: 'Agri Market · Recent',
    },
    {
        id: 'static-tech',
        type: 'compact',
        category: 'Technology',
        categoryColor: '#059669',
        emoji: '🚁',
        title: 'Drone spraying subsidy extended to more districts',
        subtitle: 'AgriTech India · Recent',
    },
];

exports.getAll = async (req, res) => {
    try {
        const apiKey = process.env.NEWS_API_KEY;
        const { category, crops, location } = req.query;

        // Parse crops (sent as comma-separated from frontend)
        const cropList = crops ? crops.split(',').map(c => c.trim()).filter(Boolean) : [];

        // If no API key — return static fallback immediately
        if (!apiKey) {
            let result = STATIC_NEWS;
            if (category && category !== 'All') {
                result = STATIC_NEWS.filter(n => n.category.toLowerCase() === category.toLowerCase());
            }
            return res.json({
                news: result,
                source: 'static',
                message: 'Set NEWS_API_KEY in .env for live news',
            });
        }

        // Build cache key
        const cacheKey = `news:${category || 'all'}:${cropList.join(',')}:${location || ''}`;
        const cached = getCached(cacheKey);
        if (cached) {
            return res.json({ ...cached, fromCache: true });
        }

        // Build personalized query
        const query = buildQuery(cropList, location, category !== 'All' ? category : '');

        let articles = [];
        try {
            articles = await fetchFromNewsAPI(query, apiKey);
        } catch (err) {
            console.warn('NewsAPI fetch failed:', err.message);
            // Fall back to static on error
            return res.json({
                news: STATIC_NEWS,
                source: 'static_fallback',
                error: err.message,
            });
        }

        // Transform + deduplicate by title
        const seen = new Set();
        const transformed = [];
        for (const article of articles) {
            if (!article.title || article.title === '[Removed]') continue;
            const key = article.title.slice(0, 50);
            if (seen.has(key)) continue;
            seen.add(key);
            transformed.push(transformArticle(article, transformed.length));
            if (transformed.length >= 15) break;
        }

        // If NewsAPI returned nothing useful, use static
        if (transformed.length === 0) {
            return res.json({ news: STATIC_NEWS, source: 'static_fallback' });
        }

        const responseData = {
            news: transformed,
            source: 'newsapi',
            query,
            total: transformed.length,
        };

        setCache(cacheKey, responseData);
        res.json(responseData);

    } catch (error) {
        console.error('News controller error:', error.message);
        res.json({ news: STATIC_NEWS, source: 'static_fallback', error: error.message });
    }
};
