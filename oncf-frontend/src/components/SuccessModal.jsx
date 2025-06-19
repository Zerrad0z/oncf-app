import React, { useEffect } from 'react';
import { FaCheckCircle, FaTimes } from 'react-icons/fa';
import './SuccessModal.css';

const SuccessModal = ({ isOpen, onClose, message, title, autoCloseTime = 3000 }) => {
  useEffect(() => {
    if (isOpen && autoCloseTime) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseTime);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose, autoCloseTime]);

  if (!isOpen) return null;

  return (
    <div className="success-modal-overlay">
      <div className="success-modal">
        <div className="success-modal-header">
          <h3>{title || 'Succès'}</h3>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        <div className="success-modal-body">
          <div className="success-icon">
            <FaCheckCircle />
          </div>
          <p>{message || 'Opération réussie!'}</p>
        </div>
        <div className="success-modal-footer">
          <button className="confirm-button" onClick={onClose}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;