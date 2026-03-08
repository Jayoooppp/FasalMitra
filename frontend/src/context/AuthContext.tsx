'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/services/api';

export interface ActiveCrop {
    _id: string;
    name: string;
    emoji: string;
    season: string;
    startDate: string;
    acreage: number;
    dayCount: number;
    totalDays: number;
}

export interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    location: string;
    farmSize: number;
    soilType: string;
    preferredLanguage: string;
    activeCrops: ActiveCrop[];
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (data: { name: string; email: string; password: string; phone?: string; location: string; farmSize: number; soilType: string; preferredLanguage?: string }) => Promise<void>;
    logout: () => void;
    updateUser: (data: Partial<User>) => void;
    addCrop: (crop: { name: string; emoji: string; season: string; acreage?: number; totalDays?: number }) => Promise<void>;
    removeCrop: (cropId: string) => Promise<void>;
    refreshCrops: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        if (savedToken && savedUser) {
            setToken(savedToken);
            try {
                const parsed = JSON.parse(savedUser);
                // Ensure activeCrops always exists
                if (!parsed.activeCrops) parsed.activeCrops = [];
                setUser(parsed);
            } catch { }
        }
        setLoading(false);
    }, []);

    const saveUser = (userData: User) => {
        if (!userData.activeCrops) userData.activeCrops = [];
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const login = async (email: string, password: string) => {
        const data = await api.login({ email, password });
        setToken(data.token);
        saveUser({ ...data.user, activeCrops: data.user.activeCrops || [] });
        localStorage.setItem('token', data.token);
    };

    const register = async (regData: { name: string; email: string; password: string; phone?: string; location: string; farmSize: number; soilType: string; preferredLanguage?: string }) => {
        const data = await api.register(regData);
        setToken(data.token);
        saveUser({ ...data.user, activeCrops: data.user.activeCrops || [] });
        localStorage.setItem('token', data.token);
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    const updateUser = (data: Partial<User>) => {
        if (user) {
            const updated = { ...user, ...data };
            saveUser(updated);
        }
    };

    const refreshCrops = async () => {
        try {
            const data = await api.getActiveCrops();
            if (user) {
                saveUser({ ...user, activeCrops: data.activeCrops || [] });
            }
        } catch { /* silent */ }
    };

    const addCrop = async (crop: { name: string; emoji: string; season: string; acreage?: number; totalDays?: number }) => {
        const data = await api.addActiveCrop({
            name: crop.name,
            emoji: crop.emoji,
            season: crop.season,
            acreage: crop.acreage || (user?.farmSize || 1),
            totalDays: crop.totalDays || 120,
        });
        if (user) {
            saveUser({ ...user, activeCrops: data.activeCrops || [] });
        }
    };

    const removeCrop = async (cropId: string) => {
        const data = await api.removeActiveCrop(cropId);
        if (user) {
            saveUser({ ...user, activeCrops: data.activeCrops || [] });
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUser, addCrop, removeCrop, refreshCrops }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
}
