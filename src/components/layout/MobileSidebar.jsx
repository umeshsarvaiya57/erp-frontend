import React from 'react';
import { NavLink } from 'react-router-dom';
import { Drawer } from '../ui/Drawer';
import { useAuth } from '../../hooks/useAuth';
import { hasPermission } from '../../utils/permissions';
import { 
  LayoutDashboard, 
  Package, 
  FolderTree, 
  Boxes, 
  ShoppingBag, 
  ShoppingCart, 
  Users2, 
  Compass, 
  History, 
  FileSpreadsheet, 
  BarChart3, 
  Users, 
  Settings,
  Sparkles
} from 'lucide-react';

export const MobileSidebar = ({ isOpen, onClose }) => {
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
      title: 'Finance & Team',
      items: [
        { label: 'GST Reports', path: '/gst', icon: <FileSpreadsheet className="h-4 w-4" />, permission: 'gst.view' },
        { label: 'Business Reports', path: '/reports', icon: <BarChart3 className="h-4 w-4" />, permission: 'reports.view' },
        { label: 'Team Members', path: '/employees', icon: <Users className="h-4 w-4" />, permission: 'employees.view' },
        { label: 'Business Setup', path: '/settings/business', icon: <Settings className="h-4 w-4" />, permission: 'settings.view' },
      ]
    }
  ];

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      placement="left"
      title={
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary-500" />
          <span className="font-bold text-slate-800 text-sm truncate">{user?.business?.name || 'Workspace'}</span>
        </div>
      }
    >
      <div className="space-y-6">
        {menuGroups.map((group, groupIdx) => {
          const allowedItems = group.items.filter(item => hasPermission(user, item.permission));
          if (allowedItems.length === 0) return null;

          return (
            <div key={groupIdx} className="space-y-2">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3">
                {group.title}
              </h3>
              <nav className="space-y-1">
                {allowedItems.map((item, itemIdx) => (
                  <NavLink
                    key={itemIdx}
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) => `
                      flex items-center gap-3 px-3 py-2 text-sm font-semibold rounded-xl transition-all duration-150
                      ${isActive 
                        ? 'bg-slate-100 text-primary-600' 
                        : 'hover:bg-slate-50 text-slate-600 hover:text-slate-900'
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
    </Drawer>
  );
};

export default MobileSidebar;
