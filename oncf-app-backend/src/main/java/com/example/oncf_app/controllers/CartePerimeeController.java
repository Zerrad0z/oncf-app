package com.example.oncf_app.controllers;


import com.example.oncf_app.dtos.CartePerimeeDTO;
import com.example.oncf_app.services.CartePerimeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/carte-perimees")
public class CartePerimeeController {

    private final CartePerimeeService cartePerimeeService;


    @GetMapping
    public ResponseEntity<List<CartePerimeeDTO>> getAllCartePerimees() {
        return ResponseEntity.ok(cartePerimeeService.getAllCartePerimees());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CartePerimeeDTO> getCartePerimeeById(@PathVariable Long id) {
        return ResponseEntity.ok(cartePerimeeService.getCartePerimeeById(id));
    }

    @PostMapping
    public ResponseEntity<CartePerimeeDTO> createCartePerimee(@RequestBody CartePerimeeDTO cartePerimeeDTO) {
        return new ResponseEntity<>(cartePerimeeService.saveCartePerimee(cartePerimeeDTO), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CartePerimeeDTO> updateCartePerimee(
            @PathVariable Long id,
            @RequestBody CartePerimeeDTO cartePerimeeDTO) {
        return ResponseEntity.ok(cartePerimeeService.updateCartePerimee(id, cartePerimeeDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCartePerimee(@PathVariable Long id) {
        cartePerimeeService.deleteCartePerimee(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/date/{date}")
    public ResponseEntity<List<CartePerimeeDTO>> getCartePerimeesByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(cartePerimeeService.getCartePerimeesByDate(date));
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<CartePerimeeDTO>> getCartePerimeesByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(cartePerimeeService.getCartePerimeesByDateRange(startDate, endDate));
    }

    @GetMapping("/train/{train}")
    public ResponseEntity<List<CartePerimeeDTO>> getCartePerimeesByTrain(@PathVariable String train) {
        return ResponseEntity.ok(cartePerimeeService.getCartePerimeesByTrain(train));
    }

    @GetMapping("/num-carte/{numCarte}")
    public ResponseEntity<List<CartePerimeeDTO>> getCartePerimeesByNumCarte(@PathVariable String numCarte) {
        return ResponseEntity.ok(cartePerimeeService.getCartePerimeesByNumCarte(numCarte));
    }

    @GetMapping("/gare-d/{gareD}")
    public ResponseEntity<List<CartePerimeeDTO>> getCartePerimeesByGareD(@PathVariable String gareD) {
        return ResponseEntity.ok(cartePerimeeService.getCartePerimeesByGareD(gareD));
    }

    @GetMapping("/gare-a/{gareA}")
    public ResponseEntity<List<CartePerimeeDTO>> getCartePerimeesByGareA(@PathVariable String gareA) {
        return ResponseEntity.ok(cartePerimeeService.getCartePerimeesByGareA(gareA));
    }

    @GetMapping("/confort/{confort}")
    public ResponseEntity<List<CartePerimeeDTO>> getCartePerimeesByConfort(@PathVariable Integer confort) {
        return ResponseEntity.ok(cartePerimeeService.getCartePerimeesByConfort(confort));
    }

    @GetMapping("/controller/{controllerId}")
    public ResponseEntity<List<CartePerimeeDTO>> getCartePerimeesByController(@PathVariable Long controllerId) {
        return ResponseEntity.ok(cartePerimeeService.getCartePerimeesByController(controllerId));
    }

    @GetMapping("/agent-com/{agentComId}")
    public ResponseEntity<List<CartePerimeeDTO>> getCartePerimeesByAgentCom(@PathVariable Long agentComId) {
        return ResponseEntity.ok(cartePerimeeService.getCartePerimeesByAgentCom(agentComId));
    }

    @GetMapping("/expired")
    public ResponseEntity<List<CartePerimeeDTO>> getExpiredCartes(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate currentDate) {
        if (currentDate == null) {
            currentDate = LocalDate.now();
        }
        return ResponseEntity.ok(cartePerimeeService.getExpiredCartes(currentDate));
    }
}