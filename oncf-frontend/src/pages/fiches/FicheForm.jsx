// src/pages/fiches/FicheForm.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ficheInfractionService } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import ControleurSelect from '../../components/ControleurSelect';
import '../../components/ControleurSelect.css';
import '../../styles/FormStyles.css';
import { FaArrowLeft, FaSave, FaCalendarAlt, FaTrain, FaMapMarkerAlt, FaFileAlt, FaMoneyBillWave, FaInfo } from 'react-icons/fa';

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
    agentComId: user?.id || ''
  });
  
  const [validation, setValidation] = useState({
    gareD: { valid: true, message: '' },
    gareA: { valid: true, message: '' },
    gareDepot: { valid: true, message: '' },
    train: { valid: true, message: '' },
    numVoy: { valid: true, message: '' },
    montant: { valid: true, message: '' },
    motif: { valid: true, message: '' },
    controllerId: { valid: true, message: '' }
  });
  
  const [submitLoading, setSubmitLoading] = useState(false);
  
  // Calculate elapsed days
  const elapsedDays = formData.date ? 
    Math.ceil((new Date() - new Date(formData.date)) / (1000 * 60 * 60 * 24)) : null;
  
  // Tax percentage calculation
  const getTaxPercentage = (montant) => {
    const amount = parseFloat(montant);
    if (isNaN(amount)) return null;
    
    if (amount <= 100) return 5;
    if (amount <= 500) return 10;
    if (amount <= 1000) return 15;
    return 20;
  };
  
  const taxPercentage = getTaxPercentage(formData.montant);
  const taxAmount = taxPercentage !== null && !isNaN(parseFloat(formData.montant)) 
    ? (parseFloat(formData.montant) * taxPercentage / 100).toFixed(2) 
    : null;
  
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
    
    // Validate gareD
    if (!formData.gareD || formData.gareD.trim() === '') {
      newValidation.gareD = { valid: false, message: 'La gare de départ est requise' };
      isValid = false;
    }
    
    // Validate gareA
    if (!formData.gareA || formData.gareA.trim() === '') {
      newValidation.gareA = { valid: false, message: 'La gare d\'arrivée est requise' };
      isValid = false;
    }
    
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
    
    // Validate numVoy
    if (!formData.numVoy && formData.numVoy !== 0) {
      newValidation.numVoy = { valid: false, message: 'Le numéro du voyageur est requis' };
      isValid = false;
    }
    
    // Validate montant
    if (!formData.montant && formData.montant !== 0) {
      newValidation.montant = { valid: false, message: 'Le montant est requis' };
      isValid = false;
    } else if (parseFloat(formData.montant) < 0) {
      newValidation.montant = { valid: false, message: 'Le montant ne peut pas être négatif' };
      isValid = false;
    }
    
    // Validate motif
    if (!formData.motif || formData.motif.trim() === '') {
      newValidation.motif = { valid: false, message: 'Le motif est requis' };
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
    <div className="form-container">
      <div className="form-header">
        <h1>{id ? 'Modifier' : 'Ajouter'} une fiche d'infraction</h1>
        <Link to="/fiches-infraction" className="back-button">
          <FaArrowLeft /> Retour à la liste
        </Link>
      </div>
      
      <div className="form-content">
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <div className="form-section-header">
              <FaCalendarAlt /> Informations générales
            </div>
            <div className="form-section-content">
              <div className="form-group">
                <label htmlFor="date">Date <span className="required">*</span></label>
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
              
              <div className="form-group">
                <label>Jours écoulés</label>
                <div className="form-control" style={{ backgroundColor: '#f8f9fa' }}>
                  {elapsedDays !== null ? (
                    <span>{elapsedDays === 0 ? 'Aujourd\'hui' : `${elapsedDays} jour${elapsedDays > 1 ? 's' : ''}`}</span>
                  ) : (
                    'Calculé automatiquement'
                  )}
                </div>
                <div className="form-hint">Ce champ est calculé automatiquement à partir de la date d'infraction</div>
              </div>
              
              <div className="form-group">
                <label htmlFor="numVoy">Numéro voyageur <span className="required">*</span></label>
                <input
                  type="number"
                  id="numVoy"
                  name="numVoy"
                  value={formData.numVoy}
                  onChange={handleChange}
                  required
                  placeholder="Numéro du voyageur"
                  className={`form-control ${!validation.numVoy.valid ? 'is-invalid' : ''}`}
                />
                {!validation.numVoy.valid && (
                  <div className="validation-error">{validation.numVoy.message}</div>
                )}
              </div>
            </div>
          </div>
          
          <div className="form-section">
            <div className="form-section-header">
              <FaMapMarkerAlt /> Trajet
            </div>
            <div className="form-section-content">
              <div className="form-group">
                <label htmlFor="gareD">Gare de départ <span className="required">*</span></label>
                <input
                  type="text"
                  id="gareD"
                  name="gareD"
                  value={formData.gareD}
                  onChange={handleChange}
                  required
                  placeholder="Gare de départ"
                  className={`form-control ${!validation.gareD.valid ? 'is-invalid' : ''}`}
                />
                {!validation.gareD.valid && (
                  <div className="validation-error">{validation.gareD.message}</div>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="gareA">Gare d'arrivée <span className="required">*</span></label>
                <input
                  type="text"
                  id="gareA"
                  name="gareA"
                  value={formData.gareA}
                  onChange={handleChange}
                  required
                  placeholder="Gare d'arrivée"
                  className={`form-control ${!validation.gareA.valid ? 'is-invalid' : ''}`}
                />
                {!validation.gareA.valid && (
                  <div className="validation-error">{validation.gareA.message}</div>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="gareDepot">Gare/Dépôt <span className="required">*</span></label>
                <input
                  type="text"
                  id="gareDepot"
                  name="gareDepot"
                  value={formData.gareDepot}
                  onChange={handleChange}
                  required
                  placeholder="Gare/Dépôt"
                  className={`form-control ${!validation.gareDepot.valid ? 'is-invalid' : ''}`}
                />
                {!validation.gareDepot.valid && (
                  <div className="validation-error">{validation.gareDepot.message}</div>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="train">Train <span className="required">*</span></label>
                <input
                  type="text"
                  id="train"
                  name="train"
                  value={formData.train}
                  onChange={handleChange}
                  required
                  placeholder="Numéro du train"
                  className={`form-control ${!validation.train.valid ? 'is-invalid' : ''}`}
                />
                {!validation.train.valid && (
                  <div className="validation-error">{validation.train.message}</div>
                )}
              </div>
            </div>
          </div>
          
          <div className="form-section">
            <div className="form-section-header">
              <FaMoneyBillWave /> Pénalité
            </div>
            <div className="form-section-content">
              <div className="form-group">
                <label htmlFor="montant">Montant (Dh) <span className="required">*</span></label>
                <input
                  type="number"
                  step="0.01"
                  id="montant"
                  name="montant"
                  value={formData.montant}
                  onChange={handleChange}
                  required
                  placeholder="Montant de l'infraction"
                  className={`form-control ${!validation.montant.valid ? 'is-invalid' : ''}`}
                />
                {!validation.montant.valid && (
                  <div className="validation-error">{validation.montant.message}</div>
                )}
              </div>
              
              <div className="form-group">
                <label>Taxe applicable</label>
                <div className="form-control" style={{ backgroundColor: '#f8f9fa' }}>
                  {taxPercentage !== null ? (
                    <span>{taxPercentage}% (soit {taxAmount} Dh)</span>
                  ) : (
                    'Calculé automatiquement'
                  )}
                </div>
                <div className="form-hint">Ce champ est calculé automatiquement en fonction du montant</div>
              </div>
              
              <div className="form-group">
                <label htmlFor="motif">Motif <span className="required">*</span></label>
                <input
                  type="text"
                  id="motif"
                  name="motif"
                  value={formData.motif}
                  onChange={handleChange}
                  required
                  placeholder="Motif de l'infraction"
                  className={`form-control ${!validation.motif.valid ? 'is-invalid' : ''}`}
                />
                {!validation.motif.valid && (
                  <div className="validation-error">{validation.motif.message}</div>
                )}
              </div>
            </div>
          </div>
          
          <div className="form-section">
            <div className="form-section-header">
              <FaInfo /> Informations complémentaires
            </div>
            <div className="form-section-content">
              <div className="form-group full-width">
                <label htmlFor="observation">Observation</label>
                <textarea
                  id="observation"
                  name="observation"
                  value={formData.observation}
                  onChange={handleChange}
                  placeholder="Observations complémentaires"
                  rows={3}
                  className="form-control"
                />
              </div>
              
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
            <Link to="/fiches-infraction" className="btn btn-outline-secondary">
              Annuler
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

export default FicheForm;