import React from 'react';
import '../css/OperationItem.css';

const OperationItem = ({ label, value, subitems, icon, color }) => {
  return (
    <div className="card-item" style={{ borderLeft: `6px solid ${color || '#ccc'}` }}>
      {icon && <span className="item-icon">{icon}</span>}
      <div className="item-content">
        <span className="item-label">{label}</span>
        {value && <span className="item-value">{value}</span>}
        {subitems && (
          <div className="subitems">
            {subitems.map((subitem, index) => (
              <span key={index} className="subitem">{subitem}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OperationItem;
