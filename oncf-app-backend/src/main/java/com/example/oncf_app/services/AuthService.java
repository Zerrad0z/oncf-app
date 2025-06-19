package com.example.oncf_app.services;

import com.example.oncf_app.entities.Employee;
import com.example.oncf_app.dtos.AuthResponseDTO;
import com.example.oncf_app.dtos.LoginRequestDTO;
import com.example.oncf_app.dtos.RegisterRequestDTO;
import com.example.oncf_app.enums.Role;
import com.example.oncf_app.exceptions.ApiException;
import com.example.oncf_app.repositories.AntenneRepository;
import com.example.oncf_app.repositories.EmployeeRepository;
import com.example.oncf_app.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class AuthService {


    private final UserRepository userRepository;
    private final AntenneRepository antenneRepository;
    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponseDTO register(RegisterRequestDTO request) {
        // Check if username already exists
        if (employeeRepository.existsByUsername(request.getUsername())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Username already exists");
        }

        // Create new employee
        var employee = Employee.builder()
                .id(request.getEmployeeId()) // If ID is set manually, otherwise generate
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .nom(request.getNom())
                .prenom(request.getPrenom())
                .role(Role.valueOf(request.getRole()))
                .antenne(request.getAntenneId() != null ?
                        antenneRepository.findById(request.getAntenneId())
                                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Antenne not found")) : null)
                .build();

        employeeRepository.save(employee);

        // Generate JWT token
        var jwtToken = jwtService.generateToken(employee);

        return AuthResponseDTO.builder()
                .token(jwtToken)
                .id(employee.getId())
                .username(employee.getUsername())
                .nom(employee.getNom())  // Return nom instead of fullName
                .prenom(employee.getPrenom())  // Include prenom
                .role(employee.getRole())
                .build();
    }

    public AuthResponseDTO login(LoginRequestDTO request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        var employee = employeeRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Invalid username or password"));

        var jwtToken = jwtService.generateToken(employee);

        return AuthResponseDTO.builder()
                .token(jwtToken)
                .id(employee.getId())
                .username(employee.getUsername())
                .nom(employee.getNom())
                .prenom(employee.getPrenom())  // Include prenom
                .role(employee.getRole())
                .build();
    }

}