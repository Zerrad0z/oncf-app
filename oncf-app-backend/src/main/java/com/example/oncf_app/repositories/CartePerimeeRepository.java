package com.example.oncf_app.repositories;

import com.example.oncf_app.entities.CartePerimee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface CartePerimeeRepository extends JpaRepository<CartePerimee, Long> {
    List<CartePerimee> findByDate(LocalDate date);
    List<CartePerimee> findByTrain(String train);
    List<CartePerimee> findByNumCarte(String numCarte);
    List<CartePerimee> findByGareD(String gareD);
    List<CartePerimee> findByGareA(String gareA);
    List<CartePerimee> findByConfort(Integer confort);
    List<CartePerimee> findByControleurId(String controleurId);
    List<CartePerimee> findByAgentComId(String agentComId);

    @Query("SELECT c FROM CartePerimee c WHERE c.date BETWEEN :startDate AND :endDate")
    List<CartePerimee> findByDateBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT c FROM CartePerimee c WHERE c.dateFv < :currentDate")
    List<CartePerimee> findExpiredCards(@Param("currentDate") LocalDate currentDate);
}