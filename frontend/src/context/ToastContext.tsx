'use client';
import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface ToastContextType {
    showToast: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [message, setMessage] = useState('');
    const [visible, setVisible] = useState(false);

    const showToast = useCallback((msg: string, duration = 3000) => {
        setMessage(msg);
        setVisible(true);
        setTimeout(() => setVisible(false), duration);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className={`toast ${visible ? 'show' : ''}`}>{message}</div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within ToastProvider');
    return context;
}
