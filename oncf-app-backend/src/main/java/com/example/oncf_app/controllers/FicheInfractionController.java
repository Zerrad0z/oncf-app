package com.example.oncf_app.controllers;


import com.example.oncf_app.dtos.FicheInfractionDTO;
import com.example.oncf_app.services.FicheInfractionService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/fiche-infractions")
public class FicheInfractionController {

    private final FicheInfractionService ficheInfractionService;


    @GetMapping
    public ResponseEntity<List<FicheInfractionDTO>> getAllFicheInfractions() {
        return ResponseEntity.ok(ficheInfractionService.getAllFicheInfractions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FicheInfractionDTO> getFicheInfractionById(@PathVariable Long id) {
        return ResponseEntity.ok(ficheInfractionService.getFicheInfractionById(id));
    }

    @PostMapping
    public ResponseEntity<FicheInfractionDTO> createFicheInfraction(@RequestBody FicheInfractionDTO ficheInfractionDTO) {
        return new ResponseEntity<>(ficheInfractionService.saveFicheInfraction(ficheInfractionDTO), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<FicheInfractionDTO> updateFicheInfraction(
            @PathVariable Long id,
            @RequestBody FicheInfractionDTO ficheInfractionDTO) {
        return ResponseEntity.ok(ficheInfractionService.updateFicheInfraction(id, ficheInfractionDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFicheInfraction(@PathVariable Long id) {
        ficheInfractionService.deleteFicheInfraction(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/date/{date}")
    public ResponseEntity<List<FicheInfractionDTO>> getFicheInfractionsByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(ficheInfractionService.getFicheInfractionsByDate(date));
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<FicheInfractionDTO>> getFicheInfractionsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(ficheInfractionService.getFicheInfractionsByDateRange(startDate, endDate));
    }

    @GetMapping("/train/{train}")
    public ResponseEntity<List<FicheInfractionDTO>> getFicheInfractionsByTrain(@PathVariable String train) {
        return ResponseEntity.ok(ficheInfractionService.getFicheInfractionsByTrain(train));
    }

    @GetMapping("/gare-depot/{gareDepot}")
    public ResponseEntity<List<FicheInfractionDTO>> getFicheInfractionsByGareDepot(@PathVariable String gareDepot) {
        return ResponseEntity.ok(ficheInfractionService.getFicheInfractionsByGareDepot(gareDepot));
    }

    @GetMapping("/gare-d/{gareD}")
    public ResponseEntity<List<FicheInfractionDTO>> getFicheInfractionsByGareD(@PathVariable String gareD) {
        return ResponseEntity.ok(ficheInfractionService.getFicheInfractionsByGareD(gareD));
    }

    @GetMapping("/gare-a/{gareA}")
    public ResponseEntity<List<FicheInfractionDTO>> getFicheInfractionsByGareA(@PathVariable String gareA) {
        return ResponseEntity.ok(ficheInfractionService.getFicheInfractionsByGareA(gareA));
    }

    @GetMapping("/controller/{controllerId}")
    public ResponseEntity<List<FicheInfractionDTO>> getFicheInfractionsByController(@PathVariable Long controllerId) {
        return ResponseEntity.ok(ficheInfractionService.getFicheInfractionsByController(controllerId));
    }

    @GetMapping("/agent-com/{agentComId}")
    public ResponseEntity<List<FicheInfractionDTO>> getFicheInfractionsByAgentCom(@PathVariable Long agentComId) {
        return ResponseEntity.ok(ficheInfractionService.getFicheInfractionsByAgentCom(agentComId));
    }

    @GetMapping("/min-amount/{minAmount}")
    public ResponseEntity<List<FicheInfractionDTO>> getFicheInfractionsByMinAmount(@PathVariable Double minAmount) {
        return ResponseEntity.ok(ficheInfractionService.getFicheInfractionsByMinAmount(minAmount));
    }
}