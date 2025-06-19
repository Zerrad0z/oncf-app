package com.example.oncf_app.services;

import com.example.oncf_app.dtos.ControleurDTO;
import com.example.oncf_app.entities.Antenne;
import com.example.oncf_app.entities.Controleur;
import com.example.oncf_app.exceptions.ApiException;
import com.example.oncf_app.mappers.ControleurMapper;
import com.example.oncf_app.repositories.AntenneRepository;
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
    private final AntenneRepository antenneRepository;
    private final ControleurMapper controleurMapper;

    @Override
    public List<ControleurDTO> getAllControleurs() {
        return controleurRepository.findAll().stream()
                .map(controleurMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public ControleurDTO getControleurById(String id) {
        Controleur controleur = controleurRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Controleur", id));
        return controleurMapper.toDto(controleur);
    }

    @Override
    public ControleurDTO saveControleur(ControleurDTO controleurDTO) {
        // Check if controleur already exists
        if (controleurRepository.existsById(controleurDTO.getId())) {
            throw new RuntimeException("Un contrôleur avec cet identifiant existe déjà.");
        }

        Controleur controleur = controleurMapper.toEntity(controleurDTO);

        // Set antenne relationship
        if (controleurDTO.getAntenneId() != null) {
            Antenne antenne = antenneRepository.findById(controleurDTO.getAntenneId())
                    .orElseThrow(() -> ApiException.notFound("Antenne", controleurDTO.getAntenneId()));
            controleur.setAntenne(antenne);
        }

        Controleur savedControleur = controleurRepository.save(controleur);
        return controleurMapper.toDto(savedControleur);
    }

    @Override
    public ControleurDTO updateControleur(String id, ControleurDTO controleurDTO) {
        Controleur existingControleur = controleurRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Controleur", id));

        existingControleur.setNom(controleurDTO.getNom());
        existingControleur.setPrenom(controleurDTO.getPrenom());

        if (controleurDTO.getAntenneId() != null) {
            Antenne antenne = antenneRepository.findById(controleurDTO.getAntenneId())
                    .orElseThrow(() -> ApiException.notFound("Antenne", controleurDTO.getAntenneId()));
            existingControleur.setAntenne(antenne);
        }

        Controleur updatedControleur = controleurRepository.save(existingControleur);
        return controleurMapper.toDto(updatedControleur);
    }

    @Override
    public void deleteControleur(String id) {
        if (!controleurRepository.existsById(id)) {
            throw ApiException.notFound("Controleur", id);
        }
        controleurRepository.deleteById(id);
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

    @Override
    public List<Object> getControleurEpaves(String controllerId) {
        // Verify controleur exists
        Controleur controleur = controleurRepository.findById(controllerId)
                .orElseThrow(() -> ApiException.notFound("Controleur", controllerId));

        // Return epaves associated with this controleur
        return controleur.getEpaves().stream()
                .map(epave -> (Object) epave)
                .collect(Collectors.toList());
    }

    @Override
    public List<Object> getControleurCartes(String controllerId) {
        Controleur controleur = controleurRepository.findById(controllerId)
                .orElseThrow(() -> ApiException.notFound("Controleur", controllerId));

        return controleur.getCartePerimees().stream()
                .map(carte -> (Object) carte)
                .collect(Collectors.toList());
    }

    @Override
    public List<Object> getControleurFiches(String controllerId) {
        Controleur controleur = controleurRepository.findById(controllerId)
                .orElseThrow(() -> ApiException.notFound("Controleur", controllerId));

        return controleur.getFicheInfractions().stream()
                .map(fiche -> (Object) fiche)
                .collect(Collectors.toList());
    }
}