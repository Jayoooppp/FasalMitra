const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function request(endpoint: string, options: RequestInit = {}) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string> || {}),
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
}

export const api = {
    // Auth
    register: (body: object) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
    login: (body: object) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
    getProfile: () => request('/auth/profile'),
    updateProfile: (body: object) => request('/auth/profile', { method: 'PUT', body: JSON.stringify(body) }),

    // Market
    getPrices: () => request('/market/prices'),
    getPriceHistory: (crop: string) => request(`/market/prices/${crop}/history`),
    getNearbyMarkets: () => request('/market/markets'),

    // Schemes
    getSchemes: (category?: string) => request(`/schemes${category ? `?category=${category}` : ''}`),
    getScheme: (id: string) => request(`/schemes/${id}`),

    // Diseases
    getDiseases: () => request('/diseases'),
    getDisease: (id: string) => request(`/diseases/${id}`),
    getDiseaseHistory: () => request('/diseases/history'),

    // Crops
    getCropRecommendation: (body: object) => request('/crop/recommend', { method: 'POST', body: JSON.stringify(body) }),

    // Labor
    getLaborers: (skill?: string) => request(`/labor${skill ? `?skill=${skill}` : ''}`),

    // News
    getNews: (category?: string) => request(`/news${category ? `?category=${category}` : ''}`),

    // Tasks
    getTasks: () => request('/tasks'),
    createTask: (body: object) => request('/tasks', { method: 'POST', body: JSON.stringify(body) }),
    updateTask: (id: string, body: object) => request(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    deleteTask: (id: string) => request(`/tasks/${id}`, { method: 'DELETE' }),

    // AI
    aiChat: (body: object) => request('/ai/chat', { method: 'POST', body: JSON.stringify(body) }),
    aiDiagnose: (body: object) => request('/ai/diagnose', { method: 'POST', body: JSON.stringify(body) }),
    aiCrop: (body: object) => request('/ai/crop', { method: 'POST', body: JSON.stringify(body) }),

    // Weather
    getWeather: (location: string) => request(`/weather?location=${encodeURIComponent(location)}`),
};
