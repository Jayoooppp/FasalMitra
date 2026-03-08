'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/context/LanguageContext';
import LocationSelect from '@/components/LocationSelect';

export default function SignUp() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [location, setLocation] = useState('');
    const [farmSize, setFarmSize] = useState('');
    const [soilType, setSoilType] = useState('');
    const [preferredLanguage, setPreferredLanguage] = useState('English');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { user, loading: authLoading, register } = useAuth();
    const router = useRouter();
    const t = useTranslation();

    // Redirect authenticated users to dashboard
    useEffect(() => {
        if (!authLoading && user) {
            router.replace('/dashboard');
        }
    }, [user, authLoading, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (password !== confirmPassword) {
            setError(t('signup.errorMismatch'));
            return;
        }
        if (!location) {
            setError(t('signup.errorLocation'));
            return;
        }
        setLoading(true);
        try {
            await register({ name, email, password, phone, location, farmSize: parseFloat(farmSize), soilType, preferredLanguage });
            // After signup, guide new users to get their first AI crop recommendation
            router.push('/crop?new=1');
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Registration failed');
        }
        setLoading(false);
    };

    // Show loading while checking auth state
    if (authLoading || user) {
        return <div className="loading-page"><div className="spinner" /></div>;
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-logo">🌾</div>
                <h1 className="auth-title">{t('signup.title')}</h1>
                <p className="auth-sub">{t('signup.subtitle')}</p>

                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="ig">
                        <label>{t('signup.name')}</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Rajesh Kumar" required />
                    </div>
                    <div className="ig">
                        <label>{t('signup.email')}</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="farmer@example.com" required />
                    </div>
                    <div className="ig">
                        <label>{t('signup.phone')}</label>
                        <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98765 43210" />
                    </div>
                    <div className="ig">
                        <label>{t('signup.location')}</label>
                        <LocationSelect value={location} onChange={setLocation} required />
                    </div>
                    <div className="ig">
                        <label>{t('signup.farmSize')}</label>
                        <input type="number" value={farmSize} onChange={e => setFarmSize(e.target.value)} placeholder="e.g. 2.5" min="0" step="0.1" required />
                    </div>
                    <div className="ig">
                        <label>{t('signup.soilType')}</label>
                        <select value={soilType} onChange={e => setSoilType(e.target.value)} required>
                            <option value="" disabled>{t('signup.soilPlaceholder')}</option>
                            <option value="Black Cotton">Black Cotton</option>
                            <option value="Red">Red</option>
                            <option value="Laterite">Laterite</option>
                            <option value="Alluvial">Alluvial</option>
                            <option value="Sandy">Sandy</option>
                            <option value="Clay">Clay</option>
                            <option value="Loamy">Loamy</option>
                        </select>
                    </div>
                    <div className="ig">
                        <label>{t('signup.language')}</label>
                        <select value={preferredLanguage} onChange={e => setPreferredLanguage(e.target.value)}>
                            <option value="English">English</option>
                            <option value="Hindi">Hindi</option>
                            <option value="Marathi">Marathi</option>
                        </select>
                    </div>
                    <div className="ig">
                        <label>{t('signup.password')}</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters" required minLength={6} />
                    </div>
                    <div className="ig">
                        <label>{t('signup.confirmPassword')}</label>
                        <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Re-enter password" required />
                    </div>
                    <button className="btn btn-g btn-full" type="submit" disabled={loading}>
                        {loading ? <><span className="spinner" />{t('signup.loading')}</> : t('signup.button')}
                    </button>
                </form>

                <div className="auth-link">
                    {t('signup.hasAccount')} <Link href="/auth/signin">{t('signup.signIn')}</Link>
                </div>
            </div>
        </div>
    );
}
