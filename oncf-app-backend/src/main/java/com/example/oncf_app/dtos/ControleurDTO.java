package com.example.oncf_app.dtos;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ControleurDTO {
    private Long id;
    private String nom;
    private String prenom;
    private Long antenneId;
    private String antenneName;
}