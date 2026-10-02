import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  FolderTree, 
  Boxes, 
  ShoppingBag, 
  ShoppingCart, 
  Receipt, 
  Users2, 
  Compass, 
  CalendarDays, 
  History, 
  FileSpreadsheet, 
  BarChart3, 
  Users, 
  Settings,
  Sparkles,
  MessageSquare,
  Lock
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { hasPermission } from '../../utils/permissions';

export const Sidebar = () => {
  const { user } = useAuth();

  const menuGroups = [
    {
      title: 'General',
      items: [
        { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="h-4 w-4" />, permission: 'dashboard.view' }
      ]
    },
    {
      title: 'ERP Module',
      items: [
        { label: 'Products', path: '/products', icon: <Package className="h-4 w-4" />, permission: 'products.view' },
        { label: 'Categories & Brands', path: '/categories', icon: <FolderTree className="h-4 w-4" />, permission: 'products.view' },
        { label: 'Inventory History', path: '/inventory', icon: <Boxes className="h-4 w-4" />, permission: 'inventory.view' },
        { label: 'Sales Orders', path: '/sales', icon: <ShoppingBag className="h-4 w-4" />, permission: 'sales.view' },
        { label: 'Purchase Orders', path: '/purchases', icon: <ShoppingCart className="h-4 w-4" />, permission: 'purchases.view' },
      ]
    },
    {
      title: 'CRM Module',
      items: [
        { label: 'Customers & Suppliers', path: '/customers', icon: <Users2 className="h-4 w-4" />, permission: 'customers.view' },
        { label: 'Leads Manager', path: '/leads', icon: <Compass className="h-4 w-4" />, permission: 'crm.view' },
        { label: 'CRM Timeline', path: '/activities', icon: <History className="h-4 w-4" />, permission: 'crm.view' },
      ]
    },
    {
      title: 'Finance & Setup',
      items: [
        { label: 'GST Reports', path: '/gst', icon: <FileSpreadsheet className="h-4 w-4" />, permission: 'gst.view' },
        { label: 'Business Reports', path: '/reports', icon: <BarChart3 className="h-4 w-4" />, permission: 'reports.view' },
        { label: 'Team Members', path: '/employees', icon: <Users className="h-4 w-4" />, permission: 'employees.view' },
        { label: 'WhatsApp Automation', path: '/settings/whatsapp', icon: <MessageSquare className="h-4 w-4 text-emerald-400" />, permission: 'settings.view' },
        { label: 'Business Profile', path: '/settings/business', icon: <Settings className="h-4 w-4" />, permission: 'settings.view' },
      ]
    }
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen border-r border-slate-800 select-none hidden lg:flex shrink-0">
      {/* Brand Header */}
      <div className="px-6 py-5 border-b border-slate-800 flex items-center gap-3 shrink-0">
        <div className="p-1.5 bg-primary-500 rounded-xl text-white shadow-md shadow-primary-500/10">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-white leading-none">
            {user?.business?.name || 'MyERP Shop'}
          </h2>
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mt-1">
            Workspace
          </span>
        </div>
      </div>

      {/* Nav Menu */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {menuGroups.map((group, groupIdx) => {
          // Filter out items without appropriate permission
          const allowedItems = group.items.filter(item => hasPermission(user, item.permission));
          if (allowedItems.length === 0) return null;

          return (
            <div key={groupIdx} className="space-y-2">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3">
                {group.title}
              </h3>
              <nav className="space-y-1">
                {allowedItems.map((item, itemIdx) => (
                  <NavLink
                    key={itemIdx}
                    to={item.path}
                    className={({ isActive }) => `
                      flex items-center gap-3 px-3 py-2 text-sm font-semibold rounded-xl transition-all duration-150
                      ${isActive 
                        ? 'bg-slate-800 text-white shadow-inner' 
                        : 'hover:bg-slate-800/40 hover:text-slate-200'
                      }
                    `}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </nav>
            </div>
          );
        })}
      </div>

      {/* User Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex items-center gap-3 shrink-0">
        <div className="h-9 w-9 rounded-full bg-slate-700 flex items-center justify-center font-bold text-white shrink-0">
          {user?.name?.[0]?.toUpperCase() || 'U'}
        </div>
        <div className="overflow-hidden">
          <h4 className="text-xs font-bold text-white truncate leading-none">{user?.name}</h4>
          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide truncate block mt-1">
            {user?.role?.replace('_', ' ')}
          </span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
