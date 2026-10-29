import React from 'react';
import { CompanyProfile } from '../../types';

interface FooterProps {
  companyProfile: CompanyProfile;
}

export const SumedhaDocumentFooter: React.FC<FooterProps> = ({ companyProfile }) => {
  const phone = companyProfile.phone || '+91 93273 22327';
  const cleanPhone = phone.replace(/[^0-9]/g, '').slice(-10);

  return (
    <div className="w-full mt-6 rounded-t-xl overflow-hidden shadow-sm">
      {/* Dark Navy Footer Strip matching PDF references */}
      <div className="bg-[#08152e] text-white p-3 sm:p-4">
        {/* Top 3 Trust Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pb-3 border-b border-slate-700/60 text-center">
          <div className="flex items-center justify-center gap-2">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400 shrink-0">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="text-left">
              <div className="text-[9px] font-bold tracking-wider uppercase text-emerald-400">QUALITY SERVICE</div>
              <div className="text-[8px] text-slate-300">You Can Trust</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2">
            <div className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-400 shrink-0">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="text-left">
              <div className="text-[9px] font-bold tracking-wider uppercase text-cyan-400">PROFESSIONAL SOLUTIONS</div>
              <div className="text-[8px] text-slate-300">For Every Need</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2">
            <div className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-400 shrink-0">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <div className="text-left">
              <div className="text-[9px] font-bold tracking-wider uppercase text-amber-400">INTEGRITY, QUALITY</div>
              <div className="text-[8px] text-slate-300">Trustworthy Service</div>
            </div>
          </div>
        </div>

        {/* Lower Row: Contact details, Phone highlight and Doorstep badge */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 text-[10px]">
          {/* Location Badge */}
          <div className="flex items-center gap-2 text-slate-200">
            <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <div className="font-bold text-white text-[9.5px]">30 Contact Details,</div>
              <div className="text-[8.5px] text-slate-300">Vadodara, Gujarat</div>
            </div>
          </div>

          {/* Center Call / WhatsApp Box */}
          <div className="text-center bg-slate-900/90 px-4 py-1.5 rounded-lg border border-slate-700/80">
            <div className="text-[8px] font-bold text-slate-400 tracking-wider uppercase">
              FOR SERVICE &amp; SUPPORT
            </div>
            <div className="text-base sm:text-lg font-black tracking-wide text-white font-mono">
              {cleanPhone ? `${cleanPhone.slice(0, 5)} ${cleanPhone.slice(5)}` : '93273 22327'}
            </div>
            <div className="text-[7.5px] font-semibold text-emerald-400 tracking-widest uppercase">
              CALL / WHATSAPP
            </div>
          </div>

          {/* Doorstep Delivery Badge */}
          <div className="flex items-center gap-2 text-slate-200">
            <div className="w-6 h-6 rounded-full bg-cyan-600 flex items-center justify-center text-white shrink-0">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <div className="font-bold text-white text-[9.5px]">PROFESSIONAL SERVICE</div>
              <div className="text-[8.5px] text-slate-300">RIGHT AT YOUR DOORSTEP</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
