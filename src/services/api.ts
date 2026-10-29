import {
  AuthUser,
  Company,
  Customer,
  Supplier,
  SupplierPayment,
  InventoryItem,
  PurchaseInvoice,
  Invoice,
  CompanyExpense,
  StaffMember,
  MonthlySalaryRecord,
  SalaryAdvance,
  AttendanceRecord,
  SystemAuditLog,
  ProfitAndLossReport,
  SystemSettings,
  Technician,
  Ticket,
} from '../types';

const TOKEN_KEY = 'sumedha_auth_token_v2';
const USER_KEY = 'sumedha_auth_user_v2';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string | null): void {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function getStoredAuthUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredAuthUser(user: AuthUser | null): void {
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_KEY);
  }
}

async function apiRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const res = await fetch(url, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let errMsg = `Request failed (${res.status})`;
    try {
      const errJson = await res.json();
      errMsg = errJson.error || errJson.message || errMsg;
    } catch {
      // ignore
    }
    throw new Error(errMsg);
  }

  return res.json() as Promise<T>;
}

export interface FullBusinessState {
  companies: Company[];
  customers: Customer[];
  suppliers: Supplier[];
  supplierPayments: SupplierPayment[];
  inventory: InventoryItem[];
  purchases: PurchaseInvoice[];
  tickets: Ticket[];
  invoices: Invoice[];
  technicians: Technician[];
  expenses: CompanyExpense[];
  staffMembers: StaffMember[];
  salaryRecords: MonthlySalaryRecord[];
  salaryAdvances: SalaryAdvance[];
  attendance: AttendanceRecord[];
  auditLogs: SystemAuditLog[];
  settings: SystemSettings;
}

