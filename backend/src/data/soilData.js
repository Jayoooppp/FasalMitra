const soilData = {
    overallScore: 85,
    lastTested: 'Jan 20, 2025',
    status: 'Good Health',
    metrics: [
        { icon: '⚗️', label: 'pH Level', value: '6.8', status: 'Optimal', statusColor: 'green' },
        { icon: '💧', label: 'Moisture', value: '38%', status: 'Good', statusColor: 'green' },
        { icon: '🌿', label: 'Organic Carbon', value: '2.1%', status: 'Low', statusColor: 'amber' },
        { icon: '⚡', label: 'Nitrogen (N)', value: 'High', status: 'Good', statusColor: 'green' },
        { icon: '🔵', label: 'Phosphorus (P)', value: 'Medium', status: 'Monitor', statusColor: 'amber' },
        { icon: '🟡', label: 'Potassium (K)', value: 'Low', status: 'Deficient', statusColor: 'red' }
    ],
    alerts: [
        { type: 'red', icon: '⚠️', message: '<strong>Potassium Deficiency Detected:</strong> Apply MOP/SOP @ 60 kg/acre immediately. Potassium is critical for onion bulb development.' },
        { type: 'amber', icon: '💡', message: '<strong>Organic Carbon Low:</strong> Add vermicompost or FYM @ 5 tonnes/acre before next season to improve soil structure.' }
    ],
    fertilizerSchedule: [
        { name: 'Urea (46-0-0)', note: 'Next application: Feb 20', amount: '65 kg/acre', urgent: false },
        { name: 'MOP (Potash)', note: 'Apply immediately · Deficient', amount: '60 kg/acre', urgent: true },
        { name: 'Micronutrient Mix', note: 'Next season basal dose', amount: '25 kg/acre', urgent: false }
    ]
};

module.exports = soilData;
