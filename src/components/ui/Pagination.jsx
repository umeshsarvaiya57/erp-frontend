import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';

export const Pagination = ({
  page = 1,
  totalPages = 1,
  onPageChange,
  limit = 20,
  total = 0
}) => {
  if (totalPages <= 1) return null;

  const startEntry = (page - 1) * limit + 1;
  const endEntry = Math.min(page * limit, total);

  return (
    <div className="flex items-center justify-between border-t border-slate-100 bg-white px-6 py-4 flex-wrap gap-4 select-none shrink-0 rounded-b-2xl">
      <div className="text-xs text-slate-500 font-medium">
        Showing <span className="font-semibold text-slate-900">{startEntry}</span> to{' '}
        <span className="font-semibold text-slate-900">{endEntry}</span> of{' '}
        <span className="font-semibold text-slate-900">{total}</span> entries
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          startIcon={<ChevronLeft className="h-4 w-4" />}
        >
          Previous
        </Button>
        <div className="text-xs font-bold text-slate-600 px-3 uppercase tracking-wider">
          Page {page} of {totalPages}
        </div>
        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          endIcon={<ChevronRight className="h-4 w-4" />}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
