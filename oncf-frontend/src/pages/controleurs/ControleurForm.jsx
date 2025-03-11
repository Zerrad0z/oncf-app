import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { controleurService, antenneService } from '../../services/api';
import SuccessModal from '../../components/SuccessModal';
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
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // State for success modal
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch antennes on component mount
  const fetchAntennes = async () => {
    try {
      const response = await antenneService.getAll();
      console.log('Antennes response:', response);
  
      // Handle stringified JSON response
      const rawData = response.data;
      const parsedData = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;
  
      // Handle different response structures
      let antennesData = parsedData;
      if (parsedData.content) { // Handle paginated response
        antennesData = parsedData.content;
      }
  
      // Transform data
      const cleanedAntennes = Array.isArray(antennesData) 
        ? antennesData.map(antenne => ({
            id: antenne.id,
            nom: antenne.nom
          }))
        : [];
  
      setAntennes(cleanedAntennes);
      setError(null);
    } catch (err) {
      console.error('Error fetching antennes:', err);
      setError('Erreur lors du chargement des antennes.');
      setAntennes([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch controleur data if editing
  useEffect(() => {
    const fetchAntennes = async () => {
      try {
        const response = await antenneService.getAll();
        console.log('Raw API Response:', response.data); // Debugging
  
        if (Array.isArray(response.data)) {
          // Now we can just set the entire array since `Employee` includes `antenne` as a nested object.
          const cleanedAntennes = response.data.map(antenne => ({
            id: antenne.id,
            nom: antenne.nom
          }));
          setAntennes(cleanedAntennes);
        } else {
          console.warn('Unexpected API response format:', response.data);
          setAntennes([]);
        }
  
        setError(null);
      } catch (err) {
        console.error('Error fetching antennes:', err);
        setError('Erreur lors du chargement des antennes.');
        setAntennes([]);
      } finally {
        setLoading(false);
      }
    };
  
    fetchAntennes();
  }, []);
  
  

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
      if (!formData.id || !formData.nom || !formData.prenom || !formData.antenneId) {
        throw new Error('Veuillez remplir tous les champs obligatoires.');
      }

      const dataToSubmit = {
        ...formData,
        id: formData.id, // Keep as string for Controleur
        antenneId: parseInt(formData.antenneId, 10) // Ensure it's a number
      };

      console.log('Submitting controleur data:', dataToSubmit);

      if (isEditMode) {
        await controleurService.update(id, dataToSubmit);
        setSuccessMessage(`Le contrôleur ${formData.prenom} ${formData.nom} a été mis à jour avec succès!`);
      } else {
        await controleurService.create(dataToSubmit);
        setSuccessMessage(`Le contrôleur ${formData.prenom} ${formData.nom} a été créé avec succès!`);
      }

      setShowSuccessModal(true);

    } catch (err) {
      console.error('Error saving controleur:', err);
      setError(err.message || 'Erreur lors de l\'enregistrement. Veuillez réessayer.');
      setSubmitting(false);
    }
  };

  // Handle modal close and redirect
  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    navigate('/controleurs');
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

        <button type="submit" className="submit-button" disabled={submitting}>
          <FaSave /> {submitting ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </form>

      <SuccessModal
        show={showSuccessModal}
        message={successMessage}
        onClose={handleSuccessModalClose}
      />
    </div>
  );
}

export default ControleurForm;
