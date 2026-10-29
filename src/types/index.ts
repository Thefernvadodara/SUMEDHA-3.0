export type EquipmentType =
  | 'cctv_camera'
  | 'nvr_dvr'
  | 'desktop_pc'
  | 'laptop'
  | 'network_printer'
  | 'biometric_punch'
  | 'networking_switch'
  | 'wifi_ap'
  | 'server_rack'
  | 'epabx_system';

export type TicketPriority = 'urgent' | 'high' | 'medium' | 'low';
export type TicketStatus = 'pending' | 'in_progress' | 'solved' | 'on_hold';

export interface ServiceLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  contactPerson: string;
  phone: string;
}

export interface Company {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  billingAddress: string;
  city: string;
  gstin: string;
  pan?: string;
  status: 'active' | 'deactivated';
  serviceLocations: ServiceLocation[];
  notes?: string;
  createdAt: string;
}

// =================== BUYER / CUSTOMER ===================
export interface Customer {
  id: string;
  name: string;
  company: string;
  companyId?: string;
  customerIdCode?: string; // e.g. CUST-001
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  gstin?: string;
  openingBalance?: number;
  creditLimit?: number;
  totalBilled?: number;
  totalReceived?: number;
  outstandingBalance?: number;
  paymentStatus?: 'paid' | 'partial' | 'pending' | 'overdue';
  notes?: string;
  amcStatus: 'Active AMC' | 'Comprehensive AMC' | 'On-Demand' | 'Expired';
  amcExpiryDate: string;
  installedEquipmentCount: number;
  activeTicketsCount: number;
  status?: 'active' | 'archived';
  createdAt?: string;
  updatedAt?: string;
}

// =================== VENDOR / SUPPLIER ===================
export interface Supplier {
  id: string;
  supplierCode: string; // e.g. SUP-001
  name: string;
  company: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  gstin?: string;
  pan?: string;
  productsServicesPurchased: string[];
  openingBalance: number;
  totalPurchased: number;
  totalPaid: number;
  outstandingPayable: number;
  paymentTermsDays?: number;
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    ifsc: string;
    branch: string;
  };
  notes?: string;
  status: 'active' | 'archived';
  createdAt: string;
  updatedAt?: string;
}

export interface SupplierPayment {
  id: string;
  supplierId: string;
  supplierName: string;
  date: string;
  amount: number;
  paymentMethod?: 'UPI' | 'NEFT/RTGS' | 'Cheque' | 'Cash' | 'Card';
  method?: 'UPI' | 'NEFT/RTGS' | 'Cheque' | 'Cash' | 'Card';
  referenceNumber: string;
  notes?: string;
  purchaseInvoiceId?: string;
  recordedBy: string;
  createdAt: string;
}

// =================== INVENTORY & PRODUCT CATALOG ===================
export interface InventoryItem {
  id: string;
  sku: string; // e.g. SKU-CAM-01
  name: string;
  category: EquipmentType | string;
  brand: string;
  model: string;
  description?: string;
  unit: 'Nos' | 'Meters' | 'Sets' | 'Pcs' | 'Boxes';
  costPrice: number; // Purchase price
  sellingPrice: number; // Sale price
  taxPercent: number; // 0, 5, 12, 18, 28
  hsnCode?: string;
  currentStock: number;
  minStockAlert: number;
  location?: string; // warehouse / shelf
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  stockHistory?: StockMovement[];
  createdAt: string;
  updatedAt?: string;
}

export interface StockMovement {
  id: string;
  itemId: string;
  date: string;
  type: 'in' | 'out' | 'adjustment';
  qty: number;
  unitPrice?: number;
  reference: string; // Purchase Inv # or Sales Inv #
  notes?: string;
  recordedBy: string;
}

// =================== PURCHASES ===================
export interface PurchaseLineItem {
  id: string;
  inventoryItemId?: string;
  description: string;
  hsnSac?: string;
  qty: number;
  unitCost: number;
  taxPercent: number;
  taxAmount: number;
  total: number;
}

