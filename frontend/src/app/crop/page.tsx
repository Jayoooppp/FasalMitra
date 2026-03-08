'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/context/LanguageContext';
import { useToast } from '@/context/ToastContext';
import { useSearchParams } from 'next/navigation';
import TopBar from '@/components/layout/TopBar';
import BottomNav from '@/components/layout/BottomNav';
import { api } from '@/services/api';

export default function CropPage() {
    const { user, addCrop } = useAuth();
    const t = useTranslation();
    const { showToast } = useToast();
    const searchParams = useSearchParams();
    const isNewUser = searchParams.get('new') === '1';
    const [soil, setSoil] = useState(user?.soilType || 'Black Cotton');
    const [season, setSeason] = useState(t('crop.seasonRabi'));
    const [farmSize, setFarmSize] = useState(String(user?.farmSize || '2.5'));
    const [waterSrc, setWaterSrc] = useState(t('crop.waterWell'));
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [addingCrop, setAddingCrop] = useState<string | null>(null);

    const soils = ['Alluvial', 'Black Cotton', 'Red & Yellow', 'Laterite', 'Sandy', 'Clay'];
    const seasons = [t('crop.seasonKharif'), t('crop.seasonRabi'), t('crop.seasonZaid')];
    const waterSources = [t('crop.waterWell'), t('crop.waterCanal'), t('crop.waterRain'), t('crop.waterDrip')];

    const activeCropNames = (user?.activeCrops || []).map(c => c.name.toLowerCase());

    const getRecommendation = async () => {
        setLoading(true);
        try {
            const data = await api.getCropRecommendation({ soil, season, farmSize, waterSource: waterSrc });
            setResult(data);
        } catch { setResult(null); }
        setLoading(false);
    };

    const handleAddCrop = async (crop: any) => {
        setAddingCrop(crop.name);
        try {
            await addCrop({
                name: crop.name,
                emoji: crop.emoji || '🌱',
                season: season,
                acreage: parseFloat(farmSize) || (user?.farmSize || 1),
                totalDays: crop.duration_days || 120,
            });
            showToast(`✅ ${crop.name} added to your active crops!`);
        } catch (err: any) {
            showToast(err.message || 'Failed to add crop');
        }
        setAddingCrop(null);
    };

    const badgeColors = ['bg', 'ba', 'bb'];

    return (
        <div className="app">
            <TopBar title={t('crop.title')} subtitle={t('crop.subtitle')} backHref="/dashboard" icon="🌱" />
            <div className="scroll">

                {/* New user onboarding banner */}
                {isNewUser && (
                    <div className="alert alert-g mb-12" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontSize: 20 }}>🎉</span>
                            <strong>Welcome to FasalMitra, {user?.name?.split(' ')[0]}!</strong>
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--sub)', lineHeight: 1.6 }}>
                            Let's set up your farm in 3 steps:<br />
                            <span style={{ color: 'var(--green)', fontWeight: 700 }}>1.</span> Get AI crop recommendations below<br />
                            <span style={{ color: 'var(--green)', fontWeight: 700 }}>2.</span> Add your chosen crops to your farm<br />
                            <span style={{ color: 'var(--green)', fontWeight: 700 }}>3.</span> View your personalized cultivation guide
                        </div>
                    </div>
                )}

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
                        {result.top_crops?.map((c: any, i: number) => {
                            const isAdded = activeCropNames.includes(c.name.toLowerCase());
                            return (
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
                                    <div className="alert alert-g" style={{ marginBottom: 10 }}><span className="alert-ico">💡</span><div className="alert-txt"><strong>{t('crop.proTip')}</strong> {c.tip}</div></div>

                                    {/* Add to My Farm button */}
                                    {isAdded ? (
                                        <div style={{
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            gap: 6, padding: '10px 0', borderRadius: 10,
                                            background: 'var(--green-bg)', color: 'var(--green)',
                                            fontSize: 13, fontWeight: 700
                                        }}>
                                            ✓ Already in Your Farm
                                        </div>
                                    ) : (
                                        <button
                                            className="btn btn-g btn-full"
                                            style={{ marginBottom: 0 }}
                                            disabled={addingCrop === c.name}
                                            onClick={() => handleAddCrop(c)}
                                        >
                                            {addingCrop === c.name
                                                ? <><span className="spinner" /> Adding...</>
                                                : `🌱 Add ${c.name} to My Farm`
                                            }
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                        {result.intercrop_suggestion && <div className="alert alert-b mb-10"><span className="alert-ico">🔗</span><div className="alert-txt"><strong>{t('crop.intercroppingTip')}</strong> {result.intercrop_suggestion}</div></div>}
                        {result.caution && <div className="alert alert-w mb-16"><span className="alert-ico">⚠️</span><div className="alert-txt"><strong>{t('crop.watchOut')}</strong> {result.caution}</div></div>}
                    </>
                )}
            </div>
            <BottomNav />
        </div>
    );
}
