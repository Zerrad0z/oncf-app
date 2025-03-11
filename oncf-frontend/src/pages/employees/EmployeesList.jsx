// src/pages/employees/EmployeesList.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { employeeService, epaveService, cartePerimeeService, ficheInfractionService } from '../../services/api';
import DataTable from '../../components/DataTable';
import './EmployeesList.css';
import { FaChartBar, FaFileAlt, FaCreditCard, FaBoxOpen, FaUserShield } from 'react-icons/fa';

function EmployeesList() {
  const [employees, setEmployees] = useState([]);
  const [employeeStats, setEmployeeStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch employees
        const response = await employeeService.getAll();
        const employeesData = response.data;
        setEmployees(employeesData);
        
        // Fetch statistics for each employee
        const statsMap = {};
        
        // This would be better done with a single API call in a real application
        // but for now we'll simulate with separate calls
        for (const employee of employeesData) {
          try {
            const [epaves, cartes, fiches] = await Promise.all([
              epaveService.getByAgentCom(employee.id),
              cartePerimeeService.getByAgentCom(employee.id),
              ficheInfractionService.getByAgentCom(employee.id)
            ]);
            
            statsMap[employee.id] = {
              epavesCount: epaves.data.length,
              cartesCount: cartes.data.length,
              fichesCount: fiches.data.length,
              totalItems: epaves.data.length + cartes.data.length + fiches.data.length
            };
          } catch (statError) {
            console.error(`Error fetching stats for employee ${employee.id}:`, statError);
            statsMap[employee.id] = {
              epavesCount: 0,
              cartesCount: 0,
              fichesCount: 0,
              totalItems: 0
            };
          }
        }
        
        setEmployeeStats(statsMap);
        setError(null);
      } catch (err) {
        console.error('Error fetching employees:', err);
        setError('Erreur lors du chargement des employés.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Function to get role display text
  const getRoleDisplay = (role) => {
    switch (role) {
      case 'AGENT_COM': return 'Agent Commercial';
      case 'CHEF_SECT': return 'Chef de Section';
      case 'CHEF_ANTE': return 'Chef d\'Antenne';
      default: return role;
    }
  };
  
  // Define columns for the DataTable
  const columns = [
    {
      id: 'id',
      label: 'Matricule',
      sortable: true
    },
    {
      id: 'fullName',
      label: 'Nom Complet',
      sortable: true,
      render: (item) => `${item.nom} ${item.prenom}`
    },
    {
      id: 'role',
      label: 'Rôle',
      sortable: true,
      render: (item) => (
        <div className="employee-role">
          <FaUserShield className={`role-icon role-${item.role?.toLowerCase()}`} />
          <span>{getRoleDisplay(item.role)}</span>
        </div>
      )
    },
    {
      id: 'antenneName',
      label: 'Antenne',
      sortable: true
    },
    {
      id: 'stats',
      label: 'Statistiques',
      sortable: false,
      render: (item) => {
        const stats = employeeStats[item.id] || { epavesCount: 0, cartesCount: 0, fichesCount: 0, totalItems: 0 };
        return (
          <div className="employee-stats">
            <div className="stat-item" title="Épaves">
              <FaBoxOpen className="stat-icon epaves" />
              <span>{stats.epavesCount}</span>
            </div>
            <div className="stat-item" title="Cartes Périmées">
              <FaCreditCard className="stat-icon cartes" />
              <span>{stats.cartesCount}</span>
            </div>
            <div className="stat-item" title="Fiches d'infraction">
              <FaFileAlt className="stat-icon fiches" />
              <span>{stats.fichesCount}</span>
            </div>
            <div className="total-stats" title="Total d'items">
              <FaChartBar className="stat-icon total" />
              <span>{stats.totalItems}</span>
            </div>
          </div>
        );
      }
    }
  ];
  
  // Define filters for the DataTable
  const filters = [
    {
      id: 'role',
      label: 'Rôle',
      type: 'select',
      options: [
        { value: 'AGENT_COM', label: 'Agent Commercial' },
        { value: 'CHEF_SECT', label: 'Chef de Section' },
        { value: 'CHEF_ANTE', label: 'Chef d\'Antenne' }
      ],
      placeholderOption: 'Tous les rôles',
      filterFn: (item, value) => item.role === value
    },
    {
      id: 'antenne',
      label: 'Antenne',
      type: 'select',
      options: getUniqueOptions(employees, 'antenneName'),
      placeholderOption: 'Toutes les antennes',
      filterFn: (item, value) => item.antenneName === value
    },
  ];
  
  // Helper function to get unique options for filters
  function getUniqueOptions(data, field) {
    const unique = [...new Set(data.map(item => item[field]))];
    return unique
      .filter(Boolean)
      .sort()
      .map(value => ({ value, label: value }));
  }
  
  return (
    <div className="employees-list-page">
      <DataTable
        data={employees}
        columns={columns}
        filters={filters}
        loading={loading}
        error={error}
        title="Utilisateurs"
        addButtonText="Ajouter un Utilisateur"
        addButtonPath="/employees/new"
        noDataMessage="Aucun Utilisateur trouvé"
        actions={{
          edit: true,
          view: true,
          delete: false,
          basePath: '/employees',
          viewPath: (item) => `/employees/${item.id}/details`
        }}
      />
    </div>
  );
}

export default EmployeesList;