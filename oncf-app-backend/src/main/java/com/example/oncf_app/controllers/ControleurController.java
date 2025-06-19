package com.example.oncf_app.controllers;

import com.example.oncf_app.dtos.ControleurDTO;
import com.example.oncf_app.services.ControleurService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/controleurs")
public class ControleurController {

    private final ControleurService controleurService;

    @GetMapping
    public ResponseEntity<List<ControleurDTO>> getAllControleurs() {
        return ResponseEntity.ok(controleurService.getAllControleurs());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ControleurDTO> getControleurById(@PathVariable String id) {
        return ResponseEntity.ok(controleurService.getControleurById(id));
    }

    @PostMapping
    public ResponseEntity<ControleurDTO> createControleur(@RequestBody ControleurDTO controleurDTO) {
        return new ResponseEntity<>(controleurService.saveControleur(controleurDTO), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ControleurDTO> updateControleur(@PathVariable String id, @RequestBody ControleurDTO controleurDTO) {
        return ResponseEntity.ok(controleurService.updateControleur(id, controleurDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteControleur(@PathVariable String id) {
        controleurService.deleteControleur(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/antenne/{antenneId}")
    public ResponseEntity<List<ControleurDTO>> getControleursByAntenne(@PathVariable Long antenneId) {
        return ResponseEntity.ok(controleurService.getControleursByAntenne(antenneId));
    }

    @GetMapping("/search")
    public ResponseEntity<List<ControleurDTO>> searchControleurs(
            @RequestParam(required = false) String query,
            @RequestParam Long antenneId) {
        return ResponseEntity.ok(controleurService.searchControleursByName(query, antenneId));
    }

    @GetMapping("/{id}/epaves")
    public ResponseEntity<List<Object>> getControleurEpaves(@PathVariable String id) {
        return ResponseEntity.ok(controleurService.getControleurEpaves(id));
    }

    @GetMapping("/{id}/cartes")
    public ResponseEntity<List<Object>> getControleurCartes(@PathVariable String id) {
        return ResponseEntity.ok(controleurService.getControleurCartes(id));
    }

    @GetMapping("/{id}/fiches")
    public ResponseEntity<List<Object>> getControleurFiches(@PathVariable String id) {
        return ResponseEntity.ok(controleurService.getControleurFiches(id));
    }
}