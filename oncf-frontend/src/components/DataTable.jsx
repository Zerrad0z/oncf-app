// src/components/DataTable.jsx
import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './DataTable.css';
// Import icons from react-icons
import { 
  FaEdit, 
  FaTrashAlt, 
  FaEye, 
  FaPlus, 
  FaSearch, 
  FaCalendarAlt,
  FaSortUp, 
  FaSortDown,
  FaFilter,
  FaChevronLeft,
  FaChevronRight,
  FaChevronDown,
  FaTimes,
  FaEllipsisV,
  FaInfoCircle
} from 'react-icons/fa';

// Import FilterBar component
import FilterBar from './FilterBar';

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
  title = 'Données',
  // Add new props for advanced filtering
  advancedFiltering = false,
  advancedFilterOptions = []
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
  
  // State for advanced filter panel
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [advancedFilterValues, setAdvancedFilterValues] = useState({});
  
  // State for responsive design
  const [showFilters, setShowFilters] = useState(false);
  
  // Effect to apply advanced filters to active filters
  useEffect(() => {
    if (Object.keys(advancedFilterValues).length > 0) {
      // Merge advanced filters with active filters
      setActiveFilters(prev => ({
        ...prev,
        ...advancedFilterValues
      }));
      
      // Reset to first page when filters change
      setCurrentPage(1);
    }
  }, [advancedFilterValues]);
  
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
  
  // Clear search field
  const clearSearch = () => {
    setSearchTerm('');
  };
  
  // Handle advanced filter application
  const handleApplyAdvancedFilters = (filters) => {
    setAdvancedFilterValues(filters);
  };
  
  // Handle sort request
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  // Clear all filters
  const clearAllFilters = () => {
    setActiveFilters({});
    setSearchTerm('');
    setAdvancedFilterValues({});
    setCurrentPage(1);
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
  
  // Calculate visible page numbers
  const getVisiblePageNumbers = () => {
    const delta = 1; // How many pages to show before and after current page
    const pages = [];
    
    for (
      let i = Math.max(1, currentPage - delta);
      i <= Math.min(totalPages, currentPage + delta);
      i++
    ) {
      pages.push(i);
    }
    
    // Add first page if not already included
    if (pages[0] > 1) {
      if (pages[0] > 2) {
        pages.unshift('...');
      }
      pages.unshift(1);
    }
    
    // Add last page if not already included
    if (pages[pages.length - 1] < totalPages) {
      if (pages[pages.length - 1] < totalPages - 1) {
        pages.push('...');
      }
      pages.push(totalPages);
    }
    
    return pages;
  };
  
  // Check if any filters are active
  const hasActiveFilters = searchTerm !== '' || Object.values(activeFilters).some(value => value !== '');
  
  // Loading state
  if (loading) {
    return (
      <div className="datatable-loading">
        <div className="spinner"></div>
        <p>Chargement des données...</p>
      </div>
    );
  }
  
  return (
    <div className="datatable-container">
      <div className="datatable-header">
        <div className="header-title">
          <h1>{title}</h1>
          <div className="active-filters-count">
            {hasActiveFilters && (
              <div className="filters-badge">
                {Object.values(activeFilters).filter(Boolean).length + (searchTerm ? 1 : 0)}
              </div>
            )}
          </div>
        </div>
        
        <div className="header-actions">
          {advancedFiltering && (
            <button 
              className={`filter-toggle-button ${showAdvancedFilters ? 'active' : ''}`}
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              <FaFilter />
              <span>Filtres avancés</span>
            </button>
          )}
          
          <button 
            className={`filter-toggle-button ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter />
            <span className="filter-button-text">Filtres</span>
          </button>
          
          {addButtonPath && (
            <Link to={addButtonPath} className="add-button">
              <FaPlus />
              <span className="add-button-text">{addButtonText}</span>
            </Link>
          )}
        </div>
      </div>
      
      {error && (
        <div className="datatable-alert error">
          <FaInfoCircle className="alert-icon" />
          <p>{error}</p>
        </div>
      )}
      
      {advancedFiltering && showAdvancedFilters && (
        <FilterBar 
          onApplyFilters={handleApplyAdvancedFilters} 
          filterOptions={advancedFilterOptions}
        />
      )}
      
      <div className={`datatable-controls ${showFilters ? 'show' : ''}`}>
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
            {searchTerm && (
              <button 
                className="clear-search-button" 
                onClick={clearSearch}
                aria-label="Effacer la recherche"
              >
                <FaTimes />
              </button>
            )}
          </div>
        </div>
        
        {filters.length > 0 && (
          <div className="filters-container">
            {filters.map(filter => (
              <div key={filter.id} className={`filter-field ${activeFilters[filter.id] ? 'filter-active' : ''}`}>
                <label htmlFor={`filter-${filter.id}`}>{filter.label}</label>
                
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
                    <FaChevronDown className="select-arrow" />
                  </div>
                ) : filter.type === 'date' ? (
                  <div className="date-input-wrapper">
                    <input
                      type="date"
                      id={`filter-${filter.id}`}
                      value={activeFilters[filter.id] || ''}
                      onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                      className="filter-date"
                    />
                    <FaCalendarAlt className="calendar-icon" />
                  </div>
                ) : null}
              </div>
            ))}
            
            {hasActiveFilters && (
              <button 
                className="clear-filters-button"
                onClick={clearAllFilters}
                title="Effacer tous les filtres"
              >
                <FaTimes />
                <span>Effacer les filtres</span>
              </button>
            )}
          </div>
        )}
      </div>
      
      <div className="table-stats">
        <div className="results-count">
          <span>{filteredData.length} résultat{filteredData.length !== 1 ? 's' : ''}</span>
        </div>
        <div className="items-per-page">
          <span>Afficher</span>
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
        <div className="no-results">
          <div className="no-results-icon">
            <FaSearch />
          </div>
          <p>{noDataMessage}</p>
          {hasActiveFilters && (
            <button 
              className="clear-filters-button secondary"
              onClick={clearAllFilters}
            >
              Effacer les filtres
            </button>
          )}
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                {columns.map(column => (
                  <th 
                    key={column.id}
                    onClick={() => column.sortable !== false ? requestSort(column.id) : null}
                    className={`${column.sortable !== false ? 'sortable-header' : ''} ${sortConfig.key === column.id ? 'sorted' : ''}`}
                  >
                    <div className="th-content">
                      <span>{column.label}</span>
                      {column.sortable !== false && (
                        <span className="sort-indicator">
                          {sortConfig.key === column.id ? (
                            sortConfig.direction === 'asc' ? 
                              <FaSortUp className="sort-icon" /> : 
                              <FaSortDown className="sort-icon" />
                          ) : (
                            <div className="sort-inactive"></div>
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
                {(actions.edit || actions.view || actions.delete) && (
                  <th className="actions-header">
                    <span>Actions</span>
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, index) => (
                <tr key={item.id || index} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                  {columns.map(column => (
                    <td key={column.id} className={column.id === 'contenu' ? 'content-cell' : ''}>
                      {column.render ? column.render(item) : item[column.id]}
                    </td>
                  ))}
                  {(actions.edit || actions.view || actions.delete) && (
                    <td className="actions-cell">
                      <div className="actions-container">
                        {actions.view && (
                          <Link
                            to={actions.viewPath ? actions.viewPath(item) : `${actions.basePath || ''}/${item.id}`}
                            className="action-button view-button"
                            title="Voir les détails"
                            aria-label="Voir les détails"
                          >
                            <FaEye size={12} className="action-icon" />
                          </Link>
                        )}
                        {actions.edit && (
                          <Link
                            to={actions.editPath ? actions.editPath(item) : `${actions.basePath || ''}/${item.id}/edit`}
                            className="action-button edit-button"
                            title="Modifier"
                            aria-label="Modifier"
                          >
                            <FaEdit size={12} className="action-icon" />
                          </Link>
                        )}
                        {actions.delete && (
                          <button
                            onClick={() => actions.onDelete && actions.onDelete(item)}
                            className="action-button delete-button"
                            title="Supprimer"
                            aria-label="Supprimer"
                          >
                            <FaTrashAlt size={16} className="action-icon" />
                          </button>
                        )}
                      </div>
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
              className="pagination-button first-page"
              aria-label="Première page"
            >
              <FaChevronLeft />
              <FaChevronLeft className="second-chevron" />
            </button>
            
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="pagination-button prev-page"
              aria-label="Page précédente"
            >
              <FaChevronLeft />
            </button>
            
            <div className="pagination-numbers">
              {getVisiblePageNumbers().map((page, index) => (
                typeof page === 'number' ? (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(page)}
                    className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                  >
                    {page}
                  </button>
                ) : (
                  <span key={index} className="pagination-ellipsis">{page}</span>
                )
              ))}
            </div>
            
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="pagination-button next-page"
              aria-label="Page suivante"
            >
              <FaChevronRight />
            </button>
            
            <button 
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="pagination-button last-page"
              aria-label="Dernière page"
            >
              <FaChevronRight />
              <FaChevronRight className="second-chevron" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;