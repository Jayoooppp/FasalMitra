'use client';
import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { useTranslation } from '@/context/LanguageContext';
import TopBar from '@/components/layout/TopBar';
import BottomNav from '@/components/layout/BottomNav';

export default function LaborPage() {
    const t = useTranslation();
    const [laborers, setLaborers] = useState<any[]>([]);
    const filterKeys = ['labor.all', 'labor.harvesting', 'labor.sowing', 'labor.irrigation', 'labor.pestControl', 'labor.general'];
    const filterValues = ['All', 'Harvesting', 'Sowing', 'Irrigation', 'Pest Control', 'General'];
    const [activeIdx, setActiveIdx] = useState(0);
    const [activeTab, setActiveTab] = useState('find');

    useEffect(() => {
        const val = filterValues[activeIdx];
        api.getLaborers(val !== 'All' ? val : undefined)
            .then(data => setLaborers(data.laborers))
            .catch(() => { });
    }, [activeIdx]);

    return (
        <div className="app">
            <TopBar title={t('labor.title')} subtitle={t('labor.subtitle')} backHref="/dashboard" icon="👥" />
            <div className="scroll">
                <div className="segs">
                    <button className={`seg ${activeTab === 'find' ? 'active' : ''}`} onClick={() => setActiveTab('find')}>{t('labor.findWorkers')}</button>
                    <button className={`seg ${activeTab === 'post' ? 'active' : ''}`} onClick={() => setActiveTab('post')}>{t('labor.postJob')}</button>
                </div>

                {activeTab === 'find' && (
                    <>
                        <div className="chips">
                            {filterKeys.map((k, i) => <button key={k} className={`chip ${activeIdx === i ? 'active' : ''}`} onClick={() => setActiveIdx(i)}>{t(k)}</button>)}
                        </div>
                        {laborers.map(l => (
                            <div key={l.id} className="wcard">
                                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 10 }}>
                                    <div className="wav">{l.avatar}</div>
                                    <div style={{ flex: 1 }}>
                                        <div className="wname">{l.name}</div>
                                        <div className="wexp">{l.experience}</div>
                                        <div className="wmeta"><span className="star">★</span><span>{l.rating} ({l.reviews})</span><span>·</span><span>📍 {l.distance}</span></div>
                                    </div>
                                    <div style={{ fontSize: 15, fontWeight: 700 }}>₹{l.dailyRate}/day</div>
                                </div>
                                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 10 }}>
                                    {l.skills.map((s: string) => <span key={s} className="tag">{s}</span>)}
                                </div>
                                <div className="row">
                                    <button className="btn btn-out btn-sm col">{t('labor.call')}</button>
                                    <button className="btn btn-g btn-sm col">{t('labor.message')}</button>
                                </div>
                            </div>
                        ))}
                    </>
                )}

                {activeTab === 'post' && (
                    <div className="card p-16 mb-12">
                        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>{t('labor.postAJob')}</div>
                        <div className="ig"><label>{t('labor.jobTitle')}</label><input placeholder="e.g., Onion Harvesting" /></div>
                        <div className="ig"><label>{t('labor.workersNeeded')}</label><input type="number" placeholder="5" /></div>
                        <div className="ig"><label>{t('labor.startDate')}</label><input type="date" /></div>
                        <div className="ig"><label>{t('labor.dailyWage')}</label><input type="number" placeholder="400" /></div>
                        <div className="ig mb-0"><label>{t('labor.description')}</label><input placeholder="Describe the work…" /></div>
                        <button className="btn btn-g btn-full mt-16">{t('labor.postButton')}</button>
                    </div>
                )}
            </div>
            <BottomNav />
        </div>
    );
}
