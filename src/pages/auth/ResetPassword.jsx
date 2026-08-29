import React from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import { Lock, ArrowLeft, KeyRound } from 'lucide-react';
import { resetPasswordSchema } from '../../validations/authValidation';
import { Button } from '../../components/ui/Button';
import { TextField } from '../../components/ui/TextField';
import { Card } from '../../components/ui/Card';
import { useAuth } from '../../hooks/useAuth';

export const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const navigate = useNavigate();
  const { resetPassword, isResetting } = useAuth();

  const handleSubmit = (values) => {
    resetPassword(
      { token, password: values.password },
      {
        onSuccess: () => {
          navigate('/login', { replace: true });
        }
      }
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary-100 text-primary-600 mb-4 shadow-md shadow-primary-500/5">
          <KeyRound className="h-8 w-8" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Reset Password
        </h2>
        <p className="mt-2 text-sm text-slate-500 font-medium">
          Create a secure new password for your account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <Card className="shadow-xl border-slate-100 p-8">
          <Formik
            initialValues={{ password: '', confirmPassword: '' }}
            validationSchema={resetPasswordSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, handleChange, handleBlur }) => (
              <Form className="space-y-6">
                <TextField
                  label="New Password"
                  name="password"
                  type="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="••••••••"
                  startIcon={<Lock className="h-4 w-4" />}
                  error={touched.password && errors.password}
                  required
                />

                <TextField
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="••••••••"
                  startIcon={<Lock className="h-4 w-4" />}
                  error={touched.confirmPassword && errors.confirmPassword}
                  required
                />

                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  loading={isResetting}
                  disabled={!token}
                >
                  {token ? 'Reset Password' : 'Token Missing in URL'}
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

export default ResetPassword;
