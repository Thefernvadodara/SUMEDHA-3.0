/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  ActiveTab,
  AttendanceRecord,
  AuthUser,
  Company,
  CompanyExpense,
  Customer,
  DocumentType,
  InventoryItem,
  Invoice,
  MonthlySalaryRecord,
  NotificationItem,
  PaymentRecord,
  PurchaseInvoice,
  SalaryAdvance,
  StaffMember,
  StockMovement,
  Supplier,
  SupplierPayment,
  SystemAuditLog,
  SystemSettings,
  Technician,
  Ticket,
  TicketStatus,
} from './types';
import {
  INITIAL_ATTENDANCE,
  INITIAL_AUDIT_LOGS,
  INITIAL_COMPANIES,
  INITIAL_CUSTOMERS,
  INITIAL_EXPENSES,
  INITIAL_INVENTORY,
  INITIAL_INVOICES,
  INITIAL_NOTIFICATIONS,
  INITIAL_PURCHASES,
  INITIAL_SALARY_ADVANCES,
  INITIAL_SALARY_RECORDS,
  INITIAL_SETTINGS,
  INITIAL_STAFF_MEMBERS,
  INITIAL_SUPPLIER_PAYMENTS,
  INITIAL_SUPPLIERS,
  INITIAL_TECHNICIANS,
  INITIAL_TICKETS,
} from './data/mockData';
import { StorageService } from './services/storage';
import { AuthService } from './services/auth';
import { ApiService } from './services/api';

// Components
import { TopBar } from './components/TopBar';
import { HeroServiceOverview } from './components/HeroServiceOverview';
import { StatsGrid } from './components/StatsGrid';
import { StatusDonutChart } from './components/Charts/StatusDonutChart';
import { WeeklyBarChart } from './components/Charts/WeeklyBarChart';
import { RecentServiceCalls } from './components/RecentServiceCalls';
import { TechnicianPerformance } from './components/TechnicianPerformance';
import { MonthlyBillingOverview } from './components/MonthlyBillingOverview';
import { QuickActions } from './components/QuickActions';
import { BottomNavBar } from './components/BottomNavBar';
import { FloatingActionButton } from './components/FloatingActionButton';

// Views
import { TasksView } from './components/Views/TasksView';
import { CustomersView } from './components/Views/CustomersView';
import { BillingView } from './components/Views/BillingView';
import { MoreView } from './components/Views/MoreView';
import { SuppliersView } from './components/Views/SuppliersView';
import { InventoryView } from './components/Views/InventoryView';
import { StaffView } from './components/Views/StaffView';
import { ExpensesView } from './components/Views/ExpensesView';
import { ProfitLossView } from './components/Views/ProfitLossView';
import { DashboardLoadingSkeleton, ErrorState } from './components/FeedbackStates';

// Modals
import { NewTaskModal } from './components/Modals/NewTaskModal';
import { AddCustomerModal } from './components/Modals/AddCustomerModal';
import { CreateInvoiceModal } from './components/Modals/CreateInvoiceModal';
import { ReportsModal } from './components/Modals/ReportsModal';
import { TicketDetailModal } from './components/Modals/TicketDetailModal';
import { AndroidInstallGuideModal } from './components/Modals/AndroidInstallGuideModal';
import { CompanyModal } from './components/Modals/CompanyModal';
import { CompanyDetailModal } from './components/Modals/CompanyDetailModal';
import { CustomerDetailModal } from './components/Modals/CustomerDetailModal';
import { InvoiceDetailModal } from './components/Modals/InvoiceDetailModal';
import { DeleteConfirmModal } from './components/Modals/DeleteConfirmModal';
import { SupplierModal } from './components/Modals/SupplierModal';
import { SupplierPaymentModal } from './components/Modals/SupplierPaymentModal';
import { InventoryItemModal } from './components/Modals/InventoryItemModal';
import { StockAdjustmentModal } from './components/Modals/StockAdjustmentModal';
import { ExpenseModal } from './components/Modals/ExpenseModal';
import { StaffModal } from './components/Modals/StaffModal';
import { SalaryProcessModal } from './components/Modals/SalaryProcessModal';
import { SalaryAdvanceModal } from './components/Modals/SalaryAdvanceModal';
import { AuditLogsModal } from './components/Modals/AuditLogsModal';

// Auth Screen
import { LoginScreen } from './components/Auth/LoginScreen';

// PWA
import { OfflineIndicator } from './components/PWA/OfflineIndicator';

