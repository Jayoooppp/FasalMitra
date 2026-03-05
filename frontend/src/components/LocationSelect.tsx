'use client';
import { useState, useRef, useEffect } from 'react';

// Major agricultural districts/cities across Indian states
const INDIAN_LOCATIONS: string[] = [
    // Andhra Pradesh
    'Anantapur, Andhra Pradesh', 'Chittoor, Andhra Pradesh', 'East Godavari, Andhra Pradesh',
    'Guntur, Andhra Pradesh', 'Krishna, Andhra Pradesh', 'Kurnool, Andhra Pradesh',
    'Nellore, Andhra Pradesh', 'Prakasam, Andhra Pradesh', 'Srikakulam, Andhra Pradesh',
    'Visakhapatnam, Andhra Pradesh', 'West Godavari, Andhra Pradesh', 'Vijayawada, Andhra Pradesh',
    // Assam
    'Dibrugarh, Assam', 'Guwahati, Assam', 'Jorhat, Assam', 'Nagaon, Assam', 'Tezpur, Assam',
    // Bihar
    'Bhagalpur, Bihar', 'Gaya, Bihar', 'Muzaffarpur, Bihar', 'Patna, Bihar', 'Purnia, Bihar',
    'Samastipur, Bihar', 'Vaishali, Bihar',
    // Chhattisgarh
    'Bilaspur, Chhattisgarh', 'Durg, Chhattisgarh', 'Raipur, Chhattisgarh', 'Rajnandgaon, Chhattisgarh',
    // Goa
    'North Goa, Goa', 'South Goa, Goa',
    // Gujarat
    'Ahmedabad, Gujarat', 'Amreli, Gujarat', 'Banaskantha, Gujarat', 'Bhavnagar, Gujarat',
    'Junagadh, Gujarat', 'Kutch, Gujarat', 'Mehsana, Gujarat', 'Rajkot, Gujarat',
    'Surat, Gujarat', 'Vadodara, Gujarat',
    // Haryana
    'Ambala, Haryana', 'Faridabad, Haryana', 'Gurugram, Haryana', 'Hisar, Haryana',
    'Karnal, Haryana', 'Kurukshetra, Haryana', 'Panipat, Haryana', 'Rohtak, Haryana',
    'Sirsa, Haryana', 'Sonipat, Haryana',
    // Himachal Pradesh
    'Kangra, Himachal Pradesh', 'Kullu, Himachal Pradesh', 'Mandi, Himachal Pradesh',
    'Shimla, Himachal Pradesh', 'Solan, Himachal Pradesh',
    // Jharkhand
    'Dhanbad, Jharkhand', 'Dumka, Jharkhand', 'Hazaribagh, Jharkhand', 'Ranchi, Jharkhand',
    // Karnataka
    'Bagalkot, Karnataka', 'Bangalore Rural, Karnataka', 'Bangalore Urban, Karnataka',
    'Belgaum, Karnataka', 'Bellary, Karnataka', 'Bidar, Karnataka', 'Davangere, Karnataka',
    'Dharwad, Karnataka', 'Gulbarga, Karnataka', 'Hassan, Karnataka', 'Haveri, Karnataka',
    'Mandya, Karnataka', 'Mysore, Karnataka', 'Raichur, Karnataka', 'Shimoga, Karnataka',
    'Tumkur, Karnataka',
    // Kerala
    'Alappuzha, Kerala', 'Ernakulam, Kerala', 'Idukki, Kerala', 'Kannur, Kerala',
    'Kozhikode, Kerala', 'Palakkad, Kerala', 'Thrissur, Kerala', 'Wayanad, Kerala',
    // Madhya Pradesh
    'Bhopal, Madhya Pradesh', 'Dewas, Madhya Pradesh', 'Gwalior, Madhya Pradesh',
    'Hoshangabad, Madhya Pradesh', 'Indore, Madhya Pradesh', 'Jabalpur, Madhya Pradesh',
    'Rewa, Madhya Pradesh', 'Sagar, Madhya Pradesh', 'Satna, Madhya Pradesh',
    'Ujjain, Madhya Pradesh', 'Vidisha, Madhya Pradesh',
    // Maharashtra
    'Ahmednagar, Maharashtra', 'Akola, Maharashtra', 'Amravati, Maharashtra',
    'Aurangabad, Maharashtra', 'Beed, Maharashtra', 'Buldhana, Maharashtra',
    'Chandrapur, Maharashtra', 'Dhule, Maharashtra', 'Jalgaon, Maharashtra',
    'Jalna, Maharashtra', 'Kolhapur, Maharashtra', 'Latur, Maharashtra',
    'Mumbai, Maharashtra', 'Nagpur, Maharashtra', 'Nanded, Maharashtra',
    'Nashik, Maharashtra', 'Osmanabad, Maharashtra', 'Parbhani, Maharashtra',
    'Pune, Maharashtra', 'Ratnagiri, Maharashtra', 'Sangli, Maharashtra',
    'Satara, Maharashtra', 'Solapur, Maharashtra', 'Wardha, Maharashtra',
    'Yavatmal, Maharashtra',
    // Manipur
    'Imphal, Manipur',
    // Meghalaya
    'Shillong, Meghalaya',
    // Mizoram
    'Aizawl, Mizoram',
    // Nagaland
    'Dimapur, Nagaland', 'Kohima, Nagaland',
    // Odisha
    'Balasore, Odisha', 'Bhubaneswar, Odisha', 'Cuttack, Odisha', 'Ganjam, Odisha',
    'Kalahandi, Odisha', 'Khordha, Odisha', 'Mayurbhanj, Odisha', 'Sambalpur, Odisha',
    // Punjab
    'Amritsar, Punjab', 'Bathinda, Punjab', 'Faridkot, Punjab', 'Firozpur, Punjab',
    'Jalandhar, Punjab', 'Ludhiana, Punjab', 'Moga, Punjab', 'Patiala, Punjab',
    'Sangrur, Punjab',
    // Rajasthan
    'Ajmer, Rajasthan', 'Alwar, Rajasthan', 'Barmer, Rajasthan', 'Bharatpur, Rajasthan',
    'Bikaner, Rajasthan', 'Jaipur, Rajasthan', 'Jodhpur, Rajasthan', 'Kota, Rajasthan',
    'Nagaur, Rajasthan', 'Sikar, Rajasthan', 'Sri Ganganagar, Rajasthan', 'Udaipur, Rajasthan',
    // Sikkim
    'Gangtok, Sikkim',
    // Tamil Nadu
    'Chennai, Tamil Nadu', 'Coimbatore, Tamil Nadu', 'Cuddalore, Tamil Nadu',
    'Dindigul, Tamil Nadu', 'Erode, Tamil Nadu', 'Krishnagiri, Tamil Nadu',
    'Madurai, Tamil Nadu', 'Salem, Tamil Nadu', 'Thanjavur, Tamil Nadu',
    'Tirunelveli, Tamil Nadu', 'Tiruchirappalli, Tamil Nadu', 'Vellore, Tamil Nadu',
    'Villupuram, Tamil Nadu',
    // Telangana
    'Adilabad, Telangana', 'Hyderabad, Telangana', 'Karimnagar, Telangana',
    'Khammam, Telangana', 'Mahbubnagar, Telangana', 'Medak, Telangana',
    'Nalgonda, Telangana', 'Nizamabad, Telangana', 'Rangareddy, Telangana',
    'Warangal, Telangana',
    // Tripura
    'Agartala, Tripura',
    // Uttar Pradesh
    'Agra, Uttar Pradesh', 'Aligarh, Uttar Pradesh', 'Allahabad, Uttar Pradesh',
    'Azamgarh, Uttar Pradesh', 'Bareilly, Uttar Pradesh', 'Faizabad, Uttar Pradesh',
    'Gorakhpur, Uttar Pradesh', 'Jhansi, Uttar Pradesh', 'Kanpur, Uttar Pradesh',
    'Lucknow, Uttar Pradesh', 'Mathura, Uttar Pradesh', 'Meerut, Uttar Pradesh',
    'Moradabad, Uttar Pradesh', 'Muzaffarnagar, Uttar Pradesh', 'Sultanpur, Uttar Pradesh',
    'Varanasi, Uttar Pradesh',
    // Uttarakhand
    'Dehradun, Uttarakhand', 'Haridwar, Uttarakhand', 'Nainital, Uttarakhand',
    'Udham Singh Nagar, Uttarakhand',
    // West Bengal
    'Bardhaman, West Bengal', 'Hooghly, West Bengal', 'Howrah, West Bengal',
    'Kolkata, West Bengal', 'Malda, West Bengal', 'Murshidabad, West Bengal',
    'Nadia, West Bengal', 'North 24 Parganas, West Bengal', 'South 24 Parganas, West Bengal',
    // Union Territories
    'Chandigarh, Chandigarh', 'New Delhi, Delhi', 'Puducherry, Puducherry',
    'Jammu, Jammu & Kashmir', 'Srinagar, Jammu & Kashmir', 'Leh, Ladakh',
];

