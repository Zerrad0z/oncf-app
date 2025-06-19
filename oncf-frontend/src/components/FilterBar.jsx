import { useState, useEffect } from 'react';
import { FaFilter, FaSearch, FaCalendarAlt, FaTimes } from 'react-icons/fa';
import '../styles/FormStyles.css';

function FilterBar({ onApplyFilters, filterOptions = [], initialValues = {} }) {
  const [filters, setFilters] = useState(initialValues);

  useEffect(() => {
    const initialFilters = {};
    filterOptions.forEach(option => {
      initialFilters[option.id] = initialValues[option.id] || '';
    });
    setFilters(initialFilters);
  }, [filterOptions, initialValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onApplyFilters(filters);
  };

  const handleReset = () => {
    const resetFilters = {};
    filterOptions.forEach(option => {
      resetFilters[option.id] = '';
    });
    setFilters(resetFilters);
    onApplyFilters(resetFilters);
  };

  return (
    <div className="form-section">
      <div className="form-section-header">
        <FaFilter /> Filtres avancés
        <button 
          className="form-section-reset" 
          onClick={handleReset}
          title="Réinitialiser les filtres"
        >
          <FaTimes /> Réinitialiser
        </button>
      </div>
      <div className="form-section-content">
        <form onSubmit={handleSubmit} className="form-inline">
          {filterOptions.map(option => (
            <div className="form-group" key={option.id}>
              <label htmlFor={option.id}>{option.label}</label>
              
              {option.type === 'text' && (
                <div className="input-with-icon">
                  <FaSearch className="input-icon" />
                  <input
                    type="text"
                    id={option.id}
                    name={option.id}
                    value={filters[option.id] || ''}
                    onChange={handleChange}
                    placeholder={option.placeholder || ''}
                    className="form-control form-control-sm"
                  />
                </div>
              )}
              
              {option.type === 'date' && (
                <div className="input-with-icon">
                  <FaCalendarAlt className="input-icon" />
                  <input
                    type="date"
                    id={option.id}
                    name={option.id}
                    value={filters[option.id] || ''}
                    onChange={handleChange}
                    className="form-control form-control-sm"
                  />
                </div>
              )}
              
              {option.type === 'select' && (
                <select
                  id={option.id}
                  name={option.id}
                  value={filters[option.id] || ''}
                  onChange={handleChange}
                  className="form-control form-control-sm"
                >
                  <option value="">{option.placeholderOption || 'Tous'}</option>
                  {option.options && option.options.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              )}
            </div>
          ))}
          
          <div className="form-group" style={{ alignSelf: 'flex-end' }}>
            <button type="submit" className="btn btn-primary">
              Appliquer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FilterBar;