export default function App() {
  // Authentication & Session state
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() =>
    AuthService.getCurrentSession()
  );

  // Persistent Application Data States
  const [companies, setCompanies] = useState<Company[]>(() => StorageService.getCompanies());
  const [customers, setCustomers] = useState<Customer[]>(() => StorageService.getCustomers());
  const [tickets, setTickets] = useState<Ticket[]>(() => StorageService.getTickets());
  const [invoices, setInvoices] = useState<Invoice[]>(() => StorageService.getInvoices());
  const [technicians, setTechnicians] = useState<Technician[]>(() => StorageService.getTechnicians());
  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    StorageService.getNotifications()
  );
  const [settings, setSettings] = useState<SystemSettings>(() => StorageService.getSettings());

  // Business Modules Data States
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => INITIAL_SUPPLIERS);
  const [supplierPayments, setSupplierPayments] = useState<SupplierPayment[]>(() => INITIAL_SUPPLIER_PAYMENTS);
  const [inventory, setInventory] = useState<InventoryItem[]>(() => INITIAL_INVENTORY);
  const [purchases, setPurchases] = useState<PurchaseInvoice[]>(() => INITIAL_PURCHASES);
  const [expenses, setExpenses] = useState<CompanyExpense[]>(() => INITIAL_EXPENSES);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>(() => INITIAL_STAFF_MEMBERS);
  const [salaryRecords, setSalaryRecords] = useState<MonthlySalaryRecord[]>(() => INITIAL_SALARY_RECORDS);
  const [salaryAdvances, setSalaryAdvances] = useState<SalaryAdvance[]>(() => INITIAL_SALARY_ADVANCES);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => INITIAL_ATTENDANCE);
  const [auditLogs, setAuditLogs] = useState<SystemAuditLog[]>(() => INITIAL_AUDIT_LOGS);
  const [isRealtimeConnected, setIsRealtimeConnected] = useState(true);

  // Additional Modals State
  const [supplierModalState, setSupplierModalState] = useState<{
    isOpen: boolean;
    existingSupplier: Supplier | null;
  }>({ isOpen: false, existingSupplier: null });

  const [supplierPaymentModalState, setSupplierPaymentModalState] = useState<{
    isOpen: boolean;
    supplier: Supplier | null;
  }>({ isOpen: false, supplier: null });

  const [inventoryItemModalState, setInventoryItemModalState] = useState<{
    isOpen: boolean;
    existingItem: InventoryItem | null;
  }>({ isOpen: false, existingItem: null });

  const [stockAdjustmentModalState, setStockAdjustmentModalState] = useState<{
    isOpen: boolean;
    item: InventoryItem | null;
  }>({ isOpen: false, item: null });

  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  const [staffModalState, setStaffModalState] = useState<{
    isOpen: boolean;
    existingStaff: StaffMember | null;
  }>({ isOpen: false, existingStaff: null });

  const [salaryProcessModalState, setSalaryProcessModalState] = useState<{
    isOpen: boolean;
    staff: StaffMember | null;
  }>({ isOpen: false, staff: null });

  const [salaryAdvanceModalState, setSalaryAdvanceModalState] = useState<{
    isOpen: boolean;
    staff: StaffMember | null;
  }>({ isOpen: false, staff: null });

  const [isAuditLogsModalOpen, setIsAuditLogsModalOpen] = useState(false);

  // Navigation & Viewport Mode
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [deviceView, setDeviceView] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [selectedFilter, setSelectedFilter] = useState<TicketStatus | 'all' | null>(null);

  // Operational Modals
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isCreateInvoiceOpen, setIsCreateInvoiceOpen] = useState(false);
  const [initialDocTypeForCreate, setInitialDocTypeForCreate] = useState<DocumentType>('invoice_with_gst');
  const [preselectedInvoiceCustId, setPreselectedInvoiceCustId] = useState<string | undefined>(undefined);
  const [isReportsOpen, setIsReportsOpen] = useState(false);
  const [activeTicketDetail, setActiveTicketDetail] = useState<Ticket | null>(null);
  const [isInstallGuideOpen, setIsInstallGuideOpen] = useState(false);

  // Enhanced Management Modals
  const [activeCustomerDetail, setActiveCustomerDetail] = useState<Customer | null>(null);
  const [activeCompanyDetail, setActiveCompanyDetail] = useState<Company | null>(null);
  const [activeInvoiceDetail, setActiveInvoiceDetail] = useState<Invoice | null>(null);
  const [companyModalState, setCompanyModalState] = useState<{
    isOpen: boolean;
    existingCompany: Company | null;
  }>({ isOpen: false, existingCompany: null });

  // Delete Confirmation Modal State
  const [deleteConfirmState, setDeleteConfirmState] = useState<{
    isOpen: boolean;
    title: string;
    itemName: string;
    itemType: 'customer' | 'company' | 'invoice' | 'staff' | 'task';
    linkedCounts?: { tickets?: number; invoices?: number; customers?: number };
    onConfirmDelete: () => void;
    onConfirmArchive?: () => void;
    isArchived?: boolean;
  }>({
    isOpen: false,
    title: '',
    itemName: '',
    itemType: 'customer',
    onConfirmDelete: () => {},
  });

  // Feedback States (loading & error simulators)
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // -------------------------------------------------------------
  // AUTHENTICATION HANDLERS
  // -------------------------------------------------------------
  const handleLogout = () => {
    AuthService.logout();
    setCurrentUser(null);
    showToast('Session ended. You have been logged out.');
  };

  // -------------------------------------------------------------
  // REAL-TIME MULTI-DEVICE SYNCHRONIZATION (SSE & REST)
  // -------------------------------------------------------------
  useEffect(() => {
    // 1. Initial State Fetch from full-stack backend
    ApiService.fetchFullState()
      .then((state) => {
        if (state.companies?.length) {
          setCompanies(state.companies);
          StorageService.saveCompanies(state.companies);
        }
        if (state.customers?.length) {
          setCustomers(state.customers);
          StorageService.saveCustomers(state.customers);
        }
        if (state.tickets?.length) {
          setTickets(state.tickets);
          StorageService.saveTickets(state.tickets);
        }
        if (state.invoices?.length) {
          setInvoices(state.invoices);
          StorageService.saveInvoices(state.invoices);
        }
        if (state.suppliers?.length) setSuppliers(state.suppliers);
        if (state.supplierPayments?.length) setSupplierPayments(state.supplierPayments);
        if (state.inventory?.length) setInventory(state.inventory);
        if (state.purchases?.length) setPurchases(state.purchases);
        if (state.expenses?.length) setExpenses(state.expenses);
        if (state.staffMembers?.length) setStaffMembers(state.staffMembers);
        if (state.salaryRecords?.length) setSalaryRecords(state.salaryRecords);
        if (state.salaryAdvances?.length) setSalaryAdvances(state.salaryAdvances);
        if (state.attendance?.length) setAttendance(state.attendance);
        if (state.auditLogs?.length) setAuditLogs(state.auditLogs);
      })
      .catch((err: any) => {
        console.warn('Backend server connecting, fallback to local storage:', err);
      });

    // 2. Real-time Event Subscription across browser sessions
    const unsubscribe = ApiService.subscribeToEvents((event) => {
      setIsRealtimeConnected(true);
      if (event.type === 'CUSTOMER_CREATED' || event.type === 'CUSTOMER_UPDATED') {
        setCustomers((prev) => {
          const exists = prev.some((c) => c.id === event.payload.id);
          const updated = exists
            ? prev.map((c) => (c.id === event.payload.id ? event.payload : c))
            : [event.payload, ...prev];
          StorageService.saveCustomers(updated);
          return updated;
        });
      } else if (event.type === 'SUPPLIER_CREATED' || event.type === 'SUPPLIER_UPDATED') {
        setSuppliers((prev) => {
          const exists = prev.some((s) => s.id === event.payload.id);
          return exists
            ? prev.map((s) => (s.id === event.payload.id ? event.payload : s))
            : [event.payload, ...prev];
        });
      } else if (event.type === 'SUPPLIER_PAYMENT_RECORDED') {
        setSupplierPayments((prev) => [event.payload, ...prev]);
        setSuppliers((prev) =>
          prev.map((s) =>
            s.id === event.payload.supplierId
              ? {
                  ...s,
                  totalPaid: (s.totalPaid || 0) + event.payload.amount,
                  outstandingPayable: Math.max(0, (s.outstandingPayable || 0) - event.payload.amount),
                }
              : s
          )
        );
      } else if (event.type === 'INVOICE_CREATED' || event.type === 'INVOICE_UPDATED') {
        setInvoices((prev) => {
          const exists = prev.some((i) => i.id === event.payload.id);
          const updated = exists
            ? prev.map((i) => (i.id === event.payload.id ? event.payload : i))
            : [event.payload, ...prev];
          StorageService.saveInvoices(updated);
          return updated;
        });
      } else if (event.type === 'INVENTORY_UPDATED') {
        setInventory((prev) => {
          const exists = prev.some((i) => i.id === event.payload.id);
          return exists
            ? prev.map((i) => (i.id === event.payload.id ? event.payload : i))
            : [event.payload, ...prev];
        });
      } else if (event.type === 'EXPENSE_CREATED' || event.type === 'EXPENSE_UPDATED') {
        setExpenses((prev) => {
          const exists = prev.some((e) => e.id === event.payload.id);
          return exists
            ? prev.map((e) => (e.id === event.payload.id ? event.payload : e))
            : [event.payload, ...prev];
        });
      } else if (event.type === 'STAFF_UPDATED') {
        setStaffMembers((prev) => {
          const exists = prev.some((s) => s.id === event.payload.id);
          return exists
            ? prev.map((s) => (s.id === event.payload.id ? event.payload : s))
            : [event.payload, ...prev];
        });
      } else if (event.type === 'SALARY_PROCESSED') {
        setSalaryRecords((prev) => [event.payload, ...prev]);
      } else if (event.type === 'ADVANCE_RECORDED') {
        setSalaryAdvances((prev) => [event.payload, ...prev]);
        setStaffMembers((prev) =>
          prev.map((s) =>
            s.id === event.payload.staffId
              ? { ...s, outstandingAdvance: (s.outstandingAdvance || 0) + event.payload.amount }
              : s
          )
        );
      } else if (event.type === 'FULL_RESYNC') {
        if (event.payload.customers) setCustomers(event.payload.customers);
        if (event.payload.suppliers) setSuppliers(event.payload.suppliers);
        if (event.payload.invoices) setInvoices(event.payload.invoices);
        if (event.payload.inventory) setInventory(event.payload.inventory);
        if (event.payload.expenses) setExpenses(event.payload.expenses);
        if (event.payload.staffMembers) setStaffMembers(event.payload.staffMembers);
        if (event.payload.salaryRecords) setSalaryRecords(event.payload.salaryRecords);
        if (event.payload.salaryAdvances) setSalaryAdvances(event.payload.salaryAdvances);
        if (event.payload.attendance) setAttendance(event.payload.attendance);
        if (event.payload.auditLogs) setAuditLogs(event.payload.auditLogs);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // -------------------------------------------------------------
  // SUPPLIER / VENDOR HANDLERS
  // -------------------------------------------------------------
  const handleSaveSupplier = async (supplierData: Partial<Supplier>) => {
    let saved: Supplier;
    if (supplierModalState.existingSupplier) {
      saved = {
        ...supplierModalState.existingSupplier,
        ...supplierData,
      } as Supplier;
      setSuppliers((prev) => prev.map((s) => (s.id === saved.id ? saved : s)));
      showToast(`Supplier "${saved.name}" updated successfully.`);
      await ApiService.updateSupplier(saved.id, saved).catch(console.error);
    } else {
      saved = {
        id: `supp-${Date.now()}`,
        name: supplierData.name || 'New Supplier',
        company: supplierData.company || 'Enterprise Vendor',
        supplierCode: supplierData.supplierCode || `SUP-${Math.floor(100 + Math.random() * 900)}`,
        contactPerson: supplierData.contactPerson || 'Vendor Rep',
        phone: supplierData.phone || '+91 98000 00000',
        email: supplierData.email || 'vendor@domain.com',
        address: supplierData.address || 'Vendor Address',
        city: supplierData.city || 'Vadodara',
        gstin: supplierData.gstin,
        pan: supplierData.pan,
        bankDetails: supplierData.bankDetails,
        productsServicesPurchased: supplierData.productsServicesPurchased || ['CCTV & IT Hardware'],
        openingBalance: supplierData.openingBalance || 0,
        totalPurchased: 0,
        totalPaid: 0,
        outstandingPayable: supplierData.outstandingPayable || 0,
        paymentTermsDays: supplierData.paymentTermsDays || 30,
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0],
      };
      setSuppliers((prev) => [saved, ...prev]);
      showToast(`Supplier "${saved.name}" registered successfully.`);
      await ApiService.createSupplier(saved).catch(console.error);
    }
    setSupplierModalState({ isOpen: false, existingSupplier: null });
  };

  const handleRecordSupplierPayment = async (data: {
    supplierId: string;
    amount: number;
    method: string;
    referenceNumber: string;
    notes?: string;
    purchaseInvoiceId?: string;
  }) => {
    const targetSup = suppliers.find((s) => s.id === data.supplierId);
    const payment: SupplierPayment = {
      id: `spay-${Date.now()}`,
      supplierId: data.supplierId,
      supplierName: targetSup?.name || 'Vendor',
      purchaseInvoiceId: data.purchaseInvoiceId,
      amount: data.amount,
      date: new Date().toISOString().split('T')[0],
      paymentMethod: data.method as any,
      method: data.method as any,
      referenceNumber: data.referenceNumber,
      notes: data.notes,
      recordedBy: currentUser?.name || 'Administrator',
      createdAt: new Date().toISOString(),
    };
    setSupplierPayments((prev) => [payment, ...prev]);
    setSuppliers((prev) =>
      prev.map((s) =>
        s.id === data.supplierId
          ? {
              ...s,
              totalPaid: (s.totalPaid || 0) + data.amount,
              outstandingPayable: Math.max(0, (s.outstandingPayable || 0) - data.amount),
            }
          : s
      )
    );
    setSupplierPaymentModalState({ isOpen: false, supplier: null });
    showToast(`Payment of ₹${data.amount.toLocaleString('en-IN')} paid to supplier.`);
    await ApiService.recordSupplierPayment(data.supplierId, data).catch(console.error);
  };

  const handleArchiveSupplier = async (supplierId: string) => {
    setSuppliers((prev) =>
      prev.map((s) =>
        s.id === supplierId
          ? { ...s, status: s.status === 'active' ? 'archived' : 'active' }
          : s
      )
    );
    showToast('Supplier status updated.');
    await ApiService.archiveSupplier(supplierId).catch(console.error);
  };

  // -------------------------------------------------------------
  // INVENTORY & STOCK HANDLERS
  // -------------------------------------------------------------
  const handleSaveInventoryItem = async (itemData: Partial<InventoryItem>) => {
    let saved: InventoryItem;
    if (inventoryItemModalState.existingItem) {
      saved = {
        ...inventoryItemModalState.existingItem,
        ...itemData,
      } as InventoryItem;
      setInventory((prev) => prev.map((item) => (item.id === saved.id ? saved : item)));
      showToast(`Item "${saved.name}" updated.`);
      await ApiService.updateInventoryItem(saved.id, saved).catch(console.error);
    } else {
      saved = {
        id: `inv-item-${Date.now()}`,
        name: itemData.name || 'New Hardware Product',
        sku: itemData.sku || `SKU-${Date.now().toString().slice(-4)}`,
        category: itemData.category || 'cctv_camera',
        brand: itemData.brand || 'Generic',
        model: itemData.model || '',
        description: itemData.description || '',
        unit: itemData.unit || 'Nos',
        costPrice: itemData.costPrice || 0,
        sellingPrice: itemData.sellingPrice || 0,
        taxPercent: itemData.taxPercent || 18,
        currentStock: itemData.currentStock || 0,
        minStockAlert: itemData.minStockAlert || 5,
        location: itemData.location || 'Main Warehouse',
        hsnCode: itemData.hsnCode || '8525',
        status: (itemData.currentStock || 0) <= 0 ? 'out_of_stock' : (itemData.currentStock || 0) <= (itemData.minStockAlert || 5) ? 'low_stock' : 'in_stock',
        stockHistory: [],
        createdAt: new Date().toISOString().split('T')[0],
      };
      setInventory((prev) => [saved, ...prev]);
      showToast(`Item "${saved.name}" added to catalog.`);
      await ApiService.createInventoryItem(saved).catch(console.error);
    }
    setInventoryItemModalState({ isOpen: false, existingItem: null });
  };

  const handleStockAdjustment = async (
    itemId: string,
    data: { type: 'in' | 'out' | 'adjustment'; qty: number; reference?: string; notes?: string }
  ) => {
    const item = inventory.find((i) => i.id === itemId);
    if (!item) return;

    let newQty = item.currentStock;
    if (data.type === 'in') newQty += data.qty;
    else if (data.type === 'out') newQty = Math.max(0, newQty - data.qty);
    else newQty = data.qty;

    const movement: StockMovement = {
      id: `mov-${Date.now()}`,
      itemId,
      date: new Date().toISOString().split('T')[0],
      type: data.type,
      qty: data.qty,
      reference: data.reference || 'Manual Adjustment',
      notes: data.notes,
      recordedBy: currentUser?.name || 'Administrator',
    };

    setInventory((prev) =>
      prev.map((i) =>
        i.id === itemId
          ? {
              ...i,
              currentStock: newQty,
              stockHistory: [...(i.stockHistory || []), movement],
            }
          : i
      )
    );
    setStockAdjustmentModalState({ isOpen: false, item: null });
    showToast(`Stock updated for ${item.name} (New Qty: ${newQty}).`);
    await ApiService.adjustStock(itemId, data).catch(console.error);
  };

  // -------------------------------------------------------------
  // OPERATING EXPENSES HANDLERS
  // -------------------------------------------------------------
  const handleSaveExpense = async (expenseData: Partial<CompanyExpense>) => {
    const newExpense: CompanyExpense = {
      id: `exp-${Date.now()}`,
      expenseNumber: `EXP-${Date.now().toString().slice(-4)}`,
      category: expenseData.category || 'Office Supplies',
      description: expenseData.description || 'Company expense',
      vendorSupplier: expenseData.vendorSupplier,
      amount: expenseData.amount || 0,
      taxAmount: expenseData.taxAmount || 0,
      expenseDate: expenseData.expenseDate || new Date().toISOString().split('T')[0],
      paymentMethod: expenseData.paymentMethod || 'UPI',
      transactionReference: expenseData.transactionReference,
      isRecurring: false,
      approvalStatus: currentUser?.role === 'admin' ? 'approved' : 'pending',
      approvedBy: currentUser?.role === 'admin' ? currentUser.name : undefined,
      createdBy: currentUser?.name || 'Administrator',
      notes: expenseData.notes,
      createdAt: new Date().toISOString(),
    };

    setExpenses((prev) => [newExpense, ...prev]);
    setIsExpenseModalOpen(false);
    showToast(`Expense of ₹${newExpense.amount.toLocaleString('en-IN')} recorded.`);
    await ApiService.createExpense(newExpense).catch(console.error);
  };

  const handleApproveExpense = async (id: string, status: 'approved' | 'rejected') => {
    setExpenses((prev) =>
      prev.map((e) =>
        e.id === id
          ? {
              ...e,
              approvalStatus: status,
              approvedBy: currentUser?.name || 'Super Admin',
            }
          : e
      )
    );
    showToast(`Expense ${status}.`);
    await ApiService.approveExpense(id, status).catch(console.error);
  };

  const handleDeleteExpense = async (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    showToast('Expense record removed.');
    await ApiService.deleteExpense(id).catch(console.error);
  };

  // -------------------------------------------------------------
  // STAFF, SALARY & ADVANCE HANDLERS
  // -------------------------------------------------------------
  const handleSaveStaff = async (staffData: Partial<StaffMember>) => {
    let saved: StaffMember;
    if (staffModalState.existingStaff) {
      saved = {
        ...staffModalState.existingStaff,
        ...staffData,
      } as StaffMember;
      setStaffMembers((prev) => prev.map((s) => (s.id === saved.id ? saved : s)));
      showToast(`Staff member "${saved.name}" updated.`);
      await ApiService.updateStaff(saved.id, saved).catch(console.error);
    } else {
      const basic = staffData.basicSalary || 25000;
      const hra = staffData.hra || 5000;
      const allow = staffData.allowances || 3000;
      const deduct = staffData.deductions || 2250;
      saved = {
        id: `staff-${Date.now()}`,
        name: staffData.name || 'New Staff Member',
        employeeId: staffData.employeeId || `STI-EMP-${Math.floor(100 + Math.random() * 900)}`,
        phone: staffData.phone || '+91 98000 00000',
        email: staffData.email || 'staff@sumedhatech.in',
        department: staffData.department || 'Technical & Engineering',
        role: staffData.role || 'Service Technician',
        joiningDate: staffData.joiningDate || new Date().toISOString().split('T')[0],
        employmentStatus: 'active',
        basicSalary: basic,
        hra,
        allowances: allow,
        deductions: deduct,
        netMonthlySalary: basic + hra + allow - deduct,
        paymentFrequency: 'Monthly',
        bankDetails: staffData.bankDetails || {
          accountName: staffData.name || 'Staff Member',
          accountNumber: '998877665544',
          ifsc: 'HDFC0001234',
          bankName: 'HDFC Bank',
        },
        totalAdvancesTaken: 0,
        outstandingAdvance: 0,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setStaffMembers((prev) => [saved, ...prev]);
      showToast(`Staff member "${saved.name}" registered.`);
      await ApiService.createStaff(saved).catch(console.error);
    }
    setStaffModalState({ isOpen: false, existingStaff: null });
  };

  const handleProcessSalary = async (salaryData: Partial<MonthlySalaryRecord>) => {
    const staff = staffMembers.find((s) => s.id === salaryData.staffId);
    if (!staff) return;

    const basicSalary = salaryData.basicSalary || staff.basicSalary;
    const hra = salaryData.hra || staff.hra;
    const allowances = salaryData.allowances || staff.allowances;
    const overtimeBonus = salaryData.overtimeBonus || 0;
    const authorizedDeductions = salaryData.authorizedDeductions || staff.deductions;
    const advanceDeduction = salaryData.advanceDeduction || 0;
    const grossSalary = basicSalary + hra + allowances + overtimeBonus;
    const netPayable = Math.max(0, grossSalary - authorizedDeductions - advanceDeduction);

    const record: MonthlySalaryRecord = {
      id: `sal-${Date.now()}`,
      staffId: staff.id,
      staffName: staff.name,
      employeeId: staff.employeeId,
      department: staff.department,
      month: salaryData.month || 'October 2026',
      year: salaryData.year || 2026,
      basicSalary,
      hra,
      allowances,
      overtimeBonus,
      authorizedDeductions,
      advanceDeduction,
      grossSalary,
      netPayable,
      amountPaid: netPayable,
      status: 'paid',
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: salaryData.paymentMethod || 'Bank Transfer',
      referenceNumber: salaryData.referenceNumber || `NEFT-${Date.now().toString().slice(-6)}`,
      notes: salaryData.notes,
      generatedDate: new Date().toISOString().split('T')[0],
    };

    setSalaryRecords((prev) => [record, ...prev]);

    // If advance deduction was applied, reduce the staff member's outstanding advance balance
    if (advanceDeduction > 0) {
      setStaffMembers((prev) =>
        prev.map((s) =>
          s.id === staff.id
            ? {
                ...s,
                outstandingAdvance: Math.max(0, (s.outstandingAdvance || 0) - advanceDeduction),
              }
            : s
        )
      );
    }

    setSalaryProcessModalState({ isOpen: false, staff: null });
    showToast(`Salary slip generated for ${staff.name} (Net: ₹${record.netPayable.toLocaleString('en-IN')}).`);
    await ApiService.processSalary(record).catch(console.error);
  };

  const handleRecordAdvance = async (data: { staffId: string; amount: number; reason: string }) => {
    const staff = staffMembers.find((s) => s.id === data.staffId);
    if (!staff) return;

    const advance: SalaryAdvance = {
      id: `adv-${Date.now()}`,
      staffId: data.staffId,
      staffName: staff.name,
      employeeId: staff.employeeId,
      amount: data.amount,
      date: new Date().toISOString().split('T')[0],
      reason: data.reason,
      repaidAmount: 0,
      balanceRemaining: data.amount,
      status: 'active',
      approvedBy: currentUser?.name || 'Administrator',
      createdAt: new Date().toISOString(),
    };

    setSalaryAdvances((prev) => [advance, ...prev]);
    setStaffMembers((prev) =>
      prev.map((s) =>
        s.id === data.staffId
          ? {
              ...s,
              totalAdvancesTaken: (s.totalAdvancesTaken || 0) + data.amount,
              outstandingAdvance: (s.outstandingAdvance || 0) + data.amount,
            }
          : s
      )
    );
    setSalaryAdvanceModalState({ isOpen: false, staff: null });
    showToast(`Salary advance of ₹${data.amount.toLocaleString('en-IN')} issued to ${staff.name}.`);
    await ApiService.recordAdvance(data).catch(console.error);
  };

  const handleSaveAttendance = async (date: string, records: any[]) => {
    const newRecords: AttendanceRecord[] = records.map((r, idx) => {
      const staff = staffMembers.find((s) => s.id === r.staffId);
      return {
        id: `att-${Date.now()}-${idx}`,
        staffId: r.staffId,
        staffName: staff?.name || 'Staff Member',
        date,
        status: r.status,
        checkInTime: r.checkInTime,
        checkOutTime: r.checkOutTime,
        notes: r.notes,
      };
    });
    setAttendance((prev) => [...newRecords, ...prev.filter((a) => a.date !== date)]);
    showToast(`Attendance for ${date} recorded.`);
    await ApiService.saveAttendance(date, newRecords).catch(console.error);
  };

  // -------------------------------------------------------------
  // CUSTOMER MANAGEMENT HANDLERS
  // -------------------------------------------------------------
  const handleSaveCustomer = (custData: Partial<Customer>) => {
    let updatedList: Customer[];

    if (editingCustomer) {
      updatedList = customers.map((c) =>
        c.id === editingCustomer.id ? ({ ...c, ...custData } as Customer) : c
      );
      showToast(`Client "${custData.name}" updated successfully.`);
    } else {
      const newCust: Customer = {
        id: `cust-${Date.now()}`,
        name: custData.name || 'New Client',
        company: custData.company || 'Enterprise Entity',
        companyId: custData.companyId,
        customerIdCode: custData.customerIdCode || `CUST-${Math.floor(1000 + Math.random() * 9000)}`,
        contactPerson: custData.contactPerson || 'Authorized Contact',
        phone: custData.phone || '+91 98000 00000',
        email: custData.email || 'client@domain.com',
        address: custData.address || 'Facility Site',
        city: custData.city || 'Vadodara',
        gstin: custData.gstin,
        notes: custData.notes,
        amcStatus: custData.amcStatus || 'On-Demand',
        amcExpiryDate: custData.amcExpiryDate || '2027-12-31',
        installedEquipmentCount: custData.installedEquipmentCount || 0,
        activeTicketsCount: 0,
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0],
      };
      updatedList = [newCust, ...customers];
      showToast(`Client "${newCust.name}" registered successfully.`);
    }

    setCustomers(updatedList);
    StorageService.saveCustomers(updatedList);
    setIsAddCustomerOpen(false);
    setEditingCustomer(null);

    const savedTarget = editingCustomer
      ? updatedList.find((c) => c.id === editingCustomer.id)
      : updatedList[0];
    if (savedTarget) {
      if (editingCustomer) {
        ApiService.updateCustomer(editingCustomer.id, savedTarget).catch(console.error);
      } else {
        ApiService.createCustomer(savedTarget).catch(console.error);
      }
    }

    if (activeCustomerDetail && editingCustomer && activeCustomerDetail.id === editingCustomer.id) {
      setActiveCustomerDetail({ ...activeCustomerDetail, ...custData } as Customer);
    }
  };

  const handleDeleteCustomerPrompt = (cust: Customer) => {
    const linkedTicketsCount = tickets.filter((t) => t.customerId === cust.id).length;
    const linkedInvoicesCount = invoices.filter((i) => i.customerId === cust.id).length;

    setDeleteConfirmState({
      isOpen: true,
      title: 'Delete Customer Account',
      itemName: cust.name,
      itemType: 'customer',
      linkedCounts: {
        tickets: linkedTicketsCount,
        invoices: linkedInvoicesCount,
      },
      isArchived: cust.status === 'archived',
      onConfirmArchive: () => {
        const newStatus: 'active' | 'archived' = cust.status === 'archived' ? 'active' : 'archived';
        const updated = customers.map((c) => (c.id === cust.id ? { ...c, status: newStatus } : c));
        setCustomers(updated);
        StorageService.saveCustomers(updated);
        if (activeCustomerDetail && activeCustomerDetail.id === cust.id) {
          setActiveCustomerDetail({ ...cust, status: newStatus });
        }
        showToast(`Client ${cust.name} marked as ${newStatus}.`);
      },
      onConfirmDelete: () => {
        const updated = customers.filter((c) => c.id !== cust.id);
        setCustomers(updated);
        StorageService.saveCustomers(updated);
        if (activeCustomerDetail && activeCustomerDetail.id === cust.id) {
          setActiveCustomerDetail(null);
        }
        showToast(`Client "${cust.name}" deleted permanently.`);
      },
    });
  };

  // -------------------------------------------------------------
  // COMPANY MANAGEMENT HANDLERS
  // -------------------------------------------------------------
  const handleSaveCompany = (companyData: Partial<Company>) => {
    let updated: Company[];
    if (companyModalState.existingCompany) {
      updated = companies.map((c) =>
        c.id === companyModalState.existingCompany?.id ? ({ ...c, ...companyData } as Company) : c
      );
      showToast(`Company "${companyData.name}" updated successfully.`);
    } else {
      const newComp: Company = {
        id: `comp-${Date.now()}`,
        name: companyData.name || 'New Company',
        contactPerson: companyData.contactPerson || '',
        phone: companyData.phone || '',
        email: companyData.email || '',
        billingAddress: companyData.billingAddress || '',
        city: companyData.city || 'Vadodara',
        gstin: companyData.gstin || '',
        pan: companyData.pan,
        status: 'active',
        serviceLocations: companyData.serviceLocations || [],
        notes: companyData.notes,
        createdAt: new Date().toISOString().split('T')[0],
      };
      updated = [newComp, ...companies];
      showToast(`Company "${newComp.name}" registered successfully.`);
    }

    setCompanies(updated);
    StorageService.saveCompanies(updated);
    setCompanyModalState({ isOpen: false, existingCompany: null });

    if (activeCompanyDetail && companyModalState.existingCompany && activeCompanyDetail.id === companyModalState.existingCompany.id) {
      setActiveCompanyDetail({ ...activeCompanyDetail, ...companyData } as Company);
    }
  };

  const handleToggleCompanyStatus = (companyId: string) => {
    const updated = companies.map((c) =>
      c.id === companyId
        ? { ...c, status: (c.status === 'active' ? 'deactivated' : 'active') as 'active' | 'deactivated' }
        : c
    );
    setCompanies(updated);
    StorageService.saveCompanies(updated);
    const target = updated.find((c) => c.id === companyId);
    showToast(`Company "${target?.name}" is now ${target?.status}.`);
  };

  const handleDeleteCompanyPrompt = (comp: Company) => {
    const linkedCusts = customers.filter(
      (c) => c.companyId === comp.id || c.company.toLowerCase() === comp.name.toLowerCase()
    ).length;

    setDeleteConfirmState({
      isOpen: true,
      title: 'Delete Customer Company',
      itemName: comp.name,
      itemType: 'company',
      linkedCounts: {
        customers: linkedCusts,
      },
      isArchived: comp.status === 'deactivated',
      onConfirmArchive: () => {
        handleToggleCompanyStatus(comp.id);
      },
      onConfirmDelete: () => {
        const updated = companies.filter((c) => c.id !== comp.id);
        setCompanies(updated);
        StorageService.saveCompanies(updated);
        if (activeCompanyDetail && activeCompanyDetail.id === comp.id) {
          setActiveCompanyDetail(null);
        }
        showToast(`Company "${comp.name}" removed.`);
      },
    });
  };

  // -------------------------------------------------------------
  // INVOICE & QUOTATION BILLING HANDLERS
  // -------------------------------------------------------------
  const handleOpenCreateDocument = (type?: DocumentType) => {
    if (currentUser?.role !== 'admin') {
      showToast('Admin authorization required to create invoices and quotations.');
      return;
    }
    setInitialDocTypeForCreate(type || 'invoice_with_gst');
    setPreselectedInvoiceCustId(undefined);
    setIsCreateInvoiceOpen(true);
  };

  const handleCreateInvoice = (newInvoice: Invoice) => {
    const isQuote =
      newInvoice.docType === 'quotation_without_gst' ||
      newInvoice.docType === 'quotation_with_gst';

    let updatedSettings = settings;
    if (isQuote) {
      const nextQ = (settings.billingConfig.nextQuotationNumber || 1) + 1;
      updatedSettings = {
        ...settings,
        billingConfig: { ...settings.billingConfig, nextQuotationNumber: nextQ },
      };
    } else {
      const nextI = (settings.billingConfig.nextInvoiceNumber || 1) + 1;
      updatedSettings = {
        ...settings,
        billingConfig: { ...settings.billingConfig, nextInvoiceNumber: nextI },
      };
    }

    const updated = [newInvoice, ...invoices];
    setInvoices(updated);
    StorageService.saveInvoices(updated);
    setSettings(updatedSettings);
    StorageService.saveSettings(updatedSettings);
    ApiService.createInvoice(newInvoice).catch(console.error);

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `${isQuote ? 'Quotation' : 'Invoice'} Generated #${newInvoice.invoiceNumber || newInvoice.quoteNumber || newInvoice.id}`,
      message: `${isQuote ? 'Price proposal' : 'Tax invoice'} of ₹${newInvoice.totalAmount.toLocaleString('en-IN')} issued to ${newInvoice.customerName}.`,
      time: 'Just now',
      type: 'billing',
      read: false,
    };
    const updatedNotifs = [newNotif, ...notifications];
    setNotifications(updatedNotifs);
    StorageService.saveNotifications(updatedNotifs);

    showToast(
      `${isQuote ? 'Quotation' : 'Invoice'} #${newInvoice.invoiceNumber || newInvoice.quoteNumber || newInvoice.id} generated!`
    );
  };

  const handleConvertToInvoice = (
    quotation: Invoice,
    targetDocType: 'invoice_with_gst' | 'invoice_without_gst'
  ) => {
    if (currentUser?.role !== 'admin') {
      showToast('Admin authorization required to convert quotation to invoice.');
      return;
    }

    const nextInvNum = settings.billingConfig.nextInvoiceNumber || 2;
    const newInvoiceNumber = `${settings.billingConfig.invoicePrefix || '11/10/2026-'}${nextInvNum}`;

    const newInvoice: Invoice = {
      ...quotation,
      id: `inv-${Date.now()}`,
      docType: targetDocType,
      invoiceNumber: newInvoiceNumber,
      quoteNumber: quotation.invoiceNumber || quotation.quoteNumber,
      linkedQuotationId: quotation.invoiceNumber || quotation.quoteNumber || quotation.id,
      issuedDate: new Date().toLocaleDateString('en-GB'),
      dueDate: new Date(Date.now() + (settings.billingConfig.defaultDueDays || 15) * 86400000)
        .toLocaleDateString('en-GB'),
      status: 'Pending',
      paidAmount: 0,
      balanceDue: quotation.totalAmount,
      terms: settings.billingConfig.invoiceTerms,
      auditLogs: [
        {
          id: `audit-${Date.now()}`,
          timestamp: new Date().toISOString(),
          action: 'Quotation Converted to Invoice',
          actor: currentUser?.name || 'Hardik Patel',
          details: `Converted Quotation #${quotation.invoiceNumber || quotation.id} to ${
            targetDocType === 'invoice_with_gst' ? 'GST Tax Invoice' : 'Commercial Invoice'
          } #${newInvoiceNumber}.`,
        },
      ],
    };

    // Mark quotation as accepted
    const updatedQuotation: Invoice = {
      ...quotation,
      status: 'Accepted',
      linkedInvoiceId: newInvoiceNumber,
    };

    const updatedInvoices = [
      newInvoice,
      ...invoices.map((inv) => (inv.id === quotation.id ? updatedQuotation : inv)),
    ];

    const updatedSettings: SystemSettings = {
      ...settings,
      billingConfig: {
        ...settings.billingConfig,
        nextInvoiceNumber: nextInvNum + 1,
      },
    };

    setInvoices(updatedInvoices);
    StorageService.saveInvoices(updatedInvoices);
    setSettings(updatedSettings);
    StorageService.saveSettings(updatedSettings);

    setActiveInvoiceDetail(newInvoice);
    showToast(`Quotation converted to Invoice #${newInvoiceNumber}! Original quote preserved.`);
  };

  const handleUpdateInvoiceStatus = (invoiceId: string, status: Invoice['status']) => {
    const updated = invoices.map((inv) =>
      inv.id === invoiceId
        ? {
            ...inv,
            status,
            auditLogs: [
              ...(inv.auditLogs || []),
              {
                id: `audit-${Date.now()}`,
                timestamp: new Date().toISOString(),
                action: `Status Updated to ${status}`,
                actor: currentUser?.name || 'Administrator',
                details: `Document status updated to ${status}.`,
              },
            ],
          }
        : inv
    );
    setInvoices(updated);
    StorageService.saveInvoices(updated);
    showToast(`Document status changed to ${status}.`);
  };

  const handleRecordPayment = (invoiceId: string, payment: PaymentRecord) => {
    const updated = invoices.map((inv) => {
      if (inv.id !== invoiceId) return inv;
      const currentPaid = inv.paidAmount || 0;
      const newPaid = currentPaid + payment.amount;
      const newBalance = Math.max(0, inv.totalAmount - newPaid);
      const newStatus: Invoice['status'] = newBalance <= 0 ? 'Paid' : 'Partial';

      const updatedAudit = [
        ...(inv.auditLogs || []),
        {
          id: `audit-${Date.now()}`,
          timestamp: new Date().toISOString(),
          action: 'Payment Received',
          actor: currentUser?.name || payment.recordedBy,
          details: `Received ₹${payment.amount.toLocaleString('en-IN')} via ${payment.method}. Outstanding balance: ₹${newBalance.toLocaleString('en-IN')}.`,
        },
      ];

      return {
        ...inv,
        paidAmount: newPaid,
        balanceDue: newBalance,
        status: newStatus,
        payments: [...(inv.payments || []), payment],
        auditLogs: updatedAudit,
      };
    });

    setInvoices(updated);
    StorageService.saveInvoices(updated);
    ApiService.recordInvoicePayment(invoiceId, {
      amount: payment.amount,
      method: payment.method,
      referenceNumber: payment.referenceNumber || '',
      notes: payment.notes,
    }).catch(console.error);
    const target = updated.find((i) => i.id === invoiceId);
    if (activeInvoiceDetail && activeInvoiceDetail.id === invoiceId && target) {
      setActiveInvoiceDetail(target);
    }
    showToast(`Payment of ₹${payment.amount.toLocaleString('en-IN')} recorded successfully.`);
  };

  const handleCancelInvoice = (invoiceId: string, reason: string) => {
    const updated = invoices.map((inv) => {
      if (inv.id !== invoiceId) return inv;
      return {
        ...inv,
        status: 'Cancelled' as const,
        cancellationReason: reason,
        auditLogs: [
          ...(inv.auditLogs || []),
          {
            id: `audit-${Date.now()}`,
            timestamp: new Date().toISOString(),
            action: 'Document Cancelled',
            actor: currentUser?.name || 'Hardik Patel',
            details: `Cancelled. Authorized Reason: ${reason}`,
          },
        ],
      };
    });

    setInvoices(updated);
    StorageService.saveInvoices(updated);
    const target = updated.find((i) => i.id === invoiceId);
    if (activeInvoiceDetail && activeInvoiceDetail.id === invoiceId && target) {
      setActiveInvoiceDetail(target);
    }
    showToast(`Document cancelled and audit recorded.`);
  };

  // -------------------------------------------------------------
  // SETTINGS HANDLER
  // -------------------------------------------------------------
  const handleSaveSettings = (newSettings: SystemSettings) => {
    setSettings(newSettings);
    StorageService.saveSettings(newSettings);
    showToast('System configuration saved persistently.');
  };

  // -------------------------------------------------------------
  // TICKET & OPERATIONS HANDLERS
  // -------------------------------------------------------------
  const handleCreateTicket = (newTicketData: Partial<Ticket>) => {
    const cust = customers.find((c) => c.id === newTicketData.customerId) || customers[0];
    const tech = technicians.find((t) => t.id === newTicketData.technicianId) || technicians[0];

    const ticket: Ticket = {
      id: `STI-${Math.floor(8850 + Math.random() * 200)}`,
      title: newTicketData.title || 'Unscheduled Infrastructure Task',
      customerId: cust.id,
      customerName: cust.name,
      customerCompany: cust.company,
      customerPhone: cust.phone,
      location: newTicketData.location || `${cust.address}, ${cust.city}`,
      equipmentType: newTicketData.equipmentType || 'cctv_camera',
      equipmentModel: newTicketData.equipmentModel || 'Hardware Unit',
      serialNumber: newTicketData.serialNumber,
      priority: newTicketData.priority || 'medium',
      status: 'pending',
      technicianId: tech.id,
      technicianName: tech.name,
      technicianAvatar: tech.avatarUrl,
      createdAt: 'Just now',
      scheduledDate: newTicketData.scheduledDate || 'Today, 02:00 PM',
      description: newTicketData.description || 'Service call dispatched via operations.',
      billable: newTicketData.billable ?? true,
      estimatedCost: newTicketData.estimatedCost || 1500,
      slaTimeHours: newTicketData.slaTimeHours || 8,
    };

    const updatedTickets = [ticket, ...tickets];
    setTickets(updatedTickets);
    StorageService.saveTickets(updatedTickets);

    const newNotification: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `New Dispatch: ${ticket.title}`,
      message: `Assigned to ${ticket.technicianName} for ${ticket.customerName}.`,
      time: 'Just now',
      type: 'ticket',
      read: false,
      ticketId: ticket.id,
    };
    const updatedNotifs = [newNotification, ...notifications];
    setNotifications(updatedNotifs);
    StorageService.saveNotifications(updatedNotifs);

    showToast(`Service task #${ticket.id} dispatched to ${ticket.technicianName}!`);
  };

  const handleUpdateStatus = (ticketId: string, status: TicketStatus) => {
    const updatedTickets = tickets.map((t) => (t.id === ticketId ? { ...t, status } : t));
    setTickets(updatedTickets);
    StorageService.saveTickets(updatedTickets);

    const targetTicket = tickets.find((t) => t.id === ticketId);
    if (targetTicket) {
      const newNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: `Task #${ticketId} Status: ${status.toUpperCase()}`,
        message: `${targetTicket.title} marked as ${status.replace('_', ' ')}.`,
        time: 'Just now',
        type: 'ticket',
        read: false,
        ticketId: ticketId,
      };
      const updatedNotifs = [newNotif, ...notifications];
      setNotifications(updatedNotifs);
      StorageService.saveNotifications(updatedNotifs);
    }

    if (activeTicketDetail && activeTicketDetail.id === ticketId) {
      setActiveTicketDetail({ ...activeTicketDetail, status });
    }

    showToast(`Ticket #${ticketId} marked as ${status.replace('_', ' ')}`);
  };

  const handleUpdateTicket = (updatedTicket: Ticket) => {
    const updated = tickets.map((t) => (t.id === updatedTicket.id ? updatedTicket : t));
    setTickets(updated);
    StorageService.saveTickets(updated);
    setActiveTicketDetail(updatedTicket);
    showToast(`Ticket #${updatedTicket.id} updated successfully.`);
  };

  const handleMarkNotificationRead = (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    setNotifications(updated);
    StorageService.saveNotifications(updated);
  };

  const handleClearAllNotifications = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
    StorageService.saveNotifications(updated);
    showToast('All notifications marked as read.');
  };

  const handleOpenTicket = (ticketId: string) => {
    const found = tickets.find((t) => t.id === ticketId);
    if (found) {
      setActiveTicketDetail(found);
    }
  };

  const handleCallTechnician = (tech: Technician) => {
    showToast(`Initiating direct voice call to ${tech.name} (${tech.phone})...`);
  };

  const handleResetDemoData = () => {
    setCompanies(INITIAL_COMPANIES);
    setCustomers(INITIAL_CUSTOMERS);
    setTickets(INITIAL_TICKETS);
    setInvoices(INITIAL_INVOICES);
    setTechnicians(INITIAL_TECHNICIANS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setSettings(INITIAL_SETTINGS);

    StorageService.saveCompanies(INITIAL_COMPANIES);
    StorageService.saveCustomers(INITIAL_CUSTOMERS);
    StorageService.saveTickets(INITIAL_TICKETS);
    StorageService.saveInvoices(INITIAL_INVOICES);
    StorageService.saveTechnicians(INITIAL_TECHNICIANS);
    StorageService.saveNotifications(INITIAL_NOTIFICATIONS);
    StorageService.saveSettings(INITIAL_SETTINGS);

    showToast('Reset application to original Sumedha Tech Infra reference data.');
  };

  // If unauthenticated, display secure login screen
  if (!currentUser) {
    return (
      <LoginScreen
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          showToast(`Authenticated as ${user.name} (${user.role.toUpperCase()})`);
        }}
      />
    );
  }

  // Count active pending tasks
  const pendingTasksCount = tickets.filter(
    (t) => t.status === 'pending' || t.status === 'in_progress'
  ).length;

  // Filtered tickets if user clicked a stat card filter
  const displayedRecentTickets =
    selectedFilter && selectedFilter !== 'all'
      ? tickets.filter((t) => t.status === selectedFilter)
      : tickets;

  // Viewport Container styling:
  const getContainerClasses = () => {
    if (deviceView === 'mobile') {
      return 'w-full max-w-[430px] mx-auto min-h-screen my-4 rounded-[40px] border-[8px] border-slate-800 shadow-[0_0_50px_rgba(6,182,212,0.15)] overflow-hidden bg-[#070b14] relative';
    }
    if (deviceView === 'tablet') {
      return 'w-full max-w-[820px] mx-auto min-h-screen my-4 rounded-[32px] border-[8px] border-slate-800 shadow-[0_0_50px_rgba(6,182,212,0.15)] overflow-hidden bg-[#070b14] relative';
    }
    return 'w-full max-w-7xl mx-auto min-h-screen bg-[#070b14] relative';
  };

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 flex flex-col justify-between selection:bg-cyan-500/30">
      {/* Toast popup */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-cyan-950/95 border border-cyan-400/50 text-cyan-200 text-xs font-semibold shadow-2xl flex items-center gap-2 animate-in fade-in slide-from-top-3 duration-200">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Responsive Wrapper */}
      <div className={getContainerClasses()}>
        {/* Top Header Bar */}
        <TopBar
          notifications={notifications}
          onMarkNotificationRead={handleMarkNotificationRead}
          onClearAllNotifications={handleClearAllNotifications}
          onOpenTicket={handleOpenTicket}
          deviceView={deviceView}
          onChangeDeviceView={setDeviceView}
          onOpenInstallGuide={() => setIsInstallGuideOpen(true)}
          currentUser={currentUser}
          onLogout={handleLogout}
          activeTab={activeTab}
          onChangeTab={setActiveTab}
          onOpenAuditLogs={() => setIsAuditLogsModalOpen(true)}
          isRealtimeConnected={isRealtimeConnected}
        />

        {/* Dynamic Content Views */}
        <main className="p-4 sm:p-6 flex flex-col gap-6">
          {isLoading ? (
            <DashboardLoadingSkeleton />
          ) : isError ? (
            <ErrorState onRetry={() => setIsLoading(false)} />
          ) : activeTab === 'dashboard' ? (
            <>
              {/* 1. Hero Card: Service Overview */}
              <HeroServiceOverview
                tickets={tickets}
                onQuickNewTicket={() => setIsNewTaskOpen(true)}
              />

              {/* 2. 4 Graphic Statistic Cards */}
              <StatsGrid
                tickets={tickets}
                selectedFilter={selectedFilter}
                onSelectFilter={(status) => {
                  setSelectedFilter(status);
                  if (status !== 'all') {
                    showToast(`Filtered recent tickets by ${status.replace('_', ' ')}`);
                  }
                }}
              />

              {/* 3. Graphical Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <StatusDonutChart
                  tickets={tickets}
                  selectedStatus={selectedFilter}
                  onSelectStatus={(status) => setSelectedFilter(status as TicketStatus | null)}
                />
                <WeeklyBarChart />
              </div>

              {/* 4. Quick Action Buttons */}
              <QuickActions
                onNewTask={() => setIsNewTaskOpen(true)}
                onAddCustomer={() => {
                  setEditingCustomer(null);
                  setIsAddCustomerOpen(true);
                }}
                onCreateInvoice={() => handleOpenCreateDocument('invoice_with_gst')}
                onViewReports={() => setIsReportsOpen(true)}
              />

              {/* 5. Recent Service Calls Section */}
              <RecentServiceCalls
                tickets={displayedRecentTickets}
                onSelectTicket={(ticket) => setActiveTicketDetail(ticket)}
                onUpdateStatus={handleUpdateStatus}
                onViewAllTasks={() => setActiveTab('tasks')}
              />

              {/* 6. Technician Dispatch Roster */}
              <TechnicianPerformance
                technicians={technicians}
                onCallTechnician={handleCallTechnician}
                onViewAllStaff={() => setActiveTab('more')}
              />

              {/* 7. Billing & Invoicing Snapshot */}
              <MonthlyBillingOverview
                invoices={invoices}
                onCreateInvoice={() => handleOpenCreateDocument('invoice_with_gst')}
                onViewAllInvoices={() => setActiveTab('billing')}
              />
            </>
          ) : activeTab === 'tasks' ? (
            <TasksView
              tickets={tickets}
              onSelectTicket={(ticket) => setActiveTicketDetail(ticket)}
              onUpdateStatus={handleUpdateStatus}
              onNewTask={() => setIsNewTaskOpen(true)}
            />
          ) : activeTab === 'customers' ? (
            <CustomersView
              customers={customers}
              companies={companies}
              tickets={tickets}
              invoices={invoices}
              onAddCustomer={() => {
                setEditingCustomer(null);
                setIsAddCustomerOpen(true);
              }}
              onEditCustomer={(cust) => {
                setEditingCustomer(cust);
                setIsAddCustomerOpen(true);
              }}
              onDeleteCustomer={handleDeleteCustomerPrompt}
              onOpenCustomerDetail={(cust) => setActiveCustomerDetail(cust)}
            />
          ) : activeTab === 'billing' ? (
            <BillingView
              invoices={invoices}
              onCreateDocument={handleOpenCreateDocument}
              onOpenInvoiceDetail={(inv) => setActiveInvoiceDetail(inv)}
              onUpdateInvoiceStatus={handleUpdateInvoiceStatus}
            />
          ) : activeTab === 'suppliers' ? (
            <SuppliersView
              suppliers={suppliers}
              supplierPayments={supplierPayments}
              purchases={purchases}
              onAddSupplier={() => setSupplierModalState({ isOpen: true, existingSupplier: null })}
              onEditSupplier={(s) => setSupplierModalState({ isOpen: true, existingSupplier: s })}
              onRecordPayment={(s) => setSupplierPaymentModalState({ isOpen: true, supplier: s })}
              onArchiveSupplier={handleArchiveSupplier}
              showToast={showToast}
            />
          ) : activeTab === 'inventory' ? (
            <InventoryView
              inventory={inventory}
              onAddItem={() => setInventoryItemModalState({ isOpen: true, existingItem: null })}
              onEditItem={(item) => setInventoryItemModalState({ isOpen: true, existingItem: item })}
              onAdjustStock={(item) => setStockAdjustmentModalState({ isOpen: true, item })}
              showToast={showToast}
            />
          ) : activeTab === 'staff' ? (
            <StaffView
              staffMembers={staffMembers}
              salaryRecords={salaryRecords}
              salaryAdvances={salaryAdvances}
              attendance={attendance}
              onAddStaff={() => setStaffModalState({ isOpen: true, existingStaff: null })}
              onEditStaff={(s) => setStaffModalState({ isOpen: true, existingStaff: s })}
              onProcessSalary={(s) => setSalaryProcessModalState({ isOpen: true, staff: s || null })}
              onRecordAdvance={(s) => setSalaryAdvanceModalState({ isOpen: true, staff: s || null })}
              onSaveAttendance={handleSaveAttendance}
              showToast={showToast}
              isAdmin={currentUser?.role === 'admin'}
            />
          ) : activeTab === 'expenses' ? (
            <ExpensesView
              expenses={expenses}
              onAddExpense={() => setIsExpenseModalOpen(true)}
              onApproveExpense={handleApproveExpense}
              onDeleteExpense={handleDeleteExpense}
              showToast={showToast}
              isAdmin={currentUser?.role === 'admin'}
            />
          ) : activeTab === 'profit_loss' ? (
            <ProfitLossView
              invoices={invoices}
              purchases={purchases}
              expenses={expenses}
              salaries={salaryRecords}
              customers={customers}
              suppliers={suppliers}
              inventory={inventory}
              showToast={showToast}
            />
          ) : (
            <MoreView
              technicians={technicians}
              companies={companies}
              customers={customers}
              invoices={invoices}
              settings={settings}
              onSaveSettings={handleSaveSettings}
              onOpenCompanyModal={(comp) =>
                setCompanyModalState({ isOpen: true, existingCompany: comp || null })
              }
              onOpenCompanyDetail={(comp) => setActiveCompanyDetail(comp)}
              onDeleteCompany={handleDeleteCompanyPrompt}
              onToggleCompanyStatus={handleToggleCompanyStatus}
              onResetDemoData={handleResetDemoData}
              onToggleLoadingState={() => setIsLoading(!isLoading)}
              onToggleErrorState={() => setIsError(!isError)}
              isLoading={isLoading}
              isError={isError}
              onCallTechnician={handleCallTechnician}
              onOpenInstallGuide={() => setIsInstallGuideOpen(true)}
              showToast={showToast}
            />
          )}
        </main>

        {/* Floating Action Button for Emergency Ticket Dispatch */}
        <FloatingActionButton
          onNewTicket={() => setIsNewTaskOpen(true)}
          onAddCustomer={() => {
            setEditingCustomer(null);
            setIsAddCustomerOpen(true);
          }}
          onCreateInvoice={() => handleOpenCreateDocument('invoice_with_gst')}
        />

        {/* Material 3 Bottom Navigation Bar */}
        <BottomNavBar
          activeTab={activeTab}
          onChangeTab={setActiveTab}
          pendingTasksCount={pendingTasksCount}
        />
      </div>

      {/* ---------------- INTERACTIVE MODALS ---------------- */}
      {/* 1. New Service Task Modal */}
      <NewTaskModal
        isOpen={isNewTaskOpen}
        onClose={() => setIsNewTaskOpen(false)}
        customers={customers}
        technicians={technicians}
        onCreateTicket={handleCreateTicket}
      />

      {/* 2. Customer Form Modal (Add / Edit) */}
      <AddCustomerModal
        isOpen={isAddCustomerOpen}
        onClose={() => {
          setIsAddCustomerOpen(false);
          setEditingCustomer(null);
        }}
        onSaveCustomer={handleSaveCustomer}
        existingCustomer={editingCustomer}
        companies={companies}
      />

      {/* 3. Customer Comprehensive Detail Modal */}
      <CustomerDetailModal
        customer={activeCustomerDetail}
        isOpen={activeCustomerDetail !== null}
        onClose={() => setActiveCustomerDetail(null)}
        tickets={tickets}
        invoices={invoices}
        onEditCustomer={(cust) => {
          setActiveCustomerDetail(null);
          setEditingCustomer(cust);
          setIsAddCustomerOpen(true);
        }}
        onDeleteCustomer={(cust) => {
          setActiveCustomerDetail(null);
          handleDeleteCustomerPrompt(cust);
        }}
        onNewTicketForCustomer={() => {
          setIsNewTaskOpen(true);
        }}
        onNewInvoiceForCustomer={(cust) => {
          setPreselectedInvoiceCustId(cust.id);
          setInitialDocTypeForCreate('invoice_with_gst');
          setIsCreateInvoiceOpen(true);
        }}
        onOpenTicketDetail={(ticket) => {
          setActiveCustomerDetail(null);
          setActiveTicketDetail(ticket);
        }}
        onOpenInvoiceDetail={(inv) => {
          setActiveCustomerDetail(null);
          setActiveInvoiceDetail(inv);
        }}
      />

      {/* 4. Company Modal (Add / Edit) */}
      <CompanyModal
        isOpen={companyModalState.isOpen}
        onClose={() => setCompanyModalState({ isOpen: false, existingCompany: null })}
        onSaveCompany={handleSaveCompany}
        existingCompany={companyModalState.existingCompany}
      />

      {/* 5. Company Comprehensive Detail Modal */}
      <CompanyDetailModal
        company={activeCompanyDetail}
        isOpen={activeCompanyDetail !== null}
        onClose={() => setActiveCompanyDetail(null)}
        customers={customers}
        tickets={tickets}
        invoices={invoices}
        onEditCompany={(comp) => {
          setActiveCompanyDetail(null);
          setCompanyModalState({ isOpen: true, existingCompany: comp });
        }}
        onToggleStatus={(companyId: string) => {
          handleToggleCompanyStatus(companyId);
        }}
        onOpenCustomerDetail={(cust) => {
          setActiveCompanyDetail(null);
          setActiveCustomerDetail(cust);
        }}
        onOpenInvoiceDetail={(inv) => {
          setActiveCompanyDetail(null);
          setActiveInvoiceDetail(inv);
        }}
      />

      {/* 6. Invoice Comprehensive Detail & Professional PDF Modal */}
      <InvoiceDetailModal
        invoice={activeInvoiceDetail}
        isOpen={activeInvoiceDetail !== null}
        onClose={() => setActiveInvoiceDetail(null)}
        settings={settings}
        onRecordPayment={handleRecordPayment}
        onCancelInvoice={handleCancelInvoice}
        onConvertToInvoice={handleConvertToInvoice}
      />

      {/* 7. Create Document (Invoice / Quotation) Modal */}
      <CreateInvoiceModal
        isOpen={isCreateInvoiceOpen}
        onClose={() => setIsCreateInvoiceOpen(false)}
        customers={customers}
        tickets={tickets}
        settings={settings}
        onCreateInvoice={handleCreateInvoice}
        preselectedCustomerId={preselectedInvoiceCustId}
        initialDocType={initialDocTypeForCreate}
      />

      {/* 8. Reports Modal */}
      <ReportsModal
        isOpen={isReportsOpen}
        onClose={() => setIsReportsOpen(false)}
      />

      {/* 9. Ticket Detail Modal */}
      <TicketDetailModal
        ticket={activeTicketDetail}
        isOpen={activeTicketDetail !== null}
        onClose={() => setActiveTicketDetail(null)}
        technicians={technicians}
        onUpdateTicket={handleUpdateTicket}
      />

      {/* 10. Audit Protected Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteConfirmState.isOpen}
        onClose={() => setDeleteConfirmState({ ...deleteConfirmState, isOpen: false })}
        title={deleteConfirmState.title}
        itemName={deleteConfirmState.itemName}
        itemType={deleteConfirmState.itemType}
        linkedCounts={deleteConfirmState.linkedCounts}
        isArchived={deleteConfirmState.isArchived}
        onConfirmDelete={deleteConfirmState.onConfirmDelete}
        onConfirmArchive={deleteConfirmState.onConfirmArchive}
      />

      {/* 11. Android Installation & APK Modal */}
      <AndroidInstallGuideModal
        isOpen={isInstallGuideOpen}
        onClose={() => setIsInstallGuideOpen(false)}
      />

      {/* 12. Supplier Modal (Add / Edit) */}
      <SupplierModal
        isOpen={supplierModalState.isOpen}
        onClose={() => setSupplierModalState({ isOpen: false, existingSupplier: null })}
        onSave={handleSaveSupplier}
        existingSupplier={supplierModalState.existingSupplier}
      />

      {/* 13. Supplier Payment Modal */}
      <SupplierPaymentModal
        isOpen={supplierPaymentModalState.isOpen}
        onClose={() => setSupplierPaymentModalState({ isOpen: false, supplier: null })}
        supplier={supplierPaymentModalState.supplier}
        purchases={purchases}
        onRecordPayment={handleRecordSupplierPayment}
      />

      {/* 14. Inventory Item Modal (Add / Edit) */}
      <InventoryItemModal
        isOpen={inventoryItemModalState.isOpen}
        onClose={() => setInventoryItemModalState({ isOpen: false, existingItem: null })}
        onSave={handleSaveInventoryItem}
        existingItem={inventoryItemModalState.existingItem}
      />

      {/* 15. Stock Movement & Adjustment Modal */}
      <StockAdjustmentModal
        isOpen={stockAdjustmentModalState.isOpen}
        onClose={() => setStockAdjustmentModalState({ isOpen: false, item: null })}
        item={stockAdjustmentModalState.item}
        onConfirmAdjustment={handleStockAdjustment}
      />

      {/* 16. Company Operating Expense Modal */}
      <ExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        onSave={handleSaveExpense}
      />

      {/* 17. Staff Member Modal (Add / Edit) */}
      <StaffModal
        isOpen={staffModalState.isOpen}
        onClose={() => setStaffModalState({ isOpen: false, existingStaff: null })}
        onSave={handleSaveStaff}
        existingStaff={staffModalState.existingStaff}
      />

      {/* 18. Salary Slip Processing Modal */}
      <SalaryProcessModal
        isOpen={salaryProcessModalState.isOpen}
        onClose={() => setSalaryProcessModalState({ isOpen: false, staff: null })}
        staffMembers={staffMembers}
        selectedStaff={salaryProcessModalState.staff}
        onConfirmSalary={handleProcessSalary}
      />

      {/* 19. Salary Advance Issuance Modal */}
      <SalaryAdvanceModal
        isOpen={salaryAdvanceModalState.isOpen}
        onClose={() => setSalaryAdvanceModalState({ isOpen: false, staff: null })}
        staffMembers={staffMembers}
        selectedStaff={salaryAdvanceModalState.staff}
        onConfirmAdvance={handleRecordAdvance}
      />

      {/* 20. System Security & Audit Logs Modal */}
      <AuditLogsModal
        isOpen={isAuditLogsModalOpen}
        onClose={() => setIsAuditLogsModalOpen(false)}
        auditLogs={auditLogs}
      />

      {/* 21. PWA Offline Mode Indicator */}
      <OfflineIndicator />
    </div>
  );
}
