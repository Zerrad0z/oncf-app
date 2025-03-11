package com.example.oncf_app.repositories;

import com.example.oncf_app.entities.Employee;
import com.example.oncf_app.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, String> {
    Optional<Employee> findByUsername(String username);
    List<Employee> findByRole(Role role);
    List<Employee> findByAntenneId(Long antenneId);

    boolean existsByUsername(String username);
}
