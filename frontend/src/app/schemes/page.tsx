'use client';
import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { useTranslation } from '@/context/LanguageContext';
import TopBar from '@/components/layout/TopBar';
import BottomNav from '@/components/layout/BottomNav';

export default function SchemesPage() {
    const t = useTranslation();
    const filterKeys = ['schemes.all', 'schemes.incomeSupport', 'schemes.subsidy', 'schemes.insurance', 'schemes.loan', 'schemes.irrigation', 'schemes.market', 'schemes.training', 'schemes.advisory', 'schemes.organic', 'schemes.infrastructure', 'schemes.regulation'];
    const filterValues = ['All', 'Income Support', 'Subsidy', 'Insurance', 'Loan', 'Irrigation', 'Market', 'Training', 'Advisory', 'Organic', 'Infrastructure', 'Regulation'];
    const [schemes, setSchemes] = useState<any[]>([]);
    const [activeIdx, setActiveIdx] = useState(0);
    const [selectedScheme, setSelectedScheme] = useState<any>(null);

    useEffect(() => {
        const val = filterValues[activeIdx];
        api.getSchemes(val !== 'All' ? val : undefined)
            .then(data => setSchemes(data.schemes))
            .catch(() => { });
    }, [activeIdx]);

    return (
        <div className="app">
            <TopBar title={t('schemes.title')} subtitle={t('schemes.subtitle')} backHref="/dashboard" icon="📄" />
            <div className="scroll">
                <div className="chips">
                    {filterKeys.map((k, i) => (
                        <button key={k} className={`chip ${activeIdx === i ? 'active' : ''}`} onClick={() => setActiveIdx(i)}>{t(k)}</button>
                    ))}
                </div>

                <div className="card mb-0" style={{ padding: 0 }}>
                    {schemes.map((s, i) => (
                        <div key={s.id} className="sc-item" style={i === schemes.length - 1 ? { borderBottom: 'none' } : {}} onClick={() => setSelectedScheme(s)}>
                            <div className="sc-tags"><span className="tag">{s.category}</span><span style={{ fontSize: 11, color: 'var(--sub)' }}>👥 {s.beneficiaries}</span></div>
                            <div className="sc-top"><div><div className="sc-name">{s.name}</div><div className="sc-sub">{s.subtitle}</div></div><div><div className="sc-benefit">{s.benefit}</div><div style={{ color: 'var(--light)', fontSize: 14, textAlign: 'right' }}>›</div></div></div>
                        </div>
                    ))}
                    {schemes.length === 0 && (
                        <div style={{ padding: 24, textAlign: 'center', color: 'var(--sub)', fontSize: 13 }}>{t('schemes.noSchemes')}</div>
                    )}
                </div>
            </div>

            {selectedScheme && (
                <div className="overlay open" onClick={e => { if (e.target === e.currentTarget) setSelectedScheme(null); }}>
                    <div className="sheet">
                        <div className="sheet-handle" />
                        <div className="sheet-title">{selectedScheme.name}</div>
                        <div className="sheet-body">
                            <div style={{ marginBottom: 10 }}>
                                <span className="tag" style={{ marginRight: 6 }}>{selectedScheme.category}</span>
                                <span style={{ fontSize: 12, color: 'var(--sub)' }}>👥 {selectedScheme.beneficiaries}</span>
                            </div>
                            <p style={{ fontSize: 13, color: 'var(--sub)', lineHeight: 1.7, marginBottom: 14 }}>{selectedScheme.details?.description}</p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
                                {selectedScheme.schemeUrl && (
                                    <a href={selectedScheme.schemeUrl} target="_blank" rel="noopener noreferrer" className="btn btn-g btn-sm btn-full" style={{ textDecoration: 'none', textAlign: 'center' }}>
                                        🌐 {t('schemes.visitPortal')}
                                    </a>
                                )}
                                {selectedScheme.pdfUrl && (
                                    <a href={selectedScheme.pdfUrl} target="_blank" rel="noopener noreferrer" className="btn btn-out btn-sm btn-full" style={{ textDecoration: 'none', textAlign: 'center' }}>
                                        📥 {t('schemes.downloadPDF')}
                                    </a>
                                )}
                                <a href={selectedScheme.govPageUrl || 'https://agriwelfare.gov.in/en/Major'} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm btn-full" style={{ textDecoration: 'none', textAlign: 'center' }}>
                                    🏛️ {t('schemes.govPage')}
                                </a>
                            </div>
                            <button className="btn btn-ghost btn-sm btn-full" onClick={() => setSelectedScheme(null)}>{t('schemes.close')}</button>
                        </div>
                    </div>
                </div>
            )}
            <BottomNav />
        </div>
    );
}
