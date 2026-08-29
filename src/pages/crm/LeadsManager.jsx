import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Compass, Plus, Phone, CalendarDays, Edit3, UserCheck } from 'lucide-react';
import { useCRM, useFollowUps } from '../../hooks/useCRM';
import { useEmployees } from '../../hooks/useEmployees';
import { Table } from '../../components/ui/Table';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { TextField } from '../../components/ui/TextField';
import { TextArea } from '../../components/ui/TextArea';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { SearchInput } from '../../components/ui/SearchInput';
import { Pagination } from '../../components/ui/Pagination';

const leadValidationSchema = Yup.object().shape({
  name: Yup.string().required('Lead name is required').max(50, 'Max 50 characters'),
  mobile: Yup.string().matches(/^[0-9]{10}$/, 'Must be a 10 digit number').required('Mobile is required'),
  companyName: Yup.string().max(50, 'Max 50 characters').nullable(),
  email: Yup.string().email('Invalid email').nullable(),
  source: Yup.string().required('Source is required'),
  value: Yup.number().min(0, 'Cannot be negative').default(0),
  assignedTo: Yup.string().nullable(),
  notes: Yup.string().max(200, 'Max 200 characters').nullable()
});

const followupValidationSchema = Yup.object().shape({
  type: Yup.string().required('Followup type is required'),
  scheduledDate: Yup.date().required('Schedule date is required'),
  notes: Yup.string().required('Notes are required').max(200, 'Max 200 characters')
});

