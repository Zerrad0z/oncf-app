package com.example.oncf_app.dtos;

import com.example.oncf_app.enums.Role;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponseDTO {
    private String token;
    private Long id;
    private String username;
    private String nom;
    private String prenom;
    private Role role;
}
