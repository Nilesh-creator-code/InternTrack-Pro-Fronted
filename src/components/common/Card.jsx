import React from 'react';

export const Card = ({ title, children, className = '', action }) => {
  return (
    <div className={`content-card ${className}`}>
      {(title || action) && (
        <div className="content-card-header">
          {title && <h2 className="content-card-title">{title}</h2>}
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="content-card-body">
        {children}
      </div>
    </div>
  );
};
