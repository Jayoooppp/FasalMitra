const schemes = [
    {
        id: 'KCC',
        name: 'Kisan Credit Card',
        subtitle: 'Kisan Credit Card Scheme',
        category: 'Loan',
        beneficiaries: '7.3 Cr farmers',
        benefit: 'Up to ₹3 Lakh',
        eligible: true,
        details: {
            loanAmount: 'Up to ₹3 Lakh',
            interestRate: '4% per annum (after subsidy)',
            validity: '5 years, renewable',
            description: 'Provides short-term credit for crop cultivation, post-harvest expenses, and allied activities. Repay within the crop season.'
        }
    },
    {
        id: 'PMFBY',
        name: 'PM Fasal Bima Yojana',
        subtitle: 'Crop Insurance Scheme',
        category: 'Insurance',
        beneficiaries: '58 Lakh',
        benefit: '2% Premium Only',
        eligible: true,
        details: {
            description: 'Comprehensive crop insurance protecting against drought, flood, pest damage, and natural calamities. Government pays the major premium share.',
            enrollBy: 'Feb 28',
            premiumExample: '~₹1,850 → Coverage: up to ₹92,000 (for 2.5 acres Onion crop)'
        }
    },
    {
        id: 'SMAM',
        name: 'Sub-Mission on Agri Mechanization',
        subtitle: 'SMAM – Farm Equipment Subsidy',
        category: 'Equipment',
        beneficiaries: '45 Lakh',
        benefit: '40–50% Subsidy',
        eligible: true,
        details: {
            description: 'Subsidizes farm machinery and equipment to reduce cost of cultivation and increase farm productivity.',
            generalSubsidy: '40–50% for general farmers',
            smallMarginal: 'Up to 55% subsidy',
            coverage: 'Tractors, seed drills, sprayers, harvesters'
        }
    },
    {
        id: 'SHC',
        name: 'Soil Health Card Scheme',
        subtitle: 'Free soil testing & advisory',
        category: 'Training',
        beneficiaries: '23 Cr',
        benefit: 'Free Testing',
        eligible: true,
        details: {
            description: 'Free soil testing and personalized recommendations for soil nutrients and fertilizer use. Issued every 2 years.'
        }
    },
    {
        id: 'PMKSY',
        name: 'PM Krishi Sinchayee Yojana',
        subtitle: 'Drip & sprinkler irrigation subsidy',
        category: 'Subsidy',
        beneficiaries: '45 Lakh',
        benefit: '45–55% Subsidy',
        eligible: true,
        details: {
            description: 'Provides subsidy on drip and sprinkler irrigation systems to promote water-use efficiency and increase irrigated area.',
            dripSubsidy: '45% subsidy (55% small/marginal)',
            sprinklerSubsidy: '50% subsidy',
            savingsExample: 'For 2.5 acres drip: Save ~₹60,000 on installation'
        }
    },
    {
        id: 'PMKISAN',
        name: 'PM-KISAN Samman Nidhi',
        subtitle: 'Direct income support',
        category: 'Subsidy',
        beneficiaries: '12 Cr',
        benefit: '₹6,000/year',
        eligible: true,
        details: {
            description: 'Direct income support of ₹6,000/year in 3 equal installments of ₹2,000 each, directly to your bank account via DBT.',
            latestInstallment: '18th Installment: ₹2,000 credited Feb 24, 2025'
        }
    }
];

module.exports = schemes;
