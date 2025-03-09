package com.example.oncf_app.services;


import com.example.oncf_app.dtos.CartePerimeeDTO;
import com.example.oncf_app.entities.CartePerimee;

import java.time.LocalDate;
import java.util.List;

public interface CartePerimeeService {
    List<CartePerimeeDTO> getAllCartePerimees();
    CartePerimeeDTO getCartePerimeeById(Long id);
    CartePerimeeDTO saveCartePerimee(CartePerimeeDTO cartePerimeeDTO);
    CartePerimeeDTO updateCartePerimee(Long id, CartePerimeeDTO cartePerimeeDTO);
    void deleteCartePerimee(Long id);
    List<CartePerimeeDTO> getCartePerimeesByDate(LocalDate date);
    List<CartePerimeeDTO> getCartePerimeesByDateRange(LocalDate startDate, LocalDate endDate);
    List<CartePerimeeDTO> getCartePerimeesByTrain(String train);
    List<CartePerimeeDTO> getCartePerimeesByNumCarte(String numCarte);
    List<CartePerimeeDTO> getCartePerimeesByGareD(String gareD);
    List<CartePerimeeDTO> getCartePerimeesByGareA(String gareA);
    List<CartePerimeeDTO> getCartePerimeesByConfort(Integer confort);

    void setRelationships(CartePerimee cartePerimee, CartePerimeeDTO cartePerimeeDTO);

    List<CartePerimeeDTO> getCartePerimeesByController(Long controllerId);
    List<CartePerimeeDTO> getCartePerimeesByAgentCom(Long agentComId);
    List<CartePerimeeDTO> getExpiredCartes(LocalDate currentDate);
}