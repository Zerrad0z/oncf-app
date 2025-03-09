// src/pages/fiches/FichesList.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ficheInfractionService } from '../../services/api';

function FichesList() {
  const [fiches, setFiches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGareD, setSelectedGareD] = useState('');
  
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
        // Fallback to mock data if needed
        setFiches([
          { id: 1, date: '2025-03-01', gareD: 'Agdal', gareA: 'Casablanca Voyageurs', train: 'TGV 301', numVoy: 152, montant: 100.50, motif: 'Voyage sans titre valide', observation: 'Le voyageur a reçu un avertissement', controllerName: 'Benani Mohamed' },
          { id: 2, date: '2025-03-02', gareD: 'Rabat Ville', gareA: 'Kénitra', train: 'IC 208', numVoy: 213, montant: 75.00, motif: 'Billet non composté', observation: 'Première infraction', controllerName: 'Tazi Samir' },
          { id: 3, date: '2025-03-03', gareD: 'Casablanca Voyageurs', gareA: 'Marrakech', train: 'TNR 107', numVoy: 315, montant: 200.75, motif: 'Voyage en première classe avec un billet de seconde', observation: 'Refus de payer la différence', controllerName: 'Alaoui Yasmine' }
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFiches();
  }, []);
  
  // Filter fiches based on search term and selected gare
  const filteredFiches = fiches.filter(fiche => {
    const matchesSearch = searchTerm === '' || 
      Object.values(fiche).some(value => 
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      );
      
    const matchesGareD = selectedGareD === '' || 
      fiche.gareD === selectedGareD;
      
    return matchesSearch && matchesGareD;
  });
  
  // Get unique gare depart values for the filter dropdown
  const garesD = [...new Set(fiches.map(fiche => fiche.gareD))];
  
  if (loading) {
    return <div className="loading">Chargement...</div>;
  }
  
  return (
    <div className="fiches-list-page">
      <div className="page-header">
        <h1>Fiches d'infraction</h1>
        <Link to="/fiches-infraction/new" className="add-button">Ajouter une fiche d'infraction</Link>
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
          value={selectedGareD}
          onChange={(e) => setSelectedGareD(e.target.value)}
        >
          <option value="">Toutes les gares de départ</option>
          {garesD.map((gare, index) => (
            <option key={index} value={gare}>{gare}</option>
          ))}
        </select>
      </div>
      
      {filteredFiches.length === 0 ? (
        <div className="no-results">Aucun résultat trouvé</div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Gare Départ</th>
              <th>Gare Arrivée</th>
              <th>Train</th>
              <th>N° Voyageur</th>
              <th>Montant</th>
              <th>Motif</th>
              <th>Contrôleur</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFiches.map(fiche => (
              <tr key={fiche.id}>
                <td>{fiche.date}</td>
                <td>{fiche.gareD}</td>
                <td>{fiche.gareA}</td>
                <td>{fiche.train}</td>
                <td>{fiche.numVoy}</td>
                <td>{fiche.montant.toFixed(2)} Dh</td>
                <td>{fiche.motif}</td>
                <td>{fiche.controllerName}</td>
                <td>
                  <Link to={`/fiches-infraction/${fiche.id}/edit`} className="edit-button">Modifier</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default FichesList;