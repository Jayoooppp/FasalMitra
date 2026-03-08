'use client';
import { useState, useEffect, useCallback } from 'react';
import { api } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/context/LanguageContext';
import TopBar from '@/components/layout/TopBar';
import BottomNav from '@/components/layout/BottomNav';

const FILTERS = [
    { key: 'news.all', value: 'All' },
    { key: 'news.market', value: 'Market' },
    { key: 'news.policy', value: 'Policy' },
    { key: 'news.weather', value: 'Weather' },
    { key: 'news.technology', value: 'Technology' },
    { key: 'news.alerts', value: 'Alerts' },
];

interface NewsArticle {
    id: string;
    type: 'feature' | 'compact';
    category: string;
    categoryColor: string;
    emoji: string;
    title: string;
    description?: string;
    subtitle?: string;
    time?: string;
    url?: string;
    source?: string;
    publishedAt?: string;
}

export default function NewsPage() {
    const t = useTranslation();
    const { user } = useAuth();
    const [news, setNews] = useState<NewsArticle[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLive, setIsLive] = useState(false);
    const [activeIdx, setActiveIdx] = useState(0);
    const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

    // Extract user context for personalization
    const cropNames = (user?.activeCrops || []).map(c => c.name);
    const location = user?.location || '';

    const fetchNews = useCallback(async (categoryIdx: number, isRefresh = false) => {
        if (isRefresh) setRefreshing(true);
        else setLoading(true);
        setError(null);

        try {
            const category = FILTERS[categoryIdx].value;
            const data = await api.getNews({
                category: category !== 'All' ? category : undefined,
                crops: cropNames.length > 0 ? cropNames : undefined,
                location: location || undefined,
            });

            setNews(data.news || []);
            setIsLive(data.source === 'newsapi');
            setLastRefreshed(new Date());
        } catch (err: any) {
            setError(err.message || 'Failed to load news');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [cropNames.join(','), location]);

    useEffect(() => {
        fetchNews(activeIdx);
    }, [activeIdx, fetchNews]);

    const handleTabChange = (idx: number) => {
        setActiveIdx(idx);
    };

    const handleRefresh = () => {
        fetchNews(activeIdx, true);
    };

    const openArticle = (url?: string) => {
        if (url) window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="app">
            <TopBar title={t('news.title')} subtitle={t('news.subtitle')} backHref="/dashboard" icon="🔔" />
            <div className="scroll">

                {/* Personalization header */}
                {(cropNames.length > 0 || location) && (
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '8px 12px', marginBottom: 10,
                        background: 'var(--card)', borderRadius: 10,
                        border: '1px solid var(--bdr)',
                        fontSize: 12,
                    }}>
                        <span style={{ fontSize: 16 }}>🎯</span>
                        <div style={{ flex: 1 }}>
                            <span style={{ fontWeight: 700, color: 'var(--fg)' }}>Personalized for you</span>
                            <span style={{ color: 'var(--sub)', marginLeft: 6 }}>
                                {[
                                    cropNames.length > 0 && cropNames.slice(0, 2).join(', '),
                                    location && location.split(',')[0],
                                ].filter(Boolean).join(' · ')}
                            </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            {isLive ? (
                                <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--green)', fontWeight: 700 }}>
                                    <span style={{
                                        width: 7, height: 7, borderRadius: '50%',
                                        background: 'var(--green)',
                                        display: 'inline-block',
                                        animation: 'pulse 1.5s infinite',
                                    }} />
                                    Live
                                </span>
                            ) : (
                                <span style={{ color: 'var(--sub)' }}>Cached</span>
                            )}
                            <button
                                onClick={handleRefresh}
                                disabled={refreshing}
                                style={{
                                    background: 'none', border: 'none', cursor: 'pointer',
                                    fontSize: 15, padding: '2px 4px',
                                    opacity: refreshing ? 0.4 : 1,
                                    transition: 'transform 0.3s',
                                    transform: refreshing ? 'rotate(360deg)' : 'none',
                                }}
                                title="Refresh news"
                            >
                                🔄
                            </button>
                        </div>
                    </div>
                )}

                {/* Category filter chips */}
                <div className="chips">
                    {FILTERS.map((f, i) => (
                        <button
                            key={f.key}
                            className={`chip ${activeIdx === i ? 'active' : ''}`}
                            onClick={() => handleTabChange(i)}
                        >
                            {t(f.key)}
                        </button>
                    ))}
                </div>

                {/* Loading skeleton */}
                {loading && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {[1, 2, 3].map(i => (
                            <div key={i} className="card p-16" style={{ animation: 'pulse 1.4s ease-in-out infinite' }}>
                                <div style={{ height: 14, background: 'var(--inp)', borderRadius: 6, marginBottom: 10, width: '70%' }} />
                                <div style={{ height: 10, background: 'var(--inp)', borderRadius: 6, marginBottom: 6, width: '90%' }} />
                                <div style={{ height: 10, background: 'var(--inp)', borderRadius: 6, width: '50%' }} />
                            </div>
                        ))}
                    </div>
                )}

                {/* Error state */}
                {!loading && error && (
                    <div className="alert alert-w mb-12">
                        <span className="alert-ico">⚠️</span>
                        <div className="alert-txt">
                            <strong>Could not load news</strong><br />
                            <span style={{ fontSize: 11 }}>{error}</span>
                        </div>
                    </div>
                )}

                {/* Refreshing overlay spinner */}
                {refreshing && (
                    <div style={{ textAlign: 'center', padding: '8px 0', fontSize: 12, color: 'var(--sub)' }}>
                        <span className="spinner" style={{ display: 'inline-block', marginRight: 6 }} />
                        Fetching latest news…
                    </div>
                )}

                {/* News cards */}
                {!loading && news.map(n => n.type === 'feature' ? (
                    <div
                        key={n.id}
                        className="ncard"
                        style={{ cursor: n.url ? 'pointer' : 'default' }}
                        onClick={() => openArticle(n.url)}
                    >
                        <div className="nimg">{n.emoji}</div>
                        <div className="nbody">
                            <span className="ntag" style={{ background: n.categoryColor }}>{n.category}</span>
                            <div className="ntitle">{n.title}</div>
                            {n.description && (
                                <div className="ndesc" style={{ WebkitLineClamp: 3 }}>{n.description}</div>
                            )}
                            <div className="nfoot">
                                <span className="ntime">🕐 {n.time}</span>
                                {n.source && <span style={{ fontSize: 10, color: 'var(--sub)', marginLeft: 6 }}>{n.source}</span>}
                                {n.url && (
                                    <span className="nread" style={{ marginLeft: 'auto' }}>
                                        {t('news.readMore')} ↗
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div
                        key={n.id}
                        className="card"
                        style={{ padding: 0, cursor: n.url ? 'pointer' : 'default' }}
                        onClick={() => openArticle(n.url)}
                    >
                        <div className="ri" style={{ gap: 12, alignItems: 'flex-start' }}>
                            <div style={{ fontSize: 28, flexShrink: 0 }}>{n.emoji}</div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ marginBottom: 4 }}>
                                    <span className="ntag" style={{ fontSize: 10, background: n.categoryColor, padding: '2px 8px', borderRadius: 5, color: '#fff' }}>
                                        {n.category}
                                    </span>
                                </div>
                                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 3, lineHeight: 1.4 }}>{n.title}</div>
                                <div style={{ fontSize: 11, color: 'var(--sub)' }}>{n.subtitle}</div>
                            </div>
                            {n.url && (
                                <div style={{ color: 'var(--sub)', fontSize: 16, flexShrink: 0 }}>↗</div>
                            )}
                        </div>
                    </div>
                ))}

                {/* Empty state */}
                {!loading && !error && news.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '48px 24px' }}>
                        <div style={{ fontSize: 48, marginBottom: 12 }}>📰</div>
                        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>No news found</div>
                        <div style={{ fontSize: 12, color: 'var(--sub)', marginBottom: 16 }}>
                            Try a different category or refresh
                        </div>
                        <button className="btn btn-ghost" onClick={handleRefresh}>🔄 Refresh</button>
                    </div>
                )}

                {/* Last updated footer */}
                {lastRefreshed && !loading && (
                    <div style={{ textAlign: 'center', fontSize: 10, color: 'var(--sub)', padding: '8px 0 4px', marginTop: 4 }}>
                        Last updated {lastRefreshed.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        {isLive ? ' · Live from NewsAPI' : ' · Curated content'}
                    </div>
                )}
            </div>
            <BottomNav />
        </div>
    );
}
