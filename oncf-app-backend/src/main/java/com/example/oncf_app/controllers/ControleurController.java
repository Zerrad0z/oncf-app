package com.example.oncf_app.controllers;

import com.example.oncf_app.dtos.ControleurDTO;
import com.example.oncf_app.services.ControleurService;
import lombok.RequiredArgsConstructor;
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
    public ResponseEntity<ControleurDTO> getControleurById(@PathVariable Long id) {
        return ResponseEntity.ok(controleurService.getControleurById(id));
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
}