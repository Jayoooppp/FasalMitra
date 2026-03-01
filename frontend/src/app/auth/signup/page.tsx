'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function SignUp() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        setLoading(true);
        try {
            await register({ name, email, password, phone });
            router.push('/dashboard');
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Registration failed');
        }
        setLoading(false);
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-logo">🌾</div>
                <h1 className="auth-title">Create Account</h1>
                <p className="auth-sub">Join FasalMitra — Your AI Farm Assistant</p>

                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="ig">
                        <label>Full Name</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Rajesh Kumar" required />
                    </div>
                    <div className="ig">
                        <label>Email</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="farmer@example.com" required />
                    </div>
                    <div className="ig">
                        <label>Phone (Optional)</label>
                        <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98765 43210" />
                    </div>
                    <div className="ig">
                        <label>Password</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters" required minLength={6} />
                    </div>
                    <div className="ig">
                        <label>Confirm Password</label>
                        <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Re-enter password" required />
                    </div>
                    <button className="btn btn-g btn-full" type="submit" disabled={loading}>
                        {loading ? <><span className="spinner" />Creating Account…</> : 'Create Account'}
                    </button>
                </form>

                <div className="auth-link">
                    Already have an account? <Link href="/auth/signin">Sign In</Link>
                </div>
            </div>
        </div>
    );
}
