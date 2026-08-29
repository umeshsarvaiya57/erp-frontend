import React from 'react';

export const Card = ({
  title,
  subtitle,
  extra,
  className = '',
  bodyClassName = '',
  children,
  ...props
}) => {
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden ${className}`}
      {...props}
    >
      {(title || subtitle || extra) && (
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between gap-4 flex-wrap">
          <div>
            {title && <h3 className="text-base font-semibold text-slate-900">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
          </div>
          {extra && <div className="flex items-center gap-2">{extra}</div>}
        </div>
      )}
      <div className={`p-6 ${bodyClassName}`}>
        {children}
      </div>
    </div>
  );
};

export default Card;
