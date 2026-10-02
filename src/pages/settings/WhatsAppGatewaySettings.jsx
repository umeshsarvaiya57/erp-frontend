import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  MessageSquare, 
  QrCode, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Send, 
  Power, 
  Smartphone, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { whatsappApi } from '../../api/whatsappApi';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { TextField } from '../../components/ui/TextField';
import { toast } from '../../components/ui/toast/toastService';

export const WhatsAppGatewaySettings = () => {
  const queryClient = useQueryClient();
  const [testPhone, setTestPhone] = useState('');
  const [testMessage, setTestMessage] = useState('👋 Hello! This is a test message from your MyERP WhatsApp Gateway. Your automated bill notifications are configured properly!');

  // Query WhatsApp status with polling when connecting
  const { data: statusData, isLoading, refetch } = useQuery({
    queryKey: ['whatsapp-status'],
    queryFn: async () => {
      const res = await whatsappApi.getStatus();
      return res.data;
    },
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      // Poll every 3 seconds while connecting or showing QR code
      if (status === 'connecting' || query.state.data?.qrCode) return 3000;
      return 15000; // Poll every 15s otherwise
    },
  });

  const initMutation = useMutation({
    mutationFn: whatsappApi.initialize,
    onSuccess: (res) => {
      queryClient.setQueryData(['whatsapp-status'], res.data);
      toast.success('WhatsApp Gateway initialization started. Scan the QR code with WhatsApp.');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to initialize WhatsApp Gateway.');
    },
  });

  const logoutMutation = useMutation({
    mutationFn: whatsappApi.logout,
    onSuccess: (res) => {
      queryClient.setQueryData(['whatsapp-status'], res.data);
      toast.info('Disconnected from WhatsApp.');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to disconnect WhatsApp.');
    },
  });

  const toggleAutoSendMutation = useMutation({
    mutationFn: (enabled) => whatsappApi.toggleAutoSend(enabled),
    onSuccess: (res) => {
      queryClient.setQueryData(['whatsapp-status'], res.data);
      toast.success(res.message);
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to update auto-send preference.');
    },
  });

  const testMessageMutation = useMutation({
    mutationFn: whatsappApi.sendTestMessage,
    onSuccess: (res) => {
      toast.success(res.message || 'Test message sent successfully!');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to send test WhatsApp message.');
    },
  });

  const status = statusData?.status || 'disconnected';
  const isConnected = statusData?.isConnected || false;
  const isConnecting = statusData?.isConnecting || false;
  const qrCode = statusData?.qrCode;
  const connectedNumber = statusData?.connectedNumber;
  const autoSendEnabled = statusData?.autoSendEnabled ?? true;

  const handleSendTest = (e) => {
    e.preventDefault();
    if (!testPhone.trim()) {
      toast.error('Please enter a valid 10-digit mobile number for the test.');
      return;
    }
    testMessageMutation.mutate({ phone: testPhone, message: testMessage });
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header Banner */}
      <div className="flex items-center justify-between gap-4 flex-wrap select-none">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500 text-white rounded-2xl shadow-md shadow-emerald-500/20">
            <MessageSquare className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 leading-none">WhatsApp Auto-Send Gateway</h1>
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mt-1">
              Self-Hosted WhatsApp Connection for 100% Automated Bill Delivery
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            startIcon={<RefreshCw className="h-4 w-4" />}
          >
            Refresh Status
          </Button>

          {isConnected ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => logoutMutation.mutate()}
              loading={logoutMutation.isPending}
              className="text-red-600 hover:bg-red-50 border-red-200"
              startIcon={<Power className="h-4 w-4" />}
            >
              Disconnect Phone
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={() => initMutation.mutate()}
              loading={initMutation.isPending || isConnecting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-600/20"
              startIcon={<QrCode className="h-4 w-4" />}
            >
              {isConnecting ? 'Connecting...' : 'Connect WhatsApp (Scan QR)'}
            </Button>
          )}
        </div>
      </div>

      {/* Main Grid: Status & QR Code */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Connection Box & Instruction Guide */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-900">Device Connection Status</h3>
                <p className="text-xs text-slate-500">Live link to your store's WhatsApp mobile account</p>
              </div>

              {/* Status Badge */}
              {isConnected ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold shadow-sm">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active & Connected
                </span>
              ) : isConnecting ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-bold">
                  <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping"></span>
                  Waiting for QR Scan...
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-600 border border-slate-200 rounded-full text-xs font-bold">
                  <span className="h-2 w-2 rounded-full bg-slate-400"></span>
                  Disconnected
                </span>
              )}
            </div>

            {/* If Connected */}
            {isConnected && (
              <div className="p-5 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-sm">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-emerald-950">WhatsApp Auto-Sender Ready!</h4>
                    <p className="text-xs text-emerald-800 font-medium mt-0.5">
                      Connected Number: <b className="text-emerald-950">+{connectedNumber}</b>
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-emerald-200/60 flex items-center justify-between text-xs font-medium text-emerald-900 flex-wrap gap-2">
                  <span>⚡ Every newly recorded sale will automatically send a WhatsApp bill to customer mobile numbers.</span>
                </div>
              </div>
            )}

            {/* If QR Code is Available */}
            {!isConnected && qrCode && (
              <div className="flex flex-col sm:flex-row items-center gap-8 p-6 bg-slate-50 border border-slate-200 rounded-2xl">
                <div className="p-3 bg-white border border-slate-200 rounded-2xl shadow-sm shrink-0 text-center">
                  <img src={qrCode} alt="WhatsApp QR Code" className="w-56 h-56 mx-auto object-contain" />
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-2">
                    Scan with WhatsApp on phone
                  </span>
                </div>

                <div className="space-y-3 flex-1 text-xs text-slate-700">
                  <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                    <Smartphone className="h-4 w-4 text-emerald-600" />
                    How to Link in 3 Steps:
                  </h4>
                  <ol className="space-y-2 list-decimal list-inside font-medium leading-relaxed text-slate-600">
                    <li>Open <b>WhatsApp</b> on your store mobile phone.</li>
                    <li>Tap <b>Menu (⋮)</b> or <b>Settings &rarr; Linked Devices</b>.</li>
                    <li>Tap <b>Link a Device</b> and point your camera at this QR code.</li>
                  </ol>
                  <div className="p-2.5 bg-amber-50 text-amber-900 rounded-lg border border-amber-200 text-[11px] font-medium">
                    ⏱️ <i>QR codes expire every 40 seconds.</i> If it times out, click <b>Refresh Status</b> or reconnect.
                  </div>
                </div>
              </div>
            )}

            {/* If Disconnected and No QR shown */}
            {!isConnected && !qrCode && !isConnecting && (
              <div className="text-center py-10 px-4 space-y-4 border border-dashed border-slate-200 rounded-2xl">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                  <QrCode className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">No Active WhatsApp Session</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                    Click the green button below to generate a new QR code and link your shop's WhatsApp phone.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="primary"
                  onClick={() => initMutation.mutate()}
                  loading={initMutation.isPending}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                  startIcon={<QrCode className="h-4 w-4" />}
                >
                  Generate QR Code
                </Button>
              </div>
            )}
          </Card>

          {/* Automatic Sending Behavior Toggle */}
          <Card className="p-6">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900">Automatic Invoice Sending Trigger</h3>
                <p className="text-xs text-slate-500">
                  When enabled, creating a sale invoice automatically sends the bill message and PDF link to the customer.
                </p>
              </div>

              <button
                type="button"
                onClick={() => toggleAutoSendMutation.mutate(!autoSendEnabled)}
                disabled={toggleAutoSendMutation.isPending}
                className={`
                  p-1.5 rounded-full transition-colors flex items-center
                  ${autoSendEnabled ? 'text-emerald-600' : 'text-slate-400'}
                `}
                title={autoSendEnabled ? 'Auto-send Enabled (Click to disable)' : 'Auto-send Disabled (Click to enable)'}
              >
                {autoSendEnabled ? (
                  <ToggleRight className="h-9 w-9 text-emerald-600" />
                ) : (
                  <ToggleLeft className="h-9 w-9 text-slate-300" />
                )}
              </button>
            </div>
          </Card>
        </div>

        {/* Right 1 Col: Test Message Sender & Info */}
        <div className="space-y-6">
          <Card title="Test WhatsApp Sender" subtitle="Verify delivery to any number">
            <form onSubmit={handleSendTest} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Recipient Mobile Number
                </label>
                <input
                  type="text"
                  value={testPhone}
                  onChange={(e) => setTestPhone(e.target.value)}
                  placeholder="e.g. 9876543210 (10 digits)"
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg outline-none font-semibold text-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Test Message Content
                </label>
                <textarea
                  rows={4}
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  className="w-full p-3 font-sans text-xs bg-slate-50 text-slate-800 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none leading-relaxed"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                disabled={!isConnected}
                loading={testMessageMutation.isPending}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                startIcon={<Send className="h-4 w-4" />}
              >
                {isConnected ? 'Send Test WhatsApp' : 'Connect WhatsApp First'}
              </Button>
            </form>
          </Card>

          {/* Security & Zero Fees Info */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs text-slate-600">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>100% Free & Self-Hosted</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-500">
              This gateway runs directly inside your Node.js backend using WhatsApp Web multi-device sessions. No Meta fees, no third-party SMS costs, and no monthly subscriptions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppGatewaySettings;
