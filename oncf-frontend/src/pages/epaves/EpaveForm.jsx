// src/pages/epaves/EpaveForm.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { epaveService } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import ControleurSelect from '../../components/ControleurSelect';
import '../../components/ControleurSelect.css';

function EpaveForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(id ? true : false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0], // Today's date
    gareDepot: '',
    train: '',
    bm379: '',
    contenu: '',
    controllerId: '',
    agentComId: user?.id || '' // Use the logged-in user's ID
  });
  
  const [submitLoading, setSubmitLoading] = useState(false);
  
  useEffect(() => {
    // If editing, load epave data
    const fetchEpave = async () => {
      if (id) {
        try {
          const response = await epaveService.getById(id);
          setFormData(response.data);
        } catch (err) {
          console.error('Error fetching epave:', err);
          setError('Erreur lors du chargement des données de l\'épave.');
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchEpave();
  }, [id]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
        await epaveService.update(id, submissionData);
      } else {
        await epaveService.create(submissionData);
      }
      navigate('/epaves');
    } catch (err) {
      console.error('Error saving epave:', err);
      setError('Erreur lors de l\'enregistrement. Veuillez réessayer.');
    } finally {
      setSubmitLoading(false);
    }
  };
  
  if (loading) {
    return <div className="loading">Chargement...</div>;
  }
  
  return (
    <div className="epave-form-page">
      <h1>{id ? 'Modifier' : 'Ajouter'} une épave</h1>
      
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
        
        <div className="form-group">
          <label htmlFor="gareDepot">Gare/Dépôt</label>
          <input
            type="text"
            id="gareDepot"
            name="gareDepot"
            value={formData.gareDepot}
            onChange={handleChange}
            required
            placeholder="Entrez le nom de la gare ou du dépôt"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="train">Train</label>
          <input
            type="text"
            id="train"
            name="train"
            value={formData.train}
            onChange={handleChange}
            required
            placeholder="Numéro du train (ex: TGV 301)"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="bm379">BM379</label>
          <input
            type="text"
            id="bm379"
            name="bm379"
            value={formData.bm379}
            onChange={handleChange}
            required
            placeholder="Numéro BM379"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="contenu">Contenu</label>
          <textarea
            id="contenu"
            name="contenu"
            value={formData.contenu}
            onChange={handleChange}
            required
            placeholder="Description du contenu de l'épave"
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
          <Link to="/epaves" className="cancel-button">
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

export default EpaveForm;