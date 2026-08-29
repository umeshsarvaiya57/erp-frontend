import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Don't render breadcrumbs on root setup pages or dashboards
  if (pathnames.length === 0 || pathnames[0] === 'dashboard') return null;

  return (
    <nav className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold select-none pb-4">
      <Link to="/dashboard" className="hover:text-slate-700 transition-colors flex items-center gap-1">
        <Home className="h-3.5 w-3.5" />
      </Link>
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const displayName = name.charAt(0).toUpperCase() + name.slice(1).replace('-', ' ');

        return (
          <React.Fragment key={name}>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            {isLast ? (
              <span className="text-slate-800 font-bold shrink-0 truncate max-w-[150px]">{displayName}</span>
            ) : (
              <Link to={routeTo} className="hover:text-slate-700 transition-colors shrink-0">
                {displayName}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
