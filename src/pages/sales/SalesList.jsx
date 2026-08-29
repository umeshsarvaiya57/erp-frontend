import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Plus, Printer, RefreshCw, Eye } from 'lucide-react';
import { useSales } from '../../hooks/useSales';
import { Table } from '../../components/ui/Table';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { SearchInput } from '../../components/ui/SearchInput';
import { Pagination } from '../../components/ui/Pagination';

export const SalesList = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

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
    </div>
  );
};

export default SalesList;
