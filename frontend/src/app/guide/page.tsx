'use client';
import { useState } from 'react';
import { useTranslation } from '@/context/LanguageContext';
import TopBar from '@/components/layout/TopBar';
import BottomNav from '@/components/layout/BottomNav';

export default function GuidePage() {
    const [activeTab, setActiveTab] = useState('timeline');
    const t = useTranslation();

    return (
        <div className="app">
            <TopBar title={t('guide.title')} subtitle={t('guide.subtitle')} backHref="/dashboard" icon="📋" />
            <div className="scroll">
                <div className="card p-16 mb-12">
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12 }}><span style={{ fontSize: 34 }}>🧅</span><div style={{ flex: 1 }}><div style={{ fontSize: 15, fontWeight: 800 }}>Onion – Rabi 2024–25</div><div style={{ fontSize: 12, color: 'var(--sub)' }}>Started Nov 12 · 2.5 acres</div></div><span className="badge ba">Day 78/120</span></div>
                    <div className="prog-bar"><div className="prog-fill" style={{ width: '65%' }} /></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--sub)', marginTop: 4 }}><span>0 {t('guide.days')}</span><span style={{ color: 'var(--green)', fontWeight: 600 }}>65% {t('guide.complete')}</span><span>120 {t('guide.days')}</span></div>
                </div>

                <div className="segs">
                    <button className={`seg ${activeTab === 'timeline' ? 'active' : ''}`} onClick={() => setActiveTab('timeline')}>{t('guide.timeline')}</button>
                    <button className={`seg ${activeTab === 'inputs' ? 'active' : ''}`} onClick={() => setActiveTab('inputs')}>{t('guide.inputs')}</button>
                    <button className={`seg ${activeTab === 'pests' ? 'active' : ''}`} onClick={() => setActiveTab('pests')}>{t('guide.pests')}</button>
                </div>

                {activeTab === 'timeline' && (
                    <div className="card" style={{ padding: 0 }}>
                        {[
                            { status: 'done', label: '✓', title: 'Land Preparation & Nursery', sub: 'Oct 10–Nov 5 · Deep ploughing, raised bed nursery' },
                            { status: 'done', label: '✓', title: 'Transplanting', sub: 'Nov 12–20 · 45-day seedlings at 15×10 cm spacing' },
                            { status: 'now', label: 'NOW', title: 'Bulb Development Stage', sub: 'Jan–Feb 20 · Irrigation every 7–10 days. Apply potash.', highlight: true },
                            { status: 'soon', label: '', title: 'Top Dressing & Final Irrigation', sub: 'Feb 20–Mar 1 · Stop irrigation 15 days before harvest' },
                            { status: 'soon', label: '', title: 'Harvesting', sub: 'Mar 5–12 · When 50% leaves topple' },
                            { status: 'soon', label: '', title: 'Curing & Storage', sub: 'Mar 12+ · Cure in shade 7–10 days before storing', last: true }
                        ].map(ti => (
                            <div key={ti.title} className="tl-item" style={{ padding: '13px 16px', ...(ti.highlight ? { background: '#FFFBEB' } : {}), ...(ti.status === 'soon' ? { opacity: 0.55 } : {}), ...(ti.last ? { borderBottom: 'none' } : {}) }}>
                                <div className={`tl-dot tl-${ti.status}`} style={ti.status === 'now' ? { fontSize: 9 } : {}}>{ti.label}</div>
                                <div><div style={{ fontSize: 14, fontWeight: ti.highlight ? 700 : 600, color: ti.highlight ? '#92400E' : 'inherit' }}>{ti.title}</div><div style={{ fontSize: 12, color: 'var(--sub)', marginTop: 2 }}>{ti.sub}</div></div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'inputs' && (
                    <>
                        <div className="card p-16 mb-12">
                            <div style={{ fontWeight: 700, marginBottom: 11 }}>{t('guide.fertSchedule')}</div>
                            {[
                                { name: 'DAP 18:46 (Basal)', sub: 'At transplanting', amt: '50 kg/acre' },
                                { name: 'Urea (30 days)', sub: 'First top dressing', amt: '65 kg/acre' },
                                { name: 'MOP/Potash (60 days)', sub: 'Bulb development — Due now!', amt: '60 kg/acre', urgent: true }
                            ].map((f, i) => (
                                <div key={f.name} className="ri" style={{ padding: '9px 0', cursor: 'default', ...(i === 2 ? { borderBottom: 'none' } : {}) }}>
                                    <div><div className="rtit" style={{ fontSize: 13 }}>{f.name}</div><div className="rsub">{f.sub}</div></div>
                                    <span style={{ fontSize: 13, fontWeight: 700, ...(f.urgent ? { color: 'var(--red)' } : {}) }}>{f.amt}</span>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {activeTab === 'pests' && (
                    <>
                        <div className="alert alert-w"><span className="alert-ico">⚠️</span><div className="alert-txt"><strong>{t('guide.activeAlert')}</strong> {t('guide.activeAlertMsg')}</div></div>
                        <div className="card p-16 mb-10"><div style={{ fontWeight: 700, marginBottom: 6 }}>🦠 Purple Blotch (Fungal)</div><div style={{ fontSize: 12, color: 'var(--sub)', marginBottom: 8 }}>Purple/brown spots on leaves. 30–50% yield loss possible.</div><div style={{ fontSize: 12, fontWeight: 700, color: 'var(--green)', marginBottom: 3 }}>{t('guide.treatment')}</div><div style={{ fontSize: 12, color: 'var(--sub)' }}>Mancozeb 75WP @ 2g/lit or Propiconazole 25EC @ 1ml/lit. Repeat after 10 days.</div></div>
                        <div className="card p-16 mb-12"><div style={{ fontWeight: 700, marginBottom: 6 }}>🐛 Thrips</div><div style={{ fontSize: 12, color: 'var(--sub)', marginBottom: 8 }}>Silvery streaks on leaves. Use blue sticky traps as early warning.</div><div style={{ fontSize: 12, fontWeight: 700, color: 'var(--green)', marginBottom: 3 }}>{t('guide.treatment')}</div><div style={{ fontSize: 12, color: 'var(--sub)' }}>Spinosad 45SC @ 0.3 ml/lit or Neem oil 3% in evenings.</div></div>
                    </>
                )}
            </div>
            <BottomNav />
        </div>
    );
}
