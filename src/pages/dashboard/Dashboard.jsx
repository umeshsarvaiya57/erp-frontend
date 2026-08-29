import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { 
  LayoutDashboard, 
  IndianRupee, 
  ShoppingBag, 
  ShoppingCart, 
  Users2, 
  AlertTriangle,
  PackageCheck,
  History
} from 'lucide-react';
import { useDashboard } from '../../hooks/useDashboard';
import { Card } from '../../components/ui/Card';
import { Loader } from '../../components/ui/Loader';
import { Badge } from '../../components/ui/Badge';
import { Table } from '../../components/ui/Table';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { stats, isLoading } = useDashboard();

  if (isLoading) {
    return <Loader fullscreen />;
  }

  const { metrics, chartData = [], topProducts = [], recentActivities = [] } = stats || {};

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2 select-none">
        <LayoutDashboard className="h-6 w-6 text-slate-500" />
        <div>
          <h1 className="text-2xl font-bold text-slate-900 leading-none">Dashboard Overview</h1>
          <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mt-1">Real-time business performance metrics</span>
        </div>
      </div>

      {/* Analytics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-primary-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg shadow-primary-500/10 flex flex-col justify-between h-36 select-none relative overflow-hidden">
          <div className="absolute right-2 top-2 text-white/10 shrink-0"><ShoppingBag className="h-20 w-20" /></div>
          <span className="text-xs font-bold text-white/80 uppercase tracking-widest leading-none">Total Sales</span>
          <div className="space-y-1">
            <h2 className="text-2xl font-black tracking-tight flex items-center gap-1 leading-none">
              <IndianRupee className="h-5 w-5 shrink-0" />
              {metrics?.totalSales?.toFixed(2) || '0.00'}
            </h2>
            <p className="text-[10px] text-white/60 font-semibold leading-none pt-1">Completed sale invoices</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-950 rounded-2xl p-6 text-white shadow-lg flex flex-col justify-between h-36 select-none relative overflow-hidden">
          <div className="absolute right-2 top-2 text-white/5 shrink-0"><ShoppingCart className="h-20 w-20" /></div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Purchases Cost</span>
          <div className="space-y-1">
            <h2 className="text-2xl font-black tracking-tight flex items-center gap-1 leading-none">
              <IndianRupee className="h-5 w-5 shrink-0" />
              {metrics?.totalPurchases?.toFixed(2) || '0.00'}
            </h2>
            <p className="text-[10px] text-slate-500 font-semibold leading-none pt-1">Stock procurement costs</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-rose-500 to-red-600 rounded-2xl p-6 text-white shadow-lg shadow-rose-500/10 flex flex-col justify-between h-36 select-none relative overflow-hidden">
          <div className="absolute right-2 top-2 text-white/10 shrink-0"><Users2 className="h-20 w-20" /></div>
          <span className="text-xs font-bold text-white/80 uppercase tracking-widest leading-none">Customer Receivables</span>
          <div className="space-y-1">
            <h2 className="text-2xl font-black tracking-tight flex items-center gap-1 leading-none">
              <IndianRupee className="h-5 w-5 shrink-0" />
              {metrics?.customerOutstandings?.toFixed(2) || '0.00'}
            </h2>
            <p className="text-[10px] text-white/60 font-semibold leading-none pt-1">Pending payments from clients</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg shadow-amber-500/10 flex flex-col justify-between h-36 select-none relative overflow-hidden">
          <div className="absolute right-2 top-2 text-white/10 shrink-0"><AlertTriangle className="h-20 w-20" /></div>
          <span className="text-xs font-bold text-white/80 uppercase tracking-widest leading-none">Low Stock Alerts</span>
          <div className="space-y-1">
            <h2 className="text-2xl font-black tracking-tight flex items-center gap-1.5 leading-none">
              {metrics?.lowStockCount || 0}
            </h2>
            <p className="text-[10px] text-white/60 font-semibold leading-none pt-1">Items at or below stock limits</p>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <Card title="Sales & Purchase Trends" subtitle="Financial patterns over the last 7 days">
        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorPurchases" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0f172a" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#0f172a" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              <Area 
                name="Sales Invoice Total" 
                type="monotone" 
                dataKey="sales" 
                stroke="#4f46e5" 
                strokeWidth={2} 
                fillOpacity={1} 
                fill="url(#colorSales)" 
              />
              <Area 
                name="Purchase Order Cost" 
                type="monotone" 
                dataKey="purchases" 
                stroke="#0f172a" 
                strokeWidth={2} 
                fillOpacity={1} 
                fill="url(#colorPurchases)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Bottom split columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top items sold */}
        <Card title="Top Selling Products" subtitle="Top 5 products by quantity sold">
          <Table headers={['Product Name', 'Quantity Sold', 'Revenue Collected']}>
            {topProducts.map((p, idx) => (
              <tr key={idx} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <span className="h-6 w-6 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-700">
                      {idx + 1}
                    </span>
                    <span className="font-semibold text-slate-900 text-sm">{p.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-700 text-sm">
                  {p.quantity} Units
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-bold text-emerald-600 text-sm">
                  ₹ {p.revenue.toFixed(2)}
                </td>
              </tr>
            ))}
            {topProducts.length === 0 && (
              <tr>
                <td colSpan="3" className="px-6 py-8 text-center text-slate-400 font-semibold">
                  No sales transactions logged yet.
                </td>
              </tr>
            )}
          </Table>
        </Card>

        {/* Live activities log */}
        <Card title="Recent Activity Timeline" subtitle="Audit log of client CRM interactions">
          <div className="space-y-4 pt-2">
            {recentActivities.map((act) => (
              <div key={act._id} className="flex gap-4 items-start select-none">
                <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-slate-600">
                  <History className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-800 leading-snug whitespace-normal break-words">
                    {act.description}
                  </p>
                  <span className="text-[10px] text-slate-400 font-semibold block mt-1 uppercase">
                    By {act.createdBy?.name || 'System'} • {new Date(act.createdAt).toLocaleTimeString()}
                  </span>
                </div>
                <Badge variant="neutral" className="text-[9px]">
                  {act.type.replace('_', ' ')}
                </Badge>
              </div>
            ))}
            {recentActivities.length === 0 && (
              <div className="py-8 text-center text-slate-400 font-medium select-none">
                No recent workspace timeline actions logged.
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
