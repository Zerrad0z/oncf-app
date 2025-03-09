package com.example.oncf_app.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ControleurDTO {
    private Long id;
    private String nom;
    private String prenom;
    private Long antenneId;
    private String antenneName;
}