'use client';
import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import TopBar from '@/components/layout/TopBar';
import BottomNav from '@/components/layout/BottomNav';

export default function LaborPage() {
    const [laborers, setLaborers] = useState<any[]>([]);
    const [activeFilter, setActiveFilter] = useState('All');
    const [activeTab, setActiveTab] = useState('find');
    const filters = ['All', 'Harvesting', 'Sowing', 'Irrigation', 'Pest Control', 'General'];

    useEffect(() => {
        api.getLaborers(activeFilter !== 'All' ? activeFilter : undefined)
            .then(data => setLaborers(data.laborers))
            .catch(() => { });
    }, [activeFilter]);

    return (
        <div className="app">
            <TopBar title="Labor Finder" subtitle="Find & hire farm workers" backHref="/dashboard" icon="👥" />
            <div className="scroll">
                <div className="segs">
                    <button className={`seg ${activeTab === 'find' ? 'active' : ''}`} onClick={() => setActiveTab('find')}>Find Workers</button>
                    <button className={`seg ${activeTab === 'post' ? 'active' : ''}`} onClick={() => setActiveTab('post')}>Post Job</button>
                </div>

                {activeTab === 'find' && (
                    <>
                        <div className="chips">
                            {filters.map(f => <button key={f} className={`chip ${activeFilter === f ? 'active' : ''}`} onClick={() => setActiveFilter(f)}>{f}</button>)}
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
                                    <button className="btn btn-out btn-sm col">📞 Call</button>
                                    <button className="btn btn-g btn-sm col">💬 Message</button>
                                </div>
                            </div>
                        ))}
                    </>
                )}

                {activeTab === 'post' && (
                    <div className="card p-16 mb-12">
                        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Post a Job</div>
                        <div className="ig"><label>Job Title</label><input placeholder="e.g., Onion Harvesting" /></div>
                        <div className="ig"><label>Workers Needed</label><input type="number" placeholder="5" /></div>
                        <div className="ig"><label>Start Date</label><input type="date" /></div>
                        <div className="ig"><label>Daily Wage (₹/day)</label><input type="number" placeholder="400" /></div>
                        <div className="ig mb-0"><label>Description</label><input placeholder="Describe the work…" /></div>
                        <button className="btn btn-g btn-full mt-16">Post Job</button>
                    </div>
                )}
            </div>
            <BottomNav />
        </div>
    );
}
