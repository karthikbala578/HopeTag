import React from 'react';
import './Modal.css';

const Modal = ({ stations, category, onClose, onSelectStation }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h3>Select a {category} support</h3>
        <ul className="modal-station-list">
          {stations.map((station, index) => (
            <li key={index} className="station-item" onClick={() => onSelectStation(station)}>
              <p><strong>{station.name}</strong></p>
              <p>{station.address}</p>
              <p>{station.distance.toFixed(2)} km away</p>
            </li>
          ))}
        </ul>
        <button onClick={onClose} className="modal-close-btn">
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
