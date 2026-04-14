import React from 'react';

export const Input = ({ label, id, ...props }) => {
  return (
    <div className="form-group">
      {label && <label htmlFor={id} className="form-label">{label}</label>}
      <input id={id} className="form-input" {...props} />
    </div>
  );
};
