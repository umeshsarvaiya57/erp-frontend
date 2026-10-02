/**
 * Generates formatted WhatsApp messages and URL links for sales invoices.
 */

export const formatWhatsAppPhone = (phone, defaultCountryCode = '91') => {
  if (!phone) return '';
  let digitsOnly = phone.toString().replace(/[^0-9]/g, '');
  if (!digitsOnly) return '';

  // If 11 digits starting with 0 (e.g. 09876543210), strip the leading 0
  if (digitsOnly.length === 11 && digitsOnly.startsWith('0')) {
    digitsOnly = digitsOnly.substring(1);
  }

  // If 10-digit number (standard mobile number), prepend default country code
  if (digitsOnly.length === 10) {
    return `${defaultCountryCode}${digitsOnly}`;
  }

  return digitsOnly;
};

export const generateWhatsAppInvoiceMessage = (sale, business = null) => {
  if (!sale) return '';

  const businessName = sale.businessId?.name || business?.name || 'Our Shop';
  const businessAddress = sale.businessId?.address || business?.address || '';
  const businessMobile = sale.businessId?.mobile || business?.mobile || '';
  const businessGstin = sale.businessId?.gstNumber || business?.gstNumber || '';

  const customerName = sale.customerId?.name || 'Valued Customer';
  const invoiceNumber = sale.invoiceNumber || 'INV-000000';
  const invoiceDate = sale.createdAt ? new Date(sale.createdAt).toLocaleDateString() : new Date().toLocaleDateString();
  const paymentMethod = sale.paymentMethod || 'CASH';

  // Format line items
  const itemsText = (sale.items || [])
    .map((item, idx) => {
      const name = item.productName || item.productId?.name || `Item ${idx + 1}`;
      const qty = item.quantity || 1;
      const total = Number(item.total || 0).toFixed(2);
      return `  • ${name} (x${qty}) - ₹${total}`;
    })
    .join('\n');

  const grandTotal = Number(sale.grandTotal || 0).toFixed(2);
  const paidAmount = Number(sale.paidAmount || 0).toFixed(2);
  const dueAmount = Number(sale.dueAmount || 0).toFixed(2);

  let balanceText = '';
  if (Number(dueAmount) > 0) {
    balanceText = `\n⚠️ *Balance Due:* ₹${dueAmount}`;
  } else {
    balanceText = `\n🎉 *Payment Status:* FULLY PAID`;
  }

  // Public invoice online viewer & PDF download link
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const invoiceLink = sale._id && origin ? `\n📄 *View & Download PDF Bill Online:*\n${origin}/public/invoices/${sale._id}\n` : '';

  const message = 
`🧾 *INVOICE BILL - ${businessName.toUpperCase()}*

Hello *${customerName}*,

*Thank you for purchasing with ${businessName}!* 🙏 We truly appreciate your business and hope to serve you again soon.

━━━━━━━━━━━━━━━━━━━
📄 *Invoice No:* ${invoiceNumber}
📅 *Date:* ${invoiceDate}
💳 *Payment Mode:* ${paymentMethod}
━━━━━━━━━━━━━━━━━━━

🛒 *Items Ordered:*
${itemsText || '  • No items listed'}

━━━━━━━━━━━━━━━━━━━
💵 *Subtotal:* ₹${Number(sale.subtotal || 0).toFixed(2)}
🏷️ *Discount:* - ₹${Number(sale.discountTotal || 0).toFixed(2)}
📊 *Tax (GST):* ₹${Number((sale.cgst || 0) + (sale.sgst || 0) + (sale.igst || 0)).toFixed(2)}
💰 *Grand Total:* ₹${grandTotal}
✅ *Amount Paid:* ₹${paidAmount}${balanceText}
━━━━━━━━━━━━━━━━━━━${invoiceLink}
🏬 *${businessName}*${businessGstin ? `\n🏷️ GSTIN: ${businessGstin}` : ''}${businessAddress ? `\n📍 ${businessAddress}` : ''}${businessMobile ? `\n📞 ${businessMobile}` : ''}

Have a wonderful day! 😊`;

  return message;
};

export const getWhatsAppWebUrl = (phone, message) => {
  const cleanPhone = formatWhatsAppPhone(phone);
  const encodedText = encodeURIComponent(message);
  if (cleanPhone) {
    return `https://web.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`;
  }
  return `https://web.whatsapp.com/send?text=${encodedText}`;
};

export const getWhatsAppAppUrl = (phone, message) => {
  const cleanPhone = formatWhatsAppPhone(phone);
  const encodedText = encodeURIComponent(message);
  if (cleanPhone) {
    return `https://wa.me/${cleanPhone}?text=${encodedText}`;
  }
  return `https://wa.me/?text=${encodedText}`;
};

export const getWhatsAppUniversalUrl = (phone, message) => {
  const cleanPhone = formatWhatsAppPhone(phone);
  const encodedText = encodeURIComponent(message);
  if (cleanPhone) {
    return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`;
  }
  return `https://api.whatsapp.com/send?text=${encodedText}`;
};

export const getWhatsAppUrl = (phone, message, platform = 'web') => {
  if (platform === 'web') {
    return getWhatsAppWebUrl(phone, message);
  }
  return getWhatsAppAppUrl(phone, message);
};

export const openWhatsAppWeb = (phone, message) => {
  const url = getWhatsAppWebUrl(phone, message);
  return window.open(url, '_blank', 'noopener,noreferrer');
};

export const openWhatsAppApp = (phone, message) => {
  const url = getWhatsAppAppUrl(phone, message);
  return window.open(url, '_blank', 'noopener,noreferrer');
};

export const openWhatsApp = (phone, message, platform = 'web') => {
  const url = getWhatsAppUrl(phone, message, platform);
  return window.open(url, '_blank', 'noopener,noreferrer');
};


