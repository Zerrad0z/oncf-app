// src/pages/epaves/EpaveForm.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { epaveService } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import ControleurSelect from '../controleurs/ControleurSelect';
import '../controleurs/ControleurSelect.css';
import '../../styles/FormStyles.css';
import { 
  FaArrowLeft, 
  FaSave, 
  FaCalendarAlt, 
  FaTrain, 
  FaMapMarkerAlt, 
  FaBox, 
  FaInfo,
  FaFileAlt
} from 'react-icons/fa';

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
    agentComId: user?.id || ''
  });
  
  const [validation, setValidation] = useState({
    gareDepot: { valid: true, message: '' },
    train: { valid: true, message: '' },
    bm379: { valid: true, message: '' },
    contenu: { valid: true, message: '' },
    controllerId: { valid: true, message: '' }
  });
  
  const [submitLoading, setSubmitLoading] = useState(false);
  
  // Calculate discovery days
  const discoveryDays = formData.date ? 
    Math.ceil((new Date() - new Date(formData.date)) / (1000 * 60 * 60 * 24)) : null;
  
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
    
    // Reset validation for this field
    if (validation[name]) {
      setValidation(prev => ({
        ...prev,
        [name]: { valid: true, message: '' }
      }));
    }
  };
  
  const validateForm = () => {
    const newValidation = { ...validation };
    let isValid = true;
    
    // Validate gareDepot
    if (!formData.gareDepot || formData.gareDepot.trim() === '') {
      newValidation.gareDepot = { valid: false, message: 'La gare/dépôt est requise' };
      isValid = false;
    }
    
    // Validate train
    if (!formData.train || formData.train.trim() === '') {
      newValidation.train = { valid: false, message: 'Le numéro de train est requis' };
      isValid = false;
    }
    
    // Validate bm379
    if (!formData.bm379 || formData.bm379.trim() === '') {
      newValidation.bm379 = { valid: false, message: 'Le numéro BM379 est requis' };
      isValid = false;
    }
    
    // Validate contenu
    if (!formData.contenu || formData.contenu.trim() === '') {
      newValidation.contenu = { valid: false, message: 'La description du contenu est requise' };
      isValid = false;
    } else if (formData.contenu.length < 10) {
      newValidation.contenu = { valid: false, message: 'La description doit comporter au moins 10 caractères' };
      isValid = false;
    }
    
    // Validate controllerId
    if (!formData.controllerId) {
      newValidation.controllerId = { valid: false, message: 'Le contrôleur est requis' };
      isValid = false;
    }
    
    setValidation(newValidation);
    return isValid;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }
    
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
    return (
      <div className="form-loading">
        <div className="spinner"></div>
        <p>Chargement des données...</p>
      </div>
    );
  }
  
  return (
    <div className="form-container">
      <div className="form-header">
        <h1>{id ? 'Modifier' : 'Ajouter'} une épave</h1>
        <Link to="/epaves" className="back-button">
          <FaArrowLeft /> Retour à la liste
        </Link>
      </div>
      
      <div className="form-content form-compact">
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <div className="form-section-header">
              <FaCalendarAlt /> Informations générales
            </div>
            <div className="form-section-content">
              <div className="form-group">
                <label htmlFor="date">Date de découverte <span className="required">*</span></label>
                <div className="input-with-icon">
                  <FaCalendarAlt className="input-icon" />
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="form-control"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Jours depuis la découverte</label>
                <div className="form-control" style={{ backgroundColor: '#f5f9ff' }}>
                  {discoveryDays !== null ? (
                    <span className={`status-badge ${discoveryDays > 30 ? 'warning' : 'info'}`}>
                      {discoveryDays === 0 ? 'Aujourd\'hui' : `${discoveryDays} jour${discoveryDays > 1 ? 's' : ''}`}
                    </span>
                  ) : (
                    'Calculé automatiquement'
                  )}
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="bm379">BM379 <span className="required">*</span></label>
                <div className="input-with-icon">
                  <FaFileAlt className="input-icon" />
                  <input
                    type="text"
                    id="bm379"
                    name="bm379"
                    value={formData.bm379}
                    onChange={handleChange}
                    required
                    placeholder="Numéro BM379"
                    className={`form-control ${!validation.bm379.valid ? 'is-invalid' : ''}`}
                  />
                </div>
                {!validation.bm379.valid && (
                  <div className="validation-error">{validation.bm379.message}</div>
                )}
              </div>
            </div>
          </div>
          
          <div className="form-section">
            <div className="form-section-header">
              <FaMapMarkerAlt /> Localisation
            </div>
            <div className="form-section-content">
              <div className="form-group">
                <label htmlFor="gareDepot">Gare/Dépôt <span className="required">*</span></label>
                <div className="input-with-icon">
                  <FaMapMarkerAlt className="input-icon" />
                  <input
                    type="text"
                    id="gareDepot"
                    name="gareDepot"
                    value={formData.gareDepot}
                    onChange={handleChange}
                    required
                    placeholder="Entrez le nom de la gare ou du dépôt"
                    className={`form-control ${!validation.gareDepot.valid ? 'is-invalid' : ''}`}
                  />
                </div>
                {!validation.gareDepot.valid && (
                  <div className="validation-error">{validation.gareDepot.message}</div>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="train">Train <span className="required">*</span></label>
                <div className="input-with-icon">
                  <FaTrain className="input-icon" />
                  <input
                    type="text"
                    id="train"
                    name="train"
                    value={formData.train}
                    onChange={handleChange}
                    required
                    placeholder="Numéro du train (ex: TGV 301)"
                    className={`form-control ${!validation.train.valid ? 'is-invalid' : ''}`}
                  />
                </div>
                {!validation.train.valid && (
                  <div className="validation-error">{validation.train.message}</div>
                )}
              </div>
            </div>
          </div>
          
          <div className="form-section">
            <div className="form-section-header">
              <FaBox /> Description
            </div>
            <div className="form-section-content">
              <div className="form-group full-width">
                <label htmlFor="contenu">Contenu <span className="required">*</span></label>
                <textarea
                  id="contenu"
                  name="contenu"
                  value={formData.contenu}
                  onChange={handleChange}
                  required
                  placeholder="Description du contenu de l'épave"
                  rows={4}
                  className={`form-control ${!validation.contenu.valid ? 'is-invalid' : ''}`}
                />
                {!validation.contenu.valid && (
                  <div className="validation-error">{validation.contenu.message}</div>
                )}
                <div className="form-hint">Décrivez précisément le contenu de l'épave, son état et toute information pertinente</div>
              </div>
            </div>
          </div>
          
          <div className="form-section">
            <div className="form-section-header">
              <FaInfo /> Responsable
            </div>
            <div className="form-section-content">
              <div className="form-group full-width">
                <label htmlFor="controllerId">Contrôleur <span className="required">*</span></label>
                <ControleurSelect
                  id="controllerId"
                  name="controllerId"
                  value={formData.controllerId}
                  onChange={handleChange}
                  required={true}
                  className={!validation.controllerId.valid ? 'is-invalid' : ''}
                />
                {!validation.controllerId.valid && (
                  <div className="validation-error">{validation.controllerId.message}</div>
                )}
              </div>
            </div>
          </div>
          
          <div className="form-actions">
            <Link to="/epaves" className="btn btn-outline-secondary">
              <FaArrowLeft /> Annuler
            </Link>
            <button type="submit" className="btn btn-primary" disabled={submitLoading}>
              <FaSave />
              {submitLoading ? 'Enregistrement...' : id ? 'Mettre à jour' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EpaveForm;