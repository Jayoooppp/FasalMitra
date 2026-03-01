'use client';
import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import TopBar from '@/components/layout/TopBar';
import BottomNav from '@/components/layout/BottomNav';

export default function NewsPage() {
    const [news, setNews] = useState<any[]>([]);
    const [weather, setWeather] = useState<any[]>([]);
    const [activeFilter, setActiveFilter] = useState('All');
    const filters = ['All', 'Weather', 'Policy', 'Market', 'Technology', 'Alerts'];

    useEffect(() => {
        api.getNews(activeFilter !== 'All' ? activeFilter : undefined)
            .then(data => { setNews(data.news); if (data.weather) setWeather(data.weather); })
            .catch(() => { });
    }, [activeFilter]);

    return (
        <div className="app">
            <TopBar title="Agri News & Updates" subtitle="Stay informed about farming" backHref="/dashboard" icon="🔔" />
            <div className="scroll">
                <div className="chips">
                    {filters.map(f => <button key={f} className={`chip ${activeFilter === f ? 'active' : ''}`} onClick={() => setActiveFilter(f)}>{f}</button>)}
                </div>

                {weather.length > 0 && (
                    <div className="wx">
                        <div className="wx-title">☁️ 5-Day Weather Forecast</div>
                        <div className="wx-days">
                            {weather.map(w => (
                                <div key={w.day}><div className="wx-dl">{w.day}</div><div className="wx-em">{w.emoji}</div><div className="wx-tmp">{w.temp}</div></div>
                            ))}
                        </div>
                    </div>
                )}

                {news.map(n => n.type === 'feature' ? (
                    <div key={n.id} className="ncard">
                        <div className="nimg">{n.emoji}</div>
                        <div className="nbody">
                            <span className="ntag" style={{ background: n.categoryColor }}>{n.category}</span>
                            <div className="ntitle">{n.title}</div>
                            <div className="ndesc">{n.description}</div>
                            <div className="nfoot"><span className="ntime">🕐 {n.time}</span><span className="nread">Read More ›</span></div>
                        </div>
                    </div>
                ) : (
                    <div key={n.id} className="card" style={{ padding: 0 }}>
                        <div className="ri" style={{ gap: 12, alignItems: 'flex-start' }}>
                            <div style={{ fontSize: 28 }}>{n.emoji}</div>
                            <div>
                                <div style={{ marginBottom: 4 }}><span className="ntag" style={{ fontSize: 10, background: n.categoryColor, padding: '2px 8px', borderRadius: 5, color: '#fff' }}>{n.category}</span></div>
                                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 3 }}>{n.title}</div>
                                <div style={{ fontSize: 11, color: 'var(--sub)' }}>{n.subtitle}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <BottomNav />
        </div>
    );
}
