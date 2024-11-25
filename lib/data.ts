import { Property } from "./types";

const baseDocuments = [
  {
    id: "doc1",
    name: "Property Insurance Policy",
    type: "PDF",
    size: "2.4 MB",
    uploadedAt: "2024-01-15",
    startDate: "2024-01-15",
    endDate: "2025-01-15",
    category: "insurance"
  },
  {
    id: "doc2",
    name: "Unit A Lease Agreement",
    type: "PDF",
    size: "1.8 MB",
    uploadedAt: "2024-02-01",
    startDate: "2024-02-01",
    endDate: "2024-03-25",
    category: "lease"
  }
];

const baseEvents = [
  {
    id: "evt1",
    type: "weather",
    severity: "high",
    date: "2024-03-15",
    description: "Severe hailstorm caused minor roof damage"
  },
  {
    id: "evt2",
    type: "weather",
    severity: "medium",
    date: "2024-02-20",
    description: "Heavy snowfall - 12 inches accumulated"
  }
];

const baseHistory = [
  {
    id: "hist1",
    date: "2023-12-01",
    type: "purchase",
    description: "Property acquisition completed",
    amount: 200000,
    status: "completed"
  },
  {
    id: "hist2",
    date: "2024-01-15",
    type: "renovation",
    description: "Kitchen remodeling",
    amount: 25000,
    status: "completed"
  }
];

