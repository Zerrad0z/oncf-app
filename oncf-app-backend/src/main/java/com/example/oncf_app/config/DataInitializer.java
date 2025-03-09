//package com.example.oncf_app.config;
//
//import com.example.oncf_app.entities.Antenne;
//import com.example.oncf_app.entities.Controleur;
//import com.example.oncf_app.entities.Employee;
//import com.example.oncf_app.enums.Role;
//import com.example.oncf_app.repositories.AntenneRepository;
//import com.example.oncf_app.repositories.ControleurRepository;
//import com.example.oncf_app.repositories.EmployeeRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.stereotype.Component;
//
//@Component
//public class DataInitializer implements CommandLineRunner {
//
//    @Autowired
//    private EmployeeRepository employeeRepository;
//
//    @Autowired
//    private AntenneRepository antenneRepository;
//
//    @Autowired
//    private ControleurRepository controleurRepository;
//
//    @Autowired
//    private PasswordEncoder passwordEncoder;
//
//    @Override
//    public void run(String... args) throws Exception {
//
//        // Initialize antennes
//        if (antenneRepository.count() == 0) {
//            Antenne rabatAntenne = new Antenne();
//            rabatAntenne.setNom("Rabat Ville");
//            antenneRepository.save(rabatAntenne);
//
//            Antenne casaAntenne = new Antenne();
//            casaAntenne.setNom("Casablanca Voyageurs");
//            antenneRepository.save(casaAntenne);
//
//            System.out.println("Initial antennes created successfully");
//        }
//
//        // Get the antennes for reference
//        Antenne rabatAntenne = antenneRepository.findByNom("Rabat Ville");
//        Antenne casaAntenne = antenneRepository.findByNom("Casablanca Voyageurs");
//        // Check if we need to initialize data
//        if (employeeRepository.count() == 0) {
//            // Create admin employee
//            Employee adminEmployee = new Employee();
//            adminEmployee.setId(1L);
//            adminEmployee.setUsername("admin");
//            adminEmployee.setPassword(passwordEncoder.encode("admin"));
//            adminEmployee.setNom("System");
//            adminEmployee.setPrenom("Administrator");
//            adminEmployee.setRole(Role.CHEF_ANTE);
//            adminEmployee.setAntenne(rabatAntenne);
//            employeeRepository.save(adminEmployee);
//
//            // Create agent employee
//            Employee agentEmployee = new Employee();
//            agentEmployee.setId(2L);
//            agentEmployee.setUsername("agent");
//            agentEmployee.setPassword(passwordEncoder.encode("agent"));
//            agentEmployee.setNom("Agent");
//            agentEmployee.setPrenom("Commercial");
//            agentEmployee.setRole(Role.AGENT_COM);
//            agentEmployee.setAntenne(rabatAntenne);
//            employeeRepository.save(agentEmployee);
//
//// Create chef section employee
//            Employee chefSectEmployee = new Employee();
//            chefSectEmployee.setId(3L);
//            chefSectEmployee.setUsername("chef");
//            chefSectEmployee.setPassword(passwordEncoder.encode("chef"));
//            chefSectEmployee.setNom("Chef");
//            chefSectEmployee.setPrenom("de Section");
//            chefSectEmployee.setRole(Role.CHEF_SECT);
//            chefSectEmployee.setAntenne(rabatAntenne); // ERROR: Should be chefSectEmployee, not adminEmployee
//            employeeRepository.save(chefSectEmployee);
//
//            System.out.println("Initial employees created successfully");
//        }
//
//        // Initialize Controleurs (Employees)
//        if (controleurRepository.count() == 0) {
//            Controleur controleur1 = new Controleur(12345L, "Benjelloun", "Karim", rabatAntenne, null, null, null);
//            Controleur controleur2 = new Controleur(23456L, "Ouazzani", "Samira", rabatAntenne, null, null, null);
//            Controleur controleur3 = new Controleur(34567L, "Tahiri", "Ahmed", rabatAntenne, null, null, null);
//            Controleur controleur4 = new Controleur(45678L, "Mansouri", "Fatima", casaAntenne, null, null, null);
//            Controleur controleur5 = new Controleur(56789L, "Berrada", "Youssef", casaAntenne, null, null, null);
//            Controleur controleur6 = new Controleur(67890L, "Ziani", "Nadia", casaAntenne, null, null, null);
//
//            controleurRepository.save(controleur1);
//            controleurRepository.save(controleur2);
//            controleurRepository.save(controleur3);
//            controleurRepository.save(controleur4);
//            controleurRepository.save(controleur5);
//            controleurRepository.save(controleur6);
//
//            System.out.println("Initial controleurs created successfully");
//        }
//    }
//}