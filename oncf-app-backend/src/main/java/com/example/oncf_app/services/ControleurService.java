package com.example.oncf_app.services;

import com.example.oncf_app.dtos.ControleurDTO;
import java.util.List;

public interface ControleurService {
    List<ControleurDTO> getAllControleurs();
    ControleurDTO getControleurById(Long id);
    List<ControleurDTO> getControleursByAntenne(Long antenneId);
    List<ControleurDTO> searchControleursByName(String searchTerm, Long antenneId);
}