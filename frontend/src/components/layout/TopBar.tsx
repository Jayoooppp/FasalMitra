'use client';
import { useRouter } from 'next/navigation';

interface TopBarProps {
    title: string;
    subtitle?: string;
    backHref?: string;
    icon?: string;
    onIconClick?: () => void;
}

export default function TopBar({ title, subtitle, backHref, icon, onIconClick }: TopBarProps) {
    const router = useRouter();

    return (
        <div className="topbar">
            <div className="tl">
                {backHref && (
                    <button className="back" onClick={() => router.push(backHref)}>←</button>
                )}
                <div>
                    <div className="t-title">{title}</div>
                    {subtitle && <div className="t-sub">{subtitle}</div>}
                </div>
            </div>
            {icon && (
                <button className="t-icon" onClick={onIconClick}>{icon}</button>
            )}
        </div>
    );
}
