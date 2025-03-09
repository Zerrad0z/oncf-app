// src/components/DataTable.jsx
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import './DataTable.css';
// Import icons from react-icons
import { FaEdit, FaTrashAlt, FaEye, FaPlus, FaSearch, FaCalendarAlt } from 'react-icons/fa';
import { FaSortUp, FaSortDown } from 'react-icons/fa';

function DataTable({
  data = [],
  columns = [],
  filters = [],
  actions = { edit: true, view: false, delete: false },
  loading = false,
  error = null,
  addButtonText = 'Ajouter',
  addButtonPath = '',
  noDataMessage = 'Aucun résultat trouvé',
  title = 'Données'
}) {
  // State for filters and search
  const [activeFilters, setActiveFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for sorting
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'asc'
  });
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Handle filter changes
  const handleFilterChange = (filterId, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterId]: value
    }));
    setCurrentPage(1); // Reset to first page when filter changes
  };
  
  // Handle search input changes
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when search changes
  };
  
  // Handle sort request
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  // Apply filters, search, and sorting to data
  const filteredData = useMemo(() => {
    // Start with all data
    let result = [...data];
    
    // Apply search filter across all columns
    if (searchTerm) {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      result = result.filter(item => {
        return Object.values(item).some(value => 
          value !== null && String(value).toLowerCase().includes(lowercasedSearchTerm)
        );
      });
    }
    
    // Apply each active filter
    Object.entries(activeFilters).forEach(([filterId, value]) => {
      if (value) {
        const filter = filters.find(f => f.id === filterId);
        if (filter && filter.filterFn) {
          result = result.filter(item => filter.filterFn(item, value));
        }
      }
    });
    
    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return result;
  }, [data, searchTerm, activeFilters, sortConfig, filters]);
  
  // Apply pagination
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);
  
  // Calculate total pages
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  
  if (loading) {
    return <div className="loading">Chargement...</div>;
  }
  
  return (
    <div className="data-table-container">
      <div className="table-header">
        <h1>{title}</h1>
        {addButtonPath && (
          <Link to={addButtonPath} className="add-button">
            <FaPlus className="button-icon" />
            <span className="button-text">{addButtonText}</span>
          </Link>
        )}
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="filters-row">
        <div className="search-field">
          <div className="search-input-wrapper">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>
        </div>
        
        {filters.map(filter => (
          <div key={filter.id} className="filter-field">
            <label htmlFor={`filter-${filter.id}`}>{filter.label}:</label>
            
            {filter.type === 'select' ? (
              <div className="select-wrapper">
                <select
                  id={`filter-${filter.id}`}
                  value={activeFilters[filter.id] || ''}
                  onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                  className="filter-select"
                >
                  <option value="">{filter.placeholderOption || 'Tous'}</option>
                  {filter.options.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            ) : filter.type === 'date' ? (
              <div className="date-input-wrapper">
                <input
                  type="date"
                  id={`filter-${filter.id}`}
                  value={activeFilters[filter.id] || ''}
                  onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                  className="filter-date"
                  placeholder="mm/dd/yyyy"
                />
                <FaCalendarAlt className="calendar-icon" />
              </div>
            ) : null}
          </div>
        ))}
      </div>
      
      <div className="table-info">
        <div className="results-count">
          {filteredData.length} résultat{filteredData.length !== 1 ? 's' : ''}
        </div>
        <div className="items-per-page">
          <span>Afficher:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="items-per-page-select"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span>par page</span>
        </div>
      </div>
      
      {paginatedData.length === 0 ? (
        <div className="no-results">{noDataMessage}</div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                {columns.map(column => (
                  <th 
                    key={column.id}
                    onClick={() => column.sortable !== false ? requestSort(column.id) : null}
                    className={column.sortable !== false ? 'sortable-header' : ''}
                  >
                    {column.label}
                    {sortConfig.key === column.id && (
                      <span className="sort-indicator">
                        {sortConfig.direction === 'asc' ? 
                          <FaSortUp className="sort-icon" /> : 
                          <FaSortDown className="sort-icon" />}
                      </span>
                    )}
                  </th>
                ))}
                {(actions.edit || actions.view || actions.delete) && (
                  <th className="actions-header">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, index) => (
                <tr key={item.id || index}>
                  {columns.map(column => (
                    <td key={column.id}>
                      {column.render ? column.render(item) : item[column.id]}
                    </td>
                  ))}
                  {(actions.edit || actions.view || actions.delete) && (
                    <td className="actions-cell">
                      {actions.view && (
                        <Link 
                          to={actions.viewPath ? actions.viewPath(item) : `${actions.basePath || ''}/${item.id}`}
                          className="view-button action-button"
                          title="Voir les détails"
                        >
                          <FaEye className="action-icon" />
                        </Link>
                      )}
                      {actions.edit && (
                        <Link 
                          to={actions.editPath ? actions.editPath(item) : `${actions.basePath || ''}/${item.id}/edit`}
                          className="edit-button action-button"
                          title="Modifier"
                        >
                          <FaEdit className="action-icon" />
                        </Link>
                      )}
                      {actions.delete && (
                        <button
                          onClick={() => actions.onDelete && actions.onDelete(item)}
                          className="delete-button action-button"
                          title="Supprimer"
                        >
                          <FaTrashAlt className="action-icon" />
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {totalPages > 1 && (
        <div className="pagination-container">
          <div className="pagination">
            <button 
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="pagination-button"
            >
              &laquo;
            </button>
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="pagination-button"
            >
              &lsaquo;
            </button>
            
            <span className="page-status">
              {currentPage} / {totalPages}
            </span>
            
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="pagination-button"
            >
              &rsaquo;
            </button>
            <button 
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="pagination-button"
            >
              &raquo;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;