export const LeadsManager = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  // Modals state
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [selectedLeadForFollowUp, setSelectedLeadForFollowUp] = useState(null);

  // Queries
  const { leads, pagination, isLoadingLeads, createLead, updateLead, createFollowUp } = useCRM({
    page,
    limit: 10,
    search,
    status
  });

  const { employees } = useEmployees();

  const handleCreateLead = (values, { resetForm }) => {
    createLead(values, {
      onSuccess: () => {
        setIsLeadModalOpen(false);
        resetForm();
      }
    });
  };

  const handleUpdateStatus = (leadId, newStatus) => {
    updateLead({ id: leadId, data: { status: newStatus } });
  };

  const handleCreateFollowUp = (values, { resetForm }) => {
    createFollowUp({
      leadId: selectedLeadForFollowUp._id,
      type: values.type,
      scheduledDate: values.scheduledDate,
      notes: values.notes
    }, {
      onSuccess: () => {
        setSelectedLeadForFollowUp(null);
        resetForm();
      }
    });
  };

  const getStatusBadge = (s) => {
    const statusMap = {
      NEW: 'neutral',
      CONTACTED: 'info',
      QUALIFIED: 'primary',
      CONVERTED: 'success',
      LOST: 'danger'
    };
    return <Badge variant={statusMap[s] || 'neutral'}>{s}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap select-none">
        <div className="flex items-center gap-2">
          <Compass className="h-6 w-6 text-slate-500" />
          <div>
            <h1 className="text-2xl font-bold text-slate-900 leading-none">Leads Pipeline</h1>
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mt-1">Convert opportunities into customer accounts</span>
          </div>
        </div>
        <Button
          variant="primary"
          startIcon={<Plus className="h-4 w-4" />}
          onClick={() => setIsLeadModalOpen(true)}
        >
          Register Lead
        </Button>
      </div>

      {/* Filter panel */}
      <Card className="p-4" bodyClassName="flex flex-col sm:flex-row gap-4 items-center">
        <SearchInput
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search Lead contact Name or Company..."
          className="flex-1"
        />
        <Select
          placeholder="All Pipeline Stages"
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          options={[
            { value: 'NEW', label: 'NEW (Uncontacted)' },
            { value: 'CONTACTED', label: 'CONTACTED' },
            { value: 'QUALIFIED', label: 'QUALIFIED' },
            { value: 'CONVERTED', label: 'CONVERTED' },
            { value: 'LOST', label: 'LOST' },
          ]}
          className="w-full sm:w-64"
        />
      </Card>

      {/* Table list */}
      <Table
        headers={['Lead Details', 'Deal Size', 'Source', 'Pipeline Stage', 'Assigned Employee', 'Date', 'Actions']}
        loading={isLoadingLeads}
      >
        {leads.map((lead) => (
          <tr key={lead._id} className="hover:bg-slate-50 transition-colors">
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex flex-col">
                <span className="font-semibold text-slate-900 text-sm leading-snug">{lead.name}</span>
                {lead.companyName && <span className="text-xs text-slate-500 font-medium">{lead.companyName}</span>}
                <span className="text-[10px] text-slate-400 font-semibold mt-0.5 flex items-center gap-0.5"><Phone className="h-3 w-3" /> {lead.mobile}</span>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-900">
              ₹ {lead.value ? lead.value.toFixed(2) : '0.00'}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 font-bold">
              {lead.source.replace('_', ' ')}
            </td>
            <td className="px-6 py-4 whitespace-nowrap select-none">
              <div className="flex items-center gap-2">
                {getStatusBadge(lead.status)}
                <select
                  value={lead.status}
                  onChange={(e) => handleUpdateStatus(lead._id, e.target.value)}
                  className="text-[10px] font-bold text-slate-500 bg-white border border-slate-200 rounded-lg p-1 hover:border-slate-300 outline-none"
                >
                  <option value="NEW">NEW</option>
                  <option value="CONTACTED">CONTACTED</option>
                  <option value="QUALIFIED">QUALIFIED</option>
                  <option value="CONVERTED">CONVERTED</option>
                  <option value="LOST">LOST</option>
                </select>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-700 font-semibold">
              {lead.assignedTo?.name || 'Unassigned'}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 font-medium">
              {new Date(lead.createdAt).toLocaleDateString()}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <Button
                variant="text"
                size="sm"
                startIcon={<CalendarDays className="h-4 w-4" />}
                onClick={() => setSelectedLeadForFollowUp(lead)}
                className="text-primary-600 hover:bg-primary-50"
              >
                Schedule Follow-up
              </Button>
            </td>
          </tr>
        ))}
        {leads.length === 0 && !isLoadingLeads && (
          <tr>
            <td colSpan="7" className="px-6 py-12 text-center text-slate-400 font-medium">
              No leads found in pipeline. Click "Register Lead" to add one.
            </td>
          </tr>
        )}
      </Table>

      <Pagination
        page={page}
        totalPages={pagination?.totalPages || 1}
        onPageChange={(p) => setPage(p)}
        limit={10}
        total={pagination?.total || 0}
      />

      {/* Register Lead Modal */}
      <Modal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        title="Register CRM Lead"
        size="lg"
      >
        <Formik
          initialValues={{
            name: '', companyName: '', mobile: '', email: '', 
            source: 'COLD_CALL', value: 0, assignedTo: '', notes: ''
          }}
          validationSchema={leadValidationSchema}
          onSubmit={handleCreateLead}
        >
          {({ values, errors, touched, handleChange, handleBlur }) => (
            <Form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextField
                  label="Contact Name"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. Amit Patil"
                  error={touched.name && errors.name}
                  required
                />
                <TextField
                  label="Mobile Number"
                  name="mobile"
                  value={values.mobile}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="10-digit mobile"
                  error={touched.mobile && errors.mobile}
                  required
                />
                <TextField
                  label="Company Name"
                  name="companyName"
                  value={values.companyName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Official company name"
                  error={touched.companyName && errors.companyName}
                />
                <TextField
                  label="Email Address"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="client@mail.com"
                  error={touched.email && errors.email}
                />
                <Select
                  label="Lead Acquisition Source"
                  name="source"
                  value={values.source}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  options={[
                    { value: 'COLD_CALL', label: 'Cold Calling' },
                    { value: 'WEBSITE', label: 'Website Form' },
                    { value: 'REFERRAL', label: 'Client Referral' },
                    { value: 'SOCIAL_MEDIA', label: 'Social Media Ads' },
                    { value: 'WALK_IN', label: 'Walk In Client' },
                  ]}
                  error={touched.source && errors.source}
                  required
                />
                <TextField
                  label="Estimated Deal Value (₹)"
                  name="value"
                  type="number"
                  value={values.value}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.value && errors.value}
                />
                <Select
                  label="Assign Employee Manager"
                  name="assignedTo"
                  value={values.assignedTo}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  options={employees.map(e => ({ value: e._id, label: `${e.name} (${e.role.replace('_', ' ')})` }))}
                  error={touched.assignedTo && errors.assignedTo}
                />
                <div className="md:col-span-2">
                  <TextArea
                    label="Notes"
                    name="notes"
                    value={values.notes}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Describe lead specifications or interest details..."
                    error={touched.notes && errors.notes}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 shrink-0">
                <Button variant="outline" onClick={() => setIsLeadModalOpen(false)}>Cancel</Button>
                <Button type="submit" variant="primary">Create Lead</Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>

      {/* Schedule Followup Modal */}
      {selectedLeadForFollowUp && (
        <Modal
          isOpen={!!selectedLeadForFollowUp}
          onClose={() => setSelectedLeadForFollowUp(null)}
          title={`Schedule Client Follow-up - ${selectedLeadForFollowUp.name}`}
          size="md"
        >
          <Formik
            initialValues={{ type: 'CALL', scheduledDate: '', notes: '' }}
            validationSchema={followupValidationSchema}
            onSubmit={handleCreateFollowUp}
          >
            {({ values, errors, touched, handleChange, handleBlur }) => (
              <Form className="space-y-6">
                <Select
                  label="Communication Type"
                  name="type"
                  value={values.type}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  options={[
                    { value: 'CALL', label: 'Phone Call follow-up' },
                    { value: 'EMAIL', label: 'Send Email proposal' },
                    { value: 'MEETING', label: 'Face to Face meeting' },
                    { value: 'OTHER', label: 'Other activity' },
                  ]}
                  error={touched.type && errors.type}
                  required
                />

                <TextField
                  label="Schedule Date & Time"
                  name="scheduledDate"
                  type="datetime-local"
                  value={values.scheduledDate}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.scheduledDate && errors.scheduledDate}
                  required
                />

                <TextArea
                  label="Follow-up Agenda Remarks"
                  name="notes"
                  value={values.notes}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Describe goal e.g. finalize pricing details"
                  error={touched.notes && errors.notes}
                  required
                />

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 shrink-0">
                  <Button variant="outline" onClick={() => setSelectedLeadForFollowUp(null)}>Cancel</Button>
                  <Button type="submit" variant="primary">Schedule Follow-up</Button>
                </div>
              </Form>
            )}
          </Formik>
        </Modal>
      )}
    </div>
  );
};

export default LeadsManager;
