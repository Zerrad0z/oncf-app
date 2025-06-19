import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { controleurService, epaveService, cartePerimeeService, ficheInfractionService } from '../../services/api';
import DataTable from '../../components/DataTable';
import './ControleursList.css';
import { FaChartBar, FaFileAlt, FaCreditCard, FaBoxOpen } from 'react-icons/fa';

function ControleursList() {
  const [controleurs, setControleurs] = useState([]);
  const [controleurStats, setControleurStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch controleurs
        const response = await controleurService.getAll();
        const controleursData = response.data;
        setControleurs(controleursData);
        
        // Fetch statistics for each controleur
        const statsMap = {};
        
        for (const controleur of controleursData) {
          try {
            const [epaves, cartes, fiches] = await Promise.all([
              epaveService.getByController(controleur.id),
              cartePerimeeService.getByController(controleur.id),
              ficheInfractionService.getByController(controleur.id)
            ]);
            
            statsMap[controleur.id] = {
              epavesCount: epaves.data.length,
              cartesCount: cartes.data.length,
              fichesCount: fiches.data.length,
              totalItems: epaves.data.length + cartes.data.length + fiches.data.length
            };
          } catch (statError) {
            console.error(`Error fetching stats for controleur ${controleur.id}:`, statError);
            statsMap[controleur.id] = {
              epavesCount: 0,
              cartesCount: 0,
              fichesCount: 0,
              totalItems: 0
            };
          }
        }
        
        setControleurStats(statsMap);
        setError(null);
      } catch (err) {
        console.error('Error fetching controleurs:', err);
        setError('Erreur lors du chargement des contrôleurs.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Define columns for the DataTable
  const columns = [
    {
      id: 'id',
      label: 'Matricule',
      sortable: true
    },
    {
      id: 'fullName',
      label: 'Nom Complet',
      sortable: true,
      render: (item) => `${item.nom} ${item.prenom}`
    },
    {
      id: 'antenneName',
      label: 'Antenne',
      sortable: true
    },
    {
      id: 'stats',
      label: 'Statistiques',
      sortable: false,
      render: (item) => {
        const stats = controleurStats[item.id] || { epavesCount: 0, cartesCount: 0, fichesCount: 0, totalItems: 0 };
        return (
          <div className="controleur-stats">
            <div className="stat-item" title="Épaves">
              <FaBoxOpen className="stat-icon epaves" />
              <span>{stats.epavesCount}</span>
            </div>
            <div className="stat-item" title="Cartes Périmées">
              <FaCreditCard className="stat-icon cartes" />
              <span>{stats.cartesCount}</span>
            </div>
            <div className="stat-item" title="Fiches d'infraction">
              <FaFileAlt className="stat-icon fiches" />
              <span>{stats.fichesCount}</span>
            </div>
            <div className="total-stats" title="Total d'items">
              <FaChartBar className="stat-icon total" />
              <span>{stats.totalItems}</span>
            </div>
          </div>
        );
      }
    }
  ];
  
  // Define filters for the DataTable
  const filters = [
    {
      id: 'antenne',
      label: 'Antenne',
      type: 'select',
      options: getUniqueOptions(controleurs, 'antenneName'),
      placeholderOption: 'Toutes les antennes',
      filterFn: (item, value) => item.antenneName === value
    },
  ];
  
  // Helper function to get unique options for filters
  function getUniqueOptions(data, field) {
    const unique = [...new Set(data.map(item => item[field]))];
    return unique
      .filter(Boolean)
      .sort()
      .map(value => ({ value, label: value }));
  }
  
  return (
    <div className="controleurs-list-page">
      <DataTable
        data={controleurs}
        columns={columns}
        filters={filters}
        loading={loading}
        error={error}
        title="ACT"
        addButtonText="Ajouter un contrôleur"
        addButtonPath="/controleurs/new"
        noDataMessage="Aucun contrôleur trouvé"
        actions={{
          edit: true,
          view: true,
          delete: true,
          basePath: '/controleurs',
          viewPath: (item) => `/controleurs/${item.id}/details`
        }}
      />
    </div>
  );
}

export default ControleursList;