export const properties: Property[] = [
  {
    id: 1,
    address: "3806 Sweetbriar Ln",
    location: "Lincoln, NE 68516",
    units: 2,
    occupancy: "100%",
    acquisitionPrice: 200000,
    marketValue: 300800,
    loanBalance: 130788,
    equity: 170012,
    type: "house",
    lastRoofingAssessment: "2024-01-15",
    insuranceExpiresIn: 280,
    coordinates: { lat: 40.716590, lng: -96.617990 },
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994",
    documents: baseDocuments,
    events: baseEvents,
    history: baseHistory
  },
  {
    id: 2,
    address: "742 Evergreen Terrace",
    location: "Springfield, IL 62701",
    units: 1,
    occupancy: "100%",
    acquisitionPrice: 185000,
    marketValue: 245000,
    loanBalance: 120000,
    equity: 125000,
    type: "house",
    lastRoofingAssessment: "2023-11-20",
    insuranceExpiresIn: 45,
    coordinates: { lat: 39.7817, lng: -89.6501 },
    image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233",
    documents: baseDocuments,
    events: baseEvents,
    history: baseHistory
  },
  {
    id: 3,
    address: "221B Baker Street",
    location: "Boston, MA 02108",
    units: 4,
    occupancy: "75%",
    acquisitionPrice: 450000,
    marketValue: 580000,
    loanBalance: 300000,
    equity: 280000,
    type: "apartment",
    lastRoofingAssessment: "2024-02-01",
    insuranceExpiresIn: 12,
    coordinates: { lat: 42.3601, lng: -71.0589 },
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00",
    documents: baseDocuments,
    events: baseEvents,
    history: baseHistory
  },
  {
    id: 4,
    address: "17 Cherry Tree Lane",
    location: "Portland, OR 97201",
    units: 3,
    occupancy: "100%",
    acquisitionPrice: 380000,
    marketValue: 450000,
    loanBalance: 250000,
    equity: 200000,
    type: "apartment",
    lastRoofingAssessment: "2024-01-05",
    insuranceExpiresIn: 180,
    coordinates: { lat: 45.5155, lng: -122.6789 },
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
    documents: baseDocuments,
    events: baseEvents,
    history: baseHistory
  },
  {
    id: 5,
    address: "4 Privet Drive",
    location: "Seattle, WA 98101",
    units: 1,
    occupancy: "100%",
    acquisitionPrice: 420000,
    marketValue: 550000,
    loanBalance: 280000,
    equity: 270000,
    type: "house",
    lastRoofingAssessment: "2023-12-15",
    insuranceExpiresIn: 90,
    coordinates: { lat: 47.6062, lng: -122.3321 },
    image: "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83",
    documents: baseDocuments,
    events: baseEvents,
    history: baseHistory
  },
  {
    id: 6,
    address: "31 Spooner Street",
    location: "Austin, TX 78701",
    units: 2,
    occupancy: "100%",
    acquisitionPrice: 310000,
    marketValue: 380000,
    loanBalance: 200000,
    equity: 180000,
    type: "house",
    lastRoofingAssessment: "2024-02-10",
    insuranceExpiresIn: 150,
    coordinates: { lat: 30.2672, lng: -97.7431 },
    image: "https://images.unsplash.com/photo-1592595896616-c37162298647",
    documents: baseDocuments,
    events: baseEvents,
    history: baseHistory
  },
  {
    id: 7,
    address: "124 Conch Street",
    location: "Miami, FL 33101",
    units: 6,
    occupancy: "83%",
    acquisitionPrice: 680000,
    marketValue: 820000,
    loanBalance: 450000,
    equity: 370000,
    type: "apartment",
    lastRoofingAssessment: "2024-01-20",
    insuranceExpiresIn: 220,
    coordinates: { lat: 25.7617, lng: -80.1918 },
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914",
    documents: baseDocuments,
    events: baseEvents,
    history: baseHistory
  },
  {
    id: 8,
    address: "742 Evergreen Terrace",
    location: "Denver, CO 80202",
    units: 1,
    occupancy: "100%",
    acquisitionPrice: 290000,
    marketValue: 350000,
    loanBalance: 180000,
    equity: 170000,
    type: "house",
    lastRoofingAssessment: "2023-11-30",
    insuranceExpiresIn: 30,
    coordinates: { lat: 39.7392, lng: -104.9903 },
    image: "https://images.unsplash.com/photo-1576941089067-2de3c901e126",
    documents: baseDocuments,
    events: baseEvents,
    history: baseHistory
  },
  {
    id: 9,
    address: "15 Yemen Road",
    location: "Chicago, IL 60601",
    units: 8,
    occupancy: "88%",
    acquisitionPrice: 890000,
    marketValue: 1100000,
    loanBalance: 600000,
    equity: 500000,
    type: "apartment",
    lastRoofingAssessment: "2024-02-15",
    insuranceExpiresIn: 300,
    coordinates: { lat: 41.8781, lng: -87.6298 },
    image: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e",
    documents: baseDocuments,
    events: baseEvents,
    history: baseHistory
  },
  {
    id: 10,
    address: "320 Maple Drive",
    location: "Nashville, TN 37201",
    units: 2,
    occupancy: "100%",
    acquisitionPrice: 340000,
    marketValue: 420000,
    loanBalance: 220000,
    equity: 200000,
    type: "house",
    lastRoofingAssessment: "2024-01-10",
    insuranceExpiresIn: 160,
    coordinates: { lat: 36.1627, lng: -86.7816 },
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9",
    documents: baseDocuments,
    events: baseEvents,
    history: baseHistory
  },
  {
    id: 11,
    address: "52 Festive Road",
    location: "San Diego, CA 92101",
    units: 4,
    occupancy: "100%",
    acquisitionPrice: 620000,
    marketValue: 780000,
    loanBalance: 400000,
    equity: 380000,
    type: "apartment",
    lastRoofingAssessment: "2024-02-05",
    insuranceExpiresIn: 240,
    coordinates: { lat: 32.7157, lng: -117.1611 },
    image: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6",
    documents: baseDocuments,
    events: baseEvents,
    history: baseHistory
  },
  {
    id: 12,
    address: "711 Maple Street",
    location: "Phoenix, AZ 85001",
    units: 1,
    occupancy: "100%",
    acquisitionPrice: 280000,
    marketValue: 340000,
    loanBalance: 180000,
    equity: 160000,
    type: "house",
    lastRoofingAssessment: "2023-12-20",
    insuranceExpiresIn: 120,
    coordinates: { lat: 33.4484, lng: -112.0740 },
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    documents: baseDocuments,
    events: baseEvents,
    history: baseHistory
  },
  {
    id: 13,
    address: "23 Railway Cuttings",
    location: "Las Vegas, NV 89101",
    units: 6,
    occupancy: "83%",
    acquisitionPrice: 720000,
    marketValue: 850000,
    loanBalance: 480000,
    equity: 370000,
    type: "apartment",
    lastRoofingAssessment: "2024-01-25",
    insuranceExpiresIn: 200,
    coordinates: { lat: 36.1699, lng: -115.1398 },
    image: "https://images.unsplash.com/photo-1628624747186-a941c476b7ef",
    documents: baseDocuments,
    events: baseEvents,
    history: baseHistory
  },
  {
    id: 14,
    address: "62 West Wallaby Street",
    location: "Salt Lake City, UT 84101",
    units: 2,
    occupancy: "100%",
    acquisitionPrice: 350000,
    marketValue: 420000,
    loanBalance: 230000,
    equity: 190000,
    type: "house",
    lastRoofingAssessment: "2024-02-20",
    insuranceExpiresIn: 270,
    coordinates: { lat: 40.7608, lng: -111.8910 },
    image: "https://images.unsplash.com/photo-1625602812206-5ec545ca1231",
    documents: baseDocuments,
    events: baseEvents,
    history: baseHistory
  },
  {
    id: 15,
    address: "29 Acacia Road",
    location: "Atlanta, GA 30301",
    units: 4,
    occupancy: "75%",
    acquisitionPrice: 480000,
    marketValue: 580000,
    loanBalance: 320000,
    equity: 260000,
    type: "apartment",
    lastRoofingAssessment: "2024-01-30",
    insuranceExpiresIn: 15,
    coordinates: { lat: 33.7490, lng: -84.3880 },
    image: "https://images.unsplash.com/photo-1626178793926-22b28830aa30",
    documents: baseDocuments,
    events: baseEvents,
    history: baseHistory
  },
  {
    id: 16,
    address: "7 Savile Row",
    location: "Houston, TX 77001",
    units: 3,
    occupancy: "100%",
    acquisitionPrice: 410000,
    marketValue: 490000,
    loanBalance: 270000,
    equity: 220000,
    type: "apartment",
    lastRoofingAssessment: "2024-02-25",
    insuranceExpiresIn: 330,
    coordinates: { lat: 29.7604, lng: -95.3698 },
    image: "https://images.unsplash.com/photo-1633505899118-4ca6bd143043",
    documents: baseDocuments,
    events: baseEvents,
    history: baseHistory
  }
];