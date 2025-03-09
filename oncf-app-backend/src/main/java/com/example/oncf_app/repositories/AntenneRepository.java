package com.example.oncf_app.repositories;

import com.example.oncf_app.entities.Antenne;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AntenneRepository extends JpaRepository<Antenne, Long> {
    Antenne findByNom(String nom);
}