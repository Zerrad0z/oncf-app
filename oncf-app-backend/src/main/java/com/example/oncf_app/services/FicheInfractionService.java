package com.example.oncf_app.services;


import com.example.oncf_app.dtos.FicheInfractionDTO;
import com.example.oncf_app.entities.FicheInfraction;

import java.time.LocalDate;
import java.util.List;

public interface FicheInfractionService {
    List<FicheInfractionDTO> getAllFicheInfractions();
    FicheInfractionDTO getFicheInfractionById(Long id);
    FicheInfractionDTO saveFicheInfraction(FicheInfractionDTO ficheInfractionDTO);
    FicheInfractionDTO updateFicheInfraction(Long id, FicheInfractionDTO ficheInfractionDTO);
    void deleteFicheInfraction(Long id);
    List<FicheInfractionDTO> getFicheInfractionsByDate(LocalDate date);
    List<FicheInfractionDTO> getFicheInfractionsByDateRange(LocalDate startDate, LocalDate endDate);
    List<FicheInfractionDTO> getFicheInfractionsByTrain(String train);
    List<FicheInfractionDTO> getFicheInfractionsByGareDepot(String gareDepot);
    List<FicheInfractionDTO> getFicheInfractionsByGareD(String gareD);
    List<FicheInfractionDTO> getFicheInfractionsByGareA(String gareA);

    void setRelationships(FicheInfraction ficheInfraction, FicheInfractionDTO ficheInfractionDTO);

    List<FicheInfractionDTO> getFicheInfractionsByController(Long controllerId);
    List<FicheInfractionDTO> getFicheInfractionsByAgentCom(Long agentComId);
    List<FicheInfractionDTO> getFicheInfractionsByMinAmount(Double minAmount);
}