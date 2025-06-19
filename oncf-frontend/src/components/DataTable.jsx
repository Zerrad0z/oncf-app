import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './DataTable.css';
import * as XLSX from 'xlsx';
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
  FaInfoCircle,
  FaFileExcel,
  FaExclamationTriangle  
} from 'react-icons/fa';

import FilterBar from './FilterBar';

function DataTable({
  data = [],
  columns = [],
  filters = [],
  actions = { edit: true, view: false, delete: true },
  onDelete = null, 
  loading = false,
  error = null,
  addButtonText = 'Ajouter',
  addButtonPath = '',
  noDataMessage = 'Aucun résultat trouvé',
  title = 'Données',
  advancedFiltering = false,
  advancedFilterOptions = [],
  enableExport = true,
  exportFilename = 'export.xlsx',
  exportSheetName = 'Data',
  confirmDelete = true,
  deleteConfirmMessage = "Êtes-vous sûr de vouloir supprimer cet élément ?",
  deleteSuccessMessage = "L'élément a été supprimé avec succès."
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

  // State for delete functionality
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState({ show: false, success: false, message: '' });
  const [localData, setLocalData] = useState([]);
  
  // Initialize local data
  useEffect(() => {
    setLocalData(data);
  }, [data]);
  
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

  // Handle delete click
  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    if (confirmDelete) {
      setShowDeleteConfirm(true);
    } else {
      performDelete(item);
    }
  };

  // Confirm delete
  const confirmDeleteAction = () => {
    performDelete(itemToDelete);
    setShowDeleteConfirm(false);
  };

  // Cancel delete
  const cancelDelete = () => {
    setItemToDelete(null);
    setShowDeleteConfirm(false);
  };

  // Perform delete
  const performDelete = async (item) => {
    try {
      // If there's an external delete handler, use it
      if (onDelete) {
        const result = await onDelete(item);
        
        // If the delete handler returns false, don't update local state
        if (result === false) {
          return;
        }
      }
      
      // Update local data state (optimistic update)
      setLocalData(prevData => prevData.filter(i => i.id !== item.id));
      
      // Show success message
      setDeleteStatus({
        show: true,
        success: true,
        message: deleteSuccessMessage
      });
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setDeleteStatus({ show: false, success: false, message: '' });
      }, 3000);
      
    } catch (error) {
      // Show error message
      setDeleteStatus({
        show: true,
        success: false,
        message: `Erreur: ${error.message || "Impossible de supprimer l'élément."}`
      });
      
      // Hide error message after 5 seconds
      setTimeout(() => {
        setDeleteStatus({ show: false, success: false, message: '' });
      }, 5000);
    }
  };
  
  // Apply filters, search, and sorting to data
  const filteredData = useMemo(() => {
    // Start with all data (using local data state that can be modified by delete operations)
    let result = [...localData];
    
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
  }, [localData, searchTerm, activeFilters, sortConfig, filters]);
  
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
    
    if (pages[0] > 1) {
      if (pages[0] > 2) {
        pages.unshift('...');
      }
      pages.unshift(1);
    }
    
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
  
  // EXCEL EXPORT FUNCTIONALITY
  const handleExportToExcel = () => {
    // Function to prepare data for export
    const prepareDataForExport = () => {
      // Create an array of column ids that should be exported
      const exportableColumns = columns.filter(col => col.exportable !== false);
      
      // Create header row with column labels
      const headerRow = exportableColumns.map(col => col.label);
      
      // Create data rows
      const dataRows = filteredData.map(item => 
        exportableColumns.map(col => {
     
          if (col.exportRender) {
            return col.exportRender(item);
          } else if (col.render && typeof col.render(item) === 'string') {
            return col.render(item);
          } else {
            return item[col.id];
          }
        })
      );
      
      // Combine headers and data
      return [headerRow, ...dataRows];
    };
    
    try {
      // Prepare the data
      const exportData = prepareDataForExport();
      
      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(exportData);
      
      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, exportSheetName);
      
      // Generate filename with date if not specified
      const filename = exportFilename || `${title.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`;
      
      // Write and download the file
      XLSX.writeFile(wb, filename);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      alert('Une erreur est survenue lors de l\'exportation vers Excel.');
    }
  };
  
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
      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="delete-modal-overlay">
          <div className="delete-modal">
            <div className="delete-modal-header">
              <FaExclamationTriangle className="delete-icon" />
              <h2>Confirmation de suppression</h2>
            </div>
            <div className="delete-modal-body">
              <p>{deleteConfirmMessage}</p>
              {itemToDelete && columns.length > 0 && (
                <div className="delete-item-info">
                  {/* Display key information about the item being deleted */}
                  <p>
                    <strong>{columns[0].label}: </strong>
                    {columns[0].render 
                      ? columns[0].render(itemToDelete) 
                      : itemToDelete[columns[0].id]}
                  </p>
                  {columns.length > 1 && (
                    <p>
                      <strong>{columns[1].label}: </strong>
                      {columns[1].render 
                        ? columns[1].render(itemToDelete) 
                        : itemToDelete[columns[1].id]}
                    </p>
                  )}
                </div>
              )}
            </div>
            <div className="delete-modal-footer">
              <button 
                className="btn btn-outline-secondary"
                onClick={cancelDelete}
              >
                Annuler
              </button>
              <button 
                className="btn btn-danger"
                onClick={confirmDeleteAction}
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete status message */}
      {deleteStatus.show && (
        <div className={`datatable-alert ${deleteStatus.success ? 'success' : 'error'}`}>
          <FaInfoCircle className="alert-icon" />
          <p>{deleteStatus.message}</p>
        </div>
      )}
      
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
          {/* Excel Export Button */}
          {enableExport && filteredData.length > 0 && (
            <button 
              className="export-button"
              onClick={handleExportToExcel}
              title="Exporter vers Excel"
            >
              <FaFileExcel />
              <span className="export-button-text">Exporter</span>
            </button>
          )}
          
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
                            onClick={() => handleDeleteClick(item)}
                            className="action-button delete-button"
                            title="Supprimer"
                            aria-label="Supprimer"
                          >
                            <FaTrashAlt size={12} className="action-icon" />
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