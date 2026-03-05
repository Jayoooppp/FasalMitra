'use client';
import { useState } from 'react';
import { useToast } from '@/context/ToastContext';
import { useTranslation } from '@/context/LanguageContext';
import TopBar from '@/components/layout/TopBar';
import BottomNav from '@/components/layout/BottomNav';

export default function StoragePage() {
    const [activeTab, setActiveTab] = useState('tips');
    const { showToast } = useToast();
    const t = useTranslation();

    return (
        <div className="app">
            <TopBar title={t('storage.title')} subtitle={t('storage.subtitle')} backHref="/dashboard" icon="🏪" />
            <div className="scroll">
                <div className="segs">
                    <button className={`seg ${activeTab === 'tips' ? 'active' : ''}`} onClick={() => setActiveTab('tips')}>{t('storage.tips')}</button>
                    <button className={`seg ${activeTab === 'book' ? 'active' : ''}`} onClick={() => setActiveTab('book')}>{t('storage.book')}</button>
                    <button className={`seg ${activeTab === 'recycle' ? 'active' : ''}`} onClick={() => setActiveTab('recycle')}>{t('storage.agriWaste')}</button>
                </div>

                {activeTab === 'tips' && (
                    <>
                        <div className="alert alert-w"><span className="alert-ico">🌡️</span><div className="alert-txt"><strong>{t('storage.alert')}</strong> {t('storage.alertMsg')}</div></div>
                        <div className="card" style={{ padding: 0 }}>
                            {[
                                { icon: '🌡️', title: 'Temperature & Humidity', sub: '25–30°C, 65–70% humidity. Wire mesh for airflow.' },
                                { icon: '🏗️', title: 'Structure Type', sub: 'Elevated bamboo platforms with thatched roof.' },
                                { icon: '🔍', title: 'Regular Inspection', sub: 'Check weekly. Remove rotting bulbs. Expected loss: 8–12%.' },
                                { icon: '❄️', title: 'Cold Storage', sub: 'Extends shelf life to 6 months. ₹2.50–4/kg/month.' }
                            ].map((tip, i, arr) => (
                                <div key={tip.title} className="ri" style={{ cursor: 'default', gap: 14, ...(i === arr.length - 1 ? { borderBottom: 'none' } : {}) }}>
                                    <span style={{ fontSize: 24 }}>{tip.icon}</span><div><div className="rtit">{tip.title}</div><div className="rsub">{tip.sub}</div></div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {activeTab === 'book' && (
                    <>
                        <div className="storage-facility">
                            <div className="sf-header"><div><div className="sf-name">Nashik Cold Chain Pvt. Ltd.</div><div className="sf-sub">📍 Lasalgaon · 12 km</div></div><span className="badge bg">Open</span></div>
                            <div className="sf-grid"><div className="sf-stat"><div className="sf-stat-lbl">{t('storage.rate')}</div><div className="sf-stat-val">₹3/kg/mo</div></div><div className="sf-stat"><div className="sf-stat-lbl">{t('storage.available')}</div><div className="sf-stat-val">120 MT</div></div></div>
                            <button className="btn btn-g btn-sm btn-full" onClick={() => showToast(t('storage.bookingConfirm'))}>{t('storage.bookNow')}</button>
                        </div>
                        <div className="storage-facility">
                            <div className="sf-header"><div><div className="sf-name">NAFED Warehouse, Niphad</div><div className="sf-sub">📍 Niphad · 8 km · Govt.</div></div><span className="badge ba">Low Space</span></div>
                            <div className="sf-grid"><div className="sf-stat"><div className="sf-stat-lbl">{t('storage.rate')}</div><div className="sf-stat-val">₹2.50/kg/mo</div></div><div className="sf-stat" style={{ background: '#FEF3C7' }}><div className="sf-stat-lbl">{t('storage.available')}</div><div className="sf-stat-val" style={{ color: '#92400E' }}>42 MT only</div></div></div>
                            <button className="btn btn-g btn-sm btn-full" onClick={() => showToast(t('storage.bookingConfirm'))}>{t('storage.bookQuickly')}</button>
                        </div>
                    </>
                )}

                {activeTab === 'recycle' && (
                    <>
                        {[
                            { icon: '🧅', title: 'Onion Leaves & Tops', desc: 'Sell to dairy farmers as cattle fodder. Used for compost & biogas.', badge: '₹800–1,200/T', badgeClass: 'bg' },
                            { icon: '🌾', title: 'Crop Stubble', desc: "Don't burn! Sell to paper mills, energy plants, or mushroom growers.", badge: 'Multiple Uses', badgeClass: 'ba' },
                            { icon: '♻️', title: 'Vermicompost', desc: 'Convert animal dung into vermicompost. Earn ₹8–12/kg.', badge: '₹8–12/kg', badgeClass: 'bg' },
                            { icon: '⚡', title: 'Biogas from Agri Waste', desc: '2m³ plant provides free cooking gas. MNRE subsidy available.', badge: 'Subsidy ₹7K–18K', badgeClass: 'bb' }
                        ].map(r => (
                            <div key={r.title} className="recycle-card"><div className="rc-icon">{r.icon}</div><div className="rc-body"><div className="rc-title">{r.title}</div><div className="rc-desc">{r.desc}</div><div style={{ marginTop: 7 }}><span className={`badge ${r.badgeClass}`}>{r.badge}</span></div></div></div>
                        ))}
                    </>
                )}
            </div>
            <BottomNav />
        </div>
    );
}
