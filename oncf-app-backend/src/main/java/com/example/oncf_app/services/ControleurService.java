package com.example.oncf_app.services;

import com.example.oncf_app.dtos.ControleurDTO;
import java.util.List;

public interface ControleurService {
    List<ControleurDTO> getAllControleurs();
    ControleurDTO getControleurById(String id);
    ControleurDTO saveControleur(ControleurDTO controleurDTO);
    ControleurDTO updateControleur(String id, ControleurDTO controleurDTO);
    void deleteControleur(String id);
    List<ControleurDTO> getControleursByAntenne(Long antenneId);
    List<ControleurDTO> searchControleursByName(String searchTerm, Long antenneId);

    // Methods for related items
    List<Object> getControleurEpaves(String controllerId);
    List<Object> getControleurCartes(String controllerId);
    List<Object> getControleurFiches(String controllerId);
}