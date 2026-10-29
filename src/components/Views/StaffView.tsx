import React, { useState } from 'react';
import {
  StaffMember,
  MonthlySalaryRecord,
  SalaryAdvance,
  AttendanceRecord,
} from '../../types';
import {
  Users,
  CreditCard,
  Calendar,
  CheckCircle2,
  Clock,
  Plus,
  Search,
  Printer,
  X,
  Building2,
  IndianRupee,
  FileText,
  AlertCircle,
  ShieldCheck,
  Edit2,
  UserCheck,
} from 'lucide-react';
import { SumedhaDocumentHeader } from '../Document/SumedhaDocumentHeader';
import { SumedhaDocumentFooter } from '../Document/SumedhaDocumentFooter';

interface StaffViewProps {
  staffMembers: StaffMember[];
  salaryRecords: MonthlySalaryRecord[];
  salaryAdvances: SalaryAdvance[];
  attendance: AttendanceRecord[];
  onAddStaff: () => void;
  onEditStaff: (staff: StaffMember) => void;
  onProcessSalary: (staff?: StaffMember) => void;
  onRecordAdvance: (staff?: StaffMember) => void;
  onSaveAttendance: (date: string, records: any[]) => void;
  showToast: (msg: string) => void;
  isAdmin: boolean;
}

