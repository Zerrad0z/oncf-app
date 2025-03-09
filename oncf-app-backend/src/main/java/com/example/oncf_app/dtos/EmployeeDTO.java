package com.example.oncf_app.dtos;

import com.example.oncf_app.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeDTO {
    private Long id;
    private String nom;
    private String prenom;
    private Role role;
    private Long antenneId;
    private String antenneName; // For display purposes
}