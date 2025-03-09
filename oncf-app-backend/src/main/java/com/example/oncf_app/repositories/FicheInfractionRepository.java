package com.example.oncf_app.repositories;

import com.example.oncf_app.entities.FicheInfraction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface FicheInfractionRepository extends JpaRepository<FicheInfraction, Long> {
    List<FicheInfraction> findByDate(LocalDate date);
    List<FicheInfraction> findByTrain(String train);
    List<FicheInfraction> findByGareDepot(String gareDepot);
    List<FicheInfraction> findByGareD(String gareD);
    List<FicheInfraction> findByGareA(String gareA);
    List<FicheInfraction> findByControleurId(Long controleurId);
    List<FicheInfraction> findByAgentComId(Long agentComId);

    @Query("SELECT f FROM FicheInfraction f WHERE f.date BETWEEN :startDate AND :endDate")
    List<FicheInfraction> findByDateBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT f FROM FicheInfraction f WHERE f.montant >= :minAmount")
    List<FicheInfraction> findByMontantGreaterThanEqual(@Param("minAmount") Double minAmount);
}