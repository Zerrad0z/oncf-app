// src/pages/fiches/FichesList.jsx
import { useState, useEffect } from 'react';
import { ficheInfractionService } from '../../services/api';
import DataTable from '../../components/DataTable';

function FichesList() {
  const [fiches, setFiches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchFiches = async () => {
      try {
        setLoading(true);
        const response = await ficheInfractionService.getAll();
        setFiches(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching fiches d\'infraction:', err);
        setError('Erreur lors du chargement des données. Veuillez réessayer.');
        
        // For development/demo purposes only - remove in production
        setFiches([
          {
            id: 1,
            date: '2025-03-09',
            train: 'TNR 394',
            gareD: 'Kenitra',
            gareA: 'Rabat Ville',
            gareDepot: 'Kenitra',
            numVoy: 10,
            montant: 200000.00,
            motif: 'okkw',
            controllerName: 'Ouazzani Samira'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFiches();
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
      id: 'train',
      label: 'Train',
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
      id: 'gareDepot',
      label: 'Gare/Dépôt',
      sortable: true
    },
    {
      id: 'numVoy',
      label: 'N° Voyageur',
      sortable: true
    },
    {
      id: 'montant',
      label: 'Montant (Dh)',
      sortable: true,
      render: (item) => formatMontant(item.montant)
    },
    {
      id: 'motif',
      label: 'Motif',
      sortable: true
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
      options: getUniqueOptions(fiches, 'gareDepot'),
      placeholderOption: 'Toutes les gares',
      filterFn: (item, value) => item.gareDepot === value
    },
    {
      id: 'train',
      label: 'Train',
      type: 'select',
      options: getUniqueOptions(fiches, 'train'),
      placeholderOption: 'Tous les trains',
      filterFn: (item, value) => item.train === value
    },
    {
      id: 'montantMin',
      label: 'Montant minimum',
      type: 'select',
      options: [
        { value: '50', label: '50 Dh et plus' },
        { value: '100', label: '100 Dh et plus' },
        { value: '200', label: '200 Dh et plus' },
        { value: '500', label: '500 Dh et plus' }
      ],
      placeholderOption: 'Tous les montants',
      filterFn: (item, value) => item.montant >= parseFloat(value)
    }
  ];
  
  // Helper function to format dates
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };
  
  // Helper function to format montant
  const formatMontant = (montant) => {
    if (montant === undefined || montant === null) return '-';
    return montant.toLocaleString('fr-FR', { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };
  
  // Helper function to get unique options for filters
  function getUniqueOptions(data, field) {
    const unique = [...new Set(data.map(item => item[field]))];
    return unique
      .filter(Boolean)
      .sort()
      .map(value => ({ value, label: value }));
  }
  
  // Handle delete function if needed
  const handleDelete = async (item) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer cette fiche d'infraction ?`)) {
      try {
        await ficheInfractionService.delete(item.id);
        setFiches(fiches.filter(fiche => fiche.id !== item.id));
      } catch (err) {
        console.error('Error deleting fiche:', err);
        alert('Erreur lors de la suppression de la fiche d\'infraction.');
      }
    }
  };
  
  return (
    <DataTable
      data={fiches}
      columns={columns}
      filters={filters}
      loading={loading}
      error={error}
      title="Fiches d'infraction"
      addButtonText="Ajouter une fiche d'infraction"
      addButtonPath="/fiches-infraction/new"
      noDataMessage="Aucune fiche d'infraction trouvée"
      actions={{
        edit: true,
        view: false,
        delete: true,
        basePath: '/fiches-infraction',
        onDelete: handleDelete
      }}
    />
  );
}

export default FichesList;