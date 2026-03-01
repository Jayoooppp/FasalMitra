'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import Link from 'next/link';
import BottomNav from '@/components/layout/BottomNav';

export default function Dashboard() {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [tasks, setTasks] = useState([
        { id: 1, title: 'Irrigate Onion Field (Block A)', due: 'Due today · 2.5 acres', priority: 'amber' as const, done: true },
        { id: 2, title: 'Apply Potash fertilizer', due: 'Due tomorrow · 60 kg/acre', priority: 'green' as const, done: false },
        { id: 3, title: 'Check for Purple Blotch disease', due: 'Overdue · Inspect all plants', priority: 'red' as const, done: false },
        { id: 4, title: 'Update crop log', due: 'This week', priority: 'green' as const, done: false },
    ]);

    const toggleTask = (id: number) => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
        showToast('Task completed! ✅');
    };

    return (
        <div className="app">
            <div className="page page-enter">
                <div className="scroll">
                    {/* Profile Row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                        <Link href="/profile" style={{ width: 42, height: 42, borderRadius: '50%', background: 'var(--green-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19, textDecoration: 'none' }}>👨‍🌾</Link>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 11, color: 'var(--sub)' }}>Welcome Back</div>
                            <div style={{ fontSize: 17, fontWeight: 800 }}>{user?.name || 'Farmer'}</div>
                        </div>
                        <Link href="/news" className="t-icon" style={{ textDecoration: 'none' }}>🔔</Link>
                    </div>

                    {/* AI Bar */}
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--sub)', marginBottom: 5 }}>Ask FasalMitra AI</div>
                    <Link href="/ai-chat" className="ai-bar" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <span style={{ fontSize: 19 }}>🤖</span>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--green)', marginBottom: 2 }}>AI Assistant</div>
                            <div style={{ fontSize: 13, color: 'var(--sub)' }}>What crop should I grow this season?</div>
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
                            <h2>Shaping the Future of<br />Modern Farming</h2>
                            <p>AI-powered insights for better yields</p>
                        </div>
                        <div className="live-badge"><div className="ld" /> Live</div>
                    </div>

                    {/* Stats */}
                    <div className="stats">
                        <div className="stat"><div className="stat-ico">🌱</div><div className="stat-lbl">Soil Health</div><div className="stat-val">Healthy</div></div>
                        <div className="stat"><div className="stat-ico">☀️</div><div className="stat-lbl">Weather</div><div className="stat-val">28°C Sunny</div></div>
                        <div className="stat"><div className="stat-ico">💨</div><div className="stat-lbl">Air Quality</div><div className="stat-val">Clean · Safe</div></div>
                    </div>

                    {/* Alerts */}
                    <div className="alert alert-w"><span className="alert-ico">⚠️</span><div className="alert-txt"><strong>Pest Alert:</strong> Aphid infestation risk high in your region. Check onion leaves today.</div></div>
                    <div className="alert alert-g"><span className="alert-ico">✅</span><div className="alert-txt"><strong>PM-Kisan:</strong> ₹2,000 installment credited to your account today!</div></div>

                    {/* Tasks */}
                    <div className="sec-row"><span className="sec-lbl">Today&apos;s Tasks</span><Link href="/guide" className="sec-lnk">View All</Link></div>
                    <div className="card p-16 mb-12">
                        {tasks.map(t => (
                            <div key={t.id} className="task-item">
                                <div className={`task-dot ${t.priority}`} />
                                <div>
                                    <div className="task-txt">{t.title}</div>
                                    <div className="task-due">{t.due}</div>
                                </div>
                                <div className={`task-check ${t.done ? 'done' : ''}`} onClick={() => toggleTask(t.id)}>
                                    {t.done ? '✓' : ''}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Instant Actions */}
                    <div className="sec-row"><span className="sec-lbl">Instant Actions</span></div>
                    <div className="card mb-16" style={{ padding: 0 }}>
                        {[
                            { href: '/ai-chat', icon: '🤖', title: 'AI Farm Assistant', sub: 'Chat, voice & smart advice' },
                            { href: '/disease', icon: '🔬', title: 'Disease Detection', sub: 'Upload photo for diagnosis' },
                            { href: '/crop', icon: '🌱', title: 'Crop Recommendation', sub: 'AI-powered crop suggestions' },
                            { href: '/schemes', icon: '📄', title: 'Government Schemes', sub: 'Subsidies & benefits' },
                            { href: '/market', icon: '📈', title: 'Market Prices', sub: 'Live mandi prices & sell' },
                            { href: '/soil', icon: '🧪', title: 'Soil Analytics', sub: 'pH, nutrients & health score' },
                            { href: '/labor', icon: '👷', title: 'Find Laborers', sub: 'Hire workers for your farm' },
                            { href: '/storage', icon: '🏪', title: 'Storage & Recycling', sub: 'Post-harvest management' },
                        ].map((item, i, arr) => (
                            <Link key={item.href} href={item.href} className="ri" style={i === arr.length - 1 ? { borderBottom: 'none', textDecoration: 'none', color: 'inherit' } : { textDecoration: 'none', color: 'inherit' }}>
                                <div className="ril"><div className="rico">{item.icon}</div><div><div className="rtit">{item.title}</div><div className="rsub">{item.sub}</div></div></div>
                                <div className="rarr">›</div>
                            </Link>
                        ))}
                    </div>

                    {/* Active Crop */}
                    <div className="sec-row"><span className="sec-lbl">Active Crop</span><Link href="/guide" className="sec-lnk">Full Guide</Link></div>
                    <div className="card p-16 mb-16">
                        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12 }}>
                            <span style={{ fontSize: 34 }}>🧅</span>
                            <div style={{ flex: 1 }}><div style={{ fontSize: 15, fontWeight: 800 }}>Onion – Rabi 2024–25</div><div style={{ fontSize: 12, color: 'var(--sub)' }}>Started Nov 12 · 2.5 acres</div></div>
                            <span className="badge ba">Day 78</span>
                        </div>
                        <div className="prog-bar"><div className="prog-fill" style={{ width: '65%' }} /></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--sub)', marginTop: 4 }}><span>0 days</span><span style={{ color: 'var(--green)', fontWeight: 600 }}>65% complete</span><span>120 days</span></div>
                    </div>
                </div>
            </div>
            <BottomNav />
        </div>
    );
}
