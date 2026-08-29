import React, { useState } from 'react';
import { Boxes } from 'lucide-react';
import { useInventory } from '../../hooks/useInventory';
import { Table } from '../../components/ui/Table';
import { Pagination } from '../../components/ui/Pagination';
import { Badge } from '../../components/ui/Badge';

export const InventoryHistory = () => {
  const [page, setPage] = useState(1);
  const { transactions, pagination, isLoading } = useInventory({ page, limit: 15 });

  const getActionBadge = (type) => {
    const variants = {
      OPENING: 'neutral',
      PURCHASE: 'success',
      SALE: 'info',
      SALE_RETURN: 'primary',
      PURCHASE_RETURN: 'warning',
      ADJUSTMENT_IN: 'success',
      ADJUSTMENT_OUT: 'danger',
    };
    return <Badge variant={variants[type] || 'neutral'}>{type.replace('_', ' ')}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 select-none">
        <Boxes className="h-6 w-6 text-slate-500" />
        <div>
          <h1 className="text-2xl font-bold text-slate-900 leading-none">Stock History</h1>
          <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mt-1">Audit trail of all inventory movements</span>
        </div>
      </div>

      <Table
        headers={['Product Details', 'Movement Type', 'Change Qty', 'Previous Qty', 'New Qty', 'Reason/Reference', 'Adjusted By', 'Date']}
        loading={isLoading}
      >
        {transactions.map((tx) => (
          <tr key={tx._id} className="hover:bg-slate-50 transition-colors">
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex flex-col">
                <span className="font-semibold text-slate-900 text-sm leading-snug">{tx.productId?.name || 'Deleted Product'}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">SKU: {tx.productId?.sku || '-'}</span>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap font-medium">
              {getActionBadge(tx.type)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-900">
              {tx.type.includes('OUT') || tx.type === 'SALE' || tx.type === 'PURCHASE_RETURN' ? '-' : '+'} {tx.quantity} {tx.productId?.unit || 'PCS'}
            </td>
            <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-500">
              {tx.previousQuantity}
            </td>
            <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-900">
              {tx.newQuantity}
            </td>
            <td className="px-6 py-4 font-medium text-slate-500 text-xs truncate max-w-[150px]">
              {tx.reason || '-'}
            </td>
            <td className="px-6 py-4 whitespace-nowrap font-semibold text-slate-700">
              {tx.createdBy?.name || 'System'}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 font-medium">
              {new Date(tx.createdAt).toLocaleString()}
            </td>
          </tr>
        ))}
        {transactions.length === 0 && !isLoading && (
          <tr>
            <td colSpan="8" className="px-6 py-8 text-center text-slate-400 font-medium">
              No stock movements recorded yet.
            </td>
          </tr>
        )}
      </Table>

      <Pagination
        page={page}
        totalPages={pagination?.totalPages || 1}
        onPageChange={(p) => setPage(p)}
        limit={15}
        total={pagination?.total || 0}
      />
    </div>
  );
};

export default InventoryHistory;
