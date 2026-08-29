import React from 'react';

export const CustomDiv = ({
  flex = false,
  grid = false,
  cols = null,
  gap = null,
  items = null,
  justify = null,
  className = '',
  children,
  ...props
}) => {
  let classes = '';
  if (flex) {
    classes += ' flex';
    if (items) {
      if (items === 'center') classes += ' items-center';
      if (items === 'start') classes += ' items-start';
      if (items === 'end') classes += ' items-end';
      if (items === 'stretch') classes += ' items-stretch';
    }
    if (justify) {
      if (justify === 'center') classes += ' justify-center';
      if (justify === 'between') classes += ' justify-between';
      if (justify === 'around') classes += ' justify-around';
      if (justify === 'start') classes += ' justify-start';
      if (justify === 'end') classes += ' justify-end';
    }
  } else if (grid) {
    classes += ' grid';
    if (cols) {
      classes += ` grid-cols-${cols}`;
    }
    if (gap) {
      classes += ` gap-${gap}`;
    }
  }

  return (
    <div className={`${classes} ${className}`} {...props}>
      {children}
    </div>
  );
};

export default CustomDiv;
