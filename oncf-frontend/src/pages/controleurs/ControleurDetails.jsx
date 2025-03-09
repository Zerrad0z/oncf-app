// src/pages/controleurs/ControleurDetails.jsx
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  controleurService, 
  epaveService, 
  cartePerimeeService, 
  ficheInfractionService 
} from '../../services/api';
import DataTable from '../../components/DataTable';
import './ControleurDetails.css';
import { 
  FaUser, 
  FaIdCard, 
  FaMapMarkerAlt, 
  FaChartBar, 
  FaFileAlt, 
  FaCreditCard, 
  FaBoxOpen,
  FaArrowLeft,
  FaCalendarAlt
} from 'react-icons/fa';

function ControleurDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [controleur, setControleur] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  
  const [epaves, setEpaves] = useState([]);
  const [cartes, setCartes] = useState([]);
  const [fiches, setFiches] = useState([]);
  const [statsData, setStatsData] = useState({
    epavesCount: 0,
    cartesCount: 0,
    fichesCount: 0,
    totalItems: 0
  });
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch controleur details
        const controleurRes = await controleurService.getById(id);
        setControleur(controleurRes.data);
        
        // Fetch all related data
        const [epavesRes, cartesRes, fichesRes] = await Promise.all([
          epaveService.getByController(id),
          cartePerimeeService.getByController(id),
          ficheInfractionService.getByController(id)
        ]);
        
        setEpaves(epavesRes.data);
        setCartes(cartesRes.data);
        setFiches(fichesRes.data);
        
        // Calculate statistics
        setStatsData({
          epavesCount: epavesRes.data.length,
          cartesCount: cartesRes.data.length,
          fichesCount: fichesRes.data.length,
          totalItems: epavesRes.data.length + cartesRes.data.length + fichesRes.data.length
        });
        
        setError(null);
      } catch (err) {
        console.error('Error fetching controleur details:', err);
        setError('Erreur lors du chargement des détails du contrôleur.');
        
        // For development purposes only - remove in production
        const mockControleur = {
          id: parseInt(id),
          nom: "Ouazzani",
          prenom: "Samira",
          antenneName: "Rabat Ville",
          antenneId: 1,
          dateEmbauche: "2018-05-15"
        };
        setControleur(mockControleur);
        
        // Mock epaves
        const mockEpaves = Array(5).fill(0).map((_, i) => ({
          id: 1000 + i,
          date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
          gareDepot: ["Rabat Ville", "Salé", "Kenitra"][Math.floor(Math.random() * 3)],
          train: `TNR ${300 + Math.floor(Math.random() * 100)}`,
          bm379: `BM${10000 + Math.floor(Math.random() * 90000)}`,
          contenu: "Description de l'épave trouvée dans le train",
          controllerId: parseInt(id),
          controllerName: `${mockControleur.nom} ${mockControleur.prenom}`
        }));
        setEpaves(mockEpaves);
        
        // Mock cartes
        const mockCartes = Array(7).fill(0).map((_, i) => ({
          id: 2000 + i,
          date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
          numCarte: `CARTE${100000 + Math.floor(Math.random() * 900000)}`,
          gareD: ["Rabat Ville", "Salé", "Kenitra"][Math.floor(Math.random() * 3)],
          gareA: ["Casablanca", "Tanger", "Marrakech"][Math.floor(Math.random() * 3)],
          train: `TNR ${300 + Math.floor(Math.random() * 100)}`,
          confort: Math.random() > 0.5 ? 1 : 2,
          dateDv: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
          dateFv: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
          suiteReservee: "Carte confisquée",
          controllerId: parseInt(id),
          controllerName: `${mockControleur.nom} ${mockControleur.prenom}`
        }));
        setCartes(mockCartes);
        
        // Mock fiches
        const mockFiches = Array(10).fill(0).map((_, i) => ({
          id: 3000 + i,
          date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
          train: `TNR ${300 + Math.floor(Math.random() * 100)}`,
          gareD: ["Rabat Ville", "Salé", "Kenitra"][Math.floor(Math.random() * 3)],
          gareA: ["Casablanca", "Tanger", "Marrakech"][Math.floor(Math.random() * 3)],
          gareDepot: ["Rabat Ville", "Salé", "Kenitra"][Math.floor(Math.random() * 3)],
          numVoy: Math.floor(Math.random() * 1000),
          montant: Math.floor(Math.random() * 200000) / 100,
          motif: ["Voyage sans titre", "Titre non valide", "Comportement"][Math.floor(Math.random() * 3)],
          observation: "Observation sur l'infraction",
          controllerId: parseInt(id),
          controllerName: `${mockControleur.nom} ${mockControleur.prenom}`
        }));
        setFiches(mockFiches);
        
        // Set mock stats
        setStatsData({
          epavesCount: mockEpaves.length,
          cartesCount: mockCartes.length,
          fichesCount: mockFiches.length,
          totalItems: mockEpaves.length + mockCartes.length + mockFiches.length
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);
  
  // Helper function to format dates
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };
  
  // Get data for current tab
  const getCurrentData = () => {
    switch (activeTab) {
      case 'epaves': return epaves;
      case 'cartes': return cartes;
      case 'fiches': return fiches;
      case 'all':
      default:
        return [
          ...epaves.map(item => ({ ...item, type: 'epave' })),
          ...cartes.map(item => ({ ...item, type: 'carte' })),
          ...fiches.map(item => ({ ...item, type: 'fiche' }))
        ].sort((a, b) => new Date(b.date) - new Date(a.date));
    }
  };
  
  // Get columns based on current tab
  const getColumns = () => {
    const baseColumns = [
      {
        id: 'date',
        label: 'Date',
        sortable: true,
        render: (item) => formatDate(item.date)
      }
    ];
    
    switch (activeTab) {
      case 'epaves':
        return [
          ...baseColumns,
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
            render: (item) => {
              const maxLength = 50;
              return item.contenu.length > maxLength 
                ? `${item.contenu.substring(0, maxLength)}...` 
                : item.contenu;
            }
          }
        ];
        
      case 'cartes':
        return [
          ...baseColumns,
          {
            id: 'numCarte',
            label: 'Numéro Carte',
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
            label: 'Classe',
            sortable: true,
            render: (item) => `${item.confort}`
          },
          {
            id: 'dateFv',
            label: 'Date Fin',
            sortable: true,
            render: (item) => formatDate(item.dateFv)
          }
        ];
        
      case 'fiches':
        return [
          ...baseColumns,
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
            id: 'numVoy',
            label: 'N° Voyageur',
            sortable: true
          },
          {
            id: 'montant',
            label: 'Montant (Dh)',
            sortable: true,
            render: (item) => item.montant?.toLocaleString('fr-FR', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            }) || '-'
          },
          {
            id: 'motif',
            label: 'Motif',
            sortable: true
          }
        ];
        
      case 'all':
      default:
        return [
          {
            id: 'type',
            label: 'Type',
            sortable: true,
            render: (item) => {
              switch (item.type) {
                case 'epave': return (
                  <div className="item-type epave">
                    <FaBoxOpen className="type-icon" />
                    <span>Épave</span>
                  </div>
                );
                case 'carte': return (
                  <div className="item-type carte">
                    <FaCreditCard className="type-icon" />
                    <span>Carte</span>
                  </div>
                );
                case 'fiche': return (
                  <div className="item-type fiche">
                    <FaFileAlt className="type-icon" />
                    <span>Fiche</span>
                  </div>
                );
                default: return '-';
              }
            }
          },
          ...baseColumns,
          {
            id: 'train',
            label: 'Train',
            sortable: true
          },
          {
            id: 'description',
            label: 'Description',
            sortable: false,
            render: (item) => {
              switch (item.type) {
                case 'epave':
                  return `BM379: ${item.bm379} - ${item.contenu?.substring(0, 30)}${item.contenu?.length > 30 ? '...' : ''}`;
                case 'carte':
                  return `Carte: ${item.numCarte} - ${item.gareD} à ${item.gareA}`;
                case 'fiche':
                  return `Motif: ${item.motif} - Montant: ${item.montant?.toLocaleString('fr-FR')} Dh`;
                default:
                  return '-';
              }
            }
          }
        ];
    }
  };
  
  // Get detail link based on item type
  const getItemDetailPath = (item) => {
    switch (item.type) {
      case 'epave': return `/epaves/${item.id}/edit`;
      case 'carte': return `/cartes-perimee/${item.id}/edit`;
      case 'fiche': return `/fiches-infraction/${item.id}/edit`;
      default:
        // For tab-specific views where we don't have type
        switch (activeTab) {
          case 'epaves': return `/epaves/${item.id}/edit`;
          case 'cartes': return `/cartes-perimee/${item.id}/edit`;
          case 'fiches': return `/fiches-infraction/${item.id}/edit`;
          default: return '#';
        }
    }
  };
  
  if (loading) {
    return <div className="loading">Chargement...</div>;
  }
  
  if (error && !controleur) {
    return (
      <div className="error-container">
        <div className="error-message">{error}</div>
        <button onClick={() => navigate('/controleurs')} className="back-button">
          <FaArrowLeft /> Retour à la liste
        </button>
      </div>
    );
  }
  
  return (
    <div className="controleur-details-page">
      <div className="page-header">
        <Link to="/controleurs" className="back-link">
          <FaArrowLeft /> Retour aux contrôleurs
        </Link>
        <h1>Détails du contrôleur</h1>
      </div>
      
      <div className="controleur-profile">
        <div className="profile-header">
          <div className="profile-avatar">
            {controleur?.prenom?.charAt(0)}{controleur?.nom?.charAt(0)}
          </div>
          <div className="profile-info">
            <h2>{controleur?.prenom} {controleur?.nom}</h2>
            <div className="info-item">
              <FaIdCard className="info-icon" />
              <span>Matricule: {controleur?.id}</span>
            </div>
            <div className="info-item">
              <FaMapMarkerAlt className="info-icon" />
              <span>Antenne: {controleur?.antenneName}</span>
            </div>
            {controleur?.dateEmbauche && (
              <div className="info-item">
                <FaCalendarAlt className="info-icon" />
                <span>Date d'embauche: {formatDate(controleur.dateEmbauche)}</span>
              </div>
            )}
          </div>
          <div className="profile-actions">
            <Link to={`/controleurs/${id}/edit`} className="edit-button">
              Modifier
            </Link>
          </div>
        </div>
        
        <div className="profile-stats">
          <div className="stats-header">
            <h3>Statistiques</h3>
            <div className="total-count">
              <FaChartBar className="stat-icon total" />
              <span>Total: {statsData.totalItems} éléments</span>
            </div>
          </div>
          <div className="stats-grid">
            <div className="stat-card epaves">
              <div className="stat-card-icon">
                <FaBoxOpen />
              </div>
              <div className="stat-card-content">
                <div className="stat-card-value">{statsData.epavesCount}</div>
                <div className="stat-card-label">Épaves</div>
              </div>
            </div>
            <div className="stat-card cartes">
              <div className="stat-card-icon">
                <FaCreditCard />
              </div>
              <div className="stat-card-content">
                <div className="stat-card-value">{statsData.cartesCount}</div>
                <div className="stat-card-label">Cartes Périmées</div>
              </div>
            </div>
            <div className="stat-card fiches">
              <div className="stat-card-icon">
                <FaFileAlt />
              </div>
              <div className="stat-card-content">
                <div className="stat-card-value">{statsData.fichesCount}</div>
                <div className="stat-card-label">Fiches d'infraction</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="controleur-tabs">
        <button 
          className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          Tous
        </button>
        <button 
          className={`tab-button ${activeTab === 'epaves' ? 'active' : ''}`}
          onClick={() => setActiveTab('epaves')}
        >
          Épaves <span className="tab-count">{statsData.epavesCount}</span>
        </button>
        <button 
          className={`tab-button ${activeTab === 'cartes' ? 'active' : ''}`}
          onClick={() => setActiveTab('cartes')}
        >
          Cartes Périmées <span className="tab-count">{statsData.cartesCount}</span>
        </button>
        <button 
          className={`tab-button ${activeTab === 'fiches' ? 'active' : ''}`}
          onClick={() => setActiveTab('fiches')}
        >
          Fiches d'infraction <span className="tab-count">{statsData.fichesCount}</span>
        </button>
      </div>
      
      <DataTable
        data={getCurrentData()}
        columns={getColumns()}
        filters={[
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
            options: [
              ...new Set(
                [
                    ...epaves.map(e => e.train), 
                    ...cartes.map(c => c.train), 
                    ...fiches.map(f => f.train)
                  ]
                )
              ].filter(Boolean).sort().map(value => ({ value, label: value })),
              placeholderOption: 'Tous les trains',
              filterFn: (item, value) => item.train === value
            },
            ...(activeTab === 'epaves' || activeTab === 'all' ? [
              {
                id: 'gareDepot',
                label: 'Gare/Dépôt',
                type: 'select',
                options: [...new Set(epaves.map(e => e.gareDepot))]
                  .filter(Boolean).sort().map(value => ({ value, label: value })),
                placeholderOption: 'Toutes les gares',
                filterFn: (item, value) => 
                  item.type === 'epave' ? item.gareDepot === value : 
                  activeTab === 'epaves' ? item.gareDepot === value : false
              }
            ] : []),
            ...(activeTab === 'cartes' || activeTab === 'all' ? [
              {
                id: 'confort',
                label: 'Classe',
                type: 'select',
                options: [
                  { value: '1', label: '1ère classe' },
                  { value: '2', label: '2ème classe' }
                ],
                placeholderOption: 'Toutes les classes',
                filterFn: (item, value) => 
                  item.type === 'carte' ? item.confort.toString() === value : 
                  activeTab === 'cartes' ? item.confort.toString() === value : false
              }
            ] : []),
            ...(activeTab === 'fiches' || activeTab === 'all' ? [
              {
                id: 'montantMin',
                label: 'Montant min',
                type: 'select',
                options: [
                  { value: '50', label: '50 Dh et plus' },
                  { value: '100', label: '100 Dh et plus' },
                  { value: '200', label: '200 Dh et plus' },
                  { value: '500', label: '500 Dh et plus' }
                ],
                placeholderOption: 'Tous montants',
                filterFn: (item, value) => 
                  item.type === 'fiche' ? (item.montant || 0) >= parseFloat(value) : 
                  activeTab === 'fiches' ? (item.montant || 0) >= parseFloat(value) : false
              }
            ] : [])
          ]}
          loading={false}
          error={null}
          title={getTabTitle()}
          noDataMessage={getNoDataMessage()}
          actions={{
            edit: true,
            view: false,
            delete: false,
            editPath: (item) => getItemDetailPath(item)
          }}
        />
      </div>
    );
    
    function getTabTitle() {
      switch (activeTab) {
        case 'epaves': return 'Épaves';
        case 'cartes': return 'Cartes Périmées';
        case 'fiches': return 'Fiches d\'infraction';
        case 'all':
        default: return 'Tous les éléments';
      }
    }
    
    function getNoDataMessage() {
      switch (activeTab) {
        case 'epaves': return 'Aucune épave trouvée pour ce contrôleur';
        case 'cartes': return 'Aucune carte périmée trouvée pour ce contrôleur';
        case 'fiches': return 'Aucune fiche d\'infraction trouvée pour ce contrôleur';
        case 'all':
        default: return 'Aucun élément trouvé pour ce contrôleur';
      }
    }
  }
  
  export default ControleurDetails;