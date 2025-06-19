import { useState } from 'react';
import { FaSearch, FaCalendarAlt, FaFilter } from 'react-icons/fa';
import '../styles/FormStyles.css';

function QuickSearchForm({ onSearch }) {
  const [formData, setFormData] = useState({
    searchTerm: '',
    startDate: '',
    endDate: '',
    status: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(formData);
  };

  const handleReset = () => {
    setFormData({
      searchTerm: '',
      startDate: '',
      endDate: '',
      status: ''
    });
    onSearch({});
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h1>Recherche rapide</h1>
      </div>
      
      <div className="form-content">
        <form onSubmit={handleSubmit} className="quick-form form-compact">
          <div className="form-group">
            <label htmlFor="searchTerm">Terme de recherche</label>
            <div className="input-with-icon">
              <FaSearch className="input-icon" />
              <input
                type="text"
                id="searchTerm"
                name="searchTerm"
                value={formData.searchTerm}
                onChange={handleChange}
                placeholder="Rechercher..."
                className="form-control"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="startDate">Date de début</label>
            <div className="input-with-icon">
              <FaCalendarAlt className="input-icon" />
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="form-control"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="endDate">Date de fin</label>
            <div className="input-with-icon">
              <FaCalendarAlt className="input-icon" />
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="form-control"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="status">Statut</label>
            <div className="input-with-icon">
              <FaFilter className="input-icon" />
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-control"
              >
                <option value="">Tous les statuts</option>
                <option value="en_cours">En cours</option>
                <option value="termine">Terminé</option>
                <option value="en_attente">En attente</option>
                <option value="annule">Annulé</option>
              </select>
            </div>
          </div>
          
          <div className="form-group" style={{ alignSelf: 'flex-end' }}>
            <button type="submit" className="btn btn-primary">
              <FaSearch /> Rechercher
            </button>
          </div>
          
          <div className="form-group" style={{ alignSelf: 'flex-end' }}>
            <button type="button" onClick={handleReset} className="btn btn-outline-secondary">
              Réinitialiser
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default QuickSearchForm;

