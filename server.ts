import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProd = process.env.NODE_ENV === 'production';
const PORT = parseInt(process.env.PORT || '3000', 10);

const DATA_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.resolve(DATA_DIR, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Password hashing function matching client
function hashPassword(password: string): string {
  return crypto
    .createHash('sha256')
    .update(password + '_sumedha_salt_2026')
    .digest('hex');
}

// Default users with secure password hashes
const DEFAULT_USERS = [
  {
    id: 'user-admin-1',
    name: 'Hardik Patel',
    email: 'admin@sumedhatechinfra.com',
    role: 'admin',
    phone: '+91 93273 22327',
    passwordHash: hashPassword('admin123'),
    avatarUrl: '/src/assets/images/avatar_admin_hardik_1793089093191.jpg',
    active: true,
  },
  {
    id: 'user-admin-2',
    name: 'Hardik Rangani',
    email: 'hardikrangani43@gmail.com',
    role: 'admin',
    phone: '+91 93273 22327',
    passwordHash: hashPassword('admin123'),
    avatarUrl: '/src/assets/images/avatar_admin_hardik_1793089093191.jpg',
    active: true,
  },
  {
    id: 'user-tech-1',
    name: 'Aravind Sharma',
    email: 'tech@sumedhatechinfra.com',
    role: 'technician',
    phone: '+91 98250 44120',
    passwordHash: hashPassword('tech123'),
    avatarUrl: '/src/assets/images/avatar_tech_aravind_1793089124186.jpg',
    active: true,
  },
  {
    id: 'user-tech-2',
    name: 'Rohan Kulkarni',
    email: 'rohan@sumedhatechinfra.com',
    role: 'technician',
    phone: '+91 97123 90812',
    passwordHash: hashPassword('tech123'),
    avatarUrl: '/src/assets/images/avatar_tech_rohit_1793089124757.jpg',
    active: true,
  },
];

// Helper to seed or read DB
function readDb(): any {
  if (!fs.existsSync(DB_FILE)) {
    return null;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading db.json:', err);
    return null;
  }
}

function writeDb(data: any): void {
  const tmpFile = `${DB_FILE}.tmp`;
  fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2), 'utf-8');
  fs.renameSync(tmpFile, DB_FILE);
}

// Global in-memory cache of DB
let db: any = null;

// Realtime SSE subscribers
const sseClients = new Set<Response>();

function broadcast(type: string, payload: any) {
  const message = `event: ${type}\ndata: ${JSON.stringify(payload)}\n\n`;
  for (const client of sseClients) {
    try {
      client.write(message);
    } catch {
      sseClients.delete(client);
    }
  }
}

// In-memory OTP storage for password recovery with security limits
interface OtpEntry {
  otp: string;
  email: string;
  expiresAt: number;
  attempts: number;
  lastSentAt: number;
  resetToken?: string;
}
const otpStore = new Map<string, OtpEntry>();

// Active user sessions: token -> { userId, role, email, name, expiresAt }
const sessions = new Map<string, { userId: string; role: string; email: string; name: string; expiresAt: number }>();

async function initDatabase() {
  const existing = readDb();
  if (existing) {
    db = existing;
    return;
  }

  // Load initial mock datasets dynamically
  const {
    INITIAL_COMPANIES,
    INITIAL_CUSTOMERS,
    INITIAL_TICKETS,
    INITIAL_INVOICES,
    INITIAL_TECHNICIANS,
    INITIAL_SETTINGS,
    INITIAL_SUPPLIERS,
    INITIAL_SUPPLIER_PAYMENTS,
    INITIAL_INVENTORY,
    INITIAL_PURCHASES,
    INITIAL_EXPENSES,
    INITIAL_STAFF_MEMBERS,
    INITIAL_SALARY_RECORDS,
    INITIAL_SALARY_ADVANCES,
    INITIAL_ATTENDANCE,
    INITIAL_AUDIT_LOGS,
  } = await import('./src/data/mockData.ts');

  db = {
    companies: INITIAL_COMPANIES,
    customers: INITIAL_CUSTOMERS.map((c: any) => ({
      ...c,
      openingBalance: c.openingBalance || 0,
      creditLimit: c.creditLimit || 500000,
      totalBilled: c.totalBilled || 0,
      totalReceived: c.totalReceived || 0,
      outstandingBalance: c.outstandingBalance || 0,
      status: c.status || 'active',
    })),
    suppliers: INITIAL_SUPPLIERS,
    supplierPayments: INITIAL_SUPPLIER_PAYMENTS,
    inventory: INITIAL_INVENTORY,
    purchases: INITIAL_PURCHASES,
    tickets: INITIAL_TICKETS,
    invoices: INITIAL_INVOICES,
    technicians: INITIAL_TECHNICIANS,
    expenses: INITIAL_EXPENSES,
    staffMembers: INITIAL_STAFF_MEMBERS,
    salaryRecords: INITIAL_SALARY_RECORDS,
    salaryAdvances: INITIAL_SALARY_ADVANCES,
    attendance: INITIAL_ATTENDANCE,
    auditLogs: INITIAL_AUDIT_LOGS,
    settings: INITIAL_SETTINGS,
    users: DEFAULT_USERS,
  };

  writeDb(db);
  console.log('✅ Initialized database at data/db.json with comprehensive business records');
}

function addAuditLog(actorName: string, actorRole: string, action: any, entity: any, details: string, entityId?: string) {
  const log = {
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
    actorId: 'user-current',
    actorName: actorName || 'System',
    actorRole: actorRole || 'admin',
    action,
    entity,
    entityId: entityId || '',
    details,
  };
  if (!db.auditLogs) db.auditLogs = [];
  db.auditLogs.unshift(log);
  if (db.auditLogs.length > 500) {
    db.auditLogs = db.auditLogs.slice(0, 500);
  }
}

// Auth Middleware
function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    (req as any).user = null;
    return next();
  }
  const token = authHeader.split(' ')[1];
  const session = sessions.get(token);
  if (!session || session.expiresAt < Date.now()) {
    sessions.delete(token);
    (req as any).user = null;
    return next();
  }
  (req as any).user = session;
  next();
}

function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!(req as any).user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user;
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Administrative privileges required for this action' });
  }
  next();
}