export interface PurchaseInvoice {
  id: string;
  purchaseNumber: string; // e.g. PUR-2026-001
  supplierId: string;
  supplierName: string;
  supplierGstin?: string;
  billNumber?: string; // Vendor's invoice number
  purchaseDate: string;
  dueDate: string;
  items: PurchaseLineItem[];
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  balanceDue: number;
  paymentStatus: 'paid' | 'partial' | 'unpaid';
  paymentMethod?: string;
  paymentReference?: string;
  notes?: string;
  billUrl?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Technician {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  phone: string;
  email: string;
  activeTasks: number;
  completedThisMonth: number;
  totalTasks: number;
  rating: number; // e.g., 4.9
  completionRate: number; // percentage 0-100
  specializations: EquipmentType[];
  isAvailable: boolean;
}

export interface Ticket {
  id: string;
  title: string;
  customerId: string;
  customerName: string;
  customerCompany: string;
  customerPhone: string;
  location: string;
  equipmentType: EquipmentType;
  equipmentModel: string;
  serialNumber?: string;
  priority: TicketPriority;
  status: TicketStatus;
  technicianId: string;
  technicianName: string;
  technicianAvatar: string;
  createdAt: string;
  scheduledDate: string;
  description: string;
  resolutionNotes?: string;
  billable: boolean;
  estimatedCost?: number;
  slaTimeHours: number;
}

export type DocumentType =
  | 'quotation_without_gst'
  | 'quotation_with_gst'
  | 'invoice_without_gst'
  | 'invoice_with_gst';

export interface InvoiceLineItem {
  id: string;
  inventoryItemId?: string;
  type: 'equipment' | 'spare_parts' | 'labour' | 'amc_service';
  description: string;
  partNumber?: string;
  serialNumbers?: string;
  hsnSac?: string;
  qty: number;
  unitPrice: number;
  discountPercent: number;
  taxPercent: number;
  taxAmount?: number;
  total: number;
}

export interface PaymentRecord {
  id: string;
  date: string;
  amount: number;
  method: 'UPI' | 'NEFT/RTGS' | 'Cheque' | 'Cash' | 'Card';
  referenceNumber?: string;
  notes?: string;
  recordedBy: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  details: string;
}

export interface Invoice {
  id: string;
  docType: DocumentType;
  invoiceNumber: string;
  quoteNumber?: string;
  customerIdCode?: string;
  validUntil?: string;
  ticketId?: string;
  customerId: string;
  customerName: string;
  companyId?: string;
  company: string;
  customerGstin?: string;
  customerAddress?: string;
  customerCity?: string;
  customerPhone?: string;
  amount: number; // Subtotal before tax and discount
  discountTotal?: number;
  taxPercent?: number;
  taxAmount: number;
  taxType?: 'CGST_SGST' | 'IGST' | 'NONE';
  totalAmount: number; // Grand total
  paidAmount?: number;
  balanceDue?: number;
  status: 'Draft' | 'Issued' | 'Paid' | 'Partial' | 'Pending' | 'Overdue' | 'Cancelled' | 'Accepted';
  dueDate: string;
  issuedDate: string;
  items: InvoiceLineItem[];
  payments?: PaymentRecord[];
  auditLogs?: AuditLogEntry[];
  cancellationReason?: string;
  notes?: string;
  terms?: string;
  linkedQuotationId?: string;
  linkedInvoiceId?: string;
}

// =================== COMPANY EXPENSES ===================
export type ExpenseCategory =
  | 'Office Rent'
  | 'Electricity & Utilities'
  | 'Internet & Telephone'
  | 'Fuel & Travel'
  | 'Tools & Field Gear'
  | 'CCTV & Security Equipment'
  | 'IT Equipment & Hardware'
  | 'Repairs & Maintenance'
  | 'Software & Subscriptions'
  | 'Marketing & Branding'
  | 'Transport & Logistics'
  | 'Bank Charges'
  | 'Staff Welfare & Tea'
  | 'Printing & Stationery'
  | 'Miscellaneous';

export interface CompanyExpense {
  id: string;
  expenseNumber: string; // e.g. EXP-2026-001
  category: ExpenseCategory | string;
  description: string;
  vendorSupplier?: string;
  expenseDate: string;
  amount: number;
  taxAmount?: number;
  paymentMethod: 'UPI' | 'Bank Transfer' | 'Cash' | 'Credit Card' | 'Cheque';
  transactionReference?: string;
  receiptUrl?: string;
  isRecurring: boolean;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  createdBy: string;
  modifiedBy?: string;
  createdAt: string;
  notes?: string;
}

// =================== STAFF, SALARY & ATTENDANCE ===================
export interface StaffMember {
  id: string;
  employeeId: string; // e.g. STI-EMP-001
  name: string;
  email: string;
  phone: string;
  department: 'Technical & Engineering' | 'Operations' | 'Billing & Accounts' | 'Management';
  role: string;
  joiningDate: string;
  employmentStatus: 'active' | 'on_leave' | 'resigned' | 'terminated';
  basicSalary: number;
  hra: number;
  allowances: number;
  deductions: number;
  netMonthlySalary: number;
  paymentFrequency: 'Monthly';
  bankDetails: {
    accountName: string;
    accountNumber: string;
    ifsc: string;
    bankName: string;
  };
  totalAdvancesTaken: number;
  outstandingAdvance: number;
  avatarUrl?: string;
  createdAt: string;
}

export interface MonthlySalaryRecord {
  id: string;
  month: string; // e.g. "October 2026"
  year: number;
  staffId: string;
  employeeId: string;
  staffName: string;
  department: string;
  basicSalary: number;
  hra: number;
  allowances: number;
  overtimeBonus: number;
  authorizedDeductions: number;
  advanceDeduction: number;
  grossSalary: number;
  netPayable: number;
  amountPaid: number;
  status: 'paid' | 'partial' | 'pending';
  paymentDate?: string;
  paymentMethod?: 'UPI' | 'Bank Transfer' | 'Cash' | 'Cheque';
  referenceNumber?: string;
  notes?: string;
  generatedDate: string;
}

export interface SalaryAdvance {
  id: string;
  staffId: string;
  staffName: string;
  employeeId: string;
  date: string;
  amount: number;
  reason: string;
  repaidAmount: number;
  balanceRemaining: number;
  status: 'active' | 'settled';
  approvedBy: string;
  createdAt: string;
}

export interface AttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  staffId: string;
  staffName: string;
  status: 'present' | 'absent' | 'half_day' | 'leave';
  checkInTime?: string;
  checkOutTime?: string;
  notes?: string;
}

