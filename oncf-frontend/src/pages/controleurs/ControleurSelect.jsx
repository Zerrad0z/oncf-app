import { useState, useEffect } from 'react';
import { controleurService } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

function ControleurSelect({ value, onChange, id = 'controllerId', name = 'controllerId', required = false }) {
  const [controleurs, setControleurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedControleur, setSelectedControleur] = useState(null);
  
  const { user } = useAuth();
  const antenneId = user?.antenneId || 1; // Default to first antenne if user has no antenne
  
  // Fetch initial list of controleurs
  useEffect(() => {
    const fetchControleurs = async () => {
      try {
        const response = await controleurService.getByAntenne(antenneId);
        setControleurs(response.data);
        
        // If a value is already selected, find the controleur and set it
        if (value) {
          const selected = response.data.find(c => c.id === parseInt(value));
          if (selected) {
            setSelectedControleur(selected);
          }
        }
      } catch (err) {
        console.error('Error fetching controleurs:', err);
        setError('Erreur lors du chargement des contrôleurs.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchControleurs();
  }, [antenneId, value]);
  
  // Search controleurs when searchTerm changes
  useEffect(() => {
    if (!searchTerm) return;
    
    const searchControleurs = async () => {
      try {
        const response = await controleurService.search(searchTerm, antenneId);
        setControleurs(response.data);
      } catch (err) {
        console.error('Error searching controleurs:', err);
      }
    };
    
    const timeoutId = setTimeout(() => {
      searchControleurs();
    }, 300); // Debounce search
    
    return () => clearTimeout(timeoutId);
  }, [searchTerm, antenneId]);
  
  const handleInputChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setShowDropdown(true);
    
    // If input is cleared, also clear the selection
    if (!term) {
      setSelectedControleur(null);
      onChange({ target: { name, value: '' }});
    }
  };
  
  const handleSelectControleur = (controleur) => {
    setSelectedControleur(controleur);
    setSearchTerm(`${controleur.nom} ${controleur.prenom}`);
    setShowDropdown(false);
    onChange({ target: { name, value: controleur.id }});
  };
  
  const handleInputFocus = () => {
    setShowDropdown(true);
  };
  
  const handleInputBlur = () => {
    // Delay hiding dropdown to allow for clicks
    setTimeout(() => setShowDropdown(false), 200);
  };
  
  if (loading) return <div>Chargement des contrôleurs...</div>;
  if (error) return <div className="error-message">{error}</div>;
  
  return (
    <div className="controleur-select">
      <input
        type="text"
        id={id}
        value={searchTerm}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        placeholder="Rechercher un contrôleur..."
        className="controleur-search-input"
        required={required}
      />
      
      {/* Hidden input to store the actual value */}
      <input 
        type="hidden" 
        name={name} 
        value={selectedControleur?.id || ''}
      />
      
      {showDropdown && controleurs.length > 0 && (
        <div className="controleur-dropdown">
          {controleurs.map(controleur => (
            <div 
              key={controleur.id} 
              className="controleur-item"
              onClick={() => handleSelectControleur(controleur)}
            >
              {controleur.nom} {controleur.prenom} - {controleur.antenneName}
            </div>
          ))}
        </div>
      )}
      
      {showDropdown && searchTerm && controleurs.length === 0 && (
        <div className="controleur-no-results">
          Aucun contrôleur trouvé
        </div>
      )}
    </div>
  );
}

export default ControleurSelect;