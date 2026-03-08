'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/context/LanguageContext';
import { useToast } from '@/context/ToastContext';
import TopBar from '@/components/layout/TopBar';
import BottomNav from '@/components/layout/BottomNav';
import Link from 'next/link';

// Static cultivation guide data keyed by crop name
const CROP_GUIDES: Record<string, {
    timeline: { status: string; label: string; title: string; sub: string; highlight?: boolean; last?: boolean }[];
    inputs: { name: string; sub: string; amt: string; urgent?: boolean }[];
    pests: { name: string; type: string; icon: string; desc: string; treatment: string }[];
}> = {
    'Onion': {
        timeline: [
            { status: 'done', label: '✓', title: 'Land Preparation & Nursery', sub: 'Deep ploughing, raised bed nursery with 45-day seedlings' },
            { status: 'done', label: '✓', title: 'Transplanting', sub: '45-day seedlings transplanted at 15×10 cm spacing' },
            { status: 'now', label: 'NOW', title: 'Bulb Development Stage', sub: 'Irrigation every 7–10 days. Apply potash now.', highlight: true },
            { status: 'soon', label: '', title: 'Top Dressing & Final Irrigation', sub: 'Stop irrigation 15 days before harvest' },
            { status: 'soon', label: '', title: 'Harvesting', sub: 'When 50% leaves topple naturally' },
            { status: 'soon', label: '', title: 'Curing & Storage', sub: 'Cure in shade 7–10 days before storing', last: true },
        ],
        inputs: [
            { name: 'DAP 18:46 (Basal)', sub: 'At transplanting', amt: '50 kg/acre' },
            { name: 'Urea (30 days)', sub: 'First top dressing', amt: '65 kg/acre' },
            { name: 'MOP/Potash (60 days)', sub: 'Bulb development — Due now!', amt: '60 kg/acre', urgent: true },
        ],
        pests: [
            { name: 'Purple Blotch', type: 'Fungal', icon: '🦠', desc: 'Purple/brown spots on leaves. 30–50% yield loss possible.', treatment: 'Mancozeb 75WP @ 2g/lit or Propiconazole 25EC @ 1ml/lit. Repeat after 10 days.' },
            { name: 'Thrips', type: 'Pest', icon: '🐛', desc: 'Silvery streaks on leaves. Use blue sticky traps as early warning.', treatment: 'Spinosad 45SC @ 0.3 ml/lit or Neem oil 3% in evenings.' },
        ],
    },
    'Soybean': {
        timeline: [
            { status: 'done', label: '✓', title: 'Soil Preparation & Sowing', sub: 'Deep tillage, rhizobium-treated seeds at 75×5 cm spacing' },
            { status: 'done', label: '✓', title: 'Germination & Emergence', sub: 'Seedlings emerging, thin to one plant per spot' },
            { status: 'now', label: 'NOW', title: 'Vegetative Growth Stage', sub: 'Weed control critical. Apply Pendimethalin pre-emergence.', highlight: true },
            { status: 'soon', label: '', title: 'Flowering & Pod Set', sub: 'Ensure irrigation at R1–R3 stages for maximum yield' },
            { status: 'soon', label: '', title: 'Grain Fill', sub: 'Reduce irrigation. Watch for pod borers.' },
            { status: 'soon', label: '', title: 'Harvest', sub: 'When 80% pods turn brown and leaves drop', last: true },
        ],
        inputs: [
            { name: 'Rhizobium + PSB Seed Treatment', sub: 'Before sowing', amt: '5 g/kg seed' },
            { name: 'DAP 18:46 (Basal)', sub: 'At sowing', amt: '60 kg/acre' },
            { name: 'Urea (30 DAS)', sub: 'Vegetative stage top dressing', amt: '25 kg/acre', urgent: true },
        ],
        pests: [
            { name: 'Stem Fly', type: 'Pest', icon: '🪲', desc: 'Yellowing of leaves, wilting of seedlings 1–2 weeks after sowing.', treatment: 'Thiamethoxam 25WG seed treatment @ 3g/kg. Spray Dimethoate @ 1.5 ml/lit.' },
            { name: 'Yellow Mosaic Virus', type: 'Viral', icon: '💛', desc: 'Yellow mosaic pattern on leaves. Transmitted by whiteflies.', treatment: 'No chemical cure. Remove infected plants. Control whitefly with Imidacloprid @ 0.3 ml/lit.' },
        ],
    },
    'Wheat': {
        timeline: [
            { status: 'done', label: '✓', title: 'Field Preparation & Sowing', sub: 'Disc ploughing, certified seeds GW-322 at 100 kg/acre' },
            { status: 'done', label: '✓', title: 'Crown Root Initiation (CRI)', sub: 'First irrigation at 20–25 DAS. Apply nitrogen top dressing' },
            { status: 'now', label: 'NOW', title: 'Tillering Stage', sub: 'Apply second dose of urea. Monitor for yellow rust.', highlight: true },
            { status: 'soon', label: '', title: 'Jointing & Booting', sub: 'Third irrigation. Watch for aphid infestation.' },
            { status: 'soon', label: '', title: 'Flowering (Anthesis)', sub: 'Critical irrigation stage. No water stress allowed.' },
            { status: 'soon', label: '', title: 'Harvest (Maturity)', sub: 'Harvest at 12–14% grain moisture for best quality', last: true },
        ],
        inputs: [
            { name: 'DAP 18:46 (Basal)', sub: 'At sowing', amt: '50 kg/acre' },
            { name: 'Urea (CRI Stage — First dose)', sub: '20–25 DAS', amt: '55 kg/acre' },
            { name: 'Urea (Tillering — Due now!)', sub: '45 DAS — Second top dressing', amt: '55 kg/acre', urgent: true },
        ],
        pests: [
            { name: 'Yellow Rust (Stripe Rust)', type: 'Fungal', icon: '🟡', desc: 'Yellow stripes on leaves parallel to midrib. Spreads rapidly in cool humid weather.', treatment: 'Propiconazole 25EC @ 1 ml/lit. Spray Tebuconazole @ 0.1% if severe.' },
            { name: 'Wheat Aphid', type: 'Pest', icon: '🐚', desc: 'Colonies on leaves and ears. Secrete honeydew causing sooty mold.', treatment: 'Imidacloprid 70WS seed treatment. Spray Dimethoate 30EC @ 1.5 ml/lit if severe.' },
        ],
    },
    'Tomato': {
        timeline: [
            { status: 'done', label: '✓', title: 'Nursery & Seedling Preparation', sub: 'Raised bed nursery, 25-day-old seedlings transplanted' },
            { status: 'done', label: '✓', title: 'Transplanting & Establishment', sub: '60×45 cm spacing, staking at 30 cm height' },
            { status: 'now', label: 'NOW', title: 'Vegetative Growth & Flowering', sub: 'Apply calcium + boron spray. Install bamboo stakes.', highlight: true },
            { status: 'soon', label: '', title: 'Fruit Set', sub: 'Irrigation every 5–6 days. Watch for blossom drop.' },
            { status: 'soon', label: '', title: 'Fruit Development & Ripening', sub: 'Reduce nitrogen. Increase potassium for fruit quality.' },
            { status: 'soon', label: '', title: 'Harvest', sub: 'Harvest at pink to light red stage for distant markets', last: true },
        ],
        inputs: [
            { name: 'FYM / Compost', sub: 'At land preparation', amt: '5 tonnes/acre' },
            { name: 'NPK 15:15:15 (Basal)', sub: 'At transplanting', amt: '50 kg/acre' },
            { name: 'Urea + Potash (Fruit set — Due now!)', sub: '45 DAT — Critical stage', amt: '30+30 kg/acre', urgent: true },
        ],
        pests: [
            { name: 'Leaf Curl Virus (ToLCV)', type: 'Viral', icon: '🍃', desc: 'Upward curling of leaves, dwarfing, yellowing. Spread by whiteflies.', treatment: 'No chemical cure. Remove infected plants. Spray yellow sticky traps. Imidacloprid @ 0.3 ml/lit for whitefly.' },
            { name: 'Fruit Borer (Helicoverpa)', type: 'Pest', icon: '🐛', desc: 'Larvae bore into fruits causing significant damage. Entry holes visible.', treatment: 'Chlorpyriphos 50EC @ 2 ml/lit or Spinosad 45SC @ 0.3 ml/lit. Use pheromone traps.' },
        ],
    },
    'Rice (Paddy)': {
        timeline: [
            { status: 'done', label: '✓', title: 'Nursery Preparation', sub: 'Raised bed nursery, 25-day-old seedlings for transplanting' },
            { status: 'done', label: '✓', title: 'Pudding & Transplanting', sub: '20×15 cm spacing, 2–3 seedlings per hill' },
            { status: 'now', label: 'NOW', title: 'Tillering Stage', sub: 'Maintain 5 cm water level. Apply nitrogenous fertilizer.', highlight: true },
            { status: 'soon', label: '', title: 'Panicle Initiation', sub: 'Most critical irrigation stage. No water stress at all.' },
            { status: 'soon', label: '', title: 'Flowering & Grain Fill', sub: 'Moderate irrigation. Scout for stem borer damage.' },
            { status: 'soon', label: '', title: 'Harvest', sub: 'Harvest at 20% moisture. Sun-dry to 14%', last: true },
        ],
        inputs: [
            { name: 'DAP (Basal at Transplanting)', sub: 'At transplanting', amt: '50 kg/acre' },
            { name: 'Urea (21 Days After Transplanting)', sub: 'First top dressing', amt: '55 kg/acre' },
            { name: 'Potash (45 DAT — Due now!)', sub: 'Second top dressing at tillering', amt: '40 kg/acre', urgent: true },
        ],
        pests: [
            { name: 'Brown Plant Hopper (BPH)', type: 'Pest', icon: '🦗', desc: 'Hopperburn - oval patches of dry, brown plants in field. Spreads in humid conditions.', treatment: 'Drain field for 3–4 days. Spray Buprofezin 25SC @ 1 ml/lit or Thiamethoxam @ 0.2 g/lit.' },
            { name: 'Blast Disease', type: 'Fungal', icon: '🔴', desc: 'Diamond-shaped lesions on leaves with gray center. Damages up to 70% yield.', treatment: 'Tricyclazole 75WP @ 0.6 g/lit at first sign. Repeat at 15-day intervals.' },
        ],
    },
    'Cotton': {
        timeline: [
            { status: 'done', label: '✓', title: 'Land Preparation & Sowing', sub: 'Deep tillage, Bt cotton hybrids at 4×1.2 ft spacing' },
            { status: 'done', label: '✓', title: 'Germination & Seedling Stage', sub: 'Gap filling at 10–15 DAS. Apply starter fertilizer.' },
            { status: 'now', label: 'NOW', title: 'Square & Boll Formation', sub: 'Apply potash and micronutrients. Scout for bollworm.', highlight: true },
            { status: 'soon', label: '', title: 'Boll Development', sub: 'Critical irrigation at boll filling. Apply Planofix if excessive shedding.' },
            { status: 'soon', label: '', title: 'Boll Opening', sub: '1–2 irrigations only. Defoliant spray for machine harvest.' },
            { status: 'soon', label: '', title: 'Harvest (Picking)', sub: 'Usually 3–5 pickings. First picking when 50% bolls open.', last: true },
        ],
        inputs: [
            { name: 'FYM (Pre-sowing)', sub: 'Land preparation stage', amt: '4 tonnes/acre' },
            { name: 'DAP + MOP (Basal)', sub: 'At sowing', amt: '50+30 kg/acre' },
            { name: 'Urea + Potash (Squaring — Due!)', sub: '60–75 DAS — Boll formation stage', amt: '40+25 kg/acre', urgent: true },
        ],
        pests: [
            { name: 'Bollworm (American/Pink)', type: 'Pest', icon: '🐛', desc: 'Entry holes in squares/bolls. Frass visible. Major pest of cotton worldwide.', treatment: 'Chlorpyriphos 50EC + Cypermethrin 5EC @ 2 ml/lit each. Use pheromone traps for monitoring.' },
            { name: 'Whitefly', type: 'Pest', icon: '🤍', desc: 'White insects on leaf underside. Transmit Cotton Leaf Curl Virus.', treatment: 'Thiamethoxam 25WG @ 0.3 g/lit or Spiromesifen 22.9SC @ 1 ml/lit. Alternate chemicals.' },
        ],
    },
};

