package com.example.oncf_app.services;


import com.example.oncf_app.dtos.FicheInfractionDTO;
import com.example.oncf_app.entities.Controleur;
import com.example.oncf_app.entities.Employee;
import com.example.oncf_app.entities.FicheInfraction;
import com.example.oncf_app.exceptions.ApiException;
import com.example.oncf_app.mappers.FicheInfractionMapper;
import com.example.oncf_app.repositories.ControleurRepository;
import com.example.oncf_app.repositories.EmployeeRepository;
import com.example.oncf_app.repositories.FicheInfractionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class FicheInfractionServiceImpl implements FicheInfractionService {

    private final FicheInfractionRepository ficheInfractionRepository;
    private final ControleurRepository controleurRepository;
    private final EmployeeRepository employeeRepository;
    private final FicheInfractionMapper ficheInfractionMapper;


    @Override
    public List<FicheInfractionDTO> getAllFicheInfractions() {
        return ficheInfractionRepository.findAll().stream()
                .map(ficheInfractionMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public FicheInfractionDTO getFicheInfractionById(Long id) {
        FicheInfraction ficheInfraction = ficheInfractionRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Fiche d'infraction", id));
        return ficheInfractionMapper.toDto(ficheInfraction);
    }

    @Override
    public FicheInfractionDTO saveFicheInfraction(FicheInfractionDTO ficheInfractionDTO) {
        FicheInfraction ficheInfraction = ficheInfractionMapper.toEntity(ficheInfractionDTO);

        // Set relationships based on IDs
        setRelationships(ficheInfraction, ficheInfractionDTO);

        FicheInfraction savedFicheInfraction = ficheInfractionRepository.save(ficheInfraction);
        return ficheInfractionMapper.toDto(savedFicheInfraction);
    }

    @Override
    public FicheInfractionDTO updateFicheInfraction(Long id, FicheInfractionDTO ficheInfractionDTO) {
        FicheInfraction existingFicheInfraction = ficheInfractionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Fiche d'infraction not found with id: " + id));

        ficheInfractionMapper.updateEntityFromDto(ficheInfractionDTO, existingFicheInfraction);

        // Set relationships based on IDs
        setRelationships(existingFicheInfraction, ficheInfractionDTO);

        FicheInfraction updatedFicheInfraction = ficheInfractionRepository.save(existingFicheInfraction);
        return ficheInfractionMapper.toDto(updatedFicheInfraction);
    }

    @Override
    public void deleteFicheInfraction(Long id) {
        if (!ficheInfractionRepository.existsById(id)) {
            throw ApiException.notFound("Fiche d'infraction", id);
        }
        ficheInfractionRepository.deleteById(id);
    }

    @Override
    public List<FicheInfractionDTO> getFicheInfractionsByDate(LocalDate date) {
        return ficheInfractionRepository.findByDate(date).stream()
                .map(ficheInfractionMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<FicheInfractionDTO> getFicheInfractionsByDateRange(LocalDate startDate, LocalDate endDate) {
        return ficheInfractionRepository.findByDateBetween(startDate, endDate).stream()
                .map(ficheInfractionMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<FicheInfractionDTO> getFicheInfractionsByTrain(String train) {
        return ficheInfractionRepository.findByTrain(train).stream()
                .map(ficheInfractionMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<FicheInfractionDTO> getFicheInfractionsByGareDepot(String gareDepot) {
        return ficheInfractionRepository.findByGareDepot(gareDepot).stream()
                .map(ficheInfractionMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<FicheInfractionDTO> getFicheInfractionsByGareD(String gareD) {
        return ficheInfractionRepository.findByGareD(gareD).stream()
                .map(ficheInfractionMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<FicheInfractionDTO> getFicheInfractionsByGareA(String gareA) {
        return ficheInfractionRepository.findByGareA(gareA).stream()
                .map(ficheInfractionMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<FicheInfractionDTO> getFicheInfractionsByAgentCom(Long agentComId) {
        return ficheInfractionRepository.findByAgentComId(agentComId).stream()
                .map(ficheInfractionMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<FicheInfractionDTO> getFicheInfractionsByMinAmount(Double minAmount) {
        return ficheInfractionRepository.findByMontantGreaterThanEqual(minAmount).stream()
                .map(ficheInfractionMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public void setRelationships(FicheInfraction ficheInfraction, FicheInfractionDTO ficheInfractionDTO) {
        if (ficheInfractionDTO.getControllerId() != null) {
            Controleur controleur = controleurRepository.findById(ficheInfractionDTO.getControllerId())
                    .orElseThrow(() -> ApiException.notFound("Controleur", ficheInfractionDTO.getControllerId()));
            ficheInfraction.setControleur(controleur);
        }

        if (ficheInfractionDTO.getAgentComId() != null) {
            Employee agentCom = employeeRepository.findById(ficheInfractionDTO.getAgentComId())
                    .orElseThrow(() -> ApiException.notFound("Agent COM", ficheInfractionDTO.getAgentComId()));
            ficheInfraction.setAgentCom(agentCom);
        }
    }

    @Override
    public List<FicheInfractionDTO> getFicheInfractionsByController(Long controleurId) {
        return ficheInfractionRepository.findByControleurId(controleurId).stream()
                .map(ficheInfractionMapper::toDto)
                .collect(Collectors.toList());
    }
}