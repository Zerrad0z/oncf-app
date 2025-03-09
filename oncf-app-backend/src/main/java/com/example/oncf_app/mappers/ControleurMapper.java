package com.example.oncf_app.mappers;

import com.example.oncf_app.dtos.ControleurDTO;
import com.example.oncf_app.entities.Controleur;
import org.springframework.stereotype.Component;

@Component
public class ControleurMapper {

    public ControleurDTO toDto(Controleur controleur) {
        if (controleur == null) {
            return null;
        }

        ControleurDTO dto = new ControleurDTO();
        dto.setId(controleur.getId());
        dto.setNom(controleur.getNom());
        dto.setPrenom(controleur.getPrenom());

        if (controleur.getAntenne() != null) {
            dto.setAntenneId(controleur.getAntenne().getId());
            dto.setAntenneName(controleur.getAntenne().getNom());
        }

        return dto;
    }

    public Controleur toEntity(ControleurDTO dto) {
        if (dto == null) {
            return null;
        }

        Controleur controleur = new Controleur();
        controleur.setId(dto.getId());
        controleur.setNom(dto.getNom());
        controleur.setPrenom(dto.getPrenom());

        return controleur;
    }
}