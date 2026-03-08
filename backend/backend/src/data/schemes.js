const schemes = [
    {
        id: 'AIF',
        name: 'Agriculture Infrastructure Fund',
        subtitle: 'Infrastructure financing for post-harvest management & community farming',
        category: 'Infrastructure',
        beneficiaries: '3.2 Cr+',
        benefit: '₹1 Lakh Cr Fund',
        eligible: true,
        pdfUrl: 'https://agriwelfare.gov.in/Documents/AIF_Guidelines_English_12Jun24.pdf',
        schemeUrl: 'http://agriinfra.dac.gov.in/',
        govPageUrl: 'https://agriwelfare.gov.in/en/Major',
        details: {
            description: 'A medium-long term debt financing facility for post-harvest management infrastructure and community farming assets through interest subvention and financial support. Provides 3% interest subvention on loans up to ₹2 Cr with credit guarantee support.',
        }
    },
    {
        id: 'PMKISAN',
        name: 'PM-KISAN Samman Nidhi',
        subtitle: 'Direct income support of ₹6,000/year to farmer families',
        category: 'Income Support',
        beneficiaries: '12 Cr+',
        benefit: '₹6,000/year',
        eligible: true,
        schemeUrl: 'https://pmkisan.gov.in/',
        govPageUrl: 'https://agriwelfare.gov.in/en/Major',
        details: {
            description: 'Direct income support of ₹6,000 per year in three equal installments of ₹2,000 each, directly to the bank accounts of eligible farmer families via Direct Benefit Transfer (DBT). Covers all landholding farmer families across India.',
        }
    },
    {
        id: 'ATMA',
        name: 'ATMA – Agricultural Technology Management Agency',
        subtitle: 'Extension reforms & farmer training through state agencies',
        category: 'Training',
        beneficiaries: '45 Lakh+',
        benefit: 'Free Training',
        eligible: true,
        pdfUrl: 'https://agriwelfare.gov.in/Documents/Revised_guidelinesATMA_2025.pdf',
        schemeUrl: 'https://extensionreforms.da.gov.in/DashBoard_Statusatma.aspx',
        govPageUrl: 'https://agriwelfare.gov.in/en/Major',
        details: {
            description: 'Supports agricultural extension services through a decentralized farmer-centric approach. Provides training, demonstrations, exposure visits, and technology transfer at block/district level through ATMA framework.',
        }
    },
    {
        id: 'AGMARKNET',
        name: 'AGMARKNET – Agricultural Marketing Information Network',
        subtitle: 'Real-time market prices and arrival data from mandis across India',
        category: 'Market',
        beneficiaries: '7,000+ Mandis',
        benefit: 'Live Prices',
        eligible: true,
        pdfUrl: 'https://agriwelfare.gov.in/Documents/Agmarknet_Guidelines.pdf',
        schemeUrl: 'http://agmarknet.gov.in/PriceAndArrivals/arrivals1.aspx',
        govPageUrl: 'https://agriwelfare.gov.in/en/Major',
        details: {
            description: 'A portal providing real-time commodity prices & arrivals data from 7,000+ wholesale markets (mandis) across India. Helps farmers make informed decisions on where and when to sell their produce for maximum profit.',
        }
    },
    {
        id: 'MIDH',
        name: 'MIDH – Mission for Integrated Development of Horticulture',
        subtitle: 'Subsidy for horticulture crops, nurseries & protected cultivation',
        category: 'Subsidy',
        beneficiaries: '50 Lakh+',
        benefit: '40–85% Subsidy',
        eligible: true,
        pdfUrl: 'https://agriwelfare.gov.in/Documents/midh_Guidelines.pdf',
        schemeUrl: 'http://midh.gov.in/nhmapplication/feedback/midhKPI.aspx',
        govPageUrl: 'https://agriwelfare.gov.in/en/Major',
        details: {
            description: 'Promotes holistic growth of horticulture including fruits, vegetables, mushroom, spices, flowers, aromatic plants, coconut, cashew, and bamboo. Provides subsidies of 40–85% for nurseries, tissue culture, greenhouses, and protected cultivation.',
        }
    },
    {
        id: 'PEST_REG',
        name: 'Pesticides Registration & Management',
        subtitle: 'Regulation and registration of pesticides in India',
        category: 'Regulation',
        beneficiaries: 'All Farmers',
        benefit: 'Safe Pesticides',
        eligible: true,
        pdfUrl: 'https://agriwelfare.gov.in/Documents/Pesticides_Registration.pdf',
        govPageUrl: 'https://agriwelfare.gov.in/en/Major',
        details: {
            description: 'Ensures quality and safety of pesticides through registration, monitoring, and regulation. Provides guidelines for registered pesticides that are safe for use in Indian agriculture.',
        }
    },
    {
        id: 'QUARANTINE',
        name: 'Plant Quarantine & Biosecurity',
        subtitle: 'Protection from exotic pests and diseases through import/export regulation',
        category: 'Regulation',
        beneficiaries: 'All Farmers',
        benefit: 'Crop Protection',
        eligible: true,
        pdfUrl: 'https://agriwelfare.gov.in/Documents/Quarantine_Guidelinespdf.pdf',
        schemeUrl: 'https://pqms.cgg.gov.in/pqms-angular/home',
        govPageUrl: 'https://agriwelfare.gov.in/en/Major',
        details: {
            description: 'Regulates import and export of plants and plant products to prevent introduction of exotic pests and diseases into India. Covers phytosanitary certification, fumigation, and quarantine processing.',
        }
    },
    {
        id: 'DBT_AGRI',
        name: 'DBT in Agriculture',
        subtitle: 'Direct Benefit Transfer for subsidy disbursement to farmers',
        category: 'Subsidy',
        beneficiaries: '10 Cr+',
        benefit: 'Direct Transfer',
        eligible: true,
        pdfUrl: 'https://agriwelfare.gov.in/Documents/Guideline_DBTinAgriculture.pdf',
        schemeUrl: 'https://www.dbtdacfw.gov.in/',
        govPageUrl: 'https://agriwelfare.gov.in/en/Major',
        details: {
            description: 'Ensures transparent and efficient delivery of government subsidies directly to farmer bank accounts using Aadhaar-based Direct Benefit Transfer. Covers fertilizer subsidy, seed subsidy, and other agricultural inputs.',
        }
    },
    {
        id: 'PMKSY',
        name: 'PM Krishi Sinchayee Yojana (PMKSY)',
        subtitle: 'Drip & sprinkler irrigation subsidy for water-use efficiency',
        category: 'Irrigation',
        beneficiaries: '45 Lakh+',
        benefit: '45–55% Subsidy',
        eligible: true,
        pdfUrl: 'https://agriwelfare.gov.in/Documents/Guidelines_PMKSY.pdf',
        schemeUrl: 'https://pmksy.gov.in/mis/frmDashboard.aspx',
        govPageUrl: 'https://agriwelfare.gov.in/en/Major',
        details: {
            description: 'Provides subsidy on micro-irrigation systems (drip and sprinkler) to promote "Per Drop More Crop". 45% subsidy for general, 55% for small/marginal farmers. Aims to expand irrigated area, improve water-use efficiency, and promote sustainable farming.',
        }
    },
    {
        id: 'KCC',
        name: 'Kisan Credit Card (KCC)',
        subtitle: 'Short-term credit for crop cultivation and allied activities',
        category: 'Loan',
        beneficiaries: '7.3 Cr+',
        benefit: 'Up to ₹3 Lakh',
        eligible: true,
        schemeUrl: 'https://mkisan.gov.in/Home/KCCDashboard',
        govPageUrl: 'https://agriwelfare.gov.in/en/Major',
        details: {
            description: 'Provides short-term credit at 4% interest (after government subvention) for crop cultivation, post-harvest expenses, and consumption needs. Loan up to ₹3 Lakh with 5-year validity and renewal facility. Also covers fisheries and animal husbandry.',
        }
    },
    {
        id: 'MKISAN',
        name: 'm-Kisan Portal',
        subtitle: 'Mobile-based advisory services and information dissemination',
        category: 'Advisory',
        beneficiaries: '10 Cr+',
        benefit: 'Free Advisories',
        eligible: true,
        schemeUrl: 'https://mkisan.gov.in/',
        govPageUrl: 'https://agriwelfare.gov.in/en/Major',
        details: {
            description: 'A mobile-based platform where farmers receive crop-specific advisories, weather alerts, and market information via SMS in their local language. Scientists and experts can send targeted messages based on region, crop, and season.',
        }
    },
    {
        id: 'JAIVIK',
        name: 'Jaivik Kheti – Organic Farming',
        subtitle: 'Promotion of organic farming through PGS certification & marketing',
        category: 'Organic',
        beneficiaries: '30 Lakh+',
        benefit: 'Up to ₹50,000/ha',
        eligible: true,
        pdfUrl: 'https://agriwelfare.gov.in/Documents/Jaivik_Kheti_Guidelines.pdf',
        schemeUrl: 'https://pgsindia-ncof.gov.in/home.aspx',
        govPageUrl: 'https://agriwelfare.gov.in/en/Major',
        details: {
            description: 'Promotes organic farming through Participatory Guarantee System (PGS) certification. Provides financial support of ₹50,000/ha over 3 years for cluster formation, training, certification, and marketing support for organic produce.',
        }
    },
    {
        id: 'ENAM',
        name: 'e-NAM – National Agriculture Market',
        subtitle: 'Online trading platform connecting APMC mandis across India',
        category: 'Market',
        beneficiaries: '1.7 Cr+',
        benefit: 'Better Prices',
        eligible: true,
        pdfUrl: 'https://agriwelfare.gov.in/Documents/Enamguidelines.pdf',
        schemeUrl: 'https://enam.gov.in/',
        govPageUrl: 'https://agriwelfare.gov.in/en/Major',
        details: {
            description: 'A pan-India electronic trading portal connecting 1,000+ APMC mandis for transparent and competitive price discovery. Enables online bidding, e-payment, and reduces intermediaries to ensure better prices for farmers.',
        }
    },
    {
        id: 'SHC',
        name: 'Soil Health Card Scheme',
        subtitle: 'Free soil testing and nutrient-based fertilizer recommendations',
        category: 'Advisory',
        beneficiaries: '23 Cr+',
        benefit: 'Free Testing',
        eligible: true,
        pdfUrl: 'https://agriwelfare.gov.in/Documents/Guidelines_Soil%20Health%20Card.pdf',
        schemeUrl: 'https://soilhealth.dac.gov.in/',
        govPageUrl: 'https://agriwelfare.gov.in/en/Major',
        details: {
            description: 'Provides free soil testing and personalized Soil Health Cards to every farmer every 2 years. Contains crop-wise fertilizer recommendations based on 12 soil parameters including pH, nitrogen, phosphorus, potassium, and micronutrients.',
        }
    },
    {
        id: 'PMFBY',
        name: 'PM Fasal Bima Yojana (PMFBY)',
        subtitle: 'Comprehensive crop insurance against natural calamities & pests',
        category: 'Insurance',
        beneficiaries: '58 Lakh+',
        benefit: '1.5–5% Premium',
        eligible: true,
        pdfUrl: 'https://agriwelfare.gov.in/Documents/PMFBY_Guidelines.pdf',
        schemeUrl: 'https://pmfby.gov.in/ext/rpt/ssfr_17',
        govPageUrl: 'https://agriwelfare.gov.in/en/Major',
        details: {
            description: 'Comprehensive crop insurance scheme protecting farmers against crop loss from drought, flood, hailstorm, pest attack, and other natural calamities. Farmer pays only 1.5% premium for Rabi, 2% for Kharif, and 5% for commercial crops. Government bears the remaining premium.',
        }
    }
];

module.exports = schemes;
