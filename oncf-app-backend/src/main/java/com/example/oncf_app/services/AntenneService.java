package com.example.oncf_app.services;


import com.example.oncf_app.entities.Antenne;

import java.util.List;

public interface AntenneService {
    List<Antenne> getAllAntennes();
    Antenne getAntenneById(Long id);
    Antenne saveAntenne(Antenne antenne);
    Antenne updateAntenne(Long id, Antenne antenne);
    void deleteAntenne(Long id);
    Antenne getAntenneByNom(String nom);
}