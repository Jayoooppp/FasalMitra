'use client';
import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import TopBar from '@/components/layout/TopBar';
import BottomNav from '@/components/layout/BottomNav';

export default function SchemesPage() {
    const [schemes, setSchemes] = useState<any[]>([]);
    const [activeFilter, setActiveFilter] = useState('All');
    const [selectedScheme, setSelectedScheme] = useState<any>(null);
    const filters = ['All', 'Subsidy', 'Insurance', 'Loan', 'Equipment', 'Training'];

    useEffect(() => {
        api.getSchemes(activeFilter !== 'All' ? activeFilter : undefined)
            .then(data => setSchemes(data.schemes))
            .catch(() => { });
    }, [activeFilter]);

    return (
        <div className="app">
            <TopBar title="Government Schemes" subtitle="Subsidies & benefits for farmers" backHref="/dashboard" icon="📄" />
            <div className="scroll">
                <div className="chips">
                    {filters.map(f => (
                        <button key={f} className={`chip ${activeFilter === f ? 'active' : ''}`} onClick={() => setActiveFilter(f)}>{f}</button>
                    ))}
                </div>
                <div className="card mb-0" style={{ padding: 0 }}>
                    {schemes.map((s, i) => (
                        <div key={s.id} className="sc-item" style={i === schemes.length - 1 ? { borderBottom: 'none' } : {}} onClick={() => setSelectedScheme(s)}>
                            <div className="sc-tags"><span className="tag">{s.category}</span><span style={{ fontSize: 11, color: 'var(--sub)' }}>👥 {s.beneficiaries}</span></div>
                            <div className="sc-top"><div><div className="sc-name">{s.name}</div><div className="sc-sub">{s.subtitle}</div></div><div><div className="sc-benefit">{s.benefit}</div><div style={{ color: 'var(--light)', fontSize: 14, textAlign: 'right' }}>›</div></div></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Scheme Detail Sheet */}
            {selectedScheme && (
                <div className="overlay open" onClick={e => { if (e.target === e.currentTarget) setSelectedScheme(null); }}>
                    <div className="sheet">
                        <div className="sheet-handle" />
                        <div className="sheet-title">{selectedScheme.name}</div>
                        <div className="sheet-body">
                            {selectedScheme.eligible && (
                                <div className="alert alert-g"><span className="alert-ico">✅</span><div className="alert-txt"><strong>You are eligible!</strong> Based on your profile.</div></div>
                            )}
                            <p style={{ fontSize: 13, color: 'var(--sub)', lineHeight: 1.6, marginBottom: 14 }}>{selectedScheme.details?.description}</p>
                            <div className="row mt-16">
                                <button className="btn btn-out btn-sm col">Learn More</button>
                                <button className="btn btn-g btn-sm col" onClick={() => setSelectedScheme(null)}>Apply Now →</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <BottomNav />
        </div>
    );
}
