package com.example.oncf_app.services;


import com.example.oncf_app.dtos.EmployeeDTO;
import com.example.oncf_app.entities.Antenne;
import com.example.oncf_app.entities.Employee;
import com.example.oncf_app.enums.Role;
import com.example.oncf_app.repositories.EmployeeRepository;
import com.example.oncf_app.repositories.AntenneRepository;
import com.example.oncf_app.mappers.EmployeeMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final AntenneRepository antenneRepository;
    private final EmployeeMapper employeeMapper;


    @Override
    public List<EmployeeDTO> getAllEmployees() {
        return employeeRepository.findAll().stream()
                .map(employeeMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public EmployeeDTO getEmployeeById(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));
        return employeeMapper.toDto(employee);
    }

    @Override
    public EmployeeDTO saveEmployee(EmployeeDTO employeeDTO) {
        Employee employee = employeeMapper.toEntity(employeeDTO);

        // Set relationships based on IDs
        setRelationships(employee, employeeDTO);

        Employee savedEmployee = employeeRepository.save(employee);
        return employeeMapper.toDto(savedEmployee);
    }

    @Override
    public EmployeeDTO updateEmployee(Long id, EmployeeDTO employeeDTO) {
        Employee existingEmployee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));

        employeeMapper.updateEntityFromDto(employeeDTO, existingEmployee);

        // Set relationships based on IDs
        setRelationships(existingEmployee, employeeDTO);

        Employee updatedEmployee = employeeRepository.save(existingEmployee);
        return employeeMapper.toDto(updatedEmployee);
    }

    @Override
    public void deleteEmployee(Long id) {
        if (!employeeRepository.existsById(id)) {
            throw new RuntimeException("Employee not found with id: " + id);
        }
        employeeRepository.deleteById(id);
    }

    @Override
    public List<EmployeeDTO> getEmployeesByRole(Role role) {
        return employeeRepository.findByRole(role).stream()
                .map(employeeMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<EmployeeDTO> getEmployeesByAntenne(Long antenneId) {
        return employeeRepository.findByAntenneId(antenneId).stream()
                .map(employeeMapper::toDto)
                .collect(Collectors.toList());
    }

    private void setRelationships(Employee employee, EmployeeDTO employeeDTO) {
        if (employeeDTO.getAntenneId() != null) {
            Antenne antenne = antenneRepository.findById(employeeDTO.getAntenneId())
                    .orElseThrow(() -> new RuntimeException("Antenne not found with id: " + employeeDTO.getAntenneId()));
            employee.setAntenne(antenne);
        }
    }
}