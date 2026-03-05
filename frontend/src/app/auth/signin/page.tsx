'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/context/LanguageContext';

export default function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { user, loading: authLoading, login } = useAuth();
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
        setLoading(true);
        try {
            await login(email, password);
            router.push('/dashboard');
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Login failed');
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
                <h1 className="auth-title">{t('signin.title')}</h1>
                <p className="auth-sub">{t('signin.subtitle')}</p>

                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="ig">
                        <label>{t('signin.email')}</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="farmer@example.com" required />
                    </div>
                    <div className="ig">
                        <label>{t('signin.password')}</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} />
                    </div>
                    <button className="btn btn-g btn-full" type="submit" disabled={loading}>
                        {loading ? <><span className="spinner" />{t('signin.loading')}</> : t('signin.button')}
                    </button>
                </form>

                <div className="auth-link">
                    {t('signin.noAccount')} <Link href="/auth/signup">{t('signin.signUp')}</Link>
                </div>
            </div>
        </div>
    );
}
