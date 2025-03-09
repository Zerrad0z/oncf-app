package com.example.oncf_app.services;

import com.example.oncf_app.dtos.ControleurDTO;
import com.example.oncf_app.entities.Controleur;
import com.example.oncf_app.exceptions.ApiException;
import com.example.oncf_app.mappers.ControleurMapper;
import com.example.oncf_app.repositories.ControleurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ControleurServiceImpl implements ControleurService {

    private final ControleurRepository controleurRepository;
    private final ControleurMapper controleurMapper;

    @Override
    public List<ControleurDTO> getAllControleurs() {
        return controleurRepository.findAll().stream()
                .map(controleurMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public ControleurDTO getControleurById(Long id) {
        Controleur controleur = controleurRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Controleur", id));
        return controleurMapper.toDto(controleur);
    }

    @Override
    public List<ControleurDTO> getControleursByAntenne(Long antenneId) {
        return controleurRepository.findByAntenneId(antenneId).stream()
                .map(controleurMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<ControleurDTO> searchControleursByName(String searchTerm, Long antenneId) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return getControleursByAntenne(antenneId);
        }

        String searchTermLower = searchTerm.toLowerCase();
        return controleurRepository.findByAntenneId(antenneId).stream()
                .filter(controleur ->
                        controleur.getNom().toLowerCase().contains(searchTermLower) ||
                                controleur.getPrenom().toLowerCase().contains(searchTermLower))
                .map(controleurMapper::toDto)
                .collect(Collectors.toList());
    }
}