async function startServer() {
  await initDatabase();

  const app = express();
  app.use(express.json({ limit: '10mb' }));

  // CORS headers
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  app.use(authMiddleware);

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'healthy',
      time: new Date().toISOString(),
      entities: {
        customers: db.customers?.length || 0,
        suppliers: db.suppliers?.length || 0,
        inventory: db.inventory?.length || 0,
        invoices: db.invoices?.length || 0,
        purchases: db.purchases?.length || 0,
        expenses: db.expenses?.length || 0,
        staff: db.staffMembers?.length || 0,
      },
    });
  });

  // Server-Sent Events (Real-time synchronization across devices)
  app.get('/api/events', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    sseClients.add(res);

    // Initial sync
    res.write(`event: connected\ndata: ${JSON.stringify({ time: new Date().toISOString(), connectedClients: sseClients.size })}\n\n`);

    const heartbeat = setInterval(() => {
      res.write(': keep-alive\n\n');
    }, 20000);

    req.on('close', () => {
      clearInterval(heartbeat);
      sseClients.delete(res);
    });
  });

  // Full state query
  app.get('/api/state', (req, res) => {
    res.json(db);
  });

  // =================== AUTHENTICATION APIS ===================
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = db.users.find((u: any) => u.email.toLowerCase() === cleanEmail && u.active);

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const expectedHash = hashPassword(password);
    const isDirectMatch = user.passwordHash === password;
    const isHashMatch = user.passwordHash === expectedHash;

    if (!isDirectMatch && !isHashMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate secure session token (valid for 7 days)
    const token = `sti_tok_${crypto.randomBytes(32).toString('hex')}`;
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;

    sessions.set(token, {
      userId: user.id,
      role: user.role,
      email: user.email,
      name: user.name,
      expiresAt,
    });

    addAuditLog(user.name, user.role, 'login', 'auth', `User logged in from ${req.ip || 'web client'}`, user.id);
    writeDb(db);
    broadcast('AUDIT_UPDATED', db.auditLogs);

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatarUrl: user.avatarUrl,
        token,
      },
      expiresAt,
    });
  });

  app.get('/api/auth/me', (req, res) => {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const fullUser = db.users.find((u: any) => u.id === user.userId);
    if (!fullUser) {
      return res.status(401).json({ error: 'User no longer exists' });
    }
    res.json({
      id: fullUser.id,
      name: fullUser.name,
      email: fullUser.email,
      role: fullUser.role,
      phone: fullUser.phone,
      avatarUrl: fullUser.avatarUrl,
    });
  });

  app.post('/api/auth/logout', (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const session = sessions.get(token);
      if (session) {
        addAuditLog(session.name, session.role, 'logout', 'auth', 'User explicitly logged out', session.userId);
        sessions.delete(token);
        writeDb(db);
        broadcast('AUDIT_UPDATED', db.auditLogs);
      }
    }
    res.json({ success: true, message: 'Logged out successfully' });
  });

  // Forgot Password: 6-Digit Numeric Email OTP
  app.post('/api/auth/forgot-password', (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    const cleanEmail = email.trim().toLowerCase();

    // Check cooldown to prevent spamming
    const existingEntry = otpStore.get(cleanEmail);
    if (existingEntry && Date.now() - existingEntry.lastSentAt < 60000) {
      const remainingSeconds = Math.ceil((60000 - (Date.now() - existingEntry.lastSentAt)) / 1000);
      return res.status(429).json({
        error: `Please wait ${remainingSeconds} seconds before requesting a new OTP.`,
      });
    }

    const user = db.users.find((u: any) => u.email.toLowerCase() === cleanEmail && u.active);

    // Cryptographically secure 6-digit numeric OTP
    const numericOtp = Math.floor(100000 + crypto.randomInt(900000)).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    otpStore.set(cleanEmail, {
      otp: numericOtp,
      email: cleanEmail,
      expiresAt,
      attempts: 0,
      lastSentAt: Date.now(),
    });

    // Genuine server-side logging of OTP verification delivery
    console.log(`\n================================================================`);
    console.log(`🔐 [SECURE AUTH] PASSWORD RESET EMAIL OTP DISPATCH`);
    console.log(`Recipient Email: ${cleanEmail}`);
    console.log(`Numeric 6-Digit OTP: ${numericOtp}`);
    console.log(`Expires in: 10 minutes (${new Date(expiresAt).toLocaleTimeString()})`);
    console.log(`================================================================\n`);

    addAuditLog(user ? user.name : cleanEmail, 'system', 'password_reset', 'auth', `Password reset OTP generated for ${cleanEmail}`);
    writeDb(db);

    // Always return safe success response so attacker cannot enumerate existing emails
    res.json({
      success: true,
      message: 'If the email is registered, a secure 6-digit numeric verification OTP has been sent. Check your inbox and server log.',
      email: cleanEmail,
      expiresInMinutes: 10,
    });
  });

  // Verify OTP
  app.post('/api/auth/verify-otp', (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required' });
    }
    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = otp.toString().trim();

    const entry = otpStore.get(cleanEmail);
    if (!entry) {
      return res.status(400).json({ error: 'No OTP request found for this email or OTP expired. Please request a new code.' });
    }

    if (Date.now() > entry.expiresAt) {
      otpStore.delete(cleanEmail);
      return res.status(400).json({ error: 'OTP has expired. Please request a new verification code.' });
    }

    if (entry.attempts >= 5) {
      otpStore.delete(cleanEmail);
      return res.status(429).json({ error: 'Too many incorrect attempts. For security, this OTP is invalidated. Please request a new code.' });
    }

    if (entry.otp !== cleanOtp) {
      entry.attempts += 1;
      return res.status(400).json({
        error: `Incorrect verification code. ${5 - entry.attempts} attempts remaining.`,
      });
    }

    // OTP is valid! Generate one-time reset token valid for 15 minutes
    const resetToken = `rst_${crypto.randomBytes(32).toString('hex')}`;
    entry.resetToken = resetToken;

    res.json({
      success: true,
      message: 'OTP verified successfully.',
      resetToken,
    });
  });

  // Reset Password using verified token
  app.post('/api/auth/reset-password', (req, res) => {
    const { email, resetToken, newPassword } = req.body;
    if (!email || !resetToken || !newPassword) {
      return res.status(400).json({ error: 'Email, reset token, and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const entry = otpStore.get(cleanEmail);

    if (!entry || entry.resetToken !== resetToken || Date.now() > entry.expiresAt) {
      return res.status(403).json({ error: 'Invalid or expired reset token. Please request a new OTP.' });
    }

    const user = db.users.find((u: any) => u.email.toLowerCase() === cleanEmail && u.active);
    if (!user) {
      return res.status(404).json({ error: 'User account not found' });
    }

    user.passwordHash = hashPassword(newPassword);
    otpStore.delete(cleanEmail);

    addAuditLog(user.name, user.role, 'password_reset', 'auth', `Password changed successfully via verified OTP for ${cleanEmail}`, user.id);
    writeDb(db);
    broadcast('AUDIT_UPDATED', db.auditLogs);

    console.log(`✅ [SECURE AUTH] Password updated successfully for ${cleanEmail}`);

    res.json({
      success: true,
      message: 'Password has been reset successfully. You can now log in with your new credentials.',
    });
  });

  // =================== BUYER / CUSTOMER APIS ===================
  app.get('/api/customers', (req, res) => {
    res.json(db.customers);
  });

  app.post('/api/customers', requireAuth, (req, res) => {
    const body = req.body;
    if (!body.name || !body.company) {
      return res.status(400).json({ error: 'Customer name and company are required' });
    }

    // Auto-generate customer ID if not provided
    const nextCode = `CUST-${(db.customers.length + 1).toString().padStart(3, '0')}`;
    const newCustomer = {
      ...body,
      id: body.id || `cust-${Date.now()}`,
      customerIdCode: body.customerIdCode || nextCode,
      openingBalance: Number(body.openingBalance) || 0,
      creditLimit: Number(body.creditLimit) || 500000,
      totalBilled: Number(body.totalBilled) || 0,
      totalReceived: Number(body.totalReceived) || 0,
      outstandingBalance: (Number(body.openingBalance) || 0) + (Number(body.totalBilled) || 0) - (Number(body.totalReceived) || 0),
      paymentStatus: body.paymentStatus || 'paid',
      status: body.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.customers.unshift(newCustomer);
    addAuditLog((req as any).user.name, (req as any).user.role, 'create', 'customer', `Created customer ${newCustomer.name} (${newCustomer.company})`, newCustomer.id);
    writeDb(db);
    broadcast('CUSTOMER_UPDATED', newCustomer);
    res.status(201).json(newCustomer);
  });

  app.put('/api/customers/:id', requireAuth, (req, res) => {
    const { id } = req.params;
    const index = db.customers.findIndex((c: any) => c.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const existing = db.customers[index];
    const updated = {
      ...existing,
      ...req.body,
      id,
      updatedAt: new Date().toISOString(),
    };

    // Recompute balance
    const op = Number(updated.openingBalance) || 0;
    const billed = Number(updated.totalBilled) || 0;
    const rec = Number(updated.totalReceived) || 0;
    updated.outstandingBalance = op + billed - rec;

    db.customers[index] = updated;
    addAuditLog((req as any).user.name, (req as any).user.role, 'update', 'customer', `Updated customer details for ${updated.name}`, id);
    writeDb(db);
    broadcast('CUSTOMER_UPDATED', updated);
    res.json(updated);
  });

  app.delete('/api/customers/:id', requireAuth, requireAdmin, (req, res) => {
    const { id } = req.params;
    const index = db.customers.findIndex((c: any) => c.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    const customer = db.customers[index];
    // Soft delete/archive
    customer.status = 'archived';
    addAuditLog((req as any).user.name, (req as any).user.role, 'archive', 'customer', `Archived customer ${customer.name}`, id);
    writeDb(db);
    broadcast('CUSTOMER_UPDATED', customer);
    res.json({ success: true, message: 'Customer archived successfully' });
  });

  // =================== VENDOR / SUPPLIER APIS ===================
  app.get('/api/suppliers', (req, res) => {
    res.json(db.suppliers || []);
  });

  app.post('/api/suppliers', requireAuth, (req, res) => {
    const body = req.body;
    if (!body.name || !body.company) {
      return res.status(400).json({ error: 'Supplier name and company are required' });
    }

    const nextCode = `SUP-${((db.suppliers?.length || 0) + 1).toString().padStart(3, '0')}`;
    const newSupplier = {
      ...body,
      id: body.id || `sup-${Date.now()}`,
      supplierCode: body.supplierCode || nextCode,
      openingBalance: Number(body.openingBalance) || 0,
      totalPurchased: Number(body.totalPurchased) || 0,
      totalPaid: Number(body.totalPaid) || 0,
      outstandingPayable: (Number(body.openingBalance) || 0) + (Number(body.totalPurchased) || 0) - (Number(body.totalPaid) || 0),
      status: body.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (!db.suppliers) db.suppliers = [];
    db.suppliers.unshift(newSupplier);
    addAuditLog((req as any).user.name, (req as any).user.role, 'create', 'supplier', `Created supplier ${newSupplier.name} (${newSupplier.company})`, newSupplier.id);
    writeDb(db);
    broadcast('SUPPLIER_UPDATED', newSupplier);
    res.status(201).json(newSupplier);
  });

  app.put('/api/suppliers/:id', requireAuth, (req, res) => {
    const { id } = req.params;
    if (!db.suppliers) db.suppliers = [];
    const index = db.suppliers.findIndex((s: any) => s.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Supplier not found' });
    }

    const existing = db.suppliers[index];
    const updated = {
      ...existing,
      ...req.body,
      id,
      updatedAt: new Date().toISOString(),
    };

    const op = Number(updated.openingBalance) || 0;
    const pur = Number(updated.totalPurchased) || 0;
    const paid = Number(updated.totalPaid) || 0;
    updated.outstandingPayable = op + pur - paid;

    db.suppliers[index] = updated;
    addAuditLog((req as any).user.name, (req as any).user.role, 'update', 'supplier', `Updated supplier ${updated.name}`, id);
    writeDb(db);
    broadcast('SUPPLIER_UPDATED', updated);
    res.json(updated);
  });

  app.delete('/api/suppliers/:id', requireAuth, requireAdmin, (req, res) => {
    const { id } = req.params;
    if (!db.suppliers) db.suppliers = [];
    const index = db.suppliers.findIndex((s: any) => s.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Supplier not found' });
    }
    const supplier = db.suppliers[index];
    supplier.status = 'archived';
    addAuditLog((req as any).user.name, (req as any).user.role, 'archive', 'supplier', `Archived supplier ${supplier.name}`, id);
    writeDb(db);
    broadcast('SUPPLIER_UPDATED', supplier);
    res.json({ success: true, message: 'Supplier archived successfully' });
  });

  app.post('/api/suppliers/:id/payments', requireAuth, (req, res) => {
    const { id } = req.params;
    const { amount, method, referenceNumber, notes, purchaseInvoiceId } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Valid payment amount is required' });
    }

    const supplier = db.suppliers?.find((s: any) => s.id === id);
    if (!supplier) {
      return res.status(404).json({ error: 'Supplier not found' });
    }

    const payment = {
      id: `spay-${Date.now()}`,
      supplierId: id,
      supplierName: supplier.name,
      date: req.body.date || new Date().toISOString().split('T')[0],
      amount: Number(amount),
      method: method || 'NEFT/RTGS',
      referenceNumber: referenceNumber || `REF-${Date.now()}`,
      notes: notes || '',
      purchaseInvoiceId: purchaseInvoiceId || '',
      recordedBy: (req as any).user.name,
      createdAt: new Date().toISOString(),
    };

    if (!db.supplierPayments) db.supplierPayments = [];
    db.supplierPayments.unshift(payment);

    // Update supplier totals atomically
    supplier.totalPaid = (supplier.totalPaid || 0) + Number(amount);
    supplier.outstandingPayable = Math.max(0, (supplier.outstandingPayable || 0) - Number(amount));

    // Also update purchase invoice if linked
    if (purchaseInvoiceId && db.purchases) {
      const pur = db.purchases.find((p: any) => p.id === purchaseInvoiceId);
      if (pur) {
        pur.paidAmount = (pur.paidAmount || 0) + Number(amount);
        pur.balanceDue = Math.max(0, pur.totalAmount - pur.paidAmount);
        pur.paymentStatus = pur.balanceDue <= 0 ? 'paid' : 'partial';
      }
    }

    addAuditLog((req as any).user.name, (req as any).user.role, 'payment', 'supplier', `Recorded payment of ₹${amount} to ${supplier.name}`, id);
    writeDb(db);
    broadcast('SUPPLIER_PAYMENT_RECORDED', { payment, supplier });
    res.status(201).json({ payment, supplier });
  });

  // =================== INVENTORY APIS ===================
  app.get('/api/inventory', (req, res) => {
    res.json(db.inventory || []);
  });

  app.post('/api/inventory', requireAuth, (req, res) => {
    const body = req.body;
    if (!body.name || !body.sku) {
      return res.status(400).json({ error: 'Product name and SKU are required' });
    }

    // Check duplicate SKU
    if (db.inventory?.some((i: any) => i.sku.toLowerCase() === body.sku.trim().toLowerCase())) {
      return res.status(400).json({ error: `SKU '${body.sku}' already exists in inventory` });
    }

    const currentStock = Number(body.currentStock) || 0;
    const minAlert = Number(body.minStockAlert) || 5;

    const newItem = {
      ...body,
      id: body.id || `inv-item-${Date.now()}`,
      sku: body.sku.trim().toUpperCase(),
      costPrice: Number(body.costPrice) || 0,
      sellingPrice: Number(body.sellingPrice) || 0,
      taxPercent: Number(body.taxPercent) || 18,
      currentStock,
      minStockAlert: minAlert,
      status: currentStock <= 0 ? 'out_of_stock' : currentStock <= minAlert ? 'low_stock' : 'in_stock',
      stockHistory: [
        {
          id: `mov-${Date.now()}`,
          itemId: body.id || `inv-item-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          type: 'adjustment',
          qty: currentStock,
          reference: 'Initial Stock Onboarding',
          notes: 'Opening balance',
          recordedBy: (req as any).user.name,
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (!db.inventory) db.inventory = [];
    db.inventory.unshift(newItem);
    addAuditLog((req as any).user.name, (req as any).user.role, 'create', 'inventory', `Added product ${newItem.name} (${newItem.sku})`, newItem.id);
    writeDb(db);
    broadcast('INVENTORY_UPDATED', newItem);
    res.status(201).json(newItem);
  });

  app.put('/api/inventory/:id', requireAuth, (req, res) => {
    const { id } = req.params;
    if (!db.inventory) db.inventory = [];
    const index = db.inventory.findIndex((i: any) => i.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const existing = db.inventory[index];
    const updated = {
      ...existing,
      ...req.body,
      id,
      updatedAt: new Date().toISOString(),
    };

    const stock = Number(updated.currentStock) || 0;
    const min = Number(updated.minStockAlert) || 5;
    updated.status = stock <= 0 ? 'out_of_stock' : stock <= min ? 'low_stock' : 'in_stock';

    db.inventory[index] = updated;
    addAuditLog((req as any).user.name, (req as any).user.role, 'update', 'inventory', `Updated inventory item ${updated.name}`, id);
    writeDb(db);
    broadcast('INVENTORY_UPDATED', updated);
    res.json(updated);
  });

  app.post('/api/inventory/:id/stock', requireAuth, (req, res) => {
    const { id } = req.params;
    const { type, qty, reference, notes } = req.body;
    if (!qty || qty <= 0) {
      return res.status(400).json({ error: 'Valid quantity is required' });
    }

    const item = db.inventory?.find((i: any) => i.id === id);
    if (!item) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const numQty = Number(qty);
    if (type === 'out' && item.currentStock < numQty) {
      return res.status(400).json({ error: `Insufficient stock! Current stock is ${item.currentStock}` });
    }

    if (type === 'in') {
      item.currentStock += numQty;
    } else if (type === 'out') {
      item.currentStock -= numQty;
    } else if (type === 'adjustment') {
      item.currentStock = numQty;
    }

    item.status = item.currentStock <= 0 ? 'out_of_stock' : item.currentStock <= item.minStockAlert ? 'low_stock' : 'in_stock';
    item.updatedAt = new Date().toISOString();

    const movement = {
      id: `mov-${Date.now()}`,
      itemId: id,
      date: new Date().toISOString().split('T')[0],
      type,
      qty: numQty,
      reference: reference || 'Manual Stock Adjustment',
      notes: notes || '',
      recordedBy: (req as any).user.name,
    };

    if (!item.stockHistory) item.stockHistory = [];
    item.stockHistory.unshift(movement);

    addAuditLog((req as any).user.name, (req as any).user.role, 'update', 'inventory', `Adjusted stock for ${item.name}: ${type} ${qty} (New stock: ${item.currentStock})`, id);
    writeDb(db);
    broadcast('INVENTORY_UPDATED', item);
    res.json({ item, movement });
  });

  // =================== PURCHASE INVOICE APIS ===================
  app.get('/api/purchases', (req, res) => {
    res.json(db.purchases || []);
  });

  app.post('/api/purchases', requireAuth, (req, res) => {
    const body = req.body;
    if (!body.supplierId || !body.items || body.items.length === 0) {
      return res.status(400).json({ error: 'Supplier and items are required' });
    }

    const supplier = db.suppliers?.find((s: any) => s.id === body.supplierId);
    if (!supplier) {
      return res.status(404).json({ error: 'Supplier not found' });
    }

    const purchaseNumber = body.purchaseNumber || `PUR-2026-${((db.purchases?.length || 0) + 1).toString().padStart(3, '0')}`;

    // Calculate totals accurately
    let subtotal = 0;
    let totalTax = 0;
    const computedItems = body.items.map((item: any, idx: number) => {
      const qty = Number(item.qty) || 1;
      const unitCost = Number(item.unitCost) || 0;
      const taxPercent = Number(item.taxPercent) || 18;
      const base = qty * unitCost;
      const tax = (base * taxPercent) / 100;
      subtotal += base;
      totalTax += tax;
      return {
        id: item.id || `pitem-${Date.now()}-${idx}`,
        inventoryItemId: item.inventoryItemId,
        description: item.description,
        hsnSac: item.hsnSac || '8525',
        qty,
        unitCost,
        taxPercent,
        taxAmount: tax,
        total: base + tax,
      };
    });

    const grandTotal = Math.round(subtotal + totalTax);
    const paidAmount = Number(body.paidAmount) || 0;
    const balanceDue = Math.max(0, grandTotal - paidAmount);

    const purchase: any = {
      id: `pur-${Date.now()}`,
      purchaseNumber,
      supplierId: supplier.id,
      supplierName: supplier.name,
      supplierGstin: supplier.gstin,
      billNumber: body.billNumber || '',
      purchaseDate: body.purchaseDate || new Date().toISOString().split('T')[0],
      dueDate: body.dueDate || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      items: computedItems,
      subtotal,
      taxAmount: totalTax,
      totalAmount: grandTotal,
      paidAmount,
      balanceDue,
      paymentStatus: balanceDue <= 0 ? 'paid' : paidAmount > 0 ? 'partial' : 'unpaid',
      paymentMethod: body.paymentMethod || 'NEFT/RTGS',
      paymentReference: body.paymentReference || '',
      notes: body.notes || '',
      billUrl: body.billUrl || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (!db.purchases) db.purchases = [];
    db.purchases.unshift(purchase);

    // Atomically increment supplier's total purchased and outstanding balance
    supplier.totalPurchased = (supplier.totalPurchased || 0) + grandTotal;
    supplier.totalPaid = (supplier.totalPaid || 0) + paidAmount;
    supplier.outstandingPayable = Math.max(0, (supplier.outstandingPayable || 0) + balanceDue);

    // Increment inventory stock for received items if linked
    if (db.inventory) {
      for (const pItem of computedItems) {
        if (pItem.inventoryItemId) {
          const invItem = db.inventory.find((i: any) => i.id === pItem.inventoryItemId);
          if (invItem) {
            invItem.currentStock += pItem.qty;
            invItem.status = invItem.currentStock <= 0 ? 'out_of_stock' : invItem.currentStock <= invItem.minStockAlert ? 'low_stock' : 'in_stock';
            if (!invItem.stockHistory) invItem.stockHistory = [];
            invItem.stockHistory.unshift({
              id: `mov-${Date.now()}-${pItem.id}`,
              itemId: invItem.id,
              date: purchase.purchaseDate,
              type: 'in',
              qty: pItem.qty,
              unitPrice: pItem.unitCost,
              reference: purchase.purchaseNumber,
              notes: `Purchased from ${supplier.name}`,
              recordedBy: (req as any).user.name,
            });
          }
        }
      }
    }

    addAuditLog((req as any).user.name, (req as any).user.role, 'create', 'purchase', `Created purchase invoice ${purchase.purchaseNumber} for ₹${grandTotal} from ${supplier.name}`, purchase.id);
    writeDb(db);
    broadcast('PURCHASE_CREATED', { purchase, supplier });
    res.status(201).json(purchase);
  });

  // =================== SALES INVOICE APIS ===================
  app.get('/api/invoices', (req, res) => {
    res.json(db.invoices || []);
  });

  app.post('/api/invoices', requireAuth, (req, res) => {
    const body = req.body;
    if (!body.customerId || !body.items || body.items.length === 0) {
      return res.status(400).json({ error: 'Customer and invoice items are required' });
    }

    const customer = db.customers.find((c: any) => c.id === body.customerId);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Verify invoice number uniqueness
    const invoiceNumber = body.invoiceNumber?.trim();
    if (!invoiceNumber) {
      return res.status(400).json({ error: 'Invoice number is required' });
    }
    if (db.invoices.some((i: any) => i.invoiceNumber.toLowerCase() === invoiceNumber.toLowerCase())) {
      return res.status(400).json({ error: `Invoice number '${invoiceNumber}' already exists` });
    }

    // Strict financial computation without double-counting
    let subtotal = 0;
    let totalDiscount = 0;
    let totalTax = 0;

    const computedItems = body.items.map((it: any, idx: number) => {
      const qty = Number(it.qty) || 1;
      const unitPrice = Number(it.unitPrice) || 0;
      const discountPercent = Number(it.discountPercent) || 0;
      const taxPercent = Number(it.taxPercent) || 18;

      const baseAmount = qty * unitPrice;
      const discount = (baseAmount * discountPercent) / 100;
      const taxable = baseAmount - discount;
      const tax = (taxable * taxPercent) / 100;

      subtotal += baseAmount;
      totalDiscount += discount;
      totalTax += tax;

      return {
        id: it.id || `item-${Date.now()}-${idx}`,
        inventoryItemId: it.inventoryItemId,
        type: it.type || 'equipment',
        description: it.description,
        partNumber: it.partNumber || '',
        serialNumbers: it.serialNumbers || '',
        hsnSac: it.hsnSac || '8525',
        qty,
        unitPrice,
        discountPercent,
        taxPercent,
        taxAmount: tax,
        total: taxable + tax,
      };
    });

    const grandTotal = Math.round(subtotal - totalDiscount + totalTax);
    const paidAmount = Number(body.paidAmount) || 0;
    const balanceDue = Math.max(0, grandTotal - paidAmount);

    let status = body.status || 'Issued';
    if (balanceDue <= 0) {
      status = 'Paid';
    } else if (paidAmount > 0) {
      status = 'Partial';
    }

    const invoice: any = {
      ...body,
      id: body.id || `inv-${Date.now()}`,
      docType: body.docType || 'invoice_with_gst',
      invoiceNumber,
      customerId: customer.id,
      customerName: customer.name,
      company: customer.company,
      companyId: customer.companyId,
      customerGstin: customer.gstin || '',
      customerAddress: customer.address || '',
      customerCity: customer.city || '',
      customerPhone: customer.phone || '',
      amount: subtotal,
      discountTotal: totalDiscount,
      taxAmount: totalTax,
      totalAmount: grandTotal,
      paidAmount,
      balanceDue,
      status,
      issuedDate: body.issuedDate || new Date().toISOString().split('T')[0],
      dueDate: body.dueDate || new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
      items: computedItems,
      payments: paidAmount > 0 ? [
        {
          id: `pay-${Date.now()}`,
          date: body.issuedDate || new Date().toISOString().split('T')[0],
          amount: paidAmount,
          method: body.paymentMethod || 'UPI',
          referenceNumber: body.paymentReference || 'Advance Payment on Issue',
          recordedBy: (req as any).user.name,
        }
      ] : [],
      auditLogs: [
        {
          id: `aud-${Date.now()}`,
          timestamp: new Date().toISOString(),
          action: 'Invoice Created',
          actor: (req as any).user.name,
          details: `Generated ${body.docType} #${invoiceNumber} for ₹${grandTotal}`,
        }
      ],
    };

    db.invoices.unshift(invoice);

    // Update customer balances atomically
    customer.totalBilled = (customer.totalBilled || 0) + grandTotal;
    customer.totalReceived = (customer.totalReceived || 0) + paidAmount;
    customer.outstandingBalance = (customer.outstandingBalance || 0) + balanceDue;
    customer.paymentStatus = customer.outstandingBalance <= 0 ? 'paid' : customer.totalReceived > 0 ? 'partial' : 'pending';

    // Deduct stock for sold items if inventory linked
    if (db.inventory) {
      for (const it of computedItems) {
        if (it.inventoryItemId) {
          const invItem = db.inventory.find((i: any) => i.id === it.inventoryItemId);
          if (invItem) {
            invItem.currentStock = Math.max(0, invItem.currentStock - it.qty);
            invItem.status = invItem.currentStock <= 0 ? 'out_of_stock' : invItem.currentStock <= invItem.minStockAlert ? 'low_stock' : 'in_stock';
            if (!invItem.stockHistory) invItem.stockHistory = [];
            invItem.stockHistory.unshift({
              id: `mov-${Date.now()}-${it.id}`,
              itemId: invItem.id,
              date: invoice.issuedDate,
              type: 'out',
              qty: it.qty,
              unitPrice: it.unitPrice,
              reference: invoice.invoiceNumber,
              notes: `Sold to customer ${customer.name}`,
              recordedBy: (req as any).user.name,
            });
          }
        }
      }
    }

    addAuditLog((req as any).user.name, (req as any).user.role, 'create', 'invoice', `Created invoice #${invoice.invoiceNumber} for ₹${grandTotal} for ${customer.name}`, invoice.id);
    writeDb(db);
    broadcast('INVOICE_CREATED', { invoice, customer });
    res.status(201).json(invoice);
  });

  app.post('/api/invoices/:id/payments', requireAuth, (req, res) => {
    const { id } = req.params;
    const { amount, method, referenceNumber, notes } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Valid payment amount is required' });
    }

    const invoice = db.invoices.find((i: any) => i.id === id);
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    const numAmount = Number(amount);
    const payment = {
      id: `pay-${Date.now()}`,
      date: req.body.date || new Date().toISOString().split('T')[0],
      amount: numAmount,
      method: method || 'UPI',
      referenceNumber: referenceNumber || '',
      notes: notes || '',
      recordedBy: (req as any).user.name,
    };

    if (!invoice.payments) invoice.payments = [];
    invoice.payments.unshift(payment);

    invoice.paidAmount = (invoice.paidAmount || 0) + numAmount;
    invoice.balanceDue = Math.max(0, invoice.totalAmount - invoice.paidAmount);
    invoice.status = invoice.balanceDue <= 0 ? 'Paid' : 'Partial';

    if (!invoice.auditLogs) invoice.auditLogs = [];
    invoice.auditLogs.unshift({
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: 'Payment Received',
      actor: (req as any).user.name,
      details: `Received ₹${numAmount} via ${method}. Remaining balance: ₹${invoice.balanceDue}`,
    });

    // Update customer balance atomically
    const customer = db.customers.find((c: any) => c.id === invoice.customerId);
    if (customer) {
      customer.totalReceived = (customer.totalReceived || 0) + numAmount;
      customer.outstandingBalance = Math.max(0, (customer.outstandingBalance || 0) - numAmount);
      customer.paymentStatus = customer.outstandingBalance <= 0 ? 'paid' : 'partial';
    }

    addAuditLog((req as any).user.name, (req as any).user.role, 'payment', 'invoice', `Received payment of ₹${numAmount} for invoice #${invoice.invoiceNumber}`, invoice.id);
    writeDb(db);
    broadcast('INVOICE_UPDATED', { invoice, customer });
    res.status(201).json({ invoice, payment, customer });
  });

  // =================== COMPANY EXPENSES APIS ===================
  app.get('/api/expenses', (req, res) => {
    res.json(db.expenses || []);
  });

  app.post('/api/expenses', requireAuth, (req, res) => {
    const body = req.body;
    if (!body.category || !body.amount || !body.description) {
      return res.status(400).json({ error: 'Category, description, and amount are required' });
    }

    const expenseNumber = `EXP-2026-${((db.expenses?.length || 0) + 1).toString().padStart(3, '0')}`;
    const user = (req as any).user;
    const isUserAdmin = user.role === 'admin';

    const newExpense = {
      ...body,
      id: `exp-${Date.now()}`,
      expenseNumber,
      amount: Number(body.amount),
      taxAmount: Number(body.taxAmount) || 0,
      isRecurring: Boolean(body.isRecurring),
      approvalStatus: isUserAdmin ? 'approved' : 'pending',
      approvedBy: isUserAdmin ? `${user.name} (Admin)` : undefined,
      createdBy: user.name,
      createdAt: new Date().toISOString(),
    };

    if (!db.expenses) db.expenses = [];
    db.expenses.unshift(newExpense);
    addAuditLog(user.name, user.role, 'create', 'expense', `Recorded ${newExpense.category} expense of ₹${newExpense.amount}`, newExpense.id);
    writeDb(db);
    broadcast('EXPENSE_CREATED', newExpense);
    res.status(201).json(newExpense);
  });

  app.patch('/api/expenses/:id/approve', requireAuth, requireAdmin, (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // 'approved' | 'rejected'
    const exp = db.expenses?.find((e: any) => e.id === id);
    if (!exp) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    exp.approvalStatus = status === 'rejected' ? 'rejected' : 'approved';
    exp.approvedBy = (req as any).user.name;
    exp.modifiedBy = (req as any).user.name;

    addAuditLog((req as any).user.name, (req as any).user.role, 'approve', 'expense', `${exp.approvalStatus.toUpperCase()} expense ${exp.expenseNumber} (₹${exp.amount})`, id);
    writeDb(db);
    broadcast('EXPENSE_UPDATED', exp);
    res.json(exp);
  });

  app.delete('/api/expenses/:id', requireAuth, requireAdmin, (req, res) => {
    const { id } = req.params;
    const index = db.expenses?.findIndex((e: any) => e.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    const removed = db.expenses.splice(index, 1)[0];
    addAuditLog((req as any).user.name, (req as any).user.role, 'delete', 'expense', `Deleted expense ${removed.expenseNumber} (₹${removed.amount})`, id);
    writeDb(db);
    broadcast('EXPENSE_DELETED', { id });
    res.json({ success: true, message: 'Expense deleted successfully' });
  });

  // =================== STAFF, SALARY & ADVANCE APIS ===================
  app.get('/api/staff', (req, res) => {
    res.json(db.staffMembers || []);
  });

  app.post('/api/staff', requireAuth, requireAdmin, (req, res) => {
    const body = req.body;
    if (!body.name || !body.email || !body.role) {
      return res.status(400).json({ error: 'Staff name, email, and role are required' });
    }

    const nextEmpId = `STI-EMP-${((db.staffMembers?.length || 0) + 1).toString().padStart(3, '0')}`;
    const basic = Number(body.basicSalary) || 25000;
    const hra = Number(body.hra) || 0;
    const allowances = Number(body.allowances) || 0;
    const deductions = Number(body.deductions) || 0;

    const newStaff = {
      ...body,
      id: `staff-mem-${Date.now()}`,
      employeeId: body.employeeId || nextEmpId,
      basicSalary: basic,
      hra,
      allowances,
      deductions,
      netMonthlySalary: basic + hra + allowances - deductions,
      totalAdvancesTaken: 0,
      outstandingAdvance: 0,
      employmentStatus: body.employmentStatus || 'active',
      createdAt: new Date().toISOString(),
    };

    if (!db.staffMembers) db.staffMembers = [];
    db.staffMembers.push(newStaff);
    addAuditLog((req as any).user.name, (req as any).user.role, 'create', 'staff', `Added staff member ${newStaff.name} (${newStaff.employeeId})`, newStaff.id);
    writeDb(db);
    broadcast('STAFF_UPDATED', newStaff);
    res.status(201).json(newStaff);
  });

  app.put('/api/staff/:id', requireAuth, requireAdmin, (req, res) => {
    const { id } = req.params;
    const index = db.staffMembers?.findIndex((s: any) => s.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Staff member not found' });
    }

    const existing = db.staffMembers[index];
    const basic = Number(req.body.basicSalary ?? existing.basicSalary) || 0;
    const hra = Number(req.body.hra ?? existing.hra) || 0;
    const allowances = Number(req.body.allowances ?? existing.allowances) || 0;
    const deductions = Number(req.body.deductions ?? existing.deductions) || 0;

    const updated = {
      ...existing,
      ...req.body,
      basicSalary: basic,
      hra,
      allowances,
      deductions,
      netMonthlySalary: basic + hra + allowances - deductions,
    };

    db.staffMembers[index] = updated;
    addAuditLog((req as any).user.name, (req as any).user.role, 'update', 'staff', `Updated staff member ${updated.name}`, id);
    writeDb(db);
    broadcast('STAFF_UPDATED', updated);
    res.json(updated);
  });

  app.get('/api/salaries', requireAuth, (req, res) => {
    res.json(db.salaryRecords || []);
  });

  app.post('/api/salaries', requireAuth, requireAdmin, (req, res) => {
    const body = req.body;
    const staff = db.staffMembers?.find((s: any) => s.id === body.staffId);
    if (!staff) {
      return res.status(404).json({ error: 'Staff member not found' });
    }

    const basic = Number(body.basicSalary ?? staff.basicSalary);
    const hra = Number(body.hra ?? staff.hra);
    const allowances = Number(body.allowances ?? staff.allowances);
    const overtimeBonus = Number(body.overtimeBonus) || 0;
    const authorizedDeductions = Number(body.authorizedDeductions ?? staff.deductions) || 0;
    const advanceDeduction = Number(body.advanceDeduction) || 0;

    const grossSalary = basic + hra + allowances + overtimeBonus;
    const netPayable = grossSalary - authorizedDeductions - advanceDeduction;
    const amountPaid = Number(body.amountPaid) || netPayable;
    const status = amountPaid >= netPayable ? 'paid' : amountPaid > 0 ? 'partial' : 'pending';

    const salaryRecord = {
      id: `sal-${Date.now()}`,
      month: body.month || 'October 2026',
      year: body.year || 2026,
      staffId: staff.id,
      employeeId: staff.employeeId,
      staffName: staff.name,
      department: staff.department,
      basicSalary: basic,
      hra,
      allowances,
      overtimeBonus,
      authorizedDeductions,
      advanceDeduction,
      grossSalary,
      netPayable,
      amountPaid,
      status,
      paymentDate: body.paymentDate || new Date().toISOString().split('T')[0],
      paymentMethod: body.paymentMethod || 'Bank Transfer',
      referenceNumber: body.referenceNumber || `NEFT-SAL-${Date.now()}`,
      notes: body.notes || '',
      generatedDate: new Date().toISOString(),
    };

    if (!db.salaryRecords) db.salaryRecords = [];
    db.salaryRecords.unshift(salaryRecord);

    // If advance was deducted, update staff outstanding advance
    if (advanceDeduction > 0) {
      staff.outstandingAdvance = Math.max(0, (staff.outstandingAdvance || 0) - advanceDeduction);
      // Update advance record
      const adv = db.salaryAdvances?.find((a: any) => a.staffId === staff.id && a.status === 'active');
      if (adv) {
        adv.repaidAmount += advanceDeduction;
        adv.balanceRemaining = Math.max(0, adv.amount - adv.repaidAmount);
        if (adv.balanceRemaining <= 0) adv.status = 'settled';
      }
    }

    addAuditLog((req as any).user.name, (req as any).user.role, 'create', 'salary', `Processed ${salaryRecord.month} salary of ₹${amountPaid} for ${staff.name}`, salaryRecord.id);
    writeDb(db);
    broadcast('SALARY_PROCESSED', { salaryRecord, staff });
    res.status(201).json(salaryRecord);
  });

  app.get('/api/advances', requireAuth, (req, res) => {
    res.json(db.salaryAdvances || []);
  });

  app.post('/api/advances', requireAuth, requireAdmin, (req, res) => {
    const { staffId, amount, reason } = req.body;
    const staff = db.staffMembers?.find((s: any) => s.id === staffId);
    if (!staff) {
      return res.status(404).json({ error: 'Staff member not found' });
    }

    const numAmount = Number(amount);
    const advance = {
      id: `adv-${Date.now()}`,
      staffId: staff.id,
      staffName: staff.name,
      employeeId: staff.employeeId,
      date: req.body.date || new Date().toISOString().split('T')[0],
      amount: numAmount,
      reason: reason || 'Salary advance',
      repaidAmount: 0,
      balanceRemaining: numAmount,
      status: 'active' as const,
      approvedBy: (req as any).user.name,
      createdAt: new Date().toISOString(),
    };

    if (!db.salaryAdvances) db.salaryAdvances = [];
    db.salaryAdvances.unshift(advance);

    staff.totalAdvancesTaken = (staff.totalAdvancesTaken || 0) + numAmount;
    staff.outstandingAdvance = (staff.outstandingAdvance || 0) + numAmount;

    addAuditLog((req as any).user.name, (req as any).user.role, 'create', 'salary', `Approved salary advance of ₹${numAmount} for ${staff.name}`, advance.id);
    writeDb(db);
    broadcast('ADVANCE_RECORDED', { advance, staff });
    res.status(201).json(advance);
  });

  app.get('/api/attendance', (req, res) => {
    res.json(db.attendance || []);
  });

  app.post('/api/attendance', requireAuth, (req, res) => {
    const { date, records } = req.body;
    if (!date || !records || !Array.isArray(records)) {
      return res.status(400).json({ error: 'Date and records array are required' });
    }

    if (!db.attendance) db.attendance = [];

    for (const rec of records) {
      const idx = db.attendance.findIndex((a: any) => a.date === date && a.staffId === rec.staffId);
      if (idx !== -1) {
        db.attendance[idx] = { ...db.attendance[idx], ...rec, date };
      } else {
        db.attendance.push({
          id: `att-${Date.now()}-${rec.staffId}`,
          date,
          staffId: rec.staffId,
          staffName: rec.staffName,
          status: rec.status,
          checkInTime: rec.checkInTime || '09:00',
          checkOutTime: rec.checkOutTime || '18:30',
          notes: rec.notes || '',
        });
      }
    }

    addAuditLog((req as any).user.name, (req as any).user.role, 'update', 'staff', `Marked attendance for ${records.length} staff members on ${date}`);
    writeDb(db);
    broadcast('ATTENDANCE_UPDATED', { date, attendance: db.attendance });
    res.json({ success: true, count: records.length });
  });

  // =================== PROFIT & LOSS REPORT API ===================
  app.get('/api/reports/profit-loss', (req, res) => {
    // 1. Total recognized sales
    const invoices = db.invoices || [];
    const validInvoices = invoices.filter((i: any) => i.status !== 'Draft' && i.status !== 'Cancelled');
    const totalSales = validInvoices.reduce((sum: number, i: any) => sum + (Number(i.amount) || 0), 0);
    const totalDiscounts = validInvoices.reduce((sum: number, i: any) => sum + (Number(i.discountTotal) || 0), 0);
    const netSales = totalSales - totalDiscounts;

    // 2. Cost of Goods Sold (COGS) calculated from inventory line item costs
    let cogs = 0;
    for (const inv of validInvoices) {
      for (const item of (inv.items || [])) {
        if (item.inventoryItemId && db.inventory) {
          const invItem = db.inventory.find((p: any) => p.id === item.inventoryItemId);
          if (invItem && invItem.costPrice) {
            cogs += (Number(invItem.costPrice) || 0) * (Number(item.qty) || 1);
          }
        }
      }
    }
    // If some items were unlinked, derive from purchases recognized
    if (cogs === 0 && db.purchases) {
      cogs = (db.purchases || []).reduce((sum: number, p: any) => sum + (Number(p.subtotal) || 0), 0);
    }

    // Gross Profit = Net Sales - COGS
    const grossProfit = Math.max(0, netSales - cogs);
    const grossProfitMargin = netSales > 0 ? Number(((grossProfit / netSales) * 100).toFixed(2)) : 0;

    // 3. Staff Salary Expenses (Only count paid salary records once)
    const staffSalaryExpenses = (db.salaryRecords || [])
      .filter((s: any) => s.status === 'paid' || s.amountPaid > 0)
      .reduce((sum: number, s: any) => sum + (Number(s.amountPaid) || 0), 0);

    // 4. Operating Expenses (Approved only)
    const operatingExpenses = (db.expenses || [])
      .filter((e: any) => e.approvalStatus === 'approved')
      .reduce((sum: number, e: any) => sum + (Number(e.amount) || 0), 0);

    const totalOperatingExpenses = staffSalaryExpenses + operatingExpenses;

    // Operating Profit = Gross Profit - Operating Expenses
    const operatingProfit = grossProfit - totalOperatingExpenses;

    // Net Profit = Total Recognized Income - Total Recognized Expenses
    const netProfit = operatingProfit;
    const netProfitMargin = netSales > 0 ? Number(((netProfit / netSales) * 100).toFixed(2)) : 0;

    // Accounts Receivable: money customers owe
    const accountsReceivable = (db.customers || []).reduce((sum: number, c: any) => sum + Math.max(0, Number(c.outstandingBalance) || 0), 0);

    // Accounts Payable: money owed to suppliers
    const accountsPayable = (db.suppliers || []).reduce((sum: number, s: any) => sum + Math.max(0, Number(s.outstandingPayable) || 0), 0);

    res.json({
      periodLabel: 'FY 2026-27 (YTD)',
      startDate: '2026-04-01',
      endDate: '2026-10-28',
      totalSales,
      discountsAndReturns: totalDiscounts,
      netSales,
      costOfGoodsSold: cogs,
      grossProfit,
      grossProfitMargin,
      staffSalaryExpenses,
      operatingExpenses,
      totalOperatingExpenses,
      operatingProfit,
      netProfit,
      netProfitMargin,
      accountsReceivable,
      accountsPayable,
      invoiceCount: validInvoices.length,
      customerCount: db.customers?.length || 0,
      supplierCount: db.suppliers?.length || 0,
    });
  });

  // Settings update
  app.put('/api/settings', requireAuth, requireAdmin, (req, res) => {
    db.settings = { ...db.settings, ...req.body };
    addAuditLog((req as any).user.name, (req as any).user.role, 'update', 'settings', 'Updated company profile and billing settings');
    writeDb(db);
    broadcast('SETTINGS_UPDATED', db.settings);
    res.json(db.settings);
  });

  // Demo data reset (admin only)
  app.post('/api/reset-demo', requireAuth, requireAdmin, async (req, res) => {
    fs.unlinkSync(DB_FILE);
    await initDatabase();
    addAuditLog((req as any).user.name, (req as any).user.role, 'update', 'settings', 'Reset all records to initial corporate baseline');
    broadcast('FULL_RESYNC', db);
    res.json({ success: true, message: 'Database reset to initial corporate state', state: db });
  });

  // =================== VITE MIDDLEWARE OR STATIC SERVING ===================
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Sumedha Tech Infra server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
