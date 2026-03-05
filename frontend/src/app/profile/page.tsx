'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/context/LanguageContext';
import { useToast } from '@/context/ToastContext';
import { api } from '@/services/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import BottomNav from '@/components/layout/BottomNav';

export default function ProfilePage() {
    const { user, logout, updateUser } = useAuth();
    const router = useRouter();
    const t = useTranslation();
    const { showToast } = useToast();

    // Controlled form state initialized from user data
    const [name, setName] = useState(user?.name || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [location, setLocation] = useState(user?.location || '');
    const [preferredLanguage, setPreferredLanguage] = useState(user?.preferredLanguage || 'English');
    const [saving, setSaving] = useState(false);

    const handleLogout = () => {
        logout();
        router.push('/auth/signin');
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const updated = await api.updateProfile({
                name,
                phone,
                location,
                farmSize: user?.farmSize,
                soilType: user?.soilType,
                preferredLanguage,
            });
            // Update local auth state + localStorage
            updateUser(updated);
            showToast(t('profile.saved'));
        } catch (err: unknown) {
            showToast(err instanceof Error ? err.message : 'Update failed');
        }
        setSaving(false);
    };

    return (
        <div className="app">
            <div className="scroll" style={{ padding: 0 }}>
                <div className="profile-header">
                    <div className="profile-avatar">👨‍🌾</div>
                    <div className="profile-name">{user?.name || t('profile.farmer')}</div>
                    <div className="profile-detail">📍 {user?.location || '—'}</div>
                    <div className="profile-stats">
                        <div className="ps-item"><div className="ps-val">{user?.farmSize ?? '—'}</div><div className="ps-lbl">{t('profile.acres')}</div></div>
                        <div className="ps-item"><div className="ps-val">₹85K</div><div className="ps-lbl">{t('profile.estEarnings')}</div></div>
                        <div className="ps-item"><div className="ps-val">3</div><div className="ps-lbl">{t('profile.activeCrops')}</div></div>
                    </div>
                </div>
                <div style={{ padding: 16 }}>
                    <div className="card p-16 mb-12">
                        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>{t('profile.farmProfile')}</div>
                        <div className="ig"><label>{t('profile.name')}</label><input value={name} onChange={e => setName(e.target.value)} /></div>
                        <div className="ig"><label>{t('profile.email')}</label><input value={user?.email || ''} readOnly style={{ opacity: 0.6, cursor: 'not-allowed' }} /></div>
                        <div className="ig"><label>{t('profile.phone')}</label><input value={phone} onChange={e => setPhone(e.target.value)} /></div>
                        <div className="ig"><label>{t('profile.location')}</label><input value={location} onChange={e => setLocation(e.target.value)} /></div>
                        <div className="ig mb-0"><label>{t('profile.language')}</label><select value={preferredLanguage} onChange={e => setPreferredLanguage(e.target.value)}><option value="English">English</option><option value="Hindi">Hindi</option><option value="Marathi">Marathi</option></select></div>
                        <button className="btn btn-g btn-full mt-16" onClick={handleSave} disabled={saving}>
                            {saving ? <><span className="spinner" />{t('profile.saving')}</> : t('profile.save')}
                        </button>
                    </div>
                    <div className="card" style={{ padding: 0 }}>
                        <Link href="/guide" className="ri" style={{ textDecoration: 'none', color: 'inherit' }}><div className="ril"><div className="rico">📋</div><div><div className="rtit">{t('profile.cropHistory')}</div><div className="rsub">{t('profile.cropHistorySub')}</div></div></div><div className="rarr">›</div></Link>
                        <Link href="/schemes" className="ri" style={{ textDecoration: 'none', color: 'inherit' }}><div className="ril"><div className="rico">📄</div><div><div className="rtit">{t('profile.enrolledSchemes')}</div><div className="rsub">{t('profile.enrolledSchemesSub')}</div></div></div><div className="rarr">›</div></Link>
                        <div className="ri" style={{ borderBottom: 'none' }}><div className="ril"><div className="rico">⚙️</div><div><div className="rtit">{t('profile.appSettings')}</div><div className="rsub">{t('profile.appSettingsSub')}</div></div></div><div className="rarr">›</div></div>
                    </div>
                    <button className="btn btn-red btn-full mt-16" onClick={handleLogout}>{t('profile.signOut')}</button>
                    <Link href="/dashboard" className="btn btn-ghost btn-full mt-8" style={{ textDecoration: 'none' }}>{t('profile.backHome')}</Link>
                </div>
            </div>
            <BottomNav />
        </div>
    );
}
