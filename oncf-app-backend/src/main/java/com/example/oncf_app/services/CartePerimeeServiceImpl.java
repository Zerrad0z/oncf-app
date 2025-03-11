package com.example.oncf_app.services;

import com.example.oncf_app.dtos.CartePerimeeDTO;
import com.example.oncf_app.entities.CartePerimee;
import com.example.oncf_app.entities.Controleur;
import com.example.oncf_app.entities.Employee;
import com.example.oncf_app.exceptions.ApiException;
import com.example.oncf_app.mappers.CartePerimeeMapper;
import com.example.oncf_app.repositories.CartePerimeeRepository;
import com.example.oncf_app.repositories.ControleurRepository;
import com.example.oncf_app.repositories.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CartePerimeeServiceImpl implements CartePerimeeService {

    private final CartePerimeeRepository cartePerimeeRepository;
    private final ControleurRepository controleurRepository;
    private final EmployeeRepository employeeRepository;
    private final CartePerimeeMapper cartePerimeeMapper;


    @Override
    public List<CartePerimeeDTO> getAllCartePerimees() {
        return cartePerimeeRepository.findAll().stream()
                .map(cartePerimeeMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public CartePerimeeDTO getCartePerimeeById(Long id) {
        CartePerimee cartePerimee = cartePerimeeRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Carte perimee", id));
        return cartePerimeeMapper.toDto(cartePerimee);
    }

    @Override
    public CartePerimeeDTO saveCartePerimee(CartePerimeeDTO cartePerimeeDTO) {
        CartePerimee cartePerimee = cartePerimeeMapper.toEntity(cartePerimeeDTO);

        // Set relationships based on IDs
        setRelationships(cartePerimee, cartePerimeeDTO);

        CartePerimee savedCartePerimee = cartePerimeeRepository.save(cartePerimee);
        return cartePerimeeMapper.toDto(savedCartePerimee);
    }

    @Override
    public CartePerimeeDTO updateCartePerimee(Long id, CartePerimeeDTO cartePerimeeDTO) {
        CartePerimee existingCartePerimee = cartePerimeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Carte perimee not found with id: " + id));

        cartePerimeeMapper.updateEntityFromDto(cartePerimeeDTO, existingCartePerimee);

        // Set relationships based on IDs
        setRelationships(existingCartePerimee, cartePerimeeDTO);

        CartePerimee updatedCartePerimee = cartePerimeeRepository.save(existingCartePerimee);
        return cartePerimeeMapper.toDto(updatedCartePerimee);
    }

    @Override
    public void deleteCartePerimee(Long id) {
        if (!cartePerimeeRepository.existsById(id)) {
            throw ApiException.notFound("Carte perimee", id);
        }
        cartePerimeeRepository.deleteById(id);
    }

    @Override
    public List<CartePerimeeDTO> getCartePerimeesByDate(LocalDate date) {
        return cartePerimeeRepository.findByDate(date).stream()
                .map(cartePerimeeMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<CartePerimeeDTO> getCartePerimeesByDateRange(LocalDate startDate, LocalDate endDate) {
        return cartePerimeeRepository.findByDateBetween(startDate, endDate).stream()
                .map(cartePerimeeMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<CartePerimeeDTO> getCartePerimeesByTrain(String train) {
        return cartePerimeeRepository.findByTrain(train).stream()
                .map(cartePerimeeMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<CartePerimeeDTO> getCartePerimeesByNumCarte(String numCarte) {
        return cartePerimeeRepository.findByNumCarte(numCarte).stream()
                .map(cartePerimeeMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<CartePerimeeDTO> getCartePerimeesByGareD(String gareD) {
        return cartePerimeeRepository.findByGareD(gareD).stream()
                .map(cartePerimeeMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<CartePerimeeDTO> getCartePerimeesByGareA(String gareA) {
        return cartePerimeeRepository.findByGareA(gareA).stream()
                .map(cartePerimeeMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<CartePerimeeDTO> getCartePerimeesByConfort(Integer confort) {
        return cartePerimeeRepository.findByConfort(confort).stream()
                .map(cartePerimeeMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<CartePerimeeDTO> getCartePerimeesByAgentCom(String agentComId) {
        return cartePerimeeRepository.findByAgentComId(agentComId).stream()
                .map(cartePerimeeMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<CartePerimeeDTO> getExpiredCartes(LocalDate currentDate) {
        return cartePerimeeRepository.findExpiredCards(currentDate).stream()
                .map(cartePerimeeMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public void setRelationships(CartePerimee cartePerimee, CartePerimeeDTO cartePerimeeDTO) {
        if (cartePerimeeDTO.getControllerId() != null) {
            Controleur controleur = controleurRepository.findById(cartePerimeeDTO.getControllerId())
                    .orElseThrow(() -> ApiException.notFound("Controleur", cartePerimeeDTO.getControllerId()));
            cartePerimee.setControleur(controleur);
        }

        if (cartePerimeeDTO.getAgentComId() != null) {
            Employee agentCom = employeeRepository.findById(cartePerimeeDTO.getAgentComId())
                    .orElseThrow(() -> ApiException.notFound("Agent COM", cartePerimeeDTO.getAgentComId()));
            cartePerimee.setAgentCom(agentCom);
        }
    }

    @Override
    public List<CartePerimeeDTO> getCartePerimeesByController(String controllerId) {
        return cartePerimeeRepository.findByControleurId(controllerId).stream()
                .map(cartePerimeeMapper::toDto)
                .collect(Collectors.toList());
    }
}