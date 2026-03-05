'use client';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/context/LanguageContext';
import { api } from '@/services/api';
import TopBar from '@/components/layout/TopBar';
import BottomNav from '@/components/layout/BottomNav';

interface Message { text: string; isUser: boolean; }

const SYSTEM_PROMPT = `You are FasalMitra AI, an expert agricultural assistant for Indian farmers. You help with crop recommendations, disease diagnosis, government schemes, market prices, soil health, and weather-based advice. Respond in a friendly, practical way with specific dosages, prices, and actionable steps. Keep responses under 200 words. Use bullet points and emojis. Respond in whatever language the farmer uses (Hindi, Marathi, or English).`;

export default function AIChatPage() {
    const { user } = useAuth();
    const t = useTranslation();
    const quickActions = [t('aiChat.q1'), t('aiChat.q2'), t('aiChat.q3'), t('aiChat.q4'), t('aiChat.q5'), t('aiChat.q6')];
    const [messages, setMessages] = useState<Message[]>([
        { text: `नमस्ते ${user?.name || t('profile.farmer')} जी! 🙏\n\nI'm your FasalMitra AI assistant. I can help with:\n• 🌱 Crop recommendations & planning\n• 🔬 Disease diagnosis & treatment\n• 💰 Market prices & best time to sell\n• 🏛️ Government schemes & subsidies\n• 🌦️ Weather-based farm advice\n• 📊 Soil health & fertilizer guidance\n\nAsk me anything in Hindi, Marathi, or English!`, isUser: false }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const chatRef = useRef<HTMLDivElement>(null);
    const chatHistory = useRef<{ role: string; content: string }[]>([]);

    useEffect(() => { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; }, [messages]);

    const sendMessage = async (text: string) => {
        if (!text.trim() || loading) return;
        setInput('');
        setMessages(prev => [...prev, { text, isUser: true }]);
        chatHistory.current.push({ role: 'user', content: text });
        setLoading(true);
        try {
            const data = await api.aiChat({ system: SYSTEM_PROMPT, messages: chatHistory.current.slice(-10) });
            const reply = data?.content?.[0]?.text || "I'm having trouble connecting. Please try again.";
            chatHistory.current.push({ role: 'assistant', content: reply });
            setMessages(prev => [...prev, { text: reply, isUser: false }]);
        } catch {
            setMessages(prev => [...prev, { text: t('aiChat.networkError'), isUser: false }]);
        }
        setLoading(false);
    };

    return (
        <div className="app">
            <TopBar title={t('aiChat.title')} subtitle={t('aiChat.subtitle')} backHref="/dashboard" icon="🎙️" />
            <div className="chat-msgs" ref={chatRef}>
                {messages.map((m, i) => (
                    <div key={i} className={`msg ${m.isUser ? 'msg-user' : 'msg-bot'}`} dangerouslySetInnerHTML={{ __html: m.text.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                ))}
                {messages.length === 1 && !loading && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 2 }}>
                        {quickActions.map(q => <button key={q} className="chip" onClick={() => sendMessage(q)}>{q}</button>)}
                    </div>
                )}
                {loading && (
                    <div className="msg msg-bot"><div className="typing-dots"><span /><span /><span /></div></div>
                )}
            </div>
            <div className="chat-bar">
                <input className="chat-inp" value={input} onChange={e => setInput(e.target.value)} placeholder={t('aiChat.placeholder')} onKeyDown={e => e.key === 'Enter' && sendMessage(input)} />
                <button className="chat-send" onClick={() => sendMessage(input)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="15" height="15"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                </button>
            </div>
        </div>
    );
}
