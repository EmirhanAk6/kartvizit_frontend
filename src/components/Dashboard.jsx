import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { cardsAPI } from '../services/CardService';
import CardModal from './CardModal';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Modal ile ilgili state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null); // düzenleme için kullanılabilir

  useEffect(() => {
    if (user) {
      loadUserCards();
    }
  }, [user]);

  const loadUserCards = async () => {
    setLoading(true);
    setError('');
    try {
      const userCards = await cardsAPI.getUserCards(user.id);
      setCards(userCards);
    } catch (error) {
      console.error('Error loading cards:', error);
      setError('Failed to load cards');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setShowUserMenu(false);
    const confirmLogout = window.confirm('Are you sure you want to logout?');
    if (confirmLogout) {
      logout();
    }
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  const handleClickOutside = () => {
    setShowUserMenu(false);
  };

  const handleSimpleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
    window.location.reload();
  };

  const openAddModal = () => {
    setSelectedCard(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveCard = async (cardData) => {
    try {
      if (selectedCard) {
        await cardsAPI.updateCard(selectedCard.id, cardData);
      } else {
        await cardsAPI.createCard({ ...cardData, userId: user.id });
      }
      await loadUserCards();
      closeModal();
    } catch (error) {
      console.error('Card save error:', error);
      alert('Kart kaydedilirken bir hata oluştu.');
    }
  };

  return (
    <div className="container-fluid">
      {/* Bootstrap Modal */}
      <CardModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSaveCard}
        existingCard={selectedCard}
      />

      <div className="position-fixed" style={{ top: '10px', right: '10px', zIndex: 9999 }}>
        <button className="btn btn-danger btn-sm" onClick={handleSimpleLogout}>
          🚨 Test Logout
        </button>
      </div>

      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow">
        <div className="container-fluid">
          <span className="navbar-brand fw-bold fs-4">
            <i className="bi bi-person-badge me-2"></i> Business Cards
          </span>

          <div className="navbar-nav ms-auto">
            <div className="nav-item dropdown position-relative">
              <button
                className="btn btn-outline-light d-flex align-items-center gap-2 dropdown-toggle"
                onClick={toggleUserMenu}
                style={{ border: 'none' }}
              >
                <i className="bi bi-person-circle fs-5"></i>
                <span className="d-none d-sm-inline">{user?.username}</span>
              </button>

              {showUserMenu && (
                <div
                  className="dropdown-menu dropdown-menu-end show position-absolute"
                  style={{ right: 0, top: '100%' }}
                >
                  <div className="dropdown-header">
                    <strong>{user?.username}</strong>
                    <br />
                    <small className="text-muted">{user?.email}</small>
                  </div>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item d-flex align-items-center gap-2" onClick={handleClickOutside}>
                    <i className="bi bi-person"></i> Profile
                  </button>
                  <button className="dropdown-item d-flex align-items-center gap-2" onClick={handleClickOutside}>
                    <i className="bi bi-gear"></i> Settings
                  </button>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item text-danger d-flex align-items-center gap-2" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right"></i> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {showUserMenu && (
        <div className="position-fixed w-100 h-100" style={{ top: 0, left: 0, zIndex: 1040 }} onClick={handleClickOutside}></div>
      )}

      {/* Main Content */}
      <div className="container-fluid py-4">
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h2 className="mb-1">My Business Cards</h2>
                <p className="text-muted mb-0">Manage and share your digital business cards</p>
              </div>
              <button className="btn btn-primary d-flex align-items-center gap-2" onClick={openAddModal}>
                <i className="bi bi-plus-circle"></i>
                <span className="d-none d-sm-inline">Add New Card</span>
                <span className="d-sm-none">Add</span>
              </button>
            </div>

            {error && (
              <div className="alert alert-danger d-flex align-items-center gap-2">
                <i className="bi bi-exclamation-triangle"></i>
                {error}
              </div>
            )}

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 text-muted">Loading your business cards...</p>
              </div>
            ) : (
              <div className="row">
                {cards.length === 0 ? (
                  <div className="col-12">
                    <div className="text-center py-5">
                      <div className="mb-4">
                        <i className="bi bi-person-badge text-muted" style={{ fontSize: '4rem' }}></i>
                      </div>
                      <h4 className="text-muted mb-3">No business cards yet</h4>
                      <p className="text-muted mb-4">Create your first business card to get started</p>
                      <button className="btn btn-primary btn-lg d-flex align-items-center gap-2 mx-auto" onClick={openAddModal}>
                        <i className="bi bi-plus-circle"></i>
                        Create Your First Card
                      </button>
                    </div>
                  </div>
                ) : (
                  cards.map((card) => (
                    <div key={card.id} className="col-md-8 col-lg-4 mb-4">
                      <div className="card h-100 shadow-sm border-0">
                        <div className="card-body">
                          <div className="d-flex align-items-start justify-content-between mb-3">
                            <h5 className="card-title mb-0 text-truncate">{card.fullName}</h5>
                          </div>

                          {card.jobTitle && (
                            <h6 className="card-subtitle mb-3 text-primary fw-semibold">
                              {card.jobTitle}
                            </h6>
                          )}

                          <div className="d-flex flex-column gap-2">
                            {card.email && (
                              <small className="text-muted d-flex align-items-center gap-2">
                                <i className="bi bi-envelope"></i> {card.email}
                              </small>
                            )}
                            {card.phone && (
                              <small className="text-muted d-flex align-items-center gap-2">
                                <i className="bi bi-telephone"></i> {card.phone}
                              </small>
                            )}
                            {card.address && (
                              <small className="text-muted d-flex align-items-center gap-2">
                                <i className="bi bi-geo-alt"></i> {card.address}
                              </small>
                            )}
                          </div>
                        </div>

                        <div className="card-footer bg-transparent border-0 pt-0">
                          <div className="btn-group w-100" role="group">
                            <button
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => {
                                setSelectedCard(card);
                                setIsModalOpen(true);
                              }}
                            >
                              <i className="bi bi-pencil me-1"></i>
                              <span className="d-none d-lg-inline">Edit</span>
                            </button>
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => deleteCard(card.id)}
                            >
                              <i className="bi bi-trash me-1"></i>
                              <span className="d-none d-lg-inline">Delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
