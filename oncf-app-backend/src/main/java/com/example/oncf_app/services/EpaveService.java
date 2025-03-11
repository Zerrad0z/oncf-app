package com.example.oncf_app.services;

import com.example.oncf_app.dtos.EpaveDTO;
import java.time.LocalDate;
import java.util.List;

public interface EpaveService {
    List<EpaveDTO> getAllEpaves();
    EpaveDTO getEpaveById(Long id);
    EpaveDTO saveEpave(EpaveDTO epaveDTO);
    EpaveDTO updateEpave(Long id, EpaveDTO epaveDTO);
    void deleteEpave(Long id);
    List<EpaveDTO> getEpavesByDate(LocalDate date);
    List<EpaveDTO> getEpavesByDateRange(LocalDate startDate, LocalDate endDate);
    List<EpaveDTO> getEpavesByTrain(String train);
    List<EpaveDTO> getEpavesByGareDepot(String gareDepot);
    List<EpaveDTO> getEpavesByAgentCom(String agentComId);
    List<EpaveDTO> getEpavesByControleur(String controleurId);
}