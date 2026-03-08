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

    // Active Crops (per-user)
    getActiveCrops: () => request('/auth/crops'),
    addActiveCrop: (body: object) => request('/auth/crops', { method: 'POST', body: JSON.stringify(body) }),
    removeActiveCrop: (cropId: string) => request(`/auth/crops/${cropId}`, { method: 'DELETE' }),

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
    getNews: (params?: { category?: string; crops?: string[]; location?: string }) => {
        const qs = new URLSearchParams();
        if (params?.category && params.category !== 'All') qs.set('category', params.category);
        if (params?.crops?.length) qs.set('crops', params.crops.join(','));
        if (params?.location) qs.set('location', params.location);
        const query = qs.toString();
        return request(`/news${query ? `?${query}` : ''}`);
    },

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

// ──────────────────────────────────────────────────────
// V2 API — Provider-Aware (uses AWS or local backend)
// Use these when you want the switchable provider support.
// The response format is identical to v1.
// ──────────────────────────────────────────────────────

export const apiV2 = {
    // Auth (Cognito or JWT)
    register: (body: object) => request('/v2/auth/register', { method: 'POST', body: JSON.stringify(body) }),
    login: (body: object) => request('/v2/auth/login', { method: 'POST', body: JSON.stringify(body) }),
    getProfile: () => request('/v2/auth/profile'),
    updateProfile: (body: object) => request('/v2/auth/profile', { method: 'PUT', body: JSON.stringify(body) }),

    // Active Crops
    getActiveCrops: () => request('/v2/auth/crops'),
    addActiveCrop: (body: object) => request('/v2/auth/crops', { method: 'POST', body: JSON.stringify(body) }),
    removeActiveCrop: (cropId: string) => request(`/v2/auth/crops/${cropId}`, { method: 'DELETE' }),

    // AI (Bedrock or Gemini)
    aiChat: (body: object) => request('/v2/ai/chat', { method: 'POST', body: JSON.stringify(body) }),
    aiDiagnose: (body: object) => request('/v2/ai/diagnose', { method: 'POST', body: JSON.stringify(body) }),
    aiCrop: (body: object) => request('/v2/ai/crop', { method: 'POST', body: JSON.stringify(body) }),

    // Tasks (DynamoDB or MongoDB)
    getTasks: () => request('/v2/tasks'),
    createTask: (body: object) => request('/v2/tasks', { method: 'POST', body: JSON.stringify(body) }),
    updateTask: (id: string, body: object) => request(`/v2/tasks/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    deleteTask: (id: string) => request(`/v2/tasks/${id}`, { method: 'DELETE' }),

    // Storage (S3) — new
    uploadImage: (body: { data: string; contentType?: string; folder?: string }) =>
        request('/v2/storage/upload', { method: 'POST', body: JSON.stringify(body) }),
    getPresignedUploadUrl: (key: string, contentType?: string) =>
        request(`/v2/storage/presigned-url?key=${encodeURIComponent(key)}&contentType=${encodeURIComponent(contentType || 'image/jpeg')}`),
    getSignedUrl: (key: string) =>
        request(`/v2/storage/signed-url?key=${encodeURIComponent(key)}`),
    listFiles: (prefix?: string) =>
        request(`/v2/storage/list${prefix ? `?prefix=${encodeURIComponent(prefix)}` : ''}`),

    // Text-to-Speech (Polly) — new
    synthesizeSpeech: async (text: string, language?: string): Promise<Blob> => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch(`${API_BASE}/v2/tts/synthesize`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ text, language: language || 'en' }),
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'TTS failed');
        }

        return res.blob();
    },
    listVoices: (language?: string) =>
        request(`/v2/tts/voices${language ? `?language=${encodeURIComponent(language)}` : ''}`),
};