// =================== AUDIT LOGS ===================
export interface SystemAuditLog {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: string;
  action: 'create' | 'update' | 'delete' | 'archive' | 'approve' | 'login' | 'logout' | 'password_reset' | 'payment';
  entity: 'customer' | 'supplier' | 'invoice' | 'purchase' | 'expense' | 'salary' | 'inventory' | 'staff' | 'settings' | 'auth';
  entityId?: string;
  entityName?: string;
  details: string;
}

// =================== PROFIT & LOSS DATA ===================
export interface ProfitAndLossReport {
  periodLabel: string;
  startDate: string;
  endDate: string;
  totalSales: number;
  discountsAndReturns: number;
  netSales: number;
  costOfGoodsSold: number;
  grossProfit: number;
  grossProfitMargin: number;
  staffSalaryExpenses: number;
  operatingExpenses: number;
  totalOperatingExpenses: number;
  operatingProfit: number;
  netProfit: number;
  netProfitMargin: number;
  accountsReceivable: number; // Customer unpaid balances
  accountsPayable: number; // Supplier unpaid balances
  estimatedOrMissingItemsNote?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'ticket' | 'technician' | 'billing' | 'system' | 'supplier' | 'expense' | 'salary';
  read: boolean;
  ticketId?: string;
}

export type ActiveTab =
  | 'dashboard'
  | 'tasks'
  | 'customers'
  | 'suppliers'
  | 'billing'
  | 'inventory'
  | 'staff'
  | 'expenses'
  | 'profit_loss'
  | 'more';

export type UserRole = 'admin' | 'technician';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
  token: string;
}

export interface StaffAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'Super Admin' | 'Operations Manager' | 'Senior Field Engineer' | 'Billing Specialist';
  permissions: string[];
  active: boolean;
  avatarUrl?: string;
}

export interface CompanyProfile {
  name: string;
  tagline: string;
  contactPerson: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email: string;
  website: string;
  gstin: string;
  pan: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  ifscCode: string;
  branch: string;
  upiId: string;
  logoUrl?: string;
}

export interface BillingConfig {
  invoicePrefix: string;
  nextInvoiceNumber: number;
  quotationPrefix: string;
  nextQuotationNumber: number;
  purchasePrefix?: string;
  nextPurchaseNumber?: number;
  defaultDueDays: number;
  defaultQuotationValidityDays: number;
  currency: string;
  defaultGstRate: number;
  defaultTaxType: 'CGST_SGST' | 'IGST';
  paymentMethods: string[];
  invoiceTerms: string;
  quotationTerms: string;
  quotationWiringNotice: string;
}

export interface SystemSettings {
  companyProfile: CompanyProfile;
  billingConfig: BillingConfig;
  staffAccounts: StaffAccount[];
}
