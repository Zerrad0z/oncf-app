// src/pages/controleurs/ControleurForm.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { controleurService } from '../../services/api';
import './ControleurForm.css';
import { FaArrowLeft, FaSave } from 'react-icons/fa';

function ControleurForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    id: '',
    nom: '',
    prenom: '',
    antenneId: ''
  });
  
  const [antennes, setAntennes] = useState([]);
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  // Fetch antennes on component mount
  useEffect(() => {
    const fetchAntennes = async () => {
      try {
        // In a real app, uncomment this and use your actual antenne service
        // const response = await antenneService.getAll();
        // setAntennes(response.data);
        
        // Mock data for now
        setAntennes([
          { id: 1, nom: "Rabat Ville" },
          { id: 2, nom: "Casablanca Voyageurs" },
          { id: 3, nom: "Tanger" },
          { id: 4, nom: "Marrakech" }
        ]);
      } catch (err) {
        console.error('Error fetching antennes:', err);
        setError('Erreur lors du chargement des antennes.');
      }
    };
    
    fetchAntennes();
  }, []);
  
  // If editing, fetch the controleur data
  useEffect(() => {
    if (isEditMode) {
      const fetchControleur = async () => {
        try {
          setLoading(true);
          const response = await controleurService.getById(id);
          setFormData({
            id: response.data.id || '',
            nom: response.data.nom || '',
            prenom: response.data.prenom || '',
            antenneId: response.data.antenneId || ''
          });
          setError(null);
        } catch (err) {
          console.error('Error fetching controleur:', err);
          setError('Erreur lors du chargement des données du contrôleur.');
          
          // Mock data for development
          setFormData({
            id,
            nom: "Ouazzani",
            prenom: "Samira",
            antenneId: 1
          });
        } finally {
          setLoading(false);
        }
      };
      
      fetchControleur();
    }
  }, [id, isEditMode]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'antenneId' ? parseInt(value, 10) || '' : value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    
    try {
      // Validate required fields
      if (!formData.id || !formData.nom || !formData.prenom || !formData.antenneId) {
        throw new Error('Veuillez remplir tous les champs obligatoires.');
      }
      
      // Prepare data for submission
      const dataToSubmit = {
        ...formData,
        id: parseInt(formData.id, 10),
        antenneId: parseInt(formData.antenneId, 10)
      };
      
      if (isEditMode) {
        await controleurService.update(id, dataToSubmit);
      } else {
        await controleurService.create(dataToSubmit);
      }
      
      navigate('/controleurs');
    } catch (err) {
      console.error('Error saving controleur:', err);
      setError(err.message || 'Erreur lors de l\'enregistrement. Veuillez réessayer.');
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return <div className="loading">Chargement...</div>;
  }
  
  return (
    <div className="controleur-form-page">
      <div className="page-header">
        <Link to="/controleurs" className="back-link">
          <FaArrowLeft /> Retour à la liste
        </Link>
        <h1>{isEditMode ? 'Modifier' : 'Ajouter'} un contrôleur</h1>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="controleur-form">
        <div className="form-section">
          <h2>Informations personnelles</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="id">Matricule*</label>
              <input
                type="number"
                id="id"
                name="id"
                value={formData.id}
                onChange={handleChange}
                required
                placeholder="Numéro de matricule"
                disabled={isEditMode}
              />
              <div className="form-hint">Numéro d'identification unique</div>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nom">Nom*</label>
              <input
                type="text"
                id="nom"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                required
                placeholder="Nom de famille"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="prenom">Prénom*</label>
              <input
                type="text"
                id="prenom"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                required
                placeholder="Prénom"
              />
            </div>
          </div>
        </div>
        
        <div className="form-section">
          <h2>Informations professionnelles</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="antenneId">Antenne*</label>
              <select
                id="antenneId"
                name="antenneId"
                value={formData.antenneId}
                onChange={handleChange}
                required
              >
                <option value="">Sélectionner une antenne</option>
                {antennes.map(antenne => (
                  <option key={antenne.id} value={antenne.id}>
                    {antenne.nom}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        <div className="form-actions">
          <Link to="/controleurs" className="cancel-button">
            Annuler
          </Link>
          <button 
            type="submit" 
            className="submit-button"
            disabled={submitting}
          >
            <FaSave />
            {submitting 
              ? 'Enregistrement...' 
              : isEditMode ? 'Enregistrer les modifications' : 'Créer le contrôleur'
            }
          </button>
        </div>
      </form>
    </div>
  );
}

export default ControleurForm;