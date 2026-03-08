'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useTranslation } from '@/context/LanguageContext';
import { api } from '@/services/api';
import Link from 'next/link';
import BottomNav from '@/components/layout/BottomNav';

// Map OpenWeatherMap icon codes to emojis
function weatherEmoji(icon: string): string {
    const map: Record<string, string> = {
        '01d': '☀️', '01n': '🌙',
        '02d': '⛅', '02n': '☁️',
        '03d': '☁️', '03n': '☁️',
        '04d': '☁️', '04n': '☁️',
        '09d': '🌧️', '09n': '🌧️',
        '10d': '🌦️', '10n': '🌧️',
        '11d': '⛈️', '11n': '⛈️',
        '13d': '❄️', '13n': '❄️',
        '50d': '🌫️', '50n': '🌫️',
    };
    return map[icon] || '🌤️';
}

function aqiEmoji(aqi: number): string {
    return ['🟢', '🟡', '🟠', '🔴', '🟣'][aqi - 1] || '⚪';
}

function getDaysSince(startDate: string | Date): number {
    const start = new Date(startDate);
    const now = new Date();
    return Math.max(0, Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
}

function getProgressPercent(dayCount: number, totalDays: number): number {
    if (!totalDays) return 0;
    return Math.min(100, Math.round((dayCount / totalDays) * 100));
}

interface WeatherData {
    weather: { temp: number; description: string; icon: string; humidity: number };
    airQuality: { aqi: number; label: string; pm25: number };
}

export default function Dashboard() {
    const { user } = useAuth();
    const { showToast } = useToast();
    const t = useTranslation();
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [weatherLoading, setWeatherLoading] = useState(true);
    const [activeCropIndex, setActiveCropIndex] = useState(0);

    const activeCrops = user?.activeCrops || [];
    const primaryCrop = activeCrops[activeCropIndex] || null;

    // Fetch weather on mount
    useEffect(() => {
        if (user?.location) {
            api.getWeather(user.location)
                .then((data: any) => setWeatherData(data))
                .catch(() => setWeatherData(null))
                .finally(() => setWeatherLoading(false));
        } else {
            setWeatherLoading(false);
        }
    }, [user?.location]);

    // Weather display values
    const weatherIcon = weatherData ? weatherEmoji(weatherData.weather.icon) : '☀️';
    const weatherVal = weatherData
        ? `${weatherData.weather.temp}°C ${weatherData.weather.description.charAt(0).toUpperCase() + weatherData.weather.description.slice(1)}`
        : t('dash.weatherVal');
    const aqiIcon = weatherData ? aqiEmoji(weatherData.airQuality.aqi) : '💨';
    const aqiVal = weatherData
        ? `${weatherData.airQuality.label} · PM2.5: ${Math.round(weatherData.airQuality.pm25)}`
        : t('dash.airVal');

    const dayCount = primaryCrop ? getDaysSince(primaryCrop.startDate) : 0;
    const progress = primaryCrop ? getProgressPercent(dayCount, primaryCrop.totalDays || 120) : 0;

    return (
        <div className="app">
            <div className="page page-enter">
                <div className="scroll">
                    {/* Profile Row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                        <Link href="/profile" style={{ width: 42, height: 42, borderRadius: '50%', background: 'var(--green-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19, textDecoration: 'none' }}>👨‍🌾</Link>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 11, color: 'var(--sub)' }}>{t('dash.welcome')}</div>
                            <div style={{ fontSize: 17, fontWeight: 800 }}>{user?.name || t('profile.farmer')}</div>
                        </div>
                        <Link href="/news" className="t-icon" style={{ textDecoration: 'none' }}>🔔</Link>
                    </div>

                    {/* AI Bar */}
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--sub)', marginBottom: 5 }}>{t('dash.askAI')}</div>
                    <Link href="/ai-chat" className="ai-bar" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <span style={{ fontSize: 19 }}>🤖</span>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--green)', marginBottom: 2 }}>{t('dash.aiAssistant')}</div>
                            <div style={{ fontSize: 13, color: 'var(--sub)' }}>{t('dash.aiPlaceholder')}</div>
                        </div>
                        <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" width="15" height="15"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                        </div>
                    </Link>

                    {/* Hero */}
                    <div className="hero">
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,#1B5E20 0%,#2E7D32 60%,#388E3C 100%)' }} />
                        <div style={{ position: 'absolute', right: -10, bottom: -8, fontSize: 110, opacity: 0.12 }}>🌾</div>
                        <div className="hero-content">
                            <h2>{t('dash.heroTitle').split('\n').map((line, i) => <span key={i}>{line}{i === 0 && <br />}</span>)}</h2>
                            <p>{t('dash.heroSub')}</p>
                        </div>
                        <div className="live-badge"><div className="ld" /> Live</div>
                    </div>

                    {/* Stats — Live Weather & AQI */}
                    <div className="stats">
                        <div className="stat">
                            <div className="stat-ico">{weatherLoading ? '⏳' : weatherIcon}</div>
                            <div className="stat-lbl">{t('dash.weather')}</div>
                            <div className="stat-val">{weatherLoading ? '...' : weatherVal}</div>
                        </div>
                        <div className="stat">
                            <div className="stat-ico">{weatherLoading ? '⏳' : aqiIcon}</div>
                            <div className="stat-lbl">{t('dash.airQuality')}</div>
                            <div className="stat-val">{weatherLoading ? '...' : aqiVal}</div>
                        </div>
                    </div>

                    {/* Instant Actions */}
                    <div className="sec-row"><span className="sec-lbl">{t('dash.instantActions')}</span></div>
                    <div className="card mb-16" style={{ padding: 0 }}>
                        {[
                            { href: '/ai-chat', icon: '🤖', title: t('dash.act.aiChat'), sub: t('dash.act.aiChatSub') },
                            { href: '/disease', icon: '🔬', title: t('dash.act.disease'), sub: t('dash.act.diseaseSub') },
                            { href: '/crop', icon: '🌱', title: t('dash.act.crop'), sub: t('dash.act.cropSub') },
                            { href: '/schemes', icon: '📄', title: t('dash.act.schemes'), sub: t('dash.act.schemesSub') },
                            { href: '/market', icon: '📈', title: t('dash.act.market'), sub: t('dash.act.marketSub') },
                            { href: '/labor', icon: '👷', title: t('dash.act.labor'), sub: t('dash.act.laborSub') },
                            { href: '/storage', icon: '🏪', title: t('dash.act.storage'), sub: t('dash.act.storageSub') },
                        ].map((item, i, arr) => (
                            <Link key={item.href} href={item.href} className="ri" style={i === arr.length - 1 ? { borderBottom: 'none', textDecoration: 'none', color: 'inherit' } : { textDecoration: 'none', color: 'inherit' }}>
                                <div className="ril"><div className="rico">{item.icon}</div><div><div className="rtit">{item.title}</div><div className="rsub">{item.sub}</div></div></div>
                                <div className="rarr">›</div>
                            </Link>
                        ))}
                    </div>

                    {/* Active Crops Section */}
                    <div className="sec-row">
                        <span className="sec-lbl">{t('dash.activeCrop')}</span>
                        <Link href="/guide" className="sec-lnk">{t('dash.fullGuide')}</Link>
                    </div>

                    {activeCrops.length === 0 ? (
                        /* Empty state */
                        <div className="card p-16 mb-16" style={{ textAlign: 'center', padding: '20px 16px' }}>
                            <div style={{ fontSize: 36, marginBottom: 8 }}>🌱</div>
                            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>No Active Crops</div>
                            <div style={{ fontSize: 12, color: 'var(--sub)', marginBottom: 14 }}>
                                Get AI-powered crop recommendations to start your farming journey
                            </div>
                            <Link href="/crop" style={{ textDecoration: 'none' }}>
                                <button className="btn btn-g" style={{ padding: '10px 20px', fontSize: 13 }}>
                                    🤖 Get Crop Recommendations
                                </button>
                            </Link>
                        </div>
                    ) : (
                        <>
                            {/* Multi-crop switcher */}
                            {activeCrops.length > 1 && (
                                <div style={{ overflowX: 'auto', display: 'flex', gap: 8, paddingBottom: 4, marginBottom: 8 }}>
                                    {activeCrops.map((c, i) => (
                                        <button
                                            key={c._id}
                                            onClick={() => setActiveCropIndex(i)}
                                            style={{
                                                flexShrink: 0,
                                                padding: '5px 12px',
                                                borderRadius: 20,
                                                border: 'none',
                                                cursor: 'pointer',
                                                fontSize: 12,
                                                fontWeight: 700,
                                                background: i === activeCropIndex ? 'var(--green)' : 'var(--card)',
                                                color: i === activeCropIndex ? '#fff' : 'var(--fg)',
                                                boxShadow: i === activeCropIndex ? '0 2px 8px rgba(76,175,80,0.3)' : 'none',
                                                transition: 'all 0.2s',
                                            }}
                                        >
                                            {c.emoji} {c.name}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {primaryCrop && (
                                <div className="card p-16 mb-16">
                                    <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12 }}>
                                        <span style={{ fontSize: 34 }}>{primaryCrop.emoji}</span>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: 15, fontWeight: 800 }}>{primaryCrop.name} – {primaryCrop.season}</div>
                                            <div style={{ fontSize: 12, color: 'var(--sub)' }}>
                                                Started {new Date(primaryCrop.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} · {primaryCrop.acreage} acres
                                            </div>
                                        </div>
                                        <span className="badge ba">Day {dayCount}</span>
                                    </div>
                                    <div className="prog-bar"><div className="prog-fill" style={{ width: `${progress}%` }} /></div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--sub)', marginTop: 4 }}>
                                        <span>0 {t('guide.days')}</span>
                                        <span style={{ color: 'var(--green)', fontWeight: 600 }}>{progress}% {t('guide.complete')}</span>
                                        <span>{primaryCrop.totalDays || 120} {t('guide.days')}</span>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
            <BottomNav />
        </div>
    );
}
