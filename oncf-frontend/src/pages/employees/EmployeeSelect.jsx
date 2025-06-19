import { useState, useEffect } from 'react';
import { employeeService } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import './EmployeeSelect.css';

function EmployeeSelect({ 
  value, 
  onChange, 
  id = 'agentComId', 
  name = 'agentComId', 
  required = false,
  role = null,  
  label = "Utilisateur" 
}) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  
  const { user } = useAuth();
  const antenneId = user?.antenneId || null;
  
  // Fetch initial list of employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        let response;
        
        // If antenneId is available, get employees by antenne
        if (antenneId) {
          response = await employeeService.getByAntenne(antenneId);
        } else {
          response = await employeeService.getAll();
        }
        
        // Filter by role if provided
        let employeesList = response.data;
        if (role) {
          employeesList = employeesList.filter(emp => emp.role === role);
        }
        
        setEmployees(employeesList);
        
        // If a value is already selected, find the employee and set it
        if (value) {
          const selected = employeesList.find(e => e.id === value);
          if (selected) {
            setSelectedEmployee(selected);
            setSearchTerm(`${selected.nom} ${selected.prenom}`);
          }
        }
      } catch (err) {
        console.error('Error fetching employees:', err);
        setError('Erreur lors du chargement des employés.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchEmployees();
  }, [antenneId, value, role]);
  
  // Search employees when searchTerm changes
  useEffect(() => {
    if (!searchTerm) return;
    
    const searchEmployees = async () => {
      try {
        const response = await employeeService.search(searchTerm, antenneId, role);
        setEmployees(response.data);
      } catch (err) {
        console.error('Error searching employees:', err);
      }
    };
    
    const timeoutId = setTimeout(() => {
      searchEmployees();
    }, 300); // Debounce search
    
    return () => clearTimeout(timeoutId);
  }, [searchTerm, antenneId, role]);
  
  const handleInputChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setShowDropdown(true);
    
    // If input is cleared, also clear the selection
    if (!term) {
      setSelectedEmployee(null);
      onChange({ target: { name, value: '' }});
    }
  };
  
  const handleSelectEmployee = (employee) => {
    setSelectedEmployee(employee);
    setSearchTerm(`${employee.nom} ${employee.prenom}`);
    setShowDropdown(false);
    onChange({ target: { name, value: employee.id }});
  };
  
  const handleInputFocus = () => {
    setShowDropdown(true);
  };
  
  const handleInputBlur = () => {
    // Delay hiding dropdown to allow for clicks
    setTimeout(() => setShowDropdown(false), 200);
  };
  
  if (loading) return <div>Chargement des utilisateurs...</div>;
  if (error) return <div className="error-message">{error}</div>;
  
  // Function to get role display text
  const getRoleDisplay = (role) => {
    switch (role) {
      case 'AGENT_COM': return 'Agent Commercial';
      case 'CHEF_SECT': return 'Chef de Section';
      case 'CHEF_ANTE': return 'Chef d\'Antenne';
      default: return role;
    }
  };
  
  return (
    <div className="employee-select">
      <label htmlFor={id}>{label}</label>
      <div className="select-container">
        <input
          type="text"
          id={id}
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={`Rechercher un ${label.toLowerCase()}...`}
          className="employee-search-input"
          required={required}
        />
        
        {/* Hidden input to store the actual value */}
        <input 
          type="hidden" 
          name={name} 
          value={selectedEmployee?.id || ''}
        />
        
        {showDropdown && employees.length > 0 && (
          <div className="employee-dropdown">
            {employees.map(employee => (
              <div 
                key={employee.id} 
                className="employee-item"
                onClick={() => handleSelectEmployee(employee)}
              >
                <div className="employee-name">
                  {employee.nom} {employee.prenom}
                </div>
                <div className="employee-details">
                  <span className="employee-role">{getRoleDisplay(employee.role)}</span>
                  <span className="employee-antenne">{employee.antenneName}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {showDropdown && searchTerm && employees.length === 0 && (
          <div className="employee-no-results">
            Aucun Utilisateur trouvé
          </div>
        )}
      </div>
    </div>
  );
}

export default EmployeeSelect;