export const StaffView: React.FC<StaffViewProps> = ({
  staffMembers,
  salaryRecords,
  salaryAdvances,
  attendance,
  onAddStaff,
  onEditStaff,
  onProcessSalary,
  onRecordAdvance,
  onSaveAttendance,
  showToast,
  isAdmin,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'directory' | 'salaries' | 'advances' | 'attendance'>('directory');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSalarySlip, setSelectedSalarySlip] = useState<MonthlySalaryRecord | null>(null);

  // Attendance state
  const todayStr = new Date().toISOString().split('T')[0];
  const [attendanceDate, setAttendanceDate] = useState(todayStr);
  const [attendanceRecords, setAttendanceRecords] = useState<{ [staffId: string]: 'present' | 'absent' | 'half_day' | 'leave' }>({});

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const totalMonthlyPayroll = staffMembers
    .filter((s) => s.employmentStatus === 'active')
    .reduce((sum, s) => sum + s.netMonthlySalary, 0);

  const totalAdvancesActive = salaryAdvances
    .filter((a) => a.status === 'active')
    .reduce((sum, a) => sum + (a.balanceRemaining || 0), 0);

  const handlePrintSlip = () => {
    window.print();
  };

  const filteredStaff = staffMembers.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-5 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Users className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
              Human Resources &amp; Payroll
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight mt-1">
            Staff Management &amp; Salary Structure
          </h2>
          <p className="text-xs text-slate-400">
            Employee compensation, monthly salary slips, advance tracking, and field attendance records
          </p>
        </div>

        {isAdmin && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onRecordAdvance()}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold text-xs border border-amber-500/30 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <IndianRupee className="w-3.5 h-3.5" />
              <span>Issue Advance</span>
            </button>
            <button
              onClick={() => onProcessSalary()}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-600/25 transition-all cursor-pointer"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Process Salary</span>
            </button>
            <button
              onClick={onAddStaff}
              className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-600/25 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Staff</span>
            </button>
          </div>
        )}
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900/90 to-emerald-950/30 border border-emerald-500/20 shadow-md">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
            Total Monthly Payroll Commitment
          </span>
          <div className="text-xl font-extrabold text-emerald-400 font-mono mt-1">
            {formatCurrency(totalMonthlyPayroll)}
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            Active staff members ({staffMembers.filter((s) => s.employmentStatus === 'active').length})
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900/90 to-amber-950/20 border border-amber-500/20 shadow-md">
          <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider">
            Active Salary Advances
          </span>
          <div className="text-xl font-extrabold text-amber-300 font-mono mt-1">
            {formatCurrency(totalAdvancesActive)}
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Recovered automatically via salary slip deductions</p>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900/90 to-cyan-950/20 border border-cyan-500/20 shadow-md">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
            Processed Salary Slips
          </span>
          <div className="text-xl font-extrabold text-cyan-300 font-mono mt-1">
            {salaryRecords.length} Slips
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Archived with full auditable history &amp; deductions</p>
        </div>
      </div>

      {/* Sub-Tabs Navigation */}
      <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-950 border border-slate-800 text-xs overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('directory')}
          className={`px-4 py-2 rounded-xl font-medium transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeSubTab === 'directory' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Staff Directory ({staffMembers.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('salaries')}
          className={`px-4 py-2 rounded-xl font-medium transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeSubTab === 'salaries' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Monthly Salary Slips ({salaryRecords.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('advances')}
          className={`px-4 py-2 rounded-xl font-medium transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeSubTab === 'advances' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <IndianRupee className="w-3.5 h-3.5" />
          <span>Salary Advances ({salaryAdvances.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('attendance')}
          className={`px-4 py-2 rounded-xl font-medium transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeSubTab === 'attendance' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Daily Attendance</span>
        </button>
      </div>

      {/* Sub-Tab 1: Staff Directory */}
      {activeSubTab === 'directory' && (
        <div className="flex flex-col gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search employee ID, name, role..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950/80 border border-slate-700 text-xs text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none"
            />
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4">Employee ID &amp; Name</th>
                  <th className="py-3 px-4">Department &amp; Role</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4 text-right">Basic + HRA</th>
                  <th className="py-3 px-4 text-right">Net Monthly</th>
                  <th className="py-3 px-4 text-right">Outstanding Advance</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredStaff.map((staff) => (
                  <tr key={staff.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={staff.avatarUrl || '/src/assets/images/avatar_tech_aravind_1793089124186.jpg'}
                          alt={staff.name}
                          className="w-8 h-8 rounded-full object-cover border border-emerald-500/40"
                        />
                        <div>
                          <div className="font-bold text-white text-sm">{staff.name}</div>
                          <div className="font-mono text-emerald-400 text-[10px]">{staff.employeeId}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-slate-300 font-medium">{staff.role}</div>
                      <div className="text-[10px] text-slate-500">{staff.department}</div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-400">
                      <div>{staff.phone}</div>
                      <div className="text-[11px] text-slate-500">{staff.email}</div>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono text-slate-400">
                      <div>{formatCurrency(staff.basicSalary)}</div>
                      <div className="text-[10px] text-slate-500">+ {formatCurrency(staff.hra)} HRA</div>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-400 text-sm">
                      {formatCurrency(staff.netMonthlySalary)}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono">
                      {(staff.outstandingAdvance || 0) > 0 ? (
                        <span className="text-amber-400 font-bold">{formatCurrency(staff.outstandingAdvance)}</span>
                      ) : (
                        <span className="text-slate-500">Nil</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {isAdmin && (
                          <>
                            <button
                              onClick={() => onProcessSalary(staff)}
                              title="Process Monthly Salary"
                              className="px-2.5 py-1 rounded-lg bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600 hover:text-white border border-emerald-500/30 font-semibold transition-colors cursor-pointer"
                            >
                              Pay
                            </button>
                            <button
                              onClick={() => onEditStaff(staff)}
                              title="Edit Structure"
                              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Monthly Salary Records (Slips) */}
      {activeSubTab === 'salaries' && (
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Cycle Month</th>
                <th className="py-3 px-4">Staff Member</th>
                <th className="py-3 px-4 text-right">Gross Salary</th>
                <th className="py-3 px-4 text-right">Deductions</th>
                <th className="py-3 px-4 text-right">Net Payable</th>
                <th className="py-3 px-4 text-right">Amount Paid</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Slip</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {salaryRecords.map((sal) => (
                <tr key={sal.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-white">
                    {sal.month}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white">{sal.staffName}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{sal.employeeId} · {sal.department}</div>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-slate-300">
                    {formatCurrency(sal.grossSalary)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-rose-400">
                    - {formatCurrency((sal.authorizedDeductions || 0) + (sal.advanceDeduction || 0))}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-white">
                    {formatCurrency(sal.netPayable)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-400">
                    {formatCurrency(sal.amountPaid)}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                        sal.status === 'paid'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : sal.status === 'partial'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      {sal.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => setSelectedSalarySlip(sal)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[11px] font-semibold flex items-center gap-1 mx-auto cursor-pointer"
                    >
                      <Printer className="w-3 h-3" />
                      <span>View Slip</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Sub-Tab 3: Salary Advances */}
      {activeSubTab === 'advances' && (
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Date &amp; Staff</th>
                <th className="py-3 px-4">Reason / Notes</th>
                <th className="py-3 px-4 text-right">Advance Amount</th>
                <th className="py-3 px-4 text-right">Repaid (Salary Deduction)</th>
                <th className="py-3 px-4 text-right">Balance Remaining</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4">Approved By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {salaryAdvances.map((adv) => (
                <tr key={adv.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white">{adv.staffName}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{adv.employeeId} · {adv.date}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300 max-w-xs">{adv.reason}</td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-white">
                    {formatCurrency(adv.amount)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-emerald-400">
                    {formatCurrency(adv.repaidAmount)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-amber-400">
                    {formatCurrency(adv.balanceRemaining)}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        adv.status === 'settled'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {adv.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">{adv.approvedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Sub-Tab 4: Attendance Tracker */}
      {activeSubTab === 'attendance' && (
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white">Staff Field &amp; Office Attendance</h3>
              <p className="text-xs text-slate-400">Record daily clock-in status for SLA compliance and salary payroll</p>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-mono text-slate-400">Date:</label>
              <input
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {staffMembers.map((staff) => {
              const currentStatus =
                attendanceRecords[staff.id] ||
                attendance.find((a) => a.date === attendanceDate && a.staffId === staff.id)?.status ||
                'present';

              return (
                <div
                  key={staff.id}
                  className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="font-bold text-white text-sm">{staff.name}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{staff.employeeId} · {staff.role}</div>
                  </div>

                  <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
                    {(['present', 'half_day', 'leave', 'absent'] as const).map((st) => (
                      <button
                        key={st}
                        onClick={() =>
                          setAttendanceRecords({
                            ...attendanceRecords,
                            [staff.id]: st,
                          })
                        }
                        className={`px-2 py-1 rounded text-[10px] font-mono capitalize transition-colors cursor-pointer ${
                          currentStatus === st
                            ? st === 'present'
                              ? 'bg-emerald-600 text-white font-bold'
                              : st === 'half_day'
                              ? 'bg-amber-600 text-white font-bold'
                              : 'bg-rose-600 text-white font-bold'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {st.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-3 border-t border-slate-800">
            <button
              onClick={() => {
                const batch = staffMembers.map((s) => ({
                  staffId: s.id,
                  staffName: s.name,
                  status: attendanceRecords[s.id] || 'present',
                }));
                onSaveAttendance(attendanceDate, batch);
                showToast(`Attendance saved for ${attendanceDate}`);
              }}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-600/25 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save Attendance for {attendanceDate}</span>
            </button>
          </div>
        </div>
      )}

      {/* Printable Salary Slip Modal */}
      {selectedSalarySlip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl max-h-[95vh] overflow-y-auto">
            {/* Action Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 no-print">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase">
                Official Staff Payslip · {selectedSalarySlip.month}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintSlip}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Slip</span>
                </button>
                <button
                  onClick={() => setSelectedSalarySlip(null)}
                  className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Payslip Document Body */}
            <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 my-4 text-xs font-sans">
              <div className="text-center pb-4 border-b border-slate-800">
                <h2 className="text-lg font-black text-white tracking-wide">SUMEDHA TECH INFRA</h2>
                <p className="text-[10px] text-slate-400">
                  Kunalchaar Rasta, Gotri, New Alkapuri, Vadodara, Gujarat 390021
                </p>
                <p className="text-[10px] font-mono text-cyan-400 mt-0.5">GSTIN: 24DMGPS9549D1ZN</p>
                <div className="mt-2 inline-block px-3 py-1 rounded bg-slate-900 border border-slate-800 font-mono font-bold text-white uppercase text-[11px]">
                  Salary Slip for {selectedSalarySlip.month}
                </div>
              </div>

              {/* Employee & Bank Info */}
              <div className="grid grid-cols-2 gap-4 py-4 border-b border-slate-800 text-slate-300">
                <div>
                  <div><strong className="text-white">Employee Name:</strong> {selectedSalarySlip.staffName}</div>
                  <div className="mt-1"><strong className="text-white">Employee ID:</strong> {selectedSalarySlip.employeeId}</div>
                  <div className="mt-1"><strong className="text-white">Department:</strong> {selectedSalarySlip.department}</div>
                </div>
                <div className="text-right">
                  <div><strong className="text-white">Payment Date:</strong> {selectedSalarySlip.paymentDate || 'N/A'}</div>
                  <div className="mt-1"><strong className="text-white">Mode:</strong> {selectedSalarySlip.paymentMethod || 'Bank Transfer'}</div>
                  <div className="mt-1 font-mono text-slate-400 text-[10px]">{selectedSalarySlip.referenceNumber}</div>
                </div>
              </div>

              {/* Earnings & Deductions Breakdown */}
              <div className="grid grid-cols-2 gap-6 py-4 border-b border-slate-800">
                {/* Earnings */}
                <div>
                  <h4 className="font-bold text-emerald-400 font-mono uppercase text-[11px] mb-2 pb-1 border-b border-slate-800">
                    Earnings (Credits)
                  </h4>
                  <div className="space-y-1.5 text-slate-300">
                    <div className="flex justify-between">
                      <span>Basic Salary</span>
                      <span className="font-mono">{formatCurrency(selectedSalarySlip.basicSalary)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>House Rent Allowance (HRA)</span>
                      <span className="font-mono">{formatCurrency(selectedSalarySlip.hra)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Special Allowances</span>
                      <span className="font-mono">{formatCurrency(selectedSalarySlip.allowances)}</span>
                    </div>
                    {selectedSalarySlip.overtimeBonus > 0 && (
                      <div className="flex justify-between text-cyan-300">
                        <span>Overtime &amp; On-Call Bonus</span>
                        <span className="font-mono">+{formatCurrency(selectedSalarySlip.overtimeBonus)}</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-2 border-t border-slate-800 font-bold text-white">
                      <span>Gross Earnings</span>
                      <span className="font-mono">{formatCurrency(selectedSalarySlip.grossSalary)}</span>
                    </div>
                  </div>
                </div>

                {/* Deductions */}
                <div>
                  <h4 className="font-bold text-rose-400 font-mono uppercase text-[11px] mb-2 pb-1 border-b border-slate-800">
                    Deductions (Debits)
                  </h4>
                  <div className="space-y-1.5 text-slate-300">
                    <div className="flex justify-between">
                      <span>Statutory / Tax Deductions</span>
                      <span className="font-mono text-rose-400">
                        {formatCurrency(selectedSalarySlip.authorizedDeductions)}
                      </span>
                    </div>
                    {selectedSalarySlip.advanceDeduction > 0 && (
                      <div className="flex justify-between text-amber-300">
                        <span>Salary Advance Recovery</span>
                        <span className="font-mono text-amber-400">
                          {formatCurrency(selectedSalarySlip.advanceDeduction)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between pt-2 border-t border-slate-800 font-bold text-rose-400">
                      <span>Total Deductions</span>
                      <span className="font-mono">
                        - {formatCurrency((selectedSalarySlip.authorizedDeductions || 0) + (selectedSalarySlip.advanceDeduction || 0))}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Net Pay Box */}
              <div className="p-4 rounded-xl bg-slate-900 border border-emerald-500/30 flex items-center justify-between mt-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Net Take-Home Salary</span>
                  <div className="text-lg font-black text-emerald-400 font-mono mt-0.5">
                    {formatCurrency(selectedSalarySlip.amountPaid)}
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 rounded bg-emerald-500/20 text-emerald-300 font-bold font-mono uppercase text-[10px]">
                    Status: {selectedSalarySlip.status}
                  </span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-800 flex justify-between text-[10px] text-slate-500">
                <div>Authorized Signatory<br /><strong className="text-slate-300">Sumedha Tech Infra</strong></div>
                <div className="text-right">Employee Signature<br /><strong className="text-slate-300">{selectedSalarySlip.staffName}</strong></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
