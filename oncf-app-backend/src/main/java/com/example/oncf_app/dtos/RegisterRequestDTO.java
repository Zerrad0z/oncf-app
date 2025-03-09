package com.example.oncf_app.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequestDTO {
    private String username;
    private String password;
    private String nom;  // Changed from fullName to nom
    private String prenom;  // Added prenom
    private String role;
    private Long employeeId;
    private Long antenneId; // If assigning an antenne
}
