import React, { useState } from 'react';
import './CheckoutModal.css';

export default function CheckoutModal({ isOpen, onClose, onConfirm, isProcessing }) {
  const [formData, setFormData] = useState({
    direccionEnvio: '',
    telefonoContacto: '',
    notas: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error del campo cuando el usuario escriba
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.direccionEnvio.trim()) {
      newErrors.direccionEnvio = 'La dirección de envío es obligatoria';
    }
    
    if (formData.telefonoContacto && !/^[0-9\s\-\+\(\)]+$/.test(formData.telefonoContacto)) {
      newErrors.telefonoContacto = 'Formato de teléfono inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onConfirm(formData);
    }
  };

  const handleClose = () => {
    setFormData({
      direccionEnvio: '',
      telefonoContacto: '',
      notas: ''
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Confirmar Pedido</h2>
          <button className="close-button" onClick={handleClose} disabled={isProcessing}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="checkout-form">
          <div className="form-group">
            <label htmlFor="direccionEnvio">
              Dirección de Envío <span className="required">*</span>
            </label>
            <textarea
              id="direccionEnvio"
              name="direccionEnvio"
              value={formData.direccionEnvio}
              onChange={handleChange}
              placeholder="Ej: Av. Corrientes 1234, CABA, Argentina"
              rows="3"
              disabled={isProcessing}
              className={errors.direccionEnvio ? 'error' : ''}
            />
            {errors.direccionEnvio && (
              <span className="error-message">{errors.direccionEnvio}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="telefonoContacto">Teléfono de Contacto</label>
            <input
              type="tel"
              id="telefonoContacto"
              name="telefonoContacto"
              value={formData.telefonoContacto}
              onChange={handleChange}
              placeholder="Ej: +54 11 1234-5678"
              disabled={isProcessing}
              className={errors.telefonoContacto ? 'error' : ''}
            />
            {errors.telefonoContacto && (
              <span className="error-message">{errors.telefonoContacto}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="notas">Notas Adicionales</label>
            <textarea
              id="notas"
              name="notas"
              value={formData.notas}
              onChange={handleChange}
              placeholder="Información adicional sobre la entrega..."
              rows="3"
              disabled={isProcessing}
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
              disabled={isProcessing}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isProcessing}
            >
              {isProcessing ? 'Procesando...' : 'Confirmar Pedido'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
