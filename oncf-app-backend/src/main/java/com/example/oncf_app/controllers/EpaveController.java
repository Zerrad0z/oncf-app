package com.example.oncf_app.controllers;


import com.example.oncf_app.dtos.EpaveDTO;
import com.example.oncf_app.services.EpaveService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/epaves")
public class EpaveController {

    private final EpaveService epaveService;


    @GetMapping
    public ResponseEntity<List<EpaveDTO>> getAllEpaves() {
        return ResponseEntity.ok(epaveService.getAllEpaves());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EpaveDTO> getEpaveById(@PathVariable Long id) {
        return ResponseEntity.ok(epaveService.getEpaveById(id));
    }

    @PostMapping
    public ResponseEntity<EpaveDTO> createEpave(@RequestBody EpaveDTO epaveDTO) {
        return new ResponseEntity<>(epaveService.saveEpave(epaveDTO), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EpaveDTO> updateEpave(@PathVariable Long id, @RequestBody EpaveDTO epaveDTO) {
        return ResponseEntity.ok(epaveService.updateEpave(id, epaveDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEpave(@PathVariable Long id) {
        epaveService.deleteEpave(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/date/{date}")
    public ResponseEntity<List<EpaveDTO>> getEpavesByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(epaveService.getEpavesByDate(date));
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<EpaveDTO>> getEpavesByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(epaveService.getEpavesByDateRange(startDate, endDate));
    }

    @GetMapping("/train/{train}")
    public ResponseEntity<List<EpaveDTO>> getEpavesByTrain(@PathVariable String train) {
        return ResponseEntity.ok(epaveService.getEpavesByTrain(train));
    }

    @GetMapping("/gare-depot/{gareDepot}")
    public ResponseEntity<List<EpaveDTO>> getEpavesByGareDepot(@PathVariable String gareDepot) {
        return ResponseEntity.ok(epaveService.getEpavesByGareDepot(gareDepot));
    }

    @GetMapping("/controller/{controllerId}")
    public ResponseEntity<List<EpaveDTO>> getEpavesByController(@PathVariable String controllerId) {
        return ResponseEntity.ok(epaveService.getEpavesByControleur(controllerId));
    }

    @GetMapping("/agent-com/{agentComId}")
    public ResponseEntity<List<EpaveDTO>> getEpavesByAgentCom(@PathVariable String agentComId) {
        return ResponseEntity.ok(epaveService.getEpavesByAgentCom(agentComId));
    }
}