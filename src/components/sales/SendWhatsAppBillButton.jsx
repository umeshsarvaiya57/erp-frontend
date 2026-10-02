import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { 
  formatPhoneNumber, 
  isValidWhatsAppPhone, 
  getWhatsAppDeepLink,
  getWhatsAppWebDeepLink 
} from '../../utils/whatsappUtils';

/**
 * WhatsApp SVG Icon Component
 */
const WhatsAppIcon = ({ className = 'w-5 h-5', style = {} }) => (
  <svg
    className={className}
    style={style}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
  </svg>
);

/**
 * Reusable SendWhatsAppBillButton Component
 *
 * @param {Object} props
 * @param {Object} props.invoice - The invoice object containing bill info
 * @param {string} [props.countryCode='91'] - Default country code
 * @param {string} [props.buttonText='Share Bill on WhatsApp'] - Label text
 * @param {'deep-link'|'web'} [props.targetMode='deep-link'] - 'deep-link' (wa.me) or 'web' (web.whatsapp.com)
 * @param {string} [props.className] - Optional custom CSS classes
 * @param {Object} [props.style] - Optional custom inline styles
 * @param {Function} [props.onSuccess] - Callback when share action is launched
 * @param {Function} [props.onError] - Callback on validation error
 */
export const SendWhatsAppBillButton = ({
  invoice,
  countryCode = '91',
  buttonText = 'Share Bill on WhatsApp',
  targetMode = 'deep-link',
  className = '',
  style = {},
  onSuccess,
  onError,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const handleClick = (e) => {
    e.preventDefault();

    if (!invoice) {
      const err = 'No invoice data provided to share.';
      if (onError) onError(err);
      else alert(err);
      return;
    }

    const rawPhone = invoice.customerPhone || '';
    const formattedPhone = formatPhoneNumber(rawPhone, countryCode);

    // Basic phone validation check
    if (rawPhone && !isValidWhatsAppPhone(formattedPhone)) {
      const msg = `The phone number "${rawPhone}" is invalid for WhatsApp. Please verify the digits and country code.`;
      if (onError) onError(msg);
      else alert(msg);
      return;
    }

    // Generate link according to preference
    const whatsappUrl = targetMode === 'web'
      ? getWhatsAppWebDeepLink({ phone: formattedPhone, invoice, countryCode })
      : getWhatsAppDeepLink({ phone: formattedPhone, invoice, countryCode });

    // Open WhatsApp in a new browser tab / app instance safely
    const win = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    
    if (win) {
      win.focus();
    }

    if (onSuccess) {
      onSuccess({ invoice, phone: formattedPhone, url: whatsappUrl });
    }
  };

  // Base and interactive inline styles matching WhatsApp brand color palette
  const buttonBaseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    backgroundColor: isHovered ? '#1EBE5D' : '#25D366',
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: '14px',
    lineHeight: '1.25',
    padding: '10px 18px',
    borderRadius: '10px',
    border: 'none',
    cursor: 'pointer',
    boxShadow: isHovered
      ? '0 6px 16px rgba(37, 211, 102, 0.35)'
      : '0 2px 6px rgba(37, 211, 102, 0.2)',
    transform: isActive ? 'scale(0.98)' : isHovered ? 'translateY(-1px)' : 'none',
    transition: 'all 0.18s cubic-bezier(0.4, 0, 0.2, 1)',
    userSelect: 'none',
    textDecoration: 'none',
    outline: 'none',
    ...style,
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsActive(false);
      }}
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
      className={`whatsapp-bill-share-btn ${className}`}
      style={buttonBaseStyle}
      title="Send Bill & Invoice Details via WhatsApp"
    >
      <WhatsAppIcon className="w-4 h-4" style={{ flexShrink: 0, width: '18px', height: '18px' }} />
      <span>{buttonText}</span>
    </button>
  );
};

SendWhatsAppBillButton.propTypes = {
  invoice: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    date: PropTypes.string,
    customerName: PropTypes.string,
    customerPhone: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    items: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        qty: PropTypes.number,
        price: PropTypes.number.isRequired,
      })
    ),
    totalAmount: PropTypes.number.isRequired,
    paymentStatus: PropTypes.string,
    pdfUrl: PropTypes.string,
    businessName: PropTypes.string,
  }).isRequired,
  countryCode: PropTypes.string,
  buttonText: PropTypes.string,
  targetMode: PropTypes.oneOf(['deep-link', 'web']),
  className: PropTypes.string,
  style: PropTypes.object,
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
};

export default SendWhatsAppBillButton;
