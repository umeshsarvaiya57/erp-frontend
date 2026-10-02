import React, { useState } from 'react';
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
  History,
  RotateCw,
  Plus,
  ArrowUpRight,
  TrendingUp,
  Receipt,
  Truck,
  Eye,
  FileText,
  Boxes,
  CheckCircle2
} from 'lucide-react';
import { useDashboard } from '../../hooks/useDashboard';
import { Card } from '../../components/ui/Card';
import { Loader } from '../../components/ui/Loader';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { stats, isLoading, isFetching, refetch, dataUpdatedAt } = useDashboard();
  const [activeTab, setActiveTab] = useState('activities'); // 'activities' or 'sales'

  if (isLoading && !stats) {
    return <Loader fullscreen />;
  }

  const { 
    metrics = {}, 
    chartData = [], 
    topProducts = [], 
    lowStockProducts = [], 
    recentActivities = [], 
    recentSales = [] 
  } = stats || {};

  // Format currency helper
  const formatCurrency = (amount) => {
    return Number(amount || 0).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const formattedTime = dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString() : 'Live';

  // Calculate chart totals for header badges
  const total7DaySales = chartData.reduce((acc, curr) => acc + (curr.sales || 0), 0);
  const total7DayPurchases = chartData.reduce((acc, curr) => acc + (curr.purchases || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header & Quick Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 select-none pb-2 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary-50 border border-primary-200/60 flex items-center justify-center text-primary-600 shadow-sm">
            <LayoutDashboard className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight leading-none">Dashboard Overview</h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Live Synced • {formattedTime}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">Real-time business performance & sales telemetry</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            loading={isFetching}
            startIcon={<RotateCw className={`h-3.5 w-3.5 ${isFetching ? 'animate-spin' : ''}`} />}
            className="text-slate-600 hover:text-slate-900 border-slate-200 text-xs font-semibold"
          >
            Refresh
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/sales/new')}
            startIcon={<Plus className="h-3.5 w-3.5" />}
            className="text-xs font-bold shadow-sm shadow-primary-500/20"
          >
            New Invoice
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/purchases/new')}
            startIcon={<ShoppingCart className="h-3.5 w-3.5 text-slate-600" />}
            className="text-xs font-semibold text-slate-700 border-slate-200 hidden sm:inline-flex"
          >
            New Purchase
          </Button>
        </div>
      </div>

      {/* Primary Analytics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sales Card */}
        <div 
          onClick={() => navigate('/sales')}
          className="cursor-pointer group bg-gradient-to-br from-indigo-600 via-primary-600 to-indigo-700 rounded-2xl p-5 text-white shadow-lg shadow-indigo-600/15 flex flex-col justify-between h-36 select-none relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-indigo-600/25 hover:-translate-y-0.5"
        >
          <div className="absolute -right-3 -bottom-3 text-white/10 group-hover:text-white/15 transition-colors">
            <ShoppingBag className="h-28 w-28" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-white/80 uppercase tracking-wider">Total Sales</span>
            <span className="text-[10px] bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full font-bold">
              {metrics.totalInvoices || 0} Invoices
            </span>
          </div>
          <div className="space-y-0.5">
            <h2 className="text-2xl font-black tracking-tight flex items-center leading-none">
              <span className="text-lg mr-0.5">₹</span>
              {formatCurrency(metrics.totalSales)}
            </h2>
            <p className="text-[11px] text-white/70 font-medium">All completed sales revenue</p>
          </div>
        </div>

        {/* Today's Sales Card */}
        <div 
          onClick={() => navigate('/sales')}
          className="cursor-pointer group bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-5 text-white shadow-lg shadow-emerald-600/15 flex flex-col justify-between h-36 select-none relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-emerald-600/25 hover:-translate-y-0.5"
        >
          <div className="absolute -right-3 -bottom-3 text-white/10 group-hover:text-white/15 transition-colors">
            <TrendingUp className="h-28 w-28" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-white/80 uppercase tracking-wider">Today's Sales</span>
            <span className="text-[10px] bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full font-bold">
              {metrics.todayInvoices || 0} Today
            </span>
          </div>
          <div className="space-y-0.5">
            <h2 className="text-2xl font-black tracking-tight flex items-center leading-none">
              <span className="text-lg mr-0.5">₹</span>
              {formatCurrency(metrics.todaySales)}
            </h2>
            <p className="text-[11px] text-white/70 font-medium">Sales recorded today</p>
          </div>
        </div>

        {/* Purchases Cost Card */}
        <div 
          onClick={() => navigate('/purchases')}
          className="cursor-pointer group bg-gradient-to-br from-slate-800 to-slate-950 rounded-2xl p-5 text-white shadow-lg shadow-slate-900/15 flex flex-col justify-between h-36 select-none relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-slate-900/25 hover:-translate-y-0.5"
        >
          <div className="absolute -right-3 -bottom-3 text-white/5 group-hover:text-white/10 transition-colors">
            <ShoppingCart className="h-28 w-28" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Purchases Cost</span>
            <span className="text-[10px] bg-white/10 backdrop-blur-sm px-2 py-0.5 rounded-full font-bold text-slate-300">
              {metrics.totalPurchaseOrders || 0} Orders
            </span>
          </div>
          <div className="space-y-0.5">
            <h2 className="text-2xl font-black tracking-tight flex items-center leading-none">
              <span className="text-lg mr-0.5">₹</span>
              {formatCurrency(metrics.totalPurchases)}
            </h2>
            <p className="text-[11px] text-slate-400 font-medium">Procurement expenditures</p>
          </div>
        </div>

        {/* Customer Receivables (Due) Card */}
        <div 
          onClick={() => navigate('/customers')}
          className="cursor-pointer group bg-gradient-to-br from-rose-500 via-rose-600 to-red-600 rounded-2xl p-5 text-white shadow-lg shadow-rose-500/15 flex flex-col justify-between h-36 select-none relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-rose-500/25 hover:-translate-y-0.5"
        >
          <div className="absolute -right-3 -bottom-3 text-white/10 group-hover:text-white/15 transition-colors">
            <Users2 className="h-28 w-28" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-white/80 uppercase tracking-wider">Customer Receivables</span>
            <span className="text-[10px] bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full font-bold">
              {metrics.totalCustomers || 0} Clients
            </span>
          </div>
          <div className="space-y-0.5">
            <h2 className="text-2xl font-black tracking-tight flex items-center leading-none">
              <span className="text-lg mr-0.5">₹</span>
              {formatCurrency(metrics.customerOutstandings)}
            </h2>
            <p className="text-[11px] text-white/70 font-medium">Pending payments due from customers</p>
          </div>
        </div>
      </div>

      {/* Secondary KPI Quick Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Supplier Payables</span>
            <span className="text-sm font-bold text-slate-800 flex items-center mt-0.5">
              ₹ {formatCurrency(metrics.supplierOutstandings)}
            </span>
          </div>
          <div className="h-8 w-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Truck className="h-4 w-4" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Paid Sales Collected</span>
            <span className="text-sm font-bold text-emerald-600 flex items-center mt-0.5">
              ₹ {formatCurrency(metrics.totalPaidSales)}
            </span>
          </div>
          <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="h-4 w-4" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Catalog Products</span>
            <span className="text-sm font-bold text-slate-800 flex items-center mt-0.5">
              {metrics.totalProducts || 0} Active Items
            </span>
          </div>
          <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Boxes className="h-4 w-4" />
          </div>
        </div>

        <div 
          onClick={() => navigate('/products')}
          className="cursor-pointer bg-white border border-slate-200/80 hover:border-amber-300 rounded-xl p-3.5 flex items-center justify-between shadow-xs transition-colors"
        >
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Low Stock Alerts</span>
            <span className={`text-sm font-bold flex items-center mt-0.5 ${(metrics.lowStockCount || 0) > 0 ? 'text-amber-600' : 'text-slate-800'}`}>
              {metrics.lowStockCount || 0} Products
            </span>
          </div>
          <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${(metrics.lowStockCount || 0) > 0 ? 'bg-amber-100 text-amber-600 animate-pulse' : 'bg-slate-100 text-slate-500'}`}>
            <AlertTriangle className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <Card 
        title="Sales & Purchase Trends" 
        subtitle="Financial cash flow & order patterns over the last 7 days"
        headerAction={
          <div className="flex items-center gap-3 text-xs font-semibold">
            <div className="flex items-center gap-1.5 text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
              <span className="h-2 w-2 rounded-full bg-indigo-600"></span>
              7D Sales: ₹{formatCurrency(total7DaySales)}
            </div>
            <div className="flex items-center gap-1.5 text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg hidden sm:flex">
              <span className="h-2 w-2 rounded-full bg-slate-700"></span>
              7D Purchases: ₹{formatCurrency(total7DayPurchases)}
            </div>
          </div>
        }
      >
        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorPurchases" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0f172a" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#0f172a" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis 
                stroke="#94a3b8" 
                fontSize={11} 
                tickLine={false} 
                axisLine={false}
                tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
              />
              <Tooltip 
                formatter={(value) => [`₹ ${Number(value).toFixed(2)}`, '']}
                contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              <Area 
                name="Sales Revenue" 
                type="monotone" 
                dataKey="sales" 
                stroke="#4f46e5" 
                strokeWidth={2.5} 
                fillOpacity={1} 
                fill="url(#colorSales)" 
              />
              <Area 
                name="Purchase Cost" 
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

      {/* Split Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Products */}
        <Card 
          title="Top Selling Products" 
          subtitle="Top 5 items ranked by sales volume & revenue"
          headerAction={
            <Button
              variant="text"
              size="sm"
              onClick={() => navigate('/products')}
              className="text-primary-600 text-xs font-semibold p-0 hover:bg-transparent flex items-center gap-1"
            >
              View Inventory <ArrowUpRight className="h-3.5 w-3.5" />
            </Button>
          }
        >
          <Table headers={['Rank', 'Product Name', 'Volume Sold', 'Revenue']}>
            {topProducts.map((p, idx) => (
              <tr key={idx} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-3.5 whitespace-nowrap">
                  <span className={`h-6 w-6 rounded-lg flex items-center justify-center font-bold text-xs ${
                    idx === 0 ? 'bg-amber-100 text-amber-800' :
                    idx === 1 ? 'bg-slate-200 text-slate-800' :
                    idx === 2 ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {idx + 1}
                  </span>
                </td>
                <td className="px-6 py-3.5 whitespace-nowrap">
                  <span className="font-semibold text-slate-900 text-sm">{p.name}</span>
                </td>
                <td className="px-6 py-3.5 whitespace-nowrap font-bold text-slate-700 text-sm">
                  {p.quantity} Units
                </td>
                <td className="px-6 py-3.5 whitespace-nowrap font-bold text-emerald-600 text-sm">
                  ₹ {formatCurrency(p.revenue)}
                </td>
              </tr>
            ))}
            {topProducts.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-slate-400 font-semibold">
                  No sales transactions logged yet. Create invoices to track top items.
                </td>
              </tr>
            )}
          </Table>
        </Card>

        {/* Recent Invoices / Activity toggle */}
        <Card
          title={
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('activities')}
                className={`text-sm font-bold pb-0.5 border-b-2 transition-colors ${
                  activeTab === 'activities' 
                    ? 'border-primary-600 text-slate-900' 
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                Recent Activity
              </button>
              <span className="text-slate-300">|</span>
              <button
                type="button"
                onClick={() => setActiveTab('sales')}
                className={`text-sm font-bold pb-0.5 border-b-2 transition-colors ${
                  activeTab === 'sales' 
                    ? 'border-primary-600 text-slate-900' 
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                Latest Invoices
              </button>
            </div>
          }
          subtitle={activeTab === 'activities' ? 'Real-time audit telemetry' : 'Recently generated customer bills'}
          headerAction={
            <Button
              variant="text"
              size="sm"
              onClick={() => navigate(activeTab === 'activities' ? '/activities' : '/sales')}
              className="text-primary-600 text-xs font-semibold p-0 hover:bg-transparent flex items-center gap-1"
            >
              View All <ArrowUpRight className="h-3.5 w-3.5" />
            </Button>
          }
        >
          {activeTab === 'activities' && (
            <div className="space-y-3.5 pt-2">
              {recentActivities.map((act) => (
                <div key={act._id} className="flex gap-3.5 items-start select-none group">
                  <div className="h-8 w-8 rounded-xl bg-slate-100 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors flex items-center justify-center shrink-0 text-slate-600 mt-0.5">
                    <History className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800 leading-snug whitespace-normal break-words">
                      {act.description}
                    </p>
                    <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                      By <span className="font-semibold text-slate-600">{act.createdBy?.name || 'System'}</span> • {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <Badge variant="neutral" className="text-[9px] uppercase tracking-wider shrink-0">
                    {act.type.replace(/_/g, ' ')}
                  </Badge>
                </div>
              ))}
              {recentActivities.length === 0 && (
                <div className="py-8 text-center text-slate-400 font-medium select-none">
                  No recent workspace actions logged.
                </div>
              )}
            </div>
          )}

          {activeTab === 'sales' && (
            <div className="space-y-3 pt-1">
              {recentSales.map((sale) => (
                <div 
                  key={sale._id} 
                  onClick={() => navigate(`/invoices/${sale._id}`)}
                  className="cursor-pointer p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/70 transition-all flex items-center justify-between gap-3 select-none"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <Receipt className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="font-bold text-xs text-slate-900 block">{sale.invoiceNumber}</span>
                      <span className="text-[11px] text-slate-500 font-medium">{sale.customerId?.name || 'Walk-in Client'}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-900 block">₹ {formatCurrency(sale.grandTotal)}</span>
                    <span className="text-[10px] text-slate-400 font-semibold">{new Date(sale.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
              {recentSales.length === 0 && (
                <div className="py-8 text-center text-slate-400 font-medium select-none">
                  No recent sales invoices recorded.
                </div>
              )}
            </div>
          )}
        </Card>
      </div>

      {/* Low Stock Warning Section (shown when products are below stock limit) */}
      {lowStockProducts.length > 0 && (
        <Card 
          title={
            <div className="flex items-center gap-2 text-amber-700">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <span>Low Inventory Stock Warnings ({metrics.lowStockCount || lowStockProducts.length})</span>
            </div>
          }
          subtitle="Products below designated minimum stock limits needing replenishment"
          headerAction={
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/purchases/new')}
              className="text-xs font-semibold text-amber-800 border-amber-300 hover:bg-amber-50"
            >
              Order New Stock
            </Button>
          }
          className="border-amber-200 bg-amber-50/20"
        >
          <Table headers={['Product Name', 'SKU', 'Current Stock', 'Min Threshold', 'Unit Price', 'Action']}>
            {lowStockProducts.map((p) => (
              <tr key={p._id} className="hover:bg-amber-50/40 transition-colors">
                <td className="px-6 py-3 whitespace-nowrap font-bold text-slate-900 text-sm">
                  {p.name}
                </td>
                <td className="px-6 py-3 whitespace-nowrap text-xs text-slate-500 font-mono">
                  {p.sku}
                </td>
                <td className="px-6 py-3 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                    p.quantity <= 0 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {p.quantity} {p.unit || 'PCS'} {p.quantity <= 0 ? '(Out of Stock)' : '(Low)'}
                  </span>
                </td>
                <td className="px-6 py-3 whitespace-nowrap text-xs font-semibold text-slate-600">
                  {p.minimumStock} {p.unit || 'PCS'}
                </td>
                <td className="px-6 py-3 whitespace-nowrap text-xs font-bold text-slate-800">
                  ₹ {formatCurrency(p.sellingPrice)}
                </td>
                <td className="px-6 py-3 whitespace-nowrap">
                  <Button
                    variant="text"
                    size="sm"
                    onClick={() => navigate('/purchases/new')}
                    className="text-primary-600 text-xs font-bold p-1 hover:bg-primary-50"
                  >
                    Create PO
                  </Button>
                </td>
              </tr>
            ))}
          </Table>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
