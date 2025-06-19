import { useState, useEffect } from 'react';
import { epaveService } from '../../services/api';
import DataTable from '../../components/DataTable';

function EpavesList() {
  const [epaves, setEpaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchEpaves = async () => {
      try {
        setLoading(true);
        const response = await epaveService.getAll();
        setEpaves(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching epaves:', err);
        setError('Erreur lors du chargement des données. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchEpaves();
  }, []);
  
  // Define columns for the DataTable
  const columns = [
    {
      id: 'date',
      label: 'Date',
      sortable: true,
      render: (item) => formatDate(item.date)
    },
    {
      id: 'gareDepot',
      label: 'Gare/Dépôt',
      sortable: true
    },
    {
      id: 'train',
      label: 'Train',
      sortable: true
    },
    {
      id: 'bm379',
      label: 'BM379',
      sortable: true
    },
    {
      id: 'contenu',
      label: 'Contenu',
      sortable: false,
      render: (item) => (
        <div className="content-preview">
          {item.contenu.length > 100 
            ? `${item.contenu.substring(0, 100)}...` 
            : item.contenu}
        </div>
      )
    },
    {
      id: 'controllerName',
      label: 'Contrôleur',
      sortable: true,
      render: (item) => item.controllerName || 'Non assigné'
    }
  ];
  
  // Define filters for the DataTable
  const filters = [
    {
      id: 'dateRange',
      label: 'Date',
      type: 'date',
      filterFn: (item, value) => {
        if (!value) return true;
        return new Date(item.date) >= new Date(value);
      }
    },
    {
      id: 'gareDepot',
      label: 'Gare/Dépôt',
      type: 'select',
      options: getUniqueOptions(epaves, 'gareDepot'),
      placeholderOption: 'Toutes les gares',
      filterFn: (item, value) => item.gareDepot === value
    },
    {
      id: 'train',
      label: 'Train',
      type: 'select',
      options: getUniqueOptions(epaves, 'train'),
      placeholderOption: 'Tous les trains',
      filterFn: (item, value) => item.train === value
    }
  ];
  
  // Helper function to format dates
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };
  
  // Helper function to get unique options for filters
  function getUniqueOptions(data, field) {
    const unique = [...new Set(data.map(item => item[field]))];
    return unique
      .filter(Boolean)
      .sort()
      .map(value => ({ value, label: value }));
  }
  const handleDelete = async (item) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer cette épave ?`)) {
      try {
        await epaveService.delete(item.id);
        setEpaves(epaves.filter(epave => epave.id !== item.id));
      } catch (err) {
        console.error('Error deleting epave:', err);
        alert('Erreur lors de la suppression de l\'épave.');
      }
    }
  };
  
  return (
    <DataTable
      data={epaves}
      columns={columns}
      filters={filters}
      loading={loading}
      error={error}
      title="Epaves"
      addButtonText="Ajouter une épave"
      addButtonPath="/epaves/new"
      noDataMessage="Aucune épave trouvée"
      actions={{
        edit: true,
        view: false,
        delete: true, 
        onDelete: handleDelete, 
        basePath: '/epaves'
      }}
    />
  );
}

export default EpavesList;