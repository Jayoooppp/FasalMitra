'use client';
import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import TopBar from '@/components/layout/TopBar';
import BottomNav from '@/components/layout/BottomNav';

export default function SoilPage() {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        api.getSoilData().then(setData).catch(() => { });
    }, []);

    if (!data) return <div className="app"><TopBar title="Soil Analytics" subtitle="Your field health report" backHref="/dashboard" icon="🧪" /><div className="loading-page"><div className="spinner" /></div><BottomNav /></div>;

    return (
        <div className="app">
            <TopBar title="Soil Analytics" subtitle="Your field health report" backHref="/dashboard" icon="🧪" />
            <div className="scroll">
                <div className="card p-16 mb-12" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 13, color: 'var(--sub)', marginBottom: 6 }}>Overall Soil Health Score</div>
                    <div className="gauge-ring">
                        <svg width="100" height="100" viewBox="0 0 100 100">
                            <circle className="track" cx="50" cy="50" r="40" />
                            <circle className="fill-ring" cx="50" cy="50" r="40" strokeDasharray={`${(data.overallScore / 100) * 251} 251`} strokeDashoffset="0" />
                        </svg>
                        <div className="gauge-center"><div className="gauge-val">{data.overallScore}</div><div className="gauge-lbl">/ 100</div></div>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--green)' }}>{data.status}</div>
                    <div style={{ fontSize: 12, color: 'var(--sub)', marginTop: 3 }}>Last tested: {data.lastTested}</div>
                </div>

                <div className="soil-grid">
                    {data.metrics?.map((m: any) => (
                        <div key={m.label} className="soil-card">
                            <div style={{ fontSize: 24 }}>{m.icon}</div>
                            <div className="soil-val">{m.value}</div>
                            <div className="soil-lbl">{m.label}</div>
                            <div className="soil-status" style={{ color: `var(--${m.statusColor})` }}>{m.status}</div>
                        </div>
                    ))}
                </div>

                {data.alerts?.map((a: any, i: number) => (
                    <div key={i} className={`alert alert-${a.type === 'red' ? 'r' : 'w'}`}>
                        <span className="alert-ico">{a.icon}</span>
                        <div className="alert-txt" dangerouslySetInnerHTML={{ __html: a.message }} />
                    </div>
                ))}

                <div className="sec-row"><span className="sec-lbl">AI Recommendations</span></div>
                <div className="card p-16 mb-12">
                    <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Fertilizer Schedule for Current Season</div>
                    {data.fertilizerSchedule?.map((f: any, i: number) => (
                        <div key={i} className="ri" style={{ padding: '8px 0', cursor: 'default', borderBottom: i < data.fertilizerSchedule.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
                            <div><div className="rtit" style={{ fontSize: 13 }}>{f.name}</div><div className="rsub">{f.note}</div></div>
                            <span style={{ fontSize: 13, fontWeight: 700, color: f.urgent ? 'var(--red)' : 'inherit' }}>{f.amount}</span>
                        </div>
                    ))}
                </div>
            </div>
            <BottomNav />
        </div>
    );
}
