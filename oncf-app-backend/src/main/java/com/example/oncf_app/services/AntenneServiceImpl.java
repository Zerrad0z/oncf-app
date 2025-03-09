package com.example.oncf_app.services;

import com.example.oncf_app.entities.Antenne;
import com.example.oncf_app.repositories.AntenneRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AntenneServiceImpl implements AntenneService {

    private final AntenneRepository antenneRepository;

    @Autowired
    public AntenneServiceImpl(AntenneRepository antenneRepository) {
        this.antenneRepository = antenneRepository;
    }

    @Override
    public List<Antenne> getAllAntennes() {
        return antenneRepository.findAll();
    }

    @Override
    public Antenne getAntenneById(Long id) {
        return antenneRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Antenne not found with id: " + id));
    }

    @Override
    public Antenne saveAntenne(Antenne antenne) {
        return antenneRepository.save(antenne);
    }

    @Override
    public Antenne updateAntenne(Long id, Antenne antenne) {
        if (!antenneRepository.existsById(id)) {
            throw new RuntimeException("Antenne not found with id: " + id);
        }

        antenne.setId(id);
        return antenneRepository.save(antenne);
    }

    @Override
    public void deleteAntenne(Long id) {
        if (!antenneRepository.existsById(id)) {
            throw new RuntimeException("Antenne not found with id: " + id);
        }
        antenneRepository.deleteById(id);
    }

    @Override
    public Antenne getAntenneByNom(String nom) {
        return antenneRepository.findByNom(nom);
    }
}