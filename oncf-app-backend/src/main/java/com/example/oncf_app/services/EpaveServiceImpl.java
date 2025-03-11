package com.example.oncf_app.services;


import com.example.oncf_app.dtos.EpaveDTO;
import com.example.oncf_app.entities.Controleur;
import com.example.oncf_app.entities.Employee;
import com.example.oncf_app.entities.Epave;
import com.example.oncf_app.exceptions.ApiException;
import com.example.oncf_app.mappers.EpaveMapper;
import com.example.oncf_app.repositories.ControleurRepository;
import com.example.oncf_app.repositories.EmployeeRepository;
import com.example.oncf_app.repositories.EpaveRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class EpaveServiceImpl implements EpaveService {

    private final EpaveRepository epaveRepository;
    private final EmployeeRepository employeeRepository;
    private final ControleurRepository controleurRepository;
    private final EpaveMapper epaveMapper;


    @Override
    public List<EpaveDTO> getAllEpaves() {
        return epaveRepository.findAll().stream()
                .map(epaveMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public EpaveDTO getEpaveById(Long id) {
        Epave epave = epaveRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Epave", id));
        return epaveMapper.toDto(epave);
    }

    @Override
    public EpaveDTO saveEpave(EpaveDTO epaveDTO) {
        Epave epave = epaveMapper.toEntity(epaveDTO);

        // Set relationships based on IDs
        setRelationships(epave, epaveDTO);

        Epave savedEpave = epaveRepository.save(epave);
        return epaveMapper.toDto(savedEpave);
    }

    @Override
    public EpaveDTO updateEpave(Long id, EpaveDTO epaveDTO) {
        Epave existingEpave = epaveRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Epave not found with id: " + id));

        epaveMapper.updateEntityFromDto(epaveDTO, existingEpave);

        // Set relationships based on IDs
        setRelationships(existingEpave, epaveDTO);

        Epave updatedEpave = epaveRepository.save(existingEpave);
        return epaveMapper.toDto(updatedEpave);
    }

    @Override
    public void deleteEpave(Long id) {
        if (!epaveRepository.existsById(id)) {
            throw ApiException.notFound("Epave", id);
        }
        epaveRepository.deleteById(id);
    }

    @Override
    public List<EpaveDTO> getEpavesByDate(LocalDate date) {
        return epaveRepository.findByDate(date).stream()
                .map(epaveMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<EpaveDTO> getEpavesByDateRange(LocalDate startDate, LocalDate endDate) {
        return epaveRepository.findByDateBetween(startDate, endDate).stream()
                .map(epaveMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<EpaveDTO> getEpavesByTrain(String train) {
        return epaveRepository.findByTrain(train).stream()
                .map(epaveMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<EpaveDTO> getEpavesByGareDepot(String gareDepot) {
        return epaveRepository.findByGareDepot(gareDepot).stream()
                .map(epaveMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<EpaveDTO> getEpavesByAgentCom(String agentComId) {
        return epaveRepository.findByAgentComId(agentComId).stream()
                .map(epaveMapper::toDto)
                .collect(Collectors.toList());
    }

    private void setRelationships(Epave epave, EpaveDTO epaveDTO) {
        if (epaveDTO.getControllerId() != null) {
            Controleur controleur = controleurRepository.findById(epaveDTO.getControllerId())
                    .orElseThrow(() -> ApiException.notFound("Controleur", epaveDTO.getControllerId()));
            epave.setControleur(controleur);
        }

        if (epaveDTO.getAgentComId() != null) {
            Employee agentCom = employeeRepository.findById(epaveDTO.getAgentComId())
                    .orElseThrow(() -> ApiException.notFound("Agent COM", epaveDTO.getAgentComId()));
            epave.setAgentCom(agentCom);
        }
    }

    @Override
    public List<EpaveDTO> getEpavesByControleur(String controleurId) {
        return epaveRepository.findByControleurId(controleurId).stream()
                .map(epaveMapper::toDto)
                .collect(Collectors.toList());
    }
}