'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import BottomNav from '@/components/layout/BottomNav';

export default function ProfilePage() {
    const { user, logout } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/auth/signin');
    };

    return (
        <div className="app">
            <div className="scroll" style={{ padding: 0 }}>
                <div className="profile-header">
                    <div className="profile-avatar">👨‍🌾</div>
                    <div className="profile-name">{user?.name || 'Farmer'}</div>
                    <div className="profile-detail">📍 {user?.location || 'Nashik, Maharashtra'}</div>
                    <div className="profile-stats">
                        <div className="ps-item"><div className="ps-val">{user?.farmSize || 2.5}</div><div className="ps-lbl">Acres</div></div>
                        <div className="ps-item"><div className="ps-val">₹85K</div><div className="ps-lbl">Est. Earnings</div></div>
                        <div className="ps-item"><div className="ps-val">3</div><div className="ps-lbl">Active Crops</div></div>
                    </div>
                </div>
                <div style={{ padding: 16 }}>
                    <div className="card p-16 mb-12">
                        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Farm Profile</div>
                        <div className="ig"><label>Full Name</label><input defaultValue={user?.name || ''} /></div>
                        <div className="ig"><label>Email</label><input defaultValue={user?.email || ''} readOnly /></div>
                        <div className="ig"><label>Phone</label><input defaultValue={user?.phone || ''} /></div>
                        <div className="ig"><label>Location</label><input defaultValue={user?.location || ''} /></div>
                        <div className="ig mb-0"><label>Preferred Language</label><select defaultValue={user?.preferredLanguage || 'English'}><option>Marathi</option><option>Hindi</option><option>English</option></select></div>
                    </div>
                    <div className="card" style={{ padding: 0 }}>
                        <Link href="/guide" className="ri" style={{ textDecoration: 'none', color: 'inherit' }}><div className="ril"><div className="rico">📋</div><div><div className="rtit">My Crop History</div><div className="rsub">View past seasons</div></div></div><div className="rarr">›</div></Link>
                        <Link href="/schemes" className="ri" style={{ textDecoration: 'none', color: 'inherit' }}><div className="ril"><div className="rico">📄</div><div><div className="rtit">Enrolled Schemes</div><div className="rsub">PM-KISAN, Fasal Bima</div></div></div><div className="rarr">›</div></Link>
                        <div className="ri" style={{ borderBottom: 'none' }}><div className="ril"><div className="rico">⚙️</div><div><div className="rtit">App Settings</div><div className="rsub">Language, notifications</div></div></div><div className="rarr">›</div></div>
                    </div>
                    <button className="btn btn-red btn-full mt-16" onClick={handleLogout}>Sign Out</button>
                    <Link href="/dashboard" className="btn btn-ghost btn-full mt-8" style={{ textDecoration: 'none' }}>← Back to Home</Link>
                </div>
            </div>
            <BottomNav />
        </div>
    );
}
