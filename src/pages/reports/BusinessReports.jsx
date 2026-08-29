import React from 'react';
import { BarChart3, IndianRupee, FileSpreadsheet, Percent, ShieldCheck } from 'lucide-react';
import { useReports } from '../../hooks/useReports';
import { Card } from '../../components/ui/Card';
import { Loader } from '../../components/ui/Loader';
import { Badge } from '../../components/ui/Badge';

export const BusinessReports = () => {
  const { financialReport, isLoading } = useReports();

  if (isLoading) {
    return <Loader fullscreen />;
  }

  const {
    salesSummary = { revenue: 0, gstCollected: 0, cgst: 0, sgst: 0, igst: 0 },
    purchasesSummary = { expenditure: 0, gstPaid: 0, cgst: 0, sgst: 0, igst: 0 },
    gstPayableSummary = { netPayable: 0, isCredit: false },
    profitSummary = { grossProfit: 0, margin: 0 }
  } = financialReport || {};

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 select-none">
        <BarChart3 className="h-6 w-6 text-slate-500" />
        <div>
          <h1 className="text-2xl font-bold text-slate-900 leading-none">Financial Reports</h1>
          <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mt-1">Audit and compile business profit margins</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profit margin card */}
        <Card title="Workspace Profitability" subtitle="Gross Profit and Margins" className="md:col-span-1">
          <div className="space-y-6 py-2 select-none">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <IndianRupee className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Gross Profit</span>
                <span className="text-xl font-bold text-slate-950">₹ {profitSummary?.grossProfit?.toFixed(2) || '0.00'}</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                <Percent className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Profit Margin</span>
                <span className="text-xl font-bold text-slate-950">{profitSummary?.margin || 0} %</span>
              </div>
            </div>
          </div>
        </Card>

        {/* GST report */}
        <Card title="GST Return Summary" subtitle="Net liability logs" className="md:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2 select-none">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">GST Output Tax (Collected)</span>
              <span className="text-lg font-bold text-slate-900">₹ {salesSummary?.gstCollected?.toFixed(2) || '0.00'}</span>
              <p className="text-[10px] text-slate-400 leading-snug">Tax collected on client invoice billings</p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">GST Input Tax Credit (ITC)</span>
              <span className="text-lg font-bold text-slate-900">₹ {purchasesSummary?.gstPaid?.toFixed(2) || '0.00'}</span>
              <p className="text-[10px] text-slate-400 leading-snug">Tax credit claimed on supply purchases</p>
            </div>

            <div className="space-y-1.5 border-t sm:border-t-0 sm:border-l border-slate-100 pt-4 sm:pt-0 sm:pl-6">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Net Tax Payable</span>
              <h3 className={`text-lg font-bold ${gstPayableSummary?.isCredit ? 'text-emerald-600' : 'text-red-500'}`}>
                ₹ {gstPayableSummary?.netPayable?.toFixed(2) || '0.00'}
              </h3>
              <Badge variant={gstPayableSummary?.isCredit ? 'success' : 'danger'} className="text-[9px] uppercase">
                {gstPayableSummary?.isCredit ? 'Tax Credit' : 'Liability'}
              </Badge>
            </div>
          </div>
        </Card>
      </div>

      {/* Tally section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="Sales Billings breakdown" subtitle="CGST, SGST, IGST totals collected">
          <div className="space-y-3.5 select-none text-xs">
            <div className="flex justify-between font-semibold text-slate-500">
              <span>Total sales revenue (Excl. Tax)</span>
              <span>₹ {(salesSummary.revenue - salesSummary.gstCollected).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-slate-500 pl-2">
              <span>CGST collected</span>
              <span>₹ {salesSummary.cgst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-slate-500 pl-2">
              <span>SGST collected</span>
              <span>₹ {salesSummary.sgst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-slate-500 pl-2">
              <span>IGST collected</span>
              <span>₹ {salesSummary.igst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-slate-800 text-sm pt-2.5 border-t border-dashed border-slate-200">
              <span>Grand Total Collections</span>
              <span>₹ {salesSummary.revenue.toFixed(2)}</span>
            </div>
          </div>
        </Card>

        <Card title="Supply Procurement breakdown" subtitle="CGST, SGST, IGST input credits claimed">
          <div className="space-y-3.5 select-none text-xs">
            <div className="flex justify-between font-semibold text-slate-500">
              <span>Total supply cost (Excl. Tax)</span>
              <span>₹ {(purchasesSummary.expenditure - purchasesSummary.gstPaid).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-slate-500 pl-2">
              <span>CGST input credit</span>
              <span>₹ {purchasesSummary.cgst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-slate-500 pl-2">
              <span>SGST input credit</span>
              <span>₹ {purchasesSummary.sgst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-slate-500 pl-2">
              <span>IGST input credit</span>
              <span>₹ {purchasesSummary.igst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-slate-800 text-sm pt-2.5 border-t border-dashed border-slate-200">
              <span>Grand Total Expenditures</span>
              <span>₹ {purchasesSummary.expenditure.toFixed(2)}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BusinessReports;
