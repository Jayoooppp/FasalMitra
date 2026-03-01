'use client';
import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import TopBar from '@/components/layout/TopBar';
import BottomNav from '@/components/layout/BottomNav';

export default function MarketPage() {
    const [prices, setPrices] = useState<any[]>([]);
    const [insight, setInsight] = useState('');
    const [activeTab, setActiveTab] = useState('live');
    const [sellQty, setSellQty] = useState('');
    const [sellPrice, setSellPrice] = useState('1900');

    useEffect(() => {
        api.getPrices().then(data => { setPrices(data.prices); setInsight(data.insight); }).catch(() => { });
    }, []);

    const revenue = (parseFloat(sellQty) || 0) * (parseFloat(sellPrice) || 0);

    return (
        <div className="app">
            <TopBar title="Market & Sales" subtitle="Live mandi prices & sell your produce" backHref="/dashboard" icon="📈" />
            <div className="scroll">
                <div className="segs">
                    <button className={`seg ${activeTab === 'live' ? 'active' : ''}`} onClick={() => setActiveTab('live')}>Live Prices</button>
                    <button className={`seg ${activeTab === 'sell' ? 'active' : ''}`} onClick={() => setActiveTab('sell')}>Sell Now</button>
                </div>

                {activeTab === 'live' && (
                    <>
                        {insight && <div className="alert alert-g"><span className="alert-ico">📈</span><div className="alert-txt"><strong>AI Insight:</strong> {insight}</div></div>}
                        <div className="card mb-0" style={{ padding: 0 }}>
                            {prices.map((p, i) => (
                                <div key={p.id} className="pr" style={i === prices.length - 1 ? { borderBottom: 'none' } : {}}>
                                    <div className="pr-img">{p.emoji}</div>
                                    <div style={{ flex: 1 }}>
                                        <div className="pr-name">{p.name}</div>
                                        <div className="pr-sub">{p.grade}</div>
                                        <div className={p.direction === 'up' ? 'pr-up' : 'pr-dn'}>
                                            {p.direction === 'up' ? '↗' : '↘'} {Math.abs(p.change)}% {p.direction} · Best: ₹{p.bestPrice} at {p.bestMarket}
                                        </div>
                                    </div>
                                    <div className="pr-r">
                                        <div className="pr-val">₹{p.price.toLocaleString()}</div>
                                        <div className="pr-unit">{p.unit}</div>
                                        {p.msp && <div className="pr-msp">MSP: ₹{p.msp.toLocaleString()}</div>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {activeTab === 'sell' && (
                    <>
                        <div className="card p-16 mb-12">
                            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>List Your Produce</div>
                            <div className="ig"><label>Select Crop</label><select><option>Onion</option><option>Rice (Paddy)</option><option>Soybean</option><option>Cotton</option></select></div>
                            <div className="ig"><label>Quantity (Quintals)</label><input type="number" value={sellQty} onChange={e => setSellQty(e.target.value)} placeholder="e.g., 50" /></div>
                            <div className="ig mb-0"><label>Expected Price (₹/quintal)</label><input type="number" value={sellPrice} onChange={e => setSellPrice(e.target.value)} /></div>
                        </div>
                        {revenue > 0 && (
                            <div className="card p-16 mb-12">
                                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--sub)', marginBottom: 4 }}>Estimated Revenue</div>
                                <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--green)' }}>₹{revenue.toLocaleString('en-IN')}</div>
                            </div>
                        )}
                        <button className="btn btn-g btn-full mb-16">🛒 List for Sale</button>
                    </>
                )}
            </div>
            <BottomNav />
        </div>
    );
}