// Default guide for unknown crops (AI-generated message placeholder)
const DEFAULT_GUIDE = {
    timeline: [
        { status: 'now', label: 'NOW', title: 'Crop Growing', sub: 'Follow standard cultivation practices for this crop.', highlight: true },
        { status: 'soon', label: '', title: 'Maturity & Harvest', sub: 'Monitor plant health and harvest at optimal maturity.', last: true },
    ],
    inputs: [
        { name: 'Balanced NPK Fertilizer', sub: 'Follow soil test recommendations', amt: 'As needed' },
    ],
    pests: [
        { name: 'General Pest Management', type: 'General', icon: '🔍', desc: 'Regular scouting recommended.', treatment: 'Consult your local agriculture extension officer for crop-specific advice.' },
    ],
};

function getDaysSince(startDate: string | Date): number {
    const start = new Date(startDate);
    const now = new Date();
    return Math.max(0, Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
}

function getProgressPercent(dayCount: number, totalDays: number): number {
    if (!totalDays) return 0;
    return Math.min(100, Math.round((dayCount / totalDays) * 100));
}

export default function GuidePage() {
    const { user, removeCrop } = useAuth();
    const t = useTranslation();
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState('timeline');
    const [selectedCropIndex, setSelectedCropIndex] = useState(0);
    const [removing, setRemoving] = useState<string | null>(null);

    const activeCrops = user?.activeCrops || [];
    const hasCrops = activeCrops.length > 0;
    const selectedCrop = activeCrops[selectedCropIndex] || null;

    const guideData = selectedCrop
        ? (CROP_GUIDES[selectedCrop.name] || DEFAULT_GUIDE)
        : null;

    const dayCount = selectedCrop
        ? getDaysSince(selectedCrop.startDate)
        : 0;
    const progress = selectedCrop
        ? getProgressPercent(dayCount, selectedCrop.totalDays || 120)
        : 0;

    const handleRemoveCrop = async (cropId: string, cropName: string) => {
        setRemoving(cropId);
        try {
            await removeCrop(cropId);
            showToast(`${cropName} removed from your farm.`);
            if (selectedCropIndex >= activeCrops.length - 1) {
                setSelectedCropIndex(Math.max(0, activeCrops.length - 2));
            }
        } catch (err: any) {
            showToast(err.message || 'Failed to remove crop');
        }
        setRemoving(null);
    };

    return (
        <div className="app">
            <TopBar title={t('guide.title')} subtitle={t('guide.subtitle')} backHref="/dashboard" icon="📋" />
            <div className="scroll">

                {!hasCrops ? (
                    /* Empty state — no crops yet */
                    <div style={{ textAlign: 'center', padding: '48px 24px' }}>
                        <div style={{ fontSize: 64 }}>🌱</div>
                        <div style={{ fontSize: 17, fontWeight: 800, marginTop: 14, marginBottom: 8 }}>No Active Crops Yet</div>
                        <div style={{ fontSize: 13, color: 'var(--sub)', marginBottom: 24, lineHeight: 1.6 }}>
                            Get AI crop recommendations and add crops to your farm to see personalized cultivation guides here.
                        </div>
                        <Link href="/crop" className="btn btn-g" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                            🌾 Get Crop Recommendations
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Crop selector — horizontal scrollable pills */}
                        {activeCrops.length > 1 && (
                            <div style={{ overflowX: 'auto', display: 'flex', gap: 8, paddingBottom: 4, marginBottom: 12 }}>
                                {activeCrops.map((c, i) => (
                                    <button
                                        key={c._id}
                                        onClick={() => setSelectedCropIndex(i)}
                                        style={{
                                            flexShrink: 0,
                                            padding: '7px 14px',
                                            borderRadius: 20,
                                            border: 'none',
                                            cursor: 'pointer',
                                            fontSize: 13,
                                            fontWeight: 700,
                                            background: i === selectedCropIndex ? 'var(--green)' : 'var(--card)',
                                            color: i === selectedCropIndex ? '#fff' : 'var(--fg)',
                                            boxShadow: i === selectedCropIndex ? '0 2px 8px rgba(76,175,80,0.3)' : 'none',
                                            transition: 'all 0.2s',
                                        }}
                                    >
                                        {c.emoji} {c.name}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Selected crop header */}
                        {selectedCrop && (
                            <div className="card p-16 mb-12">
                                <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12 }}>
                                    <span style={{ fontSize: 34 }}>{selectedCrop.emoji}</span>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 15, fontWeight: 800 }}>{selectedCrop.name} – {selectedCrop.season}</div>
                                        <div style={{ fontSize: 12, color: 'var(--sub)' }}>
                                            Started {new Date(selectedCrop.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} · {selectedCrop.acreage} acres
                                        </div>
                                    </div>
                                    <span className="badge ba">Day {dayCount}/{selectedCrop.totalDays || 120}</span>
                                </div>
                                <div className="prog-bar">
                                    <div className="prog-fill" style={{ width: `${progress}%` }} />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--sub)', marginTop: 4, marginBottom: 10 }}>
                                    <span>0 {t('guide.days')}</span>
                                    <span style={{ color: 'var(--green)', fontWeight: 600 }}>{progress}% {t('guide.complete')}</span>
                                    <span>{selectedCrop.totalDays || 120} {t('guide.days')}</span>
                                </div>
                                <button
                                    onClick={() => handleRemoveCrop(selectedCrop._id, selectedCrop.name)}
                                    disabled={removing === selectedCrop._id}
                                    style={{
                                        background: 'var(--red-bg, #FEE2E2)', color: 'var(--red, #ef5350)',
                                        border: 'none', borderRadius: 8, padding: '7px 14px',
                                        fontSize: 12, fontWeight: 700, cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', gap: 5
                                    }}
                                >
                                    {removing === selectedCrop._id ? '⏳ Removing...' : '🗑 Remove from Farm'}
                                </button>
                            </div>
                        )}

                        <div className="segs">
                            <button className={`seg ${activeTab === 'timeline' ? 'active' : ''}`} onClick={() => setActiveTab('timeline')}>{t('guide.timeline')}</button>
                            <button className={`seg ${activeTab === 'inputs' ? 'active' : ''}`} onClick={() => setActiveTab('inputs')}>{t('guide.inputs')}</button>
                            <button className={`seg ${activeTab === 'pests' ? 'active' : ''}`} onClick={() => setActiveTab('pests')}>{t('guide.pests')}</button>
                        </div>

                        {guideData && activeTab === 'timeline' && (
                            <div className="card" style={{ padding: 0 }}>
                                {guideData.timeline.map((ti, idx) => (
                                    <div key={ti.title} className="tl-item" style={{
                                        padding: '13px 16px',
                                        ...(ti.highlight ? { background: '#FFFBEB' } : {}),
                                        ...(ti.status === 'soon' ? { opacity: 0.55 } : {}),
                                        ...(ti.last ? { borderBottom: 'none' } : {})
                                    }}>
                                        <div className={`tl-dot tl-${ti.status}`} style={ti.status === 'now' ? { fontSize: 9 } : {}}>{ti.label}</div>
                                        <div>
                                            <div style={{ fontSize: 14, fontWeight: ti.highlight ? 700 : 600, color: ti.highlight ? '#92400E' : 'inherit' }}>{ti.title}</div>
                                            <div style={{ fontSize: 12, color: 'var(--sub)', marginTop: 2 }}>{ti.sub}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {guideData && activeTab === 'inputs' && (
                            <>
                                <div className="card p-16 mb-12">
                                    <div style={{ fontWeight: 700, marginBottom: 11 }}>{t('guide.fertSchedule')}</div>
                                    {guideData.inputs.map((f, i) => (
                                        <div key={f.name} className="ri" style={{ padding: '9px 0', cursor: 'default', ...(i === guideData.inputs.length - 1 ? { borderBottom: 'none' } : {}) }}>
                                            <div><div className="rtit" style={{ fontSize: 13 }}>{f.name}</div><div className="rsub">{f.sub}</div></div>
                                            <span style={{ fontSize: 13, fontWeight: 700, ...(f.urgent ? { color: 'var(--red)' } : {}) }}>{f.amt}</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {guideData && activeTab === 'pests' && (
                            <>
                                <div className="alert alert-w"><span className="alert-ico">⚠️</span><div className="alert-txt"><strong>{t('guide.activeAlert')}</strong> {t('guide.activeAlertMsg')}</div></div>
                                {guideData.pests.map((p, i) => (
                                    <div key={p.name} className="card p-16 mb-10">
                                        <div style={{ fontWeight: 700, marginBottom: 6 }}>{p.icon} {p.name} ({p.type})</div>
                                        <div style={{ fontSize: 12, color: 'var(--sub)', marginBottom: 8 }}>{p.desc}</div>
                                        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--green)', marginBottom: 3 }}>{t('guide.treatment')}</div>
                                        <div style={{ fontSize: 12, color: 'var(--sub)' }}>{p.treatment}</div>
                                    </div>
                                ))}
                            </>
                        )}

                        {/* Quick link to add more crops */}
                        <div className="card p-16 mb-16" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                <div style={{ fontSize: 13, fontWeight: 700 }}>Growing more crops?</div>
                                <div style={{ fontSize: 11, color: 'var(--sub)' }}>Get AI recommendations to expand your farm</div>
                            </div>
                            <Link href="/crop" style={{ textDecoration: 'none' }}>
                                <button className="btn btn-g" style={{ padding: '8px 14px', fontSize: 12 }}>+ Add Crop</button>
                            </Link>
                        </div>
                    </>
                )}
            </div>
            <BottomNav />
        </div>
    );
}
