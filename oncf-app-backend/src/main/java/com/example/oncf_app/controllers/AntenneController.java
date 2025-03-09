package com.example.oncf_app.controllers;

import com.example.oncf_app.entities.Antenne;
import com.example.oncf_app.services.AntenneService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/antennes")
public class AntenneController {

    private final AntenneService antenneService;

    @GetMapping
    public ResponseEntity<List<Antenne>> getAllAntennes() {
        return ResponseEntity.ok(antenneService.getAllAntennes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Antenne> getAntenneById(@PathVariable Long id) {
        return ResponseEntity.ok(antenneService.getAntenneById(id));
    }

    @PostMapping
    public ResponseEntity<Antenne> createAntenne(@RequestBody Antenne antenne) {
        return new ResponseEntity<>(antenneService.saveAntenne(antenne), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Antenne> updateAntenne(@PathVariable Long id, @RequestBody Antenne antenne) {
        return ResponseEntity.ok(antenneService.updateAntenne(id, antenne));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAntenne(@PathVariable Long id) {
        antenneService.deleteAntenne(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/nom/{nom}")
    public ResponseEntity<Antenne> getAntenneByNom(@PathVariable String nom) {
        return ResponseEntity.ok(antenneService.getAntenneByNom(nom));
    }
}