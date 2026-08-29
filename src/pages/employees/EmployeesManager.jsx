import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Users, Plus, ShieldCheck, Mail, Phone, Lock } from 'lucide-react';
import { useEmployees } from '../../hooks/useEmployees';
import { useAuth } from '../../hooks/useAuth';
import { Table } from '../../components/ui/Table';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { TextField } from '../../components/ui/TextField';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { toast } from '../../components/ui/toast/toastService';

const inviteValidationSchema = Yup.object().shape({
  name: Yup.string().required('Full name is required').max(50, 'Max 50 characters'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  mobile: Yup.string().matches(/^[0-9]{10}$/, 'Must be a 10 digit number').required('Mobile is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  role: Yup.string().required('Role assignment is required'),
});

export const EmployeesManager = () => {
  const { user: currentUser } = useAuth();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const { employees, isLoading, createEmployee, updateEmployee } = useEmployees();

  const handleInviteSubmit = (values, { resetForm }) => {
    createEmployee(values, {
      onSuccess: () => {
        setIsInviteModalOpen(false);
        resetForm();
      }
    });
  };

  const handleToggleStatus = (emp) => {
    if (emp._id === currentUser.userId) {
      toast.error('Security protect: You cannot disable your own user account.');
      return;
    }
    updateEmployee({
      id: emp._id,
      data: { isActive: !emp.isActive }
    });
  };

  const handleRoleChange = (empId, newRole) => {
    if (empId === currentUser.userId) {
      toast.error('Security protect: You cannot change your own workspace role privileges.');
      return;
    }
    updateEmployee({
      id: empId,
      data: { role: newRole }
    });
  };

  const getRoleBadge = (r) => {
    if (r === 'OWNER') return <Badge variant="danger">Owner</Badge>;
    if (r === 'MANAGER') return <Badge variant="primary">Manager</Badge>;
    return <Badge variant="neutral">Employee</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap select-none">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6 text-slate-500" />
          <div>
            <h1 className="text-2xl font-bold text-slate-900 leading-none">Team Roster</h1>
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mt-1">Assign roles and privileges</span>
          </div>
        </div>
        {currentUser?.role === 'OWNER' && (
          <Button
            variant="primary"
            startIcon={<Plus className="h-4 w-4" />}
            onClick={() => setIsInviteModalOpen(true)}
          >
            Add Team Member
          </Button>
        )}
      </div>

      <Table
        headers={['Name/Email', 'Mobile', 'Role Privileges', 'Roster Status', 'Privilege Actions']}
        loading={isLoading}
      >
        {employees.map((emp) => (
          <tr key={emp._id} className="hover:bg-slate-50 transition-colors">
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex flex-col">
                <span className="font-semibold text-slate-900 text-sm leading-snug">
                  {emp.name} {emp._id === currentUser.userId && <span className="text-[10px] text-primary-500 font-bold ml-1">(You)</span>}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold mt-0.5 flex items-center gap-0.5">
                  <Mail className="h-3 w-3" /> {emp.email}
                </span>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 font-semibold">
              <span className="flex items-center gap-0.5"><Phone className="h-3 w-3" /> {emp.mobile}</span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap select-none">
              {getRoleBadge(emp.role)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <button
                onClick={() => handleToggleStatus(emp)}
                disabled={emp._id === currentUser.userId || currentUser.role !== 'OWNER'}
                className={`text-xs font-semibold px-2 py-0.5 rounded-lg border transition-colors select-none ${emp.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100/50' : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100/50'} disabled:opacity-80 disabled:cursor-not-allowed`}
              >
                {emp.isActive ? 'Active' : 'Suspended'}
              </button>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              {emp.role !== 'OWNER' && currentUser.role === 'OWNER' && emp._id !== currentUser.userId ? (
                <select
                  value={emp.role}
                  onChange={(e) => handleRoleChange(emp._id, e.target.value)}
                  className="text-xs text-slate-600 font-bold bg-white border border-slate-200 rounded-lg p-1 outline-none"
                >
                  <option value="MANAGER">MANAGER</option>
                  <option value="EMPLOYEE">EMPLOYEE</option>
                </select>
              ) : (
                <span className="text-[10px] text-slate-400 font-semibold uppercase flex items-center gap-1 select-none">
                  <Lock className="h-3 w-3" /> Locked
                </span>
              )}
            </td>
          </tr>
        ))}
      </Table>

      {/* Invite Modal */}
      <Modal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        title="Add Team Member"
        size="md"
      >
        <Formik
          initialValues={{ name: '', email: '', mobile: '', password: '', role: 'EMPLOYEE' }}
          validationSchema={inviteValidationSchema}
          onSubmit={handleInviteSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur }) => (
            <Form className="space-y-6">
              <TextField
                label="Full Name"
                name="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="e.g. Anand Sharma"
                error={touched.name && errors.name}
                required
              />

              <TextField
                label="Email Address"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="anand@mail.com"
                error={touched.email && errors.email}
                required
              />

              <TextField
                label="Mobile Number"
                name="mobile"
                value={values.mobile}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="10-digit number"
                error={touched.mobile && errors.mobile}
                required
              />

              <TextField
                label="Sign-in Password"
                name="password"
                type="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Min 6 characters"
                error={touched.password && errors.password}
                required
              />

              <Select
                label="Roster Privilege Level"
                name="role"
                value={values.role}
                onChange={handleChange}
                onBlur={handleBlur}
                options={[
                  { value: 'MANAGER', label: 'MANAGER (Full Sales/Inventory privileges)' },
                  { value: 'EMPLOYEE', label: 'EMPLOYEE (Sales only)' },
                ]}
                error={touched.role && errors.role}
                required
              />

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 shrink-0">
                <Button variant="outline" onClick={() => setIsInviteModalOpen(false)}>Cancel</Button>
                <Button type="submit" variant="primary">Add Member</Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  );
};

export default EmployeesManager;
