'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/context/LanguageContext';
import TopBar from '@/components/layout/TopBar';
import BottomNav from '@/components/layout/BottomNav';
import { api } from '@/services/api';

export default function CropPage() {
    const { user } = useAuth();
    const t = useTranslation();
    const [soil, setSoil] = useState(user?.soilType || 'Black Cotton');
    const [season, setSeason] = useState(t('crop.seasonRabi'));
    const [farmSize, setFarmSize] = useState(String(user?.farmSize || '2.5'));
    const [waterSrc, setWaterSrc] = useState(t('crop.waterWell'));
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const soils = ['Alluvial', 'Black Cotton', 'Red & Yellow', 'Laterite', 'Sandy', 'Clay'];
    const seasons = [t('crop.seasonKharif'), t('crop.seasonRabi'), t('crop.seasonZaid')];
    const waterSources = [t('crop.waterWell'), t('crop.waterCanal'), t('crop.waterRain'), t('crop.waterDrip')];

    const getRecommendation = async () => {
        setLoading(true);
        try {
            const data = await api.getCropRecommendation({ soil, season, farmSize, waterSource: waterSrc });
            setResult(data);
        } catch { setResult(null); }
        setLoading(false);
    };

    const badgeColors = ['bg', 'ba', 'bb'];

    return (
        <div className="app">
            <TopBar title={t('crop.title')} subtitle={t('crop.subtitle')} backHref="/dashboard" icon="🌱" />
            <div className="scroll">
                <div className="card p-16 mb-12" style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, fontSize: 12, fontWeight: 600, color: 'var(--sub)' }}>{t('crop.yourLocation')}</div>
                    <div style={{ fontSize: 15, fontWeight: 600 }}>{user?.location || '—'}</div>
                </div>

                <div className="card p-16 mb-12">
                    <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 11 }}>{t('crop.soilType')}</div>
                    <div className="chips mb-0">{soils.map(s => <button key={s} className={`chip ${soil === s ? 'active' : ''}`} onClick={() => setSoil(s)}>{s}</button>)}</div>
                </div>

                <div className="card p-16 mb-12">
                    <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 11 }}>{t('crop.sowingSeason')}</div>
                    <div className="chips mb-0">{seasons.map(s => <button key={s} className={`chip ${season === s ? 'active' : ''}`} onClick={() => setSeason(s)}>{s}</button>)}</div>
                </div>

                <div className="card p-16 mb-12">
                    <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 11 }}>{t('crop.farmDetails')}</div>
                    <div className="ig"><label>{t('crop.farmSize')}</label><input type="number" value={farmSize} onChange={e => setFarmSize(e.target.value)} placeholder="e.g., 2.5" /></div>
                    <div className="ig mb-0"><label>{t('crop.waterSource')}</label><select value={waterSrc} onChange={e => setWaterSrc(e.target.value)}>{waterSources.map(w => <option key={w}>{w}</option>)}</select></div>
                </div>

                <button className="btn btn-g btn-full mb-12" onClick={getRecommendation} disabled={loading}>
                    {loading ? <><span className="spinner" />{t('crop.gettingAI')}</> : t('crop.getAI')}
                </button>

                {result && (
                    <>
                        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>{t('crop.aiResult')}</div>
                        {result.top_crops?.map((c: any, i: number) => (
                            <div key={c.name} className="card p-16 mb-10">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                                    <div style={{ fontSize: 17, fontWeight: 800 }}>{c.emoji} {c.name}</div>
                                    <span className={`badge ${badgeColors[i] || 'bg'}`}>{c.match_score}% Match</span>
                                </div>
                                <div style={{ fontSize: 12, color: 'var(--sub)', marginBottom: 10, lineHeight: 1.55 }}>{c.reasons}</div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 7, marginBottom: 10 }}>
                                    <div style={{ background: 'var(--inp)', borderRadius: 7, padding: 9, textAlign: 'center' }}><div style={{ fontSize: 10, color: 'var(--sub)' }}>{t('crop.duration')}</div><div style={{ fontSize: 12, fontWeight: 700, marginTop: 2 }}>{c.duration_days} {t('guide.days')}</div></div>
                                    <div style={{ background: 'var(--inp)', borderRadius: 7, padding: 9, textAlign: 'center' }}><div style={{ fontSize: 10, color: 'var(--sub)' }}>{t('crop.yield')}</div><div style={{ fontSize: 12, fontWeight: 700, marginTop: 2 }}>{c.yield_per_acre}</div></div>
                                    <div style={{ background: 'var(--inp)', borderRadius: 7, padding: 9, textAlign: 'center' }}><div style={{ fontSize: 10, color: 'var(--sub)' }}>{t('crop.income')}</div><div style={{ fontSize: 12, fontWeight: 700, marginTop: 2, color: 'var(--green)' }}>{c.estimated_income}</div></div>
                                </div>
                                <div className="alert alert-g" style={{ marginBottom: 0 }}><span className="alert-ico">💡</span><div className="alert-txt"><strong>{t('crop.proTip')}</strong> {c.tip}</div></div>
                            </div>
                        ))}
                        {result.intercrop_suggestion && <div className="alert alert-b mb-10"><span className="alert-ico">🔗</span><div className="alert-txt"><strong>{t('crop.intercroppingTip')}</strong> {result.intercrop_suggestion}</div></div>}
                        {result.caution && <div className="alert alert-w mb-16"><span className="alert-ico">⚠️</span><div className="alert-txt"><strong>{t('crop.watchOut')}</strong> {result.caution}</div></div>}
                    </>
                )}
            </div>
            <BottomNav />
        </div>
    );
}
