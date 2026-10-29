import React from 'react';
import { CompanyProfile, DocumentType } from '../../types';

interface HeaderProps {
  companyProfile: CompanyProfile;
  docType: DocumentType;
  docNumber: string;
  docDate: string;
  dueDateOrValidUntil?: string;
  customerIdCode?: string;
}

export const SumedhaDocumentHeader: React.FC<HeaderProps> = ({
  companyProfile,
  docType,
  docNumber,
  docDate,
  dueDateOrValidUntil,
  customerIdCode,
}) => {
  const isQuotation = docType === 'quotation_without_gst' || docType === 'quotation_with_gst';
  const isGST = docType === 'quotation_with_gst' || docType === 'invoice_with_gst';

  // Primary colors matching reference PDFs:
  // Quotation: Royal Blue (#1e3a8a / #254d7e)
  // Invoice: Deep Red (#a91d22 / #b91c1c)
  const titleColor = isQuotation ? 'text-[#254d7e]' : 'text-[#a91d22]';
  const titleText = isQuotation ? 'Price Proposal' : 'INVOICE';

  return (
    <div className="w-full text-slate-900 bg-white">
      {/* Top Banner: Logo + 6 Solutions Pills + CCTV Camera Image */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-300 pb-2 mb-3">
        {/* Company Logo / Branding */}
        <div className="flex items-center gap-3">
          {companyProfile.logoUrl ? (
            <img
              src={companyProfile.logoUrl}
              alt={companyProfile.name}
              className="h-16 w-auto object-contain"
            />
          ) : (
            <div className="flex items-center gap-2.5">
              {/* Authentic Emblem */}
              <div className="relative w-12 h-12 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-12 h-12">
                  <circle cx="50" cy="50" r="46" fill="#0d2b56" />
                  <path d="M50 14 C30 14 18 32 18 50 C18 68 30 86 50 86 C70 86 82 68 82 50 C82 32 70 14 50 14 Z" fill="none" stroke="#22c55e" strokeWidth="4" />
                  <path d="M30 45 L50 25 L70 45 L50 65 Z" fill="#ef4444" opacity="0.9" />
                  <path d="M42 42 L50 34 L58 42 L50 50 Z" fill="#ffffff" />
                  <circle cx="50" cy="74" r="5" fill="#38bdf8" />
                </svg>
              </div>

              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-black tracking-tight text-[#0d2b56] font-serif">
                    SUMEDHA
                  </span>
                </div>
                <div className="text-[11px] font-bold tracking-[0.2em] text-[#0d2b56] uppercase -mt-1">
                  TECH INFRA
                </div>
                <div className="text-[9px] text-slate-500 italic mt-0.5 whitespace-nowrap">
                  — Sumedha — A Symbol of Quality &amp; Excellence. —
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 6 Solutions Service Icons Strip */}
        <div className="hidden sm:flex items-center gap-1.5 text-center">
          <div className="flex flex-col items-center p-1 rounded border border-slate-200 bg-slate-50 w-14">
            <svg className="w-4 h-4 text-slate-700 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-[6.5px] font-bold text-slate-700 leading-tight">COMPUTER<br />SOLUTIONS</span>
          </div>

          <div className="flex flex-col items-center p-1 rounded border border-slate-200 bg-slate-50 w-14">
            <svg className="w-4 h-4 text-slate-700 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span className="text-[6.5px] font-bold text-slate-700 leading-tight">PRINTER<br />SOLUTIONS</span>
          </div>

          <div className="flex flex-col items-center p-1 rounded border border-slate-200 bg-slate-50 w-14">
            <svg className="w-4 h-4 text-slate-700 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span className="text-[6.5px] font-bold text-slate-700 leading-tight">CCTV<br />SOLUTIONS</span>
          </div>

          <div className="flex flex-col items-center p-1 rounded border border-slate-200 bg-slate-50 w-14">
            <svg className="w-4 h-4 text-slate-700 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-[6.5px] font-bold text-slate-700 leading-tight">INVERTER &amp;<br />UPS SOLUTIONS</span>
          </div>

          <div className="flex flex-col items-center p-1 rounded border border-slate-200 bg-slate-50 w-14">
            <svg className="w-4 h-4 text-slate-700 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 004.07 9.17" />
            </svg>
            <span className="text-[6.5px] font-bold text-slate-700 leading-tight">ATTENDANCE<br />MACHINE</span>
          </div>

          <div className="flex flex-col items-center p-1 rounded border border-slate-200 bg-slate-50 w-14">
            <svg className="w-4 h-4 text-slate-700 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-[6.5px] font-bold text-slate-700 leading-tight">GENERAL<br />SERVICES</span>
          </div>
        </div>

        {/* Security / CCTV Visual on Right matching PDF */}
        <div className="w-16 h-12 flex items-center justify-end shrink-0">
          <svg viewBox="0 0 120 90" className="w-14 h-12 text-slate-800">
            {/* White/Black IP Camera Illustration */}
            <rect x="10" y="30" width="60" height="30" rx="6" fill="#e2e8f0" stroke="#334155" strokeWidth="2" />
            <polygon points="70,36 100,24 100,66 70,54" fill="#64748b" stroke="#334155" strokeWidth="2" />
            <circle cx="35" cy="45" r="10" fill="#0f172a" />
            <circle cx="35" cy="45" r="4" fill="#38bdf8" />
            <rect x="25" y="18" width="12" height="12" fill="#94a3b8" />
            <path d="M31 18 L31 6 L60 6" fill="none" stroke="#64748b" strokeWidth="4" />
          </svg>
        </div>
      </div>

      {/* Middle Row: Company Address & Contact on Left, Metadata Box & Document Title on Right */}
      <div className="flex justify-between items-start gap-4 mb-4">
        {/* Left Side: Real Sumedha Tech Infra details from PDFs */}
        <div className="text-[11.5px] text-slate-800 leading-relaxed font-sans">
          {isGST && (
            <div className="font-bold text-slate-900 tracking-wide mb-0.5">
              GST. {companyProfile.gstin || '24DMGPS9549D1ZN'}
            </div>
          )}
          <div>{companyProfile.address || 'Kunalchaar Rasta, Gotri, New Alkapuri'}</div>
          <div>{companyProfile.city || 'Vadodara'} ({companyProfile.pincode || '390021'})</div>
          <div className="mt-0.5">
            Name: <span className="font-semibold text-slate-900">{companyProfile.contactPerson || 'Hardik Patel'}</span>
          </div>
          <div>Phone: <span className="font-medium text-slate-900">{companyProfile.phone || '+91 93273 22327'}</span></div>
          <div>Mail: <span className="font-medium text-slate-900">{companyProfile.email || 'sumedhatechinfra@gmail.com'}</span></div>
        </div>

        {/* Right Side: Metadata Box + Title */}
        <div className="flex flex-col items-end">
          {/* Bordered metadata box matching PDF */}
          <table className="border-collapse border border-slate-900 text-[11px] mb-2 font-sans">
            <tbody>
              <tr>
                <td className="border border-slate-900 px-3 py-1 font-bold text-slate-900 bg-slate-50 uppercase text-right">
                  DATE
                </td>
                <td className="border border-slate-900 px-3 py-1 font-bold text-slate-900 font-mono text-center min-w-[100px]">
                  {docDate}
                </td>
              </tr>
              <tr>
                <td className="border border-slate-900 px-3 py-1 font-bold text-slate-900 bg-slate-50 uppercase text-right">
                  {isQuotation ? 'QUOTE #' : 'INVOICE #'}
                </td>
                <td className="border border-slate-900 px-3 py-1 font-bold text-slate-900 font-mono text-center">
                  {docNumber}
                </td>
              </tr>
              <tr>
                <td className="border border-slate-900 px-3 py-1 font-bold text-slate-900 bg-slate-50 uppercase text-right">
                  CUSTOMER ID
                </td>
                <td className="border border-slate-900 px-3 py-1 font-medium text-slate-900 font-mono text-center">
                  {customerIdCode || '—'}
                </td>
              </tr>
              {isQuotation && dueDateOrValidUntil && (
                <tr>
                  <td className="border border-slate-900 px-3 py-1 font-bold text-slate-900 bg-slate-50 uppercase text-right">
                    VALID UNTIL
                  </td>
                  <td className="border border-slate-900 px-3 py-1 font-medium text-slate-900 font-mono text-center">
                    {dueDateOrValidUntil}
                  </td>
                </tr>
              )}
              {!isQuotation && dueDateOrValidUntil && (
                <tr>
                  <td className="border border-slate-900 px-3 py-1 font-bold text-slate-900 bg-slate-50 uppercase text-right">
                    DUE DATE
                  </td>
                  <td className="border border-slate-900 px-3 py-1 font-medium text-slate-900 font-mono text-center">
                    {dueDateOrValidUntil}
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Large Title matching original references */}
          <div className={`text-2xl sm:text-3xl font-bold tracking-tight ${titleColor} ${isQuotation ? 'font-serif' : 'font-sans uppercase tracking-wider'}`}>
            {titleText}
          </div>
        </div>
      </div>
    </div>
  );
};
