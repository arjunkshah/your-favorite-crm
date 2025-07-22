const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const { randomUUID } = require('crypto');

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration
app.use(cors({
  origin: 'https://yourfavcrm.surge.sh',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// In-memory database
const db = {
  users: [
    {
      id: randomUUID(),
      email: 'demo@example.com',
      passwordHash: '$2a$10$demo.hash.for.testing.purposes.only'
    }
  ],
  sessions: {},
  customers: {},
  deals: {}
};

// Initialize sample data
if (!db.customers[db.users[0].id]) {
  db.customers[db.users[0].id] = [
    {
      id: randomUUID(),
      name: "Sarah Johnson",
      email: "sarah.johnson@example.com",
      phone: "+1 (555) 123-4567",
      company: "TechCorp Inc.",
      website: "techcorp.com",
      status: "active",
      value: 12000,
      lastContact: new Date().toISOString().split('T')[0],
      avatar: "/avatars/01.png"
    },
    {
      id: randomUUID(),
      name: "Michael Chen",
      email: "michael.chen@example.com",
      phone: "+1 (555) 234-5678",
      company: "Global Solutions",
      website: "globalsolutions.com",
      status: "pending",
      value: 8500,
      lastContact: new Date().toISOString().split('T')[0],
      avatar: "/avatars/02.png"
    }
  ];
}

// Helper functions
function findUserByEmail(email) {
  return db.users.find(u => u.email === email);
}

function findUserById(id) {
  return db.users.find(u => u.id === id);
}

function createSession(userId) {
  const token = randomUUID();
  db.sessions[token] = userId;
  return token;
}

function getUserIdFromSession(token) {
  return db.sessions[token];
}

function clearSession(token) {
  delete db.sessions[token];
}

// API Routes

// GET /api/me
app.get('/api/me', (req, res) => {
  const token = req.cookies?.session;
  const userId = getUserIdFromSession(token);
  
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const user = findUserById(userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json({
    id: user.id,
    email: user.email,
    name: user.email.split('@')[0],
    phone: '',
    company: '',
    role: 'User'
  });
});

// POST /api/login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = createSession(user.id);
    res.cookie('session', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/register
app.post('/api/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    const existingUser = findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }
    
    const passwordHash = await bcrypt.hash(password, 10);
    const user = {
      id: randomUUID(),
      email,
      passwordHash
    };
    db.users.push(user);
    
    const token = createSession(user.id);
    res.cookie('session', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/logout
app.post('/api/logout', (req, res) => {
  const token = req.cookies?.session;
  if (token) {
    clearSession(token);
  }
  
  res.clearCookie('session');
  res.json({ success: true });
});

// GET /api/customers
app.get('/api/customers', (req, res) => {
  const token = req.cookies?.session;
  const userId = getUserIdFromSession(token);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const customers = db.customers[userId] || [];
  res.json(customers);
});

// POST /api/customers
app.post('/api/customers', (req, res) => {
  const token = req.cookies?.session;
  const userId = getUserIdFromSession(token);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const data = req.body;
  const customers = db.customers[userId] || [];
  
  const newCustomer = {
    id: randomUUID(),
    name: data.name,
    email: data.email,
    phone: data.phone || '',
    company: data.company || '',
    website: data.website || '',
    status: data.status || 'pending',
    value: data.value || 0,
    lastContact: new Date().toISOString().split('T')[0],
    avatar: data.avatar || ''
  };
  
  customers.push(newCustomer);
  db.customers[userId] = customers;
  
  res.json(newCustomer);
});

// GET /api/deals
app.get('/api/deals', (req, res) => {
  const token = req.cookies?.session;
  const userId = getUserIdFromSession(token);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const deals = db.deals[userId] || [];
  res.json(deals);
});

// POST /api/deals
app.post('/api/deals', (req, res) => {
  const token = req.cookies?.session;
  const userId = getUserIdFromSession(token);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const data = req.body;
  const deals = db.deals[userId] || [];
  
  const newDeal = {
    id: Date.now().toString(),
    title: data.title,
    description: data.description || '',
    value: data.value || 0,
    status: data.status || 'prospecting',
    priority: data.priority || 'medium',
    customerId: data.customerId || '',
    customerName: data.customerName || '',
    customerCompany: data.customerCompany || '',
    expectedCloseDate: data.expectedCloseDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    assignedTo: userId,
    source: data.source || 'website',
    tags: data.tags || []
  };
  
  deals.push(newDeal);
  db.deals[userId] = deals;
  
  res.json(newDeal);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 CRM Backend Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`🌐 API Base: http://localhost:${PORT}/api`);
}); 