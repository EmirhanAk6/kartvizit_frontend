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
      // Backend'den gelen veriyi modal formatına çevir
      setFormData({
        title: existingCard.fullName || '',     // Backend: fullName -> Modal: title
        name: existingCard.jobTitle || '',      // Backend: jobTitle -> Modal: name  
        phone: existingCard.phone || '',
        email: existingCard.email || '',
        address: existingCard.address || ''
      });
    } else {
      setFormData({
        title: '',
        name: '',
        phone: '',
        email: '',
        address: ''
      });
    }
  }, [existingCard, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    // Validasyon
    if (!formData.title.trim()) {
      alert('İsim alanı zorunludur!');
      return;
    }

    if (!formData.phone.trim()) {
      alert('Telefon numarası alanı zorunludur!');
      return;
    }

    setLoading(true);
    
    try {
      await onSave(formData);
    } catch (error) {
      console.error('Save error in modal:', error);
      alert('Kart kaydedilirken bir hata oluştu: ' + (error.message || 'Bilinmeyen hata'));
    } finally {
      setLoading(false);
    }
  };

  // Modal kapalıysa render etme
  if (!isOpen) return null;

  return (
    <div
      className="modal fade show d-block"
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
            <button 
              type="button" 
              className="btn-close" 
              onClick={onClose}
              disabled={loading}
            ></button>
          </div>

          <div className="modal-body">
            {loading && (
              <div className="mb-3">
                <div className="progress">
                  <div className="progress-bar progress-bar-striped progress-bar-animated w-100"></div>
                </div>
                <small className="text-muted">Kaydediliyor...</small>
              </div>
            )}

            <div className="mb-3">
              <label className="form-label">
                <span className="text-danger">*</span> İsim
              </label>
              <input
                type="text"
                className="form-control"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="Ad Soyad"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Ünvan / Pozisyon</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={loading}
                placeholder="Örn: Yazılım Geliştirici"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">
                <span className="text-danger">*</span> Telefon Numarası
              </label>
              <input
                type="tel"
                className="form-control"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="0 XXX XXX XXXX"
                disabled={loading}
                required
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
                disabled={loading}
                placeholder="ornek@email.com"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Adres</label>
              <textarea
                className="form-control"
                name="address"
                value={formData.address}
                onChange={handleChange}
                disabled={loading}
                rows="3"
                placeholder="İş veya ev adresi"
              ></textarea>
            </div>

            <small className="text-muted">
              <span className="text-danger">*</span> işaretli alanlar zorunludur.
            </small>
          </div>

          <div className="modal-footer">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onClose}
              disabled={loading}
            >
              Vazgeç
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSave}
              disabled={loading || !formData.title.trim() || !formData.phone.trim()}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  {existingCard ? 'Güncelleniyor...' : 'Ekleniyor...'}
                </>
              ) : (
                existingCard ? 'Güncelle' : 'Ekle'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardModal;