package com.example.oncf_app.services;


import com.example.oncf_app.dtos.EmployeeDTO;
import com.example.oncf_app.enums.Role;

import java.util.List;

public interface EmployeeService {
    List<EmployeeDTO> getAllEmployees();
    EmployeeDTO getEmployeeById(Long id);
    EmployeeDTO saveEmployee(EmployeeDTO employeeDTO);
    EmployeeDTO updateEmployee(Long id, EmployeeDTO employeeDTO);
    void deleteEmployee(Long id);
    List<EmployeeDTO> getEmployeesByRole(Role role);
    List<EmployeeDTO> getEmployeesByAntenne(Long antenneId);
}