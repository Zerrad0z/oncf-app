package com.example.oncf_app.repositories;

import com.example.oncf_app.entities.Controleur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ControleurRepository extends JpaRepository<Controleur, Long> {
    List<Controleur> findByAntenneId(Long antenneId);
}