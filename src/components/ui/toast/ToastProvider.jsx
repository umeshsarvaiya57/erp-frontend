import React from 'react';
import { ToastContainer } from './ToastContainer';

export const ToastProvider = ({ children }) => {
  return (
    <>
      {children}
      <ToastContainer />
    </>
  );
};

export default ToastProvider;
