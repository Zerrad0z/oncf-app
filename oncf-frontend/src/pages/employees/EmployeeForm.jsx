// src/pages/employees/EmployeeForm.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { employeeService, antenneService } from '../../services/api';
import SuccessModal from '../../components/SuccessModal';
import './EmployeeForm.css';
import { FaArrowLeft, FaSave } from 'react-icons/fa';

function EmployeeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    id: '',  // This is employeeId/matricule
    username: '',
    password: '',
    nom: '',
    prenom: '',
    role: '',
    antenneId: ''
  });

  const [antennes, setAntennes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // State for success modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch antennes
        const antenneResponse = await antenneService.getAll();
        if (Array.isArray(antenneResponse.data)) {
          const cleanedAntennes = antenneResponse.data.map(antenne => ({
            id: antenne.id,
            nom: antenne.nom
          }));
          setAntennes(cleanedAntennes);
        } else {
          console.warn('Unexpected API response format:', antenneResponse.data);
          setAntennes([]);
        }
        
        // If editing, fetch employee data
        if (isEditMode) {
          const employeeResponse = await employeeService.getById(id);
          const employeeData = employeeResponse.data;
          
          // Map the employee data to our form
          setFormData({
            id: employeeData.id || '',
            username: employeeData.username || '',
            password: '',  // Don't populate password for security
            nom: employeeData.nom || '',
            prenom: employeeData.prenom || '',
            role: employeeData.role || '',
            antenneId: employeeData.antenneId || ''
          });
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Erreur lors du chargement des données.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, isEditMode]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'antenneId' ? (value ? Number(value) : '') : value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.nom || !formData.prenom || !formData.role || !formData.antenneId) {
        throw new Error('Veuillez remplir tous les champs obligatoires.');
      }
      
      if (!isEditMode && (!formData.username || !formData.password || !formData.id)) {
        throw new Error('Le nom d\'utilisateur, mot de passe et matricule sont requis pour un nouvel employé.');
      }

      // For new employee creation, use the register endpoint format
      if (!isEditMode) {
        const registerData = {
          username: formData.username,
          password: formData.password,
          nom: formData.nom,
          prenom: formData.prenom,
          role: formData.role,
          employeeId: formData.id, // This maps to the employeeId field in RegisterRequestDTO
          antenneId: Number(formData.antenneId)
        };

        console.log('Creating new employee:', registerData);
        await employeeService.create(registerData);
        setSuccessMessage(`L'employé ${formData.prenom} ${formData.nom} a été créé avec succès!`);
      } else {
        // For editing, use the employee update endpoint
        const updateData = {
          id: formData.id,
          nom: formData.nom,
          prenom: formData.prenom,
          username: formData.username,
          role: formData.role,
          antenneId: Number(formData.antenneId)
        };

        // Only add password if it was provided
        if (formData.password) {
          updateData.password = formData.password;
        }

        console.log('Updating employee:', updateData);
        await employeeService.update(id, updateData);
        setSuccessMessage(`L'employé ${formData.prenom} ${formData.nom} a été mis à jour avec succès!`);
      }

      // Show success modal and reset submitting state
      setIsModalOpen(true);
      setSubmitting(false);

    } catch (err) {
      console.error('Error saving employee:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Erreur lors de l\'enregistrement.';
      setError(errorMessage);
      setSubmitting(false);
    }
  };

  // Handle modal close and redirect
  const handleModalClose = () => {
    setIsModalOpen(false);
    navigate('/employees');
  };

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div className="employee-form-page">
      <div className="page-header">
        <Link to="/employees" className="back-link">
          <FaArrowLeft /> Retour à la liste
        </Link>
        <h1>{isEditMode ? 'Modifier' : 'Ajouter'} un employé</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="employee-form">
        <div className="form-section">
          <h2>Informations personnelles</h2>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="id">Matricule*</label>
              <input
                type="text"
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
          <h2>Information de compte</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="username">Nom d'utilisateur*</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required={!isEditMode}
                placeholder="Nom d'utilisateur"
                disabled={isEditMode}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">
                {isEditMode ? 'Mot de passe (laisser vide pour conserver)' : 'Mot de passe*'}
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required={!isEditMode}
                placeholder={isEditMode ? 'Nouveau mot de passe (optionnel)' : 'Mot de passe'}
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="role">Rôle*</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="">Sélectionner un rôle</option>
                <option value="AGENT_COM">Agent Commercial</option>
                <option value="CHEF_SECT">Chef de Section</option>
                <option value="CHEF_ANTE">Chef d'Antenne</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="antenneId">Antenne*</label>
              <select
                id="antenneId"
                name="antenneId"
                value={formData.antenneId || ''}
                onChange={handleChange}
                required
              >
                <option value="">Sélectionner une antenne</option>
                {antennes.length > 0 ? (
                  antennes.map(antenne => (
                    <option key={antenne.id} value={antenne.id}>
                      {antenne.nom}
                    </option>
                  ))
                ) : (
                  <option disabled>Aucune antenne disponible</option>
                )}
              </select>
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          className="submit-button" 
          disabled={submitting}
        >
          <FaSave /> {submitting ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </form>

      {/* Updated SuccessModal implementation */}
      <SuccessModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        message={successMessage}
        title={isEditMode ? "Modification réussie" : "Création réussie"}
        autoCloseTime={3000}
      />
    </div>
  );
}

export default EmployeeForm;