package com.example.oncf_app.config;

import com.example.oncf_app.entities.Antenne;
import com.example.oncf_app.entities.Employee;
import com.example.oncf_app.enums.Role;
import com.example.oncf_app.repositories.AntenneRepository;
import com.example.oncf_app.repositories.ControleurRepository;
import com.example.oncf_app.repositories.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private AntenneRepository antenneRepository;

    @Autowired
    private ControleurRepository controleurRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {

        // Initialize antennes
        if (antenneRepository.count() == 0) {
            Antenne rabatAntenne = new Antenne();
            rabatAntenne.setNom("Antenne proximité KENITRA");
            antenneRepository.save(rabatAntenne);

            Antenne casaAntenne = new Antenne();
            casaAntenne.setNom("Antenne proximité CASA PORT");
            antenneRepository.save(casaAntenne);




            System.out.println("Initial antennes created successfully");
        }

        // Get the antennes for reference
        Antenne rabatAntenne = antenneRepository.findByNom("Antenne proximité KENITRA");
        Antenne casaAntenne = antenneRepository.findByNom("Antenne proximité CASA PORT");
        // Check if we need to initialize data
        if (employeeRepository.count() == 0) {
            // Create admin employee
            Employee adminEmployee = new Employee();
            adminEmployee.setId("1");
            adminEmployee.setUsername("admin");
            adminEmployee.setPassword(passwordEncoder.encode("admin"));
            adminEmployee.setNom("System");
            adminEmployee.setPrenom("Administrator");
            adminEmployee.setRole(Role.CHEF_ANTE);
            adminEmployee.setAntenne(rabatAntenne);
            employeeRepository.save(adminEmployee);

//            // Create agent employee
//            Employee agentEmployee = new Employee();
//            agentEmployee.setId("2");
//            agentEmployee.setUsername("agent");
//            agentEmployee.setPassword(passwordEncoder.encode("agent"));
//            agentEmployee.setNom("Agent");
//            agentEmployee.setPrenom("Commercial");
//            agentEmployee.setRole(Role.AGENT_COM);
//            agentEmployee.setAntenne(rabatAntenne);
//            employeeRepository.save(agentEmployee);
//
//            // Create chef section employee
//            Employee chefSectEmployee = new Employee();
//            chefSectEmployee.setId("3");
//            chefSectEmployee.setUsername("chef");
//            chefSectEmployee.setPassword(passwordEncoder.encode("chef"));
//            chefSectEmployee.setNom("Chef");
//            chefSectEmployee.setPrenom("de Section");
//            chefSectEmployee.setRole(Role.CHEF_SECT);
//            chefSectEmployee.setAntenne(rabatAntenne);
//            employeeRepository.save(chefSectEmployee);
//
//            System.out.println("Initial employees created successfully");
        }

//        // Initialize Controleurs (Employees)
//        if (controleurRepository.count() == 0) {
//            Controleur controleur1 = new Controleur("12345", "Benjelloun", "Karim", rabatAntenne, null, null, null);
//            Controleur controleur2 = new Controleur("23456", "Ouazzani", "Samira", rabatAntenne, null, null, null);
//            Controleur controleur3 = new Controleur("34567", "Tahiri", "Ahmed", rabatAntenne, null, null, null);
//            Controleur controleur4 = new Controleur("45678", "Mansouri", "Fatima", casaAntenne, null, null, null);
//            Controleur controleur5 = new Controleur("56789", "Berrada", "Youssef", casaAntenne, null, null, null);
//            Controleur controleur6 = new Controleur("67890", "Ziani", "Nadia", casaAntenne, null, null, null);
//
//            controleurRepository.save(controleur1);
//            controleurRepository.save(controleur2);
//            controleurRepository.save(controleur3);
//            controleurRepository.save(controleur4);
//            controleurRepository.save(controleur5);
//            controleurRepository.save(controleur6);
//
//            System.out.println("Initial controleurs created successfully");
        }
    }