export const ApiService = {
  // Realtime SSE Event Stream
  subscribeToEvents(onEvent: (event: { type: string; payload?: any }) => void): () => void {
    if (typeof EventSource === 'undefined') return () => {};

    const es = new EventSource('/api/events');

    es.addEventListener('connected', (e: any) => {
      try {
        const data = JSON.parse(e.data);
        onEvent({ type: 'CONNECTED', payload: data });
      } catch {
        onEvent({ type: 'CONNECTED' });
      }
    });

    const eventNames = [
      'CUSTOMER_UPDATED',
      'SUPPLIER_UPDATED',
      'SUPPLIER_PAYMENT_RECORDED',
      'INVENTORY_UPDATED',
      'PURCHASE_CREATED',
      'INVOICE_CREATED',
      'INVOICE_UPDATED',
      'EXPENSE_CREATED',
      'EXPENSE_UPDATED',
      'EXPENSE_DELETED',
      'STAFF_UPDATED',
      'SALARY_PROCESSED',
      'ADVANCE_RECORDED',
      'ATTENDANCE_UPDATED',
      'SETTINGS_UPDATED',
      'AUDIT_UPDATED',
      'FULL_RESYNC',
    ];

    eventNames.forEach((evName) => {
      es.addEventListener(evName, (e: any) => {
        try {
          const payload = JSON.parse(e.data);
          onEvent({ type: evName, payload });
        } catch {
          onEvent({ type: evName });
        }
      });
    });

    es.onerror = () => {
      onEvent({ type: 'DISCONNECTED' });
    };

    return () => {
      es.close();
    };
  },

  // State
  async fetchFullState(): Promise<FullBusinessState> {
    return apiRequest<FullBusinessState>('/api/state');
  },

  // Auth
  async login(email: string, password: string): Promise<{ token: string; user: AuthUser }> {
    const res = await apiRequest<{ token: string; user: AuthUser }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setStoredToken(res.token);
    setStoredAuthUser(res.user);
    return res;
  },

  async logout(): Promise<void> {
    try {
      await apiRequest('/api/auth/logout', { method: 'POST' });
    } finally {
      setStoredToken(null);
      setStoredAuthUser(null);
    }
  },

  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      return await apiRequest<AuthUser>('/api/auth/me');
    } catch {
      return null;
    }
  },

  async requestPasswordResetOtp(email: string): Promise<{ success: boolean; message: string }> {
    return apiRequest<{ success: boolean; message: string }>('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  async verifyOtp(email: string, otp: string): Promise<{ success: boolean; message: string; resetToken: string }> {
    return apiRequest<{ success: boolean; message: string; resetToken: string }>('/api/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
  },

  async resetPassword(email: string, resetToken: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    return apiRequest<{ success: boolean; message: string }>('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, resetToken, newPassword }),
    });
  },

  // Customers
  async getCustomers(): Promise<Customer[]> {
    return apiRequest<Customer[]>('/api/customers');
  },
  async createCustomer(cust: Partial<Customer>): Promise<Customer> {
    return apiRequest<Customer>('/api/customers', {
      method: 'POST',
      body: JSON.stringify(cust),
    });
  },
  async updateCustomer(id: string, cust: Partial<Customer>): Promise<Customer> {
    return apiRequest<Customer>(`/api/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(cust),
    });
  },
  async archiveCustomer(id: string): Promise<void> {
    await apiRequest(`/api/customers/${id}`, { method: 'DELETE' });
  },

  // Suppliers
  async getSuppliers(): Promise<Supplier[]> {
    return apiRequest<Supplier[]>('/api/suppliers');
  },
  async createSupplier(sup: Partial<Supplier>): Promise<Supplier> {
    return apiRequest<Supplier>('/api/suppliers', {
      method: 'POST',
      body: JSON.stringify(sup),
    });
  },
  async updateSupplier(id: string, sup: Partial<Supplier>): Promise<Supplier> {
    return apiRequest<Supplier>(`/api/suppliers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(sup),
    });
  },
  async archiveSupplier(id: string): Promise<void> {
    await apiRequest(`/api/suppliers/${id}`, { method: 'DELETE' });
  },
  async recordSupplierPayment(
    supplierId: string,
    data: { amount: number; method: string; referenceNumber: string; notes?: string; purchaseInvoiceId?: string }
  ): Promise<{ payment: SupplierPayment; supplier: Supplier }> {
    return apiRequest<{ payment: SupplierPayment; supplier: Supplier }>(`/api/suppliers/${supplierId}/payments`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Inventory
  async getInventory(): Promise<InventoryItem[]> {
    return apiRequest<InventoryItem[]>('/api/inventory');
  },
  async createInventoryItem(item: Partial<InventoryItem>): Promise<InventoryItem> {
    return apiRequest<InventoryItem>('/api/inventory', {
      method: 'POST',
      body: JSON.stringify(item),
    });
  },
  async updateInventoryItem(id: string, item: Partial<InventoryItem>): Promise<InventoryItem> {
    return apiRequest<InventoryItem>(`/api/inventory/${id}`, {
      method: 'PUT',
      body: JSON.stringify(item),
    });
  },
  async adjustStock(
    id: string,
    data: { type: 'in' | 'out' | 'adjustment'; qty: number; reference?: string; notes?: string }
  ): Promise<{ item: InventoryItem }> {
    return apiRequest<{ item: InventoryItem }>(`/api/inventory/${id}/stock`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Purchases
  async getPurchases(): Promise<PurchaseInvoice[]> {
    return apiRequest<PurchaseInvoice[]>('/api/purchases');
  },
  async createPurchase(purchase: Partial<PurchaseInvoice>): Promise<PurchaseInvoice> {
    return apiRequest<PurchaseInvoice>('/api/purchases', {
      method: 'POST',
      body: JSON.stringify(purchase),
    });
  },

  // Invoices (Sales)
  async getInvoices(): Promise<Invoice[]> {
    return apiRequest<Invoice[]>('/api/invoices');
  },
  async createInvoice(invoice: Partial<Invoice>): Promise<Invoice> {
    return apiRequest<Invoice>('/api/invoices', {
      method: 'POST',
      body: JSON.stringify(invoice),
    });
  },
  async recordInvoicePayment(
    invoiceId: string,
    data: { amount: number; method: string; referenceNumber: string; notes?: string }
  ): Promise<{ invoice: Invoice }> {
    return apiRequest<{ invoice: Invoice }>(`/api/invoices/${invoiceId}/payments`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Expenses
  async getExpenses(): Promise<CompanyExpense[]> {
    return apiRequest<CompanyExpense[]>('/api/expenses');
  },
  async createExpense(expense: Partial<CompanyExpense>): Promise<CompanyExpense> {
    return apiRequest<CompanyExpense>('/api/expenses', {
      method: 'POST',
      body: JSON.stringify(expense),
    });
  },
  async approveExpense(id: string, status: 'approved' | 'rejected'): Promise<CompanyExpense> {
    return apiRequest<CompanyExpense>(`/api/expenses/${id}/approve`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
  async deleteExpense(id: string): Promise<void> {
    await apiRequest(`/api/expenses/${id}`, { method: 'DELETE' });
  },

  // Staff & Salaries
  async getStaff(): Promise<StaffMember[]> {
    return apiRequest<StaffMember[]>('/api/staff');
  },
  async createStaff(staff: Partial<StaffMember>): Promise<StaffMember> {
    return apiRequest<StaffMember>('/api/staff', {
      method: 'POST',
      body: JSON.stringify(staff),
    });
  },
  async updateStaff(id: string, staff: Partial<StaffMember>): Promise<StaffMember> {
    return apiRequest<StaffMember>(`/api/staff/${id}`, {
      method: 'PUT',
      body: JSON.stringify(staff),
    });
  },
  async getSalaries(): Promise<MonthlySalaryRecord[]> {
    return apiRequest<MonthlySalaryRecord[]>('/api/salaries');
  },
  async processSalary(data: Partial<MonthlySalaryRecord>): Promise<MonthlySalaryRecord> {
    return apiRequest<MonthlySalaryRecord>('/api/salaries', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  async getAdvances(): Promise<SalaryAdvance[]> {
    return apiRequest<SalaryAdvance[]>('/api/advances');
  },
  async recordAdvance(data: { staffId: string; amount: number; reason: string }): Promise<SalaryAdvance> {
    return apiRequest<SalaryAdvance>('/api/advances', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  async getAttendance(): Promise<AttendanceRecord[]> {
    return apiRequest<AttendanceRecord[]>('/api/attendance');
  },
  async saveAttendance(date: string, records: any[]): Promise<void> {
    await apiRequest('/api/attendance', {
      method: 'POST',
      body: JSON.stringify({ date, records }),
    });
  },

  // Reports
  async getProfitLossReport(): Promise<ProfitAndLossReport> {
    return apiRequest<ProfitAndLossReport>('/api/reports/profit-loss');
  },

  // Settings
  async updateSettings(settings: Partial<SystemSettings>): Promise<SystemSettings> {
    return apiRequest<SystemSettings>('/api/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  },

  async resetDemoData(): Promise<void> {
    await apiRequest('/api/reset-demo', { method: 'POST' });
  },
};
