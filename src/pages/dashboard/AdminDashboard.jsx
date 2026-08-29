import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { 
  Building, 
  Users, 
  Plus, 
  Power, 
  Activity,
  LogOut,
  Sparkles,
  Phone,
  Mail,
  ShieldAlert
} from 'lucide-react';
import { businessApi } from '../../api/businessApi';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Modal } from '../../components/ui/Modal';
import { TextField } from '../../components/ui/TextField';
import { Select } from '../../components/ui/Select';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../hooks/useAuth';
import { toast } from '../../components/ui/toast/toastService';

const createBusinessSchema = Yup.object().shape({
  name: Yup.string().required('Business name is required'),
  ownerName: Yup.string().required('Owner name is required'),
  ownerEmail: Yup.string().email('Invalid email').required('Owner email is required'),
  initialPassword: Yup.string().min(6, 'Password must be at least 6 characters').required('Initial password is required'),
  mobile: Yup.string().matches(/^[0-9]{10}$/, 'Mobile must be a 10-digit number').required('Mobile is required'),
  businessType: Yup.string().required('Business type is required'),
});

export const AdminDashboard = () => {
  const queryClient = useQueryClient();
  const { logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');

  // 1. Fetch Global Summary (metrics and audit logs)
  const dashboardQuery = useQuery({
    queryKey: ['admin-dashboard-summary'],
    queryFn: () => businessApi.getAdminDashboard(),
    select: (res) => res.data,
  });

  // 2. Fetch Business list (paginated, search)
  const businessesQuery = useQuery({
    queryKey: ['admin-businesses', search],
    queryFn: () => businessApi.getAllBusinesses({ search, limit: 100 }),
    select: (res) => res.data,
  });

  // Mutation to create business tenant
  const createMutation = useMutation({
    mutationFn: businessApi.createBusiness,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard-summary'] });
      queryClient.invalidateQueries({ queryKey: ['admin-businesses'] });
      setIsModalOpen(false);
      toast.success('Business tenant and owner created successfully!');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to create business.');
    }
  });

  // Mutation to toggle business status
  const statusMutation = useMutation({
    mutationFn: ({ id, isActive }) => businessApi.updateBusinessStatus(id, isActive),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard-summary'] });
      queryClient.invalidateQueries({ queryKey: ['admin-businesses'] });
      const statusText = res.data.isActive ? 'activated' : 'deactivated';
      toast.success(`Business tenant ${statusText} successfully.`);
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to update business status.');
    }
  });

  const handleCreateBusiness = (values, { resetForm }) => {
    createMutation.mutate(values, {
      onSuccess: () => resetForm(),
    });
  };

  const handleToggleStatus = (id, currentStatus) => {
    statusMutation.mutate({ id, isActive: !currentStatus });
  };

  const metrics = dashboardQuery.data || { totalBusinesses: 0, activeBusinesses: 0, totalUsers: 0, recentLogs: [] };
  const businesses = businessesQuery.data || [];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Admin Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-6 py-4 flex items-center justify-between shrink-0 select-none">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500 rounded-xl text-white">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 leading-none">Super Admin Space</h1>
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">System Administration</span>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          startIcon={<LogOut className="h-4 w-4" />}
          onClick={logout}
        >
          Sign Out
        </Button>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Metric Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="flex items-center gap-5 p-6 hover:shadow-md transition-shadow">
            <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl">
              <Building className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Tenants</span>
              <h2 className="text-3xl font-extrabold text-slate-950 mt-1">
                {dashboardQuery.isLoading ? '...' : metrics.totalBusinesses}
              </h2>
            </div>
          </Card>

          <Card className="flex items-center gap-5 p-6 hover:shadow-md transition-shadow">
            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
              <Building className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Tenants</span>
              <h2 className="text-3xl font-extrabold text-slate-950 mt-1">
                {dashboardQuery.isLoading ? '...' : metrics.activeBusinesses}
              </h2>
            </div>
          </Card>

          <Card className="flex items-center gap-5 p-6 hover:shadow-md transition-shadow">
            <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total System Users</span>
              <h2 className="text-3xl font-extrabold text-slate-950 mt-1">
                {dashboardQuery.isLoading ? '...' : metrics.totalUsers}
              </h2>
            </div>
          </Card>
        </div>

        {/* Business listings table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4 flex-wrap select-none">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Registered Businesses</h2>
              <p className="text-xs text-slate-500 font-medium">Create and manage multi-tenant shop environments</p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Search business..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="rounded-xl border border-slate-300 bg-white text-slate-900 text-sm py-2 px-3 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              />
              <Button
                variant="primary"
                startIcon={<Plus className="h-4 w-4" />}
                onClick={() => setIsModalOpen(true)}
              >
                Create Business Tenant
              </Button>
            </div>
          </div>

          <Table
            headers={['Logo', 'Business Name', 'Owner Email', 'Mobile', 'Status', 'Actions']}
            loading={businessesQuery.isLoading}
          >
            {businesses.map((biz) => (
              <tr key={biz._id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <Avatar
                    src={biz.logo ? (biz.logo.startsWith('/') ? `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}${biz.logo}` : biz.logo) : ''}
                    name={biz.name}
                    size="sm"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-semibold text-slate-950">
                  {biz.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-medium">
                  {biz.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-500">
                  {biz.mobile || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={biz.isActive ? 'success' : 'danger'}>
                    {biz.isActive ? 'Active' : 'Suspended'}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Button
                    variant={biz.isActive ? 'outline' : 'success'}
                    size="sm"
                    startIcon={<Power className="h-3.5 w-3.5" />}
                    loading={statusMutation.isPending && statusMutation.variables?.id === biz._id}
                    onClick={() => handleToggleStatus(biz._id, biz.isActive)}
                  >
                    {biz.isActive ? 'Suspend' : 'Reactivate'}
                  </Button>
                </td>
              </tr>
            ))}
            {businesses.length === 0 && !businessesQuery.isLoading && (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-slate-400 font-medium">
                  No businesses found.
                </td>
              </tr>
            )}
          </Table>
        </div>

        {/* System Activity audit log */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 select-none">
            <Activity className="h-5 w-5 text-slate-400" />
            <h2 className="text-lg font-bold text-slate-900">System Activity Audit Trail</h2>
          </div>
          <Table
            headers={['Actor', 'Module', 'Action', 'Entity ID', 'Recorded At']}
            loading={dashboardQuery.isLoading}
          >
            {metrics.recentLogs.map((log) => (
              <tr key={log._id} className="hover:bg-slate-50/50">
                <td className="px-6 py-4 whitespace-nowrap font-semibold text-slate-950">
                  {log.userId?.name || 'Unknown'}
                  <span className="block text-xs font-normal text-slate-400">{log.userId?.email || ''}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xs font-bold uppercase tracking-wider text-slate-500">
                  {log.module}
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-800">
                  <Badge variant={log.action.includes('DELETE') || log.action.includes('DEACTIVATE') ? 'danger' : 'info'}>
                    {log.action}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xs font-mono text-slate-400">
                  {log.entityId || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 font-medium">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
            {metrics.recentLogs.length === 0 && !dashboardQuery.isLoading && (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-slate-400 font-medium">
                  No audit logs recorded yet.
                </td>
              </tr>
            )}
          </Table>
        </div>
      </main>

      {/* Creation Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Register New Business Tenant"
        size="lg"
      >
        <Formik
          initialValues={{
            name: '',
            ownerName: '',
            ownerEmail: '',
            initialPassword: '',
            mobile: '',
            businessType: '',
          }}
          validationSchema={createBusinessSchema}
          onSubmit={handleCreateBusiness}
        >
          {({ values, errors, touched, handleChange, handleBlur }) => (
            <Form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextField
                  label="Business Name"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. Shree Mobile Shop"
                  error={touched.name && errors.name}
                  required
                />

                <Select
                  label="Business Category"
                  name="businessType"
                  value={values.businessType}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  options={[
                    { value: 'retail', label: 'Retail Shop' },
                    { value: 'wholesale', label: 'Wholesale' },
                    { value: 'manufacturing', label: 'Manufacturing' },
                    { value: 'services', label: 'Service Provider' },
                    { value: 'electronics', label: 'Electronics & Mobiles' },
                    { value: 'furniture', label: 'Furniture' },
                    { value: 'other', label: 'Other' },
                  ]}
                  error={touched.businessType && errors.businessType}
                  required
                />

                <TextField
                  label="Business Owner Name"
                  name="ownerName"
                  value={values.ownerName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Owner full name"
                  error={touched.ownerName && errors.ownerName}
                  required
                />

                <TextField
                  label="Owner Mobile"
                  name="mobile"
                  value={values.mobile}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="10-digit mobile number"
                  error={touched.mobile && errors.mobile}
                  required
                />

                <TextField
                  label="Owner Email Address"
                  name="ownerEmail"
                  type="email"
                  value={values.ownerEmail}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="owner@business.com"
                  error={touched.ownerEmail && errors.ownerEmail}
                  required
                />

                <TextField
                  label="Initial Passcode"
                  name="initialPassword"
                  type="password"
                  value={values.initialPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="••••••••"
                  error={touched.initialPassword && errors.initialPassword}
                  required
                />
              </div>

              <div className="flex items-center gap-2 p-3.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs font-semibold">
                <ShieldAlert className="h-4 w-4 shrink-0" />
                <span>Notice: After tenant creation, the owner must complete their onboarding profile details upon first log in.</span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 shrink-0">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" loading={createMutation.isPending}>
                  Create Business Tenant
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
