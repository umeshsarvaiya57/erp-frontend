import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Plus, Printer, RefreshCw, Eye, MessageSquare } from 'lucide-react';
import { useSales } from '../../hooks/useSales';
import { Table } from '../../components/ui/Table';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { SearchInput } from '../../components/ui/SearchInput';
import { Pagination } from '../../components/ui/Pagination';
import { useAuth } from '../../hooks/useAuth';
import { WhatsAppShareModal } from '../../components/sales/WhatsAppShareModal';

export const SalesList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedSaleForWhatsApp, setSelectedSaleForWhatsApp] = useState(null);

  const { sales, pagination, isLoading, cancelSale, isCancelling } = useSales({
    page,
    limit: 10,
    search,
  });

  const handleCancelInvoice = (id, invoiceNo) => {
    if (confirm(`Are you sure you want to cancel and reverse Invoice ${invoiceNo}? This action is irreversible and restores stock levels.`)) {
      cancelSale(id);
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'COMPLETED') return <Badge variant="success">Completed</Badge>;
    if (status === 'CANCELLED') return <Badge variant="danger">Cancelled</Badge>;
    return <Badge variant="warning">{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap select-none">
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-6 w-6 text-slate-500" />
          <div>
            <h1 className="text-2xl font-bold text-slate-900 leading-none">Sales Invoices</h1>
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mt-1">View and manage customer billings</span>
          </div>
        </div>
        <Button
          variant="primary"
          startIcon={<Plus className="h-4 w-4" />}
          onClick={() => navigate('/sales/new')}
        >
          New Sales Invoice
        </Button>
      </div>

      <Card className="p-4" bodyClassName="flex items-center">
        <SearchInput
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search Invoice Number (e.g. INV-000001)..."
        />
      </Card>

      <Table
        headers={['Invoice No', 'Customer Name', 'Grand Total', 'Paid', 'Due Amount', 'Payment', 'Status', 'Date', 'Actions']}
        loading={isLoading}
      >
        {sales.map((sale) => (
          <tr key={sale._id} className="hover:bg-slate-50 transition-colors">
            <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-900">
              {sale.invoiceNumber}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex flex-col">
                <span className="font-semibold text-slate-900 text-sm leading-snug">{sale.customerId?.name || 'Walk-in Customer'}</span>
                <span className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5">{sale.customerId?.mobile || '-'}</span>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap font-semibold text-slate-900">
              ₹ {sale.grandTotal.toFixed(2)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-600">
              ₹ {sale.paidAmount.toFixed(2)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              {sale.dueAmount > 0 ? (
                <span className="font-bold text-red-500">₹ {sale.dueAmount.toFixed(2)}</span>
              ) : (
                <span className="font-medium text-slate-400">-</span>
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 font-bold">
              {sale.paymentMethod}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              {getStatusBadge(sale.status)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 font-medium">
              {new Date(sale.createdAt).toLocaleDateString()}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center gap-1">
                <Button
                  variant="text"
                  size="sm"
                  startIcon={<Eye className="h-4 w-4" />}
                  onClick={() => navigate(`/invoices/${sale._id}`)}
                >
                  View
                </Button>
                <Button
                  variant="text"
                  size="sm"
                  startIcon={
                    <svg className="h-4 w-4 fill-emerald-600" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                    </svg>
                  }
                  onClick={() => setSelectedSaleForWhatsApp(sale)}
                  className="text-emerald-700 hover:bg-emerald-50"
                  title="Send Invoice over WhatsApp"
                >
                  WhatsApp
                </Button>
                <Button
                  variant="text"
                  size="sm"
                  startIcon={<Printer className="h-4 w-4" />}
                  onClick={() => navigate(`/invoices/${sale._id}?print=true`)}
                  className="text-slate-600 hover:bg-slate-100"
                >
                  Print
                </Button>
                {sale.status !== 'CANCELLED' && (
                  <Button
                    variant="text"
                    size="sm"
                    startIcon={<RefreshCw className="h-4 w-4" />}
                    onClick={() => handleCancelInvoice(sale._id, sale.invoiceNumber)}
                    className="text-red-500 hover:bg-red-50 hover:text-red-700"
                    loading={isCancelling}
                  >
                    Return
                  </Button>
                )}
              </div>
            </td>
          </tr>
        ))}
        {sales.length === 0 && !isLoading && (
          <tr>
            <td colSpan="9" className="px-6 py-12 text-center text-slate-400 font-medium">
              No sales invoices found. Click "New Sales Invoice" to build one.
            </td>
          </tr>
        )}
      </Table>

      <Pagination
        page={page}
        totalPages={pagination?.totalPages || 1}
        onPageChange={(p) => setPage(p)}
        limit={10}
        total={pagination?.total || 0}
      />

      {/* WhatsApp Share Modal */}
      <WhatsAppShareModal
        isOpen={!!selectedSaleForWhatsApp}
        onClose={() => setSelectedSaleForWhatsApp(null)}
        sale={selectedSaleForWhatsApp}
        business={selectedSaleForWhatsApp?.businessId || user?.business}
      />
    </div>
  );
};

export default SalesList;

