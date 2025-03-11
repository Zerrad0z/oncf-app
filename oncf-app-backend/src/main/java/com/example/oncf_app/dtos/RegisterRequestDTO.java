package com.example.oncf_app.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequestDTO {
    private String username;
    private String password;
    private String nom;
    private String prenom;
    private String role;
    private String employeeId;
    private Long antenneId;
}
