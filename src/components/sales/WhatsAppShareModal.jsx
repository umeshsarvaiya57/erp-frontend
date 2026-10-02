import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Send, 
  Copy, 
  Check, 
  Phone, 
  User, 
  FileText, 
  Sparkles, 
  FileDown, 
  Globe, 
  Smartphone,
  ExternalLink,
  Info
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { toast } from '../ui/toast/toastService';
import { 
  generateWhatsAppInvoiceMessage, 
  openWhatsApp, 
  openWhatsAppWeb,
  openWhatsAppApp,
  getWhatsAppWebUrl,
  getWhatsAppAppUrl,
  getWhatsAppUrl,
  formatWhatsAppPhone 
} from '../../utils/whatsapp';
import { 
  downloadInvoicePDF, 
  shareInvoiceViaWhatsAppWithPDF 
} from '../../utils/pdfGenerator';

export const WhatsAppShareModal = ({
  isOpen,
  onClose,
  sale,
  business = null,
  printableElementId = null,
}) => {
  const [phone, setPhone] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [message, setMessage] = useState('');
  const [platform, setPlatform] = useState('web'); // 'web' or 'app'
  const [copied, setCopied] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  useEffect(() => {
    if (sale) {
      const initialPhone = sale.customerId?.mobile || '';
      const initialName = sale.customerId?.name || 'Valued Customer';
      setPhone(initialPhone);
      setCustomerName(initialName);
      
      const generated = generateWhatsAppInvoiceMessage(sale, business);
      setMessage(generated);
    }
  }, [sale, business]);

  if (!sale) return null;

  const handlePhoneChange = (e) => {
    const val = e.target.value;
    setPhone(val);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      toast.success('Invoice message copied to clipboard!');
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      toast.error('Failed to copy text.');
    }
  };

  const handleDownloadPDF = async () => {
    setIsGeneratingPdf(true);
    try {
      const el = printableElementId ? document.getElementById(printableElementId) : null;
      await downloadInvoicePDF(sale, business, el);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleSendWhatsAppWithPDF = async (chosenPlatform = platform) => {
    // Synchronously initiate window open on user click so popup blockers cannot block it
    const targetPhone = phone || sale?.customerId?.mobile || '';
    const whatsappUrl = chosenPlatform === 'web' 
      ? getWhatsAppWebUrl(targetPhone, message) 
      : getWhatsAppAppUrl(targetPhone, message);

    let newTab = null;
    try {
      newTab = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    } catch (e) {
      console.warn('Direct window.open blocked, will fallback:', e);
    }

    setIsGeneratingPdf(true);
    try {
      const el = printableElementId ? document.getElementById(printableElementId) : null;
      await shareInvoiceViaWhatsAppWithPDF({
        sale,
        business,
        phone,
        customMessage: message,
        targetElement: el,
        platform: chosenPlatform,
        preOpenedWindow: newTab,
      });
      if (onClose) onClose();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleSendTextOnly = (chosenPlatform = platform) => {
    const targetPhone = phone || sale?.customerId?.mobile || '';
    if (!targetPhone && !confirm('No phone number entered. Would you like to open WhatsApp to select a contact manually?')) {
      return;
    }

    if (chosenPlatform === 'web') {
      openWhatsAppWeb(targetPhone, message);
      toast.success('Opening WhatsApp Web in your browser...');
    } else {
      openWhatsAppApp(targetPhone, message);
      toast.success('Opening WhatsApp App...');
    }
    if (onClose) onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-500 text-white rounded-xl shadow-sm shadow-emerald-500/20">
            <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 leading-none">
              Send Invoice Bill & PDF on WhatsApp
            </h3>
            <span className="text-xs text-slate-400 font-medium mt-0.5 block">
              Bill #{sale.invoiceNumber} • {sale.customerId?.name || 'Walk-in Customer'}
            </span>
          </div>
        </div>
      }
      size="lg"
      footer={
        <div className="flex items-center justify-between w-full flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDownloadPDF}
              loading={isGeneratingPdf}
              startIcon={<FileDown className="h-4 w-4 text-primary-600" />}
            >
              Download PDF
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopy}
              startIcon={copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
            >
              {copied ? 'Copied' : 'Copy Text'}
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 font-bold"
              onClick={() => handleSendWhatsAppWithPDF(platform)}
              loading={isGeneratingPdf}
              startIcon={<Send className="h-4 w-4" />}
            >
              {platform === 'web' ? 'Send via WhatsApp Web' : 'Send via WhatsApp App'}
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Platform Chooser Tabs (Web vs App) */}
        <div className="p-1 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center gap-1 select-none">
          <button
            type="button"
            onClick={() => setPlatform('web')}
            className={`
              flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2
              ${platform === 'web' 
                ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-sm' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }
            `}
          >
            <Globe className="h-3.5 w-3.5" />
            <span>WhatsApp Web (Browser Tab)</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-semibold ml-1 hidden sm:inline">
              No App Needed
            </span>
          </button>

          <button
            type="button"
            onClick={() => setPlatform('app')}
            className={`
              flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2
              ${platform === 'app' 
                ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-sm' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }
            `}
          >
            <Smartphone className="h-3.5 w-3.5" />
            <span>WhatsApp Desktop / Mobile App</span>
          </button>
        </div>

        {/* Informational Guidance Banner */}
        {platform === 'web' ? (
          <div className="p-3.5 bg-emerald-50/90 text-emerald-950 rounded-xl text-xs font-medium border border-emerald-200 flex items-start gap-2.5">
            <Globe className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-1.5 flex-1">
              <span className="font-bold text-emerald-900 block">WhatsApp Web Mode (Browser Based):</span>
              <p className="text-slate-700 leading-snug">
                Clicking the green button below will download your PDF invoice and automatically open <b>WhatsApp Web</b> with the customer chat and thank-you message prefilled.
              </p>
              <div className="pt-1">
                <a
                  href={getWhatsAppWebUrl(phone, message)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-white px-2.5 py-1 rounded-lg border border-emerald-300 shadow-sm transition-colors"
                >
                  <span>Open WhatsApp Web Tab directly</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3.5 bg-slate-50 text-slate-900 rounded-xl text-xs font-medium border border-slate-200 flex items-start gap-2.5">
            <Smartphone className="h-4 w-4 text-slate-600 shrink-0 mt-0.5" />
            <div className="space-y-1.5 flex-1">
              <span className="font-bold block">WhatsApp App Mode:</span>
              <p className="text-slate-600 leading-snug">
                Opens the installed WhatsApp Desktop or Mobile application on your device with the customer's chat and message.
              </p>
              <div className="pt-1">
                <a
                  href={getWhatsAppAppUrl(phone, message)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-300 shadow-sm transition-colors"
                >
                  <span>Launch WhatsApp App</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Recipient info banner */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
          <div>
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-1.5">
              <User className="h-3.5 w-3.5 text-slate-400" />
              Customer / Recipient Name
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Customer Name"
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg outline-none font-semibold text-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-1.5">
              <Phone className="h-3.5 w-3.5 text-slate-400" />
              WhatsApp Mobile Number
            </label>
            <div className="relative">
              <input
                type="text"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="e.g. 9876543210 (10 digits)"
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg outline-none font-semibold text-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <span className="text-[10px] text-slate-400 font-medium block mt-1">
              Formatted target: {formatWhatsAppPhone(phone) || 'Not provided (will prompt contact selection)'}
            </span>
          </div>
        </div>

        {/* Message preview and editor */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-slate-400" />
              WhatsApp Message Preview & Customizer
            </label>
            <span className="text-[11px] text-slate-400 font-medium">
              You can edit text before sending
            </span>
          </div>

          <div className="relative">
            <textarea
              rows={9}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-4 font-mono text-xs bg-slate-900 text-slate-100 rounded-xl border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none leading-relaxed shadow-inner"
            />
          </div>
        </div>

        {/* Informational Feature Box */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <Sparkles className="h-4 w-4 text-emerald-600" />
            <span>How PDF Bill Sharing Works on WhatsApp Web:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600">
            <div className="p-2 bg-white rounded-lg border border-slate-100 flex items-start gap-2">
              <span className="font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded text-[10px]">1</span>
              <span>
                <b>Auto-Generated PDF:</b> Generates and downloads <code className="bg-slate-100 px-1 py-0.2 rounded text-slate-700">Invoice-{sale.invoiceNumber}.pdf</code> to your browser downloads.
              </span>
            </div>
            <div className="p-2 bg-white rounded-lg border border-slate-100 flex items-start gap-2">
              <span className="font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded text-[10px]">2</span>
              <span>
                <b>Attach & Send:</b> In WhatsApp Web, drag the downloaded PDF into the chat or click <b>📎 (Attach) &rarr; Document</b>.
              </span>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 font-medium">
            💡 <i>Note:</i> WhatsApp deep links (`wa.me`) only carry text for security reasons. A direct <b>online view/download invoice link</b> is also included in the message so customers can open the PDF from anywhere.
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default WhatsAppShareModal;


