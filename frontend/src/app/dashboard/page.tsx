'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useTranslation } from '@/context/LanguageContext';
import Link from 'next/link';
import BottomNav from '@/components/layout/BottomNav';

export default function Dashboard() {
    const { user } = useAuth();
    const { showToast } = useToast();
    const t = useTranslation();
    const [tasks, setTasks] = useState([
        { id: 1, title: 'Irrigate Onion Field (Block A)', due: 'Due today · 2.5 acres', priority: 'amber' as const, done: true },
        { id: 2, title: 'Apply Potash fertilizer', due: 'Due tomorrow · 60 kg/acre', priority: 'green' as const, done: false },
        { id: 3, title: 'Check for Purple Blotch disease', due: 'Overdue · Inspect all plants', priority: 'red' as const, done: false },
        { id: 4, title: 'Update crop log', due: 'This week', priority: 'green' as const, done: false },
    ]);

    const toggleTask = (id: number) => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
        showToast(t('dash.taskCompleted'));
    };

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

                    {/* Stats */}
                    <div className="stats">
                        <div className="stat"><div className="stat-ico">☀️</div><div className="stat-lbl">{t('dash.weather')}</div><div className="stat-val">{t('dash.weatherVal')}</div></div>
                        <div className="stat"><div className="stat-ico">💨</div><div className="stat-lbl">{t('dash.airQuality')}</div><div className="stat-val">{t('dash.airVal')}</div></div>
                    </div>

                    {/* Alerts */}
                    <div className="alert alert-w"><span className="alert-ico">⚠️</span><div className="alert-txt"><strong>{t('dash.pestAlert')}</strong> {t('dash.pestMsg')}</div></div>
                    <div className="alert alert-g"><span className="alert-ico">✅</span><div className="alert-txt"><strong>{t('dash.pmKisan')}</strong> {t('dash.pmKisanMsg')}</div></div>

                    {/* Tasks */}
                    <div className="sec-row"><span className="sec-lbl">{t('dash.todaysTasks')}</span><Link href="/guide" className="sec-lnk">{t('dash.viewAll')}</Link></div>
                    <div className="card p-16 mb-12">
                        {tasks.map(tk => (
                            <div key={tk.id} className="task-item">
                                <div className={`task-dot ${tk.priority}`} />
                                <div>
                                    <div className="task-txt">{tk.title}</div>
                                    <div className="task-due">{tk.due}</div>
                                </div>
                                <div className={`task-check ${tk.done ? 'done' : ''}`} onClick={() => toggleTask(tk.id)}>
                                    {tk.done ? '✓' : ''}
                                </div>
                            </div>
                        ))}
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

                    {/* Active Crop */}
                    <div className="sec-row"><span className="sec-lbl">{t('dash.activeCrop')}</span><Link href="/guide" className="sec-lnk">{t('dash.fullGuide')}</Link></div>
                    <div className="card p-16 mb-16">
                        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12 }}>
                            <span style={{ fontSize: 34 }}>🧅</span>
                            <div style={{ flex: 1 }}><div style={{ fontSize: 15, fontWeight: 800 }}>Onion – Rabi 2024–25</div><div style={{ fontSize: 12, color: 'var(--sub)' }}>Started Nov 12 · 2.5 acres</div></div>
                            <span className="badge ba">Day 78</span>
                        </div>
                        <div className="prog-bar"><div className="prog-fill" style={{ width: '65%' }} /></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--sub)', marginTop: 4 }}><span>0 {t('guide.days')}</span><span style={{ color: 'var(--green)', fontWeight: 600 }}>65% {t('guide.complete')}</span><span>120 {t('guide.days')}</span></div>
                    </div>
                </div>
            </div>
            <BottomNav />
        </div>
    );
}
