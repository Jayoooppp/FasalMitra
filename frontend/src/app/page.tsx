'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (user) {
                router.replace('/dashboard');
            } else {
                router.replace('/auth/signin');
            }
        }
    }, [user, loading, router]);

    return (
        <div className="loading-page">
            <div className="spinner" />
            <p style={{ color: 'var(--sub)', fontSize: 14 }}>Loading FasalMitra…</p>
        </div>
    );
}
