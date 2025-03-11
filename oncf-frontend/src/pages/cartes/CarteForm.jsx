// src/pages/cartes/CarteForm.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { cartePerimeeService } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import ControleurSelect from '../controleurs/ControleurSelect';
import SuccessModal from '../../components/SuccessModal';
import '../controleurs/ControleurSelect.css';
import '../../styles/FormStyles.css';
import { FaArrowLeft, FaSave, FaCalendarAlt, FaTrain, FaMapMarkerAlt, FaCreditCard, FaInfo } from 'react-icons/fa';

function CarteForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(id ? true : false);
  const [error, setError] = useState(null);
  
  // State for success modal
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
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
    agentComId: user?.id || ''
  });
  
  const [validation, setValidation] = useState({
    numCarte: { valid: true, message: '' },
    gareD: { valid: true, message: '' },
    gareA: { valid: true, message: '' },
    train: { valid: true, message: '' },
    dateDv: { valid: true, message: '' },
    dateFv: { valid: true, message: '' },
    controllerId: { valid: true, message: '' }
  });
  
  const [expirationDays, setExpirationDays] = useState(null);
  const [expirationStatus, setExpirationStatus] = useState(null);
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
  
  // Calculate expiration days whenever dateFv changes
  useEffect(() => {
    if (formData.dateFv) {
      const today = new Date();
      const expiryDate = new Date(formData.dateFv);
      
      // Reset time part to compare only dates
      today.setHours(0, 0, 0, 0);
      expiryDate.setHours(0, 0, 0, 0);
      
      // Calculate difference in days
      const diffTime = expiryDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      setExpirationDays(diffDays);
      
      // Set expiration status
      if (diffDays < 0) {
        setExpirationStatus('expired');
      } else if (diffDays <= 30) {
        setExpirationStatus('expiring-soon');
      } else {
        setExpirationStatus('valid');
      }
    } else {
      setExpirationDays(null);
      setExpirationStatus(null);
    }
  }, [formData.dateFv]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'confort' ? parseInt(value) : value
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
    
    // Validate numCarte
    if (!formData.numCarte || formData.numCarte.trim() === '') {
      newValidation.numCarte = { valid: false, message: 'Le numéro de carte est requis' };
      isValid = false;
    } else if (formData.numCarte.length < 5) {
      newValidation.numCarte = { valid: false, message: 'Le numéro de carte doit comporter au moins 5 caractères' };
      isValid = false;
    }
    
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
    
    // Validate train
    if (!formData.train || formData.train.trim() === '') {
      newValidation.train = { valid: false, message: 'Le numéro de train est requis' };
      isValid = false;
    }
    
    // Validate dateDv
    if (!formData.dateDv) {
      newValidation.dateDv = { valid: false, message: 'La date de validité est requise' };
      isValid = false;
    }
    
    // Validate dateFv
    if (!formData.dateFv) {
      newValidation.dateFv = { valid: false, message: 'La date de fin de validité est requise' };
      isValid = false;
    } else if (formData.dateDv && formData.dateFv && new Date(formData.dateFv) < new Date(formData.dateDv)) {
      newValidation.dateFv = { valid: false, message: 'La date de fin de validité doit être postérieure à la date de validité' };
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
        await cartePerimeeService.update(id, submissionData);
        setSuccessMessage('La carte périmée a été mise à jour avec succès!');
      } else {
        await cartePerimeeService.create(submissionData);
        setSuccessMessage('La carte périmée a été ajoutée avec succès!');
      }
      
      // Show success modal instead of redirecting immediately
      setShowSuccessModal(true);
      
    } catch (err) {
      console.error('Error saving carte périmée:', err);
      setError('Erreur lors de l\'enregistrement. Veuillez réessayer.');
      setSubmitLoading(false);
    }
  };
  
  // Handle modal close and redirect
  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    navigate('/cartes-perimee');
  };
  
  if (loading) {
    return <div className="loading">Chargement...</div>;
  }
  
  return (
    <div className="form-container">
      <div className="form-header">
        <h1>{id ? 'Modifier' : 'Ajouter'} une carte périmée</h1>
        <Link to="/cartes-perimee" className="back-button">
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
                <label htmlFor="date">Date de constatation <span className="required">*</span></label>
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
                <label htmlFor="numCarte">Numéro de carte <span className="required">*</span></label>
                <input
                  type="text"
                  id="numCarte"
                  name="numCarte"
                  value={formData.numCarte}
                  onChange={handleChange}
                  required
                  placeholder="Numéro de la carte périmée"
                  className={`form-control ${!validation.numCarte.valid ? 'is-invalid' : ''}`}
                />
                {!validation.numCarte.valid && (
                  <div className="validation-error">{validation.numCarte.message}</div>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="confort">Niveau de confort <span className="required">*</span></label>
                <select
                  id="confort"
                  name="confort"
                  value={formData.confort}
                  onChange={handleChange}
                  required
                  className="form-control"
                >
                  <option value={1}>1ère classe</option>
                  <option value={2}>2ème classe</option>
                </select>
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
              <FaCreditCard /> Validité
            </div>
            <div className="form-section-content">
              <div className="form-group">
                <label htmlFor="dateDv">Date de validité <span className="required">*</span></label>
                <input
                  type="date"
                  id="dateDv"
                  name="dateDv"
                  value={formData.dateDv}
                  onChange={handleChange}
                  required
                  className={`form-control ${!validation.dateDv.valid ? 'is-invalid' : ''}`}
                />
                {!validation.dateDv.valid && (
                  <div className="validation-error">{validation.dateDv.message}</div>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="dateFv">Date de fin de validité <span className="required">*</span></label>
                <input
                  type="date"
                  id="dateFv"
                  name="dateFv"
                  value={formData.dateFv}
                  onChange={handleChange}
                  required
                  className={`form-control ${!validation.dateFv.valid ? 'is-invalid' : ''}`}
                />
                {!validation.dateFv.valid && (
                  <div className="validation-error">{validation.dateFv.message}</div>
                )}
              </div>
              
              <div className="form-group">
                <label>Jours d'expiration</label>
                <div className="form-control" style={{ backgroundColor: '#f8f9fa' }}>
                  {expirationDays !== null ? (
                    <div className={`expiration-status ${expirationStatus}`}>
                      {expirationDays < 0 
                        ? `Expirée depuis ${Math.abs(expirationDays)} jour${Math.abs(expirationDays) > 1 ? 's' : ''}` 
                        : expirationDays === 0 
                          ? 'Expire aujourd\'hui' 
                          : `Expire dans ${expirationDays} jour${expirationDays > 1 ? 's' : ''}`}
                    </div>
                  ) : (
                    'Calculé automatiquement'
                  )}
                </div>
                <div className="form-hint">Ce champ est calculé automatiquement à partir de la date de fin de validité</div>
              </div>
            </div>
          </div>
          
          <div className="form-section">
            <div className="form-section-header">
              <FaInfo /> Informations complémentaires
            </div>
            <div className="form-section-content">
              <div className="form-group full-width">
                <label htmlFor="suiteReservee">Suite réservée</label>
                <textarea
                  id="suiteReservee"
                  name="suiteReservee"
                  value={formData.suiteReservee}
                  onChange={handleChange}
                  placeholder="Suite réservée à cette carte périmée"
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
            <Link to="/cartes-perimee" className="btn btn-outline-secondary">
              <FaArrowLeft /> Annuler
            </Link>
            <button type="submit" className="btn btn-primary" disabled={submitLoading}>
              <FaSave />
              {submitLoading ? 'Enregistrement...' : id ? 'Mettre à jour' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
      
      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        message={successMessage}
        title={id ? "Modification réussie" : "Création réussie"}
        autoCloseTime={3000}
      />
    </div>
  );
}

export default CarteForm;