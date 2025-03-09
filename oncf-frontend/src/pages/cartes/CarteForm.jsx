// src/pages/cartes/CarteForm.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { cartePerimeeService } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import ControleurSelect from '../../components/ControleurSelect';
import '../../components/ControleurSelect.css';

function CarteForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(id ? true : false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0], // Today's date
    numCarte: '',
    gareD: '',
    gareA: '',
    train: '',
    confort: 1,
    dateDv: '',
    dateFv: '',
    suiteReservee: '',
    controllerId: '',
    agentComId: user?.id || '' // Use the logged-in user's ID
  });
  
  const [submitLoading, setSubmitLoading] = useState(false);
  
  useEffect(() => {
    // If editing, load carte data
    const fetchCarte = async () => {
      if (id) {
        try {
          const response = await cartePerimeeService.getById(id);
          setFormData(response.data);
        } catch (err) {
          console.error('Error fetching carte périmée:', err);
          setError('Erreur lors du chargement des données de la carte.');
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchCarte();
  }, [id]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'confort' ? parseInt(value) : value
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
        await cartePerimeeService.update(id, submissionData);
      } else {
        await cartePerimeeService.create(submissionData);
      }
      navigate('/cartes-perimee');
    } catch (err) {
      console.error('Error saving carte périmée:', err);
      setError('Erreur lors de l\'enregistrement. Veuillez réessayer.');
    } finally {
      setSubmitLoading(false);
    }
  };
  
  if (loading) {
    return <div className="loading">Chargement...</div>;
  }
  
  return (
    <div className="carte-form-page">
      <h1>{id ? 'Modifier' : 'Ajouter'} une carte périmée</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="date">Date de constatation</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="numCarte">Numéro de carte</label>
          <input
            type="text"
            id="numCarte"
            name="numCarte"
            value={formData.numCarte}
            onChange={handleChange}
            required
            placeholder="Numéro de la carte périmée"
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
            <label htmlFor="confort">Niveau de confort</label>
            <select
              id="confort"
              name="confort"
              value={formData.confort}
              onChange={handleChange}
              required
            >
              <option value={1}>1ère classe</option>
              <option value={2}>2ème classe</option>
            </select>
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="dateDv">Date de validité</label>
            <input
              type="date"
              id="dateDv"
              name="dateDv"
              value={formData.dateDv}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="dateFv">Date de fin de validité</label>
            <input
              type="date"
              id="dateFv"
              name="dateFv"
              value={formData.dateFv}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="suiteReservee">Suite réservée</label>
          <textarea
            id="suiteReservee"
            name="suiteReservee"
            value={formData.suiteReservee}
            onChange={handleChange}
            placeholder="Suite réservée à cette carte périmée"
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
          <Link to="/cartes-perimee" className="cancel-button">
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

export default CarteForm;