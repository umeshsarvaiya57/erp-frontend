import React from 'react';
import { Link } from 'react-router-dom';
import { Formik, Form } from 'formik';
import { Mail, ArrowLeft, KeyRound } from 'lucide-react';
import { forgotPasswordSchema } from '../../validations/authValidation';
import { Button } from '../../components/ui/Button';
import { TextField } from '../../components/ui/TextField';
import { Card } from '../../components/ui/Card';
import { useAuth } from '../../hooks/useAuth';

export const ForgotPassword = () => {
  const { forgotPassword, isSendingReset } = useAuth();

  const handleSubmit = (values, { resetForm }) => {
    forgotPassword(values.email);
    resetForm();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary-100 text-primary-600 mb-4 shadow-md shadow-primary-500/5">
          <KeyRound className="h-8 w-8" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Forgot Password
        </h2>
        <p className="mt-2 text-sm text-slate-500 font-medium">
          Enter your email to receive recovery instructions
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <Card className="shadow-xl border-slate-100 p-8">
          <Formik
            initialValues={{ email: '' }}
            validationSchema={forgotPasswordSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, handleChange, handleBlur }) => (
              <Form className="space-y-6">
                <TextField
                  label="Email Address"
                  name="email"
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="name@business.com"
                  startIcon={<Mail className="h-4 w-4" />}
                  error={touched.email && errors.email}
                  required
                />

                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  loading={isSendingReset}
                >
                  Send Recovery Link
                </Button>

                <div className="flex items-center justify-center mt-4 select-none">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back to login
                  </Link>
                </div>
              </Form>
            )}
          </Formik>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