interface LocationSelectProps {
    value: string;
    onChange: (value: string) => void;
    required?: boolean;
}

export default function LocationSelect({ value, onChange, required }: LocationSelectProps) {
    const [query, setQuery] = useState(value);
    const [open, setOpen] = useState(false);
    const [highlightIdx, setHighlightIdx] = useState(-1);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLUListElement>(null);

    const filtered = query
        ? INDIAN_LOCATIONS.filter(loc => loc.toLowerCase().includes(query.toLowerCase())).slice(0, 30)
        : INDIAN_LOCATIONS.slice(0, 30);

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setOpen(false);
                // If the current query doesn't match a valid location, revert
                if (!INDIAN_LOCATIONS.includes(query)) {
                    setQuery(value);
                }
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [query, value]);

    // Scroll highlighted item into view
    useEffect(() => {
        if (listRef.current && highlightIdx >= 0) {
            const items = listRef.current.children;
            if (items[highlightIdx]) {
                (items[highlightIdx] as HTMLElement).scrollIntoView({ block: 'nearest' });
            }
        }
    }, [highlightIdx]);

    const select = (loc: string) => {
        setQuery(loc);
        onChange(loc);
        setOpen(false);
        setHighlightIdx(-1);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!open) return;
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setHighlightIdx(prev => Math.min(prev + 1, filtered.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setHighlightIdx(prev => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (highlightIdx >= 0 && filtered[highlightIdx]) {
                select(filtered[highlightIdx]);
            }
        } else if (e.key === 'Escape') {
            setOpen(false);
        }
    };

    // Split location into district and state for display
    const renderLocation = (loc: string) => {
        const parts = loc.split(', ');
        return (
            <>
                <span style={{ fontWeight: 600 }}>{parts[0]}</span>
                {parts[1] && <span style={{ color: 'var(--sub)', marginLeft: 4, fontSize: 12 }}>{parts[1]}</span>}
            </>
        );
    };

    return (
        <div ref={wrapperRef} style={{ position: 'relative' }}>
            <input
                type="text"
                value={query}
                onChange={e => {
                    setQuery(e.target.value);
                    onChange(''); // clear selection until a valid one is picked
                    setOpen(true);
                    setHighlightIdx(-1);
                }}
                onFocus={() => setOpen(true)}
                onKeyDown={handleKeyDown}
                placeholder="Type to search — e.g. Nashik"
                required={required}
                autoComplete="off"
            />
            {/* Hidden input to enforce HTML validation on the actual selected value */}
            <input type="hidden" value={value} required={required} />
            {open && filtered.length > 0 && (
                <ul
                    ref={listRef}
                    style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        maxHeight: 200,
                        overflowY: 'auto',
                        background: 'var(--card-bg, #fff)',
                        border: '1px solid var(--border, #e0e0e0)',
                        borderRadius: 10,
                        margin: 0,
                        padding: '4px 0',
                        listStyle: 'none',
                        zIndex: 100,
                        boxShadow: '0 8px 24px rgba(0,0,0,.12)',
                    }}
                >
                    {filtered.map((loc, i) => (
                        <li
                            key={loc}
                            onMouseDown={() => select(loc)}
                            onMouseEnter={() => setHighlightIdx(i)}
                            style={{
                                padding: '8px 14px',
                                cursor: 'pointer',
                                fontSize: 13,
                                background: i === highlightIdx ? 'var(--green-bg, #e8f5e9)' : 'transparent',
                                transition: 'background .15s',
                            }}
                        >
                            {renderLocation(loc)}
                        </li>
                    ))}
                </ul>
            )}
            {open && query && filtered.length === 0 && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    background: 'var(--card-bg, #fff)',
                    border: '1px solid var(--border, #e0e0e0)',
                    borderRadius: 10,
                    padding: '12px 14px',
                    fontSize: 13,
                    color: 'var(--sub)',
                    zIndex: 100,
                    boxShadow: '0 8px 24px rgba(0,0,0,.12)',
                }}>
                    No matching location found
                </div>
            )}
        </div>
    );
}
