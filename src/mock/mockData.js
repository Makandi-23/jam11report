export const users = [
  { 
    id: 1, 
    name: "Amina Ndovu", 
    email: "amina@example.com", 
    password: "pass123", 
    role: "resident", 
    ward: "Lindi",
    phone: "0712345678",
    avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
  },
  { 
    id: 2, 
    name: "John Mwangi", 
    email: "john@example.com", 
    password: "pass123", 
    role: "resident", 
    ward: "Makina",
    phone: "0723456789",
    avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
  },
  { 
    id: 3, 
    name: "Admin One", 
    email: "admin@example.com", 
    password: "admin123", 
    role: "admin",
    ward: "All",
    phone: "0734567890",
    avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
  }
];

export const reports = [
  { 
    id: 1, 
    title: "Open drain on main road causing flooding", 
    description: "There's a large open drain on the main road that fills with water during rain, making it dangerous for pedestrians and vehicles.",
    category: "environment", 
    ward: "Lindi", 
    status: "pending", 
    votes: 23, 
    createdAt: "2025-01-15T10:00:00Z",
    userId: 1,
    photos: ["https://images.pexels.com/photos/2480807/pexels-photo-2480807.jpeg?auto=compress&cs=tinysrgb&w=800"],
    location: { lat: -1.2921, lng: 36.8219 }
  },
  { 
    id: 2, 
    title: "Street fights near market disrupting business", 
    description: "Regular fights break out near the central market, especially in the evenings, making it unsafe for vendors and customers.",
    category: "security", 
    ward: "Makina", 
    status: "in-progress", 
    votes: 42, 
    createdAt: "2025-01-12T15:40:00Z",
    userId: 2,
    photos: ["https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=800"],
    location: { lat: -1.2985, lng: 36.8078 }
  },
  { 
    id: 3, 
    title: "Broken streetlights on residential street", 
    description: "Multiple streetlights have been broken for weeks, making the area very dark and unsafe at night.",
    category: "security", 
    ward: "Laini Saba", 
    status: "resolved", 
    votes: 18, 
    createdAt: "2025-01-10T09:20:00Z",
    userId: 1,
    photos: [],
    location: { lat: -1.2876, lng: 36.8156 }
  },
  { 
    id: 4, 
    title: "Garbage collection not happening regularly", 
    description: "Garbage has not been collected for over two weeks in our area, creating health hazards and bad smells.",
    category: "environment", 
    ward: "Woodley", 
    status: "pending", 
    votes: 31, 
    createdAt: "2025-01-08T14:15:00Z",
    userId: 2,
    photos: ["https://images.pexels.com/photos/2827392/pexels-photo-2827392.jpeg?auto=compress&cs=tinysrgb&w=800"],
    location: { lat: -1.2743, lng: 36.8034 }
  },
  { 
    id: 5, 
    title: "Water shortage affecting entire neighborhood", 
    description: "We haven't had running water for 5 days now. Many families are struggling to get clean water for daily needs.",
    category: "health", 
    ward: "Sarang'ombe", 
    status: "in-progress", 
    votes: 67, 
    createdAt: "2025-01-05T11:30:00Z",
    userId: 1,
    photos: [],
    location: { lat: -1.3021, lng: 36.8234 }
  }
];

export const wards = [
  "Lindi",
  "Laini Saba", 
  "Makina",
  "Woodley/Kenyatta Golf Course",
  "Sarang'ombe"
];

export const categories = [
  { id: "security", name: "Security", icon: "🛡️", color: "text-red-600" },
  { id: "environment", name: "Environment", icon: "🌱", color: "text-green-600" },
  { id: "health", name: "Health", icon: "🏥", color: "text-blue-600" },
  { id: "other", name: "Other", icon: "📋", color: "text-gray-600" }
];