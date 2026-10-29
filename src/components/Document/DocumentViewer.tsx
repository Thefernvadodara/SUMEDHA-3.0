import React from 'react';
import { Invoice, CompanyProfile, BillingConfig } from '../../types';
import { SumedhaDocumentHeader } from './SumedhaDocumentHeader';
import { SumedhaDocumentFooter } from './SumedhaDocumentFooter';

interface DocumentViewerProps {
  invoice: Invoice;
  companyProfile: CompanyProfile;
  billingConfig?: BillingConfig;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  invoice,
  companyProfile,
  billingConfig,
}) => {
  const isQuotation = invoice.docType === 'quotation_without_gst' || invoice.docType === 'quotation_with_gst';
  const isGST = invoice.docType === 'quotation_with_gst' || invoice.docType === 'invoice_with_gst';

  // Primary Theme:
  // Quotations: Royal Blue (#284b7a)
  // Invoices: Deep Crimson Red (#a91d22)
  const headerBgColor = isQuotation ? 'bg-[#284b7a]' : 'bg-[#a91d22]';

  // Formatting helpers
  const formatCurrency = (val: number | undefined) => {
    const num = val || 0;
    return `₹ ${num.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatQty = (val: number | undefined) => {
    return (val || 0).toFixed(2);
  };

  // Calculations
  const subtotal = invoice.amount || invoice.items.reduce((acc, it) => acc + it.unitPrice * it.qty, 0);
  const discount = invoice.discountTotal || 0;
  const taxRate = invoice.taxPercent ?? 18;
  const taxDue = isGST ? (invoice.taxAmount || (subtotal - discount) * (taxRate / 100)) : 0;
  const total = isGST ? (subtotal - discount + taxDue) : (subtotal - discount);

  const defaultQuotationNotice =
    billingConfig?.quotationWiringNotice ||
    '*Wiring accessories such as pipes, clamps, supports, connectors, and other miscellaneous materials are not included in the above quotation. Installation labour, if required beyond the mentioned scope, will be charged separately.*';

  const defaultQuotationTerms = [
    'Civil work, core cutting, wall chasing and related Civil work are not included in this quotation.',
    'Electrical power supply and required Electrical work are not included.',
    'Any additional work beyond the mentioned scope will be charged separately.',
    'Prices are subject to the specified scope of work and may vary for additional requirements.',
  ];

  const defaultInvoiceTerms = [
    'Goods once sold will not be returned.',
    'Warranty as per company policy.',
    'Physical damage is not covered under warranty.',
  ];

  const termsList = invoice.terms
    ? invoice.terms.split('\n').filter((t) => t.trim().length > 0)
    : isQuotation
    ? defaultQuotationTerms
    : defaultInvoiceTerms;

  return (
    <div
      id="printable-document-sheet"
      className="w-full max-w-[210mm] mx-auto bg-white text-slate-900 p-6 sm:p-8 font-sans shadow-xl border border-slate-200 print:shadow-none print:border-none print:p-0 print:max-w-none text-[11px] leading-normal"
    >
      {/* 1. Sumedha Corporate Header */}
      <SumedhaDocumentHeader
        companyProfile={companyProfile}
        docType={invoice.docType}
        docNumber={invoice.invoiceNumber || invoice.quoteNumber || invoice.id}
        docDate={invoice.issuedDate}
        dueDateOrValidUntil={isQuotation ? invoice.validUntil : invoice.dueDate}
        customerIdCode={invoice.customerIdCode || invoice.customerId}
      />

      {/* 2. Customer Bar */}
      <div className="mb-4">
        {/* Solid Color Banner */}
        <div className={`${headerBgColor} text-white font-bold px-3 py-1 text-xs uppercase tracking-wider`}>
          CUSTOMER
        </div>
        {/* Customer Information under banner */}
        <div className="p-2.5 bg-slate-50 border-x border-b border-slate-300 text-[11px] space-y-0.5">
          <div className="font-bold text-slate-900 text-xs">
            {invoice.customerName || invoice.company}
          </div>
          {invoice.customerAddress && (
            <div className="text-slate-700">{invoice.customerAddress}</div>
          )}
          {invoice.customerCity && (
            <div className="text-slate-700">{invoice.customerCity}</div>
          )}
          {invoice.customerPhone && (
            <div className="text-slate-600">Phone: {invoice.customerPhone}</div>
          )}
          {isGST && invoice.customerGstin && (
            <div className="text-slate-800 font-semibold">
              GSTIN: <span className="font-mono">{invoice.customerGstin}</span>
            </div>
          )}
        </div>
      </div>

      {/* 3. Products / Items Table */}
      <div className="mb-4">
        <table className="w-full border-collapse border border-slate-900 text-[10.5px]">
          <thead>
            <tr className={`${headerBgColor} text-white uppercase font-bold text-center`}>
              <th className="border border-slate-900 py-1.5 px-3 text-left w-[46%]">DESCRIPTION</th>
              <th className="border border-slate-900 py-1.5 px-2 text-right w-[15%]">UNIT PRICE</th>
              <th className="border border-slate-900 py-1.5 px-2 text-center w-[9%]">QTY</th>
              {/* If Quotation With GST -> TAXED, if Invoices -> HSN/SAC, if Quotation Without GST -> DISCOUNT */}
              {invoice.docType === 'quotation_with_gst' && (
                <th className="border border-slate-900 py-1.5 px-2 text-right w-[14%]">TAXED</th>
              )}
              {invoice.docType === 'quotation_without_gst' && (
                <th className="border border-slate-900 py-1.5 px-2 text-right w-[14%]">DISCOUNT</th>
              )}
              {(invoice.docType === 'invoice_with_gst' || invoice.docType === 'invoice_without_gst') && (
                <th className="border border-slate-900 py-1.5 px-2 text-center w-[14%]">HSN/SAC</th>
              )}
              <th className="border border-slate-900 py-1.5 px-2 text-right w-[16%]">AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items && invoice.items.length > 0 ? (
              invoice.items.map((item, idx) => {
                const itemTax = item.taxAmount ?? (item.unitPrice * item.qty * ((item.taxPercent || 18) / 100));
                const itemAmount = item.total ?? (item.unitPrice * item.qty);

                return (
                  <tr key={item.id || idx} className="border-b border-slate-900 hover:bg-slate-50/50">
                    {/* Description Column */}
                    <td className="border border-slate-900 py-1.5 px-3 align-top">
                      <div className="font-semibold text-slate-900">
                        {idx + 1}. {item.description}
                      </div>

                      {/* Serial Numbers (formatted beneath description in italics matching INVOICE Avadh With GST) */}
                      {item.serialNumbers && (
                        <div className="text-[9.5px] text-slate-600 font-mono italic mt-0.5 leading-snug pl-3">
                          {item.serialNumbers.split(',').map((sn, sIdx) => (
                            <span key={sIdx} className="block">
                              {sn.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>

                    {/* Unit Price */}
                    <td className="border border-slate-900 py-1.5 px-2 text-right align-top font-mono">
                      {formatCurrency(item.unitPrice)}
                    </td>

                    {/* Quantity */}
                    <td className="border border-slate-900 py-1.5 px-2 text-center align-top font-mono">
                      {formatQty(item.qty)}
                    </td>

                    {/* Dynamic 4th Column */}
                    {invoice.docType === 'quotation_with_gst' && (
                      <td className="border border-slate-900 py-1.5 px-2 text-right align-top font-mono">
                        {formatCurrency(itemTax)}
                      </td>
                    )}
                    {invoice.docType === 'quotation_without_gst' && (
                      <td className="border border-slate-900 py-1.5 px-2 text-right align-top font-mono">
                        {item.discountPercent ? `${item.discountPercent}%` : '0%'}
                      </td>
                    )}
                    {(invoice.docType === 'invoice_with_gst' || invoice.docType === 'invoice_without_gst') && (
                      <td className="border border-slate-900 py-1.5 px-2 text-center align-top font-mono">
                        {item.hsnSac || '—'}
                      </td>
                    )}

                    {/* Total Amount */}
                    <td className="border border-slate-900 py-1.5 px-2 text-right align-top font-mono font-semibold">
                      {formatCurrency(itemAmount)}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="border border-slate-900 py-4 text-center text-slate-500 italic">
                  No line items added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Quotation Special Notice matching darshanam(1).pdf */}
        {isQuotation && (
          <div className="mt-2.5 p-2 bg-slate-50 border border-slate-200 rounded text-[9.5px] italic text-slate-700 leading-relaxed">
            {defaultQuotationNotice}
          </div>
        )}
      </div>

      {/* 4. Bottom Section: Terms & Conditions on Left, Totals Box on Right */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
        {/* Left Side: Terms and Conditions */}
        <div className="w-full sm:w-[58%]">
          <div className={`${headerBgColor} text-white font-bold px-3 py-1 text-xs uppercase tracking-wider`}>
            TERMS AND CONDITIONS
          </div>
          <div className="border-x border-b border-slate-900 p-2.5 text-[10px] space-y-1 text-slate-800 bg-white min-h-[90px]">
            {termsList.map((term, tIdx) => (
              <div key={tIdx} className="flex items-start gap-1">
                <span className="font-bold">{tIdx + 1}.</span>
                <span>{term.replace(/^\d+\.\s*/, '')}</span>
              </div>
            ))}
          </div>

          {/* Bank / UPI Payment Remittance Box */}
          <div className="mt-2 p-2 rounded bg-slate-50 border border-slate-200 text-[9.5px] text-slate-600">
            <span className="font-bold text-slate-800 uppercase block mb-0.5">Direct Settlement Details:</span>
            <span>Bank: <strong>{companyProfile.bankName}</strong></span> ·{' '}
            <span>A/C: <strong className="font-mono">{companyProfile.accountNumber}</strong></span> ·{' '}
            <span>IFSC: <strong className="font-mono">{companyProfile.ifscCode}</strong></span> ·{' '}
            <span>UPI ID: <strong className="font-mono text-cyan-800">{companyProfile.upiId}</strong></span>
          </div>
        </div>

        {/* Right Side: Totals Summary Box */}
        <div className="w-full sm:w-[40%]">
          <table className="w-full border-collapse border border-slate-900 text-[11px]">
            <tbody>
              <tr>
                <td className="border border-slate-900 py-1.5 px-3 font-medium text-slate-800">
                  Subtotal
                </td>
                <td className="border border-slate-900 py-1.5 px-3 text-right font-mono font-medium">
                  {formatCurrency(subtotal)}
                </td>
              </tr>

              {/* Show Tax lines only if With GST */}
              {isGST && (
                <>
                  <tr>
                    <td className="border border-slate-900 py-1 px-3 text-slate-700">
                      Tax rate
                    </td>
                    <td className="border border-slate-900 py-1 px-3 text-right font-mono">
                      {taxRate.toFixed(2)}%
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-slate-900 py-1 px-3 text-slate-700">
                      Tax due
                    </td>
                    <td className="border border-slate-900 py-1 px-3 text-right font-mono">
                      {formatCurrency(taxDue)}
                    </td>
                  </tr>
                </>
              )}

              {/* Discount / Other line */}
              {discount > 0 ? (
                <tr>
                  <td className="border border-slate-900 py-1 px-3 text-slate-700">
                    Discount
                  </td>
                  <td className="border border-slate-900 py-1 px-3 text-right font-mono text-emerald-700">
                    - {formatCurrency(discount)}
                  </td>
                </tr>
              ) : isQuotation ? (
                <tr>
                  <td className="border border-slate-900 py-1 px-3 text-slate-700">
                    Other
                  </td>
                  <td className="border border-slate-900 py-1 px-3 text-right font-mono text-slate-500">
                    NA
                  </td>
                </tr>
              ) : null}

              {/* Final TOTAL Row */}
              <tr className="bg-slate-50 font-bold">
                <td className="border-t-2 border-b-2 border-slate-900 py-2 px-3 text-xs uppercase text-slate-900">
                  TOTAL
                </td>
                <td className="border-t-2 border-b-2 border-slate-900 py-2 px-3 text-right font-mono text-xs text-slate-900">
                  {formatCurrency(total)}
                </td>
              </tr>

              {/* For Invoices: Paid & Balance breakdown if applicable */}
              {!isQuotation && invoice.paidAmount !== undefined && (
                <>
                  <tr>
                    <td className="border border-slate-900 py-1 px-3 text-[10px] text-slate-600">
                      Paid Amount ({invoice.status})
                    </td>
                    <td className="border border-slate-900 py-1 px-3 text-right font-mono text-[10px] text-emerald-700">
                      {formatCurrency(invoice.paidAmount)}
                    </td>
                  </tr>
                  <tr className="bg-amber-50/50">
                    <td className="border border-slate-900 py-1.5 px-3 font-semibold text-[10.5px] text-slate-900">
                      Balance Outstanding
                    </td>
                    <td className="border border-slate-900 py-1.5 px-3 text-right font-mono font-bold text-[10.5px] text-rose-700">
                      {formatCurrency(invoice.balanceDue ?? (total - invoice.paidAmount))}
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Sumedha Corporate Dark Navy Footer */}
      <SumedhaDocumentFooter companyProfile={companyProfile} />
    </div>
  );
};
