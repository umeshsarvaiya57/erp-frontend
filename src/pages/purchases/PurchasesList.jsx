import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Plus } from 'lucide-react';
import { usePurchases } from '../../hooks/usePurchases';
import { Table } from '../../components/ui/Table';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { SearchInput } from '../../components/ui/SearchInput';
import { Pagination } from '../../components/ui/Pagination';

export const PurchasesList = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const { purchases, pagination, isLoading } = usePurchases({
    page,
    limit: 10,
    search,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap select-none">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-6 w-6 text-slate-500" />
          <div>
            <h1 className="text-2xl font-bold text-slate-900 leading-none">Purchase Orders</h1>
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mt-1">Manage vendor stock orders</span>
          </div>
        </div>
        <Button
          variant="primary"
          startIcon={<Plus className="h-4 w-4" />}
          onClick={() => navigate('/purchases/new')}
        >
          New Purchase Order
        </Button>
      </div>

      <Card className="p-4" bodyClassName="flex items-center">
        <SearchInput
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search Purchase Order Number (e.g. PUR-000001)..."
        />
      </Card>

      <Table
        headers={['PO Number', 'Supplier Name', 'Grand Total', 'Paid', 'Due Amount', 'Payment', 'Date']}
        loading={isLoading}
      >
        {purchases.map((pur) => (
          <tr key={pur._id} className="hover:bg-slate-50 transition-colors">
            <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-900">
              {pur.purchaseNumber}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex flex-col">
                <span className="font-semibold text-slate-900 text-sm leading-snug">{pur.supplierId?.name || 'Unknown Supplier'}</span>
                <span className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5">{pur.supplierId?.mobile || '-'}</span>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap font-semibold text-slate-900">
              ₹ {pur.grandTotal.toFixed(2)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-600">
              ₹ {pur.paidAmount.toFixed(2)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              {pur.dueAmount > 0 ? (
                <span className="font-bold text-red-500">₹ {pur.dueAmount.toFixed(2)}</span>
              ) : (
                <span className="font-medium text-slate-400">-</span>
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 font-bold">
              {pur.paymentMethod}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 font-medium">
              {new Date(pur.createdAt).toLocaleDateString()}
            </td>
          </tr>
        ))}
        {purchases.length === 0 && !isLoading && (
          <tr>
            <td colSpan="7" className="px-6 py-12 text-center text-slate-400 font-medium">
              No purchase orders recorded yet. Click "New Purchase Order" to register one.
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

export default PurchasesList;
