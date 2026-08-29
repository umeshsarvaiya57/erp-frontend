import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Formik, Form } from 'formik';
import { Mail, Lock, ShieldCheck } from 'lucide-react';
import { loginSchema } from '../../validations/authValidation';
import { Button } from '../../components/ui/Button';
import { TextField } from '../../components/ui/TextField';
import { Card } from '../../components/ui/Card';
import { useAuth } from '../../hooks/useAuth';

export const Login = () => {
  const { login, isLoggingIn, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If user is already authenticated, redirect
  useEffect(() => {
    if (isAuthenticated && user) {
      const from = location.state?.from?.pathname;
      if (user.role === 'SUPER_ADMIN') {
        navigate(from || '/admin/dashboard', { replace: true });
      } else if (user.business && !user.business.profileCompleted) {
        navigate('/business/setup', { replace: true });
      } else {
        navigate(from || '/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate, location]);

  const handleSubmit = (values) => {
    login(values);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary-100 text-primary-600 mb-4 shadow-md shadow-primary-500/5">
          <ShieldCheck className="h-8 w-8" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Welcome to MyERP
        </h2>
        <p className="mt-2 text-sm text-slate-500 font-medium">
          Sign in to access your business operations
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <Card className="shadow-xl border-slate-100 p-8">
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={loginSchema}
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

                <TextField
                  label="Password"
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

                <div className="flex items-center justify-end select-none">
                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    Forgot your password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  loading={isLoggingIn}
                >
                  Sign In
                </Button>
              </Form>
            )}
          </Formik>
        </Card>
      </div>
    </div>
  );
};

export default Login;
