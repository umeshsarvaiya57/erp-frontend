/**
 * WhatsApp Deep Linking Utility Functions for Bill & Invoice Sharing
 * Uses the official WhatsApp Deep Link (wa.me) scheme.
 */

/**
 * Normalizes and formats a phone number string.
 * Strips out spaces, dashes, parentheses, plus signs, and prepends default country code.
 *
 * @param {string|number} phone - Raw input phone number
 * @param {string} [defaultCountryCode='91'] - Default country code (e.g. '91' for India, '1' for US)
 * @returns {string} Sanitized international digits-only phone string
 */
export const formatPhoneNumber = (phone, defaultCountryCode = '91') => {
  if (!phone) return '';

  // 1. Convert to string and strip all non-numeric characters
  let digits = phone.toString().replace(/\D/g, '');
  if (!digits) return '';

  const cleanCountryCode = defaultCountryCode.toString().replace(/\D/g, '');

  // 2. Handle 11-digit numbers starting with leading zero (e.g. 09876543210 -> 9876543210)
  if (digits.length === 11 && digits.startsWith('0')) {
    digits = digits.substring(1);
  }

  // 3. If standard 10-digit mobile number, prepend the default country code
  if (digits.length === 10) {
    return `${cleanCountryCode}${digits}`;
  }

  // 4. If already includes country code (e.g., 919876543210 or 14155552671)
  return digits;
};

/**
 * Validates whether a formatted phone number contains a valid length for WhatsApp.
 *
 * @param {string} formattedPhone - Digits-only phone string
 * @returns {boolean} True if valid length (10 to 15 digits as per E.164 standard)
 */
export const isValidWhatsAppPhone = (formattedPhone) => {
  if (!formattedPhone) return false;
  const digits = formattedPhone.toString().replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 15;
};

/**
 * Formats a clean, professional WhatsApp invoice message using WhatsApp Markdown formatting.
 *
 * @param {Object} invoice - The invoice data object
 * @param {string} [invoice.id] - Invoice ID or Bill Number
 * @param {string} [invoice.date] - Date string or timestamp
 * @param {string} [invoice.customerName] - Recipient customer name
 * @param {Array<{name: string, qty: number, price: number}>} [invoice.items] - Line items
 * @param {number|string} [invoice.totalAmount] - Total invoice amount
 * @param {string} [invoice.paymentStatus] - Payment status (PAID, PENDING, DUE, etc.)
 * @param {string} [invoice.pdfUrl] - Optional direct URL or link to view/download PDF invoice
 * @param {string} [invoice.businessName] - Optional business/shop name
 * @returns {string} Formatted WhatsApp markdown message string
 */
export const formatWhatsAppInvoiceMessage = (invoice = {}) => {
  const {
    id = 'N/A',
    date = new Date().toLocaleDateString(),
    customerName = 'Valued Customer',
    items = [],
    totalAmount = 0,
    paymentStatus = 'PAID',
    pdfUrl = '',
    businessName = 'Our Store',
  } = invoice;

  // Format currency helper
  const formatCurrency = (val) => `₹${Number(val || 0).toFixed(2)}`;

  // Format line items
  const itemsSection = items && items.length > 0
    ? items.map((item) => {
        const name = item.name || 'Item';
        const qty = item.qty || 1;
        const price = formatCurrency(item.price || 0);
        return `  • *${name}* (x${qty}) - ${price}`;
      }).join('\n')
    : '  • *General Purchase*';

  // Format Payment Status with badge emoji
  const statusEmoji = paymentStatus?.toUpperCase() === 'PAID' ? '✅' : '⏳';
  const statusText = paymentStatus ? `${statusEmoji} *Payment Status:* ${paymentStatus.toUpperCase()}` : '';

  // PDF Download Link Section (if available)
  const pdfSection = pdfUrl 
    ? `\n📄 *Download PDF Invoice:*\n${pdfUrl}\n`
    : '';

  // Assemble full markdown message
  const message = [
    `🧾 *INVOICE BILL - ${businessName.toUpperCase()}*`,
    ``,
    `Hello *${customerName}*,`,
    `Thank you for your purchase with *${businessName}*! 🙏 Here are the details of your bill:`,
    ``,
    `━━━━━━━━━━━━━━━━━━━`,
    `📄 *Invoice No:* ${id}`,
    `📅 *Date:* ${date}`,
    statusText,
    `━━━━━━━━━━━━━━━━━━━`,
    ``,
    `🛒 *Items Ordered:*`,
    itemsSection,
    ``,
    `━━━━━━━━━━━━━━━━━━━`,
    `💰 *Total Amount:* *${formatCurrency(totalAmount)}*`,
    `━━━━━━━━━━━━━━━━━━━`,
    pdfSection,
    `If you have any questions, feel free to reply to this message.`,
    `Have a great day! 😊`,
  ].filter(Boolean).join('\n');

  return message;
};

/**
 * Generates the full WhatsApp Deep Link (wa.me) URL.
 *
 * @param {Object} params
 * @param {string|number} params.phone - Customer phone number
 * @param {Object} params.invoice - Invoice data payload
 * @param {string} [params.countryCode='91'] - Default country code
 * @param {string} [params.customMessage] - Optional custom message to override default template
 * @returns {string} Fully qualified wa.me URL
 */
export const getWhatsAppDeepLink = ({
  phone,
  invoice,
  countryCode = '91',
  customMessage = '',
}) => {
  const targetPhone = phone || invoice?.customerPhone || '';
  const sanitizedPhone = formatPhoneNumber(targetPhone, countryCode);
  const rawMessage = customMessage || formatWhatsAppInvoiceMessage(invoice);
  const encodedMessage = encodeURIComponent(rawMessage);

  if (sanitizedPhone) {
    return `https://wa.me/${sanitizedPhone}?text=${encodedMessage}`;
  }

  // Fallback if no phone is supplied: opens WhatsApp contact selector with text prefilled
  return `https://wa.me/?text=${encodedMessage}`;
};

/**
 * Generates the WhatsApp Web direct link URL (optimized for Desktop browser tabs).
 *
 * @param {Object} params
 * @returns {string} Fully qualified web.whatsapp.com URL
 */
export const getWhatsAppWebDeepLink = ({
  phone,
  invoice,
  countryCode = '91',
  customMessage = '',
}) => {
  const targetPhone = phone || invoice?.customerPhone || '';
  const sanitizedPhone = formatPhoneNumber(targetPhone, countryCode);
  const rawMessage = customMessage || formatWhatsAppInvoiceMessage(invoice);
  const encodedMessage = encodeURIComponent(rawMessage);

  if (sanitizedPhone) {
    return `https://web.whatsapp.com/send?phone=${sanitizedPhone}&text=${encodedMessage}`;
  }

  return `https://web.whatsapp.com/send?text=${encodedMessage}`;
};
