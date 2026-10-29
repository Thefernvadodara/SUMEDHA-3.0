import {
  Company,
  Customer,
  Invoice,
  NotificationItem,
  SystemSettings,
  Technician,
  Ticket,
} from '../types';
import {
  INITIAL_COMPANIES,
  INITIAL_CUSTOMERS,
  INITIAL_INVOICES,
  INITIAL_NOTIFICATIONS,
  INITIAL_SETTINGS,
  INITIAL_TECHNICIANS,
  INITIAL_TICKETS,
} from '../data/mockData';

const KEYS = {
  COMPANIES: 'sumedha_companies_v1',
  CUSTOMERS: 'sumedha_customers_v1',
  TICKETS: 'sumedha_tickets_v1',
  INVOICES: 'sumedha_invoices_v1',
  TECHNICIANS: 'sumedha_technicians_v1',
  NOTIFICATIONS: 'sumedha_notifications_v1',
  SETTINGS: 'sumedha_settings_v1',
};

// Safe JSON parser
function safeParse<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item) as T;
  } catch (err) {
    console.warn(`Failed to parse localStorage key ${key}:`, err);
    return fallback;
  }
}

// Storage helpers
export const StorageService = {
  getCompanies(): Company[] {
    return safeParse<Company[]>(KEYS.COMPANIES, INITIAL_COMPANIES);
  },
  saveCompanies(data: Company[]): void {
    localStorage.setItem(KEYS.COMPANIES, JSON.stringify(data));
  },

  getCustomers(): Customer[] {
    const list = safeParse<Customer[]>(KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
    const hasAvadh = list.some((c) => c.id === 'cust-avadh');
    if (!hasAvadh) {
      const refs = INITIAL_CUSTOMERS.filter((ref) => !list.some((existing) => existing.id === ref.id));
      const updated = [...list, ...refs];
      this.saveCustomers(updated);
      return updated;
    }
    return list;
  },
  saveCustomers(data: Customer[]): void {
    localStorage.setItem(KEYS.CUSTOMERS, JSON.stringify(data));
  },

  getTickets(): Ticket[] {
    return safeParse<Ticket[]>(KEYS.TICKETS, INITIAL_TICKETS);
  },
  saveTickets(data: Ticket[]): void {
    localStorage.setItem(KEYS.TICKETS, JSON.stringify(data));
  },

  getInvoices(): Invoice[] {
    const list = safeParse<Invoice[]>(KEYS.INVOICES, INITIAL_INVOICES);
    const hasAvadh = list.some((i) => i.id === 'inv-avadh-gst');
    const hasDarshanam = list.some((i) => i.id === 'qtn-darshanam-gst');
    let updated = list.map((i) => ({
      ...i,
      docType: i.docType || 'invoice_with_gst',
    }));
    if (!hasAvadh || !hasDarshanam) {
      const refs = INITIAL_INVOICES.filter((ref) => !list.some((existing) => existing.id === ref.id));
      updated = [...refs, ...updated];
      this.saveInvoices(updated);
    }
    return updated;
  },
  saveInvoices(data: Invoice[]): void {
    localStorage.setItem(KEYS.INVOICES, JSON.stringify(data));
  },

  getTechnicians(): Technician[] {
    return safeParse<Technician[]>(KEYS.TECHNICIANS, INITIAL_TECHNICIANS);
  },
  saveTechnicians(data: Technician[]): void {
    localStorage.setItem(KEYS.TECHNICIANS, JSON.stringify(data));
  },

  getNotifications(): NotificationItem[] {
    return safeParse<NotificationItem[]>(KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  },
  saveNotifications(data: NotificationItem[]): void {
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(data));
  },

  getSettings(): SystemSettings {
    const saved = safeParse<SystemSettings>(KEYS.SETTINGS, INITIAL_SETTINGS);
    if (saved.companyProfile.gstin === '24AAACS1234F1Z8' || !saved.billingConfig.quotationPrefix) {
      const merged: SystemSettings = {
        ...INITIAL_SETTINGS,
        ...saved,
        companyProfile: {
          ...INITIAL_SETTINGS.companyProfile,
          ...saved.companyProfile,
          name: 'SUMEDHA TECH INFRA',
          gstin: saved.companyProfile.gstin === '24AAACS1234F1Z8' ? '24DMGPS9549D1ZN' : saved.companyProfile.gstin,
          city: saved.companyProfile.city === 'Ahmedabad' ? 'Vadodara' : saved.companyProfile.city,
          address: saved.companyProfile.address.includes('Titanium') ? 'Kunalchaar Rasta, Gotri, New Alkapuri' : saved.companyProfile.address,
          phone: '+91 93273 22327',
          email: 'sumedhatechinfra@gmail.com',
        },
        billingConfig: {
          ...INITIAL_SETTINGS.billingConfig,
          ...saved.billingConfig,
        },
      };
      this.saveSettings(merged);
      return merged;
    }
    return saved;
  },
  saveSettings(data: SystemSettings): void {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(data));
  },

  // Export all application data as a single JSON file
  exportBackupJSON(): void {
    const backup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      companyProfile: this.getSettings().companyProfile,
      companies: this.getCompanies(),
      customers: this.getCustomers(),
      invoices: this.getInvoices(),
      tickets: this.getTickets(),
      technicians: this.getTechnicians(),
      settings: this.getSettings(),
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Sumedha_Tech_Infra_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  // Export specific collection as CSV
  exportCustomersCSV(): void {
    const customers = this.getCustomers();
    const headers = ['ID', 'Name', 'Company', 'Contact Person', 'Phone', 'Email', 'City', 'GSTIN', 'AMC Status', 'AMC Expiry', 'Installed Equipment', 'Active Tickets', 'Status'];
    const rows = customers.map(c => [
      c.id,
      `"${c.name.replace(/"/g, '""')}"`,
      `"${c.company.replace(/"/g, '""')}"`,
      `"${c.contactPerson.replace(/"/g, '""')}"`,
      `"${c.phone}"`,
      `"${c.email}"`,
      `"${c.city}"`,
      `"${c.gstin || ''}"`,
      `"${c.amcStatus}"`,
      `"${c.amcExpiryDate}"`,
      c.installedEquipmentCount,
      c.activeTicketsCount,
      `"${c.status || 'active'}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Sumedha_Customers_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  },

  exportInvoicesCSV(): void {
    const invoices = this.getInvoices();
    const headers = ['Invoice Number', 'Issue Date', 'Due Date', 'Customer', 'Company', 'Subtotal', 'Tax Amount', 'Total Amount', 'Paid Amount', 'Balance Due', 'Status'];
    const rows = invoices.map(inv => [
      `"${inv.invoiceNumber || inv.id}"`,
      `"${inv.issuedDate}"`,
      `"${inv.dueDate}"`,
      `"${inv.customerName.replace(/"/g, '""')}"`,
      `"${inv.company.replace(/"/g, '""')}"`,
      inv.amount,
      inv.taxAmount,
      inv.totalAmount,
      inv.paidAmount || 0,
      inv.balanceDue ?? (inv.status === 'Paid' ? 0 : inv.totalAmount),
      `"${inv.status}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Sumedha_Invoices_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  },

  exportCSV(type: 'customers' | 'invoices'): void {
    if (type === 'customers') {
      this.exportCustomersCSV();
    } else {
      this.exportInvoicesCSV();
    }
  },

  // Reset to factory mock data
  resetAllToDefaults(): void {
    localStorage.removeItem(KEYS.COMPANIES);
    localStorage.removeItem(KEYS.CUSTOMERS);
    localStorage.removeItem(KEYS.TICKETS);
    localStorage.removeItem(KEYS.INVOICES);
    localStorage.removeItem(KEYS.TECHNICIANS);
    localStorage.removeItem(KEYS.NOTIFICATIONS);
    localStorage.removeItem(KEYS.SETTINGS);
  },
};
