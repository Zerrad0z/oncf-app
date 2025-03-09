// src/pages/cartes/CartesList.jsx
import { useState, useEffect } from 'react';
import { cartePerimeeService } from '../../services/api';
import DataTable from '../../components/DataTable';

function CartesList() {
  const [cartes, setCartes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchCartes = async () => {
      try {
        setLoading(true);
        const response = await cartePerimeeService.getAll();
        setCartes(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching cartes périmées:', err);
        setError('Erreur lors du chargement des données. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCartes();
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
      id: 'numCarte',
      label: 'Numéro de Carte',
      sortable: true
    },
    {
      id: 'gareD',
      label: 'Départ',
      sortable: true
    },
    {
      id: 'gareA',
      label: 'Arrivée',
      sortable: true
    },
    {
      id: 'train',
      label: 'Train',
      sortable: true
    },
    {
      id: 'confort',
      label: 'Confort',
      sortable: true,
      render: (item) => `${item.confort}ère classe`
    },
    {
      id: 'dateDv',
      label: 'Date Validité',
      sortable: true,
      render: (item) => formatDate(item.dateDv)
    },
    {
      id: 'dateFv',
      label: 'Date Fin',
      sortable: true,
      render: (item) => formatDate(item.dateFv)
    },
    {
      id: 'controllerName',
      label: 'Contrôleur',
      sortable: true,
      render: (item) => item.controllerName || 'Non assigné'
    },
    {
      id: 'suiteReservee',
      label: 'Suite Réservée',
      sortable: false
    }
  ];
  
  // Define filters for the DataTable
  const filters = [
    {
      id: 'confort',
      label: 'Niveau de confort',
      type: 'select',
      options: [
        { value: '1', label: '1ère classe' },
        { value: '2', label: '2ème classe' }
      ],
      placeholderOption: 'Tous les niveaux',
      filterFn: (item, value) => item.confort.toString() === value
    },
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
      id: 'train',
      label: 'Train',
      type: 'select',
      options: getUniqueOptions(cartes, 'train'),
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
  
  return (
    <DataTable
      data={cartes}
      columns={columns}
      filters={filters}
      loading={loading}
      error={error}
      title="Cartes Périmées"
      addButtonText="Ajouter une carte périmée"
      addButtonPath="/cartes-perimee/new"
      noDataMessage="Aucune carte périmée trouvée"
      actions={{
        edit: true,
        view: false,
        delete: false,
        basePath: '/cartes-perimee'
      }}
    />
  );
}

export default CartesList;