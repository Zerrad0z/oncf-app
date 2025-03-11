package com.example.oncf_app.repositories;

import com.example.oncf_app.entities.Epave;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EpaveRepository extends JpaRepository<Epave, Long> {
    List<Epave> findByDate(LocalDate date);
    List<Epave> findByTrain(String train);
    List<Epave> findByGareDepot(String gareDepot);
    List<Epave> findByControleurId(String controleurId);
    List<Epave> findByAgentComId(String agentComId);
    @Query("SELECT e FROM Epave e WHERE e.date BETWEEN :startDate AND :endDate")
    List<Epave> findByDateBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}