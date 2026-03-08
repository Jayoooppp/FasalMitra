'use client';
import { useState, useRef } from 'react';
import { useTranslation } from '@/context/LanguageContext';
import { api } from '@/services/api';
import TopBar from '@/components/layout/TopBar';
import BottomNav from '@/components/layout/BottomNav';

export default function DiseasePage() {
    const [activeTab, setActiveTab] = useState('scan');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [cropType, setCropType] = useState('Onion');
    const [symptoms, setSymptoms] = useState('');
    const [diagnosing, setDiagnosing] = useState(false);
    const [diagResult, setDiagResult] = useState<string | null>(null);
    const [diagError, setDiagError] = useState<string | null>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);
    const galleryInputRef = useRef<HTMLInputElement>(null);
    const t = useTranslation();

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onload = (ev) => {
                setSelectedImage(ev.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
        e.target.value = '';
    };

    const clearImage = () => {
        setSelectedImage(null);
        setSelectedFile(null);
    };

    const handleDiagnose = async () => {
        if (!selectedImage) {
            setDiagError(t('disease.uploadTitle'));
            return;
        }
        setDiagnosing(true);
        setDiagError(null);
        setDiagResult(null);

        try {
            // Extract base64 data and media type from the data URL
            const match = selectedImage.match(/^data:(image\/\w+);base64,(.+)$/);
            if (!match) throw new Error('Invalid image format');
            const mediaType = match[1];
            const base64Data = match[2];

            const systemPrompt = `You are an expert agricultural plant pathologist AI assistant for Indian farmers. Analyze the crop image provided and diagnose any diseases or pest issues. Respond in this format:

**Disease:** [Name of disease/pest or "Healthy" if no issues]
**Confidence:** [High/Medium/Low]
**Severity:** [Critical/High/Medium/Low/None]
**Crop:** [Detected crop type]

**Description:**
[Brief description of the disease/pest]

**Treatment:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Prevention:**
• [Tip 1]
• [Tip 2]

Keep responses practical with specific product names and dosages used in India. If the image is unclear, say so. Respond in the same language the farmer uses for symptoms (Hindi/Marathi/English).`;

            const userContent: any[] = [
                {
                    type: 'image',
                    source: {
                        type: 'base64',
                        media_type: mediaType,
                        data: base64Data,
                    }
                },
                {
                    type: 'text',
                    text: `Crop type: ${cropType}\n${symptoms ? `Symptoms observed: ${symptoms}` : 'Please analyze this crop image for any disease or pest issues.'}`
                }
            ];

            const result = await api.aiDiagnose({
                messages: [
                    {
                        role: 'user',
                        content: userContent
                    }
                ],
                system: systemPrompt
            });

            // Claude API returns content array
            const text = result?.content?.[0]?.text || result?.message || 'No diagnosis available';
            setDiagResult(text);
        } catch (err: any) {
            setDiagError(err.message || 'Diagnosis failed. Please try again.');
        } finally {
            setDiagnosing(false);
        }
    };

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
                        {/* Hidden file inputs */}
                        <input type="file" accept="image/*" capture="environment" ref={cameraInputRef} onChange={handleImageSelect} style={{ display: 'none' }} />
                        <input type="file" accept="image/*" ref={galleryInputRef} onChange={handleImageSelect} style={{ display: 'none' }} />

                        {!selectedImage ? (
                            <div className="upload-zone">
                                <div className="upload-icon">📸</div>
                                <div className="upload-title">{t('disease.uploadTitle')}</div>
                                <div className="upload-sub" dangerouslySetInnerHTML={{ __html: t('disease.uploadSub') }} />
                            </div>
                        ) : (
                            <div className="upload-zone" style={{ padding: 8, position: 'relative' }}>
                                <img src={selectedImage} alt="Selected crop" style={{ width: '100%', maxHeight: 220, objectFit: 'contain', borderRadius: 10 }} />
                                <button onClick={clearImage} style={{
                                    position: 'absolute', top: 12, right: 12,
                                    background: 'rgba(0,0,0,0.55)', color: '#fff',
                                    border: 'none', borderRadius: '50%', width: 28, height: 28,
                                    cursor: 'pointer', fontSize: 16, display: 'flex',
                                    alignItems: 'center', justifyContent: 'center'
                                }}>✕</button>
                                <div style={{ fontSize: 12, color: 'var(--sub)', marginTop: 6 }}>{selectedFile?.name}</div>
                            </div>
                        )}

                        <div className="row mb-12">
                            <button className="btn btn-g col" onClick={() => cameraInputRef.current?.click()}>{t('disease.takePhoto')}</button>
                            <button className="btn btn-ghost col" onClick={() => galleryInputRef.current?.click()}>{t('disease.gallery')}</button>
                        </div>
                        <div className="card p-16 mb-12">
                            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>{t('disease.context')}</div>
                            <div className="ig">
                                <label>{t('disease.cropType')}</label>
                                <select value={cropType} onChange={e => setCropType(e.target.value)}>
                                    <option>Onion</option><option>Tomato</option><option>Rice (Paddy)</option><option>Wheat</option><option>Cotton</option>
                                </select>
                            </div>
                            <div className="ig mb-0">
                                <label>{t('disease.symptoms')}</label>
                                <textarea
                                    value={symptoms}
                                    onChange={e => setSymptoms(e.target.value)}
                                    placeholder="e.g. Yellow leaves with brown spots, wilting…"
                                    style={{ minHeight: 60 }}
                                />
                            </div>
                        </div>

                        {diagError && (
                            <div className="alert alert-b" style={{ borderColor: '#ef5350', marginBottom: 12 }}>
                                <span className="alert-ico">⚠️</span>
                                <div className="alert-txt">{diagError}</div>
                            </div>
                        )}

                        <button
                            className="btn btn-g btn-full mb-12"
                            onClick={handleDiagnose}
                            disabled={diagnosing}
                            style={diagnosing ? { opacity: 0.7, pointerEvents: 'none' } : {}}
                        >
                            {diagnosing ? '⏳ Analyzing...' : t('disease.diagnose')}
                        </button>
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

            {/* Diagnosis Result Bottom Sheet */}
            {diagResult && (
                <div className="overlay open" onClick={e => { if (e.target === e.currentTarget) setDiagResult(null); }}>
                    <div className="sheet">
                        <div className="sheet-handle" />
                        <div className="sheet-title">🔬 AI Diagnosis Result</div>
                        <div className="sheet-body">
                            {selectedImage && (
                                <img src={selectedImage} alt="Diagnosed crop" style={{ width: '100%', maxHeight: 160, objectFit: 'contain', borderRadius: 10, marginBottom: 14, background: 'var(--card)' }} />
                            )}
                            <div style={{ fontSize: 13, color: 'var(--sub)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}
                                dangerouslySetInnerHTML={{
                                    __html: diagResult
                                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                        .replace(/\n/g, '<br/>')
                                }} />
                            <button className="btn btn-ghost btn-sm btn-full" style={{ marginTop: 16 }} onClick={() => setDiagResult(null)}>{t('schemes.close')}</button>
                        </div>
                    </div>
                </div>
            )}
            <BottomNav />
        </div>
    );
}
