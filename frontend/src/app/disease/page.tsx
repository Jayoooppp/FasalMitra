'use client';
import { useState } from 'react';
import { useTranslation } from '@/context/LanguageContext';
import TopBar from '@/components/layout/TopBar';
import BottomNav from '@/components/layout/BottomNav';

export default function DiseasePage() {
    const [activeTab, setActiveTab] = useState('scan');
    const t = useTranslation();

    return (
        <div className="app">
            <TopBar title={t('disease.title')} subtitle={t('disease.subtitle')} backHref="/dashboard" icon="🔬" />
            <div className="scroll">
                <div className="segs">
                    <button className={`seg ${activeTab === 'scan' ? 'active' : ''}`} onClick={() => setActiveTab('scan')}>{t('disease.photoScan')}</button>
                    <button className={`seg ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>{t('disease.history')}</button>
                    <button className={`seg ${activeTab === 'library' ? 'active' : ''}`} onClick={() => setActiveTab('library')}>{t('disease.library')}</button>
                </div>

                {activeTab === 'scan' && (
                    <>
                        <div className="alert alert-b"><span className="alert-ico">💡</span><div className="alert-txt" dangerouslySetInnerHTML={{ __html: t('disease.scanTip') }} /></div>
                        <div className="upload-zone">
                            <div className="upload-icon">📸</div>
                            <div className="upload-title">{t('disease.uploadTitle')}</div>
                            <div className="upload-sub" dangerouslySetInnerHTML={{ __html: t('disease.uploadSub') }} />
                        </div>
                        <div className="row mb-12">
                            <button className="btn btn-g col">{t('disease.takePhoto')}</button>
                            <button className="btn btn-ghost col">{t('disease.gallery')}</button>
                        </div>
                        <div className="card p-16 mb-12">
                            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>{t('disease.context')}</div>
                            <div className="ig"><label>{t('disease.cropType')}</label><select><option>Onion</option><option>Tomato</option><option>Rice (Paddy)</option><option>Wheat</option><option>Cotton</option></select></div>
                            <div className="ig mb-0"><label>{t('disease.symptoms')}</label><textarea placeholder="e.g. Yellow leaves with brown spots, wilting…" style={{ minHeight: 60 }} /></div>
                        </div>
                        <button className="btn btn-g btn-full mb-12">{t('disease.diagnose')}</button>
                    </>
                )}

                {activeTab === 'history' && (
                    <>
                        <div className="card p-16 mb-10">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}><div style={{ fontSize: 14, fontWeight: 700 }}>Purple Blotch · Onion</div><span className="badge br">High Risk</span></div>
                            <div style={{ fontSize: 12, color: 'var(--sub)', marginBottom: 8 }}>Detected Jan 28 · Confidence 94%</div>
                            <div style={{ fontSize: 12 }}>Treatment applied: Mancozeb spray. Follow-up needed.</div>
                        </div>
                        <div className="card p-16 mb-10">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}><div style={{ fontSize: 14, fontWeight: 700 }}>Thrips Infestation · Onion</div><span className="badge ba">Medium</span></div>
                            <div style={{ fontSize: 12, color: 'var(--sub)', marginBottom: 8 }}>Detected Jan 15 · Confidence 88%</div>
                            <div style={{ fontSize: 12 }}>Blue sticky traps installed. Spinosad spray applied.</div>
                        </div>
                        <div className="card p-16">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}><div style={{ fontSize: 14, fontWeight: 700 }}>Healthy Plant · Onion</div><span className="badge bg">Healthy</span></div>
                            <div style={{ fontSize: 12, color: 'var(--sub)' }}>Scanned Dec 20 · No disease detected</div>
                        </div>
                    </>
                )}

                {activeTab === 'library' && (
                    <div className="card" style={{ padding: 0 }}>
                        {[
                            { name: 'Purple Blotch', sub: 'Onion, Garlic · Fungal', icon: '🦠', bg: '#FCE4EC' },
                            { name: 'Blast Disease', sub: 'Rice · Fungal', icon: '🔴', bg: '#FCE4EC' },
                            { name: 'Powdery Mildew', sub: 'Many crops · Fungal', icon: '⚪', bg: '#E3F2FD' },
                            { name: 'Aphid Infestation', sub: 'Onion, Wheat · Pest', icon: '🐛', bg: '#FFF8E1' },
                            { name: 'Yellow Leaf Curl Virus', sub: 'Tomato · Viral', icon: '💛', bg: '#FFFDE7' },
                            { name: 'Stem Borer', sub: 'Rice, Sugarcane · Pest', icon: '🐝', bg: '#E8F5E9' },
                        ].map((d, i, arr) => (
                            <div key={d.name} className="ri" style={i === arr.length - 1 ? { borderBottom: 'none' } : {}}>
                                <div className="ril"><div className="rico" style={{ background: d.bg }}>{d.icon}</div><div><div className="rtit">{d.name}</div><div className="rsub">{d.sub}</div></div></div>
                                <div className="rarr">›</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <BottomNav />
        </div>
    );
}
