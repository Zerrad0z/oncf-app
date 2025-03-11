package com.example.oncf_app.services;

import com.example.oncf_app.dtos.EmployeeDTO;
import com.example.oncf_app.enums.Role;

import java.util.List;

public interface EmployeeService {
    List<EmployeeDTO> getAllEmployees();
    EmployeeDTO getEmployeeById(String id);
    EmployeeDTO saveEmployee(EmployeeDTO employeeDTO);
    EmployeeDTO updateEmployee(String id, EmployeeDTO employeeDTO);
    void deleteEmployee(String id);
    List<EmployeeDTO> getEmployeesByRole(Role role);
    List<EmployeeDTO> getEmployeesByAntenne(Long antenneId);
}