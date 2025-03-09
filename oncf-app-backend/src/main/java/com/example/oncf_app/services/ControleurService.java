package com.example.oncf_app.services;

import com.example.oncf_app.dtos.ControleurDTO;
import java.util.List;

public interface ControleurService {
    List<ControleurDTO> getAllControleurs();
    ControleurDTO getControleurById(Long id);
    ControleurDTO saveControleur(ControleurDTO controleurDTO);
    ControleurDTO updateControleur(Long id, ControleurDTO controleurDTO);
    void deleteControleur(Long id);
    List<ControleurDTO> getControleursByAntenne(Long antenneId);
    List<ControleurDTO> searchControleursByName(String searchTerm, Long antenneId);

    // Methods for related items
    List<Object> getControleurEpaves(Long controllerId);
    List<Object> getControleurCartes(Long controllerId);
    List<Object> getControleurFiches(Long controllerId);
}