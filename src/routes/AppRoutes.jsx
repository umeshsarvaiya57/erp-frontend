import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Login } from '../pages/auth/Login';
import { ForgotPassword } from '../pages/auth/ForgotPassword';
import { ResetPassword } from '../pages/auth/ResetPassword';
import { BusinessSetup } from '../pages/onboarding/BusinessSetup';
import { Dashboard } from '../pages/dashboard/Dashboard';
import { AdminDashboard } from '../pages/dashboard/AdminDashboard';
import { ProductList } from '../pages/products/ProductList';
import { ProductForm } from '../pages/products/ProductForm';
import { CategoriesBrands } from '../pages/products/CategoriesBrands';
import { InventoryHistory } from '../pages/inventory/InventoryHistory';
import { CustomersSuppliers } from '../pages/customers/CustomersSuppliers';
import { SalesList } from '../pages/sales/SalesList';
import { SalesForm } from '../pages/sales/SalesForm';
import { InvoicePrint } from '../pages/sales/InvoicePrint';
import { PublicInvoiceView } from '../pages/public/PublicInvoiceView';
import { PurchasesList } from '../pages/purchases/PurchasesList';
import { PurchasesForm } from '../pages/purchases/PurchasesForm';
import { LeadsManager } from '../pages/crm/LeadsManager';
import { TimelineActivities } from '../pages/crm/TimelineActivities';
import { EmployeesManager } from '../pages/employees/EmployeesManager';
import { BusinessReports } from '../pages/reports/BusinessReports';
import { BusinessProfile } from '../pages/settings/BusinessProfile';
import { WhatsAppGatewaySettings } from '../pages/settings/WhatsAppGatewaySettings';
import { BillFormatSettings } from '../pages/settings/BillFormatSettings';
import { AppLayout } from '../components/layout/AppLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Customer Routes (No Login Required) */}
      <Route path="/public/invoices/:id" element={<PublicInvoiceView />} />
      <Route path="/invoices/public/:id" element={<PublicInvoiceView />} />

      {/* Public Guest Auth Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        }
      />
      <Route
        path="/reset-password"
        element={
          <PublicRoute>
            <ResetPassword />
          </PublicRoute>
        }
      />

      {/* Tenant Onboarding Setup */}
      <Route
        path="/business/setup"
        element={
          <ProtectedRoute>
            <BusinessSetup />
          </ProtectedRoute>
        }
      />

      {/* Protected Business Workspace Routes (wrapped in AppLayout) */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* ERP: Products & Inventory Modules */}
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/new" element={<ProductForm />} />
        <Route path="/products/:id/edit" element={<ProductForm />} />
        <Route path="/categories" element={<CategoriesBrands />} />
        <Route path="/inventory" element={<InventoryHistory />} />

        {/* CRM: Customers & Suppliers Modules */}
        <Route path="/customers" element={<CustomersSuppliers />} />
        
        {/* CRM: Leads & Timeline Activity */}
        <Route path="/leads" element={<LeadsManager />} />
        <Route path="/activities" element={<TimelineActivities />} />

        {/* ERP: Sales & Billing Invoices */}
        <Route path="/sales" element={<SalesList />} />
        <Route path="/sales/new" element={<SalesForm />} />
        <Route path="/invoices/:id" element={<InvoicePrint />} />

        {/* ERP: Purchases Modules */}
        <Route path="/purchases" element={<PurchasesList />} />
        <Route path="/purchases/new" element={<PurchasesForm />} />

        {/* Finance & Reports */}
        <Route path="/gst" element={<BusinessReports />} />
        <Route path="/reports" element={<BusinessReports />} />

        {/* Management & Settings */}
        <Route path="/employees" element={<EmployeesManager />} />
        <Route path="/settings/business" element={<BusinessProfile />} />
        <Route path="/settings/whatsapp" element={<WhatsAppGatewaySettings />} />
        <Route path="/settings/bill-format" element={<BillFormatSettings />} />
      </Route>

      {/* Super Admin Management Workspace */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Fallback Redirect */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
