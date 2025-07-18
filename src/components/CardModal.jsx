import React, { useState, useEffect } from 'react';

const CardModal = ({ isOpen, onClose, onSave, existingCard }) => {
  const [formData, setFormData] = useState({
    title: '',
    name: '',
    phone: '',
    email: '',
    address: ''
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (existingCard) {
      setFormData(existingCard);
    } else {
      setFormData({
        title: '',
        name: '',
        phone: '',
        email: '',
        address: ''
      });
    }
  }, [existingCard]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    await onSave(formData);
    setLoading(false);
  };

  return (
    <div
      className={`modal fade ${isOpen ? 'show d-block' : ''}`}
      tabIndex="-1"
      role="dialog"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {existingCard ? 'Kartviziti Düzenle' : 'Kartvizit Ekle'}
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            {loading && (
              <div className="mb-3">
                <div className="progress">
                  <div className="progress-bar progress-bar-striped progress-bar-animated w-100"></div>
                </div>
              </div>
            )}

            <div className="mb-3">
              <label className="form-label">*İsim</label>
              <input
                type="text"
                className="form-control"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Ünvan</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">*Telefon Numarası</label>
              <input
                type="tel"
                className="form-control"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="0 XXX XXX XXXX"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">E-mail</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Adres</label>
              <textarea
                className="form-control"
                name="address"
                value={formData.address}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Vazgeç
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSave}
              disabled={loading || !formData.title || !formData.phone}
            >
              {existingCard ? 'Güncelle' : 'Ekle'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardModal;
