import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Layout from './layouts/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import LoadingSpinner from './components/LoadingSpinner';
import { AuthProvider } from './context/AuthProvider';
import ProtectedRoute from './components/ProtectedRoute';

// Import Epaves components
import EpavesList from "./pages/epaves/EpavesList";
import EpaveForm from "./pages/epaves/EpaveForm";

// Import Fiches d'infraction components
import FichesList from "./pages/fiches/FichesList";
import FicheForm from "./pages/fiches/FicheForm";

// Import Cartes périmées components
import CartesList from "./pages/cartes/CartesList";
import CarteForm from "./pages/cartes/CarteForm";

// Import Controleur
import ControleursList from "./pages/controleurs/ControleursList";
import ControleurDetails from "./pages/controleurs/ControleurDetails";
import ControleurForm from "./pages/controleurs/ControleurForm";

// Import Employee components
import EmployeesList from "./pages/employees/EmployeesList";
import EmployeeDetails from "./pages/employees/EmployeeDetails";
import EmployeeForm from "./pages/employees/EmployeeForm";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public route for login */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            
            {/* Epaves routes */}
            <Route path="epaves">
              <Route index element={<EpavesList />} />
              <Route path="new" element={<EpaveForm />} />
              <Route path=":id/edit" element={<EpaveForm />} />
            </Route>
            
            {/* Fiches d'infraction routes */}
            <Route path="fiches-infraction">
              <Route index element={<FichesList />} />
              <Route path="new" element={<FicheForm />} />
              <Route path=":id/edit" element={<FicheForm />} />
            </Route>
            
            {/* Cartes périmées routes */}
            <Route path="cartes-perimee">
              <Route index element={<CartesList />} />
              <Route path="new" element={<CarteForm />} />
              <Route path=":id/edit" element={<CarteForm />} />
            </Route>
            
            {/* Controleurs routes */}
            <Route path="controleurs">
              <Route index element={<ControleursList />} />
              <Route path=":id/details" element={<ControleurDetails />} />
              <Route path=":id/edit" element={<ControleurForm />} />
              <Route path="new" element={<ControleurForm />} />
            </Route>
            
            {/* Employees routes */}
            <Route path="employees">
              <Route index element={<EmployeesList />} />
              <Route path=":id/details" element={<EmployeeDetails />} />
              <Route path=":id/edit" element={<EmployeeForm />} />
              <Route path="new" element={<EmployeeForm />} />
            </Route>
            
            {/* Catch-all route for protected area */}
            <Route path="*" element={<NotFound />} />
          </Route>
          
          {/* Catch-all route for the entire app */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;