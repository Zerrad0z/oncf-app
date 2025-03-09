// src/pages/epaves/EpavesList.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { epaveService } from '../../services/api';

function EpavesList() {
  const [epaves, setEpaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGare, setSelectedGare] = useState('');
  
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
  
  // Filter epaves based on search term and selected gare
  const filteredEpaves = epaves.filter(epave => {
    const matchesSearch = searchTerm === '' || 
      Object.values(epave).some(value => 
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      );
      
    const matchesGare = selectedGare === '' || 
      epave.gareDepot === selectedGare;
      
    return matchesSearch && matchesGare;
  });
  
  // Get unique gare values for the filter dropdown
  const gares = [...new Set(epaves.map(epave => epave.gareDepot))];
  
  if (loading) {
    return <div className="loading">Chargement...</div>;
  }
  
  if (error) {
    return <div className="error-message">{error}</div>;
  }
  
  return (
    <div className="epaves-list-page">
      <div className="page-header">
        <h1>Epaves</h1>
        <Link to="/epaves/new" className="add-button">Ajouter une épave</Link>
      </div>
      
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
          value={selectedGare}
          onChange={(e) => setSelectedGare(e.target.value)}
        >
          <option value="">Toutes les gares</option>
          {gares.map((gare, index) => (
            <option key={index} value={gare}>{gare}</option>
          ))}
        </select>
      </div>
      
      {filteredEpaves.length === 0 ? (
        <div className="no-results">Aucun résultat trouvé</div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Gare/Dépôt</th>
              <th>Train</th>
              <th>BM379</th>
              <th>Contenu</th>
              <th>Contrôleur</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEpaves.map(epave => (
              <tr key={epave.id}>
                <td>{epave.date}</td>
                <td>{epave.gareDepot}</td>
                <td>{epave.train}</td>
                <td>{epave.bm379}</td>
                <td>{epave.contenu}</td>
                <td>{epave.controllerName}</td>
                <td>
                  <Link to={`/epaves/${epave.id}/edit`} className="edit-button">Modifier</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default EpavesList;