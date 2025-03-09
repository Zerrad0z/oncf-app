// src/pages/controleurs/ControleursList.jsx
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
        
        // This would be better done with a single API call in a real application
        // but for now we'll simulate with separate calls
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
        
        // For development purposes only - remove in production
        const mockControleurs = [
          { id: 12345, nom: "Benjelloun", prenom: "Karim", antenneName: "Rabat Ville" },
          { id: 23456, nom: "Ouazzani", prenom: "Samira", antenneName: "Rabat Ville" },
          { id: 34567, nom: "Tahiri", prenom: "Ahmed", antenneName: "Rabat Ville" },
          { id: 45678, nom: "Mansouri", prenom: "Fatima", antenneName: "Casablanca Voyageurs" },
          { id: 56789, nom: "Berrada", prenom: "Youssef", antenneName: "Casablanca Voyageurs" }
        ];
        setControleurs(mockControleurs);
        
        // Mock statistics
        const mockStats = {};
        mockControleurs.forEach(c => {
          mockStats[c.id] = {
            epavesCount: Math.floor(Math.random() * 10),
            cartesCount: Math.floor(Math.random() * 15),
            fichesCount: Math.floor(Math.random() * 20),
            get totalItems() { return this.epavesCount + this.cartesCount + this.fichesCount; }
          };
        });
        setControleurStats(mockStats);
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
    {
      id: 'hasFiches',
      label: 'Avec Fiches',
      type: 'select',
      options: [
        { value: 'true', label: 'Oui' },
        { value: 'false', label: 'Non' }
      ],
      placeholderOption: 'Tous',
      filterFn: (item, value) => {
        const stats = controleurStats[item.id] || { fichesCount: 0 };
        return value === 'true' ? stats.fichesCount > 0 : stats.fichesCount === 0;
      }
    },
    {
      id: 'hasEpaves',
      label: 'Avec Épaves',
      type: 'select',
      options: [
        { value: 'true', label: 'Oui' },
        { value: 'false', label: 'Non' }
      ],
      placeholderOption: 'Tous',
      filterFn: (item, value) => {
        const stats = controleurStats[item.id] || { epavesCount: 0 };
        return value === 'true' ? stats.epavesCount > 0 : stats.epavesCount === 0;
      }
    }
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
        title="Contrôleurs"
        addButtonText="Ajouter un contrôleur"
        addButtonPath="/controleurs/new"
        noDataMessage="Aucun contrôleur trouvé"
        actions={{
          edit: true,
          view: true,
          delete: false,
          basePath: '/controleurs',
          viewPath: (item) => `/controleurs/${item.id}/details`
        }}
      />
    </div>
  );
}

export default ControleursList;