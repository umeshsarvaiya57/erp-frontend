import html2pdf from 'html2pdf.js';
import { toast } from '../components/ui/toast/toastService';
import { 
  openWhatsApp, 
  generateWhatsAppInvoiceMessage, 
  formatWhatsAppPhone,
  getWhatsAppUrl,
  getWhatsAppWebUrl,
  getWhatsAppAppUrl
} from './whatsapp';

/**
 * Builds a clean, self-contained HTML invoice element suitable for high-res PDF generation.
 */
export const buildInvoiceHtmlElement = (sale, business = null) => {
  const businessName = sale.businessId?.name || business?.name || 'Our Shop';
  const businessAddress = sale.businessId?.address || business?.address || '';
  const businessMobile = sale.businessId?.mobile || business?.mobile || '';
  const businessEmail = sale.businessId?.email || business?.email || '';
  const businessGst = sale.businessId?.gstNumber || business?.gstNumber || '';
  const businessLogo = sale.businessId?.logo || business?.logo || '';

  const customerName = sale.customerId?.name || 'Walk-in Customer';
  const customerMobile = sale.customerId?.mobile || '-';
  const customerEmail = sale.customerId?.email || '';
  const customerAddress = sale.customerId?.address || '';
  const customerGst = sale.customerId?.gstNumber || '';

  const invoiceNumber = sale.invoiceNumber || 'INV-000000';
  const invoiceDate = sale.createdAt ? new Date(sale.createdAt).toLocaleDateString() : new Date().toLocaleDateString();
  const paymentMethod = sale.paymentMethod || 'CASH';
  const status = sale.status || 'COMPLETED';

  const subtotal = Number(sale.subtotal || 0).toFixed(2);
  const discountTotal = Number(sale.discountTotal || 0).toFixed(2);
  const cgst = Number(sale.cgst || 0).toFixed(2);
  const sgst = Number(sale.sgst || 0).toFixed(2);
  const igst = Number(sale.igst || 0).toFixed(2);
  const grandTotal = Number(sale.grandTotal || 0).toFixed(2);
  const paidAmount = Number(sale.paidAmount || 0).toFixed(2);
  const dueAmount = Number(sale.dueAmount || 0).toFixed(2);

  const itemsRows = (sale.items || [])
    .map((item, idx) => {
      const name = item.productName || item.productId?.name || `Item ${idx + 1}`;
      const rate = Number(item.rate || 0).toFixed(2);
      const qty = item.quantity || 1;
      const discount = Number(item.discount || 0).toFixed(2);
      const gstRate = item.gstRate !== undefined ? `${item.gstRate}%` : '0%';
      const total = Number(item.total || 0).toFixed(2);

      return `
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 10px 12px; font-weight: 600; color: #1e293b;">${name}</td>
          <td style="padding: 10px 12px; text-align: right; color: #475569;">₹ ${rate}</td>
          <td style="padding: 10px 12px; text-align: right; color: #475569;">${qty}</td>
          <td style="padding: 10px 12px; text-align: right; color: #059669;">- ₹ ${discount}</td>
          <td style="padding: 10px 12px; text-align: right; color: #475569;">${gstRate}</td>
          <td style="padding: 10px 12px; text-align: right; font-weight: 700; color: #0f172a;">₹ ${total}</td>
        </tr>
      `;
    })
    .join('');

  const container = document.createElement('div');
  container.style.padding = '28px';
  container.style.fontFamily = 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  container.style.color = '#0f172a';
  container.style.backgroundColor = '#ffffff';
  container.style.width = '760px';
  container.style.boxSizing = 'border-box';

  container.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 20px;">
      <div>
        <h1 style="font-size: 22px; font-weight: 800; color: #0f172a; margin: 0 0 6px 0;">${businessName}</h1>
        ${businessAddress ? `<p style="font-size: 11px; color: #64748b; margin: 0 0 4px 0; max-width: 320px; line-height: 1.4;">${businessAddress}</p>` : ''}
        ${businessMobile ? `<p style="font-size: 11px; color: #64748b; margin: 0 0 4px 0;">Phone: <b>${businessMobile}</b></p>` : ''}
        ${businessEmail ? `<p style="font-size: 11px; color: #64748b; margin: 0 0 4px 0;">Email: <b>${businessEmail}</b></p>` : ''}
        ${businessGst ? `<p style="font-size: 11px; color: #0f172a; margin: 0; font-weight: 700;">GSTIN: ${businessGst}</p>` : ''}
      </div>

      <div style="text-align: right;">
        <span style="display: inline-block; font-size: 11px; font-weight: 800; letter-spacing: 2px; color: #7c3aed; background-color: #f5f3ff; padding: 4px 10px; border-radius: 6px; margin-bottom: 8px;">TAX INVOICE</span>
        <p style="font-size: 12px; margin: 0 0 4px 0; color: #475569;">Invoice No: <b style="color: #0f172a;">${invoiceNumber}</b></p>
        <p style="font-size: 12px; margin: 0 0 4px 0; color: #475569;">Date: <b style="color: #0f172a;">${invoiceDate}</b></p>
        <p style="font-size: 12px; margin: 0; color: #475569;">Payment: <b style="color: #0f172a;">${paymentMethod}</b> (${status})</p>
      </div>
    </div>

    <div style="display: flex; justify-content: space-between; margin-bottom: 24px; padding: 14px 16px; background-color: #f8fafc; border-radius: 10px; border: 1px solid #e2e8f0;">
      <div>
        <span style="font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 4px;">BILLED TO</span>
        <p style="font-size: 14px; font-weight: 700; color: #0f172a; margin: 0 0 3px 0;">${customerName}</p>
        ${customerMobile !== '-' ? `<p style="font-size: 11px; color: #475569; margin: 0 0 2px 0;">Mobile: ${customerMobile}</p>` : ''}
        ${customerEmail ? `<p style="font-size: 11px; color: #475569; margin: 0 0 2px 0;">Email: ${customerEmail}</p>` : ''}
        ${customerAddress ? `<p style="font-size: 11px; color: #475569; margin: 0 0 2px 0;">${customerAddress}</p>` : ''}
        ${customerGst ? `<p style="font-size: 11px; font-weight: 700; color: #0f172a; margin: 0;">GSTIN: ${customerGst}</p>` : ''}
      </div>
      <div style="text-align: right;">
        <span style="font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 4px;">PAYMENT SUMMARY</span>
        <p style="font-size: 12px; margin: 0 0 3px 0; color: #475569;">Status: <b style="color: #059669;">${status}</b></p>
        <p style="font-size: 12px; margin: 0 0 3px 0; color: #475569;">Paid: <b>₹ ${paidAmount}</b></p>
        ${Number(dueAmount) > 0 ? `<p style="font-size: 12px; margin: 0; color: #dc2626; font-weight: 700;">Balance Due: ₹ ${dueAmount}</p>` : '<p style="font-size: 12px; margin: 0; color: #059669; font-weight: 700;">Fully Paid</p>'}
      </div>
    </div>

    <table style="width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 24px; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
      <thead>
        <tr style="background-color: #f1f5f9; color: #475569; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">
          <th style="padding: 10px 12px; text-align: left;">Item Description</th>
          <th style="padding: 10px 12px; text-align: right;">Price</th>
          <th style="padding: 10px 12px; text-align: right;">Qty</th>
          <th style="padding: 10px 12px; text-align: right;">Disc</th>
          <th style="padding: 10px 12px; text-align: right;">GST</th>
          <th style="padding: 10px 12px; text-align: right;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${itemsRows}
      </tbody>
    </table>

    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
      <div style="max-width: 320px; font-size: 11px; color: #64748b; line-height: 1.5; font-style: italic;">
        Thank you for purchasing with <b>${businessName}</b>!<br/>
        We appreciate your business. For any invoice queries, contact store support.
      </div>

      <div style="width: 260px; font-size: 12px; color: #475569;">
        <div style="display: flex; justify-content: space-between; padding: 4px 0;">
          <span>Subtotal:</span>
          <b>₹ ${subtotal}</b>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 4px 0; color: #059669;">
          <span>Discounts:</span>
          <b>- ₹ ${discountTotal}</b>
        </div>
        ${Number(cgst) > 0 ? `<div style="display: flex; justify-content: space-between; padding: 3px 0; font-size: 11px; color: #64748b;"><span>CGST:</span><span>₹ ${cgst}</span></div>` : ''}
        ${Number(sgst) > 0 ? `<div style="display: flex; justify-content: space-between; padding: 3px 0; font-size: 11px; color: #64748b;"><span>SGST:</span><span>₹ ${sgst}</span></div>` : ''}
        ${Number(igst) > 0 ? `<div style="display: flex; justify-content: space-between; padding: 3px 0; font-size: 11px; color: #64748b;"><span>IGST:</span><span>₹ ${igst}</span></div>` : ''}
        
        <div style="display: flex; justify-content: space-between; padding: 8px 0; border-top: 1px dashed #cbd5e1; margin-top: 6px; font-size: 14px; font-weight: 800; color: #0f172a;">
          <span>Grand Total:</span>
          <span>₹ ${grandTotal}</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 3px 0; font-weight: 700; color: #059669;">
          <span>Amount Paid:</span>
          <span>₹ ${paidAmount}</span>
        </div>
        ${Number(dueAmount) > 0 ? `
          <div style="display: flex; justify-content: space-between; padding: 3px 0; font-weight: 800; color: #dc2626;">
            <span>Balance Due:</span>
            <span>₹ ${dueAmount}</span>
          </div>
        ` : ''}
      </div>
    </div>
  `;

  return container;
};

/**
 * Downloads the invoice as a crisp, professional PDF document.
 */
export const downloadInvoicePDF = async (sale, business = null, targetElement = null) => {
  try {
    toast.info('Generating high-resolution PDF invoice...');
    
    let element = targetElement;
    let isTemp = false;

    if (!element) {
      element = buildInvoiceHtmlElement(sale, business);
      document.body.appendChild(element);
      isTemp = true;
    }

    const filename = `Invoice-${sale?.invoiceNumber || 'Bill'}.pdf`;

    const opt = {
      margin: [8, 8, 8, 8],
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    await html2pdf().from(element).set(opt).save();

    if (isTemp && element.parentNode) {
      element.parentNode.removeChild(element);
    }

    toast.success(`Invoice PDF (${filename}) downloaded successfully!`);
  } catch (error) {
    console.error('Failed to generate PDF:', error);
    toast.error('Failed to generate PDF invoice document.');
  }
};

/**
 * Generates the PDF blob and opens WhatsApp with message & file attachment support.
 */
export const shareInvoiceViaWhatsAppWithPDF = async ({
  sale,
  business = null,
  phone = '',
  customMessage = '',
  targetElement = null,
  platform = 'web',
  preOpenedWindow = null,
}) => {
  const invoiceNumber = sale?.invoiceNumber || 'Bill';
  const message = customMessage || generateWhatsAppInvoiceMessage(sale, business);
  const targetPhone = phone || sale?.customerId?.mobile || '';

  // Retrieve optimal WhatsApp target URL
  const targetUrl = getWhatsAppUrl(targetPhone, message, platform);
  let newTab = preOpenedWindow;

  try {
    let element = targetElement;
    let isTemp = false;

    if (!element) {
      element = buildInvoiceHtmlElement(sale, business);
      document.body.appendChild(element);
      isTemp = true;
    }

    const opt = {
      margin: [8, 8, 8, 8],
      filename: `Invoice-${invoiceNumber}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    toast.info('Generating official PDF invoice...');

    // Generate PDF Blob
    const worker = html2pdf().from(element).set(opt);
    const pdfBlob = await worker.output('blob');

    if (isTemp && element.parentNode) {
      element.parentNode.removeChild(element);
    }

    const pdfFile = new File([pdfBlob], `Invoice-${invoiceNumber}.pdf`, {
      type: 'application/pdf',
    });

    // Check if Web Share API with files is supported (Mobile / compatible devices)
    if (navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
      try {
        if (newTab && !newTab.closed) newTab.close();
        await navigator.share({
          files: [pdfFile],
          title: `Invoice #${invoiceNumber}`,
          text: message,
        });
        toast.success('Invoice shared successfully!');
        return;
      } catch (shareErr) {
        if (shareErr.name !== 'AbortError') {
          console.warn('Web Share API error:', shareErr);
        }
      }
    }

    // Direct download of the PDF file
    const downloadUrl = URL.createObjectURL(pdfBlob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `Invoice-${invoiceNumber}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(downloadUrl), 4000);

    // Ensure WhatsApp Web / App target is navigated
    if (newTab && !newTab.closed) {
      try {
        newTab.location.href = targetUrl;
      } catch (e) {
        window.open(targetUrl, '_blank', 'noopener,noreferrer');
      }
    } else {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    }

    const platformName = platform === 'web' ? 'WhatsApp Web' : 'WhatsApp App';
    toast.success({
      title: `PDF Downloaded & ${platformName} Opened`,
      message: `Invoice PDF downloaded. Drag & drop or attach the PDF file in ${platformName}!`,
      duration: 6000,
    });
  } catch (error) {
    console.error('Failed to share PDF via WhatsApp:', error);
    toast.error('Opening WhatsApp directly...');
    if (newTab && !newTab.closed) {
      newTab.location.href = targetUrl;
    } else {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    }
  }
};


