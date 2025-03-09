// src/pages/cartes/CartesList.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cartePerimeeService } from '../../services/api';

function CartesList() {
  const [cartes, setCartes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConfort, setSelectedConfort] = useState('');
  
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
        // Fallback to mock data
        setCartes([
          { id: 1, date: '2025-03-01', numCarte: 'CARTE12345', gareD: 'Agdal', gareA: 'Casablanca Voyageurs', train: 'TGV 301', confort: 1, dateDv: '2024-01-01', dateFv: '2025-01-01', suiteReservee: 'Renouvellement proposé', controllerName: 'Benani Mohamed' },
          { id: 2, date: '2025-03-02', numCarte: 'CARTE67890', gareD: 'Rabat Ville', gareA: 'Fès', train: 'IC 209', confort: 2, dateDv: '2024-06-01', dateFv: '2025-02-01', suiteReservee: 'Carte confisquée', controllerName: 'Tazi Samir' },
          { id: 3, date: '2025-03-03', numCarte: 'CARTE54321', gareD: 'Casablanca Voyageurs', gareA: 'Tanger', train: 'TNR 108', confort: 1, dateDv: '2023-12-01', dateFv: '2025-03-01', suiteReservee: 'Avertissement donné', controllerName: 'Alaoui Yasmine' }
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCartes();
  }, []);
  
  // Filter cartes based on search term and selected confort
  const filteredCartes = cartes.filter(carte => {
    const matchesSearch = searchTerm === '' || 
      Object.values(carte).some(value => 
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      );
      
    const matchesConfort = selectedConfort === '' || 
      carte.confort === parseInt(selectedConfort);
      
    return matchesSearch && matchesConfort;
  });
  
  if (loading) {
    return <div className="loading">Chargement...</div>;
  }
  
  return (
    <div className="cartes-list-page">
      <div className="page-header">
        <h1>Cartes Périmées</h1>
        <Link to="/cartes-perimee/new" className="add-button">Ajouter une carte périmée</Link>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="filter-section">
        <input 
          type="text" 
          placeholder="Rechercher..." 
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select 
          className="filter-select"
          value={selectedConfort}
          onChange={(e) => setSelectedConfort(e.target.value)}
        >
          <option value="">Tous les niveaux de confort</option>
          <option value="1">Confort 1</option>
          <option value="2">Confort 2</option>
        </select>
      </div>
      
      {filteredCartes.length === 0 ? (
        <div className="no-results">Aucun résultat trouvé</div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Numéro de Carte</th>
              <th>Départ</th>
              <th>Arrivée</th>
              <th>Train</th>
              <th>Confort</th>
              <th>Date Validité</th>
              <th>Date Fin</th>
              <th>Contrôleur</th>
              <th>Suite Réservée</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCartes.map(carte => (
              <tr key={carte.id}>
                <td>{carte.date}</td>
                <td>{carte.numCarte}</td>
                <td>{carte.gareD}</td>
                <td>{carte.gareA}</td>
                <td>{carte.train}</td>
                <td>{carte.confort}</td>
                <td>{carte.dateDv}</td>
                <td>{carte.dateFv}</td>
                <td>{carte.controllerName || 'Non assigné'}</td>
                <td>{carte.suiteReservee}</td>
                <td>
                  <Link to={`/cartes-perimee/${carte.id}/edit`} className="edit-button">Modifier</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default CartesList;