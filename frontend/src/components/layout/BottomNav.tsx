'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@/context/LanguageContext';

export default function BottomNav() {
    const pathname = usePathname();
    const t = useTranslation();

    const navItems = [
        { href: '/dashboard', labelKey: 'nav.home', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg> },
        { href: '/crop', labelKey: 'nav.crops', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22V12M12 12C12 7 7 4 2 4c0 5 3 8 10 8zM12 12c0-5 5-8 10-8-2 5-5 8-10 8z" /></svg> },
        { href: '/schemes', labelKey: 'nav.schemes', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg> },
        { href: '/market', labelKey: 'nav.market', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg> },
        { href: '/labor', labelKey: 'nav.labor', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg> },
        { href: '/news', labelKey: 'nav.news', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg> },
    ];

    return (
        <nav className="bnav">
            {navItems.map(item => (
                <Link key={item.href} href={item.href} className={`ni ${pathname === item.href ? 'active' : ''}`}>
                    {item.icon}
                    {t(item.labelKey)}
                </Link>
            ))}
        </nav>
    );
}
