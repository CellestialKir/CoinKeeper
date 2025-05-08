import React from 'react';
import '../css/Card.css';
import deleteIcon from '../assets/delete.png';
import changeIcon from '../assets/change.png';

const Card = ({ title, subtitle, children }) => {
  return (
    <div className="operation-card">
      <div className="card-header">
        <h3>{title}</h3>
        <button className="icon-button">
            <img src={changeIcon} alt="Изменить" />
          </button>
          <button className="icon-button">
            <img src={deleteIcon} alt="Удалить" />
          </button>
        {subtitle && <p className="subtitle">{subtitle}</p>}
        

      </div>
      <div className="card-body">
        {children}
      </div>
    </div>
  );
};

export default Card;