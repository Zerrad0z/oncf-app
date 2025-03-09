// src/pages/fiches/FicheForm.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ficheInfractionService } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import ControleurSelect from '../../components/ControleurSelect';
import '../../components/ControleurSelect.css';

function FicheForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(id ? true : false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0], // Today's date
    gareD: '',
    gareA: '',
    gareDepot: '',
    train: '',
    numVoy: '',
    montant: '',
    motif: '',
    observation: '',
    controllerId: '',
    agentComId: user?.id || '' // Use the logged-in user's ID
  });
  
  const [submitLoading, setSubmitLoading] = useState(false);
  
  useEffect(() => {
    // If editing, load fiche data
    const fetchFiche = async () => {
      if (id) {
        try {
          const response = await ficheInfractionService.getById(id);
          setFormData(response.data);
        } catch (err) {
          console.error('Error fetching fiche:', err);
          setError('Erreur lors du chargement des données de la fiche.');
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchFiche();
  }, [id]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'numVoy' || name === 'montant' ? 
        parseFloat(value) || '' : value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError(null);
    
    try {
      // Ensure the agentComId is set to the current user
      const submissionData = {
        ...formData,
        agentComId: user?.id
      };
      
      if (id) {
        await ficheInfractionService.update(id, submissionData);
      } else {
        await ficheInfractionService.create(submissionData);
      }
      navigate('/fiches-infraction');
    } catch (err) {
      console.error('Error saving fiche:', err);
      setError('Erreur lors de l\'enregistrement. Veuillez réessayer.');
    } finally {
      setSubmitLoading(false);
    }
  };
  
  if (loading) {
    return <div className="loading">Chargement...</div>;
  }
  
  return (
    <div className="fiche-form-page">
      <h1>{id ? 'Modifier' : 'Ajouter'} une fiche d'infraction</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="gareD">Gare de départ</label>
            <input
              type="text"
              id="gareD"
              name="gareD"
              value={formData.gareD}
              onChange={handleChange}
              required
              placeholder="Gare de départ"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="gareA">Gare d'arrivée</label>
            <input
              type="text"
              id="gareA"
              name="gareA"
              value={formData.gareA}
              onChange={handleChange}
              required
              placeholder="Gare d'arrivée"
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="train">Train</label>
            <input
              type="text"
              id="train"
              name="train"
              value={formData.train}
              onChange={handleChange}
              required
              placeholder="Numéro du train"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="gareDepot">Gare/Dépôt</label>
            <input
              type="text"
              id="gareDepot"
              name="gareDepot"
              value={formData.gareDepot}
              onChange={handleChange}
              required
              placeholder="Gare/Dépôt"
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="numVoy">Numéro voyageur</label>
            <input
              type="number"
              id="numVoy"
              name="numVoy"
              value={formData.numVoy}
              onChange={handleChange}
              required
              placeholder="Numéro du voyageur"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="montant">Montant (Dh)</label>
            <input
              type="number"
              step="0.01"
              id="montant"
              name="montant"
              value={formData.montant}
              onChange={handleChange}
              required
              placeholder="Montant de l'infraction"
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="motif">Motif</label>
          <input
            type="text"
            id="motif"
            name="motif"
            value={formData.motif}
            onChange={handleChange}
            required
            placeholder="Motif de l'infraction"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="observation">Observation</label>
          <textarea
            id="observation"
            name="observation"
            value={formData.observation}
            onChange={handleChange}
            placeholder="Observations complémentaires"
            rows={3}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="controllerId">Contrôleur</label>
          <ControleurSelect
            id="controllerId"
            name="controllerId"
            value={formData.controllerId}
            onChange={handleChange}
            required={true}
          />
        </div>
        
        <div className="form-buttons">
          <Link to="/fiches-infraction" className="cancel-button">
            Annuler
          </Link>
          <button type="submit" className="submit-button" disabled={submitLoading}>
            {submitLoading ? 'Enregistrement...' : id ? 'Mettre à jour' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default FicheForm;